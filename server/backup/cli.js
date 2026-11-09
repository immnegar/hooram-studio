import path from 'path';
import fs from 'fs';
import { config } from './config.js';
import { logger } from './logger.js';
import { createDatabaseBackup } from './databaseBackup.js';
import { createUploadsBackup } from './uploadsBackup.js';
import { restoreDatabase, restoreUploads, findLatestBackup } from './restore.js';
import { storageAdapter } from './storage/index.js';
import { validateEncryptedArchive } from './crypto.js';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';

function getArg(flag) {
  const match = args.find((a) => a.startsWith(`${flag}=`));
  if (match) return match.split('=')[1];
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return null;
}

const hasFlag = (flag) => args.includes(flag);

async function main() {
  switch (command) {
    case 'backup':
    case 'backup:db':
    case 'all': {
      logger.info('=== Starting Hooram Studio Database Backup ===');
      const dbResult = await createDatabaseBackup();

      if (dbResult.success) {
        logger.success('=== Database Backup Finished Successfully ===');
      } else if (dbResult.skipped) {
        logger.warn(`=== Database Backup Skipped: ${dbResult.reason} ===`);
      } else {
        logger.error('=== Database Backup Finished with Errors ===');
        process.exitCode = 1;
      }
      break;
    }

    case 'backup:uploads':
    case 'uploads': {
      logger.info('[Notice] Automated media backups are intentionally disabled. Cloud backups protect database only.');
      break;
    }

    case 'status': {
      console.log('\n========================================');
      console.log('  Hooram Studio Backup System Status');
      console.log('  Mode: Database Only (Google Drive)');
      console.log('========================================');
      console.log(`- Project Root:        ${config.rootDir}`);
      console.log(`- Database File:       ${config.dbFile} (${fs.existsSync(config.dbFile) ? (fs.statSync(config.dbFile).size / 1024).toFixed(1) + ' KB' : 'Missing'})`);
      console.log(`- Uploads Directory:   ${config.uploadsDir} (${fs.existsSync(config.uploadsDir) ? fs.readdirSync(config.uploadsDir).length + ' files' : 'Missing'}) [Cloud backup disabled]`);
      console.log(`- Backup Staging:      ${config.dbBackupsDir}`);
      console.log(`- GFS Retention:       7 daily, 4 weekly, 12 monthly`);
      console.log(`- Encryption Key:      ${config.encryptionKey ? 'Configured (AES-256-GCM Active)' : 'Not set (Unencrypted local staging)'}`);

      console.log('\n[Cloud Storage Configuration]');
      console.log(`- Active Provider:      ${storageAdapter.name} (${storageAdapter.provider})`);
      if (storageAdapter.provider === 'google-drive') {
        console.log(`- Client ID:            ${config.googleDrive.clientId ? config.googleDrive.clientId.slice(0, 12) + '...' : '(Not set)'}`);
        console.log(`- Refresh Token:        ${config.googleDrive.refreshToken ? 'Configured (OAuth2 Offline Active)' : '(Not set)'}`);
        console.log(`- Target Folder:        ${config.googleDrive.folderId ? 'ID: ' + config.googleDrive.folderId : config.googleDrive.rootFolderName}`);
      } else if (storageAdapter.provider === 's3') {
        console.log(`- S3 Endpoint:          ${config.r2.endpoint || '(Auto-computed from Account ID)'}`);
        console.log(`- Bucket Name:          ${config.r2.bucketName}`);
        console.log(`- Access Key ID:        ${config.r2.accessKeyId ? config.r2.accessKeyId.slice(0, 6) + '...' : '(Not set)'}`);
      }
      console.log(`- Cloud Status:         ${storageAdapter.isConfigured() ? 'Ready for cloud upload' : 'Not configured (Operating in local staging mode)'}`);

      // List local database backups
      const dbBackups = fs.existsSync(config.dbBackupsDir)
        ? fs.readdirSync(config.dbBackupsDir).filter((f) => f.endsWith('.enc') || f.endsWith('.json.gz'))
        : [];
      console.log(`\n[Local Database Snapshots: ${dbBackups.length}]`);
      dbBackups.slice(-5).forEach((b) => console.log(`  • ${b}`));
      console.log('========================================\n');
      break;
    }

    case 'verify': {
      logger.info('=== Verifying Database Backup Archives Integrity ===');
      if (!config.encryptionKey) {
        logger.warn('BACKUP_ENCRYPTION_KEY is not set in environment (.env). Cannot verify encrypted archives without encryption key.');
        console.log('\nTip: Add BACKUP_ENCRYPTION_KEY to your .env file or run with:');
        console.log('  $env:BACKUP_ENCRYPTION_KEY="your-key"; npm run backup:verify\n');
        process.exitCode = 1;
        break;
      }
      let totalVerified = 0;
      let totalFailed = 0;

      const checkFolder = (dir, name) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.enc'));
        for (const file of files) {
          const filePath = path.join(dir, file);
          const val = validateEncryptedArchive(filePath, config.encryptionKey);
          if (val.valid) {
            logger.success(`Verified ${name}: ${file} (${(val.size / 1024).toFixed(1)} KB decrypted)`);
            totalVerified++;
          } else {
            logger.error(`CORRUPT or Bad Key in ${name}: ${file} (${val.error})`);
            totalFailed++;
          }
        }
      };

      checkFolder(config.dbBackupsDir, 'Database');

      logger.info(`Verification finished: ${totalVerified} valid, ${totalFailed} errors.`);
      if (totalFailed > 0) process.exitCode = 1;
      break;
    }

    case 'restore': {
      const customFile = getArg('--file');
      const targetDir = getArg('--target-dir');
      const confirm = hasFlag('--confirm');

      logger.info('=== Starting Database Restore Operation ===');

      const fileToRestore = customFile || findLatestBackup(config.dbBackupsDir)?.fullPath;
      if (!fileToRestore) {
        logger.error('No database backup file found to restore.');
        process.exitCode = 1;
        return;
      }

      try {
        const res = await restoreDatabase(fileToRestore, {
          confirm,
          targetDir
        });
        logger.success('Database restore completed.', res.stats);
      } catch (err) {
        logger.error(`Database restore aborted: ${err.message}`);
        process.exitCode = 1;
      }
      break;
    }

    case 'setup:gdrive': {
      const { runGoogleDriveSetup } = await import('../../scripts/setup-gdrive.js');
      await runGoogleDriveSetup();
      break;
    }

    case 'help':
    default: {
      console.log(`
Hooram Studio Database Backup CLI
Usage: node server/backup/cli.js <command> [options]

Commands:
  backup          Execute database snapshot, encryption, cloud upload, and GFS retention
  status          Display current backup status, archives, and cloud configuration
  verify          Verify SHA-256 integrity and decryption of all local database archives
  setup:gdrive    Interactive OAuth2 setup tool for connecting Google Drive
  restore         Restore database from a backup archive
                  Options:
                    --file=/path/to/archive (default: latest snapshot)
                    --target-dir=/tmp/test-restore (safe test staging mode)
                    --confirm (required when restoring to live production database)
      `);
      break;
    }
  }
}

main().catch((err) => {
  logger.error('Unhandled CLI Exception:', err);
  process.exit(1);
});
