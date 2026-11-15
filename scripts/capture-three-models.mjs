import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = path.resolve('public', 'brand-identity', 'three-logo-models.html');
const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Saraye Tel\\.gemini\\antigravity\\brain\\e465f73f-35f9-4930-8ded-063d6f457b9f';
const outputPath = path.join(artifactDir, 'hooram-three-logo-models-comparison.png');
const publicPath = path.resolve('public', 'brand-identity', 'hooram-three-models.png');

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1400,1450',
  '--hide-scrollbars',
  `--screenshot=${outputPath}`,
  fileUrl
]);

chromeProc.on('close', (code) => {
  console.log(`Chrome screenshot exited with code ${code}`);
  if (fs.existsSync(outputPath)) {
    fs.copyFileSync(outputPath, publicPath);
    console.log(`Successfully generated artifact preview: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
    console.log(`Public copy: ${publicPath}`);
  } else {
    console.error('Screenshot failed to write to:', outputPath);
  }
});
