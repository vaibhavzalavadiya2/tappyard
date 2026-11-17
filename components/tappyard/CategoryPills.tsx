'use client';

import type { GameCategory } from '@/data/games';
import {
  LayoutGrid,
  Gamepad2,
  Puzzle,
  Sparkles,
  Coffee,
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
  const getCategoryIcon = (cat: GameCategory | 'All'): LucideIcon => {
    switch (cat) {
      case 'All':
        return LayoutGrid;
      case 'Arcade':
        return Gamepad2;
      case 'Puzzle':
        return Puzzle;
      case 'Relaxing':
        return Sparkles;
      case 'Casual':
        return Coffee;
      default:
        return Gamepad2;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 select-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = gameCounts[cat] || 0;
        const IconComponent = getCategoryIcon(cat);

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`inline-flex items-center gap-2 h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] scale-102 ring-2 ring-pink-400/40'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <IconComponent
              className={`w-4 h-4 transition-transform duration-200 ${
                isSelected ? 'text-white scale-110' : 'text-slate-400'
              }`}
            />
            <span>{cat}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                isSelected
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-800/90 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
