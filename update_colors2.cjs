const fs = require('fs');

let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

const replacements = [
  // Missed items
  { regex: /border-emerald-500/g, replacement: 'border-[#087F5B]' },
  { regex: /border-emerald-400/g, replacement: 'border-[#12A878]' },
  { regex: /border-white/g, replacement: 'border-[#FAF9F4]' },
  { regex: /bg-emerald-400/g, replacement: 'bg-[#12A878]' },
  { regex: /text-emerald-400/g, replacement: 'text-[#12A878]' },
  { regex: /border-emerald-50/g, replacement: 'border-[#087F5B]/10' },
  { regex: /bg-emerald-50/g, replacement: 'bg-[#087F5B]/10' },
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});


fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Colors replaced successfully!');
