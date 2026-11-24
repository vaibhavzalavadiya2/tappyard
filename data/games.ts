export type GameCategory = 'Arcade' | 'Puzzle' | 'Relaxing' | 'Casual';

export type GameSourceType = 'owned' | 'embed' | 'external';

export interface GameItem {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  thumbnail: string; // Identifier or path for thumbnail artwork
  route: string; // Internal route e.g. /games/jelly-bounce or /games/xyz
  sourceType: GameSourceType;
  embedUrl?: string; // For third-party games with authorized iframe embedding
  externalUrl?: string; // For external games that open on their original site
  featured?: boolean;
  rating: number; // Out of 5.0
  playsCount: string; // Formatted plays, e.g. "24.5k"
  tags: string[];
  badge?: string; // e.g. "ORIGINAL", "FEATURED", "HOT"
  accentColor?: string; // Hex color for card styling
}

export const GAME_CATEGORIES: GameCategory[] = ['Arcade', 'Puzzle', 'Relaxing', 'Casual'];

export const GAMES_CATALOGUE: GameItem[] = [
  {
    id: 'jelly-bounce',
    title: 'Jump Jelly Jump!',
    description: 'Play Jump Jelly Jump! free in your browser. 3D speed runner across suspended floating runways! Drag to steer your jelly cube, collect cyan diamonds, and hit speed chevron pads to leap across endless chasms. No downloads required.',
    category: 'Arcade',
    thumbnail: 'jelly-bounce',
    route: '/games/jelly-bounce',
    sourceType: 'owned',
    featured: true,
    rating: 4.9,
    playsCount: '28.4k',
    tags: ['3D Runner', 'Arcade', 'Endless Runner', 'Unblocked Games', 'Speed Pads', 'Free Online Games'],
    badge: 'TAPPYARD ORIGINAL',
    accentColor: '#00f0ff',
  },
  {
    id: '2048-puzzle',
    title: '2048 Neon Fusion',
    description: 'Play 2048 Neon Fusion online free. Buttery-smooth sliding tile puzzle with glowing neon numbers, harmonic merge chimes, and diamond undos. Join matching tiles to reach 2048!',
    category: 'Puzzle',
    thumbnail: '2048-puzzle',
    route: '/games/2048-puzzle',
    sourceType: 'owned',
    featured: true,
    rating: 4.8,
    playsCount: '19.8k',
    tags: ['2048 Game', 'Puzzle', 'Brain Puzzle', 'Math Game', 'Sliding Tiles', 'Unblocked Games'],
    badge: 'TAPPYARD ORIGINAL',
    accentColor: '#f59e0b',
  },
  {
    id: 'color-zen',
    title: 'Block Grid Zen',
    description: 'Play Block Grid Zen free in your browser. Soothing 10x10 spatial block puzzle! Drag geometric glowing polyomino pieces, clear full lines with relaxing chimes, and unwind stress-free.',
    category: 'Relaxing',
    thumbnail: 'color-zen',
    route: '/games/color-zen',
    sourceType: 'owned',
    featured: true,
    rating: 4.8,
    playsCount: '16.4k',
    tags: ['Block Puzzle', '10x10 Grid', 'Relaxing Games', 'Brain Teaser', 'Spatial Puzzle', 'Free Online Games'],
    badge: 'TAPPYARD ORIGINAL',
    accentColor: '#14b8a6',
  },
  {
    id: 'quick-tap',
    title: 'Cyber Dash',
    description: 'Play Cyber Dash free online. Fast-paced 1-tap neon reflex flight runner! Dodge pulsing laser gates, graze edges for bonus diamonds, and activate shields to beat high scores.',
    category: 'Casual',
    thumbnail: 'quick-tap',
    route: '/games/quick-tap',
    sourceType: 'owned',
    featured: true,
    rating: 4.7,
    playsCount: '15.6k',
    tags: ['1-Tap Game', 'Neon Runner', 'Reflex Game', 'Flappy Flight', 'Rhythm Game', 'Casual Games'],
    badge: 'TAPPYARD ORIGINAL',
    accentColor: '#a855f7',
  },
  {
    id: 'cupcake-2048',
    title: 'Cupcake 2048',
    description: 'Play Cupcake 2048 free online in your browser. Merge delicious cupcake tiles to reach the 2048 Diamond Cupcake with undo support and no downloads needed.',
    category: 'Puzzle',
    thumbnail: 'cupcake-2048',
    route: '/games/cupcake-2048',
    sourceType: 'owned',
    featured: true,
    rating: 4.9,
    playsCount: '15.4k',
    tags: ['Cupcake 2048', '2048 Cupcakes', 'Puzzle', 'Brain Puzzle', 'Merge Game', 'Unblocked Games', 'Dessert Games'],
    badge: 'NEW DESSERT',
    accentColor: '#ec4899',
  },
];

export function getFeaturedGames(): GameItem[] {
  return GAMES_CATALOGUE.filter((g) => g.featured);
}

export function getGameById(id: string): GameItem | undefined {
  return GAMES_CATALOGUE.find((g) => g.id === id);
}

export function getGamesByCategory(category: GameCategory | 'All'): GameItem[] {
  if (category === 'All') return GAMES_CATALOGUE;
  return GAMES_CATALOGUE.filter((g) => g.category === category);
}

export function searchGames(query: string, category: GameCategory | 'All' = 'All'): GameItem[] {
  const q = query.trim().toLowerCase();
  const list = getGamesByCategory(category);

  if (!q) return list;

  return list.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q))
  );
}
