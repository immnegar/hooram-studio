import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const outDir = path.resolve('public', 'luxury-concepts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ---------------- LUXURY CONCEPT 1: "THE CHISELED MONOGRAM" (هاوت کوتور / های‌فشن & سینما) ----------------
// Razor-sharp, beveled architectural monogram of 'H'. Two precision tapered pillars with diamond faceted crossbeam.
// Refined champagne gold gradient, hairline edge lighting, luxury dark obsidian background.
const luxury1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="gold_metallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#FCE7A6" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="75%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#5B4307" />
    </linearGradient>
    <linearGradient id="gold_hairline" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#AA7C11" stop-opacity="0.1" />
    </linearGradient>
    <linearGradient id="facet_shadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#84620D" />
    </linearGradient>
    <radialGradient id="lux_ambient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#141926" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#040508" stop-opacity="1" />
    </radialGradient>
  </defs>

  <!-- Deep Obsidian Field -->
  <rect width="512" height="512" fill="url(#lux_ambient)" />

  <!-- Master Emblem: Chiseled Architectural H -->
  <g transform="translate(40, 40) scale(0.84375)">
    <!-- Outer Hairline Frame / Viewfinder Ratio Box -->
    <rect x="24" y="24" width="464" height="464" rx="20" fill="none" stroke="url(#gold_hairline)" stroke-width="1.5" />
    
    <!-- Fine 16:9 Cinema Corner Marks -->
    <path d="M 24 56 L 24 24 L 56 24" fill="none" stroke="#D4AF37" stroke-width="2" />
    <path d="M 488 56 L 488 24 L 456 24" fill="none" stroke="#D4AF37" stroke-width="2" />
    <path d="M 24 456 L 24 488 L 56 488" fill="none" stroke="#D4AF37" stroke-width="2" />
    <path d="M 488 456 L 488 488 L 456 488" fill="none" stroke="#D4AF37" stroke-width="2" />

    <!-- Left Pillar (Beveled Luxury Cut) -->
    <!-- Left Face -->
    <polygon points="120,96 168,96 168,416 120,416" fill="url(#gold_metallic)" />
    <!-- Chiseled Inner Bevel -->
    <polygon points="168,96 196,124 196,388 168,416" fill="url(#facet_shadow)" />

    <!-- Right Pillar (Beveled Luxury Cut) -->
    <!-- Chiseled Inner Bevel -->
    <polygon points="316,124 344,96 344,416 316,388" fill="url(#facet_shadow)" />
    <!-- Right Face -->
    <polygon points="344,96 392,96 392,416 344,416" fill="url(#gold_metallic)" />

    <!-- Center Cinematic Diamond Prism Crossbar (Negative Space + Golden Shutter Facet) -->
    <polygon points="196,256 256,220 316,256 256,292" fill="#FFFFFF" />
    <polygon points="196,256 256,236 316,256 256,276" fill="url(#gold_metallic)" />
    
    <!-- Central Anamorphic Star Glint -->
    <circle cx="256" cy="256" r="3" fill="#FFFFFF" />
  </g>
</svg>`;

// ---------------- LUXURY CONCEPT 2: "THE INFINITE HOOR" (حلقه جاودانگی، فرم مینیمال هـ و منشور نور) ----------------
// A continuous ribbon of pure geometry evoking Persian 'هـ' (Hoor = Sun), film loop, and lens ring.
// Platinum Silver & White Gold on Ultra-Deep Charcoal.
const luxury2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="plat_grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#E2E8F0" />
      <stop offset="70%" stop-color="#94A3B8" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <linearGradient id="plat_grad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>
    <linearGradient id="lux_indigo_flare" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A5B4FC" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#312E81" />
    </linearGradient>
  </defs>

  <!-- Deep Obsidian Field -->
  <rect width="512" height="512" fill="#05070B" />

  <!-- Center Emblem: Pure Geometric Monogram Loop -->
  <g transform="translate(256, 256)">
    <!-- Fine Concentric Alignment Ring -->
    <circle cx="0" cy="0" r="212" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    <circle cx="0" cy="0" r="198" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />

    <!-- Outer Precision Geometry: 8-Facet Golden Cut Frame -->
    <polygon points="0,-180 127,-127 180,0 127,127 0,180 -127,127 -180,0 -127,-127" fill="none" stroke="url(#plat_grad1)" stroke-width="2" opacity="0.4" />

    <!-- Flowing Persian 'هـ' + Cinema Ribbon -->
    <!-- Outer Loop -->
    <path d="M -90 -120 C 50 -160, 150 -50, 150 40 C 150 120, 70 150, 0 150 C -80 150, -150 100, -150 0 C -150 -90, -70 -150, 0 -150 C 40 -150, 80 -130, 110 -100" fill="none" stroke="url(#plat_grad1)" stroke-width="16" stroke-linecap="round" />

    <!-- Inner Core: Lens Aperture & Sun Horizon (Hoor) -->
    <circle cx="0" cy="0" r="54" fill="#05070B" stroke="url(#plat_grad2)" stroke-width="10" />
    <circle cx="0" cy="0" r="20" fill="url(#plat_grad1)" />

    <!-- Precision Horizontal Cinema Flare (Anamorphic Blue Line) -->
    <line x1="-160" y1="0" x2="-64" y2="0" stroke="url(#lux_indigo_flare)" stroke-width="3" stroke-linecap="round" />
    <line x1="64" y1="0" x2="160" y2="0" stroke="url(#lux_indigo_flare)" stroke-width="3" stroke-linecap="round" />
  </g>
</svg>`;

// ---------------- LUXURY CONCEPT 3: "ROYAL APERTURE & MINIMAL H" (مینیمالیسم اشرافی سوئیسی / لایکا & رولکس) ----------------
// High-precision circular optical crest with chiseled minimalist H and 12-hour precision tick marks.
// Understated luxury, impeccable typography, timeless authority.
const luxury3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="champagne_gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8E7" />
      <stop offset="35%" stop-color="#EED7A1" />
      <stop offset="70%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#8E6A2B" />
    </linearGradient>
    <linearGradient id="rim_gold" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#C5A059" stop-opacity="0.2" />
    </linearGradient>
  </defs>

  <!-- Deep Obsidian Velvet Background -->
  <rect width="512" height="512" fill="#04060A" />

  <g transform="translate(256, 256)">
    <!-- Outer Precision Bezel -->
    <circle cx="0" cy="0" r="216" fill="none" stroke="url(#rim_gold)" stroke-width="3" />
    <circle cx="0" cy="0" r="202" fill="none" stroke="rgba(197, 160, 89, 0.2)" stroke-width="1" />

    <!-- 12 Precision Hour / Shutter Angle Ticks -->
    <line x1="0" y1="-216" x2="0" y2="-198" stroke="url(#champagne_gold)" stroke-width="2" />
    <line x1="0" y1="216" x2="0" y2="198" stroke="url(#champagne_gold)" stroke-width="2" />
    <line x1="-216" y1="0" x2="-198" y2="0" stroke="url(#champagne_gold)" stroke-width="2" />
    <line x1="216" y1="0" x2="198" y2="0" stroke="url(#champagne_gold)" stroke-width="2" />

    <line x1="-152.7" y1="-152.7" x2="-140" y2="-140" stroke="rgba(197, 160, 89, 0.5)" stroke-width="1.5" />
    <line x1="152.7" y1="-152.7" x2="140" y2="-140" stroke="rgba(197, 160, 89, 0.5)" stroke-width="1.5" />
    <line x1="-152.7" y1="152.7" x2="-140" y2="140" stroke="rgba(197, 160, 89, 0.5)" stroke-width="1.5" />
    <line x1="152.7" y1="152.7" x2="140" y2="140" stroke="rgba(197, 160, 89, 0.5)" stroke-width="1.5" />

    <!-- Center Chiseled Monogram H (Pure Swiss Cinema Luxury) -->
    <!-- Left Vertical -->
    <path d="M -90 -124 L -50 -124 L -50 124 L -90 124 Z" fill="url(#champagne_gold)" />
    <!-- Right Vertical -->
    <path d="M 50 -124 L 90 -124 L 90 124 L 50 124 Z" fill="url(#champagne_gold)" />
    <!-- Center Horizontal Bar with Lens Opening -->
    <path d="M -50 -14 L -18 -14 L -18 14 L -50 14 Z" fill="url(#champagne_gold)" />
    <path d="M 18 -14 L 50 -14 L 50 14 L 18 14 Z" fill="url(#champagne_gold)" />

    <!-- Center Floating Precision Aperture Dot -->
    <circle cx="0" cy="0" r="10" fill="none" stroke="url(#champagne_gold)" stroke-width="2.5" />
    <circle cx="0" cy="0" r="4" fill="#FFF8E7" />
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, 'luxury-1-chiseled-h.svg'), luxury1);
fs.writeFileSync(path.join(outDir, 'luxury-2-infinite-hoor.svg'), luxury2);
fs.writeFileSync(path.join(outDir, 'luxury-3-royal-aperture.svg'), luxury3);
console.log('Saved 3 ultra-luxury SVG concepts in public/luxury-concepts/');

// Generate HTML Presentation with Luxury Mockups
const showcaseHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>طراحی فوق‌لوکس نشان استودیو تبلیغاتی هورام</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020305;
      color: #E2E8F0;
      font-family: 'Vazirmatn', sans-serif;
      padding: 50px 30px;
      line-height: 1.6;
    }
    .hero-header {
      text-align: center;
      max-width: 900px;
      margin: 0 auto 60px;
    }
    .luxury-pill {
      display: inline-block;
      padding: 6px 18px;
      border-radius: 9999px;
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.25);
      color: #EED7A1;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 34px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      margin-bottom: 14px;
    }
    p.subtitle {
      color: #94A3B8;
      font-size: 16px;
      font-weight: 300;
      max-width: 700px;
      margin: 0 auto;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      max-width: 1300px;
      margin: 0 auto 60px;
    }
    @media (max-width: 1000px) {
      .grid { grid-template-columns: 1fr; }
    }

    .luxury-card {
      background: radial-gradient(120% 120% at 50% 0%, rgba(20, 26, 40, 0.5) 0%, rgba(5, 7, 12, 0.8) 100%);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 28px;
      padding: 34px 28px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 30px 60px -20px rgba(0,0,0,0.8);
      transition: all 0.3s ease;
    }
    .luxury-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
    }
    .luxury-card.star {
      border-color: rgba(212, 175, 55, 0.3);
      box-shadow: 0 35px 70px -15px rgba(212, 175, 55, 0.12);
    }

    .tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #C5A059;
      text-transform: uppercase;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tag::before {
      content: '';
      width: 6px; height: 6px; border-radius: 50%; background: #D4AF37;
    }

    /* Emblem Showcase Box */
    .emblem-stage {
      width: 190px;
      height: 190px;
      margin: 0 auto 28px;
      background: #020306;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-shadow: inset 0 2px 20px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.6);
    }
    .emblem-stage img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.7));
    }

    .title {
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 8px;
      letter-spacing: -0.3px;
    }
    .en-title {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 2px;
      color: #94A3B8;
      margin-bottom: 14px;
      text-transform: uppercase;
    }
    .desc {
      font-size: 13.5px;
      color: #94A3B8;
      line-height: 1.7;
      margin-bottom: 28px;
      font-weight: 300;
      flex-grow: 1;
    }

    /* Real-World Context Section */
    .section-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* 1. Google Search Simulation (100% Native) */
    .google-box {
      background: #202124;
      border: 1px solid #303134;
      border-radius: 14px;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .google-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
    }
    .google-fav {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .google-fav img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .google-site {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      color: #DADCE0;
      font-weight: 500;
    }
    .google-url {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      color: #9AA0A6;
    }
    .google-headline {
      font-size: 17px;
      font-weight: 600;
      color: #99C3FF;
      line-height: 1.35;
      margin-bottom: 4px;
    }
    .google-text {
      font-size: 11.5px;
      color: #BDC1C6;
      line-height: 1.45;
    }

    /* 2. Luxury Header Navbar Mockup */
    .navbar-box {
      background: rgba(4, 6, 10, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .navbar-logo {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      overflow: hidden;
      background: #000;
      border: 1px solid rgba(212, 175, 55, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }
    .navbar-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .navbar-titles {
      display: flex;
      flex-direction: column;
    }
    .navbar-brand {
      font-size: 13px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.2px;
    }
    .navbar-sub {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 2px;
      color: #C5A059;
    }
  </style>
</head>
<body>
  <div class="hero-header">
    <div class="luxury-pill">Hooram Studio • Haute Couture & Cinema Identity</div>
    <h1>رویکردهای فوق‌لوکس برای هویت بصری هورام</h1>
    <p class="subtitle">حذف کامل المان‌های شبیه اپلیکیشن‌های موبایل؛ تمرکز بر وقار، متالیک اصیل، خطوط برشی تراش‌خورده و ظرافت ماندگار برندهای اشرافی جهان.</p>
  </div>

  <div class="grid">
    <!-- Luxury Concept 1 -->
    <div class="luxury-card star">
      <div class="tag">پیشنهاد ۱ • هاوت کوتور & سینمای های‌فشن</div>
      <div class="emblem-stage">
        <img src="/luxury-concepts/luxury-1-chiseled-h.svg" alt="Luxury Concept 1" />
      </div>
      <h3 class="title">مونوگرام تراش‌خورده H و خطوط سینمایی</h3>
      <div class="en-title">THE CHISELED MONOGRAM</div>
      <p class="desc">
        تلفیق تراش‌های زاویه‌دار شبیه به سنگ‌های قیمتی و ادوات فیلمبرداری هالیوود؛ دو ستون متالیک طلای شامپاینی، فریم کادربندی ۱۶:۹ موشن پیکچرز و نگین منشوری در کانون تقاطع. بسیار جسورانه، متمایز و مقتدر.
      </p>

      <div class="section-label">نمایش در نتایج گوگل سرچ:</div>
      <div class="google-box">
        <div class="google-top">
          <div class="google-fav">
            <img src="/luxury-concepts/luxury-1-chiseled-h.svg" alt="Favicon 1" />
          </div>
          <div>
            <div class="google-site">hooramstudio.ir</div>
            <div class="google-url">https://hooramstudio.ir</div>
          </div>
        </div>
        <div class="google-headline">استودیو تبلیغاتی هورام | تولید فیلم‌های تبلیغاتی هوش مصنوعی ...</div>
        <div class="google-text">استودیو خلاق هورام؛ خلق تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن...</div>
      </div>

      <div class="section-label">نمایش در هدر سایت:</div>
      <div class="navbar-box">
        <div class="navbar-logo">
          <img src="/luxury-concepts/luxury-1-chiseled-h.svg" alt="Navbar 1" />
        </div>
        <div class="navbar-titles">
          <span class="navbar-brand">استودیو تبلیغاتی هورام</span>
          <span class="navbar-sub">HORAM STUDIO • ADVERTISING</span>
        </div>
      </div>
    </div>

    <!-- Luxury Concept 2 -->
    <div class="luxury-card">
      <div class="tag">پیشنهاد ۲ • ریشه‌شناسی هورام & ژئومتری پلاتینیوم</div>
      <div class="emblem-stage">
        <img src="/luxury-concepts/luxury-2-infinite-hoor.svg" alt="Luxury Concept 2" />
      </div>
      <h3 class="title">حلقه جاودان هور، فرم هـ و پرتو آنامورفیک</h3>
      <div class="en-title">THE INFINITE HOOR</div>
      <p class="desc">
        برگرفته از واژه اصیل «هور» (خورشید و نور)؛ هندسه ۸ ضلعی کانونی لنز با حلقه روبان فیلم بی‌پایان که فرم استیلیزه و باشکوه حرف «هـ» فارسی را ترسیم می‌کند. پالِت پلاتینیومی و رگه نور سرد سینمایی.
      </p>

      <div class="section-label">نمایش در نتایج گوگل سرچ:</div>
      <div class="google-box">
        <div class="google-top">
          <div class="google-fav">
            <img src="/luxury-concepts/luxury-2-infinite-hoor.svg" alt="Favicon 2" />
          </div>
          <div>
            <div class="google-site">hooramstudio.ir</div>
            <div class="google-url">https://hooramstudio.ir</div>
          </div>
        </div>
        <div class="google-headline">استودیو تبلیغاتی هورام | تولید فیلم‌های تبلیغاتی هوش مصنوعی ...</div>
        <div class="google-text">استودیو خلاق هورام؛ خلق تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن...</div>
      </div>

      <div class="section-label">نمایش در هدر سایت:</div>
      <div class="navbar-box">
        <div class="navbar-logo">
          <img src="/luxury-concepts/luxury-2-infinite-hoor.svg" alt="Navbar 2" />
        </div>
        <div class="navbar-titles">
          <span class="navbar-brand">استودیو تبلیغاتی هورام</span>
          <span class="navbar-sub">HORAM STUDIO • ADVERTISING</span>
        </div>
      </div>
    </div>

    <!-- Luxury Concept 3 -->
    <div class="luxury-card">
      <div class="tag">پیشنهاد ۳ • ساعت‌سازی سوئیسی & کریست سینمایی</div>
      <div class="emblem-stage">
        <img src="/luxury-concepts/luxury-3-royal-aperture.svg" alt="Luxury Concept 3" />
      </div>
      <h3 class="title">کرست سلطنتی شاتر با نشان H مینیمال</h3>
      <div class="en-title">THE ROYAL APERTURE</div>
      <p class="desc">
        الهام‌گرفته از نشان‌های ابدی ساعت‌های اشرافی سوئیس و حلقه‌های فوکوس لنزهای پرایم لایکا (Leica). رینگ تراش‌خورده با ۱۲ نشانگر زاویه شاتر، در کنار مونوگرام مینیمال H و نقطه فوکوس مرکزی در طلای ملایم شامپاینی.
      </p>

      <div class="section-label">نمایش در نتایج گوگل سرچ:</div>
      <div class="google-box">
        <div class="google-top">
          <div class="google-fav">
            <img src="/luxury-concepts/luxury-3-royal-aperture.svg" alt="Favicon 3" />
          </div>
          <div>
            <div class="google-site">hooramstudio.ir</div>
            <div class="google-url">https://hooramstudio.ir</div>
          </div>
        </div>
        <div class="google-headline">استودیو تبلیغاتی هورام | تولید فیلم‌های تبلیغاتی هوش مصنوعی ...</div>
        <div class="google-text">استودیو خلاق هورام؛ خلق تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن...</div>
      </div>

      <div class="section-label">نمایش در هدر سایت:</div>
      <div class="navbar-box">
        <div class="navbar-logo">
          <img src="/luxury-concepts/luxury-3-royal-aperture.svg" alt="Navbar 3" />
        </div>
        <div class="navbar-titles">
          <span class="navbar-brand">استودیو تبلیغاتی هورام</span>
          <span class="navbar-sub">HORAM STUDIO • ADVERTISING</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.resolve('public', 'luxury-showcase.html'), showcaseHtml);
console.log('Saved luxury-showcase.html in public/');

