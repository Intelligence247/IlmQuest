require("dotenv").config();
const { ethers } = require("ethers");

// Contract addresses on Celo Sepolia
const MOCK_TOKEN_ADDRESS = "0x980DC8695F6D30A3b20770Ad42A5458784CBeA90";
const VAULT_ADDRESS = "0x9857b9d8F49C035Df7e56397870A0a16d851e371";

// Simple ERC20 ABI (just what we need)
const ERC20_ABI = [
  "function mint(address to, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }

  // Connect to Celo Sepolia
  const provider = new ethers.JsonRpcProvider(
    "https://forno.celo-sepolia.celo-testnet.org"
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Using wallet:", wallet.address);

  // Connect to MockERC20 contract
  const tokenContract = new ethers.Contract(
    MOCK_TOKEN_ADDRESS,
    ERC20_ABI,
    wallet
  );

  // Check current vault balance
  const decimals = await tokenContract.decimals();
  const currentBalance = await tokenContract.balanceOf(VAULT_ADDRESS);
  console.log(
    `Current vault balance: ${ethers.formatUnits(currentBalance, decimals)} tokens`
  );

  // Mint 1000 tokens to the vault (enough for many rewards)
  const amountToMint = ethers.parseUnits("1000", decimals);
  console.log(`\nMinting ${ethers.formatUnits(amountToMint, decimals)} tokens to vault...`);

  const tx = await tokenContract.mint(VAULT_ADDRESS, amountToMint);
  console.log("Transaction sent:", tx.hash);
  console.log("Waiting for confirmation...");

  await tx.wait();
  console.log("✅ Transaction confirmed!");

  // Check new balance
  const newBalance = await tokenContract.balanceOf(VAULT_ADDRESS);
  console.log(
    `\nNew vault balance: ${ethers.formatUnits(newBalance, decimals)} tokens`
  );
  console.log("✅ Vault funded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

