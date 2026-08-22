const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

// Fix buttons that became ivory with white text
content = content.replace(/bg-\[\#FAF9F4\] hover:bg-\[\#FAF9F4\] text-white/g, 'bg-[#087F5B] hover:bg-[#12A878] text-white');

// Fix modal background that was bg-slate-900 but now has text-white. If it's a modal, it should have text-[#25312C] and bg-[#FAF9F4]
content = content.replace(/className="w-full max-w-sm bg-\[\#FAF9F4\] text-white/g, 'className="w-full max-w-sm bg-[#FAF9F4] text-[#25312C]');
// And change its border
content = content.replace(/border-slate-800/g, 'border-[#E5E9E5]');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Fixed ivory buttons!');
