/* Props Engine (Paul Perth Library, Nov 2026) — small 3D street and park furniture for three.js r128.
   const P=PropsEngine.create({scene,heightAt});
   P.add(kind,x,z,{rot,scale,text,color,lines})  -> Group      kinds: lamp, bench, bin, sign, busstop, fence (lines:[[x,z],...]),
        bollard, planter (flowers), picnic, bikerack, bikes, umbrella, jetty (lines:[start,end], width), buoy, rock, crate, tap,
        sets: playground, cafeset, fishstall, gardenplot, bikerepair
   P.along(kind,pts,spacing,opts)  places one every <spacing> units along a line, facing along it.
   P.update(t) lights the lamps at night (P.night=0..1) and bobs buoys.
   Everything is real geometry with soft toon colours (no pictures except sign lettering, drawn crisp at 4x).
   Each prop gets userData.prop={kind} and a footprint userData.foot=[x1,z1,x2,z2] for colliders. */
(function(g){
/* gammaOut (create option): the host renders straight to the screen with no sRGB output step (a game in gamma space); colours and
   textures then skip the sRGB->linear step so everything looks the same as in the lab. */
let GAMMA=false;const ENC=()=>GAMMA?THREE.LinearEncoding:THREE.sRGBEncoding;const L2=c=>GAMMA?c:c.convertSRGBToLinear();
const M={},m=c=>M[c]||(M[c]=new THREE.MeshLambertMaterial({color:L2(new THREE.Color(c))}));
const box=(G,w,h,d,c,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
/* a sun umbrella's pole is too thin for the shadow map, so the canopy's shadow looked like a shape floating on its own (Paul, 19 Nov 2026):
   an unseen, slightly thicker stick casts the pole's shadow and joins the canopy shadow to the umbrella */
const SHADOW_ONLY=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false});
const poleShadow=(G,x,z,h)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(.16,h,.16),SHADOW_ONLY);o.position.set(x,h/2,z);o.castShadow=true;o.renderOrder=-1;G.add(o);return o;};
const cyl=(G,r1,r2,h,c,x,y,z,seg)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg||10),m(c));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
const sph=(G,r,c,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),m(c));o.position.set(x,y,z);o.scale.set(sx||1,sy||1,sz||1);o.castShadow=true;G.add(o);return o;};
function signTex(lines,bg,fg){const S=4,W=128*S,Hh=Math.max(1,lines.length)*26*S+10*S,c=document.createElement('canvas');c.width=W;c.height=Hh;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,W,Hh);
  x.strokeStyle=fg;x.lineWidth=3*S;x.strokeRect(4*S,4*S,W-8*S,Hh-8*S);x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';lines.forEach((l,i)=>{x.font=`bold ${16*S}px system-ui,sans-serif`;let fs=16*S;while(x.measureText(l).width>W-20*S&&fs>8*S){fs-=S;x.font=`bold ${fs}px system-ui,sans-serif`;}x.fillText(l,W/2,5*S+13*S+i*26*S);});
  const t=new THREE.CanvasTexture(c);t.encoding=ENC();t.anisotropy=8;return{t,a:W/Hh};}
const K={
  /* park and street sets (Paul, 14 Nov 2026: players asked for them) */
  playground(G,o){box(G,3.2,.04,2.6,'#e8d9a8',0,.02,0);/* sand pit */
    const sl=new THREE.Group();sl.position.set(-.7,0,-.3);G.add(sl);[[-.35,-.35],[.35,-.35],[-.35,.35],[.35,.35]].forEach(([x,z])=>cyl(sl,.04,.04,1.3,'#3a6ea8',x,.65,z,6));box(sl,.8,.06,.8,'#f2c230',0,1.3,0);
    for(let i=0;i<5;i++)box(sl,.12,.04,.7,'#3a6ea8',-.5,.25+i*.22,0).position.x=-.42-i*.0;const sd=box(sl,1.8,.05,.6,'#e8443a',1.15,.68,0);sd.rotation.z=-.62;
    const sw=new THREE.Group();sw.position.set(.9,0,.4);G.add(sw);[-.9,.9].forEach(x=>{const a=cyl(sw,.04,.04,1.8,'#2f6a74',x,.85,-.3,6);a.rotation.x=.3;const b=cyl(sw,.04,.04,1.8,'#2f6a74',x,.85,.3,6);b.rotation.x=-.3;});cyl(sw,.04,.04,1.9,'#2f6a74',0,1.68,0,6).rotation.z=Math.PI/2;
    [-.4,.4].forEach(x=>{cyl(sw,.01,.01,1.1,'#5a5a5a',x-.12,1.12,0,4);cyl(sw,.01,.01,1.1,'#5a5a5a',x+.12,1.12,0,4);box(sw,.34,.04,.16,'#e8443a',x,.56,0);});
    G.userData.foot=[-1.6,-1.3,1.6,1.3];},
  cafeset(G,o){/* two tables with umbrellas and four chairs each */[[-.9,0],[.9,0]].forEach(([x,z],i)=>{cyl(G,.36,.36,.04,'#f4f2ec',x,.72,z,14);cyl(G,.04,.04,.72,'#2a2e33',x,.36,z,6);cyl(G,.04,.04,2.1,'#d8d8d8',x,1.05,z,6);poleShadow(G,x,z,2.1);
      const u=new THREE.Mesh(new THREE.ConeGeometry(.95,.42,8,1,true),new THREE.MeshLambertMaterial({color:L2(new THREE.Color(i?'#2f8a8a':'#e86a3a')),side:THREE.DoubleSide}));u.position.set(x,2.05,z);u.castShadow=true;G.add(u);
      [[0,.55],[0,-.55],[.55,0],[-.55,0]].forEach(([a,b])=>{const c=new THREE.Group();c.position.set(x+a,0,z+b);c.rotation.y=Math.atan2(a,b);G.add(c);box(c,.36,.04,.36,'#8a5a3a',0,.45,0);box(c,.36,.4,.04,'#8a5a3a',0,.66,.17);[[-.15,-.15],[.15,-.15],[-.15,.15],[.15,.15]].forEach(([p,q])=>cyl(c,.02,.02,.45,'#2a2e33',p,.22,q,4));});});
    G.userData.foot=[-1.6,-.8,1.6,.8];},
  fishstall(G,o){box(G,2.2,.9,1,'#f4f2ec',0,.45,0);box(G,2.24,.08,1.04,'#2f6a74',0,.92,0);box(G,2,.12,.8,'#bfe4ee',0,1.0,0);/* ice tray */
    ['#c0c8d0','#e8a070','#c0c8d0','#d8b090','#c0c8d0'].forEach((c,i)=>{const f=sph(G,.11,c,-.8+i*.4,1.1,.05,2.2,.6,.8);f.rotation.y=.3*i;});
    [-1.05,1.05].forEach(x=>cyl(G,.04,.04,2.3,'#2a2e33',x,1.15,-.45,6));const aw=box(G,2.4,.06,1.3,'#2f8a8a',0,2.25,-.1);aw.rotation.x=.18;for(let i=0;i<6;i++)box(G,.2,.065,1.31,'#f4f2ec',-1.0+i*.4,2.252,-.1).rotation.x=.18;
    if(o.text!==false){const{t,a}=signTex([o.text||'FRESH FISH'],'#1d3a4a','#ffffff');const s=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4/a),new THREE.MeshLambertMaterial({map:t}));s.position.set(0,1.9,-.6);G.add(s);}
    box(G,.5,.4,.4,'#3a6ea8',1.4,.2,.3);G.userData.foot=[-1.3,-.7,1.6,.6];},
  gardenplot(G,o){/* raised beds with vegetables, a low picket fence and a watering can */[[-.75,0],[.75,0]].forEach(([x,z])=>{box(G,1.2,.3,2,'#8a5a3a',x,.15,z);box(G,1.1,.06,1.9,'#5a3a22',x,.31,z);
      for(let i=0;i<4;i++)for(let j=0;j<2;j++){const c=['#4f8a3a','#62a046','#d8443a','#e8a030'][(i+j)%4];sph(G,.14,c,x-.27+j*.54,.45,z-.7+i*.47,1,.8,1);}});
    for(let i=0;i<9;i++){box(G,.06,.45,.04,'#f4f2ec',-1.6+i*.4,.22,1.25);box(G,.06,.45,.04,'#f4f2ec',-1.6+i*.4,.22,-1.25);}box(G,3.3,.05,.03,'#f4f2ec',0,.34,1.25);box(G,3.3,.05,.03,'#f4f2ec',0,.34,-1.25);
    cyl(G,.12,.14,.25,'#2f8a8a',1.55,.13,.6,10);G.userData.foot=[-1.7,-1.3,1.7,1.3];},
  bikerepair(G,o){/* a stand with a bike on it, a tool board and a pump */cyl(G,.05,.05,1.1,'#2f6a74',0,.55,0,6);box(G,.5,.05,.05,'#2f6a74',0,1.1,0);
    const b=new THREE.Group();b.position.set(0,.7,0);G.add(b);[[.42],[-.42]].forEach(([x])=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.28,.025,6,18),m('#1d1d22'));t.position.x=x;b.add(t);});box(b,.85,.04,.04,'#c8344a',0,.2,0).rotation.z=.2;box(b,.04,.4,.04,'#c8344a',-.1,.15,0);
    box(G,1.2,.9,.06,'#8a5a3a',-.9,1.0,-.6);[[-1.25,1.2],[-1.0,1.15],[-.75,1.2],[-1.15,.85],[-.85,.8],[-.6,.85]].forEach(([x,y])=>box(G,.05,.22,.03,'#9aa0a6',x,y,-.56));cyl(G,.04,.04,1.4,'#5a3a22',-1.45,.7,-.6,6);cyl(G,.04,.04,1.4,'#5a3a22',-.35,.7,-.6,6);
    cyl(G,.05,.05,.7,'#e8443a',.8,.35,.3,8);if(o.text!==false){const{t,a}=signTex([o.text||'BIKE FIX'],'#f2c230','#1d1d22');const s=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.0/a),new THREE.MeshLambertMaterial({map:t}));s.position.set(-.9,1.62,-.56);G.add(s);}
    G.userData.foot=[-1.5,-.8,1,.5];},
  lamp(G,o){cyl(G,.06,.09,3,'#2a2e33',0,1.5,0,8);cyl(G,.16,.2,.18,'#2a2e33',0,.09,0);const arm=box(G,.5,.06,.06,'#2a2e33',.22,2.95,0);const head=cyl(G,.04,.2,.28,'#2a2e33',.44,2.82,0,8);
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(.11,10,8),new THREE.MeshBasicMaterial({color:0xfff1c0}));bulb.position.set(.44,2.66,0);G.add(bulb);const L=new THREE.PointLight(0xffd59a,0,9,2);L.position.set(.44,2.5,0);G.add(L);G.userData.lamp={bulb,L};G.userData.foot=[-.2,-.2,.2,.2];},
  bench(G,o){const wood=o.color||'#a8744a';for(let i=0;i<3;i++)box(G,1.6,.05,.12,wood,0,.45,-.18+i*.16);for(let i=0;i<2;i++)box(G,1.6,.12,.04,wood,0,.66+i*.16,-.27);[-.68,.68].forEach(x=>{box(G,.06,.45,.5,'#2f3438',x,.22,-.05);box(G,.06,.4,.06,'#2f3438',x,.65,-.28);});G.userData.foot=[-.85,-.35,.85,.3];},
  bin(G){cyl(G,.24,.21,.8,o2(G,'#3e7d5c'),0,.4,0,12);cyl(G,.26,.26,.06,'#2a5a40',0,.83,0,12);G.userData.foot=[-.25,-.25,.25,.25];},
  sign(G,o){const lines=o.text||['SIGN'],st=signTex(lines,o.bg||'#2f5a3a',o.fg||'#f5ecd8'),w=o.w||1.4,h=w/st.a;cyl(G,.05,.05,1.6+h,'#5a4030',-w/2+.08,(1.6+h)/2,-.03,6);cyl(G,.05,.05,1.6+h,'#5a4030',w/2-.08,(1.6+h)/2,-.03,6);
    const b=box(G,w,h,.06,'#3a2a20',0,1.5+h/2,0);const mat=new THREE.MeshLambertMaterial({map:st.t});[.031,-.031].forEach((z,i)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w-.04,h-.04),mat);p.position.set(0,1.5+h/2,z);if(i)p.rotation.y=Math.PI;G.add(p);});G.userData.foot=[-w/2,-.1,w/2,.1];},
  busstop(G,o){box(G,2.6,.08,1.2,'#e8e2d0',0,2.3,-.1);[-1.2,1.2].forEach(x=>cyl(G,.05,.05,2.3,'#2f3a44',x,1.15,.4,6));box(G,2.5,1.6,.04,'#cfe6f0',0,1.2,-.62).material=new THREE.MeshLambertMaterial({color:0xcfe6f0,transparent:true,opacity:.45});
    box(G,1.6,.06,.36,'#a8744a',0,.48,-.4);const s=signTex(o.text||['BUS STOP'],'#1f5fae','#ffffff');const p=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9/s.a),new THREE.MeshLambertMaterial({map:s.t}));p.position.set(1.3,2.0,.42);G.add(p);cyl(G,.04,.04,2.4,'#2f3a44',1.3,1.2,.4,6);G.userData.foot=[-1.3,-.7,1.4,.5];},
  bollard(G){cyl(G,.1,.12,.8,'#3a3e44',0,.4,0,10);cyl(G,.12,.12,.06,'#e8c040',0,.7,0,10);G.userData.foot=[-.12,-.12,.12,.12];},
  planter(G,o){box(G,1.2,.45,.5,o.color||'#b9a68a',0,.22,0);box(G,1.14,.06,.44,'#5a3e2a',0,.44,0);const cols=['#f5a3c0','#ffffff','#f6e27a','#c9a2f0','#f08a5a'];for(let i=0;i<12;i++){const x=-.48+(i%6)*.19,z=i<6?-.1:.1;cyl(G,.012,.012,.25,'#4f7a3a',x,.58,z,4);sph(G,.055,cols[(i*7)%5],x,.72,z);sph(G,.09,'#4f8a40',x,.5,z,1,.6,1);}G.userData.foot=[-.6,-.25,.6,.25];},
  picnic(G){const w='#9a6a42';box(G,1.8,.06,.8,w,0,.74,0);[-.6,.6].forEach(z=>box(G,1.8,.05,.28,w,0,.44,z));[-.75,.75].forEach(x=>{const a=box(G,.07,.85,.07,w,x,.38,0);a.rotation.x=.5;const b=box(G,.07,.85,.07,w,x,.38,0);b.rotation.x=-.5;});G.userData.foot=[-.95,-.8,.95,.8];},
  bikerack(G){for(let i=0;i<4;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(.32,.025,6,16,Math.PI),m('#9aa4ac'));t.position.set(-.75+i*.5,.0,0);t.rotation.y=Math.PI/2;t.castShadow=true;G.add(t);}G.userData.foot=[-1,-.3,1,.3];},
  bikes(G,o){K.bikerack(G);const cols=['#e0434f','#f2c14e','#3f7ad0','#3f9a6a'];for(let i=0;i<(o.n||3);i++){const B=new THREE.Group();B.position.set(-.75+i*.5,0,0);[-.38,.38].forEach(z=>{const w=new THREE.Mesh(new THREE.TorusGeometry(.26,.03,6,18),m('#26282c'));w.rotation.y=Math.PI/2;w.position.set(0,.29,z);B.add(w);});
    box(B,.04,.04,.74,cols[i%4],0,.55,0);const s=box(B,.04,.32,.04,cols[i%4],0,.45,-.18);s.rotation.x=.3;box(B,.04,.32,.04,cols[i%4],0,.48,.28).rotation.x=-.25;box(B,.08,.04,.2,'#26282c',0,.7,-.22);box(B,.4,.03,.03,'#26282c',0,.75,.34);G.add(B);}},
  umbrella(G,o){cyl(G,.03,.03,2.2,'#e8e2d0',0,1.1,0,6);poleShadow(G,0,0,2.1);const c=new THREE.Mesh(new THREE.ConeGeometry(1.1,.4,12,1,true),new THREE.MeshLambertMaterial({color:L2(new THREE.Color(o.color||'#e85a6a')),side:THREE.DoubleSide}));c.position.y=2.1;c.castShadow=true;G.add(c);G.userData.foot=[-.1,-.1,.1,.1];},
  buoy(G,o){cyl(G,.25,.32,.5,o.color||'#f08a2a',0,.1,0,12);cyl(G,.03,.03,.5,'#e8e2d0',0,.55,0,6);G.userData.bob=1;},
  /* limestone pillar of the Pinnacles desert (Paul, 20 Nov 2026: tourist maps) */
  pinnacle(G,o){const h=(o.h||1.6)*(o.s||1),g=new THREE.CylinderGeometry(.08*h,.32*h,h,9,4),p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),k=1+Math.sin(i*7.3)*.18+Math.sin(y*6+i)*.08;p.setX(i,p.getX(i)*k);p.setZ(i,p.getZ(i)*k*(.8+Math.sin(i*3.1)*.2));if(y>h/2-.01)p.setY(i,y+Math.sin(i*5.7)*.08*h);}g.computeVertexNormals();
    const r=new THREE.Mesh(g,m(o.color||'#e2c48a'));r.position.y=h/2-.05;r.castShadow=r.receiveShadow=true;G.add(r);},
  /* a waterfall: a falling sheet over a rock face into a round pool, the water moves */
  waterfall(G,o){const h=o.h||4,w=o.w||2.2;box(G,w+1.6,h+.4,1.2,'#7a6e60',0,h/2,-.7);const c=document.createElement('canvas');c.width=32;c.height=128;const x=c.getContext('2d');for(let i=0;i<128;i++){x.fillStyle='rgba(255,255,255,'+(.35+Math.random()*.5)+')';x.fillRect(Math.random()*32,i,2+Math.random()*4,6);}
    x.globalCompositeOperation='destination-over';x.fillStyle='#8fd0e8';x.fillRect(0,0,32,128);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.92}));f.position.set(0,h/2,-.08);G.add(f);G.userData.fall=t;
    const pool=new THREE.Mesh(new THREE.CircleGeometry(w*1.2,24),new THREE.MeshLambertMaterial({color:L2(new THREE.Color('#5fb4cc')),transparent:true,opacity:.85}));pool.rotation.x=-Math.PI/2;pool.position.set(0,.04,w*.9);G.add(pool);
    for(let k=0;k<7;k++){const a=k/7*Math.PI*2,R=w*1.25;const r=new THREE.Mesh(new THREE.IcosahedronGeometry(.35+(k%3)*.12,0),m('#8a8072'));r.position.set(Math.cos(a)*R,.15,w*.9+Math.sin(a)*R);r.castShadow=true;G.add(r);}},
  tent(G,o){const c=o.color||['#e8743a','#3e8ad0','#5fa85a','#e8c23a'][(o.seed||0)%4],g=new THREE.ConeGeometry(1.1,1.3,4);g.rotateY(Math.PI/4);const t=new THREE.Mesh(g,m(c));t.scale.set(1,1,1.4);t.position.y=.65;t.castShadow=true;G.add(t);box(G,.5,.8,.02,'#2a2420',0,.4,.98);},
  campfire(G,o){for(let k=0;k<6;k++){const a=k/6*Math.PI*2;const r=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,0),m('#7a7068'));r.position.set(Math.cos(a)*.45,.08,Math.sin(a)*.45);G.add(r);}
    [0,1.1,2.2].forEach(a=>{const l=cyl(G,.06,.06,.8,'#6a4a2a',0,.12,0,6);l.rotation.z=Math.PI/2;l.rotation.y=a;});const fl=new THREE.Mesh(new THREE.ConeGeometry(.22,.6,8),new THREE.MeshBasicMaterial({color:'#ffb040'}));fl.position.y=.4;G.add(fl);G.userData.fire=fl;
    [-1,1].forEach(s=>{const b=box(G,1.2,.3,.3,'#8a6a48',s*1.3,.15,0);b.rotation.y=Math.PI/2;});},
  /* a parked airliner for the airport map (fictional livery) */
  jetbridge(G,o){/* airport jet bridge: a rotunda at the terminal, a tube out on a wheeled leg, a cab that meets the plane door; runs along +z */const L=o.len||7,y=2.6;
    cyl(G,.8,.8,y+.9,'#b8bcc2',0,(y+.9)/2,0,12);box(G,1.3,1.4,L,'#d4d8dc',0,y+.4,L/2+.6);box(G,1.32,.32,L,'#5a7a92',0,y+.6,L/2+.6);box(G,1.8,1.6,1.4,'#c8ccd0',0,y+.4,L+1.2);box(G,1.82,.4,1.42,'#3a4a58',0,y+.7,L+1.2);
    cyl(G,.12,.12,y-.4,'#7a7e84',0,(y-.4)/2,L*.72);box(G,1.4,.3,.6,'#3a3e44',0,.15,L*.72);},
  archbridge(G,o){/* a big steel arch bridge over a harbour (a look-alike, no real name): granite pylons at both ends, the deck under the arch,
       hangers, the arch drawn as two curved trusses; runs along x, o.len long, o.h deck height */const L=o.len||60,dh=o.h||5,top=dh+(o.rise||14),Wd=5;
    box(G,L,.5,Wd,'#6a6e74',0,dh,0);box(G,L,.2,.2,'#3a3e44',0,dh+.6,Wd/2);box(G,L,.2,.2,'#3a3e44',0,dh+.6,-Wd/2);
    [-1,1].forEach(e=>{const x=e*L*.42;box(G,3.4,top-2,5.6,'#c8b898',x,(top-2)/2,0);box(G,3.8,.6,6,'#b0a080',x,top-1.7,0);});
    const n=24;[-Wd/2,Wd/2].forEach(z=>{for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,x0=(t0-.5)*L*.8,x1=(t1-.5)*L*.8,y0=dh+(top-dh)*(1-(2*t0-1)**2),y1=dh+(top-dh)*(1-(2*t1-1)**2),
      dx=x1-x0,dy=y1-y0,len=Math.hypot(dx,dy);const b=box(G,len+.05,.5,.4,'#7a8088',(x0+x1)/2,(y0+y1)/2,z);b.rotation.z=Math.atan2(dy,dx);const b2=box(G,len+.05,.3,.3,'#7a8088',(x0+x1)/2,(y0+y1)/2-1.1*(1-(2*((t0+t1)/2)-1)**2),z);b2.rotation.z=Math.atan2(dy,dx);
      if(i%2===0&&y0-dh>1.2)box(G,.12,y0-dh,.12,'#5a5e64',x0,dh+(y0-dh)/2,z);}});for(let i=2;i<n-1;i+=3){const t=i/n,x=(t-.5)*L*.8,y=dh+(top-dh)*(1-(2*t-1)**2);box(G,.25,.25,Wd,'#7a8088',x,y,0);}},
  concerthall(G,o){/* a harbour concert hall with white shell roofs on a stone podium (a look-alike in spirit, not a copy of any real building) */const S=o.s||1;
    box(G,24*S,2.4*S,14*S,'#c8a888',0,1.2*S,0);box(G,10*S,1.2*S,6*S,'#b89878',-15*S,.6*S,0);
    const shell=(x,z,r,ry,tilt,c)=>{const g=new THREE.SphereGeometry(r*S,16,10,0,Math.PI,0,Math.PI/2);const mm=new THREE.Mesh(g,m(c||'#f4f2ea'));mm.position.set(x*S,2.4*S,z*S);mm.rotation.set(0,ry,tilt);mm.scale.set(1,1.6,.55);mm.castShadow=mm.receiveShadow=true;G.add(mm);};
    [[-8,-3,4.2,Math.PI/2,-.35],[-4,-3,5,Math.PI/2,-.35],[1,-3,4.2,Math.PI/2,-.35],[-8,3.4,3.6,Math.PI/2,-.35],[-4,3.4,4.4,Math.PI/2,-.35],[1,3.4,3.6,Math.PI/2,-.35],[6,0,2.6,Math.PI/2,-.3]].forEach(a=>shell(...a));
    box(G,4*S,.8*S,12*S,'#2a3a48',9*S,2.6*S,0);},
  cablecar(G,o){/* a cable car across a valley: a station each end, two cables, cabins that run (G.userData.cab) */const L=o.len||40,h0=o.h0||1,h1=o.h1||1,top=o.top||3;
    [[-L/2,h0],[L/2,h1]].forEach(([x,h])=>{box(G,4,3,4,'#e8e0d0',x,h+1.5,0);box(G,4.6,.4,4.6,'#a83a2a',x,h+3.2,0);});
    [-.6,.6].forEach(z=>{const dx=L,dy=h1-h0,len=Math.hypot(dx,dy);const c=box(G,len,.06,.06,'#2a2e33',0,(h0+h1)/2+top,z);c.rotation.z=Math.atan2(dy,dx);});
    G.userData.cab=[];[0,.5].forEach(p=>{const C=new THREE.Group();G.add(C);box(C,1.8,1.3,1.4,'#f2c14e',0,-.9,0);box(C,1.82,.5,1.42,'#2a3a48',0,-.7,0);box(C,.06,.6,.06,'#2a2e33',0,-.1,0);C.userData.p=p;C.userData.a=[-L/2,h0+top,L/2,h1+top];G.userData.cab.push(C);});},
  tram(G,o){/* a city tram on its tracks: green and cream body, pantograph */const c=o.color||'#2f8a5a';box(G,9,2.2,2.2,c,0,1.4,0);box(G,9.02,.8,2.22,'#203038',0,1.9,0);box(G,9.02,.5,2.22,'#f2ead8',0,.55,0);box(G,8,.3,1.9,'#9aa0a6',0,2.65,0);
    const p=box(G,.06,1,.06,'#2a2e33',0,3.2,0);p.rotation.z=.5;[-3,3].forEach(x=>[-1,1].forEach(z=>cyl(G,.35,.35,.2,'#2a2e33',x,.35,z*.9,10).rotation.x=Math.PI/2));
    [-1,1].forEach(z=>{box(G,30,.06,.1,'#8a9096',0,.03,z*.72);});},
  rockpillar(G,o){/* a tall sandstone rock pillar (cliffs, sea stacks): stacked weathered blocks, banded, scrub on top */const h=o.h||10,r=o.w||2.4,n=Math.max(4,Math.round(h/1.4));
    for(let i=0;i<n;i++){const t=i/n,rr=r*(1-t*.45)*(.9+Math.sin(i*2.7)*.1),y=h*t;sph(G,rr,i%2?'#c89a6a':'#b8865a',Math.sin(i*1.9)*.2*r,y+h/n*.5,Math.cos(i*1.3)*.2*r,1,h/n/rr*.75,1);}
    sph(G,r*.5,'#5a7a3a',0,h+.2,0,1,.35,1);sph(G,r*1.2,'#a8845a',0,.3,0,1,.3,1);},
  plane(G,o){const s=o.s||1,c=o.color||'#2f6fb0';const b=cyl(G,.9*s,.9*s,12*s,'#f2f2ee',0,1.8*s,0,14);b.rotation.x=Math.PI/2;const n=new THREE.Mesh(new THREE.SphereGeometry(.9*s,14,10),m('#f2f2ee'));n.scale.z=1.8;n.position.set(0,1.8*s,6*s);G.add(n);
    const tc=new THREE.Mesh(new THREE.ConeGeometry(.9*s,3*s,14),m('#f2f2ee'));tc.rotation.x=-Math.PI/2;tc.position.set(0,1.9*s,-7.4*s);G.add(tc);box(G,14*s,.2*s,2.4*s,'#e8e8e4',0,1.5*s,.4*s);box(G,5*s,.16*s,1.4*s,'#e8e8e4',0,2.2*s,-7.6*s);
    box(G,.2*s,2.6*s,2.2*s,c,0,3.3*s,-7.4*s);box(G,.06,.5*s,9*s,c,.9*s,2.1*s,0);box(G,.06,.5*s,9*s,c,-.9*s,2.1*s,0);[-3.2,3.2].forEach(x=>cyl(G,.45*s,.45*s,1.6*s,'#c8ccd0',x*s,1.05*s,1*s,10).rotation.x=Math.PI/2);
    [[0,5],[-1.4,0],[1.4,0]].forEach(([x,z])=>cyl(G,.25*s,.25*s,.3*s,'#2a2a2a',x*s,.25*s,z*s,10).rotation.z=Math.PI/2);},
  rock(G,o){const r=new THREE.Mesh(new THREE.IcosahedronGeometry(.5,1),m('#b8a888'));const p=r.geometry.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);v.multiplyScalar(.8+Math.sin(i*12.9)*.15);v.y*=.6;p.setXYZ(i,v.x,v.y,v.z);}r.geometry.computeVertexNormals();r.position.y=.12;r.castShadow=true;G.add(r);},
  crate(G){box(G,.6,.5,.6,'#b98a5a',0,.25,0);box(G,.62,.06,.62,'#8a6440',0,.47,0);},
  tap(G){cyl(G,.05,.05,.9,'#7a8088',0,.45,0,8);box(G,.25,.05,.05,'#7a8088',.1,.86,0);box(G,.4,.08,.3,'#6a6e74',0,.04,0);},
  fence(G,o){const L=o.lines||[[0,0],[4,0]];for(let i=1;i<L.length;i++){const a=L[i-1],b=L[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),n=Math.max(1,Math.round(len/1.5));
      for(let k=0;k<=n;k++){const t=k/n;cyl(G,.05,.06,.9,'#d8ccb0',a[0]+(b[0]-a[0])*t,.45,a[1]+(b[1]-a[1])*t,6);}[.35,.75].forEach(y=>{const r=box(G,len,.06,.04,'#d8ccb0',(a[0]+b[0])/2,y,(a[1]+b[1])/2);r.rotation.y=-ang;});}},
  dunefence(G,o){/* timber posts with two wires along the dunes; o.lines world points */const L=o.lines||[[0,0],[6,0]];for(let i=1;i<L.length;i++){const a=L[i-1],b=L[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),n=Math.max(1,Math.round(len/1.6));
    for(let k=0;k<=n;k++){const x=a[0]+(b[0]-a[0])*k/n,z=a[1]+(b[1]-a[1])*k/n;const p=cyl(G,.05,.06,1,'#8a6a4a',x,o.H(x,z)+.5,z,6);}[.45,.85].forEach(hh=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,len,3),m('#9aa0a6'));w.rotation.z=Math.PI/2;w.rotation.y=-ang;w.position.set((a[0]+b[0])/2,o.H((a[0]+b[0])/2,(a[1]+b[1])/2)+hh,(a[1]+b[1])/2);G.add(w);});}},
  foodtruck(G,o){/* small food van with a serving hatch and awning */const c=o.color||'#f2c14e';box(G,3.6,1.7,1.8,c,0,1.25,0);box(G,1.2,1.2,1.78,'#f6f2e8',1.85,1.0,0);box(G,.05,.7,1.6,'#9fc8e0',2.46,1.25,0);box(G,3.62,.3,1.82,'#e85a6a',0,2.2,0);
    box(G,1.8,.9,.04,'#2a2420',-.3,1.45,.92);box(G,2,.05,.3,'#c8c4ba',-.3,1.0,1.05);const aw=box(G,2.2,.05,1,'#e85a6a',-.3,2.0,1.35);aw.rotation.x=-.35;[-1.2,1.2].forEach(x=>{const w=cyl(G,.33,.33,.25,'#2a2a30',x,.33,.9,12);w.rotation.x=Math.PI/2;const w2=cyl(G,.33,.33,.25,'#2a2a30',x,.33,-.9,12);w2.rotation.x=Math.PI/2;});
    const sg=signTex([o.sign||'FOOD TRUCK'],'#2a2420','#f6e27a');const sp=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.8/sg.a),new THREE.MeshLambertMaterial({map:sg.t}));sp.position.set(-.3,2.2,.92);G.add(sp);G.userData.foot=[-1.8,-.9,1.8,1.9];},
  surfrack(G){box(G,1.8,.08,.1,'#8a6440',0,1.1,0);[-.85,.85].forEach(x=>box(G,.08,1.2,.08,'#8a6440',x,.6,0));['#f2c14e','#e85a6a','#3fb0a0','#f4f2ec'].forEach((c,i)=>{const b=sph(G,.28,c,-.6+i*.4,.9,.1,.5,2,.12);b.rotation.z=.08;});G.userData.foot=[-.9,-.2,.9,.2];},
  towel(G,o){const c=document.createElement('canvas');c.width=16;c.height=32;const x=c.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=i%2?'#f6f2e8':(o.color||'#3a8ad0');x.fillRect(0,i*4,16,4);}const t=new THREE.CanvasTexture(c);t.encoding=ENC();t.magFilter=THREE.NearestFilter;
    const m2=new THREE.Mesh(new THREE.PlaneGeometry(.8,1.7),new THREE.MeshLambertMaterial({map:t}));m2.rotation.x=-Math.PI/2;m2.position.y=.02;m2.receiveShadow=true;G.add(m2);},
  deckchair(G,o){const c=o.color||'#e85a6a';const s=box(G,.6,.04,1.1,c,0,.3,0);s.rotation.x=-.25;const b=box(G,.6,.04,.7,c,0,.6,-.55);b.rotation.x=-1.1;[-.3,.3].forEach(x=>{box(G,.03,.5,.03,'#c8b496',x,.25,.35);box(G,.03,.8,.03,'#c8b496',x,.4,-.45);});},
  icecart(G){box(G,1.4,.8,.8,'#f6f2e8',0,.7,0);box(G,1.42,.2,.82,'#e85a6a',0,1.12,0);[-.5,.5].forEach(x=>{const w=cyl(G,.25,.25,.08,'#2a2a30',x,.25,.42,12);w.rotation.x=Math.PI/2;});cyl(G,.03,.03,1.4,'#c8c8c0',0,1.6,0,6);
    const u=new THREE.Mesh(new THREE.ConeGeometry(1,.35,10,1,true),new THREE.MeshLambertMaterial({color:L2(new THREE.Color('#f2c14e')),side:THREE.DoubleSide}));u.position.y=2.3;u.castShadow=true;G.add(u);[0,1,2].forEach(i=>sph(G,.09,['#f5a3c0','#f6e27a','#8a5a3a'][i],-.3+i*.3,1.3,.2));G.userData.foot=[-.7,-.4,.7,.4];},
  flagpole(G,o){cyl(G,.05,.07,6,'#e8e8e4',0,3,0,8);const c=document.createElement('canvas');c.width=48;c.height=32;const x=c.getContext('2d');x.fillStyle=o.color||'#2f78a8';x.fillRect(0,0,48,32);x.fillStyle='#f2c14e';x.beginPath();x.arc(16,16,8,0,6.28);x.fill();
    const t=new THREE.CanvasTexture(c);t.encoding=ENC();const f=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1,10,1),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}));f.geometry.translate(.75,0,0);f.position.set(.05,5.4,0);G.add(f);G.userData.flag=f;G.userData.foot=[-.1,-.1,.1,.1];},
  fountain(G){cyl(G,.9,1,.5,'#d8d0c0',0,.25,0,20);const w=cyl(G,.8,.8,.05,'#6ab0d0',0,.46,0,20);w.material=new THREE.MeshLambertMaterial({color:0x6ab0d0,emissive:0x103040});cyl(G,.12,.15,1,'#d8d0c0',0,.8,0,10);cyl(G,.35,.15,.12,'#d8d0c0',0,1.3,0,14);G.userData.foot=[-1,-1,1,1];},
  postbox(G){cyl(G,.22,.22,1,'#c8344a',0,.5,0,14);sph(G,.22,'#c8344a',0,1,0,1,.6,1);box(G,.2,.03,.02,'#2a2a30',0,.82,.22);},
  arrowpost(G,o){cyl(G,.05,.05,2.4,'#6a4a30',0,1.2,0,6);(o.arrows||['BEACH','CAFE','JETTY']).forEach((t,i)=>{const st=signTex([t],'#f5ecd8','#3a2a20');const p=new THREE.Mesh(new THREE.PlaneGeometry(1,1/st.a),new THREE.MeshLambertMaterial({map:st.t,side:THREE.DoubleSide}));p.position.set(.5,2.1-i*.32,0);p.rotation.y=i*1.1;p.geometry.translate(0,0,0);G.add(p);});},
  shower(G){cyl(G,.05,.05,2.2,'#b8bcc0',0,1.1,0,8);box(G,.4,.04,.04,'#b8bcc0',.2,2.2,0);cyl(G,.1,.05,.08,'#b8bcc0',.4,2.15,0,8);box(G,1,.05,1,'#c8c0b0',0,.03,0);},
  lifering(G){cyl(G,.04,.04,1.5,'#e8e4dc',0,.75,0,6);const r2=new THREE.Mesh(new THREE.TorusGeometry(.3,.08,8,16),m('#f08a2a'));r2.position.set(0,1.3,.06);r2.castShadow=true;G.add(r2);},
  kayakrack(G){[-.9,.9].forEach(x=>{box(G,.08,1.2,.08,'#8a6440',x,.6,0);});[.5,1].forEach((y,i)=>{box(G,1.9,.06,.4,'#8a6440',0,y,0);sph(G,.22,['#f1c64a','#e8734a'][i],0,y+.14,0,4,.5,1);});},
  sprinkler(G){cyl(G,.04,.04,.15,'#3e7d5c',0,.08,0,6);G.userData.spray=1;},
  hedge(G,o){const L=o.len||3;box(G,L,.8,.6,'#3e6e34',0,.4,0);for(let i=0;i<L*3;i++)sph(G,.3,'#4f8240',-L/2+i/3+.15,.75,(i%2-.5)*.2);G.userData.foot=[-L/2,-.3,L/2,.3];},
  boardwalk(G,o){/* low timber walk with rails over a lake or dune; o.lines world points */const L=o.lines||[[0,0],[0,10]];for(let i=1;i<L.length;i++){const a=L[i-1],b=L[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);const D=new THREE.Group();D.position.set((a[0]+b[0])/2,Math.max(o.H(a[0],a[1]),o.H(b[0],b[1]),o.H((a[0]+b[0])/2,(a[1]+b[1])/2),0),(a[1]+b[1])/2);D.rotation.y=-ang;G.add(D);
    box(D,len,.08,1.6,'#a8845a',0,.45,0);for(let k=0;k<=len;k+=2){[-.8,.8].forEach(z=>{box(D,.1,.95,.1,'#7a5a3a',-len/2+k,.45,z);});}[-.8,.8].forEach(z=>box(D,len,.07,.07,'#8a6440',0,.95,z));}},
  lookout(G){box(G,4,.15,3,'#a8845a',0,1.2,0);[[-1.9,-1.4],[1.9,-1.4],[-1.9,1.4],[1.9,1.4]].forEach(([x,z])=>box(G,.15,1.2,.15,'#7a5a3a',x,.6,z));[[0,-1.45,4,.07],[0,1.45,4,.07]].forEach(([x,z,w,d])=>box(G,w,.07,d,'#8a6440',x,2,z));[-1.95,1.95].forEach(x=>box(G,.07,.07,3,'#8a6440',x,2,0));
    for(let k=0;k<4;k++)box(G,1,.08,.4,'#a8845a',0,.2+k*.3,1.7+k*.4);const sg=signTex(['LOOKOUT'],'#3e5a44','#f5ecd8');const p2=new THREE.Mesh(new THREE.PlaneGeometry(1,1/sg.a),new THREE.MeshLambertMaterial({map:sg.t,side:THREE.DoubleSide}));p2.position.set(1.4,2.3,1.5);G.add(p2);G.userData.foot=[-2,-1.5,2,3];},
  jetty(G,o){const L=o.lines||[[0,0],[0,10]],a=L[0],b=L[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),w=o.width||2;const D=new THREE.Group();D.position.set((a[0]+b[0])/2,0,(a[1]+b[1])/2);D.rotation.y=-ang;G.add(D);
    for(let k=0;k<len/.3;k++)box(D,.28,.08,w,k%2?'#a0764a':'#b08454',-len/2+.15+k*.3,.6,0);for(let k=0;k<=len/2;k++)[-w/2+.1,w/2-.1].forEach(z=>cyl(D,.09,.1,2.4,'#6a4a30',-len/2+k*2,-.4,z,8));G.userData.foot=null;}};
function o2(G,c){return c;}
function create(o){GAMMA=!!(o&&o.gammaOut);const scene=o.scene,H=o.heightAt||(()=>0),list=[];const api={night:0,list,
  add(kind,x,z,op){op=op||{};op.H=H;const G=new THREE.Group();(K[kind]||K.crate)(G,op);const flat=kind==='jetty'||kind==='fence'||kind==='boardwalk'||kind==='dunefence';const y=flat?0:H(x,z);if(!flat)G.position.set(x,y,z);
    G.rotation.y=op.rot||0;if(op.scale)G.scale.setScalar(op.scale);G.userData.prop={kind};G.traverse(q=>{q.__pxSkip=1;});(op.parent||scene).add(G);list.push(G);return G;},
  along(kind,pts,sp,op){op=op||{};let carry=sp/2;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);let d=carry;
      while(d<L){const t=d/L,nx=-(b[1]-a[1])/L,nz=(b[0]-a[0])/L,off=op.offset||0;api.add(kind,a[0]+(b[0]-a[0])*t+nx*off,a[1]+(b[1]-a[1])*t+nz*off,Object.assign({},op,{rot:-ang+(op.turn||0)}));d+=sp;}carry=d-L;}},
  update(t){list.forEach((G,i)=>{if(G.userData.fall)G.userData.fall.offset.y=-t*1.6;if(G.userData.cab)G.userData.cab.forEach(C=>{const q=(t*.03+C.userData.p)%1,u=q<.5?q*2:2-q*2,A=C.userData.a;C.position.set(A[0]+(A[2]-A[0])*u,A[1]+(A[3]-A[1])*u,C.userData.p?-.6:.6);});if(G.userData.fire){const f=G.userData.fire;f.scale.set(1+Math.sin(t*13+i)*.12,1+Math.sin(t*9+i)*.2,1);}const f=G.userData.flag;if(f){const p=f.geometry.attributes.position;for(let k=0;k<p.count;k++){const x=p.getX(k);p.setZ(k,Math.sin(x*3-t*5)*.12*x/1.5);}p.needsUpdate=true;}const l=G.userData.lamp;if(l){l.L.intensity=api.night*1.4;l.bulb.material.color.setRGB(.6+.4*api.night,.55+.4*api.night,.4+.35*api.night);}if(G.userData.bob){G.position.y=Math.sin(t*1.4+i)*.06-.05;G.rotation.z=Math.sin(t+i)*.08;}});}};return api;}
g.PropsEngine={create,kinds:Object.keys(K)};})(typeof window!=='undefined'?window:this);
