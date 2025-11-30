"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, Sparkles, Trophy, Clock, MousePointer2 } from "lucide-react"
import { useGame } from "@/lib/game-context"
import { useWallet } from "@/lib/wallet-context"
import { BACKEND_URL, BLOCK_EXPLORER_URL } from "@/lib/config"
import { claimReward } from "@/lib/contract"
import { ExternalLink } from "lucide-react"
import type { QuestDeck } from "@/lib/game-data"

interface VictoryScreenProps {
  deck: QuestDeck
}

type ClaimState = "verifying" | "ready" | "processing" | "success"

interface RewardData {
  signature: string
  rewardAmount: string
  nonce: string
  levelId: string
}

function Confetti() {
  const confettiPieces = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: ["#047857", "#F59E0B", "#10B981", "#0EA5E9", "#EC4899"][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: piece.left,
            top: "-20px",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.size > 10 ? "2px" : "50%",
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export function VictoryScreen({ deck }: VictoryScreenProps) {
  const router = useRouter()
  const { moves, matchedPairs, startTime, resetGame } = useGame()
  const { balance, address, refreshBalance } = useWallet()
  const [claimState, setClaimState] = useState<ClaimState>("verifying")
  const [elapsedTime, setElapsedTime] = useState("0:00")
  const [rewardData, setRewardData] = useState<RewardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  useEffect(() => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }
  }, [startTime])

  // Function to verify game with backend
  const verifyGame = useCallback(async () => {
    if (!address || !startTime) return

    setError(null)
    setClaimState("verifying")

    try {
      const duration = Math.floor((Date.now() - startTime) / 1000)

      const response = await fetch(`${BACKEND_URL}/api/verify-game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: address,
          levelId: deck.id,
          duration,
          moves,
          timestamp: Math.floor(Date.now() / 1000),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Verification failed")
      }

      const data = await response.json()
      setRewardData(data)
      setClaimState("ready")
    } catch (err) {
      console.error("Error verifying game:", err)
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Cannot connect to backend server. Make sure the backend is running on http://localhost:4000")
      } else {
        setError(err instanceof Error ? err.message : "Failed to verify game")
      }
      // Still show ready state so user can retry
      setClaimState("ready")
    }
  }, [address, startTime, moves, deck.id])

  // Call backend API to verify game and get signature
  useEffect(() => {
    verifyGame()
  }, [verifyGame])

  const handleClaim = async () => {
    if (!rewardData || !address) {
      setError("No reward data available. Please try again.")
      return
    }

    setClaimState("processing")
    setError(null)

    try {
      // Call the smart contract
      const hash = await claimReward(
        address,
        rewardData.levelId,
        rewardData.rewardAmount,
        rewardData.nonce,
        rewardData.signature
      )

      console.log("Transaction successful:", hash)
      setTxHash(hash)
      
      // Wait a bit for the transaction to be fully processed
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Refresh balance after successful claim (try multiple times to ensure it updates)
      await refreshBalance()
      // Refresh again after a short delay to catch any delayed updates
      setTimeout(async () => {
        await refreshBalance()
      }, 3000)
      
    setClaimState("success")
    } catch (err) {
      console.error("Error claiming reward:", err)
      setError(err instanceof Error ? err.message : "Failed to claim reward. Please try again.")
      setClaimState("ready") // Go back to ready state so user can retry
    }
  }

  const handlePlayAgain = () => {
    resetGame()
    router.push("/play")
  }

  // Verifying state
  if (claimState === "verifying") {
    return (
      <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-primary/10 flex items-center justify-center animate-pulse">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-primary mb-2">Quest Complete!</h1>
          <p className="text-ui-muted">
            {error ? `Error: ${error}` : "Verifying your progress..."}
          </p>
        </div>
      </div>
    )
  }

  // Success state
  if (claimState === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-surface to-emerald-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Confetti />

        <div className="text-center relative z-10">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-secondary/20 flex items-center justify-center animate-pop">
            <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-primary mb-2">
            {deck.reward} sent to your wallet!
          </h1>
          <p className="text-ui-muted mb-4">Your new balance is {balance} cUSD</p>
          {txHash && (
            <a
              href={`${BLOCK_EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary/80 mb-8 underline"
            >
              View Transaction on Block Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={handlePlayAgain}
            className="w-full max-w-xs min-h-[48px] px-6 py-3 bg-brand-primary text-white font-heading font-semibold text-lg rounded-full shadow-md hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200 touch-manipulation"
          >
            Play Another Quest
          </button>
        </div>
      </div>
    )
  }

  // Ready & Processing states
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-surface to-emerald-50 flex flex-col p-6">
      {/* Header */}
      <div className="text-center pt-8 mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-accent/20 flex items-center justify-center animate-pop">
          <Trophy className="w-10 h-10 text-brand-accent" />
        </div>
        <h1 className="font-heading font-bold text-3xl text-brand-primary mb-1">QUEST COMPLETE!</h1>
        <p className="text-ui-muted">
          {"You've mastered "}
          {deck.name}
        </p>
      </div>

      {/* Reward Display */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center border border-brand-accent/30">
        <p className="text-sm text-ui-muted mb-2">Your Reward</p>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-brand-accent" />
          <span className="font-heading font-bold text-4xl text-brand-accent">{deck.reward}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-ui-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <MousePointer2 className="w-5 h-5 text-ui-muted" />
            </div>
            <p className="text-lg font-heading font-bold text-ui-text">{moves}</p>
            <p className="text-xs text-ui-muted">Moves</p>
          </div>
          <div className="text-center border-x border-ui-border">
            <div className="flex justify-center mb-1">
              <Clock className="w-5 h-5 text-ui-muted" />
            </div>
            <p className="text-lg font-heading font-bold text-ui-text">{elapsedTime}</p>
            <p className="text-xs text-ui-muted">Time</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Check className="w-5 h-5 text-brand-secondary" />
            </div>
            <p className="text-lg font-heading font-bold text-brand-secondary">
              {matchedPairs.length}/{deck.pairs.length}
            </p>
            <p className="text-xs text-ui-muted">Pairs</p>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 mb-2">{error}</p>
          <button
            onClick={verifyGame}
            className="text-xs text-red-600 underline hover:text-red-800"
          >
            Retry Verification
          </button>
        </div>
      )}

      {/* Claim Button */}
      <button
        onClick={handleClaim}
        disabled={claimState === "processing" || !rewardData}
        className="w-full min-h-[52px] px-6 py-4 bg-brand-accent text-white font-heading font-bold text-lg rounded-full shadow-xl animate-pulse-glow hover:bg-brand-accent/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:animate-none touch-manipulation flex items-center justify-center gap-2"
      >
        {claimState === "processing" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending Reward...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Claim Reward</span>
          </>
        )}
      </button>

      <p className="text-xs text-ui-muted text-center mt-4">Rewards are sent directly to your connected wallet</p>
    </div>
  )
}
