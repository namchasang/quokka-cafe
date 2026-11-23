/* Kip's café (Paul Perth Library, lib/engines/cafe/kipcafe.js) · Paul, 23 Nov 2026: "Island Builder: ร้านคาเฟ่ ขอร้านใหม่แบบ 3D"
   The game's café model (game part 017, CAFE_PX) as an engine, so the Island Builder draws the same café: pixel-kit walls with arched
   windows and shutters, tiled gable roof with chimney and weathervane, striped valance, posts with lanterns, corner planters, the roofed
   plank floor (no deck in front since 23 Nov 2026), the counter with its coffee machines, the QUOKKA CAFE sign and three tables.
   KipCafe.create({style:'classic'|'cottage'|'riviera'|'ryokan'|'mykonos', gammaOut, front:false = no tables or planters out front}) -> {g, style(name), tick(t)}. Needs PXK (pxkit.js).
   Game units (café 10.4 wide), front (open side) faces +z, centre of the old deck at 0,0. */
(function(){'use strict';
function create(o){o=o||{};const GAMMA=!!o.gammaOut;const PXB_GLOW=[],PXB_LAMPS=[];
const CAFE_PX_LOOK={classic:{wall:'#e8d6aa',kind:'stone',roof:'#b85434',rk:'tile',trim:'#f4ead0',sh:'#3d7a78',st:['#2f8a8a','#f2ead6'],post:'#6a4428'},
  cottage:{wall:'#efe6d2',kind:'stone',roof:'#a88a52',rk:'tile',trim:'#f8f2e2',sh:'#2f5a46',st:['#c8a058','#f4ecd8'],post:'#5a3a22'},
  riviera:{wall:'#f0c4a0',kind:'plaster',roof:'#c2603a',rk:'tile',trim:'#f8e8d4',sh:'#2f78a8',st:['#1d3a6e','#ffffff'],post:'#e8dcc8'},
  ryokan:{wall:'#5a4030',kind:'board',roof:'#3a3e48',rk:'slate',trim:'#d8b88a',sh:'#4a3426',st:['#24305a','#f6ecd6'],post:'#3a2418'},
  mykonos:{wall:'#f8f8f4',kind:'plaster',roof:'#1f5fae',rk:'slate',trim:'#ffffff',sh:'#1f5fae',st:['#1f5fae','#ffffff'],post:'#f8f8f4'}};
const ctex=(c)=>{const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.encoding=GAMMA?THREE.LinearEncoding:THREE.sRGBEncoding;return t;};
const CAFE_PX=(()=>{const g=new THREE.Group();const parts={};const mats=new Map();
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
  (o.front===false?[]:[[-4.85,3.2],[4.85,3.2]]).forEach(([x,z])=>{mesh(new THREE.CylinderGeometry(.24,.18,.4,8),new THREE.MeshLambertMaterial({color:'#b8603a'}),x,.36,z);mesh(new THREE.IcosahedronGeometry(.3,0),new THREE.MeshLambertMaterial({color:'#4f8a3a',flatShading:true}),x,.74,z);
    for(let k=0;k<5;k++)mesh(B(.09,.09,.09),new THREE.MeshLambertMaterial({color:['#e05a6a','#f4d04a','#f0f0f0','#c070e0','#f08a40'][k]}),x+Math.cos(k*1.3)*.22,.92,z+Math.sin(k*1.3)*.22,{nc:1});});
  function style(st){const M=build(st);
    parts.back.material=[M.top,M.top,M.top,M.top,M.back,M.outer];parts.sideL.material=[M.sideL,M.outS,M.top,M.top,M.top,M.top];parts.sideR.material=[M.outS,M.sideR,M.top,M.top,M.top,M.top];
    parts.roof.material=M.roof;parts.ridge.material=M.ridge;parts.ends.forEach(e=>e.material=M.gableEnd);parts.fascia.forEach(f=>f.material=M.ridge);parts.cornice.forEach(c=>c.material=M.trim);parts.quoins.forEach(q=>q.material=M.quoin);
    parts.val.material=M.val;parts.posts.forEach(p=>p.material=M.post);parts.brackets.forEach(b=>b.material=M.post);}
  style('classic');
  /* the rest of the café that the game builds elsewhere: plank floor under the roof, counter, sign, tables */
  const plank=(()=>{const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=['#b98552','#a8774a','#c4925e','#b07c4e'][i%4];x.fillRect(0,i*8,64,8);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,i*8+7,64,1);x.fillRect((i*23)%64,i*8,1,8);}const t=ctex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(10,4);return t;})();
  mesh(B(10.4,.16,4),new THREE.MeshLambertMaterial({map:plank}),0,.08,-3,{nc:1});
  const ctrM=new THREE.MeshLambertMaterial({color:'#8a5a36'});mesh(B(5.4,.9,.7),ctrM,0,.61,-2.55);mesh(B(5.6,.08,.8),new THREE.MeshLambertMaterial({color:'#e8dcc0'}),0,1.1,-2.55,{nc:1});
  [[-1.6,'#c8c8cc'],[0,'#2a2a30'],[1.6,'#e8b030']].forEach(([x,c])=>mesh(B(.5,.5,.4),new THREE.MeshLambertMaterial({color:c}),x,1.39,-2.65));
  {const c=document.createElement('canvas');c.width=192;c.height=40;const x=c.getContext('2d');x.fillStyle='#2c3b38';x.fillRect(0,0,192,40);x.fillStyle='#e2c27c';x.fillRect(0,0,192,2);x.fillRect(0,38,192,2);x.fillStyle='#f6ecd6';x.font='bold 24px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('QUOKKA CAFE',96,21);
    mesh(new THREE.PlaneGeometry(3.6,.75),new THREE.MeshLambertMaterial({map:ctex(c)}),0,2.4,-4.68,{nc:1});}
  const tbl=new THREE.MeshLambertMaterial({color:'#d9b98a'}),leg=new THREE.MeshLambertMaterial({color:'#5a3a22'});
  if(o.front!==false)[[-3.2,.5],[0,1.4],[3.2,.5]].forEach(([x,z])=>{mesh(new THREE.CylinderGeometry(.55,.55,.08,14),tbl,x,.92,z);mesh(new THREE.CylinderGeometry(.07,.12,.76,8),leg,x,.54,z);[-1,1].forEach(s=>mesh(new THREE.CylinderGeometry(.22,.22,.42,10),leg,x+s*.88,.37,z-.25));});
  return{g,parts,style,tick(t){if(parts.vane)parts.vane.rotation.y=Math.sin(t*.13)*.8+Math.sin(t*.47)*.15;}};})();
CAFE_PX.style(o.style||'classic');
/* a host with an sRGB output step (the builder, labs): plain colours are sRGB, so turn them linear once; the game (gammaOut) keeps them */
const fixCols=()=>{if(GAMMA)return;const seen=CAFE_PX.__seen||(CAFE_PX.__seen=new Set());CAFE_PX.g.traverse(c=>{const ms=c.material?(Array.isArray(c.material)?c.material:[c.material]):[];ms.forEach(m=>{if(!m||seen.has(m))return;seen.add(m);if(m.color&&!m.map)m.color.convertSRGBToLinear();});});};
fixCols();const _st=CAFE_PX.style;CAFE_PX.style=n=>{_st(n);fixCols();};
return CAFE_PX;}
window.KipCafe={create};})();
