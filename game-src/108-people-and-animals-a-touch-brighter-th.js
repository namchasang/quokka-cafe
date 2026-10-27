/* people and animals: a touch brighter than the calm background, less so at night */
function pxPopTick(){const now=performance.now();if(pxPopTick.t&&now-pxPopTick.t<900)return;pxPopTick.t=now;if(typeof BB==='undefined')return;const n=typeof NIGHT==='number'?NIGHT:0,k=.13*(1-.75*n);
  for(const o of BB){const F=o.userData&&o.userData.frames;if(!F)continue;for(const f of F){const m=f.m;if(!m||!m.map||!m.emissive||!m.emissive.isColor)continue;if(!m.__pop){m.__pop=1;m.emissive.set(0xffffff);m.emissiveMap=m.map;m.needsUpdate=true;}m.emissiveIntensity=k;}}}

function pxbScene(){pxbScene.done=true;const T0=performance.now();const V=new THREE.Vector3(),Q=new THREE.Quaternion(),SC=new THREE.Vector3(),B=new THREE.Box3();scene.updateMatrixWorld(true);
  const isl=o=>{const m=o.material,im=m&&m.map&&m.map.image;return!im||im.width<=32;};// plain walls get the kit; walls with their own picture keep it (redrawn below)// every map; faces that already carry a painted picture keep it
  const hex=m=>m&&m.color?'#'+m.color.getHexString():'#e4d2a8';const r1=v=>Math.round(v*2)/2;
  const cache=new Map();const tm=(key,make,o)=>{let m=cache.get(key);if(!m){const c=make();m=new THREE.MeshLambertMaterial(Object.assign({map:ctex(c)},o||{}));m.map.minFilter=THREE.NearestFilter;m.map.generateMipmaps=false;cache.set(key,m);}return m;};
  const vehicle=o=>{for(let p=o.parent;p&&p!==scene;p=p.parent)if(p.__wheels>=3)return true;return false;};
  scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CylinderGeometry'&&o.parent&&o.parent!==scene&&!o.parent.__pxw){o.parent.__pxw=1;let n=0;o.parent.children.forEach(c=>{if(c.isMesh&&c.geometry&&c.geometry.type==='CylinderGeometry'&&c.geometry.parameters.radiusTop<.6&&Math.abs(c.rotation.x)+Math.abs(c.rotation.z)>1)n++;});if(n>=3)o.parent.__wheels=Math.max(o.parent.__wheels||0,n);}});
  const walls=[],panes=[],roofs=[];
  scene.traverse(o=>{if(!o.isMesh||o.__pxSkip||!o.visible||o.isInstancedMesh||!o.geometry||!o.material||Array.isArray(o.material)||o.material.transparent||o.material.vertexColors)return;const g=o.geometry,t=g.type,p=g.parameters||{};
    if(!(o.material.isMeshLambertMaterial||o.material.isMeshStandardMaterial||o.material.isMeshPhongMaterial))return;
    if(typeof SIGN_TEX!=='undefined'&&o.material.map&&SIGN_TEX.has(o.material.map))return;
    o.matrixWorld.decompose(V,Q,SC);const sx=Math.abs(SC.x),sy=Math.abs(SC.y),sz=Math.abs(SC.z);
    if(t==='BoxGeometry'){const w=p.width*sx,h=p.height*sy,d=p.depth*sz;if(vehicle(o))return;
      if(h>=1.3&&Math.max(w,d)>=1.6&&Math.min(w,d)>=.12){if(isl(o))walls.push({o,w,h,d});return;}
      if(h<.18&&w>=1.4&&d>=.6){o.getWorldPosition(V);if(V.y>1.2&&isl(o))roofs.push({o,kind:'flat',w,d});}return;}
    if(t==='CylinderGeometry'&&p.radialSegments<=4&&Math.abs(p.radiusTop-p.radiusBottom)<.01&&p.radiusTop*Math.max(sx,sz)>.8){o.getWorldPosition(V);if(V.y>1.4&&isl(o)&&!vehicle(o))roofs.push({o,kind:'prism',r:p.radiusTop,L:p.height*sy,n:p.radialSegments,s:Math.max(sx,sz)});return;}
    if(t==='ConeGeometry'&&p.radialSegments<=8&&p.radius*Math.max(sx,sz)>=.9){o.getWorldPosition(V);if(V.y>1.6&&isl(o)&&!vehicle(o))roofs.push({o,kind:'cone',r:p.radius*Math.max(sx,sz),h:p.height*sy,n:p.radialSegments});return;}
    if(t==='PlaneGeometry'&&!o.material.map){const w=p.width*sx,h=p.height*sy;if((w>1.8||h>1.8)&&w<=12&&h<=8&&w>.6&&h>.5&&pxGlassy(o.material.color)){o.getWorldPosition(V);if(V.y>.2){o.material=pxGlassMat(hex(o.material),w,h);}return;}if(w<.22||h<.22||w>1.8||h>1.8)return;o.getWorldPosition(V);if(V.y<.25||V.y>3.2)return;
      const c=o.material.color,l=c.r*.3+c.g*.59+c.b*.11;const isDoor=h>=.8&&h>w*1.3&&V.y-h/2<.35;if(!isDoor&&l>.62)return;if(isl(o))panes.push({o,w,h,door:isDoor,pos:V.clone()});}});
  // faces that already carry a painted picture (the towns from Paul's photos): keep the design, redraw it as pixel art at the kit's density
  const hdT=new Map();let nh=0;
  const facadeHD=t=>{if(hdT.has(t))return hdT.get(t);let out=null;try{const im=t.image;if(!im||!(im.width>=8)||im.width>640||im.height>640||(typeof SIGN_TEX!=='undefined'&&SIGN_TEX.has(t)))throw 0;
      const k=Math.max(2,Math.min(3,Math.floor(1024/Math.max(im.width,im.height)))),W=im.width,H=im.height,W2=W*k,H2=H*k;
      const sc=document.createElement('canvas');sc.width=W;sc.height=H;const sx=sc.getContext('2d');sx.drawImage(im,0,0);const s0=sx.getImageData(0,0,W,H).data;
      const key=(x,y)=>{x=(x+W)%W;y=Math.max(0,Math.min(H-1,y));const o=(y*W+x)*4;return(s0[o]<<16)|(s0[o+1]<<8)|s0[o+2];};const lum=c=>(((c>>16)&255)*.3+((c>>8)&255)*.59+(c&255)*.11);
      const oc=document.createElement('canvas');oc.width=W2;oc.height=H2;const ox=oc.getContext('2d'),id=ox.createImageData(W2,H2),d=id.data;
      const put=(X,Y,c,f)=>{const o=(Y*W2+X)*4;d[o]=Math.min(255,((c>>16)&255)*f);d[o+1]=Math.min(255,((c>>8)&255)*f);d[o+2]=Math.min(255,(c&255)*f);d[o+3]=255;};
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=key(x,y),up=key(x,y-1),dn=key(x,y+1),lf=key(x-1,y),rt=key(x+1,y),L=lum(c);
        const n=1+(((x*73856093)^(y*19349663))&7)/160-.022;
        for(let j=0;j<k;j++)for(let i=0;i<k;i++){let f=n;
          if(j===0&&up!==c)f*=lum(up)<L-24?.62:1.12;// a lit top edge, or an inked edge under something darker
          else if(j===k-1&&dn!==c)f*=lum(dn)>L+24?.7:.86;// shade at the foot of each patch
          if(i===0&&lf!==c&&lum(lf)>L+40)f*=.72;if(i===k-1&&rt!==c&&lum(rt)>L+40)f*=.78;
          put(x*k+i,y*k+j,c,f);}}
      ox.putImageData(id,0,0);out=new THREE.CanvasTexture(oc);out.magFilter=out.minFilter=THREE.NearestFilter;out.generateMipmaps=false;out.wrapS=t.wrapS;out.wrapT=t.wrapT;out.repeat.copy(t.repeat);out.offset.copy(t.offset);out.rotation=t.rotation;out.center.copy(t.center);out.encoding=t.encoding;nh++;}catch(e){out=null;}
    hdT.set(t,out);return out;};
  const hdMat=new Map();const upMat=m=>{if(!m||!m.map||m.__pxHD||m.transparent||m.alphaTest>0||m.isMeshBasicMaterial||m.isSpriteMaterial||m.isShaderMaterial)return m;if(hdMat.has(m))return hdMat.get(m);const t=facadeHD(m.map);let r=m;if(t){r=m.clone();r.map=t;if(m.emissiveMap===m.map)r.emissiveMap=t;r.__pxHD=1;}hdMat.set(m,r);return r;};
  scene.traverse(o=>{if(!o.isMesh||o.__pxSkip||!o.geometry||!o.material)return;const t=o.geometry.type;if(t!=='BoxGeometry'&&t!=='PlaneGeometry'&&t!=='CylinderGeometry'&&t!=='ExtrudeGeometry'&&t!=='ShapeGeometry')return;
    o.geometry.computeBoundingBox&&!o.geometry.boundingBox&&o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox;if(!bb)return;o.matrixWorld.decompose(V,Q,SC);if((bb.max.y-bb.min.y)*Math.abs(SC.y)<1)return;
    if(typeof BB!=='undefined'&&BB.includes&&BB.includes(o))return;if(Array.isArray(o.material))o.material=o.material.map(upMat);else o.material=upMat(o.material);});
  // which wall face each pane sits on
  const inv=new THREE.Matrix4(),L=new THREE.Vector3();
  walls.forEach(W=>{W.faces=[0,0,0,0,0,0];inv.copy(W.o.matrixWorld).invert();const p=W.o.geometry.parameters;
    panes.forEach(P=>{L.copy(P.pos).applyMatrix4(inv);const ax=Math.abs(L.x)-p.width/2,az=Math.abs(L.z)-p.depth/2;
      if(Math.abs(L.y)<p.height/2+.1){if(Math.abs(ax)<.25&&Math.abs(L.z)<p.depth/2+.05)W.faces[L.x>0?0:1]++;else if(Math.abs(az)<.25&&Math.abs(L.x)<p.width/2+.05)W.faces[L.z>0?4:5]++;}});});
  let nw=0,nr=0,np=0;const glowMats=[];
  // the wall's own colour: material colour times the most common colour of its little tile (so a teal tower stays teal)
  const avgC=new Map();const tileCol=m=>{const im=m.map&&m.map.image;if(!im)return hex(m);if(avgC.has(im))return avgC.get(im);let out=hex(m);try{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height).data;const cnt=new Map();let best=0,bk=0;
      for(let q=0;q<d.length;q+=4){const k=((d[q]>>3)<<10)|((d[q+1]>>3)<<5)|(d[q+2]>>3);const n=(cnt.get(k)||0)+1;cnt.set(k,n);if(n>best){best=n;bk=q;}}const col=new THREE.Color(d[bk]/255,d[bk+1]/255,d[bk+2]/255).multiply(m.color);out='#'+col.getHexString();}catch(e){}avgC.set(im,out);return out;};
  walls.forEach((W,i)=>{const base=tileCol(W.o.material),lum=PXK.lum(base);const kind=lum>.84?'stone':lum<.3?'brick':'plaster';
    const big=W.w*W.d>4.5;const face=(fw,has,k)=>{const n=has||fw<1.7||W.h<1.25||Math.min(W.w,W.d)<.4?0:Math.max(1,Math.floor((fw-.6)/1.5));const key=['w',base,r1(fw),r1(W.h),n,k%2].join('|');
      const opt={base:lum>.95?'#ece0c2':base,kind,win:n,door:false,shutter:k%2?'#3d7a78':null,arch:big&&k%2===0,seed:13+k*7+(fw*10|0),ivy:fw>2.4&&(i%4===1)?[.05,.28]:null};
      if(W.h>6.6||fw>14){const mw=fw>14?6:Math.max(1.6,r1(fw)),mh=2.9,nx=Math.max(1,Math.round(fw/mw)),ny=Math.max(1,Math.round(W.h/mh)),k2=['m',base,mw,nx,ny,k%2].join('|');let mm=cache.get(k2);if(mm)return mm;
        const mo=Object.assign({},opt,{win:Math.max(1,Math.floor((mw-.4)/1.5)),rows:1,plinth:false,cornice:true,moss:false,ivy:null,shutter:null,arch:false,quoins:false,box:false});
        const day=PXK.wall(mw,mh,mo),lit=PXK.wall(mw,mh,Object.assign({},mo,{lit:true}));{const A=day.getContext('2d').getImageData(0,0,day.width,day.height),Bq=lit.getContext('2d').getImageData(0,0,day.width,day.height);for(let q=0;q<A.data.length;q+=4){const d=Math.abs(A.data[q]-Bq.data[q])+Math.abs(A.data[q+1]-Bq.data[q+1])+Math.abs(A.data[q+2]-Bq.data[q+2]);if(d<=30){Bq.data[q]=Bq.data[q+1]=Bq.data[q+2]=0;}}lit.getContext('2d').putImageData(Bq,0,0);}const t1=ctex(day),t2=ctex(lit);[t1,t2].forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(nx,ny);});
        mm=new THREE.MeshLambertMaterial({map:t1,emissive:0xffffff,emissiveIntensity:0,emissiveMap:t2});cache.set(k2,mm);glowMats.push(mm);return mm;}
      const fwR=Math.max(.6,r1(fw)),hR=Math.max(1,r1(W.h));fw=fwR;
      if(!n)return tm(key,()=>PXK.wall(fw,hR,opt));let m=cache.get(key);if(m)return m;
      // painted windows glow at night: the lit version minus the day version gives the glass only
      const day=PXK.wall(fw,hR,opt),lit=PXK.wall(fw,hR,Object.assign({},opt,{lit:true})),em=document.createElement('canvas');em.width=day.width;em.height=day.height;
      const a=day.getContext('2d').getImageData(0,0,day.width,day.height),b=lit.getContext('2d').getImageData(0,0,day.width,day.height),e=em.getContext('2d').createImageData(day.width,day.height);
      for(let q=0;q<a.data.length;q+=4){const dif=Math.abs(a.data[q]-b.data[q])+Math.abs(a.data[q+1]-b.data[q+1])+Math.abs(a.data[q+2]-b.data[q+2]);if(dif>30){e.data[q]=b.data[q];e.data[q+1]=b.data[q+1];e.data[q+2]=b.data[q+2];}e.data[q+3]=255;}
      em.getContext('2d').putImageData(e,0,0);m=new THREE.MeshLambertMaterial({map:ctex(day),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(em)});cache.set(key,m);glowMats.push(m);return m;};
    const top=tm('t|'+base,()=>{const[c,x]=PXK.cv(16,16);PXK.P(x,PXK.sh(base,.86),0,0,16,16);return c;});
    const flat=W.w*W.d>6&&W.h>=1.8?tm(['tf',r1(W.w),r1(W.d)].join('|'),()=>PXK.roof(W.w,W.d,{base:'#b8bcc0',kind:'tin',seed:5})):top;
    W.o.material=[face(W.d,W.faces[0],1),face(W.d,W.faces[1],3),flat,top,face(W.w,W.faces[4],0),face(W.w,W.faces[5],2)];W.o.castShadow=W.o.receiveShadow=true;nw++;});
  // a four-sided cone roof is replaced by a proper hip roof cut to the wall it sits on (same footprint plus a small overhang, a gentle pitch)
  walls.forEach(W=>{W.box=new THREE.Box3().setFromObject(W.o);});const RB=new THREE.Box3(),RC=new THREE.Vector3();
  function pxHip(R,base,k){RB.setFromObject(R.o);RB.getCenter(RC);let best=null,bd=1e9;
    for(const W of walls){const b=W.box;if(RC.x<b.min.x||RC.x>b.max.x||RC.z<b.min.z||RC.z>b.max.z)continue;const dy=Math.abs(RB.min.y-b.max.y);if(dy<1&&dy<bd){bd=dy;best=W;}}
    if(!best)return false;const W=best,p=W.o.geometry.parameters,sx=W.w/p.width,sy=W.h/p.height,sz=W.d/p.depth,ov=.22;
    const X=p.width/2+ov/sx,Z=p.depth/2+ov/sz,y0=p.height/2,H=Math.min(W.w,W.d)/2*.8/sy,alongX=W.w>=W.d;
    const ix=alongX?Math.min(X,(W.d/2+ov)/sx):X,iz=alongX?Z:Math.min(Z,(W.w/2+ov)/sz);
    const R1=alongX?[-X+ix,y0+H,0]:[0,y0+H,-Z+iz],R2=alongX?[X-ix,y0+H,0]:[0,y0+H,Z-iz];
    const A=[-X,y0,-Z],Bv=[X,y0,-Z],C=[X,y0,Z],D=[-X,y0,Z];const pos=[],uv=[];
    const tri=(a,b,c,ua,ub,uc)=>{pos.push(...a,...b,...c);uv.push(...ua,...ub,...uc);};
    // u along the eave, v up the slope, both in metres / 2 (one roof tile canvas covers 2 m)
    const uvF=(q,ax,eaveC)=>[(ax==='x'?q[0]*sx:q[2]*sz)/2,(Math.abs(eaveC-(ax==='x'?q[2]*sz:q[0]*sx))+ (q[1]-y0)*sy*.3)/2];
    const face=(a,b,c,d,ax,ec)=>{const qs=[a,b,c,d].map(q=>uvF(q,ax,ec));tri(a,b,c,qs[0],qs[1],qs[2]);tri(a,c,d,qs[0],qs[2],qs[3]);};
    face(D,C,R2,R1,'x',Z*sz);face(Bv,A,R1,R2,'x',-Z*sz);
    const tface=(a,b,r,ax,ec)=>{tri(a,b,r,uvF(a,ax,ec),uvF(b,ax,ec),uvF(r,ax,ec));};
    tface(A,D,alongX?R1:R1,'z',-X*sx);tface(C,Bv,alongX?R2:R2,'z',X*sx);
    if(!alongX){pos.length=0;uv.length=0;face(A,D,R2,R1,'z',-X*sx);face(C,Bv,R1,R2,'z',X*sx);tface(D,C,R2,'x',Z*sz);tface(Bv,A,R1,'x',-Z*sz);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    const m=tm('hip|'+base+'|'+k,()=>PXK.roof(2,2,{base,kind:k,seed:17}),{side:THREE.DoubleSide});m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;
    const mesh=new THREE.Mesh(g,m);mesh.castShadow=mesh.receiveShadow=true;mesh.__pxSkip=1;W.o.add(mesh);
    // a dark fascia under the eaves
    const fb=new THREE.Mesh(new THREE.BoxGeometry(2*X,.1/sy,2*Z),new THREE.MeshLambertMaterial({color:new THREE.Color(base).multiplyScalar(.5)}));fb.position.y=y0+.02/sy;fb.__pxSkip=1;W.o.add(fb);
    R.o.visible=false;(pxbScene.hips=pxbScene.hips||[]).push([Math.round(RC.x),Math.round(RC.z)]);return true;}
  const roofKind=c=>{const a=new THREE.Color(c);const hsl={};a.getHSL(hsl);return hsl.s<.22?'slate':(hsl.h>.18&&hsl.h<.5)?'tin':(hsl.h>.5&&hsl.h<.75)?'slate':'tile';};
  roofs.forEach(R=>{const base=hex(R.o.material),k=roofKind(base);
    if(R.kind==='prism'){const side=2*R.r*Math.sin(Math.PI/R.n)*R.s,circ=side*R.n;const m=tm(['rp',base,r1(circ),r1(R.L),k].join('|'),()=>PXK.roof(circ,R.L,{base,kind:k,across:true}));
      const cap=tm('rc|'+base,()=>PXK.wall(2*R.r*R.s,2*R.r*R.s,{base:'#e8dcc0',kind:'stone',win:0,plinth:false,cornice:false,moss:false}));R.o.material=[m,cap,cap];}
    else if(R.kind==='cone'&&R.n===4&&pxHip(R,base,k)){}
    else if(R.kind==='cone'){const per=2*R.r*Math.sin(Math.PI/R.n)*R.n,sl=Math.hypot(R.r,R.h);R.o.material=[tm(['rk',base,r1(per),r1(sl),k].join('|'),()=>PXK.roof(per,sl,{base,kind:k})),tm('t|'+base,()=>{const[c,x]=PXK.cv(8,8);PXK.P(x,PXK.sh(base,.6),0,0,8,8);return c;})];}
    else{const m=tm(['rf',base,r1(R.w),r1(R.d)].join('|'),()=>PXK.roof(R.w,R.d,{base,kind:k==='tile'?'tin':k}));const e=tm('t|'+base,()=>{const[c,x]=PXK.cv(8,8);PXK.P(x,PXK.sh(base,.7),0,0,8,8);return c;});R.o.material=[e,e,m,e,e,e];}
    R.o.castShadow=true;nr++;});
  panes.forEach(P=>{const col=hex(P.o.material);let m;
    if(P.door)m=tm('d|'+col,()=>PXK.doorPane(PXK.lum(col)<.2?'#2f5a46':col));
    else{const aspect=P.h/P.w,w=Math.max(8,Math.round(P.w*32)-6),h=Math.max(8,Math.round(P.h*32)-6),key='p|'+w+'|'+h;
      m=cache.get(key);if(!m){m=new THREE.MeshLambertMaterial({map:ctex(PXK.pane(false,w,h)),emissive:0xffffff,emissiveIntensity:0});m.emissiveMap=ctex(PXK.pane(true,w,h));cache.set(key,m);glowMats.push(m);}}
    P.o.material=m;np++;});
  PXB_GLOW.push(...glowMats);pxbScene.glow=PXB_GLOW;try{pxOneLook();}catch(e){console.error(e);}pxbScene.stats={walls:nw,roofs:nr,panes:np,mats:cache.size,hd:nh,ms:Math.round(performance.now()-T0),one:pxOneLook.stats,hips:pxbScene.hips};window.__pxbStats=pxbScene.stats;if(typeof CBD!=='undefined'&&CBD.cut)CBD.cut.forEach(e=>{e.ready=false;});
  // buildings outside the city fade when they stand between the camera and Kip (the city has its own)
  {const cutG=new Set(typeof CBD!=='undefined'&&CBD.cut?CBD.cut.map(e=>e.g):[]);const inCut=o=>{for(let p=o;p;p=p.parent)if(cutG.has(p))return true;return false;};const seen=new Set();PXB_SEE.length=0;
    walls.forEach(W=>{if(inCut(W.o))return;const par=W.o.parent;const root=par&&par!==scene&&par.children.length<=40?par:W.o;if(seen.has(root))return;seen.add(root);
      const objs=[root];if(root===W.o)roofs.forEach(R=>{RB.setFromObject(R.o);RB.getCenter(RC);if(RC.x>W.box.min.x&&RC.x<W.box.max.x&&RC.z>W.box.min.z&&RC.z<W.box.max.z&&RC.y>W.box.max.y-.5)objs.push(R.o);});
      const box=new THREE.Box3();objs.forEach(o=>box.expandByObject(o));PXB_SEE.push({objs,box,a:1,mats:null});});}
  if(rt.depthTexture&&post.uniforms.outl){post.uniforms.tDepth.value=rt.depthTexture;post.uniforms.outl.value=1;post.uniforms.nf.value.set(camera.near,camera.far);}}
const PXB_SEE=[],_pxR=new THREE.Ray(),_pxP=new THREE.Vector3(),_pxV=new THREE.Vector3();
function pxbSee(dt){if(!PXB_SEE.length||typeof player==='undefined')return;const k=Math.min(1,(dt||.016)*6);
  for(const e of PXB_SEE){const c=e.box;_pxP.set(player.x,0,player.z);scene.localToWorld(_pxP);if(_pxP.x<c.min.x-30||_pxP.x>c.max.x+30||_pxP.z<c.min.z-30||_pxP.z>c.max.z+30){if(e.a===1)continue;}
    let hit=false;for(const hy of[.4,1.1]){_pxP.set(player.x,hy,player.z);scene.localToWorld(_pxP);_pxR.origin.copy(camera.position);_pxR.direction.copy(_pxP).sub(camera.position);const L=_pxR.direction.length();_pxR.direction.normalize();
      const q=_pxR.intersectBox(c,_pxV);if(q&&camera.position.distanceTo(q)<L-.3&&!(_pxP.x>c.min.x&&_pxP.x<c.max.x&&_pxP.z>c.min.z&&_pxP.z<c.max.z)){hit=true;break;}}
    const tg=hit?.28:1;if(Math.abs(e.a-tg)<.005)continue;
    if(!e.mats){e.mats=[];const cl=m=>{const c2=m.clone();c2.userData.op0=m.opacity;c2.userData.tr0=m.transparent;c2.userData.dw0=m.depthWrite;if(PXB_GLOW.includes(m))PXB_GLOW.push(c2);e.mats.push(c2);return c2;};
      e.objs.forEach(o=>o.traverse(x=>{if(!x.isMesh||!x.material)return;x.material=Array.isArray(x.material)?x.material.map(cl):cl(x.material);}));pxbScene._k=-1;}
    e.a+=(tg-e.a)*k;if(Math.abs(e.a-tg)<.01)e.a=tg;const solid=e.a>.995;
    for(const m of e.mats){m.transparent=solid?m.userData.tr0:true;m.opacity=solid?m.userData.op0:Math.min(m.userData.op0,e.a);m.depthWrite=solid?m.userData.dw0:false;m.needsUpdate=true;}}}
function pxbTick(){if(!pxbScene.glow)return;pxbSee(1/60);post.uniforms.blurK.value=0;post.uniforms.bloomK.value=Math.min(post.uniforms.bloomK.value,.7);pxPopTick();if(post.uniforms.outl)post.uniforms.outl.value=1;const n=typeof NIGHT==='number'?NIGHT:0,h=(typeof S!=='undefined'?S.time%1440:720)/60,dusk=Math.max(0,Math.min(1,(h-17.6)/1.2)),k=Math.max(n,dusk*.6);
  if(CAFE_PX)CAFE_PX.tick(performance.now()/1000);if(pxbScene._k===k)return;pxbScene._k=k;pxbScene.glow.forEach(m=>m.emissiveIntensity=k*(m.__dim||1.35));PXB_LAMPS.forEach(l=>l.material.color.set(k>.3?'#ffd070':'#e8d8a8'));
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
