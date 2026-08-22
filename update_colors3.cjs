const fs = require('fs');

let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

const replacements = [
  // Shadow for the main play button
  { regex: /shadow-\[0_8px_30px_rgb\(16,185,129,0\.3\)\]/g, replacement: 'shadow-[0_8px_30px_rgba(8,127,91,0.3)]' },
  // Progress bar custom ring etc. Let's find any other hardcoded emerald values.
  { regex: /accent-emerald-500/g, replacement: 'accent-[#087F5B]' },
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Colors replaced successfully!');
