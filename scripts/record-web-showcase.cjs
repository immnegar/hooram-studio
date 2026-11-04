const playwright = require('C:/Users/Saraye Tel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.resolve(__dirname, '..', 'temp_frames', 'rec');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Clean old recordings
fs.readdirSync(outDir).forEach(f => {
  try { fs.unlinkSync(path.join(outDir, f)); } catch(e) {}
});

async function run() {
  console.log('Launching installed Chrome to record Scene 4 Web Showcase...');
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
  
  // Go to portfolio
  console.log('Navigating to http://localhost:5000/portfolio ...');
  await page.goto('http://localhost:5000/portfolio', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Smooth scroll through modern projects
  console.log('Smooth scrolling down...');
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy({ top: 22, behavior: 'auto' }));
    await page.waitForTimeout(40);
  }

  // Hover over project cards
  const cards = await page.$$('a.glass-card');
  if (cards.length > 0) {
    console.log('Hovering card...');
    await cards[0].hover();
    await page.waitForTimeout(600);
  }

  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => window.scrollBy({ top: 25, behavior: 'auto' }));
    await page.waitForTimeout(40);
  }

  await page.waitForTimeout(400);

  // Go to services web division
  console.log('Navigating to http://localhost:5000/services ...');
  await page.goto('http://localhost:5000/services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  for (let i = 0; i < 35; i++) {
    await page.evaluate(() => window.scrollBy({ top: 28, behavior: 'auto' }));
    await page.waitForTimeout(40);
  }

  await page.waitForTimeout(400);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const recPath = path.join(outDir, files[0]);
    console.log('SUCCESS! Video recorded at:', recPath);
    const stat = fs.statSync(recPath);
    console.log('File size:', stat.size, 'bytes');
    return recPath;
  } else {
    throw new Error('No webm video found in output');
  }
}

run().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
