// ===== coastal heath and low trees: pixel shrubs painted with the plant kit (grey-green like the photos), sent through the game's plant pipeline =====
const PL=[];
const HP=[['#3a4430','#55603f','#77805a','#9aa07a'],['#2f3e2c','#4a5a40','#6a7a56','#8e9a70'],['#46482e','#626444','#848460','#a8a47e'],['#34452f','#4d6444','#6e865a','#94aa74'],['#3e4636','#5a6450','#7c866c','#a2aa8e']];
const HEATH=[];
for(let v=0;v<9;v++){const r2=mulberry32(1300+v);const W=v<6?16:20,Hh=v<6?10:14;const bl=[];const n=v<6?4:6;for(let i=0;i<n;i++)bl.push([W/2+(r2()-.5)*W*.5,Hh*.64+(r2()-.5)*Hh*.3,2.1+r2()*1.9]);
  const c=canopy(W,Hh,bl,HP[v%5],r2,null);const x=c.getContext('2d');
  if(v===2||v===6){for(let i=0;i<7;i++){const X=3+r2()*(W-6)|0,Y=2+r2()*(Hh*.5)|0;x.fillStyle='#e8b83a';x.fillRect(X,Y,1,2);x.fillStyle='#f6d860';x.fillRect(X,Y,1,1);}}   // wattle
  if(v===7){for(let i=0;i<4;i++){const X=3+r2()*(W-6)|0,Y=1+r2()*(Hh*.4)|0;x.fillStyle='#c8782a';x.fillRect(X,Y,2,3);x.fillStyle='#e8a040';x.fillRect(X,Y,1,2);}}           // banksia cones
  if(v===8){for(let i=0;i<10;i++){const X=2+r2()*(W-4)|0,Y=2+r2()*(Hh*.6)|0;x.fillStyle=r2()<.5?'#f4f2ea':'#e8c8e0';x.fillRect(X,Y,1,1);}}                               // everlastings
  const t=ctex(c);HEATH.push({w:W/10,h:Hh/10,m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.1,.1,.08),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})});}
// low coastal trees: grey-green crowns on crooked trunks,
const LTREE=[0,1,2].map(v=>{const r2=mulberry32(1350+v);const bl=[];for(let i=0;i<7;i++)bl.push([16+(r2()-.5)*18,12+(r2()-.5)*9,5+r2()*4]);
  const c=canopy(32,40,bl,[HP[1],HP[3],HP[4]][v],r2,null);const x=c.getContext('2d');
  // crooked trunk drawn under the crown
  x.globalCompositeOperation='destination-over';let tx=15;for(let y=39;y>18;y--){tx+=Math.round((r2()-.5)*1.4);x.fillStyle='#3a2a1e';x.fillRect(tx-1,y,4,1);x.fillStyle='#6a5444';x.fillRect(tx,y,2,1);}
  x.globalCompositeOperation='source-over';const t=ctex(c);
  return{w:3,h:3.75,m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.1,.1,.08),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};});
const PSH=[];
function plantAt(V,x,z,s){const w=V.w*s,h=V.h*s,g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,V.m);m.customDepthMaterial=V.d;m.castShadow=true;m.receiveShadow=true;
  m.position.set(x,H(x,z)-.06,z);G.add(m);PL.push(m);PSH.push([x,z,w*.75]);return m;}
{const okP=(x,z)=>!(trailD(x,z)<1.2||loopD(x,z)<2.9||inR(x,z,{x1:1001,x2:1030,z1:24.5,z2:43})||inR(x,z,CP,1.5)||spHit(x,z,.5));
  for(let i=0;i<6000&&PL.length<520;i++){const x=rr(X1-10,X2+10),z=rr(Z1-8,Z2+8);if(!okP(x,z))continue;
    const out=x<X1+1||x>X2-1||z<Z1+2||z>Z2-2;const w=out?1:heathW(x,z);if(R()>w)continue;if(out&&R()<.45)continue;
    if(R()<(out?.2:.06))plantAt(LTREE[(R()*3)|0],x,z,.7+R()*.45);else plantAt(HEATH[(R()*9)|0],x,z,.85+R()*.75);}
  // a few lone bushes out on the sand among the spires (IMG_1302, IMG_1287)
  for(let i=0,n=0;i<400&&n<45;i++){const x=rr(X1+12,X2-8),z=rr(Z1+6,Z2-8);if(!free(x,z,.4)||spHit(x,z,.4))continue;plantAt(HEATH[[0,1,3][(R()*3)|0]],x,z,.6+R()*.6);n++;}
  // plants round the Discovery Centre
  [[1006,37],[1009,37.6],[1021,35.4],[1025,34.6],[1028,25],[1017.4,25.6],[1003.4,29],[1003,26]].forEach(([x,z],i)=>plantAt(HEATH[(i*2)%9],x,z,1+R()*.3));
  [[1001.5,22],[1018.6,42.6],[1050.5,29]].forEach(([x,z],i)=>plantAt(LTREE[i%3],x,z,1));
  // soft contact shadows under the plants
  {const[c,x]=cvs(32,32);const gr=x.createRadialGradient(16,16,2,16,16,16);gr.addColorStop(0,'rgba(60,40,10,.55)');gr.addColorStop(1,'rgba(60,40,10,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);
    const gq=new THREE.PlaneGeometry(1,.6);gq.rotateX(-Math.PI/2);const im=new THREE.InstancedMesh(gq,new THREE.MeshBasicMaterial({map:ctex(c),transparent:true,depthWrite:false}),PSH.length);
    const O=new THREE.Object3D();PSH.forEach(([x,z,w],i)=>{O.position.set(x,H(x,z)+.04,z+.05);O.scale.set(w,1,w);O.updateMatrix();im.setMatrixAt(i,O.matrix);});im.renderOrder=1;im.__pxSkip=1;im.frustumCulled=false;G.add(im);}
  // run the game's plant pipeline (HD pixels, then LOOK2 leaf clumps, rims and seasons) on our plants only
  {const all=BB.splice(0,BB.length);BB.push(...PL);try{if(typeof plantHDApply==='function')plantHDApply();}catch(e){console.warn('pin plantHD',e);}
    try{if(typeof plant2Apply==='function'&&typeof LOOK2!=='undefined'&&LOOK2.on)plant2Apply();}catch(e){console.warn('pin plant2',e);}BB.length=0;all.forEach(o=>BB.push(o));BB.push(...PL);}
  PL.forEach(m=>m.__pxSkip=1);}
// ===== the tour van (Paul's own company): a white minibus, pixel skin =====
function vanSide(frontRight){const W=176,Hh=74,[c,x]=cvs(W,Hh);x.fillStyle='#f4f2ec';x.fillRect(0,0,W,Hh);x.fillStyle='#e2e0da';x.fillRect(0,Hh-14,W,14);x.fillStyle='#ffffff';x.fillRect(0,2,W,1);
  const F=frontRight?(X=>W-X):(X=>X);const fx=(X,w)=>frontRight?W-X-w:X;
  // windows: a dark glass band with pillars, the cab glass at the front end
  x.fillStyle='#24303e';x.fillRect(fx(8,128),12,128,20);x.fillStyle='#f4f2ec';for(let i=1;i<5;i++)x.fillRect(fx(8+i*25.6|0,3),12,3,20);x.fillStyle='#3e5266';for(let i=0;i<5;i++)x.fillRect(fx(10+i*25.6|0,6),14,6,2);
  x.fillStyle='#24303e';x.fillRect(fx(142,22),12,22,20);x.fillStyle='#f4f2ec';x.fillRect(fx(138,4),10,4,40);
  // navy stripe with the company name
  x.fillStyle='#1d3a6e';x.fillRect(0,38,W,12);x.fillStyle='#ffd34d';x.fillRect(0,50,W,2);x.font='bold 9px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ffffff';x.fillText('SIAM SYDNEY SERVICES',frontRight?78:98,44);
  x.fillStyle='#1d3a6e';x.font='7px "Pixelify Sans", monospace';x.fillText('DAY TOURS · WA',frontRight?78:98,58);
  // wheel arches and the sliding door line
  x.fillStyle='#2a2a30';[30,140].forEach(X=>{x.beginPath();x.arc(F(X),Hh,14,Math.PI,0);x.fill();});x.fillStyle='#c8c6c0';x.fillRect(fx(56,1),12,1,Hh-16);x.fillRect(fx(92,1),12,1,Hh-16);
  return c;}
function vanEnd(front){const W=64,Hh=74,[c,x]=cvs(W,Hh);x.fillStyle='#f4f2ec';x.fillRect(0,0,W,Hh);x.fillStyle='#24303e';x.fillRect(5,front?8:12,W-10,front?24:20);
  if(front){x.fillStyle='#3e5266';x.fillRect(8,10,20,2);x.fillStyle='#2a2a30';x.fillRect(14,50,36,8);x.fillStyle='#e8eef2';x.fillRect(3,44,10,6);x.fillRect(W-13,44,10,6);}
  else{x.fillStyle='#c83a2a';x.fillRect(2,36,5,14);x.fillRect(W-7,36,5,14);x.fillStyle='#1d3a6e';x.fillRect(0,38,W,10);x.fillStyle='#ffffff';x.font='bold 7px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('SIAM SYDNEY',W/2,43);
    x.fillStyle='#d8d6d0';x.fillRect(18,54,28,9);x.fillStyle='#2a2a30';x.font='6px "Pixelify Sans", monospace';x.fillText('TOURS',W/2,59);}
  x.fillStyle='#2a2a30';x.fillRect(0,Hh-8,W,8);return c;}
K.van=[1047,36.8];K.arrive=[1044.4,35];
{const [vx,vz]=K.van,y=.5,g=new THREE.Group();g.position.set(vx,y,vz);G.add(g);
  const L=5.4,W_=2,Hv=2.3;const roof=M('#ecebe6');
  const sideR=texM(vanSide(true)),sideL=texM(vanSide(false)),fr=texM(vanEnd(true)),bk=texM(vanEnd(false));
  // the front of the van points north (-z): +x side has the cab on its right as you look at it
  put(B(W_,Hv-.45,L),[sideR,sideL,roof,M('#2a2a30'),bk,fr],0,.45+(Hv-.45)/2,0,{to:g});
  put(B(W_-.1,.14,L-.4),M('#dcdad4'),0,Hv+.07,.1,{to:g,nc:1});
  [[-1,-1.7],[1,-1.7],[-1,1.7],[1,1.7]].forEach(([a,b])=>{const wh=put(CY(.36,.36,.26,10),[M('#22232a'),M('#5a5e66'),M('#5a5e66')],a*(W_/2-.08),.36,b,{to:g,rz:Math.PI/2});});
  put(B(.06,.2,.12),M('#2a2a30'),W_/2+.04,1.5,-1.9,{to:g,nc:1});put(B(.06,.2,.12),M('#2a2a30'),-W_/2-.04,1.5,-1.9,{to:g,nc:1});
  [-.7,.7].forEach(a=>{const l=put(B(.3,.12,.04),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),a,.95,-L/2-.03,{to:g,nc:1});PXB_LAMPS.push(l);});
  col(vx-W_/2-.05,vz-L/2,vx+W_/2+.05,vz+L/2);}
// parked cars and two that drive the loop (loosely inspired, no real models or logos)
function pxF(col,W,Hh,top){const[c,x]=cvs(W,Hh);const base=new THREE.Color(col);const sh=f=>`rgb(${Math.min(255,base.r*255*f)|0},${Math.min(255,base.g*255*f)|0},${Math.min(255,base.b*255*f)|0})`;
  x.fillStyle=sh(top?1.06:1);x.fillRect(0,0,W,Hh);for(let y=0;y<Hh;y++)for(let X=0;X<W;X++){const q=((X*73856093)^(y*19349663))>>>0;if(q%11===0){x.fillStyle=sh(top?1:.94);x.fillRect(X,y,1,1);}else if(q%13===0){x.fillStyle=sh(top?1.12:1.06);x.fillRect(X,y,1,1);}}
  if(!top){x.fillStyle=sh(1.2);x.fillRect(0,0,W,1);x.fillStyle=sh(.8);x.fillRect(0,Hh-2,W,1);}x.fillStyle=sh(.62);x.fillRect(0,Hh-1,W,1);x.fillRect(0,0,1,Hh);x.fillRect(W-1,0,1,Hh);if(top)x.fillRect(0,0,W,1);return c;}
function car(c,g){const body=texM(pxF(c,128,22));const top=texM(pxF(c,80,22,true));const gl=M('#2a3644');
  put(B(4,.62,1.8),[body,body,top,M('#2a2a30'),body,body],0,.62,0,{to:g});
  const cab=new THREE.Mesh(B(2.3,.62,1.62),[gl,gl,top,gl,gl,gl]);cab.position.set(-.2,1.24,0);cab.castShadow=cab.receiveShadow=true;cab.__pxSkip=1;g.add(cab);
  put(B(2.36,.1,1.66),M(c),-.2,1.56,0,{to:g,nc:1});
  [[-1.3,-.86],[1.3,-.86],[-1.3,.86],[1.3,.86]].forEach(([a,b])=>put(CY(.34,.34,.24,10),[M('#1e1f24'),M('#6a6e76'),M('#6a6e76')],a,.34,b,{to:g,rx:Math.PI/2}));
  const hl=put(B(.04,.12,1.4),M('#f2eee0'),2.01,.72,0,{to:g,nc:1});return g;}
// two camper vans in the car park (a hired camper with a pop-top, and an older one with an awning out), loosely inspired, no real models
function camper(c,g,pop){const L=5.6,W_=2.05;const[c1,x1]=cvs(180,80);x1.fillStyle='#f2f0ea';x1.fillRect(0,0,180,80);x1.fillStyle=c;x1.fillRect(0,46,180,10);x1.fillStyle='#24303e';x1.fillRect(140,10,34,24);x1.fillRect(18,16,40,18);x1.fillRect(70,16,28,18);
  x1.fillStyle='#c8c6c0';x1.fillRect(104,10,1,62);x1.fillRect(132,10,1,62);x1.fillStyle='#2a2a30';[34,150].forEach(X=>{x1.beginPath();x1.arc(X,80,14,Math.PI,0);x1.fill();});x1.fillStyle='#ffffff';x1.font='bold 8px "Pixelify Sans", monospace';x1.fillText(pop?'ROAM WEST':'SANDGROPER',22,54);
  const sd=texM(c1),fr=texM(vanEnd(true)),rf=M('#e8e6e0');put(B(L,2.15,W_),[fr,M('#e8e6e0'),rf,M('#2a2a30'),sd,sd],0,.45+1.07,0,{to:g});
  if(pop){put(B(3,.5,1.9),[M(c),M(c),M('#ecebe6'),M(c),M(c),M(c)],-.6,2.85,0,{to:g});}else{[-1.4,-.2,1].forEach(d=>put(B(.06,.06,1.9),M('#3a3e46'),d,2.66,0,{to:g,nc:1}));put(B(1.4,.35,1.2),M('#e2dccc'),-.4,2.85,0,{to:g});[-.4,.4].forEach(d=>put(CY(.3,.3,.04,10),M('#2a2a30'),-L/2-.2,1.2,d,{to:g,rz:Math.PI/2,nc:1}));}
  put(B(.9,.25,1.4),M('#5a5e66'),-L/2+1.2,2.7,0,{to:g,nc:1});
  [[-1.8,-.92],[1.8,-.92],[-1.8,.92],[1.8,.92]].forEach(([a,b])=>put(CY(.38,.38,.26,10),[M('#1e1f24'),M('#6a6e76'),M('#6a6e76')],a,.38,b,{to:g,rx:Math.PI/2}));return g;}
[['#2f8a8a',CP.x1+2.7,CP.z2-2.9,1],['#c9473f',CP.x1+1.4+3.9,CP.z2-2.9,0]].forEach(([c,x,z,pop])=>{const g=new THREE.Group();g.position.set(x,.5,z);g.rotation.y=Math.PI/2;G.add(g);camper(c,g,pop);col(x-1.1,z-2.85,x+1.1,z+2.85);});
{[['#e8e6e0',CP.x1+1.4+6.5,CP.z2-2.6],['#d8a020',CP.x1+11.9,CP.z1+2.3],['#3a4a5a',CP.x1+14.5,CP.z1+2.3]].filter(([c,x,z])=>[[-.9,-2],[.9,-2],[-.9,2],[.9,2],[0,0]].every(([a,b])=>loopD(x+a,z+b)>2.7)&&Math.abs(x-1047)>2.2).forEach(([c,x,z])=>{const g=new THREE.Group();g.position.set(x,.5,z);g.rotation.y=Math.PI/2;G.add(g);car(c,g);col(x-.95,z-2.05,x+.95,z+2.05);});
  [['#c8303a',.2],['#1d2a5a',.55],['#e8e6e0',.83]].forEach(([c,u])=>{const g=new THREE.Group();G.add(g);car(c,g);PIN.cars.push({g,u,v:3.2+R(),wait:0});});}
