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
  Undo2,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  X,
  Share2,
} from 'lucide-react';
import {
  BoardTile,
  Direction,
  createNewBoard,
  executeMove,
  canMakeMove,
} from '@/game/2048/logic';
import { neon2048Audio } from '@/game/2048/audio';
import { triggerHaptic } from '@/lib/haptics';
import {
  getWalletDiamonds,
  addWalletDiamonds,
  spendWalletDiamonds,
  subscribeWallet,
} from '@/lib/wallet';
import { shareScoreChallenge } from '@/lib/challenge';
import ChallengerBanner from '@/components/tappyard/ChallengerBanner';
import CupcakeIllustration from './CupcakeIllustration';
import { CUPCAKE_TIERS, getCupcakeTier } from './CupcakeData';

const UNDO_COST = 5;

interface HistoryState {
  tiles: BoardTile[];
  score: number;
}

export default function Cupcake2048Client() {
  const [tiles, setTiles] = useState<BoardTile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [floatingNotification, setFloatingNotification] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cookbookOpen, setCookbookOpen] = useState(false);

  // Touch tracking refs
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Initialize game on mount
  useEffect(() => {
    // Load best score
    const savedBest = localStorage.getItem('tappyard-cupcake-2048-best');
    if (savedBest) {
      setBestScore(parseInt(savedBest, 10) || 0);
    }

    // Set audio mute
    setIsMuted(neon2048Audio.getMuted());

    // Subscribe to unified diamond wallet
    const unsub = subscribeWallet((d) => setDiamonds(d));

    // Create fresh board
    const initialTiles = createNewBoard();
    setTiles(initialTiles);

    return () => unsub();
  }, []);

  // Update best score
  const updateScoreAndBest = useCallback((newScore: number) => {
    setScore(newScore);
    setBestScore((prev) => {
      if (newScore > prev) {
        localStorage.setItem('tappyard-cupcake-2048-best', String(newScore));
        return newScore;
      }
      return prev;
    });
  }, []);

  const triggerNotification = useCallback((msg: string) => {
    setFloatingNotification(msg);
    setTimeout(() => setFloatingNotification(null), 1800);
  }, []);

  // Handle Board Move
  const handleMove = useCallback(
    (direction: Direction) => {
      if (isGameOver || (hasWon && !keepPlaying)) return;

      const result = executeMove(direction, tiles, score);
      if (!result.moved) return;

      // Haptic and audio feedback
      triggerHaptic('light');
      neon2048Audio.slide();

      // Save previous state to history stack for Undo
      setHistory((prev) => [
        { tiles: tiles.map((t) => ({ ...t })), score },
        ...prev.slice(0, 9),
      ]);

      // Apply move result
      setTiles(result.tiles);
      updateScoreAndBest(result.score);
      setMoves((m) => m + 1);

      // Merge celebration & audio chime
      if (result.mergeCount > 0) {
        neon2048Audio.merge(result.highestMerged);
        if (result.highestMerged >= 64) {
          triggerHaptic('medium');
        }
      }

      // Diamond rewards
      if (result.diamondReward > 0) {
        addWalletDiamonds(result.diamondReward);
        triggerNotification(`+${result.diamondReward} Diamonds! 💎`);
        neon2048Audio.merge(128);
      }

      // Check win condition (2048 Diamond Crown Cupcake)
      const hit2048 = result.tiles.some((t) => t.value === 2048);
      if (hit2048 && !hasWon && !keepPlaying) {
        setHasWon(true);
        neon2048Audio.win();
        triggerHaptic('success');
      }

      // Check game over
      if (!canMakeMove(result.tiles)) {
        setIsGameOver(true);
        neon2048Audio.gameOver();
        triggerHaptic('warning');
      }
    },
    [isGameOver, hasWon, keepPlaying, tiles, score, updateScoreAndBest, triggerNotification]
  );

  // Undo Move
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    if (diamonds < UNDO_COST) {
      triggerNotification(`Need ${UNDO_COST} Diamonds to Undo!`);
      return;
    }

    const spent = spendWalletDiamonds(UNDO_COST);
    if (!spent) return;

    const [lastState, ...remainingHistory] = history;
    setTiles(lastState.tiles);
    setScore(lastState.score);
    setHistory(remainingHistory);
    setIsGameOver(false);
    triggerNotification(`Move Undone! (-${UNDO_COST} 💎)`);
    neon2048Audio.undo();
    triggerHaptic('light');
  }, [history, diamonds, triggerNotification]);

  // Restart / New Game
  const handleRestart = useCallback(() => {
    const initialTiles = createNewBoard();
    setTiles(initialTiles);
    setScore(0);
    setMoves(0);
    setHistory([]);
    setIsGameOver(false);
    setHasWon(false);
    setKeepPlaying(false);
    neon2048Audio.slide();
  }, []);

  // Sound toggle
  const handleToggleMute = useCallback(() => {
    const newMuted = neon2048Audio.toggleMute();
    setIsMuted(newMuted);
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
      gameTitle: 'Cupcake 2048',
      gameSlug: 'cupcake-2048',
      score,
      metric: 'pts',
    });
  }, [score]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove('right');
          break;
        case 'z':
        case 'Z':
        case 'u':
        case 'U':
          handleUndo();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleUndo]);

  // Mobile swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 20) return;

    if (absDx > absDy) {
      handleMove(dx > 0 ? 'right' : 'left');
    } else {
      handleMove(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <section className="w-full flex flex-col bg-[#140b18] text-white select-none relative">
      {/* 1. Header Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#1a0e20]/95 backdrop-blur-md border-b border-pink-500/20 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="typo-nav flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 text-pink-300 text-xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TAPPYARD</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl" role="img" aria-label="cupcake">🧁</span>
            <h1 className="typo-game-title text-base sm:text-lg text-white font-extrabold flex items-center gap-2">
              Cupcake 2048
            </h1>
            <span className="typo-label hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold">
              <Sparkles className="w-3 h-3 text-pink-400" />
              Dessert Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cookbook / Cupcake Evolution Guide Button */}
          <button
            onClick={() => setCookbookOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-pink-900/40 hover:bg-pink-900/70 border border-pink-500/30 text-pink-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="View All 11 Cupcakes"
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Cookbook</span>
          </button>

          {/* Diamonds Wallet */}
          <div className="typo-button flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24132c] border border-pink-500/30 text-pink-300 text-xs tabular-nums shadow-inner">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{diamonds}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#24132c] hover:bg-[#341b3f] border border-pink-500/20 flex items-center justify-center text-pink-300 transition-all active:scale-90 cursor-pointer"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[#24132c] hover:bg-[#341b3f] border border-pink-500/20 items-center justify-center text-pink-300 transition-all active:scale-90 cursor-pointer"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {floatingNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white text-xs font-black shadow-lg shadow-pink-500/30 animate-bounce-in border border-pink-300/40">
          {floatingNotification}
        </div>
      )}

      {/* 2. Main Game Body */}
      <main id="game-stage" className="relative w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center p-3 sm:p-6 max-w-md mx-auto">
        <ChallengerBanner gameSlug="cupcake-2048" currentScore={score} />

        {/* Score & Control Row */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-2.5 mb-3">
          {/* Current Score */}
          <div className="bg-[#211129] rounded-2xl p-2 sm:p-2.5 border border-pink-500/30 text-center shadow-lg shadow-pink-950/40 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-pink-400">Score</span>
            <span className="text-lg sm:text-xl font-black text-white">{score}</span>
          </div>

          {/* Moves */}
          <div className="bg-[#211129] rounded-2xl p-2 sm:p-2.5 border border-purple-500/30 text-center shadow-lg shadow-purple-950/40 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-purple-400">Moves</span>
            <span className="text-lg sm:text-xl font-black text-white">{moves}</span>
          </div>

          {/* Best Score */}
          <div className="bg-[#211129] rounded-2xl p-2 sm:p-2.5 border border-amber-500/30 text-center shadow-lg shadow-amber-950/40 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-0.5">
              <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              Best
            </span>
            <span className="text-lg sm:text-xl font-black text-white">{bestScore}</span>
          </div>
        </div>

        {/* Action Controls Toolbar (Undo & Restart) */}
        <div className="w-full flex items-center justify-between gap-2 mb-3">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || diamonds < UNDO_COST}
            className={`flex-1 h-10 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              history.length > 0 && diamonds >= UNDO_COST
                ? 'bg-[#2a1435] hover:bg-[#381a47] border-pink-500/40 text-pink-200 active:scale-95 shadow-md shadow-pink-950/40'
                : 'bg-[#180d20] border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Move</span>
            <span className="text-[10px] font-black text-pink-400 flex items-center gap-0.5">
              (5 <Gem className="w-2.5 h-2.5" />)
            </span>
          </button>

          <button
            onClick={handleRestart}
            className="h-10 px-4 rounded-xl bg-[#2a1435] hover:bg-[#381a47] border border-pink-500/40 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-pink-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            <span>New Game</span>
          </button>
        </div>

        {/* 3. The 4x4 Cupcake Bakery Matrix Board */}
        <div
          ref={boardRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative w-full aspect-square bg-gradient-to-b from-[#1f0f27] to-[#120718] rounded-3xl p-3 sm:p-4 border-2 border-pink-500/40 shadow-2xl shadow-pink-950/60 overflow-hidden"
        >
          {/* Background 4x4 Grid Cells */}
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2 sm:gap-2.5">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-full rounded-2xl bg-[#2d1637]/50 border border-pink-500/10 shadow-inner"
              />
            ))}
          </div>

          {/* Active Sliding Cupcake Tiles */}
          {tiles.map((tile) => {
            const tier = getCupcakeTier(tile.value);
            return (
              <div
                key={tile.id}
                className="absolute p-1 sm:p-1.5 transition-all duration-100 ease-out"
                style={{
                  width: '25%',
                  height: '25%',
                  left: `${tile.col * 25}%`,
                  top: `${tile.row * 25}%`,
                }}
              >
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-br ${tier.bgGradient} border-2 ${tier.borderColor} ${tier.glow} flex flex-col items-center justify-between p-1 sm:p-1.5 drop-shadow-md transition-transform relative overflow-hidden ${
                    tile.isMerged ? 'animate-bounce-in scale-102' : tile.isNew ? 'animate-fade-in' : ''
                  }`}
                >
                  {/* Value badge in top right */}
                  <span
                    className={`absolute top-1 right-1 px-1.5 py-0.2 rounded-md text-[9px] font-black tabular-nums shadow-xs ${tier.badgeBg} ${tier.badgeText}`}
                  >
                    {tile.value}
                  </span>

                  {/* Cupcake SVG Illustration */}
                  <div className="w-full flex-1 flex items-center justify-center pt-1">
                    <CupcakeIllustration value={tile.value} className="w-8 h-8 sm:w-11 sm:h-11 drop-shadow-sm" />
                  </div>

                  {/* Cupcake Name */}
                  <span
                    className={`text-[9px] sm:text-[10px] font-black tracking-tight truncate w-full text-center px-0.5 leading-none pb-0.5 ${tier.textColor}`}
                  >
                    {tier.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Swipe / Controls Helper Note */}
        <p className="text-[11px] font-medium text-pink-300/80 text-center mt-3">
          Swipe or use Arrow Keys to slide cupcakes. Merge two matching cupcakes to bake the next tier!
        </p>

        {/* 4. Game Over Overlay Modal */}
        {isGameOver && (
          <div className="absolute inset-0 bg-[#0e0612]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in rounded-3xl m-3">
            <span className="text-4xl mb-2">🧁</span>
            <h2 className="text-2xl font-black text-white mb-1">Bakery Full!</h2>
            <p className="text-xs text-pink-300 mb-4 max-w-xs">
              No more free spaces on the board. You baked an incredible collection of cupcakes!
            </p>

            <div className="bg-[#24132c] border border-pink-500/30 rounded-2xl p-4 w-full max-w-xs mb-5 flex justify-around">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Final Score</span>
                <p className="text-xl font-black text-white">{score}</p>
              </div>
              <div className="w-px bg-pink-500/20" />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">Best Score</span>
                <p className="text-xl font-black text-amber-300">{bestScore}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              {history.length > 0 && diamonds >= UNDO_COST && (
                <button
                  onClick={handleUndo}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 active:scale-95 transition-all cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>Undo Last Move (5 💎)</span>
                </button>
              )}

              <button
                onClick={handleRestart}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-900/40 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Bake Again</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl bg-[#24132c] hover:bg-[#341b3f] border border-pink-500/40 text-pink-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Challenge a Friend</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. You Won Modal (2048 Diamond Crown Cupcake) */}
        {hasWon && !keepPlaying && (
          <div className="absolute inset-0 bg-[#0e0612]/92 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in rounded-3xl m-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(234,179,8,0.7)] animate-bounce">
              <CupcakeIllustration value={2048} className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mb-1">
              Diamond Cupcake Baked!
            </h2>
            <p className="text-xs text-pink-200 mb-4 max-w-xs">
              Congratulations Master Baker! You successfully reached the legendary 2048 Diamond Crown Cupcake!
            </p>

            <div className="bg-[#24132c] border border-pink-500/30 rounded-2xl p-4 w-full max-w-xs mb-5">
              <span className="text-[10px] uppercase font-bold text-amber-400">Score</span>
              <p className="text-2xl font-black text-white">{score}</p>
            </div>

            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              <button
                onClick={() => setKeepPlaying(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Keep Baking (Endless Mode)</span>
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-2.5 rounded-xl bg-[#24132c] hover:bg-[#341b3f] border border-pink-500/40 text-pink-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
                <span>Start New Game</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Cupcake Cookbook / Evolution Modal */}
        {cookbookOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#1c0f24] border border-pink-500/40 rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => setCookbookOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2a1435] border border-pink-500/30 flex items-center justify-center text-pink-300 hover:text-white cursor-pointer"
                aria-label="Close Cookbook"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-black text-white">Cupcake Recipe Book</h3>
              </div>
              <p className="text-xs text-pink-200/80 mb-4 leading-relaxed">
                Combine two identical cupcakes to unlock the next sweet tier. Can you bake all the way to the 2048 Diamond Crown?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(CUPCAKE_TIERS).map((tier) => (
                  <div
                    key={tier.value}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-r ${tier.bgGradient} border border-white/20 shadow-xs`}
                  >
                    <CupcakeIllustration value={tier.value} className="w-9 h-9 shrink-0 drop-shadow-sm" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${tier.badgeBg} ${tier.badgeText}`}>
                          {tier.value}
                        </span>
                        <span className={`text-xs font-black truncate ${tier.textColor}`}>
                          {tier.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-medium opacity-80 truncate ${tier.textColor}`}>
                        {tier.subtitle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}
