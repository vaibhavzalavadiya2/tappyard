import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';
import { SITE_URL } from '@/data/homeFaqs';

const JellyBounceClient = dynamic(
  () => import('@/components/tappyard/JellyBounceClient')
);

const GAME_URL = `${SITE_URL}/games/jelly-bounce`;
const PAGE_DESC =
  'Steer a jelly cube along floating neon tracks, grab cyan diamonds, and hit speed pads to cross chasms. Play Jump Jelly Jump! free online today.';

export const metadata: Metadata = {
  title: 'Jump Jelly Jump! - Free 3D Endless Runner Game',
  description: PAGE_DESC,
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Jump Jelly Jump! - Free 3D Endless Runner Game | TAPPYARD',
    description: PAGE_DESC,
    url: GAME_URL,
    type: 'website',
    images: [
      {
        url: '/og/jelly-bounce-og.png',
        width: 1200,
        height: 630,
        alt: 'Jump Jelly Jump! Browser Runner Game on TAPPYARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jump Jelly Jump! - Free 3D Endless Runner Game',
    description: PAGE_DESC,
    images: ['/og/jelly-bounce-og.png'],
  },
};

export default function JellyBouncePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#081720] text-slate-100 overflow-x-hidden">
      <JellyBounceClient />
      <GameContentBelowFold data={GAME_CONTENT_DATA['jelly-bounce']} />
    </div>
  );
}
