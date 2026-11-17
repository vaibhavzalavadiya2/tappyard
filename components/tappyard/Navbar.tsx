'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { GameCategory } from '@/data/games';
import { Gamepad2, Search, X, Menu, Gem, Sparkles } from 'lucide-react';
import { getWalletDiamonds, subscribeWallet } from '@/lib/wallet';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: GameCategory | 'All';
  onCategorySelect: (cat: GameCategory | 'All') => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [diamonds, setDiamonds] = useState<number | null>(null);

  useEffect(() => {
    try {
      const unsub = subscribeWallet((d) => setDiamonds(d));
      return () => unsub();
    } catch {
      // fallback
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/80 backdrop-blur-2xl border-b border-slate-800/80 transition-colors relative after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-pink-500/40 after:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-pink-500/20 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                TAP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">YARD</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase -mt-1 hidden sm:block">
                Instant Browser Games
              </span>
            </div>
          </Link>

          {/* Search bar - Desktop & Tablet */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group/search">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/search:text-pink-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search games, tags, categories..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 focus:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Right Links */}
          <div className="hidden lg:flex items-center gap-3">
            {diamonds !== null && diamonds > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-black shadow-xs">
                <Gem className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{diamonds}</span>
              </div>
            )}

            <Link
              href="/games/jelly-bounce"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 shadow-md shadow-pink-500/25 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all border border-pink-400/30"
            >
              <Sparkles className="w-4 h-4 text-pink-200 animate-spin-slow" />
              <span>Play Jump Jelly Jump!</span>
            </Link>
          </div>

          {/* Mobile Right Controls: Diamond badge + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {diamonds !== null && diamonds > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[11px] font-black">
                <Gem className="w-3 h-3 text-cyan-400" />
                <span>{diamonds}</span>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none active:scale-95 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-pink-400" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search input when visible */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search games, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer min-w-[36px] min-h-[36px] justify-center"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="pb-4 pt-2 md:hidden border-t border-slate-800/80 animate-slide-up space-y-3">
            <div className="flex flex-wrap gap-2 pt-1">
              {(['All', 'Arcade', 'Puzzle', 'Relaxing', 'Casual'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategorySelect(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25 ring-1 ring-pink-400/40'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="pt-1">
              <Link
                href="/games/jelly-bounce"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <Gem className="w-4 h-4 text-cyan-200" />
                <span>Play Jump Jelly Jump! (3D Runner)</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
