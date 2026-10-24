// ---------- Fremantle from Paul's street photos (same Look Lab layer: ?lab or ?freo) ----------
// Kings Square: a limestone church with a rose window and a row of lancets, the sandstone Town Hall with its clock
// tower and slate spire, a white grid building with arched shop hoods, stone ball bollards and tall palms.
// South Terrace gets its red road, banners on the lamp posts, a red-brick technical school on High St,
// the prison gatehouse with two towers and a clock, and small two-tone retro hatchbacks driving through town.
const FREO2_LIVE=false;const FREO2_ON=FREO2_LIVE||/[?&#](lab|freo)\b/.test(location.search+location.hash);
if(FDET.on&&FREO2_ON)(()=>{const G=FDET.g;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(...o.s);}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||8);
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const texM=(W,H,draw,rep,o)=>new THREE.MeshLambertMaterial(Object.assign({map:tex(W,H,draw,rep)},o||{}));
  const paint=(w,d,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const plane=(w,h,mat,x,y,z,ry,to)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;(to||G).add(m);return m;};
  const sign=(t,bg,fg,w,h,x,y,z,ry,to)=>{const L=Array.isArray(t)?t:[t];const tx=makeSign(L,Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);return plane(w,h,new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}),x,y,z,ry,to);};
  const r=mulberry32(1887),pick=a=>a[(r()*a.length)|0];
  const hide=o=>{if(o){o.visible=false;FDET.hid.push(o);}};
  const findGroup=(x,z)=>scene.children.find(o=>o.isGroup&&Math.abs(o.position.x-x)<.05&&Math.abs(o.position.z-z)<.05);
  // a triangular roof (gable faces +z), w wide, h high, d deep
  const gable=(w,h,d)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);return g;};
  const triWall=(w,h)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();return new THREE.ShapeGeometry(s);};
  // limestone blocks, the warm honey stone of old Fremantle
  const limeT=(rep,base)=>tex(16,16,(x)=>{x.fillStyle=base||'#d8c49a';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=4)for(let i=(j%8?3:0);i<16;i+=6){x.fillStyle=pick(['#e2d0a8','#cdb88c','#d4c094','#e8d8b4','#c8b080']);x.fillRect(i,j,5,3);}x.fillStyle='rgba(120,100,70,.35)';for(let j=3;j<16;j+=4)x.fillRect(0,j,16,1);},rep);
  const limeM=(rx,ry,base)=>new THREE.MeshLambertMaterial({map:limeT([rx,ry],base)});
  const slateM=texM(8,8,(x)=>{x.fillStyle='#5e646c';x.fillRect(0,0,8,8);for(let j=0;j<8;j+=2){x.fillStyle=j%4?'#6a7078':'#545a62';x.fillRect(0,j,8,1);}},[4,3]);
  const brickT=rep=>tex(16,16,(x)=>{x.fillStyle='#8a3a26';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=2)for(let i=(j%4?2:0);i<16;i+=4){x.fillStyle=pick(['#a84a30','#b85a3a','#9a4028','#c2643e']);x.fillRect(i,j,3,1);}x.fillStyle='#d8c8a8';for(let j=1;j<16;j+=2)x.fillRect(0,j,16,1);},rep);
  const darkM=M('#2a2a34'),creamM=M('#efe3c4');
  const palm=FDET.palm,bb=FDET.bb;

  // ===== St John's-style church: limestone nave, steep slate roof, rose window over seven lancets, a porch, a cross =====
  {hide(findGroup(314.4,-5.8));const x0=314.4,z0=-5.8,W=3,D=4.2,H=2.5,RH=2.1,zf=z0+D/2;const L=limeM(2,2);
    put(B(W,H,D),L,x0,H/2,z0);put(gable(W+.24,RH,D+.2),slateM,x0,H,z0);const tw=new THREE.Mesh(triWall(W,RH),L);tw.position.set(x0,H,zf+.005);G.add(tw);
    put(B(W+.1,.12,.12),M('#cbb68a'),x0,H,zf+.04);
    // rose window: stone tracery, six lobes of blue and wine glass
    plane(.96,.96,texM(32,32,(x)=>{x.fillStyle='#cbb68a';x.beginPath();x.arc(16,16,16,0,7);x.fill();x.fillStyle='#24304a';x.beginPath();x.arc(16,16,13,0,7);x.fill();
      for(let k=0;k<6;k++){const a=k/6*Math.PI*2,cx=16+Math.cos(a)*7,cy=16+Math.sin(a)*7;x.fillStyle=k%2?'#3c5a8a':'#6a3050';x.beginPath();x.arc(cx,cy,4.4,0,7);x.fill();x.strokeStyle='#cbb68a';x.lineWidth=1;x.stroke();}
      x.fillStyle='#d8a040';x.beginPath();x.arc(16,16,3,0,7);x.fill();},null,{transparent:true,alphaTest:.4}),x0,H+.85,zf+.02);
    // seven lancets on little columns
    plane(2.5,1.05,texM(56,24,(x)=>{for(let k=0;k<7;k++){const cx=4+k*8;x.fillStyle='#cbb68a';x.fillRect(cx-4,0,1,24);x.fillStyle='#2c3448';x.beginPath();x.moveTo(cx-2.5,24);x.lineTo(cx-2.5,7);x.quadraticCurveTo(cx-2.5,2,cx,1);x.quadraticCurveTo(cx+2.5,2,cx+2.5,7);x.lineTo(cx+2.5,24);x.fill();x.fillStyle='#4a5a7a';x.fillRect(cx-1,8,1,14);}},null,{transparent:true,alphaTest:.3}),x0,1.75,zf+.02);
    put(B(W+.06,.1,.08),M('#cbb68a'),x0,1.2,zf+.03);
    // porch with its own little gable and a pointed timber door
    put(B(1.1,1.3,.7),L,x0,.65,zf+.35);put(gable(1.3,.7,.8),slateM,x0,1.3,zf+.35);const pw=new THREE.Mesh(triWall(1.1,.6),L);pw.position.set(x0,1.3,zf+.705);G.add(pw);
    plane(.56,.92,texM(12,20,(x)=>{x.fillStyle='#5a3a24';x.beginPath();x.moveTo(0,20);x.lineTo(0,7);x.quadraticCurveTo(0,1,6,0);x.quadraticCurveTo(12,1,12,7);x.lineTo(12,20);x.fill();x.fillStyle='#3a2416';for(let i=2;i<12;i+=3)x.fillRect(i,6,1,14);x.fillStyle='#1b1b1b';x.fillRect(8,12,1,2);},null,{transparent:true,alphaTest:.4}),x0,.47,zf+.71);
    put(B(.05,.42,.05),creamM,x0,1.95+.21,zf+.72);put(B(.24,.05,.05),creamM,x0,2.24,zf+.72);
    put(B(.07,.6,.07),M('#cbb68a'),x0,H+RH+.25,zf+.05);put(B(.34,.07,.07),M('#cbb68a'),x0,H+RH+.38,zf+.05);
    [-1,1].forEach(s=>{put(B(.32,1.9,.36),L,x0+s*(W/2+.06),.95,zf-.1);put(B(.3,.5,.3),L,x0+s*(W/2+.06),2.0,zf-.1,{rz:s*.0});put(C(.04,.06,.6,4),M('#cbb68a'),x0+s*(W/2+.06),2.55,zf-.1);
      for(let k=0;k<3;k++)plane(.3,.8,texM(8,20,(x)=>{x.fillStyle='#2c3448';x.beginPath();x.moveTo(0,20);x.lineTo(0,6);x.quadraticCurveTo(4,-2,8,6);x.lineTo(8,20);x.fill();},null,{transparent:true,alphaTest:.4}),x0+s*(W/2+.005),1.35,z0-1.3+k*1.1,s*Math.PI/2);});
    put(B(1.4,1.8,1.8),L,x0+2.2,.9,z0-.9);put(gable(1.5,.8,1.9),slateM,x0+2.2,1.8,z0-.9,{ry:Math.PI/2});col(x0+1.5,z0-1.8,x0+2.9,z0);
    col(x0-.55,zf,x0+.55,zf+.72);FDET.P=FDET.P||{};FDET.P.church={x:x0,z:zf+1.2};}

  // ===== Town Hall: sandstone, arched windows, a mansard roof and a clock tower with a slate spire and a flag =====
  {hide(findGroup(308,-6.4));const x0=308,z0=-6.4,W=4.4,D=3,H=3,zf=z0+D/2;const sand=limeM(3,2,'#e2cfa4');
    put(B(W,H,D),sand,x0,H/2,z0);put(B(W+.16,.16,D+.16),M('#f0e2c0'),x0,H+.06,z0);put(B(W+.1,.1,D+.1),M('#f0e2c0'),x0,1.5,z0);
    const mans=put(C(.62,1,.8,4),slateM,x0,H+.52,z0,{ry:Math.PI/4});mans.scale.set(W/1.414*1.0,1,D/1.414*1.0);
    const arches=texM(40,16,(x)=>{for(let k=0;k<5;k++){const cx=4+k*8;x.fillStyle='#f0e2c0';x.fillRect(cx-3,1,6,15);x.fillStyle='#34405a';x.beginPath();x.moveTo(cx-2,15);x.lineTo(cx-2,6);x.arc(cx,6,2,Math.PI,0);x.lineTo(cx+2,15);x.fill();x.fillStyle='#f0e2c0';x.fillRect(cx-.5,6,1,9);}},null,{transparent:true,alphaTest:.3});
    plane(3.2,1.25,arches,x0-.55,2.2,zf+.02);plane(3.2,1.25,arches,x0-.55,.75,zf+.02);
    plane(.7,1.1,texM(10,16,(x)=>{x.fillStyle='#4a3424';x.beginPath();x.moveTo(0,16);x.lineTo(0,5);x.arc(5,5,5,Math.PI,0);x.lineTo(10,16);x.fill();x.fillStyle='#d8a040';x.fillRect(4,9,2,1);},null,{transparent:true,alphaTest:.4}),x0+1.45,.55,zf+.03);
    // the clock tower on the front corner
    const tx=x0+1.45,tz=zf-.45,TH=5.9;put(B(1.3,TH,1.3),sand,tx,TH/2,tz);put(B(1.42,.14,1.42),M('#f0e2c0'),tx,4.0,tz);put(B(1.46,.16,1.46),M('#f0e2c0'),tx,TH,tz);
    [[0,.66,0],[.66,0,Math.PI/2],[-.66,0,-Math.PI/2]].forEach(([ox,oz,ry])=>{const ck=plane(.62,.62,texM(16,16,(x)=>{x.fillStyle='#f0e2c0';x.fillRect(0,0,16,16);x.fillStyle='#f6f2e8';x.beginPath();x.arc(8,8,6.5,0,7);x.fill();x.strokeStyle='#2a2a30';x.lineWidth=1;x.stroke();x.fillStyle='#2a2a30';for(let k=0;k<12;k++){const a=k/12*6.283;x.fillRect(8+Math.cos(a)*5-.5,8+Math.sin(a)*5-.5,1,1);}x.fillRect(7.5,3.5,1,5);x.fillRect(8,7.5,3,1);}),tx+ox,4.65,tz+oz+(oz?.01:0),ry);ck.position.x+=ox?Math.sign(ox)*.01:0;
      plane(.7,.62,texM(12,10,(x)=>{x.fillStyle='#f0e2c0';x.fillRect(0,0,12,10);for(const cx of[3,9]){x.fillStyle='#2a2a34';x.beginPath();x.moveTo(cx-2,10);x.lineTo(cx-2,4);x.arc(cx,4,2,Math.PI,0);x.lineTo(cx+2,10);x.fill();}}),tx+ox*1.0,5.4,tz+oz,ry);});
    put(C(0,.95,2.3,4),slateM,tx,TH+1.15,tz,{ry:Math.PI/4});for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;put(C(.04,.04,.5,4),M('#2a2a30'),tx+Math.cos(a)*.62,TH+.35,tz+Math.sin(a)*.62);}
    put(C(.025,.025,1.6,5),M('#e8e8e8'),tx,TH+2.9,tz);const flag=plane(.7,.42,texM(20,12,(x)=>{x.fillStyle='#1d2f7a';x.fillRect(0,0,20,12);x.fillStyle='#f6f6f0';x.fillRect(0,2.5,10,1);x.fillRect(4.5,0,1,6);x.fillStyle='#c8202a';x.fillRect(0,2.8,10,.5);x.fillRect(4.7,0,.6,6);x.fillStyle='#f6f6f0';[[5,9],[14,3],[16,7],[13,9],[17,5]].forEach(([a,b])=>x.fillRect(a,b,1,1));},null,{side:THREE.DoubleSide}),tx+.36,TH+3.45,tz);FDET.flags=(FDET.flags||[]).concat([flag]);
    FDET.P=FDET.P||{};FDET.P.townhall={x:tx,z:zf+.8};}

  // ===== Kings Square: two tall palms, bench seats, gulls on the pavement =====
  if(palm&&bb){[[311.3,-3.55,1.5,4.6],[306.2,-3.7,1.3,3.8],[318.4,-3.6,1.5,4.4]].forEach(([x,z,w,h])=>{bb(palm,x,z,w,h,0,true);col(x-.15,z-.12,x+.15,z+.12);});}
  [[309.6,-3.5],[316.4,-3.4]].forEach(([x,z])=>{put(B(1,.06,.34),M('#7a5a3a'),x,.42,z);put(B(1,.3,.05),M('#7a5a3a'),x,.6,z-.15);[-.42,.42].forEach(o=>put(B(.06,.42,.34),M('#2a2a30'),x+o,.21,z));col(x-.5,z-.2,x+.5,z+.2);});

  // ===== the white grid building on Kings Square: fins, deep windows, arched shop hoods with terracotta inside =====
  {hide(findGroup(312.8,-12));const x0=312.8,z0=-12,W=8,D=3,H=4.8,zf=z0+D/2;
    put(B(W,H,D),texM(16,16,(x)=>{x.fillStyle='#ece8e0';x.fillRect(0,0,16,16);x.fillStyle='#22262e';x.fillRect(3,2,10,12);x.fillStyle='#5a5048';x.fillRect(10,2,3,12);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(4,3,1,10);},[8,4]),x0,H/2+.5,z0);
    for(let i=0;i<=16;i++)put(B(.12,H-.6,.18),M('#f4f2ec'),x0-W/2+i*W/16,H/2+.8,zf+.08);
    put(B(W,1.1,D),M('#d8d0c4'),x0,.55,z0);plane(W-.3,.8,texM(32,8,(x)=>{x.fillStyle='#3a4250';x.fillRect(0,0,32,8);x.fillStyle='#c86a3a';for(let i=0;i<32;i+=4)x.fillRect(i,0,1,8);x.fillStyle='#ff6a8a';x.fillRect(5,2,6,1);x.fillStyle='#8af0c0';x.fillRect(20,3,5,1);}),x0,.5,zf+.01);
    for(let i=0;i<8;i++){const hx=x0-W/2+.5+i;const hood=put(new THREE.CylinderGeometry(.46,.46,.5,10,1,true,0,Math.PI),M('#f4f2ec'),hx,1.12,zf+.25,{rz:Math.PI/2,ry:Math.PI/2,nc:1});hood.material=new THREE.MeshLambertMaterial({color:0xf4f2ec,side:THREE.DoubleSide});
      const inner=put(new THREE.CylinderGeometry(.43,.43,.48,10,1,true,0,Math.PI),new THREE.MeshLambertMaterial({color:0xb8603a,side:THREE.BackSide}),hx,1.12,zf+.25,{rz:Math.PI/2,ry:Math.PI/2,nc:1});}
    {const g=new THREE.Group();g.position.set(x0+W/2-.3,0,zf+.3);G.add(g);put(B(.32,2.2,.14),M('#1c1c1e'),0,3.2,0,null,g);const s=sign('SEAGULL & CO.','#1c1c1e','#f6f6f0',2,.28,0,3.2,.08,0,g);s.rotation.z=Math.PI/2;for(let k=0;k<3;k++)put(B(.4,.36,.36),texM(8,8,(x)=>{x.fillStyle='#1c1c1e';x.fillRect(0,0,8,8);x.fillStyle='#d8d8d8';for(let i=1;i<8;i+=2)for(let j=1;j<8;j+=2)x.fillRect(i,j,1,1);}),.04,1.7-k*.4+0,.12,null,g);}
    // stone ball bollards and steel posts
    for(let i=0;i<9;i++){const bx=x0-W/2+.3+i*.95;put(new THREE.SphereGeometry(.22,10,8),M('#4a4c52'),bx,.22,zf+1.05);col(bx-.2,zf+.85,bx+.2,zf+1.25);}
    if(palm&&bb)[[x0-W/2-.6,zf+.6],[x0-W/2-.6,zf-1.6]].forEach(([x,z])=>{bb(palm,x,z,1.4,4.2,0,true);col(x-.15,z-.12,x+.15,z+.12);});}

  // ===== South Terrace: red road with a paved crown, yellow edge lines, coloured banners on the lamp posts =====
  {const red=texM(8,8,(x)=>{x.fillStyle='#8a3a30';x.fillRect(0,0,8,8);x.fillStyle='#9a463a';for(let i=0;i<10;i++)x.fillRect(r()*8|0,r()*8|0,1,1);},[1,12]);
    paint(2.2,24.2,red,304,9.1,.026);paint(.5,24.2,texM(8,8,(x)=>{x.fillStyle='#8c8c90';x.fillRect(0,0,8,8);x.fillStyle='#a0a0a4';for(let j=0;j<8;j+=2)for(let i=(j%4?1:0);i<8;i+=2)x.fillRect(i,j,1,1);},[1,24]),304,9.1,.028);
    [302.95,305.05].forEach(x=>paint(.05,24.2,'#e8c430',x,9.1,.03));
    const BAN=[['#e87aa8','FREO'],['#c8344a','FREO'],['#4a3a8a','FREO'],['#2a5a9a','FREO']];
    for(let z=0.5,k=0;z<20;z+=4.4,k++)[302.55,305.45].forEach((x,s)=>{put(C(.04,.06,3,6),M('#3a3e44'),x,1.5,z);put(B(.5,.04,.04),M('#3a3e44'),x+(s?-.22:.22),2.95,z);put(C(.12,.07,.12,6),new THREE.MeshBasicMaterial({color:0xfff0c8}),x+(s?-.44:.44),2.9,z,{nc:1});
      const b=BAN[(k+s)%4];const bn=sign(b[1],b[0],'#ffffff',.6,.32,x+(s?-.2:.2),2.25,z,Math.PI/2);bn.rotation.z=Math.PI/2;bn.scale.set(1.9,1,1);col(x-.07,z-.07,x+.07,z+.07);});}

  // ===== a red-brick technical school on High St: cream bands, a big gable with a striped arch, a chimney =====
  {hide(findGroup(289,.6));const x0=289,z0=.6,W=4.2,D=2.6,H=3.6,zf=z0+D/2;
    put(B(W,H,D),new THREE.MeshLambertMaterial({map:brickT([3,3])}),x0,H/2,z0);[.9,2.0,3.1].forEach(y=>put(B(W+.04,.1,D+.04),creamM,x0,y,z0));put(B(W+.06,.5,D+.06),M('#d8c8a0'),x0,.25,z0);
    const winM=texM(8,16,(x)=>{x.fillStyle='#efe3c4';x.fillRect(0,0,8,16);x.fillStyle='#22262e';x.fillRect(1,1,6,14);x.fillStyle='#efe3c4';x.fillRect(3.5,1,1,14);x.fillRect(1,6,6,1);},null);
    for(let i=0;i<5;i++)[1.4,2.65].forEach(y=>plane(.42,.9,winM,x0-W/2+.45+i*.83,y,zf+.01));
    put(B(1.5,1.2,.16),new THREE.MeshLambertMaterial({map:brickT([1,1])}),x0+.6,H+.6,zf-.06);put(gable(1.7,1.0,.2),M('#d8c8a0'),x0+.6,H+1.2,zf-.06);
    plane(1.3,1.0,texM(26,20,(x)=>{for(let k=0;k<14;k++){x.strokeStyle=k%2?'#efe3c4':'#a84a30';x.lineWidth=1.4;x.beginPath();x.arc(13,20,12-k*.35,Math.PI,0);x.stroke();}x.fillStyle='#22262e';x.fillRect(9,10,2,10);x.fillRect(12,10,2,10);x.fillRect(15,10,2,10);},null,{transparent:true,alphaTest:.3}),x0+.6,H+.75,zf+.03);
    sign(['TECHNICAL SCHOOL'],'#efe3c4','#5a3a22',1.5,.22,x0+.6,2.45,zf+.02);put(B(.36,1.1,.36),new THREE.MeshLambertMaterial({map:brickT([1,2])}),x0-1.6,H+.55,z0-.4);put(B(.44,.1,.44),creamM,x0-1.6,H+1.1,z0-.4);
    put(B(W+.02,.08,D+.02),M('#a84a30'),x0,H+.04,z0);}

  // ===== the prison gatehouse: two chamfered limestone towers, a curved pediment with a clock, an arch with an iron gate =====
  {const keep=[];scene.children.forEach(o=>{if(o.isMesh&&o.position.x>323.2&&o.position.x<326.8&&o.position.z>11.15&&o.position.z<11.35)keep.push(o);});keep.forEach(hide);
    const x0=325,z0=11.35;const L=limeM(2,3,'#e0d2b2');
    [-1,1].forEach(s=>{put(C(.78,.78,3.9,8),L,x0+s*1.45,1.95,z0,{ry:Math.PI/8});put(C(.9,.86,.22,8),M('#d8c8a6'),x0+s*1.45,3.98,z0,{ry:Math.PI/8});
      [[.6,2.6],[.6,1.1]].forEach(([y0])=>{});[1.1,2.7].forEach(y=>plane(.14,.7,M('#5a2a24'),x0+s*1.45,y,z0+.79));});
    put(B(1.4,3.3,1.2),L,x0,1.65,z0);put(new THREE.CylinderGeometry(.55,.55,1.2,14,1,false,0,Math.PI),L,x0,3.3,z0,{rx:Math.PI/2,rz:Math.PI/2});
    put(new THREE.CylinderGeometry(.55,.55,1.2,14,1,false,0,Math.PI),L,x0,3.3,z0,{rz:Math.PI/2,ry:0});
    plane(.62,.62,texM(16,16,(x)=>{x.fillStyle='#1b1b1e';x.beginPath();x.arc(8,8,7.5,0,7);x.fill();x.fillStyle='#d8b040';for(let k=0;k<12;k++){const a=k/12*6.283;x.fillRect(8+Math.cos(a)*6-.5,8+Math.sin(a)*6-.5,1,1);}x.fillRect(7.5,3,1,5);x.fillRect(8,7.5,3.5,1);},null,{transparent:true,alphaTest:.4}),x0,3.45,z0+.62);
    plane(.95,1.7,texM(16,28,(x)=>{x.fillStyle='#1b1b1e';x.beginPath();x.moveTo(0,28);x.lineTo(0,8);x.arc(8,8,8,Math.PI,0);x.lineTo(16,28);x.fill();x.fillStyle='#4a4a50';for(let i=1;i<16;i+=2)x.fillRect(i,4,1,24);x.fillRect(0,14,16,1);x.fillStyle='#f0e8d0';x.fillRect(5,18,6,10);},null,{transparent:true,alphaTest:.4}),x0,.86,z0+.61);
    put(B(1.5,.12,1.3),M('#d8c8a6'),x0,2.6,z0);
    // flag on a white pole, blue-and-white cones on the drive
    put(C(.03,.04,4.2,6),M('#f6f6f0'),x0-3.6,2.1,z0+1.2);const fl=plane(.8,.46,texM(20,12,(x)=>{x.fillStyle='#1d2f7a';x.fillRect(0,0,20,12);x.fillStyle='#f6f6f0';x.fillRect(0,2.5,10,1);x.fillRect(4.5,0,1,6);x.fillStyle='#c8202a';x.fillRect(0,2.8,10,.5);x.fillRect(4.7,0,.6,6);x.fillStyle='#f6f6f0';[[5,9],[14,3],[16,7],[13,9],[17,5]].forEach(([a,b])=>x.fillRect(a,b,1,1));},null,{side:THREE.DoubleSide}),x0-3.2,3.95,z0+1.2);FDET.flags=(FDET.flags||[]).concat([fl]);col(x0-3.66,z0+1.14,x0-3.54,z0+1.26);
    for(let i=0;i<4;i++){const cx=x0-1.6+i*1.07,cz=z0+2.3;put(C(.05,.16,.62,8),M('#1d4e9a'),cx,.31,cz);put(C(.07,.1,.1,8),M('#f6f6f0'),cx,.42,cz);col(cx-.12,cz-.12,cx+.12,cz+.12);}
    col(x0-2.3,z0-.8,x0+2.3,z0+.8);FDET.P=FDET.P||{};FDET.P.prisongate={x:x0,z:z0+1.4};}

  // ===== traffic: small two-tone retro hatchbacks (and some other cars) through High St, South Terrace and the harbour road =====
  if(CDET.makeCar){const V=[],GV=new THREE.Group();G.add(GV);
    const mkCar=()=>r()<.5?CDET.retroCar():CDET.makeCar(pick(['sedan','hatch','ute','hatch']),pick(['#c8344a','#2f6fb0','#f6f6f0','#2a2a30','#9aa4ac','#3e7d5c','#d8d2c4']));
    const HE=-2.45,HW=-1.55,SS=304.55,SN=303.45,BE=20.0,BW=20.8,ME=4.1,MW=4.9;
    const ROUTES=[{p:[[282,-8.45],[SS,-8.45],[SS,BE],[351,BE]],n:2},{p:[[351,BW],[SN,BW],[SN,-7.55],[282,-7.55]],n:2},
      {p:[[334.75,-5.6],[334.75,BW],[SN,BW],[SN,HW],[279.5,HW]],n:1},{p:[[279.5,HE],[SS,HE],[SS,BE],[333.85,BE],[333.85,-5.6]],n:1},
      {p:[[351,BW],[SN,BW],[SN,MW],[280.5,MW]],n:1},{p:[[280.5,ME],[SS,ME],[SS,BE],[351,BE]],n:1}];
    ROUTES.forEach(R=>{const P=[],pts=R.p;for(let i=0;i<pts.length;i++){if(i===0||i===pts.length-1){P.push(pts[i]);continue;}
        const[ax,az]=pts[i-1],[px,pz]=pts[i],[qx,qz]=pts[i+1];let d1x=px-ax,d1z=pz-az;const l1=Math.hypot(d1x,d1z);d1x/=l1;d1z/=l1;let d2x=qx-px,d2z=qz-pz;const l2=Math.hypot(d2x,d2z);d2x/=l2;d2z/=l2;
        const rr=.7,s0=[px-d1x*rr,pz-d1z*rr],s2=[px+d2x*rr,pz+d2z*rr];for(let k=0;k<=8;k++){const t=k/8,u=1-t;P.push([u*u*s0[0]+2*u*t*px+t*t*s2[0],u*u*s0[1]+2*u*t*pz+t*t*s2[1]]);}}
      R.P=P;R.S=[0];for(let i=1;i<P.length;i++)R.S.push(R.S[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));R.L=R.S[R.S.length-1];R.t=r()*4;});
    const at=(R,s)=>{let i=1;while(i<R.S.length-1&&R.S[i]<s)i++;const a=R.P[i-1],b=R.P[i],u=(s-R.S[i-1])/Math.max(1e-6,R.S[i]-R.S[i-1]);const dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;return{x:a[0]+dx*u,z:a[1]+dz*u,dx:dx/l,dz:dz/l};};
    const spawn=(R,s)=>{const m=mkCar();GV.add(m.g);const q=at(R,s);const v={R,s,v:1.6,g:m.g,len:m.len,wid:m.wid,vmax:1.7+r()*.6,x:q.x,z:q.z,dx:q.dx,dz:q.dz,wait:0,ghost:0};V.push(v);return v;};
    ROUTES.forEach(R=>{for(let k=0;k<R.n;k++){const s=R.L*(k+.3+r()*.4)/R.n;spawn(R,s);}});
    FDET.cars=V;
    const _lt=FDET.lifeTick;FDET.lifeTick=function(dt){_lt&&_lt(dt);if(!G.visible)return;dt=Math.min(dt||0,.1);
      if(FDET.flags){const t=performance.now()/1000;FDET.flags.forEach((f,i)=>{f.rotation.y=Math.sin(t*2.2+i)*.25;});}
      for(const c of V){let tg=c.vmax;if(c.ghost>0)c.ghost-=dt;else for(const o of V){if(o===c)continue;const ex=o.x-c.x,ez=o.z-c.z,al=ex*c.dx+ez*c.dz;if(al<=0||al>3.5)continue;if(Math.abs(-ex*c.dz+ez*c.dx)<(c.wid+o.wid)/2+.08){tg=Math.min(tg,Math.max(0,(al-c.len/2-o.len/2-.35)*2.2));}}
        const ex=player.x-c.x,ez=player.z-c.z,al=ex*c.dx+ez*c.dz,la=-ex*c.dz+ez*c.dx;if(al>0&&al<c.len/2+1.6&&Math.abs(la)<c.wid/2+.4)tg=Math.min(tg,Math.max(0,(al-c.len/2-.45)*2.4));
        c.wait=c.v<.05?c.wait+dt:0;if(c.wait>4){c.ghost=1.2;c.wait=0;}
        c.v+=Math.max(-6*dt,Math.min(2*dt,tg-c.v));c.s+=c.v*dt;}
      for(let i=V.length-1;i>=0;i--){const c=V[i];if(c.s>=c.R.L-.05){GV.remove(c.g);V.splice(i,1);continue;}const q=at(c.R,c.s);c.x=q.x;c.z=q.z;c.dx=q.dx;c.dz=q.dz;
        c.g.position.set(c.x,0,c.z);c.g.rotation.y=Math.atan2(-c.dz,c.dx);const k=Math.max(0,Math.min(1,Math.min(c.s,c.R.L-c.s)/1.2));c.g.scale.setScalar(k);c.g.visible=k>.02;
        const ex=player.x-c.x,ez=player.z-c.z,al=ex*c.dx+ez*c.dz,la=-ex*c.dz+ez*c.dx,hw=c.wid/2+.25;if(k>.5&&Math.abs(al)<c.len/2+.15&&Math.abs(la)<hw){const dl=(la<0?-hw:hw)-la;player.x+=dl*-c.dz;player.z+=dl*c.dx;}}
      for(const R of ROUTES){R.t-=dt;if(R.t>0)continue;R.t=4+Math.random()*7;if(V.filter(v=>v.R===R).length>=R.n+1)continue;const q0=R.P[0];if(V.some(v=>Math.hypot(v.x-q0[0],v.z-q0[1])<3))continue;spawn(R,0);}};}
})();
