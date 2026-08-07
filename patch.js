const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/const getFilename = \(\) => \{[\s\S]*?const getDirname = \(\) => \{[\s\S]*?^\}/m, `const getFilename = () => {
  return typeof __filename !== 'undefined' ? __filename : (import.meta as any).url ? fileURLToPath((import.meta as any).url) : '';
};

const getDirname = () => {
  return typeof __dirname !== 'undefined' ? __dirname : (import.meta as any).url ? path.dirname(fileURLToPath((import.meta as any).url)) : '';
}`);
fs.writeFileSync('server.ts', code);
