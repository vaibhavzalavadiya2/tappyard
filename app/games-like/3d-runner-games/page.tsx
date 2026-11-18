import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import { GAMES_CATALOGUE } from '@/data/games';
import { ArrowLeft, CheckCircle2, Play, Trophy, Zap } from 'lucide-react';

const SITE_URL = 'https://tappyard.com';
const PAGE_URL = `${SITE_URL}/games-like/3d-runner-games`;

export const metadata: Metadata = {
  title: 'Games Like Run 3, Slope & Subway Surfers',
  description:
    'Looking for games like Run 3, Slope or Subway Surfers? Play Jump Jelly Jump! free in your browser. 3D endless runner with booster pads and no downloads.',
  keywords: [
    'games like run 3',
    'games like slope',
    'games like subway surfers',
    'games like temple run',
    'games like going balls',
    'run 3 alternative',
    'slope alternative',
    '3D endless runner',
    '3D runner game',
    'running games',
    'TAPPYARD',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Games Like Run 3, Slope & Subway Surfers | TAPPYARD',
    description:
      'Looking for games like Run 3, Slope or Subway Surfers? Play Jump Jelly Jump! free in your browser. 3D endless runner with booster pads and no downloads.',
    url: PAGE_URL,
    type: 'article',
    images: ['/og/jelly-bounce-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games Like Run 3, Slope & Subway Surfers',
    description:
      'Looking for games like Run 3, Slope or Subway Surfers? Play Jump Jelly Jump! free in your browser. 3D endless runner with booster pads and no downloads.',
    images: ['/og/jelly-bounce-og.png'],
  },
};

export default function GamesLike3DRunnersPage() {
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
        name: '3D Runner Games',
        item: PAGE_URL,
      },
    ],
  };

  const otherGames = GAMES_CATALOGUE.filter((g) => g.id !== 'jelly-bounce');

  return (
    <div className="min-h-screen flex flex-col bg-[#05141c] text-slate-100 selection:bg-pink-500 selection:text-white">
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
          <Link href="/#catalogue" className="hover:text-white transition-colors">
            Similar Games
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-300 font-medium">3D Runner Games</span>
        </nav>

        {/* Page Header with Single H1 */}
        <header className="flex flex-col gap-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="typo-label inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Zap className="w-3.5 h-3.5" />
              Genre Guide & Comparison
            </span>
          </div>
          <h1 className="typo-h1 text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
            Games Like Run 3, Slope and Subway Surfers: Free 3D Runners
          </h1>
          <p className="typo-body text-sm sm:text-base text-slate-300 leading-relaxed">
            If you love 3D runner games like Run 3, the adrenaline rush of Slope, and the endless track navigation
            of Subway Surfers, you understand the thrill of testing your steering reflexes across suspended runways.
            Discover what defines the 3D endless runner genre and how Jump Jelly Jump! delivers high-speed browser action with zero installs.
          </p>
        </header>

        {/* Play Jump Jelly Jump CTA Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-cyan-950/40 border border-cyan-500/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
              3D
            </div>
            <div>
              <h2 className="typo-section-heading text-base sm:text-lg text-white font-semibold">
                Play Jump Jelly Jump! — Free 3D Speed Runner
              </h2>
              <p className="typo-body text-xs text-slate-300 mt-0.5">
                Steer your jelly cube over neon runways, hit booster pads across chasms, and collect diamonds.
              </p>
            </div>
          </div>
          <Link
            href="/games/jelly-bounce"
            className="typo-button inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 shadow-md shadow-cyan-500/20 active:scale-95 transition-all shrink-0 w-full sm:w-auto cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Jump Jelly Jump!</span>
          </Link>
        </div>

        {/* Section 1: The Evolution of 3D Running Games */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            The Evolution of 3D Runner Games: From Flash Tunnels to Modern WebGL
          </h2>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            Few game styles match the immediate visual satisfaction of 3D running games. Starting with early Flash
            classics like Run 3 and later modern browser hits like Slope and mobile sensations like Subway Surfers,
            Temple Run, and Going Balls, the appeal has always been rooted in forward momentum and spatial precision.
          </p>
          <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
            Players are suspended in dynamic perspective tracks where falling off the edge or mistiming a jump over
            a chasm ends the run. Modern WebGL engines have revitalized the genre by bringing smooth 60fps physics,
            rich particle lighting, and low-latency touch controls straight to web browsers without plugins.
          </p>
        </section>

        {/* Section 2: Comparison Analysis */}
        <section className="flex flex-col gap-4">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            How Jump Jelly Jump! Compares to Popular 3D Runners
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900/80 text-white font-semibold">
                <tr>
                  <th className="p-3 border-b border-slate-800">Runner Game</th>
                  <th className="p-3 border-b border-slate-800">Core Mechanic</th>
                  <th className="p-3 border-b border-slate-800">Platform</th>
                  <th className="p-3 border-b border-slate-800">Chasm / Jump Mechanics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                <tr>
                  <td className="p-3 font-medium text-cyan-300">Jump Jelly Jump! (TAPPYARD)</td>
                  <td className="p-3">Horizontal drag steering with magnetic bumpers</td>
                  <td className="p-3 text-emerald-300">Instant Browser (WebGL)</td>
                  <td className="p-3">Booster chevron pads launch cube over chasms</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Run 3</td>
                  <td className="p-3">Tunnel rotation & gravity switching</td>
                  <td className="p-3">Flash / HTML5 portal</td>
                  <td className="p-3">Manual jumping across empty tile holes</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Slope</td>
                  <td className="p-3">Rolling ball physics down steep decline</td>
                  <td className="p-3">WebGL browser</td>
                  <td className="p-3">Continuous ramp descent without pads</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Subway Surfers</td>
                  <td className="p-3">3-lane swiping, rolling, and barrier jumping</td>
                  <td className="p-3">Mobile App Download</td>
                  <td className="p-3">Swipe up to jump over barricades and trains</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="typo-meta text-[11px] text-slate-400">
            *Note: Run 3, Slope, and Subway Surfers are trademarks of their respective creators. Jump Jelly Jump! is an original independent web game by TAPPYARD.
          </p>
        </section>

        {/* Section 3: Unique Features of Jump Jelly Jump! */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
            What Makes Jump Jelly Jump! Special on TAPPYARD?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
              <span className="font-semibold text-cyan-300 text-sm">1. Chevron Booster Pads</span>
              <p className="typo-body text-xs text-slate-300 leading-relaxed">
                Rather than relying on manual jump keys that fail on touchscreen lag, Jump Jelly Jump! places glowing
                booster chevron pads along the runway. Steer directly onto a pad to launch your jelly cube over chasms.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
              <span className="font-semibold text-cyan-300 text-sm">2. Four Dynamic Thematic Zones</span>
              <p className="typo-body text-xs text-slate-300 leading-relaxed">
                As your distance counter climbs in meters, the sky and runway seamlessly transition across Teal Canyon
                (0m), Golden Desert (400m), Crimson Gorge (900m), and Cyber Horizon (1500m).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
              <span className="font-semibold text-cyan-300 text-sm">3. Collectible Diamonds & Skins</span>
              <p className="typo-body text-xs text-slate-300 leading-relaxed">
                Gather cyan diamonds scattered across the track to unlock five distinct jelly character skins:
                Cyan Drop, Lemon Cube, Grape Candy, Emerald Mint, and Rainbow Aura in the menu shop.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-1.5">
              <span className="font-semibold text-cyan-300 text-sm">4. Responsive Touch Steering</span>
              <p className="typo-body text-xs text-slate-300 leading-relaxed">
                Engineered for mobile touchscreens as well as desktop mouse cursors, with magnetic track rails that
                prevent jarring drops while still punishing reckless edge oversteering.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Tips for Surviving Past 1000 Meters */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-3">
          <h2 className="typo-section-heading text-lg sm:text-xl text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Mastering the 3D Speed Runner: Distance Tips</span>
          </h2>
          <ul className="space-y-2 typo-body text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Look Toward the Horizon:</strong> Fix your eyes on the distant horizon rather than right in front of your cube so you can spot upcoming chasms early.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Center Alignment:</strong> Re-center your jelly cube immediately after landing from a booster leap to prepare for unexpected obstacle placements.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Diamond Greed Caution:</strong> Never risk falling into the void for a stray diamond. Consistent distance yields far more diamonds over the long run.</span>
            </li>
          </ul>
          <div className="pt-3">
            <Link
              href="/games/jelly-bounce"
              className="typo-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play Jump Jelly Jump! Free in Your Browser</span>
            </Link>
          </div>
        </section>

        {/* Other Games on TAPPYARD */}
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
