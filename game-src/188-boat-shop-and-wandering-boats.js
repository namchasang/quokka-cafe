// ---------- Freo Boat Sales and the boats of Rottnest (Paul, 13 Nov 2026) ----------
// A boat shop on the Fremantle harbour sells four boats Kip can take out from the Rottnest jetty: a fishing boat (rare fish
// anywhere at sea), a speed boat (fast), a houseboat (sleep aboard) and a yacht (host guests once a day). Every other kind of boat
// wanders the sea round the island at random: kayaks, canoes, sailboats, catamarans, jet skis, pontoons, dinghies, a banana boat,
// cabin cruisers, a game-fishing boat, a trawler and inflatables. Names are fictional.
const BOATS={shop:{fishing:{deck:.4,name:'Fishing boat',price:1500,vmax:6,turn:2.4,note:'Steady and roomy. Rare fish bite anywhere out at sea.'},
  speed:{deck:.3,name:'Speed boat',price:6000,vmax:13,turn:3.2,note:'Twice as fast as the tour boat. Hold on to your hat.'},
  house:{deck:.5,name:'Houseboat',price:12000,vmax:4,turn:1.8,note:'Slow and cosy. Sleep aboard anywhere at sea.'},
  yacht:{deck:.9,name:'Yacht',price:40000,vmax:9,turn:2,note:'The island’s smartest boat. Host guests on deck once a day.'}},models:{},wander:[]};
(function(){
  const M=c=>new THREE.MeshLambertMaterial({color:c}),add=(g,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;};
  function hull(L,W,H,c,flat){const s=new THREE.Shape(),b=L/2;s.moveTo(-b,-W/2);s.lineTo(b-W*(flat?.3:.9),-W/2);s.quadraticCurveTo(b,-W*.3,b,0);s.quadraticCurveTo(b,W*.3,b-W*(flat?.3:.9),W/2);s.lineTo(-b,W/2);s.lineTo(-b,-W/2);
    const g=new THREE.ExtrudeGeometry(s,{depth:H,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,M(c));m.castShadow=true;return m;}
  const H=(g,L,W,Hh,c,y,flat)=>{const h=hull(L,W,Hh,c,flat);h.position.y=y;g.add(h);return h;};
  const sail=(g,x,h,w,c)=>{const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(0,h);s.lineTo(-w,0);s.lineTo(0,0);const m=new THREE.Mesh(new THREE.ShapeGeometry(s),new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide}));m.position.set(x,.6,0);m.rotation.y=Math.PI/2;m.castShadow=true;g.add(m);add(g,new THREE.CylinderGeometry(.04,.05,h+.4,5),M('#d8d8d0'),x,.6+h/2,0);return m;};
  const fin=g=>{g.traverse(o=>{o.__pxSkip=1;});g.__islKeep=1;return g;};
  // ---- the four boats for sale (bow at +x, about the tour boat's size) ----
  const MK={fishing(){const g=new THREE.Group();H(g,4.4,1.8,.7,'#f2efe6',-.35);add(g,new THREE.BoxGeometry(4.2,.12,1.82),M('#2f6a9a'),0,.32,0);add(g,new THREE.BoxGeometry(1.2,.9,1.3),M('#f8f8f4'),-.6,.75,0);add(g,new THREE.BoxGeometry(1.25,.3,1.35),M('#2b3a4c'),-.6,.95,0);
      [-1,1].forEach(sd=>{const r=add(g,new THREE.CylinderGeometry(.02,.02,2,4),M('#2a2a30'),-1.6,1.2,sd*.6);r.rotation.z=.6;});add(g,new THREE.BoxGeometry(.7,.4,.6),M('#f4f4f0'),1,.55,0);return fin(g);},
    speed(){const g=new THREE.Group();H(g,4.6,1.7,.6,'#f6f6f2',-.3);add(g,new THREE.BoxGeometry(4.3,.14,1.72),M('#e23a3a'),-.1,.22,0);const w=add(g,new THREE.BoxGeometry(.08,.4,1.3),new THREE.MeshLambertMaterial({color:0x9fd0e8,transparent:true,opacity:.6}),.5,.55,0);w.rotation.z=-.5;
      add(g,new THREE.BoxGeometry(1.4,.25,1.3),M('#f2e6d0'),-.6,.42,0);add(g,new THREE.BoxGeometry(.4,.5,.4),M('#22222a'),-2.35,.3,0);return fin(g);},
    house(){const g=new THREE.Group();[-1,1].forEach(sd=>add(g,new THREE.CylinderGeometry(.35,.35,5,10),M('#c8ccd0'),0,-.05,sd*1).rotation.z=Math.PI/2);add(g,new THREE.BoxGeometry(5.2,.15,2.8),M('#c79a62'),0,.35,0);
      add(g,new THREE.BoxGeometry(3.4,1.4,2.4),M('#f4efe2'),-.3,1.1,0);add(g,new THREE.BoxGeometry(3.42,.4,2.42),M('#3e7d5c'),-.3,1.2,0);add(g,new THREE.BoxGeometry(3.8,.12,2.8),M('#3e7d5c'),-.3,1.86,0);
      [[-1.2,1.21],[.6,1.21]].forEach(([x,z])=>add(g,new THREE.BoxGeometry(.5,.45,.02),M('#7ab0d0'),x,1.05,z));add(g,new THREE.CylinderGeometry(.18,.18,.35,8),M('#c2603a'),1.8,.6,.8);return fin(g);},
    yacht(){const g=new THREE.Group();H(g,6.2,2,.75,'#1b2a3a',-.45);H(g,6.2,2,.5,'#fbfbf8',.3);add(g,new THREE.BoxGeometry(5.6,.06,1.9),M('#c79a62'),-.2,.82,0);
      add(g,new THREE.BoxGeometry(2.6,.6,1.6),M('#fbfbf8'),-.7,1.15,0);add(g,new THREE.BoxGeometry(2.62,.26,1.62),M('#22303e'),-.7,1.2,0);add(g,new THREE.BoxGeometry(1.6,.45,1.3),M('#fbfbf8'),-1,1.66,0);add(g,new THREE.BoxGeometry(1.4,.05,1.4),M('#c9a24a'),-1.1,2.1,0);return fin(g);}};
  // ---- the boats that only wander ----
  const AMB={kayak(){const g=new THREE.Group();H(g,2.4,.45,.25,'#f1c64a',-.12,true);add(g,new THREE.SphereGeometry(.14,8,6),M('#d8a47a'),0,.5,0);add(g,new THREE.CylinderGeometry(.13,.12,.35,6),M('#e8734a'),0,.28,0);const p=add(g,new THREE.CylinderGeometry(.02,.02,1.4,4),M('#2a2a30'),0,.4,0);p.rotation.x=1.4;return g;},
    canoe(){const g=new THREE.Group();H(g,3,.6,.3,'#b0562e',-.15,true);[-.5,.5].forEach(x=>{add(g,new THREE.SphereGeometry(.13,8,6),M('#f1c7a0'),x,.5,0);add(g,new THREE.CylinderGeometry(.12,.11,.32,6),M('#2f78a8'),x,.3,0);});return g;},
    sailboat(){const g=new THREE.Group();H(g,4,1.4,.6,'#f6f6f2',-.3);sail(g,.2,3.4,1.6,'#fbfaf2');sail(g,1.6,2.6,1.1,'#f2f0e8');return g;},
    catamaran(){const g=new THREE.Group();[-1,1].forEach(sd=>{const h=hull(4.4,.6,.6,'#f6f6f2');h.position.set(0,-.3,sd*.9);g.add(h);});add(g,new THREE.BoxGeometry(2.6,.12,2),M('#e8e4da'),-.3,.35,0);sail(g,-.2,4,2,'#ffffff');return g;},
    jetski(){const g=new THREE.Group();H(g,1.8,.7,.35,'#f1c64a',-.15);add(g,new THREE.BoxGeometry(.7,.2,.4),M('#22222a'),-.2,.3,0);add(g,new THREE.SphereGeometry(.13,8,6),M('#8d5a3b'),-.25,.9,0);add(g,new THREE.CylinderGeometry(.13,.12,.4,6),M('#e85a6a'),-.25,.6,0);return g;},
    pontoon(){const g=new THREE.Group();[-1,1].forEach(sd=>add(g,new THREE.CylinderGeometry(.25,.25,4,8),M('#c8ccd0'),0,-.05,sd*.8).rotation.z=Math.PI/2);add(g,new THREE.BoxGeometry(4.2,.12,2),M('#d8d0bc'),0,.25,0);
      add(g,new THREE.BoxGeometry(2.6,.08,1.9),M('#3a8ad0'),-.3,1.5,0);[[-1.5,-.9],[-1.5,.9],[.9,-.9],[.9,.9]].forEach(([x,z])=>add(g,new THREE.CylinderGeometry(.03,.03,1.2,4),M('#dcdcd6'),x,.9,z));add(g,new THREE.BoxGeometry(1.6,.35,.5),M('#f2e6d0'),-.6,.45,-.6);return g;},
    dinghy(){const g=new THREE.Group();H(g,2.2,1,.35,'#f4f2ec',-.15,true);add(g,new THREE.BoxGeometry(.25,.35,.25),M('#2a2a30'),-1.05,.2,0);add(g,new THREE.SphereGeometry(.13,8,6),M('#d8a47a'),-.6,.55,0);return g;},
    banana(){const g=new THREE.Group();const b=add(g,new THREE.CylinderGeometry(.3,.3,3,10),M('#f6d23a'),0,.1,0);b.rotation.z=Math.PI/2;for(let k=0;k<4;k++){add(g,new THREE.SphereGeometry(.12,8,6),M(['#f1c7a0','#8d5a3b','#d8a47a','#5a3a28'][k]),-1+k*.6,.65,0);add(g,new THREE.CylinderGeometry(.12,.1,.3,6),M(['#e8734a','#2f78a8','#c85ab0','#3e7d5c'][k]),-1+k*.6,.42,0);}
      const tow=new THREE.Group();H(tow,3.4,1.4,.5,'#f6f6f2',-.25);add(tow,new THREE.BoxGeometry(.9,.4,1),M('#2f78a8'),-.4,.4,0);tow.position.x=7;g.add(tow);add(g,new THREE.CylinderGeometry(.01,.01,5.2,3),M('#f4f4f0'),3.6,.25,0).rotation.z=Math.PI/2;return g;},
    cruiser(){const g=new THREE.Group();H(g,5.2,1.9,.7,'#f6f6f2',-.35);add(g,new THREE.BoxGeometry(2.4,.7,1.5),M('#fbfbf8'),-.4,.7,0);add(g,new THREE.BoxGeometry(2.42,.28,1.52),M('#22303e'),-.4,.8,0);add(g,new THREE.BoxGeometry(1.2,.05,1.3),M('#2f78a8'),-1,1.15,0);return g;},
    gameboat(){const g=new THREE.Group();H(g,5,1.9,.75,'#f6f6f2',-.4);add(g,new THREE.BoxGeometry(1.8,1,1.6),M('#fbfbf8'),.2,.85,0);add(g,new THREE.BoxGeometry(1.82,.3,1.62),M('#22303e'),.2,1,0);add(g,new THREE.BoxGeometry(1.4,.08,1.3),M('#fbfbf8'),.1,2.1,0);
      [[.8,-.7],[.8,.7],[-.4,-.7],[-.4,.7]].forEach(([x,z])=>add(g,new THREE.CylinderGeometry(.03,.03,1,4),M('#c8c8c0'),x,1.6,z));[-1,1].forEach(sd=>{const r=add(g,new THREE.CylinderGeometry(.02,.02,3,4),M('#2a2a30'),-.6,1.6,sd*.8);r.rotation.x=sd*.6;});return g;},
    trawler(){const g=new THREE.Group();H(g,6,2.2,1,'#2f5a7a',-.55);add(g,new THREE.BoxGeometry(1.8,1.2,1.8),M('#f4f2ec'),-1.4,1.05,0);add(g,new THREE.BoxGeometry(1.82,.3,1.82),M('#2b3a4c'),-1.4,1.25,0);
      const b=add(g,new THREE.CylinderGeometry(.05,.05,3.6,5),M('#d8b040'),.8,1.8,0);b.rotation.z=-.4;[-1,1].forEach(sd=>{const o=add(g,new THREE.CylinderGeometry(.03,.03,3,4),M('#d8b040'),.4,1.2,sd*.9);o.rotation.x=sd*1;});return g;},
    inflatable(){const g=new THREE.Group();[-1,1].forEach(sd=>add(g,new THREE.CylinderGeometry(.22,.22,2.4,8),M('#e8734a'),0,0,sd*.45).rotation.z=Math.PI/2);add(g,new THREE.BoxGeometry(2.2,.08,.8),M('#3a3a40'),0,-.1,0);add(g,new THREE.BoxGeometry(.25,.4,.25),M('#2a2a30'),-1.2,.15,0);add(g,new THREE.SphereGeometry(.13,8,6),M('#f1c7a0'),-.7,.45,0);return g;}};
  delete AMB.banana;/* the towed banana boat removed (Paul, 13 Nov) */
  const AMBK=Object.keys(AMB),AMB_V={kayak:1.2,canoe:1.4,sailboat:3,catamaran:3.5,jetski:9,pontoon:2.5,dinghy:2.5,banana:6,cruiser:5,gameboat:5.5,trawler:2.5,inflatable:4};
  // ---- Kip's boat: the chosen model rides inside the tour boat's group ----
  function useBoat(k){if(typeof BOAT==='undefined'||!BOAT.g)return;const g=BOAT.g;if(!BOATS.orig)BOATS.orig=g.children.slice();if(BOATS.cur){g.remove(BOATS.cur);BOATS.cur=null;}
    const st=k&&BOATS.shop[k];BOATS.orig.forEach(c=>{c.visible=!st;});if(st){const m=MK[k]();m.rotation.y=0;g.add(m);BOATS.cur=m;}BOAT.vmax=st?st.vmax:7;BOAT.deckY=st?st.deck:.34;BOAT.turn=st?st.turn:2.4;BOAT.kind=k||null;S.boatSel=k||null;}
  // ---- the shop on Fremantle's harbour, near the B-Shed ferry terminal ----
  function freeAt(x,z,hw,hd){if(typeof colliders!=='undefined')for(const c of colliders){if(c.x2>x-hw&&c.x1<x+hw&&c.z2>z-hd&&c.z1<z+hd)return false;}try{for(const [a,b] of[[0,0],[-hw,-hd],[hw,-hd],[-hw,hd],[hw,hd]])if(blocked(x+a,z+b))return false;}catch(e){}return true;}
  function buildShop(){let p=null;for(let r=0;r<16&&!p;r+=1)for(let k=0;k<16&&!p;k++){const a=k/16*Math.PI*2,x=296+Math.cos(a)*r,z=-12+Math.sin(a)*r;if(freeAt(x,z,2.6,2))p=[x,z];}if(!p)p=[296,-12];
    let g=null;try{g=bld(p[0],p[1],4.6,3.2,3,'#e8e2d0',{roof:'#2f6a9a',sign:'FREO BOAT SALES',signBg:'#2f6a9a',signY:2.4});}catch(e){g=new THREE.Group();add(g,new THREE.BoxGeometry(4.6,3,3.2),M('#e8e2d0'),p[0],1.5,p[1]);scene.add(g);}
    // a small speed boat on the awning so the shop reads from the street (the boats themselves wait at Rottnest)
    {const m=MK.speed();m.position.set(p[0],3.6,p[1]);m.scale.setScalar(.6);scene.add(m);}
    BOATS.shopAt={x:p[0],z:p[1]+2.2};try{col(p[0]-2.3,p[1]-1.6,p[0]+2.3,p[1]+1.6);}catch(e){}}
  function openShop(){const own=S.boats||{};openTravel('Freo Boat Sales','Buy a boat to take out from the Rottnest jetty. Each one is yours to keep.',Object.keys(BOATS.shop).map(k=>{const b=BOATS.shop[k];
      return own[k]?{id:'boat_'+k,name:b.name,note:b.note,lock:'Owned ✓ · waiting for you at the Rottnest jetty'}:{id:'boat_'+k,name:b.name,note:b.note,fare:b.price,btn:'Buy',ride:()=>{S.boats=S.boats||{};S.boats[k]=1;save();say([{who:'Freo Boat Sales',text:'She’s all yours! We’ll have her waiting at the Rottnest Main Jetty. Pick her from the jetty when you head out.'}]);}};}),'Close');}
  function openFleet(){const own=Object.keys(S.boats||{}).filter(k=>BOATS.shop[k]);const go=k=>()=>{useBoat(k);BOAT.on=true;BOAT.v=0;popText((k?BOATS.shop[k].name:'Tour boat')+' · drive with the joystick',{x:BOAT.x,y:2,z:BOAT.z});};
    openTravel('Your boats','Main Jetty · pick a boat to take out',[{id:'boat_tour',name:'Tour boat',note:'The island’s old tour boat. Always free.',fare:0,btn:'Take out',ride:go(null)}].concat(own.map(k=>({id:'boat_'+k,name:BOATS.shop[k].name,note:BOATS.shop[k].note,fare:0,btn:'Take out',ride:go(k)}))),'Close');}
  // ---- wandering boats ----
  function seaPoint(){const SB=seaBounds();for(let i=0;i<60;i++){const x=SB.x1+10+Math.random()*(SB.x2-SB.x1-20),z=SB.z1+10+Math.random()*(SB.z2-SB.z1-20),d=landD(x,z);if(d===-9||d<-6)return[x,z];}return null;}
  function spawn(w){const k=AMBK[Math.floor(Math.random()*AMBK.length)];if(w.g)scene.remove(w.g);const g=fin(AMB[k]());const p=seaPoint()||[0,-100];g.position.set(p[0],0,p[1]);scene.add(g);Object.assign(w,{g,k,x:p[0],z:p[1],h:Math.random()*6.28,t:null,v:AMB_V[k],life:150+Math.random()*150,ph:Math.random()*6});}
  function buildWander(){for(let i=0;i<12;i++){const w={};spawn(w);BOATS.wander.push(w);}}
  BOATS.use=useBoat;
  let built=false;(function wait(){if(typeof ISL!=='undefined'&&ISL.done&&typeof Dg!=='undefined'&&typeof BOAT!=='undefined'&&BOAT.g){if(!built){built=true;try{buildShop();}catch(e){console.error('boatshop',e);}try{buildWander();}catch(e){console.error('wander',e);}try{if(S.boatSel&&S.boats&&S.boats[S.boatSel])useBoat(S.boatSel);}catch(e){}}return;}setTimeout(wait,600);})();
  (function loop(){try{const t=performance.now()/1000,dt=1/60;BOATS.wander.forEach(w=>{if(!w.g)return;w.life-=dt;
      const far=typeof camTarget==='undefined'||Math.hypot(camTarget.x-w.x,camTarget.z-w.z)>60;if(w.life<0&&far){spawn(w);return;}
      if(!w.t||Math.hypot(w.t[0]-w.x,w.t[1]-w.z)<3){w.t=seaPoint();if(!w.t)return;}
      const th=Math.atan2(w.t[1]-w.z,w.t[0]-w.x);let dh=Math.atan2(Math.sin(th-w.h),Math.cos(th-w.h));w.h+=Math.sign(dh)*Math.min(Math.abs(dh),.6*dt);
      const nx=w.x+Math.cos(w.h)*w.v*dt,nz=w.z+Math.sin(w.h)*w.v*dt,d=landD(nx,nz);if(d===-9||d<-2.5){w.x=nx;w.z=nz;}else w.t=null;
      w.g.position.set(w.x,Math.sin(t*1.3+w.ph)*.04,w.z);w.g.rotation.y=-w.h;w.g.rotation.z=Math.sin(t+w.ph)*.03;});}catch(e){}requestAnimationFrame(loop);})();
  // ---- interactions: the shop in Fremantle, the fleet at the jetty, and each boat's own perk out at sea ----
  const _tg=cbdTargets;cbdTargets=function(T){
    _tg(T);
    if(typeof BOAT!=='undefined'&&BOAT.g&&!BOAT.on&&zoneOf(player.x)==='island'&&BOAT.dock&&Object.keys(S.boats||{}).length){for(let i=T.length-1;i>=0;i--)if(/^Take the tour boat/.test(T[i].label||''))T.splice(i,1);T.push({x:BOAT.dock.x,z:BOAT.dock.z,r:1.6,label:'Take a boat out (tour boat or your own)',act:openFleet});}
    if(BOATS.shopAt&&zoneOf(player.x)==='freo')T.push({x:BOATS.shopAt.x,z:BOATS.shopAt.z,r:1.6,label:'Freo Boat Sales · buy a boat',act:openShop});
    if(typeof BOAT==='undefined'||!BOAT.on||Math.abs(BOAT.v)>1.6)return;const k=BOAT.kind,deep=-landD(BOAT.x,BOAT.z);
    if(k==='fishing'&&(deep>4||landD(BOAT.x,BOAT.z)===-9)){for(let i=T.length-1;i>=0;i--)if(/^Fish here for rare/.test(T[i].label||''))T.splice(i,1);T.push({x:BOAT.x,z:BOAT.z,r:3,label:'Fish from your fishing boat (rare fish)',act:()=>{BOAT.v=0;startFishing({name:'your fishing boat',zone:'island',boat:true,deep:true});}});}
    if(k==='house')T.push({x:BOAT.x,z:BOAT.z,r:3,label:'Sleep aboard the houseboat until 7:00',act:()=>{BOAT.v=0;endDay();}});
    if(k==='yacht')T.push({x:BOAT.x,z:BOAT.z,r:3,label:'Host guests on the yacht',act:()=>{const d=S.day||0;if(S.yachtDay===d){say([{who:'Kip',text:'The guests are still asleep in the sun. Maybe tomorrow.'}]);return;}S.yachtDay=d;const pay=rw(120);S.coins+=pay;save();popText('Guests had a lovely time! +'+pay+' coins',{x:BOAT.x,y:2.2,z:BOAT.z});say([{who:'Guests',text:pick(['Best cruise ever! And the coffee was better than the city!','We saw dolphins AND a quokka captain. Five stars.','Can we do this again next summer?'])}]);}});};
})();
