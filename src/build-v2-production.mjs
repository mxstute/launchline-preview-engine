import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './v2/render.mjs';
const out = path.join(ROOT, 'dist');
// Only remove our generated directory, never source, repository or user data.
if (path.dirname(out) !== ROOT || path.basename(out) !== 'dist') throw new Error('Unexpected output directory');
fs.rmSync(out, { recursive: true, force: true });
await import('./build-v2.mjs');
const controlCss = fs.readFileSync(path.join(ROOT, 'templates/v2/controls.css'), 'utf8');
fs.appendFileSync(path.join(out, 'assets/pool.css'), '\n' + controlCss);
// All assets remain self-hosted. Separate each client's public assets for later batches.
const curated = fs.readdirSync(path.join(ROOT, 'data/curated')).filter(f => f.endsWith('.json'));
for (const name of curated) {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/curated', name), 'utf8'));
  if (d.publish !== true) continue;
  const assetsDir = path.join(out, 'assets', d.slug);
  fs.mkdirSync(assetsDir, { recursive: true });
  let html = fs.readFileSync(path.join(out, d.slug, 'index.html'), 'utf8');
  for (const a of d.assets) {
    const source = path.join(out, 'assets', a.file);
    fs.copyFileSync(source, path.join(assetsDir, a.file));
    html = html.replaceAll(`/assets/${a.file}`, `/assets/${d.slug}/${a.file}`);
  }
  fs.writeFileSync(path.join(out, d.slug, 'index.html'), html);
}
