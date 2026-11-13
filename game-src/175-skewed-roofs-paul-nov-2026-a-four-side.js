// ---------- skewed roofs (Paul, Nov 2026): a four-sided cone turned 45° and then stretched comes out as a twisted diamond.
// Every such roof on every map is rebuilt as a true hip roof over the rectangle it was meant to cover.
function pxFixDiamonds(only){let n=0;const out=[];(only?f=>only.forEach(f):f=>scene.traverse(f))(o=>{if(!o.isMesh||!o.geometry||o.geometry.type!=='ConeGeometry')return;const p=o.geometry.parameters;if(p.radialSegments!==4)return;
    const ry=((o.rotation.y%(Math.PI/2))+Math.PI/2)%(Math.PI/2);if(Math.abs(ry-Math.PI/4)>.06||Math.abs(o.rotation.x)>.01||Math.abs(o.rotation.z)>.01)return;const sx=o.scale.x,sz=o.scale.z;if(Math.abs(sx-sz)<.02*Math.max(sx,sz))return;
    const W=Math.SQRT2*p.radius*Math.abs(sx),D=Math.SQRT2*p.radius*Math.abs(sz),H=p.height*o.scale.y,hx=W/2,hz=D/2,y0=-H/2,y1=H/2;const alongX=W>=D,ri=Math.min(hx,hz);
    const R1=alongX?[-hx+ri,y1,0]:[0,y1,-hz+ri],R2=alongX?[hx-ri,y1,0]:[0,y1,hz-ri];const A=[-hx,y0,-hz],B=[hx,y0,-hz],C=[hx,y0,hz],Dd=[-hx,y0,hz];const pos=[],uv=[];
    const sl=Math.hypot(ri,H);const tri=(a,b,c)=>{pos.push(...a,...b,...c);[a,b,c].forEach(v=>uv.push((alongX?v[0]:v[2])/2,(v[1]-y0)/H*sl/2));};
    if(alongX){tri(Dd,C,R2);tri(Dd,R2,R1);tri(B,A,R1);tri(B,R1,R2);tri(A,Dd,R1);tri(C,B,R2);}else{tri(A,Dd,R2);tri(A,R2,R1);tri(C,B,R1);tri(C,R1,R2);tri(Dd,C,R2);tri(B,A,R1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    const m0=Array.isArray(o.material)?o.material[0]:o.material;o.geometry=g;let col='#'+(m0&&m0.color?m0.color.getHexString():'a8acb0');if(m0&&m0.map&&m0.map.image&&m0.color&&m0.color.getHex()===0xffffff){try{const im=m0.map.image,c=document.createElement('canvas');c.width=c.height=1;const x=c.getContext('2d');x.drawImage(im,0,0,1,1);const d=x.getImageData(0,0,1,1).data;col='#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');}catch(e){}}
    const hsl={};new THREE.Color(col).getHSL(hsl);const kind=hsl.s<.18?'tin':(hsl.h>.5&&hsl.h<.75)?'slate':'tile';const key=col+kind;pxFixDiamonds.c=pxFixDiamonds.c||{};let mm=pxFixDiamonds.c[key];
    if(!mm){const t=ctex(PXK.roof(2,2,{base:col,kind,seed:23}));t.wrapS=t.wrapT=THREE.RepeatWrapping;mm=new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide});mm.__pxSkip=1;pxFixDiamonds.c[key]=mm;}o.material=mm;o.__pxSkip=1;
    o.rotation.y-=ry;o.scale.set(1,1,1);o.updateMatrix();n++;out.push([+W.toFixed(1),+D.toFixed(1)]);});pxFixDiamonds.n=n;window.__diam=n;}
// ---------- Sea 2 (Look Lab ?sea2, Paul Nov 2026): soft turquoise water that shows the depth, a sea floor in the shallows, foam rings round
// every shore, and a tour boat Kip drives himself round Rottnest to find dolphins and whales ----------
var SEA2_LIVE=true;const SEA2_ON=SEA2_LIVE||/[?&#]sea2\b/.test(location.search+location.hash);
function whale32(){const P=painter(72,30),B=RAMP('#4a5a72'),W=RAMP('#dde6ee',3);
  P.ell(34,17,26,8,B);P.ell(60,15,10,5,B);P.ell(8,13,6,2.4,B);P.ell(6,18,5,2,B);P.ell(36,22,20,3,W);P.ell(30,24,7,2.4,B);for(let i=0;i<7;i++)P.ell(42+i*2.4,21,.6,2.4,RAMP('#3a4a60',2));
  P.set(58,14,[240,244,250]);P.set(57,14,[20,24,32]);return P.done([28,34,46]);}
function spout32(){const P=painter(20,24),W=RAMP('#e8f6fc',4);P.ell(10,18,3,5,W);P.ell(6,9,3,4,W);P.ell(14,9,3,4,W);P.ell(10,5,4,3,W);return P.done([150,190,210]);}
const BOAT={on:false,x:0,z:0,h:0,v:0,g:null,dol:[],wh:[],seals:[],pods:[],seen:{},dock:null};window.__BOAT=BOAT;window.__sea2Drive=dt=>sea2Drive(dt);
function sea2Build(){if(sea2Build.done)return;sea2Build.done=true;
  // depth from the island's land-distance grid: 0 at the shore, 1 at 24 m out
  const D=new Uint8Array(GW*GH);for(let k=0;k<GW*GH;k++){const d=-Dg[k];D[k]=d<=0?0:Math.min(255,Math.round(d/24*255));}
  const dt=new THREE.DataTexture(D,GW,GH,THREE.LuminanceFormat,THREE.UnsignedByteType);dt.magFilter=dt.minFilter=THREE.LinearFilter;dt.needsUpdate=true;
  const mat=new THREE.ShaderMaterial({uniforms:{uD:{value:dt},uB:{value:new THREE.Vector4(TB.x1,TB.z1,TB.x2-TB.x1,TB.z2-TB.z1)},uT:{value:0},uN:{value:0}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec2 vUv;uniform sampler2D uD;uniform vec4 uB;uniform float uT,uN;
      float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){vec2 L=vec2(-250.+vUv.x*640.,322.-vUv.y*640.);vec2 P=floor(L*8.)/8.+.0625;vec2 tu=(P-uB.xy)/uB.zw;
        vec2 tc=clamp(tu,.002,.998);vec2 ex=max(vec2(0.),max(-tu,tu-1.))*uB.zw;float d=mix(texture2D(uD,tc).r,1.,clamp(max(max(ex.x,ex.y)/30.,smoothstep(.0,.04,min(min(tu.x,tu.y),min(1.-tu.x,1.-tu.y))<.04?.04-min(min(tu.x,tu.y),min(1.-tu.x,1.-tu.y)):0.)),0.,1.));float m=d*24.;
        vec3 c=mix(vec3(.72,.91,.84),vec3(.55,.83,.79),smoothstep(0.,3.,m));c=mix(c,vec3(.47,.78,.77),smoothstep(3.,10.,m));c=mix(c,vec3(.40,.71,.73),smoothstep(10.,24.,m));
        // the sea floor: rocks, coral and weed show through the shallows
        if(m<7.){float k=1.-m/7.;vec2 cl=floor(P/1.4),f=fract(P/1.4)-.5;float h=h1(cl);vec2 o=vec2(h1(cl+3.)-.5,h1(cl+7.)-.5)*.5;
          if(h>.86&&length((f-o)*vec2(1.,1.3))<.12+h1(cl+9.)*.1){vec3 rc=h>.95?vec3(.86,.56,.62):h>.91?vec3(.66,.56,.84):vec3(.74,.72,.62);c=mix(c,rc*.92,.55*k);}
          else if(h>.74&&h<.82&&abs(f.x-o.x)<.035&&f.y>-.3&&f.y<.2)c=mix(c,vec3(.32,.56,.36),.6*k);}
        // foam rings that roll in to the shore, and a white edge on the sand
        float r=sin(m*1.9-uT*1.1);if(m<3.2&&r>.965)c=mix(c,vec3(.96,.99,.98),.5*(1.-m/3.2));if(m<.5)c=mix(c,vec3(.97,1.,.98),.75);
        if(h1(floor(P*2.)+floor(uT*1.5))>.997)c+=.22;
        c=floor(c*28.)/28.;c=mix(c,c*vec3(.30,.36,.62),uN);gl_FragColor=vec4(c,1.);}`});
  water.material=mat;shore.visible=false;foam.visible=false;if(typeof sparkWater!=='undefined')sparkWater.material.opacity=.18;BOAT.mat=mat;
  // the tour boat: a wooden hull with a pointed bow, a little wheelhouse, a striped canopy, life rings
  const g=new THREE.Group();const M=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  const hs=new THREE.Shape();hs.moveTo(-1.5,-.62);hs.lineTo(.9,-.62);hs.quadraticCurveTo(1.6,-.4,1.85,0);hs.quadraticCurveTo(1.6,.4,.9,.62);hs.lineTo(-1.5,.62);hs.closePath();
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(hs,{depth:.42,bevelEnabled:false}),M('#9a5a32'));hull.rotation.x=-Math.PI/2;hull.position.y=-.12;g.add(hull);
  const deck=new THREE.Mesh(new THREE.ExtrudeGeometry(hs,{depth:.04,bevelEnabled:false}),M('#c89a62'));deck.rotation.x=-Math.PI/2;deck.position.y=.3;deck.scale.set(.92,.88,1);g.add(deck);
  const rail=new THREE.Mesh(new THREE.ExtrudeGeometry(hs,{depth:.08,bevelEnabled:false}),M('#f2ead6'));rail.rotation.x=-Math.PI/2;rail.position.y=.27;rail.scale.set(1.02,1.04,1);g.add(rail);
  const box=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
  box(.8,.7,.9,'#f2ead6',-.75,.7,0);box(.82,.3,.92,'#3a6a8a',-.75,.8,0);box(.95,.08,1.05,'#2f8a8a',-.75,1.09,0);
  [-1.32,-.2].forEach(x=>[-.5,.5].forEach(z=>box(.05,.7,.05,'#e8e0cc',x,.65,z)));
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.14,.05,6,12),M('#e8503a'));ring.position.set(.3,.5,.63);g.add(ring);const r2=ring.clone();r2.position.z=-.63;g.add(r2);
  const flag=new THREE.Mesh(new THREE.PlaneGeometry(.36,.22),M('#f2c04a'));flag.position.set(-1.45,1.45,0);g.add(flag);box(.03,.7,.03,'#e8e0cc',-1.45,1.2,0);
  const wake=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.9),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));wake.rotation.x=-Math.PI/2;wake.position.set(-2.4,-.13,0);g.add(wake);BOAT.wake=wake;
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(g);BOAT.g=g;
  // moor it off the end of the main jetty, in water
  const J=IW(-22.4,5);let bx=J.x,bz=J.z;for(let s=0;s<60&&landD(bx,bz)>-.9;s++){bx-=.4;}BOAT.x=bx;BOAT.z=bz;BOAT.h=Math.PI;BOAT.dock={x:J.x+.9,z:J.z};BOAT.home={x:bx,z:bz};
  // dolphins that ride the bow wave, whales off the west end
  for(let i=0;i<3;i++){const m=spriteMesh([dolphin32()],1.1,.5,{shadow:false});m.visible=false;scene.add(m);BOAT.dol.push(m);}
  [[-150,40],[-170,-48],[60,-60],[90,52]].forEach(([x,z],i)=>{const m=spriteMesh([whale32()],4.2,1.75,{shadow:false});m.position.set(x,-.4,z);scene.add(m);const sp=spriteMesh([spout32()],1.1,1.3,{shadow:false});sp.visible=false;scene.add(sp);BOAT.wh.push({m,sp,x,z,ph:i*2.3});});
  // seal colonies on low rocks off the coast, and two dolphin pods that live in the bays
  const coast=[];for(let z=TB.z1+4;z<TB.z2-4;z+=2)for(let x=TB.x1+4;x<TB.x2-4;x+=2){const d=landD(x,z);if(d<-4&&d>-7)coast.push([x,z]);}
  const pickFar=(n,fx)=>{const out=[];const sorted=coast.slice().sort(fx);for(const q of sorted){if(out.every(o=>Math.hypot(o[0]-q[0],o[1]-q[1])>40))out.push(q);if(out.length>=n)break;}return out;};
  const sealSpots=pickFar(1,(a,b)=>a[0]-b[0]).concat(pickFar(1,(a,b)=>b[1]-a[1]),pickFar(1,(a,b)=>a[1]-b[1]));
  const rockM=new THREE.MeshLambertMaterial({color:'#9a948a',flatShading:true});
  sealSpots.forEach(([x,z],i)=>{for(let k=0;k<3;k++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.9+k*.25,0),rockM);r.position.set(x+(k-1)*1.3,-.35,z+(k%2)*.8);r.scale.y=.45;r.castShadow=true;scene.add(r);}
    for(let k=0;k<3;k++){const m=spriteMesh([seal32()],.9,.65);m.position.set(x+(k-1)*1.2,.08,z+(k%2)*.7-.2);if(k%2)m.scale.x=-1;scene.add(m);}BOAT.seals.push({x,z});});
  coast.splice(0,coast.length,...coast.filter(q=>BOAT.seals.every(o=>Math.hypot(o.x-q[0],o.z-q[1])>45)));const podSpots=pickFar(2,(a,b)=>(b[0]-b[1])-(a[0]-a[1]));podSpots.forEach(([x,z])=>{const ms=[];for(let k=0;k<4;k++){const m=spriteMesh([dolphin32()],1.1,.5,{shadow:false});scene.add(m);ms.push(m);}BOAT.pods.push({x,z,ms});});
  sea2Place();}
function sea2Place(){const g=BOAT.g;if(!g)return;g.position.set(BOAT.x,Math.sin(performance.now()/700)*.04,BOAT.z);g.rotation.y=-BOAT.h;g.rotation.z=Math.sin(performance.now()/900)*.03;}
/* the open sea round Rottnest (Paul, 13 Nov 2026: 50% more room on every side the other maps allow; the West End side meets the Perth maps at x 96) */
/* Paul (13 Nov): room past the West End too. The Perth maps live east of x 99.5 in the same scene, but while Kip is out on the boat the
   game treats him as on Rottnest (see zoneOf below) and those maps stay hidden, so the sea can run on over their spot. */
function seaBounds(){return{x1:TB.x1-140,x2:TB.x2+60,z1:TB.z1-65,z2:TB.z2+65};}
function sea2Water(x,z,h){const SB=seaBounds();if(x>SB.x2-4||x<SB.x1+4||z<SB.z1+4||z>SB.z2-4)return false;if(typeof SHIPS!=='undefined'&&SHIPS.hit(x,z))return false;if(landD(x,z)>=-.7)return false;if(h==null)return true;const c=Math.cos(h),sn=Math.sin(h);for(const[a,b]of[[2,0],[-1.7,0],[0,.8],[0,-.8],[1,.6],[1,-.6]])if(landD(x+c*a-sn*b,z+sn*a+c*b)>=-.3)return false;return true;}
function sea2Tick(dt){if(!BOAT.g)return;const t=performance.now()/1000;BOAT.mat.uniforms.uT.value=t;BOAT.mat.uniforms.uN.value=(typeof NIGHT==='number'?NIGHT:0)*.75;
  if(BOAT.on){player.x=BOAT.x;player.z=BOAT.z;}sea2Place();
  BOAT.wake.material.opacity=Math.min(.5,Math.abs(BOAT.v)/10);
  // dolphins come when the boat is moving in deeper water
  const deep=-landD(BOAT.x,BOAT.z),go=BOAT.on&&BOAT.v>2.5&&deep>5;BOAT.dol.forEach((m,i)=>{m.visible=go;if(!go)return;const side=i===1?-1:1,ph=t*3.2+i*2.1,ahead=1.8+i*.7;
    const x=BOAT.x+Math.cos(BOAT.h)*ahead-Math.sin(BOAT.h)*side*(.9+i*.3),z=BOAT.z+Math.sin(BOAT.h)*ahead+Math.cos(BOAT.h)*side*(.9+i*.3);m.position.set(x,Math.max(-.3,Math.sin(ph))*.55-.15,z);m.scale.x=Math.cos(BOAT.h)>=0?1:-1;});
  if(go&&!BOAT.seen.dol){BOAT.seen.dol=1;popText('Dolphins! They ride the bow wave',{x:BOAT.x,y:2,z:BOAT.z});}
  BOAT.pods.forEach((p,j)=>{p.ms.forEach((m,k)=>{const a=t*.4+k*1.57+j,ph=t*2.6+k*1.3;m.position.set(p.x+Math.cos(a)*5,Math.max(-.35,Math.sin(ph))*.6-.15,p.z+Math.sin(a)*3.5);m.scale.x=-Math.sin(a)>=0?1:-1;});
    if(BOAT.on&&Math.hypot(BOAT.x-p.x,BOAT.z-p.z)<12&&!BOAT.seen['p'+j]){BOAT.seen['p'+j]=1;S.coins=(S.coins||0)+15;popText('A dolphin pod plays round the boat! +15 coins',{x:BOAT.x,y:2.2,z:BOAT.z});}});
  BOAT.seals.forEach((q,j)=>{if(BOAT.on&&Math.hypot(BOAT.x-q.x,BOAT.z-q.z)<10&&!BOAT.seen['s'+j]){BOAT.seen['s'+j]=1;S.coins=(S.coins||0)+15;popText('Seals sunning on the rocks! +15 coins',{x:BOAT.x,y:2.2,z:BOAT.z});}});
  BOAT.wh.forEach((w,i)=>{const s=Math.sin(t*.35+w.ph);w.m.position.set(w.x+Math.sin(t*.05+i)*6,s>.2?(s-.2)*.9-.35:-.6,w.z+Math.cos(t*.05+i)*6);w.m.visible=s>.2;
    const sp=s>.7;w.sp.visible=sp;if(sp)w.sp.position.set(w.m.position.x+1.2,.3,w.m.position.z);
    if(BOAT.on&&w.m.visible&&Math.hypot(BOAT.x-w.m.position.x,BOAT.z-w.m.position.z)<16&&!BOAT.seen['w'+i]){BOAT.seen['w'+i]=1;S.coins=(S.coins||0)+25;popText('A humpback whale! +25 coins',{x:BOAT.x,y:2.2,z:BOAT.z});}});}
function sea2Drive(dt){let mx=0,mz=0;if(keys.has('a')||keys.has('arrowleft'))mx-=1;if(keys.has('d')||keys.has('arrowright'))mx+=1;if(keys.has('w')||keys.has('arrowup'))mz-=1;if(keys.has('s')||keys.has('arrowdown'))mz+=1;
  if(joyId!==null){mx+=joyV.x;mz+=joyV.y;}if(MIR)mx=-mx;let m=Math.hypot(mx,mz);if(m>1){mx/=m;mz/=m;m=1;}
  const cy=Math.cos(yaw),sy=Math.sin(yaw),wx=mx*cy+mz*sy,wz=-mx*sy+mz*cy;
  if(m>.1){const th=Math.atan2(wz,wx);let dh=th-BOAT.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));BOAT.h+=Math.sign(dh)*Math.min(Math.abs(dh),2.4*dt);BOAT.v+=(7*m*Math.max(.2,Math.cos(dh))-BOAT.v)*Math.min(1,dt*1.2);}else BOAT.v*=Math.max(0,1-dt*.9);
  const nx=BOAT.x+Math.cos(BOAT.h)*BOAT.v*dt,nz=BOAT.z+Math.sin(BOAT.h)*BOAT.v*dt;if(sea2Water(nx,nz,BOAT.h)){BOAT.x=nx;BOAT.z=nz;}else{/* Paul (13 Nov): the boat got stuck along the coast; slide along the shore instead of bouncing when a nearby heading is clear */let ok=false;for(const da of[.35,-.35,.7,-.7,1.1,-1.1]){const a2=BOAT.h+da,sx=BOAT.x+Math.cos(a2)*BOAT.v*dt*.7,sz=BOAT.z+Math.sin(a2)*BOAT.v*dt*.7;if(sea2Water(sx,sz,a2)){BOAT.x=sx;BOAT.z=sz;BOAT.v*=.97;BOAT.h+=da*.04;ok=true;break;}}if(!ok)BOAT.v*=-.25;}
  player.x=BOAT.x;player.z=BOAT.z;player.moving=false;player.face=Math.cos(BOAT.h)>=0?1:-1;
  player.mesh.visible=true;player.bikeMesh.visible=false;setFrame(player.mesh,0);
  player.mesh.position.set(BOAT.x-Math.cos(BOAT.h)*.15,.34+Math.sin(performance.now()/700)*.04,BOAT.z-Math.sin(BOAT.h)*.15);player.mesh.scale.x=player.face;player.blob.position.set(0,-50,0);}
// leaving by fast travel or bus while out on the boat: the boat goes back to the jetty by itself and Kip travels on
function boatPark(){if(typeof BOAT==='undefined'||!BOAT.on)return;BOAT.on=false;BOAT.v=0;if(BOAT.home){BOAT.x=BOAT.home.x;BOAT.z=BOAT.home.z;BOAT.h=Math.PI;}if(BOAT.g){BOAT.g.position.x=BOAT.x;BOAT.g.position.z=BOAT.z;BOAT.g.rotation.y=-BOAT.h;}player.x=BOAT.dock.x;player.z=BOAT.dock.z;}
if(SEA2_ON){const _up=updatePlayer;updatePlayer=function(dt){if(BOAT.on){sea2Drive(dt);return;}_up(dt);};
  const _tg=cbdTargets;cbdTargets=function(T){_tg(T);if(!BOAT.g||zoneOf(player.x)!=='island')return;
    if(BOAT.on&&-landD(BOAT.x,BOAT.z)>6&&Math.abs(BOAT.v)<1.6)T.push({x:BOAT.x,z:BOAT.z,r:3,label:'Fish here for rare deep-water fish',act:()=>{BOAT.v=0;startFishing({name:'the deep water off Rottnest',zone:'island',boat:true});}});
    if(BOAT.on){const d=BOAT.dock;if(Math.hypot(BOAT.x-d.x,BOAT.z-d.z)<5)T.push({x:BOAT.x,z:BOAT.z,r:3,label:'Tie up at the jetty',act:()=>{BOAT.on=false;BOAT.v=0;player.x=d.x;player.z=d.z;}});}
    else T.push({x:BOAT.dock.x,z:BOAT.dock.z,r:1.6,label:'Take the tour boat round Rottnest (whales, dolphins, seals, rare fish)',act:()=>{BOAT.on=true;BOAT.v=0;popText('Drive with the joystick · come back to the jetty to tie up',{x:BOAT.x,y:2,z:BOAT.z});}});};}
