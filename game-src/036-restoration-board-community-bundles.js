// ----- restoration board (community bundles) -----
const BUNDLES=[
 {id:'garden',name:'Garden bundle',desc:'5 strawberries, 2 pumpkins, 3 nectarines',reward:'Garden sprinkler + 60 coins',need:{straw:5,pump:2,nect:3},give:()=>{S.unlock.sprinkler=1;S.coins+=60;refreshPlots();}},
 {id:'ocean',name:'Ocean bundle',desc:'Catch 4 different kinds of fish',reward:'Better fishing rod (bigger catch bar) + 60 coins',check:()=>FISH.filter(f=>!f.junk&&(S.fdex||{})[f.id]).length>=4,give:()=>{S.coins+=60;}},
 {id:'explorer',name:'Explorer bundle',desc:'Collect 20 postcards',reward:'150 coins',check:()=>pcCount()>=20,give:()=>{S.coins+=150;}},
 {id:'cafe',name:'Café bundle',desc:'Serve 100 customers in total',reward:'Every drink pays +1 coin',check:()=>(S.servedTotal||0)>=100,give:()=>{}},
 {id:'friends',name:'Friendship bundle',desc:'Reach 3 hearts with 4 friends',reward:'200 coins',check:()=>FRIENDS.filter(f=>hearts(f.id)>=3).length>=4,give:()=>{S.coins+=200;}},
 {id:'museum',name:'Museum bundle',desc:'Donate 10 items to the museum',reward:'Golden quokka statue: +10% tips',check:()=>Object.keys(S.museum||{}).length>=10,give:()=>{}}];
function openBoard(){if(!running||overlay)return;renderBoard();showOverlay('board');}
function renderBoard(){S.bundles=S.bundles||{};const G=$('#bdGrid');G.innerHTML='';const done=BUNDLES.filter(b=>S.bundles[b.id]).length;$('#bdCount').textContent=done+' / '+BUNDLES.length+' bundles restored';
  BUNDLES.forEach(b=>{const d=document.createElement('div');d.className='gdC';const ok=S.bundles[b.id];const ready=!ok&&(b.need?Object.keys(b.need).every(k=>(S.inv[k]||0)>=b.need[k]):b.check());
    const t=document.createElement('div');t.className='gdT';t.textContent=b.name;if(ok){const s=document.createElement('span');s.className='gdTag';s.textContent='Restored';t.appendChild(s);}
    const p=document.createElement('p');p.textContent=b.desc+(b.need?' (you have '+Object.keys(b.need).map(k=>(S.inv[k]||0)+' '+CROPS[k].plural).join(', ')+')':'');const rw=document.createElement('p');rw.className='gdRw';rw.textContent='Reward: '+b.reward;d.append(t,p,rw);
    if(!ok){const bt=document.createElement('button');bt.type='button';bt.className='btn';bt.id='bd-'+b.id;bt.textContent=ready?'Complete bundle':'Not ready yet';bt.disabled=!ready;bt.onclick=()=>{if(b.need)Object.keys(b.need).forEach(k=>S.inv[k]-=b.need[k]);S.bundles[b.id]=1;b.give();save();renderBoard();toast(b.name+' restored! '+b.reward,3.5);};d.appendChild(bt);}G.appendChild(d);});}
// ----- mail -----
function makeMail(){S.mail=S.mail||[];if(S.mailDay===S.day)return;S.mailDay=S.day;const add=(from,text,coins)=>S.mail.unshift({day:S.day,from,text,coins:coins||0,read:false,got:false});
  if(S.day===1)add('Mum','Dear Kip, we’re so proud of you! Remember to eat your greens and say hi to the other quokkas. Love, Mum & Dad.',10);
  else if(S.day%7===0)add('Mum','Dear Kip, Dad fixed the old bike today. We miss your coffee! Here’s a little something for the café.',20);
  const tm=festToday(S.day+1);if(tm)add('Island Notice Board','Tomorrow: '+tm.name+'! '+tm.desc);const fe=festToday();if(fe)add('Island Notice Board','Today: '+fe.name+'! '+fe.desc);
  FRIENDS.forEach(f=>{if(f.bday[0]===seasonOf(S.day+1)&&f.bday[1]===dos(S.day+1))add('Kip’s notebook','Reminder: it’s '+f.name+'’s birthday tomorrow. A loved gift counts double!');});
  const h3=FRIENDS.filter(f=>hearts(f.id)>=4);if(h3.length&&S.day%5===0){const f=h3[S.day%h3.length];add(f.name,'Hi Kip! Thinking of you. Here’s a little thank-you for being such a good friend.',15);}
  if(S.mail.length>30)S.mail.length=30;}
function openMail(){if(!running||overlay)return;renderMail();showOverlay('mail');}
function renderMail(){const L=$('#mlList');L.innerHTML='';if(!(S.mail||[]).length){L.textContent='No letters yet.';return;}S.mail.forEach((m,i)=>{const d=document.createElement('div');d.className='gdC';const t=document.createElement('div');t.className='gdT';t.textContent=m.from+' · '+SEASONS[seasonOf(m.day)].s+' '+dos(m.day);if(!m.read){const s=document.createElement('span');s.className='gdTag';s.textContent='New';t.appendChild(s);}const p=document.createElement('p');p.textContent=m.text;d.append(t,p);
    if(m.coins&&!m.got){const b=document.createElement('button');b.type='button';b.className='btn';b.id='mail-'+i;b.textContent='Take '+m.coins+' coins';b.onclick=()=>{m.got=true;S.coins+=m.coins;save();renderMail();};d.appendChild(b);}L.appendChild(d);m.read=true;});save();syncDayVisuals();}
// ----- daily tasks -----
const DTASK={serve:['Serve 12 customers',12,()=>S.served||0],photo:['Take 2 postcard photos',2],fish:['Catch a fish',1],dig:['Dig up 2 spots',2],gift:['Give a gift to a friend',1],water:['Water 3 garden beds',3],bug:['Catch a bug',1],chat:['Chat with 3 friends',3],sell:['Sell produce to Mei',1]};
function dtInc(k){if(!S.dt||S.dt.day!==S.day)return;S.dt[k]=(S.dt[k]||0)+1;checkDaily();}
function dtVal(k){const D=DTASK[k];return D[2]?D[2]():((S.dt&&S.dt[k])||0);}
function checkDaily(){if(VISIT||!S.dtasks||!unlocked('daily'))return;S.dtDone=S.dtDone||{};S.dtasks.forEach(k=>{if(!S.dtDone[k]&&dtVal(k)>=DTASK[k][1]){S.dtDone[k]=1;S.coins+=15;toast('Daily task done: '+DTASK[k][0]+' · +15',3);if(S.dtasks.every(q=>S.dtDone[q])){S.coins+=20;setTimeout(()=>toast('All daily tasks done! Bonus +20',3),1800);}}});}
let dtT=0;function dailyTick(dt){dtT-=dt;if(dtT>0)return;dtT=1;if(running)checkDaily();}

// ---------- progressive unlocks: features open up as the story moves on ----------
const UNLOCKS=[
 {id:'friends',name:'Friendship hearts',how:'Meet Gus at Main Jetty',ok:()=>!!S.metGus,mail:['Kip’s notebook','Gus said I can call him a friend! Walk up to friends and press ♥ Friend (F) to chat and give gifts.']},
 {id:'daily',name:'Daily tasks',how:'Finish your first day',ok:()=>S.day>=2,mail:['Island Notice Board','Welcome, new shopkeeper! Three small tasks are posted here every morning. Check Quests → Today’s tasks.']},
 {id:'fishing',name:'Fishing',how:'Plant your first crop',ok:()=>!!(S.qg&&S.qg.planted)||S.day>=3,mail:['Gus','Here’s my old fishing rod, Kip. Cast off the side of Main Jetty when you have a spare moment.',10]},
 {id:'dig',name:'Dig spots and bottles',how:'Reach day 3',ok:()=>S.day>=3,mail:['Nana Wren','Dear, I left you a little trowel by the café. Look for X marks in the ground, and keep an eye on the beach for bottles!']},
 {id:'bugs',name:'Bug catching',how:'Talk to Elder Wattle at Quokka Village',ok:()=>!!(S.qg&&S.qg.village),mail:['Elder Wattle','The young ones made you a little net from wattle twigs. Butterflies by day, fireflies by night.']},
 {id:'museum',name:'Island Museum',how:'Catch a fish, a bug or dig up a fossil',ok:()=>Object.keys(S.fdex||{}).length+Object.keys(S.bugs||{}).length+Object.keys(S.fos||{}).length>0,mail:['Curator Banksia','The Island Museum is open! Bring me fish, bugs and fossils and I’ll pay 10 coins for each donation.']},
 {id:'rooms',name:'Room for stranded tourists',how:'Sell produce in South Perth once',ok:()=>!!(S.qg&&S.qg.sold),mail:['Kip’s notebook','I cleaned up the spare room above the café. If anyone misses the last ferry, I can offer it for 10 coins a night.']},
 {id:'bus',name:'Buses to Heirisson Island and Victoria Park',how:'Sell produce to Mei in South Perth',ok:()=>!!(S.qg&&S.qg.sold),mail:['Mei','Thanks for the produce! Next time, take the bus from the stop outside Mill Point Towers. My family has a stall in Victoria Park.']},
 {id:'homes',name:'Homes for sale in South Perth',how:'Own a business on Rottnest',ok:()=>Object.values(S.biz||{}).some(b=>b.own),mail:['Swan River Realty','Congratulations on your business! Homes in South Perth are now open for viewing: Mill Point Towers, Federation bungalow and the riverfront house.']},
 {id:'board',name:'Restoration Board',how:'Bring Mum & Dad to Rottnest',ok:()=>!!(S.wish&&S.wish.tickets),mail:['Island Council','With your family here, the island council wants your help to restore Rottnest. Visit the Restoration Board by the museum.']},
 {id:'stars',name:'Celebrity guests',how:'Bring Mum & Dad to Rottnest',ok:()=>!!(S.wish&&S.wish.tickets),mail:['Kip’s notebook','Mum says the café is in the newspaper! Famous people might start visiting. Look for the gold star.']},
 {id:'coach',name:'Island Loop bus',how:'Reach day 3',ok:()=>S.day>=3,mail:['Island Visitor Centre','The Island Loop bus now loops the whole island: Settlement, The Basin, the lighthouse, Geordie Bay, Little Salmon Bay and the West End. Look for the blue BUS signs.']},
 {id:'train',name:'Quokka Express train',how:'Ride the Island Loop bus once',ok:()=>!!(S.qg&&(S.qg.coach_geordie||S.qg.coach_salmon||S.qg.coach_west||S.qg.coach_basin||S.qg.coach_light||S.qg.coach_settle)),mail:['Quokka Express','The little train now runs from Settlement Station to Oliver Hill, with a tour of the old gun battery.']},
 {id:'freo',name:'Fremantle',how:'Upgrade Main Jetty to level 3 and start Kip\u2019s Ferry Co.',ok:()=>typeof freoUnlocked==='function'&&freoUnlocked()}];
function unlocked(id){if(isGM())return true;const u=UNLOCKS.find(q=>q.id===id);return!u||u.ok();}
let unlT=0;function unlockTick(dt){unlT-=dt;if(unlT>0||!running||VISIT)return;unlT=1.5;S.unl=S.unl||{};UNLOCKS.forEach(u=>{if(!S.unl[u.id]&&u.ok()){S.unl[u.id]=S.day;if(u.mail){S.mail=S.mail||[];S.mail.unshift({day:S.day,from:u.mail[0],text:u.mail[1],coins:u.mail[2]||0,read:false,got:false});}save();setTimeout(()=>toast('✨ New: '+u.name+'! Check your mailbox.',4),300);syncDayVisuals&&syncDayVisuals();}});}

function cafeLv(){return S.cafeLv||1;}
function cafeStyle(){return S.cafeStyle||'classic';}
function applyCafe(){const st=cafeStyle(),L=cafeLv(),C=CAFE_STYLES[st];
  wallMat.map=ctex(texWall(st),{rep:[3,1]});wallMat.needsUpdate=true;awn.material.map=ctex(texAwn(st),{rep:[st==='mykonos'?1:6,1]});awn.material.needsUpdate=true;
  deckMat.map=ctex(texDeck(st),{rep:[10,8]});deckMat.needsUpdate=true;ctr.material.map=ctex(texCounter(st),{rep:[3,1]});ctr.material.needsUpdate=true;
  tableMat.color.set(C.table);seatMat.color.set(C.seat);
  Object.keys(STYLE_DECOR).forEach(k=>STYLE_DECOR[k].forEach(o=>o.visible=k===st));Object.keys(LV_DECOR).forEach(n=>LV_DECOR[n].forEach(o=>o.visible=L>=+n));
  [...lvCols,stairCol].forEach(c=>{if(L>=c.lvl){[c.x1,c.z1,c.x2,c.z2]=c.real;}else{c.x1=c.z1=c.x2=c.z2=1e9;}});
  SEATS.forEach(s=>{if(s.lvl&&s.lvl>L)s.busy=true;else if(s.lvl&&s.lvl<=L&&s.busy&&!customers.some(c=>c.seat===s))s.busy=false;});
  upper.visible=false;/* Paul: level 4 keeps the level 3 building */upRoofMat.color.set(UP_ROOF[st]);upTrimMat.color.set(UP_WIN[st]);upRoof.visible=st!=='mykonos';upFlat.visible=st==='mykonos';
  (STYLE_DECOR.mykonos||[]).forEach(o=>{if(o.geometry&&o.geometry.type!=='SphereGeometry'&&o.geometry.type!=='CylinderGeometry')return;if(o.position&&o.position.z===-4.4)o.position.y=(o.geometry.type==='SphereGeometry'?3.25:3.1);});
  LV_DECOR[4].forEach(o=>{if(o.isGroup&&o.children.length===10){o.position.set(0,-.12,1.95);}});
  sign.scale.setScalar(1);const x=signC.getContext('2d');x.fillStyle=C.sign[0];x.fillRect(0,0,96,20);x.fillStyle='#e2c27c';x.fillRect(0,0,96,1);x.fillRect(0,19,96,1);x.fillRect(0,0,1,20);x.fillRect(95,0,1,20);x.fillStyle=C.sign[1];x.font='bold 12px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('QUOKKA CAFE',48,11);signTex.needsUpdate=true;}
function openCafe(){if(!running||overlay)return;S.qg=S.qg||{};if(!S.qg.hqOpen){S.qg.hqOpen=1;save();}if(hqTab==='wish')hqTab='main';renderCafe();showOverlay('cafe');}
function hqQuestCheck(){const g=S.qg=S.qg||{};if(!g.wishSeen&&overlay==='cafe'&&hqTab==='main'){const h=$('#cfWishH');if(h&&typeof IntersectionObserver!=='undefined'&&!hqQuestCheck.io){hqQuestCheck.io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)&&overlay==='cafe'){S.qg.wishSeen=1;save();hqQuestCheck.io.disconnect();hqQuestCheck.io=null;hqQuestCheck();}});hqQuestCheck.io.observe(h);}}
  if(!g.hqDone&&g.hqOpen&&g.wishSeen&&Object.keys(S.wish||{}).some(k=>S.wish[k])){g.hqDone=1;S.coins+=25;save();toast('\u2605 Start here: Caf\u00e9 HQ & Kip\u2019s Journey complete \u00b7 +25 coins',3.2);}}
function renderCafe(){setTimeout(hqQuestCheck,0);renderHQTabs();const isMain=hqTab==='main',isWish=hqTab==='wish';$('#cfMain').hidden=!isMain;$('#cfBranch').hidden=isMain||isWish;$('#cfWish').hidden=!isWish;$('#cfCoins').textContent=S.coins+' coins';hqTpButton();if(isWish){$('#cfLevel').textContent='Wishlist';$('#cfCollectAll').hidden=true;renderWish();return;}if(!isMain){renderBranch(BRANCHES.find(b=>b.id===hqTab));return;}renderWish();const L=cafeLv();$('#cfLevel').textContent='Rottnest \u00b7 Level '+L+' \u00b7 '+CAFE_LV[L-1].n;const lv=$('#cfLv');lv.innerHTML='';
  CAFE_LV.forEach((q,i)=>{const d=document.createElement('div');d.className='cfL'+(i<L?' done':i===L?' next':'');const b=document.createElement('b');b.textContent=(i+1)+'. '+q.n;const s=document.createElement('span');s.textContent=q.fx;d.append(b,s);if(i===L){const bt=document.createElement('button');bt.type='button';bt.className='btn';bt.id='cfUp';bt.textContent='Upgrade · '+q.price+' coins';bt.disabled=S.coins<q.price;bt.onclick=()=>{if(S.coins<q.price)return;S.coins-=q.price;S.cafeLv=i+1;save();applyCafe();renderCafe();toast('Quokka Cafe is now a '+q.n+'!',3);};d.appendChild(bt);}lv.appendChild(d);});
  const G=$('#cfStyles');G.innerHTML='';S.cafeStyles=S.cafeStyles||{classic:1};Object.keys(CAFE_STYLES).forEach(k=>{const C=CAFE_STYLES[k],own=!!S.cafeStyles[k],cur=cafeStyle()===k;const d=document.createElement('div');d.className='cfS'+(cur?' on':'');
    const sw=document.createElement('div');sw.className='cfSw';C.sw.forEach(c=>{const i=document.createElement('i');i.style.background=c;sw.appendChild(i);});const n=document.createElement('b');n.textContent=C.name;const p=document.createElement('p');p.textContent=C.desc;
    const bt=document.createElement('button');bt.type='button';bt.className='btn'+(cur?' ghost':'');bt.id='cfs-'+k;bt.textContent=cur?'In use':own?'Use this style':'Unlock · '+C.price+' coins';bt.disabled=cur||(!own&&S.coins<C.price);
    bt.onclick=()=>{if(!own){if(S.coins<C.price)return;S.coins-=C.price;S.cafeStyles[k]=1;}S.cafeStyle=k;save();applyCafe();renderCafe();toast('New look: '+C.name,2.5);};d.append(sw,n,p,bt);G.appendChild(d);});
  $('#cfCoins').textContent=S.coins+' coins';}

