// ---------- More from Paul's Perth photos (same Look Lab layer as Fremantle detail: ?lab or ?freo) ----------
// Fremantle: the long limestone cell block inside the prison walls, palms on the rise behind it.
// City: a red-brick town hall with a clock tower and corner turrets on Barrack St, a sandstone colonnade for the museum,
// a glass footbridge from the station over Wellington St, and a stone obelisk at the Kings Park lookout.
if(FDET.on)(()=>{const G=FDET.g;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const findGroup=(x,z)=>scene.children.find(o=>o.isGroup&&Math.abs(o.position.x-x)<.05&&Math.abs(o.position.z-z)<.05);
  const hide=o=>{if(o){o.visible=false;FDET.hid.push(o);}};
  // a second group for the city, shown only in the city
  const C2=new THREE.Group();C2.name='cityRefs';scene.add(C2);FDET.city=C2;C2.visible=false;

  // ===== Fremantle Prison: a four-storey limestone cell block with rows of small barred windows =====
  {hide(findGroup(325,3));const lime=new THREE.MeshLambertMaterial({map:tex(16,16,(x)=>{x.fillStyle='#e8e0cc';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=4)for(let i=(j%8?3:0);i<16;i+=6){x.fillStyle=['#ddd3bc','#f0e8d6','#d8ceb6'][(i+j)%3];x.fillRect(i,j,5,3);}},[6,3])});
    const cell=new THREE.MeshLambertMaterial({map:tex(8,8,(x)=>{x.fillStyle='#e8e0cc';x.fillRect(0,0,8,8);x.fillStyle='#2a2a30';x.fillRect(3,3,2,2);},[14,4])});
    const g=new THREE.Group();g.position.set(325,0,3.4);G.add(g);
    put(B(9.6,4.4,3),lime,0,2.2,0,null,g);
    const front=new THREE.Mesh(new THREE.PlaneGeometry(9.6,4.2),cell);front.position.set(0,2.2,1.51);g.add(front);
    put(B(9.6,.5,3.1),M('#f0eadc'),0,.25,0,null,g);
    const roof=new THREE.Mesh(new THREE.CylinderGeometry(.01,1.9,1,4,1),M('#a8acb0'));roof.rotation.y=Math.PI/4;roof.scale.set(3.7,1,1.15);roof.position.set(0,4.9,0);roof.castShadow=true;g.add(roof);
    [-3,0,3].forEach(x=>{put(B(.5,.5,.5),M('#c8c8c4'),x,5.35,0,null,g);});
    // chapel end with a pediment and tall arched windows
    put(B(2.4,4.8,3.4),lime,-5.8,2.4,0,null,g);{const sh=new THREE.Shape();sh.moveTo(-1.3,0);sh.lineTo(1.3,0);sh.lineTo(0,1);sh.lineTo(-1.3,0);const p=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:3.4,bevelEnabled:false}),lime);p.position.set(-5.8,4.8,-1.7);g.add(p);}
    for(let i=0;i<2;i++){put(B(.45,1.2,.05),M('#3a4250'),-6.3+i*1,3.2,1.72,{nc:1},g);put(new THREE.CircleGeometry(.23,10,0,Math.PI),M('#3a4250'),-6.3+i*1,3.8,1.72,{nc:1},g);}
    col(319.4,1.7,331,5.1);
    // palms on the grass by the walls
    const pc=(()=>{const W=24,H=48,c=mk(W,H),x=c.getContext('2d');for(let y=15;y<H;y++){for(let i=0;i<4;i++){x.fillStyle=(y%3===0)?'#5a4a38':i===0?'#5e503c':i===3?'#6e604c':'#8a7a62';x.fillRect(10+i,y,1,1);}}x.fillStyle='#6a5a40';x.fillRect(10,13,4,3);const FR=TREE_COLS[1];const rr=mulberry32(55);
      for(let k=0;k<14;k++){const a=-Math.PI+k/13*Math.PI,len=9+rr()*3;for(let t=0;t<=1;t+=.05){const px=12+Math.cos(a)*len*t,py=14+Math.sin(a)*len*t*.55+t*t*7*Math.abs(Math.cos(a));x.fillStyle=FR[t<.2?0:t>.7?3:1+(k%2)];x.fillRect(Math.round(px),Math.round(py),1,1);x.fillStyle=FR[0];x.fillRect(Math.round(px),Math.round(py)+1,1,1);}}return c;})();
    const t=ctex(pc);const pv={m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};
    [[333,-2],[333.4,4],[333,10]].forEach(([x,z])=>{const pg=new THREE.PlaneGeometry(2.6,5.2);pg.translate(0,2.6,0);const m=new THREE.Mesh(pg,pv.m);m.customDepthMaterial=pv.d;m.castShadow=true;m.position.set(x,0,z);G.add(m);BB.push(m);col(x-.2,z-.2,x+.2,z+.2);});}

  // ===== Town Hall on Barrack St: red brick, cream trim, a clock tower with a slate spire and corner turrets =====
  {const x0=662.3,z0=-17.6,brick=new THREE.MeshLambertMaterial({map:tex(16,16,(x)=>{x.fillStyle='#b05a3a';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=2)for(let i=(j%4?2:0);i<16;i+=4){x.fillStyle=['#c0683e','#a8502e','#c87048'][(i+j)%3];x.fillRect(i,j,3,1);}x.fillStyle='#d8b898';for(let j=1;j<16;j+=2)x.fillRect(0,j,16,1);},[3,3])});
    const g=new THREE.Group();g.position.set(x0,0,z0);C2.add(g);const cream=M('#f2ead8'),slate=M('#3a3a42');
    put(B(4.2,4.2,2.8),brick,.6,2.1,0,null,g);
    for(let i=0;i<3;i++){put(B(.6,1.2,.05),M('#2a2a30'),-.5+i*1.1,1,1.41,{nc:1},g);put(new THREE.CircleGeometry(.3,10,0,Math.PI),M('#2a2a30'),-.5+i*1.1,1.6,1.41,{nc:1},g);put(B(.5,1.3,.05),M('#6a3a2e'),-.5+i*1.1,3,1.41,{nc:1},g);}
    [1,2.5,4.1].forEach(y=>put(B(4.3,.12,2.9),cream,.6,y,0,{nc:1},g));
    {const sh=new THREE.Shape();sh.moveTo(-1.4,0);sh.lineTo(1.4,0);sh.lineTo(0,1.6);sh.lineTo(-1.4,0);const gb=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:2.8,bevelEnabled:false}),brick);gb.position.set(.9,4.2,-1.4);gb.castShadow=true;g.add(gb);put(new THREE.CircleGeometry(.35,14),cream,.9,4.8,1.41,{nc:1},g);}
    put(B(2.2,1.4,3),slate,.9,4.85,0,null,g);
    [[2.75,1.35],[2.75,-1.35]].forEach(([x,z])=>{put(new THREE.CylinderGeometry(.25,.25,4.6,10),brick,x,2.3,z,null,g);put(new THREE.ConeGeometry(.3,.8,10),cream,x,5,z,null,g);});
    // the clock tower on the corner
    const tx=-1.6;put(B(1.4,7,1.4),brick,tx,3.5,0,null,g);[2,4,5.5,6.9].forEach(y=>put(B(1.5,.12,1.5),cream,tx,y,0,{nc:1},g));
    for(const s of[[0,.71,0],[.71,0,Math.PI/2]]){const f=new THREE.Mesh(new THREE.CircleGeometry(.42,18),M('#f6f2e8'));f.position.set(tx+s[0],6.2,s[1]);f.rotation.y=s[2];g.add(f);const h=new THREE.Mesh(B(.04,.3,.01),M('#1b1b2b'));h.position.set(tx+s[0]*1.01,6.28,s[1]*1.01);h.rotation.y=s[2];g.add(h);}
    for(let i=0;i<3;i++)put(B(.18,1.2,.05),M('#2a2a30'),tx-.35+i*.35,4.7,.72,{nc:1},g);
    put(new THREE.ConeGeometry(1.05,2.6,4),slate,tx,8.3,0,{ry:Math.PI/4},g);[[.62,.62],[-.62,.62],[.62,-.62],[-.62,-.62]].forEach(([a,b])=>put(new THREE.ConeGeometry(.18,.7,8),cream,tx+a,7.3,b,null,g));put(B(.04,.8,.04),M('#2a2a30'),tx,9.9,0,{nc:1},g);
    col(x0-2.3,z0-1.4,x0+2.7,z0+1.4);CBD.cut.push({g,x1:x0-2.3,x2:x0+2.7,z1:z0-1.4,h:10});}

  // ===== City Museum: a sandstone colonnade with tall columns, arched ground floor and a granite base =====
  {const host=CBD.cut.find(e=>Math.abs(e.g.position.x-630)<.05&&Math.abs(e.g.position.z+18)<.05);
    if(host){const g=new THREE.Group();host.g.add(g);FDET.cityParts=[g];const zf=2.52,sand=M('#e2cfa6'),gran=M('#a8a8a4');
      put(B(11,1.4,.2),gran,0,.7,zf,null,g);for(let i=0;i<4;i++){const ax=-3.9+i*2.6;put(B(1.6,1.3,.05),M('#2a2a30'),ax,.75,zf+.11,{nc:1},g);const a=new THREE.Mesh(new THREE.CircleGeometry(.8,12,0,Math.PI),M('#2a2a30'));a.position.set(ax,1.35,zf+.11);g.add(a);}
      for(let i=0;i<7;i++){put(new THREE.CylinderGeometry(.18,.2,3,10),sand,-4.8+i*1.6,2.9,zf+.15,null,g);put(B(.5,.18,.5),sand,-4.8+i*1.6,4.45,zf+.15,null,g);}
      put(B(11.2,.4,.6),sand,0,4.7,zf+.1,null,g);for(let i=0;i<6;i++)put(B(.7,.9,.05),M('#3a4250'),-4+i*1.6,2.9,zf+.02,{nc:1},g);}}

  // ===== a glass footbridge from the station over Wellington St =====
  {const gl=new THREE.MeshLambertMaterial({color:0x8ad0c8,transparent:true,opacity:.6}),fr=M('#e8dcc0');const x=671,z1=-22.6,z2=-19.95,y=3.6;
    put(B(1.6,1.1,z2-z1),gl,x,y,(z1+z2)/2,{nc:1},C2);put(B(1.7,.2,z2-z1+.1),fr,x,y-.6,(z1+z2)/2,null,C2);put(B(1.7,.15,z2-z1+.1),fr,x,y+.6,(z1+z2)/2,null,C2);
    for(let i=0;i<4;i++){const zz=z1+(i+.5)*(z2-z1)/4;put(B(.05,1.1,.05),M('#4a9a8a'),x-.8,y,zz,{rz:.6,nc:1},C2);put(B(.05,1.1,.05),M('#4a9a8a'),x+.8,y,zz,{rz:-.6,nc:1},C2);}
    [[x-.6,-21.0],[x+.6,-21.0]].forEach(([a,b])=>{});}

  // ===== a stone obelisk at the Kings Park lookout, with a white rail and a flag =====
  {const x=605.4,z=10.4;put(B(1.4,.3,1.4),M('#b8b8b4'),x,.15,z,null,C2);put(B(.9,.5,.9),M('#a8a8a4'),x,.55,z,null,C2);
    const ob=new THREE.Mesh(new THREE.CylinderGeometry(.18,.42,3.2,4),M('#a8a8a4'));ob.rotation.y=Math.PI/4;ob.position.set(x,2.4,z);ob.castShadow=true;C2.add(ob);put(new THREE.ConeGeometry(.22,.35,4),M('#b8b8b4'),x,4.15,z,{ry:Math.PI/4},C2);
    put(B(.06,1.1,.04),M('#6a6a68'),x,2.6,z+.36,{nc:1},C2);put(B(.5,.06,.04),M('#6a6a68'),x,3,z+.36,{nc:1},C2);
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;put(B(.05,.5,.05),M('#f6f6f0'),x+Math.cos(a)*1,.3,z+Math.sin(a)*1,{nc:1},C2);}
    put(new THREE.CylinderGeometry(.03,.03,4,5),M('#e8e8ec'),x+1.4,2,z-.4,null,C2);col(x-.75,z-.75,x+.75,z+.75);}
})();
