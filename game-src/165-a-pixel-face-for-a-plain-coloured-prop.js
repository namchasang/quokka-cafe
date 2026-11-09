/* a pixel face for a plain-coloured prop: W×H px (32 px per metre, buckets keep the count of textures small) */
function pxFace(col,W,H,top){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const base=new THREE.Color(pxSnapHex(col));
  const sh=f=>`rgb(${Math.min(255,base.r*255*f)|0},${Math.min(255,base.g*255*f)|0},${Math.min(255,base.b*255*f)|0})`;
  x.fillStyle=sh(top?1.06:1);x.fillRect(0,0,W,H);
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){const h=((X*73856093)^(y*19349663))>>>0;if(h%11===0){x.fillStyle=sh(top?1.0:.94);x.fillRect(X,y,1,1);}else if(h%13===0){x.fillStyle=sh(top?1.12:1.06);x.fillRect(X,y,1,1);}}
  if(!top&&H>3){x.fillStyle=sh(1.18);x.fillRect(0,0,W,1);x.fillStyle=sh(.8);x.fillRect(0,H-2,W,1);}
  x.fillStyle=sh(.62);if(W>4&&H>4){x.fillRect(0,H-1,W,1);x.fillRect(0,0,1,H);x.fillRect(W-1,0,1,H);if(top)x.fillRect(0,0,W,1);}
  return c;}
const PXGLASS=new Map();function pxGlassMat(col,w,h){const c=new THREE.Color(col);const tint=c.r*.3+c.g*.59+c.b*.11<.3?'#4a6a86':'#'+c.getHexString();const W=Math.max(16,Math.min(256,Math.round(w*32))),H=Math.max(16,Math.min(160,Math.round(h*32))),k=tint+'|'+W+'|'+H;
  let m=PXGLASS.get(k);if(m)return m;const seed=(W*7+H*3)%97+1;const day=PXK.glass(W,H,{tint,seed}),lit=PXK.glass(W,H,{tint,seed,lit:true});
  m=new THREE.MeshLambertMaterial({map:ctex(day),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(PXK.glowDiff(day,lit))});PXGLASS.set(k,m);PXB_GLOW.push(m);return m;}
const pxGlassy=c=>{const l=c.r*.3+c.g*.59+c.b*.11;return(c.b>c.r+.05&&c.b>=c.g-.02)||l<.28;};
function pxOneLook(only){const V=new THREE.Vector3(),Q=new THREE.Quaternion(),SC=new THREE.Vector3();const bucket=m=>{const px=m*32;return px<12?8:px<24?16:px<48?32:64;};// four sizes only: textures are shared widely (phones)
  const fm=new Map();const big=(col,w,h)=>{{const c=new THREE.Color(col),v=pxSnap(c.r*255|0,c.g*255|0,c.b*255|0,1,.08);col='#'+v.map(n=>n.toString(16).padStart(2,'0')).join('');}
    // big faces (ground slabs, car parks, long walls): a 2 m tile repeated, plain grain without rims, so the pixels stay 32 per metre
    const rx=Math.max(1,Math.round(w/2)),ry=Math.max(1,Math.round(h/2)),k='B|'+col+'|'+rx+'|'+ry;let m=fm.get(k);if(m)return m;
    let base=fm.get('Bt|'+col);if(!base){const c=pxFace(col,64,64,true),x=c.getContext('2d'),cc=new THREE.Color(col);x.fillStyle='#'+cc.getHexString();x.fillRect(0,0,64,1);x.fillRect(0,0,1,64);
      for(let y=0;y<64;y++)for(let X=0;X<64;X++){const hh=((X*73856093)^(y*19349663))>>>0;if(hh%9===0){x.fillStyle='#'+cc.clone().multiplyScalar(hh%2?.95:1.05).getHexString();x.fillRect(X,y,1,1);}}base={c};fm.set('Bt|'+col,base);}
    const t=ctex(base.c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);m=new THREE.MeshLambertMaterial({map:t});fm.set(k,m);return m;};
  const face=(col,w,h,top)=>{if(w>3||h>3)return big(col,w,h);{const c=new THREE.Color(col),v=pxSnap(c.r*255|0,c.g*255|0,c.b*255|0,1,.08);col='#'+v.map(n=>n.toString(16).padStart(2,'0')).join('');}const W=bucket(w),H=bucket(h),k=col+'|'+W+'|'+H+'|'+(top?1:0);let m=fm.get(k);if(!m){m=new THREE.MeshLambertMaterial({map:ctex(pxFace(col,W,H,top))});fm.set(k,m);}return m;};
  let props=0,snapped=0,sharp=0;const done=pxOneLook.done||(pxOneLook.done=new Set());
  (only?f=>only.forEach(f):f=>scene.traverse(f))(o=>{if(!o.isMesh||o.__pxSkip||o.isInstancedMesh||!o.geometry||!o.material||Array.isArray(o.material))return;const m=o.material,t=o.geometry.type,p=o.geometry.parameters||{};
    if(m.map||m.vertexColors||m.transparent||m.isMeshBasicMaterial||m.isShaderMaterial||!(m.isMeshLambertMaterial||m.isMeshStandardMaterial||m.isMeshPhongMaterial))return;
    if(m.emissive&&(m.emissive.r+m.emissive.g+m.emissive.b)>.3)return;// lamps and glowing things keep their glow
    o.matrixWorld.decompose(V,Q,SC);const sx=Math.abs(SC.x),sy=Math.abs(SC.y),sz=Math.abs(SC.z);const col='#'+m.color.getHexString();
    if(t==='BoxGeometry'){const w=p.width*sx,h=p.height*sy,d=p.depth*sz;if(Math.max(w,h,d)>24)return;
      if(h>.5&&Math.min(w,d)<.25&&Math.max(w,d)>.8&&pxGlassy(m.color)){const gm=pxGlassMat(col,Math.max(w,d),h),e=face(col,Math.min(w,d),h);o.material=w>=d?[e,e,e,e,gm,gm]:[gm,gm,e,e,e,e];props++;return;}
      const side=face(col,d,h),top=face(col,w,d,true),front=face(col,w,h);o.material=[side,side,top,top,front,front];props++;}
    else if(t==='CylinderGeometry'||t==='ConeGeometry'){const r=(p.radiusBottom!=null?Math.max(p.radiusTop,p.radiusBottom):p.radius)*Math.max(sx,sz),h=p.height*sy;if(r>12||h>24)return;
      const s=face(col,2*Math.PI*r,h),c=face(col,2*r,2*r,true);o.material=t==='ConeGeometry'?[s,c]:[s,c,c];props++;}
    else if(t==='SphereGeometry'||t==='IcosahedronGeometry'||t==='DodecahedronGeometry'||t==='OctahedronGeometry'||t==='TorusGeometry'){const r=(p.radius||.3)*Math.max(sx,sy,sz);if(r>8)return;o.material=face(col,2*Math.PI*r,Math.PI*r);props++;}});
  // calm the background: every remaining canvas texture (ground, walls, roofs, signs too) leans toward the palette; sprites are left alone so people and plants stay vivid
  const BBset=new Set(typeof BB!=='undefined'?BB:[]);
  scene.traverse(o=>{if(!o.isMesh||BBset.has(o)||!o.material)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{const t=m&&m.map;if(!t||(done.has(t)&&(t.__snapV===t.version||!pxRedrawn(t))))return;done.add(t);const im=t.image;
      if(im&&im.getContext&&!t.__t2&&im.width*im.height<=1100000&&!(typeof SIGN_TEX!=='undefined'&&SIGN_TEX.has(t))){pxSnapCanvas(im);t.needsUpdate=true;snapped++;}
      // sharp at a distance: nearest pixels with mipmaps between levels instead of blur
      if(t.magFilter!==THREE.NearestFilter||t.minFilter===THREE.LinearMipmapLinearFilter||t.minFilter===THREE.LinearFilter){t.magFilter=THREE.NearestFilter;t.minFilter=t.generateMipmaps?THREE.NearestMipmapLinearFilter:THREE.NearestFilter;t.needsUpdate=true;sharp++;}t.__snapV=t.version;});});
  pxOneLook.stats={props,snapped,sharp,faces:fm.size};}
/* people and animals: a touch brighter than the calm background, less so at night */
function pxPopTick(){const now=performance.now();if(pxPopTick.t&&now-pxPopTick.t<900)return;pxPopTick.t=now;if(typeof BB==='undefined')return;const n=typeof NIGHT==='number'?NIGHT:0,k=.13*(1-.75*n);
  for(const o of BB){const F=o.userData&&o.userData.frames;if(!F)continue;for(const f of F){const m=f.m;if(!m||!m.map||!m.emissive||!m.emissive.isColor)continue;if(!m.__pop){m.__pop=1;m.emissive.set(0xffffff);m.emissiveMap=m.map;m.needsUpdate=true;}m.emissiveIntensity=k;}}}

