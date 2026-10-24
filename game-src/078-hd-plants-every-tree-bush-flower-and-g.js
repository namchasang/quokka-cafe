// ---------- HD plants: every tree, bush, flower and grass sprite in every map gets twice the pixels,
// 7 shades with ordered dithering, a sunlit rim, sky gaps through the crown, bark with branches, and sways in the wind ----------
const PLANT_HD={t:{value:0},done:new WeakSet(),mats:new WeakSet(),n:0};
function plantHD(src,isTree){const W=src.width,H=src.height,sx=src.getContext('2d').getImageData(0,0,W,H).data;
  const hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];};
  // sort source pixels: outline / foliage / bark / accent (flowers, berries)
  const T=new Uint8Array(W*H),Lm=new Float32Array(W*H);const hb=new Float32Array(12);
  for(let i=0;i<W*H;i++){const o=i*4;if(sx[o+3]<128)continue;const[h,s,l]=hsl(sx[o],sx[o+1],sx[o+2]);Lm[i]=l;{const x=i%W,y=(i/W)|0;const edge=x===0||y===0||x===W-1||y===H-1||sx[o-1]<128||sx[o+7]<128||sx[o-W*4+3]<128||sx[o+W*4+3]<128;if(l<.2&&edge){T[i]=1;continue;}}if(s>.12&&h>=60&&h<=320)hb[Math.floor(h/30)%12]+=1;}
  let fb=0;for(let i=1;i<12;i++)if(hb[i]>hb[fb])fb=i;const fh=fb*30+15;if(!hb[fb])return null;// fire, signs and other warm things are not plants
  let fl=[1,0];const fol=[];
  for(let i=0;i<W*H;i++){const o=i*4;if(sx[o+3]<128||T[i]===1)continue;const[h,s,l]=hsl(sx[o],sx[o+1],sx[o+2]);let dh=Math.abs(h-fh);dh=Math.min(dh,360-dh);
    if(s>.08&&dh<70){T[i]=2;fol.push(i);fl[0]=Math.min(fl[0],l);fl[1]=Math.max(fl[1],l);}
    else if((h>8&&h<55&&l<.62&&s<.75)||(s<.22&&l<.82))T[i]=3;else T[i]=4;}
  if(fol.length<W*H*.04)return null;// not a plant (or too little leaf to treat)
  // the 7-shade ramp: from the darkest to the lightest leaf colour, cooler in shadow and warmer in the sun
  const pick=f=>{let best=fol[0],bd=9;for(const i of fol){const d=Math.abs(Lm[i]-f);if(d<bd){bd=d;best=i;}}const o=best*4;return[sx[o],sx[o+1],sx[o+2]];};
  const dk=pick(fl[0]),lt=pick(fl[1]);const mix=(a,b,t)=>a.map((v,k)=>Math.round(v+(b[k]-v)*t));
  const RAMP=[];for(let k=0;k<7;k++){const t=k/6;let c=mix(dk.map(v=>v*.78),lt.map(v=>Math.min(255,v*1.12)),t);c=[c[0]+(t-.5)*14,c[1]+(t-.5)*6,c[2]-(t-.5)*16].map(v=>Math.max(0,Math.min(255,Math.round(v))));RAMP.push(c);}
  const OUTC=dk.map(v=>Math.round(v*.5));
  const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  const hash=(a,b)=>{let h=(a*374761393+b*668265263+W*31+H)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;};
  const vn=(x,y,s)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s),fx=x/s-gx,fy=y/s-gy,a=hash(gx,gy),b=hash(gx+1,gy),c=hash(gx,gy+1),d=hash(gx+1,gy+1),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;};
  const W2=W*2,H2=H*2,out=document.createElement('canvas');out.width=W2;out.height=H2;const ox=out.getContext('2d'),img=ox.createImageData(W2,H2),d=img.data;
  // smooth silhouette: bilinear alpha of the source, so diagonal edges get finer steps
  const solidAt=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return 0;return sx[(y*W+x)*4+3]>=128?1:0;};
  const typeAt=(x,y)=>{x=Math.max(0,Math.min(W-1,x));y=Math.max(0,Math.min(H-1,y));return T[y*W+x];};
  const S=new Uint8Array(W2*H2),K=new Uint8Array(W2*H2);
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const fx=(x+.5)/2-.5,fy=(y+.5)/2-.5,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0;
    const a=solidAt(x0,y0)*(1-tx)*(1-ty)+solidAt(x0+1,y0)*tx*(1-ty)+solidAt(x0,y0+1)*(1-tx)*ty+solidAt(x0+1,y0+1)*tx*ty;
    const t0=typeAt(x>>1,y>>1);if(a>=.5||(t0&&t0!==1&&a>.3)){S[y*W2+x]=1;K[y*W2+x]=t0===1?2:t0;}}
  // outline pixels inside the old outline become leaf, so the new outline can be 1px at the finer size
  for(let i=0;i<W2*H2;i++)if(S[i]&&K[i]===1)K[i]=2;
  // distance from the crown edge (for sky gaps)
  const D=new Uint8Array(W2*H2).fill(0);for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x;if(!S[i])continue;let m=9;for(let r=1;r<=6&&m===9;r++){for(const[a,b]of[[r,0],[-r,0],[0,r],[0,-r],[r,r],[-r,-r],[r,-r],[-r,r]]){const X=x+a,Y=y+b;if(X<0||Y<0||X>=W2||Y>=H2||!S[Y*W2+X]){m=r;break;}}}D[i]=m;}
  // bark: find the trunk top and lean two branches up into the crown (seen through the sky gaps)
  let tTop=H2,tx0=W2,tx1=0;for(let y=0;y<H2;y++)for(let x=0;x<W2;x++)if(S[y*W2+x]&&K[y*W2+x]===3){if(y<tTop)tTop=y;tx0=Math.min(tx0,x);tx1=Math.max(tx1,x);}
  const branch=new Uint8Array(W2*H2);const hasTrunk=isTree&&tTop<H2&&tx1-tx0<W2*.5;
  if(hasTrunk){const cx=(tx0+tx1)/2;[[-1,.55],[1,.6],[-.3,.85]].forEach(([dir,len])=>{const L=(tTop)*len;for(let t=0;t<1;t+=.01){const x=Math.round(cx+dir*t*L*.55+Math.sin(t*3)*dir),y=Math.round(tTop+4-t*L);const w=t<.5?2:1;for(let k=0;k<w;k++)if(x+k>=0&&x+k<W2&&y>=0&&y<H2)branch[y*W2+x+k]=1;}});}
  const BARK=(()=>{let r=0,g=0,b=0,n=0;for(let i=0;i<W*H;i++)if(T[i]===3){r+=sx[i*4];g+=sx[i*4+1];b+=sx[i*4+2];n++;}const c=n?[r/n,g/n,b/n]:[107,68,40];return[.5,.72,1,1.25].map(k=>c.map(v=>Math.max(0,Math.min(255,Math.round(v*k)))));})();
  const GAP=new Uint8Array(W2*H2);
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x,o=i*4;if(!S[i])continue;const k=K[i];let c;
    if(k===2){
      // sky gaps: small holes deep inside big crowns
      if(isTree&&W>=28&&D[i]>=4&&vn(x,y,3.4)>.83){GAP[i]=1;if(branch[i]){c=BARK[1];d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255;}continue;}
      const so=(y>>1)*W+(x>>1);const base=(Lm[so]-fl[0])/Math.max(.05,fl[1]-fl[0]);
      const light=((W2-x)/W2*.35+(H2-y)/H2*.65)-.5;
      let v=base*.55+.22+light*.35+(vn(x,y,2.2)-.5)*.45+(vn(x+50,y,6)-.5)*.2;v=Math.max(0,Math.min(.999,v));
      let s=Math.max(0,Math.min(6,Math.floor(v*7+(BAYER[(y&3)*4+(x&3)]/16-.5)*.6)));
      const up=y>0&&S[i-W2]&&K[i-W2]!==3,lf=x>0&&S[i-1]&&K[i-1]!==3;if(!up||!lf)s=Math.min(6,s+2);
      const dn=y<H2-1&&S[i+W2],rt=x<W2-1&&S[i+1];if(!dn||!rt)s=Math.max(0,s-2);if((y>0&&GAP[i-W2])||(x>0&&GAP[i-1]))s=Math.max(0,s-3);
      c=RAMP[s];}
    else if(k===3){const so=(y>>1)*W+(x>>1);const e=(x-tx0)/Math.max(1,tx1-tx0);let s=e<.2?0:e<.5?1:e<.85?2:3;if(hash(x,y>>1)<.2)s=Math.max(0,s-1);if((y+x*3)%7===0)s=Math.max(0,s-1);if(!hasTrunk){s=Math.min(3,Math.max(0,Math.round(Lm[so]*4)-1));}c=BARK[s];}
    else{const so=((y>>1)*W+(x>>1))*4;c=[sx[so],sx[so+1],sx[so+2]];if(!(x&1)&&!(y&1)&&hash(x,y)>.4)c=c.map(v=>Math.min(255,v+40));}
    d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255;}
  // a crisp 1px outline outside the shape (lighter on the sunny top-left)
  const cp=new Uint8ClampedArray(d);for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const o=(y*W2+x)*4;if(cp[o+3]||GAP[y*W2+x])continue;const n=(x<W2-1&&cp[o+7])||(y<H2-1&&cp[o+W2*4+3]),m=(x>0&&cp[o-1])||(y>0&&cp[o-W2*4+3]);if(n||m){const c=n?OUTC:OUTC.map(v=>Math.round(v*1.35));d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255;}}
  ox.putImageData(img,0,0);return out;}
function plantSway(m){if(!m||PLANT_HD.mats.has(m))return;PLANT_HD.mats.add(m);const prev=m.onBeforeCompile;
  m.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);sh.uniforms.uSway=PLANT_HD.t;sh.vertexShader='uniform float uSway;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n{float sw=max(0.,position.y)*max(0.,uv.y-.35);vec4 wp=modelMatrix*vec4(0.,0.,0.,1.);transformed.x+=sin(uSway*1.3+wp.x*.7+wp.z*.43)*.035*sw+sin(uSway*3.1+wp.x)*.008*sw;}');};
  const k=m.customProgramCacheKey?m.customProgramCacheKey():'';m.customProgramCacheKey=()=>k+'|sway';m.needsUpdate=true;}
function plantHDApply(){const tset=new Set(trees.map(t=>t.m.material&&t.m.material.map));
  BB.forEach(o=>{if(o.userData.frames)return;const m=o.material,t=m&&m.map;if(!t||!t.image||t.image.width>96||t.image.width*t.image.height<100)return;if(typeof SIGN_TEX!=='undefined'&&SIGN_TEX.has(t))return;
    if(!PLANT_HD.done.has(t)){PLANT_HD.done.add(t);const hd=plantHD(t.image,tset.has(t)||t.image.height>=24);if(hd){t.__src=t.image;t.image=hd;t.needsUpdate=true;t.isPlant=true;PLANT_HD.n++;}}
    if(t.isPlant){plantSway(m);if(o.customDepthMaterial)plantSway(o.customDepthMaterial);}});
  trees.forEach(tr=>{if(tr.v&&tr.v.f)plantSway(tr.v.f);});}
(function L(){PLANT_HD.t.value=performance.now()/1000;requestAnimationFrame(L);})();
plantHDApply();
if(LOOK2.on){plant2Apply();let _l2t=performance.now();(function L2(){const n=performance.now();plant2Tick((n-_l2t)/1000);_l2t=n;requestAnimationFrame(L2);})();}
