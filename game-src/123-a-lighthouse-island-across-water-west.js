// --- a lighthouse island across the water, west of Fremantle (seen from the coast) ---
{const ix=-58,iz=300,g=new THREE.Group();g.position.set(ix,0,iz);g.userData.L='mark';scene.add(g);
  const sd=mkc(64,64),sx=sd.getContext('2d');for(let y=0;y<64;y++)for(let X=0;X<64;X++){const n=HSH(X,y);PP(sx,n<.3?'#d8c898':n<.8?'#e8d8aa':'#a8a070',X,y);}const isl=add(g,new THREE.CylinderGeometry(30,36,2,24),new THREE.MeshLambertMaterial({map:TX(sd,true)}),0,-.2,0);isl.scale.z=.45;
  const lc=mkc(16,48),lx=lc.getContext('2d');face(lx,null,0,0,16,48,{base:'#f2eee4',kind:'stone',win:1,rows:3,seed:5,litP:0});add(g,new THREE.CylinderGeometry(.9,1.4,7,10),new THREE.MeshLambertMaterial({map:TX(lc)}),4,4.3,-2);
  add(g,new THREE.CylinderGeometry(1.15,1.15,.3,10),flat('#2a3038'),4,7.9,-2);const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.9,10),new THREE.MeshBasicMaterial({color:0xfff2c0}));lamp.position.set(4,8.5,-2);g.add(lamp);add(g,new THREE.ConeGeometry(.9,.8,10),flat('#c8344a'),4,9.35,-2);
  const bt=mkc(64,8),bx2=bt.getContext('2d'),gr=bx2.createLinearGradient(0,0,64,0);gr.addColorStop(0,'rgba(255,240,190,.75)');gr.addColorStop(1,'rgba(255,240,190,0)');bx2.fillStyle=gr;bx2.fillRect(0,1,64,6);
  const beam=new THREE.Mesh(new THREE.PlaneGeometry(40,2.2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(bt),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:0}));beam.geometry.translate(20,0,0);const bp=new THREE.Group();bp.position.set(4,8.5,-2);bp.add(beam);g.add(bp);O.beam=bp;O.beamM=beam.material;O.lighthouseLamp=lamp;
  const RR=rng(77);for(let k=0;k<160;k++){const a=RR()*6.283,r=Math.sqrt(RR())*26,x=ix+Math.cos(a)*r,z=iz+Math.sin(a)*r*.42;if(Math.hypot(x-ix-4,z-iz+2)<3)continue;PL.push([x,.75,z,RR()<.6?8:RR()<.5?9:4,RR()<.85?1.4:4.5,1]);}
  [[-10,2],[-6,3],[12,1]].forEach(([a,b],i)=>blockB(g,a,b,2.2,1.8,1.2,{base:['#efe3c4','#f2e6c8','#e8d0a0'][i],seed:120+i,gable:.6,tin:1,win:2}));}
const CL_S=(x,z)=>SOUTH&&SOUTH.cls?SOUTH.cls(x,z):0;
// ===== 4b. the south and the south coast: pixel ground, road, towns, plants, the Busselton and Lucky Bay gates =====
if(SOUTH){const S=SOUTH,D=S.data,NC=S.NC,NRW=S.NRW,CE=S.CE,T0=S.T0;
  // ground classes: 0 sea 1 beach 2 heath 3 green paddock 4 dry paddock 5 karri forest 6 red mallee 7 town
  const TWS=S.SD0.towns,reg=s=>s<1560?(s<1000?3:3):s<2330?5:s<2800?3:s<3700?4:2;
  const CL=new Uint8Array(NC*NRW);
  for(let r=0;r<NRW;r++)for(let c=0;c<NC;c++){const i=r*NC+c,s=r*CE,t=T0+c*CE,sd=D.SDs[i];let k=0;
    if(D.LN[i]){const n=fbm(s/60+3,t/60-7);k=reg(s);if(sd<5)k=1;else if(sd<26+n*14&&k!==5)k=2;else if(k===4&&n>.18)k=6;else if(k===3&&n<-.25)k=4;else if(k===5&&n<-.3)k=3;
      if(TWS.some(w=>Math.abs(w[1]-s)<26&&Math.abs(t)<34+n*8))k=7;}
    CL[i]=k;}
  S.cls=(x,z)=>{const[s,t]=S.st(x,z);if(!S.inside(s,t))return 0;return CL[Math.round(s/CE)*NC+Math.round((t-T0)/CE)];};
  const ca=new Uint8Array(NC*NRW*4);for(let i=0;i<NC*NRW;i++){ca[i*4]=CL[i];ca[i*4+1]=Math.max(0,Math.min(255,Math.round(D.SDs[i]*4+128)));ca[i*4+3]=255;}
  const clsT=new THREE.DataTexture(ca,NC,NRW,THREE.RGBAFormat);clsT.magFilter=clsT.minFilter=THREE.NearestFilter;clsT.needsUpdate=true;
  const RMP=[['#e8dcb4','#c8b888','#9ac8b8','#6ab8b0','#4a9a9a','#2a6a78','#1e5462'],['#b8a888','#ccbc98','#dccca8','#e8dab6','#f0e4c4','#f6ecd2','#fcf6e6'],['#3a4632','#4a583e','#5c6a4a','#6e7c58','#828e68','#98a07a','#aeb28e'],
    ['#2f4a24','#3c5e2c','#4a7232','#5a863a','#6e9a44','#86ae52','#a2c068'],['#5e5c32','#76703c','#8c8446','#a29a54','#b8ae66','#cec27c','#dcd294'],['#1e2e1c','#283a24','#34482c','#405636','#4e6640','#5e764a','#708a58'],
    ['#6e3a22','#8a4a2a','#a45e36','#b87444','#c88a58','#d6a070','#e2b88a'],['#6a6862','#82807a','#9a9890','#b0aea4','#c4c2b8','#d6d4ca','#e4e2d8']];
  const rd=new Uint8Array(8*8*4);RMP.forEach((row,j)=>row.forEach((h,k)=>{const n=parseInt(h.slice(1),16);rd.set([(n>>16)&255,(n>>8)&255,n&255,255],(j*8+k)*4);}));const rT=new THREE.DataTexture(rd,8,8,THREE.RGBAFormat);rT.magFilter=rT.minFilter=THREE.NearestFilter;rT.needsUpdate=true;
  const gm=new THREE.MeshLambertMaterial({color:0xffffff});const GU2={sCls:{value:clsT},sRamp:{value:rT},sG:{value:new THREE.Vector4(T0,CE,NC,NRW)},uCamS:{value:new THREE.Vector3()}};O.southU=GU2;
  gm.onBeforeCompile=sh=>{Object.assign(sh.uniforms,GU2);sh.vertexShader='attribute vec2 aST;varying vec2 vST;varying vec2 vWS;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvST=aST;vWS=(modelMatrix*vec4(transformed,1.)).xz;');
    sh.fragmentShader=`uniform sampler2D sCls,sRamp;uniform vec4 sG;uniform vec3 uCamS;varying vec2 vST;varying vec2 vWS;
float qh(vec2 p){p=mod(p,1024.);vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float qn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(qh(i),qh(i+vec2(1.,0.)),f.x),mix(qh(i+vec2(0.,1.)),qh(i+vec2(1.,1.)),f.x),f.y);}
float qb2(vec2 v){return mod(v.x*2.+v.y*3.,4.);}float qb4(vec2 p){return 4.*qb2(mod(p,2.))+qb2(mod(floor(p/2.),2.));}
vec2 suv(vec2 st){return vec2((st.y-sG.x)/sG.y+.5,st.x/sG.y+.5)/sG.zw;}
`+sh.fragmentShader.replace('#include <map_fragment>',`{vec2 pi=floor(vST*3.),pp=(pi+.5)/3.;vec2 wj=pp+(vec2(qn(pp*.3),qn(pp*.3+7.1))-.5)*4.+(vec2(qh(pi),qh(pi+3.3))-.5)*1.2;
 vec4 cs=texture2D(sCls,suv(wj));float c=floor(cs.r*255.+.5);float sd=(texture2D(sCls,suv(pp)).g*255.-128.)/4.;float hh=qh(pi*1.37+.5),bb=(qb4(pi)-7.5)/16.;
 if(sd<3.5&&sd>-1.)c=1.;float lev=.55+(qn(pp*.5)-.5)*.3+(hh-.5)*.07;
 bool strt=false;if(c==7.){vec2 sw=vec2(pp.x+5.*sin(pp.y/37.),pp.y);if(mod(sw.x,11.)<2.||mod(sw.y,9.)<2.)strt=true;}
 float k=clamp(floor(lev*7.+bb*1.2),0.,6.);vec3 col=texture2D(sRamp,vec2((k+.5)/8.,(c+.5)/8.)).rgb;if(c==7.){col=strt?(hh<.5?vec3(.36,.37,.39):vec3(.33,.34,.36)):texture2D(sRamp,vec2((k+.5)/8.,3.5/8.)).rgb;}
 if((c==3.||c==4.||c==2.)&&hh>.993)col=hh>.997?vec3(.95,.82,.3):vec3(.95,.95,.9);
 float cd=length(vWS-uCamS.xz);if(cd<40.){float g=qh(floor(vWS*12.));col*=mix(1.,g<.14?.92:g>.9?1.06:1.,1.-smoothstep(22.,40.,cd));}
 diffuseColor.rgb*=pow(col,vec3(2.2));}`);};
  const CH=96;for(let r0=0;r0<NRW-1;r0+=CH){const r1=Math.min(NRW-1,r0+CH),rows=r1-r0+1,pos=new Float32Array(rows*NC*3),stA=new Float32Array(rows*NC*2),idx=[];
    for(let r=r0;r<=r1;r++)for(let c=0;c<NC;c++){const o=(r-r0)*NC+c,s=r*CE,t=T0+c*CE,[x,z]=S.world(s,t);pos[o*3]=x;pos[o*3+1]=S.H(x,z);pos[o*3+2]=z;stA[o*2]=s;stA[o*2+1]=t;}
    for(let r=0;r<rows-1;r++)for(let c=0;c<NC-1;c++){const a=r*NC+c;idx.push(a,a+NC,a+1,a+1,a+NC,a+NC+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aST',new THREE.BufferAttribute(stA,2));g.setIndex(idx);g.computeVertexNormals();g.computeBoundingSphere();
    const m=new THREE.Mesh(g,gm);m.receiveShadow=true;m.userData.L='ground';scene.add(m);}
  // the inland side fades into the outback (same red desert as the east of the map)
  {const st2=8,c0=Math.round(S.T1),c1=Math.round(S.RR-4),ncol=Math.floor((c1-c0)/st2)+1;for(let r0=0;r0<NRW-1;r0+=CH){const r1=Math.min(NRW-1,r0+CH),rows=r1-r0+1,pos=new Float32Array(rows*ncol*3),ad=new Float32Array(rows*ncol),idx=[];
    for(let r=r0;r<=r1;r++)for(let c=0;c<ncol;c++){const o=(r-r0)*ncol+c,s=r*CE,t=c0+c*st2,[x,z]=S.world(s,t),[ex,ez]=S.world(s,S.T1-.5),d=t-S.T1,eh=Math.max(.5,S.H(ex,ez));pos[o*3]=x;pos[o*3+1]=eh+(dune(x,z)-eh)*ss(0,36,d);pos[o*3+2]=z;ad[o]=d;}
    for(let r=0;r<rows-1;r++)for(let c=0;c<ncol-1;c++){const a=r*ncol+c;idx.push(a,a+ncol,a+1,a+1,a+ncol,a+ncol+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aD',new THREE.BufferAttribute(ad,1));g.setIndex(idx);g.computeVertexNormals();g.computeBoundingSphere();
    const m=new THREE.Mesh(g,obA);m.receiveShadow=true;m.userData.L='ground';scene.add(m);}}
  // the road: Forrest Hwy, Bussell Hwy, South Western Hwy, South Coast Hwy (with guide posts), and a spur to each gate
  const RD=[];for(let s=0;s<=S.SE;s+=6)RD.push(S.world(s,0));S.road=RD;ribbon(RD,4.4,roadM,.18,true);
  {const pg=new THREE.BoxGeometry(.16,.85,.16);pg.translate(0,.42,0);const PO=[];for(let s=40;s<S.SE;s+=7)[-2.9,2.9].forEach(t=>{const[x,z]=S.world(s,t);if(S.land(x,z))PO.push([x,deckH(x,z),z]);});
    const pc=mkc(4,16),px2=pc.getContext('2d');PP(px2,'#f4f2ea',0,0,4,16);PP(px2,'#1c1c1e',0,0,4,3);PP(px2,'#e83a2a',1,1,2,2);const im=new THREE.InstancedMesh(pg,new THREE.MeshLambertMaterial({map:TX(pc)}),PO.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),one=new THREE.Vector3(1,1,1);
    PO.forEach((p,i)=>{m4.compose(v.set(p[0],p[1],p[2]),q,one);im.setMatrixAt(i,m4);});im.frustumCulled=false;im.userData.L='props';scene.add(im);}
  const spur=(s,t)=>{const P=[];const n=Math.max(2,Math.ceil(Math.abs(t)/4));for(let k=0;k<=n;k++)P.push(S.world(s,t*k/n));for(let k=1;k<P.length;k++)S.spurs.push([P[k-1],P[k]]);ribbon(P,3.4,roadM,.18,true);return P[P.length-1];};
  // road signs: town boards and distance boards
  const board=(lines,s,t,bg)=>{const w=Math.max(...lines.map(l=>l.length))*6+12,h=lines.length*11+6,c=mkc(w,h),x=c.getContext('2d');PP(x,bg||'#1f6a44',0,0,w,h);PP(x,'#f4f2ea',1,1,w-2,1);PP(x,'#f4f2ea',1,h-2,w-2,1);x.fillStyle='#f4f2ea';x.font='bold 9px monospace';x.textBaseline='top';lines.forEach((l,i)=>x.fillText(l,6,4+i*11));
    const[px,pz]=S.world(s,t),[ax,az]=S.world(s+2,t),a=Math.atan2(ax-px,az-pz),g=new THREE.Group();g.position.set(px,Math.max(S.H(px,pz),.5),pz);g.rotation.y=a+Math.PI;g.userData.L='props';scene.add(g);
    const fm=new THREE.MeshLambertMaterial({map:TX(c)}),bk=flat('#8a8e94');const b=new THREE.Mesh(new THREE.BoxGeometry(w/16,h/16,.12),[bk,bk,bk,bk,fm,bk]);b.position.y=1.5+h/32;g.add(b);[-1,1].forEach(k=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1.6+h/16,6),flat('#9aa0a6'));p.position.set(k*w/16*.36,(1.6+h/16)/2,-.1);g.add(p);});};
  TWS.forEach(([n,s])=>board([n],s-40,-4.6,'#1d3a6e'));
  for(let s=120;s<S.SE-100;s+=360){const ahead=TWS.filter(w=>w[1]>s+30).slice(0,3);if(ahead.length)board(ahead.map(w=>w[0]+'  '+Math.max(1,w[2]-S.km(s))+' km'),s,-4.6);}
  // towns: houses on little streets either side of the road (pixel facades, tile/tin roofs), street lamps
  {const HO=[];TWS.forEach(([n,s0])=>{for(let s=s0-24;s<=s0+24;s+=3.6)for(const t of[-8,-11.6,8,11.6,-18,-21.6,18,21.6]){const ss2=s+(t>0?1.8:0);const[x,z]=S.world(ss2,t+(HSH(s,t)-.5)*.6);if(!S.land(x,z)||S.sd(x,z)<5||HSH(s*1.3,t)<.18)continue;HO.push([x,z,ss2,t]);}});
    const n=HO.length,cell=new Float32Array(n*2),ar=new Float32Array(n),body=new THREE.InstancedMesh(houseGeo.clone(),houseMat,n),rg=new THREE.ConeGeometry(.7071*1.12,1,4);rg.rotateY(Math.PI/4);rg.translate(0,.5,0);
    const rgeo=rg.clone();const roof=new THREE.InstancedMesh(rgeo,roofMat,n),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sc=new THREE.Vector3(),col=new THREE.Color(),RC=['#b8562e','#a8482a','#c8683e','#5a5e64','#8a8e94','#6a7a6a','#46494e'];
    HO.forEach(([x,z,s,t],i)=>{const[ax,az]=S.world(s+1,t),a=Math.atan2(ax-x,az-z),h=HSH(x,z),w=2.4+h*.5,d=2.1+HSH(h,1)*.4,ht=1.25+HSH(h,3)*.3,y=S.H(x,z);e.set(0,a,0);q.setFromEuler(e);
      m4.compose(v.set(x,y,z),q,sc.set(d,ht,w));body.setMatrixAt(i,m4);const ci=((h*24)|0)%24;cell[i*2]=ci%HCOL;cell[i*2+1]=HROW-1-((ci/HCOL)|0);col.setRGB(1,1,.98);body.setColorAt(i,col);
      m4.compose(v.set(x,y+ht,z),q,sc.set(d*1.05,.7+HSH(h,5)*.4,w*1.05));roof.setMatrixAt(i,m4);const rc=RC[(HSH(h,6)*RC.length)|0];col.set(rc).convertSRGBToLinear();roof.setColorAt(i,col);ar[i]=rc==='#5a5e64'||rc==='#8a8e94'||rc==='#46494e'?1:0;});
    body.geometry.setAttribute('aCell',new THREE.InstancedBufferAttribute(cell,2));roof.geometry.setAttribute('aRoof',new THREE.InstancedBufferAttribute(ar,1));
    [body,roof].forEach(m=>{m.castShadow=m.receiveShadow=true;m.userData.L='build';m.frustumCulled=false;scene.add(m);});O.southHouses=n;
    TWS.forEach(([n,s0])=>{for(let k=0;k<4;k++){const[x,z]=S.world(s0-18+k*12,5.2);if(!S.land(x,z))continue;add(scene,new THREE.CylinderGeometry(.06,.08,2.6,5),flat('#4a4e54'),x,S.H(x,z)+1.3,z).userData.L='props';const l=new THREE.Mesh(new THREE.BoxGeometry(.3,.2,.3),new THREE.MeshBasicMaterial({color:0x3a3a30}));l.position.set(x,S.H(x,z)+2.65,z);scene.add(l);(O.lamps||(O.lamps=[])).push(l);}});}
  // plants by region: tuart and peppermint in the south-west, tall karri and jarrah forest, green farms, wheatbelt mallee, heath and banksia on the coast
  {const RR2=rng(9177);let n=0;for(let k=0;k<90000&&n<22000;k++){const s=RR2()*S.SE,t=T0+RR2()*(S.T1-T0),[x,z]=S.world(s,t);const c=S.cls(x,z),sd=S.sd(x,z);if(sd<2.5||Math.abs(t)<4)continue;
      if(S.spurs.some(p=>segDist(x,z,p[0],p[1])<4))continue;const r=RR2(),y=S.H(x,z)-.06;let kd=-1,h=0;
      if(c===1){if(r<.25){kd=12;h=.9;}}else if(c===2){if(r<.7){kd=r<.3?8:r<.42?10:r<.52?6:r<.6?7:r<.66?9:0;h=[4.4,0,0,0,0,0,3,2.6,1.4,1.2,1.4][kd];}}
      else if(c===3){if(r<.12){kd=r<.05?1:r<.09?0:2;h=kd===1?3.8:4.4;}}else if(c===4){if(r<.08){kd=r<.04?15:0;h=kd===15?2.2:4.2;}}
      else if(c===5){if(r<.9){kd=r<.55?13:r<.75?0:r<.85?1:20;h=kd===13?7+RR2()*3:kd===0?5.5:kd===1?4:1.4;}}else if(c===6){if(r<.35){kd=r<.18?15:r<.28?19:14;h=kd===15?2.4:kd===19?1.2:3.6;}}else if(c===7){if(r<.05){kd=2;h=3.6;}}
      if(kd<0||!h)continue;PL.push([x,y,z,kd,h*(.85+RR2()*.3),.95+RR2()*.1]);n++;}O.southPlants=n;}
  // the gates: Busselton Jetty and Lucky Bay
  const G2=S.SD0.gates;
  {const[s,t]=G2.bus,end=spur(s,t*.85);gate2('bus','Busselton','Park and walk at Busselton Jetty','The long timber jetty over Geographe Bay · walk the town',end[0],end[1],g=>{
      const jt=mkc(16,16),jx=jt.getContext('2d');for(let y=0;y<16;y+=2)PP(jx,y%4?'#a07848':'#b88a58',0,y,16,2);const jm=new THREE.MeshLambertMaterial({map:TX(jt,true)});
      const[ax,az]=S.world(s,t-10),dx=ax-end[0],dz=az-end[1],L=Math.hypot(dx,dz)||1,ang=Math.atan2(dx,dz);const j=new THREE.Group();j.rotation.y=ang;g.add(j);
      add(j,new THREE.BoxGeometry(1.4,.2,40),jm,0,.9,22);for(let k=2;k<42;k+=3)[-.6,.6].forEach(p=>add(j,new THREE.BoxGeometry(.14,1.6,.14),flat('#6a4a2a'),p,.1,k));
      add(j,new THREE.BoxGeometry(2.4,1.6,2),flat('#e8e4d8'),0,1.8,41);add(j,new THREE.ConeGeometry(1.8,.9,4),flat('#c8344a'),0,3,41,Math.PI/4);for(let k=0;k<3;k++)add(j,new THREE.BoxGeometry(.5,.45,.9),flat(k?'#f4f2ec':'#c8344a'),0,1.25,8+k*1.1);});}
  {const[s,t]=G2.esp,end=spur(s,t*.85);gate2('esp','Lucky Bay','Park and walk at Lucky Bay','White sand, turquoise water and kangaroos on the beach · near Esperance',end[0],end[1],g=>{
      add(g,new THREE.BoxGeometry(3,1.8,2.2),flat('#e8dcc4'),-6,.9,-3);add(g,new THREE.ConeGeometry(2.2,1,4),flat('#3a7a9a'),-6,2.3,-3,Math.PI/4);
      for(let k=0;k<3;k++){const kc=new THREE.Sprite(new THREE.SpriteMaterial({map:TX((()=>{const c=mkc(9,12),x=c.getContext('2d');PP(x,'#a08a70',3,2,3,3);PP(x,'#a08a70',2,5,5,6);PP(x,'#a08a70',1,10,2,2);PP(x,'#a08a70',6,10,3,2);PP(x,'#806a54',0,7,3,1);return c;})()),alphaTest:.5}));kc.scale.set(1.2,1.6,1);kc.center.set(.5,0);kc.position.set(3+k*1.6,0,2+(k%2));g.add(kc);}});}
}
function gate2(id,name,act,note,x,z,build){town(id,name,note,x,z,g=>{const a=new THREE.Mesh(new THREE.BoxGeometry(8,.12,5),flat('#6a6c70'));a.position.y=.06;g.add(a);for(let k=-2;k<=2;k++){const l=new THREE.Mesh(new THREE.BoxGeometry(.12,.13,1.6),flat('#e8e4d0'));l.position.set(k*1.8,.07,-1.5);g.add(l);}build(g);});TOWNS[TOWNS.length-1].act=act;}

// fix 2 (Paul, Nov 2026): Busselton like the real bay town, and every park-and-walk gate an obvious landmark
if(SOUTH){const S=SOUTH,BT=TOWNS.find(t=>t.id==='bus'),s0=1500;
  if(BT){// hide the first little jetty; keep the car park
    BT.g.children.forEach(c=>{if(c.isGroup)c.visible=false;});
    const ex=BT.x,ez=BT.z,[sx,sz]=S.world(s0,-200),dl=Math.hypot(sx-ex,sz-ez),ux=(sx-ex)/dl,uz=(sz-ez)/dl,ang=Math.atan2(ux,uz);
    let L0=4;while(L0<60&&S.land(ex+ux*L0,ez+uz*L0))L0+=1;const JL=L0+78;
    const jg=new THREE.Group();jg.position.set(ex,0,ez);jg.rotation.y=ang;jg.userData.L='mark';scene.add(jg);
    const jt=mkc(16,16),jx=jt.getContext('2d');for(let y=0;y<16;y+=2)PP(jx,y%4?'#a07848':'#b88a58',0,y,16,2);PP(jx,'#7a5634',0,0,1,16);PP(jx,'#7a5634',15,0,1,16);const jm=new THREE.MeshLambertMaterial({map:TX(jt,true)});
    const deck=add(jg,new THREE.BoxGeometry(1.6,.2,JL),jm,0,1.15,JL/2+2);deck.material=jm;const dg=deck.geometry.attributes.uv;for(let i=0;i<dg.count;i++)dg.setY(i,dg.getY(i)*JL/2);
    const pile=new THREE.BoxGeometry(.14,2.4,.14);pile.translate(0,0,0);const pm=flat('#5a3e26'),np=Math.floor(JL/2.5)*2,pim=new THREE.InstancedMesh(pile,pm,np),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),one=new THREE.Vector3(1,1,1);
    for(let k=0;k<np;k++){m4.compose(v.set(k%2?.7:-.7,-.1,2+((k>>1)*2.5)),q,one);pim.setMatrixAt(k,m4);}pim.castShadow=true;jg.add(pim);
    const rl=new THREE.BoxGeometry(.06,.06,JL);[-1,1].forEach(sd=>add(jg,rl,flat('#e8e4d8'),sd*.78,1.65,JL/2+2));
    for(let k=6;k<JL;k+=6)[-1,1].forEach(sd=>add(jg,new THREE.BoxGeometry(.06,.5,.06),flat('#e8e4d8'),sd*.78,1.42,k));
    // the underwater observatory at the end: a white drum with a blue cap
    const oc=mkc(32,16),ox=oc.getContext('2d');PP(ox,'#f4f2ec',0,0,32,16);for(let X=2;X<32;X+=6){PP(ox,'#2a2230',X,5,3,4);PP(ox,'#7ab0d0',X+1,6,1,2);}PP(ox,'#3a7a9a',0,0,32,2);
    add(jg,new THREE.CylinderGeometry(1.6,1.6,2,12),new THREE.MeshLambertMaterial({map:TX(oc)}),0,1.4,JL+2.6);add(jg,new THREE.ConeGeometry(1.8,.9,12),flat('#3a7a9a'),0,2.85,JL+2.6);add(jg,new THREE.BoxGeometry(3.4,.2,3.4),jm,0,1.15,JL+2.6);
    // the jetty train: three little carriages that run out and back
    const tr=new THREE.Group();jg.add(tr);for(let k=0;k<3;k++){const c=new THREE.Group();c.position.z=-k*1.1;tr.add(c);add(c,new THREE.BoxGeometry(.9,.5,.95),flat(k?'#f4d04a':'#c8344a'),0,1.55,0);add(c,new THREE.BoxGeometry(.95,.08,1),flat('#f4f2ec'),0,1.95,0);}O.jettyTrain={g:tr,L:JL};
    // entrance arch with the name, right at the car park
    const ac=mkc(80,12),ax=ac.getContext('2d');PP(ax,'#1d3a6e',0,0,80,12);ax.fillStyle='#f4f2ec';ax.font='bold 9px monospace';ax.textAlign='center';ax.fillText('BUSSELTON JETTY',40,9);
    [-1,1].forEach(sd=>add(jg,new THREE.BoxGeometry(.3,3.2,.3),flat('#f4f2ec'),sd*1.1,1.6,1.4));add(jg,new THREE.BoxGeometry(2.6,.18,.3),flat('#f4f2ec'),0,3.2,1.4);
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.42),new THREE.MeshBasicMaterial({map:TX(ac),side:THREE.DoubleSide}));sign.position.set(0,2.85,1.24);sign.rotation.y=Math.PI;jg.add(sign);
    // foreshore: Norfolk pines and peppermints, colourful beach huts, the grassy park; Queen St shops with verandahs; the holiday park
    for(let s=s0-46;s<=s0+46;s+=3.2){for(let tt=-90;tt<-20;tt+=1){const[x,z]=S.world(s,tt);if(!S.land(x,z))continue;const sd=S.sd(x,z);if(sd>4&&sd<7){if(Math.abs(s-s0)>3)PL.push([x,S.H(x,z)-.05,z,HSH(s,tt)<.55?4:1,HSH(s,tt)<.55?6:4,1]);break;}}}
    const HUT=['#e86a1a','#2f6a74','#f4d04a','#c8344a','#3e7d5c','#7ab0d0','#f4f2ec'];let hk=0;
    for(let s=s0-30;s<=s0+30&&hk<12;s+=4.5){if(Math.abs(s-s0)<4)continue;for(let tt=-100;tt<-20;tt+=1){const[x,z]=S.world(s,tt);if(!S.land(x,z))continue;const sd=S.sd(x,z);if(sd>1.2&&sd<3.2){const y=S.H(x,z),c=HUT[hk%HUT.length],hg=new THREE.Group();hg.position.set(x,y,z);hg.rotation.y=ang;hg.userData.L='build';scene.add(hg);
      add(hg,new THREE.BoxGeometry(1,1,.9),flat(c),0,.5,0);add(hg,new THREE.ConeGeometry(.8,.5,4),flat('#f4f2ec'),0,1.25,0,Math.PI/4);add(hg,new THREE.BoxGeometry(.4,.6,.05),flat('#f4f2ec'),0,.32,.47);hk++;break;}}}
    const SHOPS=[['#efe3c4','#c8344a','CAFE'],['#f2e6c8','#2f6a74','SURF'],['#e8d0a0','#3e7d5c','FISH & CHIPS'],['#efe3c4','#1d3a6e','BAKERY'],['#e4d4ac','#e86a1a','GELATO'],['#f2e6c8','#c8344a','BOOKS']];
    const shopAt=[];SHOPS.forEach(([c,awn,nm],i)=>{const s=s0-14+i*5.4,tt=-8.5;const[x,z]=S.world(s,tt),[x2,z2]=S.world(s+1,tt),a=Math.atan2(x2-x,z2-z);if(!S.land(x,z))return;const g=new THREE.Group();g.position.set(x,S.H(x,z),z);g.rotation.y=a+Math.PI/2;g.userData.L='build';scene.add(g);
      blockB(g,0,0,4.4,3,2.2,{base:c,kind:i%2?'brick':'plaster',rows:2,win:3,seed:300+i,awn,parapet:1,frame:'#f4ecd8'});add(g,new THREE.BoxGeometry(4.4,.08,1),flat('#8a8e94'),0,1.15,2);[-1,1].forEach(k=>add(g,new THREE.CylinderGeometry(.04,.04,1.15,4),flat('#e8e4d8'),k*2,.57,2.4));
      const sc=mkc(64,10),sx2=sc.getContext('2d');PP(sx2,awn,0,0,64,10);sx2.fillStyle='#f4f2ec';sx2.font='bold 8px monospace';sx2.textAlign='center';sx2.fillText(nm,32,8);const sm=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.5),new THREE.MeshBasicMaterial({map:TX(sc)}));sm.position.set(0,2.45,1.52);g.add(sm);shopAt.push([x,z]);});
    // holiday park: cabins and caravans in a row by the beach
    for(let k=0;k<8;k++){const s=s0+22+k*2.6,tt=-26;const[x,z]=S.world(s,tt);if(!S.land(x,z))continue;const g=new THREE.Group();g.position.set(x,S.H(x,z),z);g.rotation.y=ang+(k%2?.1:-.1);g.userData.L='build';scene.add(g);
      if(k%2){add(g,new THREE.BoxGeometry(1.1,.75,1.9),flat('#f4f2ec'),0,.5,0);add(g,new THREE.BoxGeometry(1.12,.12,1.92),flat('#7ab0d0'),0,.62,0);}else{add(g,new THREE.BoxGeometry(1.5,1,1.5),flat('#e8dcc4'),0,.5,0);add(g,new THREE.ConeGeometry(1.2,.6,4),flat('#3e7d5c'),0,1.3,0,Math.PI/4);}}
    {const c=mkc(64,12),x=c.getContext('2d');PP(x,'#3e7d5c',0,0,64,12);x.fillStyle='#f4f2ec';x.font='bold 8px monospace';x.textAlign='center';x.fillText('HOLIDAY PARK',32,9);const[px,pz]=S.world(s0+19,-22);const g=new THREE.Group();g.position.set(px,S.H(px,pz),pz);g.rotation.y=ang+Math.PI;scene.add(g);add(g,new THREE.BoxGeometry(.08,1.6,.08),flat('#9aa0a6'),-1,.8,0);add(g,new THREE.BoxGeometry(.08,1.6,.08),flat('#9aa0a6'),1,.8,0);const m=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.42),new THREE.MeshBasicMaterial({map:TX(c),side:THREE.DoubleSide}));m.position.y=1.5;g.add(m);}
    // leafy streets: a street tree in front of every few houses; houses out of the shops' way
    scene.traverse(o=>{if(!o.isInstancedMesh||o.count!==O.southHouses)return;const m=new THREE.Matrix4(),p=new THREE.Vector3(),qq=new THREE.Quaternion(),sc=new THREE.Vector3();
      for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);m.decompose(p,qq,sc);if(Math.hypot(p.x-ex,p.z-ez)>70)continue;if(shopAt.some(a=>Math.hypot(a[0]-p.x,a[1]-p.z)<4.2)||Math.hypot(p.x-ex,p.z-ez)<7){m.compose(p,qq,new THREE.Vector3(1e-4,1e-4,1e-4));o.setMatrixAt(i,m);}
        else if(o.material===houseMat&&HSH(p.x,p.z)<.45)PL.push([p.x+1.6,S.H(p.x+1.6,p.z+1.2)-.05,p.z+1.2,HSH(p.z,p.x)<.5?2:1,3.2,1]);}o.instanceMatrix.needsUpdate=true;});}}
// every park-and-walk gate: a glowing beacon, a floating name label and a pulsing marker so it is easy to find
{O.beacons2=[];TOWNS.filter(t=>t.act).forEach(t=>{const g=t.g;const bm=new THREE.Mesh(new THREE.CylinderGeometry(.55,.9,16,10,1,true),new THREE.MeshBasicMaterial({color:0xffd34d,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));bm.position.y=8;g.add(bm);
  const nm=t.name.toUpperCase(),sub=(t.act||'').replace(/^Park( and walk)? at /,'Park & walk · '),w=Math.max(nm.length*7,sub.length*6)+14,c=mkc(w,28),x=c.getContext('2d');PP(x,'#141a2e',0,0,w,28);PP(x,'#ffd34d',0,0,w,1);PP(x,'#ffd34d',0,27,w,1);PP(x,'#ffd34d',0,0,1,28);PP(x,'#ffd34d',w-1,0,1,28);
  x.fillStyle='#ffd34d';x.font='bold 11px monospace';x.textAlign='center';x.fillText(nm,w/2,12);x.fillStyle='#f4f2ec';x.font='9px monospace';x.fillText(sub,w/2,23);PP(x,'#ffd34d',w/2-3,27,6,1);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:TX(c),depthTest:false,transparent:true}));sp.scale.set(w/26,28/26,1);sp.position.y=5.6;sp.renderOrder=9;g.add(sp);
  const ar=mkc(12,10),ax=ar.getContext('2d');for(let k=0;k<6;k++)PP(ax,'#ffd34d',k,k,12-2*k,1);for(let k=0;k<6;k++)PP(ax,'#f4f2ec',k+1,k+2,Math.max(0,10-2*k-2),1);const arr=new THREE.Sprite(new THREE.SpriteMaterial({map:TX(ar),transparent:true,depthTest:false}));arr.scale.set(1.2,1,1);arr.position.y=4.4;arr.renderOrder=9;g.add(arr);
  O.beacons2.push({bm,arr,sp});});}

// re-chunk the plants added by the landmarks (palms, island heath)
O.chunks.forEach(c=>{c.parent.remove(c);c.geometry.dispose();});O.chunks.length=0;{const k0=PL.length;for(let i=PL.length-1;i>=0;i--){const q=PL[i];if(q[0]<WX-1&&q[2]>(N?N.ZMIN:0)&&clearAt(q[0],q[2],.3))PL.splice(i,1);}O.plantsCleared=k0-PL.length;}plants(PL,'plants',80);O.plants=PL.length;

