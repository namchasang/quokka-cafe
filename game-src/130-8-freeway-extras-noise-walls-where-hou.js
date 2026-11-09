// ---------- 8. freeway extras (noise walls where houses back onto it, ramps where an arterial meets it) — added after the freeway is built ----------
const RAMPS=[];ART.forEach(a=>{[a.P[0],a.P[a.P.length-1]].forEach((p,e)=>{if(!MP||p[1]>0||p[1]<-235||RAMPS.some(r=>Math.hypot(r.p[0]-p[0],r.p[1]-p[1])<20))return;const d=fwD(p[0],p[1]);if(d>12)return;const q=e?a.P[a.P.length-2]:a.P[1];RAMPS.push({p,dir:[p[0]-q[0],p[1]-q[1]]});});});
O.subLate=()=>{(O.signals||(O.signals=[])).push(...SIGO);if(!MP){buildMeshes();return;}try{const st=(O.stations||[]).map(s=>[s[1],s[2]]);
  // noise walls: both sides of the freeway, 6.6 units out, where suburb lots are close and no ramp/station/arterial is near
  const off=(P,o)=>P.map((p,i)=>{const q=P[Math.min(P.length-1,i+1)],r=P[Math.max(0,i-1)];let dx=q[0]-r[0],dz=q[1]-r[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;return[p[0]+dz*o,p[1]-dx*o];});
  const MPd=[];for(let i=1;i<MP.length;i++){const a=MP[i-1],b=MP[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/1.5));for(let j=0;j<n;j++)MPd.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}
  let nW=0;[-6.7,6.7].forEach(o=>{const Q=off(MPd,o);let run=[];const flush=()=>{if(run.length>4){for(let i=1;i<run.length;i++){const a=run[i-1],b=run[i],g=B(a[0],a[1]),ya=gy(a[0],a[1])-.1,yb=gy(b[0],b[1])-.1,u=UV.nwall,kk=bake(a[0],a[1]);
        g.poly([[a[0],ya,a[1]],[b[0],yb,b[1]],[b[0],yb+1.1,b[1]],[a[0],ya+1.1,a[1]]],rq(u),kk);g.poly([[b[0],yb,b[1]],[a[0],ya,a[1]],[a[0],ya+1.1,a[1]],[b[0],yb+1.1,b[1]]],rq(u),kk*.85);nW++;}}run=[];};
    Q.forEach(p=>{const[x,z]=p;
      const out=[x,z];let hasLots=false;for(let r=1;r<=5&&!hasLots;r+=2)for(let a=0;a<6;a++){const X=x+Math.cos(a)*r,Z=z+Math.sin(a)*r;if(occ(X,Z)===1&&fwD(X,Z)>6.5){hasLots=true;break;}}
      const bad=!landAt(x,z)||z>-2||st.some(s=>Math.hypot(s[0]-x,s[1]-z)<9)||RAMPS.some(r=>Math.hypot(r.p[0]-x,r.p[1]-z)<16)||rdD(x,z,0)<4;
      if(hasLots&&!bad)run.push(out);else flush();});flush();});
  // ramps: from the arterial end, one lane each way joining the freeway shoulder
  RAMPS.forEach(r=>{const[x,z]=r.p;let b=null,bd=1e9,bi=0;MPd.forEach((q,i)=>{const d=Math.hypot(q[0]-x,q[1]-z);if(d<bd){bd=d;b=q;bi=i;}});if(!b)return;
    const q0=MPd[Math.max(0,bi-1)],q1=MPd[Math.min(MPd.length-1,bi+1)];let tx=q1[0]-q0[0],tz=q1[1]-q0[1];const tl=Math.hypot(tx,tz)||1;tx/=tl;tz/=tl;const side=Math.sign((x-b[0])*tz-(z-b[1])*tx)||1,nx=tz*side,nz=-tx*side;
    [-1,1].forEach(dir=>{const P=[];for(let i=0;i<=10;i++){const t=i/10,along=dir*(2+t*12),out=5.4+(bd-5.4)*(1-t)*(1-t)+0;const px=b[0]+tx*along+nx*(out+ (1-t)*0),pz=b[1]+tz*along+nz*out;P.push(i===0?[x-nx*0,z]:[px,pz]);}
      strip(null,P,1.5,UV.ramp,.09,1);});});
  O.subWalls=nW;O.subRamps=RAMPS.length;}catch(e){console.error('owsub late',e);}buildMeshes();};

// ---------- 9. meshes, LOD and night lights ----------
const tD=TX(atD),tG=TX(atG);
const MAT=new THREE.MeshLambertMaterial({map:tD,emissive:new THREE.Color(0xffffff),emissiveMap:tG,emissiveIntensity:0,vertexColors:true,side:THREE.DoubleSide});O.glow.push(MAT);
const mk=(gb,L)=>{if(!gb.I.length)return null;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(gb.P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(gb.N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(gb.U,2));g.setAttribute('color',new THREE.Float32BufferAttribute(gb.C,3));
  g.setIndex(gb.P.length/3>65535?new THREE.Uint32BufferAttribute(gb.I,1):new THREE.Uint16BufferAttribute(gb.I,1));g.computeBoundingSphere();const me=new THREE.Mesh(g,MAT);me.castShadow=me.receiveShadow=true;me.userData.L=L;me.matrixAutoUpdate=false;me.updateMatrix();scene.add(me);return me;};
let built=false;function buildMeshes(){if(built)return;built=true;let nv=0;try{rbuild();}catch(e){console.error('owroads build',e);}CH.forEach(c=>{if(c.mesh){scene.remove(c.mesh);c.mesh.geometry.dispose();}c.mesh=mk(c.base,'build');if(c.mesh)nv+=c.base.P.length/3;c.base=null;});O.subVerts=nv;}
// detail meshes are built on demand near the camera, one chunk per frame, and dropped again when far
const buildDet=c=>{const g=new GB();c.det.forEach(d=>{try{if(d.park)parkDetail(g,d.park);else if(d.cen)centreDetail(g,d.cen);else lotDetail(g,d);}catch(e){console.error('owsub det',e);}});c.dm=mk(g,'props');c.dv=g.P.length/3;};
CEN.forEach(C=>{if(C.det)chunk(...C.det.P(m+9,m+6)).det.push({cen:C});});
// bulbs: one instanced mesh for the signal lights, one for the street lamps
const bG=new THREE.BoxGeometry(.14,.14,.05);const bM=new THREE.MeshBasicMaterial({color:0xffffff});const nB=BULB.length*3;const BI=nB?new THREE.InstancedMesh(bG,bM,nB):null;
if(BI){const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),col=new THREE.Color(0x222222);BULB.forEach((b,i)=>{const a=Math.atan2(b.face[0],b.face[1]);q.setFromAxisAngle(new THREE.Vector3(0,1,0),a);for(let j=0;j<3;j++){m4.compose(new THREE.Vector3(b.x+b.face[0]*.12,b.y+.62-j*.24,b.z+b.face[1]*.12),q,new THREE.Vector3(1,1,1));BI.setMatrixAt(i*3+j,m4);BI.setColorAt(i*3+j,col);}});BI.frustumCulled=false;BI.userData.L='lights';scene.add(BI);}
const LM=new THREE.MeshBasicMaterial({color:0x3a3a30});const lamps=LAMPS.filter(([x,z])=>landAt(x,z));const LI=lamps.length?new THREE.InstancedMesh(new THREE.BoxGeometry(.32,.12,.32),LM,lamps.length):null;
if(LI){const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),one=new THREE.Vector3(1,1,1);lamps.forEach(([x,z,a],i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),a);const off=new THREE.Vector3(0,0,.85).applyQuaternion(q);m4.compose(new THREE.Vector3(x+off.x,gy(x,z)+2.46,z+off.z),q,one);LI.setMatrixAt(i,m4);});LI.frustumCulled=false;LI.userData.L='lights';scene.add(LI);(O.lamps||(O.lamps=[])).push({material:LM});}
let tick=0,sigT=0;const R2=s=>s*s;
O.subTick=(dt,px,pz)=>{tick+=dt;sigT+=dt;
  if(BI&&sigT>.15){sigT=0;const cR=new THREE.Color(0xff3a2a),cA=new THREE.Color(0xffb020),cG=new THREE.Color(0x3aff6a),cO=new THREE.Color(0x26201c);BULB.forEach((b,i)=>{const[ax,st]=O.signalPhase(b.s,O.t);const on=b.axis===ax?st:'r';BI.setColorAt(i*3,on==='r'?cR:cO);BI.setColorAt(i*3+1,on==='a'?cA:cO);BI.setColorAt(i*3+2,on==='g'?cG:cO);});BI.instanceColor.needsUpdate=true;}
  if(tick<.25)return;tick=0;const cx=cam.position.x,cz=cam.position.z,tx=px,tz=pz;let built1=false;
  CH.forEach(c=>{const d2=R2(c.cx-cx)+R2(c.cz-cz);if(c.mesh)c.mesh.visible=d2<R2(300);const dd=R2(c.cx-tx)+R2(c.cz-tz);
    if(dd<R2(78)){if(!c.dm&&!built1&&c.det.length){buildDet(c);built1=true;}if(c.dm)c.dm.visible=true;}
    else if(c.dm&&dd>R2(110)){scene.remove(c.dm);c.dm.geometry.dispose();c.dm=null;}});};
// tufts and plants: keep them off the new streets, houses and centres
{let w=0;for(let i=0;i<PL.length;i++){const q=PL[i];if(i<PL0&&occ(q[0],q[2])>=1)continue;PL[w++]=q;}O.subPlantsCleared=PL.length-w;PL.length=w;}
O.subRoutes=ART.map(a=>a.P);O.subArt=ART;
O.subOcc=(x,z)=>occ(x,z)>=1;
O.subDump=()=>{const M=[];for(let z=-300;z<200;z+=2){let r='';for(let x=-20;x<300;x+=2)r+=subA(x,z)?(free(x,z,0)?'1':'2'):(landAt(x,z)?'0':'.');M.push(r);}return{M,lots:LOTS.map(l=>[+l.x.toFixed(1),+l.z.toFixed(1),+l.th.toFixed(2),l.fw,l.dp,l.style[0]]),st:STREETS.filter(s=>s.P[0][1]<200).map(s=>[s.kind,s.P.map(p=>[+p[0].toFixed(1),+p[1].toFixed(1)])]),cen:CEN.filter(c=>!c.coast).map(c=>[c.v.x,c.v.z,c.sa,c.sb]),parks:PARKS.map(p=>[p.kind,p.x,p.z])};};
const bySt={};LOTS.forEach(L=>{bySt[L.style]=(bySt[L.style]||0)+(L.n||1);});O.subStats={bySt,cells:CELLS.size,houses:nH,lots:LOTS.length,centres:CEN.filter(c=>!c.coast).length,coastTowns:CEN.filter(c=>c.coast).length,art:ART.length,signals:SIGS.length,lamps:lamps.length,parks:PARKS.length,atlasRows:ay,atlasOver:aOver,ms:0};
O.subCells=[...CELLS.values()].map(c=>[c.i,c.j,c.style,+c.cov.toFixed(2),c.cen?c.cen.name:'']);O.subCen=CEN.map(c=>c.coast?[c.name,'coast']:[c.name,c.v.x,c.v.z,c.sa,c.sb]);
O.subStats.ms=Math.round(performance.now()-TS0);console.log('OWSUB',JSON.stringify(O.subStats));}
try{OWSUB();}catch(e){console.error('owsub',e);}
// re-chunk the plants added by the landmarks (palms, island heath)
O.chunks.forEach(c=>{c.parent.remove(c);c.geometry.dispose();});O.chunks.length=0;{const k0=PL.length;for(let i=PL.length-1;i>=0;i--){const q=PL[i];if(q[0]<WX-1&&q[2]>(N?N.ZMIN:0)&&clearAt(q[0],q[2],.3))PL.splice(i,1);}O.plantsCleared=k0-PL.length;}plants(PL,'plants',80);O.plants=PL.length;

