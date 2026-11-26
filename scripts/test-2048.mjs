import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

function load2048Logic() {
  const fullPath = path.resolve(process.cwd(), 'game', '2048', 'logic.ts');
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
  const wrapped = `(function(exports, require, module) {\n${transpiled.outputText}\n})`;
  const fn = vm.runInThisContext(wrapped, { filename: fullPath });
  fn(moduleObj.exports, require, moduleObj);
  return moduleObj.exports;
}

const logic = load2048Logic();

function rowValues(tiles, row) {
  const vals = [null, null, null, null];
  for (const t of tiles) {
    if (t.row === row) vals[t.col] = t.value;
  }
  return vals;
}

function colValues(tiles, col) {
  const vals = [null, null, null, null];
  for (const t of tiles) {
    if (t.col === col) vals[t.row] = t.value;
  }
  return vals;
}

function withoutNewlySpawned(beforeTiles, afterTiles) {
  // Spawned tile is the one with isNew === true
  return afterTiles.filter((t) => !t.isNew);
}

test('executeMove collapses and merges correctly in all 4 directions including reverse moves', () => {
  // Left-aligned [2, 4] moving RIGHT must move to cols 2 and 3 (regression test for old isReverse bug!)
  const resRight = logic.executeMove(
    'right',
    [
      { id: 1, value: 2, row: 0, col: 0 },
      { id: 2, value: 4, row: 0, col: 1 },
    ],
    0
  );
  assert.equal(resRight.moved, true);
  assert.deepEqual(rowValues(withoutNewlySpawned(null, resRight.tiles), 0), [null, null, 2, 4]);

  // Triple identical tiles [2, 2, 2, null] moving RIGHT must merge the rightmost pair -> [null, null, 2, 4]
  const resRightTriple = logic.executeMove(
    'right',
    [
      { id: 3, value: 2, row: 1, col: 0 },
      { id: 4, value: 2, row: 1, col: 1 },
      { id: 5, value: 2, row: 1, col: 2 },
    ],
    10
  );
  assert.equal(resRightTriple.moved, true);
  assert.equal(resRightTriple.score, 14);
  assert.deepEqual(rowValues(withoutNewlySpawned(null, resRightTriple.tiles), 1), [null, null, 2, 4]);

  // Quad identical tiles [2, 2, 2, 2] moving DOWN must produce [null, null, 4, 4]
  const resDownQuad = logic.executeMove(
    'down',
    [
      { id: 6, value: 2, row: 0, col: 2 },
      { id: 7, value: 2, row: 1, col: 2 },
      { id: 8, value: 2, row: 2, col: 2 },
      { id: 9, value: 2, row: 3, col: 2 },
    ],
    0
  );
  assert.equal(resDownQuad.moved, true);
  assert.equal(resDownQuad.score, 8);
  assert.deepEqual(colValues(withoutNewlySpawned(null, resDownQuad.tiles), 2), [null, null, 4, 4]);

  // Merging up: [4, null, 4, null] -> [8, null, null, null]
  const resUp = logic.executeMove(
    'up',
    [
      { id: 10, value: 4, row: 0, col: 3 },
      { id: 11, value: 4, row: 2, col: 3 },
    ],
    20
  );
  assert.equal(resUp.moved, true);
  assert.equal(resUp.score, 28);
  assert.deepEqual(colValues(withoutNewlySpawned(null, resUp.tiles), 3), [8, null, null, null]);
});

test('200-move simulation never produces duplicate coordinates, duplicate IDs, or premature lockups', () => {
  let tiles = logic.createNewBoard();
  let score = 0;
  const dirs = ['up', 'right', 'down', 'left'];

  for (let step = 0; step < 200; step++) {
    if (!logic.canMakeMove(tiles)) break;

    let movedAny = false;
    for (let d = 0; d < 4; d++) {
      const dir = dirs[(step + d) % 4];
      const res = logic.executeMove(dir, tiles, score);
      if (res.moved) {
        tiles = res.tiles;
        score = res.score;
        movedAny = true;
        break;
      }
    }

    assert.equal(movedAny, true, 'canMakeMove=true must always allow at least one valid move');

    const coords = new Set();
    const ids = new Set();
    for (const t of tiles) {
      assert.ok(t.row >= 0 && t.row <= 3);
      assert.ok(t.col >= 0 && t.col <= 3);
      const key = `${t.row},${t.col}`;
      assert.equal(coords.has(key), false, `Duplicate coordinate ${key}`);
      assert.equal(ids.has(t.id), false, `Duplicate tile id ${t.id}`);
      coords.add(key);
      ids.add(t.id);
    }
  }
});
