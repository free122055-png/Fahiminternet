import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#16a34a"/>
  <circle cx="256" cy="256" r="220" stroke="white" stroke-width="12" stroke-dasharray="16 24" opacity="0.15" fill="none"/>
  <text y="335" x="256" font-family="system-ui, -apple-system, sans-serif" font-size="220" font-weight="900" fill="white" text-anchor="middle">FI</text>
</svg>
`;

const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generate() {
  try {
    const svgBuffer = Buffer.from(svgString);

    // 1. Generate favicon-48x48.png
    await sharp(svgBuffer)
      .resize(48, 48)
      .png()
      .toFile(path.join(publicDir, 'favicon-48x48.png'));
    console.log('✅ Generated favicon-48x48.png');

    // 2. Generate favicon-96x96.png (excellent for higher density)
    await sharp(svgBuffer)
      .resize(96, 96)
      .png()
      .toFile(path.join(publicDir, 'favicon-96x96.png'));
    console.log('✅ Generated favicon-96x96.png');

    // 3. Generate favicon-192x192.png (android/manifest standard)
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'favicon-192x192.png'));
    console.log('✅ Generated favicon-192x192.png');

    // 4. Generate favicon-512x512.png (manifest standard)
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'favicon-512x512.png'));
    console.log('✅ Generated favicon-512x512.png');

    // 5. Generate favicon.ico (using 48x48 as it is highly compatible)
    await sharp(svgBuffer)
      .resize(416, 416) // slightly larger standard ICO container or 48x48
      .resize(48, 48)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✅ Generated favicon.ico');

    // 6. Generate apple-touch-icon.png (180x180 for Apple devices)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png');

    console.log('🎉 All favicon assets generated successfully in /public!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
  }
}

generate();
