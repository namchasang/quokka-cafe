// ---------- Story: getting around Perth, and the road trip to Nok in Cervantes (Paul, Nov 2026) ----------
// Two new story lines. "Getting around Perth" starts the first time Kip reaches the mainland: a ferry, then the train from Perth Station
// to Victoria Park and back. "Road trip to Cervantes" (Look Lab outer world + day-trip maps for now): a letter from Nok, Kip's Thai friend
// from uni who opened a restaurant in Cervantes; rent a car in Victoria Park, drive the coast road north, meet Nok, then she shows Kip around.
function rideLog(kind,to){S.rides=S.rides||{};S.rides[kind]=(S.rides[kind]||0)+1;if(to){S.rideTo=S.rideTo||{};S.rideTo[kind+':'+to]=1;}}
const CARHIRE={x:584.2,z:2.2};// Vic Park Car Hire kiosk, by the east end of Albany Hwy
// the outer world opens once the Perth story is done (Paul, Nov 2026); the Look Lab and the Game Master can always go
const PERTH_STORY=['sp','hi','freo','vp','cbd'];
function perthStoryDone(){const D=STORY_DEF();return PERTH_STORY.every(a=>D[a]&&S.story&&(S.story[a]||0)>=D[a].chapters.length);}
function owUnlocked(){return perthStoryDone()||/[?&#](lab|ow2|ow3d|owgo)\b/.test(location.search+location.hash)||(typeof isGM==='function'&&isGM());}
function roadOn(){return typeof OW3D_ON!=='undefined'&&OW3D_ON&&typeof TRIP_ON!=='undefined'&&TRIP_ON;}
{const _sd=STORY_DEF;STORY_DEF=function(){const s=_sd();if(s.perth)return s;
  const ats=(lbl,list)=>()=>{const z=zoneOf(player.x),p=list[z]||list.any;return p?{x:p[0],z:p[1],label:lbl}:null;};
  s.perth={name:'Getting around Perth',short:'Perth transport',zones:['sp','cbd','vp','hi','freo'],chapters:[
   {title:'Ferries and trains',giver:'Station master Bev',intro:'G’day Kip! I’m Bev, I run the trains. Perth is easy once you know the tricks: ferries hop across the river, and trains run between Perth Station, Fremantle, Victoria Park and the airport. Walk onto the platform, step through an open door, pick where you’re going. Give it a go!',
    outro:'There you go, a proper Perth commuter! Tap your map any time to see the lines. And keep your eyes on your letterbox in Vic Park, I reckon someone’s writing to you.',coins:80,
    steps:[['Ride the ferry across the Swan River',{check:()=>!!(S.rides&&S.rides.ferry),at:ats('Ferry jetty',{sp:[150,-4.6],cbd:[652,-12]})}],
     ['Board a train at Perth Station',{check:()=>!!(S.rides&&S.rides.train),at:()=>({x:680,z:HUBS.train.stops.cbd.z,label:'Perth Station'})}],
     ['Ride the train to Victoria Park',{check:()=>!!(S.rideTo&&S.rideTo['train:vp']),at:ats('Train to Victoria Park',{cbd:[680,HUBS.train.stops.cbd.z],any:[680,HUBS.train.stops.cbd.z]})}],
     ['Ride the train back to Perth Station',{check:()=>!!(S.rideTo&&S.rideTo['train:cbd']),at:ats('Victoria Park Station',{vp:[558.6,-6.4]})}]]}]};
  s.road={name:'Road trip to Cervantes',short:'Road trip',zones:['vp','cer','pin','lan'],chapters:[
   {title:'A letter from Nok',giver:'Nok (letter)',intro:'Kip!! It’s Nok from uni. I did it, I opened my own little Thai restaurant by the beach in Cervantes! Rent a car in Vic Park and drive up the coast road, it’s about two hours north. I’ll cook you crayfish green curry and show you the Pinnacles. ขับรถดีๆ นะ! Nok xx',
    outro:'Nok: KIP! You made it! Look at you, a café owner! Sit, sit, eat first. Tomorrow I’m taking you to see the Pinnacles and the big white dunes.',coins:150,
    steps:[['Rent a car at Vic Park Car Hire',{check:()=>!!(S.road&&S.road.car),at:()=>({x:CARHIRE.x,z:CARHIRE.z,label:'Vic Park Car Hire'})}],
     ['Drive the coast road north to Cervantes',{check:()=>!!(S.seenZ&&S.seenZ.cer),at:()=>zoneOf(player.x)==='vp'?{x:CARHIRE.x,z:CARHIRE.z,label:'Your hire car'}:null}],
     ['Find Nok’s Thai Kitchen',{check:()=>!!(S.road&&S.road.nok),at:()=>{const K=TRIPS.cer&&TRIPS.cer.K;return K&&K.nok?{x:K.nok[0],z:K.nok[1],label:'Nok’s Thai Kitchen'}:null;}}]]},
   {title:'Nok shows you around',giver:'Nok',intro:'Nok: Okay tour guide mode! First the Pinnacles, thousands of stone spires in yellow sand, best at sunset. Then the Lancelin dunes on the way home, they are SO white. Come back for dinner after!',
    outro:'Nok: Best day. Come back any time Kip, the curry pot is always on. And tell your Mum and Dad there’s a room for them here too!',coins:200,
    steps:[['Walk among the Pinnacles with Nok',{check:()=>!!(S.seenZ&&S.seenZ.pin)}],
     ['Climb the Lancelin dunes',{check:()=>!!(S.seenZ&&S.seenZ.lan)}],
     ['Dinner at Nok’s: crayfish green curry',{check:()=>!!(S.road&&S.road.dinner),at:()=>{const K=TRIPS.cer&&TRIPS.cer.K;return K&&K.nok?{x:K.nok[0],z:K.nok[1],label:'Dinner at Nok’s'}:null;}}]]}]};
  return s;};}
STORY_ORDER.push('perth','road');
// a story line can open in several zones: intro and the quest arrow follow those zones too
{const _so=storyOpen;storyOpen=function(a){if(a==='perth'){S.seenZ=S.seenZ||{};return !!(S.seenZ.sp||S.seenZ.cbd||S.seenZ.vp);}if(a==='road')return roadOn()&&perthStoryDone();return _so(a);};}
{const _st=storyTarget;storyTarget=function(a){const D=STORY_DEF()[a];if(D&&D.zones){if(!D.zones.includes(zoneOf(player.x))||!storyOpen(a))return null;const c=storyChap(a);if(!c)return null;const st=chapSteps(c).find(x=>!stepDone(x));return st?stepTarget(st):null;}return _st(a);};}
{let tt=0;const _tk=storyTick;storyTick=function(dt){_tk(dt);tt-=dt;if(tt>0||VISIT||!running||dlgOpen()||overlay||transit)return;tt=.7;const z=zoneOf(player.x);S.storyIntro=S.storyIntro||{};
  for(const a of ['perth','road']){const D=STORY_DEF()[a];if(!D.zones.includes(z)||!storyOpen(a))continue;const c=storyChap(a);if(!c)continue;const key=a+':'+(S.story[a]||0);
    if(!S.storyIntro[key]){S.storyIntro[key]=1;save();say([{who:c.giver,text:c.intro},{who:'New chapter',text:D.short+' story · Chapter '+((S.story[a]||0)+1)+': '+c.title+'. Open Quests to track it.'}]);return;}}};}
// Vic Park Car Hire: a small kiosk with a hatchback out front; renting opens the outer world from Victoria Park in the hire car
(()=>{if(typeof bld!=='function'||!/[?&#](lab|ow3d|ow2|owgo)\b/.test(location.search+location.hash))return;// only with the outer world (Look Lab until it goes live)
  const g=new THREE.Group();g.position.set(CARHIRE.x,0,CARHIRE.z);scene.add(g);
  const M=c=>new THREE.MeshLambertMaterial({color:c});const bx=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m;};
  bx(2.4,2.1,1.6,'#f4f1ea',0,1.05,-.6);bx(2.7,.14,2.0,'#2f6fb0',0,2.16,-.5);bx(1.4,.9,.1,'#cfe6f2',0,1.35,.22);bx(2.2,.5,.9,'#2f6fb0',0,.25,.55);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.3,.42),new THREE.MeshBasicMaterial({map:makeSign(['VIC PARK CAR HIRE'],92,16,'#2f6fb0','#ffffff')}));sg.position.set(0,2.45,.42);g.add(sg);
  const car=new THREE.Group();car.position.set(2.6,0,.6);g.add(car);const cb=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=true;car.add(m);};
  cb(1.0,.42,2.0,'#e2584f',0,.42,0);cb(.9,.34,1.1,'#e2584f',0,.8,-.1);cb(.92,.26,.9,'#a8d8e8',0,.82,-.1);for(const[x,z]of[[-.48,.62],[.48,.62],[-.48,-.62],[.48,-.62]])cb(.12,.36,.36,'#2a2230',x,.2,z);
  if(typeof col==='function')col(CARHIRE.x-1.25,CARHIRE.z-1.45,CARHIRE.x+1.25,CARHIRE.z+.25);
  const _tg=cbdTargets;cbdTargets=function(T){_tg(T);if(zoneOf(player.x)!=='vp')return;
    T.push({x:CARHIRE.x,z:CARHIRE.z+1.1,r:1.6,label:S.road&&S.road.car?'Vic Park Car Hire · drive out (outer world)':'Vic Park Car Hire · rent a car (40 coins a day)',act:()=>{
      if(!roadOn()||!owUnlocked()){say([{who:'Vic Park Car Hire',text:'Sorry love, all our cars are booked out today. Try again soon!'}]);return;}
      if(!(S.road&&S.road.car)){if(!pay(40))return;S.road=S.road||{};S.road.car=1;save();say([{who:'Vic Park Car Hire',text:'Here are the keys! Little red hatch out the front. Head out east to Albany Hwy, then follow the signs north to the coast road. Drive safe!'}]);return;}
      if(typeof openWorld==='function')openWorld('vp','e');}});};})();

