'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadProgress, type GameProgress } from '@/game/progress';
import { GAME_CONFIG } from '@/game/config';
import { Star, Trophy, Gem, Zap, Play, ArrowRight } from 'lucide-react';

export default function HeroFeatured() {
  const [progress, setProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    try {
      const p = loadProgress();
      setProgress(p);
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const activeSkin =
    GAME_CONFIG.JELLY_SKINS.find((s) => s.id === progress?.selectedSkin) ||
    GAME_CONFIG.JELLY_SKINS[0];
  const activeTopHex = '#' + activeSkin.topColor.toString(16).padStart(6, '0');
  const activeFaceHex = '#' + activeSkin.color.toString(16).padStart(6, '0');
  const activeSideHex = '#' + activeSkin.sideColor.toString(16).padStart(6, '0');
  const activeEyeHex = '#' + activeSkin.eyeColor.toString(16).padStart(6, '0');

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#081720] via-[#0d2836] to-[#081720] border border-cyan-500/30 shadow-2xl p-3.5 sm:p-6 lg:p-8">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />

      {/* --- MOBILE COMPACT VIEW (< lg) --- */}
      <div className="flex flex-col gap-2.5 sm:gap-3 lg:hidden relative z-10">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              FLAGSHIP 3D RUNNER
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Arcade
            </span>
          </div>
          <span className="text-xs text-amber-400 font-black flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </span>
        </div>

        {/* Title + Compact 3D Jelly Preview Side-by-Side */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Jump Jelly Jump!
            </h2>
            <p className="text-slate-300 text-xs mt-0.5 leading-snug line-clamp-2">
              3D speed runner — drag to steer across floating runways & leap chasms!
            </p>
          </div>

          {/* Interactive animated jelly preview icon */}
          <Link
            href="/games/jelly-bounce"
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-pink-500/15 to-blue-500/20 border border-cyan-400/40 p-1.5 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            aria-label="Play Jump Jelly Jump!"
          >
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 animate-bounce-slow">
              <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
                <polygon points="40,14 66,24 40,34 14,24" fill={activeTopHex} />
                <polygon points="14,24 40,34 40,64 14,54" fill={activeFaceHex} />
                <polygon points="40,34 66,24 66,54 40,64" fill={activeSideHex} />
                <ellipse cx="32" cy="44" rx="7" ry="7" fill="white" />
                <ellipse cx="33" cy="44" rx="4" ry="4" fill={activeEyeHex} />
                <ellipse cx="31.5" cy="42" rx="1.5" ry="1.5" fill="white" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Compact Stats Pill (if played) */}
        {progress && progress.bestDistance > 0 && (
          <div className="flex items-center justify-around py-1.5 px-2.5 rounded-xl bg-[#0b212c]/90 border border-cyan-500/30 text-[11px] text-slate-300">
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="text-slate-400 text-[9px] uppercase font-bold">Best:</span>
              <span className="font-black text-amber-400">{progress.bestDistance}m</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700" />
            <div className="flex items-center gap-1">
              <Gem className="w-3 h-3 text-cyan-400" />
              <span className="font-black text-cyan-400">{progress.totalDiamonds}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700" />
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-pink-400 fill-pink-400" />
              <span className="font-black text-pink-400">{progress.totalBoosts}</span>
            </div>
          </div>
        )}

        {/* Big PLAY NOW Button */}
        <Link
          href="/games/jelly-bounce"
          className="group relative flex items-center justify-center gap-2 h-11 sm:h-12 w-full rounded-xl font-black text-white text-sm shadow-lg shadow-cyan-500/25 transition-all duration-150 active:scale-98 cursor-pointer border border-cyan-300/40"
          style={{
            background: 'linear-gradient(135deg, #00d2d3 0%, #0984e3 100%)',
          }}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>PLAY NOW</span>
          <span className="text-[11px] text-cyan-100 font-normal">• Free Browser Game</span>
        </Link>
      </div>

      {/* --- DESKTOP VIEW (lg+) --- */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Game Info & Play CTA */}
        <div className="lg:col-span-7 flex flex-col items-start gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              FLAGSHIP 3D RUNNER
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Arcade
            </span>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
              <span className="text-slate-400 font-normal">(28.4k plays)</span>
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Jump Jelly Jump!
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
            An addictive 3D forward speed runner. Drag to steer your jelly cube across suspended floating runways, collect glowing cyan diamonds, and hit speed chevron booster pads to leap over endless chasms!
          </p>

          {progress && progress.bestDistance > 0 && (
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#0b212c]/90 border border-cyan-500/30 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Best Distance
                  </span>
                  <span className="text-lg font-black text-amber-400">
                    {progress.bestDistance}m
                  </span>
                </div>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                  <Gem className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Diamonds
                  </span>
                  <span className="text-lg font-black text-cyan-400">
                    {progress.totalDiamonds}
                  </span>
                </div>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-pink-400 fill-pink-400" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Boosts
                  </span>
                  <span className="text-lg font-black text-pink-400">
                    {progress.totalBoosts}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <Link
              href="/games/jelly-bounce"
              className="group relative inline-flex items-center justify-center gap-3 h-14 px-8 rounded-2xl font-black text-white text-base shadow-xl shadow-cyan-500/25 transition-all duration-150 hover:scale-102 active:scale-95 cursor-pointer border border-cyan-300/40"
              style={{
                background: 'linear-gradient(135deg, #00d2d3 0%, #0984e3 100%)',
              }}
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>PLAY NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-xs text-slate-400">
              Drag to steer • Speed chevrons • 100% Free
            </span>
          </div>
        </div>

        {/* Right Column: 3D Character Showcase */}
        <div className="lg:col-span-5 flex justify-center">
          <Link
            href="/games/jelly-bounce"
            className="group relative w-64 h-64 lg:w-72 lg:h-72 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-pink-500/10 to-blue-500/20 border border-cyan-400/30 p-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md hover:border-cyan-400/60 transition-all hover:scale-102 cursor-pointer"
          >
            <div className="absolute bottom-10 w-48 h-6 rounded-full bg-cyan-950/60 shadow-lg border-t border-cyan-400/40" />
            <div className="absolute top-4 right-8 text-cyan-300 text-sm font-black animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              <Gem className="w-5 h-5 text-cyan-300 fill-cyan-400/30" />
            </div>
            <div className="relative w-36 h-36 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 drop-shadow-[0_12px_24px_rgba(0,240,255,0.3)]">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <polygon points="40,14 66,24 40,34 14,24" fill={activeTopHex} />
                <polygon points="14,24 40,34 40,64 14,54" fill={activeFaceHex} />
                <polygon points="40,34 66,24 66,54 40,64" fill={activeSideHex} />
                <ellipse cx="32" cy="44" rx="7" ry="7" fill="white" />
                <ellipse cx="33" cy="44" rx="4" ry="4" fill={activeEyeHex} />
                <ellipse cx="31.5" cy="42" rx="1.5" ry="1.5" fill="white" />
              </svg>
            </div>
            <div className="absolute bottom-3 text-[10px] font-bold text-cyan-300 bg-[#0c2733]/90 px-3 py-0.5 rounded-full border border-cyan-400/30 group-hover:bg-cyan-900/80 transition-colors flex items-center gap-1">
              <span>Click to Play</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
