'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { GameCategory } from '@/data/games';
import { GAMES_CATALOGUE } from '@/data/games';
import GameThumbnail from './GameThumbnail';
import {
  X,
  Gem,
  LayoutGrid,
  Gamepad2,
  Puzzle,
  Sparkles,
  Coffee,
  Play,
  Cloud,
  User,
} from 'lucide-react';
import BrandIcon from './BrandIcon';
import {
  signInWithGoogle,
  subscribeCloudAuth,
  getCloudAuthState,
} from '@/lib/cloudSync';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: GameCategory | 'All';
  onCategorySelect: (cat: GameCategory | 'All') => void;
  diamonds: number | null;
  onOpenAccountModal?: () => void;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onCategorySelect,
  diamonds,
  onOpenAccountModal,
}: MobileDrawerProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const loggedIn = localStorage.getItem('tappyard_logged_in') === 'true';
        setIsLoggedIn(loggedIn);
        const name = localStorage.getItem('tappyard_player_name');
        if (name && name !== 'Player') setUserName(name);
      } catch {
        // fallback
      }
    };
    syncAuth();

    const unsub = subscribeCloudAuth((auth) => {
      setIsLoggedIn(Boolean(auth.user));
      if (auth.user?.displayName) {
        setUserName(auth.user.displayName);
      }
    });
    return unsub;
  }, []);
  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories: { label: GameCategory | 'All'; name: string; Icon: typeof LayoutGrid }[] = [
    { label: 'All', name: 'All Games', Icon: LayoutGrid },
    { label: 'Arcade', name: 'Arcade 3D', Icon: Gamepad2 },
    { label: 'Puzzle', name: 'Brain & Puzzle', Icon: Puzzle },
    { label: 'Relaxing', name: 'Zen & Stress Relief', Icon: Sparkles },
    { label: 'Casual', name: '1-Tap Casual', Icon: Coffee },
  ];

  return (
    <>
      {/* Backdrop overlay (fade in/out) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      />

      {/* Slide-out drawer from RIGHT side */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-full max-w-[340px] bg-[#0a0f1d] border-l border-slate-800/90 flex flex-col transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-[#080d1a]">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-indigo-600 p-0.5 shadow-md shadow-pink-500/20">
              <div className="w-full h-full bg-[#0d1322] rounded-lg flex items-center justify-center p-1">
                <BrandIcon className="w-full h-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="typo-logo text-lg text-white flex items-center gap-0.5">
                TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
              </span>
            </div>
          </Link>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/50 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
          {/* Category Filter Navigation */}
          <div>
            <span className="typo-section-heading text-[10px] uppercase tracking-wider text-slate-400 px-1 mb-2 block">
              Browse Categories
            </span>
            <div className="space-y-2">
              {categories.map(({ label, name, Icon }) => {
                const isSelected = selectedCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      onCategorySelect(label);
                      onClose();
                      const el = document.getElementById('catalogue');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`typo-nav flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs transition-all active:scale-98 cursor-pointer ${isSelected
                      ? 'font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25 ring-1 ring-pink-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{name}</span>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Games Directory */}
          <div>
            <span className="typo-section-heading text-[10px] uppercase tracking-wider text-slate-400 px-1 mb-2 block">
              Instant Native Games
            </span>
            <div className="space-y-2">
              {GAMES_CATALOGUE.map((game) => (
                <Link
                  key={game.id}
                  href={game.route}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 hover:border-pink-500/40 hover:bg-slate-850 transition-all active:scale-95 group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950 relative">
                    <GameThumbnail id={game.thumbnail} title={game.title} variant="avatar" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="typo-game-title text-xs text-white truncate group-hover:text-pink-300 transition-colors">
                      {game.title}
                    </h4>
                    <span className="typo-meta text-[10px] text-slate-400 block mt-0.5">
                      {game.category} • {game.badge === 'NEW' ? 'NEW' : 'Original'}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-colors shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer: Google Login / Account */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#080d1a]">
          {!isLoggedIn ? (
            <div className="space-y-2">
              <button
                onClick={async () => {
                  setAuthBusy(true);
                  try {
                    await signInWithGoogle();
                  } finally {
                    setAuthBusy(false);
                  }
                }}
                disabled={authBusy}
                className="typo-button flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{authBusy ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
              {onOpenAccountModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAccountModal();
                  }}
                  className="w-full text-center text-[11px] text-slate-400 hover:text-pink-400 transition-colors py-0.5 cursor-pointer flex items-center justify-center gap-1"
                >
                  <User className="w-3 h-3" />
                  <span>Or view player profile & stats →</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAccountModal?.();
              }}
              className="flex items-center justify-between w-full p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {userName ? userName.charAt(0).toUpperCase() : 'P'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate group-hover:text-pink-300 transition-colors">
                    {userName || 'Player'}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Cloud className="w-2.5 h-2.5" />
                    <span>Cloud Synced</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors shrink-0">
                Profile →
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
