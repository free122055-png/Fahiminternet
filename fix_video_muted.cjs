const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

// Add muted attribute to video tag
content = content.replace(
  /onTimeUpdate=\{handleTimeUpdate\}/g,
  'muted={isMuted}\n                onTimeUpdate={handleTimeUpdate}'
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Added muted attribute');
