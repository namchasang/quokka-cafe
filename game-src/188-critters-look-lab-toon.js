// ---------- 3D toon butterflies, gulls and cyclists on Rottnest (Look Lab: ?toon until CRIT3_LIVE is true) ----------
// Paul (Nov 2026): the last pixel sprites among the toon look. Each sprite stays where it is (unseen) and a small toon model
// follows it: butterflies flap painted wings in their own colours, gulls glide with grey wings and black tips, cyclists ride a
// real bike with turning wheels and pedalling legs. Heading comes from how each one moves. Off Rottnest the sprites show again.
const CRIT3_LIVE=false;
const CRIT3={on:CRIT3_LIVE||/[?&#]toon\b/.test(location.search+location.hash),list:[]};
(function(){if(!CRIT3.on)return;
  const grad=(()=>{const d=new Uint8Array([110,110,120,255,190,190,196,255,255,255,255,255]);const t=new THREE.DataTexture(d,3,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
  const TM=(c,o)=>new THREE.MeshToonMaterial(Object.assign({color:c,gradientMap:grad},o||{}));
  const mesh=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=true;return o;};
  // ---- butterfly: a dark body and two painted wings that flap ----
  const BPAL=[['#f08a3c','#2a1d1a'],['#f6f2e8','#5a4a3a'],['#7fb8e8','#1d2238'],['#f4d23a','#3a2a10']];
  const wingTex={};function wing(c,e){const k=c+e;if(wingTex[k])return wingTex[k];const cv=mk(64,64),g=cv.getContext('2d');
    const shape=()=>{g.beginPath();g.moveTo(2,32);g.bezierCurveTo(10,2,50,0,60,14);g.bezierCurveTo(62,26,46,32,34,33);g.bezierCurveTo(50,38,56,52,44,60);g.bezierCurveTo(30,64,8,48,2,32);};
    shape();g.fillStyle=e;g.fill();g.save();shape();g.clip();g.fillStyle=c;g.beginPath();g.ellipse(26,22,22,15,-.3,0,6.283);g.fill();g.beginPath();g.ellipse(26,46,13,10,.3,0,6.283);g.fill();
    g.fillStyle='rgba(255,255,255,.75)';[[48,12],[54,20],[42,54]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,2.6,0,6.283);g.fill();});g.restore();
    const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;return wingTex[k]=new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide});}
  function butterfly(p){const g=new THREE.Group(),m=wing(p[0],p[1]);g.add(mesh(new THREE.CylinderGeometry(.018,.012,.16,6).rotateX(Math.PI/2),TM(p[1])));
    const L=new THREE.Group(),R=new THREE.Group();const wg=new THREE.PlaneGeometry(.2,.2);wg.translate(.1,0,0);wg.rotateX(-Math.PI/2);
    L.add(mesh(wg,m));const wr=wg.clone();wr.scale(-1,1,1);R.add(mesh(wr,m));g.add(L,R);g.userData={L,R};return g;}
  // ---- gull ----
  function gull(){const g=new THREE.Group(),W=TM('#f8f8f4'),G=TM('#aab2b8'),K=TM('#26282c'),Y=TM('#f2b632');
    const b=mesh(new THREE.SphereGeometry(.14,12,8),W);b.scale.set(1,.8,2);g.add(b);g.add(mesh(new THREE.SphereGeometry(.09,10,8),W,0,.06,.26));g.add(mesh(new THREE.ConeGeometry(.025,.1,6).rotateX(Math.PI/2),Y,0,.05,.38));
    g.add(mesh(new THREE.ConeGeometry(.08,.18,4).rotateX(-Math.PI/2),G,0,0,-.33));
    const mk2=s=>{const w=new THREE.Group();const p=mesh(new THREE.BoxGeometry(.42,.02,.18),G,s*.24,0,0);const tip=mesh(new THREE.BoxGeometry(.12,.021,.14),K,s*.5,0,-.02);w.add(p,tip);return w;};
    const L=mk2(-1),R=mk2(1);g.add(L,R);g.userData={L,R};return g;}
  // ---- cyclist ----
  const SH=['#e0434f','#3f7ad0','#f2c14e','#3f9a6a','#8a5ad0','#f08a3c'];
  function rider(i){const g=new THREE.Group(),F=TM(['#1d3a6e','#c8344a','#2f6a74','#e8b860'][i%4]),T=TM('#26282c'),S=TM('#f1c7a0'),C=TM(SH[i%SH.length]),P=TM('#3b4a6b');
    const wheels=[];[.42,-.42].forEach(z=>{const w=mesh(new THREE.TorusGeometry(.26,.03,6,18).rotateY(Math.PI/2),T,0,.29,z);g.add(w);wheels.push(w);});
    const tube=(a,b,m)=>{const d=new THREE.Vector3().subVectors(b,a),L=d.length();const c=new THREE.CylinderGeometry(.022,.022,L,6);c.translate(0,L/2,0);c.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));c.translate(a.x,a.y,a.z);return mesh(c,m);};
    const V=(y,z)=>new THREE.Vector3(0,y,z);[[V(.29,.42),V(.62,.3)],[V(.62,.3),V(.62,-.12)],[V(.62,-.12),V(.29,-.42)],[V(.29,-.42),V(.32,0)],[V(.32,0),V(.62,.3)],[V(.32,0),V(.62,-.12)],[V(.62,.3),V(.74,.28)],[V(.62,-.12),V(.68,-.12)]].forEach(([a,b])=>g.add(tube(a,b,F)));
    g.add(mesh(new THREE.BoxGeometry(.3,.025,.05),T,0,.75,.28));g.add(mesh(new THREE.BoxGeometry(.1,.04,.18),T,0,.7,-.13));
    const body=mesh(new THREE.BoxGeometry(.24,.34,.18),C,0,.95,-.02);body.rotation.x=.35;g.add(body);g.add(mesh(new THREE.SphereGeometry(.11,12,10),S,0,1.2,.1));
    const helm=mesh(new THREE.SphereGeometry(.125,12,8,0,6.283,0,1.6),C,0,1.24,.1);g.add(helm);
    [-1,1].forEach(s=>{const a=mesh(new THREE.BoxGeometry(.06,.06,.3),C,s*.1,1.0,.18);a.rotation.x=.6;g.add(a);});
    const legs=[-1,1].map(s=>{const l=new THREE.Group();l.position.set(s*.07,.72,-.1);l.add(mesh(new THREE.BoxGeometry(.08,.36,.08).translate(0,-.18,0),P));g.add(l);return l;});
    g.userData={wheels,legs};return g;}
  // ---- follow the sprites ----
  const mats=m=>{const out=[];const F=m.userData&&m.userData.frames;if(F)F.forEach(f=>{try{const r=mkFrame(f);if(r&&r.m)out.push(r.m);}catch(e){}});if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>out.push(x));return out;};
  const hide=m=>{if(m.__c3h)return;m.__c3h=1;m.__c3s=m.castShadow;m.castShadow=false;mats(m).forEach(x=>{if(!x.__c3){x.__c3=1;x.__vis=x.visible;}x.visible=false;});};
  const show=m=>{if(!m.__c3h)return;m.__c3h=0;m.castShadow=m.__c3s;mats(m).forEach(x=>{if(x.__c3)x.visible=x.__vis!==false;});};
  function track(src,make,kind,i){const e={src,model:make(i),kind,i,lx:null,lz:null,head:0};e.model.visible=false;scene.add(e.model);CRIT3.list.push(e);return e;}
  let built=false;
  function build(){if(built)return;built=true;
    if(typeof butterflies!=='undefined')butterflies.forEach((b,i)=>track(b.m,()=>{const g=butterfly(BPAL[Math.floor(i/2)%BPAL.length]);g.scale.setScalar(1.6);return g;},'b',i));
    if(typeof gulls!=='undefined')gulls.forEach((g,i)=>track(g.m,gull,'g',i));}
  const seen=new Set();
  function tick(){if(!built){if(typeof butterflies==='undefined')return;build();}
    if(typeof riders!=='undefined')riders.forEach((r,i)=>{if(r.m&&!seen.has(r.m)){seen.add(r.m);track(r.m,rider,'r',i);}});
    const t=performance.now()/1000;
    for(let k=CRIT3.list.length-1;k>=0;k--){const e=CRIT3.list[k],s=e.src,M=e.model;
      if(!s.parent){scene.remove(M);CRIT3.list.splice(k,1);continue;}
      const isl=s.visible&&zoneOf(s.position.x)==='island';if(!isl){M.visible=false;show(s);continue;}hide(s);M.visible=true;
      const x=s.position.x,z=s.position.z;if(e.lx!==null){const dx=x-e.lx,dz=z-e.lz;if(dx*dx+dz*dz>1e-6){const h=Math.atan2(dx,dz);let d=h-e.head;d=Math.atan2(Math.sin(d),Math.cos(d));e.head+=d*.2;}}e.lx=x;e.lz=z;
      M.position.set(x,s.position.y,z);M.rotation.y=e.head;
      if(e.kind==='b'){const f=Math.sin(t*22+e.i)*1.1;M.userData.L.rotation.z=f;M.userData.R.rotation.z=-f;M.position.y=s.position.y-.05;}
      else if(e.kind==='g'){const f=Math.sin(t*3+e.i)*.25;M.userData.L.rotation.z=f;M.userData.R.rotation.z=-f;M.rotation.z=Math.sin(t*.7+e.i)*.15;}
      else{M.position.y=0;e.wa=(e.wa||0)+.25;M.userData.wheels.forEach(w=>w.rotation.x=e.wa);M.userData.legs.forEach((l,j)=>l.rotation.x=Math.sin(e.wa+j*Math.PI)*.6);}}}
  (function loop(){try{tick();}catch(err){console.warn('crit3',err);CRIT3.on=false;return;}requestAnimationFrame(loop);})();
})();
