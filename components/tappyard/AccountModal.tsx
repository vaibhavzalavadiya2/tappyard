'use client';

import { useState, useEffect } from 'react';
import {
  X,
  User,
  Gem,
  Trophy,
  Gamepad2,
  Sparkles,
  ShieldCheck,
  Check,
  LogOut,
  Zap,
} from 'lucide-react';
import { getWalletDiamonds, addWalletDiamonds } from '@/lib/wallet';
import { loadProgress } from '@/game/progress';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [diamonds, setDiamonds] = useState(0);
  const [playerName, setPlayerName] = useState('Guest Player');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bestDistance, setBestDistance] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const d = getWalletDiamonds();
      setDiamonds(d);
      const savedName = localStorage.getItem('tappyard_player_name');
      if (savedName) {
        setPlayerName(savedName);
        setIsLoggedIn(true);
      }
      const p = loadProgress();
      if (p && p.bestDistance) {
        setBestDistance(p.bestDistance);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setPlayerName(tempName.trim());
    localStorage.setItem('tappyard_player_name', tempName.trim());
    setIsLoggedIn(true);
    setIsEditingName(false);
  };

  const handleClaimDaily = () => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('tappyard_last_daily_claim');
    if (lastClaim === today) {
      alert('You have already claimed your daily reward today! Come back tomorrow.');
      return;
    }
    const updated = addWalletDiamonds(50);
    setDiamonds(updated);
    localStorage.setItem('tappyard_last_daily_claim', today);
    alert('🎉 Claimed 50 Daily Diamonds!');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeInUp"
      role="dialog"
      aria-modal="true"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-[#0b101d] border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 z-10 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center">
                <User className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-white">Player Profile</h3>
              <p className="text-[11px] text-slate-400">TapYard Unified Gaming Account</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Identity Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
                {playerName.charAt(0).toUpperCase()}
              </div>
              <div>
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter gamer tag"
                      autoFocus
                      className="px-2.5 py-1 text-xs bg-slate-950 border border-pink-500/60 rounded-lg text-white focus:outline-none w-32"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded-lg bg-pink-500 text-white hover:bg-pink-400 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{playerName}</span>
                    <button
                      onClick={() => {
                        setTempName(playerName);
                        setIsEditingName(true);
                      }}
                      className="text-[10px] text-pink-400 hover:underline font-bold cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{isLoggedIn ? 'Registered Gamer' : 'Guest Session (Auto-Saved)'}</span>
                </span>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
              LVL 1
            </span>
          </div>
        </div>

        {/* Diamonds Wallet & Stats Strip */}
        <div className="grid grid-cols-2 gap-3">
          {/* Diamond Balance */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#08202c] to-[#04121a] border border-cyan-500/30 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1">
              <Gem className="w-3 h-3 text-cyan-400" />
              Diamonds
            </span>
            <span className="text-2xl font-black text-cyan-300 flex items-baseline gap-1">
              {diamonds} <span className="text-xs font-normal text-cyan-400">💎</span>
            </span>
            <span className="text-[10px] text-slate-400">Synced across all 4 games</span>
          </div>

          {/* Best Record */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1e1505] to-[#120c02] border border-amber-500/30 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              Jelly Record
            </span>
            <span className="text-2xl font-black text-amber-300 flex items-baseline gap-1">
              {bestDistance > 0 ? `${bestDistance}m` : '0m'}
            </span>
            <span className="text-[10px] text-slate-400">Personal Best Distance</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          {/* Daily Reward Claim */}
          <button
            onClick={handleClaimDaily}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-500/15 to-purple-500/15 border border-pink-500/30 hover:border-pink-500/60 transition-all text-xs font-bold text-white cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>Claim Daily Free Reward</span>
            </div>
            <span className="text-pink-300 font-black">+50 💎</span>
          </button>

          {/* Cloud Save / Login Button */}
          {!isLoggedIn ? (
            <button
              onClick={() => {
                setTempName('');
                setIsEditingName(true);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Create Gamer Profile</span>
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('tappyard_player_name');
                setPlayerName('Guest Player');
                setIsLoggedIn(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch / Sign Out</span>
            </button>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-center text-slate-500">
          Your progress, skins, and diamonds auto-save locally in your browser.
        </p>
      </div>
    </div>
  );
}
