// ---------- The open sea round Rottnest: ships at the four corners, bird-marked rare fishing spots, Captain Ned's hidden quest ----------
// Paul (13 Nov 2026): more sea to drive the boat and fish in; an oil tanker or a super yacht anchored in each far corner; rare
// fishing spots; a side quest that can only be found by taking the boat out. The quest starts from a message in a bottle far out
// at sea and stays hidden in the quest list until the bottle is found. All names are fictional.
/* out on the boat Kip is always on Rottnest, even past the West End over the Perth maps' spot */
{const _zo=zoneOf;zoneOf=function(x){if(typeof BOAT!=='undefined'&&BOAT.on)return'island';return _zo(x);};}
const SHIPS={list:[],hit(x,z){for(const s of this.list){const dx=x-s.x,dz=z-s.z,c=Math.cos(s.h),n=Math.sin(s.h),u=dx*c+dz*n,v=-dx*n+dz*c;if(Math.abs(u)<s.L/2+1.2&&Math.abs(v)<s.W/2+1)return true;}return false;}};
const OPENSEA={spots:[],bottle:null,secret:null};
SIDEQ.push({id:'ned',zone:'island',mood:'heart',hidden:true,title:'Captain Ned’s Last Voyage',giver:'A message in a bottle',coins:300,
  desc:'A bottle bobbing far out at sea holds a letter from Captain Ned, who ran the island ferry for fifty years. He asks whoever finds it to carry a goodbye to the four old shipmates anchored at the far corners of the sea.',
  steps:[{l:'Read the message in the bottle',at:[0,0],say:['Kip fishes a green glass bottle out of the water. Inside is a rolled-up letter, dry as toast.',{who:'Captain Ned (letter)',text:'To whoever finds this: I ran the ferry to this island for fifty years. My knees have retired, so I am retiring too.'},{who:'Captain Ned (letter)',text:'Four old shipmates of mine sit at anchor in the far corners of this sea. I never said goodbye. Would you say it for me? Start with Bea, on the yacht Silver Gull.'}]},
   {l:'Find Bea on the super yacht Silver Gull',at:[0,0],say:[{who:'Bea (yacht chef)',text:'Ned? Ned wrote to me? He taught me to tie a bowline when I was twelve. Then he ate every scone I ever baked.'},{who:'Bea (yacht chef)',text:'Tell him the oven is still warm. And go see Bluey on the tanker Southern Star. He owes Ned twenty dollars since 1989.'}]},
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
    defs.forEach(([g,x,z,h],k)=>{const p=at(x,z);g.traverse(o=>{o.__pxSkip=1;});g.__islKeep=1;/* ships keep their own paint (no house windows from the pixel kit) */g.position.set(p[0],0,p[1]);g.rotation.y=-h;scene.add(g);const u=g.userData;const s={x:p[0],z:p[1],h,L:u.L,W:u.W,g,name:u.name};SHIPS.list.push(s);
      // the quest stop: alongside the ship, on the side away from the island
      const c=Math.cos(h),n=Math.sin(h),sd=(-n*(p[0])+c*(p[1]))>=0?1:-1,d=u.W/2+2.2;s.stop=[p[0]-n*d*sd,p[1]+c*d*sd];SIDEQ.find(q=>q.id==='ned').steps[k+1].at=s.stop;});
    // rare fishing spots between the island and the edges
    const mid=[(SB.x1+SB.x2)/2,(SB.z1+SB.z2)/2];[['Gull Shoal',mid[0]-30,SB.z2-34],['The Blue Hole',SB.x1+60,mid[1]+8],['Tuna Rip',mid[0]-10,SB.z1+32],['Sailfish Ledge',SB.x1+34,SB.z2-60]].forEach(([nm,x,z])=>{const p=at(x,z);
      const g=new THREE.Group();g.position.set(p[0],0,p[1]);const bu=new THREE.Mesh(new THREE.CylinderGeometry(.35,.45,.9,10),M('#f08a2a'));bu.position.y=.3;bu.castShadow=true;g.add(bu);const bb=birds();g.add(bb);g.__islKeep=1;scene.add(g);
      OPENSEA.spots.push({x:p[0],z:p[1],name:nm,g,bb,deep:true});});
    // the bottle: far out on the west side, away from everything
    {const p=at(SB.x1+22,mid[1]-18);const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.55,8),new THREE.MeshLambertMaterial({color:0x3f8a5a,transparent:true,opacity:.85}));b.rotation.z=1.2;g.add(b);
      const ck=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.12,6),M('#a87a4a'));ck.position.set(.3,.12,0);ck.rotation.z=1.2;g.add(ck);g.position.set(p[0],-.06,p[1]);g.__islKeep=1;scene.add(g);OPENSEA.bottle={x:p[0],z:p[1],g};SIDEQ.find(q=>q.id==='ned').steps[0].at=[p[0],p[1]];}
    // Captain Ned's secret spot (shown after the quest)
    {const p=at(SB.x1+40,SB.z1+60);const g=new THREE.Group();const bu=new THREE.Mesh(new THREE.CylinderGeometry(.35,.45,.9,10),M('#e8c040'));bu.position.y=.3;g.add(bu);const bb=birds();g.add(bb);g.position.set(p[0],0,p[1]);g.__islKeep=1;scene.add(g);OPENSEA.secret={x:p[0],z:p[1],name:'Captain Ned’s secret spot',g,bb,deep:2};}
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
// ---------- Life on the water (Paul, 13 Nov 2026): a fish-buyer boat that circles the island, a party boat with swimmers and
// dancers, and paddle boarders near the beaches. Built once the real sea is up; the moving boats are hard to drive through. ----------
(function(){
  const M=c=>new THREE.MeshLambertMaterial({color:c}),add=(g,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o;};
  const skin=['#f1c7a0','#d8a47a','#8d5a3b','#5a3a28'],tops=['#e8734a','#2f78a8','#f1c64a','#c85ab0','#3e7d5c','#f6f2e8','#e85a6a','#5ac8c8'];
  // a little person: legs, body, head, two arms (arms swing for dancing or paddling)
  function person(k,scale){const g=new THREE.Group(),sk=M(skin[k%4]),tp=M(tops[k%8]);add(g,new THREE.CylinderGeometry(.09,.1,.5,6),M('#2a3a5a'),0,.25,0);add(g,new THREE.CylinderGeometry(.14,.12,.45,8),tp,0,.72,0);add(g,new THREE.SphereGeometry(.14,10,8),sk,0,1.08,0);
    const arms=[-1,1].map(sd=>{const a=new THREE.Group();a.position.set(sd*.17,.9,0);add(a,new THREE.CylinderGeometry(.04,.04,.4,5),sk,0,-.2,0);g.add(a);return a;});g.userData.arms=arms;g.scale.setScalar(scale||1);g.traverse(o=>{o.__pxSkip=1;});return g;}
  const LIFE={buyer:null,party:null,boards:[],ring:[]};window.__LIFE=LIFE;
  function hullM(L,W,H,c){const s=new THREE.Shape();s.moveTo(-L/2,-W/2);s.lineTo(L/2-W*.8,-W/2);s.quadraticCurveTo(L/2,-W*.3,L/2,0);s.quadraticCurveTo(L/2,W*.3,L/2-W*.8,W/2);s.lineTo(-L/2,W/2);s.lineTo(-L/2,-W/2);const g=new THREE.ExtrudeGeometry(s,{depth:H,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,M(c));m.castShadow=true;return m;}
  function buyerBoat(){const g=new THREE.Group();const h=hullM(9,3.2,1.3,'#f4f2ec');h.position.y=-.55;g.add(h);add(g,new THREE.BoxGeometry(8.6,.25,3.22),M('#2f6a9a'),-.2,.3,0);
    add(g,new THREE.BoxGeometry(2.6,1.5,2.4),M('#f8f8f4'),-2.6,1.5,0);add(g,new THREE.BoxGeometry(2.62,.45,2.42),M('#2b3a4c'),-2.6,1.75,0);add(g,new THREE.BoxGeometry(2.9,.12,2.7),M('#2f6a9a'),-2.6,2.3,0);
    [[0,.9],[1.2,-.8],[2.2,.6]].forEach(([x,z])=>add(g,new THREE.BoxGeometry(.9,.6,.8),M('#f4f4f0'),x,1.05,z));/* ice boxes */
    const cr=add(g,new THREE.CylinderGeometry(.07,.07,2.6,6),M('#f1c64a'),.8,2.1,-.9);cr.rotation.z=-.5;
    try{const t=makeSign(['FISH BUYER','BEST PRICES'],64,20,'#2f6a9a','#ffffff');[-1,1].forEach(sd=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.7),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));p.position.set(-2.6,2.65,0);p.rotation.y=sd>0?0:Math.PI;g.add(p);});}catch(e){}
    const skip=person(2,1);skip.position.set(-1,.4,.6);g.add(skip);g.traverse(o=>{o.__pxSkip=1;});return g;}
  function partyBoat(){const g=new THREE.Group();const h=hullM(12,4.6,1.2,'#f6f6f2');h.position.y=-.5;g.add(h);add(g,new THREE.BoxGeometry(11.4,.2,4.5),M('#c79a62'),-.2,.72,0);
    add(g,new THREE.BoxGeometry(7,.15,4.2),M('#f6f6f2'),-1.6,2.7,0);[[-5,-2],[-5,2],[1.8,-2],[1.8,2]].forEach(([x,z])=>add(g,new THREE.CylinderGeometry(.06,.06,1.9,5),M('#dcdcd6'),x,1.75,z));
    add(g,new THREE.BoxGeometry(1.2,.9,1),M('#22222a'),-4.4,1.25,0);/* DJ booth */const sl=add(g,new THREE.BoxGeometry(3,.12,.9),M('#3ab0e0'),-6.6,1.3,1.6);sl.rotation.z=.55;/* slide off the back */
    const lights=[],cols=[0xff5a6a,0xffd24a,0x5ae0ff,0x9a7aff,0x6aff8a];for(let i=0;i<14;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.08,6,5),new THREE.MeshBasicMaterial({color:cols[i%5]}));b.position.set(-5+i*.52,2.55-Math.sin(i/13*Math.PI)*.25,2.05*(i%2?1:-1));g.add(b);lights.push(b);}
    const dancers=[];for(let k=0;k<7;k++){const p=person(k,1);p.position.set(-3.4+k*.8,.82,(k%2?.8:-.8)+(k%3-1)*.3);g.add(p);dancers.push(p);}
    const swimmers=[];for(let k=0;k<5;k++){const s=new THREE.Group();add(s,new THREE.SphereGeometry(.14,10,8),M(skin[k%4]),0,.05,0);const ring=k%2?add(s,new THREE.TorusGeometry(.32,.1,6,12),M(k%4===1?'#ff7a5a':'#ffd24a'),0,-.02,0):null;if(ring)ring.rotation.x=Math.PI/2;s.userData={a:k*1.25,r:7+k*.6};swimmers.push(s);}
    g.userData={lights,dancers,swimmers};g.traverse(o=>{o.__pxSkip=1;});return g;}
  function board(k){const g=new THREE.Group();const b=add(g,new THREE.BoxGeometry(2.6,.1,.6),M(['#f4f2ec','#5ac8e0','#f1c64a','#e8734a'][k%4]),0,.02,0);b.scale.set(1,1,1);const p=person(k+3,1);p.position.set(0,.07,0);g.add(p);
    const pad=new THREE.Group();add(pad,new THREE.CylinderGeometry(.025,.025,1.6,5),M('#2a2a30'),0,0,0);add(pad,new THREE.BoxGeometry(.06,.35,.18),M('#2a2a30'),0,-.8,0);pad.position.set(.25,.9,.25);g.add(pad);g.userData={pad,p};g.traverse(o=>{o.__pxSkip=1;});return g;}
  function build(){if(typeof SEA4==='undefined'||!SEA4.built||!SEA4.bedL)return false;
    // a loop round the island about 14 units off the coast: march out from the island's middle at each angle
    let cx=0,cz=0,n=0;for(let x=TB.x1;x<TB.x2;x+=4)for(let z=TB.z1;z<TB.z2;z+=4){const d=landD(x,z);if(d>0&&d!==-9){cx+=x;cz+=z;n++;}}cx/=n;cz/=n;
    const SB=seaBounds(),N=120,last=[];for(let i=0;i<N;i++){const a=i/N*Math.PI*2,c=Math.cos(a),s=Math.sin(a);let L=0;for(let r=0;r<330;r+=1){const x=cx+c*r,z=cz+s*r;if(x<SB.x1||x>SB.x2||z<SB.z1||z>SB.z2)break;const d=landD(x,z);if(d>0&&d!==-9)L=r;}last.push(L);}
    const sm=k=>{let t=0;for(let j=-3;j<=3;j++)t+=last[(k+j+N)%N];return t/7;};const ring=[];for(let i=0;i<N;i++){const a=i/N*Math.PI*2,R=Math.max(last[i],sm(i))+14;ring.push([Math.max(SB.x1+8,Math.min(SB.x2-8,cx+Math.cos(a)*R)),Math.max(SB.z1+8,Math.min(SB.z2-8,cz+Math.sin(a)*R))]);}
    // bays and points spoil the simple ray: walk any point that sits too close to land out to open water, then smooth again
    const wet=(x,z)=>{const d=landD(x,z);return d===-9?-99:d;};
    ring.forEach(p=>{for(let it=0;it<60&&wet(p[0],p[1])>-5;it++){let bx=p[0],bz=p[1],bv=wet(p[0],p[1]);for(let k=0;k<8;k++){const a=k/8*Math.PI*2,x=p[0]+Math.cos(a)*1.5,z=p[1]+Math.sin(a)*1.5;if(x<SB.x1+6||x>SB.x2-6||z<SB.z1+6||z>SB.z2-6)continue;const v=wet(x,z);if(v<bv){bv=v;bx=x;bz=z;}}if(bx===p[0]&&bz===p[1])break;p[0]=bx;p[1]=bz;}});
    for(let pass=0;pass<2;pass++){const c2=ring.map((p,i)=>{const a=ring[(i+N-1)%N],b=ring[(i+1)%N],m=[(a[0]+p[0]*2+b[0])/4,(a[1]+p[1]*2+b[1])/4];return wet(m[0],m[1])<-4?m:p;});c2.forEach((p,i)=>{ring[i]=p;});}
    LIFE.ring=ring;LIFE.c=[cx,cz];LIFE.last=last;
    const bb=buyerBoat();bb.__islKeep=1;scene.add(bb);LIFE.buyer={g:bb,s:0,L:9,W:3.2,x:ring[0][0],z:ring[0][1],h:0,name:'the fish buyer'};SHIPS.list.push(LIFE.buyer);
    // the party boat anchors off the Settlement side (the angle that points at the café)
    {const cf=IW(0,2.9),ang=Math.atan2(cf.z-cz,cf.x-cx);let i=Math.round(((ang+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*N)%N;i=(i+N-6)%N;const a=i/N*Math.PI*2,R=last[i]+9,x=cx+Math.cos(a)*R,z=cz+Math.sin(a)*R;
      const pb=partyBoat();pb.__islKeep=1;pb.userData.swimmers.forEach(o=>{o.__islKeep=1;});pb.position.set(x,0,z);pb.rotation.y=-(a+Math.PI/2);scene.add(pb);pb.userData.swimmers.forEach(s=>scene.add(s));LIFE.party={g:pb,x,z,h:a+Math.PI/2,L:12,W:4.6,name:'the party boat'};SHIPS.list.push(LIFE.party);}
    // paddle boarders just off the beaches, gliding up and down the shore
    for(let k=0;k<6;k++){const i=Math.floor((k+.3)/6*N),a=i/N*Math.PI*2,R=last[i]+3.5,g=board(k);g.__islKeep=1;scene.add(g);LIFE.boards.push({g,a,R,ph:k*1.7,cx,cz});}
    console.log('LIFE ring '+N+' boards '+LIFE.boards.length);return true;}
  (function wait(){if(typeof SEA4!=='undefined'&&SEA4.on===false)return;let ok=false;try{ok=build();}catch(e){console.error('life',e);return;}if(!ok)setTimeout(wait,600);})();
  (function loop(){try{const t=performance.now()/1000,dt=1/60;
    const B=LIFE.buyer,R=LIFE.ring;if(B&&R.length){B.s=(B.s+dt*3.2)%(R.length*6);const f=B.s/6,i=Math.floor(f)%R.length,j=(i+1)%R.length,u=f-Math.floor(f),x=R[i][0]+(R[j][0]-R[i][0])*u,z=R[i][1]+(R[j][1]-R[i][1])*u;
      const h=Math.atan2(R[j][1]-R[i][1],R[j][0]-R[i][0]);B.x=x;B.z=z;B.h=h;B.g.position.set(x,Math.sin(t*1.1)*.05,z);B.g.rotation.y=-h;B.g.rotation.z=Math.sin(t*.9)*.02;}
    const P=LIFE.party;if(P){const u=P.g.userData;P.g.position.y=Math.sin(t*.8)*.04;u.dancers.forEach((d,k)=>{d.position.y=.82+Math.abs(Math.sin(t*4.2+k))*.16;d.rotation.y=Math.sin(t*1.3+k)*.6;d.userData.arms.forEach((a,s)=>{a.rotation.z=(s?-1:1)*(1.6+Math.sin(t*8.4+k+s)*.9);});});
      u.lights.forEach((l,k)=>{l.visible=((Math.floor(t*4)+k)%3)!==0;});
      u.swimmers.forEach((s,k)=>{const d=s.userData,a=d.a+Math.sin(t*.15+k)*.4,ox=Math.cos(a)*d.r*.6,oz=Math.sin(a)*d.r*.45,c=Math.cos(-P.g.rotation.y),n=Math.sin(-P.g.rotation.y);s.position.set(P.x+ox*c-oz*n,-.12+Math.sin(t*2+k)*.04,P.z+ox*n+oz*c);});}
    LIFE.boards.forEach(b=>{const s=Math.sin(t*.12+b.ph),a=b.a+s*.05,x=b.cx+Math.cos(a)*b.R,z=b.cz+Math.sin(a)*b.R;b.g.position.set(x,-.06+Math.sin(t*1.4+b.ph)*.03,z);
      const dir=Math.cos(t*.12+b.ph)>=0?1:-1;b.g.rotation.y=-(a+Math.PI/2*dir);const pd=b.g.userData.pad,sw=Math.sin(t*1.6+b.ph);pd.rotation.x=sw*.5;pd.position.z=sw>0?.28:-.28;b.g.userData.p.rotation.z=sw*.05;});}catch(e){}requestAnimationFrame(loop);})();
  // selling the catch to the fish buyer, and waving to the party boat (once a day: they throw Kip a few coins for the show)
  const _tg=cbdTargets;cbdTargets=function(T){_tg(T);if(typeof BOAT==='undefined'||!BOAT.on)return;const B=LIFE.buyer;
    if(B&&Math.hypot(BOAT.x-B.x,BOAT.z-B.z)<7){const have=(S.inv.fish||0),sellN=Math.max(0,have-10);T.push({x:BOAT.x,z:BOAT.z,r:4,label:sellN?'Sell '+sellN+' fish to the fish buyer (8 coins each, Kip keeps 10 for the café)':'Talk to the fish buyer',act:()=>{if(!sellN){say([{who:'Fish buyer',text:'Bring me fish when you have more than a café needs. I pay better than the shops, and I come round the island all day.'}]);return;}S.inv.fish=have-sellN;const pay=sellN*8;S.coins+=pay;S.earned=(S.earned||0)+pay;save();popText('+'+pay+' coins',{x:BOAT.x,y:2.2,z:BOAT.z});say([{who:'Fish buyer',text:pick(['Lovely catch! These will be on a plate in Fremantle by dinner.','Ooh, still wriggling. That is what I like to see.','Pleasure doing business, Captain Quokka.'])}]);}});}
    const P=LIFE.party;if(P&&Math.hypot(BOAT.x-P.x,BOAT.z-P.z)<11){T.push({x:BOAT.x,z:BOAT.z,r:4,label:'Wave to the party boat',act:()=>{const d=S.day||0;S.partyDay=S.partyDay||-1;if(S.partyDay!==d){S.partyDay=d;S.coins+=20;save();popText('The party cheers! +20 coins',{x:BOAT.x,y:2.2,z:BOAT.z});}say([{who:'Party boat',text:pick(['WOOOO! QUOKKA ON A BOAT!','Come aboard! …Oh, you have a café to run. Fair enough!','Someone tell the DJ to play the quokka song!'])}]);}});}};
})();
