// ===== Rottnest recipe on the outer world (?ow2&toon, Paul Nov 2026): 3D leaf-card trees near the car =====
// The outer world has many thousands of camera-facing tree pictures. Within OW3T.R of the car each one is swapped for a real
// 3D leaf-card tree (trunk and limbs, painted leaf-clump cards that shade like one soft ball, dappled shadow); further out the
// pictures stay. Tree spots are read from every billboard mesh (the ones with a 'corner' attribute); the kind is guessed from the
// picture's height and width: tall and narrow = pine, low = bush, else gum, peppermint or a round street tree. Instanced per kind.
const OW3T={R:46,R2:150,/* trees about as tall as the houses (Paul, Nov 2026) */n:0,ready:false,pts:null,grid:null,uCam:{value:new THREE.Vector2(1e9,1e9)},uR:{value:150}};
function owTree3dTick(px,pz){if(!OWTOON)return;try{owToonCar();if(!OW3T.ready)owTree3dInit();if(!OW3T.ready)return;OW3T.uCam.value.set(px,pz);
  if(OW3T.lx!==undefined&&Math.hypot(px-OW3T.lx,pz-OW3T.lz)<6)return;OW3T.lx=px;OW3T.lz=pz;
  const R=OW3T.R2,RN=OW3T.R,C=16,i0=Math.floor((px-R)/C),i1=Math.floor((px+R)/C),j0=Math.floor((pz-R)/C),j1=Math.floor((pz+R)/C),cnt=OW3T.T.map(()=>0),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),Y=new THREE.Vector3(0,1,0),P=new THREE.Vector3(),S=new THREE.Vector3();
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const L=OW3T.grid.get(i*100003+j);if(!L)continue;for(const t of L){const dd=Math.hypot(t[0]-px,t[2]-pz);if(dd>R)continue;const ti=t[4]+(dd>RN?5:0),T=OW3T.T[ti];const k=cnt[ti];if(k>=T.cap)continue;
    q.setFromAxisAngle(Y,t[5]);P.set(t[0],t[1],t[2]);S.set(t[3],t[3],t[3]);m4.compose(P,q,S);T.meshes.forEach(m=>m.setMatrixAt(k,m4));cnt[ti]++;}}
  OW3T.T.forEach((T,i)=>T.meshes.forEach(m=>{m.count=cnt[i];m.instanceMatrix.needsUpdate=true;}));OW3T.n=cnt.reduce((a,b)=>a+b,0);}catch(e){console.warn('ow3t',e);OW3T.ready=true;OW3T.T=OW3T.T||[];}}
function owTree3dInit(){if(OW3T.tried)return;OW3T.tried=true;
  // 1. tree spots from every billboard mesh; their materials stop drawing within R of the car
  const pts=[],seen=new Set();scene.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes.corner)return;const L=o.userData&&o.userData.L;if(L&&L!=='plants')return;
    const g=o.geometry,p=g.attributes.position,c=g.attributes.corner,n=Math.min(p.count,(g.drawRange&&isFinite(g.drawRange.count)?g.drawRange.count/6*4:p.count));
    for(let v=0;v+3<n;v+=4){const h=Math.max(c.getY(v+2),c.getY(v+3)),w=Math.abs(c.getX(v+1)-c.getX(v));if(h<1.4)continue;const x=p.getX(v),z=p.getZ(v);const key=Math.round(x*4)+','+Math.round(z*4);if(seen.has(key))continue;seen.add(key);
      const a=w/h,kind=h<2.3?4:(a<.62&&h>3.6)?2:((x*7.3+z*3.1)%3+3)%3<1?1:(((x*1.7+z*5.3)%2+2)%2<1?0:3);pts.push([x,p.getY(v),z,kind===4?Math.min(h,1.4):Math.min(3.3,h*.6),kind,((x*12.9898+z*78.233)%6.283)]);}
    const m=o.material;if(m&&!m.__ow3t){m.__ow3t=1;const ob=m.onBeforeCompile;m.onBeforeCompile=(sh,r)=>{if(ob)ob(sh,r);sh.uniforms.uT3C=OW3T.uCam;sh.uniforms.uT3R=OW3T.uR;
      sh.vertexShader='varying vec2 vT3;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvT3=(modelMatrix*vec4(position,1.)).xz;');
      sh.fragmentShader='uniform vec2 uT3C;uniform float uT3R;varying vec2 vT3;\n'+sh.fragmentShader.replace('void main() {','void main() {\nif(distance(vT3,uT3C)<uT3R-1.5)discard;');};m.needsUpdate=true;}});
  const grid=new Map();pts.forEach(t=>{const k=Math.floor(t[0]/16)*100003+Math.floor(t[2]/16);let L=grid.get(k);if(!L)grid.set(k,L=[]);L.push(t);});OW3T.pts=pts;OW3T.grid=grid;
  // 2. five kinds of 3D tree, built once at height 1 (scaled to each picture's height)
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),UP=V(0,1,0);let sd=7;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;
  const ru=()=>{const u=r()*2-1,a=r()*6.283,s=Math.sqrt(1-u*u);return V(s*Math.cos(a),u,s*Math.sin(a));};
  class B{constructor(){this.p=[];this.n=[];this.u=[];this.i=[];}
    card(c,f,up,w,h,roll,cell,nc,nUp){const z=f.clone().normalize();let x=new THREE.Vector3().crossVectors(up,z);if(x.lengthSq()<1e-5)x.crossVectors(V(1,0,0),z);x.normalize();const y=new THREE.Vector3().crossVectors(z,x);
      const cr=Math.cos(roll),sr=Math.sin(roll),X=x.clone().multiplyScalar(cr).addScaledVector(y,sr),Y=y.clone().multiplyScalar(cr).addScaledVector(x,-sr),u0=(cell%2)*.5,v0=(cell>>1)*.5,b=this.p.length/3;
      for(const q of[[-1,-1,0,0],[1,-1,1,0],[1,1,1,1],[-1,1,0,1]]){const P=c.clone().addScaledVector(X,q[0]*w/2).addScaledVector(Y,q[1]*h/2);this.p.push(P.x,P.y,P.z);const N=P.clone().sub(nc).normalize();N.y+=nUp==null?.12:nUp;N.normalize();this.n.push(N.x,N.y,N.z);this.u.push(u0+q[2]*.5,v0+q[3]*.5);}
      this.i.push(b,b+1,b+2,b,b+2,b+3);}
    limb(a,b2,r1,r2,seg){const d=new THREE.Vector3().subVectors(b2,a),L=d.length();const g=new THREE.CylinderGeometry(r2,r1,L*1.04,seg||6,1,true);g.translate(0,L/2,0);g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(UP,d.normalize())));g.translate(a.x,a.y,a.z);
      const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,b=this.p.length/3;for(let k=0;k<P.count;k++){this.p.push(P.getX(k),P.getY(k),P.getZ(k));this.n.push(N.getX(k),N.getY(k),N.getZ(k));this.u.push(U.getX(k),U.getY(k)*2);}for(let k=0;k<g.index.count;k++)this.i.push(b+g.index.getX(k));g.dispose();}
    geo(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.u,2));g.setIndex(this.i);g.computeBoundingSphere();return g;}}
  const PAL={gum:['#33503f','#46684f','#5f8566','#7fa283','#a5bf9c','#c9d8b4'],pep:['#24482c','#2f5c35','#3f7a40','#5c9a4c','#86b860','#b2d27c'],pine:['#173828','#1f4a33','#2c6040','#3f7a4c','#5f9a5c','#86b86c'],round:['#2a5a2a','#3a7034','#4c8a3e','#62a04a','#84b85c','#a6cc74'],bush:['#35502f','#4a6a3c','#61834a','#7f9e64','#a3b989','#c6d4ae']};
  const leafTex=k=>{const cv=document.createElement('canvas');cv.width=cv.height=256;const g=cv.getContext('2d'),pal=PAL[k];
    for(let c=0;c<4;c++){const ox=(c%2)*128,oy=(c>>1)*128;g.save();g.beginPath();g.rect(ox,oy,128,128);g.clip();g.translate(ox,oy);const L=[];const n=k==='pine'?150:140;
      for(let i=0;i<n;i++){const a=r()*6.283,rr=Math.sqrt(r())*50;L.push([64+Math.cos(a)*rr,64+Math.sin(a)*rr*.92]);}L.sort((a,b)=>b[1]-a[1]);
      for(const[x,y]of L){const t=1-y/128,len=k==='pine'?14:k==='gum'?22:k==='bush'?8:15,wid=k==='pine'?2:4.4,ang=k==='pine'?(r()-.5)*.6+Math.PI/2:r()*6.28;let ci=Math.floor(t*.8*pal.length+(r()-.5)*2.2);ci=Math.max(0,Math.min(pal.length-1,ci));
        g.save();g.translate(x,y);g.rotate(ang);g.beginPath();g.moveTo(0,-len/2);g.quadraticCurveTo(wid,0,0,len/2);g.quadraticCurveTo(-wid,0,0,-len/2);g.fillStyle=pal[ci];g.fill();g.restore();}
      g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(255,248,210,.10)');gr.addColorStop(1,'rgba(6,20,12,.45)');g.fillStyle=gr;g.fillRect(0,0,128,128);g.globalCompositeOperation='source-over';g.restore();}
    const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;};
  const barkTex=(base,dark)=>{const cv=document.createElement('canvas');cv.width=32;cv.height=64;const g=cv.getContext('2d');g.fillStyle=base;g.fillRect(0,0,32,64);for(let i=0;i<60;i++){g.fillStyle=dark;g.fillRect(r()*32,r()*64,1+r()*2,4+r()*10);}const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;};
  const KINDS=[['gum','#d9d0bf','#b9ad99'],['pep','#5d4636','#3e2d22'],['pine','#6b4a33','#4a3222'],['round','#5b4838','#3d2f24'],['bush','#5b4838','#3d2f24']];
  const mk=(k,bc,bd,lite)=>{const L=new B(),K=new B();if(lite){const c0=L.card.bind(L);let nn=0;L.card=(c,f,up,w,h,roll,cell,nc,nUp)=>{if((nn++)%3)return;c0(c,f,up,w*1.55,h*1.55,roll,cell,nc,nUp);};}
    if(k==='pine'){const H=1;K.limb(V(0,0,0),V(0,H,0),.03,.006,6);const tiers=7;for(let t=0;t<tiers;t++){const y=.22+.72*t/(tiers-1),Lr=(H-y)*.36+.05,arms=5,a0=r()*6.28,c0=V(0,y,0),nc=V(0,y-.14,0);
        for(let a=0;a<arms;a++){const an=a0+a/arms*6.283,dir=V(Math.cos(an),-.08,Math.sin(an)).normalize();for(let s=0;s<2;s++){const tt=(s+.6)/2,c=c0.clone().addScaledVector(dir,Lr*tt);c.y-=tt*tt*.03;const sz=.11+Lr*.3;L.card(c,UP.clone().addScaledVector(dir,.2),dir,sz*.9,sz,(r()-.5)*.3,(r()*4)|0,nc,.5);}}}}
    else if(k==='bush'){const nc=V(0,-.3,0);for(let i=0;i<3;i++){const c=V((r()-.5)*.5,.35+r()*.15,(r()-.5)*.5),rad=.3+r()*.15;for(let j=0;j<22;j++){const d=ru();d.y=Math.abs(d.y);d.normalize();const sz=.38+r()*.12;L.card(c.clone().addScaledVector(d,rad*(.4+.6*r())),d,UP,sz,sz,r()*6.28,(r()*4)|0,nc,.6);}}K.limb(V(0,0,0),V(0,.3,0),.03,.02,5);}
    else{const H=1,fork=V(0,k==='gum'?.38:.32,0);K.limb(V(0,0,0),fork,k==='gum'?.05:.045,.035,7);const nc=V(0,k==='round'?.58:.55,0),cl=k==='round'?[[V(0,.62,0),.32]]:[];const limbs=k==='round'?3:4;
      for(let i=0;i<limbs;i++){const a=i/limbs*6.283+r()*.6,rr=k==='pep'?.26:.22,end=V(Math.cos(a)*rr,H*(k==='gum'?.78:.68)+r()*.08,Math.sin(a)*rr);K.limb(fork,end,.028,.01,5);cl.push([end,k==='gum'?.17:.2]);}
      cl.push([V(0,k==='gum'?.86:.78,0),.2]);for(const[c,rad]of cl){const n=k==='round'&&rad>.3?70:30;for(let j=0;j<n;j++){const d=ru();d.y=Math.abs(d.y)*.85-(k==='pep'?.25:.1);d.normalize();const sz=(k==='pep'?.2:.19)+r()*.07;L.card(c.clone().addScaledVector(d,rad*(.45+.55*r())),d,k==='pep'?V(0,-1,0):UP,sz,sz*(k==='pep'?1.3:1.1),(r()-.5)*.6,(r()*4)|0,nc);}}}
    const lt=leafTex(k),lm=new THREE.MeshLambertMaterial({map:lt,alphaTest:.45,side:THREE.DoubleSide,emissive:new THREE.Color(.03,.04,.02)});
    lm.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <lights_lambert_vertex>','#include <lights_lambert_vertex>\n#ifdef DOUBLE_SIDED\nvLightBack=vLightFront;vIndirectBack=vIndirectFront;\n#endif');};lm.customProgramCacheKey=()=>'ow3tleaf';
    const dm=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:lt,alphaTest:.45});const bm=new THREE.MeshLambertMaterial({map:barkTex(bc,bd)});
    const cap=lite?(k==='bush'?2200:1800):(k==='bush'?500:420),meshes=[new THREE.InstancedMesh(L.geo(),lm,cap),new THREE.InstancedMesh(K.geo(),bm,cap)];meshes[0].customDepthMaterial=dm;
    meshes.forEach(m=>{m.count=0;m.castShadow=!lite;m.receiveShadow=true;m.frustumCulled=false;m.userData.L='plants';m.userData.ow3t=1;scene.add(m);});return{k,cap,meshes};};
  // near trees in full, far ones (out to R2) with a third of the leaf cards, a bit bigger; pictures only beyond R2 (Paul: far trees 3D too)
  OW3T.T=KINDS.map(([k,bc,bd])=>mk(k,bc,bd,false)).concat(KINDS.map(([k,bc,bd])=>mk(k,bc,bd,true)));
  OW3T.ready=true;console.log('OW3T trees '+pts.length);}

// Kip drives a toon car (Paul, Nov 2026): the car's boxes get banded toon shading and a dark ink outline, and Kip sits at the wheel
// as the same 3D toon quokka as on Rottnest (he is always in the car out here)
function owToonCar(){if(owToonCar.done)return;owToonCar.done=1;try{
  const gd=(()=>{const d=new Uint8Array([110,110,120,255,190,190,196,255,255,255,255,255]);const t=new THREE.DataTexture(d,3,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
  const ink=new THREE.MeshBasicMaterial({color:'#1d1712',side:THREE.BackSide});const add=[];
  car.traverse(o=>{if(!o.isMesh||!o.material||o.material.isMeshBasicMaterial)return;const c=o.material.color?o.material.color.clone():new THREE.Color(1,1,1);o.material=new THREE.MeshToonMaterial({color:c,gradientMap:gd});
    const k=new THREE.Mesh(o.geometry,ink);k.scale.setScalar(1.025);add.push([o,k]);});add.forEach(([o,k])=>o.add(k));
  if(typeof TOON!=='undefined'&&TOON.quokka){const q=TOON.quokka('#3e7d5c',1.25);q.g.position.set(0,.98,0);q.g.rotation.y=0;q.g.traverse(o=>{if(o.isMesh)o.castShadow=true;});
    const seat=new THREE.Group();seat.add(q.g);car.children[0].parent===car&&car.add(seat);seat.position.set(0,0,-.32);OW3T.kip=q;}
  // an open-top car so Kip shows from the game camera: the cabin box and the roof go, a small windscreen stays
  car.traverse(o=>{if(!o.isMesh||!o.geometry||o.geometry.type!=='BoxGeometry')return;const y=o.position.y;if(y>.55){o.visible=false;}});
  {const ws=new THREE.Mesh(new THREE.BoxGeometry(.04,.2,.56),new THREE.MeshToonMaterial({color:'#bfe0ec',gradientMap:gd,transparent:true,opacity:.55}));ws.position.set(.2,.56,0);const g0=car.children[0];g0.add(ws);}
}catch(e){console.warn('owToonCar',e);}}
