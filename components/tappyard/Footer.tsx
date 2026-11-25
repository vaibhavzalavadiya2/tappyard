import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import BrandIcon from './BrandIcon';

export default function Footer() {
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
                Play free online browser games with zero downloads or installs. 100% native HTML5 and WebGL games on mobile, tablet, and PC.
              </p>
              <div className="typo-label tracking-normal flex items-center gap-2 text-[11px] text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Play • 100% Free • No Downloads</span>
              </div>
            </div>

            {/* Col 2: Free Online Games */}
            <div className="flex flex-col gap-2.5">
              <h4 className="typo-section-heading text-xs uppercase tracking-wider text-slate-200">
                Popular Games
              </h4>
              <ul className="typo-nav flex flex-col gap-1.5 text-xs">
                <li>
                  <Link href="/games/jelly-bounce" className="hover:text-cyan-400 transition-colors">
                    Jump Jelly Jump! (3D Runner)
                  </Link>
                </li>
                <li>
                  <Link href="/games/2048-puzzle" className="hover:text-amber-400 transition-colors">
                    2048 Neon Fusion (Puzzle)
                  </Link>
                </li>
                <li>
                  <Link href="/games/color-zen" className="hover:text-teal-400 transition-colors">
                    Block Grid Zen (10x10 Blocks)
                  </Link>
                </li>
                <li>
                  <Link href="/games/quick-tap" className="hover:text-purple-400 transition-colors">
                    Cyber Dash (Reflex Flight)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div className="flex flex-col gap-2.5">
              <h4 className="typo-section-heading text-xs uppercase tracking-wider text-slate-200">
                Game Genres
              </h4>
              <ul className="typo-nav flex flex-col gap-1.5 text-xs">
                <li>
                  <a href="/#catalogue" className="hover:text-white transition-colors">
                    3D Arcade Runners
                  </a>
                </li>
                <li>
                  <a href="/#catalogue" className="hover:text-white transition-colors">
                    Brain & Math Puzzles
                  </a>
                </li>
                <li>
                  <a href="/#catalogue" className="hover:text-white transition-colors">
                    Relaxing Stress Relief Games
                  </a>
                </li>
                <li>
                  <a href="/#catalogue" className="hover:text-white transition-colors">
                    1-Tap Reflex & Rhythm Games
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Platform & Technology */}
            <div className="flex flex-col gap-2.5">
              <h4 className="typo-section-heading text-xs uppercase tracking-wider text-slate-200">
                Platform Features
              </h4>
              <p className="typo-body text-xs text-slate-400">
                Built on Next.js 16, Phaser 3D, and the Web Audio API with 0 kB external assets. Fast 60fps performance across iOS Safari, Android Chrome, and desktop browsers.
              </p>
            </div>
          </div>
          <div className="typo-meta flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400">
            <p className="text-center sm:text-left text-xs text-slate-400">
              © 2026 TAPPYARD. All rights reserved.
              <span className="hidden md:inline"> Play free instant browser games online.</span>
            </p>
            <div className="typo-label tracking-normal flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400">
              <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
              <span className="text-slate-600">•</span>
              <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
              <span className="text-slate-600">•</span>
              <span>HTML5 Games</span>
              <span className="text-slate-600">•</span>
              <span>Mobile Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
