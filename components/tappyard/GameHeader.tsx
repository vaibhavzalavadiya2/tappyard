'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ArrowLeft, Maximize2, Minimize2, Gem } from 'lucide-react';
import { getWalletDiamonds, subscribeWallet } from '@/lib/wallet';
import BrandIcon from './BrandIcon';

interface GameHeaderProps {
  title: string;
  category: string;
  icon?: ReactNode;
  onToggleFullscreen?: () => void;
}

export default function GameHeader({
  title,
  category,
  icon,
  onToggleFullscreen,
}: GameHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supportsFullscreen, setSupportsFullscreen] = useState(true);
  const [diamonds, setDiamonds] = useState<number | null>(null);

  useEffect(() => {
    try {
      const unsub = subscribeWallet((d) => setDiamonds(d));
      return () => unsub();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkFullscreenState = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = document as any;
      const fsEl =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;
      setIsFullscreen(Boolean(fsEl));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    const canFs = Boolean(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
    setSupportsFullscreen(canFs);
    checkFullscreenState();

    document.addEventListener('fullscreenchange', checkFullscreenState);
    document.addEventListener('webkitfullscreenchange', checkFullscreenState);
    document.addEventListener('mozfullscreenchange', checkFullscreenState);
    document.addEventListener('MSFullscreenChange', checkFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreenState);
      document.removeEventListener('webkitfullscreenchange', checkFullscreenState);
      document.removeEventListener('mozfullscreenchange', checkFullscreenState);
      document.removeEventListener('MSFullscreenChange', checkFullscreenState);
    };
  }, []);

  const handleFullscreen = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = document as any;
      const fsEl =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

      if (!fsEl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const target = (document.documentElement || document.body) as any;
        const requestMethod =
          target.requestFullscreen ||
          target.webkitRequestFullscreen ||
          target.mozRequestFullScreen ||
          target.msRequestFullscreen;

        if (requestMethod) {
          const promise = requestMethod.call(target);
          if (promise && typeof promise.then === 'function') {
            promise
              .then(() => {
                setIsFullscreen(true);
                setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
              })
              .catch((err: any) => {
                console.warn('Fullscreen request failed:', err);
              });
          }
        }
      } else {
        const exitMethod =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;

        if (exitMethod) {
          const promise = exitMethod.call(doc);
          if (promise && typeof promise.then === 'function') {
            promise
              .then(() => {
                setIsFullscreen(false);
                setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
              })
              .catch((err: any) => {
                console.warn('Exit fullscreen failed:', err);
              });
          }
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }

    if (onToggleFullscreen) onToggleFullscreen();
  }, [onToggleFullscreen]);

  // Press 'F' on keyboard for instant desktop fullscreen toggle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === 'f' || e.key === 'F') {
        handleFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFullscreen]);

  return (
    <header className="w-full max-w-full overflow-hidden h-12 sm:h-14 bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-800/80 px-2.5 sm:px-4 flex items-center justify-between gap-2 z-30 shrink-0 select-none safe-top relative after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-pink-500/30 after:to-transparent">
      {/* Left: Back to TAPPYARD */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        <Link
          href="/"
          className="typo-nav group/back shrink-0 whitespace-nowrap inline-flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2 sm:px-3.5 rounded-full text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover/back:text-pink-400 group-hover/back:-translate-x-0.5 transition-transform shrink-0" />
          <BrandIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline text-slate-400 font-normal">Back to</span>
          <span className="typo-logo text-white">
            TAPP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
          </span>
        </Link>

        {/* Game Title info: page's single H1 with identical styling */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-800 min-w-0 flex-1">
          {icon && <span className="text-sm shrink-0 inline-flex items-center">{icon}</span>}
          <h1 className="typo-game-title text-xs sm:text-sm text-white truncate min-w-0 m-0 p-0 font-semibold">
            {title}
          </h1>
          <span className="typo-label tracking-normal hidden sm:inline-block shrink-0 text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {category}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Diamond Counter */}
        {diamonds !== null && diamonds > 0 && (
          <div className="typo-button shrink-0 whitespace-nowrap flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs tabular-nums shadow-xs">
            <Gem className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span>{diamonds}</span>
          </div>
        )}

        {/* Fullscreen Button */}
        {supportsFullscreen && (
          <button
            onClick={handleFullscreen}
            className="typo-button shrink-0 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Toggle Fullscreen (F)"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
            )}
            <span className="hidden md:inline">
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </span>
            <kbd className="hidden lg:inline-block text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
              F
            </kbd>
          </button>
        )}
      </div>
    </header>
  );
}
