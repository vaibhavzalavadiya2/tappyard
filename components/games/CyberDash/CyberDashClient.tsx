'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Gem,
  Zap,
  Shield,
  Share2,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  LaserGate,
  Particle,
  FloatingText,
  getThemeForScore,
} from '@/game/cyberdash/engine';
import { cyberDashAudio } from '@/game/cyberdash/audio';
import {
  addWalletDiamonds,
  spendWalletDiamonds,
  subscribeWallet,
} from '@/lib/wallet';

const REVIVE_COST = 5;

export default function CyberDashClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React State for HUD & Modals
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [hasRevived, setHasRevived] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [floatingNotice, setFloatingNotice] = useState<string | null>(null);

  // Engine Refs (runs independently of React renders for 60fps buttery smoothness)
  const engineRef = useRef({
    player: {
      x: 100,
      y: 250,
      radius: 14,
      vy: 0,
      angle: 0,
      shieldTime: 0,
    },
    gates: [] as LaserGate[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    stars: [] as { x: number; y: number; size: number; speed: number; alpha: number }[],
    speed: 220,
    nextGateX: 400,
    gateIdCounter: 1,
    textIdCounter: 1,
    score: 0,
    bestScore: 0,
    streak: 0,
    screenShake: 0,
    lastTime: 0,
    animFrameId: 0,
  });

  // Sync state & load best score
  useEffect(() => {
    const saved = localStorage.getItem('tappyard-cyberdash-best');
    if (saved) {
      const val = parseInt(saved, 10) || 0;
      setBestScore(val);
      engineRef.current.bestScore = val;
    }

    setIsMuted(cyberDashAudio.getMuted());
    const unsub = subscribeWallet((d) => setDiamonds(d));

    return () => unsub();
  }, []);

  const showNotice = useCallback((msg: string) => {
    setFloatingNotice(msg);
    setTimeout(() => setFloatingNotice(null), 1600);
  }, []);

  // Flap / Boost impulse
  const handleFlap = useCallback(() => {
    if (gameState === 'idle') {
      setGameState('playing');
      setHasRevived(false);
      engineRef.current.player.vy = -380;
      cyberDashAudio.flap();
      return;
    }

    if (gameState === 'playing') {
      const eng = engineRef.current;
      eng.player.vy = -410;
      cyberDashAudio.flap();

      // Emit burst particles from engine
      for (let i = 0; i < 6; i++) {
        eng.particles.push({
          x: eng.player.x - 12,
          y: eng.player.y + (Math.random() - 0.5) * 8,
          vx: -(Math.random() * 120 + 60),
          vy: (Math.random() - 0.5) * 80,
          size: Math.random() * 3 + 2,
          color: '#00f0ff',
          alpha: 0.9,
          decay: 0.035,
        });
      }
    }
  }, [gameState]);

  // Restart run
  const handleRestart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const eng = engineRef.current;
    eng.player.x = canvas.width * 0.24;
    eng.player.y = canvas.height * 0.5;
    eng.player.vy = 0;
    eng.player.angle = 0;
    eng.player.shieldTime = 0;
    eng.gates = [];
    eng.particles = [];
    eng.floatingTexts = [];
    eng.speed = 220;
    eng.nextGateX = canvas.width + 120;
    eng.score = 0;
    eng.streak = 0;
    eng.screenShake = 0;

    setScore(0);
    setStreak(0);
    setHasRevived(false);
    setGameState('idle');
  }, []);

  // Revive run with diamonds
  const handleRevive = useCallback(() => {
    if (hasRevived || diamonds < REVIVE_COST) {
      showNotice(`Need ${REVIVE_COST} 💎 Diamonds to Revive!`);
      return;
    }

    const success = spendWalletDiamonds(REVIVE_COST);
    if (!success) return;

    setHasRevived(true);
    cyberDashAudio.revive();

    const canvas = canvasRef.current;
    const eng = engineRef.current;
    if (canvas) {
      eng.player.y = canvas.height * 0.5;
      eng.player.vy = -180;
    }
    eng.player.shieldTime = 2.2; // 2.2 seconds invulnerability
    eng.screenShake = 12;

    // Clear gates dangerously close to player
    eng.gates = eng.gates.filter((g) => g.x > eng.player.x + 140 || g.x + g.width < eng.player.x - 40);

    setGameState('playing');
    showNotice(`-${REVIVE_COST} 💎 Revived with Shield!`);
  }, [hasRevived, diamonds, showNotice]);

  // Mute toggle
  const handleToggleMute = useCallback(() => {
    const next = cyberDashAudio.toggleMute();
    setIsMuted(next);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Share score
  const handleShare = useCallback(() => {
    const text = `⚡ I scored ${score} in Cyber Dash on TapYard! Can you beat my high score? Play free: https://tappyard.com/games/quick-tap`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'Cyber Dash | TapYard', text, url: 'https://tappyard.com/games/quick-tap' }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showNotice('Challenge link copied to clipboard!');
      }).catch(() => {
        showNotice('Link: tappyard.com/games/quick-tap');
      });
    } else {
      showNotice('Link: tappyard.com/games/quick-tap');
    }
  }, [score, showNotice]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        handleFlap();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFlap]);

  // 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full viewport
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Populate background stars
      if (engineRef.current.stars.length === 0) {
        for (let i = 0; i < 45; i++) {
          engineRef.current.stars.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 30 + 15,
            alpha: Math.random() * 0.6 + 0.2,
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial positioning
    const rect = canvas.getBoundingClientRect();
    const eng = engineRef.current;
    eng.player.x = rect.width * 0.24;
    eng.player.y = rect.height * 0.5;
    eng.nextGateX = rect.width + 120;
    eng.lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - eng.lastTime) / 1000, 0.05); // Cap delta to prevent huge jumps
      eng.lastTime = now;

      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      // 1. UPDATE PHYSICS (if playing)
      if (gameState === 'playing') {
        const theme = getThemeForScore(eng.score);

        // Player Gravity
        eng.player.vy += 1320 * dt;
        eng.player.y += eng.player.vy * dt;

        // Player Tilt
        const targetAngle = Math.max(-0.45, Math.min(1.1, eng.player.vy * 0.002));
        eng.player.angle += (targetAngle - eng.player.angle) * 12 * dt;

        // Shield countdown
        if (eng.player.shieldTime > 0) {
          eng.player.shieldTime -= dt;
        }

        // Speed ramp
        eng.speed = Math.min(340, 220 + eng.score * 2.5);

        // Emit trail particles
        if (Math.random() < 0.85) {
          eng.particles.push({
            x: eng.player.x - 10,
            y: eng.player.y,
            vx: -(eng.speed * 0.4 + Math.random() * 40),
            vy: (Math.random() - 0.5) * 35,
            size: Math.random() * 3 + 2,
            color: theme.primary,
            alpha: 0.8,
            decay: 0.03,
          });
        }

        // Spawn Laser Gates
        if (eng.gates.length === 0 || eng.gates[eng.gates.length - 1].x < w - 210) {
          const gapHeight = Math.max(140, 168 - eng.score * 0.6);
          const margin = 70;
          const gapY = margin + gapHeight * 0.5 + Math.random() * (h - margin * 2 - gapHeight);
          const gateW = 50;

          eng.gates.push({
            id: eng.gateIdCounter++,
            x: w + 40,
            width: gateW,
            topHeight: gapY - gapHeight * 0.5,
            bottomY: gapY + gapHeight * 0.5,
            gapY,
            gapHeight,
            passed: false,
            grazed: false,
          });
        }

        // Move Gates & Check Collisions
        for (let i = eng.gates.length - 1; i >= 0; i--) {
          const gate = eng.gates[i];
          gate.x -= eng.speed * dt;

          const p = eng.player;

          // Check Near-Miss Graze
          if (
            !gate.grazed &&
            p.x + p.radius > gate.x &&
            p.x - p.radius < gate.x + gate.width
          ) {
            const distToTop = Math.abs(p.y - gate.topHeight);
            const distToBottom = Math.abs(p.y - gate.bottomY);
            const minEdgeDist = Math.min(distToTop, distToBottom);

            // Graze window: close to laser beam (15px to 28px)
            if (minEdgeDist < 26 && minEdgeDist > p.radius) {
              gate.grazed = true;
              cyberDashAudio.graze();
              addWalletDiamonds(1);
              eng.screenShake = 6;

              eng.floatingTexts.push({
                id: eng.textIdCounter++,
                x: p.x + 20,
                y: p.y - 15,
                text: 'GRAZE! +1 💎',
                color: '#f59e0b',
                alpha: 1,
                vy: -55,
                scale: 1.2,
              });
            }
          }

          // Check Gate Clearance (Score + 1)
          if (!gate.passed && gate.x + gate.width < p.x - p.radius) {
            gate.passed = true;
            eng.score++;
            eng.streak++;
            setScore(eng.score);
            setStreak(eng.streak);

            // Update best
            if (eng.score > eng.bestScore) {
              eng.bestScore = eng.score;
              setBestScore(eng.score);
              localStorage.setItem('tappyard-cyberdash-best', String(eng.score));
            }

            // Milestone Diamond Rewards
            if (eng.score % 10 === 0) {
              addWalletDiamonds(3);
              eng.floatingTexts.push({
                id: eng.textIdCounter++,
                x: p.x + 25,
                y: p.y - 25,
                text: '+3 💎 MILESTONE!',
                color: '#00f0ff',
                alpha: 1,
                vy: -60,
                scale: 1.3,
              });
            } else if (eng.score % 5 === 0) {
              addWalletDiamonds(1);
            }

            cyberDashAudio.score(eng.streak);
          }

          // Check Collision with Pillars (if shield not active)
          if (p.shieldTime <= 0) {
            // Check top pillar
            const inGateX = p.x + p.radius > gate.x + 4 && p.x - p.radius < gate.x + gate.width - 4;
            const hitTop = inGateX && p.y - p.radius < gate.topHeight;
            const hitBottom = inGateX && p.y + p.radius > gate.bottomY;

            if (hitTop || hitBottom) {
              cyberDashAudio.crash();
              eng.screenShake = 16;
              setGameState('gameover');
            }
          }

          // Remove offscreen gates
          if (gate.x + gate.width < -50) {
            eng.gates.splice(i, 1);
          }
        }

        // Boundary collision (floor & ceiling)
        if (eng.player.y + eng.player.radius > h - 12) {
          eng.player.y = h - 12 - eng.player.radius;
          if (eng.player.shieldTime <= 0) {
            cyberDashAudio.crash();
            eng.screenShake = 16;
            setGameState('gameover');
          }
        }
        if (eng.player.y - eng.player.radius < 12) {
          eng.player.y = 12 + eng.player.radius;
          eng.player.vy = 0;
        }
      }

      // Update Particles
      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const pt = eng.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= pt.decay;
        if (pt.alpha <= 0) {
          eng.particles.splice(i, 1);
        }
      }

      // Update Floating Texts
      for (let i = eng.floatingTexts.length - 1; i >= 0; i--) {
        const ft = eng.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.alpha -= 0.025;
        if (ft.alpha <= 0) {
          eng.floatingTexts.splice(i, 1);
        }
      }

      // Update Background Stars
      eng.stars.forEach((s) => {
        s.x -= s.speed * (gameState === 'playing' ? dt * 1.5 : dt * 0.5);
        if (s.x < 0) s.x = w;
      });

      // Camera Shake decay
      if (eng.screenShake > 0) {
        eng.screenShake *= 0.88;
        if (eng.screenShake < 0.5) eng.screenShake = 0;
      }

      // 2. RENDER CANVAS
      const theme = getThemeForScore(eng.score);

      ctx.save();

      // Apply screen shake
      if (eng.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * eng.screenShake;
        const shakeY = (Math.random() - 0.5) * eng.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // Clear & Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, theme.bgGradTop);
      bgGrad.addColorStop(1, theme.bgGradBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Render Stars
      ctx.fillStyle = '#ffffff';
      eng.stars.forEach((s) => {
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Render Laser Gates
      eng.gates.forEach((gate) => {
        // Top Pillar
        const gradTop = ctx.createLinearGradient(gate.x, 0, gate.x + gate.width, 0);
        gradTop.addColorStop(0, '#0c2230');
        gradTop.addColorStop(0.5, '#173c52');
        gradTop.addColorStop(1, '#0c2230');
        ctx.fillStyle = gradTop;
        ctx.fillRect(gate.x, 0, gate.width, gate.topHeight);

        // Top Pillar Border & Glowing Cap
        ctx.strokeStyle = theme.gateColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(gate.x, 0, gate.width, gate.topHeight);

        ctx.fillStyle = theme.gateColor;
        ctx.shadowColor = theme.gateColor;
        ctx.shadowBlur = 15;
        ctx.fillRect(gate.x - 3, gate.topHeight - 8, gate.width + 6, 8);

        // Bottom Pillar
        const gradBottom = ctx.createLinearGradient(gate.x, 0, gate.x + gate.width, 0);
        gradBottom.addColorStop(0, '#0c2230');
        gradBottom.addColorStop(0.5, '#173c52');
        gradBottom.addColorStop(1, '#0c2230');
        ctx.fillStyle = gradBottom;
        ctx.fillRect(gate.x, gate.bottomY, gate.width, h - gate.bottomY);

        ctx.strokeStyle = theme.gateColor;
        ctx.strokeRect(gate.x, gate.bottomY, gate.width, h - gate.bottomY);

        ctx.fillStyle = theme.gateColor;
        ctx.fillRect(gate.x - 3, gate.bottomY, gate.width + 6, 8);
        ctx.shadowBlur = 0; // Reset shadow
      });

      // Render Particles
      eng.particles.forEach((pt) => {
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Render Player Ship / Orb
      const p = eng.player;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Invulnerability Shield Aura
      if (p.shieldTime > 0) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Outer Glow
      ctx.shadowColor = theme.primary;
      ctx.shadowBlur = 14;

      // Ship Body (Triangle dart shape)
      ctx.fillStyle = theme.primary;
      ctx.beginPath();
      ctx.moveTo(p.radius + 6, 0);
      ctx.lineTo(-p.radius, -p.radius * 0.9);
      ctx.lineTo(-p.radius * 0.4, 0);
      ctx.lineTo(-p.radius, p.radius * 0.9);
      ctx.closePath();
      ctx.fill();

      // Ship Cockpit Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.radius * 0.2, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Render Floating Texts
      eng.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = `bold ${Math.floor(14 * ft.scale)}px sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();

      eng.animFrameId = requestAnimationFrame(loop);
    };

    eng.animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(eng.animFrameId);
  }, [gameState]);

  return (
    <div
      className="fixed inset-0 flex flex-col bg-[#040e14] text-white select-none overflow-hidden safe-bottom"
      style={{ touchAction: 'none' }}
      onClick={handleFlap}
    >
      {/* 1. Header Bar */}
      <header
        className="h-14 sm:h-16 px-3 sm:px-6 bg-[#081720]/95 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between shrink-0 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TapYard</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
              Cyber Dash
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Zap className="w-3 h-3" />
              Casual
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Diamonds Wallet */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1e27] border border-cyan-500/30 text-cyan-300 font-black text-xs shadow-inner">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{diamonds}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0e2531] hover:bg-[#153545] border border-cyan-500/20 flex items-center justify-center text-slate-300 transition-all active:scale-90 cursor-pointer"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[#0e2531] hover:bg-[#153545] border border-cyan-500/20 items-center justify-center text-slate-300 transition-all active:scale-90 cursor-pointer"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Floating Notification Banner */}
      {floatingNotice && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 text-xs font-black shadow-lg shadow-amber-500/30 animate-bounce-in border border-amber-300">
          {floatingNotice}
        </div>
      )}

      {/* In-Game Live Score HUD */}
      {gameState === 'playing' && (
        <div className="absolute top-18 inset-x-0 flex flex-col items-center pointer-events-none z-10">
          <div className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_16px_rgba(0,240,255,0.7)] animate-pulse">
            {score}
          </div>
          {streak > 2 && (
            <div className="mt-1 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>STREAK: {streak}</span>
            </div>
          )}
        </div>
      )}

      {/* 2. Main Full-Screen Canvas */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </main>

      {/* 3. Idle / Start Overlay */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs pointer-events-none">
          <div className="bg-gradient-to-b from-[#0f2c3a]/90 to-[#0a1b24]/90 rounded-3xl p-6 sm:p-8 max-w-xs w-full border border-cyan-500/40 shadow-2xl flex flex-col items-center text-center gap-4 animate-slide-up pointer-events-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
              <Zap className="w-8 h-8 text-cyan-300" />
            </div>

            <div>
              <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase">1-Tap Reflex Rush</span>
              <h2 className="text-2xl font-black text-white mt-0.5">Cyber Dash</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tap anywhere to flutter. Graze close to laser gates for <strong className="text-amber-300">bonus diamonds</strong>!
              </p>
            </div>

            {bestScore > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#081a24] border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>BEST: {bestScore}</span>
              </div>
            )}

            <button
              onClick={handleFlap}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-cyan-300/40"
            >
              <span>TAP TO FLY</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Game Over Overlay */}
      {gameState === 'gameover' && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-b from-[#0f2c3a] to-[#0a1b24] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-cyan-500/40 shadow-2xl flex flex-col items-center text-center gap-4 animate-slide-up">
            <span className="text-[11px] font-black tracking-widest text-rose-400 uppercase">System Crash</span>

            <div>
              <div className="text-5xl font-black text-white drop-shadow-md">
                {score}
              </div>
              <span className="text-xs text-cyan-400 font-bold block mt-1 uppercase tracking-wider">Gates Cleared</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-[#081720] px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>BEST SCORE: {bestScore}</span>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-1">
              {/* Revive with 5 Diamonds (Available once per run) */}
              {!hasRevived && diamonds >= REVIVE_COST && (
                <button
                  onClick={handleRevive}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 border border-yellow-200"
                >
                  <Shield className="w-4 h-4 text-amber-950" />
                  <span>REVIVE WITH SHIELD ({REVIVE_COST} 💎)</span>
                </button>
              )}

              {/* Try Again */}
              <button
                onClick={handleRestart}
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 border border-cyan-300/40"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>

              {/* Challenge a Friend Share */}
              <button
                onClick={handleShare}
                className="w-full h-10 rounded-2xl bg-[#091e28] hover:bg-[#0e2a38] text-slate-300 font-bold text-xs border border-slate-700/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>Challenge a Friend</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
