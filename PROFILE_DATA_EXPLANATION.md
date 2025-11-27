# Profile Page Data Explanation

This document explains each data point shown on the profile page (`/profile`) and where it comes from.

## ✅ All Data is Now Real (No Hardcoded Values)

All profile data is fetched from the backend API (`/api/user-stats`) which calculates statistics from MongoDB game sessions.

---

## Profile Header Section

### 1. **Wallet Address** (`0x9377...7b66`)
- **Source**: User's connected wallet address from `useWallet()` hook
- **Display**: Truncated to show first 6 and last 4 characters
- **Status**: ✅ Real data from wallet connection

### 2. **Balance** (`0.60 cUSD`)
- **Source**: ERC20 token balance fetched from blockchain
- **Display**: Shows current cUSD (reward token) balance in wallet
- **Status**: ✅ Real data from smart contract `balanceOf()` call
- **Updates**: Refreshes automatically every 10 seconds

### 3. **Avatar Initials** (`93`)
- **Source**: Derived from wallet address (characters 2-4 of address)
- **Display**: First two hex characters of address (after `0x`)
- **Status**: ✅ Real data (derived from wallet address)

### 4. **User Title** (`Scholar`)
- **Source**: Static label (not user-specific)
- **Display**: Always shows "Scholar"
- **Status**: ⚠️ Static text (could be made dynamic based on achievements in future)

---

## Stats Cards (Top Section)

### 5. **Total Earned** (`0.60 cUSD`)
- **Source**: Backend API - Sum of all `rewardAmount` from completed game sessions
- **Calculation**: 
  ```javascript
  totalEarned = sum of all session.rewardAmount (in wei) converted to cUSD
  ```
- **Status**: ✅ Real data from MongoDB `GameSessions` collection
- **Updates**: Refreshes when new quests are completed

### 6. **Quests Done** (`5`)
- **Source**: Backend API - Count of completed game sessions
- **Calculation**: 
  ```javascript
  questsCompleted = count of sessions where status === "COMPLETED"
  ```
- **Status**: ✅ Real data from MongoDB
- **Note**: Includes replays (quests completed multiple times)

---

## Your Stats Section

### 7. **Day Streak** (`3`)
- **Source**: Backend API - Calculated from completion dates
- **Calculation**: 
  - Counts consecutive days with at least one quest completion
  - Only counts if last completion was today or yesterday (active streak)
  - Multiple quests on same day count as 1 day
- **Status**: ✅ Real data (calculated from `createdAt` timestamps)
- **Example**: If you completed quests on Mon, Tue, Wed → streak = 3

### 8. **Total Moves** (`120`)
- **Source**: Backend API - Sum of all moves from completed sessions
- **Calculation**: 
  ```javascript
  totalMoves = sum of all session.moves
  ```
- **Status**: ✅ Real data from MongoDB
- **Note**: Each game session records the number of moves made

### 9. **Avg. Time** (`2:34`)
- **Source**: Backend API - Average completion time
- **Calculation**: 
  ```javascript
  averageTime = totalDuration / questsCompleted
  // Formatted as MM:SS
  ```
- **Status**: ✅ Real data (calculated from `durationSeconds`)
- **Format**: Minutes:Seconds (e.g., "2:34" = 2 minutes 34 seconds)

### 10. **Best Streak** (`5`)
- **Source**: Backend API - Longest consecutive day streak
- **Calculation**: 
  - Finds the longest sequence of consecutive days with completions
  - Historical calculation (not just current streak)
- **Status**: ✅ Real data (calculated from all completion dates)
- **Example**: If you had streaks of 3, 5, and 2 days → best = 5

---

## Achievements Section

All achievements are calculated from real game data:

### 11. **First Steps** ✅
- **Requirement**: Complete at least 1 quest
- **Check**: `questsCompleted >= 1`
- **Status**: ✅ Real data

### 12. **Speed Demon** ⏱️
- **Requirement**: Complete any quest in under 2 minutes
- **Check**: `any session.durationSeconds < 120`
- **Status**: ✅ Real data

### 13. **Perfect Memory** 🧠
- **Requirement**: Complete a quest in minimum moves (8 moves for 4 pairs)
- **Check**: `any session.moves <= 8`
- **Status**: ✅ Real data

### 14. **On Fire** 🔥
- **Requirement**: Maintain a 3-day streak
- **Check**: `bestStreak >= 3`
- **Status**: ✅ Real data

### 15. **Quest Master** 🏆
- **Requirement**: Complete 5 quests
- **Check**: `questsCompleted >= 5`
- **Status**: ✅ Real data

### 16. **Scholar** 📚
- **Requirement**: Earn 1.0 cUSD total
- **Check**: `totalEarned >= 1.0`
- **Status**: ✅ Real data

---

## Data Flow

```
User Completes Quest
    ↓
Backend saves to MongoDB (GameSessions collection)
    ↓
Profile page calls GET /api/user-stats
    ↓
Backend queries MongoDB and calculates stats
    ↓
Frontend displays real-time data
```

---

## API Endpoint

**GET** `/api/user-stats?userAddress=0x...`

**Response:**
```json
{
  "questsCompleted": 5,
  "totalEarned": "0.75",
  "currentStreak": 3,
  "bestStreak": 5,
  "totalMoves": 120,
  "averageTime": "2:34",
  "achievements": [
    {
      "id": "first-quest",
      "name": "First Steps",
      "description": "Complete your first quest",
      "earned": true
    },
    // ... more achievements
  ]
}
```

---

## MongoDB Schema

Game sessions are stored with:
- `walletAddress`: User's wallet (lowercase)
- `levelId`: Quest ID (e.g., "celo-basics")
- `status`: "COMPLETED"
- `durationSeconds`: Time taken to complete
- `moves`: Number of moves made
- `rewardAmount`: Reward in wei (as string)
- `createdAt`: Timestamp of completion

---

## Summary

✅ **All profile data is now real and calculated from actual game sessions**
✅ **No hardcoded values remain**
✅ **Data updates automatically when new quests are completed**
✅ **Achievements unlock based on actual gameplay**

The only static element is the "Scholar" title, which could be made dynamic in the future based on user achievements or total earned.

