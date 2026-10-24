// ---------- Island Loop bus: a 19-stop loop bus, like the real one ----------
// stops are placed in the original layout (old coordinates), pulled onto dry land, then moved with the island
const XPL_STOPS=[['settle','Main Bus Stop',10.4,-1.8],['kingstown','Kingstown Barracks',16,8.6],['henrietta','Henrietta Rocks',27,10],['porpoise','Porpoise Bay',38,8.4],['light','Rottnest Lighthouse',32.2,-3.4],
  ['parker','Parker Point',62.5,6.4],['salmon','Little Salmon Bay',70.4,5.8],['salmonbay','Salmon Bay',76,5.6],['green','Green Island',79.5,5.4],['strick','Strickland Bay',83.4,5.6],['west','West End',89.6,1],
  ['roland','Roland Smith Memorial',90.4,-2.4],['rocky','Rocky Bay',86,-3.2],['stark','Stark Bay',81,-3.4],['ricey','Ricey Beach',77,-3.6],['york','City of York Bay',73,-3.6],['armstrong','Little Armstrong Bay',68.4,-3.6],['parakeet','Little Parakeet Bay',64,-3.6],['geordie','Geordie Bay',59.4,-2.6]];
const XPL={stops:[],route:[],idx:{},meshes:[]};
// old-layout helpers: walk a point inland until it is on firm ground
function islInland(x,z,want){want=want||1.6;const c=x>46?[72,1.2]:[16.5,1.7];const x0=x,z0=z;
  // straight inland across the island first (keeps neighbouring stops apart), then towards the middle
  for(let i=0;i<40&&landD(x,z)<want;i++)z+=Math.sign(c[1]-z)*.25;if(landD(x,z)>=want)return[x,z];x=x0;z=z0;
  for(let i=0;i<60&&landD(x,z)<want;i++){const dx=c[0]-x,dz=c[1]-z,d=Math.hypot(dx,dz)||1;x+=dx/d*.25;z+=dz/d*.25;}return[x,z];}
ISL.data.push(()=>{if(!ISL.done)return;
  // landD() still reads the original island here (the ground is rebuilt right after); stops are found inland in the old layout
  const stops=XPL_STOPS.map(([id,n,x,z])=>{const p=islInland(x,z,1.7),w=isW(p[0],p[1]);return{id,n,x:w[0],z:w[1]};});
  // the real island's ground before it is built: the Settlement keeps its own coast, everywhere else the real coast
  const PL=ISL.plat[0],PD=islPlatD(PL),PC=[PL.x+PD[0],PL.z+PD[1]];
  const gA=(X,Z)=>{const r=Math.hypot(X-PC[0],Z-PC[1]);if(r<PL.R+PL.T){const f=islandF(X-PD[0],Z-PD[1])/.08;const ph=isPhi(PL,r);return f*ph+rislD(X,Z)*(1-ph);}return rislD(X,Z);};
  const inland=(X,Z,want)=>{let d=gA(X,Z);for(let i=0;i<40&&d<want;i++){const h=.4,gx=gA(X+h,Z)-gA(X-h,Z),gz=gA(X,Z+h)-gA(X,Z-h),g=Math.hypot(gx,gz)||1;X+=gx/g*.4;Z+=gz/g*.4;d=gA(X,Z);}return[X,Z];};
  // the loop goes west along the north side of the island and comes back east along the south side, like the real bus
  const side=s=>{const [tp,bt]=rislCol(rislPXof(s.x));return s.z<(tp+bt)/2?0:1;};
  const first=stops[0],rest=stops.slice(1);const north=rest.filter(s=>side(s)===0).sort((a,b)=>a.x-b.x),south=rest.filter(s=>side(s)===1).sort((a,b)=>b.x-a.x);
  const order=[first].concat(north,south);const loop=order.concat([first]);const road=[];
  for(let i=0;i<loop.length-1;i++){const a=loop[i],b=loop[i+1];road.push([a.x,a.z,a.id]);const L=Math.hypot(b.x-a.x,b.z-a.z),n=Math.ceil(L/2.2);
    for(let k=1;k<n;k++){const t=k/n;let x=lerp(a.x,b.x,t),z=lerp(a.z,b.z,t);if(gA(x,z)<2.4){const p=inland(x,z,2.6);x=p[0];z=p[1];}road.push([x,z]);}}
  road.push([first.x,first.z]);
  XPL.route=road.map(([x,z,id],i)=>{if(id&&XPL.idx[id]==null)XPL.idx[id]=i;return[x,z];});
  XPL.stops=order.map(o=>{const i=XPL.idx[o.id],p=XPL.route[i];return{id:o.id,name:o.n,x:p[0],z:p[1]};});
  // paint the loop road (skips the Settlement, which has its own lanes)
  const keep=[];XPL.route.forEach(p=>{if(Math.hypot(p[0]-IWx(0,0),p[1]-IWz(0,0))>16)keep.push(p.slice());else if(keep.length){PATHS.push(keep.splice(0));}});if(keep.length>1)PATHS.push(keep);
  COACH.length=0;XPL.stops.forEach(s=>COACH.push(s));COACH_ROUTE.length=0;XPL.route.forEach(p=>COACH_ROUTE.push(p));Object.keys(COACH_IDX).forEach(k=>delete COACH_IDX[k]);Object.assign(COACH_IDX,XPL.idx);});
ISL.late.push(()=>{(window.__coachMeshes||[]).forEach(m=>{scene.remove(m);});
  const poleM=new THREE.MeshLambertMaterial({color:0x1f5fae}),busT=makeSign(['BUS'],24,24,'#1f5fae','#ffffff');
  // stops close together share ONE sign (the stops themselves stay separate for riding)
  let grp=[];XPL.stops.forEach((b,i)=>{const hit=grp.filter(g=>g.some(o=>Math.hypot(o.b.x-b.x,o.b.z-b.z)<10));grp=grp.filter(g=>!hit.includes(g));grp.push([].concat(...hit,[{b,i}]).sort((p,q)=>p.i-q.i));});
  grp.forEach(g=>{const b=g[0].b,i=g[0].i,many=g.length>1;const sx=b.x+.9,sz=b.z-.9;const p=box(.1,2.2,.1,poleM,sx,1.1,sz);const s=new THREE.Mesh(new THREE.PlaneGeometry(.75,.75),new THREE.MeshBasicMaterial({map:busT,side:THREE.DoubleSide}));s.position.set(sx,2,sz+.06);scene.add(s);
    const nt=many?makeSign(['STOP '+g.map(o=>o.i+1).join(' · ')].concat(g.map(o=>o.b.name.toUpperCase())),112,10*(g.length+1),'#f5ecd8','#1f5fae'):makeSign(['STOP '+(i+1),b.name.toUpperCase()],64,20,'#f5ecd8','#1f5fae');const n=new THREE.Mesh(new THREE.PlaneGeometry(many?2.1:1.25,many?.19*(g.length+1):.4),new THREE.MeshLambertMaterial({map:nt,side:THREE.DoubleSide,emissive:0x222222,emissiveMap:nt}));n.position.set(sx,many?1.62-.095*(g.length+1):1.45,sz+.07);scene.add(n);col(sx-.1,sz-.1,sx+.1,sz+.1);XPL.meshes.push(p,s,n);});
  // keep the new loop road clear of trees and grass
  for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(t.x<99.5&&pathD(t.x,t.z)<1.4){scene.remove(t.m);const bi=BB.indexOf(t.m);if(bi>=0)BB.splice(bi,1);for(let c=colliders.length-1;c>=0;c--){const C=colliders[c];if(Math.abs((C.x1+C.x2)/2-t.x)<.05&&Math.abs((C.z1+C.z2)/2-t.z)<.05){colliders.splice(c,1);break;}}trees.splice(i,1);}}
  for(let i=BB.length-1;i>=0;i--){const m=BB[i];if(m.parent!==scene||m.userData.frames||m.position.x>=99.5||!DECOR_MATS.has(m.material))continue;if(pathD(m.position.x,m.position.z)<1)scene.remove(m),BB.splice(i,1);}});
// ride the loop the short way round
function coachRide(from,to){const a=COACH_IDX[from],b=COACH_IDX[to];if(a==null||b==null)return;const R=COACH_ROUTE,n=R.length-1;
  const fw=[],bw=[];for(let i=a;;i=(i+1)%n){fw.push(R[i]);if(i===b)break;}for(let i=a;;i=(i-1+n)%n){bw.push(R[i]);if(i===b)break;}
  const len=P=>{let s=0;for(let i=0;i<P.length-1;i++)s+=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1]);return s;};const pts=len(fw)<=len(bw)?fw:bw;
  if(!coachMesh){coachMesh=window.__busProto.clone();coachMesh.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHex()===0x2f9a5a){o.material=o.material.clone();o.material.color.set('#1f5fae');}});scene.add(coachMesh);}
  coachMesh.visible=true;toast('All aboard the Island Loop bus! · '+FARE_RIDE+' coins',2.2);startCine();rideAlong(pts,coachMesh,11,()=>{coachMesh.visible=false;const B=COACH.find(q=>q.id===to);player.x=B.x;player.z=B.z+.8;S.qg=S.qg||{};S.qg['coach_'+to]=1;save();toast('Arrived: '+B.name,2);},.12);}
function coachMinutes(from,to){const a=COACH_IDX[from],b=COACH_IDX[to],R=COACH_ROUTE,n=R.length-1;if(a==null||b==null)return 0;let f=0,i=a;while(i!==b){const j=(i+1)%n;f+=Math.hypot(R[j][0]-R[i][0],R[j][1]-R[i][1]);i=j;}let L=0;for(let k=0;k<n;k++)L+=Math.hypot(R[k+1][0]-R[k][0],R[k+1][1]-R[k][1]);return Math.max(2,Math.round(Math.min(f,L-f)*.12));}
