# 🚀 Mainnet Deployment - Required Information

Please provide the following information before we proceed with mainnet deployment:

---

## 1. 🔑 Private Key for Contract Deployment

**What:** The private key of the wallet that will deploy contracts to mainnet

**Why:** Needed to sign and deploy smart contracts

**Format:** 
- Should start with `0x`
- Example: `0x1234567890abcdef...`

**Important:** 
- This wallet needs CELO for gas fees (~$5-10)
- Keep this secure - never share publicly
- Use a separate wallet from your admin wallet if possible

**Question:** Do you have a wallet with CELO on mainnet, or should we request CELO from HackersDAO first?

---

## 2. 💰 CELO Balance for Gas Fees

**What:** CELO tokens in your deployment wallet

**Why:** Needed to pay for contract deployment transactions

**Amount Needed:** 
- Contract deployment: ~$5-10 CELO
- Testing transactions: ~$2-5 CELO
- **Total: ~$10-15 CELO**

**Question:** 
- Do you have CELO in your wallet?
- If not, should we request it from HackersDAO? (They offered to help!)

---

## 3. 💵 cUSD for Vault Funding

**What:** cUSD tokens to fund the reward vault

**Why:** Users will claim real cUSD rewards from this vault

**Amount Needed:** 
- Recommended: $50-100 cUSD
- Can start smaller ($20-30) and add more later
- Your choice based on expected users

**Question:** 
- How much cUSD do you want to fund the vault with?
- Do you have cUSD, or do we need to acquire it?

**Note:** You can add more cUSD to the vault later if needed.

---

## 4. 🎯 Vault Funding Wallet Address

**What:** The wallet address that will send cUSD to the vault

**Why:** After deploying the vault contract, we need to transfer cUSD to it

**Format:** 
- Ethereum address format
- Example: `0x1234567890abcdef...`

**Question:** Is this the same wallet as the deployment wallet, or different?

---

## 5. 🔐 Admin Wallet Address (for Backend)

**What:** The wallet address that will be used for admin operations

**Why:** Backend needs this to sign oracle messages for quest verification

**Format:** 
- Ethereum address format
- Example: `0x1234567890abcdef...`

**Current:** Check your `apps/backend/.env` - what's your current `ADMIN_WALLETS` value?

**Question:** 
- Is this the same as deployment wallet?
- Do you have the private key for this wallet? (Backend needs it for signing)

---

## 6. 🌐 Mainnet RPC URL

**What:** RPC endpoint for Celo Mainnet

**Options:**
- **Option A (Recommended):** `https://forno.celo.org` (Public, free)
- **Option B:** `https://rpc.ankr.com/celo` (Public, free)
- **Option C:** Your own RPC (if you have one)

**Default:** I'll use `https://forno.celo.org` unless you specify otherwise

**Question:** Any preference, or use the default?

---

## 7. 📝 Real cUSD Token Address

**What:** The official cUSD contract address on Celo Mainnet

**Address:** `0x765DE816845861e75A25fCA122bb6898B8B1282a`

**Why:** This is the real cUSD token we'll use instead of MockERC20

**Note:** This is already known - no action needed from you!

---

## 8. 🔍 Block Explorer URL

**What:** URL for viewing transactions on Celo Mainnet

**URL:** `https://celoscan.io`

**Why:** For verifying contracts and viewing transactions

**Note:** This is already known - no action needed from you!

---

## 9. 🌍 Backend Deployment Status

**What:** Current backend deployment URL

**Current:** `https://ilm-quest-backend.vercel.app` (or your current URL)

**Why:** Frontend needs to point to the backend

**Question:** 
- Is your backend already deployed?
- What's the current backend URL?
- Do we need to redeploy it with mainnet configs?

---

## 10. 🎨 Frontend Deployment Status

**What:** Current frontend deployment URL

**Current:** `https://ilmquest-app.vercel.app`

**Why:** We'll update it with mainnet addresses

**Question:** 
- Is your frontend already on Vercel?
- Do you have access to Vercel dashboard for environment variables?

---

## 📋 Quick Checklist - What I Need From You:

- [ ] **Private Key** for contract deployment (with `0x` prefix)
- [ ] **Confirmation** that deployment wallet has CELO (~$10-15)
- [ ] **Amount of cUSD** you want to fund vault with ($50-100 recommended)
- [ ] **Confirmation** that you have cUSD, or need to acquire it
- [ ] **Vault funding wallet address** (if different from deployment wallet)
- [ ] **Admin wallet address** (from your backend `.env`)
- [ ] **Admin wallet private key** (for backend signing - keep secure!)
- [ ] **Backend URL** (current deployment)
- [ ] **RPC URL preference** (or use default)

---

## 🚨 Security Reminders

1. **Never share private keys publicly**
2. **Use separate wallets if possible:**
   - Deployment wallet (for deploying contracts)
   - Admin wallet (for backend signing)
   - Funding wallet (for vault funding)
3. **Keep private keys secure** - store them safely
4. **Test with small amounts first** before funding the vault fully

---

## 📝 What I'll Do Once You Provide Everything:

1. ✅ Update all configuration files with mainnet settings
2. ✅ Prepare deployment scripts
3. ✅ Guide you through contract deployment
4. ✅ Help fund the vault
5. ✅ Update backend with mainnet addresses
6. ✅ Update frontend with mainnet addresses
7. ✅ Test everything
8. ✅ Deploy to production
9. ✅ Provide you with all addresses for HackersDAO submission

---

## 🎯 Recommended Setup:

**If you want the simplest setup:**

1. **One wallet for everything:**
   - Deployment
   - Admin signing
   - Vault funding
   - **Need:** Private key, CELO (~$15), cUSD ($50-100)

2. **Use default RPC:** `https://forno.celo.org`

3. **Start with $50 cUSD** in vault (can add more later)

---

**Please provide the information above, and I'll prepare everything for deployment!** 🚀

