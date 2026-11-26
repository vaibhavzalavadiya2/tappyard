// 2048 Neon Fusion Core Game Engine
// High-performance 4x4 matrix mechanics with smooth tile position tracking

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface BoardTile {
  id: number;
  value: number;
  row: number; // 0 to 3
  col: number; // 0 to 3
  isNew?: boolean;
  isMerged?: boolean;
}

export interface GameState {
  tiles: BoardTile[];
  score: number;
  bestScore: number;
  isGameOver: boolean;
  hasWon: boolean;
  canUndo: boolean;
  diamondsEarned: number;
}

let nextTileId = 1;

// Tile Color Scheme for Neon Theme
export function getTileStyle(value: number): {
  bg: string;
  text: string;
  border: string;
  glow: string;
  fontSize: string;
} {
  switch (value) {
    case 2:
      return {
        bg: 'from-cyan-950/80 to-[#0c2e3d]',
        text: 'text-cyan-200',
        border: 'border-cyan-500/40',
        glow: 'shadow-[0_0_12px_rgba(0,240,255,0.25)]',
        fontSize: 'text-2xl sm:text-3xl',
      };
    case 4:
      return {
        bg: 'from-[#0b3848] to-[#074b63]',
        text: 'text-cyan-100',
        border: 'border-cyan-400/60',
        glow: 'shadow-[0_0_16px_rgba(0,240,255,0.4)]',
        fontSize: 'text-2xl sm:text-3xl',
      };
    case 8:
      return {
        bg: 'from-emerald-950 to-teal-800',
        text: 'text-emerald-200',
        border: 'border-teal-400/60',
        glow: 'shadow-[0_0_16px_rgba(20,184,166,0.4)]',
        fontSize: 'text-2xl sm:text-3xl',
      };
    case 16:
      return {
        bg: 'from-amber-950 to-amber-800',
        text: 'text-amber-200',
        border: 'border-amber-400/60',
        glow: 'shadow-[0_0_18px_rgba(251,191,36,0.45)]',
        fontSize: 'text-2xl sm:text-3xl',
      };
    case 32:
      return {
        bg: 'from-orange-950 to-orange-700',
        text: 'text-orange-100',
        border: 'border-orange-400/70',
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
        fontSize: 'text-2xl sm:text-3xl',
      };
    case 64:
      return {
        bg: 'from-red-950 to-rose-700',
        text: 'text-rose-100',
        border: 'border-rose-400/80',
        glow: 'shadow-[0_0_22px_rgba(244,63,94,0.55)]',
        fontSize: 'text-2xl sm:text-3xl',
      };
    case 128:
      return {
        bg: 'from-fuchsia-950 to-pink-700',
        text: 'text-pink-100',
        border: 'border-pink-400/80',
        glow: 'shadow-[0_0_24px_rgba(236,72,153,0.6)]',
        fontSize: 'text-xl sm:text-2xl',
      };
    case 256:
      return {
        bg: 'from-purple-950 to-violet-700',
        text: 'text-violet-100',
        border: 'border-violet-400/90',
        glow: 'shadow-[0_0_26px_rgba(139,92,246,0.65)]',
        fontSize: 'text-xl sm:text-2xl',
      };
    case 512:
      return {
        bg: 'from-indigo-950 to-blue-700',
        text: 'text-blue-100',
        border: 'border-blue-400',
        glow: 'shadow-[0_0_28px_rgba(59,130,246,0.7)]',
        fontSize: 'text-xl sm:text-2xl',
      };
    case 1024:
      return {
        bg: 'from-[#052b3b] via-[#09526b] to-cyan-500',
        text: 'text-white',
        border: 'border-cyan-300',
        glow: 'shadow-[0_0_32px_rgba(6,182,212,0.8)]',
        fontSize: 'text-lg sm:text-xl',
      };
    case 2048:
      return {
        bg: 'from-amber-600 via-yellow-400 to-amber-500',
        text: 'text-amber-950',
        border: 'border-yellow-200',
        glow: 'shadow-[0_0_36px_rgba(234,179,8,0.95)] animate-pulse',
        fontSize: 'text-lg sm:text-xl',
      };
    default:
      // 4096+ Cosmic Iridescent
      return {
        bg: 'from-purple-600 via-pink-500 to-cyan-400',
        text: 'text-white',
        border: 'border-white',
        glow: 'shadow-[0_0_40px_rgba(255,255,255,0.9)] animate-pulse',
        fontSize: 'text-base sm:text-lg',
      };
  }
}

// Find empty grid cells
function getEmptyCells(tiles: BoardTile[]): { row: number; col: number }[] {
  const occupied = new Set(tiles.map((t) => `${t.row},${t.col}`));
  const empty: { row: number; col: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!occupied.has(`${r},${c}`)) {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty;
}

// Spawn random tile (90% chance of 2, 10% chance of 4)
export function spawnRandomTile(tiles: BoardTile[]): BoardTile | null {
  const empty = getEmptyCells(tiles);
  if (empty.length === 0) return null;
  const pos = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  return {
    id: nextTileId++,
    value,
    row: pos.row,
    col: pos.col,
    isNew: true,
  };
}

// Check if any valid moves remain
export function canMakeMove(tiles: BoardTile[]): boolean {
  if (tiles.length < 16) return true;

  // Build 4x4 matrix
  const matrix: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  tiles.forEach((t) => {
    matrix[t.row][t.col] = t.value;
  });

  // Check horizontal and vertical neighbors for matching values
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = matrix[r][c];
      if (val === 0) return true;
      if (c < 3 && matrix[r][c + 1] === val) return true;
      if (r < 3 && matrix[r + 1][c] === val) return true;
    }
  }

  return false;
}

// Execute move in one direction
export function executeMove(
  direction: Direction,
  currentTiles: BoardTile[],
  currentScore: number
): {
  tiles: BoardTile[];
  score: number;
  scoreDelta: number;
  moved: boolean;
  highestMerged: number;
  mergeCount: number;
  diamondReward: number;
} {
  // Build grid
  const grid: (BoardTile | null)[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(null)
  );

  currentTiles.forEach((tile) => {
    grid[tile.row][tile.col] = { ...tile, isNew: false, isMerged: false };
  });

  let moved = false;
  let scoreDelta = 0;
  let highestMerged = 0;
  let mergeCount = 0;
  const newTiles: BoardTile[] = [];

  // Traverse lines based on direction
  const isHorizontal = direction === 'left' || direction === 'right';
  const isReverse = direction === 'right' || direction === 'down';

  for (let i = 0; i < 4; i++) {
    const line: (BoardTile | null)[] = [];
    for (let j = 0; j < 4; j++) {
      line.push(isHorizontal ? grid[i][j] : grid[j][i]);
    }

    if (isReverse) line.reverse();

    // Compact non-nulls
    const filtered = line.filter((t): t is BoardTile => t !== null);
    const mergedLine: BoardTile[] = [];

    let skipNext = false;
    for (let idx = 0; idx < filtered.length; idx++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const current = filtered[idx];
      const next = filtered[idx + 1];

      if (next && current.value === next.value) {
        // Merge! Reuse current.id so CSS left/top transition slides tile into destination
        const mergedValue = current.value * 2;
        scoreDelta += mergedValue;
        mergeCount++;
        if (mergedValue > highestMerged) {
          highestMerged = mergedValue;
        }

        mergedLine.push({
          id: current.id,
          value: mergedValue,
          row: current.row,
          col: current.col,
          isMerged: true,
        });

        skipNext = true;
      } else {
        mergedLine.push(current);
      }
    }

    // Place collapsed tiles starting from the target edge (pos 0 -> index 0, or index 3 when reversed)
    for (let pos = 0; pos < mergedLine.length; pos++) {
      const item = mergedLine[pos];
      const targetIndex = isReverse ? 3 - pos : pos;
      const targetR = isHorizontal ? i : targetIndex;
      const targetC = isHorizontal ? targetIndex : i;

      if (item.row !== targetR || item.col !== targetC || item.isMerged) {
        moved = true;
      }
      item.row = targetR;
      item.col = targetC;
      newTiles.push(item);
    }
  }

  // Calculate diamond rewards on milestone merges
  let diamondReward = 0;
  if (highestMerged >= 2048) diamondReward = 20;
  else if (highestMerged >= 1024) diamondReward = 10;
  else if (highestMerged >= 512) diamondReward = 5;
  else if (highestMerged >= 256) diamondReward = 2;
  else if (highestMerged >= 128) diamondReward = 1;

  if (moved) {
    const spawned = spawnRandomTile(newTiles);
    if (spawned) {
      newTiles.push(spawned);
    }
  }

  return {
    tiles: moved ? newTiles : currentTiles,
    score: currentScore + scoreDelta,
    scoreDelta,
    moved,
    highestMerged,
    mergeCount,
    diamondReward,
  };
}

// Initial board setup with 2 random tiles
export function createNewBoard(): BoardTile[] {
  const tiles: BoardTile[] = [];
  const t1 = spawnRandomTile(tiles);
  if (t1) tiles.push(t1);
  const t2 = spawnRandomTile(tiles);
  if (t2) tiles.push(t2);
  return tiles;
}

/**
 * Ensures nextTileId never collides with tiles restored from localStorage.
 */
export function syncNextTileId(tiles: ReadonlyArray<BoardTile>): void {
  let maxId = 0;
  for (const t of tiles) {
    if (typeof t.id === 'number' && t.id > maxId) {
      maxId = t.id;
    }
  }
  if (maxId >= nextTileId) {
    nextTileId = maxId + 1;
  }
}

export interface Persisted2048State {
  tiles: BoardTile[];
  score: number;
  moves: number;
  history: { tiles: BoardTile[]; score: number }[];
  hasWon: boolean;
  keepPlaying: boolean;
}

function isValidTile(raw: unknown): raw is BoardTile {
  if (!raw || typeof raw !== 'object') return false;
  const t = raw as Partial<BoardTile>;
  return (
    typeof t.id === 'number' &&
    Number.isInteger(t.id) &&
    typeof t.value === 'number' &&
    t.value >= 2 &&
    typeof t.row === 'number' &&
    t.row >= 0 &&
    t.row <= 3 &&
    typeof t.col === 'number' &&
    t.col >= 0 &&
    t.col <= 3
  );
}

export function loadSaved2048State(storageKey: string): Persisted2048State | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persisted2048State>;
    if (!Array.isArray(parsed.tiles) || parsed.tiles.length === 0) return null;

    const cleanTiles = parsed.tiles.filter(isValidTile);
    if (cleanTiles.length !== parsed.tiles.length || cleanTiles.length > 16) {
      return null;
    }

    // Verify no duplicate cell coordinates
    const occupied = new Set<string>();
    for (const t of cleanTiles) {
      const k = `${t.row},${t.col}`;
      if (occupied.has(k)) return null;
      occupied.add(k);
    }

    syncNextTileId(cleanTiles);
    const cleanHistory = Array.isArray(parsed.history)
      ? parsed.history.filter(
          (h) =>
            h &&
            typeof h === 'object' &&
            Array.isArray(h.tiles) &&
            h.tiles.every(isValidTile) &&
            typeof h.score === 'number'
        )
      : [];
    for (const h of cleanHistory) {
      syncNextTileId(h.tiles);
    }

    return {
      tiles: cleanTiles.map((t) => ({ ...t, isNew: false, isMerged: false })),
      score: typeof parsed.score === 'number' && parsed.score >= 0 ? parsed.score : 0,
      moves: typeof parsed.moves === 'number' && parsed.moves >= 0 ? parsed.moves : 0,
      history: cleanHistory,
      hasWon: Boolean(parsed.hasWon),
      keepPlaying: Boolean(parsed.keepPlaying),
    };
  } catch {
    return null;
  }
}

export function save2048State(storageKey: string, state: Persisted2048State): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Graceful no-op when storage is unavailable
  }
}

export function clearSaved2048State(storageKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage restriction
  }
}
