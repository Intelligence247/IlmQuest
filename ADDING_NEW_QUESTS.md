# Guide: Adding New Quests to IlmQuest

This guide explains how to add new quiz quests to the IlmQuest dApp.

## Overview

Each quest consists of:
1. **Card Pairs**: Concept-definition pairs for the memory matching game
2. **Quest Metadata**: Name, description, reward, difficulty
3. **Backend Configuration**: Reward amount mapping

## Step-by-Step Instructions

### 1. Create Card Pairs

Open `apps/frontend/lib/game-data.ts` and add a new deck of card pairs:

```typescript
export const yourNewDeck: CardPair[] = [
  {
    id: "unique-id-1",
    concept: "Concept Name",
    definition: "Short Definition",
    fact: "Educational fact that appears when matched. This should be informative and help users learn.",
  },
  {
    id: "unique-id-2",
    concept: "Another Concept",
    definition: "Another Definition",
    fact: "Another educational fact...",
  },
  // Add 4 pairs total (8 cards = 4 matches)
]
```

**Important Notes:**
- Each quest must have exactly **4 pairs** (8 cards total)
- Each `id` must be unique across all decks
- The `fact` appears when users match a pair - make it educational!

### 2. Add Quest to Quest Decks

In the same file, add your quest to the `questDecks` array:

```typescript
export const questDecks: QuestDeck[] = [
  // ... existing quests ...
  {
    id: "your-quest-id",  // Must match backend reward mapping
    name: "Your Quest Name",
    description: "Brief description of what users will learn",
    reward: "0.30 cUSD",  // Display reward (must match backend)
    difficulty: "beginner" | "intermediate" | "advanced",
    isLocked: false,  // Set to true to hide until ready
    pairs: yourNewDeck,
  },
]
```

**Reward Guidelines:**
- Beginner: 0.10 - 0.15 cUSD
- Intermediate: 0.15 - 0.20 cUSD
- Advanced: 0.20 - 0.25 cUSD

### 3. Add Backend Reward Mapping

Open `apps/backend/src/routes/verifyGame.js` and add your quest to the `REWARD_AMOUNTS` object:

```javascript
const REWARD_AMOUNTS = {
  "celo-basics": "0.10",
  "stablecoins-101": "0.15",
  "defi-fundamentals": "0.20",
  "security-essentials": "0.25",
  "your-quest-id": "0.30",  // Must match the id in questDecks
};
```

**Important:** The `id` in `questDecks` must exactly match the key in `REWARD_AMOUNTS`.

### 4. Test Your Quest

1. Start the frontend: `cd apps/frontend && pnpm dev`
2. Start the backend: `cd apps/backend && pnpm dev`
3. Navigate to `/play` and find your new quest
4. Complete the quest and verify:
   - Cards match correctly
   - Facts display properly
   - Reward is claimed correctly
   - Balance updates

## Example: Adding "NFT Basics" Quest

### Step 1: Create Card Pairs

```typescript
export const nftBasicsDeck: CardPair[] = [
  {
    id: "nft",
    concept: "NFT",
    definition: "Unique Digital Asset",
    fact: "NFT stands for Non-Fungible Token - each NFT is unique and cannot be replaced.",
  },
  {
    id: "minting",
    concept: "Minting",
    definition: "Creating NFT",
    fact: "Minting is the process of creating a new NFT and recording it on the blockchain.",
  },
  {
    id: "marketplace",
    concept: "Marketplace",
    definition: "NFT Store",
    fact: "NFT marketplaces are platforms where you can buy, sell, and trade NFTs.",
  },
  {
    id: "metadata",
    concept: "Metadata",
    definition: "NFT Information",
    fact: "Metadata contains information about an NFT, like its name, description, and image URL.",
  },
]
```

### Step 2: Add to Quest Decks

```typescript
{
  id: "nft-basics",
  name: "NFT Basics",
  description: "Learn about non-fungible tokens and digital ownership",
  reward: "0.20 cUSD",
  difficulty: "intermediate",
  isLocked: false,
  pairs: nftBasicsDeck,
}
```

### Step 3: Add Backend Mapping

```javascript
const REWARD_AMOUNTS = {
  // ... existing ...
  "nft-basics": "0.20",
};
```

## Replay Logic

Users can replay quests after **24 hours** for revision. The system:
- Tracks completion in MongoDB
- Shows completion status on quest cards
- Prevents claiming rewards within 24 hours
- Allows unlimited replays after cooldown

## Tips for Creating Good Quests

1. **Educational Value**: Focus on teaching real crypto concepts
2. **Clear Definitions**: Keep definitions short and memorable
3. **Interesting Facts**: Make facts engaging and informative
4. **Progressive Difficulty**: Start with basics, build to advanced
5. **Consistent Theme**: Keep all pairs in a quest related to one topic

## Troubleshooting

**Quest doesn't appear:**
- Check `isLocked: false`
- Verify the quest is in `questDecks` array
- Restart the frontend dev server

**Reward doesn't match:**
- Ensure `id` matches in both frontend and backend
- Check reward amount format (e.g., "0.20" not "0.2")
- Restart backend server after changes

**Cards not matching:**
- Verify each pair has unique `id`
- Check that concept and definition are properly paired
- Ensure exactly 4 pairs (8 cards total)

