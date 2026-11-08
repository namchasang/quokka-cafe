// ---------- train cycle: in → doors open → wait → doors shut → out → away ----------
function mtrTrainTick(s,dt){const D=s.D,M=MTR;
  if(s.ph==='away'){s.t-=dt;if(s.t<=0){s.ph='in';s.t=0;}}
  else if(s.ph==='in'){s.t+=dt;const u=Math.min(1,s.t/M.TIN);s.x=D.stop-D.inDir*D.D*(1-u)*(1-u);if(u>=1){s.x=D.stop;s.ph='open';s.t=0;}}
  else if(s.ph==='open'){s.t+=dt;s.door=Math.min(1,s.t/M.TOPEN);if(s.t>=M.TOPEN){s.ph='dwell';s.t=0;}}
  else if(s.ph==='dwell'){if(!s.hold)s.t+=dt;if(s.t>=M.DWELL){s.ph='close';s.t=0;}}
  else if(s.ph==='close'){s.t+=dt;s.door=1-Math.min(1,s.t/M.TOPEN);if(s.t>=M.TOPEN){s.door=0;s.ph='out';s.t=0;}}
  else if(s.ph==='out'){s.t+=dt;const u=Math.min(1,s.t/M.TOUT);s.x=D.stop+D.outDir*D.D*u*u;if(u>=1){s.ph='away';s.t=7+Math.random()*7;}}
  s.g.position.x=s.x;const dir=s.ph==='in'?D.inDir:D.outDir;
  for(const h of s.heads)h.m.visible=h.e===dir;for(const t of s.tails)t.m.visible=t.e!==dir;
  for(const lf of s.leaves){const u=s.door,s0=lf.userData.s;lf.position.x=lf.userData.base+s0*.54*u;lf.position.z=MTR.W/2+.02+.05*Math.min(1,u*4);}}
function mtrDoorAt(s,i){return{x:s.x+MTR.DOORS[i],z:s.D.tz+MTR.W/2+.04};}

// ---------- Kip on board ----------
function mtrBoardMenu(k,i){if(VISIT){toast('Go home first to travel',2);return;}const H=HUBS.train,F=H.stops[k],s=MTR.st[k];
  openTravel('Where to?',F.n+' · on the train',Object.keys(H.stops).map(z=>({id:z,name:TOWN_NAME[z]+' · '+H.stops[z].n,here:z===k,note:z===k?'':'About '+H.mins+' min',fare:H.fare,lock:null,ride:()=>mtrGo(k,z,i)})),
    'Pick a town and stay on board. One fare, any stop on the line.');if(overlay==='coach'){s.hold=true;MTR.menuFor=k;}}
function mtrGo(from,to,i){if(transit||VISIT)return;const s=MTR.st[from],d=MTR.st[to];if(!s||!d)return;
  transit=true;player.bike=false;player.carry=null;player.lying=false;s.hold=true;MTR.menuFor=null;
  MTR.ride={st:'board',t:0,from,to,i,sx:player.x,sz:player.z,y:0};toast(HUBS.train.word+' to '+HUBS.train.stops[to].n+' · doors closing',2);}
function mtrRideTick(dt){const R=MTR.ride,M=MTR;transitT=0;R.t+=dt;const s=M.st[R.from],d=M.st[R.to];let px=player.x,pz=player.z,py=R.y;
  if(R.st==='board'){const k=Math.min(1,R.t/.6),e=k*k*(3-2*k),dr=mtrDoorAt(s,R.i);px=lerp(R.sx,dr.x,e);pz=lerp(R.sz,dr.z,e);py=M.FLOOR*Math.min(1,k*1.6);if(k>=1){R.st='close';R.t=0;s.hold=false;if(s.ph==='dwell'||s.ph==='open'){s.ph='close';s.t=0;}}}
  else if(R.st==='close'){const dr=mtrDoorAt(s,R.i);px=dr.x;pz=dr.z;py=M.FLOOR;
    if(s.ph==='dwell'||s.ph==='open'){s.ph='close';s.t=0;}else if(s.ph==='away'||s.ph==='in'){s.ph='out';s.t=0;s.x=s.D.stop;s.door=0;}
    if(s.ph==='out'){R.st='depart';R.t=0;}}
  else if(R.st==='depart'||R.st==='fade'){const dr=mtrDoorAt(s,R.i);px=dr.x;pz=dr.z;py=M.FLOOR;
    if(R.st==='depart'&&R.t>3.2){R.st='fade';R.t=0;fadeTarget=.95;}
    else if(R.st==='fade'&&R.t>.95){// the ride itself: same as hubGo (time, bike, seen towns), then the arriving train at the far platform
      const H=HUBS.train;S.time+=H.mins;S.seenZ=S.seenZ||{};S.seenZ[R.to]=1;hideOverlays();
      d.ph='in';d.t=M.TIN*.56;d.door=0;d.hold=true;mtrTrainTick(d,0);const da=mtrDoorAt(d,R.i);px=da.x;pz=da.z;player.x=px;player.z=pz;
      if(s!==d&&s.ph==='out'){}
      R.st='arrive';R.t=0;updateCamera(0,true);fadeTarget=0;}}
  else if(R.st==='arrive'){d.hold=true;const da=mtrDoorAt(d,R.i);px=da.x;pz=da.z;py=M.FLOOR;if(d.ph==='dwell'){R.st='alight';R.t=0;R.ax=px;R.az=pz;}}
  else if(R.st==='alight'){const k=Math.min(1,R.t/.65),e=k*k*(3-2*k);px=R.ax;pz=lerp(R.az,mtrPZ(d.D)+.85,e);py=M.FLOOR*(1-Math.min(1,k*1.4));
    if(k>=1){d.hold=false;d.t=Math.max(0,M.DWELL-9);M.ride=null;transit=false;player.x=px;player.z=pz;
      if(R.to==='cbd'&&typeof cbdArrive==='function')cbdArrive('cbd');
      if(R.to==='air'){S.fq=S.fq||{};if(!S.fq.visitAir){S.fq.visitAir=1;say(['Kip: The airport! Planes taking off over the hills… and somewhere in arrivals, Auntie June and Milo.']);}}
      toast(HUBS.train.stops[R.to].n+' · mind the gap!',2);save();}}
  player.x=px;player.z=pz;R.y=py;if(player.mesh){player.mesh.visible=true;player.mesh.position.set(px,py,pz);}if(player.blob){player.blob.visible=R.st==='board'||R.st==='alight';player.blob.position.set(px,.03,pz);}}
function mtrHop(x,z,msg){if(transit||VISIT){if(VISIT)toast('Go home first to travel',2);return;}transit=true;fadeTarget=.95;player.bike=false;
  setTimeout(()=>{player.x=x;player.z=z;updateCamera(0,true);fadeTarget=0;transit=false;if(msg)toast(msg,2.2);},750);}

// the frame hook: runs after ambient (which still drives the old Victoria Park train) and before the camera
{const _amb=ambient;ambient=function(dt,t){_amb(dt,t);if(!MTR.on)return;
  if(!MTR.built){if(!running||(typeof PXB_ON!=='undefined'&&PXB_ON&&!pxbScene.done))return;try{mtrBuild();}catch(e){console.error(e);MTR.on=false;return;}}
  let zq='';try{zq=zoneOf(player.x);}catch(e){}
  for(const k in MTR.st){const s=MTR.st[k];if(s.hold&&MTR.menuFor===k&&overlay!=='coach'&&!MTR.ride){s.hold=false;MTR.menuFor=null;}mtrTrainTick(s,dt);
    const here=zq===k;s.sg.visible=here;s.g.visible=here&&s.ph!=='away'&&Math.abs(s.x-s.D.stop)<=s.D.D+.5;}
  if(MTR.ride)mtrRideTick(dt);
  try{mtrSeeThrough(dt,zq);}catch(e){console.error(e);MTR.see=false;}
  if(typeof vpTrain!=='undefined'){const s=MTR.st.vp;vpTrain.position.x=s&&s.ph!=='away'&&Math.abs(s.x-s.D.stop)<12?s.x-7.3:-1e4;}};}

// targets: the station door leads to Platform 1; open doors say "Board the train"
{const _mt=cbdTargets;cbdTargets=function(T){_mt(T);if(!MTR.on||!MTR.built)return;let zq;try{zq=zoneOf(player.x);}catch(e){return;}const s=MTR.st[zq];if(!s)return;const D=s.D,st=HUBS.train.stops[zq];
  for(let i=T.length-1;i>=0;i--){const l=T[i].label;if(typeof l!=='string')continue;
    if(l.indexOf(HUBS.train.many+' · ')===0){T[i].label='Trains · '+st.n+' · to Platform 1';T[i].act=()=>mtrHop(D.hop[0],D.hop[1],'Platform 1 · '+st.n);}
    else if(l.indexOf('Train to the Airport')===0||l.indexOf('Train to Perth Station (city)')===0)T.splice(i,1);}
  if(MTR.ride)return;
  (D.exits||[]).forEach(e=>T.push({x:e.x,z:e.z,r:1.1,label:e.label,act:()=>mtrHop(e.to[0],e.to[1])}));
  if(D.entry)T.push({x:D.entry.x,z:D.entry.z,r:1.1,label:D.entry.label,act:()=>mtrHop(D.hop[0],D.hop[1],'Platform 1 · '+st.n)});
  const pz=mtrPZ(D);if(Math.abs(player.z-pz-1)>D.pd+.6||player.x<D.px1-1||player.x>D.px2+1)return;
  if(s.ph==='dwell'||s.ph==='open'){MTR.DOORS.forEach((o,i)=>{const dr=mtrDoorAt(s,i);T.push({x:dr.x,z:pz+.5,r:1.05,label:'Board the train · pick a town',act:()=>{if(s.ph==='dwell'||s.ph==='open')mtrBoardMenu(zq,i);}});});}
  else T.push({x:D.stop,z:pz+1.1,r:D.pd+1.6,label:s.ph==='away'?'Wait for the next train':'Train coming · stand behind the yellow line',disabled:s.ph!=='away',act:()=>{if(s.ph==='away'){s.t=Math.min(s.t,1.2);toast('The next train is on its way…',1.8);}}});};}

