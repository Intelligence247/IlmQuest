# Setup Backend URL for MiniPay Testing

## Current Status
✅ Frontend ngrok: `https://nonpalliatively-unbickered-brent.ngrok-free.dev/`
✅ Backend running: `http://localhost:4000`
❌ Backend not accessible from MiniPay yet

---

## Option 1: Use ngrok for Backend (Recommended)

### Step 1: Start ngrok for Backend
Open a **NEW terminal** and run:
```bash
ngrok http 4000
```

You'll get a URL like: `https://xyz789.ngrok-free.app`

### Step 2: Create Frontend .env.local
Create file: `apps/frontend/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=https://YOUR_BACKEND_NGROK_URL
```

**Example:**
```env
NEXT_PUBLIC_BACKEND_URL=https://xyz789.ngrok-free.app
```

### Step 3: Restart Frontend
In your frontend terminal:
1. Press `Ctrl+C` to stop
2. Run `pnpm dev` again

---

## Option 2: Use Local IP (If Same WiFi)

### Step 1: Create Frontend .env.local
Create file: `apps/frontend/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://192.168.209.201:4000
```

### Step 2: Restart Frontend
In your frontend terminal:
1. Press `Ctrl+C` to stop
2. Run `pnpm dev` again

**Note:** This only works if your phone and computer are on the same WiFi network.

---

## Quick Setup (Recommended: Option 1)

1. **Open new terminal** → Run: `ngrok http 4000`
2. **Copy the HTTPS URL** (e.g., `https://xyz789.ngrok-free.app`)
3. **Create** `apps/frontend/.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://xyz789.ngrok-free.app
   ```
4. **Restart frontend**: `Ctrl+C` then `pnpm dev`

---

**After setup, your frontend will be able to connect to the backend from MiniPay!** 🚀

