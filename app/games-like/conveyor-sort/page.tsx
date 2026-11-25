import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import GuideHeader from '@/components/tappyard/GuideHeader';
import { GAMES_CATALOGUE } from '@/data/games';
import { ArrowLeft, CheckCircle2, Play, Trophy, Zap } from 'lucide-react';

const SITE_URL = 'https://tappyard.com';
const PAGE_URL = `${SITE_URL}/games-like/conveyor-sort`;

export const metadata: Metadata = {
  title: 'Games Like Conveyor Sort - Free Shape Sorting',
  description:
    'Looking for games like Conveyor Sort? Play Conveyor Sort Rush free in your browser with fast shape sorting, x2 Perfect Zones, and Daily Runs.',
  keywords: [
    'games like conveyor sort',
    'conveyor belt sorting game',
    'shape sorting game online',
    'factory sorting arcade game',
    'fast reflex sorting game',
    'conveyor sort rush',
    'TAPPYARD',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Games Like Conveyor Sort - Free Shape Sorting | TAPPYARD',
    description:
      'Looking for games like Conveyor Sort? Play Conveyor Sort Rush free in your browser with fast shape sorting, x2 Perfect Zones, and Daily Runs.',
    url: PAGE_URL,
    type: 'article',
    images: ['/og/belt-sort-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games Like Conveyor Sort - Free Shape Sorting',
    description:
      'Looking for games like Conveyor Sort? Play Conveyor Sort Rush free in your browser with fast shape sorting, x2 Perfect Zones, and Daily Runs.',
    images: ['/og/belt-sort-og.png'],
  },
};

export default function GamesLikeConveyorSortPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'TAPPYARD',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Similar Games',
        item: `${SITE_URL}/#catalogue`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Games Like Conveyor Sort',
        item: PAGE_URL,
      },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Games Like Conveyor Sort - Free Shape Sorting',
    description:
      'Looking for games like Conveyor Sort? Play Conveyor Sort Rush free in your browser with fast shape sorting, x2 Perfect Zones, and Daily Runs.',
    url: PAGE_URL,
    image: `${SITE_URL}/og/belt-sort-og.png`,
    datePublished: '2026-11-25',
    dateModified: '2026-11-25',
    mainEntityOfPage: PAGE_URL,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'TAPPYARD Editorial Team',
      url: SITE_URL,
    },
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

  const otherGames = GAMES_CATALOGUE.filter((g) => g.id !== 'belt-sort');

  return (
    <div className="min-h-screen flex flex-col bg-[#080d24] text-slate-100 selection:bg-sky-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <GuideHeader
        gameTitle="Conveyor Sort Rush"
        gameHref="/games/belt-sort"
        guideTitle="Games Like Conveyor Sort"
        accentColor="cyan"
      />

      <main className="flex-1">
        <div className="max-w-6xl w-full mx-auto px-4 xl:px-5 py-6 sm:py-8">
          <div className="flex flex-col lg:gap-8 gap-6">
            <nav aria-label="Breadcrumb" className="typo-nav flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">
                TAPPYARD
              </Link>
              <span className="text-slate-600">/</span>
              <Link href="/#catalogue" className="hover:text-white transition-colors">
                Similar Games
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-sky-300 font-medium">Games Like Conveyor Sort</span>
            </nav>

            <div className="flex flex-col gap-3 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="typo-label inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  <Zap className="w-3.5 h-3.5" />
                  Shape &amp; Reflex Sorting Guide
                </span>
              </div>
              <h1 className="typo-h1 text-2xl sm:text-3xl lg:text-4xl text-white font-bold">
                Games Like Conveyor Sort: Free Shape Sorting Games in Your Browser
              </h1>
              <p className="typo-body text-sm sm:text-base text-slate-300 leading-relaxed">
                If you love fast-paced sorting arcade games, factory conveyor belt challenges, and color-shape reflex tests, Conveyor Sort Rush on TAPPYARD delivers an instant 60fps browser experience with zero downloads, tactile bins, Perfect Zone multipliers, and seeded Daily Runs.
              </p>
            </div>

            {/* Play CTA Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-indigo-950/60 border border-sky-400/35 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-lg">
                  <GameThumbnail id="belt-sort" title="Conveyor Sort Rush" />
                </div>
                <div>
                  <h2 className="typo-section-heading text-base sm:text-lg text-white font-semibold">
                    Play Conveyor Sort Rush: Instant Shape Sorting Arcade
                  </h2>
                  <p className="typo-body text-xs text-slate-300 mt-0.5">
                    Route Circle, Square, Triangle, and Diamond pieces into bins, charge Slow-Mo &amp; Freeze, and beat today&apos;s Daily Run!
                  </p>
                </div>
              </div>
              <Link
                href="/games/belt-sort"
                className="typo-button inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-yellow-400 shadow-md shadow-amber-500/20 active:scale-95 transition-all shrink-0 w-full sm:w-auto cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Conveyor Sort Rush Free</span>
              </Link>
            </div>

            <section className="flex flex-col gap-3">
              <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
                What Makes Conveyor Belt Sorting Games So Addictive?
              </h2>
              <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
                Great factory sorting games balance quick pattern recognition with risk-and-reward timing. Rather than tapping randomly as items appear, Conveyor Sort Rush challenges your composure with the glowing gold Perfect Zone: holding out until the bottom 18% of the belt doubles every point and powers up your Slow-Mo charge bar even faster.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sky-300 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mid-Run Evolution (25 &amp; 60 Sorts)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Starts accessible with 3 distinctive colored shape bins so anyone can jump in cleanly. Survive 25 sorts to add the 4th Purple Diamond bin, and cross 60 sorts to encounter x2 Wildcard Gold Stars and Belt Freeze Crystals.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                  <Trophy className="w-4 h-4" />
                  <span>Seeded 60-Second Daily Run &amp; Share Grid</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every calendar day generates one global seeded belt pattern so friends can compare scores, best combo chains, streaks, and emoji sort grids side-by-side.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-4 pt-2 border-t border-slate-800">
              <h2 className="typo-section-heading text-lg sm:text-xl text-white">
                More Free Arcade &amp; Puzzle Games on TAPPYARD
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {otherGames.map((g) => (
                  <Link
                    key={g.id}
                    href={g.route}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-400/50 transition-all flex flex-col gap-2"
                  >
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-950">
                      <GameThumbnail id={g.thumbnail} title={g.title} />
                    </div>
                    <span className="text-xs font-semibold text-white truncate">{g.title}</span>
                  </Link>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="typo-button inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to All TAPPYARD Games</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
