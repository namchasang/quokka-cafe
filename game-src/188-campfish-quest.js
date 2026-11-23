// ---------- Marlo's camper van and the fishing round (Paul, 23 Nov 2026) ----------
// "ให้สร้างตัวละครใหม่เป็น NPC ที่ยืนอยู่ข้าง camper van ใน map rottnest เพื่อคุย ทำเควสตกปลารอบเกาะเควสนึงก็จะปลดล็อค camppark map"
// Marlo, a travelling quokka (fictional), has parked her motorhome (the Camp Kit van) near Kip's café. Side quest "Fishing Round the
// Island": catch a fish at every fishing spot on Rottnest, then show her. Done: she drives Kip to the Serpentine Falls camp (zone srp)
// whenever he asks, and brings him back to her van. Fishing has to be open first (Gus's rod).
(()=>{if(typeof CAMPPARK==='undefined'||!CAMPPARK.on||typeof CAMPKIT_ENGINE==='undefined')return;
  const CF={van:null,npc:null,spot:null,q:null};window.__CAMPFISH=CF;
  const S_=.6;/* van size on Rottnest */
  function findSpot(){const C=IW(0,0);let best=null;
    for(let r=13;r<=30&&!best;r+=1.5)for(let a=0;a<32&&!best;a++){const t=a/32*6.283+.3,x=C.x+Math.cos(t)*r,z=C.z+Math.sin(t)*r;let ok=true;
      for(const [dx,dz] of [[0,0],[2.4,0],[-2.4,0],[0,2],[0,-2],[2.4,2],[-2.4,-2],[2.4,-2],[-2.4,2],[0,3.6],[1.5,3.6]])if(blocked(x+dx,z+dz)){ok=false;break;}
      if(ok&&FISH_SPOTS.some(f=>Math.hypot(f.x-x,f.z-z)<6))ok=false;if(ok&&Math.hypot(JETTY.x1-x,JETTY.z1-z)<8)ok=false;if(ok)best={x,z};}
    return best;}
  function build(){const sp=findSpot();if(!sp)return false;CF.spot=sp;
    const CK=CAMPKIT_ENGINE.create({gammaOut:true});const van=CK.POINTS.van;CK.root.children.forEach(c=>{if(c!==van)c.visible=false;});
    /* the van sits at sp: the kit puts it at (-6.4,-3.6) from its centre */
    CK.root.scale.setScalar(S_);CK.root.position.set(sp.x+6.4*S_,groundY(sp.x,sp.z),sp.z+3.6*S_);CK.root.traverse(o=>{o.__pxSkip=1;});scene.add(CK.root);CF.van=CK;
    CK.setAwn(true);
    /* Marlo stands by the door, facing the café side */
    const m=spriteMesh(quokkaFrames('#d8634a',1.12),1.08,1.08);const nx=sp.x+1.2,nz=sp.z+2.4;m.position.set(nx,groundY(nx,nz),nz);scene.add(m);blob(.8).position.set(nx,groundY(nx,nz)+.03,nz);CF.npc={x:nx,z:nz,m};
    /* Kip walks round the van, not through it */
    const _b=blocked;blocked=function(x,z){if(Math.abs(x-sp.x)<2.1&&Math.abs(z-sp.z)<1.6)return true;return _b(x,z);};
    return true;}
  /* the quest: one step per island fishing spot (shore spots only, no boat or deep-sea spots) */
  function makeQuest(){const spots=FISH_SPOTS.filter(f=>f.zone==='island'&&!f.boat&&!f.deep).slice(0,5);S.campFish=S.campFish||{};
    const at=f=>()=>({x:f.x,z:f.z});const vanAt=()=>CF.npc?{x:CF.npc.x,z:CF.npc.z}:null;
    const q={id:'campfish',zone:'island',mood:'heart',title:'Fishing Round the Island',giver:'Marlo the camper',coins:60,
      desc:'Marlo drives her motorhome all over the state and camps by every waterfall she can find. She will take Kip to her favourite, Serpentine Falls, once he can catch his own dinner anywhere on the island.',
      steps:[{l:'Talk to Marlo by her camper van',pos:vanAt,chk:()=>unlocked('fishing'),say:[{who:'Marlo',text:'G’day! You must be the café quokka. I’m Marlo. That van is my house, my kitchen and my best friend.'},
          {who:'Marlo',text:'I camp by a waterfall in the hills: Serpentine Falls. Granite, a pool under the falls, a creek you can wade across. Best spot in the state.'},
          {who:'Marlo',text:'I’ll take you there. One rule at my camp: everyone catches their own dinner. Land a fish at every fishing spot round this island and show me.'}]}]
        .concat(spots.map(f=>({l:'Catch a fish at '+f.name,pos:at(f),chk:()=>!!(S.campFish&&S.campFish[f.name]),say:['Kip: One fish from '+f.name+'. Marlo will want to hear about this one.']})))
        .concat([{l:'Show Marlo your catch',pos:vanAt,say:[{who:'Marlo',text:'Every spot on the island? Look at you. Rod skills like that, you’ll never go hungry at camp.'},
          {who:'Marlo',text:'Serpentine Falls it is. Hop in whenever you like, I’m always up for the drive. Bring marshmallows.'}]}]),
      outro:'Serpentine Falls camp is open: talk to Marlo at her van to ride there.'};
    SIDEQ.push(q);CF.q=q;}
  const _sp=sqPos;sqPos=function(st){if(st&&st.pos)return st.pos();return _sp(st);};
  /* catches count for the quest wherever they land on the island */
  const _ef=endFishing;endFishing=function(ok){const g=fishG;const r=_ef.apply(this,arguments);try{if(ok&&g&&g.f&&!g.f.junk&&g.spot&&g.spot.zone==='island'&&g.spot.name){S.campFish=S.campFish||{};
      if(!S.campFish[g.spot.name]){S.campFish[g.spot.name]=1;if(CF.q&&sqStep(CF.q)>=1&&sqStep(CF.q)<CF.q.steps.length){const left=CF.q.steps.filter(st=>st.l.startsWith('Catch')&&!st.chk()).length;toast(left?'\u{1F3A3} Marlo’s round: '+left+' fishing spot'+(left>1?'s':'')+' to go':'\u{1F3A3} Every spot done! Go and show Marlo.',3);}save();}}}catch(e){}return r;};
  CAMPPARK.ready=()=>!!(CF.q&&sqStep(CF.q)>=CF.q.steps.length)||(typeof isGM==='function'&&isGM());
  /* Marlo: chat before the quest, the ride once it is done */
  const _bt=buildTargets;buildTargets=function(){const T=_bt.apply(this,arguments);try{if(CF.npc&&zoneOf(player.x)==='island'&&!VISIT){const n=CF.npc;
      if(CAMPPARK.ready())T.push({x:n.x,z:n.z,r:1.6,label:'Ride to Serpentine Falls with Marlo',act:()=>{say([{who:'Marlo',text:pick(['Buckle up! Creek’s running nicely this week.','Got the marshmallows? Let’s roll.','Off to the falls. Windows down!'])}],()=>CAMPPARK.enter());}});
      else if(CF.q&&sqStep(CF.q)>=1)T.push({x:n.x,z:n.z,r:1.4,label:'Talk to Marlo',act:()=>{const left=CF.q.steps.filter(st=>st.l.startsWith('Catch')&&!st.chk()).map(st=>st.l.replace('Catch a fish at ',''));say([{who:'Marlo',text:left.length?'Still to fish: '+left.join(', ')+'. The fish won’t catch themselves!':'Come here and show me that catch!'}]);}});
      else if(!unlocked('fishing'))T.push({x:n.x,z:n.z,r:1.4,label:'Talk to Marlo',act:()=>say([{who:'Marlo',text:'G’day! I’d ask you fishing, but you haven’t got a rod yet. Captain Gus has an old one he never uses. Come back when he lends it to you.'}])});}}catch(e){}return T;};
  /* home from the camp: back to Marlo's van */
  CAMPPARK.homeSpot=()=>CF.spot?freeNear(CF.spot.x+1.6,CF.spot.z+3.2):null;
  (function wait(){let ok=false;try{ok=ISL.done&&(!IBMAP.on||IBMAP.done)&&!!S&&running;}catch(e){}if(!ok){setTimeout(wait,700);return;}
    try{if(!CF.van&&!build()){setTimeout(wait,3000);return;}if(!CF.q)makeQuest();}catch(e){console.error('campfish',e);}})();
})();
