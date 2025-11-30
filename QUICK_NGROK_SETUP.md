# Quick ngrok Setup for MiniPay Testing

## ✅ Step 1: Get ngrok Authtoken (One-time setup)

1. **Sign up for free**: Go to https://dashboard.ngrok.com/signup
2. **Get your token**: After signing up, go to https://dashboard.ngrok.com/get-started/your-authtoken
3. **Copy the token** (looks like: `2abc123def456ghi789jkl012mno345pq_6r7s8t9u0v1w2x3y4z5`)

---

## ✅ Step 2: Authenticate ngrok

Run this command (replace with your actual token):

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

**Example:**
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl012mno345pq_6r7s8t9u0v1w2x3y4z5
```

---

## ✅ Step 3: Make Sure Services Are Running

### Terminal 1: Backend
```bash
cd apps/backend
pnpm dev
```
Should be running on `http://localhost:4000`

### Terminal 2: Frontend  
```bash
cd apps/frontend
pnpm dev
```
Should be running on `http://localhost:3000`

---

## ✅ Step 4: Start ngrok Tunnel for Frontend

**Open a NEW Terminal 3** and run:

```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.33.1
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**📋 Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

---

## ✅ Step 5: Configure Backend URL (If Backend is Local)

Since your backend is on `localhost:4000`, you have two options:

### Option A: Use ngrok for Backend Too (Recommended)

**Open Terminal 4** and run:
```bash
ngrok http 4000
```

Copy the backend ngrok URL (e.g., `https://xyz789.ngrok-free.app`)

Then create/update `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=https://xyz789.ngrok-free.app
```

**Restart your frontend** (Terminal 2):
- Press `Ctrl+C` to stop
- Run `pnpm dev` again

### Option B: Use Your Computer's Local IP

1. Find your local IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Look for something like `192.168.1.100`

2. Update `apps/frontend/.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://192.168.1.100:4000
   ```

3. **Restart your frontend**

---

## ✅ Step 6: Enable Developer Mode in MiniPay

1. **Open MiniPay app** on your phone
2. Go to **Settings** → **About**
3. **Tap the version number 10 times** rapidly
   - You'll see: "Developer mode enabled" ✅
4. Go back to **Settings** → You'll see **Developer Settings** (new option)
5. Tap **Developer Settings**
6. Find the URL input field
7. **Paste your frontend ngrok URL** (from Step 4)
   - Example: `https://abc123.ngrok-free.app`
8. Tap **Go** or **Load**

---

## ✅ Step 7: Test!

Your app should now load in MiniPay! 🎉

You can:
- ✅ Connect wallet
- ✅ Browse quests
- ✅ Play a quest
- ✅ **Test the claim reward fix** (this is what we're testing!)

---

## 🔄 If You Need to Restart

### Restart ngrok (if session expired):
```bash
ngrok http 3000
```
Get the new URL and update MiniPay Developer Settings.

### Restart frontend (if you changed .env.local):
```bash
cd apps/frontend
# Press Ctrl+C to stop
pnpm dev
```

---

## 📝 Quick Checklist

- [ ] ngrok installed ✅
- [ ] ngrok authenticated (Step 2)
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] ngrok tunnel running for frontend (port 3000)
- [ ] Backend URL configured (ngrok or local IP)
- [ ] Developer mode enabled in MiniPay
- [ ] ngrok URL pasted in MiniPay Developer Settings
- [ ] App loads in MiniPay!

---

## 🐛 Troubleshooting

### "Session Expired" in ngrok
- Free ngrok sessions expire after 2 hours
- Just restart: `ngrok http 3000`
- Get new URL and update MiniPay

### Can't connect to backend
- Check backend is running: `curl http://localhost:4000/health`
- Verify `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local`
- Make sure backend ngrok is running (if using Option A)

### MiniPay shows "Failed to load"
- Verify ngrok is running
- Check URL is correct (must be HTTPS)
- Make sure frontend is running
- Try refreshing in MiniPay

---

**Ready to test the MiniPay fix!** 🚀

