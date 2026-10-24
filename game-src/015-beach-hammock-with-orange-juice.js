// ---------- beach hammock with orange juice ----------
const BEACH=LOTS.beach;let juiceMesh;
(()=>{const x0=BEACH.x,z0=BEACH.z;[-1.45,1.45].forEach(s=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,1.7,8),legMat);p.position.set(x0+s,.85,z0);p.castShadow=true;scene.add(p);col(x0+s-.15,z0-.15,x0+s+.15,z0+.15);});
  const nc=mk(16,16),nx=nc.getContext('2d');for(let i=0;i<16;i++)for(let j=0;j<16;j++){nx.fillStyle=(i+j)%4<2?'#f6ead2':'#5cc6d8';nx.fillRect(i,j,1,1);}
  const net=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,2.6,14,1,true,Math.PI*.15,Math.PI*.7),lmat(nc,[3,2],{side:THREE.DoubleSide}));net.rotation.z=Math.PI/2;net.rotation.x=Math.PI;net.position.set(x0,1.05,z0);net.castShadow=true;scene.add(net);
  box(.55,.5,.55,lmat(counterC,[1,1]),x0+2.1,.25,z0+.1);col(x0+1.8,z0-.2,x0+2.4,z0+.4);
  const glass=new THREE.Mesh(new THREE.CylinderGeometry(.09,.075,.26,10),new THREE.MeshLambertMaterial({color:0xe8f6ff,transparent:true,opacity:.55}));glass.position.set(x0+2.1,.63,z0+.1);scene.add(glass);
  juiceMesh=new THREE.Mesh(new THREE.CylinderGeometry(.08,.068,.22,10),new THREE.MeshLambertMaterial({color:0xffa21e,emissive:0x442200}));juiceMesh.geometry.translate(0,.11,0);juiceMesh.position.set(x0+2.1,.51,z0+.1);scene.add(juiceMesh);
  const straw=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.36,5),new THREE.MeshLambertMaterial({color:0xe8457a}));straw.position.set(x0+2.14,.72,z0+.1);straw.rotation.z=-.25;scene.add(straw);
  const sl=new THREE.Mesh(new THREE.TorusGeometry(.06,.02,6,10,Math.PI),new THREE.MeshLambertMaterial({color:0xffd34d}));sl.position.set(x0+2.02,.76,z0+.1);scene.add(sl);})();

// ---------- harbour upgrades ----------
const JMULT=[1,1.5,1.9,2.3,2.7],JX1=[-21.4,-22.6,-27.4,-27.4,-35.4];
const DOCKS=[[-18.8,6.8,0],[-18.8,3.2,Math.PI],[-25,6.8,0],[-25,3.2,Math.PI]];
const ferries=[ferry];
const jettyParts=[null,null,null,null,null];
const ship=new THREE.Group();
(()=>{const add=(g,geo,col,x,y,z)=>{const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:new THREE.Color(col)}));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
  add(ship,new THREE.BoxGeometry(13,1.6,3.4),'#1d3a6e',0,.2,0);add(ship,new THREE.BoxGeometry(13.05,.25,3.45),'#c8344a',0,.95,0);
  add(ship,new THREE.BoxGeometry(11,1.2,3.2),'#f6f2e8',-.4,1.7,0);add(ship,new THREE.BoxGeometry(8,1,3),'#f6f2e8',-1,2.8,0);add(ship,new THREE.BoxGeometry(2.6,.8,2.6),'#f6f2e8',3.4,3.4,0);
  for(let d=0;d<2;d++){const w=new THREE.Mesh(new THREE.PlaneGeometry(d?7.6:10.6,.3),new THREE.MeshLambertMaterial({color:0x2a3a58}));w.position.set(d?-1:-.4,d?2.85:1.75,d?1.51:1.61);ship.add(w);}
  add(ship,new THREE.CylinderGeometry(.5,.6,1.4,12),'#f6f2e8',-3.4,3.9,0);add(ship,new THREE.CylinderGeometry(.52,.52,.4,12),'#c8344a',-3.4,4.4,0);
  const nm=new THREE.Mesh(new THREE.PlaneGeometry(5.4,.42),new THREE.MeshBasicMaterial({map:makeSign(['SPIRIT OF THE INDIAN OCEAN'],120,10,'#1d3a6e','#f5ecd8')}));nm.position.set(-1,.35,1.72);ship.add(nm);
  ship.visible=false;scene.add(ship);})();
function applyJetty(){const L=S.jetty||0;JETTY.x1=JX1[L];const JO=IW(0,0),jpos=g=>{g.position.set(JO.x,0,JO.z);return g;};
  if(L>=1&&!jettyParts[1]){const g=new THREE.Group();const t=new THREE.Mesh(new THREE.BoxGeometry(1.2,.14,4.8),lmat(deckC,[1,4]));t.position.set(-22,.04,5);t.receiveShadow=true;g.add(t);scene.add(jpos(g));jettyParts[1]=g;}
  if(L>=2&&!jettyParts[2]){const g=new THREE.Group();const e=new THREE.Mesh(new THREE.BoxGeometry(4.8,.14,1),lmat(deckC,[4,1]));e.position.set(-25,.04,5);g.add(e);const t=new THREE.Mesh(new THREE.BoxGeometry(1.2,.14,4.8),lmat(deckC,[1,4]));t.position.set(-27,.04,5);g.add(t);
    const roof=new THREE.Mesh(new THREE.BoxGeometry(1.6,.12,3),new THREE.MeshLambertMaterial({color:0x2f6fb0}));roof.position.set(-22,2.2,5);roof.castShadow=true;g.add(roof);[[-22.6,3.8],[-21.4,3.8],[-22.6,6.2],[-21.4,6.2]].forEach(([x,z])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,2.1,6),fenceMat);p.position.set(x,1.1,z);g.add(p);});scene.add(jpos(g));jettyParts[2]=g;}
  if(L>=4&&!jettyParts[4]){const g=new THREE.Group();const e=new THREE.Mesh(new THREE.BoxGeometry(8,.18,1.4),lmat(deckC,[6,1]));e.position.set(-31.4,.05,5);g.add(e);for(let i=0;i<6;i++)[4.3,5.7].forEach(z=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,1.2,6),legMat);p.position.set(-28-i*1.4,-.35,z);g.add(p);});
    [-34.5,-29].forEach(x=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.12,.15,.4,8),new THREE.MeshLambertMaterial({color:0x2b2b30}));b.position.set(x,.3,5.6);g.add(b);});scene.add(jpos(g));jettyParts[4]=g;}
  while(ferries.length<Math.min(4,1+L)){const f=ferry.clone();scene.add(f);ferries.push(f);}
  if(typeof mmBase!=='undefined'){mmBase=renderMapBase(mmFW(),mmFH(),1.15,false);bigBase=null;}}

// harbour board
const HB={x:-13.6,z:6.7};(()=>{box(.12,1.6,.12,legMat,HB.x-.6,.8,HB.z);box(.12,1.6,.12,legMat,HB.x+.6,.8,HB.z);const t=makeSign(['HARBOUR','UPGRADES'],40,22,'#1d3a6e','#f5ecd8');const m=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.75),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide,emissive:0x222222,emissiveMap:t}));m.position.set(HB.x,1.25,HB.z+.08);m.castShadow=true;scene.add(m);col(HB.x-.75,HB.z-.15,HB.x+.75,HB.z+.15);})();
// ---------- South Perth: Mends Street Jetty ----------
const SPX=150;
box(40,.5,15,lmat(stoneC,[20,1]),SPX,-.25,3.5,{noCast:true});
flat(40,13.6,lmat(grassC,[6.6,2.2]),SPX,.01,4.2);flat(40,1.6,lmat(pathC,[20,.8]),SPX,.015,-3.2);
box(1.2,.14,5.6,lmat(deckC,[1,4]),SPX,.04,-6.6,{noCast:true});for(let i=0;i<4;i++)[-.55,.55].forEach(o=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1,6),legMat);p.position.set(SPX+o,-.3,-4.2-i*1.6);scene.add(p);});
const ferry2=ferry.clone();ferry2.rotation.y=Math.PI/2;ferry2.position.set(SPX+1.8,-.15,-7.6);scene.add(ferry2);
box(3.2,2.1,.2,wallMat,144,1.05,.2);box(3,.9,.6,lmat(counterC,[2,1]),144,.45,1.3);const aw2=box(3.6,.12,1.6,lmat(awnC,[3,1]),144,2.25,.95);aw2.rotation.x=.25;
[['#e8344a',142.9],['#f08a2a',143.6],['#f4a03c',144.3],['#e8457a',145]].forEach(([c,x])=>box(.55,.25,.4,new THREE.MeshLambertMaterial({color:new THREE.Color(c)}),x,1.02,1.3));
(()=>{const t=makeSign(['SWAN RIVER GROCER'],96,14,'#2c3b38','#f5ecd8');const m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.38),new THREE.MeshLambertMaterial({map:t,emissive:0x333333,emissiveMap:t}));m.position.set(144,2.62,.33);scene.add(m);})();
col(142.4,.05,145.6,1.65);
signPost(147.6,-2.2,makeSign(['MENDS ST JETTY'],64,12,'#2f5a8a','#f5ecd8'),1.6,.3);
[[137,4.5],[160,4.8]].forEach(([x,z])=>{box(1.6,.08,.45,new THREE.MeshLambertMaterial({color:0xa8744a}),x,.45,z);box(1.6,.5,.08,new THREE.MeshLambertMaterial({color:0xa8744a}),x,.7,z-.22);[-.65,.65].forEach(o=>box(.08,.45,.4,legMat,x+o,.22,z));col(x-.85,z-.3,x+.85,z+.3);});
const jac=(()=>{const r=mulberry32(707);const blobs=[];for(let i=0;i<7;i++)blobs.push([16+(r()-.5)*16,13+(r()-.5)*10,6+r()*5]);const c=canopy(32,44,blobs,['#4f3a86','#6f55b0','#9478d4','#c0a8f0'],r,[14,24]);const t=ctex(c);
  return{t,w:3.4,h:4.6,m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.12),emissiveMap:t}),f:new THREE.MeshLambertMaterial({map:t,alphaTest:.02,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};})();
const petalMat=(()=>{const c=mk(32,32),x=c.getContext('2d'),r=mulberry32(808);for(let i=0;i<140;i++){const a=r()*6.283,d=Math.sqrt(r())*15;x.fillStyle=r()<.5?'#9478d4':'#b8a0ec';x.fillRect(16+Math.cos(a)*d|0,16+Math.sin(a)*d|0,1,1);}const t=ctex(c);return new THREE.MeshLambertMaterial({map:t,alphaTest:.5});})();
const SP_TREES=[[134,8],[139.5,9.4],[146.5,9.8],[156,8.6],[161.5,9.6],[167,8],[133,4]];
SP_TREES.forEach(([x,z])=>{const g=new THREE.PlaneGeometry(jac.w,jac.h);g.translate(0,jac.h/2,0);const m=new THREE.Mesh(g,jac.m);m.customDepthMaterial=jac.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v:jac,fade:false});col(x-.25,z-.12,x+.25,z+.12);
  const p=flat(3.2,3.2,petalMat,x+.4,.02,z-.3);p.receiveShadow=true;});
// Perth CBD skyline across the river
box(80,.5,3,lmat(grassC,[13,.5]),SPX,-.25,-11.2,{noCast:true});
const SKY=[];(()=>{const winC=(b,w)=>{const c=mk(16,32),x=c.getContext('2d');x.fillStyle=b;x.fillRect(0,0,16,32);x.fillStyle=w;for(let j=2;j<32;j+=4)for(let i=1;i<16;i+=3)x.fillRect(i,j,2,2);return c;};
  const pals=[['#9fb3c8','#d8e6f2'],['#c9d3dc','#7f97ad'],['#7d93a8','#c3d8e8'],['#b8a890','#efe4cf']];const r=mulberry32(909);
  box(80,.4,6,lmat(pathC,[30,3]),SPX,-.2,-15.4,{noCast:true});
  for(let i=0;i<20;i++){const w=1.6+r()*2.2,d=1.6+r()*1.6,h=3+r()*r()*10;const x=118+i*3.4+(r()-.5)*1.2,z=-13.8-r()*2.4;const pl=pals[i%4];
    const t=ctex(winC(pl[0],pl[1]),{rep:[Math.max(1,Math.round(w/1.2)),Math.max(1,Math.round(h/2.2))]});const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({map:t,fog:false}));m.position.set(x,h/2,z);scene.add(m);SKY.push({x,z,w,d});}
  const tw=new THREE.Mesh(new THREE.BoxGeometry(2.4,15,2.4),new THREE.MeshLambertMaterial({map:ctex(winC('#6f86a0','#cfe0ee'),{rep:[2,7]}),fog:false}));tw.position.set(152,7.5,-15.5);scene.add(tw);SKY.push({x:152,z:-15.5,w:2.4,d:2.4});
  const sp=new THREE.Mesh(new THREE.ConeGeometry(.3,3,6),new THREE.MeshLambertMaterial({color:0xdfe6ec,fog:false}));sp.position.set(152,16.5,-15.5);scene.add(sp);
  const bells=new THREE.Mesh(new THREE.CylinderGeometry(.5,.8,4.2,8),new THREE.MeshLambertMaterial({color:0x7fc4d0,fog:false,transparent:true,opacity:.9}));bells.position.set(143,2.1,-11.6);scene.add(bells);
  const bs=new THREE.Mesh(new THREE.ConeGeometry(.5,2.4,8),new THREE.MeshLambertMaterial({color:0x8fd4e0,fog:false}));bs.position.set(143,5.4,-11.6);scene.add(bs);})();

