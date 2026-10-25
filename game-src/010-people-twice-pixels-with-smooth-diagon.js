// ---- people: twice the pixels with smooth diagonals, thin outline, soft volume, eye shine ----
function charHD(src){const W=src.width,H=src.height,s=src.getContext('2d').getImageData(0,0,W,H).data,W2=W*2,H2=H*2;
  const key=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return -1;const o=(y*W+x)*4;return s[o+3]<128?-1:(s[o]<<16)|(s[o+1]<<8)|s[o+2];};
  const lum=k=>k<0?1:(((k>>16)&255)*.3+((k>>8)&255)*.59+(k&255)*.11)/255;
  const out=new Int32Array(W2*H2).fill(-1),src2=new Int32Array(W2*H2);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const P=key(x,y),A=key(x,y-1),B=key(x+1,y),C=key(x-1,y),D=key(x,y+1);
    let e0=P,e1=P,e2=P,e3=P;if(C===A&&C!==D&&A!==B)e0=A;if(A===B&&A!==C&&B!==D)e1=B;if(D===C&&D!==B&&C!==A)e2=C;if(B===D&&B!==A&&D!==C)e3=D;
    // never grow transparency into the body or outline into skin: only smooth between solid colours and along the silhouette
    const o=y*2*W2+x*2;out[o]=e0;out[o+1]=e1;out[o+W2]=e2;out[o+W2+1]=e3;src2[o]=src2[o+1]=src2[o+W2]=src2[o+W2+1]=P;}
  const at=(x,y)=>x<0||y<0||x>=W2||y>=H2?-1:out[y*W2+x];
  const isOut=k=>k>=0&&lum(k)<.2;
  const sh=(k,f)=>k<0?k:(Math.min(255,Math.round(((k>>16)&255)*f))<<16)|(Math.min(255,Math.round(((k>>8)&255)*f))<<8)|Math.min(255,Math.round((k&255)*f));
  const res=Int32Array.from(out);
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x,k=out[i];if(k<0)continue;
    const n4=[at(x,y-1),at(x-1,y),at(x+1,y),at(x,y+1)];
    // thin outline: the inner half of a 2px outline takes the colour inside it, a little darker
    if(isOut(k)&&!n4.some(q=>q<0)){const inner=n4.find(q=>q>=0&&!isOut(q));if(inner!==undefined){res[i]=sh(inner,.78);continue;}}
    if(isOut(k))continue;
    // soft volume: light from the top left along the silhouette, shade on the bottom right
    const up=n4[0],lf=n4[1],rt=n4[2],dn=n4[3];
    if((up<0||isOut(up))||(lf<0||isOut(lf)))res[i]=sh(k,1.1);else if((dn<0||isOut(dn))||(rt<0||isOut(rt)))res[i]=sh(k,.88);}
  // rounded shading: each colour patch gets a little lighter at its top and darker at its bottom, dithered at the finer size
  for(let x=0;x<W;x++){let y=0;while(y<H){const k=key(x,y);let e=y;while(e+1<H&&key(x,e+1)===k)e++;const n=e-y+1;
    if(k>=0&&!isOut(k)&&n>=3)for(let yy=y*2;yy<=e*2+1;yy++){const t=(yy-y*2+.5)/(n*2);const f=1.06-.14*t;
      for(const xx of[x*2,x*2+1]){const th=L2_BAYER[((yy&3)*4)+(xx&3)]/16;const i=yy*W2+xx;if(res[i]!==out[i]||res[i]<0||isOut(res[i]))continue;const g=f>1?(th<(f-1)*7?1.06:1):(th<(1-f)*6?.93:1);if(g!==1)res[i]=sh(res[i],g);}}
    y=e+1;}}
  // eye shine: a small dark spot in a light face area gets a white sparkle
  for(let y=1;y<Math.floor(H*.55);y++)for(let x=1;x<W-1;x++){const k=key(x,y);if(k<0||lum(k)>.25)continue;const nb=[key(x,y-1),key(x-1,y),key(x+1,y),key(x,y+1)];if(nb.some(q=>q<0||lum(q)<.42))continue;res[(y*2)*W2+x*2]=0xffffff;}
  const cv=mk(W2,H2),cx=cv.getContext('2d'),id=cx.createImageData(W2,H2),d=id.data;for(let i=0;i<W2*H2;i++){const k=res[i];if(k<0)continue;d[i*4]=(k>>16)&255;d[i*4+1]=(k>>8)&255;d[i*4+2]=k&255;d[i*4+3]=255;}cx.putImageData(id,0,0);return cv;}
if(LOOK2.on){const _mk=mkFrame;mkFrame=function(f){const had=!!f.m;const r=_mk(f);if(!had&&f.t&&f.c&&f.c.width<=96&&f.c.width>=16&&f.c.height>=20){f.lo=f.c;f.hi=charHD(f.c);f.t.image=LOOK2.people?f.hi:f.lo;f.t.needsUpdate=true;LOOK2.frames.push(f);}return r;};}
// ---- apply to every plant: replaces the v1 HD pass when the layer is on ----
function plant2Apply(){if(!LOOK2.on)return;const tset=new Set(trees.map(t=>t.m.material&&t.m.material.map));const seen=new Map();const season=typeof S!=='undefined'&&S.day?seasonOf(S.day):0;
  BB.forEach(o=>{if(o.userData.frames)return;const m=o.material,t=m&&m.map;if(!t||!t.image)return;if(typeof SIGN_TEX!=='undefined'&&SIGN_TEX.has(t))return;
    if(!t.__l2){const src=t.__src||t.image;if(!src.getContext||src.width>96||src.width*src.height<100)return;const P=plantParse(src);if(!P){t.__l2={none:true};return;}
      t.__l2={P,seed:(src.width*131+src.height*17+LOOK2.tex.length*7)|0,cache:{},v1:t.image};LOOK2.tex.push(t);}
    if(t.__l2.none)return;let key=t;
    if(ROTT3_ON){let isl=false;try{isl=zoneOf(o.position.x)==='island';}catch(e){isl=false;}const spc=isl&&rottSpecies(t.__l2.P,(t.__l2.seed>>2)&1);
      if(spc){if(!rottRamps.done){rottRamps();rottRamps.done=1;}if(!t.__twin){const tI=t.clone();tI.image=t.image;tI.needsUpdate=true;const L0=t.__l2;tI.__l2={P:Object.assign({},L0.P,{sp:spc}),seed:L0.seed+999,cache:{},v1:L0.v1};LOOK2.tex.push(tI);t.__twin=tI;}key=t.__twin;}}
    if(!seen.has(key))seen.set(key,[]);seen.get(key).push(o);});
  // per texture: two seeds (A/B) x two shades, shared by the trees that use them
  for(const [t,meshes] of seen){const L=t.__l2;const base=meshes[0].material;const variants=[];
    const tB=t.clone();tB.image=t.image;tB.needsUpdate=true;L.tB=tB;
    [[t,1],[t,.9],[tB,1],[tB,1.07]].forEach(([tex,shade],vi)=>{const m=base.clone();m.map=tex;m.emissiveMap=null;m.color=new THREE.Color(shade,shade*(shade<1?1.04:.99),shade*(shade<1?.96:.92));
      plantSway(m);const d=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:tex,alphaTest:.5});plantSway(d);
      const f=new THREE.MeshLambertMaterial({map:tex,alphaTest:.02,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false});plantSway(f);
      const rimT=new THREE.CanvasTexture(mk(2,2));rimT.magFilter=THREE.NearestFilter;rimT.minFilter=THREE.NearestFilter;rimT.generateMipmaps=false;m.emissiveMap=rimT;m.emissive=new THREE.Color(.2,.2,.18);f.emissiveMap=rimT;f.emissive=new THREE.Color(.2,.2,.18);
      variants.push({m,d,f,rimT,tex,orig:{m:base,d:meshes[0].customDepthMaterial}});LOOK2.mats.push(m,f);});
    L.variants=variants;
    meshes.forEach(o=>{const h=l2hash(Math.round(o.position.x*3),Math.round(o.position.z*3),9);const v=variants[Math.floor(h*4)%4];o.__l2={v,orig:{m:o.material,d:o.customDepthMaterial,s:o.scale.x}};
      o.material=v.m;o.customDepthMaterial=v.d;const sc=.88+l2hash(Math.round(o.position.x*5),Math.round(o.position.z*5),3)*.27;o.scale.setScalar(sc*o.__l2.orig.s);
      const tr=trees.find(q=>q.m===o);if(tr){o.__l2.tv=tr.v;tr.v={...tr.v,m:v.m,f:v.f,d:v.d};}});}
  plant2Season(season,true);
  // contact shadows under the trees
  if(!LOOK2.shadows){const list=[];BB.forEach(o=>{if(o.__l2&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.height>1.8)list.push(o);});
    const g=new THREE.PlaneGeometry(1,.6);g.rotateX(-Math.PI/2);const mat=new THREE.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false,opacity:.75});
    const im=new THREE.InstancedMesh(g,mat,list.length);const M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),V=new THREE.Vector3();
    list.forEach((o,i)=>{const w=o.geometry.parameters.width*o.scale.x*.62;M4.compose(V.set(o.position.x,.035,o.position.z+.05),Q,new THREE.Vector3(w,1,w));im.setMatrixAt(i,M4);});im.renderOrder=1;scene.add(im);LOOK2.shadows=im;}
  // jacaranda petals on the ground
  if(!LOOK2.petals.length){const c=mk(32,20),x=c.getContext('2d');const r=mulberry32(77);for(let i=0;i<70;i++){const a=r()*6.283,q=Math.sqrt(r());x.fillStyle=['#9a7ad8','#b89aea','#7a5ab8'][i%3];x.fillRect(16+Math.cos(a)*q*15|0,10+Math.sin(a)*q*9|0,1,1);}
    const mat=new THREE.MeshLambertMaterial({map:ctex(c),transparent:true,depthWrite:false});trees.forEach(tr=>{const t=tr.m.material.map;const own=LOOK2.tex.find(q=>q===t||(q.__l2&&q.__l2.tB===t));if(!own||own.__l2.P.kind!=='jac')return;
      const p=new THREE.Mesh(new THREE.PlaneGeometry(3.4,2.2),mat);p.rotation.x=-Math.PI/2;p.position.set(tr.x,.03,tr.z+.2);scene.add(p);LOOK2.petals.push(p);});LOOK2.petalMat=mat;}}
function plant2Season(season,force){if(!force&&season===LOOK2.season)return;LOOK2.season=season;
  for(const t of LOOK2.tex){const L=t.__l2;if(!L||L.none)continue;const key=season+'';if(!L.cache[key]){const a=plantPaint(L.P,season,L.seed),b=plantPaint(L.P,season,L.seed+101);L.cache[key]=[a,b];}
    const [a,b]=L.cache[key];if(!a)continue;const on=LOOK2.plants;
    t.image=on?a.img:L.v1;t.needsUpdate=true;if(L.tB){L.tB.image=on?(b||a).img:L.v1;L.tB.needsUpdate=true;}
    (L.variants||[]).forEach(v=>{const r=(v.tex===t?a:(b||a)).rim;v.rimT.image=on?r:(v.tex.image);v.rimT.needsUpdate=true;});}
  if(LOOK2.petalMat)LOOK2.petals.forEach(p=>p.visible=LOOK2.plants&&(season===3||season===0));}
// falling leaves and petals, more when it is windy or in autumn
function plant2Leaves(){if(LOOK2.leaves)return;const N=90,g=new THREE.BufferGeometry(),pos=new Float32Array(N*3),col=new Float32Array(N*3);g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const c=mk(4,4),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(1,0,2,4);x.fillRect(0,1,4,2);
  const m=new THREE.PointsMaterial({size:.16,map:ctex(c),vertexColors:true,transparent:true,alphaTest:.5,depthWrite:false});const p=new THREE.Points(g,m);p.frustumCulled=false;scene.add(p);
  const st=[];for(let i=0;i<N;i++)st.push({x:0,y:-1,z:0,vx:0,vy:0,ph:Math.random()*6});LOOK2.leaves={p,st,pos,col};}
const L2_LEAFCOL=[[[.36,.55,.26],[.52,.66,.3]],[[.82,.42,.16],[.92,.7,.24],[.66,.24,.12]],[[.42,.48,.3],[.56,.5,.3]],[[.98,.86,.92],[.72,.56,.9]]];
function plant2Tick(dt){if(!LOOK2.on)return;dt=Math.min(dt||0,.1);
  // golden rim at sunrise and sunset, dim at night
  const h=(typeof S!=='undefined'?S.time:720)/60,g=Math.max(Math.exp(-Math.pow((h-7)/1.3,2)),Math.exp(-Math.pow((h-18)/1.2,2))),n=typeof NIGHT==='number'?NIGHT:0;
  const k=LOOK2.plants?(.16+.38*g)*(1-n*.85):.12;for(const m of LOOK2.mats)m.emissive.setRGB(k,k*(.9-g*.08),k*(.78-g*.2));
  if(typeof S!=='undefined'&&S.day){const s=seasonOf(S.day);if(s!==LOOK2.season)plant2Season(s);}
  plant2Leaves();const L=LOOK2.leaves;L.p.visible=LOOK2.plants&&running;if(!L.p.visible)return;
  const wind=typeof wxC!=='undefined'?wxC.wind:.3,season=Math.max(0,LOOK2.season),want=Math.round((season===1?55:season===3?30:12)+wind*40),C=L2_LEAFCOL[season];
  const px=player.x,pz=player.z,t=performance.now()/1000;
  for(let i=0;i<L.st.length;i++){const q=L.st[i];const active=i<want;
    if(q.y<0){if(!active){L.pos[i*3+1]=-50;continue;}q.x=px+(Math.random()-.5)*22;q.z=pz+(Math.random()-.5)*16;q.y=2.5+Math.random()*3;q.vx=0;const c=C[i%C.length];L.col[i*3]=c[0];L.col[i*3+1]=c[1];L.col[i*3+2]=c[2];}
    q.vy=-.35-((i*7)%5)*.05;q.vx+=((wind*1.8)-q.vx)*dt;q.x+=(q.vx+Math.sin(t*2+q.ph)*.35)*dt;q.z+=Math.cos(t*1.6+q.ph)*.25*dt;q.y+=q.vy*dt;
    if(Math.abs(q.x-px)>14||Math.abs(q.z-pz)>11)q.y=-1;L.pos[i*3]=q.x;L.pos[i*3+1]=q.y;L.pos[i*3+2]=q.z;}
  L.p.geometry.attributes.position.needsUpdate=true;L.p.geometry.attributes.color.needsUpdate=true;}
LOOK2.setPlants=function(on){this.plants=on;BB.forEach(o=>{if(!o.__l2)return;const tr=trees.find(q=>q.m===o);if(on){o.material=o.__l2.v.m;o.customDepthMaterial=o.__l2.v.d;if(tr)tr.v={...o.__l2.tv,m:o.__l2.v.m,f:o.__l2.v.f,d:o.__l2.v.d};}else{o.material=o.__l2.orig.m;o.customDepthMaterial=o.__l2.orig.d;if(tr)tr.v=o.__l2.tv;}});
  if(this.shadows)this.shadows.visible=on;plant2Season(this.season,true);};
LOOK2.setPeople=function(on){this.people=on;this.frames.forEach(f=>{f.t.image=on?f.hi:f.lo;f.t.needsUpdate=true;});};

// pick front / back / side from each character's last walk direction relative to the camera (the camera can turn)
function dir4Tick(){const cy=Math.cos(yaw),sy=Math.sin(yaw),mir=scene.scale.x<0?-1:1;
  for(let k=0;k<DIR4.length;k++){const m=DIR4[k],u=m.userData;if(!m.visible){u.px=null;continue;}const p=m.position;
    if(u.px!=null){const dx=p.x-u.px,dz=p.z-u.pz,d2=dx*dx+dz*dz;if(d2>4e-6&&d2<4){u.wx=dx;u.wz=dz;}}u.px=p.x;u.pz=p.z;
    if(u.wx!=null){const sx=u.wx*cy-u.wz*sy,sd=u.wx*sy+u.wz*cy,ax=Math.abs(sx),ad=Math.abs(sd);let d=u.dir;if(ad>ax*1.3)d=sd>0?0:1;else if(ax>ad*1.1)d=2;
      if(d!==u.dir){u.dir=d;showFrame(m);}}
    if(u.dir!==2)m.scale.x=Math.abs(m.scale.x)*mir;}}
const blobTex=(()=>{const c=mk(32,32),x=c.getContext('2d');const g=x.createRadialGradient(16,16,2,16,16,15);g.addColorStop(0,'rgba(20,20,30,.45)');g.addColorStop(1,'rgba(20,20,30,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c,{smooth:true});})();
function blob(s){const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s*.55),new THREE.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.renderOrder=1;scene.add(m);return m;}

