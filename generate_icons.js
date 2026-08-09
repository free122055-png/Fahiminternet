import fs from 'fs';
import path from 'path';

const transparentPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(transparentPngBase64, 'base64');

const densities = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
const fileNames = ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png'];

densities.forEach(density => {
  const dir = path.join('android', 'app', 'src', 'main', 'res', density);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fileNames.forEach(fileName => {
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, buffer);
    console.log(`Generated valid PNG: ${filePath}`);
  });
});
console.log('All launcher icons successfully regenerated as valid PNGs!');
