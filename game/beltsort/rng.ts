// Deterministic Seeded PRNG (String Hash + Mulberry32) for Daily Challenge & Reproducible Waves

/**
 * Deterministic 32-bit FNV-1a string hash.
 * Identical date strings yield identical 32-bit seeds across every browser/device.
 */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Fast, high-quality 32-bit seeded PRNG returning numbers in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function nextRandom() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Local calendar date in YYYY-MM-DD format so Daily Run resets at local midnight.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Creates the shared Daily Run RNG for a given local YYYY-MM-DD date string.
 */
export function createDailyRng(dateStr: string = getLocalDateString()): () => number {
  const seed = hashString(`tappyard-beltsort-daily:${dateStr}`);
  return mulberry32(seed);
}
