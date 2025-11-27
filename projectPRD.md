This is the **Product Requirements Document (PRD)** for IlmQuest.

This file is written specifically to be fed into AI coding assistants (Cursor, v0, etc.) to set strict boundaries on *what* to build, ensuring they don't over-engineer features you don't have time for.

Save this as `ProjectPRD.md` in your root folder.

***

# ProjectPRD.md

**Project Name:** IlmQuest
**Type:** Mobile Learn-to-Earn dApp
**Hackathon:** Celo MiniPay / HackersDAO
**Target Blockchain:** Celo (Alfajores Testnet for MVP)
**Version:** 1.0 (MVP)
**Date:** November 27, 2025

---

## 1. Executive Summary
**IlmQuest** is a decentralized application (dApp) optimized for the Opera MiniPay wallet. It solves the friction of crypto onboarding by gamifying education. Users play a "Memory Match" game focused on financial concepts. Upon mastery, they are rewarded with cUSD (stablecoin).

**Unique Value Proposition:**
1.  **Fee Abstraction:** Users pay gas fees in cUSD (not CELO), making onboarding seamless.
2.  **Jualah Model:** Rewards are purely for "service" (learning), removing gambling stigma.
3.  **Anti-Bot:** Uses a trusted backend oracle to verify "Proof of Education" before payout.

---

## 2. Goals & Objectives
* **Primary Goal:** Submit a fully functional MVP by **November 30, 2025**.
* **User Goal:** A user must be able to connect, play one level, and receive cUSD in their wallet within **2 minutes**.
* **Technical Goal:** Successfully implement **Fee Currency Abstraction** (paying gas with cUSD) in the smart contract interaction.

---

## 3. Target Audience
* **Demographic:** Young adults in emerging markets (Nigeria/Kenya).
* **Tech Profile:** Android users, MiniPay wallet users.
* **Constraint:** Users likely have low-bandwidth internet and low-spec devices. **The app must be lightweight.**

---

## 4. Feature Requirements (MoSCoW Method)

### Must-Have (The MVP - Deadline Critical)
1.  **MiniPay Integration:** Auto-detect `window.ethereum` inside MiniPay.
2.  **Memory Logic:** 4x4 Grid (8 pairs). Logic to flip cards, check match, and reset if wrong.
3.  **Knowledge Modal:** When a pair is matched, a modal pops up with a fact. User *must* click "I Understand" to proceed.
4.  **Oracle Verification:** Backend API that validates game duration/moves and returns a cryptographic signature.
5.  **Smart Contract Payout:** A Solidity function that accepts the signature and transfers cUSD to the user.
6.  **Fee Abstraction:** The frontend must configure the transaction to use cUSD for gas.

### Should-Have (If time permits)
1.  **Sound Effects:** Simple sounds for "Flip", "Match", and "Win".
2.  **Confetti:** Visual celebration on payout.
3.  **Toast Notifications:** "Transaction Pending" / "Transaction Successful".

### Won't-Have (Out of Scope for Hackathon)
1.  **User Login/Auth:** No email/password. Wallet connection is the only auth.
2.  **Leaderboards:** Too complex for the timeframe.
3.  **Multi-level progression:** MVP will have only **one** level (The "Celo Basics" Deck).

---

## 5. User Experience (UX) Guidelines
* **Mobile First:** All buttons must be "thumb-friendly" (min-height 44px).
* **Zero Jargon:** Do not use words like "Transaction Hash" or "Block Confirmation" in the main UI. Use "Sending Reward..." or "Payment Verified".
* **Visual Feedback:** Cards must have a distinct "flipped" state and "matched" state (green border).
* **Loading States:** Buttons must show a spinner while waiting for Blockchain confirmation.

---

## 6. Technical Constraints
* **Frontend:** Next.js 14 (App Router), Tailwind CSS.
* **Backend:** Node.js (Express).
* **Database:** MongoDB (Atlas free tier) for simple session tracking.
* **Blockchain:** Celo Alfajores Testnet.
* **Security:**
    * Frontend must not store Admin Private Keys.
    * Backend must implement rate-limiting (1 game per user per 10 minutes) to prevent draining the faucet.

---

## 7. Development Timeline (Sprint Plan)

* **Phase 1 (Setup):** Repository init, Hardhat setup, basic Next.js scaffolding.
* **Phase 2 (Smart Contract):** Develop `JualahVault.sol`, write tests, deploy to Alfajores.
* **Phase 3 (Backend):** Create signing API, connect to MongoDB.
* **Phase 4 (Frontend Integration):** Build Game Board, connect MiniPay, wire up `claimReward` function.
* **Phase 5 (Polish):** UI clean up, record Demo Video.

---

## 8. Success Metrics
* **Functional:** User wallet balance increases by 0.1 cUSD after game completion.
* **Performance:** App loads in < 3 seconds on simulated 3G network.
* **Visual:** Zero UI breaks on 360px width screens (Galaxy S5/Moto G viewport).

***

### How to use this file:
When you open **Cursor** or **v0**, you can say:
> *"I am building IlmQuest. Please read the `ProjectPRD.md` file to understand the scope. Start by generating the code for [Feature X] following the requirements listed."*