import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const smoDir = 'D:/Hadi/Ai Ads/SMO/Video';
if (fs.existsSync(smoDir)) {
  const files = fs.readdirSync(smoDir).filter(f => f.endsWith('.mp4'));
  files.forEach((f, idx) => {
    try {
      execSync(`ffmpeg -y -ss 00:00:01 -i "${path.join(smoDir, f)}" -vframes 1 "C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/smo_raw_${idx}.jpg"`);
      console.log(`Extracted smo_raw_${idx} for ${f}`);
    } catch (e) {
      console.error(e.message);
    }
  });
}

