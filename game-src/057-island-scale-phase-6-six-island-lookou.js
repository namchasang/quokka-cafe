// ---------- Island Scale phase 6: six island lookouts with trails and binoculars, plus boats in the bays ----------
const LK={list:[],acts:[]};
function lkS(){S.lk=S.lk||{};return S.lk;}
PCAT.lookout={label:'Lookouts',col:'#9a7ad8'};PC_TIP.lookout='a lookout platform, walk the trail to the top';
// little pictures for the binocular views
const VISTA_ART={
  skyline:(x,a,b)=>{x.fillStyle='rgba(110,120,140,.85)';[[-50,18],[-38,30],[-26,22],[-14,44],[-4,36],[6,52],[16,30],[26,40],[38,20],[48,26]].forEach(([o,h])=>x.fillRect(a+o,b-h,10,h));x.fillStyle='rgba(255,255,255,.5)';x.fillRect(a+8,b-48,2,40);},
  ferry:(x,a,b,t)=>{x.fillStyle='rgba(255,255,255,.7)';x.fillRect(a-46,b+5,34,3);x.fillStyle='#f6f6f0';x.beginPath();x.moveTo(a-22,b);x.lineTo(a+22,b);x.lineTo(a+16,b+8);x.lineTo(a-18,b+8);x.fill();x.fillStyle='#2f78a8';x.fillRect(a-12,b-8,24,8);x.fillStyle='#c8344a';x.fillRect(a-2,b-14,6,6);},
  pinklake:(x,a,b)=>{x.fillStyle='#f2ece0';x.beginPath();x.ellipse(a,b,46,16,0,0,6.283);x.fill();x.fillStyle='#ec9cb4';x.beginPath();x.ellipse(a,b,40,12,0,0,6.283);x.fill();},
  train:(x,a,b)=>{x.strokeStyle='#6a5a4a';x.lineWidth=2;x.beginPath();x.moveTo(a-60,b+8);x.lineTo(a+60,b+8);x.stroke();[0,1,2].forEach(i=>{x.fillStyle=i?'#f1c64a':'#1f5a3a';x.fillRect(a+18-i*20,b-6,18,12);x.fillStyle='#c8344a';x.fillRect(a+17-i*20,b-8,20,3);});},
  gunpit:(x,a,b)=>{x.fillStyle='#9a9a94';x.beginPath();x.ellipse(a,b,26,10,0,0,6.283);x.fill();x.fillStyle='#6a6e66';x.beginPath();x.ellipse(a,b,18,6,0,0,6.283);x.fill();x.strokeStyle='#4a5a3a';x.lineWidth=4;x.beginPath();x.moveTo(a,b-4);x.lineTo(a+30,b-12);x.stroke();},
  boats:(x,a,b)=>{[[-24,0,'#f6f6f0'],[0,6,'#2f78a8'],[24,-2,'#f1c64a']].forEach(([o,d,c])=>{x.fillStyle=c;x.fillRect(a+o-9,b+d,18,5);x.strokeStyle='#3a3a40';x.lineWidth=1.5;x.beginPath();x.moveTo(a+o,b+d);x.lineTo(a+o,b+d-18);x.stroke();});},
  lighthouse:(x,a,b)=>{x.fillStyle='#f6f4ee';x.beginPath();x.moveTo(a-8,b+20);x.lineTo(a-5,b-22);x.lineTo(a+5,b-22);x.lineTo(a+8,b+20);x.fill();x.fillStyle='#c8344a';x.fillRect(a-6,b-30,12,8);x.fillStyle='#ffe9a0';x.fillRect(a-4,b-28,8,4);},
  lighthouse2:(x,a,b)=>{x.fillStyle='#e8dcc0';x.beginPath();x.moveTo(a-6,b+14);x.lineTo(a-4,b-16);x.lineTo(a+4,b-16);x.lineTo(a+6,b+14);x.fill();x.fillStyle='#3a3a40';x.fillRect(a-5,b-22,10,6);},
  sailboat:(x,a,b)=>{x.fillStyle='#f6f6f0';x.beginPath();x.moveTo(a,b-30);x.lineTo(a,b);x.lineTo(a+20,b);x.fill();x.fillStyle='#e8734a';x.beginPath();x.moveTo(a-2,b-24);x.lineTo(a-2,b);x.lineTo(a-14,b);x.fill();x.fillStyle='#2f78a8';x.fillRect(a-16,b,38,6);},
  swimmers:(x,a,b,t)=>{for(let i=0;i<4;i++){const px=a-30+i*20,py=b+Math.sin(t*2+i)*2;x.fillStyle=['#f1c7a0','#c68a5e','#8d5a3b','#f1c7a0'][i];x.beginPath();x.arc(px,py,4,0,6.283);x.fill();x.fillStyle=['#e8734a','#f1c64a','#2f78a8','#c85ab0'][i];x.fillRect(px-4,py-5,8,2);x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1.5;x.beginPath();x.ellipse(px,py+4,8,2,0,0,6.283);x.stroke();}},
  surfer:(x,a,b,t)=>{x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.moveTo(a-50,b+8);x.quadraticCurveTo(a-10,b-18,a+40,b+8);x.fill();x.fillStyle='#e8734a';x.save();x.translate(a,b);x.rotate(-.2+Math.sin(t)*.1);x.fillRect(-16,0,32,4);x.fillStyle='#2a2a30';x.fillRect(-3,-16,6,16);x.fillStyle='#f1c7a0';x.beginPath();x.arc(0,-19,4,0,6.283);x.fill();x.restore();},
  isle:(x,a,b)=>{x.fillStyle='#8a8478';x.beginPath();x.ellipse(a,b+4,40,10,0,Math.PI,0);x.fill();x.fillStyle='#6f9a4a';x.beginPath();x.ellipse(a-4,b-4,28,9,0,Math.PI,0);x.fill();x.fillStyle='rgba(255,255,255,.7)';x.fillRect(a-42,b+4,84,3);},
  flag:(x,a,b)=>{x.fillStyle='#f6f2e8';x.beginPath();x.ellipse(a,b+4,9,4,0,0,6.283);x.fill();x.strokeStyle='#3a3a40';x.lineWidth=2;x.beginPath();x.moveTo(a,b+2);x.lineTo(a,b-22);x.stroke();x.fillStyle='#d8342a';x.fillRect(a,b-22,16,11);x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();x.moveTo(a,b-22);x.lineTo(a+16,b-11);x.stroke();x.fillStyle='#2a3240';x.beginPath();x.arc(a-18,b+2,4,0,6.283);x.fill();},
  lake:(x,a,b)=>{x.fillStyle='#f2ece0';x.beginPath();x.ellipse(a,b,56,14,0,0,6.283);x.fill();x.fillStyle='#8fc8c4';x.beginPath();x.ellipse(a,b,50,10,0,0,6.283);x.fill();x.fillStyle='rgba(255,255,255,.5)';x.fillRect(a-30,b-2,26,2);},
  quokka:(x,a,b)=>{x.fillStyle='#8a8478';x.beginPath();x.ellipse(a,b+8,18,7,0,Math.PI,0);x.fill();x.fillStyle='#8a6a4a';x.beginPath();x.ellipse(a,b-2,8,10,0,0,6.283);x.fill();x.beginPath();x.arc(a+2,b-13,6,0,6.283);x.fill();x.fillStyle='#5a4030';x.beginPath();x.arc(a-2,b-19,2.5,0,6.283);x.arc(a+6,b-19,2.5,0,6.283);x.fill();x.fillStyle='#1a1a1a';x.fillRect(a+3,b-14,2,2);},
  osprey:(x,a,b,t)=>WHALE_ART.osprey(x,a,b,t)};
// a view from a lookout: sea, a strip of island in front, and three things to find
function vistaDraw(seed,landTop,T){const R=srand(seed);const bush=[];for(let i=0;i<24;i++)bush.push([R()*640,landTop+10+R()*(400-landTop),6+R()*10]);
  return binoWrap(seaView(seed,(x,t)=>{T.forEach(q=>{if(!q.land){const p=spotPos(q,t);VISTA_ART[q.art](x,p[0],p[1],t);}});
    x.fillStyle='#7aa452';x.beginPath();x.moveTo(0,400);for(let i=0;i<=16;i++)x.lineTo(i*40,landTop+Math.sin(i*1.3+seed)*10);x.lineTo(640,400);x.fill();
    x.fillStyle='#e8dcb8';x.beginPath();x.moveTo(0,landTop+12);for(let i=0;i<=16;i++)x.lineTo(i*40,landTop+Math.sin(i*1.3+seed)*10+2);for(let i=16;i>=0;i--)x.lineTo(i*40,landTop+Math.sin(i*1.3+seed)*10+9);x.fill();
    bush.forEach(([bx,by,s])=>{x.fillStyle='#5a8a3e';x.beginPath();x.arc(bx,by,s,0,6.283);x.fill();x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(bx-s*.3,by-s*.3,s*.4,0,6.283);x.fill();});
    T.forEach(q=>{if(q.land){const p=spotPos(q,t);VISTA_ART[q.art](x,p[0],p[1],t);}});}));}
const LOOKOUTS=[
 {id:'wadjemup',name:'Wadjemup Hill',near:()=>{const p=PCS.find(q=>q.id==='wadjemup').pos()[0];return[p[0]+5,p[1]+4];},land:250,seed:101,
  T:[{id:'perth',art:'skyline',name:'Perth city',x:330,y:150,r:34,fact:'Perth city · 19 km away across the water. On a clear day you can pick out the tallest towers.'},{id:'ferry',art:'ferry',name:'Ferry',x:180,y:200,r:28,pos:t=>[180+Math.sin(t*.12)*60,200],fact:'Ferry · bringing the next load of happy day-trippers (and their cake orders).'},{id:'pink',art:'pinklake',name:'Pink salt lake',x:430,y:315,r:36,land:1,fact:'Pink lake · tiny algae turn some salt lakes pink in summer.'}]},
 {id:'oliver',name:'Oliver Hill',near:()=>{const p=PCS.find(q=>q.id==='oliverhill').pos()[0];return[p[0]-3,p[1]+2];},land:265,seed:102,
  T:[{id:'train',art:'train',name:'Quokka Express',x:210,y:318,r:36,land:1,pos:t=>[210+Math.sin(t*.25)*50,318],fact:'Quokka Express · the little train climbing up to the battery.'},{id:'gun',art:'gunpit',name:'Gun pit',x:450,y:320,r:30,land:1,fact:'Gun pit · from up here you can see how the guns pointed out to sea.'},{id:'boats',art:'boats',name:'Boats at Geordie Bay',x:470,y:190,r:34,fact:'Geordie Bay · holiday boats bobbing on their moorings.'}]},
 {id:'bathurst',name:'Bathurst Point',near:()=>{const p=PCS.find(q=>q.id==='bathurst').pos()[0];return[p[0]-5,p[1]+3];},land:300,seed:103,
  T:[{id:'light',art:'lighthouse',name:'Bathurst Lighthouse',x:470,y:285,r:30,land:1,fact:'Bathurst Lighthouse · small but mighty, guiding boats into Thomson Bay since 1900.'},{id:'sail',art:'sailboat',name:'Yacht',x:190,y:200,r:28,pos:t=>[190+Math.sin(t*.18)*50,200],fact:'Yacht · the sea breeze here is called the Fremantle Doctor. Sailors love it.'},{id:'swim',art:'swimmers',name:'Swimmers',x:320,y:252,r:32,fact:'Swimmers · Pinky Beach is calm and shallow. Perfect for a morning dip.'}]},
 {id:'salmonpt',name:'Salmon Point',near:()=>{const b=WB.bigsalmon;return b?[b.x-9,b.z-1.5]:[26,10];},near2:()=>{const b=WB.bigsalmon;return b?[b.x+8,b.z-2]:[40,20];},land:300,seed:104,
  T:[{id:'surf',art:'surfer',name:'Surfer',x:230,y:230,r:32,pos:t=>[230+Math.sin(t*.3)*40,230],fact:'Surfer · the south coast catches the big ocean swell.'},{id:'isle',art:'isle',name:'Green Island',x:450,y:205,r:36,fact:'Green Island · a tiny rocky island where sea birds nest.'},{id:'flag',art:'flag',name:'Snorkel flag',x:330,y:270,r:28,fact:'Snorkel flag · red with a white stripe means someone is diving below. Boats go slow!'}]},
 {id:'herschel',name:'Mt Herschel',near:()=>{const l=MAP_LABELS.find(q=>q[0]==='Lake Herschel');return l?[l[1]+2,l[2]-7]:[4,0];},land:220,seed:105,
  T:[{id:'lake',art:'lake',name:'Lake Herschel',x:300,y:310,r:40,land:1,fact:'Lake Herschel · a salt lake where banded stilts wade and feed.'},{id:'wl',art:'lighthouse2',name:'Wadjemup Lighthouse',x:150,y:238,r:26,land:1,fact:'Wadjemup Lighthouse · the tall limestone tower in the middle of the island.'},{id:'osprey',art:'osprey',name:'Osprey',x:430,y:110,r:30,pos:t=>[430+Math.sin(t*.3)*70,110+Math.sin(t*.8)*12],fact:'Osprey · hunting over the lake. Look for the white chest.'}]},
 {id:'cape',name:'Cape Vlamingh',cape:true}];
function lkDone(id){const L=lkS();if(L[id])return;L[id]=1;S.coins+=25;const n=LOOKOUTS.filter(l=>L[l.id]).length;toast('Lookout '+n+' / 6 · '+LOOKOUTS.find(l=>l.id===id).name+' · +25 coins',2.6);
  if(n===6&&!L.all){L.all=1;S.coins+=50;setTimeout(()=>toast('All six lookouts! You are now a Wadjemup Wanderer · +50 coins',3.4),2700);}save();}
function lkView(L){const T=L.T.map(q=>Object.assign({},q));spotOpen({eye:L.name+' lookout · binoculars',title:'Find 3 things from the top',hint:'Turn the binoculars slowly. Some things move.',targets:T,draw:vistaDraw(L.seed,L.land,T),hintAt:16,doneTitle:'What a view!',done:()=>lkDone(L.id)});}
UNLOCKS.push({id:'wanderer',name:'Wadjemup Wanderer',how:'Visit all six island lookouts',ok:()=>!!(S.lk&&S.lk.all),mail:['Rottnest Island Authority','Six lookouts, six views! You’ve seen Wadjemup from every high point. Welcome to the Wadjemup Wanderers.']});
LOOKOUTS.forEach(L=>PCS.push({id:'lk_'+L.id,name:L.name+' lookout',zone:'island',cat:'lookout',pos:()=>L.at?[[L.at[0],L.at[1]]]:[],r:3.4}));
PC_TOTAL=PCS.filter(p=>!isSpecial(p.cat)).length;
LOOKOUTS.forEach(L=>PC_HINTS['lk_'+L.id]=L.name+' lookout · follow the yellow-topped trail posts');
function lkTargets(T){if(!LK.ready||zoneOf(player.x)!=='island')return;LK.acts.forEach(a=>T.push(a));}
// a wiggly walking trail from the lookout to the nearest path, with yellow-topped marker posts
function lkTrail(x,z,R){let best=null,bd=1e9;for(const P of PATHS)for(let i=0;i<P.length-1;i++){const [ax,az]=P[i],[bx,bz]=P[i+1];if(ax>=99.5||P.__lk)continue;const vx=bx-ax,vz=bz-az,t=clamp(((x-ax)*vx+(z-az)*vz)/(vx*vx+vz*vz||1),0,1),px=ax+vx*t,pz=az+vz*t,d=Math.hypot(px-x,pz-z);if(d<bd){bd=d;best=[px,pz];}}
  if(!best||bd<1.5)return 0;const L=bd,n=Math.max(2,Math.round(L/3)),nx=-(best[1]-z)/L,nz=(best[0]-x)/L,pts=[];
  for(let i=0;i<=n;i++){const t=i/n,w=(i&&i<n)?Math.sin(i*2.1+R()*2)*.9:0;pts.push([lerp(x,best[0],t)+nx*w,lerp(z,best[1],t)+nz*w]);}
  pts.__lk=1;PATHS.push(pts);islStampPath(pts);
  const post=waM('#7a5a3a'),top=waM('#f1c64a');for(let d=2.5;d<L-1;d+=4){const t=d/L,s=(Math.floor(d/4)%2?1:-1)*1.1,px=lerp(x,best[0],t)+nx*s,pz=lerp(z,best[1],t)+nz*s;if(landD(px,pz)<.8||!islSiteOK(px,pz,.1,.1,{path:.5,land:.6,pad:0}))continue;
    const p=box(.12,.7,.12,post,px,.35,pz);p.__wa=1;const c=box(.14,.14,.14,top,px,.76,pz);c.__wa=1;}
  for(let i=0;i<pts.length-1;i++)islClear(Math.min(pts[i][0],pts[i+1][0])-.4,Math.min(pts[i][1],pts[i+1][1])-.4,Math.max(pts[i][0],pts[i+1][0])+.4,Math.max(pts[i][1],pts[i+1][1])+.4);return L;}
// a stone platform with railing, a bench, a sign and coin binoculars
function lkPlatform(x,z,name){const g=new THREE.Group();const fl=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.9,.14,18),lmat(stoneC,[2,2]));fl.position.y=.07;fl.receiveShadow=true;g.add(fl);
  for(let i=0;i<=12;i++){const a=Math.PI*1.05+i/12*Math.PI*.9;const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.7,.06),fenceMat);p.position.set(Math.cos(a)*1.7,.45,Math.sin(a)*1.7);g.add(p);}
  for(let i=0;i<12;i++){const a0=Math.PI*1.05+i/12*Math.PI*.9,a1=Math.PI*1.05+(i+1)/12*Math.PI*.9,mx=(Math.cos(a0)+Math.cos(a1))*.85,mz=(Math.sin(a0)+Math.sin(a1))*.85;const r=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.46),fenceMat);r.position.set(mx,.78,mz);r.lookAt(new THREE.Vector3(Math.cos(a1)*1.7,.78,Math.sin(a1)*1.7).add(new THREE.Vector3(0,0,0)));g.add(r);}
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,1,6),legMat);st.position.set(.5,.55,-1);g.add(st);const bn=new THREE.Group();[-.1,.1].forEach(o=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.08,.09,.32,8),waM('#f1c64a'));t.rotation.x=Math.PI/2;t.position.set(o,0,0);bn.add(t);});bn.position.set(.5,1.12,-1);g.add(bn);
  const be=new THREE.Mesh(new THREE.BoxGeometry(1.1,.08,.34),lmat(deckC,[1,1]));be.position.set(-.7,.45,-.6);g.add(be);[-.42,.42].forEach(o=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.06,.36,.3),legMat);l.position.set(-.7+o,.25,-.6);g.add(l);});
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.position.set(x,0,z);scene.add(waMark(g));col(x+.42,z-1.08,x+.58,z-.92);
  waSign(x-1.9,z+1.1,[name.toUpperCase(),'LOOKOUT'],'#5a3a8a','#ffffff',1.2);}
// moored boats in the north bays: a little detail for the bigger island
function lkYacht(x,z,c,ry){const g=new THREE.Group();const h=new THREE.Mesh(new THREE.BoxGeometry(2,.4,.8),waM('#f6f6f0'));h.position.y=.08;g.add(h);const st=new THREE.Mesh(new THREE.BoxGeometry(2.02,.1,.82),waM(c));st.position.y=-.05;g.add(st);
  const cb=new THREE.Mesh(new THREE.BoxGeometry(.8,.3,.55),waM('#e8e2d0'));cb.position.set(-.2,.42,0);g.add(cb);const m=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,2.6,5),legMat);m.position.set(.2,1.5,0);g.add(m);
  g.position.set(x,-.12,z);g.rotation.y=ry;g.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(waMark(g));}
islandLate(()=>{const R=srand(606);
  LOOKOUTS.forEach(L=>{if(L.cape){const lk=IW(97.4,.4);L.at=[lk.x,lk.z];lkTrail(lk.x-2.5,lk.z+1,R);return;}
    const n=L.near();const n2=L.near2?L.near2():n;const p=islFindSite(n[0],n[1],2,1.9,{land:1.6,path:.9,noLake:1},12)||islFindSite(n2[0],n2[1],2,1.9,{land:1.2,path:.7,noLake:1},14)||islFindSite(n[0],n[1],1.8,1.7,{land:1,path:.6,noLake:1},22);if(!p){console.warn('no lookout site',L.id);return;}islClear(p[0]-2.2,p[1]-2.2,p[0]+2.2,p[1]+2.2);
    lkPlatform(p[0],p[1],L.name);L.at=[p[0],p[1]+2.2];lkTrail(p[0],p[1]+1.9,R);
    // a few shrubs along the top
    const v=treeVariants[2]||treeVariants[0];[[-2.8,-1.2],[2.9,-.8]].forEach(([dx,dz])=>{if(islSiteOK(p[0]+dx,p[1]+dz,.4,.3,{path:.6,land:1}))waTree(p[0]+dx,p[1]+dz,v,.7);});
    LK.acts.push({x:p[0]+.5,z:p[1]-.2,r:1.2,label:'Look through the binoculars · '+L.name,act:()=>{if(overlay)return;lkView(L);}});});
  // boats at Longreach and Geordie Bay, and a couple of yachts off Salmon Bay
  const G=XPL.stops.find(s=>s.id==='geordie'),SB=WB.bigsalmon;const spots=[];
  [[-10,-1],[-6,-1],[-2.5,-1],[-24,-1],[-28,-1]].forEach(([dx,sd])=>{const x=G.x+dx;let z=wbCoastZ(x,G.z,-1)-3.2-R()*1.5;spots.push([x,z]);});
  if(SB)[[-3,1],[4,1]].forEach(([dx])=>spots.push([SB.x+dx,SB.cz+4.5+R()]));
  spots.forEach(([x,z],i)=>{if(landD(x,z)>-1.8||landD(x,z)<-9)return;if(WEST.boats&&WEST.boats.some(b=>Math.hypot(b.g.position.x-x,b.g.position.z-z)<2.5))return;lkYacht(x,z,['#2f78a8','#c8344a','#3f9a6a','#f1c64a','#1d3a6e','#e8734a','#2f9a8a'][i%7],R()*1.2-.6);});
  LK.ready=true;});
