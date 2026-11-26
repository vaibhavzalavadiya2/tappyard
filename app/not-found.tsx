import Link from 'next/link';
import { ArrowLeft, Gamepad2, Home } from 'lucide-react';
import { GAMES_CATALOGUE } from '@/data/games';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import Footer from '@/components/tappyard/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Top Simple Header */}
      <header className="h-16 border-b border-slate-800 bg-[#090d16]/90 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="typo-logo text-xl text-white">
            TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
          </span>
        </Link>
        <Link
          href="/"
          className="typo-button inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Homepage</span>
        </Link>
      </header>

      {/* Main 404 Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-xl">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <span className="typo-label text-xs uppercase tracking-widest text-pink-400 font-semibold">
            404 - Page Not Found
          </span>
          <h1 className="typo-h1 text-3xl sm:text-4xl text-white font-bold">
            Looking for a Game?
          </h1>
          <p className="typo-body text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            The page or game URL you requested is not available. Play one of our free instant browser games
            below with zero downloads:
          </p>
        </div>

        {/* Featured Games Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {GAMES_CATALOGUE.map((game) => (
            <Link
              key={game.id}
              href={game.route}
              className="group p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col gap-2.5 text-left shadow-md"
            >
              <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-950 relative">
                <GameThumbnail id={game.thumbnail} title={game.title} />
              </div>
              <div>
                <span className="typo-label text-[10px] text-purple-300 uppercase tracking-wider block">
                  {game.category}
                </span>
                <h2 className="typo-game-title text-sm text-white group-hover:text-pink-300 transition-colors mt-0.5 font-semibold">
                  {game.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link href="/category/arcade" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-xs text-slate-300 hover:text-white">
            Arcade
          </Link>
          <Link href="/category/puzzle" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-xs text-slate-300 hover:text-white">
            Puzzle
          </Link>
          <Link href="/category/relaxing" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-400/40 text-xs text-slate-300 hover:text-white">
            Relaxing
          </Link>
          <Link href="/category/casual" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-400/40 text-xs text-slate-300 hover:text-white">
            Casual
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="typo-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to TAPPYARD Homepage</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
