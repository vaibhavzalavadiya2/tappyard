// Offscreen Canvas Sprite & Factory Background Pre-Renderer for Conveyor Sort Rush
// All gradients and complex shapes are drawn once to offscreen canvases (never per frame).

import { BELT_SORT_CONFIG, type ItemKind, type ShapeKind } from './config';

export interface SpriteCache {
  items: Record<ItemKind, HTMLCanvasElement>;
  bgFar: HTMLCanvasElement | null;
  bgNear: HTMLCanvasElement | null;
  bgWidth: number;
  bgHeight: number;
  blurEnabled: boolean;
}

const SPRITE_LOGICAL_SIZE = 140;
const EXTRUDE_OFFSET_Y = 7;

function createOffscreenCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w));
  c.height = Math.max(1, Math.floor(h));
  return c;
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function drawRoundedTrianglePath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  cornerRadius: number
) {
  const topY = cy - size * 0.44;
  const botY = cy + size * 0.4;
  const halfW = size * 0.48;
  const pts = [
    { x: cx, y: topY },
    { x: cx + halfW, y: botY },
    { x: cx - halfW, y: botY },
  ];

  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const curr = pts[i];
    const prev = pts[(i + 2) % 3];
    const next = pts[(i + 1) % 3];

    const v1x = prev.x - curr.x;
    const v1y = prev.y - curr.y;
    const len1 = Math.hypot(v1x, v1y) || 1;

    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len2 = Math.hypot(v2x, v2y) || 1;

    const p1x = curr.x + (v1x / len1) * cornerRadius;
    const p1y = curr.y + (v1y / len1) * cornerRadius;
    const p2x = curr.x + (v2x / len2) * cornerRadius;
    const p2y = curr.y + (v2y / len2) * cornerRadius;

    if (i === 0) ctx.moveTo(p1x, p1y);
    else ctx.lineTo(p1x, p1y);
    ctx.quadraticCurveTo(curr.x, curr.y, p2x, p2y);
  }
  ctx.closePath();
}

function drawRoundedDiamondPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  r: number
) {
  const pts = [
    { x: cx, y: cy - ry },
    { x: cx + rx, y: cy },
    { x: cx, y: cy + ry },
    { x: cx - rx, y: cy },
  ];
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const curr = pts[i];
    const prev = pts[(i + 3) % 4];
    const next = pts[(i + 1) % 4];

    const v1x = prev.x - curr.x;
    const v1y = prev.y - curr.y;
    const len1 = Math.hypot(v1x, v1y) || 1;

    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len2 = Math.hypot(v2x, v2y) || 1;

    const p1x = curr.x + (v1x / len1) * r;
    const p1y = curr.y + (v1y / len1) * r;
    const p2x = curr.x + (v2x / len2) * r;
    const p2y = curr.y + (v2y / len2) * r;

    if (i === 0) ctx.moveTo(p1x, p1y);
    else ctx.lineTo(p1x, p1y);
    ctx.quadraticCurveTo(curr.x, curr.y, p2x, p2y);
  }
  ctx.closePath();
}

function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points = 5
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const rad = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * rad;
    const y = cy + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function buildShapeItemSprite(kind: ShapeKind): HTMLCanvasElement {
  const s = SPRITE_LOGICAL_SIZE;
  const c = createOffscreenCanvas(s, s);
  const ctx = c.getContext('2d');
  if (!ctx) return c;

  const bin = BELT_SORT_CONFIG.BINS.find((b) => b.id === kind)!;
  const cx = s / 2;
  const cy = s / 2 - 4;

  // Slightly elliptical Y squeeze for 3D perspective disc/token feel on the belt
  const traceShape = (offsetY: number) => {
    if (kind === 'circle') {
      ctx.beginPath();
      ctx.ellipse(cx, cy + offsetY, 44, 34, 0, 0, Math.PI * 2);
      ctx.closePath();
    } else if (kind === 'square') {
      drawRoundedRectPath(ctx, cx - 40, cy - 31 + offsetY, 80, 62, 14);
    } else if (kind === 'triangle') {
      drawRoundedTrianglePath(ctx, cx, cy + 3 + offsetY, 86, 10);
    } else {
      drawRoundedDiamondPath(ctx, cx, cy + offsetY, 44, 34, 8);
    }
  };

  // 1. Soft ground shadow directly beneath the extruded token
  ctx.save();
  ctx.fillStyle = 'rgba(7, 10, 26, 0.42)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + EXTRUDE_OFFSET_Y + 28, 42, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Extruded thickness layer (offset down by EXTRUDE_OFFSET_Y)
  for (let d = EXTRUDE_OFFSET_Y; d >= 1; d--) {
    traceShape(d);
    ctx.fillStyle = bin.dark;
    ctx.fill();
  }
  traceShape(EXTRUDE_OFFSET_Y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.stroke();

  // 3. Top face with vertical gradient
  traceShape(0);
  const faceGrad = ctx.createLinearGradient(cx, cy - 38, cx, cy + 38);
  faceGrad.addColorStop(0, bin.light);
  faceGrad.addColorStop(0.58, bin.mid);
  faceGrad.addColorStop(1, bin.dark);
  ctx.fillStyle = faceGrad;
  ctx.fill();

  // Thin crisp inner border
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = bin.rim;
  ctx.stroke();

  // 4. Gloss top highlight + white arc top-left
  ctx.save();
  traceShape(0);
  ctx.clip();

  const glossGrad = ctx.createLinearGradient(cx, cy - 38, cx, cy + 2);
  glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glossGrad;
  ctx.fillRect(0, cy - 42, s, 44);

  // Specular highlight arc top-left
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx - 8, cy - 2, 27, Math.PI * 1.12, Math.PI * 1.56);
  ctx.stroke();

  // Crisp subtle white inner symbol silhouette for colorblind clarity
  ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
  if (kind === 'circle') {
    ctx.beginPath();
    ctx.ellipse(cx, cy, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'square') {
    drawRoundedRectPath(ctx, cx - 14, cy - 11, 28, 22, 4);
    ctx.fill();
  } else if (kind === 'triangle') {
    drawRoundedTrianglePath(ctx, cx, cy + 2, 32, 3);
    ctx.fill();
  } else {
    drawRoundedDiamondPath(ctx, cx, cy, 16, 12, 3);
    ctx.fill();
  }

  ctx.restore();
  return c;
}

function buildWildcardSprite(): HTMLCanvasElement {
  const s = SPRITE_LOGICAL_SIZE;
  const c = createOffscreenCanvas(s, s);
  const ctx = c.getContext('2d');
  if (!ctx) return c;

  const cx = s / 2;
  const cy = s / 2 - 4;
  const { wildcardGoldLight, wildcardGold, wildcardGoldDark } = BELT_SORT_CONFIG.COLORS;

  // Radial outer gold halo
  const halo = ctx.createRadialGradient(cx, cy, 12, cx, cy, 62);
  halo.addColorStop(0, 'rgba(255, 227, 110, 0.75)');
  halo.addColorStop(0.55, 'rgba(255, 179, 0, 0.3)');
  halo.addColorStop(1, 'rgba(255, 179, 0, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, s, s);

  // Extrude
  for (let d = 6; d >= 1; d--) {
    drawStarPath(ctx, cx, cy + d, 46, 22, 5);
    ctx.fillStyle = wildcardGoldDark;
    ctx.fill();
  }

  // Star top face
  drawStarPath(ctx, cx, cy, 46, 22, 5);
  const grad = ctx.createLinearGradient(cx, cy - 44, cx, cy + 44);
  grad.addColorStop(0, wildcardGoldLight);
  grad.addColorStop(0.55, wildcardGold);
  grad.addColorStop(1, wildcardGoldDark);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#fff9d1';
  ctx.stroke();

  // Purple "WILDCARD!" ribbon at bottom
  drawRoundedRectPath(ctx, cx - 48, cy + 22, 96, 22, 11);
  const ribGrad = ctx.createLinearGradient(cx - 48, cy + 22, cx + 48, cy + 44);
  ribGrad.addColorStop(0, '#a855f7');
  ribGrad.addColorStop(1, '#6d28d9');
  ctx.fillStyle = ribGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#e9d5ff';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WILDCARD!', cx, cy + 33.5);

  return c;
}

function buildFreezeSprite(): HTMLCanvasElement {
  const s = SPRITE_LOGICAL_SIZE;
  const c = createOffscreenCanvas(s, s);
  const ctx = c.getContext('2d');
  if (!ctx) return c;

  const cx = s / 2;
  const cy = s / 2 - 4;
  const { freezeLight, freezeMid, freezeDark } = BELT_SORT_CONFIG.COLORS;

  // Ice glow
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 58);
  halo.addColorStop(0, 'rgba(165, 243, 252, 0.72)');
  halo.addColorStop(0.6, 'rgba(56, 189, 248, 0.25)');
  halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, s, s);

  const drawHex = (offsetY: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 6;
      const x = cx + Math.cos(a) * 40;
      const y = cy + offsetY + Math.sin(a) * 34;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  for (let d = 6; d >= 1; d--) {
    drawHex(d);
    ctx.fillStyle = freezeDark;
    ctx.fill();
  }

  drawHex(0);
  const grad = ctx.createLinearGradient(cx, cy - 36, cx, cy + 36);
  grad.addColorStop(0, freezeLight);
  grad.addColorStop(0.55, freezeMid);
  grad.addColorStop(1, freezeDark);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#ecfeff';
  ctx.stroke();

  // Snowflake star inside crystal
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3;
    const dx = Math.cos(a) * 18;
    const dy = Math.sin(a) * 15;
    ctx.beginPath();
    ctx.moveTo(cx - dx, cy - dy);
    ctx.lineTo(cx + dx, cy + dy);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
  ctx.fill();

  return c;
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.arc(-26, 8, 20, 0, Math.PI * 2);
  ctx.arc(28, 7, 22, 0, Math.PI * 2);
  ctx.arc(12, -12, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function buildBackgroundLayers(
  w: number,
  h: number,
  blurEnabled: boolean
): { bgFar: HTMLCanvasElement; bgNear: HTMLCanvasElement } {
  const safeW = Math.max(320, Math.floor(w));
  const safeH = Math.max(420, Math.floor(h));

  // Far layer: sky gradient + clouds + distant silhouette tanks
  const bgFar = createOffscreenCanvas(safeW, safeH);
  const fCtx = bgFar.getContext('2d');
  if (fCtx) {
    const sky = fCtx.createLinearGradient(0, 0, 0, safeH);
    sky.addColorStop(0, BELT_SORT_CONFIG.COLORS.skyTop);
    sky.addColorStop(0.65, '#86a4ff');
    sky.addColorStop(1, BELT_SORT_CONFIG.COLORS.skyBottom);
    fCtx.fillStyle = sky;
    fCtx.fillRect(0, 0, safeW, safeH);

    // Soft clouds across top sky
    drawCloud(fCtx, safeW * 0.14, safeH * 0.24, 1.05, 0.72);
    drawCloud(fCtx, safeW * 0.48, safeH * 0.19, 0.8, 0.55);
    drawCloud(fCtx, safeW * 0.85, safeH * 0.22, 1.15, 0.72);

    // Subtle atmospheric teal/orange factory silos in far distance
    if (blurEnabled && 'filter' in fCtx) {
      fCtx.filter = 'blur(3px)';
    }
    const baseLine = safeH * 0.66;
    const drawFarSilo = (x: number, bw: number, bh: number, color: string) => {
      fCtx.fillStyle = color;
      drawRoundedRectPath(fCtx, x, baseLine - bh, bw, bh + safeH * 0.4, 18);
      fCtx.fill();
    };
    drawFarSilo(safeW * 0.04, 72, safeH * 0.28, 'rgba(90, 134, 232, 0.5)');
    drawFarSilo(safeW * 0.18, 56, safeH * 0.22, 'rgba(116, 152, 245, 0.45)');
    drawFarSilo(safeW * 0.76, 68, safeH * 0.3, 'rgba(90, 134, 232, 0.5)');
    drawFarSilo(safeW * 0.88, 80, safeH * 0.24, 'rgba(116, 152, 245, 0.45)');
    if (blurEnabled && 'filter' in fCtx) {
      fCtx.filter = 'none';
    }
  }

  // Near layer: bright stylized orange/teal/yellow factory pipes, tanks & machines
  const bgNear = createOffscreenCanvas(safeW, safeH);
  const nCtx = bgNear.getContext('2d');
  if (nCtx) {
    if (blurEnabled && 'filter' in nCtx) {
      nCtx.filter = 'blur(2px)';
    }
    const floorY = safeH * 0.78;

    const drawTank = (x: number, y: number, tw: number, th: number, topCol: string, bodyCol: string) => {
      const grad = nCtx.createLinearGradient(x, y, x + tw, y);
      grad.addColorStop(0, topCol);
      grad.addColorStop(1, bodyCol);
      nCtx.fillStyle = grad;
      drawRoundedRectPath(nCtx, x, y, tw, th, 16);
      nCtx.fill();
      nCtx.fillStyle = 'rgba(255,255,255,0.22)';
      drawRoundedRectPath(nCtx, x + 6, y + 6, tw * 0.24, th - 12, 8);
      nCtx.fill();
    };

    const drawPipe = (x1: number, y1: number, x2: number, y2: number, thickness: number, col: string) => {
      nCtx.save();
      nCtx.strokeStyle = col;
      nCtx.lineWidth = thickness;
      nCtx.lineCap = 'round';
      nCtx.lineJoin = 'round';
      nCtx.beginPath();
      nCtx.moveTo(x1, y1);
      nCtx.lineTo(x2, y1);
      nCtx.lineTo(x2, y2);
      nCtx.stroke();

      nCtx.strokeStyle = 'rgba(255,255,255,0.25)';
      nCtx.lineWidth = thickness * 0.28;
      nCtx.beginPath();
      nCtx.moveTo(x1, y1 - thickness * 0.22);
      nCtx.lineTo(x2 - thickness * 0.15, y1 - thickness * 0.22);
      nCtx.stroke();
      nCtx.restore();
    };

    // Left factory group (orange machines + teal pipes + yellow joints)
    drawPipe(safeW * 0.02, safeH * 0.36, safeW * 0.19, safeH * 0.56, 18, '#fb923c');
    drawTank(safeW * 0.02, safeH * 0.34, 78, safeH * 0.48, '#ffd23f', '#f59e0b');
    drawTank(safeW * 0.09, safeH * 0.44, 68, safeH * 0.38, '#5eead4', '#0d9488');
    drawPipe(-10, safeH * 0.58, safeW * 0.22, safeH * 0.78, 22, '#2dd4bf');

    // Right factory group (teal tower + orange tank + yellow piping)
    drawPipe(safeW * 0.98, safeH * 0.31, safeW * 0.76, safeH * 0.52, 18, '#ffd23f');
    drawTank(safeW * 0.81, safeH * 0.28, 72, safeH * 0.52, '#5eead4', '#0f766e');
    drawTank(safeW * 0.88, safeH * 0.4, 86, safeH * 0.42, '#ffb347', '#ea580c');
    drawPipe(safeW + 10, safeH * 0.55, safeW * 0.77, safeH * 0.75, 22, '#14b8a6');

    // Lower warm orange/lavender factory floor horizon
    const floorGrad = nCtx.createLinearGradient(0, floorY - 30, 0, safeH);
    floorGrad.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
    floorGrad.addColorStop(1, 'rgba(91, 61, 184, 0.92)');
    nCtx.fillStyle = floorGrad;
    nCtx.fillRect(0, floorY - 30, safeW, safeH - floorY + 30);

    // Side foreground factory blocks
    nCtx.fillStyle = '#fb923c';
    drawRoundedRectPath(nCtx, -12, safeH * 0.67, Math.max(60, safeW * 0.16), safeH * 0.3, 18);
    nCtx.fill();
    drawRoundedRectPath(nCtx, safeW - Math.max(60, safeW * 0.16) + 12, safeH * 0.64, Math.max(60, safeW * 0.16), safeH * 0.32, 18);
    nCtx.fill();

    if (blurEnabled && 'filter' in nCtx) {
      nCtx.filter = 'none';
    }
  }

  return { bgFar, bgNear };
}

export function createSpriteCache(width: number, height: number, blurEnabled = true): SpriteCache {
  const { bgFar, bgNear } = buildBackgroundLayers(width, height, blurEnabled);
  return {
    items: {
      circle: buildShapeItemSprite('circle'),
      square: buildShapeItemSprite('square'),
      triangle: buildShapeItemSprite('triangle'),
      diamond: buildShapeItemSprite('diamond'),
      wildcard: buildWildcardSprite(),
      freeze: buildFreezeSprite(),
    },
    bgFar,
    bgNear,
    bgWidth: width,
    bgHeight: height,
    blurEnabled,
  };
}
