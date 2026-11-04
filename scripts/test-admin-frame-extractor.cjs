let playwright;
try {
  playwright = require('playwright');
} catch (e) {
  try {
    playwright = require('C:/Users/Saraye Tel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
  } catch (err) {
    console.error('Playwright not found');
  }
}

(async () => {
  const browser = await playwright.chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  // Load credentials from environment
  const testEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
  const testPassword = process.env.TEST_ADMIN_PASSWORD;

  if (!testPassword) {
    console.log('[Notice] TEST_ADMIN_PASSWORD environment variable is not set. Please provide TEST_ADMIN_PASSWORD to run this automated test.');
    await browser.close();
    return;
  }

  // Login first to get JWT token
  console.log('Navigating to admin login...');
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'load' });
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // Navigate to portfolio management
  console.log('Navigating to portfolio management...');
  await page.goto('http://localhost:3000/admin/portfolio', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  // Click edit on the first project
  console.log('Clicking edit on first project...');
  const editButtons = await page.$$('button[title="ویرایش پروژه"]');
  if (editButtons.length > 0) {
    await editButtons[0].click();
    console.log('Clicked edit modal button.');
  } else {
    console.log('No edit button found!');
  }

  await page.waitForTimeout(2000);

  // Screenshot modal with frame extractor
  await page.screenshot({ path: 'temp_frames/admin_portfolio_modal.jpg', fullPage: false });
  console.log('Saved screenshot to temp_frames/admin_portfolio_modal.jpg');

  // Check if extractor elements exist
  const hasVideo = await page.$('video');
  const hasRange = await page.$('input[type="range"]');
  const captureBtn = await page.$('button:has-text("استخراج این فریم به عنوان کاور")');

  console.log('Extractor check:', {
    hasVideo: !!hasVideo,
    hasRange: !!hasRange,
    hasCaptureBtn: !!captureBtn
  });

  if (captureBtn) {
    console.log('Clicking capture frame button...');
    await captureBtn.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: 'temp_frames/admin_portfolio_captured.jpg', fullPage: false });
    console.log('Saved captured screenshot to temp_frames/admin_portfolio_captured.jpg');
  }

  await browser.close();
})();
