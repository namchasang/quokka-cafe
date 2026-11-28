// ---------- Rottnest groves: tea trees and island pines built like the camp's forest (Look Lab ?groves, Paul 28 Nov 2026) ----------
// Paul: 'ทำต้นไม้พันธุ์ Rottnest (ทีทรี สนเกาะ) ด้วยวิธีเดียวกับต้นไม้แคมป์และ Tree Lab ให้ขึ้นเป็นดง'. The camp's recipe (Stream & Falls
// Engine, part 6): every crown is ~100 leaf cards painted with real leaf shapes, each card's normal points out from the crown so
// the crown shades like a soft ball, a trunk plus branches underneath, crowns and trunks merged per area so it stays a few draws.
// Two Rottnest species, in groves (thickets), never on roads, paths, rail, beach, buildings or the café front:
// - Rottnest tea tree: low, leaning multi-stem trunks, a wide flat dense crown of small dark olive leaves; thickets near the coast;
// - Rottnest island pine: a straight trunk and a narrow cone of fine dark-green foliage; stands inland, often by the salt lakes.
// Built after the island map and again after the Island Builder changes it. Off for players: ?groves turns it on.
var GROVES_LIVE=false;
const GROVES={on:GROVES_LIVE||/[?&#]groves\b/.test(location.search+location.hash),trees:0,ms:0};
window.__GROVES=GROVES;
if(GROVES.on)(()=>{
  const cnv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.LinearEncoding;t.anisotropy=4;return t;};
  /* leaf atlas, 4 tiles: tea tree x2 (short narrow leaves, a few cream flower tufts), pine x2 (fine scale-leaf sprays) */
  const leafTex=cnv(256,256,(g,w,h)=>{const r=Math.random;
    for(let q=0;q<4;q++){const ox=(q%2)*w/2,oy=(q>>1)*h/2,cx=ox+w/4,cy=oy+h/4;
      if(q<2){for(let i=0;i<70;i++){const a=r()*7,d=r()*w*.19;g.save();g.translate(cx+Math.cos(a)*d,cy+Math.sin(a)*d);g.rotate(r()*7);
          g.fillStyle=['#3c5228','#4a6230','#2f4521','#5a6e3a','#435a2c'][(i+q)%5];g.beginPath();g.ellipse(0,0,8,2.6,0,0,7);g.fill();g.restore();}
        if(q===1)for(let i=0;i<7;i++){g.fillStyle='rgba(238,232,206,.95)';g.beginPath();g.arc(cx+(r()-.5)*w*.3,cy+(r()-.5)*h*.3,2.5+r()*2,0,7);g.fill();}}
      else{for(let s=0;s<16;s++){const a=r()*7,len=18+r()*26,x0=cx+(r()-.5)*w*.2,y0=cy+(r()-.5)*h*.2;g.strokeStyle=['#2c4426','#35502c','#406034','#253b20'][s%4];g.lineWidth=2.2;
          g.beginPath();g.moveTo(x0,y0);const x1=x0+Math.cos(a)*len,y1=y0+Math.sin(a)*len;g.lineTo(x1,y1);g.stroke();
          for(let k=1;k<7;k++){const t=k/7,px=x0+(x1-x0)*t,py=y0+(y1-y0)*t,b=a+(k%2?1:-1)*.7;g.lineWidth=1.4;g.beginPath();g.moveTo(px,py);g.lineTo(px+Math.cos(b)*6,py+Math.sin(b)*6);g.stroke();}}}}
    const im=g.getImageData(0,0,w,h);for(let k=3;k<im.data.length;k+=4){const px=(k>>2)%w,py=(k>>2)/w|0,lx=px%(w/2)-w/4,ly=py%(h/2)-h/4;if(Math.hypot(lx,ly)>w*.23)im.data[k]=0;}g.putImageData(im,0,0);});
  const leafMat=new THREE.MeshLambertMaterial({map:leafTex,alphaTest:.5,side:THREE.DoubleSide});
  const leafDepth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:leafTex,alphaTest:.5});
  const barkTea=new THREE.MeshLambertMaterial({color:0x6e5a46}),barkPine=new THREE.MeshLambertMaterial({color:0x4a3a2c});
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  /* the camp's crown: n cards on an ellipsoid, normals pushed out and up; tiles: tea 0/1, pine 2/3 */
  function crown(cx,cy,cz,rx,ry,n,s,tiles,P,N,U,I,cone){for(let i=0;i<n;i++){const v=new THREE.Vector3(rnd()-.5,rnd()-.5,rnd()-.5).normalize();v.y=Math.abs(v.y)*.7+v.y*.3;
      let k=.55+rnd()*.45,yy=v.y*ry*k,rr=rx;if(cone){/* narrow towards the top */const t=Math.min(1,Math.max(0,(yy/ry+1)/2));rr=rx*(1.05-t*.9);}
      const p=new THREE.Vector3(v.x*rr*k,yy,v.z*rr*k);const nr=v.clone().add(new THREE.Vector3(0,.4,0)).normalize();
      const ax=new THREE.Vector3(rnd()-.5,rnd()-.5,rnd()-.5).normalize(),ay=new THREE.Vector3().crossVectors(nr,ax).normalize();ax.crossVectors(ay,nr);
      const q=tiles[rnd()*tiles.length|0],u0=(q%2)*.5,v0=(q>>1)*.5,b=P.length/3,ss=s*(.8+rnd()*.5);
      [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,c])=>{const w=p.clone().addScaledVector(ax,a*ss/2).addScaledVector(ay,c*ss/2);P.push(cx+w.x,cy+w.y,cz+w.z);N.push(nr.x,nr.y,nr.z);U.push(u0+(a+1)/4,.5-v0+(c+1)/4);/* canvas tiles: row 0 is the top (flipY) */});I.push(b,b+1,b+2,b,b+2,b+3);}}
  const G=new THREE.Group();G.name='groves';G.__pxSkip=1;G.__islKeep=1;let builtFor=null;
  function clear(){while(G.children.length){const m=G.children.pop();try{m.geometry.dispose();}catch(e){}}}
  function build(){const t0=performance.now();clear();seed=7;const I=IBMAP.I;
    const kind=(x,z)=>{const m=IBMAP.toMap(x,z);return I.kindAt(m[0],m[1]);};const cafe=IW(0,0);
    const ok=(x,z)=>{if(kind(x,z)!=='grass')return false;if(blocked(x,z))return false;if(Math.hypot(x-cafe.x,z-cafe.z)<17)return false;
      for(const [dx,dz] of [[1.8,0],[-1.8,0],[0,1.8],[0,-1.8]])if(kind(x+dx,z+dz)!=='grass')return false;/* keep a crown's width off paths and sand */
      try{if(IBMAP.onPathMap&&IBMAP.onPathMap(...IBMAP.toMap(x,z),2.2))return false;}catch(e){}return true;};
    const shoreD=(x,z)=>{try{return IBMAP.landD(x,z);}catch(e){return 10;}};
    /* grove centres over the whole island; tea tree thickets near the coast, pine stands inland */
    const trees=[];const minD=(x,z,r)=>trees.every(t=>Math.hypot(t.x-x,t.z-z)>r);
    for(let g=0;g<3000&&trees.length<520;g++){const m=[(rnd()-.5)*250,(rnd()-.5)*250],c=IBMAP.toGame(m[0],m[1]);const cx=c[0],cz=c[1];if(!ok(cx,cz))continue;
      const sd=shoreD(cx,cz);let pine=sd>14?rnd()<.65:rnd()<.12,n=pine?5+(rnd()*8|0):8+(rnd()*12|0),R=pine?6+rnd()*4:5+rnd()*5;
      for(let i=0;i<n*3&&n>0;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*R,x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;if(!ok(x,z)||!minD(x,z,pine?1.9:2.2))continue;
        trees.push({x,z,y:groundY(x,z),pine,ht:pine?5+rnd()*3.5:3+rnd()*2.2});if(--n<=0)break;}}
    /* merged per 48-unit cell, so whole groves drop out of view together */
    const cells=new Map();trees.forEach(t=>{const k=Math.floor(t.x/48)+','+Math.floor(t.z/48);(cells.get(k)||cells.set(k,[]).get(k)).push(t);});
    const tg=new THREE.CylinderGeometry(.09,.16,1,6).translate(0,.5,0),d=new THREE.Object3D();
    cells.forEach(L=>{const P=[],N=[],U=[],Ix=[];const stems=[];
      L.forEach(t=>{if(t.pine){crown(t.x,t.y+t.ht*.52,t.z,t.ht*.24,t.ht*.48,125,t.ht*.17,[2,3],P,N,U,Ix,true);stems.push([t.x,t.y,t.z,t.ht*.45,.0,0,1.25,barkPine]);/* dense column almost to the ground, a short trunk */}
        else{crown(t.x,t.y+t.ht*.68,t.z,t.ht*.5,t.ht*.24,95,t.ht*.2,[0,0,1],P,N,U,Ix,false);const k=2+(rnd()*2|0);/* leaning multi-stem tea tree */
          for(let s=0;s<k;s++){const a=rnd()*6.283;stems.push([t.x+Math.cos(a)*.25,t.y,t.z+Math.sin(a)*.25,t.ht*.62,Math.cos(a)*.4,Math.sin(a)*.4,1,barkTea]);}}});
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(Ix);g.computeBoundingSphere();
      const cm=new THREE.Mesh(g,leafMat);cm.customDepthMaterial=leafDepth;cm.castShadow=cm.receiveShadow=true;cm.__pxSkip=1;G.add(cm);
      [barkTea,barkPine].forEach(mat=>{const S=stems.filter(s=>s[7]===mat);if(!S.length)return;const im=new THREE.InstancedMesh(tg,mat,S.length);
        S.forEach(([x,y,z,h,rx,rz,th],i)=>{d.position.set(x,y-.1,z);d.rotation.set(rx,rnd()*6,rz);d.scale.set(th,h,th);d.updateMatrix();im.setMatrixAt(i,d.matrix);});
        im.castShadow=true;im.receiveShadow=true;im.__pxSkip=1;im.computeBoundingSphere&&im.computeBoundingSphere();G.add(im);});});
    if(!G.parent)scene.add(G);GROVES.trees=trees.length;GROVES.pines=trees.filter(t=>t.pine).length;GROVES.cells=cells.size;GROVES.ms=Math.round(performance.now()-t0);
    console.log('GROVES: '+trees.length+' trees ('+GROVES.pines+' pines) in '+cells.size+' cells, '+GROVES.ms+' ms');}
  (function loop(){let ok=false;try{ok=IBMAP.done&&!!IBMAP.I;}catch(e){}
    if(ok&&builtFor!==IBMAP.I){builtFor=IBMAP.I;try{build();}catch(e){GROVES.err=String(e&&e.stack||e).slice(0,300);console.warn('groves',e);}}
    try{G.visible=zoneOf(camTarget.x)==='island'&&!VISIT;}catch(e){}setTimeout(loop,1000);})();
})();
