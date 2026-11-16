'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GAMES_CATALOGUE, type GameItem } from '@/data/games';
import GameThumbnail from './GameThumbnail';
import { Clock, Play } from 'lucide-react';

export default function RecentlyPlayed() {
  const [recentGames, setRecentGames] = useState<GameItem[]>([]);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem('tappyard_recent_games') ||
        localStorage.getItem('playhub_recent_games');
      let ids: string[] = stored ? JSON.parse(stored) : [];

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
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
            Jump Back In
          </h2>
          <span className="text-xs text-slate-400 font-medium hidden xs:inline">
            Recently Played
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {recentGames.map((game) => (
          <Link
            key={game.id}
            href={game.route}
            className="group relative flex flex-col rounded-2xl bg-slate-900 border border-slate-800 p-2.5 hover:border-pink-500/50 hover:bg-slate-850 transition-all hover:-translate-y-0.5 shadow-md"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-slate-950">
              <GameThumbnail id={game.thumbnail} title={game.title} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
              </div>
            </div>
            <div className="text-xs font-bold text-white truncate group-hover:text-pink-300">
              {game.title}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {game.category}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
