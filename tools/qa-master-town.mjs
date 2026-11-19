// Opens a town Master Builder page (game master) and checks it starts: no errors, the town's map is loaded, the map picker lists it.
//   node tools/qa-master-town.mjs <page=vp-master.html> <shot.png>
// three.js r128 comes from .qa-cache/ (npm pack three@0.128.0) because the container cannot reach the CDN.
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [page = 'vp-master.html', shot = 'master-town.png'] = process.argv.slice(2);
const T = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
const srv = http.createServer((q, r) => { let p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': T[path.extname(p)] || 'application/octet-stream' }); r.end(fs.readFileSync(p)); }).listen(0);
const b = await chromium.launch({ args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 960, height: 540 } });
const C = path.join(root, '.qa-cache');
await pg.route(/three\.min\.js$/, r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(C, 'three.min.js')) }));
await pg.route(/OrbitControls\.js$/, r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(C, 'OrbitControls.js')) }));
await pg.route(u => !u.hostname.endsWith('localhost') && u.hostname !== '127.0.0.1' && !/three|OrbitControls/.test(u.pathname), r => r.abort());
const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|favicon/.test(m.text())) errs.push(m.text().slice(0, 200)); });
await pg.goto(`http://127.0.0.1:${srv.address().port}/lib/engines/editor/${page}`, { waitUntil: 'load', timeout: 120000 });
await pg.waitForTimeout(40000);
const info = await pg.evaluate(() => { const s = document.getElementById('mapPick'); return { town: window.IB_TOWN || 'rott', title: document.title, start: window.IB_START && { name: window.IB_START.name, bld: window.IB_START.bld.length, roads: window.IB_START.roads.length },
  pick: s ? [...s.options].map(o => o.textContent + (o.disabled ? ' (off)' : '') + (o.selected ? ' *' : '')) : null }; });
const cdp = await pg.context().newCDPSession(pg); const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(shot, Buffer.from(data, 'base64'));
console.log(JSON.stringify({ page, info, errs }, null, 1)); await b.close(); srv.close();
