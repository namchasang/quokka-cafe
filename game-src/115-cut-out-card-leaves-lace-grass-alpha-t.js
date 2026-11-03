/* cut-out card (leaves, lace, grass): alpha-tested, both sides, casts a matching shadow */
function card(c, w, h) {
  const m = Mat({ map: tex(c), alphaTest: .5, side: T.DoubleSide }); m.userData.mask = maskOf(c);
  const mesh = new T.Mesh(new T.PlaneGeometry(w, h), m); mesh.castShadow = mesh.receiveShadow = true;
  mesh.customDepthMaterial = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking, map: m.map, alphaTest: .5 }); return mesh;
}
function sign(text, w, h, fg, bg, sd) {
  const [c, x] = cv(w * PPM, h * PPM), W = c.width, H = c.height; px(x, INK, 0, 0, W, H); px(x, bg, 2, 2, W - 4, H - 4); px(x, sh(bg, 1.2), 2, 2, W - 4, 1); px(x, sh(bg, .7), 2, H - 3, W - 4, 1);
  x.font = `bold ${Math.floor(H * .56)}px "Mitr","Noto Sans Thai",sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = sh(bg, .45); x.fillText(text, W / 2 + 1, H / 2 + 2); x.fillStyle = fg; x.fillText(text, W / 2, H / 2 + 1);
  return c;
}
/* ---------- foliage ---------- */
const RAMPS = {
  gum: ['#33482f', '#4f6a48', '#6f8a62', '#93a982', '#b9c8a2'], green: ['#24461f', '#356329', '#4f8536', '#73a84a', '#a5cc6a'],
  sakura: ['#9a4a64', '#c86a86', '#e796ac', '#f6bfcd', '#fde4ea'], palm: ['#2a4a1c', '#3f6a26', '#5a8c32', '#82b048', '#b0d070'], dry: ['#6a6a3a', '#8a8a4a', '#aaa45a', '#c8bc72', '#e0d490'] };
function leafCanvas(ramp, sd, size = 40) {
  seed(sd); const [c, x] = cv(size, size), r = size / 2;
  for (let i = 0; i < size * 5; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * r * .92, X = r + Math.cos(a) * d, Y = r + Math.sin(a) * d * .9; const t = (Y / size) * .9 + rnd() * .25, k = Math.min(4, Math.max(0, Math.floor((1 - t) * 4.2)));
    px(x, ramp[k], X, Y, 2 + (rnd() < .4 ? 1 : 0), 2); if (k >= 3 && rnd() < .3) px(x, ramp[4], X, Y); }
  const d = x.getImageData(0, 0, size, size), D = d.data; for (let y = 1; y < size - 1; y++) for (let X = 1; X < size - 1; X++) { const i = (y * size + X) * 4; if (D[i + 3] && !D[((y + 1) * size + X) * 4 + 3]) { D[i] = D[i] * .55; D[i + 1] = D[i + 1] * .55; D[i + 2] = D[i + 2] * .6; } }
  x.putImageData(d, 0, 0); return c;
}
function crown(g, cx, cy, cz, r, rampKey, sd, cards = 9, squash = .8) { cards = Math.round(cards * 1.5);
  const ramp = RAMPS[rampKey], core = new T.Mesh(P.shadeY(vpaint(new T.IcosahedronGeometry(r * .6, 1), ramp.slice(0, 2), .05, sd), .55, 1.05), Mat({ vertexColors: true, flatShading: true })); core.scale.y = squash; core.position.set(cx, cy, cz); core.castShadow = core.receiveShadow = true; g.add(core);
  seed(sd * 7 + 3); for (let i = 0; i < cards; i++) { const a = rnd() * Math.PI * 2, el = (rnd() - .3) * 1.1, s = r * (.75 + rnd() * .5); const m = card(leafCanvas(ramp, sd * 31 + i), s * 1.2, s * 1.05);
    m.position.set(cx + Math.cos(a) * Math.cos(el) * r * .72, cy + Math.sin(el) * r * squash * .8, cz + Math.sin(a) * Math.cos(el) * r * .72); m.rotation.y = -a + Math.PI / 2 + (rnd() - .5) * .6; g.add(m); }
}
function barkCanvas(base, h, pale) { const [c, x] = cv(24, Math.max(8, h * PPM)); K.seed(9); K.plaster(x, c.width, c.height, base); for (let i = 0; i < c.height / 3; i++) { const X = rnd() * 24 | 0, Y = rnd() * c.height | 0, L = 3 + rnd() * 8 | 0; px(x, pale && rnd() < .5 ? '#e8e2d4' : sh(base, .7), X, Y, 2, L); } return c; }
function trunk(g, r0, r1, h, x, y, z, base, pale, tilt = 0, rotY = 0) { const m = new T.Mesh(new T.CylinderGeometry(r1, r0, h, 7), mat(barkCanvas(base, h, pale))); m.position.set(x, y + h / 2, z); m.rotation.z = tilt; m.rotation.y = rotY; m.castShadow = m.receiveShadow = true; g.add(m); return m; }
function grassCanvas(sd, w = 32, h = 24, flowers) { seed(sd); const [c, x] = cv(w, h); const ramp = RAMPS.green; for (let i = 0; i < w * 1.6; i++) { const X = rnd() * w | 0, L = 6 + rnd() * (h - 6) | 0, lean = rnd() < .5 ? -1 : 1; for (let j = 0; j < L; j++) px(x, ramp[Math.min(4, Math.floor(j / L * 4) + (rnd() < .2 ? 1 : 0))], X + Math.round(lean * j * j / (L * 3)), h - 1 - j); }
  if (flowers) for (let i = 0; i < 6; i++) { const X = 2 + rnd() * (w - 4), Y = 2 + rnd() * h * .4; px(x, flowers[i % flowers.length], X, Y, 2, 2); px(x, '#fff4c8', X, Y); } return c; }

/* ---------- buildings ---------- */
P.HD = P.HD || {};
const reg = (id, name, build, extra) => { P.HD[id] = Object.assign({ id, name, snap: 1, build }, extra || {}); };
const light = (g, x, y, z, col = '#ffe2b0', range = 14) => { const o = new T.Object3D(); o.position.set(x, y, z); o.userData.light = { col, range }; g.add(o); return o; };
reg('hd-jp-corner', 'ร้านหัวมุมญี่ปุ่น', o => {
  const g = new T.Group(), W = 7, D = 6, H1 = 3.2, H2 = 3, base = '#e4ddcf', sd = o.seed || 3; K.seed(sd);
  const front = (w, h, lit) => { const [c, x] = cv(w * PPM, h * PPM); K.plaster(x, c.width, c.height, base); x.drawImage(K.glass(c.width - 16, c.height - 26, { lit, tint: '#6a8aa6', seed: sd }), 8, 18); K.plinth(x, c.width, c.height, '#8a8e96'); return c; };
  box(g, W, H1, D, [glowMat(front(D, H1, false), front(D, H1, true)), K.wall(D, H1, { base, kind: 'plaster', win: 1, door: false, rows: 1, plinth: true }), '#8a8e96', '#666', glowMat(front(W, H1, false), front(W, H1, true)), K.wall(W, H1, { base, kind: 'plaster', win: 0, rows: 1 })], 0, H1 / 2, 0, true);
  const up = (w, n, lit) => K.wall(w, H2, { base: '#d9d2c2', kind: 'plaster', win: n, rows: 1, plinth: false, cornice: true, lit, seed: sd + n });
  box(g, W, H2, D, [glowMat(up(D, 2, false), up(D, 2, true)), up(D, 1, false), K.roof(W, D, { kind: 'tin', base: '#8a8e96', seed: sd }), '#666', glowMat(up(W, 2, false), up(W, 2, true)), up(W, 2, false)], 0, H1 + H2 / 2, 0, true);
  box(g, W + .2, .5, D + .2, ['#cfc8b8', '#cfc8b8', '#bfb8a8', '#cfc8b8', '#cfc8b8', '#cfc8b8'], 0, H1 + H2 + .25, 0);
  const aw = new T.Mesh(new T.BoxGeometry(W, .08, 1.3), [plain('#c43a2c'), plain('#c43a2c'), mat(stripes(W, 1.3, '#c43a2c', '#f2efe6', 14)), plain('#c43a2c'), plain('#c43a2c'), plain('#c43a2c')]); aw.position.set(0, H1 - .25, D / 2 + .62); aw.rotation.x = .22; aw.castShadow = true; g.add(aw);
  const v = card(valance(W, '#c43a2c', '#f2efe6'), W, .32); v.position.set(0, H1 - .5, D / 2 + 1.27); g.add(v);
  const aw2 = new T.Mesh(new T.BoxGeometry(1.3, .08, D), [plain('#c43a2c'), plain('#c43a2c'), mat(stripes(1.3, D, '#c43a2c', '#f2efe6', 2)), plain('#c43a2c'), plain('#c43a2c'), plain('#c43a2c')]); aw2.position.set(W / 2 + .62, H1 - .25, 0); aw2.rotation.z = -.22; g.add(aw2);
  box(g, 4.2, .8, .12, [null, null, null, null, sign(o.t || 'まるや', 4.2, .8, '#ffffff', '#1f4a8a'), '#1f4a8a'], 0, H1 + .45, D / 2 + .08);
  box(g, .9, .6, .45, ['#c8ccd5', '#c8ccd5', '#d8dce2', '#999', K.pane(false, 18, 12, '#c8ccd5'), '#c8ccd5'], W / 2 + .25, H1 + 1.2, -1.6);
  box(g, .12, H1 + H2, .12, ['#8a8e96', '#8a8e96', '#8a8e96', '#8a8e96', '#8a8e96', '#8a8e96'], -W / 2 + .2, (H1 + H2) / 2, D / 2 + .08);
  box(g, 1.2, 1, 1, ['#aab0ba', '#aab0ba', '#b8bec8', '#999', '#aab0ba', '#aab0ba'], 1.6, H1 + H2 + 1, -1.2);
  light(g, 0, H1 - .6, D / 2 + 1.2, '#ffe2b0', 12); return g;
}, { text: 'まるや', defaults: { t: 'まるや' } });
reg('hd-thai-shophouse', 'ตึกแถวไทย', o => {
  const g = new T.Group(), W = 4.6, D = 10, FH = 3.2, base = o.c || '#e8d6b0', sd = o.seed || 5;
  box(g, W, FH, D, ['#d8c8a0', '#d8c8a0', '#999', '#999', glowMat(shutter(W, FH, .55, '#9aa0aa', false), shutter(W, FH, .55, '#9aa0aa', true)), '#d8c8a0'], 0, FH / 2, 0, true);
  for (let f = 1; f < 3; f++) box(g, W, FH, D, [K.wall(D, FH, { base: sh(base, .95), kind: 'plaster', win: 0, rows: 1, cornice: false, plinth: false, seed: sd + f }), K.wall(D, FH, { base: sh(base, .95), kind: 'plaster', win: 0, rows: 1, cornice: false, plinth: false, seed: sd + f + 9 }), '#999', '#999', glowMat(shophouseFloor(W, FH, base, false, sd + f), shophouseFloor(W, FH, base, true, sd + f)), '#d8c8a0'], 0, FH * f + FH / 2, 0, true);
  box(g, W + .1, .7, D, ['#d8c8a0', '#d8c8a0', K.roof(W, D, { kind: 'tin', base: '#9a9a90' }), '#999', K.wall(W, .7, { base: sh(base, 1.05), kind: 'plaster', win: 0, rows: 1, plinth: false, cornice: true }), '#d8c8a0'], 0, FH * 3 + .35, 0);
  box(g, W - .2, .75, .12, [null, null, null, null, sign(o.t || 'ข้าวแกงแม่ศรี', W - .2, .75, '#fff2c8', '#b8261f'), '#b8261f'], 0, FH + .1, D / 2 + .08);
  box(g, W, .15, .9, ['#c8bca0', '#c8bca0', '#d8ccb0', '#a89c80', '#c8bca0', '#c8bca0'], 0, FH * 2, D / 2 + .45);
  for (let k = 0; k < 9; k++) box(g, .05, .8, .05, ['#3a3f4a', '#3a3f4a', '#3a3f4a', '#3a3f4a', '#3a3f4a', '#3a3f4a'], -W / 2 + .25 + k * .52, FH * 2 + .45, D / 2 + .85);
  box(g, W, .05, .05, ['#3a3f4a', '#3a3f4a', '#3a3f4a', '#3a3f4a', '#3a3f4a', '#3a3f4a'], 0, FH * 2 + .85, D / 2 + .85);
  [[-1.4, '#3f8f3c'], [.2, '#d84a6a'], [1.5, '#5a9a40']].forEach(([x0, c], i) => { box(g, .35, .3, .35, ['#a85a3a', '#a85a3a', '#3a2a1a', '#a85a3a', '#a85a3a', '#a85a3a'], x0, FH * 2 + .23, D / 2 + .55); crown(g, x0, FH * 2 + .62, D / 2 + .55, .32, i === 1 ? 'sakura' : 'green', sd + i, 3, .9); });
  box(g, .9, .6, .45, ['#c8ccd5', '#c8ccd5', '#d8dce2', '#999', K.pane(false, 18, 12, '#c8ccd5'), '#c8ccd5'], W / 2 - .7, FH * 2 + 1.9, D / 2 + .25);
  light(g, 0, FH - .3, D / 2 + .8, '#ffd8a0', 10); return g;
}, { tint: true, text: 'ข้าวแกงแม่ศรี', defaults: { c: '#e8d6b0', t: 'ข้าวแกงแม่ศรี' }, colors: ['#e8d6b0', '#d8e4d0', '#e8c8c0', '#d0dce8', '#f0e4a8'] });
reg('hd-perth-victorian', 'ร้านวิกตอเรียน Perth', o => {
  const g = new T.Group(), W = 8, D = 7, H1 = 3.4, H2 = 3.2, brick = o.c || '#b8644a', sd = o.seed || 7;
  const gf = lit => K.wall(W, H1, { base: brick, kind: 'brick', win: 2, door: true, rows: 1, lit, seed: sd, winW: 34, winH: 40 });
  const ff = lit => K.wall(W, H2, { base: brick, kind: 'brick', win: 3, rows: 1, arch: true, shutter: '#2f5a4a', lit, seed: sd + 1 });
  box(g, W, H1, D, [K.wall(D, H1, { base: brick, kind: 'brick', win: 1, rows: 1, seed: sd + 2 }), K.wall(D, H1, { base: brick, kind: 'brick', win: 1, rows: 1, seed: sd + 3 }), '#999', '#999', glowMat(gf(false), gf(true)), K.wall(W, H1, { base: brick, kind: 'brick', win: 2, rows: 1 })], 0, H1 / 2, 0, true);
  box(g, W, H2, D, [K.wall(D, H2, { base: brick, kind: 'brick', win: 2, rows: 1, seed: sd + 4 }), K.wall(D, H2, { base: brick, kind: 'brick', win: 2, rows: 1, seed: sd + 5 }), '#999', '#999', glowMat(ff(false), ff(true)), K.wall(W, H2, { base: brick, kind: 'brick', win: 3, rows: 1 })], 0, H1 + H2 / 2, 0, true);
  box(g, W, 1.1, .4, [null, null, '#e8dcc0', null, (() => { const [c, x] = cv(W * PPM, 1.1 * PPM); K.blocks(x, c.width, c.height, '#ecdcb8', { rowH: 8 }); K.cornice(x, c.width, c.height, '#f4ecd8'); x.font = 'bold 18px serif'; x.fillStyle = '#7a5a3a'; x.textAlign = 'center'; x.fillText('1898', c.width / 2, 28); return c; })(), '#e8dcc0'], 0, H1 + H2 + .55, D / 2 - .2);
  gable(g, W, D - .4, 1.6, K.roof(W + .7, 2.5, { kind: 'tin', base: '#7a8a8e', across: false }), brick, H1 + H2, .3);
  const vd = 2.2, vh = H1 - .1; for (let k = 0; k < 5; k++) { box(g, .14, vh, .14, ['#2f5a4a', '#2f5a4a', '#2f5a4a', '#2f5a4a', '#2f5a4a', '#2f5a4a'], -W / 2 + .3 + k * (W - .6) / 4, vh / 2, D / 2 + vd); }
  const vr = new T.Mesh(new T.BoxGeometry(W + .3, .1, vd + .2), [plain('#7a8a8e'), plain('#7a8a8e'), mat(K.roof(W + .3, vd + .2, { kind: 'tin', base: '#8a9a9e', across: true })), plain('#6a7a7e'), plain('#7a8a8e'), plain('#7a8a8e')]); vr.position.set(0, vh + .15, D / 2 + vd / 2); vr.rotation.x = .12; vr.castShadow = true; g.add(vr);
  const l = card(lace(W), W, .45); l.position.set(0, vh - .25, D / 2 + vd + .02); g.add(l);
  [-1, 1].forEach(s => { const l2 = card(lace(vd), vd, .45); l2.rotation.y = Math.PI / 2; l2.position.set(s * (W / 2 + .05), vh - .25, D / 2 + vd / 2); g.add(l2); });
  light(g, -2, vh - .4, D / 2 + 1, '#ffd8a0', 10); light(g, 2, vh - .4, D / 2 + 1, '#ffd8a0', 10); return g;
}, { tint: true, defaults: { c: '#b8644a' }, colors: ['#b8644a', '#c88a5a', '#e4d2a8', '#9a5a4a'] });
reg('hd-cafe-wood', 'คาเฟ่ไม้', o => {
  const g = new T.Group(), W = 6, D = 5, H = 3, board = o.c || '#d8e4e0', sd = o.seed || 11;
  const f = lit => K.wall(W, H, { base: board, kind: 'board', win: 2, door: true, rows: 1, lit, seed: sd, winW: 30, winH: 34, shutter: '#c8605a' });
  box(g, W, H, D, [K.wall(D, H, { base: board, kind: 'board', win: 1, rows: 1, seed: sd + 1 }), K.wall(D, H, { base: board, kind: 'board', win: 1, rows: 1, seed: sd + 2 }), '#999', '#999', glowMat(f(false), f(true)), K.wall(W, H, { base: board, kind: 'board', win: 1, rows: 1 })], 0, H / 2, 0, true);
  gable(g, W, D, 1.9, K.roof(W + .7, 3.5, { kind: 'tile', base: '#b85434', seed: sd }), board, H, .35);
  const aw = new T.Mesh(new T.BoxGeometry(W - .6, .08, 1.1), [plain('#2f7a74'), plain('#2f7a74'), mat(stripes(W - .6, 1.1, '#2f7a74', '#f2efe6', 12)), plain('#2f7a74'), plain('#2f7a74'), plain('#2f7a74')]); aw.position.set(0, H - .4, D / 2 + .52); aw.rotation.x = .25; aw.castShadow = true; g.add(aw);
  const v = card(valance(W - .6, '#2f7a74', '#f2efe6'), W - .6, .3); v.position.set(0, H - .62, D / 2 + 1.05); g.add(v);
  box(g, .9, 1.2, .08, [null, null, null, null, (() => { const [c, x] = cv(.9 * PPM, 1.2 * PPM); px(x, '#5a3a22', 0, 0, c.width, c.height); px(x, '#22302a', 2, 2, c.width - 4, c.height - 4); x.fillStyle = '#f2efe6'; x.font = 'bold 7px sans-serif'; ['COFFEE', 'TEA', 'CAKE'].forEach((t, i) => x.fillText(t, 4, 11 + i * 9)); px(x, '#e8b860', 4, 32, 10, 1); return c; })(), '#5a3a22'], 2.4, .6, D / 2 + .9);
  box(g, .5, .45, .5, ['#a85a3a', '#a85a3a', '#3a2a1a', '#a85a3a', '#a85a3a', '#a85a3a'], -2.6, .23, D / 2 + .5); crown(g, -2.6, .85, D / 2 + .5, .45, 'green', sd, 4, .9);
  light(g, 0, H - .6, D / 2 + .9, '#ffe2b0', 10); return g;
}, { tint: true, defaults: { c: '#d8e4e0' }, colors: ['#d8e4e0', '#f2ecd8', '#e8d0c8', '#d0dcec', '#e8e4a8'] });

