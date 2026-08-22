const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

// Fix gradients
content = content.replace(/from-\[\#087F5B\]/g, 'from-emerald-700');
content = content.replace(/via-\[\#12A878\]/g, 'via-teal-800');
content = content.replace(/to-\[\#087F5B\]/g, 'to-emerald-950');
content = content.replace(/text-slate-900/g, 'text-white');
content = content.replace(/text-\[\#FAF9F4\]/g, 'text-white');

// Fix radial gradients
content = content.replace(/radial-gradient\(#FAF9F4/g, 'radial-gradient(#ffffff');

// Fix #E5E9E5 buttons
content = content.replace(/bg-slate-100/g, 'bg-slate-800');
content = content.replace(/hover:bg-\[\#E5E9E5\]/g, 'hover:bg-slate-700');

// Fix progress bar bg
content = content.replace(/bg-\[\#E5E9E5\]/g, 'bg-slate-800');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Fixed more colors');
