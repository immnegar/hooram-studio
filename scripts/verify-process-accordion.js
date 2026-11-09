import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(process.cwd(), '.chrome-process-test');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9226',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9226/json/version');
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);

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
  await new Promise(r => setTimeout(r, 1500));

  // Set mobile viewport 390px
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await new Promise(r => setTimeout(r, 500));

  // Scroll to #process section
  await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('process');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // Audit accordion items
  const auditRes = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const processSec = document.getElementById('process');
        const mobileContainer = processSec.querySelector('.block.sm\\\\:hidden');
        const items = mobileContainer ? Array.from(mobileContainer.children) : [];
        const rect = processSec.getBoundingClientRect();

        return {
          hasMobileAccordion: !!mobileContainer,
          itemCount: items.length,
          itemTexts: items.map(it => it.innerText.replace(/\\n/g, ' - ')),
          sectionHeight: rect.height
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Mobile Process Accordion Audit:', auditRes.result?.result?.value);

  // Capture screenshot of process section
  const screenshotRes = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('public/process-preview-mobile.png', Buffer.from(screenshotRes.result.data, 'base64'));
  console.log('Saved public/process-preview-mobile.png');

  await send('Target.closeTarget', { targetId });
  ws.close();
  chromeProc.kill();
} catch (e) {
  console.error('Test error:', e);
  chromeProc.kill();
}
