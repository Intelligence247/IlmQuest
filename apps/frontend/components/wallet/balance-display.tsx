"use client"

import { Coins, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/lib/wallet-context"

export function BalanceDisplay() {
  const { balance, address, refreshBalance } = useWallet()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  return (
    <div className="flex items-center justify-between w-full p-3 bg-white rounded-xl border border-ui-border shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <Coins className="w-4 h-4 text-brand-primary" />
        </div>
        <span className="text-sm text-ui-muted font-medium">{truncatedAddress}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-brand-primary/10 rounded-full transition-colors disabled:opacity-50"
          title="Refresh balance"
        >
          <RefreshCw
            className={`w-4 h-4 text-brand-primary ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      <div className="flex items-center gap-1">
        <span className="text-lg font-heading font-bold text-brand-accent">{balance}</span>
        <span className="text-sm font-medium text-ui-muted">cUSD</span>
        </div>
      </div>
    </div>
  )
}
