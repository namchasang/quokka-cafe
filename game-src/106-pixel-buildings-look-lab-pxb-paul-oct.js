// ---------- Pixel buildings (Look Lab ?pxb, Paul Oct 2026): 3d shapes keep their size, walls/roofs/windows/doors get pixel skins from PXKIT ----------
// Runs once after the world is built. Only Rottnest for now (Thomson Bay first). Walls without panes get windows painted in;
// walls with panes keep them, and the panes get pixel frames that glow at night. Roof prisms, hip cones and flat awnings get tiles, slate or tin.
function pxbScene(){pxbScene.done=true;const V=new THREE.Vector3(),Q=new THREE.Quaternion(),SC=new THREE.Vector3(),B=new THREE.Box3();scene.updateMatrixWorld(true);
  const isl=o=>{o.getWorldPosition(V);scene.worldToLocal(V);try{return zoneOf(V.x)==='island';}catch(e){return false;}};
  const hex=m=>m&&m.color?'#'+m.color.getHexString():'#e4d2a8';const r1=v=>Math.round(v*10)/10;
  const cache=new Map();const tm=(key,make,o)=>{let m=cache.get(key);if(!m){const c=make();m=new THREE.MeshLambertMaterial(Object.assign({map:ctex(c)},o||{}));m.map.minFilter=THREE.NearestFilter;m.map.generateMipmaps=false;cache.set(key,m);}return m;};
  const vehicle=o=>{for(let p=o.parent;p&&p!==scene;p=p.parent)if(p.__wheels>=3)return true;return false;};
  scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CylinderGeometry'&&o.parent&&o.parent!==scene&&!o.parent.__pxw){o.parent.__pxw=1;let n=0;o.parent.children.forEach(c=>{if(c.isMesh&&c.geometry&&c.geometry.type==='CylinderGeometry'&&c.geometry.parameters.radiusTop<.6&&Math.abs(c.rotation.x)+Math.abs(c.rotation.z)>1)n++;});if(n>=3)o.parent.__wheels=Math.max(o.parent.__wheels||0,n);}});
  const walls=[],panes=[],roofs=[];
  scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.geometry||!o.material||Array.isArray(o.material)||o.material.transparent||o.material.vertexColors)return;const g=o.geometry,t=g.type,p=g.parameters||{};
    if(!(o.material.isMeshLambertMaterial||o.material.isMeshStandardMaterial||o.material.isMeshPhongMaterial))return;
    if(typeof SIGN_TEX!=='undefined'&&o.material.map&&SIGN_TEX.has(o.material.map))return;
    o.matrixWorld.decompose(V,Q,SC);const sx=Math.abs(SC.x),sy=Math.abs(SC.y),sz=Math.abs(SC.z);
    if(t==='BoxGeometry'){const w=p.width*sx,h=p.height*sy,d=p.depth*sz;if(vehicle(o))return;
      if(h>=1.3&&Math.max(w,d)>=1.6&&Math.min(w,d)>=.12){if(isl(o))walls.push({o,w,h,d});return;}
      if(h<.18&&w>=1.4&&d>=.6){o.getWorldPosition(V);if(V.y>1.2&&isl(o))roofs.push({o,kind:'flat',w,d});}return;}
    if(t==='CylinderGeometry'&&p.radialSegments<=4&&Math.abs(p.radiusTop-p.radiusBottom)<.01&&p.radiusTop*Math.max(sx,sz)>.8){o.getWorldPosition(V);if(V.y>1.4&&isl(o)&&!vehicle(o))roofs.push({o,kind:'prism',r:p.radiusTop,L:p.height*sy,n:p.radialSegments,s:Math.max(sx,sz)});return;}
    if(t==='ConeGeometry'&&p.radialSegments<=8&&p.radius*Math.max(sx,sz)>=.9){o.getWorldPosition(V);if(V.y>1.6&&isl(o)&&!vehicle(o))roofs.push({o,kind:'cone',r:p.radius*Math.max(sx,sz),h:p.height*sy,n:p.radialSegments});return;}
    if(t==='PlaneGeometry'&&!o.material.map){const w=p.width*sx,h=p.height*sy;if(w<.22||h<.22||w>1.8||h>1.8)return;o.getWorldPosition(V);if(V.y<.25||V.y>3.2)return;
      const c=o.material.color,l=c.r*.3+c.g*.59+c.b*.11;const isDoor=h>=.8&&h>w*1.3&&V.y-h/2<.35;if(!isDoor&&l>.62)return;if(isl(o))panes.push({o,w,h,door:isDoor,pos:V.clone()});}});
  // which wall face each pane sits on
  const inv=new THREE.Matrix4(),L=new THREE.Vector3();
  walls.forEach(W=>{W.faces=[0,0,0,0,0,0];inv.copy(W.o.matrixWorld).invert();const p=W.o.geometry.parameters;
    panes.forEach(P=>{L.copy(P.pos).applyMatrix4(inv);const ax=Math.abs(L.x)-p.width/2,az=Math.abs(L.z)-p.depth/2;
      if(Math.abs(L.y)<p.height/2+.1){if(Math.abs(ax)<.25&&Math.abs(L.z)<p.depth/2+.05)W.faces[L.x>0?0:1]++;else if(Math.abs(az)<.25&&Math.abs(L.x)<p.width/2+.05)W.faces[L.z>0?4:5]++;}});});
  let nw=0,nr=0,np=0;const glowMats=[];
  walls.forEach((W,i)=>{const base=hex(W.o.material),lum=PXK.lum(base);const kind=lum>.84?'stone':lum<.3?'brick':'plaster';
    const big=W.w*W.d>4.5;const face=(fw,has,k)=>{const n=has||fw<1.7||W.h<1.5||Math.min(W.w,W.d)<.4?0:Math.max(1,Math.floor((fw-.6)/1.5));const key=['w',base,r1(fw),r1(W.h),n,k%2].join('|');
      const opt={base:lum>.95?'#ece0c2':base,kind,win:n,door:false,shutter:k%2?'#3d7a78':null,arch:big&&k%2===0,seed:13+k*7+(fw*10|0),ivy:fw>2.4&&(i%4===1)?[.05,.28]:null};
      if(!n)return tm(key,()=>PXK.wall(fw,W.h,opt));let m=cache.get(key);if(m)return m;
      // painted windows glow at night: the lit version minus the day version gives the glass only
      const day=PXK.wall(fw,W.h,opt),lit=PXK.wall(fw,W.h,Object.assign({},opt,{lit:true})),em=document.createElement('canvas');em.width=day.width;em.height=day.height;
      const a=day.getContext('2d').getImageData(0,0,day.width,day.height),b=lit.getContext('2d').getImageData(0,0,day.width,day.height),e=em.getContext('2d').createImageData(day.width,day.height);
      for(let q=0;q<a.data.length;q+=4){const dif=Math.abs(a.data[q]-b.data[q])+Math.abs(a.data[q+1]-b.data[q+1])+Math.abs(a.data[q+2]-b.data[q+2]);if(dif>30){e.data[q]=b.data[q];e.data[q+1]=b.data[q+1];e.data[q+2]=b.data[q+2];}e.data[q+3]=255;}
      em.getContext('2d').putImageData(e,0,0);m=new THREE.MeshLambertMaterial({map:ctex(day),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(em)});cache.set(key,m);glowMats.push(m);return m;};
    const top=tm('t|'+base,()=>{const[c,x]=PXK.cv(16,16);PXK.P(x,PXK.sh(base,.86),0,0,16,16);return c;});
    const flat=W.w*W.d>6&&W.h>=1.8?tm(['tf',r1(W.w),r1(W.d)].join('|'),()=>PXK.roof(W.w,W.d,{base:'#b8bcc0',kind:'tin',seed:5})):top;
    W.o.material=[face(W.d,W.faces[0],1),face(W.d,W.faces[1],3),flat,top,face(W.w,W.faces[4],0),face(W.w,W.faces[5],2)];W.o.castShadow=W.o.receiveShadow=true;nw++;});
  const roofKind=c=>{const a=new THREE.Color(c);const hsl={};a.getHSL(hsl);return hsl.s<.22?'slate':(hsl.h>.18&&hsl.h<.5)?'tin':(hsl.h>.5&&hsl.h<.75)?'slate':'tile';};
  roofs.forEach(R=>{const base=hex(R.o.material),k=roofKind(base);
    if(R.kind==='prism'){const side=2*R.r*Math.sin(Math.PI/R.n)*R.s,circ=side*R.n;const m=tm(['rp',base,r1(circ),r1(R.L),k].join('|'),()=>PXK.roof(circ,R.L,{base,kind:k,across:true}));
      const cap=tm('rc|'+base,()=>PXK.wall(2*R.r*R.s,2*R.r*R.s,{base:'#e8dcc0',kind:'stone',win:0,plinth:false,cornice:false,moss:false}));R.o.material=[m,cap,cap];}
    else if(R.kind==='cone'){const per=2*R.r*Math.sin(Math.PI/R.n)*R.n,sl=Math.hypot(R.r,R.h);R.o.material=[tm(['rk',base,r1(per),r1(sl),k].join('|'),()=>PXK.roof(per,sl,{base,kind:k})),tm('t|'+base,()=>{const[c,x]=PXK.cv(8,8);PXK.P(x,PXK.sh(base,.6),0,0,8,8);return c;})];}
    else{const m=tm(['rf',base,r1(R.w),r1(R.d)].join('|'),()=>PXK.roof(R.w,R.d,{base,kind:k==='tile'?'tin':k}));const e=tm('t|'+base,()=>{const[c,x]=PXK.cv(8,8);PXK.P(x,PXK.sh(base,.7),0,0,8,8);return c;});R.o.material=[e,e,m,e,e,e];}
    R.o.castShadow=true;nr++;});
  panes.forEach(P=>{const col=hex(P.o.material);let m;
    if(P.door)m=tm('d|'+col,()=>PXK.doorPane(PXK.lum(col)<.2?'#2f5a46':col));
    else{const aspect=P.h/P.w,w=Math.max(8,Math.round(P.w*32)-6),h=Math.max(8,Math.round(P.h*32)-6),key='p|'+w+'|'+h;
      m=cache.get(key);if(!m){m=new THREE.MeshLambertMaterial({map:ctex(PXK.pane(false,w,h)),emissive:0xffffff,emissiveIntensity:0});m.emissiveMap=ctex(PXK.pane(true,w,h));cache.set(key,m);glowMats.push(m);}}
    P.o.material=m;np++;});
  pxbScene.glow=glowMats;pxbScene.stats={walls:nw,roofs:nr,panes:np};
  if(rt.depthTexture&&post.uniforms.outl){post.uniforms.tDepth.value=rt.depthTexture;post.uniforms.outl.value=1;post.uniforms.nf.value.set(camera.near,camera.far);}}
function pxbTick(){if(!pxbScene.glow)return;if(post.uniforms.outl)post.uniforms.outl.value=typeof player!=='undefined'&&zoneOf(player.x)==='island'?1:0;const n=typeof NIGHT==='number'?NIGHT:0,h=(typeof S!=='undefined'?S.time%1440:720)/60,dusk=Math.max(0,Math.min(1,(h-17.6)/1.2)),k=Math.max(n,dusk*.6);
  if(pxbScene._k===k)return;pxbScene._k=k;pxbScene.glow.forEach(m=>m.emissiveIntensity=k*1.35);
}

function tex3Scene(){tex3Scene.done=true;const V3=new THREE.Vector3(),cache=new Map(),vcache=new Map();let walls=0,cars=0;
  const islandAt=o=>{o.getWorldPosition(V3);scene.worldToLocal(V3);try{return zoneOf(V3.x)==='island';}catch(e){return false;}};
  // vehicles: a group with three or more wheels; its biggest box is the body, dark boxes are glass
  const groups=new Set();scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CylinderGeometry'&&o.parent&&o.parent!==scene){const p=o.parent;p.__wheels=(p.__wheels||0)+1;if(p.__wheels>=3)groups.add(p);}});
  const paint=(col,kind)=>{const key=col+kind;if(vcache.has(key))return vcache.get(key);const c=mk(32,16),x=c.getContext('2d');const B=T3.hex(col);const sh=k=>`rgb(${B.map(v=>Math.max(0,Math.min(255,Math.round(v*k)))).join(',')})`;
    if(kind==='glass'){x.fillStyle=sh(1);x.fillRect(0,0,32,16);x.fillStyle='rgba(190,220,250,.45)';for(let i=0;i<3;i++){x.beginPath();x.moveTo(4+i*11,0);x.lineTo(8+i*11,0);x.lineTo(2+i*11,16);x.lineTo(-2+i*11,16);x.fill();}x.fillStyle='rgba(255,255,255,.25)';x.fillRect(0,0,32,1);}
    else{for(let y=0;y<16;y++){const k=y<2?1.16:y<5?1.06:y>12?.82:1;x.fillStyle=sh(k);x.fillRect(0,y,32,1);}
      x.fillStyle=sh(.7);x.fillRect(11,3,1,10);x.fillRect(21,3,1,10);x.fillRect(0,9,32,1);x.fillStyle=sh(1.25);x.fillRect(0,2,32,1);
      x.fillStyle='#d8d8d4';x.fillRect(14,7,2,1);x.fillRect(24,7,2,1);
      for(let y=11;y<16;y++)for(let xx=0;xx<32;xx++)if(l2hash(xx,y,91)<(y-10)*.12){x.fillStyle=l2hash(xx,y,92)<.5?'rgba(150,92,56,.55)':'rgba(120,80,52,.5)';x.fillRect(xx,y,1,1);}}
    const t=ctex(c);const m=new THREE.MeshLambertMaterial({map:t});vcache.set(key,m);return m;};
  groups.forEach(g=>{if(!islandAt(g))return;let body=null,bv=0;g.children.forEach(o=>{if(!o.isMesh||!o.geometry||o.geometry.type!=='BoxGeometry'||!o.material||o.material.map)return;const p=o.geometry.parameters,v=p.width*p.height*p.depth;
      const col='#'+o.material.color.getHexString(),l=o.material.color.r+o.material.color.g+o.material.color.b;
      if(l<.5&&p.height<.6){o.material=paint(col,'glass');return;}if(v>bv){bv=v;body=o;}});
    if(body){body.material=paint('#'+body.material.color.getHexString(),'body');cars++;}});
  // walls: darker at the foot, lighter up high, like light bouncing off the ground (soft contact shade)
  scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.geometry||o.geometry.type!=='BoxGeometry'||!o.material||Array.isArray(o.material))return;const p=o.geometry.parameters;if(p.height<1.1||p.width<.6&&p.depth<.6)return;
    if(o.parent&&o.parent.__wheels>=3)return;if(!islandAt(o))return;const m=o.material;if(m.vertexColors||!(m.isMeshLambertMaterial||m.isMeshStandardMaterial))return;
    let mc=cache.get(m);if(!mc){mc=m.clone();mc.vertexColors=true;cache.set(m,mc);}
    const g=o.geometry.clone(),pos=g.attributes.position,col=new Float32Array(pos.count*3),h=p.height;
    for(let i=0;i<pos.count;i++){const y=pos.getY(i)+h/2;const k=.7+.3*Math.min(1,y/Math.min(1.4,h*.55));col[i*3]=k;col[i*3+1]=k*.99;col[i*3+2]=k*.97;}
    g.setAttribute('color',new THREE.BufferAttribute(col,3));o.geometry=g;o.material=mc;walls++;});
  tex3Scene.stats={walls,cars};}

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
