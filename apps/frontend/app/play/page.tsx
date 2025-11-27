"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { Navbar } from "@/components/layout/navbar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { QuestCard } from "@/components/quest/quest-card"
import { questDecks } from "@/lib/game-data"
import { Target } from "lucide-react"

function DashboardContent() {
  const { isConnected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) return null

  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      <Navbar />

      <main className="px-4 py-6">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-brand-primary" />
          <h2 className="font-heading font-bold text-xl text-ui-text">Quest Decks</h2>
        </div>
        <p className="text-sm text-ui-muted mb-6">Complete quests to learn crypto concepts and earn real rewards.</p>

        {/* Quest Grid */}
        <div className="space-y-4">
          {questDecks.map((deck) => (
            <QuestCard key={deck.id} deck={deck} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-4 bg-gradient-to-r from-brand-primary/10 to-teal-500/10 rounded-xl border border-brand-primary/20">
          <h3 className="font-heading font-semibold text-brand-primary">How it works</h3>
          <p className="text-sm text-ui-muted mt-1 leading-relaxed">
            Match crypto concepts with their definitions in a memory game. Each correct match teaches you something new.
            Complete the quest to claim your cUSD reward!
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default function PlayPage() {
  return <DashboardContent />
}
