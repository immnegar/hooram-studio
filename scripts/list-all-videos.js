import fs from 'fs';
import path from 'path';

function findVideos(dir, list = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!e.name.startsWith('.') && e.name !== 'node_modules') {
          findVideos(full, list);
        }
      } else if (e.isFile() && e.name.toLowerCase().endsWith('.mp4')) {
        const stat = fs.statSync(full);
        list.push({ path: full, name: e.name, size: stat.size });
      }
    }
  } catch (err) {}
  return list;
}

const dirs = [
  'C:/Users/Saraye Tel/Downloads',
  'C:/Users/Saraye Tel/Desktop',
  'C:/Users/Saraye Tel/Videos'
];

let all = [];
for (const d of dirs) {
  findVideos(d, all);
}

console.log(`Found ${all.length} MP4 files:`);
all.sort((a,b) => b.size - a.size);
for (const v of all) {
  console.log(`${(v.size / (1024*1024)).toFixed(1)} MB | ${v.name} | ${v.path}`);
}

