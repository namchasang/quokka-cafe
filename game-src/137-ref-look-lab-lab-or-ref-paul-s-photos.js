// ---------- REF (Look Lab ?lab or ?ref, Paul's photos, Oct 2026): Perth Station's heritage front, Victoria Park's shop strip,
// a Thai garden restaurant in an old cottage, a grand old hotel, brick townhouses with balconies, red bike lanes and
// weeping peppermints in the suburbs, and more detail on Fremantle's prison and station. Names are fictional.
var REF_LIVE=true;const REF_ON=REF_LIVE||/[?&#](lab|ref)\b/.test(location.search+location.hash);
if(REF_ON)(()=>{const G=new THREE.Group();scene.add(G);
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||10);
  const put=(geo,mat,x,y,z,o)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.nc);m.receiveShadow=true;G.add(m);return m;};
  const paint=(x1,x2,z1,z2,mat,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(x2-x1,z2-z1),mat);m.rotation.x=-Math.PI/2;m.position.set((x1+x2)/2,y||.04,(z1+z2)/2);m.receiveShadow=true;G.add(m);return m;};
  const HX=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
  const SH=(hex,k)=>`rgb(${HX(hex).map(v=>Math.max(0,Math.min(255,Math.round(v*k)))).join(',')})`;
  const texM=(W,H,draw,o)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return new THREE.MeshLambertMaterial(Object.assign({map:ctex(c)},o||{}));};
  const face=(w,h,draw,o)=>texM(Math.round(w*12),Math.round(h*12),draw,o);
  const brick=(x,W,H,base,seed)=>{const r=mulberry32(seed||3);x.fillStyle='#d8c8b0';x.fillRect(0,0,W,H);for(let y=0;y<H;y+=2){const off=(y/2)%2?2:0;for(let xx=-off;xx<W;xx+=4){x.fillStyle=SH(base,.84+r()*.26);x.fillRect(xx,y,3,1);}}};
  const stone=(x,W,H,base,seed)=>{const r=mulberry32(seed||7);x.fillStyle=SH(base,1.1);x.fillRect(0,0,W,H);for(let y=0;y<H;y+=4){let xx=-(r()*6|0);while(xx<W){const bw=5+(r()*7|0);x.fillStyle=SH(base,.88+r()*.18);x.fillRect(xx+1,y+1,bw-1,3);xx+=bw;}}};
  const archWin=(x,cx,y,w,h,frame,glass)=>{x.fillStyle=frame;x.fillRect(cx-w/2-1,y,w+2,h+1);x.beginPath();x.arc(cx,y,w/2+1,Math.PI,0);x.fill();x.fillStyle=glass||'#34445a';x.fillRect(cx-w/2,y,w,h);x.beginPath();x.arc(cx,y,w/2,Math.PI,0);x.fill();
    x.fillStyle='rgba(200,230,255,.4)';x.fillRect(cx-w/2+1,y-w/4,1,h*.45);x.fillStyle=frame;x.fillRect(cx-.5,y-w/2,1,h);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(cx-w/2-1,y+h+1,w+2,1);};
  const sashWin=(x,cx,y,w,h,frame,glass)=>{x.fillStyle=frame;x.fillRect(cx-w/2-1,y-1,w+2,h+2);x.fillStyle=glass||'#34445a';x.fillRect(cx-w/2,y,w,h);x.fillStyle=frame;x.fillRect(cx-w/2,y+h/2,w,1);x.fillStyle='rgba(200,230,255,.4)';x.fillRect(cx-w/2+1,y+1,1,h*.4);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(cx-w/2-1,y+h+1,w+2,1);};
  const hideAt=(test)=>{const sx=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);const bx=new THREE.Box3(),c=new THREE.Vector3(),hid=[];
    scene.traverse(o=>{if(!(o.isMesh||o.isSprite)||o.userData.frames)return;let q=o;while(q){if(q===G)return;q=q.parent;}bx.setFromObject(o);if(bx.isEmpty())return;bx.getCenter(c);if(test(c,bx))hid.push(o);});
    hid.forEach(o=>o.visible=false);scene.scale.x=sx;scene.updateMatrixWorld(true);return hid.length;};
  const tree=(x,z,s,v)=>{if(FDET.bb&&typeof treeVariants!=='undefined'){const t=v||treeVariants[((x*7+z*3)|0)%treeVariants.length];FDET.bb(t,x,z,t.w*(s||.8),t.h*(s||.8),0,true);col(x-.15,z-.15,x+.15,z+.15);}};
  const lights=(x1,x2,y,z,droop)=>{const n=Math.round((x2-x1)/.35);for(let i=0;i<=n;i++){const t=i/n,xx=x1+(x2-x1)*t,yy=y-Math.sin(t*Math.PI*((x2-x1)/2.2|0||1))*.12*(droop||1);const b=put(new THREE.SphereGeometry(.045,6,4),new THREE.MeshBasicMaterial({color:0xfff0b0}),xx,yy,z,{nc:1});if(typeof NIGHT!=='undefined'&&NIGHT.push)try{}catch(e){}}};
  // a weeping peppermint (a pixel sprite like every plant; LOOK2 repaints it): drooping strands from a rounded crown
  const PEP=(()=>{if(typeof canopy!=='function'||typeof TREE_COLS==='undefined')return null;const r=mulberry32(808);const bl=[];for(let i=0;i<7;i++)bl.push([16+(r()-.5)*16,12+(r()-.5)*8,6+r()*4]);
    const c=canopy(32,44,bl,TREE_COLS[0],r,[14,22,4,22]);const x=c.getContext('2d');const P=['#3e5a2a','#4e6e34','#5e823e','#729648'];
    for(let k=0;k<26;k++){const sx=3+r()*26,sy=8+r()*10,len=6+r()*12;for(let t=0;t<len;t++){x.fillStyle=P[(k+t)%4];x.fillRect(sx+Math.sin(t*.3)*.6|0,sy+t|0,1,1);}}
    const t=ctex(c);const m=new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide});const d=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});return{m,d,w:3.4,h:4.4};})();
  const pep=(x,z,s)=>{if(PEP&&FDET.bb){FDET.bb(PEP,x,z,PEP.w*(s||1),PEP.h*(s||1),0,true);col(x-.15,z-.15,x+.15,z+.15);}};
  const pole=(x,z,h)=>{put(C(.06,.08,h||3.4,6),M('#8a7a62'),x,(h||3.4)/2,z);put(B(.9,.06,.06),M('#6a5a4a'),x,(h||3.4)-.25,z);};
  const wire=(x1,x2,y,z)=>{const L=x2-x1;const w=put(B(L,.015,.015),M('#2a2a2a'),(x1+x2)/2,y,z,{nc:1});};
  const LIME='#e6d6b0',CREAM='#efe3c4',TRIM='#f6f2e8';
  const HIP=(()=>{const g=new THREE.ConeGeometry(.7071,1,4);g.rotateY(Math.PI/4);g.translate(0,.5,0);return g;})();const hip=(mat,x,y,z,w,h,d)=>{const m=new THREE.Mesh(HIP,mat);m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;G.add(m);return m;};

  // ===== 1. Perth Station: the 1890s front in red brick and cream render, arched windows, a gabled centre with a clock,
  //          corner pavilions with little pediments, a long verandah over the entrance, plane trees and a bus stand =====
  {const x1=665,x2=689,z=-22.65,h=4.2,w=x2-x1;
    const fr=face(w,h,(x,W,H)=>{brick(x,W,H,'#8a3a2e',11);x.fillStyle=CREAM;x.fillRect(0,0,W,4);x.fillRect(0,H*.46,W,3);x.fillRect(0,H-6,W,6);
      for(let k=0;k<20;k++){const px=(W/20)*(k+.5);x.fillStyle=CREAM;x.fillRect(px-W/40,4,1,H-10);archWin(x,px,H*.22,5,10,CREAM,'#2e3a48');archWin(x,px,H*.62,5,12,CREAM,'#2e3a48');}
      for(let k=0;k<W;k+=6){x.fillStyle=SH(CREAM,.9);x.fillRect(k,H*.46+3,3,2);}});
    const fp=new THREE.Mesh(new THREE.PlaneGeometry(w,h),fr);fp.position.set((x1+x2)/2,h/2,z);G.add(fp);
    // centre gable with a clock, corner pavilions
    const gab=(cx,gw,gh,clock)=>{const s=new THREE.Shape();s.moveTo(-gw/2,0);s.lineTo(gw/2,0);s.lineTo(0,gh);s.closePath();const gm=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.3,bevelEnabled:false}),face(gw,gh,(x,W,H)=>{x.fillStyle=CREAM;x.fillRect(0,0,W,H);x.fillStyle=SH(CREAM,.85);x.fillRect(0,H-3,W,3);}));gm.position.set(cx,h,z-.15);gm.castShadow=true;G.add(gm);
      if(clock){const ck=new THREE.Mesh(new THREE.CircleGeometry(.32,16),texM(20,20,(x)=>{x.fillStyle='#f6f2e8';x.beginPath();x.arc(10,10,9,0,7);x.fill();x.strokeStyle='#2a2a2a';x.lineWidth=1.3;x.beginPath();x.arc(10,10,9,0,7);x.stroke();x.beginPath();x.moveTo(10,10);x.lineTo(10,4);x.moveTo(10,10);x.lineTo(14,12);x.stroke();}));ck.position.set(cx,h+gh*.4,z+.17);G.add(ck);}};
    gab(677,4.2,1.6,true);gab(x1+1.4,2.6,1.0);gab(x2-1.4,2.6,1.0);
    [x1+1.4,x2-1.4,677].forEach(px=>put(B(px===677?4.4:2.8,.25,.5),M(CREAM),px,h+.12,z-.1));
    // the verandah: a cream canopy on slim posts, the station name on its fascia
    put(B(9,.12,1.8),M('#f2ede0'),677,2.7,z+.9);for(let k=0;k<=5;k++)put(C(.05,.06,2.7,6),M('#2e3a48'),672.6+k*1.76,1.35,z+1.75);
    const nm=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.34),new THREE.MeshBasicMaterial({map:makeSign(['PERTH STATION'],72,10,'#2e3a48','#f6f2e8')}));nm.position.set(677,2.62,z+1.81);G.add(nm);
    // planters along the front
    [[668,-21.8],[686,-21.8]].forEach(([px,pz])=>{put(B(2.6,.45,.7),M('#7a4a3a'),px,.22,pz);if(typeof FHOME_PLANTS!=='undefined'&&FHOME_PLANTS.length&&FDET.bb)for(let k=0;k<3;k++)FDET.bb(FHOME_PLANTS[k%FHOME_PLANTS.length],px-.8+k*.8,pz,.9,.8,.45);col(px-1.3,pz-.35,px+1.3,pz+.35);});}

  // ===== 2. Victoria Park: a varied strip along Albany Hwy, the Thai garden restaurant, the grand old hotel =====
  if(typeof VP_SHOPS!=='undefined'){
    const findShop=id=>VP_SHOPS.find(s=>s.id===id);
    // every other shop gets its own front: parapet shapes, painted signs, glass, a dark awning on the footpath
    const WALLS=['#f2ead8','#e8dcc4','#d8d0c4','#c8c4bc','#efe3c4','#e2d6c0','#3a3e44','#5a5e64'];
    VP_SHOPS.forEach((sh,i)=>{if(sh.id==='bkk'||sh.id==='pub')return;const h=sh.id==='kmax'?4.4:3,w=5.2,z=sh.z+1.71,wall=sh.wall;
      const fr=face(w,h,(x,W,H)=>{x.fillStyle=wall;x.fillRect(0,0,W,H);for(let k=0;k<W*H/16;k++){x.fillStyle='rgba(0,0,0,.04)';x.fillRect(Math.random()*W|0,Math.random()*H|0,1,1);}
        x.fillStyle=SH(wall,.8);x.fillRect(0,0,W,3);const gy=H*.5;x.fillStyle='#24282e';x.fillRect(3,gy,W-6,H-gy-2);x.fillStyle='#3e5a6e';x.fillRect(5,gy+2,W*.58,H-gy-6);x.fillStyle='rgba(220,240,255,.4)';x.fillRect(6,gy+3,2,H*.2);
        x.fillStyle='#1a1a1a';x.fillRect(W*.7,gy+2,W*.16,H-gy-4);x.fillStyle=TRIM;x.fillRect(5+W*.29,gy+2,1,H-gy-6);
        if(i%3===0){for(let k=0;k<3;k++)sashWin(x,(W/3)*(k+.5),H*.16,6,8,TRIM);}else{x.fillStyle=sh.col;x.fillRect(4,H*.12,W-8,H*.24);x.fillStyle='#f6f2e8';x.font='bold 7px monospace';x.textAlign='center';x.fillText(sh.name.toUpperCase().slice(0,14),W/2,H*.12+H*.15);}});
      const fp=new THREE.Mesh(new THREE.PlaneGeometry(w,h),fr);fp.position.set(sh.x,h/2,z);G.add(fp);
      if(i%2===0){const pw=2.2,ph=.7;const s=new THREE.Shape();s.moveTo(-pw/2,0);s.lineTo(pw/2,0);s.lineTo(pw/2-.3,ph*.6);s.lineTo(0,ph);s.lineTo(-pw/2+.3,ph*.6);s.closePath();const pg=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false}),M(i%4?CREAM:wall));pg.position.set(sh.x,h,z-.2);pg.castShadow=true;G.add(pg);}
      else{put(B(w,.35,.25),M(SH(wall,.85).replace('rgb','rgb')),sh.x,h+.17,z-.1);}});
    // plane trees and power poles along the footpath, a bus stop
    for(let x=495;x<560;x+=8.4){tree(x,-1.25,.75);}
    for(let x=491;x<562;x+=11.2){pole(x,1.3);}for(let x=491;x<550;x+=11.2)wire(x,x+11.2,3.1,1.3);

    // the Thai garden restaurant: an old Federation cottage with a terracotta tile roof and a gable,
    // a verandah strung with fairy lights, a green palisade fence on limestone piers, potted plants and a yellow sign
    {const sh=findShop('bkk');if(sh){const n=hideAt((c,bx)=>Math.abs(c.x-sh.x)<2.7&&c.z>sh.z-1.8&&c.z<sh.z+1.9&&bx.max.y>.3);
      const cx=sh.x,cz=sh.z-.4,w=5,d=2.6,h=2.0;const wall=face(w,h,(x,W,H)=>{x.fillStyle='#ece6d8';x.fillRect(0,0,W,H);for(let y=0;y<H;y+=3){x.fillStyle='rgba(0,0,0,.05)';x.fillRect(0,y,W,1);}
          sashWin(x,W*.2,H*.3,9,12,'#2e5a3a','#e8c070');sashWin(x,W*.8,H*.3,9,12,'#2e5a3a','#e8c070');x.fillStyle='#2e5a3a';x.fillRect(W*.45,H*.28,W*.12,H*.72);x.fillStyle='#f0d890';x.fillRect(W*.46,H*.32,W*.1,H*.5);});
      const pl=M('#ece6d8');const body=new THREE.Mesh(B(w,h,d),[pl,pl,pl,pl,wall,pl]);body.position.set(cx,h/2,cz);body.castShadow=body.receiveShadow=true;G.add(body);
      const tile=texM(16,16,(x)=>{for(let y=0;y<16;y+=4){x.fillStyle='#9a4a3a';x.fillRect(0,y,16,4);x.fillStyle='#7a3428';x.fillRect(0,y+3,16,1);for(let k=0;k<16;k+=4){x.fillStyle='#b05a46';x.fillRect(k,y,2,3);}}});
      hip(tile,cx,h,cz,w+.5,1.2,d+.5);
      const gs=new THREE.Shape();gs.moveTo(-.9,0);gs.lineTo(.9,0);gs.lineTo(0,1.0);gs.closePath();const gm=new THREE.Mesh(new THREE.ExtrudeGeometry(gs,{depth:1.3,bevelEnabled:false}),tile);gm.position.set(cx-1.2,h,cz+.3);G.add(gm);
      const gf=new THREE.Mesh(new THREE.ShapeGeometry(gs),M('#e6dcc4'));gf.position.set(cx-1.2,h,cz+1.61);G.add(gf);for(let k=0;k<5;k++)put(B(.04,.8,.02),M('#2e5a3a'),cx-1.6+k*.2,h+.35,cz+1.62,{nc:1});
      // verandah with posts and lights
      put(B(w+.2,.08,1.1),M('#7a3428'),cx,h-.05,cz+d/2+.5,{rx:.12});for(let k=0;k<=3;k++)put(C(.05,.05,h-.1,6),M('#2e5a3a'),cx-w/2+.15+k*(w-.3)/3,(h-.1)/2,cz+d/2+1);
      lights(cx-w/2,cx+w/2,h-.18,cz+d/2+1.02,1);
      // fence on limestone piers with a gate, pots, the yellow sign
      const fz=sh.z+1.6;[cx-2.5,cx-.6,cx+.6,cx+2.5].forEach(px=>{put(B(.32,.9,.32),M(LIME),px,.45,fz);put(B(.38,.08,.38),M('#f0e6c8'),px,.94,fz);});
      [[cx-2.35,cx-.75],[cx+.75,cx+2.35]].forEach(([a,b])=>{for(let px=a;px<=b;px+=.14){put(B(.03,.75,.03),M('#3e6a4a'),px,.42,fz,{nc:1});}put(B(b-a,.04,.04),M('#3e6a4a'),(a+b)/2,.72,fz,{nc:1});put(B(b-a,.04,.04),M('#3e6a4a'),(a+b)/2,.15,fz,{nc:1});});
      const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.9),texM(30,18,(x)=>{x.fillStyle='#e8e050';x.fillRect(0,0,30,18);x.fillStyle='#2e6a2a';x.font='bold 6px monospace';x.textAlign='center';x.fillText('SIAM',15,7);x.fillText('SMILE',15,14);x.fillStyle='#4a8a3a';x.fillRect(22,2,4,3);x.fillRect(24,1,2,2);}));sg.position.set(cx+1.6,1.3,cz+d/2+.01);G.add(sg);
      if(typeof FHOME_PLANTS!=='undefined'&&FHOME_PLANTS.length&&FDET.bb){[[cx-1.8,fz-.5],[cx-1.0,fz-.6],[cx+1.2,fz-.5],[cx+2.0,fz-.6],[cx-2.2,cz+1.6]].forEach(([px,pz],k)=>{put(C(.16,.12,.3,8),M('#5a4a3a'),px,.15,pz);FDET.bb(FHOME_PLANTS[k%FHOME_PLANTS.length],px,pz,.8,.9,.3);});}
      paint(cx-2.5,cx+2.5,cz+d/2,fz,tile.map?M('#c8b898'):M('#c8b898'),.045);tree(cx+2.9,fz+.4,.7);}}

    // the grand old hotel: two storeys painted grey-green with white trim, a row of round arches and a balcony,
    // an octagonal corner tower with a dome, little Dutch gables, umbrellas over the beer garden, steps up from the footpath
    {const sh=findShop('pub');if(sh){hideAt((c,bx)=>Math.abs(c.x-sh.x)<2.7&&c.z>sh.z-1.8&&c.z<sh.z+1.95&&bx.max.y>.3);
      const cx=sh.x,cz=sh.z,w=5.2,d=3.4,h=4.4,hc='#7e8a84',wh='#f2f2ea';
      const fr=face(w,h,(x,W,H)=>{x.fillStyle=hc;x.fillRect(0,0,W,H);x.fillStyle=SH(hc,.82);x.fillRect(0,H-8,W,8);x.fillStyle=wh;x.fillRect(0,H*.5,W,2);x.fillRect(0,2,W,3);x.fillRect(0,H*.08,W,1);
        for(let k=0;k<4;k++){const px=(W/4)*(k+.5);x.fillStyle=wh;x.beginPath();x.arc(px,H*.2,6,Math.PI,0);x.fill();x.fillRect(px-6,H*.2,12,H*.26);x.fillStyle=SH(hc,.6);x.beginPath();x.arc(px,H*.2,5,Math.PI,0);x.fill();x.fillRect(px-5,H*.2,10,H*.24);
          x.fillStyle=wh;for(let b=-4;b<=4;b+=2)x.fillRect(px+b,H*.38,1,H*.07);x.fillRect(px-5,H*.37,10,1);x.fillRect(px-5,H*.45,10,1);
          x.fillStyle=wh;x.beginPath();x.arc(px,H*.62,5.5,Math.PI,0);x.fill();x.fillRect(px-5.5,H*.62,11,H*.3);x.fillStyle='#2a3036';x.beginPath();x.arc(px,H*.62,4.5,Math.PI,0);x.fill();x.fillRect(px-4.5,H*.62,9,H*.3);}
        x.fillStyle=wh;x.font='bold 6px monospace';x.textAlign='center';x.fillText('THE WATTLE & SWAN HOTEL',W/2,H*.54);});
      const sd=M(hc);const hb=new THREE.Mesh(B(w,h,d),[sd,sd,M('#a8acb0'),sd,fr,sd]);hb.position.set(cx,h/2,cz);hb.castShadow=hb.receiveShadow=true;G.add(hb);
      put(B(w+.1,.3,.25),M(wh),cx,h+.15,cz+d/2-.1);for(let k=0;k<8;k++)put(B(.1,.3,.1),M(wh),cx-w/2+.3+k*.66,h+.45,cz+d/2-.1);
      [cx-1.6].forEach(gx=>{const s=new THREE.Shape();s.moveTo(-.6,0);s.lineTo(.6,0);s.lineTo(.6,.4);s.quadraticCurveTo(.3,.5,.25,.85);s.lineTo(-.25,.85);s.quadraticCurveTo(-.3,.5,-.6,.4);s.closePath();const g=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false}),M(hc));g.position.set(gx,h,cz+d/2-.25);G.add(g);});
      const tx=cx+w/2-.5,tz=cz+d/2-.5;put(C(.62,.62,h+1.4,8),texM(48,44,(x,W,H)=>{x.fillStyle=hc;x.fillRect(0,0,W,H);x.fillStyle=wh;x.fillRect(0,H*.36,W,2);x.fillRect(0,H*.12,W,2);for(let k=0;k<8;k+=2){archWin(x,(W/8)*(k+.5),H*.2,3,5,wh,'#2a3036');archWin(x,(W/8)*(k+.5),H*.55,3,8,wh,'#2a3036');}}),tx,(h+1.4)/2,tz);
      put(C(.7,.7,.14,8),M(wh),tx,h+1.47,tz);put(new THREE.SphereGeometry(.62,12,8,0,Math.PI*2,0,Math.PI/2),M('#d8dcd8'),tx,h+1.54,tz);put(C(.03,.03,.4,6),M(wh),tx,h+2.3,tz);
      // terrace in front: a low dark wall with white-capped piers, hedges, umbrellas, steps
      const tz2=cz+d/2+.9;put(B(w,.4,.12),M('#4a4e50'),cx,.2,tz2+.55);for(let k=0;k<=3;k++){put(B(.28,.55,.28),M('#4a4e50'),cx-w/2+k*w/3,.27,tz2+.55);put(B(.32,.08,.32),M(wh),cx-w/2+k*w/3,.58,tz2+.55);}
      for(let k=0;k<3;k++){const ux=cx-1.6+k*1.6;put(C(.03,.03,1.7,6),M('#e8e8e4'),ux,.85,tz2,{nc:1});put(new THREE.ConeGeometry(.75,.28,8),M('#ecebe4'),ux,1.75,tz2);}
      for(let s=0;s<3;s++)put(B(1,.08,.2),M('#5a5e60'),cx-.4,.04+s*.08,tz2+.8-s*.18);
      if(typeof FHOME_PLANTS!=='undefined'&&FHOME_PLANTS.length&&FDET.bb)for(let k=0;k<6;k++)FDET.bb(FHOME_PLANTS[k%FHOME_PLANTS.length],cx-2.3+k*.9,tz2+.4,.7,.55,.4);
      col(cx-w/2,tz2+.45,cx-.9,tz2+.65);col(cx+.1,tz2+.45,cx+w/2,tz2+.65);}}}

  // ===== 3. brick townhouses with balconies on Teddington Rd, east of the car yard =====
  if(typeof VPB!=='undefined'&&VPB.z2>20){const x1=553,x2=561.6,z=21.4,h=3.3,d=2.6,w=x2-x1,cx=(x1+x2)/2;
    const fr=face(w,h,(x,W,H)=>{brick(x,W,H,'#b0583c',21);x.fillStyle=CREAM;x.fillRect(0,H*.33,W,2);x.fillRect(0,H*.66,W,2);
      for(let f=0;f<3;f++)for(let k=0;k<4;k++){const px=(W/4)*(k+.5),py=H*(f/3)+5;x.fillStyle='#2e3a40';x.fillRect(px-6,py,12,H/3-8);x.fillStyle='#3e5a3e';x.fillRect(px-6,py,1,H/3-8);x.fillRect(px+5,py,1,H/3-8);x.fillRect(px-1,py,1,H/3-8);x.fillStyle='rgba(220,240,255,.3)';x.fillRect(px-5,py+1,2,6);}});
    const pl=M('#b0583c');const b=new THREE.Mesh(B(w,h,d),[pl,pl,pl,pl,new THREE.MeshLambertMaterial({map:fr.map}),pl]);b.position.set(cx,h/2,z);b.castShadow=b.receiveShadow=true;G.add(b);
    hip(M('#6a6e72'),cx,h,z,w+.4,1.1,d+.4);put(B(.45,.7,.45),M('#b0583c'),cx,h+.75,z);
    for(let f=1;f<3;f++){put(B(w,.08,.6),M('#c8a888'),cx,h*f/3,z+d/2+.3);for(let px=x1+.05;px<=x2;px+=.12)put(B(.025,.4,.025),M('#2e4a3a'),px,h*f/3+.24,z+d/2+.58,{nc:1});put(B(w,.04,.04),M('#2e4a3a'),cx,h*f/3+.44,z+d/2+.58,{nc:1});}
    for(let k=0;k<=3;k++)put(B(.12,h,.12),M('#2e4a3a'),x1+.06+k*(w-.12)/3,h/2,z+d/2+.58);
    // brick front wall with piers, a green gate, and a stripy awning on the top floor
    const fz=z+d/2+1.3;for(let px=x1;px<=x2+.01;px+=w/5){put(B(.34,.9,.34),M('#b86440'),px,.45,fz);put(B(.38,.06,.38),M(CREAM),px,.92,fz);}put(B(w,.55,.2),M('#b86440'),cx,.28,fz);put(B(1.2,.7,.06),M('#2e5a4a'),cx,.4,fz+.05);
    const aw=texM(16,8,(x)=>{for(let i=0;i<16;i+=2){x.fillStyle=i%4?'#3e6a3e':'#e8dca8';x.fillRect(i,0,2,8);}});put(B(w*.45,.06,.7),aw,x1+w*.75,h*.62,z+d/2+.35,{rx:-.3});
    col(x1,z-d/2,x2,z+d/2+.6);col(x1,fz-.2,cx-.6,fz+.2);col(cx+.6,fz-.2,x2,fz+.2);}

  // ===== 4. suburbs: red bike lanes with a double white line, weeping peppermints and power poles =====
  if(typeof FHOMES_ON!=='undefined'&&FHOMES_ON){[[270,356,41.35]].forEach(([a,b,z])=>{paint(a,b,z-.3,z+.32,M('#9a4a38'),.045);paint(a,b,z-.36,z-.32,M('#f6f6f0'),.047);paint(a,b,z-.42,z-.38,M('#f6f6f0'),.047);
      for(let x=a+4;x<b;x+=14){const bk=new THREE.Mesh(new THREE.PlaneGeometry(.5,.3),new THREE.MeshBasicMaterial({map:texM(16,8,(g)=>{g.strokeStyle='#f6f6f0';g.lineWidth=1;g.beginPath();g.arc(4,5,2.5,0,7);g.arc(12,5,2.5,0,7);g.moveTo(4,5);g.lineTo(8,2);g.lineTo(12,5);g.stroke();},{transparent:true}).map,transparent:true}));bk.rotation.x=-Math.PI/2;bk.position.set(x,.048,z);G.add(bk);}});
    for(let x=273;x<355;x+=7.5){if(Math.abs(x-304)<2||Math.abs(x-320)<2||Math.abs(x-336.2)<2)continue;pep(x+1.6,42.0,.95);}
    for(let x=272;x<356;x+=12){pole(x,25.2,3.6);}for(let x=272;x<344;x+=12)wire(x,x+12,3.3,25.2);}
  if(typeof VPB!=='undefined'&&VPB.z2>20){paint(488,562,14.9,15.5,M('#9a4a38'),.045);paint(488,562,15.42,15.46,M('#f6f6f0'),.047);paint(488,562,15.36,15.40,M('#f6f6f0'),.047);for(let x=491;x<560;x+=9)pep(x,26.6,.9);}

  // ===== 5. Fremantle: the prison's cell blocks behind the gatehouse, and the station's arched front =====
  if(typeof FREO5_ON!=='undefined'&&FREO5_ON){const tin=texM(16,16,(x)=>{for(let i=0;i<16;i+=2){x.fillStyle=i%4?'#a8acb0':'#8e9296';x.fillRect(i,0,2,16);}});
    [[322.6,327.2,15.6,20.6]].forEach(([a,b,c,d])=>{const gs=new THREE.Shape();gs.moveTo(-(d-c)/2-.1,0);gs.lineTo((d-c)/2+.1,0);gs.lineTo(0,1.1);gs.closePath();const rg=new THREE.ExtrudeGeometry(gs,{depth:b-a,bevelEnabled:false});const r=new THREE.Mesh(rg,tin);r.rotation.y=Math.PI/2;r.position.set(a,3.0,(c+d)/2);r.castShadow=true;G.add(r);
      const wl=face(b-a,1,(x,W,H)=>{stone(x,W,H,LIME,81);for(let k=0;k<8;k++){x.fillStyle='#2a2a2a';x.fillRect((W/8)*(k+.5)-1,3,2,6);}});const cb=new THREE.Mesh(new THREE.PlaneGeometry(b-a,1),wl);cb.position.set((a+b)/2,3.5,c-.01);cb.rotation.y=Math.PI;G.add(cb);});
    const x0=297.5,z0=-11.6,W=9,D=2.6,h=2.8;const fr=face(W,h,(x,Wp,Hp)=>{brick(x,Wp,Hp,'#8a3a2e',91);x.fillStyle=CREAM;x.fillRect(0,0,Wp,3);x.fillRect(0,Hp-5,Wp,5);for(let k=0;k<7;k++)archWin(x,(Wp/7)*(k+.5),Hp*.35,7,Hp*.4,CREAM,'#2e3a48');});
    const fp=new THREE.Mesh(new THREE.PlaneGeometry(W,h),fr);fp.position.set(x0,h/2,z0+D/2+.02);G.add(fp);
    const s=new THREE.Shape();s.moveTo(-1.4,0);s.lineTo(1.4,0);s.lineTo(0,.9);s.closePath();const gp=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.3,bevelEnabled:false}),M(CREAM));gp.position.set(x0,h,z0+D/2-.25);G.add(gp);}
})();
