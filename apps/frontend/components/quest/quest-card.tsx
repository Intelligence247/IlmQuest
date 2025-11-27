"use client"

import { Lock, Sparkles, ChevronRight, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import type { QuestDeck } from "@/lib/game-data"
import { useQuestStatus } from "@/hooks/use-quest-status"

interface QuestCardProps {
  deck: QuestDeck
}

const difficultyColors = {
  beginner: "bg-brand-secondary/20 text-brand-secondary",
  intermediate: "bg-brand-accent/20 text-brand-accent",
  advanced: "bg-red-500/20 text-red-500",
}

export function QuestCard({ deck }: QuestCardProps) {
  const isLocked = deck.isLocked
  const { completed, canReplay, hoursUntilReplay, loading } = useQuestStatus(deck.id)

  if (isLocked) {
    return (
      <div className="relative bg-white rounded-xl border border-ui-border shadow-sm p-4 opacity-60">
        <div className="absolute top-3 right-3">
          <Lock className="w-5 h-5 text-ui-muted" />
        </div>
        <div className="pr-8">
          <h3 className="font-heading font-semibold text-lg text-ui-text">{deck.name}</h3>
          <p className="text-sm text-ui-muted mt-1">{deck.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[deck.difficulty]}`}>
            {deck.difficulty.charAt(0).toUpperCase() + deck.difficulty.slice(1)}
          </span>
          <span className="text-sm font-medium text-ui-muted">Coming Soon</span>
        </div>
      </div>
    )
  }

  const cardContent = (
    <div className="block bg-white rounded-xl border border-ui-border shadow-md p-4 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 touch-manipulation">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-lg text-ui-text">{deck.name}</h3>
            {completed && (
              <CheckCircle2 className="w-5 h-5 text-brand-secondary shrink-0" />
            )}
          </div>
          <p className="text-sm text-ui-muted mt-1">{deck.description}</p>
          {completed && !canReplay && !loading && (
            <p className="text-xs text-brand-accent mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Replay available in {hoursUntilReplay}h
            </p>
          )}
          {completed && canReplay && (
            <p className="text-xs text-brand-secondary mt-1">Ready for revision!</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-ui-muted shrink-0 mt-1" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[deck.difficulty]}`}>
          {deck.difficulty.charAt(0).toUpperCase() + deck.difficulty.slice(1)}
        </span>
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-brand-accent" />
          <span className="text-sm font-heading font-bold text-brand-accent">Earn {deck.reward}</span>
        </div>
      </div>
    </div>
  )

  // If completed and can't replay, show as disabled
  if (completed && !canReplay && !loading) {
    return (
      <div className="opacity-60 cursor-not-allowed">
        {cardContent}
      </div>
    )
  }

  return (
    <Link href={`/play/${deck.id}`}>
      {cardContent}
    </Link>
  )
}
