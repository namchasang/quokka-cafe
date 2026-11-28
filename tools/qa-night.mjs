// Nightly QA runner: opens the game at several URLs (maps, Look Lab flags), collects page/console errors,
// measures frames per second (software WebGL, so only compare night to night) and saves a screenshot of each.
//   node tools/qa-night.mjs <outDir> [secs=45] [file=index.html] [only=name1,name2]
// Screenshots use CDP (Page.captureScreenshot) because page.screenshot can time out on SwiftShader.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [out = 'qa-out', secs = '45', file = 'index.html', only = ''] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
// name -> query. ?shot=x,z,hour,weather,zoom,yaw is photo mode (no menus, no save).
const RUNS = [
  ['start', ''],
  ['rottnest-centre', '?shot=0,0,10,0,1,0'],
  ['rottnest-cafe', '?shot=-122.9,-31,10,0,1,0'],   // Kip's café since Phase 2 (15 Nov 2026)
  ['rottnest-nev', '?shot=-82.8,45.9,10,0,1.4,0'],  // Henrietta Rocks: Nev + wreck
  ['rottnest-osprey', '?shot=86.8,38.1,10,0,1.4,0'], // Osprey nest photo spot
  ['rottnest-west', '?shot=-60,0,10,0,1.4,0'],
  ['south-perth', '?shot=150,7,10,0,1,0'],
  ['fremantle', '?shot=295,0,10,0,1,0'],
  ['heirisson', '?shot=420,0,10,0,1,0'],
  ['victoria-park', '?shot=525,5,10,0,1,0'],
  ['outer-world', '?pnew=6#ow2&owgo', 70],   // needs ~70 s: a new game first plays its intro at the café   // ?pnew starts a new game in slot 6 (flags in the hash: pnew clears the search)
  ['oldisland', '?shot=0,0,10,0,1,0&oldisland'],
  ['owengine', '?pnew=6#ow2&owgo&owengine', 80],
  ['freomap', '?shot=312,8,10,0,1,0&freomap'],
  ['freo-old', '?shot=312,8,10,0,1,0'],
  ['ibcloud', '?pnew=6#ibcloud'],   // built island in the cloud saves (lab, 18 Nov 2026); deep check: tools/qa-ibcloud.mjs
  ['ibup', '?pnew=6#ibup'],   // café/jetty upgrades from the Island Builder (lab, 19 Nov 2026); deep check: tools/qa-ibup.mjs cafe|jetty
  ['cafe2', '?shot=-122.9,-31,10,0,1.6,0&cafe2&c2demo'],   // café without the deck + umbrella seat sets (lab, 23 Nov 2026)
  ['camppark', '?pnew=6#camppark', 90],   // Serpentine Falls camp built by the Stream & Falls Engine (lab, 23 Nov 2026)
  ['roundmap', '?pnew=6#roundmap', 70],   // round minimap (lab, 23 Nov 2026)
  ['vpmap', '?shot=520,10,17,0,6,0.6&vpmap'],   // Victoria Park built with the engines (lab, 20 Nov 2026)
  ['fast-cafe', '?shot=-122.9,-31,10,0,1,0&fast'],   // faster Rottnest (lab, 28 Nov 2026): compare with rottnest-cafe
  ['fast-nev', '?shot=-82.8,45.9,10,0,1.4,0&fast'],
  ['fast-osprey', '?shot=86.8,38.1,10,0,1.4,0&fast'],
  ['fast-wide', '?shot=-110,-25,15,0,5,0.6&fast'],
  ['rott-wide', '?shot=-110,-25,15,0,5,0.6'],
  ['fast-freo', '?shot=312,8,10,0,1,0&freomap&fast'],
  ['fast-sp', '?shot=150,10,17,0,6,0.6&spmap&fast'],
  ['fast-start', '?pnew=6#fast'],
  ['spmap', '?shot=150,7,10,0,1,0&spmap'],   // South Perth built with the engines (lab, 24 Nov 2026)
  ['spmap-wide', '?shot=150,10,17,0,6,0.6&spmap'],
  ['sp-wide', '?shot=150,10,17,0,6,0.6'],
].filter(r => !only || only.split(',').includes(r[0]));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => {
  let p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  r.end(fs.readFileSync(p));
}).listen(0);
const port = srv.address().port;
const exe = ['/opt/pw-browsers/chromium', process.env.CHROME].find(x => x && fs.existsSync(x));
const b = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const report = [];
for (const [name, q, own] of RUNS) {
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + (e.message || '').slice(0, 300)));
  pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|favicon|api\/config|ERR_FAILED|net::/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
  await pg.route(u => !u.hostname.endsWith('localhost') && u.hostname !== '127.0.0.1', r => r.abort());
  const t0 = Date.now();
  let fps = null;
  try {
    await pg.goto(`http://127.0.0.1:${port}/${file}${q}`, { waitUntil: 'commit', timeout: 120000 });
    await pg.waitForTimeout(Math.max(+secs, own || 0) * 1000);
    fps = await pg.evaluate(() => new Promise(res => { let n = 0; const t = performance.now(); const f = () => { n++; if (performance.now() - t < 8000) requestAnimationFrame(f); else res(+(n / 8).toFixed(2)); }; requestAnimationFrame(f); setTimeout(() => res(+(n / 8).toFixed(2)), 20000); }));
    const cdp = await pg.context().newCDPSession(pg);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(data, 'base64'));
  } catch (e) { errs.push('runner: ' + e.message.slice(0, 200)); }
  const uniq = [...new Set(errs)];
  report.push({ name, q, secs: Math.round((Date.now() - t0) / 1000), fps, errors: uniq.slice(0, 15), nErrors: errs.length });
  console.log(name, 'fps', fps, 'errors', errs.length, uniq.slice(0, 3).join(' | '));
  await pg.close();
}
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
await b.close(); srv.close();
