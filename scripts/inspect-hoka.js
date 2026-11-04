import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const hokaDir = 'C:/Users/Saraye Tel/Downloads/New folder (2)/Hoka';
const files = [
  'C:/Users/Saraye Tel/Downloads/aUV8ev6EW5OFkgIrPKVly_alligator.mp4',
  'C:/Users/Saraye Tel/Downloads/g2n6Zapk8nj88Biy4U8tC_alligator.mp4',
  'C:/Users/Saraye Tel/Desktop/hero-video-scroll.mp4',
  path.join(hokaDir, 'Introducing_ Speedgoat 6.mp4')
];

// Add first 6 files from Hoka folder
if (fs.existsSync(hokaDir)) {
  const hokaFiles = fs.readdirSync(hokaDir).filter(f => f.endsWith('.mp4')).slice(0, 6);
  for (const f of hokaFiles) {
    files.push(path.join(hokaDir, f));
  }
}

const outDir = 'C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames';

files.forEach((f, idx) => {
  if (fs.existsSync(f)) {
    try {
      execSync(`ffmpeg -y -ss 00:00:02 -i "${f}" -vframes 1 "${outDir}/hoka_${idx}.jpg"`);
      console.log(`Extracted hoka_${idx} for ${path.basename(f)}`);
    } catch (e) {
      console.log(`Error ${f}: ${e.message}`);
    }
  }
});

