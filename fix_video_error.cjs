const fs = require('fs');
let content = fs.readFileSync('src/components/VideoTilawatSection.tsx', 'utf8');

content = content.replace(
  /onEnded=\{handleNextVideo\}/g,
  `onEnded={handleNextVideo}
                onError={(e) => {
                  console.error('Video error:', e.currentTarget.error);
                  if (e.currentTarget.error) {
                    alert('ভিডিও ফাইলটি প্লে করা যাচ্ছে না। এটি ব্রাউজার সাপোর্টেড ফরম্যাট (যেমন: MP4) কিনা নিশ্চিত করুন।');
                    setIsPlaying(false);
                  }
                }}`
);

fs.writeFileSync('src/components/VideoTilawatSection.tsx', content, 'utf8');
console.log('Added onError');
