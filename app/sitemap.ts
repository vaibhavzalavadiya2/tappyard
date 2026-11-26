import type { MetadataRoute } from 'next';
import { buildSitemapEntries } from '@/lib/seoRoutes';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
