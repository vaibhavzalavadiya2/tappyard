import type { ReactNode } from 'react';
import Link from 'next/link';
import Footer from '@/components/tappyard/Footer';
import GameThumbnail from '@/components/tappyard/GameThumbnail';
import GuideHeader from '@/components/tappyard/GuideHeader';
import { GAMES_CATALOGUE, getGameById } from '@/data/games';
import { SITE_NAME, SITE_URL } from '@/data/homeFaqs';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/structuredData';
import { ArrowLeft, Play } from 'lucide-react';

interface ContentArticleShellProps {
  pageUrl: string;
  breadcrumbCategory: { name: string; href: string };
  breadcrumbCurrent: string;
  headline: string;
  badgeText: string;
  badgeIcon: ReactNode;
  introText: string;
  articleDescription: string;
  articleImagePath: string;
  datePublished: string;
  dateModified: string;
  primaryGameIds: string[];
  guideHeaderTitle: string;
  guideHeaderHref: string;
  guideHeaderLabel: string;
  accentColor?: 'amber' | 'purple' | 'teal' | 'cyan' | 'pink';
  bgClassName?: string;
  accentBorderClass?: string;
  accentTextClass?: string;
  children: ReactNode;
}

export default function ContentArticleShell({
  pageUrl,
  breadcrumbCategory,
  breadcrumbCurrent,
  headline,
  badgeText,
  badgeIcon,
  introText,
  articleDescription,
  articleImagePath,
  datePublished,
  dateModified,
  primaryGameIds,
  guideHeaderTitle,
  guideHeaderHref,
  guideHeaderLabel,
  accentColor = 'cyan',
  bgClassName = 'bg-[#08111a]',
  accentBorderClass = 'border-cyan-500/30',
  accentTextClass = 'text-cyan-300',
  children,
}: ContentArticleShellProps) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: breadcrumbCategory.name, url: `${SITE_URL}${breadcrumbCategory.href}` },
    { name: breadcrumbCurrent, url: pageUrl },
  ]);

  const articleJsonLd = buildArticleJsonLd({
    headline,
    description: articleDescription,
    url: pageUrl,
    image: `${SITE_URL}${articleImagePath}`,
    datePublished,
    dateModified,
  });

  const recommendedGames = primaryGameIds
    .map((id) => getGameById(id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const otherGames = GAMES_CATALOGUE.filter((g) => !primaryGameIds.includes(g.id));

  return (
    <div className={`min-h-screen flex flex-col ${bgClassName} text-slate-100 selection:bg-pink-500 selection:text-white`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <GuideHeader
        gameTitle={guideHeaderTitle}
        gameHref={guideHeaderHref}
        guideTitle={guideHeaderLabel}
        accentColor={accentColor}
      />

      <main className="flex-1">
        <div className="max-w-6xl w-full mx-auto px-4 xl:px-5 py-6 sm:py-8">
          <div className="flex flex-col lg:gap-8 gap-6">
            <nav aria-label="Breadcrumb" className="typo-nav flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">
                TAPPYARD
              </Link>
              <span className="text-slate-600">/</span>
              <Link href={breadcrumbCategory.href} className="hover:text-white transition-colors">
                {breadcrumbCategory.name}
              </Link>
              <span className="text-slate-600">/</span>
              <span className={`${accentTextClass} font-medium`}>{breadcrumbCurrent}</span>
            </nav>

            <div className="flex flex-col gap-3 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`typo-label inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/5 border ${accentBorderClass} ${accentTextClass}`}>
                  {badgeIcon}
                  {badgeText}
                </span>
              </div>
              <h1 className="typo-h1 text-2xl sm:text-3xl lg:text-4xl text-white font-bold">
                {headline}
              </h1>
              <p className="typo-body text-sm sm:text-base text-slate-300 leading-relaxed">
                {introText}
              </p>
            </div>

            {/* Recommended Play CTA Cards */}
            <div className={`grid grid-cols-1 ${recommendedGames.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
              {recommendedGames.map((game) => (
                <div
                  key={game.id}
                  className={`relative overflow-hidden rounded-xl bg-slate-900/75 border ${accentBorderClass} p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/15 shadow-lg">
                      <GameThumbnail id={game.thumbnail} title={game.title} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="typo-section-heading text-base text-white font-semibold truncate">
                        Play {game.title}
                      </h2>
                      <p className="typo-body text-xs text-slate-300 mt-0.5 line-clamp-2">
                        {game.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={game.route}
                    className="typo-button inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-md active:scale-95 transition-all shrink-0 w-full sm:w-auto"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Play Free</span>
                  </Link>
                </div>
              ))}
            </div>

            {children}

            {/* More Games on TAPPYARD */}
            <section className="flex flex-col gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="typo-section-heading text-xl text-white">
                  More Free Instant Games on TAPPYARD
                </h2>
                <Link
                  href="/"
                  className="typo-button inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Games</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {otherGames.map((game) => (
                  <Link
                    key={game.id}
                    href={game.route}
                    className="group p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col gap-2.5"
                  >
                    <div className="w-full aspect-16/10 rounded-xl overflow-hidden bg-slate-950 relative">
                      <GameThumbnail id={game.thumbnail} title={game.title} />
                    </div>
                    <div>
                      <span className="typo-label text-[10px] text-purple-300 uppercase tracking-wider block">
                        {game.category}
                      </span>
                      <h3 className="typo-game-title text-sm text-white group-hover:text-pink-300 transition-colors mt-0.5 font-semibold">
                        {game.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
