# IlmQuest: The Ethical "Learn-to-Earn" Protocol

### *Turning Knowledge into Capital on the Celo Blockchain*

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![Celo Network](https://img.shields.io/badge/Celo-Sepolia-yellow)](https://docs.celo.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 🎯 Overview

**IlmQuest** is a decentralized application (dApp) built for the **MiniPay** ecosystem that allows users in emerging markets to earn their first crypto asset (cUSD) by mastering financial concepts.

Unlike "Play-to-Earn" games that often rely on ponzi-nomics or gambling mechanics, IlmQuest utilizes the ancient Islamic Finance concept of **Ju'alah** (Reward for Service). Users perform a verified service—**education**—and receive a guaranteed payment in return.

**Tagline:** *Don't Bet. Learn.*

---

## ✨ Key Features

- 🎮 **Memory Match Game** - Learn crypto concepts through gamified education
- 💰 **Fee Currency Abstraction** - Pay gas fees in cUSD, no CELO required
- 🔐 **Trusted Oracle** - Backend verifies game completion before reward
- 💸 **On-Chain Rewards** - Direct cUSD payments via smart contract
- 📱 **Mobile-First Design** - Optimized for MiniPay users in emerging markets
- 🎯 **Admin Dashboard** - Dynamic quest management system

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas account (or local MongoDB)
- MetaMask or MiniPay wallet
- Celo Sepolia testnet access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/IlmQuest.git
   cd IlmQuest
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   **Backend** (`apps/backend/.env`):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_PRIVATE_KEY=0x...
   VAULT_ADDRESS=0x9857b9d8F49C035Df7e56397870A0a16d851e371
   CHAIN_ID=11142220
   ADMIN_WALLETS=0xYourAdminWalletAddress
   PORT=4000
   ```

   **Frontend** (`apps/frontend/.env.local`):
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   ```

4. **Run migration script** (import existing quests)
   ```bash
   cd apps/backend
   node scripts/migrateQuests.js
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd apps/backend
   pnpm dev

   # Terminal 2: Frontend
   cd apps/frontend
   pnpm dev
   ```

6. **Open the app**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

---

## 🏗️ Project Structure

```
IlmQuest/
├── apps/
│   ├── frontend/          # Next.js 14 frontend application
│   ├── backend/           # Node.js/Express backend API
│   └── contracts/         # Solidity smart contracts (Hardhat)
├── ArchectureAndUserFlow.md
├── DesignSystem.md
├── projectIdea.md
├── projectPRD.md
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Wallet:** ethers.js (MiniPay/MetaMask)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Signing:** ethers.js (ECDSA signatures)

### Smart Contracts
- **Language:** Solidity
- **Framework:** Hardhat
- **Network:** Celo Sepolia Testnet
- **Standards:** ERC20, EIP-712

---

## 📋 Available Scripts

### Root Level
```bash
pnpm dev          # Start all development servers
pnpm build        # Build all packages
pnpm lint         # Lint all code
```

### Contracts
```bash
cd apps/contracts
pnpm compile      # Compile smart contracts
pnpm test         # Run contract tests
pnpm deploy:sepolia  # Deploy to Celo Sepolia
```

### Backend
```bash
cd apps/backend
pnpm dev          # Start backend server
node scripts/migrateQuests.js  # Import quests to database
```

### Frontend
```bash
cd apps/frontend
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
```

---

## 🎮 How It Works

1. **User connects wallet** (MiniPay/MetaMask)
2. **Selects a quest** (e.g., "Celo Basics")
3. **Plays memory match game** - Matches crypto concepts with definitions
4. **Learns facts** - Educational modal appears on each match
5. **Completes quest** - All pairs matched successfully
6. **Backend verifies** - Oracle validates game completion
7. **Claims reward** - Smart contract pays cUSD directly to wallet
8. **Pays gas in cUSD** - Fee Currency Abstraction enabled

---

## 🔐 Smart Contracts

### Deployed Contracts (Celo Sepolia)

- **JualahVault:** `0x9857b9d8F49C035Df7e56397870A0a16d851e371`
  - Handles reward distribution
  - Verifies EIP-712 signatures
  - Implements replay protection

- **MockERC20 (Reward Token):** `0x980DC8695F6D30A3b20770Ad42A5458784CBeA90`
  - Test token for rewards (cUSD equivalent)

**Block Explorer:** https://celo-sepolia.blockscout.com

---

## 🎯 Key Innovations

### 1. Fee Currency Abstraction
Users pay gas fees in cUSD (the same token they earn), eliminating the need for CELO tokens. This removes a major onboarding barrier.

### 2. Jualah Model
Ethical reward system based on Islamic Finance principles. Users are paid for a service (learning), not gambling.

### 3. Trusted Oracle Pattern
Backend verifies game completion off-chain, then cryptographically signs reward authorizations. Smart contract validates signatures before payout.

### 4. Mobile-First Design
Optimized for low-bandwidth connections and small screens, perfect for MiniPay users in emerging markets.

---

## 📚 Documentation

- **[Architecture & User Flow](ArchectureAndUserFlow.md)** - Technical architecture and data flow
- **[Design System](DesignSystem.md)** - UI/UX guidelines and components
- **[Project Idea](projectIdea.md)** - Business logic and vision
- **[PRD](projectPRD.md)** - Product requirements document
- **[Submission Guide](SUBMISSION_GUIDE.md)** - Hackathon submission checklist

---

## 🧪 Testing

### Smart Contracts
```bash
cd apps/contracts
pnpm test
```

### Backend API
```bash
cd apps/backend
node test-api.js
```

### Frontend
Manual testing recommended:
1. Connect wallet
2. Play a quest
3. Verify reward claim
4. Check profile stats

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd apps/frontend
vercel deploy
```

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Smart Contracts
Already deployed to Celo Sepolia testnet. See contract addresses above.

---

## 👥 Contributing

This is a hackathon project. For questions or issues, please open a GitHub issue.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Celo Foundation for the amazing blockchain infrastructure
- MiniPay team for wallet integration
- OpenZeppelin for secure smart contract libraries
- Next.js and Vercel for the excellent framework

---

## 📞 Contact

- **GitHub:** [Your GitHub Profile]
- **Email:** [Your Email]
- **Twitter:** [Your Twitter]

---

**Built with ❤️ for the Celo ecosystem**
