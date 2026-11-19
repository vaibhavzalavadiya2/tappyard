'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GAMES_CATALOGUE, type GameItem } from '@/data/games';
import GameThumbnail from './GameThumbnail';
import { Clock, Play, ArrowRight } from 'lucide-react';

export default function RecentlyPlayed() {
  const [recentGames, setRecentGames] = useState<GameItem[]>([]);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem('tappyard_recent_games') ||
        localStorage.getItem('playhub_recent_games');
      const ids: string[] = stored ? JSON.parse(stored) : [];

      // If user has previous Jelly Bounce progress, ensure it shows in recently played
      if (
        !ids.includes('jelly-bounce') &&
        localStorage.getItem('jelly-bounce-progress')
      ) {
        ids.unshift('jelly-bounce');
      }

      if (ids.length > 0) {
        const found = ids
          .map((id) => GAMES_CATALOGUE.find((g) => g.id === id))
          .filter((g): g is GameItem => Boolean(g));
        setRecentGames(found);
      }
    } catch {
      // Ignore
    }
  }, []);

  if (recentGames.length === 0) return null;

  return (
    <section className="lg:pt-8 pt-6">
      <div className="container xl:px-5 px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <h2 className="typo-section-heading text-base sm:text-lg text-white">
              Jump Back In
            </h2>
            <span className="typo-meta text-xs text-slate-400 hidden xs:inline">
              • Continue Playing
            </span>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0">
          {recentGames.map((game, index) => (
            <Link
              key={game.id}
              href={game.route}
              className="group relative flex-none w-36 sm:w-44 rounded-2xl bg-slate-900/90 border border-slate-800 p-2.5 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-300 hover:-translate-y-1 snap-start active:scale-95 cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-slate-950">
                <GameThumbnail id={game.thumbnail} title={game.title} />

                {/* Play button hover overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                  <span className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/50 transform group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </span>
                </div>
              </div>

              <div className="typo-game-title text-xs text-white truncate group-hover:text-pink-300 transition-colors">
                {game.title}
              </div>
              <div className="typo-meta flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                <span>{game.category}</span>
                <span className="typo-label tracking-normal flex items-center gap-0.5 text-pink-400 group-hover:translate-x-0.5 transition-transform">
                  Play <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
