import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { useWallet } from "@/lib/wallet-context"

const ADMIN_MESSAGE = "Admin authentication for IlmQuest"

interface AdminAuthState {
  isAuthenticated: boolean
  isAuthenticating: boolean
  error: string | null
}

export function useAdminAuth() {
  const { address, isConnected } = useWallet()
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isAuthenticating: false,
    error: null,
  })

  const authenticate = useCallback(async () => {
    if (!isConnected || !address || !window.ethereum) {
      setAuthState({
        isAuthenticated: false,
        isAuthenticating: false,
        error: "Please connect your wallet first",
      })
      return false
    }

    setAuthState({
      isAuthenticated: false,
      isAuthenticating: true,
      error: null,
    })

    try {
      // Request user to sign the message
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Sign the message
      const signature = await signer.signMessage(ADMIN_MESSAGE)

      // Store signature in sessionStorage for this session
      sessionStorage.setItem("admin_signature", signature)
      sessionStorage.setItem("admin_address", address)
      sessionStorage.setItem("admin_message", ADMIN_MESSAGE)

      setAuthState({
        isAuthenticated: true,
        isAuthenticating: false,
        error: null,
      })

      return true
    } catch (error) {
      console.error("Admin authentication error:", error)
      setAuthState({
        isAuthenticated: false,
        isAuthenticating: false,
        error: error instanceof Error ? error.message : "Failed to authenticate",
      })
      return false
    }
  }, [address, isConnected])

  const checkAuth = useCallback(() => {
    // Check if we have a stored signature for this session
    const storedSignature = sessionStorage.getItem("admin_signature")
    const storedAddress = sessionStorage.getItem("admin_address")
    const storedMessage = sessionStorage.getItem("admin_message")

    if (storedSignature && storedAddress === address && storedMessage === ADMIN_MESSAGE) {
      setAuthState({
        isAuthenticated: true,
        isAuthenticating: false,
        error: null,
      })
      return true
    }

    setAuthState({
      isAuthenticated: false,
      isAuthenticating: false,
      error: null,
    })
    return false
  }, [address])

  const logout = useCallback(() => {
    sessionStorage.removeItem("admin_signature")
    sessionStorage.removeItem("admin_address")
    sessionStorage.removeItem("admin_message")
    setAuthState({
      isAuthenticated: false,
      isAuthenticating: false,
      error: null,
    })
  }, [])

  // Get auth headers for API requests
  const getAuthHeaders = useCallback((): HeadersInit => {
    const signature = sessionStorage.getItem("admin_signature")
    const adminAddress = sessionStorage.getItem("admin_address")
    const message = sessionStorage.getItem("admin_message")

    if (!signature || !adminAddress || !message) {
      throw new Error("Not authenticated")
    }

    return {
      "x-admin-address": adminAddress,
      "x-admin-signature": signature,
      "x-admin-message": message,
    }
  }, [])

  return {
    ...authState,
    authenticate,
    checkAuth,
    logout,
    getAuthHeaders,
  }
}

