// ---------- Fremantle map closer to the real town (same Look Lab layer: ?lab or ?freo) ----------
// The sea is only on the west (Bathers Beach, the harbour) and the river mouth on the north (Victoria Quay).
// The town carries on to the east and south: Monument Hill with its memorial and palms east of the prison,
// the station on the north side near Kings Square, and the Fishing Boat Harbour as a closed basin with a breakwater.
// Life on the water: a ferry and boats moving, dolphins in the bay, gulls overhead.
const FREO_LAND={x2:351.5,hill:{x:343,z:7}};
if(FDET.on)(()=>{const G=FDET.g;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(...o.s);}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const r=mulberry32(6160);
  // ===== land to the east and south (suburbs beyond the walkable town) =====
  const ground=(w,d,x,z,mat)=>{const m=new THREE.Mesh(B(w,.5,d),mat);m.position.set(x,-.26,z);m.receiveShadow=true;G.add(m);return m;};
  ground(26,40,346,2,lmat(paveC,[13,20]));ground(64,14,321,28.6,lmat(paveC,[32,7]));ground(26,14,346,28.6,lmat(paveC,[13,7]));
  // houses in the suburbs (low, tin roofs, solar panels), seen past the edge of the town
  const roofs=['#a8acb0','#8a8e94','#b8562e','#c8ccd0'];
  for(let i=0;i<26;i++){const hx=336+(i%5)*3.3+(r()-.5),hz=18.5+Math.floor(i/5)*3.2+(r()-.5);if(hz<20&&hx<346)continue;const w=2+r(),d=2+r();
    put(B(w,1.4,d),M(r()<.5?'#efe3c4':'#e2d2b8'),hx,.7,hz);put(new THREE.ConeGeometry(Math.max(w,d)*.72,.9,4),M(roofs[i%4]),hx,1.85,hz,{ry:Math.PI/4,s:[w/Math.max(w,d),1,d/Math.max(w,d)]});if(i%3===0)put(B(.8,.04,.6),M('#2a3a58'),hx-.2,2,hz+.1,{rx:-.4,nc:1});}
  for(let i=0;i<18;i++){const hx=296+i*3.2+(r()-.5),hz=27+(i%2)*3;put(B(2.4,1.3,2.2),M(r()<.5?'#efe3c4':'#d8c8b0'),hx,.65,hz);put(new THREE.ConeGeometry(1.75,.8,4),M(roofs[i%4]),hx,1.7,hz,{ry:Math.PI/4});}
  // ===== Monument Hill: a grassy rise with a sandstone memorial tower, a curved colonnade, bollards and palms =====
  {const H=FREO_LAND.hill;const hill=new THREE.Mesh(new THREE.CylinderGeometry(6.5,8.5,1.2,24),lmat(grassC,[4,4]));hill.position.set(H.x,.35,H.z);hill.receiveShadow=true;G.add(hill);
    const sand=M('#d8b880'),sand2=M('#e6c898'),stone=M('#8a8478');
    const g=new THREE.Group();g.position.set(H.x,.95,H.z-1);G.add(g);
    put(new THREE.CylinderGeometry(3.2,3.2,.5,24,1,false,Math.PI*.15,Math.PI*1.7),stone,0,.25,0,{ry:Math.PI},g);
    for(let i=0;i<=10;i++){const a=Math.PI*.2+i/10*Math.PI*.6;const x=Math.cos(a)*3,z=-Math.sin(a)*-3;put(B(.18,.6,.18),sand,x,.8,z*-1+0,null,g);}
    {const arc=new THREE.Mesh(new THREE.TorusGeometry(3,.1,4,20,Math.PI*.6),sand2);arc.rotation.x=-Math.PI/2;arc.rotation.z=Math.PI*.2;arc.position.y=1.1;g.add(arc);}
    put(B(1.2,.4,1.2),sand,0,.7,0,null,g);put(B(.9,3.6,.9),sand,0,2.7,0,null,g);put(B(1.05,.25,1.05),sand2,0,4.6,0,null,g);put(B(.7,.5,.7),sand,0,4.95,0,null,g);
    put(new THREE.TorusGeometry(.2,.04,5,12),M('#3a3a2a'),0,3.6,.46,{nc:1},g);put(B(.5,.35,.02),M('#5a4a30'),0,1.4,.46,{nc:1},g);
    put(B(.04,1.6,.04),M('#e8e8ec'),-.7,3.4,.5,{nc:1},g);
    [-1.6,1.6].forEach(x=>{put(B(.3,1.1,.3),sand,x,1.0,1.4,null,g);put(B(.24,.24,.24),M('#2a2a2a'),x,1.7,1.4,null,g);});
    for(let i=0;i<9;i++)put(B(.18,.55,.18),sand,H.x-4+i,.28,H.z+5.2);
    paint(9,1.4,lmat(asphC,[4,1]),H.x,H.z+5.9,.03);
    col(H.x-1.2,H.z-2.2,H.x+1.2,H.z+.2);}
  function paint(w,d,mat,x,z,y){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;}
  {const pc=(()=>{const W=24,H=48,c=mk(W,H),x=c.getContext('2d');for(let y=15;y<H;y++){for(let i=0;i<4;i++){x.fillStyle=(y%3===0)?'#5a4a38':i===0?'#5e503c':i===3?'#6e604c':'#8a7a62';x.fillRect(10+i,y,1,1);}}x.fillStyle='#6a5a40';x.fillRect(10,13,4,3);const FR=TREE_COLS[1];const rr=mulberry32(77);
      for(let k=0;k<14;k++){const a=-Math.PI+k/13*Math.PI,len=9+rr()*3;for(let t=0;t<=1;t+=.05){const px=12+Math.cos(a)*len*t,py=14+Math.sin(a)*len*t*.55+t*t*7*Math.abs(Math.cos(a));x.fillStyle=FR[t<.2?0:t>.7?3:1+(k%2)];x.fillRect(Math.round(px),Math.round(py),1,1);x.fillStyle=FR[0];x.fillRect(Math.round(px),Math.round(py)+1,1,1);}}return c;})();
    const t=ctex(pc);const pm=new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),pd=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});
    [[337.5,2],[339,9.5],[348.5,3.5],[347.5,11],[343,13.5],[336.5,14]].forEach(([x,z],i)=>{const s=1+(i%3)*.15;const pg=new THREE.PlaneGeometry(2.8*s,5.6*s);pg.translate(0,2.8*s,0);const m=new THREE.Mesh(pg,pm);m.customDepthMaterial=pd;m.castShadow=true;m.position.set(x,.3,z);G.add(m);BB.push(m);col(x-.2,z-.2,x+.2,z+.2);});}
  // ===== Fremantle station: a long red-brick building with cream arches, on the north side by Kings Square =====
  {const x0=297.5,z0=-11.6,W=9,D=2.6;const brick=new THREE.MeshLambertMaterial({map:(()=>{const c=mk(16,16),x=c.getContext('2d');x.fillStyle='#8a3a2e';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=2)for(let i=(j%4?2:0);i<16;i+=4){x.fillStyle=['#9a4434','#7a3226','#a04a3a'][(i+j)%3];x.fillRect(i,j,3,1);}return ctex(c,{rep:[4,2]});})()});
    put(B(W,3,D),brick,x0,1.5,z0);put(B(W+.2,.4,D+.2),M('#efe3c4'),x0,3.2,z0);for(let i=0;i<10;i++)put(B(.22,.35,.22),M('#efe3c4'),x0-W/2+.4+i*.92,3.55,z0+D/2);
    for(let i=0;i<5;i++){const ax=x0-3.6+i*1.8;put(B(1,1.5,.05),M('#2a3a48'),ax,1.25,z0+D/2+.01,{nc:1});const a=new THREE.Mesh(new THREE.TorusGeometry(.5,.08,4,10,Math.PI),M('#efe3c4'));a.position.set(ax,2,z0+D/2+.04);G.add(a);}
    {const s=new THREE.Mesh(new THREE.PlaneGeometry(3.2,.4),new THREE.MeshBasicMaterial({map:makeSign(['FREMANTLE STATION'],88,12,'#efe3c4','#5a2a20')}));s.position.set(x0,2.75,z0+D/2+.03);G.add(s);}
    col(x0-W/2,z0-D/2,x0+W/2,z0+D/2);}
  // ===== Fishing Boat Harbour: a basin closed by a breakwater on the south and west, jetties for the boats =====
  {const rk=[M('#8a8478'),M('#a8a094'),M('#9a9286')];const rock=(x,z)=>put(new THREE.DodecahedronGeometry(.55+r()*.3,0),rk[(r()*3)|0],x,.05,z,{ry:r()*6,s:[1.2,.6,1]});
    for(let x=271;x<=292;x+=.9)rock(x,24.2+Math.sin(x)*.15);for(let z=17;z<=21.5;z+=.9)rock(264,z);
    paint(1.2,6,lmat(deckC,[1,4]),280,19.5,.04);paint(1.2,6,lmat(deckC,[1,4]),286,19.5,.04);
    put(B(.5,2.4,.5),M('#f6f6f0'),264,1.2,21.9);put(B(.6,.4,.6),M('#d8323a'),264,2.6,21.9);put(B(.5,2.4,.5),M('#f6f6f0'),270.5,1.2,24.2);put(B(.6,.4,.6),M('#3ec46a'),270.5,2.6,24.2);}

  // ===== life on the water =====
  const FL={boats:[],dolphins:[],gulls:[]};FDET.life=FL;
  function boat(kind){const g=new THREE.Group();if(kind==='ferry'){put(B(3.6,.7,1.3),M('#1f5fae'),0,.35,0,null,g);put(B(3.2,.6,1.2),M('#f6f6f0'),.1,.95,0,null,g);put(B(2.8,.3,1.1),M('#2a3a58'),.1,1,0,{nc:1},g);put(B(1.4,.45,1),M('#1f5fae'),.3,1.45,0,null,g);}
    else if(kind==='yacht'){put(B(2,.4,.7),M('#f6f6f0'),0,.2,0,null,g);put(new THREE.CylinderGeometry(.03,.03,3,5),M('#d8dcd8'),0,1.7,0,null,g);const s=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(1.1,0);sh.lineTo(0,2.6);sh.lineTo(0,0);return sh;})()),new THREE.MeshLambertMaterial({color:0xf6f2e8,side:THREE.DoubleSide}));s.position.set(.05,.45,0);g.add(s);}
    else{put(B(1.6,.4,.7),M(kind),0,.2,0,null,g);put(B(.6,.4,.5),M('#f6f6f0'),-.2,.6,0,null,g);}
    g.position.y=-.05;G.add(g);return g;}
  // routes in the water (x,z points; the boats go back and forth)
  const ROUTES=[{k:'ferry',p:[[252,-20.5],[300,-21],[350,-20.5]],sp:2.2},{k:'yacht',p:[[256,-6],[258,8],[257,22],[268,28],[284,30]],sp:1.1},{k:'#d8323a',p:[[284,22.6],[268,22.6],[266,26],[250,30]],sp:1.6},{k:'yacht',p:[[340,-22.5],[300,-23],[262,-19]],sp:.9},{k:'#2f6fb0',p:[[255,-10],[262,-15],[275,-17.8]],sp:1.4}];
  ROUTES.forEach((R,i)=>{const g=boat(R.k);const L=[0];for(let k=1;k<R.p.length;k++)L.push(L[k-1]+Math.hypot(R.p[k][0]-R.p[k-1][0],R.p[k][1]-R.p[k-1][1]));const wake=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.5),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false}));wake.rotation.x=-Math.PI/2;wake.position.y=.04;G.add(wake);FL.boats.push({R,g,L,s:(i*13)%L[L.length-1],dir:1,wake});});
  // dolphins: a pixel sprite that surfaces in an arc
  const dolF=[pix(["......oo......","....oobbo.....","..oobbbbbbo...","oobbbbbbwbbo..",".obbbbbbbbbboo","..oooooooooo.."],{o:'#2a3440',b:'#5a6a7a',w:'#f6f6f0'})];
  for(let i=0;i<3;i++){const m=spriteMesh(dolF,1.2,.55,{shadow:false});m.visible=false;G.add(m);const splash=new THREE.Mesh(new THREE.CircleGeometry(.5,10),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));splash.rotation.x=-Math.PI/2;splash.position.y=.05;G.add(splash);FL.dolphins.push({m,splash,t:i*2.3,cx:259+i*2.2,cz:4+i*5});}
  // gulls: two-frame flapping pixel birds circling over the beach, harbour and quay
  const gullF=[pix(["o.........o",".oo.....oo.","..owwwwwo..","....wkw....","....ooo...."],{o:'#3a3a40',w:'#f6f6f0',k:'#e8a020'}),pix(["...........","...........","oowwwwwwwoo","....wkw....","....ooo...."],{o:'#3a3a40',w:'#f6f6f0',k:'#e8a020'})];
  [[279,6,5],[288,16,6],[288,-12,5],[300,4,7],[270,-4,6],[310,14,5]].forEach(([cx,cz,rad],i)=>{const m=spriteMesh(gullF,.7,.32,{shadow:false});G.add(m);FL.gulls.push({m,cx,cz,rad,ph:i*1.3,sp:.35+(i%3)*.08,y:4.5+(i%3)*.8});});
  FDET.lifeTick=function(dt){if(!G.visible)return;dt=Math.min(dt||0,.1);const t=performance.now()/1000;
    for(const b of FL.boats){const Lt=b.L[b.L.length-1];b.s+=b.R.sp*dt*b.dir;if(b.s>Lt){b.s=Lt;b.dir=-1;}if(b.s<0){b.s=0;b.dir=1;}let k=1;while(k<b.L.length-1&&b.L[k]<b.s)k++;const a=b.R.p[k-1],c=b.R.p[k],u=(b.s-b.L[k-1])/Math.max(1e-6,b.L[k]-b.L[k-1]);
      const x=a[0]+(c[0]-a[0])*u,z=a[1]+(c[1]-a[1])*u,dx=(c[0]-a[0])*b.dir,dz=(c[1]-a[1])*b.dir;b.g.position.set(x,-.05+Math.sin(t*1.6+x)*.04,z);b.g.rotation.y=Math.atan2(-dz,dx);b.g.rotation.z=Math.sin(t*1.3+z)*.03;
      const l=Math.hypot(dx,dz)||1;b.wake.position.set(x-dx/l*1.6,.04,z-dz/l*1.6);b.wake.rotation.z=-Math.atan2(-dz,dx);b.wake.material.opacity=.25+.15*Math.sin(t*6);}
    for(const d of FL.dolphins){d.t+=dt;const T=6,p=(d.t%T)/T;if(p<.22){const q=p/.22;d.m.visible=true;const x=d.cx-1.6+q*3.2;d.m.position.set(x,Math.sin(q*Math.PI)*1.1-.35,d.cz);d.m.rotation.z=(.5-q)*1.4;d.m.scale.x=1;}else{d.m.visible=false;}
      const sp=p<.04?p/.04:p>.18&&p<.3?1-(p-.18)/.12:0;d.splash.position.set(d.cx+(p<.1?-1.6:1.6),.05,d.cz);d.splash.material.opacity=sp*.6;d.splash.scale.setScalar(.6+sp);
      if(p>.95){d.cz=-2+Math.random()*24;d.cx=256+Math.random()*8;}}
    for(const gl of FL.gulls){const a=t*gl.sp+gl.ph;gl.m.position.set(gl.cx+Math.cos(a)*gl.rad,gl.y+Math.sin(a*2)*.4,gl.cz+Math.sin(a)*gl.rad*.6);setFrame(gl.m,Math.floor(t*4+gl.ph)%2);gl.m.scale.x=Math.sin(a)>0?1:-1;}};
})();
// the town is bigger now: Monument Hill and the streets east of the prison are walkable
if(FDET.on){const _fw=freoWalk;freoWalk=function(x,z){if(_fw(x,z))return true;if(x>=333.5&&x<FREO_LAND.x2&&z>-6&&z<21.6){const H=FREO_LAND.hill;return true;}return false;};}
