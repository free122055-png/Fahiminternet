const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

content = content.replace(/#ffffff/g, '#FAF9F4');
content = content.replace(/#FFFFFF/g, '#FAF9F4');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Replaced radial-gradient white');
