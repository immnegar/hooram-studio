import { execSync } from 'child_process';

const list = [
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Untitled video (2).mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Untitled video (3).mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Untitled video (4).mp4',
  'C:/Users/Saraye Tel/Downloads/New folder (2)/Hoka/3236abe9-90c6-4a8f-ad19-19f83a35b8c8.mp4'
];

list.forEach((f, idx) => {
  try {
    execSync(`ffmpeg -y -ss 00:00:02 -i "${f}" -vframes 1 "C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/untitled_${idx+2}.jpg"`);
    console.log(`Extracted untitled_${idx+2}`);
  } catch (e) {
    console.error(e.message);
  }
});

