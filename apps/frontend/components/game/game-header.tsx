"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, RotateCcw, Clock } from "lucide-react"
import Link from "next/link"
import { useGame } from "@/lib/game-context"

interface GameHeaderProps {
  levelName: string
}

export function GameHeader({ levelName }: GameHeaderProps) {
  const { moves, matchedPairs, cards, resetGame, startTime } = useGame()
  const totalPairs = cards.length / 2
  const [elapsedTime, setElapsedTime] = useState("0:00")

  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return (
    <header className="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-sm border-b border-ui-border">
      <div className="px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/play"
            className="p-2 -ml-2 rounded-full hover:bg-ui-border/50 active:bg-ui-border transition-colors touch-manipulation"
            aria-label="Back to quests"
          >
            <ArrowLeft className="w-5 h-5 text-ui-text" />
          </Link>
          <h1 className="font-heading font-bold text-lg text-ui-text">{levelName}</h1>
          <button
            onClick={resetGame}
            className="p-2 -mr-2 rounded-full hover:bg-ui-border/50 active:bg-ui-border transition-colors touch-manipulation"
            aria-label="Reset game"
          >
            <RotateCcw className="w-5 h-5 text-ui-muted" />
          </button>
        </div>

        {/* Stats row - Added timer column */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-ui-border p-3">
          <div className="text-center flex-1">
            <p className="text-xs text-ui-muted font-medium">Moves</p>
            <p className="text-lg font-heading font-bold text-ui-text">{moves}</p>
          </div>
          <div className="w-px h-8 bg-ui-border" />
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-ui-muted" />
              <p className="text-xs text-ui-muted font-medium">Time</p>
            </div>
            <p className="text-lg font-heading font-bold text-ui-text">{elapsedTime}</p>
          </div>
          <div className="w-px h-8 bg-ui-border" />
          <div className="text-center flex-1">
            <p className="text-xs text-ui-muted font-medium">Matched</p>
            <p className="text-lg font-heading font-bold text-brand-primary">
              {matchedPairs.length}/{totalPairs}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
