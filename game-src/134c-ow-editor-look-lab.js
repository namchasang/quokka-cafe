// ===== Outer World Editor (Look Lab: ?ow2&owedit, Paul Nov 2026) =====
// A view from above. Draw roads (lane / street / road / freeway) and railways point by point, add items (trees, houses, shops, towers,
// lamps, benches, signs, stations), pick any single object in the world to move, turn, resize, copy or delete it, and brush the map:
// erase (roads, houses, props in a circle), land, water, raise, lower, flatten. Everything shows at once and is kept on this device;
// "Copy edits" gives a QCOW1 list to paste to Claude, who builds it into the game for real.
if(/[?&#]owedit\b/.test(location.search+location.hash))try{(()=>{const KEY='qc-ow-edits-v1';let E=[];try{E=JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){E=[];}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(E));}catch(e){}info();};const r1=v=>Math.round(v*10)/10;
  const ED={on:true,tool:'pan',kind:'street',item:'tree',R:3,cx:ST.carX,cz:ST.carZ,h:70,draw:null,sel:null,applied:false};O.editor=ED;
  // ---------- panel ----------
  const st=document.createElement('style');st.textContent=`#owEd{position:absolute;left:8px;bottom:8px;z-index:30;background:rgba(20,26,46,.92);color:#f4f2ec;font:12px/1.3 system-ui,sans-serif;border-radius:10px;padding:8px;max-width:min(560px,96vw);box-shadow:0 4px 18px rgba(0,0,0,.4)}
#owEd .r{display:flex;flex-wrap:wrap;gap:4px;margin:3px 0}#owEd button{background:#2c3557;color:#f4f2ec;border:1px solid #4a5480;border-radius:7px;padding:6px 8px;font:inherit;cursor:pointer;touch-action:manipulation}
#owEd button.on{background:#e8b860;color:#1a1a1a;border-color:#e8b860}#owEd .h{opacity:.75;font-size:11px}#owEd b{color:#e8b860}`;document.head.appendChild(st);
  const P=document.createElement('div');P.id='owEd';(document.getElementById('owRoot')||document.body).appendChild(P);
  const TOOLS=[['pan','Move map'],['select','Pick'],['road','Road'],['rail','Railway'],['item','Add item'],['erase','Erase'],['land','Land'],['water','Water'],['raise','Raise'],['lower','Lower'],['flat','Flatten']];
  const KINDS=[['lane','Lane (cul-de-sac)'],['street','Street 2 lanes'],['road','Road 4 lanes'],['fwy','Freeway']];
  const ITEMS=[['tree','Tree'],['palm','Palm'],['house','House'],['shop','Shop'],['tower','Tower'],['station','Station'],['carpark','Car park'],['oval','Sports oval'],['court','Sports court'],['play','Playground'],['lamp','Lamp'],['bench','Bench'],['sign','Sign']];
  const btn=(row,id,lab,on,f)=>{const b=document.createElement('button');b.textContent=lab;if(on)b.className='on';b.onclick=e=>{e.stopPropagation();f(id);};row.appendChild(b);return b;};
  function render(){P.innerHTML='';const head=document.createElement('div');head.innerHTML='<b>Outer World Editor</b> <span class="h">drag = move map · wheel/± = zoom</span>';P.appendChild(head);
    const r=n=>{const d=document.createElement('div');d.className='r';P.appendChild(d);return d;};
    const a=r();TOOLS.forEach(([id,l])=>btn(a,id,l,ED.tool===id,t=>{finish();ED.tool=t;render();}));
    if(ED.tool==='road'){const b=r();KINDS.forEach(([id,l])=>btn(b,id,l,ED.kind===id,k=>{ED.kind=k;render();}));}
    if(ED.tool==='road'||ED.tool==='rail'){const b=r();btn(b,0,'On the ground',0,()=>{ED.bridge=false;render();}).className=ED.bridge?'':'on';btn(b,0,'Bridge / overpass',0,()=>{ED.bridge=true;render();}).className=ED.bridge?'on':'';btn(b,0,'Finish line',0,finish);btn(b,0,'Cancel line',0,()=>{dropDraw();render();});}
    if(ED.tool==='item'){const b=r();ITEMS.forEach(([id,l])=>btn(b,id,l,ED.item===id,k=>{ED.item=k;render();}));}
    if(['erase','land','water','raise','lower','flat'].includes(ED.tool)){const b=r();[[1.5,'S'],[3,'M'],[6,'L'],[12,'XL']].forEach(([v,l])=>btn(b,v,'Brush '+l,ED.R===v,x=>{ED.R=x;render();}));}
    if(ED.sel){const b=r();btn(b,0,'⟲ 15°',0,()=>selOp('rot',Math.PI/12));btn(b,0,'⟳ 15°',0,()=>selOp('rot',-Math.PI/12));btn(b,0,'Bigger',0,()=>selOp('scl',1.1));btn(b,0,'Smaller',0,()=>selOp('scl',1/1.1));btn(b,0,'Copy here',0,()=>{ED.tool='stamp';render();});btn(b,0,'Delete',0,()=>selOp('del'));btn(b,0,'Done',0,()=>{setSel(null);render();});}
    const c=r();btn(c,0,'−',0,()=>{ED.h=Math.min(400,ED.h*1.25);});btn(c,0,'+',0,()=>{ED.h=Math.max(12,ED.h/1.25);});btn(c,0,'To car',0,()=>{ED.cx=ST.carX;ED.cz=ST.carZ;});btn(c,0,'Undo',0,undo);btn(c,0,'Copy edits',0,copy);btn(c,0,'Clear all',0,()=>{if(confirmClear())clearAll();});btn(c,0,'Drive',0,()=>{ED.on=!ED.on;render();}).textContent=ED.on?'Drive':'Edit';
    const s=document.createElement('div');s.className='h';s.id='owEdInfo';P.appendChild(s);info();}
  const confirmClear=()=>{const b=document.getElementById('owEdInfo');if(ED.clr&&performance.now()-ED.clr<4000){ED.clr=0;return true;}ED.clr=performance.now();if(b)b.textContent='Tap Clear all again to remove every edit.';return false;};
  function info(){const s=document.getElementById('owEdInfo');if(!s)return;const n={};E.forEach(e=>n[e.t]=(n[e.t]||0)+1);s.textContent=(E.length?E.length+' edits ('+Object.entries(n).map(([k,v])=>k+' '+v).join(', ')+')':'No edits yet')+(ED.draw?' · line: '+ED.draw.p.length+' points (tap near a road end to join it)':'')+(ED.sel?' · picked: '+ED.sel.label:'');}
  // ---------- camera from above ----------
  const r0=O.render;O.render=function(dt){if(ED.on){cam.position.set(ED.cx,groundAt(ED.cx,ED.cz)+ED.h,ED.cz+ED.h*.35);cam.lookAt(ED.cx,groundAt(ED.cx,ED.cz),ED.cz);cam.far=Math.max(900,ED.h*6);cam.updateProjectionMatrix();if(!ED.applied){ED.applied=true;replay();}}return r0.call(this,dt);};
  // ---------- picking the ground ----------
  const RC=new THREE.Raycaster(),NDC=new THREE.Vector2();let GROUND=null;const grounds=()=>GROUND||(GROUND=(()=>{const L=[];scene.traverse(o=>{if(o.isMesh&&o.userData.L==='ground')L.push(o);});return L;})());
  const ndc=e=>{const r=cv.getBoundingClientRect();NDC.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);RC.setFromCamera(NDC,cam);};
  const groundHit=e=>{ndc(e);const h=RC.intersectObjects(grounds(),false)[0];if(h)return[h.point.x,h.point.z];const t=-RC.ray.origin.y/RC.ray.direction.y;return t>0?[RC.ray.origin.x+RC.ray.direction.x*t,RC.ray.origin.z+RC.ray.direction.z*t]:null;};
  // ---------- previews ----------
  const PV=new THREE.Group();PV.name='owEditPreview';scene.add(PV);const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c).convertSRGBToLinear()}));
  const TEXM={};const texMat=(k,f)=>TEXM[k]||(TEXM[k]=new THREE.MeshLambertMaterial({map:RK.tex(f()),side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-24}));
  const stripMesh=(pts,w,off,mat,yo,rep,lift)=>{if(pts.length<2)return null;const v=[],uv=[],ix=[];let acc=0;pts.forEach((p,i)=>{const q=pts[Math.min(pts.length-1,i+1)],o=pts[Math.max(0,i-1)];let dx=q[0]-o[0],dz=q[1]-o[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;if(i)acc+=Math.hypot(p[0]-pts[i-1][0],p[1]-pts[i-1][1]);
      const cx=p[0]+dz*off,cz=p[1]-dx*off;[-1,1].forEach(s=>{const x=cx-dz*w/2*s,z=cz+dx*w/2*s;v.push(x,groundAt(x,z)+yo+(lift?lift[i]:0),z);uv.push(s<0?0:1,acc/(rep||w));});if(i){const b=(i-1)*2;ix.push(b,b+1,b+2,b+1,b+3,b+2);}});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;return m;};
  const dense=P0=>{const o=[P0[0]];for(let i=1;i<P0.length;i++){const a=P0[i-1],b=P0[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.8));for(let k=1;k<=n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}return o;};
  function roadMesh(e){const g=new THREE.Group(),p=dense(e.p);const add=m=>{if(m)g.add(m);};let lift=null;
    if(e.b){/* bridge / overpass: up 2.7 with ramps at both ends, on piers, with low walls */const S=[0];for(let i=1;i<p.length;i++)S.push(S[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));const T=S[S.length-1],RP=Math.min(12,T*.35);lift=S.map(s=>{const k=Math.max(0,Math.min(1,s/RP,(T-s)/RP));return 2.7*k*k*(3-2*k);});
      const W=e.t==='rail'?2.6:e.k==='lane'?2:e.k==='street'?3:e.k==='road'?9:12;const _sm=stripMesh;g.userData.lift=lift;
      add(stripMesh(p,W,0,M('#c9c6bd'),-.05,0,lift));[-1,1].forEach(sd=>{for(let i=1;i<p.length;i++){if(lift[i]<.3)continue;const a=p[i-1],b=p[i];let dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.45,l+.05),M('#d8d4ca'));const mx=(a[0]+b[0])/2+dz/l*W/2*sd,mz=(a[1]+b[1])/2-dx/l*W/2*sd;m.position.set(mx,groundAt((a[0]+b[0])/2,(a[1]+b[1])/2)+(lift[i]+lift[i-1])/2+.3,mz);m.rotation.y=Math.atan2(dx,dz);g.add(m);}});
      for(let i=0;i<p.length;i+=7){if(lift[i]<1)continue;const q=p[Math.min(p.length-1,i+1)],o=p[Math.max(0,i-1)];const gh=groundAt(p[i][0],p[i][1]),m=new THREE.Mesh(new THREE.BoxGeometry(W*.8,lift[i],.7),M('#c9c6bd'));m.position.set(p[i][0],gh+lift[i]/2-.05,p[i][1]);m.rotation.y=Math.atan2(q[0]-o[0],q[1]-o[1]);m.castShadow=true;g.add(m);}}
    if(e.t==='rail'){add(stripMesh(p,2.2,0,M('#9a8a74'),.14,0,lift));add(stripMesh(p,1.6,0,new THREE.MeshLambertMaterial({map:railT,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-7,polygonOffsetUnits:-28}),.18,1.6,lift));return g;}
    if(e.k==='lane')add(stripMesh(p,1.6,0,texMat('lane',RK.lane),.16,1.6,lift));else if(e.k==='street')add(stripMesh(p,2.5,0,texMat('street',RK.street),.16,1.25,lift));
    else{const w=e.k==='fwy'?4.4:4,gap=e.k==='fwy'?1.6:.2;[-1,1].forEach(s=>add(stripMesh(p,w,s*(w/2+gap),texMat('fwy',()=>RK.fwy(-1)),.16,4,lift)));if(e.k==='fwy')add(stripMesh(p,gap*2,0,e.b?M('#c9c6bd'):M('#7a9a5a'),.15,0,lift));}
    return g;}
  function itemMesh(k){const g=new THREE.Group();const bx=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x||0,y,z||0);m.castShadow=m.receiveShadow=true;g.add(m);return m;};
    const cy=(a,b,h,c,y,s)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,s||8),M(c));m.position.y=y;m.castShadow=true;g.add(m);return m;};const sp=(r,c,y,x,z)=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),new THREE.MeshLambertMaterial({color:new THREE.Color(c).convertSRGBToLinear(),flatShading:true}));m.position.set(x||0,y,z||0);m.castShadow=true;g.add(m);return m;};
    if(k==='tree'){cy(.12,.18,1.6,'#6a4a32',.8);sp(.9,'#4f8a3a',2);sp(.6,'#5f9a44',2.5,.4,.2);}
    else if(k==='palm'){cy(.1,.14,3,'#8a6a48',1.5);for(let i=0;i<6;i++){const f=bx(.18,.04,1.4,'#4f8a3a',0,3,0);f.rotation.y=i;f.position.set(Math.sin(i)*.6,2.9,Math.cos(i)*.6);f.rotation.x=.3;}}
    else if(k==='house'){bx(2,1.1,1.8,'#e8d0a0',0,.55);const r=new THREE.Mesh(new THREE.ConeGeometry(1.6,.8,4),M('#b8562e'));r.position.y=1.5;r.rotation.y=Math.PI/4;r.castShadow=true;g.add(r);bx(.4,.7,.05,'#6a3a2a',0,.35,.91);}
    else if(k==='shop'){bx(2.6,1.6,2,'#f2e6c8',0,.8);bx(2.6,.08,.7,'#c8344a',0,1.1,1.3);bx(2.2,.35,.05,'#2f6a74',0,1.4,1.02);}
    else if(k==='tower'){bx(2.4,9,2.4,'#88b4cc',0,4.5);bx(2.6,.4,2.6,'#d8dcde',0,9.2);}
    else if(k==='station'){bx(7,.4,1.6,'#d8d2c4',0,.2);bx(7,.08,1.6,'#2f6a74',0,1.9);[-3,0,3].forEach(x=>bx(.1,1.7,.1,'#8a8e94',x,1.05));}
    else if(k==='carpark'){bx(6,.06,4,'#5a5c60',0,.08);for(let i=-2;i<=2;i++)[-1,1].forEach(r=>bx(.06,.07,1.4,'#f4f2ec',i*1.2,.1,r*1.2));[['#c8344a',-1.8,-1.2],['#2f6a74',.6,1.2],['#e8b860',1.8,-1.2]].forEach(([c,x,z])=>{bx(.8,.4,1.2,c,x,.3,z);});}
    else if(k==='oval'){const m=new THREE.Mesh(new THREE.CircleGeometry(1,40),M('#5f9a44'));m.rotation.x=-Math.PI/2;m.scale.set(6,4,1);m.position.y=.08;g.add(m);const l=new THREE.Mesh(new THREE.RingGeometry(.96,1,40),M('#f4f2ec'));l.rotation.x=-Math.PI/2;l.scale.set(6,4,1);l.position.y=.1;g.add(l);[-5,5].forEach(x=>[-.4,.4].forEach(z=>bx(.06,1.4,.06,'#f4f2ec',x,.7,z)));bx(3,.6,1,'#d8d2c4',0,.3,-4.6);}
    else if(k==='court'){bx(4,.06,2.4,'#2f6a74',0,.08);bx(3.6,.07,2,'#3e7d5c',0,.09);bx(.04,.5,2,'#f4f2ec',0,.3);}
    else if(k==='play'){bx(3,.06,3,'#d8b88a',0,.07);bx(.08,1.4,.08,'#c8344a',-1,.7,-.6);bx(.08,1.4,.08,'#c8344a',1,.7,-.6);bx(2.1,.08,.08,'#2f6a74',0,1.4,-.6);const sl=bx(.5,.06,1.6,'#e8b860',.8,.6,.8);sl.rotation.x=.5;bx(.6,1,.6,'#3e7d5c',.8,.5,-.1);}
    else if(k==='lamp'){cy(.05,.07,2.4,'#4a4e54',1.2);bx(.3,.15,.3,'#fff2c0',0,2.45);}
    else if(k==='bench'){bx(1,.08,.35,'#8a5a3a',0,.4);bx(1,.35,.06,'#8a5a3a',0,.6,-.15);[-.4,.4].forEach(x=>bx(.06,.4,.3,'#4a4e54',x,.2));}
    else if(k==='sign'){cy(.05,.05,2,'#8a8e94',1);bx(1.8,.7,.06,'#1f6a3a',0,2.2);}
    return g;}
  const placed=new Map();let uid=1;
  function show(e){const id=e._id||(e._id=uid++);let m=null;
    if(e.t==='road'||e.t==='rail')m=roadMesh(e);
    else if(e.t==='add'){m=itemMesh(e.k);m.position.set(e.x,groundAt(e.x,e.z),e.z);m.rotation.y=e.r||0;m.scale.setScalar(e.s||1);m.userData.edId=id;}
    else if(e.t==='brush')brush(e);
    else if(e.t==='obj')objApply(e);
    if(m){PV.add(m);placed.set(id,m);}}
  function replay(){E.forEach(show);info();}
  // ---------- brushes: erase (cut triangles / hide instances), land, water, raise, lower, flatten (move ground vertices) ----------
  const LAY=new Set(['roads','build','props','plants','mark','lights']);
  function brush(e){const R=e.r,R2=R*R;
    if(e.k==='erase'){const v=new THREE.Vector3(),m4=new THREE.Matrix4(),zero=new THREE.Matrix4().makeScale(0,0,0);scene.traverse(o=>{if(!o.isMesh||o===PV||PV.children.includes(o))return;let a=o;while(a&&a!==scene){if(a===PV)return;a=a.parent;}const L=o.userData.L||(o.parent&&o.parent.userData.L);if(o.userData.L==='ground'||o.userData.L==='water')return;
      if(o.isInstancedMesh){let ch=false;for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);v.setFromMatrixPosition(m4).applyMatrix4(o.matrixWorld);if((v.x-e.x)**2+(v.z-e.z)**2<R2){o.setMatrixAt(i,zero);ch=true;}}if(ch)o.instanceMatrix.needsUpdate=true;return;}
      const g=o.geometry;if(!g||!g.attributes.position)return;if(!g.boundingSphere)g.computeBoundingSphere();o.updateMatrixWorld(true);v.copy(g.boundingSphere.center).applyMatrix4(o.matrixWorld);const br=g.boundingSphere.radius*Math.max(o.matrixWorld.getMaxScaleOnAxis(),1e-6);if(Math.hypot(v.x-e.x,v.z-e.z)>br+R)return;
      if(br<R*1.2&&Math.hypot(v.x-e.x,v.z-e.z)<R){o.visible=false;return;}if(!LAY.has(L)&&L)return;
      const pa=g.attributes.position;let ix=g.index?Array.from(g.index.array):null;if(!ix){ix=[];for(let i=0;i<pa.count;i++)ix.push(i);}const nx=[];for(let t=0;t<ix.length;t+=3){let x=0,z=0;for(let j=0;j<3;j++){v.fromBufferAttribute(pa,ix[t+j]).applyMatrix4(o.matrixWorld);x+=v.x;z+=v.z;}if((x/3-e.x)**2+(z/3-e.z)**2<R2)continue;nx.push(ix[t],ix[t+1],ix[t+2]);}if(nx.length!==ix.length)g.setIndex(nx);});return;}
    grounds().forEach(o=>{const g=o.geometry,pa=g.attributes.position,col=g.attributes.color,v=new THREE.Vector3();o.updateMatrixWorld(true);let ch=false,avg=0,na=0;
      if(e.k==='flat'){for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld);if((v.x-e.x)**2+(v.z-e.z)**2<R2){avg+=v.y;na++;}}avg=na?avg/na:0;}
      const inv=new THREE.Matrix4().copy(o.matrixWorld).invert();
      for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld);const d2=(v.x-e.x)**2+(v.z-e.z)**2;if(d2>=R2)continue;const f=1-Math.sqrt(d2)/R,k=f*f*(3-2*f);let y=v.y;
        if(e.k==='raise')y+=.6*k;else if(e.k==='lower')y-=.6*k;else if(e.k==='flat')y+=(avg-y)*k;else if(e.k==='land')y=Math.max(y,.35*k+y*(1-k),.3*k);else if(e.k==='water')y=Math.min(y,-.6*k+y*(1-k));
        v.y=y;v.applyMatrix4(inv);pa.setY(i,v.y);ch=true;
        if(col&&(e.k==='land'||e.k==='water')){const c=e.k==='land'?[.25,.45,.12]:[.62,.58,.42];col.setXYZ(i,col.getX(i)*(1-k)+c[0]*k,col.getY(i)*(1-k)+c[1]*k,col.getZ(i)*(1-k)+c[2]*k);}}
      if(ch){pa.needsUpdate=true;if(col)col.needsUpdate=true;g.computeVertexNormals();}});}
  // ---------- picking single objects ----------
  let box=null;const label=o=>(o.name||o.geometry&&o.geometry.type||o.type).replace('Geometry','');
  const pickRoot=o=>{let a=o;while(a.parent&&a.parent!==scene&&a.parent!==PV&&!(a.parent.userData&&a.parent.userData.L==='town'))a=a.parent;return a;};
  function setSel(o){ED.sel=o?{o,label:label(o)}:null;if(box){scene.remove(box);box=null;}if(o){box=new THREE.BoxHelper(o,0xe8b860);scene.add(box);}render();}
  const keyOf=o=>{if(o.userData.edId)return 'ed'+o.userData.edId;const v=new THREE.Vector3();o.getWorldPosition(v);return label(o)+'|'+r1(v.x)+'|'+r1(v.z);};
  const findKey=k=>{if(k.startsWith('ed')){const id=+k.slice(2);for(const[,m]of placed)if(m.userData.edId===id)return m;return null;}let f=null;const v=new THREE.Vector3();scene.traverse(o=>{if(f||o===PV)return;if(keyOf(o)===k)f=o;});return f;};
  function objApply(e){const o=findKey(e.id);if(!o)return;if(e.del){o.visible=false;return;}if(e.dx!==undefined){o.position.x+=e.dx;o.position.z+=e.dz;o.position.y+=(e.dy||0);}if(e.r)o.rotation.y+=e.r;if(e.s)o.scale.multiplyScalar(e.s);}
  function selOp(op,v){const s=ED.sel;if(!s)return;const o=s.o,id=o.userData.edId;
    if(id){const e=E.find(x=>x._id===id);if(op==='del'){E.splice(E.indexOf(e),1);PV.remove(o);placed.delete(id);setSel(null);save();return;}if(op==='rot'){o.rotation.y+=v;e.r=(e.r||0)+v;}if(op==='scl'){o.scale.multiplyScalar(v);e.s=(e.s||1)*v;}save();box&&box.update();return;}
    const e={t:'obj',id:s.key||(s.key=keyOf(o))};if(op==='del'){e.del=1;o.visible=false;E.push(e);setSel(null);save();return;}if(op==='rot'){o.rotation.y+=v;e.r=v;}if(op==='scl'){o.scale.multiplyScalar(v);e.s=v;}E.push(e);save();box&&box.update();}
  // ---------- lines: roads and railways ----------
  const ends=()=>{const L=[];E.forEach(e=>{if(e.t==='road'||e.t==='rail')L.push(e.p[0],e.p[e.p.length-1]);});RIBS.forEach(r=>{if(!r.hidden&&r.P2){L.push(r.P2[0],r.P2[r.P2.length-1]);}});(O.subStreets||[]).forEach(s=>{if(s.P&&s.P.length>1)L.push(s.P[0],s.P[s.P.length-1]);});return L;};
  const snap=p=>{let b=null,bd=2.2;ends().forEach(q=>{const d=Math.hypot(q[0]-p[0],q[1]-p[1]);if(d<bd){bd=d;b=q;}});return b?[r1(b[0]),r1(b[1])]:[r1(p[0]),r1(p[1])];};
  let drawM=null;function redrawLine(){if(drawM){PV.remove(drawM);drawM=null;}if(ED.draw&&ED.draw.p.length>1){drawM=roadMesh(ED.draw);PV.add(drawM);}const dots=ED.draw?ED.draw.p:[];if(!ED.dots){ED.dots=new THREE.Group();PV.add(ED.dots);}ED.dots.clear();dots.forEach(p=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.3,10),M('#e8b860'));m.position.set(p[0],groundAt(p[0],p[1])+.3,p[1]);ED.dots.add(m);});}
  function dropDraw(){ED.draw=null;redrawLine();}
  function finish(){if(ED.draw&&ED.draw.p.length>1){const e=ED.draw;ED.draw=null;redrawLine();E.push(e);show(e);save();}else dropDraw();}
  // ---------- taps and drags ----------
  let down=null;const opts={capture:true};
  cv.addEventListener('pointerdown',e=>{if(!ED.on)return;e.stopImmediatePropagation();e.preventDefault();down={x:e.clientX,y:e.clientY,cx:ED.cx,cz:ED.cz,moved:false,id:e.pointerId,last:null,g:groundHit(e)};
    if(ED.tool==='select'&&ED.sel&&down.g&&Math.hypot(down.g[0]-ED.sel.o.position.x,down.g[1]-ED.sel.o.position.z)<4)down.drag=ED.sel.o;cv.setPointerCapture(e.pointerId);},opts);
  cv.addEventListener('pointermove',e=>{if(!ED.on||!down||e.pointerId!==down.id)return;e.stopImmediatePropagation();const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>6)down.moved=true;if(!down.moved)return;
    if(['erase','land','water','raise','lower','flat'].includes(ED.tool)){const g=groundHit(e);if(g&&(!down.last||Math.hypot(g[0]-down.last[0],g[1]-down.last[1])>ED.R*.5)){down.last=g;const b={t:'brush',k:ED.tool,x:r1(g[0]),z:r1(g[1]),r:ED.R};E.push(b);brush(b);ED.dirty=1;}return;}
    if(down.drag){const g=groundHit(e);if(g){const o=down.drag;o.userData.mv=o.userData.mv||{x:o.position.x,z:o.position.z};const wp=new THREE.Vector3();o.parent.worldToLocal(wp.set(g[0],0,g[1]));o.position.x=wp.x;o.position.z=wp.z;box&&box.update();}return;}
    const k=ED.h/innerHeight*1.6;ED.cx=down.cx-dx*k;ED.cz=down.cz-dy*k;},opts);
  cv.addEventListener('pointerup',e=>{if(!ED.on||!down)return;e.stopImmediatePropagation();const d=down;down=null;if(ED.dirty){ED.dirty=0;save();}
    if(d.drag&&d.moved){const o=d.drag,mv=o.userData.mv;if(mv){const id=o.userData.edId;if(id){const en=E.find(x=>x._id===id);const wp=new THREE.Vector3();o.getWorldPosition(wp);en.x=r1(wp.x);en.z=r1(wp.z);o.position.y=groundAt(wp.x,wp.z);}else E.push({t:'obj',id:ED.sel.key||(ED.sel.key=(()=>{const p=o.position.clone();o.position.set(mv.x,o.position.y,mv.z);const k=keyOf(o);o.position.copy(p);return k;})()),dx:r1(o.position.x-mv.x),dz:r1(o.position.z-mv.z)});o.userData.mv=null;save();}return;}
    if(d.moved)return;const g=d.g;if(!g)return;
    if(ED.tool==='road'||ED.tool==='rail'){if(!ED.draw){ED.draw=ED.tool==='rail'?{t:'rail',p:[]}:{t:'road',k:ED.kind,p:[]};if(ED.bridge)ED.draw.b=1;}ED.draw.p.push(snap(g));redrawLine();info();return;}
    if(ED.tool==='item'){const en={t:'add',k:ED.item,x:r1(g[0]),z:r1(g[1]),r:0,s:1};E.push(en);show(en);save();return;}
    if(ED.tool==='stamp'&&ED.sel){const src=ED.sel.o;if(src.userData.edId){const s0=E.find(x=>x._id===src.userData.edId);const en=Object.assign({},s0,{x:r1(g[0]),z:r1(g[1])});delete en._id;E.push(en);show(en);}else{const c=src.clone();const wp=new THREE.Vector3();src.getWorldPosition(wp);const lp=src.parent.worldToLocal(new THREE.Vector3(g[0],wp.y,g[1]));c.position.copy(lp);src.parent.add(c);E.push({t:'copy',id:ED.sel.key||(ED.sel.key=keyOf(src)),x:r1(g[0]),z:r1(g[1])});}save();return;}
    if(ED.tool==='select'){ndc(e);const hits=RC.intersectObjects(scene.children,true).filter(h=>h.object.visible&&h.object.userData.L!=='ground'&&h.object.userData.L!=='water'&&h.object!==box);
      for(const h of hits){const o=pickRoot(h.object);const g2=o.geometry;if(g2&&g2.attributes.position&&g2.attributes.position.count>6000)continue;/* merged areas: use Erase */ED.tool='select';setSel(o);ED.sel.key=keyOf(o);return;}setSel(null);}},opts);
  cv.addEventListener('wheel',e=>{if(!ED.on)return;e.preventDefault();e.stopImmediatePropagation();ED.h=Math.max(12,Math.min(400,ED.h*(e.deltaY>0?1.15:1/1.15)));},{passive:false,capture:true});
  addEventListener('keydown',e=>{if(!ED.on)return;if(e.key==='Enter')finish();if(e.key==='Escape'){dropDraw();setSel(null);}if((e.ctrlKey||e.metaKey)&&e.key==='z')undo();});
  // copies of existing objects are re-made on replay too
  const _show=show;show=function(e){if(e.t==='copy'){const s=findKey(e.id);if(s){const c=s.clone();const wp=new THREE.Vector3();s.getWorldPosition(wp);c.position.copy(s.parent.worldToLocal(new THREE.Vector3(e.x,wp.y,e.z)));s.parent.add(c);}return;}return _show(e);};
  function undo(){if(ED.draw&&ED.draw.p.length){ED.draw.p.pop();redrawLine();info();return;}const e=E.pop();if(!e)return;save();if(e.t==='add'||e.t==='road'||e.t==='rail'){const m=placed.get(e._id);if(m){PV.remove(m);placed.delete(e._id);}return;}
    const b=document.getElementById('owEdInfo');if(b)b.textContent='Undone. Brushes, picks and copies come back fully after reloading the page.';}
  function clearAll(){E=[];save();location.reload();}
  function copy(){const txt='QCOW1 '+JSON.stringify(E.map(e=>{const o=Object.assign({},e);delete o._id;return o;}));const done=()=>{const b=document.getElementById('owEdInfo');if(b)b.textContent='Copied '+E.length+' edits. Paste them to Claude.';};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>prompt('Copy these edits',txt));else prompt('Copy these edits',txt);}
  window.__owEdit={ED,E:()=>E};render();})();}catch(e){console.error('ow editor',e);}
