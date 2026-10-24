// ---------- City detail for Perth CBD: a Look Lab layer (shows with ?lab or ?city until CITY_DETAIL_LIVE is true) ----------
// Traffic that keeps left and stops at the lights, a two-way bike lane on Riverside Drive, parked cars, bus shelters,
// coffee kiosks, bins, benches, lamps, planters, shopfronts, a heritage row on Wellington St, a car park,
// a timber-framed Tudor Lane, and more of Kings Park (lemon-scented gums, a boab, flower beds, a lily pond).
const CITY_DETAIL_LIVE=true;
const CDET={on:CITY_DETAIL_LIVE||/[?&#](lab|city)\b/.test(location.search+location.hash),g:null,veh:[],glow:[],em:[],halos:[],extra:[],sig:{t:0,m:null},last:0,kiosks:[],
  show(v){if(this.g)this.g.visible=v;(this.hid||[]).forEach(o=>o.visible=!v);this.extra.forEach(o=>o.visible=v);this.veh.forEach(c=>c.g.visible=v);}};
if(CDET.on)(()=>{
  const G=new THREE.Group();G.name='cityDetail';scene.add(G);CDET.g=G;
  const MC={},GC={};
  const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const bx=(w,h,d)=>{const k='b'+w+'|'+h+'|'+d;return GC[k]||(GC[k]=new THREE.BoxGeometry(w,h,d));};
  const cy=(a,b,h,s)=>{const k='c'+a+'|'+b+'|'+h+'|'+(s||8);return GC[k]||(GC[k]=new THREE.CylinderGeometry(a,b,h,s||8));};
  const sp=(r,s)=>{const k='s'+r+'|'+(s||8);return GC[k]||(GC[k]=new THREE.SphereGeometry(r,s||8,Math.max(4,(s||8)*.75|0)));};
  const ic=r=>{const k='i'+r;return GC[k]||(GC[k]=new THREE.IcosahedronGeometry(r,0));};
  const tor=(r,t,a)=>{const k='t'+r+'|'+t+'|'+(a||0);return GC[k]||(GC[k]=new THREE.TorusGeometry(r,t,5,14,a||Math.PI*2));};
  function put(geo,mat,x,y,z,o,to){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;}
  function paint(w,d,c,x,z,y,rz){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof c==='string'?M(c):c);m.rotation.x=-Math.PI/2;if(rz)m.rotation.z=rz;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;}
  function glowMat(day,night){const m=new THREE.MeshBasicMaterial({color:new THREE.Color(day)});CDET.glow.push([m,new THREE.Color(day),new THREE.Color(night)]);return m;}
  const haloTex=(()=>{const c=mk(32,32),x=c.getContext('2d');const g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,228,170,1)');g.addColorStop(.4,'rgba(255,210,140,.45)');g.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c,{smooth:true});})();
  function halo(x,y,z,s,to){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:haloTex,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));m.position.set(x,y,z);m.scale.set(s,s,1);(to||G).add(m);CDET.halos.push(m);return m;}
  function signPlane(t,bg,fg,w,h,x,y,z,ry,to){const L=Array.isArray(t)?t:[t];const tex=makeSign(L,Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));m.position.set(x,y,z);if(ry)m.rotation.y=ry;(to||G).add(m);return m;}
  // the existing city building at (x,z), so new trim scales with it when the camera cuts it away
  const host=(x,z)=>{const e=CBD.cut.find(e=>Math.abs(e.g.position.x-x)<.05&&Math.abs(e.g.position.z-z)<.05);return e&&e.g;};
  function attach(o,g){g.add(o);CDET.extra.push(o);return o;}
  const r=(()=>{let s=20261024;return()=>(s=(s*16807)%2147483647)/2147483647;})();
  const pick2=a=>a[(r()*a.length)|0];
  const WHITE='#f3f3ea',DARK='#3a3d44';

  // ===== roads =====
  const asph=lmat(asphC,[39,1.1]);
  // Riverside Drive: a two-way bike lane on the north kerb, then one lane each way (z 3.9 to 6.15)
  paint(78,2.25,asph,661,5.025,.028);
  paint(78,.7,'#3f9a5a',661,4.25,.031);paint(78,.05,WHITE,661,4.62,.034);
  for(let x=623;x<700;x+=1.4)paint(.5,.035,WHITE,x,4.25,.034);
  for(let x=623;x<700;x+=2.4)paint(.9,.07,WHITE,x,5.38,.034);
  const bikeTex=(()=>{const c=mk(24,12),x=c.getContext('2d');x.strokeStyle='#fff';x.lineWidth=1.2;x.beginPath();x.arc(6,8,3,0,7);x.stroke();x.beginPath();x.arc(17,8,3,0,7);x.stroke();
    x.beginPath();x.moveTo(6,8);x.lineTo(10,3);x.lineTo(15,3);x.lineTo(17,8);x.moveTo(10,3);x.lineTo(12,8);x.lineTo(15,3);x.stroke();x.fillStyle='#fff';x.fillRect(9,1,3,1);x.fillRect(14,1,3,1);
    return new THREE.MeshLambertMaterial({map:ctex(c),transparent:true,alphaTest:.3});})();
  for(let x=626,i=0;x<700;x+=9,i++)paint(.62,.3,bikeTex,x,i%2?4.43:4.07,.035,i%2?Math.PI:0);
  // parking bays on the river side
  const BAYS=[[622.6,635.9],[660.4,668.3],[670.7,674],[682,699.6]],PARKED=[];
  BAYS.forEach(([a,b])=>{paint(b-a,.8,asph,(a+b)/2,6.55,.028);const n=Math.floor((b-a)/1.9);for(let k=0;k<=n;k++)paint(.04,.8,WHITE,a+k*(b-a)/n,6.55,.034);for(let k=0;k<n;k++)PARKED.push(a+(k+.5)*(b-a)/n);});
  // signalised junctions on St Georges Terrace: zebra crossings, stop lines, and the lights
  const J=[[639.1,-3.1],[667.3,-3.1]];
  const zebraH=(x,z1,z2,w)=>{for(let z=z1+.18;z<z2-.05;z+=.38)paint(w||.9,.2,WHITE,x,z,.036);};// across an east-west road
  const zebraV=(z,x1,x2,d)=>{for(let x=x1+.18;x<x2-.05;x+=.38)paint(.2,d||.9,WHITE,x,z,.036);};// across a north-south road
  J.forEach(([jx,jz])=>{paint(4.4,2.2,asph,jx,jz,.03);paint(2.2,4.4,asph,jx,jz,.0305);
    zebraH(jx-1.65,jz-1.1,jz+1.1);zebraH(jx+1.65,jz-1.1,jz+1.1);zebraV(jz-1.65,jx-1.1,jx+1.1);zebraV(jz+1.65,jx-1.1,jx+1.1);
    paint(.07,1.1,WHITE,jx-2.2,jz-.55,.036);paint(.07,1.1,WHITE,jx+2.2,jz+.55,.036);paint(1.1,.07,WHITE,jx+.55,jz-2.2,.036);paint(1.1,.07,WHITE,jx-.55,jz+2.2,.036);});
  zebraH(655.6,-4.2,-2.0);zebraH(669.5,3.9,6.15);zebraH(637.2,3.9,6.15);// Tudor Lane, the jetty, William St corner
  zebraV(-13.5,638,640.2,2);zebraV(-13.5,666.2,668.4,2);// where Hay Street Mall crosses the side streets
  const arrowTex=(()=>{const c=mk(24,8),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(2,3,14,2);x.beginPath();x.moveTo(15,0);x.lineTo(22,4);x.lineTo(15,8);x.fill();return new THREE.MeshLambertMaterial({map:ctex(c),transparent:true,alphaTest:.3});})();
  [628,648,684].forEach(x=>paint(.9,.3,arrowTex,x,-21.7,.034));// Wellington St is one way, eastbound
  const SIG={EW:[0,1,2].map(()=>new THREE.MeshBasicMaterial({color:0x2a2a2a})),NS:[0,1,2].map(()=>new THREE.MeshBasicMaterial({color:0x2a2a2a}))};CDET.sig.m=SIG;
  const disc=new THREE.CircleGeometry(.055,10);
  function sigPole(x,z,ry,axis,names){put(cy(.045,.05,1.95,6),M('#e8c020'),x,.97,z);const h=new THREE.Group();h.position.set(x,0,z);h.rotation.y=ry;G.add(h);
    put(bx(.17,.5,.12),M('#24262a'),0,1.72,0,null,h);put(bx(.2,.04,.1),M('#24262a'),0,1.99,.03,null,h);
    [1.88,1.72,1.56].forEach((y,i)=>{const d=new THREE.Mesh(disc,SIG[axis][i]);d.position.set(0,y,.062);h.add(d);});
    put(bx(.08,.13,.06),M('#e8c840'),0,1.0,.06,null,h);col(x-.08,z-.08,x+.08,z+.08);
    if(names){signPlane(names[0],'#1d4e9a','#ffffff',1.05,.18,x,2.12,z,0);signPlane(names[1],'#1d4e9a','#ffffff',.9,.18,x,2.34,z,Math.PI/2);}}
  J.forEach(([jx,jz],i)=>{const side=i?'BARRACK ST':'WILLIAM ST';
    sigPole(jx-1.35,jz-1.35,-Math.PI/2,'EW');sigPole(jx+1.35,jz+1.35,Math.PI/2,'EW');sigPole(jx+1.35,jz-1.35,Math.PI,'NS');sigPole(jx-1.35,jz+1.35,0,'NS',['ST GEORGES TCE',side]);});

  // ===== vehicles =====
  const glass=M('#9cb6c6'),tyre=M('#1c1c1e');
  const headM=glowMat('#dcd8c4','#fff6c8'),tailM=glowMat('#8a1c1c','#ff3a2a');
  function wheels(g,len,wid,rr){[-1,1].forEach(s=>put(cy(rr,rr,wid+.04,10),tyre,s*len*.32,rr,0,{rx:Math.PI/2},g));}
  function makeCar(kind,c){const g=new THREE.Group();let len=1.45,wid=.7;const B=M(c);
    if(kind==='bus'){len=3;wid=.88;put(bx(3,.74,.88),B,0,.58,0,null,g);put(bx(2.86,.3,.9),glass,-.02,.82,0,null,g);put(bx(3,.1,.88),M('#f6f6f0'),0,1.02,0,null,g);
      put(bx(.04,.36,.7),glass,1.5,.74,0,null,g);
      [.456,-.456].forEach((z,i)=>signPlane('CITY LOOP','#2e9a52','#ffffff',1.3,.2,-.2,.42,z,i?Math.PI:0,g));wheels(g,3,.88,.17);}
    else if(kind==='van'){len=1.6;wid=.74;put(bx(1.6,.62,.74),B,0,.47,0,null,g);put(bx(.04,.26,.62),glass,.8,.62,0,null,g);put(bx(.36,.2,.76),glass,.52,.64,0,null,g);
      [.372,-.372].forEach((z,i)=>signPlane('DELIVERIES','#2f6fb0','#ffffff',.8,.16,-.2,.5,z,i?Math.PI:0,g));wheels(g,len,wid,.15);}
    else if(kind==='ute'){put(bx(1.5,.3,.7),B,0,.3,0,null,g);put(bx(.58,.26,.62),glass,.24,.57,0,null,g);put(bx(.56,.05,.64),B,.24,.72,0,null,g);
      [.33,-.33].forEach(z=>put(bx(.7,.12,.04),B,-.38,.5,z,null,g));put(bx(.04,.12,.66),B,-.74,.5,0,null,g);wheels(g,len,wid,.15);}
    else{const hb=kind==='hatch';len=hb?1.25:1.45;put(bx(len,.3,wid),B,0,.29,0,null,g);
      const cl=hb?.74:.8,cx=hb?-.1:-.06;put(bx(cl,.24,wid-.08),glass,cx,.56,0,null,g);put(bx(cl-.04,.05,wid-.06),B,cx,.705,0,null,g);
      if(kind==='taxi'){put(bx(.28,.1,.18),M('#fff3c0'),cx,.78,0,null,g);put(bx(len+.01,.05,wid+.01),M('#2a2a30'),0,.36,0,{nc:1},g);}wheels(g,len,wid,.14);}
    put(bx(.03,.08,wid-.18),headM,len/2+.005,.34,0,{nc:1},g);put(bx(.03,.08,wid-.18),tailM,-len/2-.005,.34,0,{nc:1},g);
    return{g,len,wid};}
  const CARCOL=['#c8344a','#2f6fb0','#f6f6f0','#2a2a30','#9aa4ac','#3e7d5c','#e8a33a','#7a4a8a','#d8d2c4','#5cc6d8','#b8b8bc','#8a2a2a'];
  function randomCar(){const k=r();const kind=k<.34?'sedan':k<.54?'hatch':k<.64?'taxi':k<.8?'ute':'van';return makeCar(kind,kind==='taxi'?'#f1c64a':kind==='van'?pick2(['#f6f6f0','#f6f6f0','#d8d2c4']):pick2(CARCOL));}
  const SKIN=['#f1c7a0','#c8865a','#e8b892','#8a5a3a','#f6d8b8'];
  function makeBike(c,rider){const g=new THREE.Group();const fr=M(c);
    [-.3,.3].forEach(x=>put(tor(.19,.025),tyre,x,.21,0,null,g));
    put(bx(.5,.035,.035),fr,0,.4,0,null,g);put(bx(.035,.3,.035),fr,-.12,.3,0,{rz:.35},g);put(bx(.035,.3,.035),fr,.27,.33,0,{rz:-.25},g);put(bx(.05,.03,.3),M('#2a2c30'),.25,.5,0,null,g);put(bx(.12,.03,.07),M('#2a2c30'),-.16,.47,0,null,g);
    if(rider){const leg=M(pick2(['#2a3a5a','#3a3a48','#5a4a3a']));put(bx(.1,.34,.11),leg,-.06,.44,.07,{rz:.4},g);put(bx(.1,.34,.11),leg,-.02,.44,-.07,{rz:-.15},g);
      put(bx(.2,.36,.22),M(pick2(['#e8a33a','#c8344a','#3ec46a','#2f6fb0','#ef7d9a','#f6f2e8'])),.04,.76,0,{rz:-.6},g);
      put(sp(.1),M(pick2(SKIN)),.19,.96,0,null,g);put(sp(.115),M(pick2(['#f1c64a','#2a2a30','#5cc6d8','#f6f6f0'])),.18,1.01,0,{s:[1,.7,1]},g);
      put(bx(.08,.26,.07),M('#e8b892'),.2,.7,.08,{rz:-1.1},g);}
    return{g,len:.75,wid:.32};}

  // routes (keep left): St Georges Tce, Riverside Dr, Wellington St (one way) and turns through Barrack and William streets
  const SGe=-3.65,SGw=-2.55,RVe=4.99,RVw=5.77,WL=-21.7,BRs=667.85,WMn=638.55,BKe=4.07,BKw=4.43;
  const ROUTES=[
    {p:[[621,SGe],[701,SGe]],n:3,bus:.18},{p:[[701,SGw],[621,SGw]],n:3,bus:.18},
    {p:[[621,RVe],[701,RVe]],n:2},{p:[[701,RVw],[621,RVw]],n:2},
    {p:[[621,WL],[701,WL]],n:2,bus:.4,stopX:661.4},
    {p:[[621,WL],[BRs,WL],[BRs,RVe],[701,RVe]],n:1},
    {p:[[701,RVw],[WMn,RVw],[WMn,WL],[701,WL]],n:1},
    {p:[[621,SGe],[BRs,SGe],[BRs,RVw],[621,RVw]],n:1},
    {p:[[621,BKe],[701,BKe]],n:2,bike:1},{p:[[701,BKw],[621,BKw]],n:2,bike:1}];
  function at(R,s){s=Math.max(0,Math.min(R.L,s));let i=1;while(i<R.S.length-1&&R.S[i]<s)i++;const a=R.P[i-1],b=R.P[i],t=(s-R.S[i-1])/Math.max(1e-6,R.S[i]-R.S[i-1]);const dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;return{x:a[0]+dx*t,z:a[1]+dz*t,dx:dx/l,dz:dz/l};}
  ROUTES.forEach(R=>{const P=[],pts=R.p;for(let i=0;i<pts.length;i++){if(i===0||i===pts.length-1){P.push(pts[i]);continue;}
      const[ax,az]=pts[i-1],[px,pz]=pts[i],[qx,qz]=pts[i+1];let d1x=px-ax,d1z=pz-az,l1=Math.hypot(d1x,d1z);d1x/=l1;d1z/=l1;let d2x=qx-px,d2z=qz-pz,l2=Math.hypot(d2x,d2z);d2x/=l2;d2z/=l2;
      const rr=.75,s0=[px-d1x*rr,pz-d1z*rr],s2=[px+d2x*rr,pz+d2z*rr];for(let k=0;k<=8;k++){const t=k/8,u=1-t;P.push([u*u*s0[0]+2*u*t*px+t*t*s2[0],u*u*s0[1]+2*u*t*pz+t*t*s2[1]]);}}
    R.P=P;R.S=[0];for(let i=1;i<P.length;i++)R.S.push(R.S[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));R.L=R.S[R.S.length-1];
    R.stops=[];let inside=false;if(!R.bike)for(let s=0;s<R.L;s+=.1){const q=at(R,s);const j=J.some(([jx,jz])=>Math.abs(q.x-jx)<2.25&&Math.abs(q.z-jz)<2.25);if(j&&!inside)R.stops.push({s,axis:Math.abs(q.dx)>Math.abs(q.dz)?'EW':'NS'});inside=j;}
    if(R.stopX!=null)R.busS=R.stopX-R.p[0][0];R.t=r()*3;});
  function spawn(R,s){const isBus=!R.bike&&R.bus&&!CDET.veh.some(v=>v.R===R&&v.kind==='bus')&&r()<R.bus;
    const m=R.bike?makeBike(pick2(['#2a2c30','#c8344a','#2f6fb0','#f6f6f0','#3ec46a']),true):isBus?makeCar('bus','#3ec46a'):randomCar();
    G.add(m.g);const v={R,s,v:R.bike?1.6:2.4,g:m.g,len:m.len,wid:m.wid,kind:R.bike?'bike':isBus?'bus':'car',vmax:R.bike?(1.8+r()*.5):isBus?2.2:(2.6+r()*.8),x:0,z:0,dx:1,dz:0,dwell:0,served:false,wait:0,ghost:0};
    const q=at(R,s);v.x=q.x;v.z=q.z;v.dx=q.dx;v.dz=q.dz;CDET.veh.push(v);return v;}
  // the city is already busy when you arrive
  ROUTES.forEach(R=>{for(let k=0;k<R.n;k++){const s=R.L*(k+.3+r()*.4)/R.n;if(s>2&&s<R.L-2)spawn(R,s);}});
  // parked cars along the river (one ute with a surfboard: this is Perth)
  PARKED.forEach((x,i)=>{if(r()<.25)return;const m=i===5?makeCar('ute','#f6f6f0'):randomCar();if(i===5)put(bx(.95,.04,.26),M('#5cc6d8'),-.1,.78,0,null,m.g);
    m.g.position.set(x,0,6.55);m.g.rotation.y=Math.PI;G.add(m.g);col(x-m.len/2,6.55-m.wid/2,x+m.len/2,6.55+m.wid/2);});
  // pay stations for the bays
  [630.8,664.3,690].forEach(x=>{put(bx(.26,.9,.2),M('#2a5a9a'),x,.45,7.12);put(bx(.18,.14,.01),glowMat('#6a8aa0','#bfe8ff'),x,.72,7.225,{nc:1});signPlane('P','#2a5a9a','#ffffff',.22,.22,x,1.05,7.12);col(x-.15,7,x+.15,7.24);});

  // ===== street furniture =====
  function lamp(x,z,face){put(cy(.04,.06,2.8,6),M('#b8bcc0'),x,1.4,z);const ax=face||0;put(bx(.05,.05,.42),M('#b8bcc0'),x,2.78,z+ax*.2);
    put(bx(.22,.08,.32),M('#8a8e92'),x,2.75,z+ax*.4);put(bx(.16,.02,.24),glowMat('#d8d4c0','#ffe6a8'),x,2.7,z+ax*.4,{nc:1});halo(x,2.55,z+ax*.4,1.9);col(x-.08,z-.08,x+.08,z+.08);}
  function oldLamp(x,z){put(cy(.05,.08,2.2,8),M('#2a3a32'),x,1.1,z);put(cy(.14,.09,.32,6),glowMat('#d8d4c0','#ffe6a8'),x,2.36,z,{nc:1});put(cy(.02,.18,.14,6),M('#2a3a32'),x,2.59,z);halo(x,2.36,z,1.7);col(x-.09,z-.09,x+.09,z+.09);}
  function bin(x,z,lid){put(cy(.17,.15,.5,10),M('#2f4a3a'),x,.25,z);put(cy(.18,.18,.05,10),M(lid||'#c8344a'),x,.525,z);col(x-.18,z-.18,x+.18,z+.18);}
  function binPair(x,z){bin(x-.21,z,'#c8344a');bin(x+.21,z,'#e8c840');}
  function bench(x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry||0;G.add(g);const wd=M('#a8743a'),ir=M('#2a2c30');
    [-.1,0,.1].forEach(o=>put(bx(1.2,.04,.08),wd,0,.42,o,null,g));[.6,.74].forEach(y=>put(bx(1.2,.07,.035),wd,0,y,-.17,null,g));[-.52,.52].forEach(o=>{put(bx(.05,.42,.34),ir,o,.21,-.02,null,g);put(bx(.05,.42,.04),ir,o,.6,-.17,null,g);});
    const q=Math.abs(Math.sin(ry||0))>.5;col(x-(q?.22:.62),z-(q?.62:.22),x+(q?.22:.62),z+(q?.62:.22));}
  const BUSH=['#4f8f3e','#5ea64a','#3f7a33','#6aa84f'];
  function bushes(x,z,w,d,n,flowers){for(let i=0;i<n;i++){const bx2=x+(r()-.5)*w,bz=z+(r()-.5)*d,s=.75+r()*.5;put(ic(.28),M(pick2(BUSH)),bx2,.32*s+.2,bz,{s:[s,s*.85,s],ry:r()*6},);
      if(flowers)for(let k=0;k<3;k++)put(sp(.045,5),M(pick2(flowers)),bx2+(r()-.5)*.4,.5*s+.25,bz+(r()-.5)*.35,{nc:1});}}
  function planter(x,z,w,fl){put(bx(w,.35,.6),M('#b8b2a6'),x,.175,z);put(bx(w-.1,.02,.5),M('#5a4232'),x,.355,z,{nc:1});bushes(x,z,w-.4,.25,Math.round(w*2),fl);col(x-w/2,z-.3,x+w/2,z+.3);}
  function treePlanter(x,z){put(cy(.42,.38,.4,10),M('#b8b2a6'),x,.2,z);put(cy(.06,.08,1.1,6),M('#6b4a32'),x,.95,z);put(ic(.5),M('#4f8f3e'),x,1.75,z,{s:[1,.9,1]});put(ic(.34),M('#6aa84f'),x+.25,1.55,z+.15);col(x-.42,z-.42,x+.42,z+.42);}
  function hedge(x1,z1,x2,z2){const L=Math.hypot(x2-x1,z2-z1),n=Math.ceil(L/.42);for(let i=0;i<=n;i++){const t=i/n;put(ic(.3),M(pick2(BUSH)),x1+(x2-x1)*t,.3,z1+(z2-z1)*t,{s:[1.1,.9,1.1],ry:r()*6});}col(Math.min(x1,x2)-.3,Math.min(z1,z2)-.3,Math.max(x1,x2)+.3,Math.max(z1,z2)+.3);}
  function bistro(x,z,c){put(cy(.24,.24,.04,10),M('#f6f6f0'),x,.56,z);put(cy(.03,.05,.56,6),M(DARK),x,.28,z);[-1,1].forEach(s=>{put(bx(.24,.04,.24),M(DARK),x+s*.42,.34,z);put(bx(.24,.3,.03),M(DARK),x+s*.42,.5,z-.11);});
    put(cy(.02,.02,1.4,5),M('#d8d4c0'),x,1.12,z);put(new THREE.ConeGeometry(.72,.3,8),M(c),x,1.75,z);col(x-.55,z-.25,x+.55,z+.25);}
  function aFrame(x,z,lines,c){const g=new THREE.Group();g.position.set(x,0,z);G.add(g);const t=signPlane(lines,c,'#f6f2e8',.42,.5,0,.36,.07,0,g);t.rotation.x=-.16;const b=put(bx(.44,.54,.02),M('#5a4232'),0,.35,-.09,{rx:.16},g);}
  function busStop(x,z,f){const gl=new THREE.MeshLambertMaterial({color:0xcfe8f0,transparent:true,opacity:.42}),fr=M(DARK);
    const bz=z-f*.48;put(bx(2.24,.07,1.06),fr,x,1.96,z);put(bx(2.2,1.6,.035),gl,x,1.05,bz,{nc:1});put(bx(.035,1.6,.9),gl,x-1.08,1.05,z,{nc:1});
    [-1.1,1.1].forEach(o=>put(cy(.035,.035,1.95,6),fr,x+o,.98,bz));put(cy(.035,.035,1.95,6),fr,x-1.1,.98,z+f*.45);
    put(bx(1.3,.05,.3),M('#a8743a'),x+.25,.45,bz+f*.2);[-.3,.8].forEach(o=>put(bx(.05,.45,.25),fr,x+o,.22,bz+f*.2));
    signPlane(['ROTTNEST','FERRY DAILY'],'#2f6fb0','#fff8e6',.62,.46,x-.55,1.2,bz+f*.025,f>0?0:Math.PI);
    signPlane('BUS STOP','#2e9a52','#ffffff',.9,.18,x,1.88,z+f*.535,f>0?0:Math.PI);
    col(x-1.14,bz-.05,x+1.14,bz+.05);col(x-1.12,Math.min(bz,z+f*.45)-.04,x-1.04,Math.max(bz,z+f*.45)+.04);}
  function kiosk(x,z,name,c,drink,price){const k={x,z,name,drink,price};CDET.kiosks.push(k);
    put(bx(1.8,1.35,1.1),M('#f4ecd8'),x,.675,z);put(bx(1.86,.16,1.16),M(c),x,1.43,z);
    put(new THREE.PlaneGeometry(1.4,.44),glowMat('#4a3426','#ffd890'),x,1.12,z+.556,{nc:1});
    put(bx(1.6,.08,.32),M('#a8743a'),x,.92,z+.66);put(bx(.34,.26,.2),M('#c8ccd0'),x-.42,1.04,z+.38);put(cy(.05,.05,.12,6),M('#f6f6f0'),x+.2,1.02,z+.66);put(cy(.05,.05,.12,6),M('#f6f6f0'),x+.45,1.02,z+.66);
    const st=(()=>{const cv=mk(16,4),g=cv.getContext('2d');for(let i=0;i<16;i+=2){g.fillStyle=i%4?'#f6f2e8':c;g.fillRect(i,0,2,4);}return new THREE.MeshLambertMaterial({map:ctex(cv),side:THREE.DoubleSide});})();
    const aw=put(new THREE.PlaneGeometry(1.92,.5),st,x,1.32,z+.75);aw.rotation.x=-1.0;
    signPlane(name,c,'#fff8e6',1.5,.15,x,1.43,z+.585);
    put(cy(.26,.19,.55,12),M('#f6f6f0'),x,1.8,z);put(cy(.27,.235,.18,12),M('#a8743a'),x,1.76,z);put(cy(.29,.28,.07,12),M('#5a3a22'),x,2.1,z);
    aFrame(x+1.2,z+.75,[drink.toUpperCase(),price+' COINS'],'#2c3b38');col(x-.92,z-.57,x+.92,z+.57);}

  // St Georges Terrace: lamps, bins, planters, a bus shelter, café tables, a post box
  [625,633,651.5,660,672.5,680.5,697].forEach(x=>lamp(x,-4.7,1));
  [626.4,657.8,664.6,672.8,680.3,687.8,695.3].forEach(x=>planter(x,-.55,1.4,['#ef7d9a','#f6f2e8','#e8c840']));
  [[633.3,-.4],[676.5,-.45],[697.6,-.45],[629.2,-4.75],[664.2,-4.75],[687.4,-4.75]].forEach(([x,z])=>binPair(x,z));
  busStop(684.5,-5.45,1);bench(635.6,-.3,Math.PI);{put(cy(.035,.035,1.9,6),M(DARK),634.6,.95,-.45);signPlane('BUS STOP','#2e9a52','#ffffff',.5,.36,634.6,1.75,-.43,0);}
  bistro(644.2,-5.0,'#2f5a3a');bistro(647.8,-5.0,'#2f5a3a');
  {const x=637.2,z=-.2;put(cy(.17,.17,.72,10),M('#c8202a'),x,.36,z);put(sp(.17,10),M('#c8202a'),x,.72,z,{s:[1,.55,1]});put(bx(.18,.03,.02),M('#2a1414'),x,.58,z+.17,{nc:1});col(x-.18,z-.18,x+.18,z+.18);}
  // Elizabeth Quay plaza: coffee, bikes, a drinking fountain, bollards on the kerb
  kiosk(660.6,.9,'LONG BLACK & CO','#2a2a30','Long black',4);bistro(658.1,2.55,'#e8e2d0');bistro(663.1,2.55,'#e8e2d0');
  {const x=644,z=2.7;[-.6,0,.6].forEach(o=>put(tor(.26,.025,Math.PI),M('#9aa4ac'),x+o,0,z,{ry:Math.PI/2}));[[-.3,'#c8344a'],[.3,'#2f6fb0']].forEach(([o,c])=>{const b=makeBike(c,false);b.g.position.set(x+o,0,z);b.g.rotation.y=Math.PI/2;G.add(b.g);});col(x-.9,z-.4,x+.9,z+.4);}
  {const x=655,z=2.9;put(cy(.1,.13,.78,8),M('#9aa0a6'),x,.39,z);put(cy(.19,.12,.08,10),M('#c8ccd0'),x,.8,z);col(x-.15,z-.15,x+.15,z+.15);}
  for(let x=641;x<=659;x+=1.5){if(x>646&&x<654)continue;put(cy(.07,.08,.5,8),M('#c8ccd0'),x,.25,3.72);}
  // Riverside walk: benches facing the water, lamps, bins, shade trees
  [628.5,636.5,664.5,684,691,697.5].forEach(x=>bench(x,8.9,0));[625,633,662,672.3,686,694].forEach(x=>lamp(x,8.95,-1));[[630.8,8.95],[666.4,8.95],[689.5,8.95]].forEach(([x,z])=>binPair(x,z));
  // railing where the road runs along the quay
  for(let x=640.4;x<660;x+=1.2)put(cy(.03,.03,.5,5),M('#c8ccd0'),x,.25,6.18,{nc:1});put(bx(19.4,.04,.04),M('#c8ccd0'),650.1,.5,6.18,{nc:1});
  // Wellington St: City Loop shelter, bins, one-way sign
  busStop(661.4,-19.75,-1);binPair(633,-20.55);binPair(656.5,-20.55);
  {put(cy(.035,.035,1.8,6),M(DARK),624.4,.9,-20.55);signPlane('ONE WAY','#1b1b1b','#ffffff',.66,.2,624.4,1.68,-20.53,0);}
  // Hay Street Mall: tree planters, benches, lamps, bins, A-frames and things out on the footpath
  [628,652,680,686].forEach(x=>treePlanter(x,-12.15));[632,648,676,683].forEach(x=>bench(x,-12.25,Math.PI));[636,660,672].forEach(x=>oldLamp(x,-12.2));[[644,-12.2],[670.4,-12.25],[688.8,-12.2]].forEach(([x,z])=>binPair(x,z));
  [[641,['BOOK','SALE'],'#2f5a3a'],[654,['FUDGE','INSIDE'],'#e86a8a'],[670.5,['NEW','IN'],'#1d3a6e'],[683.5,['TEA','TASTING'],'#c8344a']].forEach(([x,t,c])=>aFrame(x,-14.7,t,c));
  {const x=643.7,z=-15.5;put(bx(.8,.4,.4),M('#7a5033'),x,.4,z);for(let i=0;i<7;i++)put(bx(.08,.22,.3),M(pick2(['#c8344a','#2f6fb0','#e8b04a','#3e7d5c','#f6f2e8'])),x-.3+i*.1,.71,z);col(x-.42,z-.22,x+.42,z+.22);}
  {const x=650.2,z=-15.5;put(bx(.9,.04,.04),M('#c8ccd0'),x,1.1,z);[-.45,.45].forEach(o=>put(cy(.02,.02,1.1,5),M('#c8ccd0'),x+o,.55,z));for(let i=0;i<5;i++)put(bx(.14,.42,.3),M(pick2(['#ef7d9a','#f6f2e8','#7a4a8a','#5cc6d8','#e8a33a'])),x-.32+i*.16,.82,z);col(x-.47,z-.2,x+.47,z+.2);}
  {const x=656.7,z=-15.5;put(bx(.8,.5,.45),M('#f6f2e8'),x,.25,z);for(let i=0;i<4;i++)put(cy(.08,.08,.18,8),new THREE.MeshLambertMaterial({color:pick2(['#ef7d9a','#e8c840','#5cc6d8','#a8e06a']),transparent:true,opacity:.85}),x-.27+i*.18,.6,z);col(x-.42,z-.24,x+.42,z+.24);}
  for(let i=0;i<5;i++){const x=683.5+i*1.1;put(cy(.002,.002,.22,3),M('#2a2c30'),x,2.06,-15.3,{nc:1});put(sp(.13,8),glowMat('#c8344a','#ff7050'),x,1.86,-15.3,{s:[1,1.15,1]});}
  kiosk(662.3,-15.0,'BEAN THERE','#5a3a22','Flat white',4);bistro(659.9,-15.35,'#c8344a');bistro(664.7,-15.35,'#c8344a');

  // ===== shopfronts: glass, goods and a door on the ground floor; windows glow at night =====
  function shopMat(kind,wall,acc){const c=mk(48,16),x=c.getContext('2d'),e=mk(48,16),y=e.getContext('2d');x.fillStyle=wall;x.fillRect(0,0,48,16);
    const R=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};const P=['#e8b04a','#c8344a','#2f6fb0','#3e7d5c','#f6f2e8','#ef7d9a','#7a4a8a','#5cc6d8'];
    R(2,3,34,12,kind==='lobby'?'#6a8aa0':'#2c3a46');R(38,2,8,14,acc);R(39.5,3.5,5,7,'#3a4a58');R(44,9,1,2,'#e8c840');R(1,2,36,1,acc);R(1,15,36,1,'#5a4a3a');
    const shelf=y0=>R(3,y0,32,1,'#8a6a4a');
    switch(kind){
      case'books':shelf(8);shelf(14);for(let i=0;i<31;i+=2){R(3+i,4+(i*7%3),2,4-(i*7%3),P[(i/2|0)%8]);R(3+i,10+(i*5%3),2,4-(i*5%3),P[(i/2+3|0)%8]);}break;
      case'fashion':R(3,4,32,1,'#c8ccd0');for(let i=0;i<5;i++){const cx=5+i*6.4;R(cx,5,4,5,P[(i+1)%8]);R(cx+1,10,2,3,'#3a3a48');}break;
      case'sweets':shelf(9);shelf(14);for(let i=0;i<8;i++){R(4+i*4,5,3,4,P[(i+5)%8]);R(4+i*4,11,3,3,P[(i+2)%8]);}break;
      case'outdoor':for(let i=0;i<4;i++){x.fillStyle=P[i+1];x.beginPath();x.moveTo(5+i*8,14);x.lineTo(9+i*8,6);x.lineTo(13+i*8,14);x.fill();}R(3,4,32,1,'#e8b04a');break;
      case'pharmacy':R(16,5,6,2,'#3ec46a');R(18,3,2,6,'#3ec46a');shelf(10);shelf(14);for(let i=0;i<10;i++)R(4+i*3.1,11,2,3,i%2?'#f6f6f0':'#bfe6f2');break;
      case'tea':for(let i=0;i<4;i++){R(5+i*8,4,4,4,'#d83a3a');R(6+i*8,8,2,1,'#e8b04a');}shelf(13);for(let i=0;i<6;i++)R(4+i*5,11,3,2,'#f6f2e8');break;
      case'cafe':R(3,11,32,4,'#7a5033');for(let i=0;i<6;i++)R(5+i*5,9,2,2,'#f6f6f0');R(28,5,6,5,'#c8ccd0');R(4,4,10,4,'#2c3b38');break;
      case'news':shelf(9);shelf(14);for(let i=0;i<10;i++){R(3+i*3.2,5,2.6,4,P[i%8]);R(3+i*3.2,11,2.6,3,P[(i+4)%8]);}break;
      case'ramen':R(3,3,32,3,'#c8344a');for(let i=0;i<4;i++)R(5+i*8,3,1,3,'#f6f2e8');R(3,12,32,3,'#7a5033');for(let i=0;i<5;i++){R(5+i*6,9,4,3,'#f6f2e8');R(6+i*6,9,2,1,'#e8a33a');}break;
      case'bakery':shelf(9);shelf(14);for(let i=0;i<7;i++){R(4+i*4.4,6,3,3,'#c8864a');R(4+i*4.4,12,3,2,i%2?'#ef7d9a':'#f6e8d0');}break;
      case'records':for(let i=0;i<5;i++)for(let j=0;j<2;j++)R(4+i*6.2,4+j*5.5,5,5,P[(i*2+j)%8]);break;
      case'pizza':R(14,4,10,9,'#5a3a2a');R(16,7,6,5,'#ff9a3a');for(let i=0;i<3;i++)R(4+i*2,10,2,2,'#e8b04a');R(27,10,6,4,'#f6f2e8');break;
      case'optical':x.strokeStyle='#e8e2d0';x.lineWidth=1;x.strokeRect(9.5,6.5,7,5);x.strokeRect(21.5,6.5,7,5);R(16,8,6,1,'#e8e2d0');break;
      case'camera':shelf(11);for(let i=0;i<5;i++){R(4+i*6.2,6,5,4,'#2a2a30');R(6+i*6.2,7,2,2,'#9cb6c6');}break;
      case'dumpling':for(let i=0;i<4;i++)for(let j=0;j<2;j++)R(5+i*8,5+j*4,6,3,'#c8a060');R(3,13,32,2,'#7a5033');R(32,3,3,4,'#d83a3a');break;
      case'bubble':shelf(13);for(let i=0;i<6;i++){R(5+i*5,6,3,6,P[(i+3)%8]);R(5+i*5,11,3,1,'#2a2a30');}break;
      case'pub':R(3,11,32,4,'#6b4a32');for(let i=0;i<8;i++)R(4+i*4,5,2,5,P[i%3?6:0]);R(3,4,32,1,'#e8b04a');break;
      case'lobby':R(8,9,3,5,'#3e7d5c');R(27,9,3,5,'#3e7d5c');R(14,11,10,3,'#c8ccd0');break;
      case'florist':for(let i=0;i<16;i++)R(4+i*2,8+(i*3%4),2,2,P[(i+1)%8]);R(3,12,32,3,'#3e7d5c');break;
    }
    x.fillStyle='rgba(255,255,255,.16)';for(let i=0;i<3;i++){x.beginPath();x.moveTo(6+i*12,3);x.lineTo(9+i*12,3);x.lineTo(4+i*12,15);x.lineTo(1+i*12,15);x.fill();}
    y.fillStyle='#000';y.fillRect(0,0,48,16);y.drawImage(c,2,3,34,12,2,3,34,12);y.drawImage(c,39,3,6,8,39,3,6,8);
    const m=new THREE.MeshLambertMaterial({map:ctex(c),emissive:new THREE.Color(0),emissiveMap:ctex(e)});CDET.em.push(m);return m;}
  function front(g,w,h,kind,wall,acc,zf){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),shopMat(kind,wall,acc));m.position.set(0,h/2+.02,zf);m.receiveShadow=true;return attach(m,g);}
  // Hay Street Mall shops (the row from the CBD build) get real windows
  [[643,'books','#f2ead8','#2f5a3a'],[649.5,'fashion','#f6f2e8','#8a3a5a'],[656,'sweets','#fff3e6','#e86a8a'],[672.5,'outdoor','#e8e2d4','#1d3a6e'],[679,'pharmacy','#f6f6f0','#3f9a6a'],[685.5,'tea','#f6e8d0','#c8344a']]
    .forEach(([x,k,w,a])=>{const g=host(x,-18);if(g)front(g,5.2,1.75,k,w,a,2.02);});
  // the towers on St Georges Terrace get lobbies, a café, a newsagent and a noodle bar at street level
  [[627,8,'lobby','#9ab0c0','#2f6fb0','WESTSIDE BANK'],[646,9,'cafe','#c8d2d8','#5a3a22','TERRACE ESPRESSO'],[662,6,'news','#b8c4cc','#1d3a6e','CITY NEWS'],[675,9,'lobby','#8aa0b4','#1d3a6e',null],[685,6,'ramen','#d0c8bc','#c8344a','NOODLE BAR']]
    .forEach(([x,w,k,wall,acc,name])=>{const g=host(x,-8.5);if(!g)return;front(g,w-.6,1.75,k,wall,acc,2.52);
      if(name)CDET.extra.push(signPlane(name,acc,'#fff8e6',Math.min(w-1,name.length*.17+.4),.26,0,2.05,2.53,0,g));
      if(k==='cafe'||k==='ramen'){const a=new THREE.Mesh(bx(w-.8,.06,.75),M(acc));a.position.set(0,1.95,2.88);a.castShadow=true;attach(a,g);}});
  // ===== a heritage row on Wellington Street, and a car park =====
  function heritage(x,w,h,wall,kind,name,acc,o){o=o||{};const z=-24.75,d=3.5;const g=bld(x,z,w,d,h,wall,{winCol:o.win||'#4a5a6a',parapet:o.par||null});scene.remove(g);G.add(g);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(w-.3,1.75),shopMat(kind,wall,acc));f.position.set(x,.9,-22.98);G.add(f);
    put(bx(w,.06,.52),M(o.ver||DARK),x,2.06,-22.72);[-1,1].forEach(s=>put(cy(.03,.03,2.06,5),M(o.ver||DARK),x+s*(w/2-.12),1.03,-22.52));
    if(o.lace){const c=mk(32,4),q=c.getContext('2d');q.fillStyle='rgba(0,0,0,0)';q.clearRect(0,0,32,4);q.fillStyle='#e8e2d0';for(let i=0;i<32;i+=4){q.fillRect(i,0,1,4);q.fillRect(i+1,1,2,1);q.fillRect(i+2,2,1,2);}q.fillRect(0,0,32,1);
      const t=ctex(c);t.wrapS=THREE.RepeatWrapping;t.repeat.set(Math.round(w/1.2),1);const lm=new THREE.Mesh(new THREE.PlaneGeometry(w-.1,.24),new THREE.MeshLambertMaterial({map:t,transparent:true,alphaTest:.3,side:THREE.DoubleSide}));lm.position.set(x,1.9,-22.47);G.add(lm);
      put(bx(w,.06,.5),M(o.ver||DARK),x,3.1,-22.73);put(bx(w,.3,.03),M('#e8e2d0'),x,3.3,-22.48);}
    signPlane(name,acc,'#fff8e6',Math.min(w-.4,name.length*.16+.4),.24,x,2.24,-22.45);
    if(o.year)signPlane(o.year,wall,'#5a4a3a',.7,.2,x,h+.25,-22.88);
    CBD.cut.push({g,x1:x-w/2,x2:x+w/2,z1:z-d/2,h});}
  heritage(625.6,6,4.6,'#e6d6b0','pub','PELICAN HOTEL','#2c3b38',{lace:1,par:'#d8c8a0',year:'1897',ver:'#2a3a32'});
  heritage(631.2,4.4,3.6,'#b85a3a','dumpling','DUMPLING HOUSE','#c8344a',{par:'#a84a3a'});
  heritage(635.7,4.2,4,'#efe3c4','camera','CAMERA EXCHANGE','#1d3a6e',{par:'#d8c8a0',year:'1912'});
  heritage(643.2,4.6,3.4,'#b8dcc8','bubble','BUBBLE TEA','#7a4a8a');
  heritage(648,4.6,4.4,'#a84a3a','records','VINYL & CO','#2a2a30',{par:'#8a3a2a',year:'1924'});
  heritage(652.8,4.6,3.8,'#f2c8a8','pizza','PIZZERIA','#3e7d5c',{par:'#e0b090'});
  heritage(657.6,4.6,4.2,'#d8d0c0','optical','OPTOMETRIST','#2f6fb0',{par:'#c8bca8'});
  heritage(662.25,4.1,3.6,'#e8b04a','bakery','CORNER BAKERY','#7a5033',{par:'#d8a040',year:'1931'});
  {const x=695,z=-24.75,w=9.6,d=3.5,g=new THREE.Group();g.position.set(x,0,z);G.add(g);const cc=M('#c8c4bc'),dk=M('#8a8680');
    [1.25,2.5,3.75].forEach(y=>{put(bx(w,.14,d),cc,0,y,0,null,g);put(bx(w,.36,.08),dk,0,y+.25,d/2-.04,null,g);});put(bx(w,.3,.1),dk,0,4.6,d/2-.05,null,g);put(bx(w,4.6,.1),cc,0,2.3,-d/2+.05,null,g);
    for(let i=0;i<=4;i++)put(bx(.18,4.6,.18),cc,-w/2+.09+i*(w-.18)/4,2.3,d/2-.09,null,g);[-1,1].forEach(s=>put(bx(.1,4.6,d),cc,s*(w/2-.05),2.3,0,null,g));
    [0,1.39,2.64,3.89].forEach((y,l)=>{for(let i=0;i<4;i++){if(r()<.3)continue;const c=randomCar();c.g.position.set(-3.6+i*2.4,y,0);c.g.rotation.y=Math.PI/2*(i%2?1:-1);c.g.scale.setScalar(.95);g.add(c.g);}});
    signPlane('CAR PARK','#1d4e9a','#ffffff',1.6,.3,-2.6,4.85,d/2+.01,0,g);signPlane('P','#1d4e9a','#ffffff',.6,.6,3.6,4.95,d/2+.02,0,g);
    put(bx(1.6,.06,.06),M('#e8c840'),2.6,.75,d/2+.2,null,g);put(bx(.18,.8,.18),M('#2a2c30'),1.7,.4,d/2+.2,null,g);
    col(x-w/2,z-d/2,x+w/2,z+d/2);CBD.cut.push({g,x1:x-w/2,x2:x+w/2,z1:z-d/2,h:4.6});}

  // ===== Tudor Lane, modelled on an old English-style arcade: a four-storey timbered front with a clock oriel over a pointed arch,
  // brick shopfronts under striped awnings, a lane of little shops with hanging signs and lanterns, and a castle gate at the far end =====
  CDET.hid=CDET.hid||[];
  {const lx=655.6,lz=-8.5,H=5.4;
    // hide the plain lane from the first build (walls, posts, the old clock and arch); the colliders stay the same
    [-1.9,1.9].forEach(dx=>{const g=host(lx+dx,lz);if(g)g.children.forEach(c=>{c.visible=false;CDET.hid.push(c);});});
    scene.children.forEach(o=>{if(o.isMesh&&Math.abs(o.position.x-lx)<1.3&&o.position.z>-11&&o.position.z<-5.6&&o.position.y>1){o.visible=false;CDET.hid.push(o);}});
    const fg=new THREE.Group();fg.position.set(lx,0,lz);G.add(fg);CBD.cut.push({g:fg,x1:lx-2.7,x2:lx+2.7,z1:lz-2.5,h:H+1.6});
    const fr=new THREE.Group();fr.position.set(lx,0,lz);G.add(fr);CBD.cut.push({g:fr,x1:lx-1.1,x2:lx+1.1,z1:lz+2.5,h:H+1.4});
    const P=(geo,mat,x,y,z,o)=>put(geo,mat,x,y,z,o,fg);
    const CREAM='#efe0b8',TIM='#3a2a22',BRICK='#a0583a';
    const tex=(W,H2,draw,o)=>{const c=mk(W,H2),x=c.getContext('2d');draw(x,W,H2);const t=ctex(c);return new THREE.MeshLambertMaterial(Object.assign({map:t},o||{}));};
    const lead=(x,a,b,w,h)=>{x.fillStyle=TIM;x.fillRect(a-1,b-1,w+2,h+2);x.fillStyle='#4a5a66';x.fillRect(a,b,w,h);x.fillStyle='rgba(220,230,235,.55)';for(let i=0;i<w;i++)for(let j=0;j<h;j++)if((i+j)%3===0||(i-j+30)%3===0)x.fillRect(a+i,b+j,1,1);x.fillStyle=TIM;if(w>4)x.fillRect(a+(w>>1),b,1,h);};
    const brick=(x,a,b,w,h)=>{x.fillStyle=BRICK;x.fillRect(a,b,w,h);for(let j=0;j<h;j+=2)for(let i=(j%4?1:0);i<w;i+=3){x.fillStyle=(i*7+j*3)%5?'#8a4a30':'#b86a44';x.fillRect(a+i,b+j,2,1);}};
    const quat=(x,a,b)=>{x.fillStyle=CREAM;x.fillRect(a+1,b,2,4);x.fillRect(a,b+1,4,2);};
    // the two blocks either side of the lane: plain stucco outside, shops on the lane side
    const laneWall=tex(50,54,(x,W,Hh)=>{x.fillStyle=CREAM;x.fillRect(0,0,W,Hh);
      for(let k=0;k<3;k++){const a=k*17;brick(x,a,38,17,16);x.fillStyle='#2c3a46';x.fillRect(a+2,40,10,12);x.fillStyle='rgba(255,255,255,.18)';x.fillRect(a+3,41,2,10);x.fillStyle=['#2f5a3a','#5a2a2a','#1d3a6e'][k];x.fillRect(a+12,40,4,14);
        lead(x,a+3,24,11,8);x.fillStyle=TIM;x.fillRect(a,21,17,2);for(let q=0;q<3;q++)quat(x,a+2+q*5,16);x.fillRect(a,15,17,1);x.fillRect(a,20,17,1);lead(x,a+3,4,11,8);x.fillStyle=TIM;x.fillRect(a,0,1,38);
        x.beginPath();x.strokeStyle=TIM;x.moveTo(a+1,14);x.lineTo(a+4,1);x.moveTo(a+16,14);x.lineTo(a+13,1);x.stroke();}});
    const plain=M(CREAM);
    [[-1.9,0],[1.9,1]].forEach(([dx,i])=>{const mats=[plain,plain,M('#b0603a'),plain,plain,plain];mats[i?1:0]=laneWall;const b=new THREE.Mesh(new THREE.BoxGeometry(1.6,H,5),mats);b.position.set(dx,H/2,0);b.castShadow=b.receiveShadow=true;fg.add(b);});
    // the room over the lane entrance
    put(bx(2.2,H-2.25,.8),plain,0,2.25+(H-2.25)/2,2.1,null,fr);
    // the front: brick shopfronts, a pointed arch, leaded windows, a band of quatrefoils, half-timbering at the top
    const front=tex(54,54,(x,W,Hh)=>{x.fillStyle=CREAM;x.fillRect(0,0,W,Hh);
      [0,36].forEach(a=>{brick(x,a,36,18,18);x.fillStyle='#2c3a46';x.fillRect(a+2,40,10,13);x.fillStyle='rgba(255,255,255,.2)';x.fillRect(a+3,41,2,11);x.fillStyle='#3a2a22';x.fillRect(a+13,39,4,15);x.fillStyle='#e8c040';x.fillRect(a+16,47,1,1);
        lead(x,a+3,25,12,8);x.fillStyle=TIM;x.fillRect(a,19,18,4);for(let q=0;q<3;q++)quat(x,a+2+q*5,19);lead(x,a+3,9,12,7);x.fillStyle=TIM;x.fillRect(a,0,18,1);x.fillRect(a,7,18,1);
        x.beginPath();x.strokeStyle=TIM;x.lineWidth=1;x.moveTo(a+1,7);x.lineTo(a+5,1);x.moveTo(a+17,7);x.lineTo(a+13,1);x.stroke();});
      x.fillStyle=TIM;x.fillRect(17,0,1,36);x.fillRect(36,0,1,36);
      // the pointed arch with a carved surround
      x.fillStyle='#e8d6a4';x.beginPath();x.moveTo(17,54);x.lineTo(17,40);x.quadraticCurveTo(18,32,27,28);x.quadraticCurveTo(36,32,37,40);x.lineTo(37,54);x.fill();
      x.fillStyle='#d8c08a';for(let i=0;i<8;i++)x.fillRect(19+i*2,31+(i%2),1,1);
      x.globalCompositeOperation='destination-out';x.beginPath();x.moveTo(19,54);x.lineTo(19,41);x.quadraticCurveTo(20,34,27,31);x.quadraticCurveTo(34,34,35,41);x.lineTo(35,54);x.fill();x.globalCompositeOperation='source-over';
      lead(x,22,4,10,6);});
    front.transparent=true;front.alphaTest=.5;front.side=THREE.DoubleSide;
    // the part over the lane entrance lives in its own group, so it lowers out of the way while Kip walks down the lane
    [[-2.7,-1.1,fg],[-1.1,1.1,fr],[1.1,2.7,fg]].forEach(([a,b,to])=>{const gg=new THREE.PlaneGeometry(b-a,H);const uv=gg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)?(b+2.7)/5.4:(a+2.7)/5.4);
      const f=new THREE.Mesh(gg,front);f.position.set((a+b)/2,H/2,2.52);f.receiveShadow=true;to.add(f);});
    // the clock oriel, on a carved corbel, with a little arched window above the clock
    {const P=(geo,mat,x,y,z,o)=>put(geo,mat,x,y,z,o,fr);const OR=M('#f2e2b4');P(bx(1.15,1.5,.5),OR,0,3.15,2.8);P(new THREE.ConeGeometry(.62,.55,4),OR,0,2.13,2.8,{rx:Math.PI,ry:Math.PI/4});P(bx(1.3,.12,.62),M('#e0cc98'),0,3.95,2.8);P(bx(1.3,.12,.62),M('#e0cc98'),0,2.42,2.8);
      const face=new THREE.Mesh(new THREE.CircleGeometry(.36,20),M('#f8f6f0'));face.position.set(0,2.95,3.06);fr.add(face);P(tor(.37,.035),M('#c8a040'),0,2.95,3.06,{nc:1});
      for(let i=0;i<12;i++){const a=i/12*6.283;P(bx(.03,.06,.01),M(TIM),Math.sin(a)*.3,2.95+Math.cos(a)*.3,3.07,{rz:-a,nc:1});}
      CDET.clock=[P(bx(.03,.2,.012),M(TIM),0,3.03,3.075,{nc:1}),P(bx(.025,.28,.012),M(TIM),0,3.07,3.08,{nc:1})];CDET.clock.forEach(h=>h.geometry=h.geometry.clone().translate(0,.1,0));CDET.clock[0].position.y=2.95;CDET.clock[1].position.y=2.95;
      P(bx(.55,.34,.02),M('#1a2230'),0,3.55,3.06,{nc:1});P(bx(.3,.16,.02),M('#e8c040'),0,3.48,3.075,{nc:1});}
    // gables with dark bargeboards and terracotta roofs
    const roofM=M('#b0603a');
    function gable(dx,w,depth,zc,hh,to){const P=(geo,mat,x,y,z,o)=>put(geo,mat,x,y,z,o,to||fg);const sh=new THREE.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(0,hh);sh.lineTo(-w/2,0);const rg=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false});rg.translate(0,0,-depth/2);P(rg,roofM,dx,H,zc);
      const t=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const s=new THREE.Shape();s.moveTo(-w/2+.08,0);s.lineTo(w/2-.08,0);s.lineTo(0,hh-.1);s.lineTo(-w/2+.08,0);return s;})()),M(CREAM));t.position.set(dx,H+.01,zc+depth/2+.01);(to||fg).add(t);
      const L=Math.hypot(w/2,hh);[-1,1].forEach(s=>P(bx(L+.1,.1,.06),M(TIM),dx+s*w/4,H+hh/2,zc+depth/2+.04,{rz:-s*Math.atan2(hh,w/2)}));
      P(bx(.06,hh*.8,.04),M(TIM),dx,H+hh*.4,zc+depth/2+.03);[-1,1].forEach(s=>P(bx(.05,hh*.6,.04),M(TIM),dx+s*w*.18,H+hh*.25,zc+depth/2+.03,{rz:s*.6}));
      P(bx(.06,.4,.06),M(TIM),dx,H+hh+.15,zc+depth/2);}
    gable(-1.9,1.75,5,0,1.5);gable(1.9,1.75,5,0,1.5);gable(0,2.3,.8,2.1,1.25,fr);
    P(cy(.08,.08,.5,6),M('#9a8a7a'),2.3,H+1.3,-1.2);P(cy(.08,.08,.5,6),M('#9a8a7a'),2.45,H+1.3,-1.2);// chimney pots
    // striped navy and white awnings: on the front, and all along both sides of the lane
    const stripe=tex(16,4,(x)=>{for(let i=0;i<16;i++){x.fillStyle=i%2?'#f2f0ea':'#22305a';x.fillRect(i,0,1,4);}},{side:THREE.DoubleSide});
    function awning(cx,cy2,cz,len,ry,dp,tl){dp=dp||.62;tl=tl||1.05;const g=new THREE.Group();g.position.set(cx,cy2,cz);g.rotation.y=ry;fg.add(g);const a=new THREE.Mesh(new THREE.PlaneGeometry(len,dp),stripe);a.rotation.x=-tl;a.position.z=dp/2*Math.sin(tl);a.castShadow=true;g.add(a);
      const v=new THREE.Mesh(new THREE.PlaneGeometry(len,.1),stripe);v.position.set(0,-dp/2*Math.cos(tl)-.05,dp*Math.sin(tl));g.add(v);}
    awning(-1.9,1.75,2.5,1.5,0);awning(1.9,1.75,2.5,1.5,0);awning(-1.1,1.55,-.2,4.4,Math.PI/2,.38,1.25);awning(1.1,1.55,-.2,4.4,-Math.PI/2,.38,1.25);
    // shields on the piers, a planter at the arch
    [[-1.02,'#c8202a','#f6f2e8'],[1.02,'#e8c040','#2a2a30']].forEach(([dx,a,b])=>{const s=new THREE.Mesh(new THREE.PlaneGeometry(.24,.3),tex(6,8,(x)=>{x.fillStyle=b;x.fillRect(0,0,6,8);x.fillStyle=a;x.fillRect(0,3,6,2);x.fillRect(2,0,2,8);x.clearRect(0,7,1,1);x.clearRect(5,7,1,1);},{transparent:true,alphaTest:.3}));s.position.set(dx,2.25,2.54);fg.add(s);});
    // inside the lane: pale paving, hanging black signs with gold letters, lanterns on brackets
    paint(2.2,5,'#cfcac0',lx,lz,.034);paint(.18,5,'#8a8680',lx,lz,.036);
    [[-1,-1.2,'MINI ESPRESSO'],[1,-.2,'FINE JEWELS'],[-1,.9,'GIFTS'],[1,1.6,'CLOCKS']].forEach(([s,dz,t])=>{P(bx(.6,.03,.03),M('#1a1a1a'),s*.82,2.45,dz,{nc:1});
      const m=new THREE.Mesh(new THREE.PlaneGeometry(.66,.26),new THREE.MeshBasicMaterial({map:makeSign([t],Math.max(48,t.length*6+8),12,'#16181c','#e8c060'),side:THREE.DoubleSide}));m.position.set(s*.72,2.24,dz);fg.add(m);});
    [-2,-.5,1].forEach((dz,i)=>{const s=i%2?1:-1;P(bx(.3,.03,.03),M('#1a1a1a'),s*.92,2.95,dz,{nc:1});P(bx(.14,.2,.14),glowMat('#c8a060','#ffd890'),s*.8,2.78,dz,{nc:1});P(bx(.17,.04,.17),M('#1a1a1a'),s*.8,2.9,dz);halo(lx+s*.8,2.78,lz+dz,1.4);});
    // the castle gate at the far end: crenellations, two round turrets, a statue in a blue niche, and the arch through to the mall
    {const gz=-2.25,GT=M('#efdcae');
      const gate=tex(22,62,(x,W,Hh)=>{x.fillStyle='#efdcae';x.fillRect(0,0,W,Hh);x.fillStyle='#e0cb98';x.fillRect(0,40,W,2);x.fillRect(0,20,W,1);
        lead(x,6,8,10,6);x.fillStyle='#bfe0f0';x.fillRect(8,22,6,13);x.fillStyle='#f6f6f0';x.fillRect(10,24,2,2);x.fillRect(9,26,4,6);x.fillRect(9,32,1,3);x.fillRect(12,32,1,3);
        lead(x,2,24,3,8);lead(x,17,24,3,8);
        [[4,'#c8202a'],[11,'#c8202a'],[17,'#e8c040']].forEach(([a,c])=>{x.fillStyle='#f6f2e8';x.fillRect(a-1,43,3,4);x.fillStyle=c;x.fillRect(a,43,1,4);x.fillRect(a-1,44,3,1);});
        x.globalCompositeOperation='destination-out';x.beginPath();x.moveTo(5,62);x.lineTo(5,53);x.quadraticCurveTo(6,48,11,46);x.quadraticCurveTo(16,48,17,53);x.lineTo(17,62);x.fill();x.globalCompositeOperation='source-over';},{transparent:true,alphaTest:.5,side:THREE.DoubleSide});
      const gp=new THREE.Mesh(new THREE.PlaneGeometry(2.2,6.2),gate);gp.position.set(0,3.1,gz);fg.add(gp);
      for(let i=0;i<5;i++)P(bx(.26,.3,.3),GT,-.88+i*.44,6.35,gz);
      [-1,1].forEach(s=>{P(cy(.42,.46,6.6,12),GT,s*1.2,3.3,gz+.05);P(cy(.5,.5,.2,12),M('#e0cb98'),s*1.2,6.65,gz+.05);for(let k=0;k<6;k++){const a=k/6*6.283;P(bx(.16,.26,.16),GT,s*1.2+Math.cos(a)*.42,6.88,gz+.05+Math.sin(a)*.42);}
        P(bx(.08,.5,.02),M('#2c3a46'),s*1.2,4.6,gz+.5,{nc:1});});
      P(cy(.015,.015,.9,4),M('#c8ccd0'),.3,7.2,gz);{const fl=new THREE.Mesh(new THREE.PlaneGeometry(.42,.26),tex(8,5,(x)=>{x.fillStyle='#1d3a8e';x.fillRect(0,0,8,5);x.fillStyle='#f6f6f0';x.fillRect(5,1,1,1);x.fillRect(6,3,1,1);x.fillRect(1,3,1,1);x.fillStyle='#c8202a';x.fillRect(1,1,2,1);},{side:THREE.DoubleSide}));fl.position.set(.52,7.5,gz);fg.add(fl);CDET.flag=fl;}}
  }

  // ===== Elizabeth Quay, the bridge and the bell tower, closer to the real ones =====
  {// the arch sculpture: seven white ellipses, big by the city and getting smaller toward the water, on a swirling stone plaza
    scene.children.forEach(o=>{if(o.isGroup&&Math.abs(o.position.x-650)<.01&&Math.abs(o.position.z-1.2)<.01){o.visible=false;CDET.hid.push(o);}});
    {const i=colliders.findIndex(c=>c.x1===649&&c.z1===.4&&c.x2===651);if(i>=0)colliders.splice(i,1);}
    const sw=(()=>{const c=mk(96,32),x=c.getContext('2d');x.fillStyle='#d8ccb0';x.fillRect(0,0,96,32);x.strokeStyle='#4a4a4e';x.lineWidth=2.2;
      for(let k=0;k<5;k++){x.beginPath();for(let i=0;i<=96;i++){const y=4+k*6.5+Math.sin(i/9+k*1.3)*3+Math.sin(i/23+k)*2;i?x.lineTo(i,y):x.moveTo(i,y);}x.stroke();}
      [[20,14,5],[58,20,6],[80,9,4]].forEach(([a,b,r])=>{x.beginPath();x.ellipse(a,b,r*1.6,r,0,0,7);x.stroke();});return new THREE.MeshLambertMaterial({map:ctex(c)});})();
    paint(17.6,5.6,sw,650,1.0,.026);
    const wm=M('#f6f6f2');for(let i=0;i<7;i++){const h=6.6-i*.82,b=h/1.75,a=b*.52,c=b*.75,z=-1.5+i*.72;const pts=[];
      for(let k=0;k<=28;k++){const t=-.848+k/28*(Math.PI+1.696);pts.push(new THREE.Vector3(650+Math.cos(t)*a,c+Math.sin(t)*b,z));}
      const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,Math.max(.035,.085-i*.008),6,false),wm);m.castShadow=true;G.add(m);}
    // white shade umbrellas along the quay
    [641.5,646,654,658.5].forEach(x=>{put(cy(.03,.03,1.7,5),M('#d8dcd8'),x,.85,3.3);put(new THREE.ConeGeometry(.75,.35,4),M('#f6f6f2'),x,1.8,3.3,{ry:Math.PI/4});});}
  {// the footbridge: two arches that meet in a V in the water, with hangers down to the deck
    scene.children.forEach(o=>{if(o.isGroup&&Math.abs(o.position.x-650)<.01&&Math.abs(o.position.z-10.3)<.01)o.children.forEach(c=>{if(c.geometry&&c.geometry.type==='TorusGeometry'){c.visible=false;CDET.hid.push(c);}});});
    const am=M('#d8dce0');[-1,1].forEach(s=>{const P=[[0,-.7],[1.1,1.9],[2.6,3.8],[4.6,4.6],[6.6,4.1],[8.6,2.4],[10.2,.4]].map(([d,y])=>new THREE.Vector3(650+s*d,y,10.3));
      const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P),40,.13,6,false),am);m.castShadow=true;G.add(m);
      const cp=new THREE.CatmullRomCurve3(P).getPoints(120);for(let d=1.8;d<9.6;d+=1.1){const t=(d+11)/22,dy=.15+Math.sin(t*Math.PI)*1.2+.1;let best=cp[0];for(const q of cp)if(Math.abs(q.x-(650+s*d))<Math.abs(best.x-(650+s*d)))best=q;const ay=best.y;
        if(ay-dy>.2)put(bx(.02,ay-dy,.02),M('#c8ccd0'),650+s*d,dy+(ay-dy)/2,10.3,{nc:1});}});
    put(bx(.5,.9,.5),M('#c8ccd0'),650,-.3,10.3,{rz:Math.PI/4});}
  {// the bell tower: a glass spire in floors with white ledges, two dark copper sails, in a fountain
    scene.children.forEach(o=>{if(o.isGroup&&Math.abs(o.position.x-678)<.01&&Math.abs(o.position.z-8.2)<.01){o.visible=false;CDET.hid.push(o);}});
    const bt=new THREE.Group();bt.position.set(678,0,8.2);G.add(bt);CBD.cut.push({g:bt,x1:675.9,x2:680.1,z1:6.1,h:15});
    put(cy(2.15,2.2,.22,28),M('#4a5258'),0,.11,0,null,bt);{const w=new THREE.Mesh(new THREE.CircleGeometry(1.95,28),M('#7ac8d8'));w.rotation.x=-Math.PI/2;w.position.y=.23;bt.add(w);}
    for(let k=0;k<10;k++){const a=k/10*6.283;put(cy(.03,.05,.35,5),M('#d8f0f8'),Math.cos(a)*1.55,.4,Math.sin(a)*1.55,{nc:1},bt);}
    const gl=M('#4fa898'),led=M('#e8ecea');for(let i=0;i<7;i++){const r0=1-i*.07;put(cy(r0-.05,r0,.68,14),gl,0,.6+i*.72,0,null,bt);put(cy(r0+.28,r0+.3,.06,18),led,0,.96+i*.72,0,null,bt);}
    put(new THREE.ConeGeometry(.55,7.2,12),M('#5fbfae'),0,5.6+3.6,0,null,bt);put(cy(.025,.06,1.8,5),M('#c8ccd0'),0,14.1,0,null,bt);
    const cu=new THREE.MeshLambertMaterial({color:new THREE.Color('#3e3530'),side:THREE.DoubleSide});
    [0,Math.PI].forEach(r0=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.75,1.75,7.6,16,1,true,r0+.25,1.35),cu);m.position.y=3.8;m.rotation.z=r0?.05:-.05;m.castShadow=true;bt.add(m);});
    put(bx(.12,.5,.12),M('#e8c020'),2.4,.8,-2.2,null,bt);}
  // Perth's traffic-light poles are yellow and the street lights are tall and grey
  // ===== palms on Riverside Drive =====
  function palm(x,z,h){const tr=M('#8a7a62');put(cy(.15,.22,h,7),tr,x,h/2,z);for(let y=.4;y<h;y+=.45)put(cy(.2,.2,.05,7),M('#6e604c'),x,y,z,{nc:1});put(sp(.32,8),M('#6a5a40'),x,h,z,{s:[1,1.2,1]});
    const fm=M('#4f7f3a'),fm2=M('#5f9444');for(let i=0;i<12;i++){const g=new THREE.Group();g.position.set(x,h+.15,z);g.rotation.y=i/12*6.283+(i%2)*.2;G.add(g);const f=new THREE.Mesh(bx(1.5,.04,.34),i%2?fm:fm2);f.position.x=.7;f.rotation.z=-.35-(i%3)*.22;f.castShadow=true;g.add(f);}
    col(x-.22,z-.22,x+.22,z+.22);}
  [624.5,634.5,666.8,673.5,687.5,695.5].forEach(x=>palm(x,9.05,3.4+((x*7)%5)*.15));

  // ===== Kings Park: a hedge along the city edge, paths, gums, a boab, flower beds, a lily pond, picnics and a kiosk =====
  [[-25.5,-22.9],[-20.5,-11.9],[-10.1,-4.5],[-1.6,3.6],[7.2,11.4]].forEach(([a,b])=>hedge(621.4,a,621.4,b));
  {const gm=lmat(pathC,[1,10]);paint(1.1,35,gm,618,-6.5,.022);paint(17,1.1,lmat(pathC,[8,1]),612.5,-11,.023);paint(5.2,1,lmat(pathC,[3,1]),615.2,8.6,.023);}
  function gum(x,z,h){put(cy(.11,.2,h,7),M('#e8e2d4'),x,h/2,z);put(bx(.06,1.1,.06),M('#e0d8c8'),x+.3,h*.72,z,{rz:-.6});put(bx(.06,.9,.06),M('#e0d8c8'),x-.25,h*.78,z+.1,{rz:.7});
    [[0,h+.1,0,1],[.6,h-.3,.2,.8],[-.55,h-.2,-.1,.75],[.1,h+.5,.3,.7]].forEach(([a,b,c,s])=>put(ic(.85),M(pick2(['#6f8f4a','#7a9a58','#5f8040'])),x+a,b,z+c,{s:[s,s*.8,s],ry:r()*6}));col(x-.25,z-.25,x+.25,z+.25);}
  gum(613.2,-19.2,4.2);gum(601.6,-17.4,3.8);gum(608.6,-1.2,4);gum(620.3,-9.4,3.6);
  {const x=615.6,z=-3.4;put(sp(.75,10),M('#cdb8a2'),x,.95,z,{s:[1,1.35,1]});put(cy(.32,.5,.8,9),M('#cdb8a2'),x,2.1,z);[[.6,.5],[-.6,-.4],[.1,1.2]].forEach(([a,rz])=>put(bx(.12,1,.12),M('#b8a490'),x+a*.6,2.75,z+(a>0?.1:-.1),{rz}));
    [[.75,3.1,0],[-.7,3,.2],[.05,3.4,-.3]].forEach(([a,b,c])=>put(ic(.45),M('#7a9a4a'),x+a,b,z+c,{s:[1,.6,1]}));col(x-.7,z-.7,x+.7,z+.7);}
  function bed(x,z,a,b,kind){const m=new THREE.Mesh(new THREE.CircleGeometry(1,18),M('#6a4a32'));m.rotation.x=-Math.PI/2;m.scale.set(a,b,1);m.position.set(x,.025,z);m.receiveShadow=true;G.add(m);
    const n=Math.round(a*b*14);for(let i=0;i<n;i++){const t=r()*6.283,q=Math.sqrt(r())*.88,px=x+Math.cos(t)*a*q,pz=z+Math.sin(t)*b*q;
      if(kind==='paw'){put(cy(.015,.015,.5,4),M('#5a8a3a'),px,.25,pz,{nc:1});put(bx(.05,.13,.05),M(r()<.75?'#d8323a':'#e8c040'),px,.56,pz);put(bx(.04,.25,.12),M('#4f8f3e'),px,.12,pz,{ry:r()*3,nc:1});}
      else put(sp(.06,5),M(pick2(['#f6f2e8','#ef9ab8','#f6d840','#f6f2e8'])),px,.12+r()*.08,pz,{nc:1});}}
  bed(608,-12.9,1.6,.6,'paw');bed(614.5,1.8,1.2,.55,'paw');bed(605.5,-24.4,1.6,.6,'daisy');
  {const x=609.5,z=3.6;const w=new THREE.Mesh(new THREE.CircleGeometry(1.3,24),M('#4fa8c8'));w.rotation.x=-Math.PI/2;w.position.set(x,.045,z);G.add(w);put(tor(1.32,.1),M('#b8b0a0'),x,.06,z,{rx:Math.PI/2,nc:1});
    for(let i=0;i<7;i++){const t=r()*6.283,q=.3+r()*.8;const p=new THREE.Mesh(new THREE.CircleGeometry(.14,8),M('#4f8f3e'));p.rotation.x=-Math.PI/2;p.position.set(x+Math.cos(t)*q,.05,z+Math.sin(t)*q);G.add(p);if(i%2)put(sp(.05,5),M('#ef9ab8'),p.position.x,.08,p.position.z,{nc:1});}
    col(x-1.2,z-1.2,x+1.2,z+1.2);}
  function picnic(x,z,c){const cv=mk(8,8),q=cv.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){q.fillStyle=(i+j)%2?'#f6f2e8':c;q.fillRect(i,j,1,1);}paint(1.3,1,new THREE.MeshLambertMaterial({map:ctex(cv)}),x,z,.03);
    put(bx(.34,.2,.22),M('#b8864a'),x+.35,.1,z-.2);put(tor(.12,.015,Math.PI),M('#8a6030'),x+.35,.2,z-.2,{nc:1});put(cy(.05,.05,.16,6),M('#3e7d5c'),x-.3,.08,z+.2,{nc:1});}
  picnic(612.3,-1.8,'#c8344a');picnic(606.8,-9.0,'#2f6fb0');
  [-18,-3,4.5].forEach(z=>bench(619.1,z,-Math.PI/2));[-21,-14.5,1.5,7].forEach(z=>oldLamp(619.3,z));
  {const x=616.9,z=-12.2;put(cy(.1,.13,.78,8),M('#9aa0a6'),x,.39,z);put(cy(.19,.12,.08,10),M('#c8ccd0'),x,.8,z);col(x-.15,z-.15,x+.15,z+.15);}binPair(619.3,-12.1);binPair(620.4,10.4);
  bushes(604,-19.5,2,1,5,['#f6f2e8']);bushes(615.5,-23.5,2.5,1,6,['#d8323a']);bushes(601.5,4.5,1.5,1.5,4);bushes(619.8,-15,1,2,4,['#ef9ab8']);
  kiosk(617.6,9.3,'PARK BREW','#3f7a5a','Iced latte',5);bistro(614.6,9.5,'#e8b04a');bistro(620.3,9.9,'#e8b04a');

  CDET.routes=ROUTES;CDET.spawn=spawn;
  // crowds keep to the footpaths now that cars use the side streets
  try{const W=WALK_ROUTES.cbd;W[3][0][0]=W[3][1][0]=669.1;W[4][0][0]=W[4][1][0]=637.2;W[3][1][1]=W[4][1][1]=3.4;W[1][0][1]=W[1][1][1]=7.95;}catch(e){}
  try{const R=ZONE_DEF.cbd.rects;R[3]=[622,3.9,700,6.15,'#4a4d55'];R.push([622,3.9,700,4.6,'#3f9a5a']);}catch(e){}
