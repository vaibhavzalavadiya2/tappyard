import type { Metadata } from 'next';
import JellyBounceClient from '@/components/tappyard/JellyBounceClient';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/jelly-bounce`;

export const metadata: Metadata = {
  title: 'Jump Jelly Jump! - Free 3D Endless Runner Game',
  description:
    'Steer a jelly cube over neon runways, grab diamonds and hit booster pads to cross chasms. Free 3D endless runner, no download.',
  keywords: [
    'running games',
    '3D runner game',
    '3D endless runner',
    'endless runner online',
    'cube runner game',
    'jelly runner game',
    'jelly cube game',
    '3D running game',
    'runner game online',
    'free 3D games online',
    '3D browser games',
    'html5 3D games',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Jump Jelly Jump! - Free 3D Endless Runner Game | TAPPYARD',
    description:
      'Steer a jelly cube over neon runways, grab diamonds and hit booster pads to cross chasms. Free 3D endless runner, no download.',
    url: GAME_URL,
    type: 'website',
    images: [
      {
        url: '/og/jelly-bounce-og.png',
        width: 1200,
        height: 630,
        alt: 'Jump Jelly Jump! 3D Browser Runner Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jump Jelly Jump! - Free 3D Endless Runner Game',
    description:
      'Steer a jelly cube over neon runways, grab diamonds and hit booster pads to cross chasms. Free 3D endless runner, no download.',
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
