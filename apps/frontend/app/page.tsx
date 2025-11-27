"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sparkles, Shield, BookOpen } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { ConnectButton } from "@/components/wallet/connect-button"
import { LogoIcon } from "@/components/brand/logo"

function LandingContent() {
  const { isConnected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push("/play")
    }
  }, [isConnected, router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-surface via-white to-emerald-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-8 animate-pop">
          <div className="w-24 h-24 mx-auto mb-4 animate-float">
            <LogoIcon className="w-24 h-24 drop-shadow-lg" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-brand-primary tracking-tight">IlmQuest</h1>
          <p className="mt-2 text-lg text-ui-muted font-medium">Learn Crypto. Earn Crypto.</p>
        </div>

        {/* Hero Illustration - Abstract geometric pattern */}
        <div className="relative w-full max-w-[280px] aspect-square mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl" />
          <div
            className="absolute top-4 left-4 w-16 h-16 bg-brand-primary/20 rounded-xl rotate-12 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="absolute top-8 right-6 w-12 h-12 bg-brand-accent/30 rounded-lg -rotate-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="absolute bottom-12 left-8 w-20 h-20 bg-brand-secondary/20 rounded-2xl rotate-6 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="absolute bottom-6 right-4 w-14 h-14 bg-brand-primary/30 rounded-xl -rotate-12 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <Sparkles className="w-12 h-12 text-brand-accent" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          <div
            className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-ui-border/50 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-ui-text">Play memory games</p>
              <p className="text-xs text-ui-muted">Match crypto concepts to earn</p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-ui-border/50 animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-ui-text">Earn real rewards</p>
              <p className="text-xs text-ui-muted">Get cUSD for completing quests</p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-ui-border/50 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-ui-text">{"Don't Bet. Learn."}</p>
              <p className="text-xs text-ui-muted">Ethical earning through knowledge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 p-6 bg-gradient-to-t from-brand-surface via-brand-surface to-transparent">
        <ConnectButton />
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
          <span className="text-xs text-ui-muted font-medium">Built on Celo</span>
        </div>
      </div>
    </main>
  )
}

export default function LandingPage() {
  return <LandingContent />
}
