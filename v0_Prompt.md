# IlmQuest v0.app UI Generation Prompt

## Context & Project Overview

You are building **IlmQuest**, a mobile-first Learn-to-Earn dApp for the Celo MiniPay ecosystem. Users play a memory matching game about financial literacy concepts and earn cUSD (stablecoin) rewards. The app follows the Islamic Finance concept of **Ju'alah** (Reward for Service) - users earn by learning, not gambling.

**Target Users:** Young adults in Nigeria/Kenya using Opera MiniPay on low-spec Android devices with limited bandwidth.

---

## Design System: "The Oasis of Knowledge"

### Color Palette
```
Primary Colors:
- Ilm Emerald (Brand): #047857 (emerald-700) - Trust, growth, stability
- Quest Gold (Action/Reward): #F59E0B (amber-500) - CTAs, rewards, dopamine triggers

Secondary Colors:
- Midnight Teal (Text): #0F172A (slate-900) - Headings, body text
- Soft Cloud (Background): #F8FAFC (slate-50) - Reduces eye strain
- Error Red: #EF4444 (red-500) - Mismatches, failures

Brand Extended:
- brand-dark: #022C22 (Deepest background)
- brand-primary: #047857 (Main brand)
- brand-secondary: #10B981 (Lighter accents)
- brand-accent: #F59E0B (Gold/Reward)
- brand-surface: #F8FAFC (Background)

UI Colors:
- ui-text: #0F172A
- ui-muted: #64748B
- ui-border: #E2E8F0

Card Gradient (Game Cards Back):
- from-emerald-600 to-teal-800
```

### Typography
```
Headings: Outfit (Google Font)
- Weights: Bold (700), SemiBold (600)
- Usage: Game levels, success modals, app title
- Style: Works great in ALL CAPS for game headers

Body: Inter (Google Font)
- Weights: Regular (400), Medium (500)
- Usage: Educational facts, instructions, wallet addresses
- Tall x-height for mobile legibility
```

### Component Specifications

**Touch Targets:**
- Minimum height: 44px for ALL interactive elements

**Border Radius:**
- Cards: rounded-xl (12px) - Friendly, touchable
- Buttons: rounded-full (Pill shape) - Modern mobile
- Modals: rounded-t-2xl (24px) - Bottom sheet style

**Shadows (Soft Depth):**
- Game Cards (default): shadow-md
- Game Cards (flipped): shadow-lg
- Claim Button: shadow-xl + shadow-amber-500/20 (gold glow)

**Animations:**
```css
flip: 0.6s preserve-3d
pop: 0.3s ease-out (scale 0.95→1, opacity 0→1)
```

---

## Screens to Generate

### 1. Landing/Home Screen
**Purpose:** First impression, wallet connection prompt

**Elements:**
- App logo "IlmQuest" with Outfit font, bold
- Tagline: "Learn Crypto. Earn Crypto." or "Don't Bet. Learn."
- Hero illustration (abstract geometric pattern suggesting knowledge/growth)
- "Connect MiniPay" button - bg-brand-primary, rounded-full, shadow-md, min-h-[44px]
- Subtle badge: "Built on Celo" with emerald accent
- Background: Soft gradient from slate-50 to emerald-50

**Mobile Constraints:** 360px width optimized, thumb-friendly bottom placement for CTA

---

### 2. Dashboard/Level Select Screen
**Purpose:** Display available quest decks after wallet connection

**Header:**
- Connected wallet address (truncated: 0x1234...5678)
- cUSD balance display with brand-accent highlight
- Simple navigation

**Content:**
- Grid of Quest Deck cards (single column on mobile)
- Each deck card shows:
  - Deck name (e.g., "Celo Basics", "Stablecoins 101")
  - Potential reward: "Earn 0.1 cUSD" in Quest Gold
  - Difficulty indicator (optional)
  - Lock icon for future levels (greyed out)
- Card styling: bg-white, rounded-xl, shadow-md, border border-ui-border
- Hover/tap state: shadow-lg, slight scale

**For MVP:** Only "Celo Basics" deck is active, others show "Coming Soon"

---

### 3. Game Board Screen
**Purpose:** The core memory matching gameplay

**Layout:**
- 2 columns × 4 rows grid (8 cards total, 4 pairs)
- Optimized for thumb reach on mobile

**Game Card Component:**
- **Back (face-down):** 
  - Gradient: from-emerald-600 to-teal-800
  - Centered "?" or IlmQuest logo watermark
  - rounded-xl, shadow-md
  - Size: fills grid cell with 8px gap
  
- **Front (face-up):**
  - bg-white, rounded-xl, shadow-lg
  - Content centered: concept text or definition
  - Font: Inter, text-sm to text-base
  - Text color: ui-text

- **States:**
  - Default: Card back visible
  - Flipped: 3D flip animation revealing front
  - Matched: Green border (emerald-500), slight opacity or checkmark overlay
  - Mismatched: Brief red flash, then flip back after 1s

**Header Bar:**
- Level name: "Celo Basics"
- Move counter: "Moves: 12"
- Timer (optional): "1:24"
- Pause/Exit button

**Card Pairs Content (Celo Basics Deck):**
```
Pair 1: "cUSD" ↔ "Stable Value"
Pair 2: "Gas Fee" ↔ "Transaction Cost"
Pair 3: "Wallet" ↔ "Your Crypto Bank"
Pair 4: "Blockchain" ↔ "Digital Ledger"
```

---

### 4. Knowledge Modal (Bottom Sheet)
**Purpose:** Educational reinforcement on successful match

**Trigger:** Appears when user matches a pair correctly

**Design:**
- Bottom sheet style: slides up from bottom
- bg-white, rounded-t-2xl
- Backdrop: semi-transparent dark overlay

**Content:**
- Success icon: Checkmark in emerald circle with pop animation
- Heading: "Correct!" in Outfit font, brand-primary color
- The Knowledge Fact: 
  - Inter font, text-base, leading-relaxed
  - ui-text color
  - Example: "cUSD tracks the value of the US Dollar so you can save without volatility."
- "I Understand" button:
  - bg-brand-primary, text-white
  - rounded-full, min-h-[44px]
  - Full width on mobile
  - User MUST click to proceed

**Animation:** Slide up with slight bounce, content fades in

---

### 5. Victory/Game Complete Screen
**Purpose:** Celebration and reward claim

**States:**

**A. Verifying State:**
- Centered spinner/loading animation
- Text: "Quest Complete! Verifying..." in Outfit
- Subtle pulsing emerald glow

**B. Ready to Claim State:**
- Large success illustration or confetti background
- Heading: "QUEST COMPLETE!" in Outfit, bold, brand-primary
- Subheading: "You've mastered Celo Basics"
- Reward display:
  - Large "0.1 cUSD" in Quest Gold (#F59E0B)
  - Coin/token icon animation
- Stats summary:
  - Moves: 16
  - Time: 2:34
  - Pairs matched: 4/4
- "Claim Reward" button:
  - bg-brand-accent (Quest Gold)
  - text-white, font-heading, font-bold
  - rounded-full, shadow-xl, shadow-amber-500/20 (gold glow)
  - min-h-[48px], prominent size
  - Pulsing or subtle glow animation to draw attention

**C. Processing State:**
- Button shows spinner: "Sending Reward..."
- Disabled state, reduced opacity

**D. Success State:**
- Confetti explosion animation
- "0.1 cUSD sent to your wallet!"
- Updated balance display
- "Play Again" or "Back to Quests" button

---

### 6. Error/Edge Case Modals

**A. Not MiniPay Modal:**
- Icon: Warning in amber
- Heading: "Open in MiniPay"
- Body: "IlmQuest works best inside the MiniPay app. Please open this link in MiniPay to continue."
- Button: "Got it" (dismisses modal)

**B. Transaction Failed Modal:**
- Icon: X in red circle
- Heading: "Transaction Failed"
- Body: "Something went wrong. Please try again."
- Button: "Retry" (brand-primary)

**C. Rate Limited Modal:**
- Icon: Clock in amber
- Heading: "Take a Break!"
- Body: "You can play this quest again in 10 minutes."
- Countdown timer display
- Button: "Explore Other Quests"

---

## Global UI Patterns

### Loading States
- Buttons: Show spinner icon, text changes to action verb ("Connecting...", "Claiming...")
- Disable interaction during loading
- Maintain button dimensions (no layout shift)

### Toast Notifications
- Position: Top center on mobile
- Types:
  - Success: Emerald background, white text, checkmark icon
  - Error: Red background, white text, X icon
  - Info: Slate background, white text, info icon
- Auto-dismiss after 3 seconds
- Swipe to dismiss

### Empty States
- Friendly illustration
- Clear message
- Action button if applicable

---

## Technical Requirements

- **Framework:** Next.js 14 (App Router) + React
- **Styling:** Tailwind CSS with custom config
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Outfit, Inter) via next/font
- **Animations:** CSS transitions + Framer Motion for complex animations
- **Responsive:** Mobile-first, 360px minimum width
- **Accessibility:** 
  - Proper contrast ratios
  - Focus states on all interactive elements
  - Screen reader friendly

---

## Component Architecture

```
/components
  /ui
    - button.tsx (variants: primary, secondary, ghost, reward)
    - card.tsx
    - modal.tsx (bottom-sheet style)
    - toast.tsx
  /game
    - game-board.tsx
    - game-card.tsx
    - knowledge-modal.tsx
    - victory-screen.tsx
  /wallet
    - connect-button.tsx
    - balance-display.tsx
  /layout
    - navbar.tsx
    - mobile-nav.tsx
  
/app
  - page.tsx (Landing)
  - /play
    - page.tsx (Dashboard/Level Select)
    - /[levelId]
      - page.tsx (Game Board)
```

---

## Sample Card Data Structure

```typescript
interface CardPair {
  id: string;
  concept: string;
  definition: string;
  fact: string; // Shown in Knowledge Modal
}

const celoBasicsDeck: CardPair[] = [
  {
    id: "cusd",
    concept: "cUSD",
    definition: "Stable Value",
    fact: "cUSD tracks the value of the US Dollar so you can save without volatility."
  },
  {
    id: "gas",
    concept: "Gas Fee",
    definition: "Transaction Cost",
    fact: "Gas fees pay validators who process your transactions on the blockchain."
  },
  {
    id: "wallet",
    concept: "Wallet",
    definition: "Your Crypto Bank",
    fact: "Your wallet stores your private keys, which prove you own your crypto assets."
  },
  {
    id: "blockchain",
    concept: "Blockchain",
    definition: "Digital Ledger",
    fact: "A blockchain is a shared record that everyone can verify but no one can cheat."
  }
];
```

---

## Key UX Principles

1. **Zero Jargon:** Use "Sending Reward..." not "Transaction Pending". Use "Payment Verified" not "Block Confirmation".

2. **Instant Feedback:** Every tap should have visual/haptic response.

3. **Progressive Disclosure:** Don't overwhelm. Show one thing at a time.

4. **Celebration:** Make winning feel GOOD. Confetti, sounds, gold colors.

5. **Trust Signals:** Emerald green = safety. Show wallet connection status clearly.

---

## Generate These Components

Please generate complete, production-ready React components for:

1. **Landing Page** - Hero section with wallet connect
2. **Quest Dashboard** - Level selection grid
3. **Game Board** - 2x4 memory card grid with flip animations
4. **Game Card** - Individual card with flip states
5. **Knowledge Modal** - Bottom sheet with educational fact
6. **Victory Screen** - All states (verifying, claim ready, processing, success)
7. **Connect Button** - Wallet connection with loading states
8. **Balance Display** - Shows cUSD balance

Use the exact colors, typography, and spacing from this design system. Ensure all components are mobile-first and work on 360px screens. Include proper TypeScript types and Tailwind classes.

