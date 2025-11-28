"use client"

import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/lib/wallet-context"
import { BalanceDisplay } from "@/components/wallet/balance-display"
import { LogoIcon } from "@/components/brand/logo"
import Image from "next/image"

export function Navbar() {
  const { disconnect } = useWallet()

  return (
    <header className="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-sm border-b border-ui-border">
      <div className="px-4 py-3">
        {/* Top row - Logo, profile, and logout */}
        <div className="flex items-center justify-between mb-3">
          <Link href="/play" className="flex items-center gap-2">
            {/* <LogoIcon className="w-8 h-8" /> */}
            <Image src={"/icon-dark-32x32.jpg"} alt="IlmQuest" width={32} height={32} />
            <span className="font-heading font-bold text-lg text-brand-primary">IlmQuest</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/profile"
              className="p-2 rounded-full hover:bg-ui-border/50 active:bg-ui-border transition-colors touch-manipulation"
              aria-label="View profile"
            >
              <User className="w-5 h-5 text-ui-muted" />
            </Link>
            <button
              onClick={disconnect}
              className="p-2 rounded-full hover:bg-ui-border/50 active:bg-ui-border transition-colors touch-manipulation"
              aria-label="Disconnect wallet"
            >
              <LogOut className="w-5 h-5 text-ui-muted" />
            </button>
          </div>
        </div>
        {/* Balance display */}
        <BalanceDisplay />
      </div>
    </header>
  )
}
