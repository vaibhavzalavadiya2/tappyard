// Conveyor Sort Rush - Centralized Tuning & Visual Tokens Configuration
// All gameplay numbers, difficulty curves, wave patterns, and colors live here
// so balance and visuals can be adjusted cleanly without touching engine logic.

export type ShapeKind = 'circle' | 'square' | 'triangle' | 'diamond';
export type ItemKind = ShapeKind | 'wildcard' | 'freeze';
export type GameMode = 'endless' | 'daily';
export type WavePatternType = 'stream' | 'pair_burst' | 'breather' | 'spike';

export interface BinConfig {
  id: ShapeKind;
  label: string;
  keyHint: string;
  altKeyHint: string;
  light: string;
  mid: string;
  dark: string;
  rim: string;
  innerPit: string;
  innerShade: string;
}

export interface WavePatternDef {
  type: WavePatternType;
  weight: number;
  minCount: number;
  maxCount: number;
  intervalSec: number;
  restAfterSec: number;
  speedMultiplier: number;
}

export const BELT_SORT_CONFIG = {
  GAME_SLUG: 'belt-sort',
  GAME_TITLE: 'Conveyor Sort Rush',
  STORAGE_KEYS: {
    ENDLESS_BEST: 'tappyard-beltsort-best',
    DAILY_BEST_PREFIX: 'tappyard-beltsort-daily-best-',
    DAILY_PLAYED_PREFIX: 'tappyard-beltsort-daily-played-',
    DAILY_STREAK: 'tappyard-beltsort-daily-streak',
    DAILY_LAST_DATE: 'tappyard-beltsort-daily-last-date',
    RUNS_COUNT: 'tappyard-beltsort-runs',
    MUTE: 'tappyard-beltsort-mute',
  },

  // Primary visual color palette & tokens
  COLORS: {
    skyTop: '#6ec6ff',
    skyBottom: '#8f7bff',
    panelTop: '#162468',
    panelBottom: '#0b1233',
    panelBorder: '#5aa9ff',
    panelShadow: '#0a0f2b',
    numLight: '#ffe36e',
    numDark: '#ffb300',
    numStroke: '#09123a',
    beltSlate: '#3a3f52',
    beltSlateTop: '#4c526b',
    beltSlateBottom: '#2d3242',
    beltChevron: 'rgba(255, 255, 255, 0.12)',
    railLight: '#d3c2ff',
    railMid: '#a78bfa',
    railDark: '#6c4fd6',
    clampLight: '#ffe074',
    clampMid: '#ffb300',
    clampDark: '#b45309',
    perfectGold: '#ffd23f',
    perfectGoldLight: '#fff3a1',
    perfectGoldDark: '#f59e0b',
    wildcardGoldLight: '#fff6a6',
    wildcardGold: '#ffd23f',
    wildcardGoldDark: '#d97706',
    freezeLight: '#cffafe',
    freezeMid: '#38bdf8',
    freezeDark: '#0369a1',
  },

  // 4 Matching Shape Bins (First 3 start unlocked; 4th unlocks at 25 sorts)
  BINS: [
    {
      id: 'circle',
      label: 'Blue Circle',
      keyHint: '1',
      altKeyHint: 'A',
      light: '#62a4ff',
      mid: '#2f6bff',
      dark: '#1642bf',
      rim: '#92c2ff',
      innerPit: '#0b216b',
      innerShade: '#153ba8',
    },
    {
      id: 'square',
      label: 'Green Square',
      keyHint: '2',
      altKeyHint: 'S',
      light: '#64e577',
      mid: '#2fbf4a',
      dark: '#187c2c',
      rim: '#9cf5a8',
      innerPit: '#0c3f18',
      innerShade: '#146827',
    },
    {
      id: 'triangle',
      label: 'Red Triangle',
      keyHint: '3',
      altKeyHint: 'D',
      light: '#ff7068',
      mid: '#ff3b30',
      dark: '#b31b13',
      rim: '#ffa19c',
      innerPit: '#5a0c08',
      innerShade: '#8c150f',
    },
    {
      id: 'diamond',
      label: 'Purple Diamond',
      keyHint: '4',
      altKeyHint: 'F',
      light: '#b37aff',
      mid: '#8a3ffc',
      dark: '#5219b8',
      rim: '#d4b5ff',
      innerPit: '#27095c',
      innerShade: '#421296',
    },
  ] as BinConfig[],

  // Core scoring & chain multipliers
  SCORING: {
    basePoints: 10,
    perfectZoneRatio: 0.18, // Last 18% of belt before end line (yProgress >= 0.82)
    perfectMultiplier: 2,
    wildcardMultiplier: 2,
    chainStepForMultiplier: 5, // 1 + floor(chain / 5)
    maxChainMultiplier: 5,
    chainBonusInterval: 10, // Bonus +50 & Slow-Mo charge every 10 chain
    chainBonusPoints: 50,
  },

  // Lives & Mode parameters
  GAMEPLAY: {
    maxHearts: 3,
    dailyDurationSec: 60,
    initialBinCount: 3,
    maxBinCount: 4,
    guidedSequence: ['circle', 'square', 'triangle'] as ShapeKind[],
    guidedTravelTimeSec: 5.4,
    perfectBannerRunsVisible: 3, // "Perfect Zone! x2 Points" tag visible for first 3 runs
    firstRunOnlyHint: true,
  },

  // Unlocks & Special Item drop rates
  UNLOCKS: {
    fourthBinSorts: 25,
    specialsSorts: 60,
    wildcardChanceAfterUnlock: 1 / 14, // ~1 in 14 items after 60 sorts
    freezeChanceAfterUnlock: 1 / 25, // ~1 in 25 items after 60 sorts
  },

  // Power-ups (stored max 1 each)
  POWERUPS: {
    slowMoMaxStored: 1,
    slowMoBeltFactor: 0.6, // 60% belt speed
    slowMoDurationSec: 2.0,
    chainMilestoneAutoSlowMoFactor: 0.45,
    chainMilestoneAutoSlowMoSec: 0.45,
    freezeMaxStored: 1,
    freezeDurationSec: 3.0,
  },

  // Difficulty Curve (capped <= ~3 items/sec)
  DIFFICULTY: {
    travelTimeStartSec: 5.0,
    travelTimeMinSec: 1.8,
    travelTimeRampDurationSec: 90.0,
    spawnGapStartSec: 1.0,
    spawnGapMinSec: 0.35, // <= ~2.85 items/s (fair ceiling)
    spawnGapRampDurationSec: 90.0,
  },

  // Wave Patterns Table (Rule: spike is always followed by breather)
  WAVE_PATTERNS: [
    {
      type: 'stream',
      weight: 45,
      minCount: 6,
      maxCount: 10,
      intervalSec: 1.0, // Scales with current spawnGap multiplier
      restAfterSec: 0.45,
      speedMultiplier: 1.0,
    },
    {
      type: 'pair_burst',
      weight: 28,
      minCount: 2,
      maxCount: 2,
      intervalSec: 0.25, // 2 items 0.25s apart (scaled gently only above min gap ceiling)
      restAfterSec: 0.9, // Followed by 0.9s rest
      speedMultiplier: 1.0,
    },
    {
      type: 'breather',
      weight: 12,
      minCount: 0,
      maxCount: 0,
      intervalSec: 1.2,
      restAfterSec: 1.2,
      speedMultiplier: 1.0,
    },
    {
      type: 'spike',
      weight: 15,
      minCount: 5,
      maxCount: 5,
      intervalSec: 0.4, // 5 fast items 0.4s apart, ALWAYS followed by breather
      restAfterSec: 0.5,
      speedMultiplier: 1.0,
    },
  ] as WavePatternDef[],

  // TAPPYARD Shared Economy Rewards
  REWARDS: {
    pointsPerDiamond: 25,
    dailyNewBestBonusDiamonds: 5,
    maxDiamondsPerRun: 50,
  },

  // Perspective & Render Constants
  RENDER: {
    beltTopWidthRatio: 0.55, // Top of belt ~55% of bottom width
    itemScaleTop: 0.55,
    itemScaleBottom: 1.0,
    maxDpr: 2,
    maxDtSec: 0.05, // 50ms dt clamp
    perfFallbackFrameMs: 12, // Disable blur + parallax if avg frame time > 12ms
    optionalBgUrl: '/games/belt-sort/bg.webp',
  },
} as const;
