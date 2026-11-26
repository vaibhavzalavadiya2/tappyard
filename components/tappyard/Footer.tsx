import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import BrandIcon from './BrandIcon';
import { GAME_CATEGORIES, GAMES_CATALOGUE } from '@/data/games';

export default function Footer() {
  const categoryLabels: Record<string, string> = {
    Arcade: '3D Arcade Runners',
    Puzzle: 'Brain & Math Puzzles',
    Relaxing: 'Relaxing Stress Relief Games',
    Casual: '1-Tap Reflex & Sorting Games',
  };

  const getHoverClass = (id: string) => {
    switch (id) {
      case 'jelly-bounce':
        return 'hover:text-cyan-400';
      case 'belt-sort':
        return 'hover:text-sky-400';
      case '2048-puzzle':
        return 'hover:text-amber-400';
      case 'color-zen':
        return 'hover:text-teal-400';
      case 'cupcake-2048':
        return 'hover:text-pink-400';
      default:
        return 'hover:text-purple-400';
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#070b13] py-6 sm:py-10 text-slate-400">
      <div className="container xl:px-5 px-4">
        <div className="flex flex-col lg:gap-8 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-6 border-b border-slate-800/60">
            {/* Col 1: Brand & Value Prop */}
            <div className="flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0 w-fit">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-pink-500/20 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full bg-[#0d1322] rounded-[6px] sm:rounded-[12px] flex items-center justify-center p-1.5">
                    <BrandIcon className="w-full h-full group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="typo-logo text-xl sm:text-2xl text-white flex items-center gap-0.5">
                    TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">YARD</span>
                  </span>
                  <span className="typo-label text-[10px] tracking-widest text-slate-400 uppercase -mt-1">
                    Instant Browser Games
                  </span>
                </div>
              </Link>
              <p className="typo-body text-xs text-slate-400">
                Play free online browser games with zero downloads or installs. 100% native HTML5 Canvas and WebGL games on mobile, tablet, and PC.
              </p>
              <div className="typo-label tracking-normal flex items-center gap-2 text-[11px] text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Play • 100% Free • No Downloads</span>
              </div>
            </div>

            {/* Col 2: Catalogue-Driven Popular Games */}
            <div className="flex flex-col gap-2.5">
              <h4 className="typo-section-heading text-xs uppercase tracking-wider text-slate-200">
                Popular Games
              </h4>
              <ul className="typo-nav flex flex-col gap-1.5 text-xs">
                {GAMES_CATALOGUE.map((game) => (
                  <li key={game.id}>
                    <Link
                      href={game.route}
                      className={`${getHoverClass(game.id)} transition-colors`}
                    >
                      {game.title} ({game.category})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Real Category Pages */}
            <div className="flex flex-col gap-2.5">
              <h4 className="typo-section-heading text-xs uppercase tracking-wider text-slate-200">
                Game Genres
              </h4>
              <ul className="typo-nav flex flex-col gap-1.5 text-xs">
                {GAME_CATEGORIES.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/category/${category.toLowerCase()}`}
                      className="hover:text-white transition-colors"
                    >
                      {categoryLabels[category] || category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Platform & Company Links */}
            <div className="flex flex-col gap-2.5">
              <h4 className="typo-section-heading text-xs uppercase tracking-wider text-slate-200">
                Platform &amp; Info
              </h4>
              <p className="typo-body text-xs text-slate-400">
                Built with Next.js 16, React, HTML5 2D Canvas, Phaser WebGL rendering, and the Web Audio API.
              </p>
              <ul className="typo-nav flex flex-wrap gap-x-4 gap-y-1.5 text-xs pt-1">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="typo-meta flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400">
            <p className="text-center sm:text-left text-xs text-slate-400">
              © 2026 TAPPYARD. All rights reserved.
              <span className="hidden md:inline"> Play free instant browser games online.</span>
            </p>
            <div className="typo-label tracking-normal flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400">
              <Link href="/about" className="hover:text-slate-200 transition-colors">About</Link>
              <span className="text-slate-600">•</span>
              <Link href="/contact" className="hover:text-slate-200 transition-colors">Contact</Link>
              <span className="text-slate-600">•</span>
              <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
              <span className="text-slate-600">•</span>
              <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
