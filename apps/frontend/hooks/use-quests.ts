import { useState, useEffect } from "react"
import { BACKEND_URL } from "@/lib/config"
import type { QuestDeck } from "@/lib/game-data"

interface ApiQuest {
  id: string
  name: string
  description: string
  reward: string // e.g., "0.10 cUSD"
  difficulty: "beginner" | "intermediate" | "advanced"
  isLocked: boolean
  pairs: Array<{
    id: string
    concept: string
    definition: string
    fact: string
  }>
}

/**
 * Hook to fetch quests from the API
 * Falls back to hardcoded quests if API fails
 */
export function useQuests() {
  const [quests, setQuests] = useState<QuestDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${BACKEND_URL}/api/quests`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch quests")
        }

        const data = await response.json()
        
        // Transform API response to QuestDeck format
        const transformedQuests: QuestDeck[] = data.quests.map((quest: ApiQuest) => ({
          id: quest.id,
          name: quest.name,
          description: quest.description,
          reward: quest.reward,
          difficulty: quest.difficulty,
          isLocked: quest.isLocked,
          pairs: quest.pairs,
        }))

        setQuests(transformedQuests)
      } catch (err) {
        console.error("Error fetching quests from API:", err)
        setError(err instanceof Error ? err.message : "Failed to load quests")
        
        // Fallback to hardcoded quests (import dynamically to avoid circular deps)
        try {
          const { questDecks } = await import("@/lib/game-data")
          setQuests(questDecks)
          console.warn("Using fallback hardcoded quests")
        } catch (fallbackError) {
          console.error("Failed to load fallback quests:", fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchQuests()
  }, [])

  return { quests, loading, error }
}

