import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const compressible = new Set([
  '.js',
  '.css',
  '.html',
  '.svg',
  '.json',
  '.webmanifest',
  '.xml',
  '.txt',
  '.mjs',
  '.map',
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      return;
    }

    if (!compressible.has(extname(entry.name))) {
      return;
    }

    const info = await stat(path);
    if (info.size < 1024) {
      return;
    }

    const source = await readFile(path);
    await writeFile(`${path}.gz`, gzipSync(source, { level: 9 }));
  }));
}

await walk(distDir);
console.log('precompress: generated .gz assets for nginx gzip_static');
