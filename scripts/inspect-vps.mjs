import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  conn.exec('pwd && ls -la /var/www/hooram-studio && nginx -T | grep -E "root|proxy_pass"', (err, stream) => {
    stream.on('close', () => {
      conn.end();
    });
    stream.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
  });
}).connect({
  host: '94.101.186.60',
  port: 22,
  username: 'root',
  password: 'HooramStudio#2026!Secure',
});

