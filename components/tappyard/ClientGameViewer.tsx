'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { GameItem } from '@/data/games';
import GameHeader from './GameHeader';
import GameThumbnail from './GameThumbnail';
import { Gem, Puzzle, Zap, ExternalLink, ArrowLeft } from 'lucide-react';

const GameContainer = dynamic(() => import('@/components/GameContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-purple-100">
      <div className="flex flex-col items-center gap-3 animate-pulse p-4">
        <div className="w-16 h-16 rounded-full bg-pink-300/50 shadow-inner" />
        <div className="text-pink-500 font-bold text-base sm:text-lg">Loading Game...</div>
      </div>
    </div>
  ),
});

const Neon2048Client = dynamic(
  () => import('@/components/games/Neon2048/Neon2048Client'),
  { ssr: false }
);

const CyberDashClient = dynamic(
  () => import('@/components/games/CyberDash/CyberDashClient'),
  { ssr: false }
);

const BlockZenClient = dynamic(
  () => import('@/components/games/BlockZen/BlockZenClient'),
  { ssr: false }
);

interface ClientGameViewerProps {
  game: GameItem;
}

export default function ClientGameViewer({ game }: ClientGameViewerProps) {
  // 1. Native 2048 Neon Fusion
  if (game.id === '2048-puzzle') {
    return <Neon2048Client />;
  }

  // 2. Native Cyber Dash (1-Tap Reflex Rush)
  if (game.id === 'quick-tap' || game.id === 'cyber-dash') {
    return <CyberDashClient />;
  }

  // 3. Native Block Grid Zen (10x10 Spatial Puzzle)
  if (game.id === 'color-zen' || game.id === 'block-zen') {
    return <BlockZenClient />;
  }

  // 4. Owned Game (e.g. Jelly Bounce)
  if (game.sourceType === 'owned') {
    return (
      <div className="fixed inset-0 flex flex-col bg-[#090d16] overflow-hidden select-none safe-bottom" style={{ touchAction: 'none' }}>
        <GameHeader
          title={game.title}
          category={game.category}
          icon={<Gem className="w-4 h-4 text-cyan-400" />}
        />
        <main className="relative flex-1 w-full h-full overflow-hidden bg-sky-100">
          <GameContainer />
        </main>
      </div>
    );
  }

  // 2. Embedded Third-Party Game (Authorized iframe)
  if (game.sourceType === 'embed' && game.embedUrl) {
    return (
      <div className="fixed inset-0 flex flex-col bg-[#090d16] overflow-hidden safe-bottom">
        <GameHeader
          title={game.title}
          category={game.category}
          icon={<Puzzle className="w-4 h-4 text-amber-400" />}
        />
        <main className="relative flex-1 w-full h-full bg-slate-950 flex items-center justify-center">
          <iframe
            src={game.embedUrl}
            title={game.title}
            className="w-full h-full border-none"
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </main>
      </div>
    );
  }

  // 3. External Game Launcher Card
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 safe-bottom">
      <GameHeader
        title={game.title}
        category={game.category}
        icon={<Zap className="w-4 h-4 text-purple-400" />}
      />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center">
        <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center gap-5 sm:gap-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-xl">
            <GameThumbnail id={game.thumbnail} title={game.title} />
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              EXTERNAL GAME
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{game.title}</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-1">
            <a
              href={game.externalUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-xl shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Play on Original Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to TAPPYARD</span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-500">
            This game runs on an external developer website and opens in a new tab.
          </p>
        </div>
      </main>
    </div>
  );
}
