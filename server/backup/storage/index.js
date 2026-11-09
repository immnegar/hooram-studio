import { config } from '../config.js';
import { googleDriveAdapter, GoogleDriveAdapter } from './googleDriveAdapter.js';
import { s3Adapter, S3Adapter } from './s3Adapter.js';
import { logger } from '../logger.js';

/**
 * Factory that returns the configured storage adapter.
 * Supports:
 * - 'google-drive' (default, enterprise zero-dependency Google Drive API v3)
 * - 's3' or 'r2' (Cloudflare R2, AWS S3, MinIO, or S3-compatible providers)
 * - 'local' (local staging mode only, no cloud upload)
 *
 * @param {string} [providerName=config.storageProvider]
 * @returns {GoogleDriveAdapter | S3Adapter}
 */
export function getStorageAdapter(providerName = config.storageProvider) {
  const provider = (providerName || 'google-drive').toLowerCase().trim();

  switch (provider) {
    case 'google-drive':
    case 'gdrive':
      return googleDriveAdapter;

    case 's3':
    case 'r2':
    case 'cloudflare':
      return s3Adapter;

    case 'local':
    case 'none':
      // Return a dummy disabled adapter
      return {
        name: 'Local Only',
        provider: 'local',
        isConfigured: () => false,
        testConnection: async () => ({ configured: false, message: 'Local-only mode active.' }),
        uploadFile: async () => ({ success: false, skipped: true }),
        downloadFile: async () => { throw new Error('Cloud storage disabled.'); },
        listFiles: async () => [],
        deleteFile: async () => ({ success: false, skipped: true }),
        fileExists: async () => false,
        getFileMetadata: async () => null
      };

    default:
      logger.warn(`[Storage Manager] Unknown storage provider "${provider}". Defaulting to Google Drive.`);
      return googleDriveAdapter;
  }
}

/**
 * Active singleton storage adapter for the backup system.
 */
export const storageAdapter = getStorageAdapter();

export {
  googleDriveAdapter,
  GoogleDriveAdapter,
  s3Adapter,
  S3Adapter
};

