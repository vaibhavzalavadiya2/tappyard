import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import GoogleAnalytics from '@/components/tappyard/GoogleAnalytics';
import MicrosoftClarity from '@/components/tappyard/MicrosoftClarity';
import ToastContainer from '@/components/tappyard/Toast';
import CloudSyncListener from '@/components/tappyard/CloudSyncListener';
import './globals.css';

const inter = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const spaceGrotesk = localFont({
  src: '../public/fonts/SpaceGrotesk-Variable.woff2',
  display: 'swap',
  variable: '--font-space-grotesk',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

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
    default: 'TAPPYARD - Free Online Games',
    template: '%s | TAPPYARD',
  },
  description:
    'Play free online browser games with no downloads or installs. Enjoy arcade runners, 2048 puzzles, conveyor sorting, and block zen anytime.',

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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Documentation" />
      </head>
      <body className="min-h-full bg-[#090d16] font-sans text-slate-100 antialiased selection:bg-pink-500 selection:text-white flex flex-col overscroll-none">
        {children}
        <CloudSyncListener />
        <ToastContainer />
        <GoogleAnalytics gaId="G-H7EQCRZ477" />
        <MicrosoftClarity projectId="zfpf7cf0vv" />
      </body>
    </html>
  );
}
