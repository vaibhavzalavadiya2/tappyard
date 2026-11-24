'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { loadProgress, type GameProgress } from '@/game/progress';
import { GAME_CONFIG } from '@/game/config';
import { GAMES_CATALOGUE, type GameItem } from '@/data/games';
import GameThumbnail from './GameThumbnail';
import {
  Star,
  Gem,
  Zap,
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ShieldCheck,
} from 'lucide-react';

export default function HeroFeatured() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const isHorizontalDrag = useRef<boolean | null>(null);
  const hasDragged = useRef(false);
  const latestOffset = useRef(0);

  const featuredGames = GAMES_CATALOGUE;
  const currentGame: GameItem = featuredGames[currentIndex] || featuredGames[0];

  useEffect(() => {
    try {
      const p = loadProgress();
      setProgress(p);
    } catch {
      // Ignore
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
  }, [featuredGames.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  }, [featuredGames.length]);

  // Auto-rotation every 9 seconds when not paused or dragging (resets on manual slide change)
  useEffect(() => {
    if (isPaused || isDragging) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 9000);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, currentIndex, nextSlide]);

  // Unified mouse + touch drag slider support
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;

    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    isHorizontalDrag.current = null;
    hasDragged.current = false;
    latestOffset.current = 0;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (dragStartX.current === null || dragStartY.current === null) return;

      const dx = e.clientX - dragStartX.current;
      const dy = e.clientY - dragStartY.current;

      // Determine gesture direction once movement exceeds a tiny deadzone
      if (isHorizontalDrag.current === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        isHorizontalDrag.current = Math.abs(dx) >= Math.abs(dy);
      }

      if (!isHorizontalDrag.current) return;

      if (Math.abs(dx) > 8) {
        hasDragged.current = true;
      }

      // Smooth damped drag preview clamped to ±120px
      const damped = Math.max(-120, Math.min(120, dx * 0.65));
      latestOffset.current = dx;
      setDragOffset(damped);
    };

    const finishDrag = () => {
      const dx = latestOffset.current;
      if (isHorizontalDrag.current && Math.abs(dx) > 45) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }

      dragStartX.current = null;
      dragStartY.current = null;
      isHorizontalDrag.current = null;
      latestOffset.current = 0;
      setDragOffset(0);
      setIsDragging(false);

      // Clear click-suppression flag right after any trailing click event fires
      if (hasDragged.current) {
        setTimeout(() => {
          hasDragged.current = false;
        }, 0);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [isDragging, nextSlide, prevSlide]);

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  };

  // Jelly character custom skin colors
  const activeSkin =
    GAME_CONFIG.JELLY_SKINS.find((s) => s.id === progress?.selectedSkin) ||
    GAME_CONFIG.JELLY_SKINS[0];
  const activeTopHex = '#' + activeSkin.topColor.toString(16).padStart(6, '0');
  const activeFaceHex = '#' + activeSkin.color.toString(16).padStart(6, '0');
  const activeSideHex = '#' + activeSkin.sideColor.toString(16).padStart(6, '0');
  const activeEyeHex = '#' + activeSkin.eyeColor.toString(16).padStart(6, '0');

  // Dynamic theme styling per game
  const getTheme = (id: string) => {
    switch (id) {
      case 'jelly-bounce':
        return {
          bg: 'from-[#061824] via-[#0a2333] to-[#041018]',
          border: 'border-cyan-500/40',
          glow1: 'bg-cyan-500/25',
          glow2: 'bg-blue-600/20',
          btn: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-cyan-500/40 hover:shadow-cyan-500/60',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          tag: 'FLAGSHIP 3D SPEED RUNNER',
          pillActive: 'bg-cyan-500/30 text-cyan-200 border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.4)]',
        };
      case '2048-puzzle':
        return {
          bg: 'from-[#201303] via-[#2c1a06] to-[#120a02]',
          border: 'border-amber-500/40',
          glow1: 'bg-amber-500/25',
          glow2: 'bg-orange-600/20',
          btn: 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 shadow-amber-500/40 hover:shadow-amber-500/60',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          tag: 'BRAIN & MATH SLIDING TILES',
          pillActive: 'bg-amber-500/30 text-amber-200 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
        };
      case 'cupcake-2048':
        return {
          bg: 'from-[#220c2b] via-[#2f113b] to-[#16061c]',
          border: 'border-pink-500/40',
          glow1: 'bg-pink-500/25',
          glow2: 'bg-rose-600/20',
          btn: 'bg-gradient-to-r from-pink-400 via-rose-500 to-amber-400 shadow-pink-500/40 hover:shadow-pink-500/60',
          badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
          tag: 'VIRAL DESSERT MERGE PUZZLE',
          pillActive: 'bg-pink-500/30 text-pink-200 border-pink-400/50 shadow-[0_0_12px_rgba(236,72,153,0.4)]',
        };
      case 'color-zen':
        return {
          bg: 'from-[#031818] via-[#072a29] to-[#021313]',
          border: 'border-teal-500/40',
          glow1: 'bg-teal-500/25',
          glow2: 'bg-emerald-600/20',
          btn: 'bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-600 shadow-teal-500/40 hover:shadow-teal-500/60',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          tag: 'RELAXING 10x10 SPATIAL ZEN',
          pillActive: 'bg-teal-500/30 text-teal-200 border-teal-400/50 shadow-[0_0_12px_rgba(20,184,166,0.4)]',
        };
      case 'quick-tap':
      default:
        return {
          bg: 'from-[#190628] via-[#270a3c] to-[#11031c]',
          border: 'border-purple-500/40',
          glow1: 'bg-purple-500/25',
          glow2: 'bg-fuchsia-600/20',
          btn: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-purple-500/40 hover:shadow-purple-500/60',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          tag: '1-TAP NEON REFLEX RUNNER',
          pillActive: 'bg-purple-500/30 text-purple-200 border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
        };
    }
  };

  const theme = getTheme(currentGame.id);

  const dragSlideStyle = {
    transform: dragOffset ? `translateX(${dragOffset}px)` : undefined,
  };

  return (
    <div className="container xl:px-5 px-4">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className={`group/hero relative overflow-hidden rounded-xl bg-gradient-to-br ${theme.bg} border ${theme.border} shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-10 transition-colors duration-700 w-full sm:min-h-[420px] lg:min-h-[440px] select-none touch-pan-y ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
      >
        {/* Dynamic Background Light Spheres */}
        <div
          className={`absolute -top-32 -left-32 w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full ${theme.glow1} blur-3xl pointer-events-none transition-colors duration-700`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full ${theme.glow2} blur-3xl pointer-events-none transition-colors duration-700`}
        />

        {/* Cyber Grid Texture Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Slide Navigation Arrows (Desktop — revealed on hover / keyboard focus) */}
        <button
          type="button"
          onClick={prevSlide}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/85 border border-white/20 items-center justify-center text-white shadow-xl backdrop-blur-md cursor-pointer opacity-0 -translate-x-2 pointer-events-none group-hover/hero:opacity-100 group-hover/hero:translate-x-0 group-hover/hero:pointer-events-auto focus-visible:opacity-100 focus-visible:translate-x-0 focus-visible:pointer-events-auto hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Previous game"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/85 border border-white/20 items-center justify-center text-white shadow-xl backdrop-blur-md cursor-pointer opacity-0 translate-x-2 pointer-events-none group-hover/hero:opacity-100 group-hover/hero:translate-x-0 group-hover/hero:pointer-events-auto focus-visible:opacity-100 focus-visible:translate-x-0 focus-visible:pointer-events-auto hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Next game"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* --- MOBILE COMPACT VIEW (< lg) --- */}
        <div
          style={dragSlideStyle}
          className={`flex flex-col gap-3 lg:hidden relative z-10 ${isDragging ? 'transition-none' : 'transition-transform duration-300 ease-out'
            }`}
        >
          {/* Top Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`typo-label inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase ${theme.badge}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                {theme.tag}
              </span>
              <span className="typo-label px-2 py-0.5 rounded-full text-[10px] tracking-normal bg-slate-800 text-slate-300 border border-slate-700">
                {currentGame.category}
              </span>
            </div>
            <span className="typo-button text-xs text-amber-400 tabular-nums flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentGame.rating.toFixed(1)}</span>
            </span>
          </div>

          {/* Title + Interactive Preview Side-by-Side */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="typo-h1 text-xl sm:text-2xl text-white leading-tight">
                {currentGame.title}
              </h2>
              <p className="typo-body text-slate-300 text-xs mt-1 leading-snug line-clamp-2">
                {currentGame.description}
              </p>
            </div>

            {/* Compact animated thumbnail */}
            <Link
              href={currentGame.route}
              className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border border-white/25 shadow-xl active:scale-95 transition-transform relative bg-slate-950"
              aria-label={`Play ${currentGame.title}`}
            >
              {currentGame.id === 'jelly-bounce' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <div className="w-12 h-12 animate-bounce-slow">
                    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
                      <polygon points="40,14 66,24 40,34 14,24" fill={activeTopHex} />
                      <polygon points="14,24 40,34 40,64 14,54" fill={activeFaceHex} />
                      <polygon points="40,34 66,24 66,54 40,64" fill={activeSideHex} />
                      <ellipse cx="32" cy="44" rx="7" ry="7" fill="white" />
                      <ellipse cx="33" cy="44" rx="4" ry="4" fill={activeEyeHex} />
                      <ellipse cx="31.5" cy="42" rx="1.5" ry="1.5" fill="white" />
                    </svg>
                  </div>
                </div>
              ) : (
                <GameThumbnail id={currentGame.thumbnail} title={currentGame.title} />
              )}
            </Link>
          </div>

          {/* Big PLAY NOW Button */}
          <Link
            href={currentGame.route}
            className={`typo-button group relative flex items-center justify-center gap-2 h-12 w-full rounded-xl text-white text-sm tracking-wide shadow-lg transition-all duration-150 active:scale-95 cursor-pointer border border-white/20 ${theme.btn}`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>PLAY NOW</span>
            <span className="text-[11px] text-white/80 font-normal">• Free Instant Game</span>
          </Link>

          {/* Carousel indicators (dots) */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {featuredGames.map((game, idx) => (
              <button
                key={game.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? 'w-6 bg-white shadow-[0_0_8px_#ffffff]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                aria-label={`Show ${game.title}`}
              />
            ))}
          </div>
        </div>

        {/* --- DESKTOP EXPANSIVE CINEMATIC VIEW (lg+) --- */}
        <div
          style={dragSlideStyle}
          className={`hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 items-center relative z-10 ${isDragging ? 'transition-none' : 'transition-transform duration-300 ease-out'
            }`}
        >
          {/* Left Column: Game Title, High-Impact Badges & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            {/* Top Status & Intent Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`typo-label inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${theme.badge}`}
              >
                <Flame className="w-3.5 h-3.5 text-current animate-pulse" />
                {theme.tag}
              </span>
              <span className="typo-label px-3 py-1 rounded-full text-xs tracking-normal bg-slate-900/90 text-slate-200 border border-slate-700">
                {currentGame.category}
              </span>
              <span className="typo-button text-xs text-amber-400 tabular-nums flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
                <span>{currentGame.rating.toFixed(1)}</span>
                <span className="typo-meta text-slate-400">({currentGame.playsCount} plays)</span>
              </span>
            </div>

            {/* Large Hero Title */}
            <h2 className="typo-h1 text-4xl xl:text-5xl 2xl:text-6xl text-white drop-shadow-lg">
              {currentGame.title}
            </h2>

            {/* Description */}
            <p className="typo-body text-slate-200 text-sm xl:text-base max-w-2xl">
              {currentGame.description}
            </p>

            {/* Key Value Micro-Pills */}
            <div className="typo-label flex items-center gap-2.5 text-xs tracking-normal text-slate-300 flex-wrap">
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Instant 60fps WebGL
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Free & Unblocked
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                Zero App Store Installs
              </span>
            </div>

            {/* Action Row: Big PLAY NOW CTA + Direct Carousel Tabs */}
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <Link
                href={currentGame.route}
                className={`typo-button group relative inline-flex items-center justify-center gap-3 h-14 px-8 rounded-2xl text-white text-base tracking-wide shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/30 ${theme.btn}`}
              >
                <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>PLAY NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              {/* Quick Game Switcher Tabs */}
              <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                {featuredGames.map((game, idx) => (
                  <button
                    key={game.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`typo-nav px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${idx === currentIndex
                      ? `font-semibold ${theme.pillActive}`
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {game.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Holographic 3D Interactive Stage */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <Link
              href={currentGame.route}
              className="group relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-white/20 p-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/40 cursor-pointer bg-slate-950/70"
              aria-label={`Play ${currentGame.title}`}
            >
              {/* Ambient Lighting reflections */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/10 pointer-events-none z-[1]" />

              {currentGame.id === 'jelly-bounce' ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center z-[2]">
                  <div className="absolute bottom-6 w-52 h-6 rounded-full bg-cyan-950/80 shadow-lg border-t border-cyan-400/50" />
                  <div className="absolute top-2 right-4 text-cyan-300 text-sm font-black animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                    <Gem className="w-5 h-5 text-cyan-300 fill-cyan-400/30" />
                  </div>
                  <div className="relative w-44 h-44 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 drop-shadow-[0_16px_32px_rgba(0,240,255,0.35)]">
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <polygon points="40,14 66,24 40,34 14,24" fill={activeTopHex} />
                      <polygon points="14,24 40,34 40,64 14,54" fill={activeFaceHex} />
                      <polygon points="40,34 66,24 66,54 40,64" fill={activeSideHex} />
                      <ellipse cx="32" cy="44" rx="7" ry="7" fill="white" />
                      <ellipse cx="33" cy="44" rx="4" ry="4" fill={activeEyeHex} />
                      <ellipse cx="31.5" cy="42" rx="1.5" ry="1.5" fill="white" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 z-[2]">
                  <GameThumbnail id={currentGame.thumbnail} title={currentGame.title} />
                </div>
              )}

              {/* Launch Pill Overlay */}
              <div className="typo-button absolute bottom-4 z-10 text-xs text-white bg-slate-900/90 px-4 py-2 rounded-full border border-white/20 group-hover:bg-pink-500 group-hover:border-pink-400 transition-colors flex items-center gap-1.5 shadow-xl">
                <span>Instant Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
