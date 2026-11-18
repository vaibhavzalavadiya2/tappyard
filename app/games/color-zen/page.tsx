import type { Metadata } from 'next';
import BlockZenClient from '@/components/games/BlockZen/BlockZenClient';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/color-zen`;

export const metadata: Metadata = {
  title: 'Block Grid Zen - Free 10x10 Block Puzzle Games',
  description:
    'Drag shapes onto a 10x10 grid and clear full lines in Block Grid Zen, a free, relaxing block puzzle. Play in your browser, no download.',
  keywords: [
    'free puzzle games',
    'puzzle games',
    'block game',
    'block puzzle',
    'block puzzle game',
    'block puzzle online',
    'free block puzzle',
    '10x10 block puzzle',
    'grid puzzle game',
    'relaxing puzzle games',
    'zen puzzle game',
    'puzzle game no time limit',
    'line clear puzzle',
    'drag and drop block puzzle',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Block Grid Zen - Free 10x10 Block Puzzle Games | TAPPYARD',
    description:
      'Drag shapes onto a 10x10 grid and clear full lines in Block Grid Zen, a free, relaxing block puzzle. Play in your browser, no download.',
    url: GAME_URL,
    type: 'website',
    images: [
      {
        url: '/og/color-zen-og.png',
        width: 1200,
        height: 630,
        alt: 'Block Grid Zen on TAPPYARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Block Grid Zen - Free 10x10 Block Puzzle Games',
    description:
      'Drag shapes onto a 10x10 grid and clear full lines in Block Grid Zen, a free, relaxing block puzzle. Play in your browser, no download.',
    images: ['/og/color-zen-og.png'],
  },
};

export default function BlockZenPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#040e14] text-white overflow-x-hidden">
      <BlockZenClient />
      <GameContentBelowFold data={GAME_CONTENT_DATA['color-zen']} />
    </div>
  );
}
