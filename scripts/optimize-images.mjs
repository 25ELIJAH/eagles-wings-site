// Builds responsive WebP images from the photo sources, plus favicons and the social-share image.
//
//   assets/stock/*.jpg          stand-in photos (committed)
//   assets/photos/<name>.jpg    YOUR photos. Same names as before (hero, martin, gallery-1 ...). They win over stand-ins.
//
// Output (git-ignored, regenerated on every build):
//   public/img/<source>-<width>.webp, public/favicon-*.png, public/apple-touch-icon.png, public/og-default.jpg
//   src/data/images.generated.json  (dimensions and available widths, read by src/lib/photos.ts)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const dirs = { stock: path.join(root, 'assets', 'stock'), own: path.join(root, 'assets', 'photos') };
const outDir = path.join(root, 'public', 'img');
const manifestPath = path.join(root, 'src', 'data', 'images.generated.json');
const WIDTHS = [480, 800, 1200, 1600, 2000];
const EXT = /\.(jpe?g|png|webp)$/i;

fs.mkdirSync(outDir, { recursive: true });
const manifest = {};
let made = 0;

for (const [kind, dir] of Object.entries(dirs)) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => EXT.test(f))) {
    const name = file.replace(EXT, '');
    const srcPath = path.join(dir, file);
    const srcTime = fs.statSync(srcPath).mtimeMs;
    const meta = await sharp(srcPath).rotate().metadata();
    const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width), Math.min(meta.width, 2000)])].sort((a, b) => a - b);
    for (const w of widths) {
      const out = path.join(outDir, `${kind}-${name}-${w}.webp`);
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= srcTime) continue;
      await sharp(srcPath).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(out);
      made++;
    }
    manifest[`${kind}:${name}`] = { w: meta.width, h: meta.height, widths };
  }
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// logo in the sizes the site actually shows (header/footer 46px, loading screen 190px; 2x for sharp screens)
const logoSrc = path.join(root, 'public', 'images', 'logo.jpg');
if (fs.existsSync(logoSrc)) {
  for (const w of [96, 192, 190, 380]) {
    const out = path.join(outDir, `logo-${w}.webp`);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(logoSrc).mtimeMs) continue;
    await sharp(logoSrc).resize({ width: w }).webp({ quality: 82 }).toFile(out);
    made++;
  }
}

// favicons + social card from the logo
const logo = path.join(root, 'public', 'images', 'logo.jpg');
if (fs.existsSync(logo)) {
  const pub = (f) => path.join(root, 'public', f);
  const need = (f) => !fs.existsSync(pub(f)) || fs.statSync(pub(f)).mtimeMs < fs.statSync(logo).mtimeMs;
  if (need('favicon-32.png')) await sharp(logo).resize(32, 32, { fit: 'contain', background: '#fff' }).png().toFile(pub('favicon-32.png'));
  if (need('apple-touch-icon.png')) await sharp(logo).resize(180, 180, { fit: 'contain', background: '#fff' }).png().toFile(pub('apple-touch-icon.png'));
  if (need('og-default.jpg')) {
    const mark = await sharp(logo).resize({ height: 560, fit: 'contain', background: '#fff' }).toBuffer();
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
      .composite([{ input: mark, gravity: 'center' }]).jpeg({ quality: 88 }).toFile(pub('og-default.jpg'));
  }
}
console.log(`images: ${Object.keys(manifest).length} sources, ${made} files written`);
