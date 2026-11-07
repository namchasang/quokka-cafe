/* ---------- 2. richer roofs, doors and windows on the town houses the kit skinned ---------- */
function town2Skin(walls,roofs,panes,glow){T2.cur=null;const out={walls:0,hips:0,roofs:0,panes:0,doors:0,chim:0};town2Skin.out=out;
  const tw=walls.filter(W=>W.__t2&&W.o.visible);out.walls=tw.length;const inT=p=>tw.find(W=>p.x>W.box.min.x-.35&&p.x<W.box.max.x+.35&&p.z>W.box.min.z-.35&&p.z<W.box.max.z+.35&&p.y<W.box.max.y+.4);
  const roofKind=c=>{const a=new THREE.Color(c);const h={};a.getHSL(h);return h.s<.22?'slate':(h.h>.18&&h.h<.5)?'tin':(h.h>.5&&h.h<.75)?'slate':'tile';};
  const avg=im=>{try{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height).data;let r=0,g=0,b=0,n=0;for(let q=0;q<d.length;q+=16){r+=d[q];g+=d[q+1];b+=d[q+2];n++;}return'#'+new THREE.Color(r/n/255*1.08,g/n/255*1.08,b/n/255*1.08).getHexString();}catch(e){return'#b8562e';}};
  // hip roofs (made by pxbScene on the house walls): new tile courses, plus a chimney on most houses
  tw.forEach(W=>{W.o.children.forEach(m=>{if(!m.isMesh||!m.__pxSkip||!m.geometry||m.geometry.type!=='BufferGeometry'||!m.material||!m.material.map)return;const base=avg(m.material.map.image),k=roofKind(base);
      const nm=t2Mat('hip|'+base+'|'+k,()=>T2.roof(2,2,{base,kind:k,seed:W.__s%4+1}),{side:THREE.DoubleSide});nm.map.wrapS=nm.map.wrapT=THREE.RepeatWrapping;m.material=nm;out.hips++;
      if(W.h<3.4&&W.__s%3!==0){const p=W.o.geometry.parameters,sx=W.w/p.width,sy=W.h/p.height,sz=W.d/p.depth;const c=new THREE.Mesh(new THREE.BoxGeometry(.26/sx,.8/sy,.26/sz),t2Mat('chim',()=>T2.chimney(.24,.62,'#a8583e')));
        c.position.set((W.__s%2?1:-1)*p.width*.22,p.height/2+.45/sy,-p.depth*.12);c.castShadow=true;c.__pxSkip=1;W.o.add(c);out.chim++;}});});
  // gable prisms, cone and flat roofs that sit on town houses
  const zw=walls.filter(W=>W.__t2||(W.o.visible&&W.box&&t2Zone(t2Local(W.o).x)));zw.forEach(W=>{if(W.__s==null)W.__s=(Math.round(W.box.min.x*3)*7+Math.round(W.box.min.z*5)*13)>>>0;});
  zw.forEach(W=>{const b=W.box;roofs.forEach(R=>{if(!R.o.visible||R.__t2)return;const q=new THREE.Box3().setFromObject(R.o),c=q.getCenter(new THREE.Vector3());if(c.x<b.min.x||c.x>b.max.x||c.z<b.min.z||c.z>b.max.z||q.min.y<b.max.y-.6)return;R.__t2=1;
      const ms=Array.isArray(R.o.material)?R.o.material:[R.o.material];const m0=ms[0];if(!m0||!m0.map||!m0.map.image)return;const base=avg(m0.map.image),k=roofKind(base),im=m0.map.image,ww=im.width/32,hh=im.height/32;
      const nm=t2Mat(['rp',base,k,ww.toFixed(1),hh.toFixed(1),R.kind].join('|'),()=>T2.roof(ww,hh,{base,kind:k,across:R.kind==='prism',seed:W.__s%4+2}));if(Array.isArray(R.o.material)){const a=R.o.material.slice();a[R.kind==='flat'?2:0]=nm;R.o.material=a;}else R.o.material=nm;out.roofs++;
      if(W.__small&&R.kind!=='flat'&&W.__s%3!==0&&R.o.parent){const sz=q.getSize(new THREE.Vector3()),wp=new THREE.Vector3(c.x+(W.__s%2?1:-1)*sz.x*.2,q.min.y+sz.y*.62,c.z-sz.z*.12);const ch=new THREE.Mesh(new THREE.BoxGeometry(.26,.8,.26),t2Mat('chim',()=>T2.chimney(.24,.62,'#a8583e')));
        const par=R.o.parent;par.updateMatrixWorld(true);par.worldToLocal(wp);ch.position.copy(wp);const ws=new THREE.Vector3();par.getWorldScale(ws);ch.scale.set(1/Math.abs(ws.x),1/Math.abs(ws.y),1/Math.abs(ws.z));ch.castShadow=true;ch.__pxSkip=1;par.add(ch);out.chim++;}});});
  // South Perth's little houses fade when Kip walks behind them (SP_FADE), so the kit left them alone: paint them here
  if(typeof SP_FADE!=='undefined')SP_FADE.forEach((f,fi)=>{const cx=(f.x1+f.x2)/2;if(!(cx>100&&cx<250))return;
    const ms=[];f.mats.forEach(m=>ms.push(m));let wall=null,roofM=null;scene.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material)||!ms.includes(o.material))return;if(o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height>1.2)wall=o;else if(o.material.map&&o.material.map.image&&o.material.map.image.width===64)roofM=o.material;});
    if(!wall||wall.geometry.parameters.height>2.6||Math.max(wall.geometry.parameters.width,wall.geometry.parameters.depth)>5)return;let nm=0,sg=false;(wall.parent||wall).traverse(q=>{if(q.isMesh){nm++;if(q.material&&q.material.map&&SIGN_TEX.has(q.material.map))sg=true;}});if(nm>3||sg)return;// plain little houses only: landmarks with signs keep their own look
    let vis=true;for(let p=wall;p;p=p.parent)if(p.visible===false)vis=false;if(!vis)return;const p=wall.geometry.parameters,s=(Math.round(cx*3)*7+fi*13)>>>0;const base=T2.WALLS[s%T2.WALLS.length];
    const face=(fw,k)=>{const o={base,kind:s%3===0?'brick':s%3===1?'board':'plaster',house:true,win:fw>3?2:1,door:k===2||k===0&&fw>3,doorAt:k===2?.5:0,seed:13+k*7+s,num:s%60+1,rows:1,cornice:false,box:k===2};const d=T2.wall(fw,p.height,o),l=T2.wall(fw,p.height,Object.assign({},o,{lit:true}));
      const m=new THREE.MeshLambertMaterial({map:t2Tex(d),emissive:0xffffff,emissiveIntensity:0,emissiveMap:t2Tex(PXK.glowDiff(d,l)),transparent:true,opacity:f.o});PXB_GLOW.push(m);return m;};
    const top=new THREE.MeshLambertMaterial({color:new THREE.Color(T2.sh(base,.7)),transparent:true});const A=[face(p.depth,1),face(p.depth,3),top,top,face(p.width,0),face(p.width,2)];
    const i=f.mats.indexOf(wall.material);if(i>=0)f.mats.splice(i,1);f.mats.push(...A);wall.material=A;wall.__pxSkip=1;out.spRow=(out.spRow||0)+1;
    if(roofM){const old=roofM.map,base2=avg(old.image),k=roofKind(base2);const t=t2Tex(T2.roof(2,2,{base:base2,kind:k,seed:s%4+1}),[old.repeat.x,old.repeat.y]);t.offset.copy(old.offset);roofM.map=t;roofM.needsUpdate=true;}});
  // window and door planes on those walls
  const pm=new Map();panes.forEach(P=>{if(!P.o.visible||!inT(P.pos))return;const W=inT(P.pos);const s=W.__s;
    if(P.door){const w=Math.max(10,Math.round(P.w*32)-6),h=Math.max(16,Math.round(P.h*32)-4),col=T2.DOORS[s%T2.DOORS.length],key='d|'+w+'|'+h+'|'+col+'|'+(s%7);let m=pm.get(key);
      if(!m){const mk=lit=>{const[c,x]=T2.cv(w+6,h+4);T2.P(x,'#e8dcc0',0,0,w+6,h+4);T2.door(x,3,4,w,h-2,{col,lit,lamp:false,step:false,n:null,frame:T2.TRIMS[s%T2.TRIMS.length]});return c;};m=t2Lit(mk(false),mk(true));pm.set(key,m);}P.o.material=m;out.doors++;}
    else{const w=Math.max(8,Math.round(P.w*32)-6),h=Math.max(8,Math.round(P.h*32)-6),key='p|'+w+'|'+h+'|'+(s%5);let m=pm.get(key);
      if(!m){const mk=lit=>{const[c,x]=T2.cv(w+8,h+10);T2.P(x,T2.INK,0,0,w+8,h+10);T2.win(x,4,3,w,h,{lit,room:s%5,lintel:false,frame:T2.TRIMS[s%T2.TRIMS.length]});return c;};m=t2Lit(mk(false),mk(true));pm.set(key,m);}P.o.material=m;out.panes++;}});
  return out;}
/* ---------- 3. quokkas at twice the pixels (Kip, staff, villagers, wild quokkas; every pose and outfit) ----------
   kip32 / kipFB keep their 32 px canvas (menus and previews use it) and hang a 64 px one on it as .__hd, which the
   character pass (mkFrame) uses instead of the automatic 2x. The same drawing code runs on a painter at double size,
   so round volumes are drawn smoothly at 64 px with in-between tones; then fur strands, rim light, glossy eyes,
   blush, a shiny nose, inner ears and toes are added at the finer size. Same world size, same frames. */
function town2Painter(W,H){const S=2,W2=W*S,H2=H*S;const c=document.createElement('canvas');c.width=W2;c.height=H2;const x=c.getContext('2d'),img=x.createImageData(W2,H2),D=img.data,TAG=new Uint8Array(W2*H2);
  const put=(i,j,col,t)=>{if(i<0||j<0||i>=W2||j>=H2)return;const k=(j*W2+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;TAG[j*W2+i]=t||0;};
  const set=(i,j,col)=>{i|=0;j|=0;for(let b=0;b<2;b++)for(let a=0;a<2;a++)put(i*2+a,j*2+b,col,9);};
  const ell=(cx,cy,rx,ry,pal)=>{if(!(rx>0&&ry>0))return;const tag=pal.length===5?1:pal.length===3?2:pal.length===2?3:4;const n=pal.length-1;
    const j0=Math.max(0,Math.floor((cy-ry)*2)),j1=Math.min(H2-1,Math.ceil((cy+ry)*2)),i0=Math.max(0,Math.floor((cx-rx)*2)),i1=Math.min(W2-1,Math.ceil((cx+rx)*2));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=((i+.5)/2-cx)/rx,dy=((j+.5)/2-cy)/ry,d=dx*dx+dy*dy;if(d>1)continue;const l=(-dx*.5-dy*.8)*.55+(1-d)*.55;let kf=clamp((l+.35)/1.3*n,0,n);
      if(d>.8&&((i+j)&1))kf=Math.max(0,kf-.6);let k=Math.floor(kf),f=kf-k;let col=pal[k];
      // in-between tones: the middle of each step blends the two neighbours, the edge of the band is dithered
      if(k<n){if(f>.62)col=pal[k+1];else if(f>.38)col=[0,1,2].map(q=>(pal[k][q]+pal[k+1][q])>>1);else if(f>.3&&((i^j)&1))col=[0,1,2].map(q=>(pal[k][q]*3+pal[k+1][q])>>2);}
      put(i,j,col,tag);}};
  return{set,ell,done:o=>{town2QDetail(D,TAG,W2,H2);x.putImageData(img,0,0);outlineCanvas(c,o||[40,32,28]);town2QRim(c,o||[40,32,28]);return c;}};}
function town2QDetail(D,TAG,W,H){const at=(i,j)=>(j*W+i)*4,op=(i,j)=>i>=0&&j>=0&&i<W&&j<H&&D[at(i,j)+3]>0,col=(i,j)=>{const k=at(i,j);return(D[k]<<16)|(D[k+1]<<8)|D[k+2];};
  const setc=(i,j,c)=>{if(i<0||j<0||i>=W||j>=H)return;const k=at(i,j);D[k]=c[0];D[k+1]=c[1];D[k+2]=c[2];D[k+3]=255;};const mul=(i,j,f,warm)=>{const k=at(i,j);D[k]=Math.min(255,D[k]*f+(warm||0));D[k+1]=Math.min(255,D[k+1]*f+(warm||0)*.6);D[k+2]=Math.min(255,D[k+2]*f);};
  const hs=(i,j)=>{let h=(i*374761393+j*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;};
  const EYE=0x1a1010,WHT=0xffffff,EYB=0x5a3c32,NOSE=0x281812,MOUTH=0x5a3228,CHEEK=0xe89282;
  // fur strands: short darker strokes running down, lighter flecks on the lit side (fur pixels only, never clothes)
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){if(TAG[j*W+i]!==1)continue;const h=hs(i,j);if(h<.085){mul(i,j,.86);if(TAG[(j+1)*W+i]===1)mul(i,j+1,.92);}else if(h>.93&&!op(i-2,j-2))mul(i,j,1.1,6);else if(h>.965)mul(i,j,1.06,3);}
  // rim light along the top-left of the fur, a warm bounce under the belly
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const t=TAG[j*W+i];if(t!==1&&t!==2)continue;if(!op(i-1,j)||!op(i,j-1))mul(i,j,1.14,8);else if(!op(i+1,j)||!op(i,j+1))mul(i,j,.84);}
  // find the painted features (they were set as 2x2 blocks): eyes, nose, mouth, blush
  const seen=new Uint8Array(W*H);const blobs=[];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(seen[j*W+i]||TAG[j*W+i]!==9||D[at(i,j)+3]===0)continue;const c0=col(i,j);if(c0!==EYE&&c0!==NOSE&&c0!==CHEEK&&c0!==MOUTH)continue;
    const q=[[i,j]];seen[j*W+i]=1;const b={c:c0,x0:i,x1:i,y0:j,y1:j,n:0};while(q.length){const[a,e]=q.pop();b.n++;b.x0=Math.min(b.x0,a);b.x1=Math.max(b.x1,a);b.y0=Math.min(b.y0,e);b.y1=Math.max(b.y1,e);
      for(const[da,de]of[[1,0],[-1,0],[0,1],[0,-1]]){const A=a+da,E=e+de;if(A<0||E<0||A>=W||E>=H||seen[E*W+A]||TAG[E*W+A]!==9)continue;const cc=col(A,E);const ok=c0===EYE?(cc===EYE||cc===WHT||cc===EYB):cc===c0;if(ok){seen[E*W+A]=1;q.push([A,E]);}}}
    blobs.push(b);}
  blobs.forEach(b=>{const w=b.x1-b.x0+1,h=b.y1-b.y0+1;
    if(b.c===EYE&&b.n>=8&&w<=6&&h<=8){// glossy eye: dark brown iris, a two-pixel shine, a small lower glint, a lid line and soft corners
      for(let j=b.y0;j<=b.y1;j++)for(let i=b.x0;i<=b.x1;i++)setc(i,j,[30,18,16]);for(let i=b.x0+1;i<b.x1;i++)setc(i,b.y1,[96,58,40]);for(let i=b.x0;i<=b.x1;i++)setc(i,b.y1-1,i===b.x0||i===b.x1?[30,18,16]:[70,42,30]);
      setc(b.x0+1,b.y0+1,[255,255,255]);setc(b.x0+2,b.y0+1,[255,255,255]);setc(b.x0+1,b.y0+2,[255,250,240]);setc(b.x1-1,b.y1-1,[220,190,160]);
      [[b.x0,b.y0],[b.x1,b.y0],[b.x0,b.y1],[b.x1,b.y1]].forEach(([i,j])=>{const k=at(i,j);if(op(i,j))setc(i,j,[Math.min(255,D[k]*0+70),44,30]);});
      for(let i=b.x0;i<=b.x1;i++)if(op(i,b.y0-1)&&TAG[(b.y0-1)*W+i]===1)mul(i,b.y0-1,.66);}
    else if(b.c===NOSE){setc(b.x0,b.y0,[120,84,72]);if(w>2)setc(b.x0+1,b.y0,[90,60,50]);for(let i=b.x0;i<=b.x1;i++)if(op(i,b.y1+1)&&TAG[(b.y1+1)*W+i]!==9)mul(i,b.y1+1,.9);}
    else if(b.c===CHEEK){const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2;for(let j=Math.floor(cy-3);j<=cy+3;j++)for(let i=Math.floor(cx-4);i<=cx+4;i++){if(!op(i,j))continue;const t=TAG[j*W+i];if(t!==1&&t!==2&&!(i>=b.x0&&i<=b.x1&&j>=b.y0&&j<=b.y1))continue;
        const d=((i-cx)/4.2)**2+((j-cy)/3)**2;if(d>1)continue;const k=at(i,j),a=d<.35?.55:.3;D[k]=D[k]*(1-a)+240*a;D[k+1]=D[k+1]*(1-a)+140*a;D[k+2]=D[k+2]*(1-a)+130*a;}setc(Math.round(cx)-1,Math.round(cy)-1,[255,200,190]);}});
  // inner ears: the pink gets a deep shadow at the bottom and a light top
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){if(TAG[j*W+i]!==3)continue;if(TAG[(j+1)*W+i]!==3)mul(i,j,.72);else if(TAG[(j-1)*W+i]!==3)mul(i,j,1.08,10);}
  // toes: the bottom row of each foot gets little dark splits
  for(let i=1;i<W-1;i++){let j=H-1;while(j>0&&!op(i,j))j--;if(j<H*.82||TAG[j*W+i]!==1)continue;if(i%3===0){mul(i,j,.6);mul(i,j-1,.78);}else if(i%3===1)mul(i,j-1,1.08,4);}}
// a softer outline: the outline pixel that touches the body takes the body colour, darkened (like the character pass)
function town2QRim(c,o){const x=c.getContext('2d'),W=c.width,H=c.height,img=x.getImageData(0,0,W,H),d=img.data,src=new Uint8ClampedArray(d);const isO=k=>src[k+3]&&src[k]===o[0]&&src[k+1]===o[1]&&src[k+2]===o[2];
  for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const k=(j*W+i)*4;if(!isO(k))continue;const up=((j-1)*W+i)*4;if(src[up+3]&&!isO(up)&&j>H*.08){const f=.62;d[k]=src[up]*f;d[k+1]=src[up+1]*f;d[k+2]=src[up+2]*f;}}
  x.putImageData(img,0,0);}
function town2Quokka(dir,step,ap,tint,ow){const real=painter;let c=null;painter=function(W,H){return town2Painter(W,H);};
  try{c=dir<0?kip32o(step,ap,tint,ow):kipFBo(dir,step,ap,tint,ow);}finally{painter=real;}return c;}
function pxbScene(){pxbScene.done=true;const T0=performance.now();if(SP2_ON)try{spBuild_sky();}catch(e){console.error(e);}try{pxDeclutter();}catch(e){console.error(e);}if(SEA2_ON)try{sea2Build();}catch(e){console.error(e);}try{pxFixDiamonds();}catch(e){console.error(e);}try{pxbLaneClear();}catch(e){console.error(e);}if(TOWN2_ON)try{town2Thin();}catch(e){console.error(e);}if(HDR_ON)try{hdRottBuild();}catch(e){console.error(e);}if(BLD3_ON){try{pxbBuild_kingstown();}catch(e){console.error(e);}try{pxbBuild_perthstn();}catch(e){console.error(e);}try{pxbBuild_freohotel();}catch(e){console.error(e);}}if(WEL4_ON)try{wel4Build();}catch(e){console.error(e);}if(VP2_ON)try{vp2Build();}catch(e){console.error(e);}const V=new THREE.Vector3(),Q=new THREE.Quaternion(),SC=new THREE.Vector3(),B=new THREE.Box3();scene.updateMatrixWorld(true);
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
  if(TOWN2_ON)try{town2Mark(walls);}catch(e){console.error(e);}walls.forEach((W,i)=>{if(TOWN2_ON)T2.cur=W;const base=TOWN2_ON&&W.__t2?T2.base(W,tileCol(W.o.material)):tileCol(W.o.material),lum=PXK.lum(base);const kind=lum>.84?'stone':lum<.3?'brick':'plaster';
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
    W.o.material=[face(W.d,W.faces[0],1),face(W.d,W.faces[1],3),flat,top,face(W.w,W.faces[4],0),face(W.w,W.faces[5],2)];W.o.castShadow=W.o.receiveShadow=true;nw++;});if(TOWN2_ON)T2.cur=null;
  // a four-sided cone roof is replaced by a proper hip roof cut to the wall it sits on (same footprint plus a small overhang, a gentle pitch)
  walls.forEach(W=>{W.box=new THREE.Box3().setFromObject(W.o);});const RB=new THREE.Box3(),RC=new THREE.Vector3();
  function pxHip(R,base,k){RB.setFromObject(R.o);RB.getCenter(RC);let best=null,bd=1e9;
    for(const W of walls){const b=W.box;if(RC.x<b.min.x||RC.x>b.max.x||RC.z<b.min.z||RC.z>b.max.z)continue;const dy=Math.abs(RB.min.y-b.max.y);if(dy<1&&dy<bd){bd=dy;best=W;}}
    if(!best)return false;if(best.__nc===undefined){best.__nc=roofs.filter(q=>{if(q.kind!=='cone')return false;RB.setFromObject(q.o);const c=RB.getCenter(new THREE.Vector3());const b=best.box;return c.x>b.min.x&&c.x<b.max.x&&c.z>b.min.z&&c.z<b.max.z&&Math.abs(RB.min.y-b.max.y)<1;}).length;RB.setFromObject(R.o);RB.getCenter(RC);}if(best.__nc>1)return false;const W=best,p=W.o.geometry.parameters,sx=W.w/p.width,sy=W.h/p.height,sz=W.d/p.depth,ov=.22;
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
    R.o.visible=false;(pxbScene.hips=pxbScene.hips||[]).push([Math.round(RC.x),Math.round(RC.z),+W.w.toFixed(1),+W.d.toFixed(1),+(RB.max.x-RB.min.x).toFixed(1),+(RB.max.z-RB.min.z).toFixed(1),W.__nc]);return true;}
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
  // a door or window left standing on its own (its house was moved or taken away) goes too
  {const vis=o=>{for(let p=o;p;p=p.parent)if(p.visible===false)return false;return true;};const wb=walls.filter(W=>vis(W.o)).map(W=>W.box||new THREE.Box3().setFromObject(W.o));
    panes.forEach(P=>{if(!vis(P.o))return;const p=P.pos;if(!wb.some(b=>p.x>b.min.x-.4&&p.x<b.max.x+.4&&p.z>b.min.z-.4&&p.z<b.max.z+.4&&p.y<b.max.y+.3))P.o.visible=false;});
    scene.updateMatrixWorld(true);const DB=new THREE.Box3(),DC=new THREE.Vector3();const allW=[];scene.traverse(o=>{if(o.isMesh&&vis(o)&&o.geometry&&(o.geometry.type==='BoxGeometry'||o.geometry.type==='CylinderGeometry')){DB.setFromObject(o);const sz=DB.getSize(DC);if(sz.y>1.2&&Math.max(sz.x,sz.z)>1.4){const bb=DB.clone();bb.__o=o;allW.push(bb);}}});
    let nd=0;scene.traverse(o=>{if(!o.isMesh||!vis(o)||!o.geometry||o.geometry.type!=='PlaneGeometry'||(o.userData&&o.userData.frames&&o.userData.frames.length>1))return;DB.setFromObject(o);const sz=DB.getSize(DC);if(sz.y<.8||sz.y>1.7||Math.max(sz.x,sz.z)>1.3||DB.min.y>.9||Math.min(sz.x,sz.z)>.6||!(o.material&&o.material.map&&o.material.map.image&&o.material.map.image.height>o.material.map.image.width))return;
      const c=DB.getCenter(new THREE.Vector3());if(scene.worldToLocal(c.clone()).x>100)return;const w=allW.find(b=>c.x>b.min.x-.35&&c.x<b.max.x+.35&&c.z>b.min.z-.35&&c.z<b.max.z+.35);if(!w){o.visible=false;nd++;}else PXB_DOORS.push([o,w.__o,w.__o.getWorldPosition(new THREE.Vector3())]);});window.__orphanDoors=nd;}
  if(TOWN2_ON)try{town2Skin(walls,roofs,panes,glowMats);}catch(e){console.error(e);}PXB_GLOW.push(...glowMats);pxbScene.glow=PXB_GLOW;try{pxOneLook();}catch(e){console.error(e);}pxbScene.stats={walls:nw,roofs:nr,panes:np,mats:cache.size,hd:nh,ms:Math.round(performance.now()-T0),one:pxOneLook.stats,hips:pxbScene.hips};window.__pxbStats=pxbScene.stats;if(typeof CBD!=='undefined'&&CBD.cut)CBD.cut.forEach(e=>{e.ready=false;});
  // Victoria Park shop fronts (painted from Paul's photos): real shop glass with goods behind it and a panelled door, both lit at night
  if(typeof VP_SHOPS!=='undefined'&&typeof REF_ON!=='undefined'&&REF_ON)VP_SHOPS.forEach((sh,i)=>{if(sh.id==='bkk'||sh.id==='pub')return;const h=sh.id==='kmax'?4.4:3,w=5.2,z=sh.z+1.71+.015;
    const gw=w*.58,gh=h*.5-.42,gx=sh.x-w/2+w*.08+gw/2,gy=.3+gh/2;const gm=pxGlassMat(['#4a6a86','#5a7a86','#4e6a7e'][i%3],gw,gh);const g=new THREE.Mesh(new THREE.PlaneGeometry(gw,gh),gm);g.position.set(gx,gy,z);g.__pxSkip=1;scene.add(g);
    const dw=w*.16,dh=h*.5-.3,dcol=['#2f5a46','#6a2a2a','#1d3a6e','#3a3e48','#7a4a2a'][i%5];const dk='vpd|'+dcol;let dm=cache.get(dk);if(!dm){const day=PXK.doorPane(dcol,Math.round(dw*32)-6,Math.round(dh*32)-4);dm=new THREE.MeshLambertMaterial({map:ctex(day)});cache.set(dk,dm);}
    const d=new THREE.Mesh(new THREE.PlaneGeometry(dw,dh),dm);d.position.set(sh.x-w/2+w*.78,.25+dh/2,z);d.__pxSkip=1;scene.add(d);});
  // buildings outside the city fade when they stand between the camera and Kip (the city has its own)
  {const cutG=new Set(typeof CBD!=='undefined'&&CBD.cut?CBD.cut.map(e=>e.g):[]);const inCut=o=>{for(let p=o;p;p=p.parent)if(cutG.has(p))return true;return false;};const seen=new Set();PXB_SEE.length=0;
    walls.forEach(W=>{if(inCut(W.o))return;const par=W.o.parent;const root=par&&par!==scene&&par.children.length<=40?par:W.o;if(seen.has(root))return;seen.add(root);
      const objs=[root];if(root===W.o)roofs.forEach(R=>{RB.setFromObject(R.o);RB.getCenter(RC);if(RC.x>W.box.min.x&&RC.x<W.box.max.x&&RC.z>W.box.min.z&&RC.z<W.box.max.z&&RC.y>W.box.max.y-.5)objs.push(R.o);});
      const box=new THREE.Box3();objs.forEach(o=>box.expandByObject(o));PXB_SEE.push({objs,box,a:1,mats:null});});}
  if(rt.depthTexture&&post.uniforms.outl){post.uniforms.tDepth.value=rt.depthTexture;post.uniforms.outl.value=1;post.uniforms.nf.value.set(camera.near,camera.far);}}
const PXB_DOORS=[],PXB_SEE=[],_pxR=new THREE.Ray(),_pxP=new THREE.Vector3(),_pxV=new THREE.Vector3();
function pxbSee(dt){if(!PXB_SEE.length||typeof player==='undefined')return;const k=Math.min(1,(dt||.016)*6);
  for(const e of PXB_SEE){const c=e.box;_pxP.set(player.x,0,player.z);scene.localToWorld(_pxP);if(_pxP.x<c.min.x-30||_pxP.x>c.max.x+30||_pxP.z<c.min.z-30||_pxP.z>c.max.z+30){if(e.a===1)continue;}
    let hit=false;for(const hy of[.4,1.1]){_pxP.set(player.x,hy,player.z);scene.localToWorld(_pxP);_pxR.origin.copy(camera.position);_pxR.direction.copy(_pxP).sub(camera.position);const L=_pxR.direction.length();_pxR.direction.normalize();
      const q=_pxR.intersectBox(c,_pxV);if(q&&camera.position.distanceTo(q)<L-.3&&!(_pxP.x>c.min.x&&_pxP.x<c.max.x&&_pxP.z>c.min.z&&_pxP.z<c.max.z)){hit=true;break;}}
    const tg=hit?.28:1;if(Math.abs(e.a-tg)<.005)continue;
    if(!e.mats){e.mats=[];const cl=m=>{const c2=m.clone();c2.userData.op0=m.opacity;c2.userData.tr0=m.transparent;c2.userData.dw0=m.depthWrite;if(PXB_GLOW.includes(m))PXB_GLOW.push(c2);e.mats.push(c2);return c2;};
      e.objs.forEach(o=>o.traverse(x=>{if(!x.isMesh||!x.material)return;x.material=Array.isArray(x.material)?x.material.map(cl):cl(x.material);}));pxbScene._k=-1;}
    e.a+=(tg-e.a)*k;if(Math.abs(e.a-tg)<.01)e.a=tg;const solid=e.a>.995;
    for(const m of e.mats){m.transparent=solid?m.userData.tr0:true;m.opacity=solid?m.userData.op0:Math.min(m.userData.op0,e.a);m.depthWrite=solid?m.userData.dw0:false;m.needsUpdate=true;}}}
function pxbDoorsTick(){const now=performance.now();if(pxbDoorsTick.t&&now-pxbDoorsTick.t<700)return;pxbDoorsTick.t=now;const vis=o=>{for(let p=o;p;p=p.parent)if(p.visible===false)return false;return true;};const W=new THREE.Vector3();for(const e of PXB_DOORS){const[d,w,p0]=e;const v=vis(w);if(d.visible!==v)d.visible=v;w.updateWorldMatrix(true,false);w.getWorldPosition(W);if(W.distanceToSquared(p0)>1e-4){const a=d.parent.worldToLocal(W.clone()),b=d.parent.worldToLocal(p0.clone());d.position.add(a.sub(b));p0.copy(W);}}}
function pxbTick(){if(!window.__owgo&&running&&!overlay&&typeof openWorld==='function'&&/[?&#]owgo\b/.test(location.search+location.hash)){window.__owgo=1;setTimeout(()=>{const z=zoneOf(player.x);openWorld(z==='island'?'freo':z,'e');},1500);}if(window.FREO_FOUNTAIN&&zoneOf(player.x)==='freo')try{FREO_FOUNTAIN(performance.now()/1000);}catch(e){}if(DET2_ON&&!det2Build.done){det2Build.done=1;try{det2Build();}catch(e){console.error(e);}}if(DET2_ON&&det2Build.tick)try{det2Build.tick(performance.now()/1000);}catch(e){}pxbDoorsTick();if(SP2_ON&&spBuild_sky.tick)try{spBuild_sky.tick(performance.now()/1000);}catch(e){}if(SEA2_ON)try{sea2Tick(1/60);}catch(e){}if(!pxbScene.glow)return;pxbSee(1/60);post.uniforms.blurK.value=0;post.uniforms.bloomK.value=Math.min(post.uniforms.bloomK.value,.7);pxPopTick();if(post.uniforms.outl)post.uniforms.outl.value=1;const n=typeof NIGHT==='number'?NIGHT:0,h=(typeof S!=='undefined'?S.time%1440:720)/60,dusk=Math.max(0,Math.min(1,(h-17.6)/1.2)),k=Math.max(n,dusk*.6);
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

