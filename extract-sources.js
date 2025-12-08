const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, 'portfolio-gh-pages','static','js','main.6840f102.js.map');
const outDir = path.join(__dirname, 'recovered-src');

if (!fs.existsSync(mapPath)) {
  console.error('Map file not found:', mapPath);
  process.exit(2);
}

const raw = fs.readFileSync(mapPath, 'utf8');
let map;
try {
  map = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse map JSON:', e.message);
  process.exit(3);
}

if (!map.sources || !Array.isArray(map.sources)) {
  console.error('No sources array found in map.');
  process.exit(4);
}

if (!map.sourcesContent || !Array.isArray(map.sourcesContent)) {
  console.error('No sourcesContent found in map. Extraction cannot continue.');
  process.exit(5);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

map.sources.forEach((src, i) => {
  const content = map.sourcesContent[i] || '';
  // sanitize path: remove any leading ../ or / and replace backrefs
  let filename = src.replace(/^\.\/?/, '');
  filename = filename.replace(/^\/+/, '');
  filename = filename.replace(/^[A-Za-z]:/, '');
  filename = filename.replace(/[^a-zA-Z0-9_\-\/\.]/g, '_');
  const dest = path.join(outDir, filename);
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');
  console.log('Wrote', dest);
});

console.log('Extraction complete. Recovered files are in', outDir);
