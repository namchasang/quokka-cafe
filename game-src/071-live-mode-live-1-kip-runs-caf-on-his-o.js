// ---------- Live mode (?live=1): Kip runs the café on his own for 24/7 YouTube streams ----------
// Open index.html?live=1 (OBS Browser Source, 1920x1080). Options: &st=lofi|crystal (radio station), &vol=0-100.
// Nothing is saved: the stream plays a fresh café that never touches the player's save slots.
// The clock follows Perth time, the café never closes, rain tracks bring rain, the camera drifts between café shots,
// customers keep arriving and Kip takes each order, makes it at the counter and carries it to the table.
const LIVEM=(()=>{if(!LIVE)return null;
  const Q=new URLSearchParams(location.search);const ST=['crystal','beats'].includes(Q.get('st'))?Q.get('st'):'lofi';
  const FREQ={lofi:'92.1',crystal:'96.9',beats:'99.5'};
  const perthMin=()=>{const d=new Date();return (d.getUTCHours()*60+d.getUTCMinutes()+480+d.getUTCSeconds()/60)%1440;};
  // ---- overlay: brand, live badge, now playing, Perth clock ----
  const css=document.createElement('style');css.textContent=`
#liveHud{position:fixed;inset:0;pointer-events:none;z-index:50;font-family:'Pixelify Sans',monospace;color:#faf2e1;text-shadow:0 .15vw .5vw rgba(0,0,0,.55)}
#liveHud .b{position:absolute;left:2.9vw;top:2.3vw;display:flex;align-items:center;gap:.9vw;font-weight:700;font-size:1.8vw;letter-spacing:.06em}
#liveHud .b i{display:block;width:5vw;height:1.25vw;border-radius:.3vw;background:repeating-linear-gradient(90deg,#d9483e 0 1.25vw,#faf2e1 1.25vw 1.9vw)}
#liveHud .l{position:absolute;right:2.9vw;top:2.1vw;display:flex;align-items:center;gap:.6vw;background:rgba(10,14,18,.72);border-radius:.6vw;padding:.5vw .95vw;font-weight:700;font-size:1.35vw;letter-spacing:.1em;text-shadow:none}
#liveHud .l s{display:block;width:.85vw;height:.85vw;border-radius:50%;background:#d9483e;box-shadow:0 0 .6vw #d9483e;animation:lvp 1.6s ease-in-out infinite;text-decoration:none}
@keyframes lvp{50%{opacity:.35}}
#liveHud .n{position:absolute;left:2.9vw;bottom:2.7vw;background:rgba(10,14,18,.74);border-radius:.85vw;padding:.95vw 1.4vw .95vw 1.15vw;display:flex;align-items:center;gap:1.05vw;text-shadow:none}
#liveHud .d{width:3.45vw;height:3.45vw;border-radius:50%;background:radial-gradient(circle,#f2c871 0 .47vw,#1c1c1c .52vw .68vw,#2b2b2b .73vw 1.04vw,#1a1a1a 1.1vw 1.3vw,#2b2b2b 1.35vw 1.72vw);animation:lvs 3.2s linear infinite}
@keyframes lvs{to{transform:rotate(360deg)}}
#liveHud .n small{display:block;font:600 1.05vw/1.2 'M PLUS Rounded 1c',sans-serif;color:#f2c871;letter-spacing:.04em;text-transform:uppercase}
#liveHud .n b{display:block;font-weight:700;font-size:2vw;line-height:1.15;margin-top:.2vw}
#liveHud .c{position:absolute;right:2.9vw;bottom:2.7vw;text-align:right;background:rgba(10,14,18,.74);border-radius:.85vw;padding:.85vw 1.25vw;text-shadow:none}
#liveHud .c b{display:block;font-weight:700;font-size:2.4vw;line-height:1}
#liveHud .c span{display:block;font:500 1.1vw/1.35 'M PLUS Rounded 1c',sans-serif;color:#cfd8d4;margin-top:.3vw}
#liveHud .c em{display:block;font:500 1vw/1.35 'M PLUS Rounded 1c',sans-serif;color:#f2c871;font-style:normal}
#liveGo{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:rgba(8,12,16,.55);border:0;color:#faf2e1;font:700 2.8vw/1.2 'Pixelify Sans',monospace;cursor:pointer}
#liveGo span{display:block;font:500 1.45vw/1.4 'M PLUS Rounded 1c',sans-serif;color:#f2c871;margin-top:.7vw}`;
  document.head.appendChild(css);
  const hud=document.createElement('div');hud.id='liveHud';
  hud.innerHTML='<div class="b"><i></i>QUOKKA CAFE RADIO</div><div class="l"><s></s>LIVE</div><div class="n"><div class="d"></div><div><small id="lvSt">Island Lo-fi</small><b id="lvTr">Tuning in…</b></div></div><div class="c"><b id="lvClock">--:--</b><span id="lvWx">Rottnest Island · Perth time</span><em>Play free · namchasang.github.io/quokka-cafe</em></div>';
  document.body.appendChild(hud);
  const curTrack=()=>{const T=TSTN[RADIO.st];return T&&RADIO.trk!=null&&RADIO.trkSt===RADIO.st?T.list[RADIO.trk]:null;};
  const isRain=t=>!!(t&&(t.set==='rain'||/rain|storm|drizzle|puddle|umbrella/i.test(t.t)));
  let lastTrk=null;
  function hudTick(){const m=perthMin(),h=Math.floor(m/60),mm=Math.floor(m%60);$('#lvClock').textContent=String(h).padStart(2,'0')+':'+String(mm).padStart(2,'0');
    const t=curTrack();$('#lvSt').textContent=(RSTATIONS[RADIO.st]?RSTATIONS[RADIO.st].name:'')+' · '+(FREQ[RADIO.st]||'')+' FM';$('#lvTr').textContent=t?t.t:'Tuning in…';
    $('#lvWx').textContent=(S.wx===3?'Soft rain':NIGHT>.6?'Starry night':h<11?'Sunny morning':h<17?'Sunny afternoon':'Golden hour')+' · Rottnest Island, Perth time';
    // weather follows the music: rain tracks bring showers, the rest are clear or a few clouds
    const key=t?RADIO.st+':'+RADIO.trk:null;if(key!==lastTrk){lastTrk=key;const wx=isRain(t)?3:(Math.random()<.7?0:1);if(S.wx!==wx){S.wx=wx;const w=WEATHERS[wx];S.temp=w.temp[0]+Math.floor(Math.random()*(w.temp[1]-w.temp[0]+1));}}}
  // ---- Kip works the counter ----
  const HOME={x:0,z:-1.35};let job=null,moving=false,spawnT=4;
  function stationX(k){const s=STATIONS.find(q=>q.key===k);return s?s.x:0;}
  function kipTick(dt){moving=false;
    if(job&&job.c&&(job.c.state!=='wait'||!customers.includes(job.c))){if(player.carry===job.c.order)player.carry=null;job=null;}
    if(!job){const c=customers.filter(q=>q.state==='wait'&&!q.claimed).sort((a,b)=>a.patience-b.patience)[0];
      if(c){c.claimed='kip';job={c,step:'toStation'};}else{moving=!stepWalker(player,HOME.x,HOME.z,2.6,dt);if(!moving)player.face=1;return;}}
    const c=job.c;
    if(job.step==='toStation'){moving=!stepWalker(player,stationX(c.order),-1.65,3,dt);if(!moving){for(const k in S.stock)S.stock[k]=Math.max(S.stock[k],20);if(canMake(c.order))useStock(c.order);const b=ITEMS[c.order].brew*(S.wish.machine?.5:1);if(b>0){player.brewing=b;player.brewMax=b;player.brewKey=c.order;player.carry=null;}else player.carry=c.order;job.step='brew';}}
    else if(job.step==='brew'){if(player.carry===c.order)job.step='deliver';}
    else if(job.step==='deliver'){moving=!stepWalker(player,c.x+(c.x>0?-.6:.6),c.z+.55,3,dt);if(!moving){serve(c);job=null;}}}
  // run Kip before the normal player update (which handles brewing, the carried cup and the sprite)
  const _up=updatePlayer;updatePlayer=function(dt){keys.clear();joyId=null;player.bike=false;player.lying=false;kipTick(dt);_up(dt);
    if(moving){setFrame(player.mesh,1+(Math.floor(player.walkT/.14)%2));player.mesh.position.y=groundY(player.x,player.z)+Math.abs(Math.sin(player.walkT*12))*.07;player.mesh.scale.x=player.face;}};
  // patient customers who keep coming, Perth time on the clock
  const _sp=spawnCustomer;spawnCustomer=function(){const n=customers.length;_sp();if(customers.length>n){const c=customers[customers.length-1];c.patience=c.max=180;}};
  // no story dialogs or pop-up panels on stream
  say=function(){};
  const _upd=update;update=function(dt){if(!ui.dlg.hidden){dlgQ=[];dlgDone=null;ui.dlg.hidden=true;}if(overlay&&running)hideOverlays();S.time=perthMin();if(S.time<OPEN+1&&S.time>OPEN-1)S.time=OPEN+1;
    spawnT-=dt;if(spawnT<=0){spawnT=8+Math.random()*14;const seats=SEATS.filter(q=>(q.lvl||1)<=cafeLv());if(customers.filter(q=>q.state!=='leave').length<seats.length-1)arrivals.push(0);}
    _upd(dt);hudTick();};
  // ---- camera drifts slowly between three café shots ----
  const SHOTS=[[0,1.1,.35,1.05],[-1.3,1.5,-.32,.95],[1.4,.9,.18,.98]];const SHOT_S=70;
  const _uc=updateCamera;updateCamera=function(dt,snap){if(!running||overlay)return _uc(dt,snap);
    const tt=performance.now()/1000/SHOT_S,i=Math.floor(tt)%SHOTS.length,f=tt%1,A=SHOTS[i],B=SHOTS[(i+1)%SHOTS.length],e=f<.8?0:(f-.8)/.2,k=e*e*(3-2*e);
    tmpV.set(lerp(A[0],B[0],k)+Math.sin(tt*6.283)*.25,.6,lerp(A[1],B[1],k));yawT=lerp(A[2],B[2],k)+Math.sin(tt*6.283)*.05;zm=lerp(A[3],B[3],k);
    camTarget.lerp(tmpV,snap?1:1-Math.exp(-dt*1.5));yaw+=(yawT-yaw)*(snap?1:1-Math.exp(-dt*2));camOff.set(Math.sin(yaw)*CAM_DIR.z,CAM_DIR.y,Math.cos(yaw)*CAM_DIR.z);camera.position.copy(camTarget).addScaledVector(camOff,Math.min(52,camDist*zm));
    for(let j=0;j<BB.length;j++)BB[j].rotation.y=yaw;dir4Tick();camera.lookAt(camTarget);tmpV.set(camTarget.x,.8,camTarget.z).project(camera);post.uniforms.focus.value=clamp((tmpV.y+1)/2,.25,.75);};
  // ---- start: fresh café, studio view (no menus), radio on ----
  function begin(){startGame({day:1});STUDIO=true;document.body.classList.add('studio');player.x=HOME.x;player.z=HOME.z;S.stock={beans:99,milk:99,mango:99,mix:99,tea:99};updateCamera(0,true);
    RADIO.vol=Math.max(0,Math.min(100,+(Q.get('vol')||70)))/100;radioPlay(ST);
    if(!RADIO.ctx||RADIO.ctx.state!=='running'){const b=document.createElement('button');b.id='liveGo';b.type='button';b.innerHTML='▶ Tune in<span>Click to start the music</span>';b.onclick=()=>{b.remove();radioPlay(ST);};document.body.appendChild(b);}}
  setTimeout(begin,900);
  return {perthMin};
})();
