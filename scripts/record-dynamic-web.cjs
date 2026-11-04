const playwright = require('C:/Users/Saraye Tel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'temp_frames', 'rec_web');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Clean old recordings
fs.readdirSync(outDir).forEach(f => {
  try { fs.unlinkSync(path.join(outDir, f)); } catch(e) {}
});

async function run() {
  console.log('Launching Chrome to record dynamic 3D Web Showcase...');
  const browser = await playwright.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  const fileUrl = 'file:///' + path.join(root, 'scripts', 'web_showcase.html').replace(/\\/g, '/');
  
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });

  // Wait for Google font to render cleanly
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
  });

  // Record 5.2 seconds of animation
  console.log('Recording 5.2s of fluid motion...');
  await page.waitForTimeout(5200);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) throw new Error('No webm video recorded!');
  files.sort((a,b) => fs.statSync(path.join(outDir, b)).mtimeMs - fs.statSync(path.join(outDir, a)).mtimeMs);
  const rawWebm = path.join(outDir, files[0]);
  console.log('Raw recording created:', rawWebm);

  const seg4Out = path.join(root, 'temp_frames', 'segments', 'seg4.mp4');
  console.log('Encoding seg4.mp4 (exact 4.0s, high-fidelity colors, no clipping)...');
  execSync(`ffmpeg -y -ss 00:00:00.3 -i "${rawWebm}" -t 4.0 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -an "${seg4Out}"`, { stdio: 'inherit' });

  console.log('Extracting sample frame for verification...');
  const verifyJpg = path.join(root, 'temp_frames', 'seg4_preview.jpg');
  execSync(`ffmpeg -y -ss 00:00:02.0 -i "${seg4Out}" -vframes 1 "${verifyJpg}"`);

  console.log('Done! seg4 size:', fs.statSync(seg4Out).size);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
