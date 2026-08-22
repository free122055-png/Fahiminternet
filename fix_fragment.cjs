const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

const target = `{/* Duration pill in corner (matching screenshot) */}`;

content = content.replace(
  target,
  `  </>
            )}
            {/* Duration pill in corner (matching screenshot) */}`
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed fragment');
