const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

// We need to add onClick to the wrapper
content = content.replace(
  /className="relative aspect-video w-full bg-black group overflow-hidden cursor-pointer"/g,
  `onClick={(e) => {
              resetControlsTimer();
              if (showControls) togglePlay(); // If already showing, toggle play. If hidden, just show controls first.
            }}
            onTouchStart={resetControlsTimer}
            className="relative aspect-video w-full bg-black group overflow-hidden cursor-pointer"`
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed mobile tap to show controls');
