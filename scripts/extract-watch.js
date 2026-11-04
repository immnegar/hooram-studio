import { execSync } from 'child_process';

['12', '16', '20'].forEach(s => {
  execSync(`ffmpeg -y -ss 00:00:${s} -i "D:/Hadi/Lovable/hero video.mp4" -vframes 1 "C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/watch_${s}s.jpg"`);
});
console.log('Extracted watch frames');

