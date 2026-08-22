const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

content = content.replace(/hover:bg-emerald-700/g, 'hover:bg-[#12A878]');
content = content.replace(/ring-emerald-400/g, 'ring-[#12A878]');
content = content.replace(/accent-emerald-600/g, 'accent-[#087F5B]');
content = content.replace(/fill-emerald-700/g, 'fill-[#087F5B]');

content = content.replace(/from-emerald-[0-9]+/g, 'from-[#087F5B]');
content = content.replace(/via-teal-[0-9]+/g, 'via-[#12A878]');
content = content.replace(/to-emerald-[0-9]+/g, 'to-[#087F5B]');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Fixed remaining emeralds');
