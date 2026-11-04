const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bRing = fs.readFileSync(path.join(root, 'public', 'images', 'jewelry', 'diamond_ring.jpg')).toString('base64');
const bNeck = fs.readFileSync(path.join(root, 'public', 'images', 'jewelry', 'gold_necklace.jpg')).toString('base64');

const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<title>Hooram Studio - Luxury Jewelry Web Platform</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  body {
    width: 1920px;
    height: 1080px;
    background: radial-gradient(circle at 45% 40%, #151926 0%, #0c0f18 45%, #05060a 100%);
    overflow: hidden;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1500px;
  }

  /* ---------------- LUXURY STUDIO AMBIENT LIGHTING ---------------- */
  .studio-ambient {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .spot-gold {
    position: absolute;
    width: 1300px;
    height: 1100px;
    background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.35) 0%, rgba(180, 130, 30, 0.12) 40%, transparent 70%);
    top: -180px;
    left: 2%;
    filter: blur(100px);
    animation: driftSpot 4.5s ease-in-out infinite alternate;
  }
  .spot-diamond {
    position: absolute;
    width: 1100px;
    height: 1100px;
    background: radial-gradient(ellipse at center, rgba(56, 189, 248, 0.4) 0%, rgba(99, 102, 241, 0.18) 45%, transparent 75%);
    bottom: -220px;
    right: 2%;
    filter: blur(110px);
    animation: driftSpot 4.5s ease-in-out infinite alternate-reverse;
  }
  .spot-center {
    position: absolute;
    width: 900px;
    height: 550px;
    background: radial-gradient(ellipse at center, rgba(245, 230, 180, 0.25) 0%, transparent 70%);
    top: 22%;
    left: 18%;
    filter: blur(85px);
  }

  @keyframes driftSpot {
    0% { transform: scale(1) translate(0, 0); opacity: 0.9; }
    100% { transform: scale(1.15) translate(30px, -20px); opacity: 1; }
  }

  /* 3D Perspective Studio Floor */
  .grid-floor {
    position: absolute;
    width: 3200px;
    height: 1600px;
    bottom: -600px;
    left: 50%;
    transform: translateX(-50%) rotateX(80deg);
    background-size: 60px 60px;
    background-image: 
      linear-gradient(to right, rgba(212, 175, 55, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(212, 175, 55, 0.08) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, transparent 75%);
    pointer-events: none;
  }

  /* ---------------- MASTER 3D CAMERA RIG ---------------- */
  .camera-rig {
    position: relative;
    width: 1760px;
    height: 960px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    animation: keynoteCamera 4.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes keynoteCamera {
    0% {
      transform: scale(0.96) rotateY(-8deg) rotateX(3deg) translateY(18px);
    }
    100% {
      transform: scale(1.02) rotateY(-2deg) rotateX(1deg) translateY(-8px);
    }
  }

  /* ---------------- 1. MACBOOK PRO 16" 3D MOCKUP ---------------- */
  .macbook-wrapper {
    position: absolute;
    left: 20px;
    top: 50px;
    width: 1180px;
    height: 780px;
    transform-style: preserve-3d;
    animation: macFloat 4s ease-in-out infinite alternate;
  }
  @keyframes macFloat {
    0% { transform: translateY(0px) rotateZ(-0.2deg); }
    100% { transform: translateY(-12px) rotateZ(0.2deg); }
  }

  /* Display Lid */
  .mac-lid {
    width: 1140px;
    height: 720px;
    background: #090c14;
    border-radius: 24px;
    padding: 12px;
    box-shadow: 
      0 40px 100px -10px rgba(0, 0, 0, 0.95),
      0 0 90px rgba(212, 175, 55, 0.35),
      inset 0 0 0 2px #475569,
      inset 0 0 0 4px #1e293b;
    position: relative;
    transform-style: preserve-3d;
  }

  /* Top Notch & Camera */
  .mac-notch {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 22px;
    background: #030712;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-top: none;
  }
  .mac-lens { width: 7px; height: 7px; border-radius: 50%; background: #0b1329; border: 1.5px solid #1e293b; box-shadow: inset 0 0 3px #d4af37; }
  .mac-indicator { width: 3.5px; height: 3.5px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; }

  /* Screen Display */
  .mac-screen {
    width: 100%;
    height: 100%;
    background: #06080e;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  /* Glass Glare Sweep */
  .screen-glare {
    position: absolute;
    inset: -50%;
    background: linear-gradient(
      125deg,
      transparent 38%,
      rgba(255, 255, 255, 0.12) 46%,
      rgba(212, 175, 55, 0.22) 50%,
      transparent 58%
    );
    transform: rotate(-12deg);
    pointer-events: none;
    z-index: 80;
    animation: glareSweep 4.5s ease-in-out forwards;
  }
  @keyframes glareSweep {
    0% { transform: translateY(-40%) translateX(-30%); opacity: 0; }
    25% { opacity: 1; }
    100% { transform: translateY(30%) translateX(25%); opacity: 0.4; }
  }

  /* 3D Folded Keyboard Deck (Space Gray Aluminum) */
  .mac-deck {
    position: absolute;
    width: 1180px;
    height: 130px;
    bottom: -45px;
    left: -20px;
    background: linear-gradient(180deg, #475569 0%, #334155 25%, #1e293b 60%, #0f172a 100%);
    border-radius: 0 0 24px 24px;
    transform: rotateX(74deg);
    transform-origin: top center;
    box-shadow: 
      0 40px 90px rgba(0, 0, 0, 0.95),
      inset 0 1.5px 2px rgba(255, 255, 255, 0.5),
      inset 0 -2px 6px rgba(0, 0, 0, 0.9);
    border: 1px solid #64748b;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mac-deck-indent {
    width: 200px;
    height: 10px;
    background: #020617;
    border-radius: 0 0 8px 8px;
    position: absolute;
    top: 0;
  }
  .mac-trackpad-preview {
    width: 280px;
    height: 85px;
    background: linear-gradient(180deg, #1e293b, #0f172a);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    margin-top: 15px;
  }

  /* ---------------- MACBOOK SCREEN: LUXURY JEWELRY HOMEPAGE ---------------- */
  .browser-bar {
    height: 44px;
    background: rgba(12, 16, 26, 0.98);
    border-bottom: 1px solid rgba(212, 175, 55, 0.15);
    display: flex;
    align-items: center;
    padding: 0 18px;
    gap: 16px;
    z-index: 50;
    position: relative;
  }
  .window-dots { display: flex; gap: 7px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-red { background: #ef4444; }
  .dot-yellow { background: #f59e0b; }
  .dot-green { background: #10b981; }

  .browser-address {
    flex: 1;
    max-width: 480px;
    height: 28px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 11.5px;
    font-family: monospace;
    color: #e5c07b;
    direction: ltr;
    gap: 8px;
  }

  .site-scroll-container {
    height: calc(100% - 44px);
    overflow: hidden;
    position: relative;
    background: #080a10;
  }
  .site-scroll-content {
    animation: scrollSite 4.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes scrollSite {
    0% { transform: translateY(0); }
    100% { transform: translateY(-135px); }
  }

  /* Luxury Boutique Navbar */
  .boutique-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 36px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.15);
    background: rgba(10, 13, 20, 0.9);
    backdrop-filter: blur(12px);
  }
  .boutique-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-crest {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4af37, #fef08a, #aa7c11);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
  }
  .brand-text-fa {
    font-size: 16px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.3px;
  }
  .brand-text-en {
    font-size: 9.5px;
    color: #d4af37;
    letter-spacing: 2px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .boutique-menu {
    display: flex;
    gap: 26px;
    font-size: 12.5px;
    color: #e2e8f0;
    font-weight: 500;
  }
  .boutique-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cart-badge-pill {
    padding: 6px 14px;
    background: rgba(212, 175, 55, 0.15);
    border: 1px solid rgba(212, 175, 55, 0.4);
    border-radius: 20px;
    font-size: 11px;
    color: #fef08a;
    font-weight: 700;
  }
  .vip-btn {
    padding: 7px 18px;
    background: linear-gradient(135deg, #d4af37, #fef08a, #b48518);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 800;
    color: #000;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  }

  /* Luxury Hero Section */
  .boutique-hero {
    padding: 34px 40px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
  }
  .hero-texts {
    flex: 1.1;
    text-align: right;
  }
  .hero-exclusive-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 16px;
    background: rgba(212, 175, 55, 0.12);
    border: 1px solid rgba(212, 175, 55, 0.35);
    border-radius: 30px;
    font-size: 11.5px;
    font-weight: 700;
    color: #fef08a;
    margin-bottom: 14px;
  }
  .hero-main-h1 {
    font-size: 33px;
    font-weight: 900;
    line-height: 1.35;
    background: linear-gradient(135deg, #ffffff 40%, #fef08a 70%, #d4af37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }
  .hero-sub-p {
    font-size: 13.5px;
    color: #cbd5e1;
    line-height: 1.65;
    margin-bottom: 22px;
    max-width: 520px;
  }
  .hero-buttons {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .btn-gold {
    padding: 10px 24px;
    background: linear-gradient(135deg, #d4af37, #fef08a, #b48518);
    border-radius: 10px;
    font-size: 12.5px;
    font-weight: 800;
    color: #0f172a;
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5);
  }
  .btn-glass {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 10px;
    font-size: 12.5px;
    font-weight: 700;
    color: #fef08a;
  }

  /* Hero Featured Jewelry Card */
  .hero-jewel-card {
    flex: 0.9;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: #0a0d16;
    border: 1px solid rgba(212, 175, 55, 0.35);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
  }
  .jewel-img-wrap {
    width: 100%;
    height: 220px;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
  }
  .jewel-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .jewel-floating-tag {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 4px 12px;
    background: rgba(10, 13, 22, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(212, 175, 55, 0.4);
    border-radius: 12px;
    font-size: 11px;
    color: #fef08a;
    font-weight: 700;
  }
  .jewel-info-bar {
    width: 100%;
    padding: 10px 8px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .jewel-title { font-size: 13px; font-weight: 800; color: #fff; }
  .jewel-price { font-size: 14px; font-weight: 900; color: #d4af37; }

  /* Product Showcase Row (below hero) */
  .products-strip {
    padding: 10px 40px 30px;
  }
  .strip-title {
    font-size: 15px;
    font-weight: 800;
    color: #fef08a;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .strip-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .prod-card {
    background: rgba(14, 18, 28, 0.9);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 14px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.5);
  }
  .prod-thumb {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid rgba(212, 175, 55, 0.25);
  }
  .prod-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .prod-meta-title { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .prod-meta-price { font-size: 12.5px; font-weight: 900; color: #d4af37; }

  /* ---------------- 2. 3D IPHONE 16 PRO MOCKUP ---------------- */
  .iphone-wrapper {
    position: absolute;
    right: 25px;
    top: 80px;
    width: 440px;
    height: 840px;
    transform-style: preserve-3d;
    transform: translateZ(110px) rotateY(-8deg) rotateX(2deg);
    animation: iphoneFloat 4.2s ease-in-out infinite alternate;
  }
  @keyframes iphoneFloat {
    0% { transform: translateZ(110px) rotateY(-8deg) rotateX(2deg) translateY(0); }
    100% { transform: translateZ(140px) rotateY(-4deg) rotateX(0deg) translateY(-16px); }
  }

  /* iPhone Titanium Chassis */
  .iphone-chassis {
    width: 100%;
    height: 100%;
    background: #0f172a;
    border-radius: 58px;
    padding: 14px;
    box-shadow: 
      0 40px 90px -10px rgba(0, 0, 0, 0.95),
      0 0 70px rgba(212, 175, 55, 0.45),
      inset 0 0 0 3px #d4af37,
      inset 0 0 0 5px #1e293b;
    position: relative;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
  }

  .iphone-glass {
    width: 100%;
    height: 100%;
    background: #07090e;
    border-radius: 46px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  /* Dynamic Island */
  .dynamic-island {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 32px;
    background: #000;
    border-radius: 20px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.9);
  }
  .di-camera { width: 10px; height: 10px; border-radius: 50%; background: #0b1329; border: 1.5px solid #334155; }
  .di-pulse {
    width: 18px;
    height: 10px;
    background: #d4af37;
    border-radius: 4px;
    box-shadow: 0 0 10px #d4af37;
    animation: diBeat 1s ease-in-out infinite alternate;
  }
  @keyframes diBeat { 0% { opacity: 0.6; transform: scaleY(0.7); } 100% { opacity: 1; transform: scaleY(1.2); } }

  /* iPhone Mobile Jewelry Content */
  .mobile-content {
    padding: 64px 24px 20px;
    animation: scrollMobile 4.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes scrollMobile {
    0% { transform: translateY(0); }
    100% { transform: translateY(-70px); }
  }

  .mob-top-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }
  .mob-brand { font-size: 13px; font-weight: 900; color: #fef08a; letter-spacing: 1px; }
  .mob-tag { font-size: 10.5px; color: #10b981; font-weight: 700; }
  .mob-hero-img {
    width: 100%;
    height: 200px;
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid rgba(212, 175, 55, 0.35);
    box-shadow: 0 10px 25px rgba(0,0,0,0.7);
  }
  .mob-hero-img img { width: 100%; height: 100%; object-fit: cover; }
  .mob-title {
    font-size: 18px;
    font-weight: 900;
    color: #fff;
    margin-bottom: 6px;
  }
  .mob-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .mob-price {
    font-size: 16px;
    font-weight: 900;
    color: #d4af37;
  }
  .mob-action-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #d4af37, #fef08a, #b48518);
    border-radius: 14px;
    font-size: 13.5px;
    font-weight: 900;
    text-align: center;
    color: #0f172a;
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.7);
  }

  /* ---------------- 3. FLOATING 3D GLASS BADGES ---------------- */
  .floating-badge {
    position: absolute;
    background: rgba(14, 18, 28, 0.88);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(212, 175, 55, 0.4);
    border-radius: 16px;
    padding: 14px 22px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.85);
    z-index: 120;
    transform-style: preserve-3d;
  }

  .badge-pos-1 {
    top: 30px;
    left: 40px;
    transform: translateZ(90px);
    border-color: rgba(212, 175, 55, 0.6);
    box-shadow: 0 0 35px rgba(212, 175, 55, 0.3);
  }
  .badge-pos-2 {
    top: 45px;
    right: 440px;
    transform: translateZ(110px);
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 35px rgba(16, 185, 129, 0.3);
  }
  .badge-pos-3 {
    bottom: 30px;
    left: 80px;
    transform: translateZ(100px);
    border-color: rgba(56, 189, 248, 0.5);
    box-shadow: 0 0 35px rgba(56, 189, 248, 0.35);
  }

  .badge-indicator { width: 11px; height: 11px; border-radius: 50%; }
  .bi-gold { background: #d4af37; box-shadow: 0 0 12px #d4af37; }
  .bi-green { background: #10b981; box-shadow: 0 0 12px #10b981; }
  .bi-cyan { background: #38bdf8; box-shadow: 0 0 12px #38bdf8; }

  .badge-heading { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .badge-caption { font-size: 11.5px; color: #cbd5e1; font-weight: 500; }
</style>
</head>
<body>

  <!-- Ambient Luxury Studio Lighting -->
  <div class="studio-ambient">
    <div class="spot-gold"></div>
    <div class="spot-diamond"></div>
    <div class="spot-center"></div>
    <div class="grid-floor"></div>
  </div>

  <!-- Master 3D Stage -->
  <div class="camera-rig">

    <!-- FLOATING BADGE 1: Boutique Type -->
    <div class="floating-badge badge-pos-1">
      <div class="badge-indicator bi-gold"></div>
      <div>
        <div class="badge-heading">Luxury Jewelry Boutique</div>
        <div class="badge-caption">طراحی و توسعه پلتفرم فروشگاهی لوکس</div>
      </div>
    </div>

    <!-- FLOATING BADGE 2: Speed & Conversion -->
    <div class="floating-badge badge-pos-2">
      <div class="badge-indicator bi-green"></div>
      <div>
        <div class="badge-heading">سرعت لود ۰.۳ ثانیه • VIP</div>
        <div class="badge-caption">درگاه پرداخت امن و تسویه اختصاصی</div>
      </div>
    </div>

    <!-- FLOATING BADGE 3: Custom Architecture -->
    <div class="floating-badge badge-pos-3">
      <div class="badge-indicator bi-cyan"></div>
      <div>
        <div class="badge-heading">طراحی ۱۰۰٪ اختصاصی و سفارشی</div>
        <div class="badge-caption">واکنش‌گرایی کامل موبایل و دسکتاپ (RTL)</div>
      </div>
    </div>

    <!-- 1. 3D MACBOOK PRO 16" -->
    <div class="macbook-wrapper">
      
      <!-- Folded Aluminum Keyboard Deck -->
      <div class="mac-deck">
        <div class="mac-deck-indent"></div>
        <div class="mac-trackpad-preview"></div>
      </div>

      <!-- Upright Display Lid -->
      <div class="mac-lid">
        <div class="mac-notch">
          <div class="mac-lens"></div>
          <div class="mac-indicator"></div>
        </div>

        <div class="mac-screen">
          <div class="screen-glare"></div>

          <!-- Browser Header -->
          <div class="browser-bar">
            <div class="window-dots">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
            </div>
            <div class="browser-address">
              <span>🔒</span>
              <span>https://rozhan-jewelry.com/exclusive-collection</span>
            </div>
          </div>

          <!-- Live Scrolling Website Content -->
          <div class="site-scroll-container">
            <div class="site-scroll-content">

              <!-- Boutique Navbar -->
              <div class="boutique-nav">
                <div class="boutique-brand">
                  <div class="brand-crest">💎</div>
                  <div>
                    <div class="brand-text-fa">گالری جواهرات سلطنتی روژان</div>
                    <div class="brand-text-en">ROZHAN HAUTE JOAILLERIE</div>
                  </div>
                </div>
                <div class="boutique-menu">
                  <span>کالکشن سلطنتی</span>
                  <span>الماس و برلیان</span>
                  <span>گردنبند و زمرد</span>
                  <span>حلقه‌های ازدواج</span>
                  <span>سفارش اختصاصی</span>
                </div>
                <div class="boutique-actions">
                  <div class="cart-badge-pill">سبد خرید (۲)</div>
                  <div class="vip-btn">رزرو وقت VIP</div>
                </div>
              </div>

              <!-- Hero Section -->
              <div class="boutique-hero">
                <div class="hero-texts">
                  <div class="hero-exclusive-tag">✨ کالکشن اختصاصی ۱۴۰۳ — طلای ۱۸ عیار و زمرد</div>
                  <h1 class="hero-main-h1">شکوه جاودان؛ شاهکارهای دست‌ساز طلا و الماس</h1>
                  <p class="hero-sub-p">مجموعه‌ای فاخر از نایاب‌ترین الماس‌های تراش‌خورده و زمرد اصیل، طراحی و ساخته‌شده برای اصیل‌ترین سلیقه‌های ایرانی و بین‌المللی.</p>
                  
                  <div class="hero-buttons">
                    <div class="btn-gold">کشف کالکشن سلطنتی</div>
                    <div class="btn-glass">مشاهده کاتالوگ قیمت</div>
                  </div>
                </div>

                <!-- Featured Diamond Ring Card -->
                <div class="hero-jewel-card">
                  <div class="jewel-img-wrap">
                    <img src="data:image/jpeg;base64,${bRing}" alt="انگشتر الماس سولیتر" />
                    <div class="jewel-floating-tag">تک‌نسخه دست‌ساز • GIA</div>
                  </div>
                  <div class="jewel-info-bar">
                    <div class="jewel-title">انگشتر سولیتر الماس فلورانس</div>
                    <div class="jewel-price">۲۸۵,۰۰۰,۰۰۰ تومان</div>
                  </div>
                </div>
              </div>

              <!-- Products Strip -->
              <div class="products-strip">
                <div class="strip-title">
                  <span>✦ منتخب شاهکارهای گالری روژان</span>
                </div>
                <div class="strip-grid">
                  
                  <div class="prod-card">
                    <div class="prod-thumb">
                      <img src="data:image/jpeg;base64,${bNeck}" alt="گردنبند زمرد" />
                    </div>
                    <div>
                      <div class="prod-meta-title">آویز زمرد سلطنتی و طلای ۱۸ عیار</div>
                      <div class="prod-meta-price">۴۲۰,۰۰۰,۰۰۰ تومان</div>
                    </div>
                  </div>

                  <div class="prod-card">
                    <div class="prod-thumb">
                      <img src="data:image/jpeg;base64,${bRing}" alt="حلقه الماس" />
                    </div>
                    <div>
                      <div class="prod-meta-title">حلقه نامزدی برلیان باگت</div>
                      <div class="prod-meta-price">۱۹۵,۰۰۰,۰۰۰ تومان</div>
                    </div>
                  </div>

                  <div class="prod-card">
                    <div class="prod-thumb">
                      <img src="data:image/jpeg;base64,${bNeck}" alt="دستبند طلا" />
                    </div>
                    <div>
                      <div class="prod-meta-title">دستبند زنجیری طلای رزگلد</div>
                      <div class="prod-meta-price">۱۴۵,۰۰۰,۰۰۰ تومان</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 2. 3D IPHONE 16 PRO -->
    <div class="iphone-wrapper">
      <div class="iphone-chassis">
        <div class="dynamic-island">
          <div class="di-camera"></div>
          <div class="di-pulse"></div>
        </div>

        <div class="iphone-glass">
          <div class="mobile-content">
            <div class="mob-top-info">
              <div class="mob-brand">💎 ROZHAN BOUTIQUE</div>
              <div class="mob-tag">VIP EXCLUSIVE</div>
            </div>

            <div class="mob-hero-img">
              <img src="data:image/jpeg;base64,${bRing}" alt="انگشتر الماس" />
            </div>

            <div class="mob-title">انگشتر سولیتر برلیان</div>
            <div class="mob-price-row">
              <span style="font-size: 11px; color: #94a3b8;">تحویل با شناسنامه GIA</span>
              <span class="mob-price">۲۸۵,۰۰۰,۰۰۰ تومان</span>
            </div>

            <div class="mob-action-btn">ثبت سفارش اختصاصی VIP</div>
          </div>
        </div>
      </div>
    </div>

  </div>

</body>
</html>`;

fs.writeFileSync(path.join(root, 'scripts', 'web_showcase.html'), html, 'utf8');
console.log('Successfully generated luxury jewelry showcase HTML, length:', html.length);

