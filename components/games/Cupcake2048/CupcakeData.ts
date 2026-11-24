import React from 'react';

export interface CupcakeTier {
  value: number;
  name: string;
  subtitle: string;
  bgGradient: string;
  borderColor: string;
  glow: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
}

export const CUPCAKE_TIERS: Record<number, CupcakeTier> = {
  2: {
    value: 2,
    name: 'Vanilla Joy',
    subtitle: 'Classic Birthday',
    bgGradient: 'from-amber-100 via-amber-50 to-orange-100',
    borderColor: 'border-amber-300',
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.25)]',
    textColor: 'text-amber-900',
    badgeBg: 'bg-amber-200/80',
    badgeText: 'text-amber-900',
  },
  4: {
    value: 4,
    name: 'Bubblegum',
    subtitle: 'Pink Strawberry',
    bgGradient: 'from-pink-100 via-rose-50 to-pink-200',
    borderColor: 'border-pink-300',
    glow: 'shadow-[0_0_15px_rgba(244,114,182,0.3)]',
    textColor: 'text-pink-900',
    badgeBg: 'bg-pink-200/80',
    badgeText: 'text-pink-900',
  },
  8: {
    value: 8,
    name: 'Choco Sundae',
    subtitle: 'Rich Fudge Cocoa',
    bgGradient: 'from-amber-900 via-stone-800 to-amber-950',
    borderColor: 'border-amber-600',
    glow: 'shadow-[0_0_18px_rgba(180,83,9,0.35)]',
    textColor: 'text-amber-100',
    badgeBg: 'bg-amber-800/80',
    badgeText: 'text-amber-100',
  },
  16: {
    value: 16,
    name: 'Caramel Swirl',
    subtitle: 'Golden Amber Melt',
    bgGradient: 'from-amber-200 via-yellow-100 to-amber-300',
    borderColor: 'border-amber-400',
    glow: 'shadow-[0_0_18px_rgba(245,158,11,0.4)]',
    textColor: 'text-amber-950',
    badgeBg: 'bg-amber-400/80',
    badgeText: 'text-amber-950',
  },
  32: {
    value: 32,
    name: 'Cookies & Cream',
    subtitle: 'Oreo Crumb Velvet',
    bgGradient: 'from-slate-800 via-slate-900 to-zinc-950',
    borderColor: 'border-slate-500',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.4)]',
    textColor: 'text-slate-100',
    badgeBg: 'bg-slate-700/80',
    badgeText: 'text-slate-100',
  },
  64: {
    value: 64,
    name: 'Lemon Blossom',
    subtitle: 'Zesty Citrus Curd',
    bgGradient: 'from-yellow-200 via-amber-100 to-yellow-300',
    borderColor: 'border-yellow-400',
    glow: 'shadow-[0_0_22px_rgba(234,179,8,0.45)]',
    textColor: 'text-yellow-950',
    badgeBg: 'bg-yellow-400/80',
    badgeText: 'text-yellow-950',
  },
  128: {
    value: 128,
    name: 'Wild Berry',
    subtitle: 'Blackberry Sparkle',
    bgGradient: 'from-purple-900 via-fuchsia-950 to-indigo-950',
    borderColor: 'border-purple-400',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.5)]',
    textColor: 'text-purple-100',
    badgeBg: 'bg-purple-800/80',
    badgeText: 'text-purple-100',
  },
  256: {
    value: 256,
    name: 'Red Velvet',
    subtitle: 'Cream Cheese Swirl',
    bgGradient: 'from-rose-800 via-red-900 to-rose-950',
    borderColor: 'border-rose-400',
    glow: 'shadow-[0_0_26px_rgba(244,63,94,0.6)]',
    textColor: 'text-rose-100',
    badgeBg: 'bg-rose-700/80',
    badgeText: 'text-rose-100',
  },
  512: {
    value: 512,
    name: 'Matcha Mint',
    subtitle: 'Emerald Green Tea',
    bgGradient: 'from-emerald-800 via-teal-900 to-emerald-950',
    borderColor: 'border-emerald-400',
    glow: 'shadow-[0_0_28px_rgba(16,185,129,0.65)]',
    textColor: 'text-emerald-100',
    badgeBg: 'bg-emerald-700/80',
    badgeText: 'text-emerald-100',
  },
  1024: {
    value: 1024,
    name: '24K Gold Leaf',
    subtitle: 'Espresso Royale',
    bgGradient: 'from-amber-500 via-yellow-400 to-amber-600',
    borderColor: 'border-yellow-200',
    glow: 'shadow-[0_0_34px_rgba(234,179,8,0.85)] animate-pulse',
    textColor: 'text-amber-950',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-200',
  },
  2048: {
    value: 2048,
    name: 'Diamond Crown',
    subtitle: 'The Ultimate Cupcake',
    bgGradient: 'from-cyan-400 via-fuchsia-400 to-pink-400',
    borderColor: 'border-white',
    glow: 'shadow-[0_0_40px_rgba(255,255,255,0.95)] animate-pulse',
    textColor: 'text-slate-950',
    badgeBg: 'bg-white/90',
    badgeText: 'text-cyan-900 font-black',
  },
};

export function getCupcakeTier(value: number): CupcakeTier {
  if (CUPCAKE_TIERS[value]) {
    return CUPCAKE_TIERS[value];
  }
  // Fallback for 4096+ Cosmic Galaxy Cupcake
  return {
    value,
    name: 'Cosmic Galaxy',
    subtitle: 'Legendary Baker',
    bgGradient: 'from-purple-600 via-pink-500 to-cyan-400',
    borderColor: 'border-cyan-200',
    glow: 'shadow-[0_0_40px_rgba(236,72,153,0.9)] animate-pulse',
    textColor: 'text-white',
    badgeBg: 'bg-black/60',
    badgeText: 'text-cyan-300 font-black',
  };
}
