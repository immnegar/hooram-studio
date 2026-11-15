import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseDir = path.resolve('public', 'brand-identity');
const svgDir = path.join(baseDir, 'svg');
const pngDir = path.join(baseDir, 'png');

const artifactDir = path.resolve('C:', 'Users', 'Saraye Tel', '.gemini', 'antigravity', 'brain', 'e465f73f-35f9-4930-8ded-063d6f457b9f');
const presentationScreenshotPath = path.join(artifactDir, 'hooram-brand-identity-system.png');

// Render HTML presentation sheet to high-res PNG
async function capturePresentation() {
  const htmlFile = path.resolve(baseDir, 'hooram-presentation.html');
  const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');

  return new Promise((resolve) => {
    const proc = spawn(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--window-size=1400,1650',
      '--hide-scrollbars',
      `--screenshot=${presentationScreenshotPath}`,
      fileUrl
    ]);

    proc.on('close', (code) => {
      console.log(`Presentation screenshot captured (exit code ${code})`);
      if (fs.existsSync(presentationScreenshotPath)) {
        console.log(`Saved screenshot: ${presentationScreenshotPath} (${fs.statSync(presentationScreenshotPath).size} bytes)`);
      }
      resolve();
    });
  });
}

// Convert an SVG file to a transparent PNG using Chrome
async function convertSvgToPng(svgName, pngName, width, height) {
  const svgPath = path.join(svgDir, svgName);
  if (!fs.existsSync(svgPath)) return;
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  const tempHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; background: transparent; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

  const tempPath = path.join(baseDir, `temp-${pngName}.html`);
  fs.writeFileSync(tempPath, tempHtml);
  const outPng = path.join(pngDir, pngName);

  await new Promise((resolve) => {
    const proc = spawn(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      `--screenshot=${outPng}`,
      'file:///' + tempPath.replace(/\\/g, '/')
    ]);

    proc.on('close', () => {
      try { fs.unlinkSync(tempPath); } catch (e) {}
      console.log(`Rendered PNG: ${pngName} (${width}x${height})`);
      resolve();
    });
  });
}

async function run() {
  await capturePresentation();

  // Render required key PNG deliverables
  await convertSvgToPng('1-hooram-primary-dark.svg', '1-hooram-primary-dark.png', 1020, 220);
  await convertSvgToPng('2-hooram-persian-dark.svg', '2-hooram-persian-dark.png', 960, 220);
  await convertSvgToPng('3-hooram-symbol-brand.svg', '3-hooram-symbol-brand.png', 512, 512);
  await convertSvgToPng('6-hooram-monochrome-black.svg', '6-hooram-monochrome-black.png', 1020, 220);
  await convertSvgToPng('7-hooram-monochrome-white.svg', '7-hooram-monochrome-white.png', 1020, 220);
  await convertSvgToPng('11-hooram-favicon.svg', '11-hooram-favicon-48.png', 48, 48);
  await convertSvgToPng('12-hooram-social-avatar.svg', '12-hooram-social-avatar.png', 512, 512);

  console.log('All PNG deliverables rendered successfully!');
}

run().catch(console.error);

