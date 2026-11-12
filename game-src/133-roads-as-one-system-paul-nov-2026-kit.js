// ===== roads as one system (Paul, Nov 2026, "ถนนไม่แหว่ง"): kit textures on every road, no second road under the freeway, bridges wherever a road
// crosses water, junction boxes that follow the ground above the roads under them, signals in green waves, nothing standing on a carriageway =====
try{const t0=performance.now(),RS={};O.ribs=RIBS;
  const AN=Math.max(1,Math.min(8,renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():1));RK.aniso=AN;RK.made.forEach(t=>{t.anisotropy=AN;t.needsUpdate=true;});
  // 1. the Mitchell Fwy: the old city ribbon under it goes; the coast road starts where the merge ends
  if(MP&&N&&O.MS){const cr=RIBS.find(r=>r.pts===N.cityRoad.p);if(cr)cr.m.visible=false;const mr=RIBS.find(r=>r.pts===N.main.draw);
    if(mr){const ML=O.MS[O.MS.length-1],s0=ML-55,P=N.main.p;let acc=0,np=null;for(let i=1;i<P.length;i++){const L=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(acc+L>=s0){const t=(s0-acc)/L;np=[[P[i-1][0]+(P[i][0]-P[i-1][0])*t,P[i-1][1]+(P[i][1]-P[i-1][1])*t]].concat(P.slice(i));break;}acc+=L;}
      if(np){mr.m.visible=false;mr.hidden=1;ribbon(np,4.4,roadM,.18,true);N.main.drawK=np;RS.clip=1;}}}
  // 2. one kit texture per road width (the same line widths on every road); mipmaps on the rest
  RIBS.forEach(r=>{if(r.m.material===roadM)r.m.material=RK.mat('rib'+r.w,()=>RK.ribbon(r.w),{side:THREE.DoubleSide});});
  scene.traverse(o=>{if(!o.isMesh)return;let p=o,L=null;while(p){if(p.userData&&p.userData.L){L=p.userData.L;break;}p=p.parent;}if(L!=='roads')return;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>RK.mip(m&&m.map));});
  // 3. bridges: rails and piers wherever a road other than the city roads (which have them) crosses water
  {const B=[];RIBS.forEach(r=>{if(!r.m.visible||ROADS.some(q=>q.p===r.pts)||r.w<3)return;const P=r.P2;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(!L)continue;
      for(let s=0;s<L;s+=1.6){const x=a[0]+(b[0]-a[0])*s/L,z=a[1]+(b[1]-a[1])*s/L;if(landAt(x,z)||H(x,z)>-.05)continue;B.push([x,z,(b[0]-a[0])/L,(b[1]-a[1])/L,r.w]);}}});
    if(B.length){const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.2,.8,.2),flat('#e8e4d8'),B.length*2),pi=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1.6,1),flat('#b8b0a0'),Math.ceil(B.length/5)),m4=new THREE.Matrix4();let np=0;
      B.forEach(([x,z,dx,dz,w],i)=>{[-1,1].forEach((sd,k)=>{m4.makeTranslation(x-dz*(w/2+.1)*sd,deckH(x,z)+.62,z+dx*(w/2+.1)*sd);im.setMatrixAt(i*2+k,m4);});if(i%5===0){m4.makeTranslation(x,.6,z);pi.setMatrixAt(np++,m4);}});
      pi.count=np;[im,pi].forEach(m=>{m.userData.L='props';m.castShadow=true;m.frustumCulled=false;scene.add(m);});}
    const BH=new Set(B.map(q=>Math.floor(q[0]/3)+','+Math.floor(q[1]/3)));O.bridgeAt=(x,z)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(BH.has((Math.floor(x/3)+a)+','+(Math.floor(z/3)+b)))return true;return false;};RS.bridge=B.length;}
  // 4. junction boxes: the city crossroads at 256 px, following the ground and above every road under them; plain boxes where a road tees into a highway
  const coverY=(x,z)=>{let m=deckH(x,z);for(const[a,b]of[[1.3,0],[-1.3,0],[0,1.3],[0,-1.3],[2.6,0],[-2.6,0],[0,2.6],[0,-2.6],[1.8,1.8],[-1.8,1.8],[1.8,-1.8],[-1.8,-1.8]])m=Math.max(m,H(x+a,z+b));return m+.26;};O.roadCoverY=coverY;
  const boxMesh=(x,z,a,b,ang,mat,yo,world)=>{(O.auBox||(O.auBox=[])).push([x,z,a,b,ang,'rk']);const g=new THREE.PlaneGeometry(b,a,Math.max(1,Math.ceil(b/1.1)),Math.max(1,Math.ceil(a/1.1)));g.rotateX(-Math.PI/2);g.rotateY(ang);const p=g.attributes.position,uv=g.attributes.uv;
    for(let i=0;i<p.count;i++){const X=x+p.getX(i),Z=z+p.getZ(i);p.setXYZ(i,X,coverY(X,Z)+(yo||0),Z);if(world)uv.setXY(i,X/2,Z/2);}g.computeVertexNormals();g.computeBoundingSphere();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.L='roads';m.name='rk:box';scene.add(m);return m;};
  const cityM=RK.mat('city',RK.city,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),asM=RK.mat('asph',RK.asph,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-8});let nb=0;
  (O.signals||[]).forEach(s=>{if(!s.g||s.sub)return;s.g.children.forEach(c=>{if(c.isMesh&&c.geometry&&c.geometry.type==='PlaneGeometry')c.visible=false;});if(OWR2){let w=0;RIBS.forEach(r=>{if(!r.m.visible||r.hidden)return;const P=r.P2;for(let i=1;i<P.length;i++)if(segDist(s.x,s.z,P[i-1],P[i])<1.5){w=Math.max(w,r.w);break;}});w=Math.max(4,w);const W=Math.round(w*4)/4;boxMesh(s.x,s.z,W,W,s.ang,RK.mat('cityW'+W,()=>RK.cityW(W),{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),.004);}else boxMesh(s.x,s.z,11,11,s.ang,cityM,.004);s.g.position.y=coverY(s.x,s.z)+.004;nb++;});
  // T junctions of the country roads (a spur into the highway): a box over the near half of the highway at the mouth
  const RV=RIBS.filter(r=>r.m.visible&&!r.hidden);
  RV.forEach(r=>{if(r.w>3.5)return;[r.pts[0],r.pts[r.pts.length-1]].forEach(e=>{if(O.signals&&O.signals.some(s=>Math.hypot(s.x-e[0],s.z-e[1])<7))return;let best=null;
    RV.forEach(q=>{if(q===r||q.w<r.w)return;const P=q.P2;for(let i=1;i<P.length;i++){const d=segDist(e[0],e[1],P[i-1],P[i]);if(d<q.w/2&&(!best||d<best.d)){const dx=P[i][0]-P[i-1][0],dz=P[i][1]-P[i-1][1],l=Math.hypot(dx,dz)||1;best={d,q,t:[dx/l,dz/l],a:P[i-1]};}}});
    if(!best)return;const t=best.t,n0=[t[1],-t[0]],q=r.pts[r.pts[0]===e?Math.min(3,r.pts.length-1):Math.max(0,r.pts.length-4)],sd=Math.sign((q[0]-e[0])*n0[0]+(q[1]-e[1])*n0[1])||1,n=[n0[0]*sd,n0[1]*sd];
    const along=(e[0]-best.a[0])*t[0]+(e[1]-best.a[1])*t[1],fx=best.a[0]+t[0]*along,fz=best.a[1]+t[1]*along,c=best.q.w/4;boxMesh(fx+n[0]*c,fz+n[1]*c,best.q.w/2+.1,r.w+1.2,Math.atan2(n[0],n[1]),asM,0,true);nb++;});});RS.boxes=nb;
  // 5. signals: only where three or more roads meet; along every corridor the lights turn green one after another (a green wave at 12 u/s)
  {const SG=O.signals||[],LN=[];RV.forEach(r=>LN.push(r.pts));
    const art=O.subArt||[];const gl={};art.forEach(a=>{const k=(a.h?'h':'v')+(a.h?Math.round(a.P[0][1]*2):Math.round(a.P[0][0]*2));(gl[k]||(gl[k]=[])).push(...a.P);});
    Object.values(gl).forEach(P=>{const h=Math.abs(P[0][1]-P[P.length-1][1])<Math.abs(P[0][0]-P[P.length-1][0])||P.every(p=>Math.abs(p[1]-P[0][1])<.01);P.sort((a,b)=>h?a[0]-b[0]:a[1]-b[1]);LN.push([P[0],P[P.length-1]]);});
    const armsAt=s=>{let n=0;RV.forEach(r=>{const P=r.P2;let hit=-1;for(let i=1;i<P.length;i++)if(segDist(s.x,s.z,P[i-1],P[i])<2.6){hit=i;break;}if(hit<0)return;const e0=Math.hypot(P[0][0]-s.x,P[0][1]-s.z)<3.5,e1=Math.hypot(P[P.length-1][0]-s.x,P[P.length-1][1]-s.z)<3.5;n+=e0||e1?1:2;});
      art.forEach(a=>{const P=a.P;for(let i=1;i<P.length;i++)if(segDist(s.x,s.z,P[i-1],P[i])<2.6){const e0=Math.hypot(P[0][0]-s.x,P[0][1]-s.z)<3.5,e1=Math.hypot(P[P.length-1][0]-s.x,P[P.length-1][1]-s.z)<3.5;n+=e0||e1?1:2;break;}});return n;};
    let gone=0;for(let i=SG.length-1;i>=0;i--){const s=SG[i];if(s.sub)continue;if(armsAt(s)<3){if(s.g){s.g.children.forEach(c=>{if(!(c.isMesh&&c.geometry&&c.geometry.type==='PlaneGeometry'))c.visible=false;});}SG.splice(i,1);gone++;}}
    const V=12,CY=22,cor=[];LN.forEach(P=>{const on=[];SG.forEach(s=>{let best=1e9,bs=0,acc=0,dir=null;for(let k=1;k<P.length;k++){const L=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);if(!L)continue;const d=segDist(s.x,s.z,P[k-1],P[k]);if(d<best){best=d;const t=Math.max(0,Math.min(1,((s.x-P[k-1][0])*(P[k][0]-P[k-1][0])+(s.z-P[k-1][1])*(P[k][1]-P[k-1][1]))/(L*L)));bs=acc+L*t;dir=[(P[k][0]-P[k-1][0])/L,(P[k][1]-P[k-1][1])/L];}acc+=L;}if(best<2.6)on.push({s,at:bs,dir});});
      if(on.length>1){on.sort((a,b)=>a.at-b.at);cor.push(on);}});
    cor.sort((a,b)=>b.length-a.length);{const seen=new Set(),ord=[],left=cor.slice();while(left.length){let bi=0,bs=-1;left.forEach((on,i)=>{const k=on.filter(o=>seen.has(o.s)).length*100+on.length;if(k>bs){bs=k;bi=i;}});const on=left.splice(bi,1)[0];on.forEach(o=>seen.add(o.s));ord.push(on);}cor.length=0;cor.push(...ord);}const g0=(s,dir)=>Math.abs(dir[0]*s.ax[0]+dir[1]*s.ax[1])>.7?0:11,done=new Map(),md=x=>((x%CY)+CY)%CY;
    cor.forEach(on=>{let anc=on.find(o=>done.has(o.s));if(!anc){anc=on[0];done.set(anc.s,0);anc.s.ph=md(g0(anc.s,anc.dir));}const tA=md(g0(anc.s,anc.dir)-anc.s.ph);
      on.forEach(o=>{if(done.has(o.s))return;const tS=tA+(o.at-anc.at)/V;done.set(o.s,tS);o.s.ph=md(g0(o.s,o.dir)-tS);});});
    O.signalCorr=cor.map(on=>on.map(o=>[+o.at.toFixed(1),SG.indexOf(o.s)]));RS.signals=SG.length;RS.signalsGone=gone;RS.corridors=cor.length;}
  // 6. nothing stands on a carriageway: plants go, posts, lamps and small props step out to the verge
  {const SEG=new Map(),put=(a,b,w)=>{for(let i=Math.floor((Math.min(a[0],b[0])-3)/8);i<=Math.floor((Math.max(a[0],b[0])+3)/8);i++)for(let j=Math.floor((Math.min(a[1],b[1])-3)/8);j<=Math.floor((Math.max(a[1],b[1])+3)/8);j++){const k=i*100003+j;let L=SEG.get(k);if(!L)SEG.set(k,L=[]);L.push([a,b,w]);}};
    RV.forEach(r=>{const P=r.P2;for(let i=1;i<P.length;i++)put(P[i-1],P[i],r.w/2-.1);});
    const carr=(x,z)=>{if(MP&&O.mitchD&&z<WZ){const d=O.mitchD(x,z);if(d<5.7&&d>1.7)return true;}if(O.subCarr&&O.subCarr(x,z))return true;const L=SEG.get(Math.floor(x/8)*100003+Math.floor(z/8));if(L)for(const s of L)if(segDist(x,z,s[0],s[1])<s[2])return true;
      if((O.signals||[]).some(s=>!s.sub&&Math.abs(s.x-x)<5.5&&Math.abs(s.z-z)<5.5&&Math.hypot(s.x-x,s.z-z)<4.6))return true;return false;};O.onCarriageway=carr;
    const out=(x,z)=>{let bd=1e9,b=null;const L=SEG.get(Math.floor(x/8)*100003+Math.floor(z/8))||[];for(const s of L){const a=s[0],c=s[1],dx=c[0]-a[0],dz=c[1]-a[1],LL=dx*dx+dz*dz;let t=LL?((x-a[0])*dx+(z-a[1])*dz)/LL:0;t=Math.max(0,Math.min(1,t));const px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;b=[px,pz];}}
      let dx=b?x-b[0]:1,dz=b?z-b[1]:0;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;for(let k=1;k<=40;k++){const X=x+dx*k*.25,Z=z+dz*k*.25;if(!carr(X,Z)&&!carr(X+dx*.3,Z+dz*.3))return[X+dx*.3,Z+dz*.3];}
      for(let r=.5;r<=8;r+=.5)for(let a=0;a<16;a++){const X=x+Math.cos(a/16*6.283)*r,Z=z+Math.sin(a/16*6.283)*r;if(!carr(X,Z)&&!carr(X+.3,Z)&&!carr(X-.3,Z)&&!carr(X,Z+.3)&&!carr(X,Z-.3))return[X,Z];}return null;};
    const k0=PL.length;for(let i=PL.length-1;i>=0;i--){const q=PL[i];if(carr(q[0],q[2]))PL.splice(i,1);}RS.plants=k0-PL.length;
    if(RS.plants){O.chunks.forEach(c=>{c.parent.remove(c);c.geometry.dispose();});O.chunks.length=0;plants(PL,'plants',80);}
    let mv=0;const m4=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3();
    scene.traverse(o=>{if(!o.isInstancedMesh||o.userData.L!=='props'||!o.geometry.parameters||(o.geometry.parameters.height||0)>1.3)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();if(o.geometry.boundingBox.min.y>.5)return;let ch=0;
      const post=Math.abs((o.geometry.parameters.height||0)-.85)<.01;for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);m4.decompose(p,q,sc);if(!carr(p.x,p.z)&&!(post&&MP&&O.mitchD&&p.z<WZ&&O.mitchD(p.x,p.z)<1.7))continue;const w=out(p.x,p.z);if(!w)continue;p.set(w[0],Math.max(H(w[0],w[1]),deckH(w[0],w[1])-.05),w[1]);m4.compose(p,q,sc);o.setMatrixAt(i,m4);ch++;}if(ch){o.instanceMatrix.needsUpdate=true;mv+=ch;}});
    scene.children.slice().forEach(o=>{const L=o.userData&&o.userData.L;if(L!=='props'&&L!=='lights')return;if(!(o.isGroup||(o.isMesh&&!o.isInstancedMesh)))return;const b=new THREE.Box3().setFromObject(o);if(!isFinite(b.min.x))return;const w=Math.max(b.max.x-b.min.x,b.max.z-b.min.z);if(w>2.5||b.max.y-b.min.y<.3)return;
      const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;if(!carr(cx,cz)||(O.signals||[]).some(s=>s.g===o))return;const t=out(cx,cz);if(!t)return;o.position.x+=t[0]-cx;o.position.z+=t[1]-cz;
      const pair=scene.children.filter(m=>m!==o&&m.userData&&(m.userData.L==='lights'||m.userData.L==='props')&&!m.isInstancedMesh&&Math.hypot(m.position.x-(o.position.x-(t[0]-cx)),m.position.z-(o.position.z-(t[1]-cz)))<.6);pair.forEach(m=>{m.position.x+=t[0]-cx;m.position.z+=t[1]-cz;});mv++;});RS.moved=mv;}
  RS.ms=Math.round(performance.now()-t0);O.roadsFix=RS;console.log('OWROADS',JSON.stringify(RS));}catch(e){console.error('owroads',e);}

{const RT=[];const addR=(P,offs)=>{let L=0;const S=[0];for(let i=1;i<P.length;i++){L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);S.push(L);}if(L>20)RT.push({P,S,L,offs});};
  ROADS.forEach(r=>{if(N&&r===N.cityRoad)return;if(O.kwRoad&&r.n==='Kwinana Fwy'){if(O.KWprot&&O.KWprot.length>1)addR(O.KWprot,[1]);addR(O.kwRoad.map(p=>[p[0],p[1]]),[2.6,4.6]);return;}addR(r.p,[1]);});if(N)N.roads.forEach(r=>{const P=r.draw||r.p;if(r===N.main&&MP){const z0=MP[MP.length-1][1];addR(P.filter(q=>q[1]<=z0+1),[1.1]);}else addR(P,[1]);});if(MP)addR(MP,[2.6,4.6]);if(SOUTH&&SOUTH.road&&!O.kwRoad)addR(SOUTH.road,[1.1]);(O.subRoutes||[]).forEach(P=>addR(P,[.95]));
  const posOn=(R,s,o,dir)=>{s=Math.max(0,Math.min(R.L-.01,s));let i=1;while(i<R.S.length-1&&R.S[i]<s)i++;const a=R.P[i-1],b=R.P[i],t=(s-R.S[i-1])/(R.S[i]-R.S[i-1]||1);let dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const fx=dx*dir,fz=dz*dir;
    return{x:a[0]+(b[0]-a[0])*t+fz*o,z:a[1]+(b[1]-a[1])*t-fx*o,a:Math.atan2(fx,fz)};};
  const COLS=['#c8344a','#f4f2ec','#2f6a74','#e8b860','#3e7d5c','#1d3a6e','#9aa0a6','#e86a1a','#2a2a30','#d8d0bc'];
  const wc=mkc(16,8),wx=wc.getContext('2d');PP(wx,'#2a2230',0,0,16,8);PP(wx,'#8ab4cc',1,1,6,6);PP(wx,'#8ab4cc',9,1,6,6);PP(wx,'#c8e0ec',2,1,2,2);const winM=new THREE.MeshLambertMaterial({map:TX(wc)});
  const CARS=[];for(let k=0;k<22;k++){const g=new THREE.Group();g.userData.L='veh';const c=COLS[k%COLS.length];const bc=mkc(24,8),bx=bc.getContext('2d');PP(bx,c,0,0,24,8);PP(bx,shc(c,1.2),0,0,24,1);PP(bx,shc(c,.6),0,7,24,1);PP(bx,shc(c,.7),8,1,1,6);PP(bx,shc(c,.7),15,1,1,6);PP(bx,'#2a2230',3,6,4,2);PP(bx,'#2a2230',17,6,4,2);
    const bm=new THREE.MeshLambertMaterial({map:TX(bc)}),van=k%5===0;const b=new THREE.Mesh(new THREE.BoxGeometry(1.15,.5,van?2.8:2.4),[bm,bm,flat(c),flat(c),flat('#e8e4d8'),flat('#d8323a')]);b.position.y=.42;b.castShadow=true;g.add(b);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(1.0,.42,van?2.2:1.2),[winM,winM,flat(c),flat(c),winM,winM]);cab.position.set(0,.88,van?-.2:-.1);g.add(cab);
    [[-.5,.75],[.5,.75],[-.5,-.75],[.5,-.75]].forEach(([a,z2])=>{const w=new THREE.Mesh(new THREE.BoxGeometry(.18,.32,.32),flat('#1c1c1e'));w.position.set(a*1.05,.18,z2*(van?1.2:1));g.add(w);});
    const hl=new THREE.Mesh(new THREE.BoxGeometry(.9,.08,.04),new THREE.MeshBasicMaterial({color:0xfff2c0}));hl.position.set(0,.5,(van?1.4:1.2)+.01);g.add(hl);
    g.visible=false;scene.add(g);CARS.push({g,R:null,s:0,dir:1,o:1,v:10+HSH(k,1)*6});}
  const spawn=(c,px,pz)=>{for(let t=0;t<14;t++){const R=RT[(Math.random()*RT.length)|0],s=Math.random()*R.L,o=R.offs[(Math.random()*R.offs.length)|0],dir=Math.random()<.5?1:-1,p=posOn(R,s,o,dir),d=Math.hypot(p.x-px,p.z-pz);if(d<40||d>170)continue;Object.assign(c,{R,s,o,dir});c.g.visible=true;return;}c.g.visible=false;c.R=null;};
  O.traffic=(dt,px,pz)=>{CARS.forEach(c=>{if(!c.R||Math.hypot(c.g.position.x-px,c.g.position.z-pz)>210){spawn(c,px,pz);if(!c.R)return;}
      if(O.signals&&O.signals.length){const hx=Math.sin(c.g.rotation.y),hz=Math.cos(c.g.rotation.y);const red=O.signals.find(s=>{const dx=s.x-c.g.position.x,dz=s.z-c.g.position.z,d=Math.hypot(dx,dz);return d>6.5&&d<11&&(dx*hx+dz*hz)/d>.6&&!O.signalOk(s,hx,hz,O.t);});if(red)return;}c.s+=c.v*c.dir*dt;if(c.s<0||c.s>c.R.L){c.R=null;c.g.visible=false;return;}const p=posOn(c.R,c.s,(c.R.P===O.MPd&&O.mitchTaper)?O.mitchTaper(c.s,c.o):c.o,c.dir);
      if(Math.hypot(p.x-px,p.z-pz)<3.2&&ST.inCar){c.s-=c.v*c.dir*dt;return;}c.g.position.set(p.x,deckH(p.x,p.z)+.2,p.z);c.g.rotation.y=p.a;});};
  O.carsN=CARS.length;O.roadsT=RT.length;}

