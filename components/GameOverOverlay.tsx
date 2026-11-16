'use client';

import { GAME_CONFIG } from '@/game/config';
import { RotateCcw, Palette, Volume2, VolumeX, Trophy, Gem, Sparkles } from 'lucide-react';

interface GameOverOverlayProps {
  distance: number;
  bestDistance: number;
  diamondsCollected: number;
  totalDiamonds: number;
  streak: number;
  isNewRecord: boolean;
  isMuted: boolean;
  selectedSkin?: string;
  onRetry: () => void;
  onOpenShop: () => void;
  onToggleMute: () => void;
}

export default function GameOverOverlay({
  distance,
  bestDistance,
  diamondsCollected,
  totalDiamonds,
  isNewRecord,
  isMuted,
  selectedSkin,
  onRetry,
  onOpenShop,
  onToggleMute,
}: GameOverOverlayProps) {
  const activeSkin =
    GAME_CONFIG.JELLY_SKINS.find((s) => s.id === selectedSkin) ||
    GAME_CONFIG.JELLY_SKINS[0];
  const activeTopHex = '#' + activeSkin.topColor.toString(16).padStart(6, '0');
  const activeFaceHex = '#' + activeSkin.color.toString(16).padStart(6, '0');
  const activeSideHex = '#' + activeSkin.sideColor.toString(16).padStart(6, '0');
  const activeEyeHex = '#' + activeSkin.eyeColor.toString(16).padStart(6, '0');

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 p-4 select-none animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Main Game Over Modal Card */}
      <div
        className="relative bg-gradient-to-b from-[#0f2c3a] to-[#0a1b24] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-4
        w-full max-w-xs border border-cyan-500/30 animate-slide-up text-white"
      >
        {/* Protruding Hexagonal Avatar Badge at Top */}
        <div className="-mt-14 sm:-mt-16 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#163f52] to-[#0a1e28] border-2 border-cyan-400 p-2 shadow-xl shadow-cyan-950/60 flex items-center justify-center">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
            {/* 3D Cube Front Face */}
            <rect x="18" y="24" width="44" height="42" rx="8" fill={activeFaceHex} />
            {/* Top highlight facet */}
            <path d="M 22 24 L 30 16 L 62 16 L 58 24 Z" fill={activeTopHex} />
            <path d="M 58 24 L 62 16 L 68 28 L 62 60 Z" fill={activeSideHex} />

            {/* Sad Slit Eyes */}
            <line x1="28" y1="42" x2="38" y2="47" stroke={activeEyeHex} strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="47" x2="42" y2="42" stroke={activeEyeHex} strokeWidth="3" strokeLinecap="round" />

            {/* Sad downturned mouth */}
            <path d="M 34 56 Q 40 51 46 56" stroke={activeEyeHex} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Header / Title */}
        <div className="text-center pt-1">
          <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase">
            GAME OVER
          </span>
          {isNewRecord && (
            <div className="mt-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 text-[10px] font-black uppercase tracking-wider shadow-md animate-bounce-in flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-950" />
              <span>NEW RECORD!</span>
            </div>
          )}
        </div>

        {/* Final Distance Score */}
        <div className="text-center">
          <div className="text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {distance}
            <span className="text-lg text-cyan-300 font-bold ml-1">m</span>
          </div>

          {/* Best Distance */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold mt-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BEST: {bestDistance}m</span>
          </div>
        </div>

        {/* Diamonds collected badge */}
        <div className="flex items-center justify-between w-full bg-[#0a1e27] px-4 py-2.5 rounded-2xl border border-cyan-500/20 text-xs">
          <span className="text-slate-400 font-medium">Diamonds Earned</span>
          <span className="text-cyan-300 font-black flex items-center gap-1.5 text-sm">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>+{diamondsCollected}</span>
            <span className="text-slate-500 font-normal text-[11px]">({totalDiamonds} total)</span>
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col gap-2.5 w-full pt-1">
          {/* RESTART Button */}
          <button
            onClick={onRetry}
            className="w-full h-12 rounded-2xl text-white font-black text-sm shadow-xl shadow-cyan-500/20
              bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500
              transition-all hover:scale-102 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-cyan-300/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>

          {/* SKINS / SHOP Button */}
          <button
            onClick={onOpenShop}
            className="w-full h-11 rounded-2xl text-cyan-200 font-bold text-xs
              bg-[#123646] hover:bg-[#184457] transition-all active:scale-95 cursor-pointer
              flex items-center justify-center gap-2 border border-cyan-500/30"
          >
            <Palette className="w-4 h-4 text-cyan-300" />
            <span>JELLY SKINS</span>
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 pt-1"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sound On</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
