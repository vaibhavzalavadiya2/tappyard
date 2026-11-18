import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import BrandIcon from './BrandIcon';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#070b13] py-8 sm:py-12 px-4 sm:px-6 lg:px-10 text-slate-400">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-8">
        
        {/* Top: Brand & Game Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-6 border-b border-slate-800/60">
          
          {/* Col 1: Brand & Value Prop */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center p-1 shadow-md">
                <BrandIcon className="w-full h-full" />
              </div>
              <span className="typo-logo text-white text-lg">
                TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
              </span>
            </div>
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

        {/* Bottom Bar: Copyright & Badges */}
        <div className="typo-meta flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 TAPPYARD. All rights reserved. Play free instant browser games online.</p>
          <div className="typo-label tracking-normal flex items-center gap-4 text-[11px] text-slate-400">
            <span>HTML5 Games</span>
            <span>•</span>
            <span>WebGL 3D</span>
            <span>•</span>
            <span>Mobile Ready</span>
            <span>•</span>
            <span>No Downloads</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
