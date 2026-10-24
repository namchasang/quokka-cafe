// ---------- South Perth shops ----------
const SHOP_POS={market:{x:163.5,z:1},servo:{x:135.5,z:1},seeds:{x:156,z:1.2}};
(()=>{const P=SHOP_POS.market;const w=box(4,2.4,2.4,lmat(plasterC,[3,2],{color:new THREE.Color('#f6f2e8')}),P.x,1.2,P.z);
  box(4.05,.35,2.45,new THREE.MeshLambertMaterial({color:0xc8344a}),P.x,2.25,P.z);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.1),new THREE.MeshLambertMaterial({color:0x34506e}));win.position.set(P.x-.4,1,P.z+1.21);scene.add(win);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(.8,1.5),new THREE.MeshLambertMaterial({color:0x9fd0e6}));door.position.set(P.x+1.4,.75,P.z+1.21);scene.add(door);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.32),new THREE.MeshBasicMaterial({map:makeSign(['SWAN MARKET'],64,10,'#c8344a','#ffffff')}));sg.position.set(P.x,2.25,P.z+1.24);scene.add(sg);
  [['#e8344a',-1.6],['#f08a2a',-1],['#86b86e',-.4],['#f4e04a',.2]].forEach(([c,o])=>box(.5,.3,.4,new THREE.MeshLambertMaterial({color:new THREE.Color(c)}),P.x+o,.15,P.z+1.6));
  col(P.x-2,P.z-1.2,P.x+2,P.z+1.85);})();
(()=>{const P=SHOP_POS.servo;box(3,2,2,lmat(plasterC,[2,2],{color:new THREE.Color('#e8d2a6')}),P.x,1,P.z-.2);
  const can=box(4.6,.22,2.6,new THREE.MeshLambertMaterial({color:0xf6f2e8}),P.x,2.6,P.z+2.4);box(4.62,.16,2.62,new THREE.MeshLambertMaterial({color:0x2f6fb0}),P.x,2.45,P.z+2.4);
  [[-2.1,1.3],[2.1,1.3],[-2.1,3.5],[2.1,3.5]].forEach(([a,b])=>box(.14,2.4,.14,new THREE.MeshLambertMaterial({color:0xdfe6ec}),P.x+a,1.2,P.z+b));
  [-.8,.8].forEach(o=>{box(.45,1,.35,new THREE.MeshLambertMaterial({color:0xc8344a}),P.x+o,.5,P.z+2.4);box(.3,.25,.02,new THREE.MeshBasicMaterial({color:0xcfe6ff}),P.x+o,.78,P.z+2.58);});
  box(.16,3.2,.16,legMat,P.x-2.6,1.6,P.z+.6);const sg=new THREE.Mesh(new THREE.PlaneGeometry(1,.6),new THREE.MeshBasicMaterial({map:makeSign(['MENDS','SERVO'],32,20,'#2f6fb0','#ffffff'),side:THREE.DoubleSide}));sg.position.set(P.x-2.6,3.1,P.z+.68);scene.add(sg);
  ['#2f7fd0','#f1c64a'].forEach((c,i)=>{const b=spriteMesh([bikeCanvas(c)],1.5,.9);b.position.set(P.x+.8-i*1.4,0,P.z+1.1);scene.add(b);});
  col(P.x-1.5,P.z-1.2,P.x+1.5,P.z+.8);col(P.x-1.1,P.z+2.2,P.x-.5,P.z+2.6);col(P.x+.5,P.z+2.2,P.x+1.1,P.z+2.6);col(P.x-2.75,P.z+.45,P.x-2.45,P.z+.75);})();
(()=>{const P=SHOP_POS.seeds;const gl=box(2.8,1.9,2,new THREE.MeshLambertMaterial({color:0xd8f2e8,transparent:true,opacity:.42}),P.x,.95,P.z,{noCast:true});
  const rf=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,2.8,3),new THREE.MeshLambertMaterial({color:0xe8f6f0,transparent:true,opacity:.5}));rf.rotation.z=Math.PI/2;rf.position.set(P.x,2.2,P.z);rf.scale.set(1,1,.88);scene.add(rf);
  [[-1.4,-1],[1.4,-1],[-1.4,1],[1.4,1]].forEach(([a,b])=>box(.08,1.9,.08,fenceMat,P.x+a,.95,P.z+b));
  [-.8,0,.8].forEach(o=>{box(.6,.5,1.2,bedMat,P.x+o,.25,P.z-.1);const v=bushVariants[0];const g=new THREE.PlaneGeometry(.9,.6);g.translate(0,.3,0);const m=new THREE.Mesh(g,v.m);m.position.set(P.x+o,.5,P.z);scene.add(m);BB.push(m);});
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2,.36),new THREE.MeshBasicMaterial({map:makeSign(['SWAN SEEDS'],56,10,'#3e7d5c','#f5ecd8')}));sg.position.set(P.x,2.1,P.z+1.05);scene.add(sg);
  [[-1.7,1.6],[1.8,1.5]].forEach(([a,b])=>{box(.4,.35,.4,new THREE.MeshLambertMaterial({color:0xc46a3c}),P.x+a,.18,P.z+b);const v=bushVariants[1];const g=new THREE.PlaneGeometry(.9,.6);g.translate(0,.3,0);const m=new THREE.Mesh(g,v.m);m.position.set(P.x+a,.33,P.z+b);scene.add(m);BB.push(m);});
  col(P.x-1.5,P.z-1.1,P.x+1.5,P.z+1.1);})();

// ---------- South Perth streets and homes ----------
box(56,.5,28,lmat(paveC,[24,10]),141,-.26,10,{noCast:true});
flat(18,13.6,lmat(grassC,[3,2.2]),122,.009,4.2);flat(18,1.6,lmat(pathC,[9,.8]),122,.014,-3.2);
flat(56,12.6,lmat(grassC,[9.3,2.1]),141,.009,17.7);
const asphC=(()=>{const c=mk(16,16),x=c.getContext('2d'),r=mulberry32(61);x.fillStyle='#4a4d55';x.fillRect(0,0,16,16);x.fillStyle='#55585f';for(let i=0;i<30;i++)x.fillRect(r()*16|0,r()*16|0,1,1);x.fillStyle='#3e4148';for(let i=0;i<20;i++)x.fillRect(r()*16|0,r()*16|0,1,1);return c;})();
flat(56,2.4,lmat(asphC,[28,1.2]),141,.02,22.2);flat(56,.6,lmat(pathC,[28,.3]),141,.024,20.7);
for(let x=114;x<168;x+=2.4)flat(1.1,.1,new THREE.MeshLambertMaterial({color:0xf3efe6}),x,.026,22.2);
const LANES=[125,140];LANES.forEach(x=>{flat(1.8,9.4,lmat(asphC,[1,4.7]),x,.021,15.7);});
const brickC=(()=>{const c=mk(16,16),x=c.getContext('2d');x.fillStyle='#c8c0b0';x.fillRect(0,0,16,16);for(let j=0;j<4;j++)for(let i=0;i<3;i++){const o=j%2?3:0;x.fillStyle=['#a8503a','#b65a42','#9c4834'][(i+j)%3];x.fillRect((i*6+o)%16,j*4,5,3);if((i*6+o)%16>11)x.fillRect(0,j*4,((i*6+o)%16)-11,3);}return c;})();
const HOUSES=[],PROPS={};
function bungalow(x,z,o){const g=new THREE.Group();const walls=new THREE.Mesh(new THREE.BoxGeometry(3.2,1.8,2.8),lmat(o.brick?brickC:plasterC,[3,2],o.brick?{}:{color:new THREE.Color(o.wall||'#efe3c4')}));walls.position.y=.9;walls.castShadow=walls.receiveShadow=true;g.add(walls);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(2.6,1.4,4),new THREE.MeshLambertMaterial({color:new THREE.Color(o.roof||'#b8562e')}));roof.rotation.y=Math.PI/4;roof.position.y=2.5;roof.scale.set(1,1,.9);roof.castShadow=true;g.add(roof);
  const ver=new THREE.Mesh(new THREE.BoxGeometry(3.4,.1,.9),new THREE.MeshLambertMaterial({color:new THREE.Color(o.roof||'#b8562e')}));ver.position.set(0,1.75,1.8);ver.castShadow=true;g.add(ver);
  [-1.5,-.5,.5,1.5].forEach(px=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.7,6),fenceMat);p.position.set(px,.85,2.2);g.add(p);});
  const d=new THREE.Mesh(new THREE.PlaneGeometry(.6,1.15),new THREE.MeshLambertMaterial({color:new THREE.Color(o.door||'#2f5a46')}));d.position.set(0,.58,1.41);g.add(d);
  [-1,1].forEach(px=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6),winMat);w.position.set(px,1.05,1.41);g.add(w);});
  g.position.set(x,0,z);scene.add(g);col(x-1.6,z-1.4,x+1.6,z+1.4);
  for(let i=0;i<9;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.07,.45,.07),fenceMat);p.position.set(x-1.9+i*.475,.23,z+3.1);p.castShadow=true;scene.add(p);}
  HOUSES.push({x,z});return g;}
const houseSpec=[[128,{brick:true}],[132.2,{wall:'#f2e6c8',roof:'#3f7a5a'}],[167.2,{brick:true,roof:'#7a4a3a'}]];
houseSpec.forEach(([x,o])=>bungalow(x,16,o));
// riverfront house on the west foreshore
(()=>{const x=121,z=.6,g=new THREE.Group();const low=new THREE.Mesh(new THREE.BoxGeometry(5,2,3.4),new THREE.MeshLambertMaterial({color:0xf6f2e8}));low.position.y=1;low.castShadow=low.receiveShadow=true;g.add(low);
  const up=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.8,3),new THREE.MeshLambertMaterial({color:0xe8e2d4}));up.position.set(-.6,2.9,-.2);up.castShadow=true;g.add(up);
  const gl=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.3),new THREE.MeshLambertMaterial({color:0x5a8aa8,emissive:0x112233}));gl.position.set(0,1.05,-1.71);gl.rotation.y=Math.PI;g.add(gl);
  const gl2=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.3),new THREE.MeshLambertMaterial({color:0x5a8aa8,emissive:0x112233}));gl2.position.set(0,1.05,1.71);g.add(gl2);
  const deck=new THREE.Mesh(new THREE.BoxGeometry(5.4,.14,1.4),lmat(deckC,[3,1]));deck.position.set(0,.07,-2.4);deck.receiveShadow=true;g.add(deck);
  const pj=new THREE.Mesh(new THREE.BoxGeometry(1,.14,2.6),lmat(deckC,[1,2]));pj.position.set(1.6,.04,-4.3);g.add(pj);
  g.position.set(x,0,z);scene.add(g);col(x-2.5,z-1.7,x+2.5,z+1.7);HOUSES.push({x,z});})();

