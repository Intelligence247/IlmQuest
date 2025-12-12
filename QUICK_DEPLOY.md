# ⚡ Quick Mainnet Deployment

## 🎯 What You Need

1. **Admin Wallet Address** - The wallet that will sign oracle messages (from your backend `.env`)
2. **Private Key** - Already in your `apps/contracts/.env` ✅
3. **6 cUSD** - Already in your wallet ✅

---

## 🚀 Deployment Steps

### Step 1: Deploy Contract

```bash
cd apps/contracts

pnpm deploy:mainnet -- \
  --parameters '{"JualahVaultModule":{"adminSigner":"YOUR_ADMIN_WALLET_ADDRESS","rewardToken":"0x765DE816845861e75A25fCA122bb6898B8B1282a"}}'
```

**Replace `YOUR_ADMIN_WALLET_ADDRESS` with your admin wallet address.**

**Example:**
```bash
pnpm deploy:mainnet -- \
  --parameters '{"JualahVaultModule":{"adminSigner":"0x1234567890123456789012345678901234567890","rewardToken":"0x765DE816845861e75A25fCA122bb6898B8B1282a"}}'
```

**Save the deployed vault address from the output!**

---

### Step 2: Fund Vault

```bash
# Add vault address to apps/contracts/.env
echo "VAULT_ADDRESS=0xYourDeployedVaultAddress" >> apps/contracts/.env

# Fund with 6 cUSD
pnpm fund:vault:mainnet
```

---

### Step 3: Update Configs

**Frontend** (`apps/frontend/lib/config.ts`):
```typescript
export const VAULT_ADDRESS = "0xYourDeployedVaultAddress";
```

**Backend** (`apps/backend/.env`):
```bash
CHAIN_ID=42220
VAULT_ADDRESS=0xYourDeployedVaultAddress
REWARD_TOKEN_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
```

---

### Step 4: Deploy & Test

1. Push changes to GitHub
2. Vercel will auto-deploy frontend/backend
3. Test the full flow
4. Submit to HackersDAO! 🎉

---

## 📝 Full Details

See [MAINNET_DEPLOYMENT_STEPS.md](./MAINNET_DEPLOYMENT_STEPS.md) for complete instructions.

