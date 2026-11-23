// Needs __t.html (python3 tools/qa-hooks.py). Lists what stands in a town box at runtime (for writing a town as a builder map): every visible piece bigger than `min`
// (box centre, size, height, colour, sign text when it has one) and every tap target, as JSON.
//   node tools/qa-dump-zone.mjs <x1> <x2> <z1> <z2> <out.json> [query='?shot=150,8,10,0,1,0'] [min=0.8]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [x1, x2, z1, z2, out, q = '?shot=150,8,10,0,1,0', min = '0.8'] = process.argv.slice(2);
const srv = http.createServer((rq, r) => { let p = path.join(root, decodeURIComponent(rq.url.split('?')[0])); if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); r.end(fs.readFileSync(p)); }).listen(0);
const b = await chromium.launch({ args: ['--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 800, height: 450 } });
await pg.route(u => !u.hostname.endsWith('localhost') && u.hostname !== '127.0.0.1', r => r.abort());
await pg.goto(`http://127.0.0.1:${srv.address().port}/__t.html${q}`, { waitUntil: 'commit', timeout: 120000 });
await pg.waitForTimeout(50000);
const res = await pg.evaluate(([x1, x2, z1, z2, min]) => window.__t.ev(`(()=>{const [x1,x2,z1,z2,min]=[${x1},${x2},${z1},${z2},${min}];
  const sx = scene.scale.x; scene.scale.x = 1; scene.updateMatrixWorld(true);
  const B = new THREE.Box3(), out = [], tex = new Map();
  try { SIGN_TEX.forEach((v, k) => tex.set(k, v)); } catch (e) {}
  const signOf = o => { let s = ''; o.traverse(c => { if (s || !c.material || Array.isArray(c.material) || !c.material.map) return; const t = tex.get(c.material.map); if (t) s = Array.isArray(t) ? t.join(' ') : String(t); }); return s; };
  const visit = (o, d) => { if (o.isLight || o.isCamera || !o.visible) return; try { B.setFromObject(o); } catch (e) { return; } if (B.isEmpty()) return;
    const w = B.max.x - B.min.x, dd = B.max.z - B.min.z; const inside = B.min.x > x1 && B.max.x < x2 && B.min.z > z1 && B.max.z < z2;
    if (!inside) { if (o.children.length && d < 6) o.children.forEach(c => visit(c, d + 1)); return; }
    if (Math.max(w, dd, B.max.y - B.min.y) < min) return;
    let col = ''; try { const m = o.material || (o.children.find(c => c.material) || {}).material; if (m && m.color) col = '#' + m.color.getHexString(); } catch (e) {}
    out.push({ n: o.name || o.type, x: +((B.min.x + B.max.x) / 2).toFixed(1), z: +((B.min.z + B.max.z) / 2).toFixed(1), w: +w.toFixed(1), d: +dd.toFixed(1), y0: +B.min.y.toFixed(1), h: +B.max.y.toFixed(1), col, sign: signOf(o), kids: o.children.length }); };
  scene.children.forEach(c => visit(c, 0)); scene.scale.x = sx; scene.updateMatrixWorld(true);
  let T = []; try { const px = player.x, pz = player.z; player.x = (x1 + x2) / 2; T = buildTargets().filter(t => t.x > x1 && t.x < x2 && t.z > z1 && t.z < z2).map(t => ({ x: +t.x.toFixed(1), z: +t.z.toFixed(1), l: (t.label || t.id || t.type || '') + '' })); player.x = px; player.z = pz; } catch (e) { T = ['err ' + e.message]; }
  return { objs: out, targets: T };})()`), [+x1, +x2, +z1, +z2, +min]);
fs.writeFileSync(out, JSON.stringify(res, null, 0));
console.log(res.objs.length, 'objects', res.targets.length, 'targets');
await b.close(); srv.close();
