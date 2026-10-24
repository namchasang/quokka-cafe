// ---------- ride or teleport: transport fares ----------
const FARE_RIDE=3,FARE_TP=30;
let RIDE=null;
function pay(n){if(S.coins<n){toast('Not enough coins (need '+n+')',2.4);return false;}S.coins-=n;popText('-'+n,{x:player.x,y:2,z:player.z});return true;}
function rideAlong(pts,mesh,speed,onDone,minPer){RIDE={pts,i:0,t:0,mesh,speed:speed||6,onDone,minPer:minPer||.6};transit=true;player.carry=null;player.bike=false;player.lying=false;if(player.mesh)player.mesh.visible=false;}
function rideTick(dt){const R=RIDE;cineTick(dt);let move=R.speed*dt*(R.slow||1);while(move>0&&R.i<R.pts.length-1){const a=R.pts[R.i],b=R.pts[R.i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1])||.001;const left=L*(1-R.t);if(move<left){R.t+=move/L;S.time+=move*R.minPer;move=0;}else{move-=left;S.time+=left*R.minPer;R.i++;R.t=0;}}
  const a=R.pts[Math.min(R.i,R.pts.length-1)],b=R.pts[Math.min(R.i+1,R.pts.length-1)];const x=lerp(a[0],b[0],R.t),z=lerp(a[1],b[1],R.t);player.x=x;player.z=z;
  if(R.mesh){R.mesh.position.set(x,0,z);const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);if(b!==a)R.mesh.rotation.y=-ang;}
  if(R.i>=R.pts.length-1){const done=R.onDone;RIDE=null;transit=false;if(CINE)endCine();if(player.mesh)player.mesh.visible=true;if(done)done();}}
const COACH_ROUTE=[[10.4,-1.2],[13,0],[26,0],[29.6,-2.4],[26,-7],[22,-7.2],[26,-7],[30.6,-3.6],[32.2,-4],[31,0],[35,-.2],[40.5,-2.4],[45.4,-3.8],[50,-2.4],[58,-1.4],[59.4,-2],[68,-.8],[71.2,.2],[80,-.2],[89.6,-.2]];
const COACH_IDX={settle:0,basin:5,light:8,geordie:15,salmon:17,west:19};
let coachMesh=null;
function trainRide(dest){const R=WEST.rail;const S0=[IWx(14.2,-3.6),IWz(14.2,-3.6)];const pts=dest==='oliver'?[S0].concat(R):R.slice().reverse().concat([S0]);WEST.riding=true;toast('All aboard the Quokka Express! · '+FARE_RIDE+' coins',2.2);startCine();
  rideAlong(pts,WEST.train,4.5,()=>{WEST.riding=false;if(dest==='oliver'){player.x=IWx(54.6,.2);player.z=IWz(54.6,.2);}else{player.x=IWx(14.2,-3.2);player.z=IWz(14.2,-3.2);}S.qg=S.qg||{};S.qg.train=1;save();},.4);}
function busRide(dest){if(transit||VISIT)return;if(dest==='vp'&&needPass('vp'))return;const zq=zoneOf(player.x);const F=BUS_STOPS[zq],D=BUS_STOPS[dest];if(!F)return;const bm=window.__busProto.clone();scene.add(bm);
  const fx=F.x+.6,fz=F.z+1.4;toast('Riding the bus to '+D.name+' · '+FARE_RIDE+' coins',2.4);
  rideAlong([[fx,fz],[fx+14,fz]],bm,5,()=>{fadeTarget=.95;transit=true;setTimeout(()=>{scene.remove(bm);const bm2=window.__busProto.clone();scene.add(bm2);const tx=D.x+.6,tz=D.z+1.4;player.x=tx-14;player.z=tz;updateCamera(0,true);fadeTarget=0;
    rideAlong([[tx-14,tz],[tx,tz]],bm2,5,()=>{scene.remove(bm2);busArrive(dest);},.3);},700);},.3);}
function busArrive(dest){const D=BUS_STOPS[dest];S.time+=10;player.bike=false;player.carry=null;player.x=D.land[0];player.z=D.land[1];updateCamera(0,true);fadeTarget=0;transit=false;S.fq=S.fq||{};
  if(dest==='hi'&&!S.fq.visitHI){S.fq.visitHI=1;save();say(['Kip: Heirisson Island! There’s a kangaroo sanctuary in the middle of the river.','Kip: Perfect for postcards. Press the camera button when something new is nearby.']);}
  if(dest==='vp'&&!S.fq.visitVP){S.fq.visitVP=1;save();say(['Kip: Albany Highway! Pho, ramen, dumplings, Thai, bubble tea… I could eat my way down this whole street.'],()=>openQuest('vpfood',true));}}
function openBusStop(from){const N={sp:'South Perth',hi:'Heirisson Island',vp:'Victoria Park'};openTravel('Bus to\u2026',N[from]+' bus stop',['sp','hi','vp'].map(k=>({id:k,name:N[k],here:k===from,note:k===from?'':(Math.abs(['sp','hi','vp'].indexOf(k)-['sp','hi','vp'].indexOf(from))*15)+' min',ride:()=>busRide(k),tp:()=>busTo(k)})));}
function openTravel(title,sub,opts){if(!running||overlay)return;$('#chTitle').textContent=title;$('#chSub').textContent=sub;const L=$('#chList');L.innerHTML='';
  opts.forEach(o=>{const d=document.createElement('div');d.className='trRow';const n=document.createElement('b');n.textContent=o.name+(o.here?' (you are here)':'');const sp=document.createElement('span');sp.textContent=(o.note||'')+(o.id==='vp'&&!o.here&&!hasPass()?' \u00b7 \u{1F512} Perth Pass':'');const bx=document.createElement('div');bx.className='trBtns';
    if(!o.here){const r=document.createElement('button');r.type='button';r.className='btn';r.id='ride-'+o.id;r.textContent='Ride · '+FARE_RIDE+'c';r.onclick=()=>{if(o.id==='vp'&&needPass('vp'))return;if(!pay(FARE_RIDE))return;hideOverlays();o.ride();};const t=document.createElement('button');t.type='button';t.className='btn ghost';t.id='tp-'+o.id;t.textContent='Teleport · '+FARE_TP+'c';t.onclick=()=>{if(o.id==='vp'&&needPass('vp'))return;if(!pay(FARE_TP))return;hideOverlays();o.tp();};bx.append(r,t);}
    const tx=document.createElement('div');tx.append(n,sp);d.append(tx,bx);L.appendChild(d);});showOverlay('coach');}

// ---------- sightseeing cut-scenes on the Island Loop bus and Express ----------
const SIGHTS=[
 {x:20,z:-11,name:'The Basin',sub:'A sheltered reef pool with crystal-clear water. The island\u2019s favourite swimming spot.'},
 {x:13,z:-6,name:'The Settlement',sub:'Rottnest\u2019s village of 1840s limestone cottages, shops and the Island Museum.'},
 {x:33.5,z:-6.3,name:'Rottnest Lighthouse',sub:'Built in 1849 on the island\u2019s highest hill. The view stretches all the way to Perth.'},
 {x:42.2,z:-7.5,name:'Pink salt lakes',sub:'Tiny algae turn these salt lakes pink. Look for banded stilts wading in the shallows.'},
 {x:46.5,z:-4.5,name:'Bathurst Lighthouse',sub:'The little white lighthouse guarding the northern shipping channel since 1900.'},
 {x:24,z:5,name:'Quokka Village',sub:'Teepees and cottages in the bush where most of the island\u2019s quokkas gather.'},
 {x:60,z:-6,name:'Geordie Bay',sub:'Holiday cottages, moored boats and the calmest water on the north coast.'},
 {x:56.6,z:3.6,name:'Oliver Hill',sub:'A WWII gun battery that once guarded Fremantle harbour, with tunnels underneath.'},
 {x:66.2,z:2.7,name:'Lake Herschel',sub:'Another pink salt lake, quiet and rarely visited.'},
 {x:70.5,z:8.4,name:'Little Salmon Bay',sub:'A snorkel trail over the reef. Look for fish around the underwater plaques.'},
 {x:82.4,z:8.4,name:'Strickland Bay',sub:'The island\u2019s surf break. Surfers wait for big Indian Ocean swells.'},
 {x:95,z:3.4,name:'Cape Vlamingh',sub:'The wild West End. Fur seals bask on Cathedral Rocks and humpbacks pass in winter.'}];
let CINE=null;
function startCine(){CINE={focus:null,shown:{},t:0,cap:0};$('#cine').hidden=false;document.body.classList.add('cineOn');}
function endCine(){CINE=null;$('#cine').hidden=true;document.body.classList.remove('cineOn');$('#cineCap').classList.remove('on');}
function cineTick(dt){if(!CINE)return;CINE.t+=dt;CINE.cap-=dt;let best=null,bd=10;SIGHTS.forEach(sg=>{const d=Math.hypot(sg.x-player.x,sg.z-player.z);if(d<bd){bd=d;best=sg;}});
  if(best&&!CINE.shown[best.name]){CINE.shown[best.name]=1;CINE.focus=best;CINE.cap=4.2;$('#cineT').textContent=best.name;$('#cineS').textContent=best.sub;$('#cineCap').classList.add('on');}
  if(CINE.cap<=0){$('#cineCap').classList.remove('on');if(CINE.focus&&Math.hypot(CINE.focus.x-player.x,CINE.focus.z-player.z)>12)CINE.focus=null;}
  if(RIDE)RIDE.slow=CINE.cap>0?.45:1;}
function skipRide(){if(!RIDE)return;const R=RIDE;let rest=0;for(let i=R.i;i<R.pts.length-1;i++)rest+=Math.hypot(R.pts[i+1][0]-R.pts[i][0],R.pts[i+1][1]-R.pts[i][1]);S.time+=rest*R.minPer*(1-0);R.i=R.pts.length-1;R.t=0;fadeTarget=.9;setTimeout(()=>{fadeTarget=0;},350);}

const SAFE_SPOTS={island:[[0,4.2],[-12.6,5],[10.4,-.8],[22,-5.6],[32.2,-3.6],[59.4,-1.6],[71.2,1.8],[89.6,.4],[14.2,-2.6],[54.6,1.2],[24,8.2]],sp:[[150,-2.6],[141,20.7],[158.6,20.7],[150,10.5],[178,20.7]],hi:[[432,-7.6],[420,5.2]],vp:[[492,3.2],[525,1.6],[525,4]],freo:[[290,-9],[300,6],[310,2]]};
function freeNear(x,z){if(!blocked(x,z))return[x,z];for(let rr=.5;rr<=8;rr+=.5){for(let a=0;a<16;a++){const t=a/16*6.283,nx=x+Math.cos(t)*rr,nz=z+Math.sin(t)*rr;if(!blocked(nx,nz))return[nx,nz];}}return[x,z];}
function unstuck(){RIDE=null;if(CINE)endCine();transit=false;fadeTarget=0;player.lying=false;player.brewing=0;dlgQ=[];ui.dlg.hidden=true;hideOverlays();if(player.mesh)player.mesh.visible=true;if(WEST)WEST.riding=false;
  const z=zoneOf(player.x);const L=SAFE_SPOTS[z]||SAFE_SPOTS.island;let best=L[0],bd=1e9;L.forEach(p=>{const d=Math.hypot(p[0]-player.x,p[1]-player.z);if(d<bd&&!blocked(p[0],p[1])){bd=d;best=p;}});{const f=freeNear(best[0],best[1]);player.x=f[0];player.z=f[1];}updateCamera(0,true);running=true;toast('Smoko\u2019s over! Kip hopped back to the nearest sign',2.6);}
