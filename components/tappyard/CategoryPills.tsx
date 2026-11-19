'use client';

import type { GameCategory } from '@/data/games';
import {
  LayoutGrid,
  Zap,
  Brain,
  Sparkles,
  Flame,
  type LucideIcon,
} from 'lucide-react';

interface CategoryPillsProps {
  categories: (GameCategory | 'All')[];
  selectedCategory: GameCategory | 'All';
  onSelect: (category: GameCategory | 'All') => void;
  gameCounts: Record<string, number>;
}

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelect,
  gameCounts,
}: CategoryPillsProps) {
  const getCategoryMeta = (
    cat: GameCategory | 'All'
  ): { label: string; mood: string; Icon: LucideIcon; accent: string } => {
    switch (cat) {
      case 'All':
        return {
          label: 'All Games',
          mood: 'Explore Everything',
          Icon: LayoutGrid,
          accent: 'from-pink-500/20 to-purple-500/20 text-pink-400',
        };
      case 'Arcade':
        return {
          label: 'Adrenaline Rush',
          mood: '3D Speed Runners',
          Icon: Zap,
          accent: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
        };
      case 'Puzzle':
        return {
          label: 'Train Your Brain',
          mood: 'Neon Sliding Tiles',
          Icon: Brain,
          accent: 'from-amber-500/20 to-orange-500/20 text-amber-400',
        };
      case 'Relaxing':
        return {
          label: 'Just Relax & Zen',
          mood: 'Soothing Block Grid',
          Icon: Sparkles,
          accent: 'from-teal-500/20 to-emerald-500/20 text-teal-400',
        };
      case 'Casual':
        return {
          label: '1-Tap Reflex',
          mood: 'Cyber Flight Runner',
          Icon: Flame,
          accent: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400',
        };
      default:
        return {
          label: cat,
          mood: 'Browser Games',
          Icon: LayoutGrid,
          accent: 'from-pink-500/20 to-purple-500/20 text-pink-400',
        };
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-2 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-2 select-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = gameCounts[cat] || 0;
          const { label, Icon, accent } = getCategoryMeta(cat);

          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`typo-nav inline-flex items-center gap-2 h-9 sm:h-11 px-3 sm:px-4 lg:rounded-xl rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${isSelected
                ? 'font-semibold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] scale-102 ring-2 ring-pink-400/40'
                : `bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80 hover:border-slate-700 bg-gradient-to-r ${accent}`
                }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 ${isSelected ? 'text-white scale-110' : 'text-current'
                  }`}
              />
              <span>{label}</span>
              <span
                className={`typo-label text-[10px] tracking-normal tabular-nums px-1.5 sm:px-2 py-0.5 rounded-full transition-colors ${isSelected
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-800/90 text-slate-300'
                  }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right side subtle shadow mask */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#090d16] to-transparent -me-3"
        aria-hidden="true"
      />
    </div>
  );
}
