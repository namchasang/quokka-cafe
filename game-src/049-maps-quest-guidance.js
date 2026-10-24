// ---------- maps + quest guidance ----------
const mmC=$('#mm'),mmX=mmC.getContext('2d'),mmW=mmC.width,mmH=mmC.height;
const MM={x1:-22,x2:99,z1:-22.6,z2:25.6};const MM_WIN=90;
function mmFW(){return Math.max(mmW,Math.round((MM.x2-MM.x1)/MM_WIN*mmW));}function mmFH(){return Math.round(mmFW()*mmH/mmW);}
const MAP_LABELS=[['Main Jetty',-17.5,3.1,0],['Hammock',2.6,11.9,0],['Thomson Bay',-9,12.7,1],['Quokka Cafe',0,5.3,0],['Settlement',-2.4,-10.7,0],['The Basin',20,-11.2,1],['Wadjemup Lighthouse',33.5,-9.4,1],['Pink Lake',42.2,-10,1],['Bathurst Lighthouse',46,-2.4,0],['East Beach',40,12.7,1],['Pinky Beach',39,-11.6,0],['Geordie Bay',60,-9.6,1],['Longreach Bay',67.5,-9,0],['Oliver Hill',56.6,6.6,1],['Lake Herschel',66.2,4.6,0],['Parker Point',62.5,11.2,0],['Little Salmon Bay',70.5,12.2,1],['Strickland Bay',82.4,11.8,0],['Cape Vlamingh',91,-3.6,1],['West End',92,9,0]];
function mapper(W,H,B){B=B||MM;if(B===MM||B.mir)return{X:x=>(B.x2-x)/(B.x2-B.x1)*W,Z:z=>(z-B.z1)/(B.z2-B.z1)*H,U:W/(B.x2-B.x1),mir:true};return{X:x=>(x-B.x1)/(B.x2-B.x1)*W,Z:z=>(z-B.z1)/(B.z2-B.z1)*H,U:W/(B.x2-B.x1)};}
const SPB={x1:98,x2:201,z1:-17,z2:24};
function renderSPBase(W,H,s,all){const c=mk(W,H),x=c.getContext('2d'),m=mapper(W,H,SPB);x.fillStyle='#2f78a8';x.fillRect(0,0,W,H);
  const rect=(x1,z1,x2,z2,col)=>{x.fillStyle=col;x.fillRect(m.X(x1),m.Z(z1),m.X(x2)-m.X(x1),m.Z(z2)-m.Z(z1));};
  x.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<40;i++){const wx=113+((i*37)%74),wz=-9+((i*13)%5);x.fillRect(m.X(wx),m.Z(wz),m.U*1.2,Math.max(1,s));}
  rect(113,-4.2,169,24.2,'#c9b896');rect(113,-4,169,24,'#7aa356');rect(113,-4,169,-2.4,'#ddd3bd');rect(169,10.4,199,24.2,'#7aa356');rect(113,21,199,23.4,'#4a4d55');rect(113,20.4,199,21,'#ddd3bd');rect(169,23.4,199,24,'#ddd3bd');rect(112,24,200,33,'#7aa356');[118,124,131,138,145,166,172,179,186,193].forEach(hx=>rect(hx-1.7,26.5,hx+1.7,29.1,'#b8562e'));rect(170.4,15,174.8,17.8,'#c8344a');rect(181.2,15,185.6,17.8,'#2f5a8a');rect(186,15,190.4,17.8,'#3e7d5c');rect(191.2,15,195.6,17.8,'#e8a33a');rect(177.2,10.4,178.8,20.4,'#a85a44');LANES.forEach(lx=>rect(lx-.9,11,lx+.9,21,'#4a4d55'));HOUSES.forEach(h=>rect(h.x-1.6,h.z-1.4,h.x+1.6,h.z+1.4,'#b8562e'));rect(148.6,10.7,151.4,21,'#4a4d55');rect(147,10.7,148.6,21,'#a85a44');rect(151.4,10.7,153,21,'#a85a44');rect(146,-2.4,155,2.6,'#d8d2c6');rect(158,13.7,164,17.5,'#7f9ebb');rect(141.4,15,145.8,18.2,'#b65a42');rect(134.3,15,138.1,17.8,'#b65a42');rect(154.2,11.1,156.6,14.5,'#3e7d5c');rect(154.2,15.2,156.6,18.6,'#c8344a');rect(144.4,11.3,146.4,13.9,'#e8a33a');rect(118.5,-1.1,123.5,2.3,'#f6f2e8');
  rect(110,-12.7,190,-9.7,'#7aa356');rect(110,-18.4,190,-12.4,'#b9b3a6');
  SKY.forEach(b=>{rect(b.x-b.w/2,b.z-b.d/2,b.x+b.w/2,b.z+b.d/2,'#8f9cad');x.fillStyle='rgba(255,255,255,.25)';x.fillRect(m.X(b.x-b.w/2),m.Z(b.z-b.d/2),m.U*b.w,Math.max(1,s));});
  x.fillStyle='#7fc4d0';x.beginPath();x.arc(m.X(143),m.Z(-11.6),m.U*.8,0,6.283);x.fill();
  rect(SPX-.6,-9.4,SPX+.6,-3.8,'#a8744a');rect(SPX+.9,-9.9,SPX+2.7,-5.3,'#f3efe6');
  rect(142.4,.05,145.6,1.65,'#ef7d5e');rect(161.5,-.2,165.5,2.2,'#c8344a');rect(134,-1.2,137,.8,'#e8d2a6');rect(133.2,2.1,137.8,4.7,'#dfe6ec');rect(154.6,.2,157.4,2.2,'#bfe8d6');[[137,4.5],[160,4.8]].forEach(([bx,bz])=>rect(bx-.8,bz-.25,bx+.8,bz+.25,'#a8744a'));
  x.fillStyle='rgba(111,85,176,.85)';SP_TREES.forEach(([tx,tz])=>{x.beginPath();x.arc(m.X(tx),m.Z(tz),m.U*1.1,0,6.283);x.fill();});
  x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
  [['South Perth',150,7.6,1],['Mends St Jetty',SPX-3.2,-6.4,1],['Swan River',128,-7,1],['Perth CBD',150,-15.4,1],['Swan River Grocer',144,3,0],['Swan Market',163.5,3.4,1],['Mill Point Road',141,22.2,1],['Mill Point Towers',161,12.6,1],['Angelo St',178,9.4,1],['Bus to Vic Park',158.6,19,0],['The Old Mill',106,7.6,1],['Mill Point',107,-1.6,0],['Coode St Jetty',186,-1,1],['Swan Kayaks',175.6,6.8,0],['Narrows Bridge',108,-11.8,0],['Swan River Zoo \u2192',196,18,1],['Mends St',150,10,1],['Mill Point Hotel',143.6,14.2,0],['Old Post Office',136.2,14,0],['Origami Quokka',153.6,-2,0],['Riverfront house',121,4.4,1],['Mends Servo',135.5,5.6,1],['Swan Seeds',156,3.4,1],['Bell Tower',143,-9.1,0]].forEach(([t,lx,lz,mini])=>{if(!all&&!mini)return;x.font='800 '+Math.round(9*s)+'px "M PLUS Rounded 1c", sans-serif';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText(t,m.X(lx),m.Z(lz));x.fillStyle='#f5ecd8';x.fillText(t,m.X(lx),m.Z(lz));});
  x.font='800 '+Math.round(9*s)+'px "Pixelify Sans", monospace';x.textAlign='left';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText('N↑',6*s,10*s);x.fillStyle='#ffd34d';x.fillText('N↑',6*s,10*s);
  return c;}
let spMini=null,spBig=null;
function renderMapBase(W,H,s,all){const c=mk(W,H),x=c.getContext('2d'),m=mapper(W,H);x.imageSmoothingEnabled=true;x.fillStyle='#2a8db2';x.fillRect(0,0,W,H);
  const tx=m.X(TB.x2),tz=m.Z(TB.z1),tw=m.X(TB.x1)-tx,th=m.Z(TB.z2)-tz;x.save();x.translate(tx+tw,tz);x.scale(-1,1);[waterC2,foamC2,terrC].forEach(im=>x.drawImage(im,0,0,tw,th));x.restore();
  const rect=(x1,z1,x2,z2,col)=>{x.fillStyle=col;x.fillRect(m.X(x1),m.Z(z1),m.X(x2)-m.X(x1),m.Z(z2)-m.Z(z1));};
  rect(JETTY.x1,JETTY.z1,JETTY.x2,JETTY.z2,'#a8744a');{const a=IW(34.25,-.1),b=IW(35.75,4.3);rect(a.x,a.z,b.x,b.z,'#b98552');}rect(DECK.x1,DECK.z1,DECK.x2,DECK.z2,'#b98552');{const a=IW(-5.5,-5.2),b=IW(5.5,-2.4);rect(a.x,a.z,b.x,b.z,'#e2584f');}
  COTTAGES.forEach(cg=>{const c=IW(cg.x,cg.z);rect(c.x-1.6,c.z-1.3,c.x+1.6,c.z+1.3,cg.roof);});
  x.fillStyle='rgba(26,56,32,.8)';trees.forEach(t=>{x.beginPath();x.arc(m.X(t.x),m.Z(t.z),m.U*.6,0,6.283);x.fill();});
  [[33.5,-6.3,1.4],[46.5,-4.5,.85]].forEach(([ox,oz,r])=>{const lx=IWx(ox,oz),lz=IWz(ox,oz);x.fillStyle='#f3efe6';x.beginPath();x.arc(m.X(lx),m.Z(lz),m.U*r,0,6.283);x.fill();x.fillStyle='#c9473f';x.beginPath();x.arc(m.X(lx),m.Z(lz),m.U*r*.45,0,6.283);x.fill();});
  x.fillStyle='#f3efe6';x.fillRect(m.X(IWx(-22.8,5.9)),m.Z(IWz(-22.8,5.9)),m.U*4.6,m.U*1.8);
  x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
  MAP_LABELS.forEach(([t,lx,lz,mini])=>{if(!all&&!mini)return;x.font='800 '+Math.round(9*s)+'px "M PLUS Rounded 1c", sans-serif';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText(t,m.X(lx),m.Z(lz));x.fillStyle='#f5ecd8';x.fillText(t,m.X(lx),m.Z(lz));});
  x.font='800 '+Math.round(9*s)+'px "Pixelify Sans", monospace';x.textAlign='left';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText('N↑',6*s,10*s);x.fillStyle='#ffd34d';x.fillText('N↑',6*s,10*s);
  if(all){const bar=m.U*5;x.fillStyle='rgba(245,236,216,.9)';x.fillRect(W-bar-14*s,H-12*s,bar,2*s);x.textAlign='center';x.font='700 '+Math.round(8*s)+'px "M PLUS Rounded 1c", sans-serif';x.strokeText('50 m',W-bar/2-14*s,H-20*s);x.fillText('50 m',W-bar/2-14*s,H-20*s);}
  return c;}
let mmBase=renderMapBase(mmFW(),mmFH(),1.15,false),bigBase=null;
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{mmBase=renderMapBase(mmFW(),mmFH(),1.15,false);bigBase=null;spMini=null;spBig=null;frMini=null;frBig=null;Object.keys(zoneCache).forEach(k=>delete zoneCache[k]);});
function drawMapDynamic(x,W,H,s,t,q,B){const m=mapper(W,H,B);const sp=B!==MM&&!B.mir;
  if(B===FB){FREO_NPCS.forEach(n=>{x.fillStyle='#3f7fe0';x.strokeStyle='#ffffff';x.lineWidth=1.5*s;x.beginPath();x.arc(m.X(n.x),m.Z(n.z),3.2*s,0,6.283);x.fill();x.stroke();});}
  else if(sp){PROP_LIST.forEach(P=>{x.fillStyle=propOwned(P.id)?'#86b86e':'#ffd34d';x.strokeStyle='#0f1424';x.lineWidth=1.2*s;x.beginPath();x.moveTo(m.X(P.x),m.Z(P.z)-6*s);x.lineTo(m.X(P.x)+5*s,m.Z(P.z));x.lineTo(m.X(P.x)-5*s,m.Z(P.z));x.closePath();x.fill();x.stroke();if(s>2&&B===SPB){const own=propOwned(P.id),sub=own?'\u{1F3E0} Your home \u00b7 +'+(P.rent+homeBonus(P.id))+'/night':'\u{1F3E0} For sale \u00b7 '+P.price.toLocaleString('en-AU');x.save();x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.font='800 '+Math.round(6.8*s)+'px "M PLUS Rounded 1c", sans-serif';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.92)';x.strokeText(sub,m.X(P.x),m.Z(P.z)-12*s);x.fillStyle=own?'#9fd98a':'#ffd34d';x.fillText(sub,m.X(P.x),m.Z(P.z)-12*s);x.restore();}});[mei,ruth].forEach(n=>{x.fillStyle='#3f7fe0';x.strokeStyle='#ffffff';x.lineWidth=1.5*s;x.beginPath();x.arc(m.X(n.x),m.Z(n.z),3.6*s,0,6.283);x.fill();x.stroke();});}
  else{
  if(S.wish.room){x.fillStyle='#f3efe6';x.fillRect(m.X(HUT.x-1.5),m.Z(HUT.z-1.3),m.U*3,m.U*2.6);}
  if(S.wish.hammock){x.fillStyle='#ef7d5e';x.fillRect(m.X(HAMMOCK.x-1.2),m.Z(HAMMOCK.z-.2),m.U*2.4,m.U*.5);}
  LORE.forEach((L,i)=>{x.fillStyle=S.lore[i]?'#7d8a8c':'#8fe8ff';x.strokeStyle='#0f1424';x.lineWidth=1.2*s;const X=m.X(L.x),Z=m.Z(L.z),r=4.5*s;x.beginPath();x.moveTo(X,Z-r);x.lineTo(X+r*.8,Z);x.lineTo(X,Z+r);x.lineTo(X-r*.8,Z);x.closePath();x.fill();x.stroke();});
  SHELLS.forEach(sh=>{if(!sh.mesh.visible)return;x.fillStyle='#f6b8a8';x.strokeStyle='#0f1424';x.lineWidth=1*s;x.beginPath();x.arc(m.X(sh.x),m.Z(sh.z),3*s,0,6.283);x.fill();x.stroke();});
  x.fillStyle='#ffffff';customers.forEach(c=>x.fillRect(m.X(c.x)-1.5*s,m.Z(c.z)-1.5*s,3*s,3*s));
  x.fillStyle='#d9b48a';wilds.forEach(w=>{x.beginPath();x.arc(m.X(w.x),m.Z(w.z),1.8*s,0,6.283);x.fill();});
  [gus,wren].forEach(n=>{x.fillStyle='#3f7fe0';x.strokeStyle='#ffffff';x.lineWidth=1.5*s;x.beginPath();x.arc(m.X(n.x),m.Z(n.z),3.6*s,0,6.283);x.fill();x.stroke();});
  if(unlocked('coach'))COACH.forEach((b,i)=>{const X=m.X(b.x),Z=m.Z(b.z),r=(s>2?5.5:3)*s/(s>2?2.6:1);const sel=ftSel==='bus:'+b.id;x.fillStyle=sel?'#ffd34d':'#1f5fae';x.strokeStyle='#ffffff';x.lineWidth=(sel?2.4:1.2)*(s>2?2:1);x.fillRect(X-r,Z-r,r*2,r*2);x.strokeRect(X-r,Z-r,r*2,r*2);if(s>2){x.fillStyle='#ffffff';x.font='800 '+Math.round(r*1.3)+'px "M PLUS Rounded 1c", sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(i+1,X,Z+.5);}});}
  const PX=m.X(player.x),PZ=m.Z(player.z);
  if(q){const QX=m.X(q.x),QZ=m.Z(q.z);x.save();x.strokeStyle='#ff5d5d';x.lineWidth=2*s;x.setLineDash([5*s,4*s]);x.lineDashOffset=-t*18*s;x.beginPath();x.moveTo(PX,PZ);x.lineTo(QX,QZ);x.stroke();x.restore();
    x.fillStyle='#3a1418';x.beginPath();x.arc(QX,QZ-6*s,5.5*s,0,6.283);x.fill();x.beginPath();x.moveTo(QX-3.5*s,QZ-4*s);x.lineTo(QX+3.5*s,QZ-4*s);x.lineTo(QX,QZ+1*s);x.fill();
    x.fillStyle='#ff5d5d';x.beginPath();x.arc(QX,QZ-6*s,4*s,0,6.283);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(QX,QZ-6*s,1.6*s,0,6.283);x.fill();}
  let ang=Math.atan2(-Math.cos(yaw),-Math.sin(yaw));if(m.mir)ang=Math.PI-ang;
  x.fillStyle='rgba(255,233,160,.2)';x.beginPath();x.moveTo(PX,PZ);x.arc(PX,PZ,26*s,ang-.45,ang+.45);x.closePath();x.fill();
  x.save();x.translate(PX,PZ);x.rotate(ang);x.fillStyle='#ffd34d';x.strokeStyle='#2a1d1a';x.lineWidth=1.5*s;x.beginPath();x.moveTo(7*s,0);x.lineTo(-5*s,-5*s);x.lineTo(-2*s,0);x.lineTo(-5*s,5*s);x.closePath();x.fill();x.stroke();x.restore();}
const PIN_ROWS=["..ooooo..",".orrrrro.","orrwwrrro","orrwwrrro","orrrrrrro",".orrrrro.","..orrro..","..orrro..","...oro...","...oro...","....o...."];
const questPin=spriteMesh([pix(PIN_ROWS,{o:'#3a1418',r:'#ff5d5d',w:'#ffffff'})],.5,.62,{basic:true,shadow:false});questPin.visible=false;scene.add(questPin);
function questTarget(){const zq=zoneOf(player.x);if(zq==='hi'||zq==='vp'){if(S.track==='vpfood'&&zq==='vp'){const tt=trackTarget('vpfood');if(tt)return tt;}const c=nearestPostcard();return c||{x:BUS_STOPS[zq].x,z:BUS_STOPS[zq].z+.6,label:'Bus back to South Perth'};}
  if(false){}
  const near=list=>{let b=null,bd=1e9;list.forEach(o=>{const d=Math.hypot(o.x-player.x,o.z-player.z);if(d<bd){bd=d;b=o;}});return b;};
  if(zq==='freo'){const left=FREO_STOPS.filter(f=>!(S.fq&&S.fq[f.id]));if(left.length){let b=left[0],bd=1e9;left.forEach(f=>{const d=Math.hypot(f.x-player.x,f.z-player.z);if(d<bd){bd=d;b=f;}});return{x:b.x,z:b.z,label:b.label};}return{x:288,z:-17.6,label:'Ferry back to Rottnest'};}
  if(player.x>100)return basketCount()?{x:mei.x,z:mei.z,label:'Sell produce to Mei'}:{x:SPX,z:-8.6,label:'Ferry back to Rottnest'};
  if(phase()==='cafe'){const waiting=customers.filter(c=>c.state==='wait');
    if(player.carry){const mt=waiting.filter(c=>c.order===player.carry);if(mt.length){const c=near(mt);return{x:c.x,z:c.z,label:'Serve '+ITEMS[c.order].name};}}
    if(waiting.length){const c=waiting.reduce((a,b)=>a.patience<b.patience?a:b);const st=STATIONS.find(s=>s.key===c.order);return{x:st.x,z:-1.65,label:'Make '+ITEMS[c.order].name};}
    return{...IW(0,-1.65),label:'Café counter'};}
  if(S.track){const tt=trackTarget(S.track);if(tt)return tt;}
  if(S.quest===0)return{x:wren.x,z:wren.z,label:'Nana Wren'};
  if(S.quest===1){const left=SHELLS.filter((s,i)=>!S.shells[i]);if(left.length){const s=near(left);return{x:s.x,z:s.z,label:'Lost shell'};}return{x:wren.x,z:wren.z,label:'Back to Nana Wren'};}
  const rdy=S.plots.findIndex(p=>p&&p.g>=CROPS[p.k].days);if(rdy>=0)return{x:PLOTS[rdy].x,z:PLOTS[rdy].z+1.05,label:'Harvest '+CROPS[S.plots[rdy].k].name};
  if(basketCount()&&canSail())return{...IW(-20.4,5),label:'Ferry to South Perth'};
  const dry=S.plots.findIndex(p=>p&&!p.w&&p.g<CROPS[p.k].days);if(dry>=0)return{x:PLOTS[dry].x,z:PLOTS[dry].z+1.05,label:'Water '+CROPS[S.plots[dry].k].name};
  const lore=LORE.filter((L,i)=>!S.lore[i]);if(lore.length){const L=near(lore);return{x:L.x,z:L.z+.55,label:'Lore stone: '+L.title};}
  return null;}
let mmT=0,curQuest=null;const mmLbl=$('#mmT');let lastMmLbl='';
function updateQuestUI(dt,t){curQuest=running?questTarget():null;
  const q=curQuest,far=q&&Math.hypot(q.x-player.x,q.z-player.z)>1.7;questPin.visible=!!far;if(far)questPin.position.set(q.x,2.15+Math.sin(t*3)*.12,q.z);
  mmT-=dt;if(mmT>0||ui.hud.hidden)return;mmT=.1;const zq=zoneOf(player.x);if(zq==='island'){const FW=mmBase.width,FH=mmBase.height,ww=(MM.x2-MM.x1)*mmW/FW,wh=ww*mmH/mmW;let cx=clamp(player.x,MM.x1+ww/2,MM.x2-ww/2),cz=clamp(player.z,MM.z1+wh/2,MM.z2-wh/2);const LB={mir:true,x1:cx-ww/2,x2:cx+ww/2,z1:cz-wh/2,z2:cz+wh/2};const sx=(MM.x2-LB.x2)/(MM.x2-MM.x1)*FW,sz=(LB.z1-MM.z1)/(MM.z2-MM.z1)*FH;mmX.fillStyle='#2a8db2';mmX.fillRect(0,0,mmW,mmH);mmX.drawImage(mmBase,sx,sz,mmW,mmH,0,0,mmW,mmH);drawMapDynamic(mmX,mmW,mmH,1,t,q,LB);}else{mmX.drawImage(zoneBase(zq,false),0,0);drawMapDynamic(mmX,mmW,mmH,1,t,q,ZONE_B(zq));}
  const lbl=q?'→ '+q.label+' · '+Math.round(Math.hypot(q.x-player.x,q.z-player.z)*10)+' m':'All quests done · explore freely';if(lbl!==lastMmLbl){lastMmLbl=lbl;mmLbl.textContent=lbl;}}
function openMap(){if(!running||overlay)return;mapMode='zone';ftSel=null;$('#ftHint').hidden=true;$('#ftGo').hidden=true;$('#mapOv .legend').hidden=false;$('#mapQuest').hidden=false;if($('#mapPerth'))$('#mapPerth').textContent='Perth map';const c=$('#bigMap'),x=c.getContext('2d');const zq=zoneOf(player.x);if(zq==='island'){if(!bigBase)bigBase=renderMapBase(c.width,c.height,2.6,true);x.drawImage(bigBase,0,0);}else x.drawImage(zoneBase(zq,true),0,0);drawMapDynamic(x,c.width,c.height,2.6,performance.now()/1000,questTarget(),ZONE_B(zq));const ZN={island:['Island map','Wadjemup \u00b7 Rottnest Island'],sp:['South Perth','Mends Street Jetty \u00b7 Swan River'],freo:['Fremantle','Walyalup \u00b7 Fremantle'],hi:[ZONE_DEF.hi.title,ZONE_DEF.hi.eb],vp:[ZONE_DEF.vp.title,ZONE_DEF.vp.eb]}[zq];$('#mapOv h2').textContent=ZN[0];$('#mapOv .eyebrow').textContent=ZN[1];
  document.querySelectorAll('#mapOv .lg-sp').forEach(e=>e.hidden=zq!=='sp');
  const q=questTarget();$('#mapQuest').textContent=q?'Current goal: '+q.label:'All quests done. Explore freely.';showOverlay('map');}
$('#mm').addEventListener('click',openMap);$('#mapClose').addEventListener('click',hideOverlays);

// the island's shape, sand, paths, water and surf, re-made for the bigger island
let ISL_OX=null,ISL_OZ=null,ISL_PD=null;
function islOld(x,z){const u=(x-TB.x1)*GR,v=(z-TB.z1)*GR;let i=Math.floor(u),j=Math.floor(v);i=clamp(i,0,GW-2);j=clamp(j,0,GH-2);const a=clamp(u-i,0,1),b=clamp(v-j,0,1),k=j*GW+i;
  const L=(A)=>(A[k]*(1-a)+A[k+1]*a)*(1-b)+(A[k+GW]*(1-a)+A[k+GW+1]*a)*b;return[L(ISL_OX),L(ISL_OZ)];}
function islPD(x,z){const u=(x-TB.x1)*GR,v=(z-TB.z1)*GR;const i=Math.floor(u),j=Math.floor(v);if(i<0||j<0||i>=GW-1||j>=GH-1)return 9;const a=u-i,b=v-j,k=j*GW+i,A=ISL_PD;return(A[k]*(1-a)+A[k+1]*a)*(1-b)+(A[k+GW]*(1-a)+A[k+GW+1]*a)*b;}
function islandGround(){ISL.tg0=performance.now();
  // new bounds: the old bounds, warped
  let x1=1e9,x2=-1e9,z1=1e9,z2=-1e9;const O={x1:-24,x2:99,z1:-16,z2:20};for(let t=0;t<=1;t+=1/80){[[O.x1+(O.x2-O.x1)*t,O.z1],[O.x1+(O.x2-O.x1)*t,O.z2],[O.x1,O.z1+(O.z2-O.z1)*t],[O.x2,O.z1+(O.z2-O.z1)*t]].forEach(([x,z])=>{const w=isW(x,z);x1=Math.min(x1,w[0]);x2=Math.max(x2,w[0]);z1=Math.min(z1,w[1]);z2=Math.max(z2,w[1]);});}
  TB.x1=Math.floor(x1);TB.x2=Math.min(100,Math.ceil(x2));TB.z1=Math.floor(z1);TB.z2=Math.ceil(z2);GW=(TB.x2-TB.x1)*GR+1;GH=(TB.z2-TB.z1)*GR+1;
  const F0=Fg,W0=(99+24)*GR+1,H0=(20+16)*GR+1,f0=(x,z)=>{const u=(x+24)*GR,v=(z+16)*GR;if(u<0||v<0||u>=W0-1||v>=H0-1)return islandF(x,z);const i=u|0,j=v|0,a=u-i,b=v-j,k=j*W0+i;return(F0[k]*(1-a)+F0[k+1]*a)*(1-b)+(F0[k+W0]*(1-a)+F0[k+W0+1]*a)*b;};
  Fg=new Float32Array(GW*GH);Dg=new Float32Array(GW*GH);ISL_OX=new Float32Array(GW*GH);ISL_OZ=new Float32Array(GW*GH);ISL_PD=new Float32Array(GW*GH).fill(9);
  {const CW=TB.x2-TB.x1+1,CH=TB.z2-TB.z1+1,CX=new Float32Array(CW*CH),CZ=new Float32Array(CW*CH);for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const o=isWinv(TB.x1+i,TB.z1+j);CX[j*CW+i]=o[0];CZ[j*CW+i]=o[1];}
   for(let j=0;j<GH;j++){const v=j/GR,j0=Math.min(CH-2,Math.floor(v)),b=v-j0;for(let i=0;i<GW;i++){const u=i/GR,i0=Math.min(CW-2,Math.floor(u)),a=u-i0,c=j0*CW+i0,k=j*GW+i;
     const ox=(CX[c]*(1-a)+CX[c+1]*a)*(1-b)+(CX[c+CW]*(1-a)+CX[c+CW+1]*a)*b,oz=(CZ[c]*(1-a)+CZ[c+1]*a)*(1-b)+(CZ[c+CW]*(1-a)+CZ[c+CW+1]*a)*b;ISL_OX[k]=ox;ISL_OZ[k]=oz;Fg[k]=f0(ox,oz);}}}
  for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const k=j*GW+i;const i0=i>0?k-1:k,i1=i<GW-1?k+1:k,j0=j>0?k-GW:k,j1=j<GH-1?k+GW:k;
    const fx=(Fg[i1]-Fg[i0])*GR/((i1-i0)||1),fz=(Fg[j1]-Fg[j0])*GR/(((j1-j0)/GW)||1);Dg[k]=Fg[k]/Math.max(.004,Math.hypot(fx,fz));}
  // path distance field, stamped segment by segment
  for(const p of PATHS)for(let s=0;s<p.length-1;s++){const [ax,az]=p[s],[bx,bz]=p[s+1];const i0=Math.max(0,Math.floor((Math.min(ax,bx)-1.5-TB.x1)*GR)),i1=Math.min(GW-1,Math.ceil((Math.max(ax,bx)+1.5-TB.x1)*GR)),j0=Math.max(0,Math.floor((Math.min(az,bz)-1.5-TB.z1)*GR)),j1=Math.min(GH-1,Math.ceil((Math.max(az,bz)+1.5-TB.z1)*GR));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=j*GW+i,d=segD(TB.x1+i/GR,TB.z1+j/GR,ax,az,bx,bz);if(d<ISL_PD[k])ISL_PD[k]=d;}}
  TCX=(TB.x1+TB.x2)/2;TCZ=(TB.z1+TB.z2)/2;TWD=TB.x2-TB.x1;THT=TB.z2-TB.z1;
  terrC.width=TWD*TPX;terrC.height=THT*TPX;waterC2.width=foamC2.width=TWD*WPX;waterC2.height=foamC2.height=THT*WPX;
  ISL.tg=performance.now();paintTerrain();ISL.tp=performance.now();paintWater();ISL.tw=performance.now();gtInit();GT.fast=true;
  [[shore,-.12],[foam,-.11],[terrain,0],[waves,-.1]].forEach(([m,y])=>{m.geometry.dispose();m.geometry=new THREE.PlaneGeometry(TWD,THT);m.position.set(TCX,y,TCZ);if(m.material.map)m.material.map.needsUpdate=true;});
  waveMat.uniforms.tD.value.dispose();waveMat.uniforms.tD.value=makeWaveTex();waveMat.uniforms.uB.value.set(TB.x1,TB.z1,TWD,THT);{const s=IW(82,11);waveMat.uniforms.uSurf.value.set(s.x,s.z);}
  clouds.geometry.dispose();clouds.geometry=new THREE.PlaneGeometry(TWD,THT);clouds.position.set(TCX,.19,TCZ);cloudTex.repeat.set(2*TWD/90,1.1*THT/48);}
