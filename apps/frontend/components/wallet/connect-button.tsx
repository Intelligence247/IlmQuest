"use client"

import { Loader2, Wallet } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

export function ConnectButton() {
  const { isConnecting, connect } = useWallet()

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center justify-center gap-2 w-full min-h-[44px] px-6 py-3 bg-brand-primary text-white font-heading font-semibold text-lg rounded-full shadow-md hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  )
}
