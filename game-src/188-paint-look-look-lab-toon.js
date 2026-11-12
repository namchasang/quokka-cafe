// ---------- Painted look for the whole of Rottnest (Look Lab: ?toon until PAINT_LIVE is true) ----------
// Paul (Nov 2026): the map and every object should match the 3D tree lab, not only the plants and people.
// 1. The island ground is repainted at twice the size: the pixel map is smoothed, then covered in short grass strokes
//    and sand speckles that take their colour from the ground underneath (paths, beaches and lakes keep their shapes).
// 2. Every pixel skin on Rottnest (buildings, props, roads, signs, the café) is drawn smooth instead of in hard pixels.
// Other maps are untouched (materials are copied for the island, never changed in place).
const PAINT_LIVE=false;
const PAINT={on:PAINT_LIVE||/[?&#]toon\b/.test(location.search+location.hash),ground:0,mats:0};
(function(){if(!PAINT.on)return;
  const isl=o=>{try{const v=new THREE.Vector3();o.getWorldPosition(v);scene.worldToLocal(v);if(o.isInstancedMesh&&o.count){const e=o.instanceMatrix.array;v.x=e[12];}return zoneOf(v.x)==='island';}catch(e){return false;}};
  // ---- 1. painted ground ----
  function paintGround(m){const src=m.material.map.image,W=src.width*2,H=src.height*2,cv=mk(W,H),g=cv.getContext('2d');
    g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(src,0,0,W,H);
    const d=g.getImageData(0,0,W,H).data,r=mulberry32(4242),n=Math.round(W*H/22);
    for(let i=0;i<n;i++){const x=r()*W|0,y=r()*H|0,k=(y*W+x)*4;if(d[k+3]<200)continue;const R=d[k],G=d[k+1],B=d[k+2];
      const green=G>R*1.05&&G>B*1.1,sand=R>150&&G>130&&B<R*.85,v=(r()-.5)*.28;
      const c=`rgb(${Math.max(0,Math.min(255,R*(1+v)))|0},${Math.max(0,Math.min(255,G*(1+v)))|0},${Math.max(0,Math.min(255,B*(1+v*.6)))|0})`;
      if(green){g.strokeStyle=c;g.lineWidth=1+r()*1.2;const a=-Math.PI/2+(r()-.5)*1.1,l=3+r()*5;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}
      else if(sand){g.fillStyle=c;g.beginPath();g.arc(x,y,.8+r()*1.4,0,6.2832);g.fill();}}
    const t=new THREE.CanvasTexture(cv);const o=m.material.map;t.encoding=o.encoding;t.wrapS=o.wrapS;t.wrapT=o.wrapT;t.repeat.copy(o.repeat);t.offset.copy(o.offset);t.anisotropy=8;
    const mat=m.material.clone();mat.map=t;if(mat.emissiveMap)mat.emissiveMap=t;m.material=groundMat(mat);PAINT.ground++;}
  // ---- 1b. ground detail in world space: wobbly edges instead of pixel steps, grass strokes, sand speckles, big soft patches ----
  const GROUND_FS=`
    #ifdef USE_MAP
      vec2 wq=vWpG.xz;vec2 jit=(vec2(gvn(wq*1.7),gvn(wq*1.7+19.))-.5)*uJit;
      vec4 texelColor=texture2D(map,vUv+jit);texelColor=mapTexelToLinear(texelColor);vec3 c=texelColor.rgb;
      float gr=smoothstep(.0,.06,c.g-max(c.r,c.b)*.95);
      float st=gvn(vec2(wq.x*7.,wq.y*2.2))*.55+gvn(vec2(wq.x*2.4,wq.y*8.))*.25+gvn(wq*21.)*.2;
      c*=mix(1.,.8+.4*st,gr);
      float sd=(1.-gr)*smoothstep(.35,.6,c.r);c*=mix(1.,.9+.2*gvn(wq*29.),sd);
      c*=.93+.14*gvn(wq*.3);
      diffuseColor*=vec4(c,texelColor.a);
    #endif`;
  const GN='varying vec3 vWpG;uniform float uJit;float gh2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float gvn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(gh2(i),gh2(i+vec2(1.,0.)),f.x),mix(gh2(i+vec2(0.,1.)),gh2(i+1.),f.x),f.y);}\n';
  const gMat=new Map();
  function groundMat(m){if(gMat.has(m))return gMat.get(m);const n=m.clone();for(const k of ['map','emissiveMap'])if(n[k])n[k]=smooth(n[k]);
    const jit={value:n.map&&n.map.image?1.6/n.map.image.width:0};
    n.onBeforeCompile=s=>{s.uniforms.uJit=jit;s.vertexShader='varying vec3 vWpG;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWpG=(modelMatrix*vec4(transformed,1.)).xyz;');
      s.fragmentShader=GN+s.fragmentShader.replace('#include <map_fragment>',GROUND_FS);};n.customProgramCacheKey=()=>'pground';gMat.set(m,n);return n;}
  const flatGround=o=>{if(!o.isMesh||!o.geometry)return false;const m=o.material;if(!m||Array.isArray(m)||!m.map||!(m.isMeshLambertMaterial||m.isMeshStandardMaterial||m.isMeshPhongMaterial))return false;
    if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);const sx=b.max.x-b.min.x,sy=b.max.y-b.min.y,sz=b.max.z-b.min.z;return sy<.25&&b.max.y<.5&&sx*sz>1.5;};
  // ---- 2. smooth skins ----
  const texC=new Map(),matC=new Map();
  const smooth=t=>{if(!t||t.magFilter!==THREE.NearestFilter)return t;if(texC.has(t))return texC.get(t);const n=t.clone();n.image=t.image;n.magFilter=THREE.LinearFilter;n.minFilter=THREE.LinearMipmapLinearFilter;n.generateMipmaps=true;n.anisotropy=4;n.needsUpdate=true;texC.set(t,n);return n;};
  const KEYS=['map','emissiveMap','alphaMap','bumpMap','normalMap','roughnessMap','aoMap'];
  function smoothMat(m){if(matC.has(m))return matC.get(m);let hit=false;for(const k of KEYS)if(m[k]&&m[k].magFilter===THREE.NearestFilter)hit=true;if(!hit){matC.set(m,m);return m;}
    const n=m.clone();for(const k of KEYS)if(n[k])n[k]=smooth(n[k]);if(m.onBeforeCompile)n.onBeforeCompile=m.onBeforeCompile;matC.set(m,n);PAINT.mats++;return n;}
  function pass(){scene.traverse(o=>{if(!(o.isMesh||o.isInstancedMesh)||o.__pt)return;if(o.userData&&o.userData.frames&&o.userData.frames.length>1)return;const m=o.material;if(!m)return;
      if(!isl(o))return;o.__pt=1;
      if(!Array.isArray(m)&&m.map&&m.map.image&&m.map.image.width>=800&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.width>=100&&Math.abs(o.rotation.x+Math.PI/2)<.01&&m.alphaTest>0){try{paintGround(o);}catch(e){console.warn('paint ground',e);}return;}
      if(flatGround(o)){o.material=groundMat(m);return;}
      o.material=Array.isArray(m)?m.map(smoothMat):smoothMat(m);});}
  [0,2500,8000,20000].forEach(t=>setTimeout(()=>{try{pass();}catch(e){console.warn('paint pass',e);}},t));
  setTimeout(()=>{try{console.log('T3D paint ground '+PAINT.ground+' mats '+PAINT.mats);}catch(e){}},21000);
})();
