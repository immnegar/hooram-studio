import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const conn = new Client();
console.log('Connecting to VPS SFTP (94.101.186.60)...');

conn.on('ready', () => {
  console.log('Connected! Opening SFTP session...');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    function uploadFile(localPath, remotePath) {
      return new Promise((resolve, reject) => {
        console.log(`Uploading: ${localPath} -> ${remotePath}`);
        sftp.fastPut(localPath, remotePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    async function deploy() {
      try {
        // 1. Upload root files of dist
        const distRootFiles = [
          'index.html',
          'robots.txt',
          'sitemap.xml',
          'favicon.svg',
          'favicon.ico',
          'favicon-48x48.png',
          'favicon-96x96.png',
          'favicon-144x144.png',
          'favicon-192x192.png',
          'favicon-512x512.png',
          'apple-touch-icon.png',
          'logo.png',
        ];

        for (const file of distRootFiles) {
          const local = path.join(process.cwd(), 'dist', file);
          if (fs.existsSync(local)) {
            await uploadFile(local, `/var/www/hooram-studio/dist/${file}`);
            // Also copy to public/
            await uploadFile(local, `/var/www/hooram-studio/public/${file}`);
          }
        }

        // Upload images/logo files
        const imageFiles = ['logo.png', 'logo-512.png', 'logo.svg', 'logo-symbol.svg'];
        for (const file of imageFiles) {
          const local = path.join(process.cwd(), 'dist', 'images', file);
          if (fs.existsSync(local)) {
            await uploadFile(local, `/var/www/hooram-studio/dist/images/${file}`);
            await uploadFile(local, `/var/www/hooram-studio/public/images/${file}`);
          }
        }

        // 2. Upload new assets
        const localAssetsDir = path.join(process.cwd(), 'dist', 'assets');
        const assetFiles = fs.readdirSync(localAssetsDir);
        for (const file of assetFiles) {
          const local = path.join(localAssetsDir, file);
          await uploadFile(local, `/var/www/hooram-studio/dist/assets/${file}`);
        }

        console.log('ALL FILES UPLOADED SUCCESSFULLY VIA SFTP!');

        // 3. Reload PM2 & Nginx
        conn.exec('pm2 reload all && systemctl reload nginx', (err, stream) => {
          if (err) throw err;
          stream.on('close', () => {
            console.log('PM2 and Nginx reloaded successfully!');
            conn.end();
            process.exit(0);
          });
          stream.pipe(process.stdout);
          stream.stderr.pipe(process.stderr);
        });

      } catch (e) {
        console.error('Deployment error:', e);
        conn.end();
        process.exit(1);
      }
    }

    deploy();
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
  process.exit(1);
}).connect({
  host: '94.101.186.60',
  port: 22,
  username: 'root',
  password: 'HooramStudio#2026!Secure',
  readyTimeout: 40000,
  keepaliveInterval: 5000
});

