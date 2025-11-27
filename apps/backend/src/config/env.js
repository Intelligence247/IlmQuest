require("dotenv").config();

// Validate required environment variables
const required = ["MONGODB_URI", "ADMIN_PRIVATE_KEY", "VAULT_ADDRESS", "CHAIN_ID"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// Validate ADMIN_PRIVATE_KEY format (0x + 64 hex chars)
if (!/^0x[0-9a-fA-F]{64}$/.test(process.env.ADMIN_PRIVATE_KEY)) {
  throw new Error("ADMIN_PRIVATE_KEY must be a 0x-prefixed 32-byte hex string");
}

// Validate VAULT_ADDRESS format (0x + 40 hex chars)
if (!/^0x[0-9a-fA-F]{40}$/.test(process.env.VAULT_ADDRESS)) {
  throw new Error("VAULT_ADDRESS must be a valid Ethereum address");
}

module.exports = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  MONGODB_URI: process.env.MONGODB_URI,
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
  VAULT_ADDRESS: process.env.VAULT_ADDRESS,
  CHAIN_ID: BigInt(process.env.CHAIN_ID),
};

