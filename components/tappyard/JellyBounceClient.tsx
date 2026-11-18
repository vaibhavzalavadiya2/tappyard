'use client';

import dynamic from 'next/dynamic';
import GameHeader from '@/components/tappyard/GameHeader';
import { Gem } from 'lucide-react';

const GameContainer = dynamic(() => import('@/components/GameContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 w-full h-full flex items-center justify-center bg-[#081720]">
      <div className="flex flex-col items-center gap-3 animate-pulse p-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-lg">
          <Gem className="w-8 h-8 text-cyan-300" />
        </div>
        <div className="typo-game-title text-cyan-400 text-base sm:text-lg tracking-wide">
          Loading Jump Jelly Jump...
        </div>
      </div>
    </div>
  ),
});

export default function JellyBounceClient() {
  return (
    <section className="w-full flex flex-col bg-[#081720] select-none">
      {/* Sleek Top Bar with Back to TAPPYARD & H1 Game Title */}
      <GameHeader
        title="Jump Jelly Jump!"
        category="Arcade"
        icon={<Gem className="w-4 h-4 text-cyan-400" />}
      />

      {/* Game Viewport: calc(100dvh - top bar height) */}
      <main id="game-stage" className="relative w-full h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] overflow-hidden bg-[#081720]">
        <GameContainer />

        {/* Mobile: unobtrusive link to scroll to below-fold content */}
        <a
          href="#game-details"
          className="md:hidden absolute bottom-2 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-[10px] text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-md active:scale-95 transition-all"
          aria-label="Scroll to how to play and tips"
        >
          <span>How to play & tips</span>
          <span>↓</span>
        </a>
      </main>
    </section>
  );
}
