// ---------- café levels and styles ----------
const CAFE_STYLES={
 classic:{name:'Classic Rotto',desc:'The original seaside kiosk: teal boards and a red-striped awning.',price:0,sw:['#7fb3ad','#e2584f','#b98552'],table:'#d9b98a',seat:'#5a3a22',sign:['#2c3b38','#f6ecd6']},
 cottage:{name:'English Cottage',desc:'Whitewashed stone, a thatched awning, roses and flagstones.',price:250,sw:['#efe6d2','#c8a058','#9a9488'],table:'#f6f2e8',seat:'#2f5a46',sign:['#2f5a46','#f6ecd6']},
 riviera:{name:'French Riviera',desc:'Warm stucco, navy stripes, terracotta tiles and potted lemon trees.',price:250,sw:['#f0c4a0','#1d3a6e','#c2603a'],table:'#f6f6f0',seat:'#3e7d5c',sign:['#1d3a6e','#ffffff']},
 ryokan:{name:'Japanese Ryokan',desc:'Cedar and shoji screens, a tiled roof, red lanterns and bamboo.',price:250,sw:['#4a3426','#3a3e48','#d8b88a'],table:'#5a3a22',seat:'#c8344a',sign:['#1a1a1f','#f6ecd6']},
 mykonos:{name:'Seaside Mykonos',desc:'Whitewash and Aegean blue, bougainvillea and a little blue dome.',price:250,sw:['#f8f8f4','#1f5fae','#e9eef4'],table:'#f8f8f4',seat:'#1f5fae',sign:['#1f5fae','#ffffff']}};
const CAFE_LV=[{n:'Kiosk',price:0,fx:'3 tables'},{n:'Café',price:450,fx:'+1 table and +1 coin tip on every order'},{n:'Bistro',price:900,fx:'+1 table, every menu item earns +1 coin, flower boxes'},{n:'Destination café',price:1500,fx:'Front terrace with +1 table, 20% more customers per ferry, roof garden'}];
function texWall(st){const c=mk(16,16),x=c.getContext('2d'),r=mulberry32(77+st.length);
  if(st==='cottage'){x.fillStyle='#e9e0cc';x.fillRect(0,0,16,16);x.fillStyle='#d6ccb6';for(let j=0;j<4;j++)for(let i=0;i<3;i++){const o=j%2?3:0;x.fillRect((i*6+o)%16,j*4+3,5,1);x.fillRect((i*6+o+5)%16,j*4,1,4);}x.fillStyle='#f6f1e4';for(let i=0;i<10;i++)x.fillRect(r()*16|0,r()*16|0,2,1);}
  else if(st==='riviera'){x.fillStyle='#f0c4a0';x.fillRect(0,0,16,16);for(let i=0;i<30;i++){x.fillStyle=r()<.5?'#e8b890':'#f6d2b2';x.fillRect(r()*16|0,r()*16|0,1,1);}}
  else if(st==='ryokan'){x.fillStyle='#f4efe2';x.fillRect(0,0,16,16);x.fillStyle='#4a3426';x.fillRect(0,0,16,2);x.fillRect(0,14,16,2);x.fillRect(0,0,2,16);x.fillRect(7,0,2,16);x.fillStyle='#8a6a4a';x.fillRect(2,8,5,1);x.fillRect(9,8,5,1);x.fillRect(4,2,1,12);x.fillRect(11,2,1,12);}
  else if(st==='mykonos'){x.fillStyle='#f8f8f4';x.fillRect(0,0,16,16);for(let i=0;i<20;i++){x.fillStyle=r()<.5?'#eef0f2':'#ffffff';x.fillRect(r()*16|0,r()*16|0,2,1);}}
  else return wallC;return c;}
function texAwn(st){const c=mk(16,16),x=c.getContext('2d');
  if(st==='cottage'){x.fillStyle='#c8a058';x.fillRect(0,0,16,16);const r=mulberry32(5);for(let i=0;i<40;i++){x.fillStyle=r()<.5?'#a8803a':'#e0bc70';x.fillRect(r()*16|0,r()*16|0,1,3);}}
  else if(st==='riviera'){for(let i=0;i<4;i++){x.fillStyle=i%2?'#ffffff':'#1d3a6e';x.fillRect(i*4,0,4,16);}}
  else if(st==='ryokan'){x.fillStyle='#3a3e48';x.fillRect(0,0,16,16);x.fillStyle='#4e5360';for(let j=0;j<16;j+=4)for(let i=0;i<16;i+=4)x.fillRect(i+(j%8?2:0),j,3,3);x.fillStyle='#2a2d36';for(let j=3;j<16;j+=4)x.fillRect(0,j,16,1);}
  else if(st==='mykonos'){x.fillStyle='#1f5fae';x.fillRect(0,0,16,16);x.fillStyle='#ffffff';x.fillRect(0,13,16,2);}
  else return awnC;x.fillStyle='rgba(0,0,0,.12)';x.fillRect(0,15,16,1);return c;}
function texDeck(st){const c=mk(16,16),x=c.getContext('2d');
  if(st==='cottage'){x.fillStyle='#7a766c';x.fillRect(0,0,16,16);[['#9a9488',0,0,7,5],['#a8a296',8,0,8,6],['#8e897e',0,6,5,5],['#a39d90',6,7,6,4],['#9a9488',13,7,3,5],['#a8a296',0,12,9,4],['#928d82',10,12,6,4]].forEach(([cc,a,b,w,h])=>{x.fillStyle=cc;x.fillRect(a,b,w-1,h-1);});}
  else if(st==='riviera'){x.fillStyle='#e8dcc8';x.fillRect(0,0,16,16);for(let j=0;j<2;j++)for(let i=0;i<2;i++){x.fillStyle=(i+j)%2?'#cf9a78':'#c08868';x.fillRect(i*8,j*8,7,7);}}
  else if(st==='ryokan')return planks(['#d8b88a','#cfae7e','#e0c294','#d4b282'],'#9a7a52',false,61);
  else if(st==='mykonos'){for(let j=0;j<4;j++)for(let i=0;i<4;i++){x.fillStyle=(i+j)%2?'#e9eef4':'#ffffff';x.fillRect(i*4,j*4,4,4);}x.fillStyle='#3a7ac8';x.fillRect(7,7,2,2);x.fillRect(0,0,1,1);x.fillRect(15,15,1,1);}
  else return deckC;return c;}
function texCounter(st){if(st==='cottage')return planks(['#5a3a22','#4e321e','#663f26'],'#2e1c10',true,63);if(st==='riviera')return planks(['#8fc8b0','#84bda5','#9ad2ba'],'#5a907a',true,64);if(st==='ryokan')return planks(['#4a3426','#402c20','#54392a'],'#24180f',true,65);if(st==='mykonos')return planks(['#2f78a8','#2a6e9c','#3584b4'],'#1d4e74',true,66);return counterC;}
const STYLE_DECOR={};const LV_DECOR={2:[],3:[],4:[]};
(()=>{const add=(st,o)=>{o.visible=false;scene.add(o);(STYLE_DECOR[st]=STYLE_DECOR[st]||[]).push(o);};const M=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  // cottage: roses and lavender
  [[-4.9,2.6],[4.9,2.6],[-4.9,-.8],[4.9,-.8]].forEach(([x,z])=>{const g=new THREE.Group();for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.16,6,6),M(i%2?'#e8457a':'#f2a0c0'));b.position.set(x+(i%3-1)*.2,.45+Math.floor(i/3)*.2,z+(i%2-.5)*.2);g.add(b);}const lf=new THREE.Mesh(new THREE.SphereGeometry(.32,6,6),M('#3e7a34'));lf.position.set(x,.3,z);g.add(lf);add('cottage',g);});
  // riviera: lemon trees and blue shutters
  [[-4.7,1.2],[4.7,1.2]].forEach(([x,z])=>{const g=new THREE.Group();const pot=new THREE.Mesh(new THREE.CylinderGeometry(.28,.22,.5,8),M('#c2603a'));pot.position.set(x,.33,z);g.add(pot);const tr=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.8,5),M('#6b4428'));tr.position.set(x,.95,z);g.add(tr);const cr=new THREE.Mesh(new THREE.SphereGeometry(.45,8,8),M('#4f8f40'));cr.position.set(x,1.5,z);g.add(cr);for(let i=0;i<6;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.07,6,6),M('#f4e04a'));const a=i*1.05;l.position.set(x+Math.cos(a)*.38,1.5+Math.sin(a*1.7)*.2,z+Math.sin(a)*.38);g.add(l);}add('riviera',g);});
  [-3.6,3.6].forEach(x=>[-.55,.55].forEach(o=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(.35,1),M('#2f78a8'));p.position.set(x+o,1.8,-4.68);add('riviera',p);}));
  // ryokan: lanterns, noren, bamboo
  [-4.4,-1.4,1.4,4.4].forEach(x=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.38,10),new THREE.MeshLambertMaterial({color:0xd8342a,emissive:0x661a10}));l.position.set(x,2.45,-2.1);add('ryokan',l);});
  (()=>{const c=mk(32,16),x=c.getContext('2d');x.fillStyle='#24305a';x.fillRect(0,0,32,16);x.fillStyle='#f6ecd6';for(let i=1;i<4;i++)x.fillRect(i*8,0,1,16);x.beginPath();x.arc(16,8,4,0,6.283);x.fill();const n=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.9),new THREE.MeshLambertMaterial({map:ctex(c),side:THREE.DoubleSide}));n.position.set(0,2.3,-4.6);add('ryokan',n);})();
  [[-5,2.9],[5,2.9]].forEach(([x,z])=>{const g=new THREE.Group();for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2+i*.3,6),M(i%2?'#6aa04a':'#86b86e'));b.position.set(x+(i%2-.5)*.25,1+i*.15,z+(i>1?.2:-.2));g.add(b);}add('ryokan',g);});
  // mykonos: bougainvillea and blue dome
  [[-5,0],[5,0],[-5,-3],[5,-3]].forEach(([x,z])=>{const g=new THREE.Group();for(let i=0;i<9;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.17,6,6),M(i%3?'#d8308a':'#e85aa8'));b.position.set(x,1.4+(i%3)*.45,z+Math.floor(i/3)*.3-.3);g.add(b);}add('mykonos',g);});
  (()=>{const d=new THREE.Mesh(new THREE.SphereGeometry(.9,14,8,0,6.283,0,Math.PI/2),M('#1f5fae'));d.position.set(0,3.25,-4.4);add('mykonos',d);const b=new THREE.Mesh(new THREE.CylinderGeometry(.92,.92,.4,14),M('#f8f8f4'));b.position.set(0,3.1,-4.4);add('mykonos',b);})();
  // level 2: extra string lights; level 3: flower boxes; level 4: front terrace + roof garden
  const lv=(n,o)=>{o.visible=false;scene.add(o);LV_DECOR[n].push(o);};
  for(let i=0;i<9;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.06,6,6),new THREE.MeshBasicMaterial({color:[0xffe9a8,0xffc8e0,0xc8f0ff][i%3]}));b.position.set(-4+i,2.2-Math.sin(i/8*Math.PI)*.2,.2);lv(2,b);}
  [-2.8,2.8].forEach(x=>{const g=new THREE.Group();const bx=new THREE.Mesh(new THREE.BoxGeometry(1.8,.25,.3),M('#8a5a36'));bx.position.set(x,1.25,-4.55);g.add(bx);for(let i=0;i<6;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.1,6,6),M(['#e8457a','#f1c64a','#ffffff'][i%3]));f.position.set(x-.75+i*.3,1.43,-4.5);g.add(f);}lv(3,g);});
  const ter=new THREE.Mesh(new THREE.BoxGeometry(6,.16,1.9),deckMat);ter.position.set(0,.08,4.55);ter.receiveShadow=true;lv(4,ter);
  for(let i=0;i<12;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.5,.06),fenceMat);p.position.set(-2.95+i*.536,.4,5.45);lv(4,p);}
  const rg=new THREE.Group();for(let i=0;i<10;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.22,6,6),M(i%2?'#4f8f40':'#6aa04a'));b.position.set(-4.5+i,3.35,-4.7);rg.add(b);}lv(4,rg);})();
// level 4: second storey
const UP={y0:2.95,h:2.2,z:-4.05,d:1.8,w:10.4};
const upRoofMat=new THREE.MeshLambertMaterial({color:0xe2584f}),upTrimMat=new THREE.MeshLambertMaterial({color:0xf6f2e8}),upWinMat=new THREE.MeshLambertMaterial({color:0x4a6a86,emissive:0x0d1a26});
const upper=new THREE.Group();const upRoof=new THREE.Group();const upFlat=new THREE.Group();
(()=>{const body=new THREE.Mesh(new THREE.BoxGeometry(UP.w,UP.h,UP.d),wallMat);body.position.set(0,UP.y0+UP.h/2,UP.z);body.castShadow=body.receiveShadow=true;upper.add(body);
  const floor=new THREE.Mesh(new THREE.BoxGeometry(UP.w+.2,.16,UP.d+.2),upTrimMat);floor.position.set(0,UP.y0,UP.z);upper.add(floor);
  [-3.9,-1.3,1.3,3.9].forEach(x=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),upWinMat);w.position.set(x,UP.y0+1.15,UP.z+UP.d/2+.01);upper.add(w);const f=new THREE.Mesh(new THREE.BoxGeometry(1.26,.1,.08),upTrimMat);f.position.set(x,UP.y0+.56,UP.z+UP.d/2+.05);upper.add(f);const f2=f.clone();f2.position.y=UP.y0+1.74;upper.add(f2);[-.6,.6].forEach(o=>{const v=new THREE.Mesh(new THREE.BoxGeometry(.08,1.26,.08),upTrimMat);v.position.set(x+o,UP.y0+1.15,UP.z+UP.d/2+.05);upper.add(v);});const m=new THREE.Mesh(new THREE.BoxGeometry(.06,1.1,.06),upTrimMat);m.position.set(x,UP.y0+1.15,UP.z+UP.d/2+.04);upper.add(m);});
  const bal=new THREE.Mesh(new THREE.BoxGeometry(UP.w,.1,.7),upTrimMat);bal.position.set(0,UP.y0+.1,UP.z+UP.d/2+.35);upper.add(bal);
  for(let i=0;i<=20;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.05,.6,.05),upTrimMat);p.position.set(-UP.w/2+i*UP.w/20,UP.y0+.42,UP.z+UP.d/2+.68);upper.add(p);}const rl=new THREE.Mesh(new THREE.BoxGeometry(UP.w,.06,.08),upTrimMat);rl.position.set(0,UP.y0+.74,UP.z+UP.d/2+.68);upper.add(rl);
  const rw=UP.w+.5;const r=new THREE.Mesh(new THREE.ConeGeometry(rw/Math.SQRT2,1.3,4),upRoofMat);r.rotation.y=Math.PI/4;r.castShadow=true;const rp=new THREE.Group();rp.add(r);rp.scale.set(1,1,(UP.d+.7)/rw);rp.position.set(0,UP.y0+UP.h+.65,UP.z);upRoof.add(rp);upper.add(upRoof);
  const par=new THREE.Mesh(new THREE.BoxGeometry(UP.w+.2,.35,UP.d+.2),upTrimMat);par.position.set(0,UP.y0+UP.h+.17,UP.z);upFlat.add(par);upper.add(upFlat);
  for(let i=0;i<9;i++){const st=new THREE.Mesh(new THREE.BoxGeometry(.9,.12,.4),upTrimMat);st.position.set(5.75,.2+i*.32,-1.2-i*.38);st.castShadow=true;upper.add(st);}const sr=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,3.6),upTrimMat);sr.position.set(6.2,1.9,-2.7);sr.rotation.x=.69;upper.add(sr);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.6),new THREE.MeshLambertMaterial({map:signTex,emissive:0x333333,emissiveMap:signTex}));sg.position.set(0,UP.y0+UP.h-.3,UP.z+UP.d/2+.02);sg.scale.setScalar(.9);
  upper.visible=false;scene.add(upper);})();
const UP_ROOF={classic:'#e2584f',cottage:'#c8a058',riviera:'#c2603a',ryokan:'#3a3e48',mykonos:'#f8f8f4'},UP_WIN={classic:'#f6f2e8',cottage:'#2f5a46',riviera:'#2f78a8',ryokan:'#4a3426',mykonos:'#1f5fae'};
// stairs collider (level 4)
const stairCol={x1:1e9,z1:1e9,x2:1e9,z2:1e9,real:[5.25,-4.6,6.25,-1],lvl:99};
// extra tables for levels 2-4
const LV_TABLES=[[2,-2,2.75],[3,2,2.75],[4,0,4.55]];const lvCols=[];
colliders.push(stairCol);
LV_TABLES.forEach(([lvN,x,z])=>{const g=new THREE.Group();const top=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.08,14),tableMat);top.position.set(x,.92,z);top.castShadow=true;g.add(top);const leg=new THREE.Mesh(new THREE.CylinderGeometry(.07,.12,.76,8),legMat);leg.position.set(x,.54,z);g.add(leg);
  [-1,1].forEach(s=>{const st=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.42,10),seatMat);st.position.set(x+s*.88,.37,z-.25);g.add(st);SEATS.push({x:x+s*.88,z:z-.18,busy:false,lvl:lvN});});
  g.visible=false;scene.add(g);LV_DECOR[lvN].push(g);const c={x1:1e9,z1:1e9,x2:1e9,z2:1e9,real:[x-.55,z-.55,x+.55,z+.55],lvl:lvN};colliders.push(c);lvCols.push(c);});

signPost(-6.4,.6,makeSign(['CAFE','PLANS'],40,20,'#2c3b38','#e2c27c'),.9,.4);
