export const DEMO_WALLETS = {
  risky: {
    address: "0x2222222222222222222222222222222222222222",
    label: "Risky Wallet",
  },
  clean: {
    address: "0x1111111111111111111111111111111111111111",
    label: "Clean Wallet",
  },
} as const

export const SCORE_COLORS: Record<string, string> = {
  VERY_LOW: "text-green-400",
  LOW: "text-green-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-red-400",
  CRITICAL: "text-red-600",
  UNKNOWN: "text-gray-400",
}

export const SCORE_BG: Record<string, string> = {
  VERY_LOW: "bg-green-500/10 border-green-500/30",
  LOW: "bg-green-500/10 border-green-500/30",
  MEDIUM: "bg-yellow-500/10 border-yellow-500/30",
  HIGH: "bg-red-500/10 border-red-500/30",
  CRITICAL: "bg-red-600/10 border-red-600/30",
  UNKNOWN: "bg-gray-500/10 border-gray-500/30",
}

export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://testnet-explorer.hsk.xyz"
export const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3001"
