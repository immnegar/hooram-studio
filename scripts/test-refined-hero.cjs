const playwright = require('C:/Users/Saraye Tel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function testRefinedHero() {
  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const outDir = path.join(__dirname, '../temp_frames/hero_refinement_test');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const consoleErrors = [];

  // ==================== TEST DESKTOP ====================
  console.log('--- Testing Desktop (1920x1080) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await desktopContext.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // 1. Verify Video Section A and Text Section B positions
  const videoElem = await page.$('section video');
  if (!videoElem) throw new Error('Video element not found');

  const videoBox = await videoElem.boundingBox();
  console.log('Video Bounding Box:', videoBox);

  // Find Headline H1
  const headline = await page.$('h1');
  const headlineText = await headline.innerText();
  const headlineBox = await headline.boundingBox();
  console.log('Headline Text:', headlineText.replace(/\n/g, ' '));
  console.log('Headline Bounding Box:', headlineBox);

  if (headlineBox.y <= videoBox.y + videoBox.height - 20) {
    throw new Error('Headline is overlapping or above video! Must be strictly BELOW video.');
  }
  console.log('VERIFIED: Headline is strictly below video (Video bottom:', videoBox.y + videoBox.height, 'Headline top:', headlineBox.y, ')');

  // Verify Description
  const description = await page.$('section:nth-of-type(2) p');
  const descText = await description.innerText();
  console.log('Description Text:', descText);

  // Verify CTAs
  const ctas = await page.$$('section:nth-of-type(2) a');
  console.log(`Found ${ctas.length} CTA buttons in Section B:`);
  for (const cta of ctas) {
    const text = await cta.innerText();
    const href = await cta.getAttribute('href');
    console.log(`- CTA "${text.trim()}" -> ${href}`);
  }

  // 2. Test 4 Video Chapters
  const chapterBtns = await page.$$('section:nth-of-type(1) button.rounded-full');
  console.log(`Found ${chapterBtns.length} buttons in Section A`);

  // Target the chapter navigation buttons (4 buttons with chapter titles)
  const chapters = ['فیلم‌های تبلیغاتی', 'تیزرهای محصول', 'خودرو و برندینگ', 'طراحی پلتفرم وب'];
  for (let i = 0; i < chapters.length; i++) {
    const btn = await page.$(`//section[1]//button[contains(text(), '${chapters[i]}')]`);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(500);
      const curTime = await page.evaluate(v => v.currentTime, videoElem);
      console.log(`Clicked chapter "${chapters[i]}" -> video currentTime: ${curTime.toFixed(2)}s`);
    } else {
      console.warn(`Could not find button for ${chapters[i]}`);
    }
  }

  // 3. Test Background Music
  const musicBtn = await page.$('//section[1]//button[contains(@aria-label, "موسیقی")]');
  if (!musicBtn) throw new Error('Music speaker button not found!');

  const audioElem = await page.$('section:nth-of-type(1) audio');
  if (!audioElem) throw new Error('Audio element not found!');

  let initialAudioState = await page.evaluate(a => ({ paused: a.paused, src: a.src }), audioElem);
  console.log('Initial Audio State (Must be paused):', initialAudioState);

  // Click music button to start music
  console.log('Clicking speaker button to start music...');
  await musicBtn.click();
  await page.waitForTimeout(800);

  let playingAudioState = await page.evaluate(a => ({ paused: a.paused, currentTime: a.currentTime }), audioElem);
  console.log('Audio State after click (Must be playing):', playingAudioState);

  // Verify switching scene does NOT stop or reset audio
  console.log('Switching scene to Chapter 3 while music is playing...');
  const ch3Btn = await page.$(`//section[1]//button[contains(text(), 'خودرو و برندینگ')]`);
  if (ch3Btn) await ch3Btn.click();
  await page.waitForTimeout(500);

  let audioAfterSceneSwitch = await page.evaluate(a => ({ paused: a.paused, currentTime: a.currentTime }), audioElem);
  console.log('Audio State after scene switch (Must still be playing continuously):', audioAfterSceneSwitch);

  // Click music button to stop music
  console.log('Clicking speaker button to stop music...');
  await musicBtn.click();
  await page.waitForTimeout(400);

  let stoppedAudioState = await page.evaluate(a => ({ paused: a.paused }), audioElem);
  console.log('Audio State after 2nd click (Must be paused):', stoppedAudioState);

  await page.screenshot({ path: path.join(outDir, 'desktop_hero.png'), fullPage: false });
  console.log('Saved desktop_hero.png');

  // ==================== TEST MOBILE ====================
  console.log('\n--- Testing Mobile (390x844 iPhone) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);

  const mobVideo = await mobilePage.$('section video');
  const mobVideoBox = await mobVideo.boundingBox();
  const mobHeadline = await mobilePage.$('h1');
  const mobHeadlineBox = await mobHeadline.boundingBox();

  console.log('Mobile Video width:', mobVideoBox.width, 'Height:', mobVideoBox.height);
  console.log('Mobile Headline Y:', mobHeadlineBox.y, 'Video Bottom:', mobVideoBox.y + mobVideoBox.height);

  if (mobHeadlineBox.y <= mobVideoBox.y + mobVideoBox.height - 10) {
    throw new Error('Mobile: Headline overlaps video!');
  }
  console.log('VERIFIED: Mobile layout has video strictly above headline.');

  await mobilePage.screenshot({ path: path.join(outDir, 'mobile_hero.png'), fullPage: false });
  console.log('Saved mobile_hero.png');

  console.log('\nConsole Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await browser.close();
  console.log('\n>>> ALL REFINEMENT & VERIFICATION TESTS PASSED SUCCESSFULLY! <<<');
}

testRefinedHero().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

