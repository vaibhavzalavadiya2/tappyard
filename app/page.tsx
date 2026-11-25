import type { Metadata } from 'next';
import HomeClient from '@/components/tappyard/HomeClient';
import { GAMES_CATALOGUE } from '@/data/games';

const SITE_URL = 'https://tappyard.com';

export const metadata: Metadata = {
  title: {
    absolute: 'Free Games to Play Online - No Download | TAPPYARD',
  },
  description:
    'Free games to play online in your browser. Play 3D runners, 2048 puzzles, Cupcake 2048, block zen, 1-tap reflex, and sorting games. No download.',
  keywords: [
    'games to play',
    'free games to play online',
    'free online games',
    'browser games',
    'online games to play',
    'fun games to play',
    'free browser games',
    'play games without downloading',
    'instant play games',
    'mobile browser games',
    'online arcade games',
    '2048 unblocked',
    'free puzzle games',
    'running games',
    'one tap games',
    'TAPPYARD',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Free Games to Play Online - No Download | TAPPYARD',
    description:
      'Free games to play online in your browser. Play 3D runners, 2048 puzzles, Cupcake 2048, block zen, 1-tap reflex, and sorting games. No download.',
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: '/og/tappyard-og.png',
        width: 1200,
        height: 630,
        alt: 'TAPPYARD - Free Online Browser Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Games to Play Online - No Download | TAPPYARD',
    description:
      'Free games to play online in your browser. Play 3D runners, 2048 puzzles, Cupcake 2048, block zen, 1-tap reflex, and sorting games. No download.',
    images: ['/og/tappyard-og.png'],
  },
};

// JSON-LD: WebSite & Organization schema
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TAPPYARD',
  url: SITE_URL,
  description:
    'Free games to play online in your browser. Play 3D runners, 2048 puzzles, Cupcake 2048, block zen, 1-tap reflex, and sorting games. No download.',
  publisher: {
    '@type': 'Organization',
    name: 'TAPPYARD',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icons/icon-512.png`,
    },
  },
};

// JSON-LD: ItemList of games (clean: zero fake ratings or inflated review counts)
const gamesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'TAPPYARD Free Online Browser Games Collection',
  description: 'Original instant play browser games without downloads.',
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
      publisher: {
        '@type': 'Organization',
        name: 'TAPPYARD',
        url: SITE_URL,
      },
    },
  })),
};

// JSON-LD: FAQPage matching visible text exactly
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are all games on TAPPYARD completely free to play?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every game on TAPPYARD is 100% free to play directly in your web browser with no paywalls, hidden in-app purchases, or subscription fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to download or install any files to play?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No download, install, or registration is required. All games run instantly using modern HTML5, Canvas, and WebGL technology in Chrome, Safari, Firefox, Edge, and mobile browsers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I play TAPPYARD games on mobile phones and tablets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All TAPPYARD games are built mobile-first with responsive touch controls, full-screen support, and zero horizontal scrolling on iPhone, iPad, Android phones, and tablets.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need an account to play?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account, sign-up, or registration is required to play. Your highest scores, unlocked character skins, and diamond rewards save automatically to your local browser storage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the games unblocked at school or work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. TAPPYARD games run safely over standard secure HTTPS in your browser with zero executable downloads, making them accessible for casual gaming breaks on school and work networks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are good quick games to play when bored?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For fast reflex fun, try Conveyor Sort Rush (shape sorting arcade), Cyber Dash (1-tap flight), or Jump Jelly Jump! (3D speed runner). If you want mental stimulation, play 2048 Neon Fusion, Cupcake 2048, or Block Grid Zen (10x10 spatial block puzzle). Every TAPPYARD game starts in under a second.',
      },
    },
  ],
};

export default function TappyardHome() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
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
