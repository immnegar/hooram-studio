import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const dir = 'C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/rec';
const file = fs.readdirSync(dir).find(x => x.endsWith('.webm'));
const videoPath = path.join(dir, file);
const out = 'C:/Users/Saraye Tel/.gemini/antigravity/scratch/hooram-studio/temp_frames/web_showcase_2s.jpg';

execSync(`ffmpeg -y -ss 00:00:02 -i "${videoPath}" -vframes 1 "${out}"`);
console.log('Extracted web frame to', out);

