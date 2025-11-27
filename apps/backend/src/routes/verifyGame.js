const { Router } = require("express");
const { parseEther, formatEther } = require("ethers");
const env = require("../config/env");
const { getGameSessionsCollection } = require("../db/mongo");
const { generateNonce, signRewardAuthorization } = require("../services/signing");

const router = Router();

// Replay logic: Users can replay a quest after 24 hours for revision
// First completion: Full reward
// Replay (after 24h): Full reward (for revision/learning)
const REPLAY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Reward amounts per quest (in cUSD, will be converted to wei)
const REWARD_AMOUNTS = {
  "celo-basics": "0.10",
  "stablecoins-101": "0.15",
  "defi-fundamentals": "0.20",
  "security-essentials": "0.25",
};

/**
 * Get reward amount for a level ID
 * @param {string} levelId - The level ID
 * @returns {bigint} Reward amount in wei
 */
function getRewardAmount(levelId) {
  const amount = REWARD_AMOUNTS[levelId];
  if (!amount) {
    // Default to 0.1 cUSD if level not found
    console.warn(`Unknown levelId: ${levelId}, using default reward 0.1 cUSD`);
    return parseEther("0.1");
  }
  return parseEther(amount);
}

/**
 * POST /api/verify-game
 *
 * Body:
 * {
 *   "userAddress": "0x...",
 *   "levelId": "celo-basics",
 *   "duration": 42,
 *   "moves": 18
 * }
 *
 * Response:
 * {
 *   "signature": "0x...",
 *   "rewardAmount": "100000000000000000",
 *   "nonce": "0x...",
 *   "levelId": "celo-basics"
 * }
 */
router.post("/api/verify-game", async (req, res) => {
  try {
    const { userAddress, levelId, duration, moves } = req.body;

    // --- Validation ---
    if (!userAddress || !/^0x[0-9a-fA-F]{40}$/.test(userAddress)) {
      return res.status(400).json({ error: "INVALID_ADDRESS" });
    }

    if (!levelId || typeof levelId !== "string") {
      return res.status(400).json({ error: "INVALID_LEVEL_ID" });
    }

    if (typeof duration !== "number" || duration < 10) {
      return res.status(400).json({ error: "DURATION_TOO_SHORT" });
    }

    if (typeof moves !== "number" || moves < 4 || moves > 200) {
      return res.status(400).json({ error: "UNREALISTIC_MOVES" });
    }

    // --- Replay Logic ---
    const collection = await getGameSessionsCollection();
    const now = new Date();
    const cutoff = new Date(now.getTime() - REPLAY_COOLDOWN_MS);

    // Check if user completed this quest recently (within 24 hours)
    const recent = await collection.findOne({
      walletAddress: userAddress.toLowerCase(),
      levelId,
      status: "COMPLETED",
      createdAt: { $gte: cutoff },
    });

    if (recent) {
      const hoursRemaining = Math.ceil((recent.createdAt.getTime() + REPLAY_COOLDOWN_MS - now.getTime()) / (60 * 60 * 1000));
      return res.status(429).json({
        error: "REPLAY_COOLDOWN",
        message: `You can replay this quest in ${hoursRemaining} hour(s) for revision.`,
        hoursRemaining,
      });
    }

    // --- Generate Signature ---
    const nonce = generateNonce();
    const rewardAmountWei = getRewardAmount(levelId);

    const signature = await signRewardAuthorization({
      vaultAddress: env.VAULT_ADDRESS,
      chainId: env.CHAIN_ID,
      userAddress,
      levelId,
      rewardAmountWei,
      nonce,
    });

    // --- Save Session ---
    await collection.insertOne({
      walletAddress: userAddress.toLowerCase(),
      levelId,
      status: "COMPLETED",
      durationSeconds: duration,
      moves,
      rewardAmount: rewardAmountWei.toString(),
      createdAt: now,
    });

    // --- Response ---
    return res.json({
      signature,
      rewardAmount: rewardAmountWei.toString(),
      nonce,
      levelId,
    });
  } catch (err) {
    console.error("Error in /api/verify-game:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

/**
 * GET /api/quest-status/:levelId
 * 
 * Query params:
 *   userAddress: 0x...
 * 
 * Response:
 * {
 *   "completed": true,
 *   "canReplay": false,
 *   "lastCompleted": "2024-01-01T00:00:00.000Z",
 *   "hoursUntilReplay": 12
 * }
 */
router.get("/api/quest-status/:levelId", async (req, res) => {
  try {
    const { levelId } = req.params;
    const { userAddress } = req.query;

    if (!userAddress || !/^0x[0-9a-fA-F]{40}$/.test(userAddress)) {
      return res.status(400).json({ error: "INVALID_ADDRESS" });
    }

    const collection = await getGameSessionsCollection();
    
    // Find the most recent completion
    const lastCompletion = await collection.findOne(
      {
        walletAddress: userAddress.toLowerCase(),
        levelId,
        status: "COMPLETED",
      },
      { sort: { createdAt: -1 } }
    );

    if (!lastCompletion) {
      return res.json({
        completed: false,
        canReplay: true,
        lastCompleted: null,
        hoursUntilReplay: 0,
      });
    }

    const now = new Date();
    const timeSinceCompletion = now.getTime() - lastCompletion.createdAt.getTime();
    const canReplay = timeSinceCompletion >= REPLAY_COOLDOWN_MS;
    const hoursUntilReplay = canReplay
      ? 0
      : Math.ceil((REPLAY_COOLDOWN_MS - timeSinceCompletion) / (60 * 60 * 1000));

    return res.json({
      completed: true,
      canReplay,
      lastCompleted: lastCompletion.createdAt,
      hoursUntilReplay,
    });
  } catch (err) {
    console.error("Error in /api/quest-status:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

/**
 * GET /api/user-stats
 * 
 * Query params:
 *   userAddress: 0x...
 * 
 * Response:
 * {
 *   "questsCompleted": 5,
 *   "totalEarned": "0.75",
 *   "currentStreak": 3,
 *   "bestStreak": 5,
 *   "totalMoves": 120,
 *   "averageTime": "2:34",
 *   "achievements": [...]
 * }
 */
router.get("/api/user-stats", async (req, res) => {
  try {
    const { userAddress } = req.query;

    if (!userAddress || !/^0x[0-9a-fA-F]{40}$/.test(userAddress)) {
      return res.status(400).json({ error: "INVALID_ADDRESS" });
    }

    const collection = await getGameSessionsCollection();
    const walletAddress = userAddress.toLowerCase();

    // Get all completed sessions
    const sessions = await collection
      .find({
        walletAddress,
        status: "COMPLETED",
      })
      .sort({ createdAt: 1 }) // Oldest first for streak calculation
      .toArray();

    // Calculate basic stats
    const questsCompleted = sessions.length;
    
    // Calculate total earned (sum of all rewardAmount in wei, convert to cUSD)
    let totalEarnedWei = BigInt(0);
    let totalMoves = 0;
    let totalDuration = 0;

    sessions.forEach((session) => {
      totalEarnedWei += BigInt(session.rewardAmount || "0");
      totalMoves += session.moves || 0;
      totalDuration += session.durationSeconds || 0;
    });

    const totalEarned = formatEther(totalEarnedWei);
    const averageTime = questsCompleted > 0 ? Math.round(totalDuration / questsCompleted) : 0;

    // Format average time as MM:SS
    const minutes = Math.floor(averageTime / 60);
    const seconds = averageTime % 60;
    const averageTimeFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    sessions.forEach((session) => {
      const sessionDate = new Date(session.createdAt);
      const sessionDay = sessionDate.toDateString();

      if (lastDate === null) {
        // First session
        tempStreak = 1;
        lastDate = sessionDay;
      } else if (sessionDay === lastDate) {
        // Same day, don't increment
        // (multiple quests on same day count as 1 day)
      } else {
        // Check if consecutive day
        const lastDateObj = new Date(lastDate);
        const sessionDateObj = new Date(sessionDay);
        const daysDiff = Math.floor((sessionDateObj - lastDateObj) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Consecutive day
          tempStreak++;
        } else {
          // Streak broken
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
        lastDate = sessionDay;
      }
    });

    // Update best streak with final temp streak
    bestStreak = Math.max(bestStreak, tempStreak);

    // Check if current streak is still active (last completion was today or yesterday)
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

    if (sessions.length > 0) {
      const lastSessionDate = new Date(sessions[sessions.length - 1].createdAt).toDateString();
      if (lastSessionDate === today || lastSessionDate === yesterday) {
        currentStreak = tempStreak;
      }
    }

    // Calculate achievements
    const achievements = [
      {
        id: "first-quest",
        name: "First Steps",
        description: "Complete your first quest",
        earned: questsCompleted >= 1,
      },
      {
        id: "speed-demon",
        name: "Speed Demon",
        description: "Complete a quest under 2 minutes",
        earned: sessions.some((s) => (s.durationSeconds || 0) < 120),
      },
      {
        id: "perfect-memory",
        name: "Perfect Memory",
        description: "Complete a quest in minimum moves (8 moves for 4 pairs)",
        earned: sessions.some((s) => (s.moves || 0) <= 8),
      },
      {
        id: "streak-3",
        name: "On Fire",
        description: "Maintain a 3-day streak",
        earned: bestStreak >= 3,
      },
      {
        id: "quest-master",
        name: "Quest Master",
        description: "Complete 5 quests",
        earned: questsCompleted >= 5,
      },
      {
        id: "scholar",
        name: "Scholar",
        description: "Earn 1.0 cUSD total",
        earned: parseFloat(totalEarned) >= 1.0,
      },
    ];

    return res.json({
      questsCompleted,
      totalEarned: parseFloat(totalEarned).toFixed(2),
      currentStreak,
      bestStreak,
      totalMoves,
      averageTime: averageTimeFormatted,
      achievements,
    });
  } catch (err) {
    console.error("Error in /api/user-stats:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

module.exports = router;

