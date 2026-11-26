import React from 'react';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import CupcakeIllustration from './CupcakeIllustration';
import { CUPCAKE_TIERS } from './CupcakeData';
import { GAMES_CATALOGUE } from '@/data/games';
import { SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVideoGameJsonLd,
  type FaqItemInput,
} from '@/lib/structuredData';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Gamepad2,
  Trophy,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const PAGE_URL = `${SITE_URL}/games/cupcake-2048`;

const CUPCAKE_FAQS: FaqItemInput[] = [
  {
    question: 'What is Cupcake 2048?',
    answer:
      'Cupcake 2048 is a dessert-themed variation of the classic 2048 sliding puzzle game. Instead of plain numbers, you merge colorful cupcakes—from Vanilla Birthday (2) and Chocolate Sundae (8) to Red Velvet (256) and the Diamond Crown Cupcake (2048).',
  },
  {
    question: 'What is the highest cupcake in 2048?',
    answer:
      'The primary goal is the 2048 Diamond Crown Cupcake. If you continue in endless mode, you can unlock the rare 4096 Cosmic Galaxy Cupcake and higher scoring dessert tiers.',
  },
  {
    question: 'How do you win Cupcake 2048?',
    answer:
      'To win Cupcake 2048, slide your tiles across the 4x4 bakery matrix so matching cupcakes merge together. Keep your highest-tier cupcake locked in one corner (e.g. bottom-left) and build a descending chain along the edges.',
  },
  {
    question: 'Can I play Cupcake 2048 unblocked at school or work?',
    answer:
      'Yes. Cupcake 2048 on TAPPYARD runs natively in your browser via HTML5 with zero app downloads, sound toggles, and instant loading on school and office Chromebooks.',
  },
  {
    question: 'Does Cupcake 2048 support undo?',
    answer:
      'Yes, TAPPYARD Cupcake 2048 includes an Undo button that allows you to reverse your last moves using unified diamonds collected during gameplay.',
  },
];

export default function CupcakeContentBelowFold() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: 'Puzzle', url: `${SITE_URL}/category/puzzle` },
    { name: 'Cupcake 2048', url: PAGE_URL },
  ]);

  const videoGameJsonLd = buildVideoGameJsonLd({
    name: 'Cupcake 2048',
    description:
      'Play Cupcake 2048 free online in your browser. Merge delicious cupcake tiles to reach the 2048 Diamond Cupcake with undo support and no downloads needed.',
    url: PAGE_URL,
    image: `${SITE_URL}/og/cupcake-2048-og.png`,
    genre: ['Puzzle', 'Casual', 'Merge Game'],
    datePublished: '2026-11-24',
  });

  const faqJsonLd = buildFaqJsonLd(CUPCAKE_FAQS);

  const relatedGames = GAMES_CATALOGUE.filter((g) => g.id !== 'cupcake-2048').slice(0, 3);
  const moreGames = GAMES_CATALOGUE.filter((g) => g.id !== 'cupcake-2048');

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
              <Link href="/category/puzzle" className="hover:text-pink-300 transition-colors">
                Puzzle
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
            Welcome to <strong>Cupcake 2048</strong> on TAPPYARD, the sliding tile merge game combining classic 2048 math rules with colorful bakery art. Slide identical cupcakes across a 4x4 grid to bake higher confections until you craft the <strong>2048 Diamond Crown Cupcake</strong>.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300 mb-4">
            Whether on mobile or desktop, Cupcake 2048 runs smoothly at 60 FPS directly in your web browser with zero installs and built-in undo move support.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/games-like/2048"
              className="typo-button inline-flex items-center gap-1.5 text-xs text-pink-300 hover:text-pink-200 transition-colors"
            >
              <span>Explore Games Like 2048 in Your Browser</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
              How to Play Cupcake 2048 &amp; Controls
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#1c0f24] border border-pink-500/20">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                Touchscreen Controls (Mobile &amp; Tablet)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Swipe your finger in any direction—Up, Down, Left, or Right—anywhere across the game board. All cupcakes slide simultaneously until they hit the border or merge with an identical cupcake.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1c0f24] border border-pink-500/20">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Mouse &amp; Keyboard Controls (Desktop &amp; Laptop)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Click and drag across the board with your mouse, use the <strong>Arrow Keys</strong> (↑, ↓, ←, →), or play with <strong>W, A, S, D</strong>. Press <strong>Z</strong> or <strong>U</strong> to quickly activate Undo when you make a misplaced slide.
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

          <div className="mt-4 p-4 rounded-xl bg-pink-950/40 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-pink-200">Want deeper Cupcake 2048 strategy analysis?</p>
              <p className="text-[11px] text-pink-300/70">Read our dedicated Cupcake 2048 guide and corner chaining walkthrough.</p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link
                href="/guides/cupcake-2048-strategy"
                className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Cupcake Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/guides/2048-strategy"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-pink-500/30 text-pink-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>2048 Strategy</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 5: Unblocked Gameplay */}
        <section className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-[#1c0f24] border border-pink-500/30">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">
              Cupcake 2048 Unblocked for School &amp; Work
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need a relaxing mental break between classes or meetings? TAPPYARD delivers a lightweight HTML5 implementation of Cupcake 2048 with quick sound muting and instant keyboard support on Chromebooks and laptops anytime.
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
            {CUPCAKE_FAQS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#1c0f24] border border-pink-500/20"
              >
                <h3 className="text-sm font-bold text-white mb-1.5">
                  {item.question}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Game Specifications */}
        <section className="mb-12 p-5 rounded-2xl bg-[#160c1d] border border-pink-500/20">
          <h2 className="text-sm font-black uppercase tracking-wider text-pink-400 mb-3">
            Game Details &amp; Specifications
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <dt className="text-slate-500 mb-0.5">Genre</dt>
              <dd className="font-bold text-white">Dessert Merge Puzzle</dd>
            </div>
            <div>
              <dt className="text-slate-500 mb-0.5">Engine</dt>
              <dd className="font-bold text-white">HTML5 / React</dd>
            </div>
            <div>
              <dt className="text-slate-500 mb-0.5">Controls</dt>
              <dd className="font-bold text-white">Touch Swipe &amp; Keyboard</dd>
            </div>
            <div>
              <dt className="text-slate-500 mb-0.5">Price</dt>
              <dd className="font-bold text-emerald-400">100% Free</dd>
            </div>
          </dl>
        </section>

        {/* Section 8: 3 Related Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="typo-section-heading text-xl sm:text-2xl text-white font-black">
              Related Games
            </h2>
            <Link href="/category/puzzle" className="typo-button text-xs text-pink-400 hover:text-pink-300 transition-colors">
              All Puzzle Games →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedGames.map((game) => (
              <Link
                key={game.id}
                href={game.route}
                className="group p-3.5 rounded-2xl bg-[#1c0f24]/80 hover:bg-[#1c0f24] border border-pink-500/20 hover:border-pink-400/50 transition-all flex flex-col gap-3 shadow-md"
              >
                <div className="w-full aspect-16/10 rounded-xl overflow-hidden bg-slate-950 relative">
                  <GameThumbnail id={game.thumbnail} title={game.title} />
                </div>
                <div>
                  <span className="typo-label text-[10px] text-pink-300 uppercase tracking-wider block">
                    {game.category}
                  </span>
                  <h3 className="typo-game-title text-sm font-semibold text-white group-hover:text-pink-300 transition-colors mt-0.5">
                    {game.title}
                  </h3>
                  <p className="typo-body text-xs text-slate-400 line-clamp-2 mt-1">
                    {game.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 9: More Games Row (Catalogue Driven) */}
        <section className="pt-6 border-t border-pink-500/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="typo-section-heading text-base sm:text-lg text-white font-bold">
              More games on TAPPYARD
            </h2>
            <Link href="/" className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {moreGames.map((game) => (
              <Link
                key={game.id}
                href={game.route}
                className="px-3 py-2 rounded-xl bg-[#1c0f24] border border-pink-500/20 hover:border-pink-400/50 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>{game.title}</span>
                <span className="text-[10px] text-pink-300/80">({game.category})</span>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </>
  );
}
