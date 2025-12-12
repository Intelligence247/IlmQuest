# 🚀 Deploy to Mainnet - Ready to Go!

## ✅ What We Have

- **Admin Wallet:** `0x93774ed7296373e372547587a3cc6ef3c0cc7b66` ✅
- **Private Key:** Already in `apps/contracts/.env` ✅
- **6 cUSD:** Ready in wallet ✅
- **CELO:** For gas fees ✅

## 🎯 Deployment Command

### Step 1: Deploy JualahVault Contract

```bash
cd apps/contracts

pnpm deploy:mainnet -- \
  --parameters '{"JualahVaultModule":{"adminSigner":"0x93774ed7296373e372547587a3cc6ef3c0cc7b66","rewardToken":"0x765DE816845861e75A25fCA122bb6898B8B1282a"}}'
```

**This will:**
- Deploy JualahVault to Celo Mainnet
- Set admin signer to your admin wallet
- Use real cUSD as reward token
- Output the deployed vault address

**Save the vault address from the output!**

---

### Step 2: Fund the Vault

After deployment, add vault address to `apps/contracts/.env`:

```bash
# Add this line to apps/contracts/.env
VAULT_ADDRESS=0xYourDeployedVaultAddress
```

Then fund with 6 cUSD:

```bash
pnpm fund:vault:mainnet
```

---

### Step 3: Update Configurations

**Frontend** (`apps/frontend/lib/config.ts`):
```typescript
export const VAULT_ADDRESS = "0xYourDeployedVaultAddress";
```

**Backend** (`apps/backend/.env`):
```bash
CHAIN_ID=42220
VAULT_ADDRESS=0xYourDeployedVaultAddress
REWARD_TOKEN_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
ADMIN_WALLETS=0x93774ed7296373e372547587a3cc6ef3c0cc7b66
# Make sure ADMIN_PRIVATE_KEY is set and matches the admin wallet
```

---

### Step 4: Deploy & Test

1. Push changes to GitHub
2. Vercel auto-deploys
3. Test complete flow
4. Submit to HackersDAO! 🎉

---

## ⚠️ Important Notes

- Make sure `ADMIN_PRIVATE_KEY` in backend `.env` matches your admin wallet address
- The admin wallet address must be the same in:
  - Contract deployment (`adminSigner`)
  - Backend config (`ADMIN_WALLETS`)
  - Backend signing (`ADMIN_PRIVATE_KEY`)

---

**Ready? Run the deployment command above!** 🚀

