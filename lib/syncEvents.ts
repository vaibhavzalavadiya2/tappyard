// Lightweight zero-dependency event helpers for localStorage <-> Cloud Sync
// Prevents circular imports across wallet, progress, highScores, and cloudSync.

export const DATA_CHANGED_EVENT = 'tappyard:data-changed';
export const PROFILE_SYNCED_EVENT = 'tappyard:profile-synced';

export type SyncChangeSource =
  | 'wallet'
  | 'progress'
  | 'score'
  | 'profile'
  | 'recent';

export function notifyLocalDataChanged(source: SyncChangeSource): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(DATA_CHANGED_EVENT, { detail: { source } })
  );
}

export function notifyProfileSynced(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(PROFILE_SYNCED_EVENT));
}
