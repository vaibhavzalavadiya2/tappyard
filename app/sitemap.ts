import type { MetadataRoute } from 'next';
import { GAMES_CATALOGUE } from '@/data/games';

const SITE_URL = 'https://tappyard.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const gamePages = GAMES_CATALOGUE.filter(
    (g) => g.sourceType === 'owned' || g.sourceType === 'embed'
  ).map((game) => ({
    url: `${SITE_URL}${game.route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: game.featured ? 0.9 : 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...gamePages,
  ];
}
