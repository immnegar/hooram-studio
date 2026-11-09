import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config.js';
import { logger } from '../logger.js';

/**
 * Enterprise-grade, zero-dependency Google Drive Storage Adapter for Node.js.
 * Utilizes Google Drive API v3 and OAuth2 Refresh Token flow.
 *
 * Key Capabilities:
 * - Autonomous Headless Authentication: Automatically refreshes access tokens without user interaction.
 * - Least-Privilege Scope: Designed for `https://www.googleapis.com/auth/drive.file`.
 * - Folder Hierarchy: Manages project backups in dedicated root folder and subfolders (`database/`, `uploads/`).
 * - Fault Tolerance: Built-in request timeout, transient error retries (5xx/429), and credential redaction.
 * - Safety Invariant: Cloud upload failure NEVER modifies or deletes local backup archives.
 */
export class GoogleDriveAdapter {
  constructor(gdriveConfig = config.googleDrive) {
    this.name = 'Google Drive';
    this.provider = 'google-drive';

    this.clientId = gdriveConfig.clientId?.trim() || '';
    this.clientSecret = gdriveConfig.clientSecret?.trim() || '';
    this.refreshToken = gdriveConfig.refreshToken?.trim() || '';
    this.rootFolderId = gdriveConfig.folderId?.trim() || '';
    this.rootFolderName = gdriveConfig.rootFolderName?.trim() || 'Horam-Studio-Backups';

    this.timeoutMs = 60000; // 60 seconds timeout
    this._cachedAccessToken = null;
    this._tokenExpiryTime = 0;
    this._folderCache = new Map(); // category -> folderId

    // Concurrency locks to prevent duplicate folder creation during parallel operations
    this._rootFolderPromise = null;
    this._categoryPromises = new Map();
  }

  /**
   * Checks whether all necessary OAuth2 credentials are present in environment.
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(
      this.clientId &&
      this.clientSecret &&
      this.refreshToken
    );
  }

  /**
   * Sanitizes error messages by redacting tokens, keys, and authorization headers.
   * @param {string} msg
   * @returns {string}
   */
  _sanitizeError(msg = '') {
    return String(msg)
      .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED_ACCESS_TOKEN]')
      .replace(/refresh_token=[^&\s]+/gi, 'refresh_token=[REDACTED]')
      .replace(/client_secret=[^&\s]+/gi, 'client_secret=[REDACTED]')
      .replace(/client_id=[^&\s]+/gi, 'client_id=[REDACTED]');
  }

  /**
   * Executes a fetch request with timeout, transient error retries, and sanitized logs.
   */
  async _fetchWithTimeout(url, options, maxRetries = 2) {
    let attempt = 0;
    let lastError = null;

    while (attempt <= maxRetries) {
      attempt++;
      try {
        const res = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(this.timeoutMs)
        });

        // Retry transient server errors (5xx) or rate limit (429)
        if ((res.status >= 500 && res.status <= 504 || res.status === 429) && attempt <= maxRetries) {
          logger.warn(`[Google Drive] Server returned HTTP ${res.status}. Retrying attempt ${attempt}/${maxRetries}...`);
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        }

        return res;
      } catch (err) {
        lastError = err;
        const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError';
        const isNetwork = err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'EAI_AGAIN' || err.message?.includes('fetch failed');

        if ((isTimeout || isNetwork) && attempt <= maxRetries) {
          const reason = isTimeout ? `Request timed out after ${this.timeoutMs / 1000}s` : err.message;
          logger.warn(`[Google Drive] Transient network failure (${this._sanitizeError(reason)}). Retrying attempt ${attempt}/${maxRetries}...`);
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        }
        break;
      }
    }

    const sanitizedMsg = this._sanitizeError(lastError.message || 'Unknown network error');
    const isTimeout = lastError.name === 'TimeoutError' || lastError.name === 'AbortError';
    const finalErr = new Error(isTimeout ? `Google Drive request timed out after ${this.timeoutMs / 1000}s.` : `Google Drive request failed: ${sanitizedMsg}`);
    finalErr.isTimeout = isTimeout;
    throw finalErr;
  }

  /**
   * Automatically refreshes and returns a valid OAuth2 Access Token.
   * Access tokens are cached in memory and refreshed before expiry.
   * @returns {Promise<string>}
   */
  async _getAccessToken() {
    if (!this.isConfigured()) {
      throw new Error('Google Drive is not configured: Missing GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, or GDRIVE_REFRESH_TOKEN.');
    }

    // Reuse valid cached access token (with 2 minutes buffer)
    if (this._cachedAccessToken && Date.now() < this._tokenExpiryTime) {
      return this._cachedAccessToken;
    }

    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token'
    });

    try {
      const res = await this._fetchWithTimeout(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      }, 2);

      if (!res.ok) {
        const errorBody = await res.text();
        let hint = '';
        if (errorBody.includes('invalid_grant')) {
          hint = ' (Notice: Refresh Token is expired, invalid, or revoked. If your OAuth Consent Screen is in "Testing" mode, Google expires tokens after 7 days. Switch Publishing status to "In production" in Google Cloud Console to remove the 7-day limit. You can re-authorize anytime with `npm run backup:setup-gdrive`.)';
        }
        throw new Error(`OAuth token exchange failed [HTTP ${res.status}]: ${this._sanitizeError(errorBody)}${hint}`);
      }

      const data = await res.json();
      if (!data.access_token) {
        throw new Error('OAuth token response did not contain access_token.');
      }

      this._cachedAccessToken = data.access_token;
      // expires_in is typically 3600 seconds
      const expiresInSec = Number(data.expires_in) || 3600;
      this._tokenExpiryTime = Date.now() + Math.max(120, expiresInSec - 120) * 1000;

      return this._cachedAccessToken;
    } catch (err) {
      throw new Error(`Failed to refresh Google Drive access token: ${this._sanitizeError(err.message)}`);
    }
  }

  /**
   * Ensures the root backup folder exists in Google Drive.
   * Uses a promise-mutex to prevent race conditions during concurrent runs.
   * @returns {Promise<string>} Folder ID
   */
  async _ensureRootFolder() {
    if (this.rootFolderId) {
      return this.rootFolderId;
    }

    if (this._rootFolderPromise) {
      return this._rootFolderPromise;
    }

    this._rootFolderPromise = (async () => {
      try {
        const token = await this._getAccessToken();
        const folderName = this.rootFolderName;

        // Search for existing folder
        const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName.replace(/'/g, "\\'")}' and trashed = false`;
        const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&spaces=drive`;

        const searchRes = await this._fetchWithTimeout(searchUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        }, 2);

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.files && searchData.files.length > 0) {
            this.rootFolderId = searchData.files[0].id;
            return this.rootFolderId;
          }
        }

        // Create root folder if not found
        const createUrl = 'https://www.googleapis.com/drive/v3/files';
        const createRes = await this._fetchWithTimeout(createUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            description: 'Automated backup archives for Horam Studio'
          })
        }, 2);

        if (!createRes.ok) {
          const errText = await createRes.text();
          throw new Error(`Failed to create root folder in Google Drive [HTTP ${createRes.status}]: ${this._sanitizeError(errText)}`);
        }

        const created = await createRes.json();
        this.rootFolderId = created.id;
        return this.rootFolderId;
      } finally {
        this._rootFolderPromise = null;
      }
    })();

    return this._rootFolderPromise;
  }

  /**
   * Ensures a category subfolder (e.g. 'database' or 'uploads') exists inside root folder.
   * Uses category promise locks to prevent duplicate folder creation during concurrent runs.
   * @param {string} category
   * @returns {Promise<string>} Folder ID
   */
  async _ensureCategoryFolder(category) {
    if (!category) {
      return await this._ensureRootFolder();
    }

    const cacheKey = category.toLowerCase().trim();
    if (this._folderCache.has(cacheKey)) {
      return this._folderCache.get(cacheKey);
    }

    if (this._categoryPromises.has(cacheKey)) {
      return this._categoryPromises.get(cacheKey);
    }

    const promise = (async () => {
      try {
        const rootId = await this._ensureRootFolder();
        const token = await this._getAccessToken();

        // Query subfolder inside root folder
        const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${category}' and '${rootId}' in parents and trashed = false`;
        const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&spaces=drive`;

        const searchRes = await this._fetchWithTimeout(searchUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        }, 2);

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.files && searchData.files.length > 0) {
            const id = searchData.files[0].id;
            this._folderCache.set(cacheKey, id);
            return id;
          }
        }

        // Create subfolder
        const createUrl = 'https://www.googleapis.com/drive/v3/files';
        const createRes = await this._fetchWithTimeout(createUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: category,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [rootId]
          })
        }, 2);

        if (!createRes.ok) {
          const errText = await createRes.text();
          throw new Error(`Failed to create subfolder "${category}" in Google Drive [HTTP ${createRes.status}]: ${this._sanitizeError(errText)}`);
        }

        const created = await createRes.json();
        this._folderCache.set(cacheKey, created.id);
        return created.id;
      } finally {
        this._categoryPromises.delete(cacheKey);
      }
    })();

    this._categoryPromises.set(cacheKey, promise);
    return promise;
  }

  /**
   * Parses remotePath into category and filename.
   * e.g. "database/db-snapshot-123.json.gz.enc" -> { category: "database", filename: "db-snapshot-123.json.gz.enc" }
   */
  _parseRemotePath(remotePath) {
    const clean = remotePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const parts = clean.split('/');
    if (parts.length > 1) {
      return {
        category: parts[0],
        filename: parts.slice(1).join('/')
      };
    }
    return {
      category: '',
      filename: clean
    };
  }

  /**
   * Finds a file in Google Drive by its remote path.
   * @param {string} remotePath
   * @returns {Promise<{ id: string, name: string, size?: number }|null>}
   */
  async _findFile(remotePath) {
    const { category, filename } = this._parseRemotePath(remotePath);
    const folderId = await this._ensureCategoryFolder(category);
    const token = await this._getAccessToken();

    const q = `'${folderId}' in parents and name = '${filename.replace(/'/g, "\\'")}' and trashed = false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,size,modifiedTime)&spaces=drive`;

    const res = await this._fetchWithTimeout(searchUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }, 2);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.files && data.files.length > 0 ? data.files[0] : null;
  }

  /**
   * Tests connectivity to Google Drive API and verifies root folder access.
   * @returns {Promise<{ configured: boolean, connected: boolean, message?: string, error?: string }>}
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return {
        configured: false,
        connected: false,
        message: 'Google Drive is not configured. Missing required environment variables (GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN).'
      };
    }

    try {
      const token = await this._getAccessToken();
      const rootId = await this._ensureRootFolder();

      return {
        configured: true,
        connected: true,
        rootFolderId: rootId,
        rootFolderName: this.rootFolderName,
        message: `Successfully connected to Google Drive. Root backup folder: "${this.rootFolderName}" (ID: ${rootId})`
      };
    } catch (err) {
      return {
        configured: true,
        connected: false,
        error: this._sanitizeError(err.message)
      };
    }
  }

  /**
   * Uploads a local file buffer or archive to Google Drive using multipart upload.
   * Safety Guarantee: Upload failure NEVER deletes or damages the local backup file.
   *
   * @param {string} localFilePath
   * @param {string} remotePath
   * @param {object} [metadata={}]
   * @returns {Promise<{ success: boolean, fileId?: string, remotePath: string, size?: number, error?: string, skipped?: boolean }>}
   */
  async uploadFile(localFilePath, remotePath, metadata = {}) {
    if (!this.isConfigured()) {
      logger.info(`[Google Drive] Skipping cloud upload of "${remotePath}": Google Drive credentials not configured.`);
      return { success: false, skipped: true, message: 'Google Drive credentials are not set in environment.' };
    }

    if (!fs.existsSync(localFilePath)) {
      throw new Error(`Local file not found for upload: ${localFilePath}`);
    }

    const { category, filename } = this._parseRemotePath(remotePath);
    const fileBuffer = fs.readFileSync(localFilePath);
    const token = await this._getAccessToken();
    const folderId = await this._ensureCategoryFolder(category);

    // Prevent duplicate files with identical names: check if older version exists and prune it
    try {
      const existing = await this._findFile(remotePath);
      if (existing && existing.id) {
        const delUrl = `https://www.googleapis.com/drive/v3/files/${existing.id}`;
        await this._fetchWithTimeout(delUrl, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }, 1);
      }
    } catch (_) {
      // Non-critical, continue with upload
    }

    const fileMetadata = {
      name: filename,
      parents: [folderId],
      description: 'Hooram Studio Automated Backup',
      properties: {
        uploadedAt: new Date().toISOString(),
        sha256Checksum: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
        ...metadata
      }
    };

    const RESUMABLE_THRESHOLD = 5 * 1024 * 1024; // 5 MB threshold

    try {
      let resData;

      if (fileBuffer.length >= RESUMABLE_THRESHOLD) {
        // Resumable Upload for large archives (Uploads archives >= 5 MB)
        const initUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';
        const initRes = await this._fetchWithTimeout(initUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Upload-Content-Type': 'application/octet-stream',
            'X-Upload-Content-Length': String(fileBuffer.length)
          },
          body: JSON.stringify(fileMetadata)
        }, 2);

        if (!initRes.ok) {
          const errText = await initRes.text();
          throw new Error(`Resumable upload session initialization failed [HTTP ${initRes.status}]: ${this._sanitizeError(errText)}`);
        }

        const locationUrl = initRes.headers.get('location');
        if (!locationUrl) {
          throw new Error('Google Drive did not return a valid Resumable Upload Location header.');
        }

        const uploadRes = await this._fetchWithTimeout(locationUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(fileBuffer.length)
          },
          body: fileBuffer
        }, 2);

        if (uploadRes.status === 200 || uploadRes.status === 201) {
          resData = await uploadRes.json();
        } else {
          const errText = await uploadRes.text();
          throw new Error(`Resumable upload stream failed [HTTP ${uploadRes.status}]: ${this._sanitizeError(errText)}`);
        }
      } else {
        // Standard Multipart Upload for smaller files (< 5 MB, e.g. database snapshots)
        const boundary = `-------HooramBackupBoundary${Date.now()}`;

        const metadataPart = Buffer.from(
          `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(fileMetadata)}\r\n`
        );
        const mediaHeader = Buffer.from(
          `--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`
        );
        const endPart = Buffer.from(`\r\n--${boundary}--`);

        const multipartBody = Buffer.concat([
          metadataPart,
          mediaHeader,
          fileBuffer,
          endPart
        ]);

        const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        const res = await this._fetchWithTimeout(uploadUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'Content-Length': String(multipartBody.length)
          },
          body: multipartBody
        }, 2);

        if (res.status === 200 || res.status === 201) {
          resData = await res.json();
        } else {
          const errText = await res.text();
          throw new Error(`Multipart upload failed [HTTP ${res.status}]: ${this._sanitizeError(errText)}`);
        }
      }

      logger.success(`[Google Drive] Successfully uploaded "${remotePath}" (${(fileBuffer.length / 1024).toFixed(1)} KB, ID: ${resData.id})`);
      return {
        success: true,
        fileId: resData.id,
        remotePath,
        size: fileBuffer.length
      };
    } catch (err) {
      const sanitized = this._sanitizeError(err.message);
      logger.error(`[Google Drive] Network error during upload of "${remotePath}": ${sanitized}. Local file is safely preserved.`);
      return { success: false, error: sanitized };
    }
  }

  /**
   * Downloads a remote file from Google Drive to local destination.
   * @param {string} remotePath
   * @param {string} localDestinationPath
   */
  async downloadFile(remotePath, localDestinationPath) {
    if (!this.isConfigured()) {
      throw new Error('Google Drive is not configured.');
    }

    const file = await this._findFile(remotePath);
    if (!file) {
      throw new Error(`File not found in Google Drive: ${remotePath}`);
    }

    const token = await this._getAccessToken();
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;

    const res = await this._fetchWithTimeout(downloadUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }, 2);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Download failed [HTTP ${res.status}]: ${this._sanitizeError(errText)}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const destDir = path.dirname(localDestinationPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(localDestinationPath, buffer);
    logger.success(`[Google Drive] Downloaded "${remotePath}" to "${localDestinationPath}" (${(buffer.length / 1024).toFixed(1)} KB)`);

    return {
      success: true,
      localPath: localDestinationPath,
      size: buffer.length
    };
  }

  /**
   * Lists backup files in a given category folder (e.g. 'database' or 'uploads').
   * @param {string} [prefix='']
   * @returns {Promise<Array<{ filename: string, remotePath: string, size: number, id: string, mtime: string }>>}
   */
  async listFiles(prefix = '') {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const category = prefix.replace(/\\/g, '/').split('/')[0] || '';
      const folderId = await this._ensureCategoryFolder(category);
      const token = await this._getAccessToken();

      const q = `'${folderId}' in parents and trashed = false`;
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,size,modifiedTime,properties)&pageSize=100`;

      const res = await this._fetchWithTimeout(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      }, 2);

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      return (data.files || []).map((f) => ({
        filename: f.name,
        remotePath: category ? `${category}/${f.name}` : f.name,
        size: Number(f.size) || 0,
        id: f.id,
        mtime: f.modifiedTime
      }));
    } catch (err) {
      logger.warn(`[Google Drive] Failed to list files for prefix "${prefix}":`, this._sanitizeError(err.message));
      return [];
    }
  }

  /**
   * Deletes a remote backup file by its remote path.
   * Used by GFS Retention to prune expired remote archives.
   * @param {string} remotePath
   * @returns {Promise<{ success: boolean, deleted: boolean }>}
   */
  async deleteFile(remotePath) {
    if (!this.isConfigured()) {
      return { success: false, deleted: false };
    }

    try {
      const file = await this._findFile(remotePath);
      if (!file) {
        return { success: true, deleted: false, message: 'File not found on remote.' };
      }

      const token = await this._getAccessToken();
      const deleteUrl = `https://www.googleapis.com/drive/v3/files/${file.id}`;

      const res = await this._fetchWithTimeout(deleteUrl, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }, 2);

      if (res.status === 204 || res.status === 200) {
        logger.info(`[Google Drive] Pruned expired cloud backup: ${remotePath}`);
        return { success: true, deleted: true };
      } else {
        const text = await res.text();
        logger.warn(`[Google Drive] Could not delete "${remotePath}" [HTTP ${res.status}]:`, this._sanitizeError(text));
        return { success: false, deleted: false };
      }
    } catch (err) {
      logger.warn(`[Google Drive] Error deleting file "${remotePath}":`, this._sanitizeError(err.message));
      return { success: false, deleted: false, error: this._sanitizeError(err.message) };
    }
  }

  /**
   * Checks if a file exists on remote Google Drive.
   * @param {string} remotePath
   * @returns {Promise<boolean>}
   */
  async fileExists(remotePath) {
    try {
      const file = await this._findFile(remotePath);
      return Boolean(file);
    } catch (_) {
      return false;
    }
  }

  /**
   * Gets metadata for a remote file in Google Drive.
   * @param {string} remotePath
   * @returns {Promise<object|null>}
   */
  async getFileMetadata(remotePath) {
    try {
      const file = await this._findFile(remotePath);
      if (!file) return null;
      return {
        exists: true,
        id: file.id,
        filename: file.name,
        remotePath,
        size: Number(file.size) || 0,
        mtime: file.modifiedTime
      };
    } catch (_) {
      return null;
    }
  }
}

export const googleDriveAdapter = new GoogleDriveAdapter();
