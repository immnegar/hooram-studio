import fs from 'fs';
import path from 'path';

// Palette tokens matching hooramstudio.ir
const C = {
  obsidian: '#07090E',
  surface: '#0B0F19',
  surfaceLight: '#121826',
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  cyan: '#38BDF8',
  cyanDark: '#0EA5E9',
  white: '#FFFFFF',
  silver: '#94A3B8',
  muted: '#64748B',
  border: '#1E293B',
  amber: '#F59E0B'
};

/* =========================================================================
   MODEL 1: THE RADIANT NEXUS (نکسوس نور و انرژی)
   Concept: Intersecting continuous orbital torus with radiant optical core
   ========================================================================= */
const model1Symbol = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="m1-grad-primary" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
    <linearGradient id="m1-grad-secondary" x1="85" y1="15" x2="15" y2="85" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <filter id="m1-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Outer orbital ring with precision negative space break -->
  <circle cx="50" cy="50" r="40" stroke="url(#m1-grad-primary)" stroke-width="4.5" stroke-dasharray="190 35" stroke-linecap="round" />
  <!-- Dynamic counter-curve intersecting arc -->
  <path d="M 28 32 C 34 20, 66 20, 72 32 C 80 46, 68 76, 50 76 C 32 76, 20 46, 28 32 Z" 
        stroke="url(#m1-grad-secondary)" stroke-width="3.5" fill="none" stroke-linecap="round" />
  <!-- Central optical radiance point (The Hoor Core) -->
  <circle cx="50" cy="46" r="6" fill="#38BDF8" filter="url(#m1-glow)" />
  <circle cx="50" cy="46" r="2.5" fill="#FFFFFF" />
  <!-- Radiant Light Ray -->
  <path d="M 50 30 L 50 36 M 50 56 L 50 62 M 36 46 L 42 46 M 58 46 L 64 46" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" opacity="0.8" />
</svg>
`;

/* =========================================================================
   MODEL 2: THE DOUBLE-O INFINISUN (اینفینی‌سان / نشان هور و بی‌نهایت)
   Concept: Built directly from the identity's double "OO" of HOORAM.
            Two overlapping luminous rings forming an infinity lens of pure light.
   ========================================================================= */
const model2Symbol = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="m2-grad-left" x1="15" y1="25" x2="60" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="m2-grad-right" x1="40" y1="25" x2="85" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <linearGradient id="m2-grad-center" x1="50" y1="35" x2="50" y2="65" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <filter id="m2-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Left Ring: First 'O' of HOORAM / Sun Source -->
  <circle cx="38" cy="50" r="24" stroke="url(#m2-grad-left)" stroke-width="5" stroke-linecap="round" />
  <!-- Right Ring: Second 'O' of HOORAM / Cinema Aperture & Infinity -->
  <circle cx="62" cy="50" r="24" stroke="url(#m2-grad-right)" stroke-width="5" stroke-linecap="round" />
  <!-- Central Overlap: Optical Vesica Piscis / Lens of Infinite Light -->
  <path d="M 50 35.5 C 56 42, 56 58, 50 64.5 C 44 58, 44 42, 50 35.5 Z" 
        fill="url(#m2-grad-center)" opacity="0.95" filter="url(#m2-glow)" />
  <!-- Radiant Sparkle Core -->
  <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
</svg>
`;

/* =========================================================================
   MODEL 3: THE PRISMATIC MONOLITH (منشور سینمایی و شکاف پرتو نور)
   Concept: Architectural Monogram 'H' merged with a 45-degree cinematic 
            beam of light slicing through darkness (widescreen aspect ratio).
   ========================================================================= */
const model3Symbol = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="m3-pillar-left" x1="22" y1="20" x2="38" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="m3-pillar-right" x1="62" y1="20" x2="78" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <linearGradient id="m3-beam" x1="28" y1="65" x2="72" y2="35" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>
    <filter id="m3-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Left Pillar of 'H' -->
  <rect x="22" y="22" width="10" height="56" rx="5" fill="url(#m3-pillar-left)" />
  <!-- Right Pillar of 'H' -->
  <rect x="68" y="22" width="10" height="56" rx="5" fill="url(#m3-pillar-right)" />
  <!-- Diagonal Prismatic Beam bridging the H (Cinema Projection Beam) -->
  <path d="M 28 58 L 72 38 L 72 48 L 28 68 Z" fill="url(#m3-beam)" filter="url(#m3-glow)" />
  <!-- Center focal brilliance -->
  <circle cx="50" cy="48" r="3.5" fill="#FFFFFF" />
  <!-- Framing micro-nodes -->
  <circle cx="27" cy="22" r="2" fill="#818CF8" />
  <circle cx="73" cy="78" r="2" fill="#38BDF8" />
</svg>
`;

/* =========================================================================
   Generate Full Horizontal & Vertical Lockups for all 3 models
   ========================================================================= */

function createHorizontalLockup(symbolSvg, title, persianTitle, sub) {
  return `
<div style="display: flex; align-items: center; gap: 18px;">
  <div style="width: 58px; height: 58px; flex-shrink: 0;">
    ${symbolSvg}
  </div>
  <div style="display: flex; flex-direction: column; justify-content: center; text-align: right;">
    <div style="display: flex; align-items: baseline; gap: 12px;">
      <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; letter-spacing: 0.15em; color: #FFFFFF;">
        ${title}
      </span>
      <span style="font-family: 'Vazirmatn', sans-serif; font-size: 19px; font-weight: 700; color: #F1F5F9;">
        ${persianTitle}
      </span>
    </div>
    <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.28em; color: #94A3B8; margin-top: 4px; text-transform: uppercase;">
      ${sub}
    </span>
  </div>
</div>`;
}

function createDarkHeaderSimulation(symbolSvg, title) {
  return `
<div style="background: rgba(11, 15, 25, 0.95); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 14px 22px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);">
  <div style="display: flex; align-items: center; gap: 12px;">
    <div style="width: 36px; height: 36px;">
      ${symbolSvg}
    </div>
    <div style="display: flex; flex-direction: column;">
      <span style="font-family: 'Vazirmatn', sans-serif; font-size: 13px; font-weight: 700; color: #FFFFFF;">استودیو تبلیغاتی هورام</span>
      <span style="font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 600; letter-spacing: 0.18em; color: #94A3B8;">${title} STUDIO</span>
    </div>
  </div>
  <div style="display: flex; gap: 14px; font-family: 'Vazirmatn', sans-serif; font-size: 11px; color: #94A3B8;">
    <span>صفحه اصلی</span>
    <span style="color: #6366F1; font-weight: 600;">نمونه‌کارها</span>
    <span>خدمات</span>
    <span>تماس</span>
  </div>
  <div style="background: #6366F1; color: #fff; font-family: 'Vazirmatn', sans-serif; font-size: 10px; font-weight: 600; padding: 6px 14px; border-radius: 9999px;">
    ثبت پروژه
  </div>
</div>`;
}

const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>HOORAM STUDIO — 3 Master Brand Identity Models</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Vazirmatn:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #07090E;
      color: #F8FAFC;
      font-family: 'Vazirmatn', sans-serif;
      padding: 40px 24px;
      line-height: 1.6;
    }
    .container {
      max-width: 1300px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 1px solid #1E293B;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.15em;
      font-weight: 700;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    .title {
      font-size: 32px;
      font-weight: 900;
      color: #FFFFFF;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 15px;
      color: #94A3B8;
      max-width: 750px;
      margin: 0 auto;
    }
    .models-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      margin-bottom: 50px;
    }
    .model-card {
      background: #0B0F19;
      border: 1px solid #1E293B;
      border-radius: 24px;
      padding: 30px 24px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.6);
      transition: all 0.3s ease;
    }
    .model-card:hover {
      border-color: #6366F1;
      transform: translateY(-4px);
    }
    .model-badge {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .model-number {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 800;
      color: #6366F1;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 4px 12px;
      border-radius: 8px;
    }
    .model-name-en {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: #94A3B8;
    }
    .symbol-stage {
      background: radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, rgba(7, 9, 14, 0.6) 80%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;
      min-height: 180px;
    }
    .symbol-svg-wrapper {
      width: 120px;
      height: 120px;
      filter: drop-shadow(0 10px 20px rgba(99, 102, 241, 0.25));
    }
    .model-title {
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .model-concept {
      font-size: 12.5px;
      color: #94A3B8;
      line-height: 1.6;
      margin-bottom: 20px;
      min-height: 58px;
    }
    .section-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 10px;
      display: block;
    }
    .lockup-box {
      background: #07090E;
      border: 1px solid #1E293B;
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 18px;
    }
    .mini-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 18px;
    }
    .mini-box {
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .mini-box-dark {
      background: #07090E;
      border: 1px solid #1E293B;
    }
    .mini-box-light {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
    }
    .mini-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.1em;
    }
    .app-icon-row {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #07090E;
      border: 1px solid #1E293B;
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 18px;
    }
    .app-icon-48 {
      width: 48px;
      height: 48px;
      background: #0B0F19;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
    .app-icon-32 {
      width: 32px;
      height: 32px;
      background: #0B0F19;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-preview {
      margin-bottom: 20px;
    }
    .features-list {
      list-style: none;
      padding: 0;
      margin-bottom: 24px;
      font-size: 12px;
      color: #CBD5E1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .features-list li {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .features-list li::before {
      content: '✓';
      color: #38BDF8;
      font-weight: bold;
    }
    .btn-select {
      margin-top: auto;
      background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
      color: #fff;
      text-align: center;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }
    .summary-section {
      background: #0B0F19;
      border: 1px solid #1E293B;
      border-radius: 20px;
      padding: 30px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .summary-text h3 {
      font-size: 18px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .summary-text p {
      font-size: 13px;
      color: #94A3B8;
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="badge">HOORAM STUDIO BRAND IDENTITY DESIGN</div>
      <h1 class="title">طراحی و مقایسه ۳ مدل لوگوی اختصاصی استودیو هورام</h1>
      <p class="subtitle">
        هر سه مدل با هویت ریشه‌ای «هور» (نور، تابش و سینما)، پالت رنگی رسمی سایت و استاندارد بین‌المللی طراحی شده‌اند. 
        یکی از این سه مدل را انتخاب کنید تا به صورت ۱۰۰٪ یکپارچه در تمام هدرها، فوتر، فاوآیکون‌های گوگل، پنل ادمین و متادیتاها اعمال گردد.
      </p>
    </div>

    <!-- 3 Models Grid -->
    <div class="models-grid">

      <!-- MODEL 1 -->
      <div class="model-card">
        <div class="model-badge">
          <span class="model-number">مدل شماره ۱</span>
          <span class="model-name-en">THE RADIANT NEXUS</span>
        </div>

        <div class="symbol-stage">
          <div class="symbol-svg-wrapper">
            ${model1Symbol}
          </div>
        </div>

        <h3 class="model-title">نکسوس نور و انرژی</h3>
        <p class="model-concept">
          تلاقی دو حلقه مداری پیوسته با کانون تابش اپتیکال. نماد همگرایی فیلمسازی تبلیغاتی سینمایی و تجربیات دیجیتال مدرن.
        </p>

        <span class="section-label">۱. ترکیب افقی رسمی (Horizontal Lockup)</span>
        <div class="lockup-box">
          ${createHorizontalLockup(model1Symbol, 'HOORAM', 'هورام', 'CINEMATIC ADVERTISING & DIGITAL')}
        </div>

        <span class="section-label">۲. پیش‌نمایش در هدر وب‌سایت (Header Preview)</span>
        <div class="header-preview">
          ${createDarkHeaderSimulation(model1Symbol, 'HOORAM')}
        </div>

        <span class="section-label">۳. فاوآیکون سرچ گوگل و اپلیکیشن (Favicon / App Icon)</span>
        <div class="app-icon-row">
          <div class="app-icon-48">
            ${model1Symbol}
          </div>
          <div class="app-icon-32">
            ${model1Symbol}
          </div>
          <div style="font-size: 11px; color: #94A3B8;">
            <strong style="color: #fff;">48x48px Google Favicon</strong><br>
            وضوح درخشان در نتایج جستجوی گوگل
          </div>
        </div>

        <span class="section-label">۴. ویژگی‌های برجسته</span>
        <ul class="features-list">
          <li>فرم هندسی توروس پیوسته (بی‌نهایت و تابش نور)</li>
          <li>کنتراست فوق‌العاده در پس‌زمینه دارک سایت</li>
          <li>ترکیب مدرن شیب رنگ ایندیگو و سایان الکتریک</li>
        </ul>

        <div class="btn-select">انتخاب مدل ۱: نکسوس نور (Radiant Nexus)</div>
      </div>

      <!-- MODEL 2 -->
      <div class="model-card">
        <div class="model-badge">
          <span class="model-number">مدل شماره ۲</span>
          <span class="model-name-en">DOUBLE-O INFINISUN</span>
        </div>

        <div class="symbol-stage">
          <div class="symbol-svg-wrapper">
            ${model2Symbol}
          </div>
        </div>

        <h3 class="model-title">اینفینی‌سان (نشان دو O و بی‌نهایت)</h3>
        <p class="model-concept">
          برخاسته از امضای نام برند: دو حرف **OO** در H**OO**RAM به عنوان دو چشمه نور هم‌پوشان که لنز اپتیکال و نماد ابدیت هورام را خلق می‌کنند.
        </p>

        <span class="section-label">۱. ترکیب افقی رسمی (Horizontal Lockup)</span>
        <div class="lockup-box">
          ${createHorizontalLockup(model2Symbol, 'HOORAM', 'هورام', 'CINEMATIC FILM & DIGITAL CRAFT')}
        </div>

        <span class="section-label">۲. پیش‌نمایش در هدر وب‌سایت (Header Preview)</span>
        <div class="header-preview">
          ${createDarkHeaderSimulation(model2Symbol, 'HOORAM')}
        </div>

        <span class="section-label">۳. فاوآیکون سرچ گوگل و اپلیکیشن (Favicon / App Icon)</span>
        <div class="app-icon-row">
          <div class="app-icon-48">
            ${model2Symbol}
          </div>
          <div class="app-icon-32">
            ${model2Symbol}
          </div>
          <div style="font-size: 11px; color: #94A3B8;">
            <strong style="color: #fff;">48x48px Google Favicon</strong><br>
            بالاترین وضوح و خوانایی در مقیاس‌های بسیار ریز
          </div>
        </div>

        <span class="section-label">۴. ویژگی‌های برجسته</span>
        <ul class="features-list">
          <li>بسیار مینیمال، قدرتمند و به یاد ماندنی (Iconic)</li>
          <li>تطبیق مفهومی مستقیم با حروف H-OO-RAM</li>
          <li>عملکرد استثنایی در وکتور تک‌رنگ و مهر فیزیکی</li>
        </ul>

        <div class="btn-select">انتخاب مدل ۲: اینفینی‌سان (Double-O Infinisun)</div>
      </div>

      <!-- MODEL 3 -->
      <div class="model-card">
        <div class="model-badge">
          <span class="model-number">مدل شماره ۳</span>
          <span class="model-name-en">PRISMATIC MONOLITH</span>
        </div>

        <div class="symbol-stage">
          <div class="symbol-svg-wrapper">
            ${model3Symbol}
          </div>
        </div>

        <h3 class="model-title">منشور سینمایی و مونوگرام H</h3>
        <p class="model-concept">
          تلفیق معمارانه ستون‌های حرف **H** با پرتو مورب تابش پروژکتور سینما و کادر وایداسکرین (16:9). ساختاریافته، مقتدر و اصیل.
        </p>

        <span class="section-label">۱. ترکیب افقی رسمی (Horizontal Lockup)</span>
        <div class="lockup-box">
          ${createHorizontalLockup(model3Symbol, 'HOORAM', 'هورام', 'STUDIO FOR CINEMATIC ADVERTISING')}
        </div>

        <span class="section-label">۲. پیش‌نمایش در هدر وب‌سایت (Header Preview)</span>
        <div class="header-preview">
          ${createDarkHeaderSimulation(model3Symbol, 'HOORAM')}
        </div>

        <span class="section-label">۳. فاوآیکون سرچ گوگل و اپلیکیشن (Favicon / App Icon)</span>
        <div class="app-icon-row">
          <div class="app-icon-48">
            ${model3Symbol}
          </div>
          <div class="app-icon-32">
            ${model3Symbol}
          </div>
          <div style="font-size: 11px; color: #94A3B8;">
            <strong style="color: #fff;">48x48px Google Favicon</strong><br>
            فرم استوار و چشم‌نواز در تب مرورگر و نتایج سرچ
          </div>
        </div>

        <span class="section-label">۴. ویژگی‌های برجسته</span>
        <ul class="features-list">
          <li>مونوگرام اختصاصی حرف H با برش مورب نور</li>
          <li>الهام گرفته از پروژکتور سالن سینما و لنز آنامورفیک</li>
          <li>حس پرستیژ مهندسی‌شده و ابهت استودیویی</li>
        </ul>

        <div class="btn-select">انتخاب مدل ۳: منشور سینمایی (Prismatic Monolith)</div>
      </div>

    </div>

    <!-- Summary & Commitment -->
    <div class="summary-section">
      <div class="summary-text">
        <h3>برنامه یکپارچه‌سازی ۱۰۰٪ سراسری پس از انتخاب شما:</h3>
        <p>
          به محض اینکه مدل مورد نظر خود (۱، ۲ یا ۳) را انتخاب بفرمایید، دقیقاً همان طرح به عنوان آرت‌ورک واحد و یکپارچه در:
          هدر سایت (دسکتاپ و موبایل)، فوتر، منوی فول‌اسکرین، پیشخوان ادمین، فاوآیکون ۴۸ پیکسلی گوگل، متادیتای سئو و سرور اعمال خواهد شد.
        </p>
      </div>
    </div>
  </div>

</body>
</html>
`;

const presentationPath = path.join(process.cwd(), 'public', 'brand-identity', 'three-logo-models.html');
fs.writeFileSync(presentationPath, html, 'utf-8');
console.log('Created presentation at:', presentationPath);

