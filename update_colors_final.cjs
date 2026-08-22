const fs = require('fs');

let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

// The main screen background can be FAF9F4, but cards/containers should be F2F7F3 to distinguish from the background.
// Previously I replaced bg-white with bg-[#FAF9F4].
// So now I should replace bg-[#FAF9F4] with bg-[#F2F7F3] for things like modal panels, cards, containers, etc.

content = content.replace(/bg-\[\#FAF9F4\]/g, 'bg-[#F2F7F3]');

// Let's also make sure FAF9F4 is the actual main background in App.tsx if any.
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/bg-white/g, 'bg-[#F2F7F3]');
appContent = appContent.replace(/bg-slate-50/g, 'bg-[#FAF9F4]'); // Since 50 was lighter? FAF9F4 is Warm Ivory. Actually, we want main bg to be FAF9F4.
// If the main wrapper has bg-something... Let's just do a global replace for App.tsx too.
// Let's not touch App.tsx randomly, wait. Let's just fix TilawatLibrary first.

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Tilawat updated');
