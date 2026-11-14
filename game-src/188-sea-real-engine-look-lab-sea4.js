// ---------- Rottnest sea with the real Water Sea Engine (live since 13 Nov 2026; was Look Lab ?sea4) ----------
// Paul (13 Nov 2026): "the real engine, 100% like the lab". The island gets a real seabed and sloping beaches (heights from the
// island's own shore grid), the engine's water draws over it with real depth, refraction, breakers on the sand bar, swash that runs
// up the beach and slides back, wet sand that dries, caustics and sand ripples underwater, sun glints and sky reflection.
// While the camera is on Rottnest the old water layers are hidden; other maps keep their water. Quality: SEA4.q (0 = no refraction).
const SEA4_LIVE=true;// Paul approved, 13 Nov 2026 ("สวยถูกใจ เอาขึ้นเกมส์จริงเลย"); ?nosea4 not needed: ?notoon shows the old look
const SEA4={on:(SEA4_LIVE||/[?&#]sea4\b/.test(location.search+location.hash))&&TOON_ON,built:false,L:-.09,q:1};
/* Water Sea Engine (Paul Perth Library, Nov 2026) — clear shallow sea for three.js r128.
   Made for Quokka Cafe (Rottnest), reusable in any game. One call:
     const sea=WaterSea.create({renderer,scene,camera,size:140,heightAt:(x,z)=>groundHeight,ground:groundMaterial,palette});
     each frame: sea.render(time)   // renders the scene twice: once without water (colour+depth), then with it
     sea.setLevel(y)                // raise or lower the sea: beaches flood, wet sand follows
   What it does: colour by real depth (seabed read from the depth buffer), see-through water with refraction,
   caustics + sand ripples + wet sand + backwash foam on the ground material, swash that runs up the beach and slides back,
   breaking waves over sand bars, foam rings round anything at the waterline (boats, rocks, posts), sun glints, sky reflection.
   Palette default = Rottnest (Paul's Thomson Bay / Bathurst photos). Quality: sea.setQuality(0) turns refraction off for old phones. */
(function(g){
const C=h=>new THREE.Color(h).convertSRGBToLinear();
const SR=h=>{const c=C(h);return`vec3(${c.r.toFixed(4)},${c.g.toFixed(4)},${c.b.toFixed(4)})`;};
function create(o){const R=o.renderer,scene=o.scene,cam=o.camera,S=o.size||140,H=o.heightAt;
  const P=Object.assign({shallow:'#5fe3d2',mid:'#20c3c8',deep:'#1593c4',sand:'#f2eedf',foam:'#fbfaf4'},o.palette||{});
  /* the seabed area: o.bounds {x0,z0,w,h} in world units (default: a square of side size round 0,0); outside it the sea is deep */
  const B=o.bounds||{x0:-S/2,z0:-S/2,w:S,h:S},HW=o.heightRes?(o.heightRes.length?o.heightRes[0]:o.heightRes):256,HH=o.heightRes&&o.heightRes.length?o.heightRes[1]:HW,hd=new Uint16Array(HW*HH*4),hf=THREE.DataUtils.toHalfFloat;
  for(let j=0;j<HH;j++)for(let i=0;i<HW;i++){const x=B.x0+(i+.5)/HW*B.w,z=B.z0+(j+.5)/HH*B.h;const k=(j*HW+i)*4;hd[k]=hf(Math.max(-10,Math.min(4,H(x,z))));hd[k+1]=hf(o.maskAt?o.maskAt(x,z):0);/* green: optional mask for the game (e.g. where its own ground opens) */hd[k+3]=hf(1);}
  /* seabed height as a half-float texture: smooth when filtered (two 8-bit bytes give stair steps between texels) */
  const hmT=new THREE.DataTexture(hd,HW,HH,THREE.RGBAFormat,THREE.HalfFloatType);hmT.magFilter=hmT.minFilter=THREE.LinearFilter;hmT.needsUpdate=true;
  const U={uLevel:{value:o.level||0},uT:{value:0},uOn:{value:1},tHM:{value:hmT},uS:{value:S},uHB:{value:new THREE.Vector4(B.x0,B.z0,B.w,B.h)},uRun:{value:o.run==null?1:o.run},uWS:{value:o.wetScale==null?1:o.wetScale}};
  const WAVE=`uniform sampler2D tHM;uniform float uS,uRun;uniform vec4 uHB;
float wh(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float wn(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(wh(vec2(i,1.3)),wh(vec2(i+1.,1.3)),f);}
float bedAt(vec2 xz){vec2 uv=(xz-uHB.xy)/uHB.zw;if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return -6.;return texture2D(tHM,uv).r;}
float runup1(vec2 xz,float t,float per,float off){float p=t/per+off+wn(xz.y*.045+off*3.)*.55;float c=fract(p);float r=c<.28?smoothstep(0.,.28,c):1.-smoothstep(.28,1.,c);return r*(.26+.22*wh(vec2(floor(p),off)));}
float runup(vec2 xz,float t){return max(runup1(xz,t,9.,0.),runup1(xz,t,13.,.37)*.8)*uRun;}`;
  if(o.ground){const gm=o.ground;gm.onBeforeCompile=s=>{Object.assign(s.uniforms,U);s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vW;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvW=(modelMatrix*vec4(transformed,1.)).xyz;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vW;uniform float uLevel,uT,uOn,uWS;
${WAVE}
/* hash without sin: stays smooth far from 0,0 (big game maps) */float hh(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float fbmS(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(hh(i),hh(i+vec2(1,0)),u.x),mix(hh(i+vec2(0,1)),hh(i+vec2(1,1)),u.x),u.y);}
float cz(vec2 p){vec2 i=floor(p),f=fract(p);float m=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y),o=vec2(hh(i+g),hh(i+g+7.3));o=.5+.45*sin(uT*.9+6.28*o);m=min(m,length(g+o-f));}return m;}`)
  .replace('#include <dithering_fragment>',`#include <dithering_fragment>
  float dep=uLevel-vW.y;
  if(uOn>.5){/* the sand stays dark where the last waves reached, drying out over a few seconds */
    float wet=0.;for(int k=0;k<6;k++){float tk=uT-float(k)*.8;float lv=uLevel+runup(vW.xz,tk);wet=max(wet,smoothstep(-.03*uWS,.02*uWS,lv-vW.y)*(1.-float(k)/7.));}
    gl_FragColor.rgb*=mix(1.,.78,wet*step(dep,.05)+smoothstep(-.02*uWS,.1*uWS,dep));
    /* thin foam trails the backwash leaves on the sand */
    float lvn=uLevel+runup(vW.xz,uT);float tr=exp(-pow((lvn-vW.y-.015)/.012,2.))*smoothstep(.45,.75,wn(vW.z*1.3+vW.x*2.+floor(uT/9.)*7.));gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.95),tr*.5*step(dep,.4));}
  if(uOn>.5&&dep>-.25){/* caustics underneath */
    if(dep>0.){float rip=sin(vW.x*3.2+sin(vW.z*.7)*1.6+fbmS(vW.xz*.4)*3.)*.5+.5;gl_FragColor.rgb*=1.-pow(rip,6.)*.16*smoothstep(0.,.3,dep);float c=pow(1.-cz(vW.xz*.55+vec2(uT*.08,uT*.05)),5.)+pow(1.-cz(vW.xz*.9-vec2(uT*.06,0.)),6.)*.6;gl_FragColor.rgb+=vec3(.55,.62,.6)*c*.45*exp(-dep*.35)*smoothstep(0.,.25,dep);}}`);};}
  const rt=new THREE.WebGLRenderTarget(2,2);rt.texture.encoding=THREE.sRGBEncoding;rt.depthTexture=new THREE.DepthTexture();rt.depthTexture.type=THREE.UnsignedIntType;
  const wm=new THREE.ShaderMaterial({transparent:false,uniforms:Object.assign({tCol:{value:rt.texture},tDep:{value:rt.depthTexture},uRes:{value:new THREE.Vector2()},uPI:{value:new THREE.Matrix4()},uCW:{value:new THREE.Matrix4()},uSun:{value:new THREE.Vector3()},uSunC:{value:new THREE.Color()},uCam:{value:new THREE.Vector3()},uNear:{value:.5},uFar:{value:600},uNew:{value:1},uQ:{value:1},uSky:{value:new THREE.Color()}},U),
 vertexShader:`varying vec3 vW;varying float vRun;uniform float uT,uLevel;${WAVE}void main(){vec3 p=position;vec2 wxz=(modelMatrix*vec4(p,1.)).xz;float bed=bedAt(wxz);float d0=uLevel-bed;float near=1.-smoothstep(.8,3.5,d0);float ru=runup(wxz,uT)*near;vRun=ru;float cr=fract(d0*.55+uT*.16+wn(wxz.y*.05)*.4);float crest=exp(-pow((cr-.08)/.06,2.))*smoothstep(.2,.9,d0)*(1.-smoothstep(2.6,3.4,d0));p.y=uLevel+ru+crest*.09+sin(p.x*.25+uT*1.1)*.03*(1.-near)+sin(p.z*.31-uT*.9)*.03*(1.-near);vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`precision highp float;varying vec3 vW;varying float vRun;${WAVE}uniform sampler2D tCol,tDep;uniform vec2 uRes;uniform mat4 uPI,uCW;uniform vec3 uSun,uCam;uniform vec3 uSunC,uSky;uniform float uT,uLevel,uNear,uFar,uNew,uQ;
/* hash without sin: stays smooth far from 0,0 (big game maps) */float hh(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(hh(i),hh(i+vec2(1,0)),u.x),mix(hh(i+vec2(0,1)),hh(i+vec2(1,1)),u.x),u.y);}
/* two turned octaves: foam lace without the square grid of plain value noise */float n2r(vec2 p){return n2(mat2(.8,-.6,.6,.8)*p)*.6+n2(mat2(.36,-.93,.93,.36)*p*1.7+3.1)*.4;}
/* each octave turned a different way so no square grid shows when the camera is close */float waves(vec2 p){vec2 q=mat2(.8,-.6,.6,.8)*p,r=mat2(.36,-.93,.93,.36)*p;return n2(p*.35+vec2(uT*.12,uT*.05))*.5+n2(q*.8-vec2(uT*.2,-uT*.11))*.3+n2(r*2.1+vec2(uT*.35,uT*.27))*.2;}
vec3 wpos(vec2 uv){float d=texture2D(tDep,uv).x;vec4 c=vec4(uv*2.-1.,d*2.-1.,1.);vec4 v=uPI*c;v/=v.w;return(uCW*v).xyz;}
vec3 sRGB(vec3 c){return pow(c,vec3(1./2.2));}
void main(){vec2 uv=gl_FragCoord.xy/uRes;
  float e=.15;float h0=waves(vW.xz),hx=waves(vW.xz+vec2(e,0.)),hz=waves(vW.xz+vec2(0.,e));vec3 nrm=normalize(vec3(-(hx-h0)/e*.55,1.,-(hz-h0)/e*.55));
  float lvl=uLevel+vRun;vec3 bedP=wpos(uv);float depth=max(0.,lvl-bedP.y);float bedH=bedAt(vW.xz);float d0=uLevel-bedH;float viewD=length(bedP-vW);
  vec2 off=nrm.xz*.025*uQ*smoothstep(0.,1.5,depth);vec3 bedP2=wpos(uv+off);if(bedP2.y>lvl)off=vec2(0.);vec3 bed=texture2D(tCol,uv+off).rgb;bed=pow(bed,vec3(2.2));
  float dd=depth*2.4;/* Rottnest palette: same colours as the island's sea, set by real depth */
  vec3 sh=${SR(P.shallow)},mid=${SR(P.mid)},deep=${SR(P.deep)};
  vec3 wc=mix(sh,mid,smoothstep(1.5,5.,dd));wc=mix(wc,deep,smoothstep(7.,14.,dd));
  float clear=exp(-depth*.32-viewD*.012);float wd=clamp(.12+dd*.055,0.,.9);
  vec3 c=uNew>.5?mix(bed*mix(vec3(1.),sh*1.25,.55),wc,wd):mix(${SR(P.sand)},wc,clamp(.25+dd*.07,0.,.95));
  if(uNew<.5){gl_FragColor=vec4(sRGB(c),1.);return;}
  /* light on the surface: sky reflection and sun glints */
  vec3 V=normalize(uCam-vW);float fr=pow(1.-max(dot(V,nrm),0.),4.)*.6;c=mix(c,uSky*.85,fr*smoothstep(0.,1.,depth));
  vec3 Hh=normalize(V+uSun);float sp=pow(max(dot(nrm,Hh),0.),220.)*2.2;c+=uSunC*sp*smoothstep(.0,.6,depth);
  /* foam: lace at the waterline that runs up and back, and rings round rocks, posts and the boat */
  float lace=smoothstep(.3,.66,n2r(vW.xz*1.8+vec2(uT*.25,uT*.1)));float lace2=smoothstep(.42,.74,n2r(vW.xz*4.+vec2(-uT*.4,0.)));
  float edgeD=lvl-bedH;/* the leading edge of each wash, white and frothy */float f1=smoothstep(.2,.0,edgeD)*(.55+.45*lace)+exp(-pow((edgeD-.28)/.06,2.))*lace2*.4;
  /* the thin sheet of a wash is milky with foam lace */float f2=(1.-smoothstep(.0,.25,edgeD))*vRun*2.2*(.35+.65*lace2);
  /* breaking crests: white lines that roll in from the sand bar and fade as they spread */float cr=fract(d0*.55+uT*.16+n2(vec2(vW.z*.05,1.))*.4);
  float brk=exp(-pow((d0-1.3)/.9,2.));/* waves break over the bar and fall apart into foam towards the sand */float broken=smoothstep(.3,.62,n2(vec2(vW.z*.35,d0*1.5)+vec2(0.,uT*.2)));
  float f3=exp(-pow((cr-.1)/.08,2.))*brk*broken*(.55+.45*lace)+exp(-pow((cr-.22)/.12,2.))*brk*lace2*broken*.5;
  /* a soft bubbly band behind the breakers */f3+=smoothstep(1.2,.3,d0)*smoothstep(.0,.3,d0)*lace*lace2*.35;
  float ring=smoothstep(.35,.0,viewD*abs(dot(V,vec3(0,1,0)))-.02)*(1.-smoothstep(1.2,2.5,depth+0.))*lace;
  float objF=0.;if(bedP.y>uLevel-.6&&depth<.6&&viewD<1.2)objF=0.;
  float hullF=(1.-smoothstep(.0,.14,lvl-bedP.y))*step(.5,d0)*(.5+.5*lace2);f3+=hullF;
  c=mix(c,${SR(P.foam)},clamp(f1+f2+f3,0.,.95));
  if(depth<.02)discard;
  gl_FragColor=vec4(sRGB(c),1.);}`});
  const MS=o.meshSize||S,mesh=new THREE.Mesh(new THREE.PlaneGeometry(MS,MS,o.meshSeg||160,o.meshSeg||160).rotateX(-Math.PI/2),wm);if(o.center)mesh.position.set(o.center[0],0,o.center[1]);mesh.frustumCulled=false;(o.parent||scene).add(mesh);
  const size=()=>{const v=R.getDrawingBufferSize(new THREE.Vector2());rt.setSize(v.x,v.y);wm.uniforms.uRes.value.copy(v);};size();
  return{mesh,uniforms:U,material:wm,resize:size,setLevel:y=>{U.uLevel.value=y;},setQuality:q=>{wm.uniforms.uQ.value=q;},
    setSun:(dir,col,sky)=>{wm.uniforms.uSun.value.copy(dir).normalize();wm.uniforms.uSunC.value.copy(col);wm.uniforms.uSky.value.copy(sky);},
    /* pre(t): the first pass only (scene without water into the engine's buffer), for games that draw the final frame themselves */
    pre:t=>{U.uT.value=t;cam.updateMatrixWorld();const v=R.getDrawingBufferSize(new THREE.Vector2());if(v.x!==rt.width||v.y!==rt.height)size();const was=R.getRenderTarget();mesh.visible=false;R.setRenderTarget(rt);R.render(scene,cam);R.setRenderTarget(was);mesh.visible=true;
      wm.uniforms.uPI.value.copy(cam.projectionMatrixInverse);wm.uniforms.uCW.value.copy(cam.matrixWorld);wm.uniforms.uCam.value.setFromMatrixPosition(cam.matrixWorld);wm.uniforms.uNear.value=cam.near;wm.uniforms.uFar.value=cam.far;},
    render(t){this.pre(t);R.render(scene,cam);},bedAt:(x,z)=>H(x,z),dispose:()=>{rt.dispose();hmT.dispose();wm.dispose();mesh.geometry.dispose();}};}
g.WaterSea={create};})(typeof window!=='undefined'?window:this);

(function(){if(!SEA4.on)return;
  const L=SEA4.L;
  const beachW=(x,z)=>Math.max(.8,1.05+.7*vnoise(x*.3+11,z*.3));
  const sandAt=(x,z)=>{try{if(islPD(x,z)<.45)return false;if(ISL_GROUND.length){const g=islGround(x,z);if(g&&g.g.t!=='sand')return false;}}catch(e){}return true;};
  // seabed and beach height in the island's own (unmirrored) coordinates; 0 = the island ground
  // Paul (13 Nov): every shore is a smooth sloping beach like the engine lab (the old coast was pixel steps), shallow enough for
  // boats, clear enough to see their shadows on the sand. Beaches keep their width; other coast gets a narrow sandy edge.
  // Paul (13 Nov): the coast came out in pixel steps (the island's shore grid is coarse). A finer land field, blurred, gives a smooth
  // shoreline; the beach is drawn by the seabed mesh (the flat island ground opens over it, mask in the heightmap's green channel).
  let LS=null;
  /* Rottnest = the Island Builder island (part 188-ibmap): the sea, seabed and beaches follow the new island's shore */
  const landD_=(x,z)=>(window.__IBMAP&&__IBMAP.on&&__IBMAP.landD)?__IBMAP.landD(x,z):landD(x,z);
  function tS(x,z){if(!LS)return landD_(x,z);const u=(x-WX0)/WR,v=(z-WZ0)/WR;if(u<0||v<0||u>=WW-1||v>=WH-1)return landD_(x,z);const i=u|0,j=v|0,a=u-i,b=v-j,k=j*WW+i;return(LS[k]*(1-a)+LS[k+1]*a)*(1-b)+(LS[k+WW]*(1-a)+LS[k+WW+1]*a)*b;}
  function beachMask(x,z){const t=tS(x,z);if(t<-.3||t>3.2)return 0;if(islPD(x,z)<.45)return 0;return t<beachW(x,z)+.25?1:0;}
  function bedL(x,z){const t=tS(x,z);if(t===-9&&!WD)return -6;/* past the island grid it is open water: keep the same gentle slope (no drop-off at the grid edge) */
    if(t>=0&&t!==-9){if(t>2.6)return 0;const bw=beachW(x,z);/* one smooth beach width everywhere: a width that jumped between sand and lawn left a sawtooth shoreline */if(t>=bw)return 0;if(islPD(x,z)<.45)return 0;const u=t/bw;return L*(1-u*u*(3-2*u));}
    const w=WD?wdist(x,z):-t;let h=L-Math.min(w,10)*.15-Math.max(0,w-10)*.05+Math.exp(-Math.pow((w-12)/4,2))*.12+(vnoise(x*.08,z*.08)-.5)*.08*Math.min(1,w/6);h=Math.max(h,L-2.4);/* Paul (13 Nov): the open sea is 2.4 deep at most */
    if(window.__IBMAP&&__IBMAP.on){/* phase 4 (Paul, 14 Nov 2026): a Rottnest-like seabed: reef platforms and sandy lagoons near the island, the Indian Ocean
      side deeper, the far sea down to 6 */const reef=vnoise(x*.05+3,z*.05-7);if(w>3&&w<22&&reef>.62)h+=Math.min(.9,(reef-.62)*3)*Math.min(1,(w-3)/3)*Math.min(1,(22-w)/4);
      const west=Math.min(1,Math.max(0,(x-(TB.x2-60))/120));h-=west*Math.min(1,Math.max(0,(w-6)/14))*1.6;}
    /* ...and deepens to 4 towards each edge of the map (only well away from land) */{const SB=seaBounds(),db=Math.min(x-SB.x1,SB.x2-x,z-SB.z1,SB.z2-z),e=(1-Math.min(1,Math.max(0,(db-4)/36)))*Math.min(1,Math.max(0,(w-12)/14));if(e>0){const k=e*e*(3-2*e);h=Math.min(h,L-2.4-((window.__IBMAP&&__IBMAP.on)?3.6:1.6)*k);}}h=Math.max(h,L-6);/* 6 deep at most */
    return h;}
  // the island grid's water values are not true distances everywhere (inside the Settlement's bays they read hundreds of units),
  // so the seabed uses its own distance-to-shore field: a chamfer distance transform over a fine grid of land/water
  let WD=null,WX0=0,WZ0=0,WR=.35,WW=0,WH=0;
  function wdist(x,z){const u=(x-WX0)/WR,v=(z-WZ0)/WR;if(u<0||v<0||u>=WW-1||v>=WH-1)return 40;const i=u|0,j=v|0,a=u-i,b=v-j,k=j*WW+i;return(WD[k]*(1-a)+WD[k+1]*a)*(1-b)+(WD[k+WW]*(1-a)+WD[k+WW+1]*a)*b;}
  function distField(X1,X2,Z1,Z2){WX0=X1;WZ0=Z1;WW=Math.ceil((X2-X1)/WR)+1;WH=Math.ceil((Z2-Z1)/WR)+1;const D=new Float32Array(WW*WH),BIG=1e6;
    /* the blurred land field: shore grid clamped to +-4, two box blurs of about one unit each way */
    {const A=new Float32Array(WW*WH),T=new Float32Array(WW*WH);for(let j=0;j<WH;j++)for(let i=0;i<WW;i++){let t=landD_(X1+i*WR,Z1+j*WR);if(t===-9)t=-4;A[j*WW+i]=Math.max(-4,Math.min(4,t));}
      const R=3;for(let pass=0;pass<2;pass++){for(let j=0;j<WH;j++){let acc=0,n=0;for(let i=-R;i<=R;i++)if(i>=0&&i<WW){acc+=A[j*WW+i];n++;}for(let i=0;i<WW;i++){T[j*WW+i]=acc/n;const o=i-R,ad=i+R+1;if(o>=0){acc-=A[j*WW+o];n--;}if(ad<WW){acc+=A[j*WW+ad];n++;}}}
        for(let i=0;i<WW;i++){let acc=0,n=0;for(let j=-R;j<=R;j++)if(j>=0&&j<WH){acc+=T[j*WW+i];n++;}for(let j=0;j<WH;j++){A[j*WW+i]=acc/n;const o=j-R,ad=j+R+1;if(o>=0){acc-=T[o*WW+i];n--;}if(ad<WH){acc+=T[ad*WW+i];n++;}}}}
      LS=A;}
    for(let j=0;j<WH;j++)for(let i=0;i<WW;i++){D[j*WW+i]=LS[j*WW+i]>0?0:BIG;}
    const S2=1.4142;for(let j=0;j<WH;j++)for(let i=0;i<WW;i++){const k=j*WW+i;let d=D[k];if(!d)continue;if(i>0)d=Math.min(d,D[k-1]+1);if(j>0){d=Math.min(d,D[k-WW]+1);if(i>0)d=Math.min(d,D[k-WW-1]+S2);if(i<WW-1)d=Math.min(d,D[k-WW+1]+S2);}D[k]=d;}
    for(let j=WH-1;j>=0;j--)for(let i=WW-1;i>=0;i--){const k=j*WW+i;let d=D[k];if(!d)continue;if(i<WW-1)d=Math.min(d,D[k+1]+1);if(j<WH-1){d=Math.min(d,D[k+WW]+1);if(i<WW-1)d=Math.min(d,D[k+WW+1]+S2);if(i>0)d=Math.min(d,D[k+WW-1]+S2);}D[k]=d;}
    for(let k=0;k<D.length;k++)D[k]=Math.min(60,D[k]*WR);WD=D;}
  function build(){SEA4.built=true;const t0=performance.now();
    const M=-1;/* the island is drawn mirrored (scene.scale.x = -1): the engine works in world space */
    const SB=seaBounds(),X1=SB.x1-12,X2=SB.x2+12,Z1=SB.z1-12,Z2=SB.z2+12,IX1=TB.x1-30,IX2=Math.min(TB.x2+30,X2),IZ1=TB.z1-30,IZ2=TB.z2+30;
    distField(X1,X2,Z1,Z2);
    // the seabed mesh (scene space), lab colours: white sand at the beach, pale green-grey sand deeper down
    // seabed meshes (scene space), lab colours: white sand at the beach, pale green-grey sand deeper down. A fine mesh round the
    // island (beaches) and a coarse one for the open sea, a little lower so the fine one wins where they overlap
    const C=h=>new THREE.Color(h).convertSRGBToLinear(),cS=C('#f2eedf'),cW=C('#e2ecdf'),c=new THREE.Color();
    const mkBed=(x1,x2,z1,z2,SP,drop)=>{const NX=Math.round((x2-x1)/SP),NZ=Math.round((z2-z1)/SP),g=new THREE.PlaneGeometry(x2-x1,z2-z1,NX,NZ);g.rotateX(-Math.PI/2);g.translate((x1+x2)/2,0,(z1+z2)/2);
      const P=g.attributes.position,col=new Float32Array(P.count*3);
      for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i),h=bedL(x,z),bm1=drop?0:beachMask(x,z);P.setY(i,(h>-.02?-.02:h)-drop);/* one flat level under all land: a step at the beach mask edge showed as a sawtooth wall */c.copy(cS).lerp(cW,Math.max(0,Math.min(1,(L-h+.2)/4)));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
      g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();return g;};
    const gIn=mkBed(IX1,IX2,IZ1,IZ2,.7,0),gOut=mkBed(X1,X2,Z1,Z2,2.4,.05),P={count:gIn.attributes.position.count+gOut.attributes.position.count};
    const bm=new THREE.MeshLambertMaterial({vertexColors:true});const bed=new THREE.Mesh(gIn,bm);bed.receiveShadow=true;bed.name='sea4bed';scene.add(bed);const bed2=new THREE.Mesh(gOut,bm);bed2.receiveShadow=true;bed2.name='sea4bed2';bed.add(bed2);bed2.position.set(0,0,0);
    // the engine: heightmap over the island in world space, water mesh big enough to reach the horizon
    const B={x0:M<0?-X2:X1,z0:Z1,w:X2-X1,h:Z2-Z1};
    const sea=WaterSea.create({renderer,scene,camera,heightAt:(xw,z)=>bedL(M<0?-xw:xw,z),maskAt:(xw,z)=>beachMask(M<0?-xw:xw,z),bounds:B,heightRes:[1280,Math.round(1280*(Z2-Z1)/(X2-X1))],ground:bm,level:L,run:.2,wetScale:.3,size:B.w,meshSize:260,meshSeg:(()=>{/* speed (Paul, 14 Nov 2026: laggy on the phone): the sea surface mesh follows Graphics (Low 160, Medium 240, High 360) */let q='high';try{q=localStorage.getItem('qc-gfx')||(matchMedia&&matchMedia('(pointer:coarse)').matches?'medium':'high');}catch(e){}return q==='low'?160:q==='medium'?240:360;})(),center:[0,0]});
    sea.mesh.name='sea4water';sea.mesh.__islKeep=1;bed.__islKeep=1;
    // the flat island ground opens over the lowered beach so the sloping sand shows through
    const PATCHED=[];const patchGround=tm=>{if(!tm||(tm.__s4&&tm.onBeforeCompile===tm.__s4f))return;if(!tm.__s4)PATCHED.push(tm);tm.__s4=1;const prev=tm.onBeforeCompile,pk=tm.customProgramCacheKey;
      tm.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);sh.uniforms.tHM4=sea.uniforms.tHM;sh.uniforms.uHB4=sea.uniforms.uHB;
        /* written to survive other layers that rewrite the ground's shader text: declarations go first, the hooks go into main() by pattern */
        const MAIN=/void\s+main\s*\(\s*(void)?\s*\)\s*\{/;
        sh.vertexShader='varying vec2 vS4;\n'+sh.vertexShader.replace(MAIN,m=>m+'\nvS4=(modelMatrix*vec4(position,1.)).xz;');
        sh.fragmentShader='varying vec2 vS4;uniform sampler2D tHM4;uniform vec4 uHB4;\n'+sh.fragmentShader.replace(MAIN,m=>m+'\n{vec2 uv=(vS4-uHB4.xy)/uHB4.zw;if(uv.x>0.&&uv.y>0.&&uv.x<1.&&uv.y<1.){vec4 hm=texture2D(tHM4,uv);if(hm.r<-.02||hm.g>.5)discard;}}');};
      tm.customProgramCacheKey=()=>'sea4t'+(pk&&pk!==tm.customProgramCacheKey?pk.call(tm):'');tm.__s4f=tm.onBeforeCompile;tm.needsUpdate=true;};const PMESH=[terrain];SEA4.repatch=()=>{PMESH.forEach(m=>patchGround(m.material));};/* other look layers swap the ground's material later: put the beach opening back on whatever it wears now */setInterval(()=>{try{SEA4.repatch();}catch(e){}},1000);patchGround(terrain.material);
    // the island also has ground patches of its own (bays, lawns) drawn as flat textured planes over the ground, and old water
    // patches under them: the ground patches open over the beach the same way, the old water patches hide on Rottnest
    const extraOld=[];const scanGround=()=>{const Bx=new THREE.Box3(),inv=new THREE.Matrix4().copy(scene.matrixWorld).invert();scene.updateMatrixWorld(true);
      scene.traverse(o=>{if(!o.isMesh||o.__s4seen||o===terrain||!o.geometry||o.geometry.type!=='PlaneGeometry'||!o.material||Array.isArray(o.material)||o.name.startsWith('sea'))return;
        Bx.setFromObject(o).applyMatrix4(inv);const w=Bx.max.x-Bx.min.x,d=Bx.max.z-Bx.min.z;if(w<6||d<6||Bx.max.y-Bx.min.y>.02||Bx.min.x>TB.x2||Bx.max.x<TB.x1)return;
        o.__s4seen=1;if(Bx.max.y<-.02&&o.material.map){extraOld.push(o);o.visible=false;return;}if(Bx.min.y>-.01&&Bx.max.y<.06&&o.material.map&&(o.material.isMeshLambertMaterial||o.material.isMeshStandardMaterial)){patchGround(o.material);PMESH.push(o);}});};scanGround();
    /* bays and lawns are built later than the sea: look for new ground pieces for the first two minutes */{let n=0;const iv=setInterval(()=>{try{scanGround();}catch(e){}if(++n>40)clearInterval(iv);},3000);}
    SEA4.extraOld=extraOld;
    SEA4.sea=sea;SEA4.bed=bed;SEA4.tS=tS;SEA4.beachMask=beachMask;SEA4.bed2=bed2;try{if(typeof PAINT!=='undefined'&&PAINT.refresh)PAINT.refresh();}catch(e){}SEA4.bedL=bedL;SEA4.ms=Math.round(performance.now()-t0);
    const OLD=()=>[typeof water!=='undefined'?water:null,typeof sparkWater!=='undefined'?sparkWater:null,typeof shore!=='undefined'?shore:null,typeof foam!=='undefined'?foam:null,typeof waves!=='undefined'?waves:null,SEA3.sea,scene.getObjectByName('sea3band')].concat(SEA4.extraOld||[]).filter(Boolean);
    let st=null;const sd=new THREE.Vector3(),sc=new THREE.Color(),sk=new THREE.Color();
    SEA4.pre=()=>{const on=scene.scale.x<0&&zoneOf(camTarget.x)==='island';
      if(on!==st){st=on;OLD().forEach(o=>{if(on){o.__s4=o.visible;o.visible=false;}else if(o.__s4!==undefined)o.visible=o.__s4;});sea.mesh.visible=bed.visible=on;}
      if(!on)return;OLD().forEach(o=>{o.visible=false;});
      
      sd.copy(sun.position).sub(sun.target.position);sd.x*=scene.scale.x;sc.copy(sun.color).multiplyScalar(sun.intensity);sk.copy(hemi.color).multiplyScalar(hemi.intensity);sea.setSun(sd,sc,sk);sea.setQuality(SEA4.q);
      /* camTarget is in scene (local) space, like the mesh */
      /* the dense water mesh follows the camera in steps of one cell, so the waves stay fine everywhere without swimming */const stp=260/360;sea.mesh.position.set(Math.round(camTarget.x/stp)*stp,0,Math.round(camTarget.z/stp)*stp);
      sea.pre(performance.now()/1000);};
    console.log('SEA4 built '+SEA4.ms+' ms, bed verts '+P.count);}
  const wait=()=>{if(window.__IBMAP!==undefined/* the island map's coast is ready (part 188-ibmap) */&&typeof ISL!=='undefined'&&ISL.done&&typeof Dg!=='undefined'&&typeof terrain!=='undefined'&&typeof SEA3!=='undefined'&&(SEA3.built||!SEA3.on)){try{build();}catch(e){console.error('sea4',e);SEA4.pre=null;}return;}setTimeout(wait,400);};wait();
})();
