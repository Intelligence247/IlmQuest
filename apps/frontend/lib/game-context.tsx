"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { CardPair } from "@/lib/game-data"

export interface GameCard {
  id: string
  pairId: string
  content: string
  type: "concept" | "definition"
  isFlipped: boolean
  isMatched: boolean
  isMismatched: boolean
}

interface MatchedPair {
  pairId: string
  fact: string
}

interface GameContextType {
  cards: GameCard[]
  moves: number
  matchedPairs: MatchedPair[]
  flippedCards: string[]
  currentFact: MatchedPair | null
  isGameComplete: boolean
  startTime: number | null
  initializeGame: (pairs: CardPair[]) => void
  flipCard: (cardId: string) => void
  dismissFact: () => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<GameCard[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [currentFact, setCurrentFact] = useState<MatchedPair | null>(null)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [pairFacts, setPairFacts] = useState<Record<string, string>>({})

  const initializeGame = useCallback((pairs: CardPair[]) => {
    const gameCards: GameCard[] = []
    const facts: Record<string, string> = {}

    pairs.forEach((pair) => {
      facts[pair.id] = pair.fact
      gameCards.push({
        id: `${pair.id}-concept`,
        pairId: pair.id,
        content: pair.concept,
        type: "concept",
        isFlipped: false,
        isMatched: false,
        isMismatched: false,
      })
      gameCards.push({
        id: `${pair.id}-definition`,
        pairId: pair.id,
        content: pair.definition,
        type: "definition",
        isFlipped: false,
        isMatched: false,
        isMismatched: false,
      })
    })

    const shuffled = gameCards.sort(() => Math.random() - 0.5)

    setPairFacts(facts)
    setCards(shuffled)
    setMoves(0)
    setMatchedPairs([])
    setFlippedCards([])
    setCurrentFact(null)
    setIsGameComplete(false)
    setStartTime(Date.now())
  }, [])

  const flipCard = useCallback(
    (cardId: string) => {
      if (currentFact || flippedCards.length >= 2) return

      const card = cards.find((c) => c.id === cardId)
      if (!card || card.isFlipped || card.isMatched) return

      const newFlippedCards = [...flippedCards, cardId]
      setFlippedCards(newFlippedCards)

      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1)

        const [firstId, secondId] = newFlippedCards
        const firstCard = cards.find((c) => c.id === firstId)
        const secondCard = cards.find((c) => c.id === secondId)

        if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
          const fact = pairFacts[firstCard.pairId]
          const newMatchedPair = { pairId: firstCard.pairId, fact }

          setCards((prev) => prev.map((c) => (c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c)))
          setMatchedPairs((prev) => [...prev, newMatchedPair])
          setCurrentFact(newMatchedPair)
          setFlippedCards([])


        } else {
          setCards((prev) => prev.map((c) => (newFlippedCards.includes(c.id) ? { ...c, isMismatched: true } : c)))

          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                newFlippedCards.includes(c.id) && !c.isMatched ? { ...c, isFlipped: false, isMismatched: false } : c,
              ),
            )
            setFlippedCards([])
          }, 1000)
        }
      }
    },
    [cards, flippedCards, currentFact, pairFacts, matchedPairs.length],
  )

  const dismissFact = useCallback(() => {
    setCurrentFact(null)
    if (matchedPairs.length === Object.keys(pairFacts).length) {
      setIsGameComplete(true)
    }
  }, [matchedPairs.length, pairFacts])

  const resetGame = useCallback(() => {
    setCards((prev) => {
      const reset = prev.map((c) => ({ ...c, isFlipped: false, isMatched: false, isMismatched: false }))
      return reset.sort(() => Math.random() - 0.5)
    })
    setMoves(0)
    setMatchedPairs([])
    setFlippedCards([])
    setCurrentFact(null)
    setIsGameComplete(false)
    setStartTime(Date.now())
  }, [])

  return (
    <GameContext.Provider
      value={{
        cards,
        moves,
        matchedPairs,
        flippedCards,
        currentFact,
        isGameComplete,
        startTime,
        initializeGame,
        flipCard,
        dismissFact,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
