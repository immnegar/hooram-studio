import fs from 'fs';
import path from 'path';
import { config } from './config.js';
import { logger } from './logger.js';
import { storageAdapter } from './storage/index.js';
import { validateEncryptedArchive } from './crypto.js';

/**
 * Calculates ISO week key using pure UTC methods to guarantee timezone-independence.
 * @param {Date} date
 * @returns {string} e.g. "2026-W45"
 */
export function getIsoWeekKeyUtc(date) {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = target.getUTCDay() || 7; // Sunday is 7 in ISO 8601
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Calculates date keys (day, week, month) using pure UTC getters.
 * @param {Date} date
 * @returns {{ dayKey: string, weekKey: string, monthKey: string }}
 */
export function getDateKeysUtc(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return {
    dayKey: `${year}-${month}-${day}`,
    weekKey: getIsoWeekKeyUtc(date),
    monthKey: `${year}-${month}`
  };
}

/**
 * Evaluates backups under Grandfather-Father-Son (GFS) retention rules:
 * - 7 Daily backups
 * - 4 Weekly backups
 * - 12 Monthly backups
 *
 * Requirements:
 * - Pure UTC date calculations
 * - Retains latest valid backup for each period
 * - Prevents duplicate retention slots from consuming redundant storage
 * - Never deletes the latest valid backup
 * - Monthly backups older than maxMonthly limit are eligible for pruning
 *
 * @param {Array<{ filename: string, fullPath: string, mtime: number }>} validFiles Sorted newest first
 * @param {{ daily?: number, weekly?: number, monthly?: number, now?: number }} [options]
 * @returns {{ retained: Set<string>, toPrune: Array<{ filename: string, fullPath: string }>, slots: object }}
 */
export function evaluateGfsRetention(validFiles, options = {}) {
  const maxDaily = options.daily ?? 7;
  const maxWeekly = options.weekly ?? 4;
  const maxMonthly = options.monthly ?? 12;
  const referenceTime = options.now ? new Date(options.now) : new Date();

  const retained = new Set();
  const slots = {
    daily: [],
    weekly: [],
    monthly: []
  };

  if (!validFiles || validFiles.length === 0) {
    return { retained, toPrune: [], slots };
  }

  // CRITICAL RULE: Always preserve the latest valid backup
  const latestBackup = validFiles[0];
  retained.add(latestBackup.fullPath);

  // If only 1 valid backup exists, keep it and prune nothing
  if (validFiles.length <= 1) {
    return { retained, toPrune: [], slots };
  }

  const seenDays = new Map();
  const seenWeeks = new Map();
  const seenMonths = new Map();

  // Compute 12-month calendar boundary for monthly slots in UTC
  const earliestAllowedMonth = new Date(Date.UTC(
    referenceTime.getUTCFullYear(),
    referenceTime.getUTCMonth() - maxMonthly,
    1
  )).toISOString().slice(0, 7);

  // Categorize newest-first (first encounter in a period is the latest for that period)
  for (const item of validFiles) {
    const d = new Date(item.mtime);
    const { dayKey, weekKey, monthKey } = getDateKeysUtc(d);

    // 1. Daily Tier (up to maxDaily distinct days)
    if (!seenDays.has(dayKey) && seenDays.size < maxDaily) {
      seenDays.set(dayKey, item);
      retained.add(item.fullPath);
      slots.daily.push({ key: dayKey, file: item.filename });
    }

    // 2. Weekly Tier (up to maxWeekly distinct weeks)
    if (!seenWeeks.has(weekKey) && seenWeeks.size < maxWeekly) {
      seenWeeks.set(weekKey, item);
      retained.add(item.fullPath);
      slots.weekly.push({ key: weekKey, file: item.filename });
    }

    // 3. Monthly Tier (up to maxMonthly distinct months, must be within the 12-month window)
    if (!seenMonths.has(monthKey) && seenMonths.size < maxMonthly && monthKey >= earliestAllowedMonth) {
      seenMonths.set(monthKey, item);
      retained.add(item.fullPath);
      slots.monthly.push({ key: monthKey, file: item.filename });
    }
  }

  // Any valid file not allocated to daily, weekly, or monthly slots is marked for pruning
  const toPrune = validFiles.filter((f) => !retained.has(f.fullPath));

  return {
    retained,
    toPrune,
    slots
  };
}

/**
 * Validates the physical integrity of a backup archive.
 * Checks minimum header length, magic header, and AES-256-GCM authentication tag.
 * @param {string} filePath
 * @param {string} encryptionKey
 * @returns {{ valid: boolean, error?: string }}
 */
export function verifyBackupFileIntegrity(filePath, encryptionKey) {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File does not exist' };
    }

    const stat = fs.statSync(filePath);

    // Minimum size check: Unencrypted empty gzip is >= 20 bytes; Encrypted AES-GCM archive is >= 41 bytes
    if (stat.size === 0) {
      return { valid: false, error: 'Zero-byte empty file' };
    }

    if (filePath.endsWith('.enc')) {
      if (stat.size < 41) {
        return { valid: false, error: `Incomplete encrypted archive (size ${stat.size} < 41 bytes minimum header)` };
      }
      if (!encryptionKey) {
        return { valid: false, error: 'Missing encryption key to verify .enc archive' };
      }

      const val = validateEncryptedArchive(filePath, encryptionKey);
      if (!val.valid) {
        return { valid: false, error: `Decryption / Auth tag failure (${val.error})` };
      }
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

/**
 * Applies GFS retention policy on a given backup directory with strict integrity pre-validation.
 *
 * CRITICAL SAFETY RULES:
 * 1. Verifies archive integrity (size, magic header, GCM auth tag, decryptability) before evaluating retention.
 * 2. Corrupt, 0-byte, or unverified files NEVER replace a healthy backup or occupy valid GFS slots.
 * 3. Never deletes the latest valid backup.
 * 4. If encryption key is missing for encrypted archives, pruning aborts safely to prevent accidental data loss.
 * 5. If fewer than 2 valid backups exist, NO valid backup is pruned.
 *
 * @param {string} directory Target backup directory
 * @param {object} [options={}]
 * @param {string} [options.encryptionKey=config.encryptionKey]
 * @param {{ daily?: number, weekly?: number, monthly?: number }} [options.rules]
 * @returns {Promise<{ keptCount: number, prunedCount: number, corruptedSkipped: number, error?: string }>}
 */
export async function pruneOldBackups(directory, options = {}) {
  const encKey = options.encryptionKey || config.encryptionKey;
  const rules = options.rules || { daily: 7, weekly: 4, monthly: 12 };

  if (!fs.existsSync(directory)) {
    return { keptCount: 0, prunedCount: 0, corruptedSkipped: 0 };
  }

  try {
    const rawEntries = fs.readdirSync(directory)
      .filter((f) => f.endsWith('.enc') || f.endsWith('.tar.gz') || f.endsWith('.json.gz'))
      .map((f) => {
        const fullPath = path.join(directory, f);
        const stat = fs.statSync(fullPath);
        return {
          filename: f,
          fullPath,
          size: stat.size,
          mtime: stat.mtimeMs
        };
      })
      .sort((a, b) => b.mtime - a.mtime); // Newest first

    if (rawEntries.length === 0) {
      return { keptCount: 0, prunedCount: 0, corruptedSkipped: 0 };
    }

    // Check if encrypted archives exist but encryption key is missing
    const hasEncrypted = rawEntries.some((e) => e.filename.endsWith('.enc'));
    if (hasEncrypted && !encKey) {
      const msg = `[GFS Retention] SAFETY ABORT: Encrypted archives exist in ${path.basename(directory)}, but BACKUP_ENCRYPTION_KEY is missing. Pruning halted to prevent data loss.`;
      logger.error(msg);
      return { keptCount: rawEntries.length, prunedCount: 0, corruptedSkipped: 0, error: 'Missing encryption key' };
    }

    // Step 1: Pre-validate integrity of all backup candidates
    const validFiles = [];
    const corruptedFiles = [];

    for (const entry of rawEntries) {
      const integrity = verifyBackupFileIntegrity(entry.fullPath, encKey);
      if (integrity.valid) {
        validFiles.push(entry);
      } else {
        corruptedFiles.push({ ...entry, reason: integrity.error });
        logger.warn(`[GFS Retention] Disregarded corrupted/incomplete backup: ${entry.filename} (${integrity.error})`);
      }
    }

    // Step 2: Safety Check: If no valid backup exists, or only 1 valid backup exists, DO NOT prune any valid backups
    if (validFiles.length <= 1) {
      logger.info(`[GFS Retention] Found ${validFiles.length} valid backup in ${path.basename(directory)}. Kept all valid files.`);
      return {
        keptCount: validFiles.length,
        prunedCount: 0,
        corruptedSkipped: corruptedFiles.length
      };
    }

    // Step 3: Run GFS evaluation exclusively on verified, valid backups
    const { retained, toPrune, slots } = evaluateGfsRetention(validFiles, { ...rules, now: options.now });

    // Safety verification: The newest valid backup MUST be in the retained set
    if (!retained.has(validFiles[0].fullPath)) {
      logger.error('[GFS Retention] Safety invariant violation: Newest valid backup was not retained. Pruning aborted.');
      return { keptCount: validFiles.length, prunedCount: 0, corruptedSkipped: corruptedFiles.length };
    }

    logger.info(`[GFS Retention] ${path.basename(directory)}: ${retained.size} retained (${slots.daily.length} daily, ${slots.weekly.length} weekly, ${slots.monthly.length} monthly), ${toPrune.length} to prune.`);

    // Step 4: Execute safe pruning of unslotted older valid backups
    let prunedCount = 0;
    for (const item of toPrune) {
      try {
        if (fs.existsSync(item.fullPath)) {
          fs.unlinkSync(item.fullPath);
        }
        prunedCount++;

        // Delete matching .meta.json if present
        const metaPath = item.fullPath.replace(/\.(json\.gz|tar\.gz)\.enc$/, '.meta.json');
        if (fs.existsSync(metaPath)) {
          fs.unlinkSync(metaPath);
        }

        // Prune from configured cloud storage (Google Drive / S3) if enabled
        if (storageAdapter.isConfigured()) {
          const category = path.basename(directory);
          await storageAdapter.deleteFile(`${category}/${item.filename}`);
        }

        logger.info(`[GFS Retention] Pruned expired backup: ${item.filename}`);
      } catch (err) {
        logger.warn(`[GFS Retention] Failed to prune ${item.filename}:`, err.message);
      }
    }

    if (prunedCount > 0) {
      logger.success(`[GFS Retention] Pruned ${prunedCount} expired backups from ${path.basename(directory)}. Kept ${retained.size} valid backups.`);
    }

    return {
      keptCount: retained.size,
      prunedCount,
      corruptedSkipped: corruptedFiles.length
    };
  } catch (err) {
    logger.error(`[GFS Retention] Error during retention processing:`, err.message);
    return { keptCount: 0, prunedCount: 0, corruptedSkipped: 0, error: err.message };
  }
}
