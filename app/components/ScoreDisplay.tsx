"use client"

import { SCORE_COLORS, SCORE_BG } from "../lib/constants"

interface Props {
  score: number
  level: string
  flags: string[]
  hopDistance: number
  reasoning: string
  isCompliant: boolean
}

export default function ScoreDisplay({ score, level, flags, hopDistance, reasoning, isCompliant }: Props) {
  const color = SCORE_COLORS[level] || "text-gray-400"
  const bg = SCORE_BG[level] || "bg-gray-500/10 border-gray-500/30"

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className={`text-3xl font-display font-bold ${color}`}>{score}</span>
        <span className={`px-2 py-1 rounded-md text-xs font-bold border ${bg} ${color}`}>{level}</span>
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${isCompliant ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
          {isCompliant ? "Compliant" : "Non-Compliant"}
        </span>
      </div>
      <div className="text-sm text-gray-400">
        <span className="text-gray-500">Hop distance:</span> {hopDistance === 99 ? "None detected" : `${hopDistance} hop${hopDistance !== 1 ? "s" : ""}`}
      </div>
      {flags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {flags.map((f, i) => (
            <span key={i} className="px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              {f}
            </span>
          ))}
        </div>
      )}
      {reasoning && (
        <p className="text-xs text-gray-500 italic">{reasoning}</p>
      )}
    </div>
  )
}
