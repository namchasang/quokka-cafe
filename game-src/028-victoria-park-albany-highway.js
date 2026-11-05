// ---------- Victoria Park: Albany Highway ----------
box(74,.5,30,lmat(paveC,[37,15]),525,-.26,0,{noCast:true});
flat(74,2.4,lmat(asphC,[37,1.2]),525,.02,0);for(let x=490;x<562;x+=2.4)flat(1.1,.1,new THREE.MeshLambertMaterial({color:0xf3d24a}),x,.026,0);
flat(74,.8,lmat(pathC,[37,.4]),525,.022,-1.6);flat(74,.8,lmat(pathC,[37,.4]),525,.022,1.6);
flat(54,7,lmat(deckC,[12,2]),525,.018,6.6);flat(6,6,lmat(grassC,[1,1]),494,.015,7);flat(6,6,lmat(grassC,[1,1]),556,.015,7);
flat(74,.8,new THREE.MeshLambertMaterial({color:0x6a5a4a}),525,.02,-11);for(let x=489;x<562;x+=.9)flat(.18,1.2,new THREE.MeshLambertMaterial({color:0x4a3a2a}),x,.024,-11);
const VP_SHOPS=[
 {id:'pho',name:'Pho-nomenal Noodles',dish:'Beef pho',price:12,col:'#c8344a',wall:'#f6e8d0',cui:'Vietnamese'},{id:'seoul',name:'Kimchi Quokka Grill',dish:'Korean BBQ',price:15,col:'#1d3a6e',wall:'#e8e2d4',cui:'Korean'},
 {id:'ramen',name:'Lantern Alley Ramen',dish:'Tonkotsu ramen',price:14,col:'#2a2a30',wall:'#f2e6c8',cui:'Japanese'},{id:'boba',name:'Bubble Burrow Tea',dish:'Brown sugar bubble tea',price:7,col:'#e8a33a',wall:'#fff3d6',cui:'Taiwanese'},
 {id:'dump',name:'Moon Rabbit Dumplings',dish:'Xiao long bao',price:11,col:'#b8241e',wall:'#f6e2c0',cui:'Chinese'},{id:'bkk',name:'Siam Smile Kitchen',dish:'Khao man gai',price:12,col:'#7a1f2a',wall:'#f2e6c8',cui:'Thai'},
 {id:'malaya',name:'Pandan & Spice',dish:'Nasi lemak',price:12,col:'#3e7d5c',wall:'#efe3c4',cui:'Malaysian'},{id:'asiamart',name:'Lotus Pantry Mart',dish:null,price:0,col:'#c8344a',wall:'#f6f2e8',cui:'Grocery'},
 {id:'pub',name:'The Wattle & Swan Hotel',dish:'Pub schnitzel',price:16,col:'#2c3b38',wall:'#e2d2a8',cui:'Pub'},{id:'kmax',name:'Homebox',dish:null,price:0,col:'#d8343a',wall:'#f6f6f0',cui:'Department store'},
 {id:'luna',name:'Moonbeam Coffee',dish:'Long black',price:5,col:'#5a3a22',wall:'#f2ede4',cui:'Coffee'},{id:'chai',name:'Cosy Chai House',dish:'Masala dosa',price:11,col:'#e8732a',wall:'#fbe9cf',cui:'Indian'}];
VP_SHOPS.forEach((sh,i)=>{sh.x=493+i*5.6;sh.z=-4;const tall=sh.id==='pub'||sh.id==='kmax';bld(sh.x,sh.z,5.2,3.4,tall?4.4:3,sh.wall,{ver:sh.col,sign:sh.name.toUpperCase(),signBg:sh.col,parapet:sh.id==='pub'?'#d8c8a0':undefined,roof:sh.id==='pub'?'#8a3a2a':undefined});});
(()=>{const st=bld(558.6,-8,5.4,2.4,2.6,'#dfe6ec',{win:false,sign:'VICTORIA PARK STATION',signBg:'#1d3a6e',signY:2.1});})();
const vpTrain=new THREE.Group();(()=>{for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(7,1.8,1.9),new THREE.MeshLambertMaterial({color:0xdfe6ec}));c.position.set(i*7.3,1.15,0);c.castShadow=true;vpTrain.add(c);const s=new THREE.Mesh(new THREE.BoxGeometry(7.02,.3,1.92),new THREE.MeshLambertMaterial({color:0xd8343a}));s.position.set(i*7.3,.5,0);vpTrain.add(s);const w=new THREE.Mesh(new THREE.BoxGeometry(7.04,.5,1.94),new THREE.MeshLambertMaterial({color:0x2a3a58}));w.position.set(i*7.3,1.4,0);vpTrain.add(w);}vpTrain.position.set(470,0,-11);scene.add(vpTrain);})();
const NM=[['SATAY','#c8344a'],['TAKOYAKI','#2a2a30'],['MANGO STICKY RICE','#e8a33a'],['BAO','#f6f2e8'],['ROTI','#3e7d5c']];
NM.forEach(([n,c],i)=>{const x=503+i*9.5;box(3,.9,1.2,lmat(counterC,[2,1]),x,.45,6.2);const aw=box(3.4,.1,1.6,new THREE.MeshLambertMaterial({color:new THREE.Color(c)}),x,2.2,6.6);aw.rotation.x=-.2;[[-1.5,5.6],[1.5,5.6],[-1.5,7.4],[1.5,7.4]].forEach(([a,b])=>box(.08,2.1,.08,legMat,x+a,1.05,b));
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.32),new THREE.MeshBasicMaterial({map:makeSign([n],Math.max(48,n.length*6+8),10,'#1b1b2b','#ffd34d'),side:THREE.DoubleSide}));sg.position.set(x,1.85,7.45);scene.add(sg);col(x-1.5,5.6,x+1.5,6.8);});
const vpLights=[];for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.06,6,6),new THREE.MeshBasicMaterial({color:[0xffe9a8,0xffc8e0,0xc8f0ff,0xfff3c0][i%4]}));m.position.set(500+i*1.25,2.6-Math.abs(Math.sin(i*.6))*.35,4.4);scene.add(m);vpLights.push(m);}
(()=>{const c=mk(64,32),x=c.getContext('2d');const cols=['#e8457a','#f1c64a','#5cc6d8','#86b86e','#9478d4','#ef7d5e'];for(let i=0;i<14;i++){x.fillStyle=cols[i%6];x.beginPath();x.arc(Math.random()*64,Math.random()*32,4+Math.random()*9,0,6.283);x.fill();}
  const pq=pix(QK_TOP.concat(QK_LEGS.idle),{o:'#1a1410',b:'#f6f2e8',p:'#e79a9a',e:'#1a1010',w:'#ffffff',n:'#2a1a12',l:'#ffd34d',c:'#e8a08a',a:'#3e7d5c'});x.drawImage(pq,24,8);x.fillStyle='#1b1b2b';x.font='bold 7px monospace';x.fillText('VIC PARK',4,29);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(5,2.5),new THREE.MeshLambertMaterial({map:ctex(c),emissive:0x222222}));m.position.set(491,1.5,4.2);scene.add(m);box(5.2,3,.3,lmat(plasterC,[2,1]),491,1.5,4);col(488.4,3.8,493.6,4.2);})();
[[489.5,8.4],[495.5,9.6],[553,9.2],[559,8.4]].forEach(([x,z])=>{const v=treeVariants[2];const g=new THREE.PlaneGeometry(v.w,v.h);g.translate(0,v.h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v,fade:false});});
// bus stops
const BUS_STOPS={sp:{x:158.6,z:20.3,name:'South Perth',land:[158.6,20.2]},hi:{x:432,z:-8.6,name:'Heirisson Island',land:[432,-8.4]},vp:{x:492,z:2.3,name:'Victoria Park',land:[492,2.4]}};
Object.values(BUS_STOPS).forEach(b=>{box(.1,2.2,.1,new THREE.MeshLambertMaterial({color:0x2f9a5a}),b.x,1.1,b.z+.1);const s=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),new THREE.MeshBasicMaterial({map:makeSign(['BUS'],24,24,'#2f9a5a','#ffffff'),side:THREE.DoubleSide}));s.position.set(b.x,2,b.z+.16);scene.add(s);
const spBus=window.__busProto.clone();spBus.position.set(BUS_STOPS.sp.x+.6,0,21.7);scene.add(spBus);fadeGroup(spBus);
  const sh=box(2.4,.08,1.2,new THREE.MeshLambertMaterial({color:0x8fb8c8,transparent:true,opacity:.6}),b.x+1.6,2.1,b.z+.4);box(.06,2.1,.06,fenceMat,b.x+.5,1.05,b.z+.9);box(.06,2.1,.06,fenceMat,b.x+2.7,1.05,b.z+.9);col(b.x-.12,b.z-.02,b.x+.12,b.z+.22);});


// island General Store in the Settlement
(()=>{bld(4.6,-8.6,3.6,2.4,2.4,'#f2e6c8',{ver:'#c8344a',sign:'GENERAL STORE',signBg:'#c8344a'});[['#86b86e',3.4],['#f1c64a',4.2],['#e8735a',5]].forEach(([c,x])=>box(.5,.3,.4,new THREE.MeshLambertMaterial({color:new THREE.Color(c)}),x,.15,-6.7));})();

// ---------- Quokka Village (inland bush, where quokkas gather most) ----------
const VILLAGE={x:24,z:5};
(()=>{const V=VILLAGE;const plaza=new THREE.Mesh(new THREE.CircleGeometry(2.1,24),lmat(pathC,[2,2]));plaza.rotation.x=-Math.PI/2;plaza.position.set(V.x,groundY(V.x,V.z)+.03,V.z);plaza.receiveShadow=true;scene.add(plaza);
  // campfire
  for(let i=0;i<5;i++){const a=i/5*6.283;const st=new THREE.Mesh(new THREE.DodecahedronGeometry(.13),new THREE.MeshLambertMaterial({color:0x9a958a}));st.position.set(V.x+Math.cos(a)*.38,groundY(V.x,V.z)+.08,V.z+Math.sin(a)*.38);scene.add(st);}
  [0,1.2].forEach(a=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.6,6),new THREE.MeshLambertMaterial({color:0x6b4428}));l.rotation.z=Math.PI/2;l.rotation.y=a;l.position.set(V.x,groundY(V.x,V.z)+.1,V.z);scene.add(l);});
  const fc=mk(12,16),fx=fc.getContext('2d');[['#ff8a2a',[[3,6,6,10]]],['#ffd34d',[[4,9,4,7]]],['#fff3c0',[[5,12,2,3]]]].forEach(([c,rs])=>{fx.fillStyle=c;rs.forEach(q=>fx.fillRect(...q));});fx.fillStyle='#ff8a2a';fx.fillRect(5,3,2,3);fx.fillRect(2,8,1,4);fx.fillRect(9,7,1,5);
  const fire=new THREE.Mesh(new THREE.PlaneGeometry(.45,.6),new THREE.MeshBasicMaterial({map:ctex(fc),transparent:true,alphaTest:.3,side:THREE.DoubleSide}));fire.geometry.translate(0,.3,0);fire.position.set(V.x,groundY(V.x,V.z)+.05,V.z);scene.add(fire);BB.push(fire);window.__vfire=fire;
  col(V.x-.45,V.z-.45,V.x+.45,V.z+.45);
  // teepees
  const tp=(c1,c2)=>{const c=mk(32,32),x=c.getContext('2d');x.fillStyle='#efe2c4';x.fillRect(0,0,32,32);x.fillStyle=c1;x.fillRect(0,10,32,3);x.fillRect(0,22,32,2);x.fillStyle=c2;for(let i=0;i<32;i+=4){x.fillRect(i,14,2,2);x.fillRect(i+2,18,2,2);}x.fillStyle='#d8c8a4';for(let i=0;i<40;i++)x.fillRect(Math.random()*32|0,Math.random()*32|0,1,1);return ctex(c);};
  [[-3.4,-1.2,'#c8344a','#2f78a8'],[-2.6,2.2,'#3e7d5c','#e8a33a'],[3.2,2.4,'#9478d4','#ef7d5e']].forEach(([dx,dz,c1,c2])=>{const x=V.x+dx,z=V.z+dz,gy=groundY(x,z);const cone=new THREE.Mesh(new THREE.ConeGeometry(.95,2.2,10,1,true),new THREE.MeshLambertMaterial({map:tp(c1,c2),side:THREE.DoubleSide}));cone.position.set(x,gy+1.1,z);cone.castShadow=true;scene.add(cone);
    for(let i=0;i<4;i++){const a=i/4*6.283+.4;const pole=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.7,5),new THREE.MeshLambertMaterial({color:0x6b4428}));pole.position.set(x+Math.cos(a)*.12,gy+2.35,z+Math.sin(a)*.12);pole.rotation.set(Math.sin(a)*.4,0,-Math.cos(a)*.4);scene.add(pole);}
    const door=new THREE.Mesh(new THREE.PlaneGeometry(.5,.8),new THREE.MeshLambertMaterial({color:0x3a2a20,side:THREE.DoubleSide}));door.position.set(x,gy+.4,z+.62);door.rotation.x=-.36;scene.add(door);col(x-.7,z-.7,x+.7,z+.7);});
  // Spanish colonial cottages, like old Fremantle
  const arch=()=>{const c=mk(16,24),x=c.getContext('2d');x.fillStyle='#5a3a22';x.beginPath();x.moveTo(1,24);x.lineTo(1,8);x.arc(8,8,7,Math.PI,0);x.lineTo(15,24);x.fill();x.fillStyle='#7a5032';x.fillRect(3,10,10,13);x.fillStyle='#ffd34d';x.fillRect(11,16,1,1);return ctex(c);};
  [[3.6,-1.6],[0,-3],[-0.2,3.4]].forEach(([dx,dz],i)=>{const x=V.x+dx,z=V.z+dz,gy=groundY(x,z);const g=bld(x,z,2.1,1.6,1.5,'#f6f0e2',{win:false,roof:'#c2603a',roofH:.65,noCol:true});g.position.y=gy;
    const d=new THREE.Mesh(new THREE.PlaneGeometry(.55,.85),new THREE.MeshLambertMaterial({map:arch(),transparent:true,alphaTest:.5}));d.position.set(0,.43,.81);g.add(d);// door, windows and pot ride with the cottage (the island warp moved them apart)
    [-.65,.65].forEach(o=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.32,.42),new THREE.MeshLambertMaterial({color:0x2f78a8}));w.position.set(o,.85,.81);g.add(w);const s=new THREE.Mesh(new THREE.PlaneGeometry(.12,.44),new THREE.MeshLambertMaterial({color:0x3e7d5c}));s.position.set(o-.24,.85,.812);g.add(s);});
    const pot=new THREE.Mesh(new THREE.CylinderGeometry(.14,.1,.22,8),new THREE.MeshLambertMaterial({color:0xc2603a}));pot.position.set(.42,.11,.98);g.add(pot);col(x-1.05,z-.8,x+1.05,z+.8);});
  signPost(V.x-1.4,V.z+4.4,makeSign(['QUOKKA','VILLAGE'],48,20,'#5a3a22','#f5ecd8'),1.1,.5);})();
const VILLAGE_ELDER={x:VILLAGE.x+1.5,z:VILLAGE.z+.6};

const elder=spriteMesh(quokkaFrames('#f5ecd8',.82),1.05,1.05);elder.position.set(VILLAGE_ELDER.x,groundY(VILLAGE_ELDER.x,VILLAGE_ELDER.z),VILLAGE_ELDER.z);scene.add(elder);blob(.8).position.set(VILLAGE_ELDER.x,groundY(VILLAGE_ELDER.x,VILLAGE_ELDER.z)+.03,VILLAGE_ELDER.z);
