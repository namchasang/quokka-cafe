/* Anime Character Engine (Paul Perth Library, lib/engines/characters/anime.js) · Paul, 23 Nov 2026
   "ตัวละครในเกม npc ต่าง ๆ ออกแบบให้สมจริงกว่านี้ แนว 3D cartoon" + his reference pictures of an anime-style 3D RPG: taller figures
   (head about a fifth of the height), two-part arms and legs that bend at the knee and elbow, layered clothes with trim, belts, pouches
   and boots, big anime eyes with two highlights, a crisp two-tone cel shade with warm shadows, a soft rim light and a thin ink outline.
   Paul chose: the cast stays animals (quokka, pelican, koala, gull, owl, osprey, possum, sea turtle), drawn in that style.
   ANIME_CHARS.create(spec, {gammaOut}) -> {root, update(dt, speed), spec}. speed 0 idle, 1 walk, 2 run. Units: metres, feet at y=0, facing +z.
   Fictional designs only. */
(function(){'use strict';
let GAMMA=false;const L2=c=>GAMMA?c:c.convertSRGBToLinear(),ENC=()=>GAMMA?THREE.LinearEncoding:THREE.sRGBEncoding;
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const grad=(()=>{const t=new THREE.DataTexture(new Uint8Array([150,150,150,255,255,255,255,255]),2,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
const RIM={value:.32};
/* cel shade: two tones, the shadow tone pulled warm (anime skin and cloth shadows are warm, not grey), plus a soft rim light */
function cel(col,o){o=o||{};const m=new THREE.MeshToonMaterial({color:L2(new THREE.Color(col)),gradientMap:grad,map:o.map||null,transparent:!!o.transparent,alphaTest:o.alphaTest||0,side:o.side||THREE.FrontSide});
  m.onBeforeCompile=s=>{s.uniforms.uRim=RIM;s.fragmentShader='uniform float uRim;\n'+s.fragmentShader.replace('#include <dithering_fragment>',
    '{vec3 vd=normalize(vViewPosition);float r=pow(1.0-abs(dot(normalize(vNormal),vd)),2.6);gl_FragColor.rgb+=r*uRim*vec3(1.0,.96,.88);float lum=dot(gl_FragColor.rgb,vec3(.3,.59,.11));gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb*vec3(1.05,.95,1.02),.25*(1.0-smoothstep(.15,.55,lum)));}\n#include <dithering_fragment>');};
  m.customProgramCacheKey=()=>'animecel';return m;}
const INK=new THREE.ShaderMaterial({uniforms:{uW:{value:.011},uC:{value:new THREE.Color(0x2a1a14)}},side:THREE.BackSide,
  vertexShader:'uniform float uW;void main(){vec3 p=position+normal*uW;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
  fragmentShader:'uniform vec3 uC;void main(){gl_FragColor=vec4(uC,1.);}'});
function cnv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=ENC();t.anisotropy=4;t.__c=c;return t;}
/* parts: every mesh also gets an ink hull (skipped for tiny bits) */
function part(parent,geo,mat,x,y,z,o){o=o||{};const m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);if(o.s)m.scale.set(...o.s);if(o.r)m.rotation.set(...o.r);m.castShadow=true;m.receiveShadow=true;parent.add(m);
  if(!o.noInk){const k=new THREE.Mesh(geo,INK);k.raycast=()=>{};m.add(k);}return m;}
const SPH=(r,a,b)=>new THREE.SphereGeometry(r,a||20,b||14),CYL=(r1,r2,h,n)=>new THREE.CylinderGeometry(r1,r2,h,n||14,1);
function lathe(pts,n){return new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),n||22);}
/* a limb: upper and lower segment, round joints; returns the two pivots */
function limb(parent,x,y,z,l1,l2,r1,r2,m1,m2,foot){const a=new THREE.Group();a.position.set(x,y,z);parent.add(a);
  part(a,CYL(r1,r1*.9,l1),m1,0,-l1/2,0);part(a,SPH(r1*1.02,14,10),m1,0,0,0);const b=new THREE.Group();b.position.set(0,-l1,0);a.add(b);
  part(b,SPH(r1*.92,14,10),m2,0,0,0);part(b,CYL(r1*.9,r2,l2),m2,0,-l2/2,0);if(foot)foot(b,-l2);return{a,b};}
/* ---------- textures ---------- */
function shirtTex(base,pat,trim){return cnv(256,256,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);g.strokeStyle=trim;g.fillStyle=trim;
  if(pat==='knot'){g.lineWidth=3;for(let i=0;i<8;i++){const cx=w*(i+.5)/8,cy=h*.6;g.save();g.translate(cx,cy);g.scale(.5,.5);g.translate(-cx,-cy);g.beginPath();g.moveTo(cx-18,cy);g.quadraticCurveTo(cx,cy-26,cx+18,cy);g.quadraticCurveTo(cx,cy+26,cx-18,cy);g.stroke();g.beginPath();g.moveTo(cx,cy-18);g.quadraticCurveTo(cx+26,cy,cx,cy+18);g.quadraticCurveTo(cx-26,cy,cx,cy-18);g.stroke();g.restore();}g.fillRect(0,h*.84,w,6);g.fillRect(0,h*.1,w,4);}
  else if(pat==='stripes'){for(let y=0;y<h;y+=28)g.fillRect(0,y,w,11);}
  else if(pat==='floral'){for(let i=0;i<46;i++){const x=(i*53)%w,y=(i*97)%h;for(let p=0;p<5;p++){g.beginPath();g.arc(x+Math.cos(p*1.26)*7,y+Math.sin(p*1.26)*7,5,0,7);g.fill();}g.fillStyle='#f6e27a';g.beginPath();g.arc(x,y,4,0,7);g.fill();g.fillStyle=trim;}}
  else if(pat==='coat'){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(w*.49,0,w*.02,h);g.fillStyle='#e8c35a';for(let y=40;y<h;y+=40){g.beginPath();g.arc(w*.45,y,5,0,7);g.fill();g.beginPath();g.arc(w*.55,y,5,0,7);g.fill();}g.fillRect(0,h*.92,w,6);}
  else if(pat==='ranger'){g.fillRect(w*.49,0,w*.02,h);g.fillRect(w*.3,h*.2,w*.12,h*.12);g.fillRect(w*.58,h*.2,w*.12,h*.12);g.fillStyle='#e8c35a';g.beginPath();g.arc(w*.36,h*.3,8,0,7);g.fill();}
  else if(pat==='knit'){g.globalAlpha=.25;g.fillStyle='#000';for(let y=0;y<h;y+=8)for(let x=(y/8%2)*6;x<w;x+=12)g.fillRect(x,y,6,4);}
  const n=g.getImageData(0,0,w,h);for(let i=0;i<n.data.length;i+=4){const v=(Math.random()-.5)*10;n.data[i]+=v;n.data[i+1]+=v;n.data[i+2]+=v;}g.putImageData(n,0,0);});}
/* the face: big anime eyes (iris gradient, pupil, two highlights, a heavy upper lash line), brows, blush and a small mouth, drawn on a
   transparent patch that sits just over the front of the head */
function faceTex(f){return cnv(512,384,(g,w,h)=>{const ex=f.eyeX||.3,ey=f.eyeY||.5,ew=(f.eyeW||.1)*w,eh=(f.eyeH||.17)*h;
  if(f.mask){g.fillStyle=f.mask;g.beginPath();g.ellipse(w*.5,h*ey,w*.46,eh*.55,0,0,7);g.fill();}
  [-1,1].forEach(s=>{const cx=w*(.5+s*(.5-ex)),cy=h*ey;
    if(f.blush){g.fillStyle='rgba(255,120,130,.35)';g.beginPath();g.ellipse(cx+s*ew*.25,cy+eh*.75,ew*.7,eh*.22,0,0,7);g.fill();}
    g.fillStyle='#fffdf8';g.beginPath();g.ellipse(cx,cy,ew,eh,0,0,7);g.fill();
    const ig=g.createLinearGradient(0,cy-eh,0,cy+eh);ig.addColorStop(0,'#1a1010');ig.addColorStop(.45,f.iris||'#6a4a2a');ig.addColorStop(1,f.iris2||'#c89a5a');
    g.fillStyle=ig;g.beginPath();g.ellipse(cx+s*ew*.08,cy+eh*.08,ew*.78,eh*.86,0,0,7);g.fill();
    g.fillStyle='#120a08';g.beginPath();g.ellipse(cx+s*ew*.08,cy+eh*.12,ew*.36,eh*.44,0,0,7);g.fill();
    g.fillStyle='#ffffff';g.beginPath();g.ellipse(cx-ew*.28+s*ew*.08,cy-eh*.38,ew*.26,eh*.2,0,0,7);g.fill();g.beginPath();g.arc(cx+ew*.3+s*ew*.08,cy+eh*.4,ew*.12,0,7);g.fill();
    g.strokeStyle='#1a0f0c';g.lineCap='round';g.lineWidth=eh*.22;g.beginPath();g.ellipse(cx,cy+eh*.1,ew*1.08,eh*1.06,0,Math.PI*1.08,Math.PI*1.92);g.stroke();
    g.lineWidth=eh*.12;g.beginPath();g.moveTo(cx+s*ew*.95,cy-eh*.45);g.lineTo(cx+s*ew*1.3,cy-eh*.7);g.stroke();/* lash flick */
    g.lineWidth=eh*.06;g.beginPath();g.ellipse(cx,cy,ew*.9,eh*.98,0,Math.PI*.25,Math.PI*.75);g.stroke();
    if(f.brow!==false){g.strokeStyle=f.browC||'#3a2418';g.lineWidth=eh*.16;g.beginPath();g.moveTo(cx-s*ew*.7,cy-eh*1.45+(f.browTilt||0)*s*eh);g.quadraticCurveTo(cx,cy-eh*1.75,cx+s*ew*.9,cy-eh*1.4-(f.browTilt||0)*s*eh);g.stroke();}
    if(f.glasses){g.strokeStyle=f.glasses;g.lineWidth=7;g.beginPath();g.ellipse(cx,cy,ew*1.45,eh*1.3,0,0,7);g.stroke();}});
  if(f.glasses){g.strokeStyle=f.glasses;g.lineWidth=6;g.beginPath();g.moveTo(w*.5-w*(.5-ex)+ew*1.45,h*ey);g.quadraticCurveTo(w*.5,h*ey-eh*.6,w*.5+w*(.5-ex)-ew*1.45,h*ey);g.stroke();}
  if(f.mouth){g.strokeStyle='#4a2418';g.lineWidth=5;g.lineCap='round';g.beginPath();const my=h*(f.mouthY||.86);g.moveTo(w*.46,my);g.quadraticCurveTo(w*.5,my+12,w*.54,my);g.stroke();}});}
/* ---------- heads ---------- */
function head(H,sp,R,M,face){const fur=M(sp.fur),fur2=M(sp.fur2||sp.fur);
  part(H,SPH(R,26,18),fur,0,0,0,{s:sp.headS||[1,.96,.96]});
  /* face patch: a slice of a slightly bigger sphere, in front */
  const fg=new THREE.SphereGeometry(R*1.018,32,20,Math.PI/2-1.15,2.3,Math.PI/2-.95,1.75);const fm=cel('#ffffff',{map:face,transparent:true,alphaTest:.5});
  const fp=new THREE.Mesh(fg,fm);fp.scale.set(...(sp.headS||[1,.96,.96]));fp.renderOrder=2;H.add(fp);
  const sk=sp.species;
  if(sk==='quokka'||sk==='possum'||sk==='koala'){
    part(H,SPH(R*.42,18,12),fur2,0,-R*.42,R*.78,{s:[1.15,.8,.9]});/* muzzle */
    part(H,SPH(R*(sk==='koala'?.2:.1),14,10),M(sk==='possum'?'#e89aa2':'#231612'),0,-R*.3,R*1.08,{s:sk==='koala'?[1,1.35,.8]:[1.3,.9,1]});
    const eR=sk==='koala'?R*.48:sk==='possum'?R*.36:R*.3,eY=sk==='koala'?R*.55:R*.78,eX=sk==='koala'?R*.85:R*.62;
    [-1,1].forEach(s=>{part(H,SPH(eR,16,12),fur,s*eX,eY,-R*.05,{s:sk==='possum'?[.8,1.25,.45]:[1,1,.5],r:[0,0,s*-.35]});
      part(H,SPH(eR*.62,14,10),M(sk==='koala'?'#f2ece4':'#e8a3a0'),s*eX,eY,R*.08-eR*.1,{s:sk==='possum'?[.8,1.25,.25]:[1,1,.3],r:[0,0,s*-.35],noInk:true});});
    if(sp.spikes){const hm=M(sp.spikes);for(let i=0;i<11;i++){const a=(i/10-.5)*2.6,back=i%2;part(H,new THREE.ConeGeometry(R*.24,R*.85,7),hm,Math.sin(a)*R*.6,R*.78-Math.abs(a)*R*.12,(back?-R*.35:R*.05)+Math.cos(a)*R*.15,{r:[(back?-1.0:-.35)+Math.random()*.2,0,-a*.6]});}
    part(H,new THREE.SphereGeometry(R*1.0,22,14,Math.PI,Math.PI,0,1.3),hm,0,R*.08,-R*.02,{s:[1.03,1,1.03]});/* hair cap */}}
  if(sk==='pelican'){const bk=M('#f0a43a');const b=new THREE.Group();b.position.set(0,-R*.18,R*.62);b.rotation.x=.18;H.add(b);
    part(b,new THREE.BoxGeometry(R*.42,R*.16,R*2.2),bk,0,0,R*1.0,{s:[1,1,1]});part(b,SPH(R*.36,16,10),M('#f2b87a'),0,-R*.3,R*1.0,{s:[1,.9,2.6]});part(b,SPH(R*.1,10,8),M('#e2562f'),0,R*.02,R*2.1,{s:[1.4,.8,1]});}
  if(sk==='gull'){part(H,new THREE.ConeGeometry(R*.22,R*1.1,12),M('#f2c230'),0,-R*.2,R*1.3,{r:[Math.PI/2,0,0]});part(H,SPH(R*.07,8,6),M('#d8342a'),0,-R*.3,R*1.55,{noInk:true});}
  if(sk==='owl'){part(H,SPH(R*.88,22,14),fur2,0,-R*.05,R*.25,{s:[1.1,.95,.5],noInk:true});part(H,new THREE.ConeGeometry(R*.14,R*.36,10),M('#d8a84a'),0,-R*.22,R*1.05,{r:[Math.PI/2+.5,0,0]});
    [-1,1].forEach(s=>part(H,new THREE.ConeGeometry(R*.18,R*.5,8),fur,s*R*.62,R*.9,-R*.05,{r:[0,0,-s*.5]}));}
  if(sk==='osprey'){part(H,new THREE.ConeGeometry(R*.18,R*.7,12),M('#2a2420'),0,-R*.2,R*1.12,{r:[Math.PI/2+.35,0,0]});for(let i=0;i<5;i++)part(H,new THREE.ConeGeometry(R*.16,R*.6,8),fur2,(i-2)*R*.16,R*.1,-R*.95,{r:[-1.9,0,(i-2)*.2]});}
  if(sk==='turtle'){part(H,SPH(R*.5,16,12),fur2,0,-R*.35,R*.62,{s:[1.1,.75,1]});}
  /* hats */
  const hat=sp.hat;if(hat){const hm=M(hat.c),hb=M(hat.b||hat.c);
    if(hat.k==='captain'){part(H,CYL(R*.92,R*.85,R*.42,20),hm,0,R*.78,-R*.02,{r:[-.12,0,0]});part(H,CYL(R*1.0,R*1.0,R*.12,20),M('#ffffff'),0,R*1.02,-R*.05,{r:[-.12,0,0]});part(H,CYL(R*.6,R*.6,R*.05,16,),hb,0,R*.6,R*.62,{s:[1,1,.7],r:[.35,0,0]});part(H,SPH(R*.12,10,8),M('#e8c35a'),0,R*.8,R*.86,{noInk:true});}
    if(hat.k==='ranger'){part(H,CYL(R*1.75,R*1.75,R*.07,24),hm,0,R*.72,0,{r:[-.1,0,0]});part(H,CYL(R*.78,R*.9,R*.55,20),hm,0,R*.98,-R*.05,{r:[-.1,0,0]});part(H,CYL(R*.92,R*.92,R*.12,20),hb,0,R*.8,-R*.04,{r:[-.1,0,0]});}
    if(hat.k==='beanie'){part(H,SPH(R*1.05,20,12),hm,0,R*.32,-R*.05,{s:[1,.75,1]});part(H,CYL(R*1.06,R*1.06,R*.22,20),hb,0,R*.22,-R*.05);part(H,SPH(R*.22,10,8),hb,0,R*1.08,-R*.08);}
    if(hat.k==='sun'){part(H,CYL(R*1.5,R*1.6,R*.06,24),hm,0,R*.7,0,{r:[-.18,0,0]});part(H,SPH(R*.85,20,12),hm,0,R*.75,-R*.05,{s:[1,.6,1]});part(H,CYL(R*.88,R*.88,R*.14,20),hb,0,R*.8,-R*.05,{r:[-.18,0,0]});}
    if(hat.k==='bandana'){part(H,SPH(R*1.04,22,12,),hm,0,R*.18,-R*.06,{s:[1,.72,1]});part(H,new THREE.ConeGeometry(R*.25,R*.6,6),hm,0,R*.15,-R*1.08,{r:[-1.2,0,0]});}}
  return fp;}
/* ---------- a whole character ---------- */
function create(sp,o){o=o||{};GAMMA=!!o.gammaOut;const cache={};const M=(c,map)=>{const k=c+(map?map.uuid:'');return cache[k]||(cache[k]=cel(c,{map}));};
  const Ht=sp.h||1.6,R=Ht*(sp.headR||.105),legL=Ht*(sp.leg||.44),torsoL=Ht*.29,hipY=legL+Ht*.03,root=new THREE.Group(),body=new THREE.Group();root.add(body);body.position.y=hipY;
  const fur=M(sp.fur),cl=sp.cloth||{},shirtM=M('#ffffff',shirtTex(cl.shirt||'#3b6bc8',cl.pat||'plain',cl.trim||'#ffffff')),pantM=M(cl.pants||'#2a2a34'),bootM=M(cl.boots||'#6a3a22'),skinM=sp.bare?fur:shirtM;
  /* hips and torso: lathe profiles, the shirt over the body */
  const sh=Ht*.115*(sp.wide||1);
  part(body,lathe([[0,-.03],[sh*.9,-.02],[sh*.98,torsoL*.06],[sh*.86,torsoL*.32],[sh*.82,torsoL*.45],[sh*.95,torsoL*.66],[sh*1.0,torsoL*.8],[sh*.92,torsoL*.9],[sh*.72,torsoL*.97],[sh*.42,torsoL*1.01],[0,torsoL*1.03]],26),skinM,0,0,0,{s:[1,1,.74]});
  [-1,1].forEach(s2=>part(body,SPH(Ht*.05,16,12),skinM,s2*sh*.86,torsoL*.86,0,{s:[1,.9,.95]}));/* rounded shoulders */
  if(cl.hem!==false&&!sp.bare)part(body,lathe([[sh*1.0,-Ht*.07],[sh*1.08,-Ht*.045],[sh*1.04,Ht*.01],[sh*.98,Ht*.04]],26),cl.pat==='coat'||cl.pat==='ranger'?shirtM:M(cl.hemC||cl.trim||'#f2efe6'),0,0,0,{s:[1,1,.76]});
  if(cl.belt)[part(body,CYL(sh*1.02,sh*1.02,Ht*.03,22),M(cl.belt),0,Ht*.05,0,{s:[1,1,.8]}),cl.pouch&&part(body,new THREE.BoxGeometry(Ht*.07,Ht*.06,Ht*.04),M(cl.pouch),sh*.45,Ht*.03,sh*.75)];
  if(cl.apron){part(body,new THREE.CylinderGeometry(sh*1.06,sh*1.18,torsoL*.9,20,1,true,-1.1,2.2),M(cl.apron),0,torsoL*.3,0,{s:[1,1,.82]});}
  if(cl.hood)part(body,new THREE.TorusGeometry(sh*.62,Ht*.035,10,20),M(cl.hood),0,torsoL*.98,-sh*.12,{r:[Math.PI/2-.35,0,0]});
  if(cl.scarf){part(body,new THREE.TorusGeometry(sh*.55,Ht*.032,10,20),M(cl.scarf),0,torsoL*.98,0,{r:[Math.PI/2,0,0]});part(body,new THREE.BoxGeometry(Ht*.05,Ht*.16,Ht*.02),M(cl.scarf),sh*.25,torsoL*.78,sh*.72,{r:[0,0,.15]});}
  if(sp.shell){part(body,SPH(sh*1.35,22,14),M(sp.shell),0,torsoL*.5,-sh*.55,{s:[1,1.15,.62]});part(body,SPH(sh*1.2,18,12),M(sp.shellRim||'#c8b070'),0,torsoL*.5,-sh*.45,{s:[1.08,1.22,.5],noInk:true});}
  if(sp.tail){const t=sp.tail;part(body,SPH(Ht*t.r,14,10),M(t.c||sp.fur),0,Ht*.02,-sh*.95,{s:t.s||[.7,.7,1.6],r:[t.rx||-.6,0,0]});}
  if(sp.wings)[-1,1].forEach(s=>part(body,SPH(sh*.75,14,10),M(sp.wings),s*sh*.6,torsoL*.45,-sh*.65,{s:[.35,1.1,.7],r:[.3,0,s*.15]}));
  /* neck and head */
  part(body,CYL(Ht*.035,Ht*.04,Ht*.06),fur,0,torsoL*1.02,0);const H=new THREE.Group();H.position.set(0,torsoL*1.02+R*.95,R*.05);body.add(H);
  const face=faceTex(sp.face||{});const fp=head(H,sp,R,M,face);
  /* legs (two parts, knee bends) with boots; arms (two parts, elbow bends) with sleeves and paws */
  const legs=[-1,1].map(s=>limb(root,s*sh*.48,hipY,0,legL*.5,legL*.46,Ht*.044,Ht*.033,cl.shorts?fur:pantM,cl.shorts||cl.longBoots?fur:pantM,(b,y)=>{
    if(cl.shorts)part(b.parent,CYL(Ht*.058,Ht*.055,legL*.28),pantM,0,-legL*.12,0);
    part(b,CYL(Ht*.044,Ht*.046,legL*(cl.longBoots?.36:.14)),bootM,0,y+legL*(cl.longBoots?.17:.06),0);
    part(b,SPH(Ht*.05,14,10),bootM,0,y-Ht*.005,Ht*.03,{s:[.95,.62,1.65]});if(cl.bootTrim)part(b,CYL(Ht*.048,Ht*.048,Ht*.015),M(cl.bootTrim),0,y+legL*(cl.longBoots?.34:.12),0);}));
  const sleeveL=cl.long?1:.45,armL1=Ht*.16,armL2=Ht*.15;
  const arms=[-1,1].map(s=>{const A=limb(body,s*(sh*.9+Ht*.02),torsoL*.84,0,armL1,armL2,Ht*.03,Ht*.025,sleeveL>=.9||sp.bare?(sp.bare?fur:shirtM):fur,sleeveL>=.9?shirtM:(sp.wingArms?M(sp.wingArms):fur),(b,y)=>{
      part(b,SPH(Ht*.032,14,10),M(sp.paw||sp.fur2||sp.fur),0,y-Ht*.022,Ht*.004,{s:[.85,1.2,.9]});if(cl.cuff)part(b,CYL(Ht*.033,Ht*.033,Ht*.03),M(cl.cuff),0,y+Ht*.035,0);});
    if(!sp.bare&&sleeveL<.9)part(A.a,CYL(Ht*.044,Ht*.048,armL1*.55),shirtM,0,-armL1*.22,0);A.a.rotation.z=s*.07;return A;});
  /* blinking: the face patch flips to a closed-eye texture for a moment */
  const closed=faceTex(Object.assign({},sp.face||{},{closed:true}));(()=>{const g=closed.__c.getContext('2d');g.clearRect(0,0,512,384);const f=sp.face||{},ex=f.eyeX||.3,ey=f.eyeY||.5,ew=(f.eyeW||.1)*512,eh=(f.eyeH||.17)*384;
    if(f.mask){g.fillStyle=f.mask;g.beginPath();g.ellipse(256,384*ey,512*.46,eh*.55,0,0,7);g.fill();}
    [-1,1].forEach(s=>{const cx=512*(.5+s*(.5-ex)),cy=384*ey;g.strokeStyle='#1a0f0c';g.lineWidth=eh*.2;g.lineCap='round';g.beginPath();g.ellipse(cx,cy+eh*.2,ew*1.0,eh*.45,0,Math.PI*.1,Math.PI*.9);g.stroke();
      if(f.brow!==false){g.strokeStyle=f.browC||'#3a2418';g.lineWidth=eh*.16;g.beginPath();g.moveTo(cx-s*ew*.7,cy-eh*1.35);g.quadraticCurveTo(cx,cy-eh*1.6,cx+s*ew*.9,cy-eh*1.3);g.stroke();}
      if(f.glasses){g.strokeStyle=f.glasses;g.lineWidth=7;g.beginPath();g.ellipse(cx,cy,ew*1.45,eh*1.3,0,0,7);g.stroke();}});
    if(f.mouth){g.strokeStyle='#4a2418';g.lineWidth=5;const my=384*(f.mouthY||.86);g.beginPath();g.moveTo(512*.46,my);g.quadraticCurveTo(256,my+12,512*.54,my);g.stroke();}closed.needsUpdate=true;})();
  if(sp.prop==='cane'){const c=new THREE.Group();arms[1].b.add(c);part(c,CYL(Ht*.012,Ht*.012,Ht*.55),M('#6a4428'),0,-armL2-Ht*.22,Ht*.02);}
  if(sp.prop==='camera')part(body,new THREE.BoxGeometry(Ht*.08,Ht*.055,Ht*.04),M('#2a2a2e'),0,torsoL*.55,sh*.82);
  if(sp.prop==='lantern'){const c=new THREE.Group();arms[0].b.add(c);part(c,CYL(Ht*.035,Ht*.035,Ht*.07,8),M('#f6d27a'),0,-armL2-Ht*.09,0);part(c,CYL(Ht*.04,Ht*.04,Ht*.015,8),M('#3a2a20'),0,-armL2-Ht*.05,0);}
  if(sp.prop==='cup'){const c=new THREE.Group();arms[1].b.add(c);part(c,CYL(Ht*.025,Ht*.02,Ht*.045,10),M('#f6f2e8'),0,-armL2-Ht*.05,Ht*.03);}
  let t=Math.random()*9,blinkT=2+Math.random()*3,ph=0,amp=0;const fpM=fp.material;
  function update(dt,speed){t+=dt;const target=Math.min(2,speed||0);amp+=(target-amp)*Math.min(1,dt*6);ph+=dt*(5+amp*2.4)*(amp>.05?1:0);
    const a=Math.min(1,amp),run=Math.max(0,amp-1),sw=Math.sin(ph)*(.55*a+.25*run);
    legs.forEach((L,i)=>{const s=i?-1:1,q=sw*s;L.a.rotation.x=q;L.b.rotation.x=Math.max(0,-Math.sin(ph*1+(i?Math.PI:0)))*(.7*a+.5*run)+.05;});
    arms.forEach((A,i)=>{const s=i?1:-1;A.a.rotation.x=sw*s*.9;A.b.rotation.x=-(.25+.5*run+.15*a);});
    body.position.y=hipY+Math.abs(Math.cos(ph))*Ht*(.012*a+.025*run)+Math.sin(t*2)*Ht*.003*(1-a);body.rotation.x=.06*a+.16*run;body.rotation.y=Math.sin(ph)*.08*a;
    H.rotation.x=-.06*a-.12*run+Math.sin(t*1.3)*.02;H.rotation.y=Math.sin(t*.7)*.12*(1-a);
    blinkT-=dt;if(blinkT<0){fpM.map=closed;if(blinkT<-.12){fpM.map=face;blinkT=2+Math.random()*4;}}}
  return{root,update,spec:sp,head:H,body};}
/* the cast (fictional, from the story bible): Kip and his family are quokkas, Captain Gus a pelican, Bob a koala, Mina a gull,
   Old Hoot an owl, Skye an osprey, Remy a possum, Nonna Shell a sea turtle */
const CAST={
 kip:{name:'Kip',role:'ควอกก้า · เจ้าของคาเฟ่',species:'quokka',h:1.55,fur:'#a47a52',fur2:'#d9b48c',spikes:'#8a6240',tail:{r:.035,s:[.6,.6,2.2]},
   face:{iris:'#4a2e1a',iris2:'#c88a3a',blush:true,mouth:true,eyeY:.48},cloth:{shirt:'#2f5fc0',pat:'knot',trim:'#f4f0e6',pants:'#2a2a34',boots:'#8a4a26',bootTrim:'#c87a3a',belt:'#6a3a22',pouch:'#b8562e',hood:'#f2efe6',cuff:'#9a4a2a',shorts:false,long:false}},
 mum:{name:'Mum',role:'แม่ของ Kip',species:'quokka',h:1.45,fur:'#a88060',fur2:'#e0c09a',tail:{r:.033,s:[.6,.6,2.2]},face:{iris:'#3a2a1a',iris2:'#a87a4a',blush:true,mouth:true,eyeH:.16},
   cloth:{shirt:'#e8a0a8',pat:'floral',trim:'#ffffff',pants:'#5a6a8a',boots:'#6a4a3a',apron:'#7aa06a',scarf:'#f2e6c8'}},
 dad:{name:'Dad',role:'พ่อของ Kip · ช่างไม้',species:'quokka',h:1.6,fur:'#8e6a48',fur2:'#cfa880',tail:{r:.036,s:[.6,.6,2.2]},wide:1.12,face:{iris:'#2a1a10',iris2:'#8a5a2a',mouth:true,browTilt:.15,eyeH:.14},
   cloth:{shirt:'#6a8a5a',pat:'stripes',trim:'#5a7a4a',pants:'#4a3a2a',boots:'#3a2a1e',belt:'#2a1a10',pouch:'#8a6a3a',long:true,cuff:'#5a7a4a'}},
 gus:{name:'Captain Gus',role:'นกกระทุง · กัปตันเรือข้ามฟาก',species:'pelican',h:1.8,headR:.095,fur:'#f4f2ec',fur2:'#e6e2d8',wide:1.15,paw:'#f0a43a',
   face:{iris:'#3a3a3a',iris2:'#9aa0a8',eyeX:.2,eyeY:.42,eyeW:.08,eyeH:.13,browC:'#8a8a8a'},hat:{k:'captain',c:'#1e2e5a',b:'#14204a'},cloth:{shirt:'#1e2e5a',pat:'coat',trim:'#e8c35a',pants:'#1e2e5a',boots:'#1a1a1e',long:true,cuff:'#e8c35a',longBoots:true}},
 bob:{name:'Bob',role:'โคอาล่า · นักท่องเที่ยว',species:'koala',h:1.5,headR:.12,fur:'#9a9ca2',fur2:'#c8cad0',wide:1.15,face:{iris:'#2a2a2a',iris2:'#6a5a4a',eyeY:.45,eyeW:.085,eyeH:.14,mouth:false,brow:true,browC:'#6a6a6a'},
   hat:{k:'sun',c:'#e8d8a8',b:'#a8402a'},prop:'camera',cloth:{shirt:'#2a9a8a',pat:'floral',trim:'#f4e2a0',pants:'#d8c8a0',boots:'#6a4a32',shorts:true}},
 mina:{name:'Mina',role:'นกนางนวล',species:'gull',h:1.45,fur:'#fafafa',fur2:'#ffffff',wingArms:'#a8b0b8',wings:'#a8b0b8',paw:'#2a2a2a',
   face:{iris:'#d8b02a',iris2:'#f2e27a',eyeX:.24,eyeY:.42,eyeH:.15,browTilt:-.25,browC:'#5a5a5a'},cloth:{shirt:'#d84a3a',pat:'plain',trim:'#f2e6c8',pants:'#3a4a6a',boots:'#d8a83a',scarf:'#f2c230',shorts:true}},
 hoot:{name:'Old Hoot',role:'นกฮูก · ผู้ดูแลประภาคาร',species:'owl',h:1.5,headR:.125,fur:'#8a6a4a',fur2:'#d8c2a0',wide:1.2,
   face:{iris:'#e8a82a',iris2:'#f6d86a',eyeX:.27,eyeY:.47,eyeW:.12,eyeH:.2,glasses:'#5a3a1a',browC:'#5a3a22'},prop:'lantern',cloth:{shirt:'#7a8a5a',pat:'knit',trim:'#5a6a3a',pants:'#5a4a3a',boots:'#3a2a20',long:true,cuff:'#5a6a3a',scarf:'#a8402a'}},
 skye:{name:'Skye',role:'นกออสเปรย์ · เรนเจอร์',species:'osprey',h:1.7,fur:'#f4f2ee',fur2:'#5a4030',wingArms:'#5a4030',
   face:{iris:'#e8c23a',iris2:'#f8e88a',eyeX:.25,eyeY:.42,eyeH:.14,mask:'rgba(70,48,34,.95)',browTilt:-.3,browC:'#2a1a10'},hat:{k:'ranger',c:'#8a7a52',b:'#4a3a24'},
   cloth:{shirt:'#a89a6a',pat:'ranger',trim:'#6a5a3a',pants:'#5a5a3a',boots:'#4a3020',belt:'#3a2a1a',pouch:'#5a4a2a',long:true,longBoots:true}},
 remy:{name:'Remy',role:'พอสซั่ม · รถกาแฟ',species:'possum',h:1.6,fur:'#7a7a80',fur2:'#d8d6d8',tail:{r:.05,c:'#2a2a2e',s:[.55,.55,3],rx:-1.0},
   face:{iris:'#2a1a12',iris2:'#7a4a2a',blush:false,mouth:true,eyeY:.47,browTilt:-.1},hat:{k:'beanie',c:'#2a2a30',b:'#c84a3a'},prop:'cup',
   cloth:{shirt:'#2a2a30',pat:'plain',trim:'#c84a3a',pants:'#3a4a6a',boots:'#e8e4dc',apron:'#8a5a3a',hood:'#c84a3a'}},
 nonna:{name:'Nonna Shell',role:'เต่าทะเล · ร้านชา',species:'turtle',h:1.35,headR:.11,fur:'#7aa070',fur2:'#c8d8a8',shell:'#7a5a3a',shellRim:'#c8a870',wide:1.15,prop:'cane',
   face:{iris:'#3a2a1a',iris2:'#8a6a3a',glasses:'#c8a83a',mouth:true,eyeH:.13,browC:'#e8e8e0'},hat:{k:'bandana',c:'#a83a5a'},
   cloth:{shirt:'#c86a8a',pat:'floral',trim:'#f6e8d0',pants:'#6a4a5a',boots:'#4a3a2a',long:true,scarf:'#f2e6c8'}}};
window.ANIME_CHARS={create,CAST,rim:RIM,ink:INK};})();
