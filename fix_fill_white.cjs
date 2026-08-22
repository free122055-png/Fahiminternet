const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

content = content.replace(/fill-white/g, 'fill-[#FAF9F4]');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Fixed fill-white');
