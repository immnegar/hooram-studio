const { execSync } = require('child_process');

async function searchWikimedia() {
  const query = 'ambient electronic music';
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}+filetype:audio&srnamespace=6&format=json`;
  
  try {
    const cmd = `curl.exe -s -L -A "Mozilla/5.0" "${url}"`;
    const res = JSON.parse(execSync(cmd).toString());
    console.log('Results:', JSON.stringify(res.query.search.slice(0, 8), null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

searchWikimedia();

