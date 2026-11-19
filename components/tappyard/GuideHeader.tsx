import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import BrandIcon from './BrandIcon';

interface GuideHeaderProps {
  gameTitle?: string;
  gameHref: string;
  guideTitle?: string;
  accentColor?: 'amber' | 'purple' | 'teal' | 'cyan' | 'pink';
}

export default function GuideHeader({
  gameTitle = '2048',
  gameHref = '/games/2048-puzzle',
  guideTitle,
  accentColor = 'amber',
}: GuideHeaderProps) {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'purple':
        return {
          btn: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-purple-500/25',
          borderHover: 'hover:border-purple-500/50',
          glow: 'after:via-purple-500/40',
        };
      case 'teal':
        return {
          btn: 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-teal-950 shadow-teal-500/25',
          borderHover: 'hover:border-teal-500/50',
          glow: 'after:via-teal-500/40',
        };
      case 'cyan':
        return {
          btn: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/25',
          borderHover: 'hover:border-cyan-500/50',
          glow: 'after:via-cyan-500/40',
        };
      case 'pink':
        return {
          btn: 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white shadow-pink-500/25',
          borderHover: 'hover:border-pink-500/50',
          glow: 'after:via-pink-500/40',
        };
      case 'amber':
      default:
        return {
          btn: 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 shadow-amber-500/25',
          borderHover: 'hover:border-amber-500/50',
          glow: 'after:via-amber-500/40',
        };
    }
  };

  const accent = getAccentStyles();

  return (
    <header className={`sticky top-0 z-40 h-15 sm:h-17 bg-[#08111a]/90 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between safe-top select-none transition-colors relative after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent ${accent.glow} after:to-transparent`}>
      <div className="max-w-6xl lg:px-5 px-4 flex items-center justify-between w-full h-full mx-auto">
        {/* Left: Back to Home */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className={`typo-nav group/back inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 ${accent.borderHover} transition-all active:scale-95 shadow-xs cursor-pointer`}
            aria-label="Back to TAPPYARD Home"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover/back:text-white group-hover/back:-translate-x-0.5 transition-transform" />
            <BrandIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline text-slate-400 font-normal">Back to</span>
            <span className="typo-logo text-white">
              TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
            </span>
          </Link>

          {guideTitle && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 pl-2 border-l border-slate-800">
              <span className="truncate max-w-[200px] lg:max-w-xs text-white font-medium">
                {guideTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right: Instant Play CTA */}
        <Link
          href={gameHref}
          className={`typo-button inline-flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-4 rounded-full text-xs font-bold ${accent.btn} shadow-md active:scale-95 transition-all cursor-pointer shrink-0`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Play {gameTitle} Free</span>
          <span className="sm:hidden">Play Free</span>
        </Link>
      </div>
    </header>
  );
}
