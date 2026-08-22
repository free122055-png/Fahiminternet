const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

content = content.replace(/bg-slate-300/g, 'bg-slate-700');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Fixed dots');
