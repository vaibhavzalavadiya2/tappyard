import type { Metadata } from 'next';
import Neon2048Client from '@/components/games/Neon2048/Neon2048Client';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/2048-puzzle`;

export const metadata: Metadata = {
  title: '2048 Neon Fusion — Play 2048 Game Online Free | TAPPYARD',
  description:
    'Play 2048 Neon Fusion online free in your browser. Join matching glowing number tiles to reach the 2048 tile with smooth 60fps swipe controls, musical merge chimes, and diamond undos. No downloads.',
  keywords: [
    '2048 game online',
    'play 2048 free',
    '2048 unblocked',
    'neon 2048',
    'sliding tile puzzle',
    'math puzzle online',
    '2048 undo',
    'brain puzzle browser',
    'free online games',
    'play 2048 mobile',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: '2048 Neon Fusion — Play 2048 Game Online Free | TAPPYARD',
    description:
      'Join matching neon tiles to reach 2048! Silky touch swipe controls, musical chords, and diamond undos. Play free on mobile & PC.',
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
    title: '2048 Neon Fusion — Free Online Sliding Puzzle',
    description:
      'Merge matching glowing number tiles to reach 2048! Fast, smooth, and 100% free with no downloads.',
    images: ['/og/2048-puzzle-og.png'],
  },
};

// JSON-LD: Breadcrumb navigation schema
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Puzzle Games',
      item: `${SITE_URL}/#catalogue`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '2048 Neon Fusion',
      item: GAME_URL,
    },
  ],
};

// JSON-LD Structured Data for 2048 Neon Fusion
const gameJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: '2048 Neon Fusion',
  description:
    'Join matching neon number tiles to reach the 2048 tile! Featuring silky 60fps touch swipe controls, musical harmonic chord synthesis, and diamond undos.',
  genre: ['Puzzle', 'Brain', 'Math', 'Strategy', 'Casual'],
  gamePlatform: ['Web Browser', 'Mobile Browser', 'Desktop Browser'],
  applicationCategory: 'Game',
  operatingSystem: 'Any',
  playMode: 'SinglePlayer',
  url: GAME_URL,
  author: {
    '@type': 'Organization',
    name: 'TAPPYARD',
    url: SITE_URL,
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    bestRating: 5,
    worstRating: 1,
    ratingCount: 1840,
  },
};

export default function Neon2048Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
      <Neon2048Client />
    </>
  );
}
