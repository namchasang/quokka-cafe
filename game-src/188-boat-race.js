// ---------- Boat race round Rottnest (Paul, 22 Nov 2026: "ทำมินิเกมแข่งเรือ/เจ็ตสกีบนแมป Rottnest") ----------
// At the Main Jetty: race a hired jet ski (or one of your own boats) once round the island against two jet-ski riders.
// The course is made new each race: checkpoints on a ring round the island, every leg checked to run over open water (a leg that
// would cross land gets an extra checkpoint pushed further out). Buoy gates mark each checkpoint, a light beam and an arrow show
// the next one; the HUD shows place, checkpoint and time. 1st and 2nd win a few coins (the first three paid races each day).
// Look Lab first: RACE_LIVE=false; ?race (or #race) turns it on.
const RACE_LIVE=true;
const RACE={on:false,cps:[],path:[],cum:[],ai:[],k:0,t:0,count:0,done:false,g:null};window.__RACE=RACE;
(function(){
  const q=(location.search||'')+(location.hash||'');if(!(RACE_LIVE||/[?&#]race\b/.test(q)))return;
  const LDI=(x,z)=>{try{return(typeof IBMAP!=='undefined'&&IBMAP.done&&IBMAP.landD)?IBMAP.landD(x,z):-9;}catch(e){return -9;}};
  /* open water: the boat can drive there (sea2Water) and the new island's own shore is not close */
  const open=(x,z,r)=>{if(!sea2Water(x,z))return false;for(let a=0;a<6.28;a+=1.05){const X=x+Math.cos(a)*r,Z=z+Math.sin(a)*r;if(!sea2Water(X,Z)||LDI(X,Z)>-.5)return false;}return LDI(x,z)<-.5;};
  const legOk=(a,b)=>{const d=Math.hypot(b.x-a.x,b.z-a.z),n=Math.ceil(d/2);for(let i=1;i<n;i++){const t=i/n;if(!open(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,1.8))return false;}return true;};
  const M=c=>new THREE.MeshLambertMaterial({color:c}),add=(g,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;};
  // ---- a jet ski (bow at +x); rider optional ----
  function jetski(col,rider,shirt){const g=new THREE.Group();const s=new THREE.Shape();s.moveTo(-.9,-.35);s.lineTo(.5,-.35);s.quadraticCurveTo(.95,-.15,.95,0);s.quadraticCurveTo(.95,.15,.5,.35);s.lineTo(-.9,.35);s.lineTo(-.9,-.35);
    const hg=new THREE.ExtrudeGeometry(s,{depth:.36,bevelEnabled:false});hg.rotateX(-Math.PI/2);const h=new THREE.Mesh(hg,M(col));h.position.y=-.16;h.castShadow=true;g.add(h);
    add(g,new THREE.BoxGeometry(1.5,.06,.72),M('#f4f4f0'),-.15,.2,0);add(g,new THREE.BoxGeometry(.7,.18,.36),M('#22222a'),-.3,.3,0);add(g,new THREE.BoxGeometry(.14,.3,.5),M('#22222a'),.25,.38,0);
    if(rider){add(g,new THREE.CylinderGeometry(.14,.13,.42,7),M(shirt||'#e85a6a'),-.3,.6,0);add(g,new THREE.SphereGeometry(.14,8,6),M('#8d5a3b'),-.27,.92,0);add(g,new THREE.SphereGeometry(.15,8,6,0,6.3,0,1.4),M(col),-.27,.96,0);}
    g.traverse(o=>{o.__pxSkip=1;});g.__islKeep=1;return g;}
  // ---- course ----
  function makeCourse(){const C={x:(TB.x1+TB.x2)/2,z:(TB.z1+TB.z2)/2},rx=(TB.x2-TB.x1)/2,rz=(TB.z2-TB.z1)/2;
    // start: deep water straight out from the jetty
    const h=BOAT.home||{x:BOAT.x,z:BOAT.z};let dx=h.x-C.x,dz=h.z-C.z,l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;let st=null;
    for(let r=6;r<80&&!st;r+=2){const x=h.x+dx*r,z=h.z+dz*r;if(open(x,z,6))st={x,z};}if(!st)st={x:h.x+dx*20,z:h.z+dz*20};
    const a0=Math.atan2((st.z-C.z)/rz,(st.x-C.x)/rx),n=9+Math.floor(Math.random()*3),dir=Math.random()<.5?1:-1,cps=[];
    for(let i=1;i<n;i++){const a=a0+dir*(i/n)*Math.PI*2+(Math.random()-.5)*.25;let p=null;
      for(let k=1.02;k<2.2&&!p;k+=.04){const kk=k+Math.random()*.08,x=C.x+Math.cos(a)*rx*kk,z=C.z+Math.sin(a)*rz*kk;if(open(x,z,5))p={x,z};}if(p)cps.push(p);}
    let pts=[st,...cps,{x:st.x,z:st.z,fin:1}];
    // every leg over water: push a new checkpoint out from the island where a leg crosses land
    for(let pass=0;pass<8;pass++){const o=[pts[0]];for(let i=1;i<pts.length;i++){const a=o[o.length-1],b=pts[i];if(!legOk(a,b)){const mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;let ux=mx-C.x,uz=mz-C.z;const ul=Math.hypot(ux,uz)||1;ux/=ul;uz/=ul;
          let m=null;const lx=b.x-a.x,lz=b.z-a.z,ll=Math.hypot(lx,lz)||1,qx=-lz/ll,qz=lx/ll,sg=(qx*ux+qz*uz)>=0?1:-1;
          for(let r=4;r<160&&!m;r+=3)for(const [vx,vz] of [[ux,uz],[qx*sg,qz*sg],[(ux+qx*sg)*.7,(uz+qz*sg)*.7]]){const x=mx+vx*r,z=mz+vz*r;if(open(x,z,4)&&(legOk(a,{x,z})||legOk({x,z},b))){m={x,z};break;}}
          if(!m)for(let r=4;r<160&&!m;r+=3){const x=mx+ux*r,z=mz+uz*r;if(open(x,z,4))m={x,z};}if(m)o.push(m);}o.push(b);}pts=o;}
    /* drop checkpoints the course does not need: a gate goes when its neighbours see each other over water and are not too far apart */
    for(let i=1;i<pts.length-1&&pts.length>8;){const a=pts[i-1],c=pts[i+1];if(Math.hypot(c.x-a.x,c.z-a.z)<170&&legOk(a,c))pts.splice(i,1);else i++;}
    const bad=pts.slice(1).filter((b,i)=>!legOk(pts[i],b)).length;
    // dense path for the riders (every ~2 units), cumulative length at each checkpoint
    const path=[],cum=[0];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],d=Math.hypot(b.x-a.x,b.z-a.z),k=Math.max(1,Math.round(d/2));for(let j=0;j<k;j++)path.push({x:a.x+(b.x-a.x)*j/k,z:a.z+(b.z-a.z)*j/k});cum.push(cum[i-1]+d);}
    path.push(pts[pts.length-1]);return{start:st,cps:pts.slice(1),all:pts,path,cum,bad,len:cum[cum.length-1]};}
  // ---- markers: a buoy gate per checkpoint, a light beam over the next one, chequered posts at the finish, an arrow over Kip ----
  const beamMat=new THREE.MeshBasicMaterial({color:0xffe08a,transparent:true,opacity:.32,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
  function gate(p,nx,nz,fin){const g=new THREE.Group();g.position.set(p.x,0,p.z);const px=-nz,pz=nx;
    for(const s of[-1,1]){const b=new THREE.Group();b.position.set(px*s*4.2,0,pz*s*4.2);g.add(b);add(b,new THREE.SphereGeometry(.45,12,8),M(fin?'#f4f4f0':'#f08a24'),0,.1,0);
      add(b,new THREE.CylinderGeometry(.05,.05,1.4,6),M(fin?'#22222a':'#f4f4f0'),0,.8,0);const f=add(b,new THREE.BoxGeometry(.04,.4,.6),M(fin?'#22222a':'#e23a3a'),0,1.3,.3);f.userData.flag=1;}
    g.traverse(o=>{o.__pxSkip=1;});g.__islKeep=1;return g;}
  function clearScene(){if(RACE.g){scene.remove(RACE.g);RACE.g=null;}RACE.ai.forEach(a=>scene.remove(a.g));RACE.ai=[];}
  // ---- HUD ----
  let hud=null;function hudEl(){if(hud)return hud;hud=document.createElement('div');hud.id='raceHud';hud.style.cssText='position:fixed;top:calc(62px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:40;background:rgba(20,28,43,.88);color:#ffe6a8;font:800 15px system-ui,sans-serif;padding:8px 14px;border-radius:14px;border:2px solid #e8c37a;text-align:center;pointer-events:auto;white-space:nowrap';
    document.body.appendChild(hud);return hud;}
  const fmt=t=>Math.floor(t/60)+':'+(t%60).toFixed(1).padStart(4,'0');const ORD=['1st','2nd','3rd'];
  function progressOf(cpIdx,x,z){const c=RACE.cps[Math.min(cpIdx,RACE.cps.length-1)];return RACE.cum[cpIdx+1]-Math.hypot(c.x-x,c.z-z)*(cpIdx>=RACE.cps.length?0:1);}
  function place(){const me=RACE.done?1e9-RACE.t:progressOf(RACE.k,BOAT.x,BOAT.z);let p=1;RACE.ai.forEach(a=>{const v=a.fin!=null?1e9-a.fin:a.s;if(v>me)p++;});return p;}
  // ---- start / stop ----
  let prevKind=null,myski=null;
  function start(kind){if(RACE.on)return;let C=makeCourse();for(let tr=0;tr<10&&(C.bad||C.cps.length<5);tr++)C=makeCourse();if(C.bad||C.cps.length<5){say([{who:'Race marshal',text:'The sea’s too rough for a race right now. Try again in a minute!'}]);console.warn('race course',C.bad,C.cps.length);return;}
    clearScene();Object.assign(RACE,{course:C,cps:C.cps,path:C.path,cum:C.cum,k:0,t:0,count:3.2,done:false,on:true,kind});
    const g=new THREE.Group();g.__islKeep=1;RACE.g=g;scene.add(g);
    C.cps.forEach((p,i)=>{const a=C.all[i],nx0=p.x-a.x,nz0=p.z-a.z,l=Math.hypot(nx0,nz0)||1;const m=gate(p,nx0/l,nz0/l,p.fin);g.add(m);p.m=m;});
    {const s=C.start,b=C.cps[0],l=Math.hypot(b.x-s.x,b.z-s.z)||1;const m=gate(s,(b.x-s.x)/l,(b.z-s.z)/l,true);g.add(m);}
    RACE.beam=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,46,16,1,true),beamMat);RACE.beam.renderOrder=5;g.add(RACE.beam);
    RACE.arrow=new THREE.Mesh(new THREE.ConeGeometry(.35,1,10),M('#ffd84a'));RACE.arrow.rotation.z=-Math.PI/2;const ag=new THREE.Group();ag.add(RACE.arrow);g.add(ag);RACE.arrowG=ag;
    // Kip's craft: a hired jet ski or a boat of his own
    prevKind=BOAT.kind||null;if(kind==='jetski'){BOATS.use(null);BOAT.g.children.forEach(c=>{c.visible=false;});myski=jetski('#2f9e98',false);BOAT.g.add(myski);BOAT.vmax=11.5;BOAT.turn=3.4;BOAT.deckY=.3;BOAT.kind='jetski';}
    else BOATS.use(kind==='tour'?null:kind);
    const s=C.start,b=C.cps[0],h=Math.atan2(b.z-s.z,b.x-s.x),px=-Math.sin(h),pz=Math.cos(h);BOAT.on=true;BOAT.v=0;BOAT.x=s.x;BOAT.z=s.z;BOAT.h=h;
    // two jet-ski riders on either side, a little slower or faster than Kip's craft
    const vm=BOAT.vmax||7;[[-1,'#e23a3a','#f2b632'],[1,'#3a6ad0','#f4f4f0']].forEach(([side,col,sh],i)=>{const g2=jetski(col,true,sh);scene.add(g2);
      RACE.ai.push({g:g2,lane:side*2.6,s:0,v:0,vmax:vm*(i?1.02:.9)*(.96+Math.random()*.08),fin:null,x:s.x+px*side*3,z:s.z+pz*side*3,h,wob:Math.random()*6});});
    hudEl().style.display='block';popText('Race round Rottnest! Follow the light to each buoy gate',{x:BOAT.x,y:2.2,z:BOAT.z});}
  function stop(msg){if(!RACE.on)return;RACE.on=false;clearScene();if(myski){BOAT.g.remove(myski);myski=null;}BOATS.use(prevKind);if(hud)hud.style.display='none';if(msg)toast(msg,3);}
  RACE.start=start;RACE.stop=stop;RACE.make=makeCourse;
  function finish(){const p=place();RACE.done=true;S.race=S.race||{};const d=S.day||0;if(S.race.day!==d){S.race.day=d;S.race.paid=0;}
    let pay=0;if(S.race.paid<3&&p<=2){pay=rw(p===1?60:25);S.race.paid++;S.coins=(S.coins||0)+pay;}
    const best=S.race.best&&S.race.best<RACE.t?S.race.best:RACE.t;const rec=!S.race.best||RACE.t<S.race.best;S.race.best=best;S.race.wins=(S.race.wins||0)+(p===1?1:0);try{save();}catch(e){}
    say([{who:'🏁 Race marshal',text:(p===1?'Winner! ':p===2?'Second place! ':'Third place. ')+'Your time '+fmt(RACE.t)+(rec?' · new best!':' · best '+fmt(best))+'.'+(pay?' +'+pay+' coins.':p<=2?' (Prize money is for the first three races each day.)':' Have another go!')}]);
    setTimeout(()=>stop(),2500);}
  // ---- every frame ----
  let last=performance.now();
  (function loop(){requestAnimationFrame(loop);const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;if(!RACE.on)return;try{
    if(!BOAT.on){stop('Race cancelled: you left the boat.');return;}
    const T=now/1000;
    if(RACE.count>0){RACE.count-=dt;BOAT.v=0;const c=Math.ceil(RACE.count);if(c!==RACE.lastC){RACE.lastC=c;popText(c>0?String(c):'GO!',{x:BOAT.x,y:2.4,z:BOAT.z});}}
    else if(!RACE.done){RACE.t+=dt;const c=RACE.cps[RACE.k];if(Math.hypot(BOAT.x-c.x,BOAT.z-c.z)<5.5){RACE.k++;if(RACE.k>=RACE.cps.length){finish();}else popText('Checkpoint '+RACE.k+'/'+RACE.cps.length,{x:BOAT.x,y:2.2,z:BOAT.z});}}
    // riders follow the checked path with their own lane
    RACE.ai.forEach(a=>{if(RACE.count<=0&&a.fin==null){a.v+=(a.vmax*(.92+.08*Math.sin(T*.3+a.wob))-a.v)*Math.min(1,dt*.8);a.s+=a.v*dt;if(a.s>=RACE.course.len){a.s=RACE.course.len;a.fin=RACE.t;}}
      const P=RACE.path,f=Math.min(P.length-1.001,a.s/2),i=Math.floor(f),u=f-i,p0=P[Math.max(0,i)],p1=P[Math.min(P.length-1,i+1)];let x=p0.x+(p1.x-p0.x)*u,z=p0.z+(p1.z-p0.z)*u;const hh=Math.atan2(p1.z-p0.z,p1.x-p0.x)||a.h;
      const ln=a.lane*Math.min(1,a.s/12);const lx=x-Math.sin(hh)*ln,lz=z+Math.cos(hh)*ln;if(sea2Water(lx,lz)){x=lx;z=lz;}
      if(a.s<1){x=a.x;z=a.z;}let dh=Math.atan2(Math.sin(hh-a.h),Math.cos(hh-a.h));a.h+=dh*Math.min(1,dt*4);a.g.position.set(x,Math.sin(T*3+a.wob)*.05,z);a.g.rotation.y=-a.h;a.g.rotation.z=Math.sin(T*2+a.wob)*.05;a.cx=x;a.cz=z;});
    // markers
    const nx=RACE.cps[Math.min(RACE.k,RACE.cps.length-1)];RACE.beam.position.set(nx.x,20,nx.z);RACE.beam.material.opacity=.22+Math.sin(T*4)*.08;
    RACE.cps.forEach((p,i)=>{if(p.m)p.m.visible=i>=RACE.k&&i<RACE.k+3||!!p.fin;});
    const ah=Math.atan2(nx.z-BOAT.z,nx.x-BOAT.x);RACE.arrowG.position.set(BOAT.x,2.3+Math.sin(T*4)*.1,BOAT.z);RACE.arrowG.rotation.y=-ah;
    const h=hudEl(),pl=place();h.innerHTML='🏁 '+(RACE.count>0?'Get ready…':ORD[pl-1]+' · checkpoint '+Math.min(RACE.k,RACE.cps.length)+'/'+RACE.cps.length)+' · '+fmt(RACE.t)+' <button id="raceQuit" style="margin-left:8px;font:700 12px system-ui;border-radius:999px;border:0;padding:3px 9px">✕</button>';
    const qb=document.getElementById('raceQuit');if(qb)qb.onclick=()=>stop('Race cancelled.');
  }catch(e){console.error('race',e);stop();}})();
  // ---- the race board at the Main Jetty ----
  function openRace(){const own=Object.keys(S.boats||{}).filter(k=>BOATS.shop[k]);const best=S.race&&S.race.best?' · your best '+fmt(S.race.best):'';
    openTravel('Boat race round Rottnest','Once round the island through every buoy gate. 1st wins '+rw(60)+' coins, 2nd '+rw(25)+' (first three races each day)'+best,
      [{id:'race_jetski',name:'Jet ski (race hire)',note:'Light and quick in the turns. Free for racers.',fare:0,btn:'Race',ride:()=>start('jetski')},
       {id:'race_tour',name:'Tour boat',note:'Slow and steady. The riders will wait for no one.',fare:0,btn:'Race',ride:()=>start('tour')}]
      .concat(own.map(k=>({id:'race_'+k,name:BOATS.shop[k].name,note:BOATS.shop[k].note,fare:0,btn:'Race',ride:()=>start(k)}))));}
  RACE.open=openRace;
  (function wait(){if(typeof BOAT!=='undefined'&&BOAT.g&&BOAT.dock&&typeof BOATS!=='undefined'&&BOATS.use){const _tg=cbdTargets;cbdTargets=function(T){_tg(T);
        if(!RACE.on&&!BOAT.on&&zoneOf(player.x)==='island'&&!VISIT)T.push({x:BOAT.dock.x+1.2,z:BOAT.dock.z+1.2,r:1.6,label:'🏁 Boat race round Rottnest',act:openRace});};return;}setTimeout(wait,800);})();
})();
