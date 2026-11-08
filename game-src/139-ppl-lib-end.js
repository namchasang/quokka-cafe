/* PPL-LIB-END */

// ---------- Wellington St, four lanes with a median (Look Lab ?wel4): Perth Station moves 2.2 m north to make room ----------
function wel4Build(){const DZ=-2.2,X1=598,X2=702,Z1=-60,Z2=-20.8,V=new THREE.Vector3(),B=new THREE.Box3(),L=new THREE.Box3();scene.updateMatrixWorld(true);
  const lbox=o=>{B.setFromObject(o);if(B.isEmpty())return null;L.makeEmpty();for(const x of[B.min.x,B.max.x])for(const y of[B.min.y,B.max.y])for(const z of[B.min.z,B.max.z]){V.set(x,y,z);scene.worldToLocal(V);L.expandByPoint(V);}return L;};
  const moved=new Set();const walk=o=>{for(const c of o.children.slice()){if(c.isLight||c.isCamera)continue;const b=lbox(c);if(!b)continue;
      const flatRoad=b.max.y-b.min.y<.06&&b.max.x-b.min.x>12;const cz=(b.min.z+b.max.z)/2;
      // the whole north side of Wellington St (shops, the station, lamps, trees, the towers behind) moves north with the road
      if(b.min.x>=X1-.5&&b.max.x<=X2+.5&&b.max.z<=Z2&&cz<-21.25&&b.max.z-b.min.z<14&&!flatRoad){c.position.z+=DZ;moved.add(c);}else if(b.max.x>X1&&b.min.x<X2&&b.max.z>Z1&&b.min.z<Z2&&c.children.length)walk(c);}};
  walk(scene);
  colliders.forEach(c=>{if(c.x1>=X1-.5&&c.x2<=X2+.5&&c.z2<=Z2&&(c.z1+c.z2)/2<-21.25&&c.z1>-60){c.z1+=DZ;c.z2+=DZ;}});
  if(typeof CBD!=='undefined'&&CBD.cut)CBD.cut.forEach(e=>{for(let p=e.g;p;p=p.parent)if(moved.has(p)){e.z1+=DZ;e.ready=false;break;}});
  // the old one-way arrows and sign go
  scene.traverse(o=>{if(!o.isMesh)return;const b=lbox(o);if(!b)return;const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;
    if(Math.abs(cz+21.7)<.3&&b.max.y<.04&&b.min.y>.03&&b.max.x-b.min.x<1.2&&[628,648,684].some(x=>Math.abs(cx-x)<.6))o.visible=false;
    if(Math.abs(cx-624.4)<.4&&Math.abs(cz+20.54)<.12&&b.max.y>1)o.visible=false;});
  // new road surface, lanes, the median with gaps at William St, Barrack St and the station crossing
  const asph=(()=>{const c=mk(32,32),x=c.getContext('2d');x.fillStyle='#4a4d55';x.fillRect(0,0,32,32);const r=mulberry32(5);for(let i=0;i<90;i++){x.fillStyle=r()<.5?'#55585f':'#43464d';x.fillRect(r()*32|0,r()*32|0,1,1);}return c;})();
  const W=new THREE.MeshBasicMaterial({color:'#f2efe6'}),Y=new THREE.MeshBasicMaterial({color:'#e8c430'});
  const flat=(w,d,x,z,m,y)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);q.rotation.x=-Math.PI/2;q.position.set(x,y,z);q.receiveShadow=true;scene.add(q);return q;};
  const R1=-24.3,R2=-20.95,MZ=-22.65,MW=.55;
  flat(78,R2-R1,661,(R1+R2)/2,new THREE.MeshLambertMaterial({map:ctex(asph,{rep:[78,R2-R1]})}),.029);
  flat(78,-24.3+25.1,661,(-25.1-24.3)/2,lmat(paveC,[39,.4]),.029);// the station forecourt
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
  wel4Build.moved=moved.size;}
