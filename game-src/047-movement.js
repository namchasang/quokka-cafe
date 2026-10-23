// ---------- movement ----------
function groundY(x,z){if(x>286.9&&x<289.1&&z>-19&&z<-14.6)return .11;if(x>149.4&&x<150.6&&z>-9.4&&z<-3.8)return .11;if(x>DECK.x1&&x<DECK.x2&&z>DECK.z1&&z<DECK.z2)return .16;if(x>JETTY.x1&&x<JETTY.x2+.4&&z>JETTY.z1&&z<JETTY.z2)return .11;return 0;}
function blocked(x,z){const r=.28;const inLand=x>470?vpWalk(x,z):x>380?hiWalk(x,z):x>250?freoWalk(x,z):x>100?(((x>114&&x<169&&z>-3.7&&z<23.6)||(x>=169&&x<199&&z>10.6&&z<24.2))||(x>101&&x<=114&&z>-3.7&&z<12)||(x>=169&&x<199&&z>-3.7&&z<=10.6)||(x>149.45&&x<150.55&&z>-9.1&&z<=-3.6)||(x>185.45&&x<186.55&&z>-9.1&&z<=-3.6)):landD(x,z)>.45;const inJ=x>JETTY.x1&&x<=JETTY.x2+.5&&z>JETTY.z1+.05&&z<JETTY.z2-.05;if(!inLand&&!inJ)return true;
  for(const b of colliders)if(x>b.x1-r&&x<b.x2+r&&z>b.z1-r&&z<b.z2+r)return true;
  if(S.wish.room&&x>HUT.x-1.8&&x<HUT.x+1.8&&z>HUT.z-1.6&&z<HUT.z+1.6)return true;return false;}
function updatePlayer(dt){let mx=0,mz=0;
  if(keys.has('a')||keys.has('arrowleft'))mx-=1;if(keys.has('d')||keys.has('arrowright'))mx+=1;if(keys.has('w')||keys.has('arrowup'))mz-=1;if(keys.has('s')||keys.has('arrowdown'))mz+=1;
  if(joyId!==null){mx+=joyV.x;mz+=joyV.y;}
  if(MIR)mx=-mx;
  let m=Math.hypot(mx,mz);if(m>1){mx/=m;mz/=m;m=1;}
  if(player.brewing>0){player.brewing-=dt;m=0;if(player.brewing<=0){player.brewing=0;player.carry=player.brewKey;popText(ITEMS[player.brewKey].name+' ready',{x:player.x,y:1.9,z:player.z});}}
  if(player.lying){if(m>.3)getUp();else{m=0;mx=0;mz=0;player.zzT=(player.zzT||0)-dt;if(player.zzT<=0){player.zzT=1.3;popText('z',{x:BEACH.x+.3,y:1.6,z:BEACH.z},'sad');}}}
  player.moving=m>.08;
  if(player.moving){const sp=(player.bike?(S.ownBike==='ebike'?9.2:6.8):3.4)*(S.refreshed?1.2:1)*dt;const cy=Math.cos(yaw),sy=Math.sin(yaw);const wx=mx*cy+mz*sy,wz=-mx*sy+mz*cy;const nx=player.x+wx*sp,nz=player.z+wz*sp;const stuck=blocked(player.x,player.z);if(stuck||!blocked(nx,player.z))player.x=nx;if(stuck||!blocked(player.x,nz))player.z=nz;if(Math.abs(mx)>.1)player.face=mx>0?1:-1;player.walkT+=dt*m;}
  const gy=groundY(player.x,player.z);
  player.mesh.visible=!player.bike&&!player.lying;player.lieMesh.visible=!!player.lying;if(player.lying)player.lieMesh.position.set(BEACH.x,.42,BEACH.z+.08);if(juiceMesh)juiceMesh.scale.y=S.juice===false?.1:1;player.bikeMesh.visible=!!player.bike;if(player.bike){player.bikeMesh.position.set(player.x,gy+(player.moving?Math.abs(Math.sin(player.walkT*16))*.03:0),player.z);player.bikeMesh.scale.x=player.face;}
  setFrame(player.mesh,player.moving?1+(Math.floor(player.walkT/.14)%2):0);
  player.mesh.position.set(player.x,gy+(player.moving?Math.abs(Math.sin(player.walkT*12))*.07:Math.sin(performance.now()/400)*.012),player.z);player.mesh.scale.x=player.face;
  player.blob.position.set(player.x,gy+.03,player.z);
  Object.keys(carryIcons).forEach(k=>{const ic=carryIcons[k];ic.visible=player.carry===k;if(ic.visible)ic.position.set(player.x,gy+1.3+Math.sin(performance.now()/250)*.04,player.z+.05);});}
function updateWilds(dt,t){wilds.forEach(q=>{q.wait-=dt;let moving=false;
  if(q.wait<=0){if(stepWalker(q,q.tx,q.tz,1.3,dt)){q.wait=1.5+Math.random()*3.5;let tx,tz,n=0;do{tx=q.hx+(Math.random()-.5)*7;tz=q.hz+(Math.random()-.5)*5;n++;}while(blocked(tx,tz)&&n<10);if(!blocked(tx,tz)){q.tx=tx;q.tz=tz;}}else moving=true;}
  q.hop+=dt;const gy=groundY(q.x,q.z);const hopY=q.hop<.6?Math.abs(Math.sin(q.hop*Math.PI/.3))*.25:0;
  setFrame(q.mesh,moving?1+(Math.floor(q.walkT/.16)%2):0);q.mesh.position.set(q.x,gy+hopY+(moving?Math.abs(Math.sin(q.walkT*11))*.06:0),q.z);q.mesh.scale.x=q.face;q.blob.position.set(q.x,gy+.03,q.z);});}

// ---------- time of day ----------
const C_MORN=new THREE.Color(1,.84,.64),C_NOON=new THREE.Color(1,.97,.9),C_EVE=new THREE.Color(1,.6,.42);
const T_MORN=new THREE.Vector3(1.05,.98,.9),T_NOON=new THREE.Vector3(1,1,1),T_EVE=new THREE.Vector3(1.1,.86,.78);
const tmpC=new THREE.Color();
const KEYS=[[0,[.35,.42,.78],.3,[.5,.58,.96],.24],[5,[.35,.42,.78],.3,[.5,.58,.96],.24],[6.2,[1,.62,.5],.6,[1.06,.88,.84],.42],[7,[1,.84,.64],.95,[1.05,.98,.9],.6],[11,[1,.97,.9],1.15,[1,1,1],.62],[17,[1,.95,.86],1.1,[1.02,.99,.96],.6],[18.8,[1,.6,.42],.9,[1.1,.86,.78],.5],[19.8,[.42,.48,.85],.42,[.62,.68,1],.3],[22,[.35,.42,.78],.34,[.55,.62,.98],.26],[24,[.35,.42,.78],.3,[.5,.58,.96],.24]];
const NIGHT_FOG=new THREE.Color('#0e1a34');
function applyTime(){const h=clamp(S.time/60,0,24);let i=0;while(i<KEYS.length-2&&h>KEYS[i+1][0])i++;const A=KEYS[i],B=KEYS[i+1];const k=clamp((h-A[0])/(B[0]-A[0]),0,1);
  sun.color.setRGB(lerp(A[1][0],B[1][0],k),lerp(A[1][1],B[1][1],k),lerp(A[1][2],B[1][2],k));sun.intensity=lerp(A[2],B[2],k)*wxC.sun;hemi.intensity=lerp(A[4],B[4],k)*(.8+.2*wxC.sun);
  const tv=new THREE.Vector3(lerp(A[3][0],B[3][0],k),lerp(A[3][1],B[3][1],k),lerp(A[3][2],B[3][2],k));tv.x*=lerp(1,.84,wxC.rain);tv.y*=lerp(1,.9,wxC.rain);tv.multiplyScalar(lerp(1,.93,wxC.cloud));post.uniforms.tint.value.copy(tv);
  const t=clamp((h-7)/12,0,1),ang=lerp(.9,-.9,t);sun.position.set(player.x+Math.sin(ang)*10,13-Math.abs(t-.5)*6,player.z+9);sun.target.position.set(player.x,0,player.z);
  const glow=clamp((h-17)/2,0,1);bulbs.forEach(b=>b.material.color.setRGB(1,lerp(.86,.8,glow),lerp(.6,.45,glow)));}

// ---------- day flow ----------
function update(dt){if(RIDE){rideTick(dt);}
  storyTick(dt);sqTick(dt);spTick(dt);if(!dlgOpen()&&!VISIT){const gm=STUDIO?0:dt*2*(player.lying?5:1);S.time+=gm;stamTick(gm);branchIncomeTick(gm);if(S.time>=1440)newDay();}
  if(phase()==='cafe'&&S.closed&&S.openedDay!==S.day){S.closed=false;S.openedDay=S.day;spawnT=2.5;staff.forEach(st=>{st.job=null;st.state='idle';st.c=null;st.x=st.home[0];st.z=st.home[1];staffIcon(st,null);});toast('7:00 \u00b7 Quokka Cafe is open! The first ferry is on its way.',3);evRoll();setTimeout(evAnnounce,600);}
  if(phase()==='cafe'){FERRY_ARR.forEach((a,i)=>{if(S.time>=a&&!S.waves[i]){S.waves[i]=1;const fam=i===0&&S.familyNext?S.familyNext*3:0;if(fam){S.familyNext=0;toast('Your room guests are back with their whole family!',3);for(let k=0;k<fam;k++)arrivals.push(20+k*2.4);}const fe0=festToday();const n=Math.round((3+(Math.random()*3|0)-(S.wx===2?1:0))*JMULT[S.jetty||0]*(evToday('crowd')?1.8:1)*(fe0&&fe0.id==='swim'?2:fe0&&fe0.where==='island'?1.3:1)*(cafeLv()>=4?1.2:1));for(let k=0;k<n;k++)arrivals.push(k*3.2);popText('Ferry in!',{x:-18,y:2.2,z:5.4});bizWave(n);}});
    if((S.jetty||0)>=4&&S.time>=600&&!S.waves.ship){S.waves.ship=1;for(let k=0;k<12;k++)arrivals.push(4+k*2.2);bizWave(12);toast('The Spirit of Wadjemup has docked! A big crowd is coming.'+(S.pc&&S.pc.ship?'':' \u{1F4F7} Snap it from Main Jetty for a postcard!'),4);}
    for(let k=arrivals.length-1;k>=0;k--){arrivals[k]-=dt;if(arrivals[k]<=0){arrivals.splice(k,1);if(customers.filter(c=>c.state!=='leave').length<SEATS.filter(q=>(q.lvl||1)<=cafeLv()).length&&SEATS.some(q=>!q.busy&&(q.lvl||1)<=cafeLv()))spawnCustomer();else if(S.time<CLOSE-15)arrivals.push(4);}}}
  else if(!S.closed){S.closed=true;evClose();customers.forEach(c=>{if(c.state==='wait'||c.state==='arrive'){if(c.state==='wait')popText('café closed!',{x:c.x,y:2,z:c.z},'sad');leave(c);}});player.carry=null;
    toast(S.time<CLOSE?'Showers today, so the café stays closed. Tend the garden or explore!':'16:00 · Café closed. Time to explore Rottnest!',3.4);if(S.quest<2)SHELLS.forEach((s,i)=>s.mesh.visible=S.quest===1&&!S.shells[i]);
    if(!S.afterNoonTalk&&S.day===1){S.afterNoonTalk=true;say(['Kip: Phew, the café\u2019s closed for the day! Let’s see what Wadjemup is hiding.','Kip: Glowing stones, a lighthouse to the east… and was that a fairy-wren waving at me?']);}}
  if(!dlgOpen()&&!transit){updatePlayer(dt);if(player.bike&&!VISIT&&player.x>DECK.x1-.3&&player.x<DECK.x2+.3&&player.z>DECK.z1-.3&&player.z<DECK.z2+.3){player.bike=false;toast('\u{1F6B2} No bikes on the caf\u00e9 deck. Use the bike lane out front!',2.6);}updateCustomers(dt);updateStaff(dt,performance.now()/1000);updateRiders(dt);}
}
function shellVis(){SHELLS.forEach((s,i)=>s.mesh.visible=phase()==='explore'&&S.quest===1&&!S.shells[i]);}
function endDay(){running=false;customers.slice().forEach(removeCustomer);player.carry=null;
  $('#dayEyebrow').textContent='Good night, Kip';$('#dayTitle').textContent='Day '+S.day+' \u00b7 time for bed';
  const lore=Object.keys(S.lore).length;
  $('#dayStats').innerHTML='<span>Tourists served</span><span>'+S.served+'</span><span>Coins earned today</span><span>'+S.earned+'</span><span>Business tills today</span><span>'+(S.bizToday||0)+'</span><span>Home rent tonight</span><span>'+propRent()+'</span><span>Coins saved</span><span>'+S.coins+'</span><span>Lore stones found</span><span>'+lore+' / 3</span>';
  const nx=WISH.find(w=>!S.wish[w.id]);$('#dayNext').textContent=nx?('Next on the wishlist: '+nx.name+' ('+nx.price+' coins).'):'Everything on the wishlist is bought.';
  save();showOverlay('day');}
function sleep(){if(S.time>=OPEN)newDay();S.time=OPEN-1;S.closed=true;customers.slice().forEach(removeCustomer);player.lying=false;staff.forEach(st=>{st.job=null;st.state='idle';st.c=null;st.x=st.home[0];st.z=st.home[1];staffIcon(st,null);});if(S.wakeSP){S.wakeSP=false;player.x=-13.2;player.z=5;}else{player.x=0;player.z=2.9;}player.bike=false;save();hideOverlays();running=true;
  toast((player.x<-10?'Took the first ferry home from South Perth. ':'')+'Day '+S.day+' · '+WEATHERS[S.wx].label+', '+S.temp+'\u00b0C',3.4);}

