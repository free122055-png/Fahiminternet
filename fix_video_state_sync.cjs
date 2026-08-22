const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

content = content.replace(
  /onTimeUpdate=\{handleTimeUpdate\}/g,
  `onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}`
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed video state sync');
