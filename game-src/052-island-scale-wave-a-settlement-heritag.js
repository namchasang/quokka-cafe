// ---------- Island Scale Wave A: Settlement heritage, Kingstown and Army Jetty, four more salt lakes, golf course and airstrip ----------
// Built straight onto the bigger island. Spots were planned on the first bigger island (v1) and WAV1() moves them onto the real-shaped one;
// the salt lakes sit where the real lakes are. Each place looks for a clear patch near its planned spot.
const WAV1=(x,z)=>{const p=isFromV1(x,z);return[p.x,p.z];};
function islGround(x,z){for(const g of ISL_GROUND){const dx=x-g.x,dz=z-g.z;if(Math.abs(dx)>g.bx||Math.abs(dz)>g.bz)continue;const c=Math.cos(g.a||0),s=Math.sin(g.a||0),u=(dx*c+dz*s)/g.rx,v=(-dx*s+dz*c)/g.rz;
  const e=g.box?Math.max(u*u,v*v):u*u+v*v;if(e<(g.t==='lake'?1.38:1))return{g,e,u,v};}return null;}
function islGroundBlock(x,z){const h=ISL_GROUND.length?islGround(x,z):null;return!!(h&&h.g.t==='lake'&&h.e<.9);}
function islAddGround(g){g.bx=Math.max(g.rx,g.rz)*1.3+.5;g.bz=g.bx;ISL_GROUND.push(g);return g;}
// is a rectangle (centre, half sizes) clear: dry land, off paths, away from buildings, stops and lamps
function islOldLake(x,z){const [ox,oz]=islOld(x,z);return Math.min(((ox-42.2)/3.5)**2+((oz+7.5)/1.6)**2,((ox-66.2)/2.6)**2+((oz-2.7)/1.1)**2)<1.6;}
function islSiteOK(x,z,hw,hd,o){o=o||{};const land=o.land==null?1.2:o.land,pm=o.path==null?.9:o.path;
  for(let a=-hw;a<=hw+1e-6;a+=Math.max(.5,hw/4))for(let b=-hd;b<=hd+1e-6;b+=Math.max(.5,hd/4)){const px=x+a,pz=z+b;if(landD(px,pz)<land)return false;if(o.noLake&&islOldLake(px,pz))return false;if(!o.road&&pathD(px,pz)<pm)return false;if(islGroundBlock(px,pz))return false;}
  const pad=o.pad==null?.6:o.pad;for(const c of colliders){if(c.x1>1e8||c.x2<x-hw-pad||c.x1>x+hw+pad||c.z2<z-hd-pad||c.z1>z+hd+pad)continue;const tiny=(c.x2-c.x1)<.6&&(c.z2-c.z1)<.4;if(tiny&&trees.some(t=>Math.abs(t.x-(c.x1+c.x2)/2)<.05&&Math.abs(t.z-(c.z1+c.z2)/2)<.05))continue;return false;}
  if(COACH.some(b=>Math.abs(b.x+.9-x)<hw+1.6&&Math.abs(b.z-.9-z)<hd+1.6))return false;if(LAMPS.some(L=>Math.abs(L.x-x)<hw+.8&&Math.abs(L.z-z)<hd+.8))return false;return true;}
function islFindSite(x,z,hw,hd,o,R){R=R||14;if(islSiteOK(x,z,hw,hd,o))return[x,z];for(let r=.8;r<=R;r+=.8){const n=Math.max(8,Math.round(r*5));for(let i=0;i<n;i++){const t=i/n*6.283,px=x+Math.cos(t)*r,pz=z+Math.sin(t)*r;if(islSiteOK(px,pz,hw,hd,o))return[px,pz];}}return null;}
// clear trees, bushes, grass, flowers and rocks from a rectangle before building on it
function islClear(x1,z1,x2,z2){for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(t.x<x1||t.x>x2||t.z<z1||t.z>z2)continue;scene.remove(t.m);const bi=BB.indexOf(t.m);if(bi>=0)BB.splice(bi,1);
    for(let c=colliders.length-1;c>=0;c--){const C=colliders[c];if(Math.abs((C.x1+C.x2)/2-t.x)<.05&&Math.abs((C.z1+C.z2)/2-t.z)<.05){colliders.splice(c,1);break;}}trees.splice(i,1);}
  scene.children.slice().forEach(m=>{if(!m.isMesh||m.userData.frames||m.__wa)return;const p=m.position;if(p.x<x1||p.x>x2||p.z<z1||p.z>z2)return;const decor=BB.includes(m)&&!m.userData.frames,rock=m.material===limeMat||m.material===limeDark;if(!decor&&!rock)return;scene.remove(m);const bi=BB.indexOf(m);if(bi>=0)BB.splice(bi,1);});}
function islStampPath(p){for(let s=0;s<p.length-1;s++){const [ax,az]=p[s],[bx,bz]=p[s+1];const i0=Math.max(0,Math.floor((Math.min(ax,bx)-1.5-TB.x1)*GR)),i1=Math.min(GW-1,Math.ceil((Math.max(ax,bx)+1.5-TB.x1)*GR)),j0=Math.max(0,Math.floor((Math.min(az,bz)-1.5-TB.z1)*GR)),j1=Math.min(GH-1,Math.ceil((Math.max(az,bz)+1.5-TB.z1)*GR));
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=j*GW+i,d=segD(TB.x1+i/GR,TB.z1+j/GR,ax,az,bx,bz);if(d<ISL_PD[k])ISL_PD[k]=d;}}}
// a short footpath from a door to the nearest island path
function islLinkPath(x,z){let best=null,bd=1e9;for(const P of PATHS)for(let i=0;i<P.length-1;i++){const [ax,az]=P[i],[bx,bz]=P[i+1];if(ax>=99.5)continue;const vx=bx-ax,vz=bz-az,t=clamp(((x-ax)*vx+(z-az)*vz)/(vx*vx+vz*vz||1),0,1),px=ax+vx*t,pz=az+vz*t,d=Math.hypot(px-x,pz-z);if(d<bd){bd=d;best=[px,pz];}}
  if(!best||bd<1||bd>16)return;const p=[[x,z],best];PATHS.push(p);islStampPath(p);}
function islRepaint(){paintTerrain();terrain.material.map.needsUpdate=true;GT.list.forEach(t=>gtDrop(t));GT.job=null;gtInit();GT.fast=true;try{mmBase=renderMapBase(mmFW(),mmFH(),1.15,false);bigBase=null;}catch(e){}}
const waM=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
function waMark(g){g.traverse(o=>o.__wa=1);return g;}
// limestone cottage like the Settlement ones
function waCottage(x,z,wall,roof,ry){const g=new THREE.Group();const w=new THREE.Mesh(new THREE.BoxGeometry(3,1.9,2.4),lmat(plasterC,[2,2],{color:new THREE.Color(wall)}));w.position.y=.95;w.castShadow=w.receiveShadow=true;g.add(w);
  const rf=new THREE.Mesh(new THREE.CylinderGeometry(1.75,1.75,3.4,3),waM(roof));rf.rotation.z=Math.PI/2;rf.position.y=2.35;rf.scale.set(1,1,.7);rf.castShadow=true;g.add(rf);
  const ver=new THREE.Mesh(new THREE.BoxGeometry(3.2,.08,.9),waM(roof));ver.position.set(0,1.72,1.6);ver.rotation.x=.25;ver.castShadow=true;g.add(ver);
  [-1.45,1.45].forEach(px=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.7,6),waM('#f3efe6'));p.position.set(px,.85,1.95);g.add(p);});
  const d=new THREE.Mesh(new THREE.PlaneGeometry(.6,1.15),waM('#2f5a46'));d.position.set(.4,.58,1.21);g.add(d);const wn=new THREE.Mesh(new THREE.PlaneGeometry(.6,.5),winMat);wn.position.set(-.75,1.1,1.21);g.add(wn);
  g.position.set(x,0,z);if(ry)g.rotation.y=ry;scene.add(waMark(g));col(x-1.55,z-1.25,x+1.55,z+1.25);return g;}
function waTree(x,z,v,s){const g=new THREE.PlaneGeometry(v.w*s,v.h*s);g.translate(0,v.h*s/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);m.__wa=1;trees.push({x,z,m,v,fade:false});col(x-.3,z-.15,x+.3,z+.15);return m;}
function waSign(x,z,lines,bg,fg,w){signPost(x,z,makeSign(lines,Math.max(48,Math.max(...lines.map(l=>l.length))*6+8),lines.length>1?20:12,bg,fg),w||1.3,lines.length>1?.5:.32);}
function waNPC(id,name,v,x,z,lines){const m=spriteMesh(humanFrames(v),.95,1.58);m.position.set(x,0,z);scene.add(m);m.__wa=1;const b=blob(.85);b.position.set(x,.03,z);b.__wa=1;const n={id,name,x,z,m,lines};WA.npcs=WA.npcs||[];WA.npcs.push(n);return n;}
// extra things to talk to and read on the new island
function waTargets(T){if(!WA.ready||zoneOf(player.x)!=='island')return;(WA.npcs||[]).forEach(n=>T.push({x:n.x,z:n.z,r:1.4,label:'Talk to '+n.name,act:()=>say(n.lines())}));(WA.plaques||[]).forEach(p=>T.push({x:p.x,z:p.z,r:1.3,label:p.label,act:()=>say(p.say)}));}
const WA_SPOT=k=>()=>WA[k]?[[WA[k].x,WA[k].z]]:[];
// postcards for the new places and people
[['quod','The Quod','place','quod',3.4],['saltstore','Salt Store','place','saltstore',3.2],['chapel','Settlement Chapel','place','chapel',3],['heritage','Heritage cottages','place','heritage',4],['fig','Moreton Bay fig','place','fig',3],
 ['kingstown','Kingstown Barracks','place','kingstown',4],['armyjetty','Army Jetty','place','armyjetty',3],['golf','Rotto Golf Course','place','golf',6],['airport','Rottnest Airport','place','airport',5],
 ['ghlake','Government House Lake','place','ghlake',5],['serpentine','Serpentine Lake','place','serpentine',5],['baghdad','Lake Baghdad','place','baghdad',5],['gardenlake','Garden Lake','place','gardenlake',4],
 ['col','Col the greenkeeper','people','col',2.4],['sal','Sal at the Salt Store','people','sal',2.4],['ash','Ranger Ash','people','ash',2.4],['jo','Pilot Jo','people','jo',2.4]].forEach(([id,name,cat,k,r])=>PCS.push({id,name,zone:'island',cat,pos:WA_SPOT(k),r}));
PC_TOTAL=PCS.filter(p=>!isSpecial(p.cat)).length;
Object.assign(PC_HINTS,{quod:'The Quod · the octagonal limestone building west of the Settlement',saltstore:'Salt Store · the old limestone store on the north foreshore',chapel:'Settlement Chapel · the little limestone church with a bell',heritage:'Heritage cottages · the row of limestone cottages past the Settlement',fig:'Moreton Bay fig · the giant shady tree near the Settlement',
 kingstown:'Kingstown Barracks · the old army barracks on the south side',armyjetty:'Army Jetty · the long jetty below Kingstown',golf:'Rotto Golf Course · the fairways south of the main road',airport:'Rottnest Airport · the little airstrip past the golf course',
 ghlake:'Government House Lake · the big salt lake west of the Settlement',serpentine:'Serpentine Lake · the long, curving salt lake',baghdad:'Lake Baghdad · the salt lake near the north coast',gardenlake:'Garden Lake · the small salt lake by Kingstown',
 col:'Col · the greenkeeper at the golf clubhouse',sal:'Sal · the volunteer at the Salt Store',ash:'Ranger Ash · at Kingstown Barracks',jo:'Pilot Jo · by the airstrip hangar'});
// four new side quests
SIDEQ.push(
 {id:'golfball',zone:'island',mood:'funny',title:'Fore! The Ball Thief',giver:'Col the greenkeeper',coins:45,desc:'Golf balls keep vanishing from the Rotto Golf Course. Col is sure it is a quokka. Col is right.',
  steps:[{l:'Talk to Col at the golf clubhouse',at:'pc:col',say:[{who:'Col',text:'Forty-two golf balls this month, Kip. Forty-two! Little paw prints on every green.'},{who:'Col',text:'Some days I find them in the bunkers, lined up like eggs. It’s making a nest. A nest of golf balls.'}]},
   {l:'Search Garden Lake for golf balls',at:'pc:gardenlake',say:['Kip: Six golf balls, lined up along the salty edge of Garden Lake. And quokka tracks. Lots of them.']},
   {l:'Follow the tracks to the airstrip',at:'pc:airport',say:['Kip: There it is. A quokka sitting on a pile of golf balls under the windsock, looking very proud.','Kip: It swaps one golf ball for a crumb of lamington. Then another. We make a deal: the balls go back, and the quokka gets a lifetime supply of crumbs.']},
   {l:'Bring the golf balls back to Col',at:'pc:col',say:[{who:'Col',text:'All forty-two! …And one that isn’t mine. That’s a ping-pong ball. Where did it even get that?'}]}],
  outro:'Col now leaves one old golf ball by the clubhouse for the quokka. It is never there in the morning.'},
 {id:'saltjar',zone:'island',mood:'heart',title:'The Salt Harvest',giver:'Sal at the Salt Store',coins:55,desc:'Sal’s grandfather harvested salt from the island’s lakes for fifty years. The Salt Store has his old scoop, but not a single grain of island salt.',
  steps:[{l:'Talk to Sal at the Salt Store',at:'pc:sal',say:[{who:'Sal',text:'Grandad worked the salt lakes from when he was fourteen. He said the salt here was the whitest in the colony.'},{who:'Sal',text:'I’d love a jar of real Wadjemup salt in the display, next to his scoop. Just a little, from the lake edge.'}]},
   {l:'Scoop salt crystals at Government House Lake',at:'pc:ghlake',say:['Kip: The crust at the lake edge sparkles like sugar. Kip fills a small jar, very carefully, and leaves the pink water in peace.']},
   {l:'Bring the jar back to Sal',at:'pc:sal',say:[{who:'Sal',text:'Oh… it smells like the lake. Like his coat when he came home.'},{who:'Sal',text:'There. Scoop and salt, side by side, at last. He’d be grinning.'}]}],
  outro:'The jar sits in the Salt Store window with a little label in Kip’s handwriting: “Wadjemup salt, with love.”'},
 {id:'armyjetty',zone:'island',mood:'heart',title:'Evening at Army Jetty',giver:'Ranger Ash',coins:50,desc:'Ash’s dad was posted at Kingstown Barracks as a young soldier. He always talked about the sunsets from Army Jetty.',
  steps:[{l:'Talk to Ranger Ash at Kingstown Barracks',at:'pc:ash',say:[{who:'Ranger Ash',text:'Dad was nineteen when he was posted here. He said the barracks were cold, the food was terrible, and the sunsets made up for all of it.'},{who:'Ranger Ash',text:'He can’t travel now. Could you watch one for him, from the end of Army Jetty?'}]},
   {l:'Stand at the end of Army Jetty after 17:30',at:'pc:armyjetty',after:1050,say:['The sky goes gold, then pink. Out past the reef the water turns the colour of a flat white.','Kip takes a photo for Ash’s dad, and one in his head for Mum and Dad.']},
   {l:'Show Ash the photo',at:'pc:ash',say:[{who:'Ranger Ash',text:'That’s it. That’s exactly how he described it. He’s going to cry, and then he’s going to pretend he didn’t.'}]}],
  outro:'Ash’s dad sent Kip a postcard back: a hand-drawn sunset and “Thanks, mate.”'},
 {id:'windsock',zone:'island',mood:'funny',title:'The Runaway Windsock',giver:'Pilot Jo',coins:40,desc:'The orange windsock at Rottnest Airport blew away in a gust. Jo can’t let the little plane take off without it.',
  steps:[{l:'Talk to Pilot Jo at the airstrip',at:'pc:jo',say:[{who:'Pilot Jo',text:'Big gust off the ocean and whoosh, there goes my windsock. No windsock, no flying. Rules are rules.'},{who:'Pilot Jo',text:'It went east, towards the Settlement. Looking for the café, probably. Everyone does.'}]},
   {l:'Look for the windsock around the Settlement Chapel',at:'pc:chapel',say:['Kip: There it is, hooked on the chapel bell, flapping like a bright orange sock on a washing line.','Kip rings the bell by accident. Very loudly. Twice. The windsock drops into Kip’s paws.']},
   {l:'Bring the windsock back to Jo',at:'pc:jo',say:[{who:'Pilot Jo',text:'You found it! And I heard the bell from here. Very dramatic. Ten out of ten.'}]}],
  outro:'Jo now ties the windsock on with three knots and a ribbon. Just in case.'});
// lay it all out once the island is big
islandLate(()=>{const R=(a,b)=>a+Math.random()*0;const placed=[];const put=(k,x,z,hw,hd,o,Rr)=>{const p=islFindSite(x,z,hw,hd,o,Rr);if(!p){(ISL.miss=ISL.miss||[]).push(k);return null;}islClear(p[0]-hw-.6,p[1]-hd-.6,p[0]+hw+.6,p[1]+hd+.6);placed.push(k);return p;};
  const LIME='#efe3c4';
  // the salt lakes come first so buildings keep clear of them
  [['ghlake','Government House Lake',-108,-6,6.5,4,0],['serpentine','Serpentine Lake',-72,16,8,2.4,-.2],['baghdad','Lake Baghdad',-60,-38,6,3.6,.1],['gardenlake','Garden Lake',-93,6,6,2.6,.52]].forEach(([k,n,x,z,rx,rz,a])=>{
    const p=islFindSite(x,z,rx+.8,rz+.8,{land:1.4,path:.8},18)||islFindSite(x,z,rx*.75+.6,rz*.75+.6,{land:1.2,path:.6},26);if(!p){(ISL.miss=ISL.miss||[]).push(k);return;}islClear(p[0]-rx-1.4,p[1]-rz-1.4,p[0]+rx+1.4,p[1]+rz+1.4);const g=islAddGround({t:'lake',x:p[0],z:p[1],rx,rz,a});WA[k]={x:p[0],z:p[1]+rz+1.2,n};
    const s=[p[0]-rx*.4,p[1]+rz+1.6];if(islSiteOK(s[0],s[1],.3,.3,{path:.5}))waSign(s[0],s[1],[n.toUpperCase()],'#a04a6a','#ffffff',1.6);});
  // Settlement heritage precinct, just past the café's end of the island
  {const p=put('quod',...WAV1(-189,-13),2.9,2.9,{},24);if(p){const g=new THREE.Group();const wall=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,2.4,8),lmat(plasterC,[4,2],{color:new THREE.Color(LIME)}));wall.position.y=1.2;wall.castShadow=wall.receiveShadow=true;g.add(wall);
    const roof=new THREE.Mesh(new THREE.ConeGeometry(2.95,1.3,8),waM('#8a8f96'));roof.position.y=3.05;roof.castShadow=true;g.add(roof);const cap=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.5,8),waM(LIME));cap.position.y=3.8;g.add(cap);
    const d=new THREE.Mesh(new THREE.PlaneGeometry(.8,1.3),waM('#4a3a2a'));d.position.set(0,.65,2.42);g.add(d);[-1.5,1.5].forEach(o=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.4,.5),waM('#3a3e48'));w.position.set(o,1.5,2.0);w.rotation.y=o>0?-.39:.39;g.add(w);});
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.34),new THREE.MeshBasicMaterial({map:makeSign(['THE QUOD · 1864'],64,12,'#5a4a3a','#f5ecd8')}));sg.position.set(0,1.75,2.46);g.add(sg);
    g.position.set(p[0],0,p[1]);scene.add(waMark(g));col(p[0]-2.6,p[1]-2.6,p[0]+2.6,p[1]+2.6);WA.quod={x:p[0],z:p[1]+3.4};
    (WA.plaques=WA.plaques||[]).push({x:p[0]+1.8,z:p[1]+3.2,label:'Read the Quod plaque',say:[{who:'The Quod',text:'Built in 1864 as a prison, the Quod held Aboriginal men and boys taken from across Western Australia. Many died here.'},{who:'The Quod',text:'Today the site is a place of remembrance. The Wadjemup Aboriginal Burial Ground nearby is honoured by the Whadjuk Noongar people.'},'Kip stands quietly for a moment before walking on.']});
    signPost(p[0]+1.8,p[1]+3.2,makeSign(['PLEASE','REMEMBER'],48,20,'#5a4a3a','#f5ecd8'),.8,.4);islLinkPath(p[0],p[1]+2.8);}}
  {const p=put('saltstore',...WAV1(-181,-16.5),2.3,1.6,{},26);if(p){bld(p[0],p[1],4.2,2.8,2.4,LIME,{win:false,roof:'#7a8088',roofH:1,sign:'SALT STORE',signBg:'#4a6a86',noCol:true}).traverse(o=>o.__wa=1);col(p[0]-2.1,p[1]-1.4,p[0]+2.1,p[1]+1.4);
    const d=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.3),waM('#5a3a22'));d.position.set(p[0],.65,p[1]+1.42);scene.add(d);d.__wa=1;WA.saltstore={x:p[0],z:p[1]+2.4};WA.sal={x:p[0]+1.6,z:p[1]+2.1};
    waNPC('sal','Sal',{hair:'#c9c2b4',skin:'#e2b48a',shirt:'#4a6a86',pants:'#c9b68a',hat:'#f3e2b0'},WA.sal.x,WA.sal.z,()=>[{who:'Sal',text:pick(['The Salt Store was built in 1868. Island salt went all the way to the mainland by boat.','Grandad said you could tell good salt by the crunch. Island salt crunches like frost.','Have you seen the lakes turn pink in summer? Tiny algae. Not a filter, I promise.'])}]);islLinkPath(p[0],p[1]+2);}}
  {const p=put('chapel',...WAV1(-196,-14.5),1.6,2.2,{},26);if(p){const g=bld(p[0],p[1],3,4,2.4,LIME,{win:false,roof:'#5a6a7a',roofH:1.3,noCol:true});g.traverse(o=>o.__wa=1);col(p[0]-1.5,p[1]-2,p[0]+1.5,p[1]+2);
    const t=box(1,1.4,1,lmat(plasterC,[1,1],{color:new THREE.Color(LIME)}),p[0],3.5,p[1]+1.4);t.__wa=1;const cone=new THREE.Mesh(new THREE.ConeGeometry(.75,1.1,4),waM('#5a6a7a'));cone.rotation.y=Math.PI/4;cone.position.set(p[0],4.75,p[1]+1.4);scene.add(cone);cone.__wa=1;
    const bell=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6,0,6.283,0,Math.PI/2),waM('#c8a040'));bell.rotation.x=Math.PI;bell.position.set(p[0],3.6,p[1]+1.92);scene.add(bell);bell.__wa=1;
    const d=new THREE.Mesh(new THREE.PlaneGeometry(.8,1.3),waM('#5a3a22'));d.position.set(p[0],.65,p[1]+2.02);scene.add(d);d.__wa=1;WA.chapel={x:p[0],z:p[1]+3};islLinkPath(p[0],p[1]+2.6);}}
  {const spots=[[-176,-10],[-171.5,-10],[-167,-10],[-176,-16.5],[-171,-16.5],[-166,-16]].map(p=>WAV1(p[0],p[1]));const C=[[LIME,'#3f7a5a'],['#e8d2a6','#c9473f'],[LIME,'#2f78a8'],['#f2e6c8','#c9473f'],['#e8d2a6','#3f7a5a'],[LIME,'#7a5033']];let n=0,first=null;
    spots.forEach(([x,z],i)=>{const p=put('cottage'+i,x,z,1.7,1.4,{pad:.4},26);if(!p)return;waCottage(p[0],p[1],C[i][0],C[i][1],0);n++;if(!first)first=p;islLinkPath(p[0]+.4,p[1]+1.8);});if(first)WA.heritage={x:first[0],z:first[1]+2.6};}
  {const fv=treeVariants[1];[[-185,-8.5],[-193,-9],[-175,-13.5]].map(p=>WAV1(p[0],p[1])).forEach(([x,z],i)=>{const p=put('fig'+i,x,z,1.2,.8,{pad:.3},9);if(!p)return;waTree(p[0],p[1],fv,1.75);if(i===0)WA.fig={x:p[0],z:p[1]+2};});
   const pine=treeVariants[3];for(let x0=-200;x0<=-160;x0+=5.5){const q=WAV1(x0,-24),x=q[0],zE=WAV1(x0,-6)[1];let z=q[1];while(z<zE&&landD(x,z)<2.2)z+=.5;const p=put('pine'+x0,x,z,.6,.5,{land:1.1,pad:.3},4);if(p)waTree(p[0],p[1],pine,1);}}
  // Kingstown Barracks and Army Jetty on the south side
  {const p=put('kingstown',...WAV1(-185,10),4.6,1.7,{},20);if(p){bld(p[0],p[1],9,3,2.6,'#e8dcc0',{win:true,parapet:'#c9b896',ver:'#7a5033',sign:'KINGSTOWN BARRACKS · 1936',signBg:'#4a5a3a',noCol:true}).traverse(o=>o.__wa=1);col(p[0]-4.5,p[1]-1.5,p[0]+4.5,p[1]+1.6);
    const q=put('kingstown2',p[0]+8.5,p[1]+.6,3,1.5,{},5);if(q){bld(q[0],q[1],6,3,2.4,'#e8dcc0',{win:true,parapet:'#c9b896',noCol:true}).traverse(o=>o.__wa=1);col(q[0]-3,q[1]-1.5,q[0]+3,q[1]+1.5);}
    const f=box(.08,4.2,.08,waM('#d8d8d0'),p[0]-5.8,2.1,p[1]+2.4);f.__wa=1;const fl=new THREE.Mesh(new THREE.PlaneGeometry(.9,.55),new THREE.MeshLambertMaterial({color:0x1f3a7a,side:THREE.DoubleSide}));fl.position.set(p[0]-5.35,3.9,p[1]+2.4);scene.add(fl);fl.__wa=1;col(p[0]-5.9,p[1]+2.3,p[0]-5.7,p[1]+2.5);
    WA.kingstown={x:p[0],z:p[1]+3};WA.ash={x:p[0]+2.6,z:p[1]+2.6};waNPC('ash','Ranger Ash',{hair:'#6b4226',skin:'#c68a5e',shirt:'#5a6a3a',pants:'#c9b68a',hat:'#7a6a4a'},WA.ash.x,WA.ash.z,()=>[{who:'Ranger Ash',text:pick(['Kingstown Barracks housed soldiers guarding Fremantle in the 1930s and 40s. Now school groups stay here to learn about the island.','The big guns on Oliver Hill were run from here. Ask me about the tunnels some time.','Quokka count this morning: lots. Very scientific.'])}]);islLinkPath(p[0],p[1]+2.4);
    // Army Jetty: walk south from the barracks to the water, then out over the sea
    // Army Jetty: from the barracks out over the nearest shore (any of the four directions)
    const L=10,w=1.3;let best=null;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([ux,uz])=>{let x=p[0]+ux*3+(uz?4:0),z=p[1]+uz*3+(ux?3:0),d=0;while(d<40&&landD(x,z)>.3){x+=ux*.4;z+=uz*.4;d+=.4;}if(d<40&&(!best||d<best.d))best={x,z,ux,uz,d};});
    const J=best||{x:p[0]+4,z:p[1]+3,ux:0,uz:1};const jx=J.x,jz=J.z,ux=J.ux,uz=J.uz;const cx=jx+ux*(L/2-1.2),cz=jz+uz*(L/2-1.2);
    const deck=box(ux?L:w,.14,ux?w:L,lmat(deckC,ux?[6,1]:[1,6]),cx,.06,cz,{noCast:true});deck.__wa=1;for(let i=0;i<7;i++)[-.55,.55].forEach(o=>{const pl=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.2,6),legMat);pl.position.set(jx+ux*i*1.5+(uz?o:0),-.35,jz+uz*i*1.5+(ux?o:0));scene.add(pl);pl.__wa=1;});
    {const e1x=jx-ux*1.5,e1z=jz-uz*1.5,e2x=jx+ux*(L-1.3),e2z=jz+uz*(L-1.3),hw=w/2-.08;ISL_WALK.push({x1:Math.min(e1x,e2x)-(uz?hw:0),x2:Math.max(e1x,e2x)+(uz?hw:0),z1:Math.min(e1z,e2z)-(ux?hw:0),z2:Math.max(e1z,e2z)+(ux?hw:0)});}
    WA.armyjetty={x:jx+ux*(L-2.4),z:jz+uz*(L-2.4)};const sgn=1,sg=1;waSign(jx-ux*1.6-(uz?1.2:0),jz-uz*1.6-(ux?1.2:0),['ARMY JETTY'],'#1d3a6e','#f5ecd8',1.2);}}
  // Rotto Golf Course and the airstrip
  {const c=put('golfhouse',-150,13,2,1.4,{},8);if(c){bld(c[0],c[1],4,2.6,2.2,'#f6f0e2',{win:true,roof:'#3e7d5c',roofH:.9,sign:'ROTTO GOLF · 9 HOLES',signBg:'#2f5a3a',noCol:true}).traverse(o=>o.__wa=1);col(c[0]-2,c[1]-1.3,c[0]+2,c[1]+1.3);WA.col={x:c[0]+2.4,z:c[1]+2.2};
    waNPC('col','Col',{hair:'#d8d4cc',skin:'#f1c7a0',shirt:'#3e7d5c',pants:'#f6f2e8',hat:'#f6f2e8',cap:true},WA.col.x,WA.col.z,()=>[{who:'Col',text:pick(['Nine holes, one lake, four hundred quokkas. Par is whatever the quokkas allow.','Mind the bunkers. The quokkas think they’re sandpits. They are not wrong.','Best view on the island from the seventh tee. Don’t tell the lighthouse.'])}]);islLinkPath(c[0],c[1]+1.8);}
   const gx=c?c[0]+14:WAV1(-154,13.5)[0],gz=c?c[1]+4:WAV1(-154,13.5)[1];const F=[[gx-4,gz,9,3.2,.08],[gx+8,gz+2.2,7,2.6,-.1],[gx+17,gz-.5,6,2.4,.15]];let okF=0;
   F.forEach(([x,z,rx,rz,a],i)=>{let ok=true;for(let t=0;t<6.28;t+=.5)if(landD(x+Math.cos(t)*rx,z+Math.sin(t)*rz)<1.6)ok=false;if(landD(x,z)<2||!ok)return;okF++;islClear(x-rx,z-rz,x+rx,z+rz);islAddGround({t:'fairway',x,z,rx,rz,a});const gxp=x+rx*.8*Math.cos(a),gzp=z+rx*.8*Math.sin(a);islAddGround({t:'green',x:gxp,z:gzp,rx:1.7,rz:1.4});
     const pole=box(.04,1.6,.04,waM('#f6f6f0'),gxp,.8,gzp);pole.__wa=1;const fl=new THREE.Mesh(new THREE.PlaneGeometry(.5,.32),new THREE.MeshLambertMaterial({color:i===1?0xf1c64a:0xd8342a,side:THREE.DoubleSide}));fl.position.set(gxp+.25,1.45,gzp);scene.add(fl);fl.__wa=1;
     islAddGround({t:'bunker',x:x-rx*.35,z:z+rz*.75,rx:1.5,rz:.75,a:.2});});
   if(okF)WA.golf={x:gx,z:gz+3.6};
   const ax=-118,az=1;const ap=islFindSite(ax,az,13,1.8,{land:1.8,path:.5},12);if(ap){islClear(ap[0]-14,ap[1]-2.5,ap[0]+14,ap[1]+2.5);islAddGround({t:'tarmac',x:ap[0],z:ap[1],rx:13,rz:1.4,box:true});
     const hp=put('hangar',ap[0]-9,ap[1]-4.4,2.4,1.6,{},5);if(hp){bld(hp[0],hp[1],4.8,3,2.6,'#c8ced6',{win:false,roof:'#8a9098',roofH:.8,sign:'ROTTNEST AIRPORT',signBg:'#1d3a6e',noCol:true}).traverse(o=>o.__wa=1);col(hp[0]-2.4,hp[1]-1.5,hp[0]+2.4,hp[1]+1.5);WA.jo={x:hp[0]+3,z:hp[1]+2};
       waNPC('jo','Pilot Jo',{hair:'#2a1d16',skin:'#8d5a3b',shirt:'#f6f6f0',pants:'#1d3a6e',hat:'#1d3a6e',cap:true},WA.jo.x,WA.jo.z,()=>[{who:'Pilot Jo',text:pick(['Twelve minutes from Jandakot to here. Best commute in Australia.','From up there the salt lakes look like someone spilled a strawberry milkshake.','I once had to taxi around a quokka for ten minutes. It would not move. Absolute legend.'])}]);islLinkPath(hp[0],hp[1]+1.8);}
     const ws=box(.06,2.4,.06,waM('#d8d8d0'),ap[0]+10,1.2,ap[1]-2.8);ws.__wa=1;const sock=new THREE.Mesh(new THREE.ConeGeometry(.2,1,8,1,true),new THREE.MeshLambertMaterial({color:0xf08a2a,side:THREE.DoubleSide}));sock.rotation.z=Math.PI/2;sock.position.set(ap[0]+10.5,2.3,ap[1]-2.8);scene.add(sock);sock.__wa=1;WA.sock=sock;
     const pl=new THREE.Group();const fu=new THREE.Mesh(new THREE.BoxGeometry(2.6,.5,.55),waM('#f6f6f0'));fu.position.y=.6;pl.add(fu);const wi=new THREE.Mesh(new THREE.BoxGeometry(.6,.08,3.4),waM('#c8344a'));wi.position.set(.2,.85,0);pl.add(wi);const ta=new THREE.Mesh(new THREE.BoxGeometry(.4,.6,.08),waM('#c8344a'));ta.position.set(-1.2,.95,0);pl.add(ta);const ta2=new THREE.Mesh(new THREE.BoxGeometry(.35,.06,1.2),waM('#c8344a'));ta2.position.set(-1.2,.7,0);pl.add(ta2);
     pl.traverse(o=>{if(o.isMesh)o.castShadow=true;});pl.position.set(ap[0]-4,0,ap[1]);scene.add(waMark(pl));col(ap[0]-5.4,ap[1]-.5,ap[0]-2.6,ap[1]+.5);WA.airport={x:ap[0],z:ap[1]+2.6};}}
  // salt lakes and golf greens are painted into the ground; lakes block walking
  WA.ready=true;WA.placed=placed;});
