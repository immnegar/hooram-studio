import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Approved Radiant Nexus Master SVG in exact website colors (#07090E background, #6366F1 indigo, #38BDF8 cyan)
const masterLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="nexusGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
  </defs>
  <!-- Background circle/square for standalone favicon app icon -->
  <rect width="512" height="512" rx="124" fill="#07090E" />
  <rect x="14" y="14" width="484" height="484" rx="112" fill="none" stroke="rgba(99, 102, 241, 0.3)" stroke-width="4" />
  <!-- Radiant Nexus Two Interlocking Arcs -->
  <path
    d="M 256 50 C 369.8 50, 462 142.2, 462 256 C 462 308.8 442.2 357.1 409.6 394 L 340 324.5 C 354.1 304.7 362.5 281.3 362.5 256 C 362.5 197.3 314.7 149.5 256 149.5 C 230.7 149.5 207.3 157.9 187.5 172 L 118 102.4 C 154.9 69.8 203.2 50 256 50 Z"
    fill="url(#nexusGrad)"
  />
  <path
    d="M 256 462 C 142.2 462, 50 369.8, 50 256 C 50 203.2 69.8 154.9 102.4 118 L 172 187.5 C 157.9 207.3 149.5 230.7 149.5 256 C 149.5 314.7 197.3 362.5 256 362.5 C 281.3 362.5 304.7 354.1 324.5 340 L 394 409.6 C 357.1 442.2 308.8 462 256 462 Z"
    fill="url(#nexusGrad)"
  />
  <!-- Central optical light core -->
  <circle cx="256" cy="256" r="28" fill="#38BDF8" />
</svg>`;

// Write master SVG files
fs.writeFileSync(path.resolve('public', 'favicon.svg'), masterLogoSvg);
fs.writeFileSync(path.resolve('public', 'images', 'logo.svg'), masterLogoSvg);
fs.writeFileSync(path.resolve('public', 'images', 'logo-symbol.svg'), masterLogoSvg);
console.log('Saved master SVG files in public/ and public/images/');

// Render sizes
const sizes = [
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-144x144.png', size: 144 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'logo.png', size: 512 },
  { name: path.join('images', 'logo.png'), size: 512 },
  { name: path.join('images', 'logo-512.png'), size: 512 },
];

async function renderPng(relPath, dimension) {
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
  ${masterLogoSvg}
</body>
</html>`;

  const tempHtmlPath = path.resolve('public', `temp-render-${dimension}-${Date.now()}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent);

  const outPngPath = path.resolve('public', relPath);

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
        console.log(`Rendered: ${relPath} (${dimension}x${dimension})`);
        resolve();
      } else {
        reject(new Error(`Failed to render ${relPath}, code: ${code}`));
      }
    });
  });
}

function generateIco() {
  const png48 = fs.readFileSync(path.resolve('public', 'favicon-48x48.png'));
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(1, 4);

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(48, 0);
  icoEntry.writeUInt8(48, 1);
  icoEntry.writeUInt8(0, 2);
  icoEntry.writeUInt8(0, 3);
  icoEntry.writeUInt16LE(1, 4);
  icoEntry.writeUInt16LE(32, 6);
  icoEntry.writeUInt32LE(png48.length, 8);
  icoEntry.writeUInt32LE(22, 12);

  const icoBuffer = Buffer.concat([icoHeader, icoEntry, png48]);
  fs.writeFileSync(path.resolve('public', 'favicon.ico'), icoBuffer);
  console.log(`Generated official favicon.ico (${icoBuffer.length} bytes)`);
}

async function run() {
  for (const item of sizes) {
    await renderPng(item.name, item.size);
  }
  generateIco();
  console.log('All official HOORAM brand assets deployed into public/ successfully!');
}

run().catch(console.error);
