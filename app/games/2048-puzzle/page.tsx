import type { Metadata } from 'next';
import Neon2048Client from '@/components/games/Neon2048/Neon2048Client';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/2048-puzzle`;

export const metadata: Metadata = {
  title: '2048 Neon Fusion - Play 2048 Unblocked Free',
  description:
    'Swipe to merge glowing number tiles and reach 2048. Free 2048 in your browser, with undo moves and no download.',
  keywords: [
    '2048 unblocked',
    '2048 game',
    '2048',
    '2048 computer game',
    'play 2048',
    '2048 online',
    '2048 free',
    '2048 puzzle',
    '2048 with undo',
    'number merge game',
    'merge numbers game',
    'how to play 2048',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: '2048 Neon Fusion - Play 2048 Unblocked Free | TAPPYARD',
    description:
      'Swipe to merge glowing number tiles and reach 2048. Free 2048 in your browser, with undo moves and no download.',
    url: GAME_URL,
    type: 'website',
    images: [
      {
        url: '/og/2048-puzzle-og.png',
        width: 1200,
        height: 630,
        alt: '2048 Neon Fusion on TAPPYARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2048 Neon Fusion - Play 2048 Unblocked Free',
    description:
      'Swipe to merge glowing number tiles and reach 2048. Free 2048 in your browser, with undo moves and no download.',
    images: ['/og/2048-puzzle-og.png'],
  },
};

export default function Neon2048Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[#061219] text-white overflow-x-hidden">
      <Neon2048Client />
      <GameContentBelowFold data={GAME_CONTENT_DATA['2048-puzzle']} />
    </div>
  );
}
