import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect x="18" y="60" width="64" height="18" rx="9" fill="#e4572e" opacity="0.9" />
  <rect x="26" y="41" width="48" height="18" rx="9" fill="#221d15" />
  <rect x="34" y="22" width="32" height="18" rx="9" fill="#221d15" opacity="0.7" />
</svg>
`;

async function generate() {
  const root = path.join(__dirname, '..');
  
  // Ensure directories exist
  fs.mkdirSync(path.join(root, 'public', 'brand'), { recursive: true });
  fs.mkdirSync(path.join(root, 'public', 'icons'), { recursive: true });
  fs.mkdirSync(path.join(root, 'app'), { recursive: true });

  const svgBuffer = Buffer.from(svg);

  // 1. public/brand/struq-mark-256.png (256x256)
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile(path.join(root, 'public', 'brand', 'struq-mark-256.png'));
  console.log('Generated struq-mark-256.png');

  // 2. public/brand/struq-logo.png (256x256)
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile(path.join(root, 'public', 'brand', 'struq-logo.png'));
  console.log('Generated struq-logo.png');

  // 3. public/icons/icon-192.png (192x192)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(root, 'public', 'icons', 'icon-192.png'));
  console.log('Generated icon-192.png');

  // 4. public/icons/icon-512.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(root, 'public', 'icons', 'icon-512.png'));
  console.log('Generated icon-512.png');

  // 5. app/favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(root, 'app', 'favicon.ico'));
  console.log('Generated app/favicon.ico');

  // 6. app/apple-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(root, 'app', 'apple-icon.png'));
  console.log('Generated app/apple-icon.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
