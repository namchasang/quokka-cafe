// ---------- Fremantle opened up (Look Lab ?lab or ?freo4, Paul Oct 2026: as easy to walk as the city) ----------
// The southern streets, back lane and cross streets become walkable, and thin posts (verandah posts, poles, bollards) stop blocking the footpaths.
var FREO4_LIVE=false;const FREO4_ON=FREO4_LIVE||/[?&#](lab|freo4)\b/.test(location.search+location.hash);
if(FREO4_ON&&FDET.on&&FHOMES_ON){
  const R=[[270,356,21.4,28.1],[270,356,38.7,42.9],[272,355.5,32.8,34.05],[302.6,305.4,21.4,42.9],[318.6,321.4,21.4,42.9],[334.8,337.6,21.4,42.9]];
  const _fw4=freoWalk;freoWalk=function(x,z){if(_fw4(x,z))return true;return R.some(r=>x>r[0]&&x<r[1]&&z>r[2]&&z<r[3]);};
  for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];if(c.x2<262||c.x1>362||c.z2<-30||c.z1>50)continue;if(c.x2-c.x1<=.32&&c.z2-c.z1<=.32)colliders.splice(i,1);}
  if(typeof FB!=='undefined'){FB.z2=Math.max(FB.z2,43.6);FB.x2=Math.max(FB.x2,357);}// the town wall goes round the new streets too
}
// keep the layer hidden away from Fremantle (and on the title screen), like the city layer
if(FDET.on&&FDET.g){FDET.g.visible=false;}

// last check on the real-shaped island: every action spot and fishing spot must be reachable on foot
islandLate(()=>{const fix=o=>{if(o&&typeof o.x==='number'&&o.x<99.5&&blocked(o.x,o.z)){const p=freeNear(o.x,o.z);o.x=p[0];o.z=p[1];}};
  [WB.acts,WC.acts,LK.acts,P8.acts,WA.plaques||[],WA.npcs||[]].forEach(L=>L.forEach(fix));FISH_SPOTS.forEach(f=>{if(f.zone==='island')fix(f);});['golf','armyjetty','airport'].forEach(k=>fix(WA[k]));});
// one repaint at the end, after every wave has changed the ground
islandLate(()=>{islRepaint();});

// everything that remembers an island position in numbers moves with it
ISL.data=[()=>{
  [LOTS.bikes,LOTS.ice,LOTS.beach,HAMMOCK,HUT,HB,VILLAGE,VILLAGE_ELDER,REG,MUSEUM,BOARD,MAILBOX,GSTORE,STAR_SPOT,player,gus,wren].forEach(o=>iwO(o));
  [DECK,JETTY,GARDEN,LAND].forEach(iwR);
  LORE.forEach(o=>iwO(o));SHELLS.forEach(o=>iwO(o));PLOTS.forEach(o=>iwO(o));SEATS.forEach(o=>iwO(o));STAFF_HOME.forEach(h=>{const w=IW(h[0],h[1]);h[0]=w.x;h[1]=w.z;});STATIONS.forEach(o=>iwO(o));COACH.forEach(o=>iwO(o));
  for(let i=0;i<JX1.length;i++)JX1[i]=IWx(JX1[i],5);DOCKS.forEach(iwP);STRAND_SPOTS.forEach(iwP);STAFF_HOME.forEach(iwP);
  COACH_ROUTE.forEach(iwP);SAFE_SPOTS.island.forEach(iwP);SIGHTS.forEach(o=>iwO(o));LAMPS.forEach(o=>iwO(o));
  FISH_SPOTS.forEach(f=>{if(f.zone==='island')iwO(f);});BRANCHES.forEach(b=>{if(b.zone==='island')iwO(b);});PROP_LIST.forEach(P=>{if(P.zone==='island')iwO(P);});
  FESTIVALS.forEach(f=>{if(f.where==='island')iwP(f.spot);});
  WALK_ROUTES.island.forEach(iwPts);walkers.forEach(w=>{if(w.zone==='island')iwO(w);});
  TITLE_SHOTS.forEach(t=>{const w=IW(t[0],t[2]);t[0]=w.x;t[2]=w.z;});MAP_LABELS.forEach(l=>{const w=IW(l[1],l[2]);l[1]=w.x;l[2]=w.z;});
  wilds.forEach(q=>{const w=IW(q.hx,q.hz),dx=w.x-q.hx,dz=w.z-q.hz;q.hx+=dx;q.hz+=dz;q.x+=dx;q.z+=dz;q.tx+=dx;q.tz+=dz;});
  trees.forEach(t=>{if(t.x<99.5){t.x=t.m.position.x;t.z=t.m.position.z;}});snorks.forEach(o=>iwO(o));
  WEST.boats.forEach(o=>iwO(o));WEST.snork.forEach(o=>iwO(o));
  {const w=IW(-10,1);ISL.D0={x:w.x+10,z:w.z-1};}
}];
// bike lanes and the railway are re-laid on the bigger island
ISL.late.push(()=>{
  {// fit the whole real island: width or height, whichever needs more room
  const x1=TB.x1+4,x2=TB.x2-2,z1=TB.z1+6,z2=TB.z2-6,xc=(x1+x2)/2,zc=(z1+z2)/2;let hw=(x2-x1)/2,hh=hw*mmH/mmW;if(hh<(z2-z1)/2){hh=(z2-z1)/2;hw=hh*mmW/mmH;}MM.x1=xc-hw;MM.x2=xc+hw;MM.z1=zc-hh;MM.z2=zc+hh;}
  wilds.forEach(q=>{if(q.hx<99.5&&blocked(q.hx,q.hz)){const f=freeNear(q.hx,q.hz),dx=f[0]-q.hx,dz=f[1]-q.hz;q.hx+=dx;q.hz+=dz;q.x+=dx;q.z+=dz;q.tx=q.hx;q.tz=q.hz;}});
  for(let i=BLANES.length-1;i>=0;i--)if(BLANES[i][0][0]<99.5&&BLANES[i].__isl)BLANES.splice(i,1);
  (ISL.strips||[]).forEach(r=>{r.meshes.forEach(m=>{scene.remove(m);m.geometry.dispose();});const a=IW(r.a[0],r.a[1]),b=IW(r.b[0],r.b[1]);laneStrip([a.x,a.z],[b.x,b.z],r.w,r.icons,r.y);});
  if(ISL.rail){ISL.rail.meshes.forEach(m=>{scene.remove(m);m.geometry.dispose();});const R0=ISL.rail.pts.map(([x,z])=>{const w=IW(x,z);return[w.x,w.z];});
    // the warp can swing the straight track through buildings (it ran through the lighthouse): lay it in short steps and bend it round them
    let R=[];for(let i=0;i<R0.length-1;i++){const[ax,az]=R0[i],[bx,bz]=R0[i+1],n=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)/1.5));for(let k=0;k<n;k++)R.push([ax+(bx-ax)*k/n,az+(bz-az)*k/n]);}R.push(R0[R0.length-1].slice());
    const ends=[R[0],R[R.length-1]],obs=colliders.filter(c=>{const w=c.x2-c.x1,d=c.z2-c.z1;return w>.6&&d>.6&&w<9&&d<9&&!ends.some(([x,z])=>x>c.x1-1.5&&x<c.x2+1.5&&z>c.z1-1.5&&z<c.z2+1.5);}).map(c=>({x:(c.x1+c.x2)/2,z:(c.z1+c.z2)/2,r:Math.hypot(c.x2-c.x1,c.z2-c.z1)/2+1.1}));
    const push=()=>{for(let i=1;i<R.length-1;i++)for(const o of obs){const dx=R[i][0]-o.x,dz=R[i][1]-o.z,d=Math.hypot(dx,dz);if(d<o.r){const k=d>1e-3?o.r/d:1;R[i]=[o.x+(d>1e-3?dx:1)*k,o.z+(d>1e-3?dz:0)*k];}}};
    for(let it=0;it<14;it++){push();const Q=R.map(p=>p.slice());for(let i=1;i<R.length-1;i++)Q[i]=[(R[i-1][0]+R[i][0]*2+R[i+1][0])/4,(R[i-1][1]+R[i][1]*2+R[i+1][1])/4];R=Q;}push();for(let it=0;it<3;it++){const Q=R.map(p=>p.slice());for(let i=1;i<R.length-1;i++)Q[i]=[(R[i-1][0]+R[i][0]*2+R[i+1][0])/4,(R[i-1][1]+R[i][1]*2+R[i+1][1])/4];R=Q;}
    ISL.rail.meshes=ISL.rail.build(R);WEST.rail=R;}
  // more street lights along the longer paths
  if(ISL.lamp)for(const P of PATHS)for(let i=0;i<P.length-1;i++){const [ax,az]=P[i],[bx,bz]=P[i+1];if(ax>=99.5)continue;const L=Math.hypot(bx-ax,bz-az);if(L<.1)continue;const nx=-(bz-az)/L,nz=(bx-ax)/L;
    for(let d=1.5;d<L;d+=7){const t=d/L,px=ax+(bx-ax)*t,pz=az+(bz-az)*t;for(const s of [1,-1]){const x=px+nx*1.15*s,z=pz+nz*1.15*s;if(landD(x,z)>.9&&pathD(x,z)>.9){ISL.lamp(x,z);break;}}}}
});
