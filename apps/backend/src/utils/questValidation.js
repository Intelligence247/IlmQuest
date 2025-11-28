/**
 * Validation utilities for quest data
 */

/**
 * Validate a quest ID format
 * @param {string} id - Quest ID
 * @returns {boolean}
 */
function isValidQuestId(id) {
  // Quest ID should be lowercase, alphanumeric with hyphens
  // Example: "celo-basics", "nft-101"
  return /^[a-z0-9-]+$/.test(id) && id.length >= 3 && id.length <= 50;
}

/**
 * Validate a card pair
 * @param {object} pair - Card pair object
 * @returns {{ valid: boolean, error?: string }}
 */
function validateCardPair(pair) {
  if (!pair || typeof pair !== "object") {
    return { valid: false, error: "Card pair must be an object" };
  }

  if (!pair.id || typeof pair.id !== "string") {
    return { valid: false, error: "Card pair must have an 'id' field (string)" };
  }

  if (!isValidQuestId(pair.id)) {
    return { valid: false, error: `Invalid card pair ID: ${pair.id}. Must be lowercase alphanumeric with hyphens` };
  }

  if (!pair.concept || typeof pair.concept !== "string" || pair.concept.trim().length === 0) {
    return { valid: false, error: "Card pair must have a 'concept' field (non-empty string)" };
  }

  if (!pair.definition || typeof pair.definition !== "string" || pair.definition.trim().length === 0) {
    return { valid: false, error: "Card pair must have a 'definition' field (non-empty string)" };
  }

  if (!pair.fact || typeof pair.fact !== "string" || pair.fact.trim().length === 0) {
    return { valid: false, error: "Card pair must have a 'fact' field (non-empty string)" };
  }

  // Length limits
  if (pair.concept.length > 100) {
    return { valid: false, error: "Concept must be 100 characters or less" };
  }

  if (pair.definition.length > 100) {
    return { valid: false, error: "Definition must be 100 characters or less" };
  }

  if (pair.fact.length > 500) {
    return { valid: false, error: "Fact must be 500 characters or less" };
  }

  return { valid: true };
}

/**
 * Validate reward amount
 * @param {string} reward - Reward amount in cUSD (e.g., "0.10")
 * @returns {{ valid: boolean, error?: string }}
 */
function validateReward(reward) {
  if (typeof reward !== "string") {
    return { valid: false, error: "Reward must be a string" };
  }

  // Must be a valid decimal number
  const rewardNum = parseFloat(reward);
  if (isNaN(rewardNum) || rewardNum <= 0) {
    return { valid: false, error: "Reward must be a positive number" };
  }

  // Check decimal places (max 2)
  const decimalParts = reward.split(".");
  if (decimalParts.length === 2 && decimalParts[1].length > 2) {
    return { valid: false, error: "Reward must have at most 2 decimal places" };
  }

  // Reasonable upper limit (e.g., 10 cUSD)
  if (rewardNum > 10) {
    return { valid: false, error: "Reward cannot exceed 10 cUSD" };
  }

  return { valid: true };
}

/**
 * Validate a complete quest object
 * @param {object} quest - Quest object
 * @param {boolean} isUpdate - Whether this is an update (id is optional)
 * @returns {{ valid: boolean, errors?: string[] }}
 */
function validateQuest(quest, isUpdate = false) {
  const errors = [];

  // Validate quest ID (required for create, optional for update)
  if (!isUpdate) {
    if (!quest.id || typeof quest.id !== "string") {
      errors.push("Quest must have an 'id' field (string)");
    } else if (!isValidQuestId(quest.id)) {
      errors.push(`Invalid quest ID: ${quest.id}. Must be lowercase alphanumeric with hyphens (3-50 chars)`);
    }
  } else if (quest.id && !isValidQuestId(quest.id)) {
    errors.push(`Invalid quest ID: ${quest.id}`);
  }

  // Validate name
  if (!quest.name || typeof quest.name !== "string" || quest.name.trim().length === 0) {
    errors.push("Quest must have a 'name' field (non-empty string)");
  } else if (quest.name.length > 100) {
    errors.push("Quest name must be 100 characters or less");
  }

  // Validate description
  if (!quest.description || typeof quest.description !== "string" || quest.description.trim().length === 0) {
    errors.push("Quest must have a 'description' field (non-empty string)");
  } else if (quest.description.length > 500) {
    errors.push("Quest description must be 500 characters or less");
  }

  // Validate difficulty
  const validDifficulties = ["beginner", "intermediate", "advanced"];
  if (!quest.difficulty || !validDifficulties.includes(quest.difficulty)) {
    errors.push(`Quest difficulty must be one of: ${validDifficulties.join(", ")}`);
  }

  // Validate reward
  if (!quest.reward || typeof quest.reward !== "string") {
    errors.push("Quest must have a 'reward' field (string, e.g., '0.10')");
  } else {
    const rewardValidation = validateReward(quest.reward);
    if (!rewardValidation.valid) {
      errors.push(`Reward validation failed: ${rewardValidation.error}`);
    }
  }

  // Validate pairs
  if (!Array.isArray(quest.pairs)) {
    errors.push("Quest must have a 'pairs' field (array)");
  } else if (quest.pairs.length !== 4) {
    errors.push("Quest must have exactly 4 card pairs (8 cards total)");
  } else {
    // Validate each pair
    const pairIds = new Set();
    quest.pairs.forEach((pair, index) => {
      const pairValidation = validateCardPair(pair);
      if (!pairValidation.valid) {
        errors.push(`Pair ${index + 1}: ${pairValidation.error}`);
      } else {
        // Check for duplicate pair IDs
        if (pairIds.has(pair.id)) {
          errors.push(`Duplicate pair ID found: ${pair.id}. Each pair must have a unique ID.`);
        }
        pairIds.add(pair.id);
      }
    });
  }

  // Validate isLocked (optional, defaults to false)
  if (quest.isLocked !== undefined && typeof quest.isLocked !== "boolean") {
    errors.push("Quest 'isLocked' must be a boolean");
  }

  // Validate isActive (optional, defaults to true)
  if (quest.isActive !== undefined && typeof quest.isActive !== "boolean") {
    errors.push("Quest 'isActive' must be a boolean");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

module.exports = {
  isValidQuestId,
  validateCardPair,
  validateReward,
  validateQuest,
};

