// ---------- Things to do at Serpentine Falls camp (Look Lab ?campfun, Paul 23 Nov 2026) ----------
// Paul: "สิ่งที่ทำได้ในแคมป์: เล่นน้ำ · หาของที่พอสซั่มขโมยไป ของอยู่ในป่า · ย่างมาร์ชเมลโล่ · ตกปลาในลำธาร · กลางคืนดูดาว".
// From the Serpentine trip in the campsite script (trip D) where it fits. All on the srp map:
//  1. swim in the plunge pool under the biggest falls (refreshed: faster walking, full stamina)
//  2. the possum raid: after dark the food box is open; a possum has hidden 4 camp things in the forest; find them all
//  3. roast a marshmallow at the burning campfire: hold to toast, let go when it is golden
//  4. fish the creek: 3 creek spots with their own freshwater catch (the normal fishing game)
//  5. after dark, lie back by the fire and watch the stars: tap shooting stars to make wishes
var CAMPFUN_LIVE=true;/* live: Paul, 23 Nov 2026 'ขึ้นเกมได้: กิจกรรมแคมป์' */
const CAMPFUN={on:CAMPFUN_LIVE||/[?&#]campfun\b/.test(location.search+location.hash)};
if(CAMPFUN.on&&typeof CAMPPARK!=='undefined'&&CAMPPARK.on)(()=>{
  const SC=()=>CAMPPARK.S,G=(lx,lz)=>[CAMPPARK.CX+lx*SC(),CAMPPARK.CZ+lz*SC()];
  const ck=()=>CAMPPARK.CK,CKP=(lx,lz)=>{const r=ck().root.position;return[r.x+lx*SC(),r.z+lz*SC()];};
  const night=()=>S.time>=1110||S.time<330;const here=()=>zoneOf(player.x)==='srp'&&CAMPPARK.E&&CAMPPARK.CK;
  const st=()=>(S.campfun=S.campfun||{});
  /* ---------- a small full-screen panel for the two mini-games ---------- */
  const css=document.createElement('style');css.textContent='#cfOv{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;background:rgba(8,10,20,.55);font:700 14px "M PLUS Rounded 1c",system-ui,sans-serif;color:#f6efe0;touch-action:none}'+
    '#cfOv .box{background:#1a2234;border:2px solid #e2c27c;border-radius:14px;padding:14px 16px;text-align:center;max-width:92vw;box-shadow:0 10px 30px rgba(0,0,0,.5)}#cfOv button{margin-top:10px;padding:10px 18px;border-radius:999px;border:2px solid #e2c27c;background:#f2b632;color:#2a1d08;font:800 15px inherit;cursor:pointer}'+
    '#cfOv.sky{background:none;padding:0}#cfOv.sky canvas{position:absolute;inset:0;width:100%;height:100%}#cfOv .hud{position:absolute;left:0;right:0;top:calc(14px + env(safe-area-inset-top));text-align:center;text-shadow:0 1px 3px #000}';document.head.appendChild(css);
  function panel(cls){const d=document.createElement('div');d.id='cfOv';if(cls)d.className=cls;document.body.appendChild(d);overlay='campfun';return d;}
  function close(d){d.remove();if(overlay==='campfun')overlay=null;}
  /* ---------- 1. swim ---------- */
  function swim(){const q=CAMPPARK.E.big;transit=true;fadeTarget=.6;setTimeout(()=>{fadeTarget=0;transit=false;S.refreshed=true;if(typeof STAM_MAX!=='undefined')S.stamina=STAM_MAX;st().swims=(st().swims||0)+1;save();
      say(['Kip: *SPLASH* ...It’s freezing! It’s perfect!','Kip: The water is the colour of tea and so clear I can see the pebbles. The falls roar right over my head.',{who:'\u{1F4A6} Falls pool',text:'Refreshed: Kip walks faster for the rest of the day and his stamina is full.'}]);},700);}
  /* ---------- 2. the possum raid ---------- */
  const LOOT=[['marshmallows','the bag of marshmallows','#f6f2ea'],['biscuits','the biscuit tin','#c8964a'],['torch','the torch','#d8634a'],['hat','Kip’s sun hat','#5f9442']];
  let raid=null;
  function startRaid(){const E=CAMPPARK.E,c=E.camp;if(!c)return;const items=[];let tries=0;
    while(items.length<LOOT.length&&tries++<900){const a=Math.random()*6.283,r=c.r+8+Math.random()*26,lx=c.x+Math.cos(a)*r,lz=c.z+Math.sin(a)*r;if(Math.abs(lx)>70||Math.abs(lz)>70)continue;if(E.inWater(lx,lz)||E.slopeAt(lx,lz)>.6)continue;
      if(items.some(o=>Math.hypot(o.lx-lx,o.lz-lz)<12))continue;const [x,z]=G(lx,lz);if(blocked(x,z))continue;items.push({lx,lz,x,z});}
    raid={items:items.map((p,i)=>{const L=LOOT[i];const g=new THREE.Group();const m=new THREE.Mesh(L[0]==='torch'?new THREE.CylinderGeometry(.07,.07,.36,10):L[0]==='hat'?new THREE.ConeGeometry(.28,.22,14):new THREE.BoxGeometry(.32,.22,.24),new THREE.MeshLambertMaterial({color:new THREE.Color(L[2])}));
        if(L[0]==='torch')m.rotation.z=Math.PI/2;m.position.y=.14;m.castShadow=true;g.add(m);const sp=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),new THREE.MeshBasicMaterial({color:0xfff2a0}));sp.position.y=.75;g.add(sp);g.userData.sp=sp;
        g.position.set(p.x,groundY(p.x,p.z),p.z);g.traverse(o=>o.__pxSkip=1);scene.add(g);return Object.assign(p,{id:L[0],name:L[1],g,got:false});}),day:S.day};}
  function pickUp(it){it.got=true;scene.remove(it.g);const left=raid.items.filter(o=>!o.got).length;
    if(left)toast('\u{1F50E} Found '+it.name+' · '+left+' to go',2.6);else{const pay=rw(30);S.coins+=pay;st().raids=(st().raids||0)+1;save();raid=null;
      say(['Kip: That’s everything back! Food goes in the van tonight, every night.',{who:'\u{1F9FA} Possum raid',text:'All the camp things are back · +'+pay+' coins.'}]);}}
  function foodBox(){if(raid){toast('\u{1F50E} '+raid.items.filter(o=>!o.got).length+' things still out in the forest. Look for the little glints.',3);return;}
    if(!night()){toast('\u{1F96A} Snacks for tonight. Keep the lid shut, possums live here!',2.6);return;}
    if(st().raidDay===S.day){toast('\u{1F319} All quiet at the food box tonight.',2.4);return;}
    st().raidDay=S.day;startRaid();
    say(['Kip: *shines the torch* Who’s there?!',{who:'Brushtail possum',text:'...This isn’t what it looks like.'},'The possum drops the empty bag and bolts into the trees. The lid is open and half the camp is gone.',
      'Kip: My marshmallows! The biscuits! My HAT?! ...Right. Into the forest with the torch. Look for things glinting.']);}
  /* ---------- 3. roast a marshmallow ---------- */
  function roast(){const d=panel();d.innerHTML='<div class="box"><div>Hold to toast · let go when it is golden</div><canvas width="220" height="150"></canvas><div class="msg">&nbsp;</div><button type="button">Hold to roast</button></div>';
    const c=d.querySelector('canvas'),x=c.getContext('2d'),b=d.querySelector('button'),msg=d.querySelector('.msg');let t=0,hold=false,done=false,last=performance.now();
    const col=k=>{const A=[[248,244,236],[244,214,140],[214,150,70],[120,70,30],[40,30,24]];const f=Math.min(3.999,Math.max(0,k*4)),i=Math.floor(f),u=f-i;return A[i].map((v,j)=>Math.round(v+(A[i+1][j]-v)*u));};
    function draw(){x.fillStyle='#120e14';x.fillRect(0,0,220,150);const fl=hold?1:.5;for(let i=0;i<14;i++){x.fillStyle=`rgba(255,${120+Math.random()*90|0},40,${.25*fl})`;x.beginPath();x.arc(110+(Math.random()-.5)*60,150-Math.random()*50*fl,6+Math.random()*12,0,7);x.fill();}
      x.strokeStyle='#8a6440';x.lineWidth=4;x.beginPath();x.moveTo(0,40);x.lineTo(100,72);x.stroke();const [r,g,bb]=col(t);x.fillStyle=`rgb(${r},${g},${bb})`;x.beginPath();x.ellipse(118,76,22,17,.3,0,7);x.fill();x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=2;x.stroke();
      x.fillStyle='#2a3348';x.fillRect(20,128,180,10);x.fillStyle='#e2c27c';x.fillRect(20+180*.42,128,180*.26,10);x.fillStyle='#fff';x.fillRect(20+180*Math.min(1,t)-1,124,3,18);}
    (function loop(){if(done)return;const now=performance.now(),dt=Math.min(.25,(now-last)/1000);last=now;if(hold)t+=dt*.22;draw();if(t>=1){finish();return;}requestAnimationFrame(loop);})();
    const down=e=>{e.preventDefault();hold=true;},up=e=>{e.preventDefault();if(hold&&t>.05)finish();hold=false;};b.addEventListener('pointerdown',down);addEventListener('pointerup',up);
    function finish(){if(done)return;done=true;removeEventListener('pointerup',up);const gold=t>=.42&&t<=.68;let line;
      if(gold){const pay=rw(15);S.coins+=pay;st().golden=(st().golden||0)+1;if(typeof STAM_MAX!=='undefined')S.stamina=Math.min(STAM_MAX,(S.stamina||0)+15);line='Perfectly golden! Squashed between two biscuits · +'+pay+' coins';}
      else line=t<.42?'Still pale and squishy. Tasty anyway!':'Oops, it caught fire. Charcoal on a stick.';save();msg.textContent=line;b.textContent='OK';b.onclick=()=>close(d);draw();}}
  /* ---------- 4. creek fishing ---------- */
  const CREEK=[{id:'redfin',name:'Redfin perch',r:1,s:[0,1,2,3]},{id:'minnow',name:'Western minnow',r:1,s:[0,1,2,3]},{id:'cobbler',name:'Freshwater cobbler',r:2,s:[0,1,2,3]},{id:'marron',name:'Marron (a big freshwater crayfish)',r:2,s:[0,1,2,3]},{id:'trout',name:'Rainbow trout',r:3,s:[1,2,3]},{id:'gumleaf',name:'A soggy gum leaf',r:1,s:[0,1,2,3],junk:true}];
  let creekSpots=null;
  function makeCreekSpots(){const E=CAMPPARK.E,c=E.camp,out=[];const q=E.big;
    const shore=(lx,lz)=>{for(let r=.5;r<10;r+=.5)for(let a=0;a<16;a++){const X=lx+Math.cos(a/16*6.283)*r,Z=lz+Math.sin(a/16*6.283)*r;if(!E.inWater(X,Z)&&E.slopeAt(X,Z)<.8){const [x,z]=G(X,Z);if(!blocked(x,z))return[x,z];}}return null;};
    if(q){const p=shore(q.x,q.z);if(p)out.push({x:p[0],z:p[1],zone:'srp',name:'the falls pool',creek:true});}
    const runs=[];E.streams.forEach(Sx=>Sx.forEach(p=>{if(p.cls==='run'&&p.w>1.6)runs.push(p);}));runs.sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z));
    for(const p of runs){if(out.length>=3)break;const s=shore(p.x,p.z);if(!s||out.some(o=>Math.hypot(o.x-s[0],o.z-s[1])<10))continue;out.push({x:s[0],z:s[1],zone:'srp',name:out.length===1?'Granite creek':'Fern creek',creek:true});}
    return out;}
  const _sf=startFishing;startFishing=function(spot){if(!spot||!spot.creek)return _sf.apply(this,arguments);const keep=FISH.splice(0,FISH.length);CREEK.forEach(f=>FISH.push(f));try{return _sf.apply(this,arguments);}finally{FISH.splice(0,FISH.length);keep.forEach(f=>FISH.push(f));}};
  /* ---------- 5. stars ---------- */
  function stars(){const d=panel('sky');d.innerHTML='<canvas></canvas><div class="hud">Tap the shooting stars to make a wish · <b class="n">0</b> wishes · <span class="t">30</span>s</div>';
    const c=d.querySelector('canvas'),x=c.getContext('2d');const W=c.width=innerWidth*Math.min(2,devicePixelRatio||1),H=c.height=innerHeight*Math.min(2,devicePixelRatio||1);
    const ST=[...Array(420)].map(()=>{const band=Math.random()<.45;const u=Math.random();return{x:band?u*W:Math.random()*W,y:band?H*.15+u*H*.5+(Math.random()-.5)*H*.16:Math.random()*H*.85,r:Math.random()*1.6+.3,ph:Math.random()*6};});
    const shoot=[];let wishes=0,t0=performance.now(),next=1.2,done=false;const nEl=d.querySelector('.n'),tEl=d.querySelector('.t');
    c.addEventListener('pointerdown',e=>{const k=W/innerWidth,px=e.clientX*k,py=e.clientY*k;for(const s of shoot){if(s.hit)continue;const hx=s.x,hy=s.y;if(Math.hypot(px-hx,py-hy)<60*k){s.hit=true;wishes++;nEl.textContent=wishes;}}});
    (function loop(){if(done)return;const t=(performance.now()-t0)/1000;const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05081a');g.addColorStop(.7,'#132046');g.addColorStop(1,'#2a2a3a');x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle='rgba(180,190,255,.05)';x.beginPath();x.ellipse(W*.5,H*.42,W*.7,H*.12,-.35,0,7);x.fill();
      ST.forEach(s=>{x.globalAlpha=.55+.45*Math.sin(t*2+s.ph);x.fillStyle='#fff';x.beginPath();x.arc(s.x,s.y,s.r*(W/innerWidth),0,7);x.fill();});x.globalAlpha=1;
      x.fillStyle='#0b0d12';x.beginPath();x.moveTo(0,H);for(let i=0;i<=24;i++){const X=i/24*W;x.lineTo(X,H*.86-Math.abs(Math.sin(i*1.7))*H*.08-(i%3===0?H*.06:0));}x.lineTo(W,H);x.fill();
      next-=1/60;if(next<=0){next=1.2+Math.random()*1.8;const sx=Math.random()*W*.8,sy=Math.random()*H*.35;shoot.push({x:sx,y:sy,vx:(5+Math.random()*4)*(W/innerWidth),vy:(2+Math.random()*2)*(W/innerWidth),l:0});}
      for(const s of shoot){s.l+=1/60;s.x+=s.vx;s.y+=s.vy;const a=Math.max(0,1-s.l/1.1);x.strokeStyle=s.hit?`rgba(255,220,120,${a})`:`rgba(255,255,255,${a})`;x.lineWidth=(s.hit?4:2.5)*(W/innerWidth);x.beginPath();x.moveTo(s.x,s.y);x.lineTo(s.x-s.vx*9,s.y-s.vy*9);x.stroke();}
      for(let i=shoot.length-1;i>=0;i--)if(shoot[i].l>1.2)shoot.splice(i,1);
      const left=Math.max(0,30-Math.floor(t));tEl.textContent=left;if(t>=30){done=true;end();return;}requestAnimationFrame(loop);})();
    function end(){const pay=rw(Math.min(40,wishes*5));S.coins+=pay;st().wishes=(st().wishes||0)+wishes;S.time+=60;save();close(d);
      say(['Kip: The Milky Way goes right across the sky out here. Nothing like this over the café lights.',{who:'✨ Stargazing',text:wishes+' wish'+(wishes===1?'':'es')+' made'+(pay?' · +'+pay+' coins':'')+'. Don’t tell anyone what you wished for.'}]);}}
  /* ---------- targets on the camp map ---------- */
  const _bt=buildTargets;buildTargets=function(){const T=_bt.apply(this,arguments);if(!here()||VISIT)return T;try{const E=CAMPPARK.E;
      if(!creekSpots){creekSpots=makeCreekSpots();}
      if(E.big){const L=E.big.land||E.big;const P=(()=>{for(let r=.5;r<12;r+=.5)for(let a=0;a<16;a++){const X=L.x+Math.cos(a/16*6.283)*r,Z=L.z+Math.sin(a/16*6.283)*r;if(!E.deepAt(X,Z)&&!E.inWater(X,Z)){return G(X,Z);}}return G(L.x,L.z);})();
        T.push({x:P[0],z:P[1],r:2.2,label:'Swim in the falls pool',act:swim});}
      {const b=ck().POINTS.box,w=new THREE.Vector3();b.getWorldPosition(w);T.push({x:w.x,z:w.z,r:1.4,label:night()?'Check the food box':'Food box',act:foodBox});}
      {const [fx,fz]=CKP(0,0);const burning=(ck().fireState==null?1:ck().fireState)===1;
        if(burning)T.push({x:fx+.9,z:fz+.4,r:1.5,label:'Roast a marshmallow',act:roast});
        if(night())T.push({x:fx-.9,z:fz+.8,r:1.5,label:'Lie back and watch the stars',act:stars});}
      if(raid)raid.items.forEach(it=>{if(!it.got)T.push({x:it.x,z:it.z,r:1.3,label:'Pick up '+it.name,act:()=>pickUp(it)});});
      if(unlocked('fishing'))creekSpots.forEach(sp=>T.push({x:sp.x,z:sp.z,r:1.3,label:'Fish '+sp.name,act:()=>startFishing(sp)}));}catch(e){console.warn('campfun',e);}return T;};
  /* glints on the possum loot */
  (function tick(){requestAnimationFrame(tick);if(!raid)return;const t=performance.now()/1000;raid.items.forEach((it,i)=>{if(it.got)return;const s=it.g.userData.sp;s.position.y=.7+Math.sin(t*3+i)*.12;s.scale.setScalar(.8+Math.abs(Math.sin(t*5+i))*.6);});})();
  window.__CAMPFUN={swim,foodBox,roast,stars,get raid(){return raid;},get creek(){return creekSpots;},startRaid};
})();
