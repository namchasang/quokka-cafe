// ---------- painter for 32px creature sprites ----------
function painter(W,H){const c=mk(W,H),x=c.getContext('2d'),img=x.createImageData(W,H),D=img.data;
  const set=(i,j,col)=>{i|=0;j|=0;if(i<0||j<0||i>=W||j>=H)return;const k=(j*W+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;};
  const ell=(cx,cy,rx,ry,pal)=>{for(let j=0;j<H;j++)for(let i=0;i<W;i++){const dx=(i+.5-cx)/rx,dy=(j+.5-cy)/ry,d=dx*dx+dy*dy;if(d>1)continue;const l=(-dx*.5-dy*.8)*.55+(1-d)*.55;let k=Math.round((l+.35)/1.3*(pal.length-1));k=clamp(k,0,pal.length-1);if((i+j)&1&&d>.75)k=Math.max(0,k-1);set(i,j,pal[k]);}};
  return{set,ell,done:o=>{x.putImageData(img,0,0);return outlineCanvas(c,o||[40,32,28]);}};}
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
const pelican=spriteMesh([pix(["...ooo........","..owwwo.......","..owewo.......",".yyyyyyo......","..yyyyo.o.....","...owwwwwo....","..owwwwwwwo...","..owwwkkwwwo..","..owwkkkkwwo..","...owwwwwwo...","....oowwoo....",".....o..o.....","....oo..oo....",".............."],{o:'#2a2a30',w:'#f6f6f0',e:'#1a1a1a',y:'#f2c45a',k:'#2a2a30'})],1.1,1.1);pelican.position.set(436,0,6.4);scene.add(pelican);
[[406,-8],[407,8.5],[435.5,-8.2],[425.5,8.6]].forEach(([x,z])=>{const v=treeVariants[1];const g=new THREE.PlaneGeometry(v.w,v.h);g.translate(0,v.h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v,fade:false});});
// ---------- Victoria Park: Albany Highway ----------
box(74,.5,30,lmat(paveC,[37,15]),525,-.26,0,{noCast:true});
flat(74,2.4,lmat(asphC,[37,1.2]),525,.02,0);for(let x=490;x<562;x+=2.4)flat(1.1,.1,new THREE.MeshLambertMaterial({color:0xf3d24a}),x,.026,0);
flat(74,.8,lmat(pathC,[37,.4]),525,.022,-1.6);flat(74,.8,lmat(pathC,[37,.4]),525,.022,1.6);
flat(54,7,lmat(deckC,[12,2]),525,.018,6.6);flat(6,6,lmat(grassC,[1,1]),494,.015,7);flat(6,6,lmat(grassC,[1,1]),556,.015,7);
flat(74,.8,new THREE.MeshLambertMaterial({color:0x6a5a4a}),525,.02,-11);for(let x=489;x<562;x+=.9)flat(.18,1.2,new THREE.MeshLambertMaterial({color:0x4a3a2a}),x,.024,-11);
const VP_SHOPS=[
 {id:'pho',name:'Pho-nomenal Noodles',dish:'Beef pho',price:12,col:'#c8344a',wall:'#f6e8d0',cui:'Vietnamese'},{id:'seoul',name:'Kimchi Quokka Grill',dish:'Korean BBQ',price:15,col:'#1d3a6e',wall:'#e8e2d4',cui:'Korean'},
 {id:'ramen',name:'Lantern Alley Ramen',dish:'Tonkotsu ramen',price:14,col:'#2a2a30',wall:'#f2e6c8',cui:'Japanese'},{id:'boba',name:'Bubble Burrow Tea',dish:'Brown sugar bubble tea',price:7,col:'#e8a33a',wall:'#fff3d6',cui:'Taiwanese'},
 {id:'dump',name:'Moon Rabbit Dumplings',dish:'Xiao long bao',price:11,col:'#b8241e',wall:'#f6e2c0',cui:'Chinese'},{id:'bkk',name:'Siam Smile Kitchen',dish:'Khao man gai',price:12,col:'#7a1f2a',wall:'#f2e6c8',cui:'Thai'},
 {id:'malaya',name:'Pandan & Spice',dish:'Nasi lemak',price:12,col:'#3e7d5c',wall:'#efe3c4',cui:'Malaysian'},{id:'asiamart',name:'Lotus Pantry Mart',dish:null,price:0,col:'#c8344a',wall:'#f6f2e8',cui:'Grocery'},
 {id:'pub',name:'The Wattle & Swan Hotel',dish:'Pub schnitzel',price:16,col:'#2c3b38',wall:'#e2d2a8',cui:'Pub'},{id:'kmax',name:'Homebox',dish:null,price:0,col:'#d8343a',wall:'#f6f6f0',cui:'Department store'},
 {id:'luna',name:'Moonbeam Coffee',dish:'Long black',price:5,col:'#5a3a22',wall:'#f2ede4',cui:'Coffee'},{id:'chai',name:'Cosy Chai House',dish:'Masala dosa',price:11,col:'#e8732a',wall:'#fbe9cf',cui:'Indian'}];
VP_SHOPS.forEach((sh,i)=>{sh.x=493+i*5.6;sh.z=-4;const tall=sh.id==='pub'||sh.id==='kmax';bld(sh.x,sh.z,5.2,3.4,tall?4.4:3,sh.wall,{ver:sh.col,sign:sh.name.toUpperCase(),signBg:sh.col,parapet:sh.id==='pub'?'#d8c8a0':undefined,roof:sh.id==='pub'?'#8a3a2a':undefined});});
(()=>{const st=bld(558.6,-8,5.4,2.4,2.6,'#dfe6ec',{win:false,sign:'VICTORIA PARK STATION',signBg:'#1d3a6e',signY:2.1});})();
const vpTrain=new THREE.Group();(()=>{for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(7,1.8,1.9),new THREE.MeshLambertMaterial({color:0xdfe6ec}));c.position.set(i*7.3,1.15,0);c.castShadow=true;vpTrain.add(c);const s=new THREE.Mesh(new THREE.BoxGeometry(7.02,.3,1.92),new THREE.MeshLambertMaterial({color:0xd8343a}));s.position.set(i*7.3,.5,0);vpTrain.add(s);const w=new THREE.Mesh(new THREE.BoxGeometry(7.04,.5,1.94),new THREE.MeshLambertMaterial({color:0x2a3a58}));w.position.set(i*7.3,1.4,0);vpTrain.add(w);}vpTrain.position.set(470,0,-11);scene.add(vpTrain);})();
const NM=[['SATAY','#c8344a'],['TAKOYAKI','#2a2a30'],['MANGO STICKY RICE','#e8a33a'],['BAO','#f6f2e8'],['ROTI','#3e7d5c']];
NM.forEach(([n,c],i)=>{const x=503+i*9.5;box(3,.9,1.2,lmat(counterC,[2,1]),x,.45,6.2);const aw=box(3.4,.1,1.6,new THREE.MeshLambertMaterial({color:new THREE.Color(c)}),x,2.2,6.6);aw.rotation.x=-.2;[[-1.5,5.6],[1.5,5.6],[-1.5,7.4],[1.5,7.4]].forEach(([a,b])=>box(.08,2.1,.08,legMat,x+a,1.05,b));
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.32),new THREE.MeshBasicMaterial({map:makeSign([n],Math.max(48,n.length*6+8),10,'#1b1b2b','#ffd34d'),side:THREE.DoubleSide}));sg.position.set(x,1.85,7.45);scene.add(sg);col(x-1.5,5.6,x+1.5,6.8);});
const vpLights=[];for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.06,6,6),new THREE.MeshBasicMaterial({color:[0xffe9a8,0xffc8e0,0xc8f0ff,0xfff3c0][i%4]}));m.position.set(500+i*1.25,2.6-Math.abs(Math.sin(i*.6))*.35,4.4);scene.add(m);vpLights.push(m);}
(()=>{const c=mk(64,32),x=c.getContext('2d');const cols=['#e8457a','#f1c64a','#5cc6d8','#86b86e','#9478d4','#ef7d5e'];for(let i=0;i<14;i++){x.fillStyle=cols[i%6];x.beginPath();x.arc(Math.random()*64,Math.random()*32,4+Math.random()*9,0,6.283);x.fill();}
  const pq=pix(QK_TOP.concat(QK_LEGS.idle),{o:'#1a1410',b:'#f6f2e8',p:'#e79a9a',e:'#1a1010',w:'#ffffff',n:'#2a1a12',l:'#ffd34d',c:'#e8a08a',a:'#3e7d5c'});x.drawImage(pq,24,8);x.fillStyle='#1b1b2b';x.font='bold 7px monospace';x.fillText('VIC PARK',4,29);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(5,2.5),new THREE.MeshLambertMaterial({map:ctex(c),emissive:0x222222}));m.position.set(491,1.5,4.2);scene.add(m);box(5.2,3,.3,lmat(plasterC,[2,1]),491,1.5,4);col(488.4,3.8,493.6,4.2);})();
[[489.5,8.4],[495.5,9.6],[553,9.2],[559,8.4]].forEach(([x,z])=>{const v=treeVariants[2];const g=new THREE.PlaneGeometry(v.w,v.h);g.translate(0,v.h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v,fade:false});});
// bus stops
const BUS_STOPS={sp:{x:158.6,z:20.3,name:'South Perth',land:[158.6,20.2]},hi:{x:432,z:-8.6,name:'Heirisson Island',land:[432,-8.4]},vp:{x:492,z:2.3,name:'Victoria Park',land:[492,2.4]}};
Object.values(BUS_STOPS).forEach(b=>{box(.1,2.2,.1,new THREE.MeshLambertMaterial({color:0x2f9a5a}),b.x,1.1,b.z+.1);const s=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),new THREE.MeshBasicMaterial({map:makeSign(['BUS'],24,24,'#2f9a5a','#ffffff'),side:THREE.DoubleSide}));s.position.set(b.x,2,b.z+.16);scene.add(s);
const spBus=window.__busProto.clone();spBus.position.set(BUS_STOPS.sp.x+.6,0,21.7);scene.add(spBus);fadeGroup(spBus);
  const sh=box(2.4,.08,1.2,new THREE.MeshLambertMaterial({color:0x8fb8c8,transparent:true,opacity:.6}),b.x+1.6,2.1,b.z+.4);box(.06,2.1,.06,fenceMat,b.x+.5,1.05,b.z+.9);box(.06,2.1,.06,fenceMat,b.x+2.7,1.05,b.z+.9);col(b.x-.12,b.z-.02,b.x+.12,b.z+.22);});


// island General Store in the Settlement
(()=>{bld(4.6,-8.6,3.6,2.4,2.4,'#f2e6c8',{ver:'#c8344a',sign:'GENERAL STORE',signBg:'#c8344a'});[['#86b86e',3.4],['#f1c64a',4.2],['#e8735a',5]].forEach(([c,x])=>box(.5,.3,.4,new THREE.MeshLambertMaterial({color:new THREE.Color(c)}),x,.15,-6.7));})();

