// ---------- Natural Rottnest ground and trees, the camp's recipe (Look Lab ?lushisland, Paul 28 Nov 2026: 'ลองเลย') ----------
// Paul: the camp's ground, grass and trees look real like the Tree Lab, Rottnest less so. Measured: the camp ground has a close-up
// texture plus soil/litter/moss colours and ~33,000 detail pieces round Kip; Rottnest is an even mown lawn with ~5,000 (13 Nov 2026
// decision: 'even lawn inland'). This lab brings the camp's recipe to Rottnest only, and only near the camera so it stays light:
// 1. ground: the mown-stripe strokes become even blades; the grass gets sandy limestone soil showing through, straw and olive
//    patches, darker hollows, leaf litter in the shade, and the camp's close-up speckle texture over grass and sand;
// 2. ground detail round Kip (rebuilt as the camera moves): fallen leaves and twigs, limestone pebbles, shell grit on the beach;
// 3. more trees and bushes from the Foliage Engine (2x trees, 2x bushes) so the woodland reads as woodland; the extra trees keep off
//    paths and the café front, and the leaves between Kip and the camera thin out (like the camp's see-through trees).
// Off for players: ?lushisland turns it on. Works on top of ?fast.
var LUSH_LIVE=true;/* live (Paul, 28 Nov 2026: 'ขึ้นเกมได้: lushisland'); ?nolush shows the old lawn */
const LUSH={on:(LUSH_LIVE||/[?&#]lushisland\b/.test(location.search+location.hash))&&!/[?&#]nolush\b/.test(location.search+location.hash),pieces:0,patched:0};
window.__LUSH=LUSH;
if(LUSH.on)(()=>{
  // ---- 3. more trees and bushes: the Rottnest island map only (towns and camps keep theirs) ----
  if(!/lushnofol/.test(location.search+location.hash))(function hook(){if(typeof IslandMap==='undefined'){setTimeout(hook,100);return;}const _c=IslandMap.create;
    IslandMap.create=function(o){try{const d=o&&o.doc;if(d&&!d.town&&/rottnest/i.test(d.name||'Rottnest')&&d.fol){o=Object.assign({},o,{doc:Object.assign({},d,{fol:Object.assign({},d.fol,{tree:(d.fol.tree||.006)*(window.__GROVES&&__GROVES.on?1:2),/* with the groves the engine's own trees stay as they were */bush:(d.fol.bush||.03)*2})})});}}catch(e){}
      const rb=rottBuild;try{rottBuild=!!(o&&o.doc&&!o.doc.town);return _c.call(this,o);}finally{rottBuild=rb;}};})();
  /* the extra trees keep off paths and the café front (grass still grows there): wrap the Foliage Engine's tree keep-out while the island map builds */
  let rottBuild=false;(function hookF(){if(typeof FoliageEngine==='undefined'){setTimeout(hookF,100);return;}const _f=FoliageEngine.create;
    FoliageEngine.create=function(o){if(rottBuild&&o&&o.treeKeepOut){const k0=o.treeKeepOut;o=Object.assign({},o,{treeKeepOut:(x,z)=>{if(k0(x,z))return true;
      try{if(IBMAP.onPathMap&&IBMAP.onPathMap(x,z,2.4))return true;const g=IBMAP.toGame(x,z),c0=IW(0,0);if(Math.hypot(g[0]-c0.x,g[1]-c0.z)<16)return true;}catch(e){}return false;}});}
      return _f.call(this,o);};})();
  // ---- shared canvases (the camp's own recipes) ----
  const cnv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.LinearEncoding;return t;};
  const detailTex=cnv(256,256,(g,w,h)=>{g.fillStyle='#dedede';g.fillRect(0,0,w,h);const r=Math.random;
    for(let i=0;i<900;i++){const v=185+r()*70|0;g.fillStyle=`rgba(${v},${v},${v},.5)`;g.beginPath();g.arc(r()*w,r()*h,3+r()*7,0,7);g.fill();}
    for(let i=0;i<3200;i++){const v=110+r()*145|0;g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(r()*w,r()*h,1+r()*2,1+r()*2);}
    for(let i=0;i<140;i++){const v=200+r()*55|0;g.fillStyle=`rgb(${v},${v-6},${v-14})`;g.beginPath();g.ellipse(r()*w,r()*h,1.5+r()*3,1+r()*2,r()*3,0,7);g.fill();}
    for(let i=0;i<40;i++){g.strokeStyle='rgba(60,50,40,.25)';g.lineWidth=1;g.beginPath();const x=r()*w,y=r()*h;g.moveTo(x,y);g.lineTo(x+(r()-.5)*14,y+(r()-.5)*14);g.stroke();}});
  detailTex.wrapS=detailTex.wrapT=THREE.RepeatWrapping;detailTex.anisotropy=4;
  const leafT=cnv(256,256,(g,w,h)=>{const r=Math.random;const C=['#8a6a3a','#a2803c','#6e6034','#b8a05a','#7a6a3a','#c2b07e','#5f5a2e','#9a8a5a'];
    for(let i=0;i<200;i++){const x=w/2+(r()-.5)*w*.85*Math.sqrt(r()),y=h/2+(r()-.5)*h*.85*Math.sqrt(r());g.save();g.translate(x,y);g.rotate(r()*7);g.fillStyle=C[i%C.length];
      g.beginPath();g.moveTo(-10,0);g.quadraticCurveTo(0,-6,10,1);g.quadraticCurveTo(0,-1,-10,0);g.fill();g.restore();}
    for(let i=0;i<14;i++){g.save();g.translate(w*.15+r()*w*.7,h*.15+r()*h*.7);g.rotate(r()*7);g.strokeStyle='#5a4630';g.lineWidth=1.5+r()*2;g.beginPath();g.moveTo(-26,0);g.lineTo(26,(r()-.5)*6);g.stroke();g.restore();}
    const im=g.getImageData(0,0,w,h);for(let k=3;k<im.data.length;k+=4){const px=(k>>2)%w,py=(k>>2)/w|0;if(Math.hypot(px-w/2,py-h/2)/(w/2)>.92)im.data[k]=0;}g.putImageData(im,0,0);});
  // ---- 1. the ground shader: added after the Terrain Engine's own colour, on the island map's terrain only ----
  const UL={tDet:{value:detailTex},uLush:{value:1}};
  function patch(m){if(!m||m.__lush)return;m.__lush=1;const prev=m.onBeforeCompile;
    m.onBeforeCompile=function(s,r){if(prev)prev.call(this,s,r);Object.assign(s.uniforms,UL);
      s.fragmentShader='uniform sampler2D tDet;uniform float uLush;\n'+s.fragmentShader
        .replace('float bl=tn(vec2(q.x*7.,q.y*2.2))*.55+tn(vec2(q.x*2.4,q.y*8.))*.25+tn(q*21.)*.2;','float bl=uLush>.5?tn(q*5.)*.45+tn(q*13.+3.)*.35+tn(q*29.)*.2:tn(vec2(q.x*7.,q.y*2.2))*.55+tn(vec2(q.x*2.4,q.y*8.))*.25+tn(q*21.)*.2;')
        .replace(' diffuseColor.rgb=c;}',` if(uLush>.5){float n1=tf(q*.07+31.),n2=tf(q*.33+17.),n3=tn(q*1.9+5.);
   vec3 soil=sand(q,.95)*vec3(.86,.8,.7)*(.82+.3*n3);float bare=smoothstep(.52,.78,n1+(n2-.5)*.6)*.6+smoothstep(.7,.9,n3)*.15;c=mix(c,soil,isG*bare);   /* sandy limestone soil through thin grass */
   c=mix(c,c*vec3(1.08,1.02,.8),isG*smoothstep(.42,.72,n2)*.45);                                                                                      /* straw and olive patches */
   c=mix(c,soil*vec3(.62,.5,.38),isG*shade*.5*(.6+n3*.8));                                                                                            /* leaf litter in the shade */
   c*=1.-isG*max(0.,n2-.64)*.55;                                                                                                                       /* little dark hollows */
   vec3 dt=texture2D(tDet,q*.42).rgb;c*=mix(vec3(1.),dt*1.14,.75*isG+.45*isS);}                                                                      /* the camp's close-up texture */
 diffuseColor.rgb=c;}`);};
    /* fail soft: if the engine's shader text changes, the lab says so instead of guessing */
    const _o=m.onBeforeCompile;m.onBeforeCompile=function(s,r){_o.call(this,s,r);LUSH.shaderOK=s.fragmentShader.indexOf('uLush>.5){float n1')>0&&s.fragmentShader.indexOf('float bl=uLush')>0;};
    const k=m.customProgramCacheKey?m.customProgramCacheKey():'';m.customProgramCacheKey=()=>k+'-lush';m.needsUpdate=true;LUSH.patched++;}
  // ---- 2. ground detail round the camera (scene space, so it follows the island's mirror like everything else) ----
  const G=new THREE.Group();G.name='lushDetail';G.__pxSkip=1;G.__islKeep=1;
  const decalGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),pebGeo=new THREE.DodecahedronGeometry(1,0),shellGeo=new THREE.CircleGeometry(1,6).rotateX(-Math.PI/2);
  const litM=new THREE.MeshLambertMaterial({map:leafT,alphaTest:.4,polygonOffset:true,polygonOffsetFactor:-2}),pebM=new THREE.MeshLambertMaterial({color:0xa8a49a}),pebSM=new THREE.MeshLambertMaterial({color:0xd8cfbc}),shM=new THREE.MeshLambertMaterial({color:0xf2e8dc,polygonOffset:true,polygonOffsetFactor:-2});
  let at=null;const d=new THREE.Object3D(),c=new THREE.Color();
  const nz=(x,z)=>Math.sin(x*.21+Math.sin(z*.13)*2)*.5+Math.sin(z*.17-x*.07)*.5;/* patches: litter and pebbles cluster instead of a flat sprinkle */
  /* one instanced mesh per kind, made once at full size; each rebuild only rewrites matrices and the count (no new meshes, nothing freed) */
  const POOL={};function pool(key,geo,mat,cap){let im=POOL[key];if(!im){im=new THREE.InstancedMesh(geo,mat,cap);/* no per-instance colour: a material shared by instanced meshes with and without colours breaks three r128's program reuse */im.receiveShadow=true;im.castShadow=false;im.frustumCulled=false;im.__pxSkip=1;G.add(im);POOL[key]=im;}return im;}
  function rebuild(cx,cz){
    const gq=String((typeof GFX!=='undefined'&&GFX.level)||'').toLowerCase(),R=gq.startsWith('l')?12:gq.startsWith('m')?18:24,dens=gq.startsWith('l')?.5:gq.startsWith('m')?.8:1;
    const lit=[],peb=[],shell=[],n=Math.round(R*R*3.14*2.6*dens);
    for(let i=0;i<n;i++){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*R,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;let k='grass';
      try{const m=IBMAP.toMap(x,z);k=IBMAP.I.kindAt(m[0],m[1]);}catch(e){}if(k==='water'||k==='none')continue;if(blocked(x,z))continue;const y=groundY(x,z),p=nz(x,z),q=Math.random();
      if(k==='sand'){if(q<.35)shell.push([x,y,z,.04+Math.random()*.07]);else if(q<.45)peb.push([x,y,z,.05+Math.random()*.08,1]);continue;}
      if(k==='path'){if(q<.18)peb.push([x,y,z,.04+Math.random()*.06,1]);continue;}
      if(p>.15&&q<.55)lit.push([x,y,z,.9+Math.random()*1.3]);else if(q<.3+Math.max(0,-p)*.3)peb.push([x,y,z,.05+Math.random()*.12,0]);}
    const CAP=Math.round(24*24*3.14*2.6)+10;const put=(key,geo,mat,L,f)=>{const im=pool(key,geo,mat,CAP);const n=Math.min(L.length,CAP);for(let i=0;i<n;i++){f(L[i]);d.updateMatrix();im.setMatrixAt(i,d.matrix);}
      im.count=n;im.instanceMatrix.needsUpdate=true;};
    put('lit',decalGeo,litM,lit,([x,y,z,s])=>{d.position.set(x,y+.02,z);d.rotation.set(0,Math.random()*6.28,0);d.scale.setScalar(s);c.setHSL(.09+Math.random()*.03,.25,.78+Math.random()*.25);});
    put('pebG',pebGeo,pebM,peb.filter(e=>!e[4]),([x,y,z,s])=>{d.position.set(x,y+s*.2,z);d.rotation.set(Math.random()*3,Math.random()*6,Math.random()*3);d.scale.set(s*(1+Math.random()*.5),s*.55,s);});/* pale grey limestone on the grass; creamier on the beach and paths (pebS) */
    put('pebS',pebGeo,pebSM,peb.filter(e=>e[4]),([x,y,z,s])=>{d.position.set(x,y+s*.2,z);d.rotation.set(Math.random()*3,Math.random()*6,Math.random()*3);d.scale.set(s*(1+Math.random()*.5),s*.55,s);});
    put('shell',shellGeo,shM,shell,([x,y,z,s])=>{d.position.set(x,y+.015,z);d.rotation.set(0,Math.random()*6.28,0);d.scale.set(s,1,s*.7);c.setHSL(.07+Math.random()*.05,.3,.86+Math.random()*.1);});
    LUSH.pieces=lit.length+peb.length+shell.length;}
  if(!/lushnodet/.test(location.search+location.hash))(function loop(){requestAnimationFrame(loop);let ok=false;try{ok=IBMAP.done&&!!IBMAP.I;}catch(e){}if(!ok)return;
    /* see-through: the Foliage Engine thins leaves round one point; put it between Kip and the camera instead of on Kip */
    try{const I=IBMAP.I;if(!I.__lushUp){I.__lushUp=1;const _u=I.update;I.update=function(t,x,z,op){try{if(op&&op.reveal&&zoneOf(player.x)==='island'){const cl=camera.position.x*scene.scale.x,cz=camera.position.z,
        px=player.x+(cl-player.x)*.22,pz=player.z+(cz-player.z)*.22,m=IBMAP.toMap(px,pz);op=Object.assign({},op,{reveal:[m[0],m[1],Math.max(op.reveal[2]||2.6,4.5*(IBMAP.K||1))]});}}catch(e){}return _u.call(this,t,x,z,op);};}}catch(e){}
    try{const T=IBMAP.I.E&&IBMAP.I.E.terr;if(T&&T.material&&!T.material.__lush)patch(T.material);}catch(e){}/* the island is rebuilt after the Island Builder: patch the new ground too */
    if(!G.parent)scene.add(G);const on=zoneOf(camTarget.x)==='island'&&!VISIT;G.visible=on;if(!on)return;
    if(!at||Math.hypot(camTarget.x-at[0],camTarget.z-at[1])>7){at=[camTarget.x,camTarget.z];try{rebuild(at[0],at[1]);}catch(e){console.warn('lush',e);}}})();
  console.log('LUSH lab on: natural ground, ground detail round the camera, more trees');
})();
