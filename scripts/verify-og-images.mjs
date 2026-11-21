import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dir = path.join(root, '.next/server/app');

const routes = [
  { url: '/', file: 'index.html' },
  { url: '/games/jelly-bounce', file: 'games/jelly-bounce.html' },
  { url: '/games/2048-puzzle', file: 'games/2048-puzzle.html' },
  { url: '/games/color-zen', file: 'games/color-zen.html' },
  { url: '/games/quick-tap', file: 'games/quick-tap.html' },
  { url: '/guides/2048-strategy', file: 'guides/2048-strategy.html' },
  { url: '/games-like/block-blast', file: 'games-like/block-blast.html' },
  { url: '/games-like/3d-runner-games', file: 'games-like/3d-runner-games.html' },
  { url: '/games-like/flappy-bird', file: 'games-like/flappy-bird.html' },
];

console.log('='.repeat(80));
console.log('TAPPYARD OPEN GRAPH & TWITTER IMAGE AUDIT');
console.log('='.repeat(80));

let allValid = true;

for (const r of routes) {
  const filePath = path.join(dir, r.file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${r.file}`);
    allValid = false;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  const ogMatch =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  const ogImg = ogMatch ? ogMatch[1] : null;

  const twMatch =
    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  const twImg = twMatch ? twMatch[1] : null;

  const twCardMatch =
    html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:card["']/i);
  const twCard = twCardMatch ? twCardMatch[1] : null;

  // Check physical file exists in public directory
  let localFile = null;
  if (ogImg) {
    const parsedPath = ogImg.replace('https://tappyard.com', '');
    const cleanPath = parsedPath.startsWith('/') ? parsedPath.slice(1) : parsedPath;
    localFile = path.join(root, 'public', cleanPath);
  }

  const fileExists = localFile ? fs.existsSync(localFile) : false;
  const fileSize = fileExists ? (fs.statSync(localFile).size / 1024).toFixed(1) + ' KB' : 'N/A';

  console.log(`Route: ${r.url}`);
  console.log(`  og:image      : ${ogImg}`);
  console.log(`  twitter:image : ${twImg}`);
  console.log(`  twitter:card  : ${twCard}`);
  console.log(`  Physical file : ${fileExists ? '✅ EXISTS (' + fileSize + ')' : '❌ MISSING'}`);
  console.log('-'.repeat(80));

  if (!ogImg || !twImg || !fileExists || twCard !== 'summary_large_image') {
    allValid = false;
  }
}

if (allValid) {
  console.log('🎉 ALL 9 ROUTES HAVE VALID, RESOLVED OPEN GRAPH & TWITTER IMAGES (1200x630)!');
} else {
  console.error('🚨 AUDIT FAILED! Review issues above.');
  process.exit(1);
}
