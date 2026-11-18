import type { Metadata } from 'next';
import CyberDashClient from '@/components/games/CyberDash/CyberDashClient';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/quick-tap`;

export const metadata: Metadata = {
  title: 'Cyber Dash - Free 1-Tap Neon Reflex Game',
  description:
    'Tap to fly and dodge pulsing laser gates in Cyber Dash, a free 1-tap neon reflex game. Graze gates for bonus diamonds. No download.',
  keywords: [
    'one tap games',
    'one tap game online',
    'one button games',
    'tap to fly game',
    'one tap flying game',
    'reflex games',
    'reflex games online',
    'reaction games',
    'neon reflex game',
    'dodge game',
    'laser dodge game',
    'obstacle dodging game',
    'hard one tap games',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Cyber Dash - Free 1-Tap Neon Reflex Game | TAPPYARD',
    description:
      'Tap to fly and dodge pulsing laser gates in Cyber Dash, a free 1-tap neon reflex game. Graze gates for bonus diamonds. No download.',
    url: GAME_URL,
    type: 'website',
    images: [
      {
        url: '/og/quick-tap-og.png',
        width: 1200,
        height: 630,
        alt: 'Cyber Dash on TAPPYARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber Dash - Free 1-Tap Neon Reflex Game',
    description:
      'Tap to fly and dodge pulsing laser gates in Cyber Dash, a free 1-tap neon reflex game. Graze gates for bonus diamonds. No download.',
    images: ['/og/quick-tap-og.png'],
  },
};

export default function CyberDashPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#040e14] text-white overflow-x-hidden">
      <CyberDashClient />
      <GameContentBelowFold data={GAME_CONTENT_DATA['quick-tap']} />
    </div>
  );
}
