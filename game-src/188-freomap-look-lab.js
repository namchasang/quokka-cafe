// ---------- Fremantle built with every engine (Look Lab ?freomap, Paul 15 Nov 2026) ----------
// Paul: "ทำ map Fremantle ด้วย Engine ทุกตัว แล้วขึ้น looklab ให้ผมดูก่อน". The town is written as an Island Builder map in code
// (same street plan as the game's Fremantle: Phillimore St on the harbour, High St from the Round House, Market St, South Terrace,
// William St, Parry St, Kings Square, the Esplanade, Monument Hill, the homes streets to the south) and built with the engines
// through IslandMap: Terrain, Road, Building Kit, Props, Foliage, Vehicle (cars drive, the ferry sails), Life (folk on the
// footpaths, gulls, pelicans, dolphins), Water Life, the Water Sea Engine for the harbour and Bathers Beach, and the Sky Engine.
// Map units = game units (K=1, not mirrored: the scene is only mirrored on Rottnest). The old Fremantle scenery is hidden while
// the lab is on (never deleted). Off by default: ?freomap turns it on.
var FREOMAP_LIVE=false;
/* live for Game Master accounts only (Paul, 19 Nov 2026: 'อนุมัติ fremantle map ใน map builder เฉพาะ GM master account'); players keep the old Fremantle; ?nofreomap turns it off */
const FREOMAP_GM=(()=>{try{return localStorage.getItem('qc-gm')==='1';}catch(e){return false;}})()&&!/[?&#]nofreomap\b/.test(location.search+location.hash);
const FREOMAP={on:(FREOMAP_LIVE||FREOMAP_GM||/[?&#]freomap\b/.test(location.search+location.hash))&&typeof IslandMap!=='undefined',done:false,CX:312,CZ:8,WL:-.1,hidden:[]};
if(FREOMAP.on)(()=>{
  const CX=FREOMAP.CX,CZ=FREOMAP.CZ,N=121,WL=FREOMAP.WL,toMap=(x,z)=>[x-CX,z-CZ];FREOMAP.toMap=toMap;
  const inFreo=(x,z)=>x>250&&x<380&&z>-60&&z<70;
  // ---- the map, written in game coordinates ----
  const landH=(x,z)=>{/* metres above the sea in map units (sea 0) */
    const hill=2.4*Math.exp(-((x-343)*(x-343)+(z-7)*(z-7))/60),rise=Math.max(0,x-335)*.02+Math.max(0,z-21)*.015;
    if(z<-14.4){const d=-14.4-z;return -Math.min(2.6,.9+d*.18);}/* Victoria Quay: a wall into deep water */
    if(x<274.5){if(z>-12&&z<22){const t=(x-266)/8.5;return t<0?-Math.min(2.6,.4-t*2.2):-.45+t*.85;}/* Bathers Beach slopes into the bay */
      const d=274.5-x;return -Math.min(2.6,.7+d*.2);}
    return .35+hill+rise;};
  const doc={v:1,ver:2,town:'freo',name:'Fremantle',sea:0,h:[],paths:[],roads:[],props:[],bld:[],trees:[],culs:[],biz:[],veh:[],rail:[],
    fol:{tuft:.7,flower:.35,bush:.025,tree:.002},
    life:{walker:40,jogger:4,cyclist:8,gull:12,pelican:3,dolphin:4,boat:4,kayak:2,sitter:8,picnic:4,dogfetch:3,fisher:2,flock:3,butterfly:3,swimmer:3,sunbather:6}};
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=CX+(i-60)*2,z=CZ+(j-60)*2;doc.h.push(+landH(x,z).toFixed(2));}/* grid every 2 units, like the master builder */
  const M=(x,z)=>[+(x-CX).toFixed(2),+(z-CZ).toFixed(2)];
  const road=(pts,type)=>doc.roads.push({pts:pts.map(p=>M(p[0],p[1])),type:type||'street'});
  const path=(pts,w,kind)=>doc.paths.push({pts:pts.map(p=>M(p[0],p[1])),w:w||1.6,kind:kind||'path'});
  // streets (the game's plan) and the homes streets to the south, every road joined up
  road([[276,-7],[333.4,-7],[345,-7]]);road([[297,-7],[297,8.6]]);road([[297,8.6],[318,8.6]]);road([[305.4,8.6],[305.4,24.7]]);
  road([[318,-14.4],[318,40.8]]);road([[331,-7],[331,40.8]]);road([[270,24.7],[356,24.7]]);road([[270,40.8],[356,40.8]]);
  road([[287,24.7],[287,40.8]]);road([[345,24.7],[345,40.8]]);
  // footpaths beside the main streets, High St mall, Kings Square, the Esplanade and Monument Hill paths, the quay plaza
  [[[276,-9.6],[345,-9.6]],[[279,-4.4],[296,-4.4]],[[319.6,-4.4],[345,-4.4]],[[294.4,-4.4],[294.4,21.4]],[[299.6,10.4],[299.6,22.8]],[[307.8,10.4],[307.8,22.8]],
   [[315.6,-12],[315.6,22.8]],[[320.4,-12],[320.4,22.8]],[[328.6,-4.4],[328.6,22.8]],[[333.4,-4.4],[333.4,22.8]]].forEach(p=>path(p,1.6));
  path([[275.5,1.6],[294.4,1.6]],4);/* High St mall from the Round House */path([[299.8,2.2],[315.2,2.2]],12);/* Kings Square */
  path([[280.9,4.4],[280.9,21.4]],1.4,'gravel');path([[276,16.1],[294.2,16.1]],1.4,'gravel');path([[333.8,9.5],[357,9.5]],1.4,'gravel');path([[344.5,-4.4],[344.5,22]],1.4,'gravel');
  path([[289.6,-9.8],[289.6,-14.2]],6);path([[268,-4],[268,18]],1.2,'gravel');/* the boardwalk along Bathers Beach */
  // buildings (Building Kit); o = extra kit options
  const B=(s,x,z,r,o,sign)=>{const m=M(x,z);doc.bld.push({s,x:m[0],z:m[1],r:r||0,sign,o});};
  const SH=['shop','shop','terrace','shop','mallshop'],AW=['#e85a6a','#3e7d5c','#f2c14e','#2f6fb0','#e8a33a','#8a5ad0'],WALL=['#efe3c4','#e8d8b0','#b9c8a8','#b8d4d8','#e8b8b0','#f2dc96','#e2d6c0'];
  const NAMES=['HARBOUR LANE BOOKS','OLD PORT BAKERY','THE GALLEY CAFE','SALT & PEPPER DELI','SEA CHEST ANTIQUES','TIDE & TALLOW','CRAY POT GRILL','LIMESTONE GALLERY','SPICE WHARF','PORT GELATO','BLUE DOOR BOOKS','THE TEA CADDY','DUNE SURF SHOP','LACE & IRON','CHANDLERY','PORTSIDE SHOES'];let ni=0;
  const row=(x1,x2,z,r,step,o)=>{let k=0;for(let x=x1;x<=x2;x+=step){B(SH[k%SH.length],x,z,r,Object.assign({wall:WALL[(k*3+ni)%WALL.length],awning:AW[(k+ni)%AW.length],d:5.5},o||{}),NAMES[ni++%NAMES.length]);k++;}};
  const col=(x,z1,z2,r,step,o)=>{let k=0;for(let z=z1;z<=z2;z+=step){B(SH[k%SH.length],x,z,r,Object.assign({wall:WALL[(k*5+ni)%WALL.length],awning:AW[(k+ni)%AW.length],d:5.5},o||{}),NAMES[ni++%NAMES.length]);k++;}};
  /* the buildings of the old Fremantle (Paul, 15 Nov 2026: "put all the old Fremantle buildings in the new map"): read from the
     old town's houses and shops (place, size, storeys), each facing its nearest street, as Building Kit buildings */
  const FREO_OLD=[["heritage", 296.0, -13.5, 0, 11.1, 11.1, 2], ["shop", 301.0, 13.0, 3.142, 5.9, 5.7, 2], ["shop", 300.9, 15.4, 1.571, 5.7, 5.9, 2], ["shop", 300.9, 19.7, 1.571, 5.7, 5.9, 2], ["heritage", 311.5, 2.1, 1.571, 8.0, 11.3, 2], ["heritage", 322.8, -11.8, -1.571, 6.7, 6.7, 2], ["heritage", 325.5, -11.8, 0, 6.7, 6.7, 2], ["shop", 308.8, -13.7, 0, 7.2, 11.7, 1], ["cottage", 278, -0.6, 0, 9.1, 9.1, 1], ["shop", 324.9, 17.7, 1.571, 9.3, 8.8, 1], ["shop", 309.6, 16.5, -1.571, 5.1, 5.1, 1], ["shop", 312.3, 16.5, 1.571, 5.1, 5.1, 1], ["shop", 313.8, 16.5, 1.571, 5.1, 5.1, 1], ["shop", 290.5, 2.0, -1.571, 5.5, 11.3, 2], ["cottage", 311.7, 20.1, 0, 8.8, 6.1, 1], ["shop", 322.7, 3.4, -1.571, 4.0, 6.4, 2], ["shop", 326.3, 3.4, 1.571, 4.0, 6.4, 2], ["shop", 277.5, -11.1, 0, 9.9, 4.8, 1], ["pub", 285, -12.6, 0, 10.7, 4.3, 1], ["shop", 326.9, -2.9, 3.142, 9.7, 4.7, 2], ["pub", 312.8, -11.9, 0, 10.8, 4.1, 1], ["shop", 308, -2.4, 3.142, 9.1, 4.8, 1], ["cottage", 289.4, -2, 0, 6.9, 5.7, 1], ["shop", 284.5, -2, 0, 6.3, 5.7, 2], ["shop", 323.2, -2.9, 3.142, 7.6, 4.7, 2], ["heritage", 312.8, -1.8, 3.142, 4.3, 7.7, 2], ["shop", 304.6, -11.6, 0, 5.3, 6.1, 2], ["cottage", 295.4, 15.6, 3.142, 9.3, 3.5, 1], ["cottage", 313.8, 12.8, 3.142, 6.1, 5.1, 1], ["shop", 283.5, -3.2, 3.142, 7.3, 4.1, 2], ["shop", 302.0, -2.0, -1.571, 4.1, 7.3, 2], ["shop", 326.8, -2.1, 1.571, 5.6, 5.2, 2], ["cottage", 326.8, 6.3, 1.571, 5.6, 5.2, 1], ["shop", 322.6, 6.7, -1.571, 4.5, 6.1, 2], ["shop", 289, 1.1, 0, 5.7, 4.8, 1], ["shop", 331.6, -11.6, 0, 4.4, 6.1, 2], ["cottage", 309.7, 12.9, 3.142, 4.7, 5.3, 1], ["cottage", 322.3, 15.2, -1.571, 4.5, 5.3, 1], ["cottage", 326.7, 15.2, 1.571, 4.5, 5.3, 1], ["shop", 289.0, -3.2, 3.142, 6.0, 4.0, 2], ["shop", 309.6, 13.9, -1.571, 4.5, 5.2, 2], ["cottage", 293.5, 17.4, 0, 4.7, 4.1, 1], ["shop", 321.5, 3.4, -1.571, 4.5, 3.2, 2]];
  FREO_OLD.forEach(([st,x,z,r,w,d,fl],k)=>B(st,x,z,r,{w,d,floors:fl,wall:WALL[k%WALL.length],awning:AW[k%AW.length]},st==='cottage'?undefined:NAMES[ni++%NAMES.length]));
  B('lighthouse',276.4,1.6,0,{w:5,d:5,floors:1,fh:3.2,wall:'#e2d2a8',trim:'#8a7a6a'});/* the Round House */
  // homes along the southern streets: limestone cottages, weatherboard houses, a few terraces
  const HS=['cottage','house','cottage','terrace','cottage','house'];let hk=0;
  [[24.7,-1],[24.7,1],[40.8,-1],[40.8,1]].forEach(([zs,side])=>{for(let x=272;x<=354;x+=7.2){if([287,305.4,318,331,345].some(c=>Math.abs(x-c)<4.6))continue;if(zs===24.7&&side<0&&x<296)continue;
    B(HS[hk%HS.length],x,zs+side*5.6,side<0?0:Math.PI,{wall:['#f3eee0','#efe3c4','#b8d4d8','#e8d8b0','#f6f2e8'][hk%5]});hk++;}});
  // props: lamps along the streets, benches, bus stops, the ferry jetty, a playground in the Esplanade
  const P=(k,x,z,r,o)=>{const m=M(x,z);doc.props.push(Object.assign({k,x:m[0],z:m[1],r:r||0},o||{}));};
  for(let x=280;x<=344;x+=8)P('lamp',x,-10.7);for(let x=284;x<=344;x+=8)P('lamp',x,-3.3);for(let z=-2;z<=21;z+=8){P('lamp',295.6,z);P('lamp',314.4,z);P('lamp',334.6,z);}
  [[284,10],[288,12],[284,19],[277,8]].forEach(([x,z])=>P('bench',x,z,Math.PI/2));P('busstop',310,-9.9,0);P('busstop',318,-11.5,0);P('playground',287,18.6,0);
  [[303,0],[310,0],[303,4.5],[310,-1]].forEach(([x,z])=>P('bench',x,z,0));P('jetty',289.6,-14.6,0,{len:7,w:2.4});P('flagpole',307,2.2,0);
  // trees: Norfolk pines round the Esplanade, figs in Kings Square, palms on Market St, gums on the hill
  const T=(k,x,z,s)=>{const m=M(x,z);doc.trees.push({k,x:m[0],z:m[1],s:(s||1)*.55});};/* tree sizes are made for the island's map units */
  for(let x=277;x<=293;x+=4){T('norfolk',x,5.4);T('norfolk',x,20.6);}for(let z=9;z<=17;z+=4){T('norfolk',276.2,z);T('norfolk',293.6,z);}
  T('fig',301.6,-2.6,1.2);T('fig',313.6,-2.6,1.2);T('fig',308,7.6,1.1);[[296,-1],[296,5],[298.6,12]].forEach(([x,z])=>T('datepalm',x,z));
  [[339,4],[347,2],[349,12],[338,14],[352,6]].forEach(([x,z])=>T('gum',x,z,1.1));for(let z=12;z<=20;z+=4)T('pepper',307.8,z,.8);
  // vehicles: cars drive the streets, a bus, the ferry sails in the harbour, fishing boats moored off Bathers Beach
  const V=(k,x,z,r,go)=>{const m=M(x,z);doc.veh.push({k,x:m[0],z:m[1],r:r||0,go:!!go});};
  V('sedan',290,-7,0,1);V('hatch',325,-7,Math.PI,1);V('taxi',318,6,Math.PI/2,1);V('citybus',305,-7,0,1);V('ute',331,30,Math.PI/2,1);V('van',300,24.7,0,1);V('hatch',305.4,16,Math.PI/2,1);
  V('ferry',300,-30,0,1);V('fishingboat',262,4,1.2,0);V('fishingboat',261,10,1.4,0);V('speedboat',264,-8,.4,1);V('yacht',250,-20,0,1);
  // ---- build ----
  /* Paul checks and edits Fremantle in the Master Builder (lib/engines/editor/freo-master.html, GM): his saved map wins here.
     A map file he sends becomes FREO_START (bump ver). */
  const FMKEY='ppl-mapedit-freo-master'+(doc.ver>1?'-v'+doc.ver:'');/* a new start map (ver) starts fresh in the builder */let D=doc;try{if(typeof FREO_START!=='undefined')D=FREO_START;}catch(e){}
  try{const g=typeof isGM==='function'&&isGM(),sv=g&&localStorage.getItem(FMKEY);if(sv){const j=JSON.parse(sv);if(j&&j.h&&j.h.length===N*N)D=j;}}catch(e){}
  FREOMAP.doc=D;FREOMAP.gen=doc;
  let I=null,grp=null,sea=null,SKY=null,skyG=null,keep=null;
  const yOf=h=>WL+h*.6;/* map height (sea 0) to game y: the sea sits at WL */
  function keepSet(){const S=new Set();try{TOON.list.forEach(e=>e.g&&S.add(e.g));}catch(e){}try{CRIT3.list.forEach(e=>e.model&&S.add(e.model));}catch(e){}try{MORE3D.list.forEach(e=>e.g&&S.add(e.g));}catch(e){}
    try{S.add(player.g||player.mesh||player.sprite);}catch(e){}if(grp)S.add(grp);if(skyG)S.add(skyG);if(window.__IBMAP&&__IBMAP.grp)S.add(__IBMAP.grp);if(window.__IBMAP&&__IBMAP.sky)try{S.add(scene.getObjectByName('ibSky'));}catch(e){}return S;}
  const BX=new THREE.Box3();
  function hideOld(){if(!keep)keep=keepSet();/* boxes in scene space: the scene is mirrored while the camera is on Rottnest */const sx=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);let n=0;
    const visit=o=>{if(o.__fmSeen||keep.has(o))return;o.__fmSeen=1;if(o.isLight||o.isCamera)return;if(o===terrain)return;
      if(o.userData&&(o.userData.frames||o.userData.lift))return;if(o.__toon||o.__c3h||o.__m3)return;if(o.name&&/^sea|sky|cloud/i.test(o.name))return;
      try{BX.setFromObject(o);}catch(e){return;}if(BX.isEmpty()){o.__fmSeen=0;return;}const cx=(BX.min.x+BX.max.x)/2,cz=(BX.min.z+BX.max.z)/2,w=Math.max(BX.max.x-BX.min.x,BX.max.z-BX.min.z);
      const inside=BX.min.x>250&&BX.max.x<380&&BX.min.z>-60&&BX.max.z<70;if((w>200||!inside)&&o.children.length){/* a big group (all of the old Fremantle detail, or the whole world): look inside it */if(!o.isMesh||o.children.length){o.__fmSeen=0;o.children.slice().forEach(visit);}o.__fmSeen=0;/* look again next time: pieces get added later */return;}
      if(!inFreo(cx,cz))return;/* layers off, not visible=false: the zone code shows each town's pieces again every frame */o.traverse(c=>{c.layers.disableAll();});o.__fmHid=1;FREOMAP.hidden.push(o);n++;};scene.children.slice().forEach(visit);scene.scale.x=sx;scene.updateMatrixWorld(true);return n;}
  function build(){const t0=performance.now();
    grp=new THREE.Group();grp.name='freomap';grp.position.set(CX,0,CZ);scene.add(grp);grp.updateMatrixWorld(true);
    const gq=String((typeof GFX!=='undefined'&&GFX.level)||'').toLowerCase();
    I=IslandMap.create({doc:FREOMAP.doc,parent:grp,cs:2,bscale:.75,merge:true,lifeNear:gq.startsWith('h')?60:38,gammaOut:renderer.outputEncoding!==THREE.sRGBEncoding,heightMap:h=>yOf(h),
      fol:{mix:null,radius:gq.startsWith('l')?16:gq.startsWith('m')?22:28},lifeScale:gq.startsWith('l')?.1:gq.startsWith('m')?.18:.45,waterLevel:WL,searocks:false});
    FREOMAP.I=I;grp.traverse(o=>{o.__pxSkip=1;o.__islKeep=1;if(o.isMesh)o.receiveShadow=true;});
    // the Water Sea Engine over the harbour and the bay (the copy the Rottnest sea uses), drawn by the game's own pre-pass
    try{if(typeof WaterSea!=='undefined'){sea=WaterSea.create({renderer,scene,camera,heightAt:(x,z)=>I.heightAt(x-CX,z-CZ),bounds:{x0:CX-60,z0:CZ-60,w:120,h:120},heightRes:[512,512],ground:null,level:WL,run:.2,wetScale:.3,size:120,meshSize:160});
      sea.mesh.name='seaFreo';sea.mesh.visible=false;FREOMAP.sea=sea;}}catch(e){console.warn('freomap sea',e);sea=null;}
    // the Sky Engine (draws only: the game keeps its own sun, shade and fog)
    try{if(typeof SkyEngine!=='undefined'){skyG=new THREE.Group();skyG.name='fmSky';scene.add(skyG);SKY=SkyEngine.create({scene:skyG,renderer,sun:null,hemi:null,radius:Math.min(400,camera.far*.9)});try{SKY.setLayer('godrays',false);SKY.setLayer('flare',false);}catch(e){}}}catch(e){console.warn('freomap sky',e);}
    try{if(typeof isGM==='function'&&isGM()){const b=document.createElement('button');b.textContent='🛠️ Master Builder · Fremantle';b.style.cssText='position:fixed;left:50%;top:6px;transform:translateX(-50%);z-index:60;padding:6px 12px;border-radius:12px;border:2px solid #e8c37a;background:#1d2a3a;color:#ffe6a8;font:600 13px system-ui;display:none';b.onclick=()=>{try{save();}catch(e){}location.href='./lib/engines/editor/freo-master.html?from=game&slot='+SLOT+'&freomap';};document.body.appendChild(b);FREOMAP.btn=b;
      let st=localStorage.getItem(FMKEY);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){const n=localStorage.getItem(FMKEY);if(n&&n!==st)location.reload();}});}}catch(e){}
    FREOMAP.nHid=hideOld();FREOMAP.ms=Math.round(performance.now()-t0);FREOMAP.done=true;
    console.log('FREOMAP built: '+FREOMAP.doc.bld.length+' buildings, '+FREOMAP.doc.roads.length+' roads, '+FREOMAP.doc.paths.length+' paths, hid '+FREOMAP.nHid+' old pieces, '+FREOMAP.ms+' ms');
    try{toast('🧪 Fremantle จาก engine (Look Lab) / Fremantle built with the engines',4200);}catch(e){}}
  // Kip in the engine Fremantle: its ground and what blocks him (sea, buildings)
  const onFM=(x,z)=>FREOMAP.done&&zoneOf(x)==='freo'&&inFreo(x,z);
  const _gy=groundY;groundY=function(x,z){if(onFM(x,z))return Math.max(WL+.02,I.heightAt(x-CX,z-CZ));return _gy(x,z);};
  const _bl=blocked;blocked=function(x,z){if(!onFM(x,z))return _bl(x,z);if(I.heightAt(x-CX,z-CZ)<WL+.02)return true;return I.solidAt(x-CX,z-CZ,.25);};
  // the sea: the old water layers hide while the camera is in Fremantle and come back when it leaves
  let seaOn=false;const OLDW=()=>[typeof water!=='undefined'?water:null,typeof sparkWater!=='undefined'?sparkWater:null,typeof shore!=='undefined'?shore:null,typeof foam!=='undefined'?foam:null,typeof waves!=='undefined'?waves:null,typeof SEA3!=='undefined'?SEA3.sea:null].filter(Boolean);
  const sd=new THREE.Vector3(),sc=new THREE.Color(),sk=new THREE.Color();
  function freoPre(){if(!FREOMAP.done||!sea)return;const on=zoneOf(camTarget.x)==='freo';
    if(on!==seaOn){seaOn=on;OLDW().forEach(o=>{if(on){o.__fm=o.visible;o.visible=false;}else if(o.__fm!==undefined)o.visible=o.__fm;});sea.mesh.visible=on;}
    if(!on)return;OLDW().forEach(o=>{o.visible=false;});
    sd.copy(sun.position).sub(sun.target.position);sc.copy(sun.color).multiplyScalar(sun.intensity);sk.copy(hemi.color).multiplyScalar(hemi.intensity);try{sea.setSun(sd,sc,sk);}catch(e){}
    sea.mesh.position.set(Math.round(camTarget.x),0,Math.round(camTarget.z));sea.pre(performance.now()/1000);}
  (function hook(){if(typeof SEA4==='undefined'||!SEA4.pre){setTimeout(hook,500);return;}const p0=SEA4.pre;SEA4.pre=function(){p0();try{freoPre();}catch(e){}};})();
  let t0=performance.now(),lt=0;const tg=new THREE.Vector3();
  (function loop(){requestAnimationFrame(loop);if(!FREOMAP.done)return;const on=zoneOf(camTarget.x)==='freo';grp.visible=on;if(skyG)skyG.visible=on;if(FREOMAP.btn)FREOMAP.btn.style.display=on?'block':'none';if(!on)return;
    const t=(performance.now()-t0)/1000,dt=Math.min(.1,t-lt);lt=t;const nt=typeof NIGHT!=='undefined'?NIGHT:0;
    I.update(t,camTarget.x-CX,camTarget.z-CZ,{push:[player.x-CX,player.z-CZ],reveal:[player.x-CX,player.z-CZ,2.6],night:nt});
    if(SKY){tg.set(player.x,0,player.z);try{SKY.update(dt,{hour:(S.time||600)/60,target:tg});SKY.animate(t,dt,camera);}catch(e){}}
    if(t-(FREOMAP.lh||0)>2.5){FREOMAP.lh=t;keep=keepSet();hideOld();}/* pieces built later (pixel kit, town detail) go too */})();
  (function wait(){if(typeof ISL!=='undefined'&&ISL.done&&typeof SEA4!=='undefined'&&SEA4.built&&typeof terrain!=='undefined'){try{build();}catch(e){console.error('freomap',e);}return;}setTimeout(wait,300);})();
})();
