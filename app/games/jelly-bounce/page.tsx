import type { Metadata } from 'next';
import JellyBounceClient from '@/components/tappyard/JellyBounceClient';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/jelly-bounce`;

export const metadata: Metadata = {
  title: 'Jump Jelly Jump! — Play Free 3D Endless Runner Online | TAPPYARD',
  description:
    'Play Jump Jelly Jump! free in your browser. Fast 3D speed runner across floating neon runways! Drag to steer your jelly cube, collect diamonds, and hit booster pads to leap endless chasms. No downloads.',
  keywords: [
    'Jump Jelly Jump',
    '3D runner online',
    'endless runner game free',
    'arcade runner browser',
    'play jelly jump online',
    'unblocked runner game',
    'HTML5 3D game',
    'browser games no download',
    'cube runner 3D',
    'speed runner game online',
    'free online games',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Jump Jelly Jump! — 3D Endless Runner | Play Free on TAPPYARD',
    description:
      'Steer your 3D jelly cube across suspended runways, collect diamonds, and hit speed boosters across chasms. Play free in your browser now!',
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
    title: 'Jump Jelly Jump! — Free 3D Endless Runner Online',
    description:
      'Steer your jelly cube across floating runways and hit speed boosters. Play instantly with no downloads!',
    images: ['/og/jelly-bounce-og.png'],
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
      name: 'Arcade Games',
      item: `${SITE_URL}/#catalogue`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Jump Jelly Jump!',
      item: GAME_URL,
    },
  ],
};

// JSON-LD Structured Data for Jump Jelly Jump
const gameJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Jump Jelly Jump!',
  description:
    '3D forward speed runner across suspended floating runways! Drag to steer your jelly cube, collect cyan diamonds, and hit speed chevron pads to leap across endless chasms.',
  genre: ['Arcade', 'Runner', '3D Platformer', 'Casual', 'Endless Runner'],
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
    ratingValue: 4.9,
    bestRating: 5,
    worstRating: 1,
    ratingCount: 2840,
  },
};

export default function JellyBouncePage() {
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
      <JellyBounceClient />
    </>
  );
}
