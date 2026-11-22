// Boat race check (22 Nov 2026): new game with ?race, starts a jet-ski race at the jetty, drives toward the first gates, screenshots,
// then runs the course through every checkpoint and reports place, time, prize and errors.
//   python3 tools/qa-hooks.py && node tools/qa-race.mjs <outDir>
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const [out = 'race-out'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); r.end(fs.readFileSync(p)); }).listen(0);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 960, height: 600 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
await pg.route(u => !u.hostname.endsWith('localhost') && u.hostname !== '127.0.0.1', r => r.abort());
await pg.goto(`http://127.0.0.1:${srv.address().port}/__t.html?race`, { waitUntil: 'commit', timeout: 120000 });
await pg.waitForFunction(() => window.__t && window.__t.S, null, { timeout: 180000, polling: 1000 }); await pg.waitForTimeout(15000);
const ev = js => pg.evaluate(j => window.__t.ev(j), js);
await pg.evaluate(() => { window.__t.startGame({}); window.__t.ev('save=function(){}'); });
await pg.waitForFunction(() => window.__t.ev("typeof BOAT!=='undefined'&&!!BOAT.g&&typeof IBMAP!=='undefined'&&IBMAP.done"), null, { timeout: 240000, polling: 2000 });
await ev("dlgQ=[];if(typeof dlgDone!=='undefined')dlgDone=null;ui.dlg.hidden=true;overlay=null;running=true;player.x=BOAT.dock.x;player.z=BOAT.dock.z");
await ev("__RACE.start('jetski')"); await pg.waitForTimeout(2500); await ev("__RACE.count=0");
const shot = async n => { const cdp = await pg.context().newCDPSession(pg); const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 }); fs.writeFileSync(path.join(out, n + '.jpg'), Buffer.from(data, 'base64')); };
await ev("(()=>{const s=__RACE.course.start,c=__RACE.cps[0];BOAT.x=s.x+(c.x-s.x)*.6;BOAT.z=s.z+(c.z-s.z)*.6;BOAT.h=Math.atan2(c.z-s.z,c.x-s.x);})()"); await pg.waitForTimeout(9000); await shot('race-gate');
const rep = { cps: await ev('__RACE.cps.length'), len: await ev('Math.round(__RACE.course.len)'), bad: await ev('__RACE.course.bad') };
const c0 = await ev('S.coins');
for (let i = 0; i < 40 && await ev('__RACE.on&&!__RACE.done'); i++) { await ev("(()=>{const c=__RACE.cps[__RACE.k];BOAT.x=c.x;BOAT.z=c.z;})()"); await pg.waitForTimeout(700); }
await pg.waitForTimeout(800); await shot('race-finish');
Object.assign(rep, { done: await ev('__RACE.done'), race: await ev('JSON.stringify(S.race)'), coins: (await ev('S.coins')) - c0 });
await pg.waitForTimeout(3500); rep.after = await ev('({on:__RACE.on,boatOn:BOAT.on,kind:BOAT.kind})'); rep.errs = errs;
console.log(JSON.stringify(rep)); await b.close(); srv.close();
