/* people and animals: a touch brighter than the calm background, less so at night */
function pxPopTick(){const now=performance.now();if(pxPopTick.t&&now-pxPopTick.t<900)return;pxPopTick.t=now;if(typeof BB==='undefined')return;const n=typeof NIGHT==='number'?NIGHT:0,k=.13*(1-.75*n);
  for(const o of BB){const F=o.userData&&o.userData.frames;if(!F)continue;for(const f of F){const m=f.m;if(!m||!m.map||!m.emissive||!m.emissive.isColor)continue;if(!m.__pop){m.__pop=1;m.emissive.set(0xffffff);m.emissiveMap=m.map;m.needsUpdate=true;}m.emissiveIntensity=k;}}}

// ---------- Albany Highway like Paul's photos (Look Lab ?vp2, Oct 2026): kerbside parking bays both sides, red-brown road,
// brick footpaths, banner poles and curved street lamps. Bays sit where the painted lanes were; every third bay stays empty
// so Kip can always cross to the night market.
const VP2_ON=/[?&#]vp2\b/.test(location.search+location.hash);
function vp2Build(){if(typeof VPB==='undefined')return;const X1=489,X2=561,V=new THREE.Vector3(),B=new THREE.Box3();scene.updateMatrixWorld(true);const r=mulberry32(91);
  const inVP=(o)=>{B.setFromObject(o);B.getCenter(V);scene.worldToLocal(V);return V.x>480&&V.x<570&&Math.abs(V.z)<2.2&&B.max.y<.06;};// world → scene-local (the scene is mirrored while Kip is on the island)
  // road recoloured red-brown, painted lanes hidden (the bays take their place), footpaths become red brick
  const brick=(()=>{const c=mk(32,32),x=c.getContext('2d');x.fillStyle='#7a4a3e';x.fillRect(0,0,32,32);for(let y=0;y<32;y+=4)for(let X=-(y/4%2)*4;X<32;X+=8){const f=.9+r()*.2;x.fillStyle=`rgb(${168*f|0},${92*f|0},${74*f|0})`;x.fillRect(X+1,y+1,7,3);x.fillStyle=`rgb(${188*f|0},${112*f|0},${92*f|0})`;x.fillRect(X+1,y+1,7,1);}return c;})();
  const flats=[];scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry')flats.push(o);});flats.forEach(o=>{if(!inVP(o))return;const p=o.geometry.parameters,c=o.material.color?o.material.color.getHexString():'';
    if(p.width>60&&Math.abs(V.z)<.1){o.material=o.material.clone();o.material.color.set('#c89282');}
    else if(p.width>60&&c==='c4573e')o.visible=false;
    else if(p.width>60&&Math.abs(Math.abs(V.z)-1.6)<.1){o.material=o.material.clone();o.material.map=ctex(brick,{rep:[p.width*1.2,1]});o.material.color.set('#ffffff');}});
  const W=new THREE.MeshBasicMaterial({color:'#f2efe6'}),flat=(w,d,x,z,m)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);q.rotation.x=-Math.PI/2;q.position.set(x,.031,z);scene.add(q);return q;};
  // bays: a line across every car length, a short tick along the kerb; parked cars in most of them
  const PCOL=['#f6f6f0','#c8ccd0','#2a2a30','#c8344a','#2f6fb0','#9aa4ac','#f6f6f0','#5a5e6a'];let nCars=0;
  [-.92,.92].forEach(z=>{const n=Math.floor((X2-X1)/1.75);for(let k=0;k<=n;k++){const x=X1+k*(X2-X1)/n;flat(.05,.46,x,z,W);flat(.3,.05,x,z+(z<0?-.21:.21),W);}
    for(let k=0;k<n;k++){if(k%3===1||r()>.8)continue;const x=X1+(k+.5)*(X2-X1)/n;const m=typeof CDET!=='undefined'&&CDET.makeCar?(r()<.3&&CDET.retroCar?CDET.retroCar():CDET.makeCar(r()<.25?'ute':r()<.5?'hatch':'sedan',PCOL[r()*PCOL.length|0])):null;if(!m)continue;
      m.g.scale.setScalar(.86);m.g.position.set(x,0,z);m.g.rotation.y=z<0?Math.PI:0;scene.add(m.g);nCars++;col(x-.62,z-.3,x+.62,z+.3);}});
  // banner poles on the south kerb and curved green street lamps (fictional banners, no real branding)
  const pm=new THREE.MeshLambertMaterial({color:'#2e5a3a'});
  for(let x=494;x<560;x+=12.6){const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,3.4,6),new THREE.MeshLambertMaterial({color:'#8a7a5a'}));p.position.set(x,1.7,1.32);scene.add(p);col(x-.08,1.24,x+.08,1.4);
    const c=mk(16,40),g=c.getContext('2d');const cols=['#e84a7a','#f2a03a','#f4d04a','#5ab45a','#3a8ad8','#8a5ad8'];for(let y=0;y<40;y++){g.fillStyle=cols[Math.min(5,y/40*6|0)];g.fillRect(0,y,16,1);}
    g.fillStyle='#ffffff';g.font='bold 5px monospace';g.textAlign='center';['ALL','ARE','WEL-','COME'].forEach((t,i)=>g.fillText(t,8,9+i*7));const b=new THREE.Mesh(new THREE.PlaneGeometry(.42,1.05),new THREE.MeshLambertMaterial({map:ctex(c),side:THREE.DoubleSide}));b.position.set(x+.24,2.75,1.32);scene.add(b);}
  for(let x=500;x<560;x+=12.6){const p=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,3,6),pm);p.position.set(x,1.5,1.38);scene.add(p);const arm=new THREE.Mesh(new THREE.TorusGeometry(.35,.03,4,10,Math.PI/2),pm);arm.position.set(x,3,1.03);arm.rotation.y=Math.PI/2;scene.add(arm);
    const hd=new THREE.Mesh(new THREE.BoxGeometry(.18,.08,.3),pm);hd.position.set(x,3.32,.7);scene.add(hd);const l=new THREE.Mesh(new THREE.BoxGeometry(.14,.03,.24),new THREE.MeshBasicMaterial({color:'#ffe2a0'}));l.position.set(x,3.27,.7);scene.add(l);if(typeof PXB_LAMPS!=='undefined')PXB_LAMPS.push(l);col(x-.07,1.31,x+.07,1.45);}
  vp2Build.cars=nCars;}
// ---------- Landmarks rebuilt with the pixel kit by the builder team (Look Lab ?bld3, Oct 2026): Kingstown Barracks, Perth Station, the Moorings Hotel ----------
const BLD3_ON=/[?&#](bld3|lab)\b/.test(location.search+location.hash);
// Kingstown Barracks (Rottnest, south side): pixel-look heritage barracks. Builder: kingstown.
// Cream rendered walls with limestone quoins, sash windows + shutters, hipped corrugated-tin roofs, a long verandah on
// timber posts with brackets, fretwork and a rail, a gabled entrance porch with the name sign, chimneys, gutters and
// downpipes, a waving flag, lanterns that glow at night, benches and a bike rack. Footprint and colliders unchanged.
function pxbBuild_kingstown(){
  if(typeof PXK==='undefined')return;
  const V3=THREE.Vector3;
  /* ---- 1. find the old barracks (scene-local; un-mirror while measuring) ---- */
  const sx0=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);const BX=new THREE.Box3();const old=[];let main=null,annex=null,pole=null;
  scene.traverse(o=>{if(!o.isMesh||!o.__wa||!o.visible)return;BX.setFromObject(o);if(BX.isEmpty())return;
    if(BX.min.x<-102.3||BX.max.x>-84.4||BX.min.z<-18.4||BX.max.z>-13.85)return;
    const t=o.geometry.type,c=o.material&&o.material.color?o.material.color.getHexString():'';
    const box={x0:BX.min.x,x1:BX.max.x,y1:BX.max.y,z0:BX.min.z,z1:BX.max.z};
    if(t==='BoxGeometry'||t==='CylinderGeometry'||(t==='PlaneGeometry'&&(o.parent!==scene||c==='1f3a7a'))){old.push(o);
      if(t==='BoxGeometry'&&box.y1>2.3&&box.y1<2.7&&box.z1-box.z0>2.8){const w=box.x1-box.x0;if(w>8.5&&w<9.5)main=box;else if(w>5.5&&w<6.5)annex=box;}
      if(t==='BoxGeometry'&&box.y1>4&&box.x1-box.x0<.2)pole=box;}});
  scene.scale.x=sx0;scene.updateMatrixWorld(true);
  if(!main)return;// not found: leave the old barracks alone
  old.forEach(o=>o.visible=false);
  const M={cx:(main.x0+main.x1)/2,cz:(main.z0+main.z1)/2,w:main.x1-main.x0,d:main.z1-main.z0,h:2.6};
  const A=annex?{cx:(annex.x0+annex.x1)/2,cz:(annex.z0+annex.z1)/2,w:annex.x1-annex.x0,d:annex.z1-annex.z0,h:2.4}:null;
  const FP=pole?{x:(pole.x0+pole.x1)/2,z:(pole.z0+pole.z1)/2}:{x:M.cx-5.8,z:M.cz+2.4};
  /* ---- 2. helpers ---- */
  const G=new THREE.Group();G.name='kingstownPX';scene.add(G);
  const T=(c,rep)=>{const t=ctex(c);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;}return t;};
  const LM=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(c,o&&o.rep)},o?(({rep,...r})=>r)(o):{}));
  const CM=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:T(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:T(PXK.glowDiff(a,b))});PXB_GLOW.push(m);return m;};
  const mesh=(geo,mat,x,y,z,o={})=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;m.castShadow=!o.nc;m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;};
  const Bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  // batches: many small pieces of one material become one mesh
  const batches=new Map();const bat=(mat,geo,x,y,z,o={})=>{let b=batches.get(mat);if(!b){b=[];batches.set(mat,b);}const m=new THREE.Matrix4(),q=new THREE.Quaternion();
    if(o.q)q.copy(o.q);else q.setFromEuler(new THREE.Euler(o.rx||0,o.ry||0,o.rz||0));m.compose(new V3(x,y,z),q,new V3(1,1,1));const g=(geo.index?geo.toNonIndexed():geo.clone());g.applyMatrix4(m);b.push(g);};
  const flush=()=>{batches.forEach((list,mat)=>{let n=0;list.forEach(g=>n+=g.attributes.position.count);const P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2);let o=0;
    list.forEach(g=>{P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);if(g.attributes.uv)U.set(g.attributes.uv.array,o*2);o+=g.attributes.position.count;});
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('normal',new THREE.BufferAttribute(N,3));geo.setAttribute('uv',new THREE.BufferAttribute(U,2));mesh(geo,mat,0,0,0);});};
  // a beam between two points (scene-local), batched
  const beam=(mat,a,b,t)=>{const d=new V3().subVectors(b,a),L=d.length();const q=new THREE.Quaternion().setFromUnitVectors(new V3(0,0,1),d.normalize());bat(mat,Bx(t,t,L),(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2,{q});};
  // triangle soup with metric UVs
  const soup=()=>{const P=[],U=[];return{tri(p,q,r,up,uq,ur){P.push(...p,...q,...r);U.push(...up,...uq,...ur);},quad(a,b,c,d,ua,ub,uc,ud){this.tri(a,b,c,ua,ub,uc);this.tri(a,c,d,ua,uc,ud);},
    geo(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();return g;}};};
  /* ---- 3. palette + textures ---- */
  const WALL='#ecdfc0',TRIM='#f6eedb',GREEN='#3d5c46',TIN='#8c9592',STONE='#d9c9a0';
  const tinC=(()=>{const[c,x]=PXK.cv(64,64);PXK.seed(5);for(let X=0;X<64;X+=4){PXK.P(x,PXK.sh(TIN,.86),X,0,1,64);PXK.P(x,PXK.sh(TIN,1.0),X+1,0,1,64);PXK.P(x,PXK.sh(TIN,1.16),X+2,0,1,64);PXK.P(x,PXK.sh(TIN,1.04),X+3,0,1,64);}
    [0,32].forEach(y=>{PXK.P(x,PXK.sh(TIN,.66),0,y,64,1);PXK.P(x,PXK.sh(TIN,1.2),0,y+1,64,1);});for(let X=1;X<64;X+=8)[3,35].forEach(y=>PXK.P(x,'#e8ecea',X,y,1,1));
    for(let i=0;i<34;i++){const X=PXK.rnd()*64|0,Y=PXK.rnd()*64|0;PXK.P(x,PXK.rnd()<.6?'#9a7a5a':'#8a8f8a',X,Y,1,1+(PXK.rnd()*3|0));}for(let i=0;i<4;i++){const X=PXK.rnd()*60|0;for(let k=0;k<6;k++)PXK.P(x,'rgba(150,100,70,.45)',X+(k%2),30+k*2,1,2);}return c;})();
  const tinMat=new THREE.MeshLambertMaterial({map:T(tinC,1),side:THREE.DoubleSide});
  const boardsC=(base,W=64,H=64)=>{const[c,x]=PXK.cv(W,H);PXK.seed(9);for(let y=0;y<H;y+=6){const f=.92+PXK.rnd()*.1;PXK.P(x,PXK.sh(base,f),0,y,W,6);PXK.P(x,PXK.sh(base,f*1.12),0,y,W,1);PXK.P(x,PXK.sh(base,.62),0,y+5,W,1);const j=PXK.rnd()*W|0;PXK.P(x,PXK.sh(base,.62),j,y,1,5);}return c;};
  const deckMat=new THREE.MeshLambertMaterial({map:T(boardsC('#8a6e52'),1)});const ceilMat=new THREE.MeshLambertMaterial({map:T(boardsC('#e4d8bc'),1),side:THREE.DoubleSide});
  const stoneC=(W,H)=>{const[c,x]=PXK.cv(W,H);PXK.seed(13);PXK.blocks(x,W,H,STONE,{rowH:6,minW:8,varW:6});return c;};
  const stoneCv=stoneC(64,64),stoneMats=new Map();const stoneR=(rx,ry)=>{const k=(Math.round(rx*4)/4)+'|'+(Math.round(ry*4)/4);let m=stoneMats.get(k);if(!m){const t=T(stoneCv,1);t.repeat.set(Math.max(.25,Math.round(rx*4)/4),Math.max(.25,Math.round(ry*4)/4));m=new THREE.MeshLambertMaterial({map:t});stoneMats.set(k,m);}return m;};
  const stoneMat=stoneR(.25,.25);
  const quoinMat=LM((()=>{const[c,x]=PXK.cv(8,96);PXK.P(x,PXK.sh(STONE,.6),0,0,8,96);for(let y=0,k=0;y<96;y+=8,k++){PXK.P(x,PXK.sh(STONE,k%2?1.02:.94),0,y,8,7);PXK.P(x,PXK.sh(STONE,1.12),0,y,8,1);}return c;})());
  const trimMat=LM((()=>{const[c,x]=PXK.cv(64,8);PXK.cornice(x,64,8,TRIM);return c;})(),{rep:1});
  const greenM=CM(GREEN),greenD=CM(PXK.sh(GREEN,.75)),gutM=CM('#7f8a86'),whiteM=CM('#f2efe6'),goldM=CM('#e2b04a'),darkM=CM('#2a2a30'),woodM=CM('#8a5a36'),woodD=CM('#5e3c24'),creamM=CM(TRIM);
  // wall faces (day + lit), ends and back
  const wallOpt={base:WALL,kind:'plaster',shutter:GREEN,doorCol:GREEN,winW:20,winH:34,trim:TRIM};
  const face=(w,h,o,seed)=>litMat(lit=>PXK.wall(w,h,Object.assign({},wallOpt,o,{lit,seed})));
  const topM=CM(PXK.sh(WALL,.8));
  /* ---- 4. a block: walls, plinth, cornice, quoins, hip roof, gutters, downpipes ---- */
  function block(B,o){const{cx,cz,w,d,h}=B;const fz=cz+d/2,bz=cz-d/2;
    const front=face(w,h,{win:o.win,door:true,doorAt:.5,ivy:o.ivy},o.seed),back=face(w,h,{win:o.win+1,door:false},o.seed+1),end=face(d,h,{win:1,door:false},o.seed+2);
    mesh(Bx(w,h,d),[end,end,topM,topM,front,back],cx,h/2,cz);
    // plinth + cornice band + corner quoins
    mesh(Bx(w+.08,.22,d+.08),[stoneR(d/2,.11),stoneR(d/2,.11),stoneMat,stoneMat,stoneR(w/2,.11),stoneR(w/2,.11)],cx,.11,cz,{nc:1});
    mesh(Bx(w+.12,.16,d+.12),trimMat,cx,h-.08,cz,{nc:1});
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>bat(quoinMat,Bx(.14,h-.3,.14),cx+sx*(w/2+.01),(h-.3)/2+.14,cz+sz*(d/2+.01)));
    // hipped tin roof
    const ov=.32,a=w/2+ov,b=d/2+ov,rise=o.rise,r=Math.max(.2,a-b),y0=h,sl=Math.hypot(b,rise),hl=Math.hypot(b,rise),TS=2;const S=soup();
    const P=(x,y,z)=>[cx+x,y0+y,cz+z];
    S.quad(P(-a,0,b),P(a,0,b),P(r,rise,0),P(-r,rise,0),[0,0],[2*a/TS,0],[(a+r)/TS,sl/TS],[(a-r)/TS,sl/TS]);
    S.quad(P(a,0,-b),P(-a,0,-b),P(-r,rise,0),P(r,rise,0),[0,0],[2*a/TS,0],[(a+r)/TS,sl/TS],[(a-r)/TS,sl/TS]);
    S.tri(P(a,0,b),P(a,0,-b),P(r,rise,0),[0,0],[2*b/TS,0],[b/TS,hl/TS]);
    S.tri(P(-a,0,-b),P(-a,0,b),P(-r,rise,0),[0,0],[2*b/TS,0],[b/TS,hl/TS]);
    mesh(S.geo(),tinMat,0,0,0);
    // ridge + hip caps, eave fascia, gutters, downpipes
    const cap=CM(PXK.sh(TIN,.72));bat(cap,Bx(2*r+.12,.1,.16),cx,y0+rise+.03,cz);
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx,sz])=>beam(cap,new V3(cx+sx*a,y0+.02,cz+sz*b),new V3(cx+sx*r,y0+rise+.03,cz),.09));
    [[0,b],[0,-b]].forEach(([_,z])=>{bat(creamM,Bx(2*a,.12,.05),cx,y0-.03,cz+z+(z>0?.01:-.01));bat(gutM,Bx(2*a+.04,.1,.12),cx,y0-.08,cz+z+(z>0?.07:-.07));});
    [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sz])=>{bat(gutM,Bx(.07,y0-.1,.07),cx+sx*(a-.16),(y0-.1)/2,cz+sz*(d/2+.06));bat(gutM,Bx(.07,.07,.24),cx+sx*(a-.16),y0-.12,cz+sz*(d/2+.14));bat(gutM,Bx(.16,.05,.1),cx+sx*(a-.16),.04,cz+sz*(d/2+.1));});
    // chimneys: limestone stacks with a cap and two pots
    (o.chim||[]).forEach(([dx,dz,ht])=>{const x=cx+dx,z=cz+dz,y1=y0+ht;mesh(Bx(.5,ht,.62),[stoneR(.31,ht/2),stoneR(.31,ht/2),stoneMat,stoneMat,stoneR(.25,ht/2),stoneR(.25,ht/2)],x,y0+ht/2,z);mesh(Bx(.62,.1,.74),creamM,x,y1+.05,z,{nc:1});
      [-.13,.13].forEach(k=>mesh(new THREE.CylinderGeometry(.07,.09,.22,6),CM('#a8583a'),x,y1+.21,z+k,{nc:1}));});
    return{fz,bz};}
  const mainF=block(M,{win:4,seed:301,rise:1.0,chim:[[-2.4,-.15,1.45],[2.4,-.15,1.45]],ivy:[.04,.1]});
  const annF=A?block(A,{win:2,seed:311,rise:.9,chim:[[1.3,-.15,1.3]]}):null;
  /* ---- 5. the long verandah ---- */
  const vx0=M.cx-M.w/2-.15,vx1=A?A.cx+A.w/2+.15:M.cx+M.w/2+.15,vz0=mainF.fz,vz1=mainF.fz+1.38,yB=2.42,yF=2.12,VL=vx1-vx0,vcx=(vx0+vx1)/2;
  {const S=soup(),D=vz1-vz0,sl=Math.hypot(D,yB-yF);S.quad([vx0,yF+.04,vz1],[vx1,yF+.04,vz1],[vx1,yB+.04,vz0],[vx0,yB+.04,vz0],[0,0],[VL/2,0],[VL/2,sl/2],[0,sl/2]);mesh(S.geo(),tinMat,0,0,0);
    const C=soup();C.quad([vx0,yB,vz0],[vx1,yB,vz0],[vx1,yF,vz1],[vx0,yF,vz1],[0,0],[VL/2,0],[VL/2,sl/2],[0,sl/2]);mesh(C.geo(),ceilMat,0,0,0,{nc:1});}
  // deck: boards on a low limestone edge
  {const D=vz1-vz0+.12;const dg=Bx(VL,.1,D);const uv=dg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*VL/2,uv.getY(i)*D/2);mesh(dg,[stoneMat,stoneMat,deckMat,deckMat,stoneR(VL/2,.05),stoneMat],vcx,.05,(vz0+vz1)/2+.06,{nc:1});}
  // fascia beam, gutter on the front, fretwork frieze
  bat(greenM,Bx(VL,.12,.08),vcx,yF-.05,vz1);bat(gutM,Bx(VL+.04,.1,.12),vcx,yF-.02,vz1+.09);
  {const W=Math.round(VL*32),H=6;const[c,x]=PXK.cv(W,H);PXK.P(x,GREEN,0,0,W,1);for(let X=0;X<W;X+=4){PXK.P(x,GREEN,X,1,1,3);PXK.P(x,GREEN,X+2,2,1,1);}PXK.P(x,PXK.sh(GREEN,.8),0,4,W,1);
    for(let X=2;X<W;X+=4)PXK.P(x,GREEN,X,5,1,1);const fm=new THREE.MeshLambertMaterial({map:T(c),transparent:true,alphaTest:.5,side:THREE.DoubleSide});const f=mesh(new THREE.PlaneGeometry(VL,H/32),fm,vcx,yF-.11-H/64,vz1,{nc:1});f.castShadow=false;}
  // posts with brackets and a low rail (gaps at the entrances)
  const porchW=3.0,gaps=[[M.cx-porchW/2-.05,M.cx+porchW/2+.05]];if(A)gaps.push([A.cx-.65,A.cx+.65]);const inGap=x=>gaps.some(([a,b])=>x>a&&x<b);
  const posts=[];{const n=Math.round(VL/1.55);for(let i=0;i<=n;i++){const x=vx0+.08+i*(VL-.16)/n;if(Math.abs(x-M.cx)<porchW/2+.2)continue;posts.push(x);}}
  posts.forEach(x=>{const z=vz1-.06;bat(greenM,Bx(.13,yF-.1,.13),x,.1+(yF-.2)/2,z);bat(greenD,Bx(.19,.1,.19),x,.15,z);bat(greenD,Bx(.17,.06,.17),x,yF-.14,z);
    [-1,1].forEach(s=>{if(x+s*.3<vx0||x+s*.3>vx1)return;bat(greenM,Bx(.05,.42,.05),x+s*.15,yF-.26,z,{rz:-s*.78});});});
  for(let i=0;i<posts.length-1;i++){const xa=posts[i]+.07,xb=posts[i+1]-.07;if(xb-xa>2.2)continue;// the porch bay stays open
    const segs=[[xa,xb]];gaps.forEach(([g0,g1])=>{for(let k=segs.length-1;k>=0;k--){const[s0,s1]=segs[k];if(g1<=s0||g0>=s1)continue;segs.splice(k,1);if(g0-s0>.25)segs.push([s0,g0]);if(s1-g1>.25)segs.push([g1,s1]);}});
    segs.forEach(([s0,s1])=>{const L=s1-s0,cx=(s0+s1)/2,z=vz1-.06;bat(greenM,Bx(L,.07,.09),cx,.82,z);bat(greenM,Bx(L,.06,.07),cx,.22,z);for(let X=s0+.1;X<s1-.05;X+=.16)bat(creamM,Bx(.035,.56,.035),X,.52,z);});}
  /* ---- 6. the gabled entrance porch with the name sign ---- */
  {const px=M.cx,z0=vz0,z1=vz1+.18,ye=2.52,ya=3.18,hw=porchW/2+.12,S=soup(),sl=Math.hypot(hw,ya-ye),D=z1-z0;
    S.quad([px+hw,ye,z1],[px+hw,ye,z0],[px,ya,z0],[px,ya,z1],[0,0],[D/2,0],[D/2,sl/2],[0,sl/2]);S.quad([px-hw,ye,z0],[px-hw,ye,z1],[px,ya,z1],[px,ya,z0],[0,0],[D/2,0],[D/2,sl/2],[0,sl/2]);
    mesh(S.geo(),tinMat,0,0,0);
    bat(CM(PXK.sh(TIN,.72)),Bx(.12,.1,D+.04),px,ya+.03,(z0+z1)/2);
    // pediment: rendered tympanum with a round vent and a limestone date stone, framed by a moulded rake
    const pw=porchW+.1,ph=ya-ye-.06;const[c,x]=PXK.cv(Math.round(pw*32),Math.round(ph*32));PXK.seed(77);PXK.plaster(x,c.width,c.height,WALL);
    const cxp=c.width/2;for(let k=-5;k<=5;k++)for(let j=-5;j<=5;j++)if(k*k+j*j<=25)PXK.P(x,k*k+j*j>16?PXK.sh(STONE,.75):((k+j)%2?'#3a3a40':'#5a5a62'),cxp+k,c.height*.5+j);
    for(let j=-4;j<=4;j+=2)PXK.P(x,PXK.sh(STONE,.85),cxp-4,c.height*.5+j,9,1);
    const tg=new THREE.Shape();tg.moveTo(-pw/2,0);tg.lineTo(pw/2,0);tg.lineTo(0,ph);tg.closePath();const tgeo=new THREE.ShapeGeometry(tg);const uv=tgeo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(uv.getX(i)+pw/2)/pw,uv.getY(i)/ph);
    mesh(tgeo,new THREE.MeshLambertMaterial({map:T(c),side:THREE.DoubleSide}),px,ye+.02,z1-.06,{nc:1});
    [-1,1].forEach(s=>beam(creamM,new V3(px+s*(pw/2+.08),ye-.02,z1-.02),new V3(px,ya-.0,z1-.02),.1));bat(creamM,Bx(pw+.24,.12,.12),px,ye-.02,z1-.04);
    mesh(new THREE.SphereGeometry(.08,6,4),goldM,px,ya+.14,z1-.02,{nc:1});
    // two stout posts with capitals, the sign board on the porch beam
    [-1,1].forEach(s=>{const x=px+s*(porchW/2-.05),z=z1-.12;bat(creamM,Bx(.2,ye-.12,.2),x,.1+(ye-.22)/2,z);bat(stoneMat,Bx(.3,.3,.3),x,.25,z);bat(creamM,Bx(.28,.1,.28),x,ye-.16,z);
      bat(creamM,Bx(.06,.46,.06),x-s*.18,ye-.36,z,{rz:s*.78});
      // lantern on each porch post
      mesh(Bx(.22,.05,.22),darkM,x,1.84,z+.15,{nc:1});mesh(Bx(.2,.04,.2),darkM,x,1.6,z+.15,{nc:1});mesh(new THREE.ConeGeometry(.17,.12,4),darkM,x,1.92,z+.15,{nc:1,ry:Math.PI/4});[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>bat(darkM,Bx(.025,.22,.025),x+a*.085,1.72,z+.15+b*.085));const l=mesh(Bx(.15,.2,.15),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),x,1.72,z+.15,{nc:1});PXB_LAMPS.push(l);});
    const t=makeSign(['KINGSTOWN BARRACKS','1936'],112,22,'#4a5a3a','#f5ecd8');const sg=mesh(new THREE.PlaneGeometry(2.5,.46),new THREE.MeshLambertMaterial({map:t,emissive:0x222222,emissiveMap:t}),px,2.2,z1+.02,{nc:1});
    bat(greenD,Bx(2.62,.56,.04),px,2.2,z1-.01);[-1,1].forEach(s=>bat(darkM,Bx(.02,.12,.02),px+s*1.0,2.5,z1));}
  // the annex gets a small "RANGER BASE" board over its door
  if(A){const t=makeSign(['RANGER BASE'],60,12,'#3d5c46','#f5ecd8');mesh(new THREE.PlaneGeometry(1.3,.26),new THREE.MeshLambertMaterial({map:t}),A.cx,1.86,annF.fz+.02,{nc:1});}
  /* ---- 7. wall lanterns, benches, bike rack, notice board ---- */
  const lamp=(x,y,z)=>{bat(darkM,Bx(.05,.05,.18),x,y+.2,z+.09);mesh(Bx(.2,.04,.18),darkM,x,y+.12,z+.18,{nc:1});mesh(Bx(.16,.04,.16),darkM,x,y-.11,z+.18,{nc:1});mesh(new THREE.ConeGeometry(.14,.1,4),darkM,x,y+.18,z+.18,{nc:1,ry:Math.PI/4});const l=mesh(Bx(.13,.19,.13),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),x,y,z+.18,{nc:1});PXB_LAMPS.push(l);};
  [-2.7,2.7].forEach(dx=>lamp(M.cx+dx,1.95,vz0));if(A)[-1.4,1.4].forEach(dx=>lamp(A.cx+dx,1.8,annF.fz));
  const bench=(x,z)=>{bat(woodM,Bx(1.2,.06,.36),x,.46,z);bat(woodM,Bx(1.2,.22,.05),x,.68,z-.17);[-1,1].forEach(s=>{bat(darkM,Bx(.05,.36,.34),x+s*.52,.28,z);bat(darkM,Bx(.05,.4,.05),x+s*.52,.62,z-.17);});};
  [-2.7,2.7].forEach(dx=>bench(M.cx+dx,vz0+.32));
  const bike=(x,z,col)=>{const fr=CM(col),tor=new THREE.TorusGeometry(.27,.03,4,10);[-.42,.42].forEach(o=>bat(darkM,tor,x+o,.33,z));
    beam(fr,new V3(x-.42,.33,z),new V3(x-.05,.36,z),.04);beam(fr,new V3(x-.05,.36,z),new V3(x+.3,.7,z),.04);beam(fr,new V3(x-.42,.33,z),new V3(x-.15,.68,z),.04);beam(fr,new V3(x-.15,.68,z),new V3(x+.3,.7,z),.04);beam(fr,new V3(x+.42,.33,z),new V3(x+.3,.82,z),.04);
    bat(darkM,Bx(.2,.05,.09),x-.17,.73,z);bat(darkM,Bx(.04,.04,.42),x+.3,.84,z);bat(CM('#c8b090'),Bx(.22,.12,.18),x+.48,.68,z);};
  {const bz=(A?annF.fz:vz0)+.42,bx=A?A.cx-1.9:M.cx+3.9;beam(gutM,new V3(bx-.9,.45,bz-.05),new V3(bx+.9,.45,bz-.05),.04);[-.9,.9].forEach(o=>bat(gutM,Bx(.04,.45,.04),bx+o,.23,bz-.05));
    bike(bx-.45,bz,'#3d7a78');bike(bx+.5,bz+.08,'#c9473f');}
  if(A){const nx=A.cx+1.0,nz=annF.fz+.12;bat(woodD,Bx(.06,1.5,.06),nx-.45,.75,nz);bat(woodD,Bx(.06,1.5,.06),nx+.45,.75,nz);const[c,x]=PXK.cv(30,22);PXK.P(x,'#7a5033',0,0,30,22);PXK.P(x,'#b89060',1,1,28,20);
    [['#f4ecd8',3,3,9,7],['#f4d04a',14,2,7,6],['#a8c8e0',22,4,6,8],['#f4ecd8',4,12,8,8],['#e8b860',15,11,10,8]].forEach(([cl,X,Y,w,h])=>{PXK.P(x,cl,X,Y,w,h);PXK.P(x,'#c9473f',X+(w>>1),Y,1,1);});mesh(Bx(.95,.7,.05),[woodD,woodD,woodD,woodD,LM(c),woodD],nx,1.15,nz,{nc:1});}
  /* ---- 8. flagpole with a waving ranger flag (same spot, same collider) ---- */
  {const fx=FP.x,fz=FP.z,H=4.6;mesh(Bx(.55,.3,.55),stoneMat,fx,.15,fz);mesh(Bx(.4,.12,.4),creamM,fx,.36,fz,{nc:1});mesh(new THREE.CylinderGeometry(.035,.055,H,6),whiteM,fx,.42+H/2,fz);mesh(new THREE.SphereGeometry(.08,6,4),goldM,fx,.46+H,fz,{nc:1});
    const[c,x]=PXK.cv(32,20);PXK.P(x,'#2f5a3e',0,0,32,20);PXK.P(x,'#f2e8cc',0,15,32,2);PXK.P(x,'#e2b04a',0,17,32,1);
    [[15,3,2,10],[11,7,10,2],[12,5,8,6],[13,4,6,8]].forEach(([X,Y,w,h])=>PXK.P(x,'#e2b04a',X,Y,w,h));PXK.P(x,'#f6d070',14,5,2,2);PXK.P(x,'#2a2230',0,0,1,20);
    const fg=new THREE.PlaneGeometry(1.0,.62,8,1);fg.translate(.5,0,0);const base=fg.attributes.position.array.slice();
    const fl=mesh(fg,new THREE.MeshLambertMaterial({map:T(c),side:THREE.DoubleSide}),fx+.04,H+.05,fz,{nc:1});fl.castShadow=true;
    fl.onBeforeRender=()=>{const t=performance.now()/1000,p=fg.attributes.position;for(let i=0;i<p.count;i++){const X=base[i*3];p.array[i*3+2]=Math.sin(t*3.2-X*5)*.09*X;p.array[i*3+1]=base[i*3+1]-X*X*.05;}p.needsUpdate=true;};
    beam(CM('#d8d8d0'),new V3(fx+.05,.5,fz),new V3(fx+.05,H+.36,fz),.012);}
  flush();
  window.__kg=window.__kgStats={main:M,annex:A,flag:FP,hidden:old.length,meshes:G.children.length};
}

