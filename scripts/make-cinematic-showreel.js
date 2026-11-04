import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outVideo = path.join(root, 'public', 'videos', 'hero-showreel.mp4');
const outPoster = path.join(root, 'public', 'images', 'hero-poster.jpg');
const distVideo = path.join(root, 'dist', 'videos', 'hero-showreel.mp4');
const distPoster = path.join(root, 'dist', 'images', 'hero-poster.jpg');

console.log('Rendering high-impact cinematic advertising showreel with FFmpeg...');

// 4 distinct high-energy advertising scenes:
// 1. Luxury Gold / Perfume Commercial (Warm amber gold light streaks)
// 2. Neon Cyber / Beverage Commercial (Vibrant cyan/magenta pulse)
// 3. Automotive / High speed racing (Electric blue & white streaks)
// 4. Digital Experience / Modern Web (Deep emerald and violet grid)

const filterGraph = `
[0:v]scale=1920:1080,eq=contrast=1.5:brightness=0.02:saturation=1.8,
drawtext=text='HOORAM ADVERTISING STUDIO':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=h*0.38:box=1:boxcolor=black@0.6:boxborderw=16,
drawtext=text='SHOWREEL 2026  |  4K CINEMA MASTER':fontcolor=0xE0B84C:fontsize=24:x=(w-text_w)/2:y=h*0.52:box=1:boxcolor=black@0.6:boxborderw=10,
drawtext=text='SCENE 01 / LUXURY COMMERCIALS':fontcolor=white:fontsize=18:x=80:y=80,
drawtext=text='REC [4K 60FPS]':fontcolor=0xFF3333:fontsize=20:x=w-260:y=80[s1];

[1:v]scale=1920:1080,eq=contrast=1.6:brightness=0.03:saturation=2.0,
drawtext=text='TONDAR VIBE // PRODUCT COMMERCIAL':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=h*0.42:box=1:boxcolor=black@0.6:boxborderw=16,
drawtext=text='DYNAMIC PRODUCT CINEMATOGRAPHY':fontcolor=0x00F0FF:fontsize=22:x=(w-text_w)/2:y=h*0.54:box=1:boxcolor=black@0.6:boxborderw=10,
drawtext=text='SCENE 02 / PRODUCT COMMERCIAL':fontcolor=white:fontsize=18:x=80:y=80,
drawtext=text='REC [4K 60FPS]':fontcolor=0xFF3333:fontsize=20:x=w-260:y=80[s2];

[2:v]scale=1920:1080,eq=contrast=1.5:saturation=1.8,
drawtext=text='TOUSAN GT // AUTOMOTIVE COMMERCIAL':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=h*0.42:box=1:boxcolor=black@0.6:boxborderw=16,
drawtext=text='HIGH SPEED MOTION & SOUND DESIGN':fontcolor=0x818CF8:fontsize=22:x=(w-text_w)/2:y=h*0.54:box=1:boxcolor=black@0.6:boxborderw=10,
drawtext=text='SCENE 03 / AUTOMOTIVE & BRAND FILMS':fontcolor=white:fontsize=18:x=80:y=80,
drawtext=text='REC [4K 60FPS]':fontcolor=0xFF3333:fontsize=20:x=w-260:y=80[s3];

[3:v]scale=1920:1080,eq=contrast=1.4:saturation=1.6,
drawtext=text='DIGITAL EXPERIENCES & WEB ENGINEERING':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=h*0.42:box=1:boxcolor=black@0.6:boxborderw=16,
drawtext=text='BESPOKE UI/UX & E-COMMERCE PLATFORMS':fontcolor=0x34D399:fontsize=22:x=(w-text_w)/2:y=h*0.54:box=1:boxcolor=black@0.6:boxborderw=10,
drawtext=text='SCENE 04 / WEB & DIGITAL PLATFORMS':fontcolor=white:fontsize=18:x=80:y=80,
drawtext=text='REC [4K 60FPS]':fontcolor=0xFF3333:fontsize=20:x=w-260:y=80[s4];

[s1][s2]xfade=transition=wipeleft:duration=0.5:offset=3.5[v12];
[v12][s3]xfade=transition=wiperight:duration=0.5:offset=7.0[v23];
[v23][s4]xfade=transition=circleopen:duration=0.5:offset=10.5[vFinal]
`;

const cmd = `ffmpeg ` +
  `-f lavfi -i "gradients=s=1920x1080:d=4:c0=0x08080C:c1=0xC2850C:c2=0x3D1B02:speed=0.02" ` +
  `-f lavfi -i "gradients=s=1920x1080:d=4:c0=0x050C1A:c1=0x00E5FF:c2=0x6B0099:speed=0.025" ` +
  `-f lavfi -i "gradients=s=1920x1080:d=4:c0=0x070A1E:c1=0x2563EB:c2=0x6D28D9:speed=0.03" ` +
  `-f lavfi -i "gradients=s=1920x1080:d=4:c0=0x031410:c1=0x059669:c2=0x0F766E:speed=0.02" ` +
  `-filter_complex "${filterGraph.replace(/\r?\n/g, '')}" -map "[vFinal]" ` +
  `-c:v libx264 -preset fast -pix_fmt yuv420p -t 14 -y "${outVideo}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Showreel generated at:', outVideo);

  // Generate crisp poster
  execSync(`ffmpeg -i "${outVideo}" -ss 00:00:02 -vframes 1 -y "${outPoster}"`, { stdio: 'inherit' });
  console.log('Poster generated at:', outPoster);

  // Copy to dist as well
  if (fs.existsSync(path.dirname(distVideo))) {
    fs.copyFileSync(outVideo, distVideo);
    fs.copyFileSync(outPoster, distPoster);
    console.log('Synced to dist folder successfully!');
  }
} catch (e) {
  console.error('Error generating showreel:', e);
}

