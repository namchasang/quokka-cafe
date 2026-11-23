// ---------- Serpentine Falls camp (Look Lab ?camppark, Paul 23 Nov 2026: "เอาขึ้นเกมส์จริงใน map camppark") ----------
// The Stream & Falls Lab placed in the game as its own map (zone srp, x 1730..1850), built 100% by the Stream & Falls Engine
// (part 188-engine-streams.js, gammaOut): the scarp, streams from the ground's heights, cascades over granite into plunge pools,
// jarrah/marri forest, grass trees, ferns and sedges, grass tufts, leaf litter, gravel, pebbles and moss. The engine works in metres;
// the map uses it at 0.55 (trees 7-12 units, the biggest fall about 9 units high) so it sits at the game's scale.
// The Camp Kit (Camp Kit Engine, part 188-engine-campkit.js) stands on a levelled clearing the Stream & Falls Engine keeps free; Kip wades
// across the streams (Paul, 23 Nov 2026) but not into the deep plunge pools. With ?camppark Kip is taken there once the
// game runs; "Drive home" by the camp sign brings him back to the café. Graphics Low builds the lighter version (fewer tufts and stones).
var CAMPPARK_LIVE=true;/* live: Paul, 23 Nov 2026 'map สวยมากครับ ... ให้ขึ้นเกมส์ได้เลย'; players reach it through Marlo's fishing quest (part 188-campfish-quest.js) */
const CAMPPARK={on:CAMPPARK_LIVE||/[?&#]camppark\b/.test(location.search+location.hash),lab:/[?&#]camppark\b/.test(location.search+location.hash),S:.55,CX:1790,CZ:0,E:null};
if(CAMPPARK.on&&typeof TRIPS!=='undefined'&&TRIP_ON&&typeof STREAMS_ENGINE!=='undefined'&&typeof CAMPKIT_ENGINE!=='undefined')(()=>{
  const k='srp',T=TRIPS[k]={x1:1730,x2:1850,z1:-45,z2:45,tour:null,name:'Serpentine Falls',title:'Serpentine Falls · camp',bg:'#5e7a3a'};
  const G=new THREE.Group();G.name='trip_'+k;G.visible=false;scene.add(G);T.G=G;
  const K={id:k,x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2,walk:()=>false,h:()=>0,arrive:[CAMPPARK.CX,0],van:[CAMPPARK.CX-3,2],targets:null,tick:null,
    zone:{rects:[[T.x1,T.z1,T.x2,T.z2,T.bg]],labels:[[T.title,CAMPPARK.CX,0,1]]}};T.K=K;T.built=false;
  ZONE_DEF[k]={B:{x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2},title:T.title,eb:'Camping · Darling Scarp',bg:T.bg,rects:K.zone.rects,labels:K.zone.labels};SAFE_SPOTS[k]=[K.arrive];TOWN_NAME[k]=T.title;
  TRIP_BUILD[k]=function(G,K){const S=CAMPPARK.S,CX=CAMPPARK.CX,CZ=CAMPPARK.CZ;
    const lite=typeof GFX!=='undefined'&&GFX&&GFX.level==='low';
    /* the land: Stream & Falls Engine with a levelled camp clearing (Paul 23 Nov 2026: the Camp Kit goes on this map) */
    const E=CAMPPARK.E=STREAMS_ENGINE.create({gammaOut:true,lite,camp:{r:12}});E.root.scale.setScalar(S);E.root.position.set(CX,0,CZ);E.root.traverse(o=>{o.__pxSkip=1;});G.add(E.root);G.__pxSkip=1;
    const L=(x,z)=>[(x-CX)/S,(z-CZ)/S],W=(lx,lz)=>[CX+lx*S,CZ+lz*S];
    const TB=new Map();E.trees.forEach(t=>{const kk=Math.floor(t[0]/6)+','+Math.floor(t[2]/6);(TB.get(kk)||TB.set(kk,[]).get(kk)).push(t);});
    const trunk=(lx,lz)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const A=TB.get((Math.floor(lx/6)+a)+','+(Math.floor(lz/6)+b));if(A)for(const t of A)if(Math.hypot(lx-t[0],lz-t[2])<.75)return true;}return false;};
    K.h=(x,z)=>{const [lx,lz]=L(x,z);return S*E.gAt(Math.max(-79,Math.min(79,lx)),Math.max(-79,Math.min(79,lz)));};
    /* the camp: Camp Kit Engine at the clearing (motorhome, tent, campfire, chairs, cooking, food box, picnic table, barbecue shelter,
       toilet, bin, sign, lantern, torch, blanket, snack basket) */
    const C0=E.camp||{x:0,z:0,y:E.gAt(0,0)};const CK=CAMPPARK.CK=CAMPKIT_ENGINE.create({gammaOut:true,sign:'Serpentine Falls Camp',camera});
    const [kx,kz]=W(C0.x,C0.z);CK.root.position.set(kx,S*C0.y,kz);CK.root.scale.setScalar(S);CK.root.traverse(o=>{o.__pxSkip=1;});G.add(CK.root);
    const P=(lx,lz)=>[kx+lx*S,kz+lz*S];const solid=CK.solids.map(([x,z,r])=>{const [a,b]=P(x,z);return[a,b,r*S+.15];});
    /* Kip: anywhere on the land, across the streams (he wades through), not into the deep plunge pools, up cliffs, through trunks or camp things */
    K.walk=(x,z)=>{const [lx,lz]=L(x,z);if(Math.abs(lx)>77||Math.abs(lz)>77)return false;if(E.deepAt(lx,lz))return false;if(E.slopeAt(lx,lz)>1.05)return false;if(trunk(lx,lz))return false;
      for(const c of solid)if(Math.hypot(x-c[0],z-c[1])<c[2])return false;return true;};
    const [ax,az]=P(-2.6,1.6);K.arrive=[ax,az];const [vx,vz]=P(-4.6,-2.2);K.van=[vx,vz];
    K.zone.labels=[[T.title,kx,kz-5,1]];SAFE_SPOTS[k]=[K.arrive];
    const _pa=new THREE.Vector3();K.tick=(dt,t)=>{E.update(dt);_pa.set(player.x,groundY(player.x,player.z)+.8,player.z);E.setCut(_pa,camera.position,.8);CK.tick(dt,typeof NIGHT!=='undefined'?NIGHT:0,camera);};
    K.targets=TT=>{for(let i=TT.length-1;i>=0;i--)if(/^Tour van|^Ask the guide/.test(TT[i].label||''))TT.splice(i,1);/* no tour van here: Kip drove */
      TT.push({x:vx,z:vz,r:1.8,label:'Ride home with Marlo · back to Rottnest',act:()=>campHome()});
      {const [fx,fz]=P(0,0);TT.push({x:fx,z:fz,r:1.6,label:'Campfire',act:()=>{const st=CK.fireState=((CK.fireState==null?1:CK.fireState)+1)%3;CK.setFire(st);toast(['\u{1F525} Fire out','\u{1F525} The fire is burning','\u{1F525} Glowing embers'][st],2);}});}
      {const [tx,tz]=P(4.4,-3.2);TT.push({x:tx,z:tz,r:1.6,label:'Tent',act:()=>{CK.pitch();toast('⛺ Tent',1.5);}});}
      const qq=E.big;if(qq){const [px,pz]=W(qq.land?qq.land.x:qq.x,qq.land?qq.land.z:qq.z);TT.push({x:px,z:pz,r:5,label:'Serpentine Falls',act:()=>toast('\u{1F4A6} Serpentine Falls: the water slides down polished granite into the pool.',3)});}};
    window.__CAMPPARK=CAMPPARK;};
  function campHome(){transit=true;fadeTarget=.95;setTimeout(()=>{const sp=(CAMPPARK.homeSpot&&CAMPPARK.homeSpot())||freeNear(...SAFE_SPOTS.island[0]);player.x=sp[0];player.z=sp[1];S.time+=30;updateCamera(0,true);fadeTarget=0;transit=false;toast('Back on Rottnest',2);save();},700);}
  CAMPPARK.enter=function(){if(transit||VISIT)return;transit=true;fadeTarget=.95;toast('Driving to Serpentine Falls…',1.8);
    setTimeout(()=>{tripEnsure(k);player.bike=false;player.carry=null;player.lying=false;player.x=K.arrive[0];player.z=K.arrive[1];updateCamera(0,true);hideOverlays();fadeTarget=0;transit=false;S.seenZ=S.seenZ||{};S.seenZ[k]=1;toast('Serpentine Falls · camp',2.6);},800);};
  /* the lab: once a game is running, take Kip to the camp (once per page load) */
  (function go(){if(!CAMPPARK.lab)return;/* the Look Lab link ?camppark drops Kip at the camp; players ride with Marlo */try{if(running&&!overlay&&!dlgOpen()&&!transit&&typeof player!=='undefined'&&!CAMPPARK.went&&(typeof IBMAP==='undefined'||!IBMAP.on||IBMAP.done)){CAMPPARK.went=1;CAMPPARK.enter();return;}}catch(e){}setTimeout(go,800);})();
})();
