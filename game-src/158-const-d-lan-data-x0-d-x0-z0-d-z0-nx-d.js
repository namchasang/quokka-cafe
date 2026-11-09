  const D=LAN_DATA,X0=D.X0,Z0=D.Z0,NX=D.NX,NZ=D.NZ;
  const b64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;};
  const HQ=b64(D.H),AQ=b64(D.AO),SQ=b64(D.SN);const HF=new Float32Array(NX*NZ),AF=new Float32Array(NX*NZ),SF=new Float32Array(NX*NZ);
  for(let i=0;i<HF.length;i++){HF[i]=HQ[i]*.04-2;AF[i]=AQ[i]/255;SF[i]=SQ[i]/255;}
  const cl=(v,a,b)=>v<a?a:v>b?b:v,sst=(a,b,v)=>{const t=cl((v-a)/(b-a),0,1);return t*t*(3-2*t);};
  const bil=(A,x,z)=>{let fx=x-X0,fz=z-Z0;fx=cl(fx,0,NX-1.001);fz=cl(fz,0,NZ-1.001);const i=fx|0,j=fz|0,u=fx-i,v=fz-j,k=j*NX+i;
    return (A[k]*(1-u)+A[k+1]*u)*(1-v)+(A[k+NX]*(1-u)+A[k+NX+1]*u)*v;};
  const H=(x,z)=>bil(HF,x,z);
  // per-vertex gradients for the painter
  const GX=new Float32Array(NX*NZ),GZ=new Float32Array(NX*NZ);
  for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const k=j*NX+i;GX[k]=(HF[j*NX+Math.min(NX-1,i+1)]-HF[j*NX+Math.max(0,i-1)])/((i>0&&i<NX-1)?2:1);GZ[k]=(HF[Math.min(NZ-1,j+1)*NX+i]-HF[Math.max(0,j-1)*NX+i])/((j>0&&j<NZ-1)?2:1);}
  const LAN={ride:null,board:false,here:false,npc:[],quads:[],halos:[],water:null,foam:[],spray:null,chunks:[],painted:0};TRIP_BUILD.lan.S=LAN;
  // the staging area (car park) and the access road, as in the heightfield
  const rr=(x,z,x1,z1,x2,z2)=>{const dx=x1-x>x-x2?x1-x:x-x2,dz=z1-z>z-z2?z1-z:z-z2,ax=dx>0?dx:0,az=dz>0?dz:0;return Math.sqrt(ax*ax+az*az);};
  const parkD=(x,z)=>Math.min(rr(x,z,912,15,966,40),rr(x,z,966,27,999,33));
  // the holiday park (town side): park grass, the quiet coast road, the winding park road, site pads; the jetty deck
  const campD=(x,z)=>rr(x,z,869,17,909,43);const laneZ=x=>25+1.1*Math.sin((x-870)/5.2);
  const JT={x1:851.2,x2:865.6,xe:868.6,z:33,w:2.2,deck:.95};
  const onJetty=(x,z)=>x>=JT.x1&&x<=JT.xe&&Math.abs(z-JT.z)<JT.w/2-.12;
  const jettyY=x=>{if(x<=JT.x2)return JT.deck;const e=H(JT.xe,JT.z)+.05,k=(x-JT.x2)/(JT.xe-JT.x2);return JT.deck+(e-JT.deck)*k;};
  K.h=(x,z)=>onJetty(x,z)?Math.max(H(x,z),jettyY(x)):H(x,z);
  K.walk=(x,z)=>onJetty(x,z)||(x>852&&x<968&&z>-43&&z<43&&H(x,z)>-.18);
  K.arrive=[932.5,29.4];K.van=[937.5,32.6];
  const P={truck:{x:928.5,z:22},rack:{x:922.6,z:23.4},quadHire:{x:947.5,z:20.6},board:{x:944,z:-3.2},look:{x:897,z:-23}};
  // ---------------- helpers ----------------
  const PPM=32,MC={};
  const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const FC={};const face=(col,w,h,top)=>{const W=cl(Math.round(w*PPM/4)*4,4,128),Hh=cl(Math.round(h*PPM/4)*4,4,128),k=col+W+'x'+Hh+(top?'t':'');
    return FC[k]||(FC[k]=new THREE.MeshLambertMaterial({map:ctex(pface(col,W,Hh,top))}));};
  // a pixel face for a plain-coloured prop (same rules as the game's prop skins: lit top row, shaded foot, inked rim, speckle)
  function pface(col,W,Hh,top){const c=mk(W,Hh),x=c.getContext('2d');const b=new THREE.Color(col);const sh=f=>`rgb(${Math.min(255,b.r*255*f)|0},${Math.min(255,b.g*255*f)|0},${Math.min(255,b.b*255*f)|0})`;
    x.fillStyle=sh(top?1.06:1);x.fillRect(0,0,W,Hh);for(let y=0;y<Hh;y++)for(let X=0;X<W;X++){const q=((X*73856093)^(y*19349663))>>>0;if(q%11===0){x.fillStyle=sh(top?1:.94);x.fillRect(X,y,1,1);}else if(q%13===0){x.fillStyle=sh(top?1.12:1.06);x.fillRect(X,y,1,1);}}
    if(!top&&Hh>3){x.fillStyle=sh(1.18);x.fillRect(0,0,W,1);x.fillStyle=sh(.8);x.fillRect(0,Hh-2,W,1);}x.fillStyle=sh(.62);if(W>4&&Hh>4){x.fillRect(0,Hh-1,W,1);x.fillRect(0,0,1,Hh);x.fillRect(W-1,0,1,Hh);if(top)x.fillRect(0,0,W,1);}return c;}
  // a box whose six faces get pixel skins; o.f = {px,nx,py,ny,pz,nz} canvases or materials to override faces
  const pbox=(w,h,d,col,x,y,z,par,o)=>{o=o||{};const f=o.f||{};const g=new THREE.BoxGeometry(w,h,d);
    const sk=(k,a,b,top)=>f[k]?(f[k].isMaterial?f[k]:new THREE.MeshLambertMaterial({map:ctex(f[k])})):face(col,a,b,top);
    const mats=[sk('px',d,h),sk('nx',d,h),sk('py',w,d,1),sk('ny',w,d,1),sk('pz',w,h),sk('nz',w,h)];
    const m=new THREE.Mesh(g,mats);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;m.castShadow=!o.nc;m.receiveShadow=true;(par||G).add(m);return m;};
  const cyl=(r1,r2,h,col,x,y,z,par,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,o.s||10),o.mat||M(col));m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;m.castShadow=!o.nc;m.receiveShadow=true;(par||G).add(m);return m;};
  const cv=(w,h,draw)=>{const c=mk(Math.max(2,Math.round(w*PPM)),Math.max(2,Math.round(h*PPM)));const x=c.getContext('2d');x.imageSmoothingEnabled=false;draw(x,c.width,c.height);return c;};
  const txt=(x,s,X,Y,col,sz,al)=>{x.fillStyle=col;x.font='bold '+(sz||8)+'px "Pixelify Sans", monospace';x.textAlign=al||'center';x.textBaseline='middle';x.fillText(s,X,Y);};
  const signM=(L,W,Hh,bg,fg)=>new THREE.MeshBasicMaterial({map:makeSign(L,W,Hh,bg,fg),side:THREE.DoubleSide});
  const plane=(w,h,mat,x,y,z,ry,par)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;(par||G).add(m);return m;};
  const r=mulberry32(1218),pick=a=>a[(r()*a.length)|0];
  const haloT=(()=>{const c=mk(32,32),x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,230,170,1)');g.addColorStop(.4,'rgba(255,200,120,.45)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c);})();
  const halo=(x,y,z,s)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));m.position.set(x,y,z);m.scale.set(s,s,1);G.add(m);LAN.halos.push(m);return m;};
  const lampM=new THREE.MeshBasicMaterial({color:new THREE.Color('#e8d8a8')});
  const lamp=(w,h,d,x,y,z,par)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lampM);m.position.set(x,y,z);(par||G).add(m);PXB_LAMPS.push(m);return m;};
  // a face that glows at night: day + lit canvases
  const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:ctex(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(typeof PXK!=='undefined'&&PXK.glowDiff?PXK.glowDiff(a,b):b)});PXB_GLOW.push(m);return m;};

  // ================= the ground: heightfield chunks with painted pixel sand =================
  const SAND=[[122,136,170],[146,158,188],[174,183,202],[191,198,213],[207,212,222],[221,224,229],[233,233,233],[242,241,237],[250,249,244],[255,254,250]];
  const GRAV=[[150,146,138],[170,165,156],[186,181,171],[200,195,185],[212,207,197],[224,219,209],[234,230,221]];
  const SEA=[[214,226,214],[176,222,214],[120,204,208],[74,170,196],[48,124,178],[34,86,150],[28,62,118]];
  const hash=(a,b)=>{let h=(a*374761393+b*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296;};
  // smooth value noise (world metres)
  const vn=(x,z)=>{const i=Math.floor(x),j=Math.floor(z),u=x-i,v=z-j,su=u*u*(3-2*u),sv=v*v*(3-2*v);const a=hash(i,j),b=hash(i+1,j),c=hash(i,j+1),d=hash(i+1,j+1);return(a*(1-su)+b*su)*(1-sv)+(c*(1-su)+d*su)*sv;};
  // tracks: quad loops and old tyre lines (world polylines), footprints along the walkers' paths
  const spline=(pts,closed,step)=>{const out=[];const n=pts.length;const g=i=>closed?pts[(i+n)%n]:pts[cl(i,0,n-1)];const segs=closed?n:n-1;
    for(let i=0;i<segs;i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);const L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);const k=Math.max(2,Math.ceil(L/step));
      for(let s=0;s<k;s++){const t=s/k,t2=t*t,t3=t2*t;const f=(a,b,c,d)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);out.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1])]);}}
    if(!closed)out.push(pts[n-1].slice());return out;};
  const LOOP=[[948,15],[951,9],[958,1],[962,-12],[957,-25],[944,-33],[928,-31],[917,-20],[920,-7],[929,4],[938,12],[944,14.5]];
  const LOOP2=[[925,10],[912,4],[902,-6],[893,-16],[889,-30],[898,-38],[914,-36],[924,-26],[930,-14],[931,-2]];
  const QPATH=spline(LOOP,true,.25);const Q2PATH=spline(LOOP2,true,.25);
  const TRACKS=[QPATH,Q2PATH,spline([[966,30],[958,26],[950,20]],false,.25),spline([[915,16],[905,8],[896,-2],[884,-8],[874,-12]],false,.25),spline([[960,-30],[948,-40],[930,-42],[905,-44]],false,.25),spline([[940,14],[936,4],[930,-8],[934,-20],[946,-24],[960,-20]],false,.25),spline([[925,36],[916,30],[912,22]],false,.25)];
  const WALKS=[[[915,15],[907,4],[899,-8],[896,-17],[897,-23]],[[897,-23],[889,-27],[880,-24],[874,-18]],[[938,13],[941,4],[943,-3]],[[947,-3],[953,-10],[960,-16],[966,-22]],[[900,-24],[908,-32],[920,-38],[934,-40]]].map(w=>spline(w,false,.2));
  // stamp the marks into a sparse grid at 16 px per metre (keys = px index), read by the painter
  const MPPM=16,MARK=new Map();const mk2=(x,z,v)=>{const X=Math.floor(x*MPPM),Z=Math.floor(z*MPPM),k=X*100000+Z;const o=MARK.get(k)||0;if(v>o)MARK.set(k,v);};
  TRACKS.forEach((T,ti)=>{for(let i=1;i<T.length;i++){const a=T[i-1],b=T[i];const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz)||1;const nx=-dz/L,nz=dx/L;
    for(let s=0;s<L;s+=1/MPPM){const x=a[0]+dx*s/L,z=a[1]+dz*s/L;const tread=((s*MPPM+i*7)|0)%3!==0;
      [-.48,.48].forEach(o=>{const px=x+nx*o,pz=z+nz*o;mk2(px,pz,tread?3:2);mk2(px+nx*.07,pz+nz*.07,2);mk2(px-nx*.1,pz-nz*.1,1);});}}});
  WALKS.forEach(W=>{let acc=0,side=1;for(let i=1;i<W.length;i++){const a=W[i-1],b=W[i];const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz)||1;acc+=L;
    if(acc>.38){acc=0;side=-side;const nx=-dz/L,nz=dx/L;const x=b[0]+nx*.11*side,z=b[1]+nz*.11*side;mk2(x,z,4);mk2(x+dx/L/MPPM,z+dz/L/MPPM,4);mk2(x-dx/L/MPPM*.5,z-dz/L/MPPM*.5,1);}}});
  // the painter: one pixel = 1/ppm metre
  // painted a few rows at a time inside a small time budget per frame (phones stay smooth); the texture goes up when the chunk is done
  function paintChunk(C,budget){const _t0=performance.now();const W=C.W*C.ppm,Hh=C.D*C.ppm;if(!C.img){C.cv=mk(W,Hh);C.ctx=C.cv.getContext('2d');C.img=C.ctx.createImageData(W,Hh);C.row=0;}const c=C.cv,x=C.ctx,img=C.img,d=img.data;const ip=1/C.ppm;
    for(let py=C.row;py<Hh;py++){if(budget&&py>C.row&&performance.now()-_t0>budget){LAN.ptime=(LAN.ptime||0)+Math.round(performance.now()-_t0);C.row=py;return false;}const z=C.z0+(py+.5)*ip;for(let px=0;px<W;px++){const xw=C.x0+(px+.5)*ip;
      const h=H(xw,z),gx=bil(GX,xw,z),gz=bil(GZ,xw,z),sl=Math.sqrt(gx*gx+gz*gz),ao=bil(AF,xw,z),sn=bil(SF,xw,z);const hp=hash(px+C.x0*C.ppm,py+C.z0*C.ppm);let col;
      const mx=Math.floor(xw*MPPM),mz=Math.floor(z*MPPM),mv=MARK.get(mx*100000+mz)||0;
      if(h<.02){// sea bed: wet sand to turquoise to deep blue
        const dep=-h;let f=dep<.06?0:dep<.25?1:dep<.55?2:dep<.9?3:dep<1.3?4:dep<1.7?5:6;if(hp<.18&&f>0&&f<6)f+=(hp<.09?-1:1);if(vn(xw*.6,z*.6)>.72&&f>1&&f<5)f-=1;col=SEA[cl(f,0,6)];}
      else{const pk=parkD(xw,z);const a=cl((ao-.52)/.4,0,1);const cd=campD(xw,z);
        let v=cl(.02+1.02*Math.pow(cl(sn,0,1.1),1.7)*(.66+.34*a),0,1);// soft shade from the Blender bake (north-west light + sky occlusion)
        const road=Math.abs(xw-870.4)<1.55&&z>15.6&&z<45.5,lane=xw>870.5&&xw<913.5&&Math.abs(z-laneZ(xw))<1.25;
        const padK=cd<=0&&z>18.4&&z<23&&[874,884,891.2,896.6,905.5].some(p=>Math.abs(xw-p)<3.1);
        if(road){// the quiet coast road: grey seal, white edge lines, a dashed centre line
          const e=Math.abs(xw-870.4);let gi=1+(hp<.2?-1:hp>.86?1:0);col=[[62,66,74],[76,80,88],[90,94,100],[104,108,112]][cl(gi,0,3)];
          if(e>1.3&&e<1.42)col=[226,226,220];if(e<.07&&Math.floor(z/1.6)%2===0)col=[236,236,228];if(e>1.45)col=[150,146,136];}
        else if(lane){const e=Math.abs(z-laneZ(xw));let gi=2+(hp<.12?-1:hp>.9?1:0)+(vn(xw*.5,z*.5)>.7?1:0);col=[[118,116,110],[134,132,124],[150,148,140],[166,163,154]][cl(gi,0,3)];if(e>1.08)col=[196,192,180];}
        else if(padK){let gi=3+(hp<.1?-2:hp<.25?-1:hp>.9?2:hp>.75?1:0);col=GRAV[cl(gi,0,6)];}
        else if(cd<1.2&&!(cd>0&&hp<cd/1.2)){// clipped buffalo grass, mowing stripes, dry patches, darker under the shade
          const GR=[[58,98,52],[72,116,60],[88,134,68],[104,150,76],[122,164,86],[142,176,98],[168,188,116]];
          let gi=3+(Math.floor((xw-z*.3)/2.2)%2?0:1)+(hp<.14?-1:hp>.9?1:0)+Math.round((v-.72)*5);const dry=vn(xw*.25+3,z*.25)>.72;
          col=GR[cl(gi,0,6)];if(dry&&hp<.6)col=[[176,170,112],[160,158,104]][hp<.3?1:0];if(hash(Math.floor(xw*5),Math.floor(z*5))<.01)col=[236,226,120];}
        else if(pk<4){// gravelly grey-white staging area: limestone chips, darker patches
          let gi=3+(vn(xw*.35,z*.35)>.6?1:0)-(vn(xw*.9+40,z*.9)>.74?1:0);if(hp<.06)gi-=2;else if(hp>.95)gi+=2;else if(hp>.82)gi+=1;else if(hp<.16)gi-=1;
          const st=hash(Math.floor(xw*4),Math.floor(z*4));if(st<.05){gi=st<.02?0:6;}
          if(mv>=2)gi-=mv>=3?2:1;else if(mv===1)gi+=1;
          col=GRAV[cl(gi,0,6)];
          if(pk>.5){const S2=SAND[cl(Math.round(v*9),0,9)];const k=sst(.5,4,pk);col=[col[0]+(S2[0]-col[0])*k,col[1]+(S2[1]-col[1])*k,col[2]+(S2[2]-col[2])*k];}}
        else{// dune sand: wind ripples that wrap around the slopes, smooth slip faces with avalanche streaks
          const du=gx*.42+gz*.91,lee=du<0?cl(-du*2.6,0,1):0;// slip faces drop away downwind (south-east, toward the camera)
          const warp=.5*Math.sin(xw*.47+z*.13)+.25*Math.sin(xw*1.31-z*.71)+.85*vn(xw*.18,z*.18);
          // wind ripples run across the wind and bend round the slopes (height lifts them, so they follow the dune's shape)
          const q=((xw*.42+z*.91)*1.05+(xw*.91-z*.42)*.12*Math.sin((xw*.91-z*.42)*.07)+h*1.6+warp)/.42;const f=q-Math.floor(q);
          const rs=(1-sst(.3,.5,sl))*(.5+.5*vn(xw*.3+9,z*.3))*sst(.1,.5,h)*(1-lee*.9);
          let ri=0;if(rs>.16){if(f<.12)ri=-2;else if(f<.2)ri=-1;else if(f<.3)ri=1;if(rs<.4&&hp<.35)ri=0;}
          // slip faces: smooth with fine avalanche streaks down the fall line
          let streak=0;if(lee>.4&&sl>.3){const s2=(xw*.91-z*.42)*1.6+vn(xw*.6,z*.6)*2.5;if(s2-Math.floor(s2)<.1)streak=-1;}
          // sharp crest: the brink between the lit back and the shaded slip face gets a bright lip
          const lip=lee<.15&&bil(SF,xw+.42*.6,z+.91*.6)<sn-.22?1:0;
          let idx=Math.round(v*9+(hp-.5)*.7)+ri+streak+lip;
          if(mv===4)idx-=2;else if(mv===3)idx-=2;else if(mv===2)idx-=1;else if(mv===1)idx+=1;
          // shells and little limestone chips
          if(hash(Math.floor(xw*6),Math.floor(z*6))<.0015)idx-=3;
          col=SAND[cl(idx,0,9)];
          const veg=((xw<878&&h<2.2)||(z>34&&pk>4)||(xw>963&&z>-30))&&cd>2;if(veg&&vn(xw*.8,z*.8)>.74&&hp<.07)col=hp<.08?[112,122,100]:[146,154,128];
          if(h<.35&&xw<870){const wet=sst(.35,.05,h);col=[col[0]-28*wet,col[1]-26*wet,col[2]-18*wet];}}}
      const o=(py*W+px)*4;d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255;}}
    C.row=Hh;x.putImageData(img,0,0);C.img=null;const t=ctex(c);t.anisotropy=4;C.mesh.material.map=t;C.mesh.material.color.set(LAN.gcol||0xb2b2b2);C.mesh.material.needsUpdate=true;C.done=true;LAN.ptime=(LAN.ptime||0)+Math.round(performance.now()-_t0);;return true;}
  // chunk meshes (1 m grid, follows K.h exactly)
  const groundMat=()=>new THREE.MeshLambertMaterial({color:new THREE.Color('#a8a6a0')});
  const XS=[830,862,894,926,958],ZS=[-75,-43,-11,21];
  XS.forEach(x0=>ZS.forEach(z0=>{const W=32,Dd=32;const g=new THREE.BufferGeometry();const pos=[],uv=[],idx=[];
    for(let j=0;j<=Dd;j++)for(let i=0;i<=W;i++){const x=x0+i,z=z0+j;pos.push(x,H(x,z),z);uv.push(i/W,1-j/Dd);}
    for(let j=0;j<Dd;j++)for(let i=0;i<W;i++){const a=j*(W+1)+i,b=a+1,c=a+W+1,e=c+1;idx.push(a,c,b,b,c,e);}
    g.setIndex(idx);g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));{const n=new Float32Array(pos.length);for(let q=1;q<n.length;q+=3)n[q]=1;g.setAttribute('normal',new THREE.BufferAttribute(n,3));}
    const m=new THREE.Mesh(g,groundMat());m.receiveShadow=true;m.castShadow=true;m.__pxSkip=1;G.add(m);
    LAN.chunks.push({x0,z0,W,D:Dd,ppm:z0===-75?8:16,mesh:m,done:false,cx:x0+W/2,cz:z0+Dd/2});}));
  // deep ocean beyond the heightfield and a skirt so the far edges never show the void
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(400,400),M('#1c3e78'));m.rotation.x=-Math.PI/2;m.position.set(630,-2,0);G.add(m);
    const s=new THREE.Mesh(new THREE.PlaneGeometry(200,200),M('#d8d6d0'));s.rotation.x=-Math.PI/2;s.position.set(1090,-.2,0);G.add(s);
    const n=new THREE.Mesh(new THREE.PlaneGeometry(160,120),M('#dcdad4'));n.rotation.x=-Math.PI/2;n.position.set(910,3,-136);G.add(n);}

  // ================= the Indian Ocean: animated pixel waves over the painted sea bed, swash foam on the beach =================
  {const c=mk(64,64),x=c.getContext('2d');const draw=t=>{x.clearRect(0,0,64,64);x.fillStyle='rgba(40,140,200,.28)';x.fillRect(0,0,64,64);
      for(let k=0;k<26;k++){const yy=(k*13+((k*7)%5)*3)%64,xx=(k*29)%64,l=3+(k%4)*2;x.fillStyle=k%3?'rgba(220,245,250,.55)':'rgba(255,255,255,.8)';x.fillRect(xx,yy,l,1);x.fillStyle='rgba(20,70,130,.35)';x.fillRect(xx+1,yy+1,l,1);}};
    draw(0);const t=ctex(c,{rep:[40,40]});t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;
    const w=new THREE.Mesh(new THREE.PlaneGeometry(260,260),new THREE.MeshLambertMaterial({map:t,transparent:true,depthWrite:false,emissive:new THREE.Color('#103050'),emissiveIntensity:.3}));
    w.rotation.x=-Math.PI/2;w.position.set(740,.03,-5);w.renderOrder=2;G.add(w);LAN.water=t;
    // shoreline from the heightfield: first dry cell per row
    const shore=[];for(let j=0;j<NZ;j++){let i=0;while(i<NX-1&&HF[j*NX+i]<.02)i++;const hA=HF[j*NX+Math.max(0,i-1)],hB=HF[j*NX+i];const fx=i-1+(.02-hA)/Math.max(1e-3,hB-hA);shore.push([X0+fx,Z0+j]);}
    const foamC=mk(16,64),fx=foamC.getContext('2d');fx.clearRect(0,0,16,64);for(let y=0;y<64;y++){for(let xx=0;xx<16;xx++){const hh=hash(xx,y);const edge=12+Math.round(Math.sin(y*.7)*1.5+Math.sin(y*.23)*1.2);
        if(xx>edge)continue;const a=xx>edge-2?.95:xx>edge-5?(hh<.6?.85:0):(hh<.18?.6:0);if(a>0){fx.fillStyle='rgba(255,255,255,'+a+')';fx.fillRect(xx,y,1,1);}}}
    const ft=ctex(foamC,{rep:[1,NZ/4]});ft.magFilter=ft.minFilter=THREE.NearestFilter;
    [[0,1.1,.9],[-2.2,.9,.55],[-5.2,1.2,.4]].forEach(([off,wd,op],k)=>{const g=new THREE.BufferGeometry();const pos=[],uv=[],idx=[];
      shore.forEach(([sx,sz],j)=>{pos.push(sx+off-wd,0,sz,sx+off+.15,0,sz);uv.push(0,j/(NZ-1),1,j/(NZ-1));});
      for(let j=0;j<NZ-1;j++){const a=j*2;idx.push(a,a+2,a+1,a+1,a+2,a+3);}
      g.setIndex(idx);g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
      const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:ft,transparent:true,depthWrite:false,opacity:op}));m.position.y=.07;m.renderOrder=3;G.add(m);LAN.foam.push({m,off,k,op});});}

  // ================= the staging area: snack & sandboard-hire truck =================
  {const T=new THREE.Group();T.position.set(P.truck.x,H(P.truck.x,P.truck.z),P.truck.z);G.add(T);
    const L=6,Wd=2.3,Hb=2.5,y0=.75;
    // the box body: south side has the serving hatch, the picture menu along the top, a striped awning
    const side=lit=>cv(L,Hb,(x,W,Hh)=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,W,Hh);x.fillStyle='#e2e0d8';for(let i=0;i<W;i+=24)x.fillRect(i,0,1,Hh);x.fillStyle='#ffffff';x.fillRect(0,0,W,2);
      // banner
      x.fillStyle='#1d3a6e';x.fillRect(4,4,W-8,18);x.fillStyle='#f2c428';x.fillRect(4,22,W-8,2);txt(x,'WELCOME TO THE WHITE DUNES',W/2,13,'#ffffff',10);
      // picture tiles: boards, quads, drinks, chips, ice blocks
      const tiles=[['#3e9ad8','#f6f2e8'],['#e8732a','#2a2a30'],['#c8344a','#ffffff'],['#f2c428','#c8344a'],['#3ec46a','#ffffff'],['#9478d4','#ffe2a0']];
      for(let k=0;k<6;k++){const tx=8+k*30,ty=27;x.fillStyle='#2a2a30';x.fillRect(tx-1,ty-1,26,20);x.fillStyle=tiles[k][0];x.fillRect(tx,ty,24,18);x.fillStyle=tiles[k][1];
        if(k===0){x.fillRect(tx+4,ty+10,16,3);x.fillRect(tx+15,ty+6,3,4);}else if(k===1){x.fillRect(tx+5,ty+9,14,4);x.beginPath();x.arc(tx+7,ty+14,3,0,7);x.arc(tx+17,ty+14,3,0,7);x.fill();}
        else if(k===2){x.fillRect(tx+9,ty+4,6,11);x.fillStyle='#f6f2e8';x.fillRect(tx+10,ty+6,4,2);}else if(k===3){for(let q=0;q<5;q++)x.fillRect(tx+6+q*3,ty+4+(q%2)*2,2,10);}
        else if(k===4){x.fillRect(tx+10,ty+3,4,9);x.fillRect(tx+11,ty+12,2,4);}else{x.fillRect(tx+6,ty+8,12,7);x.fillStyle='#ffffff';x.fillRect(tx+7,ty+4,10,4);}}
      // the hatch: counter, lit inside with shelves, a person-high opening
      const hx=60,hw=84,hy=50,hh=26;x.fillStyle='#3a3e48';x.fillRect(hx-2,hy-2,hw+4,hh+4);x.fillStyle=lit?'#ffd890':'#6a7480';x.fillRect(hx,hy,hw,hh);
      x.fillStyle=lit?'#e8b860':'#56606c';x.fillRect(hx,hy+7,hw,1);x.fillRect(hx,hy+15,hw,1);
      for(let k=0;k<9;k++){x.fillStyle=['#c8344a','#3e9ad8','#f2c428','#3ec46a','#e8732a'][k%5];x.fillRect(hx+4+k*9,hy+3,4,4);x.fillRect(hx+6+k*9,hy+11,3,4);}
      x.fillStyle='#d8d6d0';x.fillRect(hx-4,hy+hh,hw+8,3);x.fillStyle='#8a8e96';x.fillRect(hx-4,hy+hh+3,hw+8,1);
      // price boards beside the hatch
      x.fillStyle='#2a2a30';x.fillRect(8,50,44,28);x.fillStyle='#f6f2e8';x.fillRect(9,51,42,26);
      ['COLD DRINK 6','HOT CHIPS 6','BOARD HIRE 10'].forEach((s,i)=>txt(x,s,30,56+i*8,'#1d3a6e',6));
      x.fillStyle='#2a2a30';x.fillRect(150,50,36,28);x.fillStyle='#3e9ad8';x.fillRect(151,51,34,26);txt(x,'QUADS',168,58,'#ffffff',8);txt(x,'40',168,70,'#f2c428',9);
      x.fillStyle='#c8c6c0';x.fillRect(0,Hh-3,W,3);});
    const back=cv(L,Hb,(x,W,Hh)=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,W,Hh);x.fillStyle='#e2e0d8';for(let i=0;i<W;i+=24)x.fillRect(i,0,1,Hh);x.fillStyle='#1d3a6e';x.fillRect(4,4,W-8,18);txt(x,'WHITE CREST · DUNE SNACKS',W/2,13,'#ffffff',10);x.fillStyle='#c8c6c0';x.fillRect(0,Hh-3,W,3);});
    const endF=cv(Wd,Hb,(x,W,Hh)=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,W,Hh);x.fillStyle='#8a8e96';x.fillRect(W/2-1,6,2,Hh-10);x.fillStyle='#b8bcc0';x.fillRect(4,6,W-8,1);x.fillRect(4,Hh-6,W-8,1);x.fillStyle='#c8344a';x.fillRect(4,Hh-12,8,4);x.fillRect(W-12,Hh-12,8,4);});
    const sideMat=litMat(side);
    pbox(L,Hb,Wd,'#f4f2ec',0,y0+Hb/2,0,T,{f:{pz:sideMat,nz:back,nx:endF,px:endF}});
    pbox(L+.1,.08,Wd+.1,'#d8d6d0',0,y0+Hb+.04,0,T);
    // chassis, wheels, cab at the east end
    pbox(L+2.2,.25,1.2,'#3a3e48',1,.55,0,T);
    const wheel=(x,z)=>{const w=cyl(.42,.42,.3,'#26262c',x,.42,z,T,{rx:Math.PI/2,s:12});cyl(.2,.2,.32,'#9aa0a6',x,.42,z,T,{rx:Math.PI/2,s:8,nc:1});return w;};
    [[-1.9,1],[-1.9,-1],[-.95,1],[-.95,-1],[3.7,1],[3.7,-1]].forEach(([x,z])=>wheel(x,z*.98));
    const cabS=cv(1.9,1.9,(x,W,Hh)=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,W,Hh);x.fillStyle='#3a4a5a';x.fillRect(10,6,W-16,22);x.fillStyle='#6a8aa0';x.fillRect(12,8,W-22,10);x.fillStyle='#d8d6d0';x.fillRect(6,34,W-12,1);x.fillStyle='#2a2a30';x.fillRect(W-10,36,6,2);x.fillStyle='#1d3a6e';x.fillRect(0,46,W,6);});
    const cabF=cv(2.2,1.9,(x,W,Hh)=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,W,Hh);x.fillStyle='#3a4a5a';x.fillRect(4,4,W-8,24);x.fillStyle='#8aaac0';x.fillRect(6,6,W-12,8);x.fillStyle='#2a2a30';x.fillRect(14,38,W-28,12);x.fillStyle='#5a5e6a';for(let i=16;i<W-14;i+=4)x.fillRect(i,40,2,8);x.fillStyle='#fff0b0';x.fillRect(4,40,8,6);x.fillRect(W-12,40,8,6);x.fillStyle='#1d3a6e';x.fillRect(0,52,W,4);});
    pbox(1.9,1.9,2.2,'#f4f2ec',L/2+1.05,y0+.95,0,T,{f:{pz:cabS,nz:cabS,px:cabF}});pbox(1.5,.12,2.1,'#e8e6e0',L/2+.95,y0+1.96,0,T);
    pbox(.3,.22,2.3,'#3a3e48',L/2+2.05,.7,0,T);
    // awning over the hatch (striped), brackets, string lights
    const aw=cv(3.2,.9,(x,W,Hh)=>{for(let i=0;i<W;i+=8){x.fillStyle=(i/8)%2?'#f6f2e8':'#2f6fb0';x.fillRect(i,0,8,Hh);}x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,Hh-3,W,3);for(let i=0;i<W;i+=8){x.fillStyle=(i/8)%2?'#f6f2e8':'#2f6fb0';x.beginPath();x.moveTo(i,Hh-3);x.lineTo(i+8,Hh-3);x.lineTo(i+4,Hh);x.fill();}});
    const awM=new THREE.MeshLambertMaterial({map:ctex(aw),side:THREE.DoubleSide});const awn=plane(3.2,.9,awM,-.05,y0+1.95,Wd/2+.42,0,T);awn.rotation.x=-1.05;awn.castShadow=true;
    [-1.55,1.45].forEach(x=>pbox(.04,.04,.9,'#8a8e96',x,y0+1.82,Wd/2+.42,T,{nc:1}));
    for(let k=0;k<9;k++){const xx=-1.5+k*.37;lamp(.06,.06,.06,xx,y0+1.6-Math.sin(k/8*Math.PI)*.1,Wd/2+.84,T);}
    halo(P.truck.x,T.position.y+y0+1.4,P.truck.z+Wd/2+1,3.2);
    // fold-out counter, cones, an A-frame menu, a bin, chairs
    pbox(2.8,.06,.4,'#d8d6d0',-.05,y0+.72,Wd/2+.2,T);
    const cone=(x,z)=>{const g=new THREE.Group();g.position.set(x,H(x,z),z);G.add(g);cyl(.02,.17,.5,'#e8572a',0,.27,0,g,{s:8});cyl(.11,.13,.08,'#f6f2e8',0,.3,0,g,{s:8,nc:1});pbox(.38,.03,.38,'#e8572a',0,.015,0,g,{nc:1});};
    [[924.2,24.2],[926,24.6],[933.4,24.4],[935.2,23.2]].forEach(([x,z])=>cone(x,z));
    const af=cv(.6,.9,(x,W,Hh)=>{x.fillStyle='#2a2a30';x.fillRect(0,0,W,Hh);x.fillStyle='#3a5a3a';x.fillRect(1,1,W-2,Hh-2);txt(x,'ICE',W/2,6,'#ffffff',7);txt(x,'COLD',W/2,14,'#f2c428',7);txt(x,'DRINKS',W/2,22,'#ffffff',6);});
    {const g=new THREE.Group();g.position.set(931.2,H(931.2,25),25);G.add(g);pbox(.6,.9,.04,'#3a5a3a',0,.45,.12,g,{rx:-.22,f:{pz:af}});pbox(.6,.9,.04,'#3a5a3a',0,.45,-.12,g,{rx:.22,f:{nz:af}});col(930.8,24.8,931.6,25.2);}
    // a little camp table with two chairs, a cooler
    {const tx=934.5,tz=26.6,g=new THREE.Group();g.position.set(tx,H(tx,tz),tz);G.add(g);pbox(1,.04,.6,'#f6f2e8',0,.7,0,g);[[-.45,-.25],[.45,-.25],[-.45,.25],[.45,.25]].forEach(([x,z])=>pbox(.03,.7,.03,'#8a8e96',x,.35,z,g,{nc:1}));
      [[-.85,.1,'#2f6fb0'],[.85,0,'#c8344a']].forEach(([x,z,c])=>{pbox(.45,.04,.42,c,x,.42,z,g);pbox(.45,.42,.04,c,x,.64,z+.2,g);[[-.2,-.18],[.2,-.18],[-.2,.18],[.2,.18]].forEach(([a,b])=>pbox(.025,.42,.025,'#3a3e48',x+a,.21,z+b,g,{nc:1}));});
      pbox(.6,.4,.4,'#3e9ad8',-.2,.2,.9,g);pbox(.62,.06,.42,'#f6f2e8',-.2,.43,.9,g);col(tx-1.2,tz-.4,tx+1.2,tz+1.2);}
    // a feather flag
    {const fx=921.4,fz=21.2,gy=H(fx,fz);cyl(.025,.025,3.2,'#8a8e96',fx,gy+1.6,fz,G,{s:5});const fl=cv(.5,2.2,(x,W,Hh)=>{x.fillStyle='#e8732a';x.fillRect(0,0,W,Hh);x.fillStyle='#ffffff';x.font='bold 9px monospace';x.save();x.translate(W/2+3,Hh/2);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('SANDBOARDS',0,0);x.restore();});
      const m=plane(.5,2.2,new THREE.MeshLambertMaterial({map:ctex(fl),side:THREE.DoubleSide}),fx+.27,gy+2.05,fz,0);m.castShadow=true;LAN.flag=m;}
    col(P.truck.x-L/2-.1,P.truck.z-Wd/2-.1,P.truck.x+L/2+2.3,P.truck.z+Wd/2+.15);}
  // the sandboard rack: colourful boards leaning on a rail
  {const g=new THREE.Group();g.position.set(P.rack.x,H(P.rack.x,P.rack.z),P.rack.z-.6);G.add(g);pbox(2.2,.06,.06,'#6a4a32',0,.95,0,g);[-1,1].forEach(x=>pbox(.07,1,.07,'#6a4a32',x,.5,0,g));
    ['#3e9ad8','#e8732a','#f2c428','#3ec46a','#c8344a','#9478d4','#2f6fb0'].forEach((c,i)=>{const b=cv(.32,1.15,(x,W,Hh)=>{x.fillStyle=c;x.fillRect(0,0,W,Hh);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(1,1,W-2,2);x.fillRect(2,4,1,Hh-8);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,Hh-2,W,2);x.fillStyle='#ffffff';x.fillRect(3,Hh/2-2,W-6,3);});
      pbox(.32,1.15,.03,c,-.95+i*.32,.56,.16,g,{rx:-.2,f:{pz:b,nz:b}});});
    col(P.rack.x-1.2,P.rack.z-.8,P.rack.x+1.2,P.rack.z-.2);}

  // ================= quad-bike hire: a shade tent and a row of quads with safety flags =================
  const quadModel=(c)=>{const q=new THREE.Group();const body=new THREE.Group();q.add(body);
    const dark='#26262c';
    pbox(1.25,.22,.62,'#3a3e48',0,.46,0,body);
    pbox(.62,.16,1.08,c,.5,.74,0,body,{rz:.12});pbox(.62,.16,1.08,c,-.5,.74,0,body,{rz:-.1});// fenders
    pbox(.72,.34,.6,c,.08,.7,0,body);pbox(.7,.12,.42,'#1e1e24',-.28,.92,0,body);// tank, seat
    pbox(.28,.12,.54,'#2a2a30',.7,.68,0,body);lamp(.04,.07,.12,.86,.72,.16,body);lamp(.04,.07,.12,.86,.72,-.16,body);
    cyl(.025,.025,.72,'#2a2a30',.38,1.02,0,body,{rx:Math.PI/2,s:5,nc:1});cyl(.03,.03,.3,'#2a2a30',.33,.9,0,body,{s:5,nc:1});
    pbox(.32,.05,.62,'#2a2a30',-.7,.86,0,body);// rear rack
    // numbered plate and the dune flag on a whip
    cyl(.012,.012,1.9,'#ececec',-.7,1.8,.22,body,{s:4,nc:1});const fl=plane(.34,.22,M('#f06a20'),-.53,2.6,.22,0,body);fl.material.side=THREE.DoubleSide;
    const W=[];[[.52,.42],[.52,-.42],[-.5,.42],[-.5,-.42]].forEach(([x,z])=>{const w=cyl(.27,.27,.24,dark,x,.27,z,q,{rx:Math.PI/2,s:10});const hub=cyl(.12,.12,.26,'#b8bcc0',x,.27,z,q,{rx:Math.PI/2,s:6,nc:1});W.push(w);});
    q.userData.body=body;q.rotation.order='YZX';return q;};
  {const tx=958.5,tz=21.5,g=new THREE.Group();g.position.set(tx,H(tx,tz),tz);G.add(g);
    [[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]].forEach(([x,z])=>pbox(.06,2.3,.06,'#d8d6d0',x,1.15,z,g,{nc:1}));
    const top=cv(3.2,3.2,(x,W,Hh)=>{x.fillStyle='#2f6fb0';x.fillRect(0,0,W,Hh);x.fillStyle='#3e86c8';for(let i=0;i<W;i+=16)x.fillRect(i,0,8,Hh);});
    const roof=new THREE.Mesh(new THREE.ConeGeometry(2.3,.7,4,1,true),new THREE.MeshLambertMaterial({map:ctex(top),side:THREE.DoubleSide}));roof.rotation.y=Math.PI/4;roof.position.y=2.62;roof.castShadow=true;g.add(roof);
    const val=cv(3.1,.32,(x,W,Hh)=>{x.fillStyle='#2f6fb0';x.fillRect(0,0,W,Hh);txt(x,'DUNE RUNNER QUAD HIRE',W/2,Hh/2+1,'#ffffff',8);});pbox(3.1,.32,.03,'#2f6fb0',0,2.14,1.52,g,{f:{pz:val,nz:val}});
    pbox(1.6,.06,.6,'#f6f2e8',0,.78,-.6,g);[[-.7,-.85],[.7,-.85],[-.7,-.35],[.7,-.35]].forEach(([x,z])=>pbox(.03,.78,.03,'#8a8e96',x,.39,z,g,{nc:1}));
    ['#f2c428','#c8344a','#3e9ad8','#ffffff'].forEach((c,i)=>{const h=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6,0,Math.PI*2,0,Math.PI/2),M(c));h.position.set(-.55+i*.36,.82,-.6);h.castShadow=true;g.add(h);});
    lamp(.1,.1,.1,0,2.2,0,g);halo(tx,g.position.y+2.1,tz,2.6);
    col(tx-1.7,tz-1.7,tx+1.7,tz-.1);}
  const QCOL=['#2f6fb0','#c8344a','#e8732a','#2f6fb0','#3e9ad8','#c8344a','#f2c428'];
  for(let i=0;i<7;i++){const x=940+i*2.05,z=17.6;const q=quadModel(QCOL[i]);q.position.set(x,H(x,z),z);q.rotation.y=Math.PI/2;G.add(q);LAN.quads.push({q,hx:x,hz:z,busy:false});}
  col(939,16.6,954.5,18.6);
  {const sg=signM(['QUAD BIKES · 40 COINS','HELMETS ON · STAY ON TRACK'],120,24,'#f6f2e8','#1d3a6e');const g=new THREE.Group();g.position.set(938,H(938,19.6),19.6);G.add(g);plane(1.9,.38,sg,0,1.35,0,0,g);[-.85,.85].forEach(x=>pbox(.05,1.4,.05,'#6a4a32',x,.7,-.02,g,{nc:1}));}

  // ================= the tour van (Siam Sydney Services) =================
  {const vx=K.van[0],vz=K.van[1],v=new THREE.Group();v.position.set(vx,H(vx,vz),vz);G.add(v);const L=5.6,W=2.0,Hh=2.3,y0=.42;
    const vside=(lit,flip)=>cv(L,Hh,(x,Wp,Hp)=>{x.fillStyle='#f6f6f2';x.fillRect(0,0,Wp,Hp);
      x.fillStyle='#2a3440';x.fillRect(8,12,Wp-30,20);for(let i=0;i<5;i++){x.fillStyle=lit?'#ffe0a0':(i%2?'#5a7a90':'#6a8aa6');x.fillRect(10+i*28,14,25,16);x.fillStyle=lit?'#fff0c8':'#8aaac0';x.fillRect(10+i*28,14,25,3);}
      x.fillStyle='#2a3440';x.fillRect(Wp-20,10,16,22);x.fillStyle='#8aaac0';x.fillRect(Wp-18,12,12,8);
      x.fillStyle='#1d3a6e';x.fillRect(0,40,Wp,8);x.fillStyle='#f2c428';x.fillRect(0,48,Wp,2);
      txt(x,'SIAM SYDNEY SERVICES',Wp/2-6,44,'#ffffff',8);txt(x,'Thai & English day tours',Wp/2-6,57,'#1d3a6e',7);
      x.fillStyle='#d8d8d2';x.fillRect(56,34,1,Hp-38);x.fillRect(Wp-24,34,1,Hp-38);x.fillStyle='#2a2a30';x.fillRect(60,52,6,2);
      x.fillStyle='#2a2a30';[22,Wp-42].forEach(c=>{x.beginPath();x.arc(c,Hp,14,Math.PI,0);x.fill();});
      if(flip){/* nothing different */}});
    const vm=litMat(l=>vside(l));
    const front=cv(W,Hh,(x,Wp,Hp)=>{x.fillStyle='#f6f6f2';x.fillRect(0,0,Wp,Hp);x.fillStyle='#2a3440';x.fillRect(3,8,Wp-6,26);x.fillStyle='#8aaac0';x.fillRect(5,10,Wp-10,9);x.fillStyle='#1d3a6e';x.fillRect(0,40,Wp,8);
      x.fillStyle='#2a2a30';x.fillRect(16,52,Wp-32,10);x.fillStyle='#fff0b0';x.fillRect(4,52,9,6);x.fillRect(Wp-13,52,9,6);x.fillStyle='#8a8e96';x.fillRect(0,66,Wp,4);});
    const rear=cv(W,Hh,(x,Wp,Hp)=>{x.fillStyle='#f6f6f2';x.fillRect(0,0,Wp,Hp);x.fillStyle='#2a3440';x.fillRect(5,10,Wp-10,20);x.fillStyle='#6a8aa6';x.fillRect(7,12,Wp-14,16);x.fillStyle='#1d3a6e';x.fillRect(0,40,Wp,8);txt(x,'SSS',Wp/2,44,'#ffffff',7);x.fillStyle='#c8344a';x.fillRect(3,52,6,8);x.fillRect(Wp-9,52,6,8);});
    pbox(L,Hh,W,'#f6f6f2',0,y0+Hh/2,0,v,{f:{pz:vm,nz:vm,px:front,nx:rear}});
    pbox(L-1,.14,W-.3,'#e8e8e2',-.3,y0+Hh+.07,0,v);pbox(1.2,.08,1.2,'#d8d8d2',-1.2,y0+Hh+.18,0,v);
    [[1.8,1],[1.8,-1],[-1.6,1],[-1.6,-1]].forEach(([x,z])=>{cyl(.36,.36,.26,'#26262c',x,.36,z*.94,v,{rx:Math.PI/2,s:12});cyl(.17,.17,.28,'#b8bcc0',x,.36,z*.94,v,{rx:Math.PI/2,s:8,nc:1});});
    lamp(.04,.1,.24,L/2+.02,y0+.68,.7,v);lamp(.04,.1,.24,L/2+.02,y0+.68,-.7,v);
    col(vx-L/2-.05,vz-W/2-.05,vx+L/2+.05,vz+W/2+.05);
    // the guide stands by the door with a little flag
    const gd=spriteMesh(humanFrames({skin:'#c99a6e',hair:'#1e1a18',shirt:'#1d3a6e',pants:'#2a2a30',hat:'#f2c428'}),.95,1.58);gd.position.set(vx+1.4,H(vx+1.4,vz+1.45),vz+1.45);G.add(gd);LAN.guide=gd;
    const gf=plane(.32,.22,M('#f2c428'),vx+1.78,H(vx+1.4,vz+1.45)+1.85,vz+1.45,0);gf.material.side=THREE.DoubleSide;cyl(.01,.01,.8,'#3a3e48',vx+1.62,H(vx+1.4,vz+1.45)+1.5,vz+1.45,G,{s:4,nc:1});}

  // ================= signs, posts and a lamp pole at the staging area =================
  {const s=signM(['LANCELIN SAND DUNES','4WD · QUADS · SANDBOARDS'],132,26,'#5a3a22','#f6f2e8');const g=new THREE.Group();g.position.set(963.5,H(963.5,35.2),35.2);G.add(g);
    plane(3,.6,s,0,1.6,0,0,g);[-1.35,1.35].forEach(x=>pbox(.12,1.95,.12,'#5a3a22',x,.97,-.03,g));pbox(3.1,.1,.18,'#3a2a1a',0,1.95,0,g);col(962,35,965,35.4);}
  {const s=signM(['SANDBOARD DUNE ↑','WALK UP · SLIDE DOWN'],110,24,'#f2c428','#2a2a30');const g=new THREE.Group();g.position.set(941.2,H(941.2,13.4),13.4);G.add(g);plane(1.6,.36,s,0,1.3,0,0,g);pbox(.06,1.3,.06,'#6a4a32',0,.65,-.03,g);}
  for(let x=914;x<=966;x+=4){if(x>928&&x<958)continue;const z=14.6,gy=H(x,z);pbox(.1,.7,.1,'#5a3a22',x,gy+.35,z,G);pbox(.11,.08,.11,'#f2c428',x,gy+.66,z,G,{nc:1});}
  [[919,33],[952,36]].forEach(([x,z])=>{const gy=H(x,z);cyl(.05,.07,4.2,'#8a8e96',x,gy+2.1,z,G,{s:6});pbox(.7,.1,.2,'#3a3e48',x+.3,gy+4.15,z,G);lamp(.5,.04,.14,x+.3,gy+4.08,z);halo(x+.3,gy+3.9,z,3);});


  // ================= limestone rubble round the staging area (grey rocks on the hard sand, as in the photos) =================
  {const RC=['#8a8e96','#6a6e78','#9a9a98','#5a5e6a'];const rg=new THREE.DodecahedronGeometry(.5,0);let n=0;
    for(let k=0;k<400&&n<46;k++){const x=900+r()*70,z=12+r()*33;const pk=parkD(x,z);if(pk<1.2||pk>7)continue;if(x>967)continue;
      const m=new THREE.Mesh(rg,new THREE.MeshLambertMaterial({map:ctex(pface(pick(RC),16,16,1))}));const s=.18+r()*.38;m.scale.set(s*(1+r()*.6),s*.55,s);m.rotation.set(r(),r()*6,r()*.4);m.position.set(x,H(x,z)+s*.12,z);m.castShadow=true;m.receiveShadow=true;G.add(m);n++;}}
  // ================= other visitors' 4WDs in the staging area (generic shapes, no makes or badges) =================
  const car=(x,z,ry,body,roofRack)=>{const g=new THREE.Group();g.position.set(x,H(x,z),z);g.rotation.y=ry;G.add(g);const L=4.6,W=1.85;
      const sideC=cv(L,1.1,(c,Wp,Hp)=>{c.fillStyle=body;c.fillRect(0,0,Wp,Hp);c.fillStyle='rgba(0,0,0,.22)';c.fillRect(0,Hp-6,Wp,6);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(0,0,Wp,2);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(Wp*.42,4,1,Hp-10);c.fillRect(Wp*.66,4,1,Hp-10);c.fillStyle='#2a2a30';c.fillRect(Wp*.45,14,5,2);c.fillRect(Wp*.69,14,5,2);
        c.fillStyle='#26262c';[[Wp*.2,Hp],[Wp*.8,Hp]].forEach(([a,b])=>{c.beginPath();c.arc(a,b,15,Math.PI,0);c.fill();});});
      const glass=cv(2.6,.62,(c,Wp,Hp)=>{c.fillStyle=body;c.fillRect(0,0,Wp,Hp);c.fillStyle='#2a3440';c.fillRect(3,3,Wp-6,Hp-5);c.fillStyle='#6a8aa6';c.fillRect(5,4,Wp*.42,Hp-8);c.fillRect(Wp*.5,4,Wp*.45,Hp-8);c.fillStyle=body;c.fillRect(Wp*.47,3,3,Hp-5);});
      const fr=cv(W,1.1,(c,Wp,Hp)=>{c.fillStyle=body;c.fillRect(0,0,Wp,Hp);c.fillStyle='#2a2a30';c.fillRect(12,8,Wp-24,12);c.fillStyle='#fff0b0';c.fillRect(3,8,8,6);c.fillRect(Wp-11,8,8,6);c.fillStyle='#3a3e48';c.fillRect(0,Hp-8,Wp,6);});
      const bk=cv(W,1.1,(c,Wp,Hp)=>{c.fillStyle=body;c.fillRect(0,0,Wp,Hp);c.fillStyle='#c8344a';c.fillRect(3,6,6,8);c.fillRect(Wp-9,6,6,8);c.fillStyle='#e8e6e0';c.fillRect(Wp/2-8,16,16,6);c.fillStyle='#26262c';c.beginPath();c.arc(Wp/2,10,9,0,7);c.fill();c.fillStyle='#3a3e48';c.fillRect(0,Hp-8,Wp,6);});
      pbox(L,1.1,W,body,0,.95,0,g,{f:{pz:sideC,nz:sideC,px:fr,nx:bk}});
      const gl=glass;pbox(2.6,.62,W-.12,body,-.35,1.81,0,g,{f:{pz:gl,nz:gl}});pbox(2.5,.06,W-.2,body,-.35,2.15,0,g);
      if(roofRack){pbox(2.2,.08,1.5,'#2a2a30',-.35,2.24,0,g,{nc:1});pbox(1.6,.3,1.1,'#d8c49c',-.35,2.42,0,g);}
      [[1.45,.88],[1.45,-.88],[-1.5,.88],[-1.5,-.88]].forEach(([a,b])=>{cyl(.42,.42,.3,'#26262c',a,.42,b,g,{rx:Math.PI/2,s:12});cyl(.2,.2,.32,'#9aa0a6',a,.42,b,g,{rx:Math.PI/2,s:8,nc:1});});
      const c=Math.abs(Math.cos(ry)),s=Math.abs(Math.sin(ry)),hx=(L*c+W*s)/2,hz=(L*s+W*c)/2;col(x-hx,z-hz,x+hx,z+hz);return g;};
    car(946.5,30.5,Math.PI/2+.06,'#e8e6e0',1);car(950.6,30.8,Math.PI/2-.04,'#3a5a7a',0);car(957.2,30.2,Math.PI/2+.1,'#c8b088',1);car(915.8,29.6,-Math.PI/2+.12,'#5a6a4a',0);
    // white parking bays: a few timber wheel stops
    [944.4,948.6,952.8,955.2,959.4].forEach(x=>{pbox(1.4,.14,.18,'#7a5a3a',x,H(x,33.6)+.07,33.6,G,{nc:1});});
  // ================= the lookout on the highest crest =================
  {const x=P.look.x+.8,z=P.look.z+.3,gy=H(x,z);cyl(.05,.05,2.4,'#ececec',x,gy+1.2,z,G,{s:6});const f=plane(.6,.36,M('#e8572a'),x+.32,gy+2.2,z,0);f.material.side=THREE.DoubleSide;LAN.lookFlag=f;
    const s=signM(['LOOKOUT · 38 M','INDIAN OCEAN ←'],96,24,'#1d3a6e','#f6f2e8');plane(1.2,.3,s,x,gy+1.1,z+.06,0);}

  // ================= coastal shrubs: low grey-green heath at the edges (pixel sprites) =================
  if(typeof bushVariants!=='undefined'&&bushVariants.length){const tint=bushVariants.map(v=>{const m=v.m.clone();m.color=new THREE.Color('#b4bca4');return{m,d:v.d};});
    const bush=(x,z,s)=>{const v=tint[(r()*tint.length)|0];const g=new THREE.PlaneGeometry(1.5*s,.9*s);g.translate(0,.45*s,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,H(x,z)-.05,z);G.add(m);BB.push(m);};
    let n=0;for(let k=0;k<900&&n<90;k++){const x=852+r()*118,z=-44+r()*90;const h=H(x,z),pk=parkD(x,z);
      if(campD(x,z)<3||Math.abs(x-870.4)<3)continue;const edge=(x<880&&h>.4&&h<2.6)||(z>33&&pk>3)||(x>961&&z<12&&h<4.5)||(pk>2&&pk<5&&r()<.3);if(!edge||h<.3)continue;
      if(QPATH.some(p=>Math.abs(p[0]-x)<1.6&&Math.abs(p[1]-z)<1.6))continue;bush(x,z,.6+r()*.7);n++;
      if(r()<.5)bush(x+(r()-.5)*1.4,z+(r()-.5)*.8,.4+r()*.4);}}

  // ================= people: walkers on the crests, a family at the lookout, kids sandboarding, a queue at the truck =================
  const SKINS=['#f2c8a0','#c99a6e','#8a5a3a','#e8b890','#a87048'],HAIRS=['#1e1a18','#5a3a22','#c89a50','#2a2a30','#8a5a3a'],SHIRTS=['#2f6fb0','#c8344a','#f2c428','#3ec46a','#f6f2e8','#9478d4','#e8732a','#1d3a6e','#e8457a'];
  const person=o=>{const m=spriteMesh(humanFrames(Object.assign({skin:pick(SKINS),hair:pick(HAIRS),shirt:pick(SHIRTS),pants:pick(['#2a2a30','#3a4a6a','#6a5a4a','#4e6a86']),hat:r()<.4?pick(['#f6f2e8','#f2c428','#2a2a30']):null},o||{})),.95,1.58);G.add(m);return m;};
  const boardMesh=c=>{const b=pbox(1.1,.05,.34,c,0,0,0,G,{nc:1});return b;};
  WALKS.forEach((W,wi)=>{for(let k=0;k<(wi===0?3:2);k++){const m=person();const n={m,path:W,s:r()*W.length,dir:r()<.5?1:-1,sp:.9+r()*.5,wait:0,kind:'walk'};m.position.set(W[0][0],H(W[0][0],W[0][1]),W[0][1]);LAN.npc.push(n);}});
  // the family taking photos at the lookout
  [[-1.2,.6],[1.4,.9],[.4,1.8]].forEach(([dx,dz],i)=>{const x=P.look.x+dx,z=P.look.z+dz;const m=person(i===2?{shirt:'#e8457a'}:null);m.position.set(x,H(x,z),z);if(i===2)m.scale.set(.72,.72,.72);LAN.npc.push({m,kind:'idle',x,z,ph:r()*6});});
  // the queue at the truck hatch
  [[927.2,24.6],[928.6,25.4],[929.8,25.9],[925.8,25.4]].forEach(([x,z],i)=>{const m=person();m.position.set(x,H(x,z),z);m.userData.dir=1;LAN.npc.push({m,kind:'idle',x,z,ph:i});});
  // kids who walk up the sandboard dune and slide down, over and over
  [[938.6,'#3ec46a'],[949.4,'#e8732a']].forEach(([x,c],i)=>{const m=person({shirt:pick(SHIRTS)});m.scale.set(.75,.75,.75);const b=boardMesh(c);LAN.npc.push({m,b,kind:'board',x,zt:-2.2,zb:11.5,z:4+i*3,ph:i?1:0,st:i?'up':'down',v:0});});
  // two guided quads on the west loop
  for(let k=0;k<2;k++){const q=quadModel(k?'#3e9ad8':'#c8344a');G.add(q);const rd=person({hat:'#ffffff'});LAN.npc.push({kind:'quad',q,rd,s:k*Q2PATH.length/2,sp:5.5});}

  // ================= Driftwood Point Holiday Park (town side, behind the beach): powered sites, cabins, amenities, picnic & BBQ, the fishing jetty =================
  {const CP={};LAN.camp=CP;
    // ---- powered sites north of the lane: camper vans, a caravan with its awning, power posts ----
    const camper=(x,z,ry,body,stripe,name)=>{const g=new THREE.Group();g.position.set(x,H(x,z),z);g.rotation.y=ry;G.add(g);const L=5.6,W=2.2,Hh=2.2,y0=.45;
      const sideC=lit=>cv(L,Hh,(c,Wp,Hp)=>{c.fillStyle='#f4f4ee';c.fillRect(0,0,Wp,Hp);c.fillStyle=stripe;c.fillRect(0,Hp*.56,Wp,6);c.fillStyle=body;c.fillRect(0,Hp*.56+6,Wp,3);
        c.fillStyle='#2a3440';c.fillRect(Wp-38,8,30,22);c.fillStyle='#8aaac0';c.fillRect(Wp-36,10,26,9);// cab window
        [[18,14],[66,14]].forEach(([a,b])=>{c.fillStyle='#3a3e48';c.fillRect(a-1,b-1,30,18);c.fillStyle=lit?'#ffd890':'#6a8aa6';c.fillRect(a,b,28,16);c.fillStyle=lit?'#fff0c8':'#9ab4c8';c.fillRect(a,b,28,3);});
        c.fillStyle='#d8d8d2';c.fillRect(106,10,1,Hp-22);c.fillRect(124,10,1,Hp-22);c.fillStyle='#2a2a30';c.fillRect(120,40,3,2);
        txt(c,name,56,Hp*.56+22,stripe,7);c.fillStyle='#26262c';[[26,Hp],[Wp-30,Hp]].forEach(([a,b])=>{c.beginPath();c.arc(a,b,13,Math.PI,0);c.fill();});});
      const sm=litMat(sideC);const fr=cv(W,Hh,(c,Wp,Hp)=>{c.fillStyle='#f4f4ee';c.fillRect(0,0,Wp,Hp);c.fillStyle='#2a3440';c.fillRect(4,10,Wp-8,24);c.fillStyle='#8aaac0';c.fillRect(6,12,Wp-12,9);c.fillStyle=stripe;c.fillRect(0,Hp*.56,Wp,6);c.fillStyle='#fff0b0';c.fillRect(4,Hp*.68,8,5);c.fillRect(Wp-12,Hp*.68,8,5);c.fillStyle='#3a3e48';c.fillRect(0,Hp-8,Wp,6);});
      const bk=cv(W,Hh,(c,Wp,Hp)=>{c.fillStyle='#f4f4ee';c.fillRect(0,0,Wp,Hp);c.fillStyle='#3a3e48';c.fillRect(10,10,Wp-20,20);c.fillStyle='#6a8aa6';c.fillRect(12,12,Wp-24,16);c.fillStyle=stripe;c.fillRect(0,Hp*.56,Wp,6);c.fillStyle='#c8344a';c.fillRect(3,Hp*.66,6,8);c.fillRect(Wp-9,Hp*.66,6,8);c.fillStyle='#3a3e48';c.fillRect(0,Hp-8,Wp,6);});
      pbox(L,Hh,W,'#f4f4ee',0,y0+Hh/2,0,g,{f:{pz:sm,nz:sm,px:fr,nx:bk}});pbox(1.5,.5,W-.1,'#f4f4ee',1.6,y0+Hh+.25,0,g);pbox(.8,.12,.8,'#d8d8d2',-1,y0+Hh+.06,0,g,{nc:1});
      [[1.9,1.02],[1.9,-1.02],[-1.7,1.02],[-1.7,-1.02]].forEach(([a,b])=>{cyl(.38,.38,.26,'#26262c',a,.38,b,g,{rx:Math.PI/2,s:12});cyl(.17,.17,.28,'#b8bcc0',a,.38,b,g,{rx:Math.PI/2,s:8,nc:1});});
      const c=Math.abs(Math.cos(ry)),s=Math.abs(Math.sin(ry));col(x-(L*c+W*s)/2,z-(L*s+W*c)/2,x+(L*c+W*s)/2,z+(L*s+W*c)/2);return g;};
    const post=(x,z)=>{const gy=H(x,z);pbox(.28,.9,.22,'#3f7a34',x,gy+.45,z,G);pbox(.3,.06,.24,'#2f5a2e',x,gy+.93,z,G,{nc:1});lamp(.12,.06,.06,x,gy+.8,z+.12);};
    const pad=(x)=>{CP.pads=CP.pads||[];CP.pads.push(x);};
    [874,883.5,893,901.5].forEach(pad);
    camper(874,20.6,0,'#2f6a74','#3d7a78','SHORELINE CAMPERS');post(877.6,23.2);
    // the caravan with a striped awning, a table and chairs, its tow car
    {const x=884,z=20.4,g=new THREE.Group();g.position.set(x,H(x,z),z);G.add(g);const L=5,W=2.3,Hh=2.1,y0=.5;
      const sideC=lit=>cv(L,Hh,(c,Wp,Hp)=>{c.fillStyle='#f2efe6';c.fillRect(0,0,Wp,Hp);c.fillStyle='#a8303a';c.fillRect(0,Hp*.62,Wp,5);c.fillStyle='#e8a040';c.fillRect(0,Hp*.62+5,Wp,2);
        [[14,14,34],[96,14,40]].forEach(([a,b,w])=>{c.fillStyle='#3a3e48';c.fillRect(a-1,b-1,w+2,20);c.fillStyle=lit?'#ffd890':'#6a8aa6';c.fillRect(a,b,w,18);c.fillStyle=lit?'#fff0c8':'#9ab4c8';c.fillRect(a,b,w,3);c.fillStyle='#d8d4c8';c.fillRect(a-2,b-4,w+4,3);});
        c.fillStyle='#d8d4c8';c.fillRect(62,10,22,Hp-20);c.fillStyle='#b8b4a8';c.fillRect(62,10,1,Hp-20);c.fillRect(83,10,1,Hp-20);c.fillStyle='#2a2a30';c.fillRect(78,36,3,2);
        c.fillStyle='#26262c';c.beginPath();c.arc(Wp/2-6,Hp,13,Math.PI,0);c.fill();});
      const sm=litMat(sideC);const end=cv(W,Hh,(c,Wp,Hp)=>{c.fillStyle='#f2efe6';c.fillRect(0,0,Wp,Hp);c.fillStyle='#3a3e48';c.fillRect(14,12,Wp-28,18);c.fillStyle='#6a8aa6';c.fillRect(16,14,Wp-32,14);c.fillStyle='#a8303a';c.fillRect(0,Hp*.62,Wp,5);});
      pbox(L,Hh,W,'#f2efe6',0,y0+Hh/2,0,g,{f:{pz:sm,nz:sm,px:end,nx:end}});pbox(L-.2,.12,W-.1,'#e4e0d6',0,y0+Hh+.06,0,g);pbox(1,.3,.8,'#e4e0d6',.4,y0+Hh+.2,0,g,{nc:1});
      cyl(.36,.36,.24,'#26262c',0,.36,1.1,g,{rx:Math.PI/2,s:12});cyl(.36,.36,.24,'#26262c',0,.36,-1.1,g,{rx:Math.PI/2,s:12});
      pbox(1.3,.1,.1,'#3a3e48',L/2+.6,.48,.4,g,{nc:1,ry:-.3});pbox(1.3,.1,.1,'#3a3e48',L/2+.6,.48,-.4,g,{nc:1,ry:.3});pbox(.12,.5,.12,'#3a3e48',L/2+1.2,.25,0,g,{nc:1});pbox(.6,.4,.5,'#d8d6d0',L/2+.35,.75,0,g,{nc:1});
      const aw=cv(4,2.2,(c,Wp,Hp)=>{for(let i=0;i<Wp;i+=8){c.fillStyle=(i/8)%2?'#f6f2e8':'#3d7a78';c.fillRect(i,0,8,Hp);}c.fillStyle='rgba(0,0,0,.14)';c.fillRect(0,Hp-4,Wp,4);});
      const awn=plane(4,2.2,new THREE.MeshLambertMaterial({map:ctex(aw),side:THREE.DoubleSide}),-.2,y0+Hh-.15,W/2+1.05,0,g);awn.rotation.x=-1.38;awn.castShadow=true;
      [-2.1,1.7].forEach(a=>pbox(.04,y0+Hh-.2,.04,'#b8bcc0',a,(y0+Hh-.2)/2,W/2+2.1,g,{nc:1}));
      pbox(.9,.04,.6,'#f6f2e8',-.4,.68,W/2+1.2,g);[[-.8,-.2],[0,-.2],[-.8,.2],[0,.2]].forEach(([a,b])=>pbox(.03,.68,.03,'#8a8e96',-.4+a*.5+.2,.34,W/2+1.2+b,g,{nc:1}));
      [[-1.3,'#2f6fb0'],[.6,'#e8732a']].forEach(([a,cc])=>{pbox(.5,.05,.45,cc,a,.42,W/2+1.25,g);pbox(.5,.5,.04,cc,a,.66,W/2+1.05,g);});
      col(x-L/2-.1,z-W/2-.1,x+L/2+1.4,z+W/2+.1);post(887.6,23.2);
      car(890.4,20.6,0.02,'#4e6a86',1);}
    camper(896.6,20.8,Math.PI,'#c8344a','#e8732a','SUNDOWNER HIRE');post(899.8,23.2);
    {// a little dome tent on the last site
      const x=905.5,z=20.6,g=new THREE.Group();g.position.set(x,H(x,z),z);G.add(g);const tm=new THREE.Mesh(new THREE.SphereGeometry(1.2,8,4,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({map:ctex(pface('#e8b040',16,16,1))}));tm.scale.set(1.2,.9,1);tm.castShadow=true;g.add(tm);
      pbox(.7,.9,.04,'#3a3e48',0,.45,1.12,g,{nc:1});col(x-1.4,z-1.2,x+1.4,z+1.2);}
    const table=(x,z,ry,par)=>{const g=new THREE.Group();g.position.set(x,par?0:H(x,z),z);g.rotation.y=ry||0;(par||G).add(g);pbox(1.8,.07,.8,'#9a6a3e',0,.74,0,g);[-.62,.62].forEach(b=>pbox(1.8,.06,.28,'#8a5a32',0,.44,b,g));
      [-.7,.7].forEach(a=>{pbox(.08,.74,.08,'#6a4a2a',a,.37,0,g,{nc:1});pbox(.08,.06,1.5,'#6a4a2a',a,.4,0,g,{nc:1});});return g;};
    const shelter=(x,z,roofCol,inner)=>{const g=new THREE.Group();g.position.set(x,H(x,z),z);G.add(g);[[-1.7,-1.4],[1.7,-1.4],[-1.7,1.4],[1.7,1.4]].forEach(([a,b])=>pbox(.14,2.4,.14,'#e8e2d0',a,1.2,b,g,{nc:1}));
      const top=cv(4,4,(c,Wp,Hp)=>{c.fillStyle=roofCol;c.fillRect(0,0,Wp,Hp);c.fillStyle='rgba(255,255,255,.14)';for(let i=0;i<Wp;i+=6)c.fillRect(i,0,2,Hp);});
      const rf=new THREE.Mesh(new THREE.ConeGeometry(2.9,1,4,1,true),new THREE.MeshLambertMaterial({map:ctex(top),side:THREE.DoubleSide}));rf.rotation.y=Math.PI/4;rf.scale.set(1,1,.84);rf.position.y=2.86;rf.castShadow=true;g.add(rf);
      cyl(.06,.06,.3,'#e8e2d0',0,3.45,0,g,{s:6,nc:1});pbox(3.6,.12,3,'#b8a88c',0,.06,0,g,{nc:1});if(inner)inner(g);
      [[-1.7,-1.4],[1.7,-1.4],[-1.7,1.4],[1.7,1.4]].forEach(([a,b])=>col(x+a-.1,z+b-.1,x+a+.1,z+b+.1));return g;};
    // ---- cabins of several sizes with timber decks, colourful doors, corrugated roofs (for rent) ----
    CP.cabins=[];
    const cabin=(x,z,W,D,wc,door,i,kind)=>{const g=new THREE.Group();g.position.set(x,H(x,z)+.15,z);G.add(g);const Hh=kind==='cube'?2.9:2.5;
      const front=litMat(l=>{const c=PXK.wall(W,Hh,{base:wc,kind:'board',win:kind==='cube'?0:(W>4.5?3:1),door:true,doorAt:kind==='cube'?.25:.5,doorCol:door,lit:l,seed:71+i,cornice:false,quoins:false,moss:false,plinth:false});
        if(kind==='cube'){const x2=c.getContext('2d'),X=Math.round(c.width*.45),w=Math.round(c.width*.48),h=Math.round(c.height*.62);x2.drawImage(PXK.glass(w,h,{lit:l,tint:'#5a7a96',seed:9}),X,Math.round(c.height*.18));}return c;});
      const sideC=ctex(PXK.wall(D,Hh,{base:wc,kind:'board',win:1,seed:91+i,cornice:false,quoins:false,moss:false,plinth:false}));const sM=new THREE.MeshLambertMaterial({map:sideC});
      pbox(W,Hh,D,wc,0,Hh/2+.3,0,g,{f:{pz:front,nz:sM,px:sM,nx:sM}});pbox(W+.3,.3,D+.3,'#8a7a5a',0,.15,0,g);
      if(kind==='cube'){pbox(W+.5,.18,D+.5,'#2a2a30',0,Hh+.39,0,g);pbox(W+.2,.06,D+.2,'#5a5e6a',0,Hh+.5,0,g,{nc:1});}
      else{const rf=ctex(PXK.roof(W+.6,D*.62,{base:'#8a98a2',kind:'tin',seed:5+i}));const rM=new THREE.MeshLambertMaterial({map:rf,side:THREE.DoubleSide});const rise=D*.28,run=D/2+.3,ang=Math.atan2(rise,run),len=Math.hypot(rise,run);
        [1,-1].forEach(sg=>{const m=new THREE.Mesh(new THREE.BoxGeometry(W+.6,.06,len),rM);m.position.set(0,Hh+.3+rise/2,sg*run/2);m.rotation.x=sg*ang;m.castShadow=true;m.receiveShadow=true;g.add(m);});
        pbox(W+.62,.1,.14,'#5a6a76',0,Hh+.3+rise+.02,0,g,{nc:1});
        const tri=new THREE.Shape();tri.moveTo(-D/2,0);tri.lineTo(D/2,0);tri.lineTo(0,rise);tri.lineTo(-D/2,0);const tg=new THREE.ShapeGeometry(tri);
        [W/2,-W/2].forEach(xx=>{const m=new THREE.Mesh(tg,new THREE.MeshLambertMaterial({map:ctex(pface(wc,32,16,0)),side:THREE.DoubleSide}));m.rotation.y=Math.PI/2;m.position.set(xx,Hh+.3,0);m.castShadow=true;g.add(m);});}
      pbox(W,.12,1.5,'#9a6a3e',0,.36,D/2+.75,g);[-W/2+.1,W/2-.1].forEach(a=>pbox(.1,2.1,.1,'#f6f2e8',a,1.4,D/2+1.42,g,{nc:1}));
      pbox(W+.2,.06,1.7,kind==='cube'?'#3a3e48':'#9aa6ae',0,2.5,D/2+.8,g,{rx:.12});
      [[-W/2+.6,'#2f6fb0'],[W/2-.6,'#f2c428']].forEach(([a,cc])=>{pbox(.45,.05,.42,cc,a,.62,D/2+.9,g);pbox(.45,.45,.05,cc,a,.84,D/2+.68,g);});
      lamp(.12,.16,.08,W*.25,2.05,D/2+.05,g);halo(x+W*.25,g.position.y+2,z+D/2+.3,2.2);
      const pl=cv(.5,.3,(c,Wp,Hp)=>{c.fillStyle=door;c.fillRect(0,0,Wp,Hp);txt(c,String(i+1),Wp/2,Hp/2+1,'#ffffff',8);});pbox(.5,.3,.03,door,-W*.3,1.95,D/2+.02,g,{f:{pz:pl}});
      col(x-W/2-.15,z-D/2-.15,x+W/2+.15,z+D/2+.15);CP.cabins.push({x,z:z+D/2+1.6,kind});};
    cabin(885.6,30.6,3.4,3.2,'#e8dcc0','#e8732a',0,'studio');cabin(892.2,30.8,5.4,3.8,'#d8e4e0','#2f6fb0',1,'2-bedroom');cabin(898.6,30.6,3.2,3.2,'#3a3e48','#f2c428',2,'cube');
    // ---- reception + kiosk (coffee, bait, ice) with the boom gate on the park road ----
    {const x=905.4,z=31.4,W=4.8,D=3.4,Hh=2.8,g=new THREE.Group();g.position.set(x,H(x,z)+.1,z);G.add(g);
      const fr=litMat(l=>{const c=PXK.wall(W,Hh,{base:'#f2efe6',kind:'board',win:2,door:true,doorAt:.5,doorCol:'#3d7a78',lit:l,seed:131,moss:false,cornice:false,quoins:false});return c;});
      const sM=new THREE.MeshLambertMaterial({map:ctex(PXK.wall(D,Hh,{base:'#f2efe6',kind:'board',win:1,seed:132,moss:false,cornice:false,quoins:false}))});
      pbox(W,Hh,D,'#f2efe6',0,Hh/2,0,g,{f:{pz:fr,nz:sM,px:sM,nx:sM}});pbox(W+.8,.14,D+1.8,'#7a8a96',0,Hh+.1,.6,g,{rx:-.05});
      [-W/2-.25,W/2+.25].forEach(a=>pbox(.1,Hh,.1,'#f6f2e8',a,Hh/2,D/2+1.3,g,{nc:1}));
      const rs=cv(3.6,.42,(c,Wp,Hp)=>{c.fillStyle='#2f5a2e';c.fillRect(0,0,Wp,Hp);txt(c,'RECEPTION · KIOSK',Wp/2,Hp/2+1,'#ffffff',9);});pbox(3.6,.42,.04,'#2f5a2e',0,Hh+.45,D/2+1.42,g,{f:{pz:rs}});
      const af=cv(.6,.9,(c,Wp,Hp)=>{c.fillStyle='#2a2a30';c.fillRect(0,0,Wp,Hp);c.fillStyle='#3a5a3a';c.fillRect(1,1,Wp-2,Hp-2);txt(c,'COFFEE',Wp/2,7,'#ffffff',6);txt(c,'BAIT',Wp/2,15,'#f2c428',7);txt(c,'ICE',Wp/2,23,'#a8d8e8',7);});
      {const a=new THREE.Group();a.position.set(1.6,0,D/2+1.9);g.add(a);pbox(.6,.9,.04,'#3a5a3a',0,.45,.12,a,{rx:-.22,f:{pz:af}});pbox(.6,.9,.04,'#3a5a3a',0,.45,-.12,a,{rx:.22,f:{nz:af}});}
      const ic=cv(1.1,.9,(c,Wp,Hp)=>{c.fillStyle='#f6f6f2';c.fillRect(0,0,Wp,Hp);c.fillStyle='#2f6fb0';c.fillRect(0,4,Wp,8);txt(c,'ICE',Wp/2,8,'#ffffff',7);c.fillStyle='#b8bcc0';c.fillRect(3,16,Wp-6,1);});
      pbox(1.1,.9,.7,'#f6f6f2',-1.7,.45,D/2+.45,g,{f:{pz:ic}});lamp(.3,.05,.1,0,Hh-.05,D/2+1.2,g);halo(x,g.position.y+2.5,z+D/2+1.2,3);
      col(x-W/2-.1,z-D/2-.1,x+W/2+.1,z+D/2+.1);col(x-2.3,z+D/2,x-1.1,z+D/2+.85);CP.kiosk={x:x+.4,z:z+D/2+1.2};
      // boom gate across the park road at the lane mouth
      const bx=910.4,bz=23.6,by=H(bx,bz);pbox(.4,1,.4,'#f2c428',bx,by+.5,bz,G);const arm=new THREE.Group();arm.position.set(bx,by+.92,bz);G.add(arm);
      const st=cv(3,.12,(c,Wp,Hp)=>{for(let i=0;i<Wp;i+=12){c.fillStyle=(i/12)%2?'#ffffff':'#c8344a';c.fillRect(i,0,12,Hp);}});pbox(3,.1,.1,'#ffffff',0,0,1.5,arm,{ry:Math.PI/2,f:{pz:st,nz:st,py:st}});arm.rotation.x=-.9;CP.arm=arm;
      col(bx-.25,bz-.25,bx+.25,bz+.25);}
    // ---- central camp kitchen + dining area, herb garden beside it ----
    {const x=889.6,z=39.2,W=5.4,D=4,g=new THREE.Group();g.position.set(x,H(x,z),z);G.add(g);
      pbox(W+.4,.12,D+.4,'#b8a88c',0,.06,0,g,{nc:1});[[-1,-1],[1,-1],[-1,1],[1,1],[0,-1],[0,1]].forEach(([a,b])=>pbox(.14,2.7,.14,'#f6f2e8',a*W/2,1.35,b*D/2,g,{nc:1}));
      const rf=ctex(PXK.roof(W+.8,D+.8,{base:'#7a8a96',kind:'tin',seed:44}));const r=new THREE.Mesh(new THREE.BoxGeometry(W+.8,.12,D+.8),[M('#5a6a76'),M('#5a6a76'),new THREE.MeshLambertMaterial({map:rf}),M('#5a6a76'),M('#5a6a76'),M('#5a6a76')]);r.position.y=2.78;r.rotation.x=-.06;r.castShadow=true;g.add(r);
      pbox(W-.4,.9,.7,'#b8bcc0',0,.45,-D/2+.45,g);pbox(W-.3,.06,.76,'#e4e6e8',0,.93,-D/2+.45,g,{nc:1});[-1.6,0,1.4].forEach(a=>pbox(.5,.04,.4,'#8a8e96',a,.97,-D/2+.45,g,{nc:1}));pbox(.7,1.7,.65,'#f6f6f2',W/2-.5,.85,-D/2+.45,g);
      table(-1.2,.7,0,g);table(1.3,.7,0,g);
      const ks=cv(2.6,.4,(c,Wp,Hp)=>{c.fillStyle='#3d7a78';c.fillRect(0,0,Wp,Hp);txt(c,'CAMP KITCHEN',Wp/2,Hp/2+1,'#ffffff',8);});pbox(2.6,.4,.04,'#3d7a78',0,2.45,D/2+.1,g,{f:{pz:ks,nz:ks}});
      lamp(.3,.05,.1,0,2.66,0,g);halo(x,g.position.y+2.4,z,3.4);col(x-W/2+.1,z-D/2,x+W/2-.1,z-D/2+.9);
      // herb garden: raised timber beds of rosemary, basil, parsley
      [[-4.6,-.6],[-4.6,1.1]].forEach(([a,b],k)=>{pbox(1.9,.4,1.1,'#7a5a3a',a,.2,b,g);const hc=cv(1.8,1,(c,Wp,Hp)=>{c.fillStyle='#5a3a22';c.fillRect(0,0,Wp,Hp);for(let q=0;q<70;q++){const X=(q*37)%Wp,Y=(q*23)%Hp;c.fillStyle=['#3f7a34','#5a9a40','#7ab454','#2f5a2e','#a8d070'][(q+k)%5];c.fillRect(X,Y,3,2);if(q%9===0){c.fillStyle='#9478d4';c.fillRect(X+1,Y,1,1);}}});
        pbox(1.8,.06,1,'#3f7a34',a,.42,b,g,{nc:1,f:{py:hc}});});
      const hs=signM(['HERB GARDEN','PICK A LITTLE'],72,22,'#f6f2e8','#2f5a2e');plane(.9,.28,hs,-4.6,.75,1.75,0,g);col(x-5.6,z-1.2,x-3.6,z+1.7);}
    // ---- amenities + laundry block ----
    {const x=900.6,z=39.4,W=7.2,D=3.8,Hh=2.8,g=new THREE.Group();g.position.set(x,H(x,z)+.1,z);G.add(g);
      const fr=litMat(l=>{const c=PXK.wall(W,Hh,{base:'#d8d2c4',kind:'brick',win:3,door:true,doorAt:.2,doorCol:'#3d7a78',lit:l,seed:101,moss:false,cornice:false});const x2=c.getContext('2d');
        x2.fillStyle='#1d3a6e';x2.fillRect(c.width*.5,8,c.width*.46,12);txt(x2,'AMENITIES · LAUNDRY',c.width*.73,14,'#ffffff',7);return c;});
      const sM=new THREE.MeshLambertMaterial({map:ctex(PXK.wall(D,Hh,{base:'#d8d2c4',kind:'brick',win:1,seed:102,moss:false,cornice:false}))});
      pbox(W,Hh,D,'#d8d2c4',0,Hh/2,0,g,{f:{pz:fr,nz:sM,px:sM,nx:sM}});pbox(W+.4,.16,D+.4,'#7a8a96',0,Hh+.08,0,g);pbox(W+.5,.06,D+.5,'#5a6a76',0,Hh+.2,0,g,{nc:1});
      lamp(.14,.16,.08,-W/2+1.2,2.2,D/2+.06,g);halo(x-W/2+1.2,g.position.y+2.1,z+D/2+.3,2.4);
      // a clothes line out the back
      [-1.6,1.6].forEach(a=>pbox(.06,1.7,.06,'#8a8e96',a,.85,-D/2-1.1,g,{nc:1}));pbox(3.2,.02,.02,'#e8e6e0',0,1.62,-D/2-1.1,g,{nc:1});
      ['#e8457a','#f6f2e8','#2f6fb0','#f2c428'].forEach((cc,k)=>pbox(.42,.5,.02,cc,-1.1+k*.72,1.36,-D/2-1.1,g,{nc:1}));
      col(x-W/2-.1,z-D/2-.1,x+W/2+.1,z+D/2+.1);}
    // ---- grassy parkland by the road, overlooking the ocean: BBQ shelter, a table shelter, open tables, a small playground ----
    shelter(876.2,40.2,'#3f7a34',g=>{table(0,0,0,g);});
    CP.bbq={x:876.2,z:33.6};shelter(876.2,33.6,'#2f6a74',g=>{const bf=cv(1.7,.9,(c,Wp,Hp)=>{c.fillStyle='#b8bcc0';c.fillRect(0,0,Wp,Hp);c.fillStyle='#d8dadc';c.fillRect(0,0,Wp,3);c.fillStyle='#8a8e96';c.fillRect(4,8,Wp-8,1);c.fillRect(4,Hp-6,Wp-8,1);
        c.fillStyle='#a8303a';c.beginPath();c.arc(Wp*.3,Hp*.45,4,0,7);c.arc(Wp*.7,Hp*.45,4,0,7);c.fill();txt(c,'FREE BBQ · PRESS',Wp/2,Hp*.75,'#2a2a30',6);});
      pbox(1.7,.9,.75,'#b8bcc0',0,.45,-.4,g,{f:{pz:bf}});CP.plate=pbox(1.6,.04,.62,'#2a2a30',0,.92,-.4,g,{nc:1});pbox(1.7,.12,.06,'#b8bcc0',0,.98,-.78,g,{nc:1});
      pbox(1.2,.06,.5,'#9a6a3e',0,.8,.8,g);pbox(.08,.8,.08,'#6a4a2a',-.5,.4,.8,g,{nc:1});pbox(.08,.8,.08,'#6a4a2a',.5,.4,.8,g,{nc:1});cyl(.25,.22,.8,'#3f7a34',1.4,.4,.9,g,{s:8});});
    col(875.3,32.9,877.1,33.4);
    table(880.6,36.8,.15);table(873.6,37,-.1);table(882,42.4,.05);
    {const x=882.2,z=39.6,g=new THREE.Group();g.position.set(x,H(x,z),z);G.add(g);pbox(3.4,.06,2.6,'#e8b878',0,.03,0,g,{nc:1});
      // swings
      [[-1.5,-.9],[-1.5,.9]].forEach(([a,b])=>{pbox(.08,1.9,.08,'#c8344a',a-.3,.95,b,g,{nc:1,rz:.15});pbox(.08,1.9,.08,'#c8344a',a+.3,.95,b,g,{nc:1,rz:-.15});});pbox(.08,.08,1.9,'#c8344a',-1.5,1.86,0,g,{nc:1});
      [-.4,.4].forEach(b=>{pbox(.02,1.2,.02,'#3a3e48',-1.5,1.2,b,g,{nc:1});pbox(.3,.04,.18,'#2a2a30',-1.5,.6,b,g,{nc:1});});
      // a little slide
      pbox(.9,1.2,.9,'#2f6fb0',.8,.6,-.4,g);pbox(.9,.06,.9,'#f2c428',.8,1.23,-.4,g,{nc:1});pbox(.5,.05,1.8,'#f2c428',.8,.62,.7,g,{rx:.62});pbox(.9,.5,.06,'#2f6fb0',.8,1.5,-.85,g,{nc:1});
      col(x-1.9,z-1.3,x-1.1,z+1.3);col(x+.3,z-.9,x+1.3,z+.1);}
    // the park sign by the lane mouth, speed sign
    {const s=signM(['DRIFTWOOD POINT HOLIDAY PARK','POWERED SITES · CABINS · CAMP KITCHEN'],176,28,'#2f5a2e','#f6f2e8');const g=new THREE.Group();g.position.set(911.2,H(911.2,28.6),28.6);G.add(g);
      plane(3.3,.54,s,0,1.55,0,0,g);[-1.5,1.5].forEach(a=>pbox(.12,1.85,.12,'#5a3a22',a,.92,-.03,g));pbox(3.4,.1,.2,'#3a2a1a',0,1.86,0,g);col(909.5,28.4,912.9,28.8);
      const sp=signM(['10','KM/H'],24,24,'#ffffff','#a8303a');plane(.42,.42,sp,-2.7,1.2,.05,0,g);pbox(.05,1.2,.05,'#8a8e96',-2.7,.6,0,g,{nc:1});}
    // lamp posts along the park road
    [[879.5,27.4],[895.6,27.6],[872.4,22]].forEach(([x,z])=>{const gy=H(x,z);cyl(.05,.06,3.4,'#3a3e48',x,gy+1.7,z,G,{s:6});pbox(.36,.12,.2,'#3a3e48',x,gy+3.4,z,G);lamp(.28,.04,.14,x,gy+3.33,z);halo(x,gy+3.2,z,2.6);});
    // ---- the fishing jetty off the beach (timber deck on piles) ----
    CP.jetty=JT;
    {const J=CP.jetty,len=J.x2-J.x1,g=new THREE.Group();G.add(g);
      const dk=cv(len,J.w,(c,Wp,Hp)=>{c.fillStyle='#a87a4a';c.fillRect(0,0,Wp,Hp);for(let i=0;i<Wp;i+=5){c.fillStyle=(i/5)%3?'#9a6a3e':'#b98552';c.fillRect(i,0,4,Hp);c.fillStyle='#6a4a2a';c.fillRect(i+4,0,1,Hp);}c.fillStyle='#5a3a22';c.fillRect(0,0,Wp,2);c.fillRect(0,Hp-2,Wp,2);});
      const dt=ctex(dk);const deck=new THREE.Mesh(new THREE.BoxGeometry(len,.16,J.w),[M('#8a5a32'),M('#8a5a32'),new THREE.MeshLambertMaterial({map:dt}),M('#6a4a2a'),M('#8a5a32'),M('#8a5a32')]);
      deck.position.set((J.x1+J.x2)/2,J.deck-.08,J.z);deck.castShadow=true;deck.receiveShadow=true;g.add(deck);
      {const e=H(J.xe,J.z)+.05,L2=J.xe-J.x2,ang=Math.atan2(J.deck-e,L2);const rp=pbox(Math.hypot(L2,J.deck-e),.16,J.w,'#9a6a3e',(J.x2+J.xe)/2,(J.deck+e)/2-.08,J.z,g,{rz:ang,f:{py:dk}});}
      for(let x=J.x1+.3;x<J.x2-1;x+=2.4)[-1,1].forEach(s=>{const top=J.deck-.1,bot=Math.min(H(x,J.z+s*J.w*.45),-.2)-1.2;cyl(.13,.13,top-bot,'#5a3a22',x,(top+bot)/2,J.z+s*J.w*.45,g,{s:6});});
      for(let x=J.x1;x<J.x2-2;x+=1.2)[-1,1].forEach(s=>pbox(.08,.9,.08,'#6a4a2a',x,J.deck+.45,J.z+s*(J.w/2-.05),g,{nc:1}));
      [-1,1].forEach(s=>pbox(len-2,.08,.1,'#9a6a3e',(J.x1+J.x2-2)/2,J.deck+.88,J.z+s*(J.w/2-.05),g,{nc:1}));
      pbox(.06,.06,.06,'#26262c',0,0,0,g,{nc:1});lamp(.16,.16,.16,J.x1+.4,J.deck+1.25,J.z-J.w/2+.05,g);cyl(.04,.04,1.3,'#3a3e48',J.x1+.4,J.deck+.6,J.z-J.w/2+.05,g,{s:5,nc:1});halo(J.x1+.4,J.deck+1.2,J.z-J.w/2,2.6);
      const fs=signM(['JETTY · FISHING OK','NO DIVING'],96,22,'#1d3a6e','#f6f2e8');plane(1.2,.28,fs,J.x2-1.4,J.deck+1.1,J.z+J.w/2+.06,0,g);}
    // ---- Norfolk Island pines along the foreshore, a few shady gums in the park (pixel sprites) ----
    if(typeof treeVariants!=='undefined'&&treeVariants.length){const tree=(x,z,v,s)=>{const gg=new THREE.PlaneGeometry(v.w*s,v.h*s);gg.translate(0,v.h*s/2,0);const m=new THREE.Mesh(gg,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,H(x,z)-.05,z);G.add(m);BB.push(m);};
      const pine=treeVariants[3]||treeVariants[0];[[868.4,19],[868.8,26.5],[869,40.5],[868.6,44]].forEach(([x,z])=>tree(x,z,pine,1.35));
      [[879,19.4],[888.4,17.6],[901.6,17.8],[907.8,42.6],[894.8,43.4],[884.6,43.6],[872.6,29.6],[903.2,35.6],[888.8,35.2]].forEach(([x,z],i)=>tree(x,z,treeVariants[i%3],.72+(i%3)*.1));}
    // ---- families: a picnic, the BBQ, kids on the lawn, someone fishing off the jetty, a beach walker ----
    const fam=[[875.4,41.4,{}],[877.2,41.3,{}],[876.4,38.6,{s:.7}],[875.6,34.9,{}],[877.4,35,{s:.72}],[880.6,38,{}],[881.6,41.4,{s:.68}],[883.2,38.6,{s:.7}],[889,41.2,{}],[891,41.3,{}],[904.6,34.6,{}],[875.2,23.4,{}],[882.4,24.2,{}],[892.2,35.3,{}]];
    fam.forEach(([x,z,o],i)=>{const m=person();if(o.s)m.scale.set(o.s,o.s,o.s);m.position.set(x,H(x,z),z);LAN.npc.push({m,kind:o.s?'kid':'idle',x,z,ph:i*1.3,x0:x});});
    {const J=CP.jetty,m=person({hat:'#f2c428'});m.position.set(J.x1+2.2,J.deck,J.z+.6);LAN.npc.push({m,kind:'idle',x:J.x1+2.2,z:J.z+.6,y:J.deck,ph:2});
      const rod=cyl(.012,.012,2.6,'#2a2a30',J.x1+1.6,J.deck+1.5,J.z+.6,G,{s:4,nc:1});rod.rotation.z=.9;}
    {const m=person();LAN.npc.push({m,kind:'walk',path:spline([[864.5,17],[865.2,28],[864.4,38],[865,44]],false,.2),s:0,dir:1,sp:.8,wait:0});m.position.set(864.5,H(864.5,17),17);}
    // smoke from the BBQ while Kip cooks
    {const sm=[];const c=mk(8,8),x=c.getContext('2d');x.fillStyle='rgba(240,240,236,.9)';x.fillRect(2,2,4,4);x.fillRect(1,3,6,2);x.fillRect(3,1,2,6);const t=ctex(c);
      for(let k=0;k<8;k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,opacity:0}));s.scale.set(.45,.45,1);G.add(s);sm.push(s);}CP.smoke=sm;CP.cook=0;}
  }
  // ================= sand spray particles (shared by board + quad) =================
  {const N=60,g=new THREE.BufferGeometry(),pos=new Float32Array(N*3);g.setAttribute('position',new THREE.BufferAttribute(pos,3));const c=mk(4,4),x=c.getContext('2d');x.fillStyle='#f6f2e8';x.fillRect(0,0,4,4);x.fillStyle='#d8d4c8';x.fillRect(2,2,2,2);
    const pts=new THREE.Points(g,new THREE.PointsMaterial({size:.13,map:ctex(c),transparent:true,depthWrite:false,opacity:.9}));pts.frustumCulled=false;G.add(pts);LAN.spray={pts,pos,P:[...Array(N)].map(()=>({x:0,y:-99,z:0,vx:0,vy:0,vz:0,l:0})),i:0};}
  const puff=(x,y,z,vx,vz,n)=>{const S2=LAN.spray;for(let k=0;k<n;k++){const p=S2.P[S2.i++%S2.P.length];p.x=x+(r()-.5)*.3;p.y=y;p.z=z+(r()-.5)*.3;p.vx=vx*.3+(r()-.5)*1.2;p.vy=1+r()*1.6;p.vz=vz*.3+(r()-.5)*1.2;p.l=.5+r()*.4;}};

  // ================= rides: sandboard + quad loop (Kip) =================
  const kipBoard=boardMesh('#3e9ad8');kipBoard.visible=false;
  const pathLen=p=>{let L=0;const c=[0];for(let i=1;i<p.length;i++){L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);c.push(L);}return{L,c};};
  const atS=(p,cum,s)=>{let lo=0,hi=cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(cum[m]<=s)lo=m;else hi=m;}const t=(s-cum[lo])/Math.max(1e-6,cum[hi]-cum[lo]);const a=p[lo],b=p[hi];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,Math.atan2(-(b[1]-a[1]),b[0]-a[0])];};
  const QL=pathLen(QPATH),Q2L=pathLen(Q2PATH);
  const BOARD_RUN=spline([[944,-3.2],[943.4,1],[944.8,5],[943.6,9],[944,13.2]],false,.2),BL=pathLen(BOARD_RUN);
  const orient=(o,x,z,yaw,len)=>{const c=Math.cos(yaw),s=-Math.sin(yaw);const hf=H(x+c*len/2,z+s*len/2),hb=H(x-c*len/2,z-s*len/2),hl=H(x-s*.4,z+c*.4),hr=H(x+s*.4,z-c*.4);
    o.position.set(x,(hf+hb)/2,z);o.rotation.order='YZX';o.rotation.set(Math.atan2(hr-hl,.8)*.8,yaw,Math.atan2(hf-hb,len));};
  function startBoard(){if(LAN.ride)return;if(!LAN.board){toast('Hire a sandboard at the White Crest truck first (10 coins)',2.6);return;}
    LAN.ride={kind:'board',s:0,v:1.2,t:0};kipBoard.visible=true;toast('Hold on…',1.2);}
  function startQuad(){if(LAN.ride)return;const Q=LAN.quads.find(q=>!q.busy);if(!Q){toast('All quads are out, wait a moment',2);return;}if(!pay(40))return;
    // start from the nearest point of the loop to the parked quad
    let best=0,bd=1e9;QPATH.forEach((p,i)=>{const d=Math.hypot(p[0]-Q.hx,p[1]-Q.hz);if(d<bd){bd=d;best=i;}});
    Q.busy=true;LAN.ride={kind:'quad',Q,s0:QL.c[best],s:0,v:0,t:0,lift:1};say(['Quad guide: Helmet on, Kip! Follow the orange flags. One loop over the dunes and back.']);}
  const endRide=away=>{const R=LAN.ride;if(!R)return;LAN.ride=null;kipBoard.visible=false;
    if(R.kind==='quad'){const Q=R.Q;Q.q.position.set(Q.hx,H(Q.hx,Q.hz),Q.hz);Q.q.rotation.set(0,Math.PI/2,0);Q.busy=false;if(away)return;player.x=Q.hx;player.z=Q.hz+1.6;S.lanQuad=(S.lanQuad||0)+1;popText('What a ride!',{x:player.x,y:H(player.x,player.z)+2,z:player.z});}
    else{if(away)return;S.lanBoard=(S.lanBoard||0)+1;popText(S.lanBoard>1?'Again!':'Wheee!',{x:player.x,y:H(player.x,player.z)+2,z:player.z});if(S.lanBoard===1)say(['Kip: That was amazing! The sand is so soft and white.','Guide: Walk back up and go again, the board is yours for the day.']);}
    save();};
  LAN.endRide=endRide;
  // the ride takes over Kip after the normal update (input is ignored while riding)
  {const _up=updatePlayer;updatePlayer=function(dt){const R=LAN.ride;if(!R||zoneOf(player.x)!=='lan'){if(R&&zoneOf(player.x)!=='lan')endRide(true);return _up(dt);}
      const kk=[...keys];keys.clear();const jj=joyId;joyId=null;try{_up(dt);}finally{kk.forEach(k=>keys.add(k));joyId=jj;}
      R.t+=dt;
      if(R.kind==='board'){const [x0,z0]=atS(BOARD_RUN,BL.c,R.s),[x1,z1,yaw]=atS(BOARD_RUN,BL.c,Math.min(BL.L,R.s+.5));const sl=(H(x0,z0)-H(x1,z1))/.5;
        R.v=Math.max(1,R.v+(9.8*sl*.6-.5-.035*R.v*R.v)*dt);R.s+=R.v*dt;const [x,z,yw]=atS(BOARD_RUN,BL.c,Math.min(BL.L,R.s));player.x=x;player.z=z;
        const gy=H(x,z);orient(kipBoard,x,z,yw,1.1);kipBoard.position.y+=.04;player.face=Math.cos(yw)>=0?1:-1;
        setFrame(player.mesh,0);player.mesh.position.set(x,gy+.1+Math.sin(R.t*14)*.02,z);player.mesh.scale.x=player.face*(1+Math.sin(R.t*9)*.04);player.blob.position.set(x,gy+.03,z);
        if(R.v>2&&r()<.7)puff(x,gy+.05,z,-Math.cos(yw)*R.v,Math.sin(yw)*R.v,2);
        if(R.s>=BL.L-.05){player.z+=.3;endRide();}}
      else{const Q=R.Q;R.v=Math.min(7,R.v+3*dt);const lap=R.s>=QL.L-.3;if(lap){R.v=Math.max(0,R.v-8*dt);}R.s=Math.min(QL.L,R.s+R.v*dt);
        const ss=(R.s0+R.s)%QL.L;let [x,z,yw]=atS(QPATH,QL.c,ss);
        // first metres: ease off the parking row onto the loop
        if(R.s<4){const k=R.s/4;x=Q.hx+(x-Q.hx)*k;z=Q.hz+(z-Q.hz)*k;}
        if(R.s>QL.L-4){const k=(QL.L-R.s)/4;x=Q.hx+(x-Q.hx)*k;z=Q.hz+(z-Q.hz)*k;}
        orient(Q.q,x,z,yw,1.2);Q.q.userData.body.position.y=Math.abs(Math.sin(R.t*11))*.03;
        player.x=x;player.z=z;player.face=Math.cos(yw)>=0?1:-1;setFrame(player.mesh,0);player.mesh.position.set(x,Q.q.position.y+.62,z);player.mesh.scale.x=player.face;player.blob.position.set(x,-9,z);
        if(R.v>3&&r()<.8)puff(x-Math.cos(yw)*.7,Q.q.position.y+.1,z+Math.sin(yw)*.7,-Math.cos(yw)*R.v,Math.sin(yw)*R.v,2);
        if(R.s>=QL.L-.01||R.t>60)endRide();}};}

  // ================= things to do =================
  const rentCabin=c=>()=>{if(!pay(30))return;transit=true;fadeTarget=.95;toast('Checking in at Driftwood Point…',1.6);
    setTimeout(()=>{try{if(S.time>=OPEN)newDay();}catch(e){}S.time=typeof OPEN==='number'?OPEN:420;if(TOUR&&TOUR.T)TOUR.t0=S.time-Math.round(TOUR.T.hrs*60*.6);
      try{customers.slice().forEach(removeCustomer);}catch(e){}player.x=c.x;player.z=c.z;updateCamera(0,true);fadeTarget=0;transit=false;S.lanNights=(S.lanNights||0)+1;save();
      say(['(A night in the '+c.kind+' cabin at Driftwood Point · a new day)','Kip: Good morning, Lancelin! I can hear the surf from the deck.']);},900);};
  K.targets=function(T){if(LAN.ride)return;const CP=LAN.camp;
    if(CP){CP.cabins.forEach(c=>T.push({x:c.x,z:c.z,r:1.4,label:'Rent the '+c.kind+' cabin for the night (30)',act:rentCabin(c)}));
      T.push({x:CP.bbq.x,z:CP.bbq.z+1.5,r:1.6,label:'Free BBQ · cook a sausage sizzle',act:()=>{if(CP.cook>0)return;CP.cook=4.5;toast('Press the button… the hotplate warms up',2);}});
      T.push({x:CP.kiosk.x,z:CP.kiosk.z,r:1.5,label:'Kiosk · flat white, bait & a bag of ice (5)',act:()=>{if(!pay(5))return;S.refreshed=true;save();say([pick(['Kip: A flat white and a bag of ice, please.','Kip: A small bag of bait and a hot chocolate, please!','Kip: Ice for the esky and a coffee, thanks!']),'Kiosk: Here you go. The jetty is the best spot for herring this time of day.']);}});
      T.push({x:JT.x1+1,z:JT.z,r:1.5,label:'Fish off the jetty',act:()=>startFishing({name:'the Lancelin jetty',zone:'lan'})});}
    T.push({x:P.truck.x-.4,z:P.truck.z+2.2,r:1.5,label:'White Crest truck · cold drink & hot chips (6)',act:()=>{if(!pay(6))return;S.refreshed=true;save();
      say([pick(['Kip: One icy lemon squash, please!','Kip: A cold lime soda and a cup of hot chips, please!','Kip: An ice block, the blue one!']),'Truck: There you go, enjoy the dunes! (Kip feels refreshed and walks faster today)']);}});
    T.push({x:P.rack.x,z:P.rack.z+.4,r:1.3,label:LAN.board?'Sandboard hired · go up the sandboard dune':'Hire a sandboard (10)',act:()=>{if(LAN.board){toast('Take it up the yellow-sign dune and slide down!',2.4);return;}if(!pay(10))return;LAN.board=true;
      say(['Truck: Here is your board. Walk up past the yellow sign, sit on it and push off!','Guide: Lean back a little and keep your feet up.']);}});
    T.push({x:P.quadHire.x,z:P.quadHire.z,r:1.6,label:'Ride a quad bike over the dunes (40)',act:startQuad});
    T.push({x:P.board.x,z:P.board.z,r:1.8,label:LAN.board?'Sandboard down the dune!':'Sandboard dune (hire a board at the truck)',act:startBoard});
    T.push({x:P.look.x,z:P.look.z,r:2,label:'Lookout · the highest crest',act:()=>{S.tourCards=S.tourCards||{};const first=!S.tourCards.lancelin;if(first)S.tourCards.lancelin=S.day||1;save();
      say(['Kip: Wow… white dunes all the way to the sky!','Guide: Out west is the Indian Ocean. The wind comes off the sea and keeps moving these dunes, a little every year.','Guide: The quads run on the east side, and the steep one by the yellow sign is the sandboard dune.'].concat(first?['(Postcard kept: Lancelin Sand Dunes)']:[]));}});};
  K.zone={rects:[[850,-45,970,45,'#f2eee4'],[850,-45,864,45,'#5cc6d8'],[862,-45,869,45,'#e8e2d0'],[912,15,966,40,'#d6d1c5'],[966,27,970,33,'#c8c2b4'],[869,17,909,43,'#8ab46a'],[868.9,15.6,871.9,45,'#5a5e6a'],[851.2,31.9,869.4,34.1,'#9a6a3e'],[883.9,29,887.3,32.2,'#e8dcc0'],[889.5,28.9,894.9,32.7,'#d8e4e0'],[897,29,900.2,32.2,'#3a3e48'],[903,29.7,907.8,33.1,'#f2efe6'],[897,37.5,904.2,41.3,'#d8d2c4'],[886.9,37.2,892.3,41.2,'#c8c2b4'],[924.5,20.8,933.2,23.2,'#f6f6f2'],[956.8,19.8,960.2,23.2,'#2f6fb0'],[934.7,31.6,940.3,33.6,'#ffffff']],
    labels:[['Lancelin Sand Dunes',915,-8,1],['Driftwood Point Holiday Park',890,35,1],['Jetty',858,31.6,0],['Cabins',892,28,0],['Reception',905.4,28.8,0],['Camp kitchen',889.6,42,0],['BBQ',876.2,31.6,0],['Indian Ocean',856,0,1],['Lookout',897,-25,1],['Sandboard dune',944,-6,1],['Staging area',938,36,0],['Snack truck',928.5,19.5,0],['Quad hire',948,15.5,0],['Quad loop',962,-14,0]]};

  // ================= animation =================
  const pv=new THREE.Vector3();
  K.tick=function(dt,t){dt=Math.min(dt,.05);
    // paint the ground lazily, nearest chunks first (2 per frame)
    if(LAN.painted<LAN.chunks.length){const t0=performance.now();const todo=LAN.chunks.filter(c=>!c.done).sort((a,b)=>Math.abs(a.cx-player.x)+Math.abs(a.cz-player.z)-Math.abs(b.cx-player.x)-Math.abs(b.cz-player.z));
      for(const C of todo){const left=(LAN.budget||9)-(performance.now()-t0);if(left<1)break;if(paintChunk(C,left))LAN.painted++;else break;}}
    if(!LAN.here){LAN.here=true;}
    // water + swash
    if(LAN.water){LAN.water.offset.set((t*.01)%1,(t*.025)%1);}
    LAN.foam.forEach(F=>{const s=Math.sin(t*.9+F.k*1.7);F.m.position.x=F.k===0?s*.45:((t*.35+F.k*.33)%1)*2.4-1.2;F.m.material.opacity=F.k===0?F.op*(.75+.25*s):F.op*Math.sin(((t*.35+F.k*.33)%1)*Math.PI);});
    // night lights
    const n=typeof NIGHT==='number'?NIGHT:0;LAN.halos.forEach(h=>h.material.opacity=n*.85);
    if(LAN.flag)LAN.flag.rotation.y=Math.sin(t*2.3)*.25;if(LAN.lookFlag)LAN.lookFlag.scale.x=.85+Math.sin(t*6)*.15;
    // people
    LAN.npc.forEach(N=>{
      if(N.kind==='walk'){const W=N.path;if(N.wait>0){N.wait-=dt;setFrame(N.m,0);}else{N.s+=N.dir*N.sp*dt/.2;if(N.s>=W.length-1){N.s=W.length-1;N.dir=-1;N.wait=2+r()*4;}if(N.s<=0){N.s=0;N.dir=1;N.wait=2+r()*4;}
          const i=Math.floor(N.s),f=N.s-i,a=W[i],b=W[Math.min(W.length-1,i+1)];const x=a[0]+(b[0]-a[0])*f,z=a[1]+(b[1]-a[1])*f;N.m.position.set(x,H(x,z),z);setFrame(N.m,1+(Math.floor(t/.18)%2));}}
      else if(N.kind==='idle'){N.m.position.y=(N.y!=null?N.y:H(N.x,N.z))+Math.max(0,Math.sin(t*1.3+N.ph))*.02;}
      else if(N.kind==='kid'){const x=N.x0+Math.sin(t*.7+N.ph)*1.3,z=N.z+Math.sin(t*1.4+N.ph)*.4;N.m.position.set(x,H(x,z)+Math.abs(Math.sin(t*5+N.ph))*.12,z);setFrame(N.m,1+(Math.floor(t/.16)%2));}
      else if(N.kind==='board'){if(N.st==='up'){N.z-=.7*dt;N.m.position.set(N.x,H(N.x,N.z),N.z);setFrame(N.m,1+(Math.floor(t/.2)%2));N.b.position.set(N.x+.1,H(N.x,N.z)+.75,N.z+.2);N.b.rotation.set(1.2,Math.PI/2,0);
          if(N.z<=N.zt){N.st='wait';N.w=1.5+r()*2;}}
        else if(N.st==='wait'){N.w-=dt;setFrame(N.m,0);if(N.w<0){N.st='down';N.v=1;}}
        else{const sl=(H(N.x,N.z)-H(N.x,N.z+.5))/.5;N.v=Math.max(.8,N.v+(9.8*sl*.6-.5-.035*N.v*N.v)*dt);N.z+=N.v*dt;const gy=H(N.x,N.z);orient(N.b,N.x,N.z,-Math.PI/2,1.1);N.b.position.y+=.03;N.m.position.set(N.x,gy+.08,N.z);setFrame(N.m,0);
          if(N.v>2&&r()<.3)puff(N.x,gy+.05,N.z,0,N.v,1);if(N.z>=N.zb){N.st='up';N.w=0;}}}
      else if(N.kind==='quad'){N.s=(N.s+N.sp*dt)%Q2L.L;const [x,z,yw]=atS(Q2PATH,Q2L.c,N.s);orient(N.q,x,z,yw,1.2);N.q.userData.body.position.y=Math.abs(Math.sin(t*11+N.s))*.03;N.rd.position.set(x,N.q.position.y+.62,z);setFrame(N.rd,0);if(r()<.4)puff(x-Math.cos(yw)*.7,N.q.position.y+.1,z+Math.sin(yw)*.7,-Math.cos(yw)*4,Math.sin(yw)*4,1);}});
    {const CP=LAN.camp;if(CP){if(CP.arm){const near=Math.hypot(player.x-910.4,player.z-25)<5;const tg=near?-1.35:-.05;CP.arm.rotation.x+=(tg-CP.arm.rotation.x)*Math.min(1,dt*3);}
      if(CP.cook>0){const was=CP.cook;CP.cook-=dt;const bx=CP.bbq.x,bz=CP.bbq.z-.4,by=H(CP.bbq.x,CP.bbq.z)+.98;CP.smoke.forEach((s,k)=>{const f=((t*.5+k/CP.smoke.length)%1);s.position.set(bx+Math.sin(k*2.1+t)*.4*f+(k%3-1)*.4,by+f*2.2,bz+Math.cos(k*1.7)*.2);s.material.opacity=.7*(1-f)*Math.min(1,CP.cook);s.scale.setScalar(.3+f*.6);});
        if(was>2.5&&CP.cook<=2.5)popText('Sizzle!',{x:bx,y:by+1,z:bz});
        if(CP.cook<=0){CP.smoke.forEach(s=>s.material.opacity=0);S.lanSizzle=(S.lanSizzle||0)+1;save();say(['Kip: Sausage in bread, onions on top, a squeeze of sauce… a real Aussie sausage sizzle!','Dad at the next table: Good on ya, mate! Wipe the hotplate when you are done.']);}}}}
    // spray
    {const S2=LAN.spray;for(let k=0;k<S2.P.length;k++){const p=S2.P[k];if(p.l>0){p.l-=dt;p.vy-=6*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(p.l<=0)p.y=-99;}S2.pos[k*3]=p.x;S2.pos[k*3+1]=p.y;S2.pos[k*3+2]=p.z;}S2.pts.geometry.attributes.position.needsUpdate=true;}};
  // every mesh here keeps its own skin
  G.traverse(o=>{o.__pxSkip=1;});
};
