import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const SITE_URL = 'https://tappyard.com';
const SITE_NAME = 'TAPPYARD';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
    { media: '(prefers-color-scheme: light)', color: '#090d16' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'TAPPYARD — Free Online Games | Play Instant Browser Games (No Download)',
    template: '%s | TAPPYARD',
  },
  description:
    'Play free online browser games with no downloads or installs. Enjoy instant 3D arcade runners, 2048 number puzzles, 10x10 block grid zen, and rhythm reflex games on mobile, tablet, and desktop.',

  keywords: [
    'free online games',
    'play games online',
    'browser games no download',
    'unblocked games',
    'free browser games',
    'instant games online',
    'HTML5 games',
    'WebGL games',
    'mobile browser games',
    'casual games free',
    'arcade games online',
    '2048 game online',
    'block puzzle online',
    '3D runner game online',
    'Jump Jelly Jump',
    'Cyber Dash',
    'Block Grid Zen',
    'TAPPYARD',
    'play free games without downloading',
    'mini games for school and work',
  ],

  authors: [{ name: 'TAPPYARD', url: SITE_URL }],
  creator: 'TAPPYARD',
  publisher: 'TAPPYARD',

  applicationName: 'TAPPYARD',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#D946EF' },
    ],
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'TAPPYARD — Free Online Games | Play Instant Browser Games',
    description:
      'Play free online games instantly in your browser — 3D arcade runners, 2048 puzzles, 10x10 block grids, and reflex flight games. No downloads, 100% mobile ready.',
    images: [
      {
        url: '/og/tappyard-og.png',
        width: 1200,
        height: 630,
        alt: 'TAPPYARD — Free Online Browser Games Platform',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TAPPYARD — Free Online Games (No Download)',
    description:
      'Play free 3D arcade runners, 2048 puzzles, 10x10 block zen, and reflex flight games instantly in your browser. No downloads.',
    images: ['/og/tappyard-og.png'],
    creator: '@tappyard',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: 'games',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TAPPYARD',
  },

  other: {
    'mobile-web-app-capable': 'yes',
  },
};

// JSON-LD Structured Data for the whole site
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description:
    'Play free instant browser games online — arcade runners, puzzles, and casual games. No downloads.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icons/icon-512.png`,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased dark" data-scroll-behavior="smooth">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Documentation" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-[#090d16] text-slate-100 antialiased selection:bg-pink-500 selection:text-white flex flex-col overscroll-none">
        {children}
      </body>
      <GoogleAnalytics gaId="G-H7EQCRZ477" />
    </html>
  );
}
