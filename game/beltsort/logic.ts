// Pure, side-effect-free gameplay logic, wave scheduler math, scoring & daily helpers
// All tuning values come strictly from ./config.ts.

import {
  BELT_SORT_CONFIG,
  type ItemKind,
  type ShapeKind,
  type WavePatternDef,
  type WavePatternType,
} from './config';

export type SortOutcome = 'correct' | 'wrong' | 'miss';

export interface SortEvaluation {
  isCorrect: boolean;
  isPerfect: boolean;
  isWildcard: boolean;
  grantedFreeze: boolean;
  nextChain: number;
  multiplier: number;
  chainBonus: number;
  pointsAwarded: number;
  grantedSlowMo: boolean;
}

export function isInPerfectZone(yProgress: number): boolean {
  const threshold = Number(
    (1 - BELT_SORT_CONFIG.SCORING.perfectZoneRatio).toFixed(6)
  );
  return yProgress >= threshold && yProgress <= 1.0;
}

export function getChainMultiplier(chain: number): number {
  const cleanChain = Math.max(0, Math.floor(chain));
  const { chainStepForMultiplier, maxChainMultiplier } = BELT_SORT_CONFIG.SCORING;
  return Math.min(
    maxChainMultiplier,
    1 + Math.floor(cleanChain / chainStepForMultiplier)
  );
}

export function evaluateSort(
  itemKind: ItemKind,
  targetBin: ShapeKind,
  yProgress: number,
  currentChain: number
): SortEvaluation {
  const isWildcard = itemKind === 'wildcard';
  const isFreezeItem = itemKind === 'freeze';
  const isCorrect = isWildcard || isFreezeItem || itemKind === targetBin;

  if (!isCorrect) {
    return {
      isCorrect: false,
      isPerfect: false,
      isWildcard: false,
      grantedFreeze: false,
      nextChain: 0,
      multiplier: 1,
      chainBonus: 0,
      pointsAwarded: 0,
      grantedSlowMo: false,
    };
  }

  const nextChain = currentChain + 1;
  const isPerfect = isInPerfectZone(yProgress);
  const multiplier = getChainMultiplier(nextChain);

  const {
    basePoints,
    perfectMultiplier,
    wildcardMultiplier,
    chainBonusInterval,
    chainBonusPoints,
  } = BELT_SORT_CONFIG.SCORING;

  const perfectFactor = isPerfect ? perfectMultiplier : 1;
  const wildFactor = isWildcard ? wildcardMultiplier : 1;
  const itemPoints = basePoints * multiplier * perfectFactor * wildFactor;

  const hitMilestone = nextChain > 0 && nextChain % chainBonusInterval === 0;
  const chainBonus = hitMilestone ? chainBonusPoints : 0;

  return {
    isCorrect: true,
    isPerfect,
    isWildcard,
    grantedFreeze: isFreezeItem,
    nextChain,
    multiplier,
    chainBonus,
    pointsAwarded: itemPoints + chainBonus,
    grantedSlowMo: hitMilestone,
  };
}

export function getTravelTimeSec(elapsedSec: number, isGuidedItem = false): number {
  if (isGuidedItem) {
    return BELT_SORT_CONFIG.GAMEPLAY.guidedTravelTimeSec;
  }
  const {
    travelTimeStartSec,
    travelTimeMinSec,
    travelTimeRampDurationSec,
  } = BELT_SORT_CONFIG.DIFFICULTY;
  const t = Math.max(0, Math.min(1, elapsedSec / travelTimeRampDurationSec));
  return Math.max(
    travelTimeMinSec,
    (1 - t) * travelTimeStartSec + t * travelTimeMinSec
  );
}

export function getSpawnGapSec(elapsedSec: number): number {
  const {
    spawnGapStartSec,
    spawnGapMinSec,
    spawnGapRampDurationSec,
  } = BELT_SORT_CONFIG.DIFFICULTY;
  const t = Math.max(0, Math.min(1, elapsedSec / spawnGapRampDurationSec));
  return Math.max(
    spawnGapMinSec,
    (1 - t) * spawnGapStartSec + t * spawnGapMinSec
  );
}

export function pickNextItemKind(
  rng: () => number,
  activeBinCount: number,
  specialsUnlocked: boolean,
  spawnedIndex: number
): ItemKind {
  const guided = BELT_SORT_CONFIG.GAMEPLAY.guidedSequence;
  if (spawnedIndex < guided.length) {
    return guided[spawnedIndex];
  }

  if (specialsUnlocked) {
    const roll = rng();
    const { wildcardChanceAfterUnlock, freezeChanceAfterUnlock } =
      BELT_SORT_CONFIG.UNLOCKS;
    if (roll < wildcardChanceAfterUnlock) {
      return 'wildcard';
    }
    if (roll < wildcardChanceAfterUnlock + freezeChanceAfterUnlock) {
      return 'freeze';
    }
  }

  const count = Math.max(
    BELT_SORT_CONFIG.GAMEPLAY.initialBinCount,
    Math.min(BELT_SORT_CONFIG.BINS.length, activeBinCount)
  );
  const idx = Math.floor(rng() * count);
  return BELT_SORT_CONFIG.BINS[idx].id;
}

export function pickNextWavePattern(
  rng: () => number,
  lastWaveType: WavePatternType | null
): WavePatternDef {
  const patterns = BELT_SORT_CONFIG.WAVE_PATTERNS;

  // Hard rule: a spike is ALWAYS followed by a breather
  if (lastWaveType === 'spike') {
    const breather = patterns.find((p) => p.type === 'breather');
    if (breather) return breather;
  }

  const eligible =
    lastWaveType === 'breather'
      ? patterns.filter((p) => p.type !== 'breather')
      : patterns;

  const totalWeight = eligible.reduce((sum, p) => sum + p.weight, 0);
  let r = rng() * totalWeight;
  for (const p of eligible) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return eligible[0];
}

export function getWaveSpawnIntervalSec(
  pattern: WavePatternDef,
  elapsedSec: number
): number {
  const { spawnGapMinSec, spawnGapStartSec } = BELT_SORT_CONFIG.DIFFICULTY;
  const rampRatio = getSpawnGapSec(elapsedSec) / spawnGapStartSec;

  if (pattern.type === 'pair_burst') {
    return Math.max(spawnGapMinSec * 0.71, pattern.intervalSec);
  }
  if (pattern.type === 'spike') {
    return Math.max(spawnGapMinSec, pattern.intervalSec);
  }
  if (pattern.type === 'breather') {
    return pattern.intervalSec;
  }
  // Stream scales cleanly with elapsed spawn curve, never dropping below spawnGapMinSec
  return Math.max(spawnGapMinSec, pattern.intervalSec * rampRatio);
}

export function calculateAccuracyPercent(
  correct: number,
  wrong: number,
  missed: number
): number {
  const total = correct + wrong + missed;
  if (total <= 0) return 100;
  return Math.round((correct / total) * 100);
}

export function computeDiamondsEarned(
  score: number,
  isNewDailyBest: boolean
): number {
  const { pointsPerDiamond, dailyNewBestBonusDiamonds, maxDiamondsPerRun } =
    BELT_SORT_CONFIG.REWARDS;
  const raw =
    Math.floor(Math.max(0, score) / pointsPerDiamond) +
    (isNewDailyBest ? dailyNewBestBonusDiamonds : 0);
  return Math.min(maxDiamondsPerRun, raw);
}

export function formatTimeMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getNextChainTarget(chain: number): number {
  const interval = BELT_SORT_CONFIG.SCORING.chainBonusInterval;
  return (Math.floor(Math.max(0, chain) / interval) + 1) * interval;
}

export function formatDailyEmojiGrid(outcomes: SortOutcome[]): string {
  const rows: string[] = [];
  for (let i = 0; i < outcomes.length; i += 10) {
    const slice = outcomes.slice(i, i + 10);
    rows.push(
      slice
        .map((o) => (o === 'correct' ? '🟩' : o === 'wrong' ? '🟥' : '⬛'))
        .join('')
    );
  }
  return rows.join('\n');
}

export function buildDailyShareText(params: {
  dateStr: string;
  score: number;
  bestChain: number;
  accuracyPercent: number;
  outcomes: SortOutcome[];
  streak: number;
}): string {
  const grid = formatDailyEmojiGrid(params.outcomes);
  return [
    `Conveyor Sort Rush — Daily ${params.dateStr}`,
    `Score: ${params.score.toLocaleString()} | Best Chain: x${params.bestChain} | Acc: ${params.accuracyPercent}%`,
    `Streak: ${params.streak} day${params.streak === 1 ? '' : 's'}`,
    grid || '⬛',
    'Play free: https://tappyard.com/games/belt-sort',
  ].join('\n');
}

export function parseLocalDateYMD(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  const dt = new Date(y, m, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== m ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function updateDailyStreakValue(
  todayStr: string,
  lastDateStr: string | null,
  currentStreak: number
): { streak: number; lastDate: string } {
  const cleanStreak = Math.max(0, Math.floor(currentStreak));
  if (!lastDateStr) {
    return { streak: 1, lastDate: todayStr };
  }
  if (lastDateStr === todayStr) {
    return { streak: Math.max(1, cleanStreak), lastDate: todayStr };
  }
  const todayDt = parseLocalDateYMD(todayStr);
  const lastDt = parseLocalDateYMD(lastDateStr);
  if (todayDt && lastDt) {
    const diffDays = Math.round(
      (todayDt.getTime() - lastDt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      return { streak: cleanStreak + 1, lastDate: todayStr };
    }
  }
  return { streak: 1, lastDate: todayStr };
}

export function safeStorageGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeStorageSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Graceful no-op when storage is blocked
  }
}
