import {readdir, readFile} from 'node:fs/promises';
import {basename, dirname, extname} from 'node:path';

// Read the encoded dimensions, not a guessed height from the filename.
export function webpDimensions(data) {
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Invalid WebP');
  const type = data.toString('ascii', 12, 16);
  if (type === 'VP8X') return [data.readUIntLE(24, 3) + 1, data.readUIntLE(27, 3) + 1];
  if (type === 'VP8 ') return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff];
  if (type === 'VP8L') {
    const bits = data.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
  }
  throw new Error(`Unsupported WebP chunk: ${type}`);
}

export async function loadThumbnails(root, items) {
  const result = new Map();
  for (const source of new Set(items.map(item => item.image))) {
    const directory = `${dirname(source)}/thumbnails/`;
    const stem = basename(source, extname(source));
    let files;
    try { files = await readdir(new URL(directory, root)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    const candidates = [];
    for (const file of files) {
      if (!file.startsWith(`${stem}-`) || !/^\d+\.webp$/.test(file.slice(stem.length + 1))) continue;
      const path = directory + file;
      const [width, height] = webpDimensions(await readFile(new URL(path, root)));
      if (file !== `${stem}-${width}.webp`) throw new Error(`Incorrect thumbnail width: ${path}`);
      candidates.push({path, width, height});
    }
    if (candidates.length) result.set(source, candidates.sort((a, b) => a.width - b.width));
  }
  return result;
}

// Match the existing sidebar, content padding, columns, and gallery gaps.
export function imageSizes(section) {
  return section === 'events'
    ? '(max-width: 700px) calc((100vw - 64px) / 2), (max-width: 1100px) calc((100vw - 312px) / 2), (min-width: 1700px) calc((100vw - 438px) / 3), calc((100vw - 390px) / 3)'
    : '(max-width: 480px) calc(100vw - 48px), (max-width: 700px) calc((100vw - 66px) / 2), (max-width: 1100px) calc((100vw - 315px) / 2), (min-width: 1700px) calc((100vw - 454px) / 3), calc((100vw - 396px) / 3)';
}
