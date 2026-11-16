'use client';

import Link from 'next/link';
import type { GameCategory } from '@/data/games';
import { LayoutGrid, Gamepad2, Puzzle, Sparkles, Gem } from 'lucide-react';

interface MobileBottomNavProps {
  selectedCategory: GameCategory | 'All';
  onCategorySelect: (cat: GameCategory | 'All') => void;
}

export default function MobileBottomNav({
  selectedCategory,
  onCategorySelect,
}: MobileBottomNavProps) {
  const navItems = [
    { label: 'All', cat: 'All' as const, Icon: LayoutGrid },
    { label: 'Arcade', cat: 'Arcade' as const, Icon: Gamepad2 },
    { label: 'Puzzle', cat: 'Puzzle' as const, Icon: Puzzle },
    { label: 'Relaxing', cat: 'Relaxing' as const, Icon: Sparkles },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800/90 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1.5 h-14">
        {navItems.map((item) => {
          const isActive = selectedCategory === item.cat;
          const Icon = item.Icon;
          return (
            <button
              key={item.cat}
              onClick={() => {
                onCategorySelect(item.cat);
                const el = document.getElementById('catalogue');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-pink-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick Launch Flagship Jump Jelly Jump */}
        <Link
          href="/games/jelly-bounce"
          className="flex flex-col items-center justify-center flex-1 py-1 text-cyan-300 hover:text-white transition-all cursor-pointer group"
          aria-label="Play Jump Jelly Jump!"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30 group-active:scale-90 transition-transform">
            <Gem className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold tracking-tight text-cyan-400 mt-0.5">
            Jelly 3D
          </span>
        </Link>
      </div>
    </nav>
  );
}
