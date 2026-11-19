'use client';

import Link from 'next/link';
import { useEffect } from 'react';
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
  ArrowRight,
  Zap,
  HelpCircle,
} from 'lucide-react';
import BrandIcon from './BrandIcon';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: GameCategory | 'All';
  onCategorySelect: (cat: GameCategory | 'All') => void;
  diamonds: number | null;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onCategorySelect,
  diamonds,
}: MobileDrawerProps) {
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
                    <span className="typo-meta text-[10px] text-slate-400 block mt-0.5 tabular-nums">
                      {game.category} • ★ {game.rating.toFixed(1)}
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

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-slate-800/80 bg-[#080d1a]">
          <Link
            href="/games/jelly-bounce"
            onClick={onClose}
            className="typo-button flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs tracking-wide text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            <Gem className="w-4 h-4 text-white animate-pulse" />
            <span>PLAY JUMP JELLY JUMP! (3D)</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
