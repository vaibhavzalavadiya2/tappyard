'use client';

import Link from 'next/link';
import { GAMES_CATALOGUE } from '@/data/games';
import GameThumbnail from './GameThumbnail';
import { Flame, Shuffle } from 'lucide-react';

export default function HotGamesRow() {
  const handleRandomPlay = () => {
    const randomGame =
      GAMES_CATALOGUE[Math.floor(Math.random() * GAMES_CATALOGUE.length)];
    if (typeof window !== 'undefined') {
      window.location.href = randomGame.route;
    }
  };

  const getBorderRing = (id: string) => {
    switch (id) {
      case 'jelly-bounce':
        return 'from-cyan-400 via-blue-500 to-indigo-500 shadow-cyan-500/30';
      case '2048-puzzle':
        return 'from-amber-400 via-orange-500 to-yellow-500 shadow-amber-500/30';
      case 'color-zen':
        return 'from-teal-400 via-emerald-500 to-cyan-500 shadow-teal-500/30';
      case 'quick-tap':
      default:
        return 'from-purple-500 via-fuchsia-500 to-pink-500 shadow-purple-500/30';
    }
  };

  return (
    <div className="flex flex-col gap-2.5 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white uppercase tracking-wider">
            <Flame className="w-4 h-4 text-pink-500 animate-bounce" />
            Hot Games
          </span>
          <span className="text-[10px] text-pink-400 font-bold bg-pink-500/15 px-2 py-0.5 rounded-full border border-pink-500/30">
            Instant Play
          </span>
        </div>
      </div>

      {/* Horizontal Story Bubble Row */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {GAMES_CATALOGUE.map((game) => (
          <Link
            key={game.id}
            href={game.route}
            className="group flex flex-col items-center gap-1.5 shrink-0 cursor-pointer active:scale-90 transition-transform"
          >
            {/* Circular Avatar with Glowing Gradient Ring */}
            <div
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr ${getBorderRing(
                game.id
              )} shadow-md group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(236,72,153,0.5)] transition-all duration-300`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 p-0.5">
                <GameThumbnail id={game.thumbnail} title={game.title} />
              </div>
              {/* Online pulsing dot */}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#090d16] shadow-sm" />
            </div>

            <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:text-pink-300 transition-colors truncate max-w-[64px] sm:max-w-[72px] text-center">
              {game.title.split(' ')[0]}
            </span>
          </Link>
        ))}

        {/* Surprise Me / Random Game Bubble */}
        <button
          onClick={handleRandomPlay}
          className="group flex flex-col items-center gap-1.5 shrink-0 cursor-pointer active:scale-90 transition-transform"
          aria-label="Play a random game"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 shadow-md group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(236,72,153,0.5)] transition-all duration-300">
            <div className="w-full h-full rounded-full bg-[#0d1322] flex items-center justify-center text-pink-400 group-hover:text-white transition-colors">
              <Shuffle className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-pink-400 group-hover:text-white transition-colors">
            Random
          </span>
        </button>
      </div>
    </div>
  );
}
