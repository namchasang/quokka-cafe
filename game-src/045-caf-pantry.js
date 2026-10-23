// ---------- café pantry ----------
const STOCK_INFO={beans:{name:'Coffee beans',buy:'General Store (island) · Moonbeam Coffee (Vic Park) · Swan Market'},milk:{name:'Milk',buy:'General Store (island) · Swan Market'},mango:{name:'Mango',buy:'General Store (island) · Swan Market. Garden strawberries or nectarines work too'},mix:{name:'Lamington mix',buy:'General Store (island)'},tea:{name:'Tea',buy:'Lotus Pantry Mart (Vic Park) · General Store (island)'}};
const RECIPE={fc:{fish:1}};/* pantry stock removed: only Fish & chips needs a caught fish */
function addStock(k,n){S.stock=S.stock||{};S.stock[k]=(S.stock[k]||0)+n;save();}
function canMake(k){const R=RECIPE[k]||{};return Object.keys(R).every(ing=>{if(ing==='fish')return(S.inv.fish||0)>=1;if(ing==='mango')return(S.stock.mango||0)>=1||(S.inv.straw||0)>=1||(S.inv.nect||0)>=1;return(S.stock[ing]||0)>=R[ing];});}
function useStock(k){const R=RECIPE[k]||{};Object.keys(R).forEach(ing=>{if(ing==='fish'){S.inv.fish--;return;}if(ing==='mango'&&!(S.stock.mango>0)){if(S.inv.straw>0)S.inv.straw--;else S.inv.nect--;return;}S.stock[ing]-=R[ing];});}
function missingFor(k){const R=RECIPE[k]||{};const m=Object.keys(R).find(ing=>ing==='fish'?!(S.inv.fish>=1):ing==='mango'?!((S.stock.mango||0)>=1||(S.inv.straw||0)>=1||(S.inv.nect||0)>=1):!((S.stock[ing]||0)>=R[ing]));return m?(m==='fish'?'fish':STOCK_INFO[m].name.toLowerCase()):null;}
function lowStock(){return null;return Object.keys(STOCK_INFO).filter(k=>k!=='tea'||(S.menu&&S.menu.thai)).find(k=>(S.stock[k]||0)<=2);}
const GSTORE={x:4.6,z:-8.4};

// ---------- stranded tourists who missed the last ferry ----------
let strandRolled=false;const STRAND_SPOTS=[[-11.6,5.7],[-10.6,6.3],[-12.6,6.4]];let stranded=[];
function spawnStranded(){stranded.forEach(p=>{scene.remove(p.m);scene.remove(p.b);});stranded=[];if(S.wx===3||S.day<2||!unlocked('rooms'))return;const n=Math.random()<.55?1+(Math.random()*2|0):0;
  for(let i=0;i<n;i++){const [x,z]=STRAND_SPOTS[i];const v={skin:pick(SKINS),hair:pick(HAIRS),shirt:pick(['#2f78a8','#e8735a','#86b86e','#9478d4']),pants:pick(PANTS),hat:Math.random()<.5?'#f1c64a':null,bag:'#c8344a'};const m=spriteMesh(humanFrames(v),.95,1.58);m.position.set(x,groundY(x,z),z);scene.add(m);const b=blob(.85);b.position.set(x,groundY(x,z)+.03,z);stranded.push({m,b,x,z,done:false});}
  if(n)toast('Someone missed the last ferry. Check the jetty!',3);}
function offerRoom(p){say(['Tourist: The last ferry left without us… is there anywhere to stay on the island?',{who:'Kip',text:'There’s a cosy spare room above the café. 10 coins a night, breakfast included!'},'Tourist: You’re a lifesaver! We’ll come back with the whole family.'],()=>{p.done=true;S.coins+=10;S.earned+=10;S.roomGuests=(S.roomGuests||0)+1;S.familyNext=(S.familyNext||0)+1;S.qg=S.qg||{};S.qg.roomed=(S.qg.roomed||0)+1;popText('+10 ♥',{x:p.x,y:2,z:p.z});save();
  const m=p.m;let k=0;const walk=()=>{k++;m.position.x+=.12;m.position.z-=.04;if(k<60)setTimeout(walk,30);else{scene.remove(m);scene.remove(p.b);}};walk();});}
// ---------- celebrity guests (fictional) ----------

const STAR_SPOT={x:6.6,z:3.4};let star=null;
const starIcon=(()=>{const c=mk(9,9),x=c.getContext('2d');x.fillStyle='#ffd34d';[[4,0,1,9],[0,4,9,1],[2,2,5,5],[3,1,3,7],[1,3,7,3]].forEach(q=>x.fillRect(...q));x.fillStyle='#fff7c8';x.fillRect(4,3,1,2);return c;})();
function rollStar(){if(star){scene.remove(star.m);scene.remove(star.b);scene.remove(star.ic);star=null;}S.stars=S.stars||{};if(!unlocked('stars'))return;const left=STARS.filter(s=>!S.stars[s.id]||S.stars[s.id]<3);if(S.day<3||!left.length||S.wx===3)return;
  const pending=left.find(s=>S.stars[s.id]&&S.stars[s.id]<3);const s=pending&&Math.random()<.6?pending:Math.random()<.4?pick(left):null;if(!s)return;
  const m=spriteMesh(humanFrames(s.v),1.0,1.66);m.position.set(STAR_SPOT.x,groundY(STAR_SPOT.x,STAR_SPOT.z),STAR_SPOT.z);scene.add(m);const b=blob(.9);b.position.set(STAR_SPOT.x,groundY(STAR_SPOT.x,STAR_SPOT.z)+.03,STAR_SPOT.z);
  const ic=spriteMesh([starIcon],.35,.35,{basic:true,shadow:false});scene.add(ic);star={s,m,b,ic,x:STAR_SPOT.x,z:STAR_SPOT.z};}
function starNeeds(s){const item=ITEMS[s.item].lock&&!(S.menu&&S.menu[s.item])?'flat':s.item;const crop=CROPS[s.crop].lock&&!(S.unlock&&S.unlock[CROPS[s.crop].lock])?'straw':s.crop;return{item,crop};}
function talkStar(){const s=star.s;S.stars=S.stars||{};const st=S.stars[s.id]||0;const nd=starNeeds(s);const it=ITEMS[nd.item],C=CROPS[nd.crop];
  if(!st){S.stars[s.id]=1;S.track='star';save();say([{who:s.name,text:s.line},{who:'Kip',text:'('+s.name+', the '+s.role+' from '+s.from+'! At my café!)'}],()=>openQuest('star',true));return;}
  if(st===1){if(player.carry===nd.item){player.carry=null;S.stars[s.id]=3;const sp=rw(30);S.coins+=sp;save();popText('★ '+it.name+' +'+sp,{x:star.x,y:2.2,z:star.z});say([{who:s.name,text:'Perfect, just how I like it! Best '+it.name+' I\u2019ve had in Australia.'},{who:s.name,text:'Quick, take a photo with me!'},{who:'Kip',text:'(Press the Photo button now for a special Star postcard.)'}]);}else say([{who:s.name,text:'I’d love a '+it.name+'. Make one at the counter and bring it over.'}]);return;}
  if(st===2){const sp=rw(30);S.stars[s.id]=3;S.coins+=sp;save();popText('+'+sp,{x:star.x,y:2.2,z:star.z});say([{who:s.name,text:'You already brought me the perfect drink. Quick, take a photo with me!'},{who:'Kip',text:'(Press the Photo button now for a special Star postcard.)'}]);return;}
  say([{who:s.name,text:'Best café in Australia. I’m telling all my fans!'}]);}
// ---------- tracked-quest banner ----------
let trackT=0;
function updateTrackBar(dt){trackT-=dt;if(trackT>0)return;trackT=.3;const el=$('#trackBar');{const op=document.querySelector('.right.open');let top='';if(op&&innerWidth>900){let mb=0;op.querySelectorAll('.hudBtn').forEach(e=>{if(e.offsetParent===null)return;const q=e.getBoundingClientRect();if(q.width&&q.top<innerHeight*.45)mb=Math.max(mb,q.bottom);});if(mb)top=(mb+10)+'px';}if(el.style.top!==top)el.style.top=top;}if(!running||overlay==='title'){el.hidden=true;return;}
  const q=QUESTS().find(x=>x.id===S.track&&x.open);if(!q){el.hidden=true;return;}const nx=q.steps.find(x=>!x[1]);el.hidden=false;$('#tbTitle').textContent=q.title;
  const tg=curQuest;const d=tg?Math.round(Math.hypot(tg.x-player.x,tg.z-player.z)*10):null;$('#tbStep').textContent=(nx?nx[0]:'All steps done — reward unlocked!')+(tg&&d!=null?' · '+d+' m':'');}
// ---------- Perth overview map ----------
let mapMode='zone';
function pxPattern(base,dots,seed,n){const c=mk(48,48),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,48,48);let q=seed;const rnd=()=>{q=(q*16807)%2147483647;return q/2147483647;};for(let i=0;i<(n||90);i++){x.fillStyle=dots[Math.floor(rnd()*dots.length)];x.fillRect(Math.floor(rnd()*24)*2,Math.floor(rnd()*24)*2,2,2);}return c;}
let PERTH_PATS=null;const PERTH_PINS=[];let ftSel=null;const FT_COST=100;
function renderPerthMap(c){const x=c.getContext('2d'),W=c.width,H=c.height;x.imageSmoothingEnabled=false;
  if(!PERTH_PATS)PERTH_PATS={sea:x.createPattern(pxPattern('#2a8db2',['#3398bd','#2482a6','#47a9c9'],7,70),'repeat'),river:x.createPattern(pxPattern('#3a9cc2',['#46a8cc','#2f8fb6','#5cb6d4'],11,60),'repeat'),grass:x.createPattern(pxPattern('#76ab52',['#6a9e48','#83b85e','#5f9442','#8dc068'],3,140),'repeat'),sand:x.createPattern(pxPattern('#efe4c4',['#e5d8b2','#f6eed6','#dccca2'],5,90),'repeat'),park:x.createPattern(pxPattern('#5f9a45',['#548c3c','#6aa64e'],9,120),'repeat')};
  const P=PERTH_PATS;x.fillStyle=P.sea;x.fillRect(0,0,W,H);
  // mainland: sand beach then grass
  const coast=(off)=>{x.beginPath();x.moveTo(470+off,0);x.bezierCurveTo(440+off,180,500+off,330,455+off,H);x.lineTo(W,H);x.lineTo(W,0);x.closePath();};
  x.save();x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=10;x.setLineDash([3,7]);coast(-8);x.stroke();x.restore();
  coast(0);x.fillStyle=P.sand;x.fill();coast(26);x.fillStyle=P.grass;x.fill();
  // Swan River with sandy banks
  const riv=()=>{x.beginPath();x.moveTo(440,332);x.bezierCurveTo(600,320,640,250,760,250);x.bezierCurveTo(860,250,880,180,990,190);x.bezierCurveTo(1080,200,1110,230,1180,215);x.bezierCurveTo(1230,205,1260,180,1300,150);x.lineTo(1420,90);};
  x.lineCap='round';x.lineJoin='round';riv();x.strokeStyle=P.sand;x.lineWidth=48;x.stroke();
  x.fillStyle=P.sand;x.beginPath();x.ellipse(1000,215,132,66,-.15,0,6.283);x.fill();
  riv();x.strokeStyle=P.river;x.lineWidth=34;x.stroke();x.fillStyle=P.river;x.beginPath();x.ellipse(1000,215,120,55,-.15,0,6.283);x.fill();
  x.save();x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=2;for(let i=0;i<14;i++){const a=600+i*48,b=246+Math.sin(i*1.7)*22;x.beginPath();x.moveTo(a,b);x.lineTo(a+12,b);x.stroke();}x.restore();
  // roads
  const road=(pts,w)=>{x.save();x.strokeStyle='#4b4f58';x.lineWidth=w+4;x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke();x.strokeStyle='#e8dcb8';x.lineWidth=w;x.stroke();x.restore();};
  road([[515,360],[640,330],[780,300],[900,290],[1010,300]],6);road([[1010,300],[1100,320],[1215,372],[1330,430]],6);road([[1150,222],[1170,280],[1215,372]],5);road([[1040,140],[1120,175],[1150,222]],5);
  // Kings Park and CBD
  x.fillStyle=P.park;x.beginPath();x.ellipse(960,120,70,34,0,0,6.283);x.fill();
  [[1030,92,30,38,'#c9c1b2'],[1066,70,22,60,'#b8b0a0'],[1092,84,26,46,'#d4ccbc'],[1122,100,24,30,'#a9a193'],[1050,60,14,36,'#e0d8c8']].forEach(([a,b,w,h,col])=>{x.fillStyle='rgba(15,20,38,.35)';x.fillRect(a+4,b+4,w,h);x.fillStyle=col;x.fillRect(a,b,w,h);x.fillStyle='rgba(255,255,255,.35)';for(let yy=b+4;yy<b+h-4;yy+=7)x.fillRect(a+3,yy,w-6,2);});
  // trees (same dark dots as the island map)
  let q=42;const rnd=()=>{q=(q*16807)%2147483647;return q/2147483647;};x.fillStyle='rgba(26,56,32,.8)';
  for(let i=0;i<520;i++){const a=520+rnd()*(W-520),b=rnd()*H;if(Math.abs(b-(250+(a<760?(332-(a-440)*.25):(a<1000?250-(a-760)*.2:200))))<40)continue;if(Math.hypot((a-1000)/140,(b-215)/75)<1)continue;if(a>1020&&a<1150&&b<135)continue;x.beginPath();x.arc(a,b,3.2+rnd()*2,0,6.283);x.fill();}
  // Heirisson Island islet
  x.fillStyle=P.sand;x.beginPath();x.ellipse(1150,214,28,13,-.2,0,6.283);x.fill();x.fillStyle=P.grass;x.beginPath();x.ellipse(1150,214,23,9,-.2,0,6.283);x.fill();x.fillStyle='rgba(26,56,32,.85)';[[1140,212],[1152,216],[1160,210]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,3,0,6.283);x.fill();});
  // Rottnest: the real island art, mirrored like the island map
  {const bx=40,by=286,bw=360,bh=Math.round(360*(TB.z2-TB.z1)/(TB.x2-TB.x1));x.save();x.imageSmoothingEnabled=true;x.translate(bx+bw,by);x.scale(-1,1);[waterC2,foamC2,terrC].forEach(im=>x.drawImage(im,0,0,bw,bh));x.restore();}
  const fr=freoUnlocked();
  const route=(pts,col,dash,w)=>{x.save();x.strokeStyle='rgba(15,20,38,.55)';x.lineWidth=(w||4)+3;x.setLineDash(dash);x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke();x.strokeStyle=col;x.lineWidth=w||4;x.stroke();x.restore();};
  route([[405,334],[460,338],[500,336]],'#ffffff',[12,9]);route([[405,326],[520,300],[700,262],[900,240],[1010,262]],'#ffffff',[12,9]);route([[1010,268],[1080,262],[1150,222]],'#3ec46a',[1,0]);route([[1150,222],[1190,280],[1215,370]],'#3ec46a',[1,0]);
  const zq=zoneOf(player.x);const txt=(t,px,py,size,col,font)=>{x.font=(font||'800 ')+size+'px "M PLUS Rounded 1c", sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=size*.22;x.strokeStyle='rgba(15,20,38,.9)';x.strokeText(t,px,py);x.fillStyle=col;x.fillText(t,px,py);};
  const pin=(px,py,id,locked)=>{const me=zq===id;if(me){x.fillStyle='rgba(255,233,160,.25)';x.beginPath();x.arc(px,py,30,0,6.283);x.fill();}x.beginPath();x.arc(px,py,locked?11:14,0,6.283);x.fillStyle=locked?'#6b7280':me?'#ffd34d':'#ff5a4a';x.fill();x.lineWidth=3;x.strokeStyle='#0f1426';x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(px,py,4,0,6.283);x.fill();};
  PERTH_PINS.length=0;const place=(px,py,id,name,sub,lx,ly,locked)=>{PERTH_PINS.push({id,name,px,py,lx,ly});if(ftSel===id){x.save();x.strokeStyle='#ffd34d';x.lineWidth=5;x.setLineDash([8,6]);x.beginPath();x.arc(px,py,30,0,6.283);x.stroke();x.restore();}pin(px,py,id,locked);txt(name,lx,ly,34,'#f5ecd8');txt(sub,lx,ly+34,22,locked?'#c0c4cc':'#ffd34d','700 ');if(zq===id)txt('★ You are here',lx,ly-34,20,'#ffd34d');};
  place(220,334,'island','Rottnest Island','Wadjemup · café home',220,442);
  place(500,336,'freo','Fremantle',fr?'Walyalup · ferry':'Locked',560,402,!fr);
  place(1010,268,'sp','South Perth','Mends St Jetty · ferry',900,330);
  {const own=PROP_LIST.filter(P=>propOwned(P.id)).length,sale=PROP_LIST.length-own;const hl=own?('\u{1F3E0} Your home'+(own>1?'s ×'+own:'')+(sale?' · '+sale+' for sale':'')):(unlocked('homes')?'\u{1F3E0} '+sale+' homes for sale':'\u{1F3E0} Homes for sale · open after your first business');txt(hl,900,392,20,own?'#9fd98a':'#f5ecd8','700 ');}
  place(1150,214,'hi','Heirisson Island','Kangaroos · bus',1230,150);
  place(1215,372,'vp','Victoria Park','Albany Hwy · bus',1230,440);
  txt('Indian Ocean',250,110,30,'#cfe6f7','700 ');txt('Swan River',740,206,26,'#e3f3fb','700 ');txt('Perth CBD',1078,30,24,'#f5ecd8','700 ');txt('Kings Park',960,120,18,'#e6f2d8','700 ');
  x.font='800 '+Math.round(9*2.6)+'px "Pixelify Sans", monospace';x.textAlign='left';x.lineWidth=8;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText('N↑',16,26);x.fillStyle='#ffd34d';x.fillText('N↑',16,26);
  x.textAlign='left';x.textBaseline='alphabetic';x.font='700 26px "M PLUS Rounded 1c", sans-serif';x.lineWidth=6;[['- - -  Ferry','#f5ecd8',28],['━━  Bus','#3ec46a',210],['●  You are here','#ffd34d',360]].forEach(([t,col,px])=>{x.strokeText(t,px,532);x.fillStyle=col;x.fillText(t,px,532);});x.textAlign='right';x.fillStyle='#f5ecd8';x.strokeText('Tap a town to fast travel \u00b7 '+FT_COST+' coins',W-24,532);x.fillText('Tap a town to fast travel \u00b7 '+FT_COST+' coins',W-24,532);}
function ftCheck(id){const nm={island:'Rottnest Island',sp:'South Perth',hi:'Heirisson Island',freo:'Fremantle',vp:'Victoria Park'}[id];if(zoneOf(player.x)===id)return{ok:false,why:'You are already in '+nm+'.',nm};
  if(id==='freo'&&!freoUnlocked())return{ok:false,why:'Fremantle is still locked: upgrade Main Jetty to Lv3 and start Kip\u2019s Ferry Co.',nm};
  if(!isGM()&&id!=='island'&&!(S.seenZ&&S.seenZ[id]))return{ok:false,why:'Visit '+nm+' once by ferry or bus before you can fast travel there.',nm};
  return{ok:true,nm};}
function ftSelect(id){ftSel=id;const c=ftCheck(id);const h=$('#ftHint'),g=$('#ftGo');h.hidden=false;g.hidden=!c.ok;if(c.ok){h.textContent='\u2708 Fast travel to '+c.nm+' for '+FT_COST+' coins? (you have '+S.coins+')';g.textContent='Fast travel \u00b7 '+FT_COST+' coins';g.disabled=S.coins<FT_COST;}else h.textContent=c.why;renderPerthMap($('#bigMap'));}
function ftGo(){const id=ftSel;if(!id)return;const c=ftCheck(id);if(!c.ok)return;if((id==='freo'||id==='vp')&&!hasPass()){hideOverlays();needPass(id);return;}if(transit||VISIT)return;if(S.coins<FT_COST){toast('Fast travel costs '+FT_COST+' coins',2);return;}
  S.coins-=FT_COST;hideOverlays();RIDE=null;transit=true;fadeTarget=.95;toast('\u2708 Fast travel to '+c.nm+'\u2026 \u2212'+FT_COST+' coins',2.2);
  setTimeout(()=>{const sp=freeNear(...(SAFE_SPOTS[id]||SAFE_SPOTS.island)[0]);player.bike=false;player.carry=null;player.lying=false;player.x=sp[0];player.z=sp[1];S.time+=20;updateCamera(0,true);fadeTarget=0;transit=false;save();},900);}
function togglePerthMap(){ftSel=null;$('#ftHint').hidden=true;$('#ftGo').hidden=true;const c=$('#bigMap');mapMode=mapMode==='zone'?'perth':'zone';if(mapMode==='perth'){renderPerthMap(c);$('#mapOv .legend').hidden=true;$('#mapQuest').hidden=true;$('#mapOv h2').textContent='Perth';$('#mapOv .eyebrow').textContent='Boorloo · Kip’s Perth';$('#mapPerth').textContent='Back to local map';}else{overlay=null;mapMode='zone';openMap();}}

function basketCount(){return Object.keys(S.inv).reduce((a,k)=>a+(S.inv[k]||0),0);}
function basketStr(){const ks=Object.keys(S.inv).filter(k=>S.inv[k]>0);return ks.map(k=>S.inv[k]+' '+(S.inv[k]>1?CROPS[k].plural:CROPS[k].name)).join(', ');}
function waterPlot(i){S.plots[i].w=true;dtInc('water');qflag('watered');refreshPlots();save();popText('Watered',{x:PLOTS[i].x,y:1.3,z:PLOTS[i].z});}
function harvest(i){const st=S.plots[i];const C=CROPS[st.k];S.inv[st.k]=(S.inv[st.k]||0)+C.yield;S.plots[i]=null;qflag('harvested');refreshPlots();save();popText('+'+C.yield+' '+(C.yield>1?C.plural:C.name),{x:PLOTS[i].x,y:1.5,z:PLOTS[i].z});
  if(!S.toldFerry){S.toldFerry=true;say(['Kip: Fresh from the garden! Gus\u2019s ferry can take these to South Perth this afternoon.']);}}
let plantIdx=-1;
function openPlant(i){if(!running||overlay)return;plantIdx=i;const L=$('#plantList');L.innerHTML='';{const n=document.createElement('p');n.className='mapq';n.textContent='Crops grow one stage each night only if the bed was watered that day (rain counts, or buy a sprinkler). More seeds: Swan Seeds in South Perth, Freo Markets, and Lotus Pantry Mart in Victoria Park.';L.appendChild(n);}
  Object.keys(CROPS).filter(k=>!CROPS[k].noPlant&&(!CROPS[k].lock||(S.unlock&&S.unlock[CROPS[k].lock]))).forEach(k=>{const C=CROPS[k];const d=document.createElement('div');d.className='wi';d.innerHTML='<div class="n"></div><div class="d"></div><div style="grid-row:1 / span 2;grid-column:2;display:flex;flex-direction:column;gap:6px;align-items:stretch"><button class="btn buy" type="button"></button><button class="btn ghost qh" type="button"></button></div>';
    d.querySelector('.n').textContent=C.name;d.querySelector('.d').textContent='Ready in '+C.days+' day'+(C.days>1?'s':'')+' if watered daily · harvest '+C.yield+' \u00d7 '+C.sell+' coins. '+C.fact;
    const b=d.querySelector('.buy');b.id='plant-'+k;b.textContent='Plant · '+C.seed+' coins';b.disabled=S.coins<C.seed;b.addEventListener('click',()=>plant(k));const q=d.querySelector('.qh');q.id='qh-'+k;const qc=QUICK_HARVEST+C.seed;q.textContent='\u26a1 Quick harvest \u00b7 '+qc.toLocaleString()+' coins';q.title='Pay to skip the waiting: get '+C.yield+' '+(C.yield>1?C.plural:C.name)+' right now';q.disabled=S.coins<qc;q.style.cssText='font-size:12px;padding:6px 10px';q.addEventListener('click',()=>quickHarvest(k));L.appendChild(d);});
  $('#plantCoins').textContent=S.coins;showOverlay('plant');}
const QUICK_HARVEST=1000;
function quickHarvest(k){const C=CROPS[k];const cost=QUICK_HARVEST+C.seed;if(plantIdx<0||S.coins<cost||S.plots[plantIdx])return;S.coins-=cost;S.inv[k]=(S.inv[k]||0)+C.yield;qflag('planted');qflag('watered');qflag('harvested');refreshPlots();save();hideOverlays();const P=PLOTS[plantIdx];popText('+'+C.yield+' '+(C.yield>1?C.plural:C.name),{x:P.x,y:1.5,z:P.z});toast('\u26a1 Quick harvest: '+C.yield+' '+(C.yield>1?C.plural:C.name)+' straight into your basket \u00b7 -'+cost.toLocaleString()+' coins',3);}
function plant(k){const C=CROPS[k];if(plantIdx<0||S.coins<C.seed||S.plots[plantIdx])return;S.coins-=C.seed;S.plots[plantIdx]={k,g:0,w:S.wx===3};qflag('planted');refreshPlots();save();hideOverlays();toast('Planted '+C.name+'. Water it every day.');}
function sellProduce(){dtInc('sell');const ks=Object.keys(S.inv).filter(k=>S.inv[k]>0);
  if(!ks.length){S.metMei=true;say(['Mei: G\u2019day! I run the Swan River Grocer.','Mei: Bring me fresh fruit and veg from your island garden and I\u2019ll pay a fair price. Six or more items gets a bulk bonus.']);return;}
  let total=0,count=0;ks.forEach(k=>{total+=S.inv[k]*CROPS[k].sell;count+=S.inv[k];});const bonus=count>=6?Math.round(total*.15):0;const desc=basketStr();
  S.coins+=total+bonus;S.earned+=total+bonus;S.inv={};qflag('sold');S.metMei=true;save();popText('+'+(total+bonus),{x:mei.x,y:2,z:mei.z});
  say(['Mei: Ooh, '+desc+'! Straight from Rottnest?','Mei: That comes to '+total+' coins'+(bonus?', plus a '+bonus+'-coin bulk bonus':'')+'. Pleasure doing business!'],()=>toast('Sold produce · +'+(total+bonus)+' coins'));}
function sail(toSP){if(transit)return;if(VISIT){toast('Go home first to travel',2);return;}transit=true;fadeTarget=.95;toast(toSP?'Sailing up the Swan River to South Perth\u2026':'Sailing back to Rottnest\u2026',2.2);
  setTimeout(()=>{S.time+=60;player.bike=false;if(toSP){qflag('sailed');player.x=SPX;player.z=-3.2;}else{player.x=-13.2;player.z=5;}player.carry=null;updateCamera(0,true);fadeTarget=0;transit=false;
    if(toSP&&!S.metMei)say(['Kip: South Perth! Look at the city across the river.','Kip: Mei\u2019s grocer stall should be along the foreshore.']);},900);}
function nap(){say(['Kip settles into the hammock. The sea breeze does the rest…'],()=>{S.time+=60;if(S.time>=1440)newDay();toast('Napped for an hour');});}

