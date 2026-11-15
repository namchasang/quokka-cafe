// ---------- More to do on the island (Paul, 15 Nov 2026: "ทำ 1,2,4,5") ----------
// 1. Island jobs: three short jobs a day (a coffee for someone on the beach, a beach clean-up, saying hello to a quokka);
//    each pays coins and an island star.
// 2. Round-the-island ride: a timed lap of checkpoints on the island's paths and bike lanes, best times kept.
// 4. Island level: grows with what the player builds (buildings, businesses, trees) and the stars from jobs; each level pays
//    a bonus, gives a fourth daily job from level 3, and unlocks bigger businesses in the Island Builder (qc-island-level).
// 5. Diving: dive spots off the island's coast (a wreck, reefs, a seagrass bay). Hire the dive boat at the jetty (or use a
//    boat you own), dive, and bring up sea finds for a new Sea wing in the museum.
// Everything sits on the engine-built island (IBMAP) and its shore field; markers are small 3D pins.
const FUN={jobs:null,ride:null,dive:null};
(()=>{
  const onIsl=()=>{try{return IBMAP.done&&zoneOf(player.x)==='island'&&!VISIT;}catch(e){return false;}};
  const LD=(x,z)=>{try{return IBMAP.landD(x,z);}catch(e){return -9;}};
  const R=n=>Math.floor(Math.random()*n);
  const randLand=(lo,hi,tries)=>{for(let i=0;i<(tries||400);i++){const x=TB.x1+Math.random()*(TB.x2-TB.x1),z=TB.z1+Math.random()*(TB.z2-TB.z1),d=LD(x,z);if(d>=lo&&d<=hi&&!blocked(x,z))return{x,z};}return null;};
  const near=(a,r)=>Math.hypot(a.x-player.x,a.z-player.z)<r;
  const gy=(x,z)=>{try{return groundY(x,z);}catch(e){return 0;}};
  // little 3D pins
  const PIN={};function pin(key,col,x,z,s){let g=PIN[key];if(!g){g=new THREE.Group();const m=new THREE.MeshLambertMaterial({color:col,emissive:new THREE.Color(col).multiplyScalar(.35)});
      const c=new THREE.Mesh(new THREE.ConeGeometry(.28*(s||1),.6*(s||1),12),m);c.rotation.x=Math.PI;c.position.y=1.7*(s||1);g.add(c);const b=new THREE.Mesh(new THREE.SphereGeometry(.2*(s||1),12,8),m);b.position.y=2.1*(s||1);g.add(b);
      g.__pxSkip=1;g.__islKeep=1;scene.add(g);PIN[key]=g;}g.position.set(x,gy(x,z),z);g.visible=true;return g;}
  const unpin=key=>{const g=PIN[key];if(g){scene.remove(g);delete PIN[key];}};
  function bob(t){Object.values(PIN).forEach((g,i)=>{if(g.children[0]){g.children[0].position.y=1.7+Math.sin(t*3+i)*.12;g.rotation.y=t*.8;}});}

  // ---------------- 4. island level ----------------
  const LVT=[0,60,150,280,450,700,1000];
  function islandScore(){const D=IBMAP.doc||{};const st=(S.istars||0);return Math.round((D.bld||[]).length*6+(D.biz||[]).length*12+(D.trees||[]).length*.25+st*5);}
  function levelOf(sc){let l=1;for(let i=1;i<LVT.length;i++)if(sc>=LVT[i])l=i+1;return Math.min(l,LVT.length);}
  function levelTick(){if(!IBMAP.done||!S)return;const sc=islandScore(),l=levelOf(sc);S.ilvl=S.ilvl||1;try{localStorage.setItem('qc-island-level',String(Math.max(l,S.ilvl)));}catch(e){}
    if(l>S.ilvl){const from=S.ilvl;S.ilvl=l;const pay=rw(100*l);S.coins+=pay;try{save();}catch(e){}
      say([{who:'🏝️ Island level '+l,text:'Rottnest is coming back to life! +'+pay+' coins.'+(l>=3&&from<3?' You now get a fourth island job each day.':'')+' Bigger businesses are open in the Island Builder.'}]);}}
  function levelInfo(){const sc=islandScore(),l=S.ilvl||levelOf(sc),nx=LVT[l]||null;
    say([{who:'🏝️ Island level '+l,text:'Island score '+sc+(nx?' · next level at '+nx:' · top level')+'. Score comes from buildings, businesses, trees and island stars ('+(S.istars||0)+' stars from jobs). Higher levels unlock bigger businesses in the Island Builder.'}]);}

  // ---------------- 1. island jobs ----------------
  const JT={coffee:{n:'Bring a Flat White to a beachgoer',ic:'☕'},litter:{n:'Clean up a beach (5 pieces)',ic:'🧹'},quokka:{n:'Say hello to a quokka',ic:'🐾'},lookout:{n:'Watch the view from a high spot',ic:'🔭'}};
  let litter=[];
  function newJobs(){const n=(S.ilvl||1)>=3?4:3,types=['coffee','litter','quokka','lookout'].sort(()=>Math.random()-.5).slice(0,n);
    S.ij={day:S.day,jobs:types.map(t=>{const j={t,done:false};if(t==='coffee'){const p=randLand(.2,1.4);if(p){j.x=p.x;j.z=p.z;}}if(t==='litter'){const p=randLand(.2,1.6);if(p){j.x=p.x;j.z=p.z;j.left=5;}}if(t==='lookout'){let best=null,bd=-1;for(let i=0;i<60;i++){const q=randLand(5,99);if(!q)continue;const h=gy(q.x,q.z);if(h>bd){bd=h;best=q;}}if(best){j.x=best.x;j.z=best.z;}}return j;})};
    try{save();}catch(e){}}
  function jobsTick(){if(!S)return;if(!S.ij||S.ij.day!==S.day){newJobs();if(onIsl())toast('📋 New island jobs today · ☰ → Play → Island jobs',4);litter.forEach(m=>scene.remove(m));litter=[];}
    const J=S.ij.jobs;J.forEach((j,i)=>{const key='job'+i;if(j.done||j.x==null||!onIsl()){unpin(key);return;}pin(key,j.t==='coffee'?'#f2a640':j.t==='litter'?'#5fbf7a':'#6aa7ff',j.x,j.z);});
    // litter pieces round the litter spot
    const L=J.find(j=>j.t==='litter'&&!j.done&&j.x!=null);if(L&&onIsl()&&!litter.length){for(let k=0;k<L.left;k++){const a=k/L.left*6.283+Math.random(),r=1.4+Math.random()*2.4,x=L.x+Math.cos(a)*r,z=L.z+Math.sin(a)*r;
        const m=new THREE.Mesh(new THREE.BoxGeometry(.22,.12,.3),new THREE.MeshLambertMaterial({color:['#d94b4b','#4b8bd9','#e8e2d0','#7cc06a'][k%4]}));m.position.set(x,gy(x,z)+.06,z);m.rotation.y=a;m.__pxSkip=1;scene.add(m);litter.push(m);}}
    if((!L||!onIsl())&&litter.length){litter.forEach(m=>scene.remove(m));litter=[];}}
  function jobDone(j){j.done=true;S.istars=(S.istars||0)+1;const pay=rw(30);S.coins+=pay;try{save();}catch(e){}const left=S.ij.jobs.filter(q=>!q.done).length;
    toast(JT[j.t].ic+' Job done: '+JT[j.t].n+' · +'+pay+' coins · ⭐ '+S.istars+(left?'':' · All island jobs done today!'),4);if(!left){S.coins+=rw(40);}levelTick();}
  function jobsList(){if(!S.ij)newJobs();say([{who:'📋 Island jobs · day '+S.day,text:S.ij.jobs.map(j=>(j.done?'✅ ':JT[j.t].ic+' ')+JT[j.t].n+(j.t==='litter'&&!j.done&&j.left<5?' ('+(5-j.left)+'/5)':'')).join('\n')+'\nEach job: coins and an island star. Pins show where to go.'}]);}
  function quokkaNear(){try{const E=IBMAP.I.E.life;if(!E)return null;for(const a of E.agents){if(!/quokka/i.test(a.kind||a.k||''))continue;const g=IBMAP.toGame(a.x,a.z);if(Math.hypot(g[0]-player.x,g[1]-player.z)<2.2)return{x:g[0],z:g[1]};}}catch(e){}return null;}

  // ---------------- 2. round-the-island ride ----------------
  let RCP=null;
  function rideCheckpoints(){if(RCP)return RCP;const D=IBMAP.doc;if(!D)return null;const P=[];[].concat((D.paths||[]).map(p=>p.pts),(D.roads||[]).map(r=>r.pts)).forEach(L=>L.forEach(q=>{const g=IBMAP.toGame(q[0],q[1]);P.push({x:g[0],z:g[1]});}));if(P.length<8)return null;
    let cx=0,cz=0;P.forEach(p=>{cx+=p.x;cz+=p.z;});cx/=P.length;cz/=P.length;const N=8,best=new Array(N).fill(null);
    P.forEach(p=>{const a=(Math.atan2(p.z-cz,p.x-cx)+Math.PI)/(2*Math.PI),k=Math.min(N-1,Math.floor(a*N)),d=Math.hypot(p.x-cx,p.z-cz);if(!best[k]||d>best[k].d)best[k]={x:p.x,z:p.z,d};});
    let L=best.filter(Boolean);if(L.length<4)return null;let c={x:player.x,z:player.z};try{const q=cafeZonesPublic&&cafeZonesPublic();}catch(e){}
    try{const k=STATIONS&&STATIONS[0];if(k)c={x:k.x,z:k.z};}catch(e){}let si=0,sd=1e9;L.forEach((p,i)=>{const d=Math.hypot(p.x-c.x,p.z-c.z);if(d<sd){sd=d;si=i;}});L=L.slice(si).concat(L.slice(0,si));RCP=L;return L;}
  let ring=null;function ringAt(p,col){if(!ring){ring=new THREE.Mesh(new THREE.TorusGeometry(1.5,.14,8,28),new THREE.MeshLambertMaterial({color:'#ffd84a',emissive:'#7a5a00'}));ring.__pxSkip=1;scene.add(ring);}ring.position.set(p.x,gy(p.x,p.z)+1.4,p.z);ring.material.color.set(col||'#ffd84a');ring.visible=true;}
  const hud=document.createElement('div');hud.style.cssText='position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);z-index:30;padding:6px 14px;border-radius:12px;background:rgba(20,28,46,.92);border:2px solid #e8c37a;color:#ffe6a8;font:800 15px "Pixelify Sans",monospace;display:none';document.body.appendChild(hud);
  const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')+'.'+Math.floor((s%1)*10);
  function rideStart(){if(!onIsl()){toast('The ride starts on Rottnest',3);return;}const L=rideCheckpoints();if(!L){toast('The island needs more paths for a ride',3);return;}
    FUN.ride={i:1,t0:performance.now()/1000,L};say([{who:'🚲 Round-the-island ride',text:'Ride through the '+(L.length)+' gold rings in order and back to the start. '+(player.bike?'':'Tip: hop on your bike, it is much faster. ')+(S.ride&&S.ride.best?'Best: '+fmt(S.ride.best)+'.':'Go!')}]);}
  function rideTick(){const r=FUN.ride;if(!r){hud.style.display='none';if(ring)ring.visible=false;return;}if(!onIsl()){FUN.ride=null;toast('Ride cancelled',2);return;}
    const t=performance.now()/1000-r.t0,tgt=r.i<r.L.length?r.L[r.i]:r.L[0];hud.style.display='block';hud.textContent='🚲 '+fmt(t)+' · ring '+Math.min(r.i+1,r.L.length+1)+'/'+(r.L.length+1);ringAt(tgt,r.i<r.L.length?'#ffd84a':'#5fd17a');
    if(Math.hypot(tgt.x-player.x,tgt.z-player.z)<2.2){if(r.i<r.L.length){r.i++;try{sfx&&sfx('coin');}catch(e){}}else{FUN.ride=null;hud.style.display='none';ring.visible=false;S.ride=S.ride||{list:[]};const first=!S.ride.best,better=!first&&t<S.ride.best;
        S.ride.list.push(+t.toFixed(1));S.ride.list.sort((a,b)=>a-b);S.ride.list.length=Math.min(5,S.ride.list.length);if(first||better)S.ride.best=+t.toFixed(1);const pay=rw(first?80:better?40:15);S.coins+=pay;S.istars=(S.istars||0)+(first||better?1:0);try{save();}catch(e){}
        say([{who:'🏁 Finish! '+fmt(t),text:(first?'Your first lap of the island! ':better?'New best time! ':'')+'+'+pay+' coins. Best times: '+S.ride.list.map(fmt).join(' · ')}]);levelTick();}}}

  // ---------------- 5. diving ----------------
  const SEAF=[{id:'shell',name:'Spiral shell',w:30},{id:'urchin',name:'Sea urchin shell',w:22},{id:'coral',name:'Coral piece',w:16},{id:'bottle',name:'Old glass bottle',w:12},{id:'coin',name:'Old ship’s coin',w:7},{id:'anchor',name:'Little brass anchor',w:5},{id:'compass',name:'Ship’s compass',w:3},{id:'pearl',name:'Pearl',w:2},{id:'bell',name:'Wreck bell',w:1}];
  try{if(typeof WINGS!=='undefined'&&!WINGS.find(w=>w.id==='sea'))WINGS.push({id:'sea',name:'Sea wing',list:()=>SEAF.map(f=>[f.id,f.name,(S.seaf||{})[f.id]||0])});}catch(e){}
  let SPOTS=null;
  function diveSpots(){if(SPOTS)return SPOTS;const names=[['Wreck by the reef','wreck',3],['Coral garden','reef',2],['Seagrass bay','bay',1],['Point reef','reef',2]];const L=[];let tries=0;
    while(L.length<names.length&&tries<3000){tries++;const x=TB.x1-6+Math.random()*(TB.x2-TB.x1+12),z=TB.z1-6+Math.random()*(TB.z2-TB.z1+12),d=LD(x,z);if(d>-6&&d<-2.5&&L.every(p=>Math.hypot(p.x-x,p.z-z)>40))L.push({x,z,n:names[L.length][0],k:names[L.length][1],rare:names[L.length][2]});}
    SPOTS=L;return L;}
  function ownBoat(){try{return((IBMAP.doc&&IBMAP.doc.biz)||[]).some(b=>/^(fishing|party|ferry)$/.test(b.t));}catch(e){return false;}}
  function diveMenu(){const L=diveSpots();if(!L.length){toast('No dive spots found',2);return;}const fee=ownBoat()?0:rw(40);
    const left=3-((S.dives&&S.dives.day===S.day)?S.dives.n:0);if(left<=0){say([{who:'🤿 Dive boat',text:'That’s three dives today. The boat goes out again tomorrow.'}]);return;}
    say([{who:'🤿 Dive boat',text:(fee?'The dive boat goes out for '+fee+' coins.':'Your own boat takes you out for free.')+' Dives left today: '+left+'. Pick a spot.'}]);
    setTimeout(()=>chooseSpot(L,fee),50);}
  function chooseSpot(L,fee){const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:70;background:rgba(10,16,32,.55);display:grid;place-items:center';
    o.innerHTML='<div style="background:#16203a;border:2px solid #e8c37a;border-radius:14px;padding:14px;width:min(330px,90vw);color:#f5ecd8;font:700 14px system-ui"><div style="color:#ffd78a;margin-bottom:8px">🤿 Choose a dive spot</div>'+L.map((p,i)=>'<button data-i="'+i+'" style="display:block;width:100%;margin:6px 0;padding:10px;border-radius:10px;border:1px solid #e8c37a;background:#22304e;color:#f5ecd8;font:700 14px system-ui">'+p.n+' '+'★'.repeat(p.rare)+'</button>').join('')+'<button data-x=1 style="width:100%;margin-top:6px;padding:9px;border-radius:10px;border:0;background:#3a4560;color:#ddd;font:700 13px system-ui">Not now</button></div>';
    document.body.appendChild(o);o.onclick=e=>{const b=e.target.closest('button');if(!b)return;o.remove();if(b.dataset.x)return;const p=L[+b.dataset.i];if(fee&&S.coins<fee){toast('Not enough coins for the dive boat',3);return;}S.coins-=fee;dive(p);};}
  function dive(p){S.dives=(S.dives&&S.dives.day===S.day)?S.dives:{day:S.day,n:0};S.dives.n++;S.seaf=S.seaf||{};const finds=[],n=2+R(2);
    for(let i=0;i<n;i++){const W=SEAF.map(f=>f.w*(f.w<8?p.rare:1)),T=W.reduce((a,b)=>a+b,0);let r=Math.random()*T,k=0;while(r>W[k]){r-=W[k];k++;}const f=SEAF[k];S.seaf[f.id]=(S.seaf[f.id]||0)+1;finds.push(f.name);}
    S.istars=(S.istars||0)+(p.rare>=2?1:0);try{save();}catch(e){}
    say([{who:'🤿 '+p.n,text:'Kip slips into the clear water… '+(p.k==='wreck'?'Old timbers lie in the sand, covered in weed and tiny fish.':p.k==='reef'?'Bright fish dart round the coral heads.':'Rays glide over the swaying seagrass.')},{who:'🧺 Finds',text:finds.join(', ')+'. Donate them at the museum (Sea wing).'}]);levelTick();}
  let spotPins=false;function spotTick(){const L=onIsl()?diveSpots():[];if(onIsl()&&L.length&&!spotPins){L.forEach((p,i)=>pin('dive'+i,'#ff7a59',p.x,p.z,1.4));spotPins=true;}if(!onIsl()&&spotPins){L.forEach((p,i)=>unpin('dive'+i));diveSpots().forEach((p,i)=>unpin('dive'+i));spotPins=false;}}

  // ---------------- tap targets ----------------
  const _bt=buildTargets;buildTargets=function(){const T=_bt();if(!onIsl()||!S||!S.ij)return T;
    S.ij.jobs.forEach(j=>{if(j.done||j.x==null)return;if(j.t==='coffee')T.push({x:j.x,z:j.z,r:1.6,label:player.carry==='flat'?'Give the Flat White':'Wants a Flat White (from the café)',disabled:player.carry!=='flat',act:()=>{player.carry=null;say([{who:'Beachgoer',text:['Oh you legend, I was dreaming of this!','Coffee on the sand. Perfect.','You delivered to the beach? Best café ever.'][R(3)]}]);jobDone(j);}});
      if(j.t==='lookout')T.push({x:j.x,z:j.z,r:1.8,label:'Look at the view',act:()=>{say([{who:'Kip',text:'You can see the whole island from up here… and the café roof, tiny and red.'}]);jobDone(j);}});});
    const L=S.ij.jobs.find(j=>j.t==='litter'&&!j.done);if(L)litter.forEach(m=>{if(!m.parent)return;T.push({x:m.position.x,z:m.position.z,r:.9,label:'Pick up litter',act:()=>{scene.remove(m);litter=litter.filter(q=>q!==m);L.left--;try{save();}catch(e){}if(L.left<=0)jobDone(L);else toast('🧹 '+(5-L.left)+'/5',1.2);}});});
    const qj=S.ij.jobs.find(j=>j.t==='quokka'&&!j.done);if(qj){const q=quokkaNear();if(q)T.push({x:q.x,z:q.z,r:2,label:'Say hello to the quokka',act:()=>{say([{who:'Kip',text:'G’day, little mate! …It smiled. They always smile.'}]);jobDone(qj);}});}
    if(RCP&&!FUN.ride){const s=RCP[0];T.push({x:s.x,z:s.z,r:1.8,label:'Start the round-the-island ride',act:rideStart});}
    try{const j=(typeof JETTY!=='undefined')&&JETTY;if(j)T.push({x:(j.x1+j.x2)/2,z:(j.z1+j.z2)/2,r:2.2,label:'🤿 Dive boat',act:diveMenu});}catch(e){}
    return T;};

  // ---------------- menu buttons ----------------
  (function btns(){const right=document.querySelector('.right');if(!right){setTimeout(btns,800);return;}
    [['jobsBtn','📋 Island jobs',jobsList],['rideBtn','🚲 Island ride',()=>FUN.ride?(FUN.ride=null,toast('Ride stopped',2)):rideStart()],['diveBtn','🤿 Diving',()=>{if(!onIsl()){toast('Diving is on Rottnest',2);return;}diveMenu();}],['levelBtn','🏝️ Island level',levelInfo]].forEach(([id,t,f])=>{
      const b=document.createElement('button');b.id=id;b.type='button';b.className='panel hudBtn more';b.textContent=t;b.onclick=f;right.appendChild(b);});})();

  // ---------------- loop ----------------
  let last=0;(function loop(){requestAnimationFrame(loop);const t=performance.now()/1000;bob(t);if(t-last<.25)return;last=t;
    try{if(typeof running==='undefined'||!running||!S)return;if(!IBMAP.done)return;rideCheckpoints();jobsTick();rideTick();spotTick();if((FUN.k=(FUN.k||0)+1)%20===0)levelTick();}catch(e){if(!FUN.err){FUN.err=1;console.warn('island fun',e);}}})();
  FUN.levelInfo=levelInfo;FUN.jobsList=jobsList;FUN.rideStart=rideStart;FUN.diveMenu=diveMenu;FUN.score=islandScore;FUN.spots=diveSpots;
})();
