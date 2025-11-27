"use client"

import { useEffect } from "react"
import { useGame } from "@/lib/game-context"
import { GameCard } from "@/components/game/game-card"
import type { CardPair } from "@/lib/game-data"

interface GameBoardProps {
  pairs: CardPair[]
}

export function GameBoard({ pairs }: GameBoardProps) {
  const { cards, initializeGame } = useGame()

  useEffect(() => {
    initializeGame(pairs)
  }, [pairs, initializeGame])

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-ui-muted">Loading game...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {cards.map((card) => (
        <GameCard key={card.id} card={card} />
      ))}
    </div>
  )
}
