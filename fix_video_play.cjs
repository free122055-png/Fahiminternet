const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

// Inside useEffect for [activeVideo], we need to call play() AFTER setting the new source, 
// but wait, setting state is async so the video tag won't update its src until next render.
// The best way is to use another useEffect that watches currentVideoSrc.

// Let's add a useEffect for currentVideoSrc:
const hookCode = `
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoSrc, isPlaying]);
`;

// Let's insert it before the parseDurationToSeconds helper
content = content.replace(
  /\/\/ Parse duration string to seconds helper/g, 
  hookCode + '\n  // Parse duration string to seconds helper'
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed video play');
