"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { useWallet } from "@/lib/wallet-context"
import { GameProvider, useGame } from "@/lib/game-context"
import { GameBoard } from "@/components/game/game-board"
import { GameHeader } from "@/components/game/game-header"
import { KnowledgeModal } from "@/components/game/knowledge-modal"
import { VictoryScreen } from "@/components/game/victory-screen"
import { useQuests } from "@/hooks/use-quests"

function GameContent() {
  const params = useParams()
  const router = useRouter()
  const { isConnected, address } = useWallet()
  const { currentFact, isGameComplete, dismissFact } = useGame()
  const { quests, loading: questsLoading } = useQuests()

  const levelId = params.levelId as string
  const deck = useMemo(() => quests.find((d) => d.id === levelId), [quests, levelId])

  // Only redirect if we're sure the wallet is not connected (after initial check)
  useEffect(() => {
    // Wait a bit for wallet to initialize, then check
    const timer = setTimeout(() => {
      if (!isConnected && address === null) {
        router.push("/")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isConnected, address, router])

  // Show loading while checking wallet connection or loading quests
  if (address === null && !isConnected) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-ui-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) return null

  if (questsLoading) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-ui-muted">Loading quest...</p>
        </div>
      </div>
    )
  }

  if (!deck || deck.isLocked) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-heading font-bold text-xl text-ui-text">Quest Not Found</h1>
          <p className="text-ui-muted mt-2">This quest is not available yet.</p>
          <button
            onClick={() => router.push("/play")}
            className="mt-4 px-6 py-3 bg-brand-primary text-white font-heading font-semibold rounded-full touch-manipulation"
          >
            Back to Quests
          </button>
        </div>
      </div>
    )
  }

  if (isGameComplete) {
    return <VictoryScreen deck={deck} />
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <GameHeader levelName={deck.name} />
      <GameBoard pairs={deck.pairs} />

      {currentFact && <KnowledgeModal fact={currentFact.fact} onDismiss={dismissFact} />}
    </div>
  )
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}
