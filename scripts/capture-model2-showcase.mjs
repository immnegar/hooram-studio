import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Saraye Tel\\.gemini\\antigravity\\brain\\e465f73f-35f9-4930-8ded-063d6f457b9f';
const showcaseHtml = path.resolve('public', 'brand-identity', 'model-2', 'showcase.html');
const showcaseUrl = 'file:///' + showcaseHtml.replace(/\\/g, '/');

const artifactScreenshot = path.join(artifactDir, 'model-2-infinisun-presentation.png');
const publicScreenshot = path.resolve('public', 'brand-identity', 'model-2', 'model-2-presentation.png');

console.log('Capturing Model 2 showcase with Chrome...');

const proc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1380,1380',
  '--hide-scrollbars',
  `--screenshot=${artifactScreenshot}`,
  showcaseUrl
]);

proc.on('close', (code) => {
  console.log(`Chrome screenshot exit code: ${code}`);
  if (fs.existsSync(artifactScreenshot)) {
    fs.copyFileSync(artifactScreenshot, publicScreenshot);
    console.log(`Artifact screenshot created: ${artifactScreenshot} (${fs.statSync(artifactScreenshot).size} bytes)`);
    console.log(`Public screenshot created: ${publicScreenshot}`);
  } else {
    console.error('Screenshot failed to write');
  }
});
