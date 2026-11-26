import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';
import { SITE_URL } from '@/data/homeFaqs';

const Neon2048Client = dynamic(
  () => import('@/components/games/Neon2048/Neon2048Client')
);

const GAME_URL = `${SITE_URL}/games/2048-puzzle`;
const PAGE_DESC =
  'Slide and merge glowing number tiles on a 4x4 neon grid to build the 2048 tile. Play 2048 unblocked free with diamond undos and no downloads.';

export const metadata: Metadata = {
  title: '2048 Neon Fusion - Play 2048 Unblocked Free',
  description: PAGE_DESC,
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: '2048 Neon Fusion - Play 2048 Unblocked Free | TAPPYARD',
    description: PAGE_DESC,
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
    description: PAGE_DESC,
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
