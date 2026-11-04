import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const EXAMPLE_DATA_FILE = path.join(__dirname, 'data', 'db.example.json');

// Ensure directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

export function readDB() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      if (fs.existsSync(EXAMPLE_DATA_FILE)) {
        console.log('[Database] db.json not found. Initializing from db.example.json...');
        fs.copyFileSync(EXAMPLE_DATA_FILE, DATA_FILE);
      } else {
        return null;
      }
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return null;
  }
}

export function writeDB(data) {
  try {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

