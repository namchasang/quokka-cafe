// ---------- sprites ----------
const BB=[];
// 4-direction sprites: characters carry 9 frames [side x3, front x3, back x3]; materials are built the first time a frame shows
const DIR4=[];
function mkFrame(f){if(f.m)return f;const t=ctex(f.c);f.t=t;f.m=f.o.basic?new THREE.MeshBasicMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,fog:false}):new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.2,.19,.18),emissiveMap:t});
  f.d=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});return f;}
function spriteMesh(canvases,w,h,opts){opts=opts||{};
  const frames=canvases.map(c=>({c,o:opts}));mkFrame(frames[0]);
  const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);
  const mesh=new THREE.Mesh(g,frames[0].m);mesh.customDepthMaterial=frames[0].d;mesh.castShadow=opts.shadow!==false;
  mesh.userData.frames=frames;mesh.userData.cur=0;mesh.userData.step=0;BB.push(mesh);
  if(frames.length===9){mesh.userData.dir=canvases[0].height>40?0:2;mesh.userData.cur=-1;DIR4.push(mesh);showFrame(mesh);}
  return mesh;}
function showFrame(m){const u=m.userData,F=u.frames;let i=u.step;if(F.length===9)i+=u.dir===0?3:u.dir===1?6:0;if(u.cur===i||!F[i])return;const f=mkFrame(F[i]);m.material=f.m;m.customDepthMaterial=f.d;u.cur=i;}
function setFrame(m,i){m.userData.step=i;showFrame(m);}
// pick front / back / side from each character's last walk direction relative to the camera (the camera can turn)
function dir4Tick(){const cy=Math.cos(yaw),sy=Math.sin(yaw),mir=scene.scale.x<0?-1:1;
  for(let k=0;k<DIR4.length;k++){const m=DIR4[k],u=m.userData;if(!m.visible){u.px=null;continue;}const p=m.position;
    if(u.px!=null){const dx=p.x-u.px,dz=p.z-u.pz,d2=dx*dx+dz*dz;if(d2>4e-6&&d2<4){u.wx=dx;u.wz=dz;}}u.px=p.x;u.pz=p.z;
    if(u.wx!=null){const sx=u.wx*cy-u.wz*sy,sd=u.wx*sy+u.wz*cy,ax=Math.abs(sx),ad=Math.abs(sd);let d=u.dir;if(ad>ax*1.3)d=sd>0?0:1;else if(ax>ad*1.1)d=2;
      if(d!==u.dir){u.dir=d;showFrame(m);}}
    if(u.dir!==2)m.scale.x=Math.abs(m.scale.x)*mir;}}
const blobTex=(()=>{const c=mk(32,32),x=c.getContext('2d');const g=x.createRadialGradient(16,16,2,16,16,15);g.addColorStop(0,'rgba(20,20,30,.45)');g.addColorStop(1,'rgba(20,20,30,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c,{smooth:true});})();
function blob(s){const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s*.55),new THREE.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.renderOrder=1;scene.add(m);return m;}

// ---------- Phase 1: 32px pixel sprites ----------
function hex(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
function shade(rgb,f){return rgb.map(v=>clamp(Math.round(v*f),0,255));}
function kip32(step,apronHex,furTint,ow){const P=painter(32,32);let fur=[[84,52,32],[118,78,48],[150,104,66],[184,136,92],[210,168,122]];if(furTint)fur=fur.map(c=>shade(c,furTint));const belly=[[196,156,114],[222,188,146],[242,214,176]],pink=[[214,128,128],[238,164,164]];
  const fl=step===1?[11,29.6,21.5,30.4]:step===2?[12.5,30.4,20,29.6]:[12,30.2,20.5,30.2];
  P.ell(8,26,3.6,2.4,fur);P.ell(fl[0],fl[1],3.4,1.7,fur);P.ell(fl[2],fl[3],3.4,1.7,fur);P.ell(16,23,7.6,7,fur);P.ell(17.4,24.5,4.6,5,belly);
  if(apronHex){const a=hex(apronHex),apron=[shade(a,.62),shade(a,.82),a,shade(a,1.18)];
    for(let j=18;j<30;j++)for(let i=10;i<23;i++){const dx=(i+.5-16)/7.6,dy=(j+.5-23)/7;if(dx*dx+dy*dy>.92||j<19)continue;let k=i<13?3:i<17?2:i<20?1:0;if(j>27)k=Math.max(0,k-1);P.set(i,j,apron[k]);}
    for(let i=12;i<21;i++)P.set(i,19,apron[3]);[[14,23],[15,23],[16,23],[17,23],[14,24],[17,24],[14,25],[15,25],[16,25],[17,25]].forEach(([i,j])=>P.set(i,j,apron[0]));}
  P.ell(22,21.5,2.3,2.8,fur);P.ell(17,11,7.6,6.6,fur);P.ell(11.2,4.4,2.6,3.3,fur);P.ell(11.2,4.9,1.2,2,pink);P.ell(21.6,4.2,2.6,3.3,fur);P.ell(21.6,4.7,1.2,2,pink);P.ell(20.4,13.6,3.8,2.7,belly);
  [[19,9],[20,9],[19,10],[20,10],[19,11],[20,11]].forEach(([i,j])=>P.set(i,j,[26,16,16]));P.set(19,9,[255,255,255]);P.set(20,10,[90,60,50]);
  P.set(23,12,[40,24,18]);P.set(24,12,[40,24,18]);P.set(23,13,[40,24,18]);P.set(21,15,[90,50,40]);P.set(22,15,[90,50,40]);P.set(23,14,[90,50,40]);P.set(14,13,[232,146,130]);P.set(15,13,[232,146,130]);
  drawOutfit(P,ow);return P.done([42,26,18]);}
function human32(v,step){const P=painter(32,44);const skin=hex(v.skin),hair=hex(v.hair),shirt=hex(v.shirt),pants=hex(v.pants);const S3=c=>[shade(c,.7),shade(c,.88),c,shade(c,1.12)];
  const lo=step===1?[-1,1]:step===2?[1,-1]:[0,0];
  for(let j=31;j<41;j++){for(let i=11;i<15;i++)P.set(i+lo[0],j,S3(pants)[i===11?0:i===14?1:2]);for(let i=17;i<21;i++)P.set(i+lo[1],j,S3(pants)[i===20?0:2]);}
  const shoe=v.shoe?hex(v.shoe):[50,36,28];for(let i=10;i<16;i++){P.set(i+lo[0],41,shoe);P.set(i+lo[0],42,shade(shoe,.7));}for(let i=16;i<22;i++){P.set(i+lo[1],41,shoe);P.set(i+lo[1],42,shade(shoe,.7));}
  if(v.dress)P.ell(16,32,8.6,6.4,S3(shirt));
  P.ell(16,25,7.4,7.6,S3(shirt));P.ell(8.6,25,2.2,5.6,S3(shirt));P.ell(23.4,25,2.2,5.6,S3(shirt));P.ell(8.6,31,1.8,1.8,S3(skin));P.ell(23.4,31,1.8,1.8,S3(skin));
  if(v.trim){const tc=hex(v.trim);for(let j=19;j<32;j++)P.set(16,j,tc);for(let i=12;i<21;i++)P.set(i,19,tc);}
  P.ell(16,16.8,2.2,1.6,S3(skin));P.ell(16,10.6,7.2,7.6,S3(hair));if(v.long){P.ell(9.6,17,2.6,6,S3(hair));P.ell(22.4,17,2.6,6,S3(hair));}P.ell(16,12.4,6,5.8,S3(skin));
  if(v.hat){const hc=hex(v.hat);if(v.cap){P.ell(16,6.6,6.6,3,S3(hc));P.ell(20.6,8.4,4.2,1.2,S3(hc));}else{P.ell(16,6.4,10,2.2,S3(hc));P.ell(16,4.6,6,3.4,S3(hc));}}
  [[13,12],[13,13],[19,12],[19,13]].forEach(([i,j])=>P.set(i,j,[26,16,16]));P.set(13,12,[255,255,255]);P.set(19,12,[255,255,255]);
  if(v.glasses){for(let i=11;i<22;i++)P.set(i,12,[18,18,26]);[[11,13],[12,13],[13,13],[14,13],[18,13],[19,13],[20,13],[21,13]].forEach(([i,j])=>P.set(i,j,[18,18,26]));P.set(12,12,[120,140,170]);P.set(19,12,[120,140,170]);}
  [[15,15],[16,15],[17,15]].forEach(([i,j])=>P.set(i,j,shade(skin,.6)));P.set(12,14,[232,140,130]);P.set(20,14,[232,140,130]);
  if(v.bag){const bc=hex(v.bag);P.ell(25.6,27,2.4,3.4,S3(bc));}
  return P.done([38,26,22]);}
// Kip / quokkas seen from the front (dir 0) or back (dir 1); step 0 stand, 1-2 stride
function kipFB(dir,step,apronHex,furTint,ow){const P=painter(32,32);let fur=[[84,52,32],[118,78,48],[150,104,66],[184,136,92],[210,168,122]];if(furTint)fur=fur.map(c=>shade(c,furTint));const belly=[[196,156,114],[222,188,146],[242,214,176]],pink=[[214,128,128],[238,164,164]];
  const ap=apronHex?(a=>[shade(a,.62),shade(a,.82),a,shade(a,1.18)])(hex(apronHex)):null;const h=step===1?-1:step===2?-.5:0;const H=j=>Math.round(j+h);
  const fy=step===1?[29.4,30.4]:step===2?[30.4,29.4]:[30.2,30.2];
  if(dir===1)P.ell(16,29+h,2.8,2.4,fur);
  P.ell(11,fy[0],3,1.7,fur);P.ell(21,fy[1],3,1.7,fur);P.ell(16,22.5+h,8,7.4,fur);
  if(dir===0){P.ell(16,24+h,5,5.2,belly);
    if(ap){for(let j=19;j<30;j++)for(let i=10;i<23;i++){const dx=(i+.5-16)/6.4,dy=(j+.5-24-h)/6;if(dx*dx+dy*dy>1||j<H(19))continue;P.set(i,j,ap[i<13?3:i<19?2:1]);}for(let i=12;i<21;i++)P.set(i,H(19),ap[3]);[[15,23],[16,23],[17,23],[15,25],[16,25],[17,25],[15,24],[17,24]].forEach(([i,j])=>P.set(i,H(j),ap[0]));}
    const sw=step===1?-1:step===2?1:0;P.ell(9.4,21+h+sw,2,3,fur);P.ell(22.6,21+h-sw,2,3,fur);}
  else{if(ap){for(let i=9;i<24;i++)P.set(i,H(21),ap[1]);P.ell(16,21+h,2.2,1.4,ap);P.set(15,H(23),ap[0]);P.set(17,H(23),ap[0]);P.set(14,H(24),ap[0]);P.set(18,H(24),ap[0]);}
    const sw=step===1?-1:step===2?1:0;P.ell(8.8,21+h+sw,1.6,2.8,fur);P.ell(23.2,21+h-sw,1.6,2.8,fur);}
  P.ell(16,11+h,7.6,6.6,fur);P.ell(9.6,4.6+h,2.6,3.3,fur);P.ell(22.4,4.6+h,2.6,3.3,fur);
  if(dir===0){P.ell(9.6,5.1+h,1.2,2,pink);P.ell(22.4,5.1+h,1.2,2,pink);P.ell(16,14+h,4.2,2.8,belly);
    [[12,10],[13,10],[12,11],[13,11],[19,10],[20,10],[19,11],[20,11]].forEach(([i,j])=>P.set(i,H(j),[26,16,16]));P.set(12,H(10),[255,255,255]);P.set(19,H(10),[255,255,255]);
    P.set(15,H(13),[40,24,18]);P.set(16,H(13),[40,24,18]);P.set(15,H(15),[90,50,40]);P.set(16,H(15),[90,50,40]);P.set(14,H(14),[90,50,40]);P.set(17,H(14),[90,50,40]);P.set(10,H(13),[232,146,130]);P.set(21,H(13),[232,146,130]);}
  else{P.ell(16,13.5+h,5.4,3,fur.map(c=>shade(c,.92)));}
  drawOutfitFB(P,ow,dir,h);return P.done([42,26,18]);}
function drawOutfitFB(P,o,dir,h){if(!o)return;const S3=c=>{const h=hex(c);return[shade(h,.6),shade(h,.8),h,shade(h,1.15)];};const set=(i,j,c)=>P.set(i,Math.round(j+h),c);const ell=(x,y,rx,ry,p)=>P.ell(x,y+h,rx,ry,p);
  if(o.acc==='scarf'){const sc=S3('#c8344a');for(let i=9;i<24;i++){set(i,16,sc[2]);set(i,17,sc[(i%2)?1:3]);}if(dir===0)for(let j=17;j<22;j++){set(19,j,sc[1]);set(20,j,sc[2]);}else for(let j=17;j<20;j++){set(15,j,sc[1]);set(16,j,sc[2]);}}
  if(o.hat==='sun'){ell(16,5.6,10,1.8,S3('#e8c87a'));ell(16,3.8,5.6,2.8,S3('#e8c87a'));for(let i=11;i<21;i++)set(i,5,hex('#c8344a'));}
  else if(o.hat==='bush'){ell(16,5.8,10.5,1.7,S3('#8a5a36'));ell(16,3.6,5.2,2.8,S3('#8a5a36'));for(let i=12;i<20;i++)set(i,5,hex('#3a2416'));}
  else if(o.hat==='beanie'){ell(16,5,7.4,3.8,S3('#2f78a8'));for(let i=9;i<23;i++)set(i,7,hex('#f6f6f0'));ell(16,1.6,1.6,1.4,S3('#f6f6f0'));}
  else if(o.hat==='cap'){ell(16,5.4,6.6,3,S3('#c8344a'));if(dir===0){ell(16,8,5.2,1.1,S3('#c8344a'));set(15,4,hex('#ffffff'));set(16,4,hex('#ffffff'));}else{set(15,7,hex('#f1c64a'));set(16,7,hex('#f1c64a'));}}
  if(o.acc==='shades'){const d=[18,18,26];if(dir===0){for(let i=11;i<22;i++)set(i,10,d);[[11,11],[12,11],[13,11],[14,11],[18,11],[19,11],[20,11],[21,11]].forEach(([i,j])=>set(i,j,d));set(12,11,[110,140,180]);set(19,11,[110,140,180]);}else{set(8,10,d);set(23,10,d);}}
  else if(o.acc==='flowers'&&!o.hat){[['#e8457a',10],['#ffd34d',12],['#ffffff',14],['#e8457a',16],['#9478d4',18],['#ffd34d',20]].forEach(([c,i])=>{set(i,5,hex(c));set(i+1,5,hex(c));set(i,6,hex('#3e7d5c'));});}
  else if(o.acc==='snorkel'){const b=S3('#2f78a8');if(dir===0){for(let i=10;i<23;i++){set(i,8,b[1]);set(i,12,b[1]);}for(let j=9;j<12;j++){set(10,j,b[1]);set(22,j,b[1]);}for(let i=11;i<22;i++)for(let j=9;j<12;j++)set(i,j,j===9?[150,210,240]:[120,190,230]);set(12,10,[26,16,16]);set(19,10,[26,16,16]);}
    else for(let i=8;i<24;i++)set(i,10,b[1]);for(let j=1;j<10;j++)set(dir===0?24:7,j,hex('#f1c64a'));set(dir===0?24:7,0,hex('#c8344a'));}}
// people seen side-on (facing right) and from behind; same palette rules as human32
function humanSide(v,step){const P=painter(32,44);const S3=c=>[shade(c,.7),shade(c,.88),c,shade(c,1.12)];const skin=S3(hex(v.skin)),hair=S3(hex(v.hair)),shirt=S3(hex(v.shirt)),pants=S3(hex(v.pants));const shoe=v.shoe?hex(v.shoe):[50,36,28];
  const f=step===1?3:step===2?-3:0;
  [[16+f,1],[16-f,0]].forEach(([lx,back])=>{const pc=back?pants[0]:pants[2];for(let j=31;j<41;j++)for(let i=lx-2;i<lx+2;i++)P.set(i,j,pc);for(let i=lx-2;i<lx+3;i++){P.set(i,41,back?shade(shoe,.8):shoe);P.set(i,42,shade(shoe,.7));}});
  if(v.bag){const bc=hex(v.bag);P.ell(10.6,27,2.4,3.4,S3(bc));}
  if(v.dress)P.ell(16,32,7,5.8,shirt);
  P.ell(16,25,5.6,7.6,shirt);P.ell(16.5,17.4,2,1.5,skin);
  if(v.trim){const tc=hex(v.trim);for(let i=14;i<20;i++)P.set(i,19,tc);}
  const aw=step===1?-3:step===2?3:0;P.ell(16+aw*.6,26,1.9,5.2,shirt.map(c=>shade(c,.9)));P.ell(16+aw,31,1.6,1.6,skin);
  P.ell(16.5,11,6.8,7.4,hair);P.ell(18,12.6,5.4,5.6,skin);P.ell(13.6,10.8,3.6,5.6,hair);if(v.long)P.ell(13.2,17,3,6,hair);
  P.set(21,11,[26,16,16]);P.set(21,12,[26,16,16]);P.set(23,13,shade(hex(v.skin),.85));P.set(23,14,shade(hex(v.skin),.85));P.set(20,15,shade(hex(v.skin),.6));P.set(21,15,shade(hex(v.skin),.6));P.set(19,14,[232,140,130]);
  if(v.glasses){const g=[18,18,26];for(let i=15;i<23;i++)P.set(i,11,g);P.set(20,12,g);P.set(22,12,g);P.set(21,12,[120,140,170]);}
  if(v.hat){const hc=hex(v.hat);if(v.cap){P.ell(16,6.6,6.6,3,S3(hc));P.ell(22.4,8.4,4.2,1.2,S3(hc));}else{P.ell(16.5,6.4,9.6,2,S3(hc));P.ell(16,4.6,5.6,3.4,S3(hc));}}
  return P.done([38,26,22]);}
function humanBack(v,step){const P=painter(32,44);const S3=c=>[shade(c,.7),shade(c,.88),c,shade(c,1.12)];const skin=S3(hex(v.skin)),hair=S3(hex(v.hair)),shirt=S3(hex(v.shirt)),pants=S3(hex(v.pants));const shoe=v.shoe?hex(v.shoe):[50,36,28];
  const lo=step===1?[-1,1]:step===2?[1,-1]:[0,0];
  for(let j=31;j<41;j++){for(let i=11;i<15;i++)P.set(i+lo[0],j,pants[i===11?0:i===14?1:2]);for(let i=17;i<21;i++)P.set(i+lo[1],j,pants[i===20?0:2]);}
  for(let i=10;i<16;i++){P.set(i+lo[0],41,shoe);P.set(i+lo[0],42,shade(shoe,.7));}for(let i=16;i<22;i++){P.set(i+lo[1],41,shoe);P.set(i+lo[1],42,shade(shoe,.7));}
  if(v.dress)P.ell(16,32,8.6,6.4,shirt);
  const as=step===1?-1:step===2?1:0;
  P.ell(16,25,7.4,7.6,shirt);P.ell(8.6,25+as,2.2,5.6,shirt);P.ell(23.4,25-as,2.2,5.6,shirt);P.ell(8.6,31+as,1.8,1.8,skin);P.ell(23.4,31-as,1.8,1.8,skin);
  for(let j=20;j<31;j++)P.set(16,j,shade(hex(v.shirt),.78));
  if(v.bag){const bc=hex(v.bag);P.ell(6.4,27,2.4,3.4,S3(bc));for(let j=19;j<25;j++)P.set(20+((j-19)>>1),j,shade(bc,.7));}
  P.ell(16,16.8,2.2,1.6,skin);P.ell(8.9,12.6,1.1,1.5,skin);P.ell(23.1,12.6,1.1,1.5,skin);
  P.ell(16,10.8,7.2,7.6,hair);P.ell(16,14.4,5.6,2.6,hair.map(c=>shade(c,.92)));if(v.long)P.ell(16,18,6.4,4.6,hair);
  if(v.glasses){P.set(8,12,[18,18,26]);P.set(23,12,[18,18,26]);}
  if(v.hat){const hc=hex(v.hat);if(v.cap){P.ell(16,6.6,6.8,3.2,S3(hc));for(let i=14;i<18;i++)P.set(i,9,shade(hc,.6));}else{P.ell(16,6.4,10,2.2,S3(hc));P.ell(16,4.6,6,3.4,S3(hc));}}
  return P.done([38,26,22]);}
function quokkaFrames(apron,tint){const col=apron?(typeof apron==='string'?apron:'#3e7d5c'):null;return[0,1,2].map(s=>kip32(s,col,tint)).concat([0,1,2].map(s=>kipFB(0,s,col,tint)),[0,1,2].map(s=>kipFB(1,s,col,tint)));}
function humanFrames(v){const pad=h=>{const c=mk(32,52);c.getContext('2d').drawImage(h,0,8);return c;};return[0,1,2].map(s=>pad(humanSide(v,s))).concat([0,1,2].map(s=>pad(human32(v,s))),[0,1,2].map(s=>pad(humanBack(v,s))));}
const ICON_OVR={capp:['coffee',{f:'#fff8ee',w:'#c8344a',c:'#8a5a36'}],thai:['smo',{m:'#f2902e',r:'#ffffff',g:'#f6e8d0'}],fc:[null,{o:'#2a1d1a',y:'#f4c84a',w:'#f4efe6',b:'#d9a05a'}]};
const FC_ROWS=['............','...y.y.y....','..yy.yy.y...','..yyyyyyy...','.oooooooooo.','.owwbbbbwwo.','.owbbbbbbwo.','.owwbbbbwwo.','..owwwwwwo..','...owwwwo...','....oooo....','............'];
function iconCanvas(k){if(ICON_OVR[k]){const [base,pal]=ICON_OVR[k];return pix(base?ICONS[base]:FC_ROWS,Object.assign({},ICON_PAL,pal));}return pix(ICONS[k],k==='shell'?SHELL_PAL:k==='heart'?HEART_PAL:k==='spark'?SPARK_PAL:ICON_PAL);}
function bubbleCanvas(k){const c=mk(20,20),x=c.getContext('2d');x.fillStyle='#2a1d1a';x.fillRect(2,0,16,17);x.fillRect(0,2,20,13);x.fillRect(1,1,18,15);x.fillStyle='#fffaf0';x.fillRect(2,2,16,13);x.fillRect(1,3,18,11);
  x.fillStyle='#2a1d1a';x.fillRect(8,17,4,1);x.fillRect(9,18,2,1);x.fillStyle='#fffaf0';x.fillRect(9,15,2,2);
  x.drawImage(iconCanvas(k),4,2);return c;}

