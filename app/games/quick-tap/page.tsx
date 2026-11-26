import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';
import { SITE_URL } from '@/data/homeFaqs';

const CyberDashClient = dynamic(
  () => import('@/components/games/CyberDash/CyberDashClient')
);

const GAME_URL = `${SITE_URL}/games/quick-tap`;
const PAGE_DESC =
  'Tap to fly a neon cyber craft and dodge laser gates in Cyber Dash. Graze tight pillars to earn bonus diamonds and play this 1-tap reflex game free.';

export const metadata: Metadata = {
  title: 'Cyber Dash - Free 1-Tap Neon Reflex Game',
  description: PAGE_DESC,
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Cyber Dash - Free 1-Tap Neon Reflex Game | TAPPYARD',
    description: PAGE_DESC,
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
    description: PAGE_DESC,
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
