/* render mode: default sRGB output + MeshStandard (Paul Engine). Games with gamma-off renderers and Lambert lighting (Quokka Cafe)
   call PPL.hdMode({ srgb: false, lambert: true }) before building. */
const MODE = { srgb: true, lambert: false };
P.hdMode = o => Object.assign(MODE, o || {});
const Mat = o => MODE.lambert ? new T.MeshLambertMaterial(o) : new T.MeshStandardMaterial(Object.assign({ roughness: .92 }, o));
const colr = c => MODE.srgb ? P.lin(c) : new T.Color(c);
if (!K) { console.warn('pe-hd needs lib/models/buildings/pxkit.js'); return; }
const PPM = 32, INK = '#2a2230';
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(2, Math.round(w)); c.height = Math.max(2, Math.round(h)); const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; };
const px = (x, c, X, Y, W = 1, H = 1) => { x.fillStyle = c; x.fillRect(X | 0, Y | 0, W | 0, H | 0); };
let S = 1; const rnd = () => (S = (S * 16807) % 2147483647) / 2147483647, seed = s => { S = (s | 0) % 2147483646 + 1; };
const sh = K.sh, mix = K.mix;
/* nearest when close (crisp texels), mipmapped when far (no sparkle when a 32 px/m wall is seen small) */
const tex = c => { const t = new T.CanvasTexture(c); t.magFilter = T.NearestFilter; t.minFilter = T.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 4; t.encoding = MODE.srgb ? T.sRGBEncoding : T.LinearEncoding; return t; };
const MAT = new Map();
const mat = (c, o = {}) => Mat(Object.assign({ map: tex(c) }, o));
/* a material whose glass lights up at night: day canvas + lit canvas -> emissive map of the difference */
const glowMat = (day, lit) => { const m = mat(day); m.emissive = new T.Color(1, 1, 1); m.emissiveMap = tex(K.glowDiff(day, lit)); m.emissiveIntensity = 0; return m; };
const PLAIN = new Map();
const plain = (c, o) => { const k = c + (o ? JSON.stringify(o) : '') + MODE.srgb + MODE.lambert; if (!PLAIN.has(k)) PLAIN.set(k, Mat(Object.assign({ color: colr(c) }, o || {}))); return PLAIN.get(k); };
const vpaint = (g, cols, j, sd) => { g = P.paint(g, cols, j, sd); if (!MODE.srgb) { const a = g.attributes.color.array; for (let i = 0; i < a.length; i++) a[i] = Math.pow(a[i], 1 / 2.2); } return g; };
/* box with one canvas (or colour) per face: order +x -x +y -y +z -z */
function box(g, w, h, d, faces, x, y, z, glowFaces) {
  const ms = faces.map((f, i) => !f ? plain('#888888') : typeof f === 'string' ? plain(f) : f.isMaterial ? f : mat(f));
  const m = new T.Mesh(new T.BoxGeometry(w, h, d), ms); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true;
  if (glowFaces) m.userData.emis = 1; g.add(m); return m;
}
/* gable roof, ridge along x: two textured slopes + plain gable ends */
function gable(g, w, d, h, roofCanvas, endColor, y, over = .35) {
  const L = Math.hypot(d / 2 + over, h), a = Math.atan2(h, d / 2 + over), m = mat(roofCanvas), m2 = mat(roofCanvas);
  [[1, m], [-1, m2]].forEach(([s, mm]) => { const p = new T.Mesh(new T.PlaneGeometry(w + over * 2, L), mm); p.material.side = T.DoubleSide; p.rotation.order = 'YXZ'; p.rotation.x = -Math.PI / 2 + s * a; if (s < 0) p.rotation.y = Math.PI; p.position.set(0, y + h / 2, s * (d / 2 + over) / 2); p.castShadow = p.receiveShadow = true; g.add(p); });
  const sh2 = new T.Shape(); sh2.moveTo(-d / 2, 0); sh2.lineTo(d / 2, 0); sh2.lineTo(0, h); sh2.lineTo(-d / 2, 0);
  [-1, 1].forEach(s => { const e = new T.Mesh(new T.ShapeGeometry(sh2), plain(endColor)); e.rotation.y = Math.PI / 2; e.position.set(s * w / 2, y, 0); e.material.side = T.DoubleSide; e.castShadow = true; g.add(e); });
}
/* ---------- new painters ---------- */
function stripes(w, h, a, b, n = 8) { const [c, x] = cv(w * PPM, h * PPM); const sw = c.width / n; for (let i = 0; i < n; i++) { px(x, i % 2 ? a : b, i * sw, 0, sw + 1, c.height); px(x, sh(i % 2 ? a : b, 1.15), i * sw, 0, 1, c.height); } for (let X = 0; X < c.width; X += 2) px(x, sh(a, .6), X, c.height - 2, 1, 2); px(x, INK, 0, c.height - 1, c.width, 1); return c; }
function valance(w, a, b) { const [c, x] = cv(w * PPM, 10); const sw = c.width / (w * 3); for (let i = 0; i * sw < c.width; i++) { const col = i % 2 ? a : b; px(x, col, i * sw, 0, sw, 7); for (let k = 0; k < sw; k++) { const yy = 7 + Math.round(Math.sin(k / sw * Math.PI) * 3); px(x, col, i * sw + k, 7, 1, yy - 7); } } px(x, INK, 0, 0, c.width, 1); return c; }
function shutter(w, h, open = .55, base = '#9aa0aa', lit = false) {
  const [c, x] = cv(w * PPM, h * PPM), H = c.height, W = c.width, top = Math.round(H * (1 - open));
  for (let y = 0; y < top; y += 3) { px(x, sh(base, .95 + ((y / 3) % 2) * .08), 0, y, W, 3); px(x, sh(base, 1.15), 0, y, W, 1); px(x, sh(base, .7), 0, y + 2, W, 1); }
  px(x, sh(base, .55), 0, top, W, 3); px(x, '#c9a35a', W / 2 - 3, top + 1, 6, 1);
  const shop = K.glass(W, H - top - 3, { lit, tint: '#8a7a68', seed: 5 }); x.drawImage(shop, 0, top + 3);
  px(x, INK, 0, 0, 2, H); px(x, INK, W - 2, 0, 2, H); return c;
}
function grilleWindow(x, X, Y, w, h, lit) {
  K.win(x, X, Y, w, h, { lit, box: false, sash: false, frame: '#e9e2d0' });
  const g = '#3a3f4a'; for (let k = -h; k < w; k += 6) for (let j = 0; j < h; j++) { const a = X + k + j, b = X + k + h - j; if (a >= X && a < X + w && (j % 2 === 0)) px(x, g, a, Y + j); if (b >= X && b < X + w && (j % 2 === 0)) px(x, g, b, Y + j); }
  px(x, g, X, Y, w, 1); px(x, g, X, Y + h - 1, w, 1); px(x, g, X, Y, 1, h); px(x, g, X + w - 1, Y, 1, h);
}
function shophouseFloor(w, h, base, lit, sd) {
  seed(sd); const [c, x] = cv(w * PPM, h * PPM), W = c.width, H = c.height; K.seed(sd); K.plaster(x, W, H, base);
  for (let i = 0; i < 6; i++) { const X = rnd() * W | 0; for (let y = 0; y < H * (.3 + rnd() * .5); y++) if (rnd() < .7) px(x, sh(base, .82), X + (rnd() < .2 ? 1 : 0), y); }
  const ww = Math.min(W - 24, 70), wh = Math.min(H - 34, 50); grilleWindow(x, (W - ww) / 2, 18, ww, wh, lit);
  px(x, sh(base, 1.1), 0, H - 6, W, 2); px(x, sh(base, .6), 0, H - 4, W, 1); return c;
}
function lace(w) { const [c, x] = cv(w * PPM, 14); for (let X = 0; X < c.width; X++) { px(x, '#e8e4dc', X, 0); px(x, '#e8e4dc', X, 13); const k = X % 12; if (k === 0 || k === 6) px(x, '#e8e4dc', X, 1, 1, 12); const r = Math.abs(6 - k); px(x, '#e8e4dc', X, 2 + r, 1, 1); px(x, '#e8e4dc', X, 11 - r, 1, 1); if (k === 3 || k === 9) px(x, '#e8e4dc', X, 6, 1, 2); } return c; }
function maskOf(c) { const [m, x] = cv(c.width, c.height); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height), o = x.createImageData(c.width, c.height); for (let i = 0; i < d.data.length; i += 4) { const v = d.data[i + 3] > 127 ? 255 : 0; o.data[i] = o.data[i + 1] = o.data[i + 2] = v; o.data[i + 3] = 255; } x.putImageData(o, 0, 0); const t = new T.CanvasTexture(m); t.magFilter = t.minFilter = T.NearestFilter; t.generateMipmaps = false; return t; }
