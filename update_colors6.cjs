const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

const replacements = [
  { regex: /text-slate-400/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-300/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-200/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-100/g, replacement: 'text-[#7B8580]' },
  
  { regex: /text-slate-950/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-900/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-800/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-700/g, replacement: 'text-[#25312C]' },

  { regex: /bg-slate-950/g, replacement: 'bg-[#FAF9F4]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[#FAF9F4]' },
  { regex: /bg-slate-800/g, replacement: 'bg-[#FAF9F4]' },
  { regex: /bg-slate-700/g, replacement: 'bg-[#FAF9F4]' },
  { regex: /bg-slate-200/g, replacement: 'bg-[#E5E9E5]' },
  
  { regex: /border-slate-700/g, replacement: 'border-[#E5E9E5]' },
  { regex: /border-slate-800/g, replacement: 'border-[#E5E9E5]' },
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Fixed more slates!');
