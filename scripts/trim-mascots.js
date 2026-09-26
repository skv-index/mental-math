// Script to trim uneven transparent padding from mascot PNGs
// and re-center them in a square canvas so object-contain centers correctly
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');

async function trimAndCenter(filePath, size = 1024) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;

  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * c + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const contentW = maxX - minX + 1;
  const contentH = maxY - minY + 1;
  const pad = Math.round(Math.max(contentW, contentH) * 0.08);

  const cropLeft   = Math.max(0, minX - pad);
  const cropTop    = Math.max(0, minY - pad);
  const cropWidth  = Math.min(w, maxX + pad + 1) - cropLeft;
  const cropHeight = Math.min(h, maxY + pad + 1) - cropTop;

  await sharp(filePath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(filePath + '.tmp');

  // Atomic replace
  fs.renameSync(filePath + '.tmp', filePath);
  console.log('Trimmed & centered:', path.basename(filePath));
}

const files = fs.readdirSync(PUBLIC_DIR).filter(f => f.startsWith('mascot-') && f.endsWith('.png'));
Promise.all(files.map(f => trimAndCenter(path.join(PUBLIC_DIR, f))))
  .then(() => console.log('All done!'))
  .catch(console.error);
