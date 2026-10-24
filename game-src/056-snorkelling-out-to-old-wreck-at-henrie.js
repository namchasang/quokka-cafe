// ----- snorkelling out to the old wreck at Henrietta Rocks -----
const WRECK_ART={anchor:(x,a,b)=>{x.strokeStyle='#5a4a3a';x.lineWidth=6;x.beginPath();x.moveTo(a,b-26);x.lineTo(a,b+14);x.stroke();x.beginPath();x.arc(a,b-4,20,.3,Math.PI-.3);x.stroke();x.beginPath();x.moveTo(a-10,b-20);x.lineTo(a+10,b-20);x.stroke();x.fillStyle='#5a4a3a';x.beginPath();x.arc(a,b-30,5,0,6.283);x.fill();},
  porthole:(x,a,b)=>{x.fillStyle='#a8742a';x.beginPath();x.arc(a,b,15,0,6.283);x.fill();x.fillStyle='#2a5a6a';x.beginPath();x.arc(a,b,10,0,6.283);x.fill();x.fillStyle='rgba(255,255,255,.35)';x.fillRect(a-6,b-6,5,3);},
  boiler:(x,a,b)=>{x.fillStyle='#7a4a2e';x.fillRect(a-40,b-22,80,44);x.fillStyle='#8a5a36';x.beginPath();x.ellipse(a+40,b,10,22,0,0,6.283);x.fill();x.fillStyle='#5a3a26';for(let i=0;i<5;i++)x.fillRect(a-34+i*16,b-22,3,44);x.fillStyle='rgba(60,120,60,.45)';x.fillRect(a-40,b-22,80,8);},
  bell:(x,a,b)=>{x.fillStyle='#8a7a3a';x.beginPath();x.moveTo(a-12,b+10);x.quadraticCurveTo(a-11,b-12,a,b-14);x.quadraticCurveTo(a+11,b-12,a+12,b+10);x.closePath();x.fill();x.fillStyle='rgba(70,120,90,.6)';x.fillRect(a-12,b+2,24,5);x.fillStyle='#5a4a20';x.beginPath();x.arc(a,b+12,3,0,6.283);x.fill();},
  wrasse:(x,a,b,t)=>REEF_ART.wrasse(x,a,b,t)};
function wreckDive(){const W=wcS(),q=SIDEQ.find(s=>s.id==='bell'),want=q&&sqStep(q)===1;
  const T=[{id:'boiler',name:'Ship’s boiler',x:330,y:300,r:44,fact:'Boiler · the big iron heart of an old steamship, the part of a wreck that lasts longest.'},{id:'anchor',name:'Anchor',x:520,y:312,r:28,fact:'Anchor · still lying where the ship came to rest on the reef.'},
    {id:'porthole',name:'Brass porthole',x:150,y:282,r:22,fact:'Porthole · brass doesn’t rust, so it still shines a little after all these years.'},{id:'wrasse',name:'Western king wrasse',x:240,y:180,r:20,pos:t=>[240+Math.sin(t*.4)*60,180+Math.sin(t)*8],fact:'Wrasse · wrecks become reefs, and fish move right in.'}];
  if(want)T.push({id:'bell',name:'Ship’s bell',x:430,y:262,r:20,fact:'The bell! Green with age, half buried in sand, right where Nev said.'});
  const hull=(x,t)=>{x.fillStyle='rgba(90,60,40,.75)';x.beginPath();x.moveTo(60,330);x.lineTo(110,250);x.lineTo(560,240);x.lineTo(600,330);x.closePath();x.fill();x.strokeStyle='rgba(60,40,26,.8)';x.lineWidth=6;for(let i=0;i<9;i++){x.beginPath();x.moveTo(120+i*52,330);x.lineTo(130+i*52,236-(i%3)*8);x.stroke();}};
  const base=reefDraw(71,[]);
  spotOpen({eye:'Snorkelling · Henrietta Rocks wreck',title:want?'Find the ship’s bell, and 4 more':'Explore the wreck: find 4 things',hint:'The old wreck sits on the reef off Henrietta Rocks. Look closely around the hull.',targets:T,
    draw:(x,t)=>{base(x,t);hull(x,t);T.forEach(q=>{const p=spotPos(q,t);WRECK_ART[q.id](x,p[0],p[1],t);});},hintAt:18,doneTitle:'Wreck explored!',
    done:()=>{if(!W.wreck){W.wreck=1;S.coins+=30;toast('Wreck diver · +30 coins',2.4);}if(want){W.bell=1;$('#spHint').textContent='Kip takes a photo of the bell for Nev. It stays on the reef, where it belongs.';}}});}
function wcTargets(T){if(!WC.ready||zoneOf(player.x)!=='island')return;WC.acts.forEach(a=>T.push(a));}
const WC_SPOT=k=>()=>WC[k]?[[WC[k].x,WC[k].z]]:[];
[['bigsalmon','Salmon Bay','place',4.5,WB_SPOT('bigsalmon')],['wreck','Henrietta Rocks wreck','place',5],['sealdeck','Seal viewing deck','place',3.2],['pups','Seal pups','animal',4],['boardwalk','West End boardwalk','place',3.4],['osprey','Osprey nest','animal',4.5],
 ['nev','Nev the old diver','people',2.4],['dani','Ranger Dani','people',2.4]].forEach(([id,name,cat,r,pos])=>PCS.push({id,name,zone:'island',cat,pos:pos||WC_SPOT(id),r}));
PC_TOTAL=PCS.filter(p=>!isSpecial(p.cat)).length;
Object.assign(PC_HINTS,{bigsalmon:'Salmon Bay · the long sandy bay on the south coast',wreck:'Henrietta Rocks wreck · the rusty boiler out on the reef',sealdeck:'Seal viewing deck · above Cathedral Rocks at the west end',pups:'Seal pups · on the rocks below the seal deck',
 boardwalk:'West End boardwalk · the long wooden walk to Cape Vlamingh',osprey:'Osprey nest · the big stick nest on a sea stack near the cape',nev:'Nev · the old diver at Henrietta Rocks',dani:'Ranger Dani · on the seal viewing deck'});
SIDEQ.push(
 {id:'bell',zone:'island',mood:'heart',title:'The Bell on the Reef',giver:'Nev the old diver',coins:55,desc:'Nev dived the Henrietta Rocks wreck every summer for forty years. His knees won’t let him now, but he’d love to know the ship’s bell is still down there.',
  steps:[{l:'Talk to Nev at Henrietta Rocks',at:'pc:nev',say:[{who:'Nev',text:'First time I saw that bell I was sixteen. Green as a gum leaf, half in the sand by the anchor.'},{who:'Nev',text:'Can’t get out there any more. Would you snorkel out and see if she’s still there? Just look. Leave her be.'}]},
   {l:'Snorkel to the wreck and find the bell',at:'pc:wreck',chk:()=>!!wcS().bell,say:['Kip: Found it. Still there, still green, with a little wrasse living underneath.']},
   {l:'Show Nev the photo',at:'pc:nev',say:[{who:'Nev',text:'There she is. Fifty years and she hasn’t moved an inch. Better than me, eh?'},{who:'Nev',text:'Thanks, Kip. That’s made my whole summer.'}]}],
  outro:'Nev printed the photo and stuck it on his fridge, next to one of himself at sixteen.'},
 {id:'sealhat',zone:'island',mood:'funny',title:'Hat Overboard',giver:'Ranger Dani',coins:40,desc:'A gust at the seal deck took Dani’s ranger hat. A seal had a sniff, a gull had a go, and now nobody knows where it went.',
  steps:[{l:'Talk to Ranger Dani at the seal deck',at:'pc:dani',say:[{who:'Ranger Dani',text:'Wind took my hat right off my head. It bounced off a seal. The seal looked very offended.'},{who:'Ranger Dani',text:'Then a gull grabbed it and flew off towards the boardwalk. My one job is to look official!'}]},
   {l:'Look for the hat along the West End boardwalk',at:'pc:boardwalk',say:['Kip: There it is, on the boardwalk. Being worn by a quokka. It fits perfectly.','Kip: The quokka swaps it for a leaf. Fair trade.']},
   {l:'Bring the hat back to Dani',at:'pc:dani',say:[{who:'Ranger Dani',text:'My hat! It smells like quokka now. I’m keeping it like that. It’s official.'}]}],
  outro:'Dani now wears a chin strap. The quokka has been seen looking at it, wistfully.'});
islandLate(()=>{const R=srand(808);
  // Salmon Bay: a fishing rock on the point, and Nev is not here (he's at Henrietta)
  {const b=WB.bigsalmon;if(b){const p=[b.x+8*.92,b.cz+.6];let z=p[1];while(landD(p[0],z)<.9&&Math.abs(z-b.cz)<5)z-=b.sd*.2;FISH_SPOTS.push({x:p[0],z,zone:'island',name:'Salmon Bay rocks'});
    const sg=islFindSite(b.x+3.5,b.z-b.sd*1.2,.3,.3,{path:.5,land:.6},3);if(sg)signPost(sg[0],sg[1],makeSign(['SALMON BAY','SWIM · SNORKEL · FISH'],64,20,'#2f78a8','#ffffff'),1.4,.5);
    [-5,-3,3.5].forEach((o,k)=>{const ux=b.x+o,uz=b.z+b.sd*.4;if(landD(ux+.6,uz+b.sd*.3)>.4)wbTowel(ux+.6,uz+b.sd*.3,['#f1c64a','#c85ab0','#e8734a'][k],.25*(k-1));});}}
  // Henrietta Rocks: a rusty wreck on the reef, and Nev on the beach
  {const H=XPL.stops.find(s=>s.id==='henrietta');const cz=wbCoastZ(H.x,H.z,1);const wx=H.x+2,wz=cz+6.5;const g=new THREE.Group();const rust=waM('#7a4a2e'),dk=waM('#5a3a26');
    const bo=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,2.6,12),rust);bo.rotation.z=Math.PI/2;bo.rotation.y=.4;bo.position.y=.15;g.add(bo);
    for(let i=0;i<6;i++){const r=new THREE.Mesh(new THREE.BoxGeometry(.14,.9+R()*.6,.14),dk);r.position.set(-2.6+i*1.05,.1,1.1+Math.sin(i)*.2);r.rotation.z=(R()-.5)*.5;g.add(r);const r2=r.clone();r2.position.z=-1.1;g.add(r2);}
    const kl=new THREE.Mesh(new THREE.BoxGeometry(6,.2,.3),dk);kl.position.y=-.05;g.add(kl);const st=new THREE.Mesh(new THREE.BoxGeometry(.5,1.4,1.6),rust);st.position.set(2.8,.3,0);st.rotation.z=-.3;g.add(st);
    g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.position.set(wx,-.2,wz);g.rotation.y=.25;scene.add(waMark(g));wbRocks(wx-3,wz+.5,6,R);wbRocks(wx+3.5,wz-.4,5,R);WC.wreck={x:wx-1,z:cz+.3};
    let bz=cz-.4;while(landD(H.x,bz)<.9&&bz>H.z)bz-=.2;WC.acts.push({x:H.x+1,z:bz,r:1.8,label:'Snorkel out to the wreck',act:()=>{if(overlay)return;say(['Kip pulls on a mask and fins and swims out over the reef towards the rusty boiler…'],()=>wreckDive());}});
    const sg=islFindSite(H.x-1.5,bz-1.2,.3,.3,{path:.5,land:.6},3);if(sg)signPost(sg[0],sg[1],makeSign(['HENRIETTA ROCKS','WRECK · 80 M OUT'],64,20,'#7a4a2e','#f5ecd8'),1.4,.5);
    const lp=islFindSite(H.x+3.5,bz-1,.4,.4,{path:.4,land:.6},4)||[H.x+3.5,bz-1];WC.nev={x:lp[0],z:lp[1]};
    waNPC('nev','Nev',{hair:'#e8e4dc',skin:'#c8865a',shirt:'#2f78a8',pants:'#c9b68a',hat:'#f3e2b0'},lp[0],lp[1],()=>[{who:'Nev',text:pick(['The reef out there has sunk more ships than I’ve had hot dinners. Old sailors called this coast a graveyard.','A wreck is a reef with a story. The fish don’t care about the story. They just like the shade.','Swim out on a calm morning. The water’s like glass and you can see every rivet.'])}]);}
  // Cathedral Rocks: more seals, a viewing deck with a viewer
  {const sl=WEST.seals||[];if(sl.length){const sx=sl.reduce((a,s)=>a+s.m.position.x,0)/sl.length,sz=sl.reduce((a,s)=>a+s.m.position.z,0)/sl.length;
    [[-1.4,.9,.6],[1.6,-.6,1],[.4,1.6,.55],[2.6,.8,1]].forEach(([dx,dz,s],i)=>{const m=sl[i%sl.length].m.clone();m.position.set(sx+dx,.25,sz+dz);m.scale.set((i%2?-1:1)*s,s,1);scene.add(m);m.__wa=1;BB.push(m);});WC.pups={x:sx,z:sz-2.5};
    let dx=sx,dz=sz;const cx=IWx(80,0),c0=IWz(80,0);for(let i=0;i<80&&landD(dx,dz)<2;i++){const vx=cx-dx,vz=c0-dz,d=Math.hypot(vx,vz)||1;dx+=vx/d*.3;dz+=vz/d*.3;}
    const p=islFindSite(dx,dz,1.6,1,{path:.3,land:1.2},5);if(p){islClear(p[0]-1.8,p[1]-1.2,p[0]+1.8,p[1]+1.2);const d=box(3.2,.16,2,lmat(deckC,[3,2]),p[0],.12,p[1],{noCast:true});d.__wa=1;
      const sgn=Math.sign(sz-p[1])||1;for(let i=0;i<=10;i++){const q=box(.06,.7,.06,fenceMat,p[0]-1.5+i*.3,.5,p[1]+sgn*.95);q.__wa=1;}const rl=box(3.1,.06,.06,fenceMat,p[0],.84,p[1]+sgn*.95);rl.__wa=1;
      const vp=box(.08,1,.08,legMat,p[0]+.9,.6,p[1]+sgn*.5);vp.__wa=1;const vb=new THREE.Group();[-.09,.09].forEach(o=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.3,8),waM('#2a2a30'));t.rotation.x=Math.PI/2;t.position.set(o,0,0);vb.add(t);});vb.position.set(p[0]+.9,1.15,p[1]+sgn*.5);scene.add(waMark(vb));
      waSign(p[0]-1.9,p[1]-sgn*.6,['SEAL VIEWING','CATHEDRAL ROCKS'],'#3a2a20','#f5ecd8',1.3);WC.sealdeck={x:p[0],z:p[1]-sgn*2};
      WC.acts.push({x:p[0]+.9,z:p[1],r:1.3,label:'Look through the seal viewer',act:()=>{if(overlay)return;sealView();}});
      const dp=[p[0]-1,p[1]-sgn*1.6];WC.dani={x:dp[0],z:dp[1]};waNPC('dani','Ranger Dani',{hair:'#d8a050',skin:'#f1c7a0',shirt:'#5a6a3a',pants:'#c9b68a',hat:'#7a6a4a'},dp[0],dp[1],()=>[{who:'Ranger Dani',text:pick(['These are New Zealand fur seals. They come here to rest, so we watch quietly from up here.','Count the pups if you can. We send the numbers to the seal scientists.','Fun fact: their whiskers can feel a fish swimming nearby in the dark.'])}]);}}}
  // West End boardwalk from the bus stop out to the lookout, with plaques; an osprey nest on a sea stack
  {const W0=XPL.stops.find(s=>s.id==='west');const lk=IW(97.4,.4);const a=[W0.x+1.4,W0.z],b=[lk.x-4.5,lk.z];const L=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);const n=Math.floor(L/1.6);let ok=0;
    for(let i=0;i<n;i++){const t=(i+.5)/n,x=lerp(a[0],b[0],t),z=lerp(a[1],b[1],t);if(landD(x,z)<1.2)continue;ok++;const d=box(1.62,.12,1.3,lmat(deckC,[1,1]),x,.13,z,{noCast:true});d.rotation.y=-ang;d.__wa=1;
      if(i%2===0)[-.7,.7].forEach(o=>{const px=x-Math.sin(ang)*o,pz=z+Math.cos(ang)*o;const q=box(.06,.6,.06,fenceMat,px,.45,pz);q.__wa=1;const r=box(1.6,.05,.05,fenceMat,px,.72,pz);r.rotation.y=-ang;r.__wa=1;});}
    if(ok){const m=[lerp(a[0],b[0],.5),lerp(a[1],b[1],.5)];WC.boardwalk={x:m[0],z:m[1]+1.6};
      [[.3,'Limestone heath','Low, tough shrubs grow out here. Salt wind keeps them short, and quokkas nibble the new leaves.'],[.72,'The west end','The island’s far end faces the open Indian Ocean. Next stop west: Africa, about 7,000 km away.']].forEach(([t,h,txt])=>{const x=lerp(a[0],b[0],t);let z=lerp(a[1],b[1],t)-1.3;if(!islSiteOK(x,z,.3,.3,{path:.3,land:.8,pad:.1})){z+=2.6;if(!islSiteOK(x,z,.3,.3,{path:.3,land:.8,pad:.1}))return;}signPost(x,z,makeSign([h.toUpperCase()],56,12,'#3a2a20','#f5ecd8'),1.2,.3);WC.acts.push({x,z:z+.6,r:1.1,label:'Read the plaque: '+h,act:()=>say([{who:h,text:txt}])});});}
    // the binoculars at the lookout
    const vx=lk.x-1,vz=lk.z+.6;const vp=box(.08,1,.08,legMat,vx,.6,vz);vp.__wa=1;const vb=new THREE.Group();[-.09,.09].forEach(o=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.3,8),waM('#c8a040'));t.rotation.x=Math.PI/2;t.position.set(o,0,0);vb.add(t);});vb.position.set(vx,1.15,vz);scene.add(waMark(vb));col(vx-.08,vz-.08,vx+.08,vz+.08);
    WC.acts.push({x:vx,z:vz+.7,r:1.2,label:'Use the lookout binoculars',act:()=>{if(overlay)return;lookoutWatch();}});
    // osprey nest: a limestone stack just offshore, with a nest of sticks on top
    let ox=lk.x+2,oz=lk.z-5;for(let i=0;i<40&&landD(ox,oz)>-1.5;i++)oz-=.3;const st=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.3,3.2,7),limeMat);st.position.set(ox,1.2,oz);st.castShadow=true;scene.add(st);st.__wa=1;
    const ns=new THREE.Mesh(new THREE.CylinderGeometry(.75,.55,.35,9),waM('#6a4a2a'));ns.position.set(ox,2.95,oz);scene.add(ns);ns.__wa=1;const bd=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),waM('#f2efe6'));bd.position.set(ox+.1,3.25,oz);bd.scale.set(1,1.2,.8);scene.add(bd);bd.__wa=1;
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.12,6,5),waM('#3a2e26'));hd.position.set(ox+.18,3.5,oz);scene.add(hd);hd.__wa=1;WC.osprey={x:ox,z:oz+3};}
  WC.ready=true;});
