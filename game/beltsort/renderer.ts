// Pure Canvas 2D Perspective Belt & FX Renderer for Conveyor Sort Rush

import { BELT_SORT_CONFIG, type ItemKind, type ShapeKind } from './config';
import type { SpriteCache } from './sprites';

export interface ActiveBeltItem {
  id: number;
  kind: ItemKind;
  yProgress: number; // 0.0 (top spawn) -> 1.0 (end line just above bins)
}

export interface DroppingItemFx {
  id: number;
  kind: ItemKind;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  startScale: number;
  elapsed: number;
  duration: number;
}

export interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  isStar: boolean;
}

export interface FloatingScoreText {
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
}

export interface PerfectBannerFx {
  life: number;
  maxLife: number;
}

export interface RenderLayoutMetrics {
  canvasWidth: number;
  canvasHeight: number;
  columnLeft: number;
  columnWidth: number;
  beltTopY: number;
  beltBottomY: number;
  beltBottomWidth: number;
  beltTopWidth: number;
  binCount: number;
  binCentersX: number[]; // Relative to canvasWidth
}

export interface RenderFrameState {
  beltScrollOffset: number; // 0..1 repeating pattern phase
  parallaxX: number;
  items: ActiveBeltItem[];
  droppingItems: DroppingItemFx[];
  particles: SparkleParticle[];
  floatingTexts: FloatingScoreText[];
  perfectBanner: PerfectBannerFx | null;
  showPerfectTag: boolean;
  slowMoActive: boolean;
  freezeActive: boolean;
  lowPerfMode: boolean;
  customBgImage: HTMLImageElement | null;
  timeSec: number;
}

function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : r * 0.34;
    const px = Math.cos(a) * rad;
    const py = Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function beltWidthAt(t: number, topW: number, botW: number): number {
  return topW + (botW - topW) * t;
}

export function itemScaleAt(t: number): number {
  const { itemScaleTop, itemScaleBottom } = BELT_SORT_CONFIG.RENDER;
  return itemScaleTop + (itemScaleBottom - itemScaleTop) * Math.max(0, Math.min(1, t));
}

export function renderBeltScene(
  ctx: CanvasRenderingContext2D,
  sprites: SpriteCache,
  metrics: RenderLayoutMetrics,
  state: RenderFrameState
) {
  const {
    canvasWidth: w,
    canvasHeight: h,
    columnLeft,
    columnWidth,
    beltTopY,
    beltBottomY,
    beltBottomWidth,
    beltTopWidth,
    binCount,
    binCentersX,
  } = metrics;

  ctx.clearRect(0, 0, w, h);

  // 1. Background (Optional WebP or 2-Layer Pre-Rendered Factory Scene)
  if (state.customBgImage && state.customBgImage.complete && state.customBgImage.naturalWidth > 0) {
    const img = state.customBgImage;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  } else {
    if (sprites.bgFar) {
      ctx.drawImage(sprites.bgFar, 0, 0, w, h);
    }
    if (sprites.bgNear) {
      const px = state.lowPerfMode ? 0 : state.parallaxX;
      ctx.drawImage(sprites.bgNear, px, 0, w, h);
    }
  }

  const cx = columnLeft + columnWidth / 2;
  const beltH = Math.max(120, beltBottomY - beltTopY);
  const topHalf = beltTopWidth / 2;
  const botHalf = beltBottomWidth / 2;

  // 2. Conveyor Belt Outer Chassis & Soft Drop Shadow
  ctx.save();
  ctx.fillStyle = 'rgba(13, 18, 56, 0.35)';
  ctx.beginPath();
  ctx.moveTo(cx - topHalf - 22, beltTopY + 10);
  ctx.lineTo(cx + topHalf + 22, beltTopY + 10);
  ctx.lineTo(cx + botHalf + 30, beltBottomY + 16);
  ctx.lineTo(cx - botHalf - 30, beltBottomY + 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Main Trapezoid Conveyor Surface (#3a3f52)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - topHalf, beltTopY);
  ctx.lineTo(cx + topHalf, beltTopY);
  ctx.lineTo(cx + botHalf, beltBottomY);
  ctx.lineTo(cx - botHalf, beltBottomY);
  ctx.closePath();

  const beltGrad = ctx.createLinearGradient(cx, beltTopY, cx, beltBottomY);
  beltGrad.addColorStop(0, BELT_SORT_CONFIG.COLORS.beltSlateTop);
  beltGrad.addColorStop(0.5, BELT_SORT_CONFIG.COLORS.beltSlate);
  beltGrad.addColorStop(1, BELT_SORT_CONFIG.COLORS.beltSlateBottom);
  ctx.fillStyle = beltGrad;
  ctx.fill();

  // Clip to belt interior for scrolling chevrons, rails shadow & perfect zone
  ctx.clip();

  // Frost tint or Slow-Mo blue sheen overlay when power-up active
  if (state.freezeActive) {
    ctx.fillStyle = 'rgba(103, 232, 249, 0.22)';
    ctx.fillRect(cx - botHalf - 10, beltTopY, beltBottomWidth + 20, beltH);
  } else if (state.slowMoActive) {
    ctx.fillStyle = 'rgba(59, 130, 246, 0.16)';
    ctx.fillRect(cx - botHalf - 10, beltTopY, beltBottomWidth + 20, beltH);
  }

  // Side inner shadows from rails onto belt surface
  ctx.strokeStyle = 'rgba(12, 16, 36, 0.55)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(cx - topHalf, beltTopY);
  ctx.lineTo(cx - botHalf, beltBottomY);
  ctx.moveTo(cx + topHalf, beltTopY);
  ctx.lineTo(cx + botHalf, beltBottomY);
  ctx.stroke();

  // Perspective-scaled scrolling chevrons (pointing toward player)
  const chevronCount = 6;
  ctx.strokeStyle = state.freezeActive
    ? 'rgba(207, 250, 254, 0.26)'
    : BELT_SORT_CONFIG.COLORS.beltChevron;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = -1; i <= chevronCount; i++) {
    const rawT = (i + state.beltScrollOffset) / chevronCount;
    if (rawT < -0.05 || rawT > 1.05) continue;
    // Slight perspective acceleration as items approach player
    const perspT = Math.pow(Math.max(0, rawT), 1.18);
    const y = beltTopY + perspT * beltH;
    const s = itemScaleAt(perspT);
    const wingW = beltWidthAt(perspT, beltTopWidth, beltBottomWidth) * 0.23;
    const tipDrop = 14 * s;
    ctx.lineWidth = Math.max(3, 8 * s);

    ctx.beginPath();
    ctx.moveTo(cx - wingW, y - tipDrop);
    ctx.lineTo(cx, y + tipDrop * 0.45);
    ctx.lineTo(cx + wingW, y - tipDrop);
    ctx.stroke();
  }

  // 4. Perfect Zone Glowing Gold Band (bottom 18% of belt)
  const pzStartRatio = 1 - BELT_SORT_CONFIG.SCORING.perfectZoneRatio;
  const pzTopY = beltTopY + pzStartRatio * beltH;
  const pzBotY = beltBottomY;
  const pzTopW = beltWidthAt(pzStartRatio, beltTopWidth, beltBottomWidth);
  const pzBotW = beltBottomWidth;
  const pulse = 0.86 + 0.14 * Math.sin(state.timeSec * 4.5);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - pzTopW / 2, pzTopY);
  ctx.lineTo(cx + pzTopW / 2, pzTopY);
  ctx.lineTo(cx + pzBotW / 2, pzBotY);
  ctx.lineTo(cx - pzBotW / 2, pzBotY);
  ctx.closePath();

  const pzGrad = ctx.createLinearGradient(cx, pzTopY, cx, pzBotY);
  pzGrad.addColorStop(0, `rgba(255, 210, 63, ${0.42 * pulse})`);
  pzGrad.addColorStop(0.45, `rgba(255, 227, 110, ${0.82 * pulse})`);
  pzGrad.addColorStop(1, `rgba(245, 158, 11, ${0.95 * pulse})`);
  ctx.fillStyle = pzGrad;
  ctx.fill();

  // Bright top hairline of Perfect Zone
  ctx.strokeStyle = 'rgba(255, 250, 200, 0.95)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - pzTopW / 2, pzTopY);
  ctx.lineTo(cx + pzTopW / 2, pzTopY);
  ctx.stroke();

  // Chute lane divider alignment notches cleanly above active bins
  for (let b = 0; b < binCount; b++) {
    const binX = binCentersX[b];
    const binColor = BELT_SORT_CONFIG.BINS[b]?.mid || '#ffffff';
    ctx.fillStyle = binColor;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.moveTo(binX - 10, pzBotY - 2);
    ctx.lineTo(binX + 10, pzBotY - 2);
    ctx.lineTo(binX + 6, pzBotY - 9);
    ctx.lineTo(binX - 6, pzBotY - 9);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Sparkle stars on Perfect Zone edges
  const pzMidY = (pzTopY + pzBotY) * 0.5;
  drawFourPointStar(ctx, cx - pzBotW * 0.42, pzMidY - 2, 9 * pulse, '#ffffff', 0.9);
  drawFourPointStar(ctx, cx + pzBotW * 0.42, pzMidY - 2, 9 * pulse, '#ffffff', 0.9);

  if (state.showPerfectTag) {
    ctx.font = '800 15px var(--font-fredoka), "Fredoka", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('Perfect Zone! x2 Points', cx, pzMidY + 1);
    ctx.fillStyle = '#362100';
    ctx.fillText('Perfect Zone! x2 Points', cx, pzMidY - 0.5);
  }
  ctx.restore();

  ctx.restore(); // end belt interior clip

  // 5. Lavender Metal Side Rails + Scrolling Amber Clamps
  const railWTop = 10;
  const railWBot = 18;
  const drawSideRail = (side: -1 | 1) => {
    ctx.save();
    ctx.beginPath();
    if (side === -1) {
      ctx.moveTo(cx - topHalf - railWTop, beltTopY - 2);
      ctx.lineTo(cx - topHalf + 2, beltTopY - 2);
      ctx.lineTo(cx - botHalf + 3, beltBottomY + 2);
      ctx.lineTo(cx - botHalf - railWBot, beltBottomY + 2);
    } else {
      ctx.moveTo(cx + topHalf - 2, beltTopY - 2);
      ctx.lineTo(cx + topHalf + railWTop, beltTopY - 2);
      ctx.lineTo(cx + botHalf + railWBot, beltBottomY + 2);
      ctx.lineTo(cx + botHalf - 3, beltBottomY + 2);
    }
    ctx.closePath();

    const rGrad = ctx.createLinearGradient(0, beltTopY, 0, beltBottomY);
    rGrad.addColorStop(0, BELT_SORT_CONFIG.COLORS.railLight);
    rGrad.addColorStop(0.6, BELT_SORT_CONFIG.COLORS.railMid);
    rGrad.addColorStop(1, BELT_SORT_CONFIG.COLORS.railDark);
    ctx.fillStyle = rGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#5335b8';
    ctx.stroke();

    // Inner specular highlight strip along rail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + side * (topHalf + railWTop * 0.45), beltTopY);
    ctx.lineTo(cx + side * (botHalf + railWBot * 0.45), beltBottomY);
    ctx.stroke();
    ctx.restore();
  };

  drawSideRail(-1);
  drawSideRail(1);

  // Top end-cap bar of conveyor belt (gives clean machined belt start)
  ctx.save();
  ctx.fillStyle = '#7b62d9';
  ctx.strokeStyle = '#42289e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cx - topHalf - railWTop, beltTopY - 5, beltTopWidth + railWTop * 2, 10, 5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Scrolling amber clamps on both rails
  const clampCount = 4;
  for (let i = 0; i <= clampCount; i++) {
    const rawT = (i + state.beltScrollOffset) / clampCount;
    if (rawT < 0.04 || rawT > 0.98) continue;
    const perspT = Math.pow(rawT, 1.18);
    const y = beltTopY + perspT * beltH;
    const s = itemScaleAt(perspT);
    const cw = 20 * s;
    const ch = 15 * s;
    const halfB = beltWidthAt(perspT, beltTopWidth, beltBottomWidth) / 2;

    for (const side of [-1, 1] as const) {
      const rx = cx + side * (halfB + (railWTop + (railWBot - railWTop) * perspT) * 0.45) - cw / 2;
      const ry = y - ch / 2;
      ctx.save();
      const cGrad = ctx.createLinearGradient(rx, ry, rx, ry + ch);
      cGrad.addColorStop(0, BELT_SORT_CONFIG.COLORS.clampLight);
      cGrad.addColorStop(0.55, BELT_SORT_CONFIG.COLORS.clampMid);
      cGrad.addColorStop(1, BELT_SORT_CONFIG.COLORS.clampDark);
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.roundRect(rx, ry, cw, ch, 5 * s);
      ctx.fill();
      ctx.lineWidth = Math.max(1, 1.5 * s);
      ctx.strokeStyle = '#92400e';
      ctx.stroke();
      ctx.restore();
    }
  }

  // 6. Active Items on Belt (sorted top-to-bottom so closer items paint on top)
  const sortedItems = [...state.items].sort((a, b) => a.yProgress - b.yProgress);
  const frontId = sortedItems.length > 0 ? sortedItems[sortedItems.length - 1].id : -1;

  for (const item of sortedItems) {
    const t = Math.max(0, Math.min(1, item.yProgress));
    const perspT = Math.pow(t, 1.12);
    const itemY = beltTopY + 12 + perspT * (beltH - 28);
    const s = itemScaleAt(t);
    const drawSize = 104 * s;
    const sprite = sprites.items[item.kind];

    // Subtle target ring under front-most active item
    if (item.id === frontId && t >= 1 - BELT_SORT_CONFIG.SCORING.perfectZoneRatio) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 240, 138, 0.85)';
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.ellipse(cx, itemY + 6 * s, 44 * s, 26 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.drawImage(sprite, cx - drawSize / 2, itemY - drawSize / 2, drawSize, drawSize);
  }

  // 7. Squash & Drop Items Flying into Target Bins
  for (const drop of state.droppingItems) {
    const p = Math.min(1, drop.elapsed / drop.duration);
    const ease = 1 - Math.pow(1 - p, 2);
    const curX = drop.startX + (drop.targetX - drop.startX) * ease;
    const arcLift = Math.sin(p * Math.PI) * 26;
    const curY = drop.startY + (drop.targetY - drop.startY) * ease - arcLift;
    const scaleX = drop.startScale * (1 - 0.38 * p);
    const scaleY = drop.startScale * (1 - 0.55 * p);
    const sprite = sprites.items[drop.kind];
    const dw = 104 * scaleX;
    const dh = 104 * scaleY;

    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - p * 0.45);
    ctx.drawImage(sprite, curX - dw / 2, curY - dh / 2, dw, dh);
    ctx.restore();
  }

  // 8. Sparkle & Shatter Particles
  for (const pt of state.particles) {
    if (pt.isStar) {
      drawFourPointStar(ctx, pt.x, pt.y, pt.size, pt.color, pt.alpha);
    } else {
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 9. Floating "+pts" Text
  for (const ft of state.floatingTexts) {
    const progress = ft.life / ft.maxLife;
    const alpha = Math.max(0, 1 - Math.pow(progress, 1.5));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `800 ${Math.round(24 * ft.scale)}px var(--font-lilita-one), "Lilita One", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#09123a';
    ctx.strokeText(ft.text, ft.x, ft.y);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }

  // 10. Big Slanted "Perfect! x2 Points" Burst (-8 degrees + speed lines)
  if (state.perfectBanner) {
    const p = state.perfectBanner.life / state.perfectBanner.maxLife;
    let popScale = 1;
    if (p < 0.25) {
      popScale = 0.6 + (p / 0.25) * 0.55; // 0.6 -> 1.15
    } else if (p < 0.45) {
      popScale = 1.15 - ((p - 0.25) / 0.2) * 0.15; // 1.15 -> 1.0
    }
    const alpha = p > 0.68 ? Math.max(0, (1 - p) / 0.32) : 1;

    ctx.save();
    ctx.translate(cx, pzTopY - 46);
    ctx.rotate((-8 * Math.PI) / 180);
    ctx.scale(popScale, popScale);
    ctx.globalAlpha = alpha;

    // Speed lines
    ctx.strokeStyle = '#fff59d';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (const dir of [-1, 1] as const) {
      for (let l = -1; l <= 1; l++) {
        ctx.beginPath();
        ctx.moveTo(dir * 95, l * 10);
        ctx.lineTo(dir * (126 + Math.abs(l) * 8), l * 11);
        ctx.stroke();
      }
    }

    ctx.font = '900 28px var(--font-lilita-one), "Lilita One", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#09123a';
    ctx.strokeText('Perfect! x2 Points', 0, 0);

    const tGrad = ctx.createLinearGradient(0, -16, 0, 16);
    tGrad.addColorStop(0, '#fff9b0');
    tGrad.addColorStop(0.5, '#ffd23f');
    tGrad.addColorStop(1, '#ff9f1c');
    ctx.fillStyle = tGrad;
    ctx.fillText('Perfect! x2 Points', 0, 0);
    ctx.restore();
  }
}

export function getShapeColor(kind: ShapeKind): string {
  return BELT_SORT_CONFIG.BINS.find((b) => b.id === kind)?.mid || '#ffd23f';
}
