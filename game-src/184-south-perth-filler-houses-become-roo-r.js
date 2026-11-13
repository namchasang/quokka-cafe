/* the South Perth filler houses become Roo Road Rescue's Perth houses (runs at the end of the town2 skin pass) */
function town3Houses(){const out={brick:0,cottage:0,fed:0,where:[]};town3Houses.out=out;window.__town3=out;
  const G=new THREE.Group();G.name='town3';G.__pxSkip=1;scene.add(G);town3Houses.g=G;
  const isBox=(m,w,h,d)=>m&&m.isMesh&&m.geometry&&m.geometry.type==='BoxGeometry'&&Math.abs(m.geometry.parameters.width-w)<.01&&Math.abs(m.geometry.parameters.height-h)<.01&&Math.abs(m.geometry.parameters.depth-d)<.01;
  const list=[];scene.children.forEach(g=>{if(!g.isGroup||!g.visible||g.__pxSkip)return;const x=g.position.x,z=g.position.z;if(x<100||x>250)return;
    // Mill Point Road, south side: plain boxes with a cone roof, fronts to the road (north), fence 2.6 m in front
    if(Math.abs(z-27.8)<.05&&g.children.length<=3&&isBox(g.children[0],3.4,1.8,2.6))list.push({g,x,z,W:3.4,D:2.6,face:-1,yard:1.25,back:3,fade:true});
    // the bungalows on the lane (z 16): fronts to the south, fence 3.1 m in front of the centre
    else if(Math.abs(z-16)<.05&&isBox(g.children[0],3.2,1.8,2.8))list.push({g,x,z,W:3.2,D:2.8,face:1,yard:1.65,back:0,fade:false});});
  list.sort((a,b)=>a.x-b.x);
  // which design goes where: the lot sold as a "Federation bungalow" gets the Federation one; the rest alternate
  const order=['brick','cottage','fed','brick','cottage','fed','cottage','brick'];let k=0;
  list.forEach(L=>{let kind=Math.abs(L.x-132.2)<.1&&L.z<20?'fed':order[k++%order.length];const s=(Math.round(L.x*3)*7+Math.round(L.z*5)*13)>>>0;
    let fadeEntry=null;if(L.fade&&typeof SP_FADE!=='undefined'){const ms=new Set();L.g.traverse(q=>{if(q.isMesh)(Array.isArray(q.material)?q.material:[q.material]).forEach(m=>ms.add(m));});fadeEntry=SP_FADE.find(f=>f.mats.some(m=>ms.has(m)));}
    const r=t3House(kind,L.x,L.z,L.W,L.D,L.face,s,{yard:L.yard,back:L.back,fade:!!fadeEntry});
    L.g.visible=false;L.g.__t3gone=1;if(fadeEntry)SP_FADE.push({mats:r.mats,x1:L.x-L.W/2,x2:L.x+L.W/2,z1:L.z-L.D/2,z2:L.z+L.D/2,h:3,o:1});// its own fade box: the exact footprint
    out[kind]++;out.where.push([kind,L.x,L.z]);});
  return out;}
// ---------- Map fixes (Paul, Nov 2026): South Perth is one full rectangle of land, and the Fremantle street by the
// market square gets a row of little shops. Runs at the end of pxbScene, after every other pass has painted the ground. ----------
function mapfixBuild(){const st={};scene.updateMatrixWorld(true);
  try{st.sp=mapfixSquareSP();}catch(e){console.error(e);}
  try{st.freo=mapfixFreoShops();}catch(e){console.error(e);}
  st.sky=typeof spBuild_sky!=='undefined'?spBuild_sky.removed:null;window.__mapfix=st;}
// South Perth: copy the finished ground strips (lawn, footpath, Mill Point Rd, cycle lanes, kerbs, limestone base) out to the
// map edge wherever the land was notched, so the land is a clean rectangle. The walkable area is widened in blocked().
function mapfixSquareSP(){const B=new THREE.Box3(),n={w:0,s:0,e:0,dash:0};const ground=[];
  scene.children.forEach(o=>{if(!o.isMesh||!o.visible||Array.isArray(o.material)||!o.geometry)return;const t=o.geometry.type;if(t!=='PlaneGeometry'&&t!=='BoxGeometry')return;
    B.setFromObject(o);if(B.isEmpty()||B.max.y>.1||B.min.y<-.6)return;const a=scene.worldToLocal(B.min.clone()),b=scene.worldToLocal(B.max.clone());
    const x0=Math.min(a.x,b.x),x1=Math.max(a.x,b.x),z0=Math.min(a.z,b.z),z1=Math.max(a.z,b.z);if(x0<95||x1>205||z1<-6||z0>36)return;ground.push({o,x0,x1,z0,z1,box:t==='BoxGeometry'});});
  // a copy of ground strip g covering [X0,X1] x [Z0,Z1] (scene-local), same look, texture repeat scaled to the new size
  const copy=(g,X0,X1,Z0,Z1)=>{const W=X1-X0,D=Z1-Z0;if(W<.05||D<.05)return null;const o=g.o,m=o.material,p=o.geometry.parameters;
    let geo,W0,D0;if(g.box){geo=new THREE.BoxGeometry(W,p.height,D);W0=p.width;D0=p.depth;}else{geo=new THREE.PlaneGeometry(W,D);W0=p.width;D0=p.height;}
    const m2=m.clone();if(m.map){const t=m.map.clone();t.needsUpdate=true;t.repeat.set(m.map.repeat.x*W/W0,m.map.repeat.y*D/D0);m2.map=t;}
    const c=new THREE.Mesh(geo,m2);c.rotation.copy(o.rotation);c.position.set((X0+X1)/2,o.position.y,(Z0+Z1)/2);c.receiveShadow=true;c.castShadow=false;c.renderOrder=o.renderOrder;c.__pxSkip=1;scene.add(c);return c;};
  // 1. the west notch: the lawn, Mill Point Rd and the south gardens run on to the west edge (x 100)
  ground.forEach(g=>{if(g.x0<111.5||g.x0>113.5||g.z1<11.9||g.z0>33.5)return;const z0=Math.max(g.z0,g.box?12:11.85),z1=Math.min(g.z1,33.5);if(copy(g,100,g.x0,z0,z1))n.w++;});
  // 2. the east foreshore stopped short of the east edge (x 199) while the land south of it reaches 200.5
  ground.forEach(g=>{if(g.x1<198.6||g.x1>199.4||g.z1>10.5||g.z0<-4.5)return;if(copy(g,g.x1,200.5,g.z0,g.z1))n.e++;});
  // 3. the white centre dashes of Mill Point Rd
  {let d=null;scene.children.forEach(o=>{if(d||!o.isMesh||!o.geometry||o.geometry.type!=='PlaneGeometry')return;const p=o.position;if(Math.abs(p.z-22.2)<.05&&Math.abs(p.x-114)<.05&&Math.abs(o.geometry.parameters.width-1.1)<.01)d=o;});
    if(d)for(let x=111.6;x>100.5;x-=2.4){const c=d.clone();c.position.x=x;c.__pxSkip=1;scene.add(c);n.dash++;}}
  return n;}
// Fremantle, the short street between High St and the market square (x 296): the backs of the four blocks on its east side were
// plain flat colour. Each gets a painted pixel shopfront facing the street (window of goods, door, upper windows, cornice),
// a striped awning on brackets, a name board and a lamp; lit windows glow at night. Footprints and colliders stay the same.
function mapfixFreoShops(){const SH=[
    {name:'CRUST & CRUMB',sub:'BAKERY',bg:'#7a3a22',fg:'#f6e6c0',aw:['#c9473f','#f4ecd8'],tint:'#c8a070',door:'#7a3a22',kind:'render'},
    {name:'DOG-EAR BOOKS',sub:'NEW & USED',bg:'#2f5a46',fg:'#f2e6c8',aw:['#3f7a5a','#efe3c4'],tint:'#8a7a5a',door:'#2f5a46',kind:'brick'},
    {name:'GELATO LUNA',sub:'',bg:'#f4b8c8',fg:'#6a2a4a',aw:['#e88aa8','#f6f2e8'],tint:'#d8a8c0',door:'#4a8a8a',kind:'render'},
    {name:'SALT & SWELL',sub:'SURF SHOP',bg:'#1d3a6e',fg:'#f2f2ea',aw:['#2f6a9e','#f6f6f2'],tint:'#5a8ab0',door:'#1d3a6e',kind:'board'}];
  const FISH={name:'HARBOUR CATCH',sub:'FISH MARKET',bg:'#f2f2ea',fg:'#1d4a6e',aw:['#2f5a8a','#f6f6f2'],tint:'#7aa0b8',door:'#2f5a8a',kind:'render'};
  const B=new THREE.Box3(),found=[];scene.updateMatrixWorld(true);
  scene.traverse(o=>{if(!o.isMesh||!o.visible||!o.geometry||o.geometry.type!=='BoxGeometry')return;B.setFromObject(o);const a=scene.worldToLocal(B.min.clone()),b=scene.worldToLocal(B.max.clone());
    const x0=Math.min(a.x,b.x),x1=Math.max(a.x,b.x),z0=Math.min(a.z,b.z),z1=Math.max(a.z,b.z),h=B.max.y-B.min.y;
    if(Math.abs(x0-299.8)>.25||Math.abs(x1-302)>.3||z0<8.5||z1>21.5||z1-z0<2.4||z1-z0>3.5||h<2.2||h>4||B.min.y>.1)return;
    const mm=Array.isArray(o.material)?(o.material[1]||o.material[0]):o.material;found.push({o,x0,z0,z1,h:B.max.y,col:mm&&mm.color?'#'+mm.color.getHexString():'#f2dc96'});});
  found.sort((p,q)=>p.z0-q.z0);if(!found.length){console.warn('mapfix: Freo blocks not found');return 0;}
  const P=PXK.P,PPM=32,px=m=>Math.max(2,Math.round(m*PPM));
  const T=c=>ctex(c);const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:T(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:T(PXK.glowDiff(a,b))});PXB_GLOW.push(m);return m;};
  const base=c=>{const l=PXK.lum(c);return l>.86?PXK.mix(c,'#d8c49a',.25):c;};
  // the painted face: shop on the ground floor, a row of windows upstairs on the two-storey blocks
  const paintFace=(w,h,col,S,seed,lit)=>{const W=px(w),H=px(h),[c,x]=T2.cv(W,H);T2.seed(seed);T2.surface(x,W,H,base(col),S.kind);
    const r=T2.ramp(base(col));P(x,r[1],0,0,2,H);P(x,r[1],W-2,0,2,H);P(x,r[4],2,0,1,H);P(x,r[4],W-3,0,1,H);// pilasters
    const gf=px(2.3);// ground floor
    // fascia band where the name board goes
    if(h>3)P(x,PXK.sh(S.bg,.7),3,H-gf-2,W-6,px(.38));
    // shopfront: timber frame, big window of goods, a stall riser, a door at one side
    const dw=px(.78),dh=px(1.92),dX=W-dw-px(.32),wX=px(.28),wW=dX-wX-px(.22),wY=H-px(1.95),wH=px(1.32);
    P(x,'#2a2230',wX-3,wY-3,wW+6,H-wY);P(x,PXK.sh(S.door,1.05),wX-2,wY-2,wW+4,H-wY-1);
    const g=PXK.glass(wW,wH,{lit,tint:S.tint,seed});x.drawImage(g,wX,wY);
    P(x,PXK.sh(S.door,.8),wX,wY+wH,wW,H-wY-wH-3);P(x,PXK.sh(S.door,1.2),wX,wY+wH,wW,1);for(let X=wX+4;X<wX+wW-4;X+=10)P(x,PXK.sh(S.door,.62),X,wY+wH+3,6,H-wY-wH-9);
    T2.door(x,dX,H-dh-2,dw,dh,{col:S.door,frame:'#f6f2e8',lit});
    // a little hanging price card and a chalk menu in the window
    P(x,'#f6f2e8',wX+4,wY+4,8,6);P(x,'#2a2230',wX+5,wY+6,6,1);P(x,'#2a2230',wX+5,wY+8,4,1);
    if(h>3){const uY=px(.32),uH=Math.min(px(.82),H-gf-uY-px(.5)),n=w>2.85?2:2,step=W/n;for(let i=0;i<n;i++){const ww=px(.55);T2.win(x,step*(i+.5)-ww/2,uY+px(.12),ww,uH,{lit:lit&&((seed+i)%3!==0),frame:'#f6f2e8',wall:base(col)});}
      T2.cornice(x,W,PXK.mix(base(col),'#f6f2e8',.5));}
    T2.plinth(x,W,H,'#b8a88c');return c;};
  // a plain upper wall (the side of a taller block showing above a lower one)
  const paintUpper=(w,h,col,seed,lit)=>{const W=px(w),H=px(h),[c,x]=T2.cv(W,H);T2.seed(seed);T2.surface(x,W,H,base(col),'render');const ww=px(.5),wh=Math.min(px(.7),H-px(.45));
    T2.win(x,(W-ww)/2,px(.2),ww,wh,{lit,frame:'#f6f2e8',wall:base(col)});T2.cornice(x,W,PXK.mix(base(col),'#f6f2e8',.5));return c;};
  const host=found[0].o.parent||scene;const G=new THREE.Group();G.name='mapfix_freo';host.add(G);G.matrixAutoUpdate=false;
  G.matrix.copy(new THREE.Matrix4().copy(host.matrixWorld).invert().multiply(scene.matrixWorld));G.updateMatrixWorld(true);
  const mesh=(geo,mat,x,y,z,o={})=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.rx)m.rotation.x=o.rx;m.castShadow=!o.nc;m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;};
  const Bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const signMat=(S,W,H)=>{const t=makeSign(S.sub?[S.name,S.sub]:[S.name],W,H,S.bg,S.fg);const m=new THREE.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveIntensity:0,emissiveMap:t});m.__dim=.3;PXB_GLOW.push(m);return m;};
  const lampM=()=>{const l=new THREE.MeshBasicMaterial({color:'#e8d8a8'});return l;};
  const iron=M('#2c3036');
  // shopfront on a wall: face normal along -x (west face at x=X) or +z (south face at z=Z); u runs along the wall
  const shop=(S,i,f)=>{const L=f.L,h=f.h;const mat=litMat(lit=>paintFace(L,h,f.col,S,31+i*17,lit));
    const at=(u,y,d)=>f.side==='w'?[f.X-d,y,f.U0+u]:[f.U0+u,y,f.Z+d];const ry=f.side==='w'?-Math.PI/2:0;
    const fc=mesh(new THREE.PlaneGeometry(L,h),mat,...at(L/2,h/2,.014),{ry,nc:1});
    // awning: striped canvas sloping out over the footpath, a valance, two iron brackets
    const aw=new THREE.MeshLambertMaterial({map:T(T2.stripes(Math.max(.6,L-.3),.9,S.aw[0],S.aw[1]))});const awL=L-.3,dep=.85,yA=Math.min(2.32,h-.12),tilt=.36;
    const a=mesh(f.side==='w'?Bx(dep,.03,awL):Bx(awL,.03,dep),aw,...at(L/2,yA-Math.sin(tilt)*dep/2,dep/2*Math.cos(tilt)),f.side==='w'?{rz:tilt}:{rx:tilt});
    const vl=new THREE.MeshLambertMaterial({map:T(T2.stripes(Math.max(.6,awL),.16,S.aw[0],S.aw[1]))});
    mesh(f.side==='w'?Bx(.025,.16,awL):Bx(awL,.16,.025),vl,...at(L/2,yA-Math.sin(tilt)*dep-.08,dep*Math.cos(tilt)),{nc:1});
    [.2,L-.2].forEach(u=>{mesh(f.side==='w'?Bx(.66,.035,.035):Bx(.035,.035,.66),iron,...at(u,yA-.32,.34),f.side==='w'?{rz:-.55,nc:1}:{rx:-.55,nc:1});});
    // name board on the fascia, above the awning
    // (on a single-storey block the board stands on the parapet above the roofline instead)
    const sw=Math.min(L-.4,2.6),sy=h>3?2.52:h+.2,sb=mesh(new THREE.PlaneGeometry(sw,.3),signMat(S,Math.round(sw*40),12),...at(L/2,sy,.03),{ry,nc:1});
    mesh(f.side==='w'?Bx(.04,.36,sw+.08):Bx(sw+.08,.36,.04),M(PXK.sh(S.bg,.6)),...at(L/2,sy,.008),{nc:1});
    if(h<=3)[.3,sw-.3].forEach(u=>mesh(Bx(.04,.3,.04),iron,...at(L/2-sw/2+u,h+.05,.03),{nc:1}));
    // a wall lamp beside the door, under the awning
    const lu=L-.32-.78-.12;const lm=mesh(Bx(.1,.14,.1),lampM(),...at(lu,Math.min(2.0,h-.5),.08),{nc:1});mesh(f.side==='w'?Bx(.08,.03,.03):Bx(.03,.03,.08),iron,...at(lu,Math.min(2.0,h-.5)+.09,.04),{nc:1});PXB_LAMPS.push(lm);
    return fc;};
  let n=0;found.forEach((b,i)=>{const S=SH[i%SH.length];shop(S,i,{side:'w',X:b.x0,U0:b.z0,L:b.z1-b.z0,h:b.h,col:b.col});n++;});
  // the last block's south end faces the cross street: a fish market there
  {const b=found[found.length-1];if(b.h>3){const L=2.2;shop(FISH,9,{side:'s',Z:b.z1,U0:b.x0,L,h:b.h,col:b.col});n++;}}
  // where a two-storey block stands beside the low one, its bare side wall above the roofline gets a window and cornice
  for(let i=0;i<found.length;i++){const b=found[i],lo=found.find(q=>q!==b&&q.h<b.h-.8&&(Math.abs(q.z0-b.z1)<.05||Math.abs(q.z1-b.z0)<.05));if(!lo)continue;
    const southSide=Math.abs(lo.z0-b.z1)<.05;if(!southSide)continue;const h=b.h-lo.h,L=2.2;const mat=litMat(lit=>paintUpper(L,h,b.col,70+i,lit));
    mesh(new THREE.PlaneGeometry(L,h),mat,b.x0+L/2,lo.h+h/2,b.z1+.014,{nc:1});n++;}
  return n;}
function pxbSig(m){if(Array.isArray(m))return m.map(pxbSig).join(',');if(!m)return'';return(m.color?m.color.getHexString():'')+'|'+(m.map?m.map.uuid:'')+'|'+(m.emissive?m.emissive.getHexString():'');}
// only (a Set of meshes): the same pass for just those meshes, after a save changed them (pxbCatchUp, HOME4); the builders do not run again
function pxbScene(only){pxbScene.done=true;const T0=performance.now();const SUB=!!only,TR=SUB?f=>only.forEach(f):f=>scene.traverse(f);
  if(!SUB){if(SP2_ON)try{spBuild_sky();}catch(e){console.error(e);}try{pxDeclutter();}catch(e){console.error(e);}if(SEA2_ON)try{sea2Build();}catch(e){console.error(e);}try{pxFixDiamonds();}catch(e){console.error(e);}try{pxbLaneClear();}catch(e){console.error(e);}if(TOWN2_ON)try{town2Thin();}catch(e){console.error(e);}if(TOWN2_ON)try{// the old terrace rows' gable ends were left standing as white triangles where town2 rebuilt the cottages
  scene.updateMatrixWorld(true);scene.traverse(o=>{if(o.isMesh&&o.parent&&o.parent.name==='freoDetail'&&o.geometry&&o.geometry.type==='PlaneGeometry'){const B=new THREE.Box3().setFromObject(o),c=scene.worldToLocal(B.getCenter(new THREE.Vector3())),sz=B.getSize(new THREE.Vector3());if(sz.y>2.5&&Math.max(sz.x,sz.z)<3&&Math.min(sz.x,sz.z)<.05&&c.x>270&&c.x<358&&(Math.abs(c.z-27.2)<.6||Math.abs(c.z-39.6)<.6))o.visible=false;}});}catch(e){}if(BLD3_ON){try{pxbBuild_kingstown();}catch(e){console.error(e);}try{pxbBuild_perthstn();}catch(e){console.error(e);}try{pxbBuild_freohotel();}catch(e){console.error(e);}}if(WEL4_ON)try{wel4Build();}catch(e){console.error(e);}if(VP2_ON)try{vp2Build();}catch(e){console.error(e);}}
  else{const gs=k=>scene.children.filter(g=>g.isGroup&&g.visible&&!(k.seen&&k.seen.has(g)));try{pxDeclutter(gs(pxDeclutter));}catch(e){console.error(e);}try{pxFixDiamonds(only);}catch(e){console.error(e);}try{pxbLaneClear(gs(pxbLaneClear));}catch(e){console.error(e);}}
  const V=new THREE.Vector3(),Q=new THREE.Quaternion(),SC=new THREE.Vector3(),B=new THREE.Box3();scene.updateMatrixWorld(true);
  if(!SUB){const R=pxbScene.orig=new Map();scene.traverse(o=>{if(o.isMesh)R.set(o,{m:o.material,v:o.visible});});}
  const isl=o=>{const m=o.material,im=m&&m.map&&m.map.image;return!im||im.width<=32;};// plain walls get the kit; walls with their own picture keep it (redrawn below)// every map; faces that already carry a painted picture keep it
  const hex=m=>m&&m.color?'#'+m.color.getHexString():'#e4d2a8';const r1=v=>Math.round(v*2)/2;
  const cache=new Map();const tm=(key,make,o)=>{let m=cache.get(key);if(!m){const c=make();m=new THREE.MeshLambertMaterial(Object.assign({map:ctex(c)},o||{}));m.map.minFilter=THREE.NearestFilter;m.map.generateMipmaps=false;cache.set(key,m);}return m;};
  const vehicle=o=>{for(let p=o.parent;p&&p!==scene;p=p.parent)if(p.__wheels>=3)return true;return false;};
  scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CylinderGeometry'&&o.parent&&o.parent!==scene&&!o.parent.__pxw){o.parent.__pxw=1;let n=0;o.parent.children.forEach(c=>{if(c.isMesh&&c.geometry&&c.geometry.type==='CylinderGeometry'&&c.geometry.parameters.radiusTop<.6&&Math.abs(c.rotation.x)+Math.abs(c.rotation.z)>1)n++;});if(n>=3)o.parent.__wheels=Math.max(o.parent.__wheels||0,n);}});
  const walls=[],panes=[],roofs=[];
  TR(o=>{if(!o.isMesh||o.__pxSkip||!o.visible||o.isInstancedMesh||!o.geometry||!o.material||Array.isArray(o.material)||o.material.transparent||o.material.vertexColors)return;const g=o.geometry,t=g.type,p=g.parameters||{};
    if(!(o.material.isMeshLambertMaterial||o.material.isMeshStandardMaterial||o.material.isMeshPhongMaterial))return;
    if(typeof SIGN_TEX!=='undefined'&&o.material.map&&SIGN_TEX.has(o.material.map))return;
    o.matrixWorld.decompose(V,Q,SC);const sx=Math.abs(SC.x),sy=Math.abs(SC.y),sz=Math.abs(SC.z);
    if(t==='BoxGeometry'){const w=p.width*sx,h=p.height*sy,d=p.depth*sz;if(vehicle(o))return;
      if(h>=1.3&&Math.max(w,d)>=1.6&&Math.min(w,d)>=.12){if(isl(o))walls.push({o,w,h,d});return;}
      if(h<.18&&w>=1.4&&d>=.6){o.getWorldPosition(V);if(V.y>1.2&&isl(o))roofs.push({o,kind:'flat',w,d});}return;}
    if(t==='CylinderGeometry'&&p.radialSegments<=4&&Math.abs(p.radiusTop-p.radiusBottom)<.01&&p.radiusTop*Math.max(sx,sz)>.8){o.getWorldPosition(V);if(V.y>1.4&&isl(o)&&!vehicle(o))roofs.push({o,kind:'prism',r:p.radiusTop,L:p.height*sy,n:p.radialSegments,s:Math.max(sx,sz)});return;}
    if(t==='ConeGeometry'&&p.radialSegments<=8&&p.radius*Math.max(sx,sz)>=.9){o.getWorldPosition(V);if(V.y>1.6&&isl(o)&&!vehicle(o))roofs.push({o,kind:'cone',r:p.radius*Math.max(sx,sz),h:p.height*sy,n:p.radialSegments});return;}
    if(t==='PlaneGeometry'&&!o.material.map){const w=p.width*sx,h=p.height*sy;if((w>1.8||h>1.8)&&w<=12&&h<=8&&w>.6&&h>.5&&pxGlassy(o.material.color)){o.getWorldPosition(V);if(V.y>.2){o.material=pxGlassMat(hex(o.material),w,h);}return;}if(w<.22||h<.22||w>1.8||h>1.8)return;o.getWorldPosition(V);if(V.y<.25||V.y>3.2)return;
      const c=o.material.color,l=c.r*.3+c.g*.59+c.b*.11;const isDoor=h>=.8&&h>w*1.3&&V.y-h/2<.35;if(!isDoor&&l>.62)return;if(isl(o))panes.push({o,w,h,door:isDoor,pos:V.clone()});}});
  // faces that already carry a painted picture (the towns from Paul's photos): keep the design, redraw it as pixel art at the kit's density
  const hdT=pxbScene.hdT||(pxbScene.hdT=new Map());let nh=0;
  const facadeHD=t=>{if(hdT.has(t))return hdT.get(t);let out=null;try{const im=t.image;if(!im||!(im.width>=8)||im.width>640||im.height>640||(typeof SIGN_TEX!=='undefined'&&SIGN_TEX.has(t)))throw 0;
      const k=Math.max(2,Math.min(3,Math.floor(1024/Math.max(im.width,im.height)))),W=im.width,H=im.height,W2=W*k,H2=H*k;
      const sc=document.createElement('canvas');sc.width=W;sc.height=H;const sx=sc.getContext('2d');sx.drawImage(im,0,0);const s0=sx.getImageData(0,0,W,H).data;
      const key=(x,y)=>{x=(x+W)%W;y=Math.max(0,Math.min(H-1,y));const o=(y*W+x)*4;return(s0[o]<<16)|(s0[o+1]<<8)|s0[o+2];};const lum=c=>(((c>>16)&255)*.3+((c>>8)&255)*.59+(c&255)*.11);
      const oc=document.createElement('canvas');oc.width=W2;oc.height=H2;const ox=oc.getContext('2d'),id=ox.createImageData(W2,H2),d=id.data;
      const put=(X,Y,c,f)=>{const o=(Y*W2+X)*4;d[o]=Math.min(255,((c>>16)&255)*f);d[o+1]=Math.min(255,((c>>8)&255)*f);d[o+2]=Math.min(255,(c&255)*f);d[o+3]=255;};
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=key(x,y),up=key(x,y-1),dn=key(x,y+1),lf=key(x-1,y),rt=key(x+1,y),L=lum(c);
        const n=1+(((x*73856093)^(y*19349663))&7)/160-.022;
        for(let j=0;j<k;j++)for(let i=0;i<k;i++){let f=n;
          if(j===0&&up!==c)f*=lum(up)<L-24?.62:1.12;// a lit top edge, or an inked edge under something darker
          else if(j===k-1&&dn!==c)f*=lum(dn)>L+24?.7:.86;// shade at the foot of each patch
          if(i===0&&lf!==c&&lum(lf)>L+40)f*=.72;if(i===k-1&&rt!==c&&lum(rt)>L+40)f*=.78;
          put(x*k+i,y*k+j,c,f);}}
      ox.putImageData(id,0,0);out=new THREE.CanvasTexture(oc);out.magFilter=out.minFilter=THREE.NearestFilter;out.generateMipmaps=false;out.wrapS=t.wrapS;out.wrapT=t.wrapT;out.repeat.copy(t.repeat);out.offset.copy(t.offset);out.rotation=t.rotation;out.center.copy(t.center);out.encoding=t.encoding;nh++;}catch(e){out=null;}
    hdT.set(t,out);return out;};
  const hdMat=pxbScene.hdMat||(pxbScene.hdMat=new Map());const upMat=m=>{if(!m||!m.map||m.__pxHD||m.transparent||m.alphaTest>0||m.isMeshBasicMaterial||m.isSpriteMaterial||m.isShaderMaterial)return m;{const q=hdMat.get(m);if(q&&q.s===pxbSig(m))return q.r;}const t=facadeHD(m.map);let r=m;if(t){r=m.clone();r.map=t;if(m.emissiveMap===m.map)r.emissiveMap=t;r.__pxHD=1;}hdMat.set(m,{r,s:pxbSig(m)});return r;};
  TR(o=>{if(!o.isMesh||o.__pxSkip||!o.geometry||!o.material)return;const t=o.geometry.type;if(t!=='BoxGeometry'&&t!=='PlaneGeometry'&&t!=='CylinderGeometry'&&t!=='ExtrudeGeometry'&&t!=='ShapeGeometry')return;
    o.geometry.computeBoundingBox&&!o.geometry.boundingBox&&o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox;if(!bb)return;o.matrixWorld.decompose(V,Q,SC);if((bb.max.y-bb.min.y)*Math.abs(SC.y)<1)return;
    if(typeof BB!=='undefined'&&BB.includes&&BB.includes(o))return;if(Array.isArray(o.material))o.material=o.material.map(upMat);else o.material=upMat(o.material);});
  // which wall face each pane sits on
  const inv=new THREE.Matrix4(),L=new THREE.Vector3();
  walls.forEach(W=>{W.faces=[0,0,0,0,0,0];inv.copy(W.o.matrixWorld).invert();const p=W.o.geometry.parameters;
    panes.forEach(P=>{L.copy(P.pos).applyMatrix4(inv);const ax=Math.abs(L.x)-p.width/2,az=Math.abs(L.z)-p.depth/2;
      if(Math.abs(L.y)<p.height/2+.1){if(Math.abs(ax)<.25&&Math.abs(L.z)<p.depth/2+.05)W.faces[L.x>0?0:1]++;else if(Math.abs(az)<.25&&Math.abs(L.x)<p.width/2+.05)W.faces[L.z>0?4:5]++;}});});
  let nw=0,nr=0,np=0;const glowMats=[];
  // the wall's own colour: material colour times the most common colour of its little tile (so a teal tower stays teal)
  const avgC=pxbScene.avgC||(pxbScene.avgC=new Map());const tileCol=m=>{const im=m.map&&m.map.image;if(!im)return hex(m);if(avgC.has(im))return avgC.get(im);let out=hex(m);try{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height).data;const cnt=new Map();let best=0,bk=0;
      for(let q=0;q<d.length;q+=4){const k=((d[q]>>3)<<10)|((d[q+1]>>3)<<5)|(d[q+2]>>3);const n=(cnt.get(k)||0)+1;cnt.set(k,n);if(n>best){best=n;bk=q;}}const col=new THREE.Color(d[bk]/255,d[bk+1]/255,d[bk+2]/255).multiply(m.color);out='#'+col.getHexString();}catch(e){}avgC.set(im,out);return out;};
  if(TOWN2_ON)try{town2Mark(walls);}catch(e){console.error(e);}walls.forEach((W,i)=>{if(TOWN2_ON)T2.cur=W;const base=TOWN2_ON&&W.__t2?T2.base(W,tileCol(W.o.material)):tileCol(W.o.material),lum=PXK.lum(base);const kind=lum>.84?'stone':lum<.3?'brick':'plaster';
    const big=W.w*W.d>4.5;const face=(fw,has,k)=>{const n=has||fw<1.7||W.h<1.25||Math.min(W.w,W.d)<.4?0:Math.max(1,Math.floor((fw-.6)/1.5));const key=['w',base,r1(fw),r1(W.h),n,k%2].join('|');
      const opt={base:lum>.95?'#ece0c2':base,kind,win:n,door:false,shutter:k%2?'#3d7a78':null,arch:big&&k%2===0,seed:13+k*7+(fw*10|0),ivy:fw>2.4&&(i%4===1)?[.05,.28]:null};
      if(W.h>6.6||fw>14){const mw=fw>14?6:Math.max(1.6,r1(fw)),mh=2.9,nx=Math.max(1,Math.round(fw/mw)),ny=Math.max(1,Math.round(W.h/mh)),k2=['m',base,mw,nx,ny,k%2].join('|');let mm=cache.get(k2);if(mm)return mm;
        const mo=Object.assign({},opt,{win:Math.max(1,Math.floor((mw-.4)/1.5)),rows:1,plinth:false,cornice:true,moss:false,ivy:null,shutter:null,arch:false,quoins:false,box:false});
        const day=PXK.wall(mw,mh,mo),lit=PXK.wall(mw,mh,Object.assign({},mo,{lit:true}));{const A=day.getContext('2d').getImageData(0,0,day.width,day.height),Bq=lit.getContext('2d').getImageData(0,0,day.width,day.height);for(let q=0;q<A.data.length;q+=4){const d=Math.abs(A.data[q]-Bq.data[q])+Math.abs(A.data[q+1]-Bq.data[q+1])+Math.abs(A.data[q+2]-Bq.data[q+2]);if(d<=30){Bq.data[q]=Bq.data[q+1]=Bq.data[q+2]=0;}}lit.getContext('2d').putImageData(Bq,0,0);}const t1=ctex(day),t2=ctex(lit);[t1,t2].forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(nx,ny);});
        mm=new THREE.MeshLambertMaterial({map:t1,emissive:0xffffff,emissiveIntensity:0,emissiveMap:t2});cache.set(k2,mm);glowMats.push(mm);return mm;}
      const fwR=Math.max(.6,r1(fw)),hR=Math.max(1,r1(W.h));fw=fwR;
      if(!n)return tm(key,()=>PXK.wall(fw,hR,opt));let m=cache.get(key);if(m)return m;
      // painted windows glow at night: the lit version minus the day version gives the glass only
      const day=PXK.wall(fw,hR,opt),lit=PXK.wall(fw,hR,Object.assign({},opt,{lit:true})),em=document.createElement('canvas');em.width=day.width;em.height=day.height;
      const a=day.getContext('2d').getImageData(0,0,day.width,day.height),b=lit.getContext('2d').getImageData(0,0,day.width,day.height),e=em.getContext('2d').createImageData(day.width,day.height);
      for(let q=0;q<a.data.length;q+=4){const dif=Math.abs(a.data[q]-b.data[q])+Math.abs(a.data[q+1]-b.data[q+1])+Math.abs(a.data[q+2]-b.data[q+2]);if(dif>30){e.data[q]=b.data[q];e.data[q+1]=b.data[q+1];e.data[q+2]=b.data[q+2];}e.data[q+3]=255;}
      em.getContext('2d').putImageData(e,0,0);m=new THREE.MeshLambertMaterial({map:ctex(day),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(em)});cache.set(key,m);glowMats.push(m);return m;};
    const top=tm('t|'+base,()=>{const[c,x]=PXK.cv(16,16);PXK.P(x,PXK.sh(base,.86),0,0,16,16);return c;});
    const flat=W.w*W.d>6&&W.h>=1.8?tm(['tf',r1(W.w),r1(W.d)].join('|'),()=>PXK.roof(W.w,W.d,{base:'#b8bcc0',kind:'tin',seed:5})):top;
    W.o.material=[face(W.d,W.faces[0],1),face(W.d,W.faces[1],3),flat,top,face(W.w,W.faces[4],0),face(W.w,W.faces[5],2)];W.o.castShadow=W.o.receiveShadow=true;nw++;});if(TOWN2_ON)T2.cur=null;
  // a four-sided cone roof is replaced by a proper hip roof cut to the wall it sits on (same footprint plus a small overhang, a gentle pitch)
  walls.forEach(W=>{W.box=new THREE.Box3().setFromObject(W.o);});const RB=new THREE.Box3(),RC=new THREE.Vector3();
  function pxHip(R,base,k){RB.setFromObject(R.o);RB.getCenter(RC);let best=null,bd=1e9;
    for(const W of walls){const b=W.box;if(RC.x<b.min.x||RC.x>b.max.x||RC.z<b.min.z||RC.z>b.max.z)continue;const dy=Math.abs(RB.min.y-b.max.y);if(dy<1&&dy<bd){bd=dy;best=W;}}
    if(!best)return false;if(best.__nc===undefined){best.__nc=roofs.filter(q=>{if(q.kind!=='cone')return false;RB.setFromObject(q.o);const c=RB.getCenter(new THREE.Vector3());const b=best.box;return c.x>b.min.x&&c.x<b.max.x&&c.z>b.min.z&&c.z<b.max.z&&Math.abs(RB.min.y-b.max.y)<1;}).length;RB.setFromObject(R.o);RB.getCenter(RC);}if(best.__nc>1)return false;const W=best,p=W.o.geometry.parameters,sx=W.w/p.width,sy=W.h/p.height,sz=W.d/p.depth,ov=.22;
    const X=p.width/2+ov/sx,Z=p.depth/2+ov/sz,y0=p.height/2,H=Math.min(W.w,W.d)/2*.8/sy,alongX=W.w>=W.d;
    const ix=alongX?Math.min(X,(W.d/2+ov)/sx):X,iz=alongX?Z:Math.min(Z,(W.w/2+ov)/sz);
    const R1=alongX?[-X+ix,y0+H,0]:[0,y0+H,-Z+iz],R2=alongX?[X-ix,y0+H,0]:[0,y0+H,Z-iz];
    const A=[-X,y0,-Z],Bv=[X,y0,-Z],C=[X,y0,Z],D=[-X,y0,Z];const pos=[],uv=[];
    const tri=(a,b,c,ua,ub,uc)=>{pos.push(...a,...b,...c);uv.push(...ua,...ub,...uc);};
    // u along the eave, v up the slope, both in metres / 2 (one roof tile canvas covers 2 m)
    const uvF=(q,ax,eaveC)=>[(ax==='x'?q[0]*sx:q[2]*sz)/2,(Math.abs(eaveC-(ax==='x'?q[2]*sz:q[0]*sx))+ (q[1]-y0)*sy*.3)/2];
    const face=(a,b,c,d,ax,ec)=>{const qs=[a,b,c,d].map(q=>uvF(q,ax,ec));tri(a,b,c,qs[0],qs[1],qs[2]);tri(a,c,d,qs[0],qs[2],qs[3]);};
    face(D,C,R2,R1,'x',Z*sz);face(Bv,A,R1,R2,'x',-Z*sz);
    const tface=(a,b,r,ax,ec)=>{tri(a,b,r,uvF(a,ax,ec),uvF(b,ax,ec),uvF(r,ax,ec));};
    tface(A,D,alongX?R1:R1,'z',-X*sx);tface(C,Bv,alongX?R2:R2,'z',X*sx);
    if(!alongX){pos.length=0;uv.length=0;face(A,D,R2,R1,'z',-X*sx);face(C,Bv,R1,R2,'z',X*sx);tface(D,C,R2,'x',Z*sz);tface(Bv,A,R1,'x',-Z*sz);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    const m=tm('hip|'+base+'|'+k,()=>PXK.roof(2,2,{base,kind:k,seed:17}),{side:THREE.DoubleSide});m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;
    const mesh=new THREE.Mesh(g,m);mesh.castShadow=mesh.receiveShadow=true;mesh.__pxSkip=1;W.o.add(mesh);
    // a dark fascia under the eaves
    const fb=new THREE.Mesh(new THREE.BoxGeometry(2*X,.1/sy,2*Z),new THREE.MeshLambertMaterial({color:new THREE.Color(base).multiplyScalar(.5)}));fb.position.y=y0+.02/sy;fb.__pxSkip=1;W.o.add(fb);
    R.o.visible=false;(pxbScene.hips=pxbScene.hips||[]).push([Math.round(RC.x),Math.round(RC.z),+W.w.toFixed(1),+W.d.toFixed(1),+(RB.max.x-RB.min.x).toFixed(1),+(RB.max.z-RB.min.z).toFixed(1),W.__nc]);return true;}
  const roofKind=c=>{const a=new THREE.Color(c);const hsl={};a.getHSL(hsl);return hsl.s<.22?'slate':(hsl.h>.18&&hsl.h<.5)?'tin':(hsl.h>.5&&hsl.h<.75)?'slate':'tile';};
  roofs.forEach(R=>{const base=hex(R.o.material),k=roofKind(base);
    if(R.kind==='prism'){const side=2*R.r*Math.sin(Math.PI/R.n)*R.s,circ=side*R.n;const m=tm(['rp',base,r1(circ),r1(R.L),k].join('|'),()=>PXK.roof(circ,R.L,{base,kind:k,across:true}));
      const cap=tm('rc|'+base,()=>PXK.wall(2*R.r*R.s,2*R.r*R.s,{base:'#e8dcc0',kind:'stone',win:0,plinth:false,cornice:false,moss:false}));R.o.material=[m,cap,cap];}
    else if(R.kind==='cone'&&R.n===4&&pxHip(R,base,k)){}
    else if(R.kind==='cone'){const per=2*R.r*Math.sin(Math.PI/R.n)*R.n,sl=Math.hypot(R.r,R.h);R.o.material=[tm(['rk',base,r1(per),r1(sl),k].join('|'),()=>PXK.roof(per,sl,{base,kind:k})),tm('t|'+base,()=>{const[c,x]=PXK.cv(8,8);PXK.P(x,PXK.sh(base,.6),0,0,8,8);return c;})];}
    else{const m=tm(['rf',base,r1(R.w),r1(R.d)].join('|'),()=>PXK.roof(R.w,R.d,{base,kind:k==='tile'?'tin':k}));const e=tm('t|'+base,()=>{const[c,x]=PXK.cv(8,8);PXK.P(x,PXK.sh(base,.7),0,0,8,8);return c;});R.o.material=[e,e,m,e,e,e];}
    R.o.castShadow=true;nr++;});
  panes.forEach(P=>{const col=hex(P.o.material);let m;
    if(P.door)m=tm('d|'+col,()=>PXK.doorPane(PXK.lum(col)<.2?'#2f5a46':col));
    else{const aspect=P.h/P.w,w=Math.max(8,Math.round(P.w*32)-6),h=Math.max(8,Math.round(P.h*32)-6),key='p|'+w+'|'+h;
      m=cache.get(key);if(!m){m=new THREE.MeshLambertMaterial({map:ctex(PXK.pane(false,w,h)),emissive:0xffffff,emissiveIntensity:0});m.emissiveMap=ctex(PXK.pane(true,w,h));cache.set(key,m);glowMats.push(m);}}
    P.o.material=m;np++;});
  // a door or window left standing on its own (its house was moved or taken away) goes too
  {const vis=o=>{for(let p=o;p;p=p.parent)if(p.visible===false)return false;return true;};const wb=(SUB?(pxbScene.W||[]).concat(walls):walls).filter(W=>vis(W.o)).map(W=>W.box||new THREE.Box3().setFromObject(W.o));const hasW=P=>{const p=P.pos;return wb.some(b=>p.x>b.min.x-.4&&p.x<b.max.x+.4&&p.z>b.min.z-.4&&p.z<b.max.z+.4&&p.y<b.max.y+.3);};
    panes.forEach(P=>{if(!vis(P.o))return;if(!hasW(P)){P.o.visible=false;P.o.__orph=1;}});
    // after a save: windows the title pass left alone or hid are judged again against the walls standing now
    if(SUB)(pxbScene.P||[]).forEach(P=>{if(P.o.__orph){P.o.visible=true;const ok=vis(P.o)&&hasW(P);P.o.visible=ok;if(ok)P.o.__orph=0;}else if(vis(P.o)&&!hasW(P)){P.o.visible=false;P.o.__orph=1;}});
    pxbScene.W=(SUB?pxbScene.W||[]:[]).concat(walls);pxbScene.P=(SUB?pxbScene.P||[]:[]).concat(panes);
    scene.updateMatrixWorld(true);const DB=new THREE.Box3(),DC=new THREE.Vector3();const allW=[];scene.traverse(o=>{if(o.isMesh&&vis(o)&&o.geometry&&(o.geometry.type==='BoxGeometry'||o.geometry.type==='CylinderGeometry')){DB.setFromObject(o);const sz=DB.getSize(DC);if(sz.y>1.2&&Math.max(sz.x,sz.z)>1.4){const bb=DB.clone();bb.__o=o;allW.push(bb);}}});
    let nd=0;TR(o=>{if(!o.isMesh||!vis(o)||!o.geometry||o.geometry.type!=='PlaneGeometry'||(o.userData&&o.userData.frames&&o.userData.frames.length>1))return;DB.setFromObject(o);const sz=DB.getSize(DC);if(sz.y<.8||sz.y>1.7||Math.max(sz.x,sz.z)>1.3||DB.min.y>.9||Math.min(sz.x,sz.z)>.6||!(o.material&&o.material.map&&o.material.map.image&&o.material.map.image.height>o.material.map.image.width))return;
      const c=DB.getCenter(new THREE.Vector3());if(scene.worldToLocal(c.clone()).x>100)return;const w=allW.find(b=>c.x>b.min.x-.35&&c.x<b.max.x+.35&&c.z>b.min.z-.35&&c.z<b.max.z+.35);if(!w){o.visible=false;o.__orph=1;nd++;}else PXB_DOORS.push([o,w.__o,w.__o.getWorldPosition(new THREE.Vector3())]);});window.__orphanDoors=nd;}
  if(TOWN2_ON)try{town2Skin(walls,roofs,panes,glowMats);}catch(e){console.error(e);}if(TOWN2_ON&&!SUB)try{town3Houses();}catch(e){console.error(e);}PXB_GLOW.push(...glowMats);pxbScene.glow=PXB_GLOW;try{pxOneLook(SUB?only:undefined);}catch(e){console.error(e);}if(SUB)pxbScene.sub={walls:nw,roofs:nr,panes:np,ms:Math.round(performance.now()-T0)};else pxbScene.stats={walls:nw,roofs:nr,panes:np,mats:cache.size,hd:nh,ms:Math.round(performance.now()-T0),one:pxOneLook.stats,hips:pxbScene.hips};window.__pxbStats=pxbScene.stats;if(typeof CBD!=='undefined'&&CBD.cut)CBD.cut.forEach(e=>{e.ready=false;});
  // Victoria Park shop fronts (painted from Paul's photos): real shop glass with goods behind it and a panelled door, both lit at night
  if(!SUB&&typeof VP_SHOPS!=='undefined'&&typeof REF_ON!=='undefined'&&REF_ON)VP_SHOPS.forEach((sh,i)=>{if(sh.id==='bkk'||sh.id==='pub')return;const h=sh.id==='kmax'?4.4:3,w=5.2,z=sh.z+1.71+.015;
    const gw=w*.58,gh=h*.5-.42,gx=sh.x-w/2+w*.08+gw/2,gy=.3+gh/2;const gm=pxGlassMat(['#4a6a86','#5a7a86','#4e6a7e'][i%3],gw,gh);const g=new THREE.Mesh(new THREE.PlaneGeometry(gw,gh),gm);g.position.set(gx,gy,z);g.__pxSkip=1;scene.add(g);
    const dw=w*.16,dh=h*.5-.3,dcol=['#2f5a46','#6a2a2a','#1d3a6e','#3a3e48','#7a4a2a'][i%5];const dk='vpd|'+dcol;let dm=cache.get(dk);if(!dm){const day=PXK.doorPane(dcol,Math.round(dw*32)-6,Math.round(dh*32)-4);dm=new THREE.MeshLambertMaterial({map:ctex(day)});cache.set(dk,dm);}
    const d=new THREE.Mesh(new THREE.PlaneGeometry(dw,dh),dm);d.position.set(sh.x-w/2+w*.78,.25+dh/2,z);d.__pxSkip=1;scene.add(d);});
  // buildings outside the city fade when they stand between the camera and Kip (the city has its own)
  {const cutG=new Set(typeof CBD!=='undefined'&&CBD.cut?CBD.cut.map(e=>e.g):[]);const inCut=o=>{for(let p=o;p;p=p.parent)if(cutG.has(p))return true;return false;};const seen=new Set();if(SUB)PXB_SEE.forEach(e=>seen.add(e.objs[0]));else PXB_SEE.length=0;
    walls.forEach(W=>{if(inCut(W.o))return;const par=W.o.parent;const root=par&&par!==scene&&par.children.length<=40?par:W.o;if(seen.has(root))return;seen.add(root);
      const objs=[root];if(root===W.o)roofs.forEach(R=>{RB.setFromObject(R.o);RB.getCenter(RC);if(RC.x>W.box.min.x&&RC.x<W.box.max.x&&RC.z>W.box.min.z&&RC.z<W.box.max.z&&RC.y>W.box.max.y-.5)objs.push(R.o);});
      const box=new THREE.Box3();objs.forEach(o=>box.expandByObject(o));PXB_SEE.push({objs,box,a:1,mats:null});});}
  if(rt.depthTexture&&post.uniforms.outl){post.uniforms.tDepth.value=rt.depthTexture;post.uniforms.outl.value=1;post.uniforms.nf.value.set(camera.near,camera.far);}if(!SUB)try{mapfixBuild();}catch(e){console.error(e);}if(!SUB){pxbScene.orig.forEach(r=>{r.s=pxbSig(r.m);});pxbScene.mainT=performance.now();}}
const PXB_DOORS=[],PXB_SEE=[],_pxR=new THREE.Ray(),_pxP=new THREE.Vector3(),_pxV=new THREE.Vector3();
function pxbSee(dt){if(!PXB_SEE.length||typeof player==='undefined')return;const k=Math.min(1,(dt||.016)*6);
  for(const e of PXB_SEE){const c=e.box;_pxP.set(player.x,0,player.z);scene.localToWorld(_pxP);if(_pxP.x<c.min.x-30||_pxP.x>c.max.x+30||_pxP.z<c.min.z-30||_pxP.z>c.max.z+30){if(e.a===1)continue;}
    let hit=false;for(const hy of[.4,1.1]){_pxP.set(player.x,hy,player.z);scene.localToWorld(_pxP);_pxR.origin.copy(camera.position);_pxR.direction.copy(_pxP).sub(camera.position);const L=_pxR.direction.length();_pxR.direction.normalize();
      const q=_pxR.intersectBox(c,_pxV);if(q&&camera.position.distanceTo(q)<L-.3&&!(_pxP.x>c.min.x&&_pxP.x<c.max.x&&_pxP.z>c.min.z&&_pxP.z<c.max.z)){hit=true;break;}}
    const tg=hit?.28:1;if(Math.abs(e.a-tg)<.005)continue;
    if(!e.mats){e.mats=[];const cl=m=>{const c2=m.clone();c2.userData.op0=m.opacity;c2.userData.tr0=m.transparent;c2.userData.dw0=m.depthWrite;if(PXB_GLOW.includes(m))PXB_GLOW.push(c2);e.mats.push(c2);return c2;};
      e.objs.forEach(o=>o.traverse(x=>{if(!x.isMesh||!x.material)return;x.material=Array.isArray(x.material)?x.material.map(cl):cl(x.material);}));pxbScene._k=-1;}
    e.a+=(tg-e.a)*k;if(Math.abs(e.a-tg)<.01)e.a=tg;const solid=e.a>.995;
    for(const m of e.mats){m.transparent=solid?m.userData.tr0:true;m.opacity=solid?m.userData.op0:Math.min(m.userData.op0,e.a);m.depthWrite=solid?m.userData.dw0:false;m.needsUpdate=true;}}}
function pxbDoorsTick(){const now=performance.now();if(pxbDoorsTick.t&&now-pxbDoorsTick.t<700)return;pxbDoorsTick.t=now;const vis=o=>{for(let p=o;p;p=p.parent)if(p.visible===false)return false;return true;};const W=new THREE.Vector3();for(const e of PXB_DOORS){const[d,w,p0]=e;const v=vis(w);if(d.visible!==v)d.visible=v;w.updateWorldMatrix(true,false);w.getWorldPosition(W);if(W.distanceToSquared(p0)>1e-4){const a=d.parent.worldToLocal(W.clone()),b=d.parent.worldToLocal(p0.clone());d.position.add(a.sub(b));p0.copy(W);}}}
