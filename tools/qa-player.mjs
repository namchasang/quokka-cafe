// Player / economy probe: opens __t.html (make it with `python3 tools/qa-hooks.py`), starts a fresh game and runs
// the game's own update() in fast steps for whole café days, then prints what a player would have earned.
//   node tools/qa-player.mjs <outDir> [mode=economy] [days=3]
// Modes: economy (staff 0 then 3, income per day), probe (runs a JS snippet from env QA_JS inside the game closure).
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [out = 'qa-out', mode = 'economy', days = '3'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const srv = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : p.endsWith('.json') ? 'application/json' : 'application/octet-stream' });
  r.end(fs.readFileSync(p));
}).listen(0);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 960, height: 540 } });
const errs = [];
pg.on('pageerror', e => errs.push('pageerror: ' + (e.message || '').slice(0, 300)));
await pg.route(u => !u.hostname.endsWith('localhost') && u.hostname !== '127.0.0.1', r => r.abort());
await pg.goto(`http://127.0.0.1:${srv.address().port}/__t.html`, { waitUntil: 'commit', timeout: 120000 });
await pg.waitForFunction(() => window.__t && window.__t.S, null, { timeout: 180000, polling: 1000 });
await pg.waitForTimeout(20000);
let res;
if (mode === 'economy') {
  res = await pg.evaluate(async (nDays) => {
    const T = window.__t, out = [];
    T.ev("requestAnimationFrame=()=>0");             // stop rendering, logic only
    T.startGame(null); T.ev("save=function(){}");
    const step = async (mins) => { const S = T.S, end = S.time + mins; let n = 0;
      while (T.S.time < end && n < 200000) { T.ev("dlgQ=[];dlgDone=null;ui.dlg.hidden=true;overlay=null;running=true;transit=false");
        T.ev("customers.forEach(c=>{if(c.state==='wait'&&!c.served){}})"); T.update(.05); n++; if (n % 2000 === 0) await new Promise(r => setTimeout(r, 0)); } };
    // Kip does not serve here; staff do. Day 1: 1 staff, day 2: 3 staff + espresso machine, day 3+: harbour level 3 (JMULT[2]).
    for (let d = 0; d < nDays; d++) {
      const S = T.S; if (d === 0) { S.staff = 1; T.syncStaff(); } if (d === 1) { S.staff = 3; T.syncStaff(); S.wish.machine = true; } if (d === 2) { S.jetty = 2; T.ev('applyJetty&&applyJetty()'); }
      S.wx = 0; S.time = 419; S.closed = true; S.served = 0; S.earned = 0; const c0 = S.coins;
      await step(560);
      out.push({ day: S.day, staff: S.staff || 0, served: S.served, earned: S.earned, coinsDelta: S.coins - c0, wx: S.wx, lv: T.cafeLv() });
      T.ev("newDay()");
    }
    return { out, prices: { items: Object.fromEntries(Object.entries(T.ITEMS).map(([k, v]) => [k, v.price])), wish: T.WISH.map(w => [w.id, w.price]), cafeLv: T.CAFE_LV.map(l => l.price) } };
  }, +days);
} else {
  res = await pg.evaluate((js) => window.__t.ev(js), process.env.QA_JS || '1');
}
fs.writeFileSync(path.join(out, mode + '.json'), JSON.stringify({ res, errs }, null, 1));
console.log(JSON.stringify({ res, errs: errs.slice(0, 10) }, null, 1).slice(0, 4000));
await b.close(); srv.close();
