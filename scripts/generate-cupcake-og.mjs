import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#3b1544" stop-opacity="0.9" />
      <stop offset="60%" stop-color="#190a21" stop-opacity="1" />
      <stop offset="100%" stop-color="#0f0514" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F472B6" />
      <stop offset="50%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGlow)" />

  <!-- Subtle Bakery Grid Accents -->
  <g opacity="0.1" stroke="#ec4899" stroke-width="1">
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="200" x2="1200" y2="200" />
    <line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="500" x2="1200" y2="500" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Brand Badge Top Left -->
  <g transform="translate(80, 60)">
    <rect width="180" height="44" rx="22" fill="#2d1337" stroke="#ec4899" stroke-width="1.5" />
    <circle cx="26" cy="22" r="7" fill="#ec4899" />
    <text x="44" y="27" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" letter-spacing="2">TAPPYARD</text>
  </g>

  <!-- Tag Pill Top Right -->
  <g transform="translate(930, 60)">
    <rect width="190" height="44" rx="22" fill="#2d1337" stroke="#f59e0b" stroke-width="1.5" />
    <text x="95" y="27" text-anchor="middle" fill="#fde047" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" letter-spacing="1">DESSERT PUZZLE</text>
  </g>

  <!-- Main Headline -->
  <text x="600" y="210" text-anchor="middle" fill="url(#titleGrad)" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="78" letter-spacing="-1" filter="url(#glow)">CUPCAKE 2048</text>

  <!-- Subtitle -->
  <text x="600" y="260" text-anchor="middle" fill="#fbcfe8" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="24" letter-spacing="0.5">Merge Sweet Cupcakes • Reach the 2048 Diamond Crown</text>

  <!-- Showcase Cupcake Cards Row -->
  <!-- Card 1: 2 Vanilla -->
  <g transform="translate(240, 310)">
    <rect width="150" height="170" rx="24" fill="#fef3c7" stroke="#fbbf24" stroke-width="3" />
    <rect x="95" y="10" width="45" height="26" rx="8" fill="#d97706" />
    <text x="117" y="28" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16">2</text>
    <!-- Cupcake drawing -->
    <path d="M50 95L58 135H92L100 95H50Z" fill="#FDE68A" stroke="#D97706" stroke-width="2" />
    <path d="M46 90C46 76 60 70 75 70C90 70 104 76 104 90C104 100 90 102 75 102C60 102 46 100 46 90Z" fill="#FFFBEB" stroke="#D97706" stroke-width="2" />
    <text x="75" y="156" text-anchor="middle" fill="#78350f" font-family="system-ui, sans-serif" font-weight="800" font-size="13">Vanilla</text>
  </g>

  <!-- Card 2: 8 Choco -->
  <g transform="translate(415, 310)">
    <rect width="150" height="170" rx="24" fill="#451a03" stroke="#b45309" stroke-width="3" />
    <rect x="95" y="10" width="45" height="26" rx="8" fill="#b45309" />
    <text x="117" y="28" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16">8</text>
    <path d="M50 95L58 135H92L100 95H50Z" fill="#78350F" stroke="#B45309" stroke-width="2" />
    <path d="M46 90C46 76 60 70 75 70C90 70 104 76 104 90C104 100 90 102 75 102C60 102 46 100 46 90Z" fill="#92400E" stroke="#B45309" stroke-width="2" />
    <circle cx="75" cy="65" r="7" fill="#ef4444" />
    <text x="75" y="156" text-anchor="middle" fill="#fed7aa" font-family="system-ui, sans-serif" font-weight="800" font-size="13">Choco</text>
  </g>

  <!-- Card 3: 256 Red Velvet -->
  <g transform="translate(590, 310)">
    <rect width="150" height="170" rx="24" fill="#881337" stroke="#f43f5e" stroke-width="3" />
    <rect x="85" y="10" width="55" height="26" rx="8" fill="#e11d48" />
    <text x="112" y="28" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16">256</text>
    <path d="M50 95L58 135H92L100 95H50Z" fill="#9F1239" stroke="#F43F5E" stroke-width="2" />
    <path d="M46 90C46 76 60 70 75 70C90 70 104 76 104 90C104 100 90 102 75 102C60 102 46 100 46 90Z" fill="#FFF1F2" stroke="#E11D48" stroke-width="2" />
    <text x="75" y="156" text-anchor="middle" fill="#ffe4e6" font-family="system-ui, sans-serif" font-weight="800" font-size="13">Red Velvet</text>
  </g>

  <!-- Card 4: 2048 Diamond Crown -->
  <g transform="translate(765, 310)">
    <rect width="170" height="170" rx="24" fill="#0c4a6e" stroke="#38bdf8" stroke-width="4" filter="url(#glow)" />
    <rect x="95" y="10" width="65" height="26" rx="8" fill="#38bdf8" />
    <text x="127" y="28" text-anchor="middle" fill="#082f49" font-family="system-ui, sans-serif" font-weight="900" font-size="16">2048</text>
    <!-- Crown Topper -->
    <path d="M60 62L68 48L85 58L102 48L110 62Z" fill="#FDE047" stroke="#FFFFFF" stroke-width="2" />
    <path d="M60 95L68 135H102L110 95H60Z" fill="#0284C7" stroke="#38BDF8" stroke-width="2" />
    <path d="M56 90C56 76 70 70 85 70C100 70 114 76 114 90C114 100 100 102 85 102C70 102 56 100 56 90Z" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2" />
    <text x="85" y="156" text-anchor="middle" fill="#e0f2fe" font-family="system-ui, sans-serif" font-weight="900" font-size="13">Diamond Crown</text>
  </g>

  <!-- Bottom CTA Banner -->
  <g transform="translate(430, 520)">
    <rect width="340" height="54" rx="27" fill="#ec4899" />
    <text x="170" y="34" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="18" letter-spacing="1">PLAY ONLINE FREE • NO DOWNLOAD</text>
  </g>
</svg>
`;

async function main() {
  const outputPath = path.join(process.cwd(), 'public/og/cupcake-2048-og.png');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  console.log(`Generated: ${outputPath} (${width}x${height})`);
}

main().catch(console.error);
