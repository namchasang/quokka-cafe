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
const riders=[];const riderCv=!CHAR2_ON?['#e45a5a','#3f86d6','#f1c64a','#5bb48a'].map((sh,i)=>{const c=mk(24,27),x=c.getContext('2d');x.drawImage(bikeCanvas(['#2f7fd0','#e2584f','#f1c64a','#5bb48a'][i]),0,13);
  const top=pix(HU_HEAD.concat(HU_REST.slice(0,9)),{o:'#2a1d1a',h:['#2a1d16','#d9b25a','#6b4226','#1b1b2b'][i],s:['#f1c7a0','#c68a5e','#e2b48a','#8d5a3b'][i],e:'#1a1010',t:sh});x.drawImage(top,6,1);return c;}):['#e45a5a','#3f86d6','#f1c64a','#5bb48a'].map((sh,i)=>{
  // cyclists are drawn like everyone else (Paul, Nov 2026): the same side-view person as the walkers, sitting on a bike drawn at the same pixel size
  const c=mk(54,62),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(bikeCanvas(['#2f7fd0','#e2584f','#f1c64a','#5bb48a'][i]),3,33,48,28);
  const v={skin:['#f1c7a0','#c68a5e','#e2b48a','#8d5a3b'][i],hair:['#2a1d16','#d9b25a','#6b4226','#1b1b2b'][i],shirt:sh,pants:['#2f3b5c','#3a3a40','#5a4a3a','#2a2a30'][i],hat:i===1?'#f3e2b0':null};
  const body=humanSide(v,1);
  // legs: thigh forward to the pedal, shin down; then the head and body from the walker sprite, cut at the waist
  const L=(ax,ay,bx,by,w,col)=>{const n=Math.ceil(Math.hypot(bx-ax,by-ay));for(let k=0;k<=n;k++){const t=k/n;x.fillStyle=col;x.fillRect(Math.round(ax+(bx-ax)*t-w/2),Math.round(ay+(by-ay)*t-w/2),w,w);}};
  const pd=v.pants,pk='#1a1414';L(24,32,33,38,5,pk);L(33,38,30,51,5,pk);L(24,32,33,38,3,pd);L(33,38,30,51,3,pd);x.fillStyle='#2a2a30';x.fillRect(28,51,5,2);
  x.drawImage(body,0,0,32,30,10,4,32,30);
  // arms reach to the handlebar
  L(25,24,39,32,3,'#1a1414');L(25,24,39,32,2,v.skin);
  return c;});
