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
// ---------- café cash register with card reader ----------
const REG={x:3.35,z:-2.55};
(()=>{box(.62,.9,.62,lmat(counterC,[1,1]),REG.x,.45,REG.z);box(.42,.14,.3,new THREE.MeshLambertMaterial({color:0x2a2a30}),REG.x-.05,.97,REG.z);
  const t=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(.16,.06,.26),new THREE.MeshLambertMaterial({color:0x1d1d24}));t.add(body);const scr=new THREE.Mesh(new THREE.PlaneGeometry(.12,.09),new THREE.MeshBasicMaterial({color:0x4a7aa8}));scr.rotation.x=-Math.PI/2+.5;scr.position.set(0,.04,-.05);t.add(scr);t.position.set(REG.x+.15,.95,REG.z+.18);t.rotation.x=.25;scene.add(t);window.__eftScr=scr;
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(.55,.2),new THREE.MeshBasicMaterial({map:makeSign(['TAP HERE'],40,10,'#1d3a6e','#ffffff')}));sg.position.set(REG.x,.62,REG.z+.315);scene.add(sg);col(REG.x-.31,REG.z-.31,REG.x+.31,REG.z+.31);})();
let eftFlash=0;
// ---------- night market awnings fade when Kip walks behind them ----------
const NM_AW=[];scene.traverse(o=>{if(o.isMesh&&o.position.y>2.1&&o.position.y<2.3&&o.position.z>6.5&&o.position.z<6.7&&o.position.x>500&&o.position.x<545){o.material=o.material.clone();o.material.transparent=true;NM_AW.push(o);}});

// ---------- Island Museum, Restoration Board, mailbox ----------
const MUSEUM={x:10.4,z:-8.8},BOARD={x:13.6,z:-7.4},MAILBOX={x:5.2,z:2.2};
(()=>{const g=bld(MUSEUM.x,MUSEUM.z,3.6,2.6,2.6,'#efe3c4',{win:false,roof:'#8a3a2a',roofH:.9,sign:'ISLAND MUSEUM',signBg:'#5a2a1a',noCol:true});g.position.y=groundY(MUSEUM.x,MUSEUM.z);col(MUSEUM.x-1.8,MUSEUM.z-1.3,MUSEUM.x+1.8,MUSEUM.z+1.3);
  const d=new THREE.Mesh(new THREE.PlaneGeometry(.7,1.2),new THREE.MeshLambertMaterial({color:0x5a3a22}));d.position.set(MUSEUM.x,g.position.y+.6,MUSEUM.z+1.31);scene.add(d);
  [-1.1,1.1].forEach(o=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.6,.7),new THREE.MeshLambertMaterial({color:0x4a6a86}));w.position.set(MUSEUM.x+o,g.position.y+1.2,MUSEUM.z+1.31);scene.add(w);});
  const gy=groundY(BOARD.x,BOARD.z);[-.7,.7].forEach(o=>box(.1,1.6,.1,legMat,BOARD.x+o,gy+.8,BOARD.z));const bc=mk(48,28),bx=bc.getContext('2d');bx.fillStyle='#8a5a36';bx.fillRect(0,0,48,28);bx.fillStyle='#f5ecd8';[[3,4,12,9],[18,3,12,10],[33,5,12,8],[5,15,14,10],[24,15,18,10]].forEach(q=>bx.fillRect(...q));bx.fillStyle='#c8344a';[[8,4],[23,3],[38,5],[11,15],[32,15]].forEach(([a,b])=>bx.fillRect(a,b,2,2));
  const bm=new THREE.Mesh(new THREE.PlaneGeometry(1.7,1),new THREE.MeshLambertMaterial({map:ctex(bc)}));bm.position.set(BOARD.x,gy+1.3,BOARD.z+.06);scene.add(bm);col(BOARD.x-.85,BOARD.z-.12,BOARD.x+.85,BOARD.z+.12);
  signPost(BOARD.x,BOARD.z+.9,makeSign(['RESTORATION','BOARD'],52,20,'#3e7d5c','#f5ecd8'),.7,.32);
  const my=groundY(MAILBOX.x,MAILBOX.z);box(.08,.9,.08,legMat,MAILBOX.x,my+.45,MAILBOX.z);box(.36,.28,.5,new THREE.MeshLambertMaterial({color:0x2f78a8}),MAILBOX.x,my+1,MAILBOX.z);
  const flag=box(.04,.26,.12,new THREE.MeshLambertMaterial({color:0xc8344a}),MAILBOX.x+.2,my+1.15,MAILBOX.z);window.__mailFlag=flag;col(MAILBOX.x-.15,MAILBOX.z-.15,MAILBOX.x+.15,MAILBOX.z+.15);})();
// dig spots, message bottle
const digMeshes=[];const digTex=(()=>{const c=mk(16,16),x=c.getContext('2d');x.strokeStyle='#5a3a22';x.lineWidth=2;x.beginPath();x.moveTo(3,3);x.lineTo(13,13);x.moveTo(13,3);x.lineTo(3,13);x.stroke();x.fillStyle='#7a5232';x.fillRect(7,7,2,2);return ctex(c);})();
for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6),new THREE.MeshLambertMaterial({map:digTex,transparent:true,alphaTest:.3}));m.rotation.x=-Math.PI/2;m.visible=false;scene.add(m);digMeshes.push(m);}
const bottle=spriteMesh([pix(["....oo....","....ww....","...owwo...","...obbo...","..obbbbo..","..obwbbo..","..obbbbo..","..obbbbo..","...oooo...","........."],{o:'#1d3a2a',w:'#f5ecd8',b:'#5aa88a'})],.42,.42);bottle.visible=false;scene.add(bottle);
// whales for Whale Week and fireworks for the river festival
const whale=new THREE.Group();(()=>{const b=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshLambertMaterial({color:0x2a3240}));b.scale.set(2.6,.7,1);whale.add(b);const t=new THREE.Mesh(new THREE.ConeGeometry(.6,.9,3),new THREE.MeshLambertMaterial({color:0x2a3240}));t.rotation.z=Math.PI/2;t.position.set(-2.8,.2,0);t.scale.set(1,1,.2);whale.add(t);
  const sp=new THREE.Mesh(new THREE.ConeGeometry(.25,1.2,6,1,true),new THREE.MeshBasicMaterial({color:0xdff4ff,transparent:true,opacity:.7}));sp.position.set(1.4,1.2,0);sp.rotation.x=Math.PI;whale.add(sp);whale.userData.spout=sp;whale.visible=false;scene.add(whale);})();
const FW=[];for(let i=0;i<60;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.09,5,5),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true}));m.visible=false;scene.add(m);FW.push({m,v:new THREE.Vector3(),t:0});}
// festival decorations
const DECOR={};function bunting(key,x1,z1,x2,z2,h){const g=new THREE.Group();const cols=[0xc8344a,0xf1c64a,0x2f78a8,0x3e7d5c,0xf6f2e8];const n=Math.round(Math.hypot(x2-x1,z2-z1)/.5);for(let i=0;i<n;i++){const k=i/n;const f=new THREE.Mesh(new THREE.ConeGeometry(.14,.3,3),new THREE.MeshBasicMaterial({color:cols[i%5]}));f.rotation.x=Math.PI;f.position.set(lerp(x1,x2,k),h-Math.sin(k*Math.PI)*.4,lerp(z1,z2,k));g.add(f);}g.visible=false;scene.add(g);(DECOR[key]=DECOR[key]||[]).push(g);}
bunting('swim',-13,5.9,-20,5.9,2.2);bunting('quokkaday',VILLAGE.x-2.4,VILLAGE.z-2,VILLAGE.x+2.4,VILLAGE.z-2,2);bunting('quokkaday',VILLAGE.x-2.4,VILLAGE.z+2.6,VILLAGE.x+2.4,VILLAGE.z+2.6,2);bunting('wildflower',140,4.6,160,4.6,2.6);bunting('streetarts',290,6,310,6,3.2);
(()=>{const g=new THREE.Group();for(let i=0;i<16;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.2,8,8),new THREE.MeshBasicMaterial({color:0xe8342a}));l.scale.y=1.25;l.position.set(500+i*3,3.1,i%2?4.4:-4.4);g.add(l);}g.visible=false;scene.add(g);DECOR.lny=[g];})();
const swimmers=[];for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.13,6,6),new THREE.MeshLambertMaterial({color:[0xf1c64a,0xc8344a,0xf6f6f0,0x2f78a8][i%4]}));m.visible=false;scene.add(m);swimmers.push({m,ph:i*.8});}

