import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    absolute: 'Privacy Policy | TAPPYARD',
  },
  description:
    'Read the Privacy Policy for TAPPYARD. Understand how we handle account authentication, game saves, cookies, and player privacy.',
  alternates: {
    canonical: 'https://tappyard.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-6">
          <Link href="/" className="text-xs text-pink-400 hover:text-pink-300 transition-colors uppercase tracking-wider font-semibold mb-3 inline-block">
            ← Back to TAPPYARD Games
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: November 25, 2026
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Introduction</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Welcome to TAPPYARD (accessible at <a href="https://tappyard.com" className="text-cyan-400 hover:underline">https://tappyard.com</a>). 
            Your privacy is of paramount importance to us. This Privacy Policy outlines what information we collect, how it is stored, and how it is used to deliver a seamless gaming experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
          <div className="space-y-3 text-sm leading-relaxed text-slate-400">
            <p>
              <strong className="text-white">Guest Gameplay Data:</strong> When playing as a guest, your high scores, collected diamonds, unlocked skins, and sound preferences are stored purely locally in your browser’s LocalStorage. No personally identifiable information (PII) is transmitted.
            </p>
            <p>
              <strong className="text-white">Account Information (Optional):</strong> If you choose to log in with Google OAuth or email to save your progress across devices, we receive your email address, display name, and avatar URL provided by Google.
            </p>
            <p>
              <strong className="text-white">Usage Analytics:</strong> We collect anonymized telemetry (such as page views, device type, and session duration) through Google Analytics and Microsoft Clarity to optimize gameplay performance and frame rates.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
            <li>To synchronize your personal best scores, wallet balance, and unlocked game items across devices.</li>
            <li>To display your display name and rank on global and game leaderboards.</li>
            <li>To detect and prevent client-side exploits and bot manipulation.</li>
            <li>To measure performance, fix bugs, and ensure 60fps rendering across all screen sizes.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Data Storage & Security</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Authentication and cloud-persisted game statistics are securely managed via Supabase with row-level security (RLS) policies. We do not sell, rent, or trade your personal data to third parties under any circumstances.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">5. Cookies & Local Storage</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            We use standard browser cookies and local storage tokens strictly required for session management and remembering your game state. You may clear your browser cookies and local storage at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">6. Contact Us</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            If you have questions or wish to delete your account and associated game stats, contact us at: <a href="mailto:vaibhavzalavadiya2@gmail.com" className="text-pink-400 hover:underline">vaibhavzalavadiya2@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
