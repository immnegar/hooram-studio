const playwright = require('C:/Users/Saraye Tel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await playwright.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const videoStateBefore = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? {
      currentSrc: v.currentSrc,
      currentTime: v.currentTime,
      duration: v.duration,
      paused: v.paused,
      networkState: v.networkState,
      readyState: v.readyState
    } : null;
  });
  console.log('Video state before click:', videoStateBefore);

  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await b.textContent();
    if (text && text.includes('طراحی پلتفرم وب')) {
      console.log('Clicking chapter:', text.trim());
      await b.click();
      break;
    }
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'temp_frames/hero_actual_view.jpg' });

  const videoStateAfter = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? {
      currentSrc: v.currentSrc,
      currentTime: v.currentTime,
      duration: v.duration,
      paused: v.paused,
      networkState: v.networkState,
      readyState: v.readyState
    } : null;
  });
  console.log('Video state after click:', videoStateAfter);

  const phoneTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href^="tel:"]')).map(a => ({
      href: a.href,
      text: a.innerText
    }));
  });
  console.log('Phone links found:', phoneTexts);

  await browser.close();
})();
