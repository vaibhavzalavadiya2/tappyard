import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import { getContactEmail, SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';

const PAGE_URL = `${SITE_URL}/privacy`;
const PAGE_DESC =
  'Read the TAPPYARD Privacy Policy covering localStorage game saves, optional Google sign-in, analytics telemetry, cookies, and player data rights.';

export const metadata: Metadata = {
  title: 'TAPPYARD Privacy Policy - Player Data & Storage',
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'TAPPYARD Privacy Policy - Player Data & Storage | TAPPYARD',
    description: PAGE_DESC,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: '/og/tappyard-og.png', width: 1200, height: 630, alt: 'TAPPYARD Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAPPYARD Privacy Policy - Player Data & Storage',
    description: PAGE_DESC,
    images: ['/og/tappyard-og.png'],
  },
};

export default function PrivacyPolicyPage() {
  const contactEmail = getContactEmail();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Privacy Policy', url: PAGE_URL },
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
              <span className="text-white">Privacy Policy</span>
            </nav>
            <h1 className="typo-h1 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Last Updated: November 26, 2026
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">1. Introduction</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Welcome to TAPPYARD (accessible at <a href="https://tappyard.com" className="text-cyan-400 hover:underline">https://tappyard.com</a>). We design browser games that work immediately without mandatory registration. This Privacy Policy explains clearly what information is stored locally on your device, when cloud data is used, and how analytics help us maintain smooth performance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. LocalStorage Browser Data</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              When playing as a guest, TAPPYARD stores game progress exclusively on your own device via browser <code className="text-pink-300">localStorage</code>. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
              <li>Unified TAPPYARD Diamond balance (<code className="text-slate-300">tappyard_wallet_diamonds</code> and daily reward timestamps).</li>
              <li>Per-game personal best scores (<code className="text-slate-300">tappyard-beltsort-best</code>, <code className="text-slate-300">tappyard-2048-best</code>, <code className="text-slate-300">tappyard-cupcake-2048-best</code>, <code className="text-slate-300">tappyard-blockzen-best</code>, <code className="text-slate-300">tappyard-cyberdash-best</code>, and Jump Jelly Jump distance records).</li>
              <li>Daily Run streaks, today&apos;s best daily score, run counts, and unlocked cosmetic skins.</li>
              <li>Audio mute preferences and your recently played games list (<code className="text-slate-300">tappyard_recent_games</code>) plus optional local display nickname.</li>
            </ul>
            <p className="text-sm leading-relaxed text-slate-400">
              You may clear browser storage at any time via your browser settings. All TAPPYARD games degrade safely if localStorage is disabled.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. Site Analytics &amp; Performance Telemetry</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              TAPPYARD uses <strong>Google Analytics</strong> and <strong>Microsoft Clarity</strong> to understand aggregated traffic patterns, popular game modes, device form factors, and UI usability issues. This analytics telemetry helps us fix bugs and optimize frame rates across mobile and desktop browsers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">4. Optional Account Sign-In</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              If you optionally choose to sign in with Google via Supabase Authentication to synchronize your high scores and Diamond balance across devices, we receive your email address, display name, and profile avatar URL strictly to maintain your synced player profile. We never sell or rent personal information to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">5. Contact &amp; Data Deletion</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              If you have privacy questions or want to delete optional cloud-synced profile records, email us at{' '}
              <a href={`mailto:${contactEmail}`} className="text-pink-400 hover:underline">
                {contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
