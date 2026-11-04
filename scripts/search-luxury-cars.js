import fs from 'fs';
import { execSync } from 'child_process';

const cats = [
  'Category:Videos_of_sports_cars',
  'Category:Videos_of_Porsche',
  'Category:Videos_of_Audi',
  'Category:Videos_of_BMW_vehicles',
  'Category:Videos_of_Mercedes-Benz_vehicles'
];

for (const c of cats) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${c}&gcmtype=file&gcmlimit=10&prop=imageinfo&iiprop=url|size|duration&format=json`;
    const raw = execSync(`curl.exe -s "${url}"`).toString();
    const data = JSON.parse(raw);
    const pages = data.query ? data.query.pages : {};
    console.log(`=== ${c} (${Object.keys(pages).length} files) ===`);
    for (const pid in pages) {
      const p = pages[pid];
      const info = p.imageinfo ? p.imageinfo[0] : null;
      if (info && info.url) {
        const mb = (info.size / (1024*1024)).toFixed(1);
        const dur = info.duration ? info.duration.toFixed(1) + 's' : 'unk';
        console.log(`  ${p.title} | ${dur} | ${mb} MB | ${info.url.split('?')[0]}`);
      }
    }
  } catch (e) {
    console.error(c, e.message);
  }
}

