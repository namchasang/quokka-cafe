// ---------- tidy the island after it grows: nothing on the bike lanes or the railway, props apart, beach things on the sand ----------
ISL.late.push(()=>{
  const lanes=BLANES.filter(L=>L[0][0]<99.5),R=WEST.rail||[],C0=IW(0,0),ST=ISL.tidy={moved:0,dropped:0,stuck:[],lots:[],beach:0};
  const laneNear=(x,z)=>{let m=1e9,best=null;for(const L of lanes){const d=segD(x,z,L[0][0],L[0][1],L[1][0],L[1][1])-(L[2]||1.15)/2;if(d<m){m=d;best=L;}}return[m,best];};
  const railNear=(x,z)=>{let m=1e9,best=null;for(let i=0;i<R.length-1;i++){const d=segD(x,z,R[i][0],R[i][1],R[i+1][0],R[i+1][1])-.55;if(d<m){m=d;best=[R[i],R[i+1],1.1];}}return[m,best];};
  const clear=(x,z,r)=>laneNear(x,z)[0]>=r+.1&&railNear(x,z)[0]>=r+.1;
  const B=new THREE.Box3(),SZ=new THREE.Vector3();scene.updateMatrixWorld(true);
  const skip=new Set([...(ISL.rail?ISL.rail.meshes:[]),...Object.values(brMeshes),...LAMPS.flatMap(L=>[L.g,L.gl,L.halo]).filter(Boolean)]);
  const treeOf=new Map();trees.forEach(t=>{if(t.x<99.5)treeOf.set(t.m,t);});
  const T0=performance.now(),tm=n=>{ST['t'+n]=Math.round(performance.now()-T0);};
  // 1. island café lots must not sit on a road, a path or a bike lane
  BRANCHES.forEach(b=>{if(b.zone!=='island'||b.kiosk)return;
    const bad=(x,z)=>{for(let a=-2.9;a<=2.9;a+=.58)for(let c=-1.8;c<=3.1;c+=.49){if(laneNear(x+a,z+c)[0]<.3||railNear(x+a,z+c)[0]<.3||pathD(x+a,z+c)<.3)return true;}return false;};
    if(!bad(b.x,b.z))return;
    const own=colliders.findIndex(c=>Math.abs((c.x1+c.x2)/2-b.x)<1.5&&Math.abs((c.z1+c.z2)/2-(b.z-.7))<1.5&&c.x2-c.x1>4);const old=own>=0?colliders.splice(own,1)[0]:null;
    const tk=new Set(trees.map(t=>Math.round(t.x*10)+','+Math.round(t.z*10))),isTree=c=>tk.has(Math.round((c.x1+c.x2)*5)+','+Math.round((c.z1+c.z2)*5));
    const fits=(x,z)=>{if(COACH.some(q=>Math.abs(q.x+.9-x)<4&&Math.abs(q.z-.9-z)<3.6))return false;if(colliders.some(c=>c.x2>x-3.1&&c.x1<x+3.1&&c.z2>z-2&&c.z1<z+3.3&&c.x1<1e8&&!isTree(c)))return false;
      for(let a=-2.9;a<=2.9;a+=.58)for(let c=-1.8;c<=3.1;c+=.49)if(landD(x+a,z+c)<.5)return false;return !bad(x,z);};
    let at=null;for(let r=1;r<=22&&!at;r+=.6){const n=Math.max(8,Math.round(r*6));for(let i=0;i<n;i++){const t=i/n*6.283,px=b.x+Math.cos(t)*r,pz=b.z+Math.sin(t)*r;if(fits(px,pz)){at=[px,pz];break;}}}
    if(at)for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(t.x>at[0]-3.2&&t.x<at[0]+3.2&&t.z>at[1]-2.1&&t.z<at[1]+3.4){scene.remove(t.m);const bi=BB.indexOf(t.m);if(bi>=0)BB.splice(bi,1);for(let c=colliders.length-1;c>=0;c--){const C=colliders[c];if(Math.abs((C.x1+C.x2)/2-t.x)<.05&&Math.abs((C.z1+C.z2)/2-t.z)<.05){colliders.splice(c,1);break;}}trees.splice(i,1);}}
    if(!at){if(old)colliders.push(old);ST.lots.push(b.id+':nospot');return;}ST.lots.push(b.id);
    const dx=at[0]-b.x,dz=at[1]-b.z;b.x+=dx;b.z+=dz;if(b.tp){b.tp.x+=dx;b.tp.z+=dz;}col(b.x-2.7,b.z-2.4,b.x+2.7,b.z+1);buildBranch(b);});
  // the airstrip stays clear for take-off
  if(WA.rw){const w=WA.rw;for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(t.x>w.x1&&t.x<w.x2&&t.z>w.z1&&t.z<w.z2){scene.remove(t.m);const bi=BB.indexOf(t.m);if(bi>=0)BB.splice(bi,1);for(let c=colliders.length-1;c>=0;c--){const C=colliders[c];if(Math.abs((C.x1+C.x2)/2-t.x)<.05&&Math.abs((C.z1+C.z2)/2-t.z)<.05){colliders.splice(c,1);break;}}trees.splice(i,1);ST.rw=(ST.rw||0)+1;}}}
  tm(1);
  // 2. the West End boardwalk and the cape deck: drop pieces that lie on a path or a lane
  const deck=(g,w,h,d)=>g&&g.type==='BoxGeometry'&&Math.abs(g.parameters.width-w)<.02&&Math.abs(g.parameters.height-h)<.02&&Math.abs(g.parameters.depth-d)<.02;
  const gone=[];scene.children.slice().forEach(o=>{if(!o.isMesh||o.position.x>=99.5)return;const g=o.geometry;if(!(deck(g,1.62,.12,1.3)||deck(g,5.4,.14,1.2)||deck(g,3,.14,3)))return;
    const x=o.position.x,z=o.position.z;if(Math.min(pathD(x,z),laneNear(x,z)[0]+.6)<.9){scene.remove(o);gone.push([x,z]);}});
  if(gone.length)scene.children.slice().forEach(o=>{if(!o.isMesh||!o.__wa)return;const g=o.geometry;if(!(deck(g,.06,.6,.06)||deck(g,1.6,.05,.05)))return;if(gone.some(([x,z])=>Math.hypot(o.position.x-x,o.position.z-z)<1.1))scene.remove(o);});
  tm(2);
  // 3. gather small standing things into units (a sign = pole + board, an umbrella = pole + shade, a lamp, a tree)
  const items=[],flat=[],high=[];
  scene.children.forEach(o=>{if(o.userData.lane||skip.has(o)||o.isLight||o.isCamera)return;const p=o.position;if(p.x>=99.5)return;
    if(o.userData.frames&&!treeOf.has(o))return;// people and animals walk about
    B.setFromObject(o);if(B.isEmpty()){return;}B.getSize(SZ);const cx=(B.min.x+B.max.x)/2,cz=(B.min.z+B.max.z)/2;
    if(Math.hypot(cx-C0.x,cz-C0.z)<8)return;// the café front is laid out by hand
    const t=treeOf.get(o);if(!t&&(SZ.x>3.6||SZ.z>3.6||(landD(cx,cz)<0&&!XPL.meshes.includes(o))))return;const it={o,x:t?t.x:cx,z:t?t.z:cz,r:t?.35:Math.max(.08,Math.max(SZ.x,SZ.z)/2),y0:B.min.y,y1:B.max.y,t};
    if(B.max.y<.12){if(SZ.x<3.6&&SZ.z<3.6)flat.push(Object.assign(it,{big:SZ.x>1.6||SZ.z>1.6}));return;}if(!t&&(SZ.x>3.2||SZ.z>3.2))return;if(B.min.y>1.2&&!t){high.push(it);return;}items.push(it);});
  const units=[];const G=new Map(),key=(x,z)=>Math.floor(x/2)*100000+Math.floor(z/2);
  LAMPS.forEach(L=>{if(!L.g||L.x>=99.5)return;units.push({m:[L.g,L.gl,L.halo].filter(Boolean).map(o=>({o,x:o.position.x,z:o.position.z,r:.1,y0:0})),x:L.x,z:L.z,r:.4,k:'lamp',L});});
  items.forEach(it=>{if(it.t){units.push({m:[it],x:it.x,z:it.z,r:.5,k:'tree'});return;}
    let u=null;for(let i=-1;i<=1&&!u;i++)for(let j=-1;j<=1&&!u;j++){const A=G.get(key(it.x+i*2,it.z+j*2));if(A)u=A.find(u=>u.k!=='tree'&&u.m.some(m=>Math.hypot(m.x-it.x,m.z-it.z)<.45));}
    if(!u){u={m:[],x:it.x,z:it.z,r:0};units.push(u);const k=key(it.x,it.z);if(!G.has(k))G.set(k,[]);G.get(k).push(u);}u.m.push(it);});
  const nearest=f=>{let best=null,bd=1e9;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)(G.get(key(f.x+i*2,f.z+j*2))||[]).forEach(u=>{const c=u.m[0];const d=Math.hypot(c.x-f.x,c.z-f.z);if(d<bd){bd=d;best=u;}});return[best,bd];};
  // shades, lamp heads and boards up high go with the post right under them
  high.forEach(f=>{const[u,d]=nearest(f);if(u&&d<.35)u.m.push(Object.assign(f,{follow:1}));});
  const xpl=new Set(XPL.meshes);
  units.forEach(u=>{if(u.k)return;u.x=u.m.reduce((s,m)=>s+m.x,0)/u.m.length;u.z=u.m.reduce((s,m)=>s+m.z,0)/u.m.length;u.r=Math.max(...u.m.map(m=>Math.hypot(m.x-u.x,m.z-u.z)+(m.y0<1?Math.min(m.r,1.2):Math.min(m.r*.8,.8))));
    const has=f=>u.m.some(m=>f(m.o));
    u.k=has(o=>xpl.has(o))?'bus':has(o=>o.geometry&&o.geometry.type==='ConeGeometry'&&o.geometry.parameters.radius>.6)&&has(o=>o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.width<.1&&o.geometry.parameters.height>1.2)?'umbrella':has(o=>o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry'&&o.material&&o.material.map&&o.position.y>.9)&&has(o=>o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height>1.1&&o.geometry.parameters.width<.16)?'sign':'prop';});
  flat.forEach(f=>{let best=null,bd=1e9;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)(G.get(key(f.x+i*2,f.z+j*2))||[]).forEach(u=>{const d=Math.hypot(u.x-f.x,u.z-f.z);if(d<bd){bd=d;best=u;}});if(best&&bd<Math.max(.5,best.r+.15)&&best.k!=='prop'&&(!f.big||best.k==='lamp'))best.m.push(Object.assign(f,{follow:1}));});
  const move=(u,dx,dz)=>{const ox=u.x,oz=u.z;ST.moved++;u.m.forEach(m=>{m.o.position.x+=dx;m.o.position.z+=dz;m.x+=dx;m.z+=dz;if(m.t){m.t.x+=dx;m.t.z+=dz;}});u.x+=dx;u.z+=dz;
    colliders.forEach(c=>{const w=c.x2-c.x1,d=c.z2-c.z1;if(w<1.3&&d<1.3&&Math.hypot((c.x1+c.x2)/2-ox,(c.z1+c.z2)/2-oz)<u.r+.05){c.x1+=dx;c.x2+=dx;c.z1+=dz;c.z2+=dz;}});
    if(u.L){u.L.x+=dx;u.L.z+=dz;}};
  const drop=u=>{ST.dropped++;u.m.forEach(m=>{scene.remove(m.o);if(m.t){const i=trees.indexOf(m.t);if(i>=0)trees.splice(i,1);const b=BB.indexOf(m.o);if(b>=0)BB.splice(b,1);}});
    for(let c=colliders.length-1;c>=0;c--){const C=colliders[c];if(C.x2-C.x1<.6&&C.z2-C.z1<.6&&Math.hypot((C.x1+C.x2)/2-u.x,(C.z1+C.z2)/2-u.z)<.3)colliders.splice(c,1);}u.dead=1;};
  // landD() is a field ratio and can read far too high inland, so measure the real walk to the water
  const sea=(x,z,max)=>{for(let r=.25;r<(max||30);r+=.25)for(let i=0;i<32;i++){const t=i/32*6.283,px=x+Math.cos(t)*r,pz=z+Math.sin(t)*r;if(landD(px,pz)<0)return[r,px,pz];}return null;};
  const okAt=(u,x,z)=>clear(x,z,Math.min(u.r,1))&&landD(x,z)>.4&&!sea(x,z,.9)&&(u.k==='tree'||pathD(x,z)>(u.k==='prop'||u.k==='umbrella'?.35:.15));
  tm(3);
  // off the lanes and the track
  units.forEach(u=>{if(u.r>1.7)return;const rr=Math.min(u.r,1);if(clear(u.x,u.z,rr))return;
    const [ld,L]=laneNear(u.x,u.z),[rd,T]=railNear(u.x,u.z),S=ld<rd?L:T;const a=S[0],b=S[1],hw=(S[2]||1.15)/2;
    const vx=b[0]-a[0],vz=b[1]-a[1],l2=vx*vx+vz*vz||1,t=clamp(((u.x-a[0])*vx+(u.z-a[1])*vz)/l2,0,1),px=a[0]+vx*t,pz=a[1]+vz*t;
    let nx=u.x-px,nz=u.z-pz,n=Math.hypot(nx,nz);if(n<1e-3){nx=-vz;nz=vx;n=Math.hypot(nx,nz)||1;}nx/=n;nz/=n;
    for(const s of [1,-1]){for(const extra of [.15,.6,1.2,2,3]){const tx=px+nx*s*(hw+rr+extra),tz=pz+nz*s*(hw+rr+extra);if(okAt(u,tx,tz)){move(u,tx-u.x,tz-u.z);return;}}}
    if(u.k==='tree'||u.k==='prop'&&u.r<.6)drop(u);else ST.stuck.push([u.k,+u.x.toFixed(1),+u.z.toFixed(1)]);});
  tm(4);
  // ...and not inside a building (a bus stop sign was stuck in the lighthouse wall)
  const bigC=colliders.filter(c=>{const w=c.x2-c.x1,d=c.z2-c.z1;return c.x1<99.5&&c.x1<1e8&&(w>1.2||d>1.2)&&w<14&&d<14;});
  units.forEach(u=>{if(u.dead||u.r>1.7||u.k==='prop')return;const rr=u.k==='tree'?.3:Math.min(u.r,1)*.8;
    for(const c of bigC){if(u.x<c.x1-rr||u.x>c.x2+rr||u.z<c.z1-rr||u.z>c.z2+rr)continue;
      const opts=[[c.x1-rr-.1,u.z],[c.x2+rr+.1,u.z],[u.x,c.z1-rr-.1],[u.x,c.z2+rr+.1]].sort((a,b)=>Math.hypot(a[0]-u.x,a[1]-u.z)-Math.hypot(b[0]-u.x,b[1]-u.z));
      const o=opts.find(([x,z])=>okAt(u,x,z)&&!bigC.some(k=>k!==c&&x>k.x1-rr&&x<k.x2+rr&&z>k.z1-rr&&z<k.z2+rr));if(o)move(u,o[0]-u.x,o[1]-u.z);else if(u.k==='tree')drop(u);break;}});
  // ...and not standing in the sea
  units.forEach(u=>{if(u.dead||u.r>1.7||u.k==='prop'||u.k==='tree'||!sea(u.x,u.z,.5))return;
    for(let r=.6;r<=9;r+=.4){const n=Math.max(8,Math.round(r*6));for(let i=0;i<n;i++){const t=i/n*6.283,x=u.x+Math.cos(t)*r,z=u.z+Math.sin(t)*r;if(okAt(u,x,z)){move(u,x-u.x,z-u.z);return;}}}});
  tm(5);
  // 4. trees, umbrellas, bus stops, lamps and signs: never inside each other
  const rank={bus:5,lamp:4,sign:3,umbrella:2,tree:1};const live=units.filter(u=>!u.dead&&rank[u.k]&&u.r<=1.7);
  for(let pass=0;pass<3;pass++){live.sort((a,b)=>a.x-b.x);for(let i=0;i<live.length;i++)for(let j=i+1;j<live.length&&live[j].x-live[i].x<2.3;j++){const A=live[i],Bu=live[j];if(A.dead||Bu.dead)continue;
    const need=(A.k==='tree'?.45:Math.min(A.r,1))+(Bu.k==='tree'?.45:Math.min(Bu.r,1))+.1,d=Math.hypot(A.x-Bu.x,A.z-Bu.z);if(d>=need)continue;
    const lo=rank[A.k]<rank[Bu.k]?A:Bu,hi=lo===A?Bu:A;let ux=lo.x-hi.x,uz=lo.z-hi.z,n=Math.hypot(ux,uz);if(n<1e-3){ux=1;uz=0;n=1;}ux/=n;uz/=n;
    let done=false;for(const ang of [0,.7,-.7,1.5,-1.5,2.4,-2.4]){const c=Math.cos(ang),s=Math.sin(ang),vx=ux*c-uz*s,vz=ux*s+uz*c,tx=hi.x+vx*need,tz=hi.z+vz*need;
      if(okAt(lo,tx,tz)&&!live.some(o=>o!==lo&&o!==hi&&!o.dead&&Math.hypot(o.x-tx,o.z-tz)<need*.8)){move(lo,tx-lo.x,tz-lo.z);done=true;break;}}
    if(!done&&lo.k==='tree')drop(lo);}}
  tm(6);
  // 5. beach umbrellas and the juice hammock belong on the sand by the water
  const toSand=(x,z,hw,hd)=>{const s=sea(x,z);if(!s)return null;const[r,sx,sz]=s,ux=(x-sx)/r,uz=(z-sz)/r;
    for(const lat of [0,1,-1,2,-2,3,-3,4.5,-4.5,6,-6])for(const off of [1.4,1.8,2.2,1.1,2.6]){const px=sx+ux*off-uz*lat,pz=sz+uz*off+ux*lat;const q=sea(px,pz,3.2);
      if(!q||q[0]<Math.max(.9,hd+.5))continue;if(clear(px,pz,Math.max(hw,hd))&&pathD(px,pz)>.6&&islSiteOK(px,pz,hw,hd,{land:.2,path:.6,pad:.15}))return[px,pz];}return null;};
  units.forEach(u=>{if(u.dead||u.k!=='umbrella'||(sea(u.x,u.z,3.5)))return;const p=toSand(u.x,u.z,.9,.9);if(p)move(u,p[0]-u.x,p[1]-u.z);});
  {const bx=BEACH.x+.3,bz=BEACH.z;if(!sea(bx,bz,2.4)){const p=toSand(bx,bz,2.1,.6);if(p){const dx=p[0]-bx,dz=p[1]-bz;
    const near=scene.children.filter(o=>!o.userData.lane&&!skip.has(o)&&!(o.userData.frames&&!treeOf.has(o))&&Math.abs(o.position.x-bx)<2.5&&Math.abs(o.position.z-bz)<.8&&(B.setFromObject(o),!B.isEmpty()&&B.getSize(SZ).x<3&&SZ.z<3));
    near.forEach(o=>{o.position.x+=dx;o.position.z+=dz;const t=treeOf.get(o);if(t){t.x+=dx;t.z+=dz;}});
    colliders.forEach(c=>{if(c.x2-c.x1<1&&c.z2-c.z1<1&&Math.abs((c.x1+c.x2)/2-bx)<2.5&&Math.abs((c.z1+c.z2)/2-bz)<.8){c.x1+=dx;c.x2+=dx;c.z1+=dz;c.z2+=dz;}});
    BEACH.x+=dx;BEACH.z+=dz;ST.beach=near.length;}else ST.beach=-1;}}
  tm(7);
});
try{islandWarp();}catch(e){console.error('islandWarp',e);}
updateCamera(0,true);
function flipIslandSigns(){const v=new THREE.Vector3();scene.updateMatrixWorld();const mx=scene.scale.x<0?-1:1;scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.map)return;const t=o.material.map;if(FLIPPED.has(t)||!(SIGN_TEX.has(t)||t===signTex))return;o.getWorldPosition(v);if(v.x*mx>100)return;FLIPPED.add(t);t.repeat.x=-1;t.offset.x=1;});}
flipIslandSigns();
requestAnimationFrame(loop);

// keep progress across live updates of the page
const hot=window.claude&&window.claude.hot;
if(hot&&hot.snapshot)hot.snapshot(()=>({S,running,px:player.x,pz:player.z}));
if(hot&&hot.data&&hot.data.S&&hot.data.running){const oldL=hot.data.S.isv!==2,v1=hot.data.S.isv===1;startGame(hot.data.S);player.x=hot.data.px;player.z=hot.data.pz;if(oldL&&player.x<99.5){const w=v1?isFromV1(player.x,player.z):IW(player.x,player.z);player.x=w.x;player.z=w.z;}S.time=hot.data.S.time||420;S.closed=hot.data.S.closed;S.served=hot.data.S.served||0;S.earned=hot.data.S.earned||0;dlgQ=[];ui.dlg.hidden=true;updateCamera(0,true);}
