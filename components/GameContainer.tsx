'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { eventBridge, type GameEvent } from '@/game/events';
import {
  loadProgress,
  selectSkin,
  unlockSkinWithDiamonds,
  type GameProgress,
} from '@/game/progress';
import { audioManager } from '@/game/audio';
import MainMenu from './MainMenu';
import GameHUD from './GameHUD';
import PauseOverlay from './PauseOverlay';
import GameOverOverlay from './GameOverOverlay';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

export default function GameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const [gameState, setGameState] = useState<GameState>('menu');
  const [distance, setDistance] = useState(0);
  const [bestDistance, setBestDistance] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isBoosting, setIsBoosting] = useState(false);
  const [theme, setTheme] = useState('Teal Canyon');
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [openShopOnMenu, setOpenShopOnMenu] = useState(false);

  // Load progress on mount
  useEffect(() => {
    const p = loadProgress();
    setBestDistance(p.bestDistance);
    setTotalDiamonds(p.totalDiamonds);
    setIsMuted(p.soundMuted);
    audioManager.setMuted(p.soundMuted);
    setProgress(p);
  }, []);

  // Initialize Phaser
  useEffect(() => {
    if (!containerRef.current) return;

    let game: Phaser.Game;
    let destroyed = false;

    import('@/game/index').then(({ createGame }) => {
      if (destroyed || !containerRef.current) return;
      game = createGame(containerRef.current);
      gameRef.current = game;
    });

    return () => {
      destroyed = true;
      if (game) {
        game.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Listen to game events
  useEffect(() => {
    const unsub = eventBridge.onGameEvent((event: GameEvent) => {
      switch (event.type) {
        case 'ready':
          setGameState('menu');
          break;
        case 'gameStart':
          setGameState('playing');
          setDistance(0);
          setDiamonds(0);
          setStreak(0);
          setIsBoosting(false);
          break;
        case 'score':
          setDistance(event.distance);
          setDiamonds(event.diamonds);
          setStreak(event.streak);
          setTheme(event.theme);
          setIsBoosting(event.isBoosting);
          break;
        case 'diamond':
          setTotalDiamonds(event.totalDiamonds);
          break;
        case 'pause':
          setGameState('paused');
          break;
        case 'resume':
          setGameState('playing');
          break;
        case 'gameOver':
          setGameState('gameOver');
          setDistance(event.distance);
          setBestDistance(event.bestDistance);
          setTotalDiamonds(event.totalDiamonds);
          setIsNewRecord(event.isNewRecord);
          setProgress(loadProgress());
          break;
      }
    });

    return unsub;
  }, []);

  const handlePlay = useCallback(() => {
    audioManager.init();
    setOpenShopOnMenu(false);
    eventBridge.emitUICommand({ type: 'restartGame' });
    setTimeout(() => {
      eventBridge.emitUICommand({ type: 'startGame' });
    }, 50);
  }, []);

  const handleRetry = useCallback(() => {
    eventBridge.emitUICommand({ type: 'restartGame' });
    setTimeout(() => {
      eventBridge.emitUICommand({ type: 'startGame' });
    }, 80);
  }, []);

  const handlePause = useCallback(() => {
    eventBridge.emitUICommand({ type: 'pauseGame' });
  }, []);

  const handleResume = useCallback(() => {
    eventBridge.emitUICommand({ type: 'resumeGame' });
  }, []);

  const handleToggleMute = useCallback(() => {
    const newMuted = audioManager.toggleMute();
    setIsMuted(newMuted);
    const p = loadProgress();
    p.soundMuted = newMuted;
    localStorage.setItem('jelly-jump-progress', JSON.stringify(p));
  }, []);

  const handleSelectSkin = useCallback((skinId: string) => {
    const updated = selectSkin(skinId);
    setProgress(updated);
    eventBridge.emitUICommand({ type: 'selectSkin', skinId });
  }, []);

  const handleUnlockSkin = useCallback((skinId: string) => {
    const result = unlockSkinWithDiamonds(skinId);
    if (result.success) {
      eventBridge.emitUICommand({ type: 'selectSkin', skinId });
      setProgress(result.progress);
      setTotalDiamonds(result.progress.totalDiamonds);
    }
  }, []);

  const handleOpenShopFromGameOver = useCallback(() => {
    setOpenShopOnMenu(true);
    setGameState('menu');
    eventBridge.emitUICommand({ type: 'restartGame' });
  }, []);

  const handleCloseShop = useCallback(() => {
    setOpenShopOnMenu(false);
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-[#081720]"
      style={{ touchAction: 'none' }}
    >
      {/* Phaser Canvas container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ touchAction: 'none' }}
      />

      {/* UI Overlays */}
      {gameState === 'menu' && (
        <MainMenu
          bestScore={bestDistance}
          isMuted={isMuted}
          onPlay={handlePlay}
          onToggleMute={handleToggleMute}
          progress={progress}
          onSelectSkin={handleSelectSkin}
          onUnlockSkin={handleUnlockSkin}
          initialShowSkins={openShopOnMenu}
          onCloseSkins={handleCloseShop}
        />
      )}

      {gameState === 'playing' && (
        <GameHUD
          distance={distance}
          bestDistance={bestDistance}
          diamonds={diamonds}
          totalDiamonds={totalDiamonds}
          streak={streak}
          isBoosting={isBoosting}
          theme={theme}
          onPause={handlePause}
        />
      )}

      {gameState === 'paused' && (
        <PauseOverlay
          distance={distance}
          onResume={handleResume}
          onRestart={handleRetry}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {gameState === 'gameOver' && (
        <GameOverOverlay
          distance={distance}
          bestDistance={bestDistance}
          diamondsCollected={diamonds}
          totalDiamonds={totalDiamonds}
          streak={streak}
          isNewRecord={isNewRecord}
          isMuted={isMuted}
          selectedSkin={progress?.selectedSkin}
          onRetry={handleRetry}
          onOpenShop={handleOpenShopFromGameOver}
          onToggleMute={handleToggleMute}
        />
      )}
    </div>
  );
}
