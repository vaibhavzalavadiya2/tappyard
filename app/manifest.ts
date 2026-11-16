import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TAPPYARD - Instant Browser Games',
    short_name: 'TAPPYARD',
    description:
      'Play free instant browser games — arcade runners, puzzles, and relaxing casual games. No downloads, no installs. Works on mobile and desktop.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090d16',
    theme_color: '#090d16',
    orientation: 'any',
    categories: ['games', 'entertainment'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
