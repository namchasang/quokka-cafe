// ---------- St George's Cathedral on St Georges Terrace (Look Lab city layer, ?lab or ?freo) ----------
// Replaces the small office tower east of Barrack St (and its noodle bar) with a red-brick Gothic cathedral:
// a long nave with a steep slate roof, cream stone bands, tall pointed windows, a square bell tower with
// corner pinnacles at the west end, a porch facing the terrace and a big pointed east window.
if(FDET.on&&FDET.city)(()=>{const G=FDET.city;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const X=685,Z=-8.5;
  {const i=CBD.cut.findIndex(e=>Math.abs(e.g.position.x-X)<.05&&Math.abs(e.g.position.z-Z)<.05);if(i>=0){const e=CBD.cut[i];e.g.visible=false;FDET.hid.push(e.g);CBD.cut.splice(i,1);}}
  // red brick with cream stone bands every few courses
  const brick=(rx,ry)=>{const c=mk(32,32),x=c.getContext('2d');x.fillStyle='#9c4632';x.fillRect(0,0,32,32);
    for(let j=0;j<32;j+=2)for(let i=(j%4?2:0);i<32;i+=4){x.fillStyle=['#a84e38','#8e3e2c','#b05a42','#96442f'][(i*3+j)%4];x.fillRect(i,j,3,1);}
    x.fillStyle='#e8dcc0';x.fillRect(0,14,32,2);x.fillRect(0,30,32,2);return new THREE.MeshLambertMaterial({map:ctex(c,{rep:[rx,ry]})});};
  const slate=M('#55595f'),stone=M('#e6dabd'),glass=M('#2c3546'),door=M('#5a3420');
  const g=new THREE.Group();g.position.set(X,0,Z);G.add(g);
  // nave: x -1.2..3, a steep pitched roof running east-west
  const nb=brick(3,2);put(B(4.2,4.2,3.6),nb,.9,2.1,0,null,g);
  {const sh=new THREE.Shape();sh.moveTo(-1.95,0);sh.lineTo(1.95,0);sh.lineTo(0,2.4);sh.lineTo(-1.95,0);
    const r=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:4.5,bevelEnabled:false}),slate);r.rotation.y=Math.PI/2;r.position.set(-1.35,4.2,0);r.castShadow=true;g.add(r);
    const gab=new THREE.Mesh(new THREE.ShapeGeometry(sh),nb);gab.rotation.y=Math.PI/2;gab.position.set(3.02,4.2,0);g.add(gab);}
  put(B(.3,.5,.3),stone,3.05,6.7,0,null,g);put(B(.08,.5,.08),stone,3.05,7.1,0,null,g);put(B(.08,.08,.34),stone,3.05,7.15,0,null,g);
  // buttresses and tall pointed windows down the south side
  for(let k=0;k<4;k++){const x=-.9+k*1.15;put(B(.28,3.4,.35),stone,x,1.7,1.9,null,g);
    if(k<3){const wx=x+.58;put(B(.42,1.9,.05),glass,wx,2.4,1.81,{nc:1},g);put(new THREE.ConeGeometry(.3,.5,4,1),glass,wx,3.55,1.81,{nc:1,ry:Math.PI/4},g);put(B(.6,.08,.08),stone,wx,1.42,1.83,{nc:1},g);}}
  // the east end: a big pointed window with stone tracery
  put(B(.05,2.6,1.5),glass,3.03,2.6,0,{nc:1},g);put(new THREE.ConeGeometry(1.06,1.1,4,1),glass,3.03,4.2,0,{nc:1,ry:Math.PI/4},g);
  [-.36,0,.36].forEach(z=>put(B(.06,2.6,.07),stone,3.06,2.6,z,{nc:1},g));put(B(.06,.07,1.5),stone,3.06,3.2,0,{nc:1},g);
  // west tower: square, cream bands, louvred belfry, parapet with four pinnacles
  const tb=brick(2,5),T=-2.05;put(B(1.9,8.6,1.9),tb,T,4.3,.6,null,g);
  put(B(2.1,.25,2.1),stone,T,8.7,.6,null,g);
  [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([a,b])=>{const px=T+a*.88,pz=.6+b*.88;put(B(.34,1.1,.34),stone,px,9.3,pz,null,g);put(new THREE.ConeGeometry(.22,.9,4),stone,px,10.3,pz,{ry:Math.PI/4},g);});
  for(let k=-1;k<=1;k+=2){put(B(.22,.3,.22),stone,T+k*.4,9.0,1.6,{nc:1},g);}
  [-.35,.35].forEach(dx=>{put(B(.32,1.3,.05),M('#3a3a40'),T+dx,7.3,1.56,{nc:1},g);put(new THREE.ConeGeometry(.23,.36,4),M('#3a3a40'),T+dx,8.1,1.56,{nc:1,ry:Math.PI/4},g);});
  put(B(.05,1.3,.32),M('#3a3a40'),T-.96,7.3,.6,{nc:1},g);
  // the clock face and a tall lancet on the tower's south side
  {const c=mk(24,24),x=c.getContext('2d');x.fillStyle='#e6dabd';x.beginPath();x.arc(12,12,11,0,7);x.fill();x.fillStyle='#2a2a30';x.beginPath();x.arc(12,12,9,0,7);x.fill();x.fillStyle='#f0e6c8';x.beginPath();x.arc(12,12,8,0,7);x.fill();
    x.fillStyle='#2a2a30';for(let i=0;i<12;i++){const a=i/12*6.283;x.fillRect(12+Math.cos(a)*6.5-.5,12+Math.sin(a)*6.5-.5,1,1);}x.fillRect(11.5,6,1,6.5);x.fillRect(12,11.5,4,1);
    const f=new THREE.Mesh(new THREE.CircleGeometry(.42,18),new THREE.MeshLambertMaterial({map:ctex(c)}));f.position.set(T,5.9,1.56);g.add(f);}
  put(B(.36,1.7,.05),glass,T,3.9,1.56,{nc:1},g);put(new THREE.ConeGeometry(.26,.4,4),glass,T,4.95,1.56,{nc:1,ry:Math.PI/4},g);
  // porch on the terrace side: a gabled stone doorway with a pointed timber door
  {const pg=new THREE.Group();pg.position.set(T,0,1.85);g.add(pg);put(B(1.5,1.9,.7),stone,0,.95,0,null,pg);
    const sh=new THREE.Shape();sh.moveTo(-.85,0);sh.lineTo(.85,0);sh.lineTo(0,.75);sh.lineTo(-.85,0);const r=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.8,bevelEnabled:false}),slate);r.position.set(0,1.9,-.4);r.castShadow=true;pg.add(r);
    put(B(.7,1.2,.05),door,0,.6,.36,{nc:1},pg);put(new THREE.ConeGeometry(.5,.5,4),door,0,1.42,.36,{nc:1,ry:Math.PI/4},pg);put(B(.04,1.3,.06),M('#2a1a12'),0,.65,.39,{nc:1},pg);}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});
  CBD.cut.push({g,x1:X-3.05,x2:X+3.05,z1:Z-2,h:10.7});
  CBD.P.cathedral={x:X-2,z:Z+3.4};
})();
