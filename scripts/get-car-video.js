import fs from 'fs';

async function main() {
  try {
    const res = await fetch('https://www.pexels.com/search/videos/sports%20car/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const matches = html.match(/https:\/\/[^"']+\.mp4[^"']*/g);
    console.log('Matches found:', matches ? matches.length : 0);
    if (matches) {
      console.log(matches.slice(0, 5));
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}
main();

