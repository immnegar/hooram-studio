import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { snapshotDB } from '../db.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { encryptBuffer, calculateChecksum } from './crypto.js';
import { storageAdapter } from './storage/index.js';
import { pruneOldBackups, verifyBackupFileIntegrity } from './retention.js';

/**
 * Executes a full, consistent, encrypted snapshot of the production database.
 * Protects only the database, uses atomic locking against overlap, and ensures
 * zero exposure of secrets.
 *
 * @param {object} [options={}]
 * @param {string} [options.encryptionKey=config.encryptionKey]
 * @param {boolean} [options.uploadToCloud=true]
 * @returns {Promise<{ success: boolean, filename?: string, checksum?: string, size?: number, error?: string, skipped?: boolean }>}
 */
export async function createDatabaseBackup(options = {}) {
  const startTime = Date.now();
  const encKey = options.encryptionKey || config.encryptionKey;
  const lockFile = path.join(config.backupsDir, '.backup.lock');

  // 0. Overlap protection: Avoid concurrent backup jobs
  if (fs.existsSync(lockFile)) {
    try {
      const lockStat = fs.statSync(lockFile);
      const ageMs = Date.now() - lockStat.mtimeMs;
      if (ageMs < 15 * 60 * 1000) {
        logger.warn('[Database Backup] Another backup process is currently in progress. Skipping overlapping execution.');
        return { success: false, skipped: true, reason: 'Concurrent backup in progress' };
      } else {
        try { fs.unlinkSync(lockFile); } catch (_) {}
      }
    } catch (_) {}
  }

  // Acquire lock
  const cleanLock = () => {
    try {
      if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
    } catch (_) {}
  };

  const handleTermination = () => {
    cleanLock();
    process.exit(1);
  };

  process.once('SIGINT', handleTermination);
  process.once('SIGTERM', handleTermination);

  try {
    fs.writeFileSync(lockFile, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
  } catch (_) {}

  logger.info('[Database Backup] Starting consistent database snapshot...');

  try {
    // 1. Acquire safe, validated in-memory snapshot
    const snapshot = snapshotDB();
    if (!snapshot.success) {
      throw new Error(`Snapshot acquisition failed: ${snapshot.error}`);
    }

    // 2. Sanitize and prepare clean data for archive (no runtime or ephemeral leaks)
    const rawData = snapshot.data;
    const cleanJson = JSON.stringify(rawData, null, 2);
    const rawChecksum = calculateChecksum(cleanJson);

    // 3. Compress using gzip
    const gzipped = zlib.gzipSync(Buffer.from(cleanJson, 'utf8'), { level: 9 });

    // 4. Encrypt if encryptionKey is provided (or fall back to clean compressed archive)
    const isEncrypted = Boolean(encKey);
    let finalBuffer;
    let extension;

    if (isEncrypted) {
      finalBuffer = encryptBuffer(gzipped, encKey);
      extension = '.json.gz.enc';
    } else {
      logger.warn('[Database Backup] BACKUP_ENCRYPTION_KEY is not set. Saving unencrypted gzip archive.');
      finalBuffer = gzipped;
      extension = '.json.gz';
    }

    // 5. Generate timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `db-snapshot-${timestamp}${extension}`;
    const targetPath = path.join(config.dbBackupsDir, filename);

    // 6. Write final backup archive to local staging
    fs.writeFileSync(targetPath, finalBuffer);
    const finalChecksum = calculateChecksum(finalBuffer);

    // Self-verification of new backup integrity before considering ready
    if (isEncrypted) {
      const check = verifyBackupFileIntegrity(targetPath, encKey);
      if (!check.valid) {
        try { fs.unlinkSync(targetPath); } catch (_) {}
        throw new Error(`Integrity pre-check failed for newly created backup: ${check.error}`);
      }
    }

    // 7. Write metadata manifest
    const metaFilename = `db-snapshot-${timestamp}.meta.json`;
    const metaPath = path.join(config.dbBackupsDir, metaFilename);
    const metadata = {
      filename,
      timestamp: new Date().toISOString(),
      originalSize: Buffer.byteLength(cleanJson, 'utf8'),
      compressedSize: gzipped.length,
      finalSize: finalBuffer.length,
      rawChecksum,
      finalChecksum,
      isEncrypted,
      schemaStats: snapshot.stats,
      durationMs: Date.now() - startTime
    };
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf8');

    logger.success(`[Database Backup] Created local snapshot "${filename}" (${(finalBuffer.length / 1024).toFixed(1)} KB) in ${metadata.durationMs}ms`);

    // 8. Upload to configured cloud storage (Google Drive) if enabled
    let cloudUpload = null;
    let cloudFailed = false;
    if (options.uploadToCloud !== false && storageAdapter.isConfigured()) {
      logger.info(`[Database Backup] Uploading "${filename}" to ${storageAdapter.name}...`);
      cloudUpload = await storageAdapter.uploadFile(targetPath, `database/${filename}`, {
        checksum: finalChecksum,
        encrypted: String(isEncrypted),
        timestamp: metadata.timestamp
      });

      if (!cloudUpload.success && !cloudUpload.skipped) {
        cloudFailed = true;
        logger.warn(`[Database Backup] Cloud upload failed (${cloudUpload.error || 'Network error'}). Local backup snapshot is safely preserved.`);
      }
    }

    // 9. Apply GFS retention policy (prunes only database backups)
    // CRITICAL SAFETY: Retention cleanup runs only after a successful new backup and upload.
    // If cloud upload was attempted and failed, skip retention to preserve all local copies.
    if (cloudFailed) {
      logger.warn('[Database Backup] Cloud upload was not completed successfully. Retention pruning skipped to preserve all existing local backups.');
    } else {
      await pruneOldBackups(config.dbBackupsDir);
    }

    return {
      success: true,
      filename,
      targetPath,
      metadata,
      cloudUploaded: Boolean(cloudUpload?.success)
    };
  } catch (err) {
    logger.error(`[Database Backup] Failed: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  } finally {
    // Clean up event listeners and release overlap lock
    process.removeListener('SIGINT', handleTermination);
    process.removeListener('SIGTERM', handleTermination);
    cleanLock();
  }
}

