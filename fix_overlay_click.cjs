const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

content = content.replace(
  /onClick=\{\(e\) => \{\n                e\.stopPropagation\(\);\n                resetControlsTimer\(\);\n              \}\}/g,
  `onClick={(e) => {
                e.stopPropagation();
                resetControlsTimer();
                togglePlay();
              }}`
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed overlay click');
