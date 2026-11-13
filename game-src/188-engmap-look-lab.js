// ---------- Rottnest built with the real engines (Look Lab ?engmap until Paul approves) ----------
// Paul (14 Nov 2026): 'ทำ map ด้วย engine: Rottnest กับ outer world ทำเลย'. The island ground, grass and bike lanes come from the
// library engines themselves (parts 188-engine-*), not look-alikes:
//  - TerrainEngine: one ground surface from the island's own heights (the sea engine's bed: flat inland, sloping beaches), with the
//    island's footpaths (PATHS), the rail bed and the salt lakes drawn by the engine; covers land only, so the sea engine stays as it is.
//  - FoliageEngine: grass, flowers and bushes by ground kind (nothing on the sand, the paths or the lakes), kept clear of buildings.
//  - RoadEngine: the bike lanes as narrow island roads (sandy shoulders, smooth profile, joined where they meet).
// Under ?engmap the old 3D ground painting and the meadow tufts are hidden on Rottnest only. ENGMAP_LIVE turns it on for everyone.
const ENGMAP_LIVE=false;
const ENGMAP={on:(ENGMAP_LIVE||/[?&#]engmap\b/.test(location.search+location.hash))&&typeof TOON_ON!=='undefined'&&TOON_ON,done:false};
window.__ENGMAP=ENGMAP;
(function(){if(!ENGMAP.on)return;
  const isl=(x,z)=>x>TB.x1-6&&x<TB.x2+6&&z>TB.z1-6&&z<TB.z2+6;
  function hideOld(){/* meadow tufts already planted (the meadow part loads after this one, so only touch it once it exists) */
    try{MEADOW.on=false;if(MEADOW.chunks)MEADOW.chunks.forEach(ms=>(Array.isArray(ms)?ms:[ms]).forEach(m=>{if(m&&m.layers)m.layers.set(31);}));}catch(e){}
    try{scene.traverse(o=>{if(o.name==='paths3d')o.layers.set(31);});}catch(e){}}
  function laneLines(){/* the bike lanes: each old strip (kept hidden) becomes a line through its middle */const out=[];
    scene.children.forEach(o=>{if(!(o.userData&&o.userData.lane&&o.geometry&&o.geometry.type==='PlaneGeometry'))return;if(zoneOf(o.position.x)!=='island')return;const L=o.geometry.parameters.width;if(L<1.5)return;
      const a=o.rotation.z,cx=o.position.x,cz=o.position.z,dx=Math.cos(a)*L/2,dz=-Math.sin(a)*L/2;out.push([[cx-dx,cz-dz],[cx+dx,cz+dz]]);});
    /* strips that line up end to end become one lane */
    const same=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1.2;let merged=true;while(merged){merged=false;for(let i=0;i<out.length&&!merged;i++)for(let j=i+1;j<out.length&&!merged;j++){const A=out[i],B=out[j];
      if(same(A[A.length-1],B[0])){out[i]=A.concat(B.slice(1));out.splice(j,1);merged=true;}else if(same(B[B.length-1],A[0])){out[i]=B.concat(A.slice(1));out.splice(j,1);merged=true;}}}
    return out;}
  function occupied(){/* footprints of buildings and big props on the island, so plants keep clear of them */const B=new THREE.Box3(),inv=new THREE.Matrix4().copy(scene.matrixWorld).invert(),boxes=[];scene.updateMatrixWorld(true);
    scene.children.forEach(o=>{if(!o.visible||o.isLight||o.isCamera||o===ENGMAP.grp)return;if(o.name&&/^(sea|paths3d|engmap)/.test(o.name))return;try{B.setFromObject(o).applyMatrix4(inv);}catch(e){return;}
      const w=B.max.x-B.min.x,d=B.max.z-B.min.z,h=B.max.y-B.min.y;if(h<.8||w>40||d>40||w<.4||!isl((B.min.x+B.max.x)/2,(B.min.z+B.max.z)/2))return;boxes.push([B.min.x-.3,B.min.z-.3,B.max.x+.3,B.max.z+.3]);});return boxes;}
  function build(){const S4=SEA4,L=S4.L,t0=performance.now();
    const grp=new THREE.Group();grp.name='engmap';scene.add(grp);ENGMAP.grp=grp;
    const H=(x,z)=>S4.bedL(x,z);
    const paths=[];PATHS.forEach(p=>{if(p.length>1&&zoneOf(p[0][0])==='island')paths.push({pts:p,w:1,kind:'path'});});
    if(typeof WEST!=='undefined'&&WEST.rail&&WEST.rail.length>1)paths.push({pts:WEST.rail,w:1.7,kind:'gravel'});
    const lanes=laneLines();
    const x0=TB.x1-4,x1=TB.x2+4,z0=TB.z1-4,z1=TB.z2+4;
    /* ---- terrain ---- */
    ENGMAP.lakeAt=islOldLake;const T=TerrainEngine.create({size:[x1-x0,z1-z0],center:[(x0+x1)/2,(z0+z1)/2],res:.5,heightAt:H,seaLevel:L,paths,lakes:(x,z)=>islOldLake(x,z)?1:0});
    {/* inland only (behind the beaches): the sea engine's beaches and seabed stay exactly as they are */const g=T.mesh.geometry,P=g.attributes.position,I=g.index.array,keep=[];
      for(let i=0;i<I.length;i+=3){const a=I[i],b=I[i+1],c=I[i+2];/* inland only: the sea engine keeps its own beaches */if(Math.min(P.getY(a),P.getY(b),P.getY(c))>-.003)keep.push(a,b,c);}g.setIndex(keep);}
    T.mesh.position.y=.012;T.mesh.renderOrder=1;T.mesh.__pxSkip=1;T.mesh.__islKeep=1;T.mesh.receiveShadow=true;grp.add(T.mesh);ENGMAP.T=T;
    /* ---- roads: bike lanes ---- */
    const N=RoadEngine.create({scene:grp,heightAt:(x,z)=>Math.max(0,H(x,z))+.01,smooth:true});lanes.forEach(l=>N.road(l,{type:'bikepath'}));N.build();ENGMAP.N=N;
    grp.traverse(o=>{o.__pxSkip=1;o.__islKeep=1;});
    /* ---- foliage ---- */
    const boxes=occupied(),inBox=(x,z)=>boxes.some(b=>x>b[0]&&x<b[2]&&z>b[1]&&z<b[3]);
    const nearLine=(x,z,pts,r)=>{for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],vx=b[0]-a[0],vz=b[1]-a[1],l2=vx*vx+vz*vz||1e-6;let t=((x-a[0])*vx+(z-a[1])*vz)/l2;t=Math.max(0,Math.min(1,t));if(Math.hypot(a[0]+vx*t-x,a[1]+vz*t-z)<r)return true;}return false;};
    const kindAt=(x,z)=>{const k=T.groundKind(x,z);if(k!=='grass')return k;if(islOldLake(x,z))return'none';if(paths.some(p=>nearLine(x,z,p.pts,p.w/2+.25)))return'path';if(lanes.some(l=>nearLine(x,z,l,1.6)))return'path';return'grass';};
    const q=String((typeof GFX!=='undefined'&&GFX.level)||'').toLowerCase();
    const F=FoliageEngine.create({scene:grp,bounds:[x0,z0,x1,z1],heightAt:(x,z)=>Math.max(0,H(x,z))+.01,kindAt,keepOut:inBox,density:{tuft:1.4,flower:.25,bush:.06,tree:0},radius:q.startsWith('l')?26:36,chunk:10});
    if(q.startsWith('l')&&F.setQuality)F.setQuality(0);else if(q.startsWith('m')&&F.setQuality)F.setQuality(1);ENGMAP.F=F;
    hideOld();ENGMAP.done=true;ENGMAP.ms=Math.round(performance.now()-t0);console.log('ENGMAP built: paths '+paths.length+', lanes '+lanes.length+', junctions '+((N.junctions||[]).length)+', '+ENGMAP.ms+' ms');}
  let tStart=performance.now();
  (function loop(){requestAnimationFrame(loop);if(!ENGMAP.done)return;const t=(performance.now()-tStart)/1000,dt=1/60;
    if(ENGMAP.hold)return;const on=typeof zoneOf==='function'&&zoneOf(camTarget.x)==='island';ENGMAP.grp.visible=on;if(!on)return;
    try{ENGMAP.T.update&&ENGMAP.T.update(t);ENGMAP.F.update(t,camTarget.x,camTarget.z,{push:[camTarget.x,camTarget.z]});ENGMAP.N.update(t,dt);}catch(e){}
    if((ENGMAP.k=(ENGMAP.k||0)+1)%120===0)hideOld();})();
  (function wait(){if(typeof SEA4!=='undefined'&&SEA4.built&&SEA4.bedL&&typeof GROUND3D!=='undefined'&&GROUND3D.done&&performance.now()>20000){try{build();}catch(e){console.error('engmap',e);}return;}setTimeout(wait,1000);})();
})();
