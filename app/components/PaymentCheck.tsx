"use client"

import { useState } from "react"
import { checkPayment, type PaymentResult } from "../lib/api"
import { DEMO_WALLETS, SCORE_COLORS } from "../lib/constants"

export default function PaymentCheck() {
  const [from, setFrom] = useState<string>(DEMO_WALLETS.risky.address)
  const [to, setTo] = useState<string>(DEMO_WALLETS.clean.address)
  const [amount, setAmount] = useState("1.0")
  const [result, setResult] = useState<PaymentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCheck() {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await checkPayment(from, to, amount)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const recColor = result
    ? result.recommendation === "block" ? "text-red-400" : result.recommendation === "flag" ? "text-yellow-400" : "text-green-400"
    : ""

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-white text-lg mb-4">Payment Risk Check</h3>
      <p className="text-sm text-gray-500 mb-4">Check risk for a payment from A to B</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">From</label>
          <input
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-dark border border-border-subtle text-white text-sm font-mono focus:border-mint/50 focus:outline-none transition-colors"
            placeholder="0x..."
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">To</label>
          <input
            value={to}
            onChange={e => setTo(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-dark border border-border-subtle text-white text-sm font-mono focus:border-mint/50 focus:outline-none transition-colors"
            placeholder="0x..."
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Amount (HSK)</label>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-dark border border-border-subtle text-white text-sm focus:border-mint/50 focus:outline-none transition-colors"
            placeholder="1.0"
          />
        </div>
      </div>
      <button
        onClick={handleCheck}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-mint text-mint-dark text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Payment Risk"}
      </button>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4 p-4 rounded-lg border border-border-subtle bg-surface-dark/50 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold uppercase ${recColor}`}>{result.recommendation}</span>
            <span className="text-xs text-gray-500">Max score: {result.payment.maxScore}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Sender:</span>
              <span className={`ml-2 font-medium ${SCORE_COLORS[result.from.level] || "text-gray-400"}`}>
                {result.from.score} ({result.from.level})
              </span>
            </div>
            <div>
              <span className="text-gray-500">Receiver:</span>
              <span className={`ml-2 font-medium ${SCORE_COLORS[result.to.level] || "text-gray-400"}`}>
                {result.to.score} ({result.to.level})
              </span>
            </div>
          </div>
          {result.flags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.flags.map((f, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
