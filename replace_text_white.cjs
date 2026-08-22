const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

content = content.replace(/text-white/g, 'text-[#FAF9F4]');
content = content.replace(/border-white/g, 'border-[#FAF9F4]');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Replaced text-white');
