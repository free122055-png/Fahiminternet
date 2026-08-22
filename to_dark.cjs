const fs = require('fs');
let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

// Overlays
content = content.replace(/bg-\[\#25312C\]\/[0-9]+/g, 'bg-black/80');

// Backgrounds
content = content.replace(/bg-\[\#FAF9F4\]/g, 'bg-[#0b1320]');
content = content.replace(/bg-\[\#F2F7F3\]/g, 'bg-slate-900');

// Texts
content = content.replace(/text-\[\#25312C\]/g, 'text-white');
content = content.replace(/text-\[\#7B8580\]/g, 'text-slate-400');
content = content.replace(/text-\[\#FAF9F4\]/g, 'text-slate-900'); // wait, if text was ivory, in dark mode it should probably be dark (like button text) or white. Let's see: button with bg-emerald-500 had text-ivory. In dark mode, bg-emerald-500 should have text-slate-950 or white. Let's use text-slate-950 for high contrast on green, or text-white. 
content = content.replace(/text-\[\#FAF9F4\]/g, 'text-white'); 
content = content.replace(/text-\[\#087F5B\]/g, 'text-emerald-400');
content = content.replace(/text-\[\#12A878\]/g, 'text-emerald-300');
content = content.replace(/text-\[\#C8A951\]/g, 'text-emerald-400');

// Borders
content = content.replace(/border-\[\#E5E9E5\]/g, 'border-slate-800');
content = content.replace(/border-\[\#087F5B\]/g, 'border-emerald-500/50');
content = content.replace(/border-\[\#12A878\]/g, 'border-emerald-400');
content = content.replace(/border-\[\#C8A951\]/g, 'border-emerald-400');
content = content.replace(/border-\[\#FAF9F4\]/g, 'border-slate-800');

// Background Colors (Greens)
content = content.replace(/bg-\[\#087F5B\]/g, 'bg-emerald-600');
content = content.replace(/bg-\[\#12A878\]/g, 'bg-emerald-500');
content = content.replace(/bg-\[\#C8A951\]/g, 'bg-emerald-500');

// Accents and Fills
content = content.replace(/accent-\[\#087F5B\]/g, 'accent-emerald-500');
content = content.replace(/fill-\[\#087F5B\]/g, 'fill-emerald-500');
content = content.replace(/fill-\[\#FAF9F4\]/g, 'fill-white');

// Opacity variations
content = content.replace(/bg-\[\#087F5B\]\/10/g, 'bg-emerald-950/50');
content = content.replace(/bg-\[\#087F5B\]\/20/g, 'bg-emerald-900/60');
content = content.replace(/border-\[\#087F5B\]\/30/g, 'border-emerald-500/30');

// Hover states
content = content.replace(/hover:bg-\[\#F2F7F3\]/g, 'hover:bg-slate-800');
content = content.replace(/hover:bg-\[\#FAF9F4\]/g, 'hover:bg-slate-800');
content = content.replace(/hover:bg-\[\#12A878\]/g, 'hover:bg-emerald-500');
content = content.replace(/hover:border-\[\#E5E9E5\]/g, 'hover:border-slate-700');
content = content.replace(/hover:text-\[\#087F5B\]/g, 'hover:text-emerald-400');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Converted to dark mode');
