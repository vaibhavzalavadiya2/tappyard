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
  ExternalLink,
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-out drawer from RIGHT side */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-[84%] max-w-[340px] bg-[#0a0f1d] border-l border-slate-800/90 shadow-[-12px_0_36px_rgba(0,0,0,0.85)] flex flex-col transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 p-0.5 shadow-md shadow-pink-500/20">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center p-1">
                <BrandIcon className="w-full h-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-0.5">
                TAP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
              </span>
            </div>
          </Link>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/50 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
          {/* Diamond Wallet Badge */}
          {diamonds !== null && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900/90 to-purple-950/40 border border-cyan-500/30 shadow-inner">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                  <Gem className="w-4 h-4 text-cyan-300 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    TapYard Diamonds
                  </span>
                  <span className="text-sm font-black text-white">
                    {diamonds} <span className="text-cyan-400 text-xs font-bold">💎</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                Active
              </span>
            </div>
          )}

          {/* Category Filter Navigation */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 mb-2 block">
              Browse Categories
            </span>
            <div className="space-y-1">
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
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-98 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25 ring-1 ring-pink-400/40'
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
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 mb-2 block">
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
                    <GameThumbnail id={game.thumbnail} title={game.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-pink-300 transition-colors">
                      {game.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
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

          {/* Useful Quick Links */}
          <div className="pt-2 border-t border-slate-800/70 space-y-1">
            <a
              href="/#faq"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
                <span>Frequently Asked Questions</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </a>
            <div className="flex items-center gap-2 px-3 py-2 text-[11px] text-cyan-400 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Zero Downloads • 100% Free • Unblocked</span>
            </div>
          </div>
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-slate-800/80 bg-[#080d1a] safe-bottom">
          <Link
            href="/games/jelly-bounce"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            <Gem className="w-4 h-4 text-white animate-pulse" />
            <span>PLAY JUMP JELLY JUMP! (3D)</span>
          </Link>
          <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
            TAPPYARD v2.0 • WebGL & HTML5 Instant Play
          </p>
        </div>
      </aside>
    </>
  );
}
