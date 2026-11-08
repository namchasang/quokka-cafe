// ---- people: twice the pixels with smooth diagonals, thin outline, soft volume, eye shine ----
function charHD(src){const W=src.width,H=src.height,s=src.getContext('2d').getImageData(0,0,W,H).data,W2=W*2,H2=H*2;
  const key=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return -1;const o=(y*W+x)*4;return s[o+3]<128?-1:(s[o]<<16)|(s[o+1]<<8)|s[o+2];};
  const lum=k=>k<0?1:(((k>>16)&255)*.3+((k>>8)&255)*.59+(k&255)*.11)/255;
  const out=new Int32Array(W2*H2).fill(-1),src2=new Int32Array(W2*H2);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const P=key(x,y),A=key(x,y-1),B=key(x+1,y),C=key(x-1,y),D=key(x,y+1);
    let e0=P,e1=P,e2=P,e3=P;if(C===A&&C!==D&&A!==B)e0=A;if(A===B&&A!==C&&B!==D)e1=B;if(D===C&&D!==B&&C!==A)e2=C;if(B===D&&B!==A&&D!==C)e3=D;
    // never grow transparency into the body or outline into skin: only smooth between solid colours and along the silhouette
    const o=y*2*W2+x*2;out[o]=e0;out[o+1]=e1;out[o+W2]=e2;out[o+W2+1]=e3;src2[o]=src2[o+1]=src2[o+W2]=src2[o+W2+1]=P;}
  const at=(x,y)=>x<0||y<0||x>=W2||y>=H2?-1:out[y*W2+x];
  const isOut=k=>k>=0&&lum(k)<.2;
  const sh=(k,f)=>k<0?k:(Math.min(255,Math.round(((k>>16)&255)*f))<<16)|(Math.min(255,Math.round(((k>>8)&255)*f))<<8)|Math.min(255,Math.round((k&255)*f));
  const res=Int32Array.from(out);
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x,k=out[i];if(k<0)continue;
    const n4=[at(x,y-1),at(x-1,y),at(x+1,y),at(x,y+1)];
    // thin outline: the inner half of a 2px outline takes the colour inside it, a little darker
    if(isOut(k)&&!n4.some(q=>q<0)){const inner=n4.find(q=>q>=0&&!isOut(q));if(inner!==undefined){res[i]=sh(inner,.78);continue;}}
    if(isOut(k))continue;
    // soft volume: light from the top left along the silhouette, shade on the bottom right
    const up=n4[0],lf=n4[1],rt=n4[2],dn=n4[3];
    if((up<0||isOut(up))||(lf<0||isOut(lf)))res[i]=sh(k,1.1);else if((dn<0||isOut(dn))||(rt<0||isOut(rt)))res[i]=sh(k,.88);}
  // rounded shading: each colour patch gets a little lighter at its top and darker at its bottom, dithered at the finer size
  for(let x=0;x<W;x++){let y=0;while(y<H){const k=key(x,y);let e=y;while(e+1<H&&key(x,e+1)===k)e++;const n=e-y+1;
    if(k>=0&&!isOut(k)&&n>=3)for(let yy=y*2;yy<=e*2+1;yy++){const t=(yy-y*2+.5)/(n*2);const f=1.06-.14*t;
      for(const xx of[x*2,x*2+1]){const th=L2_BAYER[((yy&3)*4)+(xx&3)]/16;const i=yy*W2+xx;if(res[i]!==out[i]||res[i]<0||isOut(res[i]))continue;const g=f>1?(th<(f-1)*7?1.06:1):(th<(1-f)*6?.93:1);if(g!==1)res[i]=sh(res[i],g);}}
    y=e+1;}}
  // eye shine: a small dark spot in a light face area gets a white sparkle
  for(let y=1;y<Math.floor(H*.55);y++)for(let x=1;x<W-1;x++){const k=key(x,y);if(k<0||lum(k)>.25)continue;const nb=[key(x,y-1),key(x-1,y),key(x+1,y),key(x,y+1)];if(nb.some(q=>q<0||lum(q)<.42))continue;res[(y*2)*W2+x*2]=0xffffff;}
  const cv=mk(W2,H2),cx=cv.getContext('2d'),id=cx.createImageData(W2,H2),d=id.data;for(let i=0;i<W2*H2;i++){const k=res[i];if(k<0)continue;d[i*4]=(k>>16)&255;d[i*4+1]=(k>>8)&255;d[i*4+2]=k&255;d[i*4+3]=255;}cx.putImageData(id,0,0);return cv;}
// ?px4: one more clean 2x pass over the HD frame (corner smoothing only, the shading is already done)
function epx2(src){const W=src.width,H=src.height,s=src.getContext('2d').getImageData(0,0,W,H).data,W2=W*2,H2=H*2;const k=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return -1;const o=(y*W+x)*4;return s[o+3]<128?-1:(s[o]<<16)|(s[o+1]<<8)|s[o+2];};
  const cv=mk(W2,H2),cx=cv.getContext('2d'),id=cx.createImageData(W2,H2),d=id.data;const put=(x,y,v)=>{if(v<0)return;const i=(y*W2+x)*4;d[i]=(v>>16)&255;d[i+1]=(v>>8)&255;d[i+2]=v&255;d[i+3]=255;};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const P=k(x,y),A=k(x,y-1),B=k(x+1,y),C=k(x-1,y),D=k(x,y+1);let e0=P,e1=P,e2=P,e3=P;
    if(C===A&&C!==D&&A!==B&&A>=0&&P>=0)e0=A;if(A===B&&A!==C&&B!==D&&B>=0&&P>=0)e1=B;if(D===C&&D!==B&&C!==A&&C>=0&&P>=0)e2=C;if(B===D&&B!==A&&D!==C&&D>=0&&P>=0)e3=D;
    put(x*2,y*2,e0);put(x*2+1,y*2,e1);put(x*2,y*2+1,e2);put(x*2+1,y*2+1,e3);}cx.putImageData(id,0,0);return cv;}
// every living thing (people, riders, birds, animals) gets the same pixel density as Kip (Paul, Nov 2026): HD pass, then smooth 2x steps
// until the sprite has at least ~48 pixels per metre on screen (Kip has 56). The world width comes from spriteMesh (opts.__wm).
const CHAR2_ON=true||/[?&#](char2|lab)\b/.test(location.search+location.hash);// Look Lab: people, cyclists, birds and animals at Kip's pixel density
const CHAR_PPM=CHAR2_ON?48:0;
if(LOOK2.on){const _mk=mkFrame;mkFrame=function(f){const had=!!f.m;const r=_mk(f);const wm=f.o&&f.o.__wm;
  if(!had&&f.t&&f.c&&f.c.width<=128&&f.c.width>=4&&((f.c.width>=16&&f.c.height>=20)||(CHAR2_ON&&wm))){f.lo=f.c;let hi=f.c.__hd||(PX4_ON?epx2(charHD(f.c)):charHD(f.c));if(wm)while(hi.width/wm<CHAR_PPM&&hi.width<512)hi=charHD(hi);f.hi=hi;f.t.image=LOOK2.people?f.hi:f.lo;f.t.needsUpdate=true;LOOK2.frames.push(f);}return r;};
  const _sm=spriteMesh;spriteMesh=function(cv,w,h,o){return _sm(cv,w,h,Object.assign({},o||{},{__wm:w}));};}
