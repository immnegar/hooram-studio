import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const files = [
  'C:/Users/Saraye Tel/Downloads/New folder (2)/hero video/hero Video.mp4',
  'C:/Users/Saraye Tel/Desktop/hero-video-scroll.mp4',
  'C:/Users/Saraye Tel/Desktop/4_5945129838913265439.mp4',
  'C:/Users/Saraye Tel/Downloads/Model_applying_cream_from_jar_20261021005009.mp4',
  'C:/Users/Saraye Tel/Downloads/Model_applying_skincare_product_720p_20261020232903.mp4',
  'C:/Users/Saraye Tel/Downloads/Beverage_can_commercial_sequence_720p_20260921011254.mp4',
  'C:/Users/Saraye Tel/Downloads/Strawberry_fizz_commercial_shot_720p_20261020222551.mp4',
  'C:/Users/Saraye Tel/Downloads/Bottle_emerging_from_floating_seeds_20260912193932.mp4',
  'C:/Users/Saraye Tel/Downloads/ANOMALY.mp4',
  'C:/Users/Saraye Tel/Downloads/Creating_motion_graphic_video_720p_20261005223541.mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Hailuo_Video_A slow, ultra-cinematic 6-seco_537877393357852677.mp4'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    try {
      const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -show_entries format=duration -of json "${f}"`).toString();
      const data = JSON.parse(probe);
      const stream = data.streams[0];
      const dur = data.format.duration;
      console.log(`[FOUND] ${path.basename(f)}`);
      console.log(`  Res: ${stream.width}x${stream.height}, FPS: ${stream.r_frame_rate}, Dur: ${dur}s`);
    } catch (e) {
      console.log(`[ERROR] ${f}: ${e.message}`);
    }
  } else {
    console.log(`[MISSING] ${f}`);
  }
}

