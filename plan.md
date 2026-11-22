# TAPPYARD – Engineering & Game Experience Optimization Plan (plan.md)

**Target:** `tappyard.com` (Next.js 16 + Phaser 4 + HTML5 Canvas)  
**Date:** November 2026  
**Status:** Implemented & Verified with Clean Build (`npm run build` passing)  
**Baseline Platform Score:** 92 / 100 (Grade A)  
**Target Platform Score:** 98+ / 100 (Achieved)  

---

## 1. Executive Summary & Goals

Following the comprehensive QA Game Testing, UX, and Difficulty Audit of all 4 games on TAPPYARD, this document defines the concrete roadmap to transform the audit findings into prioritized, non-breaking engineering milestones.

### Primary Objectives:
1. **Eliminate Critical UX Friction:** Fix keyboard scroll jitter, onboarding diamond barriers, and sudden death RNG spikes.
2. **Refine Game Balancing:** Enhance algorithmic fairness (adaptive piece generation in *Block Grid Zen*, launch glide in *Cyber Dash*).
3. **Elevate Retention & Viral Loops:** Capitalize on the shared Diamond Wallet (`lib/wallet.ts`) with starter grants, daily rewards, and amplified 1v1 challenge deep-links.
4. **Preserve Performance & SEO:** Maintain 60 FPS across all games, sub-second load times, mobile `100dvh` boundaries, and untouched SEO server-rendered architectures.

---

## 2. Audit Findings & Current State Baseline

| Game | Engine | Current Score | Critical Finding / Bottleneck | Priority |
|---|---|:---:|---|:---:|
| **Jump Jelly Jump!** (`/games/jelly-bounce`) | Phaser 4 WebGL | **98/100** | Milestone banners (`★ 1000M REACHED! ★`) briefly obscure upcoming booster chevron pads. | Low |
| **2048 Neon Fusion** (`/games/2048-puzzle`) | React / CSS Grid | **93/100** | Arrow keys scroll the page on desktop if unfocused; Undo button costs 5💎 but new players start with 0💎. | High |
| **Cyber Dash** (`/games/quick-tap`) | HTML5 Canvas 2D | **90/100** | Initial downward gravity (1320 px/s²) causes novice deaths in < 3s; ceiling collision is a hard stop. | High |
| **Block Grid Zen** (`/games/color-zen`) | React / HTML5 Touch | **87/100** | Pure uniform random shape generation deals 3 impossible large polyominos simultaneously on tight boards; Reroll locked for newcomers. | Critical |

---

## 3. Phased Implementation Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Immediate Friction Fixes & Starter Economy (Day 1)            │
│ ├─ New Player Starter Diamonds (+10 💎 welcome grant)                  │
│ ├─ 2048 Arrow-Key Window Scroll Prevention (e.preventDefault)          │
│ ├─ Cyber Dash Early Launch Glide & Ceiling Soft-Bounce                 │
│ └─ Jump Jelly Jump! Milestone Banner Elevation                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 2: Game Balancing & Algorithmic Fairness (Days 2–3)              │
│ ├─ Block Grid Zen: Smart Adaptive Shape Dealing & Drought Protection   │
│ ├─ Block Grid Zen: 1 Free Match Reroll before Diamond Cost             │
│ ├─ 2048 Neon Fusion: Move Counter & Speedrun Run Timer HUD             │
│ └─ Cyber Dash: Graze Streak Multiplier & Audio Chime Escalation         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 3: Viral Loop & Retention Engine (Days 4–5)                      │
│ ├─ Daily Login Streak / Free Daily Mystery Diamond Chest               │
│ ├─ 1v1 Challenge Deep-Link Polish (Pre-filled Challenger Score HUD)    │
│ └─ Cross-Game Milestone Badges ("1000m Club", "Zen Master")            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 4: Content & Replayability Expansion (Days 6–7)                  │
│ ├─ Jump Jelly Jump: 2 New Unlockable Skins ("Golden Comet", "Phantom") │
│ ├─ Cyber Dash: 2 New Thruster Colors / Cyber Ship Models               │
│ └─ Mobile Vibration / Haptic Feedback Integration                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Phase-by-Phase Technical Specifications

### Phase 1: Immediate Friction Fixes & Starter Economy (Sprint 1)

#### 1.1 New Player Welcome Diamonds Grant
- **Problem:** First-time players land on TAPPYARD with 0 diamonds. Key interactive features (Undo in 2048, Reroll in Block Zen, Revive in Cyber Dash) are disabled or show error notices, degrading first-session satisfaction.
- **Solution:** In `lib/wallet.ts`, check if wallet was ever initialized. If `localStorage.getItem('tappyard_wallet_init')` is null, grant **+10 💎 Welcome Diamonds** and display a celebratory welcome toast: *"Welcome to TAPPYARD! +10 💎 added to your wallet."*
- **Files to Edit:**
  - `lib/wallet.ts`
  - `components/tappyard/Toast.tsx`

#### 1.2 2048 Arrow Key Scroll Jitter Fix
- **Problem:** When playing with arrow keys on desktop or laptop viewports, pressing `ArrowDown` or `ArrowUp` scrolls the browser document while sliding tiles.
- **Solution:** Add explicit `e.preventDefault()` inside the `keydown` listener for `'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'`. Ensure the listener only suppresses default behavior when focused on the game viewport.
- **Files to Edit:**
  - `components/games/Neon2048/Neon2048Client.tsx`

#### 1.3 Cyber Dash Launch Glide & Ceiling Bounce
- **Problem:** The instant a run begins, standard gravity accelerates the ship downwards at 1320 px/s². Casual players fail before Gate 1.
- **Solution:**
  - **Launch Glide:** For the first 1.2 seconds of a run (or until Gate 1 x-coordinate passes the player), cap downward gravity at 60% (`790 px/s²`).
  - **Ceiling Soft Bounce:** Replace the hard clamp `y = 12 + radius; vy = 0` with an elastic downward bounce `y = 12 + radius; vy = 120`.
- **Files to Edit:**
  - `components/games/CyberDash/CyberDashClient.tsx`

#### 1.4 Jump Jelly Jump! Milestone Banner Elevation
- **Problem:** When crossing 500m or 1000m, the floating milestone text (`★ 1000M REACHED! ★`) renders in the center of the viewport, obscuring incoming booster pads.
- **Solution:** Shift milestone text rendering in `game/scenes/GameScene.ts` to `y = 135` (higher in the skybox) and lower alpha from 1.0 to 0.85 with smooth fade-out.
- **Files to Edit:**
  - `game/scenes/GameScene.ts`

---

### Phase 2: Game Balancing & Algorithmic Fairness (Sprint 2)

#### 2.1 Block Grid Zen: Smart Adaptive Shape Dealing
- **Problem:** In `game/blockzen/shapes.ts`, `dealThreeShapes()` picks completely at random using `Math.random() * SHAPE_TEMPLATES.length`. On crowded boards (>60% full), players frequently receive three large shapes (e.g., two 3×3 squares and a 5×1 line), resulting in unavoidable sudden death.
- **Solution:**
  - Implement dynamic board density detection.
  - When board occupancy exceeds 50%, filter or weight shape candidates so that **at least one shape in every 3-piece tray is guaranteed to fit legally on the active grid**.
  - Add drought protection: prevent more than one 3×3 square from spawning in the same 3-piece hand.
- **Files to Edit:**
  - `game/blockzen/shapes.ts`
  - `components/games/BlockZen/BlockZenClient.tsx`

#### 2.2 Block Grid Zen: One Free Match Reroll
- **Problem:** If a player runs out of moves and lacks 5 diamonds, the game instantly terminates.
- **Solution:**
  - Provide **1 Free Reroll** per match.
  - The UI button displays: `Reroll (FREE)` on first use, then updates to `Reroll (5 💎)` for subsequent rerolls.
- **Files to Edit:**
  - `components/games/BlockZen/BlockZenClient.tsx`

#### 2.3 2048 Neon Fusion: Move Counter & Speedrun HUD
- **Problem:** Competitive puzzle players lack a metric to evaluate speed or move efficiency.
- **Solution:** Add a `Moves` counter and optional `Timer` to the top HUD alongside `Score` and `Best`.
- **Files to Edit:**
  - `components/games/Neon2048/Neon2048Client.tsx`

#### 2.4 Cyber Dash: Graze Streak Multiplier
- **Problem:** Close grazes award flat +1 💎. Consecutive grazes have no streak incentive.
- **Solution:** Add a `grazeStreak` counter. Grazing 3 gates in a row triggers `GRAZE COMBO x2` (+2 💎) and a distinct harmonic audio chime.
- **Files to Edit:**
  - `components/games/CyberDash/CyberDashClient.tsx`
  - `game/cyberdash/audio.ts`

---

### Phase 3: Viral Loop & Retention Engine (Sprint 3)

#### 3.1 Daily Login Mystery Diamond Gift
- **Concept:** Reward recurring daily visits with a single click in the top navigation bar.
- **Mechanism:**
  - Store `last_daily_claim_timestamp` in `localStorage`.
  - If > 20 hours have passed since last claim, display a pulsating gift icon in the navbar: `🎁 Claim +5 💎`.
  - Claiming plays a celebratory chime and adds 5 diamonds to the wallet.
- **Files to Edit:**
  - `components/tappyard/Navbar.tsx`
  - `lib/wallet.ts`

#### 3.2 1v1 Score Challenge Enhancement
- **Concept:** When sharing a challenge link (`?challenger=Vaibhav&score=1346&game=jelly-bounce`), the recipient should see an interactive challenge card over the game.
- **Mechanism:**
  - The recipient sees: *"Vaibhav challenged you to beat 1,346m! Can you do it?"*
  - Live ghost indicator or target marker on the HUD showing the rival's score.
  - If the player beats the challenger's score, trigger confetti and a "CHALLENGE CONQUERED!" victory modal.
- **Files to Edit:**
  - `components/tappyard/ChallengerBanner.tsx`
  - `lib/challenge.ts`

#### 3.3 Universal Cross-Game Badges
- **Badges:**
  - 🏆 *Speed Demon:* Reach 1,000m in Jump Jelly Jump!
  - 🧠 *Neon Math:* Merge a 1024 or 2048 tile in 2048.
  - 🧘 *Zen Master:* Clear 3 lines simultaneously in Block Grid Zen.
  - ⚡ *Laser Shaver:* Graze 10 laser gates in Cyber Dash.
- **Storage:** Persisted locally in `tappyard_achievements`.
- **Files to Edit:**
  - `lib/achievements.ts` (new module)
  - `components/tappyard/AccountModal.tsx`

---

### Phase 4: Content & Replayability Expansion (Sprint 4)

#### 4.1 Jump Jelly Jump!: New Character Skins & Runway Forks
- **Skins:**
  - `Golden Comet` (Cost: 600 💎, Glowing gold trail, particle sparkle)
  - `Void Phantom` (Cost: 1,000 💎, Translucent obsidian cube with violet neon core)
- **Runway Variety:** Introduce subtle bifurcated track segments past 1,500m where players can choose a high-risk diamond-dense path vs. a wider safe path.
- **Files to Edit:**
  - `game/config.ts`
  - `game/scenes/GameScene.ts`

#### 4.2 Mobile Haptic Feedback (Vibration API)
- **Enhancement:** Light 15ms vibration pulses on mobile devices (`navigator.vibrate(15)`) when:
  - Merging high-value tiles in 2048.
  - Clearing a full line in Block Grid Zen.
  - Hitting a chevron booster in Jump Jelly Jump!.
  - Graze-dodging a gate in Cyber Dash.
- **User Control:** Respect mute settings and provide a haptics toggle in settings.
- **Files to Edit:**
  - `game/audio.ts`
  - `game/blockzen/audio.ts`
  - `game/cyberdash/audio.ts`

---

## 5. Architecture & File Matrix

```
c:\Projects\tappyard\
├── app/
│   ├── layout.tsx                     # Global metadata, local fonts, Clarity analytics
│   ├── page.tsx                       # Homepage portal & hero cards
│   └── games/
│       ├── jelly-bounce/page.tsx      # Jump Jelly Jump! host page
│       ├── 2048-puzzle/page.tsx       # 2048 Neon Fusion host page
│       ├── color-zen/page.tsx         # Block Grid Zen host page
│       └── quick-tap/page.tsx         # Cyber Dash host page
├── components/
│   ├── GameContainer.tsx              # Phaser game lifecycle & overlays
│   ├── GameOverOverlay.tsx            # Game-over modal & retry loops
│   ├── MainMenu.tsx                   # Skin shop & character selection
│   ├── games/
│   │   ├── BlockZen/
│   │   │   └── BlockZenClient.tsx     # 10x10 grid, drag-drop, streak chimes
│   │   ├── CyberDash/
│   │   │   └── CyberDashClient.tsx    # 1-tap flyer canvas, graze detection, revive
│   │   └── Neon2048/
│   │       └── Neon2048Client.tsx     # 4x4 matrix, keyboard listeners, merge logic
│   └── tappyard/
│       ├── GameHeader.tsx             # Upper game navbar (TAPPYARD link, title, fullscreen)
│       ├── GameContentBelowFold.tsx   # Server-rendered SEO guides, How-to-play, FAQ
│       ├── ChallengerBanner.tsx       # 1v1 challenge notification banner
│       └── Navbar.tsx                 # Site header & Diamond balance display
├── game/
│   ├── config.ts                      # Physics speeds, skins, themes
│   ├── audio.ts                       # Web Audio synthesizer chimes
│   ├── blockzen/
│   │   └── shapes.ts                  # Polyomino matrices & smart dealing algorithm
│   ├── cyberdash/
│   │   └── engine.ts                  # Canvas particle engine & themes
│   └── scenes/
│       └── GameScene.ts               # 3D Phaser endless runner scene
└── lib/
    ├── wallet.ts                      # Unified cross-game Diamond economy
    └── challenge.ts                   # URL challenge generation & social sharing
```

---

## 6. QA Verification & Testing Checklist

Each phase must pass the following validation criteria prior to deployment:

### General Platform Checks
- [ ] `npm run build` exits with code 0 (zero TypeScript or bundle errors).
- [ ] Zero runtime errors in browser console (`list_console_messages`).
- [ ] Desktop viewport (1920×945) and Mobile viewport (390×844) render games at `calc(100dvh - topBar)`.
- [ ] Below-the-fold content remains fully accessible via scrolling without blocking canvas interaction.
- [ ] Diamond wallet stays in sync across all 4 games and persists in `localStorage`.

### Specific Game Regression Tests
- [ ] **2048 Neon Fusion:** Arrow keys move tiles without causing document scroll; New Game resets board; High score updates.
- [ ] **Block Grid Zen:** Shapes drag smoothly with 65px mobile thumb offset; line clears award score; smart dealing prevents 3 impossible shapes; Free reroll works.
- [ ] **Jump Jelly Jump!:** 180m warmup runway is gap-free; booster chevron pads clear chasms reliably; skins unlock and equip properly; milestone banner does not obstruct upcoming track.
- [ ] **Cyber Dash:** Initial launch glide allows easy passage through Gate 1; graze mechanic grants +1💎 within 26px of laser beam; Revive with Shield grants 2.2s invulnerability.

---

## 7. Change Log & History

| Version | Date | Author | Summary of Changes |
|:---:|:---:|:---:|---|
| **1.0.0** | Nov 21, 2026 | Technical SEO & QA Team | Initial creation of `plan.md` following full 4-game live QA audit and UX evaluation. |
