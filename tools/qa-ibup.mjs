// Look Lab ?ibup probe (café and jetty upgrades from the Island Builder, 19 Nov 2026):
//   node tools/qa-ibup.mjs [cafe|jetty]
// New game in slot 6 with the lab on -> menu button opens the builder with &up=1 -> select the fixed café (or jetty) ->
// the bubble must show '⬆ อัปเกรด' -> tap it -> back in the game the café (or harbour) upgrade panel must be open.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const kind = process.argv[2] || 'cafe';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const srv = http.createServer((q, r) => {
  let p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(fs.readFileSync(p));
}).listen(0);
const base = 'http://127.0.0.1:' + srv.address().port + '/';
const b = await chromium.launch({ args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 960, height: 540 } });
// the builder pages load three.js r128 from a CDN; the container has no CDN access, so serve the same files from npm
// (npm pack three@0.128.0 into .qa-cache/, see docs/qa/2026-11-19.md)
const C = path.join(root, '.qa-cache');
if (fs.existsSync(path.join(C, 'three.min.js'))) {
  await pg.route(/three\.min\.js$/, r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(C, 'three.min.js')) }));
  await pg.route(/OrbitControls\.js$/, r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(C, 'OrbitControls.js')) }));
}
const errs = []; pg.on('pageerror', e => errs.push(pg.url().split('/').pop().slice(0, 40) + ': ' + e.message));
const log = (...a) => console.log(((Date.now() - t0) / 1000).toFixed(0) + 's', ...a); const t0 = Date.now();
const res = { kind };
try {
  await pg.goto(base + '?pnew=6#ibup', { waitUntil: 'load' });
  await pg.waitForFunction(() => { const b = document.getElementById('builderBtn'); return b && b.onclick && String(b.onclick).includes('up=1'); }, null, { timeout: 300000 });
  log('game running, builder button carries up=1');
  await pg.waitForTimeout(3000);
  await pg.evaluate(() => document.getElementById('builderBtn').onclick());
  await pg.waitForURL(/player\.html.*up=1/, { timeout: 60000 }); res.builderUrl = pg.url().replace(base, '');
  log('builder', res.builderUrl);
  await pg.waitForFunction(() => { try { return window.__ED && __ED.doc && __ED.doc.bld && document.getElementById('bubble'); } catch (e) { return false; } }, null, { timeout: 300000 });
  await pg.waitForTimeout(5000);
  res.bubble = await pg.evaluate(k => { const doc = __ED.doc, select = __ED.H.select; const t = k === 'cafe' ? 'bld' : 'props'; const i = doc[t].findIndex(o => o.fixed && (k === 'cafe' ? o.s === 'cafe' : o.k === 'jetty')); if (i < 0) return 'no fixed ' + k; select({ type: t, i }); return document.getElementById('bubble').innerText.replace(/\s+/g, ' '); }, kind);
  res.hasUp = await pg.evaluate(() => !!document.querySelector('#bubble button[data-a=fixup]'));
  // a fixed landmark that is not the café/jetty must still show no upgrade button
  res.lighthouse = await pg.evaluate(() => { const doc = __ED.doc, select = __ED.H.select; const i = doc.bld.findIndex(o => o.fixed && o.s === 'lighthouse'); if (i < 0) return 'none'; select({ type: 'bld', i }); return document.querySelector('#bubble button[data-a=fixup]') ? 'HAS UP (wrong)' : 'no up (ok)'; });
  await pg.evaluate(k => { const doc = __ED.doc, select = __ED.H.select; const t = k === 'cafe' ? 'bld' : 'props'; const i = doc[t].findIndex(o => o.fixed && (k === 'cafe' ? o.s === 'cafe' : o.k === 'jetty')); select({ type: t, i }); }, kind);
  log('bubble', res.bubble, res.hasUp, res.lighthouse);
  res.bubbleShown = await pg.evaluate(() => { const r = document.getElementById('bubble').getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(','); });
  await pg.evaluate(() => document.querySelector('#bubble button[data-a=fixup]').click());
  await pg.waitForURL(/resume=6/, { timeout: 60000 }).catch(() => {});
  res.backUrl = pg.url().replace(base, '');
  log('back', res.backUrl);
  const ov = kind === 'cafe' ? 'cafeOv' : 'shopOv';
  res.panelOpen = await pg.waitForFunction(id => { const o = document.getElementById(id); return o && !o.hidden; }, ov, { timeout: 300000 }).then(() => true).catch(() => false);
  res.builderBtnStillUp = await pg.evaluate(() => { const b = document.getElementById('builderBtn'); return !!(b && String(b.onclick).includes('up=1')); });
  await pg.waitForTimeout(1500);
  const cdp = await pg.context().newCDPSession(pg); const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
  fs.writeFileSync(path.join(root, 'qa-ibup-' + kind + '.jpg'), Buffer.from(shot.data, 'base64'));
} catch (e) { res.fail = String(e).slice(0, 300); }
res.errors = errs; res.secs = (Date.now() - t0) / 1000;
console.log(JSON.stringify(res, null, 1));
await b.close(); srv.close();
