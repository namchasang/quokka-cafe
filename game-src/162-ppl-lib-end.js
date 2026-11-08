/* PPL-LIB-END */

// ---------- Perth CBD footpaths (Paul, Nov 2026): room to walk on Wellington St, car-free Barrack and William St blocks,
// nothing left lying on the road, and a walk-in Perth Station: through the clock-tower arch, past the fare gates, onto the platform ----------
// (scene-local numbers; CW_RD moves Wellington St 1.4 m north, CW_DN moves the north side another 3.6 m north)
function cwWalk(x,z){
  if(x>622&&x<699.8&&z>-30.1&&z<=-25.5)return true;// the wide north footpath and the station forecourt
  if(x>675.88&&x<678.12&&z>-31.7&&z<=-25.5)return true;// through the clock-tower arch
  if(x>671.88&&x<678.12&&z>-44.75&&z<=-31.3)try{if(MTR.on)return true;}catch(e){}// the concourse to the platform (MTR is set up later in the file)
  return false;}
function cwBuild(moved,lbox,flat,kerbM,own){if(!CW_ON)return;scene.updateMatrixWorld(true);const DN=CW_DN,R1=-24.3+CW_RD,R2=-20.95+CW_RD,MZ=-22.65+CW_RD;
  const P=PXK.P,sh=PXK.sh,cv=PXK.cv,T=c=>ctex(c);const LM=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(c)},o||{}));const CM=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||8);const R=mulberry32(5150);
  const put=(geo,mat,x,y,z,o)=>{o=o||{};const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;m.castShadow=!o.nc;m.receiveShadow=true;m.__pxSkip=1;scene.add(m);own.add(m);return m;};
  const box1=b=>({x1:b.min.x,x2:b.max.x,y1:b.min.y,y2:b.max.y,z1:b.min.z,z2:b.max.z});
  const out=CW.log={moved:0,cols:0,junk:[],hidden:[],shifted:[]};
  // ---- 1. the north side steps back another 3.6 m (shops, the station, lamps, the towers behind); Kings Park stays put ----
  moved.forEach(o=>o.updateMatrix());scene.updateMatrixWorld(true);
  const m2=new Set();moved.forEach(o=>{const b=lbox(o);if(!b)return;const q=box1(b);if(q.x1<621.5||q.x2>702.5)return;o.position.z+=DN;m2.add(o);
    // the tower behind the station's east wing slides 2 m east to open the concourse
    if(q.x1>676.5&&q.x2<685.5&&q.y2>12&&q.z2-q.z1<6&&o.parent===scene)o.position.x+=2;});
  moved.forEach(o=>o.updateMatrix());// some city groups keep a frozen matrix
  out.moved=m2.size;
  colliders.forEach(c=>{if(c.__w4&&c.x1>=621.5&&c.x2<=702.5){c.z1+=DN;c.z2+=DN;out.cols++;}});
  if(typeof CBD!=='undefined'&&CBD.cut)CBD.cut.forEach(e=>{for(let p=e.g;p;p=p.parent)if(m2.has(p)){e.z1+=DN;e.ready=false;break;}});
  scene.updateMatrixWorld(true);
  const SF=-22.65-2.2+DN,SB=SF-3,AX1=675.6,AX2=678.4,AH=3.0,CX1=671.6,CX2=678.4;CW.sf=SF;
  // ---- 2. footpaths: concrete flags at 32 px a metre, a kerb on the road side ----
  const flagC=(base)=>{const[c,x]=cv(64,64);P(x,base,0,0,64,64);for(let Y=0;Y<64;Y+=32)for(let X=(Y/32%2)*16;X<80;X+=32){const f=.96+R()*.07;P(x,sh(base,f),X+1,Y+1,30,30);P(x,sh(base,.84),X,Y,32,1);P(x,sh(base,.88),X,Y,1,32);P(x,sh(base,1.06),X+1,Y+1,30,1);}
    for(let i=0;i<260;i++)P(x,sh(base,R()<.5?.9:1.08),R()*64|0,R()*64|0,1,1);return c;};
  const fC=flagC('#cfc8ba');const foot=(x1,z1,x2,z2,y)=>flat(x2-x1,z2-z1,(x1+x2)/2,(z1+z2)/2,new THREE.MeshLambertMaterial({map:ctex(fC,{rep:[(x2-x1)/2,(z2-z1)/2]})}),y||.029);
  const kerb=(x1,x2,z)=>{const m=put(B(x2-x1,.06,.16),[kerbM,kerbM,CM('#d8d0bc'),kerbM,kerbM,kerbM],(x1+x2)/2,.03,z,{nc:1});m.castShadow=false;return m;};
  [foot(622,-30.2,700,R1),foot(622,R2,700,-20.95)].forEach(m=>{m.__pxSkip=1;own.add(m);});
  kerb(622,700,R1-.08);kerb(622,638,R2+.08);kerb(640.2,666.1,R2+.08);kerb(668.5,700,R2+.08);
  // zebra crossings at William and Barrack streets (the median gaps)
  {const W=new THREE.MeshBasicMaterial({color:'#f2efe6'});[639.1,667.3].forEach(x=>{for(let z=R1+.15;z<R2-.1;z+=.32){if(Math.abs(z-MZ)<.3)continue;own.add(flat(1.6,.18,x,z,W,.034));}});}
  // ---- 3. Barrack St and William St become paved walks between Wellington St and St Georges Tce (cars turn off at St Georges) ----
  {const pC=flagC('#d6cdb8');const pv=(x1,z1,x2,z2)=>{const m=flat(x2-x1,z2-z1,(x1+x2)/2,(z1+z2)/2,new THREE.MeshLambertMaterial({map:ctex(pC,{rep:[(x2-x1)/2,(z2-z1)/2]})}),.042);m.__pxSkip=1;own.add(m);};
    [[637.9,640.3],[666,668.6]].forEach(([a,b])=>{pv(a,R2+.16,b,-14.6);pv(a,-12.4,b,-4.25);
      own.add(flat(b-a,2.2,(a+b)/2,-13.5,lmat(pathC,[(b-a)/2,1.1]),.042));
      // bollards at both ends
      [R2+.45,-4.6].forEach(z=>{for(let x=a+.35;x<b-.2;x+=.85){put(C(.07,.08,.78,8),CM('#2e3a48'),x,.39,z);put(C(.075,.075,.08,8),CM('#e8e4da'),x,.62,z,{nc:1});put(C(.09,.09,.04,8),CM('#2e3a48'),x,.8,z,{nc:1});col(x-.08,z-.08,x+.08,z+.08);}});});
    [[639.1,'WILLIAM ST WALK'],[667.3,'BARRACK ST WALK']].forEach(([x,n])=>{const t=makeSign([n],Math.max(64,n.length*6+10),12,'#2f5a46','#f6f2e8');put(B(.06,2.2,.06),CM('#2e3a48'),x+1.05,1.1,R2+.9);const s=put(new THREE.PlaneGeometry(1.5,.28),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}),x+1.05,2.05,R2+.9,{nc:1});s.castShadow=false;});}
  // ---- 4. nothing left on the carriageway: furniture steps onto the nearest footpath, junk goes ----
  {const skip=new Set(own);if(typeof CDET!=='undefined')(CDET.veh||[]).forEach(v=>v.g&&v.g.traverse(o=>skip.add(o)));if(typeof walkers!=='undefined')walkers.forEach(w=>{skip.add(w.m);skip.add(w.sh);});
    const vis=o=>{for(let p=o;p&&p!==scene;p=p.parent)if(p.visible===false&&!(p===(typeof CDET!=='undefined'&&CDET.g)||(p.name&&/^city/.test(p.name))))return false;return true;};const inRoad=(x,z)=>x>622&&x<700&&z>R1+.04&&z<R2-.04;
    const cand=[];scene.traverse(o=>{if(!o.isMesh||skip.has(o)||!vis(o))return;const b=lbox(o);if(!b)return;const q=box1(b);const cx=(q.x1+q.x2)/2,cz=(q.z1+q.z2)/2;
      if(!inRoad(cx,cz)||q.x2-q.x1>14||q.z2-q.z1>3.2)return;
      if(q.y2<.045&&q.y2-q.y1<.02)return;// old paint under the new asphalt
      if(q.y1>4.5)return;
      cand.push({o,q,cx,cz});});
    // the glass footbridge left hanging over the old two-lane road (it no longer reaches either footpath)
    scene.traverse(o=>{if(!o.isMesh||skip.has(o)||!o.visible)return;const b=lbox(o);if(!b)return;const q=box1(b);if(q.x1>669.7&&q.x2<672.3&&q.y1>2.5&&q.y2<4.5&&q.z1>-24.7&&q.z2<-19.7){o.visible=false;out.hidden.push('bridge');}});
    cand.forEach(({o,q,cx,cz})=>{const h=q.y2-q.y1;out.junk.push([o.geometry.type,+cx.toFixed(2),+cz.toFixed(2),+q.y1.toFixed(2),+h.toFixed(2)].join(' '));
      if(h>.3&&q.y1<.2&&q.x2-q.x1<4){const dz=cz<MZ?(R1-.5-q.z2):(R2+.5-q.z1);o.position.z+=dz;out.shifted.push(+cx.toFixed(1));
        colliders.forEach(c=>{if(c.x2>q.x1-.05&&c.x1<q.x2+.05&&c.z2>q.z1-.05&&c.z1<q.z2+.05){c.z1+=dz;c.z2+=dz;}});}
      else{o.visible=false;out.hidden.push(+cx.toFixed(1));}});
    // merged city detail (shelter roofs and posts of the old north footpath, now hovering over the lanes as long dark slabs): drop just those triangles
    {const M=new THREE.Matrix4(),IM=new THREE.Matrix4().copy(scene.matrixWorld).invert(),v=new THREE.Vector3();out.trimmed=0;
      scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||skip.has(o)||!vis(o)||o.geometry.type!=='BufferGeometry')return;const g=o.geometry;if(Array.isArray(o.material)&&g.groups.length>1)return;
        const b=lbox(o);if(!b)return;const q=box1(b);if(q.x2<622||q.x1>700||q.z2<R1||q.z1>R2||q.y2<.06)return;
        M.multiplyMatrices(IM,o.matrixWorld);const pos=g.attributes.position,idx=g.index?g.index.array:null,n=(idx?idx.length:pos.count)/3,keep=[];let drop=0;
        for(let t=0;t<n;t++){let cx=0,cy=0,cz=0;const ids=[0,1,2].map(k=>idx?idx[t*3+k]:t*3+k);for(const i of ids){v.fromBufferAttribute(pos,i).applyMatrix4(M);cx+=v.x;cy+=v.y;cz+=v.z;}cx/=3;cy/=3;cz/=3;
          if(cx>622&&cx<700&&cz>R1+.02&&cz<R2-.02&&cy>.045){drop++;continue;}keep.push(...ids);}
        if(drop){g.setIndex(keep);out.trimmed+=drop;}});}
    // colliders still sitting on the road (not the median lamps) go
    for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];const cx=(c.x1+c.x2)/2,cz=(c.z1+c.z2)/2;if(inRoad(cx,cz)&&Math.abs(cz-MZ)>.25)colliders.splice(i,1);}}
  // ---- 5. the station planters stand against the front now ----
  colliders.forEach(c=>{if(c.x2-c.x1>2.5&&c.x2-c.x1<2.7&&Math.abs(c.z2-c.z1-.7)<.02&&c.x1>665&&c.x2<689&&c.z1>SF-.2){c.z1=SF+.02;c.z2=SF+.5;}});
  scene.traverse(o=>{if(!o.isMesh||!o.geometry.parameters)return;const p=o.geometry.parameters;if(Math.abs(p.width-2.6)>.01||Math.abs(p.depth-.7)>.01||Math.abs(p.height-.45)>.01)return;const b=lbox(o);if(!b)return;const q=box1(b);if(q.x1<665||q.x2>689||q.z1<SF-.3)return;
    o.scale.z=.68;o.position.z+=(SF+.26)-(q.z1+q.z2)/2;});
  if(typeof BB!=='undefined')BB.forEach(o=>{if(!o.parent)return;const b=lbox(o);if(!b)return;const q=box1(b);const cx=(q.x1+q.x2)/2,cz=(q.z1+q.z2)/2;
    if(((cx>666.6&&cx<669.4)||(cx>684.6&&cx<687.4))&&cz>SF+.5&&cz<SF+1.5&&q.y1>.3&&q.y2<1.4)o.position.z+=(SF+.3)-cz;});// their flowers go with them
  // ---- 6. Perth Station opens up: an arch through the clock tower, a concourse with fare gates, and the platform beyond ----
  const host=typeof CBD!=='undefined'&&CBD.cut&&CBD.cut.find(e=>Math.abs(e.g.position.x-677)<.05&&Math.abs(e.g.position.z-(-24.2-2.2+DN))<.05);
  if(host){const HG=host.g;HG.updateMatrixWorld(true);host.ready=false;
    // cut a mesh's box into pieces that keep its pixel paint exactly where it was
    const split=(m,parts)=>{const g0=m.geometry,p0=g0.attributes.position,u0=g0.attributes.uv,Dp=g0.parameters.depth;const V=THREE.Vector3;
      parts.forEach(([x1,x2,y1,y2])=>{const g=new THREE.BoxGeometry(x2-x1,y2-y1,Dp),pos=g.attributes.position,uv=g.attributes.uv,ox=(x1+x2)/2,oy=(y1+y2)/2;
        for(let f=0;f<6;f++){const b=f*4,A=new V().fromBufferAttribute(p0,b),E1=new V().fromBufferAttribute(p0,b+1).sub(A),E2=new V().fromBufferAttribute(p0,b+2).sub(A),l1=E1.lengthSq(),l2=E2.lengthSq();
          const ua=[u0.getX(b),u0.getY(b)],ub=[u0.getX(b+1),u0.getY(b+1)],uc=[u0.getX(b+2),u0.getY(b+2)];
          for(let k=0;k<4;k++){const v=new V().fromBufferAttribute(pos,b+k);v.x+=ox;v.y+=oy;v.sub(A);const s=l1?v.dot(E1)/l1:0,t=l2?v.dot(E2)/l2:0;uv.setXY(b+k,ua[0]+s*(ub[0]-ua[0])+t*(uc[0]-ua[0]),ua[1]+s*(ub[1]-ua[1])+t*(uc[1]-ua[1]));}}
        uv.needsUpdate=true;const n=new THREE.Mesh(g,m.material);n.position.set(m.position.x+ox,m.position.y+oy,m.position.z);n.castShadow=m.castShadow;n.receiveShadow=true;n.__pxSkip=1;n.onBeforeRender=m.onBeforeRender;m.parent.add(n);});
      m.visible=false;};
    const sz=(m,w,h,d)=>{const p=m.geometry&&m.geometry.parameters;return m.isMesh&&p&&m.geometry.type==='BoxGeometry'&&Math.abs(p.width-w)<.02&&Math.abs(p.height-h)<.02&&Math.abs(p.depth-d)<.02;};
    const main=HG.children.find(m=>sz(m,24,4.45,3)),tower=HG.children.find(m=>sz(m,4.8,7.2,2.7));
    if(main){const mx=HG.position.x+main.position.x;split(main,[[-12,AX1-mx,-2.225,2.225],[AX2-mx,12,-2.225,2.225],[AX1-mx,AX2-mx,AH-2.225,2.225]]);}
    if(tower){const tx=HG.position.x+tower.position.x;split(tower,[[-2.4,AX1-tx,-3.6,3.6],[AX2-tx,2.4,-3.6,3.6],[AX1-tx,AX2-tx,AH-3.6,3.6]]);}
    out.split=[!!main,!!tower];
    // whatever else of the old front door sits in the opening goes
    const hb=new THREE.Box3();[HG,...scene.children.filter(o=>o!==HG&&m2.has(o))].forEach(G=>G.traverse(o=>{if(!o.isMesh||!o.visible||o===main||o===tower)return;const b=lbox(o);if(!b)return;const q=box1(b);
      if(q.x1>AX1-.02&&q.x2<AX2+.02&&q.y1<AH-.05&&q.z2>SB-.1&&q.z1<SF+.35&&q.x2-q.x1<3){o.visible=false;out.hidden.push('door '+o.geometry.type);}}));
    // the low railing along the station front goes, so the forecourt is open all the way to the doors and the arch
    {const M4=new THREE.Matrix4(),V3=new THREE.Vector3(),Z=new THREE.Matrix4().makeScale(0,0,0);let n=0;
      scene.traverse(o=>{if(!o.isMesh||own.has(o)||!o.visible)return;
        if(o.isInstancedMesh){let ch=false;for(let i=0;i<o.count;i++){o.getMatrixAt(i,M4);M4.premultiply(o.matrixWorld);V3.setFromMatrixPosition(M4);scene.worldToLocal(V3);
            if(V3.x>664.5&&V3.x<690.3&&V3.z>SF+.45&&V3.z<SF+1.7&&V3.y<1.2){o.setMatrixAt(i,Z);ch=true;n++;}}if(ch)o.instanceMatrix.needsUpdate=true;return;}
        const b=lbox(o);if(!b)return;const q=box1(b);if(q.x1>664.4&&q.x2<690.4&&q.z1>SF+.45&&q.z2<SF+1.75&&q.y1<.7&&q.y2<1.4&&q.y2-q.y1<1.3&&!(q.y2-q.y1<.02)){o.visible=false;n++;}});out.fence=n;}
    // station collider: two wings either side of the arch
    for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];if(c.x1<=665.1&&c.x2>=688.9&&c.z2>SF-.6&&c.z1<SF){colliders.splice(i,1);col(c.x1,c.z1,AX1,c.z2);col(AX2,c.z1,c.x2,c.z2);}}
    // the passage: render walls, a coffered soffit, tiles underfoot, a cream arch with a keystone and the sign
    const rend=LM(PXK.wall(3.1,AH,{base:'#efe2c0',kind:'plaster',win:0,cornice:false,plinth:true,moss:false,seed:77}));
    [AX1+.04,AX2-.04].forEach((x,k)=>put(new THREE.PlaneGeometry(SF-SB+.1,AH),rend,x,AH/2,(SF+SB)/2,{ry:k?-Math.PI/2:Math.PI/2,nc:1}));
    const soffC=(()=>{const[c,x]=cv(90,100);P(x,'#e8dcc0',0,0,90,100);for(let Y=0;Y<100;Y+=25)for(let X=0;X<90;X+=30){P(x,'#cbbd9c',X,Y,30,2);P(x,'#cbbd9c',X,Y,2,25);P(x,'#f4ead2',X+4,Y+5,22,15);}return c;})();
    put(new THREE.PlaneGeometry(AX2-AX1,SF-SB+.1),LM(soffC),(AX1+AX2)/2,AH-.01,(SF+SB)/2,{rx:Math.PI/2,nc:1});
    const tileC=(()=>{const[c,x]=cv(64,64);P(x,'#d8d2c4',0,0,64,64);for(let Y=0;Y<64;Y+=16)for(let X=0;X<64;X+=16){P(x,((X+Y)/16)%2?'#e4ded2':'#cfc7b6',X+1,Y+1,15,15);P(x,'#b8b0a0',X,Y,16,1);P(x,'#b8b0a0',X,Y,1,16);}for(let i=0;i<120;i++)P(x,R()<.5?'#c4bcac':'#ece6da',R()*64|0,R()*64|0,1,1);return c;})();
    const tile=(x1,z1,x2,z2)=>{const m=flat(x2-x1,z2-z1,(x1+x2)/2,(z1+z2)/2,new THREE.MeshLambertMaterial({map:ctex(tileC,{rep:[(x2-x1)/2,(z2-z1)/2]})}),.034);m.__pxSkip=1;own.add(m);return m;};
    tile(AX1,SB-.05,AX2,SF+.6);
    const cream=CM('#efe2c0'),cream2=CM('#d8c8a0'),ink=CM('#2a2230');
    [AX1-.08,AX2+.08].forEach(x=>put(B(.2,AH+.15,.24),cream,x,(AH+.15)/2,SF-.02));put(B(AX2-AX1+.56,.3,.26),cream,(AX1+AX2)/2,AH+.15,SF-.02);put(B(.36,.42,.3),cream2,(AX1+AX2)/2,AH+.12,SF+.01);
    {const t=makeSign(['TRAINS · PLATFORMS 1 & 2'],158,13,'#1d3a6e','#ffffff');const s=put(B(2.5,.3,.05),[ink,ink,ink,ink,new THREE.MeshBasicMaterial({map:t}),ink],(AX1+AX2)/2,AH-.3,SF+.06,{nc:1});s.castShadow=false;
      const t2=makeSign(['WELLINGTON ST · WAY OUT'],152,13,'#1d3a6e','#ffffff');const s2=put(new THREE.PlaneGeometry(2.4,.28),new THREE.MeshBasicMaterial({map:t2}),(AX1+AX2)/2,AH-.3,SB-.04,{ry:Math.PI,nc:1});s2.castShadow=false;}
    // ---- the concourse: tiles, a glass canopy on green steel, fare gates, ticket machines, lamps, signs ----
    tile(CX1,-44.25,CX2,SB-.05);
    {const gy=new THREE.MeshBasicMaterial({color:'#f2c43a'});own.add(flat(.3,SB+44.25-.1,(AX1+AX2)/2,(SB-44.25)/2,gy,.036));
      for(let x=CX1+.1;x<CX2;x+=.3)own.add(flat(.18,.3,x,-44.05,gy,.037));}
    // the second track ends at buffer stops either side of the walkway (made in mtrBuild); the yellow strip leads to the platform
    const steel=CM('#2f5a46'),steelD=CM('#24463a');const glass=new THREE.MeshLambertMaterial({color:new THREE.Color('#a8ccd8'),transparent:true,opacity:.26,depthWrite:false});
    const RZ1=SB-.4,RZ2=-42.6,RY=3.35;
    for(let z=RZ1;z>=RZ2-.01;z-=(RZ1-RZ2)/4)[CX1+.12,CX2-.12].forEach(x=>{put(B(.12,RY,.12),steel,x,RY/2,z);put(B(.24,.14,.24),steelD,x,.07,z,{nc:1});col(x-.08,z-.08,x+.08,z+.08);});
    [CX1+.12,CX2-.12].forEach(x=>put(B(.14,.18,RZ1-RZ2+.3),steel,x,RY+.06,(RZ1+RZ2)/2));
    for(let z=RZ1;z>=RZ2-.01;z-=(RZ1-RZ2)/8)put(B(CX2-CX1+.2,.1,.1),steel,(CX1+CX2)/2,RY+.18,z,{nc:1});
    {const gp=put(B(CX2-CX1+.2,.03,RZ1-RZ2+.3),glass,(CX1+CX2)/2,RY+.25,(RZ1+RZ2)/2,{nc:1});gp.castShadow=false;}
    {const fasC=(()=>{const[c,x]=cv(Math.round((CX2-CX1)*32),10);P(x,'#2f5a46',0,0,c.width,10);P(x,'#4a7a62',0,0,c.width,1);P(x,'#1e3a2e',0,9,c.width,1);for(let X=6;X<c.width;X+=24)P(x,'#f2c43a',X,4,8,2);return c;})();
      put(B(CX2-CX1+.3,.3,.08),LM(fasC),(CX1+CX2)/2,RY+.1,RZ1+.18,{nc:1});}
    // fare gates: steel cabinets with green arrows; five lanes, the middle one wide
    const GZ=-34.6;const gateC=(()=>{const[c,x]=cv(32,32);P(x,'#9aa4ac',0,0,32,32);P(x,'#c8d0d6',0,0,32,3);P(x,'#6a747c',0,29,32,3);P(x,'#1e2830',4,6,10,7);P(x,'#3ec46a',6,8,2,3);P(x,'#3ec46a',8,7,2,5);P(x,'#3ec46a',10,9,2,1);P(x,'#e8c84a',20,7,8,4);for(let X=0;X<32;X+=4)P(x,'#8a949c',X,16,2,1);return c;})();
    const gm=LM(gateC),gtop=CM('#3a4450'),flap=new THREE.MeshLambertMaterial({color:new THREE.Color('#d8ecf4'),transparent:true,opacity:.5,depthWrite:false});
    // lanes: 671.87-672.81, 673.07-674.01, 674.27-675.21, 675.47-676.11 and a wide one 676.37-677.6 in line with the arch
    [[CX1+.14,.26],[672.94,.26],[674.14,.26],[675.34,.26],[676.24,.26],[678.0,.8]].forEach(([x,w],i)=>{put(B(w,.95,1.1),[gm,gm,gtop,gtop,gm,gm],x,.475,GZ);put(B(w+.01,.04,.4),CM('#1e2830'),x,.97,GZ+.25,{nc:1});col(x-w/2-.01,GZ-.55,x+w/2+.01,GZ+.55);
      [1,-1].forEach(s=>{if((i===0&&s<0)||(i===5&&s>0))return;const f=put(B(i===4&&s>0||i===5?.5:.22,.5,.03),flap,x+s*(w/2+(i===4&&s>0||i===5?.27:.12)),.62,GZ-.1,{nc:1});f.castShadow=false;});});
    {const t=makeSign(['TRAINS · PLATFORMS 1 & 2'],158,13,'#1d3a6e','#ffffff');const s=put(B(3.6,.34,.06),[ink,ink,ink,ink,new THREE.MeshBasicMaterial({map:t}),new THREE.MeshBasicMaterial({map:makeSign(['WAY OUT · WELLINGTON ST'],152,13,'#1d3a6e','#ffffff')})],(CX1+CX2)/2,2.75,GZ+.3,{nc:1});s.castShadow=false;
      [-1.3,1.3].forEach(d=>put(B(.03,.55,.03),ink,(CX1+CX2)/2+d,3.07,GZ+.3,{nc:1}));}
    // ticket machines and a timetable board on the south side of the gates
    [[CX1+.45,GZ+1.4],[CX2-.45,GZ+1.4]].forEach(([x,z],k)=>{const tmC=(()=>{const[c,x2]=cv(16,44);P(x2,'#1d3a6e',0,0,16,44);P(x2,'#2a4a8a',0,0,16,2);P(x2,'#0e1a2e',3,6,10,8);P(x2,'#5cc6d8',4,7,8,6);P(x2,'#e8e4da',5,18,6,1);P(x2,'#e8e4da',5,21,6,1);P(x2,'#f2c43a',4,26,8,3);P(x2,'#0e1a2e',5,33,6,2);return c;})();
      put(B(.36,1.38,.5),[CM('#1d3a6e'),CM('#1d3a6e'),CM('#2a4a8a'),CM('#1d3a6e'),CM('#1d3a6e'),CM('#1d3a6e')],x,.69,z);const f=put(new THREE.PlaneGeometry(.5,1.38),LM(tmC),x+(k?-.19:.19),.69,z,{ry:k?-Math.PI/2:Math.PI/2,nc:1});col(x-.2,z-.27,x+.2,z+.27);});
    // pendant lamps under the canopy (warm at night)
    for(let z=RZ1-1.2;z>RZ2;z-=2.6){put(B(.02,.5,.02),ink,(CX1+CX2)/2,RY-.05,z,{nc:1});const l=put(B(.34,.08,.34),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),(CX1+CX2)/2,RY-.34,z,{nc:1});l.castShadow=false;PXB_LAMPS.push(l);}
    // platform end: a sign over the walkway, facing both ways
    {const t=makeSign(['PLATFORM 1 · PLATFORM 2'],152,13,'#1d3a6e','#ffffff');const t2=makeSign(['WAY OUT · WELLINGTON ST'],152,13,'#1d3a6e','#ffffff');
      const s=put(B(2.6,.3,.06),[ink,ink,ink,ink,new THREE.MeshBasicMaterial({map:t}),new THREE.MeshBasicMaterial({map:t2})],(CX1+CX2)/2,RY-.6,RZ2+.25,{nc:1});s.castShadow=false;}
    // a blade sign hanging under the verandah, in line with the arch
    {const t=makeSign(['TRAINS · PLATFORMS 1 & 2'],158,13,'#1d3a6e','#ffffff');const s=put(new THREE.PlaneGeometry(1.7,.24),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}),(AX1+AX2)/2,1.82,SF+1.62,{nc:1});s.castShadow=false;
      [-.7,.7].forEach(d=>put(B(.015,.12,.015),ink,(AX1+AX2)/2+d,1.98,SF+1.62,{nc:1}));}
    // a direction post on the forecourt
    {const x=AX2+.9,z=SF+1.0;put(B(.08,2.3,.08),ink,x,1.15,z);const t=makeSign(['TRAINS ↑'],48,12,'#1d3a6e','#ffffff');const s=put(new THREE.PlaneGeometry(.9,.24),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}),x,2.15,z,{nc:1});s.castShadow=false;col(x-.06,z-.06,x+.06,z+.06);}
    // anything else standing in the concourse (old yard bits) goes
    scene.traverse(o=>{if(!o.isMesh||own.has(o)||!o.visible)return;const b=lbox(o);if(!b)return;const q=box1(b);
      if(q.x1>CX1-.3&&q.x2<CX2+.3&&q.z1>-43.9&&q.z2<SB-.05&&q.y1<2.6&&q.y2>.06&&q.x2-q.x1<6){o.visible=false;out.hidden.push('conc '+o.geometry.type+' '+q.x1.toFixed(1)+','+q.z1.toFixed(1));}});}
  // ---- 7. the minimap draws the road where it is now ----
  try{const Rc=ZONE_DEF.cbd.rects;const r=Rc.find(a=>a[0]===622&&a[1]===-22.5);if(r){r[1]=R1;r[3]=R2;}Rc[0][1]=-30.1;}catch(e){}
  CW.done=true;}
var CW={done:false};
