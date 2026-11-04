import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const recDir = path.join(root, 'temp_frames', 'rec');
const recFiles = fs.readdirSync(recDir).filter(f => f.endsWith('.webm'));
if (recFiles.length === 0) {
  throw new Error('No web showcase recording found');
}
const webShowcasePath = path.join(recDir, recFiles[0]);

const sources = {
  scene1_watch: 'D:/Hadi/Lovable/hero video.mp4',
  scene2_beverage: 'C:/Users/Saraye Tel/Downloads/From Klickpin.com- 1111685489299993878-pin-id-1111685489299993878.mp4',
  scene3_automotive: path.join(root, 'temp_frames', 'lancia_stratos.webm'),
  scene4_web: webShowcasePath
};

console.log('Verifying source files exist:');
for (const [k, v] of Object.entries(sources)) {
  if (!fs.existsSync(v)) {
    throw new Error(`Missing source file for ${k}: ${v}`);
  }
  console.log(`- ${k}: OK (${v})`);
}

const outDir = path.join(root, 'public', 'videos');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const finalVideo = path.join(outDir, 'hero-showreel.mp4');
const posterImage = path.join(root, 'public', 'images', 'hero-poster.jpg');

const tempDir = path.join(root, 'temp_frames', 'segments');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

console.log('\n--- 1. Encoding Scene 1: Luxury Watch (0s - 4s) ---');
execSync(`ffmpeg -y -ss 00:00:06.0 -i "${sources.scene1_watch}" -t 4.0 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,eq=contrast=1.12:brightness=-0.02:saturation=1.1,vignette=PI/4" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -an "${path.join(tempDir, 'seg1.mp4')}"`, { stdio: 'inherit' });

console.log('\n--- 2. Encoding Scene 2: Beverage Commercial (4s - 8s) ---');
execSync(`ffmpeg -y -ss 00:00:00.5 -i "${sources.scene2_beverage}" -t 4.0 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,eq=contrast=1.15:brightness=0.0:saturation=1.2,vignette=PI/4.5" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -an "${path.join(tempDir, 'seg2.mp4')}"`, { stdio: 'inherit' });

console.log('\n--- 3. Encoding Scene 3: Automotive Commercial (8s - 12s) ---');
execSync(`ffmpeg -y -ss 00:00:01.5 -i "${sources.scene3_automotive}" -t 4.0 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,eq=contrast=1.25:brightness=-0.02:saturation=1.25,unsharp=5:5:1.0:5:5:0.0,vignette=PI/4" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -an "${path.join(tempDir, 'seg3.mp4')}"`, { stdio: 'inherit' });

console.log('\n--- 4. Encoding Scene 4: Web & Digital Showcase (12s - 16s) ---');
execSync(`ffmpeg -y -ss 00:00:01.0 -i "${sources.scene4_web}" -t 4.0 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,eq=contrast=1.1:saturation=1.1,vignette=PI/4.5" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -an "${path.join(tempDir, 'seg4.mp4')}"`, { stdio: 'inherit' });

console.log('\n--- 5. Concatenating into continuous 16.0s showreel ---');
const concatTxt = path.join(tempDir, 'concat.txt');
fs.writeFileSync(concatTxt, `file '${path.join(tempDir, 'seg1.mp4').replace(/\\/g, '/')}'\nfile '${path.join(tempDir, 'seg2.mp4').replace(/\\/g, '/')}'\nfile '${path.join(tempDir, 'seg3.mp4').replace(/\\/g, '/')}'\nfile '${path.join(tempDir, 'seg4.mp4').replace(/\\/g, '/')}'\n`);

execSync(`ffmpeg -y -f concat -safe 0 -i "${concatTxt}" -c copy -movflags +faststart "${finalVideo}"`, { stdio: 'inherit' });

console.log('\n--- 6. Extracting Poster Image at 2.0s ---');
execSync(`ffmpeg -y -ss 00:00:02.0 -i "${finalVideo}" -vframes 1 "${posterImage}"`, { stdio: 'inherit' });

console.log('\n--- 7. Synchronizing to dist folder ---');
const distVideos = path.join(root, 'dist', 'videos');
const distImages = path.join(root, 'dist', 'images');
if (!fs.existsSync(distVideos)) fs.mkdirSync(distVideos, { recursive: true });
if (!fs.existsSync(distImages)) fs.mkdirSync(distImages, { recursive: true });

fs.copyFileSync(finalVideo, path.join(distVideos, 'hero-showreel.mp4'));
fs.copyFileSync(posterImage, path.join(distImages, 'hero-poster.jpg'));

console.log('\n--- 8. Extracting frames for verification from each chapter ---');
const verifyDir = path.join(root, 'temp_frames', 'final_verification');
if (!fs.existsSync(verifyDir)) fs.mkdirSync(verifyDir, { recursive: true });

const checkTimes = [
  { name: 'scene1_watch_01s', t: '00:00:01.0' },
  { name: 'scene1_watch_03s', t: '00:00:03.0' },
  { name: 'scene2_beverage_05s', t: '00:00:05.0' },
  { name: 'scene2_beverage_07s', t: '00:00:07.0' },
  { name: 'scene3_automotive_09s', t: '00:00:09.0' },
  { name: 'scene3_automotive_11s', t: '00:00:11.0' },
  { name: 'scene4_web_13s', t: '00:00:13.0' },
  { name: 'scene4_web_15s', t: '00:00:15.0' },
];

for (const ct of checkTimes) {
  execSync(`ffmpeg -y -ss ${ct.t} -i "${finalVideo}" -vframes 1 "${path.join(verifyDir, ct.name + '.jpg')}"`);
  console.log(`Verified frame extracted: ${ct.name}.jpg`);
}

console.log('\nALL STEPS COMPLETED SUCCESSFULLY!');

