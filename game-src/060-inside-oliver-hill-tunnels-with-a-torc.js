// ----- inside the Oliver Hill tunnels, with a torch -----
function tunnelDraw(){const R=srand(77);const bricks=[];for(let i=0;i<120;i++)bricks.push([R(),R(),R()]);
  return(x,t)=>{x.fillStyle='#2a251e';x.fillRect(0,0,640,400);const vx=330,vy=180;
    for(let k=7;k>=0;k--){const s=1-k*.12,w=300*s,h=230*s,l=.24+.08*(7-k)/7;x.fillStyle='rgb('+Math.round(190*l+40)+','+Math.round(178*l+34)+','+Math.round(150*l+26)+')';x.beginPath();x.moveTo(vx-w,vy+h*.9);x.lineTo(vx-w,vy-h*.2);x.quadraticCurveTo(vx-w,vy-h,vx,vy-h);x.quadraticCurveTo(vx+w,vy-h,vx+w,vy-h*.2);x.lineTo(vx+w,vy+h*.9);x.closePath();x.fill();
      x.strokeStyle='rgba(40,34,26,.5)';x.lineWidth=1.5;x.stroke();}
    x.fillStyle='#14110d';x.beginPath();x.ellipse(vx,vy+8,34,44,0,0,6.283);x.fill();
    x.fillStyle='#5a5246';x.beginPath();x.moveTo(30,400);x.lineTo(vx-40,vy+60);x.lineTo(vx+40,vy+60);x.lineTo(610,400);x.fill();
    x.strokeStyle='#8a8c90';x.lineWidth=3;[[-1,1],[1,1]].forEach(([s])=>{x.beginPath();x.moveTo(vx+s*120,400);x.lineTo(vx+s*12,vy+62);x.stroke();});x.lineWidth=2;for(let i=0;i<9;i++){const y=vy+66+i*i*2.6,w=14+i*i*1.25;x.strokeStyle='#4a3a2a';x.beginPath();x.moveTo(vx-w,y);x.lineTo(vx+w,y);x.stroke();}
    x.strokeStyle='#6e6a60';x.lineWidth=5;x.beginPath();x.moveTo(40,70);x.quadraticCurveTo(vx,-10,600,70);x.stroke();
    bricks.forEach(([a,b,c])=>{const px=a*640,py=60+b*240;if(Math.abs(px-vx)<70&&Math.abs(py-vy)<60)return;x.fillStyle='rgba(30,26,20,'+(.12+c*.15)+')';x.fillRect(px,py,18,7);});
    // the things to find
    x.fillStyle='#4a5a3a';x.fillRect(96,150,40,52);x.fillStyle='#2a3020';x.fillRect(102,160,28,16);x.fillStyle='#1a1a16';x.fillRect(112,182,10,10);x.strokeStyle='#1a1a16';x.lineWidth=3;x.beginPath();x.moveTo(98,164);x.quadraticCurveTo(86,196,104,214);x.stroke();
    x.fillStyle='#c8a040';x.save();x.translate(476,338);x.rotate(-.35);x.fillRect(-26,-9,46,18);x.fillStyle='#e8c060';x.fillRect(-26,-9,46,5);x.fillStyle='#8a6a20';x.beginPath();x.ellipse(20,0,4,9,0,0,6.283);x.fill();x.restore();
    x.fillStyle='#e8e2d0';x.fillRect(426,104,104,34);x.strokeStyle='#8a3a2a';x.lineWidth=2;x.strokeRect(428,106,100,30);x.fillStyle='#8a3a2a';x.font='bold 13px system-ui,sans-serif';x.textAlign='center';x.fillText('SHELL STORE',478,121);x.font='9px system-ui,sans-serif';x.fillText('NO NAKED LIGHTS',478,132);
    x.strokeStyle='rgba(240,232,210,.75)';x.lineWidth=1.6;x.font='italic 15px Georgia,serif';x.textAlign='center';x.fillStyle='rgba(240,232,210,.7)';x.fillText('J.B. 1942',210,262);x.beginPath();x.moveTo(178,268);x.lineTo(244,268);x.stroke();
    const v=x.createRadialGradient(330,200,120,330,200,420);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=v;x.fillRect(0,0,640,400);};}
function tunnelTour(){const W=wbS(),q=SIDEQ.find(s=>s.id==='initials');const want=q&&sqStep(q)===1;
  const T=[{id:'phone',name:'Field telephone',x:116,y:186,r:30,fact:'Field telephone · the gun crews rang the observation post to aim the big guns.'},
    {id:'casing',name:'Shell casing',x:470,y:338,r:30,fact:'Shell casing · each shell for the 9.2-inch gun weighed as much as a small car.'},
    {id:'sign',name:'Shell Store sign',x:478,y:121,r:40,fact:'Shell Store · shells and charges were kept deep underground, safe from attack.'},
    {id:'ini',name:'J.B. 1942',x:210,y:258,r:32,fact:'J.B. 1942 · initials scratched into the limestone by a young gunner.'}];
  spotOpen({eye:'Oliver Hill tunnels',title:want?'Find all four, and J.B.’s initials':'Tunnel tour: find all four',hint:'Move your torch (drag or point) and tap what you find.',targets:T,draw:tunnelDraw(),torch:true,hintAt:20,doneTitle:'Tour complete!',
    done:()=>{if(!W.tun){W.tun=1;S.coins+=30;toast('Tunnel tour done · +30 coins',2.4);}W.ini=1;$('#spHint').textContent=want?'Kip takes a careful photo of J.B. 1942 for Bev.':'Bev: That’s the tour! Mind your head on the way out.';}});}
function wbTargets(T){if(!WB.ready||zoneOf(player.x)!=='island')return;WB.acts.forEach(a=>T.push(a));}
const WB_SPOT=k=>()=>WB[k]?[[WB[k].x,WB[k].z]]:[];
[['parakeet','Parakeet Bay','place',4],['armstrong','Little Armstrong Bay','place',4],['catherine','Catherine Bay','place',4],['stark','Stark Bay','place',4],['snorkeltrail','Snorkel trail sign','place',2.6],
 ['gun2','Second gun pit','place',3.2],['tunnels','Battery tunnels','place',3],['obspost','Observation post','place',3],['ostn','Oliver Hill Station','place',3.4],['sstn','Settlement Station','place',3.4],
 ['mia','Mia the snorkel guide','people',2.4],['bev','Bev the tunnel guide','people',2.4],['ray','Ray the train driver','people',2.4]].forEach(([id,name,cat,r])=>PCS.push({id,name,zone:'island',cat,pos:WB_SPOT(id),r}));
PC_TOTAL=PCS.filter(p=>!isSpecial(p.cat)).length;
Object.assign(PC_HINTS,{parakeet:'Parakeet Bay · a sandy cove on the north coast',armstrong:'Little Armstrong Bay · the calm bay with the snorkel trail',catherine:'Catherine Bay · a small, quiet cove between rocky points',stark:'Stark Bay · the wild bay near the west end',
 snorkeltrail:'Snorkel trail sign · at Little Armstrong Bay',gun2:'Second gun pit · the empty gun emplacement on Oliver Hill',tunnels:'Battery tunnels · the doorway into Oliver Hill',obspost:'Observation post · the concrete lookout on Oliver Hill',
 ostn:'Oliver Hill Station · the end of the train line',sstn:'Settlement Station · where the Quokka Express starts',mia:'Mia · the snorkel guide at Little Armstrong Bay',bev:'Bev · the volunteer at the Oliver Hill tunnels',ray:'Ray · the train driver at Settlement Station'});
SIDEQ.push(
 {id:'flipper',zone:'island',mood:'funny',title:'One Flipper Short',giver:'Mia the snorkel guide',coins:45,desc:'Mia has one flipper. The other one was last seen leaving Little Armstrong Bay in the mouth of a very pleased quokka.',
  steps:[{l:'Talk to Mia at Little Armstrong Bay',at:'pc:mia',say:[{who:'Mia',text:'I turned around for ONE second. One! And a quokka just… walked off with my left flipper.'},{who:'Mia',text:'Can’t teach snorkelling hopping on one foot. Well, I can. It isn’t pretty.'}]},
   {l:'Look for flipper tracks at Parakeet Bay',at:'pc:parakeet',say:['Kip: Flat, floppy drag marks in the sand… heading inland, towards the train line.']},
   {l:'Follow the tracks to Oliver Hill Station',at:'pc:ostn',say:['Kip: There it is, under the station bench. The quokka is fast asleep on the flipper like it’s a little yellow bed.','Kip slides a folded towel in its place. The quokka doesn’t even wake up.']},
   {l:'Bring the flipper back to Mia',at:'pc:mia',say:[{who:'Mia',text:'My flipper! It’s… warm. And a bit chewed. Honestly? Still the best flipper I own.'}]}],
  outro:'Mia now keeps a spare towel by the snorkel trail sign. For the quokka.'},
 {id:'initials',zone:'island',mood:'heart',title:'J.B. 1942',giver:'Bev the tunnel guide',coins:55,desc:'Bev’s grandfather served on Oliver Hill as a young gunner. Family stories say he scratched his initials somewhere in the tunnels.',
  steps:[{l:'Talk to Bev at the Oliver Hill tunnels',at:'pc:bev',say:[{who:'Bev',text:'Grandad Jack was eighteen when he came here. He said the tunnels were cold, dark, and full of jokes.'},{who:'Bev',text:'He swore he carved “J.B. 1942” into the wall down there. I’ve never been brave enough to look properly. Will you take the tour and find it?'}]},
   {l:'Take the tunnel tour and find J.B. 1942',at:'pc:tunnels',chk:()=>!!wbS().ini,say:['Kip: There, low on the wall, under the torch light: J.B. 1942. Small, neat letters, like he didn’t want to get in trouble.']},
   {l:'Show Bev the photo',at:'pc:bev',say:[{who:'Bev',text:'That’s his writing. He did his sevens just like that, with a little line through them…'},{who:'Bev',text:'I’m going to show Mum tonight. Thank you, Kip. Truly.'}]}],
  outro:'Bev now ends every tour by shining her torch on J.B. 1942 and telling Jack’s jokes. The bad ones too.'});
// smooth min/max for blending coastlines
const wbSmin=(a,b,k)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;};
function wbCoastZ(x,z,sd){sd=sd||-1;while(landD(x,z)>0&&z>TB.z1+1&&z<TB.z2-1)z+=sd*.2;return z;}
function wbGrad(x,z,sd){const u=(x-TB.x1)*GR,v=(z-(sd||-1)*.6-TB.z1)*GR,k=Math.round(v)*GW+Math.round(u);return Math.abs(Fg[k]/(Dg[k]||1))||.05;}
// carve the bays into the coast, add rocky points either side, then redo the shoreline, water and surf
function wbCarve(bays){const cut=[],add=[];bays.forEach(b=>{const sd=b.sd||-1,S0=wbGrad(b.x,b.cz,sd);const rz=b.bite+2.6,zc=b.cz+sd*(rz-b.bite);cut.push({x:b.x,z:zc,rx:b.rx,rz,S:S0*Math.min(b.rx,rz)});
    [-1,1].forEach(s=>add.push({x:b.x+s*(b.rx*.92),z:b.cz+sd*1.2,rx:2,rz:b.out,S:S0*2}));});
  const box=a=>[a.x-a.rx*3,a.z-a.rz*3,a.x+a.rx*3,a.z+a.rz*3],fall=e=>1+Math.max(0,e-1.6)**2*25;
  [...cut,...add].forEach(a=>a.b=box(a));
  const x1=Math.min(...cut.concat(add).map(a=>a.b[0])),x2=Math.max(...cut.concat(add).map(a=>a.b[2]));
  for(let j=0;j<GH;j++){const z=TB.z1+j/GR;for(let i=Math.max(0,Math.floor((x1-TB.x1)*GR));i<=Math.min(GW-1,Math.ceil((x2-TB.x1)*GR));i++){const x=TB.x1+i/GR,k=j*GW+i;let f=Fg[k];
    for(const a of add){if(x<a.b[0]||x>a.b[2]||z<a.b[1]||z>a.b[3])continue;const e=Math.hypot((x-a.x)/a.rx,(z-a.z)/a.rz);f=-wbSmin(-f,-(1-e)*a.S*fall(e),a.S*.5);}
    for(const a of cut){if(x<a.b[0]||x>a.b[2]||z<a.b[1]||z>a.b[3])continue;const e=Math.hypot((x-a.x)/a.rx,(z-a.z)/a.rz);f=wbSmin(f,(e-1)*a.S*fall(e),a.S*.4);}Fg[k]=f;}}
  for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const k=j*GW+i;const i0=i>0?k-1:k,i1=i<GW-1?k+1:k,j0=j>0?k-GW:k,j1=j<GH-1?k+GW:k;
    const fx=(Fg[i1]-Fg[i0])*GR/((i1-i0)||1),fz=(Fg[j1]-Fg[j0])*GR/(((j1-j0)/GW)||1);Dg[k]=Fg[k]/Math.max(.004,Math.hypot(fx,fz));}
  paintWater();[shore,foam,waves].forEach(m=>{if(m.material.map)m.material.map.needsUpdate=true;});waveMat.uniforms.tD.value.dispose();waveMat.uniforms.tD.value=makeWaveTex();}
// take away trees, grass and rocks that ended up in the water
function wbClearWet(x1,z1,x2,z2){for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(t.x<x1||t.x>x2||t.z<z1||t.z>z2||landD(t.x,t.z)>.6)continue;islClear(t.x-.05,t.z-.05,t.x+.05,t.z+.05);}
  scene.children.slice().forEach(m=>{if(!m.isMesh||m.userData.frames||m.__wa)return;const p=m.position;if(p.x<x1||p.x>x2||p.z<z1||p.z>z2||landD(p.x,p.z)>.4)return;const decor=BB.includes(m),rock=m.material===limeMat||m.material===limeDark;if(!decor&&!rock)return;scene.remove(m);const bi=BB.indexOf(m);if(bi>=0)BB.splice(bi,1);});
  for(let c=colliders.length-1;c>=0;c--){const C=colliders[c];const cx=(C.x1+C.x2)/2,cz=(C.z1+C.z2)/2;if(cx<x1||cx>x2||cz<z1||cz>z2)continue;if((C.x2-C.x1)<1.2&&(C.z2-C.z1)<1.2&&landD(cx,cz)<.2)colliders.splice(c,1);}}
function wbUmbrella(x,z,c){const p=box(.06,1.6,.06,waM('#f3efe6'),x,.8,z);p.__wa=1;const cn=new THREE.Mesh(new THREE.ConeGeometry(.95,.42,8),waM(c));cn.position.set(x,1.72,z);cn.castShadow=true;scene.add(cn);cn.__wa=1;
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.07,6,4),waM('#ffffff'));cap.position.set(x,1.95,z);scene.add(cap);cap.__wa=1;col(x-.06,z-.06,x+.06,z+.06);}
function wbTowel(x,z,c,a){const t=new THREE.Mesh(new THREE.PlaneGeometry(.7,1.5),waM(c));t.rotation.x=-Math.PI/2;t.rotation.z=a||0;t.position.set(x,.025,z);scene.add(t);t.__wa=1;
  const s=new THREE.Mesh(new THREE.PlaneGeometry(.7,.18),waM('#ffffff'));s.rotation.x=-Math.PI/2;s.rotation.z=a||0;s.position.set(x,.03,z);scene.add(s);s.__wa=1;}
function wbFlagBuoy(x,z){const g=new THREE.Group();const f=new THREE.Mesh(new THREE.CylinderGeometry(.28,.34,.3,10),waM('#f6f2e8'));f.position.y=.02;g.add(f);const p=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.1,5),legMat);p.position.y=.6;g.add(p);
  const fc=mk(32,24),fx=fc.getContext('2d');fx.fillStyle='#d8342a';fx.fillRect(0,0,32,24);fx.strokeStyle='#ffffff';fx.lineWidth=5;fx.beginPath();fx.moveTo(0,0);fx.lineTo(32,24);fx.stroke();const ft=new THREE.CanvasTexture(fc);ft.magFilter=THREE.NearestFilter;
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(.5,.36),new THREE.MeshLambertMaterial({map:ft,side:THREE.DoubleSide}));fl.position.set(.26,.95,0);g.add(fl);g.position.set(x,-.1,z);scene.add(waMark(g));return g;}
function wbBoat(x,z,c,ry){const g=new THREE.Group();const h=new THREE.Mesh(new THREE.BoxGeometry(1.7,.35,.75),waM(c));h.position.y=.05;g.add(h);const s=new THREE.Mesh(new THREE.BoxGeometry(1.2,.12,.5),waM('#e8dcc0'));s.position.y=.24;g.add(s);
  const o=new THREE.Mesh(new THREE.BoxGeometry(.2,.4,.2),waM('#2a2a30'));o.position.set(-.9,.2,0);g.add(o);g.position.set(x,-.12,z);g.rotation.y=ry||0;g.traverse(m=>{if(m.isMesh)m.castShadow=true;});scene.add(waMark(g));}
function wbRocks(x,z,n,R){for(let i=0;i<n;i++){const a=R()*6.283,d=R()*1.4,px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d;if(landD(px,pz)<-.2)continue;const s=.35+R()*.45;const m=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),R()<.5?limeMat:limeDark);m.position.set(px,s*.35,pz);m.rotation.set(R()*3,R()*3,R()*3);m.scale.y=.7;m.castShadow=m.receiveShadow=true;scene.add(m);m.__wa=1;if(landD(px,pz)>.3)col(px-s*.6,pz-s*.6,px+s*.6,pz+s*.6);}}
islandLate(()=>{const R=srand(4242);
  // 1. the four north coast bays, and Salmon Bay on the south coast
  const st=id=>XPL.stops.find(s=>s.id===id);const P=st('parakeet'),A=st('armstrong'),Y=st('york'),K=st('stark'),SB=st('salmonbay');
  const plan=[['parakeet','Parakeet Bay',P.x,P.z,4.6,2.2],['armstrong','Little Armstrong Bay',A.x,A.z,4.2,2],['catherine','Catherine Bay',(A.x+Y.x)/2+1.5,(A.z+Y.z)/2,3,1.6],['stark','Stark Bay',K.x+.5,K.z,5,2.6],['bigsalmon','Salmon Bay',SB.x+1,SB.z,8,2.6,1],['bickley','Bickley Bay',-150,-4,5,2.2,-1]];
  const bays=plan.map(([id,n,x,z,rx,out,sd])=>{sd=sd||-1;const cz=wbCoastZ(x,z,sd),room=Math.abs(z-cz);return{id,n,x,sz:z,cz,rx,out,sd,bite:clamp(room-3.1,.8,2.6)};});
  wbCarve(bays);bays.forEach(b=>wbClearWet(b.x-b.rx-4,Math.min(b.cz+b.sd*6,b.cz-b.sd*(b.bite+2)),b.x+b.rx+4,Math.max(b.cz+b.sd*6,b.cz-b.sd*(b.bite+2))));
  bays.forEach((b,i)=>{const sd=b.sd,inner=b.cz-sd*b.bite;// the sandy edge of the bay (sd: which way the sea is)
    islAddGround({t:'sand',x:b.x,z:inner+sd*.4,rx:b.rx*.95,rz:2.2});
    let bz=inner-sd*.55;while(landD(b.x,bz)<.7&&Math.abs(bz-b.sz)>.3)bz-=sd*.2;WB[b.id]={x:b.x,z:bz-sd*.6,n:b.n,cz:b.cz,inner,sd};
    const sg=[b.x-b.rx*.55,bz-sd*1.4];if(b.id!=='bigsalmon'&&islSiteOK(sg[0],sg[1],.3,.3,{path:.5,land:.6}))waSign(sg[0],sg[1],[b.n.toUpperCase()],'#2f78a8','#ffffff',1.6);
    if(REEF_BAYS[b.id])WB.acts.push({x:b.x,z:bz,r:1.8,label:'Snorkel at '+b.n,act:()=>{if(overlay)return;say(['Kip pulls on a mask and snorkel and slides into the clear, cool water…'],()=>snorkel(b.id));}});
    wbFlagBuoy(b.x+b.rx*.25,b.cz+sd*1.8);
    [[-1.6,'#f1c64a'],[1.9,'#d8342a']].forEach(([o,c],k)=>{const ux=b.x+o,uz=bz-sd*.2;if(landD(ux,uz)>.5&&pathD(ux,uz)>.9&&!(k&&i===3))wbUmbrella(ux,uz,c);if(landD(ux+.6,uz+sd*.2)>.4)wbTowel(ux+.6,uz+sd*.2,['#2f78a8','#e86a8a','#3f9a6a','#f1c64a'][(i+k)%4],.2*(k?1:-1));});
    [-1,1].forEach(s=>wbRocks(b.x+s*b.rx*.92,b.cz+sd*1.6,5,R));
    if(i!==2)wbBoat(b.x-b.rx*.4,b.cz+sd*(2.6+R()),['#f6f6f0','#2f78a8','#f1c64a','#e8734a','#2f9a8a'][i],R()*1.2-.6);});
  // kayak rack at Parakeet Bay
  {const b=WB.parakeet;const p=islFindSite(b.x+3.2,b.z+.4,.9,.5,{path:.6,land:.6},3);if(p){[-.6,.6].forEach(o=>{const q=box(.08,.9,.08,legMat,p[0]+o,.45,p[1]);q.__wa=1;});['#e8734a','#2f9a8a'].forEach((c,k)=>{const m=box(1.9,.18,.45,waM(c),p[0],.45+k*.32,p[1]);m.__wa=1;});col(p[0]-1,p[1]-.3,p[0]+1,p[1]+.3);}}
  // Mia and the snorkel trail sign at Little Armstrong Bay
  {const b=WB.armstrong;const p=islFindSite(b.x+2.6,b.z+.6,.4,.4,{path:.5,land:.6},4);if(p){signPost(p[0],p[1],makeSign(['SNORKEL TRAIL','LOOK · DON’T TOUCH'],64,20,'#2f78a8','#ffffff'),1.3,.5);WB.snorkeltrail={x:p[0],z:p[1]+1.2};}
    const m=islFindSite(b.x-2.4,b.z+.8,.4,.4,{path:.4,land:.6},4)||[b.x-2.4,b.z+.8];WB.mia={x:m[0],z:m[1]};
    waNPC('mia','Mia',{hair:'#1e1a18',skin:'#a86a48',shirt:'#2f9a8a',pants:'#1d3a6e',hat:'#f1c64a',cap:true},m[0],m[1],()=>[{who:'Mia',text:pick(['Float flat, breathe slow, and the fish come to you. Chasing them never works.','Little Armstrong is the calmest bay on the island. Perfect for first-timers.','Every bay has different locals. Try all four on the north coast!','Look, don’t touch. The reef is their house, we’re just visiting.'])}]);}
  // 2. Oliver Hill: the second gun pit, the tunnel doorway, the observation post
  {const oh=IW(56.6,3.6);
    const g2=islFindSite(oh.x-6.5,oh.z+.5,1.7,1.7,{land:1.4,path:.6},7);if(g2){islClear(g2[0]-2,g2[1]-2,g2[0]+2,g2[1]+2);const g=new THREE.Group();const ring=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.8,.5,20,1,true),lmat(stoneC,[3,1],{side:THREE.DoubleSide}));ring.position.y=.25;g.add(ring);
      const fl=new THREE.Mesh(new THREE.CircleGeometry(1.7,20),waM('#8a8a84'));fl.rotation.x=-Math.PI/2;fl.position.y=.04;g.add(fl);const pv=new THREE.Mesh(new THREE.CylinderGeometry(.5,.6,.25,12),waM('#5a5e64'));pv.position.y=.14;g.add(pv);
      for(let i=0;i<10;i++){const a=i/10*6.283;const r=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.12,5),waM('#3a3e44'));r.position.set(Math.cos(a)*1.25,.08,Math.sin(a)*1.25);g.add(r);}
      g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});g.position.set(g2[0],0,g2[1]);scene.add(waMark(g));col(g2[0]-1.8,g2[1]-1.8,g2[0]+1.8,g2[1]-1.2);col(g2[0]-1.8,g2[1]-1.8,g2[0]-1.2,g2[1]+1.8);col(g2[0]+1.2,g2[1]-1.8,g2[0]+1.8,g2[1]+1.8);
      WB.gun2={x:g2[0],z:g2[1]+2.4};WB.acts.push({x:g2[0],z:g2[1]+1.9,r:1.3,label:'Read the gun pit plaque',act:()=>say([{who:'Gun pit',text:'Oliver Hill had two 9.2-inch guns. This pit held the second one. Each gun could fire a shell over 28 kilometres.'},{who:'Gun pit',text:'The guns were never fired at an enemy. They were removed after the war; one was later brought back for visitors.'}])});
      signPost(g2[0]+1.4,g2[1]+2.2,makeSign(['GUN PIT 2'],40,12,'#4a5a3a','#f5ecd8'),.9,.3);}
    const tp=islFindSite(oh.x+5.5,oh.z-1.5,2.2,1.6,{land:1.4,path:.6},8);if(tp){islClear(tp[0]-2.6,tp[1]-2,tp[0]+2.6,tp[1]+2);const g=new THREE.Group();
      const mound=new THREE.Mesh(new THREE.SphereGeometry(2.2,16,8,0,6.283,0,Math.PI/2),lmat(grassC,[2,2]));mound.scale.set(1,.55,.75);g.add(mound);
      const fr=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.5,.5),lmat(stoneC,[1,1]));fr.position.set(0,.75,1.45);g.add(fr);const dr=new THREE.Mesh(new THREE.PlaneGeometry(1.05,1.15),waM('#0e0c0a'));dr.position.set(0,.58,1.71);g.add(dr);
      const ln=new THREE.Mesh(new THREE.BoxGeometry(1.9,.14,.6),lmat(stoneC,[1,1]));ln.position.set(0,1.55,1.45);g.add(ln);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.08,6,4),new THREE.MeshBasicMaterial({color:0xffd890}));lamp.position.set(.62,1.3,1.74);g.add(lamp);
      g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});g.position.set(tp[0],0,tp[1]);scene.add(waMark(g));col(tp[0]-2.2,tp[1]-1.6,tp[0]+2.2,tp[1]+1.6);
      const sg=makeSign(['BATTERY TUNNELS'],60,12,'#4a5a3a','#f5ecd8');const s=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.3),new THREE.MeshBasicMaterial({map:sg}));s.position.set(tp[0],1.3,tp[1]+1.72);scene.add(s);s.__wa=1;
      WB.tunnels={x:tp[0],z:tp[1]+2.4};WB.bev={x:tp[0]+1.7,z:tp[1]+2.3};
      waNPC('bev','Bev',{hair:'#b8b0a8',skin:'#e8b892',shirt:'#5a6a3a',pants:'#c9b68a',hat:'#7a6a4a'},WB.bev.x,WB.bev.z,()=>[{who:'Bev',text:pick(['The tunnels kept the shells and the crew safe. Cool in summer, too. Very popular in January.','Grab a torch, love. It’s dark as a cupboard down there.','The trains brought the shells up from the jetty. That’s why the railway was built, you know.'])}]);
      WB.acts.push({x:tp[0],z:tp[1]+2,r:1.2,label:'Take the tunnel tour',act:()=>{if(overlay)return;say([{who:'Bev',text:'Torch on? Lovely. Watch the step, and tell me what you spot down there.'}],()=>tunnelTour());}});}
    const op=islFindSite(oh.x+1,oh.z-5.5,1,.9,{land:1.4,path:.6},7);if(op){islClear(op[0]-1.3,op[1]-1.2,op[0]+1.3,op[1]+1.2);const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.9,1.3,1.6),lmat(stoneC,[1,1]));b.position.y=.65;g.add(b);
      const sl=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.16),waM('#141210'));sl.position.set(0,1,.81);g.add(sl);const rf=new THREE.Mesh(new THREE.BoxGeometry(2.2,.18,1.9),lmat(stoneC,[1,1]));rf.position.y=1.38;g.add(rf);
      g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});g.position.set(op[0],0,op[1]);scene.add(waMark(g));col(op[0]-1,op[1]-.85,op[0]+1,op[1]+.85);WB.obspost={x:op[0],z:op[1]+2};}}
  // 3. the two train stations get a canopy, a bench, a timetable and planter boxes
  [['ostn',54.6,1.2,'OLIVER HILL'],['sstn',14.2,-4.6,'SETTLEMENT']].forEach(([id,ox,oz,nm])=>{const c=IW(ox,oz),g=new THREE.Group();const post=waM('#1f5a3a');
    [[-1.5,-.4],[1.5,-.4],[-1.5,.4],[1.5,.4]].forEach(([a,b])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.1,6),post);p.position.set(a,1.35,b);g.add(p);});
    const rf=new THREE.Mesh(new THREE.BoxGeometry(3.7,.12,1.5),waM('#e8e2d0'));rf.position.y=2.42;rf.rotation.x=-.08;g.add(rf);const tr=new THREE.Mesh(new THREE.BoxGeometry(3.7,.16,.06),waM('#c8344a'));tr.position.set(0,2.32,.76);g.add(tr);
    const bn=new THREE.Mesh(new THREE.BoxGeometry(1.1,.08,.36),lmat(deckC,[1,1]));bn.position.set(.6,.62,-.25);g.add(bn);[-.4,.4].forEach(o=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.06,.3,.3),legMat);l.position.set(.6+o,.45,-.25);g.add(l);});
    const tt=makeSign(['QUOKKA EXPRESS','TO '+(id==='ostn'?'SETTLEMENT':'OLIVER HILL'),'EVERY 30 MIN'],64,28,'#1f5a3a','#f5ecd8');const tb=new THREE.Mesh(new THREE.PlaneGeometry(.9,.42),new THREE.MeshLambertMaterial({map:tt,emissive:0x222222,emissiveMap:tt}));tb.position.set(-.8,1.55,.42);g.add(tb);
    g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.position.set(c.x,0,c.z);scene.add(waMark(g));
    [-2.25,2.25].forEach(o=>{const px=c.x+o,pz=c.z;if(!islSiteOK(px,pz,.35,.25,{path:.4,land:.6,pad:.1}))return;const pb=box(.7,.35,.4,lmat(deckC,[1,1]),px,.18,pz);pb.__wa=1;[[-.18,'#e8734a'],[.05,'#f1c64a'],[.2,'#c85ab0']].forEach(([d,cl])=>{const f=new THREE.Mesh(new THREE.SphereGeometry(.13,6,4),waM(cl));f.position.set(px+d,.45,pz);scene.add(f);f.__wa=1;});col(px-.35,pz-.2,px+.35,pz+.2);});
    WB[id]={x:c.x,z:c.z+2.2};});
  {const s=WB.sstn;const p=islFindSite(s.x+2.6,s.z,.4,.4,{path:.4,land:.6},4)||[s.x+2.6,s.z];WB.ray={x:p[0],z:p[1]};
    waNPC('ray','Ray',{hair:'#8a8a84',skin:'#d8a47a',shirt:'#1f5a3a',pants:'#2a2a30',hat:'#1f5a3a',cap:true},p[0],p[1],()=>[{who:'Ray',text:pick(['The line was built in the 1930s to carry shells up to the guns. Now it carries people with ice creams.','Toot toot! Sorry. I just like doing that.','Best seat is on the left going up. You get the salt lakes on one side and the sea on the other.'])}]);}
  // map labels for the new bays
  bays.forEach(b=>MAP_LABELS.push([b.n,b.x,b.cz+.4,0]));
  WB.bays=bays;WB.ready=true;});
