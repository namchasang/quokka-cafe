// ---------- Rottnest ground as one 3D surface (Look Lab: ?ground3d until GROUND3D_LIVE is true) ----------
// Paul (13 Nov 2026): the beaches came out with pixel-step edges because the island's grass and sand are flat painted sheets
// (one big one and many small ones for bays and lawns). Here the island ground becomes one 3D surface, the same mesh as the real
// sea's seabed: grass inland, a smooth white beach sloping into the water, the seabed below. The look of the old sheets (paths,
// bike lanes, lawns, lakes) is photographed once from above into one texture and laid on the new surface inland, so nothing moves.
// The beach and everything near the water use the smooth shoreline, so the coast has no steps. Other maps are untouched.
const GROUND3D_LIVE=true;/* Paul approved, 13 Nov 2026 ('เสร็จแล้วขึ้นเกมส์ได้') */
const GROUND3D={on:(GROUND3D_LIVE||/[?&#]ground3d\b/.test(location.search+location.hash))&&TOON_ON,done:false,hidden:[]};
(function(){if(!GROUND3D.on)return;
  function sheets(){/* the flat painted ground pieces of the island: the big ground and the small bay/lawn sheets */
    const out=[],B=new THREE.Box3(),inv=new THREE.Matrix4().copy(scene.matrixWorld).invert();scene.updateMatrixWorld(true);
    scene.traverse(o=>{if(!o.isMesh||o.__g3||!o.geometry||!o.material||Array.isArray(o.material)||!o.material.map||(o.name||'').startsWith('sea'))return;
      if(!(o.material.isMeshLambertMaterial||o.material.isMeshStandardMaterial||o.material.isMeshPhongMaterial))return;
      B.setFromObject(o).applyMatrix4(inv);const w=B.max.x-B.min.x,d=B.max.z-B.min.z;if(w<4||d<4||B.max.y-B.min.y>.03||B.min.y<-.02||B.max.y>.07)return;
      if(B.max.x<TB.x1||B.min.x>TB.x2||B.max.z<TB.z1||B.min.z>TB.z2)return;out.push(o);});return out;}
  function bake(list){/* photograph the sheets from straight above, lit by plain white light only, into a texture in world space */
    const W0=TB.x1,W1=TB.x2,Z0=TB.z1,Z1=TB.z2,PX=8,TW=Math.min(4096,Math.round((W1-W0)*PX)),TH=Math.min(4096,Math.round((Z1-Z0)*PX));
    const rt=new THREE.WebGLRenderTarget(TW,TH,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
    const sx=scene.scale.x,xa=sx<0?-W1:W0,xb=sx<0?-W0:W1;/* world x of the island's two ends (the island is drawn mirrored) */
    const cam=new THREE.OrthographicCamera(xa,xb,-Z0,-Z1,.1,200);cam.up.set(0,0,-1);cam.position.set(0,100,0);cam.lookAt(0,0,0);cam.layers.set(7);cam.updateProjectionMatrix();
    const lights=[];scene.traverse(o=>{if(o.isLight&&o.visible){lights.push(o);o.visible=false;}});const amb=new THREE.AmbientLight(0xffffff,1);scene.add(amb);
    const vis=list.map(o=>o.visible);list.forEach(o=>{o.visible=true;});/* far ground chunks are switched off by the streaming cull: switch them on for the photo */
    const fog=scene.fog;scene.fog=null;list.forEach(o=>o.layers.enable(7));/* unlit copies of each sheet's own picture (the island's toon light setup would bake dark) */const sw=list.map(o=>{const m=o.material,b=new THREE.MeshBasicMaterial({map:m.map,color:m.color,transparent:m.transparent,opacity:m.opacity,alphaTest:m.alphaTest||0,side:m.side,depthWrite:m.depthWrite,polygonOffset:m.polygonOffset,polygonOffsetFactor:m.polygonOffsetFactor,polygonOffsetUnits:m.polygonOffsetUnits});o.material=b;return[o,m,b];});const was=renderer.getRenderTarget(),cc=renderer.getClearColor(new THREE.Color()),ca=renderer.getClearAlpha();
    renderer.setRenderTarget(rt);renderer.setClearColor(0x000000,0);renderer.clear();renderer.render(scene,cam);renderer.setRenderTarget(was);renderer.setClearColor(cc,ca);
    sw.forEach(([o,m,b])=>{o.material=m;b.dispose();});list.forEach((o,i)=>{o.visible=vis[i];});list.forEach(o=>o.layers.disable(7));scene.remove(amb);lights.forEach(o=>{o.visible=true;});scene.fog=fog;
    /* a quick check that the photo came out (a few sample pixels are not all black) */let lit=0;try{const px=new Uint8Array(4);for(let k=1;k<10;k++){renderer.readRenderTargetPixels(rt,Math.round(TW*k/10),Math.round(TH*.5),1,1,px);if(px[3]>128&&px[0]+px[1]+px[2]>30)lit++;}}catch(e){lit=9;}
    if(!lit){rt.dispose();return null;}
    return{tex:rt.texture,box:new THREE.Vector4(xa,Z1,xb-xa,Z1-Z0)};/* uv: u=(x-xa)/w, v=(Z1-z)/(Z1-Z0) */}
  function apply(){const S4=SEA4;if(!S4||!S4.bed||!S4.tS||GROUND3D.done)return false;GROUND3D.done=true;const t0=performance.now();
    const list=sheets();const B=bake(list);if(!B){GROUND3D.done=false;GROUND3D.tries=(GROUND3D.tries||0)+1;console.warn('ground3d: bake came out dark, trying again');return false;}
    // which parts of the seabed mesh are inland ground (old look) and which are beach or sea (smooth new look)
    const mark=(mesh,on)=>{const g=mesh.geometry,P=g.attributes.position,a=new Float32Array(P.count);mesh.updateMatrixWorld(true);const v=new THREE.Vector3(),inv=new THREE.Matrix4().copy(scene.matrixWorld).invert();
      if(on)for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(mesh.matrixWorld).applyMatrix4(inv);const t=S4.tS(v.x,v.z),bw=Math.max(.8,1.05+.7*vnoise(v.x*.3+11,v.z*.3));a[i]=S4.beachMask(v.x,v.z)?0:Math.max(0,Math.min(1,(t-bw-.25)/1.4));/* fades from the smooth beach into the old look over about a unit and a half */
        if(t>0&&!S4.beachMask(v.x,v.z)&&P.getY(i)<0)P.setY(i,-.005);}/* inland ground sits right under where the old sheets were */
      g.setAttribute('landW',new THREE.BufferAttribute(a,1));P.needsUpdate=true;};
    mark(S4.bed,true);if(S4.bed2)mark(S4.bed2,false);
    const m=S4.bed.material,prev=m.onBeforeCompile,pk=m.customProgramCacheKey;const U={tG3:{value:B.tex},uG3:{value:B.box}};
    m.onBeforeCompile=(s,r)=>{if(prev)prev(s,r);Object.assign(s.uniforms,U);
      s.vertexShader='attribute float landW;varying float vLW;varying vec2 vG3;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLW=landW;vG3=(modelMatrix*vec4(transformed,1.)).xz;');
      s.fragmentShader='uniform sampler2D tG3;uniform vec4 uG3;varying float vLW;varying vec2 vG3;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
if(vLW>.001){vec2 uv=vec2((vG3.x-uG3.x)/uG3.z,(uG3.y-vG3.y)/uG3.w);vec4 g3=texture2D(tG3,uv);float k=vLW*(1.-step(.5,g3.a)*step(max(g3.r,g3.g)+.05,g3.b));/* old water pixels in the sheets stay smooth sand */
  /* Paul (13 Nov): the painted paths and bike lanes go (3D ones come later): anything that is not grass or a salt lake becomes grass */
  vec3 c3=g3.rgb;float grassy=step(c3.r+.02,c3.g)*step(c3.b+.02,c3.g);float lake=step(c3.g+.06,c3.r)*step(c3.g,c3.b+.04);
  if(g3.a<.5||lake<.5){/* one even lawn everywhere inland; only the salt lakes keep their picture */float n=.5+.25*(sin(vG3.x*1.7+sin(vG3.y*1.3))+sin(vG3.y*2.1+sin(vG3.x*.9)));float n2=.5+.25*(sin(vG3.x*.31+vG3.y*.17)+sin(vG3.y*.43-vG3.x*.21));
    c3=mix(vec3(.15,.32,.08),vec3(.19,.38,.10),n*.35+n2*.65);}
  diffuseColor.rgb=mix(diffuseColor.rgb,c3,k);}`);};
    m.customProgramCacheKey=()=>'g3d'+(pk?pk.call(m):'');m.needsUpdate=true;
    // the old sheets go away on Rottnest only
    GROUND3D.hidden=list;list.forEach(o=>{o.__g3=1;o.layers.set(31);});
    GROUND3D.ms=Math.round(performance.now()-t0);console.log('GROUND3D sheets '+list.length+' bake '+B.tex.image.width+'x'+B.tex.image.height+' '+GROUND3D.ms+' ms');return true;}
  // bake once the painted look has finished its passes (about 20 s after load) and the sea is up
  (function wait(){if(typeof SEA4!=='undefined'&&SEA4.bed&&SEA4.tS&&performance.now()>22000&&scene.scale.x<0){let ok=false;try{ok=apply();}catch(e){console.error('ground3d',e);return;}if(ok||(GROUND3D.tries||0)>8)return;}setTimeout(wait,1500);})();
  // show the old sheets again away from Rottnest, hide them back on the island
  (function loop(){try{if(GROUND3D.done){if((GROUND3D.sc=(GROUND3D.sc||0)+1)%4===0){/* ground pieces the streaming system builds later */sheets().forEach(o=>{if(!o.__g3){o.__g3=1;GROUND3D.hidden.push(o);}});}const on=scene.scale.x<0&&zoneOf(camTarget.x)==='island';GROUND3D.hidden.forEach(o=>{o.layers.set(on?31:0);});/* layer 31: the main camera never draws it, whatever other systems do with .visible */}}catch(e){}setTimeout(loop,300);})();
})();
// ---------- clear the beach: buildings, signs, lamps and props within 2 units of the water step inland (Paul, 13 Nov 2026) ----------
// Jetties and anything that reaches well out over the water stay. Pieces close together move together; their colliders and the
// Island Loop bus stops move with them. Look Lab ?ground3d only.
GROUND3D.clearBeach=function(){const NEED=2,inv=new THREE.Matrix4().copy(scene.matrixWorld).invert(),B=new THREE.Box3();scene.updateMatrixWorld(true);
  const bb=new Set(typeof BB!=='undefined'?BB:[]),items=[];const ld=(x,z)=>{const t=landD(x,z);return t===-9?-9:t;};
  scene.children.forEach(o=>{if(!o.visible||o.isLight||o.isInstancedMesh||o.__islKeep||o.__g3||bb.has(o)||(o.userData&&o.userData.frames)||/^(sea|bay)/.test(o.name||''))return;
    try{B.setFromObject(o).applyMatrix4(inv);}catch(e){return;}if(B.isEmpty())return;const w=B.max.x-B.min.x,d=B.max.z-B.min.z,h=B.max.y-B.min.y;if(w>14||d>14||h<.05)return;
    const cx=(B.min.x+B.max.x)/2,cz=(B.min.z+B.max.z)/2;if(zoneOf(cx)!=='island')return;const t=ld(cx,cz);if(t<=0||t>=NEED)return;
    const cs=[ld(B.min.x,B.min.z),ld(B.max.x,B.max.z),ld(B.min.x,B.max.z),ld(B.max.x,B.min.z)];if(Math.min(...cs)<-1.5)return;/* a jetty or something meant to sit over the water */
    items.push({o,b:B.clone()});});
  // group pieces that touch (a bench and its legs, a sign and its post)
  const par=items.map((_,i)=>i),f=i=>{while(par[i]!==i)i=par[i]=par[par[i]];return i;};
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i].b,b=items[j].b;if(a.min.x-.5<b.max.x&&b.min.x-.5<a.max.x&&a.min.z-.5<b.max.z&&b.min.z-.5<a.max.z)par[f(j)]=f(i);}
  const G=new Map();items.forEach((it,i)=>{const r=f(i);if(!G.has(r))G.set(r,{m:[],b:new THREE.Box3()});const g=G.get(r);g.m.push(it);g.b.union(it.b);});
  let moved=0,stops=0;G.forEach(g=>{const b=g.b,cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;if(b.max.x-b.min.x>14||b.max.z-b.min.z>14)return;
    const e=.4,gx=ld(cx+e,cz)-ld(cx-e,cz),gz=ld(cx,cz+e)-ld(cx,cz-e),gl=Math.hypot(gx,gz);if(gl<1e-4)return;const ux=gx/gl,uz=gz/gl;
    const minAt=s=>Math.min(ld(b.min.x+ux*s,b.min.z+uz*s),ld(b.max.x+ux*s,b.max.z+uz*s),ld(b.min.x+ux*s,b.max.z+uz*s),ld(b.max.x+ux*s,b.min.z+uz*s),ld(cx+ux*s,cz+uz*s));
    let s=0;while(s<6&&minAt(s)<NEED)s+=.25;if(s<=0||s>=6)return;const dx=ux*s,dz=uz*s;
    g.m.forEach(it=>{it.o.position.x+=dx;it.o.position.z+=dz;});
    if(typeof colliders!=='undefined')colliders.forEach(c=>{if(c.x1>=b.min.x-.3&&c.x2<=b.max.x+.3&&c.z1>=b.min.z-.3&&c.z2<=b.max.z+.3){c.x1+=dx;c.x2+=dx;c.z1+=dz;c.z2+=dz;}});
    if(typeof COACH!=='undefined')COACH.forEach(c=>{if(c.x>b.min.x-1.5&&c.x<b.max.x+1.5&&c.z>b.min.z-1.5&&c.z<b.max.z+1.5){c.x+=dx;c.z+=dz;stops++;}});
    moved++;});
  GROUND3D.moved=moved;GROUND3D.stops=stops;console.log('GROUND3D clear beach: groups moved '+moved+', bus stops '+stops);};
(function w2(){if(GROUND3D.on&&GROUND3D.done&&!GROUND3D.cleared){GROUND3D.cleared=1;try{GROUND3D.clearBeach();}catch(e){console.error('clearBeach',e);}return;}if(GROUND3D.on)setTimeout(w2,1000);})();
