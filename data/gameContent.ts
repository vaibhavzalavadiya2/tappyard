import type { GameContentData } from '@/components/tappyard/GameContentBelowFold';

export const GAME_CONTENT_DATA: Record<string, GameContentData> = {
  '2048-puzzle': {
    gameId: '2048-puzzle',
    gameTitle: '2048 Neon Fusion',
    category: 'Puzzle',
    canonicalUrl: 'https://tappyard.com/games/2048-puzzle',
    introHeading: 'Play 2048 unblocked and free in your browser',
    introText:
      'Play 2048 unblocked and free directly in your web browser. This modern number merge game brings the classic 2048 puzzle to life with glowing neon tiles, harmonic merge chimes, and 5 diamond undos. Slide matching numbers to combine them, plan your moves, and reach the legendary 2048 tile without downloads.',
    howToPlay:
      'Slide tiles across the 4x4 matrix by swiping on touchscreens or using keyboard arrow keys. When two equal numbers collide, they merge into a single tile with double the value (2 + 2 = 4, 4 + 4 = 8, up to 2048 and beyond). A new tile appears after every move. Keep merging to prevent the grid from filling completely.',
    controls: {
      touch: 'Swipe up, down, left, or right anywhere across the board to slide tiles.',
      keyboardMouse: 'Press Arrow Keys (↑, ↓, ←, →) or W, A, S, D to slide tiles in that direction.',
    },
    tips: [
      'Keep your largest tile locked into a single corner (the bottom-left or top-left corner works best).',
      'Build monotonic decreasing chains along the border next to your highest tile.',
      'Avoid sliding in the direction that pulls your highest tile away from its designated corner.',
      'Save your unified diamonds for crucial Undo moves (5 diamonds per undo) when the board gets crowded.',
    ],
    supportingPageLink: {
      href: '/guides/2048-strategy',
      label: '2048 Strategy Guide',
      anchorText: 'Read our 2048 Strategy Guide: How to Win 2048 with Corner Strategy & Tips',
    },
    faqs: [
      {
        question: 'How do I play 2048 Neon Fusion?',
        answer:
          'Swipe or use arrow keys to slide tiles across the 4x4 grid. When two tiles with the same number touch, they merge into one tile with twice the value. Your goal is to combine numbers until you produce the 2048 tile.',
      },
      {
        question: 'Does this 2048 game have an undo feature?',
        answer:
          'Yes. 2048 Neon Fusion stores your last 5 moves in history. You can click the Undo button to reverse an accidental slide for 5 diamonds, which you collect by playing games across TAPPYARD.',
      },
      {
        question: 'Is 2048 Neon Fusion free with no download?',
        answer:
          'Yes, 2048 Neon Fusion is 100% free to play directly in Chrome, Safari, Firefox, Edge, and mobile browsers with zero app store installs or file downloads.',
      },
      {
        question: 'How do I win 2048 and what happens after reaching 2048?',
        answer:
          'You win when you create the 2048 tile. Once achieved, you can choose to keep playing in endless mode to reach 4096, 8192, and set personal record scores.',
      },
    ],
    about: {
      genre: 'Sliding Number Merge Puzzle',
      platform: 'Web browser (Mobile, Tablet, Desktop)',
      price: 'Free (No In-App Purchases)',
      developer: 'TAPPYARD',
      lastUpdated: 'November 2026',
    },
  },

  'color-zen': {
    gameId: 'color-zen',
    gameTitle: 'Block Grid Zen',
    category: 'Relaxing',
    canonicalUrl: 'https://tappyard.com/games/color-zen',
    introHeading: 'A free 10x10 block puzzle you can play online',
    introText:
      'Discover why Block Grid Zen is one of the most relaxing free puzzle games available online. Drag geometric polyomino shapes onto a soothing 10x10 grid, clear full rows and columns with harmonic chimes, and enjoy pure stress-free spatial puzzle flow with no timers and no downloads.',
    howToPlay:
      'You are dealt three polyomino block shapes at a time in your lower tray. Drag each shape onto open spaces on the 10x10 grid. Whenever you fill a complete horizontal row or vertical column with blocks, that entire line clears with a soothing chime synthesizer. Plan ahead so you always have room for your largest 3x3 and 5-block shapes.',
    controls: {
      touch: 'Tap and drag any shape from the bottom tray onto the 10x10 grid. Lift your finger to place.',
      keyboardMouse: 'Click and drag shapes with your mouse cursor onto the board. Release mouse button to place.',
    },
    tips: [
      'Prioritize clearing multiple lines at once to build combos and earn bonus streak points.',
      'Always preserve a 3x3 open pocket on the board to avoid getting stuck when large squares appear.',
      'Keep the center of the grid open and place smaller pieces along the perimeter edges.',
      'Use the Reroll button (5 diamonds) when your current tray shapes cannot fit on the remaining grid.',
    ],
    supportingPageLink: {
      href: '/games-like/block-blast',
      label: 'Games Like Block Blast',
      anchorText: 'Explore Games Like Block Blast: Free 10x10 Block Puzzle Browser Alternative',
    },
    faqs: [
      {
        question: 'How do I play Block Grid Zen?',
        answer:
          'Drag polyomino block pieces from your tray into the 10x10 grid. When a full row or column is filled with blocks, it pops and clears the line, giving you more space and score.',
      },
      {
        question: 'Is there a timer or move countdown?',
        answer:
          'No. Block Grid Zen has zero timers and zero move countdowns. You can take all the time you need to study the grid and enjoy the relaxing acoustic chimes at your own pace.',
      },
      {
        question: 'What does the Reroll button do?',
        answer:
          'The Reroll button lets you exchange your current three shapes for a fresh trio of pieces in exchange for 5 diamonds, giving you an escape route when the board gets crowded.',
      },
      {
        question: 'How do lines clear and score points?',
        answer:
          'Lines clear whenever all 10 cells in any horizontal row or vertical column are completely filled. Clearing multiple rows simultaneously triggers streak multipliers and bonus diamonds.',
      },
    ],
    about: {
      genre: '10x10 Spatial Polyomino Grid Puzzle',
      platform: 'Web browser (Mobile, Tablet, Desktop)',
      price: 'Free (No In-App Purchases)',
      developer: 'TAPPYARD',
      lastUpdated: 'November 2026',
    },
  },

  'jelly-bounce': {
    gameId: 'jelly-bounce',
    gameTitle: 'Jump Jelly Jump!',
    category: 'Arcade',
    canonicalUrl: 'https://tappyard.com/games/jelly-bounce',
    introHeading: 'A free 3D endless runner you can play in your browser',
    introText:
      'Step into fast-paced running games action with Jump Jelly Jump!, a free 3D endless runner playable directly in your browser. Drag to steer your jelly cube along floating neon tracks, collect cyan diamonds, and hit booster chevron pads to launch across wide chasms across four unique environmental zones.',
    howToPlay:
      'Steer your forward-running jelly cube across suspended floating runways. As you sprint forward, chasms appear ahead. Hit the glowing booster chevron pads located along the track to leap over the void and reach the next platform. Collect cyan diamonds along the way to unlock new colorful jelly character skins.',
    controls: {
      touch: 'Drag your finger horizontally across the screen to steer the jelly cube left and right.',
      keyboardMouse: 'Move your mouse or hold the left mouse button while dragging horizontally to steer.',
    },
    tips: [
      'Line up your jelly cube with chevron pads early before you reach the edge of the chasm.',
      'Avoid oversteering near track boundaries; crossing the outer edge bumper causes your cube to plummet.',
      'Watch for dynamic environmental shifts: Teal Canyon (0m), Golden Desert (400m), Crimson Gorge (900m), and Cyber Horizon (1500m).',
      'Collect every cyan diamond to unlock premium character skins like Cyan Drop, Emerald Mint, and Rainbow Aura in the menu shop.',
    ],
    supportingPageLink: {
      href: '/games-like/3d-runner-games',
      label: 'Games Like Run 3 & Slope',
      anchorText: 'Discover Games Like Run 3, Slope and Subway Surfers: Free 3D Runners Guide',
    },
    faqs: [
      {
        question: 'How do I steer the jelly cube?',
        answer:
          'Drag horizontally anywhere on your touch screen or click and drag your mouse. The jelly cube responds smoothly to lateral steering with magnetic track boundaries.',
      },
      {
        question: 'What are booster pads and chasms?',
        answer:
          'Booster pads are glowing chevron pads on the runway that give your jelly cube a powerful forward and upward jump impulse, launching you safely across endless chasms.',
      },
      {
        question: 'What are diamonds used for in Jump Jelly Jump!?',
        answer:
          'Cyan diamonds are collectibles that save to your universal wallet, allowing you to unlock 5 custom character skins (Bubblegum, Cyan Drop, Lemon Cube, Grape Candy, Emerald Mint, and Rainbow Aura) and powerups across all TAPPYARD games.',
      },
      {
        question: 'Can I play Jump Jelly Jump! on mobile phones and tablets?',
        answer:
          'Yes. Jump Jelly Jump! is built with 100% mobile-first WebGL responsive touch controls for iPhone, iPad, Android, and desktop browsers without installing apps.',
      },
    ],
    about: {
      genre: '3D Endless Speed Runner',
      platform: 'Web browser (Mobile, Tablet, Desktop)',
      price: 'Free (No In-App Purchases)',
      developer: 'TAPPYARD',
      lastUpdated: 'November 2026',
    },
  },

  'quick-tap': {
    gameId: 'quick-tap',
    gameTitle: 'Cyber Dash',
    category: 'Casual',
    canonicalUrl: 'https://tappyard.com/games/quick-tap',
    introHeading: 'A free 1-tap neon reflex game you can play online',
    introText:
      'Cyber Dash is an intense addition to the world of one tap games. Tap anywhere on your screen to fly, flutter, and maneuver through pulsing laser gates. Graze tight obstacles for bonus diamonds, trigger protective revival shields, and test your reaction speed in this free online neon flight runner.',
    howToPlay:
      'Your cyber dart flies continuously forward in a futuristic cyber tunnel. Gravity pulls your ship downward; tap anywhere or press spacebar to flap and gain upward altitude. Time each tap carefully to pass through narrow laser gate openings. Pass close to laser gate edges without crashing to trigger close-graze diamond bonuses.',
    controls: {
      touch: 'Tap anywhere on your screen to flutter and flap upward.',
      keyboardMouse: 'Click the left mouse button or press Spacebar or Up Arrow on your keyboard to flap upward.',
    },
    tips: [
      'Use short, rhythmic taps rather than rapid erratic clicks to maintain stable horizontal flight altitude.',
      'Graze close to laser gate pillars to earn +1 bonus diamond per close shave and build your score streak.',
      'Watch the tunnel background theme evolve as your cleared gate score climbs past 10, 25, and 50 gates.',
      'If you crash, spend 5 diamonds to activate a 2.5-second invulnerability shield and continue your run.',
    ],
    supportingPageLink: {
      href: '/games-like/flappy-bird',
      label: 'Games Like Flappy Bird',
      anchorText: 'Explore Games Like Flappy Bird: Free 1-Tap Neon Flight Alternative',
    },
    faqs: [
      {
        question: 'How do I play Cyber Dash?',
        answer:
          'Tap anywhere on the screen or press spacebar to give your cyber craft an upward flap. Release to allow gravity to pull it down. Guide the craft through the opening of each laser gate.',
      },
      {
        question: 'What happens when I graze a laser gate?',
        answer:
          'Passing within 18 pixels of a laser gate edge without crashing triggers a Close Graze bonus, awarding you bonus diamonds and building your streak multiplier.',
      },
      {
        question: 'Does Cyber Dash have revival shields?',
        answer:
          'Yes. After a system crash, you can spend 5 diamonds once per run to revive immediately with a 2.5-second glowing protective shield that renders you immune to lasers.',
      },
      {
        question: 'How do I beat my high score in Cyber Dash?',
        answer:
          'Maintain a centered altitude before approaching each gate, anticipate opening heights early, and keep your tap rhythm steady as the forward speed gradually accelerates.',
      },
    ],
    about: {
      genre: '1-Tap Neon Reflex Flight Runner',
      platform: 'Web browser (Mobile, Tablet, Desktop)',
      price: 'Free (No In-App Purchases)',
      developer: 'TAPPYARD',
      lastUpdated: 'November 2026',
    },
  },

  'belt-sort': {
    gameId: 'belt-sort',
    gameTitle: 'Conveyor Sort Rush',
    category: 'Casual',
    canonicalUrl: 'https://tappyard.com/games/belt-sort',
    introHeading: 'Sort shapes on a high-speed conveyor belt free in your browser',
    introText:
      'Conveyor Sort Rush is a fast-paced shape sorting arcade game built for instant one-handed mobile play and crisp desktop keyboard control. As colored geometric pieces glide toward you down a moving factory belt, send the front-most piece into its matching colored bin before it crosses the end line. Hold your nerve until the last 18% golden Perfect Zone to double your points, build huge combo chains to earn Slow-Mo charges, and climb the daily seeded leaderboard with zero downloads or sign-ups.',
    howToPlay:
      'Every run starts with three chunky open bins at the bottom of the conveyor belt: Blue Circle, Green Square, and Red Triangle. Wait just an instant or react quickly to tap the bin matching the closest item on the belt. Sorting inside the glowing gold Perfect Zone doubles that item’s points, while chaining consecutive correct sorts increases your score multiplier up to x5 and awards a +50 bonus plus a Slow-Mo charge every 10 sorts. Once you reach 25 sorts in a single run, the fourth Purple Diamond bin slides into action. Hit 60 sorts to unlock glowing Gold Wildcard Stars (matching any bin for x2 points) and Ice Freeze Crystals (pausing the belt and spawner for 3 full seconds on tap). Try Endless Mode to test how long your 3 hearts survive rising speed waves, or switch to the 60-second Daily Run where everyone plays the exact same seeded conveyor sequence every day.',
    controls: {
      touch:
        'Tap any colored bin box directly with your thumb to send the front item into it. Tap Freeze (left) or Slow-Mo (right) when charged.',
      keyboardMouse:
        'Click bins directly or press keys 1 / 2 / 3 / 4, A / S / D / F, or Left / Down / Right arrows. Press Q for Freeze, Space or E for Slow-Mo, P to Pause, and M to Mute.',
    },
    tips: [
      'Sort inside the gold Perfect Zone (last 18% of the belt) on slow and medium items to double your points and skyrocket high scores.',
      'Reach a x10 chain combo as early as possible to pocket +50 bonus points and keep an emergency Slow-Mo charge ready.',
      'Save Freeze crystals for intense fast spike waves right before losing a heart; remember spike waves are always followed by a breather gap.',
      'Keep your eyes focused on the front item and watch out for the 4th Purple Diamond bin slide-in after 25 sorts.',
    ],
    supportingPageLink: {
      href: '/games-like/conveyor-sort',
      label: 'Games Like Conveyor Sort',
      anchorText: 'Explore Games Like Conveyor Sort: Free Shape & Reflex Sorting Guide',
    },
    faqs: [
      {
        question: 'How does the Daily Run work in Conveyor Sort Rush?',
        answer:
          'Daily Run lasts 60 seconds or until 3 hearts are lost. The item order, wave bursts, and special drops are seeded from today’s local date so every player faces the exact same challenge. After finishing, copy your color emoji grid and streak to share with friends.',
      },
      {
        question: 'What unlocks during a run at 25 and 60 sorts?',
        answer:
          'At 25 correct sorts, the fourth Purple Diamond bin slides onto the track. At 60 correct sorts, golden Wildcard stars (any bin, x2 points) and ice Freeze crystals begin appearing on the belt.',
      },
      {
        question: 'How do Slow-Mo and Freeze power-ups work?',
        answer:
          'You earn 1 Slow-Mo charge at chain 10 and every 10th chain after that; tapping it slows the belt to 60% speed for 2 seconds. You earn 1 Freeze charge whenever you sort an ice Freeze crystal; tapping it stops both belt movement and new spawns for 3 seconds.',
      },
      {
        question: 'Do I earn TAPPYARD diamonds playing Conveyor Sort Rush?',
        answer:
          'Yes! You earn 1 unified TAPPYARD diamond for every 25 points scored plus a +5 diamond bonus when setting a new Daily Best (up to 50 diamonds per run).',
      },
    ],
    about: {
      genre: 'Fast-Paced Shape Sorting Casual',
      platform: 'Web browser (Mobile, Tablet, Desktop)',
      price: 'Free (No In-App Purchases)',
      developer: 'TAPPYARD',
      lastUpdated: 'November 2026',
    },
  },
};
