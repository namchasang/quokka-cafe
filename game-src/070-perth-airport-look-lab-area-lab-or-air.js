// ---------- Perth Airport (Look Lab area: ?lab or ?air until AIR_LIVE is true) ----------
// From Paul's photos: a long terminal with a wavy roof and a curved blade canopy on slanted white columns, the
// control tower with its flared cab, planes at the gates, one taxiing and one taking off, the hills behind the runway,
// the kerb road with bus bays, a red-gravel garden with grass trees, gums and boulders, the car hire lot with white
// shade sails and rows of cars, and Airport Central station with a glass skybridge. Kip rides the train from
// Perth Station. Story: Auntie June and cousin Milo fly in from Melbourne.
var AIR_LIVE=false;
var AIR={on:AIR_LIVE||/[?&#](lab|air|world)\b/.test(location.search+location.hash),npcs:[],P:{},planes:[],cars:[],glow:[],halos:[],em:[]};
const AIRB={x1:713,x2:817,z1:-30,z2:22};
function airWalk(x,z){if(!AIR||!AIR.on)return false;if(x>716&&x<812&&z>-2.9&&z<16.2)return true;if(x>800&&x<812&&z>-11.8&&z<=-2.9)return true;return false;}
if(AIR.on)(()=>{const G=new THREE.Group();G.name='airport';G.userData.airG=1;scene.add(G);AIR.g=G;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(...o.s);}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||10);
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const texM=(W,H,draw,rep,o)=>new THREE.MeshLambertMaterial(Object.assign({map:tex(W,H,draw,rep)},o||{}));
  const paint=(w,d,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const plane=(w,h,mat,x,y,z,ry,to)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;(to||G).add(m);return m;};
  const sign=(t,bg,fg,w,h,x,y,z,ry,to)=>{const L=Array.isArray(t)?t:[t];const tx=makeSign(L,Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);return plane(w,h,new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}),x,y,z,ry,to);};
  const r=mulberry32(1944),pick=a=>a[(r()*a.length)|0];
  const haloT=(()=>{const c=mk(32,32),x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,230,170,1)');g.addColorStop(.4,'rgba(255,200,120,.45)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c);})();
  const halo=(x,y,z,s,c)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0,color:c||0xffffff}));m.position.set(x,y,z);m.scale.set(s,s,1);G.add(m);AIR.halos.push(m);return m;};
  const glow=(day,night)=>{const m=new THREE.MeshBasicMaterial({color:new THREE.Color(day)});AIR.glow.push([m,new THREE.Color(day),new THREE.Color(night)]);return m;};
  const asphMat=(w,d)=>texM(16,16,(x)=>{x.fillStyle='#4a4d55';x.fillRect(0,0,16,16);x.fillStyle='#55585f';for(let i=0;i<30;i++)x.fillRect(r()*16|0,r()*16|0,1,1);x.fillStyle='#43464e';for(let i=0;i<20;i++)x.fillRect(r()*16|0,r()*16|0,1,1);},[Math.max(1,w/3),Math.max(1,d/3)]);
  const conc=texM(16,16,(x)=>{x.fillStyle='#b8bab8';x.fillRect(0,0,16,16);x.fillStyle='#a8aaa8';x.fillRect(0,0,16,1);x.fillRect(0,0,1,16);for(let i=0;i<20;i++){x.fillStyle='#c4c6c2';x.fillRect(r()*16|0,r()*16|0,1,1);}},[40,4]);
  const WHITE=M('#f3f3ea'),YEL=M('#e8c430');
  // sprites: grass trees and gums, painted with the same pixel look as every other plant
  const sprMat=c=>{const t=ctex(c);return{m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};};
  const bb=(v,x,z,w,h,tree)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);G.add(m);BB.push(m);if(tree)trees.push({x,z,m,v:{...v,f:v.f||v.m},fade:false});return m;};
  const grassTree=sprMat((()=>{const W=20,H=28,c=mk(W,H),x=c.getContext('2d');for(let y=16;y<H;y++){x.fillStyle=y%3?'#2a2420':'#3a3028';x.fillRect(9,y,3,1);}
    const FR=TREE_COLS[0];for(let k=0;k<26;k++){const a=-Math.PI*.95+k/25*Math.PI*.9,len=6+r()*3;for(let t=0;t<=1;t+=.1){const px=10.5+Math.cos(a)*len*t,py=15+Math.sin(a)*len*t*.9+t*t*4*Math.abs(Math.cos(a));x.fillStyle=FR[t<.3?1:t>.75?3:2];x.fillRect(Math.round(px),Math.round(py),1,2);}}
    for(let k=0;k<10;k++){const a=Math.PI*.15+k/9*Math.PI*.7,len=4+r()*2;for(let t=0;t<=1;t+=.15){x.fillStyle=FR[0];x.fillRect(Math.round(10.5+Math.cos(a)*len*t*1.4),Math.round(16+Math.sin(a)*len*t*.5),1,1);}}
    if(r()<2){x.fillStyle='#5a4a30';x.fillRect(10,1,1,10);x.fillStyle='#a89060';for(let y=1;y<8;y+=2)x.fillRect(10,y,1,1);}return c;})());
  const gums=treeVariants;
  // ===== ground: airside grass, the runway, a taxiway and the apron; landside paving =====
  box(104,.5,52,lmat(paveC,[52,26]),765,-.26,-4,{noCast:true});
  paint(104,18,lmat(grassC,[30,6]),765,-21,.012);put(B(240,.5,90),lmat(grassC,[60,22]),765,-.62,-20,{nc:1});
  paint(104,3.4,asphMat(104,3.4),765,-24.3,.02);for(let x=716;x<814;x+=4)paint(2,.12,WHITE,x,-24.3,.026);[717,813].forEach(x=>{for(let k=0;k<6;k++)paint(.9,.16,WHITE,x,-25.6+k*.52,.026);});
  paint(104,1.4,asphMat(104,1.4),765,-17.9,.02);for(let x=716;x<814;x+=1.4)paint(.6,.05,YEL,x,-17.9,.026);
  paint(84,8.4,conc,758,-12,.02);[735,752,769,786].forEach(x=>paint(.08,7.6,YEL,x,-12.2,.027));
  // the hills on the horizon behind the runway
  for(let i=0;i<9;i++){const m=put(new THREE.SphereGeometry(1,12,6,0,Math.PI*2,0,Math.PI/2),M(i%2?'#5e6e5a':'#68785e'),712+i*14,0,-44-r()*4,{nc:1});m.scale.set(13+r()*6,4+r()*3,6);}
  // ===== the terminal: a long glass hall with a wavy roof =====
  {const x1=726,x2=796,z0=-5.5,D=5,H=3.2,W=x2-x1,cx=(x1+x2)/2;
    put(B(W,H,D),M('#d8dcde'),cx,H/2,z0);
    const glassM=(()=>{const t=tex(32,16,(x)=>{x.fillStyle='#6a8aa0';x.fillRect(0,0,32,16);x.fillStyle='#8aaac0';x.fillRect(0,0,32,7);x.fillStyle='#3a4a58';for(let i=0;i<32;i+=4)x.fillRect(i,0,1,16);x.fillRect(0,8,32,1);x.fillStyle='#ffe0a8';x.fillRect(2,10,3,5);x.fillRect(14,11,4,4);x.fillRect(25,10,3,5);},[18,1]);const e=tex(32,16,(x)=>{x.fillStyle='#000';x.fillRect(0,0,32,16);x.fillStyle='#ffd8a0';x.fillRect(1,9,30,7);x.fillStyle='#806040';x.fillRect(1,1,30,6);},[18,1]);const m=new THREE.MeshLambertMaterial({map:t,emissiveMap:e,emissive:new THREE.Color(0,0,0)});AIR.em.push(m);return m;})();
    plane(W-.2,H-.3,glassM,cx,(H-.3)/2+.05,z0+D/2+.01);
    const s=new THREE.Shape();s.moveTo(-D/2-.5,0);s.lineTo(D/2+.6,0);s.lineTo(D/2+.6,.2);s.quadraticCurveTo(0,1.3,-D/2-.5,.2);s.closePath();const rg=new THREE.ExtrudeGeometry(s,{depth:W+1,bevelEnabled:false});rg.translate(0,0,-(W+1)/2);
    const roof=new THREE.Mesh(rg,M('#c8ccd0'));roof.rotation.y=-Math.PI/2;roof.position.set(cx,H,z0);roof.castShadow=true;G.add(roof);
    sign('PERTH AIRPORT · DEPARTURES · ARRIVALS','#1d3a6e','#ffffff',8,.42,cx,H+.25,z0+D/2+.62);
    sign(['ARRIVALS'],'#f6f6f0','#1d3a6e',2.2,.4,756,2.6,z0+D/2+.03);sign(['DEPARTURES'],'#f6f6f0','#1d3a6e',2.4,.4,776,2.6,z0+D/2+.03);
    col(x1,z0-D/2,x2,z0+D/2);
    // jet bridges out to the gates, with a plane at each
    [735,752,769,786].forEach((x,i)=>{put(B(1,1,3.4),M('#c8ccd0'),x,2.2,z0-D/2-1.7);put(C(.12,.12,2.2,6),M('#8a8e92'),x,1.1,z0-D/2-3);put(B(1.2,1.1,.8),M('#6a7a8a'),x,2.2,z0-D/2-3.5);
      if(i!==2){const p=makePlane(i%2?'#2a9a8a':'#e8732a');p.position.set(x+1.5,0,-13.3);p.rotation.y=-Math.PI/2;G.add(p);}});
    // the kerb canopy: overlapping curved blades on slanted white columns
    for(let k=0;k<5;k++){const z=-2.6+k*.55,y=3.9-k*.16;const bl=put(B(W-2,.06,.62),M(k%2?'#e8eaec':'#f6f6f6'),cx,y,z,{rx:-.18});bl.userData.canopy=1;AIR.canopy=(AIR.canopy||[]).concat([bl]);}
    for(let x=x1+3;x<x2-1;x+=5.5){put(C(.08,.11,3.9,8),M('#f6f6f6'),x,1.9,-.75,{rx:.14});put(C(.08,.11,3.9,8),M('#f6f6f6'),x+.5,1.9,-.6,{rx:.14,rz:-.18});col(x-.15,-.95,x+.7,-.45);}
    // spot lights under the canopy
    for(let x=x1+5;x<x2;x+=8){put(C(.12,.12,.04,10),glow('#f6f2e0','#fff0c0'),x,3.5,-1.6,{nc:1});halo(x,3.3,-1.6,1.6);}
    AIR.P.terminal={x:cx,z:-.2};}
  // ===== the control tower: a tall shaft with a flared cab, dark glass band and an aerial =====
  {const x=807.5,z=-8.4,g=new THREE.Group();g.position.set(x,0,z);G.add(g);const cM=M('#d8d0c4');
    put(C(.62,.78,8.4,14),cM,0,4.2,0,null,g);put(C(1.15,.62,.9,14),cM,0,8.85,0,null,g);put(C(1.25,1.15,.18,14),M('#ece6dc'),0,9.4,0,null,g);
    put(C(1.18,1.25,.55,14),glow('#2a3038','#6a8aa0'),0,9.78,0,null,g);put(C(1.4,1.2,.16,14),M('#ece6dc'),0,10.12,0,null,g);put(C(.95,1.1,.42,14),glow('#2a3038','#5a7a90'),0,10.4,0,null,g);
    put(C(1.05,.95,.12,14),M('#ece6dc'),0,10.66,0,null,g);put(C(.5,.7,.3,10),cM,0,10.85,0,null,g);put(C(.03,.03,1.2,5),M('#e8e8e8'),0,11.6,0,null,g);
    const bl=put(new THREE.SphereGeometry(.07,6,4),glow('#c83020','#ff3020'),0,12.2,0,{nc:1},g);AIR.beacon=bl;halo(x,12.2,z,1,0xff4030);
    col(x-.8,z-.8,x+.8,z+.8);AIR.P.tower={x,z:z+2.4};}
  // the plane-spotting deck beside the tower: lawn, a fence on the airside, a bench
  paint(12,8.8,lmat(grassC,[4,3]),806,-7.4,.022);for(let x=800.3;x<812;x+=.6)put(B(.04,.9,.04),M('#3a3e44'),x,.45,-11.9);put(B(11.8,.04,.04),M('#3a3e44'),806,.88,-11.9);col(800,-12.1,812,-11.7);
  put(B(1.2,.06,.36),M('#7a5a3a'),803,.42,-10.4);put(B(1.2,.3,.05),M('#7a5a3a'),803,.6,-10.25);col(802.4,-10.6,803.6,-10.2);AIR.P.deck={x:804,z:-9.6};
  // ===== the kerb road: one-way loop, bus bays, zebra crossings, tall lights =====
  paint(102,2.6,asphMat(102,2.6),765,.9,.021);for(let x=716;x<814;x+=2.4)paint(1,.06,WHITE,x,1.1,.027);paint(102,.06,YEL,765,-.35,.028);paint(102,.06,YEL,765,2.15,.028);
  [[740,'BUS'],[744,'BUS'],[748,'BUS']].forEach(([x,t])=>{paint(3.2,.9,'#5a4a4a',x,-.0,.024);sign([t],'#5a4a4a','#e8c430',.8,.3,x,.03,-.0,0).rotation.x=-Math.PI/2;});
  [745.5,772,790].forEach(x=>{for(let k=0;k<6;k++)paint(.25,2.4,WHITE,x-1+k*.42,.9,.029);});
  {const bs=new THREE.Group();bs.position.set(744,0,-.45);G.add(bs);put(B(6,.06,.9),M('#e8eaec'),0,2.3,0,null,bs);[-2.8,2.8].forEach(o=>put(B(.08,2.3,.08),M('#3a3e44'),o,1.15,-.3,null,bs));sign(['TRAIN & BUS','CITY  ·  FREMANTLE'],'#1d3a6e','#ffffff',1.6,.6,-1.5,1.8,-.4,0,bs);}
  // ===== kerbside pick-up and drop-off bays on the terminal side of the road =====
  {const WH=M('#f3f3ea');const bays=[[718,736],[751,769],[775,788],[793,811]];
    bays.forEach(([b1,b2])=>{paint(b2-b1,.8,asphMat(b2-b1,.8),(b1+b2)/2,.05,.024);const n=Math.floor((b2-b1)/1.8);for(let k=0;k<=n;k++)paint(.05,.8,WH,b1+k*(b2-b1)/n,.05,.03);
      for(let k=0;k<n;k++){if(r()<.3)continue;const x=b1+(k+.5)*(b2-b1)/n;const c=r()<.3&&CDET.retroCar?CDET.retroCar():CDET.makeCar?CDET.makeCar(pick(['sedan','hatch','taxi','ute','van']),pick(['#f6f6f0','#2a2a30','#9aa4ac','#c8344a','#2f6fb0','#f1c64a'])):null;if(!c)continue;c.g.position.set(x,0,.05);c.g.rotation.y=Math.PI;G.add(c.g);col(x-c.len/2,.05-c.wid/2,x+c.len/2,.05+c.wid/2);}
      sign(['PICK UP · DROP OFF','5 MIN'],'#1d3a6e','#ffffff',1.1,.42,b1+.6,1.75,-.55,0);put(C(.03,.03,1.6,5),M('#9aa0a6'),b1+.6,.8,-.58);});}
  // traffic on the kerb road (one way, heading west), a shuttle bus that stops at the bus bays
  if(CDET.makeCar){const V=[];const lane=1.45;const spawn=(x)=>{const bus=!V.some(v=>v.bus)&&r()<.35;const m=bus?CDET.makeCar('bus','#2e8a52'):(r()<.3?CDET.retroCar():CDET.makeCar(pick(['sedan','hatch','taxi','ute']),pick(['#f6f6f0','#2a2a30','#9aa4ac','#c8344a','#2f6fb0'])));
      m.g.rotation.y=Math.PI;G.add(m.g);const v={g:m.g,x,len:m.len,wid:m.wid,v:2,vmax:bus?2:2.6+r()*.8,bus,dwell:0,served:false};V.push(v);return v;};
    [800,770,735].forEach(spawn);AIR.cars=V;AIR.carT=0;
    AIR.trafficTick=dt=>{for(const c of V){let tg=c.vmax;for(const o of V){if(o===c)continue;const d=c.x-o.x;if(d>0&&d<4)tg=Math.min(tg,Math.max(0,(d-c.len/2-o.len/2-.4)*2.2));}
        const ex=c.x-player.x;if(ex>0&&ex<c.len/2+1.6&&Math.abs(player.z-lane)<c.wid/2+.4)tg=Math.min(tg,Math.max(0,(ex-c.len/2-.45)*2.4));
        if(c.bus&&!c.served&&c.x<745.5&&c.x>743){tg=0;c.dwell+=dt;if(c.dwell>3)c.served=true;}
        c.v+=Math.max(-6*dt,Math.min(2*dt,tg-c.v));c.x-=c.v*dt;c.g.position.set(c.x,0,lane);const k2=Math.max(0,Math.min(1,Math.min(816-c.x,c.x-714)/1.3));c.g.scale.setScalar(k2);c.g.visible=k2>.02;
        if(Math.abs(player.x-c.x)<c.len/2+.15&&Math.abs(player.z-lane)<c.wid/2+.25){player.z=player.z<lane?lane-c.wid/2-.26:lane+c.wid/2+.26;}}
      for(let i=V.length-1;i>=0;i--)if(V[i].x<714.2){G.remove(V[i].g);V.splice(i,1);}
      AIR.carT-=dt;if(AIR.carT<=0){AIR.carT=3+Math.random()*5;if(V.length<6&&!V.some(v=>v.x>813))spawn(816);}};}
  // ===== the garden median: red gravel, grass trees, gums, boulders =====
  paint(96,2.4,texM(8,8,(x)=>{x.fillStyle='#a8583a';x.fillRect(0,0,8,8);for(let i=0;i<14;i++){x.fillStyle=pick(['#b86848','#9a4a30','#c8805a','#8a3a28']);x.fillRect(r()*8|0,r()*8|0,1,1);}},[48,1]),766,3.4,.022);
  for(let x=722;x<810;x+=r()*3+2.2){if(Math.abs(x-745.5)<1.6||Math.abs(x-772)<1.6||Math.abs(x-790)<1.6)continue;const k=r();if(k<.45){bb(grassTree,x,3.4+(r()-.5)*1.2,1.7,2.4);}
    else if(k<.7){const v=gums[(r()*3)|0];bb(v,x,3.6,v.w*1.9,v.h*1.9,true);col(x-.25,3.45,x+.25,3.75);}
    else{const b=put(new THREE.DodecahedronGeometry(.32+r()*.25,0),M(pick(['#8a6a50','#a07a5a','#7a5a44'])),x,.2,3.3+(r()-.5),{rx:r(),ry:r()});b.scale.y=.6;col(x-.35,2.9,x+.35,3.7);}}
  // light towers
  [[730,4.4],[760,4.4],[790,4.4],[770,15.6],[742,15.6]].forEach(([x,z])=>{put(C(.08,.12,6.4,6),M('#9aa0a6'),x,3.2,z);put(B(.6,.12,.3),glow('#e8e8e0','#fff4d0'),x,6.4,z,{nc:1});halo(x,6.3,z,3);col(x-.12,z-.12,x+.12,z+.12);});
  // ===== the car hire lot: huts, white shade sails, a fence, rows of cars =====
  {const x1=736,x2=802,z1=5,z2=15.4;paint(x2-x1,z2-z1,asphMat(x2-x1,z2-z1),(x1+x2)/2,(z1+z2)/2,.02);
    for(let x=x1;x<x2;x+=.5){if((x>745&&x<747)||(x>771&&x<773.5))continue;put(B(.03,.9,.03),M('#2a2c30'),x,.45,4.85,{nc:1});}put(B(x2-x1,.04,.04),M('#2a2c30'),(x1+x2)/2,.88,4.85,{nc:1});col(x1,4.75,745,4.95);col(747,4.75,771,4.95);col(773.5,4.75,x2,4.95);
    [[750,'CAR HIRE','#c8202a'],[760,'CAR HIRE','#e86a1a'],[782,'RENTALS','#2a5a9a']].forEach(([x,t,c])=>{put(B(2.4,1.6,1.4),M('#f6f6f0'),x,.8,6.2);put(B(2.5,.3,1.5),M(c),x,1.75,6.2);sign([t],c,'#ffffff',1.6,.24,x,1.75,6.96);plane(.8,1,M('#3a4a5a'),x-.5,.6,6.91);col(x-1.2,5.5,x+1.2,6.9);});
    AIR.P.hut={x:760,z:7.6};
    [[754.6,6.6],[756.6,6.6],[786.5,6.6]].forEach(([x,z])=>{put(C(0,1.1,.8,4),M('#f6f6f0'),x,2.1,z,{ry:Math.PI/4});put(C(.05,.05,1.8,6),M('#d8d8d8'),x,.9,z);col(x-.08,z-.08,x+.08,z+.08);});
    for(let row=0;row<3;row++){const z=9+row*2.4;for(let x=x1+1;x<x2-1;x+=1.0){if(r()<.18)continue;const c=r()<.12&&CDET.retroCar?CDET.retroCar():CDET.makeCar?CDET.makeCar(pick(['sedan','hatch','hatch','ute']),pick(['#f6f6f0','#f6f6f0','#f6f6f0','#d8dce0','#c8ccd0','#9aa4ac','#c8202a','#2a2a30'])):null;if(!c)continue;
      c.g.position.set(x,0,z);c.g.rotation.y=Math.PI/2*(row%2?1:-1);G.add(c.g);col(x-c.wid/2,z-c.len/2,x+c.wid/2,z+c.len/2);}}
    AIR.P.lot={x:778,z:8.4};}
  // ===== Airport Central station and the glass skybridge over the road =====
  {const x0=724,z0=8.2;put(B(14,3.6,6.6),M('#2a2e34'),x0,1.8,z0);const gm=(()=>{const t=tex(16,16,(x)=>{x.fillStyle='#7a9ab0';x.fillRect(0,0,16,16);x.fillStyle='#2a2e34';for(let i=0;i<16;i+=4)x.fillRect(i,0,1,16);x.fillRect(0,7,16,1);x.fillStyle='#ffe2a8';x.fillRect(5,9,3,6);},[7,2]);const e=tex(16,16,(x)=>{x.fillStyle='#000';x.fillRect(0,0,16,16);x.fillStyle='#ffd8a0';x.fillRect(1,8,14,8);},[7,2]);const m=new THREE.MeshLambertMaterial({map:t,emissiveMap:e,emissive:new THREE.Color(0,0,0)});AIR.em.push(m);return m;})();
    plane(13.6,3.2,gm,x0,1.7,z0+3.31);put(B(14.6,.3,7.2),M('#e8eaec'),x0,3.75,z0);sign(['AIRPORT CENTRAL'],'#1d3a6e','#ffffff',3.6,.42,x0,3.2,z0+3.34);sign(['TRAINS TO PERTH'],'#2e8a52','#ffffff',2.4,.3,x0+4.2,2.6,z0+3.34);
    col(x0-7,z0-3.3,x0+7,z0+3.3);
    const br=new THREE.Group();br.position.set(x0+5.4,0,1.9);G.add(br);put(B(2,1.4,10.2),new THREE.MeshLambertMaterial({color:0xa8c8d8,transparent:true,opacity:.55}),0,4.2,-1.9,null,br);put(B(2.1,.12,10.3),M('#e8eaec'),0,3.5,-1.9,null,br);put(B(2.1,.12,10.3),M('#e8eaec'),0,4.92,-1.9,null,br);
    for(let k=0;k<6;k++){const s=put(B(.06,1.4,.06),M('#e8eaec'),.98,4.2,-6.8+k*2,{rx:.6},br);put(B(.06,1.4,.06),M('#e8eaec'),-.98,4.2,-6.8+k*2,{rx:.6},br);}
    put(B(.5,3.5,.5),M('#c8ccd0'),0,1.75,1.4,null,br);col(x0+5.15,3.05,x0+5.65,3.55);
    AIR.P.station={x:x0,z:z0+4.6};AIR.land=[x0,13.4];}
  // ===== planes: low-poly, a fictional local airline =====
  // a narrow-body jet in proportion: long slim fuselage, low swept wings with engines slung forward, swept fin and tailplane
  function makePlane(tail){const g=new THREE.Group();const W=M('#f4f4f2'),T=M(tail),D=M('#3a4048'),GREY=M('#b8bcc2');
    const L=8.6,R=.42,Y=1.05;
    put(C(R,R,L-2.6,16),W,.1,Y,0,{rz:Math.PI/2},g);// cabin
    const nose=put(new THREE.SphereGeometry(R,16,12,0,Math.PI*2,0,Math.PI/2),W,L/2-1.2,Y,0,{rz:-Math.PI/2},g);nose.scale.set(1,2.6,1);// nose cone (along +x)
    const tc=put(C(.08,R,1.9,16),W,-L/2+.25,Y+.14,0,{rz:-Math.PI/2+.08},g);// tail cone sweeps up a little
    put(B(L-2.4,.14,.02),T,.2,Y-.18,R+.002,{nc:1},g);put(B(L-2.4,.14,.02),T,.2,Y-.18,-R-.002,{nc:1},g);// cheatline
    [1,-1].forEach(s=>{plane(5.6,.07,texM(48,2,(x)=>{x.fillStyle='#f4f4f2';x.fillRect(0,0,48,2);x.fillStyle='#2a3038';for(let i=1;i<48;i+=2)x.fillRect(i,0,1,2);x.fillRect(46,0,2,2);}),.3,Y+.12,s*(R+.003),s<0?Math.PI:0,g);
      plane(.5,.12,D,L/2-.5,Y+.17,s*(R*.82),s<0?Math.PI:0,g).rotation.y=(s<0?Math.PI:0)+s*-.5;
      sign(['QUOKKA AIR'],'#f4f4f2',tail,1.5,.22,-1.6,Y+.12,s*(R+.006),s<0?Math.PI:0,g);});
    const wingGeo=(root,tip,span,sweep,th)=>{const sh=new THREE.Shape();sh.moveTo(root/2,0);sh.lineTo(-root/2,0);sh.lineTo(-sweep-tip/2,span);sh.lineTo(-sweep+tip/2,span);sh.closePath();const ge=new THREE.ExtrudeGeometry(sh,{depth:th,bevelEnabled:false});ge.rotateX(Math.PI/2);return ge;};
    [1,-1].forEach(s=>{const w=put(wingGeo(1.7,.45,3.9,1.5,.07),W,.35,Y-.25,0,{s:[1,1,s]},g);w.rotation.x=s*.06;// low wing, slight dihedral
      const ez=s*1.35,ex=.75;put(C(.24,.22,1.1,14),GREY,ex,Y-.6,ez,{rz:Math.PI/2},g);put(C(.2,.2,.02,14),D,ex+.56,Y-.6,ez,{rz:Math.PI/2,nc:1},g);put(B(.5,.25,.06),W,ex-.15,Y-.38,ez,null,g);// engine on a pylon
      const hs=put(wingGeo(.9,.3,1.55,.75,.05),W,-L/2+.85,Y+.18,0,{s:[1,1,s]},g);});
    {const sh=new THREE.Shape();sh.moveTo(-L/2+1.9,0);sh.lineTo(-L/2+.5,0);sh.lineTo(-L/2-.1,1.75);sh.lineTo(-L/2+.45,1.75);sh.closePath();const fin=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.07,bevelEnabled:false}),T);fin.position.set(0,Y+.3,-.035);fin.castShadow=true;g.add(fin);
      sign(['Q'],tail,'#ffd34d',.42,.42,-L/2+.25,Y+1.15,.04,0,g);sign(['Q'],tail,'#ffd34d',.42,.42,-L/2+.25,Y+1.15,-.04,Math.PI,g);}
    // landing gear: nose leg forward, two main legs under the wing roots
    [[L/2-1.3,0,1],[.0,.48,2],[.0,-.48,2]].forEach(([x,z,n])=>{put(C(.035,.035,Y-.35,6),D,x,(Y-.35)/2+.18,z,null,g);for(let k=0;k<n;k++)put(C(.16,.16,.1,12),M('#1c1c1e'),x+(n>1?(k-.5)*.34:0),.16,z,{rx:Math.PI/2},g);});
    put(new THREE.SphereGeometry(.05,5,4),glow('#c83020','#ff3020'),-1.25,Y-.25,4.0,{nc:1},g);put(new THREE.SphereGeometry(.05,5,4),glow('#209040','#30ff60'),-1.25,Y-.25,-4.0,{nc:1},g);
    put(new THREE.SphereGeometry(.05,5,4),glow('#f6f6f6','#ffffff'),-L/2-.05,Y+.2,0,{nc:1},g);
    return g;}
  AIR.makePlane=makePlane;
  const taxi=makePlane('#2a9a8a');taxi.rotation.y=Math.PI;G.add(taxi);const take=makePlane('#e8732a');G.add(take);AIR.planes=[{g:taxi,kind:'taxi',t:0},{g:take,kind:'take',t:12}];
  // ===== people: family from Melbourne at arrivals, a pilot on the deck, the car hire clerk =====
  function npc(id,name,v,x,z,lines,face){const m=spriteMesh(humanFrames(v),.95,1.58);m.position.set(x,0,z);if(face)m.scale.x=face;G.add(m);const b=blob(.85);b.position.set(x,.03,z);const n={id,name,x,z,m,lines};AIR.npcs.push(n);AIR.P[id]={x,z:z+1.4};return n;}
  npc('june','Auntie June',{hair:'#8a5a3a',skin:'#f1c7a0',shirt:'#c8344a',pants:'#3a3a48',hat:null},755.2,-1.6,()=>[{who:'Auntie June',text:pick(['Four hours on the plane and Milo still had energy. I did not.','Melbourne says hello! It was raining when we left. Of course it was.','Your mum sends a whole bag of biscuits. Don’t tell her I ate two.'])}]);
  npc('milo','Milo',{hair:'#2a1d16',skin:'#f1c7a0',shirt:'#2a5a9a',pants:'#c9b68a',hat:'#e8c430'},757,-1.3,()=>[{who:'Milo',text:pick(['Cousin Kip! Is it true quokkas smile at you?','I saw the ocean from the plane window! It’s SO blue.','Can we go on a boat? Can we? Can we?'])}],-1);
  npc('capt','Captain Ana',{hair:'#1e1a18',skin:'#c8865a',shirt:'#f6f6f0',pants:'#1d2a4a',hat:'#1d2a4a'},805,-9.4,()=>[{who:'Captain Ana',text:pick(['The best seat in the house is the window on the left, landing from the west. You see Rottnest first.','That one taking off is going to Broome. Lucky things.','Every pilot waves at the tower. The tower never waves back.'])}]);
  npc('raj','Raj',{hair:'#1e1a18',skin:'#8d5a3b',shirt:'#e86a1a',pants:'#2a2a30',hat:null},761.6,7.6,()=>[{who:'Raj',text:pick(['Small car, big car, ute? We have them all. Mostly white ones.','Everyone wants the little two-tone one. It’s always booked.','Lost property? Try the far end of the lot. Things roll down there.'])}]);
  // Milo's lost suitcase, at the far end of the lot
  {const g=new THREE.Group();g.position.set(799.4,0,14.4);G.add(g);put(B(.5,.62,.28),M('#2a6ac8'),0,.36,0,null,g);put(B(.22,.06,.06),M('#1c1c1e'),0,.72,0,null,g);[-.18,.18].forEach(o=>put(C(.05,.05,.04,8),M('#1c1c1e'),o,.05,.12,{rx:Math.PI/2},g));put(B(.1,.1,.02),M('#e8c430'),.12,.45,.15,null,g);AIR.case=g;AIR.P.suitcase={x:799.4,z:14.4};}
  // the area starts hidden (shown when Kip is at the airport, or in the Look Lab)
  G.visible=false;
})();
