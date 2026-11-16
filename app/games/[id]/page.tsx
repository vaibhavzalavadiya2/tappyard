import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGameById, GAMES_CATALOGUE } from '@/data/games';
import ClientGameViewer from '@/components/tappyard/ClientGameViewer';

const SITE_URL = 'https://tappyard.com';

export function generateStaticParams() {
  return GAMES_CATALOGUE.map((game) => ({ id: game.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = getGameById(id);

  if (!game) {
    return {
      title: 'Game Not Found | TAPPYARD',
      description: 'The requested game could not be found.',
    };
  }

  const gameUrl = `${SITE_URL}${game.route}`;

  return {
    title: `${game.title} — Play Free Online (No Download) | TAPPYARD`,
    description: `${game.description} Play free directly in your browser on mobile, tablet, and PC. No downloads or installs needed.`,
    keywords: [
      game.title,
      `${game.title} online`,
      'free online games',
      'browser games no download',
      'unblocked games',
      'play games online',
      game.category,
      ...game.tags,
      'TAPPYARD',
    ],
    alternates: {
      canonical: gameUrl,
    },
    openGraph: {
      title: `${game.title} — Play Free Online (No Download) | TAPPYARD`,
      description: game.description,
      url: gameUrl,
      type: 'website',
      images: [
        {
          url: `/og/${game.id}-og.png`,
          width: 1200,
          height: 630,
          alt: `${game.title} on TAPPYARD`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} — Play Free Online (No Download)`,
      description: game.description,
      images: [`/og/${game.id}-og.png`],
    },
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = getGameById(id);

  if (!game) {
    notFound();
  }

  const gameUrl = `${SITE_URL}${game.route}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    url: gameUrl,
    genre: game.category,
    keywords: game.tags.join(', '),
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
      worstRating: 1,
      ratingCount: parseInt(game.playsCount.replace(/[^0-9]/g, '')) * 100 || 500,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TAPPYARD',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientGameViewer game={game} />
    </>
  );
}
