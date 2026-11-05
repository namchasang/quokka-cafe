// ---------- Perth CBD: the city across the river from South Perth (ferry to Barrack Street Jetty, City Loop bus) ----------
// Layout from south (river) to north: riverfront and jetty, Riverside Drive, St Georges Terrace with office towers,
// Hay Street Mall, shops, Wellington Street and the station. Kings Park on the west, the Gold Exchange and food trucks on the east.
const CBDB={x1:598,x2:702,z1:-27,z2:24};
const CBD={npcs:[],acts:[],P:{},cut:[]};
function cbdWalk(x,z){if(x>600.2&&x<699.8&&z>-25.6&&z<11.8&&!(x>640&&x<660&&z>6.2))return true;if(x>668.2&&x<670.8&&z>11&&z<19.6)return true;if(x>639&&x<661&&z>9.4&&z<11.2)return true;return false;}
(()=>{const M=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  // every building is registered so it can fold down when Kip walks behind it (the camera looks north)
  const cb=(x,z,w,d,h,c,o)=>{const g=bld(x,z,w,d,h,c,o);CBD.cut.push({g,x1:x-w/2,x2:x+w/2,z1:z-d/2,h:h+((o&&o.roofH)||0)});return g;};
  // ground: three blocks of pavement leave Elizabeth Quay's inlet open to the river
  box(40,.5,38,lmat(paveC,[20,19]),620,-.26,-7,{noCast:true});box(40,.5,38,lmat(paveC,[20,19]),680,-.26,-7,{noCast:true});box(20,.5,32,lmat(paveC,[10,16]),650,-.26,-10,{noCast:true});
  flat(22,38,lmat(grassC,[6,10]),611,.012,-7);// Kings Park
  flat(78,1.6,lmat(pathC,[39,1]),661,.016,10.2);// riverside walk
  [[661,4.8,78,1.6],[661,-3.1,78,2.2],[661,-21.7,78,1.5]].forEach(([x,z,w,d])=>{flat(w,d,lmat(asphC,[w/2,1]),x,.02,z);for(let k=x-w/2+1;k<x+w/2;k+=2.4)flat(1,.08,M('#f3f3ea'),k,.026,z);});// Riverside Dr, St Georges Tce, Wellington St
  flat(2.4,25.5,lmat(asphC,[1,12]),667.3,.021,-8.8);flat(2.2,25.5,lmat(asphC,[1,12]),639.1,.021,-8.8);// Barrack St, William St
  flat(78,2.2,lmat(pathC,[39,1.1]),661,.018,-13.5);// Hay Street Mall
  // the jetty, the ferry stop and Elizabeth Quay's footbridge
  box(2.6,.16,8.6,lmat(deckC,[1,4]),669.5,.08,15.3,{noCast:true});for(let i=0;i<6;i++)[-1.1,1.1].forEach(o=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.2,6),legMat);p.position.set(669.5+o,-.35,12+i*1.5);scene.add(p);});
  signPost(671.4,12.6,makeSign(['BARRACK ST JETTY','FERRY · SOUTH PERTH'],72,20,'#1d3a6e','#f5ecd8'),1.6,.5);
  {const g=new THREE.Group();const n=14;for(let i=0;i<=n;i++){const t=i/n,x=-11+t*22,y=.15+Math.sin(t*Math.PI)*1.2;const s=new THREE.Mesh(new THREE.BoxGeometry(1.7,.12,1.8),lmat(deckC,[1,1]));s.position.set(x,y,0);s.rotation.z=Math.cos(t*Math.PI)*.17;g.add(s);}
    for(let i=0;i<=n;i+=2){const t=i/n,x=-11+t*22,y=.15+Math.sin(t*Math.PI)*1.2;[-.85,.85].forEach(o=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.7,.06),M('#f6f6f0'));p.position.set(x,y+.4,o);g.add(p);});}
    const arc=new THREE.Mesh(new THREE.TorusGeometry(6,.12,6,24,Math.PI),M('#f6f6f0'));arc.position.set(0,.1,0);g.add(arc);g.position.set(650,0,10.3);scene.add(g);}
  // Bell tower: a glass spire with copper wings over the bells
  {const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(1.9,2.1,1.2,12),lmat(stoneC,[2,1]));base.position.y=.6;g.add(base);
    const core=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.5,6,12),M('#8fb8c8'));core.position.y=4.2;g.add(core);const spire=new THREE.Mesh(new THREE.ConeGeometry(1.1,5,12),M('#a8d0dc'));spire.position.y=9.7;g.add(spire);
    [-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.BoxGeometry(.25,7,1.6),M('#b8743a'));w.position.set(s*1.5,5,0);w.rotation.z=s*.16;g.add(w);});
    for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6,0,6.283,0,Math.PI/2),M('#c8a040'));b.rotation.x=Math.PI;b.position.set(Math.cos(i)*0.6,3.2+i%2*.5,1.2);g.add(b);}
    g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.position.set(678,0,8.2);scene.add(g);col(676,6.2,680,10.2);CBD.P.belltower={x:678,z:11.4};}
  // Elizabeth Quay: a tall ribbon sculpture on the plaza and pavilions along the water
  {const g=new THREE.Group();for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(2.2+i*.6,.14,6,20,Math.PI*1.3),M(['#f6f6f0','#e8e2d0','#ffffff'][i]));r.rotation.set(Math.PI/2*.2,i*.6,Math.PI/2);r.position.y=2.6+i*.4;g.add(r);}g.position.set(650,0,1.2);scene.add(g);col(649,.4,651,2);CBD.P.eqquay={x:650,z:4.6};}
  cb(630,1,6,3,3,'#e8e2d4',{sign:'FERRY TICKETS',signBg:'#1d3a6e',ver:'#1d3a6e'});cb(689,1,8,3,3.4,'#f6f2e8',{sign:'RIVERSIDE KIOSKS',signBg:'#3f7a5a',ver:'#3f7a5a'});
  // office towers on St Georges Terrace (taller to the north, so they never hide the street)
  const TW=[[627,-8.5,8,5,13,'#9ab0c0'],[646,-8.5,9,5,16,'#c8d2d8'],[662,-8.5,6,5,11,'#b8c4cc'],[675,-8.5,9,5,18,'#8aa0b4'],[685,-8.5,6,5,12,'#d0c8bc']];
  TW.forEach(([x,z,w,d,h,c],i)=>{cb(x,z,w,d,h,c,{winCol:'#5a7a96',sign:i===3?'RIVERVIEW TOWER':null,signBg:'#1d3a6e'});});CBD.P.devtower={x:675,z:-5};
  // Tudor Lane: an old arcade with timber-framed shop fronts and a clock
  {const lx=655.6;for(const s of [-1,1]){const g=cb(lx+s*1.9,-8.5,1.6,5,3.8,'#f2ead8',{win:false,noCol:false});for(let k=0;k<3;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(.08,3.6,.08),M('#4a3424'));b.position.set(lx+s*1.1,1.9,-10.6+k*2.1);scene.add(b);}}
    const clk=new THREE.Mesh(new THREE.CircleGeometry(.55,16),M('#f6f2e8'));clk.position.set(lx,3.2,-5.9);scene.add(clk);const rim=new THREE.Mesh(new THREE.TorusGeometry(.56,.06,6,16),M('#c8a040'));rim.position.set(lx,3.2,-5.88);scene.add(rim);
    const arch=new THREE.Mesh(new THREE.BoxGeometry(2.4,.6,.4),M('#4a3424'));arch.position.set(lx,3.9,-5.9);scene.add(arch);signPost(lx-1.6,-4.9,makeSign(['TUDOR LANE'],48,12,'#4a3424','#f5ecd8'),1,.3);CBD.P.tudor={x:lx,z:-4.4};}
  // Hay Street Mall shops
  const SH=[['SWAN BOOKS','#2f5a3a','#f2ead8'],['GUMLEAF FASHION','#8a3a5a','#f6f2e8'],['QUOKKA SWEETS','#e86a8a','#fff3e6'],['HARBOUR OUTFITTERS','#1d3a6e','#e8e2d4'],['CITY PHARMACY','#3f9a6a','#f6f6f0'],['LANTERN TEA','#c8344a','#f6e8d0'],['CORNER NEWS','#5a4a3a','#efe3c4']];
  const SX=[643,649.5,656,672.5,679,685.5];SH.slice(0,6).forEach(([n,c,w],i)=>{cb(SX[i],-18,5.6,4,4,w,{ver:c,sign:n,signBg:c});});CBD.P.haymall={x:664,z:-13.5};
  cb(630,-18,11,5,5,'#efe3c4',{sign:'CITY MUSEUM',signBg:'#5a3a22',parapet:'#d8c8a0'});CBD.P.citymuseum={x:630,z:-14.8};
  cb(677,-24.2,24,3,4.2,'#e8dcc0',{sign:'PERTH STATION',signBg:'#1d3a6e',parapet:'#c8b896',ver:'#1d3a6e'});CBD.P.perthstn={x:672,z:-20.2};
  // the skyline: tall towers north of the station, outside the walkable streets
  box(104,.5,8,lmat(paveC,[52,4]),650,-.26,-29,{noCast:true});[[606,14,'#9ab0c0'],[616,20,'#c8d2d8'],[628,16,'#8aa0b4'],[641,24,'#b8c4cc'],[654,18,'#d0c8bc'],[667,22,'#9ab0c0'],[681,15,'#c8d2d8'],[693,19,'#8aa0b4']].forEach(([x,h,c])=>{bld(x,-29.5,8,5,h,c,{winCol:'#5a7a96',noCol:true});});
  // the Gold Exchange: an old limestone building where they pour gold
  cb(694,-8,9,5,4.4,'#efe3c4',{win:true,sign:'GOLD EXCHANGE · 1899',signBg:'#8a6a20',parapet:'#d8c896',roof:'#a84a3a',roofH:1.2});CBD.P.goldex={x:694,z:-4.6};
  // food trucks at the east end of the mall (open from 6pm)
  CBD.trucks=[['SATAY','#c8344a',8,'Satay skewers',35],['DUMPLINGS','#2a2a30',9,'Pan-fried dumplings',35],['TACOS','#e8a33a',9,'Fish tacos',35],['GELATO','#5cc6d8',6,'Gelato cup',20]].map(([n,c,p,dish,st],i)=>{const x=692+(i%2)*4.6,z=-15.6+Math.floor(i/2)*3.6;
    const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.9,1.7),M(c));b.position.y=1.15;g.add(b);const w=new THREE.Mesh(new THREE.BoxGeometry(2,.7,.05),M('#2a2a30'));w.position.set(0,1.4,.87);g.add(w);
    [[-1.1,.85],[1.1,.85],[-1.1,-.85],[1.1,-.85]].forEach(([a,o])=>{const wh=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.2,10),M('#1a1a1a'));wh.rotation.x=Math.PI/2;wh.position.set(a,.3,o);g.add(wh);});
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(2,.36),new THREE.MeshBasicMaterial({map:makeSign([n],Math.max(48,n.length*6+8),12,'#1b1b2b','#ffd34d')}));sg.position.set(0,2.3,.86);g.add(sg);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.position.set(x,0,z);scene.add(g);col(x-1.7,z-.85,x+1.7,z+.85);
    return{x,z:z+1.4,p,dish,st,name:n};});CBD.P.foodtrucks={x:694,z:-11};
  // Kings Park: big trees, a lookout over the river, the glass bridge walk and a spiral tower
  {const tv=treeVariants;[[603,-22],[609,-23],[616,-21],[604,-14],[612,-12],[619,-15],[603,-3],[618,-1],[606,2],[614,5],[620,-24],[601,-9]].forEach(([x,z],i)=>{const v=tv[i%3];const g=new THREE.PlaneGeometry(v.w*1.2,v.h*1.2);g.translate(0,v.h*.6,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);trees.push({x,z,m,v,fade:false});col(x-.3,z-.15,x+.3,z+.15);});
    const lk=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.3,.16,18),lmat(stoneC,[2,2]));lk.position.set(610,.08,8.6);scene.add(lk);for(let i=0;i<=12;i++){const a=i/12*Math.PI;const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.7,.06),fenceMat);p.position.set(610+Math.cos(a)*2.1,.45,8.6+Math.sin(a)*2.1);scene.add(p);}
    signPost(606.8,7,makeSign(['KINGS PARK','LOOKOUT'],48,20,'#3f7a5a','#ffffff'),1,.5);CBD.P.kplookout={x:610,z:10.5};
    const gb=new THREE.Group();for(let i=0;i<8;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(2,.1,1.3),new THREE.MeshLambertMaterial({color:0xbfe6f2,transparent:true,opacity:.6}));s.position.set(-7+i*2,1.4,0);gb.add(s);}
    [-.7,.7].forEach(o=>{const r=new THREE.Mesh(new THREE.BoxGeometry(16,.05,.05),M('#e8eef2'));r.position.set(0,2.1,o);gb.add(r);});[-8,8].forEach(x=>{const st=new THREE.Mesh(new THREE.BoxGeometry(.6,1.4,1.3),lmat(stoneC,[1,1]));st.position.set(x,.7,0);gb.add(st);});
    gb.position.set(611,0,-6.5);scene.add(gb);col(602.6,-7.3,603.4,-5.7);col(618.6,-7.3,619.4,-5.7);CBD.P.glassbridge={x:611,z:-4.6};
    const dna=new THREE.Group();for(let i=0;i<14;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(1.6,.14,.4),M('#e8e2d0'));d.position.y=.4+i*.55;d.rotation.y=i*.45;dna.add(d);}const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,8,6),legMat);pole.position.y=4;dna.add(pole);
    dna.position.set(607,0,-18);scene.add(dna);col(606.2,-18.8,607.8,-17.2);CBD.P.kingspark={x:611,z:-15};}
  // street trees and lamps along the terrace
  for(let x=624;x<700;x+=7.5){if(Math.abs(x-667)<2||Math.abs(x-639)<2)continue;const v=treeVariants[1];const g=new THREE.PlaneGeometry(v.w*.8,v.h*.8);g.translate(0,v.h*.4,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,-1.2);scene.add(m);BB.push(m);trees.push({x,z:-1.2,m,v,fade:false});col(x-.25,-1.35,x+.25,-1.05);}
  // City Loop bus stop on Wellington Street
  {const p=box(.1,2.2,.1,new THREE.MeshLambertMaterial({color:0x3ec46a}),662,1.1,-20.4);const s=new THREE.Mesh(new THREE.PlaneGeometry(.9,.6),new THREE.MeshBasicMaterial({map:makeSign(['CITY','LOOP'],32,20,'#3ec46a','#ffffff'),side:THREE.DoubleSide}));s.position.set(662,2,-20.34);scene.add(s);}
})();
BUS_STOPS.cbd={x:661.4,z:-20.6,name:'Perth CBD',land:[661.4,-19.6]};
SAFE_SPOTS.cbd=[[667,-1],[650,6],[664,-13.5]];
ZONE_DEF.cbd={B:CBDB,title:'Perth CBD',eb:'Perth city · Swan River',bg:'#5cc6d8',rects:[[600,-25.6,700,12,'#d8d2c4'],[640,6.2,660,12,'#5cc6d8'],[600,-25.6,622,12,'#7aa356'],[622,4,700,5.6,'#4a4d55'],[622,-4.2,700,-2,'#4a4d55'],[622,-22.5,700,-21,'#4a4d55'],[622,-14.6,700,-12.4,'#e8dcbc'],[668.2,11,670.8,19.6,'#b98552']],
  labels:[['Perth CBD',662,-6.2,1],['Kings Park',611,-10,1],['Elizabeth Quay',650,3,1],['Bell tower',678,6,0],['Barrack St Jetty',669.5,17,1],['Hay St Mall',664,-13.6,1],['St Georges Tce',682,-3.1,0],['Perth Station',677,-24.2,1],['Gold Exchange',694,-8,0],['Food trucks',694,-12.2,0],['Tudor Lane',655.6,-8.5,0],['City Museum',630,-18,0],['Swan River',650,18,1]]};
// people of the city
function cbdNPC(id,name,v,x,z,lines){const m=spriteMesh(humanFrames(v),.95,1.58);m.position.set(x,0,z);scene.add(m);blob(.85).position.set(x,.03,z);const n={id,name,x,z,lines};CBD.npcs.push(n);CBD.P[id]={x,z:z+1.4};return n;}
cbdNPC('agnes','Agnes',{hair:'#d8d4cc',skin:'#f1c7a0',shirt:'#1d3a6e',pants:'#3a3a48',hat:null},675.4,11,()=>[{who:'Agnes',text:pick(['Twelve bells, rung by hand. It takes a whole team and a very good ear.','Pigeons. Lovely birds. Terrible timing.','On the hour, every hour. You can set your watch by me. Most people do.'])}]);
cbdNPC('jack','Prospector Jack',{hair:'#e8e4dc',skin:'#c8865a',shirt:'#8a5a36',pants:'#5a4a3a',hat:'#7a5033'},690.4,-4.4,()=>[{who:'Prospector Jack',text:pick(['Found a nugget the size of a lamington once. Well. A small lamington.','Watch them pour the gold at ten, twelve and two. Glows like a sunset in a bucket.','Gold rush stories get bigger every year. Like my nugget.'])}]);
cbdNPC('tilly','Ranger Tilly',{hair:'#6b4226',skin:'#e8b892',shirt:'#3f7a5a',pants:'#c9b68a',hat:'#7a6a4a'},614,-9,()=>[{who:'Ranger Tilly',text:pick(['I can tell a wildflower by its smell with my eyes shut. Spring is the best.','The glass bridge goes right through the treetops. Don’t look down. Or do, it’s lovely.','From the lookout you can see the whole river, all the way to South Perth.'])}]);
cbdNPC('mai','Mai',{hair:'#1e1a18',skin:'#d8a47a',shirt:'#e8732a',pants:'#2a2a30',hat:'#f6f6f0'},698.6,-12.2,()=>[{who:'Mai',text:pick(['One day I’ll have my own café. Like yours! Maybe with dumplings.','The trucks open at six. The queue starts at five fifty.','Secret to a good dumpling: patience. And a lot of garlic.'])}]);
cbdNPC('dev','Dev',{hair:'#2a1d16',skin:'#8d5a3b',shirt:'#f6f6f0',pants:'#2a2a48',hat:null},672.5,-4.6,()=>[{who:'Dev',text:pick(['Late again! Two coffees: one to drink, one to calm down.','Thirty floors up, and I still can’t see Rottnest. I’ve tried.','The lifts in this tower have opinions.'])}]);
cbdNPC('pete','Pete',{hair:'#d8a050',skin:'#f1c7a0',shirt:'#9478d4',pants:'#2f3b5c',hat:'#2a2a30'},652,-13,()=>[{who:'Pete',text:pick(['I know three songs. I play them very, very well.','Any requests? As long as it’s one of my three.','A quokka once danced to my music. Best day of my career.'])}]);
cbdNPC('iris','Iris',{hair:'#b8b0a8',skin:'#c68a5e',shirt:'#1d3a6e',pants:'#2a2a30',hat:'#1d3a6e'},634.5,-14.6,()=>[{who:'Iris',text:pick(['Night shift at the museum. The whale skeleton is great company. Very quiet.','We call the big whale Bones. Bones doesn’t mind.','Bring fossils from the island to the museum. We love a good fossil.'])}]);
// the bell tower view: spot the pigeon that keeps ringing bell seven
function bellView(){const q=SIDEQ.find(s=>s.id==='twelvebells'),want=q&&sqStep(q)===1;S.cbd=S.cbd||{};
  const T=[{id:'pigeon',name:'Sneaky pigeon',x:420,y:210,r:24,pos:t=>[420+Math.sin(t*.8)*14,210],fact:'A pigeon, perched on bell seven’s rope and bouncing on it like a trampoline.'},{id:'bell7',name:'Bell seven',x:300,y:250,r:30,fact:'Bell seven, a bit out of tune from all the extra ringing.'},{id:'rope',name:'Ringing rope',x:190,y:300,r:26,fact:'Each bell has its own rope. Twelve ropes, twelve ringers.'}];
  const draw=(x,t)=>{x.fillStyle='#2a2e3a';x.fillRect(0,0,640,400);x.fillStyle='#8fb8c8';for(let i=0;i<9;i++){x.globalAlpha=.25;x.fillRect(i*80,0,40,400);}x.globalAlpha=1;
    for(let i=0;i<6;i++){const bx=110+i*90,by=170+(i%2)*60;x.fillStyle='#c8a040';x.beginPath();x.moveTo(bx-28,by+30);x.quadraticCurveTo(bx-26,by-20,bx,by-26);x.quadraticCurveTo(bx+26,by-20,bx+28,by+30);x.closePath();x.fill();x.fillStyle='#8a6a20';x.fillRect(bx-30,by+28,60,6);x.strokeStyle='#e8dcc0';x.lineWidth=3;x.beginPath();x.moveTo(bx-20,by+34);x.lineTo(bx-28,by+140);x.stroke();}
    x.fillStyle='#f2efe6';x.font='bold 14px system-ui';x.fillText('7',300,236);T.forEach(q=>{if(q.id!=='pigeon')return;const p=spotPos(q,t);x.fillStyle='#8a8f9a';x.beginPath();x.ellipse(p[0],p[1],12,8,0,0,6.283);x.fill();x.beginPath();x.arc(p[0]+10,p[1]-6,5,0,6.283);x.fill();x.fillStyle='#e8734a';x.fillRect(p[0]+14,p[1]-6,4,2);x.fillStyle='#5a9a8a';x.fillRect(p[0]+6,p[1]-3,6,3);});};
  spotOpen({eye:'Bell tower · up in the bell chamber',title:want?'Find what keeps ringing bell seven':'Look around the bell chamber',hint:'The bells hang in two rows. Something small is up here with you.',targets:T,draw,hintAt:14,doneTitle:'Mystery solved!',
    done:()=>{S.cbd.pigeon=1;if(!S.cbd.bells){S.cbd.bells=1;S.coins+=15;toast('Bell chamber visit · +15 coins',2.2);}}});}
function cbdTargets(T){if(zoneOf(player.x)==='sp'&&unlocked('bus'))T.push({x:SPX-1.6,z:-8.2,r:1.3,label:'Ferry to Perth CBD (Barrack St)'+(hasPass()?'':' \u00b7 \u{1F512} Perth Pass'),act:()=>ferryCross('cbd')});if(zoneOf(player.x)!=='cbd')return;const B=BUS_STOPS.cbd;T.push({x:B.x,z:B.z+.5,r:1.4,label:'City Loop bus · South Perth, Heirisson Island, Victoria Park',act:()=>openBusStop('cbd')});
  T.push({x:669.5,z:18.6,r:1.4,label:'Ferry to South Perth (Mends St)',act:()=>ferryCross('sp')});
  CBD.npcs.forEach(n=>T.push({x:n.x,z:n.z,r:1.4,label:'Talk to '+n.name,act:()=>say(n.lines())}));
  T.push({x:678,z:11.6,r:1.4,label:'Climb up to the bell chamber',act:()=>{if(overlay)return;bellView();}});
  T.push({x:630,z:-15.2,r:1.4,label:'Read the City Museum plaque',act:()=>say([{who:'City Museum',text:'Inside: a giant blue whale skeleton the staff call Bones, minerals from the goldfields, and shells from Rottnest.'},{who:'City Museum',text:'Fossils you dig up on the island are welcome here too.'}])});
  T.push({x:694,z:-4.4,r:1.4,label:'Watch the gold pour',act:()=>{const h=Math.floor(S.time/60);if([10,12,14].includes(h))say(['A worker tips a crucible and liquid gold pours into a mould, glowing orange like a tiny sunset.','Kip: Whoa. I’m putting a gold leaf on a latte one day. Just one.']);else say([{who:'Gold Exchange',text:'Gold pours at 10:00, 12:00 and 14:00. Come back then!'}]);}});
  const open=S.time>=1080||S.time<120;CBD.trucks.forEach(tk=>T.push({x:tk.x,z:tk.z,r:1.3,label:open?tk.dish+' · '+tk.p+' coins':tk.name+' truck · opens at 6pm',act:()=>{if(!open){toast('The food trucks open at 6pm',2);return;}if(S.coins<tk.p){toast('Not enough coins',2);return;}S.coins-=tk.p;eat(tk.st,tk.dish);save();}}));
  T.push({x:661,z:-13.5,r:1.3,label:'Flat white from the coffee cart · 5 coins',act:()=>{if(S.coins<5){toast('Not enough coins',2);return;}S.coins-=5;eat(15,'Flat white');S.cbd=S.cbd||{};S.cbd.coffees=(S.cbd.coffees||0)+1;save();}});}
// the ferry across Perth Water, between Mends Street Jetty and Barrack Street Jetty
function ferryCross(dest){if(transit||VISIT)return;if(dest==='cbd'&&needPass('cbd'))return;if(!pay(FARE_RIDE))return;transit=true;fadeTarget=.95;toast(dest==='cbd'?'Ferry to Perth CBD · Barrack St Jetty…':'Ferry to South Perth · Mends St Jetty…',2.2);
  setTimeout(()=>{S.time+=10;player.bike=false;player.carry=null;if(dest==='cbd'){player.x=669.5;player.z=11.6;}else{const B=BUS_STOPS.sp;const L=SAFE_SPOTS.sp[0];player.x=L[0];player.z=L[1];}updateCamera(0,true);fadeTarget=0;transit=false;cbdArrive(dest);},900);}
function cbdArrive(dest){if(dest!=='cbd')return;S.seenZ=S.seenZ||{};S.seenZ.cbd=1;S.fq=S.fq||{};if(!S.fq.visitCBD){S.fq.visitCBD=1;save();say(['Kip: The city! Towers, a glass bell tower, a whole park on a hill… and somewhere, the best coffee in Perth.','Kip: Postcards everywhere. Let’s explore.']);}}
const CBD_SPOT=k=>()=>CBD.P[k]?[[CBD.P[k].x,CBD.P[k].z]]:[];
[['belltower','The bell tower','place',4],['eqquay','Elizabeth Quay','place',4.5],['jettycbd','Barrack St Jetty','place',3.6,()=>[[669.5,13]]],['kingspark','Kings Park','place',5],['glassbridge','Glass bridge walk','place',3.6],['kplookout','Kings Park lookout','place',3.4],
 ['haymall','Hay St Mall','place',5],['tudor','Tudor Lane','place',3],['goldex','Gold Exchange','place',3.6],['citymuseum','City Museum','place',3.6],['perthstn','Perth Station','place',4],['foodtrucks','Food trucks','food',3.6],['devtower','Riverview Tower','place',3.4],
 ['agnes','Agnes the bell ringer','people',2.4],['jack','Prospector Jack','people',2.4],['tilly','Ranger Tilly','people',2.4],['mai','Mai the street-food chef','people',2.4],['dev','Dev the office worker','people',2.4],['pete','Pete the busker','people',2.4],['iris','Iris the night guard','people',2.4]]
 .forEach(([id,name,cat,r,pos])=>PCS.push({id,name,zone:'cbd',cat,pos:pos||CBD_SPOT(id),r}));
PC_TOTAL=PCS.filter(p=>!isSpecial(p.cat)).length;
Object.assign(PC_HINTS,{belltower:'The bell tower · the glass spire by the river in Perth CBD',eqquay:'Elizabeth Quay · the plaza with the tall white ribbon sculpture',jettycbd:'Barrack St Jetty · where the ferry from South Perth lands',kingspark:'Kings Park · the big park on the west side of the city',glassbridge:'Glass bridge walk · through the treetops in Kings Park',kplookout:'Kings Park lookout · over the river',
 haymall:'Hay St Mall · the shopping street in the middle of the city',tudor:'Tudor Lane · the old arcade with the clock',goldex:'Gold Exchange · the old limestone building on the east side',citymuseum:'City Museum · on the west end of Hay St Mall',perthstn:'Perth Station · on Wellington Street',foodtrucks:'Food trucks · east end of Hay St Mall, from 6pm',devtower:'Riverview Tower · the tallest office tower on St Georges Tce',
 agnes:'Agnes · rings the bells at the bell tower',jack:'Prospector Jack · outside the Gold Exchange',tilly:'Ranger Tilly · in Kings Park',mai:'Mai · at the food trucks',dev:'Dev · outside Riverview Tower, usually running late',pete:'Pete · busking in Hay St Mall',iris:'Iris · at the City Museum'});
SIDEQ.push(
 {id:'twelvebells',zone:'cbd',mood:'funny',title:'Twelve Bells',giver:'Agnes the bell ringer',coins:45,desc:'Bell seven keeps ringing on its own, at random times, off the beat. Agnes is taking it personally.',
  steps:[{l:'Talk to Agnes by the bell tower',at:'pc:agnes',say:[{who:'Agnes',text:'Bell seven. Ding. At 3:17. At 4:42. Never on the hour! Someone is playing games with my bells.'},{who:'Agnes',text:'Climb up and have a look, would you? My knees and those stairs are not friends.'}]},
   {l:'Climb up to the bell chamber and find the culprit',at:'pc:belltower',chk:()=>!!(S.cbd&&S.cbd.pigeon),say:['Kip: Found it! A pigeon, bouncing on bell seven’s rope like a trampoline.']},
   {l:'Tell Agnes',at:'pc:agnes',say:[{who:'Agnes',text:'A pigeon. Of course it’s a pigeon.'},{who:'Agnes',text:'Well. If it wants to ring that badly, it can be our honorary ringer. On the hour, mind.'}]}],
  outro:'The pigeon now rings bell seven exactly on the hour. Agnes is very proud. She won’t say so.'},
 {id:'nugget',zone:'cbd',mood:'heart',title:'Jack’s Nugget',giver:'Prospector Jack',coins:55,desc:'Jack’s famous “giant nugget” story gets bigger every year. The real nugget is small, and it was a gift for someone special.',
  steps:[{l:'Talk to Prospector Jack at the Gold Exchange',at:'pc:jack',say:[{who:'Prospector Jack',text:'Truth is, the nugget’s no bigger than a jellybean. I gave it to my June on our wedding day. She wore it on a chain for fifty years.'},{who:'Prospector Jack',text:'The Gold Exchange said they’d put it in the window, if I find the old photo of her wearing it. It’s at the City Museum, in their family album box.'}]},
   {l:'Find the photo at the City Museum',at:'pc:citymuseum',say:['Iris helps Kip find it: a young June laughing on the jetty, the little nugget shining at her neck.']},
   {l:'Bring the photo to Jack',at:'pc:jack',say:[{who:'Prospector Jack',text:'That’s her. That’s my June.'},{who:'Prospector Jack',text:'Smallest nugget in the window, and the best story. Thanks, Kip.'}]}],
  outro:'June’s nugget now sits in the Gold Exchange window, next to her photo. Jack visits it every morning.'},
 {id:'lunchrush',zone:'cbd',mood:'funny',title:'Lunch Rush',giver:'Dev the office worker',coins:40,desc:'Dev has a big meeting at 1pm and promised the whole team coffee. He has not bought any coffee.',
  steps:[{l:'Talk to Dev outside Riverview Tower',at:'pc:dev',say:[{who:'Dev',text:'Meeting at one. I promised eight coffees. I have zero coffees and one panic.'},{who:'Dev',text:'The coffee cart in Hay St Mall is the best. Can you grab some? I’ll pay you back. Probably.'}]},
   {l:'Buy coffees from the cart in Hay St Mall (3 or more)',at:'pc:haymall',chk:()=>!!(S.cbd&&S.cbd.coffees>=3),say:['Kip balances a tray of flat whites. Not a drop spilled. Okay, one drop.']},
   {l:'Rush the coffees back to Dev',at:'pc:dev',say:[{who:'Dev',text:'You legend. The boss smiled. The boss never smiles.'}]}],
  outro:'Dev now orders the team’s coffee at 12:30 sharp. He sets three alarms.'},
 {id:'glassbridge',zone:'cbd',mood:'heart',title:'Glass Bridge Brave',giver:'Ranger Tilly',coins:50,desc:'A young quokka visiting the city wants to see the view from the glass bridge, but it’s scared of heights.',
  steps:[{l:'Talk to Ranger Tilly in Kings Park',at:'pc:tilly',say:[{who:'Ranger Tilly',text:'This little one has walked to the bridge three times and turned back three times. Heights are scary.'},{who:'Ranger Tilly',text:'Maybe if a friend walks with them?'}]},
   {l:'Walk across the glass bridge together',at:'pc:glassbridge',say:['Step by step. The quokka holds Kip’s paw so tight. Halfway across, it finally looks up: treetops, the river, the whole city.','The quokka does a tiny happy hop.']},
   {l:'Tell Ranger Tilly',at:'pc:tilly',say:[{who:'Ranger Tilly',text:'They did it! Brave little thing. And brave you, too.'}]}],
  outro:'The young quokka now walks the glass bridge every day. It even does a hop in the middle.'});
