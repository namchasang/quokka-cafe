// ---------- Kip's café rebuilt with the pixel kit (Look Lab ?pxb): same size, same colliders, open front ----------
// Back façade with arched windows and shutters, side walls with quoins and a cornice, a tiled gable roof with a ridge,
// gold knobs, a chimney and a weathervane, a scalloped striped valance, timber posts with brackets and lanterns, corner planters.
// Every café style recolours it (CAFE_PX_LOOK), and the lit windows and lanterns glow at night through PXB_GLOW.
const PXB_GLOW=[],PXB_LAMPS=[];
const CAFE_PX_LOOK={classic:{wall:'#e8d6aa',kind:'stone',roof:'#b85434',rk:'tile',trim:'#f4ead0',sh:'#3d7a78',st:['#2f8a8a','#f2ead6'],post:'#6a4428'},
  cottage:{wall:'#efe6d2',kind:'stone',roof:'#a88a52',rk:'tile',trim:'#f8f2e2',sh:'#2f5a46',st:['#c8a058','#f4ecd8'],post:'#5a3a22'},
  riviera:{wall:'#f0c4a0',kind:'plaster',roof:'#c2603a',rk:'tile',trim:'#f8e8d4',sh:'#2f78a8',st:['#1d3a6e','#ffffff'],post:'#e8dcc8'},
  ryokan:{wall:'#5a4030',kind:'board',roof:'#3a3e48',rk:'slate',trim:'#d8b88a',sh:'#4a3426',st:['#24305a','#f6ecd6'],post:'#3a2418'},
  mykonos:{wall:'#f8f8f4',kind:'plaster',roof:'#1f5fae',rk:'slate',trim:'#ffffff',sh:'#1f5fae',st:['#1f5fae','#ffffff'],post:'#f8f8f4'}};
const CAFE_PX=PXB_ON?(()=>{const g=new THREE.Group();scene.add(g);const parts={};const mats=new Map();
  const T=(c,o)=>{const t=ctex(c);if(o&&o.rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(o.rep[0],o.rep[1]);}return t;};
  const LM=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(c)},o||{}));
  // a lit material: the same painter twice, the lit pixels that differ become the glow map
  const litMat=(paint)=>{const a=paint(false),b=paint(true),e=document.createElement('canvas');e.width=a.width;e.height=a.height;
    const A=a.getContext('2d').getImageData(0,0,a.width,a.height),B=b.getContext('2d').getImageData(0,0,a.width,a.height),E=e.getContext('2d').createImageData(a.width,a.height);
    for(let q=0;q<A.data.length;q+=4){const d=Math.abs(A.data[q]-B.data[q])+Math.abs(A.data[q+1]-B.data[q+1])+Math.abs(A.data[q+2]-B.data[q+2]);if(d>30){E.data[q]=B.data[q];E.data[q+1]=B.data[q+1];E.data[q+2]=B.data[q+2];}E.data[q+3]=255;}
    e.getContext('2d').putImageData(E,0,0);const m=new THREE.MeshLambertMaterial({map:T(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:T(e)});PXB_GLOW.push(m);return m;};
  const mesh=(geo,mat,x,y,z,o={})=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;m.castShadow=!o.nc;m.receiveShadow=true;m.__pxSkip=1;g.add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  /* faces painted per style */
  function paintBack(L,lit){return PXK.wall(10.4,2.8,{base:L.wall,kind:L.kind,win:0,door:false,seed:31,ivy:null,quoins:L.kind!=='stone'});}
  function back(L){return litMat(lit=>{const c=paintBack(L,lit),x=c.getContext('2d');PXK.seed(41);
    // two tall arched windows either side of the shelf, shutters, flower boxes; a lantern bracket either side of the sign
    [[-3.95],[3.95]].forEach(([wx])=>{const X=Math.round((wx+5.2)*32)-13;PXK.win(x,X,24,26,34,{arch:true,shutter:L.sh,lit,box:true});});
    [[-2.45],[2.45]].forEach(([lx])=>{const X=Math.round((lx+5.2)*32);PXK.P(x,'#2a2230',X-3,14,6,9);PXK.P(x,lit?'#ffe8a8':'#e8d8a8',X-2,15,4,7);PXK.P(x,'#2a2230',X-1,10,2,4);});
    // a tiled dado behind the counter
    for(let X=0;X<c.width;X+=8){const f=(X/8)%2?'#3d7a78':'#f2ead6';PXK.P(x,L.kind==='board'?PXK.sh(L.wall,.8):f,X,c.height-30,8,6);}PXK.P(x,'#2a2230',0,c.height-31,c.width,1);
    return c;});}
  function side(L,k){return litMat(lit=>{const c=PXK.wall(2.6,2.8,{base:L.wall,kind:L.kind,win:0,seed:51+k,quoins:L.kind!=='stone'}),x=c.getContext('2d');PXK.win(x,30,30,22,28,{arch:k%2===0,shutter:L.sh,lit,box:true});
    if(k===1)PXK.ivy(x,c.width-34,30,c.height);return c;});}
  function plainWall(L,w,h,s){return LM(PXK.wall(w,h,{base:L.wall,kind:L.kind,win:0,seed:s}));}
  /* roof: a gable along x with real UVs, tiles keep their pixel size */
  function gableGeo(w,d,rise){const hw=w/2,hd=d/2,sl=Math.hypot(hd,rise),pos=[],uv=[],idx=[];const quad=(a,b,c,e)=>{const n=pos.length/3;pos.push(...a,...b,...c,...e);uv.push(0,0,1,0,1,1,0,1);idx.push(n,n+1,n+2,n,n+2,n+3);};
    quad([-hw,0,hd],[hw,0,hd],[hw,rise,0],[-hw,rise,0]);quad([hw,0,-hd],[-hw,0,-hd],[-hw,rise,0],[hw,rise,0]);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();geo.userData.sl=sl;return geo;}
  const RW=11.2,RD=3.5,RISE=.95,RY=2.94,RZ=-3.45;
  const roofGeo=gableGeo(RW,RD,RISE);
  /* scalloped valance: stripes with a wavy lower edge (cut out) */
  function valance(L){const W=Math.round(RW*32),H=12,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
    for(let X=0;X<W;X+=8){x.fillStyle=(X/8)%2?L.st[1]:L.st[0];x.fillRect(X,0,8,H);}x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,0,W,1);
    x.globalCompositeOperation='destination-out';for(let X=0;X<W;X+=8){x.beginPath();x.arc(X+8,H+2,4.6,0,7);x.fill();}x.globalCompositeOperation='source-over';
    x.fillStyle='#2a2230';for(let X=0;X<W;X+=8){x.fillRect(X+3,H-4,2,1);}return LM(c,{transparent:true,alphaTest:.5,side:THREE.DoubleSide});}
  function build(st){const L=CAFE_PX_LOOK[st]||CAFE_PX_LOOK.classic;if(mats.has(st))return mats.get(st);
    const M={back:back(L),sideL:side(L,0),sideR:side(L,1),outer:litMat(lit=>PXK.wall(10.4,2.8,{base:L.wall,kind:L.kind,win:5,lit,shutter:L.sh,arch:true,seed:61,ivy:[.62,.2],quoins:L.kind!=='stone'})),outS:litMat(lit=>PXK.wall(2.6,2.8,{base:L.wall,kind:L.kind,win:1,lit,shutter:L.sh,seed:62,quoins:L.kind!=='stone'})),top:new THREE.MeshLambertMaterial({color:new THREE.Color(L.wall).multiplyScalar(.85)}),
      roof:LM(PXK.roof(RW,roofGeo.userData.sl,{base:L.roof,kind:L.rk,seed:71}),{side:THREE.DoubleSide}),ridge:new THREE.MeshLambertMaterial({color:new THREE.Color(L.roof).multiplyScalar(.62)}),
      gableEnd:LM(PXK.wall(RD,RISE,{base:L.wall,kind:L.kind,win:0,plinth:false,cornice:false,moss:false,quoins:false,seed:81})),
      trim:LM((()=>{const[c,x]=PXK.cv(64,8);PXK.cornice(x,64,8,L.trim);return c;})()),post:new THREE.MeshLambertMaterial({color:L.post}),val:valance(L),
      quoin:LM((()=>{const[c,x]=PXK.cv(8,90);PXK.P(x,PXK.sh(L.trim,.55),0,0,8,90);for(let y=0,k=0;y<90;y+=8,k++){PXK.P(x,PXK.sh(L.trim,k%2?1:.94),0,y,8,7);PXK.P(x,PXK.sh(L.trim,1.08),0,y,8,1);}return c;})())};
    mats.set(st,M);return M;}
  /* geometry, once */
  parts.back=mesh(B(10.4,2.8,.3),null,0,1.56,-4.85);
  parts.sideL=mesh(B(.3,2.8,2.6),null,-5.05,1.56,-3.6);parts.sideR=mesh(B(.3,2.8,2.6),null,5.05,1.56,-3.6);
  parts.roof=mesh(roofGeo,null,0,RY,RZ);parts.ridge=mesh(B(RW+.06,.14,.2),null,0,RY+RISE+.02,RZ);
  parts.ends=[-1,1].map(s=>{const sh=new THREE.Shape();sh.moveTo(-RD/2+.2,0);sh.lineTo(RD/2-.2,0);sh.lineTo(0,RISE*.88);sh.closePath();const gt=new THREE.ShapeGeometry(sh);const uv=gt.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(uv.getX(i)+RD/2)/RD,uv.getY(i)/RISE);
    return mesh(gt,null,s*5.2,RY,RZ,{ry:s*Math.PI/2});});
  parts.fascia=[RD/2,-RD/2].map(o=>mesh(B(RW,.12,.08),null,0,RY-.03,RZ+o,{nc:1}));
  parts.cornice=[mesh(B(10.6,.22,.42),null,0,2.88,-4.82),mesh(B(.42,.22,2.7),null,-5.05,2.88,-3.6),mesh(B(.42,.22,2.7),null,5.05,2.88,-3.6)];
  parts.quoins=[[-5.25,-4.98],[5.25,-4.98],[-5.25,-2.28],[5.25,-2.28]].map(([x,z])=>mesh(B(.16,2.62,.16),null,x,1.45,z,{nc:1}));
  parts.val=mesh(new THREE.PlaneGeometry(RW,.38),null,0,RY-.16,RZ+RD/2+.03,{nc:1});
  parts.posts=[-5.3,5.3].map(x=>mesh(B(.14,2.8,.14),null,x,1.5,RZ+RD/2-.1));
  parts.brackets=[-5.3,5.3].map(x=>mesh(B(.1,.5,.1),null,x+(x<0?.22:-.22),2.68,RZ+RD/2-.1,{rz:x<0?-.7:.7,nc:1}));
  // chimney, gold knobs on the gable ends, a weathervane on the ridge
  const brick=LM((()=>{const[c,x]=PXK.cv(20,40);PXK.bricks(x,20,40,'#9a4e34');return c;})());
  mesh(B(.55,1.2,.55),brick,3.4,RY+RISE*.55+.4,RZ-.8);mesh(B(.66,.12,.66),new THREE.MeshLambertMaterial({color:'#6a3426'}),3.4,RY+RISE*.55+1.03,RZ-.8,{nc:1});
  const gold=new THREE.MeshLambertMaterial({color:'#e2b04a'});[-1,1].forEach(s=>mesh(new THREE.SphereGeometry(.12,6,4),gold,s*(RW/2+.02),RY+RISE+.12,RZ,{nc:1}));
  {const vx=-2.6,vy=RY+RISE;mesh(B(.04,.7,.04),gold,vx,vy+.35,RZ,{nc:1});const arrow=new THREE.Group();arrow.position.set(vx,vy+.62,RZ);g.add(arrow);const a=new THREE.Mesh(B(.6,.04,.04),gold);arrow.add(a);const tip=new THREE.Mesh(new THREE.ConeGeometry(.07,.16,4),gold);tip.rotation.z=-Math.PI/2;tip.position.x=.32;arrow.add(tip);
    const tail=new THREE.Mesh(B(.04,.18,.16),gold);tail.position.x=-.3;arrow.add(tail);parts.vane=arrow;}
  // lanterns on the posts and two planters at the deck's front corners
  [-5.3,5.3].forEach(x=>{mesh(B(.22,.3,.22),new THREE.MeshLambertMaterial({color:'#2a2a30'}),x,2.25,RZ+RD/2+.08,{nc:1});const l=mesh(B(.15,.2,.15),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),x,2.25,RZ+RD/2+.08,{nc:1});PXB_LAMPS.push(l);});
  [[-4.85,3.2],[4.85,3.2]].forEach(([x,z])=>{mesh(new THREE.CylinderGeometry(.24,.18,.4,8),new THREE.MeshLambertMaterial({color:'#b8603a'}),x,.36,z);mesh(new THREE.IcosahedronGeometry(.3,0),new THREE.MeshLambertMaterial({color:'#4f8a3a',flatShading:true}),x,.74,z);
    for(let k=0;k<5;k++)mesh(B(.09,.09,.09),new THREE.MeshLambertMaterial({color:['#e05a6a','#f4d04a','#f0f0f0','#c070e0','#f08a40'][k]}),x+Math.cos(k*1.3)*.22,.92,z+Math.sin(k*1.3)*.22,{nc:1});});
  function style(st){const M=build(st);
    parts.back.material=[M.top,M.top,M.top,M.top,M.back,M.outer];parts.sideL.material=[M.sideL,M.outS,M.top,M.top,M.top,M.top];parts.sideR.material=[M.outS,M.sideR,M.top,M.top,M.top,M.top];
    parts.roof.material=M.roof;parts.ridge.material=M.ridge;parts.ends.forEach(e=>e.material=M.gableEnd);parts.fascia.forEach(f=>f.material=M.ridge);parts.cornice.forEach(c=>c.material=M.trim);parts.quoins.forEach(q=>q.material=M.quoin);
    parts.val.material=M.val;parts.posts.forEach(p=>p.material=M.post);parts.brackets.forEach(b=>b.material=M.post);}
  style('classic');
  return{g,parts,style,tick(t){if(parts.vane)parts.vane.rotation.y=Math.sin(t*.13)*.8+Math.sin(t*.47)*.15;}};})():null;
// the plain kiosk walls and the striped awning step aside for the rebuilt café
if(CAFE_PX){[...scene.children].forEach(o=>{if(!o.isMesh||o.material!==wallMat)return;o.visible=false;});awn.visible=false;}
// jetty + ferry
box(JETTY.x2-JETTY.x1+.4,.14,1.3,lmat(deckC,[5,1]),(JETTY.x1+JETTY.x2)/2-.2,.04,5,{noCast:true});
for(let i=0;i<6;i++)[4.4,5.6].forEach(z=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,1,6),legMat);p.position.set(-13.4-i*1.6,-.3,z);scene.add(p);});
const ferry=new THREE.Group();
(()=>{const hull=new THREE.Mesh(new THREE.BoxGeometry(4.6,.8,1.8),new THREE.MeshLambertMaterial({color:0xf3efe6}));hull.position.y=.1;hull.castShadow=true;ferry.add(hull);
 const stripe=new THREE.Mesh(new THREE.BoxGeometry(4.62,.18,1.82),new THREE.MeshLambertMaterial({color:0x2f6fb0}));stripe.position.y=-.1;ferry.add(stripe);
 const cab=new THREE.Mesh(new THREE.BoxGeometry(2,.8,1.3),new THREE.MeshLambertMaterial({color:0xf8f4ea}));cab.position.set(-.4,.9,0);cab.castShadow=true;ferry.add(cab);
 const win=new THREE.Mesh(new THREE.BoxGeometry(2.02,.25,1.32),new THREE.MeshLambertMaterial({color:0x3a5470}));win.position.set(-.4,1.05,0);ferry.add(win);
 const fl=new THREE.Mesh(new THREE.BoxGeometry(.06,.9,.06),legMat);fl.position.set(1.4,1.2,0);ferry.add(fl);})();
ferry.position.set(-18.8,-.15,6.8);scene.add(ferry);
// lighthouse
(()=>{const lx=33.5,lz=-6.3;const t=new THREE.Mesh(new THREE.CylinderGeometry(.95,1.35,6.2,14),lmat(plasterC,[4,4]));t.position.set(lx,3.1,lz);t.castShadow=t.receiveShadow=true;scene.add(t);
 const band=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.25,.4,14),new THREE.MeshLambertMaterial({color:0xc9473f}));band.position.set(lx,1.2,lz);scene.add(band);
 const gal=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.3,.15,14),new THREE.MeshLambertMaterial({color:0x2a2a30}));gal.position.set(lx,6.25,lz);gal.castShadow=true;scene.add(gal);
 const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.9,10),new THREE.MeshBasicMaterial({color:0xfff0b0}));lamp.position.set(lx,6.8,lz);scene.add(lamp);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(.95,.9,12),new THREE.MeshLambertMaterial({color:0xc9473f}));roof.position.set(lx,7.7,lz);roof.castShadow=true;scene.add(roof);
 const door=new THREE.Mesh(new THREE.PlaneGeometry(.6,1.1),new THREE.MeshLambertMaterial({color:0x2f6fb0}));door.position.set(lx,.55,lz+1.31);scene.add(door);
 col(lx-1.35,lz-1.35,lx+1.35,lz+1.35);})();
// pink salt lake
col(38.9,-8.9,45.5,-6.1);

// upgrades (hidden until bought)
const HAMMOCK={x:7.6,z:-3.2};
const hammock=new THREE.Group();(()=>{[-1.3,1.3].forEach(s=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,1.6,8),legMat);p.position.set(s,.8,0);p.castShadow=true;hammock.add(p);});
 const net=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,2.4,12,1,true,Math.PI*.15,Math.PI*.7),new THREE.MeshLambertMaterial({color:0xef7d5e,side:THREE.DoubleSide}));net.rotation.z=Math.PI/2;net.rotation.x=Math.PI;net.position.y=1.15;net.castShadow=true;hammock.add(net);})();
hammock.position.set(HAMMOCK.x,0,HAMMOCK.z);hammock.visible=false;scene.add(hammock);
const HUT={x:-8.6,z:-5};
const hut=new THREE.Group();(()=>{const w=new THREE.Mesh(new THREE.BoxGeometry(3,2,2.6),lmat(plasterC,[2,2]));w.position.y=1;w.castShadow=w.receiveShadow=true;hut.add(w);
 const roof=new THREE.Mesh(new THREE.CylinderGeometry(1.9,1.9,3.3,3),new THREE.MeshLambertMaterial({color:0xc9473f}));roof.rotation.z=Math.PI/2;roof.position.y=2.55;roof.scale.set(1,1,.62);roof.castShadow=true;hut.add(roof);
 const d=new THREE.Mesh(new THREE.PlaneGeometry(.7,1.2),new THREE.MeshLambertMaterial({color:0x2f6fb0}));d.position.set(.5,.6,1.31);hut.add(d);
 const wi=new THREE.Mesh(new THREE.PlaneGeometry(.6,.5),new THREE.MeshBasicMaterial({color:0xffe9a8}));wi.position.set(-.7,1.2,1.31);hut.add(wi);})();
hut.position.set(HUT.x,0,HUT.z);hut.visible=false;scene.add(hut);

// lore stones
const LORE=[
 {x:11,z:-5.6,title:'Island stone',lines:['The stone is worn smooth by thousands of years of sea wind.','This island is older than any lighthouse, any jetty, any café.','Kip: Thousands of years… and I just got here. I like that. It feels like home already.']},
 {x:21,z:6.4,title:'Rotte nest',lines:['A weathered stone with a Dutch ship scratched into it.','In 1696, Captain Willem de Vlamingh saw the island’s furry locals and took them for giant rats. He named the place “Rotte nest”: rat’s nest.','Kip: Rats?! We’re quokkas. Rude.']},
 {x:41.4,z:-5.2,title:'Pink lakes',lines:['This stone faces the salt lake.','The island’s salt lakes can turn pink, coloured by tiny algae that thrive in very salty water.','Kip: A pink lake… Mum would love this view.']}];
const stoneMat=lmat(stoneC,[1,2]);const runeMat=new THREE.MeshBasicMaterial({color:0x8fe8ff});
const loreSparks=[];
LORE.forEach((L,i)=>{const s=box(.8,1.4,.4,stoneMat,L.x,.7,L.z);s.rotation.y=(R()-.5)*.3;col(L.x-.45,L.z-.25,L.x+.45,L.z+.25);
  const rune=new THREE.Mesh(new THREE.PlaneGeometry(.3,.5),runeMat.clone());rune.position.set(L.x,.85,L.z+.21);scene.add(rune);L.rune=rune;
  const sp=spriteMesh([iconCanvas('spark')],.45,.45,{basic:true,shadow:false});sp.position.set(L.x,1.7,L.z);scene.add(sp);loreSparks.push(sp);});

