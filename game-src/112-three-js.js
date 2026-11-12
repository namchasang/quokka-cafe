// ---------- three.js ----------
const cv=$('ow_c'),renderer=new THREE.WebGLRenderer({canvas:cv,antialias:false});renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.physicallyCorrectLights=false;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const PIX=Math.max(.75,1/Math.min(devicePixelRatio||1,2));// Paul (Nov 2026): sharper picture, thin outlines// draw at half resolution, scaled up: chunky pixels
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(46,1,.5,900);
const lin=c=>new THREE.Color(c).convertSRGBToLinear();
const skyC=document.createElement('canvas');skyC.width=4;skyC.height=256;const skyT=new THREE.CanvasTexture(skyC);skyT.encoding=THREE.sRGBEncoding;scene.background=skyT;
scene.fog=new THREE.Fog(0xcfe4ee,90,330);
const hemi=new THREE.HemisphereLight(0xcfe2ff,0x5a4a30,.62);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffe8c8,1.55);sun.shadow.bias=-.0008;sun.shadow.normalBias=.04;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:200});scene.add(sun,sun.target);sun.shadow.camera.layers.enableAll();
// soft grey noise as a detail map (same as the library's terrain): breaks up the ground up close
const DETAIL=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),d=x.createImageData(256,256);for(let j=0;j<256;j++)for(let i=0;i<256;i++){const v=178+90*(.45*fbm(i/20,j/20)+.55*noise(i/2.2,j/2.2));const k=(j*256+i)*4;d.data[k]=d.data[k+1]=d.data[k+2]=Math.max(95,Math.min(255,v));d.data[k+3]=255;}x.putImageData(d,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(120,80);t.anisotropy=4;return t;})();
// terrain mesh with painted vertex colours: grass, sand, red rock on steep faces, scrub on the hills, city ground
{const SX=300,SZ=200,g=new THREE.PlaneGeometry(WX,WZ,SX,SZ);g.rotateX(-Math.PI/2);g.translate(WX/2,0,WZ/2);const pos=g.attributes.position,col=new Float32Array(pos.count*3);const c=new THREE.Color();
  // seven shades per material, dark to light (hand-picked, the way a pixel artist builds a ramp: hue shifts warm in the light)
  const CC={},cc=hx=>CC[hx]||(CC[hx]=lin(hx)),sm=ss,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
  const hash2=(x,z)=>{const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s);};
  const coast=(x,z)=>x<37.5;// ocean beaches on the west; river banks elsewhere
  function groundColor(x,z,h,d,sl,out){const n=fbm(x/14,z/14),big=fbm(x/60+7,z/60),n2=noise(x/3.3,z/3.3),j=hash2(x,z)-.5;
    if(d<0){const dep=-d;out.copy(cc(coast(x,z)?'#e8dcb4':'#c8b888')).lerp(cc('#6ab8b0'),cl(dep/3,0,1)).lerp(cc('#2a6a78'),cl((dep-3)/8,0,1));if(dep<1.2)out.lerp(cc('#f4f4ec'),(1-dep/1.2)*.55*(coast(x,z)?1:.35));out.k=0;return;}
    const city=Math.hypot(x-CBDP[0],z-CBDP[1])<20||Math.hypot(x-FRP[0],z-FRP[1])<12;
    if(city){out.copy(cc('#a8a49a')).lerp(cc('#c4c0b4'),cl(n+.5,0,1)*.6);out.offsetHSL(0,0,j*.04);out.k=1;return;}
    if(d<1.6&&h>.9){out.copy(cc('#9a4a34')).lerp(cc('#c8784a'),cl(n*1.4+.5,0,1)).lerp(cc('#e0a070'),cl(n2,0,1)*.3);out.k=2;return;}// red cliff banks
    const beachW=coast(x,z)?4.5:1.8;
    if(d<beachW){const t=d/beachW;out.copy(cc('#c4ae86')).lerp(cc('#e8dab2'),sm(.05,.4,t)).lerp(cc('#f2e8c8'),sm(.4,.8,t)*.6);if(t>.65&&coast(x,z))out.lerp(cc('#9aa070'),sm(.65,1,t)*cl(n+.6,0,1)*.6);out.offsetHSL(0,0,j*.03);out.k=3;return;}// wet to dry sand, dune grass at the back
    if(elevAt(x,z)>38){const m1=cl(n*1.6+.5,0,1),m2=cl(big*2+.5,0,1);out.copy(cc('#56653d')).lerp(cc('#6a7a52'),m1).lerp(cc('#9c9468'),m2*.32);if(n2>.36)out.lerp(cc('#b0623e'),sm(.36,.5,n2)*.7);if(sl>.3)out.lerp(cc('#a86848'),sm(.3,.7,sl)*.6);out.k=4;return;}// heath and gravel on the hills
    // turf: kikuyu greens, drier straw patches, lush hollows, worn spots
    out.copy(cc('#4a7a30')).lerp(cc('#5e8e3a'),cl(n*1.2+.5,0,1)*.8);out.lerp(cc('#94984e'),sm(.05,.4,big)*.55);out.lerp(cc('#3e6c28'),sm(.1,.4,-big)*.4);
    // red pindan dirt: bare patches and tracks
    const pin=fbm(x/26+3,z/26-5);if(pin>(LOOK2?.33:.22))out.lerp(cc('#b0603a'),sm(.22,.34,pin)*.85).lerp(cc('#c87a4c'),cl(n2+.3,0,1)*sm(.25,.4,pin)*.4);
    if(n2>.38)out.lerp(cc('#8d9b55'),.25);out.offsetHSL(j*.006,0,n2*.02+j*.03);out.k=5;}
  const RAMP=a=>a.map(lin);
  const GR=RAMP(['#2f4a24','#3c5e2c','#4a7232','#5a863a','#6e9a44','#86ae52','#a2c068']),DRY=RAMP(['#4a4a2a','#5e5c32','#76703c','#8c8446','#a29a54','#b8ae66','#cec27c']),
   SAND=RAMP(['#8a7a58','#a08e66','#b8a476','#ccb886','#dcc898','#e8d8aa','#f4e6be']),ROCK=RAMP(['#5a2a22','#74362a','#8e4632','#a8583c','#c06c48','#d4845a','#e4a074']),
   SCRUB=RAMP(['#28382a','#324632','#3e5438','#4a6440','#58744a','#6a8456','#7e9666']),CITY=RAMP(['#5a5a5e','#70706e','#888680','#9e9a92','#b2aea4','#c4c0b6','#d6d2c8']),SEAF=RAMP(['#3a5a5a','#4a6a64','#5a7a6c','#6a8a74','#7a9a7c','#8aaa84','#9aba8c']);
  const SUN=new THREE.Vector3(-.55,.7,.45).normalize();
  for(let k=0;k<pos.count;k++){const x=pos.getX(k),z=pos.getZ(k),h=H(x,z);pos.setY(k,h);
    const sl=Math.hypot(H(x+1,z)-H(x-1,z),H(x,z+1)-H(x,z-1))/2,i=(Math.min(WZ-1,z|0))*WX+Math.min(WX-1,x|0),d=LAND[i]?DL[i]:-DW[i],n=fbm(x*.08,z*.08);
    const gx=H(x+1,z)-H(x-1,z),gz=H(x,z+1)-H(x,z-1),nl=new THREE.Vector3(-gx/2,1,-gz/2).normalize(),lit=Math.max(0,nl.dot(SUN));
    groundColor(x,z,h,d,sl,c);
    col[k*3]=c.r;col[k*3+1]=c.g;col[k*3+2]=c.b;}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,map:DETAIL}));m.userData.L='ground';m.receiveShadow=true;scene.add(m);if(LOOK2)L2paint(m,groundColor);else OWBAKEV(g);}
// water: a big sheet with drifting ripples
const wc=document.createElement('canvas');wc.width=wc.height=64;{const x=wc.getContext('2d');x.fillStyle='#3a8aa0';x.fillRect(0,0,64,64);const WR=['#163e56','#1c4e68','#225e78','#2a6f8a','#3a86a0','#4a98b0','#6ab4c8'];for(let i=0;i<110;i++){x.fillStyle=WR[(i*5)%7];x.fillRect(R()*64|0,R()*64|0,2+R()*6|0,1);}}
const wT=new THREE.CanvasTexture(wc);wT.wrapS=wT.wrapT=THREE.RepeatWrapping;wT.repeat.set(90,60);wT.magFilter=THREE.NearestFilter;wT.encoding=THREE.sRGBEncoding;
const water=new THREE.Mesh(new THREE.PlaneGeometry(1400,1100),new THREE.MeshStandardMaterial({map:wT,transparent:true,opacity:.62,roughness:.12,metalness:.15,depthWrite:false}));water.rotation.x=-Math.PI/2;water.position.set(WX/2,0,WZ/2);water.userData.L='water';scene.add(water);
// road ribbons that follow the ground, bridges with rails over the water
const RIBS=[];/*every road ribbon (mesh, points, width): the road kit re-skins and clips them later*/
const ribbon=(pts,w,mat,yo,deck)=>{const P2=[];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L));for(let k=(i>1?1:0);k<=n;k++)P2.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}
  /*heights first: both edges sampled (no ground through the asphalt), then the grade capped at .22 by raising the low side (no steps)*/const YS=P2.map((p,i)=>{const q=P2[Math.min(P2.length-1,i+1)],o=P2[Math.max(0,i-1)];let dx=q[0]-o[0],dz=q[1]-o[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;return Math.max(deck?deckH(p[0],p[1]):H(p[0],p[1]),H(p[0]+.9,p[1]),H(p[0]-.9,p[1]),H(p[0],p[1]+.9),H(p[0],p[1]-.9),H(p[0]-dz*w/2,p[1]+dx*w/2),H(p[0]+dz*w/2,p[1]-dx*w/2))+yo+.04;});
  for(let i=1;i<YS.length;i++)YS[i]=Math.max(YS[i],YS[i-1]-.22*Math.hypot(P2[i][0]-P2[i-1][0],P2[i][1]-P2[i-1][1]));for(let i=YS.length-2;i>=0;i--)YS[i]=Math.max(YS[i],YS[i+1]-.22*Math.hypot(P2[i][0]-P2[i+1][0],P2[i][1]-P2[i+1][1]));
  /*owroads2: no waves - a long moving average along the road (the deck never drops under the centre line), then the grade cap again*/if(OWR2&&YS.length>4){const B=YS.slice(),K=5;for(let i=0;i<YS.length;i++){let a=0,n=0;for(let j=Math.max(0,i-K);j<=Math.min(YS.length-1,i+K);j++){a+=B[j];n++;}const p=P2[i],fl=(deck?deckH(p[0],p[1]):H(p[0],p[1]))+yo+.06;YS[i]=Math.max(fl,a/n);}
    for(let i=1;i<YS.length;i++)YS[i]=Math.max(YS[i],YS[i-1]-.16*Math.hypot(P2[i][0]-P2[i-1][0],P2[i][1]-P2[i-1][1]));for(let i=YS.length-2;i>=0;i--)YS[i]=Math.max(YS[i],YS[i+1]-.16*Math.hypot(P2[i][0]-P2[i+1][0],P2[i][1]-P2[i+1][1]));}
  const v=[],uv=[],idx=[];let acc=0;P2.forEach((p,i)=>{const q=P2[Math.min(P2.length-1,i+1)],o=P2[Math.max(0,i-1)];let dx=q[0]-o[0],dz=q[1]-o[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;if(i)acc+=Math.hypot(p[0]-P2[i-1][0],p[1]-P2[i-1][1]);
    const y=YS[i];[-1,1].forEach(s=>{v.push(p[0]-dz*w/2*s,y,p[1]+dx*w/2*s);uv.push(s<0?0:1,acc/w);});if(i){const b=(i-1)*2;idx.push(b,b+1,b+2,b+1,b+3,b+2);}});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.L='roads';scene.add(m);RIBS.push({m,pts,w,yo,P2});return P2;};
const tex=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;return t;};
const roadT=tex(16,16,(x)=>{x.fillStyle='#55575c';x.fillRect(0,0,16,16);x.fillStyle='#e8e4d0';x.fillRect(0,0,1,16);x.fillRect(15,0,1,16);x.fillStyle=LOOK2?'#f4f2e8':'#f2d24a';x.fillRect(7,2,2,6);});
const roadM=new THREE.MeshLambertMaterial({map:roadT,side:THREE.DoubleSide});
ROADS.forEach(r=>{ribbon(r.p,4,roadM,.18,true);});
const railT=tex(16,16,(x)=>{x.fillStyle='#8a7a68';x.fillRect(0,0,16,16);x.fillStyle='#5a4030';for(let j=0;j<16;j+=4)x.fillRect(1,j,14,2);x.fillStyle='#3a3e44';x.fillRect(3,0,2,16);x.fillRect(11,0,2,16);});
const RAILP=ribbon(RAIL,2.4,new THREE.MeshLambertMaterial({map:railT}),.12,true);
// bridge rails where roads cross water
ROADS.forEach(r=>{for(let i=1;i<r.p.length;i++){const a=r.p[i-1],b=r.p[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let s=0;s<L;s+=1.6){const x=a[0]+(b[0]-a[0])*s/L,z=a[1]+(b[1]-a[1])*s/L;if(landAt(x,z))continue;const dx=(b[0]-a[0])/L,dz=(b[1]-a[1])/L;
  [-1,1].forEach(sd=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.2,.8,.2),new THREE.MeshLambertMaterial({color:lin('#e8e4d8')}));p.position.set(x-dz*2.1*sd,1.9,z+dx*2.1*sd);scene.add(p);});
  const pl=new THREE.Mesh(new THREE.BoxGeometry(1,1.6,1),new THREE.MeshLambertMaterial({color:lin('#b8b0a0')}));if(((s/1.6)|0)%5===0){pl.position.set(x,.6,z);scene.add(pl);}}}});
// street lamps every so often along the highways; they light up at dusk
const LAMPS=[];{const bulb=new THREE.MeshBasicMaterial({color:0x3a3a30}),haloT=(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,225,160,1)');g.addColorStop(.4,'rgba(255,190,110,.45)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c);})();
  ROADS.forEach(r=>{for(let i=1;i<r.p.length;i++){const a=r.p[i-1],b=r.p[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),dx=(b[0]-a[0])/L,dz=(b[1]-a[1])/L;for(let s2=4;s2<L;s2+=14){const x=a[0]+dx*s2-dz*3,z=a[1]+dz*s2+dx*3;if(!landAt(x,z))continue;const y=H(x,z);
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,3.2,6),new THREE.MeshLambertMaterial({color:0x5a5e64}));pole.position.set(x,y+1.6,z);pole.userData.L='props';scene.add(pole);
    const bl=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),bulb);bl.position.set(x,y+3.3,z);bl.userData.L='lights';scene.add(bl);const h=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));h.position.set(x,y+3.3,z);h.scale.set(3.2,3.2,1);h.userData.L='lights';scene.add(h);LAMPS.push([bl,h]);}}});}
