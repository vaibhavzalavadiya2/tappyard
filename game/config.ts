// Game configuration constants for Jump Jelly Jump! 3D Runner
export const GAME_CONFIG = {
  // Perspective & Camera
  FOV: 320,
  CAMERA_HEIGHT: 155,
  CAMERA_DISTANCE: 210,
  HORIZON_Y_RATIO: 0.38, // Horizon line relative to canvas height

  // Speeds & Movement (tuned for exhilarating yet fair arcade feel)
  BASE_SPEED: 460, // Smooth base forward units / sec
  MAX_SPEED: 950,
  SPEED_ACCELERATION: 1.0, // Gradual progression with distance
  BOOST_SPEED: 900, // Burst speed when hitting a chevron pad
  BOOST_JUMP_VELOCITY: 440, // Vertical boost velocity
  GRAVITY: 780, // Floaty, satisfying gravity for booster jump arcs

  // Lateral Drag Controls & Magnetic Track Rails
  TRACK_WIDTH_DEFAULT: 320, // Track width (-160 to +160)
  DRAG_SENSITIVITY: 1.25, // Responsive touch & mouse drag multiplier
  MAX_LATERAL_OFFSET: 230, // Allows steering off edge when deliberately swiped
  EDGE_RESISTANCE_ZONE: 25, // Soft bumper zone near edges (-135 to 160)
  EDGE_FALL_THRESHOLD: 18, // Beyond halfW + 18 (178), cube plummets into void

  // Jelly Character
  JELLY_SIZE: 38, // Cube dimension
  JELLY_SHADOW_ALPHA: 0.35,

  // Collectibles & Booster Pads
  CHEVRON_PAD_LENGTH: 90,
  BOOSTER_HALF_WIDTH_EARLY: 55, // Generous 110px wide pad early on
  BOOSTER_HALF_WIDTH_LATE: 42, // Requires focused steering later
  DIAMOND_SIZE: 20,
  DIAMOND_VALUE: 1,

  // World Generation
  WARMUP_RUNWAY_LENGTH: 1800, // Long exhilarating warmup runway before 1st gap
  SEGMENT_LENGTH_MIN: 900, // Long platforms give plenty of time to steer
  SEGMENT_LENGTH_MAX: 1500,
  GAP_LENGTH_MIN: 240, // Definite chasms requiring booster jump clearance
  GAP_LENGTH_MAX: 360,
  VISIBLE_DISTANCE: 2400, // Far viewing distance for sense of depth

  // Environmental Color Themes (dynamic shifts based on distance in meters)
  THEMES: [
    {
      name: 'Teal Canyon',
      distanceMin: 0,
      skyTop: 0x081720,
      skyBottom: 0x0e2f3d,
      fogColor: 0x0c2531,
      trackColor: 0x1d3d4b,
      trackEdgeColor: 0x00f0ff,
      pillarColor: 0x112732,
      boosterColor: 0x00ffff,
    },
    {
      name: 'Golden Desert',
      distanceMin: 400,
      skyTop: 0x24111d,
      skyBottom: 0x481e30,
      fogColor: 0x361625,
      trackColor: 0xd4a034,
      trackEdgeColor: 0xfff076,
      pillarColor: 0x5c1c2e,
      boosterColor: 0xffe600,
    },
    {
      name: 'Crimson Gorge',
      distanceMin: 900,
      skyTop: 0x1a0614,
      skyBottom: 0x3d0b21,
      fogColor: 0x2c0717,
      trackColor: 0xd93856,
      trackEdgeColor: 0xff6b8b,
      pillarColor: 0x4c0f28,
      boosterColor: 0xff3366,
    },
    {
      name: 'Cyber Horizon',
      distanceMin: 1500,
      skyTop: 0x070617,
      skyBottom: 0x19143d,
      fogColor: 0x130e2f,
      trackColor: 0x6c5ce7,
      trackEdgeColor: 0x00ffff,
      pillarColor: 0x281958,
      boosterColor: 0x00e5ff,
    },
  ],

  // Jelly Skins
  JELLY_SKINS: [
    {
      id: 'bubblegum',
      name: 'Bubblegum',
      color: 0xff4d88,
      sideColor: 0xcc2960,
      topColor: 0xff7aa8,
      eyeColor: 0x220516,
      unlockCost: 0, // Free / default
    },
    {
      id: 'cyan-droplet',
      name: 'Cyan Drop',
      color: 0x00d2d3,
      sideColor: 0x01a3a4,
      topColor: 0x54e4e5,
      eyeColor: 0x0a2828,
      unlockCost: 30,
    },
    {
      id: 'lemon-cube',
      name: 'Lemon Cube',
      color: 0xfeca57,
      sideColor: 0xe19a16,
      topColor: 0xffdd77,
      eyeColor: 0x382200,
      unlockCost: 75,
    },
    {
      id: 'grape-cube',
      name: 'Grape Candy',
      color: 0x9b59b6,
      sideColor: 0x76388f,
      topColor: 0xba7fd3,
      eyeColor: 0x240833,
      unlockCost: 150,
    },
    {
      id: 'mint-cube',
      name: 'Emerald Mint',
      color: 0x1dd1a1,
      sideColor: 0x10ac84,
      topColor: 0x55e5c0,
      eyeColor: 0x062d22,
      unlockCost: 250,
    },
    {
      id: 'rainbow-cube',
      name: 'Rainbow Aura',
      color: 0xff6b6b,
      sideColor: 0xee5253,
      topColor: 0xff9f43,
      eyeColor: 0x1e152a,
      unlockCost: 400,
    },
  ],
} as const;

export type JellySkin = typeof GAME_CONFIG.JELLY_SKINS[number];
export type EnvironmentTheme = typeof GAME_CONFIG.THEMES[number];

