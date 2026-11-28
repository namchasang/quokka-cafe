// ---------- Faster Rottnest (Look Lab ?fast, Paul 28 Nov 2026: 'ทำเลย') ----------
// Paul (24 Nov 2026): the camp map is smooth but Rottnest is slow and jerky. Measured: Rottnest draws the whole scene twice a
// frame (~2,560 draw calls) while the camp draws it once (~510). The Water Sea Engine's first pass renders everything
// (trees, buildings, people, and the shadow map again) only to see the ground under the water. This lab keeps the look:
// 1. the water's first pass draws only what can be under water: the engine ground (im_terr), the seabed (sea4bed) and the
//    fish (im_wl), and it reuses this frame's shadow map instead of drawing it a second time;
// 2. small things (tufts, flowers, bins, cups, signs...) stop casting shadows; buildings, trees and characters keep theirs.
// Same for every Water Sea instance (Rottnest, Fremantle, South Perth). Off for players: ?fast turns it on, ?nofast forces it off.
var FAST_LIVE=false;
const FAST={on:(FAST_LIVE||/[?&#]fast\b/.test(location.search+location.hash))&&!/[?&#]nofast\b/.test(location.search+location.hash),L:26,tagged:0,noShadow:0};
window.__FAST=FAST;
if(FAST.on)(()=>{
  const L=FAST.L,WET=/^(im_terr|im_wl|sea4bed2?|terrainEngine)/;
  /* 1. the water's first pass: only layer L */
  (function hook(){if(typeof WaterSea==='undefined'||!WaterSea.create){setTimeout(hook,200);return;}
    const _c=WaterSea.create;WaterSea.create=function(o){const s=_c.apply(this,arguments);const p=s.pre;
      s.pre=function(t){const cam=(o&&o.camera)||camera,m=cam.layers.mask,au=renderer.shadowMap.autoUpdate;cam.layers.set(L);renderer.shadowMap.autoUpdate=false;
        try{return p.apply(this,arguments);}finally{cam.layers.mask=m;renderer.shadowMap.autoUpdate=au;}};return s;};})();
  /* lights pass the same layer test as meshes (three r128), so every light joins layer L too or the first pass is unlit */
  function tagWet(){let n=0;scene.traverse(o=>{if(o.isLight&&!o.__fastWet){o.__fastWet=1;o.layers.enable(L);return;}if(o.__fastWet||!o.name||!WET.test(o.name))return;o.traverse(c=>{if(!c.__fastWet){c.__fastWet=1;c.layers.enable(L);n++;}});});FAST.tagged+=n;}
  /* 2. small things cast no shadow (characters, trees and buildings keep theirs) */
  const sp=new THREE.Sphere(),V=new THREE.Vector3();
  function trimShadows(){let n=0;scene.traverse(o=>{if(!o.isMesh||!o.castShadow||o.__fastSh)return;o.__fastSh=1;
      for(let p=o;p;p=p.parent){if(p.__toon||p.__c3h||p.__m3||(p.userData&&p.userData.frames))return;}
      const g=o.geometry;if(!g)return;if(!g.boundingSphere)g.computeBoundingSphere();if(!g.boundingSphere)return;o.getWorldScale(V);
      let r=g.boundingSphere.radius*Math.max(Math.abs(V.x),Math.abs(V.y),Math.abs(V.z));
      if(o.isInstancedMesh){/* foliage: the base shape is one plant; tufts, flowers and small bushes are under ~0.6 */if(r<.6){o.castShadow=false;n++;}return;}
      if(r<.45){o.castShadow=false;n++;}});FAST.noShadow+=n;}
  (function loop(){try{tagWet();trimShadows();}catch(e){console.warn('fast',e);}setTimeout(loop,2000);})();
  console.log('FAST lab on: water first pass on layer '+L+', small shadows off');
})();
