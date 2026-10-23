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
function lmat(c,rep,extra){return new THREE.MeshLambertMaterial(Object.assign({map:ctex(c,rep?{rep}:{})},extra||{}));}

function box(w,h,d,mat,x,y,z,opts){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=!(opts&&opts.noCast);m.receiveShadow=true;scene.add(m);return m;}
function flat(w,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;scene.add(m);return m;}

