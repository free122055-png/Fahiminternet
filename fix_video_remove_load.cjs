const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

content = content.replace(/videoRef\.current\.load\(\);/g, '');

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Removed load() calls');
