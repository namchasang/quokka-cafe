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
    [-.32,.32].forEach(o=>{const r=new THREE.Mesh(new THREE.BoxGeometry(len+.12,.06,.06),railM);r.position.set((ax+bx)/2-Math.sin(ang)*o,.07,(az+bz)/2+Math.cos(ang)*o);r.rotation.y=-ang;scene.add(r);});}return scene.children.slice(n0);};
  {const ms=buildRail(RAIL);ms.forEach(m=>m.__noWarp=true);ISL.rail={pts:RAIL.map(p=>p.slice()),meshes:ms,build:buildRail};}
  WEST.rail=RAIL;const tr=new THREE.Group();[0,1,2].forEach(i=>{const c=new THREE.Mesh(new THREE.BoxGeometry(1.7,.9,.9),M(i?'#f1c64a':'#1f5a3a'));c.position.set(-i*1.85,.6,0);c.castShadow=true;tr.add(c);const rf=new THREE.Mesh(new THREE.BoxGeometry(1.8,.1,1),M('#c8344a'));rf.position.set(-i*1.85,1.1,0);tr.add(rf);if(!i){const ch=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.4,8),M('#2a2a30'));ch.position.set(.5,1.3,0);tr.add(ch);}});if(TOON_SAND){// ?toon (Paul, Nov 2026, from his photo): the island's heritage railcar, red below and cream above, a rounded roof,
    // two big front windows, open sides with a blue canopy edge; a second matching car behind. Front at +x.
    tr.children.slice().forEach(c=>tr.remove(c));const L=c=>new THREE.MeshLambertMaterial({color:c}),RD=L(0xc23a24),CR=L(0xf4efe2),RF=L(0xf0d8cc),BL=L(0x3a78c8),DK=L(0x23262b),GL=L(0x7fa8c0),ST=L(0x8a8e94);
    [0,1].forEach(i=>{const g=new THREE.Group();g.position.x=-i*3.55;tr.add(g);const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;};
      add(new THREE.BoxGeometry(3.4,.5,.92),RD,0,.62,0);add(new THREE.BoxGeometry(3.42,.05,.94),CR,0,.89,0);
      const cab=i===0?.7:0;if(cab)add(new THREE.BoxGeometry(cab,.62,.92),CR,1.35,1.2,0);
      [-1,1].forEach(sd=>{for(let k=0;k<5;k++){add(new THREE.BoxGeometry(.06,.62,.06),CR,-1.6+k*.62+(cab?0:.3),1.2,sd*.43);}add(new THREE.BoxGeometry(3.4,.12,.04),BL,0,1.46,sd*.47);});
      if(cab){add(new THREE.BoxGeometry(.02,.36,.3),GL,1.71,1.24,-.2);add(new THREE.BoxGeometry(.02,.36,.3),GL,1.71,1.24,.2);add(new THREE.CylinderGeometry(.06,.06,.03,10),CR,1.72,.72,0).rotation.z=Math.PI/2;}
      const rg=new THREE.CylinderGeometry(.5,.5,3.5,18);rg.rotateZ(Math.PI/2);const roof=add(rg,RF,0,1.52,0);roof.scale.set(1,.26,1);add(new THREE.BoxGeometry(3.5,.06,1),RF,0,1.5,0);
      add(new THREE.BoxGeometry(3.3,.22,.7),DK,0,.27,0);[-1,1].forEach(e=>add(new THREE.BoxGeometry(.7,.18,.86),ST,e*1.05,.2,0));
      if(i===0)add(new THREE.BoxGeometry(.25,.1,.95),DK,1.78,.32,0);});
    // the second car is its own body that follows the rails behind the first (Paul: each car turns on the track by itself)
    {const car2=tr.children[1];tr.remove(car2);car2.position.set(0,0,0);scene.add(car2);WEST.car2=car2;const GAP=3.55,F=new THREE.Vector3();
      const proj=(x,z)=>{const R=WEST.rail;let best=null,acc=0;for(let i=0;i<R.length-1;i++){const a=R[i],b=R[i+1],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz)||1e-6;let t=((x-a[0])*dx+(z-a[1])*dz)/(L*L);t=Math.max(0,Math.min(1,t));const px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(x-px,z-pz);if(!best||d<best.d)best={d,s:acc+L*t,tx:dx/L,tz:dz/L};acc+=L;}best.tot=acc;return best;};
      const at=s=>{const R=WEST.rail;let acc=0;for(let i=0;i<R.length-1;i++){const a=R[i],b=R[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(s<=acc+L||i===R.length-2){const t=Math.max(0,Math.min(1,(s-acc)/(L||1)));return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,(b[0]-a[0])/(L||1),(b[1]-a[1])/(L||1)];}acc+=L;}return[R[0][0],R[0][1],1,0];};
      (function loop(){try{car2.visible=tr.visible&&tr.parent===scene;if(car2.visible&&WEST.rail&&WEST.rail.length>1){const p=proj(tr.position.x,tr.position.z);const fx=Math.cos(-tr.rotation.y),fz=Math.sin(-tr.rotation.y),dir=(fx*p.tx+fz*p.tz)>=0?1:-1;
          const q=at(Math.max(0,Math.min(p.tot,p.s-dir*GAP)));car2.position.set(q[0],tr.position.y,q[1]);let hx=q[2]*dir,hz=q[3]*dir;car2.rotation.y=-Math.atan2(hz,hx);}}catch(e){}requestAnimationFrame(loop);})();}
  }
  scene.add(tr);WEST.train=tr;
  // Parker Point, Little Salmon Bay, Strickland Bay
  signPost(62.5,5.6,makeSign(['PARKER POINT','SNORKEL TRAIL'],56,20,'#2f78a8','#ffffff'),1,.5);signPost(70.6,5,makeSign(['LITTLE SALMON','BAY'],56,20,'#2f78a8','#ffffff'),1,.5);signPost(82.6,5.4,makeSign(['STRICKLAND','BAY · SURF'],52,20,'#e8735a','#ffffff'),1,.5);
  WEST.snork=[[62.4,9.4],[63.6,9.8],[70,9.6],[71.4,10.2]].map(([x,z],i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.14,8,8),M(['#f1c64a','#e8735a','#2f78a8','#c8344a'][i]));scene.add(m);const s=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.3,5),M('#f1c64a'));scene.add(s);return{m,s,x,z,ph:i};});
  const surfPal={o:'#1a1410',s:'#f1c7a0',w:'#2a2a30',b:'#f6f2e8',r:'#e8735a'};
  WEST.surfers=[0,1].map(i=>{const m=spriteMesh([CHAR2_ON?surfer32(['#f1c7a0','#8d5a3b'][i],['#d9b25a','#1b1b2b'][i],'#1d2238'):pix(["....oo....","...osso...","...osso....","....ww....","..owwwwo..","...wwww...","...w..w...","rrrrrrrrrr",".bbbbbbbb."],surfPal)],.9,.9,{shadow:false});scene.add(m);return{m,ph:i*3};});
  [[70.6,7.4],[71.8,7.6]].forEach(([x,z],i)=>{const u=new THREE.Mesh(new THREE.ConeGeometry(.9,.4,8),M(i?'#f1c64a':'#e8735a'));u.position.set(x,1.8,z);u.castShadow=true;scene.add(u);box(.05,1.8,.05,legMat,x,.9,z);});
  // Cape Vlamingh boardwalk, memorial and the fur seals at Cathedral Rocks
  box(5.4,.14,1.2,lmat(deckC,[5,1]),93.9,.1,.4,{noCast:true});box(3,.14,3,lmat(deckC,[3,3]),97.4,.1,.4,{noCast:true});
  for(let i=0;i<=10;i++){[-1.1,1.9].forEach(z=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.7,.06),fenceMat);p.position.set(96+i*.3,.45,z);scene.add(p);});}
  [-1.1,1.9].forEach(z=>box(3,.06,.06,fenceMat,97.5,.78,z));
  box(.9,1,.5,lmat(stoneC,[1,1]),95.6,.5,-1.4);signPost(94.4,-1.4,makeSign(['VLAMINGH','MEMORIAL'],48,20,'#3a2a20','#f5ecd8'),1,.4);col(95.1,-1.7,96.1,-1.1);
  [[93.6,5.6],[95.2,6],[96.6,5.2],[94.4,6.8]].forEach(([x,z],i)=>{const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.7+i*.15),M('#8a8478'));r.position.set(x,-.15,z);r.scale.y=.5;scene.add(r);});
  const sealPal={o:'#1d1612',b:'#5a4a40',l:'#7a6656',e:'#0a0a0a',w:'#ffffff'};
  WEST.seals=[[93.6,5.6],[95.2,6],[96.6,5.2]].map(([x,z],i)=>{const m=spriteMesh([CHAR2_ON?seal32():pix(["............","......ooo...",".....oblbo..","....obblweo.","...obbbbbbo.","..obbbllbbo.",".obbbbbbbo..","obbbbbbbo...",".oooooooo...."],sealPal)],.9,.6);m.position.set(x,.25,z);if(i%2)m.scale.x=-1;scene.add(m);return{m,ph:i};});
  signPost(47.2,-2.6,makeSign(['ISLAND LOOP','22 KM →'],48,20,'#c8344a','#ffffff'),1,.5);signPost(89.6,1.8,makeSign(['WEST END','CAPE VLAMINGH'],56,20,'#3a2a20','#f5ecd8'),1,.5);})();
// Quokka Coach bus stops around the island
const COACH=[{id:'settle',name:'Settlement',x:10.4,z:-1.8},{id:'basin',name:'The Basin',x:22,z:-6.6},{id:'light',name:'Rottnest Lighthouse',x:32.2,z:-4.6},{id:'geordie',name:'Geordie Bay',x:59.4,z:-2.6},{id:'salmon',name:'Little Salmon Bay',x:71.2,z:.8},{id:'west',name:'West End',x:89.6,z:-.6}];
window.__coachMeshes=[];COACH.forEach(b=>{const p=box(.1,2.2,.1,new THREE.MeshLambertMaterial({color:0x1f5fae}),b.x,1.1,b.z);const s=new THREE.Mesh(new THREE.PlaneGeometry(.75,.75),new THREE.MeshBasicMaterial({map:makeSign(['BUS'],24,24,'#1f5fae','#ffffff'),side:THREE.DoubleSide}));s.position.set(b.x,2,b.z+.06);scene.add(s);window.__coachMeshes.push(p,s);});

