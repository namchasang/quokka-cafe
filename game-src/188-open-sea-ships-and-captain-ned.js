// ---------- The open sea round Rottnest: ships at the four corners, bird-marked rare fishing spots, Captain Ned's hidden quest ----------
// Paul (13 Nov 2026): more sea to drive the boat and fish in; an oil tanker or a super yacht anchored in each far corner; rare
// fishing spots; a side quest that can only be found by taking the boat out. The quest starts from a message in a bottle far out
// at sea and stays hidden in the quest list until the bottle is found. All names are fictional.
const SHIPS={list:[],hit(x,z){for(const s of this.list){const dx=x-s.x,dz=z-s.z,c=Math.cos(s.h),n=Math.sin(s.h),u=dx*c+dz*n,v=-dx*n+dz*c;if(Math.abs(u)<s.L/2+1.2&&Math.abs(v)<s.W/2+1)return true;}return false;}};
const OPENSEA={spots:[],bottle:null,secret:null};
SIDEQ.push({id:'ned',zone:'island',mood:'heart',hidden:true,title:'Captain Ned’s Last Voyage',giver:'A message in a bottle',coins:300,
  desc:'A bottle bobbing far out at sea holds a letter from Captain Ned, who ran the island ferry for fifty years. He asks whoever finds it to carry a goodbye to the four old shipmates anchored at the far corners of the sea.',
  steps:[{l:'Read the message in the bottle',at:[0,0],say:['Kip fishes a green glass bottle out of the water. Inside is a rolled-up letter, dry as toast.',{who:'Captain Ned (letter)',text:'To whoever finds this: I ran the ferry to this island for fifty years. My knees have retired, so I am retiring too.'},{who:'Captain Ned (letter)',text:'Four old shipmates of mine sit at anchor in the far corners of this sea. I never said goodbye. Would you say it for me? Start with Rosa, on the yacht Silver Gull.'}]},
   {l:'Find Rosa on the super yacht Silver Gull',at:[0,0],say:[{who:'Rosa (yacht chef)',text:'Ned? Ned wrote to me? He taught me to tie a bowline when I was twelve. Then he ate every scone I ever baked.'},{who:'Rosa (yacht chef)',text:'Tell him the oven is still warm. And go see Bluey on the tanker Southern Star. He owes Ned twenty dollars since 1989.'}]},
   {l:'Find Bluey on the tanker Southern Star',at:[0,0],say:[{who:'Bluey (engineer)',text:'Twenty dollars? Ha! Here, put it in his hand yourself. Ned pulled me out of the harbour once. I was showing off.'},{who:'Bluey (engineer)',text:'Next is Mrs Pemberton on the Coral Dream. Mind her poodle. It bites captains.'}]},
   {l:'Find Mrs Pemberton on the super yacht Coral Dream',at:[0,0],say:[{who:'Mrs Pemberton',text:'Edward Ned Morrow. He carried my wedding cake across in a storm and did not drop a crumb. I have never trusted another man with cake.'},{who:'Mrs Pemberton',text:'The last one is his son, Tom, captain of the Indian Dawn. They have not spoken in years. Go gently.'}]},
   {l:'Find Tom on the tanker Indian Dawn',at:[0,0],say:[{who:'Tom (captain)',text:'Dad wrote? To everyone but me, I suppose. …No. He sent you last on purpose. He always saved the hardest job for the end.'},{who:'Tom (captain)',text:'I will call him tonight. And here, he always said his best fishing spot was his secret. I am done keeping secrets. I have marked it on your map.'}]}],
  outro:'Captain Ned’s secret spot is marked on the far sea. They say the ghost marlin lives there.'});
(function(){
  const sqOpen0=sqOpen;sqOpen=function(q){if(q.hidden&&!(S.sqFound&&S.sqFound[q.id]))return false;return sqOpen0(q);};
  const sqQ0=sqQuests;sqQuests=function(){return sqQ0().filter(r=>{const q=SIDEQ.find(x=>'sq_'+x.id===r.id);return!(q&&q.hidden&&!(S.sqFound&&S.sqFound[q.id]));});};
  const M=c=>new THREE.MeshLambertMaterial({color:c}),add=(g,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
  // a hull: a box with a pointed bow, from an extruded outline (length along x, bow at +x)
  function hull(L,W,H,m){const s=new THREE.Shape(),b=L/2,a=-L/2;s.moveTo(a,-W/2);s.lineTo(b-W*.9,-W/2);s.quadraticCurveTo(b,-W*.35,b,0);s.quadraticCurveTo(b,W*.35,b-W*.9,W/2);s.lineTo(a,W/2);s.lineTo(a,-W/2);
    const g=new THREE.ExtrudeGeometry(s,{depth:H,bevelEnabled:false});g.rotateX(-Math.PI/2);return new THREE.Mesh(g,m);}
  function tanker(name,col){const g=new THREE.Group(),L=44,W=8;const lo=hull(L,W,1.6,M('#7a2a22'));lo.position.y=-1.2;g.add(lo);const hi=hull(L,W,2.2,M(col));hi.position.y=.4;g.add(hi);
    add(g,new THREE.BoxGeometry(L-10,.12,W-.6),M('#5b6b4a'),-1,2.62,0);/* deck */for(let k=0;k<5;k++)add(g,new THREE.CylinderGeometry(.18,.18,L-14,6),M('#c8b070'),-2,2.9,-2.4+k*1.2).rotation.z=Math.PI/2;
    for(let k=0;k<4;k++){const r=add(g,new THREE.BoxGeometry(5.6,1.5,W-1.6),M('#f2f0ea'),-L/2+4.4,3.4+k*1.5,0);r.scale.x=1-k*.08;}add(g,new THREE.BoxGeometry(5.8,.4,W-1.2),M('#2a3140'),-L/2+4.6,7.7,0);
    for(let k=0;k<4;k++)add(g,new THREE.BoxGeometry(.06,.5,W-2),M('#2b3a4c'),-L/2+7.25,3.9+k*1.5,0);/* bridge windows */
    add(g,new THREE.CylinderGeometry(.9,1.1,3.2,10),M('#c8344a'),-L/2+2,9.2,0);add(g,new THREE.CylinderGeometry(.92,.92,.5,10),M('#1d1d24'),-L/2+2,10.7,0);
    add(g,new THREE.CylinderGeometry(.08,.08,4,5),M('#d8d8d0'),L/2-4,4.6,0);/* fore mast */g.userData={name,L,W,kind:'tanker'};return g;}
  function yacht(name,col){const g=new THREE.Group(),L=26,W=5.4;const lo=hull(L,W,1.4,M('#1b2a3a'));lo.position.y=-.9;g.add(lo);const hi=hull(L,W,1.3,M('#f6f6f2'));hi.position.y=.5;g.add(hi);
    add(g,new THREE.BoxGeometry(L-4,.08,W-.4),M('#c79a62'),-1,1.82,0);/* teak deck */
    [[16,1.5,2.6],[12,1.3,3.9],[7.5,1.1,5]].forEach(([l,h,y],k)=>{add(g,new THREE.BoxGeometry(l,h,W-1-k*.6),M('#fbfbf8'),-2-k*1.2,y,0);add(g,new THREE.BoxGeometry(l+.05,h*.42,W-.95-k*.6),M('#22303e'),-2-k*1.2,y+.05,0);});
    add(g,new THREE.BoxGeometry(5,.1,W-2.6),M(col),-4.6,5.6,0);/* sun deck canopy */add(g,new THREE.CylinderGeometry(.06,.06,2.2,5),M('#dcdcd6'),-3,6.5,0);add(g,new THREE.SphereGeometry(.45,10,8),M('#f6f6f2'),-3,7.7,0);
    add(g,new THREE.BoxGeometry(2.2,.4,1.6),M('#6aaed6'),-L/2+3.2,1.95,0);/* jacuzzi */g.userData={name,L,W,kind:'yacht'};return g;}
  // a bird-marked fishing spot: an orange buoy with gulls wheeling over a dark patch of fish
  function birds(){const g=new THREE.Group(),bm=new THREE.MeshBasicMaterial({color:0xf4f4f0,side:THREE.DoubleSide});for(let k=0;k<4;k++){const b=new THREE.Group();[-1,1].forEach(sd=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.55,.16),bm);w.position.x=sd*.26;w.rotation.z=sd*.35;b.add(w);});b.userData={a:k*1.57,r:2+k*.4,y:3+k*.35};g.add(b);}return g;}
  function build(){const SB=seaBounds(),IN=26,cx=[SB.x1+IN,SB.x2-IN],cz=[SB.z1+IN,SB.z2-IN];
    const at=(x,z)=>{let best=[x,z];for(let r=0;r<40;r+=2){let ok=null;for(let a=0;a<12&&!ok;a++){const px=x+Math.cos(a*.52)*r,pz=z+Math.sin(a*.52)*r;if(landD(px,pz)<-14||landD(px,pz)===-9)ok=[px,pz];}if(ok){best=ok;break;}}return best;};
    const defs=[[yacht('Silver Gull','#c9a24a'),cx[1],cz[1],.4],[tanker('Southern Star','#1d4a6e'),cx[0],cz[1],-.25],[yacht('Coral Dream','#d06a7a'),cx[1],cz[0],2.6],[tanker('Indian Dawn','#2f5a3a'),cx[0],cz[0],2.9]];
    defs.forEach(([g,x,z,h],k)=>{const p=at(x,z);g.traverse(o=>{o.__pxSkip=1;});/* ships keep their own paint (no house windows from the pixel kit) */g.position.set(p[0],0,p[1]);g.rotation.y=-h;scene.add(g);const u=g.userData;const s={x:p[0],z:p[1],h,L:u.L,W:u.W,g,name:u.name};SHIPS.list.push(s);
      // the quest stop: alongside the ship, on the side away from the island
      const c=Math.cos(h),n=Math.sin(h),sd=(-n*(p[0])+c*(p[1]))>=0?1:-1,d=u.W/2+2.2;s.stop=[p[0]-n*d*sd,p[1]+c*d*sd];SIDEQ.find(q=>q.id==='ned').steps[k+1].at=s.stop;});
    // rare fishing spots between the island and the edges
    const mid=[(SB.x1+SB.x2)/2,(SB.z1+SB.z2)/2];[['Gull Shoal',mid[0]-30,SB.z2-34],['The Blue Hole',SB.x1+60,mid[1]+8],['Tuna Rip',mid[0]-10,SB.z1+32],['Sailfish Ledge',SB.x1+34,SB.z2-60]].forEach(([nm,x,z])=>{const p=at(x,z);
      const g=new THREE.Group();g.position.set(p[0],0,p[1]);const bu=new THREE.Mesh(new THREE.CylinderGeometry(.35,.45,.9,10),M('#f08a2a'));bu.position.y=.3;bu.castShadow=true;g.add(bu);const bb=birds();g.add(bb);scene.add(g);
      OPENSEA.spots.push({x:p[0],z:p[1],name:nm,g,bb,deep:true});});
    // the bottle: far out on the west side, away from everything
    {const p=at(SB.x1+22,mid[1]-18);const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.55,8),new THREE.MeshLambertMaterial({color:0x3f8a5a,transparent:true,opacity:.85}));b.rotation.z=1.2;g.add(b);
      const ck=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.12,6),M('#a87a4a'));ck.position.set(.3,.12,0);ck.rotation.z=1.2;g.add(ck);g.position.set(p[0],-.06,p[1]);scene.add(g);OPENSEA.bottle={x:p[0],z:p[1],g};SIDEQ.find(q=>q.id==='ned').steps[0].at=[p[0],p[1]];}
    // Captain Ned's secret spot (shown after the quest)
    {const p=at(SB.x1+40,SB.z1+60);const g=new THREE.Group();const bu=new THREE.Mesh(new THREE.CylinderGeometry(.35,.45,.9,10),M('#e8c040'));bu.position.y=.3;g.add(bu);const bb=birds();g.add(bb);g.position.set(p[0],0,p[1]);scene.add(g);OPENSEA.secret={x:p[0],z:p[1],name:'Captain Ned’s secret spot',g,bb,deep:2};}
    console.log('OPENSEA ships '+SHIPS.list.length+' spots '+OPENSEA.spots.length);}
  (function wait(){if(typeof ISL!=='undefined'&&ISL.done&&typeof Dg!=='undefined'){try{build();}catch(e){console.error('opensea',e);}return;}setTimeout(wait,400);})();
  // every frame: ships ride the swell, gulls wheel, the bottle bobs; finding the bottle opens the quest
  (function loop(){try{if(SHIPS.list.length&&typeof BOAT!=='undefined'){const t=performance.now()/1000;SHIPS.list.forEach((s,i)=>{s.g.position.y=Math.sin(t*.5+i)*.06;s.g.rotation.z=Math.sin(t*.4+i)*.006;});
      const wheel=sp=>{if(!sp)return;sp.bb.children.forEach(b=>{const u=b.userData,a=u.a+t*.8;b.position.set(Math.cos(a)*u.r,u.y+Math.sin(t*2+u.a)*.2,Math.sin(a)*u.r);b.rotation.y=-a;b.children.forEach((w,k)=>{w.rotation.z=(k?1:-1)*(.35+Math.sin(t*6+u.a)*.25);});});};
      OPENSEA.spots.forEach(wheel);const done=S.sq&&S.sq.ned>=5;if(OPENSEA.secret){OPENSEA.secret.g.visible=!!done;if(done)wheel(OPENSEA.secret);}
      const B=OPENSEA.bottle;if(B){const found=S.sqFound&&S.sqFound.ned;B.g.visible=!found||!(S.sq&&S.sq.ned>=1);B.g.position.y=-.06+Math.sin(t*1.6)*.05;B.g.rotation.y=t*.3;
        if(!found&&BOAT.on&&Math.hypot(BOAT.x-B.x,BOAT.z-B.z)<2.4){S.sqFound=S.sqFound||{};S.sqFound.ned=1;S.sq=S.sq||{};if(S.sq.ned==null)S.sq.ned=0;BOAT.v=0;save();popText('Something glints in the water…',{x:BOAT.x,y:2,z:BOAT.z});}}}}catch(e){}requestAnimationFrame(loop);})();
  // fishing at the bird spots and the secret spot (boat only, slow down to cast)
  const _tg=cbdTargets;cbdTargets=function(T){_tg(T);if(typeof BOAT==='undefined'||!BOAT.on||Math.abs(BOAT.v)>1.6)return;
    const done=S.sq&&S.sq.ned>=5;OPENSEA.spots.concat(done&&OPENSEA.secret?[OPENSEA.secret]:[]).forEach(sp=>{if(Math.hypot(BOAT.x-sp.x,BOAT.z-sp.z)<5)T.push({x:BOAT.x,z:BOAT.z,r:3.2,label:'Fish '+sp.name+(sp.deep===2?' (legendary)':' (rare)'),act:()=>{BOAT.v=0;startFishing({name:sp.name,zone:'island',boat:true,deep:sp.deep});}});});
    SHIPS.list.forEach(s=>{if(s.stop&&Math.hypot(BOAT.x-s.stop[0],BOAT.z-s.stop[1])<4&&!(S.sqFound&&S.sqFound.ned&&S.sq&&S.sq.ned>=1&&S.sq.ned<5))T.push({x:BOAT.x,z:BOAT.z,r:3,label:'Wave to the '+s.name,act:()=>{say([{who:s.name,text:pick(['A deckhand waves back and shouts something about scones.','A horn blows twice. That is ship for hello.','Someone on deck holds up a big fish, then a bigger one.'])}]);}});});};
})();
