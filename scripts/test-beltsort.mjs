import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

/**
 * Loads TypeScript modules from game/beltsort cleanly in memory using the
 * project's installed TypeScript compiler without leaving compiled artifacts.
 */
function loadBeltSortModules() {
  const baseDir = path.resolve(process.cwd(), 'game', 'beltsort');
  const cache = new Map();

  function loadTsModule(filename) {
    if (cache.has(filename)) return cache.get(filename);

    const fullPath = path.join(baseDir, filename);
    const source = fs.readFileSync(fullPath, 'utf8');
    const transpiled = ts.transpileModule(source, {
      fileName: fullPath,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        strict: true,
      },
    });

    const moduleObj = { exports: {} };
    cache.set(filename, moduleObj.exports);

    const localRequire = (specifier) => {
      if (specifier === './config') return loadTsModule('config.ts');
      if (specifier === './rng') return loadTsModule('rng.ts');
      if (specifier === './logic') return loadTsModule('logic.ts');
      return require(specifier);
    };

    const wrapped = `(function(exports, require, module, __filename, __dirname) {\n${transpiled.outputText}\n})`;
    const fn = vm.runInThisContext(wrapped, { filename: fullPath });
    fn(moduleObj.exports, localRequire, moduleObj, fullPath, baseDir);
    cache.set(filename, moduleObj.exports);
    return moduleObj.exports;
  }

  return {
    config: loadTsModule('config.ts'),
    rng: loadTsModule('rng.ts'),
    logic: loadTsModule('logic.ts'),
  };
}

const { config, rng, logic } = loadBeltSortModules();
const { BELT_SORT_CONFIG } = config;

test('Seeded RNG determinism: hashString, mulberry32, and createDailyRng', () => {
  const h1 = rng.hashString('2026-11-25');
  const h2 = rng.hashString('2026-11-25');
  const h3 = rng.hashString('2026-11-26');
  assert.equal(h1, h2);
  assert.notEqual(h1, h3);
  assert.ok(Number.isInteger(h1) && h1 >= 0 && h1 <= 0xffffffff);

  const a = rng.mulberry32(123456);
  const b = rng.mulberry32(123456);
  const seqA = Array.from({ length: 12 }, () => a());
  const seqB = Array.from({ length: 12 }, () => b());
  assert.deepEqual(seqA, seqB);
  for (const val of seqA) {
    assert.ok(val >= 0 && val < 1);
  }

  const dailyA = rng.createDailyRng('2026-11-25');
  const dailyB = rng.createDailyRng('2026-11-25');
  const dailyNext = rng.createDailyRng('2026-11-26');
  const seqDailyA = Array.from({ length: 20 }, () => dailyA());
  const seqDailyB = Array.from({ length: 20 }, () => dailyB());
  const seqDailyNext = Array.from({ length: 20 }, () => dailyNext());
  assert.deepEqual(seqDailyA, seqDailyB);
  assert.notDeepEqual(seqDailyA, seqDailyNext);

  assert.equal(rng.getLocalDateString(new Date(2026, 0, 5)), '2026-01-05');
});

test('Perfect zone boundaries and chain multiplier tiers', () => {
  assert.equal(logic.isInPerfectZone(0.0), false);
  assert.equal(logic.isInPerfectZone(0.8199), false);
  assert.equal(logic.isInPerfectZone(0.82), true);
  assert.equal(logic.isInPerfectZone(0.95), true);
  assert.equal(logic.isInPerfectZone(1.0), true);
  assert.equal(logic.isInPerfectZone(1.01), false);

  assert.equal(logic.getChainMultiplier(0), 1);
  assert.equal(logic.getChainMultiplier(4), 1);
  assert.equal(logic.getChainMultiplier(5), 2);
  assert.equal(logic.getChainMultiplier(9), 2);
  assert.equal(logic.getChainMultiplier(10), 3);
  assert.equal(logic.getChainMultiplier(15), 4);
  assert.equal(logic.getChainMultiplier(20), 5);
  assert.equal(logic.getChainMultiplier(85), 5);
});

test('Sort evaluation: normal, perfect, wildcard x2, freeze grant, chain milestone, and wrong reset', () => {
  const normal = logic.evaluateSort('circle', 'circle', 0.5, 0);
  assert.equal(normal.isCorrect, true);
  assert.equal(normal.isPerfect, false);
  assert.equal(normal.nextChain, 1);
  assert.equal(normal.multiplier, 1);
  assert.equal(normal.chainBonus, 0);
  assert.equal(normal.pointsAwarded, 10);
  assert.equal(normal.grantedSlowMo, false);
  assert.equal(normal.grantedFreeze, false);

  // Chain 4 -> 5 triggers x2 multiplier; yProgress 0.85 triggers x2 perfect -> 10 * 2 * 2 = 40
  const perfect = logic.evaluateSort('square', 'square', 0.85, 4);
  assert.equal(perfect.isCorrect, true);
  assert.equal(perfect.isPerfect, true);
  assert.equal(perfect.multiplier, 2);
  assert.equal(perfect.pointsAwarded, 40);

  // Wildcard on chain 9 -> 10: x3 multiplier, x2 perfect, x2 wildcard + 50 bonus = 170 + Slow-Mo
  const wildcard = logic.evaluateSort('wildcard', 'triangle', 0.9, 9);
  assert.equal(wildcard.isCorrect, true);
  assert.equal(wildcard.isWildcard, true);
  assert.equal(wildcard.isPerfect, true);
  assert.equal(wildcard.nextChain, 10);
  assert.equal(wildcard.multiplier, 3);
  assert.equal(wildcard.chainBonus, 50);
  assert.equal(wildcard.pointsAwarded, 170);
  assert.equal(wildcard.grantedSlowMo, true);
  assert.equal(wildcard.grantedFreeze, false);

  // Freeze crystal works in any bin and grants Freeze power-up
  const freeze = logic.evaluateSort('freeze', 'circle', 0.4, 19);
  assert.equal(freeze.isCorrect, true);
  assert.equal(freeze.grantedFreeze, true);
  assert.equal(freeze.nextChain, 20);
  assert.equal(freeze.multiplier, 5);
  assert.equal(freeze.chainBonus, 50);
  assert.equal(freeze.grantedSlowMo, true);
  assert.equal(freeze.pointsAwarded, 10 * 5 + 50);

  // Wrong bin resets chain and awards zero
  const wrong = logic.evaluateSort('circle', 'diamond', 0.9, 14);
  assert.equal(wrong.isCorrect, false);
  assert.equal(wrong.nextChain, 0);
  assert.equal(wrong.multiplier, 1);
  assert.equal(wrong.chainBonus, 0);
  assert.equal(wrong.pointsAwarded, 0);
  assert.equal(wrong.grantedSlowMo, false);
});

test('Difficulty ramp, ceiling safety, wave rules (spike -> breather), and guided opening', () => {
  assert.equal(logic.getTravelTimeSec(0, true), BELT_SORT_CONFIG.GAMEPLAY.guidedTravelTimeSec);
  assert.equal(logic.getTravelTimeSec(0), 5.0);
  assert.ok(Math.abs(logic.getTravelTimeSec(45) - 3.4) < 1e-9);
  assert.equal(logic.getTravelTimeSec(90), 1.8);
  assert.equal(logic.getTravelTimeSec(240), 1.8);

  assert.equal(logic.getSpawnGapSec(0), 1.0);
  assert.equal(logic.getSpawnGapSec(90), 0.35);
  assert.equal(logic.getSpawnGapSec(300), 0.35);

  // First 3 spawns follow circle, square, triangle regardless of rng
  assert.equal(logic.pickNextItemKind(() => 0.99, 4, true, 0), 'circle');
  assert.equal(logic.pickNextItemKind(() => 0.99, 4, true, 1), 'square');
  assert.equal(logic.pickNextItemKind(() => 0.99, 4, true, 2), 'triangle');

  // Spike must ALWAYS be followed by breather across any random value
  for (const r of [0, 0.1, 0.5, 0.99]) {
    const nextAfterSpike = logic.pickNextWavePattern(() => r, 'spike');
    assert.equal(nextAfterSpike.type, 'breather');

    const nextAfterBreather = logic.pickNextWavePattern(() => r, 'breather');
    assert.notEqual(nextAfterBreather.type, 'breather');
  }

  // Wave spawn intervals respect configured floor and ceilings
  const stream = BELT_SORT_CONFIG.WAVE_PATTERNS.find((w) => w.type === 'stream');
  const spike = BELT_SORT_CONFIG.WAVE_PATTERNS.find((w) => w.type === 'spike');
  const breather = BELT_SORT_CONFIG.WAVE_PATTERNS.find((w) => w.type === 'breather');
  assert.equal(logic.getWaveSpawnIntervalSec(stream, 0), 1.0);
  assert.equal(logic.getWaveSpawnIntervalSec(stream, 120), 0.35);
  assert.equal(logic.getWaveSpawnIntervalSec(spike, 120), 0.4);
  assert.equal(logic.getWaveSpawnIntervalSec(breather, 120), 1.2);
});

test('Conveyor item spawn headway and non-overtaking FIFO invariants', () => {
  assert.equal(logic.canSpawnNextItem([]), true);
  assert.equal(logic.canSpawnNextItem([{ yProgress: 0.05 }]), false);
  assert.equal(
    logic.canSpawnNextItem([{ yProgress: BELT_SORT_CONFIG.DIFFICULTY.minSpawnProgressGap }]),
    true
  );

  // Item #4 (standard 5.0s speed) trailing close behind guided item #3 (5.4s speed) must never overtake #3
  const items = [
    { id: 3, yProgress: 0.4 },
    { id: 4, yProgress: 0.39 },
  ];
  logic.advanceBeltItemsInOrder(items, 0.25, 0);
  assert.equal(items[0].id, 3);
  assert.equal(items[1].id, 4);
  assert.ok(
    items[0].yProgress - items[1].yProgress >= BELT_SORT_CONFIG.DIFFICULTY.minItemProgressGap - 1e-9,
    'Trailing item must keep minimum spacing behind front item'
  );
});

test('Accuracy, rewards cap, formatting, daily share emoji grid, and streak continuity', () => {
  assert.equal(logic.calculateAccuracyPercent(0, 0, 0), 100);
  assert.equal(logic.calculateAccuracyPercent(9, 1, 0), 90);
  assert.equal(logic.calculateAccuracyPercent(8, 1, 1), 80);

  assert.equal(logic.computeDiamondsEarned(24, false), 0);
  assert.equal(logic.computeDiamondsEarned(25, false), 1);
  assert.equal(logic.computeDiamondsEarned(25, true), 6);
  assert.equal(logic.computeDiamondsEarned(2000, true), 50);

  assert.equal(logic.formatTimeMMSS(60), '01:00');
  assert.equal(logic.formatTimeMMSS(41.2), '00:42');
  assert.equal(logic.formatTimeMMSS(0), '00:00');
  assert.equal(logic.formatTimeMMSS(-2), '00:00');

  assert.equal(logic.getNextChainTarget(0), 10);
  assert.equal(logic.getNextChainTarget(9), 10);
  assert.equal(logic.getNextChainTarget(10), 20);

  // 12 outcomes -> row of 10 then row of 2
  const outcomes = [
    'correct', 'correct', 'wrong', 'correct', 'miss',
    'correct', 'correct', 'correct', 'wrong', 'correct',
    'correct', 'miss',
  ];
  const grid = logic.formatDailyEmojiGrid(outcomes);
  const rows = grid.split('\n');
  assert.equal(rows.length, 2);
  assert.equal(rows[0], '🟩🟩🟥🟩⬛🟩🟩🟩🟥🟩');
  assert.equal(rows[1], '🟩⬛');

  const shareText = logic.buildDailyShareText({
    dateStr: '2026-11-25',
    score: 1240,
    bestChain: 14,
    accuracyPercent: 92,
    outcomes,
    streak: 3,
  });
  assert.ok(shareText.includes('Conveyor Sort Rush — Daily 2026-11-25'));
  assert.ok(shareText.includes('Best Chain: x14 | Acc: 92%'));
  assert.ok(shareText.includes('Streak: 3 days'));
  assert.ok(shareText.includes('https://tappyard.com/games/belt-sort'));

  // Daily streak transitions
  assert.deepEqual(
    logic.updateDailyStreakValue('2026-11-25', null, 0),
    { streak: 1, lastDate: '2026-11-25' }
  );
  assert.deepEqual(
    logic.updateDailyStreakValue('2026-11-25', '2026-11-25', 4),
    { streak: 4, lastDate: '2026-11-25' }
  );
  assert.deepEqual(
    logic.updateDailyStreakValue('2026-11-25', '2026-11-24', 4),
    { streak: 5, lastDate: '2026-11-25' }
  );
  // Month rollover check
  assert.deepEqual(
    logic.updateDailyStreakValue('2026-12-01', '2026-11-30', 5),
    { streak: 6, lastDate: '2026-12-01' }
  );
  // Skipped day resets streak to 1
  assert.deepEqual(
    logic.updateDailyStreakValue('2026-11-25', '2026-11-23', 8),
    { streak: 1, lastDate: '2026-11-25' }
  );
});

test('Storage helpers degrade gracefully when localStorage is unavailable or throws', () => {
  assert.equal(logic.safeStorageGet('any-key'), null);
  assert.doesNotThrow(() => logic.safeStorageSet('any-key', '123'));
});
