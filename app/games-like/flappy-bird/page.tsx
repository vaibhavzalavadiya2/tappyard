import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import GuideHeader from '@/components/tappyard/GuideHeader';
import { GAMES_CATALOGUE } from '@/data/games';
import { ArrowLeft, CheckCircle2, Play, Trophy, Zap } from 'lucide-react';

const SITE_URL = 'https://tappyard.com';
const PAGE_URL = `${SITE_URL}/games-like/flappy-bird`;

export const metadata: Metadata = {
  title: 'Games Like Flappy Bird - Free 1-Tap Games Online',
  description:
    'Looking for games like Flappy Bird? Play Cyber Dash free in your browser. 1-tap neon flight, laser gate dodging, and bonus diamonds with no download.',
  keywords: [
    'games like flappy bird',
    'flappy bird alternative',
    'flappy bird style game',
    'one tap games',
    'tap to fly game',
    'reflex games',
    'one tap flying game',
    'TAPPYARD',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Games Like Flappy Bird - Free 1-Tap Games Online | TAPPYARD',
    description:
      'Looking for games like Flappy Bird? Play Cyber Dash free in your browser. 1-tap neon flight, laser gate dodging, and bonus diamonds with no download.',
    url: PAGE_URL,
    type: 'article',
    images: ['/og/quick-tap-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games Like Flappy Bird - Free 1-Tap Games Online',
    description:
      'Looking for games like Flappy Bird? Play Cyber Dash free in your browser. 1-tap neon flight, laser gate dodging, and bonus diamonds with no download.',
    images: ['/og/quick-tap-og.png'],
  },
};

export default function GamesLikeFlappyBirdPage() {
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
        name: 'Games Like Flappy Bird',
        item: PAGE_URL,
      },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Games Like Flappy Bird - Free 1-Tap Games Online',
    description:
      'Looking for games like Flappy Bird? Play Cyber Dash free in your browser. 1-tap neon flight, laser gate dodging, and bonus diamonds with no download.',
    url: PAGE_URL,
    image: `${SITE_URL}/og/quick-tap-og.png`,
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

  const otherGames = GAMES_CATALOGUE.filter((g) => g.id !== 'quick-tap');

  return (
    <div className="min-h-screen flex flex-col bg-[#08020e] text-slate-100 selection:bg-pink-500 selection:text-white">
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
        gameTitle="Cyber Dash"
        gameHref="/games/quick-tap"
        guideTitle="Games Like Flappy Bird"
        accentColor="purple"
      />

      {/* Main Container */}
      <main className="flex-1">
        <div className="max-w-6xl w-full mx-auto px-4 xl:px-5 py-6 sm:py-8">
          <div className="flex flex-col lg:gap-8 gap-6">

            {/* Breadcrumb Nav */}
            <nav aria-label="Breadcrumb" className="typo-nav flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">
                TAPPYARD
              </Link>
              <span className="text-slate-600">/</span>
              <Link href="/#catalogue" className="hover:text-white transition-colors">
                Similar Games
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-purple-300 font-medium">Games Like Flappy Bird</span>
            </nav>

            {/* Page Header with Single H1 */}
            <div className="flex flex-col gap-3 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="typo-label inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  <Zap className="w-3.5 h-3.5" />
                  1-Tap Reflex Genre Guide
                </span>
              </div>
              <h1 className="typo-h1 text-2xl sm:text-3xl lg:text-4xl text-white font-bold">
                Games Like Flappy Bird: Free 1-Tap Games in Your Browser
              </h1>
              <p className="typo-body text-sm sm:text-base text-slate-300 leading-relaxed">
                Few video games have achieved the worldwide cultural phenomenon of Flappy Bird. If you are searching for
                games like Flappy Bird to test your reflex rhythm in your web browser with no downloads, explore how
                Cyber Dash on TAPPYARD evolves the one tap flight formula into a neon cyber runner with close-graze diamond bonuses and revival shields.
              </p>
            </div>

            {/* Play Cyber Dash CTA Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/40 border border-purple-500/30 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                  ⚡
                </div>
                <div>
                  <h2 className="typo-section-heading text-base sm:text-lg text-white font-semibold">
                    Play Cyber Dash: Free 1-Tap Reflex Flight
                  </h2>
                  <p className="typo-body text-xs text-slate-300 mt-0.5">
                    Tap anywhere to flutter, dodge pulsing laser gates, graze edges for bonus diamonds, and trigger shields.
                  </p>
                </div>
              </div>
              <Link
                href="/games/quick-tap"
                className="typo-button inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-md shadow-purple-500/20 active:scale-95 transition-all shrink-0 w-full sm:w-auto cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Cyber Dash Free</span>
              </Link>
            </div>

            {/* Section 1: The Magic of One-Tap Flight Games */}
            <section className="flex flex-col gap-3">
              <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
                Why the 1-Tap Flight Formula Remains Irresistible
              </h2>
              <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
                When Flappy Bird launched in 2013, it proved that the simplest control scheme imaginable—a single tap
                anywhere on screen—could create one of the most addicting, high-intensity gaming loops in history.
                Gravity is constantly pulling you downward; every tap generates a burst of upward lift.
              </p>
              <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
                The tension comes from navigating narrow gaps between upper and lower obstacles. A fraction of a second
                too early or too late results in a crash. It is pure, unfiltered skill and rhythm where your reflexes are
                the only factor separating a score of 5 from a personal best of 50.
              </p>
            </section>

            {/* Section 2: Comparing Classic Flappy Bird to Cyber Dash */}
            <section className="flex flex-col gap-4">
              <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
                Feature Comparison: Flappy Bird vs. Cyber Dash
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-900/80 text-white font-semibold">
                    <tr>
                      <th className="p-3 border-b border-slate-800">Feature</th>
                      <th className="p-3 border-b border-slate-800 text-purple-300">Cyber Dash (TAPPYARD)</th>
                      <th className="p-3 border-b border-slate-800 text-slate-400">Classic Flappy Bird</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                    <tr>
                      <td className="p-3 font-medium text-white">Visual Style</td>
                      <td className="p-3 text-cyan-300">Futuristic neon laser tunnel with particle bursts</td>
                      <td className="p-3">Retro 8-bit green pipes and blue sky</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Platform & Access</td>
                      <td className="p-3 text-emerald-300">Instant web browser (no downloads, 100% free)</td>
                      <td className="p-3">Removed from official app stores in 2014</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Close Graze Mechanic</td>
                      <td className="p-3 text-amber-300">Yes! Skimming within 18px of lasers earns bonus diamonds</td>
                      <td className="p-3">No graze rewards (binary pass/fail)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Revival Shield Powerup</td>
                      <td className="p-3 text-cyan-300">Yes (Spend 5 diamonds for a 2.5s invulnerable shield)</td>
                      <td className="p-3">Instant permanent game over upon contact</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-white">Controls</td>
                      <td className="p-3">Tap screen, Left Click, Spacebar, or Up Arrow</td>
                      <td className="p-3">Touchscreen tap only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="typo-meta text-[11px] text-slate-400">
                *Note: Flappy Bird is a trademark of its original creator, Dong Nguyen. Cyber Dash is an independent original web game by TAPPYARD.
              </p>
            </section>

            {/* Section 3: Modern Enhancements in Cyber Dash */}
            <section className="flex flex-col gap-3">
              <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
                Modern Enhancements in Cyber Dash
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-purple-300 text-sm">1. High-Reward Close Grazing</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    In classic flappers, you always want to stay dead center. Cyber Dash introduces risky excitement:
                    passing dangerously close to a laser gate edge triggers a &ldquo;Close Graze&rdquo; alert and awards
                    bonus diamonds.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-purple-300 text-sm">2. 2.5-Second Protective Shields</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    Instead of losing a record-breaking streak to a single micro-mistake, you can spend 5 diamonds to
                    revive with a glowing cyan forcefield that protects you through the next obstacle.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-purple-300 text-sm">3. Evolving Tunnel Environments</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    As your score passes milestones of 10, 25, and 50 cleared gates, the particle lighting, laser frequencies,
                    and background cyber themes shift dynamically.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
                  <span className="font-semibold text-purple-300 text-sm">4. Multi-Input Desktop & Mobile Freedom</span>
                  <p className="typo-body text-xs text-slate-300 leading-relaxed">
                    Play on your phone using intuitive 1-tap touch controls, or enjoy mechanical precision on desktop
                    using your spacebar, mouse click, or up arrow key.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Tips for High Scores */}
            <section className="lg:p-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-3">
              <h2 className="typo-section-heading text-lg sm:text-xl text-white flex items-center gap-2">
                <span>Reflex Tips for Setting a New Record in Cyber Dash</span>
              </h2>
              <ul className="space-y-2 typo-body text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Short, Measured Taps:</strong> Quick micro-taps maintain altitude much more reliably than long, spaced-out taps that create violent rollercoaster drops.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Pre-Align Before Obstacles:</strong> Line up your craft with the upcoming laser gate opening as early as possible so you are gliding level when you pass through.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Use the Revival Shield Strategically:</strong> When you crash past gate 20, use your 5-diamond revival immediately. The 2.5-second shield gives you free passage through the next laser.</span>
                </li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/games/quick-tap"
                  className="typo-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Cyber Dash Free in Your Browser</span>
                </Link>
              </div>
            </section>

            {/* Other Games on TAPPYARD */}
            <section className="flex flex-col gap-4 pt-4 border-t border-slate-800">
              <h2 className="typo-section-heading text-xl text-white">
                More Free Instant Games on TAPPYARD
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
