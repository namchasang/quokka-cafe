// ---------- world ----------
const LAND={x1:-15,x2:48,z1:-11,z2:14.5};
const DECK={x1:-5.2,x2:5.2,z1:-5,z2:3.6};
const JETTY={x1:-21.4,x2:-12.6,z1:4.5,z2:5.5};
const colliders=[];
function col(x1,z1,x2,z2){colliders.push({x1,z1,x2,z2});}
// island shape as a signed-distance grid (organic coastline with bays)
const GARDEN={x1:-12.4,x2:-6.2,z1:-2.9,z2:2.3};
const LOTS={bikes:{x:-10.6,z:7.4},ice:{x:8.8,z:6.2},beach:{x:2.6,z:10.4}};
const inGarden=(x,z)=>(x>GARDEN.x1-.6&&x<GARDEN.x2+.6&&z>GARDEN.z1-.6&&z<GARDEN.z2+.6)||Object.values(LOTS).some(l=>Math.hypot(x-l.x,z-l.z)<2.8);
const TB={x1:-24,x2:99,z1:-16,z2:20},GR=4,GW=(TB.x2-TB.x1)*GR+1,GH=(TB.z2-TB.z1)*GR+1;
const BAYS=[[-9,15.6,4.2],[20,-13.4,3.6],[33,15.8,3],[47.5,10.8,2.4],[2,-13.6,2.4],[60,-6.9,1.9],[67.4,-6.7,1.5],[70.4,9.2,2.3],[82.4,8.6,2.1],[62.5,8.7,1.3],[88.5,-6.4,1.4]];
function islandF(x,z){const dx=(x-16.5)/32,dz=(z-1.7)/13;let f=1-Math.pow(Math.pow(Math.abs(dx),6)+Math.pow(Math.abs(dz),6),1/6);
  {const ax=(x-72)/26,az=(z-1.2)/7.2;const fa=(1-Math.pow(Math.pow(Math.abs(ax),4)+Math.pow(Math.abs(az),4),1/4))*.55;if(fa>f)f=fa;}
  f+=.03*Math.sin(x*.45+z*.2)+.025*Math.sin(z*.8-x*.3)+.018*Math.sin(x*1.3+1.7)+.012*Math.sin(z*1.9+x*.9);
  for(const [bx,bz,br] of BAYS)f=Math.min(f,(Math.hypot(x-bx,z-bz)-br)*.035);return f;}
const Fg=new Float32Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++)Fg[j*GW+i]=islandF(TB.x1+i/GR,TB.z1+j/GR);
const Dg=new Float32Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const k=j*GW+i;const i0=i>0?k-1:k,i1=i<GW-1?k+1:k,j0=j>0?k-GW:k,j1=j<GH-1?k+GW:k;
  const fx=(Fg[i1]-Fg[i0])*GR/((i1-i0)||1),fz=(Fg[j1]-Fg[j0])*GR/(((j1-j0)/GW)||1);Dg[k]=Fg[k]/Math.max(.004,Math.hypot(fx,fz));}
function landD(x,z){const u=(x-TB.x1)*GR,v=(z-TB.z1)*GR;const i=Math.floor(u),j=Math.floor(v);if(i<0||j<0||i>=GW-1||j>=GH-1)return -9;const a=u-i,b=v-j,k=j*GW+i;return(Dg[k]*(1-a)+Dg[k+1]*a)*(1-b)+(Dg[k+GW]*(1-a)+Dg[k+GW+1]*a)*b;}
function hash2(i,j){const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s);}
function vnoise(x,z){const i=Math.floor(x),j=Math.floor(z),fx=x-i,fz=z-j,ux=fx*fx*(3-2*fx),uz=fz*fz*(3-2*fz);const a=hash2(i,j),b=hash2(i+1,j),c=hash2(i,j+1),d=hash2(i+1,j+1);return a+(b-a)*ux+(c-a)*uz+(a-b-c+d)*ux*uz;}
const PATHS=[[[45.4,-3.8],[50,-2.4],[58,-1.4],[68,-.8],[80,-.2],[91,.4]],[[59.4,-1.4],[60.2,-4.2]],[[67.2,-.8],[67.6,-4.2]],[[70.4,-.6],[70.8,5.4]],[[62.5,-1.2],[62.6,5.8]],[[82.2,-.1],[82.6,5.8]],[[56,-1.6],[54.8,.6]],[[15.8,-3.6],[24,-3.4],[36,1.6],[48,2.8],[53,1.8]],[[5,0],[31.4,0]],[[31,.2],[31,-5.2]],[[31,0],[35.4,0]],[[-5.3,3],[-9,4.2],[-12.8,5]],[[-5.4,-1],[-6.2,-6.4],[1.5,-6.6]],[[30.6,-3.6],[26,-7.6],[21,-9.2]],[[35,-.2],[40.5,-2.4],[45.4,-3.8]],[[13,0],[11.6,-4.8]],[[-9,4.2],[-10.4,6.6]],[[7,.4],[8.6,5.2]],[[24,.2],[24,3.6]],[[1.5,-6.6],[5.4,-5.6],[7.6,-3.9]],[[7.6,-3.9],[11.6,-4.8]],[[1.4,3.2],[2.4,9.2]],[[36,1.6],[38.6,7.4]],[[-5.4,-1],[-8.2,-.6]]];
function segD(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az;const t=clamp((wx*vx+wz*vz)/(vx*vx+vz*vz),0,1);return Math.hypot(wx-vx*t,wz-vz*t);}
function pathD(x,z){let d=1e9;for(const p of PATHS)for(let i=0;i<p.length-1;i++)d=Math.min(d,segD(x,z,p[i][0],p[i][1],p[i+1][0],p[i+1][1]));return d;}
// hand-painted ground: grass patches, dry grass, beaches, wet sand, limestone trails, pink salt lake
const TPX=16,terrC=mk((TB.x2-TB.x1)*TPX,(TB.z2-TB.z1)*TPX);
(()=>{const W=terrC.width,H=terrC.height,x=terrC.getContext('2d'),img=x.createImageData(W,H),D=img.data;
  const G=[[92,140,66],[116,160,82],[140,181,98],[160,176,92],[183,186,110]];
  for(let j=0;j<H;j++){const z=TB.z1+(j+.5)/TPX;for(let i=0;i<W;i++){const wx=TB.x1+(i+.5)/TPX;const d=landD(wx,z);if(d<=0)continue;
    const r=hash2(i*1.37+.5,j*2.11+.3);const n1=vnoise(wx*.17,z*.17),n2=vnoise(wx*.65+7,z*.65+3);let c;
    const beachW=1.05+.7*vnoise(wx*.3+11,z*.3)+(r-.5)*.35;const zone=wx<49&&((z>9.3+n1*1.2)||(wx>32.3+n1&&z>3.6+n2));
    const le=Math.min(((wx-42.2)/3.5)**2+((z+7.5)/1.6)**2,((wx-66.2)/2.6)**2+((z-2.7)/1.1)**2);const pd=(wx>-14&&wx<98&&z>-11&&z<9)?pathD(wx,z):9;
    if(le<1)c=r>.93?[250,204,216]:(n2>.6?[244,176,194]:[236,156,178]);
    else if(le<1.38+(r-.5)*.12)c=r<.5?[242,236,224]:[226,214,196];
    else if(pd<.82+(r-.5)*.14)c=pd>.62?[196,186,160]:(r<.04?[182,170,143]:(n2>.55?[228,220,200]:[216,206,184]));
    else if(d<beachW||zone){if(d<.42)c=[222,214,196];else{const t=n2+(r-.5)*.3;c=t>.62?[253,251,244]:t<.35?[236,230,216]:[246,242,232];if(Math.sin(z*5.3+n1*7+wx*.4)>.93)c=[232,226,212];if(r>.996)c=[255,255,255];else if(r<.003)c=[198,160,120];}}
    else{let t=n1*.62+n2*.38+(r-.5)*.2;if(d<beachW+.8)t+=.18;c=G[t<.32?0:t<.46?1:t<.6?2:t<.72?3:4];
      if(r>.9966)c=[244,220,90];else if(r>.9956)c=[255,255,255];else if(r>.986)c=[176,206,122];else if(r<.014)c=[78,116,56];}
    const b=1+(vnoise(wx*.05+40,z*.05)-.5)*.14;const k=(j*W+i)*4;D[k]=c[0]*b;D[k+1]=c[1]*b;D[k+2]=c[2]*b;D[k+3]=255;}}
  x.putImageData(img,0,0);})();
// shallow turquoise water, reefs, and surf lines
const WPX=8,waterC2=mk((TB.x2-TB.x1)*WPX,(TB.z2-TB.z1)*WPX),foamC2=mk(waterC2.width,waterC2.height);
(()=>{const W=waterC2.width,H=waterC2.height,a=waterC2.getContext('2d'),b=foamC2.getContext('2d'),A=a.createImageData(W,H),B=b.createImageData(W,H);
  for(let j=0;j<H;j++){const z=TB.z1+(j+.5)/WPX;for(let i=0;i<W;i++){const wx=TB.x1+(i+.5)/WPX;const d=landD(wx,z);const k=(j*W+i)*4;const dist=Math.max(0,-d);
    const t=clamp(dist/5,0,1);let R0=lerp(126,58,t),G0=lerp(228,176,t),B0=lerp(212,204,t);let al=Math.pow(clamp(1-dist/8,0,1),1.3)*.95;
    const reef=vnoise(wx*.55+3,z*.55+9);const basin=Math.hypot(wx-20,z+12.8)<3.4;
    if(dist>.6&&(reef>.7||(basin&&vnoise(wx*1.4,z*1.4)>.52))){R0*=.55;G0*=.78;B0*=.82;al=Math.max(al,.55);}
    if(d>0)al=.95;A.data[k]=R0;A.data[k+1]=G0;A.data[k+2]=B0;A.data[k+3]=al*255;
    const f=d>0?0:Math.exp(-Math.pow((dist-.22)/.16,2))*.95+Math.exp(-Math.pow((dist-1.05)/.14,2))*.4*(.55+.45*Math.sin(wx*1.1+z*.7))+Math.exp(-Math.pow((dist-2.1)/.12,2))*.18;
    B.data[k]=255;B.data[k+1]=255;B.data[k+2]=250;B.data[k+3]=clamp(f,0,1)*255;}}
  a.putImageData(A,0,0);b.putImageData(B,0,0);})();
const water=flat(640,640,new THREE.MeshLambertMaterial({map:ctex(waterC,{rep:[160,160]})}),70,-.15,2);water.receiveShadow=false;
function canvasPlaneTex(c,nearest){const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;if(nearest){t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}else{t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;}return t;}
const TCX=(TB.x1+TB.x2)/2,TCZ=(TB.z1+TB.z2)/2,TWD=TB.x2-TB.x1,THT=TB.z2-TB.z1;
const shore=flat(TWD,THT,new THREE.MeshBasicMaterial({map:canvasPlaneTex(waterC2),transparent:true,depthWrite:false}),TCX,-.12,TCZ);shore.receiveShadow=false;
const foam=flat(TWD,THT,new THREE.MeshBasicMaterial({map:canvasPlaneTex(foamC2),transparent:true,depthWrite:false}),TCX,-.11,TCZ);foam.receiveShadow=false;
const terrain=flat(TWD,THT,new THREE.MeshLambertMaterial({map:canvasPlaneTex(terrC,true),alphaTest:.5}),TCX,0,TCZ);
flat(1.5,4.4,lmat(deckC,[1,3]),35,.04,2.1);
// café
const deckMat=lmat(deckC,[10,8]);
box(DECK.x2-DECK.x1,.16,DECK.z2-DECK.z1,deckMat,0,.08,(DECK.z1+DECK.z2)/2,{noCast:true});
const wallMat=lmat(wallC,[3,1]);
box(10.4,2.8,.3,wallMat,0,1.56,-4.85);col(-5.2,-5,5.2,-4.6);
box(.3,2.8,2.6,wallMat,-5.05,1.56,-3.6);col(-5.2,-5,-4.85,-2.3);
box(.3,2.8,2.6,wallMat,5.05,1.56,-3.6);col(4.85,-5,5.2,-2.3);
const awn=box(11,.18,3,lmat(awnC,[6,1]),0,3.05,-3.55);awn.rotation.x=.22;
const ctr=box(5.4,.9,.7,lmat(counterC,[3,1]),0,.61,-2.55);col(-2.7,-2.9,2.7,-2.2);
box(5.6,.08,.85,new THREE.MeshLambertMaterial({color:0xd8c4a0}),0,1.1,-2.55);
// stations
box(.62,.55,.45,new THREE.MeshLambertMaterial({color:0xc9ced6}),-1.7,1.42,-2.6);
box(.3,.12,.2,new THREE.MeshLambertMaterial({color:0x2b2b30}),-1.7,1.3,-2.3);
const machineLight=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:0xff5a4a}));machineLight.position.set(-1.5,1.6,-2.36);scene.add(machineLight);
const glass=box(.95,.42,.48,new THREE.MeshLambertMaterial({color:0xd8f2ff,transparent:true,opacity:.45}),0,1.35,-2.6,{noCast:true});
box(.3,.2,.3,new THREE.MeshLambertMaterial({color:0x6a3a22}),-.2,1.25,-2.6);box(.3,.2,.3,new THREE.MeshLambertMaterial({color:0x6a3a22}),.22,1.25,-2.6);
box(.3,.14,.3,new THREE.MeshLambertMaterial({color:0x33333a}),1.7,1.21,-2.6);
const jug=new THREE.Mesh(new THREE.CylinderGeometry(.17,.13,.42,10),new THREE.MeshLambertMaterial({color:0xffb02e,transparent:true,opacity:.85}));jug.position.set(1.7,1.49,-2.6);jug.castShadow=true;scene.add(jug);
// shelves + jars
box(4.6,.08,.35,new THREE.MeshLambertMaterial({color:0x8a5a36}),0,2.0,-4.55);
['#f0c040','#e8735a','#86b86e','#f6ead2','#5cc6d8','#c46ad6'].forEach((c,i)=>box(.28,.36,.24,new THREE.MeshLambertMaterial({color:c}),-1.9+i*.76,2.22,-4.55));
// sign
const signC=mk(96,20);
function drawSign(){const x=signC.getContext('2d');x.fillStyle='#2c3b38';x.fillRect(0,0,96,20);x.fillStyle='#e2c27c';x.fillRect(0,0,96,1);x.fillRect(0,19,96,1);x.fillRect(0,0,1,20);x.fillRect(95,0,1,20);x.fillStyle='#f6ecd6';x.font='bold 12px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('QUOKKA CAFE',48,11);}
drawSign();const signTex=ctex(signC);
const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.75),new THREE.MeshLambertMaterial({map:signTex,emissive:0x333333,emissiveMap:signTex}));sign.position.set(0,2.75,-4.68);scene.add(sign);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{drawSign();signTex.needsUpdate=true;});
// string lights
const bulbs=[];for(let i=0;i<11;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.07,6,6),new THREE.MeshBasicMaterial({color:0xffe9a8}));const x=-5+i;b.position.set(x,2.55-Math.sin(i/10*Math.PI)*.18,-2.05);scene.add(b);bulbs.push(b);}
// tables
const TABLES=[[-3.2,.5],[0,1.4],[3.2,.5]];
const tableMat=new THREE.MeshLambertMaterial({color:0xd9b98a});const legMat=new THREE.MeshLambertMaterial({color:0x5a3a22});const seatMat=new THREE.MeshLambertMaterial({color:0x5a3a22});
const SEATS=[];
TABLES.forEach(([x,z])=>{const top=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.08,14),tableMat);top.position.set(x,.92,z);top.castShadow=top.receiveShadow=true;scene.add(top);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.07,.12,.76,8),legMat);leg.position.set(x,.54,z);leg.castShadow=true;scene.add(leg);col(x-.55,z-.55,x+.55,z+.55);
  [-1,1].forEach(s=>{const st=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.42,10),seatMat);st.position.set(x+s*.88,.37,z-.25);st.castShadow=true;scene.add(st);SEATS.push({x:x+s*.88,z:z-.18,busy:false});});});
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
 {x:11,z:-5.6,title:'Wadjemup',lines:['The stone is carved with old marks.','Long before ships came, the Whadjuk Noongar people knew this island as Wadjemup.','Kip: Wadjemup… I like that name. It feels like home already.']},
 {x:21,z:6.4,title:'Rotte nest',lines:['A weathered stone with a Dutch ship scratched into it.','In 1696, Captain Willem de Vlamingh saw the island’s furry locals and took them for giant rats. He named the place “Rotte nest”: rat’s nest.','Kip: Rats?! We’re quokkas. Rude.']},
 {x:41.4,z:-5.2,title:'Pink lakes',lines:['This stone faces the salt lake.','The island’s salt lakes can turn pink, coloured by tiny algae that thrive in very salty water.','Kip: A pink lake… Mum would love this view.']}];
const stoneMat=lmat(stoneC,[1,2]);const runeMat=new THREE.MeshBasicMaterial({color:0x8fe8ff});
const loreSparks=[];
LORE.forEach((L,i)=>{const s=box(.8,1.4,.4,stoneMat,L.x,.7,L.z);s.rotation.y=(R()-.5)*.3;col(L.x-.45,L.z-.25,L.x+.45,L.z+.25);
  const rune=new THREE.Mesh(new THREE.PlaneGeometry(.3,.5),runeMat.clone());rune.position.set(L.x,.85,L.z+.21);scene.add(rune);L.rune=rune;
  const sp=spriteMesh([iconCanvas('spark')],.45,.45,{basic:true,shadow:false});sp.position.set(L.x,1.7,L.z);scene.add(sp);loreSparks.push(sp);});

