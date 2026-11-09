import { spawn } from 'child_process';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(process.cwd(), '.chrome-admin-test');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9225',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9225/json/version');
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

  // 1. Test Home page
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

  // Check for any link to /admin on the public page
  const checkAdminLinks = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        const adminLinks = Array.from(document.querySelectorAll('a[href*="/admin"]')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href'),
          location: a.closest('header') ? 'header' : (a.closest('footer') ? 'footer' : 'body')
        }));
        return {
          adminLinkCount: adminLinks.length,
          adminLinks
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Public Home page Admin links check:', checkAdminLinks.result?.result?.value);

  // 2. Test direct access to /admin
  await sendSession('Page.navigate', { url: 'http://127.0.0.1:5173/admin' });
  await new Promise(r => setTimeout(r, 1500));

  const checkAdminAccess = await sendSession('Runtime.evaluate', {
    expression: `
      (() => {
        return {
          url: window.location.href,
          pathname: window.location.pathname,
          title: document.title,
          hasLoginForm: !!document.querySelector('form') || !!document.querySelector('input[type="password"]'),
          bodySnippet: document.body.innerText.slice(0, 120).replace(/\\n/g, ' ')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Direct /admin URL check:', checkAdminAccess.result?.result?.value);

  await send('Target.closeTarget', { targetId });
  ws.close();
  chromeProc.kill();
  console.log('\nVerification complete!');
} catch (e) {
  console.error('Test error:', e);
  chromeProc.kill();
}

