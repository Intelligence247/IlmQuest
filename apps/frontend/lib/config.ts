/**
 * App configuration
 */

// Backend API URL - change this to your backend URL in production
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

// Contract addresses on Celo Mainnet
export const VAULT_ADDRESS = "0x980DC8695F6D30A3b20770Ad42A5458784CBeA90";
export const REWARD_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Real cUSD on mainnet

// Chain ID for Celo Mainnet
export const CHAIN_ID = 42220;

// Block explorer URL
export const BLOCK_EXPLORER_URL = "https://celoscan.io";

