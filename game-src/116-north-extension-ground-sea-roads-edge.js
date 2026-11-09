// ---------- North extension: ground, sea, roads, edge posts, signs, towns, heath, dunes, the Pinnacles, the two park-and-walk gates ----------
function NORTHbuild(){const N=NORTH;if(!N)return;const D=N.data,NC=N.NC,NRW=N.NRW,CE=N.CE,X0=N.X0;
  const hx=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
  // ---- the ground: one pixel shader for the whole strip, in chunks ----
  const RAMPS=[['#e8dcb4','#c8b888','#9ac8b8','#6ab8b0','#4a9a9a','#2a6a78','#1e5462'],['#7e6e50','#94825e','#ac986c','#c0ac7c','#d0bc8c','#dccb9c','#e8d8ae'],
    ['#535c74','#6a7288','#848a9c','#9ea0aa','#b4b2b0','#c6c2ba','#d6d0c4'],['#8a5a2a','#a8723a','#c48c46','#d8a456','#e6b866','#f0ca7c','#f8dc98'],
    ['#3a4632','#4a583e','#5c6a4a','#6e7c58','#828e68','#98a07a','#aeb28e'],['#28382a','#324632','#3e5438','#4a6440','#58744a','#6a8456','#7e9666'],
    ['#5e5c32','#76703c','#8c8446','#a29a54','#b8ae66','#cec27c','#dcd294'],['#6a6862','#82807a','#9a9890','#b0aea4','#c4c2b8','#d6d4ca','#e4e2d8'],
    ['#2f4a24','#3c5e2c','#4a7232','#5a863a','#6e9a44','#86ae52','#a2c068'],['#b4a47e','#f4f4ec','#5c5e62','#c8c4b8','#f2d24a','#f4f2ec','#c86ad8','#76ac4a']];
  const rd=new Uint8Array(8*10*4);RAMPS.forEach((row,j)=>{for(let k=0;k<8;k++){const c=hx(row[Math.min(k,row.length-1)]);rd.set([c[0],c[1],c[2],255],(j*8+k)*4);}});
  const dt=(a,w,h,lin)=>{const t=new THREE.DataTexture(a,w,h,THREE.RGBAFormat);t.magFilter=t.minFilter=lin?THREE.LinearFilter:THREE.NearestFilter;t.needsUpdate=true;return t;};
  const rampT=dt(rd,8,10,false);
  const ca=new Uint8Array(NC*NRW*4),sa=new Uint8Array(NC*NRW*4),lo=OWBK.lo,hi=OWBK.hi;
  for(let i=0;i<NC*NRW;i++){ca[i*4]=D.CL[i];ca[i*4+3]=255;sa[i*4]=OWBAKE_ON?Math.round((D.BKN[i]-lo)/(hi-lo)*255):Math.round((1-lo)/(hi-lo)*255);sa[i*4+1]=Math.max(0,Math.min(255,Math.round(D.SD[i]*8+128)));sa[i*4+2]=D.SH[i];sa[i*4+3]=255;}
  const clsT=dt(ca,NC,NRW,false),shT=dt(sa,NC,NRW,true);
  const gm=new THREE.MeshStandardMaterial({roughness:.95});
  gm.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{nCls:{value:clsT},nSh:{value:shT},nRamp:{value:rampT},nG:{value:new THREE.Vector4(X0,CE,NC,NRW)},nLH:{value:new THREE.Vector2(lo,hi)},nBk:{value:1}});
    sh.vertexShader='varying vec2 vWP;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.)).xz;');
    sh.fragmentShader=`uniform sampler2D nCls,nSh,nRamp;uniform vec4 nG;uniform vec2 nLH;uniform float nBk;varying vec2 vWP;
float nh(vec2 p){p=mod(p,1024.);vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float nv(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(nh(i),nh(i+vec2(1.,0.)),f.x),mix(nh(i+vec2(0.,1.)),nh(i+vec2(1.,1.)),f.x),f.y);}
vec2 nuv(vec2 w){return vec2((w.x-nG.x)/nG.y+.5,(-w.y)/nG.y+.5)/vec2(nG.z,nG.w);}
vec3 nr(float c,float k){return texture2D(nRamp,vec2((k+.5)/8.,(c+.5)/10.)).rgb;}
float b2(vec2 v){return mod(v.x*2.+v.y*3.,4.);}
float b4(vec2 p){return 4.*b2(mod(p,2.))+b2(mod(floor(p/2.),2.));}
`+sh.fragmentShader.replace('#include <map_fragment>',`{vec2 pi=floor(vWP*3.),pp=(pi+.5)/3.;
 vec4 sh=texture2D(nSh,nuv(pp));float sd=(sh.g*255.-128.)/8.;float bk=mix(1.,nLH.x+sh.r*(nLH.y-nLH.x),nBk);float base=sh.b;
 vec2 wj=pp+(vec2(nv(pp*.3),nv(pp*.3+7.1))-.5)*5.+(vec2(nh(pi),nh(pi+3.3))-.5)*1.2;
 float c=floor(texture2D(nCls,nuv(wj)).r*255.+.5);float hh=nh(pi*1.37+.5),bb=(b4(pi)-7.5)/16.;vec3 col;
 if(sd<.2){float dep=max(0.,-sd);col=nr(0.,clamp(floor(dep/1.4+.6+bb),0.,6.));if(sd>-.45&&hh<.55)col=nr(9.,1.);}
 else{
  if(c<.5)c=4.;
  if(c!=2.&&c!=7.&&c!=8.&&sd<4.+nv(pp*.4)*2.5)c=1.;
  float lev=base+(nv(pp*.55)-.5)*.2+(hh-.5)*.07;bool st=false;
  if(c==2.){float rp=fract((pp.y*.9+pp.x*.35+nv(pp*.12)*3.)/1.25);if(rp<.16)lev-=.14;else if(rp<.3)lev+=.05;}
  if((c==7.||c==8.)&&${OW_SUB2?'false':'true'}){vec2 sw=vec2(pp.x+6.*sin(pp.y/47.+sin(pp.x/83.)),pp.y+6.*sin(pp.x/53.+cos(pp.y/71.)));float sa=mod(sw.x,12.),sb=mod(sw.y,9.5);
    if(sa<2.3||sb<2.3){float e=min(sa<2.3?min(sa,2.3-sa):9.,sb<2.3?min(sb,2.3-sb):9.);col=e<.3?nr(9.,3.):nr(9.,2.);st=true;}}
  if(!st){lev*=bk;float k=clamp(floor(lev*7.+bb*1.2),0.,6.);col=nr(c,k);
   if(c==1.&&sd<.9)col=(hh<.3&&sd<.35)?nr(9.,1.):nr(9.,0.);
   if((c==4.||c==5.||c==6.||c==8.)&&hh<.035)col=nr(c,min(6.,k+1.));
   if((c==4.||c==6.)&&hh>.993){float w=fract(hh*1000.);col=w<.4?nr(9.,4.):w<.75?nr(9.,5.):nr(9.,6.);}
   if(c==3.&&hh>.982)col=nr(3.,max(0.,k-2.));
   if(c==2.&&hh>.996)col=nr(2.,max(0.,k-1.));}
  else col*=mix(1.,bk,.6);}
 diffuseColor.rgb*=pow(col,vec3(2.2));}`);};
  N.groundMat=gm;
  const CH=128;for(let r0=0;r0<NRW-1;r0+=CH){const r1=Math.min(NRW-1,r0+CH),rows=r1-r0+1,pos=new Float32Array(rows*NC*3),idx=[];
    for(let r=r0;r<=r1;r++)for(let c=0;c<NC;c++){const o=((r-r0)*NC+c)*3,x=X0+c*CE,z=-r*CE;pos[o]=x;pos[o+1]=N.H(x,z);pos[o+2]=z;}
    for(let r=0;r<rows-1;r++)for(let c=0;c<NC-1;c++){const a=r*NC+c;idx.push(a,a+1,a+NC,a+1,a+NC+1,a+NC);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();g.computeBoundingSphere();
    const m=new THREE.Mesh(g,gm);m.receiveShadow=true;m.userData.L='ground';scene.add(m);}
  // ---- the sea up the coast, and a deep floor under it ----
  const w2=new THREE.Mesh(new THREE.PlaneGeometry(1700,4500),water.material);w2.rotation.x=-Math.PI/2;w2.position.set(200,0,-350-2250);w2.userData.L='water';scene.add(w2);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(1700,4900),new THREE.MeshBasicMaterial({color:lin('#1e5462')}));fl.rotation.x=-Math.PI/2;fl.position.set(200,-2.6,-2300);fl.userData.L='water';scene.add(fl);
  // ---- roads ----
  N.roads.forEach(r=>ribbon(r.draw,r.main?4.4:3.4,roadM,r.main?.18:.12,true));/*spurs run under the highway at the T*/
  const RR=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(9001);
  const along=(P,step,f)=>{let acc=0;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(!L)continue;const dx=(b[0]-a[0])/L,dz=(b[1]-a[1])/L;let s=(step-acc%step)%step;for(;s<L;s+=step)f(a[0]+dx*s,a[1]+dz*s,dx,dz,acc+s);acc+=L;}};
  // white guide posts with red reflectors along the country roads
  const postT=(()=>{const c=document.createElement('canvas');c.width=4;c.height=16;const x=c.getContext('2d');x.fillStyle='#f4f2ea';x.fillRect(0,0,4,16);x.fillStyle='#1c1c1e';x.fillRect(0,0,4,3);x.fillStyle='#e83a2a';x.fillRect(1,1,2,2);x.fillStyle='#c8c4b8';x.fillRect(3,3,1,13);
    const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;return t;})();
  const PO=[];N.roads.forEach(r=>along(r.draw,r.main?7:6,(x,z,dx,dz)=>{if(z>-30)return;[-1,1].forEach(s=>{const px=x-dz*(r.main?2.9:2.4)*s,pz=z+dx*(r.main?2.9:2.4)*s;if(!N.land(px,pz))return;PO.push([px,deckH(x,z),pz,Math.atan2(dx,dz)]);});}));
  {const pg=new THREE.BoxGeometry(.16,.85,.16);pg.translate(0,.42,0);const im=new THREE.InstancedMesh(pg,new THREE.MeshLambertMaterial({map:postT}),PO.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3(1,1,1);
    PO.forEach((p,i)=>{e.set(0,p[3],0);q.setFromEuler(e);v.set(p[0],p[1],p[2]);m4.compose(v,q,s);im.setMatrixAt(i,m4);});im.castShadow=true;im.userData.L='props';im.frustumCulled=false;scene.add(im);}
  // ---- green road signs with white pixel letters ----
  const signTex=(lines,w,h,bg,fg)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.fillRect(1,1,w-2,1);x.fillRect(1,h-2,w-2,1);x.fillRect(1,1,1,h-2);x.fillRect(w-2,1,1,h-2);
    x.font='bold 9px monospace';x.textBaseline='top';lines.forEach((l,i)=>{const [a,b]=Array.isArray(l)?l:[l,''];x.fillText(a,4,4+i*11);if(b){const tw2=x.measureText(b).width;x.fillText(b,w-4-tw2,4+i*11);}});
    const d=x.getImageData(0,0,w,h),A=d.data,F=hx(fg),B=hx(bg);for(let i=0;i<A.length;i+=4){const on=Math.abs(A[i]-F[0])+Math.abs(A[i+1]-F[1])+Math.abs(A[i+2]-F[2])<Math.abs(A[i]-B[0])+Math.abs(A[i+1]-B[1])+Math.abs(A[i+2]-B[2]);const c2=on?F:B;A[i]=c2[0];A[i+1]=c2[1];A[i+2]=c2[2];A[i+3]=255;}x.putImageData(d,0,0);
    const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;return t;};
  const sign=(lines,x,z,dx,dz,side,bg,fg)=>{const w=lines.reduce((m,l)=>Math.max(m,(Array.isArray(l)?l.join('   '):l).length),0)*6+10,h=lines.length*11+6,g=new THREE.Group();
    const px=x-dz*4.4*side,pz=z+dx*4.4*side,y=Math.max(H(px,pz),deckH(x,z)-.4),SW=w/16,SHh=h/16;g.position.set(px,y,pz);g.rotation.y=Math.atan2(-dx,-dz);
    const face=new THREE.MeshLambertMaterial({map:signTex(lines,w,h,bg||'#1f6a44',fg||'#f4f2ea')}),back=M('#8a8e94');
    const b=new THREE.Mesh(new THREE.BoxGeometry(SW,SHh,.12),[back,back,back,back,face,back]);b.position.y=1.5+SHh/2;b.castShadow=true;g.add(b);
    [-1,1].forEach(k=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1.6+SHh,6),M('#9aa0a6'));p.position.set(k*SW*.36,(1.6+SHh)/2,-.1);g.add(p);});g.userData.L='props';scene.add(g);};
  const kmAt=s=>Math.round(N.KM(s)),ahead=(s,n)=>N.dest.filter(d=>d.s>s+20).slice(0,n);
  // distance signs every few kilometres heading north (and one for the drive back)
  along(N.main.p,210,(x,z,dx,dz,s)=>{if(z>20||s<15)return;const k=kmAt(s),A=ahead(s,3);if(!A.length)return;sign(A.map(d=>[d.n,(d.km-k)+' km']),x,z,dx,dz,-1);});
  along(N.main.p,450,(x,z,dx,dz,s)=>{if(z>-100)return;sign([['Perth',kmAt(s)+' km']],x,z,-dx,-dz,-1);});
  // turn-off signs at each side road (the spurs all go west, to the driver's left)
  N.roads.slice(1).forEach(r=>{const [x,z]=r.p[0],s=N.sOf(x,z);let i=1;const P=N.main.p;let b=0,bd=1e9;P.forEach((q,j)=>{const d=Math.hypot(q[0]-x,q[1]-z);if(d<bd){bd=d;b=j;}});i=Math.max(1,Math.min(P.length-1,b));const dx0=P[i][0]-P[i-1][0],dz0=P[i][1]-P[i-1][1],L=Math.hypot(dx0,dz0)||1;
    const d=N.dest.find(d=>Math.abs(d.s-s)<60)||{n:r.n.replace(/ (Rd|Dr)$/,''),km:kmAt(s)};const nm=r.n==='Pinnacles Dr'?'The Pinnacles':r.n==='Yanchep Beach Rd'?'Yanchep':d.n;
    let ax=x,az=z;ax-=dx0/L*30;az-=dz0/L*30;sign([['< '+nm,''],[(r.n==='Pinnacles Dr'?'Park and walk':'Coast road'),'']],ax,az,dx0/L,dz0/L,-1,'#1f6a44');});
  // town name boards where the side roads reach each town
  N.town.forEach(t=>{const r=N.roads.find(r=>r.p.length&&Math.hypot(r.p[r.p.length-1][0]-t.x,r.p[r.p.length-1][1]-t.z)<40)||N.main;const near=r.p.reduce((b,q)=>Math.hypot(q[0]-t.x,q[1]-t.z)<Math.hypot(b[0]-t.x,b[1]-t.z)?q:b,r.p[0]);
    const k=Math.max(1,r.p.indexOf(near)),a=r.p[k-1],b=r.p[k],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;sign([t.n],a[0],a[1],(b[0]-a[0])/L,(b[1]-a[1])/L,-1,'#1d3a6e');});
  // the start of the coast road at the city, so Paul knows where to go
  {const P=N.main.p;let i=P.findIndex(q=>q[1]<30);i=Math.max(1,i);const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;sign([['Mitchell Fwy','North'],['Lancelin',N.dest.find(d=>d.n==='Lancelin').km+' km'],['Pinnacles',N.dest.find(d=>d.n==='Pinnacles').km+' km']],a[0],a[1],(b[0]-a[0])/L,(b[1]-a[1])/L,-1);}
  // ---- houses: suburbs on curving streets (same warp as the ground shader), small coast towns ----
  const wa=(x,z)=>x+6*Math.sin(z/47+Math.sin(x/83)),wb=(x,z)=>z+6*Math.sin(x/53+Math.cos(z/71));
  const inv=(a,b)=>{let x=a,z=b;for(let k=0;k<6;k++){x+=a-wa(x,z);z+=b-wb(x,z);}return[x,z];};
  const HO=[];const SXb=12,SZb=9.5,SWb=2.3;
  if(!OW_SUB2)for(let bb=Math.floor(N.ZMIN/SZb)-1;bb<2;bb++){const zc=bb*SZb;for(let ba=Math.floor(N.X0/SXb)-1;ba<N.X1/SXb+1;ba++){const [cx,cz]=inv(ba*SXb+7,zc+6);if(cz>-2||cz<N.ZMIN+4)continue;const k0=N.cls(cx,cz);if(k0!==7&&k0!==8)continue;
    const [ax,az]=inv(ba*SXb+8,zc+6),ang=Math.atan2(az-cz,ax-cx);
    for(let row=0;row<2;row++)for(let k=0;k<3;k++){const la=SWb+1.65+k*3.2,lb=row?SZb-1.55:SWb+1.55,[x,z]=inv(ba*SXb+la,bb*SZb+lb);const kc=N.cls(x,z);if((kc!==7&&kc!==8)||N.sd(x,z)<5||N.onRoad(x,z,4.4))continue;
      const r=L2hash(x*13.1,z*7.3);if(kc===7&&r<.12)continue;HO.push({x,z,a:ang,r,t:kc});}}}
  {const wt=(()=>{const c=document.createElement('canvas');c.width=16;c.height=12;const x=c.getContext('2d');x.fillStyle='#ffffff';x.fillRect(0,0,16,12);x.fillStyle='#3a4656';x.fillRect(2,4,4,4);x.fillRect(10,4,4,4);x.fillStyle='#d8d8d8';x.fillRect(2,8,4,1);x.fillRect(10,8,4,1);x.fillStyle='#6a4a32';x.fillRect(7,5,2,7);x.fillStyle='#c8c8c8';x.fillRect(0,11,16,1);
      const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;return t;})();
    const bg=new THREE.BoxGeometry(1,1,1);bg.translate(0,.5,0);const rg=new THREE.ConeGeometry(.7071*1.12,1,4);rg.rotateY(Math.PI/4);rg.translate(0,.5,0);const n=HO.length;
    const body=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({map:wt}),n),roof=new THREE.InstancedMesh(rg,new THREE.MeshLambertMaterial({}),n);
    const WALL=['#efe6d4','#e8dcc4','#f4f2ec','#d8c8b0','#c89a78','#b8705a','#e2d6c0','#d0c8bc'],WALLC=['#f4f2ec','#e8f0f0','#f2e8d8','#dce8ec','#e8dcc4'],ROOF=['#b8562e','#a8482a','#c8683e','#5a5e64','#46494e','#8a8e94','#e6e4de','#6a7a6a'];
    const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3(),col=new THREE.Color();
    HO.forEach((h,i)=>{const w=2.5+h.r*.5,d=2.2+L2hash(h.r,1)*.4,ht=1.25+L2hash(h.r,3)*.3,y=H(h.x,h.z);e.set(0,-h.a,0);q.setFromEuler(e);v.set(h.x,y,h.z);s.set(w,ht,d);m4.compose(v,q,s);body.setMatrixAt(i,m4);
      const WL=h.t===7?WALLC:WALL;col.set(WL[(L2hash(h.r,4)*WL.length)|0]).convertSRGBToLinear();body.setColorAt(i,col);
      v.set(h.x,y+ht,h.z);s.set(w*1.04,.7+L2hash(h.r,5)*.4,d*1.04);m4.compose(v,q,s);roof.setMatrixAt(i,m4);col.set(ROOF[(L2hash(h.r,6)*(h.t===7?8:6))|0]).convertSRGBToLinear();roof.setColorAt(i,col);});
    [body,roof].forEach(m=>{m.castShadow=m.receiveShadow=true;m.userData.L='build';m.frustumCulled=false;scene.add(m);});N.houses=HO;}
  // street lamps in the coast towns (warm at dusk)
  {const bulb=new THREE.MeshBasicMaterial({color:0x3a3a30}),haloT=(()=>{const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');x.fillStyle='rgba(255,200,120,.35)';x.fillRect(3,3,10,10);x.fillStyle='rgba(255,225,160,.9)';x.fillRect(6,6,4,4);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;return t;})();
    N.town.forEach(t=>{for(let k=0;k<5;k++){const a=k*1.26+.4,x=t.x+Math.cos(a)*t.r*.45,z=t.z+Math.sin(a)*t.r*.45;if(!N.land(x,z))continue;const y=H(x,z);
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,3.2,6),M('#5a5e64'));pole.position.set(x,y+1.6,z);pole.userData.L='props';scene.add(pole);
      const bl=new THREE.Mesh(new THREE.BoxGeometry(.4,.25,.4),bulb);bl.position.set(x,y+3.3,z);bl.userData.L='lights';scene.add(bl);const h=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));h.position.set(x,y+3.3,z);h.scale.set(3,3,1);h.userData.L='lights';scene.add(h);LAMPS.push([bl,h]);}});}
  // ---- the two park-and-walk gates: Lancelin (by the beach) and the Pinnacles (the lookout car park) ----
  const carpark=(g,w,d)=>{const a=box(g,w,.12,d,'#6a6c70',0,.06,0);a.castShadow=false;for(let k=-2;k<=2;k++)box(g,.12,.13,1.6,'#e8e4d0',k*1.8,.07,-d/2+1);[[-w/2,-d/2],[w/2,-d/2],[-w/2,d/2],[w/2,d/2]].forEach(([a2,b2])=>box(g,.5,.4,.5,'#d8d0bc',a2,.2,b2));
    const pt=signTex(['P'],16,16,'#1d3a6e','#f4f2ea'),p=new THREE.Mesh(new THREE.BoxGeometry(.9,.9,.1),[M('#8a8e94'),M('#8a8e94'),M('#8a8e94'),M('#8a8e94'),new THREE.MeshLambertMaterial({map:pt}),M('#8a8e94')]);p.position.set(w/2+.4,2.4,d/2);g.add(p);cyl(g,.06,2.2,'#9aa0a6',w/2+.4,1.1,d/2-.1,6);};
  const gate=(id,name,act,note,x,z,build)=>{town(id,name,note,x,z,g=>{carpark(g,8,5);build(g);});TOWNS[TOWNS.length-1].act=act;};
  gate('lan','Lancelin','Park and walk at Lancelin','Sand dunes, the jetty and the beach · walk around the town',...N.gates.lan,g=>{
    box(g,3.2,2.2,2.4,'#f4f2ec',-6,1.1,-3);cone(g,2.4,1,'#3a7a9a',-6,2.7,-3);box(g,1.6,.5,.1,'#e86a1a',-6,1.9,-1.75);// a fish and chip shack
    for(let k=0;k<6;k++)box(g,1.4,.22,.5,'#c8b088',-1,.11,-3.2-k*.9);// boardwalk to the beach
    const sb=box(g,.2,1.6,.6,'#e8c84a',2.8,.8,3);sb.rotation.z=.25;});// a sandboard leaning on the sign
  gate('pin','The Pinnacles','Park and walk at the Pinnacles','Thousands of limestone spires in yellow sand',...N.gates.pin,g=>{
    box(g,4,2,3,'#d8b880',-6,1,-3);box(g,4.6,.25,3.6,'#8a6a4a',-6,2.1,-3);for(let k=0;k<3;k++)cone(g,.4,1.6+k*.5,'#d8a456',5+k*1.2,.8+k*.25,-3+k,5);});
  if(N.gates.cer)gate('cer','Cervantes','Park at Nok’s Thai Kitchen','Crayfish town on the coast · Nok’s restaurant by the beach',...N.gates.cer,g=>{box(g,4,2.2,3,'#f4ecd8',-6,1.1,-3);box(g,4.6,.25,3.6,'#c9473f',-6,2.3,-3);box(g,2.4,.6,.1,'#f4d04a',-6,1.9,-1.45);});
  // ---- the Pinnacles: limestone spires (low-poly, pixel skin), thousands in the yellow sand ----
  {const pinT=(()=>{const c=document.createElement('canvas');c.width=16;c.height=32;const x=c.getContext('2d');const C=['#b88a4a','#c89a56','#d8ac64','#e4bc74','#a87a42','#9a7040'];
      for(let j=0;j<32;j++)for(let i=0;i<16;i++){const n=L2hash(i*3.1,j*1.7),band=Math.sin(j*.9+L2hash(j,1))*.5+.5;x.fillStyle=C[Math.min(5,(n*2+band*2+(i>10?1.5:0))|0)];x.fillRect(i,j,1,1);}
      x.fillStyle='#8a6438';for(let k=0;k<26;k++)x.fillRect(L2hash(k,9)*16|0,L2hash(k,8)*32|0,1,1);x.fillStyle='#f0d498';for(let k=0;k<18;k++)x.fillRect(L2hash(k,7)*16|0,L2hash(k,6)*32|0,1,1);
      const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;return t;})();
    const sg=new THREE.CylinderGeometry(.16,.46,1,6,3);{const p=sg.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),j=L2hash(p.getX(i)*7+y,p.getZ(i)*5);p.setX(i,p.getX(i)*(.8+j*.45));p.setZ(i,p.getZ(i)*(.8+L2hash(j,2)*.45));if(y>.45)p.setY(i,y-L2hash(j,3)*.25);}sg.computeVertexNormals();sg.translate(0,.48,0);}
    const P=N.dunes.find(d=>d[4]===2),PS=[];if(P)for(let k=0;k<9000&&PS.length<1100;k++){const a=RR()*6.283,rr=Math.sqrt(RR()),x=P[0]+Math.cos(a)*P[2]*rr*.95,z=P[1]+Math.sin(a)*P[3]*rr*.95;
      if(N.cls(x,z)!==3||N.onRoad(x,z,4)||Math.hypot(x-N.gates.pin[0],z-N.gates.pin[1])<9)continue;if(fbm(x/9,z/9)<-.12&&RR()<.7)continue;PS.push([x,z,.6+RR()*RR()*2.2,.7+RR()*.9,RR()*6.28]);}
    const im=new THREE.InstancedMesh(sg,new THREE.MeshLambertMaterial({map:pinT}),PS.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3();
    PS.forEach(([x,z,h,w,r],i)=>{e.set((RR()-.5)*.12,r,(RR()-.5)*.12);q.setFromEuler(e);v.set(x,H(x,z)-.1,z);s.set(w,h,w);m4.compose(v,q,s);im.setMatrixAt(i,m4);});
    im.castShadow=im.receiveShadow=true;im.userData.L='mark';im.frustumCulled=false;scene.add(im);N.spires=PS.length;}
  // ---- plants: pixel sprites of the coast (heath, grass trees, banksias, wattle, tuart gums, saltbush, street trees, spinifex), one billboard mesh ----
  const CWp=32,CHp=40,KINDS=8,at=document.createElement('canvas');at.width=CWp*KINDS;at.height=CHp;const x=at.getContext('2d');
  const disc=(ox,cx,cy,r,c)=>{x.fillStyle=c;for(let j=-r;j<=r;j++){const w=Math.round(Math.sqrt(r*r-j*j));x.fillRect(ox+cx-w,cy+j,w*2+1,1);}};
  const canopy=(ox,cx,cy,rx,ry,ramp,seed,r0)=>{let s2=seed;const rnd=()=>(s2=(s2*16807)%2147483647)/2147483647;const R0=r0||3;
    for(let k=0;k<30;k++){const a=rnd()*6.28,d=Math.sqrt(rnd());disc(ox,cx+Math.cos(a)*rx*d|0,cy+Math.sin(a)*ry*d|0,R0,ramp[0]);}
    for(let k=0;k<26;k++){const a=rnd()*6.28,d=Math.sqrt(rnd())*.85;disc(ox,cx+Math.cos(a)*rx*d-1|0,cy+Math.sin(a)*ry*d-1|0,R0,ramp[1]);}
    for(let k=0;k<18;k++){const a=rnd()*6.28,d=Math.sqrt(rnd())*.7;disc(ox,cx+Math.cos(a)*rx*d-2|0,cy+Math.sin(a)*ry*d-2|0,Math.max(1,R0-1),ramp[2]);}
    for(let k=0;k<10;k++){const a=3.6+rnd()*1.6,d=Math.sqrt(rnd())*.75;disc(ox,cx+Math.cos(a)*rx*d|0,cy+Math.sin(a)*ry*d|0,1,ramp[3]);}};
  const trunk=(ox,cx,y0,y1,c,c2)=>{x.fillStyle=c;x.fillRect(ox+cx-1,y0,3,y1-y0);x.fillStyle=c2;x.fillRect(ox+cx+1,y0,1,y1-y0);};
  canopy(0,16,32,13,6,['#3e4a36','#5a6848','#7a8862','#9ea684'],51,3);x.fillStyle='#f2d24a';for(let k=0;k<5;k++)x.fillRect(5+L2hash(k,3)*22|0,28+L2hash(k,4)*8|0,1,1);// 0 coastal heath
  trunk(32,16,24,40,'#2a2420','#141010');x.fillStyle='#8a7448';for(let k=0;k<12;k++)x.fillRect(32+10+k,24+(k%3),1,6);// 1 grass tree: black trunk, dry skirt, spiky crown, a flower spike
  [['#3e6a2a',1],['#6a9a3a',0],['#9ac85a',2]].forEach(([c,l])=>{x.fillStyle=c;for(let k=0;k<15;k++){const a=-Math.PI+k/14*Math.PI;for(let t=0;t<1;t+=.08)x.fillRect(32+16+Math.cos(a)*11*t|0,24+Math.sin(a)*9*t+l|0,1,1);}});x.fillStyle='#3a2a1a';x.fillRect(32+15,2,2,14);x.fillStyle='#d8c890';x.fillRect(32+15,3,2,8);
  trunk(64,16,22,40,'#6a5a48','#4a3a2a');canopy(64,16,16,12,10,['#2a4a2a','#3e6236','#5a7e48','#7a9a5e'],37,2);x.fillStyle='#e8b830';for(let k=0;k<7;k++){const a=64+6+(L2hash(k,1)*20|0),b=8+(L2hash(k,2)*14|0);x.fillRect(a,b,2,4);x.fillStyle='#b88a20';x.fillRect(a,b+3,2,1);x.fillStyle='#e8b830';}// 2 banksia with cones
  canopy(96,16,28,13,9,['#3e5a2a','#5a7a36','#7a9a46','#9ab85a'],61,3);x.fillStyle='#f6d23a';for(let k=0;k<40;k++)x.fillRect(96+5+(L2hash(k,5)*22|0),19+(L2hash(k,6)*15|0),2,1);// 3 wattle in flower
  trunk(128,16,14,40,'#e8e2d6','#b8ae9c');x.fillStyle='#e8e2d6';x.fillRect(128+11,16,6,2);x.fillRect(128+17,12,6,2);canopy(128,16,11,13,9,['#3e5a2a','#5e823e','#86aa56','#b2ce7c'],11,3);// 4 tuart gum
  canopy(160,16,34,12,5,['#5a6a72','#7a8a8e','#9aa8a8','#bcc6c2'],71,2);// 5 saltbush, blue-grey
  trunk(192,16,22,40,'#6a4a30','#4a3220');canopy(192,16,16,11,11,['#24461e','#3a6a2e','#5a9240','#86b85c'],23,3);// 6 street tree
  x.fillStyle='#9aa060';for(let k=0;k<22;k++){const a=-Math.PI*.95+k/21*Math.PI*.9;for(let t=0;t<1;t+=.1)x.fillRect(224+16+Math.cos(a)*12*t|0,39+Math.sin(a)*9*t|0,1,1);}x.fillStyle='#d4d08a';for(let k=0;k<10;k++){const a=-Math.PI*.8+k/9*Math.PI*.6;x.fillRect(224+16+Math.cos(a)*10|0,39+Math.sin(a)*8|0,1,1);}// 7 spinifex tuft
  const atT=new THREE.CanvasTexture(at);atT.magFilter=atT.minFilter=THREE.NearestFilter;atT.encoding=THREE.sRGBEncoding;
  const SIZE=[[2.2,1.6],[1.9,2.6],[3.2,3.8],[2.6,2.2],[4.6,5.6],[1.9,1.1],[3.6,4.4],[1.6,1.1]].map(([w,h])=>[w*.8,h*.8]);
  const TL=[];
  (N.houses||[]).forEach(h=>{if(h.r<.3||(h.r>.45&&h.r<.6)){const o=h.r<.3?1.4:-1.75;TL.push([h.x+Math.sin(h.a)*o*(h.r<.3?1:.6)-Math.cos(h.a)*.9,h.z-Math.cos(h.a)*o*(h.r<.3?1:.6)-Math.sin(h.a)*.9,h.t===7&&h.r<.15?7:6]);}});
  for(let k=0;k<160000&&TL.length<17000;k++){const tx=N.X0+RR()*(N.X1-N.X0),tz=RR()*N.ZMIN;const c=N.cls(tx,tz),sd=N.sd(tx,tz);if(sd<2.5||N.onRoad(tx,tz,3.6))continue;
    if(TOWNS.some(t=>Math.hypot(t.x-tx,t.z-tz)<8))continue;const r=RR();
    if(c===1){if(sd>3.2&&r<.5)TL.push([tx,tz,7]);continue;}
    if(c===2){if(r<.05&&fbm(tx/12,tz/12)>.2)TL.push([tx,tz,7]);continue;}
    if(c===3){if(r<.04)TL.push([tx,tz,5]);continue;}
    if(c===4){if(r<.62)TL.push([tx,tz,r<.42?0:r<.5?1:r<.56?3:r<.59?5:2]);continue;}
    if(c===5){if(r<.75)TL.push([tx,tz,r<.25?2:r<.42?1:r<.6?0:r<.68?4:3]);continue;}
    if(c===6){if(r<.07)TL.push([tx,tz,r<.04?4:5]);continue;}
    if(c===8){if(r<.06&&!N.houses.some(h=>Math.abs(h.x-tx)<2.2&&Math.abs(h.z-tz)<2.2))TL.push([tx,tz,6]);continue;}}
  const nT=TL.length,P2=new Float32Array(nT*12),C2=new Float32Array(nT*8),U2=new Float32Array(nT*8),N2=new Float32Array(nT*12),K2=new Float32Array(nT*12),I2=new Uint32Array(nT*6);
  const SP=new Float32Array(nT*12),SI=new Uint32Array(nT*6);
  TL.forEach(([tx,tz,kind],i)=>{const sc=.78+L2hash(tx,tz)*.5,[w,h]=SIZE[kind],y=groundAt(tx,tz)-.08,hw=w*sc/2,hh=h*sc,tint=(.86+L2hash(tz,tx)*.22)*(OWBAKE_ON?Math.min(1.08,Math.max(.7,bilB(tx,tz))):1);
    [[-hw,0,0,0],[hw,0,1,0],[-hw,hh,0,1],[hw,hh,1,1]].forEach(([cx,cy,u,v],j)=>{const o=i*4+j;P2.set([tx,y,tz],o*3);C2.set([cx,cy],o*2);U2.set([(kind+(u?.98:.02))/KINDS,v?.995:.005],o*2);N2.set([0,1,0],o*3);K2.set([tint,tint,tint],o*3);});
    const b=i*4;I2.set([b,b+1,b+2,b+1,b+3,b+2],i*6);
    const sw=hw*.7,sz=hw*.4,yy=H(tx,tz)+.06;SP.set([tx-sw+.25,yy,tz-sz+.2,tx+sw+.25,yy,tz-sz+.2,tx-sw+.25,yy,tz+sz+.2,tx+sw+.25,yy,tz+sz+.2],i*12);SI.set([b,b+2,b+1,b+1,b+2,b+3],i*6);});
  const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(P2,3));tg.setAttribute('corner',new THREE.BufferAttribute(C2,2));tg.setAttribute('uv',new THREE.BufferAttribute(U2,2));tg.setAttribute('normal',new THREE.BufferAttribute(N2,3));tg.setAttribute('color',new THREE.BufferAttribute(K2,3));tg.setIndex(new THREE.BufferAttribute(I2,1));
  const tm=new THREE.MeshLambertMaterial({map:atT,alphaTest:.5,side:THREE.DoubleSide,vertexColors:true});
  tm.onBeforeCompile=sh=>{sh.vertexShader='attribute vec2 corner;\n'+sh.vertexShader.replace('#include <begin_vertex>','vec3 rt=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]);rt.y=0.;rt=normalize(rt);vec3 transformed=position+rt*corner.x+vec3(0.,corner.y,0.);').replace('#include <project_vertex>','#include <project_vertex>\nvCamD=-mvPosition.z;');sh.vertexShader='varying float vCamD;\n'+sh.vertexShader;
    sh.fragmentShader='varying float vCamD;\n'+sh.fragmentShader.replace('#include <alphatest_fragment>','#include <alphatest_fragment>\nif(vCamD<7.)discard;if(vCamD<13.&&mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.)<1.)discard;');};
  const trees=new THREE.Mesh(tg,tm);trees.frustumCulled=false;trees.userData.L='plants';scene.add(trees);N.trees=trees;N.plants=nT;window.__OWN=N;
  // soft contact shadows under the plants (a pixel oval texture, one flat mesh)
  const shc=document.createElement('canvas');shc.width=shc.height=8;{const y=shc.getContext('2d');y.fillStyle='rgba(18,26,14,.34)';y.fillRect(2,1,4,6);y.fillRect(1,2,6,4);}const csT=new THREE.CanvasTexture(shc);csT.magFilter=csT.minFilter=THREE.NearestFilter;
  const sg2=new THREE.BufferGeometry();const SU=new Float32Array(nT*8);for(let i=0;i<nT;i++)SU.set([0,0,1,0,0,1,1,1],i*8);sg2.setAttribute('position',new THREE.BufferAttribute(SP,3));sg2.setAttribute('uv',new THREE.BufferAttribute(SU,2));sg2.setIndex(new THREE.BufferAttribute(SI,1));
  const sm=new THREE.Mesh(sg2,new THREE.MeshBasicMaterial({map:csT,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));sm.frustumCulled=false;sm.userData.L='plants';scene.add(sm);
  function bilB(x,z){let i=(x-X0)/CE,r=-z/CE;i=Math.max(0,Math.min(NC-1.001,i));r=Math.max(0,Math.min(NRW-1.001,r));const i0=i|0,r0=r|0,fx=i-i0,fz=r-r0,k=r0*NC+i0,A=D.BKN;return (A[k]*(1-fx)+A[k+1]*fx)*(1-fz)+(A[k+NC]*(1-fx)+A[k+NC+1]*fx)*fz;}
}
// clouds also drift over the coast to the north
function NORTHpost(){window.__OWsnap=()=>{camInit=false;};if(!NORTH||!L2||!L2.clouds||!L2.clouds.length)return;const m=L2.clouds[0].material,RR=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(77);
  for(let k=0;k<34;k++){const s3=new THREE.Sprite(m);const sc=36+RR()*30;s3.scale.set(sc,sc*.375,1);s3.position.set(RR()*WX*1.4-WX*.2,48+RR()*26,NORTH.ZMIN*RR());s3.layers.mask=L2.clouds[0].layers.mask;s3.userData.L='lights';scene.add(s3);L2.clouds.push(s3);}}
