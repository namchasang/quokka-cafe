// ---------- City walls and the world map (Look Lab: ?lab or ?world until WORLD_LIVE is true) ----------
// Every area except Rottnest gets a limestone city wall round its edge, with a gate on the west (left) and east (right).
// Walking out through a gate opens the world map: Kip drives his little two-tone retro car between the towns, the car
// rides the ferries across the water, and driving into a town enters it by the gate on the side he arrives from.
// Rottnest has no wall: drive to the jetty on the map and ride into Thomson Bay. The old ferries and buses still work.
var WORLD_LIVE=true;
const WORLD={on:WORLD_LIVE||/[?&#](lab|world)\b/.test(location.search+location.hash),walls:{},g:null};
// freeway signs instead of gate towers (Look Lab ?lab or ?signs until SIGNS_LIVE): the way out is where the main road leaves town
var SIGNS_LIVE=true;var FENCE_LIVE=true;const FENCE_ON=FENCE_LIVE||/[?&#](lab|fence)\b/.test(location.search+location.hash);const SIGNS_ON=SIGNS_LIVE||/[?&#](lab|signs)\b/.test(location.search+location.hash);
const ROAD_Z={sp:{w:22.2,e:22.2},freo:{w:-2,e:20.4},hi:{w:5.2,e:5.2},vp:{w:0,e:0},cbd:{w:5,e:-3.1},air:{w:.9,e:.9}};
const SIGN_DEF={spw:{route:'5',road:'MILL POINT RD',to:[['Fremantle',18],['Rottnest Ferry',19],['Perth Airport',16]]},spe:{route:'5',road:'MILL POINT RD',to:[['Heirisson Is',3],['Victoria Park',5],['Perth Airport',14]]},
  freow:{route:'7',road:'HIGH ST',to:[['B-Shed Ferry',1],['Rottnest Island',19],['Bathers Beach',1]]},freoe:{route:'7',road:'CANNING HWY',to:[['South Perth',17],['Perth CBD',19],['Perth Airport',30]]},
  hiw:{route:'6',road:'THE CAUSEWAY',to:[['Perth CBD',2],['South Perth',3],['Fremantle',20]]},hie:{route:'6',road:'THE CAUSEWAY',to:[['Victoria Park',3],['Perth Airport',12],['Melbourne',3400]]},
  vpw:{route:'30',road:'ALBANY HWY',to:[['Perth CBD',5],['South Perth',5],['Fremantle',22]]},vpe:{route:'30',road:'ALBANY HWY',to:[['Perth Airport',10],['Armadale',26],['Albany',405]]},
  cbdw:{route:'5',road:'MOUNTS BAY RD',to:[['Kings Park',1],['Fremantle',19],['Rottnest Ferry',19]]},cbde:{route:'94',road:'ST GEORGES TCE',to:[['Victoria Park',5],['Perth Airport',12],['Kalgoorlie',595]]},
  airw:{route:'94',road:'AIRPORT DR',to:[['Perth CBD',12],['Victoria Park',10],['Fremantle',30]]},aire:{route:'4',road:'AIRPORT DR',to:[['Midland',8],['Swan Valley',18],['Sydney',3930]]}};
// the overlay exists in every build (hideOverlays looks for it); it only opens when the world layer is on
(()=>{const ov=document.createElement('div');ov.id='wmOv';ov.className='overlay';ov.hidden=true;
  ov.innerHTML='<div id="wmBox"><div id="wmTop"><b id="wmTitle">World map</b><span id="wmTabs"><button type="button" id="wmTabP" aria-pressed="true">Perth</button><button type="button" id="wmTabA" aria-pressed="false">Australia</button></span><button type="button" id="wmBack">Back to town</button></div>'+
    '<canvas id="wmCv" width="320" height="200"></canvas><div id="wmHud"><div><p id="wmName">On the road</p><p id="wmNote"></p></div><button type="button" id="wmAct">Enter</button></div>'+
    '<p id="wmHelp">Drive with the arrow keys or WASD, or tap where to go · Space or the button to enter a town</p></div>';
  document.body.appendChild(ov);
  const st=document.createElement('style');st.textContent='#wmOv{position:fixed;inset:0;z-index:60;background:#0d1426;display:flex;align-items:center;justify-content:center;padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))}'+
    '#wmBox{width:min(100%,calc((100vh - 150px)*1.6),980px);display:flex;flex-direction:column;gap:8px;font-family:"M PLUS Rounded 1c",system-ui,sans-serif;color:#f5ecd8}'+
    '#wmTop{display:flex;align-items:center;gap:8px;flex-wrap:wrap}#wmTitle{font-family:"Pixelify Sans",monospace;color:#ffd34d;font-size:20px;margin-right:auto}'+
    '#wmTabs{display:flex;gap:4px}#wmOv button{font-family:"Pixelify Sans",monospace;font-size:15px;background:#1d2540;color:#a9b3cf;border:2px solid #2c3658;border-radius:4px;padding:6px 10px;cursor:pointer}'+
    '#wmOv button[aria-pressed="true"],#wmAct{background:#ffd34d!important;color:#141a2e!important;border-color:#ffd34d!important}#wmAct[disabled]{opacity:.4}'+
    '#wmCv{width:100%;aspect-ratio:16/10;image-rendering:pixelated;image-rendering:crisp-edges;border:3px solid #2c3658;border-radius:6px;touch-action:none;background:#0d1a2c}'+
    '#wmHud{display:flex;gap:10px;align-items:center;background:#1d2540;border:2px solid #2c3658;border-radius:6px;padding:8px 10px}#wmHud>div{flex:1;min-width:0}'+
    '#wmName{font-family:"Pixelify Sans",monospace;font-size:18px;margin:0}#wmNote{margin:0;font-size:12px;color:#a9b3cf}#wmHelp{margin:0;font-size:11px;color:#7f89a8;text-align:center}';
  document.head.appendChild(st);})();
const _wmHide=hideOverlays;hideOverlays=function(){_wmHide();const e=$('#wmOv');if(e)e.hidden=true;if(WORLD.map)WORLD.map.stop();};
const _wmClose=closeOverlays;closeOverlays=function(){if(overlay==='wm'){hideOverlays();return;}_wmClose();};
if(WORLD.on)(()=>{
  const G=new THREE.Group();G.name='cityWalls';scene.add(G);WORLD.g=G;
  const r=mulberry32(1829);
  const limeT=(()=>{const c=mk(16,16),x=c.getContext('2d');x.fillStyle='#d8c49a';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=4)for(let i=(j%8?3:0);i<16;i+=6){x.fillStyle=['#e2d0a8','#cdb88c','#d4c094','#e8d8b4','#c8b080'][(i*3+j)%5];x.fillRect(i,j,5,3);}x.fillStyle='rgba(120,100,70,.35)';for(let j=3;j<16;j+=4)x.fillRect(0,j,16,1);return c;})();
  const limeM=(rx,ry)=>{const t=ctex(limeT,{rep:[rx,ry]});return new THREE.MeshLambertMaterial({map:t});};
  const capM=new THREE.MeshLambertMaterial({color:0xe6d6b0}),roofM=new THREE.MeshLambertMaterial({color:0xb8562e}),darkM=new THREE.MeshLambertMaterial({color:0x2a2018});
  const mer=new THREE.BoxGeometry(.42,.34,.56);const merPos=[];
  const put=(geo,mat,x,y,z,ry)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;G.add(m);return m;};
  // a straight run of wall from (x1,z1) to (x2,z2), h high
  // Paul's photo: a limestone block retaining wall with a white picket fence on top (Look Lab ?fence until FENCE_LIVE)
  const FENCE=[],POSTS=[],blockT=(()=>{const c=mk(32,16),x=c.getContext('2d');x.fillStyle='#d8c290';x.fillRect(0,0,32,16);for(let j=0;j<2;j++)for(let i=0;i<2;i++){const ox=i*16+(j?8:0);x.fillStyle=['#e0cc9c','#d2b986','#dcc596','#cdb37e'][(i+j*2)%4];x.fillRect(ox%32,j*8,15,7);if(ox+15>32)x.fillRect(0,j*8,ox+15-32,7);
      for(let k=0;k<6;k++){x.fillStyle='rgba(150,120,70,.35)';x.fillRect((ox+((k*5)%14))%32,j*8+(k%3)*2+1,1,1);}}x.fillStyle='#b8a070';x.fillRect(0,7,32,1);x.fillRect(0,15,32,1);x.fillRect(15,0,1,7);x.fillRect(7,8,1,7);x.fillRect(23,8,1,7);return c;})();
  const whiteM=new THREE.MeshLambertMaterial({color:0xf6f6f2});
  function fenceRun(x1,z1,x2,z2,low){const L=Math.hypot(x2-x1,z2-z1);if(L<.3)return;const hz=Math.abs(z2-z1)<Math.abs(x2-x1),bh=low?.32:.5,fh=low?.62:.95,cxm=(x1+x2)/2,czm=(z1+z2)/2;
    const bm=new THREE.MeshLambertMaterial({map:ctex(blockT,{rep:[L/1.6,1]})});put(new THREE.BoxGeometry(hz?L:.55,bh,hz?.55:L),bm,cxm,bh/2,czm);put(new THREE.BoxGeometry(hz?L+.02:.6,.05,hz?.6:L+.02),new THREE.MeshLambertMaterial({color:0xcdb784}),cxm,bh+.025,czm);
    [fh*.12,fh*.62,fh*.94].forEach((y,i)=>put(new THREE.BoxGeometry(hz?L:.05,i===2?.07:.05,hz?.05:L),whiteM,cxm,bh+y,czm));
    const n=Math.max(1,Math.round(L/1.9));for(let k=0;k<=n;k++){const t=k/n;POSTS.push([x1+(x2-x1)*t,bh,z1+(z2-z1)*t,fh]);}
    for(let s=.07;s<L;s+=.16){const t=s/L;FENCE.push([x1+(x2-x1)*t,bh,z1+(z2-z1)*t,fh*.68,hz]);}}
  function run(x1,z1,x2,z2,h){if(FENCE_ON)return fenceRun(x1,z1,x2,z2,h<1.2);const L=Math.hypot(x2-x1,z2-z1);if(L<.3)return;const hz=Math.abs(z2-z1)<Math.abs(x2-x1);
    put(new THREE.BoxGeometry(hz?L:.5,h,hz?.5:L),limeM(L/1.6,h/1.6),(x1+x2)/2,h/2,(z1+z2)/2);put(new THREE.BoxGeometry(hz?L+.04:.6,.1,hz?.6:L+.04),capM,(x1+x2)/2,h+.05,(z1+z2)/2);
    for(let s=.35;s<L;s+=.9){const t=s/L;merPos.push([x1+(x2-x1)*t,h+.27,z1+(z2-z1)*t,hz?0:Math.PI/2]);}}
  // a gate: two round towers with tiled caps, an arch over the opening, a sign
  // a green freeway sign where the road leaves town (from Paul's photo): route shield, road name, towns and km, and a world map strip
  function roadSign(x,z,side,zone){const D=SIGN_DEF[zone+side];if(!D)return gate(x,z,side,zone);
    const c=mk(128,84),g=c.getContext('2d');g.fillStyle='#16673a';g.fillRect(0,0,128,84);g.strokeStyle='#f6f6f0';g.lineWidth=2;g.strokeRect(2,2,124,80);
    g.fillStyle='#f6f6f0';g.beginPath();g.moveTo(9,8);g.lineTo(25,8);g.lineTo(25,17);g.quadraticCurveTo(17,24,9,17);g.closePath();g.fill();g.fillStyle='#1d4e9a';g.beginPath();g.moveTo(10,9);g.lineTo(24,9);g.lineTo(24,16.5);g.quadraticCurveTo(17,22.5,10,16.5);g.closePath();g.fill();
    g.fillStyle='#f6f6f0';g.font='bold 8px monospace';g.textAlign='center';g.fillText(D.route,17,17);g.fillRect(30,9,90,11);g.fillStyle='#16673a';g.font='bold 8px monospace';g.fillText(D.road,75,17.5);
    g.textAlign='left';g.fillStyle='#f6f6f0';g.font='bold 9px monospace';D.to.forEach(([n,km],i)=>{g.fillText(n,10,34+i*11);g.textAlign='right';g.fillText(String(km),119,34+i*11);g.textAlign='left';});
    g.fillStyle='#ffd34d';g.fillRect(8,68,112,11);g.fillStyle='#141a2e';g.font='bold 8px monospace';g.textAlign='center';g.fillText(side==='w'?'← WORLD MAP':'WORLD MAP →',64,76.5);
    const tx=ctex(c);const grp=new THREE.Group();grp.position.set(x+(side==='w'?1.0:-1.0),0,z-1.6);G.add(grp);
    const panel=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.7,.08),[capM,capM,capM,capM,new THREE.MeshBasicMaterial({map:tx}),new THREE.MeshLambertMaterial({color:0x16673a})]);panel.position.y=2.15;panel.castShadow=true;grp.add(panel);
    const postM=new THREE.MeshLambertMaterial({color:0x9aa0a6});[-.85,.85].forEach(o=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.1,2.2,.1),postM);p.position.set(o,1.1,-.08);p.castShadow=true;grp.add(p);col(grp.position.x+o-.08,grp.position.z-.16,grp.position.x+o+.08,grp.position.z);});}
  function gate(x,z,side,zone){const g=new THREE.Group();g.position.set(x,0,z);G.add(g);const L=limeM(1.4,1.6);
    [-1.25,1.25].forEach(o=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.55,.62,2.6,10),L);t.position.set(0,1.3,o);t.castShadow=true;g.add(t);const c=new THREE.Mesh(new THREE.ConeGeometry(.72,.9,10),roofM);c.position.set(0,3.05,o);c.castShadow=true;g.add(c);
      const b=new THREE.Mesh(new THREE.CylinderGeometry(.66,.66,.12,10),capM);b.position.set(0,2.62,o);g.add(b);const w=new THREE.Mesh(new THREE.PlaneGeometry(.14,.4),darkM);w.position.set(0,1.8,o+.6);g.add(w);
      col(x-.6,z+o-.6,x+.6,z+o+.6);});
    const lin=new THREE.Mesh(new THREE.BoxGeometry(.6,.5,2),L);lin.position.set(0,2.2,0);lin.castShadow=true;g.add(lin);const ac=new THREE.Mesh(new THREE.TorusGeometry(.7,.09,6,12,Math.PI),capM);ac.rotation.y=Math.PI/2;ac.position.set(0,1.95,0);g.add(ac);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.4),new THREE.MeshBasicMaterial({map:makeSign([(side==='w'?'← ':'')+'WORLD MAP'+(side==='e'?' →':'')],64,12,'#5a3a22','#ffd34d'),side:THREE.DoubleSide}));sg.position.set(0,2.75,.05);g.add(sg);
    // a little banner of the town on each tower
    const ZC={sp:'#3e7d5c',freo:'#2a5a9a',hi:'#8a6a40',vp:'#c8344a',cbd:'#1d3a6e',air:'#2a9a8a'}[zone]||'#5a3a22';[-1.25,1.25].forEach(o=>{const f=new THREE.Mesh(new THREE.PlaneGeometry(.36,.7),new THREE.MeshLambertMaterial({color:new THREE.Color(ZC),side:THREE.DoubleSide}));f.position.set(side==='w'?.58:-.58,1.6,o);f.rotation.y=Math.PI/2;g.add(f);});}
  // work out each area's walkable land, then wall it in
  const ZS=['sp','freo','hi','vp','cbd'].concat(typeof AIR!=='undefined'&&AIR.on?['air']:[]);
  const GS=.5;
  // Kings Park: Riverside Drive carries on west along the bottom of the park as Mounts Bay Road; plants on it move aside
  if(SIGNS_ON){const asM=new THREE.MeshLambertMaterial({map:ctex(asphC,{rep:[11,1]})});const rd=new THREE.Mesh(new THREE.PlaneGeometry(22.4,2.2),asM);rd.rotation.x=-Math.PI/2;rd.position.set(611,.021,5);rd.receiveShadow=true;G.add(rd);
    for(let x=601;x<622;x+=2.4){const d=new THREE.Mesh(new THREE.PlaneGeometry(1,.08),new THREE.MeshLambertMaterial({color:0xf3f3ea}));d.rotation.x=-Math.PI/2;d.position.set(x,.026,5);G.add(d);}
    {const wp=new THREE.Vector3(),bx=new THREE.Box3(),sz=new THREE.Vector3(),mv=[];const ssx=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);
      const LAY=[scene,G,typeof CDET!=='undefined'&&CDET.g,typeof FDET!=='undefined'&&FDET.city,typeof FDET!=='undefined'&&FDET.g].filter(Boolean),seen=new Set();
      scene.traverse(o=>{if(!(o.isMesh||o.isSprite)||o===rd||o.parent===G)return;let c=o;while(c.parent&&!LAY.includes(c.parent))c=c.parent;if(seen.has(c))return;seen.add(c);o=c;
        bx.setFromObject(o);if(bx.isEmpty())return;bx.getSize(sz);if(sz.x>5||sz.z>5)return;if(bx.max.x<599.5||bx.min.x>622||bx.max.z<3.85||bx.min.z>6.15)return;mv.push([o,bx.getCenter(wp).z]);});
      mv.forEach(([o,cz])=>{const dz=cz<5?(3.7-bx.setFromObject(o).max.z):(6.3-bx.setFromObject(o).min.z);o.position.z+=dz;o.updateMatrixWorld(true);const t=trees.find(t=>t.m===o);if(t)t.z+=dz;});scene.scale.x=ssx;scene.updateMatrixWorld(true);}for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];if(c.x1>599&&c.x2<622&&c.z2>3.8&&c.z1<6.2&&c.x2-c.x1<3)colliders.splice(i,1);}}
  ZS.forEach(zone=>{const B=ZONE_B(zone);if(!B)return;const W=Math.ceil((B.x2-B.x1)/GS),H=Math.ceil((B.z2-B.z1)/GS);const ok=new Uint8Array(W*H),seen=new Uint8Array(W*H);
    const cx=i=>B.x1+(i+.5)*GS,cz=j=>B.z1+(j+.5)*GS;const walk=(i,j)=>{const x=cx(i),z=cz(j);return zoneOf(x)===zone&&!blocked(x,z);};
    const S0=(SAFE_SPOTS[zone]||[])[0]||(BUS_STOPS[zone]&&BUS_STOPS[zone].land);if(!S0)return;let si=Math.floor((S0[0]-B.x1)/GS),sj=Math.floor((S0[1]-B.z1)/GS);
    const q=[];if(si>=0&&sj>=0&&si<W&&sj<H){seen[sj*W+si]=1;if(walk(si,sj)){ok[sj*W+si]=1;q.push(sj*W+si);}}
    for(let h=0;h<q.length;h++){const c=q[h],i=c%W,j=(c/W)|0;for(const[di,dj]of[[1,0],[-1,0],[0,1],[0,-1]]){const ni=i+di,nj=j+dj;if(ni<0||nj<0||ni>=W||nj>=H)continue;const n=nj*W+ni;if(seen[n])continue;seen[n]=1;if(walk(ni,nj)){ok[n]=1;q.push(n);}}}
    let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,zs=[];for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(ok[j*W+i]){const x=cx(i),z=cz(j);x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z);zs.push(z);}
    if(!zs.length)return;zs.sort((a,b)=>a-b);const zmid=zs[zs.length>>1];
    // gates: the reachable cell furthest west (east), as close to the middle of the town as possible
    const RZ=SIGNS_ON?(ROAD_Z[zone]||{}):{};const pickGate=dir=>{let best=null;const edge=dir<0?x0:x1;const rz=RZ[dir<0?'w':'e'];for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(!ok[j*W+i])continue;const x=cx(i),z=cz(j);if(Math.abs(x-edge)>2.6)continue;
        let room=0;for(let k=-3;k<=3;k++){const jj=j+k;if(jj>=0&&jj<H&&ok[jj*W+i])room++;}if(room<5)continue;const sc=rz!=null?Math.abs(x-edge)*3+Math.abs(z-rz)*6:Math.abs(x-edge)*3+Math.abs(z-zmid)*.4;if(!best||sc<best.sc)best={x,z,sc};}return best;};
    const gw=pickGate(-1),ge=pickGate(1);const WZ={x0:x0-.25,x1:x1+.25,z0:z0-.25,z1:z1+.25,w:null,e:null};
    const pad=.55,wx0=x0-.25-pad,wx1=x1+.25+pad,wz0=z0-.25-pad,wz1=z1+.25+pad;
    // only wall the stretches where the town actually reaches the edge (land, not open water far away)
    const inside=(x,z,nx,nz)=>{for(let d=.6;d<=2.4;d+=.45){const px=x+nx*d,pz=z+nz*d;const i=Math.floor((px-B.x1)/GS),j=Math.floor((pz-B.z1)/GS);if(i>=0&&j>=0&&i<W&&j<H&&ok[j*W+i])return true;}return false;};
    const side=(ax,az,bx,bz,nx,nz,h,gap)=>{const L=Math.hypot(bx-ax,bz-az),n=Math.ceil(L/.5);let s0=null;
      for(let k=0;k<=n;k++){const t=k/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t;const inGap=gap&&Math.abs(z-gap.z)<1.85;const on=k<n&&!inGap&&inside(x,z,nx,nz);
        if(on&&s0==null)s0=[x,z];if(!on&&s0!=null){if(Math.hypot(x-s0[0],z-s0[1])>1.6)run(s0[0],s0[1],x,z,h);s0=null;}}};
    // on a road: the gate goes at the end of the road itself, even where the town reaches further out elsewhere
    const roadEnd=dir=>{const rz=RZ[dir<0?'w':'e'];if(rz==null)return null;let b=null;for(let j=0;j<H;j++){const z=cz(j);if(Math.abs(z-rz)>.5)continue;for(let i=0;i<W;i++){if(!ok[j*W+i])continue;const x=cx(i);if(!b||(dir<0?x<b.x:x>b.x))b={x,z};}}return b;};
    {const rw=roadEnd(-1),re=roadEnd(1);if(rw&&gw&&rw.x>x0+1.5){gw.z=rw.z;gw.x=rw.x-.8;gw.road=1;}if(re&&ge&&re.x<x1-1.5){ge.z=re.z;ge.x=re.x+.8;ge.road=1;}}
    if(gw){if(!gw.road)gw.x=wx0;WZ.w=gw;}if(ge){if(!ge.road)ge.x=wx1;WZ.e=ge;}
    side(wx0,wz0,wx1,wz0,0,1,1.7);// north
    side(wx0,wz1,wx1,wz1,0,-1,.95);// south: low, so it never hides Kip from the camera
    side(wx0,wz0,wx0,wz1,1,0,1.7,gw);side(wx1,wz0,wx1,wz1,-1,0,1.7,ge);
    if(gw)(SIGNS_ON?roadSign:gate)(gw.x,gw.z,'w',zone);if(ge)(SIGNS_ON?roadSign:gate)(ge.x,ge.z,'e',zone);
    WORLD.walls[zone]=WZ;});
  if(FENCE.length){const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.045,1,.045),whiteM,FENCE.length);const o=new THREE.Object3D();FENCE.forEach(([x,y,z,h],i)=>{o.position.set(x,y+h*.1+h/2,z);o.scale.set(1,h,1);o.rotation.set(0,0,0);o.updateMatrix();im.setMatrixAt(i,o.matrix);});im.castShadow=true;G.add(im);
    const ip=new THREE.InstancedMesh(new THREE.BoxGeometry(.13,1,.13),whiteM,POSTS.length);const ic=new THREE.InstancedMesh(new THREE.BoxGeometry(.17,.06,.17),whiteM,POSTS.length);POSTS.forEach(([x,y,z,h],i)=>{o.position.set(x,y+(h+.08)/2,z);o.scale.set(1,h+.08,1);o.updateMatrix();ip.setMatrixAt(i,o.matrix);o.position.set(x,y+h+.1,z);o.scale.set(1,1,1);o.updateMatrix();ic.setMatrixAt(i,o.matrix);});ip.castShadow=true;G.add(ip,ic);}
  if(merPos.length){const im=new THREE.InstancedMesh(mer,capM,merPos.length);const o=new THREE.Object3D();merPos.forEach(([x,y,z,ry],i)=>{o.position.set(x,y,z);o.rotation.set(0,ry,0);o.updateMatrix();im.setMatrixAt(i,o.matrix);});im.castShadow=true;G.add(im);}
  // ---- gate actions and the trip ----
  const ZN={sp:'South Perth',freo:'Fremantle',hi:'Heirisson Island',vp:'Victoria Park',cbd:'Perth CBD',air:'Perth Airport',island:'Rottnest Island'};
  const _t=cbdTargets;cbdTargets=function(T){_t(T);const z=zoneOf(player.x),W=WORLD.walls[z];if(!W)return;
    ['w','e'].forEach(sd=>{const g=W[sd];if(!g)return;const ix=sd==='w'?g.x+1.15:g.x-1.15;T.push({x:ix,z:g.z,r:1.5,label:(sd==='w'?'West':'East')+' gate · out to the world map',act:()=>openWorld(z,sd)});});
    if(z==='island')return;};
  // Rottnest has no wall: the jetty takes you out to the map
  const _t2=cbdTargets;cbdTargets=function(T){_t2(T);if(zoneOf(player.x)!=='island')return;const J=IW(-16,4.4),L=[J.x+1.7,J.z];const ok=typeof freoUnlocked!=='function'||freoUnlocked();T.push({x:L[0],z:L[1],r:1.1,label:ok?'World map · drive off the ferry':'World map: locked (see Quests)',disabled:!ok,act:()=>{if(ok)openWorld('island','e');}});};
  window.openWorld=function(from,side){if(transit||VISIT||(overlay&&overlay!=='wm'))return;transit=true;fadeTarget=.95;
    setTimeout(()=>{transit=false;fadeTarget=0;overlay='wm';ui.hud.hidden=true;ui.act.hidden=true;$('#wmOv').hidden=false;WORLD.map.start(from,side);},500);};
  function enter(id,side){if(id!=='island'&&id!=='sp'&&id!=='hi'){if(needPass(id==='air'?'cbd':id))return;}
    WORLD.map.stop();$('#wmOv').hidden=true;overlay=null;transit=true;fadeTarget=.95;toast('Driving into '+ZN[id]+'…',1.6);
    setTimeout(()=>{S.time+=15;player.bike=false;player.carry=null;const W=WORLD.walls[id];let x,z;
      if(id==='island'){const J=IW(-16,4.4);x=J.x+1.7;z=J.z+.8;}else if(W&&W[side]){const g=W[side];x=side==='w'?g.x+1.4:g.x-1.4;z=g.z;}else{[x,z]=SAFE_SPOTS[id][0];}
      player.x=x;player.z=z;updateCamera(0,true);hideOverlays();fadeTarget=0;transit=false;S.seenZ=S.seenZ||{};S.seenZ[id]=1;if(id==='cbd'&&typeof cbdArrive==='function')cbdArrive('cbd');save();},700);}
  WORLD.map=wmBuild($('#wmCv'),{carSprite:()=>{const c=typeof carSel==='function'&&carSel();return c&&typeof CAR_SPR!=='undefined'?CAR_SPR[c]:null;},carSpeed:()=>{const c=typeof carSel==='function'&&carSel();const d=c&&typeof DEALER_STOCK!=='undefined'&&DEALER_STOCK.find(q=>q[0]===c);return d?d[2]:38;},air:typeof AIR!=='undefined'&&AIR.on,el:{name:$('#wmName'),note:$('#wmNote'),act:$('#wmAct'),tabP:$('#wmTabP'),tabA:$('#wmTabA')},
    side:(id,pref)=>{if(id==='island')return 'w';const W=WORLD.walls[id];if(!W)return pref;return W[pref]?pref:(W.w?'w':'e');},enter});
  $('#wmBack').onclick=()=>hideOverlays();
})();

})();
