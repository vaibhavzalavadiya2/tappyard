import Link from 'next/link';
import { HelpCircle, Sparkles, Trophy, Gamepad2, ArrowRight, BookOpen } from 'lucide-react';
import { GAMES_CATALOGUE, getGameById } from '@/data/games';
import { SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildVideoGameJsonLd,
} from '@/lib/structuredData';
import GameThumbnail from './GameThumbnail';
import Footer from './Footer';

export interface GameFAQItem {
  question: string;
  answer: string;
}

export interface GameContentData {
  gameId: string;
  gameTitle: string;
  category: 'Arcade' | 'Puzzle' | 'Relaxing' | 'Casual';
  canonicalUrl: string;
  introHeading: string;
  introText: string;
  howToPlay: string;
  controls: {
    touch: string;
    keyboardMouse: string;
  };
  tips: string[];
  supportingPageLink?: {
    href: string;
    label: string;
    anchorText: string;
  };
  faqs: GameFAQItem[];
  about: {
    genre: string;
    platform: string;
    price: string;
    developer: string;
    lastUpdated: string;
  };
}

interface GameContentBelowFoldProps {
  data: GameContentData;
}

export default function GameContentBelowFold({ data }: GameContentBelowFoldProps) {
  const categorySlug = data.category.toLowerCase();
  const catalogEntry = getGameById(data.gameId);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: data.category, url: `${SITE_URL}/category/${categorySlug}` },
    { name: data.gameTitle, url: data.canonicalUrl },
  ]);

  const faqJsonLd = buildFaqJsonLd(data.faqs);

  const videoGameJsonLd = buildVideoGameJsonLd({
    name: data.gameTitle,
    description: data.introText,
    url: data.canonicalUrl,
    image: `${SITE_URL}/og/${data.gameId}-og.png`,
    genre: data.category,
    datePublished: '2026-11-18',
  });

  // Topically prioritize same-category games, strictly pick 3 related games
  const sameCategory = GAMES_CATALOGUE.filter(
    (g) => g.id !== data.gameId && g.category === data.category
  );
  const diffCategory = GAMES_CATALOGUE.filter(
    (g) => g.id !== data.gameId && g.category !== data.category
  );
  const relatedGames = [...sameCategory, ...diffCategory].slice(0, 3);
  const moreGames = GAMES_CATALOGUE.filter((g) => g.id !== data.gameId);

  const getDescriptiveTitle = (id: string, fallback: string) => {
    switch (id) {
      case 'jelly-bounce':
        return 'Jump Jelly Jump! - 3D endless runner';
      case 'belt-sort':
        return 'Conveyor Sort Rush - Shape sorting arcade';
      case '2048-puzzle':
        return '2048 Neon Fusion - 2048 number puzzle';
      case 'cupcake-2048':
        return 'Cupcake 2048 - 2048 cupcakes puzzle';
      case 'color-zen':
        return 'Block Grid Zen - 10x10 block puzzle';
      case 'quick-tap':
        return 'Cyber Dash - 1-tap reflex flyer';
      default:
        return fallback;
    }
  };

  return (
    <div id="game-details" className="w-full bg-[#070b14] border-t border-slate-800 text-slate-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-10">
        {/* 1. Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="typo-nav flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            TAPPYARD
          </Link>
          <span className="text-slate-600">/</span>
          <Link href={`/category/${categorySlug}`} className="hover:text-white transition-colors">
            {data.category}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-medium">{data.gameTitle}</span>
        </nav>

        {/* 2. Primary Keyword Intro + Matching Games-Like / Strategy Links */}
        <section className="flex flex-col gap-3">
          <h2 className="typo-section-heading text-2xl sm:text-3xl text-white">
            {data.introHeading}
          </h2>
          <p className="typo-body text-sm sm:text-base text-slate-300 leading-relaxed">
            {data.introText}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {data.supportingPageLink && (
              <Link
                href={data.supportingPageLink.href}
                className="typo-button inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors"
              >
                <span>{data.supportingPageLink.anchorText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {catalogEntry?.guidesHref && catalogEntry.guidesHref !== data.supportingPageLink?.href && (
              <Link
                href={catalogEntry.guidesHref}
                className="typo-button inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read {data.gameTitle} Strategy &amp; Tips Guide</span>
              </Link>
            )}
          </div>
        </section>

        {/* 3. How to Play & Controls */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:p-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex flex-col gap-3">
            <h2 className="typo-section-heading text-lg sm:text-xl text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>How to Play</span>
            </h2>
            <p className="typo-body text-xs sm:text-sm text-slate-300 leading-relaxed">
              {data.howToPlay}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="typo-section-heading text-lg sm:text-xl text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Controls</span>
            </h3>
            <div className="flex flex-col gap-2 typo-body text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-cyan-300 block mb-0.5">Touch &amp; Mobile:</span>
                <span className="text-slate-300">{data.controls.touch}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-purple-300 block mb-0.5">Mouse &amp; Keyboard:</span>
                <span className="text-slate-300">{data.controls.keyboardMouse}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Tips */}
        <section className="flex flex-col gap-4">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Gameplay Tips</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {data.tips.map((tip, idx) => (
              <li
                key={idx}
                className="typo-body p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-pink-500/15 text-pink-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Play Next: 3 Related Games */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
              Related Games
            </h2>
            <Link href={`/category/${categorySlug}`} className="typo-button text-xs text-pink-400 hover:text-pink-300 transition-colors">
              All {data.category} Games →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedGames.map((game) => (
              <Link
                key={game.id}
                href={game.route}
                className="group p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col gap-3 shadow-md"
              >
                <div className="w-full aspect-16/10 rounded-xl overflow-hidden bg-slate-950 relative">
                  <GameThumbnail id={game.thumbnail} title={game.title} />
                </div>
                <div>
                  <span className="typo-label text-[10px] text-purple-300 uppercase tracking-wider block">
                    {game.category}
                  </span>
                  <h3 className="typo-game-title text-sm font-semibold text-white group-hover:text-pink-300 transition-colors mt-0.5">
                    {getDescriptiveTitle(game.id, game.title)}
                  </h3>
                  <p className="typo-body text-xs text-slate-400 line-clamp-2 mt-1">
                    {game.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="flex flex-col gap-4">
          <h2 className="typo-section-heading text-xl sm:text-2xl text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-pink-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3">
            {data.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-300 open:bg-slate-900/70 transition-colors"
              >
                <summary className="typo-section-heading text-sm sm:text-base text-white font-medium cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{faq.question}</span>
                  <span className="text-pink-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="typo-body text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed pt-2 border-t border-slate-800/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 7. About This Game */}
        <section className="lg:p-6 p-4 rounded-2xl bg-slate-900/30 border border-slate-800/80 flex flex-col gap-3">
          <h3 className="typo-section-heading text-base text-white">About This Game</h3>
          <dl className="grid grid-cols-2 sm:grid-cols-5 gap-3 typo-body text-xs">
            <div>
              <dt className="text-slate-400 font-normal">Genre</dt>
              <dd className="text-white font-medium mt-0.5">{data.about.genre}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-normal">Platform</dt>
              <dd className="text-white font-medium mt-0.5">{data.about.platform}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-normal">Price</dt>
              <dd className="text-emerald-400 font-medium mt-0.5">{data.about.price}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-normal">Developer</dt>
              <dd className="text-white font-medium mt-0.5">{data.about.developer}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-normal">Last Updated</dt>
              <dd className="text-white font-medium mt-0.5">{data.about.lastUpdated}</dd>
            </div>
          </dl>
        </section>

        {/* 8. More Games Row (Catalogue Driven) */}
        <section className="flex flex-col gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 className="typo-section-heading text-base sm:text-lg text-white">
              More games on TAPPYARD
            </h2>
            <Link href="/" className="typo-button text-xs text-pink-400 hover:text-pink-300 transition-colors">
              View All Games →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {moreGames.map((game) => (
              <Link
                key={game.id}
                href={game.route}
                className="px-3 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/40 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>{game.title}</span>
                <span className="text-[10px] text-purple-300">({game.category})</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
