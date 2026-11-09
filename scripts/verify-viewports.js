import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(process.cwd(), '.chrome-test-profile');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9222',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

// Wait for Chrome to be ready
await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
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

  // Create new target
  const targetRes = await send('Target.createTarget', { url: 'http://127.0.0.1:5173/' });
  const targetId = targetRes.result.targetId;

  // Attach to target
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

  // Wait for page to settle
  await new Promise(r => setTimeout(r, 2000));

  const debugRes = await sendSession('Runtime.evaluate', {
    expression: `({ title: document.title, htmlLen: document.body.innerHTML.length, snippet: document.body.innerHTML.slice(0, 150) })`,
    returnByValue: true
  });
  console.log('Page Debug:', debugRes.result?.result?.value);

  const viewports = [
    { name: 'Mobile 320px', width: 320, height: 600 },
    { name: 'Mobile 360px', width: 360, height: 740 },
    { name: 'Mobile 375px', width: 375, height: 812 },
    { name: 'Mobile 390px', width: 390, height: 844 },
    { name: 'Mobile 414px', width: 414, height: 896 },
    { name: 'Mobile 430px', width: 430, height: 932 },
    { name: 'Tablet 768px', width: 768, height: 1024 },
    { name: 'Desktop 1024px', width: 1024, height: 768 },
    { name: 'Desktop 1280px', width: 1280, height: 800 },
    { name: 'Desktop 1440px', width: 1440, height: 900 },
  ];

  console.log('\n--- VIEWPORT & OVERFLOW AUDIT RESULTS ---');
  let allPassed = true;

  for (const vp of viewports) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width <= 768,
    });

    await new Promise(r => setTimeout(r, 300));

    const evalRes = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const hasOverflow = docWidth > winWidth;
          
          let overflowingElements = [];
          if (hasOverflow) {
            document.querySelectorAll('*').forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.right > winWidth + 1) {
                overflowingElements.push(el.tagName + '.' + Array.from(el.classList).slice(0, 3).join('.'));
              }
            });
          }

          // Check if Mobile Menu Button is visible when < 1024
          const menuBtn = document.querySelector('button[aria-label="باز کردن منوی ناوبری"]');
          const isMenuBtnVisible = menuBtn ? window.getComputedStyle(menuBtn).display !== 'none' : false;

          // Check if Mobile Bottom Dock is visible when < 768
          const bottomDock = document.querySelector('nav[aria-label="دسترسی سریع موبایل"]');
          const isBottomDockVisible = bottomDock ? window.getComputedStyle(bottomDock).display !== 'none' : false;

          return {
            docWidth,
            winWidth,
            hasOverflow,
            overflowCount: overflowingElements.length,
            sampleOverflow: overflowingElements.slice(0, 3),
            isMenuBtnVisible,
            isBottomDockVisible
          };
        })()
      `,
      returnByValue: true
    });

    const val = evalRes.result?.result?.value || evalRes.result?.value;
    if (!val) {
      console.log('Eval error or empty:', evalRes);
      continue;
    }
    const status = val.hasOverflow ? '❌ FAIL (Overflow)' : '✅ PASS';
    if (val.hasOverflow) allPassed = false;

    console.log(`${vp.name.padEnd(16)} | Win: ${val.winWidth}px | Doc: ${val.docWidth}px | ${status} | MenuBtn: ${val.isMenuBtnVisible} | BottomDock: ${val.isBottomDockVisible}`);
    if (val.hasOverflow) {
      console.log('   Overflow sample:', val.sampleOverflow);
    }
  }

  // Test Mobile Menu open and close interaction on 390px
  console.log('\n--- TESTING MOBILE MENU INTERACTION (390px) ---');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  const clickMenuRes = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[aria-label="باز کردن منوی ناوبری"]');
        if (!btn) return 'Menu button not found';
        btn.click();
        return 'Menu button clicked';
      })()
    `,
    returnByValue: true
  });
  console.log('Open Menu Trigger:', clickMenuRes.result?.result?.value);

  await new Promise(r => setTimeout(r, 400));

  const checkMenuOpen = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = document.querySelector('button[aria-label="بستن منو"]');
        const isBodyLocked = document.body.style.overflow === 'hidden';
        const navLinks = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.includes('صفحه اصلی') || a.textContent.includes('نمونه‌کارها'));
        return {
          isMenuOpen: !!closeBtn,
          isBodyLocked,
          navLinksCount: navLinks.length
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Menu Open State:', checkMenuOpen.result?.result?.value);

  // Close menu
  const clickCloseRes = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[aria-label="بستن منو"]');
        if (!btn) return 'Close button not found';
        btn.click();
        return 'Close button clicked';
      })()
    `,
    returnByValue: true
  });
  console.log('Close Menu Trigger:', clickCloseRes.result?.result?.value);

  await new Promise(r => setTimeout(r, 300));

  const checkMenuClosed = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = document.querySelector('button[aria-label="بستن منو"]');
        const isBodyUnlocked = document.body.style.overflow === '';
        return {
          isMenuClosed: !closeBtn,
          isBodyUnlocked
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Menu Closed State:', checkMenuClosed.result?.result?.value);

  console.log('\nOVERALL RESULT:', allPassed ? '🌟 ALL VIEWPORTS PASSED WITH ZERO OVERFLOW!' : '⚠️ SOME ISSUES DETECTED');

  ws.close();
} finally {
  chromeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}
