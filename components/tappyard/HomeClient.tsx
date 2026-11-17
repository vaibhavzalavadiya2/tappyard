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
  CheckCircle2,
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
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 py-3 sm:py-6 flex flex-col gap-5 sm:gap-8">
        
        {/* Semantic H1 for SEO */}
        <h1 className="sr-only">
          Free Online Games — Play Instant Browser Games No Download | TAPPYARD
        </h1>

        {/* Hot Games Circular Stories Row (now.gg style) */}
        {!searchQuery && <HotGamesRow />}

        {/* Featured Multi-Game Carousel Banner (only show when not actively searching) */}
        {!searchQuery && selectedCategory === 'All' && <HeroFeatured />}

        {/* CrazyGames-style Instant Play Value Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-pink-900/40 border border-purple-500/30 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <span>PLAY INSTANTLY</span>
                <span className="text-[10px] text-pink-300 font-bold bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/40">
                  NO DOWNLOADS
                </span>
              </span>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                100% native HTML5 & WebGL browser games. Silky 60fps on mobile & PC.
              </p>
            </div>
          </div>
          <Link
            href="/games/jelly-bounce"
            className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-md shadow-pink-500/20 active:scale-95 transition-all shrink-0 w-full sm:w-auto"
          >
            <span>Play Jelly 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recently Played ("Jump Back In") */}
        {!searchQuery && <RecentlyPlayed />}

        {/* Games Catalogue Section */}
        <section id="catalogue" className="flex flex-col gap-4 sm:gap-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500/15 text-pink-400 border border-pink-500/30">
                  <Flame className="w-3 h-3 text-pink-400" />
                  Popular Games
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
                <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />
                <span>Top Games Today</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
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
            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800 shadow-sm">
              <span className="truncate">
                Found <strong className="text-pink-400 font-bold">{filteredGames.length}</strong> {filteredGames.length === 1 ? 'game' : 'games'}
                {searchQuery && (
                  <span> for &ldquo;<span className="text-white font-semibold">{searchQuery}</span>&rdquo;</span>
                )}
                {selectedCategory !== 'All' && (
                  <span> in <span className="text-purple-400 font-semibold">{selectedCategory}</span></span>
                )}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-pink-400 hover:text-pink-300 font-bold ml-3 shrink-0 cursor-pointer text-xs"
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
              <h3 className="text-base font-bold text-white mb-1">No games found</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                No games match &ldquo;{searchQuery}&rdquo;. Try another keyword or clear filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-pink-500 hover:bg-pink-400 transition-colors cursor-pointer shadow-md shadow-pink-500/20"
              >
                Show All Games
              </button>
            </div>
          )}
        </section>

        {/* SEO Information & FAQ Section for Search Engines & Users */}
        <section id="faq" className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col gap-6 text-slate-400 text-xs sm:text-sm leading-relaxed scroll-mt-20">
          
          {/* Key Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700/80 transition-colors flex flex-col gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
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
              <h3 className="text-sm sm:text-base font-bold text-white">
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
              <h3 className="text-sm sm:text-base font-bold text-white">
                100% Free & Unblocked
              </h3>
              <p className="leading-relaxed">
                Play completely free browser games online with no subscriptions, accounts, or paywalls. Accessible over secure HTTPS for quick casual gaming breaks anywhere.
              </p>
            </div>
          </div>

          {/* About TAPPYARD Content Module */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/30 border border-slate-800/70 flex flex-col gap-3">
            <h2 className="text-base sm:text-xl font-black text-white">
              Play Free Online Browser Games on TAPPYARD
            </h2>
            <p className="leading-relaxed">
              Welcome to <strong className="text-white">TAPPYARD</strong>, your digital playground for high-performance, instant web games. Whether you are searching for an exhilarating 3D speed runner, a brain-stimulating math puzzle, or a soothing stress-relief game during a break, our games start in under a second with zero installation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-cyan-500/30 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <Link href="/games/jelly-bounce" className="font-bold text-cyan-300 hover:underline">
                    Jump Jelly Jump! (3D Speed Runner)
                  </Link>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Steer your jelly cube across suspended floating tracks, collect diamonds, and launch across endless chasms with booster chevron pads.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-amber-500/30 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <Link href="/games/2048-puzzle" className="font-bold text-amber-300 hover:underline">
                    2048 Neon Fusion (Sliding Puzzle)
                  </Link>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Silky swipe controls with glowing neon tiles, musical merge chimes, and diamond undos to reach the legendary 2048 tile.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-teal-500/30 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <Link href="/games/color-zen" className="font-bold text-teal-300 hover:underline">
                    Block Grid Zen (10x10 Block Puzzle)
                  </Link>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Soothing polyomino spatial puzzle designed for stress relief. Pop full lines with relaxing chime synthesizers and zero timers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-purple-500/30 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <Link href="/games/quick-tap" className="font-bold text-purple-300 hover:underline">
                    Cyber Dash (1-Tap Reflex Flight)
                  </Link>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Fast-paced 1-tap neon flight runner. Dodge pulsing laser gates, graze edges for bonus score, and trigger protective shields.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions (Matches FAQPage JSON-LD) */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/30 border border-slate-800/70 flex flex-col gap-4">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-400" />
              <span>Frequently Asked Questions (FAQ)</span>
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  Are all games on TAPPYARD completely free to play?
                </h4>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  Yes! Every game on TAPPYARD is 100% free to play directly in your web browser. There are no paywalls, hidden in-app purchases, or subscription fees.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  Do I need to download or install any files to play?
                </h4>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  No download, install, or registration is required. All games run instantly using modern HTML5, Canvas, and WebGL technology in Chrome, Safari, Firefox, Edge, and mobile browsers.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  Can I play TAPPYARD games on mobile phones and tablets?
                </h4>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  Yes. All TAPPYARD games are built mobile-first with responsive touch controls, full-screen support, and zero horizontal lag for iPhone, iPad, Android phones, and tablets.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  Are TAPPYARD games unblocked at school and work?
                </h4>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">
                  Yes, TAPPYARD games run safely over standard secure HTTPS in your browser with zero executable downloads, making them ideal for quick casual gaming breaks on any network.
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
