/* ---- Perth Pass (freemium) ----
   BUILD 'web'  : Rottnest, South Perth, Heirisson free; Fremantle + Vic Park need a Perth Pass code (Payhip / itch.io).
   BUILD 'full' : everything unlocked (paid itch.io download, Google Play paid app). */
const BUILD='web';
const PASS_LINKS={payhip:'https://payhip.com/b/moA03',itch:''};const PASS_PRICE='A$4.99';
function passBuyUrl(){return PASS_LINKS.payhip||PASS_LINKS.itch||'';}
function goBuyPass(){const u=passBuyUrl();if(!u){$('#psMsg').textContent='The Perth Pass shop opens soon. Check back in a few days!';$('#psMsg').className='psMsg bad';return false;}let w=null;try{w=window.open(u,'_blank');if(w)w.opener=null;}catch(e){}if(!w){const m=$('#psMsg');m.innerHTML='';m.className='psMsg';const l=document.createElement('a');l.href=u;l.target='_blank';l.rel='noopener';l.textContent='Tap here to open the Perth Pass shop ('+PASS_PRICE+')';l.style.color='#f0c86e';m.appendChild(l);return false;}return true;}
const PC_AB='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function pcSum(body){let h=2166136261;const t='wadjemup|'+body;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return PC_AB[h%32]+PC_AB[(h>>>5)%32];}
function passCodeOk(raw){const c=String(raw||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(!/^QCP[A-Z0-9]{10}$/.test(c))return false;const body=c.slice(3,11);if([...body].some(ch=>!PC_AB.includes(ch)))return false;return pcSum(body)===c.slice(11);}
function hasPass(){if(BUILD==='full'||isGM())return true;if(S&&S.pass)return true;try{return localStorage.getItem('qc-perth-pass')==='1';}catch(e){return false;}}
// ---- Game Master account (full game for Paul) ----
const GM_HASH='0a5d4613e90f1f8961136e39e7480c8b9e10fec5675830ca066f19431752a428';
function isGM(){try{if(typeof S!=='undefined'&&S&&S.gm)return true;return localStorage.getItem('qc-gm')==='1';}catch(e){return false;}}
async function gmCheck(raw){try{const c=String(raw||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(!/^GM[A-Z0-9]{12}$/.test(c)||!crypto.subtle)return false;const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('quokka-gm|'+c));return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('')===GM_HASH;}catch(e){return false;}}
function gmGift(){if(!S.gmGift500){S.gmGift500=1;S.coins+=500000;toast('\u2605 GM bonus: +500,000 coins',3);}}
function gmEnable(){S.gm=true;S.pass=true;gmGift();try{localStorage.setItem('qc-gm','1');localStorage.setItem('qc-perth-pass','1');}catch(e){}S.seenZ=Object.assign(S.seenZ||{},{island:1,sp:1,hi:1,freo:1,vp:1});save();gmUI();}
function gmUI(){const b=$('#gmBtn');if(b)b.hidden=!isGM();const pb=$('#passBtn');if(pb&&isGM())pb.textContent='Perth Pass \u2713';}
function openGM(){if(!running||overlay)return;renderGM();showOverlay('gm');}
function renderGM(){const B=$('#gmBody');B.innerHTML='';const row=(t,fn,id)=>{const b=document.createElement('button');b.type='button';b.className='btn ghost';b.textContent=t;if(id)b.id=id;b.onclick=()=>{fn();renderGM();};B.appendChild(b);};
  $('#gmInfo').textContent='Day '+S.day+' \u00b7 '+fmtTime(S.time)+' \u00b7 '+S.coins+' coins \u00b7 stamina '+Math.round(S.stamina==null?100:S.stamina)+'% \u00b7 zone '+zoneOf(player.x);
  row('+1,000 coins',()=>{S.coins+=1000;save();},'gm-coins');row('+10,000 coins',()=>{S.coins+=10000;save();});row('+500,000 coins',()=>{S.coins+=500000;save();});
  row('Full stamina',()=>{S.stamina=100;save();});row('Skip to 4pm',()=>{S.time=Math.max(S.time,960);});row('Next day',()=>{S.time=1439.9;});
  row('Unlock Fremantle route',()=>{S.jetty=Math.max(4,S.jetty||0);S.ferryco=Object.assign({own:true},S.ferryco||{},{own:true});try{applyJetty();applyFerryCo();}catch(e){}save();});
  row('Story: finish current chapters',()=>{STORY_ORDER.forEach(a=>{const c=storyChap(a);if(!c)return;chapSteps(c).forEach(st=>{if(typeof st[1]==='string'){S.pc=S.pc||{};S.pc[st[1]]=S.pc[st[1]]||S.day;}});});S.storyIntro=S.storyIntro||{};STORY_ORDER.forEach(a=>{S.storyIntro[a+':'+((S.story&&S.story[a])||0)]=1;});save();});
  Object.keys(EVENTS).forEach(k=>row('Event: '+EVENTS[k].name,()=>{S.ev={day:S.day,id:k};save();hideOverlays();evAnnounce();}));
  row('Leave Game Master mode',()=>{S.gm=false;try{localStorage.removeItem('qc-gm');}catch(e){}save();gmUI();hideOverlays();toast('Game Master mode off',2);});
  const T=document.createElement('div');T.className='gmTp';[['island','Rottnest'],['sp','South Perth'],['hi','Heirisson'],['freo','Fremantle'],['vp','Vic Park']].forEach(([z,n])=>{const b=document.createElement('button');b.type='button';b.className='btn';b.textContent='\u2708 '+n;b.onclick=()=>{hideOverlays();const sp=freeNear(...(SAFE_SPOTS[z]||SAFE_SPOTS.island)[0]);RIDE=null;transit=true;fadeTarget=.95;setTimeout(()=>{player.bike=false;player.carry=null;player.x=sp[0];player.z=sp[1];updateCamera(0,true);fadeTarget=0;transit=false;},600);};T.appendChild(b);});B.appendChild(T);}
let passFor=null;
function openPass(where){if(VISIT)return;passFor=where||null;hideOverlays();const own=hasPass();$('#psTitle').textContent=own?'Perth Pass \u2713':(where==='freo'?'Fremantle needs the Perth Pass':where==='vp'?'Victoria Park needs the Perth Pass':'Unlock Fremantle & Victoria Park');
  $('#psSub').textContent=own?'You own the Perth Pass. Fremantle and Victoria Park are open on this device. Thanks for supporting Quokka Caf\u00e9!':'Rottnest Island, South Perth and Heirisson Island are free to play. The Perth Pass ('+PASS_PRICE+', one-time) opens the last two towns for good.';
  const B=$('#psBuy');B.innerHTML='';if(!own){const a=document.createElement('button');a.type='button';a.className='btn';a.id='psBuyBtn';a.textContent='Buy Perth Pass \u00b7 '+PASS_PRICE;a.onclick=goBuyPass;B.appendChild(a);}
  
  $('#psInput').value='';$('#psMsg').textContent='';$('#psMsg').className='psMsg';$('#psInput').closest('label').hidden=own;$('#psRedeem').hidden=own;showOverlay('pass');}
async function redeemPass(){const v=$('#psInput').value;const m=$('#psMsg');if(/^\s*GM/i.test(v)&&await gmCheck(v)){gmEnable();m.textContent='\u2605 Game Master account active: full game unlocked on this device.';m.className='psMsg ok';setTimeout(()=>{hideOverlays();toast('\u2605 Game Master mode \u00b7 open \u2630 \u2192 GM for tools',3.5);},900);return;}if(!passCodeOk(v)){const opened=goBuyPass();if(opened){m.textContent=(v.trim()?'That code isn\u2019t valid. ':'')+'Opening the Perth Pass shop ('+PASS_PRICE+'). Your code arrives by email after you pay.';m.className='psMsg bad';}return;}
  S.pass=true;try{localStorage.setItem('qc-perth-pass','1');}catch(e){}save();m.textContent='Perth Pass unlocked! Fremantle and Victoria Park are open.';m.className='psMsg ok';$('#passBtn').textContent='Perth Pass \u2713';
  setTimeout(()=>{hideOverlays();toast('\u{1F39F} Perth Pass unlocked \u00b7 Fremantle & Victoria Park are open',3.5);},900);}
function needPass(where){if(hasPass())return false;openPass(where);return true;}
function openPause(){if(!running||overlay)return;$('#pzInfo').textContent='Time is stopped at '+fmtTime(S.time)+' on '+dayLabel()+'. Kip, customers and the clock wait for you.';showOverlay('pause');}
function togglePause(){if(overlay==='pause'){hideOverlays();return;}openPause();}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!overlay&&!VISIT&&!transit)openPause();});
let PORTRAIT_LOCK=false;
const ORIENT_LOCK=false;/* portrait and landscape both allowed */
function checkOrient(){if(!ORIENT_LOCK){PORTRAIT_LOCK=false;$('#rotateOv').hidden=true;return;}const mobile=isTouch&&Math.min(screen.width||innerWidth,screen.height||innerHeight)<900;const port=mobile&&innerHeight>innerWidth;if(port!==PORTRAIT_LOCK){PORTRAIT_LOCK=port;$('#rotateOv').hidden=!port;}}
addEventListener('resize',checkOrient);addEventListener('orientationchange',()=>setTimeout(checkOrient,120));
function tryLandscape(){try{if(screen.orientation&&screen.orientation.lock){const go=()=>screen.orientation.lock('landscape').catch(()=>{});if(!document.fullscreenElement&&document.documentElement.requestFullscreen&&isTouch){document.documentElement.requestFullscreen({navigationUI:'hide'}).then(go).catch(go);}else go();}}catch(e){}}
