import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

export const config = {
  rootDir: ROOT_DIR,
  dbFile: path.join(ROOT_DIR, 'server', 'data', 'db.json'),
  uploadsDir: path.join(ROOT_DIR, 'public', 'uploads'),
  backupsDir: path.join(ROOT_DIR, 'backups'),
  dbBackupsDir: path.join(ROOT_DIR, 'backups', 'database'),
  uploadsBackupsDir: path.join(ROOT_DIR, 'backups', 'uploads'),
  logFile: path.join(ROOT_DIR, 'backups', 'backup.log'),

  // Storage Provider: 'google-drive' (default) or 's3'
  storageProvider: (process.env.BACKUP_STORAGE_PROVIDER || 'google-drive').toLowerCase().trim(),

  // Google Drive Configuration
  googleDrive: {
    clientId: process.env.GDRIVE_CLIENT_ID || '',
    clientSecret: process.env.GDRIVE_CLIENT_SECRET || '',
    refreshToken: process.env.GDRIVE_REFRESH_TOKEN || '',
    folderId: process.env.GDRIVE_FOLDER_ID || '',
    rootFolderName: process.env.GDRIVE_ROOT_FOLDER_NAME || 'Horam-Studio-Backups'
  },

  // Cloudflare R2 / S3 Storage Credentials (Alternative / Backward Compatibility)
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucketName: process.env.R2_BUCKET_NAME || 'hooram-studio-backups',
    endpoint: process.env.R2_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '')
  },

  // Encryption Key (Hex string or phrase)
  encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || '',

  // Retention in days
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '7', 10)
};

// Ensure local backup staging directories exist
[config.backupsDir, config.dbBackupsDir, config.uploadsBackupsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

