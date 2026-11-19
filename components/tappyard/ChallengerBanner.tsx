'use client';

import { useState, useEffect } from 'react';
import { Trophy, Gem, Sparkles, X, Swords } from 'lucide-react';
import {
  parseChallengeFromUrl,
  checkAndClaimChallengeReward,
  type ChallengeData,
} from '@/lib/challenge';

interface ChallengerBannerProps {
  gameSlug: string;
  currentScore?: number;
}

export default function ChallengerBanner({
  gameSlug,
  currentScore = 0,
}: ChallengerBannerProps) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const data = parseChallengeFromUrl();
    if (data && data.isChallenge) {
      setChallenge(data);
    }
  }, []);

  // Check if player beats the target score
  useEffect(() => {
    if (!challenge || hasWon || currentScore <= 0) return;

    if (currentScore >= challenge.score) {
      setHasWon(true);
      checkAndClaimChallengeReward(gameSlug, challenge.score, challenge.by);
    }
  }, [currentScore, challenge, hasWon, gameSlug]);

  if (!challenge || isDismissed) return null;

  const targetScoreFormatted = challenge.score.toLocaleString();
  const unit = challenge.metric === 'm' ? 'm' : ` ${challenge.metric}`;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-md pointer-events-none animate-fadeInDown">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl backdrop-blur-xl border shadow-xl transition-all ${
          hasWon
            ? 'bg-emerald-950/90 border-emerald-500/50 shadow-emerald-500/20 text-emerald-100'
            : 'bg-[#0f172a]/90 border-pink-500/40 shadow-pink-500/15 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              hasWon
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
            }`}
          >
            {hasWon ? (
              <Sparkles className="w-4 h-4 animate-bounce" />
            ) : (
              <Swords className="w-4 h-4 animate-pulse" />
            )}
          </div>

          <div className="flex flex-col truncate">
            <span className="typo-section-heading text-xs truncate">
              {hasWon ? (
                <span className="text-emerald-300 font-bold">
                  Challenge Beaten! +25 💎 Claimed
                </span>
              ) : (
                <span>
                  <strong className="text-pink-400">{challenge.by}</strong> challenged you:
                </span>
              )}
            </span>
            <span className="typo-meta text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
              <span>Target: <strong>{targetScoreFormatted}{unit}</strong></span>
              {!hasWon && (
                <span className="text-cyan-300 flex items-center gap-0.5">
                  (Win <Gem className="w-2.5 h-2.5 text-cyan-400 inline" /> +25)
                </span>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 transition-colors"
          aria-label="Dismiss challenge banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
