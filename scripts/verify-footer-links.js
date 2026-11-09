import { spawn } from 'child_process';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(process.cwd(), '.chrome-footer-test');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9224',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9224/json/version');
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
  await new Promise(r => setTimeout(r, 1500));

  const modes = [
    { name: 'Desktop (1280px)', width: 1280, height: 800, mobile: false },
    { name: 'Mobile (390px)', width: 390, height: 844, mobile: true },
  ];

  console.log('=== AUDITING FOOTER LINKS IN WEB & MOBILE ===\n');

  for (const mode of modes) {
    console.log(`Testing mode: ${mode.name}`);
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: mode.width,
      height: mode.height,
      deviceScaleFactor: 2,
      mobile: mode.mobile,
    });
    await new Promise(r => setTimeout(r, 300));

    // Evaluate footer links
    const audit = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.querySelector('footer');
          if (!footer) return { error: 'No footer found' };

          const serviceLinks = Array.from(footer.querySelectorAll('div:nth-child(2) li a, div:nth-child(3) li a')).map(a => ({
            text: a.innerText.trim(),
            href: a.getAttribute('href'),
          }));

          const allLinks = Array.from(footer.querySelectorAll('a')).map(a => ({
            text: a.innerText.trim(),
            href: a.getAttribute('href'),
          }));

          return { allLinks };
        })()
      `,
      returnByValue: true
    });

    const links = audit.result?.result?.value?.allLinks || [];
    console.log(`Found ${links.length} total links in Footer:`);
    for (const l of links) {
      if (l.text && l.href) {
        console.log(`  - [${l.text}] -> ${l.href}`);
      }
    }

    // Test clicking a service anchor link from Home page
    const testClickRes = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const link = Array.from(document.querySelectorAll('footer a')).find(a => a.innerText.includes('تولید فیلم'));
          if (link) {
            link.click();
            return { clicked: true, href: link.getAttribute('href') };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true
    });
    console.log('  -> Clicked "تولید فیلم و ویدئوی تبلیغاتی":', testClickRes.result?.result?.value);

    // Wait for route transition
    await new Promise(r => setTimeout(r, 800));

    const pageAfterClick = await sendSession('Runtime.evaluate', {
      expression: `({ url: window.location.href, pathname: window.location.pathname, hash: window.location.hash })`,
      returnByValue: true
    });
    console.log('  -> Navigated to:', pageAfterClick.result?.result?.value);

    // Reset back to home for next iteration
    await sendSession('Runtime.evaluate', {
      expression: `window.location.href = 'http://127.0.0.1:5173/'`
    });
    await new Promise(r => setTimeout(r, 1000));
    console.log('');
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
  chromeProc.kill();
  console.log('All footer link audits complete!');
} catch (err) {
  console.error('Footer audit error:', err);
  chromeProc.kill();
}

