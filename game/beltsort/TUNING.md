# Conveyor Sort Rush — Tuning & Manual QA Guide

All balance numbers, visual tokens, difficulty curves, wave weights, and reward caps are centralized in [`config.ts`](file:///C:/Projects/tappyard/game/beltsort/config.ts). Adjusting values there updates both gameplay logic (`logic.ts`) and Canvas/CSS rendering (`renderer.ts`, `sprites.ts`, `BeltSortClient.tsx`) without modifying engine code.

---

## 1. Config Reference (`BELT_SORT_CONFIG`)

### Storage & Identifiers
| Key | Default | Purpose |
|---|---|---|
| `GAME_SLUG` | `'belt-sort'` | Catalog, stats, and URL identifier (`/games/belt-sort`). |
| `GAME_TITLE` | `'Conveyor Sort Rush'` | Display name used in share cards and metadata. |
| `STORAGE_KEYS.ENDLESS_BEST` | `'tappyard-beltsort-best'` | Endless mode personal best score. |
| `STORAGE_KEYS.DAILY_BEST_PREFIX` | `'tappyard-beltsort-daily-best-'` | Prefix + `YYYY-MM-DD` for today's Daily Run best score. |
| `STORAGE_KEYS.DAILY_PLAYED_PREFIX` | `'tappyard-beltsort-daily-played-'` | Tracks whether today's Daily Run has been played. |
| `STORAGE_KEYS.DAILY_STREAK` | `'tappyard-beltsort-daily-streak'` | Consecutive daily run streak count. |
| `STORAGE_KEYS.DAILY_LAST_DATE` | `'tappyard-beltsort-daily-last-date'` | Last local `YYYY-MM-DD` date played for streak continuity. |
| `STORAGE_KEYS.RUNS_COUNT` | `'tappyard-beltsort-runs'` | Total completed/started runs (drives first-run hint & 3-run Perfect banner). |
| `STORAGE_KEYS.MUTE` | `'tappyard-beltsort-mute'` | Web Audio mute preference (`'1'` or `'0'`). |

### Colors & Bins (`COLORS`, `BINS`)
- `COLORS`: Sky backdrop (`skyTop`, `skyBottom`), navy HUD glass (`panelTop`, `panelBottom`, `panelBorder`, `panelShadow`), gold number gradients (`numLight`, `numDark`, `numStroke`), belt slate & chevrons, lavender rails + amber clamps, Perfect Zone gold, Wildcard gold, and Freeze ice-blue palette.
- `BINS`: Ordered array of 4 bins (`circle` Blue `#2f6bff`, `square` Green `#2fbf4a`, `triangle` Red `#ff3b30`, `diamond` Purple `#8a3ffc`), each specifying `id`, `label`, primary/alternate keyboard hints (`1/A`, `2/S`, `3/D`, `4/F`), 3-stop shading (`light`, `mid`, `dark`), top `rim`, and inner pit shades (`innerPit`, `innerShade`).

### Scoring (`SCORING`)
| Field | Default | Effect |
|---|---|---|
| `basePoints` | `10` | Base points awarded for a single correct sort before multipliers. |
| `perfectZoneRatio` | `0.18` | Last 18% of belt before the end line (`yProgress >= 0.82`) counts as Perfect. |
| `perfectMultiplier` | `2` | Score multiplier when sorted inside the Perfect Zone. |
| `wildcardMultiplier` | `2` | Additional score multiplier for sorting a Wildcard star. |
| `chainStepForMultiplier` | `5` | Chain count per multiplier tier (`1 + floor(chain / 5)`). |
| `maxChainMultiplier` | `5` | Maximum chain multiplier ceiling (`x5` reached at chain 20). |
| `chainBonusInterval` | `10` | Chain milestone interval (e.g., 10, 20, 30) granting bonus & Slow-Mo charge. |
| `chainBonusPoints` | `50` | Flat bonus points added at each `chainBonusInterval` hit. |

### Core Gameplay & Unlocks (`GAMEPLAY`, `UNLOCKS`)
| Field | Default | Effect |
|---|---|---|
| `GAMEPLAY.maxHearts` | `3` | Starting/max lives per run. |
| `GAMEPLAY.dailyDurationSec` | `60` | Countdown timer length for Daily Run mode. |
| `GAMEPLAY.initialBinCount` | `3` | Active bins at start of run (`circle`, `square`, `triangle`). |
| `GAMEPLAY.maxBinCount` | `4` | Total bins once unlocked. |
| `GAMEPLAY.guidedSequence` | `['circle', 'square', 'triangle']` | Deterministic opening 3 items at start of every run. |
| `GAMEPLAY.guidedTravelTimeSec` | `5.4` | Slower belt travel duration for the first 3 guided items. |
| `GAMEPLAY.perfectBannerRunsVisible` | `3` | Shows `"Perfect Zone! x2 Points"` tag for the player's first N runs. |
| `UNLOCKS.fourthBinSorts` | `25` | Correct sorts needed to slide in the 4th Purple Diamond bin. |
| `UNLOCKS.specialsSorts` | `60` | Correct sorts needed to enable Wildcard & Freeze special spawns. |
| `UNLOCKS.wildcardChanceAfterUnlock` | `1 / 14` | Per-spawn probability (~7.1%) of a Wildcard star after 60 sorts. |
| `UNLOCKS.freezeChanceAfterUnlock` | `1 / 25` | Per-spawn probability (4.0%) of a Freeze crystal after 60 sorts. |

### Power-Ups (`POWERUPS`)
| Field | Default | Effect |
|---|---|---|
| `slowMoMaxStored` | `1` | Maximum stored Slow-Mo charges earned via chain milestones. |
| `slowMoBeltFactor` | `0.6` | Belt speed multiplier while Slow-Mo is active (60% speed). |
| `slowMoDurationSec` | `2.0` | Duration of active Slow-Mo power-up. |
| `chainMilestoneAutoSlowMoFactor` | `0.45` | Brief automatic Slow-Mo slow factor at chain milestones (10, 20, ...). |
| `chainMilestoneAutoSlowMoSec` | `0.45` | Duration of automatic milestone slow-mo pulse. |
| `freezeMaxStored` | `1` | Maximum stored Freeze charges earned by sorting a Freeze crystal. |
| `freezeDurationSec` | `3.0` | Duration that belt motion and item spawning pause completely. |

### Difficulty Curve & Waves (`DIFFICULTY`, `WAVE_PATTERNS`)
| Field | Default | Effect |
|---|---|---|
| `DIFFICULTY.travelTimeStartSec` | `5.0` | Time for a regular item to travel top-to-end at `t = 0s`. |
| `DIFFICULTY.travelTimeMinSec` | `1.8` | Fastest travel duration reached at ramp completion. |
| `travelTimeRampDurationSec` | `90.0` | Linear ramp duration from start speed to minimum travel time. |
| `DIFFICULTY.spawnGapStartSec` | `1.0` | Baseline spawn gap at `t = 0s`. |
| `DIFFICULTY.spawnGapMinSec` | `0.35` | Minimum spawn gap floor (~2.85 items/s ceiling). |
| `spawnGapRampDurationSec` | `90.0` | Linear ramp duration for base spawn cadence. |
| `WAVE_PATTERNS` | `stream`, `pair_burst`, `breather`, `spike` | Weighted wave table (`weight`, `minCount`, `maxCount`, `intervalSec`, `restAfterSec`). Engine enforces that every `spike` is immediately followed by `breather`. |

### Rewards & Rendering (`REWARDS`, `RENDER`)
| Field | Default | Effect |
|---|---|---|
| `REWARDS.pointsPerDiamond` | `25` | Wallet diamonds awarded per 25 run points. |
| `REWARDS.dailyNewBestBonusDiamonds` | `5` | Extra diamonds for beating today's Daily Run score. |
| `REWARDS.maxDiamondsPerRun` | `50` | Maximum diamonds awardable from a single run. |
| `RENDER.beltTopWidthRatio` | `0.55` | Perspective taper of belt top width relative to bottom width. |
| `RENDER.itemScaleTop` / `Bottom` | `0.55` / `1.0` | Perspective scale factor of items along belt `Y`. |
| `RENDER.maxDpr` | `2` | Device pixel ratio cap on the game canvas. |
| `RENDER.maxDtSec` | `0.05` | Frame delta clamp (prevents tab-switch leaps). |
| `RENDER.perfFallbackFrameMs` | `12` | Rolling frame-time threshold above which backdrop blur/parallax auto-disable. |
| `RENDER.optionalBgUrl` | `'/games/belt-sort/bg.webp'` | Optional static factory artwork override (under 120 KB); code-drawn scene renders automatically when absent. |

---

## 2. Manual QA Checklist

Verify these flows on real or emulated viewports before shipping balance/UI edits:

- [ ] **Mobile Safari (iOS 9:16 portrait):** Game fits cleanly in viewport without vertical bounce scroll; one-handed thumb taps on bins feel instantaneous (`touch-action: manipulation`); Web Audio starts cleanly after first tap without double-triggering sound; copy button falls back gracefully if Clipboard API rejects.
- [ ] **Android Chrome:** Bins align directly under trapezoid chutes across narrow (360px) and wide (412px) phones; haptic vibration triggers on wrong sort without uncaught exceptions when blocked; Freeze/Slow-Mo radial rings animate smoothly at 60fps.
- [ ] **Desktop Keyboard & Layout:** `1`/`2`/`3`/`4`, `A`/`S`/`D`/`F`, and `ArrowLeft`/`ArrowDown`/`ArrowRight` trigger corresponding active bins; `Q`/`E` or `Space` trigger Freeze/Slow-Mo; `P`/`Escape` pauses/resumes; `M` toggles mute; desktop background fills viewport around centered `<= 480px` play column.
- [ ] **Reduced Motion (`prefers-reduced-motion: reduce`):** Screen shake, conveyor factory parallax, and intense scaling/ray animations are suppressed or shortened; gameplay remains readable and responsive.
- [ ] **Blocked Storage / Private Browsing:** Throwing `SecurityError` on `localStorage.getItem`/`setItem` does not crash startup, run completion, Daily streak lookup, or mute toggle (`safeStorageGet`/`safeStorageSet` fallback).
