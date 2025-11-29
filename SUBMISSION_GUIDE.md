# 🚀 IlmQuest Hackathon Submission Guide

Complete checklist and resources for submitting your hackathon project.

---

## ✅ Pre-Submission Checklist

### 1. Code & Documentation
- [x] All code is committed to GitHub
- [x] README.md is updated with project description
- [x] All environment variables documented in `.env.example` files
- [x] Project structure is clean and organized
- [x] No sensitive data (private keys) in code or commits

### 2. Smart Contracts
- [x] Contracts deployed to Celo Sepolia testnet
- [x] Contract addresses documented
- [x] Contract verified on block explorer (if possible)
- [x] Tests passing

### 3. Frontend
- [x] App runs locally without errors
- [x] Wallet connection works (MiniPay/MetaMask)
- [x] Game flow works end-to-end
- [x] Reward claiming works
- [x] Profile page shows real data

### 4. Backend
- [x] Backend API running
- [x] MongoDB connected
- [x] Quest migration completed
- [x] Admin panel accessible (secret route)

### 5. Demo Materials
- [ ] Demo video recorded (2-3 minutes)
- [ ] Screenshots taken
- [ ] Live demo link (if deploying)

---

## 📝 Submission Form Fields

### Project Name
```
IlmQuest: Learn-to-Earn on Celo
```

### Tagline/One-Liner
```
Turning Knowledge into Capital - Earn cUSD by learning crypto concepts through gamified education
```

### Project Description (500-1000 words)
Use the content from `projectIdea.md`. Key points:
- Problem: Gas fee barrier + gambling stigma
- Solution: Learn-to-Earn with Fee Abstraction
- Innovation: Jualah model (ethical reward for service)
- Technical: Fee Currency Abstraction, EIP-712 signatures
- Impact: Onboarding users in emerging markets

### Tech Stack
```
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Smart Contracts: Solidity, Hardhat
- Blockchain: Celo Sepolia Testnet
- Wallet: MiniPay/MetaMask compatible
```

### Key Features
1. **Memory Match Game** - Learn crypto concepts through gamification
2. **Fee Currency Abstraction** - Pay gas in cUSD, no CELO needed
3. **Trusted Oracle** - Backend verifies game completion
4. **On-Chain Rewards** - Direct cUSD payments via smart contract
5. **Mobile-First Design** - Optimized for MiniPay users
6. **Admin Dashboard** - Dynamic quest management

### Live Demo Link (if applicable)
```
http://your-demo-url.com
```
OR
```
Local development only - see README for setup instructions
```

### GitHub Repository
```
https://github.com/yourusername/IlmQuest
```

### Video Demo Link
```
https://youtube.com/watch?v=your-video-id
```
OR
```
Upload to YouTube/Vimeo and share link
```

### Screenshots
Include:
1. Landing page
2. Quest selection page
3. Game in progress
4. Victory screen with reward
5. Profile page with stats
6. Transaction on block explorer

---

## 🎬 Demo Video Script (2-3 minutes)

### Introduction (0:00 - 0:30)
> "Hi judges! I'm [Your Name], and I'm presenting **IlmQuest** - a Learn-to-Earn dApp built for the Celo MiniPay ecosystem.
> 
> IlmQuest solves two major barriers to Web3 adoption: the gas fee problem and the gambling stigma. Users earn their first crypto by learning, not betting."

### Problem Statement (0:30 - 0:45)
> "In emerging markets like Nigeria and Kenya, new users can't use dApps because they don't have CELO for gas fees. Also, many avoid crypto because it feels like gambling.
> 
> IlmQuest solves both: users pay gas in cUSD (the same token they earn), and rewards are for learning, not betting."

### Demo Flow (0:45 - 2:00)
1. **Show Landing Page** (0:45 - 1:00)
   > "Here's the IlmQuest landing page. Users connect their MiniPay wallet with one click."

2. **Show Quest Selection** (1:00 - 1:15)
   > "After connecting, users see available quests. Each quest teaches different crypto concepts - Celo Basics, Stablecoins, DeFi, Security."

3. **Play the Game** (1:15 - 1:45)
   > "Let me play 'Celo Basics'. Users match concepts with definitions in a memory game. When they match a pair, they learn a fact about that concept.
   > 
   > The game tracks moves and time to ensure fair play."

4. **Claim Reward** (1:45 - 2:00)
   > "After completing the quest, the backend verifies the game was played fairly and signs a reward authorization.
   > 
   > The user claims the reward on-chain, and 0.1 cUSD is sent directly to their wallet. Notice: they paid gas in cUSD, not CELO - that's Fee Currency Abstraction!"

### Technical Highlights (2:00 - 2:30)
> "Key technical innovations:
> - **Fee Currency Abstraction** - Users pay gas in cUSD
> - **EIP-712 Signatures** - Secure, off-chain verification
> - **Trusted Oracle Pattern** - Backend validates game completion
> - **Mobile-First Design** - Optimized for low-bandwidth connections"

### Closing (2:30 - 2:45)
> "IlmQuest is production-ready and solves real problems for the Celo ecosystem. Thank you!"

---

## 📸 Screenshots to Take

1. **Landing Page** - Clean, welcoming design
2. **Wallet Connection** - MiniPay/MetaMask popup
3. **Quest Dashboard** - Shows all available quests
4. **Game in Progress** - Cards flipped, matching pairs
5. **Knowledge Modal** - Educational fact displayed
6. **Victory Screen** - Reward amount, claim button
7. **Transaction Success** - Block explorer link
8. **Profile Page** - Stats, achievements, balance
9. **Admin Panel** - Quest management (optional)

---

## 🔗 Important Links to Include

### Smart Contracts
- **JualahVault Contract:** `0x9857b9d8F49C035Df7e56397870A0a16d851e371`
- **MockERC20 (Reward Token):** `0x980DC8695F6D30A3b20770Ad42A5458784CBeA90`
- **Network:** Celo Sepolia Testnet (Chain ID: 11142220)
- **Block Explorer:** https://celo-sepolia.blockscout.com

### Documentation
- Architecture: `ArchectureAndUserFlow.md`
- Design System: `DesignSystem.md`
- Project Idea: `projectIdea.md`
- PRD: `projectPRD.md`

---

## 🚀 Deployment Options (Optional)

### Option 1: Vercel (Frontend)
```bash
cd apps/frontend
vercel deploy
```

### Option 2: Railway/Render (Backend)
- Deploy backend to Railway or Render
- Update `NEXT_PUBLIC_BACKEND_URL` in frontend

### Option 3: Local Demo
- Record video showing local development
- Include setup instructions in README

---

## 📋 Final Submission Checklist

### Before Submitting:
- [ ] All code pushed to GitHub
- [ ] README.md is comprehensive
- [ ] Demo video recorded and uploaded
- [ ] Screenshots prepared
- [ ] Submission form filled out completely
- [ ] All links tested and working
- [ ] No broken features
- [ ] Tested on different browsers/devices

### Submission Day:
- [ ] Submit before deadline
- [ ] Double-check all links work
- [ ] Verify video is accessible
- [ ] Confirm GitHub repo is public
- [ ] Test demo flow one more time

---

## 💡 Key Points to Emphasize

1. **Innovation:** First Learn-to-Earn dApp using Jualah model
2. **Technical:** Fee Currency Abstraction implementation
3. **Impact:** Solves real onboarding problems
4. **Feasibility:** Working MVP, production-ready
5. **Cultural Fit:** Designed for Celo Africa ecosystem

---

## 🎯 Judging Criteria Alignment

### Innovation (25%)
- ✅ Novel approach to Learn-to-Earn
- ✅ Jualah model (ethical reward for service)
- ✅ Fee Currency Abstraction

### Utility (25%)
- ✅ Solves gas fee barrier
- ✅ Educational value
- ✅ Real-world application

### Feasibility (25%)
- ✅ Working MVP
- ✅ Smart contracts deployed
- ✅ Full-stack implementation

### Presentation (25%)
- ✅ Clean UI/UX
- ✅ Clear documentation
- ✅ Professional demo

---

## 📞 Support

If judges have questions:
- **Technical:** Check `ArchectureAndUserFlow.md`
- **Business:** Check `projectIdea.md`
- **Setup:** Check `README.md`

---

**Good luck with your submission! 🚀**

