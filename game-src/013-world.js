// ---------- world ----------
const LAND={x1:-15,x2:48,z1:-11,z2:14.5};
const DECK={x1:-5.2,x2:5.2,z1:-5,z2:3.6};
const JETTY={x1:-21.4,x2:-12.6,z1:4.5,z2:5.5};
const colliders=[];
function col(x1,z1,x2,z2){colliders.push({x1,z1,x2,z2});}
// ---------- Island Scale: Rottnest is 2.5x bigger ----------
// The island is still built in its original layout, then islandWarp() spreads it out before the first frame.
// Places in a plateau keep their exact layout (the Settlement and café); everything else moves to where it sits
// on the 2.5x island. Small groups of objects (a sign and its post, a kiosk and its stools) move together.
// Old coordinates written in code go through IW() to find their new spot.
const ISL={KX:3,KZ:2,PX:97,PZ:1.7,done:false,cl:[],late:[],plat:[
  {n:'settlement',x:-10,z:1,R:26,T:7}]};
function isS1(x,z){return[ISL.PX+(x-ISL.PX)*ISL.KX,ISL.PZ+(z-ISL.PZ)*ISL.KZ];}
function isPhi(p,r){if(r<=p.R)return 1;if(r>=p.R+p.T)return 0;const t=(r-p.R)/p.T;return 1-t*t*(3-2*t);}
// smooth warp of an original island point
function isW1(x,z){if(x>=99.5)return[x,z];const o=isS1(x,z);for(const p of ISL.plat){const dx=x-p.x,dz=z-p.z,r=Math.hypot(dx,dz);if(r>=p.R+p.T)continue;const f=isPhi(p,r);o[0]+=f*(1-ISL.KX)*dx;o[1]+=f*(1-ISL.KZ)*dz;}return o;}
// inverse warp: where on the original island a new point came from
function isWinv1(X,Z){if(X>=99.5)return[X,Z];const p0=[ISL.PX+(X-ISL.PX)/ISL.KX,ISL.PZ+(Z-ISL.PZ)/ISL.KZ];
  let near=null;for(const p of ISL.plat){const c=isS1(p.x,p.z),D=[c[0]-p.x,c[1]-p.z];const pr=[X-D[0],Z-D[1]];if(Math.hypot(pr[0]-p.x,pr[1]-p.z)<=p.R)return pr;if(Math.hypot(p0[0]-p.x,p0[1]-p.z)<p.R+p.T+1||Math.hypot(pr[0]-p.x,pr[1]-p.z)<p.R+p.T+1){near={p,pr};break;}}
  if(!near)return p0;let q=near.pr,e=isW1(q[0],q[1]),e0=isW1(p0[0],p0[1]);if(Math.hypot(e0[0]-X,e0[1]-Z)<Math.hypot(e[0]-X,e[1]-Z)){q=p0;e=e0;}
  for(let it=0;it<30;it++){const ex=e[0]-X,ez=e[1]-Z,r0=ex*ex+ez*ez;if(r0<1e-8)break;const h=1e-3,a=isW1(q[0]+h,q[1]),b=isW1(q[0],q[1]+h);const j11=(a[0]-e[0])/h,j21=(a[1]-e[1])/h,j12=(b[0]-e[0])/h,j22=(b[1]-e[1])/h,det=j11*j22-j12*j21;if(Math.abs(det)<1e-9)break;
    const sx=(j22*ex-j12*ez)/det,sz=(-j21*ex+j11*ez)/det;let st=1,nq,ne;for(let k=0;k<24;k++){nq=[q[0]-sx*st,q[1]-sz*st];ne=isW1(nq[0],nq[1]);const fx=ne[0]-X,fz=ne[1]-Z;if(fx*fx+fz*fz<r0)break;st*=.5;}q=nq;e=ne;}
  return q;}
// ---------- Real Island (v2): the island takes the real Rottnest outline ----------
// The coast is traced from the real map, one column every 2 map pixels (top = north coast, bot = south coast, in world units).
// Old layout -> real shape: each old column of the island goes to a real column, its north coast to the real north coast and
// its south coast to the real south coast. The Settlement stays its exact size (the plateau) and sits where the real one is.
const RISL={p0:216,dp:2,s:0.21437,X0:94,top:[44.37,43.3,42.87,42.45,42.02,41.59,40.52,39.87,38.37,38.37,38.16,37.94,37.51,30.44,30.44,30.44,30.44,30.44,30.65,31.08,31.51,36.01,36.23,36.66,36.87,37.09,37.3,37.51,37.51,37.51,37.3,37.3,37.09,36.87,36.66,36.01,35.16,28.51,28.51,28.51,28.51,28.51,28.51,28.51,28.73,28.73,28.73,28.51,28.08,27.22,26.15,22.94,22.94,23.15,23.58,23.58,23.37,23.15,22.94,22.51,21.87,21.22,20.79,20.58,20.58,20.58,20.58,20.79,22.51,22.94,23.15,23.37,23.58,23.58,23.79,23.79,24.01,24.01,24.01,24.01,24.01,24.01,24.01,23.79,23.79,23.79,23.79,23.58,23.37,23.37,23.15,22.94,22.72,22.51,22.29,22.08,21.65,21.44,21.22,21.22,21.01,21.01,20.79,20.79,20.37,19.72,19.08,19.08,18.86,18.65,18.65,19.51,19.94,20.15,20.58,21.01,21.65,22.08,22.51,22.72,22.72,22.94,22.94,23.15,23.15,23.15,23.15,23.15,23.15,23.15,23.15,22.94,22.94,22.94,22.94,22.94,22.72,22.72,22.72,22.72,22.72,22.51,22.51,22.29,22.08,21.87,21.65,21.44,21.44,21.22,21.01,20.58,20.15,19.72,19.72,19.72,19.72,19.51,19.51,19.29,18.86,18.44,18.01,17.58,17.15,16.72,16.29,15.86,15.22,13.93,12.65,11.36,10.08,9.43,9,8.57,7.93,7.5,7.07,6.65,6.43,6.22,6,5.79,5.79,5.79,5.79,5.57,5.57,5.57,5.57,5.57,5.57,5.57,5.36,5.36,5.36,5.14,4.93,4.72,4.5,4.07,3.86,3.64,3.43,3,2.57,2.14,1.5,1.07,0,-1.29,-2.57,-5.79,-6.22,-6.86,-7.29,-13.08,-13.72,-14.36,-17.15,-17.79,-17.79,-17.79,-17.58,-17.36,-17.36,-17.58,-17.79,-18.22,-18.65,-18.86,-19.29,-19.72,-27.44,-27.44,-27.44,-27.44,-27.22,-27.01,-26.58,-26.15,-26.15,-26.8,-27.65,-28.73,-29.37,-29.58,-29.58,-29.8,-30.01,-30.23,-30.44,-30.65,-31.08,-31.3,-31.73,-31.94,-32.16,-32.58,-32.58,-32.58,-32.58,-32.37,-32.37,-32.37,-32.58,-32.8,-33.01,-33.01,-33.44,-34.51,-35.37,-36.01,-36.23,-36.23,-36.01,-35.8,-35.59,-35.37,-35.16,-34.94,-34.73,-34.73,-34.94,-34.94,-35.16,-35.37,-35.59,-36.01,-36.23,-36.44,-36.87,-37.09,-37.3,-37.73,-37.94,-38.37,-39.02,-39.44,-40.09,-40.52,-41.16,-42.02,-43.09,-43.73,-45.02,-45.02,-45.02,-44.8,-44.8,-44.8,-44.8,-44.8,-44.8,-45.02,-45.02,-45.02,-45.02,-45.02,-45.02,-45.02,-45.02,-45.02,-45.23,-46.09,-46.73,-47.16,-47.38,-47.59,-47.8,-48.23,-48.45,-48.66,-49.09,-49.52,-49.95,-50.16,-50.59,-51.45,-52.09,-52.73,-53.38,-53.81,-54.02,-54.02,-54.45,-55.31,-55.31,-55.52,-55.52,-55.74,-55.74,-55.74,-55.74,-55.74,-55.74,-55.74,-55.74,-55.74,-55.52,-55.52,-55.31,-55.09,-54.02,-52.52,-51.88,-51.23,-50.59,-50.16,-49.95,-49.52,-49.09,-48.88,-48.88,-49.3,-49.52,-49.52,-49.09,-48.66,-48.45,-48.45,-48.66,-48.66,-48.66,-48.88,-48.88,-48.88,-49.09,-49.09,-47.59,-47.16,-46.95,-46.95,-46.73,-46.73,-46.52,-46.3,-45.88,-45.66,-45.45,-45.23,-44.8,-42.45,-42.02,-41.8,-41.8,-41.59,-41.59,-41.59,-41.59,-41.59,-41.59,-41.8,-41.8,-42.02,-42.23,-42.45,-42.87,-43.3,-43.73,-44.16,-44.59,-45.23,-45.66,-46.73,-56.16,-56.16,-56.16,-56.16,-54.24,-53.81,-53.81,-54.02,-54.24,-54.24,-51.23,-51.02,-51.02,-51.45,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.88,-52.09,-52.09,-52.09,-52.09,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.66,-51.45,-51.45,-51.45,-54.24,-54.88,-55.31,-55.74,-55.95,-56.16,-56.16,-56.16,-56.16,-56.16,-55.95,-55.52,-50.59,-50.16,-50.16,-50.38,-50.59,-51.02,-52.31,-52.31,-52.31,-52.09,-51.88,-51.66,-51.45,-51.23,-51.02,-50.81,-50.59,-50.59,-50.59,-50.59,-50.81,-50.81,-51.02,-51.23,-51.23,-37.94,-36.44,-36.01,-35.8,-33.66,-33.01,-32.58,-32.16,-28.3,-27.44,-27.22,-27.22,-27.22,-27.22,-27.22,-24.01,-23.37,-22.94,-22.72,-22.51,-22.08,-21.87,-21.44,-21.22,-20.79,-20.58,-20.37,-19.94,-19.72,-19.29,-19.08,-18.86,-18.44,-18.22,-17.79,-17.58,-17.36,-16.94,-16.72,-16.51,-16.29,-16.08,-15.86,-15.65,-15.43,-15.22,-15.01,-14.79,-14.58,-14.36,-14.15,-13.93,-13.93,-13.72,-13.51,-13.51,-13.29,-13.08,-13.08,-12.86,-12.65,-12.65,-12.43,-12.43,-12.43,-12.22,-12.22,-12.22,-12,-12,-12,-11.79,-11.79,-11.79,-11.79,-11.79,-11.79,-11.79,-11.58,-11.58,-11.58,-11.58,-11.58,-11.58,-11.58,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36,-11.36],bot:[45.45,46.52,46.95,47.38,47.8,51.23,51.23,51.23,51.23,51.23,51.23,48.23,47.59,47.16,46.95,46.95,47.38,47.59,49.73,49.95,50.16,50.16,50.16,49.95,49.73,49.52,49.52,49.52,49.52,49.52,49.52,49.73,50.16,50.59,51.02,51.45,51.88,52.52,53.16,53.38,53.59,53.81,54.02,54.02,54.24,54.24,53.81,53.38,52.95,52.52,52.09,52.09,51.88,51.88,51.66,51.66,51.45,51.45,51.23,51.23,51.02,45.88,45.23,44.8,44.37,44.16,43.73,43.52,43.09,43.09,43.09,43.09,43.09,43.3,43.3,43.3,43.3,43.52,43.52,43.3,43.3,43.09,43.09,43.09,43.3,43.52,43.95,44.16,44.16,44.16,44.16,44.16,44.37,44.59,44.8,45.02,45.02,45.23,45.45,45.45,45.23,45.23,45.23,44.37,43.95,43.95,43.73,43.73,43.73,43.52,43.52,43.52,43.3,42.87,42.45,42.02,41.8,41.59,41.37,41.37,40.94,35.59,34.08,32.8,31.3,30.44,30.01,29.58,29.15,28.94,28.94,28.73,28.51,28.51,28.3,28.3,28.08,28.08,27.87,27.65,27.01,26.15,25.72,25.72,25.72,25.72,25.72,25.51,25.51,25.51,25.51,25.51,25.51,25.3,25.3,25.08,24.87,24.87,24.65,24.44,24.44,24.44,24.22,24.22,24.22,24.22,24.22,24.22,24.22,24.22,24.22,24.22,24.44,24.44,24.65,24.65,24.87,24.87,25.08,25.08,25.3,25.3,25.3,25.51,25.51,25.72,25.72,25.94,25.94,25.94,25.94,25.94,25.94,26.15,26.37,26.58,26.8,26.8,27.01,27.22,27.44,27.87,28.08,28.3,28.73,28.94,29.15,29.37,29.58,29.8,30.01,30.23,30.23,30.44,30.65,30.87,31.08,31.3,31.51,31.94,32.37,32.8,33.23,33.66,34.51,34.94,34.94,34.73,34.73,34.51,32.16,31.73,31.3,30.87,30.65,30.65,30.44,30.44,30.23,30.23,30.44,30.44,30.65,30.87,31.08,31.3,31.3,31.51,31.94,33.87,33.87,33.87,33.66,33.44,33.44,33.44,33.23,33.23,33.23,33.23,33.01,33.01,33.01,33.01,32.8,32.58,32.37,31.94,31.73,31.3,31.08,30.65,30.23,29.58,28.94,28.51,27.87,27.22,26.8,26.15,25.51,24.87,24.44,24.01,23.79,23.37,23.15,22.94,22.72,22.51,22.51,22.51,22.72,22.72,22.72,22.94,22.94,23.37,24.01,24.44,24.44,20.37,19.94,19.72,19.29,18.44,17.58,17.15,16.72,16.51,16.08,16.08,15.86,15.86,15.86,15.86,15.65,15.65,15.65,15.65,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.43,15.65,15.86,15.86,16.08,16.08,16.29,16.51,16.51,16.51,16.51,16.72,16.72,16.72,16.72,16.94,16.94,17.15,17.36,17.58,17.58,18.01,18.22,18.65,18.86,19.29,19.94,20.58,21.22,21.87,22.29,22.51,22.72,23.15,23.15,23.15,22.94,22.72,22.72,22.51,22.29,22.29,22.29,22.51,22.94,23.15,23.58,23.58,23.79,23.79,24.01,24.01,24.22,24.22,24.44,24.44,24.87,25.08,25.51,25.94,26.37,26.58,27.01,27.44,27.65,28.08,28.73,29.58,30.23,30.87,31.51,32.16,32.8,33.66,35.37,37.51,50.81,50.81,50.59,50.38,50.16,49.95,49.95,49.95,49.95,49.95,49.73,49.52,49.52,49.52,49.95,50.16,50.38,50.59,51.02,52.95,53.16,53.16,53.16,53.38,53.59,53.81,54.02,54.45,54.45,54.45,54.45,54.24,54.24,54.45,54.88,55.31,55.31,45.66,45.02,44.37,43.52,42.87,42.45,41.8,41.16,30.23,28.3,26.8,26.37,25.72,25.3,24.87,24.22,23.79,23.37,22.94,22.51,22.29,21.87,21.65,21.22,20.79,20.37,19.94,19.72,19.51,19.29,19.29,19.08,18.86,18.65,18.44,18.44,18.22,18.01,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,17.79,18.01,18.01,18.01,17.79,17.79,17.58,17.58,17.58,17.36,17.36,17.15,16.72,16.51,16.08,15.86,15.43,15.22,14.79,14.36,13.93,13.72,13.72,13.72,13.51,13.51,13.51,13.51,13.29,13.29,13.29,13.29,13.08,13.08,13.08,12.86,12.86,12.86,12.86,12.86,12.65,12.65,12.65,12.65,12.65,12.86,12.86,12.65,12.43,12.22,12,12,12,12,12,12,12,12.22,12.22,12.22,12.22,12.22,12.22,12.22,12,12,12.22,12.65,12.65,12.65,12.43,12.43,12.43,12.43,12.22,11.58,10.93,10.08,9,8.36,3.22,2.36,1.5,0.86,0,-0.64,-1.29,-2.14,-2.79,-3.43,-4.07,-4.93,-5.57,-6,-6.43,-6.86,-7.5,-7.93,-8.36,-9,-9.43,-9.86,-10.5,-10.93]};RISL.n=RISL.top.length;RISL.k=1/RISL.s;
RISL.SX=1240;RISL.SZ=(300-438)*RISL.s;// the real Settlement on the map
function rislCol(px){const f=clamp((px-RISL.p0)/RISL.dp,0,RISL.n-1.001),i=Math.floor(f),a=f-i;return[RISL.top[i]*(1-a)+RISL.top[i+1]*a,RISL.bot[i]*(1-a)+RISL.bot[i+1]*a];}
const rislX=px=>RISL.X0+(RISL.p0-px)*RISL.s,rislPXof=X=>RISL.p0-(X-RISL.X0)*RISL.k;
// the old island's outline without bays or ripples
function islF0(x,z){const dx=(x-16.5)/32,dz=(z-1.7)/13;const f=1-Math.pow(Math.pow(Math.abs(dx),6)+Math.pow(Math.abs(dz),6),1/6);const ax=(x-72)/26,az=(z-1.2)/7.2;return Math.max(f,(1-Math.pow(Math.pow(Math.abs(ax),4)+Math.pow(Math.abs(az),4),1/4))*.55);}
let RE=null;function rislEdges(){if(RE)return RE;const bis=(f,lo,hi)=>{for(let i=0;i<40;i++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m;}return(lo+hi)/2;};
  const zc=1.5,xE=bis(x=>islF0(x,zc),16.5,-40),xW=bis(x=>islF0(x,zc),16.5,140);const A=[],B=[];for(let x=-40;x<=100;x+=.25){const xx=clamp(x,xE+.05,xW-.05);A.push(bis(z=>islF0(xx,z),zc,-40));B.push(bis(z=>islF0(xx,z),zc,40));}
  RE={xE,xW,A,B};RE.x1=1091;RE.k1=(RE.x1-216)/(xW-23);return RE;}
function rislAB(x){const E=rislEdges(),f=clamp((x+40)/.25,0,E.A.length-1.001),i=Math.floor(f),a=f-i;return[E.A[i]*(1-a)+E.A[i+1]*a,E.B[i]*(1-a)+E.B[i+1]*a];}
// old x -> map column: true scale around the Settlement, stretched along the rest of the island
function rislPX(x){const E=rislEdges();if(x<=23)return RISL.SX+(-10-x)*RISL.k;if(x<=E.xW)return E.x1-(x-23)*E.k1;return 216-(x-E.xW)*2*RISL.k;}
function rislT(x,z){const E=rislEdges(),px=rislPX(x),X=rislX(px),[tp,bt]=rislCol(px),[a,b]=rislAB(x);
  // near the Settlement columns keep true scale across too; further west the old width stretches to the real width
  const w=clamp((E.x1+40-px)/80,0,1),zr=RISL.SZ+(z-1);
  let zt;if(b-a<.5)zt=(tp+bt)/2+(z-(a+b)/2)*2;else if(z<a)zt=tp-(a-z)*2;else if(z>b)zt=bt+(z-b)*2;else{
    // keep beaches near the coast: the first few units in from each coast keep a gentle scale, the middle of the island takes the stretch
    const zm=(a+b)/2,Zm=(tp+bt)/2,side=z<zm,h=side?zm-a:b-zm,H=side?Zm-tp:bt-Zm,u=side?z-a:b-z,kc=Math.min(1.5,H/h),c=Math.min(h*.7,9),
      g=u<=c?u*kc:c*kc+(u-c)*(H-c*kc)/Math.max(.01,h-c);zt=side?tp+g:bt-g;}
  return[X,zr*(1-w)+zt*w];}
function isS(x,z){return rislT(x,z);}
// smooth warp of an original island point (the Settlement plateau moves without stretching)
// whole places that move as one piece to where they really are (Parker Point and Little Salmon Bay to the south point,
// Rottnest Lighthouse to the middle of the island). Points inside move rigidly; nothing outside changes.
ISL.dist=[{n:'parker',x1:59.5,x2:74,z1:4.7,z2:14,D:[-156.5,42.5]},{n:'light',x:33.5,z:-6.3,r:4.6,D:[-73.3,3.5]}];
function islDist(x,z){for(const d of ISL.dist){if(d.r?Math.hypot(x-d.x,z-d.z)<d.r:(x>=d.x1&&x<=d.x2&&z>=d.z1&&z<=d.z2))return d;}return null;}
function isW(x,z){if(x>=99.5)return[x,z];{const d=islDist(x,z);if(d)return[x+d.D[0],z+d.D[1]];}const o=rislT(x,z);for(const p of ISL.plat){const dx=x-p.x,dz=z-p.z,r=Math.hypot(dx,dz);if(r>=p.R+p.T)continue;const f=isPhi(p,r),D=islPlatD(p);o[0]=o[0]*(1-f)+(x+D[0])*f;o[1]=o[1]*(1-f)+(z+D[1])*f;}return o;}
function islPlatD(p){if(!p.D){p.D=[rislX(RISL.SX)-p.x,RISL.SZ-p.z];}return p.D;}
// inverse warp: a coarse table of forward samples gives a start, Newton finishes
let RINV=null;function rislInvTable(){if(RINV)return RINV;const T={x1:-185,z1:-80,W:290,H:160,c:new Map()};
  for(let x=-62;x<99.5;x+=.5)for(let z=-45;z<=46;z+=.5){if(islDist(x,z))continue;const w=isW(x,z),i=Math.floor((w[0]-T.x1)/2),j=Math.floor((w[1]-T.z1)/2);if(i<0||j<0||i>=T.W/2||j>=T.H/2)continue;const k=j*1000+i,c=T.c.get(k);const d=0;if(!c)T.c.set(k,[x,z,w[0],w[1]]);}
  RINV=T;return T;}
function isWinv(X,Z,rough){if(X>=99.5)return[X,Z];for(const d of ISL.dist){const q=[X-d.D[0],Z-d.D[1]];if(islDist(q[0],q[1])===d)return q;}for(const p of ISL.plat){const D=islPlatD(p),pr=[X-D[0],Z-D[1]];if(Math.hypot(pr[0]-p.x,pr[1]-p.z)<=p.R)return pr;}
  const T=rislInvTable(),ci=Math.floor((X-T.x1)/2),cj=Math.floor((Z-T.z1)/2);let best=null,bd=1e9;
  for(let r=0;r<6&&!best;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const c=T.c.get((cj+dj)*1000+ci+di);if(!c)continue;const d=Math.hypot(c[2]-X,c[3]-Z);if(d<bd){bd=d;best=c;}}
  let q=best?[best[0],best[1]]:[clamp(X,-60,99),clamp(Z,-40,40)];if(rough&&best)return q;let e=isW(q[0],q[1]);
  for(let it=0;it<30;it++){const ex=e[0]-X,ez=e[1]-Z,r0=ex*ex+ez*ez;if(r0<1e-8)break;const h=1e-3,a=isW(q[0]+h,q[1]),b=isW(q[0],q[1]+h);const j11=(a[0]-e[0])/h,j21=(a[1]-e[1])/h,j12=(b[0]-e[0])/h,j22=(b[1]-e[1])/h,det=j11*j22-j12*j21;if(Math.abs(det)<1e-9)break;
    const sx=(j22*ex-j12*ez)/det,sz=(-j21*ex+j11*ez)/det;let st=1,nq,ne;for(let k=0;k<24;k++){nq=[q[0]-sx*st,q[1]-sz*st];ne=isW(nq[0],nq[1]);const fx=ne[0]-X,fz=ne[1]-Z;if(fx*fx+fz*fz<r0)break;st*=.5;}q=nq;e=ne;}
  return q;}
// a point from the first bigger island (v1, live in v83-v89) -> the real island
function isFromV1(x,z){const q=isWinv1(x,z),w=isW(q[0],q[1]);return{x:w[0],z:w[1]};}
// the real coast as a signed distance (world units, + on land)
let RSDF=null;function rislSDF(){if(RSDF)return RSDF;const S=2,x1=-180,z1=-70,W=(100-x1)*S,H=(70-z1)*S,M=new Uint8Array(W*H);
  for(let i=0;i<W;i++){const X=x1+(i+.5)/S,px=rislPXof(X);if(px<RISL.p0||px>RISL.p0+RISL.dp*(RISL.n-1))continue;const [tp,bt]=rislCol(px);for(let j=0;j<H;j++){const Z=z1+(j+.5)/S;if(Z>=tp&&Z<=bt)M[j*W+i]=1;}}
  const dt=v=>{const D=new Float32Array(W*H);for(let k=0;k<W*H;k++)D[k]=M[k]===v?0:1e9;const a=1,b=1.414;
    for(let j=0;j<H;j++)for(let i=0;i<W;i++){const k=j*W+i;let d=D[k];if(i>0)d=Math.min(d,D[k-1]+a);if(j>0){d=Math.min(d,D[k-W]+a);if(i>0)d=Math.min(d,D[k-W-1]+b);if(i<W-1)d=Math.min(d,D[k-W+1]+b);}D[k]=d;}
    for(let j=H-1;j>=0;j--)for(let i=W-1;i>=0;i--){const k=j*W+i;let d=D[k];if(i<W-1)d=Math.min(d,D[k+1]+a);if(j<H-1){d=Math.min(d,D[k+W]+a);if(i<W-1)d=Math.min(d,D[k+W+1]+b);if(i>0)d=Math.min(d,D[k+W-1]+b);}D[k]=d;}return D;};
  const Din=dt(0),Dout=dt(1),F=new Float32Array(W*H);for(let k=0;k<W*H;k++)F[k]=M[k]?(Din[k]-.5)/S:-(Dout[k]-.5)/S;
  RSDF={x1,z1,S,W,H,F};return RSDF;}
function rislD(X,Z){const R=rislSDF(),u=(X-R.x1)*R.S-.5,v=(Z-R.z1)*R.S-.5;const i=Math.floor(u),j=Math.floor(v);if(i<0||j<0||i>=R.W-1||j>=R.H-1)return -20;const a=u-i,b=v-j,k=j*R.W+i,F=R.F;return(F[k]*(1-a)+F[k+1]*a)*(1-b)+(F[k+R.W]*(1-a)+F[k+R.W+1]*a)*b;}
// old coordinate written in code -> new coordinate (follows the object group it belongs to)
function IW(x,z){if(!ISL.done||x>=99.5||x<-40||z<-30||z>40)return{x,z};let best=null,ba=1e9;
  for(const c of ISL.cl){if(x<c.x1||x>c.x2||z<c.z1||z>c.z2)continue;const a=(c.x2-c.x1)*(c.z2-c.z1);if(a<ba){ba=a;best=c;}}
  if(best)return{x:x+best.dx,z:z+best.dz};const w=islNudge(x,z,isW(x,z));return{x:w[0],z:w[1]};}
// something that stood on dry land in the old layout but lands in the sea on the real coast walks inland a little
function islNudge(x,z,w){if(x>=99.5)return w;const p=ISL.plat[0];if(Math.hypot(x-p.x,z-p.z)<p.R+p.T)return w;if(islandF(x,z)<.004)return w;let X=w[0],Z=w[1],d=rislD(X,Z);if(d>.7)return w;
  for(let i=0;i<60&&d<.9;i++){const h=.3,gx=rislD(X+h,Z)-rislD(X-h,Z),gz=rislD(X,Z+h)-rislD(X,Z-h),g=Math.hypot(gx,gz)||1;X+=gx/g*.3;Z+=gz/g*.3;d=rislD(X,Z);}return[X,Z];}
function IWx(x,z){return IW(x,z).x;}function IWz(x,z){return IW(x,z).z;}
function iwP(a){if(a&&a.length>=2&&typeof a[0]==='number'){const w=IW(a[0],a[1]);a[0]=w.x;a[1]=w.z;}return a;}
function iwPts(L){L.forEach(iwP);return L;}
function iwO(o,kx,kz){kx=kx||'x';kz=kz||'z';if(o&&typeof o[kx]==='number'&&typeof o[kz]==='number'){const w=IW(o[kx],o[kz]);o[kx]=w.x;o[kz]=w.z;}return o;}
function iwR(r){const cx=(r.x1+r.x2)/2,cz=(r.z1+r.z2)/2;if(cx>=99.5)return r;const w=IW(cx,cz),dx=w.x-cx,dz=w.z-cz;r.x1+=dx;r.x2+=dx;r.z1+=dz;r.z2+=dz;return r;}
// build something in the final island layout (runs after the warp; IW() is live)
function islandLate(fn){ISL.late.push(fn);}
let ISL_GROUND=[];const ISL_WALK=[];const WA={};
// island shape as a signed-distance grid (organic coastline with bays)
const GARDEN={x1:-12.4,x2:-6.2,z1:-2.9,z2:2.3};
const LOTS={bikes:{x:-10.6,z:7.4},ice:{x:8.8,z:6.2},beach:{x:2.6,z:10.4}};
const inGarden=(x,z)=>(x>GARDEN.x1-.6&&x<GARDEN.x2+.6&&z>GARDEN.z1-.6&&z<GARDEN.z2+.6)||Object.values(LOTS).some(l=>Math.hypot(x-l.x,z-l.z)<2.8);
const TB={x1:-24,x2:99,z1:-16,z2:20},GR=4;let GW=(TB.x2-TB.x1)*GR+1,GH=(TB.z2-TB.z1)*GR+1;
const BAYS=[[-9,15.6,4.2],[20,-13.4,3.6],[33,15.8,3],[47.5,10.8,2.4],[2,-13.6,2.4],[60,-6.9,1.9],[67.4,-6.7,1.5],[70.4,9.2,2.3],[82.4,8.6,2.1],[62.5,8.7,1.3],[88.5,-6.4,1.4]];
function islandF(x,z){const dx=(x-16.5)/32,dz=(z-1.7)/13;let f=1-Math.pow(Math.pow(Math.abs(dx),6)+Math.pow(Math.abs(dz),6),1/6);
  {const ax=(x-72)/26,az=(z-1.2)/7.2;const fa=(1-Math.pow(Math.pow(Math.abs(ax),4)+Math.pow(Math.abs(az),4),1/4))*.55;if(fa>f)f=fa;}
  f+=.03*Math.sin(x*.45+z*.2)+.025*Math.sin(z*.8-x*.3)+.018*Math.sin(x*1.3+1.7)+.012*Math.sin(z*1.9+x*.9);
  for(const [bx,bz,br] of BAYS)f=Math.min(f,(Math.hypot(x-bx,z-bz)-br)*.035);return f;}
let Fg=new Float32Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++)Fg[j*GW+i]=islandF(TB.x1+i/GR,TB.z1+j/GR);
let Dg=new Float32Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const k=j*GW+i;const i0=i>0?k-1:k,i1=i<GW-1?k+1:k,j0=j>0?k-GW:k,j1=j<GH-1?k+GW:k;
  const fx=(Fg[i1]-Fg[i0])*GR/((i1-i0)||1),fz=(Fg[j1]-Fg[j0])*GR/(((j1-j0)/GW)||1);Dg[k]=Fg[k]/Math.max(.004,Math.hypot(fx,fz));}
function landD(x,z){const u=(x-TB.x1)*GR,v=(z-TB.z1)*GR;const i=Math.floor(u),j=Math.floor(v);if(i<0||j<0||i>=GW-1||j>=GH-1)return -9;const a=u-i,b=v-j,k=j*GW+i;return(Dg[k]*(1-a)+Dg[k+1]*a)*(1-b)+(Dg[k+GW]*(1-a)+Dg[k+GW+1]*a)*b;}
function hash2(i,j){const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s);}
function vnoise(x,z){const i=Math.floor(x),j=Math.floor(z),fx=x-i,fz=z-j,ux=fx*fx*(3-2*fx),uz=fz*fz*(3-2*fz);const a=hash2(i,j),b=hash2(i+1,j),c=hash2(i,j+1),d=hash2(i+1,j+1);return a+(b-a)*ux+(c-a)*uz+(a-b-c+d)*ux*uz;}
const PATHS=[[[45.4,-3.8],[50,-2.4],[58,-1.4],[68,-.8],[80,-.2],[91,.4]],[[59.4,-1.4],[60.2,-4.2]],[[67.2,-.8],[67.6,-4.2]],[[70.4,-.6],[70.8,5.4]],[[62.5,-1.2],[62.6,5.8]],[[82.2,-.1],[82.6,5.8]],[[56,-1.6],[54.8,.6]],[[15.8,-3.6],[24,-3.4],[36,1.6],[48,2.8],[53,1.8]],[[5,0],[31.4,0]],[[31,.2],[31,-5.2]],[[31,0],[35.4,0]],[[-5.3,3],[-9,4.2],[-12.8,5]],[[-5.4,-1],[-6.2,-6.4],[1.5,-6.6]],[[30.6,-3.6],[26,-7.6],[21,-9.2]],[[35,-.2],[40.5,-2.4],[45.4,-3.8]],[[13,0],[11.6,-4.8]],[[-9,4.2],[-10.4,6.6]],[[7,.4],[8.6,5.2]],[[24,.2],[24,3.6]],[[1.5,-6.6],[5.4,-5.6],[7.6,-3.9]],[[7.6,-3.9],[11.6,-4.8]],[[1.4,3.2],[2.4,9.2]],[[36,1.6],[38.6,7.4]],[[-5.4,-1],[-8.2,-.6]]];
function segD(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az;const t=clamp((wx*vx+wz*vz)/(vx*vx+vz*vz),0,1);return Math.hypot(wx-vx*t,wz-vz*t);}
function pathD(x,z){let d=1e9;for(const p of PATHS)for(let i=0;i<p.length-1;i++)d=Math.min(d,segD(x,z,p[i][0],p[i][1],p[i+1][0],p[i+1][1]));return d;}
// hand-painted ground: grass patches, dry grass, beaches, wet sand, limestone trails, pink salt lake
let TPX=4;const terrC=mk(2,2);terrC.getContext('2d');
const TERR_G=[[92,140,66],[116,160,82],[140,181,98],[160,176,92],[183,186,110]];
// paint ground pixels for rows j0..j1 of an image whose top-left is world (x0,z0), PX pixels per unit
function paintTerrRect(D,W,x0,z0,PX,j0,j1){const G=TERR_G,gx0=Math.round((x0-TB.x1)*PX),gz0=Math.round((z0-TB.z1)*PX);
  for(let j=j0;j<j1;j++){const z=z0+(j+.5)/PX,gj=gz0+j;for(let i=0;i<W;i++){const wx=x0+(i+.5)/PX;const d=landD(wx,z);if(d<=0)continue;const gi=gx0+i;
    const r=hash2(gi*1.37+.5,gj*2.11+.3);const [ox,oz]=islOld(wx,z);const n1=vnoise(wx*.17,z*.17),n2=vnoise(wx*.65+7,z*.65+3);let c;
    const beachW=1.05+.7*vnoise(wx*.3+11,z*.3)+(r-.5)*.35;const zone=d<2.4+n2*1.6&&ox<49&&((oz>9.3+n1*1.2)||(ox>32.3+n1&&oz>3.6+n2));
    const le=Math.min(((ox-42.2)/3.5)**2+((oz+7.5)/1.6)**2,((ox-66.2)/2.6)**2+((oz-2.7)/1.1)**2);const pd=islPD(wx,z);
    const SG=ISL_GROUND.length?islGround(wx,z):null,SL=SG&&SG.g.t==='lake';
    if(le<1||(SL&&SG.e<1))c=r>.93?[250,204,216]:(n2>.6?[244,176,194]:[236,156,178]);
    else if(le<1.38+(r-.5)*.12||(SL&&SG.e<1.38+(r-.5)*.12))c=r<.5?[242,236,224]:[226,214,196];
    else if(pd<.82+(r-.5)*.14)c=pd>.62?[196,186,160]:(r<.04?[182,170,143]:(n2>.55?[228,220,200]:[216,206,184]));
    else if(SG&&!SL&&SG.g.t!=='sand'&&!(SG.g.t!=='tarmac'&&d<beachW)){const t=SG.g.t;if(t==='fairway')c=((Math.floor((SG.u*SG.g.rx+40)/1.6))&1)?[132,196,96]:[146,208,108];else if(t==='green')c=r<.5?[118,198,98]:[126,206,104];else if(t==='bunker')c=r<.5?[240,226,188]:[232,216,176];else c=Math.abs(SG.v)<.08&&((Math.floor((SG.u*SG.g.rx+40)/1.4))&1)?[240,240,232]:(r<.5?[108,112,120]:[118,122,128]);}
    else if(d<beachW||zone||(SG&&SG.g.t==='sand')){if(d<.42)c=[222,214,196];else{const t=n2+(r-.5)*.3;c=t>.62?[253,251,244]:t<.35?[236,230,216]:[246,242,232];if(Math.sin(z*5.3+n1*7+wx*.4)>.93)c=[232,226,212];if(r>.996)c=[255,255,255];else if(r<.003)c=[198,160,120];}}
    else{let t=n1*.62+n2*.38+(r-.5)*.2;if(d<beachW+.8)t+=.18;c=G[t<.32?0:t<.46?1:t<.6?2:t<.72?3:4];
      if(r>.9966)c=[244,220,90];else if(r>.9956)c=[255,255,255];else if(r>.986)c=[176,206,122];else if(r<.014)c=[78,116,56];}
    const b=1+(vnoise(wx*.05+40,z*.05)-.5)*.14;const k=(j*W+i)*4;D[k]=c[0]*b;D[k+1]=c[1]*b;D[k+2]=c[2]*b;D[k+3]=255;}}}
// shallow turquoise water, reefs (A) and surf lines (B); either can be null
function paintWaterRect(A,B,W,x0,z0,PX,j0,j1){for(let j=j0;j<j1;j++){const z=z0+(j+.5)/PX;for(let i=0;i<W;i++){const wx=x0+(i+.5)/PX;const d=landD(wx,z);const k=(j*W+i)*4;const dist=Math.max(0,-d);
    if(A){const t=clamp(dist/5,0,1);let R0=lerp(126,58,t),G0=lerp(228,176,t),B0=lerp(212,204,t);let al=Math.pow(clamp(1-dist/8,0,1),1.3)*.95;
      if(al>0||d>0){const reef=vnoise(wx*.55+3,z*.55+9);const [ox,oz]=islOld(wx,z);const basin=Math.hypot(ox-20,oz+12.8)<3.4;
        if(dist>.6&&(reef>.7||(basin&&vnoise(wx*1.4,z*1.4)>.52))){R0*=.55;G0*=.78;B0*=.82;al=Math.max(al,.55);}}
      if(d>0)al=.95;A[k]=R0;A[k+1]=G0;A[k+2]=B0;A[k+3]=al*255;}
    if(B){const f=d>0||dist>2.6?0:Math.exp(-Math.pow((dist-.22)/.16,2))*.95+Math.exp(-Math.pow((dist-1.05)/.14,2))*.4*(.55+.45*Math.sin(wx*1.1+z*.7))+Math.exp(-Math.pow((dist-2.1)/.12,2))*.18;
      B[k]=255;B[k+1]=255;B[k+2]=250;B[k+3]=clamp(f,0,1)*255;}}}}
function paintTerrain(){const W=terrC.width,H=terrC.height,x=terrC.getContext('2d'),img=x.createImageData(W,H);paintTerrRect(img.data,W,TB.x1,TB.z1,TPX,0,H);x.putImageData(img,0,0);}
let WPX=3;const waterC2=mk(2,2),foamC2=mk(2,2);waterC2.getContext('2d');foamC2.getContext('2d');
function paintWater(){foamC2.getContext('2d').clearRect(0,0,foamC2.width,foamC2.height);const W=waterC2.width,H=waterC2.height,a=waterC2.getContext('2d'),A=a.createImageData(W,H);paintWaterRect(A.data,null,W,TB.x1,TB.z1,WPX,0,H);a.putImageData(A,0,0);}
// sharp ground near Kip: 40-unit tiles painted a few rows per frame, dropped again when far away
const GT={S:40,PX:16,FX:8,R:46,list:[],job:null,foamMats:[]};
function gtInit(){GT.list.forEach(t=>gtDrop(t));GT.list=[];for(let x=TB.x1;x<TB.x2;x+=GT.S)for(let z=TB.z1;z<TB.z2;z+=GT.S){const x2=Math.min(TB.x2,x+GT.S),z2=Math.min(TB.z2,z+GT.S);
    let near=false;for(let a=x;a<=x2&&!near;a+=2)for(let b=z;b<=z2;b+=2)if(landD(a,b)>-3){near=true;break;}if(near)GT.list.push({x1:x,z1:z,x2,z2,st:0});}}
function gtDrop(t){['tm','fm'].forEach(k=>{const m=t[k];if(!m)return;scene.remove(m);m.geometry.dispose();m.material.map.dispose();m.material.dispose();t[k]=null;});const i=GT.foamMats.indexOf(t.fmat);if(i>=0)GT.foamMats.splice(i,1);t.fmat=null;t.st=0;t.c=t.f=null;}
function gtStart(t){const w=Math.round((t.x2-t.x1)*GT.PX),h=Math.round((t.z2-t.z1)*GT.PX),fw=Math.round((t.x2-t.x1)*GT.FX),fh=Math.round((t.z2-t.z1)*GT.FX);
  t.c=mk(w,h);t.cx=t.c.getContext('2d');t.img=t.cx.createImageData(w,h);t.f=mk(fw,fh);t.fx=t.f.getContext('2d');t.fimg=t.fx.createImageData(fw,fh);t.row=0;t.frow=0;t.st=1;}
function gtFinish(t){t.cx.putImageData(t.img,0,0);t.fx.putImageData(t.fimg,0,0);t.img=t.fimg=null;const w=t.x2-t.x1,h=t.z2-t.z1,cx=(t.x1+t.x2)/2,cz=(t.z1+t.z2)/2;
  t.tm=flat(w,h,new THREE.MeshLambertMaterial({map:canvasPlaneTex(t.c,true),alphaTest:.5,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),cx,.002,cz);t.tm.receiveShadow=true;
  t.fmat=new THREE.MeshBasicMaterial({map:canvasPlaneTex(t.f),transparent:true,depthWrite:false});t.fm=flat(w,h,t.fmat,cx,-.105,cz);t.fm.receiveShadow=false;GT.foamMats.push(t.fmat);t.st=2;}
function gtTick(){if(!ISL.done||!GT.list.length)return;const cx=camTarget.x,cz=camTarget.z;if(cx>=100){if(!GT.job)return;}
  const R=GT.R*Math.max(1,zm||1),dist=t=>Math.hypot(Math.max(t.x1-cx,0,cx-t.x2),Math.max(t.z1-cz,0,cz-t.z2));
  for(const t of GT.list)if(t.st&&dist(t)>R+30&&t!==GT.job)gtDrop(t);
  if(!GT.job){let best=null,bd=1e9;for(const t of GT.list){if(t.st)continue;const d=dist(t);if(d<R&&d<bd){bd=d;best=t;}}if(best){gtStart(best);GT.job=best;}else GT.fast=false;}
  const t=GT.job;if(!t)return;const t0=performance.now(),W=t.c.width,H=t.c.height,FW=t.f.width,FH=t.f.height;
  while(performance.now()-t0<(GT.fast?60:5)){if(t.row<H){const n=Math.min(H,t.row+8);paintTerrRect(t.img.data,W,t.x1,t.z1,GT.PX,t.row,n);t.row=n;}else if(t.frow<FH){const n=Math.min(FH,t.frow+8);paintWaterRect(null,t.fimg.data,FW,t.x1,t.z1,GT.FX,t.frow,n);t.frow=n;}else{gtFinish(t);GT.job=null;break;}}
  const op=foam.material.opacity;GT.foamMats.forEach(m=>m.opacity=op);}
const water=flat(640,640,new THREE.MeshLambertMaterial({map:ctex(waterC,{rep:[160,160]})}),70,-.15,2);water.receiveShadow=false;
function canvasPlaneTex(c,nearest){const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;if(nearest){t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}else{t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;}return t;}
let TCX=(TB.x1+TB.x2)/2,TCZ=(TB.z1+TB.z2)/2,TWD=TB.x2-TB.x1,THT=TB.z2-TB.z1;
const shore=flat(TWD,THT,new THREE.MeshBasicMaterial({map:canvasPlaneTex(waterC2),transparent:true,depthWrite:false}),TCX,-.12,TCZ);shore.receiveShadow=false;
const foam=flat(TWD,THT,new THREE.MeshBasicMaterial({map:canvasPlaneTex(foamC2),transparent:true,depthWrite:false}),TCX,-.11,TCZ);foam.receiveShadow=false;
const terrain=flat(TWD,THT,new THREE.MeshLambertMaterial({map:canvasPlaneTex(terrC,true),alphaTest:.5}),TCX,0,TCZ);
flat(1.5,4.4,lmat(deckC,[1,3]),35,.04,2.1);
// café
const deckMat=lmat(deckC,[10,8]);
box(DECK.x2-DECK.x1,.16,DECK.z2-DECK.z1,deckMat,0,.08,(DECK.z1+DECK.z2)/2,{noCast:true});
const wallMat=lmat(wallC,[3,1]);
box(10.4,2.8,.3,wallMat,0,1.56,-4.85);col(-5.2,-5,5.2,-4.6);
box(.3,2.8,2.6,wallMat,-5.05,1.56,-3.6);col(-5.2,-5,-4.85,-2.3);
box(.3,2.8,2.6,wallMat,5.05,1.56,-3.6);col(4.85,-5,5.2,-2.3);
const awn=box(11,.18,3,lmat(awnC,[6,1]),0,3.05,-3.55);awn.rotation.x=.22;
const ctr=box(5.4,.9,.7,lmat(counterC,[3,1]),0,.61,-2.55);col(-2.7,-2.9,2.7,-2.2);
box(5.6,.08,.85,new THREE.MeshLambertMaterial({color:0xd8c4a0}),0,1.1,-2.55);
// stations
box(.62,.55,.45,new THREE.MeshLambertMaterial({color:0xc9ced6}),-1.7,1.42,-2.6);
box(.3,.12,.2,new THREE.MeshLambertMaterial({color:0x2b2b30}),-1.7,1.3,-2.3);
const machineLight=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:0xff5a4a}));machineLight.position.set(-1.5,1.6,-2.36);scene.add(machineLight);
const glass=box(.95,.42,.48,new THREE.MeshLambertMaterial({color:0xd8f2ff,transparent:true,opacity:.45}),0,1.35,-2.6,{noCast:true});
box(.3,.2,.3,new THREE.MeshLambertMaterial({color:0x6a3a22}),-.2,1.25,-2.6);box(.3,.2,.3,new THREE.MeshLambertMaterial({color:0x6a3a22}),.22,1.25,-2.6);
box(.3,.14,.3,new THREE.MeshLambertMaterial({color:0x33333a}),1.7,1.21,-2.6);
const jug=new THREE.Mesh(new THREE.CylinderGeometry(.17,.13,.42,10),new THREE.MeshLambertMaterial({color:0xffb02e,transparent:true,opacity:.85}));jug.position.set(1.7,1.49,-2.6);jug.castShadow=true;scene.add(jug);
// shelves + jars
box(4.6,.08,.35,new THREE.MeshLambertMaterial({color:0x8a5a36}),0,2.0,-4.55);
['#f0c040','#e8735a','#86b86e','#f6ead2','#5cc6d8','#c46ad6'].forEach((c,i)=>box(.28,.36,.24,new THREE.MeshLambertMaterial({color:c}),-1.9+i*.76,2.22,-4.55));
// sign
const signC=mk(96,20);
function drawSign(){const x=signC.getContext('2d');x.fillStyle='#2c3b38';x.fillRect(0,0,96,20);x.fillStyle='#e2c27c';x.fillRect(0,0,96,1);x.fillRect(0,19,96,1);x.fillRect(0,0,1,20);x.fillRect(95,0,1,20);x.fillStyle='#f6ecd6';x.font='bold 12px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('QUOKKA CAFE',48,11);}
drawSign();const signTex=ctex(signC);
const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.75),new THREE.MeshLambertMaterial({map:signTex,emissive:0x333333,emissiveMap:signTex}));sign.position.set(0,2.75,-4.68);scene.add(sign);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{drawSign();signTex.needsUpdate=true;});
// string lights
const bulbs=[];for(let i=0;i<11;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.07,6,6),new THREE.MeshBasicMaterial({color:0xffe9a8}));const x=-5+i;b.position.set(x,2.55-Math.sin(i/10*Math.PI)*.18,-2.05);scene.add(b);bulbs.push(b);}
// tables
const TABLES=[[-3.2,.5],[0,1.4],[3.2,.5]];
const tableMat=new THREE.MeshLambertMaterial({color:0xd9b98a});const legMat=new THREE.MeshLambertMaterial({color:0x5a3a22});const seatMat=new THREE.MeshLambertMaterial({color:0x5a3a22});
const SEATS=[];
TABLES.forEach(([x,z])=>{const top=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.08,14),tableMat);top.position.set(x,.92,z);top.castShadow=top.receiveShadow=true;scene.add(top);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.07,.12,.76,8),legMat);leg.position.set(x,.54,z);leg.castShadow=true;scene.add(leg);col(x-.55,z-.55,x+.55,z+.55);
  [-1,1].forEach(s=>{const st=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.42,10),seatMat);st.position.set(x+s*.88,.37,z-.25);st.castShadow=true;scene.add(st);SEATS.push({x:x+s*.88,z:z-.18,busy:false});});});
