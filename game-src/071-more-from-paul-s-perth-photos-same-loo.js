// ---------- More from Paul's Perth photos (same Look Lab layer as Fremantle detail: ?lab or ?freo) ----------
// Fremantle: the long limestone cell block inside the prison walls, palms on the rise behind it.
// City: a red-brick town hall with a clock tower and corner turrets on Barrack St, a sandstone colonnade for the museum,
// a glass footbridge from the station over Wellington St, and a stone obelisk at the Kings Park lookout.
if(FDET.on)(()=>{const G=FDET.g;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const findGroup=(x,z)=>scene.children.find(o=>o.isGroup&&Math.abs(o.position.x-x)<.05&&Math.abs(o.position.z-z)<.05);
  const hide=o=>{if(o){o.visible=false;FDET.hid.push(o);}};
  // a second group for the city, shown only in the city
  const C2=new THREE.Group();C2.name='cityRefs';scene.add(C2);FDET.city=C2;C2.visible=false;

  // ===== Fremantle Prison: a four-storey limestone cell block with rows of small barred windows =====
  {hide(findGroup(325,3));const lime=new THREE.MeshLambertMaterial({map:tex(16,16,(x)=>{x.fillStyle='#e8e0cc';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=4)for(let i=(j%8?3:0);i<16;i+=6){x.fillStyle=['#ddd3bc','#f0e8d6','#d8ceb6'][(i+j)%3];x.fillRect(i,j,5,3);}},[6,3])});
    const cell=new THREE.MeshLambertMaterial({map:tex(8,8,(x)=>{x.fillStyle='#e8e0cc';x.fillRect(0,0,8,8);x.fillStyle='#2a2a30';x.fillRect(3,3,2,2);},[14,4])});
    const g=new THREE.Group();g.position.set(325,0,3.4);G.add(g);
    put(B(9.6,4.4,3),lime,0,2.2,0,null,g);
    const front=new THREE.Mesh(new THREE.PlaneGeometry(9.6,4.2),cell);front.position.set(0,2.2,1.51);g.add(front);
    put(B(9.6,.5,3.1),M('#f0eadc'),0,.25,0,null,g);
    const roof=new THREE.Mesh(new THREE.CylinderGeometry(.01,1.9,1,4,1),M('#a8acb0'));roof.rotation.y=Math.PI/4;roof.scale.set(3.7,1,1.15);roof.position.set(0,4.9,0);roof.castShadow=true;g.add(roof);
    [-3,0,3].forEach(x=>{put(B(.5,.5,.5),M('#c8c8c4'),x,5.35,0,null,g);});
    // chapel end with a pediment and tall arched windows
    put(B(2.4,4.8,3.4),lime,-5.8,2.4,0,null,g);{const sh=new THREE.Shape();sh.moveTo(-1.3,0);sh.lineTo(1.3,0);sh.lineTo(0,1);sh.lineTo(-1.3,0);const p=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:3.4,bevelEnabled:false}),lime);p.position.set(-5.8,4.8,-1.7);g.add(p);}
    for(let i=0;i<2;i++){put(B(.45,1.2,.05),M('#3a4250'),-6.3+i*1,3.2,1.72,{nc:1},g);put(new THREE.CircleGeometry(.23,10,0,Math.PI),M('#3a4250'),-6.3+i*1,3.8,1.72,{nc:1},g);}
    col(319.4,1.7,331,5.1);
    // palms on the grass by the walls
    const pc=(()=>{const W=24,H=48,c=mk(W,H),x=c.getContext('2d');for(let y=15;y<H;y++){for(let i=0;i<4;i++){x.fillStyle=(y%3===0)?'#5a4a38':i===0?'#5e503c':i===3?'#6e604c':'#8a7a62';x.fillRect(10+i,y,1,1);}}x.fillStyle='#6a5a40';x.fillRect(10,13,4,3);const FR=TREE_COLS[1];const rr=mulberry32(55);
      for(let k=0;k<14;k++){const a=-Math.PI+k/13*Math.PI,len=9+rr()*3;for(let t=0;t<=1;t+=.05){const px=12+Math.cos(a)*len*t,py=14+Math.sin(a)*len*t*.55+t*t*7*Math.abs(Math.cos(a));x.fillStyle=FR[t<.2?0:t>.7?3:1+(k%2)];x.fillRect(Math.round(px),Math.round(py),1,1);x.fillStyle=FR[0];x.fillRect(Math.round(px),Math.round(py)+1,1,1);}}return c;})();
    const t=ctex(pc);const pv={m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};
    [[333,-2],[333.4,4],[333,10]].forEach(([x,z])=>{const pg=new THREE.PlaneGeometry(2.6,5.2);pg.translate(0,2.6,0);const m=new THREE.Mesh(pg,pv.m);m.customDepthMaterial=pv.d;m.castShadow=true;m.position.set(x,0,z);G.add(m);BB.push(m);col(x-.2,z-.2,x+.2,z+.2);});}

  // ===== Town Hall on Barrack St: red brick, cream trim, a clock tower with a slate spire and corner turrets =====
  {const x0=662.3,z0=-17.6,brick=new THREE.MeshLambertMaterial({map:tex(16,16,(x)=>{x.fillStyle='#b05a3a';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=2)for(let i=(j%4?2:0);i<16;i+=4){x.fillStyle=['#c0683e','#a8502e','#c87048'][(i+j)%3];x.fillRect(i,j,3,1);}x.fillStyle='#d8b898';for(let j=1;j<16;j+=2)x.fillRect(0,j,16,1);},[3,3])});
    const g=new THREE.Group();g.position.set(x0,0,z0);C2.add(g);const cream=M('#f2ead8'),slate=M('#3a3a42');
    put(B(4.2,4.2,2.8),brick,.6,2.1,0,null,g);
    for(let i=0;i<3;i++){put(B(.6,1.2,.05),M('#2a2a30'),-.5+i*1.1,1,1.41,{nc:1},g);put(new THREE.CircleGeometry(.3,10,0,Math.PI),M('#2a2a30'),-.5+i*1.1,1.6,1.41,{nc:1},g);put(B(.5,1.3,.05),M('#6a3a2e'),-.5+i*1.1,3,1.41,{nc:1},g);}
    [1,2.5,4.1].forEach(y=>put(B(4.3,.12,2.9),cream,.6,y,0,{nc:1},g));
    {const sh=new THREE.Shape();sh.moveTo(-1.4,0);sh.lineTo(1.4,0);sh.lineTo(0,1.6);sh.lineTo(-1.4,0);const gb=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:2.8,bevelEnabled:false}),brick);gb.position.set(.9,4.2,-1.4);gb.castShadow=true;g.add(gb);put(new THREE.CircleGeometry(.35,14),cream,.9,4.8,1.41,{nc:1},g);}
    put(B(2.2,1.4,3),slate,.9,4.85,0,null,g);
    [[2.75,1.35],[2.75,-1.35]].forEach(([x,z])=>{put(new THREE.CylinderGeometry(.25,.25,4.6,10),brick,x,2.3,z,null,g);put(new THREE.ConeGeometry(.3,.8,10),cream,x,5,z,null,g);});
    // the clock tower on the corner
    const tx=-1.6;put(B(1.4,7,1.4),brick,tx,3.5,0,null,g);[2,4,5.5,6.9].forEach(y=>put(B(1.5,.12,1.5),cream,tx,y,0,{nc:1},g));
    for(const s of[[0,.71,0],[.71,0,Math.PI/2]]){const f=new THREE.Mesh(new THREE.CircleGeometry(.42,18),M('#f6f2e8'));f.position.set(tx+s[0],6.2,s[1]);f.rotation.y=s[2];g.add(f);const h=new THREE.Mesh(B(.04,.3,.01),M('#1b1b2b'));h.position.set(tx+s[0]*1.01,6.28,s[1]*1.01);h.rotation.y=s[2];g.add(h);}
    for(let i=0;i<3;i++)put(B(.18,1.2,.05),M('#2a2a30'),tx-.35+i*.35,4.7,.72,{nc:1},g);
    put(new THREE.ConeGeometry(1.05,2.6,4),slate,tx,8.3,0,{ry:Math.PI/4},g);[[.62,.62],[-.62,.62],[.62,-.62],[-.62,-.62]].forEach(([a,b])=>put(new THREE.ConeGeometry(.18,.7,8),cream,tx+a,7.3,b,null,g));put(B(.04,.8,.04),M('#2a2a30'),tx,9.9,0,{nc:1},g);
    col(x0-2.3,z0-1.4,x0+2.7,z0+1.4);CBD.cut.push({g,x1:x0-2.3,x2:x0+2.7,z1:z0-1.4,h:10});}

  // ===== City Museum: a sandstone colonnade with tall columns, arched ground floor and a granite base =====
  {const host=CBD.cut.find(e=>Math.abs(e.g.position.x-630)<.05&&Math.abs(e.g.position.z+18)<.05);
    if(host){const g=new THREE.Group();host.g.add(g);FDET.cityParts=[g];const zf=2.52,sand=M('#e2cfa6'),gran=M('#a8a8a4');
      put(B(11,1.4,.2),gran,0,.7,zf,null,g);for(let i=0;i<4;i++){const ax=-3.9+i*2.6;put(B(1.6,1.3,.05),M('#2a2a30'),ax,.75,zf+.11,{nc:1},g);const a=new THREE.Mesh(new THREE.CircleGeometry(.8,12,0,Math.PI),M('#2a2a30'));a.position.set(ax,1.35,zf+.11);g.add(a);}
      for(let i=0;i<7;i++){put(new THREE.CylinderGeometry(.18,.2,3,10),sand,-4.8+i*1.6,2.9,zf+.15,null,g);put(B(.5,.18,.5),sand,-4.8+i*1.6,4.45,zf+.15,null,g);}
      put(B(11.2,.4,.6),sand,0,4.7,zf+.1,null,g);for(let i=0;i<6;i++)put(B(.7,.9,.05),M('#3a4250'),-4+i*1.6,2.9,zf+.02,{nc:1},g);}}

  // ===== a glass footbridge from the station over Wellington St =====
  {const gl=new THREE.MeshLambertMaterial({color:0x8ad0c8,transparent:true,opacity:.6}),fr=M('#e8dcc0');const x=671,z1=-22.6,z2=-19.95,y=3.6;
    put(B(1.6,1.1,z2-z1),gl,x,y,(z1+z2)/2,{nc:1},C2);put(B(1.7,.2,z2-z1+.1),fr,x,y-.6,(z1+z2)/2,null,C2);put(B(1.7,.15,z2-z1+.1),fr,x,y+.6,(z1+z2)/2,null,C2);
    for(let i=0;i<4;i++){const zz=z1+(i+.5)*(z2-z1)/4;put(B(.05,1.1,.05),M('#4a9a8a'),x-.8,y,zz,{rz:.6,nc:1},C2);put(B(.05,1.1,.05),M('#4a9a8a'),x+.8,y,zz,{rz:-.6,nc:1},C2);}
    [[x-.6,-21.0],[x+.6,-21.0]].forEach(([a,b])=>{});}

  // ===== a stone obelisk at the Kings Park lookout, with a white rail and a flag =====
  {const x=605.4,z=10.4;put(B(1.4,.3,1.4),M('#b8b8b4'),x,.15,z,null,C2);put(B(.9,.5,.9),M('#a8a8a4'),x,.55,z,null,C2);
    const ob=new THREE.Mesh(new THREE.CylinderGeometry(.18,.42,3.2,4),M('#a8a8a4'));ob.rotation.y=Math.PI/4;ob.position.set(x,2.4,z);ob.castShadow=true;C2.add(ob);put(new THREE.ConeGeometry(.22,.35,4),M('#b8b8b4'),x,4.15,z,{ry:Math.PI/4},C2);
    put(B(.06,1.1,.04),M('#6a6a68'),x,2.6,z+.36,{nc:1},C2);put(B(.5,.06,.04),M('#6a6a68'),x,3,z+.36,{nc:1},C2);
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;put(B(.05,.5,.05),M('#f6f6f0'),x+Math.cos(a)*1,.3,z+Math.sin(a)*1,{nc:1},C2);}
    put(new THREE.CylinderGeometry(.03,.03,4,5),M('#e8e8ec'),x+1.4,2,z-.4,null,C2);col(x-.75,z-.75,x+.75,z+.75);}
})();
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
