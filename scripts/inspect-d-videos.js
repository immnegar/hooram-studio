import { execSync } from 'child_process';

const list = [
  { file: 'D:/Hadi/Lovable/hero video.mp4', time: '00:00:03', out: 'lovable_hero_3s.jpg' },
  { file: 'D:/Hadi/Lovable/hero video.mp4', time: '00:00:08', out: 'lovable_hero_8s.jpg' },
  { file: 'D:/Hadi/Lovable/hero video.mp4', time: '00:00:15', out: 'lovable_hero_15s.jpg' },
  { file: 'D:/Hadi/Ai Ads/SMO/Project_Edit/video_merged.mp4', time: '00:00:03', out: 'smo_merged_3s.jpg' },
  { file: 'D:/Hadi/Ai Ads/Everything people/Everything people.mp4', time: '00:00:03', out: 'everything_3s.jpg' }
];

for (const item of list) {
  try {
    execSync(`ffmpeg -y -ss ${item.time} -i "${item.file}" -vframes 1 "C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/${item.out}"`);
    console.log(`Extracted ${item.out}`);
  } catch (e) {
    console.error(`Failed ${item.out}:`, e.message);
  }
}

