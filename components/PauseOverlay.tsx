'use client';

import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PauseOverlayProps {
  distance: number;
  onResume: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function PauseOverlay({
  distance,
  onResume,
  onRestart,
  isMuted,
  onToggleMute,
}: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 p-4 select-none animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onResume} />

      {/* Main Panel */}
      <div
        className="relative bg-gradient-to-b from-[#0f2c3a] to-[#0a1b24] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-4
        w-full max-w-xs border border-cyan-500/30 animate-slide-up text-white"
      >
        <h2 className="text-xl font-black text-white tracking-widest uppercase">
          PAUSED
        </h2>

        <div className="text-center py-1">
          <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
            DISTANCE REACHED
          </div>
          <div className="text-4xl font-black text-white mt-0.5">
            {distance}
            <span className="text-sm text-cyan-300 ml-1">m</span>
          </div>
          <p className="text-[10px] text-slate-300 mt-1 max-w-[220px] mx-auto leading-tight">
            Drag to steer the jelly cube. Collect diamonds and hit booster pads to leap the chasms.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 w-full pt-1">
          <button
            onClick={onResume}
            className="w-full h-12 rounded-2xl text-white font-black text-sm shadow-xl shadow-emerald-500/20
              bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500
              transition-all hover:scale-102 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-emerald-300/40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RESUME</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full h-11 rounded-2xl text-slate-300 font-bold text-xs
              bg-[#123646] hover:bg-[#184457] transition-all active:scale-95 cursor-pointer
              flex items-center justify-center gap-2 border border-cyan-500/30"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART RUN</span>
          </button>

          {/* Link to tips below */}
          <a
            href="#game-details"
            onClick={onResume}
            className="text-[11px] text-cyan-300 hover:text-white transition-colors text-center underline pt-0.5"
          >
            How to play and tips ↓
          </a>
        </div>

        {/* Sound toggle */}
        <button
          onClick={onToggleMute}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 pt-1"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sound On</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
