const fs = require('fs');
let s = fs.readFileSync('package.json','utf8');

// strip BOM
s = s.replace(/^\uFEFF/, '');
// remove //... and /* ... */ comments
s = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/mg, '').trim();
// auto-wrap if missing top-level braces
if (!s.startsWith('{')) s = '{\n' + s + '\n}';
// remove trailing commas like "..., }" or "..., ]"
s = s.replace(/,\s*([}\]])/g, '');

let obj = JSON.parse(s);            // throws if ще щось не так
fs.writeFileSync('package.json', JSON.stringify(obj, null, 2) + '\n');
console.log('package.json cleaned ✅');
