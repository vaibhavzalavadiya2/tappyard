import type { Metadata } from 'next';
import CyberDashClient from '@/components/games/CyberDash/CyberDashClient';

const SITE_URL = 'https://tappyard.com';
const GAME_URL = `${SITE_URL}/games/quick-tap`;

export const metadata: Metadata = {
  title: 'Cyber Dash — Play Free 1-Tap Neon Reflex Flight Online | TAPPYARD',
  description:
    'Play Cyber Dash free in your browser. Fast-paced 1-tap neon reflex flight runner! Dodge pulsing laser gates, graze edges for bonus score, and beat high scores. No downloads.',
  keywords: [
    'Cyber Dash',
    '1-tap reflex game',
    'flappy bird online free',
    'neon runner online',
    'rhythm flight game',
    'tap to fly browser game',
    'casual games mobile',
    'unblocked games free',
    'free online games',
    'reflex flight runner',
    'TAPPYARD',
  ],
  alternates: {
    canonical: GAME_URL,
  },
  openGraph: {
    title: 'Cyber Dash — Play 1-Tap Neon Reflex Flight Free | TAPPYARD',
    description:
      'Dodge pulsing laser gates, graze edges for bonus diamonds, and beat your high score. Play free directly in your browser!',
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
    title: 'Cyber Dash — Free 1-Tap Neon Reflex Runner',
    description:
      'Dodge pulsing laser gates and graze edges for bonus diamonds! Fast, addictive, and 100% free with no downloads.',
    images: ['/og/quick-tap-og.png'],
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
      name: 'Casual Games',
      item: `${SITE_URL}/#catalogue`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Cyber Dash',
      item: GAME_URL,
    },
  ],
};

// JSON-LD Structured Data for Cyber Dash
const gameJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Cyber Dash',
  description:
    'Fast-paced 1-tap neon reflex flight runner. Dodge pulsing laser gates and graze edges to earn bonus TapYard diamonds.',
  genre: ['Casual', 'Reflex', 'Runner', 'Arcade', 'Rhythm'],
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
    ratingValue: 4.7,
    bestRating: 5,
    worstRating: 1,
    ratingCount: 1420,
  },
};

export default function CyberDashPage() {
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
      <CyberDashClient />
    </>
  );
}
