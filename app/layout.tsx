import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Aegis Protocol Demo — Live Risk Scoring",
  description: "Interactive demo showing live wallet risk checks and blocked vs allowed transactions on HashKey Chain.",
  icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
