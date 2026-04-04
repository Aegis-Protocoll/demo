"use client"

import { useState } from "react"
import { fetchRiskProfile, type RiskProfile } from "../lib/api"
import ScoreDisplay from "./ScoreDisplay"

export default function WalletLookup() {
  const [wallet, setWallet] = useState("")
  const [profile, setProfile] = useState<RiskProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLookup() {
    if (!wallet || !wallet.startsWith("0x")) {
      setError("Enter a valid wallet address")
      return
    }
    setLoading(true)
    setError("")
    setProfile(null)
    try {
      const res = await fetchRiskProfile(wallet)
      setProfile(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-white text-lg mb-4">Custom Wallet Lookup</h3>
      <p className="text-sm text-gray-500 mb-4">Check the risk profile of any wallet address</p>
      <div className="flex gap-3">
        <input
          value={wallet}
          onChange={e => setWallet(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLookup()}
          className="flex-1 px-3 py-2 rounded-lg bg-surface-dark border border-border-subtle text-white text-sm font-mono focus:border-mint/50 focus:outline-none transition-colors"
          placeholder="0x..."
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-mint text-mint-dark text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Loading..." : "Check Risk"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {profile && (
        <div className="mt-4 p-4 rounded-lg border border-border-subtle bg-surface-dark/50">
          {profile.score > 0 ? (
            <ScoreDisplay
              score={profile.score}
              level={profile.level}
              flags={profile.flags}
              hopDistance={profile.hopDistance}
              reasoning={profile.reasoning}
              isCompliant={profile.isCompliant}
            />
          ) : (
            <p className="text-sm text-gray-500">No score recorded for this wallet yet</p>
          )}
        </div>
      )}
    </div>
  )
}
