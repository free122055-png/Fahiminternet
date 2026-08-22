const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

const hookFind = `videoRef.current.play().catch(() => {});`;
const hookReplace = `videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked:', err);
          setIsPlaying(false);
        });`;

content = content.replace(new RegExp(hookFind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), hookReplace);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed play catch block');
