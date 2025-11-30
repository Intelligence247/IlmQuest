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

  // Check if user has sufficient balance in fee currency for gas
  // This helps prevent "divide by zero" errors that can occur when balance is too low
  try {
    const tokenContract = new ethers.Contract(
      REWARD_TOKEN_ADDRESS,
      [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
      ],
      provider
    )
    const balance = await tokenContract.balanceOf(userAddress)
    const minBalanceForGas = BigInt(1000000000000000) // 0.001 cUSD minimum for gas
    
    if (balance < minBalanceForGas) {
      console.warn("User balance might be too low for gas fees:", balance.toString())
      // Continue anyway - the transaction might still work
    }
  } catch (balanceError) {
    console.warn("Could not check balance:", balanceError)
    // Continue anyway
  }

  // For MiniPay compatibility, use a fixed gas limit instead of estimation
  // Gas estimation with feeCurrency can cause "divide by zero" errors in some wallets
  const GAS_LIMIT = BigInt(300000) // Safe gas limit for claimReward function

  // Prepare transaction parameters
  // For Celo fee currency abstraction, we only need to specify feeCurrency
  // DO NOT set gasPrice, maxFeePerGas, or maxPriorityFeePerGas - Celo handles these automatically
  // Also, some wallets (like MiniPay) may have issues if we set gasLimit explicitly
  // Try without gasLimit first, then with it if needed
  const txOverrides: any = {
    feeCurrency: REWARD_TOKEN_ADDRESS,
  }

  console.log("Transaction parameters:", {
    levelId,
    rewardAmount: rewardAmountBigInt.toString(),
    nonce: nonceBytes32,
    feeCurrency: REWARD_TOKEN_ADDRESS,
  })

  try {
    // Call claimReward with fee currency abstraction
    // On Celo, we use the overrides to specify feeCurrency
    const tx = await vaultContract.claimReward(
      levelId,
      rewardAmountBigInt,
      nonceBytes32,
      signature,
      txOverrides
    )

    console.log("Transaction sent, waiting for confirmation...")
    
    // Wait for transaction to be mined
    await tx.wait()

    return tx.hash
  } catch (error: any) {
    console.error("Transaction error details:", {
      error,
      message: error?.message,
      code: error?.code,
      data: error?.data,
    })

    // If the error is related to feeCurrency or gas estimation, try different approaches
    if (
      error?.message?.includes("divide by zero") ||
      error?.message?.includes("BigInteger") ||
      error?.code === -32603
    ) {
      console.warn("Fee currency or gas estimation error detected, trying alternative approaches...")
      
      // Try 1: With explicit gasLimit
      try {
        console.log("Attempting with explicit gasLimit...")
        const txWithGas = await vaultContract.claimReward(
          levelId,
          rewardAmountBigInt,
          nonceBytes32,
          signature,
          {
            feeCurrency: REWARD_TOKEN_ADDRESS,
            gasLimit: GAS_LIMIT,
          }
        )
        await txWithGas.wait()
        console.log("Transaction succeeded with explicit gasLimit")
        return txWithGas.hash
      } catch (gasLimitError) {
        console.warn("Transaction with gasLimit failed:", gasLimitError)
        
        // Try 2: Without feeCurrency (user pays in CELO - not ideal but works)
        try {
          console.warn("Trying without feeCurrency (will pay gas in CELO)...")
          const fallbackTx = await vaultContract.claimReward(
            levelId,
            rewardAmountBigInt,
            nonceBytes32,
            signature,
            {
              gasLimit: GAS_LIMIT,
            }
          )
          
          console.warn("Transaction succeeded without feeCurrency (paid in CELO)")
          await fallbackTx.wait()
          return fallbackTx.hash
        } catch (fallbackError) {
          console.error("All transaction attempts failed:", fallbackError)
          throw new Error(
            `Transaction failed due to wallet compatibility issue. ` +
            `Error: ${error.message}. ` +
            `Please ensure you have sufficient cUSD balance for gas fees, or try using MetaMask instead of MiniPay.`
          )
        }
      }
    }

    // Re-throw the original error if it's not a feeCurrency issue
    throw error
  }
}
