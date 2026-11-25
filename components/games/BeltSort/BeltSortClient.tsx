'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, Check, Copy, Crown, Clock, Flame, Gem, Infinity as InfinityIcon, Pause, Play, RotateCcw, Snowflake, Sparkles, Volume2, VolumeX } from 'lucide-react';
import GameHeader from '@/components/tappyard/GameHeader';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import {
  BELT_SORT_CONFIG,
  type GameMode,
  type ItemKind,
  type ShapeKind,
  type WavePatternType,
} from '@/game/beltsort/config';
import {
  buildDailyShareText,
  calculateAccuracyPercent,
  computeDiamondsEarned,
  evaluateSort,
  formatDailyEmojiGrid,
  formatTimeMMSS,
  getChainMultiplier,
  getNextChainTarget,
  getTravelTimeSec,
  getWaveSpawnIntervalSec,
  pickNextItemKind,
  pickNextWavePattern,
  safeStorageGet,
  safeStorageSet,
  updateDailyStreakValue,
  type SortOutcome,
} from '@/game/beltsort/logic';
import { beltSortAudio } from '@/game/beltsort/audio';
import { getLocalDateString, hashString, mulberry32 } from '@/game/beltsort/rng';
import { triggerHaptic } from '@/lib/haptics';
import { addWalletDiamonds } from '@/lib/wallet';
import {
  addRecentGameId,
  getGameBestScore,
  incrementGamePlayCount,
  setGameBestScore,
} from '@/lib/highScores';
import { PROFILE_SYNCED_EVENT } from '@/lib/syncEvents';
import ChallengerBanner from '@/components/tappyard/ChallengerBanner';
import { GAMES_CATALOGUE } from '@/data/games';

function trackGameEvent(eventName: 'run_start' | 'run_end', params: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof g === 'function') {
    try {
      g('event', eventName, params);
    } catch {
      // ignore analytics block
    }
  }
}
import { createSpriteCache, type SpriteCache } from '@/game/beltsort/sprites';
import {
  itemScaleAt,
  renderBeltScene,
  type ActiveBeltItem,
  type DroppingItemFx,
  type FloatingScoreText,
  type PerfectBannerFx,
  type RenderLayoutMetrics,
  type SparkleParticle,
} from '@/game/beltsort/renderer';
import './BeltSort.css';

interface BeltSortClientProps {
  hasCustomBg?: boolean;
  fontClassName?: string;
}

type PlayPhase = 'start' | 'playing' | 'paused' | 'gameover';

function ShapeSvgIcon({ shape, className }: { shape: ShapeKind; className?: string }) {
  if (shape === 'circle') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="14" fill="#ffffff" />
      </svg>
    );
  }
  if (shape === 'square') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <rect x="6.5" y="6.5" width="27" height="27" rx="5" fill="#ffffff" />
      </svg>
    );
  }
  if (shape === 'triangle') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <path
          d="M20 6 C21.3 6 22.4 6.7 23.1 7.9 L34.2 28.4 C35.3 30.5 33.8 33 31.4 33 L8.6 33 C6.2 33 4.7 30.5 5.8 28.4 L16.9 7.9 C17.6 6.7 18.7 6 20 6 Z"
          fill="#ffffff"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 4.5 C21.1 4.5 22.1 5 22.8 5.8 L34.2 17.8 C35.3 19 35.3 21 34.2 22.2 L22.8 34.2 C21.3 35.7 18.7 35.7 17.2 34.2 L5.8 22.2 C4.7 21 4.7 19 5.8 17.8 L17.2 5.8 C17.9 5 18.9 4.5 20 4.5 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function GlossyHeartIcon({ lost = false, shaking = false }: { lost?: boolean; shaking?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`w-4 h-4 sm:w-6 sm:h-6 transition-all duration-200 ${
        lost ? 'opacity-25 grayscale scale-90' : 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]'
      } ${shaking ? 'bs-heart-shake' : ''}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bsHeartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7b89" />
          <stop offset="50%" stopColor="#ff2e4c" />
          <stop offset="100%" stopColor="#a80d27" />
        </linearGradient>
      </defs>
      <path
        d="M16 28.2 C16 28.2 3.5 20.3 3.5 11.4 C3.5 6.8 7.1 3.6 11.2 3.6 C13.7 3.6 15.1 4.9 16 6.4 C16.9 4.9 18.3 3.6 20.8 3.6 C24.9 3.6 28.5 6.8 28.5 11.4 C28.5 20.3 16 28.2 16 28.2 Z"
        fill="url(#bsHeartGrad)"
        stroke="#4f0716"
        strokeWidth="1.8"
      />
      <ellipse cx="10.2" cy="9.2" rx="3" ry="1.8" transform="rotate(-25 10.2 9.2)" fill="rgba(255,255,255,0.65)" />
    </svg>
  );
}

function RadialTimerRing({ progress }: { progress: number }) {
  const r = 10;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 -rotate-90 shrink-0" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="3"
      />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke="#ffe36e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - clamped)}
      />
    </svg>
  );
}

interface EngineState {
  phase: PlayPhase;
  mode: GameMode;
  dailyDateStr: string;
  dailyRemainingSec: number;
  waveRng: () => number;
  itemRng: () => number;
  outcomes: SortOutcome[];
  items: ActiveBeltItem[];
  sortedIds: Set<number>;
  droppingItems: DroppingItemFx[];
  particles: SparkleParticle[];
  floatingTexts: FloatingScoreText[];
  perfectBanner: PerfectBannerFx | null;
  nextItemId: number;
  spawnedCount: number;
  spawnCooldownSec: number;
  elapsedSec: number;
  beltScrollOffset: number;
  score: number;
  displayedScore: number;
  chain: number;
  bestChain: number;
  hearts: number;
  correctCount: number;
  wrongCount: number;
  missCount: number;
  activeBinCount: number;
  unlocked4thBin: boolean;
  unlockedSpecials: boolean;
  // Wave scheduler
  currentWaveType: WavePatternType | null;
  waveItemsRemaining: number;
  waveRestAfterSec: number;
  // Power-ups
  slowMoCharges: number;
  slowMoRemainingSec: number;
  autoSlowMoRemainingSec: number;
  freezeCharges: number;
  freezeRemainingSec: number;
  // Performance monitor
  lowPerfMode: boolean;
  frameTimeEmaMs: number;
  timeSec: number;
}

export default function BeltSortClient({ hasCustomBg = false, fontClassName = '' }: BeltSortClientProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const columnRef = useRef<HTMLDivElement | null>(null);
  const beltAreaRef = useRef<HTMLDivElement | null>(null);
  const binRowRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spritesRef = useRef<SpriteCache | null>(null);
  const customBgRef = useRef<HTMLImageElement | null>(null);
  const metricsRef = useRef<RenderLayoutMetrics | null>(null);
  const prefersReducedMotionRef = useRef(false);

  // React UI state synced cleanly
  const [phase, setPhase] = useState<PlayPhase>('start');
  const [mode, setMode] = useState<GameMode>('endless');
  const [dailyRemainingSec, setDailyRemainingSec] = useState<number>(
    BELT_SORT_CONFIG.GAMEPLAY.dailyDurationSec
  );
  const [dailyDateStr, setDailyDateStr] = useState('');
  const [dailyBest, setDailyBest] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [shareText, setShareText] = useState('');
  const [shareGrid, setShareGrid] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const shareTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [chain, setChain] = useState(0);
  const [hearts, setHearts] = useState<number>(BELT_SORT_CONFIG.GAMEPLAY.maxHearts);
  const [endlessBest, setEndlessBest] = useState(0);
  const [runsCount, setRunsCount] = useState(0);
  const [bestChainRun, setBestChainRun] = useState(0);
  const [accuracyRun, setAccuracyRun] = useState(100);
  const [activeBinCount, setActiveBinCount] = useState<number>(BELT_SORT_CONFIG.GAMEPLAY.initialBinCount);
  const [unlocked4thBin, setUnlocked4thBin] = useState(false);
  const [unlockedSpecials, setUnlockedSpecials] = useState(false);
  const [slowMoCharges, setSlowMoCharges] = useState(0);
  const [slowMoProgress, setSlowMoProgress] = useState(0);
  const [freezeCharges, setFreezeCharges] = useState(0);
  const [freezeProgress, setFreezeProgress] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [unlockPopupMsg, setUnlockPopupMsg] = useState<string | null>(null);
  const [binFeedback, setBinFeedback] = useState<Record<string, 'bounce' | 'wrong' | null>>({});
  const [stageShake, setStageShake] = useState(false);
  const [heartShakeIdx, setHeartShakeIdx] = useState<number | null>(null);
  const [justUnlockedBin4, setJustUnlockedBin4] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [diamondsEarnedRun, setDiamondsEarnedRun] = useState(0);
  const [pressedBin, setPressedBin] = useState<ShapeKind | null>(null);

  const engineRef = useRef<EngineState>({
    phase: 'start',
    mode: 'endless',
    dailyDateStr: '',
    dailyRemainingSec: BELT_SORT_CONFIG.GAMEPLAY.dailyDurationSec,
    waveRng: Math.random,
    itemRng: Math.random,
    outcomes: [],
    items: [],
    sortedIds: new Set<number>(),
    droppingItems: [],
    particles: [],
    floatingTexts: [],
    perfectBanner: null,
    nextItemId: 1,
    spawnedCount: 0,
    spawnCooldownSec: 0.15,
    elapsedSec: 0,
    beltScrollOffset: 0,
    score: 0,
    displayedScore: 0,
    chain: 0,
    bestChain: 0,
    hearts: BELT_SORT_CONFIG.GAMEPLAY.maxHearts,
    correctCount: 0,
    wrongCount: 0,
    missCount: 0,
    activeBinCount: BELT_SORT_CONFIG.GAMEPLAY.initialBinCount,
    unlocked4thBin: false,
    unlockedSpecials: false,
    currentWaveType: null,
    waveItemsRemaining: 0,
    waveRestAfterSec: 0,
    slowMoCharges: 0,
    slowMoRemainingSec: 0,
    autoSlowMoRemainingSec: 0,
    freezeCharges: 0,
    freezeRemainingSec: 0,
    lowPerfMode: false,
    frameTimeEmaMs: 8,
    timeSec: 0,
  });

  useEffect(() => {
    const today = getLocalDateString();
    setDailyDateStr(today);
    engineRef.current.dailyDateStr = today;

    const savedBest = Math.max(
      getGameBestScore('belt-sort'),
      parseInt(safeStorageGet(BELT_SORT_CONFIG.STORAGE_KEYS.ENDLESS_BEST) || '0', 10) || 0
    );
    if (savedBest > 0) {
      setEndlessBest(savedBest);
    }

    const onProfileSync = () => {
      const syncedBest = getGameBestScore('belt-sort');
      if (syncedBest > 0) {
        setEndlessBest((prev) => Math.max(prev, syncedBest));
      }
    };
    window.addEventListener(PROFILE_SYNCED_EVENT, onProfileSync);

    const savedDailyBest = parseInt(
      safeStorageGet(`${BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_BEST_PREFIX}${today}`) || '0',
      10
    );
    if (!Number.isNaN(savedDailyBest) && savedDailyBest > 0) {
      setDailyBest(savedDailyBest);
    }

    const savedStreak = parseInt(
      safeStorageGet(BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_STREAK) || '0',
      10
    );
    if (!Number.isNaN(savedStreak) && savedStreak > 0) {
      setDailyStreak(savedStreak);
    }

    const savedRuns = parseInt(
      safeStorageGet(BELT_SORT_CONFIG.STORAGE_KEYS.RUNS_COUNT) || '0',
      10
    );
    if (!Number.isNaN(savedRuns) && savedRuns > 0) {
      setRunsCount(savedRuns);
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      prefersReducedMotionRef.current = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }

    setIsMuted(beltSortAudio.getMuted());
    return () => window.removeEventListener(PROFILE_SYNCED_EVENT, onProfileSync);
  }, []);

  useEffect(() => {
    if (!hasCustomBg) return;
    const img = new Image();
    img.src = BELT_SORT_CONFIG.RENDER.optionalBgUrl;
    img.onload = () => {
      customBgRef.current = img;
    };
    img.onerror = () => {
      customBgRef.current = null;
    };
  }, [hasCustomBg]);

  const showToastNotice = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((prev) => (prev === msg ? null : prev)), 1400);
  }, []);

  const showUnlockNotice = useCallback((msg: string) => {
    setUnlockPopupMsg(msg);
    setTimeout(() => setUnlockPopupMsg((prev) => (prev === msg ? null : prev)), 1200);
  }, []);

  const measureMetrics = useCallback(() => {
    const stage = stageRef.current;
    const col = columnRef.current;
    const beltArea = beltAreaRef.current;
    const binRow = binRowRef.current;
    const canvas = canvasRef.current;
    if (!stage || !col || !beltArea || !binRow || !canvas) return;

    const stageRect = stage.getBoundingClientRect();
    const colRect = col.getBoundingClientRect();
    const beltRect = beltArea.getBoundingClientRect();
    const binRowRect = binRow.getBoundingClientRect();

    const w = Math.max(320, Math.round(stageRect.width));
    const h = Math.max(460, Math.round(stageRect.height));
    const dpr = Math.min(BELT_SORT_CONFIG.RENDER.maxDpr, window.devicePixelRatio || 1);

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    const blurOn = !engineRef.current.lowPerfMode;
    if (
      !spritesRef.current ||
      spritesRef.current.bgWidth !== w ||
      spritesRef.current.bgHeight !== h ||
      spritesRef.current.blurEnabled !== blurOn
    ) {
      spritesRef.current = createSpriteCache(w, h, blurOn);
    }

    const binButtons = Array.from(binRow.querySelectorAll<HTMLButtonElement>('[data-bin-btn]'));
    const binCentersX = binButtons.map((btn) => {
      const r = btn.getBoundingClientRect();
      return r.left - stageRect.left + r.width / 2;
    });

    const beltBottomY = Math.max(180, binRowRect.top - stageRect.top - 4);
    const beltTopY = Math.max(96, beltRect.top - stageRect.top + 8);
    const beltBottomWidth = Math.max(240, binRowRect.width - 14);
    const beltTopWidth = beltBottomWidth * BELT_SORT_CONFIG.RENDER.beltTopWidthRatio;

    metricsRef.current = {
      canvasWidth: w,
      canvasHeight: h,
      columnLeft: colRect.left - stageRect.left,
      columnWidth: colRect.width,
      beltTopY,
      beltBottomY,
      beltBottomWidth,
      beltTopWidth,
      binCount: engineRef.current.activeBinCount,
      binCentersX,
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    measureMetrics();

    const observer = new ResizeObserver(() => measureMetrics());
    observer.observe(stage);
    window.addEventListener('resize', measureMetrics);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureMetrics);
    };
  }, [measureMetrics, activeBinCount]);

  const finishGame = useCallback(() => {
    const eng = engineRef.current;
    if (eng.phase === 'gameover') return;
    eng.phase = 'gameover';
    setPhase('gameover');
    setScoreDisplay(eng.score);
    setBestChainRun(eng.bestChain);
    const acc = calculateAccuracyPercent(eng.correctCount, eng.wrongCount, eng.missCount);
    setAccuracyRun(acc);
    beltSortAudio.gameOver();

    let isNewDailyBest = false;
    if (eng.mode === 'daily') {
      const today = eng.dailyDateStr || getLocalDateString();
      const prevDailyBest = parseInt(
        safeStorageGet(`${BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_BEST_PREFIX}${today}`) || '0',
        10
      ) || 0;
      const nextDailyBest = Math.max(prevDailyBest, eng.score);
      isNewDailyBest = eng.score > prevDailyBest && eng.score > 0;
      if (nextDailyBest > prevDailyBest) {
        safeStorageSet(`${BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_BEST_PREFIX}${today}`, String(nextDailyBest));
      }
      setDailyBest(nextDailyBest);
      safeStorageSet(`${BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_PLAYED_PREFIX}${today}`, '1');

      const lastDate = safeStorageGet(BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_LAST_DATE);
      const prevStreak = parseInt(
        safeStorageGet(BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_STREAK) || '0',
        10
      ) || 0;
      const updatedStreak = updateDailyStreakValue(today, lastDate, prevStreak);
      safeStorageSet(BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_STREAK, String(updatedStreak.streak));
      safeStorageSet(BELT_SORT_CONFIG.STORAGE_KEYS.DAILY_LAST_DATE, updatedStreak.lastDate);
      setDailyStreak(updatedStreak.streak);

      const grid = formatDailyEmojiGrid(eng.outcomes);
      const txt = buildDailyShareText({
        dateStr: today,
        score: eng.score,
        bestChain: eng.bestChain,
        accuracyPercent: acc,
        outcomes: eng.outcomes,
        streak: updatedStreak.streak,
      });
      setShareGrid(grid);
      setShareText(txt);
      setCopyState('idle');
    } else {
      const prevBest = parseInt(
        safeStorageGet(BELT_SORT_CONFIG.STORAGE_KEYS.ENDLESS_BEST) || '0',
        10
      ) || 0;
      const nextBest = Math.max(prevBest, eng.score);
      if (nextBest > prevBest) {
        safeStorageSet(BELT_SORT_CONFIG.STORAGE_KEYS.ENDLESS_BEST, String(nextBest));
      }
      setEndlessBest(nextBest);
    }

    const earned = computeDiamondsEarned(eng.score, isNewDailyBest);
    setDiamondsEarnedRun(earned);
    if (earned > 0) {
      addWalletDiamonds(earned);
    }
    setGameBestScore('belt-sort', eng.score);
    incrementGamePlayCount('belt-sort');
    trackGameEvent('run_end', { mode: eng.mode, score: eng.score });

    const nextRuns = runsCount + 1;
    safeStorageSet(BELT_SORT_CONFIG.STORAGE_KEYS.RUNS_COUNT, String(nextRuns));
    setRunsCount(nextRuns);
  }, [runsCount]);

  const startRun = useCallback((chosenMode: GameMode) => {
    beltSortAudio.unlockAudio();
    const eng = engineRef.current;
    const today = getLocalDateString();
    setDailyDateStr(today);

    eng.phase = 'playing';
    eng.mode = chosenMode;
    eng.dailyDateStr = today;
    eng.dailyRemainingSec = BELT_SORT_CONFIG.GAMEPLAY.dailyDurationSec;
    if (chosenMode === 'daily') {
      eng.waveRng = mulberry32(hashString(`tappyard-beltsort-waves:${today}`));
      eng.itemRng = mulberry32(hashString(`tappyard-beltsort-items:${today}`));
    } else {
      eng.waveRng = Math.random;
      eng.itemRng = Math.random;
    }

    eng.outcomes = [];
    eng.items = [];
    eng.sortedIds.clear();
    eng.droppingItems = [];
    eng.particles = [];
    eng.floatingTexts = [];
    eng.perfectBanner = null;
    eng.nextItemId = 1;
    eng.spawnedCount = 0;
    eng.spawnCooldownSec = 0.2;
    eng.elapsedSec = 0;
    eng.score = 0;
    eng.displayedScore = 0;
    eng.chain = 0;
    eng.bestChain = 0;
    eng.hearts = BELT_SORT_CONFIG.GAMEPLAY.maxHearts;
    eng.correctCount = 0;
    eng.wrongCount = 0;
    eng.missCount = 0;
    eng.activeBinCount = BELT_SORT_CONFIG.GAMEPLAY.initialBinCount;
    eng.unlocked4thBin = false;
    eng.unlockedSpecials = false;
    eng.currentWaveType = null;
    eng.waveItemsRemaining = 0;
    eng.waveRestAfterSec = 0;
    eng.slowMoCharges = 0;
    eng.slowMoRemainingSec = 0;
    eng.autoSlowMoRemainingSec = 0;
    eng.freezeCharges = 0;
    eng.freezeRemainingSec = 0;

    setMode(chosenMode);
    setDailyRemainingSec(BELT_SORT_CONFIG.GAMEPLAY.dailyDurationSec);
    setScoreDisplay(0);
    setChain(0);
    setHearts(BELT_SORT_CONFIG.GAMEPLAY.maxHearts);
    setBestChainRun(0);
    setAccuracyRun(100);
    setDiamondsEarnedRun(0);
    setShareText('');
    setShareGrid('');
    setCopyState('idle');
    setActiveBinCount(BELT_SORT_CONFIG.GAMEPLAY.initialBinCount);
    setUnlocked4thBin(false);
    setUnlockedSpecials(false);
    setJustUnlockedBin4(false);
    setSlowMoCharges(0);
    setSlowMoProgress(0);
    setFreezeCharges(0);
    setFreezeProgress(0);
    setPhase('playing');
    addRecentGameId('belt-sort');
    trackGameEvent('run_start', { mode: chosenMode });

    requestAnimationFrame(() => measureMetrics());
  }, [measureMetrics]);

  const triggerMistakeFeedback = useCallback((newHearts: number) => {
    beltSortAudio.mistake();
    setHeartShakeIdx(newHearts);
    setTimeout(() => setHeartShakeIdx(null), 420);

    if (!prefersReducedMotionRef.current) {
      setStageShake(true);
      setTimeout(() => setStageShake(false), 300);
    }

    triggerHaptic('warning');
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = beltSortAudio.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const activateSlowMo = useCallback(() => {
    beltSortAudio.unlockAudio();
    const eng = engineRef.current;
    if (
      eng.phase !== 'playing' ||
      eng.slowMoCharges <= 0 ||
      eng.slowMoRemainingSec > 0
    ) {
      return;
    }
    eng.slowMoCharges = 0;
    eng.slowMoRemainingSec = BELT_SORT_CONFIG.POWERUPS.slowMoDurationSec;
    setSlowMoCharges(0);
    setSlowMoProgress(1);
    beltSortAudio.slowMo();
    triggerHaptic('medium');
  }, []);

  const activateFreeze = useCallback(() => {
    beltSortAudio.unlockAudio();
    const eng = engineRef.current;
    if (
      eng.phase !== 'playing' ||
      eng.freezeCharges <= 0 ||
      eng.freezeRemainingSec > 0
    ) {
      return;
    }
    eng.freezeCharges = 0;
    eng.freezeRemainingSec = BELT_SORT_CONFIG.POWERUPS.freezeDurationSec;
    setFreezeCharges(0);
    setFreezeProgress(1);
    beltSortAudio.freeze();
    triggerHaptic('medium');
  }, []);

  const handleBinTap = useCallback(
    (binKind: ShapeKind) => {
      beltSortAudio.unlockAudio();
      const eng = engineRef.current;
      if (eng.phase !== 'playing') return;

      const activeBins = BELT_SORT_CONFIG.BINS.slice(0, eng.activeBinCount);
      const binIndex = activeBins.findIndex((b) => b.id === binKind);
      if (binIndex < 0) return;

      let frontIdx = -1;
      let maxProg = -1;
      for (let i = 0; i < eng.items.length; i++) {
        const it = eng.items[i];
        if (!eng.sortedIds.has(it.id) && it.yProgress > maxProg) {
          maxProg = it.yProgress;
          frontIdx = i;
        }
      }
      if (frontIdx < 0) return;

      const frontItem = eng.items[frontIdx];
      eng.sortedIds.add(frontItem.id);
      eng.items.splice(frontIdx, 1);

      const result = evaluateSort(
        frontItem.kind,
        binKind,
        frontItem.yProgress,
        eng.chain
      );

      const m = metricsRef.current;
      const cx = m ? m.columnLeft + m.columnWidth / 2 : 200;
      const beltH = m ? Math.max(120, m.beltBottomY - m.beltTopY) : 260;
      const perspT = Math.pow(Math.max(0, Math.min(1, frontItem.yProgress)), 1.12);
      const itemY = m ? m.beltTopY + 12 + perspT * (beltH - 28) : 260;
      const targetX = m?.binCentersX[binIndex] ?? cx;
      const targetY = m ? m.beltBottomY + 28 : 420;

      if (result.isCorrect) {
        eng.outcomes.push('correct');
        eng.correctCount += 1;
        eng.score += result.pointsAwarded;
        eng.chain = result.nextChain;
        if (eng.chain > eng.bestChain) {
          eng.bestChain = eng.chain;
        }
        setChain(eng.chain);

        // Chain 10+ milestone -> Slow-Mo charge + brief auto slow-mo pulse
        if (result.grantedSlowMo) {
          eng.autoSlowMoRemainingSec = BELT_SORT_CONFIG.POWERUPS.chainMilestoneAutoSlowMoSec;
          if (eng.slowMoCharges < BELT_SORT_CONFIG.POWERUPS.slowMoMaxStored) {
            eng.slowMoCharges = BELT_SORT_CONFIG.POWERUPS.slowMoMaxStored;
            setSlowMoCharges(eng.slowMoCharges);
          }
          showToastNotice('SLOW-MO READY!');
          beltSortAudio.chainBonus();
          triggerHaptic('success');
        } else if (result.isPerfect || result.isWildcard) {
          beltSortAudio.perfect(eng.chain);
          triggerHaptic('medium');
        } else {
          beltSortAudio.sort(eng.chain);
          triggerHaptic('light');
        }

        // Freeze crystal sorted -> Freeze charge
        if (result.grantedFreeze && eng.freezeCharges < BELT_SORT_CONFIG.POWERUPS.freezeMaxStored) {
          eng.freezeCharges = BELT_SORT_CONFIG.POWERUPS.freezeMaxStored;
          setFreezeCharges(eng.freezeCharges);
          showToastNotice('FREEZE READY!');
          beltSortAudio.freeze();
        }

        // In-run Unlock 1: 4th Bin at 25 sorts
        if (!eng.unlocked4thBin && eng.correctCount >= BELT_SORT_CONFIG.UNLOCKS.fourthBinSorts) {
          eng.unlocked4thBin = true;
          eng.activeBinCount = BELT_SORT_CONFIG.GAMEPLAY.maxBinCount;
          setUnlocked4thBin(true);
          setActiveBinCount(BELT_SORT_CONFIG.GAMEPLAY.maxBinCount);
          setJustUnlockedBin4(true);
          showUnlockNotice('4th Bin Unlocked!');
          beltSortAudio.unlock();
          triggerHaptic('success');
          requestAnimationFrame(() => measureMetrics());
          setTimeout(() => measureMetrics(), 480);
        }

        // In-run Unlock 2: Wildcard & Freeze at 60 sorts
        if (!eng.unlockedSpecials && eng.correctCount >= BELT_SORT_CONFIG.UNLOCKS.specialsSorts) {
          eng.unlockedSpecials = true;
          setUnlockedSpecials(true);
          showToastNotice('Wildcard & Freeze Unlocked!');
          beltSortAudio.unlock();
        }

        setBinFeedback((prev) => ({ ...prev, [binKind]: 'bounce' }));
        setTimeout(() => setBinFeedback((prev) => ({ ...prev, [binKind]: null })), 260);

        eng.droppingItems.push({
          id: frontItem.id,
          kind: frontItem.kind,
          startX: cx,
          startY: itemY,
          targetX,
          targetY,
          startScale: itemScaleAt(frontItem.yProgress),
          elapsed: 0,
          duration: 0.16,
        });

        eng.floatingTexts.push({
          text: `+${result.pointsAwarded}`,
          x: targetX,
          y: targetY - 26,
          vy: -58,
          color: result.isPerfect || result.isWildcard ? '#ffe36e' : '#ffffff',
          life: 0,
          maxLife: 0.65,
          scale: result.isPerfect ? 1.15 : 0.92,
        });

        if (result.isPerfect || result.isWildcard) {
          if (result.isPerfect) {
            eng.perfectBanner = { life: 0, maxLife: 0.7 };
          }
          const burstCount = prefersReducedMotionRef.current ? 4 : 10;
          for (let p = 0; p < burstCount; p++) {
            const ang = (Math.PI * 2 * p) / burstCount;
            const spd = 70 + Math.random() * 90;
            eng.particles.push({
              x: cx,
              y: itemY,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd - 35,
              size: 5 + Math.random() * 5,
              color: p % 2 === 0 ? '#fff59d' : '#ffd23f',
              alpha: 1,
              life: 0,
              maxLife: 0.55,
              isStar: true,
            });
          }
        }
      } else {
        eng.outcomes.push('wrong');
        eng.wrongCount += 1;
        eng.chain = 0;
        eng.hearts = Math.max(0, eng.hearts - 1);
        setChain(0);
        setHearts(eng.hearts);

        setBinFeedback((prev) => ({ ...prev, [binKind]: 'wrong' }));
        setTimeout(() => setBinFeedback((prev) => ({ ...prev, [binKind]: null })), 340);

        triggerMistakeFeedback(eng.hearts);

        if (eng.hearts <= 0) {
          finishGame();
        }
      }
    },
    [finishGame, measureMetrics, showToastNotice, showUnlockNotice, triggerMistakeFeedback]
  );

  // Keyboard bindings: 1/2/3/4, A/S/D/F, Arrow keys, Q Freeze, E/Space Slow-Mo, P/Esc Pause
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const triggerPressedKeyBin = (kind: ShapeKind) => {
        setPressedBin(kind);
        setTimeout(() => setPressedBin((prev) => (prev === kind ? null : prev)), 110);
        handleBinTap(kind);
      };

      if (engineRef.current.phase === 'playing') {
        if (key === '1' || key === 'a' || e.key === 'ArrowLeft') {
          e.preventDefault();
          triggerPressedKeyBin('circle');
          return;
        }
        if (key === '2' || key === 's' || e.key === 'ArrowDown') {
          e.preventDefault();
          triggerPressedKeyBin('square');
          return;
        }
        if (key === '3' || key === 'd' || e.key === 'ArrowRight') {
          e.preventDefault();
          triggerPressedKeyBin('triangle');
          return;
        }
        if ((key === '4' || key === 'f') && engineRef.current.activeBinCount >= 4) {
          e.preventDefault();
          triggerPressedKeyBin('diamond');
          return;
        }
        if (key === 'q') {
          e.preventDefault();
          activateFreeze();
          return;
        }
        if (key === 'e' || e.key === ' ') {
          e.preventDefault();
          activateSlowMo();
          return;
        }
      }

      if (key === 'm') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (key === 'escape' || key === 'p') {
        if (engineRef.current.phase === 'playing') {
          engineRef.current.phase = 'paused';
          setPhase('paused');
        } else if (engineRef.current.phase === 'paused') {
          engineRef.current.phase = 'playing';
          setPhase('playing');
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activateFreeze, activateSlowMo, handleBinTap, handleToggleMute]);

  // Auto-pause on hidden tab
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && engineRef.current.phase === 'playing') {
        engineRef.current.phase = 'paused';
        setPhase('paused');
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Main Animation Loop (Waves + Power-ups + Difficulty Ramp)
  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const step = (now: number) => {
      const rawDtMs = now - lastTs;
      lastTs = now;
      const dt = Math.min(BELT_SORT_CONFIG.RENDER.maxDtSec, Math.max(0.001, rawDtMs / 1000));

      const eng = engineRef.current;
      eng.timeSec += dt;

      eng.frameTimeEmaMs = eng.frameTimeEmaMs * 0.92 + rawDtMs * 0.08;
      if (!eng.lowPerfMode && eng.frameTimeEmaMs > BELT_SORT_CONFIG.RENDER.perfFallbackFrameMs && rawDtMs < 150) {
        eng.lowPerfMode = true;
        measureMetrics();
      }

      if (eng.displayedScore < eng.score) {
        const diff = eng.score - eng.displayedScore;
        eng.displayedScore =
          diff <= 2 ? eng.score : eng.displayedScore + Math.ceil(diff * Math.min(1, dt * 16));
        setScoreDisplay(eng.displayedScore);
      }

      if (eng.phase === 'playing') {
        // Daily Run 60s countdown (stops run cleanly at 0:00)
        if (eng.mode === 'daily') {
          const prevDisplaySec = Math.ceil(eng.dailyRemainingSec);
          eng.dailyRemainingSec = Math.max(0, eng.dailyRemainingSec - dt);
          const nextDisplaySec = Math.ceil(eng.dailyRemainingSec);
          if (nextDisplaySec !== prevDisplaySec) {
            setDailyRemainingSec(nextDisplaySec);
          }
          if (eng.dailyRemainingSec <= 0) {
            finishGame();
            rafId = requestAnimationFrame(step);
            return;
          }
        }

        // Active power-up timers
        if (eng.freezeRemainingSec > 0) {
          eng.freezeRemainingSec = Math.max(0, eng.freezeRemainingSec - dt);
          setFreezeProgress(eng.freezeRemainingSec / BELT_SORT_CONFIG.POWERUPS.freezeDurationSec);
        }
        if (eng.slowMoRemainingSec > 0) {
          eng.slowMoRemainingSec = Math.max(0, eng.slowMoRemainingSec - dt);
          setSlowMoProgress(eng.slowMoRemainingSec / BELT_SORT_CONFIG.POWERUPS.slowMoDurationSec);
        }
        if (eng.autoSlowMoRemainingSec > 0) {
          eng.autoSlowMoRemainingSec = Math.max(0, eng.autoSlowMoRemainingSec - dt);
        }

        const isFrozen = eng.freezeRemainingSec > 0;
        let speedFactor = 1;
        if (isFrozen) {
          speedFactor = 0;
        } else if (eng.slowMoRemainingSec > 0) {
          speedFactor = BELT_SORT_CONFIG.POWERUPS.slowMoBeltFactor;
        } else if (eng.autoSlowMoRemainingSec > 0) {
          speedFactor = BELT_SORT_CONFIG.POWERUPS.chainMilestoneAutoSlowMoFactor;
        }

        const effectiveDt = dt * speedFactor;
        eng.elapsedSec += effectiveDt;

        const travelSec = getTravelTimeSec(
          eng.elapsedSec,
          eng.spawnedCount < BELT_SORT_CONFIG.GAMEPLAY.guidedSequence.length
        );
        eng.beltScrollOffset = (eng.beltScrollOffset + effectiveDt / travelSec) % 1;

        // Wave-based spawner (paused completely during Freeze!)
        if (!isFrozen) {
          eng.spawnCooldownSec -= effectiveDt;
          if (eng.spawnCooldownSec <= 0) {
            const idx = eng.spawnedCount;
            if (idx < BELT_SORT_CONFIG.GAMEPLAY.guidedSequence.length) {
              // Guided start: Circle -> Square -> Triangle
              const kind = pickNextItemKind(
                eng.itemRng,
                eng.activeBinCount,
                eng.unlockedSpecials,
                idx
              );
              eng.items.push({ id: eng.nextItemId++, kind, yProgress: 0 });
              eng.spawnedCount += 1;
              eng.spawnCooldownSec = idx === BELT_SORT_CONFIG.GAMEPLAY.guidedSequence.length - 1 ? 1.15 : 1.35;
            } else {
              // Ensure an active wave is selected
              if (eng.waveItemsRemaining <= 0) {
                const wave = pickNextWavePattern(eng.waveRng, eng.currentWaveType);
                eng.currentWaveType = wave.type;
                if (wave.type === 'breather') {
                  eng.waveItemsRemaining = 0;
                  eng.spawnCooldownSec = wave.restAfterSec;
                } else {
                  const span = wave.maxCount - wave.minCount + 1;
                  eng.waveItemsRemaining =
                    wave.minCount + Math.floor(eng.waveRng() * span);
                  eng.waveRestAfterSec = wave.restAfterSec;
                }
              }

              if (eng.waveItemsRemaining > 0) {
                const kind = pickNextItemKind(
                  eng.itemRng,
                  eng.activeBinCount,
                  eng.unlockedSpecials,
                  idx
                );
                eng.items.push({ id: eng.nextItemId++, kind, yProgress: 0 });
                eng.spawnedCount += 1;
                eng.waveItemsRemaining -= 1;

                if (eng.waveItemsRemaining === 0) {
                  eng.spawnCooldownSec = eng.waveRestAfterSec;
                } else {
                  const activeWaveDef =
                    BELT_SORT_CONFIG.WAVE_PATTERNS.find((w) => w.type === eng.currentWaveType) ||
                    BELT_SORT_CONFIG.WAVE_PATTERNS[0];
                  eng.spawnCooldownSec = getWaveSpawnIntervalSec(activeWaveDef, eng.elapsedSec);
                }
              }
            }
          }
        }

        // Advance active items
        if (!isFrozen) {
          for (let i = eng.items.length - 1; i >= 0; i--) {
            const item = eng.items[i];
            const itemTravelSec = getTravelTimeSec(
              eng.elapsedSec,
              item.id <= BELT_SORT_CONFIG.GAMEPLAY.guidedSequence.length
            );
            item.yProgress += effectiveDt / itemTravelSec;

            if (item.yProgress >= 1.0) {
              eng.sortedIds.add(item.id);
              eng.items.splice(i, 1);
              eng.outcomes.push('miss');
              eng.missCount += 1;
              eng.chain = 0;
              eng.hearts = Math.max(0, eng.hearts - 1);
              setChain(0);
              setHearts(eng.hearts);
              triggerMistakeFeedback(eng.hearts);

              if (eng.hearts <= 0) {
                finishGame();
                break;
              }
            }
          }
        }
      }

      for (let i = eng.droppingItems.length - 1; i >= 0; i--) {
        eng.droppingItems[i].elapsed += dt;
        if (eng.droppingItems[i].elapsed >= eng.droppingItems[i].duration) {
          eng.droppingItems.splice(i, 1);
        }
      }

      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const pt = eng.particles[i];
        pt.life += dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 220 * dt;
        pt.alpha = Math.max(0, 1 - pt.life / pt.maxLife);
        if (pt.life >= pt.maxLife) {
          eng.particles.splice(i, 1);
        }
      }

      for (let i = eng.floatingTexts.length - 1; i >= 0; i--) {
        const ft = eng.floatingTexts[i];
        ft.life += dt;
        ft.y += ft.vy * dt;
        if (ft.life >= ft.maxLife) {
          eng.floatingTexts.splice(i, 1);
        }
      }

      if (eng.perfectBanner) {
        eng.perfectBanner.life += dt;
        if (eng.perfectBanner.life >= eng.perfectBanner.maxLife) {
          eng.perfectBanner = null;
        }
      }

      const canvas = canvasRef.current;
      const m = metricsRef.current;
      const sprites = spritesRef.current;
      if (canvas && m && sprites) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = Math.min(BELT_SORT_CONFIG.RENDER.maxDpr, window.devicePixelRatio || 1);
          const parallaxX = prefersReducedMotionRef.current
            ? 0
            : Math.sin(eng.timeSec * 0.25) * 6;
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          renderBeltScene(ctx, sprites, m, {
            beltScrollOffset: eng.beltScrollOffset,
            parallaxX,
            items: eng.items,
            droppingItems: eng.droppingItems,
            particles: eng.particles,
            floatingTexts: eng.floatingTexts,
            perfectBanner: eng.perfectBanner,
            showPerfectTag: runsCount < BELT_SORT_CONFIG.GAMEPLAY.perfectBannerRunsVisible,
            slowMoActive: eng.slowMoRemainingSec > 0 || eng.autoSlowMoRemainingSec > 0,
            freezeActive: eng.freezeRemainingSec > 0,
            lowPerfMode: eng.lowPerfMode,
            customBgImage: customBgRef.current,
            timeSec: eng.timeSec,
          });
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [finishGame, measureMetrics, runsCount, triggerMistakeFeedback]);

  const activeBins = BELT_SORT_CONFIG.BINS.slice(0, activeBinCount);
  const nextTarget = getNextChainTarget(chain);
  const chainProgressRatio =
    ((chain % BELT_SORT_CONFIG.SCORING.chainBonusInterval) /
      BELT_SORT_CONFIG.SCORING.chainBonusInterval) *
    100;
  const currentMultiplier = getChainMultiplier(chain);
  const showHintPill = runsCount === 0;
  const showUnlocksCard = !(unlocked4thBin && unlockedSpecials);
  const freezeActiveNow = freezeProgress > 0;
  const slowMoActiveNow = slowMoProgress > 0;

  const togglePause = () => {
    const eng = engineRef.current;
    if (eng.phase === 'playing') {
      eng.phase = 'paused';
      setPhase('paused');
    } else if (eng.phase === 'paused') {
      eng.phase = 'playing';
      setPhase('playing');
    }
  };

  return (
    <section
      className={`bs-root bs-font-body w-full flex flex-col bg-[#0b1233] text-white select-none ${fontClassName}`}
    >
      <GameHeader
        title="Conveyor Sort Rush"
        category="Casual"
        icon={<Gem className="w-4 h-4 text-cyan-300" />}
      />

      <main
        id="game-stage"
        ref={stageRef}
        className={`relative w-full h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] overflow-hidden bg-[#6ec6ff] ${
          stageShake ? 'bs-stage-shake' : ''
        }`}
      >
        <ChallengerBanner gameSlug="belt-sort" currentScore={scoreDisplay} />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{ touchAction: 'none' }}
        />

        {/* Centered 9:16 Portrait Column */}
        <div
          ref={columnRef}
          className="relative z-10 w-full max-w-[480px] h-full mx-auto px-2 sm:px-3.5 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] flex flex-col justify-between"
        >
          {/* TOP HUD + CHAIN BAR */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-stretch gap-1 sm:gap-2">
              <button
                type="button"
                onClick={togglePause}
                disabled={phase !== 'playing' && phase !== 'paused'}
                aria-label={phase === 'paused' ? 'Resume game' : 'Pause game'}
                className="bs-gloss-btn bs-btn-blue w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full shrink-0 flex items-center justify-center cursor-pointer self-center disabled:opacity-60"
              >
                {phase === 'paused' ? (
                  <Play className="w-6 h-6 text-white fill-white ml-0.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" />
                ) : (
                  <Pause className="w-6 h-6 text-white fill-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" />
                )}
              </button>

              <div className="bs-panel rounded-2xl px-1.5 sm:px-2.5 py-1 flex-1 min-w-0 flex flex-col items-center justify-center leading-none">
                <span className="text-[9px] sm:text-[11px] font-bold text-white/95 tracking-wide mb-0.5 bs-text-stroke">
                  Score
                </span>
                <span className="bs-font-display bs-outline-num text-lg sm:text-2xl leading-none tabular-nums">
                  {scoreDisplay.toLocaleString()}
                </span>
              </div>

              <div className="bs-panel rounded-2xl px-1.5 sm:px-2.5 py-1 min-w-[44px] sm:min-w-[60px] flex flex-col items-center justify-center leading-none shrink-0">
                <span className="text-[9px] sm:text-[11px] font-bold text-white/95 tracking-wide mb-0.5 bs-text-stroke">
                  Chain
                </span>
                <span className="bs-font-display bs-outline-num text-lg sm:text-2xl leading-none tabular-nums">
                  x{currentMultiplier}
                </span>
              </div>

              <div
                aria-label={`${hearts} of ${BELT_SORT_CONFIG.GAMEPLAY.maxHearts} hearts remaining`}
                className="bs-panel rounded-2xl px-1.5 sm:px-2.5 py-1 flex items-center justify-center gap-0.5 sm:gap-1 shrink-0"
              >
                {Array.from({ length: BELT_SORT_CONFIG.GAMEPLAY.maxHearts }).map((_, idx) => (
                  <GlossyHeartIcon
                    key={idx}
                    lost={idx >= hearts}
                    shaking={heartShakeIdx === idx}
                  />
                ))}
              </div>

              {/* Right Mode / Timer / Best Panel */}
              {mode === 'daily' ? (
                <div className="bs-panel rounded-2xl px-1.5 sm:px-2.5 py-1 min-w-[78px] sm:min-w-[104px] flex flex-col items-center justify-center leading-none shrink-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-sky-400 border border-white flex items-center justify-center shrink-0">
                      <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#09123a]" strokeWidth={2.75} />
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] font-bold text-white whitespace-nowrap">
                      Daily Run
                    </span>
                  </div>
                  <span className="bs-font-display bs-outline-num text-sm sm:text-lg leading-none tabular-nums">
                    {formatTimeMMSS(dailyRemainingSec)}
                  </span>
                  <div className="mt-0.5 px-1 sm:px-1.5 py-0.5 rounded-full bg-[#09102e]/80 border border-sky-400/35 flex items-center gap-0.5 sm:gap-1">
                    <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                    <span className="text-[8px] sm:text-[9px] font-bold text-amber-100 whitespace-nowrap tabular-nums">
                      Best: {Math.max(dailyBest, scoreDisplay).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bs-panel rounded-2xl px-1.5 sm:px-2.5 py-1 min-w-[78px] sm:min-w-[104px] flex flex-col items-center justify-center leading-none shrink-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                    <span className="text-[8.5px] sm:text-[10px] font-bold text-white whitespace-nowrap">
                      Best
                    </span>
                  </div>
                  <span className="bs-font-display bs-outline-num text-sm sm:text-lg leading-none tabular-nums">
                    {Math.max(endlessBest, scoreDisplay).toLocaleString()}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-amber-100 mt-0.5 whitespace-nowrap">
                    Endless Mode
                  </span>
                </div>
              )}
            </div>

            {/* Chain Progress Bar */}
            <div className="flex flex-col items-center px-2 sm:px-4">
              <div className="relative w-full max-w-[360px] flex items-center">
                <div className="bs-panel w-full h-4 sm:h-[18px] rounded-full p-0.5 overflow-hidden">
                  <div
                    className="relative h-full rounded-full overflow-hidden transition-all duration-150"
                    style={{
                      width: `${Math.max(chain > 0 ? 8 : 0, chainProgressRatio)}%`,
                      background: 'linear-gradient(180deg, #fff18a 0%, #ffd23f 50%, #f59e0b 100%)',
                      boxShadow: '0 0 10px rgba(255, 210, 63, 0.7)',
                    }}
                  >
                    <div className="bs-chain-shine absolute inset-y-0 w-10 bg-white/55 blur-[1px]" />
                  </div>
                </div>

                <div className="relative -ml-3 z-10 w-8 h-9 sm:w-9 sm:h-10 shrink-0 flex items-center justify-center drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]">
                  <svg viewBox="0 0 36 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
                    <path
                      d="M18 2 L33 7.5 V19.5 C33 28.5 26 35 18 38 C10 35 3 28.5 3 19.5 V7.5 Z"
                      fill="url(#bsShieldGrad)"
                      stroke="#78350f"
                      strokeWidth="2.5"
                    />
                    <defs>
                      <linearGradient id="bsShieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fff3a1" />
                        <stop offset="50%" stopColor="#ffd23f" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="bs-font-display relative z-10 text-sm sm:text-base text-white bs-text-stroke -mt-0.5">
                    {nextTarget}
                  </span>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white bs-text-stroke -mt-1 tracking-wide">
                Next: Slow-Mo + Bonus
              </span>
            </div>
          </div>

          {/* MIDDLE BELT FIELD + COLLAPSIBLE UNLOCKS + POPUPS */}
          <div ref={beltAreaRef} className="relative flex-1 min-h-[190px] w-full pointer-events-none">
            {showUnlocksCard && (
              <div className="absolute top-1.5 left-0 z-10 w-[86px] sm:w-[116px] transition-opacity duration-300">
                <div className="relative pt-2.5">
                  <div
                    className="mx-auto w-[72px] sm:w-[90px] py-0.5 rounded-full text-center relative z-10 -mb-2.5 border border-[#b45309] shadow-md"
                    style={{
                      background: 'linear-gradient(180deg, #fff199 0%, #ffd23f 55%, #f59e0b 100%)',
                    }}
                  >
                    <span className="bs-font-display text-[11px] sm:text-sm text-[#451a03] tracking-wide">
                      Unlocks
                    </span>
                  </div>
                  <div className="bs-panel rounded-2xl px-1.5 sm:px-2 pt-3 pb-2 text-center flex flex-col gap-1">
                    <div className={`leading-tight ${unlocked4thBin ? 'opacity-50' : ''}`}>
                      <div className="text-[9px] sm:text-[11px] font-bold text-white">
                        25 Sorts {unlocked4thBin ? '✓' : '→'}
                      </div>
                      <div className="text-[10px] sm:text-xs font-extrabold text-[#ffe36e]">4th Bin</div>
                    </div>
                    <div className="h-[1px] bg-sky-400/35 w-full" />
                    <div className={`leading-tight ${unlockedSpecials ? 'opacity-50' : ''}`}>
                      <div className="text-[9px] sm:text-[11px] font-bold text-white">
                        60 Sorts {unlockedSpecials ? '✓' : '→'}
                      </div>
                      <div className="text-[9.5px] sm:text-[11px] font-extrabold text-[#ffe36e] leading-tight">
                        Wildcard &amp; Freeze
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Non-blocking Toast (e.g., SLOW-MO READY) */}
            {toastMsg && (
              <div className="bs-pop-banner absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-[#0b1233]/95 border-2 border-[#ffe36e] shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-4 h-4 text-[#ffe36e]" />
                <span className="bs-font-display text-sm sm:text-base text-[#ffe36e] tracking-wide">
                  {toastMsg}
                </span>
              </div>
            )}

            {/* Non-blocking 4th Bin Unlocked Popup with Burst Rays */}
            {unlockPopupMsg && (
              <div className="bs-pop-banner absolute inset-x-0 top-1/3 flex justify-center items-center z-20 pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div className="bs-burst-rays absolute w-48 h-48 rounded-full pointer-events-none" />
                  <div className="relative bs-panel rounded-3xl px-5 py-3 flex items-center gap-3 shadow-2xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#b37aff] to-[#5219b8] border border-[#d4b5ff] flex items-center justify-center shadow-lg">
                      <ShapeSvgIcon shape="diamond" className="w-6 h-6" />
                    </div>
                    <span className="bs-font-display bs-outline-num text-xl sm:text-2xl">
                      {unlockPopupMsg}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM BINS + POWER-UPS BAR */}
          <div className="flex flex-col gap-3 shrink-0 pt-1">
            <div
              ref={binRowRef}
              className={`grid ${activeBinCount === 4 ? 'grid-cols-4 gap-1.5 sm:gap-2.5' : 'grid-cols-3 gap-2 sm:gap-3'} w-full px-0.5 transition-all duration-300`}
            >
              {activeBins.map((bin) => {
                const fb = binFeedback[bin.id];
                const isSlidingIn = bin.id === 'diamond' && justUnlockedBin4;
                return (
                  <button
                    key={bin.id}
                    type="button"
                    data-bin-btn={bin.id}
                    data-shape={bin.id}
                    onClick={() => handleBinTap(bin.id)}
                    aria-label={`Sort into ${bin.label} bin (Keys ${bin.keyHint} or ${bin.altKeyHint})`}
                    className={`bs-bin-btn flex flex-col justify-between pb-2.5 pt-1 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white sm:min-h-[96px] ${
                      pressedBin === bin.id ? 'bs-bin-pressed ' : ''
                    }${
                      fb === 'bounce'
                        ? 'bs-bin-bounce'
                        : fb === 'wrong'
                          ? 'bs-bin-wrong'
                          : isSlidingIn
                            ? 'bs-bin-slide-in'
                            : ''
                    }`}
                  >
                    <div className="bs-bin-opening" />
                    <div className="bs-bin-front-gloss" />
                    <div className="relative z-[3] flex-1 flex items-center justify-center pt-1">
                      <ShapeSvgIcon
                        shape={bin.id}
                        className="w-7 h-7 sm:w-10 sm:h-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Power-Ups & Hint Bar */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-0.5">
              {/* Freeze Button */}
              <button
                type="button"
                onClick={activateFreeze}
                disabled={phase !== 'playing' || (freezeCharges <= 0 && !freezeActiveNow)}
                aria-label={
                  freezeActiveNow
                    ? 'Freeze active'
                    : freezeCharges > 0
                      ? 'Activate Freeze belt for 3 seconds (Key Q)'
                      : 'Freeze power-up empty'
                }
                className={`bs-gloss-btn min-h-[48px] px-2.5 sm:px-4 rounded-2xl flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  freezeActiveNow || freezeCharges > 0
                    ? 'bs-btn-freeze text-[#062845] cursor-pointer'
                    : 'bs-btn-locked text-white/80 opacity-85 cursor-not-allowed'
                }`}
              >
                {freezeActiveNow ? (
                  <RadialTimerRing progress={freezeProgress} />
                ) : (
                  <Snowflake className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                )}
                <span
                  className={`bs-font-display text-xs sm:text-base tracking-wide ${
                    freezeActiveNow || freezeCharges > 0 ? 'text-white bs-text-stroke' : 'bs-text-stroke'
                  }`}
                >
                  Freeze
                </span>
              </button>

              {showHintPill ? (
                <div className="flex-1 min-w-0 max-w-[210px] min-h-[48px] px-2 py-1.5 rounded-2xl bg-gradient-to-b from-[#fffdf0] to-[#ffe69c] border-2 border-[#f59e0b] shadow-[0_4px_0_#b45309,0_8px_14px_rgba(0,0,0,0.3)] flex items-center justify-center gap-1 sm:gap-1.5">
                  <svg viewBox="0 0 28 32" className="w-4 h-5 sm:w-5 sm:h-6 shrink-0" aria-hidden="true">
                    <path
                      d="M12 2 C10.5 2 9.5 3.1 9.5 4.5 V14.5 L7.4 12.6 C6.3 11.6 4.6 11.7 3.7 12.9 C2.9 14 3.1 15.5 4.1 16.5 L10.8 23.8 C12.1 25.2 13.9 26 15.8 26 H20.5 C23.3 26 25.5 23.8 25.5 21 V13.8 C25.5 12.4 24.4 11.3 23 11.3 C22.3 11.3 21.7 11.6 21.2 12 C20.8 11 19.8 10.3 18.6 10.3 C17.9 10.3 17.2 10.6 16.7 11.1 C16.3 10.2 15.4 9.6 14.5 9.6 V4.5 C14.5 3.1 13.4 2 12 2 Z"
                      fill="#ffffff"
                      stroke="#0b1233"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[10px] sm:text-xs font-extrabold text-[#0b1233] truncate">
                    Tap a bin to sort!
                  </span>
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Slow-Mo Button */}
              <button
                type="button"
                onClick={activateSlowMo}
                disabled={phase !== 'playing' || (slowMoCharges <= 0 && !slowMoActiveNow)}
                aria-label={
                  slowMoActiveNow
                    ? 'Slow-Mo active'
                    : slowMoCharges > 0
                      ? 'Activate Slow-Mo belt for 2 seconds (Space or E)'
                      : 'Slow-Mo power-up empty'
                }
                className={`bs-gloss-btn min-h-[48px] px-2.5 sm:px-4 rounded-2xl flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  slowMoActiveNow || slowMoCharges > 0
                    ? 'bs-btn-blue text-white cursor-pointer'
                    : 'bs-btn-locked text-white/80 opacity-85 cursor-not-allowed'
                }`}
              >
                {slowMoActiveNow ? (
                  <RadialTimerRing progress={slowMoProgress} />
                ) : (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-100 border-2 border-[#09123a] flex items-center justify-center shrink-0">
                    <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#1642bf]" strokeWidth={2.75} />
                  </span>
                )}
                <span className="bs-font-display text-xs sm:text-base tracking-wide bs-text-stroke">
                  Slow-Mo
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* START OVERLAY */}
        {phase === 'start' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-[#070d26]/60 backdrop-blur-xs">
            <div className="bs-panel rounded-3xl p-5 sm:p-6 max-w-xs w-full text-center flex flex-col items-center gap-3.5">
              <h2 className="bs-font-display bs-outline-num text-3xl leading-tight">
                Conveyor Sort Rush
              </h2>
              <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                Send each falling shape to its matching bin before it passes the end line! Sort in the gold zone for x2 Points.
              </p>

              {/* Endless Mode CTA */}
              <button
                type="button"
                onClick={() => startRun('endless')}
                className="bs-gloss-btn bs-btn-gold w-full min-h-[54px] px-4 rounded-2xl text-[#451a03] cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <InfinityIcon className="w-5 h-5 text-[#451a03]" />
                  <div className="text-left leading-tight">
                    <div className="bs-font-display text-lg">Endless</div>
                    <div className="text-[10px] font-bold opacity-85">3 Hearts • Rising Speed</div>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-[#451a03]/15 px-2.5 py-1 rounded-full tabular-nums">
                  Best: {endlessBest.toLocaleString()}
                </span>
              </button>

              {/* Daily Run CTA */}
              <button
                type="button"
                onClick={() => startRun('daily')}
                className="bs-gloss-btn bs-btn-blue w-full min-h-[54px] px-4 rounded-2xl text-white cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-100 shrink-0" />
                  <div className="text-left leading-tight">
                    <div className="bs-font-display text-lg bs-text-stroke">Daily Run</div>
                    <div className="text-[10px] font-semibold text-sky-100 flex items-center gap-1">
                      <span>60s Seeded</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 text-[#ffe36e] font-bold">
                        <Flame className="w-3 h-3 fill-[#ffe36e]" />
                        {dailyStreak}d
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold bg-[#08123a]/60 border border-sky-300/35 px-2.5 py-1 rounded-full tabular-nums">
                  Best: {dailyBest.toLocaleString()}
                </span>
              </button>

              <a
                href="#game-details"
                className="text-[11px] font-semibold text-sky-200/80 hover:text-white transition-colors pt-1"
              >
                How to Play &amp; Controls ↓
              </a>
            </div>
          </div>
        )}

        {/* PAUSE OVERLAY */}
        {phase === 'paused' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-[#070d26]/70 backdrop-blur-sm">
            <div className="bs-panel rounded-3xl p-6 max-w-xs w-full text-center flex flex-col gap-3">
              <h2 className="bs-font-display bs-outline-num text-3xl">Paused</h2>
              <button
                type="button"
                onClick={togglePause}
                className="bs-gloss-btn bs-btn-gold min-h-[48px] w-full rounded-2xl bs-font-display text-lg text-[#451a03] cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#451a03]" />
                <span>Resume</span>
              </button>
              <button
                type="button"
                onClick={() => startRun(mode)}
                className="bs-gloss-btn bs-btn-blue min-h-[48px] w-full rounded-2xl bs-font-display text-lg text-white bs-text-stroke cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </button>
              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                className="bs-gloss-btn bs-btn-locked min-h-[48px] w-full rounded-2xl bs-font-display text-base text-white bs-text-stroke cursor-pointer flex items-center justify-center gap-2"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>Sound: {isMuted ? 'Off' : 'On'}</span>
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {phase === 'gameover' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-[#070d26]/75 backdrop-blur-sm overflow-y-auto">
            <div className="bs-panel rounded-3xl p-5 sm:p-6 max-w-xs w-full text-center flex flex-col gap-3 my-auto">
              <div className="text-[11px] font-bold uppercase tracking-widest text-sky-300">
                {mode === 'daily' ? `Daily Run • ${dailyDateStr}` : 'Endless Run'}
              </div>
              <h2 className="bs-font-display bs-outline-num text-3xl leading-none">
                {mode === 'daily' && dailyRemainingSec <= 0 ? "Time's Up!" : 'Run Over!'}
              </h2>
              <div className="py-2 rounded-2xl bg-[#09102e]/80 border border-sky-400/30 relative">
                <div className="text-[11px] font-bold text-sky-200 uppercase">Score</div>
                <div className="bs-font-display bs-outline-num text-4xl tabular-nums">
                  {scoreDisplay.toLocaleString()}
                </div>
                {diamondsEarnedRun > 0 && (
                  <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-xs font-bold text-cyan-200">
                    <Gem className="w-3.5 h-3.5 text-cyan-300" />
                    <span>+{diamondsEarnedRun} Diamonds Earned</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-[#09102e]/70 border border-sky-400/20">
                  <div className="text-[10px] text-sky-200">Best Chain</div>
                  <div className="font-bold text-amber-300">x{bestChainRun}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#09102e]/70 border border-sky-400/20">
                  <div className="text-[10px] text-sky-200">Accuracy</div>
                  <div className="font-bold text-emerald-300">{accuracyRun}%</div>
                </div>
                <div className="p-2 rounded-xl bg-[#09102e]/70 border border-sky-400/20">
                  <div className="text-[10px] text-sky-200">
                    {mode === 'daily' ? 'Today Best' : 'Best'}
                  </div>
                  <div className="font-bold text-white tabular-nums">
                    {(mode === 'daily' ? dailyBest : endlessBest).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Daily Share Card */}
              {mode === 'daily' && (
                <div className="p-3 rounded-2xl bg-[#09102e]/90 border border-sky-400/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-sky-200">Daily Sort Grid</span>
                    <span className="text-amber-300 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      {dailyStreak} Day Streak
                    </span>
                  </div>
                  <pre className="text-xs leading-snug tracking-wider font-mono whitespace-pre-wrap break-all select-all text-center max-h-24 overflow-y-auto">
                    {shareGrid || '⬛'}
                  </pre>

                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                        try {
                          await navigator.clipboard.writeText(shareText);
                          setCopyState('copied');
                          setTimeout(() => setCopyState('idle'), 2200);
                          return;
                        } catch {
                          // Fall back to visible selectable textarea
                        }
                      }
                      setCopyState('fallback');
                      setTimeout(() => {
                        shareTextareaRef.current?.focus();
                        shareTextareaRef.current?.select();
                      }, 40);
                    }}
                    className="bs-gloss-btn bs-btn-blue min-h-[48px] w-full rounded-xl bs-font-display text-sm text-white bs-text-stroke cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copyState === 'copied' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Copied Result!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Share Daily Result</span>
                      </>
                    )}
                  </button>

                  {copyState === 'fallback' && (
                    <div className="text-left space-y-1">
                      <div className="text-[10px] text-amber-200">
                        Clipboard blocked — text selected below to copy manually:
                      </div>
                      <textarea
                        ref={shareTextareaRef}
                        readOnly
                        value={shareText}
                        onClick={(e) => e.currentTarget.select()}
                        rows={4}
                        className="w-full rounded-lg bg-[#05091d] border border-sky-400/40 p-2 text-[10px] text-white font-mono focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => startRun(mode)}
                  className="bs-gloss-btn bs-btn-gold min-h-[48px] flex-1 rounded-2xl bs-font-display text-lg text-[#451a03] cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    engineRef.current.phase = 'start';
                    setPhase('start');
                  }}
                  className="bs-gloss-btn bs-btn-blue min-h-[48px] px-3.5 rounded-2xl bs-font-display text-sm text-white bs-text-stroke cursor-pointer"
                >
                  Modes
                </button>
              </div>

              {/* Try another game row linking to 2 TAPPYARD games */}
              <div className="pt-2 border-t border-sky-400/25">
                <div className="text-[10px] font-bold text-sky-200 uppercase tracking-wider mb-1.5">
                  Try Another Game
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {GAMES_CATALOGUE.filter((g) => g.id !== BELT_SORT_CONFIG.GAME_SLUG)
                    .slice(0, 2)
                    .map((g) => (
                      <Link
                        key={g.id}
                        href={g.route}
                        className="flex items-center gap-2 p-1.5 rounded-xl bg-[#09102e]/85 border border-sky-400/30 hover:border-[#ffe36e] transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                          <GameThumbnail id={g.thumbnail} title={g.title} variant="avatar" />
                        </div>
                        <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                          {g.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}
