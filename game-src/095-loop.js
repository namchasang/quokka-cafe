// ---------- loop ----------
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
  if(view==='perth')perth(dt);else aus(dt);
  if(flashT>0){flashT-=dt;X.fillStyle='rgba(13,20,40,'+Math.min(.85,flashT)+')';X.fillRect(0,80,W,40);X.fillStyle='#ffd34d';X.font='16px "Pixelify Sans", monospace';X.textAlign='center';X.fillText(flashTxt,W/2,98);X.fillStyle='#f5ecd8';X.font='9px "Pixelify Sans", monospace';X.textAlign='left';}
  if(open)requestAnimationFrame(frame);}
function label(t,x,y,c){X.font='8px "Pixelify Sans", monospace';const w=X.measureText(t).width;X.fillStyle='rgba(13,20,40,.72)';X.fillRect(Math.round(x-w/2-2),Math.round(y-7),Math.ceil(w+4),9);X.fillStyle=c||'#f5ecd8';X.fillText(t,Math.round(x-w/2),Math.round(y));}
function perth(dt){X.drawImage(base,0,0);
  // sparkle on the open sea
  X.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<40;i++){const x=(i*53+((T*6+i*13)|0))%120,y=(i*37)%200;if(!land(x,y)&&((T*2+i)|0)%3===0)X.fillRect(x,y,1,1);}
  // ferry routes: dashed white lines
  X.fillStyle='rgba(245,236,216,.75)';FERRY.forEach(f=>{const n=Math.hypot(f.bx-f.ax,f.by-f.ay)|0;for(let s=0;s<n;s+=3){if(((s+T*6)|0)%6<3)X.fillRect(Math.round(f.ax+(f.bx-f.ax)*s/n),Math.round(f.ay+(f.by-f.ay)*s/n),1,1);}});
  sails.forEach(s=>{s.t+=dt;const q=(s.t%s.T)/s.T,u=q<.5?q*2:2-q*2;X.drawImage(BOAT,Math.round(s.ax+(s.bx-s.ax)*u-3),Math.round(s.ay+(s.by-s.ay)*u-3));});
  // places
  P.forEach(p=>{const ic=IC[p.ic];const bob=Math.round(Math.sin(T*2+p.x)*.6);X.fillStyle='rgba(0,0,0,.25)';X.fillRect(p.x-4,p.y+2,8,2);X.drawImage(ic,Math.round(p.x-ic.width/2),Math.round(p.y-ic.height+2+bob));
    label(p.name,p.x+(p.lx||0),p.y-ic.height-1+(p.ly||0),p.st==='lab'?'#ffb24d':'#f5ecd8');});
  // a plane leaving the airport, gulls over the coast
  {const q=(T%14)/14;X.drawImage(PLANE,Math.round(278+q*60),Math.round(84-q*40));}
  for(let i=0;i<3;i++){const a=T*.7+i*2.1;X.drawImage(GULL[((T*4+i)|0)%2],Math.round(108+Math.cos(a)*14),Math.round(132+Math.sin(a)*6+i*4));}
  // Kip
  if(ride){ride.t+=dt/3.2;const u=Math.min(1,ride.t);kip.x=ride.ax+(ride.bx-ride.ax)*u;kip.y=ride.ay+(ride.by-ride.ay)*u;X.drawImage(BOAT,Math.round(kip.x-3),Math.round(kip.y-1));if(u>=1){ride=null;kip.tx=null;}}
  else{let vx=0,vy=0;if(keys.arrowleft||keys.a)vx--;if(keys.arrowright||keys.d)vx++;if(keys.arrowup||keys.w)vy--;if(keys.arrowdown||keys.s)vy++;
    if(vx||vy){kip.tx=null;kip.path=null;}else{if(kip.tx==null&&kip.path&&kip.path.length){const q=kip.path[0];if(q.ferry!=null){kip.path.shift();const f=FERRY[q.ferry];ride={f,t:0,ax:kip.x,ay:kip.y,bx:q.x,by:q.y-2};}else{kip.tx=q.x;kip.ty=q.y-2;}}}
    if(!(vx||vy)&&kip.tx!=null){const dx=kip.tx-kip.x,dy=kip.ty-kip.y,l=Math.hypot(dx,dy);if(l<1){kip.tx=null;if(kip.path)kip.path.shift();}else{vx=dx/l;vy=dy/l;}}
    if(vx||vy){const l=Math.hypot(vx,vy),sp=((hooks.carSpeed&&hooks.carSpeed())||38)*dt;const nx=kip.x+vx/l*sp,ny=kip.y+vy/l*sp;if(land(nx,ny+2)){kip.x=nx;kip.y=ny;}else if(land(nx,kip.y+2))kip.x=nx;else if(land(kip.x,ny+2))kip.y=ny;else kip.tx=null;kip.step+=dt*8;if(vx)kip.dir=vx>0?1:-1;}}
  X.save();X.translate(Math.round(kip.x),0);X.scale(kip.dir,1);const bounce=ride?0:((kip.step|0)%2);{const cs=(hooks.carSprite&&hooks.carSprite())||CAR[0];X.drawImage(cs,-Math.round(cs.width/2),Math.round(kip.y-cs.height+1));}if(!ride&&(kip.tx!=null||keys.arrowleft||keys.arrowright||keys.arrowup||keys.arrowdown||keys.a||keys.d||keys.w||keys.s)&&((T*10)|0)%2){X.fillStyle='rgba(220,220,220,.7)';X.fillRect(-8,Math.round(kip.y-1),1,1);}X.restore();
  // cloud shadows drift over everything
  clouds.forEach(c=>{c.x+=c.v*dt;if(c.x-c.r>W){c.x=-c.r;c.y=rnd()*H;}X.fillStyle='rgba(10,20,40,.12)';for(let k=0;k<3;k++){X.beginPath();X.ellipse(c.x+k*c.r*.6,c.y+(k%2)*3,c.r*.7,c.r*.38,0,0,7);X.fill();}});
  X.fillStyle='rgba(13,20,40,.7)';X.fillRect(4,4,62,12);X.fillStyle='#ffd34d';X.font='9px "Pixelify Sans", monospace';X.fillText('PERTH  N↑',8,13);
  hud();}
function aus(dt){X.drawImage(abase,0,0);
  CITIES.forEach((c,i)=>{const x=ax(c.lon),y=ay(c.lat);if(i){X.fillStyle='rgba(245,236,216,.6)';const px=ax(115.86),py=ay(-31.95),mx=(px+x)/2,my=Math.min(py,y)-26;for(let s=0;s<=60;s++){if(((s+T*8)|0)%4>1)continue;const t=s/60,u=1-t;X.fillRect(Math.round(u*u*px+2*u*t*mx+t*t*x),Math.round(u*u*py+2*u*t*my+t*t*y),1,1);}}});
  CITIES.forEach((c,i)=>{const x=Math.round(ax(c.lon)),y=Math.round(ay(c.lat));const on=i===sel;X.fillStyle=on?'#ffd34d':'#f5ecd8';X.fillRect(x-2,y-2,5,5);X.fillStyle='#141a2e';X.fillRect(x-1,y-1,3,3);if(on&&(T*3|0)%2){X.strokeStyle='#ffd34d';X.strokeRect(x-4.5,y-4.5,10,10);}
    label(c.name+(c.st==='soon'?' · soon':''),x+(i===2?-4:0),y-7,c.st==='soon'?'#c79bff':'#6fd38a');});
  if(flight){flight.t+=dt/3.5;const t=Math.min(1,flight.t),u=1-t,px=ax(115.86),py=ay(-31.95),x=ax(flight.to.lon),y=ay(flight.to.lat),mx=(px+x)/2,my=Math.min(py,y)-26;
    X.drawImage(PLANE,Math.round(u*u*px+2*u*t*mx+t*t*x-4),Math.round(u*u*py+2*u*t*my+t*t*y-3));if(t>=1){flash(flight.to.name+' · coming in the story');flight=null;}}
  X.fillStyle='rgba(13,20,40,.7)';X.fillRect(4,4,74,12);X.fillStyle='#ffd34d';X.font='9px "Pixelify Sans", monospace';X.fillText('AUSTRALIA',8,13);
  X.fillStyle='rgba(13,20,40,.7)';X.fillRect(4,184,190,12);X.fillStyle='#a9b3cf';X.fillText('←/→ or tap a city · Space to fly',8,193);
  hud();}
return{get open(){return open;},
  start(id,side){const p=P.find(q=>q.id===id)||P[0];view='perth';hooks.el.tabP.setAttribute('aria-pressed','true');hooks.el.tabA.setAttribute('aria-pressed','false');ride=null;flight=null;keys={};kip.tx=null;
    const tryAt=dx=>{for(const dy of[0,-2,2,-4,4]){if(land(p.x+dx,p.y+dy+2))return[p.x+dx,p.y+dy];}return null;};const want=side==='w'?-11:11;const at=tryAt(want)||tryAt(-want)||[p.x,p.y];kip.x=at[0];kip.y=at[1];kip.dir=side==='w'?-1:1;
    open=true;last=performance.now();hud();requestAnimationFrame(frame);},
  stop(){open=false;keys={};},dbg(x,y){return{kip:{...kip,path:null},len:kip.path&&kip.path.length,ride:!!ride,p:x!=null?wmPath(kip.x,kip.y+2,x,y+2):null};}};
}

