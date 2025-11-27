import { useState, useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { BACKEND_URL } from "@/lib/config"

interface QuestStatus {
  completed: boolean
  canReplay: boolean
  lastCompleted: string | null
  hoursUntilReplay: number
}

export function useQuestStatus(levelId: string) {
  const { address } = useWallet()
  const [status, setStatus] = useState<QuestStatus>({
    completed: false,
    canReplay: true,
    lastCompleted: null,
    hoursUntilReplay: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!address || !levelId) {
      setLoading(false)
      return
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/quest-status/${levelId}?userAddress=${encodeURIComponent(address)}`
        )
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        }
      } catch (error) {
        console.error("Error fetching quest status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    
    // Refresh status every minute to update countdown
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [address, levelId])

  return { ...status, loading }
}

