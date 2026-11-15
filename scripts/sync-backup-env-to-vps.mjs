import { Client } from 'ssh2';
import fs from 'fs';

const localEnv = fs.readFileSync('.env', 'utf8');

const gdriveVars = {};
localEnv.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) {
    gdriveVars[m[1].trim()] = m[2].trim();
  }
});

function attemptConnect(retriesLeft = 3) {
  const conn = new Client();

  conn.on('ready', () => {
    console.log('Connected to VPS! Updating /var/www/hooram-studio/.env ...');

    const updateScript = `
const fs = require('fs');
const envPath = '/var/www/hooram-studio/.env';
let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

const updates = ${JSON.stringify(gdriveVars)};

for (const [k, v] of Object.entries(updates)) {
  if (k.startsWith('GDRIVE_') || k.startsWith('BACKUP_')) {
    const reg = new RegExp('^' + k + '=.*$', 'm');
    if (reg.test(content)) {
      content = content.replace(reg, k + '=' + v);
    } else {
      content += (content.endsWith('\\n') || !content ? '' : '\\n') + k + '=' + v + '\\n';
    }
  }
}

fs.writeFileSync(envPath, content, 'utf8');
console.log('VPS .env updated successfully!');
`;

    const b64 = Buffer.from(updateScript).toString('base64');
    const cmd = [
      `node -e 'eval(Buffer.from("${b64}", "base64").toString("utf8"))'`,
      'echo "=== TESTING BACKUP ON VPS ==="',
      'cd /var/www/hooram-studio && node server/backup/cli.js backup',
      'echo "=== CHECKING BACKUP STATUS ==="',
      'cd /var/www/hooram-studio && node server/backup/cli.js status'
    ].join(' && ');

    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      let out = '';
      stream.on('data', d => out += d);
      stream.stderr.on('data', d => out += d);
      stream.on('close', () => {
        console.log(out);
        conn.end();
        process.exit(0);
      });
    });
  });

  conn.on('error', (err) => {
    console.log(`Connection attempt failed (${err.message}). Retries left: ${retriesLeft}`);
    if (retriesLeft > 0) {
      setTimeout(() => attemptConnect(retriesLeft - 1), 3000);
    } else {
      console.error('All SSH connection attempts failed.');
      process.exit(1);
    }
  });

  conn.connect({
    host: '94.101.186.60',
    port: 22,
    username: 'root',
    password: 'HooramStudio#2026!Secure',
    readyTimeout: 60000,
    keepaliveInterval: 10000
  });
}

attemptConnect(4);
