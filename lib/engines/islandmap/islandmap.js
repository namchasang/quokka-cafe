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
   Uses: TerrainEngine, RoadEngine, FoliageEngine, PropsEngine, BuildingKit, VehicleEngine (vehicles and boats, parked or moving),
   LifeEngine (option life:false) and WaterLife (option waterLife:false; seaBed/waterLevel for a host with its own seabed). Map units: the
   doc's height grid is 121 x 121 cells of cs units centred on 0,0. Same rules as the editor: nothing on the railway, trees off the
   roads and footprints, bike paths their own network. */
(function(g){
const N=121;
const segD=(x,z,a,b)=>{const vx=b[0]-a[0],vz=b[1]-a[1],L=vx*vx+vz*vz||1e-6;let t=((x-a[0])*vx+(z-a[1])*vz)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-vx*t,z-a[1]-vz*t);};
/* paths join up (Paul, 15 Nov 2026: ride and walk round the island without a break): a path or bike-path end that stops short of
   another path, bike path or road (gap up to 6 units) gets a short link onto the nearest point of that line */
function weldPaths(doc){const L=[].concat((doc.paths||[]).map(p=>p.pts),(doc.roads||[]).filter(r=>r.type!=='bridge').map(r=>r.pts));let n=0;
  const near=(x,z,P)=>{let b=null,bd=1e9;for(let i=1;i<P.length;i++){const a=P[i-1],c=P[i],dx=c[0]-a[0],dz=c[1]-a[1],l=dx*dx+dz*dz;const t=l?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/l)):0;const q=[a[0]+t*dx,a[1]+t*dz],d=Math.hypot(x-q[0],z-q[1]);if(d<bd){bd=d;b=q;}}return[bd,b];};
  L.forEach(P=>{if(P.length<2)return;[0,1].forEach(end=>{const e=end?P[P.length-1]:P[0];let best=[1e9,null];L.forEach(Q=>{if(Q===P||Q.length<2)return;const r=near(e[0],e[1],Q);if(r[0]<best[0])best=r;});
    if(best[0]>.05&&best[0]<6){const q=[+best[1][0].toFixed(2),+best[1][1].toFixed(2)];if(end)P.push(q);else P.unshift(q);n++;}});});return n;}
/* paths and bike paths turn in long smooth curves instead of sharp corners (Paul, 15 Nov 2026): drawn lines keep their points in the
   map file; the curve is made when drawing (R = curve size in map units) */
const RNDC=new WeakMap();const rndP=(P,R)=>{if(!P||P.length<3)return P;let c=RNDC.get(P);if(c)return c;const A=[P[0]];
  for(let i=1;i<P.length-1;i++){const a=A[A.length-1],b=P[i],n=P[i+1],ux=b[0]-a[0],uz=b[1]-a[1],vx=n[0]-b[0],vz=n[1]-b[1],l1=Math.hypot(ux,uz),l2=Math.hypot(vx,vz);
    if(l1<.05)continue;if(l2<.05){continue;}if(Math.abs(ux*vz-uz*vx)/(l1*l2)<.03&&ux*vx+uz*vz>0)continue;A.push(b);}A.push(P[P.length-1]);
  if(A.length<3){RNDC.set(P,A);return A;}const O=[A[0]];
  for(let i=1;i<A.length-1;i++){const a=A[i-1],b=A[i],n=A[i+1],l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(n[0]-b[0],n[1]-b[1]);
    const d=Math.min(R,l1*(i===1?.9:.5),l2*(i===A.length-2?.9:.5));const p0=[b[0]+(a[0]-b[0])*d/l1,b[1]+(a[1]-b[1])*d/l1],p2=[b[0]+(n[0]-b[0])*d/l2,b[1]+(n[1]-b[1])*d/l2];
    const K=Math.max(4,Math.round(d*1.5));for(let k=0;k<=K;k++){const t=k/K,s=1-t;O.push([s*s*p0[0]+2*s*t*b[0]+t*t*p2[0],s*s*p0[1]+2*s*t*b[1]+t*t*p2[1]]);}}
  O.push(A[A.length-1]);RNDC.set(P,O);return O;};
const RNDT={bikepath:1,lane:1};const rpts=(r,R)=>RNDT[r.type]?rndP(r.pts,R):r.pts;
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
  /* the sea deepens away from the island to 4 at the map's edge, matching the open sea past the grid (Paul, 14 Nov 2026) */
  {const D=new Float32Array(N*N).fill(1e9),Q=[];for(let k=0;k<N*N;k++)if(h[k]>=sea){D[k]=0;Q.push(k);}for(let qi=0;qi<Q.length;qi++){const k=Q[qi],i=k%N,j=(k/N)|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=N||jj>=N)continue;const n=jj*N+ii;if(D[n]>D[k]+1){D[n]=D[k]+1;Q.push(n);}}}
    for(let k=0;k<N*N;k++){if(h[k]>=sea||D[k]<=3)continue;const i=k%N,j=(k/N)|0,e=Math.min(i,j,N-1-i,N-1-j);const t=Math.min(2.8,.7+(D[k]-3)*.1),te=t;/* shallow turquoise sea over the whole map, 2.8 deep at most (Paul, 15 Nov 2026: the teal of the game sea) */h[k]=Math.min(Math.max(h[k],sea-2.8),sea-Math.max(t,te));}}
  return h;}
/* smooth heights between the grid points (cubic B-spline over 4x4 points): coasts and hills come out as curves, not straight facets
   (Paul, 14 Nov 2026: straight-edged shallow bands along the beach) */
function gridH(h,N,fx,fz){const i=Math.floor(fx),j=Math.floor(fz),u=fx-i,v=fz-j,W=t=>[(1-t)*(1-t)*(1-t)/6,(3*t*t*t-6*t*t+4)/6,(-3*t*t*t+3*t*t+3*t+1)/6,t*t*t/6],wu=W(u),wv=W(v);let s=0;
  for(let b=0;b<4;b++){const jj=Math.min(N-1,Math.max(0,j-1+b)),r=jj*N;let row=0;for(let a=0;a<4;a++){const ii=Math.min(N-1,Math.max(0,i-1+a));row+=h[r+ii]*wu[a];}s+=row*wv[b];}return s;}
/* businesses bought in the Island Builder (same table and boats as the editor; editor/editor.js is the source) */
let GAM=false;
const BIZ={
  foodtruck:{n:'ฟู้ดทรัค',ic:'🚚',price:2000,inc:120,prop:'foodtruck',sign:'TACO TRUCK'},
  gelato:{n:'ร้านเจลาโต้',ic:'🍨',price:4500,inc:260,style:'kiosk',sign:'GELATO',awning:'#f5a3c0',wall:'#fff3e6',roofColor:'#f5a3c0'},
  cafe:{n:'คาเฟ่',ic:'☕',price:12000,inc:650,style:'cafe',sign:'SEASIDE CAFE'},
  restaurant:{n:'ร้านอาหาร',ic:'🍽️',price:20000,inc:1100,style:'shop',sign:'BAY KITCHEN',awning:'#3e7d5c',wall:'#f2e6c8'},
  rent1:{n:'กระท่อมพัก',ic:'🛖',price:5000,inc:250,rent:1,style:'cabin',sign:'BEACH CABIN'},
  rent2:{n:'บ้านพักหินปูน',ic:'🏠',price:9000,inc:450,rent:1,style:'islandcottage',sign:'HERITAGE STAY'},
  rent3:{n:'บ้านพักวิวทะเล',ic:'🏡',price:15000,inc:780,rent:1,style:'house',sign:'OCEAN VIEW',wall:'#f6f2e8',roofColor:'#5a6a74',shutters:'#2f6a9a'},
  rent4:{n:'วิลล่าสองชั้น',ic:'🏘️',price:24000,inc:1250,rent:1,style:'house',floors:2,balcony:true,sign:'BAY VILLA',wall:'#fbf8f0',roofColor:'#3a4048',w:8,d:7},
  rent5:{n:'วิลล่าหรูริมหาด',ic:'🏝️',price:40000,inc:2100,rent:1,style:'flats',floors:2,sign:'THE SANDS VILLA',wall:'#fdfbf6',roofColor:'#2f3a44',w:12,d:9,pool:true},
  fishing:{n:'เรือประมง',ic:'🎣',price:6000,inc:330,boat:'fishing'},
  party:{n:'เรือปาร์ตี้',ic:'🎉',price:15000,inc:850,boat:'party'},
  ferry:{n:'เรือเฟอร์รี่เช่าเหมา',ic:'⛴️',price:30000,inc:1600,boat:'ferry'}};
/* boat businesses as Vehicle Engine boats: kind, scale, speed */
const BOATK={fishing:['fishingboat',1,2.2],party:['partyboat',.7,1.6],ferry:['ferry',.8,1.8]};
const LM=c=>new THREE.MeshLambertMaterial({color:GAM?new THREE.Color(c):new THREE.Color(c).convertSRGBToLinear()});
function boatMesh(kind){const G=new THREE.Group(),bx=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),LM(c));m.position.set(x,y,z);m.castShadow=true;G.add(m);return m;};
  const hull=(L,W,H,c)=>{const g=new THREE.BoxGeometry(L,H,W,6,1,1),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i);if(x>L*.25){const f=1-(x-L*.25)/(L*.75)*.85;p.setZ(i,p.getZ(i)*f);}if(p.getY(i)<0)p.setZ(i,p.getZ(i)*.7);}g.computeVertexNormals();const m=new THREE.Mesh(g,LM(c));m.position.y=H/2-.35;m.castShadow=true;G.add(m);return m;};
  if(kind==='fishing'){hull(5.5,2.2,1.1,'#f6f2e8');bx(5.2,.12,2,'#3a6a9a',0,.12,0);bx(1.6,1.2,1.5,'#f6f2e8',-.6,.85,0);bx(1.62,.3,1.52,'#3a6a9a',-.6,1.55,0);const mast=bx(.1,2.6,.1,'#6a6a6a',.9,1.6,0);const boom=bx(2.2,.08,.08,'#6a6a6a',1.8,2.6,0);boom.rotation.z=-.4;
    [-.8,.8].forEach(z=>{const r=bx(.04,2,.04,'#2a2a30',-2,1.2,z);r.rotation.z=.6;});bx(.6,.5,.6,'#e85a6a',1.5,.55,.5);}
  if(kind==='party'){hull(8,3.4,1.2,'#fdfbf6');bx(6.5,.15,3,'#a8845a',-.3,.3,0);bx(5,1.6,2.8,'#f6f2e8',-.6,1.2,0);bx(5.4,.15,3.2,'#2f78a8',-.6,2.05,0);[-1,1].forEach(z=>bx(5,.05,.05,'#f6f2e8',-.6,2.9,z*1.5));
    for(let i=0;i<14;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.08,6,5),new THREE.MeshBasicMaterial({color:['#ff5a6a','#ffd84a','#5ad8ff','#8aff6a'][i%4]}));b.position.set(-3+i*.4,2.5+Math.sin(i)*.15,1.55);G.add(b);G.userData.lights=(G.userData.lights||[]).concat(b);}
    for(let i=0;i<5;i++){const f=bx(.05,.5,.35,['#e85a6a','#f2c14e','#3fb0a0','#b07ad8','#3a8ad0'][i],-2.6+i*1.1,2.4,0);f.rotation.y=.3;}}
  if(kind==='ferry'){hull(11,3.8,1.4,'#f6f6f2');bx(10.4,.3,3.4,'#1d3a6e',0,.55,0);bx(7,1.5,3.2,'#f6f6f2',-.6,1.45,0);bx(7.02,.5,3.22,'#2a3a58',-.6,1.55,0);bx(4.5,1.2,2.8,'#f6f6f2',-1.2,2.8,0);bx(4.52,.4,2.82,'#2a3a58',-1.2,2.9,0);
    const fun=bx(.7,1.2,.7,'#e85a6a',-2.6,3.9,0);bx(.72,.25,.72,'#2a2a30',-2.6,4.5,0);}
  return G;}
const bopts=(d,o)=>{const r=Object.assign({style:d.style,verandah:true},o);['sign','awning','wall','roofColor','shutters','floors','balcony','w','d'].forEach(k=>{if(d[k]!==undefined)r[k]=d[k];});return r;};
function create(o){
  GAM=!!o.gammaOut;if(o.weld!==false)try{weldPaths(o.doc);}catch(e){}const doc=o.doc,CS=o.cs||2,BS=o.bscale||.75,par=o.parent,HW=60*CS,S=120*CS,gam=!!o.gammaOut,skip=o.skip||{},hm=o.heightMap||(h=>h),sea=doc.sea||0;
  const G={},E={};['terr','road','props','bld','fol','rail','veh'].forEach(k=>{G[k]=new THREE.Group();G[k].name='im_'+k;par.add(G[k]);});
  const HH=coastFix(doc.h,N,sea);const raw=(x,z)=>{const fx=x/CS+60,fz=z/CS+60;if(fx<0||fz<0||fx>=N-1||fz>=N-1)return -2.8;return gridH(HH,N,fx,fz);};
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
  const kindAt=(x,z)=>{const h=Hg(x,z);if(h<SEA)return'water';if(o.noGrow&&o.noGrow(x,z))return'none';/* the host's own places (the game's café and deck) */if(onRail(x,z,1.3))return'path';if(doc.paths.some(p=>lineD(x,z,rndP(p.pts,5*CS))<p.w/2+.3))return'path';if(doc.roads.some(r=>lineD(x,z,rpts(r,5*CS))<RW[r.type])||inCul(x,z))return'path';if(inFoot(x,z,0))return'none';
    if(E.terr&&E.terr.groundKind)return E.terr.groundKind(x,z)==='sand'?'sand':'grass';return h<SEA+.9?'sand':'grass';};
  const inCul=(x,z,m)=>(doc.culs||[]).some(q=>Math.hypot(q.x-x,q.z-z)<6+(m||0));
  const keepOut=(x,z)=>inCul(x,z,.5)||onRail(x,z,1.6)||inFoot(x,z,.5)||doc.roads.some(r=>lineD(x,z,r.pts)<RW[r.type]+.6)||doc.props.some(p=>Math.hypot(p.x-x,p.z-z)<1.2);
  const t0=performance.now(),G0=gam?{gammaOut:true}:{};
  /* roads first: the ground is fitted to their beds */
  E.road=RoadEngine.create(Object.assign({scene:G.road,heightAt:Hfn,smooth:true,maxGrade:.06},G0));const GB=new THREE.Group();G.road.add(GB);E.bike=RoadEngine.create(Object.assign({scene:GB,heightAt:Hfn,smooth:true,maxGrade:.06},G0));
  (doc.culs||[]).forEach(q=>{E.road.culdesac(q.x,q.z);E.bike.culdesac(q.x,q.z);});
  doc.roads.forEach(r=>{if(r.pts.length<2)return;if(r.type==='bridge')E.road.bridge(r.pts,{type:'highway',height:4});else if(r.type==='bikepath')E.bike.road(rpts(r,5*CS),{type:r.type});else E.road.road(rpts(r,5*CS),r.type==='lane'?{type:'lane',color:'#a08c6a'}:{type:r.type});});
  E.road.build();E.bike.build();GB.traverse(m=>{if(m.isMesh&&m.material&&!Array.isArray(m.material)){const q=m.material.clone();q.polygonOffset=true;q.polygonOffsetFactor=(q.polygonOffsetFactor||0)+2;q.polygonOffsetUnits=(q.polygonOffsetUnits||0)+2;m.material=q;}});
  /* ground */
  E.terr=TerrainEngine.create(Object.assign({size:[S,S],center:[0,0],res:.5*CS,heightAt:Hg,seaLevel:SEA,paths:doc.paths.map(p=>({pts:rndP(p.pts,5*CS),w:p.w,kind:p.kind})).concat(rail.length>1?[{pts:rail,w:2.2,kind:'gravel'}]:[])},o.terrain||{},G0));
  if(o.landOnly){/* the host keeps its own sea and seabed: drop the ground's underwater triangles */const gm=E.terr.mesh.geometry,P=gm.attributes.position,I=gm.index.array,keep=[];const up=v=>P.getY(v)>SEA-.25;
    for(let i=0;i<I.length;i+=3)if(up(I[i])||up(I[i+1])||up(I[i+2]))keep.push(I[i],I[i+1],I[i+2]);gm.setIndex(keep);}
  G.terr.add(E.terr.mesh);
  /* props (the jetty is fixed; bus stops are pinned: movable, never removed) */
  E.props=PropsEngine.create(Object.assign({scene:G.props,heightAt:Hg},G0));
  doc.props.forEach(p=>{if(skip[p.k])return;const q={rot:p.k==='fence'||p.k==='jetty'?0:p.r||0};if(p.k==='fence'){const c=Math.cos(p.r||0),s=Math.sin(p.r||0);q.lines=[[p.x-c*2,p.z+s*2],[p.x+c*2,p.z-s*2]];}
    if(p.k==='jetty'){const c=Math.cos(p.r||0),s=Math.sin(p.r||0),L=p.len||10;q.lines=[[p.x,p.z],[p.x+s*L,p.z+c*L]];if(p.w)q.width=p.w;}if(p.k==='boardwalk'||p.k==='dunefence'){const c=Math.cos(p.r||0),s=Math.sin(p.r||0),L=p.len||8;q.lines=[[p.x-s*L/2,p.z-c*L/2],[p.x+s*L/2,p.z+c*L/2]];q.rot=0;}try{E.props.add(p.k,p.x,p.z,q);}catch(e){console.warn('islandmap prop',p.k,e);}});
  /* buildings */
  E.bld=BuildingKit.create(Object.assign({scene:G.bld,heightAt:Hg},G0));E.bld.list=doc.bld.map(b=>{if(skip[b.s])return null;let grp=null;try{grp=E.bld.build(Object.assign({style:b.s,x:b.x,z:b.z,rot:b.r||0,sign:b.sign||undefined,wall:b.wall||undefined},b.o||{}/* extra Building Kit options (size, floors, colours) for maps made in code */));}catch(e){console.warn('islandmap bld',b.s,e);}
    if(grp&&BS!==1)grp.scale.setScalar(BS);if(grp){const f=footOf(grp,b);if(f)FP.push(f);}return grp;});
  /* businesses: shops and rentals from the Building Kit, bought boats sail a loop in deep water */
  const BQ=[];E.biz=[];G.biz=new THREE.Group();G.biz.name='im_biz';par.add(G.biz);{const BB=BuildingKit.create(Object.assign({scene:G.biz,heightAt:Hg},G0));let PB=null;
    (doc.biz||[]).forEach((b,i)=>{const d=BIZ[b.t];if(!d)return;let grp=null;try{
      if(d.boat&&typeof VehicleEngine!=='undefined'){BQ.push({b,d,i});return;}/* Vehicle Engine boats, added with the vehicles below */
      if(d.boat){grp=boatMesh(d.boat);grp.position.set(b.x,SEA,b.z);grp.rotation.y=b.r||0;G.biz.add(grp);let R0=0;for(const R of[14,11,8,6,4]){let ok=true;for(let a=0;a<6.28&&ok;a+=.4)if(Hg(b.x+Math.cos(a)*R,b.z+Math.sin(a)*R)>SEA-.6)ok=false;if(ok){R0=R;break;}}E.biz.push({g:grp,b,R:R0,ph:i*1.7,sp:{fishing:.05,party:.035,ferry:.03}[d.boat]||.04});}
      else if(d.prop){PB=PB||PropsEngine.create(Object.assign({scene:G.biz,heightAt:Hg},G0));grp=PB.add(d.prop,b.x,b.z,{rot:b.r||0,sign:d.sign});}
      else{grp=BB.build(bopts(d,{x:b.x,z:b.z,rot:b.r||0}));if(grp&&BS!==1)grp.scale.setScalar(BS);if(grp){const f=footOf(grp,b);if(f)FP.push(f);}}}catch(e){console.warn('islandmap biz',b.t,e);}});}
  /* railway: sleepers, rails and a station at each end (the host may run its own train on it) */
  if(rail.length>1){const LM=c=>new THREE.MeshLambertMaterial({color:gam?new THREE.Color(c):new THREE.Color(c).convertSRGBToLinear()});const cv=new THREE.CatmullRomCurve3(rail.map(p=>new THREE.Vector3(p[0],0,p[1])),false,'centripetal'),P=cv.getSpacedPoints(Math.ceil(cv.getLength()/1.2));
    const tg=new THREE.BoxGeometry(.28,.08,1.7),rg=new THREE.BoxGeometry(1,.07,.07),sl=new THREE.InstancedMesh(tg,LM('#6a4a32'),P.length),rl=new THREE.InstancedMesh(rg,LM('#9aa0a6'),(P.length-1)*2),m=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new THREE.Vector3(1,1,1),up=new THREE.Vector3(0,1,0);let ri=0;
    P.forEach((p,i)=>{const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],ang=-Math.atan2(b.z-a.z,b.x-a.x),y=Math.max(Hg(p.x,p.z),SEA)+.05;q.setFromAxisAngle(up,ang);sl.setMatrixAt(i,m.compose(new THREE.Vector3(p.x,y,p.z),q,sc));
      if(i){const c=P[i-1],L=p.distanceTo(c),an=-Math.atan2(p.z-c.z,p.x-c.x),mx=(p.x+c.x)/2,mz=(p.z+c.z)/2,my=Math.max(Hg(mx,mz),SEA)+.12;q.setFromAxisAngle(up,an);[-.55,.55].forEach(o=>{rl.setMatrixAt(ri++,m.compose(new THREE.Vector3(mx+Math.sin(an)*o,my,mz+Math.cos(an)*o),q,new THREE.Vector3(L+.02,1,1)));});}});
    sl.receiveShadow=rl.castShadow=true;G.rail.add(sl,rl);
    ST.forEach((S,i)=>{const pf=new THREE.Mesh(new THREE.BoxGeometry(9,.35,2.2),LM('#d8cfbc'));pf.position.set(S.x,Math.max(Hg(S.x,S.z),SEA)+.18,S.z);pf.rotation.y=S.ang;pf.castShadow=pf.receiveShadow=true;G.rail.add(pf);
      const edge=new THREE.Mesh(new THREE.BoxGeometry(9,.04,.18),LM('#f2c230'));edge.position.set(S.x-S.px,pf.position.y+.19,S.z-S.pz);edge.rotation.y=S.ang;G.rail.add(edge);
      const SB=BuildingKit.create(Object.assign({scene:G.rail,heightAt:Hg},G0)),SO=(doc.stHut||[])[i],HX=SO?SO.x:S.x+S.px*3.4,HZ=SO?SO.z:S.z+S.pz*3.4,HR=SO&&SO.r!=null?SO.r:Math.atan2(-S.px,-S.pz),hut=SB.build({style:'kiosk',x:HX,z:HZ,rot:HR,sign:i?'NORTH STATION':'SOUTH STATION'});if(hut&&BS!==1)hut.scale.setScalar(BS);if(hut){const f=footOf(hut,{x:HX,z:HZ,r:HR});if(f)FP.push(f);}
      const roof=new THREE.Mesh(new THREE.BoxGeometry(7,.1,1.6),LM('#2f6a74'));roof.position.set(S.x+S.px*.3,pf.position.y+1.8,S.z+S.pz*.3);roof.rotation.y=S.ang;roof.castShadow=true;G.rail.add(roof);
      [-3,0,3].forEach(o=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.6,6),LM('#3a4048'));c.position.set(S.x+S.ux*o+S.px*.6,pf.position.y+.95,S.z+S.uz*o+S.pz*.6);G.rail.add(c);});});}
  /* nature after the buildings, so it keeps clear of every footprint */
  E.fol=FoliageEngine.create(Object.assign({mix:'rottnest',scene:G.fol,bounds:[-HW,-HW,HW,HW],heightAt:Hg,kindAt,keepOut,density:doc.fol,radius:46*Math.min(CS,1.4),
    treeKeepOut:(x,z)=>inCul(x,z,2.5)||onRail(x,z,3.2)||inFoot(x,z,2.4)||!!(o.noGrow&&o.noGrow(x,z))},o.fol||{},G0));
  (doc.trees||[]).forEach(t=>{if(t.k==='peppermint')t.k='pepper';if(onRail(t.x,t.z,2.6)||inFoot(t.x,t.z,1.5)||inCul(t.x,t.z,1.5))return;try{E.fol.addTree(t.x,t.z,{kind:t.k,size:t.s||1});}catch(e){}});
  /* vehicles (Vehicle Engine): parked, or on the move like in the builder: road vehicles and bikes drive the road and bike-path
     networks, boats sail a loop in deep water (Paul, 15 Nov 2026). The boat businesses are Vehicle Engine boats too (more detail,
     wakes, lights at night). */
  if(typeof VehicleEngine!=='undefined'&&(o.vehicles!==false||BQ.length)){const V=E.veh=VehicleEngine.create(Object.assign({scene:G.veh,heightAt:Hg,waterLevel:SEA},G0));
    const deepLoop=(x,z,Rs,m)=>{for(const R of Rs){const Q=[];for(let i=0;i<20;i++){const q=i/20*6.2832;Q.push([x+Math.cos(q)*R,z+Math.sin(q)*R]);}if(Q.every(p=>Hg(p[0],p[1])<SEA-m))return Q;}return null;};
    BQ.forEach(({b,d})=>{const K=BOATK[d.boat]||['fishingboat',1];try{const v=V.add(K[0],b.x,b.z,{rot:b.r||0});if(K[1]!==1)v.g.scale.setScalar(K[1]);const P=deepLoop(b.x,b.z,[14,11,8,6,4],.6);if(P)V.sail(v,P,{speed:K[2]});}catch(e){console.warn('islandmap boat',e);}});
    if(o.vehicles!==false)(doc.veh||[]).forEach(v=>{if(skip[v.k]||onRail(v.x,v.z,2.6))return;/* never parked on the railway */let q;try{q=V.add(v.k,v.x,v.z,{rot:v.r||0,color:v.c||undefined});}catch(e){return;}if(!v.go||o.vehiclesMove===false)return;
      const c=(VehicleEngine.KINDS[v.k]||{}).cat,a=v.r||0,ca=Math.cos(a),sa=Math.sin(a);
      try{if(c==='road'||c==='bike'){let best=0,bd=1e9,net=E.road;[E.road].concat(c==='bike'?[E.bike]:[]).forEach(N=>(N.roads||[]).forEach((r,i)=>{const d=lineD(v.x,v.z,r.pts.map(p=>Array.isArray(p)?p:[p.x,p.z]));if(d<bd){bd=d;best=i;net=N;}}));if(bd<8)V.drive(q,net,{road:best,t:.5});}
        else if(c==='water'){let P=null;for(const R of[Math.max(4,q.L*1.6),Math.max(3,q.L*1.1),2.5]){const Q=[];for(let i=0;i<16;i++){const t=i/16*Math.PI*2;Q.push([v.x+Math.cos(t)*R-ca*R,v.z+Math.sin(t)*R+sa*R]);}if(Q.every(p=>Hg(p[0],p[1])<SEA-.5)){P=Q;break;}}if(P)V.sail(q,P,{});}}catch(e){console.warn('islandmap veh',v.k,e);}});}
  /* island folk on the paths, quokkas, kangaroos, gulls, butterflies, pelicans and dolphins (Life Engine; counts from the map's life
     settings, lifeScale to thin them on phones) */
  if(o.life!==false&&typeof LifeEngine!=='undefined'){G.life=new THREE.Group();G.life.name='im_life';par.add(G.life);
    try{E.life=LifeEngine.create(Object.assign({scene:G.life,heightAt:Hg,kindAt,paths:doc.paths.map(p=>rndP(p.pts,5*CS)),water:(x,z)=>Hg(x,z)<SEA,bounds:[-55*CS,-55*CS,55*CS,55*CS]},G0));
      const LSC=o.lifeScale==null?1:o.lifeScale;Object.keys(doc.life||{}).forEach(k=>{const n=Math.round((doc.life[k]|0)*LSC);if(!n)return;if(!doc.paths.length&&(k==='walker'||k==='jogger'||k==='cyclist'))return;if(o.lifeSkip&&o.lifeSkip[k])return;try{E.life.spawn(k,n);}catch(e){console.warn('life',k,e);}});}catch(e){console.warn('islandmap life',e);}}
  /* sea life (Water Life layers): seagrass, fish schools, kelp, shells, jellyfish, glints, a stingray; no sea rocks */
  if(o.waterLife!==false&&typeof WaterLife!=='undefined'){G.wl=new THREE.Group();G.wl.name='im_wl';par.add(G.wl);
    try{E.wl=WaterLife.create(Object.assign({scene:G.wl,heightAt:o.seaBed||Hg,level:o.waterLevel!=null?o.waterLevel:SEA,bounds:o.seaBounds||[-60*CS,-60*CS,60*CS,60*CS]},G0));if(!o.searocks)E.wl.setLayer('searocks',false);}catch(e){console.warn('islandmap waterlife',e);}}
  const ms=Math.round(performance.now()-t0);
  return{doc,G,E,heightAt:Hg,rawHeight:Hfn,seaLevel:SEA,kindAt,solidAt:(x,z,m)=>inFoot(x,z,m||0)||inStation(x,z,0),onRail,footprints:FP,stations:ST,ms,
    update(t,x,z,op){E.biz.forEach(q=>{if(!q.R)return;q.ph+=(1/60)*q.sp*14/q.R;const a=q.ph;q.g.position.set(q.b.x+Math.cos(a)*q.R,SEA+Math.sin(t*1.3+q.ph)*.05,q.b.z+Math.sin(a)*q.R);q.g.rotation.y=-a-Math.PI;});try{E.fol.update(t,x,z,op);}catch(e){}try{E.road.update&&E.road.update(t,1/60);E.bike.update&&E.bike.update(t,1/60);}catch(e){}try{E.terr.update&&E.terr.update(t);}catch(e){}const nt=(op&&op.night)||0;try{if(E.veh){E.veh.night=nt;E.veh.update(t,1/60);}}catch(e){}try{E.life&&E.life.update(t,1/60,{night:nt});}catch(e){}try{E.wl&&E.wl.update(t,1/60);}catch(e){}}};}
g.IslandMap={create,lineD,coastFix,gridH};
})(typeof window!=='undefined'?window:globalThis);
