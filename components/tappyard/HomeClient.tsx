'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/tappyard/Navbar';
import HotGamesRow from '@/components/tappyard/HotGamesRow';
import HeroFeatured from '@/components/tappyard/HeroFeatured';
import CategoryPills from '@/components/tappyard/CategoryPills';
import GameCard from '@/components/tappyard/GameCard';
import RecentlyPlayed from '@/components/tappyard/RecentlyPlayed';
import MobileBottomNav from '@/components/tappyard/MobileBottomNav';
import Footer from '@/components/tappyard/Footer';
import {
  GAMES_CATALOGUE,
  GAME_CATEGORIES,
  getGamesByCategory,
  searchGames,
  type GameCategory,
} from '@/data/games';
import { HOME_FAQS } from '@/data/homeFaqs';
import {
  Gamepad2,
  SearchX,
  Zap,
  Smartphone,
  Sparkles,
  HelpCircle,
  Flame,
  ArrowRight,
} from 'lucide-react';

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'All'>('All');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Filtered games
  const filteredGames = useMemo(() => {
    return searchGames(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Game counts for category pills
  const gameCounts = useMemo(() => {
    const counts: Record<string, number> = { All: GAMES_CATALOGUE.length };
    GAME_CATEGORIES.forEach((cat) => {
      counts[cat] = GAMES_CATALOGUE.filter((g) => g.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 pb-20 md:pb-0 overflow-x-hidden">
      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        mobileMenuOpen={mobileDrawerOpen}
        onToggleMobileMenu={() => setMobileDrawerOpen(!mobileDrawerOpen)}
      />

      <main className="flex-1">

        {/* Hot Games Circular Stories Row (now.gg style) */}
        {!searchQuery && <HotGamesRow />}

        {/* Featured Multi-Game Carousel Banner (only show when not actively searching) */}
        {!searchQuery && selectedCategory === 'All' && <HeroFeatured />}

        {/* Games Catalogue Section */}
        <section id="catalogue" className="flex flex-col gap-4 sm:gap-6 scroll-mt-20 container xl:px-5 px-4 lg:pt-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="typo-label inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-pink-500/15 text-pink-400 border border-pink-500/30">
                  <Flame className="w-3 h-3 text-pink-400" />
                  Popular Games
                </span>
              </div>
              <h2 className="typo-section-heading text-xl sm:text-3xl text-white flex items-center gap-2 mt-1">
                <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />
                <span>Top Games Today</span>
              </h2>
              <p className="typo-body text-xs sm:text-sm text-slate-400 mt-0.5">
                Instant casual, arcade, and relaxing browser games. 100% free, tap to play.
              </p>
            </div>

            {/* CrazyGames-Style Mood & Category Filter Chips */}
            <CategoryPills
              categories={['All', ...GAME_CATEGORIES]}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              gameCounts={gameCounts}
            />
          </div>

          {/* Active Search / Filter Status */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="typo-meta flex items-center justify-between text-xs text-slate-400 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="truncate">
                Found <strong className="text-pink-400 font-semibold">{filteredGames.length}</strong> {filteredGames.length === 1 ? 'game' : 'games'}
                {searchQuery && (
                  <span> for &ldquo;<span className="text-white font-medium">{searchQuery}</span>&rdquo;</span>
                )}
                {selectedCategory !== 'All' && (
                  <span> in <span className="text-purple-400 font-medium">{selectedCategory}</span></span>
                )}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="typo-button text-pink-400 hover:text-pink-300 ml-3 shrink-0 cursor-pointer text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Games Grid: 2 columns on mobile, 3 on tablet, 4 on desktop (now.gg & CrazyGames style) */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {filteredGames.map((game, idx) => (
                <div
                  key={game.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-3 text-slate-400">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="typo-section-heading text-base text-white mb-1">No games found</h3>
              <p className="typo-body text-xs text-slate-400 max-w-xs mb-4">
                No games match &ldquo;{searchQuery}&rdquo;. Try another keyword or clear filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="typo-button px-5 py-2.5 rounded-xl text-xs text-white bg-pink-500 hover:bg-pink-400 transition-colors cursor-pointer shadow-md shadow-pink-500/20"
              >
                Show All Games
              </button>
            </div>
          )}
        </section>

        {/* Recently Played Section (placed below catalogue to eliminate above-the-fold layout shift) */}
        {!searchQuery && <RecentlyPlayed />}

        {/* SEO Information & FAQ Section for Search Engines & Users */}
        <section id="faq" className="typo-body mt-8 mb-8 pt-8 border-t border-slate-800/80 text-slate-400 text-xs sm:text-sm scroll-mt-20">
          <div className="container xl:px-5 px-4">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-4 lg:p-5 rounded-xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700/80 transition-colors flex flex-col gap-2.5 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="typo-section-heading text-sm sm:text-base text-white">
                    Instant Play (No Download)
                  </h3>
                  <p className="leading-relaxed">
                    Zero waiting time and zero app store downloads. All TAPPYARD games run immediately in your browser via HTML5, Canvas, and WebGL with 0 kB external asset overhead.
                  </p>
                </div>

                <div className="p-4 lg:p-5 rounded-xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700/80 transition-colors flex flex-col gap-2.5 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="typo-section-heading text-sm sm:text-base text-white">
                    Mobile & Desktop Ready
                  </h3>
                  <p className="leading-relaxed">
                    Silky 60fps gameplay with responsive touch swipe controls on iPhone, iPad, and Android, as well as mouse and keyboard controls on desktop PC and Mac.
                  </p>
                </div>

                <div className="p-4 lg:p-5 rounded-xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700/80 transition-colors flex flex-col gap-2.5 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="typo-section-heading text-sm sm:text-base text-white">
                    100% Free & Unblocked
                  </h3>
                  <p className="leading-relaxed">
                    Play completely free browser games online with no subscriptions, accounts, or paywalls. Accessible over secure HTTPS for quick casual gaming breaks anywhere.
                  </p>
                </div>
              </div>
              <div className="p-4 sm:p-6 rounded-xl bg-slate-900/30 border border-slate-800/70 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h1 className="typo-h1 text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
                    Free Online Browser Games: Play Instantly, No Download
                  </h1>
                  <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Welcome to TAPPYARD, the destination for free browser games you can enjoy instantly on any device.
                    If you are looking for fun games to play online without downloading software or installing apps, our
                    library runs natively in your browser using HTML5 Canvas and WebGL technology. Jump into fast-paced
                    arcade runners, 1-tap reflex games, number merges, shape sorting, and spatial puzzles across mobile
                    browsers on iOS and Android as well as desktop computers. Experience instant play with zero waiting
                    time, zero storage footprint, and complete freedom to play anytime. Explore all {GAMES_CATALOGUE.length} original browser games across our {GAME_CATEGORIES.length} genres below:
                  </p>
                </div>

                {/* In-page Genre Sections driven directly from catalogue data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {GAME_CATEGORIES.map((category) => {
                    const gamesInGenre = getGamesByCategory(category);
                    const meta: Record<
                      GameCategory,
                      {
                        id: string;
                        heading: string;
                        description: string;
                        titleClass: string;
                        borderClass: string;
                        badgeClass: string;
                        btnClass: string;
                      }
                    > = {
                      Arcade: {
                        id: 'arcade-runners',
                        heading: '3D Arcade Runners',
                        description:
                          'Steer along suspended runways, collect cyan diamonds, and hit booster pads to clear endless chasms across dynamic environmental zones.',
                        titleClass: 'text-cyan-300',
                        borderClass: 'hover:border-cyan-500/40',
                        badgeClass: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
                        btnClass: 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/40',
                      },
                      Puzzle: {
                        id: 'puzzle-games',
                        heading: 'Brain & Math Puzzles',
                        description:
                          'Slide matching number and dessert tiles across 4x4 matrices, listen to harmonic merge chimes, and plan ahead to reach 2048.',
                        titleClass: 'text-amber-300',
                        borderClass: 'hover:border-amber-500/40',
                        badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
                        btnClass: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40',
                      },
                      Relaxing: {
                        id: 'relaxing-games',
                        heading: 'Relaxing Stress Relief Games',
                        description:
                          'Enjoy soothing 10x10 geometric polyomino block puzzles with zero timers, acoustic chimes, and satisfying full line clears.',
                        titleClass: 'text-teal-300',
                        borderClass: 'hover:border-teal-500/40',
                        badgeClass: 'text-teal-400 bg-teal-950/60 border-teal-500/30',
                        btnClass: 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-400/40',
                      },
                      Casual: {
                        id: 'reflex-games',
                        heading: '1-Tap Reflex & Sorting Games',
                        description:
                          'Test your timing in rapid conveyor belt shape sorting or neon tunnel flight! Chain Perfect Zone combos or dodge laser gates.',
                        titleClass: 'text-purple-300',
                        borderClass: 'hover:border-purple-500/40',
                        badgeClass: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
                        btnClass: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/40',
                      },
                    };
                    const m = meta[category];
                    return (
                      <article
                        key={category}
                        id={m.id}
                        className={`scroll-mt-24 flex flex-col gap-2 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 ${m.borderClass} transition-colors`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Link href={`/category/${category.toLowerCase()}`}>
                            <h2 className={`typo-section-heading text-sm sm:text-base ${m.titleClass} hover:underline`}>
                              {m.heading}
                            </h2>
                          </Link>
                          <Link
                            href={`/category/${category.toLowerCase()}`}
                            className={`typo-label text-[10px] px-2 py-0.5 rounded-full border ${m.badgeClass}`}
                          >
                            {category}
                          </Link>
                        </div>
                        <p className="typo-body text-slate-300 text-xs leading-relaxed">
                          {m.description}
                        </p>
                        <div className="pt-2 mt-auto flex flex-wrap items-center gap-2">
                          {gamesInGenre.map((game) => (
                            <Link
                              key={game.id}
                              href={game.route}
                              className={`typo-button text-xs text-white border px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors ${m.btnClass}`}
                            >
                              <span>{game.title}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Game Guides & Similar Games Section */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
                  <h3 className="typo-section-heading text-sm sm:text-base text-white">
                    Game Strategy Guides &amp; Similar Games
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    <Link
                      href="/guides/2048-strategy"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-amber-300 block mb-0.5">2048 Strategy Guide</span>
                      <span className="text-[11px] text-slate-400">Tips, tricks, and the corner strategy to win 2048 →</span>
                    </Link>
                    <Link
                      href="/guides/conveyor-sort-tips"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-sky-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-sky-300 block mb-0.5">Conveyor Sort Tips</span>
                      <span className="text-[11px] text-slate-400">Perfect Zone combos, waves &amp; Daily Run mastery →</span>
                    </Link>
                    <Link
                      href="/guides/cupcake-2048-strategy"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-pink-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-pink-300 block mb-0.5">Cupcake 2048 Strategy</span>
                      <span className="text-[11px] text-slate-400">Reach the Diamond Crown Cupcake faster →</span>
                    </Link>
                    <Link
                      href="/games-like/2048"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-amber-300 block mb-0.5">Games Like 2048</span>
                      <span className="text-[11px] text-slate-400">Free Neon &amp; Cupcake 2048 puzzle editions →</span>
                    </Link>
                    <Link
                      href="/games-like/conveyor-sort"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-sky-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-sky-300 block mb-0.5">Games Like Conveyor Sort</span>
                      <span className="text-[11px] text-slate-400">Fast shape sorting arcade with combos &amp; daily runs →</span>
                    </Link>
                    <Link
                      href="/games-like/slope"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-cyan-300 block mb-0.5">Games Like Slope</span>
                      <span className="text-[11px] text-slate-400">Fast 3D browser runners with zero downloads →</span>
                    </Link>
                    <Link
                      href="/games-like/tetris"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-teal-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-teal-300 block mb-0.5">Games Like Tetris</span>
                      <span className="text-[11px] text-slate-400">Shape placement &amp; line-clearing brain teasers →</span>
                    </Link>
                    <Link
                      href="/games-like/block-blast"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-teal-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-teal-300 block mb-0.5">Games Like Block Blast</span>
                      <span className="text-[11px] text-slate-400">Free 10x10 block puzzle browser alternative →</span>
                    </Link>
                    <Link
                      href="/games-like/flappy-bird"
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-purple-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="font-semibold text-purple-300 block mb-0.5">Games Like Flappy Bird</span>
                      <span className="text-[11px] text-slate-400">Free 1-tap neon reflex flight game with shields →</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 rounded-xl bg-slate-900/30 border border-slate-800/70 flex flex-col gap-4">
                <h2 className="typo-section-heading text-base sm:text-lg text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-pink-400" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <div className="space-y-3">
                  {HOME_FAQS.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                      <h3 className="typo-section-heading text-white text-xs sm:text-sm">
                        {faq.question}
                      </h3>
                      <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onOpenMenu={() => setMobileDrawerOpen(true)}
      />
    </div>
  );
}
