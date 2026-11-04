import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const files = [
  'C:/Users/Saraye Tel/Downloads/55263eed477e346dd399c18fbd49fb2b72689658-1080p.mp4',
  'C:/Users/Saraye Tel/Downloads/9155ec81841c2e4acc20a249038e3e32_720w.mp4',
  'C:/Users/Saraye Tel/Downloads/From Klickpin.com- 1111685489299993878-pin-id-1111685489299993878.mp4',
  'C:/Users/Saraye Tel/Downloads/HOKA_running_shoe_video_production_202608210011.mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/HOKA_running_shoe_video_production_202608210011.mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Creating_beverage_commercial_scene_202608312034.mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Hand_opening_triangular_package_…_202609041829.mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Untitled video.mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/hero video/hero Video.mp4'
];

const outDir = 'C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames';

for (let i = 0; i < files.length; i++) {
  const f = files[i];
  if (fs.existsSync(f)) {
    try {
      execSync(`ffmpeg -y -ss 00:00:02 -i "${f}" -vframes 1 "${outDir}/extra_${i}.jpg"`);
      console.log(`Extracted extra_${i} for ${path.basename(f)}`);
    } catch (e) {
      console.log(`Error on ${f}: ${e.message}`);
    }
  } else {
    // Try wildcards
    const dir = path.dirname(f);
    const pattern = path.basename(f).replace('…', '');
    try {
      const matched = fs.readdirSync(dir).filter(x => x.startsWith(pattern.substring(0, 15)));
      if (matched.length > 0) {
        const full = path.join(dir, matched[0]);
        execSync(`ffmpeg -y -ss 00:00:02 -i "${full}" -vframes 1 "${outDir}/extra_${i}.jpg"`);
        console.log(`Matched and extracted extra_${i} for ${matched[0]}`);
      }
    } catch (e) {
      console.log(`Error searching: ${e.message}`);
    }
  }
}

