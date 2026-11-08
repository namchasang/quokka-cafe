// ---------- Phase 8: the east cape and the south point get things to do ----------
const P8={acts:[]};
function p8S(){S.p8=S.p8||{birds:0,keys:0};return S.p8;}
// birds on a salt lake, seen from the bird hide
const BIRD_ART={stilt:(x,a,b,t)=>{const s=Math.sin(t*2)*2;x.strokeStyle='#c8344a';x.lineWidth=2;x.beginPath();x.moveTo(a-3,b);x.lineTo(a-5,b+22);x.moveTo(a+3,b);x.lineTo(a+5+s,b+22);x.stroke();x.fillStyle='#f6f6f0';x.beginPath();x.ellipse(a,b-4,12,6,0,0,6.283);x.fill();x.fillStyle='#8a4a2a';x.fillRect(a-6,b-2,12,3);x.fillStyle='#1e1e22';x.beginPath();x.ellipse(a+2,b-7,8,3,0,Math.PI,0);x.fill();x.fillStyle='#f6f6f0';x.beginPath();x.arc(a+12,b-12,4,0,6.283);x.fill();x.strokeStyle='#1e1e22';x.beginPath();x.moveTo(a+15,b-12);x.lineTo(a+24,b-10);x.stroke();},
  stint:(x,a,b,t)=>{for(let i=0;i<3;i++){const px=a-14+i*13+Math.sin(t*3+i)*2,py=b+(i%2)*4;x.fillStyle='#b8865a';x.beginPath();x.ellipse(px,py,5,3.5,0,0,6.283);x.fill();x.fillStyle='#f2efe6';x.beginPath();x.ellipse(px,py+2,4,1.5,0,0,6.283);x.fill();x.strokeStyle='#2a2a30';x.lineWidth=1;x.beginPath();x.moveTo(px+5,py-1);x.lineTo(px+9,py);x.stroke();}},
  pelican:(x,a,b,t)=>{x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.ellipse(a,b+12,26,4,0,0,6.283);x.fill();x.fillStyle='#f6f6f0';x.beginPath();x.ellipse(a,b,20,11,0,0,6.283);x.fill();x.fillStyle='#2a2a30';x.beginPath();x.ellipse(a-6,b-2,12,6,.2,0,6.283);x.fill();x.fillStyle='#f6f6f0';x.beginPath();x.arc(a+16,b-14,6,0,6.283);x.fill();x.fillStyle='#f1c64a';x.beginPath();x.moveTo(a+20,b-15);x.lineTo(a+40,b-8);x.lineTo(a+20,b-10);x.fill();},
  osprey:(x,a,b,t)=>WHALE_ART.osprey(x,a,b,t)};
function birdHide(lakeName){const W=p8S();const R=srand(212);const reeds=[];for(let i=0;i<40;i++)reeds.push([R()*640,320+R()*80,30+R()*40]);
  const T=[{id:'stilt',name:'Banded stilt',x:190,y:250,r:26,fact:'Banded stilt · it flies hundreds of kilometres to feed on tiny brine shrimp in salt lakes like this one.'},
    {id:'stint',name:'Red-necked stints',x:440,y:290,r:28,pos:t=>[440+Math.sin(t*.4)*30,290],fact:'Red-necked stints · each one weighs about as much as a teaspoon of sugar, and flies here from Siberia every summer.'},
    {id:'pelican',name:'Pelican',x:330,y:205,r:30,pos:t=>[330+Math.sin(t*.12)*60,205],fact:'Pelican · its beak pouch holds more than its stomach. Great for scooping, terrible for manners.'},
    {id:'osprey',name:'Osprey',x:520,y:90,r:28,pos:t=>[520+Math.sin(t*.3)*60,90+Math.sin(t*.7)*10],fact:'Osprey · hunting over the lake for mullet.'}];
  const draw=(x,t)=>{const g=x.createLinearGradient(0,0,0,170);g.addColorStop(0,'#a8d0e8');g.addColorStop(1,'#eef4f2');x.fillStyle=g;x.fillRect(0,0,640,170);
    x.fillStyle='#8aa86a';x.beginPath();x.moveTo(0,170);for(let i=0;i<=16;i++)x.lineTo(i*40,160+Math.sin(i*1.7)*6);x.lineTo(640,180);x.lineTo(0,180);x.fill();
    const w=x.createLinearGradient(0,170,0,400);w.addColorStop(0,'#f2c4d2');w.addColorStop(1,'#e898b4');x.fillStyle=w;x.fillRect(0,175,640,225);
    x.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<9;i++)x.fillRect((i*83+t*6)%660-20,200+i*20,40,2);
    T.forEach(q=>{const p=spotPos(q,t);BIRD_ART[q.id](x,p[0],p[1],t);});
    reeds.forEach(([rx,ry,h],i)=>{x.strokeStyle=i%3?'#6a8a3a':'#8a9a4a';x.lineWidth=3;x.beginPath();x.moveTo(rx,ry+60);x.quadraticCurveTo(rx+Math.sin(t+i)*6,ry,rx+Math.sin(t+i)*10,ry-h*.3);x.stroke();});
    x.fillStyle='#4a3a2a';x.fillRect(0,0,640,22);x.fillRect(0,378,640,22);x.fillRect(0,0,24,400);x.fillRect(616,0,24,400);};
  spotOpen({eye:'Bird hide · '+lakeName,title:'Spot 4 lake birds',hint:'Sit quietly. The birds come and go across the pink water.',targets:T,draw,hintAt:16,doneTitle:'Birdwatcher!',
    done:()=>{if(!W.birds){W.birds=1;S.coins+=25;toast('Birdwatcher · +25 coins',2.4);}}});}
function p8Targets(T){if(!P8.ready||zoneOf(player.x)!=='island')return;P8.acts.forEach(a=>T.push(a));}
const P8_SPOT=k=>()=>P8[k]?[[P8[k].x,P8[k].z]]:[];
[['bickley','Bickley Bay','place',4.5,WB_SPOT('bickley')],['bcottages','Bickley Bay cottages','place',3.4],['tash','Tash the cottage keeper','people',2.4],['birdhide','Lake bird hide','place',3],['eastpoint','East Point beacon','place',3.4]].forEach(([id,name,cat,r,pos])=>PCS.push({id,name,zone:'island',cat,pos:pos||P8_SPOT(id),r}));
PC_TOTAL=PCS.filter(p=>!isSpecial(p.cat)).length;
Object.assign(PC_HINTS,{bickley:'Bickley Bay · the sheltered beach on the east cape',bcottages:'Bickley Bay cottages · the holiday cottages by the beach',tash:'Tash · looks after the Bickley Bay cottages',birdhide:'Lake bird hide · the wooden hide on the shore of a salt lake',eastpoint:'East Point beacon · the little navigation beacon at the island’s eastern tip'});
SIDEQ.push({id:'cottagekeys',zone:'island',mood:'funny',title:'The Key Collector',giver:'Tash the cottage keeper',coins:45,desc:'The keys to every Bickley Bay cottage have vanished from Tash’s hook. Guests are waiting. A quokka was seen looking very pleased with itself.',
  steps:[{l:'Talk to Tash at the Bickley Bay cottages',at:'pc:tash',say:[{who:'Tash',text:'Twelve keys on a big brass ring. Gone! And a quokka sitting on my porch, jingling.'},{who:'Tash',text:'It ran towards the airstrip. Quokkas love shiny things. And runways, apparently.'}]},
   {l:'Look for the keys at the airstrip',at:'pc:airport',say:['Kip: Little paw prints along the runway… and a single key on the windsock pole. The trail heads for the beacon at East Point.']},
   {l:'Follow the trail to the East Point beacon',at:'pc:eastpoint',say:['Kip: There’s the quokka, curled up under the beacon with eleven keys, like a dragon with its treasure.','Kip offers a sultana. The quokka considers it very carefully… and swaps.']},
   {l:'Bring the keys back to Tash',at:'pc:tash',say:[{who:'Tash',text:'All twelve! You’re a legend. The guests in cottage 3 have been sitting on their suitcases for an hour.'}]}],
  outro:'Tash now keeps the keys in a tin with a very tight lid. The quokka has been seen practising on the lid.'});
islandLate(()=>{const R=srand(818);
  // Bickley Bay: holiday cottages behind the beach, and Tash
  {const b=WB.bickley;if(b){const C=[['#efe3c4','#2f78a8'],['#f2e6c8','#c9473f'],['#e8d2a6','#3f7a5a'],['#efe3c4','#e8734a']];let n=0,first=null;
    for(let i=0;i<4;i++){const p=islFindSite(b.x-6+i*4.2,b.z+4.2,1.7,1.4,{pad:.4,path:.6},6);if(!p)continue;islClear(p[0]-2,p[1]-1.8,p[0]+2,p[1]+1.8);waCottage(p[0],p[1],C[i][0],C[i][1],0);n++;if(!first)first=p;islLinkPath(p[0]+.4,p[1]+1.8);}
    if(first)P8.bcottages={x:first[0]+2,z:first[1]+3};
    const t=islFindSite(b.x+2.5,b.z+2.6,.4,.4,{path:.3,land:.6},5)||[b.x+2.5,b.z+2.6];P8.tash={x:t[0],z:t[1]};
    waNPC('tash','Tash',{hair:'#e8c070',skin:'#f1c7a0',shirt:'#e8734a',pants:'#2f78a8',hat:'#f3e2b0'},t[0],t[1],()=>[{who:'Tash',text:pick(['Bickley Bay is the calmest beach on the island. The Thomson Bay wind skips right over it.','Guests always ask if quokkas bite. I say only if you are a sandwich.','Snorkel round the rocks at the end of the bay. The fish are very nosy.'])}]);}}
  // a bird hide on the shore of Serpentine Lake (or whichever salt lake was built)
  {const L=WA.serpentine||WA.ghlake||WA.baghdad;const nm=WA.serpentine?'Serpentine Lake':WA.ghlake?'Government House Lake':'Lake Baghdad';if(L){const p=islFindSite(L.x+3,L.z+1.4,1.3,.9,{path:.4,land:1},6);if(p){islClear(p[0]-1.6,p[1]-1.2,p[0]+1.6,p[1]+1.2);const g=new THREE.Group();
      const hb=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.4,1.6),lmat(deckC,[2,1]));hb.position.y=.7;g.add(hb);const rf=new THREE.Mesh(new THREE.BoxGeometry(2.7,.12,1.9),waM('#5a4a3a'));rf.position.y=1.48;rf.rotation.x=.12;g.add(rf);
      const sl=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.2),waM('#141210'));sl.position.set(0,1.05,-.81);sl.rotation.y=Math.PI;g.add(sl);const dr=new THREE.Mesh(new THREE.PlaneGeometry(.6,1),waM('#3a2a1a'));dr.position.set(.6,.5,.81);g.add(dr);
      g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});g.position.set(p[0],0,p[1]);scene.add(waMark(g));col(p[0]-1.2,p[1]-.8,p[0]+1.2,p[1]+.8);
      waSign(p[0]-1.7,p[1]+1.2,['BIRD HIDE'],'#3f7a5a','#ffffff',1);P8.birdhide={x:p[0],z:p[1]+2.4};
      P8.acts.push({x:p[0]+.6,z:p[1]+1.4,r:1.2,label:'Watch birds from the hide',act:()=>{if(overlay)return;birdHide(nm);}});}}}
  // East Point: a beacon at the eastern tip, with a fishing rock beside it
  {let best=null;for(let X=-178;X<-140;X+=1)for(let Z=-20;Z<20;Z+=1){if(landD(X,Z)>1.6&&(!best||X<best[0]))best=[X,Z];}
    if(best){const p=islFindSite(best[0]+1.5,best[1],.8,.8,{land:1.2,path:.3},5);if(p){islClear(p[0]-1,p[1]-1,p[0]+1,p[1]+1);const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(.6,.75,.5,8),lmat(stoneC,[1,1]));base.position.y=.25;g.add(base);
      const tw=new THREE.Mesh(new THREE.CylinderGeometry(.22,.3,2.6,8),waM('#f6f6f0'));tw.position.y=1.8;g.add(tw);[1.1,2.3].forEach(y=>{const bnd=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.35,8),waM('#c8344a'));bnd.position.y=y;g.add(bnd);});
      const lt=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),new THREE.MeshBasicMaterial({color:0xffe08a}));lt.position.y=3.25;g.add(lt);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.position.set(p[0],0,p[1]);scene.add(waMark(g));col(p[0]-.7,p[1]-.7,p[0]+.7,p[1]+.7);
      P8.eastpoint={x:p[0]+2,z:p[1]+1.5};let fx=p[0]-1.5,fz=p[1]+1.5;for(let i=0;i<20&&landD(fx,fz)>.9;i++)fx-=.3;FISH_SPOTS.push({x:fx+.6,z:fz,zone:'island',name:'East Point rocks'});wbRocks(p[0]-2.5,p[1]-1,5,R);}}}
  // a picnic shelter on the south side between the lakes
  {const p=islFindSite(-80,22,1.6,1.2,{path:.6,land:2},16);if(p){islClear(p[0]-2,p[1]-1.6,p[0]+2,p[1]+1.6);const g=new THREE.Group();[[-1.3,-.9],[1.3,-.9],[-1.3,.9],[1.3,.9]].forEach(([a,c])=>{const q=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,2,6),legMat);q.position.set(a,1,c);g.add(q);});
      const rf=new THREE.Mesh(new THREE.ConeGeometry(2.3,.8,4),waM('#3f7a5a'));rf.rotation.y=Math.PI/4;rf.position.y=2.35;g.add(rf);const tb=new THREE.Mesh(new THREE.BoxGeometry(1.6,.1,.8),lmat(deckC,[1,1]));tb.position.y=.7;g.add(tb);
      [-.65,.65].forEach(c=>{const s2=new THREE.Mesh(new THREE.BoxGeometry(1.6,.08,.3),lmat(deckC,[1,1]));s2.position.set(0,.42,c);g.add(s2);});g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.position.set(p[0],0,p[1]);scene.add(waMark(g));col(p[0]-.9,p[1]-.5,p[0]+.9,p[1]+.5);islLinkPath(p[0],p[1]+1.4);}}
  // more trees and shrubs on the open parts of the east cape and the south point
  {const tv=[treeVariants[0],treeVariants[1],treeVariants[3]].filter(Boolean);let n=0;for(let i=0;i<260&&n<70;i++){const x=-175+R()*100,z=-15+R()*72;if(landD(x,z)<3||!islSiteOK(x,z,.5,.4,{land:2.4,path:1.2,pad:.8}))continue;if(trees.some(t=>Math.abs(t.x-x)<4&&Math.abs(t.z-z)<4))continue;waTree(x,z,tv[n%tv.length],.8+R()*.4);n++;}}
  P8.ready=true;});
