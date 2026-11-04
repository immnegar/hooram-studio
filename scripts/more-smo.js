import { execSync } from 'child_process';
[1, 2, 3, 4, 5].forEach(i => {
  try {
    execSync(`ffmpeg -y -ss 00:00:02 -i "D:/Hadi/Ai Ads/SMO/Video/0${i+1}.mp4" -vframes 1 "C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/smo_raw_${i}.jpg"`);
  } catch (e) {}
});
console.log('Extracted more smo');

