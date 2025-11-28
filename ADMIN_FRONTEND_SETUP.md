# Admin Frontend Setup - Complete Guide

## ✅ What We've Built

A secret admin panel with wallet-based authentication for managing quests dynamically.

---

## 🔐 Secret Admin Route

**URL:** `/admin-ilmquest-secret-2024`

**Important:** This route is NOT linked anywhere in the app. Only you know about it.

---

## 🎯 Features

### 1. **Wallet Signature Authentication**
- Connect your admin wallet
- Sign a message to authenticate
- Session-based (stored in sessionStorage)
- Web3-standard approach

### 2. **Quest Management**
- ✅ View all quests (including inactive/locked)
- ✅ Create new quests
- ✅ Edit existing quests
- ✅ Delete quests (soft delete)
- ✅ Toggle active/inactive status
- ✅ Toggle locked/unlocked status

### 3. **Frontend Integration**
- ✅ Main app now fetches quests from API
- ✅ Falls back to hardcoded quests if API fails
- ✅ Real-time updates when you add/edit quests

---

## 📁 Files Created

### New Files:
1. **`apps/frontend/hooks/use-admin-auth.ts`**
   - Wallet signature authentication hook
   - Session management
   - Auth headers for API calls

2. **`apps/frontend/lib/admin-api.ts`**
   - API client functions for admin operations
   - TypeScript types for quests
   - Error handling

3. **`apps/frontend/app/admin-ilmquest-secret-2024/page.tsx`**
   - Secret admin panel UI
   - Quest list, create/edit forms
   - Full CRUD operations

4. **`apps/frontend/hooks/use-quests.ts`**
   - Hook to fetch quests from API
   - Fallback to hardcoded quests

### Modified Files:
1. **`apps/frontend/app/play/page.tsx`**
   - Now uses `useQuests()` hook instead of hardcoded data

2. **`apps/frontend/app/play/[levelId]/page.tsx`**
   - Now uses `useQuests()` hook instead of hardcoded data

---

## 🚀 How to Use

### Step 1: Configure Admin Wallet

Add your admin wallet address to backend `.env`:

```env
ADMIN_WALLETS=0xYourAdminWalletAddress
```

### Step 2: Run Migration (if not done)

```bash
cd apps/backend
node scripts/migrateQuests.js
```

### Step 3: Start Backend

```bash
cd apps/backend
pnpm dev
```

### Step 4: Start Frontend

```bash
cd apps/frontend
pnpm dev
```

### Step 5: Access Admin Panel

1. Navigate to: `http://localhost:3000/admin-ilmquest-secret-2024`
2. Connect your admin wallet
3. Click "Sign Message to Authenticate"
4. Approve the signature in your wallet
5. You're in! 🎉

---

## 📝 Using the Admin Panel

### Create a New Quest

1. Click "Create Quest" button
2. Fill in the form:
   - **Quest ID**: Lowercase, alphanumeric with hyphens (e.g., `nft-basics`)
   - **Name**: Display name
   - **Description**: Brief description
   - **Reward**: Amount in cUSD (e.g., `0.20`)
   - **Difficulty**: Beginner, Intermediate, or Advanced
   - **Active**: Whether quest is visible
   - **Locked**: Whether quest is locked
   - **Pairs**: Exactly 4 card pairs (each with ID, concept, definition, fact)
3. Click "Create Quest"

### Edit a Quest

1. Click the edit icon (pencil) on any quest card
2. Modify the fields you want to change
3. Click "Update Quest"

### Delete a Quest

1. Click the delete icon (trash) on any quest card
2. Confirm deletion
3. Quest is soft-deleted (set to inactive)

### Toggle Status

- **Eye icon**: Toggle active/inactive
- **Lock icon**: Toggle locked/unlocked

---

## 🔒 Security Features

### 1. Secret Route
- Not linked anywhere in the app
- Only you know the URL
- Can be changed anytime

### 2. Wallet Authentication
- Must sign message with admin wallet
- Wallet must be in `ADMIN_WALLETS` whitelist
- Session-based (expires when browser closes)

### 3. Backend Validation
- All data validated server-side
- Prevents invalid quest data
- Admin wallet verified on every request

---

## 🎨 UI Features

- Clean, modern design matching IlmQuest theme
- Responsive layout
- Loading states
- Error handling
- Success feedback
- Quest status indicators (active/inactive, locked/unlocked)

---

## 🔄 How It Works

### Authentication Flow:
```
1. User navigates to /admin-ilmquest-secret-2024
2. Connects wallet
3. Clicks "Sign Message"
4. Wallet prompts for signature
5. Signature stored in sessionStorage
6. All API requests include signature in headers
7. Backend verifies signature and admin whitelist
```

### Quest Management Flow:
```
1. Admin creates/edits quest in UI
2. Frontend sends request with auth headers
3. Backend validates data and admin auth
4. Quest saved to MongoDB
5. Frontend refreshes quest list
6. Main app fetches updated quests from API
```

---

## 🐛 Troubleshooting

### "Please connect your wallet first"
- Make sure your wallet is connected
- Check that you're using the correct wallet

### "This wallet is not authorized as an admin"
- Add your wallet address to `ADMIN_WALLETS` in backend `.env`
- Restart backend server
- Make sure address matches exactly (case-insensitive)

### "Failed to verify signature"
- Make sure you signed the correct message
- Try signing again
- Check that your wallet is still connected

### "Failed to load quests"
- Check backend is running
- Check MongoDB connection
- Check CORS settings
- Frontend will fallback to hardcoded quests

### Quest not appearing in main app
- Make sure quest `isActive: true` and `isLocked: false`
- Refresh the main app page
- Check backend API is returning the quest

---

## 📚 Next Steps

1. ✅ Admin panel complete
2. ✅ Frontend integration complete
3. ⏳ Test creating/editing quests
4. ⏳ Verify quests appear in main app
5. ⏳ Polish UI if needed

---

## 💡 Tips

1. **Keep the route secret**: Don't share the URL publicly
2. **Use a separate wallet**: Don't use your main wallet as admin
3. **Test before production**: Always test quests before making them active
4. **Backup quests**: Export quests from MongoDB if needed
5. **Monitor changes**: Check `createdBy`/`updatedBy` fields in database

---

## 🎉 You're All Set!

Your admin panel is ready to use. You can now:
- Add new quests without code changes
- Update existing quests
- Enable/disable quests instantly
- Manage everything from a clean UI

**Secret Route:** `/admin-ilmquest-secret-2024`

Keep it secret! 🤫

