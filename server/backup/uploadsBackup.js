import fs from 'fs';
import path from 'path';
import { config } from './config.js';
import { logger } from './logger.js';
import { packDirectoryToTarGz } from './tarUtil.js';
import { encryptBuffer, calculateChecksum } from './crypto.js';
import { storageAdapter } from './storage/index.js';
import { pruneOldBackups } from './retention.js';

/**
 * Builds an inventory manifest of all files in public/uploads.
 * @param {string} dir
 * @returns {{ files: Record<string, { size: number, mtime: string, hash: string }>, totalSize: number, count: number }}
 */
export function buildUploadsManifest(dir = config.uploadsDir) {
  const result = {};
  let totalSize = 0;
  let count = 0;

  if (!fs.existsSync(dir)) {
    return { files: result, totalSize, count };
  }

  function walk(currentDir, relativePath) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        walk(fullPath, relPath);
      } else if (entry.isFile()) {
        const stat = fs.statSync(fullPath);
        const data = fs.readFileSync(fullPath);
        const hash = calculateChecksum(data);

        result[relPath.replace(/\\/g, '/')] = {
          size: stat.size,
          mtime: stat.mtime.toISOString(),
          hash
        };
        totalSize += stat.size;
        count++;
      }
    }
  }

  walk(dir, '');
  return { files: result, totalSize, count };
}

/**
 * Compares two manifests to find added, modified, and deleted files.
 */
export function diffUploadsManifest(currentManifest, previousManifest) {
  const added = [];
  const modified = [];
  const deleted = [];

  const curr = currentManifest.files;
  const prev = previousManifest ? previousManifest.files : {};

  for (const [filePath, info] of Object.entries(curr)) {
    if (!prev[filePath]) {
      added.push(filePath);
    } else if (prev[filePath].hash !== info.hash) {
      modified.push(filePath);
    }
  }

  for (const filePath of Object.keys(prev)) {
    if (!curr[filePath]) {
      deleted.push(filePath);
    }
  }

  return {
    added,
    modified,
    deleted,
    hasChanges: added.length > 0 || modified.length > 0 || deleted.length > 0
  };
}

/**
 * Creates a versioned, compressed, and encrypted backup of public/uploads.
 * @param {object} [options={}]
 * @param {string} [options.encryptionKey=config.encryptionKey]
 * @param {boolean} [options.uploadToCloud=true]
 * @param {boolean} [options.force=false] Force archive creation even if no files changed
 */
export async function createUploadsBackup(options = {}) {
  const startTime = Date.now();
  const encKey = options.encryptionKey || config.encryptionKey;

  logger.info('[Uploads Backup] Inspecting uploads inventory...');

  try {
    const currentManifest = buildUploadsManifest(config.uploadsDir);
    const manifestPath = path.join(config.uploadsBackupsDir, 'manifest.latest.json');

    let previousManifest = null;
    if (fs.existsSync(manifestPath)) {
      try {
        previousManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch (_) {}
    }

    const diff = diffUploadsManifest(currentManifest, previousManifest);

    if (!diff.hasChanges && !options.force && previousManifest) {
      logger.info(`[Uploads Backup] No changes detected in public/uploads (${currentManifest.count} files, ${(currentManifest.totalSize / 1024 / 1024).toFixed(2)} MB). Skipping redundant archive creation.`);
      return {
        success: true,
        skipped: true,
        count: currentManifest.count,
        totalSize: currentManifest.totalSize
      };
    }

    logger.info(`[Uploads Backup] Changes detected: +${diff.added.length} added, ~${diff.modified.length} modified, -${diff.deleted.length} deleted.`);

    // 1. Pack directory to tar.gz
    logger.info('[Uploads Backup] Packing uploads directory into compressed archive...');
    const tarGzBuffer = packDirectoryToTarGz(config.uploadsDir);

    // 2. Encrypt archive if key is provided
    const isEncrypted = Boolean(encKey);
    let finalBuffer;
    let extension;

    if (isEncrypted) {
      finalBuffer = encryptBuffer(tarGzBuffer, encKey);
      extension = '.tar.gz.enc';
    } else {
      logger.warn('[Uploads Backup] BACKUP_ENCRYPTION_KEY is not set. Saving unencrypted tar.gz archive.');
      finalBuffer = tarGzBuffer;
      extension = '.tar.gz';
    }

    // 3. Generate timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `uploads-snapshot-${timestamp}${extension}`;
    const targetPath = path.join(config.uploadsBackupsDir, filename);

    // 4. Save archive to local staging
    fs.writeFileSync(targetPath, finalBuffer);
    const finalChecksum = calculateChecksum(finalBuffer);

    // 5. Update and write manifest
    const metaFilename = `uploads-snapshot-${timestamp}.meta.json`;
    const metaPath = path.join(config.uploadsBackupsDir, metaFilename);
    const metadata = {
      filename,
      timestamp: new Date().toISOString(),
      fileCount: currentManifest.count,
      totalUncompressedSize: currentManifest.totalSize,
      compressedSize: tarGzBuffer.length,
      finalSize: finalBuffer.length,
      checksum: finalChecksum,
      isEncrypted,
      diff: {
        added: diff.added,
        modified: diff.modified,
        deleted: diff.deleted
      },
      durationMs: Date.now() - startTime
    };

    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf8');
    fs.writeFileSync(manifestPath, JSON.stringify(currentManifest, null, 2), 'utf8');

    logger.success(`[Uploads Backup] Created snapshot "${filename}" (${(finalBuffer.length / 1024 / 1024).toFixed(2)} MB, ${currentManifest.count} files) in ${metadata.durationMs}ms`);

    // 6. Upload to configured cloud storage (Google Drive or S3) if enabled
    if (options.uploadToCloud !== false && storageAdapter.isConfigured()) {
      logger.info(`[Uploads Backup] Uploading "${filename}" to ${storageAdapter.name}...`);
      await storageAdapter.uploadFile(targetPath, `uploads/${filename}`, {
        checksum: finalChecksum,
        encrypted: String(isEncrypted),
        timestamp: metadata.timestamp
      });
    }

    // 7. Apply retention policy
    await pruneOldBackups(config.uploadsBackupsDir);

    return {
      success: true,
      filename,
      targetPath,
      metadata
    };
  } catch (err) {
    logger.error(`[Uploads Backup] Failed: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
}

