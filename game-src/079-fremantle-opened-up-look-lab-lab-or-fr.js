// ---------- Fremantle opened up (Look Lab ?lab or ?freo4, Paul Oct 2026: as easy to walk as the city) ----------
// The southern streets, back lane and cross streets become walkable, and thin posts (verandah posts, poles, bollards) stop blocking the footpaths.
var FREO4_LIVE=false;const FREO4_ON=FREO4_LIVE||/[?&#](lab|freo4|freo5)\b/.test(location.search+location.hash);
if(FREO4_ON&&FDET.on&&FHOMES_ON){
  const R=[[270,356,21.4,28.1],[270,356,38.7,42.9],[272,355.5,32.8,34.05],[302.6,305.4,21.4,42.9],[318.6,321.4,21.4,42.9],[334.8,337.6,21.4,42.9]];
  const _fw4=freoWalk;freoWalk=function(x,z){if(_fw4(x,z))return true;return R.some(r=>x>r[0]&&x<r[1]&&z>r[2]&&z<r[3]);};
  for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];if(c.x2<262||c.x1>362||c.z2<-30||c.z1>50)continue;if(c.x2-c.x1<=.32&&c.z2-c.z1<=.32)colliders.splice(i,1);}
  if(typeof FB!=='undefined'){FB.z2=Math.max(FB.z2,43.6);FB.x2=Math.max(FB.x2,357);}// the town wall goes round the new streets too
}
// ---------- Fremantle re-planned (Look Lab ?lab or ?freo5, Paul Oct 2026: as easy to walk as the city) ----------
// The old town core is rebuilt on a clean grid like Perth CBD: Phillimore St along the harbour, High St from the Round House,
// Market St, South Terrace (the Cappuccino Strip), William St and Parry St; Kings Square with the Town Hall and St John's,
// the Esplanade park with the wheel, the prison forecourt and a hilltop park. Wide footpaths (1.6), roads 2.4, plazas.
// Every shop door, NPC and story spot stays where it was, so the story and quests work unchanged.
var FREO5_LIVE=false;const FREO5_ON=FREO5_LIVE||/[?&#](lab|freo5)\b/.test(location.search+location.hash);
if(FREO5_ON&&FDET.on)(()=>{
  const RX1=274.4,RX2=357.5,RZ1=-14.6,RZ2=21.45;// the core rectangle that is rebuilt
  const KEEP=[[292.8,302.2,-13.1,-10.1]];// Fremantle station stays as it is
  const inR=(x,z)=>x>RX1&&x<RX2&&z>RZ1&&z<RZ2,kept=(x,z)=>KEEP.some(k=>x>k[0]&&x<k[1]&&z>k[2]&&z<k[3]);
  const NPCP=(typeof FREO_NPCS!=='undefined'?FREO_NPCS:[]).map(n=>[n.x,n.z]);
  // 1. take the old core away: meshes, sprites, lights and instances inside the rectangle (not characters, not the sea or big ground)
  {const sx=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);const bx=new THREE.Box3(),c=new THREE.Vector3(),sz=new THREE.Vector3(),m4=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
    const hide=[];scene.traverse(o=>{if(o===scene)return;
      if(o.isLight&&!o.isDirectionalLight&&!o.isHemisphereLight&&!o.isAmbientLight){o.getWorldPosition(c);if(inR(c.x,c.z)&&!kept(c.x,c.z))hide.push(o);return;}
      if(o.isInstancedMesh){let n=0;for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);m4.decompose(p,q,s);p.applyMatrix4(o.matrixWorld);if(inR(p.x,p.z)&&!kept(p.x,p.z)){m4.compose(p.set(0,-50,0),q,s.set(0,0,0));o.setMatrixAt(i,m4);n++;}}if(n)o.instanceMatrix.needsUpdate=true;return;}
      if(!(o.isMesh||o.isSprite))return;if(o.userData.frames)return;bx.setFromObject(o);if(bx.isEmpty())return;bx.getCenter(c);bx.getSize(sz);
      if((sz.x>40||sz.z>40)&&!(Math.min(sz.x,sz.z)<6&&bx.max.y<.2))return;if((sz.x>40||sz.z>40)){if(c.z<RZ1||c.z>RZ2)return;}else if(!inR(c.x,c.z)||kept(c.x,c.z))return;if(bx.max.y<.12&&NPCP.some(([x,z])=>Math.hypot(x-c.x,z-c.z)<.35))return;hide.push(o);});
    hide.forEach(o=>{o.visible=false;o.userData.freo5Hidden=1;});scene.scale.x=sx;scene.updateMatrixWorld(true);FDET.freo5Hidden=hide.length;
    for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(inR(t.x,t.z)&&!t.m.visible)trees.splice(i,1);}}
  for(let i=colliders.length-1;i>=0;i--){const c=colliders[i],cx=(c.x1+c.x2)/2,cz=(c.z1+c.z2)/2;if(inR(cx,cz)&&!kept(cx,cz))colliders.splice(i,1);}
  // 2. helpers
  const G=new THREE.Group();scene.add(G);FDET.freo5=G;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.nc);m.receiveShadow=true;G.add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(r1,r2,h,s)=>new THREE.CylinderGeometry(r1,r2,h,s||10);
  const paint=(x1,x2,z1,z2,mat,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(x2-x1,z2-z1),mat);m.rotation.x=-Math.PI/2;m.position.set((x1+x2)/2,y||.035,(z1+z2)/2);m.receiveShadow=true;G.add(m);return m;};
  const tile=(c,w,d,k)=>lmat(c,[Math.max(1,w/(k||2)),Math.max(1,d/(k||2))]);
  const rnd=mulberry32(5150),pick=a=>a[(rnd()*a.length)|0];
  const block=(x1,z1,x2,z2)=>col(x1,z1,x2,z2);
  // 3. ground: roads, kerbs, footpaths, plazas, park
  const road=(x1,x2,z1,z2,ns)=>{paint(x1,x2,z1,z2,tile(asphC,x2-x1,z2-z1,3),.036);const L=ns?z2-z1:x2-x1;for(let t=1;t<L-1;t+=2.2){if(ns)paint((x1+x2)/2-.05,(x1+x2)/2+.05,z1+t,z1+t+1,M('#f3f3ea'),.04);else paint(x1+t,x1+t+1,(z1+z2)/2-.05,(z1+z2)/2+.05,M('#f3f3ea'),.04);}
    if(ns){[x1,x2].forEach(x=>paint(x-.06,x+.06,z1,z2,M('#b8b2a4'),.041));}else{[z1,z2].forEach(z=>paint(x1,x2,z-.06,z+.06,M('#b8b2a4'),.041));}};
  const fp=(x1,x2,z1,z2)=>paint(x1,x2,z1,z2,tile(paveC,x2-x1,z2-z1,1.6),.033);
  const zebra=(x,z,ns,w)=>{for(let k=0;k<6;k++){const o=-w/2+.25+k*(w-.5)/5;if(ns)paint(x-1.2,x+1.2,z+o-.12,z+o+.12,M('#f6f6f0'),.043);else paint(x+o-.12,x+o+.12,z-1.2,z+1.2,M('#f6f6f0'),.043);}};
  // footpaths first (wide pale pavers), then roads on top
  fp(279,333.4,-9.8,-4.2);fp(281,299.8,-1.2,4.4);fp(294.2,299.8,-5.8,21.4);fp(302.6,308.2,8.6,21.4);fp(315.2,320.8,-14.4,21.4);fp(328.2,333.8,-5.8,21.4);
  paint(299.8,315.2,-4.2,8.6,tile(pavC,15.4,12.8,2.2),.034);// Kings Square
  paint(286.4,292.9,-14.4,-9.8,tile(paveC,6.5,4.6,1.6),.034);// the quay plaza by the ferry gangway
  paint(308.2,315.2,17.0,19.4,tile(pavC,7,2.4,2),.034);paint(320.8,328.2,8.4,13.4,tile(pavC,7.4,5,2),.034);// market and prison forecourts
  paint(275,294.2,4.4,21.4,tile(grassC,19.2,17,2.2),.03);paint(274.6,281,-4.2,4.4,tile(grassC,6.4,8.6,2.2),.03);paint(333.8,357,-5.8,21.4,tile(grassC,23,27,2.2),.03);
  road(279,333.4,-8.2,-5.8);road(281,295.8,.4,2.8);road(295.8,298.2,-5.8,21.4,1);road(304.2,306.6,8.6,21.4,1);road(316.8,319.2,-14.4,21.4,1);road(329.8,332.2,-5.8,21.4,1);
  zebra(297,-7,0,2.4);zebra(318,-7,0,2.4);zebra(297,1.6,1,2.4);zebra(305.4,9.6,0,2.4);zebra(318,9,0,2.4);
  // paths through the Esplanade and up the hill
  paint(280.5,281.5,4.4,21.4,tile(pathC,1,17,1.2),.031);paint(276,294.2,15.6,16.6,tile(pathC,18,1,1.2),.031);paint(333.8,357,9,10,tile(pathC,23,1,1.2),.031);paint(344,345,-5.8,21.4,tile(pathC,1,27,1.2),.031);
  // street names
  [[300.6,-4.6,'PHILLIMORE ST'],[281.6,4.8,'HIGH ST'],[294.6,-4.8,'MARKET ST'],[302.8,8.9,'SOUTH TCE'],[315.4,-4.8,'WILLIAM ST'],[328.4,-4.8,'PARRY ST']].forEach(([x,z,t])=>signPost(x,z,makeSign([t],Math.max(48,t.length*6+8),10,'#1d3a6e','#ffffff'),1.6,.3));
  // 4. Victorian and Spanish-style shops: two storeys, a painted front (shopfront, sash windows, parapet with the name), a bullnose verandah on posts
  const WALL=['#efe3c4','#e8d8b0','#b9c8a8','#b8d4d8','#e8b8b0','#f2dc96','#d08a62','#c89878','#e2d6c0','#d8c0a0'],TRIM='#f6f2e8',DOOR=['#2c4a3a','#8a2a2a','#1d3a6e','#5a3a22','#3a5a6a'];
  const NAMES=['HARBOUR LANE BOOKS','OLD PORT BAKERY','ESPLANADE OP SHOP','THE CAPTAIN’S PUB','SALT & PEPPER DELI','FREO RECORD BAR','SEA CHEST ANTIQUES','THE GALLEY CAFE','MOORINGS HOTEL','TIDE & TALLOW','CRAY POT GRILL','LIMESTONE GALLERY','SPICE WHARF','CORNER NEWSAGENT','PORTSIDE SHOES','THE TEA CADDY','HARBOURMASTER BAR','DUNE SURF SHOP','LACE & IRON','BOTTLE-O 1898','FISHERMAN’S PIZZA','CHANDLERY','PORT GELATO','BLUE DOOR BOOKS'];let ni=0;
  function facade(w,h,storeys,wall,name,spanish,door){const S=8,c=mk(Math.round(w*S),Math.round(h*S)),x=c.getContext('2d'),W=c.width,H=c.height;x.fillStyle=wall;x.fillRect(0,0,W,H);
    for(let i=0;i<W*H/14;i++){x.fillStyle=rnd()<.5?'rgba(0,0,0,.05)':'rgba(255,255,255,.06)';x.fillRect(rnd()*W|0,rnd()*H|0,1,1);}
    const fh=H/storeys;x.fillStyle=TRIM;x.fillRect(0,H-fh-2,W,2);// string course
    // ground floor: shopfront glass on a dark base, door, transom
    const gy=H-fh;x.fillStyle='#3a2a22';x.fillRect(3,gy+fh*.18,W-6,fh*.82);x.fillStyle='#4a6a86';x.fillRect(5,gy+fh*.22,W-10,fh*.52);x.fillStyle='rgba(200,230,255,.5)';x.fillRect(6,gy+fh*.24,3,fh*.3);
    for(let k=1;k<4;k++){x.fillStyle='#3a2a22';x.fillRect(5+(W-10)*k/4,gy+fh*.22,1,fh*.52);}x.fillStyle=door;const dw=Math.max(6,W*.16);x.fillRect(W/2-dw/2,gy+fh*.3,dw,fh*.7);x.fillStyle='#e8d8a0';x.fillRect(W/2+dw/2-3,gy+fh*.62,1,2);
    // upper floors: sash windows (arched for the Spanish style), sills, shutters now and then
    for(let f=1;f<storeys;f++){const fy=H-fh*(f+1);const n=Math.max(2,Math.round(w/1.3));for(let k=0;k<n;k++){const wx=(W/n)*(k+.5)-4,wy=fy+fh*.22,ww=8,wh=fh*.5;x.fillStyle=TRIM;x.fillRect(wx-1,wy-1,ww+2,wh+2);if(spanish){x.beginPath();x.arc(wx+ww/2,wy,ww/2+1,Math.PI,0);x.fill();}
      x.fillStyle='#3a4a5a';x.fillRect(wx,wy,ww,wh);if(spanish){x.beginPath();x.arc(wx+ww/2,wy,ww/2,Math.PI,0);x.fill();}x.fillStyle='rgba(200,230,255,.45)';x.fillRect(wx+1,wy+1,2,wh*.4);x.fillStyle=TRIM;x.fillRect(wx,wy+wh/2,ww,1);x.fillRect(wx-2,wy+wh+1,ww+4,2);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(wx-1,wy+wh+3,ww+2,1);}}
    // parapet band with the name
    x.fillStyle=TRIM;x.fillRect(0,0,W,3);if(name){x.fillStyle=wall;x.fillRect(4,3,W-8,10);x.fillStyle='#3a2a22';x.font='bold 7px monospace';x.textAlign='center';x.fillText(name.length*4.2>W-8?name.split(' ')[0]:name,W/2,11);}
    x.fillStyle='rgba(0,0,0,.14)';x.fillRect(0,H-3,W,3);return ctex(c);}
  // one shop: body w x d, h, facing dir (unit vector out of the front), centre of front edge at (fx,fz)
  function shop(fx,fz,dir,w,d,o){o=o||{};const storeys=o.storeys||(rnd()<.75?2:1),h=storeys===2?3.7:2.4,wall=o.wall||pick(WALL),spanish=o.spanish!=null?o.spanish:rnd()<.3;const name=o.name!==undefined?o.name:NAMES[(ni++)%NAMES.length];
    const ry=Math.atan2(dir[0],dir[1]);const cx=fx-dir[0]*d/2,cz=fz-dir[1]*d/2;const ft=facade(w,h,storeys,wall,name,spanish,o.door||pick(DOOR));
    const plain=M(wall),mats=[plain,plain,M(o.roof||pick(['#a8acb0','#9aa0a6','#b8562e','#8a8e94'])),plain,new THREE.MeshLambertMaterial({map:ft}),plain];
    const g=new THREE.Group();g.position.set(cx,0,cz);g.rotation.y=ry;G.add(g);const b=new THREE.Mesh(B(w,h,d),mats);b.position.y=h/2;b.castShadow=b.receiveShadow=true;g.add(b);
    // parapet shape: stepped or curved for some
    if(storeys===2&&rnd()<.6){const pw=w*.5,ph=spanish?.7:.5;const sp=new THREE.Mesh(spanish?new THREE.CylinderGeometry(pw/2,pw/2,.18,16,1,false,-Math.PI/2,Math.PI):B(pw,ph,.18),M(wall));if(spanish){sp.rotation.x=Math.PI/2;sp.position.set(0,h,d/2-.09);}else sp.position.set(0,h+ph/2,d/2-.09);g.add(sp);}
    const cor=new THREE.Mesh(B(w+.08,.12,.22),M(TRIM));cor.position.set(0,h-.06,d/2-.05);g.add(cor);
    // verandah: posts at the kerb, a curved tin roof, lacework frieze (verandah over the footpath, no collider)
    if(o.ver!==false){const vd=o.vd||1.35,vh=2.35,vc=o.vc||pick(['#2c4a3a','#1d3a6e','#5a2a22','#3a3a3a','#f6f2e8']);const roof=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,w,10,1,true,0,Math.PI/2),new THREE.MeshLambertMaterial({color:new THREE.Color(pick(['#b8bcc0','#a8acb0','#c87050','#9aa4ac'])),side:THREE.DoubleSide}));
      roof.rotation.z=Math.PI/2;roof.position.set(0,vh,d/2+vd-.5);roof.castShadow=true;g.add(roof);const fl=new THREE.Mesh(B(w,.05,vd-.5),roof.material);fl.position.set(0,vh+.5,d/2+(vd-.5)/2);fl.rotation.x=.05;fl.castShadow=true;g.add(fl);
      const n=Math.max(1,Math.round(w/2.2));for(let k=0;k<=n;k++){const px=-w/2+.08+k*(w-.16)/n;const pst=new THREE.Mesh(C(.04,.05,vh,6),M(vc));pst.position.set(px,vh/2,d/2+vd-.08);pst.castShadow=true;g.add(pst);}
      const lc=mk(16,6),lx=lc.getContext('2d');lx.strokeStyle=vc==='#f6f2e8'?'#e8e4d8':'#d8dcd4';lx.lineWidth=1;for(let k=0;k<4;k++){lx.beginPath();lx.arc(2+k*4,3,2,0,6.28);lx.stroke();}const lt=ctex(lc,{rep:[w/.8,1]});
      const lace=new THREE.Mesh(new THREE.PlaneGeometry(w,.28),new THREE.MeshLambertMaterial({map:lt,transparent:true,alphaTest:.3,side:THREE.DoubleSide}));lace.position.set(0,vh-.16,d/2+vd-.08);g.add(lace);}
    if(storeys===2&&rnd()<.4){const ch=new THREE.Mesh(B(.3,.7,.3),M('#a8583e'));ch.position.set(w/2-.4,h+.35,-d/4);ch.castShadow=true;g.add(ch);}
    // collider from the turned body
    const hx=Math.abs(Math.cos(ry))*w/2+Math.abs(Math.sin(ry))*d/2,hz=Math.abs(Math.sin(ry))*w/2+Math.abs(Math.cos(ry))*d/2;block(cx-hx,cz-hz,cx+hx,cz+hz);return g;}
  // a row of shops along a straight front from a to b (front line), facing dir
  function row(ax,az,bx,bz,dir,d,list){const L=Math.hypot(bx-ax,bz-az),ux=(bx-ax)/L,uz=(bz-az)/L;let t=0,i=0;while(t<L-.6){const o=(list&&list[i])||{};let w=o.w||(3.2+rnd()*2.2);if(t+w>L)w=L-t;if(w<1.8)break;const m=t+w/2;shop(ax+ux*m,az+uz*m,dir,w-.04,o.d||d,o);t+=w;i++;}}
  // 5. the blocks
  // north of Phillimore St: B-Shed, the quay plaza (gangway to the Rottnest ferry), the station (kept), shops, the William St corner
  {const g=bld(283.1,-12.4,5.8,3.4,2.8,'#9fb3c0',{win:false,sign:'B-SHED FERRY TERMINAL',signBg:'#1d3a6e',signY:2.2,noCol:true});G.add(g);block(280.2,-14.1,286.0,-10.7);
    for(let k=0;k<3;k++){const bl=put(C(.18,.2,.6,8),M('#3a3a3a'),287.2+k*2,.3,-14.1);}put(B(5.6,.1,.5),M('#b98552'),289.6,.05,-14.3);}
  row(302.6,-10.4,315.0,-10.4,[0,1],3.2,[{w:4,name:'SEAGULL & CO. GIFTS',wall:'#b8d4d8'},{w:4.2},{w:4.2}]);
  row(321.0,-10.4,333.2,-10.4,[0,1],3.2);
  // between Phillimore and High St: a terrace of shops facing High St, its back to Phillimore
  row(282.2,-1.2,294.0,-1.2,[0,1],2.9);
  // the Round House on its hill: twelve-sided limestone gaol with a dark roof and a flagpole
  {const rh=put(C(1.9,1.9,2.4,12),M('#e2d2a8'),278.0,1.2,-.6);const rr=put(C(.6,2.15,.9,12),M('#6a5a4a'),278.0,2.85,-.6);put(C(.04,.04,2.2,6),M('#f6f6f2'),278.0,4.3,-.6);
    const fl=put(B(.7,.4,.02),M('#1d3a6e'),278.36,5.1,-.6,{nc:1});block(276.2,-2.4,279.8,1.2);
    const pq=new THREE.Mesh(new THREE.PlaneGeometry(.6,.36),new THREE.MeshBasicMaterial({map:makeSign(['ROUND HOUSE','1831'],48,22,'#5a3a22','#f5ecd8')}));pq.position.set(278.0,1.0,1.32);G.add(pq);}
  // Kings Square: the Town Hall (clock tower on the corner) and St John's, planters and benches
  {const th=shop(308.0,-4.2,[0,-1],6.8,3.6,{storeys:2,wall:'#efe0b8',name:'TOWN HALL',spanish:false,ver:false,door:'#3a2a22'});
    put(B(1.6,6.4,1.6),M('#efe0b8'),305.4,3.2,-3.4);put(new THREE.ConeGeometry(1.25,1.8,4),M('#5a6a6a'),305.4,7.3,-3.4,{ry:Math.PI/4});
    const ck=new THREE.Mesh(new THREE.CircleGeometry(.42,16),new THREE.MeshBasicMaterial({map:(()=>{const c=mk(24,24),x=c.getContext('2d');x.fillStyle='#f6f2e8';x.beginPath();x.arc(12,12,11,0,7);x.fill();x.strokeStyle='#2a2a2a';x.lineWidth=2;x.beginPath();x.moveTo(12,12);x.lineTo(12,4);x.moveTo(12,12);x.lineTo(17,14);x.stroke();return ctex(c);})()}));
    ck.position.set(305.4,5.4,-4.21);ck.rotation.y=Math.PI;G.add(ck);block(304.6,-4.2,306.2,-2.6);}
  {// St John's: limestone nave, steep slate roof, a tower with a spire at the north end (door on the north face)
    const x0=313.4,z1=-2.4,z2=5.6,w=3.2;put(B(w,3.2,z2-z1),M('#e8dcc0'),x0,1.6,(z1+z2)/2);const sh=new THREE.Shape();sh.moveTo(-w/2-.1,0);sh.lineTo(w/2+.1,0);sh.lineTo(0,1.7);sh.closePath();
    const rg=new THREE.ExtrudeGeometry(sh,{depth:z2-z1-1.6,bevelEnabled:false});const rf=new THREE.Mesh(rg,M('#4a5058'));rf.position.set(x0,3.2,z1+1.6);rf.castShadow=true;G.add(rf);
    put(B(1.8,5,1.8),M('#e2d6b8'),x0,2.5,z1+.9);put(new THREE.ConeGeometry(1.1,3,4),M('#4a5058'),x0,6.5,z1+.9,{ry:Math.PI/4});put(C(.03,.03,.8,6),M('#d8c070'),x0,8.3,z1+.9);
    const dr=new THREE.Mesh(new THREE.PlaneGeometry(.8,1.5),M('#5a3a22'));dr.position.set(x0,.75,z1-.01);dr.rotation.y=Math.PI;G.add(dr);
    for(let k=0;k<3;k++){const wn=new THREE.Mesh(new THREE.PlaneGeometry(.4,1.2),M('#4a5a7a'));wn.position.set(x0-w/2-.01,1.8,z1+2.6+k*1.6);wn.rotation.y=-Math.PI/2;G.add(wn);}
    block(x0-w/2,z1,x0+w/2,z2);}
  {// the square itself: planters with trees, benches, a fountain in the middle
    put(C(1.1,1.2,.45,16),M('#d8ccb0'),306.5,.22,3.5);put(C(.95,.95,.06,16),new THREE.MeshLambertMaterial({color:new THREE.Color('#5ab0d0')}),306.5,.46,3.5,{nc:1});put(C(.12,.18,1,8),M('#d8ccb0'),306.5,.9,3.5);block(305.4,2.4,307.6,4.6);
    [[301.4,6.8],[310.6,6.8],[301.4,.6]].forEach(([x,z])=>{put(B(1.1,.4,1.1),M('#b8a888'),x,.2,z);block(x-.55,z-.55,x+.55,z+.55);if(FDET.bb&&typeof treeVariants!=='undefined'){const v=treeVariants[(x*3|0)%treeVariants.length];FDET.bb(v,x,z,v.w*.75,v.h*.75,.4,true);}});
    [[303.6,4.8,0],[309.4,4.8,0],[306.5,7.6,1]].forEach(([x,z,r])=>{put(B(r?1.4:.5,.08,r?.5:1.4),M('#7a5a3a'),x,.44,z);});}
  // west side of South Tce: Pippo's first, then cafés down the strip (backs to Market St)
  row(302.0,9.0,302.0,21.0,[1,0],2.2,[{w:2.7,name:'PIPPO’S',wall:'#f2dc96',vc:'#2c4a3a'},{w:3},{w:3.2},{w:3.1}]);
  // east side of South Tce: Freo Thai Basil, shops, Freo Vintage Collective, then the market hall
  row(309.0,9.0,309.0,15.6,[-1,0],2.6,[{w:3.2,name:'FREO THAI BASIL',wall:'#e8b8b0',vc:'#8a2a2a'},{w:3.4}]);
  shop(309.9,17.0,[0,1],3.0,1.4,{storeys:1,name:'FREO VINTAGE',wall:'#c89878',ver:false});
  {// the market hall (1897): striped brick and cream, two gables, a verandah on the north side, the door where Rosa stands
    const x1=308.4,x2=315.0,z1=19.4,z2=24.0,H=3.2,cx=(x1+x2)/2,cz=(z1+z2)/2,w=x2-x1;
    const hc=mk(64,32),hx=hc.getContext('2d');for(let y=0;y<32;y+=4){hx.fillStyle=(y/4)%3===2?'#efe3c4':'#a0583a';hx.fillRect(0,y,64,4);}hx.fillStyle='#efe3c4';hx.fillRect(0,0,64,3);for(let k=0;k<4;k++){hx.fillStyle='#3a2a22';hx.fillRect(5+k*15,12,8,20);hx.fillStyle='#6a4a32';hx.fillRect(6+k*15,13,6,19);}
    hx.fillStyle='#f6f2e8';hx.fillRect(14,4,36,7);hx.fillStyle='#3a2a22';hx.font='bold 6px monospace';hx.textAlign='center';hx.fillText('MARKETS 1897',32,10);const ht=ctex(hc);
    const pl=M('#a0583a');put(B(w,H,z2-z1),[pl,pl,pl,pl,pl,new THREE.MeshLambertMaterial({map:ht})],cx,H/2,cz);
    [x1+w*.25,x1+w*.75].forEach(gx=>{const sh=new THREE.Shape();sh.moveTo(-w/4,0);sh.lineTo(w/4,0);sh.lineTo(0,1.2);sh.closePath();const gg=new THREE.ExtrudeGeometry(sh,{depth:z2-z1,bevelEnabled:false});const r=new THREE.Mesh(gg,M('#8a8e94'));r.position.set(gx,H,z1);r.castShadow=true;G.add(r);});
    const vr=put(B(w,.06,1),M('#2c4a3a'),cx,2.5,z1-.5,{rx:-.08});for(let k=0;k<=4;k++)put(C(.04,.05,2.5,6),M('#2c4a3a'),x1+.1+k*(w-.2)/4,1.25,z1-.95);block(x1,z1,x2,z2);}
  // facing William St, between South Tce and William St
  row(315.0,9.0,315.0,16.6,[1,0],3.2,[{w:3.8},{w:3.8}]);
  // east of William St: the café lot (Kip can buy it), shops facing William St, the prison forecourt
  row(320.8,1.6,320.8,8.4,[-1,0],3.2,[{w:3.4},{w:3.4}]);row(328.2,-4.2,328.2,8.4,[1,0],2.6,[{w:4.2},{w:4.2},{w:4.2}]);
  {// Fremantle Prison: a long limestone wall with a gatehouse of two towers, a clock and big timber gates
    const x1=321.6,x2=328.2,z1=13.4,z2=21.2;put(B(x2-x1,3.4,z2-z1),M('#e8dcbc'),(x1+x2)/2,1.7,(z1+z2)/2);[x1+.9,x2-.9].forEach(tx=>{put(B(1.6,4.6,1.6),M('#efe3c4'),tx,2.3,z1+.6);put(B(1.8,.3,1.8),M('#d8ccb0'),tx,4.75,z1+.6);});
    const gt=new THREE.Mesh(new THREE.PlaneGeometry(1.6,2.2),M('#5a3a22'));gt.position.set((x1+x2)/2,1.1,z1-.01);gt.rotation.y=Math.PI;G.add(gt);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.8,.4),new THREE.MeshBasicMaterial({map:makeSign(['FREMANTLE PRISON'],80,12,'#efe3c4','#3a2a22')}));sg.position.set((x1+x2)/2,2.75,z1-.02);sg.rotation.y=Math.PI;G.add(sg);block(x1,z1,x2,z2);}
  // the Esplanade: grass, Norfolk pines, the ferris wheel and its ticket booth, the I heart FREO photo sign, the Salty Gull kiosk
  {const wx=285.0,wz=11.4;const ring=put(new THREE.TorusGeometry(3.2,.12,6,28),M('#f6f6f0'),wx,3.8,wz);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;const sp=put(B(.06,6.4,.06),M('#e8e8e4'),wx,3.8,wz,{nc:1});sp.rotation.z=a;
      const gd=put(B(.5,.45,.5),M(['#c8344a','#2f6fb0','#f2c428','#3ec46a'][k%4]),wx+Math.cos(a)*3.2,3.8+Math.sin(a)*3.2-.3,wz);}
    [-1,1].forEach(s=>{const lg=put(B(.14,4.2,.14),M('#d8d8d4'),wx+s*1.1,1.9,wz);lg.rotation.z=s*.28;});put(C(.25,.25,.3,10),M('#3a3a3a'),wx,3.8,wz+.1);block(wx-.8,wz-.4,wx+.8,wz+.4);
    put(B(1,1.2,.8),M('#c8344a'),288.6,.6,10.6);block(288.1,10.2,289.1,11.0);
    const sgc=mk(48,14),sx=sgc.getContext('2d');sx.fillStyle='#f6f6f0';sx.font='bold 12px monospace';sx.fillText('I',2,12);sx.fillStyle='#d8323a';sx.fillText('♥',11,12);sx.fillStyle='#f6f6f0';sx.fillText('FREO',22,12);
    const ps=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.7),new THREE.MeshBasicMaterial({map:ctex(sgc),transparent:true,alphaTest:.3,side:THREE.DoubleSide}));ps.position.set(292.6,.7,6.6);G.add(ps);block(291.4,6.5,293.8,6.7);
    shop(294.2,17.4,[1,0],3.0,2.4,{storeys:1,name:'THE SALTY GULL',wall:'#b8d4d8',vc:'#1d3a6e',vd:1.1});
    if(FDET.bb&&typeof NP!=='undefined'){[[277.2,6.4],[277.2,12.4],[277.2,18.6],[280.6,20.2],[290.6,20.4],[291,13],[279.6,15.4]].forEach(([x,z])=>{FDET.bb(NP,x,z,NP.w*1.35,NP.h*1.35,0,true);block(x-.2,z-.2,x+.2,z+.2);});}
    [[279.2,9.4],[289.4,16.1],[281.4,16.1]].forEach(([x,z])=>put(B(1.4,.08,.5),M('#7a5a3a'),x,.44,z));}
  // the hill east of Parry St: a grassy mound, a white rotunda, gums and a lookout
  {const mound=new THREE.Mesh(new THREE.SphereGeometry(1,24,10,0,Math.PI*2,0,Math.PI/2),tile(grassC,8,8,2));mound.scale.set(6,.3,5);mound.position.set(345,0,4);mound.receiveShadow=true;G.add(mound);
    put(C(1.3,1.3,.25,8),M('#efe3c4'),345,.42,4);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;put(C(.06,.06,1.8,6),M('#f6f6f2'),345+Math.cos(a)*1.1,1.45,4+Math.sin(a)*1.1);}put(new THREE.ConeGeometry(1.5,.9,8),M('#2c4a3a'),345,2.8,4);block(343.6,2.6,346.4,5.4);
    if(FDET.bb&&typeof treeVariants!=='undefined')[[337,-3],[338,15],[350,-2],[352,12],[340,19],[355,4],[348,17]].forEach(([x,z],i)=>{const v=treeVariants[i%treeVariants.length];FDET.bb(v,x,z,v.w*.85,v.h*.85,0,true);});}
  // street trees along the footpaths (sprites) and lamp posts
  if(FDET.bb&&typeof treeVariants!=='undefined'){[[284,-4.6],[290,-4.6],[323,-4.6],[300,-9.6],[296.6,12],[296.6,18],[299.4,6],[316,13],[320.4,12.6],[316,2],[329,14],[329,3]].forEach(([x,z],i)=>{const v=treeVariants[(i+1)%treeVariants.length];FDET.bb(v,x,z,v.w*.62,v.h*.62,0,true);});}
  [[281,-4.4],[293,-4.4],[303,-4.4],[319.6,-4.4],[333,-4.4],[294.4,8],[294.4,16],[299.6,14],[302.8,15],[308,14],[315.4,6],[320.6,-1],[328.4,2]].forEach(([x,z])=>{put(C(.05,.07,2.4,6),M('#2e3236'),x,1.2,z);put(new THREE.SphereGeometry(.13,8,6),M('#f6efd8'),x,2.45,z,{nc:1});});
  // 6. the café lot moves to the William St corner; the people of the town walk the new footpaths
  if(typeof BRANCHES!=='undefined'){const b=BRANCHES.find(q=>q.id==='freo');if(b){b.x=323.1;b.z=-2.0;b.tp={x:323.1,z:1.0};}}
  if(typeof WALK_ROUTES!=='undefined')WALK_ROUTES.freo=[[[280,-9],[333,-9]],[[280,-5],[333,-5]],[[295,-5],[295,21]],[[299,-5],[299,21]],[[303.4,9],[303.4,21]],[[307.4,9],[307.4,21]],[[316,-14],[316,21]],[[320,-14],[320,21]],[[282,3.6],[295,3.6]],[[300.5,0],[311,7.6]],[[283,8],[292,8],[292,14.6],[283,14.6],[283,8]],[[329,-5],[329,21]]];
  if(typeof SAFE_SPOTS!=='undefined')SAFE_SPOTS.freo=[[290,-9],[301,6],[310,2]];
  // the south end of the Esplanade is park now, not the old harbour edge
  {const _fw5=freoWalk;freoWalk=function(x,z){if(x>274.6&&x<294.3&&z>14&&z<21.45)return true;return _fw5(x,z);};}
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
