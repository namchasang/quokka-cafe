// ---------- Island Scale: spread the island out (runs once, before the first frame) ----------
function islandWarp(){if(ISL.done)return;const t0=performance.now();
  scene.updateMatrixWorld(true);const bx=new THREE.Box3(),inIsl=(x,z)=>x<99.5&&x>-45&&z>-30&&z<40;
  const skip=new Set([water,sparkWater,shore,foam,terrain,waves,clouds].concat(ISL.skip||[]));
  const items=[];// {o,x1,x2,z1,z2,big}
  const consider=(o,depth)=>{if(skip.has(o)||o.__noWarp||o.isDirectionalLight||o.isHemisphereLight||o.isAmbientLight||o.isCamera)return;bx.setFromObject(o);
    if(bx.isEmpty()){if(o.children.length===0&&inIsl(o.position.x,o.position.z))items.push({o,x1:o.position.x,x2:o.position.x,z1:o.position.z,z2:o.position.z});return;}
    const cx=(bx.min.x+bx.max.x)/2,cz=(bx.min.z+bx.max.z)/2;if(!inIsl(cx,cz))return;
    const big=(bx.max.x-bx.min.x)>7||(bx.max.z-bx.min.z)>7;
    if(big){const inP=ISL.plat.some(p=>Math.hypot(bx.min.x-p.x,bx.min.z-p.z)<p.R&&Math.hypot(bx.max.x-p.x,bx.max.z-p.z)<p.R&&Math.hypot(bx.min.x-p.x,bx.max.z-p.z)<p.R&&Math.hypot(bx.max.x-p.x,bx.min.z-p.z)<p.R);
      if(!inP){if(o.children.length&&!o.geometry&&depth<3){o.children.slice().forEach(c=>consider(c,depth+1));return;}items.push({o,vert:true});return;}}
    items.push({o,x1:bx.min.x,x2:bx.max.x,z1:bx.min.z,z2:bx.max.z});};
  scene.children.slice().forEach(o=>consider(o,0));
  // group small neighbours so a sign stays on its post (cap a group at 6 units)
  const box=items.filter(i=>!i.vert);box.sort((a,b)=>a.x1-b.x1);const par=box.map((_,i)=>i),G=box.map(b=>({x1:b.x1,x2:b.x2,z1:b.z1,z2:b.z2}));
  const find=i=>{while(par[i]!==i){par[i]=par[par[i]];i=par[i];}return i;};
  for(let i=0;i<box.length;i++){const a=box[i];for(let j=i+1;j<box.length;j++){const b=box[j];if(b.x1>a.x2+.5)break;if(b.z1>a.z2+.5||b.z2<a.z1-.5)continue;
    const ra=find(i),rb=find(j);if(ra===rb)continue;const A=G[ra],B=G[rb];const x1=Math.min(A.x1,B.x1),x2=Math.max(A.x2,B.x2),z1=Math.min(A.z1,B.z1),z2=Math.max(A.z2,B.z2);if(x2-x1>6||z2-z1>6)continue;
    par[rb]=ra;G[ra]={x1,x2,z1,z2};}}
  const groups=new Map();box.forEach((b,i)=>{const r=find(i);let g=groups.get(r);if(!g){g={b:G[r],m:[]};groups.set(r,g);}g.m.push(b);});
  ISL.cl=[];
  groups.forEach(g=>{const b=g.b,cx=(b.x1+b.x2)/2,cz=(b.z1+b.z2)/2;const w=islNudge(cx,cz,isW(cx,cz)),dx=w[0]-cx,dz=w[1]-cz;
    g.m.forEach(it=>{const o=it.o,par=o.parent;if(par===scene)o.position.set(o.position.x+dx,o.position.y,o.position.z+dz);else{const v=new THREE.Vector3(dx,0,dz);const pq=new THREE.Quaternion();par.getWorldQuaternion(pq);v.applyQuaternion(pq.invert());const ps=new THREE.Vector3();par.getWorldScale(ps);v.divide(ps);o.position.add(v);}});
    ISL.cl.push({x1:b.x1-.9,x2:b.x2+.9,z1:b.z1-.9,z2:b.z2+.9,dx,dz});});
  // long things (beach mats, light strings, plankton): bend every vertex
  const v=new THREE.Vector3(),inv=new THREE.Matrix4();
  items.filter(i=>i.vert).forEach(it=>{it.o.traverse(m=>{if(!m.geometry||!m.geometry.attributes||!m.geometry.attributes.position)return;m.updateMatrixWorld(true);if(m.geometry.__shared){m.geometry=m.geometry.clone();}
    const P=m.geometry.attributes.position;inv.copy(m.matrixWorld).invert();for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(m.matrixWorld);const w=isW(v.x,v.z);v.x=w[0];v.z=w[1];v.applyMatrix4(inv);P.setXYZ(i,v.x,v.y,v.z);}
    P.needsUpdate=true;m.geometry.computeBoundingSphere();m.geometry.computeBoundingBox();});});
  ISL.done=true;ISL.t1=performance.now()-t0;
  islandData();
  islandGround();
  ISL.late.forEach(f=>{try{f();}catch(e){console.warn('islandLate',e);}});
  try{mmBase=renderMapBase(mmFW(),mmFH(),1.15,false);bigBase=null;}catch(e){}
  ISL.ms=Math.round(performance.now()-t0);}
// colliders and data written in the original layout
function islandData(){
  colliders.forEach(c=>{if(c.real){const r={x1:c.real[0],z1:c.real[1],x2:c.real[2],z2:c.real[3]};iwR(r);c.real=[r.x1,r.z1,r.x2,r.z2];if(c.x1<1e8){c.x1=r.x1;c.z1=r.z1;c.x2=r.x2;c.z2=r.z2;}return;}if(c.x1>-45&&c.x2<99.5&&c.z2<40&&c.z1>-30)iwR(c);});
  // paths that run into a place that moves are cut where they cross its edge (the bus road joins them up again)
  for(let i=PATHS.length-1;i>=0;i--){const P=PATHS[i];if(!P.length||P[0][0]>=99.5)continue;const parts=[];let cur=[P[0]];for(let k=1;k<P.length;k++){if(islDist(P[k][0],P[k][1])!==islDist(P[k-1][0],P[k-1][1])){if(cur.length>1)parts.push(cur);cur=[P[k]];}else cur.push(P[k]);}if(cur.length>1)parts.push(cur);
    if(parts.length!==1||parts[0].length!==P.length){PATHS.splice(i,1,...parts);}}
  PATHS.forEach(iwPts);
  (ISL.data||[]).forEach(f=>{try{f();}catch(e){console.warn('islandData',e);}});}
