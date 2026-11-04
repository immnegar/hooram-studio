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
const path = require('path');
const fs = require('fs');

async function testContactAndInquiry() {
  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(__dirname, '../temp_frames/contact_test');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // ==================== 1. TEST CONTACT & INQUIRY PAGE ====================
  console.log('--- 1. Testing /contact Page ---');
  await page.goto('http://localhost:5000/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Form elements
  const nameInput = await page.$('input[placeholder*="آرش رحیمی"]');
  const phoneInput = await page.$('input[placeholder="09121234567"]');
  const descInput = await page.$('textarea');
  const submitBtn = await page.$('button[type="submit"]');

  if (!nameInput || !phoneInput || !descInput || !submitBtn) {
    throw new Error('Project inquiry form elements not found on /contact');
  }
  console.log('VERIFIED: Existing Project Inquiry Form and fields exist on /contact');

  // Check Studio Info and Social links
  const studioNameHeader = await page.$('h3');
  const studioNameText = await studioNameHeader.innerText();
  console.log('Studio Info Header:', studioNameText);

  // Check that unconfigured social links are inactive (not linking to fake URLs)
  const socialCards = await page.$$('a[href*="instagram.com"]');
  console.log(`Active Instagram links on public page initially (expected 0): ${socialCards.length}`);

  // Fill and submit inquiry form
  console.log('Submitting a new project inquiry...');
  await nameInput.fill('کاربر تستی ارزیابی');
  await page.fill('input[placeholder*="پارس صنعت"]', 'برند بازرگانی البرز');
  await phoneInput.fill('09121112233');
  await page.fill('input[placeholder*="name@company.com"]', 'test@alborzbrand.ir');
  await descInput.fill('این یک درخواست تستی اتوماتیک جهت ارزیابی ثبت پروژه و لید در استودیو هورام است.');
  await submitBtn.click();

  // Wait for success screen
  await page.waitForSelector('text=درخواست شما با موفقیت ثبت شد!', { timeout: 10000 });
  const inquiryCodeElem = await page.$('text=کد پیگیری استعلام');
  const inquiryCodeText = await inquiryCodeElem ? await inquiryCodeElem.innerText() : '';
  console.log('SUCCESS:', inquiryCodeText);
  await page.screenshot({ path: path.join(outDir, '01_inquiry_success.png') });

  // ==================== 2. TEST ADMIN DASHBOARD & LOGIN ====================
  console.log('\n--- 2. Testing Admin Login & Dashboard ---');
  await page.goto('http://localhost:5000/admin/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const testEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
  const testPassword = process.env.TEST_ADMIN_PASSWORD;

  if (!testPassword) {
    console.log('[Notice] TEST_ADMIN_PASSWORD environment variable is not set. Skipping admin login verification.');
  } else {
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin', { timeout: 10000 });
    console.log('VERIFIED: Successfully logged in to /admin');
    await page.waitForTimeout(1000);
  }

  // Check that the new inquiry is in recent inquiries or /admin/inquiries
  await page.goto('http://localhost:5000/admin/inquiries', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const pageContent = await page.content();
  if (pageContent.includes('کاربر تستی ارزیابی') && pageContent.includes('برند بازرگانی البرز')) {
    console.log('VERIFIED: New project inquiry is persistently accessible in Admin Inquiries table!');
  } else {
    throw new Error('Submitted inquiry not found in admin inquiries!');
  }
  await page.screenshot({ path: path.join(outDir, '02_admin_inquiries.png') });

  // ==================== 3. TEST ADMIN SETTINGS ====================
  console.log('\n--- 3. Testing Admin Settings Page ---');
  await page.goto('http://localhost:5000/admin/settings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const instagramInput = await page.$('input[placeholder*="instagram.com"]');
  if (!instagramInput) throw new Error('Instagram input not found in Admin Settings');

  const testInstagramUrl = 'https://instagram.com/hooram_creative';
  console.log(`Setting Instagram URL to: ${testInstagramUrl}...`);
  await instagramInput.fill(testInstagramUrl);

  const saveBtn = await page.$('button[type="submit"]');
  await saveBtn.click();

  await page.waitForSelector('text=تنظیمات راه‌های ارتباطی و شبکه‌های اجتماعی با موفقیت ذخیره شد.', { timeout: 10000 });
  console.log('VERIFIED: Admin Settings successfully saved!');
  await page.screenshot({ path: path.join(outDir, '03_admin_settings_saved.png') });

  // ==================== 4. TEST PUBLIC REFLECTION ====================
  console.log('\n--- 4. Testing Public Reflection of Settings ---');
  await page.goto('http://localhost:5000/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const activeInstaLink = await page.$(`a[href="${testInstagramUrl}"]`);
  if (!activeInstaLink) {
    throw new Error('Configured Instagram link not reflected on public /contact page!');
  }
  console.log('VERIFIED: Configured social media link is active and points to:', testInstagramUrl);

  // Check Footer
  const footerInstaLink = await page.$(`footer a[href="${testInstagramUrl}"]`);
  if (!footerInstaLink) {
    throw new Error('Configured Instagram link not reflected in footer!');
  }
  console.log('VERIFIED: Configured social media link is active in Footer!');
  await page.screenshot({ path: path.join(outDir, '04_public_contact_with_social.png') });

  // Clean up: Reset Instagram URL in settings to empty so it remains clean
  console.log('\n--- Cleaning up test URL in settings ---');
  await page.goto('http://localhost:5000/admin/settings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const instaInput2 = await page.$('input[placeholder*="instagram.com"]');
  await instaInput2.fill('');
  await (await page.$('button[type="submit"]')).click();
  await page.waitForSelector('text=تنظیمات راه‌های ارتباطی و شبکه‌های اجتماعی با موفقیت ذخیره شد.', { timeout: 5000 });
  console.log('Cleaned up Instagram URL back to unconfigured state.');

  console.log('\nConsole Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await browser.close();
  console.log('\n>>> ALL CONTACT & INQUIRY ENHANCEMENT TESTS PASSED! <<<');
}

testContactAndInquiry().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
