import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GameCard from '@/components/tappyard/GameCard';
import Footer from '@/components/tappyard/Footer';
import BrandIcon from '@/components/tappyard/BrandIcon';
import { GAME_CATEGORIES, getGamesByCategory, type GameCategory } from '@/data/games';
import { SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

interface CategoryPageConfig {
  category: GameCategory;
  slug: string;
  heading: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  introParagraphs: string[];
  accentBadge: string;
}

const CATEGORY_CONFIGS: Record<string, CategoryPageConfig> = {
  arcade: {
    category: 'Arcade',
    slug: 'arcade',
    heading: 'Free Arcade Browser Games',
    metaTitle: 'Free 3D Arcade Browser Games - Instant Play',
    metaDescription:
      'Play free arcade browser games online with zero downloads. Steer through neon 3D runways, leap endless chasms, and test your reflexes on any device.',
    ogImage: '/og/jelly-bounce-og.png',
    accentBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    introParagraphs: [
      'Arcade games on TAPPYARD focus on immediate momentum, crisp visual feedback, and pure skill-based survival. Instead of waiting through heavy launchers or app store downloads, our browser arcade collection opens directly inside Safari, Chrome, Edge, or Firefox in under a second so you can jump straight into high-speed action.',
      'In our flagship arcade runner Jump Jelly Jump!, players steer an elastic neon cube down suspended canyon runways, grab glowing diamonds, hit chevron booster pads, and time leaps across widening gaps. Every frame renders smoothly on phones, tablets, and desktop monitors with intuitive touch drag or keyboard steering, procedural Web Audio sound effects, and unified TAPPYARD Diamonds saved right to your browser.',
    ],
  },
  puzzle: {
    category: 'Puzzle',
    slug: 'puzzle',
    heading: 'Free Brain & Math Puzzle Games',
    metaTitle: 'Free Brain & 2048 Puzzle Games - Instant Play',
    metaDescription:
      'Challenge your mind with free puzzle browser games like 2048 Neon Fusion and Cupcake 2048. Play unblocked logic and merge puzzles with no download.',
    ogImage: '/og/2048-puzzle-og.png',
    accentBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    introParagraphs: [
      'Our Puzzle category gathers clean, responsive strategy and number-merging browser games crafted for quick mental workouts at home, school, or work. Every puzzle runs directly in your browser using lightweight HTML5 state engines with zero lag, responsive directional swipes on mobile, and snappy Arrow Key or WASD support on desktop.',
      'Choose between the crisp high-contrast neon numbers of 2048 Neon Fusion or the colorful dessert tiers in Cupcake 2048. Both titles let you practice classic monotonic corner strategy, listen to harmonic pentatonic merge chimes, earn TAPPYARD Diamonds on high-tier merges, and spend diamonds on tactical Undo moves whenever an accidental slide threatens your board.',
    ],
  },
  relaxing: {
    category: 'Relaxing',
    slug: 'relaxing',
    heading: 'Free Relaxing & Stress-Relief Games',
    metaTitle: 'Free Relaxing Block Puzzle Games - Instant Play',
    metaDescription:
      'Unwind with free relaxing browser games and soothing 10x10 block puzzles. Play at your own pace with acoustic chimes, zero timers, and no downloads.',
    ogImage: '/og/color-zen-og.png',
    accentBadge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    introParagraphs: [
      'Not every browser game needs countdown clocks or frantic inputs. TAPPYARD’s Relaxing genre is designed for calm spatial flow, soothing sound synthesis, and thoughtful pacing without stress or artificial lives. You can pause mid-puzzle, step away at any moment, and pick back up right where you left off.',
      'Anchored by Block Grid Zen, our calming 10x10 polyomino placement puzzle invites you to fit geometric block clusters seamlessly onto an ambient neon board. Clearing full rows and columns synthesizes tranquil water chimes while magnetic drag offsets keep shapes clearly visible beneath your thumb on mobile phones and tablets.',
    ],
  },
  casual: {
    category: 'Casual',
    slug: 'casual',
    heading: 'Free Casual 1-Tap & Sorting Games',
    metaTitle: 'Free Casual 1-Tap & Sorting Games - Instant Play',
    metaDescription:
      'Jump into free casual browser games for quick breaks, featuring Conveyor Sort Rush shape sorting and Cyber Dash 1-tap flight with instant HTML5 loading.',
    ogImage: '/og/belt-sort-og.png',
    accentBadge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    introParagraphs: [
      'Casual games on TAPPYARD are purpose-built for one-handed phone sessions and quick desktop breaks where every second counts. Each game teaches itself visually within three seconds and rewards rhythm, anticipation, and clean accuracy rather than complex multi-button menus.',
      'Test your reflexes in Conveyor Sort Rush by sorting approaching circles, squares, triangles, and unlockable purple diamonds into matching glossy bins—timing drops inside the gold Perfect Zone for x2 multipliers, triggering Slow-Mo and Freeze power-ups, or competing in the seeded 60-second Daily Run. Or launch Cyber Dash to thread laser corridors with rhythmic 1-tap flaps and near-miss diamond grazes.',
    ],
  },
};

export function generateStaticParams() {
  return GAME_CATEGORIES.map((c) => ({ slug: c.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cfg = CATEGORY_CONFIGS[slug.toLowerCase()];
  if (!cfg) {
    return {
      title: 'Game Category Not Found - TAPPYARD Games',
      description: 'Browse all free online browser game categories on TAPPYARD including arcade runners, 2048 puzzles, relaxing grids, and casual reflex games.',
      robots: { index: false, follow: true },
    };
  }

  const url = `${SITE_URL}/category/${cfg.slug}`;
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${cfg.metaTitle} | TAPPYARD`,
      description: cfg.metaDescription,
      url,
      type: 'website',
      images: [{ url: cfg.ogImage, width: 1200, height: 630, alt: cfg.heading }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      images: [cfg.ogImage],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cfg = CATEGORY_CONFIGS[slug.toLowerCase()];
  if (!cfg) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/category/${cfg.slug}`;
  const games = getGamesByCategory(cfg.category);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: cfg.category, url: pageUrl },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="sticky top-0 z-40 h-14 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandIcon className="w-6 h-6" />
          <span className="typo-logo text-lg text-white">
            TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
          </span>
        </Link>
        <Link
          href="/"
          className="typo-button inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Games</span>
        </Link>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        <nav aria-label="Breadcrumb" className="typo-nav flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">TAPPYARD</Link>
          <span>/</span>
          <span className="text-white font-medium">{cfg.category}</span>
        </nav>

        <section className="flex flex-col gap-4 border-b border-slate-800/80 pb-6">
          <span className={`typo-label w-fit inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wider border ${cfg.accentBadge}`}>
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{cfg.category} Games</span>
          </span>
          <h1 className="typo-h1 text-2xl sm:text-4xl text-white font-bold">
            {cfg.heading}
          </h1>
          <div className="space-y-3 max-w-4xl">
            {cfg.introParagraphs.map((para, i) => (
              <p key={i} className="typo-body text-sm text-slate-300 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="typo-section-heading text-lg sm:text-xl text-white">
            Play {cfg.category} Games Free ({games.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="pt-6 border-t border-slate-800/80 flex flex-col gap-3">
          <h2 className="typo-section-heading text-base text-white">Browse Other Categories</h2>
          <div className="flex flex-wrap gap-2.5">
            {GAME_CATEGORIES.map((c) => {
              const s = c.toLowerCase();
              const active = s === cfg.slug;
              return (
                <Link
                  key={c}
                  href={`/category/${s}`}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    active
                      ? 'bg-pink-500 text-white border-pink-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-pink-500/40 hover:text-white'
                  }`}
                >
                  {c} Games
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
