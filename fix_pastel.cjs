const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

const replacements = [
  { from: /bg-teal-50\b/g, to: 'bg-teal-500/10' },
  { from: /border-teal-200/g, to: 'border-teal-500/20' },
  { from: /text-teal-700/g, to: 'text-teal-400' },
  
  { from: /bg-purple-50\b/g, to: 'bg-purple-500/10' },
  { from: /border-purple-200/g, to: 'border-purple-500/20' },
  { from: /text-purple-700/g, to: 'text-purple-400' },

  { from: /bg-sky-50\b/g, to: 'bg-sky-500/10' },
  { from: /border-sky-200/g, to: 'border-sky-500/20' },
  { from: /text-sky-700/g, to: 'text-sky-400' },

  { from: /bg-rose-50\b/g, to: 'bg-rose-500/10' },
  { from: /border-rose-200/g, to: 'border-rose-500/20' },
  { from: /text-rose-600/g, to: 'text-rose-400' },
  { from: /hover:bg-rose-100/g, to: 'hover:bg-rose-500/20' },

  { from: /bg-amber-50\b/g, to: 'bg-amber-500/10' },
  { from: /border-amber-200/g, to: 'border-amber-500/20' },
  { from: /text-amber-700/g, to: 'text-amber-400' },
  { from: /hover:bg-amber-100/g, to: 'hover:bg-amber-500/20' }
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Fixed pastels');
