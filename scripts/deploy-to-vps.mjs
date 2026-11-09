import { Client } from 'ssh2';

const conn = new Client();
console.log('Connecting to Abr Arvan VPS (94.101.186.60)...');

conn.on('ready', () => {
  console.log('CONNECTED TO VPS SUCCESSFULLY!');
  
  const cmd = `
    cd /var/www/hooram-studio &&
    echo "=== PULLING LATEST CODE FROM GITHUB ===" &&
    git pull origin main &&
    echo "=== INSTALLING DEPENDENCIES & BUILDING ===" &&
    npm run build &&
    echo "=== RELOADING PM2 ===" &&
    pm2 reload deploy/ecosystem.config.cjs --update-env || pm2 reload all &&
    echo "=== PM2 STATUS ===" &&
    pm2 status
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      process.exit(1);
    }
    stream.on('close', (code, signal) => {
      console.log(`\nDeployment command finished with exit code ${code}`);
      conn.end();
      process.exit(code || 0);
    });
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
  });
}).on('error', (err) => {
  console.error('SSH Connection Failed:', err.message);
  process.exit(1);
}).connect({
  host: '94.101.186.60',
  port: 22,
  username: 'root',
  password: 'HooramStudio#2026!Secure',
  readyTimeout: 15000
});

