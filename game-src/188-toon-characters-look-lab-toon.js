// ---------- 3D toon characters (Look Lab layer: ?toon until TOON_LIVE is true; Rottnest only until Paul approves) ----------
// Paul (Nov 2026): characters as cute 3D toon models with anime-style banded shading and a dark ink outline, so they sit in the
// 3D leaf-card world (?toon also turns on the 3D trees). Kip and every quokka are built from quokkaFrames/kipFrames colours,
// people from the humanFrames palette (hair, skin, shirt, pants, hat). Each model follows its sprite: same spot, it turns to
// where it walks and swings arms and legs (quokkas hop). The pixel sprite stays in the scene, unseen, so clicks and story code
// keep working; off Rottnest the sprite shows again. One mesh + one outline per character (limbs bend in the vertex shader).
const TOON_LIVE=false;
const TOON={on:TOON_LIVE||/[?&#]toon\b/.test(location.search+location.hash),list:[]};
(function(){if(!TOON.on)return;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),ZV=V(0,0,0);
  const grad=(()=>{const d=new Uint8Array([88,88,96,255,168,168,172,255,255,255,255,255]);const t=new THREE.DataTexture(d,3,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
  class TB{constructor(){this.p=[];this.n=[];this.c=[];this.a=[];}
    add(g,col,m,piv,w){if(g.index)g=g.toNonIndexed();g.applyMatrix4(m);const P=g.attributes.position,N=g.attributes.normal,C=new THREE.Color(col);
      for(let i=0;i<P.count;i++){this.p.push(P.getX(i),P.getY(i),P.getZ(i));this.n.push(N.getX(i),N.getY(i),N.getZ(i));this.c.push(C.r,C.g,C.b);this.a.push(piv.x,piv.y,piv.z,w||0);}g.dispose();}
    build(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));
      g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));g.setAttribute('aPiv',new THREE.Float32BufferAttribute(this.a,4));g.computeBoundingSphere();return g;}}
  const M=(x,y,z,sx,sy,sz,rx)=>new THREE.Matrix4().compose(V(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,0,0)),V(sx||1,sy||1,sz||1));
  const Sph=(r,a,b,ts,tl)=>new THREE.SphereGeometry(r,a||14,b||10,0,6.2832,ts||0,tl||Math.PI),Cyl=(a,b,h,s,open,t0,tl)=>new THREE.CylinderGeometry(a,b,h,s||10,1,!!open,t0||0,tl||6.2832);
  // the game camera looks down from high up, so faces tilt up a little to stay readable
  const tilt=(m,cy,cz,a)=>new THREE.Matrix4().makeTranslation(0,cy,cz).multiply(new THREE.Matrix4().makeRotationX(a)).multiply(new THREE.Matrix4().makeTranslation(0,-cy,-cz)).multiply(m);
  const hx=c=>'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
  function human(v){const B=new TB(),skin=v.skin||'#f1c7a0',hair=v.hair||'#6b4226',shirt=v.shirt||'#2f6fb0',pants=v.pants||'#2f3b5c';
    for(const s of[-1,1]){const pv=V(s*.07,.3,0);B.add(Cyl(.056,.05,.27,8),pants,M(s*.07,.17,0),pv,s);B.add(Sph(.066,8,6),'#3a2c22',M(s*.07,.04,.03,1,.6,1.5),pv,s);}
    B.add(Cyl(.12,.145,.27,12),shirt,M(0,.43,0),ZV);B.add(Sph(.125,12,6,0,1.6),shirt,M(0,.555,0,1,.45,1),ZV);
    for(const s of[-1,1]){const pv=V(s*.15,.54,0);B.add(Cyl(.043,.038,.22,8),shirt,M(s*.165,.43,0),pv,-s*.8);B.add(Sph(.046,8,6),skin,M(s*.165,.31,0),pv,-s*.8);}
    const Hh=m=>tilt(m,.78,0,-.35);B.add(Cyl(.05,.05,.07,8),skin,M(0,.6,0),ZV);B.add(Sph(.2,16,12),skin,M(0,.78,0),ZV);
    B.add(Sph(.216,16,10,0,1.75),hair,Hh(M(0,.8,-.012,1,1,1,-.45)),ZV);
    for(const s of[-1,1]){B.add(Sph(.04,8,6),'#1d1712',Hh(M(s*.075,.77,.182,.85,1.35,.5)),ZV);B.add(Sph(.015,6,4),'#ffffff',Hh(M(s*.066,.79,.2)),ZV);B.add(Sph(.03,8,6),'#f4a090',Hh(M(s*.118,.72,.166,1.1,.6,.4)),ZV);}
    if(v.hat){B.add(Cyl(.27,.27,.025,16),v.hat,Hh(M(0,.93,0)),ZV);B.add(Cyl(.16,.18,.13,14),v.hat,Hh(M(0,.99,0)),ZV);}
    return{B,top:1};}
  function quokka(t){const tint=t.tint,k=typeof tint==='number'?tint:1;const sh=c=>hx(c.map(x=>x*k));
    const fur=sh([138,100,70]),furD=sh([104,74,52]),furL=sh([200,166,128]),belly=sh([222,196,160]),B=new TB(),H=(m)=>tilt(m,.66,.02,-.42);
    for(const s of[-1,1]){const pv=V(s*.1,.12,0);B.add(Sph(.08,10,8),furD,M(s*.11,.04,.06,1,.55,1.7),pv,s*.6);}
    B.add(Sph(.28,16,12),fur,M(0,.3,0,1,1.05,.92),ZV);B.add(Sph(.2,14,10),belly,M(0,.29,.11,1,1.1,.72),ZV);
    if(t.apron){B.add(Cyl(.292,.305,.22,16,true,-1.05,2.1),t.apron,M(0,.26,0,1,1,.94),ZV);B.add(Cyl(.025,.025,.2,6),t.apron,M(-.11,.45,.17,1,1,1,-.3),ZV);B.add(Cyl(.025,.025,.2,6),t.apron,M(.11,.45,.17,1,1,1,-.3),ZV);}
    for(const s of[-1,1]){const pv=V(s*.2,.44,.05);B.add(Cyl(.046,.04,.15,8),fur,M(s*.22,.37,.09,1,1,1,-.5),pv,-s*.6);}
    B.add(Sph(.25,16,12),fur,H(M(0,.66,.02,1,.92,.95)),ZV);B.add(Sph(.11,12,8),furL,H(M(0,.6,.2,1.15,.75,.85)),ZV);B.add(Sph(.034,8,6),'#2a1a12',H(M(0,.64,.29)),ZV);
    for(const s of[-1,1]){B.add(Sph(.05,10,8),'#1a120c',H(M(s*.095,.72,.205,.85,1.25,.55)),ZV);B.add(Sph(.018,6,4),'#ffffff',H(M(s*.085,.74,.232)),ZV);
      B.add(Sph(.072,10,8),fur,H(M(s*.18,.85,-.03,1,1,.5)),ZV);B.add(Sph(.045,8,6),'#d99a8a',H(M(s*.18,.85,-.002,1,1,.3)),ZV);B.add(Sph(.034,8,6),'#eea0a0',H(M(s*.155,.62,.19,1.1,.6,.4)),ZV);}
    B.add(new THREE.ConeGeometry(.06,.26,8),furD,M(0,.12,-.27,1,1,1,-2.0),ZV);
    return{B,top:.95};}
  // materials: banded toon shading + an ink outline pushed out along the normals; arms/legs turn about their joint
  function inject(mat,u,out){mat.onBeforeCompile=s=>{s.uniforms.uSw=u.uSw;s.uniforms.uOut=out;
    s.vertexShader='attribute vec4 aPiv;\nuniform float uSw;\nuniform float uOut;\n'+s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      if(aPiv.w!=0.0){float a=uSw*aPiv.w,c=cos(a),sn=sin(a);vec3 q=transformed-aPiv.xyz;transformed=aPiv.xyz+vec3(q.x,q.y*c-q.z*sn,q.y*sn+q.z*c);}
      transformed+=normal*uOut;`);};mat.customProgramCacheKey=()=>'toonQ';return mat;}
  const OUT0={value:0};
  function model(info,h){const u={uSw:{value:0}},isQ=info.k==='quokka',R=isQ?quokka(info):human(info.v||{}),geo=R.B.build();
    const body=new THREE.Mesh(geo,inject(new THREE.MeshToonMaterial({vertexColors:true,gradientMap:grad}),u,OUT0));
    const ink=new THREE.Mesh(geo,inject(new THREE.MeshBasicMaterial({color:'#2b1d14',side:THREE.BackSide}),u,{value:.016}));
    body.castShadow=true;body.receiveShadow=true;body.customDepthMaterial=inject(new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking}),u,OUT0);
    const g=new THREE.Group();g.add(body,ink);g.scale.setScalar(h*(isQ?.86:.84)/R.top);return{g,u,isQ};}
  // hide the sprite (materials invisible, so clicks still hit it) and show the model, or the other way round
  const _mkF=mkFrame;mkFrame=function(f){const had=!!f.m;const r=_mkF(f);if(!had&&f.__t3h&&f.m){f.m.visible=false;if(f.d)f.d.visible=false;}return r;};
  function setOn(e,on){e.on=on;(e.src.userData.frames||[]).forEach(f=>{f.__t3h=on;if(f.m)f.m.visible=!on;if(f.d)f.d.visible=!on;});e.g.visible=on;}
  const infoOf=o=>{const F=o.userData&&o.userData.frames;const c=F&&F[0]&&F[0].c;return c&&c.__toon;};
  const keyOf=t=>t.k+'|'+(t.apron||'')+'|'+(t.tint||'')+'|'+(t.v?JSON.stringify(t.v):'');
  const isl=e=>{try{if(e.src===player.mesh)return zoneOf(player.x)==='island';const p=e.src.parent===scene?e.src.position:e.src.getWorldPosition(new THREE.Vector3());return zoneOf(p.x)==='island';}catch(x){return false;}};
  function adopt(o){const t=infoOf(o);if(!t||o.__toon)return;const gp=o.geometry&&o.geometry.parameters;if(!gp)return;
    const m=model(t,gp.height*Math.abs(o.scale.y));const e={src:o,frames:o.userData.frames,key:keyOf(t),g:m.g,u:m.u,q:m.isQ,on:false,px:o.position.x,pz:o.position.z,yaw:0,yawT:0,amp:0,ph:Math.random()*6,zt:0};
    o.__toon=e;TOON.list.push(e);if(o.parent)o.parent.add(e.g);e.g.position.copy(o.position);setOn(e,isl(e));}
  function scan(){(typeof DIR4!=='undefined'?DIR4:[]).forEach(adopt);if(player&&player.mesh)adopt(player.mesh);}
  scan();
  const ad=(a,b)=>{let d=a-b;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d;};
  let last=performance.now(),scanT=0;
  (function TK(){const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;scanT-=dt;if(scanT<=0){scanT=1.5;scan();}
    for(const e of TOON.list){const s=e.src;e.zt-=dt;if(e.zt<=0){e.zt=1;const w=!!s.parent&&isl(e);if(w!==e.on)setOn(e,w);}
      if(s.userData.frames!==e.frames){e.frames=s.userData.frames;const t=infoOf(s);if(t&&keyOf(t)!==e.key){const par=e.g.parent;if(par)par.remove(e.g);const m=model(t,s.geometry.parameters.height*Math.abs(s.scale.y));e.g=m.g;e.u=m.u;e.q=m.isQ;e.key=keyOf(t);}setOn(e,e.on);}
      if(!e.on)continue;if(s.parent&&e.g.parent!==s.parent)s.parent.add(e.g);e.g.visible=s.visible&&!!s.parent&&(s===player.mesh||Math.abs(s.position.x-player.x)+Math.abs(s.position.z-player.z)<60);
      const dx=s.position.x-e.px,dz=s.position.z-e.pz;e.px=s.position.x;e.pz=s.position.z;const sp=Math.hypot(dx,dz)/Math.max(dt,1e-3);
      if(sp>.15&&sp<30){e.yawT=Math.atan2(dx,dz);e.amp=Math.min(1,e.amp+dt*6);}else{e.amp=Math.max(0,e.amp-dt*5);const d=s.userData.dir;if(d===0)e.yawT=0;else if(d===1)e.yawT=Math.PI;}
      e.yaw+=ad(e.yawT,e.yaw)*Math.min(1,dt*10);e.g.rotation.y=e.yaw;e.ph+=dt*(e.q?11:9)*(.5+.5*Math.min(1,sp/2.5));
      const sw=Math.sin(e.ph)*.62*e.amp;e.u.uSw.value=e.q?sw*.6:sw;const k=e.g.scale.x;
      e.g.position.set(s.position.x,s.position.y+Math.abs(Math.sin(e.ph))*(e.q?.09:.025)*e.amp*k,s.position.z);}
    requestAnimationFrame(TK);})();
  TOON.human=(v,h)=>model({k:'human',v},h);// for riders on bikes (188-critters)
  window.__TOON=TOON;
  try{console.log('T3D toon '+TOON.list.length+' on '+TOON.list.filter(e=>e.on).length);}catch(e){}
})();
