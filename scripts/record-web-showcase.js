import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..', 'temp_frames', 'rec');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Launching browser to record web showcase...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  
  // Navigate to portfolio or services showcase
  console.log('Navigating to http://localhost:5000/services ...');
  await page.goto('http://localhost:5000/services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Smooth scroll down
  console.log('Performing smooth scroll...');
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy({ top: 40, behavior: 'smooth' }));
    await page.waitForTimeout(60);
  }

  // Navigate to portfolio
  console.log('Navigating to http://localhost:5000/portfolio ...');
  await page.goto('http://localhost:5000/portfolio', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Hover on first card
  const cards = await page.$$('.glass-card');
  if (cards.length > 0) {
    await cards[0].hover();
    await page.waitForTimeout(800);
  }

  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => window.scrollBy({ top: 50, behavior: 'smooth' }));
    await page.waitForTimeout(60);
  }

  await page.waitForTimeout(500);
  await context.close();
  await browser.close();

  // Find recorded video
  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const recPath = path.join(outDir, files[0]);
    console.log('Recorded video at:', recPath);
  } else {
    console.log('No video file found.');
  }
}

run().catch(console.error);

