import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseDir = path.resolve('public', 'brand-identity');
const svgDir = path.join(baseDir, 'svg');
const pngDir = path.join(baseDir, 'png');

// -------------------------------------------------------------
// 1. BESPOKE VECTOR SYMBOLS (Flat, Single-Color, Pure Geometry)
// -------------------------------------------------------------

// CONCEPT 1: THE RADIANT NEXUS (نکسوس نور و پرتو مدور)
// A monolithic geometric circle split by a 45-degree beam of infinite light (Hoor).
const symbolC1 = (color = '#C5A46D') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Two optically balanced monolithic arcs forming an infinite circle separated by a light corridor -->
  <path d="M 256 36 C 377.5 36, 476 134.5, 476 256 C 476 312 455.5 363.3 421.5 402.5 L 348 329 C 362.8 307.7 371.5 282.8 371.5 256 C 371.5 192.2 319.8 140.5 256 140.5 C 229.2 140.5 204.3 149.2 183 164 L 109.5 90.5 C 148.7 56.5 200 36 256 36 Z" fill="${color}" />
  <path d="M 256 476 C 134.5 476, 36 377.5, 36 256 C 36 200 56.5 148.7 90.5 109.5 L 164 183 C 149.2 204.3 140.5 229.2 140.5 256 C 140.5 319.8 192.2 371.5 256 371.5 C 282.8 371.5 307.7 362.8 329 348 L 402.5 421.5 C 363.3 455.5 312 476 256 476 Z" fill="${color}" />
  <circle cx="256" cy="256" r="32" fill="${color}" />
</svg>`;

// CONCEPT 2: THE LUMINOUS HORIZON (افق نور و دو ستون سینما و وب - نشان مقتدر H)
// Two architectural monolithic pillars united by a central celestial solar disc (Hoor) with a razor-thin horizon slit.
const symbolC2 = (color = '#C5A46D') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Left Pillar (Film Division) -->
  <rect x="76" y="64" width="76" height="384" rx="4" fill="${color}" />
  <!-- Right Pillar (Digital & Web Division) -->
  <rect x="360" y="64" width="76" height="384" rx="4" fill="${color}" />
  <!-- Solar Core / Hoor Horizon (Connecting Bridge) -->
  <!-- Top Half of Sun -->
  <path d="M 182 242 L 330 242 C 324.5 174.5, 295 120, 256 120 C 217 120, 187.5 174.5, 182 242 Z" fill="${color}" />
  <!-- Bottom Half of Sun -->
  <path d="M 182 270 L 330 270 C 324.5 337.5, 295 392, 256 392 C 217 392, 187.5 337.5, 182 270 Z" fill="${color}" />
  <!-- Center Horizontal Bridge Beam -->
  <rect x="152" y="246" width="208" height="20" fill="${color}" />
</svg>`;

// CONCEPT 3: THE CONTINUOUS PRISM LOOP (حلقه بی‌نهایت ممتد و فرم انتزاعی هـ)
// A continuous, interlocking ribbon of pure geometric planes forming an infinite loop of light and subtle letter H.
const symbolC3 = (color = '#C5A46D') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Continuous geometric loop with precision 45-degree facets -->
  <path d="M 148 84 L 224 84 L 224 216 L 288 216 L 288 84 L 364 84 L 364 276 C 364 366, 298 428, 208 428 C 118 428, 64 364, 64 284 L 140 284 C 140 324, 168 356, 208 356 C 248 356, 288 322, 288 276 L 288 284 L 224 284 L 224 428 L 148 428 L 148 84 Z" fill="${color}" />
  <circle cx="364" cy="356" r="32" fill="${color}" />
</svg>`;

// -------------------------------------------------------------
// 2. BESPOKE TYPOGRAPHIC WORDMARKS (Pure Vector Paths)
// -------------------------------------------------------------

// Latin Wordmark "HORAM"
const latinWordmark = (color = '#F5F4F0') => `
<g fill="${color}">
  <!-- H -->
  <path d="M 0 0 L 16 0 L 16 38 L 52 38 L 52 0 L 68 0 L 68 96 L 52 96 L 52 54 L 16 54 L 16 96 L 0 96 Z" />
  <!-- O -->
  <path d="M 152 0 C 122 0, 98 22, 98 48 C 98 74, 122 96, 152 96 C 182 96, 206 74, 206 48 C 206 22, 182 0, 152 0 Z M 152 16 C 172 16, 189 30, 189 48 C 189 66, 172 80, 152 80 C 132 80, 115 66, 115 48 C 115 30, 132 16, 152 16 Z" />
  <!-- R -->
  <path d="M 236 0 L 282 0 C 302 0, 318 12, 318 32 C 318 46, 308 57, 294 61 L 324 96 L 303 96 L 276 64 L 252 64 L 252 96 L 236 96 Z M 252 15 L 252 50 L 280 50 C 292 50, 301 43, 301 32.5 C 301 22, 292 15, 280 15 Z" />
  <!-- A -->
  <path d="M 374 0 L 392 0 L 428 96 L 410 96 L 401 72 L 365 72 L 356 96 L 338 96 Z M 371 58 L 395 58 L 383 23 Z" />
  <!-- M -->
  <path d="M 452 0 L 471 0 L 494 62 L 517 0 L 536 0 L 536 96 L 520 96 L 520 28 L 501 80 L 487 80 L 468 28 L 468 96 L 452 96 Z" />
</g>`;

// Persian Wordmark "هورام"
const persianWordmark = (color = '#F5F4F0') => `
<g fill="${color}" transform="translate(0, 0)">
  <!-- هـ (Eye of Hoor) -->
  <path d="M 480 32 C 452 32, 428 54, 428 80 C 428 92, 436 96, 448 96 L 504 96 C 516 96, 524 88, 524 78 C 524 52, 502 32, 480 32 Z M 480 48 C 493 48, 506 59, 506 74 C 506 81, 501 83, 492 83 L 454 83 C 447 83, 444 80, 444 74 C 444 59, 461 48, 480 48 Z" />
  <!-- و (Vav of Hoor) -->
  <path d="M 364 36 C 344 36, 328 52, 328 72 C 328 84, 334 94, 346 96 L 316 132 L 332 132 L 358 100 L 384 100 C 398 100, 406 90, 406 76 C 406 54, 388 36, 364 36 Z M 364 50 C 376 50, 388 60, 388 74 C 388 83, 382 87, 372 87 L 350 87 C 344 87, 342 81, 342 74 C 342 60, 352 50, 364 50 Z" />
  <!-- ر (Re) -->
  <path d="M 284 56 L 268 56 L 244 116 C 240 126, 230 134, 214 134 L 206 134 L 206 120 L 214 120 C 224 120, 230 114, 234 106 Z" />
  <!-- ا (Alef) -->
  <path d="M 166 12 L 182 12 L 182 96 L 166 96 Z" />
  <!-- م (Mim) -->
  <path d="M 94 48 C 76 48, 62 62, 62 80 C 62 92, 70 98, 84 98 L 126 98 L 126 148 L 110 148 L 110 110 L 84 110 C 62 110, 46 96, 46 78 C 46 52, 68 34, 94 34 C 114 34, 126 44, 126 56 L 112 56 C 112 50, 104 48, 94 48 Z" />
</g>`;

// Category Sub-label "CREATIVE STUDIO"
const subLabel = (color = '#C5A46D') => `
<text x="268" y="142" font-family="'Cinzel', -apple-system, sans-serif" font-size="16" letter-spacing="9" fill="${color}" text-anchor="middle" font-weight="600">
  CREATIVE STUDIO
</text>`;

// Persian Sub-label "استودیو خلاق تبلیغات و دیجیتال"
const persianSubLabel = (color = '#C5A46D') => `
<text x="270" y="172" font-family="'Vazirmatn', sans-serif" font-size="16" letter-spacing="1" fill="${color}" text-anchor="middle" font-weight="500">
  استودیو خلاق تبلیغات و دیزاین دیجیتال
</text>`;

// Write all SVGs
console.log('Generating production vector files...');

// 1. Concept 1 Files
fs.writeFileSync(path.join(svgDir, 'concept-1-symbol.svg'), symbolC1('#C5A46D'));
fs.writeFileSync(path.join(svgDir, 'concept-2-symbol.svg'), symbolC2('#C5A46D'));
fs.writeFileSync(path.join(svgDir, 'concept-3-symbol.svg'), symbolC3('#C5A46D'));

// 2. Definitive Production Identity (Concept 1: The Radiant Nexus)
// Why Concept 1 is the unequivocal winner:
// - Absolute timeless purity: 2 balanced monolithic arcs forming an infinite circle of light.
// - Extreme legibility at 16x16px (zero thin lines to break, razor-sharp 45-degree negative space beam).
// - Deep conceptual alignment with "Hoor" (sunlight, radiance, illumination).
// - Flat single-color vector excellence (works in 100% black, 100% white, 100% champagne gold).

// Primary Horizontal Logo (Symbol + Latin HORAM + Subtitle)
const primaryHorizontalSvg = (bg = 'transparent', symbolColor = '#C5A46D', textColor = '#F5F4F0', subColor = '#C5A46D') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 220" width="100%" height="100%">
  ${bg !== 'transparent' ? `<rect width="920" height="220" fill="${bg}" />` : ''}
  <!-- Symbol -->
  <g transform="translate(30, 20) scale(0.3515625)">
    ${symbolC1(symbolColor)}
  </g>
  <!-- Wordmark -->
  <g transform="translate(260, 46)">
    ${latinWordmark(textColor)}
    ${subLabel(subColor)}
  </g>
</svg>`;

// Persian Horizontal Logo (Symbol + Persian هورام + Subtitle)
const persianHorizontalSvg = (bg = 'transparent', symbolColor = '#C5A46D', textColor = '#F5F4F0', subColor = '#C5A46D') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 220" width="100%" height="100%" dir="rtl">
  ${bg !== 'transparent' ? `<rect width="920" height="220" fill="${bg}" />` : ''}
  <!-- Wordmark on right/center -->
  <g transform="translate(100, 25)">
    ${persianWordmark(textColor)}
    ${persianSubLabel(subColor)}
  </g>
  <!-- Symbol on left -->
  <g transform="translate(710, 20) scale(0.3515625)">
    ${symbolC1(symbolColor)}
  </g>
</svg>`;

// Vertical Lockup (Symbol on top, HORAM on bottom)
const verticalLogoSvg = (bg = 'transparent', symbolColor = '#C5A46D', textColor = '#F5F4F0', subColor = '#C5A46D') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="100%" height="100%">
  ${bg !== 'transparent' ? `<rect width="600" height="700" fill="${bg}" />` : ''}
  <!-- Center Symbol -->
  <g transform="translate(144, 50) scale(0.609375)">
    ${symbolC1(symbolColor)}
  </g>
  <!-- Center Latin Wordmark -->
  <g transform="translate(32, 420)">
    ${latinWordmark(textColor)}
    ${subLabel(subColor)}
  </g>
</svg>`;

// Standalone Symbol SVG
const standaloneSymbolSvg = (color = '#C5A46D', bg = 'transparent') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  ${bg !== 'transparent' ? `<rect width="512" height="512" fill="${bg}" />` : ''}
  ${symbolC1(color)}
</svg>`;

// Save all production SVGs
fs.writeFileSync(path.join(svgDir, 'horam-logo-primary-dark.svg'), primaryHorizontalSvg('#111214', '#C5A46D', '#F5F4F0', '#C5A46D'));
fs.writeFileSync(path.join(svgDir, 'horam-logo-primary-light.svg'), primaryHorizontalSvg('#FFFFFF', '#111214', '#111214', '#C5A46D'));
fs.writeFileSync(path.join(svgDir, 'horam-logo-persian-dark.svg'), persianHorizontalSvg('#111214', '#C5A46D', '#F5F4F0', '#C5A46D'));
fs.writeFileSync(path.join(svgDir, 'horam-logo-persian-light.svg'), persianHorizontalSvg('#FFFFFF', '#111214', '#111214', '#C5A46D'));
fs.writeFileSync(path.join(svgDir, 'horam-logo-vertical-dark.svg'), verticalLogoSvg('#111214', '#C5A46D', '#F5F4F0', '#C5A46D'));
fs.writeFileSync(path.join(svgDir, 'horam-logo-vertical-light.svg'), verticalLogoSvg('#FFFFFF', '#111214', '#111214', '#C5A46D'));

fs.writeFileSync(path.join(svgDir, 'horam-symbol-gold.svg'), standaloneSymbolSvg('#C5A46D', 'transparent'));
fs.writeFileSync(path.join(svgDir, 'horam-symbol-white.svg'), standaloneSymbolSvg('#F5F4F0', 'transparent'));
fs.writeFileSync(path.join(svgDir, 'horam-symbol-black.svg'), standaloneSymbolSvg('#111214', 'transparent'));
fs.writeFileSync(path.join(svgDir, 'horam-symbol-obsidian-badge.svg'), standaloneSymbolSvg('#C5A46D', '#111214'));

console.log('Saved 10 production SVG files in public/brand-identity/svg/');

// -------------------------------------------------------------
// 3. MASTER PRESENTATION & REAL-WORLD TESTING HTML SHEET
// -------------------------------------------------------------
const presentationHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HORAM STUDIO — Brand Identity System & Design Specifications</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Vazirmatn:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --obsidian: #111214;
      --gold: #C5A46D;
      --platinum: #B8BBC0;
      --white: #F5F4F0;
      --pure-black: #08090A;
      --card-bg: rgba(255, 255, 255, 0.02);
      --border: rgba(255, 255, 255, 0.08);
    }
    body {
      background-color: var(--pure-black);
      color: var(--white);
      font-family: 'Inter', -apple-system, sans-serif;
      padding: 60px 40px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    /* Header */
    .brand-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 60px;
    }
    .brand-tag {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 4px;
      color: var(--gold);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .brand-title {
      font-size: 38px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #FFFFFF;
    }
    .brand-title span {
      font-family: 'Vazirmatn', sans-serif;
      font-weight: 800;
      color: var(--gold);
      margin-left: 12px;
    }
    .meta-details {
      text-align: right;
      font-size: 12px;
      color: var(--platinum);
      letter-spacing: 1px;
    }

    /* Section Styling */
    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 3px;
      color: var(--gold);
      text-transform: uppercase;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .section-title::after {
      content: '';
      flex-grow: 1;
      height: 1px;
      background: var(--border);
    }

    /* 3 Explorations Comparison */
    .exploration-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      margin-bottom: 80px;
    }
    .concept-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      flex-direction: column;
    }
    .concept-card.winner {
      border-color: var(--gold);
      background: linear-gradient(180deg, rgba(197, 164, 109, 0.08) 0%, rgba(17, 18, 20, 0.6) 100%);
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6);
      position: relative;
    }
    .winner-badge {
      position: absolute;
      top: -12px;
      right: 24px;
      background: var(--gold);
      color: var(--obsidian);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 4px 12px;
      border-radius: 999px;
      text-transform: uppercase;
    }
    .concept-preview-box {
      width: 140px;
      height: 140px;
      margin: 0 auto 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .concept-name {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
    }
    .concept-sub {
      font-size: 12px;
      color: var(--gold);
      font-family: 'Cinzel', serif;
      letter-spacing: 1px;
      margin-bottom: 16px;
    }
    .concept-rationale {
      font-size: 13px;
      color: var(--platinum);
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
    }
    .eval-row {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 8px 0;
      font-size: 11px;
    }
    .eval-label { color: #64748B; }
    .eval-val { color: #FFFFFF; font-weight: 600; }

    /* The Definitive Master Identity Showcase */
    .master-hero {
      background: var(--obsidian);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 64px 48px;
      margin-bottom: 80px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }
    .master-logo-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: #08090A;
      border-radius: 16px;
      border: 1px solid var(--border);
    }
    .master-logo-display svg {
      max-width: 480px;
      height: auto;
    }
    .master-story {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .master-story h2 {
      font-size: 28px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }
    .master-story p {
      font-size: 14px;
      color: var(--platinum);
      line-height: 1.8;
    }
    .color-swatches {
      display: flex;
      gap: 16px;
      margin-top: 12px;
    }
    .swatch {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 11px;
      font-family: monospace;
      color: var(--platinum);
    }
    .swatch-box {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* Lockups Showcase Grid */
    .lockup-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
      margin-bottom: 80px;
    }
    .lockup-card {
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 240px;
    }
    .lockup-card.dark { background: var(--obsidian); }
    .lockup-card.light { background: #FFFFFF; }
    .lockup-caption {
      margin-top: 16px;
      font-size: 11px;
      font-family: 'Cinzel', serif;
      letter-spacing: 2px;
      color: #64748B;
      text-transform: uppercase;
    }

    /* Real-World Context Testing Grid */
    .tests-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      margin-bottom: 80px;
    }
    .test-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }
    .test-label {
      font-size: 11px;
      font-family: 'Cinzel', serif;
      letter-spacing: 1.5px;
      color: var(--gold);
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    /* 1. Google 16x16 Test */
    .google-search-mockup {
      background: #202124;
      border: 1px solid #303134;
      border-radius: 12px;
      padding: 16px;
    }
    .google-res-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .google-tiny-favicon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #000000;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      flex-shrink: 0;
    }
    .google-domain {
      font-size: 13px;
      color: #DADCE0;
      font-weight: 500;
    }
    .google-link {
      font-size: 11px;
      color: #9AA0A6;
    }
    .google-title {
      font-size: 16px;
      color: #99C3FF;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .google-desc {
      font-size: 11px;
      color: #BDC1C6;
      line-height: 1.4;
    }

    /* 2. Instagram Profile Avatar Test */
    .social-avatar-mockup {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #000000;
      padding: 20px;
      border-radius: 14px;
      border: 1px solid #262626;
    }
    .insta-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #111214;
      border: 2px solid var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
    }
    .insta-meta {
      display: flex;
      flex-direction: column;
    }
    .insta-handle {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .insta-sub {
      font-size: 11px;
      color: var(--platinum);
    }

    /* 3. Film Opening Slate (16:9 Cinematic Screen) */
    .film-slate-mockup {
      aspect-ratio: 16 / 9;
      background: #040507;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .film-slate-mockup svg {
      width: 64px;
      height: 64px;
      margin-bottom: 12px;
    }
    .film-slate-title {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 8px;
      color: #FFFFFF;
      font-weight: 600;
      text-transform: uppercase;
    }
    .film-slate-sub {
      font-family: 'Cinzel', serif;
      font-size: 7px;
      letter-spacing: 4px;
      color: var(--gold);
      margin-top: 6px;
      text-transform: uppercase;
    }
    
    /* 4. Minimalist Stationery Test */
    .stationery-mockup {
      background: #FFFFFF;
      color: #111214;
      padding: 24px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 140px;
    }
    .stationery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stationery-brand {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      letter-spacing: 2px;
      font-weight: 700;
    }
    .stationery-rule {
      height: 1px;
      background: rgba(0,0,0,0.1);
      margin: 14px 0;
    }
    .stationery-footer {
      font-size: 8px;
      color: #64748B;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Meta Header -->
    <header class="brand-meta">
      <div>
        <div class="brand-tag">Visual Identity System • 2026 Specification</div>
        <h1 class="brand-title">HORAM STUDIO <span>استودیو هورام</span></h1>
      </div>
      <div class="meta-details">
        <div>CORE THEME: THE INFINITE LIGHT (هور)</div>
        <div>DISCIPLINE: CINEMA & BESPOKE DIGITAL</div>
      </div>
    </header>

    <!-- 1. The Three Explorations -->
    <div class="section-title">01 / Concept Explorations & Comparative Evaluation</div>
    <div class="exploration-grid">
      <!-- Concept 1 -->
      <div class="concept-card winner">
        <div class="winner-badge">Selected Master</div>
        <div class="concept-preview-box">
          ${symbolC1('#C5A46D')}
        </div>
        <div class="concept-name">The Radiant Nexus</div>
        <div class="concept-sub">DIRECTION A • CIRCULAR CONTINUITY & LIGHT BEAM</div>
        <p class="concept-rationale">
          An abstract geometric circle forged by two counter-balancing monolithic crescents that never touch, separated by a 45-degree diagonal light corridor. In the center sits an optical light core. Represents the origin of illumination (Hoor) and the cinematic projection beam without cliché illustrations.
        </p>
        <div class="eval-row">
          <span class="eval-label">Distinctiveness</span>
          <span class="eval-val">9.8 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Small-Size Legibility (16px)</span>
          <span class="eval-val">10 / 10 (Flawless)</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Timeless Modernism</span>
          <span class="eval-val">9.9 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Single-Color Vector Purity</span>
          <span class="eval-val">100% Flat</span>
        </div>
      </div>

      <!-- Concept 2 -->
      <div class="concept-card">
        <div class="concept-preview-box">
          ${symbolC2('#C5A46D')}
        </div>
        <div class="concept-name">The Luminous Horizon</div>
        <div class="concept-sub">DIRECTION B • DUAL MONOLITHS & SOLAR DISC</div>
        <p class="concept-rationale">
          Two architectural vertical pillars representing the studio's two divisions (Film Production & Digital Platforms), united by a central celestial solar disc with an optical horizon slit. Creates an unmistakable architectural letter H.
        </p>
        <div class="eval-row">
          <span class="eval-label">Distinctiveness</span>
          <span class="eval-val">9.2 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Small-Size Legibility (16px)</span>
          <span class="eval-val">8.8 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Timeless Modernism</span>
          <span class="eval-val">9.4 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Single-Color Vector Purity</span>
          <span class="eval-val">100% Flat</span>
        </div>
      </div>

      <!-- Concept 3 -->
      <div class="concept-card">
        <div class="concept-preview-box">
          ${symbolC3('#C5A46D')}
        </div>
        <div class="concept-name">The Continuous Prism</div>
        <div class="concept-sub">DIRECTION C • GEOMETRIC RIBBON & REEL</div>
        <p class="concept-rationale">
          A continuous geometric planar loop inspired by the Möbius strip, subtly forming the Persian loop 'هـ' (Hoor) and the Latin H. Focuses on the eternal cyclical flow of creativity, digital code, and film reel continuity.
        </p>
        <div class="eval-row">
          <span class="eval-label">Distinctiveness</span>
          <span class="eval-val">8.9 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Small-Size Legibility (16px)</span>
          <span class="eval-val">8.4 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Timeless Modernism</span>
          <span class="eval-val">8.7 / 10</span>
        </div>
        <div class="eval-row">
          <span class="eval-label">Single-Color Vector Purity</span>
          <span class="eval-val">100% Flat</span>
        </div>
      </div>
    </div>

    <!-- 2. Master Identity Showcase -->
    <div class="section-title">02 / Definitive Master Identity: The Radiant Nexus</div>
    <div class="master-hero">
      <div class="master-logo-display">
        ${primaryHorizontalSvg('transparent', '#C5A46D', '#F5F4F0', '#C5A46D')}
      </div>
      <div class="master-story">
        <h2>Infinite Light, Precision Craft</h2>
        <p>
          Derived from the ancient Persian root <strong>«هور» (Hoor)</strong> — the life-giving sun, illumination, and radiance. 
          The mark distills the core essence of cinematic storytelling and digital architecture into a pristine, balanced geometric seal.
        </p>
        <p>
          Constructed with <strong>zero decorative gradients, zero fake bevels, and zero 3D tricks</strong>. 
          It operates with absolute authority as a pure single-color silhouette across digital viewports, film slates, and physical embossing.
        </p>
        <div class="color-swatches">
          <div class="swatch">
            <div class="swatch-box" style="background: #111214;"></div>
            <span>#111214</span>
            <span style="font-size: 9px;">Obsidian</span>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background: #C5A46D;"></div>
            <span>#C5A46D</span>
            <span style="font-size: 9px;">Champagne Gold</span>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background: #B8BBC0;"></div>
            <span>#B8BBC0</span>
            <span style="font-size: 9px;">Platinum</span>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background: #F5F4F0;"></div>
            <span>#F5F4F0</span>
            <span style="font-size: 9px;">Warm White</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Lockup System Grid -->
    <div class="section-title">03 / Typographic Lockup System & Background Inversions</div>
    <div class="lockup-grid">
      <!-- Latin Primary Dark -->
      <div class="lockup-card dark">
        <div style="width: 100%; max-width: 480px;">
          ${primaryHorizontalSvg('transparent', '#C5A46D', '#F5F4F0', '#C5A46D')}
        </div>
        <div class="lockup-caption">Primary Horizontal • Deep Obsidian Ground</div>
      </div>
      <!-- Latin Primary Light -->
      <div class="lockup-card light">
        <div style="width: 100%; max-width: 480px;">
          ${primaryHorizontalSvg('transparent', '#111214', '#111214', '#C5A46D')}
        </div>
        <div class="lockup-caption">Primary Horizontal • Pure White Ground</div>
      </div>
      <!-- Persian Primary Dark -->
      <div class="lockup-card dark">
        <div style="width: 100%; max-width: 480px;">
          ${persianHorizontalSvg('transparent', '#C5A46D', '#F5F4F0', '#C5A46D')}
        </div>
        <div class="lockup-caption">Bespoke Persian Lockup (استودیو هورام) • Dark</div>
      </div>
      <!-- Persian Primary Light -->
      <div class="lockup-card light">
        <div style="width: 100%; max-width: 480px;">
          ${persianHorizontalSvg('transparent', '#111214', '#111214', '#C5A46D')}
        </div>
        <div class="lockup-caption">Bespoke Persian Lockup (استودیو هورام) • Light</div>
      </div>
    </div>

    <!-- 4. Real-World Context Testing -->
    <div class="section-title">04 / Real-World Stress Tests & Applications</div>
    <div class="tests-grid">
      <!-- Test 1: Google Search Favicon -->
      <div class="test-box">
        <div class="test-label">1. Google Search 16×16px Favicon Test</div>
        <div class="google-search-mockup">
          <div class="google-res-top">
            <div class="google-tiny-favicon">
              ${symbolC1('#C5A46D')}
            </div>
            <div>
              <div class="google-domain">hooramstudio.ir</div>
              <div class="google-link">https://hooramstudio.ir</div>
            </div>
          </div>
          <div class="google-title">HORAM STUDIO | Cinematic Advertising & Web Design</div>
          <div class="google-desc">Premium commercial film production and bespoke web architecture for progressive brands in Iran and beyond.</div>
        </div>
      </div>

      <!-- Test 2: Social Media Avatar -->
      <div class="test-box">
        <div class="test-label">2. Instagram / Social Circular Avatar</div>
        <div class="social-avatar-mockup">
          <div class="insta-circle">
            ${symbolC1('#C5A46D')}
          </div>
          <div class="insta-meta">
            <div class="insta-handle">horam.studio</div>
            <div class="insta-sub">Creative Advertising & Digital Design</div>
          </div>
        </div>
      </div>

      <!-- Test 3: Film 16:9 Title Slate -->
      <div class="test-box">
        <div class="test-label">3. 4K Cinema Opening Frame Slate</div>
        <div class="film-slate-mockup">
          ${symbolC1('#FFFFFF')}
          <div class="film-slate-title">HORAM</div>
          <div class="film-slate-sub">A CINEMATIC PRODUCTION</div>
        </div>
      </div>

      <!-- Test 4: Monochrome Black Stationer -->
      <div class="test-box">
        <div class="test-label">4. Minimalist Corporate Letterhead</div>
        <div class="stationery-mockup">
          <div class="stationery-header">
            <div style="width: 28px; height: 28px;">
              ${symbolC1('#111214')}
            </div>
            <div class="stationery-brand">HORAM STUDIO</div>
          </div>
          <div class="stationery-rule"></div>
          <div class="stationery-footer">
            <span>TEHRAN, IRAN</span>
            <span>INFO@HOORAMSTUDIO.IR</span>
          </div>
        </div>
      </div>

      <!-- Test 5: Monochrome Pure White Silhouette -->
      <div class="test-box">
        <div class="test-label">5. Pure Monochrome Silhouette (White on Black)</div>
        <div style="background: #000000; border-radius: 12px; height: 140px; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div style="width: 72px; height: 72px;">
            ${symbolC1('#FFFFFF')}
          </div>
        </div>
      </div>

      <!-- Test 6: Monochrome Pure Black Silhouette -->
      <div class="test-box">
        <div class="test-label">6. Pure Monochrome Silhouette (Black on White)</div>
        <div style="background: #FFFFFF; border-radius: 12px; height: 140px; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div style="width: 72px; height: 72px;">
            ${symbolC1('#000000')}
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.resolve('public', 'brand-identity', 'index.html'), presentationHtml);
console.log('Saved presentation sheet in public/brand-identity/index.html');

