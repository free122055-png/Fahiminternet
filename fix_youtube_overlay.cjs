const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

const overlayStart = `{/* Custom Overlay Controls for Direct MP4 / Video files (Auto-hide after 2.5s) */}`;

content = content.replace(
  overlayStart,
  `{!youtubeEmbedUrl && (
            <>
            {/* Custom Overlay Controls for Direct MP4 / Video files (Auto-hide after 2.5s) */}`
);

// We need to find the end of the overlay div.
// It ends right before {/* Video Info & Actions */}
const overlayEnd = `{/* Video Info & Actions */}`;

content = content.replace(
  overlayEnd,
  `  </>
          )}
          {/* Video Info & Actions */}`
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed YouTube overlay blocking');
