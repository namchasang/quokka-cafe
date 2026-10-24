// ---------- Island Scale Wave B: north coast bays, snorkelling, Oliver Hill tunnels and the train stations ----------
const WB={acts:[]};
function wbS(){S.wb=S.wb||{snk:{},sp:{},ini:0,tun:0,all:0};return S.wb;}
// ----- a "find it" viewer: snorkel mask, a torch in the tunnels (and binoculars later) -----
const SPOT={on:false,found:new Set(),rings:[]};
function spotOpen(o){SPOT.o=o;SPOT.found=new Set();SPOT.rings=[];SPOT.t0=performance.now();SPOT.mx=320;SPOT.my=200;SPOT.on=true;SPOT.done=false;
  $('#spEye').textContent=o.eye;$('#spName').textContent=o.title;$('#spHint').textContent=o.hint;$('#spCount').textContent='0 / '+o.targets.length;showOverlay('spot');requestAnimationFrame(spotTick);}
function spotPos(T,t){return T.pos?T.pos(t):[T.x,T.y];}
function spotTick(now){if(!SPOT.on)return;if($('#spotOv').hidden){SPOT.on=false;return;}const c=$('#spCanvas'),x=c.getContext('2d'),t=(now-SPOT.t0)/1000,o=SPOT.o;
  o.draw(x,t);
  if(o.torch){const d=SPOT.dark||(SPOT.dark=mk(640,400)),dx=d.getContext('2d');dx.globalCompositeOperation='source-over';dx.fillStyle='rgba(6,5,4,.95)';dx.fillRect(0,0,640,400);dx.globalCompositeOperation='destination-out';
    const g=dx.createRadialGradient(SPOT.mx,SPOT.my,20,SPOT.mx,SPOT.my,105);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.7,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,0)');dx.fillStyle=g;dx.beginPath();dx.arc(SPOT.mx,SPOT.my,105,0,6.283);dx.fill();
    SPOT.found.forEach(id=>{const T=o.targets.find(q=>q.id===id),p=spotPos(T,t);const h=dx.createRadialGradient(p[0],p[1],5,p[0],p[1],T.r+18);h.addColorStop(0,'rgba(0,0,0,.9)');h.addColorStop(1,'rgba(0,0,0,0)');dx.fillStyle=h;dx.beginPath();dx.arc(p[0],p[1],T.r+18,0,6.283);dx.fill();});
    x.drawImage(d,0,0);}
  // rings round what has been found, and a gentle hint after a while
  x.lineWidth=3;o.targets.forEach(T=>{if(!SPOT.found.has(T.id))return;const p=spotPos(T,t);x.strokeStyle='#8fe07a';x.beginPath();x.arc(p[0],p[1],T.r+6,0,6.283);x.stroke();
    x.font='bold 13px system-ui,sans-serif';x.textAlign='center';const w=x.measureText(T.name).width+12;x.fillStyle='rgba(20,40,30,.8)';x.fillRect(p[0]-w/2,p[1]-T.r-30,w,19);x.fillStyle='#fff';x.fillText(T.name,p[0],p[1]-T.r-16);});
  SPOT.rings=SPOT.rings.filter(r=>t-r.t<.6);SPOT.rings.forEach(r=>{const k=(t-r.t)/.6;x.strokeStyle='rgba(255,255,255,'+(1-k)+')';x.beginPath();x.arc(r.x,r.y,8+k*24,0,6.283);x.stroke();});
  if(!SPOT.done&&t>(o.hintAt||16)){const T=o.targets.find(q=>!SPOT.found.has(q.id));if(T){const p=spotPos(T,t),k=(t*1.5)%1;x.setLineDash([6,6]);x.strokeStyle='rgba(255,240,170,'+(1-k)*.9+')';x.beginPath();x.arc(p[0],p[1],T.r+10+k*30,0,6.283);x.stroke();x.setLineDash([]);}}
  requestAnimationFrame(spotTick);}
function spotXY(e){const c=$('#spCanvas'),r=c.getBoundingClientRect();return[(e.clientX-r.left)*640/r.width,(e.clientY-r.top)*400/r.height];}
function spotTap(e){if(!SPOT.on||SPOT.done)return;e.preventDefault();const [px,py]=spotXY(e);SPOT.mx=px;SPOT.my=py;const o=SPOT.o,t=(performance.now()-SPOT.t0)/1000;
  if(o.torch&&e.pointerType!=='mouse'&&!SPOT.lit){SPOT.lit=1;}
  let hit=null;for(const T of o.targets){if(SPOT.found.has(T.id))continue;const p=spotPos(T,t);if(Math.hypot(p[0]-px,p[1]-py)<T.r+10){hit=T;break;}}
  SPOT.rings.push({x:px,y:py,t});if(!hit)return;SPOT.found.add(hit.id);$('#spCount').textContent=SPOT.found.size+' / '+o.targets.length;$('#spHint').textContent=hit.fact||('Found: '+hit.name);
  if(SPOT.found.size===o.targets.length){SPOT.done=true;$('#spName').textContent=o.doneTitle||'All found!';if(o.done)o.done();save();}}
function spotClose(){SPOT.on=false;hideOverlays();}
// ----- the reef under the water at each bay -----
function srand(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
const REEF_SP={wrasse:{name:'Western king wrasse',r:20,fact:'Western king wrasse · bright orange and blue, they zip around the reef looking for snacks.'},
  bream:{name:'Buffalo bream',r:18,fact:'Buffalo bream · dark and round, they graze on seaweed. Snorkellers often see them in pairs.'},
  oldwife:{name:'Old wife',r:17,fact:'Old wife · black and white stripes and a spiky fin. Look, don’t touch: the spines sting.'},
  seastar:{name:'Sea star',r:17,fact:'Sea star · hiding on the rock. Sea stars walk on hundreds of tiny tube feet.'},
  octopus:{name:'Octopus',r:18,fact:'Octopus · it changed colour to match the rock. Clever thing.'},
  ray:{name:'Eagle ray',r:24,fact:'Eagle ray · gliding over the sand like a slow, flat bird.'}};
function reefDraw(seed,list){const R=srand(seed);const rocks=[],grass=[],coral=[];for(let i=0;i<7;i++)rocks.push([30+R()*580,300+R()*80,40+R()*60,24+R()*26,R()]);for(let i=0;i<46;i++)grass.push([R()*640,330+R()*70,30+R()*50,R()*6.283,R()<.5]);
  for(let i=0;i<10;i++)coral.push([R()*640,310+R()*80,10+R()*14,['#e8734a','#c85ab0','#f1c64a','#e85a6a'][Math.floor(R()*4)]]);
  const school=[];for(let i=0;i<9;i++)school.push([R()*640,90+R()*120,R()]);const bub=[];for(let i=0;i<14;i++)bub.push([R()*640,R()*400,2+R()*3]);
  return(x,t)=>{const g=x.createLinearGradient(0,0,0,400);g.addColorStop(0,'#86dcd2');g.addColorStop(.55,'#3fa6b8');g.addColorStop(1,'#1f6c8a');x.fillStyle=g;x.fillRect(0,0,640,400);
    x.globalAlpha=.12;x.fillStyle='#fff';for(let i=0;i<5;i++){const a=60+i*130+Math.sin(t*.4+i)*30;x.beginPath();x.moveTo(a,0);x.lineTo(a+50,0);x.lineTo(a-30+40,400);x.lineTo(a-90,400);x.fill();}x.globalAlpha=1;
    x.fillStyle='#e6d6a2';x.beginPath();x.moveTo(0,330);for(let i=0;i<=16;i++)x.lineTo(i*40,322+Math.sin(i*1.7)*10);x.lineTo(640,400);x.lineTo(0,400);x.fill();
    x.strokeStyle='rgba(180,160,110,.5)';x.lineWidth=2;for(let i=0;i<6;i++){x.beginPath();for(let k=0;k<=32;k++)x.lineTo(k*20,350+i*9+Math.sin(k*.9+i)*3);x.stroke();}
    rocks.forEach(([rx,ry,w,h,v])=>{x.fillStyle=v<.5?'#7a7468':'#8a8070';x.beginPath();x.ellipse(rx,ry,w,h,0,Math.PI,0);x.fill();x.fillStyle='rgba(60,90,50,.5)';x.beginPath();x.ellipse(rx-w*.2,ry-h*.6,w*.4,h*.25,0,0,6.283);x.fill();});
    coral.forEach(([cx,cy,s,c])=>{x.fillStyle=c;for(let k=0;k<4;k++){x.beginPath();x.ellipse(cx+(k-1.5)*s*.5,cy-s*.4-k%2*s*.3,s*.35,s*.6,0,0,6.283);x.fill();}});
    school.forEach(([sx,sy,v],i)=>{const px=(sx+t*(30+v*20))%700-30,py=sy+Math.sin(t*1.3+i)*6;x.fillStyle='#d8e6ee';x.beginPath();x.ellipse(px,py,9,3.5,0,0,6.283);x.fill();x.beginPath();x.moveTo(px-8,py);x.lineTo(px-14,py-4);x.lineTo(px-14,py+4);x.fill();});
    list.forEach(T=>{const p=spotPos(T,t);REEF_ART[T.id](x,p[0],p[1],t);});
    grass.forEach(([gx,gy,h,ph,front])=>{if(!front)return;x.strokeStyle='#4f8f4a';x.lineWidth=3;x.beginPath();x.moveTo(gx,gy);x.quadraticCurveTo(gx+Math.sin(t*1.1+ph)*10,gy-h*.6,gx+Math.sin(t*1.1+ph)*18,gy-h);x.stroke();});
    x.fillStyle='rgba(255,255,255,.55)';bub.forEach(([bx,by,s],i)=>{const py=(by-t*(20+i))%420;x.beginPath();x.arc(bx+Math.sin(t+i)*4,py<0?py+420:py,s,0,6.283);x.fill();});
    const v=x.createRadialGradient(320,200,150,320,200,380);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(10,30,50,.55)');x.fillStyle=v;x.fillRect(0,0,640,400);};}
const REEF_ART={
  wrasse:(x,a,b)=>{x.fillStyle='#e8733a';x.beginPath();x.ellipse(a,b,24,8,0,0,6.283);x.fill();x.fillStyle='#3a7ad0';x.beginPath();x.ellipse(a+14,b,9,7,0,0,6.283);x.fill();x.fillStyle='#e8733a';x.beginPath();x.moveTo(a-20,b);x.lineTo(a-32,b-8);x.lineTo(a-32,b+8);x.fill();x.fillStyle='#fff';x.fillRect(a+17,b-3,3,3);x.strokeStyle='#4ac0e0';x.lineWidth=2;x.beginPath();x.moveTo(a-12,b);x.lineTo(a+6,b);x.stroke();},
  bream:(x,a,b)=>{x.fillStyle='#4a4e46';x.beginPath();x.ellipse(a,b,20,13,0,0,6.283);x.fill();x.beginPath();x.moveTo(a-17,b);x.lineTo(a-29,b-9);x.lineTo(a-29,b+9);x.fill();x.fillStyle='#6a6e60';x.beginPath();x.ellipse(a,b-11,10,4,0,0,6.283);x.fill();x.fillStyle='#e0e0d0';x.fillRect(a+11,b-4,3,3);},
  oldwife:(x,a,b)=>{x.save();x.beginPath();x.ellipse(a,b,17,16,0,0,6.283);x.clip();for(let i=-3;i<4;i++){x.fillStyle=i%2?'#f2efe6':'#1e1e22';x.fillRect(a+i*6-3,b-20,6,40);}x.restore();x.fillStyle='#1e1e22';x.beginPath();x.moveTo(a-6,b-15);x.lineTo(a,b-30);x.lineTo(a+6,b-15);x.fill();x.beginPath();x.moveTo(a-15,b);x.lineTo(a-25,b-7);x.lineTo(a-25,b+7);x.fill();x.fillStyle='#e8c040';x.fillRect(a+10,b-3,3,3);},
  seastar:(x,a,b)=>{x.fillStyle='#e8643a';x.beginPath();for(let i=0;i<10;i++){const r=i%2?6:17,an=-Math.PI/2+i*Math.PI/5;x.lineTo(a+Math.cos(an)*r,b+Math.sin(an)*r);}x.fill();x.fillStyle='#f7a070';x.beginPath();x.arc(a,b,3,0,6.283);x.fill();},
  octopus:(x,a,b,t)=>{x.fillStyle='rgba(138,122,104,.92)';x.beginPath();x.ellipse(a,b-6,14,12,0,0,6.283);x.fill();x.strokeStyle='rgba(138,122,104,.92)';x.lineWidth=4;for(let i=0;i<5;i++){x.beginPath();x.moveTo(a-10+i*5,b+3);x.quadraticCurveTo(a-16+i*8,b+12+Math.sin(t*2+i)*3,a-20+i*10,b+16);x.stroke();}x.fillStyle='#f1e6b0';x.fillRect(a-6,b-8,4,3);x.fillRect(a+3,b-8,4,3);},
  ray:(x,a,b)=>{x.fillStyle='#3c4a5a';x.beginPath();x.moveTo(a+16,b);x.quadraticCurveTo(a,b-30,a-14,b-2);x.quadraticCurveTo(a,b+26,a+16,b);x.fill();x.strokeStyle='#3c4a5a';x.lineWidth=2;x.beginPath();x.moveTo(a-12,b);x.lineTo(a-40,b+3);x.stroke();x.fillStyle='#e8eef2';for(let i=0;i<5;i++)x.fillRect(a-6+i*3,b-8+i*3,2,2);}};
// each bay has its own three to find; positions are fixed slots so a tap always lands
const REEF_BAYS={parakeet:{seed:11,sp:[['wrasse',200,190,1],['oldwife',470,262,0],['seastar',118,316,0]]},
  armstrong:{seed:23,sp:[['bream',420,170,1],['octopus',260,318,0],['wrasse',540,250,1]]},
  catherine:{seed:37,sp:[['seastar',500,320,0],['ray',230,220,1],['bream',110,150,1]]},
  stark:{seed:51,sp:[['oldwife',150,240,1],['octopus',470,316,0],['ray',330,140,1]]},
  bigsalmon:{seed:63,sp:[['wrasse',380,200,1],['seastar',190,322,0],['bream',540,150,1]]}};
function snorkel(bay){const B=REEF_BAYS[bay],name=WB[bay].n;
  const T=B.sp.map(([id,x0,y0,mv],i)=>{const s=REEF_SP[id];return{id,name:s.name,r:s.r,fact:s.fact,pos:mv?(t=>[x0+Math.sin(t*.35+i)*40,y0+Math.sin(t*.9+i*2)*8]):(()=>[x0,y0])};});
  spotOpen({eye:'Snorkelling · '+name,title:'Spot 3 sea creatures',hint:'Tap each creature when you spot it. Some hide near rocks and seagrass.',targets:T,draw:reefDraw(B.seed,T),hintAt:18,doneTitle:'Reef spotted!',
    done:()=>{const W=wbS();T.forEach(q=>W.sp[q.id]=1);if(!W.snk[bay]){W.snk[bay]=1;S.coins+=20;toast('First snorkel at '+name+' · +20 coins',2.4);}
      const all=Object.keys(REEF_BAYS),n=all.filter(k=>W.snk[k]).length,N=all.length;$('#spHint').textContent=n<N?'Bays snorkelled: '+n+' / '+N+'. Each bay hides different sea creatures.':'Every snorkel bay on the island done!';
      if(n===N&&!W.all){W.all=1;S.coins+=50;toast('Reef Spotter! Every bay · +50 coins',3);}}});}
