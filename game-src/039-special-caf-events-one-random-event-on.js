// ---------- special café events (one random event on some days) ----------
const EVENTS={
 sick:{name:'Staff sick day',icon:'\u{1F912}',desc:'Your hired team called in sick. If Mum and Dad live on the island they still come in to help; otherwise Kip runs the café alone. Every order you serve pays +3 coins, and 8+ served by closing earns a 60 coin bonus.',need:()=>staff.some(s=>!s.fam)},
 crowd:{name:'Cruise crowd',icon:'\u{1F6A2}',desc:'Two cruise ships are in Fremantle. Every ferry brings almost twice the tourists today.',need:()=>true},
 heat:{name:'Heatwave',icon:'\u{1F975}',desc:'A 40\u00b0 scorcher! Most tourists want a Mango Smoothie, and each smoothie pays +2 coins.',need:()=>true},
 critic:{name:'Food critic',icon:'\u{1F9D0}',desc:'A famous food critic is visiting around mid-morning. Serve them fast for a glowing review and 80 coins.',need:()=>true}};
function evToday(id){return !!(S&&S.ev&&S.ev.day===S.day&&S.ev.id===id&&!VISIT);}
function evCur(){return S&&S.ev&&S.ev.day===S.day?EVENTS[S.ev.id]:null;}
function evRoll(force){if(VISIT)return;if(!force&&S.ev&&S.ev.day===S.day)return;if(!force&&((S.day||1)<3||S.wx===3||Math.random()>.22)){S.ev={day:S.day,id:null};return;}
  const ids=Object.keys(EVENTS).filter(k=>EVENTS[k].need());const id=force||ids[Math.floor(Math.random()*ids.length)];S.ev={day:S.day,id,served0:0};save();}
function evAnnounce(){const e=evCur();if(!e)return;say([{who:e.icon+' Special event',text:e.name+'! '+e.desc}]);}
function evOnServe(c){if(evToday('sick')){S.coins+=3;S.earned+=3;popText('+3 solo',{x:c.x,y:2.4,z:c.z});}if(evToday('heat')&&c.order==='smo'){S.coins+=2;S.earned+=2;}
  if(c.critic){const fast=c.patience/c.max>.5;S.ev.criticDone=1;if(fast){S.coins+=80;S.earned+=80;toast('\u{1F9D0} The critic loved it! \u2605\u2605\u2605\u2605\u2605 review \u00b7 +80 coins',4);}else{S.coins+=20;toast('\u{1F9D0} \u201cA little slow, but delicious.\u201d \u2605\u2605\u2605 review \u00b7 +20 coins',4);}}}
function evClose(){if(evToday('sick')&&!S.ev.paid){S.ev.paid=1;const fam=staff.some(s=>s.fam);if((S.served||0)>=8){S.coins+=60;toast('\u{1F4AA} '+(fam?'You, Mum and Dad':'You ran the caf\u00e9 alone and')+' served '+S.served+' orders! +60 coin bonus',4);}else toast(fam?'Phew! Thank goodness for Mum and Dad. The team is back tomorrow.':'Phew, a tough day alone. Your team is back tomorrow.',3);}
  if(evToday('critic')&&!S.ev.criticDone)toast('The food critic never got served\u2026 maybe next time.',3);}
let propSel=null;
function openProp(id){if(!running||overlay)return;if(VISIT){toast('This is your friend\u2019s property',2);return;}if(!unlocked('homes')){say([{who:'For sale sign',text:'Viewing by appointment. Swan River Realty will contact you once you own a business on Rottnest.'}]);return;}propSel=id;renderProp();showOverlay('biz');}
function renderProp(){const P=PROP_LIST.find(p=>p.id===propSel),own=propOwned(P.id);{const zn=P.zone==='island'?'Rottnest':'South Perth';$('#bzEyebrow').textContent=own?'Your home \u00b7 '+zn:'For sale \u00b7 '+zn;}$('#bzTitle').textContent=P.name;$('#bzDesc').textContent=P.desc;
  const rows=own?[['Rent while you’re away',P.rent+homeBonus(P.id)+' coins a night (cosy bonus +'+homeBonus(P.id)+')'],['Sleep here','End the day, then take the first ferry back to Rottnest at 7:00']]:[['Price',P.price+' coins'],['Rental income',P.rent+' coins a night once you own it'],['Your coins',S.coins+'']];
  const D=$('#bzStats');D.innerHTML='';rows.forEach(([a,v])=>{const x=document.createElement('span');x.textContent=a;const y=document.createElement('span');y.textContent=v;D.append(x,y);});
  const B=$('#bzBtns');B.innerHTML='';const mkb=(id,t,cls,dis,fn)=>{const e=document.createElement('button');e.type='button';e.id=id;e.className='btn'+(cls?' '+cls:'');e.textContent=t;e.disabled=!!dis;e.addEventListener('click',fn);B.appendChild(e);};
  if(own){mkb('prDecor','Decorate interior','',false,()=>{overlay=null;openHome(P.id);});mkb('prSleep','Go inside and sleep \u00b7 wake well rested','ghost',false,()=>{S.homeRest=1;hideOverlays();S.wakeSP=(P.zone||'sp')==='sp';endDay();});}
  else mkb('prBuy','Buy for '+P.price+' coins','',S.coins<P.price,()=>{S.coins-=P.price;S.props=S.props||{};S.props[P.id]=1;applyProps();save();renderProp();toast('You bought '+P.name+'!',3);});
  mkb('prClose','Close','ghost',false,hideOverlays);}
function propRent(){return PROP_LIST.reduce((a,p)=>a+(propOwned(p.id)?p.rent+homeBonus(p.id):0),0);}

// ---------- Fremantle logic ----------
const FB={x1:250,x2:353,z1:-19.5,z2:21.5};
function freoWalk(x,z){if(x>286.9&&x<289.1&&z>-19&&z<=-14.4)return true;if(x<274.5||x>333.5||z<-14.4||z>21.6)return false;if(x<292&&z>14.1)return false;return true;}
const ferrySign=(()=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.5),new THREE.MeshBasicMaterial({map:makeSign(["KIP'S FERRY CO."],72,14,'#1d3a6e','#ffd34d'),side:THREE.DoubleSide}));m.position.set(-15,2.3,4.1);m.visible=false;scene.add(m);[-16.1,-13.9].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.3,6),legMat);p.position.set(x,1.15,4.1);p.visible=false;scene.add(p);m.userData[x]=p;});return m;})();
function applyFerryCo(){const on=!!(S.ferryco&&S.ferryco.own);ferrySign.visible=on;Object.values(ferrySign.userData).forEach(p=>p.visible=on);}
function freoUnlocked(){return isGM()||(S.jetty||0)>=3&&!!(S.ferryco&&S.ferryco.own);}
const FREO_STOPS=[
 {id:'capp',label:'Cappuccino at Pippo’s',x:302.2,z:10},{id:'fishchips',label:'Fish & chips at the Salty Gull',x:295.4,z:17.4},{id:'padthai',label:'Pad Thai at Freo Thai Basil',x:308.6,z:11},
 {id:'souvenir',label:'Souvenir from Freo Markets',x:309.5,z:19},{id:'gift',label:'Gift for Mum & Dad at Seagull & Co. Gifts',x:312.8,z:-10},{id:'prison',label:'Fremantle Prison tour',x:325,z:12.6},
 {id:'wheel',label:'Ride the ferris wheel',x:286.5,z:11.4},{id:'photo',label:'Photo at the I ♥ FREO sign',x:293.5,z:7.6}];
const FREO_NPCS=[
 {id:'nino',name:'Pippo',x:302.2,z:10,v:{hair:'#2a1d16',skin:'#e2b48a',shirt:'#f6f2e8',pants:'#2f3b5c',hat:null},shop:'f_nino'},
 {id:'chicco',name:'Sal',x:295.4,z:17.4,v:{hair:'#9b3b22',skin:'#f1c7a0',shirt:'#2f6fb0',pants:'#f6f2e8',hat:'#f6f2e8'},shop:'f_chicco'},
 {id:'noi',name:'Khun Noi',x:308.6,z:11,v:{hair:'#1b1b2b',skin:'#d9a173',shirt:'#c89a2a',pants:'#7a1f2a',hat:null},shop:'f_thai'},
 {id:'rosa',name:'Rosa',x:309.5,z:19,v:{hair:'#6b4226',skin:'#f1c7a0',shirt:'#3e7d5c',pants:'#c9b68a',hat:'#e8d4a0'},shop:'f_market'},
 {id:'yolo',name:'Jay',x:312.8,z:-10,v:{hair:'#d9b25a',skin:'#c68a5e',shirt:'#1b1b2b',pants:'#4a4a4a',hat:null},shop:'f_yolo'},
 {id:'guide',name:'Prison guide',x:326.6,z:12.6,v:{hair:'#c9c2b4',skin:'#f1c7a0',shirt:'#5a4a3a',pants:'#2f3b5c',hat:'#24305a'},shop:'f_prison'},
 {id:'wheelop',name:'Wheel operator',x:288.6,z:11.4,v:{hair:'#1b1b2b',skin:'#8d5a3b',shirt:'#c8344a',pants:'#2f3b5c',hat:'#c8344a'},shop:'f_wheel'},
 {id:'skipper',name:'Skipper Lou',x:286.4,z:-14.2,v:{hair:'#c9c2b4',skin:'#f1c7a0',shirt:'#f3efe6',pants:'#24305a',hat:'#24305a'}}];
FREO_NPCS.forEach(n=>{n.mesh=spriteMesh(humanFrames(n.v),.95,1.58);n.mesh.position.set(n.x,0,n.z);scene.add(n.mesh);blob(.85).position.set(n.x,.03,n.z);});
const fexp=(id,name,price,desc,after)=>({id,name,price,desc,own:()=>!!(S.fq&&S.fq[id]),buy:()=>{S.fq=S.fq||{};S.fq[id]=1;if(after)setTimeout(after,50);}});
const frec=(id,name,price,desc)=>({id:'r_'+id,name,price,desc,own:()=>!!(S.menu&&S.menu[id]),buy:()=>{S.menu=S.menu||{};S.menu[id]=1;applyMenu();toast(ITEMS[id].name+' is now on the Quokka Cafe menu!',3);}});
Object.assign(SHOPS,{
 f_nino:{name:'Pippo’s, Cappuccino Strip',who:'Pippo',desc:'The oldest espresso bar on South Terrace. Locals have argued over the best table here for decades.',items:[fexp('capp','A cappuccino on the strip',6,'Sit outside and watch Freo go by.'),frec('capp','Pippo’s cappuccino recipe',80,'Adds Cappuccino (9 coins) to your café menu, with its own station on the counter.')]},
 f_chicco:{name:'The Salty Gull Fish & Chips',who:'Sal',desc:'Fish and chips by the Fishing Boat Harbour. Watch out for the seagulls.',items:[fexp('fishchips','Fish & chips by the harbour',8,'Eaten out of the paper, of course.'),frec('fc','the Salty Gull batter recipe',90,'Adds Fish & chips (12 coins) to your café menu.')]},
 f_thai:{name:'Freo Thai Basil',who:'Khun Noi',desc:'สวัสดีค่ะ! A family Thai kitchen just off the Cappuccino Strip, run by Khun Noi.',items:[fexp('padthai','Pad Thai',9,'Wok-fried, with a squeeze of lime.'),frec('thai','Khun Noi’s Thai iced tea',70,'Adds Thai iced tea (9 coins) to your café menu.')]},
 f_market:{name:'Freo Markets',who:'Rosa',desc:'More than 150 stalls under one old roof. Open Friday to Sunday in real life, every day in Kip’s.',items:[fexp('souvenir','Handmade quokka plush',15,'A little friend for the café counter.'),{id:'u_olive',name:'Kalamata olive seedling',price:55,desc:'Unlocks olives: ready in 3 days, 8 per harvest.',own:()=>!!(S.unlock&&S.unlock.u_olive),buy:()=>{S.unlock.u_olive=1;}},{id:'u_basil',name:'Basil seeds',price:25,desc:'Unlocks basil: ready in 1 day, 4 per harvest.',own:()=>!!(S.unlock&&S.unlock.u_basil),buy:()=>{S.unlock.u_basil=1;}},{id:'u_fig',name:'Fig tree seedling',price:60,desc:'Unlocks figs: ready in 3 days, 5 per harvest.',own:()=>!!(S.unlock&&S.unlock.u_fig),buy:()=>{S.unlock.u_fig=1;}},{id:'spice',name:'Bag of market spices',price:20,desc:'Lamingtons earn +2 coins each for 3 days.',buy:()=>{S.buffs.spice=3;}}]},
 f_yolo:{name:'Seagull & Co. Gifts',who:'Jay',desc:'The shiny new shopping centre on Kings Square.',items:[fexp('gift','Gift for Mum & Dad',30,'Matching Fremantle Dockers scarves. Dad pretends not to love his.')]},
 f_prison:{name:'Fremantle Prison',who:'Prison guide',desc:'Convicts built this prison in the 1850s. It held prisoners until 1991 and is now World Heritage-listed.',items:[fexp('prison','Day tour ticket',12,'Walk the cell blocks and hear the escape stories.',()=>say(['Prison guide: These limestone walls were quarried and laid by the convicts themselves.','Kip: And now it’s one of the most visited places in Freo. History is wild.']))]},
 f_wheel:{name:'Esplanade ferris wheel',who:'Wheel operator',desc:'One full turn above the Norfolk pines, with the harbour on one side and the city on the other.',items:[fexp('wheel','One ride',6,'Best at sunset.',()=>{const z0=zm;zm=1.7;toast('Up above Esplanade Park…',2.4);setTimeout(()=>{zm=z0;},2600);})]}});
function freoTick(dt,t){const W=wheel.userData.W;W.rotation.z=t*.12;W.userData.cabins.forEach(c=>c.rotation.z=-W.rotation.z);W.userData.bulbs.forEach((b,i)=>b.visible=NIGHT>.05&&((i+Math.floor(t*4))%3!==0));freoFerry.position.y=-.15+Math.sin(t*1.1)*.04;}
function sailFreo(to){if(transit)return;if(VISIT){toast('Go home first to travel',2);return;}if(to&&needPass('freo'))return;transit=true;fadeTarget=.95;toast(to?'Sailing to Fremantle…':'Sailing back to Rottnest…',2);
  setTimeout(()=>{S.time+=30;player.bike=false;player.carry=null;if(to){player.x=288;player.z=-14;if(!S.fq||!S.fq.arrived){S.fq=S.fq||{};S.fq.arrived=1;save();say(['Kip: Freo! Mum always said the Cappuccino Strip is the heart of the city.','Kip: Let’s do a proper day out. I’ve got a whole list.'],()=>openQuest('freoday',true));}}else{player.x=IWx(-13.2,5);player.z=IWz(-13.2,5);}updateCamera(0,true);fadeTarget=0;transit=false;},900);}
function renderFreoBase(W,H,s,all){const c=mk(W,H),x=c.getContext('2d'),m=mapper(W,H,FB);x.fillStyle='#2f78a8';x.fillRect(0,0,W,H);
  const rect=(x1,z1,x2,z2,col)=>{x.fillStyle=col;x.fillRect(m.X(x1),m.Z(z1),m.X(x2)-m.X(x1),m.Z(z2)-m.Z(z1));};
  rect(274,-14.6,334,14.2,'#d8ccb4');rect(292,14.1,334,21.6,'#d8ccb4');rect(281,5.4,300,13.6,'#7aa356');rect(306,-9,316,-3,'#7aa356');rect(274.2,2,280.4,8.4,'#f6f1e3');
  rect(278.5,-2.9,321,-1.1,'#4a4d55');rect(280,3.7,304,5.3,'#4a4d55');rect(302.9,-3,305.1,21.6,'#4a4d55');rect(304,19.6,334,21.2,'#4a4d55');rect(286.9,-19,289.1,-14.4,'#a8744a');
  [[285,-12.6,8,3.2,'#9fb3c0'],[277.5,-9,7,3.6,'#c8ced6'],[295.5,1.5,8,3,'#f6f2e8'],[295.4,15.6,4,2.6,'#2f6fb0'],[300.6,10,3.6,2.6,'#c8344a'],[308.6,9,3.4,3,'#c89a2a'],[309.5,16.6,7,3.8,'#8a3a2a'],[308,-6.4,4.4,3,'#e6d7b4'],[314.4,-5.8,3,4.2,'#5a5a62'],[312.8,-12,8,3,'#1b1b2b'],[325,4,12,14,'#e2d2a8']].forEach(([bx,bz,w,d,col])=>rect(bx-w/2,bz-d/2,bx+w/2,bz+d/2,col));
  x.fillStyle='#f6f2e8';x.beginPath();x.arc(m.X(278),m.Z(-.6),m.U*1.9,0,6.283);x.fill();x.strokeStyle='#f6f2e8';x.lineWidth=1.5*s;x.beginPath();x.arc(m.X(286.5),m.Z(9.8),m.U*1.6,0,6.283);x.stroke();
  x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
  [['Victoria Quay',284,-16.6,1],['B-Shed',285,-10.4,0],['Maritime Museum',277.5,-12,0],['Round House',278,-3.4,1],['Bathers Beach',277.2,9.6,0],['Esplanade Park',290.5,12.4,1],['Fishing Boat Harbour',284,18.8,1],['Cappuccino Strip',304,-3.9,1],['High St',292,-1,0],['Kings Square',311,-14.6,1],['Fremantle Prison',325,4,1],['Freo Markets',309.5,20.6,0],['Tasty Thai',308.6,7,0]].forEach(([t,lx,lz,mini])=>{if(!all&&!mini)return;x.font='800 '+Math.round(9*s)+'px "M PLUS Rounded 1c", sans-serif';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText(t,m.X(lx),m.Z(lz));x.fillStyle='#f5ecd8';x.fillText(t,m.X(lx),m.Z(lz));});
  x.font='800 '+Math.round(9*s)+'px "Pixelify Sans", monospace';x.textAlign='left';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText('N↑',6*s,10*s);x.fillStyle='#ffd34d';x.fillText('N↑',6*s,10*s);return c;}
let frMini=null,frBig=null;

const menuProps={};
function applyMenu(){S.menu=S.menu||{};
  if(!menuProps.capp){const a=box(.45,.5,.4,new THREE.MeshLambertMaterial({color:0xc8344a}),-2.45,1.39,-2.6);const b=box(.2,.08,.15,new THREE.MeshLambertMaterial({color:0x2b2b30}),-2.45,1.2,-2.35);menuProps.capp=[a,b];
    const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.11,.36,10),new THREE.MeshLambertMaterial({color:0xf08a2a,transparent:true,opacity:.85}));c.position.set(.85,1.32,-2.6);scene.add(c);const d=box(.3,.1,.3,new THREE.MeshLambertMaterial({color:0x7a1f2a}),.85,1.19,-2.6);menuProps.thai=[c,d];
    const e=box(.5,.32,.4,new THREE.MeshLambertMaterial({color:0x9aa0a8}),2.45,1.3,-2.6);const f=box(.4,.06,.3,new THREE.MeshLambertMaterial({color:0xf4c84a}),2.45,1.48,-2.6);menuProps.fc=[e,f];}
  ['capp','thai','fc'].forEach(k=>menuProps[k].forEach(m=>m.visible=!!S.menu[k]));}

