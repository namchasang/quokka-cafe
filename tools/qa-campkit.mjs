// Camp Kit Lab check (21 Nov 2026): opens lib/engines/campkit/lab.html with start states and saves a screenshot of each.
//   node tools/qa-campkit.mjs <outDir>
// three.js r128, OrbitControls and BufferGeometryUtils come from .qa-cache/ (npm pack three@0.128.0) because the container cannot reach the CDN.
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [out = 'campkit-out'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const RUNS = (process.argv[3] ? [['custom', process.argv[3]]] : null) || [['afternoon', '?pts'], ['dusk', '?t=1&door&lights'], ['night', '?t=2&lights'], ['dawn', '?t=3&fire=2'], ['rain', '?rain&wind'], ['fog-night', '?t=2&fog&lights'], ['blown', '?wind&blow'], ['folded', '?tent=0&fire=0']];
const T = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': T[path.extname(p)] || 'application/octet-stream' }); r.end(fs.readFileSync(p)); }).listen(0);
const b = await chromium.launch({ args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const C = path.join(root, '.qa-cache'); const rep = [];
for (const [name, q] of RUNS) {
  const pg = await b.newPage({ viewport: { width: 960, height: 600 } });
  for (const f of ['three.min.js', 'OrbitControls.js', 'BufferGeometryUtils.js']) await pg.route(new RegExp(f.replace('.', '\\.') + '$'), r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(C, f)) }));
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|favicon/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/lib/engines/campkit/lab.html${q}`, { waitUntil: 'load', timeout: 120000 });
  await pg.waitForTimeout(name === 'blown' ? 9000 : 6000);
  const st = await pg.evaluate(() => window.CAMPKIT ? { points: window.CAMPKIT.points(), fps: document.getElementById('fps').textContent } : null);
  const cdp = await pg.context().newCDPSession(pg); const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  fs.writeFileSync(path.join(out, 'campkit-' + name + '.jpg'), Buffer.from(data, 'base64'));
  rep.push({ name, q, errors: errs, ...st }); console.log(name, errs.length ? errs.join(' | ') : 'ok', st && st.fps); await pg.close();
}
fs.writeFileSync(path.join(out, 'campkit.json'), JSON.stringify(rep, null, 1)); await b.close(); srv.close();
