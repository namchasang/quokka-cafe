// ===== 5. landmarks in miniature (towns keep their gates; the old blocks are hidden) =====
const T={};TOWNS.forEach(t=>T[t.id]=t);
const hideOld=t=>{t.g.children.forEach(c=>{if(c!==t.rg)c.visible=false;});};
const add=(g,geo,mat,x,y,z,ry)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;m.castShadow=m.receiveShadow=true;g.add(m);return m;};
const flat=c=>{const k='f'+c;return O[k]||(O[k]=new THREE.MeshLambertMaterial({color:lin(c)}));};
// a building block: sides with a painted facade (lit windows at dusk), a flat or gabled roof
function blockB(g,x,z,w,d,h,o){const W=Math.max(8,Math.round(w*16)),Hh=Math.max(8,Math.round(h*16)),D=Math.max(8,Math.round(d*16));
  const fa=mkc(W,Hh),fg=mkc(W,Hh),sa=mkc(D,Hh),sg=mkc(D,Hh);[fg,sg].forEach(c=>PP(c.getContext('2d'),'#000',0,0,c.width,c.height));
  face(fa.getContext('2d'),fg.getContext('2d'),0,0,W,Hh,Object.assign({},o,{door:o.door!==false}));face(sa.getContext('2d'),sg.getContext('2d'),0,0,D,Hh,Object.assign({},o,{door:false,awn:null,seed:(o.seed||1)+5}));
  const mf=litMat(fa,fg),ms=litMat(sa,sg),top=flat(o.top||'#8a8680');
  const m=add(g,new THREE.BoxGeometry(w,h,d),[ms,ms,top,top,mf,mf],x,h/2,z,o.ry||0);
  if(o.gable){const rh=o.gable,rg=gableGeo(w+.3,d+.3,rh),rm=new THREE.MeshLambertMaterial({map:TX(o.tin?tinC():tileC(o.roofCol||'#b8562e'),true),color:0xffffff});const r=add(g,rg,rm,x,h,z,o.ry||0);}
  if(o.parapet){add(g,new THREE.BoxGeometry(w+.12,.22,d+.12),flat(PXK.sh(o.base,1.08)),x,h+.11,z,o.ry||0);}
  return m;}
const tileC=(c)=>{const cc=mkc(32,32),x=cc.getContext('2d');PP(x,PXK.sh(c,.55),0,0,32,32);for(let y=0,k=0;y<32;y+=4,k++)for(let X=-(k%2)*3;X<32;X+=6){PP(x,PXK.sh(c,.92+HSH(X,y)*.14),X,y,6,3);PP(x,PXK.sh(c,1.15),X+1,y,4,1);}return cc;};
const tinC=()=>{const cc=mkc(32,32),x=cc.getContext('2d');for(let X=0;X<32;X+=2)PP(x,X%4?'#a8acb0':'#c8ccd0',X,0,2,32);PP(x,'#8a8e94',0,0,32,1);return cc;};
function gableGeo(w,d,h){const v=[-w/2,0,d/2, w/2,0,d/2, w/2,h,0, -w/2,h,0,  w/2,0,-d/2, -w/2,0,-d/2, -w/2,h,0, w/2,h,0,  -w/2,0,-d/2,-w/2,0,d/2,-w/2,h,0,  w/2,0,d/2,w/2,0,-d/2,w/2,h,0];
  const s=Math.hypot(d/2,h)/2,uv=[0,0,w/2,0,w/2,s,0,s, 0,0,w/2,0,w/2,s,0,s, 0,0,d/2,0,d/4,h/2, 0,0,d/2,0,d/4,h/2];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,11,12,13]);g.computeVertexNormals();return g;}
// tower facades: a grid of windows, floors light up at dusk
function towerTex(w,h,o){const W=Math.max(8,Math.round(w*12)),Hh=Math.round(h*12),c=mkc(W,Hh),gc=mkc(W,Hh),x=c.getContext('2d'),g=gc.getContext('2d'),r=rng(o.seed||3);PP(g,'#000',0,0,W,Hh);
  const sp=o.sp||'#c8ccd0',gl=o.gl||['#9ec4dc','#6a96b8','#4a7096'];PP(x,sp,0,0,W,Hh);
  for(let y=4;y<Hh-2;y+=4){const floorLit=r()<.55;for(let X=1;X<W-1;X+=o.punch?3:2){const ww=o.punch?2:1;const t=(y/Hh+X/W*.3)%1;PP(x,gl[t<.3?0:t<.7?1:2],X,y,ww,3);if(!o.punch&&X%6===1)PP(x,PXK.sh(sp,.8),X,y,1,3);
      if(floorLit&&r()<.75){PP(g,r()<.5?'#ffd070':'#ffe8a8',X,y,ww,3);}}PP(x,PXK.sh(sp,.72),0,y+3,W,1);}
  PP(x,PXK.sh(sp,.6),0,0,W,3);PP(x,PXK.sh(sp,1.12),0,0,W,1);for(let X=0;X<W;X+=4)PP(x,'#e8f4fc',X+((X*7)%3),Hh*.3+((X*13)%(Hh*.4))|0,1,2);
  return[c,gc];}
function tower(g,x,z,w,d,h,o){const[a,ag]=towerTex(w,h,o),[b,bg]=towerTex(d,h,Object.assign({},o,{seed:(o.seed||3)+9}));const mf=litMat(a,ag),ms=litMat(b,bg),top=flat('#7a7e86');
  add(g,new THREE.BoxGeometry(w,h,d),[ms,ms,top,top,mf,mf],x,h/2,z);add(g,new THREE.BoxGeometry(w*.5,.6,d*.5),flat('#9aa0a6'),x,h+.3,z);
  if(o.crown)add(g,new THREE.ConeGeometry(Math.min(w,d)*.55,o.crown,4),flat(o.crownC||'#b8c4cc'),x,h+o.crown/2,z,Math.PI/4);
  if(o.mast)add(g,new THREE.CylinderGeometry(.05,.08,o.mast,5),flat('#d8dce0'),x,h+o.mast/2,z);
  const L=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.18),new THREE.MeshBasicMaterial({color:0xd8323a}));L.position.set(x,h+(o.crown||o.mast||.6)+.1,z);g.add(L);(O.beacons||(O.beacons=[])).push(L);}
const gpos=t=>[t.g.position.x,t.g.position.z];
// --- Perth CBD: towers at their real spots (fictional names), glass curtain walls with mullions, podiums, stepped crowns, rooftop plant; the bell tower and the quay; heritage sandstone; Kings Park's edge ---
function cwTex(w,h,o){const W=Math.max(8,Math.round(w*16)),Hh=Math.max(8,Math.round(h*16)),c=mkc(W,Hh),gc=mkc(W,Hh),x=c.getContext('2d'),g=gc.getContext('2d'),r=rng(o.seed||3);PP(g,'#000',0,0,W,Hh);
  const fh=o.fh||5,gl=o.gl||['#b4d4e6','#8ab4cc','#5e8aaa','#3e6688'],mu=o.mu||'#d8dee4',sp=o.sp||'#5a6470',stone=o.stone;
  if(stone){PP(x,stone,0,0,W,Hh);for(let i=0;i<W*Hh/12;i++)PP(x,shc(stone,r()<.5?.94:1.05),r()*W,r()*Hh);}
  for(let y=0,fl=0;y<Hh;y+=fh,fl++){const plant=o.plant&&fl%o.plant===o.plant-1,lit=r()<.5;
    if(plant){PP(x,'#7a8088',0,y,W,fh);for(let X=0;X<W;X+=2)PP(x,'#5a6068',X,y+1,1,fh-2);continue;}
    if(stone){for(let X=1;X<W-1;X+=3){PP(x,'#2a2230',X,y+1,2,fh-2);PP(x,gl[(fl+X)%2?1:2],X,y+1,2,fh-3);if(lit&&r()<.7)PP(g,r()<.5?'#ffd070':'#ffe6a0',X,y+1,2,fh-3);}PP(x,shc(stone,.8),0,y+fh-1,W,1);continue;}
    for(let X=0;X<W;X++){const t=(y/Hh)*.8+((X+y*.6)%23)/23*.35;const k=t<.35?0:t<.6?1:t<.85?2:3;PP(x,gl[Math.min(3,k)],X,y,1,fh-1);}
    PP(x,sp,0,y+fh-1,W,1);for(let X=0;X<W;X+=(o.mw||4))PP(x,mu,X,y,1,fh-1);
    if(lit)for(let X=1;X<W;X+=(o.mw||4))if(r()<.8)PP(g,r()<.5?'#ffd070':'#ffe6a0',X,y,(o.mw||4)-1,fh-1);}
  // sky glints and dark corners
  for(let k=0;k<Hh*.4;k++){const X=(k*3)%W,Y=(Hh*.15+k*2.3)%Hh|0;PP(x,'rgba(240,250,255,.55)',X,Y,1,1);}PP(x,shc(o.edge||sp,.8),0,0,1,Hh);PP(x,shc(o.edge||sp,.7),W-1,0,1,Hh);
  return[c,gc];}
function shopTex(w,h,seed){const W=Math.max(8,Math.round(w*16)),Hh=Math.max(8,Math.round(h*16)),c=mkc(W,Hh),gc=mkc(W,Hh),x=c.getContext('2d'),g=gc.getContext('2d'),r=rng(seed);PP(g,'#000',0,0,W,Hh);
  PP(x,'#c8c0b0',0,0,W,Hh);PP(x,'#e8e2d4',0,0,W,2);const AW=['#c8344a','#2f6a74','#e8b860','#3e7d5c','#1d3a6e','#e86a1a'];
  for(let X=1;X<W-6;X+=8){const sw=7;PP(x,'#2a2230',X,Hh-12,sw,11);PP(x,'#8ab4cc',X+1,Hh-11,sw-2,5);PP(x,'#5e8aaa',X+1,Hh-6,sw-2,5);PP(x,['#e05a6a','#f4d04a','#7ab454'][r()*3|0],X+2,Hh-5,2,2);PP(g,'#ffc860',X+1,Hh-11,sw-2,10);
    const a=AW[r()*AW.length|0];for(let k=0;k<sw;k++)PP(x,k%2?a:'#f4f2ec',X+k,Hh-14,1,2);PP(x,'#2a2230',X,Hh-12,sw,1);}
  for(let X=2;X<W-2;X+=5){PP(x,'#2a2230',X,3,3,Hh-19>3?Hh-19:3);PP(x,'#8ab4cc',X,3,3,Math.max(2,Hh-20));if(r()<.5)PP(g,'#ffd070',X,3,3,Math.max(2,Hh-20));}
  PP(x,'#6a6460',0,Hh-1,W,1);return[c,gc];}
const DET=new THREE.Group();DET.userData.L='build';O.cbdDet=DET;
function boxT(g,x,y,z,w,h,d,f,s,top,ry){const m=add(g,new THREE.BoxGeometry(w,h,d),[s,s,top,top,f,f],x,y+h/2,z,ry||0);return m;}
function tower2(g,x,z,o){const w=o.w,d=o.d||o.w,h=o.h,ry=o.ry||0,tp=flat(o.roof||'#6a6e76');let y=0;
  // podium with shopfronts and awnings
  if(o.pod!==false){const pw=w+1.1,pd=d+1.1,ph=1.3,[a,ag]=shopTex(pw,ph,(o.seed||1)*7),[b,bg]=shopTex(pd,ph,(o.seed||1)*7+3);boxT(g,x,0,z,pw,ph,pd,litMat(a,ag),litMat(b,bg),flat('#8a8680'),ry);
    add(DET,new THREE.BoxGeometry(pw+.3,.08,pd+.3),flat('#3a3e48'),x,ph-.25,z,ry);y=ph;}
  const tiers=o.tiers||[[1,1,1]];// [height share, width scale, depth scale]
  tiers.forEach(([hs,ws,ds],i)=>{const tw=w*ws,td=d*ds,th=h*hs;
    if(o.shape==='oct'){const[a,ag]=cwTex(tw*3.2,th,Object.assign({},o,{seed:(o.seed||1)+i}));add(g,new THREE.CylinderGeometry(tw*.55,tw*.55,th,8),litMat(a,ag),x,y+th/2,z,Math.PI/8);}
    else{const[a,ag]=cwTex(tw,th,Object.assign({},o,{seed:(o.seed||1)+i})),[b,bg]=cwTex(td,th,Object.assign({},o,{seed:(o.seed||1)+i+20}));boxT(g,x,y,z,tw,th,td,litMat(a,ag),litMat(b,bg),tp,ry);
      // corner fins and a cap band (detail, near the car only)
      if(!o.stone)[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([p,q])=>{const v=new THREE.Vector3(p*tw/2,0,q*td/2).applyAxisAngle(new THREE.Vector3(0,1,0),ry);add(DET,new THREE.BoxGeometry(.12,th,.12),flat(o.fin||'#e4e8ec'),x+v.x,y+th/2,z+v.z,ry);});
      add(DET,new THREE.BoxGeometry(tw+.1,.18,td+.1),flat(o.cap||'#d8dce0'),x,y+th-.09,z,ry);}
    y+=th;});
  // the crown: slanted, pyramid or flat with plant and a mast
  const cw2=w*(tiers[tiers.length-1][1]),cd2=d*(tiers[tiers.length-1][2]);
  if(o.crown==='slant'){const m=add(g,new THREE.CylinderGeometry(0,Math.max(cw2,cd2)*.72,o.ch||3,4,1),flat(o.crownC||'#c8d0d8'),x,y+(o.ch||3)/2,z,Math.PI/4+ry);m.scale.set(1,1,cd2/Math.max(cw2,cd2));}
  else if(o.crown==='pyr')add(g,new THREE.ConeGeometry(Math.max(cw2,cd2)*.72,o.ch||2.4,4),flat(o.crownC||'#b89060'),x,y+(o.ch||2.4)/2,z,Math.PI/4+ry);
  else if(o.crown==='frame'){[-1,1].forEach(s=>add(g,new THREE.BoxGeometry(.18,2.2,cd2),flat('#e4e8ec'),x+s*cw2*.42,y+1.1,z,ry));add(g,new THREE.BoxGeometry(cw2,.18,cd2),flat('#e4e8ec'),x,y+2.2,z,ry);}
  else{for(let k=0;k<3;k++)add(DET,new THREE.BoxGeometry(cw2*(.2+HSH(k,o.seed||1)*.25),.5,cd2*.25),flat('#8a9098'),x+(k-1)*cw2*.28,y+.25,z+(HSH(o.seed||1,k)-.5)*cd2*.4,ry);}
  if(o.mast){add(g,new THREE.CylinderGeometry(.05,.1,o.mast,5),flat('#e8ecf0'),x,y+(o.crown?o.ch||2.4:0)+o.mast/2,z);}
  const L=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2),new THREE.MeshBasicMaterial({color:0xd8323a}));L.position.set(x,y+(o.crown?(o.ch||2.4):.5)+(o.mast||0)+.1,z);g.add(L);(O.beacons||(O.beacons=[])).push(L);
  return y;}
if(T.cbd){const t=T.cbd,g0=t.g;hideOld(t);const[gx,gz]=gpos(t);
  // owroads2 (Paul, Nov 2026): at the half-size map the CBD was spread over twice its real area (towers on roads, the quay in the river);
  // now everything sits on its real spot at half size (a scaled sub-group), as in the earlier version Paul liked
  const KS=OWR2?.5:1,g=KS===1?g0:new THREE.Group();if(g!==g0){g.scale.setScalar(KS);g.userData.owKeep=1;g0.add(g);}
  const L=(lo,la)=>{const p=G(lo,la);return[(p[0]-gx)*2,(p[1]-gz)*2];};
  const railNear=(x,z,r)=>RAIL.some((a,i)=>i&&segDist(x,z,RAIL[i-1],a)<r);
  const free=(a,b,r)=>{const x=gx+a*KS,z=gz+b*KS;r*=KS;return landAt(x,z)&&!onRoad(x,z,r+(KS<1?1.6:2.3))&&!railNear(x,z,r+(KS<1?1.2:2));};
  const GLB=['#b4d4e6','#8ab4cc','#5e8aaa','#3e6688'],GLT=['#a8dcd4','#78b8b4','#4a9294','#2e6e74'],GLS=['#c8d4e0','#98aabc','#6a809a','#465c78'],GLBR=['#d8c4a0','#b0966e','#86704c','#5e4c34'];
  const TW=[// [lon,lat, spec]
    [115.8566,-31.9546,{w:2.2,h:30,seed:1,gl:GLS,tiers:[[.62,1,1],[.24,.82,.82],[.14,.62,.62]],crown:'frame',mast:5}],
    [115.8553,-31.9557,{w:2.6,d:1.7,h:26,seed:2,gl:GLB,tiers:[[1,1,1]],crown:'flat',mw:3}],
    [115.8531,-31.9545,{w:2.2,h:22,seed:3,gl:GLT,tiers:[[.8,1,1],[.2,.8,.8]],crown:'flat',mast:3}],
    [115.8592,-31.9542,{w:2,h:21,seed:4,gl:GLB,tiers:[[1,1,1]],crown:'slant',ch:3.2}],
    [115.8578,-31.9568,{w:2,h:16,seed:5,gl:GLS,tiers:[[1,1,1]],crown:'pyr',crownC:'#b8c0c8'}],
    [115.8586,-31.9556,{w:2,h:15,seed:6,shape:'oct',gl:GLBR,tiers:[[1,1,1]]}],
    [115.8610,-31.9553,{w:2,h:13,seed:7,stone:'#e2dccc',gl:GLB,tiers:[[.85,1,1],[.15,.85,.85]],fh:4}],
    [115.8544,-31.9534,{w:2.2,h:20,seed:8,gl:GLT,tiers:[[1,1,1]],crown:'slant',ch:2.6,crownC:'#9ad0c8'}],
    [115.8603,-31.9568,{w:1.8,h:12,seed:9,stone:'#d8ccb8',gl:GLS,tiers:[[1,1,1]],fh:4}],
    [115.8571,-31.9580,{w:1.6,h:11,seed:10,gl:GLB,tiers:[[1,1,1]],crown:'flat'}],
    [115.8556,-31.9580,{w:1.6,h:13,seed:11,gl:GLS,tiers:[[1,1,1]],crown:'flat'}],
    [115.8622,-31.9542,{w:1.8,h:14,seed:12,gl:GLBR,tiers:[[1,1,1]],plant:14}],
    [115.8635,-31.9556,{w:1.8,h:10,seed:13,stone:'#e8e0cc',gl:GLB,tiers:[[1,1,1]],fh:4}],
    [115.8520,-31.9532,{w:1.8,h:12,seed:14,stone:'#d8d0c0',gl:GLS,tiers:[[1,1,1]],fh:4}],
    [115.8560,-31.9530,{w:1.8,h:16,seed:15,gl:GLB,tiers:[[.75,1,1],[.25,.75,.75]],crown:'flat',plant:12}],
    [115.8582,-31.9528,{w:1.6,h:10,seed:16,stone:'#e2d6bc',gl:GLB,tiers:[[1,1,1]],fh:4}],
    [115.8605,-31.9530,{w:1.7,h:12,seed:17,gl:GLT,tiers:[[1,1,1]],crown:'flat'}],
    [115.8540,-31.9563,{w:1.6,h:9,seed:18,stone:'#e8dcc4',gl:GLS,tiers:[[1,1,1]],fh:4}],
    [115.8645,-31.9542,{w:1.6,h:9,seed:19,gl:GLB,tiers:[[1,1,1]],crown:'flat'}],
    [115.8510,-31.9548,{w:1.6,h:8,seed:20,stone:'#d8ccb8',gl:GLS,tiers:[[1,1,1]],fh:4}]];
  // Paul (Nov 2026): half the CBD towers. The signature ones stay (the tallest with its frame crown, the slanted and pyramid crowns, the octagon,
  // the tiered ones, two sandstone-faced blocks); the generic flat-topped fillers go and their sites become small paved plazas with trees and benches.
  const ALL=/[?&#]allcbd\b/.test(location.search+location.hash),RANK=[1,4,5,6,8,2,3,15,7,16,12,17,10,11,19,9,13,14,18,20];const plz=(()=>{const c=mkc(32,32),x=c.getContext('2d');for(let y=0;y<32;y+=4)for(let X=-(y%8?2:0);X<32;X+=4){PP(x,['#d8d0bc','#cfc6b0','#e2dac6'][(X*3+y)%3],X,y,4,4);PP(x,'#b8b09c',X,y+3,4,1);}return new THREE.MeshLambertMaterial({map:TX(c)});})();
  const fit=TW.filter(([lo,la,o])=>{const[a,b]=L(lo,la);return free(a,b,Math.max(o.w,o.d||o.w)*.5+.6);}),keep=new Set(fit.map(q=>q[2].seed).sort((p,q)=>RANK.indexOf(p)-RANK.indexOf(q)).slice(0,ALL?99:KS<1?8:Math.ceil(fit.length/2)));
  let n=0,nP=0;fit.forEach(([lo,la,o])=>{const[a,b]=L(lo,la);if(!keep.has(o.seed)){const pw=o.w+1.4;add(g,new THREE.BoxGeometry(pw,.1,pw),plz,a,.05,b).castShadow=false;[[-1,-1],[1,1]].forEach(([p,q])=>{const x=gx+(a+p*pw*.32)*KS,z=gz+(b+q*pw*.32)*KS;PL.push([x,groundAt(x,z),z,2,2.8,1]);});add(g,new THREE.BoxGeometry(.9,.22,.3),flat('#8a6a4a'),a+.5,.2,b-.4);add(g,new THREE.BoxGeometry(.9,.22,.3),flat('#8a6a4a'),a-.5,.2,b+.4);nP++;return;}tower2(g,a,b,o);n++;});
  // Paul (Nov 2026, by name): fill the empty CBD ground with more towers in the same style (same specs, new seeds), on free land off the roads and rail
  if(KS<1){const used=fit.filter(q=>keep.has(q[2].seed)).map(([lo,la])=>L(lo,la)),A=G(115.846,-31.9495),Bq=G(115.869,-31.9585);let extra=0;
    for(let wz=A[1];wz<=Bq[1];wz+=1.6)for(let wx=A[0];wx<=Bq[0];wx+=1.6){if(extra>=16)break;const jx=wx+(HSH(wx,wz)-.5)*.6,jz=wz+(HSH(wz,wx)-.5)*.6,a=(jx-gx)/KS,b=(jz-gz)/KS;
      const sp=TW[(extra*7+3)%TW.length][2],r=Math.max(sp.w,sp.d||sp.w)*.5+.5;if(!free(a,b,r))continue;if(used.some(u=>Math.hypot(u[0]-a,u[1]-b)<(r+1.6)*2))continue;
      tower2(g,a,b,Object.assign({},sp,{seed:60+extra,h:Math.max(7,sp.h*(.55+HSH(a,b)*.5))}));used.push([a,b]);extra++;n++;}O.cbdExtra=extra;}
  O.cbdTowers=n;O.cbdPlazas=nP;O.cbdKept=[...keep];
  // heritage sandstone: a town hall with a clock turret, a few low old blocks with verandahs
  [[115.8598,-31.9532,3,2.4,2.2,'#e0c89a',1],[115.8575,-31.9536,2.6,2,1.8,'#e8d8b0',0],[115.8618,-31.9564,2.4,2,1.6,'#d8c098',0],[115.8548,-31.9548,2.2,2,1.7,'#e4d0a8',0]].forEach(([lo,la,w,d,h,c,clock],i)=>{const[a,b]=L(lo,la);if(!free(a,b,w*.5+.4))return;
    blockB(g,a,b,w,d,h,{base:c,kind:'stone',rows:2,win:Math.floor(w*1.6),seed:140+i,parapet:1,frame:'#f4ecd8',awn:i?['#c8344a','#2f6a74','#3e7d5c'][i%3]:null});
    if(clock){add(g,new THREE.BoxGeometry(.9,2.2,.9),flat(c),a,h+1.1,b);add(g,new THREE.ConeGeometry(.75,1.2,4),flat('#5a6a5a'),a,h+2.8,b,Math.PI/4);const cc=mkc(8,8),cx=cc.getContext('2d');PP(cx,c,0,0,8,8);PP(cx,'#f4f2ec',1,1,6,6);PP(cx,'#2a2230',4,2,1,3);PP(cx,'#2a2230',4,4,2,1);const cl=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6),new THREE.MeshLambertMaterial({map:TX(cc),emissive:new THREE.Color(.3,.28,.2)}));cl.position.set(a,h+1.6,b+.46);g.add(cl);}});
  // the quay: a stone promenade on the water's edge, the bell tower, a footbridge arch
  const GU=(wx,wz)=>[(wx-gx)/KS,(wz-gz)/KS];// world -> this group
  const[qx,qz]=KS<1?GU(EQB.x-EQB.rx-1.2,EQB.z+.7):L(115.8575,-31.9594);const deck=mkc(32,32),dx=deck.getContext('2d');for(let y=0;y<32;y+=4)for(let X=-(y%8?3:0);X<32;X+=6){PP(dx,['#d8d0bc','#c8c0ac','#e2dac6'][(X+y)%3],X,y,6,4);PP(dx,'#a8a090',X,y+3,6,1);}
  const dt=TX(deck,true);dt.repeat.set(4,2);const dk=KS<1?add(g,new THREE.BoxGeometry(2.2,.5,7.5),new THREE.MeshLambertMaterial({map:dt}),...(([a,b])=>[a,.05,b])(GU(EQB.x-EQB.rx-.45,EQB.z))):add(g,new THREE.BoxGeometry(9,.5,4),new THREE.MeshLambertMaterial({map:dt}),qx,.05,qz-1.6);
  const bx=qx,bz=qz;const glc=mkc(16,64),gx2=glc.getContext('2d');for(let y=0;y<64;y++)for(let X=0;X<16;X++)PP(gx2,['#a8d8e4','#7ab8cc','#5a9ab4'][(X+((y/4)|0))%3],X,y);for(let y=0;y<64;y+=6)PP(gx2,'#e8f4f8',0,y,16,1);
  const gm=new THREE.MeshLambertMaterial({map:TX(glc,true),emissive:new THREE.Color(.25,.32,.36)});
  add(g,new THREE.CylinderGeometry(.35,1.1,8.5,6),gm,bx,4.25,bz);add(g,new THREE.ConeGeometry(.35,2.4,6),gm,bx,9.7,bz);
  [-1,1].forEach(s=>{const w=add(g,new THREE.BoxGeometry(.18,6.2,1.1),flat('#b87848'),bx+s*.75,3.4,bz-.2);w.rotation.z=s*.1;});
  add(g,new THREE.CylinderGeometry(1.6,1.8,.4,10),flat('#d8d0bc'),bx,.2,bz);
  const bl=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5),new THREE.MeshBasicMaterial({color:0xfff2c0}));bl.position.set(bx,7.8,bz);g.add(bl);O.bell=bl;
  const arch=KS<1?add(g,new THREE.TorusGeometry(2.4,.16,6,20,Math.PI),flat('#f4f2ec'),...(([a,b])=>[a,.2,b])(GU(EQB.x,EQB.z+EQB.rz+.9))):add(g,new THREE.TorusGeometry(2.4,.12,6,20,Math.PI),flat('#f4f2ec'),qx-4.5,.2,qz-.4);if(KS===1)arch.rotation.y=Math.PI/2;// owroads2: the footbridge spans the inlet mouth
  // street lamps and street trees along the terrace
  for(let k=0;k<9;k++){const a=-12+k*3,b=-1.2;if(!free(a,b,.3))continue;add(g,new THREE.CylinderGeometry(.06,.08,2.4,5),flat('#4a4e54'),a,1.2,b);const l=new THREE.Mesh(new THREE.BoxGeometry(.3,.2,.3),new THREE.MeshBasicMaterial({color:0x3a3a30}));l.position.set(a,2.45,b);g.add(l);(O.lamps||(O.lamps=[])).push(l);
    if(k%2)PL.push([gx+(a+.8)*KS,groundAt(gx+(a+.8)*KS,gz+b*KS),gz+b*KS,2,3.2*Math.sqrt(KS),1]);}
  // Kings Park's edge: Norfolk pines and gums along the escarpment above the river
  for(let k=0;k<26;k++){const lo=115.8455+k*.00028,la=-31.9575-k*.00012,p=G(lo,la),x=p[0]+(HSH(k,1)-.5)*2,z=p[1]+(HSH(k,2)-.5)*2;if(landAt(x,z)&&!onRoad(x,z,2.6))PL.push([x,groundAt(x,z)-.05,z,k%3?0:4,k%3?4.4:5.6,1]);}
  g.add(DET);O.cbdG=g0;}
