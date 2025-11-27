/**
 * Utility to get ERC20 token balance
 */

import { ethers } from "ethers"
import { REWARD_TOKEN_ADDRESS } from "./config"

// Simple ERC20 ABI (just balanceOf)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
] as const

/**
 * Get the reward token (cUSD) balance for an address
 */
export async function getTokenBalance(address: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No wallet found")
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const tokenContract = new ethers.Contract(REWARD_TOKEN_ADDRESS, ERC20_ABI, provider)

  try {
    const [balance, decimals] = await Promise.all([
      tokenContract.balanceOf(address),
      tokenContract.decimals(),
    ])

    // Use ethers formatUnits for reliable formatting
    const formatted = ethers.formatUnits(balance, decimals)
    
    // Round to 2 decimal places
    const num = parseFloat(formatted)
    const rounded = Math.round(num * 100) / 100
    
    // Format with 2 decimal places
    const result = rounded.toFixed(2)
    
    // Debug logging (only log if balance changed significantly or on first fetch)
    // Remove excessive logging - uncomment for debugging if needed
    // console.log("Token balance fetched:", {
    //   raw: balance.toString(),
    //   formatted,
    //   rounded: result,
    //   address,
    // })
    
    return result
  } catch (error) {
    console.error("Error fetching token balance:", error)
    return "0.00"
  }
}

