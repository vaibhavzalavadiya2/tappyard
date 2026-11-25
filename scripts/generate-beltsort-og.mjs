import path from 'path';
import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6ec6ff" />
      <stop offset="60%" stop-color="#5c7bf5" />
      <stop offset="100%" stop-color="#162468" />
    </linearGradient>
    <linearGradient id="belt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4c526b" />
      <stop offset="100%" stop-color="#2d3242" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff59e" />
      <stop offset="50%" stop-color="#ffd23f" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#sky)" />

  <!-- Top Brand & Tag -->
  <g transform="translate(70, 48)">
    <rect width="190" height="44" rx="22" fill="#0b1233" stroke="#5aa9ff" stroke-width="2" />
    <circle cx="28" cy="22" r="7" fill="#ffd23f" />
    <text x="48" y="28" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" letter-spacing="2">TAPPYARD</text>
  </g>
  <g transform="translate(910, 48)">
    <rect width="220" height="44" rx="22" fill="#0b1233" stroke="#ffd23f" stroke-width="2" />
    <text x="110" y="28" text-anchor="middle" fill="#ffe36e" font-family="system-ui, sans-serif" font-weight="800" font-size="14" letter-spacing="1">DAILY &amp; ENDLESS</text>
  </g>

  <!-- Title -->
  <text x="600" y="160" text-anchor="middle" fill="url(#goldGrad)" stroke="#09123a" stroke-width="6" paint-order="stroke" font-family="system-ui, Arial Black, sans-serif" font-weight="900" font-size="68">CONVEYOR SORT RUSH</text>
  <text x="600" y="205" text-anchor="middle" fill="#ffffff" stroke="#09123a" stroke-width="3" paint-order="stroke" font-family="system-ui, sans-serif" font-weight="700" font-size="24">Tap Matching Bins • x2 Perfect Zone • Slow-Mo &amp; Freeze Power-Ups</text>

  <!-- Perspective Belt Centerpiece -->
  <polygon points="440,235 760,235 885,495 315,495" fill="url(#belt)" />
  <polygon points="424,235 440,235 315,495 292,495" fill="#a78bfa" />
  <polygon points="760,235 776,235 908,495 885,495" fill="#a78bfa" />
  <polygon points="340,435 860,435 885,495 315,495" fill="url(#goldGrad)" />
  <text x="600" y="472" text-anchor="middle" fill="#362100" font-family="system-ui, sans-serif" font-weight="900" font-size="20">Perfect Zone! x2 Points</text>

  <!-- Shapes on Belt -->
  <path d="M600 250 L628 274 L600 298 L572 274 Z" fill="#8a3ffc" stroke="#d4b5ff" stroke-width="3" />
  <polygon points="600,305 636,356 564,356" fill="#ff3b30" stroke="#ffa19c" stroke-width="3" />
  <rect x="558" y="365" width="84" height="52" rx="12" fill="#2fbf4a" stroke="#9cf5a8" stroke-width="3" />
  <ellipse cx="600" cy="442" rx="44" ry="30" fill="#2f6bff" stroke="#92c2ff" stroke-width="3" />

  <!-- 4 Glossy Bins Bottom -->
  <g transform="translate(295, 505)">
    <rect x="0" y="0" width="138" height="86" rx="16" fill="#2f6bff" stroke="#92c2ff" stroke-width="3" />
    <circle cx="69" cy="48" r="22" fill="#ffffff" />

    <rect x="157" y="0" width="138" height="86" rx="16" fill="#2fbf4a" stroke="#9cf5a8" stroke-width="3" />
    <rect x="206" y="28" width="40" height="40" rx="8" fill="#ffffff" />

    <rect x="314" y="0" width="138" height="86" rx="16" fill="#ff3b30" stroke="#ffa19c" stroke-width="3" />
    <polygon points="383,26 406,68 360,68" fill="#ffffff" />

    <rect x="471" y="0" width="138" height="86" rx="16" fill="#8a3ffc" stroke="#d4b5ff" stroke-width="3" />
    <path d="M540 24 L564 48 L540 72 L516 48 Z" fill="#ffffff" />
  </g>
</svg>
`;

async function main() {
  const outputPath = path.join(process.cwd(), 'public/og/belt-sort-og.png');
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(`Generated: ${outputPath} (${width}x${height})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
