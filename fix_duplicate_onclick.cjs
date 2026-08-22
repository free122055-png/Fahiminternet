const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

const duplicateSection = `onClick={() => {
              if (!showControls) {
                resetControlsTimer();
              } else {
                setShowControls(false);
              }
            }}
            onClick={(e) => {
              resetControlsTimer();
              if (showControls) togglePlay(); // If already showing, toggle play. If hidden, just show controls first.
            }}`;

content = content.replace(duplicateSection, `onClick={(e) => {
              resetControlsTimer();
              if (showControls) togglePlay(); // If already showing, toggle play. If hidden, just show controls first.
            }}`);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed duplicate onClick');
