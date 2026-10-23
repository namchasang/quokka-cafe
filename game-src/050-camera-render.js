// ---------- camera + render ----------
const camTarget=new THREE.Vector3(0,0,2.9),tmpV=new THREE.Vector3();
const TITLE_SHOTS=[[0,.6,1.5,.35,.9],[-12,.6,5.5,-.5,.75],[2,.6,9,.2,.8],[18,.6,-.5,.6,.95],[31,.6,-2,-.3,.9],[-9.3,.6,0,.4,.7]];
let MIR=false,flipT=0;
function updateMirror(){const m=!running||zoneOf(player.x)==='island';flipT-=1/60;if(m&&flipT<=0&&typeof flipIslandSigns==='function'){flipT=2;flipIslandSigns();}if(m!==MIR){MIR=m;scene.scale.x=m?-1:1;scene.updateMatrixWorld(true);}if(typeof waveMat!=='undefined')waveMat.uniforms.uMir.value=MIR?-1:1;}
function updateCamera(dt,snap){updateMirror();tmpV.set(player.x,.6,player.z);if(overlay==='title'||overlay==='slots'){const tt=performance.now()/1000/9,i=Math.floor(tt)%TITLE_SHOTS.length,f=tt%1,A=TITLE_SHOTS[i],B=TITLE_SHOTS[(i+1)%TITLE_SHOTS.length],e=f<.7?0:(f-.7)/.3;const k=e*e*(3-2*e);tmpV.set(lerp(A[0],B[0],k)+f*.8,.6,lerp(A[2],B[2],k));yawT=lerp(A[3],B[3],k)+f*.12;zm=lerp(A[4],B[4],k);S.time=1050;}
  if(CINE&&RIDE){const f=CINE.focus;if(f){tmpV.x=lerp(player.x,f.x,.7);tmpV.z=lerp(player.z,f.z,.7);}yawT+=dt*.06*(MIR?-1:1);zm+=((f?2.1:1.6)-zm)*(1-Math.exp(-dt*1.2));}
  camTarget.lerp(tmpV,snap?1:1-Math.exp(-dt*(CINE?2:5)));yaw+=(yawT-yaw)*(snap?1:1-Math.exp(-dt*8));camOff.set(Math.sin(yaw)*CAM_DIR.z,CAM_DIR.y,Math.cos(yaw)*CAM_DIR.z);camera.position.copy(camTarget).addScaledVector(camOff,Math.min(52,camDist*zm));for(let i=0;i<BB.length;i++)BB[i].rotation.y=yaw;dir4Tick();if(MIR){camera.position.x=-camera.position.x;camera.lookAt(-camTarget.x,camTarget.y,camTarget.z);}else camera.lookAt(camTarget);
  tmpV.set(MIR?-camTarget.x:camTarget.x,.8,camTarget.z).project(camera);post.uniforms.focus.value=clamp((tmpV.y+1)/2,.25,.75);{const zq=zoneOf(player.x);const bk={island:.45,sp:.3,hi:.45,vp:.55,freo:.45}[zq]||.5;post.uniforms.bloomK.value+=(bk-post.uniforms.bloomK.value)*.1;post.uniforms.blurK.value+=((zq==='sp'?.75:1)-post.uniforms.blurK.value)*.1;}}
function ambient(dt,t){weatherTick(dt,t);water.material.map.offset.x=(t*.012)%1;water.material.map.offset.y=(Math.sin(t*.4)*.02);
  {const nb=Math.min(4,1+(S.jetty||0)),nx=FERRY_ARR.find(a=>S.time<a+14);ferries.forEach((f,i)=>{if(i>=nb){f.visible=false;return;}const D=DOCKS[i];let fx=D[0],fz=D[1],vis=true;const ox=D[0]-14,oz=D[1]+(D[1]>5?3.2:-3.2);
    if(running&&player.x<100){if(nx===undefined||S.wx===3){}else{const k=S.time-nx+i*1.2;if(k<-10)vis=false;else if(k<0){const e=1-(-k/10);fx=lerp(ox,D[0],e*e*(3-2*e));fz=lerp(oz,D[1],e);}else if(k<8){}else{const e=Math.min(1,(k-8)/6);fx=lerp(D[0],ox,e*e);fz=lerp(D[1],oz,e);if(e>=1)vis=false;}}}
    f.visible=vis;f.position.set(fx,-.15+Math.sin(t*1.3+i)*.05,fz);f.rotation.set(0,D[2],Math.sin(t*1.1+i)*.02);});
   if((S.jetty||0)>=4&&running&&player.x<100&&S.wx!==3){const k=S.time-600;let sx=-31.5,sz=9.6,v=true;if(k<-14||k>136)v=false;else if(k<0){const e=1+k/14;sx=lerp(-58,-31.5,e*e*(3-2*e));}else if(k>120){const e=(k-120)/16;sx=lerp(-31.5,-58,e*e);}ship.visible=v;ship.position.set(sx,-.2+Math.sin(t*.8)*.04,sz);}else ship.visible=false;}
  machineLight.visible=player.brewing>0?(Math.floor(t*6)%2===0):true;
  loreSparks.forEach((s,i)=>{s.position.y=1.7+Math.sin(t*2+i)*.1;s.visible=!S.lore[i]||Math.floor(t*2+i)%3===0;LORE[i].rune.material.color.setHex(S.lore[i]?0x6a7c80:0x8fe8ff);});
  SHELLS.forEach((s,i)=>{if(s.mesh.visible)s.mesh.position.set(s.x,.05+Math.abs(Math.sin(t*2+i))*.12,s.z);});
  wren.mesh.position.y=Math.abs(Math.sin(t*3))*.06;gus.mesh.position.y=Math.sin(t*1.5)*.01;
  const wrenEx=S.quest===0||(S.quest===1&&Object.keys(S.shells).length===3);wren.excl.visible=wrenEx;wren.excl.position.set(wren.x,1.05+Math.sin(t*3)*.06,wren.z);
  gus.excl.visible=!S.metGus;gus.excl.position.set(gus.x,1.85+Math.sin(t*3)*.06,gus.z);
  if(motes.parent){for(let i=0;i<MOTES;i++){const s=moteSeed[i];let x=((s[0]+Math.sin(t*.3+s[3])*1.2-camTarget.x)%26+39)%26-13+camTarget.x;let z=((s[2]-camTarget.z)%18+27)%18-9+camTarget.z;
    motePos[i*3]=x;motePos[i*3+1]=s[1]+Math.sin(t*.7+s[3])*.4;motePos[i*3+2]=z;}moteGeo.attributes.position.needsUpdate=true;}
  trees.forEach(tr=>{const ax=tr.x-player.x,az=tr.z-player.z,cy=Math.cos(yaw),sy=Math.sin(yaw);const dz=ax*sy+az*cy,dx=Math.abs(ax*cy-az*sy);const f=running&&dz>.2&&dz<5.5&&dx<2.2;if(f!==tr.fade){tr.fade=f;tr.m.material=f?tr.v.f:tr.v.m;tr.m.castShadow=!f;}});
  const fd=post.uniforms.fade;fd.value+=(fadeTarget-fd.value)*Math.min(1,dt*2);
  if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0){ui.toast.style.opacity=0;setTimeout(()=>{if(toastTimer<=0)ui.toast.hidden=true;},420);}}
  for(let i=pops.length-1;i>=0;i--){const p=pops[i];p.t+=dt;p.p.y+=dt*.8;tmpV.copy(p.p);if(MIR)tmpV.x=-tmpV.x;tmpV.project(camera);const r=stage.getBoundingClientRect();
    p.el.style.left=((tmpV.x+1)/2*r.width)+'px';p.el.style.top=((1-tmpV.y)/2*r.height)+'px';p.el.style.opacity=String(clamp(1.6-p.t,0,1));if(p.t>1.6){p.el.remove();pops.splice(i,1);}}}
let last=performance.now();
let errShown=0,transitT=0;
function reportErr(where,e){try{console.error(where,e);}catch(_){}const n=performance.now();if(n-errShown>8000){errShown=n;toast('The quokka went for a quick smoko \u2615 \u00b7 \u2630 \u2192 Unstuck if Kip can\u2019t move ('+where+': '+(e&&e.message||e)+')',6);}}
function safeRun(where,fn){try{fn();}catch(e){reportErr(where,e);}}
// ---------- engine for a bigger island: freeze still objects, cull far ones, batch small billboards ----------
// Still objects stop recomputing their matrices every frame. A cheap check unfreezes anything the game moves.
// Objects far from the camera are switched off by grid cell. Grass and flower billboards draw as instanced batches.
const ENG={init:false,list:[],snap:new Float64Array(0),bbs:null,cells:new Map(),CELL:32,R:92,cullT:0,yaw:null,batches:[],sus:0,dyn:0,scan:0};
function engSnap(i,o){const s=ENG.snap,k=i*10,p=o.position,q=o.quaternion,c=o.scale;s[k]=p.x;s[k+1]=p.y;s[k+2]=p.z;s[k+3]=q.x;s[k+4]=q.y;s[k+5]=q.z;s[k+6]=q.w;s[k+7]=c.x;s[k+8]=c.y;s[k+9]=c.z;}
function engGrow(n){if(ENG.snap.length>=n*10)return;const a=new Float64Array(Math.max(n*10,ENG.snap.length*2));a.set(ENG.snap);ENG.snap=a;}
function engKeep(o){return o===scene||o.isLight||o.isCamera||(o.parent&&o.parent.isLight)||!o.matrixAutoUpdate||o.__engSkip||DIR4.includes(o)||o===player.mesh||o===player.blob;}
function engRegister(root){const bb=ENG.bbs;root.traverse(o=>{if(engKeep(o)||o.__engId!=null)return;const i=ENG.list.length;engGrow(i+1);ENG.list.push(o);o.__engId=i;engSnap(i,o);o.matrixAutoUpdate=false;o.updateMatrix();});}
function engCellOf(o){if(o.__engBox===undefined){const b=new THREE.Box3().setFromObject(o);if(b.isEmpty()){o.__engBox=null;return null;}const sx=b.max.x-b.min.x,sz=b.max.z-b.min.z;o.__engBox=(sx>ENG.CELL||sz>ENG.CELL)?null:[(b.min.x+b.max.x)/2,(b.min.z+b.max.z)/2];}
  const c=o.__engBox;if(!c)return null;return Math.floor(c[0]/ENG.CELL)+','+Math.floor(c[1]/ENG.CELL);}
function engAddCell(o){const k=engCellOf(o);if(!k)return;let c=ENG.cells.get(k);if(!c){const [a,b]=k.split(',').map(Number);c={x:(a+.5)*ENG.CELL,z:(b+.5)*ENG.CELL,on:true,objs:[]};ENG.cells.set(k,c);}const d=[];o.traverse(n=>d.push(n));c.objs.push({o,d});}
function engBatch(){const groups=new Map();
  BB.forEach(m=>{if(!m.isMesh||m.parent!==scene||m.userData.frames||!DECOR_MATS.has(m.material)||!m.geometry||m.geometry.type!=='PlaneGeometry'||!m.visible)return;const k=m.material.uuid+(m.castShadow?'s':'');let g=groups.get(k);if(!g){g=[];groups.set(k,g);}g.push(m);});
  const drop=new Set();
  groups.forEach(ms=>{if(ms.length<8)return;const cells=new Map(),BC=ENG.CELL*1.5;ms.forEach(m=>{const k=Math.floor(m.position.x/BC)+','+Math.floor(m.position.z/BC);let a=cells.get(k);if(!a){a=[];cells.set(k,a);}a.push(m);});
    cells.forEach(a=>{if(a.length<6)return;const g0=a[0].geometry.parameters,geo=new THREE.PlaneGeometry(g0.width,g0.height);geo.translate(0,g0.height/2,0);
      const im=new THREE.InstancedMesh(geo,a[0].material,a.length);im.castShadow=a[0].castShadow;im.receiveShadow=a[0].receiveShadow;if(a[0].customDepthMaterial)im.customDepthMaterial=a[0].customDepthMaterial;
      im.__engSkip=true;im.__items=a.map(m=>{const p=m.geometry.parameters;return[m.position.x,m.position.y,m.position.z,m.scale.x*p.width/g0.width,m.scale.y*p.height/g0.height,m.scale.z];});
      scene.add(im);ENG.batches.push(im);a.forEach(m=>{drop.add(m);scene.remove(m);m.geometry.dispose();});
      let sx=0,sz=0;a.forEach(m=>{sx+=m.position.x;sz+=m.position.z;});sx/=a.length;sz/=a.length;im.__engBox=[sx,sz];let rr=0;a.forEach(m=>{rr=Math.max(rr,Math.hypot(m.position.x-sx,m.position.z-sz));});geo.boundingSphere=new THREE.Sphere(new THREE.Vector3(sx,g0.height,sz),rr+2*Math.max(g0.width,g0.height)+1);});});
  if(drop.size)for(let i=BB.length-1;i>=0;i--)if(drop.has(BB[i]))BB.splice(i,1);
  engBatchYaw(yaw);}
const _eM=new THREE.Matrix4(),_eQ=new THREE.Quaternion(),_eP=new THREE.Vector3(),_eS=new THREE.Vector3(),_eY=new THREE.Vector3(0,1,0);
function engBatchYaw(y){_eQ.setFromAxisAngle(_eY,y);for(const im of ENG.batches){const it=im.__items;for(let i=0;i<it.length;i++){const v=it[i];_eP.set(v[0],v[1],v[2]);_eS.set(v[3],v[4],v[5]);_eM.compose(_eP,_eQ,_eS);im.setMatrixAt(i,_eM);}im.instanceMatrix.needsUpdate=true;}}
function engInit(){ENG.init=true;
  // the scene itself only recomputes when it is mirrored for the island (scale.x flips)
  scene.matrixAutoUpdate=false;scene.updateMatrix();const sm=new Float64Array(10);
  scene.updateMatrixWorld=function(force){const p=this.position,q=this.quaternion,c=this.scale;if(p.x!==sm[0]||p.y!==sm[1]||p.z!==sm[2]||q.x!==sm[3]||q.y!==sm[4]||q.z!==sm[5]||q.w!==sm[6]||c.x!==sm[7]||c.y!==sm[8]||c.z!==sm[9]){sm.set([p.x,p.y,p.z,q.x,q.y,q.z,q.w,c.x,c.y,c.z]);this.updateMatrix();}THREE.Object3D.prototype.updateMatrixWorld.call(this,force);};
  try{engBatch();}catch(e){console.warn('batch',e);}
  ENG.bbs=new Set(BB);engRegister(scene);scene.children.forEach(o=>{if(o.__engId!=null||o.__engSkip)engAddCell(o);});ENG.yaw=yaw;}
function engTick(dt){if(!ENG.init)engInit();if(ENG.sus)return;
  // billboards turn with the camera: batches update their instances, single billboards refresh their frozen matrix
  if(ENG.yaw!==yaw){ENG.yaw=yaw;engBatchYaw(yaw);}
  const L=ENG.list,s=ENG.snap,bbs=ENG.bbs;
  for(let i=0;i<L.length;i++){const o=L[i];if(o===null)continue;const p=o.position,q=o.quaternion,c=o.scale,k=i*10;
    if(p.x!==s[k]||p.y!==s[k+1]||p.z!==s[k+2]||c.x!==s[k+7]||c.y!==s[k+8]||c.z!==s[k+9]){o.matrixAutoUpdate=true;o.updateMatrix();L[i]=null;ENG.dyn++;o.__engDyn=true;engShow(o);continue;}
    if(q.x!==s[k+3]||q.y!==s[k+4]||q.z!==s[k+5]||q.w!==s[k+6]){if(bbs.has(o)){o.updateMatrix();s[k+3]=q.x;s[k+4]=q.y;s[k+5]=q.z;s[k+6]=q.w;}else{o.matrixAutoUpdate=true;o.updateMatrix();L[i]=null;ENG.dyn++;o.__engDyn=true;engShow(o);}}}
  // pick up objects the game adds later (branches, props, upgrades)
  ENG.scan-=dt;if(ENG.scan<=0){ENG.scan=4;const n0=ENG.list.length;scene.children.forEach(o=>{if(o.__engId==null&&!engKeep(o)){engRegister(o);if(o.__engId!=null)engAddCell(o);}});if(ENG.list.length!==n0)ENG.bbs=new Set(BB);}
  ENG.cullT-=dt;if(ENG.cullT<=0){ENG.cullT=.2;engCull();}}
function engShow(o){o.traverse(n=>n.layers.enable(0));}
function engCull(){const cx=camTarget.x,cz=camTarget.z,R=ENG.R*Math.max(1,zm||1),r2=R*R,h=ENG.CELL*.71;
  ENG.cells.forEach(c=>{const dx=c.x-cx,dz=c.z-cz,d=Math.max(0,Math.hypot(dx,dz)-h);const on=d*d<r2;if(on===c.on)return;c.on=on;
    for(const e of c.objs){if(e.o.__engDyn)continue;for(const n of e.d){if(on)n.layers.enable(0);else n.layers.disable(0);}}});}
// map snapshots render the whole zone from above: switch everything on and let the frame matrices follow while they render
function engSuspend(){if(!ENG.init)return;ENG.sus++;ENG.cells.forEach(c=>{c.on=true;for(const e of c.objs)for(const n of e.d)n.layers.enable(0);});ENG.list.forEach(o=>{if(o)o.matrixAutoUpdate=true;});}
function engResume(){if(!ENG.init||!ENG.sus)return;ENG.sus--;if(ENG.sus)return;ENG.list.forEach((o,i)=>{if(!o)return;o.updateMatrix();o.matrixAutoUpdate=false;engSnap(i,o);});ENG.cullT=0;}
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
  if(transit&&!RIDE&&fadeTarget<.5){transitT+=dt;if(transitT>6){transit=false;transitT=0;}}else transitT=0;
  if(running&&!overlay&&!PORTRAIT_LOCK)safeRun('update',()=>update(dt));
  safeRun('world',()=>{applyTime();updateWilds(dt,t);if(!overlay||overlay==='title')updateWalkers(dt);});
  if(!running||overlay){player.mesh.position.set(player.x,groundY(player.x,player.z),player.z);player.blob.position.set(player.x,.03+groundY(player.x,player.z),player.z);}
  safeRun('ambient',()=>ambient(dt,t));safeRun('camera',()=>updateCamera(dt));safeRun('hud',()=>{updateHud();updateQuestUI(dt,t);updateTrackBar(dt);updateActButton();});
  safeRun('engine',()=>engTick(dt));try{renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(postScene,postCam);captureThumb();}catch(e){reportErr('render',e);}}
updateCamera(0,true);
function flipIslandSigns(){const v=new THREE.Vector3();scene.updateMatrixWorld();const mx=scene.scale.x<0?-1:1;scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.map)return;const t=o.material.map;if(FLIPPED.has(t)||!(SIGN_TEX.has(t)||t===signTex))return;o.getWorldPosition(v);if(v.x*mx>100)return;FLIPPED.add(t);t.repeat.x=-1;t.offset.x=1;});}
flipIslandSigns();
requestAnimationFrame(loop);

// keep progress across live updates of the page
const hot=window.claude&&window.claude.hot;
if(hot&&hot.snapshot)hot.snapshot(()=>({S,running,px:player.x,pz:player.z}));
if(hot&&hot.data&&hot.data.S&&hot.data.running){startGame(hot.data.S);player.x=hot.data.px;player.z=hot.data.pz;S.time=hot.data.S.time||420;S.closed=hot.data.S.closed;S.served=hot.data.S.served||0;S.earned=hot.data.S.earned||0;dlgQ=[];ui.dlg.hidden=true;updateCamera(0,true);}
})();
