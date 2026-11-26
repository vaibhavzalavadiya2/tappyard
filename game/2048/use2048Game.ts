'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoardTile,
  Direction,
  canMakeMove,
  clearSaved2048State,
  createNewBoard,
  executeMove,
  loadSaved2048State,
  save2048State,
} from './logic';
import { useBoardDrag } from './useBoardDrag';
import { neon2048Audio } from './audio';
import { triggerHaptic } from '@/lib/haptics';
import {
  addWalletDiamonds,
  spendWalletDiamonds,
  subscribeWallet,
} from '@/lib/wallet';
import {
  getGameBestScore,
  incrementGamePlayCount,
  setGameBestScore,
} from '@/lib/highScores';
import { PROFILE_SYNCED_EVENT } from '@/lib/syncEvents';
import { shareScoreChallenge } from '@/lib/challenge';

export const UNDO_DIAMOND_COST = 5;

export interface HistoryEntry {
  tiles: BoardTile[];
  score: number;
}

export interface Use2048Options {
  gameSlug: 'cupcake-2048' | '2048-puzzle';
  gameTitle: string;
  storageKey: string;
  maxHistory: number;
  winDiamonds?: number;
  isExternalModalOpen?: boolean;
  onEscapeExternalModal?: () => void;
}

interface SyncStateSnapshot {
  tiles: BoardTile[];
  score: number;
  moves: number;
  history: HistoryEntry[];
  isGameOver: boolean;
  hasWon: boolean;
  keepPlaying: boolean;
  diamonds: number;
  confirmNewGameOpen: boolean;
}

/**
 * Shared 2048 controller managing synchronous state refs (prevents dropped/stale moves
 * under rapid PC mouse or keyboard input), localStorage board persistence, floating
 * score delta popups, diamond rewards/undo, and accidental New Game confirmation.
 */
export function use2048Game(options: Use2048Options) {
  const {
    gameSlug,
    gameTitle,
    storageKey,
    maxHistory,
    winDiamonds = 0,
    isExternalModalOpen = false,
    onEscapeExternalModal,
  } = options;

  const [tiles, setTiles] = useState<BoardTile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [floatingNotification, setFloatingNotification] = useState<string | null>(null);
  const [scorePop, setScorePop] = useState<{ key: number; delta: number } | null>(null);
  const [confirmNewGameOpen, setConfirmNewGameOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stateRef = useRef<SyncStateSnapshot>({
    tiles: [],
    score: 0,
    moves: 0,
    history: [],
    isGameOver: false,
    hasWon: false,
    keepPlaying: false,
    diamonds: 0,
    confirmNewGameOpen: false,
  });

  const externalModalRef = useRef(isExternalModalOpen);
  externalModalRef.current = isExternalModalOpen;
  const onEscapeExternalRef = useRef(onEscapeExternalModal);
  onEscapeExternalRef.current = onEscapeExternalModal;

  const notifTimerRef = useRef<number | null>(null);
  const scorePopTimerRef = useRef<number | null>(null);
  const scorePopSeqRef = useRef(1);

  const triggerNotification = useCallback((msg: string) => {
    setFloatingNotification(msg);
    if (notifTimerRef.current !== null) {
      window.clearTimeout(notifTimerRef.current);
    }
    notifTimerRef.current = window.setTimeout(() => {
      setFloatingNotification(null);
      notifTimerRef.current = null;
    }, 1800);
  }, []);

  const triggerScorePop = useCallback((delta: number) => {
    if (delta <= 0) return;
    setScorePop({ key: scorePopSeqRef.current++, delta });
    if (scorePopTimerRef.current !== null) {
      window.clearTimeout(scorePopTimerRef.current);
    }
    scorePopTimerRef.current = window.setTimeout(() => {
      setScorePop(null);
      scorePopTimerRef.current = null;
    }, 700);
  }, []);

  const syncPersist = useCallback(
    (snap: Pick<SyncStateSnapshot, 'tiles' | 'score' | 'moves' | 'history' | 'hasWon' | 'keepPlaying'>) => {
      save2048State(storageKey, {
        tiles: snap.tiles,
        score: snap.score,
        moves: snap.moves,
        history: snap.history,
        hasWon: snap.hasWon,
        keepPlaying: snap.keepPlaying,
      });
    },
    [storageKey]
  );

  // Initialize board (restoring in-progress run if available), wallet & best score
  useEffect(() => {
    const syncBest = () => setBestScore(getGameBestScore(gameSlug));
    syncBest();
    setIsMuted(neon2048Audio.getMuted());

    const unsub = subscribeWallet((d) => {
      stateRef.current.diamonds = d;
      setDiamonds(d);
    });
    window.addEventListener(PROFILE_SYNCED_EVENT, syncBest);

    const saved = loadSaved2048State(storageKey);
    const initialTiles = saved ? saved.tiles : createNewBoard();
    const initialScore = saved ? saved.score : 0;
    const initialMoves = saved ? saved.moves : 0;
    const initialHistory = saved ? saved.history.slice(-maxHistory) : [];
    const initialHasWon = saved ? saved.hasWon : false;
    const initialKeepPlaying = saved ? saved.keepPlaying : false;
    const initialGameOver = !canMakeMove(initialTiles);

    stateRef.current = {
      ...stateRef.current,
      tiles: initialTiles,
      score: initialScore,
      moves: initialMoves,
      history: initialHistory,
      hasWon: initialHasWon,
      keepPlaying: initialKeepPlaying,
      isGameOver: initialGameOver,
    };

    setTiles(initialTiles);
    setScore(initialScore);
    setMoves(initialMoves);
    setHistory(initialHistory);
    setHasWon(initialHasWon);
    setKeepPlaying(initialKeepPlaying);
    setIsGameOver(initialGameOver);

    return () => {
      unsub();
      window.removeEventListener(PROFILE_SYNCED_EVENT, syncBest);
      if (notifTimerRef.current !== null) window.clearTimeout(notifTimerRef.current);
      if (scorePopTimerRef.current !== null) window.clearTimeout(scorePopTimerRef.current);
    };
  }, [gameSlug, maxHistory, storageKey]);

  const handleMove = useCallback(
    (direction: Direction) => {
      const snap = stateRef.current;
      if (
        snap.isGameOver ||
        (snap.hasWon && !snap.keepPlaying) ||
        snap.confirmNewGameOpen ||
        externalModalRef.current
      ) {
        return;
      }

      const prevTiles = snap.tiles.map((t) => ({ ...t }));
      const prevScore = snap.score;
      const result = executeMove(direction, snap.tiles, snap.score);
      if (!result.moved) return;

      if (result.mergeCount > 0) {
        neon2048Audio.merge(result.highestMerged);
        triggerHaptic(result.highestMerged >= 64 ? 'medium' : 'light');
      } else {
        neon2048Audio.slide();
        triggerHaptic('light');
      }

      const nextHistory = [
        ...snap.history.slice(-(maxHistory - 1)),
        { tiles: prevTiles, score: prevScore },
      ];
      const nextMoves = snap.moves + 1;
      const reached2048 = result.tiles.some((t) => t.value >= 2048);
      const nextHasWon = snap.hasWon || (reached2048 && !snap.keepPlaying);
      const wonJustNow = reached2048 && !snap.hasWon && !snap.keepPlaying;
      const nextGameOver = !wonJustNow && !canMakeMove(result.tiles);

      stateRef.current = {
        ...snap,
        tiles: result.tiles,
        score: result.score,
        moves: nextMoves,
        history: nextHistory,
        hasWon: nextHasWon,
        isGameOver: nextGameOver,
      };

      setTiles(result.tiles);
      setScore(result.score);
      setMoves(nextMoves);
      setHistory(nextHistory);
      triggerScorePop(result.scoreDelta);

      setBestScore((prev) => {
        if (result.score > prev) {
          return setGameBestScore(gameSlug, result.score);
        }
        return prev;
      });

      syncPersist(stateRef.current);

      if (result.diamondReward > 0) {
        addWalletDiamonds(result.diamondReward);
        triggerNotification(`+${result.diamondReward} 💎 Diamond Bonus!`);
      }

      if (wonJustNow) {
        if (winDiamonds > 0) {
          addWalletDiamonds(winDiamonds);
        }
        setHasWon(true);
        neon2048Audio.win();
        triggerHaptic('success');
        return;
      }

      if (nextGameOver) {
        setIsGameOver(true);
        incrementGamePlayCount(gameSlug);
        neon2048Audio.gameOver();
        triggerHaptic('warning');
      }
    },
    [gameSlug, maxHistory, syncPersist, triggerNotification, triggerScorePop, winDiamonds]
  );

  const handleUndo = useCallback(() => {
    const snap = stateRef.current;
    if (snap.history.length === 0) return;

    if (snap.diamonds < UNDO_DIAMOND_COST) {
      triggerNotification(`Need ${UNDO_DIAMOND_COST} 💎 Diamonds to Undo!`);
      return;
    }

    const spent = spendWalletDiamonds(UNDO_DIAMOND_COST);
    if (!spent) return;

    neon2048Audio.undo();
    triggerHaptic('light');
    const last = snap.history[snap.history.length - 1];
    const remainingHistory = snap.history.slice(0, -1);
    const nextMoves = Math.max(0, snap.moves - 1);

    stateRef.current = {
      ...snap,
      tiles: last.tiles,
      score: last.score,
      moves: nextMoves,
      history: remainingHistory,
      isGameOver: false,
    };

    setTiles(last.tiles);
    setScore(last.score);
    setMoves(nextMoves);
    setHistory(remainingHistory);
    setIsGameOver(false);
    setScorePop(null);
    syncPersist(stateRef.current);
    triggerNotification(`-${UNDO_DIAMOND_COST} 💎 Move Undone!`);
  }, [syncPersist, triggerNotification]);

  const performRestart = useCallback(() => {
    const initialTiles = createNewBoard();
    clearSaved2048State(storageKey);

    stateRef.current = {
      ...stateRef.current,
      tiles: initialTiles,
      score: 0,
      moves: 0,
      history: [],
      isGameOver: false,
      hasWon: false,
      keepPlaying: false,
      confirmNewGameOpen: false,
    };

    setTiles(initialTiles);
    setScore(0);
    setMoves(0);
    setHistory([]);
    setIsGameOver(false);
    setHasWon(false);
    setKeepPlaying(false);
    setConfirmNewGameOpen(false);
    setScorePop(null);
    neon2048Audio.slide();
  }, [storageKey]);

  const requestRestart = useCallback(() => {
    const snap = stateRef.current;
    if (snap.moves > 0 && !snap.isGameOver) {
      snap.confirmNewGameOpen = true;
      setConfirmNewGameOpen(true);
      return;
    }
    performRestart();
  }, [performRestart]);

  const cancelRestart = useCallback(() => {
    stateRef.current.confirmNewGameOpen = false;
    setConfirmNewGameOpen(false);
  }, []);

  const handleKeepPlaying = useCallback(() => {
    stateRef.current.keepPlaying = true;
    setKeepPlaying(true);
    syncPersist(stateRef.current);
  }, [syncPersist]);

  const handleToggleMute = useCallback(() => {
    setIsMuted(neon2048Audio.toggleMute());
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  const handleShare = useCallback(() => {
    shareScoreChallenge({
      gameTitle,
      gameSlug,
      score: stateRef.current.score,
      metric: 'pts',
    });
  }, [gameSlug, gameTitle]);

  // Unified keyboard handler (single stable subscription reading live stateRef)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (stateRef.current.confirmNewGameOpen) {
          cancelRestart();
          return;
        }
        if (externalModalRef.current && onEscapeExternalRef.current) {
          onEscapeExternalRef.current();
          return;
        }
      }

      if (stateRef.current.confirmNewGameOpen || externalModalRef.current) {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove('right');
          break;
        case 'z':
        case 'Z':
        case 'u':
        case 'U':
          if (!e.repeat) handleUndo();
          break;
        case 'r':
        case 'R':
          if (!e.repeat) requestRestart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelRestart, handleMove, handleUndo, requestRestart]);

  const boardDragHandlers = useBoardDrag(handleMove);

  return {
    tiles,
    score,
    bestScore,
    moves,
    history,
    isGameOver,
    hasWon,
    keepPlaying,
    isMuted,
    diamonds,
    floatingNotification,
    scorePop,
    confirmNewGameOpen,
    isFullscreen,
    boardDragHandlers,
    handleMove,
    handleUndo,
    handleRestart: performRestart,
    requestRestart,
    cancelRestart,
    handleKeepPlaying,
    handleToggleMute,
    toggleFullscreen,
    handleShare,
  };
}
