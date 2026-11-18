import fs from 'fs';
import path from 'path';

const root = process.cwd();
const appServerDir = path.join(root, '.next/server/app');

const PAGES_TO_VERIFY = [
  {
    route: '/',
    file: 'index.html',
    expectedH1: 'Free Online Browser Games: Play Instantly, No Download',
    expectedTexts: [
      'Welcome to TAPPYARD',
      'Jump Jelly Jump! - 3D endless runner',
      '2048 Neon Fusion - 2048 number puzzle',
      'Block Grid Zen - 10x10 block puzzle',
      'Cyber Dash - 1-tap reflex flyer',
      '3D Arcade Runners',
      'Brain & Math Puzzles',
      'Relaxing Stress Relief Games',
      '1-Tap Reflex & Rhythm Games',
      'Are all games on TAPPYARD completely free to play?',
      'What are good quick games to play when bored?',
    ],
    checkJsonLd: ['WebSite', 'ItemList', 'FAQPage'],
  },
  {
    route: '/games/jelly-bounce',
    file: 'games/jelly-bounce.html',
    expectedH1: 'Jump Jelly Jump!',
    expectedTexts: [
      'A free 3D endless runner you can play in your browser',
      'How to Play',
      'booster chevron pads',
      'Controls',
      'Gameplay Tips',
      'Play Next',
      'Frequently Asked Questions',
      'About This Game',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList', 'FAQPage', 'VideoGame'],
  },
  {
    route: '/games/2048-puzzle',
    file: 'games/2048-puzzle.html',
    expectedH1: '2048 Neon Fusion',
    expectedTexts: [
      'Play 2048 unblocked and free in your browser',
      'How to Play',
      'Controls',
      'Gameplay Tips',
      'Play Next',
      'Frequently Asked Questions',
      'About This Game',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList', 'FAQPage', 'VideoGame'],
  },
  {
    route: '/games/color-zen',
    file: 'games/color-zen.html',
    expectedH1: 'Block Grid Zen',
    expectedTexts: [
      'A free 10x10 block puzzle you can play online',
      'How to Play',
      'Controls',
      'Gameplay Tips',
      'Play Next',
      'Frequently Asked Questions',
      'About This Game',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList', 'FAQPage', 'VideoGame'],
  },
  {
    route: '/games/quick-tap',
    file: 'games/quick-tap.html',
    expectedH1: 'Cyber Dash',
    expectedTexts: [
      'A free 1-tap neon reflex game you can play online',
      'How to Play',
      'Controls',
      'Gameplay Tips',
      'Play Next',
      'Frequently Asked Questions',
      'About This Game',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList', 'FAQPage', 'VideoGame'],
  },
  {
    route: '/guides/2048-strategy',
    file: 'guides/2048-strategy.html',
    expectedH1: '2048 Strategy: How to Win 2048 (Tips and Tricks)',
    expectedTexts: [
      'The 2048 Corner Strategy',
      'Build Monotonic Chains',
      'The Three-Direction Rule',
      'What Happens After 2048',
      '2048 Neon Fusion',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList'],
  },
  {
    route: '/games-like/block-blast',
    file: 'games-like/block-blast.html',
    expectedH1: 'Games Like Block Blast: Free Block Puzzle in Your Browser',
    expectedTexts: [
      'Feature Comparison: Block Blast vs. Block Grid Zen',
      '10x10 Spatial Matrix',
      'How to Score 2,000+ Points in 10x10 Block Puzzles',
      'Play Block Grid Zen',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList'],
  },
  {
    route: '/games-like/3d-runner-games',
    file: 'games-like/3d-runner-games.html',
    expectedH1: 'Games Like Run 3, Slope and Subway Surfers: Free 3D Runners',
    expectedTexts: [
      'How Jump Jelly Jump! Compares to Popular 3D Runners',
      'Chevron Booster Pads',
      'Four Dynamic Thematic Zones',
      'Play Jump Jelly Jump!',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList'],
  },
  {
    route: '/games-like/flappy-bird',
    file: 'games-like/flappy-bird.html',
    expectedH1: 'Games Like Flappy Bird: Free 1-Tap Games in Your Browser',
    expectedTexts: [
      'Feature Comparison: Flappy Bird vs. Cyber Dash',
      'High-Reward Close Grazing',
      '2.5-Second Protective Shields',
      'Play Cyber Dash',
      'Back to TAPPYARD',
    ],
    checkJsonLd: ['BreadcrumbList'],
  },
];

console.log('🔍 Auditing Server-Rendered HTML & JSON-LD across all 9 canonical routes...\n');

let allPassed = true;

for (const p of PAGES_TO_VERIFY) {
  const filePath = path.join(appServerDir, p.file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ [${p.route}] File not found on disk: ${filePath}`);
    allPassed = false;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Verify H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const actualH1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
  if (actualH1 !== p.expectedH1) {
    console.error(`❌ [${p.route}] H1 mismatch! Expected "${p.expectedH1}", got "${actualH1}"`);
    allPassed = false;
  } else {
    console.log(`✓ [${p.route}] H1 verified: "${actualH1}"`);
  }

  // 2. Verify expected text strings are present in server HTML
  const decodedHtml = html.replace(/&amp;/g, '&');
  for (const text of p.expectedTexts) {
    if (!decodedHtml.includes(text)) {
      console.error(`❌ [${p.route}] Missing expected text in server HTML: "${text}"`);
      allPassed = false;
    }
  }

  // 3. Verify JSON-LD scripts are valid JSON and contain expected types
  const jsonLdScripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const parsedTypes = [];
  for (const m of jsonLdScripts) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type']) parsedTypes.push(data['@type']);
    } catch (err) {
      console.error(`❌ [${p.route}] Corrupted JSON-LD script:`, err.message);
      allPassed = false;
    }
  }

  for (const expectedType of p.checkJsonLd) {
    if (!parsedTypes.includes(expectedType)) {
      console.error(`❌ [${p.route}] Missing expected JSON-LD schema type: ${expectedType}. Found: ${parsedTypes.join(', ')}`);
      allPassed = false;
    }
  }
}

if (!allPassed) {
  console.error('\n❌ Server-rendered HTML / JSON-LD audit failed.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL 9 ROUTES VERIFIED: 100% server-rendered HTML, valid JSON-LD, exact H1s, and rich copy!');
  process.exit(0);
}
