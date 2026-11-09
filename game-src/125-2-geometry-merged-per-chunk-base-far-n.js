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
function strip(g,P,w,r,yo,tl,k){const D=[P[0]];for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/tl));for(let j=1;j<=n;j++)D.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}
  const L=[],Rr=[];for(let i=0;i<D.length;i++){const p=D[Math.max(0,i-1)],q=D[Math.min(D.length-1,i+1)];let dx=q[0]-p[0],dz=q[1]-p[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const x=D[i][0],z=D[i][1],y=gy(x,z)+yo;L.push([x-dz*w/2,y,z+dx*w/2]);Rr.push([x+dz*w/2,y,z-dx*w/2]);}
  for(let i=1;i<D.length;i++){const c=(k||1)*bake(D[i][0],D[i][1]);g.poly([L[i-1],Rr[i-1],Rr[i],L[i]],[[r[0],r[1]],[r[2],r[1]],[r[2],r[3]],[r[0],r[3]]],c);}}
function disc(g,x,z,rad,yo,r,n,k){const y=gy(x,z)+yo,c=(k||1)*bake(x,z);for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283;g.poly([[x,y,z],[x+Math.cos(a1)*rad,y,z+Math.sin(a1)*rad],[x+Math.cos(a0)*rad,y,z+Math.sin(a0)*rad]],[[(r[0]+r[2])/2,(r[1]+r[3])/2],[r[0]+(r[2]-r[0])*(.5+.5*Math.cos(a1)),r[1]+(r[3]-r[1])*(.5+.5*Math.sin(a1))],[r[0]+(r[2]-r[0])*(.5+.5*Math.cos(a0)),r[1]+(r[3]-r[1])*(.5+.5*Math.sin(a0))]],c);}}
// chunks
const CS=32,CH=new Map(),ck=(x,z)=>(Math.floor(x/CS)+200)*1000+(Math.floor(z/CS)+200);
const chunk=(x,z)=>{const k=ck(x,z);let c=CH.get(k);if(!c){c={k,cx:(Math.floor(x/CS)+.5)*CS,cz:(Math.floor(z/CS)+.5)*CS,base:new GB(),det:[],mesh:null,dm:null};CH.set(k,c);}return c;};
const B=(x,z)=>chunk(x,z).base;
const plant=(x,z,kind,h,t)=>{PL.push([x,H(x,z)-.06,z,kind,h,(t||1)*bake(x,z)]);};

