// ---------- The anime 3D cast in the game (Paul, 28 Nov 2026: 'ตัวละคร 3D ขึ้นเกมได้ น่ารักดี ค่อยปรับ') ----------
// The Anime Character Engine models (lib/engines/characters/anime.js, embedded as part 188-engine-anime.js; lab anime-lab.html)
// replace the toon models of the cast the game has today: Kip (the player), Captain Gus (a pelican, as Paul chose: the cast stays
// animals), and Mum and Dad once they work at the café (the two family staff). Each model follows its toon entry (same spot, turn
// and walk speed from part 188-toon-characters); the toon model and the pixel sprite stay in the scene unseen, so clicks, story code
// and riders keep working. Faces tilt up a little for the high camera. Rottnest only, like the toon look. ?noanime = old toon cast.
var ANIME_LIVE=true;
const ANIME={on:ANIME_LIVE&&!/[?&#]noanime\b/.test(location.search+location.hash),list:[]};
window.__ANIME=ANIME;
if(ANIME.on)(()=>{
  const want=()=>{const L=[];try{L.push(['kip',player.mesh,1.15]);}catch(e){}try{L.push(['gus',gus.mesh,1.58]);}catch(e){}
    try{staff.forEach((st,i)=>{if(st.fam&&i<2)L.push([i?'dad':'mum',st.m,1.25]);});}catch(e){}return L;};
  function make(id,src,h){const sp=ANIME_CHARS.CAST[id];if(!sp)return null;const C=ANIME_CHARS.create(sp,{gammaOut:true});
    C.root.traverse(o=>{o.__pxSkip=1;o.__islKeep=1;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});C.root.__islKeep=1;C.root.__animeCast=1;
    const k=h*.95/(sp.h||1.6);C.root.scale.setScalar(k);scene.add(C.root);return{id,src,C,k};}
  let last=performance.now();
  (function tick(){requestAnimationFrame(tick);if(typeof ANIME_CHARS==='undefined'||typeof TOON==='undefined')return;const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
    /* who should have a model now (Mum and Dad only after the ferry tickets) */
    const W=want();ANIME.list=ANIME.list.filter(a=>{if(W.some(w=>w[1]===a.src))return true;scene.remove(a.C.root);return false;});
    W.forEach(([id,src,h])=>{if(src&&!ANIME.list.some(a=>a.src===src)){const a=make(id,src,h);if(a)ANIME.list.push(a);}});
    for(const a of ANIME.list){const e=a.src.__toon;const R=a.C.root;if(!e){R.visible=false;continue;}
      /* hide the toon model under it (it is rebuilt when the sprite's frames change, so every frame) */
      e.g.children.forEach(c=>{if(c.visible)c.visible=false;});
      const show=e.on&&e.g.visible&&!!e.g.parent;R.visible=show;if(!show)continue;if(R.parent!==e.g.parent)e.g.parent.add(R);
      R.position.set(a.src.position.x,a.src.position.y,a.src.position.z);R.rotation.y=e.yaw;
      try{a.C.update(dt,e.amp>.05?(e.amp>.9&&a.id==='kip'&&player.ride?2:1)*Math.min(1,e.amp):0);}catch(x){}
      if(a.C.head)a.C.head.rotation.x-=.38;/* the game camera looks down from high up: tilt the face up so it reads */}})();
  console.log('ANIME cast on');
})();
