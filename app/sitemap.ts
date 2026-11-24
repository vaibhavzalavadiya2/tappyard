import type { MetadataRoute } from 'next';
import { GAMES_CATALOGUE } from '@/data/games';

const SITE_URL = 'https://tappyard.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const gamePages = GAMES_CATALOGUE.filter(
    (g) => g.sourceType === 'owned' || g.sourceType === 'embed'
  ).map((game) => ({
    url: `${SITE_URL}${game.route}`,
    lastModified: new Date('2026-11-21'),
    changeFrequency: 'daily' as const,
    priority: game.featured ? 0.9 : 0.8,
  }));

  const supportingPages = [
    {
      url: `${SITE_URL}/games/cupcake-2048`,
      lastModified: new Date('2026-11-24'),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides/2048-strategy`,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/games-like/block-blast`,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/games-like/3d-runner-games`,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/games-like/flappy-bird`,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date('2026-11-21'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...gamePages,
    ...supportingPages,
  ];
}
