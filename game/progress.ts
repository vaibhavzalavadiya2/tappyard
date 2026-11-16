// Progress manager - handles localStorage persistence for Jump Jelly Jump
import { GAME_CONFIG } from './config';

export interface GameProgress {
  bestDistance: number;
  bestScore: number; // backward compatibility
  totalDiamonds: number;
  totalGames: number;
  totalBoosts: number;
  bestStreak: number;
  unlockedSkins: string[];
  selectedSkin: string;
  soundMuted: boolean;
}

const STORAGE_KEY = 'jelly-jump-progress';
const LEGACY_STORAGE_KEY = 'jelly-bounce-progress';

const DEFAULT_PROGRESS: GameProgress = {
  bestDistance: 0,
  bestScore: 0,
  totalDiamonds: 0,
  totalGames: 0,
  totalBoosts: 0,
  bestStreak: 0,
  unlockedSkins: ['bubblegum'],
  selectedSkin: 'bubblegum',
  soundMuted: false,
};

export function loadProgress(): GameProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const data = JSON.parse(raw);
    const progress: GameProgress = { ...DEFAULT_PROGRESS, ...data };

    // Migrate old score to distance if present
    if (!progress.bestDistance && progress.bestScore) {
      progress.bestDistance = progress.bestScore * 15;
    }
    progress.bestScore = progress.bestDistance;

    // Ensure default skin unlocked
    if (!progress.unlockedSkins.includes('bubblegum')) {
      progress.unlockedSkins.push('bubblegum');
    }
    if (!progress.selectedSkin || !GAME_CONFIG.JELLY_SKINS.some(s => s.id === progress.selectedSkin)) {
      progress.selectedSkin = 'bubblegum';
    }

    return progress;
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: GameProgress): void {
  if (typeof window === 'undefined') return;
  try {
    progress.bestScore = progress.bestDistance;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage may be disabled or full
  }
}

export function updateAfterRun(
  distance: number,
  diamondsCollected: number,
  boosts: number,
  streak: number
): { isNewRecord: boolean; newUnlocks: string[]; progress: GameProgress } {
  const progress = loadProgress();
  const isNewRecord = distance > progress.bestDistance;

  if (isNewRecord) {
    progress.bestDistance = distance;
    progress.bestScore = distance;
  }
  if (streak > progress.bestStreak) {
    progress.bestStreak = streak;
  }

  progress.totalDiamonds += diamondsCollected;
  progress.totalGames++;
  progress.totalBoosts += boosts;

  saveProgress(progress);
  return { isNewRecord, newUnlocks: [], progress };
}

export function selectSkin(skinId: string): GameProgress {
  const progress = loadProgress();
  const skin = GAME_CONFIG.JELLY_SKINS.find((s) => s.id === skinId);
  if (skin && progress.unlockedSkins.includes(skinId)) {
    progress.selectedSkin = skinId;
    saveProgress(progress);
  }
  return progress;
}

export function unlockSkinWithDiamonds(skinId: string): { success: boolean; progress: GameProgress } {
  const progress = loadProgress();
  const skin = GAME_CONFIG.JELLY_SKINS.find(s => s.id === skinId);

  if (!skin) return { success: false, progress };
  if (progress.unlockedSkins.includes(skinId)) {
    progress.selectedSkin = skinId;
    saveProgress(progress);
    return { success: true, progress };
  }

  if (progress.totalDiamonds >= skin.unlockCost) {
    progress.totalDiamonds -= skin.unlockCost;
    progress.unlockedSkins.push(skinId);
    progress.selectedSkin = skinId;
    saveProgress(progress);
    return { success: true, progress };
  }

  return { success: false, progress };
}
