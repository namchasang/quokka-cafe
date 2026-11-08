// ===== the desert loop (one way, sandy) and the Desert View walk trail =====
const V3=(x,z)=>new THREE.Vector3(x,0,z);
const LOOP=new THREE.CatmullRomCurve3([[1040,35],[1044,26],[1049,16],[1058,7],[1072,1],[1088,-5],[1102,-13],[1109,-25],[1100,-35],[1082,-34],[1064,-27],[1047,-23],[1034,-15],[1027,-3],[1029,10],[1034,22],[1036,30]].map(p=>V3(p[0],p[1])),true,'centripetal');
const TRAIL=new THREE.CatmullRomCurve3([[1004.6,33.4],[1003.8,24],[1004.2,12],[1005,1],[1005.4,-10],[1006.6,-18.6],[1011,-23],[1018,-21],[1024,-17],[1030.4,-13.6]].map(p=>V3(p[0],p[1])),false,'centripetal');
const LOOPL=LOOP.getLength(),TRL=TRAIL.getLength();
const LP=LOOP.getSpacedPoints(Math.round(LOOPL/.5)),TP=TRAIL.getSpacedPoints(Math.round(TRL/.5));
// distance fields (0.5 m cells) to the loop and the trail
function dfield(pts,maxd){const A=new Float32Array(HG.nx*HG.nz).fill(99),r=Math.ceil(maxd/HG.s);
  for(const p of pts){const ci=Math.round((p.x-HG.x0)/HG.s),cj=Math.round((p.z-HG.z0)/HG.s);for(let j=Math.max(0,cj-r);j<=Math.min(HG.nz-1,cj+r);j++)for(let i=Math.max(0,ci-r);i<=Math.min(HG.nx-1,ci+r);i++){
    const d=Math.hypot(HG.x0+i*HG.s-p.x,HG.z0+j*HG.s-p.z),k=j*HG.nx+i;if(d<A[k])A[k]=d;}}return A;}
const DFL=dfield(LP,9),DFT=dfield(TP,5);
const fget=(A,x,z)=>{const i=Math.round((x-HG.x0)/HG.s),j=Math.round((z-HG.z0)/HG.s);if(i<0||j<0||i>=HG.nx||j>=HG.nz)return 99;return A[j*HG.nx+i];};
const loopD=(x,z)=>fget(DFL,x,z),trailD=(x,z)=>fget(DFT,x,z);PIN.loopD=loopD;
const inR=(x,z,r,m)=>x>r.x1-(m||0)&&x<r.x2+(m||0)&&z>r.z1-(m||0)&&z<r.z2+(m||0);
// heath: a green belt round the sand plain, thickest to the west and north (as in the photos), and clumps among the spires
function heathW(x,z){let w=0;w=Math.max(w,ss((1013-x)/5),ss((-36-z)/4),ss((x-1111)/4),ss((z-40)/3));
  if(inR(x,z,{x1:1002,x2:1030,z1:24,z2:38}))w*=.25;if(inR(x,z,CP,2))w=0;
  const c=nz(x,z,6,21);if(c>.74)w=Math.max(w,ss((c-.74)/.08)*.9);return w;}
PIN.heathW=heathW;
// ===== pixel textures =====
// sand: 8 m tile at 32 px per metre, golden with wind ripples, footprints, tiny shell bits and pebbles (seamless)
const SAND=['#9c7e52','#a6885a','#b09262','#b89a6a','#c2a474','#ceb080'];
function sandTile(seed,foot){const W=256,[c,x]=cvs(W,W);const img=x.createImageData(W,W),D=img.data;const pal=SAND.map(h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];});
  for(let y=0;y<W;y++)for(let X=0;X<W;X++){const n1=pn(X,y,32,8,seed),n2=pn(X,y,8,32,seed+3);
    const ph1=y+6*Math.sin(X*Math.PI*2/128+n1*3)+4*Math.sin(X*Math.PI*2/64+y*Math.PI*2/256)+n2*3;const rp=((ph1%7)+7)%7;
    let k=2+(n1>.55?1:0)+(n2>.7?1:0)-(n1<.3?1:0);if(rp<1)k-=1;else if(rp<2)k+=1;if(ph(X,y,seed)<.06)k+=ph(y,X,seed)<.5?1:-1;k=cl(k,0,5);const p=pal[k],q=(y*W+X)*4;D[q]=p[0];D[q+1]=p[1];D[q+2]=p[2];D[q+3]=255;}
  x.putImageData(img,0,0);const r=mulberry32(seed*7+1);
  if(foot)for(let t=0;t<foot;t++){let fx=r()*W,fy=r()*W;const a=r()*6.283,dx=Math.cos(a)*9,dy=Math.sin(a)*9;for(let s=0;s<7;s++){const ox=(s&1?3:-3)*Math.sin(a),oy=(s&1?-3:3)*Math.cos(a);const X=((fx+ox)%W+W)%W|0,Y=((fy+oy)%W+W)%W|0;x.fillStyle=SAND[1];x.fillRect(X,Y,3,2);x.fillStyle=SAND[0];x.fillRect(X+1,Y+1,1,1);x.fillStyle=SAND[4];x.fillRect(X,Y+2,3,1);fx+=dx;fy+=dy;}}
  for(let t=0;t<70;t++){const X=r()*W|0,Y=r()*W|0,k=r();x.fillStyle=k<.4?'#d8ccb4':k<.7?'#a89a80':'#c8b896';x.fillRect(X,Y,k<.85?1:2,1);x.fillStyle='#8a6a3e';x.fillRect(X,Y+1,k<.85?1:2,1);}
  return c;}
// the loop: compacted sand with two wheel ruts and fine corrugations, 4 m wide x 4 m long
function trackTile(){const W=128,Hh=128,[c,x]=cvs(W,Hh);const img=x.createImageData(W,Hh),D=img.data;const pal=['#a6885a','#b09262','#ba9c6c','#c4a676','#d0b284'].map(h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];});
  for(let y=0;y<Hh;y++)for(let X=0;X<W;X++){const u=X/W;let k=2;const rut=Math.min(Math.abs(u-.3),Math.abs(u-.7));if(rut<.06)k=1;else if(rut<.08)k=3;
    if(((y+Math.round(2*Math.sin(X*.2)))%6)===0&&rut<.12)k-=1;if(u<.06||u>.94)k=3;const n=pn(X,y,16,8,77);if(n>.68)k+=1;if(n<.25)k-=1;if(ph(X,y,5)<.05)k+=ph(y,X,6)<.5?1:-1;k=cl(k,0,4);
    const p=pal[k],q=(y*W+X)*4;D[q]=p[0];D[q+1]=p[1];D[q+2]=p[2];D[q+3]=255;}x.putImageData(img,0,0);return c;}
function pathTile(){const W=40,Hh=64,[c,x]=cvs(W,Hh);x.fillStyle='#c4a87a';x.fillRect(0,0,W,Hh);const r=mulberry32(9);for(let i=0;i<180;i++){x.fillStyle=pick(['#b89c6c','#d0b688','#ae9264','#d8c098']);x.fillRect(r()*W|0,r()*Hh|0,1+(r()*2|0),1);}
  x.fillStyle='#a88a5a';x.fillRect(0,0,2,Hh);x.fillRect(W-2,0,2,Hh);return c;}
// ===== the ground mesh: follows H, sand tile repeated in world metres, big-scale colour from vertex colours =====
{const GW=X2-X1+24,GD=Z2-Z1+20,g=new THREE.PlaneGeometry(GW,GD,GW,GD);g.rotateX(-Math.PI/2);g.translate((X1+X2)/2,0,(Z1+Z2)/2);
  const P=g.attributes.position,U=g.attributes.uv,col=new Float32Array(P.count*3);
  for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i),h=H(x,z);P.setY(i,h);U.setXY(i,x/8,-z/8);
    const hw=heathW(x,z),m=nz(x,z,9,11),lit=1+(h-H(x+1,z+1))*.05;let r=1,gg=1,b=1;
    const f=(.94+m*.1)*lit;r*=f;gg*=f;b*=f;
    // under the heath: greyer, darker sand with leaf litter
    r*=1-hw*.2;gg*=1-hw*.18;b*=1-hw*.05;
    // dune crests a little paler, hollows a little more orange
    const cr=cl(h/3,0,1);r*=1+cr*.03;gg*=1+cr*.04;b*=1+cr*.06;
    col[i*3]=r;col[i*3+1]=gg;col[i*3+2]=b;}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();
  const st=ctex(sandTile(3,9),{rep:[1,1]});st.magFilter=THREE.NearestFilter;
  const m=new THREE.MeshLambertMaterial({map:st,vertexColors:true});PIN.sandM=m;
  const gm=put(g,m,0,0,0,{nc:1});gm.name='pin_ground';}
// ribbon along a curve, following the ground (for the loop and the trail)
function ribbon(pts,w,mat,lift,uLen,closed){const n=pts.length,across=4,pos=[],uv=[],idx=[];let dist=0;
  for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n],o=pts[(i-1+n)%n];const a=closed||i<n-1?q:p,b=closed||i>0?o:p;let tx=a.x-b.x,tz=a.z-b.z;const L=Math.hypot(tx,tz)||1;tx/=L;tz/=L;
    if(i>0)dist+=Math.hypot(p.x-pts[i-1].x,p.z-pts[i-1].z);
    for(let k=0;k<=across;k++){const s=(k/across-.5)*w,x=p.x-tz*s,z=p.z+tx*s;pos.push(x,H(x,z)+lift,z);uv.push(k/across,dist/uLen);}}
  const rows=closed?n:n-1;for(let i=0;i<rows;i++){const a=i*(across+1),b=((i+1)%n)*(across+1);for(let k=0;k<across;k++)idx.push(a+k,b+k,a+k+1,a+k+1,b+k,b+k+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const m=put(g,mat,0,0,0,{nc:1});return m;}
{const tt=ctex(trackTile(),{rep:[1,1]});tt.magFilter=THREE.NearestFilter;const tm=new THREE.MeshLambertMaterial({map:tt,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  ribbon(LP,4.4,tm,.025,4,true);
  const pt=ctex(pathTile(),{rep:[1,1]});pt.magFilter=THREE.NearestFilter;ribbon(TP,1.3,new THREE.MeshLambertMaterial({map:pt,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),.03,2,false);}
