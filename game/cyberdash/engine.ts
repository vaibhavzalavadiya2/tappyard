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
