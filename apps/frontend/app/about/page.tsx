"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, Shield, Sparkles, Heart, ExternalLink } from "lucide-react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { WalletProvider } from "@/lib/wallet-context"
import Image from "next/image"

function AboutContent() {
  return (
    <div className="min-h-screen bg-brand-surface pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-sm border-b border-ui-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link
            href="/play"
            className="p-2 -ml-2 rounded-full hover:bg-ui-border/50 active:bg-ui-border transition-colors touch-manipulation"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-ui-text" />
          </Link>
          <h1 className="font-heading font-bold text-lg text-ui-text">About IlmQuest</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-primary to-teal-800 flex items-center justify-center shadow-lg">
            {/* <BookOpen className="w-10 h-10 text-white" /> */}
            <Image 
              src="/apple-icon.jpg"
              alt="IlmQuest"
              width={80}
              height={80}
            />
          </div>
          <h2 className="font-heading font-bold text-2xl text-brand-primary">IlmQuest</h2>
          <p className="text-ui-muted mt-1">Learn Crypto. Earn Crypto.</p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl border border-ui-border shadow-sm p-5 mb-6">
          <h3 className="font-heading font-semibold text-lg text-ui-text mb-3">Our Mission</h3>
          <p className="text-ui-muted leading-relaxed">
            IlmQuest is a Learn-to-Earn platform built on the Celo blockchain. We believe everyone deserves access to
            financial education, and learning should be rewarded. Through fun memory games, we teach crypto concepts
            while you earn real rewards.
          </p>
        </div>

        {/* Values Section */}
        <div className="space-y-4 mb-6">
          <h3 className="font-heading font-semibold text-lg text-ui-text">Our Values</h3>

          <div className="bg-white rounded-xl border border-ui-border shadow-sm p-4 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-ui-text">Ethical Earning</h4>
              <p className="text-sm text-ui-muted mt-1">
                {"Based on Ju'alah (Reward for Service). You earn by learning, not gambling."}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ui-border shadow-sm p-4 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-ui-text">Accessible Education</h4>
              <p className="text-sm text-ui-muted mt-1">
                Designed for mobile-first users in emerging markets. No jargon, just clarity.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-ui-border shadow-sm p-4 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-brand-secondary" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-ui-text">Community First</h4>
              <p className="text-sm text-ui-muted mt-1">
                Built for the Celo MiniPay community. Your success is our success.
              </p>
            </div>
          </div>
        </div>

        {/* Built On Section */}
        <div className="bg-gradient-to-r from-brand-primary/10 to-teal-500/10 rounded-xl border border-brand-primary/20 p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
            <span className="font-heading font-semibold text-brand-primary">Built on Celo</span>
          </div>
          <p className="text-sm text-ui-muted leading-relaxed">
            Celo is a mobile-first blockchain that makes financial tools accessible to anyone with a mobile phone.
            IlmQuest uses cUSD, a stablecoin that maintains the value of the US Dollar.
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-3">
          <a
            href="https://celo.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-ui-border shadow-sm hover:shadow-md transition-shadow touch-manipulation"
          >
            <span className="font-medium text-ui-text">Learn more about Celo</span>
            <ExternalLink className="w-5 h-5 text-ui-muted" />
          </a>
          <a
            href="https://minipay.opera.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-ui-border shadow-sm hover:shadow-md transition-shadow touch-manipulation"
          >
            <span className="font-medium text-ui-text">Get MiniPay</span>
            <ExternalLink className="w-5 h-5 text-ui-muted" />
          </a>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-ui-muted mt-8">IlmQuest v1.0.0</p>
      </main>

      <BottomNav />
    </div>
  )
}

export default function AboutPage() {
  return (
    <WalletProvider>
      <AboutContent />
    </WalletProvider>
  )
}
