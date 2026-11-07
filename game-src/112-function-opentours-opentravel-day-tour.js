function openTours(){openTravel('Day tours','Siam Sydney Services · Tudor Lane',TOURS.map(t=>({id:t.id,name:t.name,note:t.note+' · back by evening',fare:t.price,btn:'Book',ride:()=>startTour(t.id)})),'Book a day tour with a local guide. The van leaves from Tudor Lane and brings you back here by evening.');}
let TOUR=null;
function startTour(id){if(transit||VISIT)return;const T=TOURS.find(t=>t.id===id);transit=true;fadeTarget=.95;toast('The tour van leaves Tudor Lane…',2);
  setTimeout(()=>{let ov=document.getElementById('tourOv');if(!ov){ov=document.createElement('div');ov.id='tourOv';ov.innerHTML='<iframe id="tourFr" title="Day tour"></iframe><div id="tourTop"><b id="tourName"></b><span id="tourSub"></span></div><div id="tourSay"></div><div id="tourBtns"><button type="button" class="btn ghost" id="tourNext">Next</button><button type="button" class="btn ghost" id="tourCard">Keep a postcard</button><button type="button" class="btn" id="tourBack">Back to Perth</button></div>';
      const st=document.createElement('style');st.textContent='#tourOv{position:fixed;inset:0;z-index:72;background:#141a2e}#tourFr{position:absolute;inset:0;width:100%;height:100%;border:0}#tourTop{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));left:max(10px,env(safe-area-inset-left,0px));background:rgba(20,26,46,.84);border:2px solid #3a4670;border-radius:8px;padding:8px 12px;color:#f5ecd8;max-width:70vw}#tourTop b{display:block;font-family:"Pixelify Sans",monospace;color:#ffd34d;font-size:18px}#tourTop span{font-size:12px;color:#a9b3cf}#tourBtns .btn{padding:8px 12px;font-size:14px;white-space:nowrap}#tourBtns .btn.ghost{background:rgba(20,26,46,.92);color:#f5ecd8;border-color:#3a4670}#tourSay{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(72px + env(safe-area-inset-bottom,0px));width:min(560px,calc(100vw - 32px));background:rgba(20,26,46,.9);border:2px solid #3a4670;border-radius:8px;padding:10px 14px;color:#f5ecd8;font-size:15px;line-height:1.4}#tourBtns{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));display:flex;gap:6px;flex-wrap:nowrap;justify-content:center;width:calc(100vw - 20px)}';
      document.head.appendChild(st);document.body.appendChild(ov);
      document.getElementById('tourNext').onclick=()=>{if(!TOUR)return;TOUR.i=(TOUR.i+1)%TOUR.T.guide.length;document.getElementById('tourSay').textContent=TOUR.T.guide[TOUR.i];};
      document.getElementById('tourCard').onclick=()=>{if(!TOUR)return;S.tourCards=S.tourCards||{};if(S.tourCards[TOUR.T.id]){toast('You already have this postcard',2);return;}S.tourCards[TOUR.T.id]=S.day||1;save();toast('Postcard kept: '+TOUR.T.name,2.4);};
      document.getElementById('tourBack').onclick=()=>endTour();}
    TOUR={T,i:0};overlay='tour';ui.hud.hidden=true;ui.act.hidden=true;ov.hidden=false;
    document.getElementById('tourName').textContent='Day tour · '+T.name;document.getElementById('tourSub').textContent='Siam Sydney Services · '+T.note;document.getElementById('tourSay').textContent=T.guide[0];
    const fr=document.getElementById('tourFr');const gold=S.time%1440>16*60;fr.srcdoc=TOUR_PAGE.replace("let cur='freo',time='day'","let cur='"+T.id+"',time='"+(gold?'gold':'day')+"'");
    transit=false;fadeTarget=0;S.tours=S.tours||{};S.tours[T.id]=(S.tours[T.id]||0)+1;save();},900);}
function endTour(){if(!TOUR)return;const T=TOUR.T;TOUR=null;transit=true;fadeTarget=.95;
  setTimeout(()=>{const ov=document.getElementById('tourOv');if(ov){ov.hidden=true;document.getElementById('tourFr').srcdoc='';}overlay=null;ui.hud.hidden=false;ui.act.hidden=false;
    S.time+=T.hrs*60;const [x,z]=hqTpSpot(TOUR_DESK.x+.6,TOUR_DESK.z);player.x=x;player.z=z;updateCamera(0,true);fadeTarget=0;transit=false;toast('Back in Tudor Lane after a day at '+T.name,2.6);save();},700);}
{const _h4=hideOverlays;hideOverlays=function(){if(TOUR){TOUR=null;const ov=document.getElementById('tourOv');if(ov){ov.hidden=true;document.getElementById('tourFr').srcdoc='';}}_h4();};}
{const _tt=cbdTargets;cbdTargets=function(T){_tt(T);let zq;try{zq=zoneOf(player.x);}catch(e){return;}if(zq!=='cbd')return;T.push({x:TOUR_DESK.x+.5,z:TOUR_DESK.z,r:1.2,label:'Siam Sydney Services · day tours',act:()=>openTours()});};}
// ---------- Day-trip places (Look Lab ?trip, Paul Nov 2026): Lancelin, the Pinnacles, Busselton Jetty and Esperance become walkable maps ----------
// Each one sits far east of the airport in its own strip of x (zone ids lan / pin / bus / esp). The Siam Sydney Services van in Tudor Lane takes
// Kip there; the van waits by the car park and brings him back to Tudor Lane by evening. Each place is built by TRIP_BUILD[id](G,K) into its own group:
// it sets K.walk(x,z), K.h(x,z) (ground height), K.arrive [x,z], K.van [x,z], and may set K.targets(T), K.tick(dt,t), K.zone (map rects/labels).
var TRIP_LIVE=false;var TRIP_ON=TRIP_LIVE||/[?&#](lab|trip)\b/.test(location.search+location.hash);
var TRIPS={lan:{x1:850,x2:970,z1:-45,z2:45,tour:'lancelin',name:'Lancelin',title:'Lancelin Sand Dunes',bg:'#f2ede0'},
  pin:{x1:1000,x2:1120,z1:-45,z2:45,tour:'pinnacles',name:'The Pinnacles',title:'The Pinnacles · Nambung',bg:'#e8b85a'},
  bus:{x1:1150,x2:1270,z1:-45,z2:45,tour:'busselton',name:'Busselton',title:'Busselton Jetty',bg:'#5cc6d8'},
  esp:{x1:1300,x2:1420,z1:-45,z2:45,tour:'esperance',name:'Esperance',title:'Esperance · Lucky Bay',bg:'#f6f3ea'}};
var TRIP_BUILD=TRIP_BUILD||{};
function tripOf(x){if(!TRIP_ON||x<840)return null;for(const k in TRIPS){const T=TRIPS[k];if(x>=T.x1-15&&x<T.x2+15)return k;}return null;}
function tripWalk(x,z){const k=tripOf(x),T=k&&TRIPS[k];if(!T||!T.K||!T.K.walk)return false;return T.K.walk(x,z);}
function tripH(x,z){const k=tripOf(x),T=k&&TRIPS[k];return T&&T.K&&T.K.h?T.K.h(x,z):0;}
if(TRIP_ON)(()=>{
  for(const k in TRIPS){const T=TRIPS[k];const G=new THREE.Group();G.name='trip_'+k;G.visible=false;scene.add(G);T.G=G;
    const K={id:k,x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2,walk:(x,z)=>x>T.x1+2&&x<T.x2-2&&z>-20&&z<20,h:()=>0,arrive:[(T.x1+T.x2)/2,0],van:[(T.x1+T.x2)/2-3,2],targets:null,tick:null,
      zone:{rects:[[T.x1,T.z1,T.x2,T.z2,T.bg]],labels:[[T.title,(T.x1+T.x2)/2,0,1]]}};T.K=K;
    if(TRIP_BUILD[k])try{TRIP_BUILD[k](G,K);}catch(e){console.error('trip '+k,e);}
    ZONE_DEF[k]={B:{x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2},title:T.title,eb:'Day tour · Siam Sydney Services',bg:T.bg,rects:K.zone.rects,labels:K.zone.labels};
    SAFE_SPOTS[k]=[K.arrive];TOWN_NAME[k]=T.title;}
  // the ground under Kip, people and the camera follows the place's own terrain
  const _gy=groundY;groundY=function(x,z){if(x>840){const k=tripOf(x);if(k)return tripH(x,z);}return _gy(x,z);};
  {const _zt=zoneTick;zoneTick=function(dt,t){_zt(dt,t);const zq=zoneOf(player.x);for(const k in TRIPS){const T=TRIPS[k],here=zq===k;if(T.G.visible!==here)T.G.visible=here;if(here&&T.K.tick)try{T.K.tick(dt,t);}catch(e){}}};}
  {const _tg=cbdTargets;cbdTargets=function(T){_tg(T);const zq=zoneOf(player.x),P=TRIPS[zq];if(!P)return;const K=P.K;
    T.push({x:K.van[0],z:K.van[1],r:1.6,label:'Tour van · back to Perth (Tudor Lane)',act:()=>endTour()});
    if(TOUR&&TOUR.T)T.push({x:K.van[0]+1.4,z:K.van[1],r:1.3,label:'Ask the guide',act:()=>{TOUR.i=(TOUR.i+1)%TOUR.T.guide.length;say([TOUR.T.guide[TOUR.i]]);}});
    if(K.targets)try{K.targets(T);}catch(e){console.error(e);}};}
})();
// a trip with a walkable map replaces the old diorama page for that tour
function tripForTour(id){if(!TRIP_ON)return null;for(const k in TRIPS)if(TRIPS[k].tour===id&&TRIP_BUILD[k])return k;return null;}
{const _st=startTour;startTour=function(id){const k=tripForTour(id);if(!k)return _st(id);if(transit||VISIT)return;const T=TOURS.find(t=>t.id===id);transit=true;fadeTarget=.95;toast('The tour van leaves Tudor Lane…',2);
  setTimeout(()=>{const K=TRIPS[k].K;TOUR={T,i:0,trip:k,t0:S.time};player.bike=false;player.carry=null;player.x=K.arrive[0];player.z=K.arrive[1];S.time+=Math.round(T.hrs*60*.25);updateCamera(0,true);fadeTarget=0;transit=false;
    S.tours=S.tours||{};S.tours[T.id]=(S.tours[T.id]||0)+1;S.seenZ=S.seenZ||{};S.seenZ[k]=1;save();say(['Guide: '+T.guide[0].replace(/^Guide: /,'')]);},900);};}
{const _et=endTour;endTour=function(){if(TOUR&&TOUR.trip){const T=TOUR.T,t0=TOUR.t0;TOUR=null;transit=true;fadeTarget=.95;
    setTimeout(()=>{S.time=Math.max(S.time,t0+T.hrs*60);const [x,z]=hqTpSpot(TOUR_DESK.x+.6,TOUR_DESK.z);player.x=x;player.z=z;updateCamera(0,true);fadeTarget=0;transit=false;toast('Back in Tudor Lane after a day at '+T.name,2.6);save();},700);return;}
  return _et();};}
