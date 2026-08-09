import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceIcon = path.join('public', 'favicon-512x512.png');

const densities = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const fileNames = [
  'ic_launcher.png',
  'ic_launcher_round.png',
  'ic_launcher_foreground.png'
];

if (!fs.existsSync(sourceIcon)) {
  throw new Error(`Source icon not found: ${sourceIcon}`);
}

for (const [density, size] of Object.entries(densities)) {
  const dir = path.join(
    'android',
    'app',
    'src',
    'main',
    'res',
    density
  );

  fs.mkdirSync(dir, { recursive: true });

  for (const fileName of fileNames) {
    const output = path.join(dir, fileName);

    await sharp(sourceIcon)
      .resize(size, size, {
        fit: 'contain',
        background: {
          r: 255,
          g: 255,
          b: 255,
          alpha: 0
        }
      })
      .png({
        compressionLevel: 9
      })
      .toFile(output);

    console.log(`Created: ${output}`);
  }
}

console.log('All Android launcher icons generated successfully.');
