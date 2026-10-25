// ---------- Perth CBD: busy footpaths (same Look Lab layer: ?lab, ?freo or ?city) ----------
// Concrete footpaths with kerbs along every road where people walk, and a much bigger lunchtime crowd:
// office workers, shoppers and tourists on St Georges Tce, Wellington St, Barrack and William streets,
// the Hay St Mall, the riverside walk and the Kings Park path. Half of them go home after dark.
if(FDET.on&&FREO2_ON&&FDET.city)(()=>{const G=FDET.city;
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const r=mulberry32(2026);
  const footM=(w,d)=>new THREE.MeshLambertMaterial({map:tex(8,8,(x)=>{x.fillStyle='#cfcac0';x.fillRect(0,0,8,8);x.fillStyle='#bdb8ae';x.fillRect(0,0,8,1);x.fillRect(0,0,1,8);x.fillStyle='#d8d4ca';for(let i=0;i<6;i++)x.fillRect(r()*8|0,r()*8|0,1,1);},[Math.max(1,w/1.2),Math.max(1,d/1.2)])});
  const kerbM=new THREE.MeshLambertMaterial({color:0x9a968e});
  const flat=(w,d,m,x,z,y)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);p.rotation.x=-Math.PI/2;p.position.set(x,y,z);p.receiveShadow=true;G.add(p);};
  // x1,z1,x2,z2 and which side has the kerb (the road side)
  const foot=(x1,z1,x2,z2,kerb)=>{const w=x2-x1,d=z2-z1;flat(w,d,footM(w,d),(x1+x2)/2,(z1+z2)/2,.0235);
    const k=.09;if(kerb==='s')flat(w,k,kerbM,(x1+x2)/2,z2-k/2,.026);if(kerb==='n')flat(w,k,kerbM,(x1+x2)/2,z1+k/2,.026);if(kerb==='e')flat(k,d,kerbM,x2-k/2,(z1+z2)/2,.026);if(kerb==='w')flat(k,d,kerbM,x1+k/2,(z1+z2)/2,.026);};
  // St Georges Tce (road z -4.2..-2), Riverside Dr (z 3.9..6.15), Wellington St (z -22.5..-21)
  const EW=[[622,638],[640.2,666.2],[668.4,700]];
  EW.forEach(([a,b])=>{foot(a,-5.35,b,-4.22,'s');foot(a,-1.98,b,-.72,'n');foot(a,3.0,b,3.88,'s');foot(a,-20.95,b,-19.95,'n');foot(a,-23.4,b,-22.52,'s');});
  // Barrack St (x 666.2..668.4) and William St (x 638..640.2), broken at the cross streets and the mall
  [[-20.95,-14.75],[-12.25,-4.22],[-1.98,3.0]].forEach(([a,b])=>{foot(665.2,a,666.18,b,'e');foot(668.42,a,669.4,b,'w');foot(637,a,637.98,b,'e');foot(640.22,a,641.2,b,'w');});
  // ===== the crowd =====
  if(typeof walkers!=='undefined'){const looks=()=>({skin:SKINS[r()*SKINS.length|0],hair:HAIRS[r()*HAIRS.length|0],shirt:SHIRTS[r()*SHIRTS.length|0],pants:PANTS[r()*PANTS.length|0],hat:r()<.7?null:HATS[r()*HATS.length|0]});
    const R=[[[622,-4.75],[700,-4.75]],[[622,-1.3],[700,-1.3]],[[622,3.45],[700,3.45]],[[622,-20.45],[700,-20.45]],[[622,-22.95],[700,-22.95]],
      [[668.9,-20.5],[668.9,-14.9],[668.9,-12.1],[668.9,2.6]],[[665.7,-20.5],[665.7,2.6]],[[637.5,-20.5],[637.5,2.6]],[[640.7,-20.5],[640.7,2.6]],
      [[624,-13.0],[698,-13.0]],[[624,-14.1],[698,-14.1]],[[624,-13.55],[698,-13.55]],[[623,10.3],[700,10.3]],[[617.5,-23],[617.5,9]],[[605,-10.5],[617,-10.5]]];
    const WT={4:1,10:1,11:1,12:1};let n=0;
    R.forEach((route,ri)=>{const cnt=ri>=9&&ri<=11?6:ri===12?5:ri>=5&&ri<=8?3:4;for(let i=0;i<cnt;i++){const m=spriteMesh(humanFrames(looks()),.95,1.58);m.visible=false;scene.add(m);const sh=blob(.8);sh.visible=false;
      const seg=r()*(route.length-1)|0,t=r();const a=route[seg],b=route[seg+1];walkers.push({zone:'cbd',m,sh,route,seg,dir:r()<.5?1:-1,x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,sp:1.1+r()*.9,off:(r()-.5)*(WT[ri]?.9:.35),walkT:r()*5,face:1,bike:false,pause:0});n++;}});
    FDET.cityCrowd=n;}
})();
// ---------- Fremantle homes: streets, lanes and terraces (Look Lab ?lab or ?homes until FHOMES_LIVE) ----------
// The suburbs south and east of town become a real grid: two streets and a back lane, short cross streets, rows of
// attached terrace cottages in Fremantle colours (limestone cream, sage, duck-egg blue, rose, butter, terracotta) with
// white trim, bullnose verandahs, chimneys, little front gardens behind picket fences, nature strips and street trees.
if(FDET.on&&FHOMES_ON)(()=>{const G=FDET.g;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const paint=(w,d,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const r=mulberry32(1830),pick=a=>a[(r()*a.length)|0];
  const WALLS=['#efe3c4','#b9c8a8','#b8d4d8','#e8b8b0','#f2dc96','#d08a62','#e8e4d8','#c8d0e0','#d8c0a0'];
  const DOORS=['#2c4a3a','#8a2a2a','#1d3a6e','#5a3a22','#c8a040','#3a5a6a'];
  const TIN=['#a8acb0','#b8562e','#3e6a52','#9aa0a6','#8a3a2e','#c8ccd0','#2f5a7a','#b8562e'];
  const asphM=lmat(asphC,[20,1]),grassM=lmat(grassC,[20,2]);
  // roads: x1..x2 along x at z (w wide), with footpaths and grass nature strips
  const street=(x1,x2,z,w,lane)=>{const L=x2-x1,cx=(x1+x2)/2;paint(L,w,lane?'#8a8478':asphM,cx,z,.021);if(lane)return;for(let x=x1+1;x<x2;x+=2.4)paint(1,.06,'#f3f3ea',cx-L/2+(x-x1),z,.026);
    [-1,1].forEach(s=>{paint(L,.07,'#9a968e',cx,z+s*w/2,.027);paint(L,.55,grassM,cx,z+s*(w/2+.3),.022);paint(L,.7,'#cfcac0',cx,z+s*(w/2+.92),.023);});};
  const cross=(x,z1,z2,w)=>{paint(w,z2-z1,asphM,x,(z1+z2)/2,.0215);[-1,1].forEach(s=>paint(.7,z2-z1,'#cfcac0',x+s*(w/2+.35),(z1+z2)/2,.0235));};
  // a row of attached cottages; face: +1 faces +z (south, toward the camera), -1 faces -z
  function terrace(x1,x2,z,face){const W=1.7,n=Math.floor((x2-x1)/W),D=2.6,H=1.45;let x=x1;const fz=z+face*D/2;
    const tc=mk(16*n,16),tx=tc.getContext('2d');const cols=[];for(let i=0;i<n;i++){const c=pick(WALLS);cols.push(c);const ox=i*16;
      tx.fillStyle=c;tx.fillRect(ox,0,16,16);tx.fillStyle='#f6f2e8';tx.fillRect(ox,0,16,1);tx.fillRect(ox+15,0,1,16);
      tx.fillStyle=pick(DOORS);tx.fillRect(ox+2,6,4,10);tx.fillStyle='#e8d8a0';tx.fillRect(ox+3,7,2,1);
      tx.fillStyle='#f6f2e8';tx.fillRect(ox+8,5,6,8);tx.fillStyle='#3a4a5a';tx.fillRect(ox+9,6,4,6);tx.fillStyle='#f6f2e8';tx.fillRect(ox+9,9,4,1);tx.fillRect(ox+10,6,1,6);
      if(r()<.5){tx.fillStyle=pick(['#d8323a','#f04a8a','#f6d84a','#9a6ad8']);for(let k=0;k<4;k++)tx.fillRect(ox+8+k*1.5|0,13,1,1);}}
    const t=ctex(tc);const plain=new THREE.MeshLambertMaterial({color:new THREE.Color(cols[0])});
    const mats=[plain,plain,plain,plain,face>0?new THREE.MeshLambertMaterial({map:t}):plain,face<0?new THREE.MeshLambertMaterial({map:t}):plain];
    const L=n*W,cx=x1+L/2;const body=new THREE.Mesh(B(L,H,D),mats);body.position.set(cx,H/2,z);if(face<0)body.material[5].map.repeat.set(-1,1),body.material[5].map.offset.set(1,0);body.castShadow=body.receiveShadow=true;G.add(body);col(x1,z-D/2,x1+L,z+D/2);
    // roof per cottage (tin colours vary), a chimney every other house, party walls stick up a little
    for(let i=0;i<n;i++){const hx=x1+W/2+i*W;const s=new THREE.Shape();s.moveTo(-D/2-.12,0);s.lineTo(D/2+.12,0);s.lineTo(0,.85);s.closePath();const rg=new THREE.ExtrudeGeometry(s,{depth:W,bevelEnabled:false});rg.translate(0,0,-W/2);
      const rf=new THREE.Mesh(rg,M(pick(TIN)));rf.rotation.y=Math.PI/2;rf.position.set(hx,H,z);rf.castShadow=true;G.add(rf);
      if(i%2===0)put(B(.22,.55,.22),M('#a8583e'),hx-.45,H+.75,z-face*.3);put(B(.06,.22,D+.1),M('#f6f2e8'),x1+i*W,H+.08,z,{nc:1});
      // bullnose verandah: posts, a curved tin roof and a little front garden behind a picket fence
      const vz=fz+face*.5;put(B(W-.04,.05,.95),M(pick(['#b8bcc0','#a8acb0','#c8a080'])),hx,1.08,vz-face*.02,{rx:face*.18,nc:1});[-W/2+.12,W/2-.12].forEach(o=>put(B(.05,1.05,.05),M('#f6f2e8'),hx+o,.53,fz+face*.9,{nc:1}));
      const gz=fz+face*1.45;paint(W-.1,.8,M(pick(['#7aa356','#8ab060','#6a9a4e'])),hx,gz,.028);
      for(let k=0;k<9;k++)put(B(.035,.36,.035),M('#f6f6f2'),hx-W/2+.1+k*.19,.18,fz+face*1.88,{nc:1});put(B(W,.04,.04),M('#f6f6f2'),hx,.3,fz+face*1.88,{nc:1});
      if(FDET.bb&&FHOME_PLANTS.length&&r()<.75)FDET.bb(pick(FHOME_PLANTS),hx+(r()-.5)*.8,gz,.8,.55);}
    return L;}
  // the plan: Wray Ave and Hampton Rd south of town with a back lane between, short streets up into town, terraces on both sides
  const SZ1=26,SZ2=40.8,LANE=33.4;
  box(90,.5,24,lmat(paveC,[45,12]),313,-.27,33.4,{noCast:true});paint(90,22,grassM,313,33.4,.012);
  street(270,356,SZ1,1.8);street(270,356,SZ2,1.8);street(272,356,LANE,.9,1);
  [[304,22.2,41.8],[320,22.2,41.8],[336.2,22.2,41.8]].forEach(([x,z1,z2])=>cross(x,z1,z2,1.6));
  signPost(302.6,25.2,makeSign(['WRAY AVE'],48,10,'#1d3a6e','#ffffff'),1.6,.3);signPost(302.6,39.6,makeSign(['HAMPTON RD'],52,10,'#1d3a6e','#ffffff'),1.6,.3);signPost(318.6,32.6,makeSign(['LANE'],36,10,'#1d3a6e','#ffffff'),1.4,.3);
  const blocks=[[272,302.2],[305.8,318.2],[321.8,334.4],[338,355]];
  blocks.forEach(([a,b])=>{terrace(a+.3,b-.3,SZ1+5.35,-1);terrace(a+.3,b-.3,SZ2-5.35,1);});
  // back fences along the lane (corrugated iron and brush), bins out on the lane
  blocks.forEach(([a,b])=>{[-1,1].forEach(s=>{put(B(b-a-.4,.9,.06),M(s<0?'#9aa0a6':'#a89070'),(a+b)/2,.45,LANE+s*.75);});for(let x=a+1.5;x<b;x+=4.1){put(B(.32,.48,.34),M('#2f6a3a'),x,.24,LANE-.5);put(B(.34,.05,.36),M(pick(['#d8323a','#e8c430'])),x,.5,LANE-.5,{nc:1});}});
  // street trees along both streets
  if(FDET.bb&&typeof treeVariants!=='undefined')[SZ1,SZ2].forEach(z=>{for(let x=274;x<355;x+=6.3){if(Math.abs(x-304)<1.6||Math.abs(x-320)<1.6||Math.abs(x-336.2)<1.6)continue;[-1.2,1.2].forEach(o=>{const v=pick(treeVariants);FDET.bb(v,x+(o>0?3:0),z+o,v.w*.7,v.h*.7,0,true);});}});
  // a pocket park with a playground at the corner of Wray Ave and the first cross street
  {const px=312,pz=23.6;paint(11,2.6,grassM,px,pz,.03);[[309,23.4],[315,23.4]].forEach(([x,z])=>{put(B(1.4,.08,.08),M('#d8323a'),x,1.2,z);[-.6,.6].forEach(o=>put(B(.06,1.2,.06),M('#2f6fb0'),x+o,.6,z));put(B(.4,.04,.2),M('#3a3a3a'),x,.45,z);});
    put(B(1,.5,.7),M('#f2c428'),312,.25,23.8);put(B(.9,.04,.9),M('#e8732a'),312,.7,23.8,{rz:.3});}
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
