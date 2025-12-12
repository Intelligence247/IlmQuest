require("dotenv").config();
const { ethers } = require("ethers");

// Real cUSD address on Celo Mainnet
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

// Simple ERC20 ABI (just what we need)
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }

  if (!process.env.VAULT_ADDRESS) {
    throw new Error("VAULT_ADDRESS not found in .env file. Deploy the vault first!");
  }

  const VAULT_ADDRESS = process.env.VAULT_ADDRESS;

  // Connect to Celo Mainnet
  const provider = new ethers.JsonRpcProvider("https://forno.celo.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Using wallet:", wallet.address);
  console.log("Vault address:", VAULT_ADDRESS);
  console.log("Network: Celo Mainnet\n");

  // Check wallet CUSD balance
  const cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, wallet);
  const decimals = await cusdContract.decimals();
  const walletBalance = await cusdContract.balanceOf(wallet.address);
  console.log(`Your wallet cUSD balance: ${ethers.formatUnits(walletBalance, decimals)} cUSD`);

  // Check current vault balance
  const vaultBalance = await cusdContract.balanceOf(VAULT_ADDRESS);
  console.log(`Current vault balance: ${ethers.formatUnits(vaultBalance, decimals)} cUSD\n`);

  // Get amount to transfer from command line or use default
  const amountToTransfer = process.argv[2] 
    ? ethers.parseUnits(process.argv[2], decimals)
    : ethers.parseUnits("6", decimals); // Default: 6 cUSD

  if (walletBalance < amountToTransfer) {
    throw new Error(
      `Insufficient balance! You have ${ethers.formatUnits(walletBalance, decimals)} cUSD, but trying to transfer ${ethers.formatUnits(amountToTransfer, decimals)} cUSD`
    );
  }

  console.log(`Transferring ${ethers.formatUnits(amountToTransfer, decimals)} cUSD to vault...`);
  console.log("Transaction will be sent in 3 seconds... (Press Ctrl+C to cancel)\n");
  
  await new Promise(resolve => setTimeout(resolve, 3000));

  const tx = await cusdContract.transfer(VAULT_ADDRESS, amountToTransfer);
  console.log("Transaction sent:", tx.hash);
  console.log(`View on Celoscan: https://celoscan.io/tx/${tx.hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed!");
  console.log(`Gas used: ${receipt.gasUsed.toString()}`);

  // Check new balance
  const newVaultBalance = await cusdContract.balanceOf(VAULT_ADDRESS);
  console.log(`\nNew vault balance: ${ethers.formatUnits(newVaultBalance, decimals)} cUSD`);
  console.log("✅ Vault funded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

