import { execSync } from 'child_process';

const times = ['10', '20', '30', '40', '50', '60', '70', '80'];
times.forEach(t => {
  try {
    execSync(`ffmpeg -y -ss 00:00:${t} -i "C:/Users/Saraye Tel/Downloads/ANOMALY.mp4" -vframes 1 "C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/anomaly_${t}s.jpg"`);
    console.log(`Extracted anomaly_${t}s`);
  } catch (e) {
    console.error(e.message);
  }
});

