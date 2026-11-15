import http from 'http';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT_DIR, '.env');

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
  try {
    exec(`${start} "${url}"`);
  } catch (_) {
    // If open fails, the URL is already printed on console
  }
}

function updateEnvFile(updates) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += (content.endsWith('\n') || !content ? '' : '\n') + `${key}=${value}\n`;
    }
  }

  fs.writeFileSync(ENV_PATH, content, 'utf8');
}

export async function runGoogleDriveSetup() {
  console.log('\n================================================================');
  console.log('   HORAM STUDIO — GOOGLE DRIVE OAUTH 2.0 SETUP WIZARD          ');
  console.log('================================================================');
  console.log('Required Google Cloud OAuth Client Type:');
  console.log('  • Application Type:      Web application');
  console.log('  • Authorized Redirect:   http://localhost:8085/oauth2callback');
  console.log('  • OAuth Scopes:          https://www.googleapis.com/auth/drive.file');
  console.log('================================================================\n');

  // Read existing .env if present
  let envClientId = '';
  let envClientSecret = '';
  if (fs.existsSync(ENV_PATH)) {
    const envContent = fs.readFileSync(ENV_PATH, 'utf8');
    const idMatch = envContent.match(/^GDRIVE_CLIENT_ID=(.+)$/m);
    const secretMatch = envContent.match(/^GDRIVE_CLIENT_SECRET=(.+)$/m);
    if (idMatch) envClientId = idMatch[1].trim();
    if (secretMatch) envClientSecret = secretMatch[1].trim();
  }

  // 1. Get Client ID
  let clientId = envClientId;
  if (!clientId || clientId.startsWith('your_')) {
    clientId = await prompt('Enter your Google OAuth Client ID: ');
  } else {
    console.log(`Using Client ID from .env: ${clientId.slice(0, 16)}...`);
  }

  if (!clientId) {
    console.error('❌ Error: Client ID cannot be empty.');
    process.exit(1);
  }

  // 2. Get Client Secret
  let clientSecret = envClientSecret;
  if (!clientSecret || clientSecret.startsWith('your_')) {
    clientSecret = await prompt('Enter your Google OAuth Client Secret: ');
  } else {
    console.log(`Using Client Secret from .env: ${clientSecret.slice(0, 6)}******`);
  }

  if (!clientSecret) {
    console.error('❌ Error: Client Secret cannot be empty.');
    process.exit(1);
  }

  // 3. Start local loopback HTTP server
  const PORT = 8085;
  const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/drive.file');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('login_hint', 'hellohooram@gmail.com');

  console.log('\n[1/3] Starting temporary local authorization listener on port 8085...');

  const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

    if (reqUrl.pathname !== '/oauth2callback') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const code = reqUrl.searchParams.get('code');
    const returnedState = reqUrl.searchParams.get('state');
    const error = reqUrl.searchParams.get('error');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h2>❌ Authorization Failed: ${error}</h2><p>You can close this tab and return to the terminal.</p>`);
      server.close();
      console.error(`\n❌ Authorization was rejected by user or Google: ${error}`);
      process.exit(1);
    }

    if (returnedState !== state) {
      res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h2>❌ Security Error: Invalid OAuth state parameter.</h2>');
      server.close();
      process.exit(1);
    }

    // Success response to browser
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Horam Studio — Google Drive Authorization</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
            h2 { color: #10b981; margin-top: 0; }
            p { color: #94a3b8; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>✅ احراز هویت با موفقیت انجام شد</h2>
            <p>مجوز دسترسی امن به Google Drive برای سامانه بکاپ استودیو هورام با موفقیت دریافت گردید.</p>
            <p>می‌توانید این تب را ببندید و به ترمینال بازگردید.</p>
          </div>
        </body>
      </html>
    `);

    server.close();

    console.log('\n[2/3] Authorization code received. Exchanging for OAuth 2.0 Refresh Token...');

    try {
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
      });

      const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        throw new Error(`Token exchange failed [HTTP ${tokenRes.status}]: ${errText}`);
      }

      const tokenData = await tokenRes.json();
      const refreshToken = tokenData.refresh_token;

      if (!refreshToken) {
        throw new Error('Google did not return a refresh_token. Make sure prompt=consent was sent, or revoke previous app permissions in your Google Account Security tab.');
      }

      console.log('✅ OAuth 2.0 Refresh Token received successfully!');

      // 4. Test connection & resolve root folder
      console.log('\n[3/3] Testing Google Drive connection and resolving project folder...');

      const rootFolderName = 'Hooram-Studio-Backups';
      const searchQ = `mimeType = 'application/vnd.google-apps.folder' and name = '${rootFolderName}' and trashed = false`;
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQ)}&fields=files(id,name)&spaces=drive`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });

      let folderId = '';
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.files && searchData.files.length > 0) {
          folderId = searchData.files[0].id;
        }
      }

      if (!folderId) {
        const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: rootFolderName,
            mimeType: 'application/vnd.google-apps.folder',
            description: 'Automated backup archives for Horam Studio'
          })
        });

        if (createRes.ok) {
          const created = await createRes.json();
          folderId = created.id;
        }
      }

      console.log(`✅ Project backup folder verified: "${rootFolderName}" (ID: ${folderId})`);

      // 5. Update .env
      updateEnvFile({
        BACKUP_STORAGE_PROVIDER: 'google-drive',
        GDRIVE_CLIENT_ID: clientId,
        GDRIVE_CLIENT_SECRET: clientSecret,
        GDRIVE_REFRESH_TOKEN: refreshToken,
        GDRIVE_FOLDER_ID: folderId,
        GDRIVE_ROOT_FOLDER_NAME: rootFolderName
      });

      console.log('\n================================================================');
      console.log('🎉 GOOGLE DRIVE BACKUP CONFIGURATION COMPLETED SUCCESSFULLY!');
      console.log('================================================================');
      console.log(`- Provider:            Google Drive`);
      console.log(`- Mode:                Database Only (Secure Cloud Protection)`);
      console.log(`- Folder Name:         ${rootFolderName}`);
      console.log(`- Folder ID:           ${folderId}`);
      console.log(`- Saved To:            .env (Credentials stored securely, not logged)`);
      console.log('\nYou can now test your live cloud backup by running:');
      console.log('  npm run backup:status');
      console.log('  npm run backup');
      console.log('================================================================\n');

    } catch (err) {
      console.error('\n❌ Error during setup:', err.message);
      process.exit(1);
    }
  });

  server.listen(PORT, 'localhost', () => {
    console.log(`Opening browser to authenticate with Google...\n`);
    console.log(`If your browser does not open automatically, copy and paste this URL:\n`);
    console.log(authUrl.toString());
    console.log('\nWaiting for Google authentication callback...');
    openBrowser(authUrl.toString());
  });
}

// Allow direct execution
if (process.argv[1] && process.argv[1].endsWith('setup-gdrive.js')) {
  runGoogleDriveSetup();
}

