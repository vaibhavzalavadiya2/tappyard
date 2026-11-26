'use client';

import { useRef } from 'react';
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
import { getTileStyle } from '@/game/2048/logic';
import { UNDO_DIAMOND_COST, use2048Game } from '@/game/2048/use2048Game';
import ChallengerBanner from '@/components/tappyard/ChallengerBanner';

export default function Neon2048Client() {
  const boardRef = useRef<HTMLDivElement>(null);

  const {
    tiles,
    score,
    bestScore,
    moves,
    history,
    isGameOver,
    hasWon,
    keepPlaying,
    isMuted,
    diamonds,
    floatingNotification,
    scorePop,
    confirmNewGameOpen,
    isFullscreen,
    boardDragHandlers,
    handleUndo,
    handleRestart,
    requestRestart,
    cancelRestart,
    handleKeepPlaying,
    handleToggleMute,
    toggleFullscreen,
    handleShare,
  } = use2048Game({
    gameSlug: '2048-puzzle',
    gameTitle: '2048 Neon Fusion',
    storageKey: 'tappyard-neon2048-state-v1',
    maxHistory: 5,
    winDiamonds: 50,
  });

  return (
    <section className="w-full flex flex-col bg-[#061219] text-white select-none">
      {/* 1. Header Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#081720]/95 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="typo-nav flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TAPPYARD</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="typo-game-title text-base sm:text-lg text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
              2048 Neon Fusion
            </h1>
            <span className="typo-label hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Puzzle className="w-3 h-3" />
              Puzzle
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
      <main id="game-stage" className="relative w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center p-3 sm:p-6 max-w-md mx-auto">
        <ChallengerBanner gameSlug="2048-puzzle" currentScore={score} />

        {/* Score & Control Row */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-2.5 mb-3">
          {/* Current Score */}
          <div className="relative bg-[#0b1f2a] rounded-2xl p-2 sm:p-2.5 border border-cyan-500/30 text-center shadow-lg shadow-cyan-950/50 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-cyan-400">Score</span>
            <span className="text-lg sm:text-xl font-black text-white tabular-nums">{score}</span>
            {scorePop && (
              <span
                key={scorePop.key}
                className="animate-score-float pointer-events-none absolute -top-2 left-1/2 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black shadow-md whitespace-nowrap"
              >
                +{scorePop.delta}
              </span>
            )}
          </div>

          {/* Moves */}
          <div className="bg-[#0b1f2a] rounded-2xl p-2 sm:p-2.5 border border-teal-500/30 text-center shadow-lg shadow-teal-950/50 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-teal-400">Moves</span>
            <span className="text-lg sm:text-xl font-black text-white tabular-nums">{moves}</span>
          </div>

          {/* Best Score */}
          <div className="bg-[#0b1f2a] rounded-2xl p-2 sm:p-2.5 border border-amber-500/30 text-center shadow-lg shadow-amber-950/50 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-0.5">
              <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              Best
            </span>
            <span className="text-lg sm:text-xl font-black text-white tabular-nums">{bestScore}</span>
          </div>
        </div>

        {/* Action Controls Toolbar (Undo & Restart) */}
        <div className="w-full flex items-center justify-between gap-2 mb-3">
          {/* Undo Button with Diamond Cost */}
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || diamonds < UNDO_DIAMOND_COST}
            className={`flex-1 h-10 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              history.length > 0 && diamonds >= UNDO_DIAMOND_COST
                ? 'bg-[#0f2c3a] hover:bg-[#153e52] border-cyan-500/40 text-cyan-200 active:scale-95 shadow-md shadow-cyan-950/40'
                : 'bg-[#09171f] border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Move</span>
            <span className="text-[10px] font-black text-cyan-400 flex items-center gap-0.5">
              ({UNDO_DIAMOND_COST} <Gem className="w-2.5 h-2.5" />)
            </span>
          </button>

          {/* Restart Button */}
          <button
            onClick={requestRestart}
            className="h-10 px-4 rounded-xl bg-[#0f2c3a] hover:bg-[#153e52] border border-cyan-500/40 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-cyan-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Game</span>
          </button>
        </div>

        {/* 3. The 4x4 Neon Matrix Board */}
        <div
          ref={boardRef}
          {...boardDragHandlers}
          className="relative w-full aspect-square bg-gradient-to-b from-[#081a24] to-[#040e14] rounded-3xl p-3 sm:p-4 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
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
                className="absolute p-1 sm:p-1.5 transition-[left,top] duration-100 ease-out"
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

        {/* Swipe / Mouse / Controls Helper Note */}
        <p className="text-[11px] font-medium text-slate-400 text-center mt-3">
          Swipe, drag with mouse, or use Arrow Keys / WASD to slide tiles. Match two equal tiles to merge them and reach 2048.
        </p>

        {/* Mobile: unobtrusive link to scroll to below-fold content */}
        <a
          href="#game-details"
          className="md:hidden mt-2 flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-[10px] text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-md active:scale-95 transition-all"
        >
          <span>How to play & tips</span>
          <span>↓</span>
        </a>
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
                onClick={handleKeepPlaying}
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
              {history.length > 0 && diamonds >= UNDO_DIAMOND_COST && (
                <button
                  onClick={handleUndo}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 border border-cyan-300/40"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>USE UNDO ({UNDO_DIAMOND_COST} 💎) & CONTINUE</span>
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

      {/* 6. New Game Confirmation Modal */}
      {confirmNewGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-b from-[#0f2c3a] to-[#0a1b24] border border-cyan-500/40 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl">
            <h3 className="text-lg font-black text-white mb-1">Start a New Game?</h3>
            <p className="text-xs text-slate-300 mb-5">
              Your current score ({score}) will be reset.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={cancelRestart}
                className="flex-1 py-2.5 rounded-xl bg-[#123646] hover:bg-[#184457] border border-cyan-500/30 text-slate-200 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs cursor-pointer active:scale-95 transition-all shadow-md"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
