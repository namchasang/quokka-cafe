})();
// traffic, lights and night glow
CDET.tick=function(dt){if(!CDET.on||!CDET.g||!CDET.g.visible)return;const now=performance.now();if(now-CDET.last<4)return;CDET.last=now;dt=Math.min(dt||0,.1);
  const sg=CDET.sig;sg.t=(sg.t+dt)%18;const t=sg.t,EWg=t<8,EWa=t>=8&&t<9.5,NSg=t>=10.5&&t<16,NSa=t>=16&&t<17;
  if(sg.m){const set=(A,g,a)=>{A[0].color.setHex(!g&&!a?0xff3b30:0x3a1414);A[1].color.setHex(a?0xffb020:0x3a2a10);A[2].color.setHex(g?0x30e060:0x103a1a);};set(sg.m.EW,EWg,EWa);set(sg.m.NS,NSg,NSa);}
  if(CDET.clock&&typeof S!=='undefined'){const m=S.time%60,h=(S.time/60)%12;CDET.clock[0].rotation.z=-h/12*6.283;CDET.clock[1].rotation.z=-m/60*6.283;}
  const n=typeof NIGHT==='number'?NIGHT:0;CDET.glow.forEach(([m,d,k])=>m.color.copy(d).lerp(k,n));CDET.halos.forEach(h=>h.material.opacity=n*.85);CDET.em.forEach(m=>m.emissive.setScalar(n*1.1));
  const V=CDET.veh,people=[player];if(typeof walkers!=='undefined')for(const w of walkers)if(w.m.visible)people.push(w);
  // who is in front of whom (crossing cars use their length as width); two cars that block each other: the older one goes
  for(const c of V){c.blk=[];if(c.id==null)c.id=CDET.nid=(CDET.nid||0)+1;for(const o of V){if(o===c)continue;const dot=o.dx*c.dx+o.dz*c.dz;if(dot<-.7)continue;const ex=o.x-c.x,ez=o.z-c.z;const al=ex*c.dx+ez*c.dz;if(al<=0||al>4)continue;
      const la=Math.abs(-ex*c.dz+ez*c.dx),pp=Math.abs(dot)<.6;if(la<c.wid/2+(pp?o.len:o.wid)/2+.08){const need=c.len/2+(pp?o.wid:o.len)/2+.35;c.blk.push({o,lim:Math.max(0,(al-need)*2.2)});}}}
  for(const c of V){let tg=c.vmax;const front=c.s+c.len/2;
    for(const st of c.R.stops){const d=st.s-front;if(d>-.05&&d<2.4){const g=st.axis==='EW'?EWg:NSg,a=st.axis==='EW'?EWa:NSa;if(!g&&!(a&&d<.7))tg=Math.min(tg,Math.max(0,(d-.12)*2.2));}}
    if(c.kind==='bus'&&c.R.busS!=null&&!c.served){const d=c.R.busS-c.s;if(d<2.5&&d>-.2){tg=Math.min(tg,Math.max(0,d*1.4));if(d<.25&&c.v<.2){c.served=true;c.dwell=3.5;}}}
    if(c.dwell>0){c.dwell-=dt;tg=0;}
    let carBlock=false;
    if(c.ghost>0)c.ghost-=dt;else for(const b of c.blk){if(b.o.blk.some(q=>q.o===c)&&c.id<b.o.id)continue;if(b.lim<tg){tg=b.lim;carBlock=b.o.dx*c.dx+b.o.dz*c.dz<.7;}}
    for(const p of people){const ex=p.x-c.x,ez=p.z-c.z;const al=ex*c.dx+ez*c.dz;if(al<=0||al>c.len/2+1.7)continue;if(Math.abs(-ex*c.dz+ez*c.dx)<c.wid/2+.4)tg=Math.min(tg,Math.max(0,(al-c.len/2-.45)*2.4));}
    c.wait=(carBlock&&c.v<.05)?c.wait+dt:0;if(c.wait>8){c.ghost=1.2;c.wait=0;}
    c.v+=Math.max(-7*dt,Math.min(2.2*dt,tg-c.v));c.s+=c.v*dt;}
  for(let i=V.length-1;i>=0;i--){const c=V[i];if(c.s>=c.R.L-.05){c.g.parent&&c.g.parent.remove(c.g);V.splice(i,1);continue;}
    let i2=1;const R=c.R;while(i2<R.S.length-1&&R.S[i2]<c.s)i2++;const a=R.P[i2-1],b=R.P[i2],u=(c.s-R.S[i2-1])/Math.max(1e-6,R.S[i2]-R.S[i2-1]);let dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;
    c.dx=dx/l;c.dz=dz/l;c.x=a[0]+dx*u;c.z=a[1]+dz*u;c.g.position.set(c.x,0,c.z);c.g.rotation.y=Math.atan2(-c.dz,c.dx);const k=Math.max(0,Math.min(1,Math.min(c.s,R.L-c.s)/1.3));c.g.scale.setScalar(k);c.g.visible=k>.02;
    const ex=player.x-c.x,ez=player.z-c.z,al=ex*c.dx+ez*c.dz,la=-ex*c.dz+ez*c.dx,hw=c.wid/2+.25;if(k>.5&&Math.abs(al)<c.len/2+.15&&Math.abs(la)<hw){const dl=(la<0?-hw:hw)-la;player.x+=dl*-c.dz;player.z+=dl*c.dx;}}
  // new cars come in from the edges of the map
  for(const R of CDET.routes||[]){R.t-=dt;if(R.t>0)continue;R.t=(R.bike?5:3.5)+Math.random()*6;const cnt=V.filter(v=>v.R===R).length;if(cnt>=R.n+1)continue;
    const q0=R.P[0];if(V.some(v=>Math.hypot(v.x-q0[0],v.z-q0[1])<3))continue;CDET.spawn(R,0);}};

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
