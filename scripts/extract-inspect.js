import { execSync } from 'child_process';

const list = [
  { file: 'C:/Users/Saraye Tel/Desktop/hero-video-scroll.mp4', time: '00:00:04', out: 'scroll_4s.jpg' },
  { file: 'C:/Users/Saraye Tel/Desktop/hero-video-scroll.mp4', time: '00:00:08', out: 'scroll_8s.jpg' },
  { file: 'C:/Users/Saraye Tel/Downloads/New folder (2)/Hoka/Introducing_ Speedgoat 6.mp4', time: '00:00:03', out: 'speedgoat_3s.jpg' },
  { file: 'C:/Users/Saraye Tel/Downloads/New folder (2)/Hoka/Introducing_ Speedgoat 6.mp4', time: '00:00:08', out: 'speedgoat_8s.jpg' }
];

for (const item of list) {
  try {
    execSync(`ffmpeg -y -ss ${item.time} -i "${item.file}" -vframes 1 "C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/${item.out}"`);
    console.log(`Extracted ${item.out}`);
  } catch (e) {
    console.error(`Failed ${item.out}:`, e.message);
  }
}

