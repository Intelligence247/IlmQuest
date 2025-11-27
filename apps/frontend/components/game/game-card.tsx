"use client"

import { Check, BookOpen } from "lucide-react"
import { useGame, type GameCard as GameCardType } from "@/lib/game-context"

interface GameCardProps {
  card: GameCardType
}

export function GameCard({ card }: GameCardProps) {
  const { flipCard, flippedCards, currentFact } = useGame()

  const isDisabled = card.isMatched || card.isFlipped || flippedCards.length >= 2 || currentFact !== null

  const handleClick = () => {
    if (!isDisabled) {
      flipCard(card.id)
    }
  }

  return (
    <div className="perspective w-full aspect-[3/4]">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`relative w-full h-full transition-transform duration-500 touch-manipulation ${
          card.isFlipped || card.isMatched ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
        aria-label={card.isFlipped || card.isMatched ? card.content : "Hidden card"}
      >
        {/* Card Back */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl shadow-md flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 ${
            !card.isFlipped && !card.isMatched ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white/80" />
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl shadow-lg bg-white flex items-center justify-center p-3 transition-all duration-200 ${
            card.isMatched ? "ring-2 ring-brand-secondary" : ""
          } ${card.isMismatched ? "ring-2 ring-destructive animate-shake" : ""}`}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-ui-text leading-snug">{card.content}</p>
            {card.isMatched && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 rounded-full bg-brand-secondary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  )
}
