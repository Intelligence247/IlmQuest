/**
 * App configuration
 */

// Backend API URL - change this to your backend URL in production
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

// Contract addresses on Celo Sepolia
export const VAULT_ADDRESS = "0x9857b9d8F49C035Df7e56397870A0a16d851e371";
export const REWARD_TOKEN_ADDRESS = "0x980DC8695F6D30A3b20770Ad42A5458784CBeA90";

// Chain ID for Celo Sepolia
export const CHAIN_ID = 11142220;

// Block explorer URL
export const BLOCK_EXPLORER_URL = "https://celo-sepolia.blockscout.com";

