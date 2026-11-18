'use client';

import { useState } from 'react';
import { GAME_CONFIG } from '@/game/config';
import type { GameProgress } from '@/game/progress';
import { audioManager } from '@/game/audio';
import {
  Gem,
  Trophy,
  Play,
  Palette,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from 'lucide-react';

interface MainMenuProps {
  bestScore: number;
  isMuted: boolean;
  onPlay: () => void;
  onToggleMute: () => void;
  progress: GameProgress | null;
  onSelectSkin: (skinId: string) => void;
  onUnlockSkin?: (skinId: string) => void;
  initialShowSkins?: boolean;
  onCloseSkins?: () => void;
}

export default function MainMenu({
  bestScore,
  isMuted,
  onPlay,
  onToggleMute,
  progress,
  onSelectSkin,
  onUnlockSkin,
  initialShowSkins = false,
  onCloseSkins,
}: MainMenuProps) {
  const [showSkins, setShowSkins] = useState(initialShowSkins);

  const handleCloseModal = () => {
    setShowSkins(false);
    onCloseSkins?.();
  };

  const activeSkin =
    GAME_CONFIG.JELLY_SKINS.find((s) => s.id === progress?.selectedSkin) ||
    GAME_CONFIG.JELLY_SKINS[0];
  const activeTopHex = '#' + activeSkin.topColor.toString(16).padStart(6, '0');
  const activeFaceHex = '#' + activeSkin.color.toString(16).padStart(6, '0');
  const activeSideHex = '#' + activeSkin.sideColor.toString(16).padStart(6, '0');
  const activeEyeHex = '#' + activeSkin.eyeColor.toString(16).padStart(6, '0');

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none p-3 sm:p-6 pt-5 sm:pt-8 select-none overflow-hidden">
      {/* Soft atmospheric background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#081720]/80 via-[#0e2f3d]/60 to-[#081720]/85 backdrop-blur-[2px]" />

      {/* Main Menu Container */}
      <div className="relative flex flex-col items-center gap-2 sm:gap-3.5 pointer-events-auto w-full max-w-sm px-3 max-h-[calc(100vh-60px)] justify-center my-auto">
        {/* Diamond Counter Top Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#0c2733]/90 backdrop-blur-md rounded-2xl px-3.5 py-1.5 sm:px-4 sm:py-2 border border-cyan-500/30 shadow-lg shadow-cyan-950/40">
          <Gem className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
          <span className="text-white font-black text-xs sm:text-sm tracking-wide">
            {progress?.totalDiamonds ?? 0}
          </span>
          <span className="text-[9px] sm:text-[10px] text-cyan-300/80 font-bold uppercase tracking-wider ml-1">
            Diamonds
          </span>
        </div>

        {/* 3D Block Typography Title: JUMP JELLY JUMP! */}
        <div className="text-center select-none pt-0.5">
          <div className="text-[10px] sm:text-xs font-black tracking-widest text-cyan-400 uppercase -mb-1">
            Endless 3D Speed Runner
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg leading-tight"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #ff4d88 50%, #feca57 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 12px rgba(0,240,255,0.3))',
            }}
          >
            JUMP JELLY JUMP!
          </h1>
        </div>

        {/* 3D Cube Jelly Character Preview */}
        <div className="relative w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 animate-bounce-slow my-0.5 sm:my-1 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-2xl">
            {/* Top facet */}
            <polygon points="40,12 66,22 40,32 14,22" fill={activeTopHex} />
            {/* Left face */}
            <polygon points="14,22 40,32 40,62 14,52" fill={activeFaceHex} />
            {/* Right face */}
            <polygon points="40,32 66,22 66,52 40,62" fill={activeSideHex} />

            {/* Cyclops Eye on Left/Center Face */}
            <ellipse cx="32" cy="42" rx="7" ry="7" fill="white" />
            <ellipse cx="33" cy="42" rx="4" ry="4" fill={activeEyeHex} />
            <ellipse cx="31" cy="40" rx="1.5" ry="1.5" fill="white" />
          </svg>
        </div>

        {/* Instruction Note */}
        <div className="text-[11px] sm:text-xs font-semibold text-cyan-200 bg-[#0c2733]/85 px-4 py-2 rounded-2xl border border-cyan-500/30 text-center max-w-xs leading-snug">
          Drag to steer the jelly cube. Collect diamonds and hit booster pads to leap the chasms.
        </div>

        {/* Big PLAY Button */}
        <button
          onClick={onPlay}
          className="group relative w-full sm:w-auto sm:min-w-[220px] h-12 sm:h-14 rounded-2xl text-white text-base sm:text-lg font-black shadow-xl shadow-cyan-500/25
            transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center gap-3
            focus:outline-none focus:ring-4 focus:ring-cyan-400 select-none cursor-pointer border border-cyan-300/40"
          style={{
            background: 'linear-gradient(135deg, #00d2d3 0%, #0984e3 100%)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Play className="w-5 h-5 fill-white" />
            <span>PLAY NOW</span>
          </span>
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #74b9ff 100%)' }}
          />
        </button>

        {/* Bottom controls row */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full justify-center mt-0.5 sm:mt-1">
          {/* Skins button */}
          <button
            onClick={() => setShowSkins(true)}
            className="flex-1 sm:flex-initial h-10 sm:h-11 px-4 sm:px-5 rounded-2xl bg-[#0c2733] text-cyan-200 text-xs font-black shadow-md
              hover:bg-[#123646] transition-all active:scale-95 flex items-center justify-center gap-2 border border-cyan-500/30 cursor-pointer"
          >
            <Palette className="w-4 h-4 text-cyan-300" />
            <span>Jelly Skins</span>
          </button>

          {/* Sound toggle button */}
          <button
            onClick={onToggleMute}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0c2733] text-slate-300 shadow-md flex items-center justify-center
              hover:bg-[#123646] transition-all active:scale-95 border border-cyan-500/30 cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* 3D Cube Skins Shop Modal */}
      {showSkins && progress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fade-in">
          <div
            className="relative bg-gradient-to-b from-[#0f2c3a] to-[#0a1b24] rounded-3xl shadow-2xl p-5 sm:p-6 w-full max-w-sm
              border border-cyan-500/40 animate-slide-up flex flex-col gap-4 max-h-[90dvh] overflow-y-auto text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div>
                <h3 className="font-black text-white text-lg">Character Skins</h3>
                <p className="text-xs text-slate-400">Unlock with collected diamonds</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-xs font-black bg-[#061820] px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{progress.totalDiamonds}</span>
                </span>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-[#123646] hover:bg-[#1a4a5f] text-slate-300 flex items-center justify-center font-bold text-sm active:scale-90 transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skins Grid */}
            <div className="grid grid-cols-3 gap-3">
              {GAME_CONFIG.JELLY_SKINS.map((skin) => {
                const isUnlocked = progress.unlockedSkins.includes(skin.id);
                const isSelected = progress.selectedSkin === skin.id;
                const canAfford = progress.totalDiamonds >= skin.unlockCost;
                const colorHex = '#' + skin.color.toString(16).padStart(6, '0');

                return (
                  <button
                    key={skin.id}
                    onClick={() => {
                      if (isUnlocked) {
                        audioManager.buttonClick();
                        onSelectSkin(skin.id);
                      } else if (canAfford && onUnlockSkin) {
                        audioManager.boost();
                        onUnlockSkin(skin.id);
                      }
                    }}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 bg-cyan-950/60 shadow-lg scale-102 border border-cyan-400/50'
                        : isUnlocked
                        ? 'bg-[#0e2531] hover:bg-[#153545] active:scale-95 border border-slate-700/60'
                        : canAfford
                        ? 'bg-[#0e2531]/80 hover:bg-[#194052] border border-amber-500/40 active:scale-95'
                        : 'bg-[#08151c]/60 opacity-60 border border-slate-800'
                    }`}
                  >
                    {/* 3D Cube Icon */}
                    <div
                      className="w-11 h-11 rounded-xl shadow-inner border border-white/20 flex items-center justify-center"
                      style={{ background: colorHex }}
                    >
                      {skin.id === 'rainbow-cube' && (
                        <Sparkles className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-slate-200 text-center truncate max-w-full">
                      {skin.name}
                    </span>

                    {/* Status / Cost badge */}
                    {isSelected ? (
                      <span className="text-[9px] font-black text-cyan-300 uppercase">
                        Active
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[9px] font-semibold text-slate-400 uppercase">
                        Owned
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-1">
                        <Gem className="w-3 h-3 text-amber-300" />
                        <span>{skin.unlockCost}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              className="w-full py-2.5 rounded-2xl bg-[#123646] hover:bg-[#184457] text-white font-bold text-xs active:scale-98 transition-all cursor-pointer mt-1 border border-cyan-500/30"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
