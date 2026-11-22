'use client';

import { useState, useEffect } from 'react';
import { Gem, Trophy, Zap, Pause } from 'lucide-react';

interface GameHUDProps {
  distance: number;
  bestDistance: number;
  diamonds: number;
  totalDiamonds: number;
  streak: number;
  isBoosting: boolean;
  theme: string;
  onPause: () => void;
}

export default function GameHUD({
  distance,
  bestDistance,
  totalDiamonds,
  streak,
  isBoosting,
  theme,
  onPause,
}: GameHUDProps) {
  const [showTutorial, setShowTutorial] = useState(true);
  const [diamondBounce, setDiamondBounce] = useState(false);
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);
  const [lastMilestone, setLastMilestone] = useState(0);

  // Auto-hide tutorial once distance starts increasing
  useEffect(() => {
    if (distance > 30 && showTutorial) {
      setShowTutorial(false);
    }
  }, [distance, showTutorial]);

  // Diamond pickup bounce effect
  useEffect(() => {
    if (totalDiamonds > 0) {
      setDiamondBounce(true);
      const timer = setTimeout(() => setDiamondBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalDiamonds]);

  // Milestone toast celebration
  useEffect(() => {
    const milestones = [100, 250, 500, 750, 1000, 1500, 2000];
    for (const m of milestones) {
      if (distance >= m && lastMilestone < m) {
        setLastMilestone(m);
        setMilestoneToast(`★ ${m}m REACHED! ★`);
        const timer = setTimeout(() => setMilestoneToast(null), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [distance, lastMilestone]);

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none pt-2.5 sm:pt-6 px-3 sm:px-6 safe-top select-none">
      {/* Top Bar HUD */}
      <div className="flex items-start justify-between max-w-4xl mx-auto">
        {/* Top-Left: Cyan Diamond Balance Pill with juicy bounce */}
        <div
          className={`flex items-center gap-1.5 sm:gap-2 bg-[#0c2733]/90 backdrop-blur-md rounded-xl sm:rounded-2xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 border border-cyan-500/40 shadow-lg shadow-cyan-950/40 transition-transform duration-200 ${
            diamondBounce ? 'scale-125 border-cyan-300 shadow-cyan-400/50' : 'scale-100'
          }`}
        >
          <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <span className="text-white font-black text-xs sm:text-sm tracking-wide">
            {totalDiamonds}
          </span>
        </div>

        {/* Top-Center: Distance in Meters with chevron mark & streak */}
        <div className="flex flex-col items-center drop-shadow-lg">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {distance}
            </span>
            <span className="text-xs sm:text-sm font-black text-cyan-300 uppercase">
              m
            </span>
          </div>

          {/* Underline bar with indicator */}
          <div className="flex items-center gap-1 mt-1">
            <div className="w-8 h-1 rounded-full bg-cyan-400/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="w-8 h-1 rounded-full bg-cyan-400/80" />
          </div>

          {/* Current Canyon Theme badge */}
          <span className="text-[10px] font-bold text-slate-300/80 uppercase tracking-widest mt-1">
            {theme}
          </span>

          {/* Active Booster Streak with dopamine flair */}
          {isBoosting && (
            <div className="mt-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 text-white font-black text-xs shadow-xl shadow-pink-500/30 animate-bounce-in border border-white/60 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>BOOST {streak > 1 ? `x${streak}` : ''}!</span>
            </div>
          )}
        </div>

        {/* Top-Right: Pause button & Best Record */}
        <div className="flex items-center gap-2">
          {bestDistance > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-[#0c2733]/80 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-slate-700/60 text-xs text-amber-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{bestDistance}m</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPause();
            }}
            className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#0c2733]/90 hover:bg-[#133c4e] backdrop-blur-md
              flex items-center justify-center transition-all active:scale-90 border border-cyan-500/30 shadow-lg shadow-cyan-950/40 cursor-pointer"
            aria-label="Pause"
          >
            <Pause className="w-4 h-4 fill-white text-white" />
          </button>
        </div>
      </div>

      {/* Celebratory Milestone Toast Banner (Compact & Elevated so track is 100% visible) */}
      {milestoneToast && (
        <div className="flex justify-center mt-1 pointer-events-none animate-fadeInDown">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/95 to-yellow-400/95 backdrop-blur-md border border-white/60 shadow-xl text-slate-950 font-black text-[11px] tracking-wider uppercase">
            {milestoneToast}
          </div>
        </div>
      )}

      {/* Floating Beginner Steering Tutorial Prompt */}
      {showTutorial && distance < 25 && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <div className="px-4 py-2 rounded-full bg-[#081720]/80 backdrop-blur-md border border-cyan-400/30 text-cyan-200 text-xs font-semibold animate-pulse shadow-lg flex items-center gap-2">
            <span>⇄</span>
            <span>Slide thumb or mouse to steer jelly</span>
          </div>
        </div>
      )}
    </div>
  );
}
