# 🔐 Admin Private Key Explanation

## How It Works

1. **Contract Deployment:**
   - `PRIVATE_KEY` in `apps/contracts/.env` is used to deploy the contract
   - During deployment, we set `adminSigner` = `0x93774ed7296373e372547587a3cc6ef3c0cc7b66`
   - The contract stores this address

2. **Backend Signing:**
   - `ADMIN_PRIVATE_KEY` in `apps/backend/.env` is used to sign oracle messages
   - The backend creates signatures using this private key
   - The contract recovers the signer address from the signature

3. **Verification:**
   - Contract recovers signer from signature
   - Checks if recovered address == `adminSigner` (set during deployment)
   - If match → reward is paid ✅
   - If no match → transaction fails ❌

## ✅ The Requirement

**The address derived from `ADMIN_PRIVATE_KEY` must match `0x93774ed7296373e372547587a3cc6ef3c0cc7b66`**

## 🤔 Your Situation

You said:
- `ADMIN_PRIVATE_KEY` in backend = `PRIVATE_KEY` in contracts
- Admin wallet address = `0x93774ed7296373e372547587a3cc6ef3c0cc7b66`

**Question:** Does the `PRIVATE_KEY` in your contracts/.env correspond to address `0x93774ed7296373e372547587a3cc6ef3c0cc7b66`?

## ✅ If YES:
- Everything is correct!
- `ADMIN_PRIVATE_KEY` = `PRIVATE_KEY` is fine
- Proceed with deployment

## ❌ If NO:
- You need to set `ADMIN_PRIVATE_KEY` to the private key that corresponds to `0x93774ed7296373e372547587a3cc6ef3c0cc7b66`
- `PRIVATE_KEY` can be different (for deployment)
- `ADMIN_PRIVATE_KEY` must match the admin wallet

## 🔍 How to Verify

You can verify by checking what address your `PRIVATE_KEY` corresponds to:

```bash
# Quick check (if you have node installed)
node -e "const { ethers } = require('ethers'); const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY'); console.log('Address:', wallet.address);"
```

Or check in your wallet:
- Import the private key
- See what address it shows
- Does it match `0x93774ed7296373e372547587a3cc6ef3c0cc7b66`?

---

**Bottom line:** If your `PRIVATE_KEY` corresponds to `0x93774ed7296373e372547587a3cc6ef3c0cc7b66`, then yes, they should be the same! ✅

