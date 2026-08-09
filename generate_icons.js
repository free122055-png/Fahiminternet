import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceIcon = path.join(
  'public',
  'file_000000008e4881fa83266c1516f7a4fb.png'
);

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

// A simple valid SVG fallback.
// This prevents the build from failing if the uploaded PNG is invalid.
const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="512"
     height="512"
     viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#ffffff"/>
  <circle cx="256" cy="256" r="175" fill="#111111"/>
  <text x="256"
        y="285"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="110"
        font-weight="bold"
        fill="#ffffff">FI</text>
</svg>
`;

async function getIconInput() {
  if (!fs.existsSync(sourceIcon)) {
    console.log('Source PNG not found.');
    console.log('Using fallback icon instead.');
    return Buffer.from(fallbackSvg);
  }

  try {
    await sharp(sourceIcon).metadata();

    console.log(`Valid source icon found: ${sourceIcon}`);

    return sourceIcon;
  } catch (error) {
    console.log('Source PNG could not be read by Sharp.');
    console.log('Using fallback icon instead.');
    return Buffer.from(fallbackSvg);
  }
}

const iconInput = await getIconInput();

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

    await sharp(iconInput)
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

console.log('');
console.log('========================================');
console.log('Android launcher icons generated.');
console.log('========================================');
