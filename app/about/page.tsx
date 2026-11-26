import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import { GAMES_CATALOGUE } from '@/data/games';
import { SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import { Gamepad2, Sparkles, ShieldCheck, Smartphone } from 'lucide-react';

const PAGE_URL = `${SITE_URL}/about`;
const PAGE_DESC =
  'Learn how TAPPYARD builds fast, free, no-download HTML5 and WebGL browser games crafted for mobile touchscreens and desktop keyboards without bloat.';

export const metadata: Metadata = {
  title: 'About TAPPYARD - Instant HTML5 Browser Games',
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'About TAPPYARD - Instant HTML5 Browser Games | TAPPYARD',
    description: PAGE_DESC,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: '/og/tappyard-og.png', width: 1200, height: 630, alt: 'About TAPPYARD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About TAPPYARD - Instant HTML5 Browser Games',
    description: PAGE_DESC,
    images: ['/og/tappyard-og.png'],
  },
};

export default function AboutPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'About', url: PAGE_URL },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b13] text-slate-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <header className="border-b border-slate-800 pb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-3">
              <Link href="/" className="hover:text-white transition-colors">TAPPYARD</Link>
              <span>/</span>
              <span className="text-white">About Us</span>
            </nav>
            <h1 className="typo-h1 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              About TAPPYARD
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Lightweight, zero-install browser games built cleanly for instant play.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-pink-400" />
              <span>Our Mission</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              TAPPYARD was created with a simple focus: browser games should load in under a second, play smoothly at 60 frames per second, and respect your time and device. Instead of wrapping heavy third-party embeds or cluttering pages with pop-up bloat, every title in our {GAMES_CATALOGUE.length}-game library is engineered directly for the modern web using native HTML5 2D Canvas, React, Phaser WebGL rendering, and real-time procedural Web Audio synthesis.
            </p>
            <p className="text-sm leading-relaxed text-slate-300">
              Because our sound effects and visuals are generated cleanly in code with minimal asset payloads, games open quickly even on mobile data connections, older laptops, and school or work Chromebooks. You never have to install an app store package or create a mandatory account just to enjoy a quick puzzle, endless runner, or shape-sorting challenge.
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Mobile-First Ergonomics</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Every control scheme is tuned first for one-handed touchscreens on iOS Safari and Android Chrome while supporting full keyboard shortcuts on desktop browsers.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Transparent Progress</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                High scores, Daily Run streaks, unlocked skins, and unified TAPPYARD Diamonds save locally in your browser by default, with optional Google cloud sync whenever you want cross-device saves.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Play Our Original Library</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Whether you enjoy strategic tile-merging puzzles like 2048 Neon Fusion and Cupcake 2048, relaxing block placement in Block Grid Zen, rapid shape sorting in Conveyor Sort Rush, fast 1-tap tunnel flight in Cyber Dash, or endless canyon running in Jump Jelly Jump!, every game on TAPPYARD is free forever.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {GAMES_CATALOGUE.map((g) => (
                <Link
                  key={g.id}
                  href={g.route}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-xs font-medium text-white transition-colors"
                >
                  {g.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
