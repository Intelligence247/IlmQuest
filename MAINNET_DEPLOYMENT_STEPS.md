# 🚀 Mainnet Deployment Steps

Follow these steps to deploy IlmQuest to Celo Mainnet.

---

## 📋 Prerequisites

✅ You have:
- Private key with CELO for gas (~$10-15)
- 6 cUSD in your wallet for vault funding
- Admin wallet address and private key (for backend)

---

## Step 1: Update Environment Variables

### 1.1 Update `apps/contracts/.env`

```bash
PRIVATE_KEY=0xYourPrivateKeyHere
CELOSCAN_API_KEY=YourApiKeyHere (optional, for verification)
```

**Important:** Your `PRIVATE_KEY` should already be set for mainnet.

---

## Step 2: Deploy JualahVault Contract

### 2.1 Navigate to contracts directory

```bash
cd apps/contracts
```

### 2.2 Deploy to Mainnet

**You need to provide:**
- `adminSigner`: The wallet address that will sign oracle messages (your admin wallet)
- `rewardToken`: Real cUSD address (`0x765DE816845861e75A25fCA122bb6898B8B1282a`)

**Deployment command:**

```bash
pnpm deploy:mainnet -- \
  --parameters '{"JualahVaultModule":{"adminSigner":"0xYourAdminWalletAddress","rewardToken":"0x765DE816845861e75A25fCA122bb6898B8B1282a"}}'
```

**Replace `0xYourAdminWalletAddress` with your actual admin wallet address.**

**Example:**
```bash
pnpm deploy:mainnet -- \
  --parameters '{"JualahVaultModule":{"adminSigner":"0x1234567890123456789012345678901234567890","rewardToken":"0x765DE816845861e75A25fCA122bb6898B8B1282a"}}'
```

### 2.3 Save the Deployment Address

After deployment, you'll see output like:
```
JualahVault deployed to: 0x...
```

**Save this address!** You'll need it for:
- Frontend config
- Backend config
- Vault funding script

---

## Step 3: Fund the Vault

### 3.1 Update `apps/contracts/.env` with vault address

```bash
VAULT_ADDRESS=0xYourDeployedVaultAddress
```

### 3.2 Fund the vault with cUSD

```bash
# Fund with 6 cUSD (default)
node scripts/fundVaultMainnet.js

# Or specify custom amount (e.g., 10 cUSD)
node scripts/fundVaultMainnet.js 10
```

**This will:**
- Check your wallet balance
- Transfer cUSD to the vault
- Show transaction hash and new balance

---

## Step 4: Verify Contract (Optional but Recommended)

### 4.1 Get Celoscan API Key

1. Go to https://celoscan.io/myapikey
2. Create account/login
3. Copy your API key
4. Add to `apps/contracts/.env`:
   ```
   CELOSCAN_API_KEY=YourApiKeyHere
   ```

### 4.2 Verify Contract

```bash
npx hardhat verify --network celo \
  VAULT_ADDRESS \
  ADMIN_SIGNER_ADDRESS \
  REWARD_TOKEN_ADDRESS \
  OWNER_ADDRESS
```

**Example:**
```bash
npx hardhat verify --network celo \
  0xYourVaultAddress \
  0xYourAdminSignerAddress \
  0x765DE816845861e75A25fCA122bb6898B8B1282a \
  0xYourOwnerAddress
```

---

## Step 5: Update Frontend Configuration

### 5.1 Update `apps/frontend/lib/config.ts`

Replace the placeholder vault address:

```typescript
export const VAULT_ADDRESS = "0xYourDeployedVaultAddress";
```

### 5.2 Deploy Frontend to Vercel

The frontend will automatically use the new mainnet addresses.

**Or update Vercel environment variable:**
- Go to Vercel dashboard
- Project Settings → Environment Variables
- Update `NEXT_PUBLIC_BACKEND_URL` if needed

---

## Step 6: Update Backend Configuration

### 6.1 Update `apps/backend/.env`

```bash
# Update chain ID
CHAIN_ID=42220

# Update vault address
VAULT_ADDRESS=0xYourDeployedVaultAddress

# Update reward token address (real cUSD)
REWARD_TOKEN_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a

# Make sure admin wallet is set
ADMIN_WALLETS=0xYourAdminWalletAddress
ADMIN_PRIVATE_KEY=0xYourAdminPrivateKey
```

### 6.2 Redeploy Backend

If your backend is on Vercel:
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Or manually redeploy from dashboard

---

## Step 7: Test Everything

### 7.1 Test Wallet Connection
- Connect wallet to frontend
- Should prompt to switch to Celo Mainnet (Chain ID: 42220)

### 7.2 Test Quest Flow
1. Select a quest
2. Play and complete it
3. Claim reward
4. Verify cUSD received in wallet
5. Check transaction on Celoscan

### 7.3 Test Admin Panel
- Access admin dashboard
- Create/edit quests
- Verify signatures work

---

## Step 8: Update Documentation

### 8.1 Update README.md

Update contract addresses in README:
- Vault address
- Token address (real cUSD)
- Block explorer links
- Network: Celo Mainnet

---

## 📝 Summary of Addresses

After deployment, you'll have:

- **Vault Address:** `0x...` (from deployment)
- **cUSD Address:** `0x765DE816845861e75A25fCA122bb6898B8B1282a` (real cUSD)
- **Admin Signer:** `0x...` (your admin wallet)
- **Chain ID:** `42220` (Celo Mainnet)
- **Block Explorer:** `https://celoscan.io`

---

## ✅ Checklist

- [ ] Contracts deployed to mainnet
- [ ] Vault funded with cUSD
- [ ] Contract verified on Celoscan (optional)
- [ ] Frontend updated with vault address
- [ ] Frontend deployed to Vercel
- [ ] Backend updated with mainnet configs
- [ ] Backend redeployed
- [ ] Full flow tested
- [ ] Admin panel tested
- [ ] README updated
- [ ] Ready to submit to HackersDAO!

---

## 🆘 Troubleshooting

### "Insufficient funds for gas"
- Make sure you have CELO (not just cUSD) in your wallet
- Need ~$10-15 CELO for deployment

### "Invalid signer" error
- Check that `adminSigner` in contract matches `ADMIN_WALLETS` in backend
- Check that `ADMIN_PRIVATE_KEY` in backend matches the admin wallet

### "Vault has no funds"
- Run `fundVaultMainnet.js` script
- Make sure you have cUSD in your wallet
- Check vault address is correct

### Frontend shows wrong network
- Clear browser cache
- Make sure `CHAIN_ID` in config is `42220`
- Check wallet is connected to Celo Mainnet

---

**Ready? Let's deploy!** 🚀

