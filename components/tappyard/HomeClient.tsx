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
  searchGames,
  type GameCategory,
} from '@/data/games';
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

      {/* Main Content Area: Full-width container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 py-3 sm:py-6 flex flex-col gap-6 sm:gap-10">

        {/* Hot Games Circular Stories Row (now.gg style) */}
        {!searchQuery && <HotGamesRow />}

        {/* Featured Multi-Game Carousel Banner (only show when not actively searching) */}
        {!searchQuery && selectedCategory === 'All' && <HeroFeatured />}
        {/* Recently Played ("Jump Back In") */}
        {!searchQuery && <RecentlyPlayed />}

        {/* Games Catalogue Section */}
        <section id="catalogue" className="flex flex-col gap-4 sm:gap-6 scroll-mt-20">
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
            <div className="typo-meta flex items-center justify-between text-xs text-slate-400 bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800 shadow-sm">
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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

        {/* SEO Information & FAQ Section for Search Engines & Users */}
        <section id="faq" className="typo-body mt-8 pt-8 border-t border-slate-800/80 flex flex-col gap-6 text-slate-400 text-xs sm:text-sm scroll-mt-20">

          {/* Key Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700/80 transition-colors flex flex-col gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="typo-section-heading text-sm sm:text-base text-white">
                Instant Play (No Download)
              </h3>
              <p className="leading-relaxed">
                Zero waiting time and zero app store downloads. All TAPPYARD games run immediately in your browser via HTML5, Canvas, and WebGL with 0 kB external asset overhead.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700/80 transition-colors flex flex-col gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="typo-section-heading text-sm sm:text-base text-white">
                Mobile & Desktop Ready
              </h3>
              <p className="leading-relaxed">
                Silky 60fps gameplay with responsive touch swipe controls on iPhone, iPad, and Android, as well as mouse and keyboard controls on desktop PC and Mac.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700/80 transition-colors flex flex-col gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
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

          {/* About TAPPYARD Content & In-Page Genre Sections */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/30 border border-slate-800/70 flex flex-col gap-6">
            <header className="flex flex-col gap-3">
              <h1 className="typo-h1 text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
                Free Online Browser Games: Play Instantly, No Download
              </h1>
              <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
                Welcome to TAPPYARD, the destination for free browser games you can enjoy instantly on any device.
                If you are looking for fun games to play online without downloading software or installing apps, our
                library runs natively in your browser using modern WebGL and HTML5 technology. Jump into fast-paced
                online arcade games like our 3D runner Jump Jelly Jump! and 1-tap reflex flyer Cyber Dash, or challenge
                your mind with classic number merge and block placement puzzles like 2048 Neon Fusion and Block Grid Zen.
                Every title delivers smooth 60fps performance across mobile browser games on iOS and Android as well as
                desktop computers. Experience truly instant play games with zero waiting time, zero storage footprint,
                and complete freedom to play anytime. Explore our four main game genres below:
              </p>
            </header>

            {/* In-page Genre Sections with IDs and H2s */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Genre 1: 3D Arcade Runners */}
              <article id="arcade-runners" className="scroll-mt-24 flex flex-col gap-2 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="typo-section-heading text-sm sm:text-base text-cyan-300">
                    3D Arcade Runners
                  </h2>
                  <span className="typo-label text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Arcade
                  </span>
                </div>
                <p className="typo-body text-slate-300 text-xs leading-relaxed">
                  Steer along suspended runways, collect diamonds, and hit booster pads to clear endless chasms across dynamic environmental zones.
                </p>
                <div className="pt-2 mt-auto flex items-center justify-between">
                  <Link
                    href="/games/jelly-bounce"
                    className="typo-button text-xs text-white bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Jump Jelly Jump! - 3D endless runner</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </Link>
                </div>
              </article>

              {/* Genre 2: Brain & Math Puzzles */}
              <article id="puzzle-games" className="scroll-mt-24 flex flex-col gap-2 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="typo-section-heading text-sm sm:text-base text-amber-300">
                    Brain & Math Puzzles
                  </h2>
                  <span className="typo-label text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Puzzle
                  </span>
                </div>
                <p className="typo-body text-slate-300 text-xs leading-relaxed">
                  Slide matching number tiles across a 4x4 matrix, listen to harmonic merge chimes, and plan moves carefully to reach the 2048 tile with diamond undos.
                </p>
                <div className="pt-2 mt-auto flex items-center justify-between">
                  <Link
                    href="/games/2048-puzzle"
                    className="typo-button text-xs text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>2048 Neon Fusion - 2048 number puzzle</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>
              </article>

              {/* Genre 3: Relaxing Stress Relief Games */}
              <article id="relaxing-games" className="scroll-mt-24 flex flex-col gap-2 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-teal-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="typo-section-heading text-sm sm:text-base text-teal-300">
                    Relaxing Stress Relief Games
                  </h2>
                  <span className="typo-label text-[10px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/30">
                    Relaxing
                  </span>
                </div>
                <p className="typo-body text-slate-300 text-xs leading-relaxed">
                  Enjoy soothing 10x10 geometric polyomino block puzzles with zero timers, relaxing chime synthesis, and satisfying full line clears.
                </p>
                <div className="pt-2 mt-auto flex items-center justify-between">
                  <Link
                    href="/games/color-zen"
                    className="typo-button text-xs text-white bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Block Grid Zen - 10x10 block puzzle</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                  </Link>
                </div>
              </article>

              {/* Genre 4: 1-Tap Reflex & Rhythm Games */}
              <article id="reflex-games" className="scroll-mt-24 flex flex-col gap-2 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="typo-section-heading text-sm sm:text-base text-purple-300">
                    1-Tap Reflex & Rhythm Games
                  </h2>
                  <span className="typo-label text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                    Casual
                  </span>
                </div>
                <p className="typo-body text-slate-300 text-xs leading-relaxed">
                  Test your timing in fast-paced neon flight. Dodge pulsing laser gates, graze tight edges for bonus diamonds, and trigger protective shields.
                </p>
                <div className="pt-2 mt-auto flex items-center justify-between">
                  <Link
                    href="/games/quick-tap"
                    className="typo-button text-xs text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Cyber Dash - 1-tap reflex flyer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </Link>
                </div>
              </article>
            </div>

            {/* Game Guides & Comparative Articles Section */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <h3 className="typo-section-heading text-sm sm:text-base text-white">
                Game Strategy Guides & Similar Games
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <Link
                  href="/guides/2048-strategy"
                  className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-semibold text-amber-300 block mb-0.5">2048 Strategy Guide</span>
                  <span className="text-[11px] text-slate-400">Tips, tricks, and the corner strategy to win 2048 →</span>
                </Link>
                <Link
                  href="/games-like/block-blast"
                  className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-teal-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-semibold text-teal-300 block mb-0.5">Games Like Block Blast</span>
                  <span className="text-[11px] text-slate-400">Free 10x10 block puzzle browser alternative →</span>
                </Link>
                <Link
                  href="/games-like/3d-runner-games"
                  className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="font-semibold text-cyan-300 block mb-0.5">Games Like Run 3 & Slope</span>
                  <span className="text-[11px] text-slate-400">Free 3D endless runners with chasms & speed pads →</span>
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

          {/* Frequently Asked Questions (Matches FAQPage JSON-LD exactly) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/30 border border-slate-800/70 flex flex-col gap-4">
            <h2 className="typo-section-heading text-base sm:text-lg text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-400" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h3 className="typo-section-heading text-white text-xs sm:text-sm">
                  Are all games on TAPPYARD completely free to play?
                </h3>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  Yes. Every game on TAPPYARD is 100% free to play directly in your web browser with no paywalls, hidden in-app purchases, or subscription fees.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h3 className="typo-section-heading text-white text-xs sm:text-sm">
                  Do I need to download or install any files to play?
                </h3>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  No download, install, or registration is required. All games run instantly using modern HTML5, Canvas, and WebGL technology in Chrome, Safari, Firefox, Edge, and mobile browsers.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h3 className="typo-section-heading text-white text-xs sm:text-sm">
                  Can I play TAPPYARD games on mobile phones and tablets?
                </h3>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  Yes. All TAPPYARD games are built mobile-first with responsive touch controls, full-screen support, and zero horizontal scrolling on iPhone, iPad, Android phones, and tablets.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h3 className="typo-section-heading text-white text-xs sm:text-sm">
                  Do I need an account to play?
                </h3>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  No account, sign-up, or registration is required to play. Your highest scores, unlocked character skins, and diamond rewards save automatically to your local browser storage.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h3 className="typo-section-heading text-white text-xs sm:text-sm">
                  Are the games unblocked at school or work?
                </h3>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  Yes. TAPPYARD games run safely over standard secure HTTPS in your browser with zero executable downloads, making them accessible for casual gaming breaks on school and work networks.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h3 className="typo-section-heading text-white text-xs sm:text-sm">
                  What are good quick games to play when bored?
                </h3>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  For fast reflex fun, try Cyber Dash (1-tap flight) or Jump Jelly Jump! (3D speed runner). If you want mental stimulation, play 2048 Neon Fusion (number merge puzzle) or Block Grid Zen (10x10 spatial block puzzle). All four games start in under a second.
                </p>
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
