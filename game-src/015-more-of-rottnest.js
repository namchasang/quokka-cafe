// ---------- more of Rottnest ----------
const SIGN_TEX=new Set(),FLIPPED=new Set();
function makeSign(lines,W,H,bg,fg){const c=mk(W,H);const draw=()=>{const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,W,H);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,1);x.fillRect(0,H-1,W,1);x.fillStyle=fg;x.font='bold 9px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';lines.forEach((l,i)=>x.fillText(l,W/2,(i+.5)*H/lines.length+.5));};
  draw();const t=ctex(c);SIGN_TEX.add(t);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{draw();t.needsUpdate=true;});return t;}
function signPost(x,z,tex,w,h){box(.1,1.5,.1,legMat,x,.75,z);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide,emissive:0x222222,emissiveMap:tex}));m.position.set(x,1.35,z+.07);m.castShadow=true;scene.add(m);col(x-.15,z-.15,x+.15,z+.15);}
// settlement cottages
const COTTAGES=[{x:-4.4,z:-8.3,wall:'#efe3c4',roof:'#3f7a5a'},{x:-.4,z:-8.5,wall:'#e8d2a6',roof:'#c9473f'}];
const winMat=new THREE.MeshLambertMaterial({color:0x4a6a86});
COTTAGES.forEach(cg=>{const g=new THREE.Group();const w=new THREE.Mesh(new THREE.BoxGeometry(3,1.9,2.4),lmat(plasterC,[2,2],{color:new THREE.Color(cg.wall)}));w.position.y=.95;w.castShadow=w.receiveShadow=true;g.add(w);
  const rf=new THREE.Mesh(new THREE.CylinderGeometry(1.75,1.75,3.4,3),new THREE.MeshLambertMaterial({color:new THREE.Color(cg.roof)}));rf.rotation.z=Math.PI/2;rf.position.y=2.35;rf.scale.set(1,1,.7);rf.castShadow=true;g.add(rf);
  const ver=new THREE.Mesh(new THREE.BoxGeometry(3.2,.08,.9),new THREE.MeshLambertMaterial({color:new THREE.Color(cg.roof)}));ver.position.set(0,1.72,1.6);ver.rotation.x=.25;ver.castShadow=true;g.add(ver);
  [-1.45,1.45].forEach(px=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.7,6),new THREE.MeshLambertMaterial({color:0xf3efe6}));p.position.set(px,.85,1.95);p.castShadow=true;g.add(p);});
  const d=new THREE.Mesh(new THREE.PlaneGeometry(.6,1.15),new THREE.MeshLambertMaterial({color:0x2f5a46}));d.position.set(.4,.58,1.21);g.add(d);
  const wn=new THREE.Mesh(new THREE.PlaneGeometry(.6,.5),winMat);wn.position.set(-.75,1.1,1.21);g.add(wn);
  const ch=new THREE.Mesh(new THREE.BoxGeometry(.3,.7,.3),lmat(plasterC,[1,1],{color:new THREE.Color('#c9b38a')}));ch.position.set(.9,2.65,-.3);ch.castShadow=true;g.add(ch);
  g.position.set(cg.x,0,cg.z);scene.add(g);col(cg.x-1.55,cg.z-1.25,cg.x+1.55,cg.z+1.25);});
// Bathurst Lighthouse on the east point
(()=>{const bx=46.5,bz=-4.5;const t=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,3.2,12),lmat(plasterC,[2,2]));t.position.set(bx,1.6,bz);t.castShadow=t.receiveShadow=true;scene.add(t);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.5,10),new THREE.MeshBasicMaterial({color:0xfff0b0}));top.position.set(bx,3.45,bz);scene.add(top);
  const cap=new THREE.Mesh(new THREE.ConeGeometry(.6,.6,10),new THREE.MeshLambertMaterial({color:0xc9473f}));cap.position.set(bx,4,bz);cap.castShadow=true;scene.add(cap);col(bx-.75,bz-.75,bx+.75,bz+.75);})();
// The Basin: sign, picnic table, snorkellers
signPost(19.5,-8.4,makeSign(['THE BASIN'],48,12,'#7a5033','#f5ecd8'),1.5,.4);
box(1.6,.08,.75,new THREE.MeshLambertMaterial({color:0xb98552}),17.2,.72,-8.6);[-.55,.55].forEach(o=>box(1.6,.06,.28,new THREE.MeshLambertMaterial({color:0xa8744a}),17.2,.42,-8.6+o));box(.12,.7,.5,legMat,16.6,.36,-8.6);box(.12,.7,.5,legMat,17.8,.36,-8.6);col(16.3,-9.1,18.1,-8.1);
const SNORK=["......yy..","..oooo.y..",".ohhhhoy..",".obbbbbo..",".ossssso..","wwwwwwwwww",".w..ww..w."];
const snorks=[[19,-12.4,'#6b4226','#f1c7a0'],[21.6,-12.9,'#d9b25a','#c68a5e']].map(([x,z,h,s])=>{const m=spriteMesh([pix(SNORK,{o:'#2a1d1a',h,b:'#2f6fb0',s,y:'#ffd34d',w:'#ffffff'})],.75,.52,{shadow:false});m.position.set(x,-.25,z);scene.add(m);return{m,x,z};});
// quokka crossing sign
(()=>{const c=mk(24,24),x=c.getContext('2d');x.fillStyle='#2a1d1a';x.beginPath();x.moveTo(12,0);x.lineTo(24,12);x.lineTo(12,24);x.lineTo(0,12);x.closePath();x.fill();x.fillStyle='#f1c64a';x.beginPath();x.moveTo(12,2);x.lineTo(22,12);x.lineTo(12,22);x.lineTo(2,12);x.closePath();x.fill();
  const q=pix(QK_TOP.concat(QK_LEGS.idle),{o:'#1a1410',b:'#1a1410',p:'#1a1410',e:'#1a1410',w:'#1a1410',n:'#1a1410',l:'#1a1410',c:'#1a1410',a:'#1a1410'});x.drawImage(q,4,4);
  const t=ctex(c);box(.1,1.6,.1,legMat,14.5,.8,1.3);const m=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:0x222222,emissiveMap:t}));m.position.set(14.5,1.55,1.37);m.castShadow=true;scene.add(m);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.28),new THREE.MeshLambertMaterial({map:makeSign(['QUOKKA CROSSING'],80,12,'#f5ecd8','#2a1d1a'),side:THREE.DoubleSide}));pl.position.set(14.5,.95,1.37);scene.add(pl);col(14.35,1.15,14.65,1.45);})();
// wildflowers (everlastings and pigface)
const flowerMats=[['#f4d23a','#fff3a8'],['#fbf7ee','#f4d23a'],['#e98bb8','#f9c6dd']].map(([a,b],v)=>{const r=mulberry32(500+v);const c=mk(10,7),x=c.getContext('2d');for(let i=0;i<6;i++){const fx=1+r()*8|0,fy=1+r()*3|0;x.fillStyle='#4f7a3a';x.fillRect(fx,fy+1,1,6-fy);x.fillStyle=a;x.fillRect(fx-1,fy,3,1);x.fillRect(fx,fy-1,1,3);x.fillStyle=b;x.fillRect(fx,fy,1,1);}
  const t=ctex(c);return new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.15,.15,.12),emissiveMap:t});});
flowerMats.forEach(m=>DECOR_MATS.add(m));
for(let i=0,n=0;i<1500&&n<60;i++){const x=-15+R()*63,z=-11+R()*20;if(landD(x,z)<2||pathD(x,z)<1.2||inGarden(x,z))continue;if(x>-6&&x<6&&z>-6&&z<4.4)continue;if(x>38.5&&z<-5.6)continue;
  const g=new THREE.PlaneGeometry(.75,.52);g.translate(0,.26,0);const m=new THREE.Mesh(g,flowerMats[n%3]);m.position.set(x,0,z);scene.add(m);BB.push(m);n++;}
// trees + bushes
function canopy(W,H,blobs,cols,r,trunk){const c=mk(W,H),x=c.getContext('2d');
  if(trunk){x.fillStyle='#3a2416';x.fillRect(trunk[0],trunk[1],5,H-trunk[1]);x.fillStyle='#6b4428';x.fillRect(trunk[0]+1,trunk[1],3,H-trunk[1]);x.fillStyle='#8a5a36';x.fillRect(trunk[0]+1,trunk[1]+2,1,H-trunk[1]-4);}
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){let inside=false,sh=-9;for(const [bx,by,br] of blobs){const dx=px-bx,dy=py-by,d=Math.sqrt(dx*dx+dy*dy);if(d<br){inside=true;sh=Math.max(sh,(-dx*.6-dy)/br);}}
    if(!inside)continue;let idx=sh>.55?3:sh>.12?2:sh>-.35?1:0;if(r()<.12)idx=Math.max(0,idx-1);x.fillStyle=cols[idx];x.fillRect(px,py,1,1);}
  const img=x.getImageData(0,0,W,H),d=img.data,out=new Uint8ClampedArray(d);
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){const k=(py*W+px)*4;if(d[k+3])continue;let n=false;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const X=px+a,Y=py+b;if(X>=0&&Y>=0&&X<W&&Y<H&&d[(Y*W+X)*4+3])n=true;});if(n){out[k]=30;out[k+1]=46;out[k+2]=30;out[k+3]=255;}}
  img.data.set(out);x.putImageData(img,0,0);return c;}
const TREE_COLS=[['#2d5a3d','#3f7a4a','#5f9a55','#8cbf6a'],['#355a2c','#4d7a36','#6e9a45','#a3c46a'],['#2f5238','#456f45','#668f50','#93b868']];
const treeVariants=[0,1,2].map(v=>{const r=mulberry32(100+v);const blobs=[];for(let i=0;i<7;i++)blobs.push([16+(r()-.5)*15,13+(r()-.5)*11,6+r()*5]);const c=canopy(32,44,blobs,TREE_COLS[v],r,[14,24]);
  const t=ctex(c);return{t,m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),f:new THREE.MeshLambertMaterial({map:t,alphaTest:.02,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};});
treeVariants.forEach(v=>{v.w=3.2;v.h=4.4;});treeVariants.push(pineVariant());
const bushVariants=[0,1].map(v=>{const r=mulberry32(200+v);const blobs=[];for(let i=0;i<4;i++)blobs.push([8+(r()-.5)*8,6+(r()-.5)*2,3.5+r()*2]);const c=canopy(16,10,blobs,TREE_COLS[v+1],r,null);const t=ctex(c);
  return{m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};});
