// ---------- HOME3 (Look Lab ?home2, Paul Nov 2026): the home screen visits the boat, Lancelin, the Pinnacles, the city and Perth Station ----------
// Kip is moved (hidden) into the place being filmed so every zone group (trips, city, station) shows itself as in play; all put back on New game / Continue.
var H3=null;// stays undefined until this point of the script runs (the camera runs earlier while loading)
function h3Away(){return!!(H3&&H3.act&&H3.away);}
function h3Init(){const R=TITLE_SHOTS.map((A,j)=>({k:'r'+j,x:A[0],z:A[2],yaw:A[3],zm:A[4],d:[.8,0,.12,0],rott:1}));
  const L=[R[0],R[1],
    {k:'boat',away:0,dur:10,ready:()=>!!BOAT.g,enter:h3BoatIn,tick:h3BoatTick,exit:h3BoatOut,zm:.8,zo:1.5,yaw:.5,d:[0,0,.25,0]},
    R[2],R[3],
    {k:'lan',away:1,x:912,z:-8,yaw:1.2,zm:1.3,d:[0,6,.1,0],time:1070,trip:'lan',ready:()=>h3Trip('lan')&&h3LanPaint()>.85},
    {k:'pin',away:1,x:1066,z:6,yaw:-.45,zm:.9,d:[-3,-2,-.12,0],time:1060,trip:'pin',ready:()=>h3Trip('pin')},
    R[4],
    {k:'cbd',away:1,x:656,z:-12,yaw:.3,zm:1.6,d:[-8,0,-.12,0],time:1080,ready:()=>true},
    {k:'stn',away:1,x:686,z:-48.4,yaw:.5,zm:.75,zo:1.35,d:[-2.5,0,-.08,0],time:1020,dur:10,ready:()=>MTR.on&&MTR.built&&!!MTR.st.cbd,enter:h3StnIn},
    R[5]];
  return L;}
function h3Trip(k){return TRIP_ON&&TRIPS[k]&&TRIPS[k].built;}
function h3LanPaint(){const L=TRIP_BUILD.lan&&TRIP_BUILD.lan.S;return L&&L.chunks.length?L.painted/L.chunks.length:0;}
// the tour boat cruises out of Thomson Bay along the clearest line of water
function h3BoatIn(s){const B=BOAT;s.sv={x:B.x,z:B.z,h:B.h,v:B.v};const hx=B.home?B.home.x:B.x,hz=B.home?B.home.z:B.z;let best=null,bs=-1;
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2,c=Math.cos(a),n=Math.sin(a);let ok=0,dp=0;for(let d=2;d<=30;d+=2){if(!sea2Water(hx+c*d,hz+n*d,a))break;ok=d;dp+=-landD(hx+c*d,hz+n*d);}const sc=ok*10+dp*.2;if(sc>bs){bs=sc;best=a;}}
  s.bp={x:hx,z:hz,h:best==null?Math.PI:best};}
function h3BoatPos(s,f){const P=s.bp,d=3+f*24,c=.04*Math.sin(f*3);const h=P.h+c;return{x:P.x+Math.cos(P.h)*d-Math.sin(P.h)*Math.sin(f*3)*1.2,z:P.z+Math.sin(P.h)*d+Math.cos(P.h)*Math.sin(f*3)*1.2,h};}
function h3BoatTick(s,f){const p=h3BoatPos(s,f);BOAT.x=p.x;BOAT.z=p.z;BOAT.h=p.h;BOAT.v=4.5;
  // the camera trails a little behind and beside the boat
  s.x=p.x+Math.cos(p.h)*1.5;s.z=p.z+Math.sin(p.h)*1.5;}
function h3BoatOut(s){const v=s.sv;if(!v)return;Object.assign(BOAT,v);BOAT.v=0;if(BOAT.wake)BOAT.wake.material.opacity=0;sea2Place();s.sv=null;}
// a train pulls in and opens its doors while the shot plays
function h3StnIn(){const s=MTR.st.cbd;if(!s)return;s.hold=false;s.door=0;s.ph='in';s.t=MTR.TIN*.75;}
// HOME4 (Paul Nov 2026): every shot about 1.8x further out (the camera stops at the in-game zoom-out limit); H3_ZO per shot via s.zo
const H3_ZO=1.8;
function h3Pose(s,f){const d=s.d||[0,0,0,0];return{x:s.x+d[0]*f,z:s.z+d[1]*f,yaw:s.yaw+d[2]*f,zm:Math.min(1.7,(s.zm+d[3]*f)*(s.zo||H3_ZO))};}
function h3Ready(s){try{return!s.ready||s.ready();}catch(e){return false;}}
function h3Next(i){const L=H3.L;for(let j=1;j<=L.length;j++){const n=(i+j)%L.length;if(h3Ready(L[n]))return n;}return i;}
function h3Far(a,b){return!(a.rott&&b.rott);}
function h3Enter(i){const L=H3.L,s=L[i];H3.i=i;H3.st=0;H3.snap=true;if(s.enter)try{s.enter(s);}catch(e){console.error(e);}
  H3.away=!!s.away;if(s.away){if(s.trip&&!TRIPS[s.trip].built)tripEnsure(s.trip);player.x=s.px||s.x;player.z=s.pz||s.z;}else{player.x=H3.px;player.z=H3.pz;}
  if(player.mesh)player.mesh.visible=!s.away;if(player.blob)player.blob.visible=!s.away;}
function h3Exit(){const s=H3.L[H3.i];if(s&&s.exit)try{s.exit(s);}catch(e){console.error(e);}}
// big pieces are built in the background, spread out so the title keeps moving (Lancelin first: it paints its sand bit by bit)
function h3Builds(){const T=H3.T,B=H3.b;
  if(!B.sea&&T>2.5){B.sea=1;if(SEA2_ON)try{sea2Build();}catch(e){console.error(e);}}
  if(!B.lan&&T>4){B.lan=1;if(TRIP_ON)try{tripEnsure('lan');}catch(e){console.error(e);}}
  if(!B.mtr&&T>9){B.mtr=1;if(MTR.on&&!MTR.built)try{mtrBuild();}catch(e){console.error(e);MTR.on=false;}}
  if(!B.pin&&T>14){B.pin=1;if(TRIP_ON)try{tripEnsure('pin');}catch(e){console.error(e);}}
  // paint Lancelin's sand a little each frame (nearest the title shot first) until it is done
  const cur=H3.L[H3.i];if(h3Trip('lan')&&h3LanPaint()<1&&!(cur.k==='lan')){const LS=TRIP_BUILD.lan.S,ob=LS.budget,px=player.x,pz=player.z,sh=H3.L.find(s=>s.k==='lan');
    LS.budget=4;player.x=sh.x;player.z=sh.z;try{TRIPS.lan.K.tick(1/60,performance.now()/1000);}catch(e){}player.x=px;player.z=pz;LS.budget=ob;}}
function h3Cam(dt){if(H3===undefined)return false;if(!H3){H3={on:(typeof HOME2_LIVE!=='undefined'&&HOME2_LIVE)||/[?&#]home2\b/.test(location.search+location.hash)};}if(!H3.on)return false;
  if(!H3.act){H3.act=true;if(!H3.L)H3.L=h3Init();H3.T=0;H3.b=H3.b||{};H3.px=player.x;H3.pz=player.z;H3.away=false;h3Enter(0);H3.snap=false;}
  dt=Math.min(dt||0,.1);if(h4Busy()){h4Step();dt=0;}else{H3.T+=dt;h3Builds();}
  if(H3.force!=null){const n=H3.force;H3.force=null;h3Exit();h3Enter(n);}
  let s=H3.L[H3.i];const dur=s.dur||9,FO=.9;H3.st+=dt;
  if(H3.st>=dur){const n=h3Next(H3.i);const far=h3Far(s,H3.L[n]);h3Exit();h3Enter(n);if(!far)H3.snap=false;H3.inFade=far;s=H3.L[n];}
  const L=H3.L,n=h3Next(H3.i),nx=L[n],far=h3Far(s,nx),f=Math.min(1,H3.st/(s.dur||9));
  if(s.tick)try{s.tick(s,f);}catch(e){console.error(e);}
  let P=h3Pose(s,f);
  // close Rottnest shots glide into each other as before; far ones fade through dark
  if(!far&&f>.7){const e=(f-.7)/.3,k=e*e*(3-2*e),Q=h3Pose(nx,0);P={x:lerp(P.x,Q.x,k),z:lerp(P.z,Q.z,k),yaw:lerp(P.yaw,Q.yaw,k),zm:lerp(P.zm,Q.zm,k)};}
  let fd=0;const left=(s.dur||9)-H3.st;if(far&&left<FO)fd=Math.max(fd,1-left/FO);if(H3.inFade&&H3.st<FO)fd=Math.max(fd,1-H3.st/FO);if(H3.inFade&&H3.st>=FO)H3.inFade=false;
  if(h4Busy())fd=1;fd=fd*fd*(3-2*fd)*.97;fadeTarget=fd;post.uniforms.fade.value=fd;
  tmpV.set(P.x,.6+(P.x>840?groundY(P.x,P.z):0),P.z);yawT=P.yaw;zm=P.zm;S.time=s.time||1050;
  if(H3.snap){H3.snap=false;camTarget.copy(tmpV);yaw=yawT;}
  if(BOAT.g&&!running)try{sea2Tick(dt);}catch(e){}
  return true;}
function h3End(){if(!H3||!H3.act)return;H3.act=false;h3Exit();H3.away=false;if(!running){player.x=H3.px;player.z=H3.pz;}
  if(player.mesh)player.mesh.visible=true;if(player.blob)player.blob.visible=true;fadeTarget=0;post.uniforms.fade.value=0;H3.inFade=false;}
