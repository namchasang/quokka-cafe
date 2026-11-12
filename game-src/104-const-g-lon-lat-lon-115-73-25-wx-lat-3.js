const G=(lon,lat)=>[(lon-115.73)/.25*WX,(lat+31.928)/-.144*WZ];
const LAND=new Uint8Array(WX*WZ);{const b=atob(REAL.land);for(let i=0;i<WX*WZ;i++){const x=i%WX,z=(i/WX)|0;let n=0;for(const[dx,dz]of[[0,0],[1,0],[0,1],[1,1]]){const j=(2*z+dz)*600+2*x+dx;n+=(b.charCodeAt(j>>3)>>(7-(j&7)))&1;}LAND[i]=n>=3?1:0;}}
const ELEV=new Float32Array(REAL.hw*REAL.hh);{const b=atob(REAL.elev);for(let i=0;i<ELEV.length;i++)ELEV[i]=b.charCodeAt(i)/2-40;}
const elevAt=(x,z)=>{x=Math.max(0,Math.min(REAL.hw-1.001,x-.5));z=Math.max(0,Math.min(REAL.hh-1.001,z-.5));const x0=x|0,z0=z|0,fx=x-x0,fz=z-z0,i=z0*REAL.hw+x0,W2=REAL.hw;return (ELEV[i]*(1-fx)+ELEV[i+1]*fx)*(1-fz)+(ELEV[i+W2]*(1-fx)+ELEV[i+W2+1]*fx)*fz;};
const landAt=(x,z)=>{if(z<0&&NORTH)return NORTH.land(x,z);if(z>=WZ&&SOUTH)return SOUTH.land(x,z);x|=0;z|=0;return x>=0&&z>=0&&x<WX&&z<WZ&&LAND[z*WX+x]===1;};
// owroads2 (Paul, Nov 2026): Elizabeth Quay, a small inlet cut into the city shore with its mouth on Perth Water
const EQB=(()=>{const c=G(115.8578,-31.9588);return{x:c[0]+.2,z:c[1]-.2,rx:2.5,rz:1.7};})();
if(OWR2)for(let z=Math.floor(EQB.z-3);z<=EQB.z+4;z++)for(let x=Math.floor(EQB.x-3);x<=EQB.x+3;x++){const dx=(x+.5-EQB.x)/EQB.rx,dz=(z+.5-EQB.z)/EQB.rz;if(dx*dx+dz*dz<1||(Math.abs(x+.5-EQB.x)<.8&&z+.5>EQB.z&&z+.5<EQB.z+4))LAND[z*WX+x]=0;}
// distance to the shore (both sides)
const DL=new Float32Array(WX*WZ).fill(1e9),DW=new Float32Array(WX*WZ).fill(1e9);
(()=>{const bfs=(D,src)=>{const q=[];for(let i=0;i<WX*WZ;i++)if(src(i)){D[i]=0;q.push(i);}for(let h=0;h<q.length;h++){const i=q[h],x=i%WX,z=(i/WX)|0;for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz;if(nx<0||nz<0||nx>=WX||nz>=WZ)continue;const j=nz*WX+nx;if(D[j]>D[i]+1){D[j]=D[i]+1;q.push(j);}}}};
  bfs(DL,i=>!LAND[i]);bfs(DW,i=>LAND[i]);})();
if(OWR2)for(let z=Math.floor(EQB.z-3);z<=EQB.z+4;z++)for(let x=Math.floor(EQB.x-3);x<=EQB.x+3;x++){const i=z*WX+x;if(!LAND[i])DW[i]=Math.max(DW[i],3.5);}// the quay basin is deep, dark water (not shore foam)
// ---------- noise ----------
const R=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(1829);
const P=new Uint8Array(512);for(let i=0;i<256;i++)P[i]=i;for(let i=255;i>0;i--){const j=(R()*(i+1))|0;[P[i],P[j]]=[P[j],P[i]];}for(let i=0;i<256;i++)P[i+256]=P[i];
const fade=t=>t*t*t*(t*(t*6-15)+10),lerp=(a,b,t)=>a+(b-a)*t,grad=(h,x,y)=>((h&1)?-x:x)+((h&2)?-y:y);
const noise=(x,y)=>{const X=Math.floor(x)&255,Y=Math.floor(y)&255;x-=Math.floor(x);y-=Math.floor(y);const u=fade(x),v=fade(y),a=P[X]+Y,b=P[X+1]+Y;return lerp(lerp(grad(P[a],x,y),grad(P[b],x-1,y),u),lerp(grad(P[a+1],x,y-1),grad(P[b+1],x-1,y-1),u),v);};
const fbm=(x,y)=>noise(x,y)*.6+noise(x*2.1,y*2.1)*.28+noise(x*4.3,y*4.3)*.12;
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
// ---------- height ----------
const HG=new Float32Array(WX*WZ);
for(let z=0;z<WZ;z++)for(let x=0;x<WX;x++){const i=z*WX+x;let h;
  if(LAND[i]){const d=DL[i],m=Math.max(0,elevAt(x,z));h=.45+Math.min(d,3)*.1+Math.min(m,70)*.045*ss(0,4,d)+(fbm(x*.03,z*.03))*.15;}// real ground, 1 m ≈ .045 units: hills stay gentle
  else{h=-.8-Math.min(DW[i],12)*.12;}
  HG[i]=h;}
// owroads2 (Paul, Nov 2026): protected areas. Once set, later map passes (rescale, road rebuilds, smoothing, thinning, new layers)
// must skip these boxes: the Perth CBD with Elizabeth Quay, the Swan River at Perth Water, and South Perth (see CLAUDE.md)
const OW_PROTECT=[{n:'Perth CBD',a:G(115.843,-31.947),b:G(115.872,-31.9605)},{n:'Swan River (Perth Water)',a:G(115.842,-31.956),b:G(115.882,-31.972)},{n:'South Perth',a:G(115.842,-31.966),b:G(115.872,-31.982)}];
const owProtected=(x,z,m)=>{m=m||0;return OW_PROTECT.some(r=>x>=r.a[0]-m&&x<=r.b[0]+m&&z>=r.a[1]-m&&z<=r.b[1]+m);};
// smoother ground (owroads2): two gentle blur passes over the land, not at the shore and not in the protected areas
if(OWR2){const T2=new Float32Array(HG);for(let pass=0;pass<6;pass++){T2.set(HG);for(let z=1;z<WZ-1;z++)for(let x=1;x<WX-1;x++){const i=z*WX+x;if(!LAND[i]||DL[i]<3||owProtected(x,z,2))continue;let s=0,n=0;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const j=i+dz*WX+dx;if(LAND[j]){s+=T2[j]*(dx||dz?1:2);n+=dx||dz?1:2;}}HG[i]=s/n;}}}
const H=(x,z)=>{if(z<0&&NORTH)return NORTH.H(x,z);if(z>WZ&&SOUTH)return SOUTH.H(x,z);x=Math.max(0,Math.min(WX-1.001,x));z=Math.max(0,Math.min(WZ-1.001,z));const x0=x|0,z0=z|0,fx=x-x0,fz=z-z0,i=z0*WX+x0;return lerp(lerp(HG[i],HG[i+1],fx),lerp(HG[i+WX],HG[i+WX+1],fx),fz);};
// ---------- North extension (Look Lab, Paul Nov 2026): drive from Perth CBD up the coast to Lancelin, the Pinnacles and Cervantes ----------
// Real coastline and elevation (Terrain Tiles on AWS, z12) in a straightened corridor joined to the north edge of the map (z<0):
// real scale (1 unit = 40 m) to Lancelin, 1.25x stretched beyond it, so the drive is about 2.5 min to Lancelin and 1.5 min more to the Pinnacles.
// 4-unit height grid; the ground is drawn by a pixel shader (dithered 7-tone ramps at 3 px per unit, like LOOK2).
// Terrain light baked in Blender (Cycles): sun with cast shadows (dune lee sides) + sky occlusion (valleys, foot of dunes), 16 levels, for both parts of the map.
var NORTH=null;
