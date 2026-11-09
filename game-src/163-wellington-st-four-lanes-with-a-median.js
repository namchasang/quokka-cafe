// ---------- Wellington St, four lanes with a median (Look Lab ?wel4): Perth Station moves 2.2 m north to make room ----------
function wel4Build(){const DZ=-2.2,X1=598,X2=702,Z1=-60,Z2=-20.8,V=new THREE.Vector3(),B=new THREE.Box3(),L=new THREE.Box3();scene.updateMatrixWorld(true);
  const lbox=o=>{B.setFromObject(o);if(B.isEmpty())return null;L.makeEmpty();for(const x of[B.min.x,B.max.x])for(const y of[B.min.y,B.max.y])for(const z of[B.min.z,B.max.z]){V.set(x,y,z);scene.worldToLocal(V);L.expandByPoint(V);}return L;};
  const moved=new Set();const walk=o=>{for(const c of o.children.slice()){if(c.isLight||c.isCamera)continue;const b=lbox(c);if(!b)continue;
      const flatRoad=b.max.y-b.min.y<.06&&b.max.x-b.min.x>12;const cz=(b.min.z+b.max.z)/2;
      // the whole north side of Wellington St (shops, the station, lamps, trees, the towers behind) moves north with the road
      if(b.min.x>=X1-.5&&b.max.x<=X2+.5&&b.max.z<=Z2&&cz<-21.25&&b.max.z-b.min.z<14&&!flatRoad){c.position.z+=DZ;moved.add(c);}else if(b.max.x>X1&&b.min.x<X2&&b.max.z>Z1&&b.min.z<Z2&&c.children.length)walk(c);}};
  walk(scene);
  colliders.forEach(c=>{if(c.x1>=X1-.5&&c.x2<=X2+.5&&c.z2<=Z2&&(c.z1+c.z2)/2<-21.25&&c.z1>-60){c.z1+=DZ;c.z2+=DZ;c.__w4=1;}});
  if(typeof CBD!=='undefined'&&CBD.cut)CBD.cut.forEach(e=>{for(let p=e.g;p;p=p.parent)if(moved.has(p)){e.z1+=DZ;e.ready=false;break;}});
  // the old one-way arrows and sign go
  scene.traverse(o=>{if(!o.isMesh)return;const b=lbox(o);if(!b)return;const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;
    if(Math.abs(cz+21.7)<.3&&b.max.y<.04&&b.min.y>.03&&b.max.x-b.min.x<1.2&&[628,648,684].some(x=>Math.abs(cx-x)<.6))o.visible=false;
    if(Math.abs(cx-624.4)<.4&&Math.abs(cz+20.54)<.12&&b.max.y>1)o.visible=false;});
  const CWn0=scene.children.length;
  // new road surface, lanes, the median with gaps at William St, Barrack St and the station crossing
  const asph=(()=>{const c=mk(32,32),x=c.getContext('2d');x.fillStyle='#4a4d55';x.fillRect(0,0,32,32);const r=mulberry32(5);for(let i=0;i<90;i++){x.fillStyle=r()<.5?'#55585f':'#43464d';x.fillRect(r()*32|0,r()*32|0,1,1);}return c;})();
  const W=new THREE.MeshBasicMaterial({color:'#f2efe6'}),Y=new THREE.MeshBasicMaterial({color:'#e8c430'});
  const flat=(w,d,x,z,m,y)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);q.rotation.x=-Math.PI/2;q.position.set(x,y,z);q.receiveShadow=true;scene.add(q);return q;};
  const R1=-24.3+CW_RD,R2=-20.95+CW_RD,MZ=-22.65+CW_RD,MW=.55;
  flat(78,R2-R1,661,(R1+R2)/2,new THREE.MeshLambertMaterial({map:ctex(asph,{rep:[78,R2-R1]})}),.029);
  if(!CW_ON)flat(78,-24.3+25.1,661,(-25.1-24.3)/2,lmat(paveC,[39,.4]),.029);// the station forecourt
  const gaps=[[639.1,1.4],[667.3,1.4],[677,1.1]];const open=x=>gaps.some(([g,w])=>Math.abs(x-g)<w);
  for(let x=622.6;x<700;x+=2.2){if(open(x))continue;flat(1,.06,x,(R1+MZ-MW/2)/2,W,.033);flat(1,.06,x,(R2+MZ+MW/2)/2,W,.033);}
  flat(78,.05,661,R1+.06,W,.033);flat(78,.05,661,R2-.06,W,.033);
  const kerb=new THREE.MeshLambertMaterial({map:ctex((()=>{const c=mk(32,8),x=c.getContext('2d');x.fillStyle='#c8c0ac';x.fillRect(0,0,32,8);x.fillStyle='#e8e0cc';x.fillRect(0,0,32,2);for(let i=0;i<32;i+=8){x.fillStyle='#a8a08c';x.fillRect(i,0,1,8);}return c;})(),{rep:[20,1]})});
  const top=lmat(grassC,[10,1]);let segs=[];let a=622;[...gaps].sort((p,q)=>p[0]-q[0]).forEach(([g,w])=>{segs.push([a,g-w]);a=g+w;});segs.push([a,700]);
  segs.forEach(([x1,x2])=>{if(x2-x1<.5)return;const m=new THREE.Mesh(new THREE.BoxGeometry(x2-x1,.12,MW),[kerb,kerb,top,kerb,kerb,kerb]);m.position.set((x1+x2)/2,.06,MZ);m.castShadow=m.receiveShadow=true;scene.add(m);
    for(let x=x1+.4;x<x2-.3;x+=.9)flat(.06,.06,x,MZ+MW/2+.04,Y,.033),flat(.06,.06,x,MZ-MW/2-.04,Y,.033);
    // twin-arm lamps along the median
    for(let x=x1+2;x<x2-1;x+=8){const p=new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,3,6),new THREE.MeshLambertMaterial({color:'#3a3e48'}));p.position.set(x,1.62,MZ);scene.add(p);
      [-1,1].forEach(sg=>{const arm=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.7),new THREE.MeshLambertMaterial({color:'#3a3e48'}));arm.position.set(x,3.05,MZ+sg*.33);scene.add(arm);
        const l=new THREE.Mesh(new THREE.BoxGeometry(.16,.05,.26),new THREE.MeshBasicMaterial({color:'#e8d8a8'}));l.position.set(x,3.0,MZ+sg*.62);scene.add(l);if(typeof PXB_LAMPS!=='undefined')PXB_LAMPS.push(l);});
      col(x-.07,MZ-.07,x+.07,MZ+.07);}
    // little shrubs on the median (pixel sprites, the game's own bushes)
    if(typeof bushVariants!=='undefined'&&bushVariants.length)for(let x=x1+1;x<x2-.6;x+=2.6){const v=bushVariants[(x*7|0)%bushVariants.length];const g=new THREE.PlaneGeometry(.8,.5);g.translate(0,.25,0);const bm=new THREE.Mesh(g,v.m);bm.customDepthMaterial=v.d;bm.position.set(x,.12,MZ);scene.add(bm);if(typeof BB!=='undefined')BB.push(bm);}});
  // a zebra crossing from the station doors across both carriageways
  for(let z=R1+.15;z<R2-.1;z+=.32){if(Math.abs(z-MZ)<MW/2)continue;flat(1.6,.18,677,z,W,.034);}
  wel4Build.moved=moved.size;if(CW_ON)try{cwBuild(moved,lbox,flat,kerb,new Set(scene.children.slice(CWn0)));}catch(e){console.error(e);}}
// ---------- buildings off the bike lanes (Paul, Nov 2026): a house whose walls, verandah or posts reach over a lane steps back from it ----------
function pxbLaneClear(gs){if(typeof BLANES==='undefined'||!BLANES.length)return;const V=new THREE.Vector3(),B=new THREE.Box3(),L=new THREE.Box3();scene.updateMatrixWorld(true);let n=0;const out=[];
  const lbox=o=>{B.setFromObject(o);if(B.isEmpty())return null;L.makeEmpty();for(const x of[B.min.x,B.max.x])for(const y of[B.min.y,B.max.y])for(const z of[B.min.z,B.max.z]){V.set(x,y,z);scene.worldToLocal(V);L.expandByPoint(V);}return L.clone();};
  const lanes=BLANES.filter(l=>l[0][0]<99.5);
  // how far a box reaches into a lane: sample its footprint edge, return the push vector that clears it
  const push=b=>{let best=null;for(const l of lanes){const[a,c,w]=l,hw=(w||1.15)/2+.25,dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz)||1,nx=-dz/len,nz=dx/len;
      const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;// project the box on the lane normal
      const t=((cx-a[0])*dx+(cz-a[1])*dz)/(len*len);if(t<-.05||t>1.05)continue;
      const along=Math.abs(dx/len)*(b.max.x-b.min.x)/2+Math.abs(dz/len)*(b.max.z-b.min.z)/2;const tt=((cx-a[0])*dx+(cz-a[1])*dz)/len;if(tt+along<0||tt-along>len)continue;
      const side=(cx-a[0])*nx+(cz-a[1])*nz,half=Math.abs(nx)*(b.max.x-b.min.x)/2+Math.abs(nz)*(b.max.z-b.min.z)/2,gap=Math.abs(side)-half;
      if(gap<hw){const d=hw-gap,sg=side>=0?1:-1;if(!best||d>best.d)best={d,x:nx*sg*d,z:nz*sg*d};}}return best;};
  (gs||scene.children).forEach(g=>{if(!g.isGroup||!g.visible||g.children.length>60||g.userData.lane)return;(pxbLaneClear.seen=pxbLaneClear.seen||new Set()).add(g);const b=lbox(g);if(!b)return;const cx=(b.min.x+b.max.x)/2;
    if(cx>99.5||cx<-260||b.max.y-b.min.y<1.3||b.max.x-b.min.x>14||b.max.z-b.min.z>14)return;
    let hasWall=false;g.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'){const p=o.geometry.parameters;if(p.height>1.2&&Math.max(p.width,p.depth)>1.5)hasWall=true;}});if(!hasWall)return;
    let tot=null;for(let k=0;k<3;k++){const q=push(b);if(!q)break;b.min.x+=q.x;b.max.x+=q.x;b.min.z+=q.z;b.max.z+=q.z;tot=tot?{x:tot.x+q.x,z:tot.z+q.z}:{x:q.x,z:q.z};}
    if(!tot)return;const o0=lbox(g);
    // move the group (scene-local), its colliders and any loose parts standing inside its old footprint (signs, lamps, flowers)
    {const ins=new Set();g.traverse(o=>ins.add(o));const loose=[];scene.traverse(o=>{if(ins.has(o)||!o.isMesh||(o.userData&&o.userData.frames&&o.userData.frames.length>1))return;const q=lbox(o);if(q&&q.max.x-q.min.x<6&&q.min.x>=o0.min.x-.4&&q.max.x<=o0.max.x+.4&&q.min.z>=o0.min.z-.4&&q.max.z<=o0.max.z+.4&&q.max.y<=o0.max.y+.2)loose.push(o);});
      loose.forEach(o=>{V.set(tot.x,0,tot.z);const w=o.parent.worldToLocal(scene.localToWorld(V.clone())).sub(o.parent.worldToLocal(scene.localToWorld(new THREE.Vector3())));o.position.add(w);});}
    g.position.x+=tot.x;g.position.z+=tot.z;
    colliders.forEach(c=>{if(c.x1<1e8&&c.x1>=o0.min.x-.3&&c.x2<=o0.max.x+.3&&c.z1>=o0.min.z-.3&&c.z2<=o0.max.z+.3){c.x1+=tot.x;c.x2+=tot.x;c.z1+=tot.z;c.z2+=tot.z;}});
    n++;out.push([Math.round(cx),Math.round((o0.min.z+o0.max.z)/2),+tot.x.toFixed(2),+tot.z.toFixed(2)]);});
  pxbLaneClear.moved=out;window.__laneMoved=out;}
