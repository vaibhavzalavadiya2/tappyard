import Phaser from 'phaser';
import { GAME_CONFIG, type JellySkin, type EnvironmentTheme } from '../config';
import { audioManager } from '../audio';
import { eventBridge } from '../events';
import { loadProgress, updateAfterRun } from '../progress';

interface TrackSegment {
  zStart: number;
  zEnd: number;
  width: number;
  isGap: boolean;
  hasBooster: boolean;
  boosterX: number;
  boosterHalfW: number;
  boosterHit: boolean;
  diamonds: { x: number; z: number; collected: boolean }[];
}

interface Pillar {
  x: number;
  z: number;
  width: number;
  height: number;
}

interface SpeedParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  alpha: number;
  color: number;
  size?: number;
}

interface FloatingText {
  x: number;
  y: number;
  z: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
}

interface Shockwave {
  x: number;
  z: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  relZ: number;
}

export class GameScene extends Phaser.Scene {
  // Game states
  private isPlaying = false;
  private isPaused = false;
  private isDead = false;
  private hasStartedDragging = false;

  // Jelly 3D position & physics
  private jellyX = 0; // Lateral position (-width/2 to +width/2)
  private jellyY = 0; // Height above runway (0 = on ground, >0 = airborne, <0 = falling)
  private jellyZ = 0; // Forward distance in world units
  private jellyTargetX = 0;
  private jellyVY = 0; // Vertical jump/fall velocity
  private forwardSpeed: number = GAME_CONFIG.BASE_SPEED;

  // Boosting state
  private isAirborne = false;
  private canLand = false;
  private isBoosting = false;
  private boostTimer = 0;
  private boostStreak = 0;
  private squashFactor = 1;
  private stretchFactor = 1;
  private wobbleAngle = 0;

  // Ledge / Coyote Time & Edge Resistance
  private coyoteTimer = 0;
  private lastEdgeScrapeTime = 0;

  // Controls & Pointer drag
  private isDragging = false;
  private dragStartX = 0;
  private dragStartJellyX = 0;

  // Track & Level segments
  private segments: TrackSegment[] = [];
  private furthestZ = 0;
  private currentTrackWidth = GAME_CONFIG.TRACK_WIDTH_DEFAULT;
  private pillars: Pillar[] = [];

  // Diamonds & Score
  private diamondsCollected = 0;
  private totalDiamonds = 0;
  private distanceMeters = 0;
  private bestDistanceMeters = 0;
  private totalBoosts = 0;
  private nextMilestone = 100;

  // Environment & Theme
  private currentThemeIndex = 0;
  private currentTheme: EnvironmentTheme = GAME_CONFIG.THEMES[0];
  private currentSkyTop: number = GAME_CONFIG.THEMES[0].skyTop;
  private currentSkyBottom: number = GAME_CONFIG.THEMES[0].skyBottom;
  private currentTrackColor: number = GAME_CONFIG.THEMES[0].trackColor;
  private currentTrackEdge: number = GAME_CONFIG.THEMES[0].trackEdgeColor;
  private currentPillarColor: number = GAME_CONFIG.THEMES[0].pillarColor;
  private themeTransitionAlpha = 0;

  // Visuals, Juice & Particles
  private bgGraphics!: Phaser.GameObjects.Graphics;
  private worldGraphics!: Phaser.GameObjects.Graphics;
  private uiGraphics!: Phaser.GameObjects.Graphics;
  private particles: SpeedParticle[] = [];
  private floatingTexts: FloatingText[] = [];
  private shockwaves: Shockwave[] = [];
  private diamondRotation = 0;
  private screenFlashAlpha = 0;

  // Dynamic Camera coordinates (chase camera)
  private camX = 0;
  private camY = GAME_CONFIG.CAMERA_HEIGHT;
  private camZ = -GAME_CONFIG.CAMERA_DISTANCE;
  private camFOV = GAME_CONFIG.FOV;

  // Active Skin
  private selectedSkin: JellySkin = GAME_CONFIG.JELLY_SKINS[0];
  private rainbowHue = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.loadSkin();

    // Graphics layers
    this.bgGraphics = this.add.graphics().setDepth(-10);
    this.worldGraphics = this.add.graphics().setDepth(5);
    this.uiGraphics = this.add.graphics().setDepth(20);

    // Initial world generation with long exhilarating warmup
    this.resetWorld();

    // Register Pointer & Touch drag controls
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.onPointerDown(pointer);
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.onPointerMove(pointer);
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });

    this.input.on('gameout', () => {
      this.isDragging = false;
    });

    // Window-level safety release for mobile browser gesture releases
    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
    window.addEventListener('pointercancel', () => {
      this.isDragging = false;
    });

    // Keyboard support for desktop
    this.input.keyboard?.on('keydown-ESC', () => this.onPause());

    // UI Command Bridge listener
    eventBridge.onUICommand((cmd) => {
      switch (cmd.type) {
        case 'startGame':
          this.startGame();
          break;
        case 'restartGame':
          this.restartGame();
          break;
        case 'pauseGame':
          this.onPause();
          break;
        case 'resumeGame':
          this.onResume();
          break;
        case 'selectSkin':
          this.loadSkin(cmd.skinId);
          break;
        case 'toggleMute':
          audioManager.toggleMute();
          break;
      }
    });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isPlaying && !this.isPaused) {
        this.onPause();
      }
    });

    // Notify React that the scene is ready
    eventBridge.emitGameEvent({ type: 'ready' });
  }

  private loadSkin(skinId?: string) {
    const progress = loadProgress();
    const id = skinId || progress.selectedSkin;
    const skin =
      GAME_CONFIG.JELLY_SKINS.find((s) => s.id === id) || GAME_CONFIG.JELLY_SKINS[0];
    this.selectedSkin = skin;
    this.bestDistanceMeters = progress.bestDistance;
    this.totalDiamonds = progress.totalDiamonds;
  }

  private resetWorld() {
    this.segments = [];
    this.pillars = [];
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.jellyX = 0;
    this.jellyY = 0;
    this.jellyZ = 0;
    this.jellyTargetX = 0;
    this.jellyVY = 0;
    this.forwardSpeed = GAME_CONFIG.BASE_SPEED;
    this.isAirborne = false;
    this.canLand = false;
    this.isBoosting = false;
    this.boostTimer = 0;
    this.boostStreak = 0;
    this.diamondsCollected = 0;
    this.distanceMeters = 0;
    this.totalBoosts = 0;
    this.nextMilestone = 100;
    this.coyoteTimer = 0;
    this.hasStartedDragging = false;
    this.currentThemeIndex = 0;
    this.currentTheme = GAME_CONFIG.THEMES[0];
    this.themeTransitionAlpha = 0;
    this.screenFlashAlpha = 0;
    this.applyTheme(0, true);

    const trackW = GAME_CONFIG.TRACK_WIDTH_DEFAULT;

    // 1. Long, exhilarating Warmup Runway (~180m safe zone)
    // Players collect diamonds, hit 2 practice booster pads on solid ground, and get used to controls with 0 risk of dying!
    const warmupDiamonds: { x: number; z: number; collected: boolean }[] = [];
    // Arching diamond trails
    for (let z = 180; z < 480; z += 55) {
      warmupDiamonds.push({ x: Math.sin(z * 0.015) * 50, z, collected: false });
    }
    for (let z = 700; z < 1050; z += 60) {
      warmupDiamonds.push({ x: Math.cos(z * 0.012) * 55, z, collected: false });
    }
    for (let z = 1350; z < 1650; z += 60) {
      warmupDiamonds.push({ x: 0, z, collected: false });
    }

    this.segments.push({
      zStart: -120,
      zEnd: 550,
      width: trackW,
      isGap: false,
      hasBooster: false,
      boosterX: 0,
      boosterHalfW: GAME_CONFIG.BOOSTER_HALF_WIDTH_EARLY,
      boosterHit: false,
      diamonds: warmupDiamonds.filter((d) => d.z < 550),
    });

    // Practice Booster #1 on solid runway
    this.segments.push({
      zStart: 550,
      zEnd: 1100,
      width: trackW,
      isGap: false,
      hasBooster: true,
      boosterX: 0,
      boosterHalfW: GAME_CONFIG.BOOSTER_HALF_WIDTH_EARLY,
      boosterHit: false,
      diamonds: warmupDiamonds.filter((d) => d.z >= 550 && d.z < 1100),
    });

    // Practice Booster #2 on solid runway (slightly offset to encourage steering)
    this.segments.push({
      zStart: 1100,
      zEnd: 1750,
      width: trackW,
      isGap: false,
      hasBooster: true,
      boosterX: 30,
      boosterHalfW: GAME_CONFIG.BOOSTER_HALF_WIDTH_EARLY,
      boosterHit: false,
      diamonds: warmupDiamonds.filter((d) => d.z >= 1100 && d.z < 1750),
    });

    // First gap preparation runway with wide centered booster
    this.segments.push({
      zStart: 1750,
      zEnd: 2150,
      width: trackW,
      isGap: false,
      hasBooster: true,
      boosterX: 0,
      boosterHalfW: GAME_CONFIG.BOOSTER_HALF_WIDTH_EARLY,
      boosterHit: false,
      diamonds: [
        { x: -20, z: 1850, collected: false },
        { x: 0, z: 1920, collected: false },
        { x: 20, z: 1990, collected: false },
      ],
    });

    this.furthestZ = 2150;

    // Build initial pillars on both sides
    for (let z = 0; z < 2400; z += 160) {
      this.pillars.push({
        x: -360 - (z % 80),
        z,
        width: 75,
        height: 260 + (z % 100),
      });
      this.pillars.push({
        x: 360 + (z % 80),
        z,
        width: 75,
        height: 260 + (z % 100),
      });
    }

    // Pre-generate ahead
    this.generateTrackAhead(this.jellyZ + GAME_CONFIG.VISIBLE_DISTANCE);
  }

  private generateTrackAhead(targetZ: number) {
    while (this.furthestZ < targetZ) {
      // 1. Chasm Gap between platforms
      const gapLength = Phaser.Math.Between(
        GAME_CONFIG.GAP_LENGTH_MIN,
        GAME_CONFIG.GAP_LENGTH_MAX
      );
      this.segments.push({
        zStart: this.furthestZ,
        zEnd: this.furthestZ + gapLength,
        width: this.currentTrackWidth,
        isGap: true,
        hasBooster: false,
        boosterX: 0,
        boosterHalfW: 0,
        boosterHit: false,
        diamonds: [],
      });
      this.furthestZ += gapLength;

      // 2. Landing & Connecting Runway Segment
      const segmentLength = Phaser.Math.Between(
        GAME_CONFIG.SEGMENT_LENGTH_MIN,
        GAME_CONFIG.SEGMENT_LENGTH_MAX
      );

      // Early game: wide boosters for generous steering
      const boosterHalfW =
        this.distanceMeters < 500
          ? GAME_CONFIG.BOOSTER_HALF_WIDTH_EARLY
          : GAME_CONFIG.BOOSTER_HALF_WIDTH_LATE;

      // Smooth booster placement (never abrupt wild jumps)
      const maxOffset = this.distanceMeters < 600 ? 50 : 75;
      const boosterX = Phaser.Math.Between(-maxOffset, maxOffset);

      // Distribute diamonds along the runway
      const diamonds: { x: number; z: number; collected: boolean }[] = [];
      const numDiamonds = Phaser.Math.Between(3, 6);
      const laneCenter = boosterX * 0.7;

      for (let d = 0; d < numDiamonds; d++) {
        const dZ = this.furthestZ + 200 + d * 85;
        if (dZ < this.furthestZ + segmentLength - 200) {
          diamonds.push({
            x: laneCenter + Math.sin(d * 0.8) * 35,
            z: dZ,
            collected: false,
          });
        }
      }

      this.segments.push({
        zStart: this.furthestZ,
        zEnd: this.furthestZ + segmentLength,
        width: this.currentTrackWidth,
        isGap: false,
        hasBooster: true,
        boosterX,
        boosterHalfW,
        boosterHit: false,
        diamonds,
      });

      // Flanking aesthetic pillars
      for (let pz = this.furthestZ; pz < this.furthestZ + segmentLength; pz += 180) {
        this.pillars.push({
          x: -360 - (pz % 90),
          z: pz,
          width: 75,
          height: 250 + (pz % 120),
        });
        this.pillars.push({
          x: 360 + (pz % 90),
          z: pz,
          width: 75,
          height: 250 + (pz % 120),
        });
      }

      this.furthestZ += segmentLength;
    }

    // Clean up segments that are far behind the player
    const minZ = this.jellyZ - 500;
    this.segments = this.segments.filter((s) => s.zEnd > minZ);
    this.pillars = this.pillars.filter((p) => p.z > minZ);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (this.isDead || this.isPaused) return;

    if (!this.isPlaying) {
      this.startGame();
    }

    this.isDragging = true;
    this.hasStartedDragging = true;
    this.dragStartX = pointer.x;
    this.dragStartJellyX = this.jellyTargetX;
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging || this.isDead || this.isPaused) return;

    // Mobile touch sensitivity optimization for effortless one-thumb steering
    const sensitivity =
      this.scale.width < 520
        ? GAME_CONFIG.DRAG_SENSITIVITY * 1.25
        : GAME_CONFIG.DRAG_SENSITIVITY;
    const deltaX = (pointer.x - this.dragStartX) * sensitivity;
    let target = this.dragStartJellyX + deltaX;

    // Magnetic Edge Resistance: soften pull past track edge
    const halfW = this.currentTrackWidth * 0.5;
    if (Math.abs(target) > halfW - GAME_CONFIG.EDGE_RESISTANCE_ZONE) {
      const over = Math.abs(target) - (halfW - GAME_CONFIG.EDGE_RESISTANCE_ZONE);
      const sign = Math.sign(target);
      target = sign * (halfW - GAME_CONFIG.EDGE_RESISTANCE_ZONE + over * 0.4);
    }

    this.jellyTargetX = Phaser.Math.Clamp(
      target,
      -GAME_CONFIG.MAX_LATERAL_OFFSET,
      GAME_CONFIG.MAX_LATERAL_OFFSET
    );
  }

  startGame() {
    if (this.isPlaying) return;
    if (this.isDead || this.distanceMeters > 0 || this.segments.length === 0 || this.jellyY < -100) {
      this.resetWorld();
      this.loadSkin();
    }
    this.isPlaying = true;
    this.isDead = false;
    this.isPaused = false;
    audioManager.init();
    eventBridge.emitGameEvent({ type: 'gameStart' });
  }

  restartGame() {
    this.resetWorld();
    this.loadSkin();
    this.isPlaying = false;
    this.isDead = false;
    this.isPaused = false;
    eventBridge.emitGameEvent({ type: 'ready' });
  }

  private onPause() {
    if (!this.isPlaying || this.isDead) return;
    this.isPaused = true;
    eventBridge.emitGameEvent({ type: 'pause' });
  }

  private onResume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    eventBridge.emitGameEvent({ type: 'resume' });
  }

  private triggerBooster(segment: TrackSegment) {
    segment.boosterHit = true;
    this.isBoosting = true;
    this.isAirborne = true;
    this.canLand = true;
    this.boostTimer = 0.95;
    this.boostStreak++;
    this.totalBoosts++;

    // Find if there is a gap immediately following this segment
    const nextSegIndex = this.segments.findIndex((s) => s.zStart >= segment.zEnd);
    let targetLandingZ = this.jellyZ + 750;

    if (nextSegIndex !== -1 && this.segments[nextSegIndex].isGap) {
      const gapSeg = this.segments[nextSegIndex];
      // Target landing: comfortably on the runway 180 units past the gap start
      targetLandingZ = gapSeg.zEnd + 180;
    }

    // Mathematically guaranteed jump clearance
    const flightDist = Math.max(700, targetLandingZ - this.jellyZ);
    const flightTime = 1.05; // Perfect 1.05s air time
    this.forwardSpeed = flightDist / flightTime;
    this.jellyVY = (GAME_CONFIG.GRAVITY * flightTime) * 0.5;

    // Squash & Stretch
    this.squashFactor = 0.55;
    this.stretchFactor = 1.55;

    // Audio effect with streak pitch escalation
    audioManager.boost(this.boostStreak);

    // Camera shake impact juice
    this.cameras.main.shake(160, 0.007);

    // Spawn speed burst particles & floating combo text
    this.spawnSpeedBurstParticles();

    // Floating Combo Text Popup
    let comboLabel = 'BOOST!';
    if (this.boostStreak === 2) comboLabel = 'DOUBLE BOOST x2!';
    else if (this.boostStreak === 3) comboLabel = 'SUPER BOOST x3!';
    else if (this.boostStreak === 4) comboLabel = 'MEGA SURGE x4!';
    else if (this.boostStreak >= 5) comboLabel = `HYPER BOOST x${this.boostStreak}!`;

    this.floatingTexts.push({
      x: this.jellyX,
      y: 60,
      z: this.jellyZ + 80,
      text: comboLabel,
      color: '#00f0ff',
      alpha: 1,
      scale: 1.4,
      vy: 45,
    });

    eventBridge.emitGameEvent({
      type: 'boost',
      streak: this.boostStreak,
    });
  }

  private spawnSpeedBurstParticles() {
    for (let i = 0; i < 36; i++) {
      this.particles.push({
        x: this.jellyX + Phaser.Math.Between(-50, 50),
        y: this.jellyY + Phaser.Math.Between(5, 45),
        z: this.jellyZ + Phaser.Math.Between(-30, 80),
        vx: Phaser.Math.Between(-60, 60),
        vy: Phaser.Math.Between(-25, 40),
        vz: Phaser.Math.Between(-200, -500),
        alpha: 1,
        color: this.currentTheme.boosterColor,
        size: Phaser.Math.Between(3, 7),
      });
    }
  }

  private spawnDiamondCollectBurst(x: number, y: number, z: number) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = Phaser.Math.Between(40, 90);
      this.particles.push({
        x,
        y,
        z,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 30,
        vz: Phaser.Math.Between(-60, 60),
        alpha: 1,
        color: 0x00f0ff,
        size: Phaser.Math.Between(3, 6),
      });
    }

    // Floating "+1 💎" text
    this.floatingTexts.push({
      x,
      y: y + 25,
      z,
      text: '+1 💎',
      color: '#00f0ff',
      alpha: 1,
      scale: 1.1,
      vy: 35,
    });
  }

  private onFall() {
    if (this.isDead) return;
    this.isDead = true;
    this.isPlaying = false;
    this.isDragging = false;

    audioManager.fall();

    // Persist progress and calculate game over summary
    const result = updateAfterRun(
      this.distanceMeters,
      this.diamondsCollected,
      this.totalBoosts,
      this.boostStreak
    );

    if (result.isNewRecord) {
      audioManager.newRecord();
    }

    eventBridge.emitGameEvent({
      type: 'gameOver',
      distance: this.distanceMeters,
      bestDistance: result.progress.bestDistance,
      diamondsCollected: this.diamondsCollected,
      totalDiamonds: result.progress.totalDiamonds,
      isNewRecord: result.isNewRecord,
      newUnlocks: result.newUnlocks,
    });
  }

  private applyTheme(index: number, immediate = false) {
    const theme = GAME_CONFIG.THEMES[index % GAME_CONFIG.THEMES.length];
    this.currentThemeIndex = index;
    this.currentTheme = theme;

    this.currentSkyTop = theme.skyTop;
    this.currentSkyBottom = theme.skyBottom;
    this.currentTrackColor = theme.trackColor;
    this.currentTrackEdge = theme.trackEdgeColor;
    this.currentPillarColor = theme.pillarColor;

    if (!immediate) {
      audioManager.themeShift();
      this.screenFlashAlpha = 0.45;
      this.floatingTexts.push({
        x: 0,
        y: 80,
        z: this.jellyZ + 120,
        text: `ZONE: ${theme.name.toUpperCase()}`,
        color: '#ffea00',
        alpha: 1,
        scale: 1.6,
        vy: 30,
      });
    }
  }

  private checkMilestones() {
    if (this.distanceMeters >= this.nextMilestone) {
      const milestoneReached = this.nextMilestone;
      audioManager.milestone();
      this.cameras.main.shake(120, 0.005);
      this.screenFlashAlpha = 0.35;

      this.floatingTexts.push({
        x: 0,
        y: 90,
        z: this.jellyZ + 100,
        text: `★ ${milestoneReached}m MILESTONE! ★`,
        color: '#ffd700',
        alpha: 1,
        scale: 1.8,
        vy: 35,
      });

      eventBridge.emitGameEvent({
        type: 'milestone',
        distance: milestoneReached,
        label: `${milestoneReached}m REACHED!`,
      });

      // Next milestone interval (100, 250, 500, 750, 1000, 1250...)
      if (this.nextMilestone === 100) this.nextMilestone = 250;
      else if (this.nextMilestone === 250) this.nextMilestone = 500;
      else this.nextMilestone += 250;
    }
  }

  private checkThemeProgression() {
    for (let i = GAME_CONFIG.THEMES.length - 1; i >= 0; i--) {
      if (this.distanceMeters >= GAME_CONFIG.THEMES[i].distanceMin) {
        if (this.currentThemeIndex !== i) {
          this.applyTheme(i);
        }
        break;
      }
    }
  }

  // 3D Perspective Projection Engine (World x,y,z -> Screen x,y,scale)
  private project(
    x: number,
    y: number,
    z: number,
    screenW: number,
    screenH: number
  ): ProjectedPoint | null {
    const relZ = z - this.camZ;
    if (relZ <= 10) return null;

    const scale = this.camFOV / relZ;
    const horizonY = screenH * GAME_CONFIG.HORIZON_Y_RATIO;
    const screenX = screenW * 0.5 + (x - this.camX) * scale;
    const screenY = horizonY + (this.camY - y) * scale;

    return { x: screenX, y: screenY, scale, relZ };
  }

  // Helper method to fill a 4-point quad safely
  private fillQuad(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number },
    color: number,
    alpha: number
  ) {
    this.worldGraphics.fillStyle(color, alpha);
    this.worldGraphics.beginPath();
    this.worldGraphics.moveTo(p1.x, p1.y);
    this.worldGraphics.lineTo(p2.x, p2.y);
    this.worldGraphics.lineTo(p3.x, p3.y);
    this.worldGraphics.lineTo(p4.x, p4.y);
    this.worldGraphics.closePath();
    this.worldGraphics.fillPath();
  }

  // Helper method to fill an arbitrary polygon safely
  private fillPoly(
    points: { x: number; y: number }[],
    color: number,
    alpha: number
  ) {
    if (points.length < 3) return;
    this.worldGraphics.fillStyle(color, alpha);
    this.worldGraphics.beginPath();
    this.worldGraphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.worldGraphics.lineTo(points[i].x, points[i].y);
    }
    this.worldGraphics.closePath();
    this.worldGraphics.fillPath();
  }

  update(_time: number, delta: number) {
    const dt = Math.min(delta / 1000, 0.1);
    const screenW = this.scale.width;
    const screenH = this.scale.height;

    // Rainbow hue animation
    if (this.selectedSkin.id === 'rainbow-cube') {
      this.rainbowHue = (this.rainbowHue + dt * 90) % 360;
    }

    // Diamond gentle rotation
    this.diamondRotation += dt * 3.5;

    // Screen flash decay
    if (this.screenFlashAlpha > 0) {
      this.screenFlashAlpha = Math.max(0, this.screenFlashAlpha - dt * 2);
    }

    // Desktop keyboard steering (Arrow keys & A/D)
    const cursors = this.input.keyboard?.createCursorKeys();
    const keyA = this.input.keyboard?.addKey('A');
    const keyD = this.input.keyboard?.addKey('D');

    if (cursors || keyA || keyD) {
      const leftDown = cursors?.left.isDown || keyA?.isDown;
      const rightDown = cursors?.right.isDown || keyD?.isDown;

      if (leftDown) {
        this.jellyTargetX = Math.max(
          -GAME_CONFIG.MAX_LATERAL_OFFSET,
          this.jellyTargetX - 440 * dt
        );
        this.hasStartedDragging = true;
      } else if (rightDown) {
        this.jellyTargetX = Math.min(
          GAME_CONFIG.MAX_LATERAL_OFFSET,
          this.jellyTargetX + 440 * dt
        );
        this.hasStartedDragging = true;
      }
    }

    if (this.isPlaying && !this.isPaused && !this.isDead) {
      // 1. Lateral smooth steering towards target
      this.jellyX += (this.jellyTargetX - this.jellyX) * 16 * dt;

      // 2. Forward movement & speed progression
      const targetSpeed = Math.min(
        GAME_CONFIG.MAX_SPEED,
        GAME_CONFIG.BASE_SPEED + this.distanceMeters * 0.35
      );
      if (!this.isBoosting) {
        this.forwardSpeed += (targetSpeed - this.forwardSpeed) * 3.5 * dt;
      }

      this.jellyZ += this.forwardSpeed * dt;
      this.distanceMeters = Math.floor(this.jellyZ / 10);

      // Check milestones & themes
      this.checkMilestones();
      this.checkThemeProgression();

      // 3. Boosting & Jump Physics
      if (this.isBoosting) {
        this.boostTimer -= dt;
        if (this.boostTimer <= 0) {
          this.isBoosting = false;
        }
      }

      if (this.isAirborne) {
        this.jellyVY -= GAME_CONFIG.GRAVITY * dt;
        this.jellyY += this.jellyVY * dt;

        // Check landing condition (only if jumping from a booster and descending from above)
        if (this.canLand && this.jellyY <= 0 && this.jellyY >= -30 && this.jellyVY <= 0) {
          // Find if there is a valid non-gap track segment beneath
          const currentSeg = this.segments.find(
            (s) => this.jellyZ >= s.zStart && this.jellyZ <= s.zEnd
          );

          if (currentSeg && !currentSeg.isGap) {
            // Check lateral boundary with generous landing grace (+20 units)
            const halfW = currentSeg.width * 0.5 + 20;
            if (this.jellyX >= -halfW && this.jellyX <= halfW) {
              // Safe landing!
              this.jellyY = 0;
              this.jellyVY = 0;
              this.isAirborne = false;
              this.canLand = false;
              this.squashFactor = 1.4;
              this.stretchFactor = 0.7;
              this.coyoteTimer = 0;
              audioManager.land();
              this.cameras.main.shake(90, 0.0035);

              // Spawn Landing Shockwave Ring
              this.shockwaves.push({
                x: this.jellyX,
                z: this.jellyZ,
                radius: 12,
                maxRadius: 65,
                alpha: 0.9,
                color: this.currentTheme.trackEdgeColor,
              });

              // Dust puff particles
              for (let i = 0; i < 12; i++) {
                this.particles.push({
                  x: this.jellyX + Phaser.Math.Between(-20, 20),
                  y: 2,
                  z: this.jellyZ + Phaser.Math.Between(-15, 15),
                  vx: (i % 2 === 0 ? 1 : -1) * Phaser.Math.Between(40, 90),
                  vy: Phaser.Math.Between(10, 30),
                  vz: Phaser.Math.Between(-30, 30),
                  alpha: 0.8,
                  color: 0xffffff,
                  size: 4,
                });
              }
            }
          }
        }
      } else {
        // Grounded: verify that the track is still underneath
        const currentSeg = this.segments.find(
          (s) => this.jellyZ >= s.zStart && this.jellyZ <= s.zEnd
        );

        if (!currentSeg || currentSeg.isGap) {
          // Missed the booster pad and drove off the edge into a bottomless chasm!
          this.isAirborne = true;
          this.canLand = false; // Cannot land without boosting!
          this.jellyVY = -320; // Immediate plunge into the void
        } else {
          this.coyoteTimer = 0;
          const halfW = currentSeg.width * 0.5;

          // Edge scrape warning & friction particles
          if (Math.abs(this.jellyX) > halfW - 16) {
            const now = Date.now();
            if (now - this.lastEdgeScrapeTime > 300) {
              audioManager.edgeScrape();
              this.lastEdgeScrapeTime = now;
            }
            this.particles.push({
              x: this.jellyX,
              y: 2,
              z: this.jellyZ,
              vx: (this.jellyX > 0 ? -1 : 1) * Phaser.Math.Between(20, 50),
              vy: Phaser.Math.Between(10, 30),
              vz: -80,
              alpha: 0.9,
              color: 0xffe600,
              size: 3,
            });
          }

          if (Math.abs(this.jellyX) > halfW + GAME_CONFIG.EDGE_FALL_THRESHOLD) {
            // Veered too far off the edge into the void!
            this.isAirborne = true;
            this.canLand = false;
            this.jellyVY = -320;
          }
        }
      }

      // Check game over fall threshold
      if (this.jellyY < -280) {
        this.onFall();
      }

      // Check collision with Booster Chevron Pads
      for (const seg of this.segments) {
        if (
          seg.hasBooster &&
          !seg.boosterHit &&
          this.jellyZ >= seg.zEnd - 200 &&
          this.jellyZ <= seg.zEnd - 30
        ) {
          // Check lateral hit requiring player steering
          const distToBooster = Math.abs(this.jellyX - seg.boosterX);
          if (distToBooster <= seg.boosterHalfW) {
            this.triggerBooster(seg);
            break;
          }
        }
      }

      // Check collision with Cyan Diamonds
      for (const seg of this.segments) {
        for (const dia of seg.diamonds) {
          if (!dia.collected && Math.abs(this.jellyZ - dia.z) < 42) {
            if (Math.abs(this.jellyX - dia.x) < 45) {
              dia.collected = true;
              this.diamondsCollected++;
              this.totalDiamonds++;
              audioManager.diamond();
              this.spawnDiamondCollectBurst(dia.x, 26, dia.z);

              eventBridge.emitGameEvent({
                type: 'diamond',
                totalDiamonds: this.totalDiamonds,
              });
            }
          }
        }
      }

      // Emit continuous ground slime skid particles
      if (!this.isAirborne && Math.random() < 0.4) {
        this.particles.push({
          x: this.jellyX + Phaser.Math.Between(-12, 12),
          y: 1,
          z: this.jellyZ - 18,
          vx: Phaser.Math.Between(-15, 15),
          vy: Phaser.Math.Between(4, 12),
          vz: -120,
          alpha: 0.6,
          color: this.selectedSkin.color,
          size: 3,
        });
      }

      // Restore squash / stretch factors smoothly
      this.squashFactor += (1 - this.squashFactor) * 8 * dt;
      this.stretchFactor += (1 - this.stretchFactor) * 8 * dt;

      // Camera follow with dynamic chase lag & speed stretch (aspect-ratio adaptive for mobile portrait)
      const baseFOV =
        screenW < 520
          ? Math.max(220, Math.min(GAME_CONFIG.FOV, screenW * 0.68))
          : GAME_CONFIG.FOV;
      const targetFOV = this.isBoosting ? baseFOV * 1.15 : baseFOV;
      this.camFOV += (targetFOV - this.camFOV) * 6 * dt;

      this.camZ = this.jellyZ - GAME_CONFIG.CAMERA_DISTANCE;
      this.camX += (this.jellyX * 0.45 - this.camX) * 12 * dt;
      const targetCamY =
        Math.max(0, this.jellyY * 0.55) + GAME_CONFIG.CAMERA_HEIGHT;
      this.camY += (targetCamY - this.camY) * 9 * dt;

      // Generate more world ahead
      this.generateTrackAhead(this.jellyZ + GAME_CONFIG.VISIBLE_DISTANCE);

      // Emit continuous score update
      eventBridge.emitGameEvent({
        type: 'score',
        distance: this.distanceMeters,
        diamonds: this.diamondsCollected,
        streak: this.boostStreak,
        theme: this.currentTheme.name,
        isBoosting: this.isBoosting,
      });
    }

    // Render 3D World Scene
    this.renderScene(screenW, screenH, dt);
  }

  private renderScene(screenW: number, screenH: number, dt: number) {
    this.bgGraphics.clear();
    this.worldGraphics.clear();
    this.uiGraphics.clear();

    const horizonY = screenH * GAME_CONFIG.HORIZON_Y_RATIO;

    // 1. Background Sky & Horizon Haze
    const steps = 14;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const r = Math.round(
        Phaser.Math.Linear(
          (this.currentSkyTop >> 16) & 0xff,
          (this.currentSkyBottom >> 16) & 0xff,
          t
        )
      );
      const g = Math.round(
        Phaser.Math.Linear(
          (this.currentSkyTop >> 8) & 0xff,
          (this.currentSkyBottom >> 8) & 0xff,
          t
        )
      );
      const b = Math.round(
        Phaser.Math.Linear(
          this.currentSkyTop & 0xff,
          this.currentSkyBottom & 0xff,
          t
        )
      );
      const color = (r << 16) | (g << 8) | b;
      this.bgGraphics.fillStyle(color, 1);
      this.bgGraphics.fillRect(0, (horizonY / steps) * i, screenW, horizonY / steps + 2);
    }

    // Horizon glow band
    this.bgGraphics.fillStyle(this.currentTheme.fogColor, 0.45);
    this.bgGraphics.fillRect(0, horizonY - 45, screenW, 90);

    // Abyss bottom floor gradient
    this.bgGraphics.fillStyle(this.currentTheme.fogColor, 1);
    this.bgGraphics.fillRect(0, horizonY, screenW, screenH - horizonY);

    // 2. Render Flanking Pillars (depth sorted)
    for (const p of this.pillars) {
      if (p.z < this.camZ + 10 || p.z > this.camZ + GAME_CONFIG.VISIBLE_DISTANCE) continue;

      const pBottom = this.project(p.x, -p.height, p.z, screenW, screenH);
      const pTop = this.project(p.x, 80, p.z, screenW, screenH);

      if (!pBottom || !pTop) continue;

      const halfW = p.width * 0.5 * pBottom.scale;
      const alpha = Phaser.Math.Clamp(
        1.1 - pBottom.relZ / GAME_CONFIG.VISIBLE_DISTANCE,
        0.1,
        0.85
      );

      this.worldGraphics.fillStyle(this.currentPillarColor, alpha);
      this.worldGraphics.fillRect(
        pBottom.x - halfW,
        pTop.y,
        halfW * 2,
        pBottom.y - pTop.y
      );

      // Glowing pillar edge highlight
      this.worldGraphics.lineStyle(1.5, this.currentTrackEdge, alpha * 0.4);
      this.worldGraphics.strokeRect(
        pBottom.x - halfW,
        pTop.y,
        halfW * 2,
        pBottom.y - pTop.y
      );
    }

    // 3. Render Suspended Runway Segments (Furthest to Nearest for proper depth)
    const visibleSegments = this.segments
      .filter(
        (s) =>
          s.zEnd > this.camZ + 10 &&
          s.zStart < this.camZ + GAME_CONFIG.VISIBLE_DISTANCE
      )
      .sort((a, b) => b.zStart - a.zStart);

    for (const seg of visibleSegments) {
      if (seg.isGap) continue; // Chasms are open air!

      const halfW = seg.width * 0.5;
      const subStep = 80;

      for (let z = Math.max(seg.zStart, this.camZ + 12); z < seg.zEnd; z += subStep) {
        const nextZ = Math.min(z + subStep, seg.zEnd);

        const p1L = this.project(-halfW, 0, z, screenW, screenH);
        const p1R = this.project(halfW, 0, z, screenW, screenH);
        const p2L = this.project(-halfW, 0, nextZ, screenW, screenH);
        const p2R = this.project(halfW, 0, nextZ, screenW, screenH);

        if (!p1L || !p1R || !p2L || !p2R) continue;

        const depthAlpha = Phaser.Math.Clamp(
          1.2 - p1L.relZ / GAME_CONFIG.VISIBLE_DISTANCE,
          0.15,
          1
        );

        // Track surface quad
        this.fillQuad(p1L, p1R, p2R, p2L, this.currentTrackColor, depthAlpha);

        // Bevel side edge thickness (depth extrusion)
        const p1L_Down = this.project(-halfW, -22, z, screenW, screenH);
        const p2L_Down = this.project(-halfW, -22, nextZ, screenW, screenH);
        const p1R_Down = this.project(halfW, -22, z, screenW, screenH);
        const p2R_Down = this.project(halfW, -22, nextZ, screenW, screenH);

        if (p1L_Down && p2L_Down) {
          this.fillQuad(p1L, p2L, p2L_Down, p1L_Down, 0x0a141b, depthAlpha * 0.8);
        }
        if (p1R_Down && p2R_Down) {
          this.fillQuad(p1R, p2R, p2R_Down, p1R_Down, 0x0a141b, depthAlpha * 0.8);
        }

        // Glowing neon track edge lines
        this.worldGraphics.lineStyle(2.5, this.currentTrackEdge, depthAlpha * 0.95);
        this.worldGraphics.strokeLineShape(
          new Phaser.Geom.Line(p1L.x, p1L.y, p2L.x, p2L.y)
        );
        this.worldGraphics.strokeLineShape(
          new Phaser.Geom.Line(p1R.x, p1R.y, p2R.x, p2R.y)
        );
      }

      // Render Chevron Booster Pads (>>>)
      if (seg.hasBooster) {
        const boosterZ = seg.zEnd - 120;
        const bHalfW = seg.boosterHalfW;
        const bP1 = this.project(seg.boosterX - bHalfW, 2, boosterZ, screenW, screenH);
        const bP2 = this.project(seg.boosterX + bHalfW, 2, boosterZ, screenW, screenH);
        const bP3 = this.project(seg.boosterX + bHalfW, 2, boosterZ + 80, screenW, screenH);
        const bP4 = this.project(seg.boosterX - bHalfW, 2, boosterZ + 80, screenW, screenH);

        if (bP1 && bP2 && bP3 && bP4) {
          const boosterAlpha = Phaser.Math.Clamp(
            1.25 - bP1.relZ / GAME_CONFIG.VISIBLE_DISTANCE,
            0.2,
            1
          );

          // Glowing booster base plate
          this.fillQuad(bP1, bP2, bP3, bP4, 0x000000, boosterAlpha * 0.6);
          this.worldGraphics.lineStyle(2, this.currentTheme.boosterColor, boosterAlpha);
          this.worldGraphics.strokeLineShape(new Phaser.Geom.Line(bP1.x, bP1.y, bP2.x, bP2.y));
          this.worldGraphics.strokeLineShape(new Phaser.Geom.Line(bP2.x, bP2.y, bP3.x, bP3.y));
          this.worldGraphics.strokeLineShape(new Phaser.Geom.Line(bP3.x, bP3.y, bP4.x, bP4.y));
          this.worldGraphics.strokeLineShape(new Phaser.Geom.Line(bP4.x, bP4.y, bP1.x, bP1.y));

          // Draw 3 Forward Chevrons (>>>)
          const chevronSpan = bHalfW * 0.7;
          for (let c = 0; c < 3; c++) {
            const cz = boosterZ + 15 + c * 24;
            const cTip = this.project(seg.boosterX, 3, cz + 18, screenW, screenH);
            const cL = this.project(seg.boosterX - chevronSpan, 3, cz, screenW, screenH);
            const cR = this.project(seg.boosterX + chevronSpan, 3, cz, screenW, screenH);

            if (cTip && cL && cR) {
              this.worldGraphics.lineStyle(
                4 * cTip.scale,
                this.currentTheme.boosterColor,
                boosterAlpha
              );
              this.worldGraphics.strokeLineShape(
                new Phaser.Geom.Line(cL.x, cL.y, cTip.x, cTip.y)
              );
              this.worldGraphics.strokeLineShape(
                new Phaser.Geom.Line(cR.x, cR.y, cTip.x, cTip.y)
              );
            }
          }
        }
      }

      // Render Cyan Diamonds (💎)
      for (const dia of seg.diamonds) {
        if (dia.collected) continue;

        const dProj = this.project(dia.x, 26, dia.z, screenW, screenH);
        if (!dProj || dProj.relZ > GAME_CONFIG.VISIBLE_DISTANCE) continue;

        const dSize = GAME_CONFIG.DIAMOND_SIZE * dProj.scale;
        const diaAlpha = Phaser.Math.Clamp(
          1.2 - dProj.relZ / GAME_CONFIG.VISIBLE_DISTANCE,
          0.2,
          1
        );

        // Draw glowing octahedron diamond
        const rot = this.diamondRotation;
        const dx1 = Math.cos(rot) * dSize;
        const dy1 = Math.sin(rot) * dSize * 0.3;

        this.fillPoly(
          [
            { x: dProj.x, y: dProj.y - dSize * 1.25 },
            { x: dProj.x + dx1, y: dProj.y + dy1 },
            { x: dProj.x, y: dProj.y + dSize * 1.25 },
            { x: dProj.x - dx1, y: dProj.y - dy1 },
          ],
          0x00f0ff,
          diaAlpha * 0.95
        );

        // Highlight facet
        this.fillPoly(
          [
            { x: dProj.x, y: dProj.y - dSize * 1.25 },
            { x: dProj.x + dx1 * 0.5, y: dProj.y + dy1 * 0.5 },
            { x: dProj.x, y: dProj.y },
          ],
          0xffffff,
          diaAlpha * 0.75
        );
      }
    }

    // 4. Render Shockwaves on track floor
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += dt * 140;
      sw.alpha -= dt * 2.8;

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      const pCenter = this.project(sw.x, 2, sw.z, screenW, screenH);
      if (pCenter) {
        const rx = sw.radius * pCenter.scale;
        const ry = sw.radius * 0.45 * pCenter.scale;
        this.worldGraphics.lineStyle(2.5, sw.color, sw.alpha);
        this.worldGraphics.strokeEllipse(pCenter.x, pCenter.y, rx * 2, ry * 2);
      }
    }

    // 5. Render Speed Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.alpha -= dt * 1.9;

      if (p.alpha <= 0 || p.z < this.camZ + 10) {
        this.particles.splice(i, 1);
        continue;
      }

      const pProj = this.project(p.x, p.y, p.z, screenW, screenH);
      if (pProj) {
        const radius = Math.max(1.5, (p.size || 4) * pProj.scale);
        this.worldGraphics.fillStyle(p.color, p.alpha);
        this.worldGraphics.fillCircle(pProj.x, pProj.y, radius);
      }
    }

    // 6. Render Jelly 3D Cube Character
    this.renderJellyCube(screenW, screenH);

    // 7. Render Hyperspace Speed Lines during Boost
    if (this.isBoosting || this.forwardSpeed > 680) {
      this.renderSpeedLines(screenW, screenH);
    }

    // 8. Render Floating Texts in World Space
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= dt * 0.95;

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      const fProj = this.project(ft.x, ft.y, ft.z, screenW, screenH);
      if (fProj) {
        const fontSize = Math.max(12, Math.round(18 * fProj.scale * ft.scale));
        // Use Phaser text rendering or Graphics for floating text
        // We render a stylish bold banner box
        const textW = ft.text.length * (fontSize * 0.65);
        const textH = fontSize * 1.3;

        this.uiGraphics.fillStyle(0x0c2531, ft.alpha * 0.75);
        this.uiGraphics.fillRoundedRect(
          fProj.x - textW * 0.5 - 8,
          fProj.y - textH * 0.5 - 4,
          textW + 16,
          textH + 8,
          8
        );
        this.uiGraphics.lineStyle(1.5, this.currentTheme.boosterColor, ft.alpha * 0.9);
        this.uiGraphics.strokeRoundedRect(
          fProj.x - textW * 0.5 - 8,
          fProj.y - textH * 0.5 - 4,
          textW + 16,
          textH + 8,
          8
        );
      }
    }

    // 9. Full Screen Flash on Milestones / Transitions
    if (this.screenFlashAlpha > 0) {
      this.uiGraphics.fillStyle(0xffffff, this.screenFlashAlpha);
      this.uiGraphics.fillRect(0, 0, screenW, screenH);
    }
  }

  private renderSpeedLines(screenW: number, screenH: number) {
    const horizonY = screenH * GAME_CONFIG.HORIZON_Y_RATIO;
    const centerX = screenW * 0.5;
    const centerY = horizonY;

    this.uiGraphics.lineStyle(2, this.currentTheme.boosterColor, 0.45);
    const numLines = 20;

    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2 + (this.jellyZ * 0.005);
      const startDist = 80 + (i % 5) * 30;
      const endDist = startDist + 180 + (i % 3) * 60;

      const x1 = centerX + Math.cos(angle) * startDist;
      const y1 = centerY + Math.sin(angle) * startDist * 0.6;
      const x2 = centerX + Math.cos(angle) * endDist;
      const y2 = centerY + Math.sin(angle) * endDist * 0.6;

      this.uiGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
    }
  }

  private renderJellyCube(screenW: number, screenH: number) {
    const s = GAME_CONFIG.JELLY_SIZE;
    const halfS = s * 0.5;

    // Apply squash and stretch
    const curW = halfS * this.squashFactor;
    const curH = s * this.stretchFactor;

    // 1. Jelly Shadow on ground (only if not fallen way below)
    if (this.jellyY >= -40) {
      const shadowProj = this.project(this.jellyX, 1, this.jellyZ, screenW, screenH);
      if (shadowProj) {
        const shadowScale = Math.max(0.25, 1 - Math.max(0, this.jellyY) / 260);
        const shadowW = curW * 2.2 * shadowProj.scale * shadowScale;
        const shadowH = curW * 1.2 * shadowProj.scale * shadowScale;

        this.worldGraphics.fillStyle(0x000000, 0.4 * shadowScale);
        this.worldGraphics.fillEllipse(
          shadowProj.x,
          shadowProj.y,
          shadowW,
          shadowH
        );
      }
    }

    // 2. 3D Cube Corners with dynamic banking tilt
    const bankTilt = Phaser.Math.Clamp((this.jellyTargetX - this.jellyX) * 0.06, -5, 5);
    const pFrontBottomL = this.project(this.jellyX - curW, this.jellyY - bankTilt * 0.4, this.jellyZ - halfS, screenW, screenH);
    const pFrontBottomR = this.project(this.jellyX + curW, this.jellyY + bankTilt * 0.4, this.jellyZ - halfS, screenW, screenH);
    const pFrontTopL = this.project(this.jellyX - curW, this.jellyY + curH - bankTilt * 0.4, this.jellyZ - halfS, screenW, screenH);
    const pFrontTopR = this.project(this.jellyX + curW, this.jellyY + curH + bankTilt * 0.4, this.jellyZ - halfS, screenW, screenH);

    const pBackTopL = this.project(this.jellyX - curW, this.jellyY + curH - bankTilt * 0.4, this.jellyZ + halfS, screenW, screenH);
    const pBackTopR = this.project(this.jellyX + curW, this.jellyY + curH + bankTilt * 0.4, this.jellyZ + halfS, screenW, screenH);

    if (!pFrontBottomL || !pFrontBottomR || !pFrontTopL || !pFrontTopR || !pBackTopL || !pBackTopR) {
      return;
    }

    // Determine colors
    let mainColor: number = this.selectedSkin.color;
    let topColor: number = this.selectedSkin.topColor;
    let sideColor: number = this.selectedSkin.sideColor;

    if (this.selectedSkin.id === 'rainbow-cube') {
      const c = Phaser.Display.Color.HSLToColor(this.rainbowHue / 360, 0.85, 0.6);
      mainColor = c.color;
      topColor = 0xffffff;
      sideColor = c.color;
    }

    // Top Face
    this.fillQuad(pFrontTopL, pFrontTopR, pBackTopR, pBackTopL, topColor, 0.95);

    // Front Face
    this.fillQuad(pFrontBottomL, pFrontBottomR, pFrontTopR, pFrontTopL, mainColor, 1);

    // Right / Left Side Faces depending on camera angle
    if (this.camX < this.jellyX) {
      const pBackBottomL = this.project(this.jellyX - curW, this.jellyY, this.jellyZ + halfS, screenW, screenH);
      if (pBackBottomL) {
        this.fillQuad(pFrontBottomL, pBackBottomL, pBackTopL, pFrontTopL, sideColor, 0.95);
      }
    } else {
      const pBackBottomR = this.project(this.jellyX + curW, this.jellyY, this.jellyZ + halfS, screenW, screenH);
      if (pBackBottomR) {
        this.fillQuad(pFrontBottomR, pBackBottomR, pBackTopR, pFrontTopR, sideColor, 0.95);
      }
    }

    // Front Face: Expressive Cyclops Eye
    const faceCenterX = (pFrontTopL.x + pFrontBottomR.x) * 0.5;
    const faceCenterY = (pFrontTopL.y + pFrontBottomR.y) * 0.5;
    const eyeScale = (pFrontBottomR.x - pFrontBottomL.x) * 0.2;

    if (!this.isDead) {
      // Dynamic Eye Tracking: pupil looks in the steering direction
      const steerDelta = Phaser.Math.Clamp(
        (this.jellyTargetX - this.jellyX) * 0.08,
        -eyeScale * 0.4,
        eyeScale * 0.4
      );

      // Eye White sclera
      this.worldGraphics.fillStyle(0xffffff, 1);
      this.worldGraphics.fillCircle(faceCenterX, faceCenterY - eyeScale * 0.25, eyeScale);

      // Dark pupil with state-dependent dilation
      const pupilScale = this.isAirborne ? 0.7 : 0.55;
      this.worldGraphics.fillStyle(this.selectedSkin.eyeColor, 1);
      this.worldGraphics.fillCircle(
        faceCenterX + steerDelta,
        faceCenterY - eyeScale * 0.25,
        eyeScale * pupilScale
      );

      // Specular highlight sparkle
      this.worldGraphics.fillStyle(0xffffff, 0.95);
      this.worldGraphics.fillCircle(
        faceCenterX + steerDelta - eyeScale * 0.2,
        faceCenterY - eyeScale * 0.45,
        eyeScale * 0.22
      );
    } else {
      // Dead / Sad droopy eyes on game over
      this.worldGraphics.lineStyle(3, this.selectedSkin.eyeColor, 1);
      this.worldGraphics.strokeLineShape(
        new Phaser.Geom.Line(
          faceCenterX - eyeScale,
          faceCenterY,
          faceCenterX - eyeScale * 0.2,
          faceCenterY + eyeScale * 0.5
        )
      );
      this.worldGraphics.strokeLineShape(
        new Phaser.Geom.Line(
          faceCenterX + eyeScale,
          faceCenterY,
          faceCenterX + eyeScale * 0.2,
          faceCenterY + eyeScale * 0.5
        )
      );

      // Tear droplet
      this.worldGraphics.fillStyle(0x00f0ff, 0.85);
      this.worldGraphics.fillCircle(
        faceCenterX + eyeScale * 0.6,
        faceCenterY + eyeScale * 0.8,
        eyeScale * 0.25
      );
    }
  }
}
