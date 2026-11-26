import type { Metadata } from 'next';
import Cupcake2048Client from '@/components/games/Cupcake2048/Cupcake2048Client';
import CupcakeContentBelowFold from '@/components/games/Cupcake2048/CupcakeContentBelowFold';
import { SITE_URL } from '@/data/homeFaqs';

const GAME_URL = `${SITE_URL}/games/cupcake-2048`;
const PAGE_DESC =
  'Play Cupcake 2048 free online in your browser. Merge delicious cupcake tiles to reach the 2048 Diamond Cupcake with undo support and no downloads needed.';

export const metadata: Metadata = {
  title: 'Cupcake 2048 - Play 2048 Cupcakes Online Free',
  description: PAGE_DESC,
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Cupcake 2048 - Play 2048 Cupcakes Online Free | TAPPYARD',
    description: PAGE_DESC,
    url: GAME_URL,
    type: 'website',
    images: [
      {
        url: '/og/cupcake-2048-og.png',
        width: 1200,
        height: 630,
        alt: 'Cupcake 2048 on TAPPYARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cupcake 2048 - Play 2048 Cupcakes Online Free',
    description: PAGE_DESC,
    images: ['/og/cupcake-2048-og.png'],
  },
};

export default function Cupcake2048Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[#140b18] text-white overflow-x-hidden">
      <Cupcake2048Client />
      <CupcakeContentBelowFold />
    </div>
  );
}
