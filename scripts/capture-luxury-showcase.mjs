import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = path.resolve('public', 'luxury-showcase.html');
const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Saraye Tel\\.gemini\\antigravity\\brain\\e465f73f-35f9-4930-8ded-063d6f457b9f';
const outputPath = path.join(artifactDir, 'ultra-luxury-logo-presentation.png');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1340,1180',
  '--hide-scrollbars',
  `--screenshot=${outputPath}`,
  fileUrl
]);

chromeProc.on('close', (code) => {
  console.log(`Chrome screenshot exited with code ${code}`);
  if (fs.existsSync(outputPath)) {
    console.log(`Successfully generated artifact preview: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
  } else {
    console.error('Screenshot failed');
  }
});
