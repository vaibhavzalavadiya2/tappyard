import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import BeltSortClient from '@/components/games/BeltSort/BeltSortClient';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import { GAME_CONTENT_DATA } from '@/data/gameContent';

const lilitaOne = localFont({
  src: '../../../public/fonts/LilitaOne-Regular.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-lilita-one',
  fallback: ['system-ui', 'Arial Black', 'sans-serif'],
});

const fredoka = localFont({
  src: '../../../public/fonts/Fredoka-Variable.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-fredoka',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/belt-sort`;

export const metadata: Metadata = {
  title: 'Conveyor Sort Rush - Free Shape Sorting Game',
  description:
    'Play Conveyor Sort Rush free online in your browser. Sort fast-moving shapes on the conveyor belt into matching bins, chain combos, and play Daily Runs.',
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Conveyor Sort Rush - Free Shape Sorting Game | TAPPYARD',
    description:
      'Play Conveyor Sort Rush free online in your browser. Sort fast-moving shapes on the conveyor belt into matching bins, chain combos, and play Daily Runs.',
    url: GAME_URL,
    type: 'website',
    images: [
      {
        url: '/og/belt-sort-og.png',
        width: 1200,
        height: 630,
        alt: 'Conveyor Sort Rush on TAPPYARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conveyor Sort Rush - Free Shape Sorting Game',
    description:
      'Play Conveyor Sort Rush free online in your browser. Sort fast-moving shapes on the conveyor belt into matching bins, chain combos, and play Daily Runs.',
    images: ['/og/belt-sort-og.png'],
  },
};

export default function BeltSortPage() {
  const bgPath = path.join(process.cwd(), 'public', 'games', 'belt-sort', 'bg.webp');
  const hasCustomBg = fs.existsSync(bgPath);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1233] text-white overflow-x-hidden">
      <BeltSortClient
        hasCustomBg={hasCustomBg}
        fontClassName={`${lilitaOne.variable} ${fredoka.variable}`}
      />
      <GameContentBelowFold data={GAME_CONTENT_DATA['belt-sort']} />
    </div>
  );
}
