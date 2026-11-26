// Cyber Dash Physics Engine & Particle Renderer
// Ultra-responsive 60fps HTML5 Canvas implementation

export interface LaserGate {
  id: number;
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
  grazed: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  scale: number;
}

export interface CyberTheme {
  name: string;
  primary: string;
  secondary: string;
  bgGradTop: string;
  bgGradBottom: string;
  gateColor: string;
}

export const CYBER_THEMES: CyberTheme[] = [
  {
    name: 'Electric Cyan',
    primary: '#00f0ff',
    secondary: '#3b82f6',
    bgGradTop: '#040d14',
    bgGradBottom: '#081d2a',
    gateColor: '#00f0ff',
  },
  {
    name: 'Cyber Magenta',
    primary: '#ec4899',
    secondary: '#a855f7',
    bgGradTop: '#140410',
    bgGradBottom: '#2a0822',
    gateColor: '#ec4899',
  },
  {
    name: 'Solar Amber',
    primary: '#f59e0b',
    secondary: '#ef4444',
    bgGradTop: '#140c04',
    bgGradBottom: '#2a1a08',
    gateColor: '#f59e0b',
  },
  {
    name: 'Matrix Emerald',
    primary: '#10b981',
    secondary: '#06b6d4',
    bgGradTop: '#04140c',
    bgGradBottom: '#082a1a',
    gateColor: '#10b981',
  },
];

export function getThemeForScore(score: number): CyberTheme {
  if (score >= 50) return CYBER_THEMES[3];
  if (score >= 25) return CYBER_THEMES[2];
  if (score >= 10) return CYBER_THEMES[1];
  return CYBER_THEMES[0];
}

export const CYBER_DASH_TUNING = {
  baseSpeed: 210,
  maxSpeed: 330,
  speedPerGate: 2.2,
  launchFlapVy: -360,
  flapVy: -375,
  launchGravity: 780,
  gravity: 1140,
  maxFallSpeed: 540,
  launchDurationSec: 1.4,
  hitboxInsetPx: 3,
  gateWidth: 50,
  startGapHeight: 198,
  minGapHeight: 152,
  gapShrinkPerGate: 0.65,
  desktopStartSpacingPx: 350,
  mobileStartSpacingPx: 300,
  minSpacingPx: 255,
  spacingShrinkPerGate: 1.4,
} as const;

export function getGateHorizontalSpacing(viewportWidth: number, score: number): number {
  const startSpacing =
    viewportWidth >= 768
      ? CYBER_DASH_TUNING.desktopStartSpacingPx
      : CYBER_DASH_TUNING.mobileStartSpacingPx;
  return Math.max(
    CYBER_DASH_TUNING.minSpacingPx,
    startSpacing - score * CYBER_DASH_TUNING.spacingShrinkPerGate
  );
}

/**
 * Generates the next laser gate with bounded consecutive gap vertical delta so
 * openings stay physically reachable across both narrow phones and tall desktop monitors.
 */
export function createNextLaserGate(
  id: number,
  viewportWidth: number,
  viewportHeight: number,
  score: number,
  lastGate?: LaserGate
): LaserGate {
  const gapHeight = Math.max(
    CYBER_DASH_TUNING.minGapHeight,
    CYBER_DASH_TUNING.startGapHeight - score * CYBER_DASH_TUNING.gapShrinkPerGate
  );
  const margin = Math.max(76, Math.min(110, viewportHeight * 0.12));
  const minGapY = margin + gapHeight * 0.5;
  const maxGapY = Math.max(minGapY + 20, viewportHeight - margin - gapHeight * 0.5);

  let gapY: number;
  if (!lastGate) {
    const centerSpread = Math.min(90, (maxGapY - minGapY) * 0.3);
    gapY = viewportHeight * 0.5 + (Math.random() - 0.5) * 2 * centerSpread;
  } else {
    const maxStepY = Math.min(
      Math.max(150, viewportHeight * 0.28),
      180 + Math.min(70, score * 1.5)
    );
    const low = Math.max(minGapY, lastGate.gapY - maxStepY);
    const high = Math.min(maxGapY, lastGate.gapY + maxStepY);
    gapY = low + Math.random() * (high - low);
  }

  gapY = Math.max(minGapY, Math.min(maxGapY, gapY));
  const gateW = CYBER_DASH_TUNING.gateWidth;

  return {
    id,
    x: viewportWidth + 40,
    width: gateW,
    topHeight: gapY - gapHeight * 0.5,
    bottomY: gapY + gapHeight * 0.5,
    gapY,
    gapHeight,
    passed: false,
    grazed: false,
  };
}
