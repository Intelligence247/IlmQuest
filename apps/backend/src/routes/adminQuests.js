const { Router } = require("express");
const { getQuestsCollection } = require("../db/mongo");
const { verifyAdminAuth } = require("../middleware/adminAuth");
const { validateQuest } = require("../utils/questValidation");

const router = Router();

// All routes in this file require admin authentication
router.use(verifyAdminAuth);

/**
 * GET /api/admin/quests
 * 
 * Get all quests (including inactive/locked ones)
 * Query params:
 *   - includeInactive: true/false (default: true)
 * 
 * Response:
 * {
 *   "quests": [...]
 * }
 */
router.get("/api/admin/quests", async (req, res) => {
  try {
    const collection = await getQuestsCollection();
    const includeInactive = req.query.includeInactive !== "false";

    const query = includeInactive ? {} : { isActive: true };

    const quests = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({ quests });
  } catch (err) {
    console.error("Error fetching admin quests:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

/**
 * GET /api/admin/quests/:id
 * 
 * Get a specific quest by ID
 */
router.get("/api/admin/quests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getQuestsCollection();

    const quest = await collection.findOne({ id });

    if (!quest) {
      return res.status(404).json({ error: "QUEST_NOT_FOUND" });
    }

    return res.json({ quest });
  } catch (err) {
    console.error("Error fetching quest:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

/**
 * POST /api/admin/quests
 * 
 * Create a new quest
 * 
 * Body:
 * {
 *   "id": "nft-basics",
 *   "name": "NFT Basics",
 *   "description": "...",
 *   "reward": "0.20",
 *   "difficulty": "intermediate",
 *   "isLocked": false,
 *   "isActive": true,
 *   "pairs": [...]
 * }
 */
router.post("/api/admin/quests", async (req, res) => {
  try {
    const quest = req.body;
    const collection = await getQuestsCollection();

    // Validate quest data
    const validation = validateQuest(quest, false);
    if (!validation.valid) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Quest validation failed",
        errors: validation.errors,
      });
    }

    // Check if quest with this ID already exists
    const existing = await collection.findOne({ id: quest.id });
    if (existing) {
      return res.status(409).json({
        error: "QUEST_EXISTS",
        message: `A quest with ID "${quest.id}" already exists`,
      });
    }

    // Prepare quest document
    const questDoc = {
      id: quest.id,
      name: quest.name.trim(),
      description: quest.description.trim(),
      reward: quest.reward,
      difficulty: quest.difficulty,
      isLocked: quest.isLocked ?? false,
      isActive: quest.isActive ?? true,
      pairs: quest.pairs.map((pair) => ({
        id: pair.id,
        concept: pair.concept.trim(),
        definition: pair.definition.trim(),
        fact: pair.fact.trim(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.adminAddress,
    };

    // Insert quest
    await collection.insertOne(questDoc);

    return res.status(201).json({
      message: "Quest created successfully",
      quest: questDoc,
    });
  } catch (err) {
    console.error("Error creating quest:", err);
    
    // Handle duplicate key error (MongoDB unique index)
    if (err.code === 11000) {
      return res.status(409).json({
        error: "QUEST_EXISTS",
        message: "A quest with this ID already exists",
      });
    }

    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

/**
 * PUT /api/admin/quests/:id
 * 
 * Update an existing quest
 * 
 * Body: (all fields optional except those being updated)
 * {
 *   "name": "...",
 *   "description": "...",
 *   "reward": "0.25",
 *   "difficulty": "advanced",
 *   "isLocked": false,
 *   "isActive": true,
 *   "pairs": [...]
 * }
 */
router.put("/api/admin/quests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const collection = await getQuestsCollection();

    // Check if quest exists
    const existing = await collection.findOne({ id });
    if (!existing) {
      return res.status(404).json({ error: "QUEST_NOT_FOUND" });
    }

    // Build update object (only include fields that are being updated)
    const updateDoc = {
      updatedAt: new Date(),
      updatedBy: req.adminAddress,
    };

    // Validate and add fields if provided
    if (updates.name !== undefined) {
      if (typeof updates.name !== "string" || updates.name.trim().length === 0) {
        return res.status(400).json({ error: "INVALID_NAME", message: "Name must be a non-empty string" });
      }
      updateDoc.name = updates.name.trim();
    }

    if (updates.description !== undefined) {
      if (typeof updates.description !== "string" || updates.description.trim().length === 0) {
        return res.status(400).json({ error: "INVALID_DESCRIPTION", message: "Description must be a non-empty string" });
      }
      updateDoc.description = updates.description.trim();
    }

    if (updates.reward !== undefined) {
      const rewardValidation = require("../utils/questValidation").validateReward(updates.reward);
      if (!rewardValidation.valid) {
        return res.status(400).json({ error: "INVALID_REWARD", message: rewardValidation.error });
      }
      updateDoc.reward = updates.reward;
    }

    if (updates.difficulty !== undefined) {
      const validDifficulties = ["beginner", "intermediate", "advanced"];
      if (!validDifficulties.includes(updates.difficulty)) {
        return res.status(400).json({
          error: "INVALID_DIFFICULTY",
          message: `Difficulty must be one of: ${validDifficulties.join(", ")}`,
        });
      }
      updateDoc.difficulty = updates.difficulty;
    }

    if (updates.isLocked !== undefined) {
      if (typeof updates.isLocked !== "boolean") {
        return res.status(400).json({ error: "INVALID_IS_LOCKED", message: "isLocked must be a boolean" });
      }
      updateDoc.isLocked = updates.isLocked;
    }

    if (updates.isActive !== undefined) {
      if (typeof updates.isActive !== "boolean") {
        return res.status(400).json({ error: "INVALID_IS_ACTIVE", message: "isActive must be a boolean" });
      }
      updateDoc.isActive = updates.isActive;
    }

    if (updates.pairs !== undefined) {
      if (!Array.isArray(updates.pairs) || updates.pairs.length !== 4) {
        return res.status(400).json({
          error: "INVALID_PAIRS",
          message: "Pairs must be an array with exactly 4 items",
        });
      }

      // Validate each pair
      const { validateCardPair } = require("../utils/questValidation");
      const pairIds = new Set();
      for (let i = 0; i < updates.pairs.length; i++) {
        const pair = updates.pairs[i];
        const pairValidation = validateCardPair(pair);
        if (!pairValidation.valid) {
          return res.status(400).json({
            error: "INVALID_PAIR",
            message: `Pair ${i + 1}: ${pairValidation.error}`,
          });
        }
        if (pairIds.has(pair.id)) {
          return res.status(400).json({
            error: "DUPLICATE_PAIR_ID",
            message: `Duplicate pair ID: ${pair.id}`,
          });
        }
        pairIds.add(pair.id);
      }

      updateDoc.pairs = updates.pairs.map((pair) => ({
        id: pair.id,
        concept: pair.concept.trim(),
        definition: pair.definition.trim(),
        fact: pair.fact.trim(),
      }));
    }

    // Update quest
    const result = await collection.updateOne(
      { id },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "QUEST_NOT_FOUND" });
    }

    // Fetch updated quest
    const updatedQuest = await collection.findOne({ id });

    return res.json({
      message: "Quest updated successfully",
      quest: updatedQuest,
    });
  } catch (err) {
    console.error("Error updating quest:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

/**
 * DELETE /api/admin/quests/:id
 * 
 * Delete a quest (soft delete by setting isActive: false)
 * Query params:
 *   - hardDelete: true (to actually delete from database)
 */
router.delete("/api/admin/quests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const hardDelete = req.query.hardDelete === "true";
    const collection = await getQuestsCollection();

    // Check if quest exists
    const existing = await collection.findOne({ id });
    if (!existing) {
      return res.status(404).json({ error: "QUEST_NOT_FOUND" });
    }

    if (hardDelete) {
      // Hard delete (remove from database)
      await collection.deleteOne({ id });
      return res.json({ message: "Quest permanently deleted" });
    } else {
      // Soft delete (set isActive: false)
      await collection.updateOne(
        { id },
        {
          $set: {
            isActive: false,
            updatedAt: new Date(),
            updatedBy: req.adminAddress,
          },
        }
      );
      return res.json({ message: "Quest deactivated (soft deleted)" });
    }
  } catch (err) {
    console.error("Error deleting quest:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

module.exports = router;

