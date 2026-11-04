import fs from 'fs';
import path from 'path';

const keywords = ['car', 'auto', 'drive', 'speed', 'bmw', 'benz', 'porsche', 'audi', 'vehicle', 'road', 'honda', 'toyota', 'motor', 'sport', 'race', 'track'];

function search(dir, depth = 0) {
  if (depth > 5) return;
  try {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const full = path.join(dir, item.name);
      if (item.isDirectory() && !item.name.startsWith('$') && !item.name.startsWith('.')) {
        search(full, depth + 1);
      } else if (item.isFile()) {
        const lower = item.name.toLowerCase();
        if (lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm') || lower.endsWith('.mkv') || lower.endsWith('.avi')) {
          if (keywords.some(k => lower.includes(k))) {
            console.log(`[MATCH] ${item.name} | ${full}`);
          }
        }
      }
    }
  } catch (e) {}
}

console.log('Searching D:/ ...');
search('D:/');
console.log('Finished.');

