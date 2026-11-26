export type GameCategory = 'Arcade' | 'Puzzle' | 'Relaxing' | 'Casual';

export type GameSourceType = 'owned' | 'embed' | 'external';

export interface GameItem {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  route: string;
  sourceType: GameSourceType;
  embedUrl?: string;
  externalUrl?: string;
  featured?: boolean;
  tags: string[];
  badge?: string;
  accentColor?: string;
  updatedAt: string; // ISO date string used for real sitemap lastmod
  guidesHref?: string;
  gamesLikeHref?: string;
  noindex?: boolean;
}

export const GAME_CATEGORIES: GameCategory[] = ['Arcade', 'Puzzle', 'Relaxing', 'Casual'];

export const GAMES_CATALOGUE: GameItem[] = [
  {
    id: 'jelly-bounce',
    title: 'Jump Jelly Jump!',
    description:
      'Play Jump Jelly Jump! free in your browser. Sprint along suspended runways, collect cyan diamonds, and hit chevron speed pads to leap endless chasms.',
    category: 'Arcade',
    thumbnail: 'jelly-bounce',
    route: '/games/jelly-bounce',
    sourceType: 'owned',
    featured: true,
    tags: ['3D Runner', 'Arcade', 'Endless Runner', 'Speed Pads'],
    badge: 'Original',
    accentColor: '#00f0ff',
    updatedAt: '2026-11-22T11:49:04+05:30',
    gamesLikeHref: '/games-like/3d-runner-games',
  },
  {
    id: 'belt-sort',
    title: 'Conveyor Sort Rush',
    description:
      'Sort fast-moving colored shapes into matching bins on a perspective factory conveyor belt! Hit Perfect Zones for x2 points, Slow-Mo chains, and seeded Daily Runs.',
    category: 'Casual',
    thumbnail: 'belt-sort',
    route: '/games/belt-sort',
    sourceType: 'owned',
    featured: true,
    tags: ['Shape Sorting Game', 'Conveyor Belt Game', '1-Tap Casual', 'Daily Challenge'],
    badge: 'NEW',
    accentColor: '#2f6bff',
    updatedAt: '2026-11-26T18:38:00+05:30',
    guidesHref: '/guides/conveyor-sort-tips',
    gamesLikeHref: '/games-like/conveyor-sort',
  },
  {
    id: '2048-puzzle',
    title: '2048 Neon Fusion',
    description:
      'Play 2048 Neon Fusion free online. Slide glowing number tiles across a 4x4 grid, trigger harmonic merge chimes, use diamond undos, and reach 2048.',
    category: 'Puzzle',
    thumbnail: '2048-puzzle',
    route: '/games/2048-puzzle',
    sourceType: 'owned',
    featured: true,
    tags: ['2048 Game', 'Puzzle', 'Math Strategy', 'Sliding Tiles'],
    badge: 'Original',
    accentColor: '#f59e0b',
    updatedAt: '2026-11-22T11:40:02+05:30',
    guidesHref: '/guides/2048-strategy',
    gamesLikeHref: '/games-like/2048',
  },
  {
    id: 'color-zen',
    title: 'Block Grid Zen',
    description:
      'Play Block Grid Zen free in your browser. Drag geometric polyomino blocks onto a calming 10x10 grid, clear full rows and columns, and relax without timers.',
    category: 'Relaxing',
    thumbnail: 'color-zen',
    route: '/games/color-zen',
    sourceType: 'owned',
    featured: true,
    tags: ['Block Puzzle', '10x10 Grid', 'Relaxing Games', 'Spatial Puzzle'],
    badge: 'Original',
    accentColor: '#14b8a6',
    updatedAt: '2026-11-22T09:40:23+05:30',
    gamesLikeHref: '/games-like/block-blast',
  },
  {
    id: 'quick-tap',
    title: 'Cyber Dash',
    description:
      'Play Cyber Dash free online. Tap to pilot a neon flyer through pulsing laser gates, graze edges for bonus diamonds, and activate plasma revive shields.',
    category: 'Casual',
    thumbnail: 'quick-tap',
    route: '/games/quick-tap',
    sourceType: 'owned',
    featured: true,
    tags: ['1-Tap Game', 'Neon Runner', 'Reflex Game', 'Rhythm Flight'],
    badge: 'Original',
    accentColor: '#a855f7',
    updatedAt: '2026-11-21T12:40:50+05:30',
    gamesLikeHref: '/games-like/flappy-bird',
  },
  {
    id: 'cupcake-2048',
    title: 'Cupcake 2048',
    description:
      'Play Cupcake 2048 free online in your browser. Merge sweet dessert tiles to reach the 2048 Diamond Crown Cupcake with diamond undo support.',
    category: 'Puzzle',
    thumbnail: 'cupcake-2048',
    route: '/games/cupcake-2048',
    sourceType: 'owned',
    featured: true,
    tags: ['Cupcake 2048', '2048 Cupcakes', 'Puzzle', 'Merge Game'],
    badge: 'NEW',
    accentColor: '#ec4899',
    updatedAt: '2026-11-24T22:05:16+05:30',
    guidesHref: '/guides/cupcake-2048-strategy',
    gamesLikeHref: '/games-like/2048',
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
