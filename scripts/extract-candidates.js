import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const assets = [
  { name: 'beverage_can_2s', path: 'C:/Users/Saraye Tel/Downloads/Beverage_can_commercial_sequence_720p_20260921011254.mp4', time: '00:00:02' },
  { name: 'strawberry_fizz_2s', path: 'C:/Users/Saraye Tel/Downloads/Strawberry_fizz_commercial_shot_720p_20261020222551.mp4', time: '00:00:02' },
  { name: 'skincare_cream_5s', path: 'C:/Users/Saraye Tel/Downloads/Model_applying_cream_from_jar_20261021005009.mp4', time: '00:00:05' },
  { name: 'blueberry_morph_2s', path: 'C:/Users/Saraye Tel/Downloads/Blueberries_morph_into_bottle_20260912192809.mp4', time: '00:00:02' },
  { name: 'bottle_seeds_2s', path: 'C:/Users/Saraye Tel/Downloads/Bottle_emerging_from_floating_seeds_20260912193932.mp4', time: '00:00:02' },
  { name: 'hoka_running_2s', path: 'C:/Users/Saraye Tel/Downloads/New folder (2)/HOKA_running_shoe_video_production_202608210011.mp4', time: '00:00:02' },
  { name: 'nike_spec_2s', path: "C:/Users/Saraye Tel/Downloads/New folder (2)/Hoka/Nike - Running Isn't Just Running _ Spec Ad.mp4", time: '00:00:05' },
  { name: 'opening_luxury_drink', path: 'C:/Users/Saraye Tel/Downloads/New folder (2)/Opening_luxury_blueberry_drink_b…_202608312037.mp4', time: '00:00:02' },
  { name: 'screen_recording', path: 'C:/Users/Saraye Tel/Videos/Screen Recordings/Screen Recording 2026-11-01 152319.mp4', time: '00:00:05' }
];

const outDir = 'C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const a of assets) {
  if (fs.existsSync(a.path)) {
    try {
      execSync(`ffmpeg -y -ss ${a.time} -i "${a.path}" -vframes 1 "${outDir}/${a.name}.jpg"`);
      console.log(`Extracted ${a.name}`);
    } catch (e) {
      console.log(`Failed for ${a.name}: ${e.message}`);
    }
  } else {
    console.log(`Not found: ${a.path}`);
  }
}
