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
