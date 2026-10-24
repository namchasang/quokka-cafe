// ---------- state ----------
const LEGACY_KEY='quokka-cafe-v1',SLOTS=6;let SLOT=1;const slotKey=n=>'quokka-cafe-slot-'+n;
try{if(localStorage.getItem(LEGACY_KEY)&&!localStorage.getItem(slotKey(1))){localStorage.setItem(slotKey(1),localStorage.getItem(LEGACY_KEY));localStorage.removeItem(LEGACY_KEY);}}catch(e){}
function readSlot(n){try{const r=localStorage.getItem(slotKey(n));return r?JSON.parse(r):null;}catch(e){return null;}}
function fresh(){return{isv:2,stamina:100,pc:{},stock:{beans:20,milk:20,mango:10,mix:12,tea:0},menu:{},fq:{},parentsDay:null,freoNotice:false,jetty:0,props:{},wakeSP:false,buffs:{},unlock:{},ownBike:null,rentals:0,fert:false,juice:true,refreshed:false,biz:{},bizToday:0,waves:{},qg:{},servedTotal:0,track:'main',staff:0,plots:[null,null,null,null,null,null],inv:{},metMei:false,wx:0,temp:25,day:1,coins:0,wish:{},lore:{},quest:0,shells:{},served:0,earned:0,time:420,metGus:false,closed:false,afterNoonTalk:false};}
let S=fresh();
function save(){if(VISIT||LIVE)return;try{const o=Object.assign({},S);['time','served','earned','closed','waves'].forEach(k=>delete o[k]);o.savedAt=Date.now();localStorage.setItem(slotKey(SLOT),JSON.stringify(o));}catch(e){}qcSyncSoon();}
function loadSave(){return readSlot(SLOT);}
const FERRY_ARR=[450,510,570,630,690,750,840,900];let arrivals=[];
let transit=false,running=false,overlay='title',spawnT=3;
const CLOSE=960,DAY_END=1320;
const OPEN=420;// Live mode (?live=1): the café stays open around the clock for 24/7 streams, nothing is saved
const LIVE=/[?&#]live\b/.test(location.search+location.hash);
const phase=()=>LIVE||(S.time>=OPEN&&S.time<CLOSE&&S.wx!==3)?'cafe':'explore';

// ---------- UI ----------
const ui={hud:$('#hud'),day:$('#dayLbl'),time:$('#timeLbl'),phase:$('#phaseLbl'),obj:$('#objLbl'),carry:$('#carryLbl'),coins:$('#coinLbl'),act:$('#act'),actLbl:$('#actLbl'),actKey:$('#actKey'),joy:$('#joy'),knob:$('#knob'),joyHint:$('#joyHint'),toast:$('#toast'),dlg:$('#dlg'),dlgWho:$('#dlgWho'),dlgTxt:$('#dlgTxt')};
const isTouch=matchMedia('(pointer:coarse)').matches;
ui.actKey.textContent=isTouch?'':'SPACE';
let toastTimer=0;
function toast(t,dur){ui.toast.textContent=t;ui.toast.hidden=false;ui.toast.style.opacity=1;toastTimer=dur||2.8;}
const pops=[];
function popText(t,pos,cls){const el=document.createElement('div');el.className='pop'+(cls?' '+cls:'');el.textContent=t;$('#app').appendChild(el);pops.push({el,p:new THREE.Vector3(pos.x,pos.y,pos.z),t:0});}
function fmtTime(t){let h=Math.floor(t/60),m=Math.floor((t%60)/10)*10;const ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+(m<10?'0':'')+m+' '+ap;}
function objective(){{const e=evCur();if(e&&phase()==='cafe'&&zoneOf(player.x)==='island')return e.icon+' '+e.name+': '+(S.ev.id==='sick'?'run the caf\u00e9 alone ('+(S.served||0)+'/8 served)':S.ev.id==='critic'?(S.ev.criticDone?'review done':'serve the critic fast'):S.ev.id==='heat'?'smoothies sell best today':'big crowds on every ferry');}
  if((S.stamina==null?100:S.stamina)<=20)return'Kip is very hungry! Buy food at the General Store in the Settlement before stamina hits 0.';
  {const zz=zoneOf(player.x);if(zz==='hi')return'Heirisson Island \u00b7 Photograph the kangaroos and swans. Bus back from the stop by the Causeway.';if(zz==='vp')return'Victoria Park \u00b7 Eat your way down Albany Highway. Bus stop at the west end.';if(zz==='cbd')return'Perth CBD \u00b7 Ferry from Mends St Jetty, City Loop bus on Wellington St.';}
  if(zoneOf(player.x)==='freo'){const n=FREO_STOPS.filter(f=>S.fq&&S.fq[f.id]).length;return'Fremantle \u00b7 A day out in Freo ('+n+'/'+FREO_STOPS.length+'). Ferry back from B-Shed.';}
  if(player.x>100)return basketCount()?'South Perth · Sell your harvest to Mei at the Swan River Grocer.':'South Perth · Take the ferry back to Rottnest from the jetty.';
  if(phase()==='cafe')return'Serve tourists until 16:00. Ferries from Fremantle bring a new wave about every hour.';
  if(S.track){const q=QUESTS().find(x=>x.id===S.track);if(q&&q.open&&!questDone(q)){const nx=q.steps.find(x=>!x[1]);return'\u2605 '+q.title+': '+nx[0];}}
  if(S.quest===0)return'Café closed. Explore: Nana Wren is waiting by the lighthouse.';
  if(S.quest===1){const n=Object.keys(S.shells).length;return n<3?'Find Nana Wren’s shells on the east beach ('+n+'/3)':'Bring the shells back to Nana Wren.';}
  const l=Object.keys(S.lore).length;return'Explore Rottnest · Lore stones '+l+'/3 · Save for your wishlist';}
let lastHud='';
function updateHud(){const bs=basketStr();const s=Math.round(S.stamina==null?100:S.stamina)+'|'+JSON.stringify(S.stock||{})+'|'+S.track+'|'+JSON.stringify(S.qg||{})+'|'+bs+'|'+(player.x>100)+'|'+S.wx+'|'+S.temp+'|'+S.day+'|'+fmtTime(S.time)+'|'+S.coins+'|'+phase()+'|'+player.carry+'|'+S.quest+'|'+Object.keys(S.shells).length+'|'+Object.keys(S.lore).length;if(s===lastHud)return;lastHud=s;
  {const st=S.stamina==null?100:S.stamina;$('#stamBar').style.width=st+'%';$('#stamPct').textContent=Math.round(st)+'%';const bx=$('#stamBox');bx.classList.toggle('low',st<=30&&st>10);bx.classList.toggle('crit',st<=10);}
  ui.day.textContent=dayLabel();const bl=$('#basketLbl');bl.hidden=!bs;if(bs)bl.textContent='Basket: '+bs;const W=WEATHERS[S.wx||0];$('#wxBtn').innerHTML=W.icon+' <span class="wl">'+W.label+'</span> '+S.temp+'\u00b0';ui.time.textContent=fmtTime(S.time);ui.coins.textContent=Math.floor(S.coins).toLocaleString('en-AU');
  const ph=phase();ui.phase.textContent=ph==='cafe'?'Café open':'Explore';ui.phase.className='phase'+(ph==='cafe'?'':' explore');
  ui.obj.textContent=objective();ui.carry.hidden=!player.carry;if(player.carry)ui.carry.textContent='Carrying: '+ITEMS[player.carry].name;}

// dialogue
let dlgQ=[],dlgDone=null;
function say(lines,done){dlgQ=lines.map(l=>typeof l==='string'?{who:'',text:l}:l);dlgDone=done||null;nextLine();}
function nextLine(){if(!dlgQ.length){ui.dlg.hidden=true;const d=dlgDone;dlgDone=null;if(d)d();return;}const l=dlgQ.shift();
  ui.dlg.hidden=false;const m=/^(\w[\w ]*):\s(.*)$/.exec(l.text);const who=l.who||(m?m[1]:'');ui.dlgWho.textContent=who||'Rottnest';ui.dlgTxt.textContent=m&&!l.who?m[2]:l.text;}
const dlgOpen=()=>!ui.dlg.hidden;
ui.dlg.addEventListener('pointerdown',e=>{e.stopPropagation();nextLine();});

