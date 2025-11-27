import { useState, useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { BACKEND_URL } from "@/lib/config"

export interface UserStats {
  questsCompleted: number
  totalEarned: string
  currentStreak: number
  bestStreak: number
  totalMoves: number
  averageTime: string
  achievements: Array<{
    id: string
    name: string
    description: string
    earned: boolean
  }>
}

export function useUserStats() {
  const { address } = useWallet()
  const [stats, setStats] = useState<UserStats>({
    questsCompleted: 0,
    totalEarned: "0.00",
    currentStreak: 0,
    bestStreak: 0,
    totalMoves: 0,
    averageTime: "0:00",
    achievements: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!address) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/user-stats?userAddress=${encodeURIComponent(address)}`
        )
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [address])

  return { ...stats, loading }
}

