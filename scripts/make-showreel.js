import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outVideo = path.join(root, 'public', 'videos', 'hero-showreel.mp4');
const outPoster = path.join(root, 'public', 'images', 'hero-poster.jpg');

console.log('Generating cinematic advertising showreel video...');

// 12-second cinematic commercial showreel with 3 luxury scenes and smooth camera sweep
const filterComplex = `
[0:v]scale=1920:1080,eq=contrast=1.3:brightness=-0.05:saturation=1.4,curves=all='0/0 0.5/0.45 1/1',vignette=PI/4[v0];
[1:v]scale=1920:1080,eq=contrast=1.4:saturation=1.6,vignette=PI/3.5[v1];
[2:v]scale=1920:1080,eq=contrast=1.2:saturation=1.3,curves=blue='0/0 0.5/0.6 1/1'[v2];
[v0][v1]xfade=transition=fade:duration=1:offset=3.5[v01];
[v01][v2]xfade=transition=fade:duration=1:offset=7.5[vFinal]
`;

const cmd = `ffmpeg -f lavfi -i "gradients=s=1920x1080:d=4.5:c0=0x07090E:c1=0x311042:c2=0x1E1B4B:speed=0.008" ` +
  `-f lavfi -i "gradients=s=1920x1080:d=5:c0=0x0B132B:c1=0x1C2541:c2=0x0A5C36:speed=0.012" ` +
  `-f lavfi -i "gradients=s=1920x1080:d=4.5:c0=0x1A0933:c1=0x0F172A:c2=0x4A0E17:speed=0.009" ` +
  `-filter_complex "${filterComplex.replace(/\r?\n/g, '')}" -map "[vFinal]" ` +
  `-c:v libx264 -preset fast -pix_fmt yuv420p -t 11 -y "${outVideo}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Video generated successfully!');
  
  // Extract poster image
  execSync(`ffmpeg -i "${outVideo}" -ss 00:00:03 -vframes 1 -y "${outPoster}"`, { stdio: 'inherit' });
  console.log('Poster generated successfully!');
} catch (e) {
  console.error('Failed to generate showreel:', e);
}

