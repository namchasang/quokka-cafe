// ---------- lights ----------
const hemi=new THREE.HemisphereLight(0xcfe9f5,0x6b7a4a,.62);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe2b0,1);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
const sc=sun.shadow.camera;sc.left=-26;sc.right=26;sc.top=26;sc.bottom=-26;sc.near=1;sc.far=70;
sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.02;scene.add(sun);scene.add(sun.target);

// ---------- textures ----------
function noiseTile(size,base,specks,seed){const c=mk(size,size),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,size,size);const r=mulberry32(seed);specks.forEach(([col,n,w])=>{x.fillStyle=col;for(let i=0;i<n;i++)x.fillRect(r()*size|0,r()*size|0,w||1,1);});return c;}
function dither(x,r,S,cx,cy,rad,col,dens){x.fillStyle=col;for(let y=-rad;y<=rad;y++)for(let X=-rad;X<=rad;X++){const d=Math.hypot(X,y)/rad;if(d>1)continue;if(r()<(1-d*d)*dens)x.fillRect(((cx+X)%S+S)%S,((cy+y)%S+S)%S,1,1);}}
const grassC=(()=>{const S=64,c=mk(S,S),x=c.getContext('2d'),r=mulberry32(77);x.fillStyle='#78a254';x.fillRect(0,0,S,S);
  for(let i=0;i<6;i++)dither(x,r,S,r()*S|0,r()*S|0,6+r()*8|0,'#9fb15c',.8);for(let i=0;i<5;i++)dither(x,r,S,r()*S|0,r()*S|0,5+r()*7|0,'#5f8f45',.8);for(let i=0;i<4;i++)dither(x,r,S,r()*S|0,r()*S|0,4+r()*5|0,'#8cb764',.7);
  [['#5a8540',170],['#a2c46e',130]].forEach(([col,n])=>{x.fillStyle=col;for(let i=0;i<n;i++)x.fillRect(r()*S|0,r()*S|0,1,1);});
  for(let i=0;i<46;i++){const a=r()*S|0,b=r()*S|0;x.fillStyle='#4f7a3a';x.fillRect(a,b+1,1,1);x.fillStyle='#b3d07c';x.fillRect(a,b,1,1);x.fillRect(a+1,b-1,1,1);}
  [['#f4dc5a',7],['#ffffff',4],['#b88ad8',3]].forEach(([col,n])=>{x.fillStyle=col;for(let i=0;i<n;i++)x.fillRect(r()*S|0,r()*S|0,1,1);});return c;})();
const sandC=(()=>{const S=64,c=mk(S,S),x=c.getContext('2d'),r=mulberry32(78);x.fillStyle='#f6f1e3';x.fillRect(0,0,S,S);
  for(let i=0;i<6;i++)dither(x,r,S,r()*S|0,r()*S|0,6+r()*8|0,'#fffdf7',.6);for(let i=0;i<5;i++)dither(x,r,S,r()*S|0,r()*S|0,5+r()*7|0,'#e9e1cf',.6);
  x.fillStyle='#ebe4d3';for(let i=0;i<14;i++){const a=r()*S|0,b=r()*S|0,w=3+r()*5|0;x.fillRect(a,b,w,1);}
  [['#e4dbc8',150],['#fffaf0',110],['#d4c8b0',12],['#ffffff',8],['#e9a99a',4]].forEach(([col,n])=>{x.fillStyle=col;for(let i=0;i<n;i++)x.fillRect(r()*S|0,r()*S|0,1,1);});return c;})();
const pathC=(()=>{const S=32,c=mk(S,S),x=c.getContext('2d'),r=mulberry32(79);x.fillStyle='#dcd2bb';x.fillRect(0,0,S,S);
  for(let i=0;i<4;i++)dither(x,r,S,r()*S|0,r()*S|0,4+r()*5|0,'#e9e1cd',.7);
  x.fillStyle='#b9ad92';for(let i=0;i<5;i++){let a=r()*S,b=r()*S;for(let k=0;k<7;k++){x.fillRect(((a|0)%S+S)%S,((b|0)%S+S)%S,1,1);a+=r()*2-.5;b+=r()*2-1;}}
  [['#c8bca2',60],['#efe8d6',40],['#a99c80',10]].forEach(([col,n])=>{x.fillStyle=col;for(let i=0;i<n;i++)x.fillRect(r()*S|0,r()*S|0,1,1);});return c;})();
const stoneC=noiseTile(16,'#8f9089',[['#7b7c75',40],['#a5a69e',30],['#6a6b64',8]],11);
const plasterC=noiseTile(16,'#f3efe6',[['#e4ddcf',30],['#ffffff',20]],13);
function planks(base,gap,vertical,seed){const c=mk(16,16),x=c.getContext('2d');const r=mulberry32(seed);for(let i=0;i<4;i++){const sh=base[i%base.length];x.fillStyle=sh;if(vertical)x.fillRect(i*4,0,4,16);else x.fillRect(0,i*4,16,4);}
  x.fillStyle=gap;for(let i=0;i<4;i++){if(vertical)x.fillRect(i*4+3,0,1,16);else x.fillRect(0,i*4+3,16,1);}
  for(let i=0;i<14;i++){x.fillStyle='rgba(60,30,10,.25)';const a=r()*16|0,b=r()*16|0;if(vertical)x.fillRect(a,b,1,2);else x.fillRect(a,b,2,1);}
  if(!vertical){for(let i=0;i<4;i++){x.fillStyle=gap;x.fillRect((r()*14|0)+1,i*4,1,3);}}return c;}
const deckC=planks(['#b98552','#a8744a','#c48f5c','#b07c4c'],'#6e4628',false,21);
const wallC=planks(['#7fb3ad','#74a8a2','#88bbb5','#7aaea8'],'#4f7f7a',true,23);
const counterC=planks(['#8a5a36','#7e5232','#946240'],'#4e3018',true,25);
const awnC=(()=>{const c=mk(16,16),x=c.getContext('2d');for(let i=0;i<4;i++){x.fillStyle=i%2?'#f6ead2':'#e2584f';x.fillRect(i*4,0,4,16);}x.fillStyle='rgba(0,0,0,.12)';x.fillRect(0,15,16,1);return c;})();
const waterC=(()=>{const c=mk(32,32),x=c.getContext('2d');x.fillStyle='#2a8db2';x.fillRect(0,0,32,32);const r=mulberry32(31);x.fillStyle='#4cb1cd';for(let i=0;i<16;i++)x.fillRect(r()*32|0,r()*32|0,3+(r()*3|0),1);x.fillStyle='#a9e6f0';for(let i=0;i<5;i++)x.fillRect(r()*32|0,r()*32|0,2,1);return c;})();
const pinkC=(()=>{const c=mk(16,16),x=c.getContext('2d');x.fillStyle='#ef9fb3';x.fillRect(0,0,16,16);const r=mulberry32(41);x.fillStyle='#f9c6d3';for(let i=0;i<8;i++)x.fillRect(r()*16|0,r()*16|0,3,1);return c;})();
const paveC=(()=>{const S=32,c=mk(S,S),x=c.getContext('2d'),r=mulberry32(91);x.fillStyle='#d8ccb0';x.fillRect(0,0,S,S);
  for(let j=0;j<4;j++)for(let i=0;i<4;i++){const ox=(j%2)*4;const tone=['#dccfb2','#d2c5a6','#e3d8be','#cdbf9f'][(i+j*3+(r()*4|0))%4];x.fillStyle=tone;x.fillRect((i*8+ox)%S+1,j*8+1,7,7);if(ox&&i===3){x.fillRect(0,j*8+1,3,7);}}
  x.fillStyle='#b8aa8a';for(let j=0;j<4;j++){x.fillRect(0,j*8,S,1);for(let i=0;i<4;i++)x.fillRect((i*8+(j%2)*4)%S,j*8,1,8);}
  [['#c4b593',60],['#ece3cc',50],['#a89a7a',14]].forEach(([col,n])=>{x.fillStyle=col;for(let i=0;i<n;i++)x.fillRect(r()*S|0,r()*S|0,1,1);});return c;})();
// ---------- TEX3 (Look Lab ?r3): ground, paths, walls and decks painted piece by piece, at twice the pixels ----------
// Same rules as the leaf-by-leaf plants: every stone, plank, blade and grain gets its own tone, the light comes from
// the top left (lit edge up-left, shadow down-right), seven-tone ramps with an ordered dither, moss and wear in the gaps.
const TEX3_ON=/[?&#](lab|r3)\b/.test(location.search+location.hash);
const T3={B:[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],
  hex:s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)],
  ramp(a,b,n){const A=T3.hex(a),B=T3.hex(b);const R=[];for(let k=0;k<(n||7);k++){const t=k/((n||7)-1);R.push([0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*t+(i===0?(t-.5)*14:i===2?-(t-.5)*16:0))));}return R;},
  // draw into a canvas at a new size; f(px,ramp) fills an ImageData
  repaint(c,S,f){c.width=S;c.height=S;const x=c.getContext('2d'),id=x.createImageData(S,S),D=id.data;
    const px=(X,Y,col)=>{X=((X%S)+S)%S;Y=((Y%S)+S)%S;const o=(Y*S+X)*4;D[o]=col[0];D[o+1]=col[1];D[o+2]=col[2];D[o+3]=255;};
    const get=(X,Y)=>{X=((X%S)+S)%S;Y=((Y%S)+S)%S;const o=(Y*S+X)*4;return[D[o],D[o+1],D[o+2]];};
    f(px,get,S);x.putImageData(id,0,0);},
  q(R,v,X,Y){const t=(T3.B[(Y&3)*4+(X&3)]/16-.5)*.6;return R[Math.max(0,Math.min(R.length-1,Math.floor(v*R.length+t)))];},
  // tileable value noise
  n(x,y,s,seed,S){const per=Math.max(1,Math.round(S/s));const gx=Math.floor(x/s),gy=Math.floor(y/s),fx=x/s-gx,fy=y/s-gy;const h=(a,b)=>l2hash(((a%per)+per)%per,((b%per)+per)%per,seed);
    const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return h(gx,gy)*(1-u)*(1-v)+h(gx+1,gy)*u*(1-v)+h(gx,gy+1)*(1-u)*v+h(gx+1,gy+1)*u*v;},
  // tileable Voronoi: nearest and second-nearest cell centres
  vor(S,n,seed){const P=[];const r=mulberry32(seed);for(let i=0;i<n;i++)P.push([r()*S,r()*S,r()]);
    return(x,y)=>{let d1=1e9,d2=1e9,id=0;for(let i=0;i<n;i++){for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const dx=x-(P[i][0]+ox*S),dy=y-(P[i][1]+oy*S),d=dx*dx+dy*dy;if(d<d1){d2=d1;d1=d;id=i;}else if(d<d2)d2=d;}}return{e:Math.sqrt(d2)-Math.sqrt(d1),id,t:P[id][2],cx:P[id][0],cy:P[id][1]};};}};
function tex3Ground(){if(!TEX3_ON)return;
  // grass: soft clumps of light and shade, then blades (dark root, lit tip), clover, a few daisies and fallen leaves
  T3.repaint(grassC,128,(px,get,S)=>{const R=T3.ramp('#3e6a2c','#b6d27a');const r=mulberry32(301);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const v=.22+T3.n(x,y,32,5,S)*.38+T3.n(x,y,9,6,S)*.22+(l2hash(x,y,7)-.5)*.1;px(x,y,T3.q(R,v,x,y));}
    for(let i=0;i<900;i++){const x=r()*S|0,y=r()*S|0,h=2+(r()*3|0),lit=T3.n(x,y,32,5,S);for(let k=0;k<h;k++){const t=k/(h-1);px(x+(k===h-1&&r()<.5?1:0),y-k,R[Math.min(6,Math.floor(1+lit*3+t*3))]);}}
    for(let i=0;i<26;i++){const x=r()*S|0,y=r()*S|0;[[0,0],[1,0],[0,1],[-1,0],[0,-1]].forEach(([a,b],j)=>px(x+a,y+b,j?R[5]:R[3]));}
    for(let i=0;i<12;i++){const x=r()*S|0,y=r()*S|0;const c=i%3===0?[244,170,200]:[250,250,244];[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>px(x+a,y+b,c));px(x,y,[244,206,70]);}
    for(let i=0;i<8;i++){const x=r()*S|0,y=r()*S|0;const c=[[176,122,58],[196,150,72],[150,96,50]][i%3];px(x,y,c);px(x+1,y,c);px(x+1,y+1,c.map(v=>v*.8|0));}});
  // sand: wind ripples, damp patches, grains, tiny shells
  T3.repaint(sandC,128,(px,get,S)=>{const R=T3.ramp('#d8cbb0','#fffbf1');const r=mulberry32(302);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const w=Math.sin((y+T3.n(x,y,32,8,S)*14)*Math.PI*2/8);const v=.55+w*.12+T3.n(x,y,24,9,S)*.18+(l2hash(x,y,3)-.5)*.12;px(x,y,T3.q(R,v,x,y));}
    for(let i=0;i<500;i++){const x=r()*S|0,y=r()*S|0;px(x,y,r()<.5?R[1]:R[6]);}
    for(let i=0;i<10;i++){const x=r()*S|0,y=r()*S|0;const c=i%2?[246,214,206]:[250,246,236];px(x,y,c);px(x+1,y,c);px(x,y+1,[200,180,160]);}});
  // limestone path: irregular flagstones, bevelled (lit top-left edge, dark bottom-right), cracks, moss and grit in the joints
  T3.repaint(pathC,64,(px,get,S)=>{const R=T3.ramp('#9c9078','#f2ead6');const V=T3.vor(S,11,303);const r=mulberry32(304);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const c=V(x,y);if(c.e<1.3){const moss=T3.n(x,y,10,12,S);px(x,y,moss>.55?[96,124,70]:moss>.42?[120,132,84]:[132,120,98]);continue;}
      const dx=x-c.cx,dy=y-c.cy;let v=.5+c.t*.25+T3.n(x,y,6,13,S)*.14;if(c.e<2.4)v+=(dx<0||dy<0)?.14:-.18;px(x,y,T3.q(R,v,x,y));}
    for(let i=0;i<7;i++){let x=r()*S,y=r()*S;for(let k=0;k<9;k++){px(x|0,y|0,R[1]);x+=r()*2-.6;y+=r()*2-1;}}
    for(let i=0;i<40;i++){const x=r()*S|0,y=r()*S|0;const c=V(x,y);if(c.e>2.5)px(x,y,r()<.5?R[6]:R[2]);}});
  // pavers: bricks in a running bond, each a slightly different tone, lit edge, worn corners, moss in a few joints
  T3.repaint(paveC,64,(px,get,S)=>{const R=T3.ramp('#a89878','#f0e4c8');for(let y=0;y<S;y++)for(let x=0;x<S;x++){const row=y>>3,ox=(row&1)*8,bx=((x+ox)%S)>>4,lx=(x+ox)%16,ly=y%8;
      if(lx===0||ly===0){const m=T3.n(x,y,12,21,S);px(x,y,m>.6?[104,128,74]:[150,138,112]);continue;}const t=l2hash(bx,row,22);let v=.42+t*.3+(l2hash(x,y,23)-.5)*.12;if(lx===1||ly===1)v+=.15;if(lx===15||ly===7)v-=.16;px(x,y,T3.q(R,v,x,y));}});
  // rough limestone: blocks with bevels and pitting
  T3.repaint(stoneC,32,(px,get,S)=>{const R=T3.ramp('#5e5f58','#b6b7ae');const V=T3.vor(S,6,305);for(let y=0;y<S;y++)for(let x=0;x<S;x++){const c=V(x,y);if(c.e<1){px(x,y,R[0]);continue;}let v=.4+c.t*.25+(l2hash(x,y,31)-.5)*.2;if(c.e<2)v+=(x<c.cx||y<c.cy)?.15:-.15;px(x,y,T3.q(R,v,x,y));}});
  // render: soft mottling, a hairline crack, a few stains
  T3.repaint(plasterC,32,(px,get,S)=>{const R=T3.ramp('#d8d0bf','#fffcf4');const r=mulberry32(306);for(let y=0;y<S;y++)for(let x=0;x<S;x++){px(x,y,T3.q(R,.55+T3.n(x,y,12,41,S)*.3+(l2hash(x,y,42)-.5)*.08,x,y));}
    let x=r()*S,y=r()*S;for(let k=0;k<8;k++){px(x|0,y|0,R[2]);x+=r()*2-1;y+=1;}});
  // planks: grain lines, a lit top edge, dark gap, nail heads, a knot
  const plank=(c,cols,gap,vertical,seed)=>T3.repaint(c,32,(px,get,S)=>{const G=T3.hex(gap);const r=mulberry32(seed);const ramps=cols.map(cc=>T3.ramp(cc,cc,7).map((q,k)=>q.map(v=>Math.max(0,Math.min(255,Math.round(v*(.54+k*.062)))))));
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const a=vertical?x:y,b=vertical?y:x;const bi=a>>3,la=a%8;const R=ramps[bi%ramps.length];if(la===7){px(x,y,G);continue;}
      let v=.45+Math.sin((b+l2hash(bi,0,seed)*40)*.7+la*.9)*.08+T3.n(b,la,6,seed+bi,S)*.2;if(la===0)v+=.22;if(la===6)v-=.18;if(((b+bi*11)%32)===0)v=.05;px(x,y,T3.q(R,v,x,y));}
    for(let i=0;i<8;i++){const bi=i%4,b=(r()*S)|0,a=bi*8+3+(r()*2|0);const X=vertical?a:b,Y=vertical?b:a;px(X,Y,[60,40,28]);}});
  plank(deckC,['#b98552','#a8744a','#c48f5c','#b07c4c'],'#4e3018',false,307);plank(wallC,['#7fb3ad','#74a8a2','#88bbb5','#7aaea8'],'#3f6f6a',true,308);plank(counterC,['#8a5a36','#7e5232','#946240'],'#3e2010',true,309);
}
tex3Ground();
// windows: frame, sill with its shadow, a mullion, sky reflected in the glass; walls get a soft grime line at the bottom
function winTex3(base,win,rx,ry){const c=mk(32,32),x=c.getContext('2d');const B=T3.hex(base);const W=T3.hex(win);
  const sh=(k)=>`rgb(${B.map(v=>Math.max(0,Math.min(255,Math.round(v*k)))).join(',')})`;x.fillStyle=sh(1);x.fillRect(0,0,32,32);
  for(let y=0;y<32;y++)for(let xx=0;xx<32;xx++){if(l2hash(xx,y,77)<.12){x.fillStyle=sh(l2hash(xx,y,78)<.5?.94:1.04);x.fillRect(xx,y,1,1);}}
  [5,19].forEach(ox=>{x.fillStyle='#f4f0e6';x.fillRect(ox-1,5,10,15);x.fillStyle=`rgb(${W.join(',')})`;x.fillRect(ox,6,8,12);
    x.fillStyle='rgba(200,230,255,.55)';x.fillRect(ox+1,7,2,4);x.fillRect(ox+3,7,1,2);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(ox,6,8,1);
    x.fillStyle='#f4f0e6';x.fillRect(ox,11,8,1);x.fillRect(ox+3,6,1,12);x.fillStyle='#e8e2d4';x.fillRect(ox-2,20,12,2);x.fillStyle=sh(.72);x.fillRect(ox-1,22,10,1);});
  x.fillStyle=sh(.86);x.fillRect(0,29,32,3);x.fillStyle=sh(.8);x.fillRect(0,31,32,1);
  return lmat(c,[rx,ry]);}
function lmat(c,rep,extra){return new THREE.MeshLambertMaterial(Object.assign({map:ctex(c,rep?{rep}:{})},extra||{}));}

function box(w,h,d,mat,x,y,z,opts){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=!(opts&&opts.noCast);m.receiveShadow=true;scene.add(m);return m;}
function flat(w,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;scene.add(m);return m;}

