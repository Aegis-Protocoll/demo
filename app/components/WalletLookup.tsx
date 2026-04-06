"use client"

import { useState } from "react"
import { fetchRiskProfile, mockWallet, type RiskProfile } from "../lib/api"
import ScoreDisplay from "./ScoreDisplay"
import ActionResult from "./ActionResult"

const PRESETS = [
  { label: "Clean (2)", score: 2, flags: [], reasoning: "Low risk wallet, no suspicious activity", hop: 4 },
  { label: "Medium (5)", score: 5, flags: ["clustering"], reasoning: "Moderate activity patterns detected", hop: 3 },
  { label: "Risky (8)", score: 8, flags: ["mixer_exposure", "rapid_movement"], reasoning: "Direct mixer contact, rapid fund movement", hop: 1 },
  { label: "Critical (10)", score: 10, flags: ["sanctions"], reasoning: "OFAC sanctioned address", hop: 0 },
]

type ActionState = {
  type: "success" | "blocked" | "error"
  title: string
  message: string
  txHash?: string | null
} | null

export default function WalletLookup() {
  const [wallet, setWallet] = useState("")
  const [selectedPreset, setSelectedPreset] = useState(2)
  const [customScore, setCustomScore] = useState(8)
  const [profile, setProfile] = useState<RiskProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [mocking, setMocking] = useState(false)
  const [error, setError] = useState("")
  const [action, setAction] = useState<ActionState>(null)
  const [tab, setTab] = useState<"preset" | "custom">("preset")

  async function handleMock() {
    if (!wallet || !wallet.startsWith("0x") || wallet.length < 10) {
      setError("Enter a valid wallet address")
      return
    }
    setMocking(true)
    setError("")
    setProfile(null)
    setAction(null)
    try {
      const preset = PRESETS[selectedPreset]
      const score = tab === "preset" ? preset.score : customScore
      const flags = tab === "preset" ? preset.flags : (score >= 7 ? ["manual_flag"] : [])
      const reasoning = tab === "preset" ? preset.reasoning : `Manually set score ${score}`
      const hop = tab === "preset" ? preset.hop : (score >= 7 ? 1 : 4)
      const result = await mockWallet(wallet, score, flags, reasoning, hop)
      const fetched = await fetchRiskProfile(wallet)
      setProfile(fetched)
      setAction({
        type: "success",
        title: "Score Mocked",
        message: `Score ${result.score} (${result.level}) written on-chain`,
        txHash: result.txHash,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setMocking(false)
    }
  }

  async function handleLookup() {
    if (!wallet || !wallet.startsWith("0x")) {
      setError("Enter a valid wallet address")
      return
    }
    setLoading(true)
    setError("")
    setAction(null)
    try {
      const res = await fetchRiskProfile(wallet)
      setProfile(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function simulateDeposit() {
    setAction(null)
    if (!profile || profile.score === 0) {
      setAction({ type: "error", title: "No Score", message: "Mock a score first" })
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
      setAction({ type: "error", title: "No Score", message: "Mock a score first" })
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
    <div className="card p-6">
      <h3 className="font-display font-semibold text-white text-lg mb-1">Mock & Test Wallet</h3>
      <p className="text-sm text-gray-500 mb-5">Set any wallet as risky or clean, then test on-chain enforcement</p>

      <div className="space-y-4">
        <input
          value={wallet}
          onChange={e => setWallet(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface-dark border border-border-subtle text-white text-sm font-mono focus:border-mint/50 focus:outline-none transition-colors"
          placeholder="0x... enter any wallet address"
        />

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setTab("preset")}
            className={`px-3 py-1.5 rounded-md transition-colors ${tab === "preset" ? "bg-mint/20 text-mint border border-mint/30" : "bg-surface border border-border-subtle text-gray-400 hover:text-white"}`}
          >
            Presets
          </button>
          <button
            onClick={() => setTab("custom")}
            className={`px-3 py-1.5 rounded-md transition-colors ${tab === "custom" ? "bg-mint/20 text-mint border border-mint/30" : "bg-surface border border-border-subtle text-gray-400 hover:text-white"}`}
          >
            Custom Score
          </button>
        </div>

        {tab === "preset" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedPreset(i)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  selectedPreset === i
                    ? p.score >= 7
                      ? "bg-red-500/15 border-red-500/40 text-red-400"
                      : p.score >= 4
                        ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400"
                        : "bg-green-500/15 border-green-500/40 text-green-400"
                    : "bg-surface border-border-subtle text-gray-400 hover:border-gray-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              value={customScore}
              onChange={e => setCustomScore(parseInt(e.target.value))}
              className="flex-1 accent-mint"
            />
            <span className={`text-lg font-bold font-mono w-8 text-center ${
              customScore >= 7 ? "text-red-400" : customScore >= 4 ? "text-yellow-400" : "text-green-400"
            }`}>
              {customScore}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleMock}
            disabled={mocking}
            className="px-4 py-2 rounded-lg bg-mint text-mint-dark text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {mocking ? "Writing on-chain..." : "Mock Score"}
          </button>
          <button
            onClick={handleLookup}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-surface border border-border-subtle text-white text-sm font-medium hover:border-mint/30 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Lookup"}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {profile && profile.score > 0 && (
        <div className="mt-5 p-4 rounded-lg border border-border-subtle bg-surface-dark/50">
          <ScoreDisplay
            score={profile.score}
            level={profile.level}
            flags={profile.flags}
            hopDistance={profile.hopDistance}
            reasoning={profile.reasoning}
            isCompliant={profile.isCompliant}
          />
          <div className="flex gap-2 mt-4">
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
            <div className="mt-3">
              <ActionResult type={action.type} title={action.title} message={action.message} txHash={action.txHash} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
