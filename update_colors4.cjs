const fs = require('fs');

let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

const replacements = [
  // text-emerald-xxx
  { regex: /text-emerald-[123456789]00/g, replacement: 'text-[#087F5B]' },
  
  // border-emerald-xxx
  { regex: /border-emerald-[123456789]00/g, replacement: 'border-[#E5E9E5]' },

  // Any stray emerald colors
  { regex: /emerald-50/g, replacement: '[#FAF9F4]' },
  { regex: /bg-emerald-200/g, replacement: 'bg-[#E5E9E5]' },
  
  // Also bg-slate-900 etc. that might have been missed if it was bg-slate-900\/something
  // Note: the sheet overlays use bg-slate-900/40. If the user wants a premium feel, 
  // #25312C is their main text which is a dark color. We can use bg-[#25312C]/40 for the overlay.
  { regex: /bg-slate-900\/40/g, replacement: 'bg-[#25312C]/40' },
  { regex: /bg-slate-900\/50/g, replacement: 'bg-[#25312C]/50' },
  { regex: /bg-slate-900\/60/g, replacement: 'bg-[#25312C]/60' },
  { regex: /bg-slate-900\/70/g, replacement: 'bg-[#25312C]/70' },
  { regex: /bg-slate-900\/80/g, replacement: 'bg-[#25312C]/80' },
  { regex: /bg-slate-900\/90/g, replacement: 'bg-[#25312C]/90' },
  { regex: /bg-slate-800/g, replacement: 'bg-[#FAF9F4]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[#FAF9F4]' },
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Colors replaced successfully!');
