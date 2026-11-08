// ===== 3. plants: the game's own sprites, LOOK2-painted (leaf clumps, golden rim), one atlas, chunked billboards =====
const SRC=[];
const tvSrc=i=>{const t=treeVariants[i]&&treeVariants[i].t;if(!t)return null;const s=(t.__l2&&t.__l2.v1)||t.__src||t.image;return s&&s.getContext&&s.width<=48?s:null;};
const blobs=(r,n,cx,cy,sx,sy,r0,r1)=>{const b=[];for(let i=0;i<n;i++)b.push([cx+(r()-.5)*sx,cy+(r()-.5)*sy,r0+r()*r1]);return b;};
const paleTrunk=(c,x0,y0,w,col,col2)=>{const x=c.getContext('2d');PP(x,'#2a2a24',x0-1,y0,w+2,c.height-y0);PP(x,col,x0,y0,w,c.height-y0);PP(x,col2,x0+w-1,y0,1,c.height-y0);};
const over=(a,b)=>{a.getContext('2d').drawImage(b,0,0);return a;};
const dots=(c,cols,n,x0,y0,w,h,sz,seed)=>{const x=c.getContext('2d'),r=rng(seed),d=x.getImageData(0,0,c.width,c.height).data;for(let k=0;k<n;k++){const X=x0+r()*w|0,Y=y0+r()*h|0;if(d[(Y*c.width+X)*4+3]<128)continue;PP(x,cols[k%cols.length],X,Y,sz,sz);}return c;};
// 0 gum (white trunk)
{const r=mulberry32(901),c=mkc(32,44);paleTrunk(c,14,20,4,'#e8e2d6','#b8ae9c');const x=c.getContext('2d');PP(x,'#e8e2d6',10,22,4,2);PP(x,'#e8e2d6',18,18,4,2);SRC[0]=over(c,canopy(32,44,blobs(r,6,16,12,18,10,5,4),['#3e5a2a','#5e823e','#86aa56','#b2ce7c'],r,null));}
// 1 peppermint (weeping)
{const r=mulberry32(902),c=canopy(32,44,blobs(r,8,16,17,22,14,5,4),['#33502e','#4f7044','#6f9058','#98b878'],r,[14,26]);const x=c.getContext('2d');for(let k=0;k<9;k++)PP(x,'#33502e',5+k*2.6,24+(k%3),1,4+(k%2)*2);SRC[1]=c;}
// 2 street tree (the game's own)
SRC[2]=tvSrc(0)||canopy(32,44,blobs(mulberry32(903),7,16,13,15,11,6,5),TREE_COLS[0],mulberry32(903),[14,24]);
// 3 jacaranda
{const r=mulberry32(904);SRC[3]=canopy(32,44,blobs(r,7,16,13,18,10,5,4),['#4a3a6e','#6a56a0','#8a76c0','#b0a0dc'],r,[14,24]);}
// 4 Norfolk pine (the game's own)
SRC[4]=(()=>{try{return pineVariant().t.image;}catch(e){return null;}})()||canopy(24,52,[[12,20,9]],TREE_COLS[2],mulberry32(9),[10,40]);
// 5 palm
{const c=mkc(24,48),x=c.getContext('2d');for(let y=14;y<48;y++){PP(x,'#3a2a1a',10,y,5,1);PP(x,y%3?'#8a7a62':'#6a5a40',11,y,3,1);}const F=['#2e5a26','#4e8236','#78aa4c'];
  for(let l=0;l<3;l++)for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI+l*.12;for(let t=0;t<1;t+=.07){PP(x,F[l],12+Math.cos(a)*11*t,13+Math.sin(a)*5*t+t*t*9-l,2,1);}}PP(x,'#6a4a2a',11,12,3,3);SRC[5]=c;}
// 6 banksia with cones
{const r=mulberry32(906),c=canopy(32,40,blobs(r,6,16,14,18,10,5,4),['#2a4a2a','#3e6236','#5a7e48','#7a9a5e'],r,[14,26]);const x=c.getContext('2d');for(let k=0;k<8;k++){const a=7+HSH(k,1)*18|0,b=7+HSH(k,2)*14|0;PP(x,'#c88a20',a,b,2,4);PP(x,'#f0c040',a,b,2,1);}SRC[6]=c;}
// 7 grass tree: black trunk, dry skirt, spiky crown, flower spike
{const c=mkc(24,40),x=c.getContext('2d');PP(x,'#1c1816',10,24,5,16);PP(x,'#3a302a',12,24,1,16);PP(x,'#8a7448',8,22,9,4);for(let k=0;k<13;k++){const a=-Math.PI+k/12*Math.PI;for(let t=0;t<1;t+=.08){PP(x,k%2?'#4e8236':'#78aa4c',12+Math.cos(a)*10*t,22+Math.sin(a)*8*t+t*t*3,1,1);}}PP(x,'#3a2a1a',11,2,2,12);PP(x,'#d8c890',11,3,2,7);SRC[7]=c;}
// 8 coastal heath, 9 saltbush, 10 wattle (bushes)
{const r=mulberry32(908);SRC[8]=dots(canopy(16,10,blobs(r,4,8,6,8,2,3.5,2),['#3a5232','#56704a','#74905c','#98ae76'],r,null),['#f2d24a','#c86ad8'],4,1,1,14,7,1,8);}
{const r=mulberry32(909);SRC[9]=canopy(16,10,blobs(r,4,8,6,8,2,3.5,2),['#4a5e5a','#6a7e76','#8a9c90','#a8b8a8'],r,null);}
{const r=mulberry32(910);SRC[10]=dots(canopy(16,12,blobs(r,5,8,6,9,4,3.5,2),['#3e5a2a','#5a7a36','#7a9a46','#9ab85a'],r,null),['#f6d23a','#ffe060'],22,1,1,14,9,1,10);}
// 11 bottlebrush
{const r=mulberry32(911);SRC[11]=dots(canopy(28,34,blobs(r,6,14,12,16,10,4,4),['#2e4e2a','#4a6e3a','#6a8e4a','#8aae5e'],r,[12,22]),['#d8323a','#b82030'],12,4,3,20,16,1,11);}
// 12 spinifex tuft
{const c=mkc(14,8),x=c.getContext('2d');for(let k=0;k<12;k++){const a=-Math.PI*.95+k/11*Math.PI*.9;for(let t=0;t<1;t+=.15)PP(x,k%2?'#9aa060':'#7a8a4a',7+Math.cos(a)*6.5*t,7.8+Math.sin(a)*7*t);}PP(x,'#d4d08a',3,2,1,1);PP(x,'#d4d08a',9,1,1,1);SRC[12]=c;}
// 13 tuart (big gum)
{const r=mulberry32(913),c=mkc(32,48);paleTrunk(c,13,20,5,'#d8d0c0','#a89c88');SRC[13]=over(c,canopy(32,48,blobs(r,8,16,13,24,14,5,4),['#3e5a2a','#5e823e','#86aa56','#b2ce7c'],r,null));}
// 14 dead tree (outback): bare grey branches
{const c=mkc(24,36),x=c.getContext('2d');const br=(x0,y0,a,l,w)=>{for(let t=0;t<l;t++){PP(x,'#2a2420',x0+Math.cos(a)*t-1,y0-Math.sin(a)*t,w+2,1);PP(x,t%4?'#a89a8a':'#8a7c6c',x0+Math.cos(a)*t,y0-Math.sin(a)*t,w,1);}};
  br(11,36,Math.PI/2,18,3);br(12,20,1.1,12,2);br(12,22,2.2,11,2);br(14,28,.6,7,1);br(10,26,2.6,7,1);br(17,12,1.6,6,1);SRC[14]=c;}
// 15 mulga shrub (outback)
{const r=mulberry32(915);SRC[15]=canopy(24,24,blobs(r,6,12,10,16,8,3.5,2.5),['#4a5038','#646a48','#808458','#9ea070'],r,[11,16]);}
// 16 green grass tuft, 17 dry tuft, 18 wildflowers, 19 saltbush in red country, 20 bush with red berries, 21 desert grass red
const tuft=(cols,seed,flw)=>{const c=mkc(12,8),x=c.getContext('2d'),r=rng(seed);for(let k=0;k<10;k++){const X=1+r()*10,h=3+r()*5;for(let t=0;t<h;t++)PP(x,cols[(k+t)%cols.length],X+(r()-.5)*.8*t*.3,7-t);}if(flw)for(let k=0;k<4;k++)PP(x,flw[k%flw.length],2+r()*8,1+r()*4);return c;};
SRC[16]=tuft(['#3c5e2c','#5a863a','#86ae52'],16);SRC[17]=tuft(['#76703c','#a29a54','#cec27c'],17);SRC[18]=tuft(['#4a7232','#6e9a44'],18,['#f2d24a','#e86aa8','#f4f2ec']);
{const r=mulberry32(919);SRC[19]=canopy(16,9,blobs(r,4,8,5,8,2,3,2),['#6a6a5a','#8a8a72','#a8a88c','#c4c2a8'],r,null);}
{const r=mulberry32(920);SRC[20]=dots(canopy(16,10,blobs(r,4,8,6,8,2,3.5,2),['#3a5236','#56704a','#76905e','#9ab07a'],r,null),['#c83a3a'],8,1,1,14,7,1,20);}
SRC[21]=tuft(['#8a6a3a','#b08a4a','#d0b070'],21);
const NK=SRC.length,SCp=(typeof PLANT3X_ON!=='undefined'&&PLANT3X_ON)?3:2;
const PAINT=SRC.map((s,i)=>{let img=null,rim=null;try{const P2=plantParse(s);if(P2){const r=plantPaint(P2,0,1000+i*37);img=r.img;rim=r.rim;}}catch(e){img=null;}
  if(!img){img=mkc(s.width*SCp,s.height*SCp);const x=img.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(s,0,0,img.width,img.height);}return{img,rim};});
const CW=Math.max(...PAINT.map(p=>p.img.width)),CHh=Math.max(...PAINT.map(p=>p.img.height)),ACOL=8,AROW=Math.ceil(NK/ACOL);
const pAt=mkc(CW*ACOL,CHh*AROW),pRim=mkc(CW*ACOL,CHh*AROW),pax=pAt.getContext('2d'),prx=pRim.getContext('2d');PP(prx,'#000',0,0,pRim.width,pRim.height);
const BOX=PAINT.map((p,i)=>{const ox=(i%ACOL)*CW,oy=((i/ACOL)|0)*CHh,w=p.img.width,h=p.img.height,dx=ox+((CW-w)>>1),dy=oy+CHh-h;pax.drawImage(p.img,dx,dy);if(p.rim)prx.drawImage(p.rim,dx,dy);
  const d=p.img.getContext('2d').getImageData(0,0,w,h).data;let x0=w,x1=0,y0=h;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>127){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;}
  if(x1<x0){x0=0;x1=w-1;y0=0;}const W2=pAt.width,H2=pAt.height;return{u0:(dx+x0)/W2,u1:(dx+x1+1)/W2,v0:1-(dy+h)/H2,v1:1-(dy+y0)/H2,asp:(x1-x0+1)/(h-y0)};});
// a rim mask that is empty: paint it from the sprite's lit top-left edge
{const id=pax.getImageData(0,0,pAt.width,pAt.height),rd=prx.getImageData(0,0,pRim.width,pRim.height),A=id.data,Bd=rd.data,W2=pAt.width;let any=0;for(let i=0;i<Bd.length;i+=4)if(Bd[i]>20)any++;
  if(any<50)for(let y=1;y<pAt.height;y++)for(let x=1;x<W2;x++){const o=(y*W2+x)*4;if(A[o+3]<128)continue;if(A[o-W2*4+3]<128||A[o-4+3]<128){Bd[o]=255;Bd[o+1]=200;Bd[o+2]=110;Bd[o+3]=255;}}prx.putImageData(rd,0,0);}
const pTex=TX(pAt),pRimT=TX(pRim);
const plantMat=new THREE.MeshLambertMaterial({map:pTex,alphaTest:.5,side:THREE.DoubleSide,vertexColors:true,emissive:new THREE.Color(0,0,0),emissiveMap:pRimT});
const PU={uT:{value:0}};
plantMat.onBeforeCompile=sh=>{sh.uniforms.uT=PU.uT;sh.vertexShader='attribute vec2 corner;uniform float uT;varying float vCamD;\n'+sh.vertexShader.replace('#include <begin_vertex>','vec3 rt=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]);rt.y=0.;rt=normalize(rt);float sw=sin(uT*1.7+position.x*.37+position.z*.23)+.5*sin(uT*2.9+position.x*.11);vec3 transformed=position+rt*(corner.x+sw*.045*corner.y)+vec3(0.,corner.y,0.);').replace('#include <project_vertex>','#include <project_vertex>\nvCamD=-mvPosition.z;');
  sh.fragmentShader='varying float vCamD;\n'+sh.fragmentShader.replace('#include <alphatest_fragment>','#include <alphatest_fragment>\nif(vCamD<6.)discard;if(vCamD<11.&&mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.)<1.)discard;');};
// build chunked billboard meshes from a list [x,y,z,kind,height,tint]
function plants(list,L,cs){const by=new Map();list.forEach(p=>{const k=Math.floor(p[0]/cs)+','+Math.floor(p[2]/cs);if(!by.has(k))by.set(k,[]);by.get(k).push(p);});
  for(const [,arr] of by){const n=arr.length,P3=new Float32Array(n*12),C2=new Float32Array(n*8),U2=new Float32Array(n*8),N3=new Float32Array(n*12),K3=new Float32Array(n*12),I=new Uint32Array(n*6);let cx=0,cz=0,mx=0;
    arr.forEach(([x,y,z,kind,h,t],i)=>{const B=BOX[kind],hw=h*B.asp/2;cx+=x;cz+=z;mx=Math.max(mx,h);
      [[-hw,0,B.u0,B.v0],[hw,0,B.u1,B.v0],[-hw,h,B.u0,B.v1],[hw,h,B.u1,B.v1]].forEach(([a,b,u,v],j)=>{const o=i*4+j;P3[o*3]=x;P3[o*3+1]=y;P3[o*3+2]=z;C2[o*2]=a;C2[o*2+1]=b;U2[o*2]=u;U2[o*2+1]=v;N3[o*3+1]=1;K3[o*3]=t;K3[o*3+1]=t;K3[o*3+2]=t*.97;});
      const b=i*4;I.set([b,b+1,b+2,b+1,b+3,b+2],i*6);});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P3,3));g.setAttribute('corner',new THREE.BufferAttribute(C2,2));g.setAttribute('uv',new THREE.BufferAttribute(U2,2));g.setAttribute('normal',new THREE.BufferAttribute(N3,3));g.setAttribute('color',new THREE.BufferAttribute(K3,3));g.setIndex(new THREE.BufferAttribute(I,1));
    g.computeBoundingSphere();g.boundingSphere.radius+=mx+2;const m=new THREE.Mesh(g,plantMat);m.userData.L=L||'plants';m.userData.c=[cx/n,cz/n,g.boundingSphere.radius];scene.add(m);O.chunks.push(m);}}
// read the old billboard meshes (their spots, heights and baked tints), map their kinds onto the new atlas, then remove them
const MAPS=[[[0,13,0],[2,1,2],[3],[5],[4],[8,9,10,8],[11],[1]],[[8,10,8,20],[7],[6],[10],[13],[9],[2,1,2,1,11],[12]]];
const PL=[];
[[L2&&L2.trees,0],[N&&N.trees,1]].forEach(([mesh,mi])=>{if(!mesh)return;const g=mesh.geometry,pos=g.attributes.position,cor=g.attributes.corner,uv=g.attributes.uv,cl=g.attributes.color,n=pos.count/4;
  for(let i=0;i<n;i++){const o=i*4,x=pos.getX(o),y=pos.getY(o),z=pos.getZ(o),kind=Math.min(7,Math.floor(uv.getX(o)*8)),hh=cor.getY(o+2),t0=cl.getX(o);const opts=MAPS[mi][kind],h=HSH(x,z),nk=opts[(h*opts.length)|0];
    const bk=mi===0?Math.max(.74,Math.min(1.08,bakeAt(x,z))):1;let H2=hh*(nk===4?1.15:nk===5?1.05:1);PL.push([x,y,z,nk,H2,Math.min(1.15,t0*bk)]);}
  mesh.visible=false;mesh.parent.remove(mesh);g.dispose();});
// a few more in the south: bush on the river flats and the hills, banksia woodland, saltbush on the dunes
{const RR=rng(5150);let add=0;for(let k=0;k<30000&&add<6000;k++){const x=RR()*WX,z=RR()*WZ,i=(z|0)*WX+(x|0);if(!LAND[i]||!L2||L2.SUB[i]||L2.RV[i]<3.4||(BLOCK&&BLOCK[i]))continue;const kk=L2.KK[i];if(kk===1||kk===2)continue;if(TOWNS.some(t=>Math.hypot(t.x-x,t.z-z)<10))continue;
  if(kk===3){if(DL[i]<3||RR()<.5)continue;PL.push([x,groundAt(x,z)-.06,z,RR()<.5?9:8,1.3+RR()*.5,bakeAt(x,z)]);add++;continue;}
  if(fbm(x/18,z/18)<-.05&&kk!==4)continue;const r=RR();const nk=r<.3?0:r<.45?1:r<.6?6:r<.72?20:r<.86?8:7;const hh=[4.4,3.8,0,0,0,0,3.3,2.6,1.4,0,0,0,0,0,0,0,0,0,0,0,1.4][nk]*(.8+RR()*.4);PL.push([x,groundAt(x,z)-.06,z,nk,hh,Math.max(.74,Math.min(1.08,bakeAt(x,z)))*(.9+RR()*.15)]);add++;}}

