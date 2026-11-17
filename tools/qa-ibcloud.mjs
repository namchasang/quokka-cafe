// Probe for the ?ibcloud lab (built island in the cloud saves). Needs __t.html (python3 tools/qa-hooks.py).
//   node tools/qa-ibcloud.mjs [secs=50]
// The island server is faked: every /rest/v1/rpc/ call is answered here and its body kept, nothing leaves the container.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [secs = '50'] = process.argv.slice(2);
const srv = http.createServer((q, r) => {
  let p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' });
  r.end(fs.readFileSync(p));
}).listen(0);
const port = srv.address().port;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 1000, height: 640 } });
const errs = [], calls = [];
pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
pg.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|favicon|api\/config/.test(m.text())) errs.push('console: ' + m.text()); if (/ibcloud/.test(m.text())) console.log('  [page]', m.text()); });
let refuseBig = false, cloudSave = null;
await pg.route(u => /\/rest\/v1\/rpc\//.test(u.pathname), async r => {
  const fn = r.request().url().split('/rpc/')[1], body = JSON.parse(r.request().postData() || '{}');
  calls.push({ fn, hasIsland: !!(body.p_save && body.p_save.ibdoc), len: (r.request().postData() || '').length });
  if (fn === 'qc_sync') { if (refuseBig && body.p_save && body.p_save.ibdoc) return r.fulfill({ status: 400, contentType: 'application/json', body: '{"message":"value too long"}' });
    cloudSave = body.p_save; return r.fulfill({ status: 200, contentType: 'application/json', body: '{"likes":0,"visits":0,"gifts":0}' }); }
  if (fn === 'qc_cloud_save') { cloudSave = body.p_save; return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); }
  if (fn === 'qc_load' || fn === 'qc_cloud_load') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ save: cloudSave, owner: 'Tester', island: 'Test' }) });
  return r.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
});
await pg.route(u => !/localhost|127\.0\.0\.1/.test(u.hostname) && !/\/rest\/v1\/rpc\//.test(u.pathname), r => r.abort());
await pg.goto(`http://127.0.0.1:${port}/__t.html?pnew=6#ibcloud`, { waitUntil: 'commit', timeout: 120000 });
await pg.waitForTimeout(+secs * 1000);
const ev = c => pg.evaluate(c);
const res = {};
res.on = await ev(`__t.ev('IBCLOUD.on')`);
res.ibmapDone = await ev(`__t.ev('IBMAP.done')`);
// 1) a built island on this device: start map + one marker tree
await ev(`(()=>{const d=__t.ev('JSON.parse(JSON.stringify(IBMAP_START))');d.qaMarker='night-18-nov';localStorage.setItem('ppl-mapedit-player-rott'+d.ver,JSON.stringify(d));})()`);
res.packLen = await ev(`(__t.ev('IBCLOUD.pack()')||{t:''}).t.length`);
res.sizeBefore = await ev(`JSON.stringify(__t.S).length`);
// 2) Island Code sync sends it, the game save does not grow
res.sync = await ev(`__t.ev("qcRpc('qc_sync',{p_code:'1',p_secret:'x',p_owner:'a',p_island:'b',p_snap:{},p_save:{coins:5},p_cafe:1}).then(()=>'ok',e=>'err '+e.message)")`);
res.sentIsland = calls.at(-1) && calls.at(-1).hasIsland;
res.sizeAfter = await ev(`JSON.stringify(__t.S).length`);
// 3) restore on a "new phone": wipe the island, load the code, island comes back and the island rebuilds
await ev(`Object.keys(localStorage).filter(k=>k.indexOf('ppl-mapedit-player-rott')===0).forEach(k=>localStorage.removeItem(k))`);
res.load = await ev(`__t.ev("qcRpc('qc_load',{p_code:'1',p_secret:'x'}).then(j=>j&&j.save&&!j.save.ibdoc?'ok, island taken out of the save':'bad',e=>'err '+e.message)")`);
res.restored = await ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.indexOf('ppl-mapedit-player-rott')===0);return k?JSON.parse(localStorage.getItem(k)).qaMarker:null;})()`);
await pg.waitForTimeout(25000);
res.ibmapDoneAfterReload = await ev(`__t.ev('IBMAP.done')`);
res.ibmapSrc = await ev(`__t.ev('IBMAP.src')`);
// 4) server refuses the bigger save: game save still goes through, island stops being sent
refuseBig = true;
res.syncRefused = await ev(`__t.ev("qcRpc('qc_sync',{p_code:'1',p_secret:'x',p_save:{coins:6}}).then(()=>'ok',e=>'err '+e.message)")`);
res.qcOff = await ev(`__t.ev('IBCLOUD.qcOff')`);
res.lastCallIsland = calls.at(-1).hasIsland;
// 5) account cloud save + load
res.acSave = await ev(`__t.ev("acRpc('qc_cloud_save',{p_slot:6,p_save:{coins:7}}).then(j=>j&&j.ok?'ok':'bad',e=>'err '+e.message)")`);
res.acSentIsland = calls.at(-1).hasIsland;
await ev(`Object.keys(localStorage).filter(k=>k.indexOf('ppl-mapedit-player-rott')===0).forEach(k=>localStorage.removeItem(k))`);
res.acLoad = await ev(`__t.ev("acRpc('qc_cloud_load',{p_slot:6}).then(j=>j&&j.save&&!j.save.ibdoc?'ok':'bad',e=>'err '+e.message)")`);
res.acRestored = await ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.indexOf('ppl-mapedit-player-rott')===0);return k?JSON.parse(localStorage.getItem(k)).qaMarker:null;})()`);
res.calls = calls.map(c => c.fn + (c.hasIsland ? '+island' : '') + ':' + c.len);
res.errors = errs;
await pg.screenshot({ path: path.join(root, 'shot.png') }).catch(() => {});
console.log(JSON.stringify(res, null, 1));
await b.close(); srv.close();
