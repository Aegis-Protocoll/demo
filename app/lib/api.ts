import { API_BASE } from "./constants"

export interface RiskProfile {
  wallet: string
  score: number
  level: string
  flags: string[]
  reasoning: string
  hopDistance: number
  isCompliant: boolean
  txHash: string | null
  layer: string
  updatedAt: number
  stale: boolean
}

export interface PaymentResult {
  from: { wallet: string; score: number; level: string }
  to: { wallet: string; score: number; level: string }
  payment: { amount: string; risk: string; maxScore: number }
  recommendation: string
  flags: string[]
}

export interface AnalyzeResult extends RiskProfile {
  status: string
}

export async function fetchRiskProfile(wallet: string): Promise<RiskProfile> {
  const res = await fetch(`${API_BASE}/v1/risk/${wallet}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function analyzeWallet(wallet: string): Promise<AnalyzeResult> {
  const res = await fetch(`${API_BASE}/v1/risk/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export interface MockResult {
  wallet: string
  score: number
  level: string
  flags: string[]
  reasoning: string
  hopDistance: number
  txHash: string
  status: string
}

export async function mockWallet(
  wallet: string, score: number, flags: string[], reasoning: string, hopDistance: number
): Promise<MockResult> {
  const res = await fetch(`${API_BASE}/v1/risk/mock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, score, flags, reasoning, hopDistance }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function checkPayment(from: string, to: string, amount: string): Promise<PaymentResult> {
  const res = await fetch(`${API_BASE}/v1/risk/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, amount }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
