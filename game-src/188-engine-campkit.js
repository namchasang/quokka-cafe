// ---------- Camp Kit Engine (Paul Perth Library, lib/engines/campkit/campkit.js), embedded for the engine-built maps. Re-embed after engine changes (tools/engines-embed.py). ----------
/* Camp Kit Engine (Paul Perth Library, lib/engines/campkit/campkit.js) · Paul, Nov 2026
   The shared camp props of the Camp Kit Lab (lab.html), built into one group for any map: Kip's motorhome (door, awning with string lights,
   head lights), the dome tent (pitch / fold / blown away), the campfire (out / burning / embers, sparks, smoke, light), four folding chairs,
   log seat, kettle, pan, pot, marshmallow stick, food box, picnic table, barbecue shelter, bin, toilet, the camp sign, lantern, torch,
   blanket and the snack basket. Camp centre at 0,0 (the fire), flat ground at y 0, units metres.
   CAMPKIT_ENGINE.create({gammaOut, sign}) -> {root, tick(dt, dark 0..1), setFire, pitch, blow, toggleDoor, setAwn, setLights, setSign, POINTS, solids}
   gammaOut: the host has no sRGB output step (the game); colours then match the lab. The lab page still carries its own copy. */
(function(){'use strict';
function create(o){o=o||{};const GAMMA=!!o.gammaOut;const scene=new THREE.Group();scene.name='campkit';let T=0;
const W={windA:0,rainA:0},gains={};function btn(){}function say(){}
// ---------- toon materials (banded shade like the Rottnest toon look) ----------
const grad=(()=>{const d=new Uint8Array([90,90,90,255,170,170,170,255,255,255,255,255]);const t=new THREE.DataTexture(d,3,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.needsUpdate=true;return t;})();
const MC={};const M=(c,o)=>{const k=c+JSON.stringify(o||{});if(!o&&MC[k])return MC[k];const m=new THREE.MeshToonMaterial(Object.assign({color:c,gradientMap:grad},o||{}));if(!o)MC[k]=m;return m;};
const INK=new THREE.MeshBasicMaterial({color:0x1d1a24,side:THREE.BackSide});
function mesh(g,m,x,y,z,p){const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=o.receiveShadow=true;(p||scene).add(o);return o;}
function ink(o,s){o.traverse(c=>{if(c.isMesh&&!c.userData.noInk&&c.material!==INK&&!c.material.transparent){const e=new THREE.Mesh(c.geometry,INK);e.scale.setScalar(1+(s||.04));e.userData.noInk=1;e.castShadow=false;c.add(e);}});}
function cnv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=GAMMA?THREE.LinearEncoding:THREE.sRGBEncoding;t.anisotropy=4;return t;}
const pick=[];// clickable things: {obj, id, act}
function hot(obj,id,act){obj.traverse(c=>{if(c.isMesh)c.userData.hot={id,act};});pick.push(obj);}
// ---------- 1. Kip's camper van: an Australian-style motorhome (white box body, bed over the cab, side swoosh), no real make or logo ----------
// Paul, 22 Nov 2026: "camper van ที่ออสเตรเลียจะทรงประมาณนี้" (two photos of a rental motorhome). Entry door and awning on the kerb (left) side.
const VAN={col:0,pat:0,door:false,lights:false,awn:false};
const VANCOL=[0x4a4f58,0x2f9e98,0xe07f34,0xd45d68,0x6f9a4e];
const van=new THREE.Group();van.position.set(-6.4,0,-3.6);van.rotation.y=.5;scene.add(van);
const vb=new THREE.Group();vb.rotation.y=Math.PI;van.add(vb);/* built with the front at +x; turned so the kerb side faces the camp */
function ext(pts,depth,mat,bev,par){const sh=new THREE.Shape(pts.map(p=>new THREE.Vector2(p[0],p[1])));
  const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:!!bev,bevelSize:bev||0,bevelThickness:bev||0,bevelSegments:2,curveSegments:6});
  g.translate(0,0,-depth/2);g.computeBoundingBox();const c=new THREE.Vector3();g.boundingBox.getCenter(c);g.translate(-c.x,-c.y,-c.z);
  const m=mesh(g,mat,c.x,c.y,c.z,par||vb);return m;}
const WHITE=M(0xf7f6f1),DARK=M(0x2c2f36),TRIM=M(0x8d939c),glass=M(0x22344a);
const BX0=-3.3,BX1=1.55,BY0=.6,BY1=3.0;
function vanSkin(){const t=cnv(1024,512,(g,w,h)=>{const c='#'+new THREE.Color(VANCOL[VAN.col]).getHexString(),X=x=>(x-BX0)/(BX1-BX0)*w,Y=y=>(BY1-y)/(BY1-BY0)*h;
  g.fillStyle='#f7f6f1';g.fillRect(0,0,w,h);g.fillStyle='#e3e2dc';g.fillRect(0,Y(.78),w,h);/* lower skirt */
  g.strokeStyle='#d2d1cb';g.lineWidth=3;[[-3.0,.82,.7,.55],[-1.55,.82,.55,.45],[.55,1.0,.35,.4]].forEach(([x,y,ww,hh])=>{g.strokeRect(X(x),Y(y+hh),X(x+ww)-X(x),Y(y)-Y(y+hh));});/* locker hatches */
  if(VAN.pat===0){/* two-tone swoosh from the rear, tapering forward */
    const sw=(y0,th,col,len)=>{g.fillStyle=col;g.beginPath();g.moveTo(X(BX0),Y(y0+th));g.bezierCurveTo(X(-2.2),Y(y0+th*1.1),X(-1.2),Y(y0+th*.2),X(BX0+len),Y(y0-.05));g.bezierCurveTo(X(-1.4),Y(y0-th*.3),X(-2.4),Y(y0),X(BX0),Y(y0));g.fill();};
    sw(1.3,.32,'#b9bdc4',3.6);sw(1.18,.18,c,2.9);sw(1.02,.1,'#2c2f36',2.2);}
  if(VAN.pat===1){[c,'#f2b632','#d9783e'].forEach((k,i)=>{g.fillStyle=k;g.fillRect(0,Y(1.45-i*.16),w,Y(0)-Y(.1));});}
  if(VAN.pat===2){for(let i=0;i<14;i++){const x=30+i*70+(i%2)*14,y=Y(1.15)+(i%3)*26;g.fillStyle=[c,'#ffd84a','#f4a6c8'][i%3];for(let p=0;p<5;p++){g.beginPath();g.arc(x+Math.cos(p*1.26)*13,y+Math.sin(p*1.26)*13,10,0,7);g.fill();}g.fillStyle='#e8a020';g.beginPath();g.arc(x,y,7,0,7);g.fill();}}
  if(VAN.pat===3){g.fillStyle=c;for(let i=0;i<16;i++){g.beginPath();g.moveTo(i*70,Y(.78));g.quadraticCurveTo(i*70+35,Y(1.35),i*70+70,Y(.78));g.fill();}}});
  t.repeat.set(1/(BX1-BX0),1/(BY1-BY0));t.offset.set(-BX0/(BX1-BX0),-BY0/(BY1-BY0));return t;}
let vanMat=M(0xffffff,{map:vanSkin()});
function vanRepaint(){vanMat.map=vanSkin();vanMat.needsUpdate=true;}
// box body with a rounded rear roof edge; the sides carry the skin
ext([[BX0,BY0],[BX1,BY0],[BX1,BY1],[BX0+.3,BY1],[BX0,BY1-.3]],2.2,[vanMat,WHITE],.05);
// bed over the cab (the "peak"), rounded nose
ext([[1.5,2.18],[2.55,2.18],[2.95,2.33],[3.12,2.62],[3.02,2.92],[2.7,3.0],[1.5,3.0]],2.2,WHITE,.05);
// cab: hood, sloped windscreen, roof under the peak
ext([[1.55,.5],[3.3,.5],[3.3,1.12],[3.18,1.3],[2.82,1.36],[2.36,2.16],[1.55,2.16]],1.95,WHITE,.06);
const ws=mesh(new THREE.BoxGeometry(.95,.04,1.8),glass,2.6,1.77,0,vb);ws.rotation.z=Math.PI/2+.5;ws.position.x+=.03;ws.position.y+=.02;ws.rotation.z=-(Math.PI/2-.5)+Math.PI;
[-1,1].forEach(s=>{const sw=ext([[1.65,1.38],[2.64,1.38],[2.28,2.04],[1.65,2.04]],.02,glass,0);sw.position.z=s*1.045;/* cab side windows */
  mesh(new THREE.BoxGeometry(1.75,.22,.04),DARK,2.42,.62,s*1.055,vb);/* dark lower trim */
  const arm=mesh(new THREE.BoxGeometry(.06,.06,.22),DARK,2.7,1.62,s*1.13,vb);mesh(new THREE.BoxGeometry(.08,.32,.16),DARK,2.7,1.62,s*1.26,vb);/* mirrors */
  mesh(new THREE.BoxGeometry(.5,.34,.04),glass,2.15,2.62,s*1.16,vb);/* small window on the peak */
  mesh(new THREE.BoxGeometry(.02,.02,.02),DARK,2.05,1.5,s*1.0,vb);});
mesh(new THREE.BoxGeometry(.16,.36,2.02),DARK,3.39,.66,0,vb);/* front bumper */
mesh(new THREE.BoxGeometry(.06,.3,1.0),DARK,3.38,1.0,0,vb);[.93,1.03].forEach(y=>mesh(new THREE.BoxGeometry(.065,.025,.9),TRIM,3.39,y,0,vb));/* grille, no badge */
const plate=(x,r)=>{const p=mesh(new THREE.PlaneGeometry(.52,.13),new THREE.MeshBasicMaterial({map:cnv(256,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.strokeStyle='#223';g.lineWidth=5;g.strokeRect(3,3,w-6,h-6);g.fillStyle='#223';g.font='700 40px monospace';g.textAlign='center';g.fillText('KIP·CAFE',w/2,h*.72);})}),x,.62,0,vb);p.rotation.y=r;p.castShadow=false;p.userData.noInk=1;};
plate(3.48,Math.PI/2);plate(BX0-.07,-Math.PI/2);
const hlMat=new THREE.MeshToonMaterial({color:0xfff6d0,gradientMap:grad,emissive:0x000000});
[.72,-.72].forEach(z=>{mesh(new THREE.BoxGeometry(.06,.16,.34),hlMat,3.38,1.13,z,vb);mesh(new THREE.BoxGeometry(.06,.07,.1),M(0xf0a030),3.38,1.13,z*1.36,vb);});
const beams=[.72,-.72].map(z=>{const s=new THREE.SpotLight(0xfff2c8,0,40,.42,.5,1.2);s.position.set(3.4,1.13,z);const tg=new THREE.Object3D();tg.position.set(15,.2,z*2);vb.add(s,tg);s.target=tg;return s;});
[.9,-.9].forEach(z=>{mesh(new THREE.BoxGeometry(.06,.5,.16),M(0xc8342c),BX0-.06,1.15,z,vb);mesh(new THREE.BoxGeometry(.06,.14,.16),M(0xf0a030),BX0-.06,.82,z,vb);});
mesh(new THREE.BoxGeometry(.9,.26,.8),M(0xe6e6e2),-.6,3.16,0,vb);mesh(new THREE.BoxGeometry(.55,.1,.55),M(0xcfd2d6),-2.3,3.08,0,vb);/* roof cooler + hatch */
mesh(new THREE.BoxGeometry(BX1-BX0-.1,.12,2.12),DARK,(BX0+BX1)/2,.56,0,vb);/* chassis under the body */
// wheels: single at the front, twin at the back
const WH=M(0x22232a),HUB=M(0xd8d8da);
[[2.55,1.0,.3],[2.55,-1.0,.3],[-1.55,.98,.42],[-1.55,-.98,.42]].forEach(([x,z,wd])=>{const w=mesh(new THREE.CylinderGeometry(.43,.43,wd,18),WH,x,.43,z,vb);w.rotation.x=Math.PI/2;const hb=mesh(new THREE.CylinderGeometry(.2,.2,wd+.02,10),HUB,x,.43,z,vb);hb.rotation.x=Math.PI/2;});
// side windows: dark tinted with a frame (left = kerb side at -z, right at +z)
const win=(x0,x1,y0,y1,z)=>{mesh(new THREE.BoxGeometry(x1-x0+.08,y1-y0+.08,.03),DARK,(x0+x1)/2,(y0+y1)/2,z,vb);mesh(new THREE.BoxGeometry(x1-x0,y1-y0,.04),glass,(x0+x1)/2,(y0+y1)/2,z*1.002,vb);};
win(-.95,.35,1.65,2.3,-1.16);win(-2.85,-1.95,1.7,2.3,-1.16);win(-1.2,.55,1.6,2.3,1.16);win(-2.85,-2.25,1.75,2.25,1.16);
// the doorway (seen when the door opens): Dad's wooden shelves, the fold bed, the carved sign from chapter 12
const DX0=.65,DX1=1.38,DY0=.72,DY1=2.58;
mesh(new THREE.BoxGeometry(DX1-DX0,DY1-DY0,.02),M(0x3a2c24),(DX0+DX1)/2,(DY0+DY1)/2,-1.165,vb);
const WOOD=M(0xc89a62),WOOD2=M(0xa97a48);
[1.55,1.95].forEach(y=>mesh(new THREE.BoxGeometry(.6,.05,.06),WOOD,1.02,y,-1.18,vb));
[[.82,1.62,0xe8d9b0],[.95,1.62,0x6fa8c8],[1.12,2.02,0xd8b070]].forEach(([x,y,c])=>mesh(new THREE.BoxGeometry(.09,.14,.04),M(c),x,y,-1.185,vb));
mesh(new THREE.BoxGeometry(.6,.16,.05),WOOD2,1.02,.95,-1.18,vb);mesh(new THREE.BoxGeometry(.58,.08,.06),M(0x6f8fc0),1.02,1.06,-1.185,vb);/* fold bed edge + blanket */
const carved=mesh(new THREE.PlaneGeometry(.56,.19),new THREE.MeshLambertMaterial({map:cnv(256,86,(g,w,h)=>{g.fillStyle='#b8834e';g.fillRect(0,0,w,h);g.strokeStyle='#7a5230';g.lineWidth=6;g.strokeRect(4,4,w-8,h-8);g.fillStyle='#5a3a20';g.font='700 34px Georgia,serif';g.textAlign='center';g.fillText("Kip's Café",w/2,h*.66);})}),1.02,2.3,-1.19,vb);
carved.rotation.y=Math.PI;carved.castShadow=false;carved.userData.noInk=1;
// entry door, hinged at its front edge, opens outward; a step slides out
const door=new THREE.Group();door.position.set(DX1+.02,0,-1.205);vb.add(door);
mesh(new THREE.BoxGeometry(DX1-DX0+.04,DY1-DY0+.04,.05),WHITE,-(DX1-DX0)/2-.02,(DY0+DY1)/2,0,door);
mesh(new THREE.BoxGeometry(.4,.55,.03),glass,-(DX1-DX0)/2-.02,2.15,-.03,door);mesh(new THREE.BoxGeometry(.05,.14,.04),TRIM,-(DX1-DX0)+.1,1.5,-.04,door);
const step=mesh(new THREE.BoxGeometry(.6,.05,.3),TRIM,(DX0+DX1)/2,.42,-1.0,vb);
// roll-out awning with string lights (photo 2)
const awnCase=mesh(new THREE.BoxGeometry(4.2,.12,.14),DARK,-.95,2.88,-1.2,vb);
const awn=new THREE.Group();awn.position.set(-.95,2.86,-1.2);vb.add(awn);
const canvasAwn=mesh(new THREE.BoxGeometry(4.1,.03,1),M(0xffffff,{map:cnv(256,64,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#e9e6dd':'#5a5f68';g.fillRect(0,i*h/8,w,h/8);}})}),0,0,-.5,awn);
const legs=[-1.95,1.95].map(x=>mesh(new THREE.CylinderGeometry(.025,.025,1,6),TRIM,x,0,-1,awn));
const bulbs=[];for(let i=0;i<14;i++){const b=mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:0x8a7a50}),-1.95+i*3.9/13,-.12-Math.sin(i/13*Math.PI*3)*.06,-1,awn);b.castShadow=false;b.userData.noInk=1;bulbs.push(b);}
const awnGlow=new THREE.PointLight(0xffc77a,0,7,2);awnGlow.position.set(0,-.3,-1.3);awn.add(awnGlow);
let awnK=0;
function vanTick(dt,night){awnK+=((VAN.awn?1:0)-awnK)*Math.min(1,dt*3);const d=.02+awnK*2.3;
  canvasAwn.scale.z=d;canvasAwn.position.z=-d/2;canvasAwn.position.y=-awnK*.2;canvasAwn.rotation.x=-awnK*.17;
  legs.forEach(l=>{l.visible=awnK>.6;l.position.z=-d;const hh=2.86-awnK*.42;l.scale.y=hh;l.position.y=-hh/2-awnK*.4;});
  const on=awnK>.6&&night;bulbs.forEach((b,i)=>{b.visible=awnK>.6;b.position.z=-d+.02;b.position.y=-awnK*.42-.06-Math.sin(i/13*Math.PI*3)*.06;b.material.color.setHex(on?[0xffe08a,0xffb870,0xfff3c0][i%3]:0x8a7a50);});
  awnGlow.intensity=on?1.3:0;awnGlow.position.z=-d*.6;
  door.rotation.y+=((VAN.door?-1.75:0)-door.rotation.y)*Math.min(1,dt*4);step.position.z=-1.0-(VAN.door?.3:0);}
hot(van,'camp_van',()=>toggleDoor());ink(vb,.02);

// ---------- 2. dome tent for two: pitch animation, blown away by the wind, 4 pegs ----------
const TENT={up:1,goal:1,blown:0};
const tent=new THREE.Group();tent.position.set(4.4,0,-3.2);tent.rotation.y=-.4;scene.add(tent);
const tentBody=new THREE.Group();tent.add(tentBody);
const fly=mesh(new THREE.SphereGeometry(1.25,28,14,0,Math.PI*2,0,Math.PI/2),M(0xe8823a),0,0,0,tentBody);fly.scale.set(1.25,1.05,1);
const tdoor=mesh(new THREE.CircleGeometry(.62,18,0,Math.PI),M(0x5a2f18,{side:THREE.DoubleSide}),1.5,.02,0,tentBody);tdoor.rotation.set(0,Math.PI/2,0);tdoor.rotation.order='YXZ';tdoor.rotation.x=-.28;tdoor.scale.y=1.25;// zipped door
mesh(new THREE.SphereGeometry(1.27,20,8,0,Math.PI*2,0,.32),M(0x3d7fae),0,0,0,tentBody).scale.set(1.25,1.05,1);
const poleM=M(0x2b2b30);[.78,-.78].forEach(r=>{const p=mesh(new THREE.TorusGeometry(1.3,.025,6,24,Math.PI),poleM,0,0,0,tentBody);p.rotation.y=r;p.scale.set(1.2,1.03,1);});
const pegs=[];[[1.7,1.3],[-1.7,1.3],[1.7,-1.3],[-1.7,-1.3]].forEach(([x,z],i)=>{const p=mesh(new THREE.CylinderGeometry(.03,.01,.3,5),M(0xd8d8dc),x,.1,z,tent);p.rotation.z=.4*Math.sign(x);
  const line=mesh(new THREE.CylinderGeometry(.008,.008,1,3),M(0xf0f0f0),x*.7,.45,z*.75,tentBody);line.lookAt(tent.localToWorld(new THREE.Vector3(x,.1,z)));line.rotateX(Math.PI/2);pegs.push({id:'peg_'+(i+1),p});});
hot(tent,'camp_tent',()=>pitch());ink(tentBody,.02);
let blowT=0;const snag=new THREE.Vector3(-11.5,0,3.5);// tent_snag: the bush the tent ends up in

// ---------- 3. campfire: stone ring, logs, layered flame cards, sparks, smoke, flickering light ----------
const FIRE={state:1};
const fire=new THREE.Group();scene.add(fire);
const STONE=M(0x9a938a),STONE2=M(0x837c74);
for(let i=0;i<10;i++){const a=i/10*Math.PI*2,s=mesh(new THREE.DodecahedronGeometry(.24,0),i%2?STONE:STONE2,Math.cos(a)*.78,.1,Math.sin(a)*.78,fire);s.scale.set(1.1,.6,.9);s.rotation.y=a*3;}
const logM=M(0x6b4a2c),charM=M(0x2a2220);const logs=[];
for(let i=0;i<4;i++){const l=mesh(new THREE.CylinderGeometry(.09,.11,1.1,7),logM,0,.22,0,fire);l.rotation.set(0,i*Math.PI/4*2+.3,1.05);logs.push(l);}
const flameTex=cnv(128,256,(g,w,h)=>{const gr=g.createRadialGradient(w/2,h*.78,4,w/2,h*.7,w*.55);gr.addColorStop(0,'rgba(255,250,210,1)');gr.addColorStop(.3,'rgba(255,200,70,.95)');gr.addColorStop(.65,'rgba(255,110,30,.7)');gr.addColorStop(1,'rgba(255,60,10,0)');
  g.fillStyle=gr;g.beginPath();g.moveTo(w/2,4);g.bezierCurveTo(w*.95,h*.45,w*.95,h*.95,w/2,h-4);g.bezierCurveTo(w*.05,h*.95,w*.05,h*.45,w/2,4);g.fill();});
const flames=[];[[1,.0,0xffffff],[.75,.4,0xffd070],[.5,.9,0xff9040]].forEach(([s,ph,c],li)=>{for(let k=0;k<3;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.9*s,1.5*s).translate(0,.75*s,0),new THREE.MeshBasicMaterial({map:flameTex,color:c,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
  m.position.set((li-1)*.08,.18,(k-1)*.06);m.rotation.y=k*Math.PI/3;fire.add(m);flames.push({m,ph:ph+k,s});}});
const emberM=new THREE.MeshBasicMaterial({color:0xff4a1a,transparent:true,opacity:0});const embers=new THREE.Mesh(new THREE.CircleGeometry(.5,16),emberM);embers.rotation.x=-Math.PI/2;embers.position.y=.13;fire.add(embers);
const fLight=new THREE.PointLight(0xff8a3a,0,14,1.6);fLight.position.y=.9;fire.add(fLight);
const NS=60,sparkG=new THREE.BufferGeometry(),sp=new Float32Array(NS*3),spv=[];for(let i=0;i<NS;i++){spv.push({l:Math.random(),x:0,z:0});}
sparkG.setAttribute('position',new THREE.BufferAttribute(sp,3));
const sparks=new THREE.Points(sparkG,new THREE.PointsMaterial({color:0xffb050,size:.07,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));fire.add(sparks);
const smokeTex=cnv(64,64,(g,w,h)=>{const gr=g.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(200,200,205,.55)');gr.addColorStop(1,'rgba(200,200,205,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);});
const smoke=[];for(let i=0;i<10;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,transparent:true,depthWrite:false,opacity:0}));s.userData.l=i/10;fire.add(s);smoke.push(s);}
hot(fire,'camp_fire',()=>setFire((FIRE.state+1)%3));

// ---------- 4. round the fire: 4 folding chairs, log seat, kettle, pan, pot, marshmallow stick, food box ----------
const FRAME=M(0x3b3f48);
function chair(x,z,rot,c){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);
  [[.25,.25],[-.25,.25],[.25,-.25],[-.25,-.25]].forEach(([a,b])=>{const l=mesh(new THREE.CylinderGeometry(.02,.02,.62,5),FRAME,a,.3,b,g);l.rotation.x=b>0?.25:-.25;});
  mesh(new THREE.BoxGeometry(.56,.04,.5),M(c),0,.48,0,g);const bk=mesh(new THREE.BoxGeometry(.56,.5,.04),M(c),0,.76,-.27,g);bk.rotation.x=-.18;
  [.29,-.29].forEach(a=>mesh(new THREE.BoxGeometry(.05,.04,.46),FRAME,a,.66,0,g));ink(g,.03);return g;}
[[0x3d7fae,2.3,.9],[0xd8634a,.6,2.4],[0x5f9442,-2.2,1.2],[0xf2b632,-1.6,-1.9]].forEach(([c,x,z])=>chair(x,z,Math.atan2(-x,-z),c));
const seat=mesh(new THREE.CylinderGeometry(.28,.3,2.2,10),M(0x8a6238),1.9,.27,-1.9);seat.rotation.set(0,Math.atan2(1.9,-1.9)+Math.PI/2,Math.PI/2);
const cook=new THREE.Group();cook.position.set(.95,0,-.35);scene.add(cook);
const IRON=M(0x3a3a40),STEEL=M(0xb8bcc4);
const kettle=mesh(new THREE.SphereGeometry(.17,14,10),STEEL,0,.42,0,cook);kettle.scale.y=.8;mesh(new THREE.CylinderGeometry(.02,.03,.18,6),STEEL,.16,.46,0,cook).rotation.z=-.9;
mesh(new THREE.TorusGeometry(.11,.012,5,12,Math.PI),IRON,0,.53,0,cook);
const grill=mesh(new THREE.BoxGeometry(.8,.03,.6),IRON,-.6,.3,.35);
const pan=mesh(new THREE.CylinderGeometry(.22,.2,.06,16),IRON,-.65,.35,.3);mesh(new THREE.BoxGeometry(.38,.03,.05),IRON,-.33,.36,.3);
const pot=mesh(new THREE.CylinderGeometry(.15,.14,.2,14),M(0x9a4a30),-.2,.3,-.75);
const stick=new THREE.Group();stick.position.set(1.4,.5,1);stick.rotation.set(0,2.4,.55);scene.add(stick);
mesh(new THREE.CylinderGeometry(.012,.015,1.3,4),M(0x9a7040),0,0,0,stick).rotation.z=Math.PI/2;const mm=mesh(new THREE.CylinderGeometry(.05,.05,.08,10),M(0xfff6ea),-.65,0,0,stick);mm.rotation.z=Math.PI/2;
// food box (lid opens: the possum scene)
const box=new THREE.Group();box.position.set(-2.9,0,-.4);box.rotation.y=.4;scene.add(box);
mesh(new THREE.BoxGeometry(.8,.45,.5),M(0x4f8fbf),0,.23,0,box);const lid=new THREE.Group();lid.position.set(0,.46,-.25);box.add(lid);
mesh(new THREE.BoxGeometry(.84,.08,.54),M(0xf3f3ef),0,.04,.25,lid);mesh(new THREE.BoxGeometry(.6,.02,.3),M(0xe8823a),0,.24,.05,box);
hot(box,'camp_food_box',()=>{BOX.open=!BOX.open;btn('#bBox',BOX.open);});const BOX={open:false};ink(box,.03);
hot(cook,'camp_cook',()=>say('camp_cook: ต้มน้ำ / ทอดไข่ / ปิ้งมาร์ชเมลโลว์'));

// ---------- 5. picnic table, barbecue shelter, bin, toilet, camp sign ----------
const table=new THREE.Group();table.position.set(6.8,0,3.6);table.rotation.y=-.3;scene.add(table);
for(let i=0;i<5;i++)mesh(new THREE.BoxGeometry(1.9,.06,.17),WOOD,0,.76,-.36+i*.18,table);
[-.58,.58].forEach(z=>{for(let i=0;i<2;i++)mesh(new THREE.BoxGeometry(1.9,.05,.16),WOOD,0,.44,z*1.0+(z>0?.08:-.08)+(i?.0:0),table);});
[-.75,.75].forEach(x=>{[1,-1].forEach(s=>{const l=mesh(new THREE.BoxGeometry(.08,.8,.08),WOOD2,x,.4,0,table);l.rotation.x=s*.5;});mesh(new THREE.BoxGeometry(.08,.06,1.4),WOOD2,x,.42,0,table);});
ink(table,.03);
const bbq=new THREE.Group();bbq.position.set(10.5,0,-3);bbq.rotation.y=-.9;scene.add(bbq);
[[1.2,.9],[-1.2,.9],[1.2,-.9],[-1.2,-.9]].forEach(([x,z])=>mesh(new THREE.BoxGeometry(.12,2.3,.12),WOOD2,x,1.15,z,bbq));
[1,-1].forEach(s=>{const r=mesh(new THREE.BoxGeometry(3,.08,1.3),M(0x6f8a8a),0,2.55,s*.55,bbq);r.rotation.x=s*.42;});
mesh(new THREE.BoxGeometry(1.4,.8,.7),M(0xb7b0a4),0,.4,0,bbq);mesh(new THREE.BoxGeometry(1,.05,.5),STEEL,0,.83,0,bbq);ink(bbq,.025);
const bin=mesh(new THREE.CylinderGeometry(.32,.3,.85,14),M(0x3f7a4a),8.6,.43,-6.6);mesh(new THREE.CylinderGeometry(.35,.35,.06,14),M(0xf2b632),0,.45,0,bin);
const loo=new THREE.Group();loo.position.set(-9,0,-8.2);loo.rotation.y=.6;scene.add(loo);
mesh(new THREE.BoxGeometry(1.4,2.2,1.4),M(0xe4dccb),0,1.1,0,loo);const lr=mesh(new THREE.BoxGeometry(1.6,.1,1.7),M(0x6f8a8a),0,2.3,0,loo);lr.rotation.x=.1;
mesh(new THREE.BoxGeometry(.7,1.7,.05),M(0x3d7fae),0,.9,.71,loo);mesh(new THREE.BoxGeometry(.6,.12,.03),M(0x1d2a3a),0,1.95,.72,loo);ink(loo,.02);
let signText='White Dune Camp';
const signMat=new THREE.MeshToonMaterial({gradientMap:grad});
function drawSign(){signMat.map=cnv(512,170,(g,w,h)=>{g.fillStyle='#b8834e';g.fillRect(0,0,w,h);for(let i=0;i<7;i++){g.fillStyle='rgba(90,58,32,.18)';g.fillRect(0,i*26+6,w,3);}
  g.strokeStyle='#6b4524';g.lineWidth=10;g.strokeRect(5,5,w-10,h-10);g.fillStyle='#3d2614';let fs=66;g.font=`800 ${fs}px Georgia,serif`;while(g.measureText(signText).width>w-50&&fs>24){fs-=4;g.font=`800 ${fs}px Georgia,serif`;}
  g.textAlign='center';g.textBaseline='middle';g.fillText(signText,w/2,h/2+4);});signMat.needsUpdate=true;}
drawSign();
const sign=new THREE.Group();sign.position.set(9.6,0,6.2);sign.rotation.y=-.9;scene.add(sign);
[-.95,.95].forEach(x=>mesh(new THREE.CylinderGeometry(.08,.09,2,7),WOOD2,x,1,0,sign));mesh(new THREE.BoxGeometry(2.3,.78,.08),[WOOD,WOOD,WOOD,WOOD,signMat,WOOD],0,1.45,0,sign);
hot(sign,'camp_sign',()=>editSign());ink(sign,.02);

// ---------- 6. lantern, torch, blanket, snack basket (a chick can ride in it) ----------
const lantern=new THREE.Group();lantern.position.set(6.6,.79,3.4);scene.add(lantern);
const lgl=new THREE.MeshToonMaterial({color:0xfff2b0,gradientMap:grad,emissive:0x000000});
mesh(new THREE.CylinderGeometry(.08,.08,.2,8),lgl,0,.13,0,lantern);mesh(new THREE.CylinderGeometry(.1,.11,.04,8),IRON,0,.02,0,lantern);mesh(new THREE.ConeGeometry(.11,.08,8),IRON,0,.27,0,lantern);mesh(new THREE.TorusGeometry(.06,.01,4,10,Math.PI),IRON,0,.31,0,lantern);
const lLight=new THREE.PointLight(0xffd890,0,7,1.8);lLight.position.y=.15;lantern.add(lLight);
const torch=new THREE.Group();torch.position.set(7.3,.82,3.1);torch.rotation.y=2.4;scene.add(torch);
mesh(new THREE.CylinderGeometry(.035,.035,.24,8),M(0xd8634a),0,0,0,torch).rotation.z=Math.PI/2;mesh(new THREE.CylinderGeometry(.05,.036,.06,8),STEEL,.14,0,0,torch).rotation.z=Math.PI/2;
const tBeam=new THREE.SpotLight(0xf4f8ff,0,18,.3,.4,1.5);tBeam.position.set(.17,0,0);const tTg=new THREE.Object3D();tTg.position.set(6,-.7,0);torch.add(tBeam,tTg);tBeam.target=tTg;
const blanket=mesh(new THREE.PlaneGeometry(1.5,1,6,4),new THREE.MeshToonMaterial({gradientMap:grad,side:THREE.DoubleSide,map:cnv(128,128,(g,w,h)=>{g.fillStyle='#c84a3a';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,230,180,.5)';for(let i=0;i<8;i++){g.fillRect(i*16,0,5,h);g.fillRect(0,i*16,w,5);}})}),1.9,.58,-1.9);
blanket.rotation.set(-Math.PI/2+.1,0,.8);
const basket=new THREE.Group();basket.position.set(-1.2,0,2.6);scene.add(basket);
mesh(new THREE.CylinderGeometry(.3,.24,.3,14,1,true),M(0xc8a060,{side:THREE.DoubleSide}),0,.15,0,basket);mesh(new THREE.CircleGeometry(.24,14),M(0xa07a40),0,.02,0,basket).rotation.x=-Math.PI/2;
mesh(new THREE.TorusGeometry(.27,.02,5,16,Math.PI),M(0xa07a40),0,.3,0,basket);mesh(new THREE.BoxGeometry(.5,.06,.4),M(0xf4f0e8),0,.22,0,basket);
const chick=new THREE.Group();chick.position.set(0,.32,0);chick.visible=false;basket.add(chick);
mesh(new THREE.SphereGeometry(.11,12,10),M(0xffe07a),0,0,0,chick);mesh(new THREE.SphereGeometry(.075,10,8),M(0xffe07a),.07,.1,0,chick);mesh(new THREE.ConeGeometry(.025,.06,6),M(0xf29a30),.15,.1,0,chick).rotation.z=-Math.PI/2;
[.04,-.04].forEach(z=>mesh(new THREE.SphereGeometry(.013,6,4),M(0x1d1a24),.12,.13,z,chick));ink(chick,.06);

if(o.sign){signText=o.sign;drawSign();}
const TORCH={on:false};
function setFire(s){FIRE.state=s;}function toggleDoor(v){VAN.door=v==null?!VAN.door:v;}function setAwn(v){VAN.awn=v==null?!VAN.awn:!!v;}function setLights(v){VAN.lights=v==null?!VAN.lights:v;}
function pitch(v){TENT.blown=0;blowT=0;tent.position.set(4.4,0,-3.2);tent.rotation.set(0,-.4,0);TENT.goal=v==null?(TENT.goal?0:1):v;if(TENT.goal)TENT.up=Math.min(TENT.up,.02);}
function blow(){if(!TENT.up)pitch(1);TENT.blown=1;blowT=0;}
function editSign(){}
if(GAMMA){const seen=new Set();scene.traverse(c=>{const ms=c.material?(Array.isArray(c.material)?c.material:[c.material]):[];ms.forEach(m=>{if(seen.has(m)||m===INK)return;seen.add(m);if(m.color)m.color.convertLinearToSRGB();});});}
const _w=new THREE.Vector3();let CAM=o.camera||null;
function tick(dt,dark,camera){T+=dt;dark=dark||0;if(camera)CAM=camera;
  // fire
  const fs=FIRE.state;flames.forEach((f,i)=>{const on=fs===1;const fl=.85+Math.sin(T*9+f.ph*3)*.12+Math.sin(T*23+i)*.06;f.m.visible=on;f.m.scale.set(1,fl,1);f.m.rotation.z=-W.windA*.35+Math.sin(T*3+i)*.04;if(CAM){f.m.getWorldPosition(_w);f.m.lookAt(CAM.position.x,_w.y,CAM.position.z);}f.m.rotateZ(W.windA*.35);});
  fLight.intensity=(fs===1?2.2+Math.sin(T*13)*.25+Math.sin(T*31)*.15:fs===2?.5+Math.sin(T*2)*.08:0)*(.35+dark*.9);
  emberM.opacity=fs===2?.55+Math.sin(T*2.2)*.15:fs===1?.25:0;logs.forEach(l=>l.material=fs===0?charM:logM);
  for(let i=0;i<NS;i++){const s=spv[i];s.l+=dt*(.6+i%5*.1);if(s.l>1){s.l=0;s.x=(Math.random()-.5)*.4;s.z=(Math.random()-.5)*.4;}const on=fs===1;sp.set([s.x+(s.l*W.windA*1.5)+Math.sin(T*3+i)*.05*s.l,on?.3+s.l*2.2:-9,s.z],i*3);}
  sparkG.attributes.position.needsUpdate=true;
  smoke.forEach((s,i)=>{s.userData.l+=dt*.18;if(s.userData.l>1)s.userData.l=0;const l=s.userData.l;s.position.set(l*W.windA*3+Math.sin(T*.7+i)*.2*l,.6+l*3.4,Math.cos(T*.5+i)*.15*l);s.scale.setScalar(.5+l*1.8);
    s.material.opacity=(fs===0?0:fs===2?.5:.32)*Math.sin(l*Math.PI)*(1-W.rainA*.5);});
  if(gains.fire)gains.fire.gain.value=(fs===1?.025+Math.random()*.03:0);
  // van
  vanTick(dt,dark>.3);
  beams.forEach(b=>b.intensity=VAN.lights?2.6:0);hlMat.emissive.setHex(VAN.lights?0xfff0b0:0x000000);
  lgl.emissive.setHex(dark>.3?0xffc860:0x000000);lLight.intensity=dark>.3?1.3*dark:0;tBeam.intensity=TORCH.on?3:0;
  lid.rotation.x+=((BOX.open?-1.9:0)-lid.rotation.x)*Math.min(1,dt*6);
  // tent: pitch / fold / blown into the bush
  TENT.up+=((TENT.goal?1:0)-TENT.up)*Math.min(1,dt*1.6);const u=TENT.up;tentBody.scale.set(.3+.7*u,Math.max(.03,u*u*(3-2*u)),.3+.7*u);
  tentBody.rotation.z=W.windA*Math.sin(T*6)*.012;tentBody.scale.x*=1+W.windA*Math.sin(T*9)*.015;
  if(TENT.blown){blowT=Math.min(1,blowT+dt*.35);const p0=new THREE.Vector3(4.4,0,-3.2),e=blowT*blowT*(3-2*blowT);
    tent.position.lerpVectors(p0,snag,e);tent.position.y=Math.sin(blowT*Math.PI)*2.2+e*.35;tent.rotation.z=Math.sin(blowT*Math.PI*2)*.6;tent.rotation.x=e*.5;tent.rotation.y=-.4+e*2.5;}
  }
/* footprints on the camp floor (centre x, z, radius) so a host can keep walkers out of the van, tent, shelter and toilet */
const solids=[[-6.4,-3.6,2.7],[4.4,-3.2,1.7],[0,0,1.0],[6.8,3.6,1.2],[10.5,-3,1.7],[-9,-8.2,1.0],[8.6,-6.6,.45],[-2.9,-.4,.5],[9.6,6.2,.4]];
return{root:scene,tick,setFire,pitch,blow,toggleDoor,setAwn,setLights,setSign:t=>{signText=t;drawSign();},POINTS:{van,tent,fire,cook,box,sign},solids,pick};}
window.CAMPKIT_ENGINE={create};})();
