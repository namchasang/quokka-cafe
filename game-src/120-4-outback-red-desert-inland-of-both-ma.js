// ===== 4. outback: red desert inland of both maps, fading in from the paddocks =====
const X1=N?N.X1:WX,OBW=440,ZMN=N?N.ZMIN:0;
const isOB=(x,z)=>(SOUTH&&z>WZ)?(()=>{const q=SOUTH.st(x,z);return q[0]>=0&&q[1]>SOUTH.T1-1.6;})():z>=0?x>=WX-.6:(x>=X1-1.6||(!!N&&x>=X1-30&&!N.land(x,z)));
const obD=(x,z)=>{if(z>=0)return Math.max(0,x-WX);const dN=Math.max(0,x-X1),dS=x<WX?-z:Math.hypot(x-WX,-z);return Math.min(dN,dS);};
const obEdge=(x,z)=>{let h;if(z>=0)h=H(WX,Math.min(z,WZ-.01));else{const dN=Math.max(0,x-X1),dS=x<WX?-z:Math.hypot(x-WX,-z);h=dN<=dS?H(X1,z):H(Math.min(x,WX-.01),.01);}return Math.max(.5,h);};
const dune=(x,z)=>1.1+1.3*Math.max(0,fbm(x/80+9,z/80))+.45*fbm(x/22+3,z/22)+.25*Math.max(0,Math.sin(x*.06+z*.025+fbm(x/40,z/40)*3));
const OBH=(x,z)=>{if(z>=0?x<WX:x<X1)return H(x,z)-.06;const d=obD(x,z),e=obEdge(x,z);return e+(dune(x,z)-e)*ss(0,36,d);};
O.isOB=isOB;O.OBH=OBH;
const obRamp=(a)=>a.map(c=>new THREE.Color(c));
const obMat=(start)=>{const m=new THREE.MeshLambertMaterial({color:0xffffff});const U={uA:{value:obRamp(start)},uR:{value:obRamp(['#5e2616','#7e3620','#9c4a2a','#b45e36','#c87444','#d88c5a','#e6a674'])},uM:{value:obRamp(['#6e5e34','#8a7442','#a08852','#b49a60','#c6aa70','#d4ba84','#e2ca98'])},uC:{value:obRamp(['#a88a6e','#bc9e80','#ccb092','#dac0a2','#e6d0b4','#efdcc4','#f6e8d6'])},uCam:{value:new THREE.Vector3()}};m.userData.U=U;
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);sh.vertexShader='attribute float aD;varying float vD;varying vec2 vWP;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvD=aD;vWP=(modelMatrix*vec4(transformed,1.)).xz;');
    sh.fragmentShader=`uniform vec3 uA[7];uniform vec3 uR[7];uniform vec3 uM[7];uniform vec3 uC[7];uniform vec3 uCam;varying float vD;varying vec2 vWP;
float oh(vec2 p){p=mod(p,1024.);vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float on(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(oh(i),oh(i+vec2(1.,0.)),f.x),mix(oh(i+vec2(0.,1.)),oh(i+vec2(1.,1.)),f.x),f.y);}
float ob2(vec2 v){return mod(v.x*2.+v.y*3.,4.);}float ob4(vec2 p){return 4.*ob2(mod(p,2.))+ob2(mod(floor(p/2.),2.));}
vec3 pick(vec3 R[7],float k){int i=int(clamp(k,0.,6.));vec3 c=R[0];for(int j=1;j<7;j++)if(j==i)c=R[j];return c;}
`+sh.fragmentShader.replace('#include <map_fragment>',`{vec2 pi=floor(vWP*3.),pp=(pi+.5)/3.;float hh=oh(pi*1.37+.5),bb=(ob4(pi)-7.5)/16.;
 float m=smoothstep(4.,80.,vD)+(on(pp*.04)-.5)*.55+bb*.22;float lev=.55+(on(pp*.3)-.5)*.32+(hh-.5)*.08;
 float rp=fract((pp.x*.55+pp.y*.22+on(pp*.07)*4.)/2.4);if(rp<.16)lev-=.13;else if(rp<.28)lev+=.05;
 float k=floor(lev*7.+bb*1.2);vec3 col;
 if(m<.32)col=pick(uA,k);else if(m<.5)col=pick(uM,k);else{col=pick(uR,k);if(on(pp*.013+3.1)>.74&&m>.65)col=pick(uC,k);
   if(hh>.985)col=hh>.995?vec3(.48,.54,.3):vec3(.36,.42,.24);if(hh<.012)col=vec3(.29,.14,.09);}
 float cd=length(vWP-uCam.xz);if(cd<40.){float g=oh(floor(vWP*12.));col*=mix(1.,g<.14?.92:g>.9?1.06:1.,1.-smoothstep(22.,40.,cd));}
 diffuseColor.rgb*=pow(col,vec3(2.2));}`);};return m;};
const obGrid=(x0,x1,z0,z1,st,mat)=>{const nx=Math.round((x1-x0)/st)+1,CHR=96;for(let r0=0;r0<Math.round((z1-z0)/st);r0+=CHR){const r1=Math.min(Math.round((z1-z0)/st),r0+CHR),rows=r1-r0+1,pos=new Float32Array(rows*nx*3),ad=new Float32Array(rows*nx),idx=[];
    for(let r=r0;r<=r1;r++)for(let c=0;c<nx;c++){const x=x0+c*st,z=z0+r*st,o=(r-r0)*nx+c;pos[o*3]=x;pos[o*3+1]=OBH(x,z);pos[o*3+2]=z;ad[o]=obD(x,z);}
    for(let r=0;r<rows-1;r++)for(let c=0;c<nx-1;c++){const a=r*nx+c;idx.push(a,a+nx,a+1,a+1,a+nx,a+nx+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aD',new THREE.BufferAttribute(ad,1));g.setIndex(idx);g.computeVertexNormals();g.computeBoundingSphere();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.L='ground';scene.add(m);}};
const obA=obMat(['#2f4a24','#3c5e2c','#4a7232','#5a863a','#6e9a44','#86ae52','#a2c068']),obB=obMat(['#28382a','#324632','#3e5438','#4a6440','#58744a','#6a8456','#7e9666']);O.obMats=[obA,obB];
obGrid(WX-4,WX+OBW,0,WZ+120,4,obA);if(N)obGrid(X1-8,WX+OBW,ZMN,0,8,obB);
// outback plants and termite mounds
{const RR=rng(7331),TM=[];const area=[[WX+2,WX+330,0,WZ+60],[X1+2,WX+330,ZMN,-2]];
  for(let k=0;k<60000&&PL.length<70000;k++){const A=area[RR()<.35?0:1],x=A[0]+RR()*(A[1]-A[0]),z=A[2]+RR()*(A[3]-A[2]);if(!N&&z<0)continue;const d=obD(x,z);if(d<3)continue;
    if(RR()>Math.max(.25,1-d/360))continue;const y=OBH(x,z)-.05,r=RR();
    if(d<45&&r<.35){PL.push([x,y,z,r<.12?0:r<.22?8:r<.3?13:17,r<.12?4.2:r<.22?1.4:r<.3?4.8:.8,.95]);continue;}
    if(r<.42)PL.push([x,y,z,12,.9+RR()*.5,1]);else if(r<.58)PL.push([x,y,z,19,1.1+RR()*.4,1]);else if(r<.7)PL.push([x,y,z,21,.8+RR()*.4,1]);else if(r<.8)PL.push([x,y,z,15,2+RR()*.8,1]);else if(r<.85)PL.push([x,y,z,14,3+RR()*1.4,1]);else if(r<.9)TM.push([x,y,z]);}
  const tc=mkc(16,32),tx=tc.getContext('2d');for(let y=0;y<32;y++)for(let X=0;X<16;X++){const n=HSH(X*2.1,y*.7),v=Math.sin(X*1.3+HSH(X,1)*3)*.5+.5;tx.fillStyle=['#7e3620','#9c4a2a','#b45e36','#c87444','#d88c5a'][Math.min(4,(n*2+v*2.2)|0)];tx.fillRect(X,y,1,1);}
  const tg=new THREE.ConeGeometry(.5,1,6,2);{const p=tg.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y>.4){p.setX(i,p.getX(i)+.12);p.setZ(i,p.getZ(i)+.08);}else if(y>-.1){p.setX(i,p.getX(i)*1.25);p.setZ(i,p.getZ(i)*1.15);}}tg.computeVertexNormals();tg.translate(0,.48,0);}
  const im=new THREE.InstancedMesh(tg,new THREE.MeshLambertMaterial({map:TX(tc)}),TM.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3();
  TM.forEach(([x,y,z],i)=>{const h=HSH(x,z);e.set(0,h*6.28,0);q.setFromEuler(e);s.set(.6+h*.5,.9+h*1.3,.6+h*.5);m4.compose(v.set(x,y,z),q,s);im.setMatrixAt(i,m4);});im.castShadow=true;im.userData.L='props';im.frustumCulled=false;scene.add(im);O.mounds=TM.length;}

