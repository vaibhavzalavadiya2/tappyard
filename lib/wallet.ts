// Unified TapYard Player Wallet
// Manages shared currency (Diamonds) and cross-game player state

import { loadProgress, saveProgress } from '@/game/progress';

type WalletListener = (diamonds: number) => void;
const listeners = new Set<WalletListener>();

export function getWalletDiamonds(): number {
  if (typeof window === 'undefined') return 0;
  const progress = loadProgress();
  return progress.totalDiamonds || 0;
}

export function addWalletDiamonds(amount: number): number {
  if (typeof window === 'undefined' || amount <= 0) return getWalletDiamonds();
  const progress = loadProgress();
  progress.totalDiamonds = (progress.totalDiamonds || 0) + amount;
  saveProgress(progress);
  notifyListeners(progress.totalDiamonds);
  return progress.totalDiamonds;
}

export function spendWalletDiamonds(amount: number): boolean {
  if (typeof window === 'undefined' || amount <= 0) return false;
  const progress = loadProgress();
  const current = progress.totalDiamonds || 0;
  if (current < amount) {
    return false;
  }
  progress.totalDiamonds = current - amount;
  saveProgress(progress);
  notifyListeners(progress.totalDiamonds);
  return true;
}

export function subscribeWallet(listener: WalletListener): () => void {
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
