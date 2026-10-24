// ---------- Perth CBD: fill the empty corners (same Look Lab layer: ?lab, ?freo or ?city) ----------
// A fountain square by Barrack St with a Victorian corner hotel, a Victorian arcade in the gap on St Georges Tce,
// festoon lights strung over Hay St Mall, a flower garden on the riverside walk, and a stone fountain with flower beds
// and benches in Kings Park. Windows, bulbs and halos glow after dark.
if(FDET.on&&FREO2_ON&&FDET.city&&FDET.vic)(()=>{const G=FDET.city;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(...o.s);}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||12);
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const texM=(W,H,draw,rep,o)=>new THREE.MeshLambertMaterial(Object.assign({map:tex(W,H,draw,rep)},o||{}));
  const paint=(w,d,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const disc=(r,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.CircleGeometry(r,24),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const r=mulberry32(1901),pick=a=>a[(r()*a.length)|0];
  const glow=FDET.glow3,halo=(x,y,z,s)=>FDET.halo3(x,y,z,s,G);
  const sprMat=c=>{const t=ctex(c);return{m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};};
  const bb=(v,x,z,w,h,tree)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);G.add(m);BB.push(m);if(tree)trees.push({x,z,m,v:{...v,f:v.f||v.m},fade:false});return m;};
  const bushB=()=>{const b=[];for(let i=0;i<4;i++)b.push([8+(r()-.5)*8,6+(r()-.5)*2,3.5+r()*2]);return b;};
  const flowerBush=cols=>sprMat((()=>{const c=canopy(16,10,bushB(),TREE_COLS[1],r,null),x=c.getContext('2d');for(let i=0;i<14;i++){const fx=1+r()*14|0,fy=1+r()*7|0;if(!x.getImageData(fx,fy,1,1).data[3])continue;x.fillStyle=pick(cols);x.fillRect(fx,fy,1,1);}return c;})());
  const FLOWERS=[flowerBush(['#d8323a','#f04a5a']),flowerBush(['#f6d84a','#ffe880']),flowerBush(['#9a6ad8','#c8a0f0']),flowerBush(['#f6f2e8','#ffc0d0'])];
  const bench=(x,z,ry)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry||0;G.add(g);put(B(1,.06,.34),M('#7a5a3a'),0,.42,0,null,g);put(B(1,.3,.05),M('#7a5a3a'),0,.6,-.15,null,g);[-.42,.42].forEach(o=>put(B(.06,.42,.34),M('#2a2a30'),o,.21,0,null,g));const s=Math.abs(Math.sin(ry||0))>.5;col(x-(s?.2:.5),z-(s?.5:.2),x+(s?.2:.5),z+(s?.5:.2));};
  const lamp=(x,z,h)=>{h=h||2.7;put(C(.04,.06,h,6),M('#2e3236'),x,h/2,z);put(new THREE.SphereGeometry(.13,8,6),glow('#f6efd8','#ffe2a0'),x,h+.08,z,{nc:1});halo(x,h+.08,z,1.6);col(x-.08,z-.08,x+.08,z+.08);};
  // a tiered stone fountain with animated spray
  const JETS=[];
  function fountain(x,z,R){const stone=M('#d8d0bc'),water=new THREE.MeshLambertMaterial({color:0x5cb8d8,transparent:true,opacity:.85});
    put(C(R,R+.08,.4,24),stone,x,.2,z);put(C(R-.12,R-.12,.05,24),water,x,.38,z,{nc:1});
    put(C(.18,.24,1.1,10),stone,x,.9,z);put(C(.6,.4,.16,16),stone,x,1.45,z);put(C(.5,.5,.04,16),water,x,1.53,z,{nc:1});put(C(.08,.12,.5,8),stone,x,1.75,z);put(C(.28,.18,.1,12),stone,x,2.0,z);
    const sprayM=new THREE.MeshBasicMaterial({color:0xd8f4ff,transparent:true,opacity:.75});
    for(let k=0;k<10;k++){const a=k/10*Math.PI*2;const d=put(new THREE.SphereGeometry(.05,5,4),sprayM,x,2,z,{nc:1});JETS.push({m:d,x,z,a,ph:k/10,r1:.55,y0:2.05});}
    for(let k=0;k<14;k++){const a=k/14*Math.PI*2;const d=put(new THREE.SphereGeometry(.045,5,4),sprayM,x,1.5,z,{nc:1});JETS.push({m:d,x,z,a,ph:k/14,r1:R-.25,y0:1.5});}
    halo(x,.6,z,R*2.2);col(x-R,z-R,x+R,z+R);}

  // ===== Barrack St fountain square: paved circle, fountain, benches, flower beds, two trees, lamps =====
  {const cx=673.2,cz=2.1;paint(6.8,3.6,texM(8,8,(x)=>{x.fillStyle='#d8d2c4';x.fillRect(0,0,8,8);x.fillStyle='#c8c0b0';for(let j=0;j<8;j+=2)for(let i=(j%4?1:0);i<8;i+=2)x.fillRect(i,j,1,1);},[7,4]),cx,cz,.029);
    disc(1.75,'#b8a890',cx,cz,.031);disc(1.6,'#d8d0bc',cx,cz,.032);fountain(cx,cz,1.05);
    bench(cx-2.6,cz,Math.PI/2);bench(cx+2.6,cz,-Math.PI/2);
    [[cx-2.8,cz-1.4],[cx+2.8,cz-1.4],[cx-2.8,cz+1.45],[cx+2.8,cz+1.45]].forEach(([x,z],i)=>{put(B(.9,.3,.6),M('#8a7a64'),x,.15,z);bb(FLOWERS[i%4],x,z,.95,.6);col(x-.45,z-.3,x+.45,z+.3);});
    lamp(cx-3.2,cz+1.95);lamp(cx+3.2,cz+1.95);CBD.P.fountainsq={x:cx,z:cz+2};}
  // ===== a Victorian corner hotel facing the square, iron-lace verandah wrapping round the side =====
  FDET.vic(681,1.3,6.6,2,{parent:G,name:'THE WATTLE ARMS · 1896',kind:'pub',col:'#e8d8b0',trim:'#f6f2e8',signBg:'#5a2a2a',signFg:'#f6e8c8',wrap:'w',iron:'#1c1c1e',lamps:1});
  // ===== a Victorian arcade in the gap on St Georges Tce =====
  FDET.vic(634.6,-8.7,5.6,3,{parent:G,name:'TERRACE ARCADE · 1898',kind:'books',col:'#d8b890',trim:'#f2e8d4',signBg:'#2c4a3a',signFg:'#f6e8c8',iron:'#2c4a3a',lamps:1});
  // ===== Hay St Mall: festoon lights zig-zagging the whole length, planters on the posts =====
  {const string=(ax,az,bx,bz,y,n)=>{for(let k=0;k<=n;k++){const t=k/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t,yy=y-Math.sin(t*Math.PI)*.35;put(new THREE.SphereGeometry(.05,6,4),glow('#e8e0c8',pick(['#ffd890','#ffe8b0','#ffc070'])),x,yy,z,{nc:1});if(k%3===1)halo(x,yy,z,.7);}
      const L=new THREE.Line(new THREE.BufferGeometry().setFromPoints([...Array(n+1)].map((_,k)=>{const t=k/n;return new THREE.Vector3(ax+(bx-ax)*t,y-Math.sin(t*Math.PI)*.35+.04,az+(bz-az)*t);})),new THREE.LineBasicMaterial({color:0x2a2a2a}));G.add(L);};
    const XS=[];for(let x=623.5;x<699;x+=5){if(Math.abs(x-639.1)<2||Math.abs(x-667.3)<2)continue;XS.push(x);}
    XS.forEach(x=>[-14.85,-12.15].forEach(z=>{put(C(.04,.05,3.1,6),M('#2e3236'),x,1.55,z);col(x-.06,z-.06,x+.06,z+.06);}));
    for(let i=0;i<XS.length-1;i++){if(XS[i+1]-XS[i]>6)continue;string(XS[i],-14.85,XS[i+1],-12.15,3.0,9);string(XS[i],-12.15,XS[i+1],-14.85,3.0,9);}}
  // ===== a flower garden along the riverside walk =====
  {paint(15.2,1,lmat(grassC,[5,1]),630.8,7.9,.026);for(let x=623.6;x<638.4;x+=1.15)bb(FLOWERS[(x*7|0)%4],x,7.9,.9,.55);col(623.2,7.45,638.4,8.35);}
  // ===== Kings Park: a stone fountain in a round of flower beds, benches and lamps =====
  {const cx=609.5,cz=-2.5;disc(3,lmat(grassC,[2,2]),cx,cz,.028);disc(2.6,'#d8cfb8',cx,cz,.03);fountain(cx,cz,1.25);
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2+.2,x=cx+Math.cos(a)*2.25,z=cz+Math.sin(a)*2.25;if(k%2){bb(FLOWERS[k%4],x,z,1,.62);col(x-.3,z-.3,x+.3,z+.3);}else bench(x,z,-a+Math.PI/2);}
    lamp(cx-3.2,cz-2.2);lamp(cx+3.2,cz+2.2);CBD.P.kpfountain={x:cx,z:cz+2.8};
    [[605,-22],[612,-20.5],[606,-15.5],[614,-17],[604,5.2],[615,5.5]].forEach(([x,z],i)=>{for(let k=0;k<3;k++)bb(FLOWERS[(i+k)%4],x+k*.8-.8,z+(k%2)*.4,.95,.6);col(x-1.3,z-.3,x+1.3,z+.7);});}
  // ===== tick: fountain spray, night lights in the city =====
  CBD.cityFillTick=function(){if(!G.visible)return;const t=performance.now()/1000;for(const j of JETS){const p=(t*.9+j.ph)%1;const rr=j.r1*p;j.m.position.set(j.x+Math.cos(j.a)*rr,j.y0+Math.sin(p*Math.PI)*.45-p*p*.35,j.z+Math.sin(j.a)*rr);}if(FDET.night3)FDET.night3();};
})();
if(typeof CBD!=='undefined'&&CBD.cityFillTick){const _zt=zoneTick;zoneTick=function(dt,t){_zt(dt,t);if(zoneOf(player.x)==='cbd'||(typeof LAB!=='undefined'&&LAB.on))CBD.cityFillTick();};}
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
