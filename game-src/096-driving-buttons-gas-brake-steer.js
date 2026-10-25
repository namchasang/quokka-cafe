// ---- driving buttons: gas, brake, steer ----
const DRV={l:0,r:0,g:0,b:0};$('ow_drive').querySelectorAll('button').forEach(b=>{const k=b.dataset.k,set=v=>{DRV[k]=v;b.classList.toggle('on',!!v);};b.addEventListener('pointerdown',e=>{e.preventDefault();set(1);b.setPointerCapture(e.pointerId);});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>set(0)));});
// ---------- minimap ----------
const mm=$('ow_mm'),mmx=mm.getContext('2d'),mmBase=document.createElement('canvas');mmBase.width=150;mmBase.height=100;{const b=mmBase.getContext('2d'),id=b.createImageData(150,100);for(let z=0;z<100;z++)for(let x=0;x<150;x++){const i=(z*4)*WX+x*4,k=(z*150+x)*4,l=LAND[i],h=HG[i];const c=l?(h>9?[92,110,72]:[120,150,84]):[34,84,110];id.data.set([c[0],c[1],c[2],255],k);}b.putImageData(id,0,0);
  b.strokeStyle='#e8e0c8';b.lineWidth=1;ROADS.forEach(r=>{b.beginPath();r.p.forEach((p,i)=>i?b.lineTo(p[0]/4,p[1]/4):b.moveTo(p[0]/4,p[1]/4));b.stroke();});TOWNS.forEach(t=>{b.fillStyle='#ffd34d';b.fillRect(t.x/4-1.5,t.z/4-1.5,3,3);});}
function drawMini(px,pz){mmx.drawImage(mmBase,0,0);const x=px/4,z=pz/4,a=ST.yaw;mmx.fillStyle='rgba(120,255,120,.55)';mmx.beginPath();mmx.moveTo(x,z);const fw=-a+Math.PI;mmx.arc(x,z,13,fw-Math.PI/2-.5,fw-Math.PI/2+.5);mmx.closePath();mmx.fill();mmx.fillStyle='#fff';mmx.fillRect(x-1,z-1,3,3);}
// ---------- loop ----------
function resize(){const w=innerWidth,h=innerHeight;renderer.setPixelRatio(PIX*Math.min(devicePixelRatio,2));renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
addEventListener('resize',()=>{if(OPEN)resize();});
let last=performance.now(),T=0,trainS=0;const camP=new THREE.Vector3(),camL=new THREE.Vector3();let camInit=false;
function frame(now){if(!OPEN)return;const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  let ix=0,iz=0;if(keys.arrowleft||keys.a)ix--;if(keys.arrowright||keys.d)ix++;if(keys.arrowup||keys.w)iz--;if(keys.arrowdown||keys.s)iz++;if(stick&&!stick.cam){ix+=stick.dx;iz+=stick.dy;}
  ST.yaw+=(ST.yawT-ST.yaw)*Math.min(1,dt*(ST.inCar?3:6));
  if(ST.ride){ST.ride.t+=dt/5;const u=Math.min(1,ST.ride.t),e=u*u*(3-2*u);ST.x=ST.ride.ax+(ST.ride.bx-ST.ride.ax)*e;ST.z=ST.ride.az+(ST.ride.bz-ST.ride.az)*e;boat.position.set(ST.x,0,ST.z);if(u>=1)ST.ride=null;}
  else if(ST.inCar){const road=onRoad(ST.carX,ST.carZ,2.4),vmax=road?20:13,gas=DRV.g||keys.arrowup||keys.w,brk=DRV.b||keys.arrowdown||keys.s,thr=gas?1:brk?(ST.speed>.5?-2:-1):0,steer=(DRV.r||keys.arrowright||keys.d?1:0)-(DRV.l||keys.arrowleft||keys.a?1:0);
    if(thr>0)ST.speed+=(vmax-ST.speed)*Math.min(1,dt*1.2);else if(thr===-2)ST.speed=Math.max(0,ST.speed-dt*26);else if(thr===-1)ST.speed+=(-5-ST.speed)*Math.min(1,dt*1.5);else ST.speed+=(0-ST.speed)*Math.min(1,dt*.7);
    if(Math.abs(ST.speed)>.4)ST.carA-=steer*dt*1.8*Math.sign(ST.speed)*Math.min(1,Math.abs(ST.speed)/6);
    ST.yawT=ST.carA+Math.PI;ST.yaw=ST.yawT+Math.atan2(Math.sin(ST.yaw-ST.yawT),Math.cos(ST.yaw-ST.yawT));
    const nx=ST.carX+Math.sin(ST.carA)*ST.speed*dt,nz=ST.carZ+Math.cos(ST.carA)*ST.speed*dt;if(canGo(nx,nz)){ST.carX=nx;ST.carZ=nz;}else if(canGo(nx,ST.carZ)){ST.carX=nx;ST.speed*=.7;}else if(canGo(ST.carX,nz)){ST.carZ=nz;ST.speed*=.7;}else ST.speed=0;
    ST.x=ST.carX;ST.z=ST.carZ;}
  else{const l=Math.hypot(ix,iz);if(l>.1){const s=Math.min(1,l)*8*dt,c=Math.cos(ST.yaw),sn=Math.sin(ST.yaw);const dx=(ix*c+iz*sn)/l*s,dz=(-ix*sn+iz*c)/l*s;const nx=ST.x+dx,nz=ST.z+dz;
      if(canGo(nx,nz)){ST.x=nx;ST.z=nz;}else if(canGo(nx,ST.z))ST.x=nx;else if(canGo(ST.x,nz))ST.z=nz;ST.step+=dt*6;}}
  // place the car and Kip
  const cy=groundAt(ST.carX,ST.carZ);car.position.set(ST.carX,cy,ST.carZ);car.rotation.y=ST.carA;
  kip.visible=!ST.inCar;shadow.visible=!ST.inCar;const ky=ST.ride?1.2:groundAt(ST.x,ST.z);kip.position.set(ST.x,ky,ST.z);shadow.position.set(ST.x,ky+.05,ST.z);
  const fr=(ST.step|0)%2;if(kipT.image!==kipFrames[fr]){kipT.image=kipFrames[fr];kipT.needsUpdate=true;}
  // camera: behind and above, like an old overworld
  const PZ=cam.aspect<1?1.3:1,dist=(ST.inCar?15:20)*ZOOM*PZ,hgt=(ST.inCar?7.5:14)*ZOOM*PZ;const tx=ST.x,tz=ST.z,ty=ky+1.5;
  camP.set(tx+Math.sin(ST.yaw)*dist,Math.max(ty+hgt,H(tx+Math.sin(ST.yaw)*dist,tz+Math.cos(ST.yaw)*dist)+4),tz+Math.cos(ST.yaw)*dist);camL.set(tx,ty,tz);
  if(!camInit){cam.position.copy(camP);camInit=true;}else cam.position.lerp(camP,Math.min(1,dt*4));cam.lookAt(camL);
  sun.position.set(tx-SUNO.x*90,SUNO.y*90,tz-SUNO.z*90);sun.target.position.set(tx,0,tz);
  // the world moves
  wT.offset.x=T*.01;wT.offset.y=T*.006;trainS+=dt*14;tcars.forEach((c,k)=>{const p=railAt(trainS-k*6.6);c.position.set(p.x,deckH(p.x,p.z)+.1,p.z);c.rotation.y=p.a;});
  sails.forEach(s=>{const a=T*s.sp+s.ph;s.g.position.set(s.cx+Math.cos(a)*s.rx,.1,s.cz+Math.sin(a)*s.rz);s.g.rotation.y=-a;});
  
  if(L2&&L2.clouds)L2.clouds.forEach(c=>{c.position.x+=dt*1.4;if(c.position.x>WX*1.25)c.position.x=-WX*.25;});
  TOWNS.forEach(t=>{t.rg.material.opacity=.45+Math.sin(T*3)*.25;t.rg.rotation.z=T*.5;});DRAWS.forEach(d=>{if(d.s.visible){d.s.position.y=d.y+Math.sin(T*4+d.x)*.25;d.s.material.opacity=.6+Math.sin(T*8+d.z)*.35;}});
  // HUD
  const n=near();const bA=$('ow_bAct');if(n){bA.disabled=false;bA.textContent=n.type==='town'?'Enter '+n.t.name:n.type==='rott'?'Ferry to Rottnest':n.type==='ferry'?'Take the ferry':'Pick it up';$('ow_pName').textContent=n.type==='town'?n.t.name:n.type==='rott'?'B-Shed ferry':n.type==='ferry'?'Ferry jetty':'Something sparkles';$('ow_pNote').textContent=n.type==='town'?n.t.note:n.type==='rott'?'Sail to Rottnest Island · Thomson Bay':n.type==='ferry'?'Mends St ⇄ Barrack St':'A draw point';}
  else{bA.textContent='—';bA.disabled=true;const r=ROADS.find(r=>r.p.some((a,i)=>i&&segDist(ST.x,ST.z,r.p[i-1],a)<2.6));$('ow_pName').textContent=r?r.n:landAt(ST.x,ST.z)?(elevAt(ST.x,ST.z)>38?'Hills':Math.hypot(ST.x-KPP[0],ST.z-KPP[1])<20?'Kings Park':'Swan River country'):'Swan River';$('ow_pNote').textContent=ST.inCar?'Driving the little retro car':'Walk or drive · towns glow gold';}
  $('ow_bCar').textContent=ST.inCar?'Get out':'Get in car';if($('ow_drive').hidden===ST.inCar){$('ow_drive').hidden=!ST.inCar;$('ow_help').hidden=ST.inCar;}
  drawMini(ST.x,ST.z);renderer.render(scene,cam);requestAnimationFrame(frame);}
ST.yaw=ST.yawT=Math.PI/4;ST.carA=Math.PI;window.__ST=ST;{const [jx,jz]=[JET[1].x,JET[1].z];ST.x=jx+3;ST.z=jz+5;const R2=ROADS[2].p;let b=R2[2];ST.carX=b[0];ST.carZ=b[1];ST.x=b[0]+2.5;ST.z=b[1]+1.5;}
L2objects();sortLayers();LAYERS.forEach(([id,n,c],i)=>{const l=document.createElement('label');l.innerHTML=`<input type="checkbox" checked id="ly${i}"><i style="background:${c}"></i><span>${i+1}. ${n}</span><small>${LCOUNT[i]}</small>`;$('ow_laylist').appendChild(l);l.querySelector('input').onchange=e=>{layOn[i]=e.target.checked;applyLayers();};});applyLayers();

