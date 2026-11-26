'use client';

import { useState, useRef } from 'react';
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
import { UNDO_DIAMOND_COST, use2048Game } from '@/game/2048/use2048Game';
import ChallengerBanner from '@/components/tappyard/ChallengerBanner';
import CupcakeIllustration from './CupcakeIllustration';
import { CUPCAKE_TIERS, getCupcakeTier } from './CupcakeData';

export default function Cupcake2048Client() {
  const [cookbookOpen, setCookbookOpen] = useState(false);
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
    gameSlug: 'cupcake-2048',
    gameTitle: 'Cupcake 2048',
    storageKey: 'tappyard-cupcake2048-state-v1',
    maxHistory: 10,
    winDiamonds: 0,
    isExternalModalOpen: cookbookOpen,
    onEscapeExternalModal: () => setCookbookOpen(false),
  });

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
          <div className="relative bg-[#211129] rounded-2xl p-2 sm:p-2.5 border border-pink-500/30 text-center shadow-lg shadow-pink-950/40 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-pink-400">Score</span>
            <span className="text-lg sm:text-xl font-black text-white tabular-nums">{score}</span>
            {scorePop && (
              <span
                key={scorePop.key}
                className="animate-score-float pointer-events-none absolute -top-2 left-1/2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-black shadow-md whitespace-nowrap"
              >
                +{scorePop.delta}
              </span>
            )}
          </div>

          {/* Moves */}
          <div className="bg-[#211129] rounded-2xl p-2 sm:p-2.5 border border-purple-500/30 text-center shadow-lg shadow-purple-950/40 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-purple-400">Moves</span>
            <span className="text-lg sm:text-xl font-black text-white tabular-nums">{moves}</span>
          </div>

          {/* Best Score */}
          <div className="bg-[#211129] rounded-2xl p-2 sm:p-2.5 border border-amber-500/30 text-center shadow-lg shadow-amber-950/40 flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-0.5">
              <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              Best
            </span>
            <span className="text-lg sm:text-xl font-black text-white tabular-nums">{bestScore}</span>
          </div>
        </div>

        {/* Action Controls Toolbar (Undo & Restart) */}
        <div className="w-full flex items-center justify-between gap-2 mb-3">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || diamonds < UNDO_DIAMOND_COST}
            className={`flex-1 h-10 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              history.length > 0 && diamonds >= UNDO_DIAMOND_COST
                ? 'bg-[#2a1435] hover:bg-[#381a47] border-pink-500/40 text-pink-200 active:scale-95 shadow-md shadow-pink-950/40'
                : 'bg-[#180d20] border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Move</span>
            <span className="text-[10px] font-black text-pink-400 flex items-center gap-0.5">
              ({UNDO_DIAMOND_COST} <Gem className="w-2.5 h-2.5" />)
            </span>
          </button>

          <button
            onClick={requestRestart}
            className="h-10 px-4 rounded-xl bg-[#2a1435] hover:bg-[#381a47] border border-pink-500/40 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-pink-950/40"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            <span>New Game</span>
          </button>
        </div>

        {/* 3. The 4x4 Cupcake Bakery Matrix Board */}
        <div
          ref={boardRef}
          {...boardDragHandlers}
          className="relative w-full aspect-square bg-gradient-to-b from-[#1f0f27] to-[#120718] rounded-3xl p-3 sm:p-4 border-2 border-pink-500/40 shadow-2xl shadow-pink-950/60 overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
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
                className="absolute p-1 sm:p-1.5 transition-[left,top] duration-100 ease-out"
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
          Swipe, drag with mouse, or use Arrow Keys / WASD to slide cupcakes. Merge matching cupcakes to bake the next tier!
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
              {history.length > 0 && diamonds >= UNDO_DIAMOND_COST && (
                <button
                  onClick={handleUndo}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 active:scale-95 transition-all cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>Undo Last Move ({UNDO_DIAMOND_COST} 💎)</span>
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
                onClick={handleKeepPlaying}
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

        {/* New Game Confirmation Modal */}
        {confirmNewGameOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#1c0f24] border border-pink-500/40 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl">
              <h3 className="text-lg font-black text-white mb-1">Start a New Game?</h3>
              <p className="text-xs text-pink-200/80 mb-5">
                Your current score ({score}) will be reset.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={cancelRestart}
                  className="flex-1 py-2.5 rounded-xl bg-[#2a1435] hover:bg-[#381a47] border border-pink-500/30 text-pink-200 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestart}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs cursor-pointer active:scale-95 transition-all shadow-md"
                >
                  Start Fresh
                </button>
              </div>
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
