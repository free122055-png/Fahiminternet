const fs = require('fs');

let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

const replacements = [
  // Backgrounds
  { regex: /bg-white/g, replacement: 'bg-[#FAF9F4]' },
  { regex: /bg-slate-50/g, replacement: 'bg-[#FAF9F4]' },
  
  // Texts
  { regex: /text-slate-900/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-800/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-700/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-600/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-500/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-400/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-300/g, replacement: 'text-[#7B8580]' },
  
  // Primary Green
  { regex: /bg-emerald-600/g, replacement: 'bg-[#087F5B]' },
  { regex: /bg-emerald-500/g, replacement: 'bg-[#087F5B]' },
  { regex: /text-emerald-600/g, replacement: 'text-[#087F5B]' },
  { regex: /text-emerald-500/g, replacement: 'text-[#087F5B]' },
  { regex: /text-emerald-700/g, replacement: 'text-[#087F5B]' },
  
  // Highlight Green
  { regex: /hover:bg-emerald-500/g, replacement: 'hover:bg-[#12A878]' },
  { regex: /hover:bg-emerald-400/g, replacement: 'hover:bg-[#12A878]' },
  { regex: /hover:bg-emerald-600/g, replacement: 'hover:bg-[#12A878]' },
  { regex: /text-emerald-400/g, replacement: 'text-[#12A878]' },
  
  // Borders
  { regex: /border-slate-100/g, replacement: 'border-[#E5E9E5]' },
  { regex: /border-slate-200/g, replacement: 'border-[#E5E9E5]' },
  { regex: /border-slate-300/g, replacement: 'border-[#E5E9E5]' },
  
  // Soft Green backgrounds (used in hover states or active states)
  { regex: /bg-emerald-50/g, replacement: 'bg-[#087F5B]\/10' },
  { regex: /hover:bg-emerald-50/g, replacement: 'hover:bg-[#087F5B]\/10' },
  { regex: /border-emerald-100/g, replacement: 'border-[#087F5B]\/20' },
  { regex: /border-emerald-200/g, replacement: 'border-[#087F5B]\/30' },
  { regex: /bg-emerald-100/g, replacement: 'bg-[#087F5B]\/20' },
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});

// Some manual adjustments to inject the gold accent (#C8A951)
// Let's replace some active states or small accents with gold.
// Example: the little dots in the active buttons
content = content.replace(/bg-emerald-500 rounded-full mt-1\.5/g, 'bg-[#C8A951] rounded-full mt-1.5');
content = content.replace(/bg-\[\#087F5B\] rounded-full mt-1\.5/g, 'bg-[#C8A951] rounded-full mt-1.5');

// Active item indicator in playlist:
content = content.replace(/border-l-4 border-emerald-500/g, 'border-l-4 border-[#C8A951]');
content = content.replace(/border-l-4 border-\[\#087F5B\]/g, 'border-l-4 border-[#C8A951]');

// 'প্রধান ক্বারী' text to gold
content = content.replace(/text-\[\#087F5B\] uppercase/g, 'text-[#C8A951] uppercase');
content = content.replace(/text-emerald-600 uppercase/g, 'text-[#C8A951] uppercase');


fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Colors replaced successfully!');
