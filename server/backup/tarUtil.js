import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Creates a standard 512-byte ustar header with prefix support for paths up to 255 bytes.
 * Throws an explicit, controlled error if a path cannot be safely accommodated.
 */
function createTarHeader(name, size, mode = 0o644, isDir = false) {
  const header = Buffer.alloc(512);

  // Normalize path with forward slashes
  let cleanName = name.replace(/\\/g, '/');
  if (isDir && !cleanName.endsWith('/')) cleanName += '/';

  let namePart = cleanName;
  let prefixPart = '';

  if (cleanName.length > 100) {
    if (cleanName.length > 255) {
      throw new Error(`Archive Error: Path exceeds maximum supported TAR length (255 chars): "${cleanName}"`);
    }

    // Attempt to split at a slash such that prefix <= 155 and name <= 100
    const lastSlash = cleanName.lastIndexOf('/');
    if (lastSlash === -1 || lastSlash > 155 || (cleanName.length - lastSlash - 1) > 100) {
      throw new Error(`Archive Error: Path cannot be split into standard USTAR prefix/name boundaries: "${cleanName}"`);
    }

    prefixPart = cleanName.slice(0, lastSlash);
    namePart = cleanName.slice(lastSlash + 1);
  }

  // name (100 bytes, null-padded)
  header.write(namePart.slice(0, 100), 0, 100, 'utf8');

  // mode (8 bytes, octal)
  header.write((mode & 0o7777).toString(8).padStart(7, '0') + '\0', 100, 8, 'ascii');

  // uid (8 bytes)
  header.write('0001000\0', 108, 8, 'ascii');

  // gid (8 bytes)
  header.write('0001000\0', 116, 8, 'ascii');

  // size (12 bytes, octal)
  const sizeOctal = isDir ? '00000000000\0' : size.toString(8).padStart(11, '0') + '\0';
  header.write(sizeOctal, 124, 12, 'ascii');

  // mtime (12 bytes)
  const mtimeOctal = Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0';
  header.write(mtimeOctal, 136, 12, 'ascii');

  // chksum (8 bytes, initial spaces)
  header.write('        ', 148, 8, 'ascii');

  // typeflag (1 byte)
  header.write(isDir ? '5' : '0', 156, 1, 'ascii');

  // magic (6 bytes)
  header.write('ustar\0', 257, 6, 'ascii');

  // version (2 bytes)
  header.write('00', 263, 2, 'ascii');

  // prefix (155 bytes, null-padded)
  if (prefixPart) {
    header.write(prefixPart.slice(0, 155), 345, 155, 'utf8');
  }

  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 512; i++) {
    sum += header[i];
  }
  header.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii');

  return header;
}

/**
 * Packs a directory into a standard .tar buffer.
 * @param {string} sourceDir
 * @param {string} [prefix='']
 * @returns {Buffer}
 */
export function packDirectoryToTar(sourceDir, prefix = '') {
  const chunks = [];

  function walk(currentDir, relativePath) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const entryRelPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        const header = createTarHeader(entryRelPath, 0, 0o755, true);
        chunks.push(header);
        walk(fullPath, entryRelPath);
      } else if (entry.isFile()) {
        const stat = fs.statSync(fullPath);
        const header = createTarHeader(entryRelPath, stat.size, 0o644, false);
        chunks.push(header);

        const fileData = fs.readFileSync(fullPath);
        chunks.push(fileData);

        // Pad file data to 512-byte boundary
        const remainder = stat.size % 512;
        if (remainder !== 0) {
          const padding = Buffer.alloc(512 - remainder);
          chunks.push(padding);
        }
      }
    }
  }

  walk(sourceDir, prefix);

  // Two 512-byte zero blocks to signal end of archive
  chunks.push(Buffer.alloc(1024));

  return Buffer.concat(chunks);
}

/**
 * Packs a directory and compresses it to .tar.gz.
 * @param {string} sourceDir
 * @returns {Buffer}
 */
export function packDirectoryToTarGz(sourceDir) {
  const tarBuffer = packDirectoryToTar(sourceDir);
  return zlib.gzipSync(tarBuffer, { level: 6 });
}

/**
 * Validates and safely resolves an archive entry path against targetDir.
 * Protects against Zip Slip, Tar Slip, sibling prefix attacks, absolute paths, and Windows-specific traversals.
 * @param {string} name Raw entry name from TAR header
 * @param {string} targetDir Intended extraction directory
 * @returns {string} Fully resolved and validated destination path
 */
export function validateAndResolveTarPath(name, targetDir) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Security Error: TAR entry has an empty filename.');
  }

  // Reject embedded null bytes
  if (name.includes('\0')) {
    throw new Error(`Security Error: Poison null byte detected in TAR entry: "${name.replace(/\0/g, '\\0')}"`);
  }

  const raw = name.trim();

  // 1. Reject absolute paths (POSIX and Windows)
  if (path.isAbsolute(raw) || raw.startsWith('/') || raw.startsWith('\\')) {
    throw new Error(`Security Error: Absolute path in TAR entry is rejected: "${name}"`);
  }

  // 2. Reject Windows drive letters (e.g. C:, D:) or UNC network shares (\\)
  if (/^[a-zA-Z]:/i.test(raw) || raw.startsWith('\\\\')) {
    throw new Error(`Security Error: Windows drive letter or UNC path in TAR entry is rejected: "${name}"`);
  }

  // 3. Reject dot-dot ('..') directory traversal components
  const rawSegments = raw.split(/[/\\]/);
  if (rawSegments.includes('..')) {
    throw new Error(`Security Error: Parent directory traversal ("..") in TAR entry is rejected: "${name}"`);
  }

  // 4. Resolve destination and target paths
  const resolvedTarget = path.resolve(targetDir);
  const resolvedDest = path.resolve(resolvedTarget, raw);

  // 5. Robust path containment using path.relative()
  const relative = path.relative(resolvedTarget, resolvedDest);

  if (relative === '') {
    return resolvedTarget;
  }

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Security Error: Path traversal escape detected in TAR entry: "${name}"`);
  }

  // 6. Explicit check against sibling directory prefix attacks (e.g. /target-evil matching /target)
  if (resolvedDest !== resolvedTarget && !resolvedDest.startsWith(resolvedTarget + path.sep)) {
    throw new Error(`Security Error: Sibling directory boundary escape detected in TAR entry: "${name}"`);
  }

  // 7. Prevent symlink escapes: Ensure no segment along the resolved path is a pre-existing symbolic link
  let currentCheck = resolvedTarget;
  const relSegments = relative.split(path.sep);
  for (const segment of relSegments) {
    currentCheck = path.join(currentCheck, segment);
    if (fs.existsSync(currentCheck)) {
      const lstat = fs.lstatSync(currentCheck);
      if (lstat.isSymbolicLink()) {
        throw new Error(`Security Error: Symlink detected along extraction path: "${currentCheck}". Extraction aborted.`);
      }
    }
  }

  return resolvedDest;
}

/**
 * Unpacks a .tar buffer into a destination directory with USTAR prefix and PAX extended header support.
 * @param {Buffer} tarBuffer
 * @param {string} targetDir
 * @returns {{ extractedFiles: string[], count: number }}
 */
export function unpackTar(tarBuffer, targetDir) {
  const extractedFiles = [];
  let offset = 0;
  let nextPaxPath = null;

  const resolvedTarget = path.resolve(targetDir);
  if (!fs.existsSync(resolvedTarget)) {
    fs.mkdirSync(resolvedTarget, { recursive: true });
  }

  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);

    // Check for null block (end of archive)
    if (header.every((b) => b === 0)) {
      break;
    }

    // Read filename (null-terminated, max 100 bytes)
    let nameEnd = 0;
    while (nameEnd < 100 && header[nameEnd] !== 0) nameEnd++;
    let name = header.subarray(0, nameEnd).toString('utf8');

    // Read size (octal)
    const sizeStr = header.subarray(124, 136).toString('ascii').trim().replace(/\0/g, '');
    const size = parseInt(sizeStr, 8) || 0;

    // Typeflag verification
    const typeflag = String.fromCharCode(header[156]);

    // Read USTAR prefix if present (bytes 345..500)
    let prefixEnd = 0;
    while (prefixEnd < 155 && header[345 + prefixEnd] !== 0) prefixEnd++;
    if (prefixEnd > 0) {
      const prefix = header.subarray(345, 345 + prefixEnd).toString('utf8');
      name = `${prefix}/${name}`;
    }

    offset += 512;

    // Handle PAX Extended Header ('x')
    if (typeflag === 'x') {
      const paxData = tarBuffer.subarray(offset, offset + size).toString('utf8');
      const lines = paxData.split('\n');
      for (const line of lines) {
        const match = line.match(/^\d+\s+([^=]+)=(.*)$/);
        if (match && match[1] === 'path') {
          nextPaxPath = match[2];
        }
      }
      const remainder = size % 512;
      const padding = remainder === 0 ? 0 : 512 - remainder;
      offset += size + padding;
      continue;
    }

    // If preceding entry was PAX, use its path override
    if (nextPaxPath) {
      name = nextPaxPath;
      nextPaxPath = null;
    }

    // Reject dangerous or unsupported TAR entry types (symlinks, hardlinks, character/block devices, FIFOs)
    const isRegularFile = typeflag === '0' || typeflag === '\0';
    const isDirectory = typeflag === '5' || name.endsWith('/');

    if (!isRegularFile && !isDirectory) {
      throw new Error(`Security Error: Unsupported or dangerous TAR entry typeflag '${typeflag}' for entry: "${name}"`);
    }

    // Validate path and prevent directory traversal / sibling escape
    const destPath = validateAndResolveTarPath(name, resolvedTarget);

    if (isDirectory) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
    } else {
      const parentDir = path.dirname(destPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      // Check if destination exists and is a symlink (do not follow existing symlinks)
      if (fs.existsSync(destPath)) {
        const lstat = fs.lstatSync(destPath);
        if (lstat.isSymbolicLink()) {
          throw new Error(`Security Error: Destination is an existing symbolic link: "${destPath}"`);
        }
      }

      const fileData = tarBuffer.subarray(offset, offset + size);
      fs.writeFileSync(destPath, fileData);
      extractedFiles.push(name);

      // Advance offset past file data and padding
      const remainder = size % 512;
      const padding = remainder === 0 ? 0 : 512 - remainder;
      offset += size + padding;
    }
  }

  return {
    extractedFiles,
    count: extractedFiles.length
  };
}

/**
 * Decompresses and unpacks a .tar.gz buffer into a destination directory.
 * @param {Buffer} tarGzBuffer
 * @param {string} targetDir
 * @returns {{ extractedFiles: string[], count: number }}
 */
export function unpackTarGz(tarGzBuffer, targetDir) {
  const tarBuffer = zlib.gunzipSync(tarGzBuffer);
  return unpackTar(tarBuffer, targetDir);
}
