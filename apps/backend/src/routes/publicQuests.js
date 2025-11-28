const { Router } = require("express");
const { getQuestsCollection } = require("../db/mongo");

const router = Router();

/**
 * GET /api/quests
 * 
 * Get all active, unlocked quests (public endpoint)
 * 
 * Response:
 * {
 *   "quests": [
 *     {
 *       "id": "celo-basics",
 *       "name": "Celo Basics",
 *       "description": "...",
 *       "reward": "0.10 cUSD",
 *       "difficulty": "beginner",
 *       "isLocked": false,
 *       "pairs": [...]
 *     },
 *     ...
 *   ]
 * }
 */
router.get("/api/quests", async (req, res) => {
  try {
    const collection = await getQuestsCollection();

    // Only return active, unlocked quests
    const quests = await collection
      .find({
        isActive: true,
        isLocked: false,
      })
      .sort({ createdAt: 1 }) // Oldest first (or you could sort by difficulty, etc.)
      .toArray();

    // Format response for frontend (add "cUSD" to reward, remove internal fields)
    const formattedQuests = quests.map((quest) => ({
      id: quest.id,
      name: quest.name,
      description: quest.description,
      reward: `${quest.reward} cUSD`,
      difficulty: quest.difficulty,
      isLocked: quest.isLocked,
      pairs: quest.pairs,
    }));

    return res.json({ quests: formattedQuests });
  } catch (err) {
    console.error("Error fetching public quests:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

/**
 * GET /api/quests/:id
 * 
 * Get a specific quest by ID (public endpoint)
 */
router.get("/api/quests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getQuestsCollection();

    const quest = await collection.findOne({
      id,
      isActive: true,
    });

    if (!quest) {
      return res.status(404).json({ error: "QUEST_NOT_FOUND" });
    }

    // Format response
    const formattedQuest = {
      id: quest.id,
      name: quest.name,
      description: quest.description,
      reward: `${quest.reward} cUSD`,
      difficulty: quest.difficulty,
      isLocked: quest.isLocked,
      pairs: quest.pairs,
    };

    return res.json({ quest: formattedQuest });
  } catch (err) {
    console.error("Error fetching quest:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

module.exports = router;

