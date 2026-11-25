'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  GAMES_CATALOGUE,
  searchGames,
  type GameCategory,
} from '@/data/games';
import { Search, X, Menu, Gem, User, Flame, Play, Sparkles } from 'lucide-react';
import { subscribeWallet } from '@/lib/wallet';
import { PROFILE_SYNCED_EVENT } from '@/lib/syncEvents';
import MobileDrawer from './MobileDrawer';
import BrandIcon from './BrandIcon';
import GameThumbnail from './GameThumbnail';

const AccountModal = dynamic(() => import('./AccountModal'), { ssr: false });

const TRENDING_TAGS = [
  { label: '2048', query: '2048' },
  { label: '3D Runner', query: '3D Runner' },
  { label: 'Block Blast', query: 'Block' },
  { label: 'Cyber Dash', query: 'Cyber' },
  { label: 'Arcade', query: 'Arcade' },
  { label: 'Relaxing', query: 'Relaxing' },
];

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
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [playerName, setPlayerName] = useState<string>('Guest');
  const [isCloudLoggedIn, setIsCloudLoggedIn] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

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
    const syncNavbarProfile = () => {
      try {
        const today = new Date().toDateString();
        const lastClaim = localStorage.getItem('tappyard_last_daily_claim');
        setCanClaimDaily(lastClaim !== today);

        const saved = localStorage.getItem('tappyard_player_name');
        setPlayerName(saved && saved.trim() ? saved.trim() : 'Guest');
        setIsCloudLoggedIn(localStorage.getItem('tappyard_logged_in') === 'true');
      } catch {
        // fallback
      }
    };

    syncNavbarProfile();
    const unsub = subscribeWallet((d) => setDiamonds(d));
    window.addEventListener(PROFILE_SYNCED_EVENT, syncNavbarProfile);

    return () => {
      unsub();
      window.removeEventListener(PROFILE_SYNCED_EVENT, syncNavbarProfile);
    };
  }, []);

  // Global keyboard shortcuts: '/' to focus search, 'Escape' to blur/close (Desktop only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchFocused(false);
      } else if (e.key === '/' && !searchFocused) {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        e.preventDefault();
        desktopInputRef.current?.focus();
        setSearchFocused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused]);

  // Click outside to dismiss desktop search popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktop = desktopSearchRef.current?.contains(target);
      if (!inDesktop) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant search matches
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return GAMES_CATALOGUE;
    return searchGames(searchQuery, 'All');
  }, [searchQuery]);

  // Search Popover Card
  const renderSearchDropdown = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1322]/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 p-3 sm:p-4 z-50 flex flex-col gap-3 animate-fadeInUp">
      {/* Trending Tags Row */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-pink-400 font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" />
          <span>Trending Searches</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag.label}
              onMouseDown={(e) => {
                e.preventDefault();
                onSearchChange(tag.query);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${searchQuery.toLowerCase() === tag.query.toLowerCase()
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-slate-800" />

      {/* Instant Results */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
          <span>
            {searchQuery.trim()
              ? `Matching Games (${searchResults.length})`
              : 'Popular Games (Instant Play)'}
          </span>
          {searchQuery && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                onSearchChange('');
              }}
              className="text-pink-400 hover:text-pink-300 cursor-pointer text-[10px]"
            >
              Clear
            </button>
          )}
        </div>

        {searchResults.length > 0 ? (
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
            {searchResults.map((game) => (
              <Link
                key={game.id}
                href={game.route}
                onClick={() => setSearchFocused(false)}
                className="group flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-pink-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-700/80">
                    <GameThumbnail
                      id={game.id}
                      title={game.title}
                      variant="avatar"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white group-hover:text-pink-300 transition-colors truncate">
                      {game.title}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="text-purple-300 font-medium">{game.category}</span>
                      <span>•</span>
                      <span>{game.badge || 'Instant Play'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-pink-400 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  <span className="hidden sm:inline text-[11px]">Play</span>
                  <Play className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-slate-400">
            No games found matching &ldquo;{searchQuery}&rdquo;. Try another tag!
          </div>
        )}
      </div>

      {/* Keyboard Footer Hint on Desktop */}
      <div className="hidden sm:flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
        <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Esc</kbd> to close</span>
        <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">/</kbd> to quick search</span>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#090d16]/85 backdrop-blur-2xl border-b border-slate-800/80 transition-colors relative after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-pink-500/40 after:to-transparent">
        <div className="container xl:px-5 px-4">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-pink-500/20 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#0d1322] rounded-[6px] sm:rounded-[12px] flex items-center justify-center p-1.5">
                  <BrandIcon className="w-full h-full group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="typo-logo text-xl sm:text-2xl text-white flex items-center gap-0.5">
                  TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">YARD</span>
                </span>
                <span className="typo-label text-[10px] tracking-widest text-slate-400 uppercase -mt-1 hidden sm:block">
                  Instant Browser Games
                </span>
              </div>
            </Link>

            {/* Search bar - Desktop & Tablet */}
            <div ref={desktopSearchRef} className="flex-1 max-w-lg hidden md:block relative">
              <div className="relative group/search">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/search:text-pink-400 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  ref={desktopInputRef}
                  type="text"
                  placeholder="Search games, tags, categories... (Press /)"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setSearchFocused(true);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-slate-700 text-sm text-slate-100 placeholder-slate-500 !outline-none !ring-0 !shadow-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      onSearchChange('');
                      desktopInputRef.current?.focus();
                    }}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchFocused && renderSearchDropdown()}
            </div>

            {/* Desktop Right Links: Diamonds + Account / Login */}
            <div className="hidden md:flex items-center gap-3">
              {canClaimDaily && (
                <button
                  onClick={() => setAccountModalOpen(true)}
                  className="typo-button flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/50 text-amber-300 text-xs font-bold animate-pulse shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Claim Daily Diamond Reward"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daily Gift</span>
                </button>
              )}

              <button
                onClick={() => setAccountModalOpen(true)}
                className="typo-button flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 text-xs tabular-nums shadow-xs transition-all active:scale-95 cursor-pointer"
                title="View Diamonds Wallet"
              >
                <Gem className="w-3.5 h-3.5 text-cyan-400" />
                <span>{diamonds !== null ? diamonds : 10}</span>
                <span className="text-[10px] text-cyan-400/70 font-normal">💎</span>
              </button>

              {/* Account / Login Pill Button (CrazyGames & now.gg style) */}
              <button
                onClick={() => setAccountModalOpen(true)}
                className="typo-button flex items-center gap-2.5 px-4 py-2 rounded-full text-xs text-white bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-pink-500/60 shadow-md hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                aria-label="Open Account & Profile"
              >
                <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-semibold shadow-sm">
                  <User className="w-3.5 h-3.5 text-white" />
                  {isCloudLoggedIn && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#090d16]"
                      title="Cloud Synced"
                    />
                  )}
                </div>
                <span className="group-hover:text-pink-300 transition-colors">
                  {playerName !== 'Guest' && playerName !== 'Player' ? playerName : isCloudLoggedIn ? 'Cloud Player' : 'Player Profile'}
                </span>
              </button>
            </div>

            {/* Mobile Right Controls: Diamond Wallet + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setAccountModalOpen(true)}
                className="relative h-10 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                aria-label="Open Profile & Wallet"
              >
                <Gem className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="typo-button text-xs tabular-nums min-w-[14px]">
                  {diamonds !== null ? diamonds : 10}
                </span>
                {canClaimDaily && (
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping"
                    title="Daily Gift Available"
                  />
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none active:scale-95 transition-all cursor-pointer flex items-center justify-center hover:border-pink-500/40"
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
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 focus:border-slate-700 text-sm text-slate-100 placeholder-slate-500 !outline-none !ring-0 !shadow-none transition-colors"
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

      {/* Player Account & Profile Modal (lazy-loaded on open to keep homepage bundle tiny) */}
      {accountModalOpen && (
        <AccountModal
          isOpen={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
        />
      )}
    </>
  );
}
