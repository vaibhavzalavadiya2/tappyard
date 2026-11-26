import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';
import { SITE_URL } from '@/data/homeFaqs';

const BlockZenClient = dynamic(
  () => import('@/components/games/BlockZen/BlockZenClient')
);

const GAME_URL = `${SITE_URL}/games/color-zen`;
const PAGE_DESC =
  'Drag geometric blocks onto a soothing 10x10 grid and clear lines with relaxing chimes in Block Grid Zen. Play timer-free puzzles in your browser.';

export const metadata: Metadata = {
  title: 'Block Grid Zen - Free 10x10 Block Puzzle Games',
  description: PAGE_DESC,
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Block Grid Zen - Free 10x10 Block Puzzle Games | TAPPYARD',
    description: PAGE_DESC,
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
    description: PAGE_DESC,
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
