// ---- hooks: zone, travel, map, story ----
if(AIR.on){
  BUS_STOPS.air={x:724,z:13.4,name:'Perth Airport',land:[724,13.4]};SAFE_SPOTS.air=[[724,13.4],[760,-1],[778,4.2]];
  ZONE_DEF.air={B:AIRB,title:'Perth Airport',eb:'Airport · flights to everywhere',bg:'#7aa356',rects:[[713,-30,817,-12,'#7aa356'],[713,-26,817,-22.6,'#4a4d55'],[716,-16.2,800,-7.8,'#b8bab8'],[726,-8,796,-3,'#d8dcde'],[714,-.4,816,2.2,'#4a4d55'],[718,2.2,814,4.6,'#a8583a'],[736,5,802,15.4,'#4a4d55'],[717,4.9,731,11.5,'#2a2e34'],[800,-11.8,812,-3,'#7aa356']],
    labels:[['Perth Airport',761,-5.5,1],['Runway',765,-24.3,1],['Control tower',807.5,-8.4,1],['Viewing deck',806,-10.5,0],['Arrivals',756,-1.5,0],['Airport Central',724,8.2,1],['Car hire',760,8,0],['Gates',760,-12,0]]};
  const _tg=cbdTargets;cbdTargets=function(T){_tg(T);const z=zoneOf(player.x);
    if(z==='cbd')T.push({x:685,z:-22.1,r:1.4,label:'Train to the Airport · Airport Central'+(hasPass()?'':' · \u{1F512} Perth Pass'),act:()=>airTrain('air')});
    if(z!=='air')return;T.push({x:724,z:12.4,r:1.5,label:'Train to Perth Station (city)',act:()=>airTrain('cbd')});
    AIR.npcs.forEach(n=>T.push({x:n.x,z:n.z+.5,r:1.3,label:'Talk to '+n.name,act:()=>airTalk(n)}));
    if(storyChap('air')&&S.qg&&S.qg.askHut&&!S.qg.suitcase)T.push({x:799.4,z:14.9,r:1.2,label:'Pick up the blue suitcase',act:()=>{S.qg.suitcase=1;AIR.case.visible=false;save();say(['A blue suitcase with a yellow tag: MILO. It’s full of footy cards. And socks. Mostly socks.']);}});
    T.push({x:804,z:-10,r:1.3,label:'Watch the planes',act:()=>{S.qg=S.qg||{};S.qg.spotted=1;save();say(['A plane in a teal tail rolls down the taxiway, then another roars down the runway and lifts off over the hills.','Kip: One day I’ll fly somewhere too. After the café is famous.']);}});
    T.push({x:776,z:-2.4,r:1.3,label:'Coffee at the departures cart · 5 coins',act:()=>{if(S.coins<5){toast('Not enough coins',2);return;}S.coins-=5;eat(15,'Airport flat white');save();}});};
  function airTalk(n){S.qg=S.qg||{};const c=storyChap('air'),n0=(S.story&&S.story.air)||0;
    if(n.id==='june'&&!S.qg.metJune){S.qg.metJune=1;save();say([{who:'Auntie June',text:'Kip! Over here! Oh, look at you, a real café owner now.'},{who:'Milo',text:'We came on a plane! A BIG one!'},{who:'Kip',text:'Auntie June! Milo! Welcome to Perth. Wait till you see the island.'},{who:'Auntie June',text:'Show us around first. I want a photo of that tower for your uncle.'}]);return;}
    if(n.id==='milo'&&n0===1&&!S.qg.gaveCase){if(S.qg.suitcase){S.qg.gaveCase=1;save();say([{who:'Milo',text:'MY SUITCASE! My footy cards! Thank you, Kip!'},{who:'Auntie June',text:'We’ll come to the café as soon as we land on Rottnest. Save us a table.'}]);}else say([{who:'Milo',text:'My blue suitcase didn’t come out on the belt. Raj at car hire might have seen it.'}]);return;}
    if(n.id==='raj'&&n0===1&&!S.qg.askHut){S.qg.askHut=1;save();say([{who:'Raj',text:'A blue suitcase with a yellow tag? Rolled off a trolley this morning. Last I saw, it was heading for the far end of the lot.'}]);return;}
    say(n.lines());}
  window.airTrain=function(dest){if(transit||VISIT)return;if(dest==='air'&&needPass('cbd'))return;if(!pay(FARE_RIDE))return;transit=true;fadeTarget=.95;toast(dest==='air'?'Train to the Airport · Airport Central…':'Train to Perth Station…',2.2);
    setTimeout(()=>{S.time+=20;player.bike=false;player.carry=null;if(dest==='air'){player.x=AIR.land[0];player.z=AIR.land[1];}else{player.x=680;player.z=-19.6;}updateCamera(0,true);fadeTarget=0;transit=false;S.seenZ=S.seenZ||{};S.seenZ[dest]=1;
      if(dest==='air'){S.fq=S.fq||{};if(!S.fq.visitAir){S.fq.visitAir=1;save();say(['Kip: The airport! Planes taking off over the hills… and somewhere in arrivals, Auntie June and Milo.']);}}},900);};
  [['airtower','Control tower','place',4.2],['airterm','Terminal canopy','place',5],['planespot','Plane spotting','place',3.4,()=>[[AIR.P.deck.x,AIR.P.deck.z]]],['airstn','Airport Central','place',4],['carhire','Car hire lot','place',4]]
    .forEach(([id,name,cat,r,pos])=>PCS.push({id,name,zone:'air',cat,pos:pos||(()=>{const k={airtower:'tower',airterm:'terminal',airstn:'station',carhire:'lot'}[id];const p=AIR.P[k];return p?[[p.x,p.z]]:[];}),r}));
  Object.assign(PC_HINTS,{airtower:'The control tower · the tall shaft with the dark glass cab at the airport',airterm:'Terminal canopy · the white curved blades over the airport kerb',planespot:'Plane spotting · the lawn beside the control tower',airstn:'Airport Central · the train station by the airport kerb',carhire:'Car hire lot · rows of white cars and shade sails'});
  {const _sd=STORY_DEF;STORY_DEF=function(){const o=_sd();if(!o.air){const g=()=>S.qg||{};o.air={name:'Perth Airport',short:'Airport',chapters:[
    {title:'Arrivals',giver:'Auntie June',intro:'Kip, love! Milo and I just flew in from Melbourne. Meet us at arrivals, then show us around this airport of yours.',outro:'What a welcome! Now… Milo has something to tell you about his suitcase.',coins:70,
     steps:[['Meet Auntie June and Milo at arrivals',{check:()=>!!g().metJune,at:()=>({x:755.2,z:-.4,label:'Arrivals'})}],['Photograph the control tower','airtower'],['Photograph the terminal canopy','airterm'],['Watch the planes from the viewing deck',{check:()=>!!g().spotted,at:()=>({x:804,z:-10,label:'Viewing deck'})}]]},
    {title:'The lost suitcase',giver:'Milo',intro:'My blue suitcase didn’t come out on the belt! It has all my footy cards. Can you help me find it, cousin Kip?',outro:'Footy cards, safe! See you on the island, Kip. We’ll be your first customers tomorrow.',coins:90,
     steps:[['Ask Raj at the car hire hut',{check:()=>!!g().askHut,at:()=>({x:761.6,z:8.6,label:'Car hire hut'})}],['Find the blue suitcase in the car park',{check:()=>!!g().suitcase,at:()=>({x:799.4,z:14.9,label:'Blue suitcase'})}],['Give it back to Milo',{check:()=>!!g().gaveCase,at:()=>({x:757,z:-.2,label:'Milo'})}],['Photograph Airport Central','airstn']]}]};}return o;};}
  STORY_ORDER.push('air');
  // show the airport only when Kip is there (or in the Look Lab); planes, beacon, night lights
  {const _zt=zoneTick;zoneTick=function(dt,t){_zt(dt,t);const here=zoneOf(player.x)==='air'||(typeof LAB!=='undefined'&&LAB.on);if(AIR.g.visible!==here)AIR.g.visible=here;if(here)airTick(dt);};}
  function airTick(dt){dt=Math.min(dt||0,.1);const t=performance.now()/1000;
    for(const p of AIR.planes){p.t+=dt;if(p.kind==='taxi'){const T=40,q=(p.t%T)/T;p.g.position.set(820-q*112,0,-17.9);p.g.visible=q<.98;}
      else{const T=36,q=p.t%T;let x,y=0;if(q<6){x=708;}else{const s=q-6;x=708+.9*s*s;y=Math.max(0,(x-760)*.16);}p.g.position.set(x,y,-24.3);p.g.rotation.z=y>0?.14:0;p.g.visible=x<840;}}
    if(AIR.beacon)AIR.beacon.visible=Math.sin(t*3)>0;if(AIR.trafficTick)AIR.trafficTick(dt);
    const under=player.z<-.3&&player.z>-3&&player.x>727&&player.x<795;(AIR.canopy||[]).forEach(b=>{const m=b.material;if(under&&!m.transparent){b.material=m.clone();b.material.transparent=true;b.material.opacity=.3;b.userData.mo=m;}else if(!under&&b.userData.mo){b.material=b.userData.mo;b.userData.mo=null;}});
    const n=typeof NIGHT==='number'?NIGHT:0;if(AIR._n!==n){AIR._n=n;AIR.glow.forEach(([m,d,k])=>m.color.copy(d).lerp(k,n));AIR.halos.forEach(h=>h.material.opacity=n*.85);AIR.em.forEach(m=>m.emissive.setRGB(n*1.1,n*.95,n*.7));}
    if(S.qg&&S.qg.suitcase&&AIR.case)AIR.case.visible=false;}
}
// ---------- Fremantle detail (Look Lab layer: ?lab or ?freo until FREO_DETAIL_LIVE is true) ----------
// From Paul's photos: the 1897 market hall with its striped brick gables and verandah, a two-storey hotel with lacy
// verandahs and a churro café on Cappuccino Strip, a covered walk with a secondhand bookshop, a blue fish-and-chip shed
// with three gables on the harbour, a classic car meet, trawlers and a marina breakwater, Bathers Beach with coastal
// scrub, rope fences and a beach shack, ivy-covered brick cottages, and a modern lane with a Thai kitchen and a gallery.
const FREO_DETAIL_LIVE=true;
var FHOMES_LIVE=false;const FHOMES_ON=FHOMES_LIVE||/[?&#](lab|homes)\b/.test(location.search+location.hash);let FHOME_PLANTS=[];
const FDET={on:FREO_DETAIL_LIVE||/[?&#](lab|freo)\b/.test(location.search+location.hash),g:null,hid:[],glow:[],halos:[],
  show(v){this.userShow=v;if(this.g)this.g.visible=v;this.hid.forEach(o=>o.visible=!v);if(this.cab)this.cab.forEach(([m,a,b])=>m.material=v?b:a);(this.people||[]).forEach(p=>p.visible=v);(this.cityParts||[]).forEach(p=>p.visible=v);if(this.city)this.city.visible=v;}};
if(FDET.on)(()=>{
  const G=new THREE.Group();G.name='freoDetail';scene.add(G);FDET.g=G;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o,to)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);}m.castShadow=!(o&&o.nc);m.receiveShadow=true;(to||G).add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||8);
  const paint=(w,d,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const sign=(t,bg,fg,w,h,x,y,z,ry,to)=>{const L=Array.isArray(t)?t:[t];const tex=makeSign(L,Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));m.position.set(x,y,z);if(ry)m.rotation.y=ry;(to||G).add(m);return m;};
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const r=mulberry32(1897),pick=a=>a[(r()*a.length)|0];
  // shared textures
  const brickT=rep=>tex(16,16,(x)=>{x.fillStyle='#8a3a26';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=2)for(let i=(j%4?2:0);i<16;i+=4){x.fillStyle=pick(['#a84a30','#b85a3a','#9a4028','#c2643e']);x.fillRect(i,j,3,1);}x.fillStyle='#d8c8a8';for(let j=1;j<16;j+=2)x.fillRect(0,j,16,1);},rep);
  const brickM=(rx,ry)=>new THREE.MeshLambertMaterial({map:brickT([rx,ry])});
  const oldBrickM=(rx,ry)=>new THREE.MeshLambertMaterial({map:tex(16,16,(x)=>{x.fillStyle='#b8a090';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=2)for(let i=(j%4?2:0);i<16;i+=4){x.fillStyle=pick(['#a8583e','#b86848','#c87a58','#9a4a34','#d8c4b0']);x.fillRect(i,j,3,1);}},[rx,ry])});
  const corrT=(c1,c2,rep)=>tex(8,8,(x)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?c1:c2;x.fillRect(i,0,1,8);}},rep);
  const CREAM='#efe3c4',GREENIRON='#2c4a3a';
  function lace(w,h,col){return new THREE.MeshLambertMaterial({map:tex(16,8,(x)=>{x.strokeStyle=col;x.lineWidth=1;x.beginPath();x.arc(8,8,7,Math.PI,0);x.stroke();x.beginPath();x.arc(8,8,4,Math.PI,0);x.stroke();for(let i=1;i<16;i+=3){x.fillStyle=col;x.fillRect(i,1,1,1);}x.fillRect(0,0,16,1);}),transparent:true,alphaTest:.4,side:THREE.DoubleSide});}
  function aFrame(x,z,lines,bg,fg,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry||0;G.add(g);const s=sign(lines,bg,fg||'#1b1b2b',.5,.62,0,.42,.08,0,g);s.rotation.x=-.16;put(B(.52,.66,.02),M('#1b1b2b'),0,.4,-.1,{rx:.16},g);col(x-.3,z-.2,x+.3,z+.2);}
  function lamp(x,z){put(C(.04,.06,2.6,6),M('#3a3e44'),x,1.3,z);put(C(.14,.08,.3,6),new THREE.MeshBasicMaterial({color:0xfff0c8}),x,2.65,z,{nc:1});col(x-.08,z-.08,x+.08,z+.08);}
  function wheelieBin(x,z,lid){put(B(.5,.75,.55),M('#2f6a3a'),x,.38,z);put(B(.54,.06,.6),M(lid),x,.78,z+.02,{rx:-.08});col(x-.28,z-.3,x+.28,z+.3);}
  const hide=o=>{if(o){o.visible=false;FDET.hid.push(o);}};
  const findGroup=(x,z)=>scene.children.find(o=>o.isGroup&&Math.abs(o.position.x-x)<.05&&Math.abs(o.position.z-z)<.05);
  // sprites (pixel plants and people), the same look as every other plant in the game
  const sprMat=c=>{const t=ctex(c);return{m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};};
  const bb=(v,x,z,w,h,y,tree)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,y||0,z);G.add(m);BB.push(m);if(tree)trees.push({x,z,m,v:{...v,f:v.f||v.m},fade:false});return m;};
  const bushB=()=>{const b=[];for(let i=0;i<4;i++)b.push([8+(r()-.5)*8,6+(r()-.5)*2,3.5+r()*2]);return b;};
  const SCRUB=[['#3c4a36','#55664a','#73845f','#9aa98a'],['#46553a','#61724c','#80915f','#a8b582'],['#4a5852','#64746a','#86958a','#b0bcae']];
  const scrub=SCRUB.map(p=>sprMat(canopy(16,10,bushB(),p,r,null)));
  const hedgeS=[0,1].map(k=>sprMat(canopy(16,10,bushB(),TREE_COLS[k],r,null)));
  const geranium=sprMat((()=>{const c=canopy(16,10,bushB(),TREE_COLS[1],r,null),x=c.getContext('2d');for(let i=0;i<9;i++){const fx=2+r()*12|0,fy=1+r()*5|0;if(!x.getImageData(fx,fy,1,1).data[3])continue;x.fillStyle=i%3?'#d8323a':'#f04a5a';x.fillRect(fx,fy,1,1);}return c;})());FHOME_PLANTS=[geranium].concat(hedgeS);
  const ficus=sprMat(canopy(32,44,(()=>{const b=[];for(let i=0;i<8;i++)b.push([16+(r()-.5)*16,13+(r()-.5)*12,6+r()*5]);return b;})(),['#3e6a2a','#5a8a34','#7aac46','#a8d066'],r,[14,24]));
  const ivy=sprMat(canopy(24,14,(()=>{const b=[];for(let i=0;i<7;i++)b.push([12+(r()-.5)*18,5+(r()-.5)*4,3+r()*2.5]);return b;})(),['#25502a','#356a34','#4a8440','#6aa050'],r,null));
  const palmC=(()=>{const W=24,H=48,c=mk(W,H),x=c.getContext('2d');for(let y=15;y<H;y++){const w=3+(y>H-4?1:0);for(let i=0;i<w;i++){x.fillStyle=(y%3===0)?'#5a4a38':i===0?'#5e503c':i===w-1?'#6e604c':'#8a7a62';x.fillRect(12-(w>>1)+i,y,1,1);}}
    x.fillStyle='#6a5a40';x.fillRect(10,13,4,3);const FR=TREE_COLS[1];for(let k=0;k<12;k++){const a=-Math.PI+k/11*Math.PI,len=8+r()*3;for(let t=0;t<=1;t+=.06){const px=12+Math.cos(a)*len*t,py=14+Math.sin(a)*len*t*.55+t*t*7*Math.abs(Math.cos(a))+(Math.abs(Math.cos(a))<.3?-t*3:0);x.fillStyle=FR[t<.2?0:t>.7?3:1+(k%2)];x.fillRect(Math.round(px),Math.round(py),1,1);if(t>.25&&t<.8){x.fillStyle=FR[0];x.fillRect(Math.round(px),Math.round(py)+1,1,1);}}}return c;})();
  const palm=sprMat(palmC);FDET.palm=palm;FDET.bb=bb;
  const person=(v,x,z,face)=>{const m=spriteMesh(humanFrames(v),.95,1.58);m.position.set(x,0,z);if(face)m.scale.x=face;scene.add(m);blob(.8).position.set(x,.03,z);FDET.people=(FDET.people||[]);FDET.people.push(m);return m;};

  // ===== 1. the market hall (1897): striped brick and cream, two gables, a verandah with sign panels and lacy iron =====
  {hide(findGroup(309.5,16.6));
    const x0=312.25,z0=16.5,W=11.5,D=3.8,H=3.6,zf=z0+D/2;
    put(B(W,H,D),brickM(6,2),x0,H/2,z0);
    [1.0,2.35,3.45].forEach(y=>put(B(W+.06,.16,D+.06),M(CREAM),x0,y,z0,{nc:1}));
    // striped piers at the corners and between the bays
    for(const px of[-W/2,-W/2+3.1,W/2-3.4,W/2]){for(let i=0;i<9;i++)put(B(.42,.42,.42),M(i%2?'#a84a30':CREAM),x0+px,.21+i*.42,zf-.1);put(B(.5,.3,.5),M(CREAM),x0+px,3.95,zf-.1);put(B(.3,.35,.3),M(CREAM),x0+px,4.25,zf-.1);}
    // arched windows above the verandah
    for(let i=0;i<5;i++){const wx=x0-W/2+1.4+i*2.2;put(B(.5,.7,.05),M('#3a3a40'),wx,2.95,zf+.01,{nc:1});put(C(.25,.25,.05,10,1),M('#3a3a40'),wx,3.3,zf+.01,{rx:Math.PI/2,nc:1});}
    function gable(gx,w,hh,label,year){const sh=new THREE.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(w/2,hh*.45);sh.lineTo(w*.28,hh*.45);sh.lineTo(0,hh);sh.lineTo(-w*.28,hh*.45);sh.lineTo(-w/2,hh*.45);sh.lineTo(-w/2,0);
      const g=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.4,bevelEnabled:false}),brickM(2,1));g.position.set(gx,H,zf-.45);g.castShadow=true;G.add(g);
      put(B(w+.1,.14,.46),M(CREAM),gx,H+hh*.45,zf-.25,{nc:1});[-1,1].forEach(s=>{for(let i=0;i<4;i++)put(B(.36,.3,.36),M(i%2?'#a84a30':CREAM),gx+s*w/2,H+.15+i*.3,zf-.2);put(B(.42,.18,.42),M(CREAM),gx+s*w/2,H+1.3,zf-.2);});
      sign(label,'#f2ead8','#7a2a20',w*.62,.42,gx,H+.62,zf-.02);if(year)sign(year,CREAM,'#7a2a20',.6,.22,gx,H+hh*.62,zf-.02);
      for(let i=0;i<3;i++)put(B(.22,.32,.05),M('#3a3a40'),gx-.45+i*.45,H+hh*.62-(year?.36:0),zf-.02,{nc:1});}
    gable(x0-W/2+1.55,2.6,2.2,'FREMANTLE','1897');gable(x0+W/2-1.7,3,2.5,'MARKETS',null);
    // verandah: a curved corrugated roof, a band of sign panels, green iron posts and lace
    const vz=zf+1.25;const roofM=new THREE.MeshLambertMaterial({map:corrT('#b86a5a','#c87e6a',[W*2,1]),side:THREE.DoubleSide});
    const curve=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.3,W+.4,14,1,true,0,Math.PI/2),roofM);curve.rotation.z=Math.PI/2;curve.rotation.x=-Math.PI/2;curve.position.set(x0,2.15,zf-.05);curve.castShadow=true;G.add(curve);
    const words=['SINCE 1897','THE MARKETS','MARKET OPEN','FRIDAY','SATURDAY','SUNDAY','HOLIDAYS'];
    const PW=words.map(w=>w.length*5+10),TW=PW.reduce((a,b)=>a+b,0);const band=tex(TW,10,(x,Wd,Hd)=>{x.fillStyle='#2c3a32';x.fillRect(0,0,Wd,Hd);x.font='bold 7px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';let ox=0;words.forEach((w,i)=>{x.fillStyle=CREAM;x.fillRect(ox+2,1,PW[i]-4,8);x.fillStyle='#8a2a20';x.fillText(w,ox+PW[i]/2,5.5);ox+=PW[i];});});
    const bandM=new THREE.Mesh(new THREE.PlaneGeometry(W+.4,.34),new THREE.MeshLambertMaterial({map:band}));bandM.position.set(x0,2.0,vz+.03);G.add(bandM);put(B(W+.4,.06,.08),M('#2c3a32'),x0,2.2,vz);put(B(W+.4,.06,.08),M('#2c3a32'),x0,1.81,vz);
    const lm=lace(1,.5,'#d8b860');for(let i=0;i<=7;i++){const px=x0-W/2-.1+i*(W+.2)/7;put(C(.05,.06,1.82,6),M(GREENIRON),px,.91,vz);put(C(.09,.09,.12,6),M(GREENIRON),px,.06,vz);if(i<7){const l=new THREE.Mesh(new THREE.PlaneGeometry((W+.2)/7-.12,.36),lm);l.position.set(px+(W+.2)/14,1.6,vz);G.add(l);}col(px-.08,vz-.08,px+.08,vz+.08);}
    // shopfront doors and boards
    for(let i=0;i<4;i++)put(B(1,1.5,.05),M(['#5a2a20','#2c3a32','#3a2a22','#2c3a32'][i]),x0-W/2+1.6+i*2.9,.75,zf+.02,{nc:1});
    aFrame(x0-2.5,zf+.9,['JEWELLERY','UPSTAIRS'],'#1d3a6e','#f6f2e8');aFrame(x0+.6,zf+.9,['MARKET','ENTRY'],'#3e7d3a','#ffd34d');aFrame(x0+1.4,zf+.95,['PIERCING','STUDIO'],'#ef9ab8','#1b1b2b');
    put(B(.42,.62,.32),M('#a82a2a'),x0+3.6,.31,zf+.25);sign('HENDERSON ST','#f6f2e8','#1b1b2b',1.1,.18,x0+W/2+.05,2.75,zf+.02);
    col(x0-W/2,z0-D/2,x0+W/2,zf);
    // a busker by the market door
    person({hair:'#2a1d1a',skin:'#e8b892',shirt:'#f6f2e8',pants:'#2a2a3a',hat:null},x0-W/2+.4,zf+.9,1);put(B(.3,.6,.1),M('#a8743a'),x0-W/2+.75,.7,zf+1,{rz:-.5});put(C(.18,.15,.3,10),M('#2a2a30'),x0-W/2+1.2,.15,zf+1.1);}

  // ===== 2. Cappuccino Strip: a two-storey corner hotel with lacy verandahs, pink awnings and café tables =====
  {const x0=312.25,z0=2.4,W=8.5,D=6,H=6.4;const yel='#d8c068',mar='#6e2a32';
    put(B(W,H,D),M(yel),x0,H/2,z0);
    for(let i=0;i<4;i++){put(B(1.2,1.6,.05),M('#3a3a40'),x0-W/2+1.3+i*2,4.2,z0+D/2+.01,{nc:1});put(C(.6,.6,.05,10,1,false,0,Math.PI),M('#3a3a40'),x0-W/2+1.3+i*2,5,z0+D/2+.01,{rx:Math.PI/2,nc:1});}
    put(B(W+.2,.3,D+.2),M('#e2cc78'),x0,H+.15,z0);for(let i=0;i<14;i++)put(B(.12,.45,.12),M('#e2cc78'),x0-W/2+.3+i*(W-.6)/13,H+.5,z0+D/2);put(B(W+.2,.12,.2),M('#e2cc78'),x0,H+.75,z0+D/2);
    {const sh=new THREE.Shape();sh.moveTo(-1.6,0);sh.lineTo(1.6,0);sh.lineTo(0,1.1);sh.lineTo(-1.6,0);const p=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.3,bevelEnabled:false}),M('#e2cc78'));p.position.set(x0+1.8,H+.8,z0+D/2-.3);G.add(p);}
    // two wrap-round verandahs (south and west), maroon posts, white balustrade, gabled ends with cream filigree
    const sides=[{ry:0,len:W,cx:x0,cz:z0+D/2+1},{ry:-Math.PI/2,len:D,cx:x0-W/2-1,cz:z0}];
    for(const S of sides){const g=new THREE.Group();g.position.set(S.cx,0,S.cz);g.rotation.y=S.ry;G.add(g);const L=S.len+2;
      put(B(L,.12,2),M('#e8dcc0'),0,3,0,null,g);put(B(L,.1,2),M(mar),0,5.6,0,null,g);
      for(let i=0;i<=Math.round(L/1.6);i++){const px=-L/2+i*L/Math.round(L/1.6);put(B(.12,5.6,.12),M(mar),px,2.8,.95,null,g);put(B(.4,.08,.1),M(CREAM),px,2.85,.95,null,g);}
      for(let i=0;i<Math.round(L*3);i++)put(B(.04,.6,.04),M('#f6f6f0'),-L/2+.1+i/3,3.35,.95,{nc:1},g);put(B(L,.06,.06),M('#f6f6f0'),0,3.66,.95,{nc:1},g);
      const fl=lace(1,.4,'#f2e6c8');const lb=new THREE.Mesh(new THREE.PlaneGeometry(L,.4),fl);lb.position.set(0,5.35,.96);g.add(lb);
      // pink awning blinds on the ground floor
      for(let i=0;i<Math.round(L/2.2);i++){const ax=-L/2+1.1+i*L/Math.round(L/2.2);put(B(L/Math.round(L/2.2)-.15,.6,.04),M('#d88a96'),ax,2.6,.93,{nc:1},g);}
      sign(['CHURRO & CO.','CHOCOLATERIA'],'#d88a96','#3a1a20',1.6,.5,-L/2+1.6,2.6,.97,0,g);sign('TAPHOUSE · CRAFT ALES','#f6f6f0','#1b1b2b',2.2,.3,-L/2+1.8,3.9,.98,0,g);
      for(let i=0;i<2;i++){const sh=new THREE.Shape();sh.moveTo(-.9,0);sh.lineTo(.9,0);sh.lineTo(0,.9);sh.lineTo(-.9,0);const p=new THREE.Mesh(new THREE.ShapeGeometry(sh),M(mar));p.position.set(-L/2+1.2+i*2.8,5.65,.96);g.add(p);const q=new THREE.Mesh(new THREE.ShapeGeometry(sh),M(CREAM));q.scale.setScalar(.75);q.position.set(-L/2+1.2+i*2.8,5.7,.97);g.add(q);}}
    // café tables under the verandah
    for(let i=0;i<4;i++){const tx=x0-W/2+1+i*2.1,tz=z0+D/2+.8;put(C(.28,.28,.04,10),M('#f6f6f0'),tx,.72,tz);put(C(.03,.05,.7,6),M('#2a2a30'),tx,.36,tz);[-.45,.45].forEach(o=>{put(B(.3,.04,.3),M('#3a2a22'),tx+o,.44,tz);put(B(.3,.36,.04),M('#3a2a22'),tx+o,.62,tz-.14);});}
    col(x0-W/2,z0-D/2,x0+W/2,z0+D/2);[[0,1],[1,1]].forEach(()=>{});
    for(const S of sides){/* posts are thin: walkers pass under the verandah */}
    person({hair:'#1a1a1a',skin:'#c8865a',shirt:'#d8c4a0',pants:'#3a3a48',hat:null},x0-2.4,z0+D/2+1.6,1);person({hair:'#f1d27a',skin:'#f1c7a0',shirt:'#f6f6f0',pants:'#2a3a5a',hat:'#f6f6f0'},x0-1.6,z0+D/2+1.7,-1);}

  // ===== 3. the covered walk on the west side of the strip: verandah, secondhand bookshop, book carts, green parasols =====
  {const vx=301.6;put(B(1.1,.08,10.5),new THREE.MeshLambertMaterial({map:corrT('#9aa4ac','#c8ccd0',[1,10])}),vx,2.4,12.2,{rz:.08});
    for(let z=7.2;z<=17.2;z+=2)put(B(.08,2.4,.08),M('#8a3a2a'),vx+.5,1.2,z);
    for(let z=7.6;z<=17;z+=.9)put(B(.08,.12,.08),M('#5a3a22'),vx,2.38,z,{nc:1});
    sign(['SECONDHAND','BOOKSHOP  ☞'],'#f2ead8','#1b1b2b',1.3,.42,vx+.15,2.05,9.3,Math.PI/2);sign(['IRISH PUB','& SHOP'],'#f2ead8','#a82a2a',1,.34,vx+.15,2.05,13.4,Math.PI/2);
    [[302.6,7.8],[302.6,16.4]].forEach(([x,z])=>{put(B(.8,.5,.45),M('#2c4a3a'),x,.45,z);for(let i=0;i<7;i++)put(B(.08,.24,.3),M(pick(['#c8344a','#2f6fb0','#e8b04a','#3e7d5c','#f6f2e8','#ef9ab8'])),x-.3+i*.1,.82,z);put(C(.06,.06,.04,8),M('#1a1a1a'),x-.3,.08,z+.2,{rz:Math.PI/2});col(x-.42,z-.25,x+.42,z+.25);});
    [[302.2,14.2],[302.2,18.2]].forEach(([x,z])=>{put(C(.03,.03,2.1,5),M('#d8dcd8'),x,1.05,z);put(new THREE.ConeGeometry(.9,.42,8),M('#2f8a4a'),x,2.15,z);});
    sign('★','#2f8a4a','#d8323a',.5,.5,vx+.2,1.7,11.3,Math.PI/2);}

  // ===== 4. Fishing Boat Harbour: the blue fish-and-chip shed with three gables, flags, a yellow fish, bins and hedges =====
  {hide(findGroup(295.4,15.6));const x0=295.4,z0=15.6,W=7,D=2.6,H=2.4;const blue=new THREE.MeshLambertMaterial({map:tex(8,8,(x)=>{for(let j=0;j<8;j++){x.fillStyle=j%2?'#244a8a':'#2a56a0';x.fillRect(0,j,8,1);}},[6,3])});
    put(B(W,H,D),blue,x0,H/2,z0);
    for(let i=0;i<3;i++){const gx=x0-W/2+W/6+i*W/3;const sh=new THREE.Shape();sh.moveTo(-W/6,0);sh.lineTo(W/6,0);sh.lineTo(0,1.3);sh.lineTo(-W/6,0);
      const gb=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:D,bevelEnabled:false}),blue);gb.position.set(gx,H,z0-D/2);gb.castShadow=true;G.add(gb);
      const L=Math.hypot(W/6,1.3);[-1,1].forEach(s=>{const rf=put(B(L+.12,.06,D+.2),new THREE.MeshLambertMaterial({map:corrT('#c8ccd0','#e2e6ea',[1,4])}),gx+s*W/12,H+.65,z0,{rz:-s*Math.atan2(1.3,W/6)});});
      const tr=new THREE.Mesh(new THREE.ShapeGeometry(sh),M('#f6f6f0'));tr.scale.set(1.04,1.04,1);tr.position.set(gx,H-.02,z0+D/2+.01);G.add(tr);const in2=new THREE.Mesh(new THREE.ShapeGeometry(sh),blue);in2.scale.set(.9,.9,1);in2.position.set(gx,H+.03,z0+D/2+.02);G.add(in2);
      put(B(.36,.36,.04),M('#f6f6f0'),gx,H+.5,z0+D/2+.04,{nc:1});put(B(.28,.28,.04),M('#3a6a3a'),gx,H+.5,z0+D/2+.06,{nc:1});}
    for(let i=0;i<4;i++)put(B(.22,.22,.04),M('#f6f6f0'),x0-2.6+i*.5,.9,z0+D/2+.02,{nc:1});for(let i=0;i<2;i++)put(B(1.1,1.2,.04),M('#e8e8e8'),x0+1.8+i*1.3,.6,z0+D/2+.02,{nc:1});
    const sc=sign("SALTY GULL'S",'#244a8a','#e8343a',3.6,.72,x0,H+.9,z0+D/2+.18);
    sign(['FISH','N CHIPS'],'#3a2a20','#7fd0f0',.9,.8,x0-W/2-.2,1.7,z0+D/2-.2,Math.PI/2);put(B(.7,2.4,.7),M('#3a2a22'),x0-W/2-.6,1.2,z0+.6);
    [x0-2.4,x0,x0+2.4].forEach((fx,i)=>{put(C(.04,.04,4.4,6),M('#e8e8ec'),fx,H+2.2,z0-.4);const f=sign('SG','#f6f6f0','#e8343a',.7,.4,fx+.38,H+4,z0-.4,0);f.rotation.z=-.15;});
    // the yellow fish on its stand
    {const g=new THREE.Group();g.position.set(x0-1.6,0,z0+D/2+1.3);G.add(g);const y=M('#f2c428'),y2=M('#d8a414');put(B(.5,1.1,.5),y2,0,.55,0,null,g);put(B(1.6,.9,.5),y,0,1.6,0,null,g);put(B(.6,.7,.45),y,-.95,1.6,0,null,g);put(B(.5,.9,.12),y2,1.05,1.6,0,{rz:.5},g);put(B(.5,.9,.12),y2,1.05,1.6,0,{rz:-.5},g);put(B(.14,.14,.52),M('#1b1b2b'),-.55,1.75,0,null,g);put(B(.4,.08,.52),M('#1b1b2b'),-.85,1.4,0,null,g);col(x0-2.1,z0+D/2+1,x0-1.1,z0+D/2+1.6);}
    for(let i=0;i<6;i++)bb(hedgeS[i%2],x0-W/2+.4+i*.55,z0+D/2+1.3+(i%2)*.15,1.1,.75);
    wheelieBin(x0+2.2,z0+D/2+.45,'#d8323a');wheelieBin(x0+2.8,z0+D/2+.45,'#e8c040');wheelieBin(x0+3.4,z0+D/2+.45,'#2f6fb0');
    col(x0-W/2,z0-D/2,x0+W/2,z0+D/2);col(x0-W/2-.95,z0+.25,x0-W/2-.25,z0+.95);}

  // ===== 5. a classic car meet on the harbour lot (one palm), marquees, and trawlers and yachts on the water =====
  {paint(8,2.8,lmat(asphC,[4,1.4]),297.5,20.1,.025);for(let i=0;i<6;i++)paint(.05,1.2,'#f6f6f0',294+i*1.4,19.5,.03);
    const CARS=['#f2c428','#e04aa8','#3a8ab0','#d8323a','#d8b878','#e8582a'];
    CARS.forEach((c,i)=>{const g=new THREE.Group();g.position.set(294.7+i*1.4,0,19.6);g.rotation.y=Math.PI/2+(i%2?.06:-.04);G.add(g);const Mc=M(c);
      put(B(1.5,.28,.66),Mc,0,.26,0,null,g);put(B(.62,.2,.58),M('#2a3a48'),-.12,.48,0,null,g);put(B(.5,.05,.6),Mc,-.12,.59,0,null,g);put(B(.4,.08,.6),Mc,.55,.42,0,{rz:-.18},g);
      [[-.5,.33],[.5,.33],[-.5,-.33],[.5,-.33]].forEach(([a,b])=>put(C(.13,.13,.08,10),M('#1a1a1a'),a,.13,b,{rx:Math.PI/2},g));put(B(.03,.07,.5),new THREE.MeshBasicMaterial({color:0xd83030}),-.76,.32,0,{nc:1},g);col(294.7+i*1.4-.38,18.8,294.7+i*1.4+.38,20.4);});
    [[293.2,21],[300.8,21]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);G.add(g);put(B(1.6,.05,1.6),M('#f6f6f0'),0,1.7,0,null,g);put(new THREE.ConeGeometry(1.15,.5,4),M('#f6f6f0'),0,1.98,0,{ry:Math.PI/4},g);[[-.75,-.75],[.75,-.75],[-.75,.75],[.75,.75]].forEach(([a,b])=>put(C(.03,.03,1.7,5),M('#c8ccd0'),a,.85,b,null,g));});
    bb(palm,302,19.6,2.2,4.4);
    person({hair:'#3a2a1a',skin:'#f1c7a0',shirt:'#1b1b2b',pants:'#2a3a5a',hat:'#d8c08a'},296.4,18.4,1);person({hair:'#1a1a1a',skin:'#e8b892',shirt:'#1b1b2b',pants:'#5a6a8a',hat:'#1b1b2b'},297,18.5,-1);
    // trawlers in the harbour
    function trawler(x,z,ry,hull){const g=new THREE.Group();g.position.set(x,-.12,z);g.rotation.y=ry;G.add(g);put(B(3.4,.7,1.2),M(hull),0,.35,0,null,g);put(B(3.4,.12,1.24),M('#f6f6f0'),0,.72,0,null,g);put(B(1.1,.8,.9),M('#f6f6f0'),.5,1.2,0,null,g);put(B(1.1,.12,.94),M('#2a3a58'),.5,1.4,0,null,g);
      put(C(.04,.04,2.2,5),M('#e8e8ec'),-.3,1.8,0,null,g);put(B(1.6,.04,.04),M('#e8e8ec'),-.6,2.4,0,{rz:.5},g);put(B(.5,.3,.4),M('#e8582a'),-1.2,.95,0,null,g);}
    trawler(281,17.8,.1,'#2f6fb0');trawler(286.2,19.4,-.15,'#1b2a4a');trawler(290.4,20.6,.25,'#f6f6f0');
    // (the harbour breakwater is built with the map changes below)
  }

  // ===== 6. the ferris wheel gets white frames and glass cabins; more Norfolk pines and a gravel walk =====
  {if(typeof wheel!=='undefined'&&wheel.userData.W){const W=wheel.userData.W;const glass=new THREE.MeshLambertMaterial({color:0xe8f2f6,transparent:true,opacity:.85});FDET.cab=W.userData.cabins.map(cb=>[cb,cb.material,glass]);FDET.cab.forEach(([cb,a,b])=>{cb.material=b;cb.scale.set(1,1.25,1);});
      const base=put(B(4.2,.5,1.6),M('#f6f6f0'),286.5,.25,9.8);const arc=new THREE.Mesh(new THREE.TorusGeometry(1.9,.08,6,16,Math.PI),M('#f6f6f0'));arc.position.set(286.5,0,10.6);arc.scale.set(1,.55,1);G.add(arc);}
    paint(1.4,9,lmat(sandC,[1,4]),284.5,9.6,.03);
    const NP2=pineVariant();[[280.6,9],[280.8,13],[296.4,8.2],[292.6,13.2]].forEach(([x,z])=>{bb(NP2,x,z,NP2.w*1.45,NP2.h*1.6,0,true);col(x-.2,z-.1,x+.2,z+.1);});
    person({hair:'#d8d4cc',skin:'#f1c7a0',shirt:'#2f6fb0',pants:'#5a6a8a',hat:null},288.4,12.6,-1);
    {const dog=pix(["..oo......","..obo.....",".obbbbbbo.","obbbbbbbbo",".obbbbbbo.","..o.o.o.o."],{o:'#3a2a1a',b:'#a8643a'});[0,1].forEach(i=>{const d=spriteMesh([dog],.55,.35);d.position.set(287.5-i*.6,0,12.9);scene.add(d);(FDET.people=FDET.people||[]).push(d);});}}

  // ===== 7. Bathers Beach (from the video): coastal scrub, a sandy path with rope fence, the wrack line and a beach shack =====
  {paint(6.4,5.4,lmat(sandC,[2,2]),277.3,11.1,.013);
    for(let z=1;z<14;z+=.7)paint(.35+r()*.25,.6,'#5a4630',274.6+r()*.3,z,.02);
    for(let z=1.5;z<13.5;z+=.55){const s=.9+r()*.6;bb(scrub[(z*3|0)%3],273.9+r()*.5,z,1.2*s,.8*s);}
    paint(1,12,lmat(sandC,[.5,4]),280.6,7.2,.028);
    for(let z=1.6;z<13.4;z+=1.2){put(C(.05,.05,.6,5),M('#8a6a48'),280,.3,z);put(C(.05,.05,.6,5),M('#8a6a48'),281.2,.3,z);}
    put(B(.02,.02,11.8),M('#d8c8a0'),280,.5,7.5,{nc:1});put(B(.02,.02,11.8),M('#d8c8a0'),281.2,.5,7.5,{nc:1});
    {const x0=276.6,z0=11.6;put(B(2.2,1.6,1.8),new THREE.MeshLambertMaterial({map:tex(8,8,(x)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#a89a84':'#bcae96';x.fillRect(i,0,1,8);}},[3,2])}),x0,.8,z0);
      put(new THREE.ConeGeometry(1.75,.8,4),M('#8a8a86'),x0,2,z0,{ry:Math.PI/4,s:[1.05,1,.85]});put(B(.6,1,.05),M('#3a2a22'),x0-.4,.5,z0+.91,{nc:1});sign('BEACH HOUSE','#3e5a6a','#f6f2e8',1.4,.24,x0+.2,1.35,z0+.92);col(x0-1.1,z0-.9,x0+1.1,z0+.9);}
    for(let i=0;i<10;i++){put(new THREE.DodecahedronGeometry(.45+r()*.25,0),i%2?M('#9a9084'):M('#b4aa9a'),271.5+i*.35,.05,1.2+Math.sin(i)*.4,{ry:r()*6,s:[1.2,.6,1]});}
    [[277,4],[278.4,8.6]].forEach(([x,z],i)=>person({hair:pick(['#3a2a1a','#f1d27a','#1a1a1a']),skin:pick(['#f1c7a0','#c8865a']),shirt:pick(['#d8323a','#2f6fb0','#f6f6f0']),pants:'#2a3a5a',hat:null},x,z,i?1:-1));}

  // ===== 8. a lane of old brick cottages with ivy, brick fences, iron gates, geraniums and a big fig =====
  {const oldM=oldBrickM(3,2);
    [[320.6,15.2],[330.2,15.2]].forEach(([x,z],k)=>{put(B(4,2.8,3.4),oldM,x,1.4,z);
      const sh=new THREE.Shape();sh.moveTo(-2.1,0);sh.lineTo(2.1,0);sh.lineTo(0,1.2);sh.lineTo(-2.1,0);const rf=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:3.6,bevelEnabled:false}),new THREE.MeshLambertMaterial({map:corrT('#a8aeb2','#c8ccd0',[6,2])}));rf.rotation.y=Math.PI/2;rf.position.set(x-1.8,2.8,z);rf.castShadow=true;G.add(rf);
      put(B(.5,.3,.5),M('#e8e8ec'),x+.6,3.3,z-.2,{nc:1});put(B(1.3,1.1,.05),M('#3a2a22'),x-.8,1,z+1.71,{nc:1});put(B(.7,1.5,.05),M('#5a2a20'),x+.9,.75,z+1.71,{nc:1});
      const iv=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.1),ivy.m);iv.position.set(x-.1+(k?.4:-.2),2.1,z+1.75);G.add(iv);
      if(!k){put(C(.06,.06,.9,8),M('#f6f6f0'),x+1.5,1.4,z+1.78,{nc:1});for(let i=0;i<5;i++)put(B(.13,.05,.13),M('#d8323a'),x+1.5,1.05+i*.18,z+1.82,{rz:.6,nc:1});}
      col(x-2,z-1.7,x+2,z+1.7);});
    // the brick fence along the street, with pillars, two iron gates and a gap to the prison gate
    const fz=18.4;[[318.6,322.6],[328,332.4]].forEach(([a,b])=>{put(B(b-a,.8,.24),oldM,(a+b)/2,.4,fz);for(let x=a;x<=b+.01;x+=2){put(B(.4,1.05,.4),oldM,x,.52,fz);put(new THREE.ConeGeometry(.3,.25,4),M('#d8c4b0'),x,1.17,fz,{ry:Math.PI/4});}
      const gx=(a+b)/2+.6;put(B(.9,.9,.04),M('#1b1b1b'),gx,.55,fz+.05,{nc:1});for(let i=0;i<5;i++)put(B(.02,.8,.06),M('#1b1b1b'),gx-.38+i*.19,.55,fz+.08,{nc:1});col(a,fz-.2,b,fz+.2);});
    for(let i=0;i<8;i++){const x=319+i*1.6+(i>3?3.6:0);bb(geranium,x,fz-.5,.9,.6);}
    bb(ficus,317.4,13.6,4.4,6,0,true);col(317.2,13.5,317.6,13.7);
    {const b=spriteMesh([pix(["....oo....oo...","...o..o..o..o..","..o....oo....o.","oo.o..o..o..o.o","..o.oo....oo..."],{o:'#3a2a3a'})],.9,.32,{shadow:false});b.position.set(318.6,0,19);scene.add(b);(FDET.people=FDET.people||[]).push(b);}}

  // ===== 9. a modern lane by Kings Square: a grey-and-black office block, a vertical sign, string lights, a Thai kitchen and a gallery =====
  {const x0=323,z0=-11.5,W=10,D=5,H=6.4;
    const gridM=new THREE.MeshLambertMaterial({map:tex(16,16,(x)=>{x.fillStyle='#d8d8d4';x.fillRect(0,0,16,16);x.fillStyle='#1b1d22';x.fillRect(2,2,12,11);x.fillStyle='#3a4250';x.fillRect(3,3,4,9);x.fillRect(9,3,4,9);x.fillStyle='rgba(255,255,255,.15)';x.fillRect(4,4,1,7);x.fillRect(10,4,1,7);},[5,3])});
    put(B(W,H,D),gridM,x0,H/2,z0);put(B(W+.1,.25,D+.1),M('#c8c8c4'),x0,H+.12,z0);
    {const g=new THREE.Group();g.position.set(x0+W/2-1.2,0,z0+D/2+.35);G.add(g);put(B(.5,4.6,.5),M('#141414'),0,3.3,0,null,g);const s=sign('HARBOUR LANE','#141414','#f6f6f0',3.6,.36,0,3.3,.26,0,g);s.rotation.z=Math.PI/2;for(let i=0;i<14;i++)put(B(.06,.06,.02),M('#f6f6f0'),-.15+(i%3)*.15,1.4+i*.3,.26,{nc:1},g);}
    {const g=new THREE.Group();g.position.set(x0-2.2,0,z0+D/2+.35);G.add(g);put(B(.4,2.6,.4),M('#141414'),0,1.3,0,null,g);sign('LANE','#f6f6f0','#141414',.7,.2,0,2.1,.21,0,g);}
    // string lights across the lane
    {const bulbM=new THREE.MeshBasicMaterial({color:0xfff2c0});for(let k=0;k<2;k++){const ax=x0-W/2+.5,bx=319.5,az=z0+D/2+.05,bz=-6.2+k*.6;for(let i=0;i<=12;i++){const t=i/12;const y=4.2-k*.6-Math.sin(t*Math.PI)*.7;put(new THREE.SphereGeometry(.06,5,4),bulbM,ax+(bx-ax)*t+k*2,y,az+(bz-az)*t,{nc:1});}}}
    // Thai kitchen kiosk with a curved orange awning
    {const kx=321,kz=-6.2;put(B(2.6,1.9,1.8),M('#2a2a2c'),kx,.95,kz);put(B(2.2,1,.05),new THREE.MeshLambertMaterial({color:0x4a3a2a,emissive:0x2a1a0a}),kx,1.3,kz+.91,{nc:1});put(B(2.6,.5,.06),M('#b8a890'),kx,.25,kz+.92,{nc:1});
      const aw=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,2.8,12,1,true,0,Math.PI),new THREE.MeshLambertMaterial({color:0xc8643a,side:THREE.DoubleSide}));aw.rotation.z=Math.PI/2;aw.rotation.y=Math.PI/2;aw.rotation.order='ZYX';aw.position.set(kx,1.95,kz+.9);aw.scale.set(1,1,.55);G.add(aw);
      sign('PASTE · THAI KITCHEN','#2a2a2c','#f6f2e8',1.8,.22,kx,.3,kz+.95);col(kx-1.3,kz-.9,kx+1.3,kz+.9);}
    // gallery boards and a palm in a steel planter
    aFrame(324.6,-6.4,['THE','GALLERY'],'#ef9ab8','#1b1b2b',-.15);aFrame(325.4,-6.3,['PAINT','WITH US!'],'#9a8ae8','#1b1b2b',.1);
    put(B(1.4,.25,1.4),M('#7a4a2a'),317.8,.12,-7.8);bb(palm,317.8,-7.8,2.4,4.8,.2);col(317.1,-8.5,318.5,-7.1);
    col(x0-W/2,z0-D/2,x0+W/2,z0+D/2);
    person({hair:'#f1d27a',skin:'#f1c7a0',shirt:'#1b1b2b',pants:'#1b1b2b',hat:null},322.4,-4.9,1);}

  // ===== street furniture on High St and the strip =====
  [[287,-.7],[297,-.7],[306.4,-.7],[306.4,12]].forEach(([x,z])=>lamp(x,z));
  wheelieBin(299.2,-.7,'#d8323a');
})();
