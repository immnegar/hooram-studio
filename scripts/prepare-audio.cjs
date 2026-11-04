const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const input = path.join(__dirname, '../temp_frames/ambient1.ogg');
const output = path.join(audioDir, 'ambient-music.mp3');

console.log('Encoding MP3...');
const cmd = `"C:/Users/Saraye Tel/.local/bin/ffmpeg.exe" -y -i "${input}" -af "afade=t=in:ss=0:d=1.5,afade=t=out:st=145:d=3.5" -c:a libmp3lame -b:a 192k "${output}"`;
execSync(cmd, { stdio: 'inherit' });

console.log('Output size:', fs.statSync(output).size, 'bytes');

// Also copy to dist/audio if dist exists
const distAudioDir = path.join(__dirname, '../dist/audio');
if (!fs.existsSync(distAudioDir)) fs.mkdirSync(distAudioDir, { recursive: true });
fs.copyFileSync(output, path.join(distAudioDir, 'ambient-music.mp3'));
console.log('Copied to dist/audio/ambient-music.mp3');

