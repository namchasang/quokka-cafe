// ---------- HOME4 (Paul Nov 2026): the home screen shows the finished pixel look ----------
// The one-time pixel pass used to run on the first frame of play. Now the home screen runs it: the boat, Lancelin, the trains
// and the Pinnacles are built first (as when the title had played a while), then each step of the pass, one per frame, while
// the 3D stays dark; the title and buttons show at once and the shots fade in when it is done. New game / Continue then re-does
// only what the save changed (pxbCatchUp), so play starts in the same world as before. Mirrored island, Kip at the café door.
var H4={i:0,w:0,busy:true,need:false,caught:false,ready:false};
function h4Busy(){return!!(PXB_ON&&H4.busy&&!running&&!pxbScene.done);}
const H4_BUILD=[()=>{if(H3.b.sea)return;H3.b.sea=1;if(SEA2_ON)sea2Build();},()=>{if(H3.b.lan)return;H3.b.lan=1;if(TRIP_ON)tripEnsure('lan');},
  ()=>{if(H3.b.mtr)return;H3.b.mtr=1;if(MTR.on&&!MTR.built)try{mtrBuild();}catch(e){console.error(e);MTR.on=false;}},()=>{if(H3.b.pin)return;H3.b.pin=1;if(TRIP_ON)tripEnsure('pin');}];
// the big pieces, one per frame, after the title has painted
function h4Step(){if(H4.w<3){H4.w++;return;}if(!H4.t0)H4.t0=performance.now();if(H4.i<H4_BUILD.length){try{H4_BUILD[H4.i]();}catch(e){console.error(e);}H4.i++;}else H4.ready=true;}
// then the whole pass in one go, in the render slot where play used to run it (its steps rely on running back to back)
function h4Pass(){const ox=player.x,oz=player.z,sx=scene.scale.x;player.x=IWx(0,2.9);player.z=IWz(0,2.9);if(sx!==-1){scene.scale.x=-1;scene.updateMatrixWorld(true);}
  try{if(typeof TEX3_ON!=='undefined'&&TEX3_ON&&!tex3Scene.done)safeRun('tex3',tex3Scene);safeRun('pxb',pxbScene);}finally{player.x=ox;player.z=oz;if(scene.scale.x!==sx){scene.scale.x=sx;scene.updateMatrixWorld(true);}
  H4.busy=false;H3.inFade=true;H3.st=0;H4.ms=Math.round(performance.now()-H4.t0);H4.pxbMs=pxbScene.stats&&pxbScene.stats.ms;}}
// New game / Continue: note every mesh's material before the save is applied
function h4Mark(){if(H4.need||H4.caught||!H4.i)return;H4.need=true;H4.eT=performance.now();if(pxbScene.mainT){const E=H4.E=new Map();scene.traverse(o=>{if(o.isMesh)E.set(o,o.material);});}}
function t2Targets(){let T=[];const px=player.x,pz=player.z;for(const zx of[150,300,520,650]){player.x=zx;try{T=T.concat(buildTargets().map(t=>[t.x,t.z]));}catch(e){}}player.x=px;player.z=pz;return T;}
// first frame of play (where the whole pass used to run): the pass again for just the meshes the save added, showed or recoloured
function pxbCatchUp(){H4.need=false;H4.caught=true;const T0=performance.now(),R=pxbScene.orig,E=H4.E;const st=H4.cu={new:0,vis:0,sig:0,mat:0};
  if(TOWN2_ON&&town2Thin.T)try{const key=T=>new Set(T.map(t=>(+t[0]).toFixed(1)+','+(+t[1]).toFixed(1)));const a=key(town2Thin.T),b=key(t2Targets());st.t2=[...a].filter(k=>!b.has(k)).concat([...b].filter(k=>!a.has(k)).map(k=>'+'+k));}catch(e){}
  if(!R||!E||!(pxbScene.mainT<H4.eT)){const gs=k=>scene.children.filter(g=>g.isGroup&&g.visible&&k.seen&&!k.seen.has(g));try{if(pxDeclutter.seen)pxDeclutter(gs(pxDeclutter));}catch(e){console.error(e);}try{if(pxbLaneClear.seen)pxbLaneClear(gs(pxbLaneClear));}catch(e){console.error(e);}st.ms=Math.round(performance.now()-T0);return;}
  const only=new Set();
  scene.traverse(o=>{if(!o.isMesh)return;const r=R.get(o);if(!r){only.add(o);st.new++;return;}if(r.d2)return;const e=E.get(o);
    if(e!==undefined&&o.material!==e){only.add(o);st.mat++;return;}// a save step gave it a new material
    const v=o.visible&&!r.v&&!o.__orph&&!o.__declut&&!o.__t2gone,sg=pxbSig(r.m)!==r.s;
    if(v||sg){if(o.material!==r.m)o.material=r.m;only.add(o);if(v)st.vis++;else st.sig++;}});
  try{pxbScene(only);}catch(e){console.error(e);}pxbScene._k=-1;st.ms=Math.round(performance.now()-T0);}
window.__h3={lan:()=>h3LanPaint(),go:i=>{if(H3&&H3.L){const s=H3.L[i];if(s&&s.trip)tripEnsure(s.trip);if(s&&s.k==='boat'&&SEA2_ON)sea2Build();if(s&&s.k==='stn'&&MTR.on&&!MTR.built)mtrBuild();H3.force=i;}},get H3(){return H3;}};
{const _sg=startGame;startGame=function(){h4Mark();h3End();return _sg.apply(this,arguments);};}
{const _am=ambient;ambient=function(dt,t){if(H3&&H3.act&&overlay!=='title'&&overlay!=='slots')h3End();return _am(dt,t);};}
function pxbTick(){if(!window.__owgo&&running&&!overlay&&typeof openWorld==='function'&&/[?&#]owgo\b/.test(location.search+location.hash)){window.__owgo=1;setTimeout(()=>{const z=zoneOf(player.x);openWorld(z==='island'?'freo':z,'e');},1500);}if(window.FREO_FOUNTAIN&&zoneOf(player.x)==='freo')try{FREO_FOUNTAIN(performance.now()/1000);}catch(e){}if(DET2_ON&&!det2Build.done){det2Build.done=1;try{det2Build();}catch(e){console.error(e);}try{const R=pxbScene.orig;if(R)scene.traverse(o=>{if(o.isMesh&&!R.has(o))R.set(o,{m:o.material,v:o.visible,d2:1});});}catch(e){}}if(DET2_ON&&det2Build.tick)try{det2Build.tick(performance.now()/1000);}catch(e){}pxbDoorsTick();if(SP2_ON&&spBuild_sky.tick)try{spBuild_sky.tick(performance.now()/1000);}catch(e){}if(SEA2_ON&&running)try{sea2Tick(1/60);}catch(e){}if(!pxbScene.glow)return;if(running)pxbSee(1/60);post.uniforms.blurK.value=0;post.uniforms.bloomK.value=Math.min(post.uniforms.bloomK.value,.7);pxPopTick();if(post.uniforms.outl)post.uniforms.outl.value=1;const n=typeof NIGHT==='number'?NIGHT:0,h=(typeof S!=='undefined'?S.time%1440:720)/60,dusk=Math.max(0,Math.min(1,(h-17.6)/1.2)),k=Math.max(n,dusk*.6);
  if(CAFE_PX)CAFE_PX.tick(performance.now()/1000);if(pxbScene._k===k)return;pxbScene._k=k;pxbScene.glow.forEach(m=>m.emissiveIntensity=k*(m.__dim||1.35));PXB_LAMPS.forEach(l=>l.material.color.set(k>.3?'#ffd070':'#e8d8a8'));
}

function tex3Scene(){tex3Scene.done=true;const V3=new THREE.Vector3(),cache=new Map(),vcache=new Map();let walls=0,cars=0;
  const islandAt=o=>{o.getWorldPosition(V3);scene.worldToLocal(V3);try{return zoneOf(V3.x)==='island';}catch(e){return false;}};
  // vehicles: a group with three or more wheels; its biggest box is the body, dark boxes are glass
  const groups=new Set();scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CylinderGeometry'&&o.parent&&o.parent!==scene){const p=o.parent;p.__wheels=(p.__wheels||0)+1;if(p.__wheels>=3)groups.add(p);}});
  const paint=(col,kind)=>{const key=col+kind;if(vcache.has(key))return vcache.get(key);const c=mk(32,16),x=c.getContext('2d');const B=T3.hex(col);const sh=k=>`rgb(${B.map(v=>Math.max(0,Math.min(255,Math.round(v*k)))).join(',')})`;
    if(kind==='glass'){x.fillStyle=sh(1);x.fillRect(0,0,32,16);x.fillStyle='rgba(190,220,250,.45)';for(let i=0;i<3;i++){x.beginPath();x.moveTo(4+i*11,0);x.lineTo(8+i*11,0);x.lineTo(2+i*11,16);x.lineTo(-2+i*11,16);x.fill();}x.fillStyle='rgba(255,255,255,.25)';x.fillRect(0,0,32,1);}
    else{for(let y=0;y<16;y++){const k=y<2?1.16:y<5?1.06:y>12?.82:1;x.fillStyle=sh(k);x.fillRect(0,y,32,1);}
      x.fillStyle=sh(.7);x.fillRect(11,3,1,10);x.fillRect(21,3,1,10);x.fillRect(0,9,32,1);x.fillStyle=sh(1.25);x.fillRect(0,2,32,1);
      x.fillStyle='#d8d8d4';x.fillRect(14,7,2,1);x.fillRect(24,7,2,1);
      for(let y=11;y<16;y++)for(let xx=0;xx<32;xx++)if(l2hash(xx,y,91)<(y-10)*.12){x.fillStyle=l2hash(xx,y,92)<.5?'rgba(150,92,56,.55)':'rgba(120,80,52,.5)';x.fillRect(xx,y,1,1);}}
    const t=ctex(c);const m=new THREE.MeshLambertMaterial({map:t});vcache.set(key,m);return m;};
  groups.forEach(g=>{if(!islandAt(g))return;let body=null,bv=0;g.children.forEach(o=>{if(!o.isMesh||!o.geometry||o.geometry.type!=='BoxGeometry'||!o.material||o.material.map)return;const p=o.geometry.parameters,v=p.width*p.height*p.depth;
      const col='#'+o.material.color.getHexString(),l=o.material.color.r+o.material.color.g+o.material.color.b;
      if(l<.5&&p.height<.6){o.material=paint(col,'glass');return;}if(v>bv){bv=v;body=o;}});
    if(body){body.material=paint('#'+body.material.color.getHexString(),'body');cars++;}});
  // walls: darker at the foot, lighter up high, like light bouncing off the ground (soft contact shade)
  scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.geometry||o.geometry.type!=='BoxGeometry'||!o.material||Array.isArray(o.material))return;const p=o.geometry.parameters;if(p.height<1.1||p.width<.6&&p.depth<.6)return;
    if(o.parent&&o.parent.__wheels>=3)return;if(!islandAt(o))return;const m=o.material;if(m.vertexColors||!(m.isMeshLambertMaterial||m.isMeshStandardMaterial))return;
    let mc=cache.get(m);if(!mc){mc=m.clone();mc.vertexColors=true;cache.set(m,mc);}
    const g=o.geometry.clone(),pos=g.attributes.position,col=new Float32Array(pos.count*3),h=p.height;
    for(let i=0;i<pos.count;i++){const y=pos.getY(i)+h/2;const k=.7+.3*Math.min(1,y/Math.min(1.4,h*.55));col[i*3]=k;col[i*3+1]=k*.99;col[i*3+2]=k*.97;}
    g.setAttribute('color',new THREE.BufferAttribute(col,3));o.geometry=g;o.material=mc;walls++;});
  tex3Scene.stats={walls,cars};}

