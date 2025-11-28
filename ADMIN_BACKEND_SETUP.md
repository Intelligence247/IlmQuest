# Admin Backend Setup - Complete Guide

## ✅ What We've Built

A secure, database-driven quest management system with admin authentication.

---

## 📁 Files Created/Modified

### New Files:
1. **`apps/backend/src/db/mongo.js`** (modified)
   - Added `getQuestsCollection()` function

2. **`apps/backend/src/middleware/adminAuth.js`** (new)
   - Wallet signature-based admin authentication
   - Verifies admin wallet whitelist
   - Validates signatures using ethers.js

3. **`apps/backend/src/utils/questValidation.js`** (new)
   - Comprehensive quest data validation
   - Validates quest IDs, card pairs, rewards, etc.

4. **`apps/backend/src/routes/adminQuests.js`** (new)
   - Admin-only quest management endpoints
   - CRUD operations for quests

5. **`apps/backend/src/routes/publicQuests.js`** (new)
   - Public endpoints for frontend to fetch active quests

6. **`apps/backend/scripts/migrateQuests.js`** (new)
   - Migration script to import existing quests to database

### Modified Files:
1. **`apps/backend/src/config/env.js`**
   - Added `ADMIN_WALLETS` parsing and validation

2. **`apps/backend/env.example`**
   - Added `ADMIN_WALLETS` configuration

3. **`apps/backend/src/routes/verifyGame.js`**
   - Updated to read rewards from database instead of hardcoded values

4. **`apps/backend/src/server.js`**
   - Mounted new admin and public quest routes

---

## 🔐 Security Features

### 1. Admin Authentication
- **Wallet Signature Verification**: Admins must sign a message with their wallet
- **Whitelist**: Only wallets in `ADMIN_WALLETS` can access admin routes
- **Message Signing**: Uses standard Ethereum message signing (EIP-191)

### 2. Request Headers Required
```
x-admin-address: 0x...
x-admin-signature: 0x...
x-admin-message: "Admin authentication for IlmQuest"
```

### 3. Validation
- Server-side validation for all quest data
- Prevents invalid quest IDs, duplicate pairs, etc.
- Reward amount validation (0-10 cUSD, max 2 decimals)

---

## 🗄️ Database Schema

### Quests Collection
```javascript
{
  id: "celo-basics",                    // Unique, lowercase, alphanumeric with hyphens
  name: "Celo Basics",                   // Quest name
  description: "...",                     // Quest description
  reward: "0.10",                        // Reward in cUSD (string)
  difficulty: "beginner",                // beginner | intermediate | advanced
  isLocked: false,                       // Whether quest is locked
  isActive: true,                        // Whether quest is active (soft delete)
  pairs: [                                // Exactly 4 pairs
    {
      id: "cusd",
      concept: "cUSD",
      definition: "Stable Value",
      fact: "..."
    },
    // ... 3 more pairs
  ],
  createdAt: Date,
  updatedAt: Date,
  createdBy: "0x...",                    // Admin wallet address
  updatedBy: "0x..."                      // Admin wallet address (on updates)
}
```

### Indexes
- `id`: Unique index
- `isActive, isLocked`: Compound index for filtering
- `createdAt`: Descending index for sorting

---

## 📡 API Endpoints

### Public Endpoints (No Auth Required)

#### `GET /api/quests`
Get all active, unlocked quests.

**Response:**
```json
{
  "quests": [
    {
      "id": "celo-basics",
      "name": "Celo Basics",
      "description": "...",
      "reward": "0.10 cUSD",
      "difficulty": "beginner",
      "isLocked": false,
      "pairs": [...]
    }
  ]
}
```

#### `GET /api/quests/:id`
Get a specific quest by ID.

---

### Admin Endpoints (Auth Required)

All admin endpoints require these headers:
- `x-admin-address`: Admin wallet address
- `x-admin-signature`: Signature of the message
- `x-admin-message`: Message to sign (default: "Admin authentication for IlmQuest")

#### `GET /api/admin/quests`
Get all quests (including inactive/locked).

**Query Params:**
- `includeInactive`: true/false (default: true)

#### `GET /api/admin/quests/:id`
Get a specific quest by ID.

#### `POST /api/admin/quests`
Create a new quest.

**Body:**
```json
{
  "id": "nft-basics",
  "name": "NFT Basics",
  "description": "Learn about NFTs",
  "reward": "0.20",
  "difficulty": "intermediate",
  "isLocked": false,
  "isActive": true,
  "pairs": [
    {
      "id": "nft",
      "concept": "NFT",
      "definition": "Unique Digital Asset",
      "fact": "..."
    },
    // ... 3 more pairs
  ]
}
```

#### `PUT /api/admin/quests/:id`
Update an existing quest.

**Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "reward": "0.25",
  "isActive": false,
  // ... any fields to update
}
```

#### `DELETE /api/admin/quests/:id`
Delete a quest (soft delete by default).

**Query Params:**
- `hardDelete`: true (to permanently delete from database)

---

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

Add to your `.env` file:

```env
# Add your admin wallet addresses (comma-separated)
ADMIN_WALLETS=0x1234567890123456789012345678901234567890,0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
```

**Important:**
- Use comma-separated list for multiple admins
- Addresses are case-insensitive (automatically normalized)
- Only these wallets can access admin routes

### Step 2: Run Migration Script

Import existing quests to database:

```bash
cd apps/backend
node scripts/migrateQuests.js
```

This will:
- Import all 4 existing quests
- Skip if they already exist
- Show summary of imported/skipped/errors

### Step 3: Start Backend Server

```bash
cd apps/backend
pnpm dev
```

### Step 4: Test Admin Authentication

You can test admin endpoints using curl or Postman:

```bash
# First, sign a message with your admin wallet
# Message: "Admin authentication for IlmQuest"
# Then use the signature in the request:

curl -X GET http://localhost:4000/api/admin/quests \
  -H "x-admin-address: 0x..." \
  -H "x-admin-signature: 0x..." \
  -H "x-admin-message: Admin authentication for IlmQuest"
```

---

## 🔄 Migration from Hardcoded Quests

The system now reads quests from the database instead of hardcoded values:

1. ✅ **Backend**: `verifyGame.js` reads rewards from database
2. ✅ **Migration**: Script imports existing quests
3. ⏳ **Frontend**: Still needs to be updated to fetch from API (next step)

---

## ✅ Validation Rules

### Quest ID
- Lowercase alphanumeric with hyphens
- 3-50 characters
- Must be unique

### Card Pairs
- Exactly 4 pairs required
- Each pair must have unique ID
- Concept, definition, fact: all required, non-empty strings
- Max lengths: concept (100), definition (100), fact (500)

### Reward
- Must be positive number
- Max 2 decimal places
- Max 10 cUSD

### Difficulty
- Must be: "beginner", "intermediate", or "advanced"

---

## 🛡️ Security Best Practices

1. **Never commit `.env` file** - Keep admin wallets secret
2. **Use different wallets** - Separate admin wallet from oracle signer
3. **Rotate admin wallets** - Remove old admins, add new ones
4. **Monitor admin activity** - Check `createdBy`/`updatedBy` fields
5. **Rate limiting** - Consider adding rate limits to admin endpoints (future)

---

## 📝 Next Steps

1. ✅ Backend complete (this step)
2. ⏳ Frontend: Update to fetch quests from API
3. ⏳ Admin Dashboard UI: Build admin interface
4. ⏳ Testing: Test all CRUD operations

---

## 🐛 Troubleshooting

### "ADMIN_NOT_CONFIGURED" Error
- Make sure `ADMIN_WALLETS` is set in `.env`
- Restart server after adding env variable

### "UNAUTHORIZED" Error
- Check that your wallet address is in `ADMIN_WALLETS`
- Ensure addresses match (case-insensitive)

### "INVALID_SIGNATURE" Error
- Make sure you're signing the exact message
- Default message: "Admin authentication for IlmQuest"
- Verify signature is correct for the address

### Quest Not Found
- Run migration script: `node scripts/migrateQuests.js`
- Check MongoDB connection
- Verify quest `isActive: true`

---

## 📚 Related Documentation

- `ADDING_NEW_QUESTS.md` - Guide for adding quests (will be updated for admin dashboard)
- `PROFILE_DATA_EXPLANATION.md` - Profile page data explanation

---

**Backend setup complete! Ready for frontend integration.** 🎉

