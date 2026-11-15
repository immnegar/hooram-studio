import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Concept 1 Master SVG
const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
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
      <stop offset="0%" stop-color="rgba(245,158,11,0.6)" />
      <stop offset="40%" stop-color="rgba(99,102,241,0.5)" />
      <stop offset="100%" stop-color="rgba(6,182,212,0.6)" />
    </linearGradient>
    <filter id="c1_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#6366F1" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="124" fill="url(#c1_bg)" />
  <rect x="14" y="14" width="484" height="484" rx="112" fill="none" stroke="url(#c1_border)" stroke-width="6" />

  <!-- Monogram Mark H + Shutter Aperture -->
  <g filter="url(#c1_glow)">
    <!-- Left Vertical Pillar (Film Division) -->
    <path d="M 134 116 C 134 104, 144 94, 156 94 L 188 94 C 200 94, 210 104, 210 116 L 210 396 C 210 408, 200 418, 188 418 L 156 418 C 144 418, 134 408, 134 396 Z" fill="url(#c1_grad1)" />

    <!-- Right Vertical Pillar (Web Division) -->
    <path d="M 302 116 C 302 104, 312 94, 324 94 L 356 94 C 368 94, 378 104, 378 116 L 378 396 C 378 408, 368 418, 356 418 L 324 418 C 312 418, 302 408, 302 396 Z" fill="url(#c1_grad2)" />

    <!-- Dynamic Cinema Aperture Crossbeam -->
    <path d="M 194 224 L 318 200 C 326 198, 334 204, 334 212 L 334 268 C 334 278, 326 286, 316 288 L 194 312 C 184 314, 176 306, 176 296 L 176 240 C 176 230, 184 222, 194 224 Z" fill="url(#c1_gold)" />

    <!-- Center Optical Lens Core (Precision Focus Dot) -->
    <circle cx="256" cy="256" r="22" fill="#FFFFFF" opacity="0.95" />
    <circle cx="256" cy="256" r="34" fill="none" stroke="#FBBF24" stroke-width="4" opacity="0.8" />
  </g>
</svg>`;

// Save master SVG to public/favicon.svg and public/images/
fs.writeFileSync(path.resolve('public', 'favicon.svg'), masterSvg);

const imagesDir = path.resolve('public', 'images');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
fs.writeFileSync(path.resolve(imagesDir, 'logo.svg'), masterSvg);
fs.writeFileSync(path.resolve(imagesDir, 'logo-symbol.svg'), masterSvg);

console.log('Saved SVG files: favicon.svg, images/logo.svg, images/logo-symbol.svg');

// Render sizes via headless Chrome
const sizes = [
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-144x144.png', size: 144 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: path.join('images', 'logo-512.png'), size: 512 }
];

async function renderPng(targetRelPath, dimension) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: ${dimension}px; height: ${dimension}px; overflow: hidden; background: transparent; }
    svg { width: ${dimension}px; height: ${dimension}px; display: block; }
  </style>
</head>
<body>
  ${masterSvg}
</body>
</html>`;

  const tempHtmlPath = path.resolve('public', `temp-render-${dimension}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent);

  const outPngPath = path.resolve('public', targetRelPath);

  await new Promise((resolve, reject) => {
    const proc = spawn(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--window-size=${dimension},${dimension}`,
      '--hide-scrollbars',
      `--screenshot=${outPngPath}`,
      'file:///' + tempHtmlPath.replace(/\\/g, '/')
    ]);

    proc.on('close', (code) => {
      try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
      if (code === 0 && fs.existsSync(outPngPath)) {
        console.log(`Generated: ${targetRelPath} (${dimension}x${dimension})`);
        resolve();
      } else {
        reject(new Error(`Failed to render ${targetRelPath}, exit code ${code}`));
      }
    });
  });
}

// Generate ICO from 48x48 PNG
function generateIco() {
  const png48 = fs.readFileSync(path.resolve('public', 'favicon-48x48.png'));
  
  // Minimal valid ICO wrapper for 48x48 PNG
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 Image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(48, 0); // Width 48
  icoEntry.writeUInt8(48, 1); // Height 48
  icoEntry.writeUInt8(0, 2);  // Colors
  icoEntry.writeUInt8(0, 3);  // Reserved
  icoEntry.writeUInt16LE(1, 4); // Color planes
  icoEntry.writeUInt16LE(32, 6); // Bits per pixel
  icoEntry.writeUInt32LE(png48.length, 8); // PNG size
  icoEntry.writeUInt32LE(22, 12); // Offset (6 + 16 = 22)

  const icoBuffer = Buffer.concat([icoHeader, icoEntry, png48]);
  fs.writeFileSync(path.resolve('public', 'favicon.ico'), icoBuffer);
  console.log(`Generated valid ICO: public/favicon.ico (${icoBuffer.length} bytes)`);
}

async function run() {
  for (const item of sizes) {
    await renderPng(item.name, item.size);
  }
  generateIco();
  console.log('All brand and favicon assets created successfully!');
}

run().catch(console.error);
