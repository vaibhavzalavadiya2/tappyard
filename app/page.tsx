import type { Metadata } from 'next';
import HomeClient from '@/components/tappyard/HomeClient';
import { GAMES_CATALOGUE } from '@/data/games';

const SITE_URL = 'https://tappyard.com';

export const metadata: Metadata = {
  title: 'TAPPYARD — Free Online Games | Play Browser Games No Download',
  description:
    'Play free online games instantly in your web browser. Enjoy Jump Jelly Jump! 3D runner, 2048 Neon Fusion, Block Grid Zen, and Cyber Dash with no downloads or installs on mobile, tablet, and PC.',
  keywords: [
    'free online games',
    'play games online',
    'browser games no download',
    'unblocked games',
    'free games to play now',
    'instant play web games',
    '2048 online',
    'block puzzle online',
    '3D runner game',
    'reflex games',
    'HTML5 games',
    'casual games mobile',
    'TAPPYARD',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'TAPPYARD — Free Online Games | Play Browser Games (No Download)',
    description:
      'Play free 3D arcade runners, 2048 number puzzles, 10x10 block grid zen, and rhythm reflex games instantly in your browser. No downloads, mobile-ready.',
    url: SITE_URL,
    images: [
      {
        url: '/og/tappyard-og.png',
        width: 1200,
        height: 630,
        alt: 'TAPPYARD — Free Online Games Platform',
      },
    ],
  },
};

// JSON-LD: ItemList of games for rich search results
const gamesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'TAPPYARD Free Online Games Collection',
  description: 'Free instant browser games — arcade runners, puzzles, casual, and relaxing games without downloads.',
  numberOfItems: GAMES_CATALOGUE.length,
  itemListElement: GAMES_CATALOGUE.map((game, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'VideoGame',
      name: game.title,
      description: game.description,
      url: `${SITE_URL}${game.route}`,
      genre: game.category,
      gamePlatform: ['Web Browser', 'Mobile Browser', 'Desktop Browser'],
      applicationCategory: 'Game',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: game.rating,
        bestRating: 5,
        ratingCount: parseInt(game.playsCount.replace(/[^0-9]/g, '')) || 100,
      },
    },
  })),
};

// JSON-LD: FAQPage for rich search results & People Also Ask carousels
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are all games on TAPPYARD completely free to play?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Every game on TAPPYARD is 100% free to play directly in your web browser. There are no paywalls, hidden in-app purchases, or subscription fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to download or install any files to play?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No download, install, or registration is required. All games run instantly using modern HTML5, Canvas, and WebGL technology in Google Chrome, Safari, Firefox, Edge, and mobile browsers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I play TAPPYARD games on mobile phones and tablets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All TAPPYARD games are built mobile-first with responsive touch controls, full-screen support, and zero horizontal lag for iPhone, iPad, Android phones, and tablets.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of games are available on TAPPYARD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TAPPYARD features original hit games across multiple genres: Jump Jelly Jump! (3D arcade speed runner), 2048 Neon Fusion (sliding number tile puzzle), Block Grid Zen (relaxing 10x10 spatial puzzle), and Cyber Dash (1-tap reflex flight runner).',
      },
    },
    {
      '@type': 'Question',
      name: 'Are TAPPYARD games unblocked at school and work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, TAPPYARD games run safely over standard secure HTTPS in your browser with zero executable downloads, making them ideal for quick casual gaming breaks on any network.',
      },
    },
  ],
};

export default function TapYardHome() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gamesJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
