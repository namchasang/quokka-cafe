// ---------- Marlo's camper van and the fishing round (Paul, 23 Nov 2026) ----------
// "ให้สร้างตัวละครใหม่เป็น NPC ที่ยืนอยู่ข้าง camper van ใน map rottnest เพื่อคุย ทำเควสตกปลารอบเกาะเควสนึงก็จะปลดล็อค camppark map"
// Marlo, a travelling quokka (fictional), has parked her motorhome (the Camp Kit van) near Kip's café. Side quest "Fishing Round the
// Island": catch a fish at every fishing spot on Rottnest, then show her. Done: she drives Kip to the Serpentine Falls camp (zone srp)
// whenever he asks, and brings him back to her van. Fishing has to be open first (Gus's rod).
// Paul (24 Nov 2026): 'marlo ไม่ต้องมีเควสก็ไป camppark ได้เลย': the ride is open from day one (tap the van door); the fishing round
// stays as an optional side quest for coins.
(()=>{if(typeof CAMPPARK==='undefined'||!CAMPPARK.on||typeof CAMPKIT_ENGINE==='undefined')return;
  const CF={van:null,npc:null,spot:null,q:null};window.__CAMPFISH=CF;
  const S_=.6;/* van size on Rottnest */
  /* the island map's own ground: roads, paths and water are no place for a parked van */
  const offLand=(x,z)=>{try{const m=IBMAP.toMap(x,z),k=IBMAP.I.kindAt(m[0],m[1]);return k==='path'||k==='water';}catch(e){return false;}};CF.offLand=offLand;
  function findSpot(){const C=IW(0,0);let best=null;
    for(let r=13;r<=30&&!best;r+=1.5)for(let a=0;a<32&&!best;a++){const t=a/32*6.283+.3,x=C.x+Math.cos(t)*r,z=C.z+Math.sin(t)*r;let ok=true;
      for(const [dx,dz] of [[0,0],[2.4,0],[-2.4,0],[0,2],[0,-2],[2.4,2],[-2.4,-2],[2.4,-2],[-2.4,2],[0,3.6],[1.5,3.6]])if(blocked(x+dx,z+dz)){ok=false;break;}
      if(ok&&[[0,0],[2.4,0],[-2.4,0],[0,2],[0,-2],[2.4,2],[-2.4,-2],[2.4,-2],[-2.4,2]].some(([dx,dz])=>offLand(x+dx,z+dz)))ok=false;/* never on a road, path or bike lane (Paul, 28 Nov 2026) */
      if(ok&&FISH_SPOTS.some(f=>Math.hypot(f.x-x,f.z-z)<6))ok=false;if(ok&&Math.hypot(JETTY.x1-x,JETTY.z1-z)<8)ok=false;if(ok)best={x,z};}
    return best;}
  function build(){const sp=findSpot();if(!sp)return false;CF.spot=sp;
    const CK=CAMPKIT_ENGINE.create({gammaOut:true});const van=CK.POINTS.van;CK.root.children.forEach(c=>{if(c!==van)c.visible=false;});
    /* the van sits at sp: the kit puts it at (-6.4,-3.6) from its centre */
    CK.root.scale.setScalar(S_);CK.root.position.set(sp.x+6.4*S_,groundY(sp.x,sp.z),sp.z+3.6*S_);CK.root.traverse(o=>{o.__pxSkip=1;});CK.root.__islKeep=1;/* the island map's old-scenery pass leaves it alone */scene.add(CK.root);CF.van=CK;
    CK.setAwn(true);
    /* Marlo stands by the door, facing the café side */
    const m=spriteMesh(quokkaFrames('#d8634a',1.12),1.08,1.08);const nx=sp.x+1.2,nz=sp.z+2.4;m.position.set(nx,groundY(nx,nz),nz);scene.add(m);CF.blob=blob(.8);CF.blob.position.set(nx,groundY(nx,nz)+.03,nz);CF.npc={x:nx,z:nz,m};
    /* the van door spot for the ride, on the side away from Marlo so the two taps don't overlap */
    CF.door=[[-1.3,2.3],[-2.2,2.1],[-1.3,3],[0,3.4]].map(([a,b])=>({x:sp.x+a,z:sp.z+b})).find(p=>!blocked(p.x,p.z)&&Math.hypot(p.x-nx,p.z-nz)>2)||{x:sp.x-1.3,z:sp.z+2.6};
    /* Kip walks round the van, not through it */
    const _b=blocked;blocked=function(x,z){const p=CF.spot;if(p&&Math.abs(x-p.x)<2.1&&Math.abs(z-p.z)<1.6)return true;return _b(x,z);};
    return true;}
  /* the quest: one step per island fishing spot (shore spots only, no boat or deep-sea spots) */
  function makeQuest(){const spots=FISH_SPOTS.filter(f=>f.zone==='island'&&!f.boat&&!f.deep).slice(0,5);S.campFish=S.campFish||{};
    const at=f=>()=>({x:f.x,z:f.z});const vanAt=()=>CF.npc?{x:CF.npc.x,z:CF.npc.z}:null;
    const q={id:'campfish',zone:'island',mood:'heart',title:'Fishing Round the Island',giver:'Marlo the camper',coins:60,
      desc:'Marlo drives her motorhome all over the state and camps by every waterfall she can find. She will drive Kip to her favourite, Serpentine Falls, any time, and she would love to see him catch a fish at every spot round the island.',
      steps:[{l:'Talk to Marlo by her camper van',pos:vanAt,chk:()=>unlocked('fishing'),say:[{who:'Marlo',text:'G’day! You must be the café quokka. I’m Marlo. That van is my house, my kitchen and my best friend.'},
          {who:'Marlo',text:'I camp by a waterfall in the hills: Serpentine Falls. Granite, a pool under the falls, a creek you can wade across. Best spot in the state.'},
          {who:'Marlo',text:'Hop in any time, the door’s always open. And a little challenge: land a fish at every fishing spot round this island and show me.'}]}]
        .concat(spots.map(f=>({l:'Catch a fish at '+f.name,pos:at(f),chk:()=>!!(S.campFish&&S.campFish[f.name]),say:['Kip: One fish from '+f.name+'. Marlo will want to hear about this one.']})))
        .concat([{l:'Show Marlo your catch',pos:vanAt,say:[{who:'Marlo',text:'Every spot on the island? Look at you. Rod skills like that, you’ll never go hungry at camp.'},
          {who:'Marlo',text:'Rod skills like that, you’ll never go hungry at camp. Hop in whenever you like. Bring marshmallows.'}]}]),
      outro:'Marlo is proud of you. Ride to Serpentine Falls any time from her van door.'};
    SIDEQ.push(q);CF.q=q;}
  const _sp=sqPos;sqPos=function(st){if(st&&st.pos)return st.pos();return _sp(st);};
  /* catches count for the quest wherever they land on the island */
  const _ef=endFishing;endFishing=function(ok){const g=fishG;const r=_ef.apply(this,arguments);try{if(ok&&g&&g.f&&!g.f.junk&&g.spot&&g.spot.zone==='island'&&g.spot.name){S.campFish=S.campFish||{};
      if(!S.campFish[g.spot.name]){S.campFish[g.spot.name]=1;if(CF.q&&sqStep(CF.q)>=1&&sqStep(CF.q)<CF.q.steps.length){const left=CF.q.steps.filter(st=>st.l.startsWith('Catch')&&!st.chk()).length;toast(left?'\u{1F3A3} Marlo’s round: '+left+' fishing spot'+(left>1?'s':'')+' to go':'\u{1F3A3} Every spot done! Go and show Marlo.',3);}save();}}}catch(e){}return r;};
  CAMPPARK.ready=()=>true;/* no quest needed (Paul, 24 Nov 2026) */
  /* the ride: at the van door, open to everyone; Marlo herself keeps the fishing-round chat */
  const _bt=buildTargets;buildTargets=function(){const T=_bt.apply(this,arguments);try{if(CF.npc&&zoneOf(player.x)==='island'&&!VISIT){const n=CF.npc;
      const d=CF.door||n;T.push({x:d.x,z:d.z,r:1.4,label:'Ride to Serpentine Falls with Marlo',act:()=>{say([{who:'Marlo',text:pick(['Buckle up! Creek’s running nicely this week.','Got the marshmallows? Let’s roll.','Off to the falls. Windows down!'])}],()=>CAMPPARK.enter());}});
      if(CF.q&&sqStep(CF.q)>=1&&sqStep(CF.q)<CF.q.steps.length)T.push({x:n.x,z:n.z,r:1.4,label:'Talk to Marlo',act:()=>{const left=CF.q.steps.filter(st=>st.l.startsWith('Catch')&&!st.chk()).map(st=>st.l.replace('Catch a fish at ',''));say([{who:'Marlo',text:left.length?'Still to fish: '+left.join(', ')+'. The fish won’t catch themselves!':'Come here and show me that catch!'}]);}});
      else if(!unlocked('fishing'))T.push({x:n.x,z:n.z,r:1.4,label:'Talk to Marlo',act:()=>say([{who:'Marlo',text:'G’day! I’d ask you fishing, but you haven’t got a rod yet. Captain Gus has an old one he never uses. Come back when he lends it to you.'}])});}}catch(e){}return T;};
  /* home from the camp: back to Marlo's van */
  CAMPPARK.homeSpot=()=>CF.spot?freeNear(CF.spot.x+1.6,CF.spot.z+3.2):null;
  /* park somewhere else: after the Island Builder changes the island, the van may stand on a new road */
  function moveTo(sp){const o=CF.spot;CF.spot=null;const dx=sp.x-o.x,dz=sp.z-o.z;CF.spot=sp;const R=CF.van.root;R.position.set(sp.x+6.4*S_,groundY(sp.x,sp.z),sp.z+3.6*S_);
    const n=CF.npc;n.x+=dx;n.z+=dz;n.m.position.set(n.x,groundY(n.x,n.z),n.z);if(CF.blob)CF.blob.position.set(n.x,groundY(n.x,n.z)+.03,n.z);if(CF.door){CF.door.x+=dx;CF.door.z+=dz;}}
  CF.check=()=>{if(!CF.van||!CF.spot)return;const p=CF.spot;if(![[0,0],[2.4,0],[-2.4,0],[0,2],[0,-2]].some(([dx,dz])=>offLand(p.x+dx,p.z+dz)))return;const o=CF.spot;CF.spot=null;const sp=findSpot();CF.spot=o;if(sp)moveTo(sp);};
  setInterval(()=>{try{if(IBMAP.done)CF.check();if(CF.van&&!CF.van.root.visible)CF.van.root.visible=true;}catch(e){}},4000);
  (function wait(){let ok=false;try{ok=ISL.done&&(!IBMAP.on||IBMAP.done)&&!!S&&running;}catch(e){}if(!ok){setTimeout(wait,700);return;}
    try{if(!CF.van&&!build()){setTimeout(wait,3000);return;}if(!CF.q)makeQuest();}catch(e){console.error('campfish',e);}})();
})();
