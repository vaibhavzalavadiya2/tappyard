import type { Metadata } from 'next';
import BlockZenClient from '@/components/games/BlockZen/BlockZenClient';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/color-zen`;

export const metadata: Metadata = {
  title: 'Block Grid Zen — Play Free 10x10 Block Puzzle Online | TAPPYARD',
  description:
    'Play Block Grid Zen free in your browser. Soothing 10x10 spatial block puzzle game! Drag geometric glowing polyomino shapes, pop full lines with relaxing audio chimes, and enjoy zero stress. No downloads.',
  keywords: [
    'Block Grid Zen',
    '10x10 block puzzle',
    'block puzzle online',
    'block blast online free',
    'free 10x10 puzzle',
    'zen block game',
    'spatial puzzle browser',
    'relaxing casual game',
    'brain teaser online',
    'free online games',
    'play free mobile puzzle',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Block Grid Zen — Play Free 10x10 Block Puzzle | TAPPYARD',
    description:
      'Drag glowing geometric shapes, pop full lines with relaxing chimes, and enjoy pure stress-free puzzle flow. Play free now!',
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
    title: 'Block Grid Zen — Free 10x10 Block Puzzle',
    description:
      'Drag glowing shapes, clear full lines, and unwind with soothing audio chimes. 100% free with no downloads.',
    images: ['/og/color-zen-og.png'],
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
      name: 'Relaxing Games',
      item: `${SITE_URL}/#catalogue`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Block Grid Zen',
      item: GAME_URL,
    },
  ],
};

// JSON-LD Structured Data for Block Grid Zen
const gameJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Block Grid Zen',
  description:
    'Soothing 10x10 spatial polyomino block puzzle designed for stress relief, mental flow, and satisfying line clears with musical chimes.',
  genre: ['Relaxing', 'Puzzle', 'Casual', 'Spatial'],
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
    ratingCount: 1650,
  },
};

export default function BlockZenPage() {
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
      <BlockZenClient />
    </>
  );
}
