// ---------- 2. geometry: merged per chunk (base = far + near, detail = near only), one atlas material ----------
function GB(){this.P=[];this.N=[];this.U=[];this.C=[];this.I=[];}
GB.prototype.poly=function(pts,uvs,c){const b=this.P.length/3,a=pts[0],p=pts[1],q=pts[2];const ux=p[0]-a[0],uy=p[1]-a[1],uz=p[2]-a[2],vx=q[0]-a[0],vy=q[1]-a[1],vz=q[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
  for(let k=0;k<pts.length;k++){const t=pts[k];this.P.push(t[0],t[1],t[2]);this.N.push(nx,ny,nz);this.U.push(uvs[k][0],uvs[k][1]);this.C.push(c,c,c*.98);}
  for(let k=1;k<pts.length-1;k++)this.I.push(b,b+k,b+k+1);};
const rq=r=>[[r[0],r[1]],[r[2],r[1]],[r[2],r[3]],[r[0],r[3]]];
const rsub=(r,u0,v0,u1,v1)=>[r[0]+(r[2]-r[0])*u0,r[1]+(r[3]-r[1])*v0,r[0]+(r[2]-r[0])*u1,r[1]+(r[3]-r[1])*v1];
// a frame: origin x,y,z and a turn th about y (local +z = the front)
const FR=(x,y,z,th,c)=>({x,y,z,c:Math.cos(th),s:Math.sin(th),k:c==null?1:c});
const W3=(F,lx,ly,lz)=>[F.x+lx*F.c+lz*F.s,F.y+ly,F.z-lx*F.s+lz*F.c];
function box(g,F,lx,ly,lz,w,h,d,u,k){const x0=lx-w/2,x1=lx+w/2,z0=lz-d/2,z1=lz+d/2,y0=ly,y1=ly+h,c=F.k*(k||1);
  const V=(a,b,e)=>W3(F,a,b,e);
  if(u.f)g.poly([V(x0,y0,z1),V(x1,y0,z1),V(x1,y1,z1),V(x0,y1,z1)],rq(u.f),c);
  if(u.b)g.poly([V(x1,y0,z0),V(x0,y0,z0),V(x0,y1,z0),V(x1,y1,z0)],rq(u.b),c*.9);
  if(u.r)g.poly([V(x1,y0,z1),V(x1,y0,z0),V(x1,y1,z0),V(x1,y1,z1)],rq(u.r),c*.95);
  if(u.l)g.poly([V(x0,y0,z0),V(x0,y0,z1),V(x0,y1,z1),V(x0,y1,z0)],rq(u.l),c*.95);
  if(u.t)g.poly([V(x0,y1,z1),V(x1,y1,z1),V(x1,y1,z0),V(x0,y1,z0)],rq(u.t),c);}
const all=r=>({f:r,b:r,l:r,r:r,t:r});
// hip roof over a w x d plan at height ly; uv rows run along the eaves (v=0) up to the ridge (v=1)
function hip(g,F,lx,ly,lz,w,d,rise,r,k){const c=F.k*(k||1),V=(a,b,e)=>W3(F,lx+a,ly+b,lz+e);
  if(w>=d){const a=(w-d)/2,hw=w/2,hd=d/2,E1=V(-hw,0,hd),E2=V(hw,0,hd),E3=V(hw,0,-hd),E4=V(-hw,0,-hd),R1=V(-a,rise,0),R2=V(a,rise,0),U=(u,v)=>[r[0]+(r[2]-r[0])*u,r[1]+(r[3]-r[1])*v];
    g.poly([E1,E2,R2,R1],[U(0,0),U(1,0),U((hw+a)/w,1),U((hw-a)/w,1)],c);g.poly([E3,E4,R1,R2],[U(0,0),U(1,0),U((hw+a)/w,1),U((hw-a)/w,1)],c*.82);
    g.poly([E2,E3,R2],[U(0,0),U(d/w,0),U(d/2/w,1)],c*.92);g.poly([E4,E1,R1],[U(0,0),U(d/w,0),U(d/2/w,1)],c*.92);}
  else{const a=(d-w)/2,hw=w/2,hd=d/2,E1=V(-hw,0,hd),E2=V(hw,0,hd),E3=V(hw,0,-hd),E4=V(-hw,0,-hd),R1=V(0,rise,a),R2=V(0,rise,-a),U=(u,v)=>[r[0]+(r[2]-r[0])*u,r[1]+(r[3]-r[1])*v];
    g.poly([E2,E3,R2,R1],[U(0,0),U(1,0),U((hd+a)/d,1),U((hd-a)/d,1)],c*.92);g.poly([E4,E1,R1,R2],[U(0,0),U(1,0),U((hd+a)/d,1),U((hd-a)/d,1)],c*.92);
    g.poly([E1,E2,R1],[U(0,0),U(w/d,0),U(w/2/d,1)],c);g.poly([E3,E4,R2],[U(0,0),U(w/d,0),U(w/2/d,1)],c*.82);}}
// gable roof (ridge along x) with painted gable ends
function gableR(g,F,lx,ly,lz,w,d,rise,r,gu,k){const c=F.k*(k||1),V=(a,b,e)=>W3(F,lx+a,ly+b,lz+e),hw=w/2,hd=d/2;
  g.poly([V(-hw,0,hd),V(hw,0,hd),V(hw,rise,0),V(-hw,rise,0)],rq(r),c);g.poly([V(hw,0,-hd),V(-hw,0,-hd),V(-hw,rise,0),V(hw,rise,0)],rq(r),c*.82);
  const U=(u,v)=>[gu[0]+(gu[2]-gu[0])*u,gu[1]+(gu[3]-gu[1])*v];g.poly([V(hw,0,hd),V(hw,0,-hd),V(hw,rise,0)],[U(0,0),U(1,0),U(.5,1)],c*.9);g.poly([V(-hw,0,-hd),V(-hw,0,hd),V(-hw,rise,0)],[U(0,0),U(1,0),U(.5,1)],c*.9);}
function cyl(g,F,lx,ly,lz,r,h,n,us,ut,k){const c=F.k*(k||1);for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283,p0=[lx+Math.cos(a0)*r,lz+Math.sin(a0)*r],p1=[lx+Math.cos(a1)*r,lz+Math.sin(a1)*r];
    g.poly([W3(F,p1[0],ly,p1[1]),W3(F,p0[0],ly,p0[1]),W3(F,p0[0],ly+h,p0[1]),W3(F,p1[0],ly+h,p1[1])],[[us[0]+(us[2]-us[0])*(i+1)/n,us[1]],[us[0]+(us[2]-us[0])*i/n,us[1]],[us[0]+(us[2]-us[0])*i/n,us[3]],[us[0]+(us[2]-us[0])*(i+1)/n,us[3]]],c*(.85+.15*Math.cos(a0-2)));
    if(ut)g.poly([W3(F,lx,ly+h,lz),W3(F,p1[0],ly+h,p1[1]),W3(F,p0[0],ly+h,p0[1])],[[(ut[0]+ut[2])/2,(ut[1]+ut[3])/2],[ut[0],ut[1]],[ut[2],ut[1]]],c);}}
// a flat patch that follows the ground (n x m quads), uv over the whole patch
function patch(g,F,x0,z0,x1,z1,yo,r,k,nx,nz){nx=nx||1;nz=nz||1;const c=F.k*(k||1),pts=[];for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const lx=x0+(x1-x0)*i/nx,lz=z0+(z1-z0)*j/nz,w=W3(F,lx,0,lz);w[1]=gy(w[0],w[2])+yo;pts.push(w);}
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,u0=r[0]+(r[2]-r[0])*i/nx,u1=r[0]+(r[2]-r[0])*(i+1)/nx,v0=r[1]+(r[3]-r[1])*j/nz,v1=r[1]+(r[3]-r[1])*(j+1)/nz;
    g.poly([pts[a],pts[a+1],pts[a+nx+2],pts[a+nx+1]],[[u0,v0],[u1,v0],[u1,v1],[u0,v1]],c);}}
// a strip along a polyline (streets, walls on the ground); the texture repeats every tl units
// streets leave the atlas (Paul, Nov 2026): every street kind has its own kit texture (crisp near, mip-mapped far), merged per 96-unit region,
// each vertex on its own ground height, on fixed layers so nothing z-fights: lane .04, street .06, arterial .08, ramp .09, aprons and caps .1,
// roundabouts and pads .11, junction boxes on top of everything under them (each layer also gets its own polygon offset)
const RKG=new Map();let RKU=null;const RKS=r=>(RKU||(RKU=new Map([[UV.street,'street'],[UV.art,'art'],[UV.lane,'lane'],[UV.ramp,'ramp']]))).get(r);
const rgb=(kind,x,z)=>{const k=kind+'|'+Math.floor(x/96)+'|'+Math.floor(z/96);let g=RKG.get(k);if(!g){g=new GB();g.kind=kind;RKG.set(k,g);}return g;};
const RKSEG=[],RKCIR=[];// carriageways for "nothing stands on the road": [a,b,inner,outer half-width] and [x,z,r]
const rkCover=(x,z)=>{let m=deckH(x,z);for(const[a,b]of[[1.3,0],[-1.3,0],[0,1.3],[0,-1.3],[2.6,0],[-2.6,0],[0,2.6],[0,-2.6],[1.8,1.8],[-1.8,1.8],[1.8,-1.8],[-1.8,-1.8]])m=Math.max(m,H(x+a,z+b));return m+.26;};
function rstrip(P,w,kind,yo,tl,k){drvPaint(P,w/2,1);const D=[P[0]];for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<1e-4)continue;const n=Math.max(1,Math.round(L/tl));for(let j=1;j<=n;j++)D.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}
  if(D.length<2)return;const nc=Math.max(1,Math.ceil(w/1.1)),Y={lane:.05,ramp:.06,street:.07,art:.09}[kind]||yo,rows=[];
  for(let i=0;i<D.length;i++){const p=D[Math.max(0,i-1)],q=D[Math.min(D.length-1,i+1)];let dx=q[0]-p[0],dz=q[1]-p[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const x=D[i][0],z=D[i][1],r=[];
    for(let j=0;j<=nc;j++){const o=-w/2+w*j/nc,X=x-dz*o,Z=z+dx*o;r.push([X,Math.max(gy(X,Z),.05)+Y+(kind==='art'&&O.brLift?O.brLift(X,Z):0),Z]);/* a low causeway where a street crosses a creek */}rows.push(r);}
  if(OWR2&&rows.length>2){/* Paul Nov 2026: level roads: flat across, a smooth rise and fall along, never below the ground */const M=rows.map(r=>Math.max(...r.map(v=>v[1]))),S=M.slice();for(let pass=0;pass<24;pass++)for(let i=1;i<S.length-1;i++)S[i]=Math.max(M[i],(S[i-1]+S[i]*2+S[i+1])/4);rows.forEach((r,i)=>r.forEach(v=>{v[1]=S[i];}));}
  for(let i=1;i<D.length;i++){const g=rgb(kind,D[i][0],D[i][1]),c=(k||1)*bake(D[i][0],D[i][1]);for(let j=0;j<nc;j++){const u0=j/nc,u1=(j+1)/nc;g.poly([rows[i-1][j],rows[i-1][j+1],rows[i][j+1],rows[i][j]],[[u0,0],[u1,0],[u1,1],[u0,1]],c);}
    RKSEG.push([D[i-1],D[i],kind==='art'?(OWR2?0:.19):0,kind==='art'?(OWR2?1.55:2.44):kind==='lane'?.4:kind==='ramp'?.62:w*.275]);}}
function rdisc(x,z,rad,yo,n,k){drvPaint([[x,z]],rad,1);(O.auDisc||(O.auDisc=[])).push([x,z,rad]);const top=yo>=.08,g=rgb(top?'asph2':'asph',x,z),Y=top?.13:.12,c=(k||1)*bake(x,z),C=[x,gy(x,z)+Y,z];n=Math.max(n,10);
  for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283,p1=[x+Math.cos(a1)*rad,0,z+Math.sin(a1)*rad],p0=[x+Math.cos(a0)*rad,0,z+Math.sin(a0)*rad];p1[1]=gy(p1[0],p1[2])+Y;p0[1]=gy(p0[0],p0[2])+Y;
    g.poly([C,p1,p0],[[x/2,z/2],[p1[0]/2,p1[2]/2],[p0[0]/2,p0[2]/2]],c);}RKCIR.push([x,z,rad-.1,rad===2.1?1.1:rad===4?2.2:0]);}
// a flat box (junction box, apron): centre x,z, size a (along ang) x b, turned by ang; follows the ground, or covers the highway under it
function rbox(x,z,a,b,ang,kind,yo,cover){(O.auBox||(O.auBox=[])).push([x,z,a,b,ang,kind]);yo=kind==='cross'||kind==='cross2'?.15:kind==='xarm'?.14:kind==='xarm2'?.16:kind==='tarm'?.15:cover?.14:Math.max(yo,.12);const na=Math.max(1,Math.ceil(a/1.1)),nb=Math.max(1,Math.ceil(b/1.1)),c=Math.cos(ang),s=Math.sin(ang),g=rgb(kind==='asph'&&cover?'box':kind,x,z),kk=bake(x,z),V=[];
  for(let j=0;j<=nb;j++)for(let i=0;i<=na;i++){const lx=-b/2+b*j/nb,lz=-a/2+a*i/na,X=x+lx*c+lz*s,Z=z-lx*s+lz*c;V.push([X,Math.max(gy(X,Z)+yo,cover?rkCover(X,Z):-99),Z,j/nb,i/na]);}
  const U=v=>kind==='asph'?[v[0]/2,v[2]/2]:[v[3],v[4]];
  for(let j=0;j<nb;j++)for(let i=0;i<na;i++){const q=[V[j*(na+1)+i],V[j*(na+1)+i+1],V[(j+1)*(na+1)+i+1],V[(j+1)*(na+1)+i]];g.poly(q.map(v=>[v[0],v[1],v[2]]),q.map(U),kk);}
  RKCIR.push([x,z,Math.min(a,b)/2]);}
O.subCarr=(x,z)=>{for(const c of RKCIR)if(Math.abs(c[0]-x)<c[2]&&Math.abs(c[1]-z)<c[2]){const d=Math.hypot(c[0]-x,c[1]-z);if(d<c[2]&&d>=(c[3]||0))return true;}
  const L=RKH.get(Math.floor(x/8)*100003+Math.floor(z/8));if(L)for(const s of L){const d=segDist(x,z,s[0],s[1]);if(d<s[3]&&d>s[2])return true;}return false;};
const RKH=new Map();
function rbuild(){RKSEG.forEach(s=>{const i0=Math.floor((Math.min(s[0][0],s[1][0])-3)/8),i1=Math.floor((Math.max(s[0][0],s[1][0])+3)/8),j0=Math.floor((Math.min(s[0][1],s[1][1])-3)/8),j1=Math.floor((Math.max(s[0][1],s[1][1])+3)/8);
    for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const k=i*100003+j;let L=RKH.get(k);if(!L)RKH.set(k,L=[]);L.push(s);}});
  const MK={street:RK.street,art:RK.art,lane:RK.lane,ramp:RK.ramp,asph:RK.asph,asph2:RK.asph,box:RK.asph,cross:RK.cross,cross2:()=>RK.cityW(3.0),xarm:RK.xarm,xarm2:RK.xarm,tarm:RK.tarm},PO={lane:0,ramp:1,street:2,art:3,asph:4,asph2:5,box:6,cross:7,cross2:7,xarm:6,xarm2:8,tarm:7};let n=0;
  RKG.forEach(gb=>{if(!gb.I.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(gb.P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(gb.N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(gb.U,2));g.setAttribute('color',new THREE.Float32BufferAttribute(gb.C,3));
    g.setIndex(gb.P.length/3>65535?new THREE.Uint32BufferAttribute(gb.I,1):new THREE.Uint16BufferAttribute(gb.I,1));g.computeBoundingSphere();
    const po=PO[gb.kind]||0,me=new THREE.Mesh(g,RK.mat('sub'+gb.kind,MK[gb.kind],{vertexColors:true,side:THREE.DoubleSide,polygonOffset:po>0,polygonOffsetFactor:-po*.5,polygonOffsetUnits:-po*2}));me.receiveShadow=true;me.userData.L='roads';me.name='rk:'+gb.kind;me.matrixAutoUpdate=false;me.updateMatrix();scene.add(me);n++;});O.subRoadMeshes=n;}
function strip(g,P,w,r,yo,tl,k){if(RKS(r))return rstrip(P,w,RKS(r),yo,tl,k);const D=[P[0]];for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/tl));for(let j=1;j<=n;j++)D.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}
  const L=[],Rr=[];for(let i=0;i<D.length;i++){const p=D[Math.max(0,i-1)],q=D[Math.min(D.length-1,i+1)];let dx=q[0]-p[0],dz=q[1]-p[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const x=D[i][0],z=D[i][1],y=gy(x,z)+yo;L.push([x-dz*w/2,y,z+dx*w/2]);Rr.push([x+dz*w/2,y,z-dx*w/2]);}
  for(let i=1;i<D.length;i++){const c=(k||1)*bake(D[i][0],D[i][1]);g.poly([L[i-1],Rr[i-1],Rr[i],L[i]],[[r[0],r[1]],[r[2],r[1]],[r[2],r[3]],[r[0],r[3]]],c);}}
function disc(g,x,z,rad,yo,r,n,k){if(r===UV.asph)return rdisc(x,z,rad,yo,n,k);const y=gy(x,z)+yo,c=(k||1)*bake(x,z);for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283;g.poly([[x,y,z],[x+Math.cos(a1)*rad,y,z+Math.sin(a1)*rad],[x+Math.cos(a0)*rad,y,z+Math.sin(a0)*rad]],[[(r[0]+r[2])/2,(r[1]+r[3])/2],[r[0]+(r[2]-r[0])*(.5+.5*Math.cos(a1)),r[1]+(r[3]-r[1])*(.5+.5*Math.sin(a1))],[r[0]+(r[2]-r[0])*(.5+.5*Math.cos(a0)),r[1]+(r[3]-r[1])*(.5+.5*Math.sin(a0))]],c);}}
// a flat ring (kerb, footpath round a cul-de-sac) in the atlas
function ring(g,x,z,r0,r1,yo,r,n,k){const c=(k||1)*bake(x,z),Y=(X,Z)=>gy(X,Z)+yo;for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283,P0=[x+Math.cos(a0)*r0,0,z+Math.sin(a0)*r0],P1=[x+Math.cos(a1)*r0,0,z+Math.sin(a1)*r0],Q0=[x+Math.cos(a0)*r1,0,z+Math.sin(a0)*r1],Q1=[x+Math.cos(a1)*r1,0,z+Math.sin(a1)*r1];
  [P0,P1,Q0,Q1].forEach(p=>p[1]=Y(p[0],p[2]));const u0=r[0]+(r[2]-r[0])*i/n,u1=r[0]+(r[2]-r[0])*(i+1)/n;g.poly([P0,Q0,Q1,P1],[[u0,r[1]],[u0,r[3]],[u1,r[3]],[u1,r[1]]],c);}}
// chunks
const CS=32,CH=new Map(),ck=(x,z)=>(Math.floor(x/CS)+200)*1000+(Math.floor(z/CS)+200);
const chunk=(x,z)=>{const k=ck(x,z);let c=CH.get(k);if(!c){c={k,cx:(Math.floor(x/CS)+.5)*CS,cz:(Math.floor(z/CS)+.5)*CS,base:new GB(),det:[],mesh:null,dm:null};CH.set(k,c);}return c;};
const B=(x,z)=>chunk(x,z).base;
const plant=(x,z,kind,h,t)=>{PL.push([x,H(x,z)-.06,z,kind,h,(t||1)*bake(x,z)]);};

