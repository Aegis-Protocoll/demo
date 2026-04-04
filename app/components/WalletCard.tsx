"use client"

import { useState, useEffect } from "react"
import { fetchRiskProfile, analyzeWallet, type RiskProfile } from "../lib/api"
import ScoreDisplay from "./ScoreDisplay"
import ActionResult from "./ActionResult"

interface Props {
  address: string
  label: string
}

type ActionState = {
  type: "success" | "blocked" | "error"
  title: string
  message: string
  txHash?: string | null
} | null

export default function WalletCard({ address, label }: Props) {
  const [profile, setProfile] = useState<RiskProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [action, setAction] = useState<ActionState>(null)

  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`

  useEffect(() => {
    fetchRiskProfile(address)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [address])

  async function handleAnalyze() {
    setAnalyzing(true)
    setAction(null)
    try {
      const result = await analyzeWallet(address)
      setProfile({
        ...result,
        wallet: address,
        stale: false,
        isCompliant: result.score <= 6,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      setAction({
        type: "success",
        title: "Score Updated",
        message: `Score ${result.score} (${result.level}) written on-chain via ${result.layer}`,
        txHash: result.txHash,
      })
    } catch (err: any) {
      setAction({ type: "error", title: "Error", message: err.message })
    } finally {
      setAnalyzing(false)
    }
  }

  function simulateDeposit() {
    setAction(null)
    if (!profile || profile.score === 0) {
      setAction({ type: "error", title: "No Score", message: "Run Analyze first to score this wallet" })
      return
    }
    if (profile.score >= 7) {
      setAction({
        type: "blocked",
        title: "Reverted: deposit()",
        message: `"Aegis: wallet is non-compliant" — Score ${profile.score} >= threshold 7`,
      })
    } else {
      setAction({
        type: "success",
        title: "deposit() Passed",
        message: `Score ${profile.score} (${profile.level}) — wallet is compliant`,
        txHash: profile.txHash,
      })
    }
  }

  function simulateSwap() {
    setAction(null)
    if (!profile || profile.score === 0) {
      setAction({ type: "error", title: "No Score", message: "Run Analyze first to score this wallet" })
      return
    }
    if (profile.score === 10) {
      setAction({
        type: "blocked",
        title: "Reverted: swap()",
        message: `"Aegis: wallet is blocked" — Score 10 = CRITICAL (sanctioned)`,
      })
    } else {
      setAction({
        type: "success",
        title: "swap() Passed",
        message: `Score ${profile.score} (${profile.level}) — soft check passed (only blocks CRITICAL)`,
        txHash: profile.txHash,
      })
    }
  }

  return (
    <div className="card p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-white">{label}</h3>
          <p className="text-xs text-gray-500 font-mono mt-1">{shortAddr}</p>
        </div>
        {profile && profile.score > 0 && (
          <div className={`w-3 h-3 rounded-full animate-pulse-dot ${profile.isCompliant ? "bg-green-400" : "bg-red-400"}`} />
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-mint rounded-full animate-spin-slow" />
          Loading...
        </div>
      ) : profile && profile.score > 0 ? (
        <ScoreDisplay
          score={profile.score}
          level={profile.level}
          flags={profile.flags}
          hopDistance={profile.hopDistance}
          reasoning={profile.reasoning}
          isCompliant={profile.isCompliant}
        />
      ) : (
        <p className="text-sm text-gray-500">No score yet — click Analyze</p>
      )}

      <div className="flex flex-wrap gap-2 mt-5">
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-4 py-2 rounded-lg bg-mint text-mint-dark text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {analyzing ? "Analyzing..." : "Analyze"}
        </button>
        <button
          onClick={simulateDeposit}
          className="px-4 py-2 rounded-lg bg-surface border border-border-subtle text-white text-sm font-medium hover:border-mint/30 transition-colors"
        >
          deposit()
        </button>
        <button
          onClick={simulateSwap}
          className="px-4 py-2 rounded-lg bg-surface border border-border-subtle text-white text-sm font-medium hover:border-mint/30 transition-colors"
        >
          swap()
        </button>
      </div>

      {action && (
        <ActionResult type={action.type} title={action.title} message={action.message} txHash={action.txHash} />
      )}
    </div>
  )
}
