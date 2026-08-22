const fs = require('fs');

let content = fs.readFileSync('src/components/TilawatLibrary.tsx', 'utf8');

// Replace standard colors with the requested hex codes
const replacements = [
  // Backgrounds
  { regex: /bg-white/g, replacement: 'bg-[#FAF9F4]' },
  { regex: /bg-slate-50/g, replacement: 'bg-[#FAF9F4]' },
  
  // Texts
  { regex: /text-slate-900/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-800/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-700/g, replacement: 'text-[#25312C]' },
  { regex: /text-slate-600/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-500/g, replacement: 'text-[#7B8580]' },
  { regex: /text-slate-400/g, replacement: 'text-[#7B8580]' },
  
  // Primary Green
  { regex: /bg-emerald-600/g, replacement: 'bg-[#087F5B]' },
  { regex: /bg-emerald-500/g, replacement: 'bg-[#087F5B]' },
  { regex: /text-emerald-600/g, replacement: 'text-[#087F5B]' },
  { regex: /text-emerald-500/g, replacement: 'text-[#087F5B]' },
  { regex: /text-emerald-700/g, replacement: 'text-[#087F5B]' },
  
  // Highlight Green
  { regex: /hover:bg-emerald-500/g, replacement: 'hover:bg-[#12A878]' },
  { regex: /hover:bg-emerald-400/g, replacement: 'hover:bg-[#12A878]' },
  { regex: /text-emerald-400/g, replacement: 'text-[#12A878]' },
  
  // Borders
  { regex: /border-slate-100/g, replacement: 'border-[#E5E9E5]' },
  { regex: /border-slate-200/g, replacement: 'border-[#E5E9E5]' },
  { regex: /border-slate-300/g, replacement: 'border-[#E5E9E5]' },
  
  // Soft Green backgrounds (used in hover states or active states)
  { regex: /bg-emerald-50/g, replacement: 'bg-[#087F5B]/10' },
  { regex: /hover:bg-emerald-50/g, replacement: 'hover:bg-[#087F5B]/10' },
  { regex: /border-emerald-100/g, replacement: 'border-[#087F5B]/20' },
  { regex: /border-emerald-200/g, replacement: 'border-[#087F5B]/30' },
  
  // Add some gold accents. E.g., the currently active playing item could have a gold indicator.
  // Instead of replacing blindly, let's keep it safe. The user said:
  // "Premium Accent: Muted Gold — #C8A951"
  // "মূল Accent হবে Emerald Green এবং Gold শুধুমাত্র খুব অল্প জায়গায় premium accent হিসেবে ব্যবহার হবে।"
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});

// For Gold, we can replace some specific accents, for example:
// "fill-rose-500 text-rose-500" -> maybe keep rose for favorite? Yes, heart is usually red. But let's leave rose alone.
// Maybe the "এখন চলছে" (Now playing) text can be gold.
content = content.replace(/text-emerald-600 uppercase/g, 'text-[#C8A951] uppercase');

fs.writeFileSync('src/components/TilawatLibrary.tsx', content, 'utf8');
console.log('Colors replaced successfully!');
