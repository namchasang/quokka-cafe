// ---------- stations and ports (Paul, Oct 2026): walk in, pick a town, step off at its station or jetty ----------
const HUBS={train:{word:'Train',many:'Trains',fare:5,mins:25,stops:{cbd:{n:'Perth Station',x:680,z:-21.6},freo:{n:'Fremantle Station',x:297.5,z:-9.9},vp:{n:'Victoria Park Station',x:558.6,z:-6.4},air:{n:'Airport Central',x:726,z:12.4}}},
  ferry:{word:'Ferry',many:'Ferries',fare:8,mins:35,stops:{cbd:{n:'Barrack St Jetty',x:670.6,z:17.2},sp:{n:'Mends St Jetty',x:SPX+.4,z:-8.2},freo:{n:'B-Shed ferry terminal',x:285,z:-9.6},island:{n:'Thomson Bay jetty',x:IW(-16,4.4).x+1.6,z:IW(-16,4.4).z+1.2}}}};
function openHub(mode,from){const H=HUBS[mode],F=H.stops[from];const lockedFreo=typeof freoUnlocked==='function'&&!freoUnlocked();
  openTravel('Where to?',F.n+' · '+H.many.toLowerCase(),Object.keys(H.stops).map(z=>({id:z,name:TOWN_NAME[z]+' · '+H.stops[z].n,here:z===from,
    note:z===from?'':'About '+H.mins+' min',fare:H.fare,lock:z!==from&&(z==='freo'||from==='island'&&z!=='island')&&mode==='ferry'&&lockedFreo?'Locked (see Quests)':null,ride:()=>hubGo(mode,z)})),mode==='train'?'Pick a town and step off at its station. One fare, any stop on the line.':'Pick a town and step off at its jetty. One fare, any jetty on the route.');}
function hubGo(mode,z){if(transit||VISIT)return;const H=HUBS[mode],D=H.stops[z];transit=true;fadeTarget=.95;toast(H.word+' to '+D.n+'…',1.8);
  setTimeout(()=>{S.time+=H.mins;player.bike=false;player.carry=null;const [x,zz]=hqTpSpot(D.x,D.z);player.x=x;player.z=zz;updateCamera(0,true);hideOverlays();fadeTarget=0;transit=false;
    S.seenZ=S.seenZ||{};S.seenZ[z]=1;if(z==='cbd'&&typeof cbdArrive==='function')cbdArrive('cbd');save();},900);}
{const _th=cbdTargets;cbdTargets=function(T){_th(T);let zq;try{zq=zoneOf(player.x);}catch(e){return;}
  Object.keys(HUBS).forEach(mode=>{const st=HUBS[mode].stops[zq];if(!st)return;if(!st.ok){st.ok=1;if(blocked(st.x,st.z)){outer:for(let r=.4;r<5;r+=.4)for(let a=0;a<16;a++){const x=st.x+Math.cos(a/16*6.283)*r,z=st.z+Math.sin(a/16*6.283)*r;if(!blocked(x,z)){st.x=x;st.z=z;break outer;}}}}T.push({x:st.x,z:st.z,r:1.4,label:HUBS[mode].many+' · '+st.n+' · pick a town',act:()=>openHub(mode,zq)});});};}
// ---------- Siam Sydney Services (Paul, Oct 2026): a tour desk in Tudor Lane, day tours to WA towns we have models of ----------
// The tour is a day out: the tour van leaves Tudor Lane, you look round the town model with the guide, then you're back by evening.
const TOURS=[{id:'lancelin',name:'Lancelin Sand Dunes',price:600,hrs:7,note:'White dunes, sandboarding and crays on the Indian Ocean Drive',
    guide:['Guide: Welcome to Lancelin! These white dunes are some of the tallest on the coast.','Guide: Grab a board and slide down. Mind the kite surfers on the water!','Guide: The little jetty is where the cray boats come in at dawn.']},
  {id:'pinnacles',name:'The Pinnacles',price:900,hrs:9,note:'Thousands of limestone spires in yellow sand, emus at sunset',
    guide:['Guide: These spires are limestone, shaped by wind and rain over a very long time.','Guide: Keep an eye out: emus and kangaroos cross the desert loop at dusk.','Guide: Stay on the track, the sand is softer than it looks!']},
  {id:'busselton',name:'Busselton Jetty',price:800,hrs:8,note:'A long timber jetty with its own little train and an underwater observatory',
    guide:['Guide: The jetty runs almost two kilometres out over the bay.','Guide: Hop on the little train to the end, then go down under the water.','Guide: The beach huts along the foreshore are painted every colour.']},
  {id:'esperance',name:'Esperance · Lucky Bay',price:2000,hrs:12,note:'The whitest sand, turquoise water and kangaroos on the beach',
    guide:['Guide: That sand squeaks when you walk on it. It is that white!','Guide: The kangaroos here love the beach. Please don’t feed them.','Guide: Those granite headlands glow pink when the sun goes down.']}];
const TOUR_DESK={x:655.6-.55,z:-9.4};
// the office in the lane: a sign on the wall, a little counter, a stand of brochures
{const wx=655.6-1.08,sg=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.42),new THREE.MeshBasicMaterial({map:makeSign(['SIAM SYDNEY SERVICES'],96,12,'#1d3a6e','#ffd34d')}));sg.rotation.y=Math.PI/2;sg.position.set(wx+.02,2.25,TOUR_DESK.z);scene.add(sg);
  const sb=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.3),new THREE.MeshBasicMaterial({map:makeSign(['DAY TOURS · WA'],64,12,'#f5ecd8','#1d3a6e')}));sb.rotation.y=Math.PI/2;sb.position.set(wx+.02,1.9,TOUR_DESK.z);scene.add(sb);
  const desk=new THREE.Mesh(new THREE.BoxGeometry(.45,.8,1.1),new THREE.MeshLambertMaterial({color:new THREE.Color('#6a4a32')}));desk.position.set(wx+.25,.4,TOUR_DESK.z);desk.castShadow=desk.receiveShadow=true;scene.add(desk);
  const top=new THREE.Mesh(new THREE.BoxGeometry(.5,.05,1.15),new THREE.MeshLambertMaterial({color:new THREE.Color('#f5ecd8')}));top.position.set(wx+.25,.82,TOUR_DESK.z);scene.add(top);
  const bc=mk(8,12),bx=bc.getContext('2d');['#e8732a','#3e9ad8','#f2c428','#3ec46a'].forEach((c,i)=>{bx.fillStyle=c;bx.fillRect((i%2)*4,(i>>1)*6,4,6);bx.fillStyle='#f5ecd8';bx.fillRect((i%2)*4+1,(i>>1)*6+1,2,1);});
  const br=new THREE.Mesh(new THREE.PlaneGeometry(.4,.6),new THREE.MeshLambertMaterial({map:ctex(bc)}));br.rotation.y=Math.PI/2;br.position.set(wx+.03,1.25,TOUR_DESK.z+.9);scene.add(br);}
