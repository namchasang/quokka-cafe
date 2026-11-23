// ---------- South Perth built with every engine (Look Lab ?spmap, nightly 24 Nov 2026, brief quokka-cbd-southperth-master-20261122) ----------
// Paul (22 Nov 2026): 'map Perth CBD และ South Perth ปลดลอคและออกแบบโดยใช้ engine game ทั้งหมดให้เหมือน map อื่น gm master account
// สามารถแก้ไขได้ แต่ผู้เล่นแก้ไม่ได้เหมือนเดิม'. South Perth is a protected area (CLAUDE.md); Paul named it, so it may be rebuilt with the
// engines, but every place keeps its spot and size: the map below copies the game's own South Perth (parts 024-026, measured at runtime
// with tools/qa-dump-zone.mjs): Mill Point Rd, Mends St and its shops, the plaza on the foreshore, Swan Market, Mends Servo, Swan Seeds,
// the Mill Point Hotel, Mill Point Towers, the Old Post Office, the Angelo St shops, the homes on the south side, the Old Mill lawn,
// Coode St and the east foreshore, the river wall. Built through IslandMap: Terrain, Road, Building Kit, Props, Foliage, Vehicle, Life,
// the Water Sea Engine for Perth Water (calm, no surf) and the Sky Engine. Map units = game units (K=1, not mirrored).
// Kept from the old town while the lab is on (the engines have nothing like them yet): the Old Mill with its turning sails (story:
// grind flour, Miller Tom), the Origami Quokka sculpture, and everything on the river side of the wall (the ferry jetty at Mends St,
// Coode St Jetty, kayaks, the Narrows Bridge, the city skyline across the water). Everything else old is hidden (never deleted).
// The Game Master edits it in lib/engines/editor/sp-master.html (key ppl-mapedit-sp-master). Off for everyone: ?spmap turns it on.
var SPMAP_LIVE=false;
const SPMAP={on:(SPMAP_LIVE||/[?&#]spmap\b/.test(location.search+location.hash))&&typeof IslandMap!=='undefined',done:false,CX:150,CZ:8,WL:-.1,SHORE:-3.9,hidden:[]};
if(SPMAP.on)(()=>{
  const CX=SPMAP.CX,CZ=SPMAP.CZ,N=121,WL=SPMAP.WL,SH=SPMAP.SHORE;
  const inSP=(x,z)=>x>96&&x<206&&z>SH&&z<36;
  // ---- the map, written in game coordinates ----
  const landH=(x,z)=>{/* map height, the river at 0: flat lawn and streets, a gentle rise to the south, the river wall at z -3.9 */
    if(z<SH-.2){const d=SH-.2-z;return -Math.min(2.2,1.1+d*.12);}return .35+Math.max(0,z-24)*.01;};
  const doc={v:1,ver:1,town:'sp',name:'South Perth',sea:0,calm:1,keepPools:1,h:[],paths:[],roads:[],props:[],bld:[],trees:[],culs:[],biz:[],veh:[],rail:[],
    fol:{tuft:.45,flower:.3,bush:.02,tree:.002},
    life:{walker:30,jogger:6,cyclist:8,gull:6,pelican:2,dolphin:0,boat:3,kayak:3,sitter:8,picnic:4,dogfetch:3,fisher:2,flock:2,butterfly:3,swimmer:0,sunbather:0}};
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=CX+(i-60)*2,z=CZ+(j-60)*2;doc.h.push(+landH(x,z).toFixed(2));}
  const M=(x,z)=>[+(x-CX).toFixed(2),+(z-CZ).toFixed(2)];
  const road=(pts,type)=>doc.roads.push({pts:pts.map(p=>M(p[0],p[1])),type:type||'street'});
  const path=(pts,w,kind)=>doc.paths.push({pts:pts.map(p=>M(p[0],p[1])),w:w||1.6,kind:kind||'path'});
  // streets: Mill Point Rd right across the town (the drives to Fremantle and Victoria Park at its ends), Mends St up to the plaza,
  // the two laneways behind the shops; footpaths on both sides of Mill Point Rd, the river walk, Angelo St and the Old Mill path
  road([[98,22.2],[125,22.2],[140,22.2],[150,22.2],[178,22.2],[202,22.2]]);road([[150,22.2],[150,11]]);
  road([[125,22.2],[125,11]],'lane');road([[140,22.2],[140,11]],'lane');
  path([[98,20.7],[202,20.7]],.8);path([[98,23.9],[202,23.9]],.8);path([[98,-3],[202,-3]],1.8);
  path([[150,11],[150,2.6]],4);path([[146,.1],[155,.1]],5);path([[147.6,11],[147.6,20.6]],1.2);path([[152.4,11],[152.4,20.6]],1.2);
  path([[178,20.6],[178,10.4],[178,-2.2]],1.6);path([[110.4,-2.2],[110.4,7.8]],1.6);path([[155.4,14.85],[153.4,14.85]],1.2);/* Mends Lane */
  // buildings (Building Kit). Sizes are the game's sizes over the kit's .75 scale; r=0 faces +z (Mill Point Rd), r=pi faces the river
  const B=(s,x,z,r,o,sign)=>{const m=M(x,z);doc.bld.push({s,x:m[0],z:m[1],r:r||0,sign,o});};const K=v=>+(v/.75).toFixed(2);
  B('shop',163.5,1,Math.PI,{w:K(4),d:K(2.4),floors:1,wall:'#f6f2e8',awning:'#c8344a'},'SWAN MARKET');
  B('kiosk',135.5,.8,Math.PI,{w:K(3),d:K(2),wall:'#e8d2a6',awning:'#2f6fb0'},'MENDS SERVO');
  B('kiosk',156,1.2,Math.PI,{w:K(2.8),d:K(2),wall:'#d8f2e8',awning:'#3e7d5c'},'SWAN SEEDS');
  B('pub',143.6,16.6,0,{w:K(4.4),d:K(3.2),floors:2,wall:'#b65a42',brick:true},'THE MILL POINT HOTEL');
  B('shop',155.4,12.8,-Math.PI/2,{w:K(3.4),d:K(2.4),floors:1,wall:'#f2e6c8',awning:'#3e7d5c'},'PICCOLO TRATTORIA');
  B('shop',155.4,16.9,-Math.PI/2,{w:K(3.4),d:K(2.4),floors:1,wall:'#eef2f4',awning:'#2f5a8a'},'SWAN HOME & LIVING');
  B('kiosk',145.4,12.6,Math.PI/2,{w:K(2.6),d:K(2),wall:'#fff3d6',awning:'#e8a33a'},'MENDS GELATO');
  B('tower',159.6,15.2,0,{w:K(2.7),d:K(2.7),floors:5,glass:'#5a7a98'},'MILL POINT TOWERS');B('slab',162.6,15,0,{w:K(2.2),d:K(2.2),floors:6,glass:'#4a6a88'});
  B('heritage',136.2,16.4,0,{w:K(3.8),d:K(2.8),floors:1,wall:'#b65a42'},'OLD POST OFFICE');
  [128,132.2,167.2].forEach((x,i)=>B('bungalow',x,16,0,{w:K(3.2),d:K(2.8),wall:['#b65a42','#f2e6c8','#b65a42'][i],roofColor:['#b8562e','#3f7a5a','#7a4a3a'][i]}));
  B('house',121,.4,Math.PI,{w:K(5),d:K(3),floors:2,wall:'#f6f2e8',roof:'flat',verandah:false});/* the riverfront house, glass to the water */
  [[172.6,'ANGELO ST BAKEHOUSE','#c8344a','#fbe9cf'],[183.4,'SANDGATE BOOKS','#2f5a8a','#eef2f4'],[188.2,'MILL POINT PHARMACY','#3e7d5c','#f6f6f0'],[193.4,'CORNER CAFE','#e8a33a','#fff3d6']]
    .forEach(([x,n,c,w])=>B('shop',x,16.4,0,{w:K(4.4),d:K(2.8),floors:1,wall:w,awning:c},n));
  [[118,'#efe3c4','#b8562e'],[124,'#b65a42','#8a3a2a'],[131,'#f2e6c8','#3f7a5a'],[138,'#dfeaf0','#2f5a8a'],[145,'#e8d2a6','#b8562e'],[166,'#b65a42','#7a4a3a'],[172,'#f2e6c8','#b8562e'],[179,'#efe3c4','#3f7a5a'],[186,'#dfeaf0','#8a3a2a'],[193,'#b65a42','#b8562e']]
    .forEach(([x,w,rf],i)=>B(i%2?'cottage':'house',x,27.8,Math.PI,{w:K(3.4),d:K(2.6),wall:w,roofColor:rf}));/* the homes on the south side face Mill Point Rd */
  B('lighthouse',106,2.6,0,{w:K(2.8),d:K(2.8),floors:2,wall:'#f6f2e8',trim:'#4a4038'},'THE OLD MILL');/* in the game the old mill with its turning sails stays (see top) */
  B('kiosk',175.6,4,0,{w:K(2.6),d:K(1.8),wall:'#2f78a8',awning:'#f3efe6'},'SWAN KAYAKS');
  // props: lamps along Mill Point Rd and the river walk, benches, bins, the bus stop, the plaza umbrellas, jetties, signs
  const P=(k,x,z,r,o)=>{const m=M(x,z);doc.props.push(Object.assign({k,x:m[0],z:m[1],r:r||0},o||{}));};
  for(let x=104;x<=198;x+=8){if(Math.abs(x-150)>3)P('lamp',x,20.2);}for(let x=102;x<=198;x+=9)P('lamp',x,-2);
  P('busstop',158.6,19.8,Math.PI);[[148.4,2],[152.8,2.2]].forEach(([x,z])=>P('cafeset',x,z));[[188,5],[194,3.6],[116,1.6],[131,2.4]].forEach(([x,z])=>P('bench',x,z,Math.PI));
  [[146.4,3.2],[154.6,3.2],[178.8,-1.6]].forEach(([x,z])=>P('bin',x,z));P('bikerack',137.6,3.6,0);P('planter',156.3,14.85,0);
  P('jetty',150.6,-7.6,0,{lines:[M(151.8,-3.9),M(151.8,-10.2)],w:1.8});P('jetty',186,-6.6,0,{lines:[M(186,-3.9),M(186,-9.4)],w:1.2});P('jetty',122.6,-4.6,0,{lines:[M(122.6,-3.9),M(122.6,-5.6)],w:1});
  P('sign',178,20.2,0);P('sign',108.8,6.6,0);P('sign',184.4,-2.2,0);P('sign',197.4,19.4,0);
  // trees: the plane trees of Mends St and Mill Point Rd, jacarandas on the east foreshore, gums and peppers on the Old Mill lawn, palms by the post office
  const T=(k,x,z,s)=>{const m=M(x,z);doc.trees.push({k,x:m[0],z:m[1],s:(s||1)*.55});};
  [[147,12],[147,14.4],[153,11.8],[153,14.6],[153,19],[147,19.2],[140.6,12],[158,11.8],[166,12],[118,8],[126,9.5],[176.4,18.8],[198,18.8],[174,25],[184,25],[194,25],[121,26],[134.5,26],[169,26],[182.5,26],[189.6,26]].forEach(([x,z])=>T('fig',x,z,.9));
  [[171,6],[182,8.2],[192,7.4],[198,1]].forEach(([x,z])=>T('pepper',x,z,1));[[103.2,14.4],[109.8,13.6],[105.8,18.6],[103,8.8],[111.6,9.4],[102.4,-.6]].forEach(([x,z])=>T('gum',x,z,1));
  [[133.2,14.4],[139,14.6]].forEach(([x,z])=>T('palm',x,z,.9));
  // vehicles: cars on Mill Point Rd, the Victoria Park bus at its stop, cars parked in Mends St, the ferry and kayaks on the river
  const V=(k,x,z,r,go)=>{const m=M(x,z);doc.veh.push({k,x:m[0],z:m[1],r:r||0,go:!!go});};
  V('sedan',118,21.6,0,1);V('hatch',176,22.8,Math.PI,1);V('taxi',190,21.6,0,1);V('ute',130,22.8,Math.PI,1);V('citybus',160,21.6,0,0);
  V('hatch',151.9,12.4,Math.PI/2,0);V('suv',151.9,15.6,Math.PI/2,0);V('sedan',148.1,18.2,-Math.PI/2,0);
  V('ferry',140,-14,0,1);V('kayak',176,-6,.4,1);V('yacht',120,-18,0,1);
  // ---- build ----
  /* Paul checks and edits South Perth in the Master Builder (lib/engines/editor/sp-master.html, GM): his saved map wins here.
     A map file he sends becomes SP_START (bump ver). */
  const SKEY='ppl-mapedit-sp-master'+(doc.ver>1?'-v'+doc.ver:'');let D=doc;try{if(typeof SP_START!=='undefined')D=SP_START;}catch(e){}
  try{const g=typeof isGM==='function'&&isGM(),sv=g&&localStorage.getItem(SKEY);if(sv){const j=JSON.parse(sv);if(j&&j.h&&j.h.length===N*N)D=j;}}catch(e){}
  SPMAP.doc=D;SPMAP.gen=doc;
  /* the old Old Mill (turning sails) stays, so the kit's round tower for it is left out of the game (the builder still shows it) */
  const isMill=b=>b.sign==='THE OLD MILL';const keepOldAt=(x,z)=>(Math.abs(x-106)<3.2&&Math.abs(z-2.6)<3.2)||(Math.abs(x-153.6)<1.6&&Math.abs(z+.6)<1.4);
  let I=null,grp=null,sea=null,SKY=null,skyG=null,keep=null;
  const yOf=h=>WL+h*.6;
  function keepSet(){const S=new Set();try{TOON.list.forEach(e=>e.g&&S.add(e.g));}catch(e){}try{CRIT3.list.forEach(e=>e.model&&S.add(e.model));}catch(e){}try{MORE3D.list.forEach(e=>e.g&&S.add(e.g));}catch(e){}
    try{S.add(player.g||player.mesh||player.sprite);}catch(e){}if(grp)S.add(grp);if(skyG)S.add(skyG);if(window.__IBMAP&&__IBMAP.grp)S.add(__IBMAP.grp);
    try{Object.values(brMeshes).forEach(m=>m&&S.add(m));}catch(e){}/* a branch café the player bought stays */
    try{['freomap','fmSky','vpmap','vmSky'].forEach(n=>{const o=scene.getObjectByName(n);if(o)S.add(o);});}catch(e){}return S;}
  const BX=new THREE.Box3();
  function hideOld(){if(!keep)keep=keepSet();const sx=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);let n=0;
    const visit=o=>{if(o.__smSeen||keep.has(o))return;o.__smSeen=1;if(o.isLight||o.isCamera)return;if(o===terrain)return;
      if(o.userData&&(o.userData.frames||o.userData.lift))return;if(o.__toon||o.__c3h||o.__m3)return;if(o.name&&/^sea|sky|cloud/i.test(o.name))return;
      try{BX.setFromObject(o);}catch(e){return;}if(BX.isEmpty()){o.__smSeen=0;return;}const cx=(BX.min.x+BX.max.x)/2,cz=(BX.min.z+BX.max.z)/2,w=Math.max(BX.max.x-BX.min.x,BX.max.z-BX.min.z);
      const inside=BX.min.x>94&&BX.max.x<208&&BX.min.z>-6&&BX.max.z<38;if((w>200||!inside)&&o.children.length){o.__smSeen=0;o.children.slice().forEach(visit);o.__smSeen=0;return;}
      if(!inside||!inSP(cx,cz)||keepOldAt(cx,cz))return;o.traverse(c=>{c.layers.disableAll();});o.__smHid=1;SPMAP.hidden.push(o);n++;};
    scene.children.slice().forEach(visit);scene.scale.x=sx;scene.updateMatrixWorld(true);return n;}
  function build(){const t0=performance.now();
    grp=new THREE.Group();grp.name='spmap';grp.position.set(CX,0,CZ);scene.add(grp);grp.updateMatrixWorld(true);
    const gq=String((typeof GFX!=='undefined'&&GFX.level)||'').toLowerCase();
    const GD=Object.assign({},SPMAP.doc,{bld:SPMAP.doc.bld.filter(b=>!isMill(b))});
    I=IslandMap.create({doc:GD,parent:grp,cs:2,bscale:.75,merge:true,lifeNear:gq.startsWith('h')?60:38,gammaOut:renderer.outputEncoding!==THREE.sRGBEncoding,heightMap:h=>yOf(h),
      fol:{mix:null,radius:gq.startsWith('l')?16:gq.startsWith('m')?22:28},lifeScale:gq.startsWith('l')?.1:gq.startsWith('m')?.18:.45,waterLevel:WL,searocks:false});
    SPMAP.I=I;grp.traverse(o=>{o.__pxSkip=1;o.__islKeep=1;if(o.isMesh)o.receiveShadow=true;});
    // the Water Sea Engine for Perth Water (calm river: no run-up), drawn by the game's own pre-pass
    try{if(typeof WaterSea!=='undefined'){sea=WaterSea.create({renderer,scene,camera,heightAt:(x,z)=>I.heightAt(x-CX,z-CZ),bounds:{x0:CX-60,z0:CZ-60,w:120,h:120},heightRes:[512,512],ground:null,level:WL,run:0,wetScale:.3,size:120,meshSize:160});
      sea.mesh.name='seaSP';sea.mesh.visible=false;SPMAP.sea=sea;}}catch(e){console.warn('spmap sea',e);sea=null;}
    try{if(typeof SkyEngine!=='undefined'){skyG=new THREE.Group();skyG.name='smSky';scene.add(skyG);SKY=SkyEngine.create({scene:skyG,renderer,sun:null,hemi:null,radius:Math.min(400,camera.far*.9)});try{SKY.setLayer('godrays',false);SKY.setLayer('flare',false);}catch(e){}}}catch(e){console.warn('spmap sky',e);SKY=null;}
    try{if(typeof isGM==='function'&&isGM()){const b=document.createElement('button');b.textContent='🛠️ Master Builder · South Perth';b.style.cssText='position:fixed;left:50%;top:6px;transform:translateX(-50%);z-index:60;padding:6px 12px;border-radius:12px;border:2px solid #e8c37a;background:#1d2a3a;color:#ffe6a8;font:700 13px system-ui;display:none';
      b.onclick=()=>{try{save();}catch(e){}location.href='./lib/engines/editor/sp-master.html?from=game&slot='+SLOT+'&spmap';};document.body.appendChild(b);SPMAP.btn=b;
      let st=localStorage.getItem(SKEY);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){const n=localStorage.getItem(SKEY);if(n&&n!==st)location.reload();}});}}catch(e){}
    SPMAP.nHid=hideOld();SPMAP.ms=Math.round(performance.now()-t0);SPMAP.done=true;
    console.log('SPMAP built: '+SPMAP.doc.bld.length+' buildings, '+SPMAP.doc.roads.length+' roads, '+SPMAP.doc.paths.length+' paths, hid '+SPMAP.nHid+' old pieces, '+SPMAP.ms+' ms');
    try{toast('🧪 South Perth จาก engine (Look Lab) / South Perth built with the engines',4200);}catch(e){}}
  // Kip in the engine South Perth: its ground and what blocks him (buildings); the river side of the wall (jetties) stays the old town's
  const onSM=(x,z)=>SPMAP.done&&zoneOf(x)==='sp'&&inSP(x,z);
  const _gy=groundY;groundY=function(x,z){if(onSM(x,z))return Math.max(WL+.02,I.heightAt(x-CX,z-CZ));return _gy(x,z);};
  const _bl=blocked;blocked=function(x,z){if(!onSM(x,z))return _bl(x,z);if(keepOldAt(x,z)&&_bl(x,z))return true;if(I.heightAt(x-CX,z-CZ)<WL+.02)return true;return I.solidAt(x-CX,z-CZ,.25);};
  // the river: the old water layers hide while the camera is in South Perth and come back when it leaves
  let seaOn=false;const OLDW=()=>[typeof water!=='undefined'?water:null,typeof sparkWater!=='undefined'?sparkWater:null,typeof shore!=='undefined'?shore:null,typeof foam!=='undefined'?foam:null,typeof waves!=='undefined'?waves:null,typeof SEA3!=='undefined'?SEA3.sea:null].filter(Boolean);
  const sd=new THREE.Vector3(),sc=new THREE.Color(),sk=new THREE.Color();
  function spPre(){if(!SPMAP.done||!sea)return;const on=zoneOf(camTarget.x)==='sp';
    if(on!==seaOn){seaOn=on;OLDW().forEach(o=>{if(on){o.__sm=o.visible;o.visible=false;}else if(o.__sm!==undefined)o.visible=o.__sm;});sea.mesh.visible=on;}
    if(!on)return;OLDW().forEach(o=>{o.visible=false;});
    sd.copy(sun.position).sub(sun.target.position);sc.copy(sun.color).multiplyScalar(sun.intensity);sk.copy(hemi.color).multiplyScalar(hemi.intensity);try{sea.setSun(sd,sc,sk);}catch(e){}
    sea.mesh.position.set(Math.round(camTarget.x),0,Math.round(camTarget.z));sea.pre(performance.now()/1000);}
  (function hook(){if(typeof SEA4==='undefined'||!SEA4.pre){setTimeout(hook,500);return;}const p0=SEA4.pre;SEA4.pre=function(){p0();try{spPre();}catch(e){}};})();
  let t0=performance.now(),lt=0;const tg=new THREE.Vector3();
  (function loop(){requestAnimationFrame(loop);if(!SPMAP.done)return;const on=zoneOf(camTarget.x)==='sp';grp.visible=on;if(skyG)skyG.visible=on;if(SPMAP.btn)SPMAP.btn.style.display=on?'block':'none';if(!on)return;
    const t=(performance.now()-t0)/1000,dt=Math.min(.1,t-lt);lt=t;const nt=typeof NIGHT!=='undefined'?NIGHT:0;
    I.update(t,camTarget.x-CX,camTarget.z-CZ,{push:[player.x-CX,player.z-CZ],reveal:[player.x-CX,player.z-CZ,2.6],night:nt});
    if(SKY){tg.set(player.x,0,player.z);try{SKY.update(dt,{hour:(S.time||600)/60,target:tg});SKY.animate(t,dt,camera);}catch(e){}}
    if(t-(SPMAP.lh||0)>2.5){SPMAP.lh=t;keep=keepSet();hideOld();}/* pieces built later (pixel kit, town detail) go too */
    if(t-(SPMAP.lk||0)>.2){SPMAP.lk=t;SPMAP.hidden.forEach(o=>o.traverse(c=>{if(c.layers.mask)c.layers.disableAll();}));}/* the distance cull (engCull) turns layer 0 back on when its cell comes into view */})();
  (function wait(){if(typeof ISL!=='undefined'&&ISL.done&&typeof SEA4!=='undefined'&&SEA4.built&&typeof terrain!=='undefined'){try{build();}catch(e){console.error('spmap',e);}return;}setTimeout(wait,300);})();
})();
