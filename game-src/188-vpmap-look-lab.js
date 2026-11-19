// ---------- Victoria Park built with every engine (Look Lab ?vpmap, nightly 20 Nov 2026, brief quokka-master-maps-20261119) ----------
// Paul (19 Nov 2026): 'ของ master account ให้เพิ่ม map อื่นใน island builder ให้แก้ได้'. Victoria Park is the second town after
// Fremantle (South Perth, Heirisson and the CBD come later; South Perth and the CBD are protected areas, so they wait for Paul).
// The town is written as an Island Builder map in code from the game's own Victoria Park (part 029 Albany Highway shops, the night
// market, the station and the railway, part 097 Teddington Rd and Riverside Motors) and built with the engines through IslandMap:
// Terrain, Road, Building Kit, Props, Foliage, Vehicle (cars drive, the train runs), Life (folk on the footpaths) and the Sky Engine.
// No sea here, so no Water Sea instance. Map units = game units (K=1, not mirrored). The old Victoria Park scenery is hidden while the
// lab is on (never deleted). The Game Master edits it in lib/engines/editor/vp-master.html (key ppl-mapedit-vp-master-v<ver>).
// Off for everyone: ?vpmap turns it on (Paul decides later if Game Master accounts get it by default, as with Fremantle).
var VPMAP_LIVE=false;
const VPMAP={on:(VPMAP_LIVE||/[?&#]vpmap\b/.test(location.search+location.hash))&&typeof IslandMap!=='undefined',done:false,CX:525,CZ:8,WL:-.1,hidden:[]};
if(VPMAP.on)(()=>{
  const CX=VPMAP.CX,CZ=VPMAP.CZ,N=121,WL=VPMAP.WL;
  const inVP=(x,z)=>x>470&&x<590&&z>-40&&z<60;
  // ---- the map, written in game coordinates ----
  const doc={v:1,ver:1,town:'vp',name:'Victoria Park',sea:0,h:[],paths:[],roads:[],props:[],bld:[],trees:[],culs:[],biz:[],veh:[],rail:[],
    fol:{tuft:.5,flower:.25,bush:.02,tree:.002},
    life:{walker:44,jogger:4,cyclist:6,gull:3,pelican:0,dolphin:0,boat:0,kayak:0,sitter:10,picnic:3,dogfetch:2,fisher:0,flock:3,butterfly:3,swimmer:0,sunbather:0}};
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=CX+(i-60)*2,z=CZ+(j-60)*2;doc.h.push(+(.35+Math.max(0,z-30)*.004).toFixed(2));}/* flat suburb, a gentle rise to the south */
  const M=(x,z)=>[+(x-CX).toFixed(2),+(z-CZ).toFixed(2)];
  const road=(pts,type)=>doc.roads.push({pts:pts.map(p=>M(p[0],p[1])),type:type||'street'});
  const path=(pts,w,kind)=>doc.paths.push({pts:pts.map(p=>M(p[0],p[1])),w:w||1.6,kind:kind||'path'});
  // streets: Albany Highway, Teddington Rd, two side streets and a homes street to the south, every road joined up
  road([[468,.6],[486,.6],[525,.6],[564,.6],[582,.6]]);road([[468,12.6],[486,12.6],[564,12.6],[582,12.6]]);
  road([[486,.6],[486,12.6],[486,34]]);road([[564,.6],[564,12.6],[564,34]]);road([[468,34],[486,34],[564,34],[582,34]]);
  // the night market square, the dealer lot (red brick pavers), the station platform, park paths
  path([[498,6.6],[552,6.6]],7);path([[498,20.6],[552,20.6]],9.6);path([[537,-9.2],[556,-9.2]],1.6);
  path([[491,4.2],[497,10]],1.2,'gravel');path([[553,10],[559,4.2]],1.2,'gravel');
  // buildings (Building Kit); o = extra kit options. r=0 faces +z (towards Albany Highway for the shop row)
  const B=(s,x,z,r,o,sign)=>{const m=M(x,z);doc.bld.push({s,x:m[0],z:m[1],r:r||0,sign,o});};
  /* the twelve Albany Highway shops of the game (VP_SHOPS: same places, colours and names; the pub and Homebox two storeys) */
  const SHOPS=[['shop','PHO-NOMENAL NOODLES','#c8344a','#f6e8d0'],['shop','KIMCHI QUOKKA GRILL','#1d3a6e','#e8e2d4'],['shop','LANTERN ALLEY RAMEN','#2a2a30','#f2e6c8'],
    ['shop','BUBBLE BURROW TEA','#e8a33a','#fff3d6'],['shop','MOON RABBIT DUMPLINGS','#b8241e','#f6e2c0'],['shop','SIAM SMILE KITCHEN','#7a1f2a','#f2e6c8'],
    ['shop','PANDAN & SPICE','#3e7d5c','#efe3c4'],['mallshop','LOTUS PANTRY MART','#c8344a','#f6f2e8'],['pub','THE WATTLE & SWAN HOTEL','#2c3b38','#e2d2a8'],
    ['bigbox','HOMEBOX','#d8343a','#f6f6f0'],['shop','MOONBEAM COFFEE','#5a3a22','#f2ede4'],['shop','COSY CHAI HOUSE','#e8732a','#fbe9cf']];
  SHOPS.forEach(([s,n,c,w],i)=>B(s,493+i*5.6,-4,0,{w:5.2,d:3.4,floors:(s==='pub'||s==='bigbox')?2:1,wall:w,awning:c},n));
  B('strip',558.6,-7.6,0,{w:5.4,d:2.4,floors:1,wall:'#dfe6ec',awning:'#1d3a6e'},'VICTORIA PARK STATION');
  B('bigbox',507,18.4,0,{w:14,d:4.4,floors:1,wall:'#f2f2ee',awning:'#1e3f8a'},'RIVERSIDE MOTORS');B('slab',557.3,21.4,Math.PI/2,{w:2.6,d:8.6,floors:1,wall:'#e8e8e0'});
  B('kiosk',491,4.6,0,{w:5,d:1.2,wall:'#f2e6c8',awning:'#e8457a'},'VIC PARK');/* the street mural wall */
  /* the night market stalls of the game (NM: satay, takoyaki, mango sticky rice, bao, roti) as kiosks facing the square */
  [['SATAY','#c8344a'],['TAKOYAKI','#2a2a30'],['MANGO STICKY RICE','#e8a33a'],['BAO','#f6f2e8'],['ROTI','#3e7d5c']].forEach(([n,c],i)=>B('kiosk',503+i*9.5,5.6,0,{w:3,d:1.4,wall:'#f6efe0',awning:c},n));
  // homes: weatherboard houses and brick bungalows along the homes street (Kip grew up in a little home in Victoria Park)
  const HS=['house','bungalow','cottage','house','terrace','bungalow'],HW=['#f3eee0','#e8d8b0','#b8d4d8','#e8b8b0','#f6f2e8','#d8c8a8'];let hk=0;
  [[34,-1],[34,1]].forEach(([zs,side])=>{for(let x=471;x<=580;x+=7.4){if([486,564].some(c=>Math.abs(x-c)<4.8))continue;if(side<0&&x>495&&x<556)continue;/* the dealer lot runs to z 25 */
    B(HS[hk%HS.length],x,zs+side*5.8,side<0?0:Math.PI,{wall:HW[hk%HW.length]});hk++;}});
  for(let z=19;z<=29;z+=7.4){B(HS[hk%HS.length],480.2,z,Math.PI/2,{wall:HW[hk++%HW.length]});B(HS[hk%HS.length],569.8,z,-Math.PI/2,{wall:HW[hk++%HW.length]});}
  // props: street lamps, benches and bins, the bus stop, café tables in the night market
  const P=(k,x,z,r,o)=>{const m=M(x,z);doc.props.push(Object.assign({k,x:m[0],z:m[1],r:r||0},o||{}));};
  for(let x=491;x<=559;x+=8){P('lamp',x,-2);P('lamp',x+4,3.2);}for(let x=494;x<=558;x+=8)P('lamp',x,10.3);
  P('busstop',492,3.3,Math.PI);[[500,9.6],[512,9.6],[538,9.6],[550,9.6]].forEach(([x,z])=>P('bench',x,z,Math.PI));[[506,4],[530,4],[546,4]].forEach(([x,z])=>P('bin',x,z));
  for(let i=0;i<5;i++)P('cafeset',507.8+i*9.5,8.6);P('bikerack',540,-1.8,0);P('playground',556,7.6,0);
  // trees: the four park trees of the game, palms along the dealer lot, gums and peppers in the side streets
  const T=(k,x,z,s)=>{const m=M(x,z);doc.trees.push({k,x:m[0],z:m[1],s:(s||1)*.55});};
  [[489.5,8.4],[495.5,9.6],[553,9.2],[559,8.4]].forEach(([x,z])=>T('pepper',x,z,1));[[515.6,16],[524,16],[536,16],[548,16],[553,23]].forEach(([x,z])=>T('datepalm',x,z));
  for(let z=18;z<=30;z+=6){T('gum',483,z,1.1);T('gum',567,z,1.1);}for(let x=474;x<=578;x+=14)T('pepper',x,36.8,.9);
  // vehicles: cars drive Albany Highway and Teddington Rd, the bus, food trucks in the night market, stock cars on the dealer lot
  const V=(k,x,z,r,go)=>{const m=M(x,z);doc.veh.push({k,x:m[0],z:m[1],r:r||0,go:!!go});};
  V('sedan',500,.6,0,1);V('hatch',530,.6,Math.PI,1);V('taxi',548,.6,0,1);V('citybus',515,.6,Math.PI,1);V('ute',540,12.6,0,1);V('van',496,12.6,Math.PI,1);V('suv',486,24,Math.PI/2,1);
  for(let i=0;i<6;i++)V(['sedan','hatch','suv','ute','taxi','pipmini'][i],519.5+i*5.4,19.8,Math.PI,0);
  for(let x=518;x<551;x+=3.4)V(['hatch','sedan','ute','suv'][Math.round(x)%4],x,23.6,Math.PI/2,0);
  // the railway behind the shops (the Armadale line), straight across the map
  for(let x=468;x<=582;x+=2)doc.rail.push(M(x,-11));
  // ---- build ----
  /* Paul checks and edits Victoria Park in the Master Builder (lib/engines/editor/vp-master.html, GM): his saved map wins here.
     A map file he sends becomes VP_START (bump ver). */
  const VKEY='ppl-mapedit-vp-master'+(doc.ver>1?'-v'+doc.ver:'');let D=doc;try{if(typeof VP_START!=='undefined')D=VP_START;}catch(e){}
  try{const g=typeof isGM==='function'&&isGM(),sv=g&&localStorage.getItem(VKEY);if(sv){const j=JSON.parse(sv);if(j&&j.h&&j.h.length===N*N)D=j;}}catch(e){}
  VPMAP.doc=D;VPMAP.gen=doc;
  let I=null,grp=null,SKY=null,skyG=null,keep=null;
  const yOf=h=>WL+h*.6;
  function keepSet(){const S=new Set();try{TOON.list.forEach(e=>e.g&&S.add(e.g));}catch(e){}try{CRIT3.list.forEach(e=>e.model&&S.add(e.model));}catch(e){}try{MORE3D.list.forEach(e=>e.g&&S.add(e.g));}catch(e){}
    try{S.add(player.g||player.mesh||player.sprite);}catch(e){}if(grp)S.add(grp);if(skyG)S.add(skyG);if(window.__IBMAP&&__IBMAP.grp)S.add(__IBMAP.grp);try{const fm=scene.getObjectByName('freomap');if(fm)S.add(fm);const fs=scene.getObjectByName('fmSky');if(fs)S.add(fs);}catch(e){}return S;}
  const BX=new THREE.Box3();
  function hideOld(){if(!keep)keep=keepSet();const sx=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);let n=0;
    const visit=o=>{if(o.__vmSeen||keep.has(o))return;o.__vmSeen=1;if(o.isLight||o.isCamera)return;if(o===terrain)return;
      if(o.userData&&(o.userData.frames||o.userData.lift))return;if(o.__toon||o.__c3h||o.__m3)return;if(o.name&&/^sea|sky|cloud/i.test(o.name))return;
      try{BX.setFromObject(o);}catch(e){return;}if(BX.isEmpty()){o.__vmSeen=0;return;}const cx=(BX.min.x+BX.max.x)/2,cz=(BX.min.z+BX.max.z)/2,w=Math.max(BX.max.x-BX.min.x,BX.max.z-BX.min.z);
      const inside=BX.min.x>465&&BX.max.x<595&&BX.min.z>-45&&BX.max.z<65;if((w>200||!inside)&&o.children.length){o.__vmSeen=0;o.children.slice().forEach(visit);o.__vmSeen=0;return;}
      if(!inside||!inVP(cx,cz))return;/* layers off, not visible=false: the zone code shows each town's pieces again every frame */o.traverse(c=>{c.layers.disableAll();});o.__vmHid=1;VPMAP.hidden.push(o);n++;};
    scene.children.slice().forEach(visit);scene.scale.x=sx;scene.updateMatrixWorld(true);return n;}
  function build(){const t0=performance.now();
    grp=new THREE.Group();grp.name='vpmap';grp.position.set(CX,0,CZ);scene.add(grp);grp.updateMatrixWorld(true);
    const gq=String((typeof GFX!=='undefined'&&GFX.level)||'').toLowerCase();
    I=IslandMap.create({doc:VPMAP.doc,parent:grp,cs:2,bscale:.75,merge:true,lifeNear:gq.startsWith('h')?60:38,gammaOut:renderer.outputEncoding!==THREE.sRGBEncoding,heightMap:h=>yOf(h),
      fol:{mix:null,radius:gq.startsWith('l')?16:gq.startsWith('m')?22:28},lifeScale:gq.startsWith('l')?.1:gq.startsWith('m')?.18:.45,waterLevel:WL,searocks:false});
    VPMAP.I=I;grp.traverse(o=>{o.__pxSkip=1;o.__islKeep=1;if(o.isMesh)o.receiveShadow=true;});
    try{if(typeof SkyEngine!=='undefined'){skyG=new THREE.Group();skyG.name='vmSky';scene.add(skyG);SKY=SkyEngine.create({scene:skyG,renderer,sun:null,hemi:null,radius:Math.min(400,camera.far*.9)});try{SKY.setLayer('godrays',false);SKY.setLayer('flare',false);}catch(e){}}}catch(e){console.warn('vpmap sky',e);SKY=null;}
    try{if(typeof isGM==='function'&&isGM()){const b=document.createElement('button');b.textContent='🛠️ Master Builder · Victoria Park';b.style.cssText='position:fixed;left:50%;top:6px;transform:translateX(-50%);z-index:60;padding:6px 12px;border-radius:12px;border:2px solid #e8c37a;background:#1d2a3a;color:#ffe6a8;font:700 13px system-ui;display:none';
      b.onclick=()=>{try{save();}catch(e){}window.open('lib/engines/editor/vp-master.html','_blank');};document.body.appendChild(b);VPMAP.btn=b;
      let st=localStorage.getItem(VKEY);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){const n=localStorage.getItem(VKEY);if(n&&n!==st)location.reload();}});}}catch(e){}
    VPMAP.nHid=hideOld();VPMAP.ms=Math.round(performance.now()-t0);VPMAP.done=true;
    console.log('VPMAP built: '+VPMAP.doc.bld.length+' buildings, '+VPMAP.doc.roads.length+' roads, '+VPMAP.doc.paths.length+' paths, hid '+VPMAP.nHid+' old pieces, '+VPMAP.ms+' ms');
    try{toast('🧪 Victoria Park จาก engine (Look Lab) / Victoria Park built with the engines',4200);}catch(e){}}
  // Kip in the engine Victoria Park: its ground and what blocks him (buildings, the railway)
  const onVM=(x,z)=>VPMAP.done&&zoneOf(x)==='vp'&&inVP(x,z);
  const _gy=groundY;groundY=function(x,z){if(onVM(x,z))return Math.max(WL+.02,I.heightAt(x-CX,z-CZ));return _gy(x,z);};
  const _bl=blocked;blocked=function(x,z){if(!onVM(x,z))return _bl(x,z);return I.solidAt(x-CX,z-CZ,.25);};
  let t0=performance.now(),lt=0;const tg=new THREE.Vector3();
  (function loop(){requestAnimationFrame(loop);if(!VPMAP.done)return;const on=zoneOf(camTarget.x)==='vp';grp.visible=on;if(skyG)skyG.visible=on;if(VPMAP.btn)VPMAP.btn.style.display=on?'block':'none';if(!on)return;
    const t=(performance.now()-t0)/1000,dt=Math.min(.1,t-lt);lt=t;const nt=typeof NIGHT!=='undefined'?NIGHT:0;
    I.update(t,camTarget.x-CX,camTarget.z-CZ,{push:[player.x-CX,player.z-CZ],reveal:[player.x-CX,player.z-CZ,2.6],night:nt});
    if(SKY){tg.set(player.x,0,player.z);try{SKY.update(dt,{hour:(S.time||600)/60,target:tg});SKY.animate(t,dt,camera);}catch(e){}}
    if(t-(VPMAP.lh||0)>2.5){VPMAP.lh=t;keep=keepSet();hideOld();}/* pieces built later (pixel kit, Albany Hwy parking, dealer) go too */})();
  (function wait(){if(typeof ISL!=='undefined'&&ISL.done&&typeof SEA4!=='undefined'&&SEA4.built&&typeof terrain!=='undefined'){try{build();}catch(e){console.error('vpmap',e);}return;}setTimeout(wait,300);})();
})();
