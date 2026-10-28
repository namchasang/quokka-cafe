// ---------- Island Scale Wave C: Salmon Bay, the Henrietta Rocks wreck, Cathedral Rocks seals, West End boardwalk, whale watching ----------
const WC={acts:[]};
function wcS(){S.wc=S.wc||{wreck:0,bell:0,seals:0,whale:0,dolph:0};return S.wc;}
// binoculars: two round lenses over a scene; everything outside is dark
function binoWrap(draw){return(x,t)=>{draw(x,t);
  const m=SPOT.mask||(SPOT.mask=(()=>{const c=mk(640,400),q=c.getContext('2d');q.fillStyle='#07090c';q.fillRect(0,0,640,400);q.globalCompositeOperation='destination-out';[222,418].forEach(cx=>{const g=q.createRadialGradient(cx,200,150,cx,200,184);g.addColorStop(0,'#000');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.beginPath();q.arc(cx,200,184,0,6.283);q.fill();});return c;})());
  x.drawImage(m,0,0);};}
// open sea from a cliff: sky, horizon, swell
function seaView(seed,extra){const R=srand(seed);const caps=[];for(let i=0;i<40;i++)caps.push([R()*640,150+R()*250,R()]);const cl=[];for(let i=0;i<5;i++)cl.push([R()*640,30+R()*60,40+R()*50]);
  return(x,t)=>{const g=x.createLinearGradient(0,0,0,150);g.addColorStop(0,'#9ccbe8');g.addColorStop(1,'#e2eef2');x.fillStyle=g;x.fillRect(0,0,640,150);
    x.fillStyle='rgba(255,255,255,.85)';cl.forEach(([cx,cy,w],i)=>{const px=(cx+t*4*(i%2?1:-1)+700)%760-60;x.beginPath();x.ellipse(px,cy,w,12,0,0,6.283);x.ellipse(px+w*.4,cy-8,w*.5,12,0,0,6.283);x.fill();});
    const s=x.createLinearGradient(0,150,0,400);s.addColorStop(0,'#2f6f9a');s.addColorStop(1,'#3f9ab0');x.fillStyle=s;x.fillRect(0,150,640,250);
    x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=2;caps.forEach(([cx,cy,v],i)=>{const k=(Math.sin(t*1.2+i)+1)/2;if(k<.4)return;x.globalAlpha=k-.4;x.beginPath();x.moveTo(cx-6-v*8,cy);x.quadraticCurveTo(cx,cy-3,cx+6+v*8,cy);x.stroke();});x.globalAlpha=1;
    if(extra)extra(x,t);};}
// ----- whales in winter, dolphins the rest of the year (from the Cape Vlamingh lookout) -----
const WHALE_ART={spout:(x,a,b,t)=>{const k=(t*.7)%3<1.2;x.fillStyle='#2a3240';x.beginPath();x.ellipse(a,b+4,26,6,0,Math.PI,0);x.fill();if(k){x.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<6;i++){x.beginPath();x.arc(a-4+i%3*4,b-12-i*6,6-i*.6,0,6.283);x.fill();}}},
  fluke:(x,a,b)=>{x.fillStyle='#2a3240';x.beginPath();x.moveTo(a,b+6);x.lineTo(a-4,b-6);x.quadraticCurveTo(a-22,b-12,a-30,b-24);x.quadraticCurveTo(a-10,b-18,a,b-12);x.quadraticCurveTo(a+10,b-18,a+30,b-24);x.quadraticCurveTo(a+22,b-12,a+4,b-6);x.closePath();x.fill();x.fillStyle='#f2f2ee';x.fillRect(a-14,b-16,6,3);x.fillStyle='rgba(255,255,255,.7)';x.fillRect(a-12,b+4,24,3);},
  calf:(x,a,b)=>{x.fillStyle='#2a3240';x.beginPath();x.ellipse(a-16,b,30,7,0,Math.PI,0);x.fill();x.beginPath();x.ellipse(a+22,b+2,15,4,0,Math.PI,0);x.fill();x.fillStyle='rgba(255,255,255,.6)';x.fillRect(a-40,b+1,80,2);},
  breach:(x,a,b,t)=>{const k=Math.max(0,Math.sin(t*.9));x.fillStyle='rgba(255,255,255,.8)';x.beginPath();x.ellipse(a,b+8,30,6,0,0,6.283);x.fill();x.save();x.translate(a,b+6-k*22);x.rotate(-.5);x.fillStyle='#2a3240';x.beginPath();x.ellipse(0,0,13,30,0,0,6.283);x.fill();x.fillStyle='#e8eaee';x.beginPath();x.ellipse(3,6,6,20,0,0,6.283);x.fill();x.restore();},
  pod:(x,a,b,t)=>{x.fillStyle='#5a6672';for(let i=0;i<3;i++){const p=(t*1.6+i*1.1)%3.2;if(p>1.6)continue;const y=b-Math.sin(p/1.6*Math.PI)*12;x.beginPath();x.moveTo(a-24+i*18,y+6);x.quadraticCurveTo(a-20+i*18,y-10,a-12+i*18,y+6);x.fill();}},
  osprey:(x,a,b,t)=>{const w=Math.sin(t*5)*6;x.strokeStyle='#3a2e26';x.lineWidth=4;x.beginPath();x.moveTo(a-22,b-w);x.quadraticCurveTo(a-10,b-8,a,b);x.quadraticCurveTo(a+10,b-8,a+22,b-w);x.stroke();x.fillStyle='#f2efe6';x.beginPath();x.ellipse(a,b+2,4,6,0,0,6.283);x.fill();},
  boat:(x,a,b)=>{x.fillStyle='#f6f6f0';x.beginPath();x.moveTo(a-24,b);x.lineTo(a+24,b);x.lineTo(a+16,b+9);x.lineTo(a-18,b+9);x.fill();x.fillStyle='#c8344a';x.fillRect(a-8,b-10,16,10);x.strokeStyle='#3a3a40';x.lineWidth=2;x.beginPath();x.moveTo(a+12,b);x.lineTo(a+12,b-26);x.lineTo(a+26,b-6);x.stroke();}};
function lookoutWatch(){const W=wcS(),winter=seasonOf(S.day)===2;
  const T=winter?[{id:'spout',name:'Whale spout',x:170,y:208,r:26,pos:t=>[170+Math.sin(t*.2)*20,208],fact:'Spout · a humpback breathing out. The puff can rise three metres!'},
      {id:'fluke',name:'Tail fluke',x:440,y:262,r:28,fact:'Tail fluke · every humpback has a different pattern under its tail, like a fingerprint.'},
      {id:'calf',name:'Mother and calf',x:300,y:320,r:34,pos:t=>[300+Math.sin(t*.15)*30,320],fact:'Mother and calf · they rest in calm water on the long trip south.'},
      {id:'breach',name:'Breach!',x:520,y:178,r:28,fact:'Breach · a whole humpback jumping out of the sea. Nobody knows exactly why. Maybe for fun.'}]
    :[{id:'pod',name:'Dolphin pod',x:250,y:250,r:34,pos:t=>[250+Math.sin(t*.25)*40,250],fact:'Bottlenose dolphins · a family pod hunting along the reef.'},
      {id:'osprey',name:'Osprey',x:470,y:90,r:28,pos:t=>[470+Math.sin(t*.3)*60,90+Math.sin(t*.7)*10],fact:'Osprey · a fish hawk. It hovers, then dives feet-first into the sea.'},
      {id:'boat',name:'Cray boat',x:140,y:178,r:28,fact:'Cray boat · checking lobster pots off the west end, like island fishers have for a century.'}];
  spotOpen({eye:'Cape Vlamingh lookout · binoculars',title:winter?'Whale season! Find 4 whale sightings':'Scan the sea: find 3 sightings',hint:winter?'Humpbacks pass Rottnest every winter on their long migration.':'In winter, humpback whales pass right by here. Today, look for other sea life.',targets:T,
    draw:binoWrap(seaView(winter?91:92,(x,t)=>T.forEach(q=>{const p=spotPos(q,t);WHALE_ART[q.id](x,p[0],p[1],t);}))),hintAt:16,doneTitle:winter?'What a show!':'Sharp eyes!',
    done:()=>{lkDone('cape');if(winter&&!W.whale){W.whale=1;S.coins+=40;toast('Whale watcher · +40 coins',2.6);}else if(!winter&&!W.dolph){W.dolph=1;S.coins+=20;toast('Sea spotter · +20 coins',2.4);}}});}
// ----- the seals at Cathedral Rocks, through the viewer on the deck -----
const SEAL_ART={pup:(x,a,b)=>{x.fillStyle='#3a2e28';x.beginPath();x.ellipse(a,b,13,7,0,0,6.283);x.fill();x.beginPath();x.arc(a+11,b-4,6,0,6.283);x.fill();x.fillStyle='#0a0a0a';x.fillRect(a+12,b-6,2,2);},
  swim:(x,a,b,t)=>{x.fillStyle='#4a3a32';x.beginPath();x.arc(a,b-3,7,0,6.283);x.fill();x.fillRect(a+4,b-4,7,3);x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=2;x.beginPath();x.ellipse(a,b+3,14+Math.sin(t*3)*2,3,0,0,6.283);x.stroke();},
  yawn:(x,a,b,t)=>{x.fillStyle='#5a4a40';x.beginPath();x.ellipse(a,b,24,10,-.15,0,6.283);x.fill();x.beginPath();x.ellipse(a+20,b-12,9,8,-.5,0,6.283);x.fill();const o=(Math.sin(t*1.3)+1)/2;x.fillStyle='#c86a6a';x.beginPath();x.ellipse(a+27,b-12,3,1+o*4,0,0,6.283);x.fill();x.fillStyle='#0a0a0a';x.fillRect(a+21,b-17,2,2);},
  flipper:(x,a,b,t)=>{x.fillStyle='#4a3a32';x.beginPath();x.ellipse(a,b,22,9,.1,0,6.283);x.fill();x.save();x.translate(a-4,b-6);x.rotate(-1+Math.sin(t*2)*.5);x.fillRect(0,-3,18,6);x.restore();}};
function sealView(){const W=wcS();const R=srand(19);const rocks=[];for(let i=0;i<9;i++)rocks.push([40+R()*560,230+R()*110,50+R()*70,26+R()*24]);
  const T=[{id:'pup',name:'Seal pup',x:150,y:262,r:22,fact:'Pup · born in summer, it waits on the rocks while mum goes fishing.'},{id:'swim',name:'Seal swimming',x:440,y:210,r:22,pos:t=>[440+Math.sin(t*.4)*50,210],fact:'Swimming · fur seals can dive over 200 metres for fish and squid.'},
    {id:'yawn',name:'Sleepy seal',x:330,y:300,r:28,fact:'Sleepy seal · fur seals sleep up to twelve hours a day. Relatable.'},{id:'flipper',name:'Flipper wave',x:520,y:330,r:26,fact:'Flipper up · seals hold a flipper in the air to warm up or cool down.'}];
  spotOpen({eye:'Cathedral Rocks · seal viewer',title:'Find 4 seals doing seal things',hint:'New Zealand fur seals rest on Cathedral Rocks all year. Look between the rocks.',targets:T,
    draw:binoWrap(seaView(31,(x,t)=>{rocks.forEach(([rx,ry,w,h],i)=>{x.fillStyle=i%2?'#8a8478':'#7a7468';x.beginPath();x.ellipse(rx,ry,w,h,0,Math.PI,0);x.lineTo(rx+w,ry+8);x.lineTo(rx-w,ry+8);x.fill();x.fillStyle='rgba(255,255,255,.6)';x.fillRect(rx-w,ry+6,w*2,3);});
      T.forEach(q=>{const p=spotPos(q,t);SEAL_ART[q.id](x,p[0],p[1],t);});
      for(let i=0;i<5;i++){const p=[90+i*120,280-((i*53)%50)];x.fillStyle='#5a4a40';x.beginPath();x.ellipse(p[0],p[1],18,7,0,0,6.283);x.fill();}})),hintAt:16,doneTitle:'Seal spotter!',
    done:()=>{if(!W.seals){W.seals=1;S.coins+=25;toast('Seal spotter · +25 coins',2.4);}}});}
