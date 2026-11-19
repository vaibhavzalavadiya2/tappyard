'use client';

import { useState, useEffect } from 'react';
import { Gem, Trophy, Sparkles, Info, X } from 'lucide-react';
import type { ToastEventDetail, ToastType } from '@/lib/toast';

interface ToastItem extends ToastEventDetail {
  createdAt: number;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      if (!customEvent.detail) return;

      const newToast: ToastItem = {
        ...customEvent.detail,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep at most 4 toasts

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 3200);

      return () => clearTimeout(timer);
    };

    window.addEventListener('tappyard-toast', handleToast);
    return () => window.removeEventListener('tappyard-toast', handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const typeConfig = getTypeConfig(toast.type);

        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer animate-fadeInUp flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#0b101d]/95 backdrop-blur-xl border shadow-2xl transition-all hover:scale-102 active:scale-95 ${typeConfig.border} ${typeConfig.glow}`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.iconBg}`}
              >
                {typeConfig.icon}
              </div>
              <span className="typo-body text-xs font-semibold text-slate-100 leading-snug">
                {toast.message}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function getTypeConfig(type: ToastType) {
  switch (type) {
    case 'diamond':
      return {
        icon: <Gem className="w-4 h-4 text-cyan-400 animate-pulse" />,
        iconBg: 'bg-cyan-500/15 border border-cyan-500/30',
        border: 'border-cyan-500/40',
        glow: 'shadow-cyan-500/20',
      };
    case 'challenge':
      return {
        icon: <Trophy className="w-4 h-4 text-pink-400" />,
        iconBg: 'bg-pink-500/15 border border-pink-500/30',
        border: 'border-pink-500/40',
        glow: 'shadow-pink-500/20',
      };
    case 'success':
      return {
        icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
        iconBg: 'bg-emerald-500/15 border border-emerald-500/30',
        border: 'border-emerald-500/40',
        glow: 'shadow-emerald-500/20',
      };
    case 'info':
    default:
      return {
        icon: <Info className="w-4 h-4 text-purple-400" />,
        iconBg: 'bg-purple-500/15 border border-purple-500/30',
        border: 'border-purple-500/40',
        glow: 'shadow-purple-500/20',
      };
  }
}
