"use client"

import { DEMO_WALLETS, LANDING_URL } from "./lib/constants"
import WalletCard from "./components/WalletCard"
import PaymentCheck from "./components/PaymentCheck"
import WalletLookup from "./components/WalletLookup"

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black">
      <nav className="border-b border-border-subtle bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Aegis" className="w-7 h-7" />
            <span className="font-display font-semibold text-white">Aegis Protocol Demo</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-mint/10 text-mint border border-mint/20">
              HashKey Chain Testnet
            </span>
          </div>
          <a
            href={LANDING_URL}
            target="_blank"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to site
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Wallet Risk Check</h2>
          <p className="text-sm text-gray-500 mb-6">Live wallet risk scoring on HashKey Chain — scores are real, written on-chain</p>
          <div className="grid md:grid-cols-2 gap-6">
            <WalletCard address={DEMO_WALLETS.risky.address} label={DEMO_WALLETS.risky.label} />
            <WalletCard address={DEMO_WALLETS.clean.address} label={DEMO_WALLETS.clean.label} />
          </div>
        </section>

        <section>
          <PaymentCheck />
        </section>

        <section>
          <WalletLookup />
        </section>
      </div>
    </main>
  )
}
