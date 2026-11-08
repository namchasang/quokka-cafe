// ---------- Day-trip places (Look Lab ?trip, Paul Nov 2026): Lancelin, the Pinnacles, Busselton Jetty and Esperance become walkable maps ----------
// Each one sits far east of the airport in its own strip of x (zone ids lan / pin / bus / esp). The Siam Sydney Services van in Tudor Lane takes
// Kip there; the van waits by the car park and brings him back to Tudor Lane by evening. Each place is built by TRIP_BUILD[id](G,K) into its own group:
// it sets K.walk(x,z), K.h(x,z) (ground height), K.arrive [x,z], K.van [x,z], and may set K.targets(T), K.tick(dt,t), K.zone (map rects/labels).
var TRIP_LIVE=true;var TRIP_ON=TRIP_LIVE||/[?&#](lab|trip|ow3d|ow2)\b/.test(location.search+location.hash);
var TRIPS={lan:{x1:850,x2:970,z1:-45,z2:45,tour:'lancelin',name:'Lancelin',title:'Lancelin Sand Dunes',bg:'#f2ede0'},
  pin:{x1:1000,x2:1120,z1:-45,z2:45,tour:'pinnacles',name:'The Pinnacles',title:'The Pinnacles · Nambung',bg:'#e8b85a'},
  bus:{x1:1150,x2:1270,z1:-45,z2:45,tour:'busselton',name:'Busselton',title:'Busselton Jetty',bg:'#5cc6d8'},
  esp:{x1:1300,x2:1420,z1:-45,z2:45,tour:'esperance',name:'Esperance',title:'Esperance · Lucky Bay',bg:'#f6f3ea'},
  cer:{x1:1450,x2:1570,z1:-45,z2:45,tour:null,name:'Cervantes',title:'Cervantes · Nok’s Thai Kitchen',bg:'#f2e8d0'}};
var TRIP_BUILD=TRIP_BUILD||{};
function tripOf(x){if(!TRIP_ON||x<840)return null;for(const k in TRIPS){const T=TRIPS[k];if(x>=T.x1-15&&x<T.x2+15)return k;}return null;}
function tripWalk(x,z){const k=tripOf(x),T=k&&TRIPS[k];if(!T||!T.K||!T.K.walk)return false;return T.K.walk(x,z);}
function tripH(x,z){const k=tripOf(x),T=k&&TRIPS[k];return T&&T.K&&T.K.h?T.K.h(x,z):0;}
if(TRIP_ON)(()=>{
  for(const k in TRIPS){const T=TRIPS[k];const G=new THREE.Group();G.name='trip_'+k;G.visible=false;scene.add(G);T.G=G;
    const K={id:k,x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2,walk:(x,z)=>x>T.x1+2&&x<T.x2-2&&z>-20&&z<20,h:()=>0,arrive:[(T.x1+T.x2)/2,0],van:[(T.x1+T.x2)/2-3,2],targets:null,tick:null,
      zone:{rects:[[T.x1,T.z1,T.x2,T.z2,T.bg]],labels:[[T.title,(T.x1+T.x2)/2,0,1]]}};T.K=K;
    T.built=false;// built the first time Kip goes there (tripEnsure), so loading the game stays fast
    ZONE_DEF[k]={B:{x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2},title:T.title,eb:'Day tour · Siam Sydney Services',bg:T.bg,rects:K.zone.rects,labels:K.zone.labels};
    SAFE_SPOTS[k]=[K.arrive];TOWN_NAME[k]=T.title;}
  // the ground under Kip, people and the camera follows the place's own terrain
  const _gy=groundY;groundY=function(x,z){if(x>840){const k=tripOf(x);if(k)return tripH(x,z);}return _gy(x,z);};
  {const _zt=zoneTick;zoneTick=function(dt,t){_zt(dt,t);const zq=zoneOf(player.x);if(TRIPS[zq]&&!TRIPS[zq].built)tripEnsure(zq);for(const k in TRIPS){const T=TRIPS[k],here=zq===k;if(T.G.visible!==here)T.G.visible=here;if(here&&T.K.tick)try{T.K.tick(dt,t);}catch(e){}}};}
  {const _tg=cbdTargets;cbdTargets=function(T){_tg(T);const zq=zoneOf(player.x),P=TRIPS[zq];if(!P)return;const K=P.K;
    T.push({x:K.van[0],z:K.van[1],r:1.6,label:'Tour van · back to Perth (Tudor Lane)',act:()=>endTour()});
    if(TOUR&&TOUR.T)T.push({x:K.van[0]+1.4,z:K.van[1],r:1.3,label:'Ask the guide',act:()=>{TOUR.i=(TOUR.i+1)%TOUR.T.guide.length;say([TOUR.T.guide[TOUR.i]]);}});
    if(K.targets)try{K.targets(T);}catch(e){console.error(e);}};}
})();
// ---------- 3D overworld <-> day-trip maps (Look Lab ?ow3d / ?ow2): park the car at Lancelin or the Pinnacles and walk; drive back from the van spot ----------
var OWTRIP=null;
function owTripEnter(id){if(!TRIP_ON||!TRIPS[id]||!TRIPS[id].K)return false;const T=TRIPS[id],K=T.K;overlay=null;transit=true;fadeTarget=.95;toast('Parking at '+T.name+'…',1.6);
  setTimeout(()=>{if(typeof tripEnsure==='function')tripEnsure(id);player.bike=false;player.carry=null;player.x=K.arrive[0];player.z=K.arrive[1];S.time+=20;updateCamera(0,true);hideOverlays();fadeTarget=0;transit=false;S.seenZ=S.seenZ||{};S.seenZ[id]=1;OWTRIP=id;save();toast(T.title+' · your car waits by the road',2.6);},700);return true;}
function owTripBack(){const k=OWTRIP;OWTRIP=null;if(typeof openWorld==='function')openWorld(k);}
{const _tg=cbdTargets;cbdTargets=function(T){_tg(T);if(!OWTRIP||TOUR)return;const zq=zoneOf(player.x);if(zq!==OWTRIP)return;const P=TRIPS[zq];if(!P||!P.K)return;
  let hit=false;for(const t of T)if(/^Tour van/.test(t.label||'')){t.label='Drive back · your car on the coast road';t.act=owTripBack;hit=true;}
  if(!hit)T.push({x:P.K.van[0],z:P.K.van[1],r:1.6,label:'Drive back · your car on the coast road',act:owTripBack});};}
{const _et=endTour;endTour=function(){if(OWTRIP&&!TOUR){owTripBack();return;}return _et.apply(this,arguments);};}
// build a trip map the first time it is needed (the tour van, the outer-world gate, or Kip standing in it)
function tripEnsure(k){const T=TRIPS[k];if(!T||!T.K||T.built)return;T.built=true;const K=T.K;
  if(TRIP_BUILD[k])try{TRIP_BUILD[k](T.G,K);}catch(e){console.error('trip '+k,e);}
  const Z=ZONE_DEF[k];if(Z){Z.rects=K.zone.rects;Z.labels=K.zone.labels;}SAFE_SPOTS[k]=[K.arrive];}
// a trip with a walkable map replaces the old diorama page for that tour
function tripForTour(id){if(!TRIP_ON)return null;for(const k in TRIPS)if(TRIPS[k].tour===id&&TRIP_BUILD[k])return k;return null;}
{const _st=startTour;startTour=function(id){const k=tripForTour(id);if(!k)return _st(id);if(transit||VISIT)return;const T=TOURS.find(t=>t.id===id);transit=true;fadeTarget=.95;toast('The tour van leaves Tudor Lane…',2);
  setTimeout(()=>{tripEnsure(k);const K=TRIPS[k].K;TOUR={T,i:0,trip:k,t0:S.time};player.bike=false;player.carry=null;player.x=K.arrive[0];player.z=K.arrive[1];S.time+=Math.round(T.hrs*60*.25);updateCamera(0,true);fadeTarget=0;transit=false;
    S.tours=S.tours||{};S.tours[T.id]=(S.tours[T.id]||0)+1;S.seenZ=S.seenZ||{};S.seenZ[k]=1;save();say(['Guide: '+T.guide[0].replace(/^Guide: /,'')]);},900);};}
{const _et=endTour;endTour=function(){if(TOUR&&TOUR.trip){const T=TOUR.T,t0=TOUR.t0;TOUR=null;transit=true;fadeTarget=.95;
    setTimeout(()=>{S.time=Math.max(S.time,t0+T.hrs*60);const [x,z]=hqTpSpot(TOUR_DESK.x+.6,TOUR_DESK.z);player.x=x;player.z=z;updateCamera(0,true);fadeTarget=0;transit=false;toast('Back in Tudor Lane after a day at '+T.name,2.6);save();},700);return;}
  return _et();};}
