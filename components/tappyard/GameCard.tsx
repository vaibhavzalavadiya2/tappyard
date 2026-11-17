'use client';

import Link from 'next/link';
import type { GameItem } from '@/data/games';
import GameThumbnail from './GameThumbnail';
import { Star, Play, Sparkles } from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  onPlay?: (game: GameItem) => void;
}

export default function GameCard({ game, onPlay }: GameCardProps) {
  const recordPlay = () => {
    try {
      const stored =
        localStorage.getItem('tappyard_recent_games') ||
        localStorage.getItem('playhub_recent_games');
      const recent: string[] = stored ? JSON.parse(stored) : [];
      const updated = [game.id, ...recent.filter((id) => id !== game.id)].slice(
        0,
        6
      );
      localStorage.setItem('tappyard_recent_games', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
    if (onPlay) onPlay(game);
  };

  const getAccentBorder = (id: string) => {
    switch (id) {
      case 'jelly-bounce':
        return 'group-hover/card:border-cyan-400/60 group-hover/card:shadow-[0_0_24px_rgba(0,240,255,0.25)]';
      case '2048-puzzle':
        return 'group-hover/card:border-amber-400/60 group-hover/card:shadow-[0_0_24px_rgba(245,158,11,0.25)]';
      case 'color-zen':
        return 'group-hover/card:border-teal-400/60 group-hover/card:shadow-[0_0_24px_rgba(20,184,166,0.25)]';
      case 'quick-tap':
      default:
        return 'group-hover/card:border-purple-400/60 group-hover/card:shadow-[0_0_24px_rgba(168,85,247,0.25)]';
    }
  };

  return (
    <Link
      href={game.route}
      onClick={recordPlay}
      className="group/card flex flex-col cursor-pointer select-none"
      aria-label={`Play ${game.title}`}
    >
      {/* Squircle Game Thumbnail (now.gg / iOS App Store style) */}
      <div
        className={`relative aspect-square sm:aspect-4/3 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-md transition-all duration-300 group-hover/card:scale-[1.03] group-hover/card:-translate-y-1.5 ${getAccentBorder(
          game.id
        )}`}
      >
        <GameThumbnail id={game.thumbnail} title={game.title} />

        {/* Ambient bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none z-[1]" />

        {/* Rating badge (top-left, now.gg style) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-black bg-slate-950/85 text-amber-300 border border-amber-400/30 backdrop-blur-md shadow-md">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
          <span>{game.rating.toFixed(1)}</span>
        </div>

        {/* Original Badge (top-right, CrazyGames style) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black tracking-wider uppercase border border-pink-500/40 bg-pink-500/25 text-pink-300 backdrop-blur-md">
            ORIGINAL
          </span>
        </div>

        {/* Hover Play Button Overlay (Desktop) */}
        <div className="absolute inset-0 z-[2] hidden sm:flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 backdrop-blur-xs bg-slate-950/30">
          <div className="w-13 h-13 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-[0_0_24px_rgba(236,72,153,0.6)] transform scale-90 group-hover/card:scale-100 transition-transform border border-white/30">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Mobile tap quick indicator */}
        <div className="absolute bottom-2 right-2 z-10 sm:hidden">
          <div className="w-6 h-6 rounded-full bg-pink-500/80 flex items-center justify-center shadow-md">
            <Play className="w-3 h-3 fill-white ml-0.2" />
          </div>
        </div>
      </div>

      {/* Typography Under Squircle (Clean, zero clutter, high readability) */}
      <div className="pt-2 px-1 flex flex-col gap-0.5">
        <h3 className="text-xs sm:text-base font-black text-white group-hover/card:text-pink-300 transition-colors line-clamp-1 tracking-tight">
          {game.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
          <span className="font-semibold text-purple-300/90">{game.category}</span>
          <span className="text-[10px] text-slate-500 font-medium">{game.playsCount} plays</span>
        </div>
      </div>
    </Link>
  );
}
