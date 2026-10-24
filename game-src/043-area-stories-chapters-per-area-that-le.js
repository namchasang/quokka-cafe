// ---------- Area stories: chapters per area that lead Kip to places, people, activities and postcards ----------
// step = [label, postcard id] or [label, {check:()=>bool, at:()=>({x,z}) }]
let _story=null;
function STORY_DEF(){if(_story)return _story;const g=()=>S.qg||{};const vpDish=()=>VP_SHOPS.filter(sh=>sh.dish).slice(0,4);
 _story={
 island:{name:'Rottnest Island',short:'Rottnest',chapters:[
  {title:'Welcome to Wadjemup',giver:'Gus',intro:'G’day, Kip! Every new islander does the welcome walk. Snap the jetty, your café, a quokka and, well, me. Send the postcards home to Mum and Dad!',outro:'Ha! Now you’re a proper Rottnest local. The lighthouse keepers up the hill have a story for you next.',coins:40,
   steps:[['Photograph Main Jetty','jetty'],['Open the café and serve your first tourist',{check:()=>(S.servedTotal||0)>0,at:()=>({...IW(0,-1.65),label:'Café counter'})}],['Photograph Quokka Cafe','cafe'],['Find and photograph a wild quokka','quokka'],['Take a photo of Gus the ferry master','gus']]},
  {title:'Lights on the hill',giver:'Nana Wren',intro:'Tweet! Two lighthouses guard this island, and between them sits a lake as pink as a galah. Walk up there after the café closes and you’ll see.',outro:'You read the old stone too? Then you know Wadjemup is much older than any lighthouse. Off you go west now, the bays are waiting.',coins:60,
   steps:[['Climb to Wadjemup Lighthouse','wadjemup'],['Photograph the pink salt lake','pinklake'],['Read the Pink lakes stone','lore3'],['Visit Bathurst Lighthouse','bathurst'],['Catch a seagull on camera','gull']]},
  {title:'Bays of the west end',giver:'Kip’s map',intro:'Kip: The island keeps going west. Swimming bays, an old gun battery and a tiny train. Let’s explore it all.',outro:'Kip: I’ve seen every corner of Wadjemup! Time to take this postcard collection up the Swan River.',coins:80,
   steps:[['Swim spot: The Basin','basin'],['Ride or walk to Geordie Bay','geordie'],['Snack stop: Geordie Bay Store','geostore'],['Explore Oliver Hill Battery','oliverhill'],['Photograph the Quokka Express train','qexpress'],['Visit Quokka Village','village']]}]},
 sp:{name:'South Perth',short:'South Perth',chapters:[
  {title:'Up the Swan River',giver:'Captain Ruth',intro:'Welcome to Mends Street, love. Best view of the city is from right here on the foreshore. Grab a few snaps before you get busy.',outro:'Lovely. Mei at the grocer has been asking about you, go say hi.',coins:40,
   steps:[['Photograph Mends Street Jetty','mends'],['Take a photo with Captain Ruth','ruthpc'],['Find the Origami Quokka sculpture','origami'],['Photograph the Perth city skyline from the foreshore','skyline']]},
  {title:'Market morning',giver:'Mei',intro:'Kip! I buy the best produce on the river. Bring me something from your garden, and check out the market and nursery while you’re here.',outro:'Fresh from Rottnest! You’re going to do well here. Have a wander down Mill Point Road some time.',coins:60,
   steps:[['Photograph Mei at the Swan River Grocer','meipc'],['Sell your garden produce to Mei',{check:()=>!!g().sold,at:()=>({x:mei.x,z:mei.z,label:'Sell produce to Mei'})}],['Visit Swan Market','market'],['Browse Swan Seeds Nursery','seeds'],['Fill up at Mends Servo','servo']]},
  {title:'A Mill Point stroll',giver:'Kip’s map',intro:'Kip: Purple jacarandas, an old post office and those tall towers. Mill Point Road is worth a slow walk.',outro:'Kip: South Perth done! Next stop: the bus to Heirisson Island.',coins:80,
   steps:[['Walk Mill Point Road','millpoint'],['Find the Old Post Office','postoffice'],['Photograph The Mill Point Hotel','millhotel'],['Look up at Mill Point Towers','residences'],['Catch a jacaranda in bloom','jacaranda']]}]},
 hi:{name:'Heirisson Island',short:'Heirisson',chapters:[
  {title:'Kangaroos in the city',giver:'Sanctuary sign',intro:'Sign: Western grey kangaroos live on this island in the middle of the Swan River. Please walk quietly and keep your distance.',outro:'Kip: A joey peeked out of the pouch! Best day ever. Home in Victoria Park is one more bus stop away.',coins:60,
   steps:[['Spot a western grey kangaroo','roo'],['Find a joey in the pouch','joey'],['Photograph the black swans','swan'],['Find the Australian pelican','pelican'],['Visit the Yagan Memorial','yagan']]}]},
 freo:{name:'Fremantle',short:'Freo',chapters:[
  {title:'The port city',giver:'Skipper Lou',intro:'Welcome to Walyalup, Fremantle! I’ve sailed in here a thousand times. Start with the harbour: the B-Shed, the museum and the Round House on the hill.',outro:'Now you’ve got your sea legs. Go and have a coffee on the strip.',coins:60,
   steps:[['Photograph B-Shed ferry terminal','bshed'],['Take a photo with Skipper Lou','lou'],['Visit the WA Maritime Museum','museum'],['Climb up to the Round House','roundhouse'],['Walk Bathers Beach','bathers']]},
  {title:'Cappuccino Strip',giver:'Khun Noi',intro:'Sawasdee ka, Kip! I run Tasty Thai on the strip. Come and eat, then explore the market behind us.',outro:'You’re family here now. The harbour and the old prison have more stories.',coins:80,
   steps:[['Walk the Cappuccino Strip','strip'],['Coffee at Pippo’s','ninos'],['Eat at Freo Thai Basil','tastythai'],['Take a photo with Khun Noi','noipc'],['Shop at Freo Markets','freomkts']]},
  {title:'Harbour and history',giver:'Prison guide',intro:'Fremantle Prison is the oldest building of its kind in WA. Before the tour, enjoy the park, the wheel and the best fish and chips in town.',outro:'Tour’s over! You’ve seen the best of Freo, mate.',coins:100,
   steps:[['Relax at Esplanade Park','esplanade'],['Ride past the Ferris wheel','wheelpc'],['Find the I ♥ FREO sign','ilovefreo'],['Fish and chips at the Salty Gull','chiccos'],['Fishing Boat Harbour','fbh'],['Visit Fremantle Prison','prisonpc'],['Take a photo with the prison guide','guide']]}]},
 vp:{name:'Victoria Park',short:'Vic Park',chapters:[
  {title:'Welcome to Albany Highway',giver:'Albany Hwy busker',intro:'Hey hey, look who’s back! Albany Highway missed you. Food from all over Asia, street art and the train to the city. Have a look around.',outro:'Now you’re hungry, right? Go eat!',coins:60,
   steps:[['Photograph Albany Highway','albany'],['Take a photo of the busker','busker'],['Find the street mural','mural'],['Visit Victoria Park Station','station']]},
  {title:'Food street',giver:'Kip’s appetite',intro:'Kip: Pho, BBQ, ramen, bubble tea… the street I grew up on. Time to try them all again, one by one.',outro:'Kip: Still the best food street in Perth. Next time I’ll bring Mum and Dad back here for dinner!',coins:80,
   steps:()=>vpDish().map(sh=>['Eat '+sh.dish+' at '+sh.name,{check:()=>!!(S.fq&&S.fq['vp_'+sh.id]),at:()=>({x:sh.npc.x,z:sh.npc.z,label:sh.dish+' at '+sh.name})}]).concat([['Night market after 5:30pm','nightmkt']])}]}};
 return _story;}
const STORY_ORDER=['island','sp','hi','freo','vp'];
function storyChap(a){const D=STORY_DEF()[a];const n=(S.story&&S.story[a])||0;return n<D.chapters.length?D.chapters[n]:null;}
function chapSteps(c){return typeof c.steps==='function'?c.steps():c.steps;}
function stepDone(st){const t=st[1];if(typeof t==='string')return !!(S.pc&&S.pc[t]);try{return !!t.check();}catch(e){return false;}}
function stepTarget(st){const t=st[1];if(typeof t==='string'){const p=PCS.find(q=>q.id===t);if(!p)return null;let l=[];try{l=p.pos();}catch(e){}if(!l.length)return null;let b=l[0],bd=1e9;l.forEach(q=>{const d=Math.hypot(q[0]-player.x,q[1]-player.z);if(d<bd){bd=d;b=q;}});return{x:b[0],z:b[1],label:'\u{1F4F7} '+p.name};}try{return t.at();}catch(e){return null;}}
function storyOpen(a){if(a==='island')return true;S.seenZ=S.seenZ||{};return !!S.seenZ[a];}
let storyT=0;
function storyTick(dt){if(VISIT||!running||dlgOpen())return;storyT-=dt;if(storyT>0)return;storyT=.6;S.story=S.story||{};S.seenZ=S.seenZ||{};S.storyIntro=S.storyIntro||{};
  const z=zoneOf(player.x);if(!S.seenZ[z]){S.seenZ[z]=1;save();}
  const c=storyChap(z);if(c){const key=z+':'+(S.story[z]||0);if(!S.storyIntro[key]&&!overlay&&!transit){S.storyIntro[key]=1;save();const D=STORY_DEF()[z];say([{who:c.giver,text:c.intro},{who:'New chapter',text:D.short+' story · Chapter '+((S.story[z]||0)+1)+': '+c.title+'. Open Quests to track it.'}]);return;}}
  STORY_ORDER.forEach(a=>{const ch=storyChap(a);if(!ch||!storyOpen(a)||!S.storyIntro[a+':'+(S.story[a]||0)])return;if(chapSteps(ch).every(stepDone)){const D=STORY_DEF()[a];S.story[a]=(S.story[a]||0)+1;const pay=rw(ch.coins);S.coins+=pay;save();const nx=storyChap(a);
    say([{who:ch.giver,text:ch.outro},{who:'Chapter complete',text:D.short+' · '+ch.title+' · +'+pay+' coins'+(nx?'. Next: '+nx.title:'. '+D.name+' story complete!')}]);if(S.track==='story_'+a&&!nx)S.track=null;}});}
function storyQuests(){return STORY_ORDER.map(a=>{const D=STORY_DEF()[a];const n=(S.story&&S.story[a])||0,tot=D.chapters.length;const c=storyChap(a);
  if(!c)return{id:'story_'+a,title:D.short+' story · complete',giver:D.name,desc:'Every chapter of the '+D.name+' story is done. Thanks for exploring!',steps:D.chapters.map((ch,i)=>['Chapter '+(i+1)+': '+ch.title,true]),reward:'All chapter rewards collected',open:storyOpen(a)};
  return{id:'story_'+a,title:D.short+' · Ch '+(n+1)+'/'+tot+': '+c.title,giver:'Story · '+c.giver,desc:c.intro,steps:chapSteps(c).map(st=>[st[0],stepDone(st)]),reward:rw(c.coins)+' coins'+(n+1<tot?' and the next chapter':' and the '+D.name+' story is complete'),open:storyOpen(a)};});}
function storyTarget(a){if(zoneOf(player.x)!==a)return null;const c=storyChap(a);if(!c)return null;const st=chapSteps(c).find(x=>!stepDone(x));return st?stepTarget(st):null;}

