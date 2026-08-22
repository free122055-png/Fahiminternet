const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

const oldHook = `  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked:', err);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentVideoSrc, isPlaying]);`;

const newHook = `  // When the video source changes, load it explicitly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked after load:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentVideoSrc, activeVideo?.videoUrl]);

  // When play/pause state toggles
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked:', err);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);`;

content = content.replace(oldHook, newHook);
fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Fixed video load logic');
