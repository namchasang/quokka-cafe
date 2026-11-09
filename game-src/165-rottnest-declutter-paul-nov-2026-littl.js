// ---------- Rottnest declutter (Paul, Nov 2026): little houses that crowd the main paths shrink and step back from them;
// ones that sit right on a path are taken away. Anything you can use (a shop, a door, a lot for sale, the café) stays as it is.
function pxDeclutter(gs){const V=new THREE.Vector3(),B=new THREE.Box3(),L=new THREE.Box3();scene.updateMatrixWorld(true);const out={shrunk:0,gone:0,kept:0};
  const lbox=o=>{B.setFromObject(o);if(B.isEmpty())return null;L.makeEmpty();for(const x of[B.min.x,B.max.x])for(const y of[B.min.y,B.max.y])for(const z of[B.min.z,B.max.z]){V.set(x,y,z);scene.worldToLocal(V);L.expandByPoint(V);}return L.clone();};
  let T=[];try{T=buildTargets();}catch(e){}const lanes=(typeof BLANES!=='undefined'?BLANES:[]).filter(l=>l[0][0]<99.5);
  const near=(b,pad)=>{const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2,hx=(b.max.x-b.min.x)/2+pad,hz=(b.max.z-b.min.z)/2+pad;let best=1e9,dir=null;
    const test=(a,c,w)=>{for(let k=0;k<=10;k++){const t=k/10,px=a[0]+(c[0]-a[0])*t,pz=a[1]+(c[1]-a[1])*t;const dx=Math.max(0,Math.abs(px-cx)-hx),dz=Math.max(0,Math.abs(pz-cz)-hz),d=Math.hypot(dx,dz)-w;if(d<best){best=d;dir=[cx-px,cz-pz];}}};
    for(const p of MAIN)for(let i=0;i<p.length-1;i++)test(p[i],p[i+1],.6);for(const l of lanes)test(l[0],l[1],(l[2]||1.15)/2);return[best,dir];};
  // main paths only: the short spurs that lead to a door don't count
  const plen=p=>{let L=0;for(let i=1;i<p.length;i++)L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return L;};const MAIN=PATHS.filter(p=>p.length>2||plen(p)>16);
  (gs||scene.children.slice()).forEach(g=>{if(!g.isGroup||!g.visible||g.__pxSkip||g===CAFE_PX?.g)return;(pxDeclutter.seen=pxDeclutter.seen||new Set()).add(g);const b=lbox(g);if(!b)return;const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;
    if(cx>99.5||cx<-260||b.max.y-b.min.y<1.3||b.max.x-b.min.x>9||b.max.z-b.min.z>9)return;
    let wall=false;g.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'){const p=o.geometry.parameters;if(p.height>1.2&&Math.max(p.width,p.depth)>1.5)wall=true;}});if(!wall)return;
    if(Math.hypot(cx-player.x,cz-player.z)<6)return;
    const used=T.some(t=>t.x>b.min.x-2.2&&t.x<b.max.x+2.2&&t.z>b.min.z-2.2&&t.z<b.max.z+2.2);
    const core=b.clone();core.expandByVector(new THREE.Vector3(-.3,0,-.3));const[d,dir]=near(core,0);if(d>1.3)return;
    const cols=colliders.filter(c=>c.x1<1e8&&c.x1>=b.min.x-.3&&c.x2<=b.max.x+.3&&c.z1>=b.min.z-.3&&c.z2<=b.max.z+.3);
    (out.list=out.list||[]).push([Math.round(cx),Math.round(cz),+d.toFixed(1),+(b.max.x-b.min.x).toFixed(1)]);if(d<-.4){g.visible=false;cols.forEach(c=>{c.x1=c.z1=c.x2=c.z2=1e9;});const ins=new Set();g.traverse(o=>ins.add(o));scene.traverse(o=>{if(ins.has(o)||!o.isMesh||!o.visible||(o.userData&&o.userData.frames&&o.userData.frames.length>1))return;const q=lbox(o);if(q&&q.max.x-q.min.x>6)return;if(q&&q.min.x>=b.min.x-.35&&q.max.x<=b.max.x+.35&&q.min.z>=b.min.z-.35&&q.max.z<=b.max.z+.35&&q.max.y<=b.max.y+.2){o.visible=false;o.__declut=1;}});out.gone++;return;}
    // shrink to 70% round its footprint centre, then slide away from the path until it clears it by a metre
    const k=.7,px=g.position.x,pz=g.position.z;g.scale.multiplyScalar(k);g.position.x=cx+(px-cx)*k;g.position.z=cz+(pz-cz)*k;
    cols.forEach(c=>{c.x1=cx+(c.x1-cx)*k;c.x2=cx+(c.x2-cx)*k;c.z1=cz+(c.z1-cz)*k;c.z2=cz+(c.z2-cz)*k;});
    let nb=lbox(g),n=Math.hypot(dir[0],dir[1])||1,ux=dir[0]/n,uz=dir[1]/n,moved=0;
    for(let s=0;s<12&&nb&&near(nb,0)[0]<1;s++){g.position.x+=ux*.3;g.position.z+=uz*.3;moved+=.3;nb.min.x+=ux*.3;nb.max.x+=ux*.3;nb.min.z+=uz*.3;nb.max.z+=uz*.3;}
    cols.forEach(c=>{c.x1+=ux*moved;c.x2+=ux*moved;c.z1+=uz*moved;c.z2+=uz*moved;});out.shrunk++;});
  pxDeclutter.out=out;window.__declut=out;}
var SP2_LIVE=true;const SP2_ON=SP2_LIVE||/[?&#]sp2\b/.test(location.search+location.hash);// Look Lab: South Perth phases 1-5 (Paul, Nov 2026)
// ---------- South Perth phase 3: the city across the river as pixel towers that light up at night ----------
function spBuild_sky(){if(typeof SKY==='undefined')return;const B=new THREE.Box3(),C=new THREE.Vector3();scene.updateMatrixWorld(true);
  // the old plain boxes go
  {const rm=[];scene.children.forEach(o=>{if(!o.isMesh||!o.geometry||!/^(Box|Cone|Cylinder)/.test(o.geometry.type))return;B.setFromObject(o);if(B.isEmpty()||B.max.y<2.5)return;B.getCenter(C);scene.worldToLocal(C);if(C.x>105&&C.x<200&&C.z<-10.5&&C.z>-19)rm.push(o);});rm.forEach(o=>scene.remove(o));spBuild_sky.removed=rm.length;}
  const r=mulberry32(4711),G=new THREE.Group();G.__pxSkip=1;scene.add(G);
  const tower=(W,H,glass,frame,seed,lit)=>{const w=Math.round(W*32),h=Math.round(H*32),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');const rr=mulberry32(seed);
    x.fillStyle=frame;x.fillRect(0,0,w,h);const fl=8;
    for(let y=4;y<h-4;y+=fl)for(let X=3;X<w-3;X+=6){const on=lit&&rr()<.62;const g=on?(rr()<.3?'#fff0b8':'#ffd070'):glass;x.fillStyle=g;x.fillRect(X,y,5,fl-2);
      if(!on){x.fillStyle='rgba(255,255,255,.18)';x.fillRect(X,y,1,fl-2);}}
    x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,0,2,h);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(w-2,0,2,h);x.fillStyle=frame;x.fillRect(0,0,w,3);return c;};
  const PAL=[['#6f8aa6','#3a4656'],['#8fb0c8','#c8ccd0'],['#5a7088','#2a3240'],['#a8c0d0','#e8e4dc'],['#7aa0b0','#4a5a62'],['#b8a890','#efe4cf']];
  const glow=[],tip=[],lamps=[];
  const add=(x,z,W,D,H,k)=>{const[gl,fr]=PAL[k%PAL.length];const sd=k*31+7;const day=tower(W,H,gl,fr,sd,false),lit=tower(W,H,gl,fr,sd,true);const sdy=tower(D,H,gl,fr,sd+3,false),sli=tower(D,H,gl,fr,sd+3,true);
    const mk2=(a,b)=>{const m=new THREE.MeshLambertMaterial({map:ctex(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(PXK.glowDiff(a,b)),fog:false});glow.push(m);return m;};
    const front=mk2(day,lit),side=mk2(sdy,sli),top=new THREE.MeshLambertMaterial({color:fr,fog:false});
    const m=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),[side,side,top,top,front,front]);m.position.set(x,H/2,z);m.__pxSkip=1;G.add(m);
    // crowns: a stepped top, a mast with a red light, or a sloped glass roof
    const c=k%3;if(c===0){const s=new THREE.Mesh(new THREE.BoxGeometry(W*.7,H*.06,D*.7),top);s.position.set(x,H+H*.03,z);G.add(s);const mast=new THREE.Mesh(new THREE.CylinderGeometry(.03,.05,1.8,5),new THREE.MeshLambertMaterial({color:'#d8dce0',fog:false}));mast.position.set(x,H+1.2,z);G.add(mast);
      const L=new THREE.Mesh(new THREE.SphereGeometry(.09,6,4),new THREE.MeshBasicMaterial({color:'#ff3a30',fog:false}));L.position.set(x,H+2.15,z);G.add(L);tip.push(L);}
    else if(c===1){const g=new THREE.Mesh(new THREE.ConeGeometry(Math.min(W,D)*.6,H*.12,4),new THREE.MeshLambertMaterial({color:gl,fog:false}));g.rotation.y=Math.PI/4;g.position.set(x,H+H*.06,z);G.add(g);}
    else{const s=new THREE.Mesh(new THREE.BoxGeometry(W+.1,.25,D+.1),new THREE.MeshLambertMaterial({color:'#e8e4dc',fog:false}));s.position.set(x,H+.12,z);G.add(s);}};
  // back row tall, front row lower, a few landmark towers
  for(let i=0;i<16;i++){const x=114+i*5+(r()-.5)*1.4,H=9+r()*r()*14;add(x,-17.2-r()*1.4,2.2+r()*1.4,2+r()*1.2,H,i);}
  for(let i=0;i<14;i++){r();r();r();r();r();}// (Paul, Nov 2026: no low front row, only the glass towers)
  add(152,-16.4,2.6,2.6,22,0);add(168,-17.6,3,2.6,19,6);add(132,-17.4,2.8,2.4,17,9);
  // the bell tower by the water: glass spire on a copper-green base (kept, restyled)
  {const base=new THREE.Mesh(new THREE.CylinderGeometry(.55,.85,4.4,8),new THREE.MeshLambertMaterial({color:'#7fc4d0',fog:false}));base.position.set(143,2.2,-11.6);G.add(base);
    const sp=new THREE.Mesh(new THREE.ConeGeometry(.55,2.8,8),new THREE.MeshLambertMaterial({color:'#bfe8f0',fog:false,emissive:0x2a6a78,emissiveIntensity:0}));sp.position.set(143,5.8,-11.6);G.add(sp);glow.push(sp.material);}
  // a riverside walk with lamps on the far bank, and night reflections of the towers on the water
  for(let x=112;x<194;x+=4){const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.4,5),new THREE.MeshLambertMaterial({color:'#2e3236',fog:false}));p.position.set(x,.7,-10.6);G.add(p);
    const l=new THREE.Mesh(new THREE.SphereGeometry(.08,6,4),new THREE.MeshBasicMaterial({color:'#e8d8a8',fog:false}));l.position.set(x,1.45,-10.6);G.add(l);lamps.push(l);}
  const refl=[];for(let i=0;i<40;i++){const x=112+i*2.1+(r()-.5),w=.08+r()*.14,len=1.2+r()*2.6;const q=new THREE.Mesh(new THREE.PlaneGeometry(w,len),new THREE.MeshBasicMaterial({color:['#ffd070','#fff0b8','#ff9a50'][i%3],transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));
    q.rotation.x=-Math.PI/2;q.position.set(x,-.1,-9.6+(r()-.5)*.8+len/2);G.add(q);refl.push(q);}
  PXB_GLOW.push(...glow);
  spBuild_sky.tick=t=>{const n=typeof NIGHT==='number'?NIGHT:0,h=(S.time%1440)/60,k=Math.max(n,Math.max(0,Math.min(1,(h-17.6)/1.2))*.7);
    refl.forEach((q,i)=>{q.material.opacity=k*(.12+.08*Math.sin(t*2+i*1.7));q.scale.x=1+.15*Math.sin(t*3+i);});tip.forEach((L,i)=>L.material.color.set(Math.sin(t*2+i)>0?'#ff3a30':'#601010'));lamps.forEach(L=>L.material.color.set(k>.3?'#ffd070':'#e8d8a8'));};}
