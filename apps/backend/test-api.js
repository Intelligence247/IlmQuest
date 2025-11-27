/**
 * Simple test script for /api/verify-game endpoint
 * Run this while the backend server is running
 */

const testVerifyGame = async () => {
  const testData = {
    userAddress: "0x93774eD7296373e372547587A3cC6EF3C0Cc7b66", // Your wallet address
    levelId: "celo-basics",
    duration: 45, // seconds (realistic game time)
    moves: 16, // realistic number of moves
    timestamp: Math.floor(Date.now() / 1000),
  };

  try {
    console.log("Testing /api/verify-game endpoint...");
    console.log("Sending:", testData);
    console.log("\n");

    const response = await fetch("http://localhost:4000/api/verify-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ SUCCESS!");
      console.log("\nResponse:");
      console.log("- Signature:", result.signature);
      console.log("- Reward Amount:", result.rewardAmount, "wei");
      console.log("- Nonce:", result.nonce);
      console.log("- Level ID:", result.levelId);
      console.log("\n✅ Backend is working correctly!");
    } else {
      console.log("❌ ERROR:", result.error);
      console.log("Details:", result);
    }
  } catch (error) {
    console.error("❌ Request failed:", error.message);
  }
};

// Run the test
testVerifyGame();

