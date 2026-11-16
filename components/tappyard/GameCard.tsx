'use client';

import Link from 'next/link';
import type { GameItem } from '@/data/games';
import GameThumbnail from './GameThumbnail';
import { Star, Play, ExternalLink } from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  onPlay?: (game: GameItem) => void;
}

export default function GameCard({ game, onPlay }: GameCardProps) {
  const isExternal = game.sourceType === 'external';

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

  const badgeColorClass =
    game.sourceType === 'owned'
      ? 'bg-pink-500/25 text-pink-300 border-pink-500/40'
      : game.sourceType === 'embed'
      ? 'bg-amber-500/25 text-amber-300 border-amber-500/40'
      : 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40';

  return (
    <div className="group relative flex flex-col rounded-3xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all duration-200">
      {/* Thumbnail area */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
        <GameThumbnail id={game.thumbnail} title={game.title} />

        {/* Source badge overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${badgeColorClass}`}
          >
            {game.badge || game.sourceType}
          </span>
        </div>

        {/* Rating overlay */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/75 text-amber-300 border border-white/10 backdrop-blur-md">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{game.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 gap-2.5 sm:gap-3">
        {/* Category & Plays */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/25 text-[11px]">
            {game.category}
          </span>
          <span className="text-[11px] font-medium">{game.playsCount} plays</span>
        </div>

        {/* Game Title */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
          {game.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 flex-1">
          {game.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {game.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action button - 44px+ touch target */}
        <div className="pt-2 mt-auto">
          {isExternal ? (
            <a
              href={game.externalUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={recordPlay}
              className="flex items-center justify-center gap-2 w-full h-11 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700 cursor-pointer"
            >
              <span>Play on Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={game.route}
              onClick={recordPlay}
              className="flex items-center justify-center gap-2 w-full h-11 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Play Now</span>
              <Play className="w-3.5 h-3.5 fill-white" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
