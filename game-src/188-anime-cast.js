// ---------- The anime 3D cast in the game (Paul, 28 Nov 2026: 'ตัวละคร 3D ขึ้นเกมได้ น่ารักดี ค่อยปรับ') ----------
// The Anime Character Engine models (lib/engines/characters/anime.js, embedded as part 188-engine-anime.js; lab anime-lab.html)
// replace the toon models of the cast the game has today: Kip (the player), Captain Gus (a pelican, as Paul chose: the cast stays
// animals), and Mum and Dad once they work at the café (the two family staff). Each model follows its toon entry (same spot, turn
// and walk speed from part 188-toon-characters); the toon model and the pixel sprite stay in the scene unseen, so clicks, story code
// and riders keep working. Faces tilt up a little for the high camera. Rottnest only, like the toon look. ?noanime = old toon cast.
var ANIME_LIVE=true;var ANIME_FOLK_LIVE=true;/* island folk too (29 Nov 2026); ?noanimefolk = toon folk */
const ANIME={on:ANIME_LIVE&&!/[?&#]noanime\b/.test(location.search+location.hash),list:[]};
window.__ANIME=ANIME;
if(ANIME.on)(()=>{
  const want=()=>{const L=[];try{L.push(['kip',player.mesh,1.15]);}catch(e){}try{L.push(['gus',gus.mesh,1.58]);}catch(e){}
    try{staff.forEach((st,i)=>{if(st.fam&&i<2)L.push([i?'dad':'mum',st.m,1.25]);});}catch(e){}return L;};
  function make(id,src,h,spec){const sp=spec||ANIME_CHARS.CAST[id];if(!sp)return null;const C=ANIME_CHARS.create(sp,{gammaOut:true});
    C.root.traverse(o=>{o.__pxSkip=1;o.__islKeep=1;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});C.root.__islKeep=1;C.root.__animeCast=1;
    const k=h*.95/(sp.h||1.6);C.root.scale.setScalar(k);scene.add(C.root);return{id,src,C,k};}
  /* island folk (Paul, 29 Nov 2026: 'เปลี่ยน npc บนเกาะให้เป็น animation character แบบใหม่'): every person and working quokka on Rottnest
     near Kip becomes an anime animal. The animal and its fur come from the NPC's own colours (same NPC, same animal every time), the
     clothes keep the sprite's shirt, trousers and hat colours. Wild quokkas stay as they are. Only the nearest ones get a model
     (8 / 12 / 16 by Graphics level, within 26 units); the rest stay toon until Kip comes closer, so phones stay smooth. */
  const BASES=['bob','remy','mina','hoot','skye','nonna','mum','dad','bob','remy'],/* no pelicans: Captain Gus stays the only one */FUR={bob:['#9a9ca2','#a8a29a','#8a8c94'],remy:['#7a7a80','#8a8078','#6a6a70'],mum:['#927862','#8a7058','#a08468'],dad:['#7a6450','#8a7058','#6e5a48']};
  const hsh=t=>{let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h;};
  const infoOf=o=>{const F=o.userData&&o.userData.frames;const c=F&&F[0]&&F[0].c;return c&&c.__toon;};
  const specCache=new Map();
  function folkSpec(t){const key=JSON.stringify(t);if(specCache.has(key))return specCache.get(key);const h=hsh(key);let base;
    if(t.k==='quokka')base=h%2?'mum':'dad';else base=BASES[h%BASES.length];
    const sp=JSON.parse(JSON.stringify(ANIME_CHARS.CAST[base]));sp.name='folk';const v=t.v||{};
    if(FUR[base])sp.fur=FUR[base][(h>>4)%FUR[base].length];
    sp.cloth=sp.cloth||{};sp.acc=sp.acc||{};
    if(t.k==='quokka'){const c=typeof t.apron==='string'?t.apron:'#c8344a';sp.cloth.shirt=c;sp.acc.scarf=c;sp.cloth.apron=c;}
    else{if(v.shirt){sp.cloth.shirt=v.shirt;if(sp.acc.vest)sp.acc.vest=v.shirt;if(sp.acc.shirt)sp.acc.shirt=v.shirt;if(sp.acc.scarf)sp.acc.scarf=v.shirt;}if(v.pants)sp.cloth.pants=v.pants;
      if(v.hat){sp.hat=sp.hat||{k:'sun'};sp.hat.c=v.hat;}else if((h>>6)%3===0)delete sp.hat;}
    if(sp.hat&&sp.hat.k==='captain')sp.hat.k='sun';
    sp.h=t.k==='quokka'?1.4:1.5;specCache.set(key,sp);return sp;}
  const fixedSrc=()=>{const S=new Set();try{S.add(player.mesh);S.add(gus.mesh);staff.forEach((st,i)=>{if(st.fam&&i<2)S.add(st.m);});}catch(e){}return S;};
  ANIME.folkSpec=folkSpec;ANIME.make=make;let folkT=0;const FOLK=new Map();ANIME.folk=FOLK;/* src -> anime entry */
  function folkPick(){const gq=String((typeof GFX!=='undefined'&&GFX.level)||'').toLowerCase(),N=gq.startsWith('l')?8:gq.startsWith('m')?12:16,R2=26*26;
    const fx=fixedSrc(),C=[];for(const e of TOON.list){const s=e.src;if(!e.on||!s.parent||!s.visible||fx.has(s)||s===player.mesh)continue;/* hidden pooled customers are not folk */const t=infoOf(s);if(!t)continue;if(t.k==='quokka'&&!t.apron)continue;/* wild quokkas stay */
      const dx=s.position.x-player.x,dz=s.position.z-player.z,d=dx*dx+dz*dz;if(d<R2)C.push([d,e,t]);}
    C.sort((a,b)=>a[0]-b[0]);const keep=new Set(C.slice(0,N).map(c=>c[1].src));
    for(const [src,a] of FOLK)if(!keep.has(src)){scene.remove(a.C.root);a.C.root.parent&&a.C.root.parent.remove(a.C.root);try{a.src.__toon.g.children.forEach(c=>c.visible=true);}catch(e){}FOLK.delete(src);}
    let made=0;for(const [d,e,t] of C.slice(0,N))if(!FOLK.has(e.src)&&made<2){made++;/* two new models per half second: no hitch when a crowd walks in */const gp=e.src.geometry&&e.src.geometry.parameters;const h=gp?gp.height*Math.abs(e.src.scale.y):1.5;
      const a=make('folk',e.src,h,folkSpec(t));if(a){a.folk=1;FOLK.set(e.src,a);}}}
  let last=performance.now();
  (function tick(){requestAnimationFrame(tick);if(typeof ANIME_CHARS==='undefined'||typeof TOON==='undefined')return;const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
    /* who should have a model now (Mum and Dad only after the ferry tickets) */
    const W=want();ANIME.list=ANIME.list.filter(a=>{if(W.some(w=>w[1]===a.src))return true;scene.remove(a.C.root);return false;});
    W.forEach(([id,src,h])=>{if(src&&!ANIME.list.some(a=>a.src===src)){const a=make(id,src,h);if(a)ANIME.list.push(a);}});
    if(ANIME_FOLK_LIVE&&zoneOf(player.x)==='island'&&!/[?&#]noanimefolk\b/.test(location.search+location.hash)){folkT-=dt;if(folkT<=0){folkT=.5;try{folkPick();}catch(x){console.warn('anime folk',x);}}}
    for(const a of ANIME.list.concat([...FOLK.values()])){const e=a.src.__toon;const R=a.C.root;if(!e){R.visible=false;continue;}
      /* hide the toon model under it (it is rebuilt when the sprite's frames change, so every frame) */
      e.g.children.forEach(c=>{if(c.visible)c.visible=false;});
      const show=e.on&&e.g.visible&&!!e.g.parent;R.visible=show;if(!show)continue;if(R.parent!==e.g.parent)e.g.parent.add(R);
      R.position.set(a.src.position.x,a.src.position.y,a.src.position.z);R.rotation.y=e.yaw;
      try{a.C.update(dt,e.amp>.05?(e.amp>.9&&a.id==='kip'&&player.ride?2:1)*Math.min(1,e.amp):0);}catch(x){}
      if(a.C.head)a.C.head.rotation.x-=.38;/* the game camera looks down from high up: tilt the face up so it reads */}})();
  console.log('ANIME cast on');
})();
