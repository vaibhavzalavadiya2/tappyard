import type { Metadata } from 'next';
import Link from 'next/link';
import ContentArticleShell from '@/components/tappyard/ContentArticleShell';
import { SITE_URL } from '@/data/homeFaqs';
import { CheckCircle2, Zap } from 'lucide-react';

const PAGE_URL = `${SITE_URL}/guides/conveyor-sort-tips`;
const TITLE = 'Conveyor Sort Rush Tips - Daily Run & Combo Guide';
const DESC =
  'Boost your score in Conveyor Sort Rush with timing tips for the x2 Perfect Zone, chain multiplier milestones, Freeze crystal saves, and Daily Runs.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${TITLE} | TAPPYARD`,
    description: DESC,
    url: PAGE_URL,
    type: 'article',
    images: ['/og/belt-sort-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['/og/belt-sort-og.png'],
  },
};

export default function ConveyorSortTipsGuidePage() {
  return (
    <ContentArticleShell
      pageUrl={PAGE_URL}
      breadcrumbCategory={{ name: 'Casual', href: '/category/casual' }}
      breadcrumbCurrent="Conveyor Sort Rush Tips"
      headline="Conveyor Sort Rush Tips: Perfect Zones, Power-Ups & Daily Runs"
      badgeText="Conveyor Sort Mastery Guide"
      badgeIcon={<Zap className="w-3.5 h-3.5" />}
      introText="Learn how Conveyor Sort Rush scores points under the hood—and use exact belt timing, 4th-bin unlock prep, Slow-Mo chaining, and Freeze crystal discipline to maximize both Endless survival and 60-second Daily Run scores."
      articleDescription={DESC}
      articleImagePath="/og/belt-sort-og.png"
      datePublished="2026-11-26"
      dateModified="2026-11-26"
      primaryGameIds={['belt-sort']}
      guideHeaderTitle="Conveyor Sort Rush"
      guideHeaderHref="/games/belt-sort"
      guideHeaderLabel="Conveyor Sort Tips"
      accentColor="cyan"
      bgClassName="bg-[#080d24]"
      accentBorderClass="border-sky-400/35"
      accentTextClass="text-sky-300"
    >
      <section className="space-y-4">
        <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
          1. Master the Gold Perfect Zone Risk-Reward Balance
        </h2>
        <p className="typo-body text-sm text-slate-300 leading-relaxed">
          Conveyor Sort Rush awards a flat 10 base points multiplied by your current chain multiplier (up to x5 once you reach 20 consecutive accurate sorts). Waiting until the lead item enters the glowing gold Perfect Zone spanning the final 18% of the conveyor belt doubles that item’s points immediately. At x5 combo, a single well-timed sort climbs from 50 points to 100 points—or 200 points on a Wildcard gold star.
        </p>
        <p className="typo-body text-sm text-slate-300 leading-relaxed">
          The biggest trap for newer players is greedily delaying every sort during dense bursts. When belt travel shrinks toward 1.8 seconds later in Endless runs or during fast five-item spike waves, early accurate clearing beats chasing a borderline Perfect Zone by two frames and risking a missed heart loss that resets your x5 multiplier back to x1.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
          2. Anticipate the Wave Scheduler &amp; Mid-Run Unlocks (25 / 60 Sorts)
        </h2>
        <p className="typo-body text-sm text-slate-300 leading-relaxed">
          Conveyor spawns are structured in deliberate waves rather than chaotic noise: steady streams (6 to 10 spaced pieces), quick pair bursts followed by a 0.9-second rest, short breathers, and sharp five-item spike flurries. Crucially, every intense spike wave is strictly followed by a breather gap—stay calm for five taps and you always get a clean pause afterward to catch your breath.
        </p>
        <p className="typo-body text-sm text-slate-300 leading-relaxed">
          Expect two rhythm shifts as your sort count climbs:
        </p>
        <ul className="space-y-2.5 text-sm text-slate-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
            <span>
              <strong className="text-white">At 25 Sorts (Purple Diamond Bin):</strong> The 4th bin slides in from the right edge and bins re-space to four lanes. On desktop keyboards, rest your pinky lightly over Key 4 or F right around sort 22 so sudden Purple Diamonds never surprise you.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
            <span>
              <strong className="text-white">At 60 Sorts (Wildcard Stars &amp; Freeze Crystals):</strong> Both special items count as correct in any active bin and never break your chain. Route Ice Freeze crystals into whichever bin sits closest to your thumb or active finger to pocket a 3-second full stop.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
          3. Power-Up Economy &amp; 60-Second Daily Run Tactics
        </h2>
        <p className="typo-body text-sm text-slate-300 leading-relaxed">
          You store at most 1 Slow-Mo charge (earned every 10th chain milestone alongside +50 bonus points) and 1 Freeze charge. Because extra milestones while full do not stack a second Slow-Mo, spend your stored Slow-Mo proactively around chain 17 or 27 before the next multiple of 10 refills your slot automatically. On Daily Runs, speed determines total spawns sorted within 60 seconds—chain early items accurately up to x5, hold Freeze only if a dense overlap threatens your hearts, and compare your seeded emoji sort grid at the finish. Check our{' '}
          <Link href="/games-like/conveyor-sort" className="text-sky-300 underline hover:text-sky-200">
            Games Like Conveyor Sort page
          </Link>{' '}
          for more fast reflex sorting details.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="typo-section-heading text-xl sm:text-2xl text-white">
          4. One-Handed Phone Layout vs Desktop Keyboard Bindings
        </h2>
        <p className="typo-body text-sm text-slate-300 leading-relaxed">
          Conveyor Sort Rush adapts cleanly whether you tap during a brief commute or chase high Daily Run accuracy at a desk. On phones held vertically, resting your right or left thumb directly above the chunky 88-pixel-tall color bins keeps reach minimal while shape icons inside each open box distinguish Circle, Square, Triangle, and Diamond purely by silhouette even in bright sunlight or color-vision deficiency.
        </p>
        <p className="typo-body text-sm text-slate-300 leading-relaxed">
          On laptops and mechanical keyboards, placing four fingers across home keys A, S, D, and F (or number keys 1, 2, 3, and 4) eliminates pointer travel completely—letting your left thumb trigger Slow-Mo on Spacebar or E while your index handles Freeze on Q during chaotic post-60 bursts. Practice locking eyes slightly above the gold zone edge rather than watching each bin button animate so your brain pre-reads the incoming queue two pieces ahead.
        </p>
      </section>

      <section className="p-5 rounded-2xl bg-sky-950/35 border border-sky-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-slate-200">
          Ready to test today&apos;s seeded Daily Run belt sequence and stack x5 Perfect Zone chains?
        </p>
        <Link
          href="/games/belt-sort"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-yellow-400 text-slate-950 font-bold text-xs shrink-0 transition-colors text-center"
        >
          Play Conveyor Sort Rush
        </Link>
      </section>
    </ContentArticleShell>
  );
}
