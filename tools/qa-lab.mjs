// Screenshot any standalone lab page with three r128 + OrbitControls served from .qa-cache (the container cannot reach the CDNs).
//   node tools/qa-lab.mjs <page relative to repo> <outDir> <query1> [query2 ...]
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [page, out, ...qs] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': p.endsWith('.html') ? 'text/html' : 'text/javascript' }); r.end(fs.readFileSync(p)); }).listen(0);
const b = await chromium.launch({ args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [n, q] of (qs.length ? qs : ['']).entries()) {
  const pg = await b.newPage({ viewport: { width: 960, height: 600 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  for (const f of ['three.min.js', 'OrbitControls.js', 'BufferGeometryUtils.js']) await pg.route(new RegExp(f.replace('.', '\\.') + '$'), r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(root, '.qa-cache', f)) }));
  const t0 = Date.now(); await pg.goto(`http://127.0.0.1:${srv.address().port}/${page}${q}`, { waitUntil: 'load', timeout: 180000 }); await pg.waitForTimeout(7000);
  const info = await pg.evaluate(() => (document.getElementById('info') || {}).textContent);
  const cdp = await pg.context().newCDPSession(pg); const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 });
  fs.writeFileSync(path.join(out, 'shot' + n + '.jpg'), Buffer.from(data, 'base64')); console.log(q, (Date.now() - t0) + 'ms', info, errs.join(' | ') || 'ok'); await pg.close();
}
await b.close(); srv.close();
