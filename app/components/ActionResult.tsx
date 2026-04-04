"use client"

import { EXPLORER_URL } from "../lib/constants"

interface Props {
  type: "success" | "blocked" | "error"
  title: string
  message: string
  txHash?: string | null
}

export default function ActionResult({ type, title, message, txHash }: Props) {
  const styles = {
    success: "border-green-500/30 bg-green-500/5",
    blocked: "border-red-500/30 bg-red-500/5",
    error: "border-yellow-500/30 bg-yellow-500/5",
  }
  const icons = {
    success: (
      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    blocked: (
      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  }

  return (
    <div className={`mt-4 p-4 rounded-lg border ${styles[type]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icons[type]}
        <span className="font-medium text-sm text-white">{title}</span>
      </div>
      <p className="text-xs text-gray-400 ml-7">{message}</p>
      {txHash && (
        <a
          href={`${EXPLORER_URL}/tx/${txHash}`}
          target="_blank"
          className="inline-flex items-center gap-1 mt-2 ml-7 text-xs text-mint hover:underline"
        >
          View on Explorer
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  )
}
