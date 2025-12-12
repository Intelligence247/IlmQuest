# 🚀 Mainnet Deployment Plan - IlmQuest

**Status:** Top 30 Winner! 🎉  
**Next Steps:** Deploy to Celo Mainnet + Submit to Karma Gap

---

## 🎯 What We Need to Do

### Step 1: Deploy to Celo Mainnet
- Deploy smart contracts to mainnet
- Update all configurations
- Fund the vault with real cUSD
- Test everything thoroughly

### Step 2: Submit to Karma Gap
- Create submission on Karma Gap
- Link to mainnet deployment
- Highlight project achievements

---

## 🤔 Key Decisions to Make

### 1. **Token Strategy**

**Current Situation:**
- Testnet: Using `MockERC20` (test token)
- Mainnet: Need real cUSD token

**Options:**

**Option A: Use Real cUSD (Recommended)**
- ✅ Real rewards for users
- ✅ Full MiniPay compatibility
- ✅ Production-ready
- ❌ Need to fund vault with real money
- **cUSD Address:** `0x765DE816845861e75A25fCA122bb6898B8B1282a`

**Option B: Deploy New MockERC20 on Mainnet**
- ❌ Not real money (users might be confused)
- ❌ Doesn't demonstrate real value
- ✅ No funding needed
- **Not recommended for production**

**Recommendation:** Use real cUSD. This is what the judges want to see - a real, working product.

---

### 2. **Vault Funding Strategy**

**Questions:**
- How much cUSD should we fund the vault with?
- Should we start small and add more later?
- How many users do we expect initially?

**Recommendations:**
- Start with **$50-100 cUSD** for initial testing
- Can add more later as needed
- This is enough for ~100-200 quest completions (depending on reward amounts)

**Where to get cUSD:**
- Buy on exchange (Coinbase, Binance, etc.)
- Swap CELO for cUSD on Celo
- Request from HackersDAO (they offered!)

---

### 3. **Network Configuration**

**What Changes:**
- Chain ID: `11142220` (Sepolia) → `42220` (Mainnet)
- RPC URL: Sepolia → Mainnet
- Block Explorer: Sepolia → Celoscan
- Contract addresses: New mainnet addresses
- Token address: MockERC20 → Real cUSD

**Files to Update:**
1. `apps/frontend/lib/config.ts`
2. `apps/backend/.env`
3. `apps/contracts/.env` (for deployment)
4. README.md (update addresses)

---

### 4. **Deployment Strategy**

**Smart Contracts:**
- Deploy `MockERC20` first? (Only if we're not using real cUSD)
- Deploy `JualahVault` with real cUSD address
- Verify contracts on Celoscan
- Test deployment on a small scale first

**Backend:**
- Update environment variables
- Point to mainnet RPC
- Update contract addresses
- Test API endpoints

**Frontend:**
- Update contract addresses
- Update chain ID
- Update block explorer
- Test wallet connection
- Test full flow

---

### 5. **Testing Strategy**

**Before Going Live:**
1. Deploy contracts to mainnet
2. Fund vault with small amount (e.g., $10)
3. Test complete flow:
   - Connect wallet (MetaMask/MiniPay)
   - Switch to Celo Mainnet
   - View quests
   - Play quest
   - Complete quest
   - Claim reward
   - Verify cUSD received
4. Test admin panel
5. Verify all transactions on Celoscan

**Risk Mitigation:**
- Start with small rewards
- Test with your own wallet first
- Monitor vault balance
- Have a plan to pause if issues arise

---

## 📋 Step-by-Step Deployment Plan

### Phase 1: Preparation (Before Deployment)

**1.1 Get Mainnet CELO for Gas**
- Need CELO for contract deployment (~$5-10)
- Need CELO for vault funding transactions
- Can request from HackersDAO if needed

**1.2 Get cUSD for Vault**
- Decide on initial funding amount
- Acquire cUSD (buy or request)
- Store in secure wallet

**1.3 Prepare Environment Variables**
- Mainnet RPC URL
- Mainnet contract addresses (after deployment)
- Real cUSD address
- Update all configs

**1.4 Backup Current Testnet Setup**
- Document current testnet addresses
- Keep testnet version working (for reference)

---

### Phase 2: Smart Contract Deployment

**2.1 Deploy Contracts**
- Deploy `JualahVault` with real cUSD address
- (Skip MockERC20 if using real cUSD)
- Get deployment addresses
- Verify contracts on Celoscan

**2.2 Fund the Vault**
- Transfer cUSD to vault contract
- Verify balance on Celoscan
- Test that vault has funds

**2.3 Update Configurations**
- Frontend config
- Backend config
- Environment variables

---

### Phase 3: Backend Deployment

**3.1 Update Backend**
- Update `.env` with mainnet addresses
- Update chain ID
- Update RPC URL
- Redeploy backend

**3.2 Test Backend**
- Health check
- API endpoints
- Signature generation
- Database connections

---

### Phase 4: Frontend Deployment

**4.1 Update Frontend**
- Update contract addresses
- Update chain ID
- Update block explorer
- Update backend URL (if needed)

**4.2 Deploy to Vercel**
- Set environment variables
- Deploy
- Test public URL

---

### Phase 5: Testing & Verification

**5.1 Full Flow Test**
- Connect wallet
- Switch to Celo Mainnet
- Complete quest
- Claim reward
- Verify cUSD received

**5.2 Admin Panel Test**
- Access admin panel
- Create/edit quests
- Verify functionality

**5.3 MiniPay Test (If Available)**
- Test on Opera browser
- Test with MiniPay wallet
- Verify full integration

---

### Phase 6: Documentation & Submission

**6.1 Update README**
- Mainnet contract addresses
- Mainnet URLs
- Updated instructions

**6.2 Reply to HackersDAO**
- Confirm mainnet deployment
- Provide mainnet URL
- Provide Karma Gap link

**6.3 Submit to Karma Gap**
- Create account
- Submit project
- Link to mainnet deployment
- Highlight achievements

---

## 💰 Cost Estimate

### Deployment Costs:
- Contract deployment: ~$5-10 in CELO
- Vault funding: $50-100 in cUSD (your choice)
- Gas for testing: ~$2-5 in CELO
- **Total: ~$60-115**

### Ongoing Costs:
- Backend hosting: Free (Vercel)
- Frontend hosting: Free (Vercel)
- MongoDB: Free tier (Atlas)
- **Ongoing: $0/month**

---

## ⚠️ Important Considerations

### 1. **Security**
- Private keys: Keep secure, never commit
- Admin wallets: Use separate wallet for admin
- Vault funding: Start small, add more as needed
- Contract verification: Verify on Celoscan for transparency

### 2. **User Experience**
- Clear instructions for switching to mainnet
- Help users add Celo Mainnet to MetaMask
- Provide block explorer links
- Show real cUSD balance

### 3. **Monitoring**
- Monitor vault balance
- Track quest completions
- Watch for any errors
- Have plan to pause if needed

### 4. **MiniPay Compatibility**
- ✅ Mainnet deployment = Full MiniPay support!
- Users can now use MiniPay on Opera
- Real cUSD transactions
- Production-ready experience

---

## 🎯 Recommended Approach

### For Quick Deployment (Recommended):

1. **Use Real cUSD** (not MockERC20)
   - More impressive for judges
   - Real value demonstration
   - Full MiniPay compatibility

2. **Start with $50-100 cUSD**
   - Enough for testing and initial users
   - Can add more later
   - Shows commitment without huge risk

3. **Deploy Everything at Once**
   - Contracts → Backend → Frontend
   - Test thoroughly
   - Go live

4. **Document Everything**
   - Update README
   - Provide clear instructions
   - Show judges it's production-ready

---

## 📝 Questions to Answer Before We Start

1. **Token Choice:**
   - [ ] Use real cUSD (recommended)
   - [ ] Deploy MockERC20 on mainnet

2. **Vault Funding:**
   - [ ] How much cUSD? ($50, $100, more?)
   - [ ] Do you have cUSD or need to acquire it?

3. **Gas Fees:**
   - [ ] Do you have CELO for deployment?
   - [ ] Need to request from HackersDAO?

4. **Timeline:**
   - [ ] When do you want to deploy?
   - [ ] Any deadlines to meet?

5. **Testing:**
   - [ ] Who will test? (You, friends, public?)
   - [ ] How thorough should testing be?

---

## 🚀 Next Steps (After We Decide)

Once we answer the questions above:

1. **I'll prepare all configuration files**
2. **Guide you through contract deployment**
3. **Help with vault funding**
4. **Update all code/configs**
5. **Test everything together**
6. **Deploy to production**
7. **Submit to Karma Gap**

---

## 💡 My Recommendations

**For Best Results:**

1. ✅ **Use real cUSD** - Shows real value
2. ✅ **Start with $50-100** - Safe but meaningful
3. ✅ **Request CELO from HackersDAO** - They offered!
4. ✅ **Deploy this week** - While momentum is high
5. ✅ **Test thoroughly** - But don't overthink it
6. ✅ **Submit to Karma Gap** - Additional funding opportunity

---

**Let's discuss these points and make decisions together before we start coding!** 🎯

