// ---- bike lane in front of the café: cyclists ride here, never across the deck ----
// bends out round the café front (the Lv4 terrace and benches sit on z 3.6-5.5)
const BIKE_LANE=[[-12.5,4.6],[-6.6,4.6],[-5,6.5],[5,6.5],[6.4,4.6],[9.6,4.6],[13,1.2],[18,.9]];const BLANES=[];let laneStrip=()=>{};
(()=>{const c=mk(64,32),x=c.getContext('2d');x.fillStyle='#b5523b';x.fillRect(0,0,64,32);const r=mulberry32(55);for(let i=0;i<120;i++){x.fillStyle=r()<.5?'#a8472f':'#c25f46';x.fillRect(r()*64|0,r()*32|0,2,2);}
  x.fillStyle='#f6efe0';x.fillRect(0,1,64,2);x.fillRect(0,29,64,2);for(let i=0;i<64;i+=16)x.fillRect(i,15,9,2);
  const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.wrapS=THREE.RepeatWrapping;
  const ic=mk(32,32),ix=ic.getContext('2d');ix.fillStyle='#f6efe0';const ring=(cx,cy)=>{ix.fillRect(cx-4,cy-1,8,2);ix.fillRect(cx-1,cy-4,2,8);ix.fillRect(cx-3,cy-3,2,2);ix.fillRect(cx+1,cy-3,2,2);ix.fillRect(cx-3,cy+1,2,2);ix.fillRect(cx+1,cy+1,2,2);};
  ring(8,20);ring(24,20);ix.fillRect(8,12,10,2);ix.fillRect(16,12,2,8);ix.fillRect(12,10,8,2);ix.fillRect(20,10,2,10);ix.fillRect(22,9,4,2);
  const itex=new THREE.CanvasTexture(ic);itex.magFilter=THREE.NearestFilter;const imat=new THREE.MeshLambertMaterial({map:itex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6});
  const capMs={};const capM=thin=>capMs[thin]||(capMs[thin]=new THREE.MeshLambertMaterial({color:thin?0xc4573e:0xb5523b,polygonOffset:true,polygonOffsetFactor:thin?-2:-1,polygonOffsetUnits:thin?-2:-1}));
  laneStrip=(a,b,w,icons,y)=>{const n0=scene.children.length,w0=w,y0=y;w=w||1.15;y=y||.021;const len=Math.hypot(b[0]-a[0],b[1]-a[1]);const t=tex.clone();t.needsUpdate=true;t.repeat.set(len/2,1);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(len,w),w<.9?new THREE.MeshLambertMaterial({color:0xc4573e,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}):new THREE.MeshLambertMaterial({map:t,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));m.rotation.x=-Math.PI/2;m.rotation.z=-Math.atan2(b[1]-a[1],b[0]-a[0]);m.position.set((a[0]+b[0])/2,y,(a[1]+b[1])/2);m.receiveShadow=true;scene.add(m);
    // round caps so lanes meet at corners without a gap
    [a,b].forEach(e=>{const cap=new THREE.Mesh(new THREE.CircleGeometry(w/2,14),capM(w<.9));cap.rotation.x=-Math.PI/2;cap.position.set(e[0],y-.001,e[1]);cap.receiveShadow=true;scene.add(cap);});if(w<.9)for(let d=2;d<len-1;d+=6){const k=d/len;const q=new THREE.Mesh(new THREE.PlaneGeometry(.5,.5),imat);q.rotation.x=-Math.PI/2;q.rotation.z=-Math.atan2(b[1]-a[1],b[0]-a[0]);q.scale.setScalar(Math.min(1,w/.5));q.position.set(a[0]+(b[0]-a[0])*k,y+.004,a[1]+(b[1]-a[1])*k);scene.add(q);}BLANES.push([a,b,w]);
    if(icons!==false&&w>.9&&len>8)for(let d=3;d<len-1;d+=7){const k=d/len;const q=new THREE.Mesh(new THREE.PlaneGeometry(.8,.8),imat);q.rotation.x=-Math.PI/2;q.rotation.z=-Math.atan2(b[1]-a[1],b[0]-a[0]);q.position.set(a[0]+(b[0]-a[0])*k,y+.005,a[1]+(b[1]-a[1])*k);scene.add(q);}
    scene.children.slice(n0).forEach(m=>m.userData.lane=1);
    if(!ISL.done&&a[0]<99.5){const ms=scene.children.slice(n0);ms.forEach(m=>m.__noWarp=true);(ISL.strips=ISL.strips||[]).push({a:a.slice(),b:b.slice(),w:w0,icons,y:y0,meshes:ms});BLANES[BLANES.length-1].__isl=1;}};
  const run=(pts,w,icons,y)=>{for(let i=0;i<pts.length-1;i++)laneStrip(pts[i],pts[i+1],w,icons,y);};
  run(BIKE_LANE);
  // Rottnest: on along the main road and out to Geordie Bay
  run([[18,.9],[31,.3],[36,1.2],[40.5,-1.2],[45.4,-2.6],[50,-1.2],[58,-.2],[68,.4],[80,1],[91,1.6]]);
  // South Perth: foreshore shared path, and painted lanes on both sides of Mill Point Road
  [[[103,-.9],[117.5,-.9]],[[124.5,-.9],[141.8,-.9]],[[156,-.9],[198,-.9]]].forEach(p=>run(p));
  run([[113,21.25],[200,21.25]],.46,false,.03);run([[113,23.15],[200,23.15]],.46,false,.03);
  // Heirisson Island: lane beside the main path
  run([[405,4],[432,4]]);
  // Fremantle: painted lanes along the streets
  run([[278.5,-2.75],[320.5,-2.75]],.36,false,.03);run([[278.5,-1.25],[320.5,-1.25]],.36,false,.03);run([[280,5.15],[304,5.15]],.34,false,.03);run([[304,21.05],[334,21.05]],.34,false,.03);
  run([[302.95,-3],[302.95,21]],.36,false,.03);run([[305.05,-3],[305.05,21]],.36,false,.03);
  // Victoria Park: painted lanes on both sides of Albany Highway
  run([[489,-.92],[561,-.92]],.46,false,.03);run([[489,.92],[561,.92]],.46,false,.03);})();
function spawnRider(){if(riders.length>=6)return;const m=spriteMesh([riderCv[riders.length%4]],1.6,1.8);scene.add(m);riders.push({m,...IW(-12.5,4.6),path:BIKE_LANE.slice(1).concat([[31,.3],[35,3.5]]).map(([a,b])=>[IWx(a,b),IWz(a,b)]),walkT:0,face:1});}

// ---------- beach hammock with orange juice ----------
const BEACH=LOTS.beach;let juiceMesh;
(()=>{const x0=BEACH.x,z0=BEACH.z;[-1.45,1.45].forEach(s=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,1.7,8),legMat);p.position.set(x0+s,.85,z0);p.castShadow=true;scene.add(p);col(x0+s-.15,z0-.15,x0+s+.15,z0+.15);});
  const nc=mk(16,16),nx=nc.getContext('2d');for(let i=0;i<16;i++)for(let j=0;j<16;j++){nx.fillStyle=(i+j)%4<2?'#f6ead2':'#5cc6d8';nx.fillRect(i,j,1,1);}
  const net=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,2.6,14,1,true,Math.PI*.15,Math.PI*.7),lmat(nc,[3,2],{side:THREE.DoubleSide}));net.rotation.z=Math.PI/2;net.rotation.x=Math.PI;net.position.set(x0,1.05,z0);net.castShadow=true;scene.add(net);
  box(.55,.5,.55,lmat(counterC,[1,1]),x0+2.1,.25,z0+.1);col(x0+1.8,z0-.2,x0+2.4,z0+.4);
  const glass=new THREE.Mesh(new THREE.CylinderGeometry(.09,.075,.26,10),new THREE.MeshLambertMaterial({color:0xe8f6ff,transparent:true,opacity:.55}));glass.position.set(x0+2.1,.63,z0+.1);scene.add(glass);
  juiceMesh=new THREE.Mesh(new THREE.CylinderGeometry(.08,.068,.22,10),new THREE.MeshLambertMaterial({color:0xffa21e,emissive:0x442200}));juiceMesh.geometry.translate(0,.11,0);juiceMesh.position.set(x0+2.1,.51,z0+.1);scene.add(juiceMesh);
  const straw=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.36,5),new THREE.MeshLambertMaterial({color:0xe8457a}));straw.position.set(x0+2.14,.72,z0+.1);straw.rotation.z=-.25;scene.add(straw);
  const sl=new THREE.Mesh(new THREE.TorusGeometry(.06,.02,6,10,Math.PI),new THREE.MeshLambertMaterial({color:0xffd34d}));sl.position.set(x0+2.02,.76,z0+.1);scene.add(sl);})();

