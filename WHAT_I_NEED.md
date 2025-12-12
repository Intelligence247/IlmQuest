# ✅ What I Need From You - Mainnet Deployment

## 🔑 **1. Private Key for Contract Deployment**

**What to provide:**
```
PRIVATE_KEY=0xYourPrivateKeyHere
```

**Requirements:**
- Must start with `0x`
- This wallet needs CELO for gas (~$10-15)
- Keep this secure!

**Question:** Do you have CELO in this wallet, or should we request from HackersDAO?

---

## 💵 **2. cUSD Amount for Vault**

**What to provide:**
```
Amount: $50 (or your preferred amount)
```

**Recommendation:** $50-100 cUSD

**Question:** 
- How much cUSD do you want to fund the vault with?
- Do you have cUSD, or need to acquire it?

---

## 🔐 **3. Admin Wallet Private Key (for Backend)**

**What to provide:**
```
ADMIN_PRIVATE_KEY=0xYourAdminPrivateKeyHere
```

**Why:** Backend needs this to sign oracle messages

**Current:** Check your `apps/backend/.env` file - what's your current `ADMIN_PRIVATE_KEY`?

**Question:** Is this the same wallet as deployment wallet, or different?

---

## 📍 **4. Admin Wallet Address**

**What to provide:**
```
ADMIN_WALLETS=0xYourAdminWalletAddress
```

**Current:** Check your `apps/backend/.env` file - what's your current `ADMIN_WALLETS` value?

---

## 🌐 **5. Backend URL (Optional - if already deployed)**

**What to provide:**
```
Backend URL: https://your-backend-url.vercel.app
```

**Current:** Is it still `https://ilm-quest-backend.vercel.app`?

---

## 📝 **Summary - Just Answer These:**

1. **Private Key** for deployment: `0x...`
2. **Do you have CELO?** (Yes/No - if no, we'll request from HackersDAO)
3. **cUSD amount** for vault: $___
4. **Do you have cUSD?** (Yes/No)
5. **Admin Private Key** (from your backend `.env`): `0x...`
6. **Admin Wallet Address** (from your backend `.env`): `0x...`
7. **Backend URL** (if different from current): `https://...`

---

**Once you provide these, I'll deploy everything to mainnet!** 🚀

