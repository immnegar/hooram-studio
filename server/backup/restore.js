import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { config } from './config.js';
import { logger } from './logger.js';
import { decryptBuffer } from './crypto.js';
import { validateDBSchema, restoreDBSafely } from '../db.js';
import { unpackTarGz } from './tarUtil.js';

/**
 * Finds the latest backup file in a given directory.
 */
export function findLatestBackup(directory) {
  if (!fs.existsSync(directory)) return null;
  const files = fs.readdirSync(directory)
    .filter((f) => f.endsWith('.enc') || f.endsWith('.json.gz') || f.endsWith('.tar.gz'))
    .map((f) => {
      const fullPath = path.join(directory, f);
      return {
        filename: f,
        fullPath,
        mtime: fs.statSync(fullPath).mtimeMs
      };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0] : null;
}

/**
 * Restores the database from a backup archive.
 * @param {string} archivePath
 * @param {object} [options={}]
 * @param {string} [options.encryptionKey=config.encryptionKey]
 * @param {boolean} [options.confirm=false] Required if restoring to live production database
 * @param {string} [options.targetDir=null] If set, restores safely to a custom test/staging directory
 */
export async function restoreDatabase(archivePath, options = {}) {
  const encKey = options.encryptionKey || config.encryptionKey;
  logger.info(`[Database Restore] Preparing restoration from: ${archivePath}`);

  if (!fs.existsSync(archivePath)) {
    throw new Error(`Backup archive not found at path: ${archivePath}`);
  }

  // 1. Read archive buffer
  const rawBuffer = fs.readFileSync(archivePath);

  // 2. Decrypt if encrypted (.enc)
  let decompressedJsonBuffer;
  if (archivePath.endsWith('.enc')) {
    if (!encKey) {
      throw new Error('Cannot restore encrypted archive: BACKUP_ENCRYPTION_KEY is not provided.');
    }
    logger.info('[Database Restore] Decrypting AES-256-GCM encrypted archive...');
    const decryptedGz = decryptBuffer(rawBuffer, encKey);
    logger.info('[Database Restore] Decompressing gzip payload...');
    decompressedJsonBuffer = zlib.gunzipSync(decryptedGz);
  } else if (archivePath.endsWith('.gz')) {
    logger.info('[Database Restore] Decompressing gzip payload...');
    decompressedJsonBuffer = zlib.gunzipSync(rawBuffer);
  } else {
    decompressedJsonBuffer = rawBuffer;
  }

  // 3. Parse JSON and validate schema
  const jsonString = decompressedJsonBuffer.toString('utf8');
  let restoredData;
  try {
    restoredData = JSON.parse(jsonString);
  } catch (err) {
    throw new Error(`Corrupted backup archive: Invalid JSON payload (${err.message})`);
  }

  const validation = validateDBSchema(restoredData);
  if (!validation.valid) {
    throw new Error(`Archive failed schema validation: ${validation.errors.join(', ')}`);
  }

  logger.info('[Database Restore] Schema validation PASSED successfully.');

  // 4. If targetDir is specified (safe test mode or custom destination)
  if (options.targetDir) {
    const destPath = path.join(options.targetDir, 'db.json');
    if (!fs.existsSync(options.targetDir)) {
      fs.mkdirSync(options.targetDir, { recursive: true });
    }
    fs.writeFileSync(destPath, jsonString, 'utf8');
    logger.success(`[Database Restore] [TEST MODE] Restored database safely to custom destination: ${destPath}`);
    return {
      success: true,
      mode: 'test',
      destPath,
      stats: {
        servicesCount: restoredData.services.length,
        portfolioCount: restoredData.portfolio.length,
        inquiriesCount: restoredData.inquiries.length
      }
    };
  }

  // 5. Restoring to LIVE database
  if (!options.confirm) {
    throw new Error('SAFETY ABORT: Restoring to live database requires explicit confirmation flag (--confirm). Live database was untouched.');
  }

  logger.warn('[Database Restore] Overwriting LIVE production database. Creating pre-restore backup first...');
  const restoreResult = restoreDBSafely(restoredData, true);

  if (!restoreResult.success) {
    throw new Error(`Failed to restore database: ${restoreResult.error}`);
  }

  logger.success(`[Database Restore] LIVE Database successfully restored! Pre-restore safety backup: ${restoreResult.backupPath}`);

  return {
    success: true,
    mode: 'live',
    safetyBackupPath: restoreResult.backupPath,
    stats: {
      servicesCount: restoredData.services.length,
      portfolioCount: restoredData.portfolio.length,
      inquiriesCount: restoredData.inquiries.length
    }
  };
}

/**
 * Restores uploaded media from an archive.
 * @param {string} archivePath
 * @param {object} [options={}]
 * @param {string} [options.encryptionKey=config.encryptionKey]
 * @param {boolean} [options.confirm=false] Required if restoring to live public/uploads
 * @param {string} [options.targetDir=null] If set, restores safely to custom test directory
 */
export async function restoreUploads(archivePath, options = {}) {
  const encKey = options.encryptionKey || config.encryptionKey;
  logger.info(`[Uploads Restore] Preparing media restoration from: ${archivePath}`);

  if (!fs.existsSync(archivePath)) {
    throw new Error(`Media backup archive not found at path: ${archivePath}`);
  }

  // 1. Read archive buffer
  const rawBuffer = fs.readFileSync(archivePath);

  // 2. Decrypt if encrypted (.enc)
  let tarGzBuffer;
  if (archivePath.endsWith('.enc')) {
    if (!encKey) {
      throw new Error('Cannot restore encrypted media archive: BACKUP_ENCRYPTION_KEY is not provided.');
    }
    logger.info('[Uploads Restore] Decrypting AES-256-GCM encrypted media archive...');
    tarGzBuffer = decryptBuffer(rawBuffer, encKey);
  } else {
    tarGzBuffer = rawBuffer;
  }

  // 3. Determine target directory
  const isLive = !options.targetDir;
  const destination = options.targetDir ? path.resolve(options.targetDir) : config.uploadsDir;

  if (isLive && !options.confirm) {
    throw new Error('SAFETY ABORT: Restoring to live uploads folder requires explicit confirmation flag (--confirm). Live files were untouched.');
  }

  logger.info(`[Uploads Restore] Extracting files into: ${destination}`);
  const unpackResult = unpackTarGz(tarGzBuffer, destination);

  logger.success(`[Uploads Restore] Successfully extracted ${unpackResult.count} media files to ${destination}`);

  return {
    success: true,
    targetDir: destination,
    count: unpackResult.count,
    files: unpackResult.extractedFiles
  };
}

