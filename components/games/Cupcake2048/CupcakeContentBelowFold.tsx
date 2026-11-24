import React from 'react';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import CupcakeIllustration from './CupcakeIllustration';
import { CUPCAKE_TIERS } from './CupcakeData';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Gamepad2,
  Trophy,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const SITE_URL = 'https://tappyard.com';
const PAGE_URL = `${SITE_URL}/games/cupcake-2048`;

export default function CupcakeContentBelowFold() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'TAPPYARD',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Games',
        item: `${SITE_URL}/#catalogue`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Cupcake 2048',
        item: PAGE_URL,
      },
    ],
  };

  const videoGameJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Cupcake 2048',
    description:
      'Play Cupcake 2048 free online in your browser. Merge delicious cupcake tiles to reach the 2048 Diamond Cupcake with undo support and no downloads needed.',
    url: PAGE_URL,
    image: `${SITE_URL}/og/cupcake-2048-og.png`,
    genre: ['Puzzle', 'Casual', 'Brain Game', 'Merge Game'],
    gamePlatform: ['Web Browser', 'Mobile Browser', 'Desktop Browser', 'Chromebook'],
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'TAPPYARD',
      url: SITE_URL,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '184',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Cupcake 2048?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cupcake 2048 is a dessert-themed variation of the classic 2048 sliding puzzle game. Instead of plain numbers, you merge colorful cupcakes—from Vanilla Birthday (2) and Chocolate Sundae (8) to Red Velvet (256) and the Diamond Crown Cupcake (2048).',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the highest cupcake in 2048?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The primary goal is the 2048 Diamond Crown Cupcake. If you continue in endless mode, you can unlock the rare 4096 Cosmic Galaxy Cupcake and higher scoring dessert tiers.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you win Cupcake 2048?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To win Cupcake 2048, slide your tiles across the 4x4 bakery matrix so matching cupcakes merge together. Keep your highest-tier cupcake locked in one corner (e.g. bottom-left) and build a descending chain along the edges.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I play Cupcake 2048 unblocked at school or work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Cupcake 2048 on TAPPYARD runs natively in your browser via HTML5 with zero app downloads, sound toggles, and instant loading on school and office Chromebooks.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Cupcake 2048 support undo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, TAPPYARD Cupcake 2048 includes an Undo button that allows you to reverse your last moves using unified diamonds collected during gameplay.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="typo-body w-full max-w-4xl mx-auto px-4 py-12 text-slate-300">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-pink-300/70">
            <li>
              <Link href="/" className="hover:text-pink-300 transition-colors">
                TAPPYARD
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/#catalogue" className="hover:text-pink-300 transition-colors">
                Games
              </Link>
            </li>
            <li>/</li>
            <li className="text-white font-semibold" aria-current="page">
              Cupcake 2048
            </li>
          </ol>
        </nav>

        {/* Section 1: Overview */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h2 className="typo-section-heading text-xl sm:text-2xl text-white font-black">
              Play Cupcake 2048 Free Online (No Download Required)
            </h2>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300 mb-4">
            Welcome to <strong>Cupcake 2048</strong> on TAPPYARD, the deliciously addictive sliding tile merge game! Combining the mathematical elegance of the original 2048 with charming pastry art, your objective is to slide identical cupcakes across a 4x4 bakery matrix to bake increasingly luxurious confections until you craft the mythical <strong>2048 Diamond Crown Cupcake</strong>.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300">
            Whether you are playing on a phone during your daily commute or on a laptop during study breaks, Cupcake 2048 runs smoothly at 60 FPS directly in your web browser with zero loading screens, no app store installs, and built-in undo move support.
          </p>
        </section>

        {/* Section 2: Cupcake Evolution Chart */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="typo-section-heading text-xl sm:text-2xl text-white font-black">
              The 11 Cupcake Evolution Tiers
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-300 mb-6">
            Every time two identical cupcakes collide, they merge into the next dessert rank. Master each flavor on your journey to the bakery throne:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(CUPCAKE_TIERS).map((tier) => (
              <div
                key={tier.value}
                className="p-3 rounded-2xl bg-[#1c0f24] border border-pink-500/20 flex items-center gap-3.5 shadow-sm hover:border-pink-500/40 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.bgGradient} flex items-center justify-center shrink-0 border border-white/20 p-1`}>
                  <CupcakeIllustration value={tier.value} className="w-8 h-8 drop-shadow-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-black text-white truncate">
                      {tier.name}
                    </span>
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${tier.badgeBg} ${tier.badgeText}`}>
                      {tier.value}
                    </span>
                  </div>
                  <p className="text-[11px] text-pink-300/80 truncate">
                    {tier.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: How to Play & Controls */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <h2 className="typo-section-heading text-xl sm:text-2xl text-white font-black">
              How to Play Cupcake 2048 & Controls
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#1c0f24] border border-pink-500/20">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                Touchscreen Controls (Mobile & Tablet)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Swipe your finger in any direction—Up, Down, Left, or Right—anywhere across the game board. All cupcakes slide simultaneously until they hit the border or merge with an identical cupcake.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1c0f24] border border-pink-500/20">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Keyboard Controls (Desktop & Laptop)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Use the <strong>Arrow Keys</strong> (↑, ↓, ←, →) or standard gamer keys (<strong>W, A, S, D</strong>). Press <strong>Z</strong> or <strong>U</strong> to quickly activate Undo when you make a misplaced slide.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Pro Tips and Corner Strategy */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2 className="typo-section-heading text-xl sm:text-2xl text-white font-black">
              Pro Corner Strategy: How to Win Every Round
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                title: 'Lock Your Highest Cupcake in a Corner',
                desc: 'Pick one corner (such as bottom-left or top-left) and never slide in the opposite direction. Keeping your highest cupcake anchored prevents lower-tier pastries from trapping your board.',
              },
              {
                title: 'Build Monotonic Decreasing Chains',
                desc: 'Organize your cupcakes in descending order along your primary wall. For example, if your 1024 Gold Leaf is in the corner, position 512, 256, and 128 next to it for rapid cascade merges.',
              },
              {
                title: 'Avoid the Unnecessary 4th Direction',
                desc: 'If you choose the bottom-left corner, only use Down, Left, and occasionally Right. Never swipe Up unless completely forced, as it risks spawning a new 2 Vanilla Cupcake under your main anchor.',
              },
              {
                title: 'Use Diamonds for Strategic Undos',
                desc: 'TAPPYARD grants you 5 diamonds for every high-tier merge. Save your diamond balance to undo accidental swipes when the board becomes crowded.',
              },
            ].map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#1c0f24] border border-pink-500/20 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{tip.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-pink-200">Want deeper 2048 strategy analysis?</p>
              <p className="text-[11px] text-pink-300/70">Read our comprehensive visual guide on 2048 corner chaining.</p>
            </div>
            <Link
              href="/guides/2048-strategy"
              className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Section 5: Unblocked Gameplay */}
        <section className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-[#1c0f24] border border-pink-500/30">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">
              Cupcake 2048 Unblocked for School & Work
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need a relaxing mental break between classes or meetings? TAPPYARD delivers a lightweight, pure HTML5 implementation of Cupcake 2048 that bypasses typical network filters. With zero bloat, quick sound muting, and instant keyboard support, you can enjoy safe, ad-clean gaming on Chromebooks and work laptops anytime.
          </p>
        </section>

        {/* Section 6: Frequently Asked Questions */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-pink-400" />
            <h2 className="typo-section-heading text-xl sm:text-2xl text-white font-black">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>
          <div className="space-y-3">
            {faqJsonLd.mainEntity.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#1c0f24] border border-pink-500/20"
              >
                <h3 className="text-sm font-bold text-white mb-1.5">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Game Specifications */}
        <section className="mb-12 p-5 rounded-2xl bg-[#160c1d] border border-pink-500/20">
          <h2 className="text-sm font-black uppercase tracking-wider text-pink-400 mb-3">
            Game Details & Specifications
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <dt className="text-slate-500 mb-0.5">Genre</dt>
              <dd className="font-bold text-white">Dessert Merge Puzzle</dd>
            </div>
            <div>
              <dt className="text-slate-500 mb-0.5">Engine</dt>
              <dd className="font-bold text-white">HTML5 Canvas / React</dd>
            </div>
            <div>
              <dt className="text-slate-500 mb-0.5">Controls</dt>
              <dd className="font-bold text-white">Touch Swipe & Keyboard</dd>
            </div>
            <div>
              <dt className="text-slate-500 mb-0.5">Price</dt>
              <dd className="font-bold text-emerald-400">100% Free</dd>
            </div>
          </dl>
        </section>
      </article>

      <Footer />
    </>
  );
}
