/**
 * Smart contract interaction utilities
 */

import { ethers } from "ethers"
import { VAULT_ADDRESS, REWARD_TOKEN_ADDRESS, CHAIN_ID } from "./config"

// JualahVault ABI (just the claimReward function)
export const VAULT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "levelId", type: "string" },
      { internalType: "uint256", name: "rewardAmount", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

/**
 * Call claimReward on JualahVault contract
 * 
 * @param userAddress - The wallet address claiming the reward
 * @param levelId - The level ID (e.g., "celo-basics")
 * @param rewardAmount - Reward amount in wei (as string)
 * @param nonce - The nonce from backend (bytes32 hex string)
 * @param signature - The signature from backend
 * @returns Transaction hash
 */
export async function claimReward(
  userAddress: string,
  levelId: string,
  rewardAmount: string,
  nonce: string,
  signature: string
): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No wallet found. Please install MiniPay or MetaMask.")
  }

  // Create provider and signer from window.ethereum
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  // Verify the signer address matches
  const signerAddress = await signer.getAddress()
  if (signerAddress.toLowerCase() !== userAddress.toLowerCase()) {
    throw new Error("Connected wallet does not match the reward recipient")
  }

  // Get network and verify we're on Celo Sepolia
  // Use window.ethereum directly for more reliable chain ID
  const ethChainId = await window.ethereum.request({ method: "eth_chainId" })
  const actualChainId = parseInt(ethChainId as string, 16)
  
  console.log("Chain ID check - Current:", actualChainId, "Expected:", CHAIN_ID, "Hex:", ethChainId)
  
  if (actualChainId !== CHAIN_ID) {
    // Try to switch network automatically
    try {
      console.log("Attempting to switch to Celo Sepolia...")
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      })
      // Wait a moment for the switch to complete
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Verify again
      const newChainId = await window.ethereum.request({ method: "eth_chainId" })
      const newChainIdNumber = parseInt(newChainId as string, 16)
      console.log("After switch - Chain ID:", newChainIdNumber)
      if (newChainIdNumber !== CHAIN_ID) {
        throw new Error(
          `Network switch incomplete. Please manually switch to Celo Sepolia (Chain ID: ${CHAIN_ID}) in MetaMask. Current: ${newChainIdNumber}`
        )
      }
    } catch (switchError: any) {
      console.error("Network switch error:", switchError)
      // If switch fails, check if it's because the chain doesn't exist
      if (switchError.code === 4902) {
        // Chain not added, try to add it
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: "Celo Sepolia Testnet",
                nativeCurrency: {
                  name: "CELO",
                  symbol: "CELO",
                  decimals: 18,
                },
                rpcUrls: ["https://forno.celo-sepolia.celo-testnet.org"],
                blockExplorerUrls: ["https://celo-sepolia.blockscout.com"],
              },
            ],
          })
          // Wait for the chain to be added
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (addError) {
          throw new Error(
            `Please add Celo Sepolia Testnet to your wallet. Chain ID: ${CHAIN_ID}`
          )
        }
      } else {
        // Show more helpful error with both chain IDs
        console.error("Chain ID mismatch:", { current: actualChainId, expected: CHAIN_ID })
        throw new Error(
          `Wrong network detected. Current: ${actualChainId}, Expected: ${CHAIN_ID}. Please switch to Celo Sepolia Testnet in your wallet.`
        )
      }
    }
  }

  // Create contract instance
  const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer)

  // Convert nonce to bytes32 (ensure it's the right format)
  let nonceBytes32: string
  if (nonce.startsWith("0x")) {
    nonceBytes32 = nonce
  } else {
    nonceBytes32 = `0x${nonce}`
  }

  // Ensure nonce is exactly 32 bytes (64 hex chars + 0x = 66 chars)
  if (nonceBytes32.length !== 66) {
    throw new Error(`Invalid nonce length: ${nonceBytes32.length}. Expected 66 characters (0x + 64 hex)`)
  }

  // Convert rewardAmount to BigInt
  const rewardAmountBigInt = BigInt(rewardAmount)

  // Call claimReward with fee currency abstraction
  // On Celo, we use the overrides to specify feeCurrency
  const tx = await vaultContract.claimReward(
    levelId,
    rewardAmountBigInt,
    nonceBytes32,
    signature,
    {
      // Fee currency abstraction - pay gas in cUSD
      feeCurrency: REWARD_TOKEN_ADDRESS,
    }
  )

  // Wait for transaction to be mined
  await tx.wait()

  return tx.hash
}
