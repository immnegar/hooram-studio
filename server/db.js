import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const EXAMPLE_DATA_FILE = path.join(__dirname, 'data', 'db.example.json');

// Ensure directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

/**
 * Validates the core schema of the Hooram Studio database object.
 * @param {object} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateDBSchema(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['Database root must be a valid JSON object.'] };
  }

  // Admin validation
  if (!data.admin || typeof data.admin !== 'object') {
    errors.push('Missing or invalid "admin" object.');
  } else {
    if (!data.admin.email || typeof data.admin.email !== 'string') {
      errors.push('Admin object is missing valid "email".');
    }
    if (!data.admin.passwordHash || typeof data.admin.passwordHash !== 'string') {
      errors.push('Admin object is missing valid "passwordHash".');
    }
  }

  // Arrays validation
  if (!Array.isArray(data.services)) errors.push('"services" must be an array.');
  if (!Array.isArray(data.portfolio)) errors.push('"portfolio" must be an array.');
  if (!Array.isArray(data.inquiries)) errors.push('"inquiries" must be an array.');

  // Settings validation
  if (!data.settings || typeof data.settings !== 'object') {
    errors.push('Missing or invalid "settings" object.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Safely reads the database file synchronously.
 * @returns {object|null}
 */
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

/**
 * Concurrency-safe atomic write to db.json with retry handling.
 * @param {object} data
 * @returns {boolean}
 */
export function writeDB(data) {
  try {
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}.${Math.floor(Math.random() * 10000)}`;
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempFile, jsonString, 'utf-8');

    // Atomic rename with retries for Windows filesystem locks (e.g. EBUSY)
    let retries = 5;
    let success = false;
    let lastError = null;

    while (retries > 0) {
      try {
        fs.renameSync(tempFile, DATA_FILE);
        success = true;
        break;
      } catch (err) {
        lastError = err;
        retries--;
        // Sleep 15ms synchronously
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 15);
      }
    }

    if (!success) {
      // Clean up orphaned temp file if rename failed
      try { fs.unlinkSync(tempFile); } catch (_) {}
      console.error('Error writing database (atomic rename failed):', lastError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

/**
 * Safely acquires an in-memory, validated, deep-cloned snapshot of the database.
 * Guarantees that the snapshot is consistent, schema-validated, and immutable.
 * @returns {{ success: boolean, data?: object, rawJson?: string, checksum?: string, timestamp?: string, error?: string }}
 */
export function snapshotDB() {
  try {
    const db = readDB();
    if (!db) {
      return { success: false, error: 'Database could not be read or does not exist.' };
    }

    const validation = validateDBSchema(db);
    if (!validation.valid) {
      return {
        success: false,
        error: `Database schema validation failed: ${validation.errors.join(', ')}`
      };
    }

    const rawJson = JSON.stringify(db, null, 2);
    const checksum = crypto.createHash('sha256').update(rawJson, 'utf-8').digest('hex');
    const timestamp = new Date().toISOString();

    return {
      success: true,
      data: JSON.parse(rawJson), // Deep-cloned object
      rawJson,
      checksum,
      timestamp,
      stats: {
        servicesCount: db.services.length,
        portfolioCount: db.portfolio.length,
        inquiriesCount: db.inquiries.length,
        byteLength: Buffer.byteLength(rawJson, 'utf-8')
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Safely restores the database from a validated object.
 * Always creates a safety backup of the existing db.json before overwriting.
 * @param {object} newDBData
 * @param {boolean} [createBackupCopy=true]
 * @returns {{ success: boolean, backupPath?: string, error?: string }}
 */
export function restoreDBSafely(newDBData, createBackupCopy = true) {
  try {
    const validation = validateDBSchema(newDBData);
    if (!validation.valid) {
      return {
        success: false,
        error: `Cannot restore: Data schema validation failed: ${validation.errors.join(', ')}`
      };
    }

    let backupPath = null;
    if (createBackupCopy && fs.existsSync(DATA_FILE)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      backupPath = `${DATA_FILE}.pre-restore-${timestamp}.bak`;
      fs.copyFileSync(DATA_FILE, backupPath);
    }

    const writeSuccess = writeDB(newDBData);
    if (!writeSuccess) {
      return { success: false, error: 'Failed to write restored data to db.json.' };
    }

    return {
      success: true,
      backupPath
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
