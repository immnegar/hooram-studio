import crypto from 'crypto';
import fs from 'fs';

const MAGIC_HEADER = Buffer.from('HOORAM_ENC_V1', 'utf8'); // 13 bytes
const IV_LENGTH = 12; // 12 bytes for AES-GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes auth tag

/**
 * Derives a consistent 32-byte AES-256 key from a passphrase or hex string.
 * @param {string} rawKey
 * @returns {Buffer}
 */
export function deriveKey(rawKey) {
  if (!rawKey) {
    throw new Error('BACKUP_ENCRYPTION_KEY is required for encryption/decryption operations.');
  }
  // If it's already a 64-char hex string (32 bytes), convert directly
  if (/^[0-9a-fA-F]{64}$/.test(rawKey.trim())) {
    return Buffer.from(rawKey.trim(), 'hex');
  }
  // Otherwise derive using scrypt
  return crypto.scryptSync(rawKey, 'hooram-studio-backup-salt-v1', 32);
}

/**
 * Calculates SHA-256 checksum of a buffer or file.
 * @param {Buffer|string} input
 * @returns {string}
 */
export function calculateChecksum(input) {
  const hash = crypto.createHash('sha256');
  if (Buffer.isBuffer(input)) {
    hash.update(input);
  } else if (typeof input === 'string') {
    if (fs.existsSync(input)) {
      const fileBuffer = fs.readFileSync(input);
      hash.update(fileBuffer);
    } else {
      hash.update(input, 'utf8');
    }
  }
  return hash.digest('hex');
}

/**
 * Encrypts a buffer using AES-256-GCM.
 * Packed format: [MAGIC_HEADER(13)][IV(12)][AUTH_TAG(16)][CIPHERTEXT]
 * @param {Buffer} buffer
 * @param {string} rawKey
 * @returns {Buffer}
 */
export function encryptBuffer(buffer, rawKey) {
  const key = deriveKey(rawKey);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([MAGIC_HEADER, iv, authTag, encrypted]);
}

/**
 * Decrypts a buffer encrypted with encryptBuffer.
 * @param {Buffer} encryptedBuffer
 * @param {string} rawKey
 * @returns {Buffer}
 */
export function decryptBuffer(encryptedBuffer, rawKey) {
  const key = deriveKey(rawKey);

  const headerLength = MAGIC_HEADER.length;
  const header = encryptedBuffer.subarray(0, headerLength);
  if (!header.equals(MAGIC_HEADER)) {
    throw new Error('Invalid archive: Missing or unrecognized encryption header.');
  }

  const iv = encryptedBuffer.subarray(headerLength, headerLength + IV_LENGTH);
  const authTag = encryptedBuffer.subarray(headerLength + IV_LENGTH, headerLength + IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = encryptedBuffer.subarray(headerLength + IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

/**
 * Encrypts a file on disk and writes to destination.
 * @param {string} srcPath
 * @param {string} destPath
 * @param {string} rawKey
 * @returns {{ sourceChecksum: string, encryptedChecksum: string, originalSize: number, encryptedSize: number }}
 */
export function encryptFile(srcPath, destPath, rawKey) {
  const data = fs.readFileSync(srcPath);
  const sourceChecksum = calculateChecksum(data);
  const encrypted = encryptBuffer(data, rawKey);
  const encryptedChecksum = calculateChecksum(encrypted);

  fs.writeFileSync(destPath, encrypted);

  return {
    sourceChecksum,
    encryptedChecksum,
    originalSize: data.length,
    encryptedSize: encrypted.length
  };
}

/**
 * Decrypts a file on disk and writes to destination.
 * @param {string} srcPath
 * @param {string} destPath
 * @param {string} rawKey
 * @returns {{ decryptedChecksum: string, decryptedSize: number }}
 */
export function decryptFile(srcPath, destPath, rawKey) {
  const encryptedData = fs.readFileSync(srcPath);
  const decrypted = decryptBuffer(encryptedData, rawKey);
  const decryptedChecksum = calculateChecksum(decrypted);

  fs.writeFileSync(destPath, decrypted);

  return {
    decryptedChecksum,
    decryptedSize: decrypted.length
  };
}

/**
 * Validates whether an encrypted archive is authentic and can be decrypted with the key.
 * @param {string} filePath
 * @param {string} rawKey
 * @returns {{ valid: boolean, error?: string, size?: number }}
 */
export function validateEncryptedArchive(filePath, rawKey) {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'Archive file does not exist.' };
    }
    const encryptedData = fs.readFileSync(filePath);
    const decrypted = decryptBuffer(encryptedData, rawKey);
    return { valid: true, size: decrypted.length };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

