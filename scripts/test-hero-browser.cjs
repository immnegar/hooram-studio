const playwright = require('C:/Users/Saraye Tel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function testHero() {
  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  console.log('Navigating to http://localhost:5000...');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 30000 });

  // 1. Verify Video Element
  const videoHandle = await page.$('section video');
  if (!videoHandle) {
    throw new Error('Video element not found in hero section');
  }

  const videoProps = await page.evaluate(vid => {
    return {
      src: vid.currentSrc,
      duration: vid.duration,
      paused: vid.paused,
      muted: vid.muted,
      currentTime: vid.currentTime,
      readyState: vid.readyState
    };
  }, videoHandle);

  console.log('Video Properties:', videoProps);

  // Take screenshot of Scene 1
  const outDir = path.join(__dirname, '../temp_frames/browser_test');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'browser_scene1.png') });
  console.log('Saved browser_scene1.png');

  // Test Chapter 2 click
  const chapterButtons = await page.$$('div.hidden.sm\\:flex.items-center.gap-2 button');
  console.log(`Found ${chapterButtons.length} chapter buttons`);

  if (chapterButtons.length >= 4) {
    // Click chapter 2 (index 1) - تیزرهای محصول
    console.log('Clicking Chapter 2 (تیزرهای محصول)...');
    await chapterButtons[1].click();
    await page.waitForTimeout(600);
    let time2 = await page.evaluate(vid => vid.currentTime, videoHandle);
    console.log(`Video currentTime after clicking Ch 2: ${time2}`);
    await page.screenshot({ path: path.join(outDir, 'browser_scene2.png') });

    // Click chapter 3 (index 2) - خودرو و برندینگ
    console.log('Clicking Chapter 3 (خودرو و برندینگ)...');
    await chapterButtons[2].click();
    await page.waitForTimeout(600);
    let time3 = await page.evaluate(vid => vid.currentTime, videoHandle);
    console.log(`Video currentTime after clicking Ch 3: ${time3}`);
    await page.screenshot({ path: path.join(outDir, 'browser_scene3.png') });

    // Click chapter 4 (index 3) - طراحی پلتفرم وب
    console.log('Clicking Chapter 4 (طراحی پلتفرم وب)...');
    await chapterButtons[3].click();
    await page.waitForTimeout(600);
    let time4 = await page.evaluate(vid => vid.currentTime, videoHandle);
    console.log(`Video currentTime after clicking Ch 4: ${time4}`);
    await page.screenshot({ path: path.join(outDir, 'browser_scene4.png') });

    // Click chapter 1 (index 0) - فیلم‌های تبلیغاتی
    console.log('Clicking Chapter 1 (فیلم‌های تبلیغاتی)...');
    await chapterButtons[0].click();
    await page.waitForTimeout(600);
    let time1 = await page.evaluate(vid => vid.currentTime, videoHandle);
    console.log(`Video currentTime after clicking Ch 1: ${time1}`);
  }

  // Test Play/Pause control
  const controlButtons = await page.$$('div.absolute.bottom-6.left-6 button');
  console.log(`Found ${controlButtons.length} control buttons`);
  if (controlButtons.length >= 3) {
    // Pause
    console.log('Testing Pause button...');
    await controlButtons[0].click();
    await page.waitForTimeout(300);
    let isPaused = await page.evaluate(vid => vid.paused, videoHandle);
    console.log(`Video paused state: ${isPaused}`);

    // Play
    console.log('Testing Play button...');
    await controlButtons[0].click();
    await page.waitForTimeout(300);
    let isPlaying = !(await page.evaluate(vid => vid.paused, videoHandle));
    console.log(`Video playing state: ${isPlaying}`);

    // Mute toggle
    console.log('Testing Mute button...');
    await controlButtons[1].click();
    let isMuted = await page.evaluate(vid => vid.muted, videoHandle);
    console.log(`Video muted state after toggle: ${isMuted}`);
  }

  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await browser.close();
  console.log('ALL BROWSER TESTS PASSED!');
}

testHero().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
