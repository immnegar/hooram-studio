import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// ---------------- CONCEPT 1: H-APERTURE (Modern Cinematic Monogram) ----------------
const svgConcept1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="c1_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="100%" stop-color="#05070B" />
    </linearGradient>
    <linearGradient id="c1_grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>
    <linearGradient id="c1_grad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="60%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>
    <linearGradient id="c1_gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="c1_border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(245,158,11,0.5)" />
      <stop offset="40%" stop-color="rgba(99,102,241,0.4)" />
      <stop offset="100%" stop-color="rgba(6,182,212,0.5)" />
    </linearGradient>
    <filter id="c1_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#6366F1" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="124" fill="url(#c1_bg)" />
  <rect x="14" y="14" width="484" height="484" rx="112" fill="none" stroke="url(#c1_border)" stroke-width="5" />

  <!-- Monogram Mark H + Shutter Aperture -->
  <g filter="url(#c1_glow)">
    <!-- Left Vertical Pillar (Cinema & Web Pillar) -->
    <path d="M 134 116 C 134 104, 144 94, 156 94 L 188 94 C 200 94, 210 104, 210 116 L 210 396 C 210 408, 200 418, 188 418 L 156 418 C 144 418, 134 408, 134 396 Z" fill="url(#c1_grad1)" />

    <!-- Right Vertical Pillar -->
    <path d="M 302 116 C 302 104, 312 94, 324 94 L 356 94 C 368 94, 378 104, 378 116 L 378 396 C 378 408, 368 418, 356 418 L 324 418 C 312 418, 302 408, 302 396 Z" fill="url(#c1_grad2)" />

    <!-- Dynamic Cinema Aperture Crossbeam (Forms H while evoking camera shutter & play facet) -->
    <path d="M 194 224 L 318 200 C 326 198, 334 204, 334 212 L 334 268 C 334 278, 326 286, 316 288 L 194 312 C 184 314, 176 306, 176 296 L 176 240 C 176 230, 184 222, 194 224 Z" fill="url(#c1_gold)" />

    <!-- Center Optical Lens Core (Precision Focus Dot) -->
    <circle cx="256" cy="256" r="22" fill="#FFFFFF" opacity="0.95" />
    <circle cx="256" cy="256" r="34" fill="none" stroke="#FBBF24" stroke-width="4" opacity="0.8" />
  </g>
</svg>`;

// ---------------- CONCEPT 2: HOOR & APERTURE (Persian هـ + Golden Sun of Cinema) ----------------
const svgConcept2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="c2_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090B10" />
      <stop offset="100%" stop-color="#030407" />
    </linearGradient>
    <linearGradient id="c2_gold1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="c2_gold2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="c2_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#F59E0B" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="124" fill="url(#c2_bg)" />
  <circle cx="256" cy="256" r="236" fill="none" stroke="url(#c2_gold1)" stroke-width="4" opacity="0.3" />
  <rect x="14" y="14" width="484" height="484" rx="112" fill="none" stroke="rgba(245, 158, 11, 0.2)" stroke-width="2" />

  <g filter="url(#c2_glow)" transform="translate(0, 0)">
    <!-- Outer Precision 6-Blade Cinema Iris Arc -->
    <!-- Blade 1 -->
    <path d="M 256 76 C 355.4 76, 436 156.6, 436 256 C 436 292, 426.5 325.8, 410 355 L 340 315 C 347.5 297, 352 277, 352 256 C 352 203, 309 160, 256 160 L 256 76 Z" fill="url(#c2_gold1)" />
    <!-- Blade 2 -->
    <path d="M 256 436 C 156.6 436, 76 355.4, 76 256 C 76 220, 85.5 186.2, 102 157 L 172 197 C 164.5 215, 160 235, 160 256 C 160 309, 203 352, 256 352 L 256 436 Z" fill="url(#c2_gold2)" />

    <!-- Center Continuous Persian 'هـ' & Infinity Reel Loop -->
    <path d="M 256 184 C 295.8 184, 328 216.2, 328 256 C 328 295.8, 295.8 328, 256 328 C 216.2 328, 184 295.8, 184 256 C 184 216.2, 216.2 184, 256 184 Z" fill="#0B0F19" stroke="url(#c2_gold1)" stroke-width="12" />

    <!-- Golden Eye Pupil / Anamorphic Center Light Beam -->
    <circle cx="256" cy="256" r="32" fill="url(#c2_gold2)" />
    <circle cx="256" cy="256" r="14" fill="#FFFFFF" />
  </g>
</svg>`;

// ---------------- CONCEPT 3: MINIMAL LUXURY H-FRAME (Architectural Modern) ----------------
const svgConcept3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="c3_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080A10" />
      <stop offset="100%" stop-color="#020305" />
    </linearGradient>
    <linearGradient id="c3_accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="30%" stop-color="#E0E7FF" />
      <stop offset="70%" stop-color="#818CF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="c3_gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="c3_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#818CF8" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="124" fill="url(#c3_bg)" />
  <rect x="14" y="14" width="484" height="484" rx="112" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="3" />

  <g filter="url(#c3_glow)">
    <!-- Architectural Letter H with 45-degree Precision Bevels -->
    <path d="M 140 108 L 204 108 L 204 220 L 308 220 L 308 108 L 372 108 L 372 404 L 308 404 L 308 292 L 204 292 L 204 404 L 140 404 Z" fill="url(#c3_accent)" />

    <!-- Cinema 16:9 Viewfinder Framing Accents in Gold -->
    <!-- Top-Left Crop Marker -->
    <path d="M 104 140 L 104 104 L 140 104" fill="none" stroke="url(#c3_gold)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Bottom-Right Crop Marker -->
    <path d="M 408 372 L 408 408 L 372 408" fill="none" stroke="url(#c3_gold)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Central Cinematic Anamorphic Star / Diamond Flare -->
    <polygon points="256,228 266,256 256,284 246,256" fill="#FDE68A" />
    <polygon points="228,256 256,266 284,256 256,246" fill="#FDE68A" />
    <circle cx="256" cy="256" r="6" fill="#FFFFFF" />
  </g>
</svg>`;

// Write SVGs to public/logo-concepts
const outDir = path.join(process.cwd(), 'public', 'logo-concepts');
fs.writeFileSync(path.join(outDir, 'concept-1.svg'), svgConcept1);
fs.writeFileSync(path.join(outDir, 'concept-2.svg'), svgConcept2);
fs.writeFileSync(path.join(outDir, 'concept-3.svg'), svgConcept3);
console.log('Saved 3 SVG logo concepts in public/logo-concepts/');

// Generate HTML Showcase
const htmlShowcase = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>طراحی لوگوی رسمی استودیو هورام و پیش‌نمایش سرچ گوگل</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #06080D;
      color: #E2E8F0;
      font-family: 'Vazirmatn', sans-serif;
      padding: 40px 24px;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 48px;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818CF8;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      color: #FFFFFF;
      margin-bottom: 12px;
    }
    p.subtitle {
      color: #94A3B8;
      font-size: 15px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      max-width: 1200px;
      margin: 0 auto 48px;
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }
    .concept-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(12px);
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
    }
    .concept-card.featured {
      border-color: rgba(99, 102, 241, 0.4);
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
      box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.25);
    }
    .card-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 8px;
      align-self: flex-start;
      margin-bottom: 16px;
    }
    .badge-c1 { background: rgba(99,102,241,0.2); color: #A5B4FC; }
    .badge-c2 { background: rgba(245,158,11,0.2); color: #FCD34D; }
    .badge-c3 { background: rgba(255,255,255,0.1); color: #F1F5F9; }
    
    .logo-hero-box {
      width: 160px;
      height: 160px;
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #07090E;
      border-radius: 36px;
      box-shadow: 0 16px 32px rgba(0,0,0,0.6);
      padding: 16px;
    }
    .logo-hero-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .concept-title {
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    .concept-desc {
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.6;
      margin-bottom: 24px;
      flex-grow: 1;
    }

    /* Google Search Simulation Box */
    .google-preview-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .google-card {
      background: #202124;
      border: 1px solid #303134;
      border-radius: 14px;
      padding: 16px;
      text-align: right;
    }
    .google-header-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .google-favicon-box {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #303134;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .google-favicon-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .google-domain-col {
      display: flex;
      flex-direction: column;
    }
    .google-domain-name {
      font-size: 14px;
      color: #BDC1C6;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .google-domain-url {
      font-size: 11px;
      color: #9AA0A6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .google-snippet-title {
      font-size: 18px;
      font-weight: 600;
      color: #99C3FF;
      line-height: 1.35;
      margin-bottom: 6px;
    }
    .google-snippet-desc {
      font-size: 12px;
      color: #BDC1C6;
      line-height: 1.5;
    }

    /* Navbar Mockup Simulation */
    .navbar-preview-box {
      margin-top: 16px;
      background: rgba(7, 9, 14, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .navbar-preview-logo {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      overflow: hidden;
    }
    .navbar-preview-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .navbar-preview-text {
      display: flex;
      flex-direction: column;
    }
    .navbar-preview-brand {
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .navbar-preview-sub {
      font-size: 8px;
      color: #64748B;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">بررسی و انتخاب لوگوی اختصاصی استودیو تبلیغاتی هورام</div>
    <h1>سه رویکرد طراحی لوگو و شبیه‌سازی سرچ گوگل</h1>
    <p class="subtitle">طراحی اختصاصی برای حل دائمی مشکل آیکون پیش‌فرض کره زمین در گوگل و جایگزینی آن با نماد حرفه‌ای استودیو</p>
  </div>

  <div class="grid">
    <!-- Concept 1 -->
    <div class="concept-card featured">
      <div class="card-badge badge-c1">رویکرد پیشنهادی ۱ (مدرن سینمایی - ترند بین‌المللی)</div>
      <div class="logo-hero-box">
        <img src="/logo-concepts/concept-1.svg" alt="Concept 1: H-Aperture" />
      </div>
      <h3 class="concept-title">کانسپت شاتر دیافراگم و حرف H</h3>
      <p class="concept-desc">
        ترکیب معماری حرف لاتین H با تیغه‌های دیافراگم دوربین سینمایی، زاویه تابش نور و فوکوس طلایی مرکزی. خوانایی فوق‌العاده بالا حتی در سایز ۱۶ پیکسلی گوگل سرچ.
      </p>

      <div class="google-preview-title">پیش‌نمایش در نتایج گوگل سرچ:</div>
      <div class="google-card">
        <div class="google-header-row">
          <div class="google-favicon-box">
            <img src="/logo-concepts/concept-1.svg" alt="Google Favicon" />
          </div>
          <div class="google-domain-col">
            <span class="google-domain-name">hooramstudio.ir</span>
            <span class="google-domain-url">https://hooramstudio.ir</span>
          </div>
        </div>
        <div class="google-snippet-title">استودیو تبلیغاتی هورام | تولید فیلم‌های تبلیغاتی هوش مصنوعی ...</div>
        <div class="google-snippet-desc">استودیو خلاق هورام؛ خلق تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن...</div>
      </div>

      <div class="navbar-preview-box">
        <div class="navbar-preview-logo">
          <img src="/logo-concepts/concept-1.svg" alt="Navbar" />
        </div>
        <div class="navbar-preview-text">
          <span class="navbar-preview-brand">استودیو تبلیغاتی هورام</span>
          <span class="navbar-preview-sub">CREATIVE ADVERTISING STUDIO</span>
        </div>
      </div>
    </div>

    <!-- Concept 2 -->
    <div class="concept-card">
      <div class="card-badge badge-c2">رویکرد پیشنهادی ۲ (تلفیق حرف هـ + خورشید هورام)</div>
      <div class="logo-hero-box">
        <img src="/logo-concepts/concept-2.svg" alt="Concept 2: Hoor & Lens" />
      </div>
      <h3 class="concept-title">کانسپت هورام، خورشید و حلقه سینما</h3>
      <p class="concept-desc">
        الهام‌گرفته از ریشه واژه «هور» (به معنای خورشید و نور در زبان اصیل فارسی). دیافراگم ۶ تیغه طلایی که حلقه فیلم بی‌پایان و فرم مینیمال حرف «هـ» فارسی را در دل خود بازتاب می‌دهد.
      </p>

      <div class="google-preview-title">پیش‌نمایش در نتایج گوگل سرچ:</div>
      <div class="google-card">
        <div class="google-header-row">
          <div class="google-favicon-box">
            <img src="/logo-concepts/concept-2.svg" alt="Google Favicon" />
          </div>
          <div class="google-domain-col">
            <span class="google-domain-name">hooramstudio.ir</span>
            <span class="google-domain-url">https://hooramstudio.ir</span>
          </div>
        </div>
        <div class="google-snippet-title">استودیو تبلیغاتی هورام | تولید فیلم‌های تبلیغاتی هوش مصنوعی ...</div>
        <div class="google-snippet-desc">استودیو خلاق هورام؛ خلق تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن...</div>
      </div>

      <div class="navbar-preview-box">
        <div class="navbar-preview-logo">
          <img src="/logo-concepts/concept-2.svg" alt="Navbar" />
        </div>
        <div class="navbar-preview-text">
          <span class="navbar-preview-brand">استودیو تبلیغاتی هورام</span>
          <span class="navbar-preview-sub">CREATIVE ADVERTISING STUDIO</span>
        </div>
      </div>
    </div>

    <!-- Concept 3 -->
    <div class="concept-card">
      <div class="card-badge badge-c3">رویکرد پیشنهادی ۳ (معماری مینیمال لوکس - آرت هاوس)</div>
      <div class="logo-hero-box">
        <img src="/logo-concepts/concept-3.svg" alt="Concept 3: Minimal Frame" />
      </div>
      <h3 class="concept-title">کانسپت فریم کادربندی و پرتو نور</h3>
      <p class="concept-desc">
        تکیه بر خطوط مینیمال و نشانگرهای کادر دوربین ۱۶:۹ با ستون‌های یکدست و پرتو الماس‌گونه طلایی در مرکز. بسیار باوقار، لوکس و شبیه به هویت بصری استودیوهای تولید فیلم نیویورک و لندن.
      </p>

      <div class="google-preview-title">پیش‌نمایش در نتایج گوگل سرچ:</div>
      <div class="google-card">
        <div class="google-header-row">
          <div class="google-favicon-box">
            <img src="/logo-concepts/concept-3.svg" alt="Google Favicon" />
          </div>
          <div class="google-domain-col">
            <span class="google-domain-name">hooramstudio.ir</span>
            <span class="google-domain-url">https://hooramstudio.ir</span>
          </div>
        </div>
        <div class="google-snippet-title">استودیو تبلیغاتی هورام | تولید فیلم‌های تبلیغاتی هوش مصنوعی ...</div>
        <div class="google-snippet-desc">استودیو خلاق هورام؛ خلق تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن...</div>
      </div>

      <div class="navbar-preview-box">
        <div class="navbar-preview-logo">
          <img src="/logo-concepts/concept-3.svg" alt="Navbar" />
        </div>
        <div class="navbar-preview-text">
          <span class="navbar-preview-brand">استودیو تبلیغاتی هورام</span>
          <span class="navbar-preview-sub">CREATIVE ADVERTISING STUDIO</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'logo-showcase.html'), htmlShowcase);
console.log('Saved logo-showcase.html in public/');

