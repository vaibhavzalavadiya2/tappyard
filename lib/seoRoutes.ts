import { GAME_CATEGORIES, GAMES_CATALOGUE, type GameItem } from '@/data/games';
import { SITE_URL } from '@/data/homeFaqs';

export interface SitemapRouteEntry {
  url: string;
  lastModified: Date;
}

export interface StaticSeoRouteDef {
  path: string;
  updatedAt: string;
  noindex?: boolean;
}

export const STATIC_SEO_ROUTES: StaticSeoRouteDef[] = [
  { path: '/', updatedAt: '2026-11-26T18:38:00+05:30' },
  { path: '/guides/2048-strategy', updatedAt: '2026-11-21T10:13:18+05:30' },
  { path: '/guides/cupcake-2048-strategy', updatedAt: '2026-11-26T18:50:00+05:30' },
  { path: '/guides/conveyor-sort-tips', updatedAt: '2026-11-26T18:51:00+05:30' },
  { path: '/games-like/block-blast', updatedAt: '2026-11-21T10:13:18+05:30' },
  { path: '/games-like/3d-runner-games', updatedAt: '2026-11-21T10:13:18+05:30' },
  { path: '/games-like/flappy-bird', updatedAt: '2026-11-21T10:13:18+05:30' },
  { path: '/games-like/conveyor-sort', updatedAt: '2026-11-25T17:30:00+05:30' },
  { path: '/games-like/2048', updatedAt: '2026-11-26T18:52:00+05:30' },
  { path: '/games-like/slope', updatedAt: '2026-11-26T18:53:00+05:30' },
  { path: '/games-like/tetris', updatedAt: '2026-11-26T18:54:00+05:30' },
  { path: '/about', updatedAt: '2026-11-26T18:55:00+05:30' },
  { path: '/contact', updatedAt: '2026-11-26T18:56:00+05:30' },
  { path: '/privacy', updatedAt: '2026-11-25T20:17:13+05:30' },
  { path: '/terms', updatedAt: '2026-11-25T20:40:15+05:30' },
];

export const CATEGORY_UPDATED_AT: Record<string, string> = {
  arcade: '2026-11-26T18:57:00+05:30',
  puzzle: '2026-11-26T18:57:10+05:30',
  relaxing: '2026-11-26T18:57:20+05:30',
  casual: '2026-11-26T18:57:30+05:30',
};

/**
 * Generates deduplicated, strictly validated sitemap entries directly from
 * GAMES_CATALOGUE, category slugs, and content/trust route definitions.
 * Omits `changefreq` and `priority` per modern Google guidelines.
 */
export function buildSitemapEntries(
  catalogue: GameItem[] = GAMES_CATALOGUE,
  staticRoutes: StaticSeoRouteDef[] = STATIC_SEO_ROUTES
): SitemapRouteEntry[] {
  const entries: SitemapRouteEntry[] = [];

  for (const r of staticRoutes) {
    if (r.noindex) continue;
    entries.push({
      url: r.path === '/' ? SITE_URL : `${SITE_URL}${r.path}`,
      lastModified: new Date(r.updatedAt),
    });
  }

  for (const cat of GAME_CATEGORIES) {
    const slug = cat.toLowerCase();
    entries.push({
      url: `${SITE_URL}/category/${slug}`,
      lastModified: new Date(CATEGORY_UPDATED_AT[slug] || '2026-11-26T18:57:00+05:30'),
    });
  }

  for (const game of catalogue) {
    if (game.noindex) continue;
    if (game.sourceType !== 'owned' && game.sourceType !== 'embed') continue;
    entries.push({
      url: `${SITE_URL}${game.route}`,
      lastModified: new Date(game.updatedAt),
    });
  }

  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.url)) {
      throw new Error(`Duplicate sitemap URL detected: ${entry.url}`);
    }
    seen.add(entry.url);
  }

  return entries;
}
