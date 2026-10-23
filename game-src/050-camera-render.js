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
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
  if(transit&&!RIDE&&fadeTarget<.5){transitT+=dt;if(transitT>6){transit=false;transitT=0;}}else transitT=0;
  if(running&&!overlay&&!PORTRAIT_LOCK)safeRun('update',()=>update(dt));
  safeRun('world',()=>{applyTime();updateWilds(dt,t);if(!overlay||overlay==='title')updateWalkers(dt);});
  if(!running||overlay){player.mesh.position.set(player.x,groundY(player.x,player.z),player.z);player.blob.position.set(player.x,.03+groundY(player.x,player.z),player.z);}
  safeRun('ambient',()=>ambient(dt,t));safeRun('camera',()=>updateCamera(dt));safeRun('hud',()=>{updateHud();updateQuestUI(dt,t);updateTrackBar(dt);updateActButton();});
  try{renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(postScene,postCam);captureThumb();}catch(e){reportErr('render',e);}}
updateCamera(0,true);
function flipIslandSigns(){const v=new THREE.Vector3();const sx0=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.map)return;const t=o.material.map;if(FLIPPED.has(t)||!(SIGN_TEX.has(t)||t===signTex))return;o.getWorldPosition(v);if(v.x>100)return;FLIPPED.add(t);t.repeat.x=-1;t.offset.x=1;});scene.scale.x=sx0;scene.updateMatrixWorld(true);}
flipIslandSigns();
requestAnimationFrame(loop);

// keep progress across live updates of the page
const hot=window.claude&&window.claude.hot;
if(hot&&hot.snapshot)hot.snapshot(()=>({S,running,px:player.x,pz:player.z}));
if(hot&&hot.data&&hot.data.S&&hot.data.running){startGame(hot.data.S);player.x=hot.data.px;player.z=hot.data.pz;S.time=hot.data.S.time||420;S.closed=hot.data.S.closed;S.served=hot.data.S.served||0;S.earned=hot.data.S.earned||0;dlgQ=[];ui.dlg.hidden=true;updateCamera(0,true);}
})();
