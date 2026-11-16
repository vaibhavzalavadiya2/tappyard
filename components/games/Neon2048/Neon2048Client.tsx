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
  Puzzle,
  Undo2,
  Share2,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  BoardTile,
  Direction,
  createNewBoard,
  executeMove,
  canMakeMove,
  getTileStyle,
} from '@/game/2048/logic';
import { neon2048Audio } from '@/game/2048/audio';
import {
  getWalletDiamonds,
  addWalletDiamonds,
  spendWalletDiamonds,
  subscribeWallet,
} from '@/lib/wallet';

const UNDO_COST = 5;

interface HistoryState {
  tiles: BoardTile[];
  score: number;
}

export default function Neon2048Client() {
  const [tiles, setTiles] = useState<BoardTile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [floatingNotification, setFloatingNotification] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch tracking refs
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Initialize game & wallet on mount
  useEffect(() => {
    // Load best score
    const savedBest = localStorage.getItem('tappyard-2048-best');
    if (savedBest) {
      setBestScore(parseInt(savedBest, 10) || 0);
    }

    // Set initial audio mute state
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
        localStorage.setItem('tappyard-2048-best', String(newScore));
        return newScore;
      }
      return prev;
    });
  }, []);

  // Show temporary pop notification
  const triggerNotification = useCallback((msg: string) => {
    setFloatingNotification(msg);
    setTimeout(() => setFloatingNotification(null), 1800);
  }, []);

  // Perform a move
  const handleMove = useCallback(
    (direction: Direction) => {
      if (isGameOver || (hasWon && !keepPlaying)) return;

      // Deep copy current state for undo
      const prevTiles = tiles.map((t) => ({ ...t }));
      const prevScore = score;

      const result = executeMove(direction, tiles, score);

      if (!result.moved) {
        return; // Nothing moved
      }

      // Play audio
      if (result.mergeCount > 0) {
        neon2048Audio.merge(result.highestMerged);
      } else {
        neon2048Audio.slide();
      }

      // Save to undo history (keep last 5 moves)
      setHistory((prev) => [...prev.slice(-4), { tiles: prevTiles, score: prevScore }]);

      // Update state
      setTiles(result.tiles);
      updateScoreAndBest(result.score);

      // Handle diamond rewards
      if (result.diamondReward > 0) {
        addWalletDiamonds(result.diamondReward);
        triggerNotification(`+${result.diamondReward} 💎 Diamond Bonus!`);
      }

      // Check win condition (2048)
      if (!hasWon && !keepPlaying && result.tiles.some((t) => t.value >= 2048)) {
        setHasWon(true);
        addWalletDiamonds(50); // Massive win reward!
        neon2048Audio.win();
        return;
      }

      // Check game over
      if (!canMakeMove(result.tiles)) {
        setIsGameOver(true);
        neon2048Audio.gameOver();
      }
    },
    [isGameOver, hasWon, keepPlaying, tiles, score, updateScoreAndBest, triggerNotification]
  );

  // Undo move using diamonds
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    if (diamonds < UNDO_COST) {
      triggerNotification(`Need ${UNDO_COST} 💎 Diamonds to Undo!`);
      return;
    }

    const success = spendWalletDiamonds(UNDO_COST);
    if (!success) return;

    neon2048Audio.undo();
    const last = history[history.length - 1];
    setTiles(last.tiles);
    setScore(last.score);
    setHistory((prev) => prev.slice(0, -1));
    setIsGameOver(false);
    triggerNotification(`-${UNDO_COST} 💎 Move Undone!`);
  }, [history, diamonds, triggerNotification]);

  // Restart game
  const handleRestart = useCallback(() => {
    const newTiles = createNewBoard();
    setTiles(newTiles);
    setScore(0);
    setHistory([]);
    setIsGameOver(false);
    setHasWon(false);
    setKeepPlaying(false);
    neon2048Audio.slide();
  }, []);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    const nextMuted = neon2048Audio.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Share score
  const handleShare = useCallback(() => {
    const text = `🔥 I scored ${score} in 2048 Neon Fusion on TapYard! Can you beat my high score? Play free: https://tappyard.com/games/2048-puzzle`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: '2048 Neon Fusion | TapYard', text, url: 'https://tappyard.com/games/2048-puzzle' }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        triggerNotification('Score Challenge Copied to Clipboard!');
      }).catch(() => {
        triggerNotification('Link: tappyard.com/games/2048-puzzle');
      });
    } else {
      triggerNotification('Link: tappyard.com/games/2048-puzzle');
    }
  }, [score, triggerNotification]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrow keys
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

  // Touch handlers for mobile swipe
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

    if (Math.max(absDx, absDy) < 25) {
      return; // Ignore tiny micro-taps
    }

    if (absDx > absDy) {
      handleMove(dx > 0 ? 'right' : 'left');
    } else {
      handleMove(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col bg-[#061219] text-white select-none overflow-hidden safe-bottom"
      style={{ touchAction: 'none' }}
    >
      {/* 1. Header Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#081720]/95 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TapYard</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
              2048 Neon Fusion
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Puzzle className="w-3 h-3" />
              Puzzle
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Diamonds Wallet */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1e27] border border-cyan-500/30 text-cyan-300 font-black text-xs shadow-inner">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{diamonds}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0e2531] hover:bg-[#153545] border border-cyan-500/20 flex items-center justify-center text-slate-300 transition-all active:scale-90 cursor-pointer"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
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

      {/* Floating Diamond/Undo Notification Banner */}
      {floatingNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black shadow-lg shadow-cyan-500/30 animate-bounce-in border border-cyan-300/40">
          {floatingNotification}
        </div>
      )}

      {/* 2. Main Game Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-md w-full mx-auto overflow-hidden">
        {/* Score & Control Row */}
        <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 mb-3">
          {/* Current Score */}
          <div className="bg-[#0b1f2a] rounded-2xl p-2.5 sm:p-3 border border-cyan-500/30 text-center shadow-lg shadow-cyan-950/50 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Score</span>
            <span className="text-xl sm:text-2xl font-black text-white">{score}</span>
          </div>

          {/* Best Score */}
          <div className="bg-[#0b1f2a] rounded-2xl p-2.5 sm:p-3 border border-amber-500/30 text-center shadow-lg shadow-amber-950/50 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              Best
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">{bestScore}</span>
          </div>
        </div>

        {/* Action Controls Toolbar (Undo & Restart) */}
        <div className="w-full flex items-center justify-between gap-2 mb-3">
          {/* Undo Button with Diamond Cost */}
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || diamonds < UNDO_COST}
            className={`flex-1 h-10 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              history.length > 0 && diamonds >= UNDO_COST
                ? 'bg-[#0f2c3a] hover:bg-[#153e52] border-cyan-500/40 text-cyan-200 active:scale-95 shadow-md shadow-cyan-950/40'
                : 'bg-[#09171f] border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Move</span>
            <span className="text-[10px] font-black text-cyan-400 flex items-center gap-0.5">
              (5 <Gem className="w-2.5 h-2.5" />)
            </span>
          </button>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="h-10 px-4 rounded-xl bg-[#0f2c3a] hover:bg-[#153e52] border border-cyan-500/40 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-cyan-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Game</span>
          </button>
        </div>

        {/* 3. The 4x4 Neon Matrix Board */}
        <div
          ref={boardRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative w-full aspect-square bg-gradient-to-b from-[#081a24] to-[#040e14] rounded-3xl p-3 sm:p-4 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden"
        >
          {/* Background 4x4 Grid Cells */}
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-full rounded-2xl bg-[#0b2432]/50 border border-cyan-500/10 shadow-inner"
              />
            ))}
          </div>

          {/* Active Sliding Glowing Tiles */}
          {tiles.map((tile) => {
            const style = getTileStyle(tile.value);
            return (
              <div
                key={tile.id}
                className={`absolute p-1 sm:p-1.5 transition-all duration-100 ease-out`}
                style={{
                  width: '25%',
                  height: '25%',
                  left: `${tile.col * 25}%`,
                  top: `${tile.row * 25}%`,
                }}
              >
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-br ${style.bg} border-2 ${style.border} ${style.glow} flex flex-col items-center justify-center font-black ${style.text} ${style.fontSize} drop-shadow-md transition-transform ${
                    tile.isMerged ? 'animate-bounce-in scale-102' : tile.isNew ? 'animate-fade-in' : ''
                  }`}
                >
                  {tile.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe / Controls Helper Note */}
        <p className="text-[11px] font-medium text-slate-400 text-center mt-3">
          Swipe in any direction to merge matching tiles • Reach 2048 to win!
        </p>
      </main>

      {/* 4. Win Modal (2048 Reached) */}
      {hasWon && !keepPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative bg-gradient-to-b from-[#0f2c3a] to-[#0a1b24] rounded-3xl p-6 sm:p-8 max-w-sm w-full border-2 border-amber-400 shadow-2xl shadow-amber-500/30 flex flex-col items-center text-center gap-4 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/50">
              <Sparkles className="w-8 h-8 text-amber-950" />
            </div>

            <div>
              <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase">Victory!</span>
              <h2 className="text-3xl font-black text-white mt-1">YOU REACHED 2048!</h2>
              <p className="text-xs text-slate-300 mt-1">
                A legendary feat of focus and spatial strategy!
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-sm flex items-center gap-1.5">
              <Gem className="w-4 h-4 text-cyan-300" />
              <span>+50 Diamonds Awarded!</span>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-2">
              <button
                onClick={() => setKeepPlaying(true)}
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                KEEP PLAYING (ENDLESS 4096)
              </button>

              <button
                onClick={handleRestart}
                className="w-full h-11 rounded-2xl bg-[#123646] hover:bg-[#184457] text-slate-300 font-bold text-xs border border-cyan-500/30 transition-all active:scale-95 cursor-pointer"
              >
                NEW GAME
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative bg-gradient-to-b from-[#0f2c3a] to-[#0a1b24] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-cyan-500/40 shadow-2xl flex flex-col items-center text-center gap-4 animate-slide-up">
            <div className="text-[11px] font-black tracking-widest text-rose-400 uppercase">Game Over</div>
            <div className="text-4xl font-black text-white">
              {score}
              <span className="text-xs text-cyan-400 font-bold block mt-1">FINAL SCORE</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>BEST SCORE: {bestScore}</span>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-2">
              {/* Undo Last Move Option if player has diamonds */}
              {history.length > 0 && diamonds >= UNDO_COST && (
                <button
                  onClick={handleUndo}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 border border-cyan-300/40"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>USE UNDO (5 💎) & CONTINUE</span>
                </button>
              )}

              {/* Restart Button */}
              <button
                onClick={handleRestart}
                className="w-full h-11 rounded-2xl bg-[#123646] hover:bg-[#184457] text-white font-bold text-xs border border-cyan-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span>TRY AGAIN</span>
              </button>

              {/* Share Score Button */}
              <button
                onClick={handleShare}
                className="w-full h-10 rounded-2xl bg-[#091e28] hover:bg-[#0e2a38] text-slate-300 font-bold text-xs border border-slate-700/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>Challenge a Friend</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
