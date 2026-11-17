'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ArrowLeft, Maximize2, Minimize2, Gem } from 'lucide-react';
import { getWalletDiamonds, subscribeWallet } from '@/lib/wallet';

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
    <header className="h-12 sm:h-14 bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none safe-top relative after:absolute after:bottom-0 after:inset-x-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-pink-500/30 after:to-transparent">
      {/* Left: Back to TAPPYARD */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="group/back inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full text-xs font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover/back:text-pink-400 group-hover/back:-translate-x-0.5 transition-transform" />
          <span className="hidden xs:inline text-slate-400 font-normal">Back to</span>
          <span className="text-white font-black tracking-tight">
            TAP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
          </span>
        </Link>

        {/* Game Title info */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-xs sm:text-sm font-black text-white truncate max-w-[130px] sm:max-w-none">
            {title}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {category}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Diamond Counter */}
        {diamonds !== null && diamonds > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-black shadow-xs">
            <Gem className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{diamonds}</span>
          </div>
        )}

        {/* Fullscreen Button */}
        {supportsFullscreen && (
          <button
            onClick={handleFullscreen}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
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
