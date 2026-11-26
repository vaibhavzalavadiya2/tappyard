'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  User,
  Gem,
  Trophy,
  ShieldCheck,
  Zap,
  LogOut,
  Edit2,
  Check,
  Mail,
  Cloud,
  RefreshCw,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { getWalletDiamonds, addWalletDiamonds } from '@/lib/wallet';
import { showToast } from '@/lib/toast';
import { getPlayerName, setPlayerName } from '@/lib/challenge';
import {
  GAME_STAT_DEFINITIONS,
  getGameBestScore,
  type GameStatId,
} from '@/lib/highScores';
import {
  notifyLocalDataChanged,
  notifyProfileSynced,
  PROFILE_SYNCED_EVENT,
} from '@/lib/syncEvents';
import {
  initCloudAuth,
  subscribeCloudAuth,
  signInWithGoogle,
  signInWithPassword,
  signUpWithPassword,
  signInWithEmailOtp,
  verifyEmailOtpCode,
  signOutCloud,
  pushCloudSnapshot,
  type CloudAuthState,
} from '@/lib/cloudSync';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmailAuthMode = 'password' | 'signup' | 'otp';

function readInitialBestScores(): Record<GameStatId, number> {
  const scores: Record<GameStatId, number> = {
    'jelly-bounce': 0,
    'belt-sort': 0,
    '2048-puzzle': 0,
    'cupcake-2048': 0,
    'color-zen': 0,
    'quick-tap': 0,
  };
  if (typeof window === 'undefined') return scores;
  GAME_STAT_DEFINITIONS.forEach((def) => {
    scores[def.id] = getGameBestScore(def.id);
  });
  return scores;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [diamonds, setDiamonds] = useState(() =>
    typeof window !== 'undefined' ? getWalletDiamonds() : 0
  );
  const [bestScores, setBestScores] = useState<Record<GameStatId, number>>(
    readInitialBestScores
  );
  const [playerName, setPlayerNameState] = useState(() =>
    typeof window !== 'undefined' ? getPlayerName() : 'Player'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(() =>
    typeof window !== 'undefined' ? getPlayerName() : 'Player'
  );
  const [claimedToday, setClaimedToday] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('tappyard_last_daily_claim') === new Date().toDateString();
    } catch {
      return false;
    }
  });

  // Cloud auth UI state
  const [authState, setAuthState] = useState<CloudAuthState>({
    configured: true,
    loading: true,
    user: null,
    syncStatus: 'idle',
    lastSyncedAt: null,
    lastError: null,
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMode, setEmailMode] = useState<EmailAuthMode>('password');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  const refreshLocalSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      setDiamonds(getWalletDiamonds());
      setBestScores(readInitialBestScores());

      const name = getPlayerName();
      setPlayerNameState(name);
      setNameInput(name);

      const today = new Date().toDateString();
      setClaimedToday(localStorage.getItem('tappyard_last_daily_claim') === today);
    } catch {
      // ignore localStorage restrictions
    }
  }, []);

  // Prevent background scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add('no-scroll');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Initialize auth + subscribe to live sync updates when modal opens
  useEffect(() => {
    if (!isOpen) return;

    void initCloudAuth();

    const unsubAuth = subscribeCloudAuth((next) => {
      setAuthState(next);
    });
    window.addEventListener(PROFILE_SYNCED_EVENT, refreshLocalSnapshot);

    return () => {
      unsubAuth();
      window.removeEventListener(PROFILE_SYNCED_EVENT, refreshLocalSnapshot);
    };
  }, [isOpen, refreshLocalSnapshot]);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setPlayerName(trimmed);
      setPlayerNameState(trimmed);
      setIsEditingName(false);
      notifyProfileSynced();
      showToast(`Nickname updated to "${trimmed}"!`, 'success');
    }
  };

  const handleClaimDaily = () => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('tappyard_last_daily_claim');
    if (lastClaim === today) {
      setClaimedToday(true);
      showToast('You already claimed your daily reward today! Come back tomorrow.', 'info');
      return;
    }
    const updated = addWalletDiamonds(50);
    setDiamonds(updated);
    setClaimedToday(true);
    localStorage.setItem('tappyard_last_daily_claim', today);
    notifyLocalDataChanged('profile');
    notifyProfileSynced();
    showToast('🎉 Claimed 50 Daily Diamonds!', 'diamond');
  };

  const handleGoogleLogin = async () => {
    setAuthBusy(true);
    setAuthFeedback(null);
    const res = await signInWithGoogle();
    if (!res.ok) {
      setAuthFeedback(res.error || 'Could not start Google login.');
      setAuthBusy(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setAuthFeedback('Please enter your email address.');
      return;
    }

    setAuthBusy(true);
    setAuthFeedback(null);

    try {
      if (emailMode === 'password') {
        const res = await signInWithPassword(emailInput, passwordInput);
        if (!res.ok) {
          setAuthFeedback(res.error || 'Sign-in failed.');
        } else {
          showToast('Signed in! Syncing cloud data...', 'success');
          setShowEmailForm(false);
        }
      } else if (emailMode === 'signup') {
        if (passwordInput.length < 6) {
          setAuthFeedback('Password must be at least 6 characters.');
          return;
        }
        const res = await signUpWithPassword(emailInput, passwordInput);
        if (!res.ok) {
          setAuthFeedback(res.error || 'Sign-up failed.');
        } else if (res.needsConfirmation) {
          setAuthFeedback('Account created! Check your email inbox to confirm, then sign in.');
          showToast('Confirmation email sent!', 'info');
        } else {
          showToast('Account created & signed in!', 'success');
          setShowEmailForm(false);
        }
      } else if (emailMode === 'otp') {
        if (!otpSent) {
          const res = await signInWithEmailOtp(emailInput);
          if (!res.ok) {
            setAuthFeedback(res.error || 'Failed to send login code.');
          } else {
            setOtpSent(true);
            showToast('Login link / code sent to your email!', 'info');
          }
        } else {
          const res = await verifyEmailOtpCode(emailInput, otpInput);
          if (!res.ok) {
            setAuthFeedback(res.error || 'Invalid or expired verification code.');
          } else {
            showToast('Email verified! Syncing progress...', 'success');
            setShowEmailForm(false);
            setOtpSent(false);
            setOtpInput('');
          }
        }
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleManualSync = async () => {
    await pushCloudSnapshot();
    refreshLocalSnapshot();
    showToast('Cloud profile synced!', 'success');
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    await signOutCloud(true);
    refreshLocalSnapshot();
    setAuthBusy(false);
    showToast('Logged out. Switched to clean Guest session.', 'info');
  };

  if (!isOpen) return null;

  const isLoggedIn = Boolean(authState.user);
  const displayTitle = isLoggedIn
    ? authState.user?.displayName || playerName
    : playerName !== 'Player'
      ? playerName
      : 'Guest Player';
  const avatarInitial = displayTitle.trim().charAt(0).toUpperCase() || 'G';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeInUp"
      role="dialog"
      aria-modal="true"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] bg-[#0b101d] border border-slate-700/80 rounded-xl shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-pink-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0d1322] rounded-[6px] flex items-center justify-center">
                <User className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <h3 className="typo-section-heading text-base text-white">Player Profile</h3>
              <p className="typo-meta text-[11px] text-slate-400">
                {isLoggedIn ? 'Cloud Account Active' : 'TAPPYARD Gaming Profile'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 pt-4 sm:pt-4 flex flex-col gap-4 overflow-y-auto">
          {/* Cloud Authentication Section - TOP PRIORITY FOR GUEST PLAYERS */}
          {!isLoggedIn && (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/40 shadow-lg shadow-pink-500/5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-pink-400" />
                  Save Progress Across Devices
                </span>
              </div>

              {authFeedback && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{authFeedback}</span>
                </div>
              )}

              {/* Big Prominent Google Sign-In Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={authBusy}
                className="typo-button flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{authBusy ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Email Auth Toggle (Commented out - focusing exclusively on 1-click Google Login) */}
              {/*
              {!showEmailForm ? (
                <button
                  onClick={() => {
                    setShowEmailForm(true);
                    setAuthFeedback(null);
                  }}
                  className="typo-button flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs text-slate-300 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-pink-400" />
                  <span>Or sign in with Email</span>
                </button>
              ) : (
                <form onSubmit={handleEmailSubmit} className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode('password');
                        setOtpSent(false);
                        setAuthFeedback(null);
                      }}
                      className={`py-1 rounded-md cursor-pointer transition-colors ${emailMode === 'password' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode('signup');
                        setOtpSent(false);
                        setAuthFeedback(null);
                      }}
                      className={`py-1 rounded-md cursor-pointer transition-colors ${emailMode === 'signup' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode('otp');
                        setAuthFeedback(null);
                      }}
                      className={`py-1 rounded-md cursor-pointer transition-colors ${emailMode === 'otp' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Magic Code
                    </button>
                  </div>

                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
                  />

                  {emailMode !== 'otp' ? (
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={emailMode === 'signup' ? 'Create password (min 6 chars)' : 'Password'}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  ) : (
                    otpSent && (
                      <input
                        type="text"
                        required
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="Enter 6-digit code from email"
                        className="w-full bg-slate-950 border border-pink-500/60 rounded-lg px-3 py-2 text-xs text-white tracking-widest text-center focus:outline-none"
                      />
                    )
                  )}

                  <button
                    type="submit"
                    disabled={authBusy}
                    className="typo-button w-full py-2 rounded-lg text-xs text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {authBusy
                      ? 'Please wait...'
                      : emailMode === 'password'
                        ? 'Sign In with Email'
                        : emailMode === 'signup'
                          ? 'Create Cloud Account'
                          : otpSent
                            ? 'Verify Code'
                            : 'Send Magic Code'}
                  </button>
                </form>
              )}
              */}
            </div>
          )}

          {/* Player Identity Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {authState.user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={authState.user.avatarUrl}
                    alt={displayTitle}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg object-cover border border-pink-500/40 shadow-lg shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="font-display w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shrink-0">
                    {avatarInitial}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="typo-game-title text-sm text-white block truncate">
                    {displayTitle}
                  </span>
                  {authState.user?.email && (
                    <span className="text-[10px] text-slate-400 block truncate">
                      {authState.user.email}
                    </span>
                  )}
                  <span className="typo-meta text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    {isLoggedIn ? (
                      <>
                        <Cloud
                          className={`w-3 h-3 ${authState.syncStatus === 'error'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                            }`}
                        />
                        <span>
                          {authState.syncStatus === 'syncing'
                            ? 'Syncing to Cloud...'
                            : authState.syncStatus === 'error'
                              ? 'Sync Retry Needed'
                              : 'Cloud Synced ✓'}
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
                </div>
              </div>

              {isLoggedIn ? (
                <button
                  onClick={handleManualSync}
                  disabled={authState.syncStatus === 'syncing'}
                  className="typo-label text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                  title="Sync now"
                >
                  <RefreshCw
                    className={`w-2.5 h-2.5 ${authState.syncStatus === 'syncing' ? 'animate-spin' : ''
                      }`}
                  />
                  <span>SYNC</span>
                </button>
              ) : (
                <span className="typo-label text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 shrink-0">
                  GUEST
                </span>
              )}
            </div>

            {/* Nickname Row */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="typo-label text-[10px] text-slate-400 uppercase tracking-wider">
                Display Name:
              </span>
              {isEditingName ? (
                <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={16}
                    className="w-full bg-slate-950 border border-pink-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-pink-400"
                    placeholder="Enter nickname"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition-colors cursor-pointer"
                    aria-label="Save nickname"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">{playerName}</span>
                  <button
                    onClick={() => {
                      setNameInput(playerName);
                      setIsEditingName(true);
                    }}
                    className="text-slate-400 hover:text-pink-400 transition-colors p-0.5 cursor-pointer"
                    title="Edit Nickname"
                    aria-label="Edit Nickname"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Unified Diamonds Wallet */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#08202c] to-[#04121a] border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="typo-label text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Gem className="w-3 h-3 text-cyan-400" />
                Unified Wallet
              </span>
              <span className="typo-meta text-[10px] text-slate-400 block mt-0.5">
                Shared across all {GAME_STAT_DEFINITIONS.length} games
              </span>
            </div>
            <span className="font-display text-2xl font-bold tabular-nums text-cyan-300 flex items-baseline gap-1">
              {diamonds} <span className="text-xs font-normal text-cyan-400">💎</span>
            </span>
          </div>

          {/* All 6 Games Personal Best Records */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
            <span className="typo-label text-[10px] text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              Personal Best Records
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {GAME_STAT_DEFINITIONS.map((def) => {
                const scoreVal = bestScores[def.id] || 0;
                return (
                  <div
                    key={def.id}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950/60 border border-slate-800/70"
                  >
                    <span className="text-slate-300 font-medium truncate">{def.title}</span>
                    <span className="font-bold tabular-nums text-amber-300">
                      {scoreVal.toLocaleString()}
                      {def.unit === 'm' ? 'm' : ' pts'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Reward Button */}
          <button
            onClick={handleClaimDaily}
            disabled={claimedToday}
            className={`typo-button flex items-center justify-between p-3 rounded-xl border transition-all text-xs ${claimedToday
              ? 'bg-slate-900/60 border-slate-800 text-slate-400 cursor-default'
              : 'bg-gradient-to-r from-pink-500/15 to-purple-500/15 border-pink-500/30 hover:border-pink-500/60 text-white cursor-pointer active:scale-98'
              }`}
          >
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${claimedToday ? 'text-slate-500' : 'text-pink-400'}`} />
              <span>{claimedToday ? 'Daily Reward Claimed Today ✓' : 'Claim Daily Free Reward'}</span>
            </div>
            <span className={`font-semibold tabular-nums ${claimedToday ? 'text-slate-500' : 'text-pink-300'}`}>
              +50 💎
            </span>
          </button>

          {/* Log Out Button (Only shown when logged in) */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              disabled={authBusy}
              className="typo-button flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-red-400 border border-slate-800 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out (Clear Session from Device)</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
