This is the **IlmQuest Design System**.

As a Lead Product Designer, I have crafted this system to balance **Ethical Finance (Trust)** with **Gamification (Excitement)**. It is specifically optimized for **mobile screens** (MiniPay context) and high accessibility in outdoor lighting (common in Nigeria/emerging markets).

Save this file as `DesignSystem.md`.

-----

# IlmQuest Design System (v1.0)

**Theme Name:** "The Oasis of Knowledge"
**Design Philosophy:** Clarity, Optimism, and Tangible Value.

-----

## 1\. Color Palette ("The Oasis")

We are avoiding "Generic Crypto Blue." Instead, we are using a palette that signifies **Growth (Ilm)** and **Value (Wealth)**.

### A. Primary Colors (Brand Identity)

  * **Ilm Emerald (Primary Brand):** A deep, rich green that signifies stability, trusted knowledge, and growth. It connects culturally to the concept of "Ilm" and the Celo ecosystem.
      * `#047857` (Tailwind: `emerald-700`)
  * **Quest Gold (Action/Reward):** A warm, non-aggressive gold. Used for Call-to-Actions (CTAs) and the "Claim Reward" moments. It triggers the dopamine response for "Value."
      * `#F59E0B` (Tailwind: `amber-500`)

### B. Secondary & Functional

  * **Midnight Teal (Text/Headings):** Pure black is too harsh for mobile reading. We use a very dark teal-slate for softer contrast.
      * `#0F172A` (Tailwind: `slate-900`)
  * **Soft Cloud (Background):** A slight off-white to reduce eye strain during reading tasks.
      * `#F8FAFC` (Tailwind: `slate-50`)
  * **Error Red:** For "Mismatch" or "Transaction Failed".
      * `#EF4444` (Tailwind: `red-500`)

### C. The Card Gradient (The Game Piece)

  * **Card Back (Hidden):** A subtle gradient to make the cards look touchable.
      * Gradient: `from-emerald-600 to-teal-800`

-----

## 2\. Typography (The Voice)

We need a pairing that is geometric (modern tech) but highly legible (educational).

### Headings: **Outfit**

  * *Why:* A Google Font that is geometric, friendly, and modern. It looks fantastic in "All Caps" for game headers.
  * *Usage:* Game Levels, Success Modals, App Title.
  * *Weights:* Bold (700), SemiBold (600).

### Body: **Inter**

  * *Why:* The industry standard for UI legibility on small screens. It has a tall x-height, making the "Educational Facts" easy to read on a crappy Android phone.
  * *Usage:* Instructional text, The "Knowledge Fact", Wallet Addresses.
  * *Weights:* Regular (400), Medium (500).

-----

## 3\. UI Components & Spacing (The Physics)

Since this is for **MiniPay (Mobile)**, touch targets are critical.

### The "Thumb Rule"

  * **Minimum Touch Target:** 44px height for any interactive element.
  * **Border Radius:**
      * **Cards:** `rounded-xl` (12px) - Friendly and touchable.
      * **Buttons:** `rounded-full` (Pill shape) - Modern mobile standard.
      * **Modals:** `rounded-t-2xl` (24px) - Sheet style (coming from bottom).

### Depth & Elevation (Shadows)

We use "Soft Depth" to make elements pop off the flat screen.

  * **Game Cards:** `shadow-md` (Standard state) $\to$ `shadow-lg` (Flipped state).
  * **Floating Action Button (Claim):** `shadow-xl` + `shadow-amber-500/20` (Gold glow).

-----

## 4\. The "Game Board" Design

  * **Grid:** 4 columns x 4 rows (16 cards) is too tight for mobile.
  * **Recommendation:** Use **2 columns x 4 rows** (8 cards / 4 pairs) per "Mini Level". It prevents mis-taps on small screens.

-----

## 5\. Tailwind CSS Configuration

Copy this directly into your `tailwind.config.ts` to implement the system instantly.

```typescript
// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'], // Body
        heading: ['var(--font-outfit)'], // Headings
      },
      colors: {
        brand: {
          dark: "#022C22",  // Deepest background
          primary: "#047857", // Emerald 700 - Main Brand
          secondary: "#10B981", // Emerald 500 - Lighter accents
          accent: "#F59E0B", // Amber 500 - Gold/Reward
          surface: "#F8FAFC", // Slate 50 - Background
        },
        ui: {
          text: "#0F172A", // Slate 900
          muted: "#64748B", // Slate 500
          border: "#E2E8F0", // Slate 200
        }
      },
      animation: {
        'flip': 'flip 0.6s preserve-3d',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
```

-----

## 6\. Implementation Guide (For "Cursor/v0")

When asking the AI to build components, give them these specific instructions:

1.  **For the Game Card:**
    *"Create a card component using `brand-primary` for the back and white for the face. Use a `rounded-xl` border radius. When flipped, show the content in `font-inter` text-sm."*

2.  **For the Main Button:**
    *"Create a 'Claim Reward' button using `bg-brand-accent` (Amber) with white text. Make it `rounded-full` and `font-heading` bold. Add a soft shadow."*

3.  **For the Modal:**
    *"Create a bottom-sheet modal for the Knowledge Fact. Use `bg-white` with `rounded-t-2xl`. The fact text should be `text-ui-text` and `font-inter` leading-relaxed for readability."*