'use client';

import { Gem, Zap } from 'lucide-react';

interface GameThumbnailProps {
  id: string;
  title: string;
  className?: string;
}

export default function GameThumbnail({ id, title, className = 'w-full h-full' }: GameThumbnailProps) {
  if (id === 'jelly-bounce') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#081720] via-[#0d2836] to-[#081720] ${className}`}>
        {/* Background perspective runway lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-48 h-full bg-gradient-to-b from-cyan-900/40 to-transparent transform -skew-x-12" />
        </div>

        {/* Floating Cyan Diamond in top right */}
        <div className="absolute top-3 right-4 flex items-center gap-1 text-cyan-300 text-xs font-black animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
          <Gem className="w-3.5 h-3.5 text-cyan-300" />
        </div>

        {/* Glowing Chevrons on runway */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 text-cyan-400 text-sm font-black opacity-80">
          <span>❯</span>
          <span>❯</span>
          <span>❯</span>
        </div>

        {/* 3D Cube Jelly character artwork */}
        <div className="relative w-22 h-22 sm:w-24 sm:h-24 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_8px_16px_rgba(0,240,255,0.25)]">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            {/* Top facet */}
            <polygon points="40,14 66,24 40,34 14,24" fill="#ff7aa8" />
            {/* Left face */}
            <polygon points="14,24 40,34 40,64 14,54" fill="#ff4d88" />
            {/* Right face */}
            <polygon points="40,34 66,24 66,54 40,64" fill="#cc2960" />

            {/* Cyclops Eye on Center Face */}
            <ellipse cx="32" cy="44" rx="7" ry="7" fill="white" />
            <ellipse cx="33" cy="44" rx="4" ry="4" fill="#220516" />
            <ellipse cx="31.5" cy="42" rx="1.5" ry="1.5" fill="white" />
          </svg>
        </div>
      </div>
    );
  }

  if (id === '2048-puzzle' || id === '2048') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#071822] via-[#0b2837] to-[#05131b] ${className}`}>
        <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-[#05151f]/80 rounded-2xl border border-amber-500/40 shadow-xl shadow-amber-950/60 backdrop-blur-xs">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#063345] to-cyan-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-cyan-300">
            1024
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-300 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-lg border border-yellow-100 ring-2 ring-amber-400/60 animate-pulse">
            2048
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-950 to-blue-700 text-blue-100 font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-blue-400/70">
            512
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-950 to-violet-700 text-violet-100 font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-violet-400/70">
            256
          </div>
        </div>
      </div>
    );
  }

  if (id === 'color-zen' || id === 'block-zen') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#041419] via-[#07242c] to-[#030e13] ${className}`}>
        <div className="absolute inset-0 bg-radial from-teal-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-[#051821]/80 rounded-2xl border border-teal-500/40 shadow-xl shadow-teal-950/60">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm border border-cyan-300" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm border border-emerald-300" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500 shadow-sm border border-amber-300" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-purple-400 to-indigo-500 shadow-sm border border-purple-300" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-fuchsia-400 to-pink-500 shadow-sm border border-fuchsia-300 animate-pulse" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#08222e]/40 border border-teal-500/10" />
        </div>
      </div>
    );
  }

  if (id === 'quick-tap' || id === 'cyber-dash') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0c0314] via-[#1c0827] to-[#08020e] ${className}`}>
        <div className="absolute inset-0 bg-radial from-purple-500/20 via-transparent to-transparent pointer-events-none" />
        {/* Top & Bottom Laser Gate Pillars */}
        <div className="absolute top-0 right-8 w-5 h-9 bg-gradient-to-b from-purple-950 to-purple-800 border border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
        <div className="absolute bottom-0 right-8 w-5 h-9 bg-gradient-to-t from-purple-950 to-purple-800 border border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
        {/* Flying Cyber Ship */}
        <div className="relative flex items-center gap-1.5 z-10">
          <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/50 transform -rotate-12 animate-pulse border border-white/40">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // Fallback for other games
  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-violet-900 via-fuchsia-900 to-purple-950 ${className}`}>
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-2 shadow-inner border border-white/20">
          <Zap className="w-6 h-6 text-fuchsia-300" />
        </div>
        <div className="text-xs font-bold text-white/90 tracking-wider uppercase">{title}</div>
      </div>
    </div>
  );
}
