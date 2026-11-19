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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090d16]/95 backdrop-blur-2xl border-t border-slate-800/90 safe-bottom before:absolute before:top-0 before:inset-x-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-pink-500/40 before:to-transparent shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around px-2 h-16">
        {/* Tab 1: All */}
        <button
          onClick={() => {
            onCategorySelect('All');
            const el = document.getElementById('catalogue');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all active:scale-90 cursor-pointer ${selectedCategory === 'All'
            ? 'text-pink-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <div className="h-7 flex items-center justify-center">
            <LayoutGrid
              className={`w-5 h-5 transition-all duration-200 ${selectedCategory === 'All'
                ? 'scale-110 stroke-[2.2] text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]'
                : 'stroke-[1.8]'
                }`}
            />
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">All</span>
        </button>

        {/* Tab 2: Arcade */}
        <button
          onClick={() => {
            onCategorySelect('Arcade');
            const el = document.getElementById('catalogue');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all active:scale-90 cursor-pointer ${selectedCategory === 'Arcade'
            ? 'text-pink-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <div className="h-7 flex items-center justify-center">
            <Gamepad2
              className={`w-5 h-5 transition-all duration-200 ${selectedCategory === 'Arcade'
                ? 'scale-110 stroke-[2.2] text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]'
                : 'stroke-[1.8]'
                }`}
            />
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">Arcade</span>
        </button>

        {/* Center: Quick Launch Flagship Jump Jelly Jump Button */}
        <Link
          href="/games/jelly-bounce"
          className="relative flex flex-col items-center justify-center flex-1 py-1.5 text-cyan-300 hover:text-white transition-all cursor-pointer group active:scale-90"
          aria-label="Play Jump Jelly Jump!"
        >
          <div className="h-7 flex items-center justify-center">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/40 border border-cyan-300/40 ring-2 ring-cyan-400/20 group-active:scale-95 transition-transform">
              <Gem className="w-4 h-4 text-white animate-pulse" />
            </div>
          </div>
          <span className="typo-button text-[10px] tracking-tight text-cyan-400 mt-1 leading-none font-semibold">
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
          className={`typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all active:scale-90 cursor-pointer ${selectedCategory === 'Puzzle'
            ? 'text-pink-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          <div className="h-7 flex items-center justify-center">
            <Puzzle
              className={`w-5 h-5 transition-all duration-200 ${selectedCategory === 'Puzzle'
                ? 'scale-110 stroke-[2.2] text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]'
                : 'stroke-[1.8]'
                }`}
            />
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">Puzzle</span>
        </button>

        {/* Tab 4: Menu */}
        <button
          onClick={onOpenMenu}
          className="typo-nav relative flex flex-col items-center justify-center flex-1 py-1.5 text-slate-400 hover:text-white transition-all active:scale-90 cursor-pointer"
          aria-label="Open side menu"
        >
          <div className="h-7 flex items-center justify-center">
            <Menu className="w-5 h-5 stroke-[1.8] text-slate-300" />
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none text-slate-300">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
