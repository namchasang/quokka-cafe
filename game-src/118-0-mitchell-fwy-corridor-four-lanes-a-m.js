// ===== 0. Mitchell Fwy corridor (four lanes, a median with the northern railway), road and rail corridors kept clear =====
const MP=(()=>{if(!N)return null;const z0=N.ZF?(-N.ZF.ZK+(-750+N.ZF.ZK)*N.ZF.ZF):-750;const P=N.main.p,out=[];for(const q of P){out.push(q);if(q[1]<z0)break;}return out.length>3?out:null;})();
O.MP=MP;
const MB={};if(MP)for(let i=1;i<MP.length;i++){const a=MP[i-1],b=MP[i],k0=Math.floor((Math.min(a[1],b[1])-12)/40),k1=Math.floor((Math.max(a[1],b[1])+12)/40);for(let k=k0;k<=k1;k++)(MB[k]||(MB[k]=[])).push([a,b]);}
const mitchD=(x,z)=>{const L=MB[Math.floor(z/40)];if(!L)return 1e9;let d=1e9;for(const s of L){const e=segDist(x,z,s[0],s[1]);if(e<d)d=e;}return d;};
O.mitchD=mitchD;
if(N&&MP){const orig=N.onRoad.bind(N),origAt=N.roadAt.bind(N);N.onRoad=(x,z,w)=>orig(x,z,w)||mitchD(x,z)<w+3.8;N.roadAt=(x,z,w)=>origAt(x,z,w)||(mitchD(x,z)<w+3.8?N.main:null);}
const railD=(x,z)=>{let d=1e9;for(let i=1;i<RAIL.length;i++){const e=segDist(x,z,RAIL[i-1],RAIL[i]);if(e<d)d=e;}return d;};
// true where nothing may stand: a road (with its verge), the railway, the freeway corridor
const clearAt=(x,z,pad)=>onRoad(x,z,2.4+pad)||(z>-40&&railD(x,z)<1.6+pad)||(MP&&mitchD(x,z)<5.8+pad);
O.clearAt=clearAt;

// ===== 2. houses: one atlas of facades, the old instanced boxes get it (and a baked-light tint) =====
const HW=64,HH=28,HCOL=4,HROW=8;
const hAt=mkc(HW*HCOL,HH*HROW),hGl=mkc(HW*HCOL,HH*HROW),hx=hAt.getContext('2d'),hg=hGl.getContext('2d');PP(hg,'#000',0,0,hGl.width,hGl.height);
const WALLS=[['#efe6d4','plaster'],['#f4f2ec','plaster'],['#b8705a','brick'],['#a8644a','brick'],['#d8c8b0','plaster'],['#e2d2a8','stone'],['#d8e2e6','board'],['#c8d0b0','board'],['#d89a78','plaster'],['#c8c4bc','plaster'],['#c4825e','brick'],['#f2e8d0','board'],['#e8dcc4','plaster'],['#9a5a44','brick'],['#e4d8b8','stone'],['#f0eadc','plaster']];
for(let i=0;i<HCOL*HROW;i++){const cx=(i%HCOL)*HW,cy=((i/HCOL)|0)*HH,two=i>=24,[base,kind]=WALLS[i%WALLS.length],sd=i*31+5;
  const shut=HSH(i,2)<.25?['#3e6a5a','#2f4a6e','#8a3a2a'][i%3]:null,garage=HSH(i,3)<.35&&!two;
  face(hx,hg,cx,cy,38,HH,{base,kind,rows:two?2:1,win:garage?1:2,door:true,doorAt:garage?1:.5,garage,seed:sd,shut,litP:.55});
  face(hx,hg,cx+38,cy,26,HH,{base,kind,rows:two?2:1,win:1,seed:sd+3,shut,litP:.4});}
const hDayT=TX(hAt),hGlT=TX(hGl);
const houseGeo=(()=>{const g=new THREE.BoxGeometry(1,1,1);g.translate(0,.5,0);const uv=g.attributes.uv;const fu=38/64;
  // faces: +x,-x,+y,-y,+z,-z (4 verts each); fronts (z faces) use the 38 px part, ends (x faces) the 26 px part
  for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k,u=uv.getX(i),v=uv.getY(i);let nu;if(f>=4)nu=u*fu;else if(f<2)nu=fu+u*(1-fu);else nu=.99;uv.setXY(i,nu,f===2||f===3?.98:v);}return g;})();
const houseMat=new THREE.MeshLambertMaterial({map:hDayT,emissive:new THREE.Color(0xffffff),emissiveMap:hGlT,emissiveIntensity:0});O.glow.push(houseMat);
houseMat.onBeforeCompile=sh=>{sh.vertexShader='attribute vec2 aCell;\n'+sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvUv=(vUv+aCell)/vec2('+HCOL+'.,'+HROW+'.);');};
const roofT=TX(roofC,true);
const roofMat=new THREE.MeshLambertMaterial({map:roofT});
roofMat.onBeforeCompile=sh=>{sh.vertexShader='attribute float aRoof;varying float vRoof;\n'+sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvRoof=aRoof;');
  sh.fragmentShader='varying float vRoof;\n'+sh.fragmentShader.replace('#include <map_fragment>','{float fu=fract(vUv.x*4.);vec2 ru=vec2(fu*.5+vRoof*.5,fract(vUv.y*3.));vec4 tc=texture2D(map,ru);tc=mapTexelToLinear(tc);if(fu<.035||fu>.965)tc.rgb*=1.25;if(vUv.y<.06)tc.rgb*=.7;diffuseColor*=tc;}');};
{const ims=[];scene.traverse(o=>{if(o.isInstancedMesh&&o.userData.L==='build')ims.push(o);});
  // body and roof meshes come in pairs (same count): box geometry first, cone second
  const bodies=ims.filter(m=>m.geometry.type==='BoxGeometry'),roofs=ims.filter(m=>m.geometry.type==='ConeGeometry');
  const m4=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3(),col=new THREE.Color();const CH=[];
  const HID=new Set(),ZERO=new THREE.Vector3(1e-4,1e-4,1e-4);bodies.forEach((b,bi)=>{const n=b.count,cell=new Float32Array(n*2);for(let i=0;i<n;i++){b.getMatrixAt(i,m4);m4.decompose(p,q,s);if(clearAt(p.x,p.z,1.3)){HID.add(bi+':'+i);m4.compose(p,q,ZERO);b.setMatrixAt(i,m4);continue;}const two=s.y>2,h=HSH(p.x,p.z);const ci=two?24+((h*8)|0)%8:((h*24)|0)%24;cell[i*2]=ci%HCOL;cell[i*2+1]=HROW-1-((ci/HCOL)|0);
      const k=Math.max(.72,Math.min(1.08,bakeAt(p.x,p.z)));col.setRGB(k,k,k*.98);b.setColorAt(i,col);if(h<.33)CH.push([p.x,p.y+s.y,p.z,q.clone(),s.x,s.z,h]);}
    b.geometry=houseGeo.clone();b.geometry.setAttribute('aCell',new THREE.InstancedBufferAttribute(cell,2));b.material=houseMat;b.instanceColor.needsUpdate=true;b.instanceMatrix.needsUpdate=true;});O.housesCleared=HID.size;
  roofs.forEach((rm,ri)=>{const n=rm.count,ar=new Float32Array(n);for(let i=0;i<n;i++){if(HID.has(ri+':'+i)){rm.getMatrixAt(i,m4);m4.decompose(p,q,s);m4.compose(p,q,ZERO);rm.setMatrixAt(i,m4);}rm.getColorAt(i,col);const sat=Math.max(col.r,col.g,col.b)-Math.min(col.r,col.g,col.b);ar[i]=sat<.08?1:0;rm.getMatrixAt(i,m4);m4.decompose(p,q,s);const k=Math.max(.75,Math.min(1.1,bakeAt(p.x,p.z)));col.multiplyScalar(k);rm.setColorAt(i,col);}
    const g=rm.geometry.clone();g.setAttribute('aRoof',new THREE.InstancedBufferAttribute(ar,1));rm.geometry=g;rm.material=roofMat;rm.instanceColor.needsUpdate=true;rm.instanceMatrix.needsUpdate=true;});
  // brick chimneys on a third of the houses
  if(CH.length){const cg=new THREE.BoxGeometry(.32,.7,.32);cg.translate(0,.35,0);const cc=mkc(8,16),cx=cc.getContext('2d');PP(cx,'#9a5a44',0,0,8,16);for(let y=0;y<16;y+=2)for(let X=(y/2)%2;X<8;X+=3)PP(cx,'#b8705a',X,y,2,1);PP(cx,'#5a3a30',0,0,8,2);
    const im=new THREE.InstancedMesh(cg,new THREE.MeshLambertMaterial({map:TX(cc)}),CH.length),v=new THREE.Vector3(),one=new THREE.Vector3(1,1,1);
    CH.forEach(([x,y,z,qq,w,d,h],i)=>{const off=new THREE.Vector3(w*.22*(h<.16?1:-1),0,d*.12).applyQuaternion(qq);m4.compose(v.set(x+off.x,y-.05,z+off.z),qq,one);im.setMatrixAt(i,m4);});im.castShadow=true;im.userData.L='build';im.frustumCulled=false;scene.add(im);}
  O.houses=bodies.reduce((a,b)=>a+b.count,0);}

