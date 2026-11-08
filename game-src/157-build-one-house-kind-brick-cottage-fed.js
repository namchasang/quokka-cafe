/* build one house: kind 'brick' | 'cottage' | 'fed'; (cx,cz) the old body's centre, W along x, D along z, face +1 = front looks +z.
   yard = metres from the front wall to the front fence. Returns the group (scene-local, under town3Houses.g). */
function t3House(kind,cx,cz,W,D,face,s,o){o=o||{};const G=new THREE.Group();G.position.set(cx,0,cz);G.rotation.y=face>0?0:Math.PI;G.__pxSkip=1;town3Houses.g.add(G);
  const mats=[],Hw=o.h||1.8,yard=o.yard||1.3,camSide=face>0?1:-1;// camSide: the local z side that faces the camera (south)
  const fresh=(m)=>{m.transparent=!!o.fade;mats.push(m);return m;};
  const L=(c,extra)=>fresh(new THREE.MeshLambertMaterial(Object.assign({map:t2Tex(c)},extra||{})));
  const Lit=(spec,w,h)=>{const m=t2Lit(T3H.face(w,h,spec,false),T3H.face(w,h,spec,true),{transparent:!!o.fade});mats.push(m);return m;};
  const C=c=>fresh(new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const add=(m,flat)=>{m.castShadow=!flat;m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;};
  const box=(w,h,d,mat,x,y,z)=>{const m=add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat));m.position.set(x,y,z);return m;};
  const R=T2.rnd;T2.seed(s*7+3);
  // ---- the palette for this house ----
  let base,wk,frame,door,roofCol,roofKind,rise,ov=.22;
  if(kind==='brick'){base=T3H.BRICK[s%T3H.BRICK.length];wk='brick';frame=['#f2efe6','#e8e4dc','#d8d4c8','#f6f2e8'][s%4];door=['#6b4a2e','#2c4a3a','#8a2a2a','#3a3e48','#c8a040'][s%5];roofCol=T3H.TILE[(s*3+1)%T3H.TILE.length];roofKind='tile';rise=.62;}
  else if(kind==='cottage'){base=T3H.BOARD[s%T3H.BOARD.length];wk='board';frame=['#f6f2e8','#2f5a46','#6a2a2a','#1d3a6e','#f2e6c8'][s%5];if(T2.lum(frame)<.4&&T2.lum(base)<.55)frame='#f6f2e8';door=T3H.FDOOR[(s*3)%5];roofCol=T3H.TIN[(s*5+2)%T3H.TIN.length];roofKind='tin';rise=.85;}
  else{base=T3H.FED[s%T3H.FED.length];wk='brick';frame='#f6f2e8';door=T3H.FDOOR[(s+1)%5];roofCol=['#b8562e','#a84a2a','#c8643a'][s%3];roofKind='tile';rise=.95;}
  const band=kind==='fed'?'#efe3c4':null,H=Math.round(Hw*32),Wp=Math.round(W*32),bandY=kind==='fed'?40:0;
  const sp={base,kind:wk,frame,door,seed:s*13+1,bandY:bandY||0,bandCol:band,stumps:kind==='cottage',garage:['#e8e4dc','#c8ccd0','#d8c8a8','#8a6a4a'][s%4]};
  const n=(s*7)%60+3;
  // ---- walls: front, back, two sides ----
  let front;
  if(kind==='brick')front=[{t:'win',x:.14,y:14,w:26,h:22,kind:'case',box:false},{t:'door',x:.43,w:16,h:40,n,fan:false},{t:'garage',x:.77,w:Math.min(40,Wp*.36|0),h:44},{t:'meter',x:.58,y:20,w:7}];
  else if(kind==='cottage')front=[{t:'win',x:.19,y:12,w:17,h:26,kind:'sash',box:true,shutter:s%2?null:['#2f5a46','#6a2a2a','#1d3a6e'][s%3]},{t:'door',x:.5,w:16,h:40,n},{t:'win',x:.81,y:12,w:17,h:26,kind:'sash',box:true}];
  else front=[{t:'door',x:.62,w:16,h:41,n},{t:'win',x:.87,y:12,w:14,h:24,kind:'sash',lead:true}];
  const back=[{t:'win',x:.2,y:14,w:kind==='brick'?24:16,h:22,kind:kind==='brick'?'case':'sash',lead:kind==='fed'},{t:'door',x:.5,w:kind==='brick'?28:14,h:38,fan:false,lamp:true},{t:'win',x:.8,y:16,w:14,h:14,kind:'case',lintel:false},{t:'pipe',x:.97,w:3},{t:'vent',x:.35,w:5}];
  const side=[{t:'win',x:.5,y:14,w:kind==='cottage'?16:20,h:20,kind:kind==='cottage'?'sash':'case',lead:kind==='fed'},{t:'pipe',x:.06,w:3},{t:'vent',x:.82,w:5}];
  const top=C(T2.sh(base,.6));
  const mF=Lit(Object.assign({},sp,{items:front}),W,Hw),mB=Lit(Object.assign({},sp,{items:back,seed:sp.seed+5}),W,Hw);
  const mS1=Lit(Object.assign({},sp,{items:side,seed:sp.seed+9}),D,Hw),mS2=Lit(Object.assign({},sp,{items:side.slice(1).concat([{t:'win',x:.4,y:16,w:12,h:14,kind:'case'}]),seed:sp.seed+11}),D,Hw);
  box(W,Hw,D,[mS1,mS2,top,top,mF,mB],0,Hw/2,0);
  // ---- the hip roof: tiles or corrugated sheet, gutters, ridge and hip caps ----
  const Wo=W+2*ov,Do=D+2*ov,hg=T3H.hipGeo(Wo,Do,rise);
  const rc=T2.roof(hg.L,hg.sl,{base:roofCol,kind:roofKind,ridge:false,gutter:false,seed:s%4+1,moss:roofKind==='tile'});
  const rm=L(rc,{side:THREE.DoubleSide});const roof=add(new THREE.Mesh(hg.g,rm));roof.position.y=Hw;
  const capC=C(roofKind==='tin'?T2.sh(roofCol,.82):T2.mix(roofCol,'#5a2a1e',.25)),gutC=C(kind==='cottage'?'#e8e4d8':T2.mix(frame,'#c8ccd0',.4));
  const ridgeX=!hg.sw,ra=hg.a;if(ra>.02){const r=box(ridgeX?2*ra+.08:.13,.07,ridgeX?.13:2*ra+.08,capC,0,Hw+rise+.02,0);}
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx,sz])=>{const a=new THREE.Vector3(ridgeX?sx*ra:0,rise+.02,ridgeX?0:sz*ra),b=new THREE.Vector3(sx*Wo/2,0,sz*Do/2),d=b.clone().sub(a);const len=d.length();
    const m=add(new THREE.Mesh(new THREE.BoxGeometry(.1,.06,len),capC));m.position.copy(a).add(b).multiplyScalar(.5);m.position.y+=Hw;m.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),d.normalize());});
  [[Wo,Do/2,0],[Wo,-Do/2,0],[Do,Wo/2,1],[Do,-Wo/2,1]].forEach(([l,p,r])=>{box(r?.08:l,.07,r?l:.08,gutC,r?p:0,Hw-.02,r?0:p);});
  // downpipes at two corners
  [[-1,1],[1,-1]].forEach(([sx,sz])=>box(.05,Hw,.05,gutC,sx*(W/2+.03),Hw/2,sz*(D/2-.12)));
  // a point on the roof surface (local), for things that sit on it
  const roofY=(x,z)=>{const dz=Do/2-Math.abs(z),dx=Wo/2-Math.abs(x);return Hw+Math.min(rise,Math.min(dz,dx)/hg.run*rise);};
  // ---- chimneys ----
  const chim=(x,z,w,h,b)=>{const y0=roofY(x,z)-.15;const c=box(w,h,w,L(T2.chimney(w,h,b)),x,y0+h/2,z);box(w+.08,.06,w+.08,C('#d8ccb8'),x,y0+h,z);
    [-.05,.05].forEach(d=>{const p=add(new THREE.Mesh(new THREE.CylinderGeometry(.03,.036,.12,6),C('#c8643a')));p.position.set(x+d*(w>.25?1.4:1),y0+h+.09,z);});};
  // ---- per kind ----
  if(kind==='brick'){
    // solar panels on the slope that faces the camera (2 x 3), an aircon on a side wall, a TV antenna, a brick letterbox and the driveway
    const pitch=Math.atan2(rise,hg.run),pm=L(T3H.solar());const pz=camSide;
    for(let i=0;i<3;i++)for(let j=0;j<2;j++){const t=.22+j*.36,x=-.75+i*.55,z=pz*(Do/2-(t*hg.run)),y=Hw+t*rise+.035;const p=add(new THREE.Mesh(new THREE.BoxGeometry(.5,.025,.36/Math.cos(pitch)*.95),[C('#c8ccd0'),C('#c8ccd0'),pm,C('#c8ccd0'),C('#c8ccd0'),C('#c8ccd0')]));p.position.set(x,y,z);p.rotation.x=pz*pitch;}
    const ac=box(.5,.32,.2,L(T3H.slats(.5,.32,'#e6e6e2')),W/2+.11,.45,-D*.15);box(.04,.04,.2,C('#9c9c98'),W/2+.11,.65,-D*.15);
    const an=box(.03,.7,.03,C('#8a8e94'),-W*.25,roofY(-W*.25,-.1)+.35,-.1);[.0,.12,.24].forEach(k=>box(.5-k,.02,.02,C('#8a8e94'),-W*.25,roofY(-W*.25,-.1)+.45+k,-.1));
    const gx=W/2-.62;const dw=add(new THREE.Mesh(new THREE.PlaneGeometry(1.1,yard-.05),L(T2.pave(1.1,yard,'#c8c4b8'))),true);dw.rotation.x=-Math.PI/2;dw.position.set(gx,.03,D/2+yard/2);
    box(.3,.55,.3,L(T2.chimney(.3,.55,base)),gx-.8,.28,D/2+yard-.15);box(.22,.14,.04,C('#3a3f44'),gx-.8,.42,D/2+yard+.01);
    // a porch slab and a step
    box(.8,.06,.35,C('#a89f92'),-W*.07,.03,D/2+.18);
  }else if(kind==='cottage'){
    // bullnose verandah across the front: a flat run and a curved lip in striped sheet, posts with brackets, a timber deck
    const vd=Math.min(.78,yard-.3),stp=[['#2f5a46','#f2e6c8'],['#8a2a2a','#f2e6c8'],['#1d3a6e','#f6f2e8'],['#c8ccd0','#9aa0a6'],['#3d7a78','#f4ecd8']][s%5];
    const vm=L(T2.stripes(W,vd,stp[0],stp[1])),ve=C(T2.sh(stp[0],.6));
    const v1=add(new THREE.Mesh(new THREE.BoxGeometry(W+.1,.04,vd*.62),[ve,ve,vm,ve,ve,ve]));v1.position.set(0,Hw-.22,D/2+vd*.31);v1.rotation.x=.12;
    const v2=add(new THREE.Mesh(new THREE.BoxGeometry(W+.1,.04,vd*.44),[ve,ve,vm,ve,ve,ve]));v2.position.set(0,Hw-.38,D/2+vd*.8);v2.rotation.x=.55;
    const postM=C(T2.lum(frame)>.6?'#f6f2e8':frame);const nP=W>3?4:3;for(let i=0;i<nP;i++){const dx=-W/2+.08+i*(W-.16)/(nP-1);box(.06,Hw-.42,.06,postM,dx,(Hw-.42)/2,D/2+vd-.04);
      [-1,1].forEach(sg=>{if((i===0&&sg<0)||(i===nP-1&&sg>0))return;const b=box(.16,.04,.04,postM,dx+sg*.07,Hw-.5,D/2+vd-.04);b.rotation.z=-sg*.6;});}
    box(W,.04,.05,postM,0,Hw-.44,D/2+vd-.04);
    const deck=add(new THREE.Mesh(new THREE.PlaneGeometry(W,vd),L(T2.wood(W,vd,'#8a6a4a'))),true);deck.rotation.x=-Math.PI/2;deck.position.set(0,.04,D/2+vd/2);
    [0,1].forEach(k=>box(.6,.06,.18,C(k?'#9b9184':'#b8b0a3'),0,.03+k*.04,D/2+vd+.09-k*.09));
    chim(W*.22,-D*.18,.26,.95,'#9b4f37');
    // a corrugated rainwater tank beside the back corner, on a stand
    const tx=(W/2+.38)*(s%2?1:-1),tz=-D/2+.45;const tk=add(new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.82,12),L(T2.tank(2.2,.82,['#9aa39a','#a8acb0','#3e6a52'][s%3]))));tk.position.set(tx,.47,tz);
    box(.74,.06,.74,C('#7b6a58'),tx,.04,tz);const lid=add(new THREE.Mesh(new THREE.ConeGeometry(.35,.12,12),C('#c8ccd0')));lid.position.set(tx,.94,tz);
    const path=add(new THREE.Mesh(new THREE.PlaneGeometry(.45,yard-vd-.15),L(T2.pave(.45,yard-vd,'#cfc4b0'))),true);path.rotation.x=-Math.PI/2;path.position.set(0,.032,D/2+vd+.12+(yard-vd-.15)/2);
  }else{
    // Federation bungalow: a front gable over a bay window, a skillion verandah on turned posts, two tall chimneys, finials
    const xg=-W*.24,gw=Math.min(1.55,W*.46),bd=.24,gh=.82;
    const bayItems=[{t:'win',x:.5,y:11,w:Math.round(gw*32)-14,h:26,kind:'case',lead:true,box:true}];
    const mBay=Lit(Object.assign({},sp,{items:bayItems,seed:sp.seed+21}),gw-.1,Hw);const bs=C(T2.sh(base,.85));
    box(gw-.1,Hw,bd,[bs,bs,top,top,mBay,top],xg,Hw/2,D/2+bd/2);
    const zf=D/2+bd+.06,tri=new THREE.BufferGeometry();tri.setAttribute('position',new THREE.Float32BufferAttribute([xg-gw/2,Hw-.02,zf, xg+gw/2,Hw-.02,zf, xg,Hw+gh,zf],3));tri.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));tri.computeVertexNormals();
    add(new THREE.Mesh(tri,L(T3H.halfTimber(gw,gh,'#efe3c4','#5a3a22'),{side:THREE.DoubleSide})));
    const gp=Math.atan2(gh,gw/2),gsl=Math.hypot(gw/2+.12,gh+.08),dep=bd+.75,grm=L(T2.roof(gsl,dep,{base:roofCol,kind:'tile',across:true,seed:s%3+2})),ge=C(T2.sh(roofCol,.55));
    [-1,1].forEach(sg=>{const m=add(new THREE.Mesh(new THREE.BoxGeometry(gsl,.05,dep),[ge,ge,grm,ge,ge,ge]));m.position.set(xg+sg*(gw/2+.12)/2,Hw+gh/2+.02,zf+.1-dep/2);m.rotation.z=-sg*gp;});
    box(.07,.07,dep,capC,xg,Hw+gh+.07,zf+.1-dep/2);const fin=add(new THREE.Mesh(new THREE.ConeGeometry(.05,.24,6),C('#c8643a')));fin.position.set(xg,Hw+gh+.2,zf+.08);
    // verandah: skillion in sheet, turned posts with fretwork brackets, tiled floor, a front step
    const vx0=xg+gw/2+.08,vx1=W/2+.06,vw=vx1-vx0,vd=Math.min(.75,yard-.35),vc=vx0+vw/2,tinM=L(T2.roof(vw,vd+.1,{base:['#2f5a46','#8a2a2a','#a8acb0'][s%3],kind:'tin',seed:3}));
    const vr=add(new THREE.Mesh(new THREE.BoxGeometry(vw,.04,vd+.1),[ge,ge,tinM,ge,ge,ge]));vr.position.set(vc,Hw-.2,D/2+(vd+.1)/2);vr.rotation.x=.22;
    const pc=C('#f6f2e8');[vx0+.06,vx1-.08].forEach(px=>{const p=add(new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,Hw-.32,6),pc));p.position.set(px,(Hw-.32)/2,D/2+vd);box(.1,.08,.1,pc,px,.04,D/2+vd);
      [-1,1].forEach(sg=>{if((px<vc&&sg<0)||(px>vc&&sg>0))return;const b=box(.2,.035,.035,pc,px+sg*.09,Hw-.42,D/2+vd);b.rotation.z=-sg*.55;});});
    box(vw,.07,.05,pc,vc,Hw-.34,D/2+vd);for(let x=vx0+.12;x<vx1-.1;x+=.09)box(.02,.1,.02,pc,x,Hw-.42,D/2+vd);
    const fl=add(new THREE.Mesh(new THREE.PlaneGeometry(vw,vd),L(T2.tiles(vw,vd))),true);fl.rotation.x=-Math.PI/2;fl.position.set(vc,.04,D/2+vd/2);
    box(.7,.08,.2,C('#c8bca4'),W*.12,.04,D/2+vd+.1);
    chim(-W*.18,-D*.12,.3,1.15,'#a8583e');chim(W*.3,D*.05,.3,1.05,'#a8583e');
    if(ra>.02)[-1,1].forEach(sg=>{const f=add(new THREE.Mesh(new THREE.ConeGeometry(.05,.22,6),C('#c8643a')));f.position.set(ridgeX?sg*ra:0,Hw+rise+.15,ridgeX?0:sg*ra);});
    const path=add(new THREE.Mesh(new THREE.PlaneGeometry(.45,yard-vd-.2),L(T2.pave(.45,yard-vd,'#d8b8a0'))),true);path.rotation.x=-Math.PI/2;path.position.set(W*.12,.032,D/2+vd+.2+(yard-vd-.2)/2);
  }
  // ---- porch lamp that glows at night ----
  const lamp=new THREE.Mesh(new THREE.BoxGeometry(.08,.12,.05),new THREE.MeshBasicMaterial({color:'#ffd98a'}));lamp.position.set(kind==='brick'?-W*.07-.32:kind==='cottage'?-.38:W*.12-.38,1.38,D/2+.04);lamp.__pxSkip=1;G.add(lamp);PXB_LAMPS.push(lamp);
  // ---- backyard: a rotary clothesline (where there is room behind) ----
  if(o.back>1.6){const bz=-D/2-o.back*.55,bx=(s%2?-1:1)*W*.2,pm=C('#9aa0a6');box(.04,1.3,.04,pm,bx,.65,bz);
    for(let k=0;k<4;k++){const a=k*Math.PI/2+.4,arm=add(new THREE.Mesh(new THREE.BoxGeometry(.9,.025,.025),pm));arm.position.set(bx+Math.cos(a)*.45,1.25,bz+Math.sin(a)*.45);arm.rotation.y=-a;}
    [.2,.32,.44].forEach(r=>{const ring=add(new THREE.Mesh(new THREE.TorusGeometry(r,.006,3,4),C('#e8e4dc')));ring.rotation.x=Math.PI/2;ring.rotation.z=.4+Math.PI/4;ring.position.set(bx,1.24,bz);});
    if(s%3!==1)['#e8344a','#f6f6f0','#3a8ad8'].forEach((c,k)=>{const t=add(new THREE.Mesh(new THREE.PlaneGeometry(.2,.26),new THREE.MeshLambertMaterial({color:new THREE.Color(c),side:THREE.DoubleSide})));t.position.set(bx-.25+k*.22,1.08,bz+.3);});}
  // ---- front garden: a shrub or two from the town's own (already repainted) plant sprites ----
  [[-W*.36,D/2+yard*.55,false,.55],[W*.4,D/2+yard*.6,false,.5]].forEach(([lx,lz,tall,sc],k)=>{if(kind==='brick'&&lx>0)return;t3Plant(G,lx,lz,tall,sc,s+k);});
  G.traverse(q=>{if(q.isMesh){q.__pxSkip=1;q.receiveShadow=true;}});
  return{G,mats};}
// a plant sprite copied from the nearest repainted bush/tree in town (like the gardens in the town2 gaps)
function t3Plant(G,lx,lz,tall,sc,k){G.updateMatrixWorld(true);const V=new THREE.Vector3(lx,0,lz).applyMatrix4(G.matrix).add(new THREE.Vector3());const X=V.x,Z=V.z;
  const src=t2Like(X,Z,tall,k);if(!src)return null;const p=src.geometry.parameters,ww=p.width*Math.abs(src.scale.x)*sc,hh=p.height*Math.abs(src.scale.y)*sc;const g=new THREE.PlaneGeometry(ww,hh);g.translate(0,hh/2,0);
  const m=new THREE.Mesh(g,src.material);if(src.customDepthMaterial)m.customDepthMaterial=src.customDepthMaterial;m.castShadow=true;m.receiveShadow=true;m.position.set(X,0,Z);town3Houses.g.add(m);BB.push(m);
  try{const tr=trees.find(t=>t.m===src);if(tr)trees.push(Object.assign({},tr,{x:X,z:Z,m,fade:false}));}catch(e){}return m;}
