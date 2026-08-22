const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

// The main screen background
content = content.replace(/bg-\[\#f8fafc\]/g, 'bg-[#FAF9F4]');

// Some modals were bg-[#F2F7F3], let's check if they need to be F2F7F3 or FAF9F4.
// The user says: 
// "বিশেষ করে পুরো Screen-এর Background যেন আর "#FFFFFF" না থাকে। "#FAF9F4" ব্যবহার করবে।
// Cards/containers-এ Pure White ব্যবহার করলে সেগুলো যেন Warm Ivory background থেকে visibly আলাদা হয়। Border, active state, icons এবং buttons-এ Emerald Green ব্যবহার করবে।"

// So Light Surface F2F7F3 for cards is perfect. FAF9F4 for main bg is perfect.

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Tilawat updated');
