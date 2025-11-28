/**
 * Migration script to import existing quests from hardcoded data to MongoDB
 * 
 * Usage:
 *   node scripts/migrateQuests.js
 * 
 * This script reads the existing quest data and imports it into MongoDB.
 */

require("dotenv").config();
const { getQuestsCollection } = require("../src/db/mongo");

// Existing quest data (from game-data.ts)
const existingQuests = [
  {
    id: "celo-basics",
    name: "Celo Basics",
    description: "Learn the fundamentals of the Celo ecosystem",
    reward: "0.10",
    difficulty: "beginner",
    isLocked: false,
    isActive: true,
    pairs: [
      {
        id: "cusd",
        concept: "cUSD",
        definition: "Stable Value",
        fact: "cUSD tracks the value of the US Dollar so you can save without volatility.",
      },
      {
        id: "gas",
        concept: "Gas Fee",
        definition: "Transaction Cost",
        fact: "Gas fees pay validators who process your transactions on the blockchain.",
      },
      {
        id: "wallet",
        concept: "Wallet",
        definition: "Your Crypto Bank",
        fact: "Your wallet stores your private keys, which prove you own your crypto assets.",
      },
      {
        id: "blockchain",
        concept: "Blockchain",
        definition: "Digital Ledger",
        fact: "A blockchain is a shared record that everyone can verify but no one can cheat.",
      },
    ],
  },
  {
    id: "stablecoins-101",
    name: "Stablecoins 101",
    description: "Understand how stablecoins maintain their value",
    reward: "0.15",
    difficulty: "beginner",
    isLocked: false,
    isActive: true,
    pairs: [
      {
        id: "stablecoin",
        concept: "Stablecoin",
        definition: "Steady Price",
        fact: "Stablecoins are designed to maintain a consistent value, usually pegged to a fiat currency like USD.",
      },
      {
        id: "peg",
        concept: "Peg",
        definition: "Fixed Rate",
        fact: "A peg is a mechanism that keeps a stablecoin's value tied to another asset, like 1 cUSD = 1 USD.",
      },
      {
        id: "reserve",
        concept: "Reserve",
        definition: "Backing Assets",
        fact: "Reserves are assets held to guarantee a stablecoin can be redeemed for its pegged value.",
      },
      {
        id: "volatility",
        concept: "Volatility",
        definition: "Price Swings",
        fact: "Volatility measures how much an asset's price changes. Stablecoins aim for low volatility.",
      },
    ],
  },
  {
    id: "defi-fundamentals",
    name: "DeFi Fundamentals",
    description: "Explore decentralized finance concepts",
    reward: "0.20",
    difficulty: "intermediate",
    isLocked: false,
    isActive: true,
    pairs: [
      {
        id: "defi",
        concept: "DeFi",
        definition: "Open Finance",
        fact: "DeFi stands for Decentralized Finance - financial services without traditional banks or intermediaries.",
      },
      {
        id: "liquidity",
        concept: "Liquidity",
        definition: "Easy Trading",
        fact: "Liquidity means how easily you can buy or sell an asset without affecting its price.",
      },
      {
        id: "yield",
        concept: "Yield",
        definition: "Earnings Rate",
        fact: "Yield is the return you earn on your crypto, similar to interest in a savings account.",
      },
      {
        id: "protocol",
        concept: "Protocol",
        definition: "Smart Rules",
        fact: "A protocol is a set of rules encoded in smart contracts that automate financial operations.",
      },
    ],
  },
  {
    id: "security-essentials",
    name: "Security Essentials",
    description: "Learn to protect your crypto assets",
    reward: "0.25",
    difficulty: "advanced",
    isLocked: false,
    isActive: true,
    pairs: [
      {
        id: "seedphrase",
        concept: "Seed Phrase",
        definition: "Master Key",
        fact: "Your seed phrase is 12-24 words that can recover your entire wallet. Never share it with anyone!",
      },
      {
        id: "phishing",
        concept: "Phishing",
        definition: "Fake Trick",
        fact: "Phishing attacks use fake websites or messages to steal your login credentials and funds.",
      },
      {
        id: "2fa",
        concept: "2FA",
        definition: "Extra Lock",
        fact: "Two-Factor Authentication adds a second layer of security beyond just your password.",
      },
      {
        id: "privatekey",
        concept: "Private Key",
        definition: "Secret Code",
        fact: "Your private key proves ownership of your crypto. If someone gets it, they control your funds.",
      },
    ],
  },
];

async function migrateQuests() {
  try {
    console.log("Starting quest migration...");
    const collection = await getQuestsCollection();

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const quest of existingQuests) {
      try {
        // Check if quest already exists
        const existing = await collection.findOne({ id: quest.id });
        
        if (existing) {
          console.log(`⏭️  Skipping "${quest.name}" (already exists)`);
          skipped++;
          continue;
        }

        // Prepare quest document
        const questDoc = {
          ...quest,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "migration-script",
        };

        // Insert quest
        await collection.insertOne(questDoc);
        console.log(`✅ Imported "${quest.name}" (${quest.id})`);
        imported++;
      } catch (error) {
        console.error(`❌ Error importing "${quest.name}":`, error.message);
        errors++;
      }
    }

    console.log("\n📊 Migration Summary:");
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log("\n✨ Migration complete!");

    // Close MongoDB connection
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateQuests();

