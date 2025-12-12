require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not found in .env file");
    process.exit(1);
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const address = wallet.address;
  const expectedAdminAddress = "0x93774ed7296373e372547587a3cc6ef3c0cc7b66";

  console.log("\n🔍 Checking Private Key Address...\n");
  console.log("Private Key Address:", address);
  console.log("Expected Admin Address:", expectedAdminAddress);
  console.log("");

  if (address.toLowerCase() === expectedAdminAddress.toLowerCase()) {
    console.log("✅ MATCH! Your PRIVATE_KEY corresponds to your admin wallet.");
    console.log("✅ You can use the same key for ADMIN_PRIVATE_KEY in backend.");
    console.log("✅ Everything is set up correctly!\n");
  } else {
    console.log("❌ NO MATCH! Your PRIVATE_KEY corresponds to a different address.");
    console.log("❌ You need to set ADMIN_PRIVATE_KEY to the private key for:");
    console.log("   ", expectedAdminAddress);
    console.log("\n⚠️  The PRIVATE_KEY can be used for deployment,");
    console.log("   but ADMIN_PRIVATE_KEY must match the admin wallet address.\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

