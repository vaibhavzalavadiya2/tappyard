import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import GuideHeader from '@/components/tappyard/GuideHeader';
import { GAMES_CATALOGUE } from '@/data/games';
import { ArrowLeft, CheckCircle2, Play, Sparkles, Trophy } from 'lucide-react';

const SITE_URL = 'https://tappyard.com';
const PAGE_URL = `${SITE_URL}/games-like/block-blast`;

export const metadata: Metadata = {
  title: 'Games Like Block Blast - Free Block Puzzle Games',
  description:
    'Looking for games like Block Blast? Play Block Grid Zen free in your browser with no download. 10x10 grid placement, relaxing chimes, and zero timers.',
  keywords: [
    'games like block blast',
    'block blast alternative',
    'block puzzle like block blast',
    '10x10 block puzzle',
    'free block puzzle',
    'relaxing puzzle games',
    'free puzzle games',
    'TAPPYARD',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Games Like Block Blast - Free Block Puzzle Games | TAPPYARD',
    description:
      'Looking for games like Block Blast? Play Block Grid Zen free in your browser with no download. 10x10 grid placement, relaxing chimes, and zero timers.',
    url: PAGE_URL,
    type: 'article',
    images: ['/og/color-zen-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games Like Block Blast - Free Block Puzzle Games',
    description:
      'Looking for games like Block Blast? Play Block Grid Zen free in your browser with no download. 10x10 grid placement, relaxing chimes, and zero timers.',
    images: ['/og/color-zen-og.png'],
  },
};

export default function GamesLikeBlockBlastPage() {
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
        name: 'Games Like Block Blast',
        item: PAGE_URL,
      },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Games Like Block Blast: Free Block Puzzle in Your Browser',
    description:
      'Looking for games like Block Blast? Play Block Grid Zen free in your browser. Soothing 10x10 block placement puzzle with relaxing chimes and no download.',
    url: PAGE_URL,
    image: `${SITE_URL}/og/color-zen-og.png`,
    datePublished: '2026-11-18',
    dateModified: '2026-11-19',
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

  const otherGames = GAMES_CATALOGUE.filter((g) => g.id !== 'color-zen');

  return (
    <div className="min-h-screen flex flex-col bg-[#041117] text-slate-100 selection:bg-pink-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Sticky Reader Navigation Header */}
      <GuideHeader
        gameTitle="Block Grid Zen"
        gameHref="/games/color-zen"
        guideTitle="Games Like Block Blast"
        accentColor="teal"
      />

      {/* Main Container */}
      <main className="flex-1">
        <div className="max-w-6xl w-full mx-auto px-4 xl:px-5 py-6 sm:py-8">
          <div className="flex flex-col lg:gap-8 gap-6">

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="typo-nav flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">
                TAPPYARD
              </Link>
              <span className="text-slate-600">/</span>
              <Link href="/#catalogue" className="hover:text-white transition-colors">
                Similar Games
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-teal-300 font-medium">Games Like Block Blast</span>
            </nav>

            {/* Page Header with Single H1 */}
            <div className="flex flex-col gap-3 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="typo-label inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Game Comparison & Discovery
                </span>
              </div>
              <h1 className="typo-h1 text-2xl sm:text-3xl lg:text-4xl text-white font-bold">
                Games Like Block Blast: Free Block Puzzle in Your Browser
              </h1>
              <p className="typo-body text-sm sm:text-base text-slate-300 leading-relaxed">
                If you enjoy the satisfying spatial satisfaction of Block Blast and are searching for games like
                Block Blast to play directly in your web browser with no app downloads or installs, discover
                how 10x10 block puzzles work and why Block Grid Zen on TAPPYARD offers an ideal browser alternative.
              </p>
            </div>

            {/* Play Block Grid Zen CTA Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-teal-950/40 border border-teal-500/30 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shrink-0">
                  10x10
                </div>
                <div>
                  <h2 className="typo-section-heading text-base sm:text-lg text-white font-semibold">
                    Play Block Grid Zen: The Free Browser Alternative
                  </h2>
                  <p className="typo-body text-xs text-slate-300 mt-0.5">
                    Instant 10x10 geometric polyomino puzzle with acoustic chimes, zero timers, and 5-gem shape rerolls.
                  </p>
                </div>
              </div>
              <Link
                href="/games/color-zen"
                className="typo-button inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-teal-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-md shadow-teal-500/20 active:scale-95 transition-all shrink-0 w-full sm:w-auto cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Block Grid Zen</span>
              </Link>
            </div>

            {/* Section 1: Why People Love Block Blast */}
            <section className="flex flex-col gap-3">
              <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
                What Makes Block Blast and 10x10 Block Puzzles So Addictive?
              </h2>
              <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
                Block Blast has captivated millions of players worldwide because it modernizes the classic falling-block
                concept into a calm, turn-based spatial placement puzzle. Instead of rushing against gravity as in
                classic arcade falling games, players receive polyomino shapes in sets of three and can take as long
                as they want to decide where each piece fits.
              </p>
              <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
                The core satisfaction comes from the &ldquo;combos&rdquo;—clearing multiple horizontal rows and vertical
                columns simultaneously. The visual and sound feedback of popping blocks triggers a soothing rhythm that
                makes block puzzle games ideal for stress relief and cognitive relaxation.
              </p>
            </section>

            {/* Section 2: Honest Comparison Table */}
            <section className="flex flex-col gap-4">
              <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
                Feature Comparison: Block Blast vs. Block Grid Zen
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-900/80 text-white font-semibold">
                    <tr>
                      <th className="p-3 border-b border-slate-800">Feature</th>
                      <th className="p-3 border-b border-slate-800 text-teal-300">Block Grid Zen (TAPPYARD)</th>
                      <th className="p-3 border-b border-slate-800 text-slate-400">Block Blast (Mobile App)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                    <tr>
                      <td className="p-3 font-medium text-white">Platform</td>
                      <td className="p-3 text-emerald-300">Web Browser (No Install Needed)</td>
                      <td className="p-3">iOS & Android App Store Download</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Grid Dimension</td>
                      <td className="p-3">10x10 Spatial Matrix</td>
                      <td className="p-3">8x8 Matrix</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Audio & Atmosphere</td>
                      <td className="p-3">Harmonic pentatonic acoustic chimes</td>
                      <td className="p-3">Arcade electronic pops</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Timer / Move Limits</td>
                      <td className="p-3">Zero timers (100% stress-free)</td>
                      <td className="p-3">No timer in classic mode</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Shape Reroll Feature</td>
                      <td className="p-3">Yes (Reroll tray for 5 diamonds)</td>
                      <td className="p-3">No reroll in standard mode</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Device Compatibility</td>
                      <td className="p-3">PC, Mac, iPhone, iPad, Android, Chromebook</td>
                      <td className="p-3">Mobile phones only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="typo-meta text-[11px] text-slate-400">
                *Note: Block Blast is a trademark of its respective developer. Block Grid Zen is an independent original web puzzle created by TAPPYARD.
              </p>
            </section>

            {/* Section 3: Key Mechanics in Block Grid Zen */}
            <section className="flex flex-col gap-3">
              <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
                Key Highlights of Block Grid Zen on TAPPYARD
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-teal-300 text-sm">1. Spacious 10x10 Canvas</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    With 100 total cells instead of 64, you have more strategic room to organize corners, create multi-line
                    traps, and accommodate massive 3x3 square blocks without running out of room unexpectedly.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-teal-300 text-sm">2. Zero App Store Friction</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    Play instantly on school laptops, work computers, or mobile web browsers. No 200 MB app updates,
                    no permissions, and no storage footprint.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-teal-300 text-sm">3. Tactile Audio Design</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    Every line clear synthesizes soothing harmonic audio frequencies via the Web Audio API, making it one of
                    the most satisfying relaxing puzzle games for evening wind-downs.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-teal-300 text-sm">4. Diamond Reroll Mechanic</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    Earn universal diamonds through daily rewards or by clearing streaks, then spend 5 diamonds to reroll
                    awkward pieces when the board is nearly full.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Tips for High Scores */}
            <section className="lg:p-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-3">
              <h2 className="typo-section-heading text-lg sm:text-xl text-white flex items-center gap-2">
                <span>How to Score 2,000+ Points in 10x10 Block Puzzles</span>
              </h2>
              <ul className="space-y-2 typo-body text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Prioritize the 3x3 Space:</strong> A 3x3 block requires a full 9-cell pocket. Always protect at least one 3x3 open zone on your board.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Double-Line Clears:</strong> Setting up a single piece to clear both a horizontal row and a vertical column yields significant combo multipliers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Edge Clustering:</strong> Pack irregular 4-block and 5-block shapes along outer edges so the open center remains available for emergency clears.</span>
                </li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/games/color-zen"
                  className="typo-button inline-flex items-center gap-2 lg:px-6 px-4 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Block Grid Zen Free in Your Browser</span>
                </Link>
              </div>
            </section>

            {/* Other Games */}
            <section className="flex flex-col gap-4 pt-4 border-t border-slate-800">
              <h2 className="typo-section-heading text-xl text-white">
                Explore More Free Games on TAPPYARD
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {otherGames.map((game) => (
                  <Link
                    key={game.id}
                    href={game.route}
                    className="group p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col gap-2.5"
                  >
                    <div className="w-full aspect-16/10 rounded-xl overflow-hidden bg-slate-950 relative">
                      <GameThumbnail id={game.thumbnail} title={game.title} />
                    </div>
                    <div>
                      <span className="typo-label text-[10px] text-purple-300 uppercase tracking-wider block">
                        {game.category}
                      </span>
                      <h3 className="typo-game-title text-sm text-white group-hover:text-pink-300 transition-colors mt-0.5 font-semibold">
                        {game.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
