import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    absolute: 'Terms of Service | TAPPYARD',
  },
  description:
    'Read the Terms of Service for TAPPYARD. Understand the rules, gameplay policies, account guidelines, and service terms for our free games.',
  alternates: {
    canonical: 'https://tappyard.com/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-6">
          <Link href="/" className="text-xs text-pink-400 hover:text-pink-300 transition-colors uppercase tracking-wider font-semibold mb-3 inline-block">
            ← Back to TAPPYARD Games
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: November 25, 2026
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            By accessing or playing games on TAPPYARD (<a href="https://tappyard.com" className="text-cyan-400 hover:underline">https://tappyard.com</a>), you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Free Instant Gameplay</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            All games on TAPPYARD are provided free of charge for personal, non-commercial entertainment. No download, payment, or subscription is required to play any game on the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. User Accounts & Fair Play</h2>
          <div className="space-y-3 text-sm leading-relaxed text-slate-400">
            <p>
              Players may optionally sign in using Google or email to synchronize scores and game achievements across devices. You are responsible for maintaining the confidentiality of your account.
            </p>
            <p>
              Automated script injection, botting, memory editing, or unauthorized score alteration on public leaderboards is strictly prohibited and subject to score forfeiture.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Intellectual Property</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            All original graphics, audio, game logic, branding, and visual assets on TAPPYARD are the intellectual property of TAPPYARD. You may not copy, reverse-engineer, or redistribute any game code or art assets without prior written consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">5. Disclaimer of Warranties</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            TAPPYARD is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we strive for continuous 60fps performance and zero downtime, we do not guarantee uninterrupted access or error-free gameplay.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">6. Changes to Terms</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            We reserve the right to modify these terms at any time. Continued use of TAPPYARD after modifications constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">7. Contact Information</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            For inquiries regarding these terms, contact us at: <a href="mailto:vaibhavzalavadiya2@gmail.com" className="text-pink-400 hover:underline">vaibhavzalavadiya2@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
