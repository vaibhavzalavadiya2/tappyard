import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import { getContactEmail, SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import { Mail, MessageSquare, ShieldAlert, Bug } from 'lucide-react';

const PAGE_URL = `${SITE_URL}/contact`;
const PAGE_DESC =
  'Contact the TAPPYARD team for gameplay help, bug reports, account questions, or partnership inquiries. Reach us directly by email without hassle.';

export const metadata: Metadata = {
  title: 'Contact TAPPYARD - Player Support & Feedback',
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Contact TAPPYARD - Player Support & Feedback | TAPPYARD',
    description: PAGE_DESC,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: '/og/tappyard-og.png', width: 1200, height: 630, alt: 'Contact TAPPYARD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact TAPPYARD - Player Support & Feedback',
    description: PAGE_DESC,
    images: ['/og/tappyard-og.png'],
  },
};

export default function ContactPage() {
  const contactEmail = getContactEmail();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Contact', url: PAGE_URL },
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
              <span className="text-white">Contact</span>
            </nav>
            <h1 className="typo-h1 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Contact TAPPYARD
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Questions, bug reports, account assistance, or game suggestions.
            </p>
          </header>

          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Direct Email Support</h2>
                <p className="text-xs text-slate-400">
                  We read every message sent to our support inbox.
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              You can reach the TAPPYARD team directly at{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="text-pink-400 hover:text-pink-300 font-semibold underline"
              >
                {contactEmail}
              </a>
              . To help us investigate faster, please include the name of the game you were playing, your browser or device model (for example iPhone Safari or Windows Chrome), and a short description of what happened.
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Bug className="w-4 h-4" />
                <span>Bug Reports</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spot a layout issue, audio glitch, or broken touch control? Let us know which screen width and browser you used so we can patch it promptly.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Privacy &amp; Data Requests</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need to delete an optional cloud-synced profile or ask about browser storage? Email us with your signed-in account address for fast removal.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>Game Feedback</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have balance feedback for Conveyor Sort Rush Daily Runs, new puzzle variants, or accessibility improvements? We welcome all player ideas.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
