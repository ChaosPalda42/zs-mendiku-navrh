// PNG z generátoru → WebP (šířka max 1400 px) do src/assets/img + náhledy 640 px pro galerie
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const SRC = new URL('../img-src/', import.meta.url), OUT = new URL('../src/assets/img/', import.meta.url);
await mkdir(OUT, { recursive: true });
for (const f of (await readdir(SRC)).filter((f) => f.endsWith('.png'))) {
  const name = f.replace('.png', '');
  const img = sharp(fileURLToPath(new URL(f, SRC)));
  await img.clone().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(fileURLToPath(new URL(`${name}.webp`, OUT)));
  if (name.startsWith('gallery')) await img.clone().resize({ width: 640 }).webp({ quality: 76 }).toFile(fileURLToPath(new URL(`${name}-s.webp`, OUT)));
}
console.log('webp hotovo');
