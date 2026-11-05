// ---------- painter for 32px creature sprites ----------
function painter(W,H){const c=mk(W,H),x=c.getContext('2d'),img=x.createImageData(W,H),D=img.data;
  const set=(i,j,col)=>{i|=0;j|=0;if(i<0||j<0||i>=W||j>=H)return;const k=(j*W+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;};
  const ell=(cx,cy,rx,ry,pal)=>{for(let j=0;j<H;j++)for(let i=0;i<W;i++){const dx=(i+.5-cx)/rx,dy=(j+.5-cy)/ry,d=dx*dx+dy*dy;if(d>1)continue;const l=(-dx*.5-dy*.8)*.55+(1-d)*.55;let k=Math.round((l+.35)/1.3*(pal.length-1));k=clamp(k,0,pal.length-1);if((i+j)&1&&d>.75)k=Math.max(0,k-1);set(i,j,pal[k]);}};
  return{set,ell,done:o=>{x.putImageData(img,0,0);return outlineCanvas(c,o||[40,32,28]);}};}
// ---------- animals painted like Kip (Paul, Nov 2026): soft round volumes, light from the top left, a dark outline, at about three times the old pixels ----------
function RAMP(c,n=5){const h=parseInt(c.slice(1),16),r=(h>>16)&255,g=(h>>8)&255,b=h&255;return[...Array(n)].map((_,i)=>{const f=.55+i*(.75/(n-1));return[Math.min(255,r*f|0),Math.min(255,g*f|0),Math.min(255,b*f|0)];});}
function swan32(){const P=painter(36,30),B=RAMP('#2c2c36'),W=RAMP('#e8e2d6',4),R=RAMP('#d8342a',4);
  P.ell(20,22,13,6.2,B);P.ell(26,19,6,4,B);P.ell(9,17,2.6,9,B);P.ell(10,7.5,4,3.2,B);P.ell(15,8.5,3.6,1.6,R);P.set(16,8,[240,230,220]);P.set(10,6,[255,255,255]);P.set(11,6,[20,20,24]);
  for(let i=0;i<5;i++)P.ell(24+i*1.6,19-i*.6,1.6,2.6,W.slice(0,3));return P.done([14,14,18]);}
function gull32(flap){const P=painter(36,18),W=RAMP('#f2f0ea'),G=RAMP('#9aa0a8',4),Y=RAMP('#e8a020',3);
  P.ell(18,10,7,3.4,W);P.ell(25,8.5,3,2.6,W);P.ell(29,9,2.2,.9,Y);P.set(26,8,[20,20,24]);
  if(flap){P.ell(10,9,7,1.6,G);P.ell(26,8.8,0,0,G);P.ell(12,9,5,1.2,W.slice(2));}else{for(let i=0;i<9;i++){P.ell(10-i*.9,7-i*.6,2.2,1.4,G);P.ell(24+i*.9,6.6-i*.6,2,1.3,G);}}
  P.ell(9,11,3,1.2,W);return P.done([58,58,64]);}
function pelican32(){const P=painter(42,42),W=RAMP('#f2f0ea'),K=RAMP('#3a3a40',4),Y=RAMP('#f2c45a',4),L=RAMP('#e8a040',3);
  P.ell(21,26,11,10,W);P.ell(16,24,7,6,K);P.ell(12,9,5,5,W);P.ell(9,17,3,6,W);P.ell(21,12.5,9,2.2,Y);P.ell(18,15,6,2.6,Y);
  P.set(13,8,[255,255,255]);P.set(14,8,[20,20,24]);P.ell(17,37,1.4,4,L);P.ell(25,37,1.4,4,L);P.ell(17,40.5,3,1,L);P.ell(25,40.5,3,1,L);return P.done([40,40,46]);}
function dolphin32(){const P=painter(42,18),B=RAMP('#5a6a7a'),W=RAMP('#e8eef2',3);
  P.ell(20,11,15,4.4,B);P.ell(33,11,5,2.6,B);P.ell(38,11.5,3,1.2,B);P.ell(18,6,3,4,B);P.ell(5,9,4,2,B);P.ell(5,13,4,1.6,B);P.ell(22,13.5,10,1.6,W);P.set(31,9,[20,24,30]);P.set(30,9,[240,246,250]);return P.done([36,44,56]);}
function dog32(){const P=painter(30,18),B=RAMP('#a8643a'),D=RAMP('#6a3a20',4),C=RAMP('#f0dcc0',3);
  P.ell(14,9,9,4.2,B);P.ell(24,6,4.4,4,B);P.ell(28,7.5,2.4,1.8,C);P.ell(22,3,1.6,2.8,D);P.set(25,5,[20,16,14]);P.set(29,7,[20,16,14]);P.ell(4,6,3.6,1.2,B);
  [7,11,17,21].forEach(x=>P.ell(x,15,1.4,3,B));P.ell(14,11,6,1.6,C);return P.done([46,30,20]);}
function bfly32(w,o,f){const P=painter(21,18),Wn=RAMP(w,4),O=RAMP(o,3);
  if(f){P.ell(7,7,4,5,Wn);P.ell(14,7,4,5,Wn);P.ell(7.5,13,3,3,Wn);P.ell(13.5,13,3,3,Wn);}else{P.ell(5,6,4.6,5,Wn);P.ell(16,6,4.6,5,Wn);P.ell(5.5,13,3.6,3.4,Wn);P.ell(15.5,13,3.6,3.4,Wn);}
  P.ell(10.5,10,1.2,6,O);P.set(9,3,O[1]);P.set(12,3,O[1]);P.set(8,2,O[1]);P.set(13,2,O[1]);return P.done(O[0]);}
function wren32(){const P=painter(36,36),U=RAMP('#3f7fe0'),K=RAMP('#1d2238',4),Bn=RAMP('#9a7a58'),W=RAMP('#e9e2d0',3);
  P.ell(16,22,8,6.6,Bn);P.ell(14,24,6,4,W);P.ell(14,13,6,5.6,U);P.ell(12,12,2.4,1.4,K);P.ell(22,13,2.2,8,Bn);P.ell(22,13,1.3,7,K);P.ell(8,13.5,2.6,1,RAMP('#3a3a3a',2));
  P.set(13,11,[255,255,255]);P.set(12,11,[10,10,14]);P.ell(13,31,.8,3,RAMP('#5a4a3a',2));P.ell(18,31,.8,3,RAMP('#5a4a3a',2));return P.done([22,24,40]);}
function roo32(hop,joey){const P=painter(32,32);const g=[[70,62,58],[105,94,86],[140,126,114],[172,158,142],[200,188,170]],bl=[[176,162,146],[208,196,178],[228,218,200]];const lift=hop?-3:0;
  P.ell(8,27+lift*.4,7.5,1.9,g);P.ell(15.5,30+lift,5.2,1.6,g);P.ell(16,19.5+lift,6.6,8,g);P.ell(18,21+lift,3.6,5.6,bl);P.ell(21,17+lift,1.4,3.2,g);
  if(joey){P.ell(18.6,21.6+lift,2.2,2,g);P.set(19,21+lift,[20,16,16]);}
  P.ell(22.6,9+lift,4,3.4,g);P.ell(26,10+lift,2.4,1.8,bl);P.ell(20.8,3.8+lift,1.2,2.8,g);P.ell(23.6,3.6+lift,1.2,2.8,g);P.set(23,8+lift,[20,16,16]);P.set(23,7+lift,[255,255,255]);P.set(27,9+lift,[30,22,20]);
  return P.done();}
// ---------- Heirisson Island ----------
box(32,.5,20,lmat(sandC,[8,5]),420,-.26,0,{noCast:true});flat(30,18,lmat(grassC,[5,3]),420,.012,0);
flat(26,1.2,lmat(pathC,[13,.6]),420,.018,5.2);flat(1.2,14,lmat(pathC,[.6,7]),433,.018,-2);
(()=>{const deck=new THREE.Mesh(new THREE.BoxGeometry(58,.3,2.6),new THREE.MeshLambertMaterial({color:0x8a8f99}));deck.position.set(420,.55,-11.5);deck.castShadow=true;scene.add(deck);
  for(let i=0;i<9;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,1.4,8),new THREE.MeshLambertMaterial({color:0x6a6e76}));p.position.set(394+i*6.5,-.2,-11.5);scene.add(p);const l=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.6,6),new THREE.MeshLambertMaterial({color:0x3a3e46}));l.position.set(394+i*6.5,1.5,-10.3);scene.add(l);}
  const busBody=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(5,1.6,1.8),new THREE.MeshLambertMaterial({color:0xf6f2e8}));b.position.y=1.1;busBody.add(b);const s=new THREE.Mesh(new THREE.BoxGeometry(5.02,.5,1.82),new THREE.MeshLambertMaterial({color:0x2f9a5a}));s.position.y=.55;busBody.add(s);const w=new THREE.Mesh(new THREE.BoxGeometry(5.04,.45,1.84),new THREE.MeshLambertMaterial({color:0x2a3a58}));w.position.y=1.35;busBody.add(w);
  busBody.scale.set(.36,.56,.5);/* same size as one train carriage */busBody.position.set(432,.7,-11.5);scene.add(busBody);window.__busProto=busBody;})();
// sanctuary fence with a gate on the south side
(()=>{const runs=[[410,-7,430,-7],[410,-7,410,3],[430,-7,430,3],[410,3,419,3],[421,3,430,3]];runs.forEach(([x1,z1,x2,z2])=>{const len=Math.hypot(x2-x1,z2-z1),n=Math.ceil(len/1.4);for(let i=0;i<=n;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.1,5),legMat);p.position.set(lerp(x1,x2,i/n),.55,lerp(z1,z2,i/n));scene.add(p);}
  [.4,.8].forEach(h=>{const w=new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x2-x1)||.03,.02,Math.abs(z2-z1)||.03),new THREE.MeshLambertMaterial({color:0x9aa0a8}));w.position.set((x1+x2)/2,h,(z1+z2)/2);scene.add(w);});col(Math.min(x1,x2)-.06,Math.min(z1,z2)-.06,Math.max(x1,x2)+.06,Math.max(z1,z2)+.06);});
  signPost(417.6,3.6,makeSign(['KANGAROO','SANCTUARY'],48,20,'#5a3a22','#f5ecd8'),1.2,.5);})();
const roos=[0,1,2,3,4,5].map(i=>{const joey=i===0;const m=spriteMesh([roo32(false,joey),roo32(true,joey)],1.7,1.7);const x=412+((i*7)%16),z=-5+((i*5)%7);m.position.set(x,0,z);scene.add(m);const sh=blob(.9);return{m,sh,x,z,tx:x,tz:z,wait:Math.random()*3,hop:0,face:1,walkT:0,joey};});
// a bronze kangaroo sculpture by the river
(()=>{box(1.2,.8,1.2,lmat(stoneC,[1,1]),412,.4,7.2);const P=painter(20,40);const br=[[58,42,30],[86,62,42],[116,84,56],[146,108,72]];P.ell(10,25,5,8,br);P.ell(12.5,13,3,3.5,br);P.ell(11.5,8,1,2.6,br);P.ell(14,8,1,2.6,br);P.ell(4.5,33,1.6,6,br);P.ell(11,35,3.4,3,br);P.ell(14,20,1.2,3,br);const st=spriteMesh([P.done([30,22,16])],.9,1.8);st.position.set(412,.8,7.2);scene.add(st);
  signPost(414,8.6,makeSign(['KANGAROO SCULPTURE'],70,12,'#3a2a20','#f5ecd8'),1.4,.3);col(411.3,6.5,412.7,7.9);})();
const swans=[0,1,2,3].map(i=>{const m=spriteMesh([pix(["...oo.........","..obbo........",".rrbbo........","....obo.......","....obo.......","....obbooooo..","...obbbbbbbbo.","..obbbbbwbbbbo","..obbbbbbbbbo.","...oooooooooo."],{o:'#0e0e14',b:'#22222c',r:'#d8343a',w:'#f4f4f0'})],.9,.65,{shadow:false});scene.add(m);return{m,ph:i*1.7,cx:404+i*9,cz:12+(i%2)*.8};});
const pelican=spriteMesh([CHAR2_ON?pelican32():pix(["...ooo........","..owwwo.......","..owewo.......",".yyyyyyo......","..yyyyo.o.....","...owwwwwo....","..owwwwwwwo...","..owwwkkwwwo..","..owwkkkkwwo..","...owwwwwwo...","....oowwoo....",".....o..o.....","....oo..oo....",".............."],{o:'#2a2a30',w:'#f6f6f0',e:'#1a1a1a',y:'#f2c45a',k:'#2a2a30'})],1.1,1.1);pelican.position.set(436,0,6.4);scene.add(pelican);
[[406,-8],[407,8.5],[435.5,-8.2],[425.5,8.6]].forEach(([x,z])=>{const v=treeVariants[1];const g=new THREE.PlaneGeometry(v.w,v.h);g.translate(0,v.h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v,fade:false});});
