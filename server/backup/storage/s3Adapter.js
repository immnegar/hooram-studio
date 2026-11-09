import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { config } from '../config.js';
import { logger } from '../logger.js';

/**
 * Lightweight, zero-dependency S3 / Cloudflare R2 Storage Adapter using AWS Signature Version 4.
 * Includes explicit request timeouts, transient error retry handling, and credential sanitization.
 */
export class S3Adapter {
  constructor(r2Config = config.r2) {
    this.name = 'S3 / Cloudflare R2';
    this.provider = 's3';

    this.accountId = r2Config.accountId?.trim() || '';
    this.accessKeyId = r2Config.accessKeyId?.trim() || '';
    this.secretAccessKey = r2Config.secretAccessKey?.trim() || '';
    this.bucketName = r2Config.bucketName?.trim() || '';

    // Compute endpoint: if explicit endpoint is given use it; otherwise compute from accountId
    let endpoint = r2Config.endpoint?.trim() || '';
    if (!endpoint && this.accountId) {
      endpoint = `https://${this.accountId}.r2.cloudflarestorage.com`;
    }
    this.endpoint = endpoint.replace(/\/+$/, '');
    this.region = 'auto'; // Cloudflare R2 uses 'auto'

    // Default network timeout: 60 seconds (SEC-02)
    this.timeoutMs = 60000;
  }

  /**
   * Checks whether all necessary credentials and endpoint configurations are present.
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(
      this.accessKeyId &&
      this.secretAccessKey &&
      this.bucketName &&
      this.endpoint
    );
  }

  /**
   * Generates AWS SigV4 authorization headers.
   * Note: The secretAccessKey is used ONLY internally for HMAC calculation and is never returned or logged.
   */
  _signRequest(method, pathname, query = {}, headers = {}, payloadHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855') {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    const urlObj = new URL(`${this.endpoint}/${this.bucketName}${pathname.startsWith('/') ? '' : '/'}${pathname}`);
    const host = urlObj.host;

    const requestHeaders = {
      ...headers,
      host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash
    };

    // Canonical Query String
    const canonicalQuery = Object.keys(query)
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
      .join('&');

    // Canonical Headers
    const sortedHeaderKeys = Object.keys(requestHeaders)
      .map((k) => k.toLowerCase())
      .sort();

    const canonicalHeaders = sortedHeaderKeys
      .map((k) => `${k}:${requestHeaders[k].trim()}\n`)
      .join('');

    const signedHeaders = sortedHeaderKeys.join(';');

    // Canonical Request
    const canonicalRequest = [
      method.toUpperCase(),
      urlObj.pathname,
      canonicalQuery,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    // String to Sign
    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex');
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      canonicalRequestHash
    ].join('\n');

    // Signing Key (HMAC derivation)
    const kDate = crypto.createHmac('sha256', `AWS4${this.secretAccessKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(this.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

    requestHeaders['authorization'] = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      url: urlObj.toString() + (canonicalQuery ? `?${canonicalQuery}` : ''),
      headers: requestHeaders
    };
  }

  /**
   * Executes a fetch request with an explicit timeout and limited transient error retries.
   * Sanitizes error logs to prevent leaking auth headers or keys.
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

        // If transient 5xx server error, retry
        if (res.status >= 500 && res.status <= 504 && attempt <= maxRetries) {
          logger.warn(`[R2 Storage] Server returned HTTP ${res.status}. Retrying attempt ${attempt}/${maxRetries}...`);
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
          logger.warn(`[R2 Storage] Transient network failure (${reason}). Retrying attempt ${attempt}/${maxRetries}...`);
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        }
        break;
      }
    }

    // Sanitize error message to guarantee no auth signature or secrets leak
    const sanitizedMsg = (lastError.message || 'Unknown network error')
      .replace(/AWS4-HMAC-SHA256[^"\r\n]*/gi, '[REDACTED_AUTH_HEADER]')
      .replace(/Credential=[^\s,]+/gi, 'Credential=[REDACTED]')
      .replace(/Signature=[^\s,]+/gi, 'Signature=[REDACTED]');

    const isTimeout = lastError.name === 'TimeoutError' || lastError.name === 'AbortError';
    const finalErr = new Error(isTimeout ? `R2 network request timed out after ${this.timeoutMs / 1000} seconds.` : `R2 network request failed: ${sanitizedMsg}`);
    finalErr.isTimeout = isTimeout;
    throw finalErr;
  }

  /**
   * Tests connectivity to Cloudflare R2 bucket.
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return {
        configured: false,
        message: 'Cloudflare R2 is not configured. Missing required environment variables (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ACCOUNT_ID).'
      };
    }

    try {
      const { url, headers } = this._signRequest('GET', '', { 'list-type': '2', 'max-keys': '1' });
      const res = await this._fetchWithTimeout(url, { method: 'GET', headers }, 1);

      if (res.status === 200) {
        return { configured: true, connected: true, status: 200, message: 'Successfully connected to Cloudflare R2 Bucket.' };
      } else {
        const text = await res.text();
        return { configured: true, connected: false, status: res.status, error: text };
      }
    } catch (err) {
      return { configured: true, connected: false, error: err.message, isTimeout: !!err.isTimeout };
    }
  }

  /**
   * Uploads a file buffer or stream to the S3 bucket.
   * Safety Guarantee: Upload failure NEVER deletes or damages the local backup file.
   * @param {string} localFilePath
   * @param {string} remoteKey
   * @param {object} [metadata={}]
   */
  async uploadFile(localFilePath, remoteKey, metadata = {}) {
    if (!this.isConfigured()) {
      logger.info(`[R2 Storage] Skipping cloud upload of "${remoteKey}": R2 credentials not configured.`);
      return { success: false, skipped: true, message: 'Cloudflare R2 credentials are not set in environment.' };
    }

    if (!fs.existsSync(localFilePath)) {
      throw new Error(`Local file not found for upload: ${localFilePath}`);
    }

    const fileBuffer = fs.readFileSync(localFilePath);
    const payloadHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const cleanKey = remoteKey.replace(/^\/+/, '');
    const headers = {
      'content-length': String(fileBuffer.length),
      'content-type': 'application/octet-stream'
    };

    // Add optional custom metadata
    Object.keys(metadata).forEach((k) => {
      headers[`x-amz-meta-${k.toLowerCase()}`] = String(metadata[k]);
    });

    const { url, headers: signedHeaders } = this._signRequest('PUT', cleanKey, {}, headers, payloadHash);

    try {
      const res = await this._fetchWithTimeout(url, {
        method: 'PUT',
        headers: signedHeaders,
        body: fileBuffer
      }, 2);

      if (res.status === 200 || res.status === 201) {
        logger.success(`[R2 Storage] Successfully uploaded "${cleanKey}" (${(fileBuffer.length / 1024).toFixed(1)} KB)`);
        return { success: true, remoteKey: cleanKey, size: fileBuffer.length, hash: payloadHash };
      } else {
        const errorText = await res.text();
        logger.error(`[R2 Storage] Upload rejected by server for "${cleanKey}" [HTTP ${res.status}]:`, errorText);
        return { success: false, status: res.status, error: errorText };
      }
    } catch (err) {
      logger.error(`[R2 Storage] Network error during upload of "${cleanKey}": ${err.message}. Local file is safely preserved.`);
      return { success: false, error: err.message, isTimeout: !!err.isTimeout };
    }
  }

  /**
   * Downloads a file from the S3 bucket to a local file path.
   * @param {string} remoteKey
   * @param {string} localDestPath
   */
  async downloadFile(remoteKey, localDestPath) {
    if (!this.isConfigured()) {
      throw new Error('Cannot download from R2: Storage credentials are not configured.');
    }

    const cleanKey = remoteKey.replace(/^\/+/, '');
    const { url, headers } = this._signRequest('GET', cleanKey);

    const res = await this._fetchWithTimeout(url, { method: 'GET', headers }, 2);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to download "${cleanKey}" from R2 [HTTP ${res.status}]: ${errText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const dir = path.dirname(localDestPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(localDestPath, buffer);
    logger.success(`[R2 Storage] Downloaded "${cleanKey}" to ${localDestPath}`);
    return { success: true, size: buffer.length };
  }

  /**
   * Deletes a file from the bucket.
   * @param {string} remoteKey
   */
  async deleteFile(remoteKey) {
    if (!this.isConfigured()) return { success: false, skipped: true };

    const cleanKey = remoteKey.replace(/^\/+/, '');
    const { url, headers } = this._signRequest('DELETE', cleanKey);

    try {
      const res = await this._fetchWithTimeout(url, { method: 'DELETE', headers }, 1);
      return { success: res.status === 204 || res.status === 200 };
    } catch (err) {
      logger.warn(`[R2 Storage] Failed to delete remote file "${cleanKey}": ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Lists files in the S3 bucket with a given prefix.
   * @param {string} [prefix='']
   * @returns {Promise<Array<{ filename: string, remotePath: string, size: number, mtime?: string }>>}
   */
  async listFiles(prefix = '') {
    if (!this.isConfigured()) return [];

    const query = { 'list-type': '2' };
    if (prefix) query.prefix = prefix.replace(/^\/+/, '');

    try {
      const { url, headers } = this._signRequest('GET', '', query);
      const res = await this._fetchWithTimeout(url, { method: 'GET', headers }, 2);

      if (!res.ok) return [];

      const xml = await res.text();
      const files = [];
      const keyMatches = xml.matchAll(/<Contents>[\s\S]*?<Key>(.*?)<\/Key>[\s\S]*?<Size>(\d+)<\/Size>[\s\S]*?(?:<LastModified>(.*?)<\/LastModified>)?[\s\S]*?<\/Contents>/g);

      for (const match of keyMatches) {
        const fullKey = match[1];
        files.push({
          filename: path.basename(fullKey),
          remotePath: fullKey,
          size: parseInt(match[2], 10) || 0,
          mtime: match[3] || null
        });
      }

      return files;
    } catch (err) {
      logger.warn(`[R2 Storage] Failed to list files for prefix "${prefix}": ${err.message}`);
      return [];
    }
  }

  /**
   * Checks if a file exists in the S3 bucket.
   * @param {string} remoteKey
   * @returns {Promise<boolean>}
   */
  async fileExists(remoteKey) {
    if (!this.isConfigured()) return false;
    const cleanKey = remoteKey.replace(/^\/+/, '');
    try {
      const { url, headers } = this._signRequest('HEAD', cleanKey);
      const res = await this._fetchWithTimeout(url, { method: 'HEAD', headers }, 1);
      return res.status === 200;
    } catch (_) {
      return false;
    }
  }

  /**
   * Gets metadata for an object in S3.
   * @param {string} remoteKey
   * @returns {Promise<object|null>}
   */
  async getFileMetadata(remoteKey) {
    if (!this.isConfigured()) return null;
    const cleanKey = remoteKey.replace(/^\/+/, '');
    try {
      const { url, headers } = this._signRequest('HEAD', cleanKey);
      const res = await this._fetchWithTimeout(url, { method: 'HEAD', headers }, 1);
      if (res.status !== 200) return null;
      return {
        exists: true,
        remotePath: cleanKey,
        size: parseInt(res.headers.get('content-length') || '0', 10),
        mtime: res.headers.get('last-modified'),
        etag: res.headers.get('etag')
      };
    } catch (_) {
      return null;
    }
  }
}

export const s3Adapter = new S3Adapter();
