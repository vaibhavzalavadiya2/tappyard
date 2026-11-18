import fs from 'fs';
import path from 'path';

const root = process.cwd();
const appServerDir = path.join(root, '.next/server/app');

// The 9 canonical production URLs and their corresponding built HTML file paths
const TARGET_ROUTES = [
  { url: 'https://tappyard.com/', file: 'index.html' },
  { url: 'https://tappyard.com/games/jelly-bounce', file: 'games/jelly-bounce.html' },
  { url: 'https://tappyard.com/games/2048-puzzle', file: 'games/2048-puzzle.html' },
  { url: 'https://tappyard.com/games/color-zen', file: 'games/color-zen.html' },
  { url: 'https://tappyard.com/games/quick-tap', file: 'games/quick-tap.html' },
  { url: 'https://tappyard.com/guides/2048-strategy', file: 'guides/2048-strategy.html' },
  { url: 'https://tappyard.com/games-like/block-blast', file: 'games-like/block-blast.html' },
  { url: 'https://tappyard.com/games-like/3d-runner-games', file: 'games-like/3d-runner-games.html' },
  { url: 'https://tappyard.com/games-like/flappy-bird', file: 'games-like/flappy-bird.html' },
];

console.log('🔍 Running TAPPYARD SEO Build-Time Audit on compiled HTML...\n');

let hasErrors = false;
const seenTitles = new Map();
const results = [];

for (const target of TARGET_ROUTES) {
  const filePath = path.join(appServerDir, target.file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing compiled HTML file: ${target.file}`);
    hasErrors = true;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Extract <title>
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : '';

  // Extract <meta name="description" content="...">
  const descMatch =
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) ||
    html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i);
  const description = descMatch ? descMatch[1] : '';

  // Extract all <h1> tags
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim()
  );

  const titleLength = title.length;
  const descLength = description.length;
  const h1Count = h1Matches.length;
  const primaryH1 = h1Matches[0] || 'NONE';

  // Rule 1: Title <= 60 characters including brand suffix
  if (titleLength === 0 || titleLength > 60) {
    console.error(`❌ [${target.url}] Title length violation: ${titleLength} chars (max 60): "${title}"`);
    hasErrors = true;
  }

  // Rule 2: Description <= 155 characters
  if (descLength === 0 || descLength > 155) {
    console.error(`❌ [${target.url}] Description length violation: ${descLength} chars (max 155): "${description}"`);
    hasErrors = true;
  }

  // Rule 3: Exactly ONE H1 per page
  if (h1Count !== 1) {
    console.error(`❌ [${target.url}] H1 count violation: found ${h1Count} H1 tags (expected exactly 1): ${JSON.stringify(h1Matches)}`);
    hasErrors = true;
  }

  // Rule 4: No two pages share a title
  if (seenTitles.has(title)) {
    console.error(`❌ Duplicate title detected: "${title}" shared by ${seenTitles.get(title)} and ${target.url}`);
    hasErrors = true;
  } else {
    seenTitles.set(title, target.url);
  }

  results.push({
    route: target.url.replace('https://tappyard.com', '') || '/',
    title,
    titleChars: titleLength,
    description,
    descChars: descLength,
    h1: primaryH1,
    h1Count,
  });
}

console.log('='.repeat(100));
console.log('TAPPYARD PRODUCTION SEO AUDIT TABLE:');
console.log('='.repeat(100));
console.table(
  results.map((r) => ({
    Route: r.route,
    Title: r.title,
    'T-Chars': r.titleChars,
    'D-Chars': r.descChars,
    'H1 Tag': r.h1.slice(0, 45) + (r.h1.length > 45 ? '...' : ''),
    H1s: r.h1Count,
  }))
);

if (hasErrors) {
  console.error('\n🚨 SEO Build-Time Audit FAILED! Check error messages above.');
  process.exit(1);
} else {
  console.log('\n✅ All 9 canonical routes passed 100% of SEO metadata, character count, and single-H1 constraints!');
  process.exit(0);
}
