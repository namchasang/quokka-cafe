// ---------- see-through: roofs and walls between the camera and Kip fade while he is on a platform or riding ----------
// (the platforms sit behind the shop rows, and the camera looks from the south; same idea as the city's cbdSeeThrough)
const _mtrRay=new THREE.Ray(),_mtrV=new THREE.Vector3(),_mtrT=new THREE.Vector3();
function mtrSeeList(s){const D=s.D,pz=mtrPZ(D),mx=scene.scale.x<0?-1:1,L=[],bx=new THREE.Box3(),bb=new Set(BB);
  const skip=new Set();if(typeof CBD!=='undefined'&&CBD.cut)CBD.cut.forEach(e=>skip.add(e.g));Object.values(MTR.st).forEach(q=>{skip.add(q.sg);skip.add(q.g);});
  scene.updateMatrixWorld(true);
  const walk=o=>{if(skip.has(o)||o.visible===false)return;if(o.isMesh&&!o.isInstancedMesh&&!bb.has(o)&&o.material){bx.setFromObject(o);
      if(!bx.isEmpty()){const x1=Math.min(bx.min.x*mx,bx.max.x*mx),x2=Math.max(bx.min.x*mx,bx.max.x*mx);
        if(x2>D.px1-6&&x1<D.px2+6&&bx.max.z>pz+D.pd-.6&&bx.min.z<pz+D.pd+18&&bx.max.y>2.2&&x2-x1<45&&bx.max.z-bx.min.z<30){
          const mats=[];const cl=m=>{m=m.clone();m.userData.op0=m.opacity;m.userData.tr0=m.transparent;mats.push(m);return m;};
          o.material=Array.isArray(o.material)?o.material.map(cl):cl(o.material);L.push({m:o,box:bx.clone(),mats,a:1});}}}
    for(const c of o.children)walk(c);};
  scene.children.forEach(walk);s.cut=L;s.cutMx=mx;}
function mtrSeeThrough(dt,zq){if(MTR.see===false)return;const k=Math.min(1,dt*6);
  for(const key in MTR.st){const s=MTR.st[key];const D=s.D,pz=mtrPZ(D);
    const R=MTR.ride,riding=R&&(key===R.from&&R.st!=='arrive'&&R.st!=='alight'||key===R.to&&(R.st==='arrive'||R.st==='alight'));
    const on=zq===key&&(riding||player.z>pz-1.5&&player.z<pz+D.pd+1&&player.x>D.px1-2&&player.x<D.px2+2);
    if(on&&(!s.cut||s.cutMx!==(scene.scale.x<0?-1:1)))mtrSeeList(s);if(!s.cut)continue;
    const mx=scene.scale.x<0?-1:1;
    for(const e of s.cut){let hit=false;if(on&&e.m.visible!==false){for(const hy of[.4,1.1]){_mtrT.set(player.x*mx,hy+(R?MTR.FLOOR:0),player.z);_mtrRay.origin.copy(camera.position);_mtrRay.direction.copy(_mtrT).sub(camera.position);const L=_mtrRay.direction.length();_mtrRay.direction.normalize();
        const p=_mtrRay.intersectBox(e.box,_mtrV);if(p&&camera.position.distanceTo(p)<L-.3){hit=true;break;}}}
      const tg=hit?.2:1;if(Math.abs(e.a-tg)<.005)continue;e.a+=(tg-e.a)*k;if(Math.abs(e.a-tg)<.01)e.a=tg;
      for(const m of e.mats){const solid=e.a>.995;m.transparent=solid?m.userData.tr0:true;m.opacity=solid?m.userData.op0:Math.min(m.userData.op0,e.a);m.depthWrite=solid;m.needsUpdate=m.needsUpdate||solid!==m.userData.wasSolid;m.userData.wasSolid=solid;}}}}
// ---------- Siam Sydney Services (Paul, Oct 2026): a tour desk in Tudor Lane, day tours to WA towns we have models of ----------
// The tour is a day out: the tour van leaves Tudor Lane, you look round the town model with the guide, then you're back by evening.
const TOURS=[{id:'lancelin',name:'Lancelin Sand Dunes',price:600,hrs:7,note:'White dunes, sandboarding and crays on the Indian Ocean Drive',
    guide:['Guide: Welcome to Lancelin! These white dunes are some of the tallest on the coast.','Guide: Grab a board and slide down. Mind the kite surfers on the water!','Guide: The little jetty is where the cray boats come in at dawn.']},
  {id:'pinnacles',name:'The Pinnacles',price:900,hrs:9,note:'Thousands of limestone spires in yellow sand, emus at sunset',
    guide:['Guide: These spires are limestone, shaped by wind and rain over a very long time.','Guide: Keep an eye out: emus and kangaroos cross the desert loop at dusk.','Guide: Stay on the track, the sand is softer than it looks!']},
  {id:'busselton',name:'Busselton Jetty',price:800,hrs:8,note:'A long timber jetty with its own little train and an underwater observatory',
    guide:['Guide: The jetty runs almost two kilometres out over the bay.','Guide: Hop on the little train to the end, then go down under the water.','Guide: The beach huts along the foreshore are painted every colour.']},
  {id:'esperance',name:'Esperance · Lucky Bay',price:2000,hrs:12,note:'The whitest sand, turquoise water and kangaroos on the beach',
    guide:['Guide: That sand squeaks when you walk on it. It is that white!','Guide: The kangaroos here love the beach. Please don’t feed them.','Guide: Those granite headlands glow pink when the sun goes down.']}];
const TOUR_DESK={x:655.6-.55,z:-9.4};
// the office in the lane: a sign on the wall, a little counter, a stand of brochures
{const wx=655.6-1.08,sg=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.42),new THREE.MeshBasicMaterial({map:makeSign(['SIAM SYDNEY SERVICES'],96,12,'#1d3a6e','#ffd34d')}));sg.rotation.y=Math.PI/2;sg.position.set(wx+.02,2.25,TOUR_DESK.z);scene.add(sg);
  const sb=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.3),new THREE.MeshBasicMaterial({map:makeSign(['DAY TOURS · WA'],64,12,'#f5ecd8','#1d3a6e')}));sb.rotation.y=Math.PI/2;sb.position.set(wx+.02,1.9,TOUR_DESK.z);scene.add(sb);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(.45,.8,1.1),new THREE.MeshLambertMaterial({color:new THREE.Color('#6a4a32')}));desk.position.set(wx+.25,.4,TOUR_DESK.z);desk.castShadow=desk.receiveShadow=true;scene.add(desk);
  const top=new THREE.Mesh(new THREE.BoxGeometry(.5,.05,1.15),new THREE.MeshLambertMaterial({color:new THREE.Color('#f5ecd8')}));top.position.set(wx+.25,.82,TOUR_DESK.z);scene.add(top);
  const bc=mk(8,12),bx=bc.getContext('2d');['#e8732a','#3e9ad8','#f2c428','#3ec46a'].forEach((c,i)=>{bx.fillStyle=c;bx.fillRect((i%2)*4,(i>>1)*6,4,6);bx.fillStyle='#f5ecd8';bx.fillRect((i%2)*4+1,(i>>1)*6+1,2,1);});
  const br=new THREE.Mesh(new THREE.PlaneGeometry(.4,.6),new THREE.MeshLambertMaterial({map:ctex(bc)}));br.rotation.y=Math.PI/2;br.position.set(wx+.03,1.25,TOUR_DESK.z+.9);scene.add(br);}
