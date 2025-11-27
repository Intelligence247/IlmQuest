"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { getTokenBalance } from "./token-balance"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)


export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === "undefined" || !window.ethereum) {
        return
      }

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const account = accounts[0] as string
          setAddress(account)
          setIsConnected(true)
          // Fetch token balance (cUSD)
          const tokenBalance = await getTokenBalance(account)
          setBalance(tokenBalance)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkConnection()

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        }
      }
    }
  }, [])

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MiniPay or MetaMask to connect your wallet")
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const userAddress = accounts[0]
      setAddress(userAddress)
      setIsConnected(true)

      // Fetch token balance (cUSD)
      try {
        const tokenBalance = await getTokenBalance(userAddress)
        setBalance(tokenBalance)
      } catch (err) {
        console.error("Error fetching balance:", err)
        setBalance("0.00")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert(error instanceof Error ? error.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.00")
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!isConnected || !address || !window.ethereum) return
    
    try {
      const tokenBalance = await getTokenBalance(address)
      setBalance(tokenBalance)
    } catch (err) {
      console.error("Error refreshing balance:", err)
    }
  }, [isConnected, address])

  // Update balance periodically when connected
  useEffect(() => {
    if (!isConnected || !address || !window.ethereum) return

    const updateBalance = async () => {
      try {
        const tokenBalance = await getTokenBalance(address)
        setBalance(tokenBalance)
      } catch (err) {
        console.error("Error updating balance:", err)
      }
    }

    updateBalance()
    const interval = setInterval(updateBalance, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [isConnected, address])

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        isConnecting,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
