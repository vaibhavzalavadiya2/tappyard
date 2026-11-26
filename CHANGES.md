# TAPPYARD Technical & SEO Fixes (`CHANGES.md`)

Summary of all trust, technical SEO, structured data, performance, internal linking, and build-verification improvements applied across TAPPYARD (`tappyard.com`).

---

## 1. Trust & Policy Cleanup (Zero Fake Ratings, Reviews, or Play Counts)
- **What changed:**
  - Removed hardcoded `ratingValue: '4.9'` and `reviewCount: '184'` `aggregateRating` JSON-LD from [`CupcakeContentBelowFold.tsx`](file:///C:/Projects/tappyard/components/games/Cupcake2048/CupcakeContentBelowFold.tsx).
  - Removed `rating` and `playsCount` fields from `GameItem` and all catalogue objects in [`data/games.ts`](file:///C:/Projects/tappyard/data/games.ts), keeping clean plain badges (`Original` / `NEW`).
  - Removed star ratings and `"plays"` strings from [`GameCard.tsx`](file:///C:/Projects/tappyard/components/tappyard/GameCard.tsx), [`HeroFeatured.tsx`](file:///C:/Projects/tappyard/components/tappyard/HeroFeatured.tsx), and [`MobileDrawer.tsx`](file:///C:/Projects/tappyard/components/tappyard/MobileDrawer.tsx), and adjusted `"everyone plays"` phrasing in [`data/gameContent.ts`](file:///C:/Projects/tappyard/data/gameContent.ts).
- **How to verify:** Run `npm run seo:check` — asserts zero `aggregateRating`, `ratingValue`, `ratingCount`, `reviewCount`, `"Review"`, or `\bplays\b` tokens in every built route's HTML and JSON-LD.

## 2. Dynamic Deduplicated Sitemap (`sitemap.xml`)
- **What changed:**
  - Built [`buildSitemapEntries()`](file:///C:/Projects/tappyard/lib/seoRoutes.ts) consumed directly by [`app/sitemap.ts`](file:///C:/Projects/tappyard/app/sitemap.ts) so games come automatically from `GAMES_CATALOGUE` (`data/games.ts`), deduplicated (removed duplicate `/games/cupcake-2048`), excluding `noindex` routes, omitting ignored `changefreq` and `priority` tags, using distinct per-page `updatedAt` ISO dates (`lastModified`), and throwing a build-time error if duplicates occur.
- **How to verify:** Run `npm run seo:check` (tests `buildSitemapEntries()` directly + inspects built `.next/server/app/sitemap.xml.body`).

## 3. Robots.txt Crawling Access
- **What changed:**
  - Removed `Disallow: /_next/` from both the wildcard rule and AI crawler rules in [`app/robots.ts`](file:///C:/Projects/tappyard/app/robots.ts) while keeping `Disallow: /api/`, `sitemap`, and all existing AI bot allow rules intact.
- **How to verify:** Run `npm run seo:check` or view `/robots.txt`.

## 4. Updated Copy, Catalogue-Driven Lists & Metadata Hygiene
- **What changed:**
  - Removed stale `"four main game genres"` and `"Phaser 3D"` strings from [`HomeClient.tsx`](file:///C:/Projects/tappyard/components/tappyard/HomeClient.tsx), [`Footer.tsx`](file:///C:/Projects/tappyard/components/tappyard/Footer.tsx), [`HeroFeatured.tsx`](file:///C:/Projects/tappyard/components/tappyard/HeroFeatured.tsx), [`public/llms.txt`](file:///C:/Projects/tappyard/public/llms.txt), and [`public/llms-full.txt`](file:///C:/Projects/tappyard/public/llms-full.txt) (accurately describing `HTML5 Canvas & WebGL via Phaser`).
  - Drove Home Page genre sections (`Arcade`, `Puzzle`, `Relaxing`, `Casual`) and Footer **Popular Games** / **Game Genres** lists directly from `GAMES_CATALOGUE` & `GAME_CATEGORIES` (`Cupcake 2048` and `Conveyor Sort Rush` now render automatically).
  - Removed `keywords` metadata arrays across all pages (`app/layout.tsx`, `app/page.tsx`, `app/games/*`, `app/guides/*`, `app/games-like/*`).
- **How to verify:** Run `npm run seo:check`.

## 5. Clean Server-Rendered Structured Data (`lib/structuredData.ts`)
- **What changed:**
  - Centralized `buildWebSiteJsonLd`, `buildOrganizationJsonLd`, `buildVideoGameJsonLd`, `buildFaqJsonLd`, `buildBreadcrumbJsonLd`, and `buildArticleJsonLd` in [`lib/structuredData.ts`](file:///C:/Projects/tappyard/lib/structuredData.ts).
  - Home page ([`app/page.tsx`](file:///C:/Projects/tappyard/app/page.tsx)) renders `WebSite`, `Organization`, and `FAQPage` sourced from shared [`HOME_FAQS`](file:///C:/Projects/tappyard/data/homeFaqs.ts) (matching rendered copy verbatim).
  - All game pages render clean `VideoGame`, `BreadcrumbList`, and `FAQPage` JSON-LD without any rating objects.
- **How to verify:** `npm run seo:check` validates every JSON-LD builder and all HTML outputs.

## 6. Page Metadata & Build-Time Validation
- **What changed:**
  - Standardized all 25 routes to unique `50–60` character `<title>` values, unique `140–155` character descriptions (including Conveyor Sort Rush), `alternates.canonical`, Open Graph, and Twitter card metadata.
  - Wired `node scripts/seo-check.mjs` directly into `npm run build` in [`package.json`](file:///C:/Projects/tappyard/package.json) so invalid or duplicate titles/descriptions fail the build automatically.
- **How to verify:** `npm run build` & `npm run seo:check`.

## 7. Trust Pages & Footer Links (`/about`, `/contact`, `/privacy`, `/terms`)
- **What changed:**
  - Created [`app/about/page.tsx`](file:///C:/Projects/tappyard/app/about/page.tsx) and [`app/contact/page.tsx`](file:///C:/Projects/tappyard/app/contact/page.tsx) (reading `process.env.CONTACT_EMAIL`).
  - Updated [`app/privacy/page.tsx`](file:///C:/Projects/tappyard/app/privacy/page.tsx) (documenting `localStorage` keys and existing Google Analytics / Microsoft Clarity telemetry) and [`app/terms/page.tsx`](file:///C:/Projects/tappyard/app/terms/page.tsx) with `<Footer />` and `CONTACT_EMAIL`.
  - Linked all four pages in [`Footer.tsx`](file:///C:/Projects/tappyard/components/tappyard/Footer.tsx) and registered them in `buildSitemapEntries()`.
- **How to verify:** Visit `/about`, `/contact`, `/privacy`, `/terms` or inspect build check table in `npm run seo:check`.

## 8. Real Category Pages
- **What changed:**
  - Created [`app/category/[slug]/page.tsx`](file:///C:/Projects/tappyard/app/category/[slug]/page.tsx) for `/category/arcade`, `/category/puzzle`, `/category/relaxing`, and `/category/casual` (`120+` words intro, catalogue game grid, `BreadcrumbList`, category switcher, and `<Footer />`).
  - Updated Footer, Home genre links, and Breadcrumbs in [`GameContentBelowFold.tsx`](file:///C:/Projects/tappyard/components/tappyard/GameContentBelowFold.tsx) & [`CupcakeContentBelowFold.tsx`](file:///C:/Projects/tappyard/components/games/Cupcake2048/CupcakeContentBelowFold.tsx) to link directly to `/category/*`.
- **How to verify:** `npm run seo:check`.

## 9. Internal Linking & 5 New Content Pages (500+ Words Each)
- **What changed:**
  - Added [`ContentArticleShell.tsx`](file:///C:/Projects/tappyard/components/tappyard/ContentArticleShell.tsx) and published 5 new 500+ word guides/collections:
    - [`app/games-like/2048/page.tsx`](file:///C:/Projects/tappyard/app/games-like/2048/page.tsx)
    - [`app/games-like/slope/page.tsx`](file:///C:/Projects/tappyard/app/games-like/slope/page.tsx)
    - [`app/games-like/tetris/page.tsx`](file:///C:/Projects/tappyard/app/games-like/tetris/page.tsx)
    - [`app/guides/cupcake-2048-strategy/page.tsx`](file:///C:/Projects/tappyard/app/guides/cupcake-2048-strategy/page.tsx)
    - [`app/guides/conveyor-sort-tips/page.tsx`](file:///C:/Projects/tappyard/app/guides/conveyor-sort-tips/page.tsx)
  - Updated every game page (`GameContentBelowFold.tsx`, `CupcakeContentBelowFold.tsx`) to display **3 Related Games**, links to its matching guide/`games-like` page, and a bottom **"More games on TAPPYARD"** catalogue strip.
- **How to verify:** `npm run seo:check` verifies word counts (`>= 500` words on each new guide/collection page), schemas, and metadata.

## 10. Performance, Code Splitting & 404 Navigation
- **What changed:**
  - Switched dedicated `app/games/*/page.tsx` routes to load interactive client bundles via `next/dynamic` while keeping SSR HTML (`<h1>`, rules, FAQs, JSON-LD) server-rendered on the initial response.
  - Added explicit `width={40}` `height={40}` on avatar `<img>` in [`AccountModal.tsx`](file:///C:/Projects/tappyard/components/tappyard/AccountModal.tsx), enforced `< 300 KB` OG images, and updated [`app/not-found.tsx`](file:///C:/Projects/tappyard/app/not-found.tsx) with category + game links.
- **How to verify:** `npm run build`, `npm run seo:check`, and `npm run test:beltsort`.
