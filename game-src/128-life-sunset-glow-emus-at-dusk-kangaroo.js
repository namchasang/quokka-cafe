// ===== life: sunset glow, emus at dusk, kangaroos, visitors, cars on the loop =====
const EMU={x:1092,z:-24};
const _c=new THREE.Color(),_s=new THREE.Color('#ffb070');
K.tick=function(dt,t){dt=Math.min(dt,.1);const h=tod();
  // the spires glow orange late in the afternoon
  const g=h>14&&h<20?Math.exp(-Math.pow((h-17.9)/.85,2)):0;if(PIN._g!==g){PIN._g=g;SPM.emissive.setRGB(.42*g,.16*g,.03*g);if(PIN.sandM){PIN.sandM.emissive=PIN.sandM.emissive||new THREE.Color();PIN.sandM.emissive.setRGB(.12*g,.05*g,0);}}
  SIGNMATS.forEach(m=>{const n=typeof NIGHT==='number'?NIGHT:0;m.emissive.setRGB(.16+n*.1,.14+n*.08,.1+n*.05);});
  // emus: out on the sand from late afternoon until after dark
  const show=h>=16.6&&h<20.4;PIN.emus.forEach((e,i)=>{e.m.visible=show;e.sh.visible=show;if(!show)return;const a=t*.07+e.ph,x=EMU.x+Math.cos(a)*7.5,z=EMU.z+Math.sin(a)*4.2;
    e.x=x;e.z=z;e.m.position.set(x,H(x,z),z);e.sh.position.set(x,H(x,z)+.03,z);setFrame(e.m,Math.floor(t*3+i)%2);e.m.scale.x=Math.sin(a)>0?-1:1;});
  // kangaroos: graze, then hop to a new spot near home
  PIN.roos.forEach(k=>{if(k.wait>0){k.wait-=dt;setFrame(k.m,0);}else{const dx=k.tx-k.x,dz=k.tz-k.z,d=Math.hypot(dx,dz);if(d<.15){k.wait=2+R()*6;const a=R()*6.283,rad=2+R()*6;const nx=k.hx+Math.cos(a)*rad,nz=k.hz+Math.sin(a)*rad;if(!spHit(nx,nz,.6)&&nx>X1+3&&nx<X2-3&&nz>Z1+4&&nz<Z2-3){k.tx=nx;k.tz=nz;}}
      else{const s=Math.min(d,2.6*dt);k.x+=dx/d*s;k.z+=dz/d*s;k.hop+=dt*5;setFrame(k.m,Math.floor(k.hop)%2);if(Math.abs(dx)>.05)k.m.scale.x=dx>0?1:-1;}}
    const y=H(k.x,k.z),lift=k.wait>0?0:Math.abs(Math.sin(k.hop*Math.PI))*.25;k.m.position.set(k.x,y+lift,k.z);k.sh.position.set(k.x,y+.03,k.z);});
  if(PIN.bbq&&PIN.bbq.t>0){const q=PIN.bbq;q.t-=dt;q.SZ.visible=q.t>0;q.smoke.forEach((m,i)=>{const a=((t*.5+i/4)%1);m.position.set(q.x-.3+i*.15,q.y+1+a*1.4,q.z-.05);m.material.opacity=.45*(1-a);m.scale.setScalar(.6+a*1.4);m.quaternion.copy(camera.quaternion);});}
  // visitors: stroll between spires, stop for photos
  PIN.npcs.forEach(n=>{if(n.wait>0){n.wait-=dt;setFrame(n.m,0);}else{const dx=n.tx-n.x,dz=n.tz-n.z,d=Math.hypot(dx,dz);
      if(d<.12){n.wait=n.photo?6+R()*8:2+R()*5;for(let k=0;k<8;k++){const nx=n.hx+(R()-.5)*14,nz=n.hz+(R()-.5)*10;if(nx>X1+4&&nx<X2-4&&nz>Z1+5&&nz<Z2-4&&loopD(nx,nz)>2.8&&heathW(nx,nz)<.5&&!spHit(nx,nz,.5)){n.tx=nx;n.tz=nz;break;}}}
      else{const s=Math.min(d,.85*dt),nx=n.x+dx/d*s,nz=n.z+dz/d*s;if(spHit(nx,nz,.25)){n.tx=n.x;n.tz=n.z;}else{n.x=nx;n.z=nz;}n.step+=dt*5;setFrame(n.m,1+Math.floor(n.step)%2);}}
    const y=H(n.x,n.z);n.m.position.set(n.x,y,n.z);n.sh.position.set(n.x,y+.03,n.z);});
  // cars: slowly round the one-way loop, waiting if Kip is in the way
  PIN.cars.forEach(c=>{const p=LOOP.getPointAt(c.u),tg=LOOP.getTangentAt(c.u);const ax=p.x+tg.x*3-player.x,az=p.z+tg.z*3-player.z;const block=Math.hypot(ax,az)<2.6||PIN.cars.some(o=>o!==c&&((o.u-c.u+1)%1)<9/LOOPL);
    if(!block)c.u=(c.u+c.v*dt/LOOPL)%1;c.g.position.set(p.x,H(p.x,p.z),p.z);c.g.rotation.y=Math.atan2(-tg.z,tg.x);});};
// ===== the map =====
{const rects=[[X1,Z1,X2,Z2,'#e8b85a'],[X1,Z1,1013,Z2,'#8aa860'],[X1,Z1,X2,-37,'#8aa860'],[1111,Z1,X2,Z2,'#8aa860'],[X1,40,X2,Z2,'#8aa860']];
  for(let i=0;i<LP.length;i+=5)rects.push([LP[i].x-1.6,LP[i].z-1.6,LP[i].x+1.6,LP[i].z+1.6,'#f4d68a']);
  for(let i=0;i<TP.length;i+=4)rects.push([TP[i].x-.7,TP[i].z-.7,TP[i].x+.7,TP[i].z+.7,'#efe0b4']);
  rects.push([CP.x1,CP.z1,CP.x2,CP.z2,'#9a948a'],[CEN.x1,CEN.z1,CEN.x2,CEN.z2,'#cdb282'],[DECK.x1,DECK.z1,DECK.x2,DECK.z2,'#eadcb8'],[PIC.x1,PIC.z1,PIC.x2,PIC.z2,'#7aa05a']);
  K.zone={rects,labels:[['The Pinnacles',1068,-6,1],['Discovery Centre',1012,26,0],['Lookout',1023,23.6,0],['Car park',1040,43,0],['Desert loop',1092,-10,0],['Desert View trail',1009,-26,0],['Sunset dune',1078,-21,0],['Picnic area · BBQ',1024,44,0]]};}
};
// ---------- Day-trip places (Look Lab ?trip, Paul Nov 2026): Lancelin, the Pinnacles, Busselton Jetty and Esperance become walkable maps ----------
// Each one sits far east of the airport in its own strip of x (zone ids lan / pin / bus / esp). The Siam Sydney Services van in Tudor Lane takes
// Kip there; the van waits by the car park and brings him back to Tudor Lane by evening. Each place is built by TRIP_BUILD[id](G,K) into its own group:
// it sets K.walk(x,z), K.h(x,z) (ground height), K.arrive [x,z], K.van [x,z], and may set K.targets(T), K.tick(dt,t), K.zone (map rects/labels).
var TRIP_LIVE=false;var TRIP_ON=TRIP_LIVE||/[?&#](lab|trip|ow3d|ow2)\b/.test(location.search+location.hash);
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
