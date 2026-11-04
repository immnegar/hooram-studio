import fs from 'fs';
import { execSync } from 'child_process';

const url = "https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Videos_of_automobiles&gcmtype=file&gcmlimit=25&prop=imageinfo&iiprop=url|size|duration&format=json";

try {
  const raw = execSync(`curl.exe -s "${url}"`).toString();
  const data = JSON.parse(raw);
  const pages = data.query ? data.query.pages : {};
  console.log(`Found ${Object.keys(pages).length} pages:`);
  for (const pid in pages) {
    const p = pages[pid];
    const info = p.imageinfo ? p.imageinfo[0] : null;
    if (info && info.url) {
      const mb = (info.size / (1024*1024)).toFixed(1);
      const dur = info.duration ? info.duration.toFixed(1) + 's' : 'unknown';
      console.log(`- ${p.title} | ${dur} | ${mb} MB | ${info.url.split('?')[0]}`);
    }
  }
} catch (e) {
  console.error('Error:', e.message);
}
