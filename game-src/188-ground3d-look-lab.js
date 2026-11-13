// ---------- Rottnest ground as one 3D surface (Look Lab: ?ground3d until GROUND3D_LIVE is true) ----------
// Paul (13 Nov 2026): the beaches came out with pixel-step edges because the island's grass and sand are flat painted sheets
// (one big one and many small ones for bays and lawns). Here the island ground becomes one 3D surface, the same mesh as the real
// sea's seabed: grass inland, a smooth white beach sloping into the water, the seabed below. The look of the old sheets (paths,
// bike lanes, lawns, lakes) is photographed once from above into one texture and laid on the new surface inland, so nothing moves.
// The beach and everything near the water use the smooth shoreline, so the coast has no steps. Other maps are untouched.
const GROUND3D_LIVE=false;
const GROUND3D={on:(GROUND3D_LIVE||/[?&#]ground3d\b/.test(location.search+location.hash))&&TOON_ON,done:false,hidden:[]};
(function(){if(!GROUND3D.on)return;
  function sheets(){/* the flat painted ground pieces of the island: the big ground and the small bay/lawn sheets */
    const out=[],B=new THREE.Box3(),inv=new THREE.Matrix4().copy(scene.matrixWorld).invert();scene.updateMatrixWorld(true);
    scene.traverse(o=>{if(!o.isMesh||!o.visible||!o.geometry||!o.material||Array.isArray(o.material)||!o.material.map||(o.name||'').startsWith('sea'))return;
      if(!(o.material.isMeshLambertMaterial||o.material.isMeshStandardMaterial||o.material.isMeshPhongMaterial))return;
      B.setFromObject(o).applyMatrix4(inv);const w=B.max.x-B.min.x,d=B.max.z-B.min.z;if(w<4||d<4||B.max.y-B.min.y>.03||B.min.y<-.02||B.max.y>.07)return;
      if(B.max.x<TB.x1||B.min.x>TB.x2||B.max.z<TB.z1||B.min.z>TB.z2)return;out.push(o);});return out;}
  function bake(list){/* photograph the sheets from straight above, lit by plain white light only, into a texture in world space */
    const W0=TB.x1,W1=TB.x2,Z0=TB.z1,Z1=TB.z2,PX=8,TW=Math.min(4096,Math.round((W1-W0)*PX)),TH=Math.min(4096,Math.round((Z1-Z0)*PX));
    const rt=new THREE.WebGLRenderTarget(TW,TH,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
    const sx=scene.scale.x,xa=sx<0?-W1:W0,xb=sx<0?-W0:W1;/* world x of the island's two ends (the island is drawn mirrored) */
    const cam=new THREE.OrthographicCamera(xa,xb,-Z0,-Z1,.1,200);cam.up.set(0,0,-1);cam.position.set(0,100,0);cam.lookAt(0,0,0);cam.layers.set(7);cam.updateProjectionMatrix();
    const lights=[];scene.traverse(o=>{if(o.isLight&&o.visible){lights.push(o);o.visible=false;}});const amb=new THREE.AmbientLight(0xffffff,1);scene.add(amb);
    const fog=scene.fog;scene.fog=null;list.forEach(o=>o.layers.enable(7));/* unlit copies of each sheet's own picture (the island's toon light setup would bake dark) */const sw=list.map(o=>{const m=o.material,b=new THREE.MeshBasicMaterial({map:m.map,color:m.color,transparent:m.transparent,opacity:m.opacity,alphaTest:m.alphaTest||0,side:m.side,depthWrite:m.depthWrite,polygonOffset:m.polygonOffset,polygonOffsetFactor:m.polygonOffsetFactor,polygonOffsetUnits:m.polygonOffsetUnits});o.material=b;return[o,m,b];});const was=renderer.getRenderTarget(),cc=renderer.getClearColor(new THREE.Color()),ca=renderer.getClearAlpha();
    renderer.setRenderTarget(rt);renderer.setClearColor(0x000000,0);renderer.clear();renderer.render(scene,cam);renderer.setRenderTarget(was);renderer.setClearColor(cc,ca);
    sw.forEach(([o,m,b])=>{o.material=m;b.dispose();});list.forEach(o=>o.layers.disable(7));scene.remove(amb);lights.forEach(o=>{o.visible=true;});scene.fog=fog;
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
      s.fragmentShader='uniform sampler2D tG3;uniform vec4 uG3;varying float vLW;varying vec2 vG3;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nif(vLW>.001){vec2 uv=vec2((vG3.x-uG3.x)/uG3.z,(uG3.y-vG3.y)/uG3.w);vec4 g3=texture2D(tG3,uv);float k=vLW*step(.5,g3.a)*(1.-step(max(g3.r,g3.g)+.05,g3.b));/* old water pixels in the sheets stay smooth sand */diffuseColor.rgb=mix(diffuseColor.rgb,g3.rgb,k);}');};
    m.customProgramCacheKey=()=>'g3d'+(pk?pk.call(m):'');m.needsUpdate=true;
    // the old sheets go away on Rottnest only
    GROUND3D.hidden=list;list.forEach(o=>{o.__g3=1;o.visible=false;});
    GROUND3D.ms=Math.round(performance.now()-t0);console.log('GROUND3D sheets '+list.length+' bake '+B.tex.image.width+'x'+B.tex.image.height+' '+GROUND3D.ms+' ms');return true;}
  // bake once the painted look has finished its passes (about 20 s after load) and the sea is up
  (function wait(){if(typeof SEA4!=='undefined'&&SEA4.bed&&SEA4.tS&&performance.now()>22000&&scene.scale.x<0){let ok=false;try{ok=apply();}catch(e){console.error('ground3d',e);return;}if(ok||(GROUND3D.tries||0)>8)return;}setTimeout(wait,1500);})();
  // show the old sheets again away from Rottnest, hide them back on the island
  (function loop(){try{if(GROUND3D.done){const on=scene.scale.x<0&&zoneOf(camTarget.x)==='island';GROUND3D.hidden.forEach(o=>{o.visible=!on;});}}catch(e){}setTimeout(loop,500);})();
})();
