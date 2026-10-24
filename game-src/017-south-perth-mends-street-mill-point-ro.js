// ---------- South Perth: Mends Street, Mill Point Road intersection, riverfront plaza ----------
const pavC=(()=>{const c=mk(16,16),x=c.getContext('2d');x.fillStyle='#8a4a3a';x.fillRect(0,0,16,16);for(let j=0;j<8;j++)for(let i=0;i<4;i++){x.fillStyle=['#a85a44','#b8664c','#9a5040','#c0705a'][(i*3+j)%4];x.fillRect(i*4+(j%2?2:0),j*2,3,1);}return c;})();
const plazaC=(()=>{const c=mk(16,16),x=c.getContext('2d');x.fillStyle='#d8d2c6';x.fillRect(0,0,16,16);for(let j=0;j<4;j++)for(let i=0;i<4;i++){x.fillStyle=['#cfc8ba','#e2ddd2','#c8bfae','#d6cfc0'][(i+j*2)%4];x.fillRect(i*4,j*4,3,3);}return c;})();
const SP_FADE=[];function fadeGroup(g){const mats=[];g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(g);g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;mats.push(o.material);}});SP_FADE.push({mats,x1:bb.min.x,x2:bb.max.x,z1:bb.min.z,z2:bb.max.z,h:bb.max.y,o:1});}
function segHitsBox(ax,az,bx,bz,f,pad){let t0=0,t1=1;const dx=bx-ax,dz=bz-az;const lim=[[-dx,ax-(f.x1-pad)],[dx,(f.x2+pad)-ax],[-dz,az-(f.z1-pad)],[dz,(f.z2+pad)-az]];for(const [p,q] of lim){if(Math.abs(p)<1e-9){if(q<0)return false;continue;}const r=q/p;if(p<0){if(r>t1)return false;if(r>t0)t0=r;}else{if(r<t0)return false;if(r<t1)t1=r;}}return t0<.97;}
flat(2.8,10.4,lmat(asphC,[1.4,5.2]),150,.021,15.9);
[147.6,152.4].forEach(x=>flat(1.2,10.4,lmat(pavC,[.8,6]),x,.022,15.9));
flat(4,8.2,lmat(pavC,[2.4,5]),150,.017,6.6);
flat(9,5,lmat(plazaC,[5,3]),150.5,.016,.1);
// zebra crossings
const zebra=new THREE.MeshLambertMaterial({color:0xf3efe6});
for(let i=0;i<6;i++){flat(.3,2.3,zebra,146.2+i*.0,.027,22.2);}
[146.2,153.8].forEach(cx=>{for(let i=0;i<5;i++)flat(.9,.28,zebra,cx,.027,21.2+i*.5);});
for(let i=0;i<5;i++)flat(.28,.9,zebra,148.9+i*.55,.027,20.1);
// traffic lights
const TL=[];[[147.7,20.5],[152.3,20.5],[147.7,23.65],[152.3,23.65]].forEach(([x,z],i)=>{box(.1,2.4,.1,new THREE.MeshLambertMaterial({color:0xe8b830}),x,1.2,z);box(.26,.7,.22,new THREE.MeshLambertMaterial({color:0x1d1d24}),x,2.2,z);
  const L=['#ff3a2a','#ffb02a','#3ec46a'].map((c,k)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.07,8,8),new THREE.MeshBasicMaterial({color:0x222222}));m.position.set(x,2.42-k*.22,z+(i<2?-.12:.12));scene.add(m);return{m,c:new THREE.Color(c)};});TL.push({L,ns:i%2===1});col(x-.08,z-.08,x+.08,z+.08);});
// plane trees along Mends Street
const plane=(()=>{const r=mulberry32(4242);const blobs=[];for(let i=0;i<9;i++)blobs.push([16+(r()-.5)*20,12+(r()-.5)*10,6+r()*5]);const c=canopy(32,44,blobs,['#2f5a2a','#3e7a34','#5a9a44','#86c05a','#b0d870'],r,[14,24],4);const t=ctex(c);
  return{t,w:3.6,h:4.9,m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.1,.1,.1),emissiveMap:t}),f:new THREE.MeshLambertMaterial({map:t,alphaTest:.02,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};})();
[[147,12],[147,14.4],[153,11.8],[153,14.6],[153,19],[147,19.2],[140.6,12],[158,11.8],[166,12],[118,8],[126,9.5]].forEach(([x,z])=>{const g=new THREE.PlaneGeometry(plane.w,plane.h);g.translate(0,plane.h/2,0);const m=new THREE.Mesh(g,plane.m);m.customDepthMaterial=plane.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v:plane,fade:false});col(x-.2,z-.1,x+.2,z+.1);});
// heritage corner pub
(()=>{const x=143.6,z=16.6,g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(4.4,3,3.2),lmat(brickC,[4,3]));body.position.y=1.5;body.castShadow=true;g.add(body);
  const trim=new THREE.Mesh(new THREE.BoxGeometry(4.5,.35,3.3),new THREE.MeshLambertMaterial({color:0xefe3c4}));trim.position.y=3.1;g.add(trim);
  const gab=new THREE.Mesh(new THREE.ConeGeometry(1.1,1.2,3),new THREE.MeshLambertMaterial({color:0xefe3c4}));gab.rotation.y=Math.PI/2;gab.rotation.x=0;gab.position.set(0,3.8,1.4);gab.scale.set(1,1,.25);g.add(gab);
  [-1.7,1.7].forEach(o=>{const t=new THREE.Mesh(new THREE.ConeGeometry(.28,.9,4),new THREE.MeshLambertMaterial({color:0xa8503a}));t.position.set(o,3.7,1.4);g.add(t);});
  [1.5,0].forEach((h,k)=>{const v=new THREE.Mesh(new THREE.BoxGeometry(4.6,.1,1),new THREE.MeshLambertMaterial({color:k?0x2f5a46:0x8a3a2a}));v.position.set(0,h+1.4,2.1);v.castShadow=true;g.add(v);});
  for(let i=0;i<6;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,2.9,5),new THREE.MeshLambertMaterial({color:0x2f5a46}));p.position.set(-2.2+i*.88,1.45,2.55);g.add(p);if(i<5){const f=new THREE.Mesh(new THREE.SphereGeometry(.16,6,6),new THREE.MeshLambertMaterial({color:i%2?0xf2a0c0:0xf6f2e8}));f.position.set(-1.76+i*.88,2.55,2.55);g.add(f);const f2=f.clone();f2.position.y=1.15;f2.material=new THREE.MeshLambertMaterial({color:0x6aa04a});g.add(f2);}}
  const rail=new THREE.Mesh(new THREE.BoxGeometry(4.6,.3,.04),new THREE.MeshLambertMaterial({color:0x2f5a46}));rail.position.set(0,1.75,2.58);g.add(rail);
  const d=new THREE.Mesh(new THREE.PlaneGeometry(.8,1.3),new THREE.MeshLambertMaterial({color:0x3a2a20}));d.position.set(0,.65,1.61);g.add(d);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.34),new THREE.MeshBasicMaterial({map:makeSign(['THE MILL POINT HOTEL'],100,12,'#efe3c4','#5a2a1a')}));sg.position.set(0,2.9,1.62);g.add(sg);
  g.position.set(x,0,z);scene.add(g);col(x-2.2,z-1.6,x+2.2,z+2.6);fadeGroup(g);})();
// shops on the east side of Mends Street, with a laneway between them
[[12.8,'PICCOLO TRATTORIA','#3e7d5c','#f2e6c8'],[16.9,'SWAN HOME & LIVING','#2f5a8a','#eef2f4']].forEach(([z,n,c,w])=>{const g=bld(155.4,z,3.4,2.4,2.8,w,{ver:c,sign:n,signBg:c,ry:-Math.PI/2,noCol:true});col(154.2-.1-1,z-1.7,156.6,z+1.7);fadeGroup(g);});
flat(2.6,1.2,lmat(pavC,[1.6,.8]),155.4,.02,14.85);
(()=>{for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:[0xffe9a8,0xffc8e0,0xc8f0ff][i%3]}));m.position.set(154.2+i*.27,2.3-Math.sin(i/9*Math.PI)*.25,14.85);scene.add(m);}
  box(.5,.7,.5,new THREE.MeshLambertMaterial({color:0x2f6a35}),156.3,.35,14.5);box(.5,.7,.5,new THREE.MeshLambertMaterial({color:0xc8344a}),156.3,.35,15.2);col(156,14.2,156.6,15.5);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.22),new THREE.MeshBasicMaterial({map:makeSign(['MENDS LANE'],40,10,'#2c3b38','#f5ecd8'),side:THREE.DoubleSide}));sg.position.set(153.9,1.8,14.85);sg.rotation.y=Math.PI/2;scene.add(sg);})();
(()=>{const g=bld(145.4,12.6,2.6,2,2.4,'#fff3d6',{ver:'#e8a33a',sign:'MENDS GELATO',signBg:'#e8a33a',ry:Math.PI/2,noCol:true});col(144.4,11.3,146.4,13.9);fadeGroup(g);})();
// twin glass towers on Mill Point Road
(()=>{const gl=(b,w)=>{const c=mk(16,32),q=c.getContext('2d');q.fillStyle=b;q.fillRect(0,0,16,32);q.fillStyle=w;for(let j=0;j<32;j+=4){q.fillRect(0,j,16,3);}q.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<16;i+=5)q.fillRect(i,0,1,32);return c;};
  const g=new THREE.Group();const pod=new THREE.Mesh(new THREE.BoxGeometry(6,1.8,3.8),lmat(brickC,[5,2]));pod.position.y=.9;pod.castShadow=true;g.add(pod);
  const pg=new THREE.Mesh(new THREE.PlaneGeometry(4.4,1.1),new THREE.MeshLambertMaterial({color:0x5a8aa8,emissive:0x112233}));pg.position.set(0,.8,1.91);g.add(pg);
  const t1=new THREE.Mesh(new THREE.CylinderGeometry(1.35,1.35,11,14),lmat(gl('#5a7a98','#8fb0cc'),[3,6]));t1.position.set(-1.4,7.3,-.4);t1.castShadow=true;g.add(t1);
  const t2=new THREE.Mesh(new THREE.BoxGeometry(2.2,14,2.2),lmat(gl('#4a6a88','#7f9ebb'),[2,8]));t2.position.set(1.6,8.8,-.6);t2.castShadow=true;g.add(t2);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.8,.32),new THREE.MeshBasicMaterial({map:makeSign(['MILL POINT TOWERS'],72,10,'#2c3b38','#f5ecd8')}));sg.position.set(0,1.55,1.92);g.add(sg);
  g.position.set(161,0,15.6);scene.add(g);col(158,13.7,164,17.5);fadeGroup(g);})();
// heritage red-brick post office with palms
(()=>{const g=bld(136.2,16.4,3.8,2.8,2.6,'#b65a42',{win:false,parapet:'#efe3c4',noCol:true});const arch=mk(12,16),ax=arch.getContext('2d');ax.fillStyle='#efe3c4';ax.fillRect(0,0,12,16);ax.fillStyle='#4a6a86';ax.beginPath();ax.moveTo(2,16);ax.lineTo(2,6);ax.arc(6,6,4,Math.PI,0);ax.lineTo(10,16);ax.fill();const at=ctex(arch);
  [-1.2,0,1.2].forEach(o=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.7,.95),new THREE.MeshLambertMaterial({map:at}));w.position.set(o,1.15,1.42);g.add(w);});
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.28),new THREE.MeshBasicMaterial({map:makeSign(['OLD POST OFFICE'],64,10,'#efe3c4','#5a2a1a')}));sg.position.set(0,2.3,1.42);g.add(sg);
  col(134.3,15,138.1,17.8);fadeGroup(g);
  [[133.2,14.4],[139,14.6]].forEach(([x,z])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,4.4,6),new THREE.MeshLambertMaterial({color:0x8a6a4a}));t.position.set(x,2.2,z);t.castShadow=true;scene.add(t);for(let i=0;i<7;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.14,1.4,4),new THREE.MeshLambertMaterial({color:i%2?0x3e7a34:0x5a9a44}));f.rotation.z=Math.PI/2+.5;f.rotation.y=i/7*6.283;f.position.set(x,4.3,z);f.geometry.translate(0,.7,0);scene.add(f);}col(x-.15,z-.15,x+.15,z+.15);});})();
// riverfront plaza: bollards, tall lights, shade umbrellas, origami quokka sculpture
(()=>{for(let x=146.4;x<=155;x+=.9){if(Math.abs(x-150)<1.2)continue;const b=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.55,6),new THREE.MeshLambertMaterial({color:0x8a8f99}));b.position.set(x,.27,2.75);scene.add(b);}
  [[146.8,-1.8],[154.2,-1.8]].forEach(([x,z])=>{box(.16,4,.16,new THREE.MeshLambertMaterial({color:0x6a6e76}),x,2,z);[3.2,3.6,3.95].forEach(h=>box(.5,.06,.06,new THREE.MeshLambertMaterial({color:0x6a6e76}),x,h,z));col(x-.1,z-.1,x+.1,z+.1);});
  [[148.4,1.4],[152.8,1.6]].forEach(([x,z])=>{const u=new THREE.Mesh(new THREE.ConeGeometry(1.1,.45,4),new THREE.MeshLambertMaterial({color:0xe8a33a}));u.rotation.y=Math.PI/4;u.position.set(x,2.1,z);u.castShadow=true;scene.add(u);box(.07,2,.07,legMat,x,1,z);box(1.4,.35,.5,lmat(deckC,[1,1]),x,.18,z+.6);col(x-.7,z+.35,x+.7,z+.85);});
  const gold=[0xf1c64a,0xe8a33a,0xd8902a,0xf6d878];const g=new THREE.Group();const P=(geo,c,px,py,pz,rx,ry,rz)=>{const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:gold[c],flatShading:true}));m.position.set(px,py,pz);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=true;g.add(m);};
  P(new THREE.IcosahedronGeometry(.9,0),0,0,1.5,0);P(new THREE.IcosahedronGeometry(.62,0),1,.75,2.35,.1);P(new THREE.TetrahedronGeometry(.35),2,.55,3,.1);P(new THREE.TetrahedronGeometry(.35),3,1.05,2.95,.1);P(new THREE.ConeGeometry(.22,.5,4),2,1.3,2.25,0,0,-1.4);
  [[-.4,.4],[.4,.4],[-.4,-.4],[.4,-.4]].forEach(([a,b])=>P(new THREE.CylinderGeometry(.08,.14,1.1,4),1,a,.55,b));P(new THREE.ConeGeometry(.3,1.1,4),3,-1,1,0,0,0,1.9);
  g.position.set(153.6,0,-.6);g.scale.setScalar(.9);scene.add(g);col(152.6,-1.4,154.8,.2);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.3),new THREE.MeshBasicMaterial({map:makeSign(['ORIGAMI QUOKKA'],56,12,'#2c3b38','#f5ecd8')}));sg.position.set(153.6,.5,.35);scene.add(sg);})();
// cars
function carMesh(col){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.7,.45,.85),new THREE.MeshLambertMaterial({color:new THREE.Color(col)}));b.position.y=.42;b.castShadow=true;g.add(b);const c=new THREE.Mesh(new THREE.BoxGeometry(.95,.38,.75),new THREE.MeshLambertMaterial({color:0x2a3a58}));c.position.set(-.1,.82,0);g.add(c);
  [[-.55,.42],[.55,.42],[-.55,-.42],[.55,-.42]].forEach(([a,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.12,10),new THREE.MeshLambertMaterial({color:0x1a1a1a}));w.rotation.x=Math.PI/2;w.position.set(a,.18,z);g.add(w);});
  const hl=new THREE.Mesh(new THREE.BoxGeometry(.04,.1,.6),new THREE.MeshBasicMaterial({color:0xfff3c0}));hl.position.set(.86,.45,0);g.add(hl);scene.add(g);return g;}
const CAR_COLS=['#f6f6f0','#2a2a30','#c8344a','#2f78a8','#9aa0a8','#e8a33a','#3e7d5c'];
const CARS=[];
[[1,21.6,114,169],[1,21.6,140,169],[-1,22.8,114,169],[-1,22.8,150,169],[1,-.6,489,561],[1,-.6,520,561],[-1,.6,489,561],[-1,.6,535,561]].forEach(([dir,z,x1,x2],i)=>{const m=carMesh(CAR_COLS[i%CAR_COLS.length]);const x=dir>0?x1:x2;m.rotation.y=dir>0?0:Math.PI;m.position.set(x,0,z);CARS.push({m,dir,z,a:x1>400?489:113,b:x1>400?561:199,x,sp:2.4+(i%3)*.5});});
[[151.9,12.4],[151.9,15.6],[148.1,18.2]].forEach(([x,z],i)=>{const m=carMesh(CAR_COLS[(i+3)%7]);m.rotation.y=Math.PI/2;m.position.set(x,0,z);col(x-.45,z-.85,x+.45,z+.85);});
let tlT=0;
function trafficTick(dt,t){tlT=(tlT+dt)%14;const ew=tlT<6?'g':tlT<7.5?'a':'r';const ns=tlT>=7.5&&tlT<12.5?'g':tlT>=12.5?'a':'r';
  TL.forEach(L=>{const s=L.ns?ns:ew;L.L.forEach((q,k)=>q.m.material.color.copy(((k===0&&s==='r')||(k===1&&s==='a')||(k===2&&s==='g'))?q.c:new THREE.Color(0x222222)));});
  const z=zoneOf(player.x);CARS.forEach(c=>{if((z==='sp')!==(c.a<200)&&!(z==='vp'&&c.a>400))return;let go=true;
    if(c.a<200&&ew!=='g'){const stopX=c.dir>0?146:154;if(c.dir>0?(c.x<stopX&&c.x>stopX-1.6):(c.x>stopX&&c.x<stopX+1.6))go=false;}
    if(Math.abs(player.z-c.z)<.9&&(player.x-c.x)*c.dir>0&&(player.x-c.x)*c.dir<2)go=false;
    CARS.forEach(o=>{if(o!==c&&o.z===c.z&&(o.x-c.x)*c.dir>0&&(o.x-c.x)*c.dir<2.3)go=false;});
    if(go){c.x+=c.dir*c.sp*dt;if(c.x>c.b)c.x=c.a;if(c.x<c.a)c.x=c.b;}c.m.position.set(c.x,0,c.z);});
  SP_FADE.forEach(f=>{const near=z==='sp'&&Math.abs(player.x-(f.x1+f.x2)/2)<30;const tgt=near&&(segHitsBox(camera.position.x,camera.position.z,player.x,player.z,f,.4)||(player.x>f.x1-.6&&player.x<f.x2+.6&&player.z>f.z1-.6&&player.z<f.z2+.6))?.2:1;if(Math.abs(tgt-f.o)>.01){f.o+=(tgt-f.o)*.15;f.mats.forEach(m=>{m.opacity=f.o;m.depthWrite=f.o>.9;});}});}

