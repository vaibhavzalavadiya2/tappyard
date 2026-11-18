import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import { GAMES_CATALOGUE } from '@/data/games';
import { ArrowLeft, BookOpen, CheckCircle2, Play } from 'lucide-react';

const SITE_URL = 'https://tappyard.com';
const PAGE_URL = `${SITE_URL}/guides/2048-strategy`;

export const metadata: Metadata = {
  title: '2048 Strategy: How to Win 2048 - Tips and Tricks',
  description:
    'Master 2048 with the corner strategy, chain building, and tile management. Practical tips and tricks to reach the 2048 tile and higher scores.',
  keywords: [
    '2048 strategy',
    'how to win 2048',
    '2048 tips and tricks',
    '2048 corner strategy',
    'what happens after 2048',
    'how to play 2048',
    '2048 rules',
    '2048 with undo',
    'number merge game',
    'TAPPYARD',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: '2048 Strategy: How to Win 2048 - Tips and Tricks | TAPPYARD',
    description:
      'Master 2048 with the corner strategy, chain building, and tile management. Practical tips and tricks to reach the 2048 tile and higher scores.',
    url: PAGE_URL,
    type: 'article',
    images: ['/og/2048-puzzle-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2048 Strategy: How to Win 2048 - Tips and Tricks',
    description:
      'Master 2048 with the corner strategy, chain building, and tile management. Practical tips and tricks to reach the 2048 tile and higher scores.',
    images: ['/og/2048-puzzle-og.png'],
  },
};

export default function Strategy2048Page() {
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
        name: 'Game Guides',
        item: `${SITE_URL}/#catalogue`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '2048 Strategy',
        item: PAGE_URL,
      },
    ],
  };

  const otherGames = GAMES_CATALOGUE.filter((g) => g.id !== '2048-puzzle');

  return (
    <div className="min-h-screen flex flex-col bg-[#08111a] text-slate-100 selection:bg-pink-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* Breadcrumb Nav */}
        <nav aria-label="Breadcrumb" className="typo-nav flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            TAPPYARD
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/games/2048-puzzle" className="hover:text-white transition-colors">
            2048 Neon Fusion
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-amber-300 font-medium">2048 Strategy Guide</span>
        </nav>

        {/* Page Header with Single H1 */}
        <header className="flex flex-col gap-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="typo-label inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              Comprehensive Strategy Guide
            </span>
          </div>
          <h1 className="typo-h1 text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
            2048 Strategy: How to Win 2048 (Tips and Tricks)
          </h1>
          <p className="typo-body text-sm sm:text-base text-slate-300 leading-relaxed">
            Reaching the 2048 tile is not a matter of luck. By understanding the core mathematical rules and
            executing the proven 2048 corner strategy, any player can consistently win 2048 and push for 4096
            and beyond. This guide breaks down the essential tactics, tile placement rules, and recovery techniques.
          </p>
        </header>

        {/* Play Now Hero Callout Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-amber-950 font-black text-lg shadow-lg shrink-0">
              2048
            </div>
            <div>
              <h2 className="typo-section-heading text-base sm:text-lg text-white font-semibold">
                Practice These Strategies on 2048 Neon Fusion
              </h2>
              <p className="typo-body text-xs text-slate-300 mt-0.5">
                Free browser edition featuring neon visual feedback, musical merge chimes, and 5 diamond undos.
              </p>
            </div>
          </div>
          <Link
            href="/games/2048-puzzle"
            className="typo-button inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 shadow-md shadow-amber-500/20 active:scale-95 transition-all shrink-0 w-full sm:w-auto cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play 2048 Free Now</span>
          </Link>
        </div>

        {/* Section 1: The Basic Rules & Mechanics */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            1. Understanding the 2048 Rules & Board Math
          </h2>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            2048 takes place on a strict 4x4 grid with exactly 16 cells. Every swipe slides all eligible tiles
            in that direction as far as they can travel. When two tiles sharing identical values collide, they
            merge into one tile possessing their sum (2 + 2 = 4, 4 + 4 = 8, 8 + 8 = 16, up to 1024 + 1024 = 2048).
            After every move, the game spawns a new random tile (a 2 roughly 90% of the time, or a 4 roughly 10%
            of the time). When the grid fills completely with no adjacent matching tiles, the run ends in game over.
          </p>
        </section>

        {/* Section 2: The Cornerstone Tactic */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            2. The 2048 Corner Strategy: Pick One Corner and Never Move
          </h2>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            The fundamental cornerstone of high-level 2048 strategy is corner anchoring. Pick a single corner
            at the start of your game (for example, the bottom-left corner) and keep your highest-value tile parked
            there at all times.
          </p>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="font-semibold text-amber-300">Why the corner strategy works:</p>
            <p>
              When your highest number stays stationary in a corner, it cannot be accidentally surrounded by small
              2s and 4s that block it from merging. By keeping the anchor solid, all newly spawned numbers can flow
              systematically toward that single focal point.
            </p>
          </div>
        </section>

        {/* Section 3: Monotonic Rows & Chain Building */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            3. Build Monotonic Chains Along the Anchor Wall
          </h2>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            Once your biggest number is safely in the bottom-left corner, structure the remaining tiles in that
            bottom row in strictly descending order from left to right. For example:
          </p>
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-center font-display font-bold text-xs sm:text-sm my-1">
            <span className="w-14 h-12 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center shadow">1024</span>
            <span className="text-slate-500">→</span>
            <span className="w-14 h-12 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow">512</span>
            <span className="text-slate-500">→</span>
            <span className="w-14 h-12 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow">256</span>
            <span className="text-slate-500">→</span>
            <span className="w-14 h-12 rounded-lg bg-indigo-700 text-white flex items-center justify-center shadow">128</span>
          </div>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            This creates a domino effect. When you create another 128 in the row directly above, you can collapse
            it down to merge 128 + 128 = 256, then 256 + 256 = 512, and finally 512 + 512 = 1024, culminating
            in the victorious 2048 tile in a single fluid sequence.
          </p>
        </section>

        {/* Section 4: The 3-Direction Rule */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            4. The Three-Direction Rule: Avoid Swiping in the Prohibited Direction
          </h2>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            If your target corner is bottom-left, you should almost exclusively swipe <strong>LEFT</strong>,
            <strong>DOWN</strong>, and occasionally <strong>RIGHT</strong> when safe. You must <strong>NEVER swipe UP</strong>.
          </p>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            Swiping UP pulls your 1024 or 512 tile upward out of the corner, and a new random 2 will immediately
            spawn underneath it in the corner you just vacated. This trap leaves your anchor stranded and breaks
            your chain, often leading to a premature game over within the next five moves.
          </p>
        </section>

        {/* Section 5: Using Undos and Recovery */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            5. How to Play 2048 with Undo Moves for Safe Practice
          </h2>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            In 2048 Neon Fusion on TAPPYARD, players can utilize the <strong>Undo move</strong> feature (costing 5
            universal diamonds) to reverse accidental swipes. If an involuntary swipe dislodges your corner tile,
            hit Undo immediately before making any subsequent move. This gives you a safe learning environment to
            master complex monotonic chains without throwing away a 30-minute run.
          </p>
        </section>

        {/* Section 6: What Happens After 2048 */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            6. What Happens After 2048? Pushing for 4096 and 8192
          </h2>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            When you successfully merge two 1024 tiles into 2048, the game celebrates your victory with bonus
            diamonds and an achievement badge. However, the game does not force you to stop. You can click
            <strong> Keep Playing</strong> to continue into endless mode. Advanced players use the snake-chain
            pattern to create a 4096 tile and push for the theoretical 4x4 maximum tile of 131,072.
          </p>
        </section>

        {/* Section 7: Key Summary Checklist */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-3">
          <h2 className="typo-section-heading text-lg sm:text-xl text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>2048 Strategy Quick Checklist</span>
          </h2>
          <ul className="space-y-2 typo-body text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Anchor Corner:</strong> Commit to one corner (bottom-left) and never lift your largest tile out.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Descending Row:</strong> Arrange the bottom row in monotonic descending sequence (e.g. 1024, 512, 256, 128).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Restricted Swipes:</strong> Use only Left and Down whenever possible. Swipe Right only when the bottom row is completely full.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Never Swipe Up:</strong> An upward swipe spawns an unmergeable 2 under your anchor tile.</span>
            </li>
          </ul>
          <div className="pt-3">
            <Link
              href="/games/2048-puzzle"
              className="typo-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch 2048 Neon Fusion & Test Your Strategy</span>
            </Link>
          </div>
        </section>

        {/* Play Other Free Browser Games on TAPPYARD */}
        <section className="flex flex-col gap-4 pt-4 border-t border-slate-800">
          <h2 className="typo-section-heading text-xl text-white">
            More Free Instant Games on TAPPYARD
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherGames.map((game) => (
              <Link
                key={game.id}
                href={game.route}
                className="group p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col gap-2.5"
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

        {/* Back Link */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
          <Link href="/" className="typo-button inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to TAPPYARD Homepage</span>
          </Link>
          <span>© 2026 TAPPYARD</span>
        </div>

      </main>

      <Footer />
    </div>
  );
}
