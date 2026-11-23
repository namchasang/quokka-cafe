// Island Builder café check (23 Nov 2026): opens lib/engines/editor/<page> and frames Kip's café; three r128 from .qa-cache.
//   node tools/qa-builder-cafe.mjs <out.png> [page=player.html] [query]
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const [out, page = 'player.html', q = ''] = process.argv.slice(2);
const srv = http.createServer((qq, r) => { const p = path.join(root, decodeURIComponent(qq.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': p.endsWith('.html') ? 'text/html' : 'text/javascript' }); r.end(fs.readFileSync(p)); }).listen(0);
const b = await chromium.launch({ args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 960, height: 600 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
for (const f of ['three.min.js', 'OrbitControls.js']) await pg.route(new RegExp(f.replace('.', '\\.') + '$'), r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(root, '.qa-cache', f)) }));
await pg.goto(`http://127.0.0.1:${srv.address().port}/lib/engines/editor/${page}${q}`, { waitUntil: 'load', timeout: 180000 }); await pg.waitForTimeout(15000);
const info = await pg.evaluate(() => { const E = window.__ED; const b = E.doc.bld.find(o => o.s === 'cafe' && o.fixed); if (!b) return 'no cafe'; const y = E.H.Hg(b.x, b.z); E.ctl.target.set(b.x, y + 2, b.z); E.cam.position.set(b.x + 9, y + 9, b.z + 14); E.ctl.update(); return { b, kip: !!E.E.bld.list?.find(g => g.userData.kipCafe) }; });
await pg.waitForTimeout(5000); const s = await pg.context().newCDPSession(pg); const { data } = await s.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(out, Buffer.from(data, 'base64'));
console.log(JSON.stringify(info), errs.slice(0, 5)); await b.close(); srv.close();
