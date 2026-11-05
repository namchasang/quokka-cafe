/* light from above inside a blob of foliage: darker underside, brighter sunlit top (cheap fake AO) */
P.shadeY = (g, lo = .65, hi = 1.15) => {
  if (!g.attributes.normal) g.computeVertexNormals();
  const n = g.attributes.normal, c = g.attributes.color; if (!c) return g;
  for (let i = 0; i < n.count; i++) { const k = P.lerp(lo, hi, (n.getY(i) + 1) / 2); c.setXYZ(i, c.getX(i) * k, c.getY(i) * k, c.getZ(i) * k); }
  return g;
};
/* materials (cached) */
const MC = {};
P.mat = (color, o) => { const k = color + JSON.stringify(o || {}); if (MC[k]) return MC[k]; const m = new THREE.MeshStandardMaterial(Object.assign({ roughness: .85 }, o || {})); m.color = P.lin(color); return MC[k] = m; };
P.vmat = o => P.mat('#ffffff', Object.assign({ vertexColors: true }, o || {}));

/* canvas texture helper */
P.ctex = (w, h, draw, repeat) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); }
  t.anisotropy = 4; return t;
};
/* soft grey noise used as a detail map on terrain, bark, rock */
P.detailTex = (() => { let t; return () => t || (t = P.ctex(256, 256, (x, w, h) => {
  const d = x.createImageData(w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const v = 178 + 90 * (0.45 * P.fbm(i / 20, j / 20, 4) + 0.55 * P.noise2(i / 2.2, j / 2.2));
    const k = (j * w + i) * 4; d.data[k] = d.data[k + 1] = d.data[k + 2] = P.clamp(v, 95, 255); d.data[k + 3] = 255;
  }
  x.putImageData(d, 0, 0);
}, 1)); })();

P.shadowAll = (o, cast = true, recv = false) => { o.traverse(m => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = recv; } }); return o; };
})();
/* pxkit: left out on purpose, the game already has PXK (parts 007-008) */
/* ==== PPL HD pixel set: buildings + nature painted at 32 px per metre (3d, pixel skins) ====
   Made for Paul Engine's HD Look Lab (Nov 2026). Same scale as PXKIT and the 32 px people, so they stay sharp up close.
   Needs core/kit.js + models/buildings/pxkit.js. All shop names are fictional.
   PPL.HD               -> { id: {id, name, build(o), defaults, ...} }  (10 items, ids start with "hd-")
   PPL.hd(id, opts)     -> THREE.Group, metres, front faces +z, sits on y=0. opts: c (wall colour), t (sign text), seed
   PPL.hdNight(g, on)   -> turns window glow on/off (emissive maps). Night lamps are Object3Ds with userData.light {col, range}
                           (Paul Engine fills them from its light pool; a game can put its own PointLights there).
   Cut-out leaf/lace/grass cards carry material.userData.mask (white = solid) for pixel outline passes. */
(function(){
'use strict';
const T = THREE, P = window.PPL, K = window.PXK || (typeof PXK !== 'undefined' ? PXK : null);
