'use client';

import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { loadProgress, saveProgress } from '@/game/progress';
import {
  getWalletDiamonds,
  getGuestDiamondDelta,
  clearGuestDiamondDelta,
  setWalletDiamondsFromCloud,
} from '@/lib/wallet';
import { getPlayerName, setPlayerName } from '@/lib/challenge';
import {
  GAME_STAT_DEFINITIONS,
  getAllLocalGameStats,
  getRecentGameIds,
  setGameBestScore,
  setGamePlayCountFromCloud,
  setRecentGameIdsFromCloud,
  type GameStatId,
  type LocalGameStat,
} from '@/lib/highScores';
import {
  DATA_CHANGED_EVENT,
  notifyProfileSynced,
} from '@/lib/syncEvents';

export interface AuthUserSummary {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  provider?: string;
}

export type CloudSyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface CloudAuthState {
  configured: boolean;
  loading: boolean;
  user: AuthUserSummary | null;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: string | null;
  lastError: string | null;
}

interface CloudProfileRow {
  id: string;
  display_name: string | null;
  total_diamonds: number | null;
  last_daily_claim: string | null;
  unlocked_skins: string[] | null;
  selected_skin: string | null;
  recent_games: string[] | null;
  updated_at?: string | null;
}

interface CloudGameStatRow {
  user_id: string;
  game_id: string;
  best_score: number;
  total_games: number;
  best_streak: number;
  extra_data: Record<string, unknown> | null;
}

const LOGGED_IN_KEY = 'tappyard_logged_in';
const CLOUD_USER_ID_KEY = 'tappyard_cloud_user_id';
const DAILY_CLAIM_KEY = 'tappyard_last_daily_claim';

let state: CloudAuthState = {
  configured: isSupabaseConfigured(),
  loading: false,
  user: null,
  syncStatus: 'idle',
  lastSyncedAt: null,
  lastError: null,
};

type AuthListener = (nextState: CloudAuthState) => void;
const authListeners = new Set<AuthListener>();

let initialized = false;
let syncedUserIdInMemory: string | null = null;
let syncTimer: ReturnType<typeof setTimeout> | null = null;
let hasPendingChanges = false;
let isPushing = false;

function emitAuthState(patch: Partial<CloudAuthState>) {
  state = { ...state, ...patch };
  authListeners.forEach((listener) => {
    try {
      listener(state);
    } catch (err) {
      console.error('Auth listener error:', err);
    }
  });
}

export function getCloudAuthState(): CloudAuthState {
  return state;
}

export function subscribeCloudAuth(listener: AuthListener): () => void {
  authListeners.add(listener);
  listener(state);
  return () => {
    authListeners.delete(listener);
  };
}

function mapSupabaseUser(user: User): AuthUserSummary {
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const metaName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    '';
  const avatarUrl =
    (typeof meta.avatar_url === 'string' && meta.avatar_url) ||
    (typeof meta.picture === 'string' && meta.picture) ||
    undefined;
  const provider =
    typeof user.app_metadata?.provider === 'string'
      ? user.app_metadata.provider
      : undefined;

  const localName = getPlayerName();
  const displayName =
    localName && localName !== 'Player'
      ? localName
      : metaName || user.email?.split('@')[0] || 'Player';

  return {
    id: user.id,
    email: user.email,
    displayName,
    avatarUrl,
    provider,
  };
}

function formatSupabaseAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('provider is not enabled') || lower.includes('unsupported provider')) {
    return 'Google Login is not enabled in Supabase yet. Enable Google under Supabase Authentication -> Providers.';
  }
  if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
    return 'Email limit reached on Supabase default mailer (2/hr). Use Google Login or configure Resend SMTP.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please check your inbox and confirm your email address before signing in.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }
  return message;
}

async function ensureProfileRow(user: User): Promise<CloudProfileRow | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data: existing, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existing) {
    return existing as CloudProfileRow;
  }

  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const fallbackName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    getPlayerName() ||
    'Player';

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        display_name: fallbackName,
        total_diamonds: 10,
        unlocked_skins: ['bubblegum'],
        selected_skin: 'bubblegum',
        recent_games: [],
      },
      { onConflict: 'id' }
    )
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  return created as CloudProfileRow;
}

async function mergeAndSyncUserData(user: User): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  emitAuthState({ syncStatus: 'syncing', lastError: null });

  try {
    const cloudProfile = await ensureProfileRow(user);
    if (!cloudProfile) return;

    const { data: cloudStatsData, error: statsError } = await supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', user.id);

    if (statsError) {
      throw statsError;
    }

    const cloudStats = (cloudStatsData || []) as CloudGameStatRow[];
    const localProgress = loadProgress();
    const localDiamonds = getWalletDiamonds();
    const guestDelta = getGuestDiamondDelta();
    const localName = getPlayerName();
    const localDailyClaim = localStorage.getItem(DAILY_CLAIM_KEY);
    const localRecent = getRecentGameIds();
    const localStats = getAllLocalGameStats();

    const cloudSkins = Array.isArray(cloudProfile.unlocked_skins)
      ? cloudProfile.unlocked_skins
      : ['bubblegum'];
    const isUntouchedNewCloudProfile =
      cloudStats.length === 0 &&
      (cloudProfile.total_diamonds ?? 10) <= 10 &&
      !cloudProfile.last_daily_claim &&
      cloudSkins.length <= 1;

    // 1. Merge Diamonds cleanly without duplicating the 10-diamond welcome bonus on returning accounts
    const cloudDiamonds = cloudProfile.total_diamonds ?? 10;
    const mergedDiamonds = isUntouchedNewCloudProfile
      ? Math.max(localDiamonds, cloudDiamonds)
      : cloudDiamonds + guestDelta;

    // 2. Merge Display Name
    const meta = (user.user_metadata || {}) as Record<string, unknown>;
    const oauthName =
      (typeof meta.full_name === 'string' && meta.full_name) ||
      (typeof meta.name === 'string' && meta.name) ||
      '';
    const cloudName = cloudProfile.display_name || 'Player';
    let mergedName = cloudName;
    if (cloudName === 'Player') {
      mergedName =
        localName !== 'Player'
          ? localName
          : oauthName || user.email?.split('@')[0] || 'Player';
    }

    // 3. Merge Skins
    const mergedSkins = Array.from(
      new Set(['bubblegum', ...localProgress.unlockedSkins, ...cloudSkins])
    );
    const preferredSkin =
      cloudProfile.selected_skin && mergedSkins.includes(cloudProfile.selected_skin)
        ? cloudProfile.selected_skin
        : localProgress.selectedSkin;

    // 4. Merge Daily Claim
    const today = new Date().toDateString();
    let mergedDailyClaim = cloudProfile.last_daily_claim || null;
    if (cloudProfile.last_daily_claim === today || localDailyClaim === today) {
      mergedDailyClaim = today;
    } else if (!mergedDailyClaim && localDailyClaim) {
      mergedDailyClaim = localDailyClaim;
    }

    // 5. Merge Recent Games
    const cloudRecent = Array.isArray(cloudProfile.recent_games)
      ? cloudProfile.recent_games
      : [];
    const mergedRecent = Array.from(
      new Set([...localRecent, ...cloudRecent])
    ).slice(0, 6);

    // 6. Merge Per-Game Stats
    const cloudStatsMap = new Map<string, CloudGameStatRow>(
      cloudStats.map((row) => [row.game_id, row])
    );

    const mergedStats: LocalGameStat[] = GAME_STAT_DEFINITIONS.map((def) => {
      const local = localStats.find((s) => s.gameId === def.id);
      const cloud = cloudStatsMap.get(def.id);
      const localBoosts = Number(local?.extraData?.totalBoosts || 0);
      const cloudBoosts = Number(cloud?.extra_data?.totalBoosts || 0);

      return {
        gameId: def.id,
        bestScore: Math.max(local?.bestScore || 0, cloud?.best_score || 0),
        totalGames: Math.max(local?.totalGames || 0, cloud?.total_games || 0),
        bestStreak: Math.max(local?.bestStreak || 0, cloud?.best_streak || 0),
        extraData:
          def.id === 'jelly-bounce'
            ? { totalBoosts: Math.max(localBoosts, cloudBoosts) }
            : { ...(cloud?.extra_data || {}), ...(local?.extraData || {}) },
      };
    });

    // Apply merged data down to localStorage cache silently
    const jellyStat = mergedStats.find((s) => s.gameId === 'jelly-bounce');
    const updatedProgress = {
      ...localProgress,
      bestDistance: jellyStat?.bestScore ?? localProgress.bestDistance,
      bestScore: jellyStat?.bestScore ?? localProgress.bestScore,
      totalGames: jellyStat?.totalGames ?? localProgress.totalGames,
      bestStreak: jellyStat?.bestStreak ?? localProgress.bestStreak,
      totalBoosts: Number(jellyStat?.extraData?.totalBoosts ?? localProgress.totalBoosts),
      totalDiamonds: mergedDiamonds,
      unlockedSkins: mergedSkins,
      selectedSkin: preferredSkin,
    };

    saveProgress(updatedProgress, { silentSync: true });
    setWalletDiamondsFromCloud(mergedDiamonds);
    setPlayerName(mergedName, { silentSync: true });
    setRecentGameIdsFromCloud(mergedRecent);

    if (mergedDailyClaim) {
      localStorage.setItem(DAILY_CLAIM_KEY, mergedDailyClaim);
    }

    mergedStats.forEach((stat) => {
      if (stat.gameId !== 'jelly-bounce') {
        setGameBestScore(stat.gameId, stat.bestScore, { silentSync: true });
        setGamePlayCountFromCloud(stat.gameId, stat.totalGames);
      }
    });

    localStorage.setItem(LOGGED_IN_KEY, 'true');
    localStorage.setItem(CLOUD_USER_ID_KEY, user.id);
    clearGuestDiamondDelta();

    // Push merged snapshot back to Supabase
    await writeSnapshotToCloud(user.id, {
      displayName: mergedName,
      totalDiamonds: mergedDiamonds,
      lastDailyClaim: mergedDailyClaim,
      unlockedSkins: mergedSkins,
      selectedSkin: preferredSkin,
      recentGames: mergedRecent,
      stats: mergedStats,
    });

    syncedUserIdInMemory = user.id;
    emitAuthState({
      user: { ...mapSupabaseUser(user), displayName: mergedName },
      syncStatus: 'synced',
      lastSyncedAt: new Date().toISOString(),
      lastError: null,
    });
    notifyProfileSynced();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to sync cloud profile.';
    console.error('Cloud merge/sync failed:', err);
    emitAuthState({
      syncStatus: 'error',
      lastError: message,
    });
  }
}

async function writeSnapshotToCloud(
  userId: string,
  payload: {
    displayName: string;
    totalDiamonds: number;
    lastDailyClaim: string | null;
    unlockedSkins: string[];
    selectedSkin: string;
    recentGames: string[];
    stats: LocalGameStat[];
  }
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const now = new Date().toISOString();

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      display_name: payload.displayName,
      total_diamonds: payload.totalDiamonds,
      last_daily_claim: payload.lastDailyClaim,
      unlocked_skins: payload.unlockedSkins,
      selected_skin: payload.selectedSkin,
      recent_games: payload.recentGames,
      updated_at: now,
    },
    { onConflict: 'id' }
  );

  if (profileError) throw profileError;

  const statsRows = payload.stats
    .filter((s) => s.bestScore > 0 || s.totalGames > 0 || s.bestStreak > 0)
    .map((s) => ({
      user_id: userId,
      game_id: s.gameId,
      best_score: s.bestScore,
      total_games: s.totalGames,
      best_streak: s.bestStreak,
      extra_data: s.extraData,
      updated_at: now,
    }));

  if (statsRows.length > 0) {
    const { error: statsError } = await supabase
      .from('game_stats')
      .upsert(statsRows, { onConflict: 'user_id,game_id' });

    if (statsError) throw statsError;
  }
}

export async function pushCloudSnapshot(): Promise<void> {
  if (typeof window === 'undefined' || isPushing) return;
  const currentUser = state.user;
  if (!currentUser) return;

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  isPushing = true;
  hasPendingChanges = false;
  emitAuthState({ syncStatus: 'syncing' });

  try {
    const progress = loadProgress();
    await writeSnapshotToCloud(currentUser.id, {
      displayName: getPlayerName(),
      totalDiamonds: progress.totalDiamonds || 0,
      lastDailyClaim: localStorage.getItem(DAILY_CLAIM_KEY),
      unlockedSkins: progress.unlockedSkins,
      selectedSkin: progress.selectedSkin,
      recentGames: getRecentGameIds(),
      stats: getAllLocalGameStats(),
    });

    emitAuthState({
      syncStatus: 'synced',
      lastSyncedAt: new Date().toISOString(),
      lastError: null,
    });
  } catch (err) {
    console.error('Failed to push cloud snapshot:', err);
    emitAuthState({
      syncStatus: 'error',
      lastError: err instanceof Error ? err.message : 'Cloud save failed.',
    });
  } finally {
    isPushing = false;
    if (hasPendingChanges) {
      queueCloudSync();
    }
  }
}

export function queueCloudSync(): void {
  if (typeof window === 'undefined' || !state.user) return;
  hasPendingChanges = true;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    void pushCloudSnapshot();
  }, 1200);
}

export async function initCloudAuth(): Promise<void> {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  if (!isSupabaseConfigured()) {
    emitAuthState({ configured: false, loading: false });
    return;
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  emitAuthState({ configured: true, loading: true });

  // Listen to local mutations and flush on tab hide
  window.addEventListener(DATA_CHANGED_EVENT, () => {
    queueCloudSync();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && hasPendingChanges && state.user) {
      if (syncTimer) {
        clearTimeout(syncTimer);
        syncTimer = null;
      }
      void pushCloudSnapshot();
    }
  });

  // Subscribe to auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    const user = session?.user ?? null;
    if (user) {
      emitAuthState({
        loading: false,
        user: mapSupabaseUser(user),
      });
      if (syncedUserIdInMemory !== user.id || event === 'SIGNED_IN') {
        await mergeAndSyncUserData(user);
      }
    } else {
      syncedUserIdInMemory = null;
      localStorage.removeItem(LOGGED_IN_KEY);
      emitAuthState({
        loading: false,
        user: null,
        syncStatus: 'idle',
      });
      if (event === 'SIGNED_OUT') {
        notifyProfileSynced();
      }
    }
  });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      emitAuthState({
        loading: false,
        user: mapSupabaseUser(session.user),
      });
      if (syncedUserIdInMemory !== session.user.id) {
        await mergeAndSyncUserData(session.user);
      }
    } else {
      localStorage.removeItem(LOGGED_IN_KEY);
      emitAuthState({ loading: false, user: null });
    }
  } catch (err) {
    console.error('Supabase session init error:', err);
    emitAuthState({ loading: false });
  }
}

export async function signInWithGoogle(
  nextPath?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const path =
    nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
      ? nextPath
      : window.location.pathname || '/';

  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(path)}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error) {
    return { ok: false, error: formatSupabaseAuthError(error.message) };
  }
  return { ok: true };
}

export async function signInWithEmailOtp(
  email: string,
  nextPath?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const path =
    nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
      ? nextPath
      : window.location.pathname || '/';

  const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(path)}`;
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      emailRedirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { ok: false, error: formatSupabaseAuthError(error.message) };
  }
  return { ok: true };
}

export async function verifyEmailOtpCode(
  email: string,
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const { error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.trim(),
    type: 'email',
  });

  if (error) {
    return { ok: false, error: formatSupabaseAuthError(error.message) };
  }
  return { ok: true };
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, error: formatSupabaseAuthError(error.message) };
  }
  return { ok: true };
}

export async function signUpWithPassword(
  email: string,
  password: string
): Promise<{ ok: boolean; needsConfirmation?: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname || '/')}`;
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: getPlayerName() !== 'Player' ? getPlayerName() : undefined,
      },
    },
  });

  if (error) {
    return { ok: false, error: formatSupabaseAuthError(error.message) };
  }

  return {
    ok: true,
    needsConfirmation: !data.session,
  };
}

function resetLocalGuestSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOGGED_IN_KEY);
    localStorage.removeItem(CLOUD_USER_ID_KEY);
    localStorage.removeItem(DAILY_CLAIM_KEY);
    localStorage.removeItem('tappyard_recent_games');
    localStorage.removeItem('tappyard_player_name');
    clearGuestDiamondDelta();

    GAME_STAT_DEFINITIONS.forEach((def) => {
      if (def.storageKey) {
        localStorage.removeItem(def.storageKey);
      }
      localStorage.removeItem(`tappyard_plays_${def.id}`);
    });

    // Reset Jump Jelly Jump progress & unified wallet cleanly to starter 10 diamonds
    const current = loadProgress();
    saveProgress(
      {
        bestDistance: 0,
        bestScore: 0,
        totalDiamonds: 10,
        totalGames: 0,
        totalBoosts: 0,
        bestStreak: 0,
        unlockedSkins: ['bubblegum'],
        selectedSkin: 'bubblegum',
        soundMuted: current.soundMuted,
      },
      { silentSync: true }
    );
    setWalletDiamondsFromCloud(10);
  } catch {
    // ignore
  }
}

export async function signOutCloud(clearDeviceData = true): Promise<void> {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }

  if (hasPendingChanges && state.user) {
    await pushCloudSnapshot();
  }

  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  syncedUserIdInMemory = null;
  if (clearDeviceData) {
    resetLocalGuestSession();
  } else {
    localStorage.removeItem(LOGGED_IN_KEY);
    localStorage.removeItem(CLOUD_USER_ID_KEY);
    clearGuestDiamondDelta();
  }

  emitAuthState({
    user: null,
    syncStatus: 'idle',
    lastSyncedAt: null,
    lastError: null,
  });
  notifyProfileSynced();
}

export type { GameStatId };
