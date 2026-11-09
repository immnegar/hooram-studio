import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(process.cwd(), '.chrome-menu-profile');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9223',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9223/json/version');
  const versionData = await versionRes.json();
  const wsUrl = versionData.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const targetRes = await send('Target.createTarget', { url: 'http://127.0.0.1:5173/' });
  const targetId = targetRes.result.targetId;

  const attachRes = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOM.enable');

  await new Promise(r => setTimeout(r, 2000));

  const mobileWidths = [320, 360, 375, 390, 414, 430];
  console.log('=== VERIFYING SIGNATURE LUXURY MOBILE NAVIGATION ===\n');

  for (const width of mobileWidths) {
    const height = 844;
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise(r => setTimeout(r, 300));

    // Click to open menu if not already open
    const openMenuRes = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('button[aria-label="باز کردن منوی ناوبری"]');
          if (btn) {
            btn.click();
            return { opened: true };
          }
          return { opened: false, error: 'Open button not found' };
        })()
      `,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 400));

    // Audit menu elements
    const auditRes = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('a')).filter(a => a.innerText.includes('خانه') || a.innerText.includes('نمونه‌کارها') || a.innerText.includes('خدمات') || a.innerText.includes('درباره ما') || a.innerText.includes('تماس با ما'));
          const closeBtn = document.querySelector('button[aria-label="بستن منو"]');
          const ctaBtn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('شروع همکاری'));
          const phoneLink = document.querySelector('a[href^="tel:"]');
          const bodyOverflow = document.body.style.overflow;
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const hasOverflow = docWidth > winWidth;

          return {
            linkCount: links.length,
            linkTexts: links.map(l => l.innerText.replace(/\\n/g, ' ')),
            hasCloseBtn: !!closeBtn,
            hasCta: !!ctaBtn,
            ctaText: ctaBtn ? ctaBtn.innerText.replace(/\\n/g, ' ') : null,
            phone: phoneLink ? phoneLink.innerText.trim() : null,
            bodyOverflow,
            hasOverflow
          };
        })()
      `,
      returnByValue: true
    });

    const data = auditRes.result?.result?.value;
    console.log(`[Viewport ${width}px x ${height}px]:`);
    console.log(`  - Editorial Destinations: ${data?.linkCount} items (${data?.linkTexts?.join(' | ')})`);
    console.log(`  - Close Button: ${data?.hasCloseBtn ? 'PASSED' : 'FAILED'}`);
    console.log(`  - Collaboration CTA: ${data?.hasCta ? 'PASSED' : 'FAILED'} -> "${data?.ctaText}"`);
    console.log(`  - Contact Phone: ${data?.phone}`);
    console.log(`  - Body Scroll Locking: ${data?.bodyOverflow === 'hidden' ? 'LOCKED (PASSED)' : 'NOT LOCKED'}`);
    console.log(`  - Horizontal Overflow: ${data?.hasOverflow ? 'FAILED' : 'NONE (PASSED)'}\n`);

    // Capture screenshot for visual inspection
    const screenshotRes = await sendSession('Page.captureScreenshot', { format: 'png' });
    const imgBuffer = Buffer.from(screenshotRes.result.data, 'base64');
    const outImg = path.join(process.cwd(), `public/menu-preview-${width}px.png`);
    fs.writeFileSync(outImg, imgBuffer);

    // Close menu for next iteration
    await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = document.querySelector('button[aria-label="بستن منو"]');
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 300));
  }

  // Verify Desktop Navigation remains untouched
  console.log('=== VERIFYING DESKTOP VIEWPORT (1280px) ===');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await new Promise(r => setTimeout(r, 500));

  const desktopAudit = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const desktopNav = document.querySelector('nav.hidden.lg\\\\:flex');
        const desktopLinks = desktopNav ? Array.from(desktopNav.querySelectorAll('a')).map(a => a.innerText.trim()) : [];
        const mobileMenuButton = document.querySelector('button[aria-label="باز کردن منوی ناوبری"]');
        const isMobileBtnHidden = mobileMenuButton ? window.getComputedStyle(mobileMenuButton.parentElement).display === 'none' : true;
        return {
          hasDesktopNav: !!desktopNav,
          links: desktopLinks,
          isMobileBtnHidden
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Desktop audit:', desktopAudit.result?.result?.value);

  await send('Target.closeTarget', { targetId });
  ws.close();
  chromeProc.kill();
  console.log('\nAudit and verification complete!');
} catch (err) {
  console.error('Test error:', err);
  chromeProc.kill();
}

