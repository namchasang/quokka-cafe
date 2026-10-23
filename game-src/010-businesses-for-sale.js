// ---------- businesses for sale ----------
const BIZ=[
 {id:'bikes',name:'Kip’s Pedal Hire',short:'Pedal Hire',price:150,desc:'A bike rental shed by the jetty. About half of each ferry wave hires a bike to ride the island’s cycle paths.',income:'5 coins per bike hired'},
 {id:'ice',name:'Rotto Scoops',short:'Rotto Scoops',price:200,desc:'A vintage ice-cream caravan near the beach. Sells more on hot days. Stock it with strawberries or nectarines from your garden for a fruit special.',income:'3 coins a scoop, 7 for a fruit special'}];
const BIZ_BY={};BIZ.forEach(b=>BIZ_BY[b.id]=b);
const bizMesh={};
function forSale(x,z,price){const g=new THREE.Group();const post=new THREE.Mesh(new THREE.BoxGeometry(.1,1.4,.1),legMat);post.position.y=.7;post.castShadow=true;g.add(post);
  const t=makeSign(['FOR SALE',price+' COINS'],48,22,'#f5ecd8','#c8344a');const b=new THREE.Mesh(new THREE.PlaneGeometry(1.05,.48),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide,emissive:0x222222,emissiveMap:t}));b.position.set(0,1.2,.06);b.castShadow=true;g.add(b);
  [[-1.3,-1],[1.3,-1],[-1.3,.6],[1.3,.6]].forEach(([a,c])=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.06,.35,.06),new THREE.MeshLambertMaterial({color:0xd9c08a}));s.position.set(a,.17,c);g.add(s);});
  g.position.set(x,0,z+.9);scene.add(g);return g;}
// Pedal Hire shed
(()=>{const L=LOTS.bikes,g=new THREE.Group();const wall=new THREE.Mesh(new THREE.BoxGeometry(3,1.9,1.6),lmat(plasterC,[2,2],{color:new THREE.Color('#7fb0e0')}));wall.position.set(0,.95,-.3);wall.castShadow=wall.receiveShadow=true;g.add(wall);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(3.4,.14,2.1),new THREE.MeshLambertMaterial({color:0x2f5a8a}));roof.position.set(0,2.02,-.15);roof.rotation.x=.18;roof.castShadow=true;g.add(roof);
  const ac=mk(16,16),ax=ac.getContext('2d');for(let i=0;i<4;i++){ax.fillStyle=i%2?'#f6ead2':'#2f6fb0';ax.fillRect(i*4,0,4,16);}const aw=new THREE.Mesh(new THREE.BoxGeometry(3.2,.1,1),lmat(ac,[4,1]));aw.position.set(0,1.62,.85);aw.rotation.x=.3;aw.castShadow=true;g.add(aw);
  const ctr=new THREE.Mesh(new THREE.BoxGeometry(1.6,.8,.4),lmat(counterC,[2,1]));ctr.position.set(-.5,.4,.65);ctr.castShadow=true;g.add(ctr);
  const sgT=makeSign(['PEDAL HIRE'],56,12,'#2c3b58','#f5ecd8');const sg=new THREE.Mesh(new THREE.PlaneGeometry(2,.42),new THREE.MeshLambertMaterial({map:sgT,emissive:0x333333,emissiveMap:sgT}));sg.position.set(0,1.5,.52);g.add(sg);
  g.position.set(L.x,0,L.z);scene.add(g);g.visible=false;
  const bikes=['#2f7fd0','#e2584f','#f1c64a','#5bb48a'].map((c,i)=>{const b=spriteMesh([bikeCanvas(c)],1.5,.9);b.position.set(L.x+1.9+(i%2)*.15,0,L.z-.9+i*.55);b.visible=false;scene.add(b);return b;});
  const att=spriteMesh(humanFrames({hair:'#d9b25a',skin:'#f1c7a0',shirt:'#2f6fb0',pants:'#2f3b5c',hat:'#f3e2b0'}),.9,1.5);att.position.set(L.x-.5,0,L.z+.15);att.visible=false;scene.add(att);
  bizMesh.bikes={g,extra:bikes.concat([att]),sale:forSale(L.x,L.z,150)};})();
// Rotto Scoops caravan
(()=>{const L=LOTS.ice,g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(2.8,1.5,1.5),new THREE.MeshLambertMaterial({color:0x9ed8c8}));body.position.set(0,1.05,-.2);body.castShadow=body.receiveShadow=true;g.add(body);
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,2.8,16,1,false,0,Math.PI),new THREE.MeshLambertMaterial({color:0xf6f2e8}));roof.rotation.z=Math.PI/2;roof.position.set(0,1.8,-.2);roof.scale.set(1,1,.6);roof.castShadow=true;g.add(roof);
  const stripe=new THREE.Mesh(new THREE.BoxGeometry(2.82,.18,1.52),new THREE.MeshLambertMaterial({color:0xef7d9a}));stripe.position.set(0,.5,-.2);g.add(stripe);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.6),new THREE.MeshLambertMaterial({color:0x2a3048}));win.position.set(-.2,1.25,.56);g.add(win);
  const pc=mk(16,16),px=pc.getContext('2d');for(let i=0;i<4;i++){px.fillStyle=i%2?'#ffffff':'#ef7d9a';px.fillRect(i*4,0,4,16);}const aw=new THREE.Mesh(new THREE.BoxGeometry(2.2,.08,.8),lmat(pc,[4,1]));aw.position.set(-.2,1.72,.85);aw.rotation.x=.35;aw.castShadow=true;g.add(aw);
  [-.9,.9].forEach(w=>{const wh=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.14,12),new THREE.MeshLambertMaterial({color:0x2b2b30}));wh.rotation.x=Math.PI/2;wh.position.set(w,.28,.56);g.add(wh);});
  const sgT=makeSign(['ROTTO SCOOPS'],60,12,'#ef7d9a','#ffffff');const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.42),new THREE.MeshLambertMaterial({map:sgT,emissive:0x333333,emissiveMap:sgT}));sg.position.set(-.2,.85,.56);g.add(sg);
  g.position.set(L.x,0,L.z);scene.add(g);g.visible=false;
  const cone=(()=>{const c=mk(12,20),x=c.getContext('2d');x.fillStyle='#d9a05a';for(let j=10;j<20;j++){const w=Math.round((20-j)*.45);x.fillRect(6-w,j,w*2,1);}x.fillStyle='#b07a3a';for(let j=11;j<20;j+=2)x.fillRect(4,j,4,1);x.fillStyle='#f6b8c8';x.fillRect(2,5,8,6);x.fillRect(3,4,6,1);x.fillStyle='#fff3e0';x.fillRect(3,1,6,4);x.fillRect(4,0,4,1);x.fillStyle='#e8344a';x.fillRect(5,0,2,1);return outlineCanvas(c,[60,30,20]);})();
  const cm=spriteMesh([cone],.75,1.25,{shadow:true});cm.position.set(L.x+1.15,1.95,L.z-.2);cm.visible=false;scene.add(cm);
  const att=spriteMesh(humanFrames({hair:'#9b3b22',skin:'#e2b48a',shirt:'#ef7d9a',pants:'#c9b68a',hat:null}),.9,1.5);att.position.set(L.x+1.6,0,L.z+.9);att.visible=false;scene.add(att);
  bizMesh.ice={g,extra:[cm,att],sale:forSale(L.x,L.z,200)};})();
col(LOTS.bikes.x-1.6,LOTS.bikes.z-1.2,LOTS.bikes.x+1.6,LOTS.bikes.z+.55);col(LOTS.ice.x-1.5,LOTS.ice.z-1,LOTS.ice.x+1.5,LOTS.ice.z+.6);
function applyBiz(){BIZ.forEach(b=>{const own=!!(S.biz&&S.biz[b.id]&&S.biz[b.id].own);const m=bizMesh[b.id];m.g.visible=own;m.extra.forEach(e=>e.visible=own);m.sale.visible=!own;});}
// tourists riding hired bikes along the island path
const riders=[];const riderCv=['#e45a5a','#3f86d6','#f1c64a','#5bb48a'].map((sh,i)=>{const c=mk(24,27),x=c.getContext('2d');x.drawImage(bikeCanvas(['#2f7fd0','#e2584f','#f1c64a','#5bb48a'][i]),0,13);
  const top=pix(HU_HEAD.concat(HU_REST.slice(0,9)),{o:'#2a1d1a',h:['#2a1d16','#d9b25a','#6b4226','#1b1b2b'][i],s:['#f1c7a0','#c68a5e','#e2b48a','#8d5a3b'][i],e:'#1a1010',t:sh});x.drawImage(top,6,1);return c;});
// ---- bike lane in front of the café: cyclists ride here, never across the deck ----
const BIKE_LANE=[[-12.5,4.6],[9.6,4.6],[13,1.2],[18,.9]];const BLANES=[];let laneStrip=()=>{};
(()=>{const c=mk(64,32),x=c.getContext('2d');x.fillStyle='#b5523b';x.fillRect(0,0,64,32);const r=mulberry32(55);for(let i=0;i<120;i++){x.fillStyle=r()<.5?'#a8472f':'#c25f46';x.fillRect(r()*64|0,r()*32|0,2,2);}
  x.fillStyle='#f6efe0';x.fillRect(0,1,64,2);x.fillRect(0,29,64,2);for(let i=0;i<64;i+=16)x.fillRect(i,15,9,2);
  const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.wrapS=THREE.RepeatWrapping;
  const ic=mk(32,32),ix=ic.getContext('2d');ix.fillStyle='#f6efe0';const ring=(cx,cy)=>{ix.fillRect(cx-4,cy-1,8,2);ix.fillRect(cx-1,cy-4,2,8);ix.fillRect(cx-3,cy-3,2,2);ix.fillRect(cx+1,cy-3,2,2);ix.fillRect(cx-3,cy+1,2,2);ix.fillRect(cx+1,cy+1,2,2);};
  ring(8,20);ring(24,20);ix.fillRect(8,12,10,2);ix.fillRect(16,12,2,8);ix.fillRect(12,10,8,2);ix.fillRect(20,10,2,10);ix.fillRect(22,9,4,2);
  const itex=new THREE.CanvasTexture(ic);itex.magFilter=THREE.NearestFilter;const imat=new THREE.MeshLambertMaterial({map:itex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6});
  laneStrip=(a,b,w,icons,y)=>{w=w||1.15;y=y||.021;const len=Math.hypot(b[0]-a[0],b[1]-a[1]);const t=tex.clone();t.needsUpdate=true;t.repeat.set(len/2,1);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(len,w),w<.9?new THREE.MeshLambertMaterial({color:0xc4573e,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}):new THREE.MeshLambertMaterial({map:t}));m.rotation.x=-Math.PI/2;m.rotation.z=-Math.atan2(b[1]-a[1],b[0]-a[0]);m.position.set((a[0]+b[0])/2,y,(a[1]+b[1])/2);m.receiveShadow=true;scene.add(m);if(w<.9)for(let d=2;d<len-1;d+=6){const k=d/len;const q=new THREE.Mesh(new THREE.PlaneGeometry(.5,.5),imat);q.rotation.x=-Math.PI/2;q.rotation.z=-Math.atan2(b[1]-a[1],b[0]-a[0]);q.scale.setScalar(Math.min(1,w/.5));q.position.set(a[0]+(b[0]-a[0])*k,y+.004,a[1]+(b[1]-a[1])*k);scene.add(q);}BLANES.push([a,b,w]);
    if(icons!==false&&w>.9&&len>8)for(let d=3;d<len-1;d+=7){const k=d/len;const q=new THREE.Mesh(new THREE.PlaneGeometry(.8,.8),imat);q.rotation.x=-Math.PI/2;q.rotation.z=-Math.atan2(b[1]-a[1],b[0]-a[0]);q.position.set(a[0]+(b[0]-a[0])*k,y+.005,a[1]+(b[1]-a[1])*k);scene.add(q);}};
  const run=(pts,w,icons,y)=>{for(let i=0;i<pts.length-1;i++)laneStrip(pts[i],pts[i+1],w,icons,y);};
  run(BIKE_LANE);
  // Rottnest: on along the main road and out to Geordie Bay
  run([[18,.9],[31,.3],[36,1.2],[40.5,-1.2],[45.4,-2.6],[50,-1.2],[58,-.2],[68,.4],[80,1],[91,1.6]]);
  // South Perth: foreshore shared path, and painted lanes on both sides of Mill Point Road
  [[[103,-.9],[117.5,-.9]],[[124.5,-.9],[141.8,-.9]],[[156,-.9],[198,-.9]]].forEach(p=>run(p));
  run([[113,21.25],[200,21.25]],.46,false,.03);run([[113,23.15],[200,23.15]],.46,false,.03);
  // Heirisson Island: lane beside the main path
  run([[405,4],[432,4]]);
  // Fremantle: painted lanes along the streets
  run([[278.5,-2.75],[320.5,-2.75]],.36,false,.03);run([[278.5,-1.25],[320.5,-1.25]],.36,false,.03);run([[280,5.15],[304,5.15]],.34,false,.03);run([[304,21.05],[334,21.05]],.34,false,.03);
  run([[302.95,-3],[302.95,21]],.36,false,.03);run([[305.05,-3],[305.05,21]],.36,false,.03);
  // Victoria Park: painted lanes on both sides of Albany Highway
  run([[489,-.92],[561,-.92]],.46,false,.03);run([[489,.92],[561,.92]],.46,false,.03);})();
function spawnRider(){if(riders.length>=6)return;const m=spriteMesh([riderCv[riders.length%4]],1.6,1.8);scene.add(m);riders.push({m,x:-12.5,z:4.6,path:[[9.6,4.6],[13,1.2],[18,.9],[31,.3],[35,3.5]],walkT:0,face:1});}

