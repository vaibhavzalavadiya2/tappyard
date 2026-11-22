'use client';

import { Gem, Zap } from 'lucide-react';

interface GameThumbnailProps {
  id: string;
  title: string;
  className?: string;
  variant?: 'card' | 'avatar';
}

export default function GameThumbnail({
  id,
  title,
  className = 'w-full h-full',
  variant = 'card',
}: GameThumbnailProps) {
  // Shared vignette overlay for all thumbnails
  const vignetteOverlay = (
    <div className="absolute inset-0 pointer-events-none z-[1] shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />
  );

  // Avatar-specific optimized compact views for circular story avatars / small thumbnails
  if (variant === 'avatar') {
    if (id === 'jelly-bounce') {
      return (
        <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#081720] via-[#0d2836] to-[#081720] ${className}`}>
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 drop-shadow-[0_4px_8px_rgba(0,240,255,0.35)]">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <polygon points="40,14 66,24 40,34 14,24" fill="#ff7aa8" />
              <polygon points="14,24 40,34 40,64 14,54" fill="#ff4d88" />
              <polygon points="40,34 66,24 66,54 40,64" fill="#cc2960" />
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
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#05151f]/95 rounded-lg border border-amber-500/50 shadow-md">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-gradient-to-br from-[#063345] to-cyan-500 text-white font-black text-[6.5px] flex items-center justify-center border border-cyan-300/50">
              1K
            </div>
            <div className="w-3.5 h-3.5 rounded-[3px] bg-gradient-to-br from-amber-500 to-yellow-300 text-amber-950 font-black text-[6.5px] flex items-center justify-center border border-yellow-100 ring-1 ring-amber-400/80">
              2K
            </div>
            <div className="w-3.5 h-3.5 rounded-[3px] bg-gradient-to-br from-indigo-950 to-blue-700 text-blue-100 font-black text-[6.5px] flex items-center justify-center border border-blue-400/50">
              512
            </div>
            <div className="w-3.5 h-3.5 rounded-[3px] bg-gradient-to-br from-purple-950 to-violet-700 text-violet-100 font-black text-[6.5px] flex items-center justify-center border border-violet-400/50">
              256
            </div>
          </div>
        </div>
      );
    }

    if (id === 'color-zen' || id === 'block-zen') {
      return (
        <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#041419] via-[#07242c] to-[#030e13] ${className}`}>
          <div className="grid grid-cols-3 gap-0.5 p-1 bg-[#051821]/95 rounded-lg border border-teal-500/50 shadow-md">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-cyan-400 to-blue-500 border border-cyan-300/60" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-emerald-400 to-teal-500 border border-emerald-300/60" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-amber-400 to-yellow-500 border border-amber-300/60" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-purple-400 to-indigo-500 border border-purple-300/60" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-fuchsia-400 to-pink-500 border border-fuchsia-300/60" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#08222e]/40 border border-teal-500/20" />
          </div>
        </div>
      );
    }

    if (id === 'quick-tap' || id === 'cyber-dash') {
      return (
        <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0c0314] via-[#1c0827] to-[#08020e] ${className}`}>
          <div className="relative flex items-center justify-center gap-1">
            <div className="w-2.5 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/50 transform -rotate-12 border border-white/40">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-violet-900 to-purple-950 ${className}`}>
        <Zap className="w-5 h-5 text-fuchsia-300" />
      </div>
    );
  }

  // Shared floating particles (CSS-only via pseudo-elements on wrapper)
  const particleLayer = (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      <div className="absolute w-1 h-1 rounded-full bg-white/20 top-[15%] left-[20%] animate-[float_4s_ease-in-out_infinite]" />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-white/15 top-[60%] left-[75%] animate-[float_5s_ease-in-out_1s_infinite]" />
      <div className="absolute w-1 h-1 rounded-full bg-white/25 top-[35%] left-[50%] animate-[float_6s_ease-in-out_2s_infinite]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 top-[80%] left-[30%] animate-[float_4.5s_ease-in-out_0.5s_infinite]" />
      <div className="absolute w-1 h-1 rounded-full bg-white/15 top-[10%] left-[85%] animate-[float_5.5s_ease-in-out_1.5s_infinite]" />
    </div>
  );

  if (id === 'jelly-bounce') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#081720] via-[#0d2836] to-[#081720] ${className}`}>
        {particleLayer}
        {vignetteOverlay}

        {/* Background perspective runway lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-48 h-full bg-gradient-to-b from-cyan-900/40 to-transparent transform -skew-x-12" />
        </div>

        {/* Floating Cyan Diamond in top right */}
        <div className="absolute top-3 right-4 flex items-center gap-1 text-cyan-300 text-xs font-black animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] z-[2]">
          <Gem className="w-3.5 h-3.5 text-cyan-300" />
        </div>

        {/* Glowing Chevrons on runway — animated slide-right on hover */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 text-cyan-400 text-sm font-black opacity-80 z-[2] group-hover/card:animate-[chevron-slide_0.8s_ease-in-out_infinite]">
          <span>❯</span>
          <span>❯</span>
          <span>❯</span>
        </div>

        {/* 3D Cube Jelly character artwork — scales on card hover */}
        <div className="relative w-22 h-22 sm:w-24 sm:h-24 transition-transform duration-300 group-hover/card:scale-110 drop-shadow-[0_8px_16px_rgba(0,240,255,0.25)] z-[2]">
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
        {particleLayer}
        {vignetteOverlay}

        <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-[#05151f]/80 rounded-2xl border border-amber-500/40 shadow-xl shadow-amber-950/60 backdrop-blur-xs z-[2]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#063345] to-cyan-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-cyan-300 transition-transform duration-300 group-hover/card:scale-110">
            1024
          </div>
          {/* 2048 tile with shimmer on hover */}
          <div
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-300 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-lg border border-yellow-100 ring-2 ring-amber-400/60 animate-pulse overflow-hidden transition-transform duration-300 group-hover/card:scale-110"
          >
            <span className="relative z-[1]">2048</span>
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-950 to-blue-700 text-blue-100 font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-blue-400/70 transition-transform duration-300 group-hover/card:scale-110">
            512
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-950 to-violet-700 text-violet-100 font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-violet-400/70 transition-transform duration-300 group-hover/card:scale-110">
            256
          </div>
        </div>
      </div>
    );
  }

  if (id === 'color-zen' || id === 'block-zen') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#041419] via-[#07242c] to-[#030e13] ${className}`}>
        {particleLayer}
        {vignetteOverlay}

        <div className="absolute inset-0 bg-radial from-teal-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-[#051821]/80 rounded-2xl border border-teal-500/40 shadow-xl shadow-teal-950/60 z-[2]">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm border border-cyan-300 transition-transform duration-300 group-hover/card:scale-110" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm border border-emerald-300 transition-transform duration-300 group-hover/card:scale-110" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500 shadow-sm border border-amber-300 transition-transform duration-300 group-hover/card:scale-110" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-purple-400 to-indigo-500 shadow-sm border border-purple-300 transition-transform duration-300 group-hover/card:scale-110" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-fuchsia-400 to-pink-500 shadow-sm border border-fuchsia-300 animate-pulse transition-transform duration-300 group-hover/card:scale-110" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#08222e]/40 border border-teal-500/10 transition-transform duration-300 group-hover/card:scale-110" />
        </div>
      </div>
    );
  }

  if (id === 'quick-tap' || id === 'cyber-dash') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0c0314] via-[#1c0827] to-[#08020e] ${className}`}>
        {particleLayer}
        {vignetteOverlay}

        <div className="absolute inset-0 bg-radial from-purple-500/20 via-transparent to-transparent pointer-events-none" />
        {/* Top & Bottom Laser Gate Pillars */}
        <div className="absolute top-0 right-8 w-5 h-9 bg-gradient-to-b from-purple-950 to-purple-800 border border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
        <div className="absolute bottom-0 right-8 w-5 h-9 bg-gradient-to-t from-purple-950 to-purple-800 border border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
        {/* Flying Cyber Ship — scales on card hover */}
        <div className="relative flex items-center gap-1.5 z-10 transition-transform duration-300 group-hover/card:scale-110">
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
      {particleLayer}
      {vignetteOverlay}

      <div className="text-center p-4 z-[2]">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-2 shadow-inner border border-white/20 transition-transform duration-300 group-hover/card:scale-110">
          <Zap className="w-6 h-6 text-fuchsia-300" />
        </div>
        <div className="text-xs font-bold text-white/90 tracking-wider uppercase">{title}</div>
      </div>
    </div>
  );
}
