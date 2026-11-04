import fs from 'fs';
import path from 'path';

function findVideos(dir, list = [], depth = 0) {
  if (depth > 4) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('$') && !e.name.startsWith('.')) {
        findVideos(full, list, depth + 1);
      } else if (e.isFile() && e.name.toLowerCase().endsWith('.mp4')) {
        const stat = fs.statSync(full);
        list.push({ path: full, name: e.name, size: stat.size });
      }
    }
  } catch (err) {}
}

const list = [];
findVideos('D:/', list);
console.log(`Found ${list.length} MP4 files on D:`);
for (const v of list.slice(0, 50)) {
  console.log(`${(v.size / (1024*1024)).toFixed(1)} MB | ${v.name} | ${v.path}`);
}

