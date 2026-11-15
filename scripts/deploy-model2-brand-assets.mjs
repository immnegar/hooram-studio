import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const publicDir = path.resolve('public');
const imagesDir = path.join(publicDir, 'images');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// 1. Model 2 Standalone Symbol SVG
const model2SymbolSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="m2LeftGrad" x1="15" y1="25" x2="60" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="m2RightGrad" x1="40" y1="25" x2="85" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <linearGradient id="m2LensGrad" x1="50" y1="35" x2="50" y2="65" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <filter id="m2CoreGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Left Ring: First 'O' of HOORAM / Sun Origin -->
  <circle cx="38" cy="50" r="24" stroke="url(#m2LeftGrad)" stroke-width="5" stroke-linecap="round" />
  <!-- Right Ring: Second 'O' of HOORAM / Cinema Lens & Infinity -->
  <circle cx="62" cy="50" r="24" stroke="url(#m2RightGrad)" stroke-width="5" stroke-linecap="round" />
  <!-- Overlapping Radiant Lens (Vesica Piscis) -->
  <path d="M 50 35.5 C 56.5 42.5, 56.5 57.5, 50 64.5 C 43.5 57.5, 43.5 42.5, 50 35.5 Z" 
        fill="url(#m2LensGrad)" filter="url(#m2CoreGlow)" />
  <!-- Pure Brilliant Sparkle Core -->
  <circle cx="50" cy="50" r="3.2" fill="#FFFFFF" />
</svg>`;

// Write master SVGs
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), model2SymbolSvg);
fs.writeFileSync(path.join(imagesDir, 'logo-symbol.svg'), model2SymbolSvg);

// Write horizontal logo SVG
const model2HorizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 140" fill="none">
  <defs>
    <linearGradient id="m2-h-left" x1="15" y1="25" x2="60" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <linearGradient id="m2-h-right" x1="40" y1="25" x2="85" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <linearGradient id="m2-h-lens" x1="50" y1="35" x2="50" y2="65" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <filter id="m2-h-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <g transform="translate(25, 20)">
    <circle cx="38" cy="50" r="24" stroke="url(#m2-h-left)" stroke-width="5" stroke-linecap="round" />
    <circle cx="62" cy="50" r="24" stroke="url(#m2-h-right)" stroke-width="5" stroke-linecap="round" />
    <path d="M 50 35.5 C 56.5 42.5, 56.5 57.5, 50 64.5 C 43.5 57.5, 43.5 42.5, 50 35.5 Z" 
          fill="url(#m2-h-lens)" filter="url(#m2-h-glow)" />
    <circle cx="50" cy="50" r="3.2" fill="#FFFFFF" />
  </g>

  <line x1="140" y1="35" x2="140" y2="105" stroke="#1E293B" stroke-width="1.5" />

  <g direction="ltr" style="direction: ltr; text-anchor: start;">
    <text x="165" y="70" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="34" font-weight="800" letter-spacing="4" fill="#FFFFFF">HOORAM</text>
    <text x="167" y="98" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="3" fill="#94A3B8">CINEMATIC ADVERTISING &amp; DIGITAL</text>
  </g>

  <g direction="rtl" style="direction: rtl; text-anchor: start;">
    <text x="615" y="70" font-family="'Vazirmatn', system-ui, sans-serif" font-size="28" font-weight="800" fill="#F8FAFC">استودیو هورام</text>
    <text x="615" y="96" font-family="'Vazirmatn', system-ui, sans-serif" font-size="11.5" font-weight="500" fill="#64748B">تولید فیلم و تجربه دیجیتال</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(imagesDir, 'logo.svg'), model2HorizontalSvg);

// Helper to render high-res PNG from HTML with dark obsidian background
function renderHtmlToPng(htmlContent, outPath, width, height) {
  return new Promise((resolve, reject) => {
    const tempHtmlFile = path.resolve('temp_render.html');
    fs.writeFileSync(tempHtmlFile, htmlContent);
    const fileUrl = 'file:///' + tempHtmlFile.replace(/\\/g, '/');

    const proc = spawn(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      `--screenshot=${outPath}`,
      fileUrl
    ]);

    proc.on('close', (code) => {
      if (fs.existsSync(tempHtmlFile)) fs.unlinkSync(tempHtmlFile);
      if (code === 0 && fs.existsSync(outPath)) {
        console.log(`Rendered: ${outPath} (${width}x${height})`);
        resolve();
      } else {
        reject(new Error(`Failed to render ${outPath}, code ${code}`));
      }
    });
  });
}

function getIconHtml(size) {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${size}px;
      height: ${size}px;
      background: #07090E;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    svg {
      width: ${Math.round(size * 0.88)}px;
      height: ${Math.round(size * 0.88)}px;
    }
  </style>
</head>
<body>
  ${model2SymbolSvg}
</body>
</html>`;
}

function getFullLogoHtml(width, height) {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&family=Plus+Jakarta+Sans:wght@800&family=Vazirmatn:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${width}px;
      height: ${height}px;
      background: #07090E;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    svg {
      width: ${Math.round(width * 0.9)}px;
      height: auto;
    }
  </style>
</head>
<body>
  ${model2HorizontalSvg}
</body>
</html>`;
}

async function run() {
  console.log('Generating all brand PNG assets with Model 2...');

  // 1. Google Favicon multiple of 48px
  await renderHtmlToPng(getIconHtml(48), path.join(publicDir, 'favicon-48x48.png'), 48, 48);
  await renderHtmlToPng(getIconHtml(96), path.join(publicDir, 'favicon-96x96.png'), 96, 96);
  await renderHtmlToPng(getIconHtml(144), path.join(publicDir, 'favicon-144x144.png'), 144, 144);
  await renderHtmlToPng(getIconHtml(192), path.join(publicDir, 'favicon-192x192.png'), 192, 192);
  await renderHtmlToPng(getIconHtml(512), path.join(publicDir, 'favicon-512x512.png'), 512, 512);

  // 2. Apple Touch Icon (180x180)
  await renderHtmlToPng(getIconHtml(180), path.join(publicDir, 'apple-touch-icon.png'), 180, 180);

  // 3. Social / OpenGraph / Schema.org logo 512x512
  await renderHtmlToPng(getIconHtml(512), path.join(imagesDir, 'logo-512.png'), 512, 512);

  // 4. Horizontal full logo
  await renderHtmlToPng(getFullLogoHtml(640, 160), path.join(imagesDir, 'logo.png'), 640, 160);
  fs.copyFileSync(path.join(imagesDir, 'logo.png'), path.join(publicDir, 'logo.png'));

  // 5. Generate binary favicon.ico from 48x48 PNG
  // An ICO header wrapping 48x48 PNG
  const png48Buf = fs.readFileSync(path.join(publicDir, 'favicon-48x48.png'));
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(48, 0);  // width 48
  icoEntry.writeUInt8(48, 1);  // height 48
  icoEntry.writeUInt8(0, 2);   // color palette
  icoEntry.writeUInt8(0, 3);   // reserved
  icoEntry.writeUInt16LE(1, 4); // color planes
  icoEntry.writeUInt16LE(32, 6); // bits per pixel
  icoEntry.writeUInt32LE(png48Buf.length, 8); // image size
  icoEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  const icoBuf = Buffer.concat([icoHeader, icoEntry, png48Buf]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log(`Generated binary favicon.ico (${icoBuf.length} bytes)`);

  console.log('ALL BRAND ASSETS SUCCESSFULLY GENERATED WITH MODEL 2!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

