'use client';

import Link from 'next/link';
import type { GameCategory } from '@/data/games';
import { LayoutGrid, Gamepad2, Puzzle, Menu, Gem } from 'lucide-react';

interface MobileBottomNavProps {
  selectedCategory: GameCategory | 'All';
  onCategorySelect: (cat: GameCategory | 'All') => void;
  onOpenMenu?: () => void;
}

export default function MobileBottomNav({
  selectedCategory,
  onCategorySelect,
  onOpenMenu,
}: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090d16]/90 backdrop-blur-2xl border-t border-slate-800/90 safe-bottom relative before:absolute before:top-0 before:inset-x-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-pink-500/40 before:to-transparent shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around px-2 h-16">
        {/* Tab 1: All */}
        <button
          onClick={() => {
            onCategorySelect('All');
            const el = document.getElementById('catalogue');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all active:scale-90 cursor-pointer min-h-[48px] ${
            selectedCategory === 'All' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid
            className={`w-5 h-5 transition-transform duration-200 ${
              selectedCategory === 'All' ? 'scale-115 stroke-[2.5] text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[10px] tracking-tight mt-1">All</span>
          {selectedCategory === 'All' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#f472b6]" />
          )}
        </button>

        {/* Tab 2: Arcade */}
        <button
          onClick={() => {
            onCategorySelect('Arcade');
            const el = document.getElementById('catalogue');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all active:scale-90 cursor-pointer min-h-[48px] ${
            selectedCategory === 'Arcade' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2
            className={`w-5 h-5 transition-transform duration-200 ${
              selectedCategory === 'Arcade' ? 'scale-115 stroke-[2.5] text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[10px] tracking-tight mt-1">Arcade</span>
          {selectedCategory === 'Arcade' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#f472b6]" />
          )}
        </button>

        {/* Center: Floating Quick Launch Flagship Jump Jelly Jump Button */}
        <Link
          href="/games/jelly-bounce"
          className="flex flex-col items-center justify-center flex-1 py-1 text-cyan-300 hover:text-white transition-all cursor-pointer group active:scale-90 min-h-[48px] -translate-y-1.5"
          aria-label="Play Jump Jelly Jump!"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 border border-cyan-300/40 group-active:scale-95 transition-transform ring-2 ring-cyan-400/20">
            <Gem className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="typo-button text-[10px] tracking-tight text-cyan-400 mt-0.5">
            Jelly 3D
          </span>
        </Link>

        {/* Tab 3: Puzzle */}
        <button
          onClick={() => {
            onCategorySelect('Puzzle');
            const el = document.getElementById('catalogue');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all active:scale-90 cursor-pointer min-h-[48px] ${
            selectedCategory === 'Puzzle' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Puzzle
            className={`w-5 h-5 transition-transform duration-200 ${
              selectedCategory === 'Puzzle' ? 'scale-115 stroke-[2.5] text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[10px] tracking-tight mt-1">Puzzle</span>
          {selectedCategory === 'Puzzle' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#f472b6]" />
          )}
        </button>

        {/* Tab 4: Menu (Slide out drawer from right) */}
        <button
          onClick={onOpenMenu}
          className="typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90 cursor-pointer min-h-[48px]"
          aria-label="Open side menu"
        >
          <Menu className="w-5 h-5 stroke-[1.8] text-slate-300" />
          <span className="text-[10px] tracking-tight mt-1 text-slate-300">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
