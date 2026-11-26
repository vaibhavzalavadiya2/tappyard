import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import { getContactEmail, SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';

const PAGE_URL = `${SITE_URL}/terms`;
const PAGE_DESC =
  'Read the TAPPYARD Terms of Service covering free instant browser gameplay, optional account sync, fair play rules, and site usage guidelines.';

export const metadata: Metadata = {
  title: 'TAPPYARD Terms of Service - Fair Play & Usage',
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'TAPPYARD Terms of Service - Fair Play & Usage | TAPPYARD',
    description: PAGE_DESC,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: '/og/tappyard-og.png', width: 1200, height: 630, alt: 'TAPPYARD Terms of Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAPPYARD Terms of Service - Fair Play & Usage',
    description: PAGE_DESC,
    images: ['/og/tappyard-og.png'],
  },
};

export default function TermsOfServicePage() {
  const contactEmail = getContactEmail();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Terms of Service', url: PAGE_URL },
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
              <span className="text-white">Terms of Service</span>
            </nav>
            <h1 className="typo-h1 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Last Updated: November 26, 2026
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              By accessing or playing games on TAPPYARD (<a href="https://tappyard.com" className="text-cyan-400 hover:underline">https://tappyard.com</a>), you agree to comply with these Terms of Service. If you do not agree with these terms, please discontinue using the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Free Personal Gameplay</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              All browser games on TAPPYARD are provided free of charge for personal, non-commercial entertainment. No download, payment, or subscription is required to play any title on the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. User Accounts &amp; Fair Play</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Players may optionally sign in via Google authentication to synchronize scores and rewards across devices. Automated scripting, unauthorized score tampering, API abuse, or attempts to disrupt service availability are prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">4. Intellectual Property</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              All original game mechanics, graphics, procedural audio synthesis, UI layouts, and branding on TAPPYARD remain the property of TAPPYARD and may not be redistributed or mirrored without permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">5. Disclaimer of Warranties</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              TAPPYARD is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we aim for smooth 60fps availability, we cannot guarantee uninterrupted access across every device or network configuration.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">6. Contact</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              For questions about these Terms of Service, contact us at{' '}
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
