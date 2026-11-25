// Centralized per-game best scores, play counts, and recently played history.
// Keeps existing localStorage keys backward-compatible while triggering cloud sync.

import { loadProgress, saveProgress } from '@/game/progress';
import { notifyLocalDataChanged } from '@/lib/syncEvents';

export type GameStatId =
  | 'jelly-bounce'
  | '2048-puzzle'
  | 'cupcake-2048'
  | 'color-zen'
  | 'quick-tap'
  | 'belt-sort';

export interface GameStatMeta {
  id: GameStatId;
  title: string;
  unit: 'm' | 'pts';
  storageKey?: string;
}

export const GAME_STAT_DEFINITIONS: GameStatMeta[] = [
  { id: 'jelly-bounce', title: 'Jump Jelly Jump!', unit: 'm' },
  { id: '2048-puzzle', title: '2048 Neon Fusion', unit: 'pts', storageKey: 'tappyard-2048-best' },
  { id: 'cupcake-2048', title: 'Cupcake 2048', unit: 'pts', storageKey: 'tappyard-cupcake-2048-best' },
  { id: 'color-zen', title: 'Block Grid Zen', unit: 'pts', storageKey: 'tappyard-blockzen-best' },
  { id: 'quick-tap', title: 'Cyber Dash', unit: 'pts', storageKey: 'tappyard-cyberdash-best' },
  { id: 'belt-sort', title: 'Conveyor Sort Rush', unit: 'pts', storageKey: 'tappyard-beltsort-best' },
];

export interface LocalGameStat {
  gameId: GameStatId;
  bestScore: number;
  totalGames: number;
  bestStreak: number;
  extraData: Record<string, unknown>;
}

const RECENT_GAMES_KEY = 'tappyard_recent_games';
const LEGACY_RECENT_KEY = 'playhub_recent_games';

export function getGameBestScore(gameId: GameStatId): number {
  if (typeof window === 'undefined') return 0;

  if (gameId === 'jelly-bounce') {
    return loadProgress().bestDistance || 0;
  }

  const meta = GAME_STAT_DEFINITIONS.find((g) => g.id === gameId);
  if (!meta?.storageKey) return 0;

  try {
    const raw = localStorage.getItem(meta.storageKey);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function setGameBestScore(
  gameId: GameStatId,
  score: number,
  options?: { silentSync?: boolean }
): number {
  if (typeof window === 'undefined') return score;
  const cleanScore = Math.max(0, Math.floor(score));

  if (gameId === 'jelly-bounce') {
    const p = loadProgress();
    if (cleanScore > p.bestDistance) {
      p.bestDistance = cleanScore;
      p.bestScore = cleanScore;
      saveProgress(p, { silentSync: options?.silentSync });
    }
    return p.bestDistance;
  }

  const meta = GAME_STAT_DEFINITIONS.find((g) => g.id === gameId);
  if (!meta?.storageKey) return cleanScore;

  try {
    const current = getGameBestScore(gameId);
    const next = Math.max(current, cleanScore);
    if (next > current || options?.silentSync) {
      localStorage.setItem(meta.storageKey, String(next));
      if (!options?.silentSync && next > current) {
        notifyLocalDataChanged('score');
      }
    }
    return next;
  } catch {
    return cleanScore;
  }
}

export function getGamePlayCount(gameId: GameStatId): number {
  if (typeof window === 'undefined') return 0;
  if (gameId === 'jelly-bounce') {
    return loadProgress().totalGames || 0;
  }
  try {
    const raw = localStorage.getItem(`tappyard_plays_${gameId}`);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function incrementGamePlayCount(gameId: GameStatId): void {
  if (typeof window === 'undefined' || gameId === 'jelly-bounce') return;
  try {
    const current = getGamePlayCount(gameId);
    localStorage.setItem(`tappyard_plays_${gameId}`, String(current + 1));
    notifyLocalDataChanged('score');
  } catch {
    // ignore
  }
}

export function setGamePlayCountFromCloud(gameId: GameStatId, totalGames: number): void {
  if (typeof window === 'undefined') return;
  const clean = Math.max(0, Math.floor(totalGames));
  if (gameId === 'jelly-bounce') {
    const p = loadProgress();
    if (clean > p.totalGames) {
      p.totalGames = clean;
      saveProgress(p, { silentSync: true });
    }
    return;
  }
  try {
    const current = getGamePlayCount(gameId);
    if (clean > current) {
      localStorage.setItem(`tappyard_plays_${gameId}`, String(clean));
    }
  } catch {
    // ignore
  }
}

export function getAllLocalGameStats(): LocalGameStat[] {
  const jelly = loadProgress();
  return GAME_STAT_DEFINITIONS.map((def) => {
    if (def.id === 'jelly-bounce') {
      return {
        gameId: 'jelly-bounce',
        bestScore: jelly.bestDistance || 0,
        totalGames: jelly.totalGames || 0,
        bestStreak: jelly.bestStreak || 0,
        extraData: { totalBoosts: jelly.totalBoosts || 0 },
      };
    }

    return {
      gameId: def.id,
      bestScore: getGameBestScore(def.id),
      totalGames: getGamePlayCount(def.id),
      bestStreak: 0,
      extraData: {},
    };
  });
}

export function getRecentGameIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored =
      localStorage.getItem(RECENT_GAMES_KEY) ||
      localStorage.getItem(LEGACY_RECENT_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const ids: string[] = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];

    if (
      !ids.includes('jelly-bounce') &&
      localStorage.getItem('jelly-bounce-progress')
    ) {
      ids.unshift('jelly-bounce');
    }
    return ids.slice(0, 6);
  } catch {
    return [];
  }
}

export function addRecentGameId(gameId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getRecentGameIds();
    const updated = [gameId, ...current.filter((id) => id !== gameId)].slice(0, 6);
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(updated));
    notifyLocalDataChanged('recent');
    return updated;
  } catch {
    return [];
  }
}

export function setRecentGameIdsFromCloud(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = ids.filter((id) => typeof id === 'string').slice(0, 6);
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(clean));
  } catch {
    // ignore
  }
}
