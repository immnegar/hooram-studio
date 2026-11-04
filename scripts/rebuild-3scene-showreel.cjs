const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const concatTxt = path.join(root, 'temp_frames', 'segments', 'concat_3scenes.txt');
const seg1 = path.join(root, 'temp_frames', 'segments', 'seg1.mp4').replace(/\\/g, '/');
const seg2 = path.join(root, 'temp_frames', 'segments', 'seg2.mp4').replace(/\\/g, '/');
const seg4 = path.join(root, 'temp_frames', 'segments', 'seg4.mp4').replace(/\\/g, '/');

fs.writeFileSync(concatTxt, `file '${seg1}'\nfile '${seg2}'\nfile '${seg4}'\n`);

const finalVideo = path.join(root, 'public', 'videos', 'hero-showreel.mp4');
console.log('Encoding optimized 3-scene hero showreel...');
execSync(`ffmpeg -y -f concat -safe 0 -i "${concatTxt}" -c:v libx264 -preset medium -crf 22 -g 30 -keyint_min 30 -sc_threshold 0 -pix_fmt yuv420p -an -movflags +faststart "${finalVideo}"`, { stdio: 'inherit' });

console.log('Synchronizing to dist if exists...');
const distVideo = path.join(root, 'dist', 'videos', 'hero-showreel.mp4');
if (fs.existsSync(path.dirname(distVideo))) {
  fs.copyFileSync(finalVideo, distVideo);
}

const stats = fs.statSync(finalVideo);
console.log('Done! New 3-scene video size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');

