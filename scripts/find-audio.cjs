const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'C:/Users/Saraye Tel/Downloads';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));
for (const f of files) {
  try {
    const full = path.join(dir, f);
    const out = execSync(`"C:/Users/Saraye Tel/.local/bin/ffprobe.exe" -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "${full}"`).toString().trim();
    if (out) console.log(f, '-> AUDIO:', out);
  } catch(e) {}
}

