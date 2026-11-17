'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { GameCategory } from '@/data/games';
import { Search, X, Menu, Gem, User } from 'lucide-react';
import { subscribeWallet } from '@/lib/wallet';
import MobileDrawer from './MobileDrawer';
import AccountModal from './AccountModal';
import BrandIcon from './BrandIcon';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: GameCategory | 'All';
  onCategorySelect: (cat: GameCategory | 'All') => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  mobileMenuOpen: controlledOpen,
  onToggleMobileMenu,
}: NavbarProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [diamonds, setDiamonds] = useState<number | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [playerName, setPlayerName] = useState<string>('Guest');

  const isMenuOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const toggleMenu = onToggleMobileMenu || (() => setInternalOpen(!internalOpen));
  const closeMenu = () => {
    if (onToggleMobileMenu && controlledOpen) {
      onToggleMobileMenu();
    } else {
      setInternalOpen(false);
    }
  };

  useEffect(() => {
    try {
      const unsub = subscribeWallet((d) => setDiamonds(d));
      const saved = localStorage.getItem('tappyard_player_name');
      if (saved) setPlayerName(saved);
      return () => unsub();
    } catch {
      // fallback
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#090d16]/85 backdrop-blur-2xl border-b border-slate-800/80 transition-colors relative after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-pink-500/40 after:to-transparent">
        {/* Full-width container */}
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-pink-500/20 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#0d1322] rounded-[10px] sm:rounded-[14px] flex items-center justify-center p-1.5">
                  <BrandIcon className="w-full h-full group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
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
            <div className="flex-1 max-w-lg hidden md:block">
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

            {/* Desktop Right Links: Diamonds + Account / Login */}
            <div className="hidden lg:flex items-center gap-3">
              {diamonds !== null && (
                <button
                  onClick={() => setAccountModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="View Diamonds Wallet"
                >
                  <Gem className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>{diamonds}</span>
                  <span className="text-[10px] text-cyan-400/70 font-normal">💎</span>
                </button>
              )}

              {/* Account / Login Pill Button (CrazyGames & now.gg style) */}
              <button
                onClick={() => setAccountModalOpen(true)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-black text-white bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-pink-500/60 shadow-md hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                aria-label="Open Account & Profile"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="group-hover:text-pink-300 transition-colors">
                  {playerName !== 'Guest' ? playerName : 'Log In / Account'}
                </span>
              </button>
            </div>

            {/* Mobile Right Controls: Profile Avatar + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setAccountModalOpen(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                aria-label="Open Profile"
              >
                <Gem className="w-3.5 h-3.5 text-cyan-400" />
                {diamonds !== null && (
                  <span className="text-xs font-black">{diamonds}</span>
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none active:scale-95 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center hover:border-pink-500/40"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5 text-slate-200" />
              </button>
            </div>
          </div>

          {/* Mobile Search input */}
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

        </div>
      </header>

      {/* Slide-out drawer from RIGHT side */}
      <MobileDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        diamonds={diamonds}
      />

      {/* Player Account & Profile Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
}
