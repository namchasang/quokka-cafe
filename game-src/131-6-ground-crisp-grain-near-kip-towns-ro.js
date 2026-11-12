// ===== 6. ground: crisp grain near Kip, the towns' road texture, grass tufts =====
const grainVS=s=>s.replace('#include <begin_vertex>','#include <begin_vertex>\nvGW=(modelMatrix*vec4(transformed,1.)).xz;');
const GU={uCam:{value:new THREE.Vector3()}};O.GU=GU;
const grainFS=`{vec2 gq=floor(vGW*12.);vec3 gq3=fract(vec3(gq.xyx)*.1031);gq3+=dot(gq3,gq3.yzx+33.33);float gh=fract((gq3.x+gq3.y)*gq3.z);float cdd=length(vGW-uCamG.xz);diffuseColor.rgb*=mix(1.,gh<.13?.9:gh>.91?1.07:1.,1.-smoothstep(20.,42.,cdd));}`;
const addGrain=(mat,after)=>{const prev=mat.onBeforeCompile;mat.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);sh.uniforms.uCamG=GU.uCam;sh.vertexShader='varying vec2 vGW;\n'+grainVS(sh.vertexShader);
  sh.fragmentShader='uniform vec3 uCamG;varying vec2 vGW;\n'+sh.fragmentShader.replace(after,after+'\n'+grainFS);};mat.customProgramCacheKey=()=>'owgrain'+mat.id;mat.needsUpdate=true;};
scene.traverse(o=>{if(o.isMesh&&o.userData.L==='ground'&&o.material&&o.material.map&&L2&&o.material.map===L2.tex)addGrain(o.material,'#include <map_fragment>');});
if(N&&N.groundMat)addGrain(N.groundMat,'diffuseColor.rgb*=pow(col,vec3(2.2));}');
{const c=mkc(32,32),x=c.getContext('2d');PP(x,'#56585d',0,0,32,32);for(let k=0;k<120;k++)PP(x,['#4a4c50','#606268','#6a6c70','#505256'][k%4],HSH(k,3)*32,HSH(k,4)*32);
  PP(x,'#4c4e52',6,0,3,32);PP(x,'#4c4e52',23,0,3,32);PP(x,'#e8e4d0',1,0,1,32);PP(x,'#e8e4d0',30,0,1,32);PP(x,'#c8c4b8',0,0,1,32);PP(x,'#c8c4b8',31,0,1,32);PP(x,'#f4f2e8',15,4,2,12);PP(x,'#d8d6cc',15,15,2,1);
  roadT.image=c;roadT.minFilter=THREE.NearestFilter;roadT.generateMipmaps=false;roadT.needsUpdate=true;}
// tufts and flowers that follow Kip (full detail only near the camera)
{const CAP=1600,P3=new Float32Array(CAP*12),C2=new Float32Array(CAP*8),U2=new Float32Array(CAP*8),N3=new Float32Array(CAP*12),K3=new Float32Array(CAP*12),I=new Uint32Array(CAP*6);for(let i=0;i<CAP;i++){I.set([i*4,i*4+1,i*4+2,i*4+1,i*4+3,i*4+2],i*6);for(let j=0;j<4;j++)N3[(i*4+j)*3+1]=1;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P3,3));g.setAttribute('corner',new THREE.BufferAttribute(C2,2));g.setAttribute('uv',new THREE.BufferAttribute(U2,2));g.setAttribute('normal',new THREE.BufferAttribute(N3,3));g.setAttribute('color',new THREE.BufferAttribute(K3,3));g.setIndex(new THREE.BufferAttribute(I,1));g.setDrawRange(0,0);
  const m=new THREE.Mesh(g,plantMat);m.frustumCulled=false;m.userData.L='plants';scene.add(m);
  const kindAt=(x,z)=>{if(O.subOcc&&O.subOcc(x,z))return -1;if(TOWNS.some(t=>Math.abs(t.x-x)<15&&Math.abs(t.z-z)<15))return -1;if(isOB(x,z))return obD(x,z)>20?21:17;if(onRoad(x,z,2.8))return -1;
    if(z>=0){const i=(z|0)*WX+(x|0);if(!LAND[i]||(BLOCK&&BLOCK[i]))return -1;const k=L2?L2.KK[i]:5;if(L2&&L2.SUB[i])return -1;return k===5?(HSH(x*.3,z*.3)<.12?18:16):k===4?17:k===3&&DL[i]>3?17:-1;}
    if(!N.land(x,z))return -1;const c=N.cls(x,z);return c===4||c===5?17:c===6?17:c===8?16:c===1&&N.sd(x,z)>4?12:-1;};
  O.tuft=(px,pz)=>{let n=0;const R2=20,st=.9;for(let gz=Math.floor((pz-R2)/st);gz<=(pz+R2)/st;gz++)for(let gx=Math.floor((px-R2)/st);gx<=(px+R2)/st;gx++){if(n>=CAP)break;const h=HSH(gx*.71,gz*1.13);if(h>.15)continue;// Paul (Nov 2026): half the grass tufts
      const x=gx*st+HSH(gz,gx)*st,z=gz*st+HSH(gx+.5,gz)*st,dd=Math.hypot(x-px,z-pz);if(dd>R2)continue;const kd=kindAt(x,z);if(kd<0)continue;
      const B=BOX[kd],hh=(kd===12?.7:.55)*(.8+h*1.2),hw=hh*B.asp/2,y=(isOB(x,z)?OBH(x,z):groundAt(x,z))-.03,t=Math.max(.74,Math.min(1.08,isOB(x,z)?1:bakeAt(x,z)));
      [[-hw,0,B.u0,B.v0],[hw,0,B.u1,B.v0],[-hw,hh,B.u0,B.v1],[hw,hh,B.u1,B.v1]].forEach(([a,b,u,v],j)=>{const o=n*4+j;P3[o*3]=x;P3[o*3+1]=y;P3[o*3+2]=z;C2[o*2]=a;C2[o*2+1]=b;U2[o*2]=u;U2[o*2+1]=v;K3[o*3]=t;K3[o*3+1]=t;K3[o*3+2]=t*.97;});n++;}
    g.setDrawRange(0,n*6);['position','corner','uv','color'].forEach(k=>g.attributes[k].needsUpdate=true);O.tufts=n;};O.tuftAt=[1e9,1e9];}

// ===== 7. the sea: turquoise shallows, a foam line on the beaches, deep blue further out (sea2 colours, pixel steps) =====
{const sd=new Uint8Array(WX*WZ*4);for(let i=0;i<WX*WZ;i++){sd[i*4]=LAND[i]?0:Math.min(255,Math.round(DW[i]*8));sd[i*4+3]=255;}
  const sT=new THREE.DataTexture(sd,WX,WZ,THREE.RGBAFormat);sT.magFilter=sT.minFilter=THREE.LinearFilter;sT.needsUpdate=true;
  let nT=sT,NG=new THREE.Vector4(0,1,1,1);if(N){const D=N.data,n=N.NC*N.NRW,nd=new Uint8Array(n*4);for(let i=0;i<n;i++){nd[i*4]=D.SD[i]>=0?0:Math.min(255,Math.round(-D.SD[i]*8));nd[i*4+3]=255;}nT=new THREE.DataTexture(nd,N.NC,N.NRW,THREE.RGBAFormat);nT.magFilter=nT.minFilter=THREE.LinearFilter;nT.needsUpdate=true;NG.set(N.X0,N.CE,N.NC,N.NRW);}
  let soT=sT,SG=new THREE.Vector4(0,1,1,1),SG2=new THREE.Vector4(0,0,0,0);if(SOUTH){const S=SOUTH,n=S.NC*S.NRW,sd2=new Uint8Array(n*4);for(let i=0;i<n;i++){const v=S.data.SDs[i];sd2[i*4]=v>=0?0:Math.min(255,Math.round(-v*8));sd2[i*4+3]=255;}soT=new THREE.DataTexture(sd2,S.NC,S.NRW,THREE.RGBAFormat);soT.magFilter=soT.minFilter=THREE.LinearFilter;soT.needsUpdate=true;SG.set(S.T0,S.CE,S.NC,S.NRW);SG2.set(S.LA,S.RR,S.PX,S.PZ);}
  const WU={uToon:{value:OWTOON?1:0},uS:{value:sT},uN:{value:nT},uNG:{value:NG},uT:{value:0},uX1:{value:X1},uSo:{value:soT},uSG:{value:SG},uSG2:{value:SG2}};O.WU=WU;
  const wm=new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,depthWrite:false});
  wm.onBeforeCompile=sh=>{Object.assign(sh.uniforms,WU);sh.vertexShader='varying vec2 vWW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWW=(modelMatrix*vec4(transformed,1.)).xz;');
    sh.fragmentShader=`uniform float uToon;uniform sampler2D uS,uN,uSo;uniform vec4 uNG,uSG,uSG2;uniform float uT,uX1;varying vec2 vWW;
float wh(vec2 p){p=mod(p,1024.);vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float wn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(wh(i),wh(i+vec2(1.,0.)),f.x),mix(wh(i+vec2(0.,1.)),wh(i+vec2(1.,1.)),f.x),f.y);}
float sdep(vec2 w){if(uSG2.y<1.)return 40.;float LA=uSG2.x,R=uSG2.y,PX=uSG2.z,PZ=uSG2.w,CX=PX+R,CZ=PZ+LA;vec2 st;
 if(w.y<CZ)st=vec2(w.y-PZ,w.x-PX);else if(w.x<CX){vec2 v=w-vec2(CX,CZ);float th=clamp(atan(v.y,-v.x),0.,1.5708);st=vec2(LA+R*th,R-length(v));}else st=vec2(LA+R*1.5708+(w.x-CX),(CZ+R)-w.y);
 float T1=uSG.x+uSG.y*(uSG.z-1.);if(st.x<0.||st.y<uSG.x||st.y>T1)return 40.;vec2 u=vec2((st.y-uSG.x)/uSG.y+.5,st.x/uSG.y+.5)/uSG.zw;return texture2D(uSo,u).r*31.875;}
float wdep(vec2 w){if(w.y>=${WZ}.&&uSG2.y>0.)return sdep(w);if(uToon>.5&&w.x<0.&&w.y>=0.&&w.y<${WZ}.)return texture2D(uS,vec2(.5/${WX}.,w.y/${WZ}.)).r*31.875-w.x*.6;/* past the west edge: keep deepening smoothly */if(w.y>=0.&&w.x>=0.&&w.x<${WX}.&&w.y<${WZ}.)return texture2D(uS,w/vec2(${WX}.,${WZ}.)).r*31.875;
 if(w.y<0.&&w.x>uNG.x&&w.x<uNG.x+uNG.y*(uNG.z-1.)){vec2 u=vec2((w.x-uNG.x)/uNG.y+.5,(-w.y)/uNG.y+.5)/uNG.zw;return texture2D(uN,u).r*31.875;}return 40.;}
`+sh.fragmentShader.replace('#include <map_fragment>',`if(uToon>.5){vec2 wp=vWW;float d=wdep(wp)+(wn(wp*.35+uT*.05)-.5)*.5;bool sea=wp.x<37.5||wp.y<0.||wp.y>=float(${WZ});float dd=max(d,0.);
 float n1=wn(wp*.35),n2=wn(wp*1.3+7.);vec3 bed=mix(vec3(.88,.86,.78),vec3(.78,.86,.80),smoothstep(.5,6.,dd));float gr=smoothstep(.6,.66,n1*.7+n2*.3)*smoothstep(4.,7.,dd);bed=mix(bed,vec3(.012,.05,.13),gr*.85);
 float ca=abs(sin((wp.x+wn(wp*1.7+uT*.25)*2.)*3.1)*sin((wp.y+wn(wp*1.9-uT*.2)*2.)*2.7));bed+=vec3(.12)*pow(1.-ca,7.)*(1.-smoothstep(2.,9.,dd))*(1.-gr);
 float wd=clamp(.34+dd*.08,0.,.94);vec3 c=mix(bed*.92,vec3(.03,.52,.56)*mix(1.,.6,gr),wd*(1.-gr*.5));c=mix(c,vec3(.02,.38,.59),smoothstep(7.,13.,dd));c=mix(c,vec3(.01,.09,.30),smoothstep(12.,30.,min(dd,30.)));
 if(!sea)c=mix(vec3(.02,.10,.11),vec3(.006,.04,.08),smoothstep(.3,4.,dd))*(1.+(wn(wp*.7+uT*.2)-.5)*.08);// the river: a calm dark blue-green, no sandy shallows
 float lace=smoothstep(.35,.65,wn(wp*5.+vec2(uT*.3,0.)))*.6+.4,ph=fract(uT*.08+wn(wp*.12)*.5);float f=exp(-pow((d-.12)/.07,2.))*lace+exp(-pow((d-(.3+ph*.9))/.06,2.))*(1.-ph)*.8*lace;if(!sea)f*=.25;
 c=mix(c,vec3(.97),clamp(f,0.,1.)*.9);diffuseColor=vec4(c,d<.05?0.:d<2.?.97:1.);}else{vec2 pi=floor(vWW*3.),pp=(pi+.5)/3.;float d=wdep(pp)+(wn(pp*.35+uT*.05)-.5)*.6;bool sea=pp.x<37.5||pp.y<0.||pp.y>=float(${WZ});
 float bb=(mod(pi.x*2.+pi.y*3.,4.)-1.5)*.18;float k=d<.9?0.:d<2.2?1.:d<4.?2.:d<7.?3.:d<11.?4.:d<17.?5.:6.;if(!sea)k=d<.7?0.:d<1.6?1.:d<3.?2.:d<5.?3.:d<8.?4.:5.;
 k=clamp(floor(k+bb),0.,6.);vec3 S0=vec3(.56,.88,.82),S1=vec3(.36,.8,.78),S2=vec3(.23,.69,.75),S3=vec3(.16,.56,.69),S4=vec3(.13,.43,.63),S5=vec3(.09,.33,.54),S6=vec3(.07,.24,.44);
 vec3 c=k<.5?S0:k<1.5?S1:k<2.5?S2:k<3.5?S3:k<4.5?S4:k<5.5?S5:S6;if(!sea)c=mix(c,vec3(.25,.48,.5),.35);
 float rip=wn(vec2(pp.x*.5+uT*.35,pp.y*2.2));if(rip>.74)c=mix(c,vec3(.75,.93,.92),.35);
 float a=d<1.4?.78:.94;
 if(d<.55){c=wh(pi+floor(uT*2.))<.55?vec3(.95,.98,.96):vec3(.82,.94,.92);a=.95;}
 else if(sea&&d<4.5&&fract(d*.62-uT*.16)<.075&&wh(pi)>.3){c=vec3(.86,.96,.94);}
 if(wh(pi+floor(uT*3.)*7.)>.9965)c=vec3(1.);
 diffuseColor=vec4(pow(c,vec3(2.2))*1.12,a);}`);};
  scene.traverse(o=>{if(o.isMesh&&o.material===water.material)o.material=wm;});
  if(SOUTH){const sp=new THREE.Mesh(new THREE.PlaneGeometry(3900,2400),wm);sp.rotation.x=-Math.PI/2;sp.position.set(1500,0,WZ+1150);sp.userData.L='water';scene.add(sp);const fl=new THREE.Mesh(new THREE.PlaneGeometry(3900,2400),new THREE.MeshBasicMaterial({color:lin('#1e5462')}));fl.rotation.x=-Math.PI/2;fl.position.set(1500,-2.6,WZ+1150);fl.userData.L='water';scene.add(fl);}}

