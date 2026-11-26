import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = process.cwd();

/**
 * In-memory TypeScript loader for unit-testing Next.js lib/data/app modules cleanly.
 */
function createTsLoader() {
  const cache = new Map();

  function resolveTarget(specifier, fromFile) {
    let basePath;
    if (specifier.startsWith('@/')) {
      basePath = path.join(root, specifier.slice(2));
    } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
      basePath = path.resolve(path.dirname(fromFile), specifier);
    } else {
      return null;
    }

    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      path.join(basePath, 'index.ts'),
      path.join(basePath, 'index.tsx'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        return c;
      }
    }
    throw new Error(`Cannot resolve TS import "${specifier}" from ${fromFile}`);
  }

  return function loadTs(filePath) {
    const absPath = path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
    if (cache.has(absPath)) return cache.get(absPath);

    const source = fs.readFileSync(absPath, 'utf8');
    const transpiled = ts.transpileModule(source, {
      fileName: absPath,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        strict: true,
      },
    });

    const moduleObj = { exports: {} };
    cache.set(absPath, moduleObj.exports);

    const localRequire = (specifier) => {
      const resolved = resolveTarget(specifier, absPath);
      if (resolved) return loadTs(resolved);
      return require(specifier);
    };

    const wrapped = `(function(exports, require, module, __filename, __dirname) {\n${transpiled.outputText}\n})`;
    const fn = vm.runInThisContext(wrapped, { filename: absPath });
    fn(moduleObj.exports, localRequire, moduleObj, absPath, path.dirname(absPath));
    cache.set(absPath, moduleObj.exports);
    return moduleObj.exports;
  };
}

const loadTs = createTsLoader();
const { GAMES_CATALOGUE } = loadTs('data/games.ts');
const { HOME_FAQS, SITE_URL } = loadTs('data/homeFaqs.ts');
const { buildSitemapEntries } = loadTs('lib/seoRoutes.ts');
const robotsMod = loadTs('app/robots.ts');
const structuredData = loadTs('lib/structuredData.ts');

let failures = 0;
function check(label, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${label}`);
  } catch (err) {
    failures += 1;
    console.error(`❌ FAIL: ${label}\n   ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log('='.repeat(90));
console.log('TAPPYARD SEO, TRUST POLICY & STRUCTURED DATA SUITE');
console.log('='.repeat(90));

// 1. Sitemap Unit Checks
check('Sitemap generates from catalogue cleanly with zero duplicates, no changefreq/priority, real distinct lastmod, and excludes noindex', () => {
  const entries = buildSitemapEntries();
  assert.ok(entries.length >= 20, `Expected >= 20 sitemap URLs, found ${entries.length}`);

  const seen = new Set();
  const distinctDates = new Set();
  for (const e of entries) {
    assert.ok(e.url.startsWith(SITE_URL), `Unexpected URL domain: ${e.url}`);
    assert.equal(seen.has(e.url), false, `Duplicate URL found: ${e.url}`);
    seen.add(e.url);
    assert.equal('changeFrequency' in e, false, `changeFrequency must be omitted on ${e.url}`);
    assert.equal('changefreq' in e, false, `changefreq must be omitted on ${e.url}`);
    assert.equal('priority' in e, false, `priority must be omitted on ${e.url}`);
    assert.ok(e.lastModified instanceof Date && !Number.isNaN(e.lastModified.getTime()), `Invalid lastModified on ${e.url}`);
    distinctDates.add(e.lastModified.toISOString());
  }
  assert.ok(distinctDates.size > 1, 'Sitemap lastmod dates must vary per page, not share one date');

  // Required routes check
  for (const game of GAMES_CATALOGUE) {
    assert.ok(seen.has(`${SITE_URL}${game.route}`), `Catalogue game missing from sitemap: ${game.route}`);
  }
  for (const slug of ['arcade', 'puzzle', 'relaxing', 'casual']) {
    assert.ok(seen.has(`${SITE_URL}/category/${slug}`), `Missing category in sitemap: /category/${slug}`);
  }
  for (const p of ['/about', '/contact', '/privacy', '/terms', '/guides/2048-strategy', '/guides/cupcake-2048-strategy', '/guides/conveyor-sort-tips', '/games-like/2048', '/games-like/slope', '/games-like/tetris', '/games-like/conveyor-sort', '/games-like/block-blast', '/games-like/3d-runner-games', '/games-like/flappy-bird']) {
    assert.ok(seen.has(`${SITE_URL}${p}`), `Missing route in sitemap: ${p}`);
  }

  // Build-time duplicate assertion check
  assert.throws(
    () => buildSitemapEntries([...GAMES_CATALOGUE, GAMES_CATALOGUE[0]]),
    /Duplicate sitemap URL/
  );

  // noindex exclusion check
  const withNoindex = buildSitemapEntries(GAMES_CATALOGUE, [
    { path: '/hidden-test', updatedAt: '2026-11-26', noindex: true },
  ]);
  assert.equal(withNoindex.some((e) => e.url.endsWith('/hidden-test')), false);
});

// 2. Robots.txt Unit Checks
check('robots.ts allows /_next/ (does not disallow it), keeps /api/, sitemap, and AI crawlers', () => {
  const r = robotsMod.default();
  assert.equal(r.sitemap, `${SITE_URL}/sitemap.xml`);
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
  assert.ok(rules.length >= 2, 'Expected general wildcard rule plus AI crawler rule');
  for (const rule of rules) {
    const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
    assert.ok(disallows.includes('/api/'), 'Expected /api/ to stay disallowed');
    for (const d of disallows) {
      assert.equal(String(d).includes('_next'), false, `Found forbidden _next disallow rule: ${d}`);
    }
  }
});

// 3. Structured Data JSON-LD Builders Checks
check('JSON-LD builders output required schema fields and ZERO aggregateRating / Review / rating fields', () => {
  const ws = structuredData.buildWebSiteJsonLd();
  const org = structuredData.buildOrganizationJsonLd();
  const vg = structuredData.buildVideoGameJsonLd({
    name: 'Conveyor Sort Rush',
    description: 'Shape sorting arcade game.',
    url: `${SITE_URL}/games/belt-sort`,
    genre: 'Casual',
  });
  const faq = structuredData.buildFaqJsonLd(HOME_FAQS);
  const bc = structuredData.buildBreadcrumbJsonLd([
    { name: 'TAPPYARD', url: SITE_URL },
    { name: 'Casual', url: `${SITE_URL}/category/casual` },
  ]);

  assert.equal(ws['@type'], 'WebSite');
  assert.ok(ws.name && ws.url);

  assert.equal(org['@type'], 'Organization');
  assert.ok(org.name && org.url && org.logo);

  assert.equal(vg['@type'], 'VideoGame');
  for (const field of ['name', 'description', 'url', 'genre', 'gamePlatform', 'applicationCategory', 'operatingSystem', 'offers', 'inLanguage']) {
    assert.ok(vg[field] !== undefined, `Missing VideoGame field: ${field}`);
  }
  assert.equal(vg.offers.price, '0');
  assert.equal(vg.offers.priceCurrency, 'USD');

  assert.equal(faq['@type'], 'FAQPage');
  assert.equal(faq.mainEntity.length, HOME_FAQS.length);

  assert.equal(bc['@type'], 'BreadcrumbList');
  assert.equal(bc.itemListElement.length, 2);

  const combinedJson = JSON.stringify({ ws, org, vg, faq, bc });
  for (const forbidden of ['aggregateRating', 'ratingValue', 'ratingCount', 'reviewCount', '"Review"']) {
    assert.equal(combinedJson.includes(forbidden), false, `Forbidden schema key in JSON-LD: ${forbidden}`);
  }
});

// 4. Compiled Next.js Output HTML + Metadata + Trust Audit
const appServerDir = path.join(root, '.next', 'server', 'app');

const HTML_ROUTES = [
  { route: '/', file: 'index.html', minWords: 150 },
  { route: '/about', file: 'about.html', minWords: 100 },
  { route: '/contact', file: 'contact.html', minWords: 100 },
  { route: '/privacy', file: 'privacy.html', minWords: 100 },
  { route: '/terms', file: 'terms.html', minWords: 100 },
  { route: '/category/arcade', file: 'category/arcade.html', minWords: 120 },
  { route: '/category/puzzle', file: 'category/puzzle.html', minWords: 120 },
  { route: '/category/relaxing', file: 'category/relaxing.html', minWords: 120 },
  { route: '/category/casual', file: 'category/casual.html', minWords: 120 },
  { route: '/games/jelly-bounce', file: 'games/jelly-bounce.html', minWords: 150 },
  { route: '/games/belt-sort', file: 'games/belt-sort.html', minWords: 150 },
  { route: '/games/2048-puzzle', file: 'games/2048-puzzle.html', minWords: 150 },
  { route: '/games/color-zen', file: 'games/color-zen.html', minWords: 150 },
  { route: '/games/quick-tap', file: 'games/quick-tap.html', minWords: 150 },
  { route: '/games/cupcake-2048', file: 'games/cupcake-2048.html', minWords: 150 },
  { route: '/guides/2048-strategy', file: 'guides/2048-strategy.html', minWords: 450 },
  { route: '/guides/cupcake-2048-strategy', file: 'guides/cupcake-2048-strategy.html', minWords: 500 },
  { route: '/guides/conveyor-sort-tips', file: 'guides/conveyor-sort-tips.html', minWords: 500 },
  { route: '/games-like/block-blast', file: 'games-like/block-blast.html', minWords: 400 },
  { route: '/games-like/3d-runner-games', file: 'games-like/3d-runner-games.html', minWords: 400 },
  { route: '/games-like/flappy-bird', file: 'games-like/flappy-bird.html', minWords: 400 },
  { route: '/games-like/conveyor-sort', file: 'games-like/conveyor-sort.html', minWords: 200 },
  { route: '/games-like/2048', file: 'games-like/2048.html', minWords: 500 },
  { route: '/games-like/slope', file: 'games-like/slope.html', minWords: 500 },
  { route: '/games-like/tetris', file: 'games-like/tetris.html', minWords: 500 },
];

function stripTagsToWords(html) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ');
  return withoutScripts.trim().split(/\s+/).filter(Boolean);
}

function getMetaContent(html, attrName, attrVal) {
  const r1 = new RegExp(`<meta[^>]+${attrName}=["']${attrVal}["'][^>]+content=["']([^"']*)["']`, 'i');
  const r2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attrName}=["']${attrVal}["']`, 'i');
  const m = html.match(r1) || html.match(r2);
  return m ? m[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"') : '';
}

check('Compiled HTML across all 25 routes satisfies title (50-60), description (140-155), uniqueness, canonical, OG/Twitter, H1, word counts, and zero ratings/plays', () => {
  assert.ok(fs.existsSync(appServerDir), `Missing Next build output at ${appServerDir}. Run "next build" first.`);

  const seenTitles = new Map();
  const seenDescs = new Map();
  const tableRows = [];
  const routeErrors = [];

  for (const item of HTML_ROUTES) {
    const filePath = path.join(appServerDir, item.file);
    if (!fs.existsSync(filePath)) {
      routeErrors.push(`Missing built HTML: ${item.file}`);
      continue;
    }
    const html = fs.readFileSync(filePath, 'utf8');

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : '';
    const desc = getMetaContent(html, 'name', 'description');
    const canonicalMatch =
      html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : '';
    const ogTitle = getMetaContent(html, 'property', 'og:title');
    const ogDesc = getMetaContent(html, 'property', 'og:description');
    const ogImg = getMetaContent(html, 'property', 'og:image');
    const twCard = getMetaContent(html, 'name', 'twitter:card');

    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim()
    );

    if (title.length < 50 || title.length > 60) {
      routeErrors.push(`[${item.route}] Title length ${title.length} outside 50-60: "${title}"`);
    }
    if (desc.length < 140 || desc.length > 155) {
      routeErrors.push(`[${item.route}] Description length ${desc.length} outside 140-155: "${desc}"`);
    }
    if (!canonical.startsWith(SITE_URL)) {
      routeErrors.push(`[${item.route}] Missing or invalid canonical: "${canonical}"`);
    }
    if (!ogTitle || !ogDesc || !ogImg) {
      routeErrors.push(`[${item.route}] Missing OpenGraph metadata`);
    }
    if (twCard !== 'summary_large_image') {
      routeErrors.push(`[${item.route}] Missing twitter:card`);
    }
    if (h1s.length !== 1) {
      routeErrors.push(`[${item.route}] Expected 1 H1, got ${h1s.length}`);
    }

    if (seenTitles.has(title)) {
      routeErrors.push(`Duplicate title "${title}" between ${seenTitles.get(title)} and ${item.route}`);
    } else {
      seenTitles.set(title, item.route);
    }
    if (seenDescs.has(desc)) {
      routeErrors.push(`Duplicate description between ${seenDescs.get(desc)} and ${item.route}`);
    } else {
      seenDescs.set(desc, item.route);
    }

    if (/<meta[^>]+name=["']keywords["']/i.test(html)) {
      routeErrors.push(`[${item.route}] Forbidden <meta name="keywords"> tag found`);
    }

    for (const forbidden of ['aggregateRating', 'ratingValue', 'ratingCount', 'reviewCount', '"@type":"Review"', 'Phaser 3D', 'Four original']) {
      if (html.includes(forbidden)) {
        routeErrors.push(`[${item.route}] Forbidden string "${forbidden}" found in rendered output`);
      }
    }

    const words = stripTagsToWords(html);
    const bodyText = words.join(' ');
    if (/\bplays\b/i.test(bodyText)) {
      routeErrors.push(`[${item.route}] Forbidden word "plays" found in rendered HTML`);
    }
    if (/\b4\s+games\b/i.test(bodyText)) {
      routeErrors.push(`[${item.route}] Forbidden string "4 games" found`);
    }
    if (words.length < item.minWords) {
      routeErrors.push(`[${item.route}] Word count ${words.length} < required ${item.minWords}`);
    }

    const relOg = ogImg.replace(SITE_URL, '').replace(/^\/+/, '');
    const ogDiskPath = path.join(root, 'public', relOg);
    const ogExists = ogImg && fs.existsSync(ogDiskPath);
    const ogBytes = ogExists ? fs.statSync(ogDiskPath).size : 0;
    if (!ogExists) {
      routeErrors.push(`[${item.route}] Missing OG file ${ogDiskPath}`);
    } else if (ogBytes >= 300 * 1024) {
      routeErrors.push(`[${item.route}] OG image ${relOg} is ${(ogBytes / 1024).toFixed(1)} KB (>= 300 KB)`);
    }

    tableRows.push({
      Route: item.route,
      TitleChars: title.length,
      DescChars: desc.length,
      H1s: h1s.length,
      Words: words.length,
      OgKB: Number((ogBytes / 1024).toFixed(1)),
    });
  }

  console.table(tableRows);
  assert.equal(routeErrors.length, 0, routeErrors.join('\n   '));
});

// 5. Verify built robots.txt / sitemap.xml outputs if generated by Next
check('Built robots and sitemap artifacts contain valid outputs', () => {
  const builtRobotsPath = path.join(appServerDir, 'robots.txt.body');
  if (fs.existsSync(builtRobotsPath)) {
    const robotsTxt = fs.readFileSync(builtRobotsPath, 'utf8');
    assert.equal(robotsTxt.includes('/_next/'), false, 'Built robots.txt still contains /_next/');
    assert.ok(robotsTxt.includes('Disallow: /api/'));
  }
  const builtSitemapPath = path.join(appServerDir, 'sitemap.xml.body');
  if (fs.existsSync(builtSitemapPath)) {
    const xml = fs.readFileSync(builtSitemapPath, 'utf8');
    assert.equal(xml.includes('<changefreq>'), false, 'Built sitemap.xml contains <changefreq>');
    assert.equal(xml.includes('<priority>'), false, 'Built sitemap.xml contains <priority>');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.equal(new Set(locs).size, locs.length, 'Built sitemap.xml contains duplicate <loc> entries');
  }
});

if (failures > 0) {
  console.error(`\n🚨 TAPPYARD seo:check failed with ${failures} error(s).`);
  process.exit(1);
}

console.log('\n🎉 All TAPPYARD unit, metadata, schema, policy, sitemap, and robots checks passed!');
