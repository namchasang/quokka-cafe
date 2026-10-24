// ========== the rest of Rottnest: North Coast, Oliver Hill, South Coast, West End ==========
const WEST={};
(()=>{const M=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  // Geordie Bay holiday cottages, store and moored boats
  [[54.5,'#efe3c4','#3f7a5a'],[57,'#f2e6c8','#c9473f'],[63.4,'#e8d2a6','#2f78a8'],[66,'#efe3c4','#c9473f']].forEach(([x,w,rf])=>{const g=bld(x,-3.5,2.2,1.8,1.4,w,{roof:rf,roofH:.8,noCol:true});col(x-1.1,-4.4,x+1.1,-2.6);});
  bld(61.4,-2.9,2,1.4,1.6,'#fff3d6',{ver:'#2f78a8',sign:'BAYSIDE STORE',signBg:'#2f78a8'});
  WEST.boats=[[60,-7.4],[61.8,-8],[59,-8.3]].map(([x,z],i)=>{const g=new THREE.Group();const h=new THREE.Mesh(new THREE.BoxGeometry(1.6,.35,.7),M(['#f6f6f0','#2f78a8','#f1c64a'][i]));h.position.y=.05;g.add(h);const c=new THREE.Mesh(new THREE.BoxGeometry(.6,.35,.5),M('#f6f2e8'));c.position.set(-.2,.38,0);g.add(c);const m=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.4,5),legMat);m.position.set(.3,.8,0);g.add(m);g.position.set(x,-.12,z);g.rotation.y=i*.5;scene.add(g);return{g,x,z,ph:i*1.3};});
  box(.9,.12,2.6,lmat(deckC,[1,2]),60.4,.02,-5.4,{noCast:true});
  // Oliver Hill battery and the train terminus
  const hill=new THREE.Mesh(new THREE.ConeGeometry(3.2,1,18),lmat(grassC,[2,2]));hill.position.set(56.6,.35,3.6);hill.scale.y=.8;hill.receiveShadow=true;scene.add(hill);col(55.2,2.4,58,4.8);
  const gun=new THREE.Group();const gb=new THREE.Mesh(new THREE.CylinderGeometry(.85,.95,.45,14),M('#6a6e76'));gb.position.y=.22;gun.add(gb);const gt=new THREE.Mesh(new THREE.BoxGeometry(1.1,.6,1),M('#5a6a4a'));gt.position.y=.7;gun.add(gt);const br=new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,3,10),M('#4a5a3a'));br.rotation.z=Math.PI/2-.12;br.position.set(1.6,.95,0);gun.add(br);gun.position.set(56.6,.75,3.6);gun.rotation.y=-.6;gun.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(gun);
  signPost(54.2,4.8,makeSign(['OLIVER HILL','BATTERY'],52,20,'#4a5a3a','#f5ecd8'),1,.5);
  box(3.4,.3,1.2,lmat(stoneC,[2,1]),54.6,.15,1.2);signPost(53.2,.5,makeSign(['OLIVER HILL STN'],56,12,'#1f5a3a','#f5ecd8'),1.6,.3);col(52.9,.6,56.3,1.8);
  box(3.4,.3,1.2,lmat(stoneC,[2,1]),14.2,.15,-4.6);signPost(12.6,-5.2,makeSign(['SETTLEMENT STN'],56,12,'#1f5a3a','#f5ecd8'),1.6,.3);col(12.5,-5.2,15.9,-4);
  // rails along the train line
  const RAIL=[[15.8,-3.6],[24,-3.4],[36,1.6],[48,2.8],[53,1.8]];const tieM=M('#5a3a22'),railM=M('#9aa0a8');
  const buildRail=RAIL=>{const n0=scene.children.length;for(let i=0;i<RAIL.length-1;i++){const [ax,az]=RAIL[i],[bx,bz]=RAIL[i+1];const len=Math.hypot(bx-ax,bz-az),ang=Math.atan2(bz-az,bx-ax);
    for(let s=0;s<len;s+=.7){const t=new THREE.Mesh(new THREE.BoxGeometry(.18,.05,1),tieM);t.position.set(ax+Math.cos(ang)*s,.03,az+Math.sin(ang)*s);t.rotation.y=-ang;scene.add(t);}
    [-.32,.32].forEach(o=>{const r=new THREE.Mesh(new THREE.BoxGeometry(len,.06,.06),railM);r.position.set((ax+bx)/2-Math.sin(ang)*o,.07,(az+bz)/2+Math.cos(ang)*o);r.rotation.y=-ang;scene.add(r);});}return scene.children.slice(n0);};
  {const ms=buildRail(RAIL);ms.forEach(m=>m.__noWarp=true);ISL.rail={pts:RAIL.map(p=>p.slice()),meshes:ms,build:buildRail};}
  WEST.rail=RAIL;const tr=new THREE.Group();[0,1,2].forEach(i=>{const c=new THREE.Mesh(new THREE.BoxGeometry(1.7,.9,.9),M(i?'#f1c64a':'#1f5a3a'));c.position.set(-i*1.85,.6,0);c.castShadow=true;tr.add(c);const rf=new THREE.Mesh(new THREE.BoxGeometry(1.8,.1,1),M('#c8344a'));rf.position.set(-i*1.85,1.1,0);tr.add(rf);if(!i){const ch=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.4,8),M('#2a2a30'));ch.position.set(.5,1.3,0);tr.add(ch);}});scene.add(tr);WEST.train=tr;
  // Parker Point, Little Salmon Bay, Strickland Bay
  signPost(62.5,5.6,makeSign(['PARKER POINT','SNORKEL TRAIL'],56,20,'#2f78a8','#ffffff'),1,.5);signPost(70.6,5,makeSign(['LITTLE SALMON','BAY'],56,20,'#2f78a8','#ffffff'),1,.5);signPost(82.6,5.4,makeSign(['STRICKLAND','BAY · SURF'],52,20,'#e8735a','#ffffff'),1,.5);
  WEST.snork=[[62.4,9.4],[63.6,9.8],[70,9.6],[71.4,10.2]].map(([x,z],i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.14,8,8),M(['#f1c64a','#e8735a','#2f78a8','#c8344a'][i]));scene.add(m);const s=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.3,5),M('#f1c64a'));scene.add(s);return{m,s,x,z,ph:i};});
  const surfPal={o:'#1a1410',s:'#f1c7a0',w:'#2a2a30',b:'#f6f2e8',r:'#e8735a'};
  WEST.surfers=[0,1].map(i=>{const m=spriteMesh([pix(["....oo....","...osso...","...osso....","....ww....","..owwwwo..","...wwww...","...w..w...","rrrrrrrrrr",".bbbbbbbb."],surfPal)],.9,.9,{shadow:false});scene.add(m);return{m,ph:i*3};});
  [[70.6,7.4],[71.8,7.6]].forEach(([x,z],i)=>{const u=new THREE.Mesh(new THREE.ConeGeometry(.9,.4,8),M(i?'#f1c64a':'#e8735a'));u.position.set(x,1.8,z);u.castShadow=true;scene.add(u);box(.05,1.8,.05,legMat,x,.9,z);});
  // Cape Vlamingh boardwalk, memorial and the fur seals at Cathedral Rocks
  box(5.4,.14,1.2,lmat(deckC,[5,1]),93.9,.1,.4,{noCast:true});box(3,.14,3,lmat(deckC,[3,3]),97.4,.1,.4,{noCast:true});
  for(let i=0;i<=10;i++){[-1.1,1.9].forEach(z=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.7,.06),fenceMat);p.position.set(96+i*.3,.45,z);scene.add(p);});}
  [-1.1,1.9].forEach(z=>box(3,.06,.06,fenceMat,97.5,.78,z));
  box(.9,1,.5,lmat(stoneC,[1,1]),95.6,.5,-1.4);signPost(94.4,-1.4,makeSign(['VLAMINGH','MEMORIAL'],48,20,'#3a2a20','#f5ecd8'),1,.4);col(95.1,-1.7,96.1,-1.1);
  [[93.6,5.6],[95.2,6],[96.6,5.2],[94.4,6.8]].forEach(([x,z],i)=>{const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.7+i*.15),M('#8a8478'));r.position.set(x,-.15,z);r.scale.y=.5;scene.add(r);});
  const sealPal={o:'#1d1612',b:'#5a4a40',l:'#7a6656',e:'#0a0a0a',w:'#ffffff'};
  WEST.seals=[[93.6,5.6],[95.2,6],[96.6,5.2]].map(([x,z],i)=>{const m=spriteMesh([pix(["............","......ooo...",".....oblbo..","....obblweo.","...obbbbbbo.","..obbbllbbo.",".obbbbbbbo..","obbbbbbbo...",".oooooooo...."],sealPal)],.9,.6);m.position.set(x,.25,z);if(i%2)m.scale.x=-1;scene.add(m);return{m,ph:i};});
  signPost(47.2,-2.6,makeSign(['ISLAND LOOP','22 KM →'],48,20,'#c8344a','#ffffff'),1,.5);signPost(89.6,1.8,makeSign(['WEST END','CAPE VLAMINGH'],56,20,'#3a2a20','#f5ecd8'),1,.5);})();
// Quokka Coach bus stops around the island
const COACH=[{id:'settle',name:'Settlement',x:10.4,z:-1.8},{id:'basin',name:'The Basin',x:22,z:-6.6},{id:'light',name:'Rottnest Lighthouse',x:32.2,z:-4.6},{id:'geordie',name:'Geordie Bay',x:59.4,z:-2.6},{id:'salmon',name:'Little Salmon Bay',x:71.2,z:.8},{id:'west',name:'West End',x:89.6,z:-.6}];
window.__coachMeshes=[];COACH.forEach(b=>{const p=box(.1,2.2,.1,new THREE.MeshLambertMaterial({color:0x1f5fae}),b.x,1.1,b.z);const s=new THREE.Mesh(new THREE.PlaneGeometry(.75,.75),new THREE.MeshBasicMaterial({map:makeSign(['BUS'],24,24,'#1f5fae','#ffffff'),side:THREE.DoubleSide}));s.position.set(b.x,2,b.z+.06);scene.add(s);window.__coachMeshes.push(p,s);});

