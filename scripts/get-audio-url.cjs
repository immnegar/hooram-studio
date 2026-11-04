const { execSync } = require('child_process');

async function getFileInfo(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime|size&format=json`;
  const cmd = `curl.exe -s -L -A "Mozilla/5.0" "${url}"`;
  const res = JSON.parse(execSync(cmd).toString());
  const pages = res.query.pages;
  const pageId = Object.keys(pages)[0];
  console.log(title, '->', pages[pageId].imageinfo[0].url);
  return pages[pageId].imageinfo[0].url;
}

async function run() {
  const url1 = await getFileInfo('File:Steve Combs - 10 - Ambient 507050.ogg');
  const url2 = await getFileInfo('File:Spiritual Ambient by MusicLFiles.ogg');
}

run();

