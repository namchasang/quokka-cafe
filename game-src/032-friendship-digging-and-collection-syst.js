// =========== friendship, digging and collection systems ===========
// ----- seasons and calendar (Australian seasons, 28 days each) -----
const SEASONS=[{n:'Summer',s:'Sum',c:'#f1c64a'},{n:'Autumn',s:'Aut',c:'#e8735a'},{n:'Winter',s:'Win',c:'#5cc6d8'},{n:'Spring',s:'Spr',c:'#86b86e'}];
function seasonOf(d){return Math.floor((d-1)/28)%4;}function dos(d){return(d-1)%28+1;}function yearOf(d){return Math.floor((d-1)/112)+1;}
function dayLabel(){const d=S.day;return SEASONS[seasonOf(d)].s+' '+dos(d)+(yearOf(d)>1?' · Y'+yearOf(d):'');}
const FESTIVALS=[
 {id:'swim',s:0,d:14,name:'Channel Swim Classic',where:'island',spot:[-17,5.4],desc:'Swimmers race 19.7 km from Cottesloe to Thomson Bay. Double customers all day, and cheer them in at Main Jetty.'},
 {id:'lny',s:0,d:24,name:'Lunar New Year Night Market',where:'vp',spot:[525,4],desc:'Red lanterns over Albany Highway. Every dish on the strip pays you back with a lucky red envelope.'},
 {id:'streetarts',s:1,d:10,name:'Fremantle Street Arts',where:'freo',spot:[300,6],desc:'Buskers and street performers across Freo. Tips flow and the Cappuccino Strip is packed.'},
 {id:'quokkaday',s:1,d:20,name:'Quokka Day',where:'island',spot:[VILLAGE.x,VILLAGE.z+1],desc:'The whole village gathers around the campfire. Visit Elder Wattle for a gift.'},
 {id:'whales',s:2,d:8,len:7,name:'Whale Week',where:'island',spot:[46,6],desc:'Humpback whales pass Rottnest on their winter migration. Look out from East Beach and Bathurst Lighthouse.'},
 {id:'wildflower',s:3,d:18,name:'Wildflower Fair',where:'sp',spot:[150,4.6],desc:'Flower stalls on the South Perth foreshore. Seeds are half price at Swan Seeds today.'},
 {id:'fireworks',s:3,d:26,name:'Swan River Fireworks',where:'sp',spot:[150,-2],desc:'Fireworks over the Swan River after 19:00. Watch from the Mends Street plaza.'}];
function festToday(d){d=d||S.day;const s=seasonOf(d),x=dos(d);return FESTIVALS.find(f=>f.s===s&&x>=f.d&&x<f.d+(f.len||1));}
let calSeason=null;
function openCalendar(){if(!running||overlay)return;calSeason=seasonOf(S.day);renderCalendar();showOverlay('cal');}
function renderCalendar(){const se=SEASONS[calSeason];$('#calTitle').textContent=se.n+' · Year '+yearOf(S.day);const T=$('#calTabs');T.innerHTML='';SEASONS.forEach((q,i)=>{const b=document.createElement('button');b.type='button';b.className='qtab'+(i===calSeason?' on':'');b.id='cal-'+i;b.textContent=q.n;b.onclick=()=>{calSeason=i;renderCalendar();};T.appendChild(b);});
  const G=$('#calGrid');G.innerHTML='';const today=seasonOf(S.day)===calSeason?dos(S.day):-1;
  for(let d=1;d<=28;d++){const c=document.createElement('div');c.className='calD'+(d===today?' today':'');const n=document.createElement('b');n.textContent=d;c.appendChild(n);
    FESTIVALS.filter(f=>f.s===calSeason&&d>=f.d&&d<f.d+(f.len||1)).forEach(f=>{const s=document.createElement('span');s.className='calF';s.textContent=f.name;c.appendChild(s);});
    FRIENDS.filter(f=>f.bday[0]===calSeason&&f.bday[1]===d).forEach(f=>{const s=document.createElement('span');s.className='calB';s.textContent='♥ '+f.name;c.appendChild(s);});G.appendChild(c);}
  const L=$('#calList');L.innerHTML='';FESTIVALS.filter(f=>f.s===calSeason).forEach(f=>{const p=document.createElement('p');const b=document.createElement('b');b.textContent='Day '+f.d+(f.len?'–'+(f.d+f.len-1):'')+' · '+f.name+': ';p.append(b,document.createTextNode(f.desc));L.appendChild(p);});}
// ----- friends: hearts and gifts -----
const FRIENDS=[
 {id:'gus',name:'Gus',role:'Ferry master',zone:'island',pos:()=>[gus.x,gus.z],loves:['fish','pump'],likes:['straw','lemon','apple'],bday:[0,9],
  lines:['Wind’s from the south-west. That’s the Fremantle Doctor coming.','Forty years I’ve sailed this channel. Still love it.','Good coffee yesterday, Kip. Don’t tell my wife.'],
  ev:[['Gus: I started as a deckhand when I was your size, Kip. Here, an old brass compass. Every captain needs one.',30],['Gus: Your café keeps my passengers smiling. Take this ferry pass money, on the house.',60],['Gus: You’re family now. When I retire, the harbour’s in good paws.',150]]},
 {id:'wren',name:'Nana Wren',role:'Fairy-wren',zone:'island',pos:()=>[wren.x,wren.z],loves:['straw','nect'],likes:['apple','fig','basil'],bday:[3,3],
  lines:['*chirp* The tide was kind this morning.','The blue of my feathers? Only in spring, dear.','Mind the snakes in the long grass, little one.'],
  ev:[['Nana Wren: I knew your grandmother, Kip. She loved the lighthouse too.',25],['Nana Wren: A shiny shell for your café counter. Tourists will love it.',50],['Nana Wren: You’ve made this island warmer. Thank you, dear.',120]]},
 {id:'elder',name:'Elder Wattle',role:'Village elder',zone:'island',pos:()=>[VILLAGE_ELDER.x,VILLAGE_ELDER.z],loves:['basil','fig','lgrass'],likes:['straw','nect','bokchoy'],bday:[1,20],
  lines:['Rottnest means “place across the water”.','We quokkas don’t need much water. Plants give us most of it.','Never feed us bread, young one. It makes us sick.'],
  ev:[['Elder Wattle: The village voted. You may build a small hut here someday.',30],['Elder Wattle: Our oldest song, about the first ferry. Take these coins the young ones collected.',60],['Elder Wattle: You are one of us now, Kip of the café.',150]]},
 {id:'mei',name:'Mei',role:'Swan River Grocer',zone:'sp',pos:()=>[mei.x,mei.z],loves:['avo','dragon','apple'],likes:['tom','lemon','bokchoy','straw'],bday:[0,22],
  lines:['Fresh produce sells out by noon on weekends.','My mum still makes the best dumplings in Perth.','The jacarandas turn the whole street purple in spring.'],
  ev:[['Mei: Your strawberries are my best sellers! Here, a bonus.',40],['Mei: My family runs a stall in Vic Park. Show them this note for a discount.',70],['Mei: Partners? Your farm, my shop. Deal!',150]]},
 {id:'ruth',name:'Captain Ruth',role:'River ferry skipper',zone:'sp',pos:()=>[ruth.x,ruth.z],loves:['fish'],likes:['apple','nect','pump'],bday:[2,14],
  lines:['The river’s like glass at dawn.','Dolphins swim right up to Mends Street some mornings.','Gus and I trained together, years ago.'],
  ev:[['Ruth: I saw a dolphin pod near the jetty. Here, a little tip from the tourists.',30],['Ruth: You’ve got sea legs now, Kip.',60],['Ruth: Any time you need a ride, you just whistle.',140]]},
 {id:'ollie',name:'Ollie',role:'Swan Seeds Nursery',zone:'sp',pos:()=>{const k=shopkeepers.find(q=>q.id==='seeds');return[k.x,k.z];},loves:['lemon','olive','fig'],likes:['basil','tom','avo'],bday:[3,18],
  lines:['Perth sand needs plenty of compost, mate.','Water early in the morning, before the heat.','A lemon tree in every backyard, that’s the Perth way.'],
  ev:[['Ollie: Try these leftover seedlings, on me.',30],['Ollie: Your garden’s famous on my Facebook group now.',60],['Ollie: Best gardener on the river. Truly.',140]]},
 {id:'noi',name:'Khun Noi',role:'Freo Thai Basil',zone:'freo',pos:()=>{const n=FREO_NPCS.find(q=>q.id==='noi');return[n.x,n.z];},loves:['chili','lgrass','dragon'],likes:['bokchoy','basil','lemon'],bday:[1,4],
  lines:['Sawasdee kha, Kip! Hungry?','Thai basil is different from Italian basil, you know.','I came to Perth with one suitcase and my mother’s recipes.'],
  ev:[['Khun Noi: My secret curry paste. Use it well!',40],['Khun Noi: You remind me of my son. Here, take some lucky money.',70],['Khun Noi: You are like family to me now.',150]]},
 {id:'rosa',name:'Rosa',role:'Freo Markets',zone:'freo',pos:()=>{const n=FREO_NPCS.find(q=>q.id==='rosa');return[n.x,n.z];},loves:['fig','olive'],likes:['basil','tom','straw'],bday:[2,2],
  lines:['The markets have been here since 1897.','Busy weekend! The buskers were wonderful.','My nonna grew figs behind our cottage.'],
  ev:[['Rosa: A vintage teacup for the café. On the house.',30],['Rosa: I told everyone about your café!',60],['Rosa: You’re a true Freo local now.',140]]},
 {id:'busker',name:'Albany Hwy busker',role:'Street musician',zone:'vp',pos:()=>[VP_BUSKER.x,VP_BUSKER.z],loves:['dragon','nect'],likes:['straw','apple'],bday:[0,5],
  lines:['This next one’s for the quokka in the apron!','Best acoustics on the whole street, right here.','I play the night market every weekend.'],
  ev:[['Busker: I wrote you a song. Here’s the coins from the first play.',30],['Busker: Mind if I play at your café sometime?',60],['Busker: My first album’s dedicated to you, Kip.',140]]}];
const HEARTS=10,PT=10;
function fr(id){S.fr=S.fr||{};S.fr[id]=S.fr[id]||{pt:0,chat:0,gift:0,ev:0,know:{}};return S.fr[id];}
function hearts(id){return Math.min(HEARTS,Math.floor(fr(id).pt/PT));}
function nearFriend(){if(!unlocked('friends'))return null;const z=zoneOf(player.x);let best=null,bd=1.9;FRIENDS.forEach(f=>{if(f.zone!==z)return;let p;try{p=f.pos();}catch(e){return;}const d=Math.hypot(p[0]-player.x,p[1]-player.z);if(d<bd){bd=d;best=f;}});return best;}
let friendSel=null,friendLine='';
function openFriend(){if(!running||overlay)return;const f=nearFriend();if(!f){toast('Walk up to a friend first');return;}friendSel=f;const F=fr(f.id);
  if(F.chat!==S.day){F.chat=S.day;F.pt+=2;dtInc('chat');friendLine=f.lines[(S.day+f.id.length)%f.lines.length];}else friendLine=pick(['Good to see you again today!','Back so soon? Ha!','Don’t work too hard, Kip.']);
  save();renderFriend();showOverlay('friend');}
function renderFriend(){const f=friendSel,F=fr(f.id),h=hearts(f.id);$('#frName').textContent=f.name;$('#frRole').textContent=f.role+(f.bday[0]===seasonOf(S.day)&&f.bday[1]===dos(S.day)?' · Birthday today! Gifts count double':'')+' · Birthday '+SEASONS[f.bday[0]].n+' '+f.bday[1];
  const H=$('#frHearts');H.innerHTML='';for(let i=0;i<HEARTS;i++){const s=document.createElement('span');s.className='ht'+(i<h?' on':'');s.textContent=i<h?'♥':'♡';H.appendChild(s);}
  $('#frLine').textContent='“'+friendLine+'”';const G=$('#frGifts');G.innerHTML='';
  const gave=F.gift===S.day;$('#frGiftNote').textContent=gave?'You already gave a gift today. Come back tomorrow.':'Give one gift a day from your basket. Loved gifts earn the most hearts.';
  Object.keys(S.inv||{}).filter(k=>S.inv[k]>0&&CROPS[k]).forEach(k=>{const b=document.createElement('button');b.type='button';b.className='qtab';b.id='gift-'+k;const kn=F.know[k];b.textContent=CROPS[k].name+' ×'+S.inv[k]+(kn==='love'?' ♥♥':kn==='like'?' ♥':'');b.disabled=gave;b.onclick=()=>giveGift(k);G.appendChild(b);});
  if(!G.children.length){const p=document.createElement('p');p.className='bgE';p.textContent='Your basket is empty. Harvest the garden or let staff fish after closing.';G.appendChild(p);}}
function giveGift(k){const f=friendSel,F=fr(f.id);if(F.gift===S.day||!(S.inv[k]>0))return;S.inv[k]--;F.gift=S.day;const bd=f.bday[0]===seasonOf(S.day)&&f.bday[1]===dos(S.day)?2:1;
  const lv=f.loves.includes(k)?'love':f.likes.includes(k)?'like':'ok';F.know[k]=lv;const add=(lv==='love'?8:lv==='like'?4:2)*bd;F.pt=Math.min(HEARTS*PT,F.pt+add);dtInc('gift');
  friendLine=lv==='love'?'Oh! '+CROPS[k].name+'! I love these. Thank you, Kip!':lv==='like'?'How thoughtful. I like '+CROPS[k].plural+'.':'Thanks, Kip. That’s kind of you.';
  const th=[3,6,10],evN=th.filter(t=>hearts(f.id)>=t).length;save();renderFriend();
  if(evN>F.ev){const e=f.ev[F.ev];F.ev++;S.coins+=e[1];save();setTimeout(()=>{hideOverlays();say([{who:'♥ '+f.name+' · '+[3,6,10][F.ev-1]+' hearts',text:e[0].replace(/^[^:]+: /,'')},{who:'',text:'+'+e[1]+' coins'}]);},500);}}
