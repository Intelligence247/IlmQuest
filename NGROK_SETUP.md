# ngrok Setup Guide for MiniPay Testing

## Step 1: Install ngrok

### Option A: Using Homebrew (Mac - Recommended)
```bash
brew install ngrok/ngrok/ngrok
```

### Option B: Using npm (Cross-platform)
```bash
npm install -g ngrok
# or
pnpm add -g ngrok
```

### Option C: Manual Download
1. Go to https://ngrok.com/download
2. Download for your OS
3. Extract and add to PATH

---

## Step 2: Sign up for ngrok (Free)

1. Go to https://dashboard.ngrok.com/signup
2. Create a free account
3. Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken

---

## Step 3: Authenticate ngrok

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

Replace `YOUR_AUTH_TOKEN_HERE` with the token from step 2.

---

## Step 4: Start Your Frontend

Make sure your Next.js frontend is running:

```bash
cd apps/frontend
pnpm dev
```

This should start on `http://localhost:3000`

---

## Step 5: Start ngrok Tunnel

In a **NEW terminal window**, run:

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL** (the one starting with `https://`)

---

## Step 6: Enable Developer Mode in MiniPay

1. **Open MiniPay app** on your phone
2. Go to **Settings** → **About**
3. **Tap the version number 10 times** (you'll see "Developer mode enabled")
4. Go back to **Settings** → You'll see **Developer Settings**
5. Open **Developer Settings**
6. Paste your ngrok URL (e.g., `https://abc123.ngrok-free.app`)
7. Tap **Go** or **Load**

---

## Step 7: Test Your App

Your local app should now load in MiniPay! You can:
- Connect wallet
- Play quests
- Test the claim reward functionality
- See console logs (if using remote debugging)

---

## Important Notes

### Backend Connection
Make sure your frontend's `.env.local` points to your backend:
- If backend is local: Use ngrok for backend too, or use your computer's local IP
- If backend is deployed: Use the deployed URL

### Environment Variables
Your frontend needs to know where the backend is. Check `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
# OR if backend is also on ngrok:
NEXT_PUBLIC_BACKEND_URL=https://your-backend-ngrok-url.ngrok-free.app
```

### Smart Contracts
Your contracts are already deployed to Celo Sepolia, so they'll work fine!

---

## Troubleshooting

### ngrok shows "Session Expired"
- Free ngrok sessions expire after 2 hours
- Just restart ngrok: `ngrok http 3000`
- Get a new URL and update MiniPay

### Can't connect to backend
- Make sure backend is running
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local`
- If backend is local, you might need ngrok for backend too

### MiniPay shows "Failed to load"
- Check that ngrok is running
- Verify the URL is correct (must be HTTPS)
- Make sure frontend is running on port 3000
- Try refreshing in MiniPay

---

## Quick Commands Reference

```bash
# Install ngrok (Mac)
brew install ngrok/ngrok/ngrok

# Authenticate
ngrok config add-authtoken YOUR_TOKEN

# Start tunnel
ngrok http 3000

# Check if frontend is running
curl http://localhost:3000
```

---

**Ready to test!** 🚀

