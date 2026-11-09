const OWBAKE_ON=!/[?&#]nobake\b/.test(location.search+location.hash);
const owBakeDec=o=>{const b=atob(o.b64),n=o.w*o.h,a=new Float32Array(n);for(let i=0;i<n;i++){const v=b.charCodeAt(i>>1),q=(i&1)?v&15:v>>4;a[i]=OWBK.lo+q/15*(OWBK.hi-OWBK.lo);}return a;};
const BKM=owBakeDec(OWBK.main);
const bakeMain=(x,z)=>{let u=x-.5,v=z-.5;u=Math.max(0,Math.min(298.999,u));v=Math.max(0,Math.min(198.999,v));const i=u|0,j=v|0,fx=u-i,fz=v-j,k=j*300+i;return (BKM[k]*(1-fx)+BKM[k+1]*fx)*(1-fz)+(BKM[k+300]*(1-fx)+BKM[k+301]*fx)*fz;};
// baked light on the plain (vertex colour) ground
function OWBAKEV(g){if(!OWBAKE_ON)return;const p=g.attributes.position,c=g.attributes.color;for(let k=0;k<p.count;k++){const f=bakeMain(p.getX(k),p.getZ(k));c.setXYZ(k,c.getX(k)*f,c.getY(k)*f,c.getZ(k)*f);}c.needsUpdate=true;}
// baked light on the LOOK2 pixel ground: ordered dither between the 16 light levels, then every ground pixel snaps back onto its own colour ramp
function OWBAKE2(){if(!OWBAKE_ON||!L2||!L2.canvas||!L2.PAL)return;const cv=L2.canvas,W=cv.width,Hh=cv.height,PU=W/WX,g=cv.getContext('2d'),img=g.getImageData(0,0,W,Hh),D=img.data;
  const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],lo=OWBK.lo,hi=OWBK.hi,KK=L2.KK,key=(r,g2,b)=>(r<<16)|(g2<<8)|b,sets=L2.PAL.map(p=>new Set(p.map(c=>key(c[0],c[1],c[2]))));
  for(let py=0;py<Hh;py++){const z=(py+.5)/PU,zr=Math.min(WZ-1,z|0)*WX;for(let px=0;px<W;px++){const x=(px+.5)/PU,ci=zr+Math.min(WX-1,x|0);if(!LAND[ci])continue;
    const lev=(bakeMain(x,z)-lo)/(hi-lo)*15+(BAY[(py&3)*4+(px&3)]-7.5)/16,f=lo+Math.max(0,Math.min(15,Math.round(lev)))/15*(hi-lo);if(Math.abs(f-1)<.03)continue;
    const o=(py*W+px)*4,r=D[o]*f,gg=D[o+1]*f,b=D[o+2]*f,kc=KK[ci],pal=L2.PAL[kc];
    if(pal&&sets[kc].has(key(D[o],D[o+1],D[o+2]))){let best=pal[0],bd=1e9;for(let k=0;k<pal.length;k++){const c=pal[k],dr=r-c[0],dg=gg-c[1],db=b-c[2],dd=dr*dr*.3+dg*dg*.59+db*db*.11;if(dd<bd){bd=dd;best=c;}}D[o]=best[0];D[o+1]=best[1];D[o+2]=best[2];}
    else{D[o]=Math.min(255,r);D[o+1]=Math.min(255,gg);D[o+2]=Math.min(255,b);}}}
  g.putImageData(img,0,0);L2.tex.needsUpdate=true;}
