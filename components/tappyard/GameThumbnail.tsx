'use client';

import { useId } from 'react';
import { Gem, Zap } from 'lucide-react';
import CupcakeIllustration from '@/components/games/Cupcake2048/CupcakeIllustration';

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
  const uid = useId().replace(/:/g, '');
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

    if (id === 'cupcake-2048' || id === 'cupcake') {
      return (
        <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#240c2d] via-[#341142] to-[#1a0721] ${className}`}>
          <CupcakeIllustration value={2048} className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-[0_4px_8px_rgba(236,72,153,0.4)]" />
        </div>
      );
    }

    if (id === 'belt-sort') {
      return (
        <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#6ec6ff] via-[#5c86f5] to-[#162468] ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
            {/* Mini perspective belt */}
            <polygon points="20,4 44,4 54,42 10,42" fill="#3a3f52" />
            <polygon points="17,4 20,4 10,42 6,42" fill="#a78bfa" />
            <polygon points="44,4 47,4 58,42 54,42" fill="#a78bfa" />
            {/* Gold zone */}
            <polygon points="12,33 52,33 54,42 10,42" fill="#ffd23f" />
            {/* Shapes */}
            <polygon points="32,9 39,17 25,17" fill="#ff3b30" />
            <rect x="24" y="18" width="16" height="10" rx="2.5" fill="#2fbf4a" />
            <ellipse cx="32" cy="34" rx="9" ry="6" fill="#1642bf" />
            <ellipse cx="32" cy="32" rx="9" ry="5.5" fill="#2f6bff" stroke="#92c2ff" strokeWidth="1" />
            {/* 4 bins */}
            <rect x="6" y="44" width="12" height="14" rx="3" fill="#2f6bff" stroke="#92c2ff" strokeWidth="1" />
            <rect x="19" y="44" width="12" height="14" rx="3" fill="#2fbf4a" stroke="#9cf5a8" strokeWidth="1" />
            <rect x="33" y="44" width="12" height="14" rx="3" fill="#ff3b30" stroke="#ffa19c" strokeWidth="1" />
            <rect x="46" y="44" width="12" height="14" rx="3" fill="#8a3ffc" stroke="#d4b5ff" strokeWidth="1" />
            <circle cx="12" cy="52" r="3" fill="#ffffff" />
            <rect x="22.5" y="49.5" width="5" height="5" rx="1" fill="#ffffff" />
            <polygon points="39,49 42,54.5 36,54.5" fill="#ffffff" />
            <path d="M52 49 L55 52 L52 55 L49 52 Z" fill="#ffffff" />
          </svg>
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

  if (id === 'cupcake-2048' || id === 'cupcake') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#220c2b] via-[#361344] to-[#16061c] ${className}`}>
        {particleLayer}
        {vignetteOverlay}

        <div className="absolute inset-0 bg-radial from-pink-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-[#1f0d27]/80 rounded-2xl border border-pink-500/40 shadow-xl shadow-pink-950/60 backdrop-blur-xs z-[2]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-300 shadow-sm transition-transform duration-300 group-hover/card:scale-110">
            <CupcakeIllustration value={2} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center border border-pink-300 shadow-sm transition-transform duration-300 group-hover/card:scale-110">
            <CupcakeIllustration value={4} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-800 to-red-950 flex items-center justify-center border border-rose-400 shadow-sm transition-transform duration-300 group-hover/card:scale-110">
            <CupcakeIllustration value={256} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-fuchsia-400 to-pink-400 flex items-center justify-center border border-white shadow-lg ring-2 ring-pink-400/60 animate-pulse transition-transform duration-300 group-hover/card:scale-110">
            <CupcakeIllustration value={2048} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
      </div>
    );
  }

  if (id === 'belt-sort') {
    const bins = [
      {
        x: 11,
        light: '#62a4ff',
        mid: '#2f6bff',
        dark: '#1642bf',
        rim: '#9ecbff',
        pit: '#091a59',
        shape: 'circle' as const,
      },
      {
        x: 77,
        light: '#64e577',
        mid: '#2fbf4a',
        dark: '#187c2c',
        rim: '#a6f9b3',
        pit: '#093514',
        shape: 'square' as const,
      },
      {
        x: 143,
        light: '#ff7068',
        mid: '#ff3b30',
        dark: '#b31b13',
        rim: '#ffa8a3',
        pit: '#520905',
        shape: 'triangle' as const,
      },
      {
        x: 209,
        light: '#b37aff',
        mid: '#8a3ffc',
        dark: '#5219b8',
        rim: '#dcc2ff',
        pit: '#230754',
        shape: 'diamond' as const,
      },
    ];

    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-b from-[#6ec6ff] via-[#7f92ff] to-[#1a1f5c] ${className}`}
      >
        {/* Full-bleed sky + stylized factory silhouette scene */}
        <svg
          viewBox="0 0 320 240"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ec6ff" />
              <stop offset="60%" stopColor="#85a2ff" />
              <stop offset="100%" stopColor="#8f7bff" />
            </linearGradient>
            <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5d46c7" />
              <stop offset="50%" stopColor="#2c2473" />
              <stop offset="100%" stopColor="#12184a" />
            </linearGradient>
            <linearGradient id={`${uid}-teal`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id={`${uid}-orange`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffbe55" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id={`${uid}-tank`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffe57f" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          <rect width="320" height="240" fill={`url(#${uid}-sky)`} />

          {/* Soft clouds */}
          <g fill="#ffffff" opacity="0.45">
            <circle cx="52" cy="46" r="18" />
            <circle cx="72" cy="44" r="22" />
            <circle cx="92" cy="48" r="15" />
            <circle cx="242" cy="36" r="16" />
            <circle cx="262" cy="34" r="20" />
            <circle cx="282" cy="38" r="14" />
          </g>

          {/* Left factory machines & pipes */}
          <g opacity="0.82">
            <rect x="8" y="84" width="38" height="90" rx="8" fill="#5e4cc2" opacity="0.5" />
            <rect x="44" y="100" width="34" height="72" rx="6" fill="#6f5be0" opacity="0.45" />
            <rect x="14" y="96" width="26" height="68" rx="10" fill={`url(#${uid}-orange)`} />
            <rect x="10" y="92" width="34" height="9" rx="4" fill="#ffd23f" />
            <path
              d="M27 92 V68 Q27 60 35 60 H66 Q74 60 74 68 V142"
              fill="none"
              stroke={`url(#${uid}-teal)`}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <rect x="4" y="128" width="46" height="28" rx="6" fill="#2c2473" opacity="0.6" />
          </g>

          {/* Right factory tanks & pipes */}
          <g opacity="0.82">
            <rect x="242" y="76" width="46" height="98" rx="8" fill="#5e4cc2" opacity="0.48" />
            <rect x="272" y="64" width="34" height="106" rx="10" fill={`url(#${uid}-tank)`} />
            <ellipse cx="289" cy="64" rx="17" ry="6" fill="#fff099" />
            <path
              d="M289 58 V42 Q289 36 283 36 H258 Q250 36 250 44 V146"
              fill="none"
              stroke={`url(#${uid}-orange)`}
              strokeWidth="9"
              strokeLinecap="round"
            />
            <rect x="236" y="102" width="30" height="58" rx="8" fill={`url(#${uid}-teal)`} />
            <rect x="232" y="98" width="38" height="8" rx="4" fill="#5eead4" />
          </g>

          {/* Factory floor */}
          <rect x="0" y="156" width="320" height="84" fill={`url(#${uid}-floor)`} />
          <ellipse cx="160" cy="176" rx="140" ry="30" fill="#a78bfa" opacity="0.18" />
        </svg>

        {particleLayer}
        {vignetteOverlay}

        {/* Centered Hero Belt + Glossy Items + Gold Zone + 4 3D Bins */}
        <div className="relative z-[2] w-full h-full flex items-center justify-center p-2 sm:p-2.5 transition-transform duration-300 group-hover/card:scale-[1.04]">
          <svg
            viewBox="0 0 280 212"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full drop-shadow-[0_10px_18px_rgba(9,14,48,0.5)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${uid}-belt`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f5670" />
                <stop offset="55%" stopColor="#3a3f52" />
                <stop offset="100%" stopColor="#262a3b" />
              </linearGradient>
              <linearGradient id={`${uid}-rail`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d8c8ff" />
                <stop offset="55%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#6c4fd6" />
              </linearGradient>
              <linearGradient id={`${uid}-clamp`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe580" />
                <stop offset="55%" stopColor="#ffb300" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff4a8" />
                <stop offset="45%" stopColor="#ffd23f" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id={`${uid}-purple`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ba87ff" />
                <stop offset="100%" stopColor="#8a3ffc" />
              </linearGradient>
              <linearGradient id={`${uid}-red`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7b73" />
                <stop offset="100%" stopColor="#ff3b30" />
              </linearGradient>
              <linearGradient id={`${uid}-green`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#70eb82" />
                <stop offset="100%" stopColor="#2fbf4a" />
              </linearGradient>
              <linearGradient id={`${uid}-blue`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6eb0ff" />
                <stop offset="100%" stopColor="#2f6bff" />
              </linearGradient>
              {bins.map((b, i) => (
                <linearGradient
                  key={b.shape}
                  id={`${uid}-bin-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={b.light} />
                  <stop offset="45%" stopColor={b.mid} />
                  <stop offset="100%" stopColor={b.dark} />
                </linearGradient>
              ))}
            </defs>

            {/* Lavender outer side rails */}
            <polygon points="88,6 97,6 42,127 29,127" fill={`url(#${uid}-rail)`} stroke="#ede4ff" strokeWidth="1" />
            <polygon points="183,6 192,6 251,127 238,127" fill={`url(#${uid}-rail)`} stroke="#ede4ff" strokeWidth="1" />

            {/* Conveyor belt surface */}
            <polygon points="97,6 183,6 238,127 42,127" fill={`url(#${uid}-belt)`} />

            {/* Perspective chevrons on belt */}
            <g
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="124,18 140,24 156,18" />
              <polyline points="116,42 140,50 164,42" />
              <polyline points="107,70 140,80 173,70" />
              <polyline points="96,98 140,110 184,98" />
            </g>

            {/* Amber rail clamps */}
            <rect x="75" y="25" width="14" height="7" rx="2.5" fill={`url(#${uid}-clamp)`} transform="rotate(-24 82 28.5)" />
            <rect x="191" y="25" width="14" height="7" rx="2.5" fill={`url(#${uid}-clamp)`} transform="rotate(24 198 28.5)" />
            <rect x="57" y="61" width="16" height="8" rx="3" fill={`url(#${uid}-clamp)`} transform="rotate(-24 65 65)" />
            <rect x="207" y="61" width="16" height="8" rx="3" fill={`url(#${uid}-clamp)`} transform="rotate(24 215 65)" />
            <rect x="37" y="100" width="18" height="9" rx="3" fill={`url(#${uid}-clamp)`} transform="rotate(-24 46 104.5)" />
            <rect x="225" y="100" width="18" height="9" rx="3" fill={`url(#${uid}-clamp)`} transform="rotate(24 234 104.5)" />

            {/* Gold glowing Perfect Zone band */}
            <polygon points="50,105 230,105 239,127 41,127" fill={`url(#${uid}-gold)`} />
            <line x1="51" y1="106" x2="229" y2="106" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
            {/* 4-point sparkles on Perfect Zone */}
            <path d="M58 111 L60 115 L64 117 L60 119 L58 123 L56 119 L52 117 L56 115 Z" fill="#ffffff" opacity="0.9" />
            <path d="M222 111 L224 115 L228 117 L224 119 L222 123 L220 119 L216 117 L220 115 Z" fill="#ffffff" opacity="0.9" />

            {/* 1. Purple Diamond (top) */}
            <path d="M140 10 L152 19 L140 28 L128 19 Z" fill="#5219b8" />
            <path d="M140 7 L152 16 L140 25 L128 16 Z" fill={`url(#${uid}-purple)`} stroke="#e3ccff" strokeWidth="1.1" />

            {/* 2. Red Triangle */}
            <polygon points="140,32 157,54 123,54" fill="#a81811" stroke="#a81811" strokeWidth="3" strokeLinejoin="round" />
            <polygon points="140,28 157,50 123,50" fill={`url(#${uid}-red)`} stroke="#ffb0ab" strokeWidth="1.2" strokeLinejoin="round" />
            <line x1="138" y1="32" x2="128" y2="46" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />

            {/* 3. Green Square */}
            <rect x="118" y="61" width="44" height="26" rx="7" fill="#187c2c" />
            <rect x="118" y="56" width="44" height="26" rx="7" fill={`url(#${uid}-green)`} stroke="#a6f9b3" strokeWidth="1.3" />
            <rect x="123" y="59" width="34" height="6" rx="3" fill="rgba(255,255,255,0.4)" />

            {/* 4. Blue Circle (front hero puck straddling Perfect Zone) */}
            <ellipse cx="140" cy="117" rx="28" ry="11" fill="rgba(8,12,40,0.34)" />
            <ellipse cx="140" cy="111" rx="25" ry="14" fill="#1642bf" />
            <rect x="115" y="104" width="50" height="7" fill="#1642bf" />
            <ellipse cx="140" cy="104" rx="25" ry="14" fill={`url(#${uid}-blue)`} stroke="#9ecbff" strokeWidth="1.5" />
            <path d="M123 99 Q132 92 148 93" fill="none" stroke="rgba(255,255,255,0.68)" strokeWidth="2.8" strokeLinecap="round" />

            {/* 4 Glossy 3D Open Bins docked below Perfect Zone */}
            {bins.map((b, idx) => {
              const cx = b.x + 30;
              return (
                <g key={b.shape}>
                  {/* Drop shadow & hard 3D thickness */}
                  <rect x={b.x} y="136" width="60" height="69" rx="12" fill="rgba(6,10,36,0.48)" />
                  <rect x={b.x} y="135" width="60" height="66" rx="11" fill={b.dark} />

                  {/* Main glossy bin front shell */}
                  <rect
                    x={b.x}
                    y="130"
                    width="60"
                    height="65"
                    rx="11"
                    fill={`url(#${uid}-bin-${idx})`}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1"
                  />

                  {/* Top outer lighter rim */}
                  <rect x={b.x + 3} y="131.5" width="54" height="19" rx="7" fill={b.rim} />

                  {/* Dark sunken open interior pit */}
                  <rect x={b.x + 6} y="134" width="48" height="14" rx="5" fill={b.pit} />
                  <rect x={b.x + 7} y="144" width="46" height="3.5" rx="2" fill="rgba(255,255,255,0.12)" />

                  {/* Front face glossy highlight band */}
                  <rect x={b.x + 4} y="152" width="52" height="11" rx="5" fill="rgba(255,255,255,0.22)" />

                  {/* Crisp white shape emblem */}
                  {b.shape === 'circle' && <circle cx={cx} cy="173" r="11" fill="#ffffff" />}
                  {b.shape === 'square' && (
                    <rect x={cx - 10} y="163" width="20" height="20" rx="4" fill="#ffffff" />
                  )}
                  {b.shape === 'triangle' && (
                    <polygon
                      points={`${cx},162 ${cx + 11.5},183 ${cx - 11.5},183`}
                      fill="#ffffff"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  )}
                  {b.shape === 'diamond' && (
                    <path
                      d={`M${cx} 161 L${cx + 11.5} 173 L${cx} 185 L${cx - 11.5} 173 Z`}
                      fill="#ffffff"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  )}
                </g>
              );
            })}
          </svg>
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
