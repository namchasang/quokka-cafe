/* island cottage: limestone (or board / plaster) walls, gable roof, front verandah on posts. Size is free (o.w, o.d, o.h) so a game
   with its own scale keeps 32 px per unit: Quokka Cafe's cottages are 3 x 2.4 x 1.9. */
reg('hd-cottage', 'กระท่อมหินปูนริมเกาะ', o => {
  const g = new T.Group(), W = o.w || 6, D = o.d || 5, H = o.h || 3, base = o.c || '#efe3c4', kind = o.kind || 'stone', sd = o.seed || 13;
  const roofC = o.roof || '#3f7a5a', rk = o.roofKind || 'tin', trim = o.trim || '#f3efe6', sc = H / 3;
  const ww = Math.round(26 * Math.min(1, sc * 1.25)), wh = Math.round(32 * Math.min(1, sc * 1.25));
  const front = lit => K.wall(W, H, { base, kind, win: o.win == null ? 1 : o.win, door: true, doorAt: o.doorAt != null ? o.doorAt : .62, rows: 1, lit, seed: sd, winW: ww, winH: wh, shutter: o.shutter || null, doorCol: o.doorCol || '#2f5a46', moss: true, quoins: kind === 'stone' });
  const side = (w, n, lit, k) => K.wall(w, H, { base, kind, win: n, rows: 1, lit, seed: sd + k, winW: ww, winH: wh, moss: true });
  box(g, W, H, D, [glowMat(side(D, 1, false, 1), side(D, 1, true, 1)), side(D, 1, false, 2), '#999', '#999', glowMat(front(false), front(true)), side(W, 1, false, 3)], 0, H / 2, 0, true);
  const rh = H * .62; gable(g, W, D, rh, K.roof(W + .7, Math.hypot(D / 2 + .35, rh) + .2, { kind: rk, base: roofC, seed: sd }), base, H, .3 * sc + .05);
  const vd = D * .38, vh = H * .86, post = Math.max(.05, .07 * sc);
  for (let k = 0; k < 3; k++) box(g, post, vh, post, [trim, trim, trim, trim, trim, trim], -W / 2 + .15 * sc + k * (W - .3 * sc) / 2, vh / 2, D / 2 + vd);
  const vr = new T.Mesh(new T.BoxGeometry(W + .2 * sc, .06, vd + .2 * sc), [plain(roofC), plain(roofC), mat(K.roof(W + .2 * sc, vd + .2 * sc, { kind: 'tin', base: roofC, across: true, seed: sd + 5 })), plain(K.sh(roofC, .7)), plain(roofC), plain(roofC)]);
  vr.position.set(0, vh + .1 * sc, D / 2 + vd / 2); vr.rotation.x = .2; vr.castShadow = vr.receiveShadow = true; g.add(vr);
  if (o.chimney !== false) box(g, .5 * sc, H * .5, .5 * sc, (() => { const c = (() => { const [cc, x] = cv(.5 * sc * PPM, H * .5 * PPM); K.seed(sd); K.blocks(x, cc.width, cc.height, base, { rowH: 5, minW: 6, varW: 4 }); return cc; })(); return [c, c, '#5a5048', '#555', c, c]; })(), W * .28, H + rh * .55, -D * .12);
  if (o.lamp !== false) light(g, -W * .2, vh - .2 * sc, D / 2 + vd * .5, '#ffd8a0', 6 * sc + 2);
  return g;
}, { tint: true, defaults: { c: '#efe3c4', roof: '#3f7a5a' }, colors: ['#efe3c4', '#e8d2a6', '#f2e6c8', '#d8e4e0'] });

/* pixel limestone with moss, for re-skinning rocks a game already has */
P.hdRockMat = (sd = 12, base = '#cfc6b0') => { const [c, x] = cv(48, 48); K.seed(sd); K.blocks(x, 48, 48, base, { rowH: 9, minW: 12, varW: 10, mortar: .72 }); K.moss(x, 48, 48, 2.5); return mat(c, { flatShading: true }); };

/* ---------- nature ---------- */
reg('hd-gum', 'ต้นยูคาลิปตัส', o => { const g = new T.Group(), sd = o.seed || 2; trunk(g, .26, .16, 4.2, 0, 0, 0, '#d8d0c0', true); trunk(g, .13, .08, 2.6, .5, 3.2, .2, '#d8d0c0', true, -.6); trunk(g, .12, .08, 2.4, -.4, 3.4, -.3, '#d8d0c0', true, .55, .8);
  crown(g, 1.6, 6.3, .4, 1.5, 'gum', sd, 10, .7); crown(g, -1.3, 6.6, -.6, 1.4, 'gum', sd + 1, 9, .7); crown(g, .2, 7.6, -.1, 1.3, 'gum', sd + 2, 8, .75); return g; }, { snap: .5 });
reg('hd-sakura', 'ต้นซากุระ', o => { const g = new T.Group(), sd = o.seed || 4; trunk(g, .22, .14, 2.2, 0, 0, 0, '#4a3226', false); trunk(g, .11, .07, 1.8, .45, 1.8, 0, '#4a3226', false, -.8); trunk(g, .1, .07, 1.7, -.4, 1.9, .1, '#4a3226', false, .75, .5);
  crown(g, 1.2, 3.4, .1, 1.25, 'sakura', sd, 10, .65); crown(g, -1.1, 3.5, .2, 1.15, 'sakura', sd + 1, 9, .65); crown(g, 0, 4.2, -.4, 1.2, 'sakura', sd + 2, 9, .65);
  const pc = (() => { seed(sd); const [c, x] = cv(64, 64); for (let i = 0; i < 70; i++) px(x, RAMPS.sakura[2 + (rnd() * 3 | 0)], rnd() * 64, rnd() * 64, 2, 1); return c; })(); const pet = card(pc, 4.5, 4.5); pet.rotation.x = -Math.PI / 2; pet.position.y = .03; pet.castShadow = false; g.add(pet); return g; }, { snap: .5 });
reg('hd-palm', 'ต้นมะพร้าว', o => { const g = new T.Group(), sd = o.seed || 6; seed(sd);
  const ring = (() => { const [c, x] = cv(16, 96); for (let y = 0; y < 96; y++) px(x, y % 6 < 2 ? '#7a5a3a' : y % 6 < 4 ? '#a07a52' : '#b89068', 0, y, 16, 1); return c; })();
  for (let k = 0; k < 6; k++) { const s = new T.Mesh(new T.CylinderGeometry(.17 - k * .012, .19 - k * .012, 1, 7), mat(ring)); s.position.set(k * k * .025, .5 + k, 0); s.rotation.z = -k * .025; s.castShadow = true; g.add(s); }
  const frond = (() => { const [c, x] = cv(64, 16); for (let X = 0; X < 64; X++) { const w = Math.round(Math.sin(X / 64 * Math.PI) * 7); px(x, '#5a4a28', X, 8, 1, 1); for (let j = 1; j <= w; j++) { const col = RAMPS.palm[Math.min(4, 4 - Math.floor(j / w * 3) - (X % 4 === 0 ? 1 : 0))]; if ((X + j) % 3) { px(x, col, X, 8 - j); px(x, sh(col, .8), X, 8 + j); } } } return c; })();
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + rnd() * .3, f = card(frond, 3.2, .8); f.geometry.translate(1.6, 0, 0); f.position.set(.9, 6.1, 0); f.rotation.order = 'YZX'; f.rotation.y = a; f.rotation.z = -.35 - rnd() * .3; f.rotation.x = Math.PI / 2 * (i % 2 ? .15 : -.1); g.add(f); }
  for (let k = 0; k < 4; k++) { const n = new T.Mesh(new T.IcosahedronGeometry(.16, 0), plain('#6a4a22', { flatShading: true })); n.position.set(.9 + Math.cos(k * 1.6) * .22, 5.8, Math.sin(k * 1.6) * .22); g.add(n); } return g; }, { snap: .5 });
reg('hd-bush', 'พุ่มไม้ดอก', o => { const g = new T.Group(), sd = o.seed || 8; crown(g, 0, .55, 0, .7, 'green', sd, 6, .75); crown(g, .7, .45, .3, .55, 'green', sd + 1, 5, .75);
  seed(sd); for (let i = 0; i < 9; i++) { const f = new T.Mesh(new T.BoxGeometry(.09, .09, .09), plain(['#e05a6a', '#f4d04a', '#f2f2f2'][i % 3])); f.position.set((rnd() - .4) * 1.4, .55 + rnd() * .5, (rnd() - .5) * 1.1); g.add(f); } return g; }, { snap: .5 });
reg('hd-grass', 'กอหญ้าและดอกไม้', o => { const g = new T.Group(), sd = o.seed || 10; seed(sd);
  for (let i = 0; i < 9; i++) { const c = grassCanvas(sd + i, 32, 24, i % 3 === 0 ? ['#f4d04a', '#e05a6a', '#f2f2f2', '#9a6ae0'] : null), x0 = (rnd() - .5) * 1.8, z0 = (rnd() - .5) * 1.8;
    for (let k = 0; k < 2; k++) { const m = card(c, .9, .65); m.position.set(x0, .32, z0); m.rotation.y = k * Math.PI / 2 + rnd(); m.castShadow = false; g.add(m); } } return g; }, { snap: .5 });
reg('hd-rock', 'หินริมน้ำมีตะไคร่', o => { const g = new T.Group(), sd = o.seed || 12;
  const sc = (() => { const [c, x] = cv(48, 48); K.seed(sd); K.blocks(x, 48, 48, '#9a968e', { rowH: 9, minW: 12, varW: 10, mortar: .72 }); K.moss(x, 48, 48, 2.5); return c; })();
  [[0, 0, 0, 1, .7], [.9, 0, .4, .6, .55], [-.7, 0, .5, .5, .45]].forEach(([x0, y0, z0, r, sy], i) => { const m = new T.Mesh(new T.DodecahedronGeometry(r, 0), mat(sc, { flatShading: true })); m.scale.set(1.2, sy, 1); m.position.set(x0, r * sy * .7, z0); m.rotation.y = i; m.castShadow = m.receiveShadow = true; g.add(m); });
  for (let k = 0; k < 2; k++) { const m = card(grassCanvas(sd + k, 32, 20), .8, .5); m.position.set(.4 - k * 1.1, .25, .8); m.rotation.y = k; m.castShadow = false; g.add(m); } return g; }, { snap: .5 });
P.hd = (id, o = {}) => { const d = P.HD[id]; if (!d) throw new Error('no HD item ' + id); return d.build(Object.assign({}, d.defaults || {}, o)); };
P.hdNight = (g, on) => g.traverse(o => { if (o.userData.emis) [].concat(o.material).forEach(m => { if (m.emissiveMap) m.emissiveIntensity = on ? o.userData.emis : 0; }); });
P.reg('hd-pixel-set', { group: 'models/buildings', from: 'Paul Engine HD Look Lab (Nov 2026)' });
})();
