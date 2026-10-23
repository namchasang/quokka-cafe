// ---------- home interiors: furniture and decorating ----------
const FURN={
 sofa:{name:'Linen sofa',price:60,w:2,col:'#7a9ab0',shop:'sp'},bed:{name:'Queen bed',price:80,w:2,col:'#f2e6c8',shop:'sp'},rug:{name:'Woven rug',price:25,w:2,col:'#c86a4a',shop:'sp',floor:true},
 plant:{name:'Fiddle-leaf fig',price:18,w:1,col:'#3e7d5c',shop:'sp'},lamp:{name:'Floor lamp',price:22,w:1,col:'#f1c64a',shop:'sp'},shelf:{name:'Bookshelf',price:40,w:1,col:'#8a5a36',shop:'sp'},
 arm:{name:'Vintage armchair',price:45,w:1,col:'#a8503a',shop:'freo'},record:{name:'Record player',price:50,w:1,col:'#2a2a30',shop:'freo'},surf:{name:'Wall surfboard',price:35,w:1,col:'#5cc6d8',shop:'freo',wall:true},
 poster:{name:'Freo harbour print',price:20,w:1,col:'#e8a33a',shop:'freo',wall:true},vase:{name:'Ceramic vase',price:15,w:1,col:'#e2d2a8',shop:'freo'},
 tv:{name:'Flat-screen TV',price:120,w:2,col:'#1d1d24',shop:'vp'},fridge:{name:'Fridge',price:110,w:1,col:'#dfe6ec',shop:'vp'},console:{name:'Game console',price:70,w:1,col:'#3a3a48',shop:'vp'},
 fairy:{name:'Fairy lights',price:12,w:2,col:'#ffe9a8',shop:'vp',wall:true},bean:{name:'Bean bag',price:28,w:1,col:'#9478d4',shop:'vp'},rice:{name:'Rice cooker',price:30,w:1,col:'#f6f6f0',shop:'vp'}};
const FURN_SHOPS={sp:{id:'sp_home',name:'Swan Home & Living',who:'Furniture · Mends Street'},freo:{id:'f_vintage',name:'Freo Vintage Collective',who:'Second-hand furniture · Freo Markets'},vp:{id:'vp_kmaxhome',name:'Homebox Home & Electricals',who:'Homewares and appliances · Albany Hwy'}};
Object.keys(FURN_SHOPS).forEach(z=>{const F=FURN_SHOPS[z];SHOPS[F.id]={name:F.name,who:F.who,desc:'Buy furniture here, then decorate any home you own: tap a home, choose Decorate interior. Each item placed adds 2 coins to that home’s nightly rent.',items:Object.keys(FURN).filter(k=>FURN[k].shop===z).map(k=>({id:'fu_'+k,name:FURN[k].name,price:FURN[k].price,get desc(){return(FURN[k].wall?'Hangs on the wall':FURN[k].floor?'Lies on the floor':'Floor furniture')+' \u00b7 You have '+((S.furn&&S.furn[k])||0)+' in storage.';},buy:()=>{S.furn=S.furn||{};S.furn[k]=(S.furn[k]||0)+1;}}))};});
const ROOM_W=8,ROOM_H=5;let homeSel=null,furnPick=null;
function roomOf(id){S.rooms=S.rooms||{};S.rooms[id]=S.rooms[id]||[];return S.rooms[id];}
function homeBonus(id){return roomOf(id).length*2;}
function openHome(id){homeSel=id;furnPick=null;renderHome();showOverlay('home');}
function furnDraw(x,k,px,py,cw,ch){const F=FURN[k],w=F.w*cw;x.save();x.translate(px,py);const c=F.col;
  const R=(a,b,ww,hh,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),Math.round(ww),Math.round(hh));};
  if(F.wall){if(k==='fairy'){for(let i=0;i<10;i++){x.fillStyle=['#ffe9a8','#ffc8e0','#c8f0ff'][i%3];x.beginPath();x.arc(w*(i+.5)/10,ch*.3+Math.sin(i/9*Math.PI)*ch*.18,3,0,6.283);x.fill();}}else if(k==='surf'){x.fillStyle=c;x.beginPath();x.ellipse(w/2,ch*.45,w*.14,ch*.42,0,0,6.283);x.fill();R(w/2-1,ch*.1,2,ch*.7,'#f6f6f0');}else{R(w*.15,ch*.12,w*.7,ch*.6,'#3a2a20');R(w*.2,ch*.17,w*.6,ch*.5,c);R(w*.2,ch*.48,w*.6,ch*.19,'#2f78a8');}x.restore();return;}
  if(F.floor){R(2,ch*.55,w-4,ch*.4,c);for(let i=6;i<w-6;i+=6)R(i,ch*.6,2,ch*.3,'rgba(255,255,255,.25)');x.restore();return;}
  const shadow=()=>{x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(w/2,ch*.92,w*.42,ch*.08,0,0,6.283);x.fill();};shadow();
  if(k==='sofa'){R(4,ch*.35,w-8,ch*.5,c);R(4,ch*.2,w-8,ch*.25,'#5a7a90');R(2,ch*.35,7,ch*.5,'#5a7a90');R(w-9,ch*.35,7,ch*.5,'#5a7a90');}
  else if(k==='bed'){R(4,ch*.3,w-8,ch*.55,'#8a5a36');R(6,ch*.36,w-12,ch*.4,c);R(8,ch*.38,w*.25,ch*.16,'#ffffff');R(w*.45,ch*.5,w*.5-6,ch*.26,'#7a9ab0');}
  else if(k==='plant'){R(w*.3,ch*.62,w*.4,ch*.28,'#c2603a');x.fillStyle=c;[[.5,.3,.25],[.32,.42,.2],[.68,.42,.2],[.5,.5,.2]].forEach(([a,b,r])=>{x.beginPath();x.arc(w*a,ch*b,w*r,0,6.283);x.fill();});}
  else if(k==='lamp'){R(w*.47,ch*.3,3,ch*.58,'#3a2a20');x.fillStyle=c;x.beginPath();x.moveTo(w*.28,ch*.34);x.lineTo(w*.72,ch*.34);x.lineTo(w*.62,ch*.12);x.lineTo(w*.38,ch*.12);x.fill();R(w*.3,ch*.86,w*.4,3,'#3a2a20');}
  else if(k==='shelf'){R(w*.12,ch*.08,w*.76,ch*.82,c);for(let i=0;i<3;i++){R(w*.16,ch*(.14+i*.26),w*.68,ch*.2,'#5a3a22');['#c8344a','#2f78a8','#f1c64a','#3e7d5c'].forEach((cc,j)=>R(w*(.18+j*.15),ch*(.16+i*.26),w*.1,ch*.17,cc));}}
  else if(k==='arm'){R(w*.14,ch*.32,w*.72,ch*.52,c);R(w*.18,ch*.16,w*.64,ch*.24,'#8a3a2a');R(w*.1,ch*.4,w*.14,ch*.4,'#8a3a2a');R(w*.76,ch*.4,w*.14,ch*.4,'#8a3a2a');}
  else if(k==='record'){R(w*.12,ch*.5,w*.76,ch*.38,'#8a5a36');R(w*.16,ch*.4,w*.68,ch*.14,c);x.fillStyle='#111';x.beginPath();x.ellipse(w*.45,ch*.46,w*.24,ch*.05,0,0,6.283);x.fill();R(w*.44,ch*.44,3,2,'#c8344a');}
  else if(k==='vase'){x.fillStyle=c;x.beginPath();x.ellipse(w/2,ch*.65,w*.2,ch*.24,0,0,6.283);x.fill();R(w*.42,ch*.28,w*.16,ch*.2,c);x.fillStyle='#e8457a';x.beginPath();x.arc(w*.45,ch*.22,4,0,6.283);x.arc(w*.58,ch*.18,4,0,6.283);x.fill();}
  else if(k==='tv'){R(w*.1,ch*.12,w*.8,ch*.5,c);R(w*.13,ch*.16,w*.74,ch*.42,'#2f78a8');R(w*.18,ch*.2,w*.2,ch*.12,'#8fd0f0');R(w*.15,ch*.68,w*.7,ch*.22,'#8a5a36');}
  else if(k==='fridge'){R(w*.18,ch*.02,w*.64,ch*.88,c);R(w*.18,ch*.34,w*.64,2,'#9aa0a8');R(w*.7,ch*.12,2,ch*.16,'#6a6e76');R(w*.7,ch*.44,2,ch*.2,'#6a6e76');}
  else if(k==='console'){R(w*.12,ch*.56,w*.76,ch*.32,'#8a5a36');R(w*.24,ch*.44,w*.36,ch*.14,c);R(w*.64,ch*.48,w*.16,ch*.08,'#3ec46a');}
  else if(k==='bean'){x.fillStyle=c;x.beginPath();x.ellipse(w/2,ch*.66,w*.4,ch*.26,0,0,6.283);x.fill();x.fillStyle='#b8a0ec';x.beginPath();x.ellipse(w*.42,ch*.58,w*.14,ch*.08,0,0,6.283);x.fill();}
  else if(k==='rice'){R(w*.12,ch*.62,w*.76,ch*.26,'#8a5a36');R(w*.3,ch*.36,w*.4,ch*.28,c);R(w*.34,ch*.32,w*.32,ch*.06,'#c8c0b0');R(w*.45,ch*.5,w*.1,3,'#c8344a');}
  x.restore();}
function renderHome(){const P=PROP_LIST.find(p=>p.id===homeSel);$('#hmTitle').textContent=P.name;const items=roomOf(homeSel);$('#hmBonus').textContent=items.length+' items placed · cosy bonus +'+homeBonus(homeSel)+' coins a night';
  const c=$('#hmCanvas'),x=c.getContext('2d'),W=c.width,H=c.height,cw=W/ROOM_W,wallH=H*.34,ch=(H-wallH)/ROOM_H;x.imageSmoothingEnabled=false;
  const wallCol={apt:'#dfe6ec',house:'#f2e6c8',river:'#f6f2e8'}[homeSel]||'#efe3c4';x.fillStyle=wallCol;x.fillRect(0,0,W,wallH);x.fillStyle='rgba(0,0,0,.06)';for(let i=0;i<W;i+=24)x.fillRect(i,0,2,wallH);
  x.fillStyle=homeSel==='apt'?'#8fb8d8':'#9fd0e6';x.fillRect(W*.62,wallH*.16,W*.26,wallH*.56);x.fillStyle='#ffffff';x.fillRect(W*.75-1,wallH*.16,3,wallH*.56);x.fillStyle=homeSel==='apt'?'#5a7a98':'#7aa356';x.fillRect(W*.62,wallH*.5,W*.26,wallH*.22);
  x.fillStyle='#b88a5a';x.fillRect(0,wallH,W,H-wallH);for(let j=0;j<ROOM_H;j++)for(let i=0;i<ROOM_W;i++){x.fillStyle=(i+j)%2?'#c49868':'#b88a5a';x.fillRect(i*cw,wallH+j*ch,cw,ch);x.fillStyle='rgba(0,0,0,.08)';x.fillRect(i*cw,wallH+j*ch+ch-2,cw,2);}
  x.fillStyle='#8a6a4a';x.fillRect(0,wallH-4,W,4);
  items.filter(it=>FURN[it.k].wall).forEach(it=>furnDraw(x,it.k,it.x*cw,wallH*.08,cw,wallH*.85));
  items.filter(it=>FURN[it.k].floor).forEach(it=>furnDraw(x,it.k,it.x*cw,wallH+it.y*ch,cw,ch));
  items.filter(it=>!FURN[it.k].wall&&!FURN[it.k].floor).sort((a,b)=>a.y-b.y).forEach(it=>furnDraw(x,it.k,it.x*cw,wallH+it.y*ch-ch*.5,cw,ch*1.5));
  const L=$('#hmInv');L.innerHTML='';const inv=S.furn||{};const keys=Object.keys(FURN).filter(k=>inv[k]>0);
  if(!keys.length){const p=document.createElement('p');p.className='mapq';p.textContent='No furniture in storage. Shop at Swan Home & Living (South Perth), Freo Vintage Collective (Freo Markets) or Homebox Home & Electricals (Victoria Park).';L.appendChild(p);}
  keys.forEach(k=>{const b=document.createElement('button');b.type='button';b.className='qtab'+(furnPick===k?' on':'');b.id='fp-'+k;b.textContent=FURN[k].name+' ×'+inv[k];b.onclick=()=>{furnPick=furnPick===k?null:k;renderHome();};L.appendChild(b);});
  $('#hmHint').textContent=furnPick?'Tap the room to place the '+FURN[furnPick].name.toLowerCase()+(FURN[furnPick].wall?' on the wall.':'.'):'Choose an item below, then tap the room. Tap a placed item to put it back in storage.';}
function homeTap(e){const c=$('#hmCanvas'),r=c.getBoundingClientRect(),W=c.width,H=c.height,px=(e.clientX-r.left)/r.width*W,py=(e.clientY-r.top)/r.height*H,cw=W/ROOM_W,wallH=H*.34,ch=(H-wallH)/ROOM_H;const items=roomOf(homeSel);
  const gx=clamp(Math.floor(px/cw),0,ROOM_W-1),onWall=py<wallH,gy=onWall?-1:clamp(Math.floor((py-wallH)/ch),0,ROOM_H-1);
  const hit=items.findIndex(it=>{const F=FURN[it.k];if(F.wall!==onWall&&!(F.wall&&onWall))return onWall===!!F.wall&&false;return(F.wall?onWall:!onWall&&it.y===gy)&&gx>=it.x&&gx<it.x+F.w;});
  if(hit>=0&&!furnPick){const it=items.splice(hit,1)[0];S.furn[it.k]=(S.furn[it.k]||0)+1;save();renderHome();return;}
  if(!furnPick)return;const F=FURN[furnPick];if(!!F.wall!==onWall){toast(F.wall?'That one goes on the wall':'Place that on the floor');return;}const x0=Math.min(gx,ROOM_W-F.w);
  const clash=items.some(it=>{const G=FURN[it.k];if(!!G.wall!==!!F.wall||!!G.floor!==!!F.floor)return false;if(!G.wall&&it.y!==gy)return false;return x0<it.x+G.w&&it.x<x0+F.w;});if(clash){toast('Something is already there');return;}
  items.push({k:furnPick,x:x0,y:gy});S.furn[furnPick]--;if(!S.furn[furnPick])furnPick=null;S.qg=S.qg||{};S.qg.decor=1;save();renderHome();}

