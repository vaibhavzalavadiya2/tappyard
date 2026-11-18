# TAPPYARD SEO MASTER PROMPT (FINAL)

Paste this whole prompt into Cursor / Claude Code with `TAPPYARD_Keyword_Analysis.xlsx` C:\Projects\tappyard\TAPPYARD_Keyword_Analysis.xlsx attached. Open the tappyard.com repo (Next.js + Phaser) first.

---

## 0. ROLE AND MODE

You are a senior technical SEO and Next.js engineer. Implement ALL changes below in this repo.

- Inspect the repo first: routing, root layout, metadata, game components, sitemap/robots, existing JSON-LD. Then make the changes.
- Do not ask me clarifying questions. Choose the most reasonable option, and list every assumption at the end.
- SEO and layout-below-the-game ONLY. Do NOT change game logic, visuals, controls, scoring, audio, game canvas size or performance. The first screen of every game page must look and play exactly as it does now.
- Never invent facts about the games. Read the game code to confirm every claim (undo count, timers, rewards, controls, zones, shields) before writing it on a page.
- Never invent search volume, KD or traffic. Numbers come only from the workbook. "Ideas" keywords have NO metrics.

## 1. USE THE ATTACHED KEYWORD FILE

Read `TAPPYARD_Keyword_Analysis.xlsx` with a script (pandas or openpyxl). Do not edit it. Sheets:

| Sheet | Use |
|---|---|
| Master Cleaned Keywords | Verified keywords: A Keyword, D Volume, E KD, F Category, H Relevance, I Priority Score, K Target URL |
| Keyword Ideas (Claude) | User-side keywords with priority A/B/C and suggested target page. No volume/KD unless the keyword exists in the source file |
| Page Meta Recs | Recommended title, meta description, H1 per page |
| Site Audit (tappyard.com) | The on-page problems to fix |

Rules:
1. Skip rows with Relevance = "Manual review" for on-page targeting on game pages. Competitor game names (Run 3, Slope, Subway Surfers, Flappy Bird, Block Blast, Geometry Dash, Doodle Jump, Tetris, dino game) appear ONLY on the games-like pages (section 7), in honest comparative wording.
2. One primary keyword per page. Never reuse a primary keyword on another page.
3. Secondary keywords may overlap only when intent truly overlaps. Do not force generic keywords onto game pages.
4. Natural language only. Primary keyword: title, meta description, the first sentence below the game, one H2. Each secondary: at most 1-2 times, in natural sentences. No stuffing.
5. If this prompt and the workbook disagree on a number, the workbook wins. If the workbook cannot be read, use the appendix (section 11).

## 2. VERIFIED SITE FACTS (read from the live site and screenshots, 2026-11-18)

| Page | URL | What the game really is |
|---|---|---|
| Homepage | `/` | Four free HTML5/WebGL browser games, mobile and desktop, no download |
| Jump Jelly Jump! | `/games/jelly-bounce` | 3D endless/speed runner. Drag to steer a jelly cube over floating neon runways, collect diamonds, hit booster pads to leap chasms. Shows distance in meters, named zones (e.g. "Teal Canyon"), boost and milestones. NOT a vertical jumper or classic platformer. |
| 2048 Neon Fusion | `/games/2048-puzzle` | Sliding number-merge puzzle. Swipe to merge tiles, reach 2048. Neon tiles, merge chimes, Undo (5 shown). |
| Block Grid Zen | `/games/color-zen` | 10x10 block puzzle. Drag polyomino shapes onto the grid, clear full lines, relaxing chimes. Homepage says no timers. Reroll costs 5 gems. |
| Cyber Dash | `/games/quick-tap` | 1-tap neon flyer. Tap anywhere to flutter/fly, dodge pulsing laser gates, graze gates for bonus diamonds. NOT a ground runner. |

Do not change these URLs. Do not add redirects.

## 3. DESIGN PRINCIPLE (what big game sites do, adapted)

Poki and CrazyGames show the game first, then breadcrumbs, H1, and 550-600 words of text below the game: description, how to play, controls, tips, FAQ, similar games, an "About" block. Poki also puts a one-line "HOW TO PLAY" inside the game card. We copy that structure but keep TAPPYARD's clean, ad-free look.

Layout of every game page:

```
[ Top bar: back to TAPPYARD, game name, genre, Fullscreen ]   unchanged
[ Game area: calc(100dvh - top bar height) ]                    unchanged, nothing added around it
[ Below the fold, server-rendered: breadcrumb, intro, How to play, Controls, Tips, Play next, FAQ, About ]
```

## 4. GLOBAL RULES

- Brand: always `TAPPYARD` (uppercase). Fix every `TAPYARD` / `TapYard` (header logo, back links, alt text, JSON-LD). The in-game top bar currently shows "TAPYARD".
- Titles 60 characters or fewer including brand. Meta descriptions 155 or fewer. Exactly ONE H1 per page.
- Use the Next.js Metadata API. Root layout: `title: { default: 'TAPPYARD - Free Online Games', template: '%s | TAPPYARD' }`. Page titles below are WITHOUT the brand suffix (the template adds it once; this fixes the current "| TAPPYARD | TAPPYARD"). The homepage uses `title: { absolute: ... }`.
- Every page: absolute `alternates.canonical`, `openGraph` (title, description, url, image, type), `twitter` card. Keep `/og/tappyard-og.png`.
- All visible text must be server-rendered HTML (not only in the canvas or a client-only loader). Verify with curl after building.
- Only claim what the code proves. Check before writing: "unblocked", "offline / no wifi needed", "no accounts / no registration", "no timers", "undo", "shields". Keep, fix or remove the wording.
- No fake ratings or review schema. Only add `aggregateRating` if real stored rating data exists. Do not show "plays" or ratings unless they come from real data.
- Never use `display:none`, off-screen positioning or tiny text to hide copy.

## 5. TASK A: METADATA (exact text)

| Route | `title` (no brand suffix unless noted) | `description` |
|---|---|---|
| `/` | absolute: `Free Games to Play Online - No Download \| TAPPYARD` | `Free games to play online in your browser. Four original games: 3D runner, 2048 puzzle, block puzzle and 1-tap reflex. No download needed.` |
| `/games/2048-puzzle` | `2048 Neon Fusion - Play 2048 Unblocked Free` | `Swipe to merge glowing number tiles and reach 2048. Free 2048 in your browser, with undo moves and no download.` |
| `/games/color-zen` | `Block Grid Zen - Free 10x10 Block Puzzle Games` | `Drag shapes onto a 10x10 grid and clear full lines in Block Grid Zen, a free, relaxing block puzzle. Play in your browser, no download.` |
| `/games/jelly-bounce` | `Jump Jelly Jump! - Free 3D Endless Runner Game` | `Steer a jelly cube over neon runways, grab diamonds and hit booster pads to cross chasms. Free 3D endless runner, no download.` |
| `/games/quick-tap` | `Cyber Dash - Free 1-Tap Neon Reflex Game` | `Tap to fly and dodge pulsing laser gates in Cyber Dash, a free 1-tap neon reflex game. Graze gates for bonus diamonds. No download.` |

- If "unblocked" cannot be confirmed (section 4), use `2048 Neon Fusion - Play 2048 Online Free` as the 2048 title.
- Cyber Dash: meta, page text and social tags must all say "bonus diamonds" (the meta currently says "bonus score").
- Add a build-time check (script or test) that fails if any final title is over 60 characters (with suffix), any description is over 155, or two pages share a title.

## 6. TASK B: PAGE CHANGES

### B1. Homepage `/`
- H1: `Free Online Browser Games: Play Instantly, No Download` (replaces the stuffed H1 that ends with "| TAPPYARD").
- 120-200 word intro under the H1. Natural keywords: free browser games, games to play online, play games without downloading, instant play games, mobile browser games, online arcade games.
- Keep the 4 game cards. Descriptive anchors: "Jump Jelly Jump! - 3D endless runner", "2048 Neon Fusion - 2048 number puzzle", "Block Grid Zen - 10x10 block puzzle", "Cyber Dash - 1-tap reflex flyer".
- The genre labels (3D Arcade Runners, Brain & Math Puzzles, Relaxing Stress Relief Games, 1-Tap Reflex & Rhythm Games) currently link to `#catalogue`. Keep them as in-page sections with ids and an H2 each, linking to the matching game. Do NOT create category pages (4 games would only duplicate the game pages).
- Expand the FAQ with `FAQPage` JSON-LD that matches the visible text exactly. Questions: Are all games free? Do I need to download anything? Can I play on my phone or tablet? Do I need an account? Are the games unblocked at school or work? (only if true) What are good quick games to play when bored?
- Find out what "Log In / Account" does. If nothing, remove it. If accounts exist, rewrite the FAQ so it does not say "no accounts".
- Add `WebSite` and `Organization` JSON-LD (name TAPPYARD, url, logo).

### B2. Each game page: first screen (do not change layout)
1. The game section height stays `calc(100dvh - top bar height)`. Do not add anything around the game. No sidebars, no ads.
2. Keep the existing top bar. The game name there is the page's single H1 (same text as now, e.g. "Jump Jelly Jump!"). If it is not an `<h1>` element, make it one with identical styling. Do not add a second H1.
3. Start/pause screen text (real HTML text, 1-2 lines, shown to players as instructions). Confirm in code, then use:
   - Jump Jelly Jump!: `Drag to steer the jelly cube. Collect diamonds and hit booster pads to leap the chasms.`
   - 2048 Neon Fusion: `Swipe to slide the tiles. Match two equal tiles to merge them and reach 2048.`
   - Block Grid Zen: `Drag shapes onto the 10x10 grid. Fill a full row or column to clear it.`
   - Cyber Dash: `Tap anywhere to fly. Dodge the laser gates and graze them for bonus diamonds.`
4. Touch: set `touch-action: none` on the game canvas only, never on the page, so players can still scroll outside the canvas.
5. Mobile: add a small unobtrusive "How to play and tips" link or chevron at the bottom edge of the game area that scrolls to the content below. Also add the same link to the pause menu.
6. Fullscreen must still work on the game container only.

### B3. Each game page: below the fold (server-rendered, 300-450 words total)
In this order:
1. Breadcrumb (visible plus `BreadcrumbList` JSON-LD): `TAPPYARD > Arcade > Jump Jelly Jump!` (categories: Arcade, Puzzle, Relaxing, Casual as on the homepage).
2. `H2` with the primary keyword in natural wording, then a 40-60 word description.
3. `H2 How to play` (60-90 words) and `H3 Controls` (30-50 words: touch and mouse/keyboard, from the code).
4. `H2 Tips` (4-5 short, real bullets).
5. `H2 Play next`: cards for the other 3 games (thumbnail, name, genre, descriptive link). Lazy-load images. Also link to the page's guide or games-like page (section 7).
6. `H2 FAQ` (3-4 questions). Use native `<details>` or visible text so the answers are in the HTML. `FAQPage` JSON-LD must match exactly.
7. Small "About this game" block: Genre, Platform (web browser, mobile and desktop), Price (free), Developer (TAPPYARD), Last updated (a real date that changes only when the game changes).
8. Footer back link "Back to TAPPYARD" (fix the typo).
9. `VideoGame` JSON-LD: name, description, url, genre, `gamePlatform: "Web browser"`, `applicationCategory: "Game"`, `playMode: "SinglePlayer"`, `offers` (price 0), image.

Per-page copy inputs:

| Page | H2 intro (primary keyword) | Primary | Secondary keywords (use naturally, max 1-2 times each) | Facts to use (verify in code) | FAQ questions |
|---|---|---|---|---|---|
| 2048 Neon Fusion | `Play 2048 unblocked and free in your browser` | 2048 unblocked | 2048 game, 2048, 2048 computer game, play 2048, 2048 online, 2048 free, 2048 puzzle, 2048 with undo, number merge game, merge numbers game, how to play 2048 | swipe, merge equal tiles, goal 2048, 5 undos, neon tiles, merge chimes | How do I play? Does it have undo? Is it free with no download? How do I win? |
| Block Grid Zen | `A free 10x10 block puzzle you can play online` | free puzzle games | puzzle games, block game, block puzzle, block puzzle game, block puzzle online, free block puzzle, 10x10 block puzzle, grid puzzle game, relaxing puzzle games, zen puzzle game, puzzle game no time limit, line clear puzzle, drag and drop block puzzle | 10x10 grid, drag polyomino shapes, clear full lines, relaxing chimes, no timers (verify), Reroll costs 5 gems | How do I play? Is there a timer? What does Reroll do? How do lines clear? |
| Jump Jelly Jump! | `A free 3D endless runner you can play in your browser` | running games | 3D runner game, 3D endless runner, endless runner online, cube runner game, jelly runner game, jelly cube game, 3D running game, runner game online, free 3D games online, 3D browser games, html5 3D games | drag to steer, diamonds, booster pads, chasms, neon runways, distance in meters, zones, boost, milestones | How do I steer? What are booster pads? What are diamonds for? Does it work on phones? |
| Cyber Dash | `A free 1-tap neon reflex game you can play online` | one tap games (idea; validate volume) | one tap game online, one button games, tap to fly game, one tap flying game, reflex games, reflex games online, reaction games, neon reflex game, dodge game, laser dodge game, obstacle dodging game, hard one tap games | tap anywhere to fly, pulsing laser gates, graze for bonus diamonds, shields (verify), high score | How do I play? What happens when I graze a laser gate? How do I beat my high score? |

Copy rules: Jump Jelly Jump! must be described as a 3D endless runner. Never target "platformer" or "jumping games" for it. Cyber Dash must be described as a flying/flutter game, not a ground runner. Write original sentences, not templates repeated across pages.

### B4. Homepage and cross-links
Each game page links to the other three (Play next). The homepage links to all four. Descriptive anchors, never "click here".

## 7. TASK C: NEW SUPPORTING PAGES (build these four)

Each page: own title, meta, canonical, one H1, 600-900 words of original, useful content, a clear "Play it free" link to the matching game, links to the homepage and the other games, `BreadcrumbList` JSON-LD. Add to the sitemap. Link to each from its game page. Comparative pages must be honest: describe what the TAPPYARD game is, name similar games factually, never imply the other games are TAPPYARD's or affiliated, never claim features the game lacks.

| Route | H1 | Title (no brand) | Primary | Secondary | Links to |
|---|---|---|---|---|---|
| `/guides/2048-strategy` | `2048 Strategy: How to Win 2048 (Tips and Tricks)` | `2048 Strategy: How to Win 2048 - Tips and Tricks` | 2048 strategy | how to win 2048, 2048 tips and tricks, 2048 corner strategy, what happens after 2048, how to play 2048, 2048 rules, 2048 with undo | `/games/2048-puzzle` |
| `/games-like/block-blast` | `Games Like Block Blast: Free Block Puzzle in Your Browser` | `Games Like Block Blast - Free Block Puzzle Games` | games like block blast | block blast alternative, block puzzle like block blast, 10x10 block puzzle, free block puzzle, relaxing puzzle games | `/games/color-zen` |
| `/games-like/3d-runner-games` | `Games Like Run 3, Slope and Subway Surfers: Free 3D Runners` | `Games Like Run 3, Slope & Subway Surfers - 3D Runners` | games like run 3 | games like slope, games like subway surfers, games like temple run, games like going balls, run 3 alternative, slope alternative, 3D endless runner, 3D runner game | `/games/jelly-bounce` |
| `/games-like/flappy-bird` | `Games Like Flappy Bird: Free 1-Tap Games in Your Browser` | `Games Like Flappy Bird - Free 1-Tap Games Online` | games like flappy bird | flappy bird alternative, flappy bird style game, one tap games, tap to fly game, reflex games | `/games/quick-tap` |

Do NOT build yet: `/games-like/geometry-dash`, `/games-like/tetris`, `/games-like/2048`.

## 8. TASK D: TECHNICAL SEO

1. `app/sitemap.ts`: `/`, the 4 game URLs, the 4 new pages (absolute URLs, `lastModified`). `app/robots.ts`: allow all, point to the sitemap.
2. Canonical on every page. No duplicate titles or descriptions. `<html lang="en">`.
3. Make sure the H1 and all below-the-fold copy are in the server HTML. The fetched game page currently shows "Loading Jump Jelly Jump..." and little else: move text into server components; keep only the game itself client-side.
4. Descriptive `alt` text on images. Core Web Vitals must stay the same or better. Lazy-load below-the-fold images. The game must not wait for the content section to load.
5. Retired or missing games: if a game is ever removed, keep its URL returning 200 with a short "no longer available" message and a recommended game (as CrazyGames does), not a 404.
6. Custom 404 page linking to the homepage and the 4 games.
7. No `noindex` on these pages.

## 9. DO NOT

- Do not keyword-stuff, hide text, or repeat sentences with swapped keywords.
- Do not reuse a primary keyword on two pages.
- Do not create category pages, tag pages or thin doorway pages.
- Do not redirect any content page to a game page.
- Do not add ads, popups, sidebars or anything around the game area.
- Do not claim "unblocked", "offline", "no accounts", "no timers", "undo" or "shields" unless the code proves it.
- Do not put competitor names on game pages. Do not copy competitor text.
- Do not touch game logic, canvas size or gameplay performance.

## 10. DELIVERABLES AND CHECKS

When done:
1. Run build and lint. Fix all errors.
2. Run the metadata check from section 5. Show a before/after table of every title, description and H1.
3. Curl each page's HTML. Confirm the H1, start-screen text, below-the-fold copy, breadcrumb and JSON-LD are present without JavaScript. Validate the JSON-LD.
4. Confirm each game's first screen is visually unchanged and the game still loads, runs and goes fullscreen. Test touch scrolling outside the canvas on a mobile viewport.
5. List every file added or changed, every new route, and every claim you removed because the code did not support it, plus all assumptions.
6. Give me an "after deploy" list: submit `sitemap.xml` in Google Search Console, request indexing for the 9 URLs, then track impressions, clicks and average position weekly for each page's primary keyword.

Definition of done: all 9 URLs live, unique titles under 60 characters, one H1 each, content visible in server HTML, game first screens unchanged, no build errors.

## 11. APPENDIX: KEYWORDS (use if the workbook cannot be read). Format: keyword (volume / KD) from the source file

**Homepage primary: games to play (301,000 / 46).** Secondaries: online games to play (49,500 / 77), fun games to play (27,100 / 69), browser games (33,100 / 83), fun games (135,000 / 71), addicting games (40,500 / 46, overlaps a brand), flash games (33,100 / 83), game websites (27,100 / 100), addicting games websites (12,100 / 52), cool games (110,000 / 87), free games to play (74,000 / 100), free online games (368,000 / 100), games online (135,000 / 100), play games online (12,100 / 100). KD 100 heads (games, free games, online games) are long-term only. Ideas A (no metrics): free browser games, play games without downloading, no download games, instant play games, online arcade games, mobile browser games, games to play on phone without downloading, quick games to play online, games to kill time, games to play when bored. Ideas B: games you can play in your browser, free arcade games, casual games online, html5 games online, free unblocked games, free games without registration, 5 minute games online, short games to play online, best free browser games, best online arcade games, indie browser games, original browser games, neon arcade games.

**2048 Neon Fusion.** Data: 2048 unblocked (12,100 / 43), 2048 game (368,000 / 92), 2048 (673,000 / 100), 2048 computer game (6,600 / 87), best online brain games (40,500 / 81, shared with Block Grid Zen). Ideas A: play 2048, 2048 online, 2048 free, 2048 puzzle, 2048 with undo, number merge game, merge numbers game, how to play 2048, 2048 strategy, 2048 tips and tricks, how to win 2048. Ideas B: 2048 no download, 2048 classic, 2048 neon, 2048 undo, number puzzle game, 2048 rules, 2048 corner strategy, what happens after 2048, games like 2048.

**Block Grid Zen.** Data: free puzzle games (9,900 / 79), puzzle games (60,500 / 79), puzzle game (9,900 / 68), online play puzzle games free (6,600 / 85), block game (18,100 / 76). Ideas A: block puzzle, block puzzle game, block puzzle online, free block puzzle, 10x10 block puzzle, grid puzzle game, relaxing puzzle games, zen puzzle game, puzzle game no time limit, games like block blast, block blast alternative. Ideas B: 1010 block puzzle, block puzzle no download, block placement game, line clear puzzle, drag and drop block puzzle, relaxing games online, calming games online, stress relief games online, puzzle games to relax, puzzle games for adults, block puzzle like block blast. Manual review, NOT for the game page: block blast (450,000 / 94), tetris free (8,100 / 12), free tetris (18,100 / 79), puzzles online (40,500 / 83).

**Jump Jelly Jump!** Data: running games (6,600 / 51) only. Manual review (games-like page only): run 3 (450,000 / 76), run3 (135,000 / 73), snow rider (450,000 / 67), subway surfers (550,000 / 100), temple run (49,500 / 88), tunnel rush (49,500 / 61), slope 3d (6,600 / 10), ball surfer 3d (6,600 / 13), going balls (9,900 / 54), 3d games (6,600 / 82), parkour games (9,900 / 37), platformer (9,900 / 31), jelly mario (9,900 / 25). Ideas A: 3d runner game, 3d endless runner, endless runner online, cube runner game, jelly runner game, games like run 3, games like subway surfers, games like slope. Ideas B: endless runner game, jelly cube game, 3d running game, runner game online, neon runner 3d, free 3d games online, 3d browser games, html5 3d games, jelly jump game, run 3 alternative, slope alternative, games like temple run, games like going balls. Ideas C (weak fit, avoid): speed runner game, jelly jumping game, jumping games.

**Cyber Dash.** Data: no clean keyword. Manual review (games-like page only): flappy bird (165,000 / 80), geometry dash (2,240,000 / 48), dinosaur game (673,000 / 93), dino game (246,000 / 78), no internet game (49,500 / 85). Ideas A: one tap games, one tap game online, one button games, tap to fly game, one tap flying game, dodge game, reflex games, reflex games online, reaction games, neon reflex game, games like flappy bird, flappy bird alternative. Ideas B: one finger games, tap games online, flying games online, reflex flight game, neon flight game, laser dodge game, obstacle dodging game, dodge obstacles game online, avoid obstacles game, fast reaction games, hard reflex games, hard one tap games, addictive one tap games, flappy bird style game, games like geometry dash. Ideas C: neon runner game.

**Never target:** competitor sites (Poki, Y8, CrazyGames, Google games), non-English queries, multiplayer/.io games, sports, card/board/word games, shooters/racing, "reaction time test", "cps test", "aim trainer" (tool intent).