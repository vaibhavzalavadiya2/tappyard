import type { Metadata } from 'next';
import Link from 'next/link';
import { getGameById, GAMES_CATALOGUE } from '@/data/games';
import ClientGameViewer from '@/components/tappyard/ClientGameViewer';
import GameContentBelowFold from '@/components/tappyard/GameContentBelowFold';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import Footer from '@/components/tappyard/Footer';
import { GAME_CONTENT_DATA } from '@/data/gameContent';
import { Gamepad2, ArrowLeft } from 'lucide-react';

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
      title: 'Game Retired',
      description: 'This game is no longer available on TAPPYARD. Play our other free online browser games.',
    };
  }

  const gameUrl = `${SITE_URL}${game.route}`;

  return {
    title: `${game.title} - Free Online Browser Game`,
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
      title: `${game.title} - Free Online Browser Game | TAPPYARD`,
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
      title: `${game.title} - Free Online Browser Game`,
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

  // Retired / missing game handling (Returns 200 with recommended game per CrazyGames pattern)
  if (!game) {
    const recommended = GAMES_CATALOGUE[0];
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-pink-500 selection:text-white">
        <header className="h-14 bg-[#090d16]/85 border-b border-slate-800 px-4 flex items-center justify-between">
          <Link href="/" className="typo-logo text-white text-lg">
            TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
          </Link>
          <Link href="/" className="typo-button text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Homepage</span>
          </Link>
        </header>

        <main className="flex-1 max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-md">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <span className="typo-label text-[11px] uppercase tracking-wider text-pink-400 font-semibold">Game Update</span>
            <h1 className="typo-h1 text-2xl sm:text-3xl text-white font-bold mt-1">This Game is No Longer Available</h1>
            <p className="typo-body text-xs sm:text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              This title has been retired or updated. We recommend checking out our flagship 3D speed runner:
            </p>
          </div>

          <Link
            href={recommended.route}
            className="w-full max-w-md p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/60 flex items-center gap-3.5 transition-all text-left shadow-lg group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 relative">
              <GameThumbnail id={recommended.thumbnail} title={recommended.title} />
            </div>
            <div>
              <span className="typo-label text-[10px] text-cyan-400 uppercase tracking-wider block">Recommended Game</span>
              <h2 className="typo-game-title text-sm text-white font-semibold group-hover:text-cyan-300 transition-colors">{recommended.title}</h2>
              <p className="typo-body text-[11px] text-slate-400 line-clamp-1 mt-0.5">{recommended.description}</p>
            </div>
          </Link>

          <Link href="/" className="typo-button text-xs text-pink-400 hover:text-pink-300 transition-colors">
            Explore All Games on TAPPYARD →
          </Link>
        </main>

        <Footer />
      </div>
    );
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
    publisher: {
      '@type': 'Organization',
      name: 'TAPPYARD',
      url: SITE_URL,
    },
  };

  const contentData = GAME_CONTENT_DATA[id];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientGameViewer game={game} />
      {contentData && <GameContentBelowFold data={contentData} />}
    </div>
  );
}
