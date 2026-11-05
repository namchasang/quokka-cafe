// ---------- LOOK2 (Look Lab): pixel-art ground, Perth suburbs, pixel trees in one draw call, clouds ----------
// The ground becomes a crisp pixel painting (dithered 7-tone ramps, like a hand-made overworld tile map) at 3 pixels per unit.
// Between the towns: suburbs on curving streets (low-poly houses, lawns, driveways, backyard pools, fences),
// parks with ovals, bushland on the hills, coastal heath on the dunes, wet sand and foam at the shore.
// Trees, bushes and palms stay pixel sprites that face the camera (one instanced billboard mesh).
var L2=null;// filled by L2paint (runs early, while the terrain is built)
function L2hash(x,z){const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s);}
function L2paint(mesh,gc){
  L2={on:true};const PU=3,CW=WX*PU,CH=WZ*PU,N=WX*WZ;
  // 1. colour and ground class on the 1-unit grid (same rules as the old vertex colours)
  const COL=new Float32Array(N*3),KK=new Uint8Array(N),c=new THREE.Color();
  for(let z=0;z<WZ;z++)for(let x=0;x<WX;x++){const i=z*WX+x,xx=x+.5,zz=z+.5,h=H(xx,zz),d=LAND[i]?DL[i]:-DW[i];
    const sl=Math.hypot(H(xx+1,zz)-H(xx-1,zz),H(xx,zz+1)-H(xx,zz-1))/2;c.k=5;gc(xx,zz,h,d,sl,c);KK[i]=c.k;c.convertLinearToSRGB();COL[i*3]=c.r*255;COL[i*3+1]=c.g*255;COL[i*3+2]=c.b*255;}
  // 2. where the suburbs go: flat turf away from the shore, the hills, Kings Park, the towns and the highways
  const TW=[CBDP,FRP,G(115.851,-31.976),G(115.881,-31.962),G(115.896,-31.979),G(115.742,-32.050)],AIR=G(115.967,-31.941);
  const SUB=new Uint8Array(N),RV=new Float32Array(N).fill(99);
  for(let z=0;z<WZ;z++)for(let x=0;x<WX;x++){const i=z*WX+x;if(!LAND[i]||KK[i]!==5||DL[i]<6)continue;if(elevAt(x,z)>42)continue;
    if(Math.hypot(x-KPP[0],z-KPP[1])<22||Math.hypot(x-AIR[0],z-AIR[1])<34||TW.some(t=>Math.hypot(x-t[0],z-t[1])<16))continue;if(fbm(x/45+11,z/45-3)<-.26)continue;SUB[i]=1;}
  ROADS.forEach(r=>{for(let k=1;k<r.p.length;k++){const a=r.p[k-1],b=r.p[k];const x0=Math.max(0,Math.min(a[0],b[0])-5|0),x1=Math.min(WX-1,Math.max(a[0],b[0])+5|0),z0=Math.max(0,Math.min(a[1],b[1])-5|0),z1=Math.min(WZ-1,Math.max(a[1],b[1])+5|0);
    for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const d=segDist(x+.5,z+.5,a,b),i=z*WX+x;if(d<RV[i])RV[i]=d;if(d<3.6)SUB[i]=0;}}});
  // curving streets: a regular grid seen through a gentle warp, so the blocks bend like real suburbs
  const SX=12,SZ=9.5,SW=2.3,WPa=(x,z)=>x+7*noise(x/55,z/55),WPb=(x,z)=>z+7*noise(x/55+17,z/55+5);
  const inv=(a,b)=>{let x=a,z=b;for(let k=0;k<4;k++){x+=a-WPa(x,z);z+=b-WPb(x,z);}return[x,z];};
  const md=(v,m)=>((v%m)+m)%m;
  L2.SUB=SUB;L2.inv=inv;L2.PAL=null;
  // 3. pixels: smooth colour, quantised to hand-picked ramps with an ordered (Bayer) dither
  const hx=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
  const P=a=>a.map(hx);
  const PAL=[P(['#e8dcb4','#c8b888','#9ac8b8','#6ab8b0','#4a9a9a','#2a6a78','#1e5462']),// 0 under the sea
    P(['#5a5a5e','#70706e','#888680','#9e9a92','#b2aea4','#c4c0b6','#d6d2c8']),// 1 city ground
    P(['#5a2a22','#74362a','#8e4632','#a8583c','#c06c48','#d4845a','#e4a074']),// 2 red cliffs
    P(['#8a7a58','#a08e66','#b8a476','#ccb886','#dcc898','#e8d8aa','#f4e6be','#9aa070','#b0b47c']),// 3 sand and dune grass
    P(['#28382a','#324632','#3e5438','#4a6440','#58744a','#6a8456','#7e9666','#9c9468','#b0623e','#a86848']),// 4 heath on the hills
    P(['#2f4a24','#3c5e2c','#4a7232','#5a863a','#6e9a44','#86ae52','#a2c068','#5e5c32','#76703c','#8c8446','#a29a54','#b8ae66','#a8583c','#c06c48','#d4845a'])];// 5 turf, dry grass, red dirt
  const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  const cv=document.createElement('canvas');cv.width=CW;cv.height=CH;const g=cv.getContext('2d');const img=g.createImageData(CW,CH),D=img.data;
  const ASP=hx('#5c5e62'),KERB=hx('#c8c4b8'),WET=hx('#b4a47e'),FOAM=hx('#f4f4ec'),VERGE=P(['#b8ae8a','#a8a07c','#c8bc98','#9a9470']);
  for(let py=0;py<CH;py++){const z=(py+.5)/PU,cz=Math.min(WZ-2,Math.max(0,z-.5)),z0=cz|0,fz=cz-z0;
    for(let px=0;px<CW;px++){const x=(px+.5)/PU,cx=Math.min(WX-2,Math.max(0,x-.5)),x0=cx|0,fx=cx-x0,i0=z0*WX+x0,o=(py*CW+px)*4;
      const ci=(Math.min(WZ-1,z|0))*WX+Math.min(WX-1,x|0);let col=null;
      if(SUB[ci]){const sa=md(WPa(x,z),SX),sb=md(WPb(x,z),SZ);if(sa<SW||sb<SW){const e=Math.min(sa<SW?Math.min(sa,SW-sa):9,sb<SW?Math.min(sb,SW-sb):9);col=e<.3?KERB:ASP;}}
      else if(RV[ci]>2.1&&RV[ci]<3.3&&LAND[ci]){const v=VERGE[(BAY[(py&3)*4+(px&3)]+(L2hash(px,py)*6|0))%4];col=v;}
      if(!col&&LAND[ci]&&DL[ci]===1&&KK[ci]===3){col=L2hash(px*.7,py*1.3)<.3?FOAM:WET;}
      if(!col){const w00=(1-fx)*(1-fz),w10=fx*(1-fz),w01=(1-fx)*fz,w11=fx*fz;
        const r=COL[i0*3]*w00+COL[(i0+1)*3]*w10+COL[(i0+WX)*3]*w01+COL[(i0+WX+1)*3]*w11,gg=COL[i0*3+1]*w00+COL[(i0+1)*3+1]*w10+COL[(i0+WX)*3+1]*w01+COL[(i0+WX+1)*3+1]*w11,b=COL[i0*3+2]*w00+COL[(i0+1)*3+2]*w10+COL[(i0+WX)*3+2]*w01+COL[(i0+WX+1)*3+2]*w11;
        const jx=x+(L2hash(px,py)-.5)*.9,jz=z+(L2hash(py,px)-.5)*.9,kj=KK[(Math.min(WZ-1,Math.max(0,jz|0)))*WX+Math.min(WX-1,Math.max(0,jx|0))];
        const t=(BAY[(py&3)*4+(px&3)]-7.5)*2.2,pal=PAL[kj];let best=pal[0],bd=1e9;
        for(let k=0;k<pal.length;k++){const q=pal[k],dr=r+t-q[0],dg=gg+t-q[1],db=b+t-q[2],dd=dr*dr*.3+dg*dg*.59+db*db*.11;if(dd<bd){bd=dd;best=q;}}
        col=best;
        // grass tufts and wildflowers, a pixel here and there
        if(kj===5||kj===4){const hh=L2hash(px*1.7,py*2.3);if(hh<.035)col=[Math.min(255,col[0]+26),Math.min(255,col[1]+30),Math.min(255,col[2]+12)];else if(hh>.992)col=kj===4?hx(['#f2d24a','#f4f2ec','#c86ad8'][(hh*1000|0)%3]):hx(['#f4f2ec','#f2d24a'][(hh*1000|0)%2]);}}
      D[o]=col[0];D[o+1]=col[1];D[o+2]=col[2];D[o+3]=255;}}
  g.putImageData(img,0,0);
  // 4. house lots, parks and ovals (drawn over the pixels, in world units)
  g.setTransform(PU,0,0,PU,0,0);g.imageSmoothingEnabled=false;
  const HOUSES=[],PARKS=[],TREES2=[];
  const LAWN=['#5e9a3e','#6aa444','#76ac4a','#86b252','#8eae56','#a4a85e'];const pick=(a,s)=>a[(s*a.length)|0];
  for(let bb=-1;bb<WZ/SZ+2;bb++)for(let ba=-1;ba<WX/SX+2;ba++){const s=L2hash(ba*3.1,bb*7.7);
    const ca=ba*SX+SW+(SX-SW)/2,cb=bb*SZ+SW+(SZ-SW)/2,[px,pz]=inv(ca,cb);if(px<0||pz<0||px>=WX||pz>=WZ)continue;
    const [ax,az]=inv(ca+1,cb),ang=Math.atan2(az-pz,ax-px);
    if(s<.075){if(!SUB[(pz|0)*WX+(px|0)])continue;PARKS.push([px,pz,ang]);continue;}
    for(let row=0;row<2;row++)for(let k=0;k<3;k++){const la=SW+1.65+k*3.2,lb=row?SZ-1.55:SW+1.55,[hx2,hz]=inv(ba*SX+la,bb*SZ+lb);
      if(hx2<2||hz<2||hx2>WX-2||hz>WZ-2)continue;let ok=true;for(const [dx,dz] of [[-1.4,-1.2],[1.4,-1.2],[-1.4,1.2],[1.4,1.2],[0,0]]){const i=((hz+dz)|0)*WX+((hx2+dx)|0);if(!SUB[i]){ok=false;break;}}if(!ok)continue;
      const r=L2hash(hx2*13.1,hz*7.3);HOUSES.push({x:hx2,z:hz,a:ang,f:row?1:-1,r});}}
  const ca2=Math.cos,sa2=Math.sin;
  HOUSES.forEach(h=>{g.save();g.translate(h.x,h.z);g.rotate(h.a);
    g.fillStyle=pick(LAWN,h.r);g.fillRect(-1.6,-2.05,3.2,4.1);// the lot
    g.fillStyle='#e8e2d2';g.fillRect(-1.6,-2.05,3.2,.08);g.fillRect(-1.6,-2.05,.08,4.1);// side and back fences
    g.fillStyle='#9a9890';g.fillRect(.7,h.f<0?-2.05:.9,.7,1.15);// driveway to the street
    if(h.r>.72){g.fillStyle='#e8f4f4';g.fillRect(-1.15,h.f<0?1.05:-1.85,1.1,.75);g.fillStyle='#38b8d8';g.fillRect(-1.05,h.f<0?1.13:-1.77,.9,.59);}// backyard pool
    else if(h.r<.3){g.fillStyle='rgba(30,40,20,.28)';g.beginPath();g.ellipse(-.9,h.f<0?1.4:-1.4,.75,.5,0,0,7);g.fill();TREES2.push([h.x+ca2(h.a)*-.9-sa2(h.a)*(h.f<0?1.4:-1.4),h.z+sa2(h.a)*-.9+ca2(h.a)*(h.f<0?1.4:-1.4),h.r<.035?2:h.r<.12?7:1]);}
    if(h.r>.45&&h.r<.62){TREES2.push([h.x+ca2(h.a)*-1.1-sa2(h.a)*h.f*-1.75,h.z+sa2(h.a)*-1.1+ca2(h.a)*h.f*-1.75,h.r<.5?6:1]);}// a little tree out the front
    g.restore();});
  PARKS.forEach(([x,z,a])=>{g.save();g.translate(x,z);g.rotate(a);g.fillStyle='#78b04c';g.fillRect(-4.9,-3.6,9.8,7.2);g.fillStyle='#8ec05a';g.beginPath();g.ellipse(0,0,4,2.8,0,0,7);g.fill();
    g.strokeStyle='#f4f2ec';g.lineWidth=.12;g.beginPath();g.ellipse(0,0,3.6,2.5,0,0,7);g.stroke();g.fillStyle='#d8c89a';g.fillRect(-.25,-.6,.5,1.2);g.restore();// an oval with its cricket pitch
    for(let k=0;k<10;k++){const t=k/10*6.283;TREES2.push([x+ca2(t+a)*4.6*1.06,z+sa2(t+a)*3.3*1.06,L2hash(x+k,z)<.3?0:1]);}});
  L2.HOUSES=HOUSES;L2.PARKS=PARKS;L2.TREES2=TREES2;L2.canvas=cv;L2.g=g;L2.KK=KK;L2.RV=RV;
  const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=4;t.encoding=THREE.sRGBEncoding;L2.tex=t;
  mesh.material=new THREE.MeshStandardMaterial({map:t,roughness:.95});
  // houses and fences stop Kip and the car (streets and parks stay open)
  BLOCK=new Uint8Array(N);HOUSES.forEach(h=>{for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const x=Math.round(h.x+dx*.9-.5),z=Math.round(h.z+dz*.9-.5);if(x>=0&&z>=0&&x<WX&&z<WZ)BLOCK[z*WX+x]=1;}});
}
function L2objects(){if(!L2)return;
  // ---- houses: two instanced meshes (walls with pixel windows, hipped roofs) ----
  const H2=L2.HOUSES,n=H2.length;
  const wt=(()=>{const c=document.createElement('canvas');c.width=16;c.height=12;const x=c.getContext('2d');x.fillStyle='#ffffff';x.fillRect(0,0,16,12);x.fillStyle='#3a4656';x.fillRect(2,4,4,4);x.fillRect(10,4,4,4);x.fillStyle='#d8d8d8';x.fillRect(2,8,4,1);x.fillRect(10,8,4,1);x.fillStyle='#6a4a32';x.fillRect(7,5,2,7);x.fillStyle='#c8c8c8';x.fillRect(0,11,16,1);
    const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;return t;})();
  const bg=new THREE.BoxGeometry(1,1,1);bg.translate(0,.5,0);const rg=new THREE.ConeGeometry(.7071*1.12,1,4);rg.rotateY(Math.PI/4);rg.translate(0,.5,0);
  const body=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({map:wt}),n),roof=new THREE.InstancedMesh(rg,new THREE.MeshLambertMaterial({}),n);
  const WALL=['#efe6d4','#e8dcc4','#f4f2ec','#d8c8b0','#c89a78','#b8705a','#e2d6c0','#d0c8bc'],ROOF=['#b8562e','#a8482a','#c8683e','#b05a36','#5a5e64','#46494e','#8a8e94','#6a7a6a','#e6e4de'];
  const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3(),col=new THREE.Color();
  H2.forEach((h,i)=>{const w=2.5+h.r*.5,d=2.2+L2hash(h.r,1)*.4,tall=L2hash(h.r,2)<.1,ht=tall?2.3:1.25+L2hash(h.r,3)*.3,y=H(h.x,h.z);e.set(0,-h.a,0);q.setFromEuler(e);
    v.set(h.x,y,h.z);s.set(w,ht,d);m4.compose(v,q,s);body.setMatrixAt(i,m4);col.set(WALL[(L2hash(h.r,4)*WALL.length)|0]).convertSRGBToLinear();body.setColorAt(i,col);
    v.set(h.x,y+ht,h.z);s.set(w*1.04,.75+L2hash(h.r,5)*.4,d*1.04);m4.compose(v,q,s);roof.setMatrixAt(i,m4);const rr=L2hash(h.r,6);col.set(ROOF[rr<.55?(rr*5.4|0)%4:4+((rr-.55)/.45*5|0)%5]).convertSRGBToLinear();roof.setColorAt(i,col);});
  [body,roof].forEach(m=>{m.castShadow=m.receiveShadow=true;m.userData.L='build';m.frustumCulled=false;scene.add(m);});
  // ---- pixel trees: an atlas of 8 kinds, one billboard mesh that turns to face the camera ----
  const CWp=32,CHp=40,KINDS=8,at=document.createElement('canvas');at.width=CWp*KINDS;at.height=CHp;const x=at.getContext('2d');
  const disc=(ox,cx,cy,r,c)=>{x.fillStyle=c;for(let j=-r;j<=r;j++){const w=Math.round(Math.sqrt(r*r-j*j));x.fillRect(ox+cx-w,cy+j,w*2+1,1);}};
  const canopy=(ox,cx,cy,rx,ry,ramp,seed)=>{let s2=seed;const rnd=()=>(s2=(s2*16807)%2147483647)/2147483647;
    for(let k=0;k<30;k++){const a=rnd()*6.28,d=Math.sqrt(rnd());disc(ox,cx+Math.cos(a)*rx*d|0,cy+Math.sin(a)*ry*d|0,3,ramp[0]);}
    for(let k=0;k<26;k++){const a=rnd()*6.28,d=Math.sqrt(rnd())*.85;disc(ox,cx+Math.cos(a)*rx*d-1|0,cy+Math.sin(a)*ry*d-1|0,3,ramp[1]);}
    for(let k=0;k<18;k++){const a=rnd()*6.28,d=Math.sqrt(rnd())*.7;disc(ox,cx+Math.cos(a)*rx*d-2|0,cy+Math.sin(a)*ry*d-2|0,2,ramp[2]);}
    for(let k=0;k<10;k++){const a=3.6+rnd()*1.6,d=Math.sqrt(rnd())*.75;disc(ox,cx+Math.cos(a)*rx*d|0,cy+Math.sin(a)*ry*d|0,1,ramp[3]);}};
  const trunk=(ox,cx,y0,y1,c,c2)=>{x.fillStyle=c;x.fillRect(ox+cx-1,y0,3,y1-y0);x.fillStyle=c2;x.fillRect(ox+cx+1,y0,1,y1-y0);};
  // 0 gum: white trunk, olive canopy
  trunk(0,16,16,40,'#e8e2d6','#b8ae9c');x.fillStyle='#e8e2d6';x.fillRect(11,18,6,2);x.fillRect(17,14,6,2);canopy(0,16,13,12,9,['#3e5a2a','#5e823e','#86aa56','#b2ce7c'],11);
  // 1 street tree: round, rich green
  trunk(32,16,22,40,'#6a4a30','#4a3220');canopy(32,16,16,11,11,['#24461e','#3a6a2e','#5a9240','#86b85c'],23);
  // 2 jacaranda: purple, Perth in spring
  trunk(64,16,20,40,'#5a4030','#3a2a20');canopy(64,16,15,12,10,['#584078','#7660a6','#927ec4','#b6a6dc'],37);
  // 3 palm
  x.fillStyle='#8a7a62';for(let y=12;y<40;y++){x.fillRect(96+15+(y<20?1:0),y,3,1);if(y%3===0){x.fillStyle='#6a5a40';x.fillRect(96+15,y,3,1);x.fillStyle='#8a7a62';}}
  [['#2e5a26',0],['#4e8236',1],['#78aa4c',2]].forEach(([c,l])=>{x.fillStyle=c;for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI+l*.1;for(let t=0;t<1;t+=.06)x.fillRect(96+16+Math.cos(a)*12*t|0,12+Math.sin(a)*5*t+t*t*8-l|0,2,1);}});
  // 4 Norfolk pine: tall, dark, in layers
  trunk(128,16,6,40,'#5a4030','#3a2a20');for(let k=0;k<7;k++){const y=6+k*4.6,w=3+k*1.7;x.fillStyle=['#1e3a2a','#2a4e36','#3a6644'][k%3];x.fillRect(128+16-w|0,y|0,w*2|0,3);x.fillStyle='#4e7e52';x.fillRect(128+16-w|0,y|0,w|0,1);}
  // 5 coastal heath bush: low and grey-green
  canopy(160,16,32,13,6,['#4a5a3e','#6a7a52','#8a9468','#aab084'],51);
  // 6 bottlebrush: green with red brushes
  trunk(192,16,30,40,'#5a4030','#3a2a20');canopy(192,16,22,10,9,['#2e4e2a','#4a6e3a','#6a8e4a','#8aae5e'],67);x.fillStyle='#d8323a';for(let k=0;k<14;k++){x.fillRect(192+8+(L2hash(k,1)*16|0),14+(L2hash(k,2)*14|0),2,2);}
  // 7 peppermint: weeping, soft
  trunk(224,16,18,40,'#7a6a58','#5a4a3a');canopy(224,16,17,13,10,['#3a5a34','#56784a','#76985e','#9ab87a'],79);x.fillStyle='#3a5a34';for(let k=0;k<12;k++)x.fillRect(224+5+k*2,22+(k%3),1,5);
  const atT=new THREE.CanvasTexture(at);atT.magFilter=THREE.NearestFilter;atT.minFilter=THREE.NearestFilter;atT.encoding=THREE.sRGBEncoding;
  const SIZE=[[4.4,5.4],[3.6,4.4],[4,4.8],[2.8,5.4],[2.6,6.6],[2.2,1.7],[2.8,3.4],[3.8,4.6]].map(([w,h])=>[w*.78,h*.78]);
  const TL=L2.TREES2.slice();const KK=L2.KK;
  // trees out in the open: bush on the hills, Kings Park, river flats, coastal heath on the dunes
  const RR=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(4242);
  for(let k=0;k<26000&&TL.length<7200;k++){const tx=RR()*WX,tz=RR()*WZ,i=(tz|0)*WX+(tx|0);if(!LAND[i]||L2.SUB[i]||L2.RV[i]<3.4||BLOCK[i])continue;const kk=KK[i];if(kk===1||kk===2)continue;
    const kp=Math.hypot(tx-KPP[0],tz-KPP[1])<22,hill=kk===4,dune=kk===3,dn=fbm(tx/18,tz/18);
    if(TOWNS.some(t=>Math.hypot(t.x-tx,t.z-tz)<9))continue;
    if(dune){if(DL[i]<3||RR()<.55)continue;TL.push([tx,tz,5]);continue;}
    if(kp||hill){if(RR()<(kp?.3:.45))continue;TL.push([tx,tz,RR()<.75?0:(RR()<.5?7:5)]);continue;}
    if(dn<.05&&RR()<.8)continue;TL.push([tx,tz,RR()<.5?0:RR()<.6?7:RR()<.5?1:4]);}
  // a few Norfolk pines and palms along the beach front
  for(let k=0;k<4000&&TL.length<9400;k++){const tx=RR()*WX,tz=RR()*WZ,i=(tz|0)*WX+(tx|0);if(!LAND[i]||KK[i]!==3||DL[i]<3||DL[i]>6||BLOCK[i]||L2.RV[i]<3)continue;TL.push([tx,tz,RR()<.5?4:3]);}
  const nT=TL.length,P2=new Float32Array(nT*12),C2=new Float32Array(nT*8),U2=new Float32Array(nT*8),N2=new Float32Array(nT*12),K2=new Float32Array(nT*12),I2=[];
  TL.forEach(([tx,tz,kind],i)=>{const sc=.78+L2hash(tx,tz)*.5,[w,h]=SIZE[kind],y=groundAt(tx,tz)-.08,hw=w*sc/2,hh=h*sc,tint=.86+L2hash(tz,tx)*.22;
    [[-hw,0,0,0],[hw,0,1,0],[-hw,hh,0,1],[hw,hh,1,1]].forEach(([cx,cy,u,v],j)=>{const o=i*4+j;P2.set([tx,y,tz],o*3);C2.set([cx,cy],o*2);U2.set([(kind+(u?.98:.02))/KINDS,v?.995:.005],o*2);N2.set([0,1,0],o*3);K2.set([tint,tint,tint],o*3);});
    const b=i*4;I2.push(b,b+1,b+2,b+1,b+3,b+2);
    // a soft contact shadow painted on the ground under each tree
    L2.g.fillStyle='rgba(20,30,16,.26)';L2.g.beginPath();L2.g.ellipse(tx+.25,tz+.2,hw*.62,hw*.34,0,0,7);L2.g.fill();});
  L2.tex.needsUpdate=true;
  const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(P2,3));tg.setAttribute('corner',new THREE.BufferAttribute(C2,2));tg.setAttribute('uv',new THREE.BufferAttribute(U2,2));tg.setAttribute('normal',new THREE.BufferAttribute(N2,3));tg.setAttribute('color',new THREE.BufferAttribute(K2,3));tg.setIndex(I2);
  const tm=new THREE.MeshLambertMaterial({map:atT,alphaTest:.5,side:THREE.DoubleSide,vertexColors:true});
  tm.onBeforeCompile=sh=>{sh.vertexShader='attribute vec2 corner;\n'+sh.vertexShader.replace('#include <begin_vertex>','vec3 rt=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]);rt.y=0.;rt=normalize(rt);vec3 transformed=position+rt*corner.x+vec3(0.,corner.y,0.);').replace('#include <project_vertex>','#include <project_vertex>\nvCamD=-mvPosition.z;');sh.vertexShader='varying float vCamD;\n'+sh.vertexShader;
    sh.fragmentShader='varying float vCamD;\n'+sh.fragmentShader.replace('#include <alphatest_fragment>','#include <alphatest_fragment>\nif(vCamD<7.)discard;if(vCamD<13.&&mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.)<1.)discard;');};
  const trees=new THREE.Mesh(tg,tm);trees.frustumCulled=false;trees.userData.L='plants';scene.add(trees);L2.trees=trees;
  // ---- pixel clouds drifting high over the map ----
  const cl=document.createElement('canvas');cl.width=64;cl.height=24;{const y=cl.getContext('2d');const d2=(cx,cy,r,c)=>{y.fillStyle=c;for(let j=-r;j<=r;j++){const w=Math.round(Math.sqrt(r*r-j*j));y.fillRect(cx-w,cy+j,w*2+1,1);}};
    [[14,15,8],[26,11,10],[40,13,9],[52,16,7],[33,17,8]].forEach(([a,b,r])=>d2(a,b+1,r,'#c8d4e4'));[[14,14,7],[26,10,9],[40,12,8],[52,15,6],[33,16,7]].forEach(([a,b,r])=>d2(a,b,r,'#f6f8fc'));y.fillStyle='rgba(0,0,0,0)';}
  const clT=new THREE.CanvasTexture(cl);clT.magFilter=THREE.NearestFilter;clT.encoding=THREE.sRGBEncoding;L2.clouds=[];
  for(let k=0;k<16;k++){const s3=new THREE.Sprite(new THREE.SpriteMaterial({map:clT,transparent:true,opacity:.92,fog:false,depthWrite:false}));const sc=36+RR()*30;s3.scale.set(sc,sc*.375,1);s3.position.set(RR()*WX*1.4-WX*.2,48+RR()*26,RR()*WZ*1.4-WZ*.2);s3.userData.L='lights';scene.add(s3);L2.clouds.push(s3);}
}

$('ow_back').onclick=()=>hooks.back();
return{open(from){const t=TOWNS.find(t=>t.id===from);let x,z;if(from==='island'||!t){x=ROTT.x+3;z=ROTT.z+2;}else{x=t.x+7;z=t.z+5;for(let r=0;r<30&&!canGo(x,z);r++){x=t.x+7+Math.cos(r)*r*.6;z=t.z+5+Math.sin(r)*r*.6;}}
    ST.inCar=false;ST.ride=null;ST.speed=0;ST.x=x;ST.z=z;let cx=x+3,cz=z;for(let r=0;r<40;r++){const a=r*.7;if(onRoad(x+Math.cos(a)*r*.5,z+Math.sin(a)*r*.5,2)){cx=x+Math.cos(a)*r*.5;cz=z+Math.sin(a)*r*.5;break;}}ST.carX=cx;ST.carZ=cz;
    const col=hooks.carColor&&hooks.carColor();if(CARBODY&&col)CARBODY.material=new THREE.MeshLambertMaterial({color:new THREE.Color(col).convertSRGBToLinear()});
    OPEN=true;camInit=false;resize();last=performance.now();requestAnimationFrame(frame);},
  close(){OPEN=false;for(const k in keys)keys[k]=0;}};

}
