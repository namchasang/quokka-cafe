// ---------- Cinematic (Look Lab ?lab or ?cine until CINE_LIVE) ----------
// A miniature-diorama camera: depth of field from the real depth (leaves near the lens melt into soft green,
// the far streets go soft, Kip stays sharp), sun shafts, dappled light under the trees, warm haze in the distance,
// split-tone grade, and pixel branches that frame the shot when Kip walks among trees.
var CINEMA={on:CINE_ON,ready:false,k:0};
function cineInit(){CINEMA.ready=true;
  const mat=new THREE.ShaderMaterial({uniforms:Object.assign({},post.uniforms,{tDepth:{value:rt.depthTexture},near:{value:camera.near},far:{value:camera.far},focusD:{value:14},
      invProj:{value:new THREE.Matrix4()},camW:{value:new THREE.Matrix4()},time:{value:0},sunUv:{value:new THREE.Vector2(-.2,1.3)},tTree:{value:null},tb:{value:new THREE.Vector4(0,0,1,1)},mir:{value:1},cineK:{value:1},night:{value:0}}),
    vertexShader:post.vertexShader,
    fragmentShader:[
    'uniform sampler2D tDiffuse;uniform sampler2D tDepth;uniform sampler2D tTree;uniform vec2 res;uniform vec3 tint;uniform float focus;uniform float px;uniform float fade;uniform float bloomK;uniform float blurK;',
    'uniform float near;uniform float far;uniform float focusD;uniform mat4 invProj;uniform mat4 camW;uniform float time;uniform vec2 sunUv;uniform vec4 tb;uniform float mir;uniform float cineK;uniform float night;varying vec2 vUv;',
    'float vz(vec2 uv){float d=texture2D(tDepth,uv).x;float z=d*2.-1.;return 2.*near*far/(far+near-z*(far-near));}',
    'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}',
    'vec3 disc(vec2 uv,float r){vec3 a=vec3(0.);for(int i=0;i<16;i++){float fi=float(i);float ang=fi*2.39996;float rr=sqrt((fi+.5)/16.)*r;a+=texture2D(tDiffuse,uv+vec2(cos(ang),sin(ang))*rr/res).rgb;}return a/16.;}',
    'void main(){vec3 base=texture2D(tDiffuse,vUv).rgb;vec2 tq=1.5/res;vec3 bl0=(texture2D(tDiffuse,vUv+tq).rgb+texture2D(tDiffuse,vUv-tq).rgb+texture2D(tDiffuse,vUv+vec2(tq.x,-tq.y)).rgb+texture2D(tDiffuse,vUv+vec2(-tq.x,tq.y)).rgb)*.25;base+=(base-bl0)*.3;float d=texture2D(tDepth,vUv).x;float z=vz(vUv);',
    // depth of field: strong in front of the focus (leaves by the lens), gentle behind it, plus a little of the old tilt-shift
    ' float fg=smoothstep(focusD*.12,focusD*.62,focusD-z);float bg=smoothstep(focusD*.22,focusD*1.4,z-focusD);if(d>.99999)bg=1.;',
    ' float tilt=smoothstep(.25,.7,abs(vUv.y-focus))*.35;float b=clamp(max(fg*1.15,max(bg*.8,tilt))*blurK,0.,1.2);',
    ' vec3 col=base;if(b>.02)col=mix(base,disc(vUv,(fg>bg?13.:7.)*b*px),min(1.,b*1.15));',
    // world position from depth: dappled light under the canopy, warm haze far away
    ' vec4 vp=invProj*vec4(vUv*2.-1.,d*2.-1.,1.);vp/=vp.w;vec4 wp=camW*vp;vec2 xz=vec2(wp.x*mir,wp.z);',
    ' if(d<.99999&&wp.y<.45){float tm=texture2D(tTree,(xz-tb.xy)/tb.zw).r;float n=vn(xz*1.15+vec2(time*.18,time*.07))*.65+vn(xz*2.7-vec2(time*.11,0.))*.35;',
    '   float spot=smoothstep(.56,.7,n);float shade=mix(.58,1.18,spot);col*=mix(1.,shade,min(1.,tm*1.3)*cineK*(1.-night));col+=vec3(.14,.1,.02)*spot*min(1.,tm*1.3)*cineK*(1.-night)*.5;}',
    ' float haze=smoothstep(focusD*1.3,focusD*3.2,z)*(d>.99999?.0:1.);col=mix(col,mix(vec3(.96,.84,.66),vec3(.32,.3,.5),night),haze*.14*cineK);',
    // bloom
    ' vec3 wide=disc(vUv,15.*px);col+=max(wide-vec3(.6),0.)*1.15*bloomK;',
    // sun shafts: bright pixels smeared toward the sun
    ' vec2 dl=(sunUv-vUv)/22.;vec2 uv2=vUv;float il=1.,acc=0.;for(int i=0;i<22;i++){uv2+=dl;vec3 s=texture2D(tDiffuse,clamp(uv2,0.,1.)).rgb;float l2=max(dot(s,vec3(.3,.59,.11))-.86,0.);acc+=l2*il;il*=.92;}',
    ' col+=vec3(1.,.8,.48)*acc*.22*cineK*(1.-night);',
    // grade: warm highlights, teal-green shadows, soft contrast, vignette
    ' col*=tint*.97;float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,1.1);col=(col-.5)*1.12+.5;',
    ' col=mix(col*vec3(.86,.98,1.04),col*vec3(1.07,1.,.88),smoothstep(.12,.75,l));',
    ' vec2 q=vUv-.5;col*=1.-dot(q,q)*1.15;col=mix(col,vec3(.05,.06,.12),fade);gl_FragColor=vec4(col,1.);}'].join('\n'),depthTest:false,depthWrite:false});
  CINEMA.mat=mat;CINEMA.old=postScene.children[0].material;
  // where the trees are: a soft canopy map in world units
  const T=BB.filter(m=>m.geometry&&m.geometry.parameters&&m.geometry.parameters.height>2.2);let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;
  T.forEach(m=>{x0=Math.min(x0,m.position.x);x1=Math.max(x1,m.position.x);z0=Math.min(z0,m.position.z);z1=Math.max(z1,m.position.z);});
  if(!T.length){x0=-10;x1=10;z0=-10;z1=10;}x0-=8;x1+=8;z0-=8;z1+=8;const W=Math.min(2048,Math.ceil(x1-x0)),H=Math.min(512,Math.ceil(z1-z0)),sx=W/(x1-x0),sz=H/(z1-z0);
  const A=new Float32Array(W*H);T.forEach(m=>{const r=Math.max(1.6,m.geometry.parameters.width*.55*Math.abs(m.scale.x||1)),cx=(m.position.x-x0)*sx,cz=(m.position.z-z0)*sz;
    for(let j=Math.floor(cz-r*sz);j<=cz+r*sz;j++)for(let i=Math.floor(cx-r*sx);i<=cx+r*sx;i++){if(i<0||j<0||i>=W||j>=H)continue;const dd=Math.hypot((i-cx)/sx,(j-cz)/sz)/r;if(dd<1)A[j*W+i]+=(1-dd*dd)*.9;}});
  const D=new Uint8Array(W*H);for(let i=0;i<W*H;i++)D[i]=Math.min(255,A[i]*255);
  const tt=new THREE.DataTexture(D,W,H,THREE.LuminanceFormat,THREE.UnsignedByteType);tt.magFilter=tt.minFilter=THREE.LinearFilter;tt.needsUpdate=true;
  mat.uniforms.tTree.value=tt;mat.uniforms.tb.value.set(x0,z0,x1-x0,z1-z0);CINEMA.treeAt=(x,z)=>{const i=Math.floor((x-x0)*sx),j=Math.floor((z-z0)*sz);return i<0||j<0||i>=W||j>=H?0:Math.min(1,A[j*W+i]);};
  // pixel branches that hang into the corners of the frame
  const leafCv=(kind)=>{const c=mk(96,64),x=c.getContext('2d');const P=kind?['#24461e','#2e5826','#3a6a2e','#487e36','#5a9240','#6ea64c']:['#2c4a26','#3e5a2a','#4e6e34','#5e823e','#729648','#86aa56'];
    x.strokeStyle='#4a3424';x.lineWidth=3;x.beginPath();x.moveTo(96,6);x.quadraticCurveTo(52,10,6,46);x.stroke();x.lineWidth=2;x.beginPath();x.moveTo(60,12);x.quadraticCurveTo(44,30,40,58);x.stroke();
    let s=kind?77:31;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
    for(let k=0;k<240;k++){const t=rnd();const bx=96-t*90,by=6+t*t*40+(rnd()-.5)*10;const sh=Math.floor(rnd()*P.length);x.fillStyle=P[sh];
      if(kind){x.fillRect(bx|0,by|0,2+(rnd()*3|0),2);}else{x.save();x.translate(bx,by);x.rotate(.6+rnd()*.8);x.fillRect(0,0,7,2);x.restore();}}
    for(let k=0;k<90;k++){const t=rnd();x.fillStyle=P[2+(k%3)];x.fillRect(40+(rnd()-.5)*16|0,14+t*42|0,3,2);}return c;};
  CINEMA.leaves=[0,1,0].map((k,i)=>{const t=new THREE.CanvasTexture(leafCv(k));t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:t,color:new THREE.Color(.78,.86,.7),alphaTest:.5,side:THREE.DoubleSide,fog:false}));m.renderOrder=5;m.frustumCulled=false;scene.add(m);m.userData.slot=i;return m;});
  // a button to compare
  const b=document.createElement('button');b.type='button';b.id='cineBtn';b.textContent='Cinematic: on';b.style.cssText='position:fixed;left:max(10px,env(safe-area-inset-left,0px));bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:60;font:700 13px "Pixelify Sans",monospace;background:rgba(20,26,46,.82);color:#ffd34d;border:2px solid #3a4670;border-radius:8px;padding:7px 10px';
  b.onclick=()=>{CINEMA.on=!CINEMA.on;b.textContent='Cinematic: '+(CINEMA.on?'on':'off');if(!CINEMA.on){postScene.children[0].material=CINEMA.old;CINEMA.leaves.forEach(l=>l.visible=false);}};document.body.appendChild(b);
}
const _cv=new THREE.Vector3(),_cr=new THREE.Vector3(),_cu=new THREE.Vector3(),_cf=new THREE.Vector3();
function cineTick(){if(!rt.depthTexture)return;if(!CINEMA.ready)cineInit();const u=CINEMA.mat.uniforms,p=post.uniforms;
  // Rottnest first: other towns keep the current camera for now
  if(!CINEMA.on||zoneOf(player.x)!=='island'){postScene.children[0].material=CINEMA.old;CINEMA.leaves.forEach(l=>l.visible=false);return;}
  postScene.children[0].material=CINEMA.mat;
  ['tint','focus','px','fade','bloomK','blurK','res'].forEach(k=>{u[k].value=p[k].value;});
  camera.updateMatrixWorld();u.invProj.value.copy(camera.projectionMatrixInverse);u.camW.value.copy(camera.matrixWorld);u.near.value=camera.near;u.far.value=camera.far;u.mir.value=MIR?-1:1;
  u.time.value=performance.now()/1000;
  const tx=MIR?-camTarget.x:camTarget.x;_cv.set(tx,.8,camTarget.z);u.focusD.value=camera.position.distanceTo(_cv);
  // the sun's place on screen (or just off it), for the shafts
  _cv.copy(sun.position).sub(sun.target.position).normalize().multiplyScalar(60).add(camera.position);_cv.project(camera);
  u.sunUv.value.set(Math.max(-.6,Math.min(1.6,(_cv.x+1)/2)),Math.max(-.2,Math.min(1.8,(_cv.y+1)/2)));if(_cv.z>1)u.sunUv.value.set(.1,1.5);
  const tm=typeof S!=='undefined'&&S.time!=null?((S.time%1440)+1440)%1440:720,nt=tm<370||tm>1150?1:0;u.night.value+=(nt-u.night.value)*.05;
  // frame the shot with branches when Kip is under the trees
  const want=Math.min(1,(CINEMA.treeAt(camTarget.x,camTarget.z)+CINEMA.treeAt(camTarget.x+3,camTarget.z+3)+CINEMA.treeAt(camTarget.x-3,camTarget.z+2))*.9);CINEMA.k+=(want-CINEMA.k)*.03;
  _cf.set(0,0,-1).applyQuaternion(camera.quaternion);_cr.set(1,0,0).applyQuaternion(camera.quaternion);_cu.set(0,1,0).applyQuaternion(camera.quaternion);
  const hh=Math.tan(camera.fov*Math.PI/360),ww=hh*camera.aspect,t=u.time.value,D0=3.2;
  const SL=[[-1,1,1.0,.0],[1,1,.9,1.1],[1,-.62,.75,2.3]];
  CINEMA.leaves.forEach((m,i)=>{const [sx,sy,sc,ph]=SL[i];const vis=CINEMA.k>.25;m.visible=vis;if(!vis)return;const out=(1-CINEMA.k)*.6;
    const ex=sx*(ww*D0)*(.62+out)+Math.sin(t*.7+ph)*.05,ey=sy*(hh*D0)*(.66+out)+Math.sin(t*.9+ph)*.04;
    _cv.copy(camera.position).addScaledVector(_cf,D0).addScaledVector(_cr,ex).addScaledVector(_cu,ey);if(MIR)_cv.x=-_cv.x;
    m.position.copy(_cv);m.quaternion.copy(camera.quaternion);if(MIR){m.quaternion.y=-m.quaternion.y;m.quaternion.z=-m.quaternion.z;}
    const s2=hh*D0*sc*1.25;m.scale.set((sx<0?-1:1)*s2*1.5*(MIR?-1:1),s2,1);m.rotation.z+=Math.sin(t*.8+ph)*.02;});
}

if(WORLD.on&&(WORLD3D_LIVE||OW3D_ON)){let OW=null,root=null;
  const close3=()=>{if(OW)OW.close();if(root)root.hidden=true;};
  const ensure=()=>{if(OW)return;const st=document.createElement('style');st.textContent=OW3D_CSS;document.head.appendChild(st);root=document.createElement('div');root.id='owRoot';root.hidden=true;root.innerHTML=OW3D_HTML;document.body.appendChild(root);
    OW=OW3DBuild(root,{look2:OW_LOOK2_LIVE||/[?&#](lab|ow2)\b/.test(location.search+location.hash),enter:(id,side)=>{close3();WORLD.enter(id,side);},back:()=>hideOverlays(),
      carColor:()=>{const c=typeof carSel==='function'&&carSel();return c&&c!=='retro'&&typeof RRR!=='undefined'&&RRR.CARS[c]?RRR.CARS[c].color:null;}});};
  const _h3=hideOverlays;hideOverlays=function(){_h3();close3();};
  window.openWorld=function(from,side){if(transit||VISIT||(overlay&&overlay!=='wm'))return;transit=true;fadeTarget=.95;
    setTimeout(()=>{try{ensure();}catch(e){console.error(e);transit=false;fadeTarget=0;return;}transit=false;fadeTarget=0;overlay='wm';ui.hud.hidden=true;ui.act.hidden=true;root.hidden=false;OW.open(from);},500);};
}
})();
