# Testing the MiniPay Fix

## ✅ No Push/Deploy Needed!

Since we only edited **frontend code** (`apps/frontend/lib/contract.ts`), the changes are already live in your dev environment!

**How it works:**
- Next.js dev server automatically reloads when files change
- Your frontend is running on `http://localhost:3000`
- The changes are already active - just refresh your browser!

---

## 🧪 Testing Steps

### 1. **Refresh Your Browser**
   - Open your app in MiniPay: `http://localhost:3000`
   - **Hard refresh** to ensure latest code loads:
     - Desktop: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
     - Mobile: Close and reopen the MiniPay app

### 2. **Open Browser Console** (for debugging)
   - **Desktop**: Press `F12` or right-click → "Inspect" → "Console" tab
   - **Mobile**: This is harder, but you can use remote debugging or check the error messages on screen

### 3. **Test the Claim Flow**
   - Complete a quest (or use one you already completed)
   - Click **"Claim Reward"** button
   - Watch for one of these outcomes:

#### ✅ **Success Case 1** (Primary Path)
   - Transaction popup appears
   - You approve the transaction
   - Transaction succeeds
   - Reward received
   - **Console shows**: `"Transaction sent, waiting for confirmation..."`

#### ✅ **Success Case 2** (Fallback 1)
   - Transaction popup appears
   - You approve the transaction
   - Transaction succeeds
   - Reward received
   - **Console shows**: `"Attempting with explicit gasLimit..."` then `"Transaction succeeded with explicit gasLimit"`

#### ✅ **Success Case 3** (Fallback 2)
   - Transaction popup appears
   - You approve the transaction
   - Transaction succeeds
   - Reward received
   - **Console shows**: `"Trying without feeCurrency (will pay gas in CELO)..."` then `"Transaction succeeded without feeCurrency (paid in CELO)"`
   - ⚠️ **Note**: In this case, you need some CELO in your wallet for gas

#### ❌ **Failure Case**
   - Error message appears
   - **Console shows**: Detailed error information
   - Check the error message for next steps

---

## 🔍 What to Look For

### Console Messages (Good Signs)
```
✅ "Transaction parameters:" - Shows what's being sent
✅ "Transaction sent, waiting for confirmation..." - Primary path working
✅ "Attempting with explicit gasLimit..." - Fallback 1 triggered
✅ "Transaction succeeded with explicit gasLimit" - Fallback 1 worked
✅ "Trying without feeCurrency..." - Fallback 2 triggered
✅ "Transaction succeeded without feeCurrency" - Fallback 2 worked
```

### Error Messages (Bad Signs)
```
❌ "BigInteger divide by zero" - Should NOT appear anymore
❌ "could not coalesce error" - Should NOT appear anymore
❌ Error code -32603 - Should be caught and handled
```

---

## 📱 Testing on MiniPay Mobile

1. **Make sure your phone and computer are on the same network**
2. **Find your computer's local IP**:
   ```bash
   # On Mac/Linux:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows:
   ipconfig
   ```
3. **Access from phone**: `http://YOUR_IP:3000` (e.g., `http://192.168.1.100:3000`)
4. **Or use a tunnel service** like ngrok:
   ```bash
   npx ngrok http 3000
   ```
   Then use the ngrok URL in MiniPay

---

## 🐛 Debugging Tips

### If it still fails:

1. **Check console logs**:
   - Look for the exact error message
   - Note which fallback was attempted
   - Check if balance is sufficient

2. **Check wallet balance**:
   - Ensure you have at least 0.001 cUSD for gas (for primary/fallback 1)
   - Or ensure you have some CELO (for fallback 2)

3. **Check network**:
   - Make sure you're on Celo Sepolia testnet
   - Verify chain ID is 11142220

4. **Try MetaMask**:
   - If MiniPay still has issues, test on MetaMask desktop
   - This helps isolate if it's a MiniPay-specific issue

---

## ✅ Expected Result

**The transaction should succeed** using one of the three methods:
1. ✅ Primary (feeCurrency only) - **Best case**
2. ✅ Fallback 1 (feeCurrency + gasLimit) - **Good case**
3. ✅ Fallback 2 (no feeCurrency, pay in CELO) - **Works but not ideal**

**The "BigInteger divide by zero" error should NOT appear anymore!**

---

## 📝 Report Back

After testing, let me know:
1. ✅ Did the transaction succeed?
2. Which method worked? (Primary, Fallback 1, or Fallback 2)
3. Any errors in console?
4. Did you receive the reward?

---

**Ready to test!** 🚀

