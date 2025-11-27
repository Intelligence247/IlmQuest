"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { useUserStats } from "@/hooks/use-user-stats"
import { Navbar } from "@/components/layout/navbar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Trophy, Target, Sparkles, Clock, ChevronRight, Award } from "lucide-react"
import Link from "next/link"

function ProfileContent() {
  const { isConnected, address } = useWallet()
  const router = useRouter()
  const userStats = useUserStats()

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

  // Show loading while checking wallet connection
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

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  // Show loading state while fetching stats
  if (userStats.loading) {
    return (
      <div className="min-h-screen bg-brand-surface pb-20">
        <Navbar />
        <main className="px-4 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-ui-muted">Loading your stats...</p>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      <Navbar />

      <main className="px-4 py-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-brand-primary to-teal-800 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="font-heading font-bold text-2xl">
                {address ? address.slice(2, 4).toUpperCase() : "??"}
              </span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl">Scholar</h1>
              <p className="text-sm text-white/70">{truncatedAddress}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-brand-accent" />
              <p className="font-heading font-bold text-lg">{userStats.totalEarned} cUSD</p>
              <p className="text-xs text-white/70">Total Earned</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-brand-accent" />
              <p className="font-heading font-bold text-lg">{userStats.questsCompleted}</p>
              <p className="text-xs text-white/70">Quests Done</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <h2 className="font-heading font-bold text-lg text-ui-text mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-primary" />
            Your Stats
          </h2>
          <div className="bg-white rounded-xl border border-ui-border shadow-sm p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-brand-surface rounded-lg">
                <p className="text-2xl font-heading font-bold text-ui-text">{userStats.currentStreak}</p>
                <p className="text-xs text-ui-muted">Day Streak</p>
              </div>
              <div className="text-center p-3 bg-brand-surface rounded-lg">
                <p className="text-2xl font-heading font-bold text-ui-text">{userStats.totalMoves}</p>
                <p className="text-xs text-ui-muted">Total Moves</p>
              </div>
              <div className="text-center p-3 bg-brand-surface rounded-lg">
                <p className="text-2xl font-heading font-bold text-ui-text">{userStats.averageTime}</p>
                <p className="text-xs text-ui-muted">Avg. Time</p>
              </div>
              <div className="text-center p-3 bg-brand-surface rounded-lg">
                <p className="text-2xl font-heading font-bold text-ui-text">{userStats.bestStreak}</p>
                <p className="text-xs text-ui-muted">Best Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-6">
          <h2 className="font-heading font-bold text-lg text-ui-text mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-accent" />
            Achievements
          </h2>
          <div className="space-y-3">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-3 ${
                  achievement.earned ? "border-brand-secondary/30" : "border-ui-border opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    achievement.earned ? "bg-brand-secondary/20" : "bg-ui-border"
                  }`}
                >
                  <Trophy className={`w-6 h-6 ${achievement.earned ? "text-brand-secondary" : "text-ui-muted"}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-heading font-semibold ${achievement.earned ? "text-ui-text" : "text-ui-muted"}`}>
                    {achievement.name}
                  </p>
                  <p className="text-sm text-ui-muted">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <div className="w-6 h-6 rounded-full bg-brand-secondary flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <Link
            href="/play"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-ui-border shadow-sm hover:shadow-md transition-shadow touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-brand-primary" />
              </div>
              <span className="font-medium text-ui-text">Continue Learning</span>
            </div>
            <ChevronRight className="w-5 h-5 text-ui-muted" />
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-ui-border shadow-sm hover:shadow-md transition-shadow touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-brand-accent" />
              </div>
              <span className="font-medium text-ui-text">About IlmQuest</span>
            </div>
            <ChevronRight className="w-5 h-5 text-ui-muted" />
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default function ProfilePage() {
  return <ProfileContent />
}
