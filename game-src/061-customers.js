// ---------- customers ----------
function spawnCustomer(){const free=SEATS.filter(s=>!s.busy&&(s.lvl||1)<=cafeLv());if(!free.length)return;const seat=pick(free);seat.busy=true;
  const v={skin:pick(SKINS),hair:pick(HAIRS),shirt:pick(SHIRTS),pants:pick(PANTS),hat:pick(HATS)};
  let keysI=Object.keys(ITEMS).filter(k=>!ITEMS[k].lock||(S.menu&&S.menu[k]));const okI=keysI.filter(canMake);if(okI.length&&Math.random()<.85)keysI=okI;let order=keysI[Math.random()*keysI.length|0];if(evToday('heat')&&keysI.includes('smo')&&Math.random()<.6)order='smo';
  const c={...IW(-21,5),seat,order,state:'arrive',path:[[IWx(-12.6,5),IWz(-12.6,5)],[IWx(-6,3),IWz(-6,3)],[seat.x,seat.z]],patience:44,max:44,walkT:0,face:1};if(evToday('critic')&&!S.ev.criticDone&&!S.ev.criticIn&&S.time>=540){S.ev.criticIn=1;c.critic=true;c.patience=c.max=36;v.hat='#2a1d1a';v.shirt='#f0c86e';setTimeout(()=>toast('\u{1F9D0} The food critic just sat down! Serve them fast.',3.5),800);}
  c.mesh=spriteMesh(humanFrames(v),.95,1.58);scene.add(c.mesh);c.blob=blob(.85);
  c.bubble=new THREE.Group();const b=spriteMesh([bubbleCanvas(ITEM_ICON[order])],.72,.72,{basic:true,shadow:false});BB.splice(BB.indexOf(b),1);c.bubble.add(b);
  const bg=new THREE.Mesh(new THREE.PlaneGeometry(.66,.1),new THREE.MeshBasicMaterial({color:0x1a1f33,fog:false}));bg.position.set(0,-.08,0);c.bubble.add(bg);
  const fg=new THREE.PlaneGeometry(.6,.05);fg.translate(.3,0,0);c.bar=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({color:0x86d06a,fog:false}));c.bar.position.set(-.3,-.08,.01);c.bubble.add(c.bar);
  c.bubble.visible=false;scene.add(c.bubble);BB.push(c.bubble);
  c.heart=spriteMesh([iconCanvas('heart')],.4,.36,{basic:true,shadow:false});c.heart.visible=false;scene.add(c.heart);
  customers.push(c);}
const STAFF_COL=['#e79ab0','#7a5033','#c8344a','#2f6fb0','#d9a02a'],STAFF_HOME=[[-2.4,-1.2],[2.4,-1.2],[-4.2,-1.5],[4.2,-1.5],[0,-.8]];const staff=[];
function syncStaff(){const fam=S.wish.tickets?2:0;const n=(S.staff||0)+fam;if(staff.length&&staff[0].fam!==!!fam)while(staff.length){const st=staff.pop();[st.m,st.b].forEach(o=>scene.remove(o));if(st.icon)scene.remove(st.icon);}while(staff.length>n){const st=staff.pop();[st.m,st.b].forEach(o=>scene.remove(o));if(st.icon)scene.remove(st.icon);}
  while(staff.length<n){const i=staff.length,ci=fam?i:i+2,h=STAFF_HOME[ci];const m=spriteMesh(quokkaFrames(STAFF_COL[ci]),i<fam?1.25:1.1,i<fam?1.25:1.1);scene.add(m);staff.push({m,b:blob(.85),x:h[0],z:h[1],home:h,state:'idle',t:0,c:null,walkT:0,face:1,icon:null,fam:!!fam});}
  staff.forEach((st,i)=>{st.cashier=!!fam&&i===1;if(st.cashier)st.home=[REG.x+.8,REG.z+.35];});}
function dadAtTill(){return phase()==='cafe'&&staff.some(st=>st.cashier&&Math.hypot(st.x-st.home[0],st.z-st.home[1])<.3);}
function staffIcon(st,k){if(st.icon){scene.remove(st.icon);const bi=BB.indexOf(st.icon);if(bi>=0)BB.splice(bi,1);st.icon=null;}if(k){st.icon=spriteMesh([iconCanvas(ITEM_ICON[k])],.45,.45,{basic:true,shadow:false});scene.add(st.icon);}}
function updateStaff(dt,t){const sick=evToday('sick')&&phase()==='cafe';staff.forEach(st=>{let moving=false;const c=st.c;if(sick&&!st.fam){if(!st._off){st._off=1;st.m.visible=false;st.b.visible=false;if(st.icon)st.icon.visible=false;}st.c=null;st.state='idle';st.job=null;return;}if(st._off){st._off=0;st.m.visible=true;st.b.visible=true;}
  if(st.cashier&&phase()==='cafe'){const mv=!stepWalker(st,st.home[0],st.home[1],2.2,dt);const gy=groundY(st.x,st.z);st.m.position.set(st.x,gy,st.z);st.b.position.set(st.x,gy+.03,st.z);setFrame(st.m,mv?1+(Math.floor(st.walkT/.16)%2):0);st.m.scale.x=mv?st.face:-1;return;}
  if(c&&c.state!=='wait'&&st.state!=='idle'){st.c=null;st.state='idle';staffIcon(st,null);}
  if(phase()==='explore'&&st.state==='idle'&&!st.job){const free=S.plots.findIndex((p,i)=>p&&!staff.some(o=>o.job&&o.job.i===i)&&(p.g>=CROPS[p.k].days||!p.w));if(free>=0)st.job={type:'plot',i:free};else{const si=staff.indexOf(st);st.job={type:'fish',...IW(-14.2-si*1.4,si%2?4.8:5.25),t:14+Math.random()*12};}}
  if(st.job&&phase()==='cafe'){st.job=null;}
  if(st.job&&st.state==='idle'){const j=st.job;if(j.type==='plot'){const P=PLOTS[j.i],p=S.plots[j.i];moving=!stepWalker(st,P.x,P.z+1.05,2.4,dt);if(!moving){j.w=(j.w||0)+dt;if(j.w>1.4){if(p){if(p.g>=CROPS[p.k].days){const C=CROPS[p.k];S.inv[p.k]=(S.inv[p.k]||0)+C.yield;S.plots[j.i]=null;popText('+'+C.yield+' '+C.plural,{x:P.x,y:1.5,z:P.z});}else if(!p.w){p.w=true;popText('Watered',{x:P.x,y:1.3,z:P.z});}refreshPlots();save();}st.job=null;}}}
    else{moving=!stepWalker(st,j.x,j.z,2.4,dt);if(!moving){st.face=-1;j.t-=dt;if(!st.rod){st.rod=spriteMesh([pix(["....oooo.o..","..oobbbbooo.","oobwbbbbbbo.",".obbbbbbbo..","..oobbbbooo.","....oooo.o.."],{o:'#1d3a5a',b:'#6fa8d8',w:'#ffffff'})],.42,.22,{basic:true,shadow:false});st.rod.visible=false;scene.add(st.rod);}
      if(j.t<=0){j.t=(16+Math.random()*16)*(S.buffs&&S.buffs.bait>0?.5:1);S.inv.fish=(S.inv.fish||0)+1;save();st.rod.visible=true;st.rodT=1.6;popText('+1 fish',{x:st.x,y:1.6,z:st.z});}}}}
  if(st.rod){st.rodT=(st.rodT||0)-dt;st.rod.visible=st.rodT>0;st.rod.position.set(st.x-.4,1.25+(1.6-st.rodT)*.2,st.z+.05);}
  if(st.state==='idle'&&!st.job){if(phase()==='cafe'){const nc=customers.find(q=>q.state==='wait'&&!q.claimed);if(nc){nc.claimed=st;st.c=nc;st.state='toStation';}}if(st.state==='idle'&&!st.job)moving=!stepWalker(st,st.home[0],st.home[1],2.4,dt);}
  else if(st.state==='toStation'){const stn=STATIONS.find(q=>q.key=== st.c.order),sx=stn.x;moving=!stepWalker(st,sx+(st.home[0]>IWx(0,0)?.35:-.35),stn.z,2.6,dt);if(!moving){if(!canMake(st.c.order)){st.c.claimed=null;st.c=null;st.state='idle';return;}useStock(st.c.order);st.state='brew';st.t=ITEMS[st.c.order].brew*(S.wish.machine?.5:1)+1.8;}}
  else if(st.state==='brew'){st.t-=dt;if(st.t<=0){st.state='deliver';staffIcon(st,st.c.order);}}
  else if(st.state==='deliver'){moving=!stepWalker(st,st.c.x+(st.c.x>IWx(0,0)?-.6:.6),st.c.z+.55,2.6,dt);if(!moving){serve(st.c,st);st.c=null;st.state='idle';staffIcon(st,null);}}
  const gy=groundY(st.x,st.z);setFrame(st.m,moving?1+(Math.floor(st.walkT/.15)%2):0);st.m.position.set(st.x,gy+(moving?Math.abs(Math.sin(st.walkT*12))*.06:0),st.z);st.m.scale.x=st.face;st.b.position.set(st.x,gy+.03,st.z);
  if(st.icon)st.icon.position.set(st.x,gy+1.25+Math.sin(t*4)*.04,st.z+.05);});}
function removeCustomer(c){[c.mesh,c.bubble,c.heart].forEach(m=>{const i=BB.indexOf(m);if(i>=0)BB.splice(i,1);});[c.mesh,c.blob,c.bubble,c.heart].forEach(m=>scene.remove(m));c.seat.busy=false;customers.splice(customers.indexOf(c),1);}
function leave(c,paid){c.state='leave';c.bubble.visible=false;c.path=[[IWx(-6,3),IWz(-6,3)],[IWx(-12.6,5),IWz(-12.6,5)],[IWx(-21,5),IWz(-21,5)]];if(paid&&dadAtTill()){c.path.unshift([REG.x,REG.z+.95]);c.tap=true;}}
function stepWalker(o,tx,tz,speed,dt){const dx=tx-o.x,dz=tz-o.z,d=Math.hypot(dx,dz);if(d<.05)return true;const s=Math.min(d,speed*dt);o.x+=dx/d*s;o.z+=dz/d*s;const sx=dx*Math.cos(yaw)-dz*Math.sin(yaw);if(Math.abs(sx)>.02)o.face=sx>0?1:-1;o.walkT+=dt;return false;}
function updateCustomers(dt){for(const c of customers.slice()){
  if(c.pause>0){c.pause-=dt;setFrame(c.mesh,0);continue;}
  if(c.state==='arrive'||c.state==='leave'){const wp=c.path[0];if(stepWalker(c,wp[0],wp[1],1.8,dt)){if(c.tap&&c.state==='leave'){c.tap=false;c.pause=1;eftFlash=.9;S.coins+=1;S.earned+=1;popText(pick(['*beep* Tap \u2713','PayWave \u2713','Tap & go \u2713','Cheers, mate \u2713'])+' +1',{x:REG.x,y:1.7,z:REG.z});}c.path.shift();if(!c.path.length){if(c.state==='arrive'){c.state='wait';c.bubble.visible=true;}else{removeCustomer(c);continue;}}}setFrame(c.mesh,1+(Math.floor(c.walkT/.18)%2));}
  else if(c.state==='wait'){setFrame(c.mesh,0);c.patience-=dt;const f=clamp(c.patience/c.max,0,1);c.bar.scale.x=Math.max(.001,f);c.bar.material.color.setRGB(lerp(.95,.53,f),lerp(.4,.82,f),lerp(.35,.42,f));
    if(c.patience<=0){popText('left grumpy',{x:c.x,y:2,z:c.z},'sad');leave(c);}}
  else if(c.state==='happy'){setFrame(c.mesh,0);c.happyT-=dt;if(c.happyT<=0){c.heart.visible=false;leave(c,true);}}
  const gy=groundY(c.x,c.z);c.mesh.position.set(c.x,gy+(c.state==='arrive'||c.state==='leave'?Math.abs(Math.sin(c.walkT*11))*.05:0),c.z);c.mesh.scale.x=c.face;c.blob.position.set(c.x,gy+.03,c.z);
  c.bubble.position.set(c.x,gy+2.05,c.z+.05);c.heart.position.set(c.x,gy+1.75+Math.sin(performance.now()/150)*.05,c.z+.05);}}

