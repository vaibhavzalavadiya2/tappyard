// Unified TapYard Player Wallet
// Manages shared currency (Diamonds) and cross-game player state

import { loadProgress, saveProgress } from '@/game/progress';
import { showToast } from '@/lib/toast';
import { notifyLocalDataChanged } from '@/lib/syncEvents';

type WalletListener = (diamonds: number) => void;
const listeners = new Set<WalletListener>();

const WALLET_INIT_KEY = 'tappyard_wallet_initialized';
const GUEST_DELTA_KEY = 'tappyard_guest_diamond_delta';
const LOGGED_IN_FLAG_KEY = 'tappyard_logged_in';
const WELCOME_BONUS = 10;

function ensureInitialized() {
  if (typeof window === 'undefined') return;
  try {
    if (!localStorage.getItem(WALLET_INIT_KEY)) {
      localStorage.setItem(WALLET_INIT_KEY, 'true');
      const progress = loadProgress();
      if (!progress.totalDiamonds || progress.totalDiamonds < WELCOME_BONUS) {
        progress.totalDiamonds = Math.max(progress.totalDiamonds || 0, WELCOME_BONUS);
        saveProgress(progress, { silentSync: true });
        setTimeout(() => {
          showToast('Welcome to TAPPYARD! +10 💎 added to your wallet.', 'diamond', 4200);
        }, 600);
      }
    }
  } catch {
    // ignore localStorage restrictions
  }
}

function adjustGuestDelta(delta: number) {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(LOGGED_IN_FLAG_KEY) === 'true') return;
    const prev = parseInt(localStorage.getItem(GUEST_DELTA_KEY) || '0', 10) || 0;
    const next = Math.max(0, prev + delta);
    localStorage.setItem(GUEST_DELTA_KEY, String(next));
  } catch {
    // ignore
  }
}

export function getGuestDiamondDelta(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return Math.max(0, parseInt(localStorage.getItem(GUEST_DELTA_KEY) || '0', 10) || 0);
  } catch {
    return 0;
  }
}

export function clearGuestDiamondDelta(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GUEST_DELTA_KEY);
  } catch {
    // ignore
  }
}

export function getWalletDiamonds(): number {
  if (typeof window === 'undefined') return 0;
  ensureInitialized();
  const progress = loadProgress();
  return progress.totalDiamonds || 0;
}

export const getDiamondBalance = getWalletDiamonds;

export function addWalletDiamonds(amount: number): number {
  if (typeof window === 'undefined' || amount <= 0) return getWalletDiamonds();
  ensureInitialized();
  const progress = loadProgress();
  progress.totalDiamonds = (progress.totalDiamonds || 0) + amount;
  saveProgress(progress, { silentSync: true });
  adjustGuestDelta(amount);
  notifyListeners(progress.totalDiamonds);
  notifyLocalDataChanged('wallet');
  return progress.totalDiamonds;
}

export function spendWalletDiamonds(amount: number): boolean {
  if (typeof window === 'undefined' || amount <= 0) return false;
  ensureInitialized();
  const progress = loadProgress();
  const current = progress.totalDiamonds || 0;
  if (current < amount) {
    return false;
  }
  progress.totalDiamonds = current - amount;
  saveProgress(progress, { silentSync: true });
  adjustGuestDelta(-amount);
  notifyListeners(progress.totalDiamonds);
  notifyLocalDataChanged('wallet');
  return true;
}

export function setWalletDiamondsFromCloud(amount: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WALLET_INIT_KEY, 'true');
  } catch {
    // ignore
  }
  const clean = Math.max(0, Math.floor(amount));
  const progress = loadProgress();
  progress.totalDiamonds = clean;
  saveProgress(progress, { silentSync: true });
  notifyListeners(clean);
}

export function subscribeWallet(listener: WalletListener): () => void {
  ensureInitialized();
  listeners.add(listener);
  // Emit current value immediately
  if (typeof window !== 'undefined') {
    listener(getWalletDiamonds());
  }
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(diamonds: number) {
  listeners.forEach((listener) => {
    try {
      listener(diamonds);
    } catch (e) {
      console.error('Wallet listener error:', e);
    }
  });
}
