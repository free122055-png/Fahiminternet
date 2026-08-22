const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

const oldHook = `  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoSrc, isPlaying]);`;

const newHook = `  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentVideoSrc, isPlaying]);`;

content = content.replace(oldHook, newHook);
fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed hook to handle pause');
