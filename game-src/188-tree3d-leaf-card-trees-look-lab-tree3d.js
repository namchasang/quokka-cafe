// ---------- 3D leaf-card trees (Look Lab layer: ?tree3d until TREE3D_LIVE is true) ----------
// Paul (Nov 2026): trees like his reference shots. Trunks and limbs are real 3D; the crown is many painted leaf-clump cards
// placed around the branches, lit as one soft ball (sunny top, shaded underside) and casting dappled shadows. Every tree,
// bush, jacaranda, gum and pine sprite is swapped in place (same spot, same size, same leaf colours read from its sprite).
// Light: deeper blue shade under trees and buildings. People and animals take the shade when they walk under a tree.
// Rottnest only for now (Paul approves before other maps). Not swapped yet: palms, grass tufts, plants built later on demand (trip maps, outer world).
const TREE3D_LIVE=false;
const TREE3D={pos:[],on:TREE3D_LIVE||/[?&#](tree3d|toon)\b/.test(location.search+location.hash),t:{value:0},n:0,cards:0,meshes:[],skipped:{}};
(function(){if(!TREE3D.on)return;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z),UP=V(0,1,0);
  // shared wind; leaf cards keep the light of their side of the crown on both faces
  function windify(mat,foliage){mat.onBeforeCompile=s=>{s.uniforms.uT3=TREE3D.t;
    s.vertexShader='uniform float uT3;\nattribute float aW;\n'+s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      {vec3 wpp=(modelMatrix*vec4(position,1.0)).xyz;float ph=wpp.x*.31+wpp.z*.23;
      transformed.x+=(sin(uT3*1.5+ph)*.06+sin(uT3*3.7+ph*2.3)*.02)*aW;transformed.z+=cos(uT3*1.2+ph*1.3)*.045*aW;}`);
    if(foliage)s.vertexShader=s.vertexShader.replace('#include <lights_lambert_vertex>','#include <lights_lambert_vertex>\n#ifdef DOUBLE_SIDED\nvLightBack=vLightFront;vIndirectBack=vIndirectFront;\n#endif');};
    mat.customProgramCacheKey=()=>'t3'+(foliage?'F':'');return mat;}
  class Batch{constructor(){this.p=[];this.n=[];this.u=[];this.w=[];this.i=[];}
    get v(){return this.p.length/3;}
    card(c,face,upH,w,h,roll,cell,nc,sway,nUp){nUp=nUp==null?.12:nUp;const z=face.clone().normalize();let x=new THREE.Vector3().crossVectors(upH,z);if(x.lengthSq()<1e-5)x.crossVectors(V(1,0,0),z);x.normalize();
      const y=new THREE.Vector3().crossVectors(z,x),cr=Math.cos(roll),sr=Math.sin(roll),X=x.clone().multiplyScalar(cr).addScaledVector(y,sr),Y=y.clone().multiplyScalar(cr).addScaledVector(x,-sr);
      const u0=(cell%2)*.5,v0=(cell>>1)*.5,b=this.v;
      for(const q of [[-1,-1,0,0],[1,-1,1,0],[1,1,1,1],[-1,1,0,1]]){const P=c.clone().addScaledVector(X,q[0]*w/2).addScaledVector(Y,q[1]*h/2);this.p.push(P.x,P.y,P.z);
        const N=P.clone().sub(nc).normalize();N.y+=nUp;N.normalize();this.n.push(N.x,N.y,N.z);this.u.push(u0+q[2]*.5,v0+q[3]*.5);this.w.push(sway*(.6+.4*q[1]));}
      this.i.push(b,b+1,b+2,b,b+2,b+3);TREE3D.cards++;}
    geo(g){const P=g.attributes.position,N=g.attributes.normal,UV=g.attributes.uv,b=this.v;
      for(let k=0;k<P.count;k++){this.p.push(P.getX(k),P.getY(k),P.getZ(k));this.n.push(N.getX(k),N.getY(k),N.getZ(k));this.u.push(UV.getX(k),UV.getY(k));this.w.push(0);}
      const I=g.index;for(let k=0;k<I.count;k++)this.i.push(b+I.getX(k));}
    build(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));
      g.setAttribute('uv',new THREE.Float32BufferAttribute(this.u,2));g.setAttribute('aW',new THREE.Float32BufferAttribute(this.w,1));g.setIndex(this.i);g.computeBoundingSphere();return g;}}
  function limb(B,a,b,r1,r2,seg){const d=new THREE.Vector3().subVectors(b,a),L=d.length();if(L<1e-3)return;const g=new THREE.CylinderGeometry(r2,r1,L*1.04,seg||6,1,true);g.translate(0,L/2,0);
    g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(UP,d.normalize())));g.translate(a.x,a.y,a.z);B.geo(g);g.dispose();}
  const randUnit=r=>{const u=r()*2-1,a=r()*6.2832,s=Math.sqrt(1-u*u);return V(s*Math.cos(a),u,s*Math.sin(a));};
  // ---- painted leaf atlases (2x2 clumps), coloured from each sprite's own dark/light leaf colours ----
  const hx=c=>'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
  function palOf(P){const R=l2ramp(P.dk,P.lt);return [R[0],R[1],R[2],R[3],R[4],R[6]].map(c=>hx(c));}
  function leafShape(g,x,y,len,wid,ang,col,vein){g.save();g.translate(x,y);g.rotate(ang);g.beginPath();g.moveTo(0,-len/2);g.quadraticCurveTo(wid,0,0,len/2);g.quadraticCurveTo(-wid,0,0,-len/2);g.fillStyle=col;g.fill();
    if(vein){g.strokeStyle=vein;g.lineWidth=1;g.beginPath();g.moveTo(0,-len/2+2);g.lineTo(0,len/2-3);g.stroke();}g.restore();}
  function atlas(kind,pal,seed){const cv=mk(256,256),g=cv.getContext('2d'),r=mulberry32(seed);
    const pick=t=>{let k=Math.floor(t*pal.length+(r()-.5)*2.2);return pal[Math.max(0,Math.min(pal.length-1,k))];};
    for(let cell=0;cell<4;cell++){const ox=(cell%2)*128,oy=(cell>>1)*128,C=128;g.save();g.beginPath();g.rect(ox,oy,C,C);g.clip();g.translate(ox,oy);
      if(kind==='pine'){const stems=[[64,124,64+(r()-.5)*10,6,3]];for(let s=0;s<4;s++){const t=.25+s*.17,sy=124-t*118,sd=s%2?1:-1;stems.push([64,sy,64+sd*(26+r()*10),sy-18-r()*10,1.6]);}
        for(const [x0,y0,x1,y1,w] of stems){g.strokeStyle='#4a3a26';g.lineWidth=w;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();const n=w>2?46:20,dx=x1-x0,dy=y1-y0,a0=Math.atan2(dy,dx);
          for(let k=0;k<n;k++){const t=k/n,x=x0+dx*t,y=y0+dy*t,len=(w>2?16:10)*(1-t*.45)+r()*3;for(const sg of[-1,1]){const a=a0+sg*(.75+r()*.3);g.strokeStyle=pick(1-y/C*.8+t*.25);g.lineWidth=1.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*len,y+Math.sin(a)*len);g.stroke();}}}}
      else if(kind==='tuft'){for(let i=0;i<34;i++){const x0=64+(r()-.5)*40,a=-Math.PI/2+(r()-.5)*1.2,l=50+r()*62;g.strokeStyle=pick(.25+r()*.75);g.lineWidth=3+r()*2;g.lineCap='round';g.beginPath();g.moveTo(x0,128);g.quadraticCurveTo(x0+Math.cos(a)*l*.45,128+Math.sin(a)*l*.6,x0+Math.cos(a)*l,128+Math.sin(a)*l);g.stroke();}}
      else if(kind==='palm'){g.strokeStyle='#7a6a3a';g.lineWidth=3;g.beginPath();g.moveTo(64,128);g.quadraticCurveTo(66,60,62,4);g.stroke();
        for(let k=0;k<40;k++){const t=k/40,y=124-t*118,x=64+Math.sin(t*2)*2,len=(30-22*t)+r()*5;for(const sg of[-1,1]){g.strokeStyle=pick(.3+r()*.6+t*.1);g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+sg*len,y-len*.35+8);g.stroke();}}}
      else{const n={broad:160,gum:110,jac:160,bush:190}[kind]||160,L=[];
        for(let i=0;i<n;i++){const a=r()*6.2832,rr=Math.sqrt(r())*(kind==='gum'?50:48);L.push([64+Math.cos(a)*rr,64+Math.sin(a)*rr*.92]);}L.sort((a,b)=>b[1]-a[1]);
        for(const [x,y] of L){const t=1-y/C;let len,wid,ang;if(kind==='gum'){len=22+r()*9;wid=4.2;ang=Math.PI*.15+(r()-.5)*1.6;}else if(kind==='bush'){len=7+r()*4;wid=4.2;ang=r()*6.28;}else if(kind==='jac'){len=9+r()*4;wid=5;ang=r()*6.28;}else{len=14+r()*6;wid=4.8;ang=(r()-.5)*1.4;}
          leafShape(g,x,y,len,wid,ang,pick(t*.78),r()<.35?pick(t+.3):null);}}
      g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(0,0,0,C);gr.addColorStop(0,'rgba(255,248,210,.10)');gr.addColorStop(1,'rgba(6,20,12,.3)');g.fillStyle=gr;g.fillRect(0,0,C,C);g.globalCompositeOperation='source-over';g.restore();}
    const t=new THREE.CanvasTexture(cv);t.encoding=renderer.outputEncoding===THREE.sRGBEncoding?THREE.sRGBEncoding:THREE.LinearEncoding;t.anisotropy=4;return t;}
  function barkTex(c,pale){const cv=mk(32,64),g=cv.getContext('2d'),r=mulberry32(7+(pale?1:0));g.fillStyle=hx(c);g.fillRect(0,0,32,64);
    for(let i=0;i<70;i++){g.fillStyle=hx(c.map(v=>v*(r()<.5?.7:1.2)));if(pale){g.globalAlpha=.5;g.beginPath();g.ellipse(r()*32,r()*64,2+r()*4,3+r()*6,0,0,6.28);g.fill();g.globalAlpha=1;}else g.fillRect(r()*32,r()*64,1+r()*2,4+r()*10);}
    const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
  // ---- species, sized to the sprite they replace (H tall, W wide) ----
  const BUILD={
    broad(B,K,x,z,H,W,r){const th=H*.42,fork=V(x+(r()-.5)*W*.06,th,z);limb(K,V(x,0,z),fork,W*.07,W*.05);
      const cc=V(x,H*.64,z),rx=W*.42,ry=H*.27,nc=V(x,H*.4,z),nCl=5+((r()*2)|0);
      const cl=[[cc.clone().add(V(0,ry*.55,0)),rx*.62]];for(let i=0;i<nCl;i++){const a=i/nCl*6.2832+r()*.5,c=V(x+Math.cos(a)*rx*.62,cc.y+(r()-.4)*ry*.8,z+Math.sin(a)*rx*.62);cl.push([c,rx*(.45+r()*.15)]);limb(K,fork,c.clone().lerp(fork,.35),W*.035,W*.018,5);}
      const sz=W*.3;for(const [c,rad] of cl)for(let k=0;k<16;k++){const d=randUnit(r);d.y=Math.abs(d.y)*.8-.15;d.normalize();B.card(c.clone().addScaledVector(d,rad*(.5+.5*r())),d,UP,sz*(.85+r()*.35),sz*(1+r()*.35),(r()-.5)*.5,(r()*4)|0,nc,.5);}},
    gum(B,K,x,z,H,W,r){const fork=V(x,H*.45,z);limb(K,V(x,0,z),fork,W*.08,W*.06);const nc=V(x,H*.55,z),n=3+((r()*2)|0),sz=W*.3;
      for(let i=0;i<n;i++){const a=i/n*6.2832+r()*.7,rr=W*(.28+r()*.14),end=V(x+Math.cos(a)*rr,H*(.72+r()*.16),z+Math.sin(a)*rr);limb(K,fork,end,W*.04,W*.02,5);
        const rad=W*.24;for(let k=0;k<22;k++){const d=randUnit(r);d.y=Math.abs(d.y)*.9-.1;d.normalize();B.card(end.clone().addScaledVector(d,rad*(.45+.55*r())),d,UP,sz,sz*1.1,(r()-.5)*.6,(r()*4)|0,nc,.45);}}},
    pine(B,K,x,z,H,W,r){limb(K,V(x,0,z),V(x,H*.98,z),W*.07,W*.02,6);const tiers=Math.max(5,Math.round(H*1.1));
      for(let t=0;t<tiers;t++){const y=H*.18+(H*.78)*t/(tiers-1),L=W*.5*(1-t/tiers)+W*.08,arms=t>tiers-3?3:5,a0=r()*6.28,c0=V(x,y,z),nc=V(x,y-H*.15,z);
        for(let a=0;a<arms;a++){const ang=a0+a/arms*6.2832+(r()-.5)*.4,dir=V(Math.cos(ang),-.08-.1*r(),Math.sin(ang)).normalize(),side=new THREE.Vector3().crossVectors(dir,UP).normalize(),n=Math.max(1,Math.round(L/(W*.16)));
          for(let k=0;k<n;k++){const tt=(k+.6)/n,c=c0.clone().addScaledVector(dir,L*tt);c.y-=tt*tt*H*.03;const sz=W*.26+L*.25*(1-tt*.5);
            B.card(c,UP.clone().addScaledVector(dir,.18),dir,sz*.85,sz,(r()-.5)*.3,(r()*4)|0,nc,.35*tt,.5);B.card(c,side.clone().add(V(0,.25,0)),dir.clone().add(V(0,.15,0)),sz*.7,sz*.95,(r()-.5)*.3,(r()*4)|0,nc,.35*tt,.5);}}}
      B.card(V(x,H*.97,z),V(1,.2,0),UP,W*.18,H*.12,0,0,V(x,H*.8,z),.3,.5);},
    bush(B,K,x,z,H,W,r){const nc=V(x,-H*.4,z),n=2+((r()*2)|0),sz=Math.max(.35,W*.36);
      for(let i=0;i<n;i++){const c=V(x+(r()-.5)*W*.35,H*(.45+r()*.15),z+(r()-.5)*W*.35),rad=W*(.26+r()*.08);
        for(let k=0;k<12;k++){const d=randUnit(r);d.y=Math.abs(d.y);d.normalize();B.card(c.clone().addScaledVector(d,rad*(.4+.6*r())),d,UP,sz,sz,r()*6.28,(r()*4)|0,nc,.18,.6);}}}
  };
  BUILD.tuft=function(B,K,x,z,H,W,r){const nc=V(x,-3,z);for(let i=0;i<3;i++){const a=i*1.047+r()*.4;B.card(V(x,H*.5,z),V(Math.cos(a),0,Math.sin(a)),UP,W,H,0,(r()*4)|0,nc,.45,1.2);}};
  BUILD.palm=function(B,K,x,z,H,W,r){const lean=V((r()-.5)*.5,0,(r()-.5)*.5);let prev=V(x,0,z);const top=V(x+lean.x*H*.3,H*.82,z+lean.z*H*.3);
    for(let k=1;k<=5;k++){const t=k/5,p=V(x+lean.x*H*.3*t*t,H*.82*t,z+lean.z*H*.3*t*t);limb(K,prev,p,W*.07*(1.2-t*.4),W*.07*(1.2-(t+.2)*.4),6);prev=p;}
    const n=9,len=W*.62;for(let i=0;i<n;i++){const a=i/n*6.2832+r()*.3,dir=V(Math.cos(a),-.25-.2*r(),Math.sin(a)).normalize(),c=top.clone().addScaledVector(dir,len*.5);c.y-=len*.12;
      B.card(c,UP.clone().addScaledVector(dir,.35),dir,len*.42,len,0,(r()*4)|0,top.clone().add(V(0,-H*.3,0)),.5,.5);}};
  BUILD.jac=BUILD.broad;BUILD.boab=BUILD.broad;
  // ---- find every plant sprite and its parsed info ----
  const parsed=new Map();
  function infoOf(o){const L=o.__l2,t0=(L&&L.orig&&L.orig.m&&L.orig.m.map)||(o.material&&o.material.map);if(!t0)return null;
    if(t0.__l2&&t0.__l2.P)return t0.__l2.P;if(t0.__l2&&t0.__l2.none)return null;
    const src=(t0.__l2&&t0.__l2.v1)||t0.__src||t0.image;if(!src||!src.getContext||src.width>96||src.width*src.height<100)return null;
    if(!parsed.has(src)){let P=null;try{P=plantParse(src);}catch(e){}parsed.set(src,P);}return parsed.get(src);}
  const groups=new Map(),texCache=new Map(),barkCache=new Map(),gone=[];const CH=24;
  BB.slice().forEach((o,i)=>{if(!o.isMesh||o.userData.frames||!o.parent)return;if(typeof SIGN_TEX!=='undefined'&&o.material&&SIGN_TEX.has(o.material.map))return;
    // Paul (Nov 2026): Rottnest only until he approves the look for the other maps
    let isl=false;try{const wp=o.getWorldPosition(new THREE.Vector3());isl=zoneOf(o.parent===scene?o.position.x:wp.x)==='island';}catch(e){}if(!isl)return;
    const P=infoOf(o);if(!P)return;const gp=o.geometry&&o.geometry.parameters;if(!gp||!gp.height)return;const H=gp.height*Math.abs(o.scale.y),W=gp.width*Math.abs(o.scale.x);
    let kind=P.kind;if(kind==='grass')kind=W>=.6?'bush':(H>=.25?'tuft':null);if(!kind||!BUILD[kind]){TREE3D.skipped[P.kind]=(TREE3D.skipped[P.kind]||0)+1;return;}if(H<.2)return;
    const pal=palOf(P),bk=['pine','bush','gum','jac','tuft','palm'].includes(kind)?kind:'broad',tk=bk+pal[2]+pal[4];TREE3D.pos.push([o.position.x,o.position.z,Math.max(W,1)]);
    if(!texCache.has(tk)){const t=atlas(bk,pal,texCache.size*131+7);const mat=windify(new THREE.MeshLambertMaterial({map:t,alphaTest:.45,side:THREE.DoubleSide,emissive:new THREE.Color(.05,.06,.03)}),true);
      const dep=windify(new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.45}),false);texCache.set(tk,{mat,dep});}
    const bkey=kind==='gum'?'gum':hx(P.barkC.map(v=>Math.round(v/24)*24));if(!barkCache.has(bkey))barkCache.set(bkey,new THREE.MeshLambertMaterial({map:barkTex(P.barkC,kind==='gum')}));
    const x=o.position.x,z=o.position.z,gk=o.parent.uuid+'|'+Math.floor(x/CH)+','+Math.floor(z/CH);
    let G=groups.get(gk);if(!G){G={parent:o.parent,y:o.position.y,leaf:new Map(),bark:new Map()};groups.set(gk,G);}
    if(!G.leaf.has(tk))G.leaf.set(tk,new Batch());if(!G.bark.has(bkey))G.bark.set(bkey,new Batch());
    const r=mulberry32((Math.round(x*10)*73856093^Math.round(z*10)*19349663)>>>0);
    // the sprite's crown is drawn a bit wider than the tree; 3D crowns read fuller, so keep them a touch narrower
    BUILD[kind](G.leaf.get(tk),G.bark.get(bkey),x,z,H,W*(kind==='bush'?1:.92),r);
    G.y=Math.min(G.y,o.position.y);gone.push(o);TREE3D.n++;});
  // swap: the sprite leaves the scene, the 3D tree takes its place (same parent, so towns that hide and show still work)
  const goneSet=new Set(gone);for(let i=BB.length-1;i>=0;i--)if(goneSet.has(BB[i]))BB.splice(i,1);
  if(typeof trees!=='undefined')trees.forEach(t=>{if(t.m&&goneSet.has(t.m))t.m.__t3=true;});
  gone.forEach(o=>o.parent&&o.parent.remove(o));
  groups.forEach(G=>{G.leaf.forEach((B,tk)=>{if(!B.v)return;const T=texCache.get(tk),m=new THREE.Mesh(B.build(),T.mat);m.customDepthMaterial=T.dep;m.castShadow=m.receiveShadow=true;m.position.y=G.y;m.__t3=1;G.parent.add(m);TREE3D.meshes.push(m);});
    G.bark.forEach((B,bk)=>{if(!B.v)return;const m=new THREE.Mesh(B.build(),barkCache.get(bk));m.castShadow=m.receiveShadow=true;m.position.y=G.y;m.__t3=1;G.parent.add(m);TREE3D.meshes.push(m);});});
  // tiny pixel sprites that stay (grass tufts, flowers, pebbles): repaint each pixel as a soft painted dab at 6x size
  const paintC=new Map(),matC=new Map();
  function paintUp(img){if(paintC.has(img))return paintC.get(img);const W=img.width,H=img.height,S=6,c0=mk(W,H),x0=c0.getContext('2d');x0.drawImage(img,0,0);const d=x0.getImageData(0,0,W,H).data;
    const cv=mk(W*S,H*S),g=cv.getContext('2d'),r=mulberry32(W*31+H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(d[i+3]<128)continue;const lt=1+(1-y/H)*.12;g.fillStyle=`rgb(${Math.min(255,d[i]*lt)|0},${Math.min(255,d[i+1]*lt)|0},${Math.min(255,d[i+2]*lt)|0})`;
      g.beginPath();g.ellipse((x+.5)*S+(r()-.5)*2,(y+.5)*S+(r()-.5)*2,S*.62,S*.78,(r()-.5)*.8,0,6.2832);g.fill();}
    const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding===undefined?t.encoding:(renderer.outputEncoding===THREE.sRGBEncoding?THREE.sRGBEncoding:THREE.LinearEncoding);t.anisotropy=4;paintC.set(img,t);return t;}
  function onIsl(o){try{let x=o.position.x;if(o.isInstancedMesh&&o.count){const e=o.instanceMatrix.array;x=e[12];}if(o.parent!==scene){const v=new THREE.Vector3(x,0,o.position.z);if(o.parent)o.parent.localToWorld(v);scene.worldToLocal(v);x=v.x;}return zoneOf(x)==='island';}catch(e){return false;}}
  function repaint(){scene.traverse(o=>{if(!(o.isMesh||o.isInstancedMesh)||o.__t3)return;const m=o.material;if(!m||Array.isArray(m)||!m.map||!m.map.image||!(m.alphaTest>0))return;const im=m.map.image;
      if(!im.getContext||im.width>24||im.height>16||(o.userData&&o.userData.frames&&o.userData.frames.length>1))return;if(!onIsl(o))return;
      if(!matC.has(m)){const n=m.clone();n.map=paintUp(im);if(n.emissiveMap)n.emissiveMap=n.map;n.alphaTest=.5;matC.set(m,n);}o.material=matC.get(m);o.__t3=1;
      if(o.customDepthMaterial&&o.customDepthMaterial.map){const dd=o.customDepthMaterial.clone();dd.map=matC.get(m).map;o.customDepthMaterial=dd;}});}
  [500,3000,9000,20000].forEach(t=>setTimeout(()=>{try{repaint();}catch(e){console.warn('t3 repaint',e);}},t));
  // people and animals take the shade
  BB.forEach(o=>{if(o.userData&&o.userData.frames)o.receiveShadow=true;});if(typeof DIR4!=='undefined')DIR4.forEach(o=>o.receiveShadow=true);
  // deeper, bluer shade: less sky fill, a little more sun (applied after the time of day sets the lights)
  const _applyTime=applyTime;applyTime=function(){_applyTime.apply(this,arguments);hemi.intensity*=.58;sun.intensity*=1.22;};
  hemi.color.set('#a9bff0');hemi.groundColor.set('#4a5634');
  try{console.log('T3D isl.done='+(typeof ISL!=='undefined'&&ISL.done));}catch(e){}
  try{console.log('T3D trees '+TREE3D.n+' cards '+TREE3D.cards+' meshes '+TREE3D.meshes.length+' skipped '+JSON.stringify(TREE3D.skipped));}catch(e){}
  window.__SCN=scene;window.__T3=TREE3D;window.__REN=renderer;window.__ISLP=()=>({DECK,JETTY,GARDEN,COACH:COACH.map(c=>[c.name,c.x,c.z]),PLOTS:PLOTS.map(p=>[p.x,p.z]),XPL:(typeof XPL_STOPS!=='undefined'?XPL_STOPS.map(s=>[s[1],s[2],s[3]]):[])});
  let _t=performance.now();(function T3(){const n=performance.now();TREE3D.t.value+=Math.min(.1,(n-_t)/1000);_t=n;requestAnimationFrame(T3);})();
})();
