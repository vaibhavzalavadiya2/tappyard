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
        <div className="text-cyan-400 font-black text-base sm:text-lg tracking-wide">
          Loading Jump Jelly Jump...
        </div>
      </div>
    </div>
  ),
});

export default function JellyBounceClient() {
  return (
    <div
      className="fixed inset-0 flex flex-col bg-[#081720] overflow-hidden select-none safe-bottom"
      style={{ touchAction: 'none' }}
    >
      {/* Sleek Top Bar with Back to TAPPYARD */}
      <GameHeader
        title="Jump Jelly Jump!"
        category="Arcade"
        icon={<Gem className="w-4 h-4 text-cyan-400" />}
      />

      {/* Full Game Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-[#081720]">
        <GameContainer />
      </main>
    </div>
  );
}
