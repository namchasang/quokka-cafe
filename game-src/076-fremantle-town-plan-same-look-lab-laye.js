// ---------- Fremantle town plan (same Look Lab layer as freo2: ?lab or ?freo) ----------
// Closer to the real street grid: Phillimore St past the station, Market St up to it, a car-free High St mall by
// Kings Square, Adelaide St east of the prison and Henderson St running on to Monument Hill. Kerbside parking on the
// big streets, two car parks, lawns in the empty corners, two-storey Victorian and Spanish-style shops with iron-lace
// verandahs that wrap around the outside (old books, an Irish pub, a café, an op shop, a corner hotel with a bar,
// a restaurant), and festoon lights and glowing windows after dark.
if(FDET.on&&FREO2_ON)(()=>{const G=FDET.g;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(...o.s);}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||8);
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const texM=(W,H,draw,rep,o)=>new THREE.MeshLambertMaterial(Object.assign({map:tex(W,H,draw,rep)},o||{}));
  const paint=(w,d,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const plane=(w,h,mat,x,y,z,ry,to)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;(to||G).add(m);return m;};
  const sign=(t,bg,fg,w,h,x,y,z,ry,to)=>{const L=Array.isArray(t)?t:[t];const tx=makeSign(L,Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);return plane(w,h,new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}),x,y,z,ry,to);};
  const r=mulberry32(1829),pick=a=>a[(r()*a.length)|0];
  const hide=o=>{if(o){o.visible=false;FDET.hid.push(o);}};
  const findGroup=(x,z)=>scene.children.find(o=>o.isGroup&&Math.abs(o.position.x-x)<.05&&Math.abs(o.position.z-z)<.05);
  const palm=FDET.palm,bb=FDET.bb;
  // night: windows glow (emissive), bulbs brighten, soft halos
  const EM=[],GL=[],HA=[];
  const haloT=(()=>{const c=mk(32,32),x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,220,150,1)');g.addColorStop(.4,'rgba(255,190,110,.45)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c);})();
  const halo=(x,y,z,s,to)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));m.position.set(x,y,z);m.scale.set(s,s,1);(to||G).add(m);HA.push(m);return m;};
  const glow=(day,night)=>{const m=new THREE.MeshBasicMaterial({color:new THREE.Color(day)});GL.push([m,new THREE.Color(day),new THREE.Color(night)]);return m;};
  // windows only glow: the emissive map keeps the warm window panes and blacks out the walls
  const litM=(W,H,draw,rep)=>{const t=tex(W,H,draw,rep);const e=tex(W,H,(x,w,h)=>{draw(x,w,h);const d=x.getImageData(0,0,w,h),a=d.data;for(let i=0;i<a.length;i+=4){const warm=a[i]>200&&a[i+1]>150&&a[i+2]<200&&a[i]-a[i+2]>40;if(!warm){a[i]=a[i+1]=a[i+2]=0;}}x.putImageData(d,0,0);},rep);
    const m=new THREE.MeshLambertMaterial({map:t,emissiveMap:e,emissive:new THREE.Color(0,0,0)});EM.push(m);return m;};
  const asph=texM(16,16,(x)=>{x.fillStyle='#4a4d55';x.fillRect(0,0,16,16);x.fillStyle='#55585f';for(let i=0;i<30;i++)x.fillRect(r()*16|0,r()*16|0,1,1);},[8,1]);
  const WHITE=M('#f3f3ea'),YEL=M('#e8c430');
  const road=(x1,z1,x2,z2,o)=>{const w=x2-x1,d=z2-z1;paint(w,d,asph,(x1+x2)/2,(z1+z2)/2,.021);if(o&&o.dash){const hz=w>d;const n=Math.floor((hz?w:d)/2.2);for(let k=0;k<n;k++){const t=(k+.5)/n;hz?paint(1,.07,WHITE,x1+t*w,(z1+z2)/2,.027):paint(.07,1,WHITE,(x1+x2)/2,z1+t*d,.027);}}};
  // kerbside bays: white ticks every car length, a parked car in most of them
  const PCOL=['#c8344a','#2f6fb0','#f6f6f0','#2a2a30','#9aa4ac','#3e7d5c','#d8d2c4','#f6f6f0'];
  const parked=(x,z,ry)=>{const m=r()<.35&&CDET.retroCar?CDET.retroCar():CDET.makeCar?CDET.makeCar(pick(['sedan','hatch','hatch','ute']),pick(PCOL)):null;if(!m)return;m.g.position.set(x,0,z);m.g.rotation.y=ry;G.add(m.g);
    const hz=Math.abs(Math.sin(ry))<.5;const hl=(hz?m.len:m.wid)/2,hw=(hz?m.wid:m.len)/2;col(x-hl,z-hw,x+hl,z+hw);};
  const kerbX=(x1,x2,z,ry,fill)=>{paint(x2-x1,.8,asph,(x1+x2)/2,z,.022);const n=Math.floor((x2-x1)/1.75);for(let k=0;k<=n;k++)paint(.05,.8,WHITE,x1+k*(x2-x1)/n,z,.028);for(let k=0;k<n;k++)if(k%3!==1&&r()<(fill||.75))parked(x1+(k+.5)*(x2-x1)/n,z,ry);};
  const kerbZ=(z1,z2,x,ry,fill)=>{paint(.8,z2-z1,asph,x,(z1+z2)/2,.022);const n=Math.floor((z2-z1)/1.75);for(let k=0;k<=n;k++)paint(.8,.05,WHITE,x,z1+k*(z2-z1)/n,.028);for(let k=0;k<n;k++)if(k%3!==1&&r()<(fill||.75))parked(x,z1+(k+.5)*(z2-z1)/n,ry);};
  const lamp=(x,z,h)=>{h=h||2.7;put(C(.04,.06,h,6),M('#2e3236'),x,h/2,z);put(new THREE.SphereGeometry(.13,8,6),glow('#f6efd8','#ffe2a0'),x,h+.08,z,{nc:1});halo(x,h+.08,z,1.6);col(x-.08,z-.08,x+.08,z+.08);};
  const lawn=(x1,z1,x2,z2)=>{paint(x2-x1,z2-z1,lmat(grassC,[(x2-x1)/3,(z2-z1)/3]),(x1+x2)/2,(z1+z2)/2,.018);};

  // ===== streets =====
  road(282,-9.2,305.1,-6.8,{dash:1});// Phillimore St, past the station
  road(302.9,-9.2,305.1,-2.9);// Market St, up to the station
  road(333.3,-6,335.3,21.2,{dash:1});// Adelaide St, east of the prison
  road(333.3,19.6,351.5,21.2,{dash:1});// Henderson St runs on to Monument Hill
  signPost(301.9,-9.9,makeSign(['PHILLIMORE ST'],56,10,'#1d3a6e','#ffffff'),1.6,.3);signPost(336,-5,makeSign(['ADELAIDE ST'],52,10,'#1d3a6e','#ffffff'),1.6,.3);signPost(306,-.6,makeSign(['HIGH ST MALL'],52,10,'#1d3a6e','#ffffff'),1.6,.3);

  // ===== kerbside parking on the big streets =====
  kerbX(283,292.5,-9.65,0);kerbX(283.2,302.4,-6.35,Math.PI,.8);
  kerbX(306,332.6,21.6,Math.PI,.8);kerbX(336,351,21.6,Math.PI,.7);
  kerbZ(-1.8,18.8,332.85,Math.PI/2,.7);

  // ===== High St mall: car-free pavers, flag planters down the middle, benches, festoon lights =====
  {paint(15.4,1.8,texM(8,8,(x)=>{x.fillStyle='#9a9690';x.fillRect(0,0,8,8);for(let j=0;j<8;j+=2)for(let i=(j%4?1:0);i<8;i+=2){x.fillStyle=pick(['#b0aca4','#a49e96','#8c8882']);x.fillRect(i,j,1,1);}},[15,2]),312.8,-2,.03);
    const FL=[['#f6f6f0','#1d3a9a'],['#e8c430','#1c1c1e'],['#d8323a','#f6f6f0'],['#1d3a9a','#d8323a'],['#f6f6f0','#d8323a']];
    for(let i=0;i<4;i++){const px=307.4+i*3.6,[a,b]=FL[i%5];const box=put(B(.62,.46,.62),texM(8,8,(x)=>{x.fillStyle=a;x.fillRect(0,0,8,8);x.fillStyle=b;x.fillRect(2,2,4,4);}),px,.23,-2);
      put(B(.56,.06,.56),M('#3a2a1e'),px,.47,-2);col(px-.31,-2.31,px+.31,-1.69);}
    for(let i=0;i<5;i++){const px=306+i*3.6;[-3.05,-.95].forEach(z=>{put(C(.04,.05,3,6),M('#2e3236'),px,1.5,z);col(px-.06,z-.06,px+.06,z+.06);});}
    // strings of bulbs, zig-zagging across the mall and the strip
    const string=(ax,az,bx,bz,y,n)=>{for(let k=0;k<=n;k++){const t=k/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t,yy=y-Math.sin(t*Math.PI)*.35;put(new THREE.SphereGeometry(.05,6,4),glow('#e8e0c8',pick(['#ffd890','#ffe8b0','#ffc070'])),x,yy,z,{nc:1});if(k%3===1)halo(x,yy,z,.7);}
      const L=new THREE.Line(new THREE.BufferGeometry().setFromPoints([...Array(n+1)].map((_,k)=>{const t=k/n;return new THREE.Vector3(ax+(bx-ax)*t,y-Math.sin(t*Math.PI)*.35+.04,az+(bz-az)*t);})),new THREE.LineBasicMaterial({color:0x2a2a2a}));G.add(L);};
    for(let i=0;i<4;i++){const x1=306+i*3.6,x2=x1+3.6;string(x1,-3.05,x2,-.95,2.95,9);string(x1,-.95,x2,-3.05,2.95,9);}
    for(let z=.5;z<17;z+=4.4)string(302.55,z,305.45,z+(z<16?4.4:0),2.85,9);}

  // ===== Victorian and Spanish-style shops: two storeys, iron-lace verandahs that wrap around the outside =====
  const laceM=texM(16,8,(x)=>{x.strokeStyle='#e8e4d8';x.lineWidth=1;x.beginPath();x.arc(8,8,7,Math.PI,0);x.stroke();x.beginPath();x.arc(8,8,4,Math.PI,0);x.stroke();x.fillStyle='#e8e4d8';for(let i=1;i<16;i+=3)x.fillRect(i,1,1,1);x.fillRect(0,0,16,1);},[3,1],{transparent:true,alphaTest:.4,side:THREE.DoubleSide});
  const railM=texM(16,8,(x)=>{x.fillStyle='#e8e4d8';x.fillRect(0,0,16,1);x.fillRect(0,7,16,1);for(let i=0;i<16;i+=2)x.fillRect(i,1,1,6);x.strokeStyle='#e8e4d8';x.beginPath();x.arc(8,4,2.5,0,7);x.stroke();},[3,1],{transparent:true,alphaTest:.4,side:THREE.DoubleSide});
  const corrM=c=>texM(8,8,(x)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?c:'#8a8f96';x.fillRect(i,0,1,8);}},[6,1]);
  function shopFront(name,c,kind){return litM(32,16,(x)=>{x.fillStyle=c;x.fillRect(0,0,32,16);x.fillStyle=kind==='pub'?'#ffcf7a':'#ffe8b8';x.fillRect(2,4,11,10);x.fillRect(19,4,11,10);x.fillStyle='#3a2a20';x.fillRect(14,3,4,13);
      x.fillStyle='rgba(60,40,30,.55)';for(let i=2;i<13;i+=3)x.fillRect(i,4,1,10);for(let i=19;i<30;i+=3)x.fillRect(i,4,1,10);
      if(kind==='books'){x.fillStyle='#8a3a2a';x.fillRect(3,10,9,1);x.fillStyle='#2f5a8a';x.fillRect(20,10,9,1);x.fillStyle='#c8a040';x.fillRect(3,7,9,1);}
      if(kind==='pub'){x.fillStyle='#2f6a3a';x.fillRect(3,12,9,2);x.fillStyle='#c8a040';x.fillRect(6,6,2,3);}
      if(kind==='cafe'){x.fillStyle='#7a4a2a';x.fillRect(4,9,3,2);x.fillRect(22,9,3,2);}
      if(kind==='op'){x.fillStyle='#e87aa8';x.fillRect(4,7,2,6);x.fillStyle='#5cc6d8';x.fillRect(8,7,2,6);x.fillStyle='#e8c430';x.fillRect(22,7,2,6);}});}
  const upperM=c=>litM(16,16,(x)=>{x.fillStyle=c;x.fillRect(0,0,16,16);x.fillStyle='#f2e8d4';x.fillRect(2,2,5,11);x.fillRect(9,2,5,11);x.fillStyle='#ffe2a8';x.fillRect(3,3,3,9);x.fillRect(10,3,3,9);x.fillStyle='#f2e8d4';x.fillRect(3,7,3,1);x.fillRect(10,7,3,1);});
  // x,z: centre; W,D: size; front faces +z; wrap: 'w' or 'e' adds the verandah round that side too
  function vic(x0,z0,W,D,o){const H=3.6,zf=z0+D/2,c=o.col,trim=o.trim||'#f2e8d4',g=new THREE.Group();g.position.set(x0,0,z0);(o.parent||G).add(g);if(o.ry)g.rotation.y=o.ry;
    put(B(W,H,D),M(c),0,H/2,0,null,g);
    plane(W-.1,1.5,shopFront(o.name,c,o.kind),0,.78,D/2+.01,0,g);plane(W-.1,1.4,upperM(c),0,2.55,D/2+.01,0,g);
    // parapet: Victorian pediment, or a curved Spanish gable with terracotta tiles
    if(o.spanish){const s=new THREE.Shape();s.moveTo(-W/2,0);s.lineTo(W/2,0);s.lineTo(W/2,.4);s.quadraticCurveTo(W/4,.45,W/6,.85);s.quadraticCurveTo(0,1.15,-W/6,.85);s.quadraticCurveTo(-W/4,.45,-W/2,.4);s.closePath();
        const pm=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false}),M(c));pm.position.set(0,H,D/2-.2);pm.castShadow=true;g.add(pm);put(B(W+.1,.1,D+.1),M('#b8603a'),0,H+.02,0,null,g);
        [-1,1].forEach(sd=>put(C(.12,.12,1.1,8),M(trim),sd*(W/2-.1),H+.5,D/2-.1,null,g));}
    else{put(B(W+.06,.5,.18),M(c),0,H+.25,D/2-.09,null,g);put(B(W+.14,.08,.24),M(trim),0,H+.52,D/2-.09,null,g);put(new THREE.ExtrudeGeometry((()=>{const s=new THREE.Shape();s.moveTo(-.8,0);s.lineTo(.8,0);s.lineTo(0,.5);s.closePath();return s;})(),{depth:.18,bevelEnabled:false}),M(trim),0,H+.56,D/2-.18,null,g);
        [-1,1].forEach(sd=>{put(B(.16,.3,.2),M(trim),sd*(W/2-.08),H+.65,D/2-.09,null,g);put(new THREE.SphereGeometry(.1,6,5),M(trim),sd*(W/2-.08),H+.88,D/2-.09,null,g);});}
    sign(o.name,o.signBg||'#1c1c1e',o.signFg||'#f6e8c8',Math.min(W-.4,o.name.length*.17+.4),.3,0,H+.25,D/2+.012,0,g);
    // verandah: posts, a balcony at the first floor with lace rail and frieze, a curved iron roof above
    const vd=.95,iron=M(o.iron||'#2c4a3a'),wl=(o.wrap||'').includes('w')?vd:0,wr=(o.wrap||'').includes('e')?vd:0,xa=-W/2-wl,xb=W/2+wr,zv=D/2+vd;
    const post=(px,pz)=>{put(B(.07,3.35,.07),iron,px,1.68,pz,null,g);col(x0+px-.06,z0+pz-.06,x0+px+.06,z0+pz+.06);};
    const deck=(cx,cz,gx,gz)=>{put(B(gx,.08,gz),M('#7a5a3a'),cx,1.75,cz,null,g);put(B(gx+.05,.06,gz+.05),corrM(o.roof||'#b8bcc0'),cx,3.35,cz,{nc:1},g);};
    const trims=(cx,cz,len,ry)=>{plane(len,.45,railM,cx,2.0,cz,ry,g);plane(len,.3,laceM,cx,1.5,cz,ry,g);plane(len,.3,laceM,cx,3.18,cz,ry,g);};
    deck((xa+xb)/2,D/2+vd/2,xb-xa,vd);trims((xa+xb)/2,zv,xb-xa,0);const n=Math.max(2,Math.round((xb-xa)/1.3));for(let k=0;k<=n;k++)post(xa+k*(xb-xa)/n,zv);
    [[-1,wl],[1,wr]].forEach(([sd,w])=>{if(!w)return;const ex=sd*(W/2+vd);deck(sd*(W/2+vd/2),0,vd,D);trims(ex,0,D,Math.PI/2);for(let k=0;k<2;k++)post(ex,-D/2+k*D/2);});
    if(o.lamps)[-1,1].forEach(sd=>{put(new THREE.SphereGeometry(.09,6,5),glow('#e8e0c8','#ffd890'),sd*W/3,1.55,D/2+vd,{nc:1},g);halo(x0+sd*W/3,1.55,z0+D/2+vd,1.1,o.parent);});
    col(x0-W/2,z0-D/2,x0+W/2,z0+D/2);return g;}
  // High St, north side: hide the plain filler shops and build the real kinds of places in their spots
  [[284,-4.4],[294,-4.4],[299,-4.4],[289,-4.4]].forEach(([x,z])=>hide(findGroup(x,z)));
  vic(284,-4.9,4.4,2,{name:'HARBOUR BOOKS · SECONDHAND',kind:'books',col:'#3e6a52',trim:'#efe3c4',signBg:'#efe3c4',signFg:'#2c4a3a',wrap:'w',lamps:1});
  vic(289,-4.9,4.4,2,{name:'THE GREEN HARP · IRISH PUB',kind:'pub',col:'#244a32',trim:'#c8a040',signBg:'#1c2a20',signFg:'#e8c860',iron:'#1c1c1e',lamps:1});
  vic(294,-4.9,4.4,2,{name:'CASA GAVIOTA CAFÉ',kind:'cafe',col:'#efe0c0',trim:'#f6f2e8',signBg:'#b8603a',signFg:'#fff3e0',spanish:1,iron:'#3a2a20',roof:'#c86a3a',lamps:1});
  vic(299,-4.9,4.4,2,{name:'SECOND CHANCE OP SHOP',kind:'op',col:'#e8a8b8',trim:'#f6f2e8',signBg:'#f6f2e8',signFg:'#a83a6a',wrap:'e',lamps:1});
  // the old hotel on the corner gets a proper verandah instead of the pyramid roof
  hide(findGroup(295.5,1.5));vic(295.5,1.2,8,2.4,{name:'THE PROMENADE HOTEL',kind:'pub',col:'#f6f2e8',trim:'#ffffff',signBg:'#3e5a4a',wrap:'e',iron:'#2c4a3a',roof:'#c8562e',lamps:1});
  // the north-east corner: a restaurant and a corner hotel with a bar, verandahs round the corner
  vic(323.2,-6.9,5.6,2.4,{name:'NONNA ROSA · TRATTORIA',kind:'cafe',col:'#c8603a',trim:'#f2e8d4',signBg:'#2c4a3a',signFg:'#f6e8c8',spanish:1,roof:'#b8603a',lamps:1});
  vic(329.7,-6.9,6.2,2.4,{name:"THE GULL'S REST HOTEL · BAR",kind:'pub',col:'#e8d8a8',trim:'#f6f2e8',signBg:'#5a2a2a',signFg:'#f6e8c8',wrap:'e',iron:'#1c1c1e',lamps:1});

  // ===== car parks: a lot north of Monument Hill (with a ticket machine) =====
  {const x1=340.6,x2=351,z1=-5.6,z2=-1.4;paint(x2-x1,z2-z1,asph,(x1+x2)/2,(z1+z2)/2,.02);
    for(let row=0;row<2;row++){const z=row?z2-.95:z1+.95,ry=row?-Math.PI/2:Math.PI/2;for(let k=0;k<=6;k++)paint(.05,1.6,WHITE,x1+.4+k*1.5,z,.028);for(let k=0;k<6;k++)if(r()<.7){const m=r()<.4?CDET.retroCar():CDET.makeCar(pick(['sedan','hatch','ute']),pick(PCOL));const px=x1+.4+(k+.5)*1.5;m.g.position.set(px,0,z);m.g.rotation.y=ry;G.add(m.g);col(px-m.wid/2,z-m.len/2,px+m.wid/2,z+m.len/2);}}
    put(B(.3,1,.24),M('#2a5a9a'),x1-.3,.5,z1+.4);sign('P','#2a5a9a','#ffffff',.5,.5,x1-.35,1.7,z1+.4);put(C(.03,.03,1.4,5),M('#d8d8d8'),x1-.35,.7,z1+.4);col(x1-.5,z1+.2,x1-.1,z1+.6);lamp(x2-.2,(z1+z2)/2,3);}

  // ===== lawns in the empty corners =====
  lawn(335.6,-1,339.6,19.4);lawn(312,8,318.3,14.2);lawn(329.6,-13.8,333.2,-9.6);
  [[331.4,-11.6]].forEach(([x,z])=>{put(B(1,.06,.34),M('#7a5a3a'),x,.42,z);put(B(1,.3,.05),M('#7a5a3a'),x,.6,z-.15);col(x-.5,z-.2,x+.5,z+.2);});
  [[286,-7],[296,-7],[336,4],[336,12],[318,16.8],[345,19]].forEach(([x,z])=>lamp(x,z));

  // night tick: chained after the traffic and the water life
  const night3=()=>{const n=typeof NIGHT==='number'?NIGHT:0;if(FDET._n===n)return;FDET._n=n;
    GL.forEach(([m,d,k])=>m.color.copy(d).lerp(k,n));HA.forEach(h=>h.material.opacity=n*.8);EM.forEach(m=>m.emissive.setRGB(n*1.2,n*1.0,n*.75));};
  Object.assign(FDET,{vic,glow3:glow,halo3:halo,lit3:litM,night3});
  const _lt=FDET.lifeTick;FDET.lifeTick=function(dt){_lt&&_lt(dt);if(!G.visible)return;night3();};
})();
