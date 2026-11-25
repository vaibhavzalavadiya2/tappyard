import { showToast } from './toast';
import { addWalletDiamonds } from './wallet';
import { notifyLocalDataChanged } from './syncEvents';

export interface ChallengeData {
  isChallenge: boolean;
  score: number;
  by: string;
  metric?: string;
}

export function getPlayerName(): string {
  if (typeof window === 'undefined') return 'Player';
  try {
    const saved = localStorage.getItem('tappyard_player_name');
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore
  }
  return 'Player';
}

export function setPlayerName(name: string, options?: { silentSync?: boolean }): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tappyard_player_name', name.trim() || 'Player');
    if (!options?.silentSync) {
      notifyLocalDataChanged('profile');
    }
  } catch {
    // ignore
  }
}

export function buildChallengeUrl(
  gameSlug: string,
  score: number,
  metric = 'pts'
): string {
  if (typeof window === 'undefined') return `https://tappyard.com/games/${gameSlug}`;
  const origin = window.location.origin || 'https://tappyard.com';
  const player = encodeURIComponent(getPlayerName());
  return `${origin}/games/${gameSlug}?challenge=1&score=${score}&metric=${encodeURIComponent(metric)}&by=${player}`;
}

export async function shareScoreChallenge({
  gameTitle,
  gameSlug,
  score,
  metric = 'pts',
}: {
  gameTitle: string;
  gameSlug: string;
  score: number;
  metric?: string;
}) {
  const url = buildChallengeUrl(gameSlug, score, metric);
  const playerName = getPlayerName();
  const text = `🏆 ${playerName} scored ${score.toLocaleString()}${metric === 'm' ? 'm' : ` ${metric}`} in ${gameTitle} on TAPPYARD! Can you beat it? Play free:`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${gameTitle} Challenge | TAPPYARD`,
        text,
        url,
      });
      showToast('Challenge shared!', 'challenge');
      return true;
    } catch {
      // User cancelled or share failed, fallback to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      showToast('⚔️ Challenge link copied! Send it to a friend.', 'challenge');
      return true;
    } catch {
      showToast(`Challenge link: ${url}`, 'info');
      return false;
    }
  }

  showToast(`Challenge link: ${url}`, 'info');
  return false;
}

export function parseChallengeFromUrl(): ChallengeData | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const isChallenge = params.get('challenge') === '1';
    const scoreStr = params.get('score');
    const by = params.get('by') || 'A rival player';
    const metric = params.get('metric') || 'pts';

    if (isChallenge && scoreStr) {
      const score = parseInt(scoreStr, 10);
      if (!isNaN(score) && score > 0) {
        return { isChallenge: true, score, by, metric };
      }
    }
  } catch {
    // ignore
  }

  return null;
}

export function checkAndClaimChallengeReward(
  gameSlug: string,
  targetScore: number,
  challenger: string
): boolean {
  if (typeof window === 'undefined') return false;

  const key = `tappyard_challenge_won_${gameSlug}_${targetScore}_${challenger}`;
  try {
    if (localStorage.getItem(key)) {
      return false; // already claimed for this specific challenge
    }

    localStorage.setItem(key, 'true');
    addWalletDiamonds(25);
    showToast(`🎉 You beat ${challenger}! +25 💎 Bonus claimed!`, 'diamond', 4500);
    return true;
  } catch {
    return false;
  }
}
