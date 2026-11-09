import { Client } from 'ssh2';

const VPS_HOST = '94.101.186.60';
const VPS_USER = 'root';
const VPS_PASS = 'HooramStudio#2026!Secure';

console.log('🔒 Requesting official SSL certificate for hooramstudio.ir and www.hooramstudio.ir...');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `certbot --nginx -d hooramstudio.ir -d www.hooramstudio.ir --non-interactive --agree-tos -m negar.hosseini712@gmail.com --redirect`;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', (code) => {
      console.log('Certbot finished with exit code:', code);
      conn.end();
    });
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
  });
}).on('error', (err) => {
  console.error('SSH Error:', err.message);
}).connect({
  host: VPS_HOST,
  port: 22,
  username: VPS_USER,
  password: VPS_PASS,
  readyTimeout: 30000
});

