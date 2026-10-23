// ---------- Mill Point Road continues east: Angelo Street shops ----------
box(32,.5,14.6,lmat(paveC,[16,7]),184.5,-.26,16.9,{noCast:true});flat(31,10,lmat(grassC,[5,1.6]),184.5,.009,15);
flat(31,2.4,lmat(asphC,[15.5,1.2]),184.5,.02,22.2);flat(31,.6,lmat(pathC,[15.5,.3]),184.5,.024,20.7);flat(31,.6,lmat(pathC,[15.5,.3]),184.5,.024,23.7);
for(let x=170;x<200;x+=2.4)flat(1.1,.1,new THREE.MeshLambertMaterial({color:0xf3efe6}),x,.026,22.2);
flat(1.6,10,lmat(pavC,[1,6]),178,.022,15.4);
const ANGELO=[[172.6,'ANGELO ST BAKEHOUSE','#c8344a','#fbe9cf'],[183.4,'SANDGATE BOOKS','#2f5a8a','#eef2f4'],[188.2,'MILL POINT PHARMACY','#3e7d5c','#f6f6f0'],[193.4,'CORNER CAFE','#e8a33a','#fff3d6']];
ANGELO.forEach(([x,n,c,w])=>{const g=bld(x,16.4,4.4,2.8,2.8,w,{ver:c,sign:n,signBg:c,noCol:true});col(x-2.2,15,x+2.2,17.8);fadeGroup(g);});
signPost(178,20.2,makeSign(['ANGELO ST'],40,12,'#2f5a8a','#ffffff'),1.6,.3);
[[176.4,18.8],[198,18.8],[174,25],[184,25],[194,25]].forEach(([x,z])=>{const g=new THREE.PlaneGeometry(plane.w,plane.h);g.translate(0,plane.h/2,0);const m=new THREE.Mesh(g,plane.m);m.customDepthMaterial=plane.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v:plane,fade:false});col(x-.2,z-.1,x+.2,z+.1);});
for(let i=0;i<14;i++){const fx=170+i*2.2;if(Math.abs(fx-178)<1.5)continue;const p=new THREE.Mesh(new THREE.BoxGeometry(.07,.45,.07),fenceMat);p.position.set(fx,.23,10.4);scene.add(p);}col(169,10.25,176.9,10.55);col(179.1,10.25,199,10.55);

// south side of Mill Point Road: houses and gardens instead of open water
box(88,.5,9,lmat(stoneC,[40,4]),156,-.26,28.4,{noCast:true});flat(88,8.4,lmat(grassC,[14,1.4]),156,.009,28.6);flat(88,.6,lmat(pathC,[44,.3]),156,.024,24.1);
[[118,'#efe3c4','#b8562e'],[124,'#b65a42','#8a3a2a'],[131,'#f2e6c8','#3f7a5a'],[138,'#dfeaf0','#2f5a8a'],[145,'#e8d2a6','#b8562e'],[166,'#b65a42','#7a4a3a'],[172,'#f2e6c8','#b8562e'],[179,'#efe3c4','#3f7a5a'],[186,'#dfeaf0','#8a3a2a'],[193,'#b65a42','#b8562e']].forEach(([x,w,rf])=>{const g=bld(x,27.8,3.4,2.6,1.8,w,{roof:rf,roofH:1,noCol:true,winCol:'#4a6a86'});fadeGroup(g);for(let i=0;i<8;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.07,.45,.07),fenceMat);p.position.set(x-1.9+i*.54,.23,25.2);scene.add(p);}});
[[121,26],[134.5,26],[169,26],[182.5,26],[189.6,26]].forEach(([x,z])=>{const g=new THREE.PlaneGeometry(plane.w,plane.h);g.translate(0,plane.h/2,0);const m=new THREE.Mesh(g,plane.m);m.customDepthMaterial=plane.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v:plane,fade:false});});
// the Victoria Park bus waits at the stop in front of Mill Point Towers


// ---------- South Perth detail pass: Mill Point and the Old Mill, east foreshore, Coode St Jetty, swans, new locals ----------
box(14,.5,15.7,lmat(stoneC,[7,1]),107,-.25,4.15,{noCast:true});flat(14,13.8,lmat(grassC,[2.3,2.3]),107,.01,4.95);flat(14,1.6,lmat(pathC,[7,.8]),107,.015,-3.2);
flat(1.6,9,lmat(pathC,[.8,4.5]),110.4,.016,3.3);
box(30,.5,13.3,lmat(stoneC,[15,1]),184,-.25,2.95,{noCast:true});flat(30,11.6,lmat(grassC,[5,2]),184,.01,3.8);flat(30,1.6,lmat(pathC,[15,.8]),184,.015,-3.2);
flat(1.6,12,lmat(pathC,[.8,6]),178,.016,4.4);
// the Old Mill (Shenton's Mill, 1835): white tower, dark cap, turning lattice sails
const MILL={x:106,z:2.6,sails:null};
(()=>{const g=new THREE.Group();const wall=lmat(plasterC,[3,3],{color:new THREE.Color('#f6f2e8')});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.5,4.4,12),wall);body.position.y=2.2;body.castShadow=body.receiveShadow=true;g.add(body);
  const band=new THREE.Mesh(new THREE.CylinderGeometry(1.12,1.12,.18,12),new THREE.MeshLambertMaterial({color:0x6a5a4a}));band.position.y=4.35;g.add(band);
  const cap=new THREE.Mesh(new THREE.ConeGeometry(1.3,1.5,12),new THREE.MeshLambertMaterial({color:0x4a4038}));cap.position.y=5.15;cap.castShadow=true;g.add(cap);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(.7,1.3),new THREE.MeshLambertMaterial({color:0x5a3a22}));door.position.set(0,.65,1.47);door.rotation.x=-.1;g.add(door);
  [[.9,2.1],[-.5,3.2]].forEach(([y0,yy])=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.38,.5),winMat);w.position.set(y0*.4,yy,1.3-(yy-2)*.1);w.rotation.x=-.1;g.add(w);});
  const latC=(()=>{const c=mk(8,32),x=c.getContext('2d');x.fillStyle='#e9e2d0';x.fillRect(0,0,8,32);x.fillStyle='#6a5a4a';x.fillRect(0,0,1,32);x.fillRect(7,0,1,32);for(let j=0;j<32;j+=4)x.fillRect(0,j,8,1);x.fillRect(3,0,2,32);return c;})();
  const sm=new THREE.MeshLambertMaterial({map:ctex(latC),side:THREE.DoubleSide});const hub=new THREE.Group();
  for(let k=0;k<4;k++){const arm=new THREE.Group();const blade=new THREE.Mesh(new THREE.PlaneGeometry(.55,2.5),sm);blade.position.set(.2,1.45,0);blade.castShadow=true;arm.add(blade);const sp=new THREE.Mesh(new THREE.BoxGeometry(.08,2.8,.08),new THREE.MeshLambertMaterial({color:0x4a3a2a}));sp.position.y=1.4;arm.add(sp);arm.rotation.z=k*Math.PI/2;hub.add(arm);}
  const boss=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.3,8),new THREE.MeshLambertMaterial({color:0x3a2a1a}));boss.rotation.x=Math.PI/2;hub.add(boss);
  hub.position.set(0,4.6,1.35);g.add(hub);MILL.sails=hub;
  g.position.set(MILL.x,0,MILL.z);scene.add(g);col(MILL.x-1.5,MILL.z-1.5,MILL.x+1.5,MILL.z+1.5);
  for(let i=0;i<11;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.07,.42,.07),fenceMat);p.position.set(102.6+i*.68,.21,6.4);p.castShadow=true;scene.add(p);}
  signPost(108.8,6.6,makeSign(['THE OLD MILL','1835'],56,20,'#4a4038','#f6f2e8'),1.1,.42);
  [[103,8.8],[111.6,9.4],[102.4,-.6]].forEach(([x,z])=>{const v=treeVariants[(x|0)%3];const gg=new THREE.PlaneGeometry(v.w||3,v.h||4);gg.translate(0,(v.h||4)/2,0);const m=new THREE.Mesh(gg,v.m);if(v.d)m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);col(x-.3,z-.3,x+.3,z+.3);});})();
// the Narrows Bridge on the western horizon
(()=>{const m=new THREE.MeshLambertMaterial({color:0xd8dde2,fog:false});for(let i=0;i<14;i++){const x=96+i*2.2,y=1.4+Math.sin(i/13*Math.PI)*.6;const d=new THREE.Mesh(new THREE.BoxGeometry(2.3,.32,1.4),m);d.position.set(x,y,-13.6);scene.add(d);if(i%3===1){const p=new THREE.Mesh(new THREE.BoxGeometry(.4,y,.8),m);p.position.set(x,y/2,-13.6);scene.add(p);}}})();
// Coode Street Jetty
box(1.2,.14,5.6,lmat(deckC,[1,4]),186,.04,-6.6,{noCast:true});for(let i=0;i<4;i++)[-.55,.55].forEach(o=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1,6),legMat);p.position.set(186+o,-.3,-4.2-i*1.6);scene.add(p);});
signPost(184.4,-2.2,makeSign(['COODE ST JETTY'],64,12,'#2f5a8a','#f5ecd8'),1.6,.3);
// Swan Kayaks shack
(()=>{const P={x:175.6,z:4};box(2.6,1.9,1.8,lmat(planks(['#2f78a8','#2a6e9c','#3584b4'],'#1d4e74',true,33),[2,1]),P.x,.95,P.z);const rf=box(3,.14,2.2,new THREE.MeshLambertMaterial({color:0xf3efe6}),P.x,1.98,P.z+.1);rf.rotation.x=.12;
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.34),new THREE.MeshBasicMaterial({map:makeSign(['SWAN KAYAKS'],64,10,'#f3efe6','#2f78a8')}));sg.position.set(P.x,1.62,P.z+.92);scene.add(sg);
  ['#e8344a','#f1c64a','#3ec46a'].forEach((c,i)=>{const k=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,1.9,6),new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));k.rotation.z=Math.PI/2;k.scale.set(1,1,.6);k.position.set(P.x-2.2,.3+i*.32,P.z+.2);k.castShadow=true;scene.add(k);});
  box(.08,1.1,.08,legMat,P.x-3.2,.55,P.z+.2);box(.08,1.1,.08,legMat,P.x-1.2,.55,P.z+.2);
  ['#ef7d5e','#5cc6d8'].forEach((c,i)=>{const k=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,2,6),new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));k.rotation.z=Math.PI/2;k.scale.set(1,1,.55);k.position.set(176+i*2.6,-.08,-4.6-i*.4);scene.add(k);});
  col(P.x-1.4,P.z-1,P.x+1.4,P.z+1);col(P.x-3.3,P.z,P.x-1.1,P.z+.4);})();
// picnic benches on the east foreshore, and the Swan River Zoo signpost at the end of Angelo St
[[188,5],[194,3.6]].forEach(([x,z])=>{box(1.6,.08,.45,new THREE.MeshLambertMaterial({color:0xa8744a}),x,.45,z);box(1.6,.5,.08,new THREE.MeshLambertMaterial({color:0xa8744a}),x,.7,z-.22);[-.65,.65].forEach(o=>box(.08,.45,.4,legMat,x+o,.22,z));col(x-.85,z-.3,x+.85,z+.25);});
signPost(197.4,19.4,makeSign(['SWAN RIVER ZOO','→ LABOUCHERE RD'],64,22,'#3e7d5c','#f5ecd8'),1.3,.46);
[[171,6],[182,8.2],[192,7.4],[198,1]].forEach(([x,z])=>{const g=new THREE.PlaneGeometry(jac.w,jac.h);g.translate(0,jac.h/2,0);const m=new THREE.Mesh(g,jac.m);m.customDepthMaterial=jac.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);col(x-.3,z-.3,x+.3,z+.3);flat(3.2,3.2,petalMat,x+.4,.02,z-.3);});
// black swans on the river, plus one very convincing cardboard swan
const SWAN_ROWS=["....oo......","...obbo.....","...obro.....","....ob......","....ob......","...obbbo.oo.","..obbbbbobbo",".obbwbbbbbbo",".obbbbbbbbo.","..oooooooo.."];
const swanCv=pix(SWAN_ROWS,{o:'#0d0d12',b:'#24242c',r:'#d8342a',w:'#f3efe6'});
const SWANS=[[128,-6.2],[141,-7.4],[163,-6],[174,-7.2],[191,-6.4]].map(([x,z],i)=>{const m=spriteMesh([swanCv],.95,.8);m.position.set(x,-.1,z);scene.add(m);return{m,x0:x,z0:z,ph:i*1.7};});
const cardSwan=(()=>{const m=spriteMesh([swanCv],.95,.8);m.position.set(195.6,0,1.4);scene.add(m);const st=new THREE.Mesh(new THREE.BoxGeometry(.05,.3,.05),legMat);st.position.set(195.6,.15,1.38);scene.add(st);return m;})();
// new South Perth locals
const tom={x:108.8,z:4.6},joy={x:159.4,z:5.4},jett={x:177.8,z:5.6},priya={x:150,z:-2.6,dir:1};
[[tom,{hair:'#e9e2d0',skin:'#f1c7a0',shirt:'#e9e2d0',pants:'#6a5a4a',hat:'#8a6a4a'}],[joy,{hair:'#cfcfd8',skin:'#e2b48a',shirt:'#c46ad6',pants:'#3a3e58',hat:null}],[jett,{hair:'#2a1d16',skin:'#c68a5e',shirt:'#f1c64a',pants:'#2f78a8',hat:null}],[priya,{hair:'#1b1b2b',skin:'#b07a52',shirt:'#ef7d5e',pants:'#24242c',hat:null}]].forEach(([n,v])=>{n.mesh=spriteMesh(humanFrames(v),.95,1.58);n.mesh.position.set(n.x,0,n.z);scene.add(n.mesh);n.blob=blob(.9);n.blob.position.set(n.x,.03,n.z);});
function spTick(dt){const t=performance.now()/1000;if(zoneOf(player.x)!=='sp')return;if(MILL.sails)MILL.sails.rotation.z-=dt*(.5+(typeof wxC!=='undefined'?wxC.rain*.4:0));
  SWANS.forEach(s=>{const a=t*.12+s.ph;s.m.position.set(s.x0+Math.sin(a)*3.2,-.1+Math.sin(t*1.4+s.ph)*.03,s.z0+Math.cos(a*.7)*.6);s.m.scale.x=Math.cos(a)>0?1:-1;});
  if(!dlgOpen()){const near=Math.hypot(player.x-priya.x,player.z-priya.z)<1.6;if(!near){priya.x+=priya.dir*2.1*dt;if(priya.x>197){priya.x=197;priya.dir=-1;}if(priya.x<103){priya.x=103;priya.dir=1;}setFrame(priya.mesh,1+Math.floor(t*7)%2);}else setFrame(priya.mesh,0);
    priya.mesh.position.set(priya.x,0,priya.z);priya.mesh.scale.x=priya.dir>0?1:-1;priya.blob.position.set(priya.x,.03,priya.z);}}
const SP_SIGHTS=['a pod of dolphins surfacing near the Narrows Bridge','a pelican gliding low over the water','the city towers glowing gold across Perth Water','a black swan family paddling past in a neat line','a rowing crew racing past, coxswain shouting'];
function paddleKayak(){if(S.coins<15){toast('Kayak hire is 15 coins');return;}if(S.time>1080){say([{who:'Jett',text:'Sorry, last kayak was at six. River gets dark fast. Tomorrow?'}]);return;}S.coins-=15;S.time+=40;S.qg=S.qg||{};S.qg.kayak=(S.qg.kayak||0)+1;save();
  say([{who:'Jett',text:'Life jacket on, paddle like you mean it. Back in forty!'},'Kip paddles out past Coode St Jetty and along the foreshore.','Kip spots '+SP_SIGHTS[(S.day+S.qg.kayak)%SP_SIGHTS.length]+'.',{who:'Jett',text:'Good paddle? Every time I go out I see something new. That’s why I’m saving for a guitar AND keeping this job.'}]);}
function millGrind(){S.millDay=S.millDay||0;if(S.millDay===S.day){say([{who:'Miller Tom',text:'That’s today’s flour done, thanks! Come back tomorrow, the sails never sleep.'}]);return;}S.millDay=S.day;S.coins+=12;eat(5);save();
  say([{who:'Miller Tom',text:'Grab the sack, Kip! Wheat in the hopper, sails do the rest.'},'The stones rumble. Warm flour pours into a sack Tom has named “Dorothy”.',{who:'Miller Tom',text:'Here’s 12 coins for the help, and a scone for the road. (+12 coins, +5 stamina)'}]);}

