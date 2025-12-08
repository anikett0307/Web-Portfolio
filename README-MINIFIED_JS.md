**Minified Build Explanation**
- **File**: `static/js/main.6840f102.js` — a minified production bundle from a React app.
- **Contains**: React runtime, React DOM, app components (bundled), vendor libs (e.g. lodash), event logic, and build-time transforms.
- **Why it's unreadable**: The build is minified and mangled (whitespace, comments, and original names removed) to reduce size and improve performance.

**What we found in this repo**
- **`index.html`**: references `
  - ` /portfolio/static/js/main.6840f102.js`
- **Source maps referenced**: `asset-manifest.json` lists `/portfolio/static/js/main.6840f102.js.map` and `/portfolio/static/js/453.ace21015.chunk.js.map`.
- **Actual map files present**: `static/js/main.6840f102.js.map` and `static/js/453.ace21015.chunk.js.map` exist in the workspace — you can use them to recover readable sources (possibly fully recovered depending on `sourcesContent`).

**What source maps give you**
- If the `.map` includes `sourcesContent`, it often contains the original source files inlined — you can reconstruct the original `src/` files from that.
- If `sourcesContent` is absent, the map still maps minified names/locations to original source paths — but you'll need the original files (or fetch them from VCS or hosting) to fully restore source content.

**Quick checks (PowerShell)**
- Verify maps referenced by `index.html`:
```powershell
Select-String -Path .\portfolio-gh-pages\index.html -Pattern "static/js/main.*\.js"
```
- Check whether `sourcesContent` exists inside a map:
```powershell
Get-Content .\portfolio-gh-pages\static\js\main.6840f102.js.map -Raw | Select-String '"sourcesContent"'
```

**Inspect and visualize bundle (recommended tools)**
- `source-map-explorer` — shows a breakdown of bundle composition.
  - Run (from repository root):
```powershell
npx source-map-explorer .\portfolio-gh-pages\static\js\main.6840f102.js .\portfolio-gh-pages\static\js\main.6840f102.js.map
```
- Browser DevTools — open app locally and DevTools will load source maps and show original sources (if maps are reachable).

**Extract original sources from a map (when `sourcesContent` present)**
- Quick manual: open the `.map` in your editor and search for `sourcesContent` — many maps include the full source files array.
- Small Node script (creates `recovered-src/`):
```powershell
# Save this as extract-sources.js then run `node extract-sources.js`
$script = @'
const fs = require('fs');
const path = require('path');
const mapPath = path.join(__dirname, 'portfolio-gh-pages','static','js','main.6840f102.js.map');
const outDir = path.join(__dirname, 'recovered-src');
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
if (!map.sourcesContent) { console.error('No sourcesContent in map'); process.exit(1); }
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
map.sources.forEach((src, i) => {
  const content = map.sourcesContent[i] || '';
  // sanitize file path
  const filename = src.replace(/^\.\.?\//, '').replace(/[^a-zA-Z0-9_\-\/\.]/g, '_');
  const dest = path.join(outDir, filename);
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');
  console.log('Wrote', dest);
});
'@
Set-Content -Path .\extract-sources.js -Value $script -NoNewline
node .\extract-sources.js
```

**Next recommended steps**
- Open `static/js/main.6840f102.js.map` in an editor and check for `sourcesContent`.
- If present and you want, I can run a small extraction script to reconstruct `src/` files here in the workspace.
- If not present, check your VCS (git/GitHub) or build artifacts for the original `src/` folder or for a complete source-map upload (some CI systems upload maps to error-tracking tools).

**Notes & caveats**
- De-minification via maps is legitimate for debugging and recovery of your own code. Do not attempt to recover third-party closed-source code without proper rights.
- Maps can expose source code — be mindful before publishing maps to public hosting if sources should remain private.

If you want, I can now check the contents of `main.6840f102.js.map` and either (a) report whether `sourcesContent` is present, or (b) extract the original sources to `recovered-src/`. Which would you like me to do next?