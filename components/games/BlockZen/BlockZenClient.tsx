'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Gem,
  Sparkles,
  RefreshCw,
  Share2,
  Maximize2,
  Minimize2,
  Boxes,
} from 'lucide-react';
import {
  BlockShape,
  GRID_SIZE,
  dealThreeShapes,
  canPlaceShape,
  canAnyShapeFit,
  findCompletedLines,
} from '@/game/blockzen/shapes';
import { blockZenAudio } from '@/game/blockzen/audio';
import { triggerHaptic } from '@/lib/haptics';
import {
  addWalletDiamonds,
  spendWalletDiamonds,
  subscribeWallet,
} from '@/lib/wallet';
import { shareScoreChallenge } from '@/lib/challenge';
import ChallengerBanner from '@/components/tappyard/ChallengerBanner';

const REROLL_COST = 5;

export default function BlockZenClient() {
  // Grid: 10x10 matrix of color classes or null
  const [grid, setGrid] = useState<(string | null)[][]>(() =>
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
  );

  // 3 Available shapes in the tray
  const [availableShapes, setAvailableShapes] = useState<(BlockShape | null)[]>([]);

  // Scoring
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [hasFreeReroll, setHasFreeReroll] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Dragging State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverCoord, setHoverCoord] = useState<{ row: number; col: number; valid: boolean } | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);

  // Initialize
  useEffect(() => {
    const saved = localStorage.getItem('tappyard-blockzen-best');
    if (saved) {
      setBestScore(parseInt(saved, 10) || 0);
    }
    setIsMuted(blockZenAudio.getMuted());
    const unsub = subscribeWallet((d) => setDiamonds(d));

    // Deal first round of 3 shapes
    setAvailableShapes(dealThreeShapes());

    return () => unsub();
  }, []);

  const showNotification = useCallback((msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 1800);
  }, []);

  // Update Score & Best
  const addScore = useCallback((points: number) => {
    setScore((prev) => {
      const updated = prev + points;
      setBestScore((bPrev) => {
        if (updated > bPrev) {
          localStorage.setItem('tappyard-blockzen-best', String(updated));
          return updated;
        }
        return bPrev;
      });
      return updated;
    });
  }, []);

  // Reset / Restart
  const handleRestart = useCallback(() => {
    setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
    setAvailableShapes(dealThreeShapes());
    setScore(0);
    setStreak(0);
    setHasFreeReroll(true);
    setIsGameOver(false);
    setDraggedIndex(null);
    setDragPos(null);
    setHoverCoord(null);
    blockZenAudio.place();
  }, []);

  // Reroll current tray (1 Free per match, then diamonds)
  const handleReroll = useCallback(() => {
    if (hasFreeReroll) {
      setHasFreeReroll(false);
      blockZenAudio.powerup();
      setAvailableShapes(dealThreeShapes(grid));
      setIsGameOver(false);
      showNotification('FREE Reroll Used! Shapes Reshuffled!');
      return;
    }

    if (diamonds < REROLL_COST) {
      showNotification(`Need ${REROLL_COST} 💎 Diamonds to Reroll!`);
      return;
    }

    const success = spendWalletDiamonds(REROLL_COST);
    if (!success) return;

    blockZenAudio.powerup();
    setAvailableShapes(dealThreeShapes(grid));
    setIsGameOver(false);
    showNotification(`-${REROLL_COST} 💎 Shapes Reshuffled!`);
  }, [hasFreeReroll, diamonds, grid, showNotification]);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const next = blockZenAudio.toggleMute();
    setIsMuted(next);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Share score challenge
  const handleShare = useCallback(() => {
    shareScoreChallenge({
      gameTitle: 'Block Grid Zen',
      gameSlug: 'color-zen',
      score,
      metric: 'pts',
    });
  }, [score]);

  // Calculate grid row/col from pointer position
  const calculateGridCoord = useCallback((clientX: number, clientY: number, shape: BlockShape) => {
    const gridEl = gridRef.current;
    if (!gridEl) return null;

    const rect = gridEl.getBoundingClientRect();
    const cellSize = rect.width / GRID_SIZE;

    // Check if pointer is anywhere near the grid
    if (
      clientX < rect.left - cellSize ||
      clientX > rect.right + cellSize ||
      clientY < rect.top - cellSize ||
      clientY > rect.bottom + cellSize
    ) {
      return null;
    }

    // Center the shape on pointer (with slight upward vertical offset so thumb doesn't hide placement)
    const shapeRows = shape.matrix.length;
    const shapeCols = shape.matrix[0].length;

    const targetCol = Math.round((clientX - rect.left) / cellSize - shapeCols / 2);
    const targetRow = Math.round((clientY - rect.top) / cellSize - shapeRows / 2);

    return { row: targetRow, col: targetCol };
  }, []);

  // Place shape on board
  const placeShape = useCallback(
    (shapeIndex: number, row: number, col: number) => {
      const shape = availableShapes[shapeIndex];
      if (!shape) return;

      if (!canPlaceShape(grid, shape.matrix, row, col)) {
        return;
      }

      // 1. Copy grid and place solid blocks
      const newGrid = grid.map((r) => [...r]);
      let blockCount = 0;

      for (let r = 0; r < shape.matrix.length; r++) {
        for (let c = 0; c < shape.matrix[0].length; c++) {
          if (shape.matrix[r][c] === 1) {
            newGrid[row + r][col + c] = shape.color;
            blockCount++;
          }
        }
      }

      // Add points for placing the shape
      addScore(blockCount * 10);
      blockZenAudio.place();
      triggerHaptic('light');

      // 2. Check for completed lines (horizontal & vertical)
      const { rows, cols } = findCompletedLines(newGrid);
      const totalLines = rows.length + cols.length;

      if (totalLines > 0) {
        // Clear rows
        rows.forEach((r) => {
          for (let c = 0; c < GRID_SIZE; c++) {
            newGrid[r][c] = null;
          }
        });

        // Clear columns
        cols.forEach((c) => {
          for (let r = 0; r < GRID_SIZE; r++) {
            newGrid[r][c] = null;
          }
        });

        // Score bonus & Audio Chime
        const linePoints = totalLines * 120 + (totalLines > 1 ? totalLines * 80 : 0);
        addScore(linePoints);
        setStreak((prev) => prev + 1);
        blockZenAudio.clear(totalLines);
        triggerHaptic(totalLines >= 2 ? 'success' : 'medium');

        // Milestone Diamond Rewards
        if (totalLines >= 3) {
          addWalletDiamonds(3);
          showNotification(`TRIPLE COMBO! +3 💎`);
        } else if (totalLines === 2) {
          addWalletDiamonds(1);
          showNotification(`DOUBLE CLEAR! +1 💎`);
        }
      } else {
        setStreak(0);
      }

      // 3. Remove shape from tray
      const nextShapes = [...availableShapes];
      nextShapes[shapeIndex] = null;

      // If all 3 shapes used, deal 3 fresh shapes!
      const remaining = nextShapes.filter((s) => s !== null);
      let finalShapes = nextShapes;
      if (remaining.length === 0) {
        finalShapes = dealThreeShapes(newGrid);
      }

      setGrid(newGrid);
      setAvailableShapes(finalShapes);

      // 4. Verify if any moves remain
      if (!canAnyShapeFit(newGrid, finalShapes)) {
        setIsGameOver(true);
        blockZenAudio.gameOver();
      }
    },
    [availableShapes, grid, addScore, showNotification]
  );

  // Drag & Drop Pointer Events
  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    e.preventDefault();
    const shape = availableShapes[index];
    if (!shape || isGameOver) return;

    blockZenAudio.pickup();
    setDraggedIndex(index);

    // Apply 55px upward thumb offset on touch so player clearly sees where shape snaps
    const isTouch = e.pointerType === 'touch';
    const offsetY = isTouch ? -65 : 0;

    setDragPos({ x: e.clientX, y: e.clientY + offsetY });
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (draggedIndex === null) return;
      const shape = availableShapes[draggedIndex];
      if (!shape) return;

      const isTouch = e.pointerType === 'touch';
      const offsetY = isTouch ? -65 : 0;
      const posX = e.clientX;
      const posY = e.clientY + offsetY;

      setDragPos({ x: posX, y: posY });

      const coord = calculateGridCoord(posX, posY, shape);
      if (coord) {
        const valid = canPlaceShape(grid, shape.matrix, coord.row, coord.col);
        setHoverCoord({ row: coord.row, col: coord.col, valid });
      } else {
        setHoverCoord(null);
      }
    },
    [draggedIndex, availableShapes, calculateGridCoord, grid]
  );

  const handlePointerUp = useCallback(() => {
    if (draggedIndex !== null && hoverCoord && hoverCoord.valid) {
      placeShape(draggedIndex, hoverCoord.row, hoverCoord.col);
    }
    setDraggedIndex(null);
    setDragPos(null);
    setHoverCoord(null);
  }, [draggedIndex, hoverCoord, placeShape]);

  useEffect(() => {
    if (draggedIndex !== null) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [draggedIndex, handlePointerMove, handlePointerUp]);

  return (
    <section className="w-full flex flex-col bg-[#040e14] text-white select-none">
      {/* 1. Top Navigation Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#081720]/95 backdrop-blur-md border-b border-teal-500/20 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="typo-nav flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TAPPYARD</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="typo-game-title text-base sm:text-lg text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#14b8a6]" />
              Block Grid Zen
            </h1>
            <span className="typo-label hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Boxes className="w-3 h-3" />
              Relaxing
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Diamonds Wallet */}
          <div className="typo-button flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1e27] border border-cyan-500/30 text-cyan-300 text-xs tabular-nums shadow-inner">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{diamonds}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0e2531] hover:bg-[#153545] border border-cyan-500/20 flex items-center justify-center text-slate-300 transition-all active:scale-90 cursor-pointer"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[#0e2531] hover:bg-[#153545] border border-cyan-500/20 items-center justify-center text-slate-300 transition-all active:scale-90 cursor-pointer"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {notice && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-teal-950 text-xs font-black shadow-lg shadow-teal-500/30 animate-bounce-in border border-teal-300">
          {notice}
        </div>
      )}

      {/* 2. Main Game Body */}
      <main id="game-stage" className="relative w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-between p-2 sm:p-4 max-w-sm sm:max-w-md mx-auto">
        <ChallengerBanner gameSlug="color-zen" currentScore={score} />

        {/* Score & Reroll Toolbar */}
        <div className="w-full flex items-center justify-between gap-2 my-1 shrink-0">
          {/* Score & Best */}
          <div className="flex items-center gap-2">
            <div className="bg-[#081a24] border border-teal-500/30 px-3 py-1.5 rounded-xl shadow-inner text-center">
              <span className="text-[9px] font-black uppercase text-teal-400 block tracking-wider">Score</span>
              <span className="text-lg sm:text-xl font-black text-white">{score}</span>
            </div>

            <div className="bg-[#081a24] border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-inner text-center">
              <span className="text-[9px] font-black uppercase text-amber-400 flex items-center gap-0.5 tracking-wider">
                <Trophy className="w-2.5 h-2.5" /> Best
              </span>
              <span className="text-lg sm:text-xl font-black text-white">{bestScore}</span>
            </div>
          </div>

          {/* Action Powerups */}
          <div className="flex items-center gap-1.5">
            {/* Reroll Shapes (1 Free per match, then 5 Diamonds) */}
            <button
              onClick={handleReroll}
              disabled={!hasFreeReroll && diamonds < REROLL_COST}
              className={`h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                hasFreeReroll
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border-emerald-400/50 text-emerald-300 active:scale-95 shadow-md shadow-emerald-950/40 animate-pulse'
                  : diamonds >= REROLL_COST
                  ? 'bg-teal-950/60 hover:bg-teal-900 border-teal-500/40 text-teal-200 active:scale-95 shadow-md shadow-teal-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
              aria-label={hasFreeReroll ? 'Free Reroll Shapes' : `Reroll Shapes (${REROLL_COST} Diamonds)`}
            >
              <RefreshCw className="w-3 h-3 text-teal-400" />
              <span>Reroll</span>
              <span className="text-[10px] text-teal-300">
                {hasFreeReroll ? '(FREE)' : `(${REROLL_COST} 💎)`}
              </span>
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="w-9 h-9 rounded-xl bg-[#0c2230] hover:bg-[#123145] border border-teal-500/30 flex items-center justify-center text-slate-300 active:scale-90 transition-all cursor-pointer shadow-md"
              aria-label="Restart Board"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
            </button>
          </div>
        </div>

        {/* 3. The 10x10 Matrix Grid Board */}
        <div
          ref={gridRef}
          className="relative w-full aspect-square bg-[#05151f] rounded-2xl p-1.5 sm:p-2 border-2 border-teal-500/40 shadow-2xl shadow-teal-950/60 grid grid-cols-10 grid-rows-10 gap-1 sm:gap-1.5 touch-none"
        >
          {grid.map((rowArr, rIdx) =>
            rowArr.map((cellColor, cIdx) => {
              // Check if cell is in the active hover preview
              const isHovered =
                hoverCoord &&
                draggedIndex !== null &&
                availableShapes[draggedIndex] &&
                rIdx >= hoverCoord.row &&
                rIdx < hoverCoord.row + availableShapes[draggedIndex]!.matrix.length &&
                cIdx >= hoverCoord.col &&
                cIdx < hoverCoord.col + availableShapes[draggedIndex]!.matrix[0].length &&
                availableShapes[draggedIndex]!.matrix[rIdx - hoverCoord.row][cIdx - hoverCoord.col] === 1;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-full h-full rounded-md sm:rounded-lg transition-all duration-100 flex items-center justify-center ${
                    cellColor
                      ? `bg-gradient-to-br ${cellColor} shadow-md`
                      : isHovered
                      ? hoverCoord.valid
                        ? 'bg-teal-400/50 border border-teal-300 animate-pulse'
                        : 'bg-rose-500/40 border border-rose-400'
                      : 'bg-[#081f2c]/50 border border-teal-500/10'
                  }`}
                />
              );
            })
          )}
        </div>

        {/* 4. Tray of 3 Available Shapes */}
        <div className="w-full flex items-center justify-around gap-2 p-2 sm:p-3 bg-[#071924]/80 rounded-2xl border border-teal-500/20 shrink-0 mt-2 min-h-[92px]">
          {availableShapes.map((shape, idx) => {
            if (!shape) {
              return (
                <div key={idx} className="flex-1 h-16 flex items-center justify-center opacity-20">
                  <div className="w-10 h-10 rounded-xl border border-dashed border-teal-400" />
                </div>
              );
            }

            const canFit = canAnyShapeFit(grid, [shape]);

            return (
              <div
                key={shape.id}
                onPointerDown={(e) => handlePointerDown(idx, e)}
                className={`flex-1 h-18 p-1 rounded-xl flex items-center justify-center transition-all cursor-grab active:cursor-grabbing ${
                  canFit
                    ? 'hover:bg-teal-950/40 active:scale-95'
                    : 'opacity-40 grayscale cursor-not-allowed'
                }`}
              >
                {/* Render Shape Thumbnail */}
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${shape.matrix[0].length}, minmax(0, 1fr))`,
                  }}
                >
                  {shape.matrix.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm ${
                          val === 1
                            ? `bg-gradient-to-br ${shape.color} ${shape.glow} border ${shape.border}`
                            : 'opacity-0'
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Floating Dragged Piece (renders at cursor/touch point) */}
        {draggedIndex !== null && dragPos && availableShapes[draggedIndex] && (
          <div
            className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
            style={{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }}
          >
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${availableShapes[draggedIndex]!.matrix[0].length}, minmax(0, 1fr))`,
              }}
            >
              {availableShapes[draggedIndex]!.matrix.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${
                      val === 1
                        ? `bg-gradient-to-br ${availableShapes[draggedIndex]!.color} ${
                            availableShapes[draggedIndex]!.glow
                          } border-2 ${availableShapes[draggedIndex]!.border}`
                        : 'opacity-0'
                    }`}
                  />
                ))
              )}
            </div>
          </div>
        )}
        {/* Start / Instructions note */}
        <p className="text-[11px] font-medium text-slate-400 text-center mt-1">
          Drag shapes onto the 10x10 grid. Fill a full row or column to clear it.
        </p>

        {/* Mobile: unobtrusive link to scroll to below-fold content */}
        <a
          href="#game-details"
          className="md:hidden mt-1.5 flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-[10px] text-teal-300 border border-teal-500/30 backdrop-blur-md shadow-md active:scale-95 transition-all"
        >
          <span>How to play & tips</span>
          <span>↓</span>
        </a>
      </main>

      {/* 6. Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-gradient-to-b from-[#0a222e] to-[#05141c] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-teal-500/40 shadow-2xl flex flex-col items-center text-center gap-4 animate-slide-up">
            <span className="text-[11px] font-black tracking-widest text-teal-400 uppercase">Board Full</span>

            <div>
              <div className="text-5xl font-black text-white drop-shadow-md">{score}</div>
              <span className="text-xs text-teal-300 font-bold block mt-1 uppercase tracking-wider">Final Zen Score</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-[#041219] px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>BEST SCORE: {bestScore}</span>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-2">
              {/* Reshuffle Shapes Powerup (Free or with Diamonds) */}
              {(hasFreeReroll || diamonds >= REROLL_COST) && (
                <button
                  onClick={handleReroll}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-teal-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 border border-teal-200"
                >
                  <RefreshCw className="w-4 h-4 text-teal-950" />
                  <span>
                    {hasFreeReroll ? 'FREE RESHUFFLE' : `RESHUFFLE PIECES (${REROLL_COST} 💎)`}
                  </span>
                </button>
              )}

              {/* Try Again */}
              <button
                onClick={handleRestart}
                className="w-full h-11 rounded-2xl bg-[#0f2e3d] hover:bg-[#164157] text-white font-bold text-xs border border-teal-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-teal-400" />
                <span>NEW ZEN RUN</span>
              </button>

              {/* Challenge a Friend */}
              <button
                onClick={handleShare}
                className="w-full h-10 rounded-2xl bg-[#061822] hover:bg-[#0a2331] text-slate-300 font-bold text-xs border border-slate-700/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-teal-300" />
                <span>Challenge a Friend</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
