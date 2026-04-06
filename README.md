# Aegis Protocol — Demo dApp

> Interactive demo showing live AI-powered wallet risk scoring and on-chain enforcement on HashKey Chain.

**Hackathon:** HashKey Chain Horizon 2026 | **Tracks:** AI + DeFi | **Chain:** HashKey Chain Testnet (133)

[Docs](https://aegisprotocol-1.gitbook.io/aegisprotocol) | [Landing](https://aegis-protocol-hsk.vercel.app) | [API](https://aegis-api-hsk.vercel.app)

---

## Live

https://aegis-demo-hsk.vercel.app

---

## What This Demonstrates

This dApp proves the core thesis: **DeFi protocols can integrate AI-powered compliance enforcement in 2 lines of Solidity, and it works on HashKey Chain today.**

### 1. Wallet Risk Check

Two pre-seeded wallets with real on-chain scores:

| Wallet | Score | Level | Why |
|---|---|---|---|
| 0x2222...2222 | 8 | HIGH | Mixer exposure, rapid fund movement, 1 hop to malicious |
| 0x1111...1111 | 2 | LOW | No suspicious activity, 4+ hops from threats |

**Enforcement demo:**
- Risky wallet `deposit()` → **BLOCKED** ("Aegis: wallet is non-compliant", score 8 >= threshold 7)
- Risky wallet `swap()` → **PASSED** (soft check only blocks CRITICAL/score 10)
- Clean wallet `deposit()` → **PASSED** (score 2, compliant)
- Clean wallet `swap()` → **PASSED**

This shows graduated enforcement — the same contract enforces differently based on function criticality.

### 2. Payment Risk Check

Simulates a payment from wallet A to wallet B:
- Fetches both risk profiles from the backend
- Takes the max score between sender and receiver
- Returns recommendation: `block` (score >= 7), `flag` (score 4-6), or `allow` (score 1-3)

### 3. Mock & Test Wallet

Input any wallet address and assign it a custom risk score. The score is written on-chain to `AegisRiskScore.sol` and cached in Neon PostgreSQL. Then test `deposit()` and `swap()` enforcement against that score.

Presets: Clean (2), Medium (5), Risky (8), Critical (10). Or use the slider for any score 1-10.

---

## Technical Architecture

The demo does **not** call smart contracts directly. All blockchain interaction goes through the backend API:

```
Demo dApp → Backend API → HashKey Chain
   (Next.js)    (Express)     (AegisRiskScore.sol)
```

| Action | API Call |
|---|---|
| Load wallet score | `GET /v1/risk/:wallet` |
| Run AI pipeline | `POST /v1/risk/analyze` |
| Payment risk check | `POST /v1/risk/payment` |
| Mock a wallet score | `POST /v1/risk/mock` |

**Why this architecture:** Separating the frontend from direct chain interaction means any UI (mobile app, dashboard, Telegram bot) can use the same API. The demo is just one consumer of the Aegis infrastructure.

---

## Components

| Component | Purpose |
|---|---|
| `WalletCard.tsx` | Fetches profile on mount, shows score + action buttons, simulates enforcement |
| `ScoreDisplay.tsx` | Renders score badge, level, compliance status, flags, hop distance, reasoning |
| `ActionResult.tsx` | Shows success (green), blocked (red), or error result with explorer link |
| `PaymentCheck.tsx` | From/To/Amount inputs, calls payment API, shows recommendation |
| `WalletLookup.tsx` | Mock wallet with presets or custom slider, then test deposit/swap |

---

## Technical Details

- **Framework:** Next.js 15.3.9, React 19
- **Styling:** Tailwind CSS, dark theme matching landing page
- **State:** React useState/useEffect only (no external state management)
- **API client:** Native fetch, typed with TypeScript interfaces
- **Deployment:** Vercel (static export + client-side API calls)

---

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev    # port 3002
```

## Deploy

```bash
vercel --prod
```
