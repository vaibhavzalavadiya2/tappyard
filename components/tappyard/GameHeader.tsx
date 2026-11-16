'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';

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
    <header className="h-11 sm:h-14 bg-[#090d16] border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none safe-top">
      {/* Left: Back to TAPPYARD */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline text-slate-400">Back</span>
          <span className="text-white font-black">
            TAP<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">YARD</span>
          </span>
        </Link>

        {/* Game Title info */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] sm:max-w-none">
            {title}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {category}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {supportsFullscreen && (
          <button
            onClick={handleFullscreen}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Toggle Fullscreen"
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
          </button>
        )}
      </div>
    </header>
  );
}
