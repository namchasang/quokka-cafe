// ---------- Island Map loader (Paul Perth Library, lib/engines/islandmap/islandmap.js), embedded for the engine-built maps. Re-embed after engine changes. ----------
/* Island Map loader (Paul Perth Library, Nov 2026) — builds an Island Builder map document (PPLMAP1, the doc the Map Editor saves)
   with the real engines, for a host that is not the editor (the game). Paul (14 Nov 2026): the game's Rottnest is the same island
   players build in the Island Builder.
   const I=IslandMap.create({doc,parent,cs:2,bscale:.75,heightMap:(h)=>h,gammaOut,skip:{cafe:1,jetty:1},fol:{...}});
     doc       the map document (rottnest-start.json, or a player's saved island)
     parent    a THREE.Group in the host scene; it is in the map's own units (the host places, scales and mirrors it)
     heightMap optional: maps the doc's heights (sea 0, land above) to the host's, still in map units
     skip      fixed pieces the host draws itself (the game keeps its own café and jetty for now)
   noGrow    optional (x,z)=>bool in map units: no grass or trees there (the host's own places)
   I.heightAt(x,z)  ground height in map units (road beds levelled)   I.kindAt(x,z) 'water'|'sand'|'path'|'none'|'grass'
   I.solidAt(x,z,m) true inside a building footprint (+m)              I.update(t,camX,camZ,{push,reveal})   each frame (wind, sway)
   Uses: TerrainEngine, RoadEngine, FoliageEngine, PropsEngine, BuildingKit (and VehicleEngine for parked vehicles). Map units: the
   doc's height grid is 121 x 121 cells of cs units centred on 0,0. Same rules as the editor: nothing on the railway, trees off the
   roads and footprints, bike paths their own network. */
(function(g){
const N=121;
const segD=(x,z,a,b)=>{const vx=b[0]-a[0],vz=b[1]-a[1],L=vx*vx+vz*vz||1e-6;let t=((x-a[0])*vx+(z-a[1])*vz)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-vx*t,z-a[1]-vz*t);};
const lineD=(x,z,pts)=>{let m=1e9;for(let i=1;i<pts.length;i++)m=Math.min(m,segD(x,z,pts[i-1],pts[i]));return m;};
const RW={bikepath:1.3,island:2.4,street:3.3,arterial:5,highway:4.6,lane:1.6,bridge:4.6};
/* clean shoreline for a height grid (Paul, 14 Nov 2026: pale-green flat facets on the beach when the waves ran up): pools cut off
   from the sea are filled, and cells next to the waterline are kept clearly above or below the sea, so the water never lies in
   thin flat sheets on the sand. Returns a new array. */
function coastFix(h0,N,sea){const h=h0.slice(),oc=new Uint8Array(N*N),q=[];
  for(let i=0;i<N;i++)[[i,0],[i,N-1],[0,i],[N-1,i]].forEach(([a,b])=>{const k=b*N+a;if(h[k]<sea&&!oc[k]){oc[k]=1;q.push(k);}});
  while(q.length){const k=q.pop(),i=k%N,j=(k/N)|0;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=N||jj>=N)return;const n=jj*N+ii;if(!oc[n]&&h[n]<sea){oc[n]=1;q.push(n);}});}
  for(let k=0;k<N*N;k++)if(h[k]<sea&&!oc[k])h[k]=sea+.12;
  const nb=(k,f)=>{const i=k%N,j=(k/N)|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=N||jj>=N)continue;if(f(h0[jj*N+ii]<sea&&oc[jj*N+ii]))return true;}return false;};
  for(let k=0;k<N*N;k++){const w=h[k]<sea;if(w){h[k]=Math.min(h[k],nb(k,x=>!x)?sea-.18:sea-.32);}else if(nb(k,x=>x))h[k]=Math.max(h[k],sea+.14);}
  return h;}
function create(o){
  const doc=o.doc,CS=o.cs||2,BS=o.bscale||.75,par=o.parent,HW=60*CS,S=120*CS,gam=!!o.gammaOut,skip=o.skip||{},hm=o.heightMap||(h=>h),sea=doc.sea||0;
  const G={},E={};['terr','road','props','bld','fol','rail','veh'].forEach(k=>{G[k]=new THREE.Group();G[k].name='im_'+k;par.add(G[k]);});
  const HH=coastFix(doc.h,N,sea);const raw=(x,z)=>{const fx=x/CS+60,fz=z/CS+60;if(fx<0||fz<0||fx>=N-1||fz>=N-1)return -6;const i=Math.floor(fx),j=Math.floor(fz),u=fx-i,v=fz-j,h=HH,a=h[j*N+i],b=h[j*N+i+1],c=h[(j+1)*N+i],d=h[(j+1)*N+i+1];return(a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v;};
  const Hfn=(x,z)=>hm(raw(x,z),x,z),SEA=hm(sea,0,0);
  const Hg=(x,z)=>{let h=Hfn(x,z);if(E.road&&E.road.junctions)h=E.road.groundAt(x,z,h);if(E.bike&&E.bike.junctions)h=E.bike.groundAt(x,z,h);return h;};
  const rail=doc.rail||[];
  const stations=()=>{if(rail.length<2)return[];return[[rail[0],rail[1]],[rail[rail.length-1],rail[rail.length-2]]].map(([e,n])=>{const dx=n[0]-e[0],dz=n[1]-e[1],L=Math.hypot(dx,dz)||1,ux=dx/L,uz=dz/L,px=-uz,pz=ux;return{x:e[0]+ux*5+px*2.3,z:e[1]+uz*5+pz*2.3,ux,uz,px,pz,ang:-Math.atan2(uz,ux)};});};
  const ST=stations();const inStation=(x,z,m)=>ST.some(st=>{const dx=x-st.x,dz=z-st.z,a=dx*st.ux+dz*st.uz,b=dx*st.px+dz*st.pz;m=m||0;return Math.abs(a)<4.8+m&&b>-1.3-m&&b<5.4+m;});
  const onRail=(x,z,m)=>rail.length>1&&(lineD(x,z,rail)<(m||2.4)||inStation(x,z,(m||0)*.5));
  /* footprints of everything built, in map units (turned rectangles) */
  const FP=[];const footOf=(grp,b)=>{const inv=new THREE.Matrix4().copy(grp.parent.matrixWorld).invert(),B=new THREE.Box3();grp.updateMatrixWorld(true);
    const r=b.r||0,c=Math.cos(r),s=Math.sin(r);let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;grp.traverse(m=>{if(!m.isMesh||!m.geometry||m.userData.yard)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();B.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld).applyMatrix4(inv);
      [[B.min.x,B.min.z],[B.max.x,B.min.z],[B.min.x,B.max.z],[B.max.x,B.max.z]].forEach(([x,z])=>{const dx=x-b.x,dz=z-b.z,lx=dx*c-dz*s,lz=dx*s+dz*c;x0=Math.min(x0,lx);x1=Math.max(x1,lx);z0=Math.min(z0,lz);z1=Math.max(z1,lz);});});
    return x0<x1?{x:b.x,z:b.z,r,F:[x0,z0,x1,z1]}:null;};
  const inFoot=(x,z,m)=>FP.some(e=>{const c=Math.cos(e.r),s=Math.sin(e.r),dx=x-e.x,dz=z-e.z,lx=dx*c-dz*s,lz=dx*s+dz*c,F=e.F;return lx>F[0]-m&&lx<F[2]+m&&lz>F[1]-m&&lz<F[3]+m;});
  const kindAt=(x,z)=>{const h=Hg(x,z);if(h<SEA)return'water';if(o.noGrow&&o.noGrow(x,z))return'none';/* the host's own places (the game's café and deck) */if(onRail(x,z,1.3))return'path';if(doc.paths.some(p=>lineD(x,z,p.pts)<p.w/2+.3))return'path';if(doc.roads.some(r=>lineD(x,z,r.pts)<RW[r.type])||inCul(x,z))return'path';if(inFoot(x,z,0))return'none';
    if(E.terr&&E.terr.groundKind)return E.terr.groundKind(x,z)==='sand'?'sand':'grass';return h<SEA+.9?'sand':'grass';};
  const inCul=(x,z,m)=>(doc.culs||[]).some(q=>Math.hypot(q.x-x,q.z-z)<6+(m||0));
  const keepOut=(x,z)=>inCul(x,z,.5)||onRail(x,z,1.6)||inFoot(x,z,.5)||doc.roads.some(r=>lineD(x,z,r.pts)<RW[r.type]+.6)||doc.props.some(p=>Math.hypot(p.x-x,p.z-z)<1.2);
  const t0=performance.now(),G0=gam?{gammaOut:true}:{};
  /* roads first: the ground is fitted to their beds */
  E.road=RoadEngine.create(Object.assign({scene:G.road,heightAt:Hfn,smooth:true,maxGrade:.06},G0));const GB=new THREE.Group();G.road.add(GB);E.bike=RoadEngine.create(Object.assign({scene:GB,heightAt:Hfn,smooth:true,maxGrade:.06},G0));
  (doc.culs||[]).forEach(q=>{E.road.culdesac(q.x,q.z);E.bike.culdesac(q.x,q.z);});
  doc.roads.forEach(r=>{if(r.pts.length<2)return;if(r.type==='bridge')E.road.bridge(r.pts,{type:'highway',height:4});else if(r.type==='bikepath')E.bike.road(r.pts,{type:r.type});else E.road.road(r.pts,r.type==='lane'?{type:'lane',color:'#a08c6a'}:{type:r.type});});
  E.road.build();E.bike.build();GB.traverse(m=>{if(m.isMesh&&m.material&&!Array.isArray(m.material)){const q=m.material.clone();q.polygonOffset=true;q.polygonOffsetFactor=(q.polygonOffsetFactor||0)+2;q.polygonOffsetUnits=(q.polygonOffsetUnits||0)+2;m.material=q;}});
  /* ground */
  E.terr=TerrainEngine.create(Object.assign({size:[S,S],center:[0,0],res:.5*CS,heightAt:Hg,seaLevel:SEA,paths:doc.paths.map(p=>({pts:p.pts,w:p.w,kind:p.kind})).concat(rail.length>1?[{pts:rail,w:2.2,kind:'gravel'}]:[])},o.terrain||{},G0));
  if(o.landOnly){/* the host keeps its own sea and seabed: drop the ground's underwater triangles */const gm=E.terr.mesh.geometry,P=gm.attributes.position,I=gm.index.array,keep=[];const up=v=>P.getY(v)>SEA-.25;
    for(let i=0;i<I.length;i+=3)if(up(I[i])||up(I[i+1])||up(I[i+2]))keep.push(I[i],I[i+1],I[i+2]);gm.setIndex(keep);}
  G.terr.add(E.terr.mesh);
  /* props (the jetty is fixed; bus stops are pinned: movable, never removed) */
  E.props=PropsEngine.create(Object.assign({scene:G.props,heightAt:Hg},G0));
  doc.props.forEach(p=>{if(skip[p.k])return;const q={rot:p.k==='fence'||p.k==='jetty'?0:p.r||0};if(p.k==='fence'){const c=Math.cos(p.r||0),s=Math.sin(p.r||0);q.lines=[[p.x-c*2,p.z+s*2],[p.x+c*2,p.z-s*2]];}
    if(p.k==='jetty'){const c=Math.cos(p.r||0),s=Math.sin(p.r||0),L=p.len||10;q.lines=[[p.x,p.z],[p.x+s*L,p.z+c*L]];if(p.w)q.width=p.w;}try{E.props.add(p.k,p.x,p.z,q);}catch(e){console.warn('islandmap prop',p.k,e);}});
  /* buildings */
  E.bld=BuildingKit.create(Object.assign({scene:G.bld,heightAt:Hg},G0));E.bld.list=doc.bld.map(b=>{if(skip[b.s])return null;let grp=null;try{grp=E.bld.build({style:b.s,x:b.x,z:b.z,rot:b.r||0,sign:b.sign||undefined,wall:b.wall||undefined});}catch(e){console.warn('islandmap bld',b.s,e);}
    if(grp&&BS!==1)grp.scale.setScalar(BS);if(grp){const f=footOf(grp,b);if(f)FP.push(f);}return grp;});
  /* railway: sleepers, rails and a station at each end (the host may run its own train on it) */
  if(rail.length>1){const LM=c=>new THREE.MeshLambertMaterial({color:gam?new THREE.Color(c):new THREE.Color(c).convertSRGBToLinear()});const cv=new THREE.CatmullRomCurve3(rail.map(p=>new THREE.Vector3(p[0],0,p[1])),false,'centripetal'),P=cv.getSpacedPoints(Math.ceil(cv.getLength()/1.2));
    const tg=new THREE.BoxGeometry(.28,.08,1.7),rg=new THREE.BoxGeometry(1,.07,.07),sl=new THREE.InstancedMesh(tg,LM('#6a4a32'),P.length),rl=new THREE.InstancedMesh(rg,LM('#9aa0a6'),(P.length-1)*2),m=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new THREE.Vector3(1,1,1),up=new THREE.Vector3(0,1,0);let ri=0;
    P.forEach((p,i)=>{const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],ang=-Math.atan2(b.z-a.z,b.x-a.x),y=Math.max(Hg(p.x,p.z),SEA)+.05;q.setFromAxisAngle(up,ang);sl.setMatrixAt(i,m.compose(new THREE.Vector3(p.x,y,p.z),q,sc));
      if(i){const c=P[i-1],L=p.distanceTo(c),an=-Math.atan2(p.z-c.z,p.x-c.x),mx=(p.x+c.x)/2,mz=(p.z+c.z)/2,my=Math.max(Hg(mx,mz),SEA)+.12;q.setFromAxisAngle(up,an);[-.55,.55].forEach(o=>{rl.setMatrixAt(ri++,m.compose(new THREE.Vector3(mx+Math.sin(an)*o,my,mz+Math.cos(an)*o),q,new THREE.Vector3(L+.02,1,1)));});}});
    sl.receiveShadow=rl.castShadow=true;G.rail.add(sl,rl);
    ST.forEach((S,i)=>{const pf=new THREE.Mesh(new THREE.BoxGeometry(9,.35,2.2),LM('#d8cfbc'));pf.position.set(S.x,Math.max(Hg(S.x,S.z),SEA)+.18,S.z);pf.rotation.y=S.ang;pf.castShadow=pf.receiveShadow=true;G.rail.add(pf);
      const edge=new THREE.Mesh(new THREE.BoxGeometry(9,.04,.18),LM('#f2c230'));edge.position.set(S.x-S.px,pf.position.y+.19,S.z-S.pz);edge.rotation.y=S.ang;G.rail.add(edge);
      const SB=BuildingKit.create(Object.assign({scene:G.rail,heightAt:Hg},G0)),hut=SB.build({style:'kiosk',x:S.x+S.px*3.4,z:S.z+S.pz*3.4,rot:Math.atan2(-S.px,-S.pz),sign:i?'NORTH STATION':'SOUTH STATION'});if(hut&&BS!==1)hut.scale.setScalar(BS);if(hut){const f=footOf(hut,{x:S.x+S.px*3.4,z:S.z+S.pz*3.4,r:Math.atan2(-S.px,-S.pz)});if(f)FP.push(f);}
      const roof=new THREE.Mesh(new THREE.BoxGeometry(7,.1,1.6),LM('#2f6a74'));roof.position.set(S.x+S.px*.3,pf.position.y+1.8,S.z+S.pz*.3);roof.rotation.y=S.ang;roof.castShadow=true;G.rail.add(roof);
      [-3,0,3].forEach(o=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.6,6),LM('#3a4048'));c.position.set(S.x+S.ux*o+S.px*.6,pf.position.y+.95,S.z+S.uz*o+S.pz*.6);G.rail.add(c);});});}
  /* nature after the buildings, so it keeps clear of every footprint */
  E.fol=FoliageEngine.create(Object.assign({mix:'rottnest',scene:G.fol,bounds:[-HW,-HW,HW,HW],heightAt:Hg,kindAt,keepOut,density:doc.fol,radius:46*Math.min(CS,1.4),
    treeKeepOut:(x,z)=>inCul(x,z,2.5)||onRail(x,z,3.2)||inFoot(x,z,2.4)||!!(o.noGrow&&o.noGrow(x,z))},o.fol||{},G0));
  (doc.trees||[]).forEach(t=>{if(t.k==='peppermint')t.k='pepper';if(onRail(t.x,t.z,2.6)||inFoot(t.x,t.z,1.5)||inCul(t.x,t.z,1.5))return;try{E.fol.addTree(t.x,t.z,{kind:t.k,size:t.s||1});}catch(e){}});
  /* parked vehicles (boats stay on the sea) */
  if(o.vehicles!==false&&typeof VehicleEngine!=='undefined'){E.veh=VehicleEngine.create(Object.assign({scene:G.veh,heightAt:Hg,waterLevel:SEA},G0));(doc.veh||[]).forEach(v=>{if(skip[v.k]||onRail(v.x,v.z,2.6))return;/* never parked on the railway */try{E.veh.add(v.k,v.x,v.z,{rot:v.r||0,color:v.c||undefined});}catch(e){}});}
  const ms=Math.round(performance.now()-t0);
  return{doc,G,E,heightAt:Hg,rawHeight:Hfn,seaLevel:SEA,kindAt,solidAt:(x,z,m)=>inFoot(x,z,m||0)||inStation(x,z,0),onRail,footprints:FP,stations:ST,ms,
    update(t,x,z,op){try{E.fol.update(t,x,z,op);}catch(e){}try{E.road.update&&E.road.update(t,1/60);E.bike.update&&E.bike.update(t,1/60);}catch(e){}try{E.terr.update&&E.terr.update(t);}catch(e){}try{E.veh&&E.veh.update(t,1/60);}catch(e){}}};}
g.IslandMap={create,lineD,coastFix};
})(typeof window!=='undefined'?window:globalThis);
