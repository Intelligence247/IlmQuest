This file is designed to be the "source of truth" for you and your AI coding assistants (Cursor, v0, etc.). You can paste this directly into a prompt window or save it as `ArchitectureAndUserFlow.md` in your project root.

It prioritizes the **3-day hackathon timeline** while maintaining professional architectural standards.

-----

# ArchitectureAndUserFlow.md

## Project: IlmQuest (Celo MiniPay Hackathon)

**Type:** Learn-to-Earn dApp (Memory Matching Game)
**Core Mechanic:** Jualah (Reward for Service)
**Stack:** MERN (Next.js + Node/Express + MongoDB) + Solidity (Hardhat)

-----

## 1\. High-Level Architecture

The system follows a **Trusted Oracle** pattern to prevent cheating. We do not process game logic on-chain (too expensive/slow). Instead, the game is played off-chain, verified by the Backend (Oracle), and rewarded on-chain.

### The 3 Pillars

1.  **Frontend (Client):** Next.js (React). Handles the UI, game logic, and wallet connection (MiniPay).
2.  **Backend (The Oracle):** Node.js/Express. Verifies the game was actually played (anti-bot) and cryptographically signs a "Payment Slip."
3.  **Blockchain (The Vault):** `JualahVault.sol`. A smart contract that verifies the Backend's signature and releases cUSD funds to the user.

-----

## 2\. Technical Data Flow (The "Anti-Cheat" Loop)

This is the exact sequence of data for a successful game loop.

### Phase 1: The Game (Off-Chain)

1.  **User** connects MiniPay Wallet.
2.  **User** starts a game level (e.g., "Celo Basics").
3.  **Frontend** tracks:
      * `startTime`
      * `movesCount`
      * `matches`
4.  **User** completes the game.
5.  **Frontend** sends a POST request to Backend: `POST /api/verify-game`
      * *Payload:* `{ userAddress, levelId, duration, moves, timestamp }`

### Phase 2: The Verification (The Oracle)

1.  **Backend** receives payload.
2.  **Logic Check:**
      * Is `duration` humanly possible? (e.g., \> 10 seconds).
      * Is `moves` realistic?
      * Has `userAddress` played this level recently? (Rate limiting via MongoDB).
3.  **Signing:**
      * If valid, Backend uses its **Private Admin Key** to sign a hash of: `(userAddress, levelId, rewardAmount, nonce)`.
4.  **Response:** Backend sends the **Signature** back to Frontend.
      * *Response:* `{ signature, rewardAmount, nonce }`

### Phase 3: The Payout (On-Chain)

1.  **Frontend** receives the Signature.
2.  **Frontend** prepares a blockchain transaction:
      * Function: `claimReward(levelId, rewardAmount, nonce, signature)`
      * **Crucial:** Transaction `feeCurrency` is set to cUSD address (Fee Abstraction).
3.  **Smart Contract (`JualahVault`)**:
      * Recovers the signer address from the `signature`.
      * Verifies signer == `AdminWallet`.
      * Checks if `nonce` is used (prevents replay attacks).
      * Transfers `rewardAmount` (cUSD) to `userAddress`.
4.  **Result:** User sees "Transaction Confirmed" and balance updates.

-----

## 3\. Database Schema (MongoDB)

*For the hackathon, keep this minimal. Used primarily for analytics and basic rate-limiting.*

**Collection:** `GameSessions`

```json
{
  "_id": "ObjectId",
  "walletAddress": "String (Indexed)",
  "levelId": "String",
  "status": "COMPLETED | FAILED",
  "durationSeconds": "Number",
  "rewardAmount": "String (wei)",
  "transactionHash": "String (optional)",
  "createdAt": "Date"
}
```

-----

## 4\. User Flow (Step-by-Step)

### A. Onboarding (First Launch)

1.  **Landing Screen:**
      * Logo: **IlmQuest**.
      * Tagline: "Learn Crypto. Earn Crypto."
      * Action: "Connect MiniPay" button.
2.  **Wallet Connection:**
      * App detects `window.ethereum` (injected by MiniPay).
      * Request account access.
      * *Condition:* If not MiniPay/Celo, show "Please open in MiniPay" modal.

### B. The Dashboard (Level Select)

1.  **Display:** Grid of available "Quest Decks" (e.g., "Stablecoins 101", "DeFi Safety", "Celo Eco").
2.  **Card UI:** Shows potential reward (e.g., "Earn 0.1 cUSD").
3.  **Action:** User taps a deck -\> Game Screen loads.

### C. Gameplay (The Work)

1.  **Grid View:** 8 cards (4 pairs) face down.
2.  **Interaction:** User taps Card A (reveals concept, e.g., "cUSD") -\> User taps Card B (reveals definition, e.g., "Stable Value").
3.  **Match Logic:**
      * **Mismatch:** Cards flip back after 1 second.
      * **Match:** **"Knowledge Modal"** pops up.
4.  **The "Proof of Education":**
      * Modal shows: *"Correct\! cUSD tracks the value of the US Dollar so you can save without volatility."*
      * Action: User MUST click "I Understand" to clear the cards.

### D. Victory & Claim

1.  **Game Over:** All pairs matched.
2.  **UI:** "Quest Complete\! Verifying..." (Spinner).
3.  **Background:** Frontend calls Backend API.
4.  **UI:** "Verification Success\! Claim 0.1 cUSD."
5.  **Action:** User taps "Claim Reward".
6.  **Wallet Prompt:** MiniPay pops up to approve transaction (paying gas in cUSD).
7.  **Success:** Confetti animation. "0.1 cUSD sent to your wallet."

-----

## 5\. Directory Structure (Monorepo Recommendation)

To keep it fast for the hackathon, use a monorepo structure.

```text
/ilmquest
  ├── /contracts       # Hardhat environment
  │   ├── contracts/JualahVault.sol
  │   └── scripts/deploy.js
  ├── /backend         # Node.js/Express
  │   ├── server.js    # Entry point
  │   ├── signer.js    # Wallet signing logic
  │   └── models/      # MongoDB schemas
  └── /frontend        # Next.js
      ├── pages/
      ├── components/  # GameCard, KnowledgeModal, ConnectButton
      └── utils/       # contractAbi.json, web3Config.js
```

-----

## 6\. Development Checklist (For AI Context)

  * **Frontend:** Use `viem` or `ethers.js v6`. Use `Tailwind CSS` for mobile responsiveness.
  * **Backend:** Use `dotenv` for private keys. **Never** expose the Admin Private Key to the frontend.
  * **Contract:** Use `OpenZeppelin` for `ECDSA` and `ReentrancyGuard`.
  * **Celo Specifics:**
      * **Testnet:** Alfajores.
      * **cUSD Address (Alfajores):** `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
      * **Gas:** Must specify `feeCurrency` in the transaction override.