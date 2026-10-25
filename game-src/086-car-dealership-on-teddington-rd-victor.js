// ---------- Car dealership on Teddington Rd, Victoria Park (Look Lab: ?lab or ?dealer until DEALER_LIVE) ----------
// From Paul's street photo: a blue-and-white showroom with a long fascia, a red brick-paver lot, tall palms, white hoop rails
// along the kerb, light towers, blue shade awnings and rows of cars. The six cars from Roo Road Rescue are for sale
// (20,000-80,000 coins); the car Kip drives on the world map is the one he picks here. Fictional dealer name.
var DEALER_LIVE=false;
const DEALER={on:DEALER_LIVE||/[?&#](lab|dealer)\b/.test(location.search+location.hash),cars:[],P:{}};
const DEALER_STOCK=[['wren',20000,42],['corella',32000,40],['kestrel',48000,46],['suv',56000,44],['brumby',68000,44],['camper',80000,34]];
// world map sprites: a little side view of each car (front to the right)
const CAR_SPR=(()=>{const T={
  hatch:['...kkkkk...','..kgggggk..','.bbbbbbbbb.','lbbbbbbbbbh','.bbdbbbdbb.','..tt...tt..'],
  sedan:['...kkkkk....','..kgggggk...','.bbbbbbbbbb.','lbbbbbbbbbbh','.bbdbbbbdbb.','..tt....tt..'],
  ute:['....kkkk....','...kgggk....','.bbbbbbbbbbb','lbbbbbbbbbbh','.bbdbbbbdbb.','..tt....tt..'],
  wagon:['..kkkkkkkk..','..kgggggggk.','.bbbbbbbbbbb','.bbbbbbbbbbb','lbbbbbbbbbbh','.bbdbbbbdbb.','..tt....tt..'],
  van:['.wwwwwwwwww..','.wgggwgggwwk.','.wwwwwwwwwwgk','lsssssssssssh','.wwdwwwwwdww.','..tt.....tt..']};
  const K={wren:['hatch','#1f9bb4','#11697b'],corella:['sedan','#e6e8ea','#9aa1a8'],kestrel:['ute','#b8211c','#6e130f'],suv:['wagon','#1f3f66','#0f2238'],brumby:['wagon','#565d63','#2a2f33'],camper:['van','#f2f2ee','#1f8a8a']};
  const out={};Object.keys(K).forEach(id=>{const [t,b,d]=K[id],rows=T[t],c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const x=c.getContext('2d');
    const pal={k:'#1c1c1e',g:'#9cc8e0',b,d:'#2a2a30',l:'#d8323a',h:'#ffe08a',t:'#1c1c1e',w:'#f2f2ee',s:d};rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='.')return;x.fillStyle=pal[ch];x.fillRect(i,j,1,1);}));out[id]=c;});return out;})();
const carSel=()=>(typeof S!=='undefined'&&S&&S.carSel&&S.cars&&S.cars[S.carSel])?S.carSel:null;
if(DEALER.on&&typeof RRR!=='undefined')(()=>{
  const G=new THREE.Group();G.name='dealer';scene.add(G);DEALER.g=G;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const put=(geo,mat,x,y,z,o)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.nc);m.receiveShadow=true;G.add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||8);
  const tex=(W,H,draw,rep)=>{const c=mk(W,H),x=c.getContext('2d');draw(x,W,H);return ctex(c,rep?{rep}:{});};
  const paint=(w,d,mat,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof mat==='string'?M(mat):mat);m.rotation.x=-Math.PI/2;m.position.set(x,y||.03,z);m.receiveShadow=true;G.add(m);return m;};
  const sign=(t,bg,fg,w,h,x,y,z,ry)=>{const L=Array.isArray(t)?t:[t];const tx=makeSign(L,Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));m.position.set(x,y,z);if(ry)m.rotation.y=ry;G.add(m);return m;};
  const r=mulberry32(3011),pick=a=>a[(r()*a.length)|0];
  // the area grows south: Teddington Rd and the dealer lot
  VPB.z2=27.5;try{ZONE_DEF.vp.rects.push([488,12,562,27,'#d8d2c4'],[488,12.4,562,14.6,'#4a4d55'],[498,15.3,552,25.4,'#a8583a'],[500,15.6,514,20,'#2a4a9a']);ZONE_DEF.vp.labels.push(['Teddington Rd',525,13.5,1],['Riverside Motors',507,17.6,1]);}catch(e){}
  box(76,.5,16,lmat(paveC,[38,8]),525,-.26,19.6,{noCast:true});
  paint(74,2.2,lmat(asphC,[37,1.1]),525,13.5,.02);for(let x=490;x<561;x+=2.4)paint(1,.07,'#f3f3ea',x,13.5,.026);paint(74,.09,'#9a968e',525,14.65,.027);paint(74,.09,'#9a968e',525,12.35,.027);
  signPost(492,12.0,makeSign(['TEDDINGTON RD'],56,10,'#1d3a6e','#ffffff'),1.6,.3);
  const brick=tex(16,16,(x)=>{x.fillStyle='#8a3a2e';x.fillRect(0,0,16,16);for(let j=0;j<16;j+=4)for(let i=(j%8?4:0);i<16;i+=8){x.fillStyle=pick(['#a8483a','#9a4034','#b85a48','#a04a3c']);x.fillRect(i,j,7,3);}},[27,5]);
  paint(54,10.1,new THREE.MeshLambertMaterial({map:brick}),525,20.35,.025);
  for(let x=516;x<552;x+=1.7){paint(.05,1.7,'#f3e6a0',x,18.2,.03);paint(.05,1.7,'#f3e6a0',x,22.8,.03);}
  // the showroom: white box, glass front to the lot, a long blue fascia with the name, a little blue awning over the door
  {const x0=507,z0=17.8,W=14,D=4.4,H=3;put(B(W,H,D),M('#f2f2ee'),x0,H/2,z0);col(x0-W/2,z0-D/2,x0+W/2,z0+D/2);
    const glass=new THREE.MeshLambertMaterial({map:tex(32,16,(x)=>{x.fillStyle='#5a7a90';x.fillRect(0,0,32,16);x.fillStyle='#8aaac0';x.fillRect(0,0,32,6);x.fillStyle='#e8eef2';for(let i=0;i<32;i+=8)x.fillRect(i,0,1,16);x.fillStyle='#c8344a';x.fillRect(4,11,6,3);x.fillStyle='#1f9bb4';x.fillRect(18,11,6,3);},[3,1])});
    const gl=new THREE.Mesh(new THREE.PlaneGeometry(W-1.2,2),glass);gl.position.set(x0,1.1,z0+D/2+.01);G.add(gl);
    put(B(W+.2,.9,.3),M('#1e3f8a'),x0,H+.25,z0+D/2-.05);put(B(W+.2,.12,.32),M('#f6f6f0'),x0,H-.24,z0+D/2-.04);
    sign(['RIVERSIDE MOTORS'],'#1e3f8a','#ffffff',4.2,.5,x0-3.2,H+.27,z0+D/2+.12);sign(['NEW & PRE-OWNED'],'#1e3f8a','#9cc8f0',3,.34,x0+3.6,H+.27,z0+D/2+.12);
    {const s=new THREE.Shape();s.moveTo(0,0);s.quadraticCurveTo(.6,.5,1.2,.55);s.lineTo(1.2,.5);s.quadraticCurveTo(.6,.42,0,-.06);s.closePath();const aw=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:2.2,bevelEnabled:false}),M('#1e3f8a'));aw.rotation.y=-Math.PI/2;aw.position.set(x0-4.4+1.1,1.9,z0+D/2);G.add(aw);}
    sign(['SALES · SERVICE'],'#f6f6f0','#1e3f8a',2.2,.3,x0+5,2.25,z0+D/2+.02);DEALER.P.showroom={x:x0-4.4,z:z0+D/2+1};}
  // tall pylon signs and bunting by the road
  [[497,15.2],[553,15.2]].forEach(([x,z])=>{put(B(.6,4.2,.3),M('#1e3f8a'),x,2.1,z);put(B(.66,.2,.36),M('#f6f6f0'),x,4.25,z);const s=sign(['RIVERSIDE','MOTORS','A$ DEALS'],'#1e3f8a','#ffffff',.56,1.4,x,3,z+.16);col(x-.32,z-.18,x+.32,z+.18);});
  for(let x=516;x<552;x+=.6){const t=(x-516)/36;put(new THREE.ConeGeometry(.08,.18,3),M(['#d8323a','#f6f6f0','#1e3f8a'][Math.round(x/.6)%3]),x,2.7-Math.sin(t*Math.PI*6)*.15,15.4,{rx:Math.PI,nc:1});}
  [516,528,540,552].forEach(x=>{put(C(.04,.04,2.9,5),M('#9aa0a6'),x,1.45,15.4);col(x-.06,15.34,x+.06,15.46);});
  // white hoop rails along the kerb (gaps to walk in), light towers, palms
  for(let x=499;x<551;x+=2.6){if(Math.abs(x-517.2)<1.4||Math.abs(x-533)<1.4)continue;const g=new THREE.Mesh(new THREE.TorusGeometry(.5,.05,6,12,Math.PI),M('#f6f6f0'));g.position.set(x,.1,15.0);G.add(g);col(x-.55,14.95,x+.55,15.05);}
  [[520,25],[546,25],[516,16.2]].forEach(([x,z])=>{put(C(.07,.1,5.2,6),M('#9aa0a6'),x,2.6,z);put(B(.9,.12,.3),M('#e8e8e0'),x,5.2,z);col(x-.1,z-.1,x+.1,z+.1);});
  if(FDET.palm&&FDET.bb){[[514.8,15.6],[524,15.6],[536,15.6],[548,15.6],[553,23]].forEach(([x,z],i)=>{const m=FDET.bb(FDET.palm,x,z,1.6,i%2?4.8:4.2,0,true);G.attach(m);col(x-.15,z-.12,x+.15,z+.12);});}
  // blue shade awnings over the back rows
  [[545,24.6]].forEach(([x,z])=>{put(B(10.5,.08,1.6),M('#2a5ab0'),x,2.5,z,{rx:-.08});[-5,5].forEach(o=>{put(C(.05,.05,2.2,6),M('#9aa0a6'),x+o,1.1,z-1.1);put(C(.05,.05,2.0,6),M('#9aa0a6'),x+o,1.0,z+1.1);col(x+o-.07,z-1.17,x+o+.07,z-1.03);col(x+o-.07,z+1.03,x+o+.07,z+1.17);});});
  // stock cars in the back rows
  if(CDET.makeCar)for(let x=517;x<551;x+=1.7){if(r()<.15)continue;const m=r()<.25?CDET.retroCar():CDET.makeCar(pick(['sedan','hatch','ute','hatch']),pick(['#f6f6f0','#f6f6f0','#d8dcd8','#2a2a30','#c8344a','#e8732a','#2f6fb0']));m.g.position.set(x,0,23.6);m.g.rotation.y=Math.PI/2;G.add(m.g);col(x-m.wid/2,23.6-m.len/2,x+m.wid/2,23.6+m.len/2);}
  // the six cars for sale: front row, nose to the camera, price board on a stand
  DEALER_STOCK.forEach(([id,price,spd],i)=>{const x=519.5+i*5.4,z=19.8,car=RRR.make(id);car.scale.setScalar(.36);car.rotation.y=Math.PI;car.position.set(x,0,z);car.traverse(o=>{if(o.isMesh)o.castShadow=true;});G.add(car);
    col(x-.45,z-.9,x+.45,z+.9);const C2=RRR.CARS[id];const nm=C2.name.toUpperCase();
    put(B(.05,.7,.05),M('#2a2a30'),x+.85,.35,z+1.2);sign([nm,price.toLocaleString('en-AU')+' COINS'],'#f6f6f0','#1e3f8a',1.3,.42,x+.85,.88,z+1.22);
    DEALER.cars.push({id,price,spd,x,z,car,name:C2.name});});
  // Sal the salesperson
  {const m=spriteMesh(humanFrames({hair:'#2a1d16',skin:'#c8865a',shirt:'#1e3f8a',pants:'#2a2a30',hat:null}),.95,1.58);m.position.set(502.6,0,21.8);G.add(m);blob(.85).position.set(502.6,.03,21.8);DEALER.P.sal={x:502.6,z:23};}
  G.visible=false;
})();
if(DEALER.on&&DEALER.g){
  const _vw=vpWalk;vpWalk=function(x,z){return _vw(x,z)||(x>489&&x<561&&z>=11.9&&z<25.8);};
  SAFE_SPOTS.vp.push([525,16.5]);
  const own=()=>{S.cars=S.cars||{retro:1};return S.cars;};
  const _t=cbdTargets;cbdTargets=function(T){_t(T);if(zoneOf(player.x)!=='vp')return;
    DEALER.cars.forEach(c=>{const have=own()[c.id],sel=S.carSel===c.id;T.push({x:c.x,z:c.z+1.6,r:1.3,label:have?(sel?c.name+' · your world map car':'Drive the '+c.name+' on the world map'):'Buy '+c.name+' · '+c.price.toLocaleString('en-AU')+' coins',
      act:()=>{if(have){S.carSel=c.id;save();toast(c.name+' · ready on the world map',2.2);return;}if(S.coins<c.price){toast('Not enough coins · '+c.price.toLocaleString('en-AU')+' needed',2.4);return;}
        S.coins-=c.price;own()[c.id]=1;S.carSel=c.id;save();say([{who:'Sal',text:'Congratulations! The '+c.name+' is all yours. Keys, full tank, and a free air freshener shaped like a quokka.'},{who:'Kip',text:'It’s waiting on the world map. Time for a road trip!'}]);}});});
    T.push({x:DEALER.P.sal.x,z:DEALER.P.sal.z,r:1.4,label:'Talk to Sal',act:()=>{const n=Object.keys(own()).length-1;say([{who:'Sal',text:n?'How’s the '+(RRR.CARS[S.carSel]?RRR.CARS[S.carSel].name:'little retro')+' driving? Come back any time to swap.':pick(['Every car here has been driven by a very careful kangaroo. Only on Sundays.','Twenty thousand coins gets you the Wren. Eighty gets you a camper with a bike rack. Dream big, Kip!','Test drives are on the world map. Pick one, then head out the highway gate.'])}]);}});
    if(own().retro&&S.carSel&&S.carSel!=='retro')T.push({x:DEALER.P.showroom.x,z:DEALER.P.showroom.z,r:1.3,label:'Drive the little retro mini again',act:()=>{S.carSel='retro';save();toast('Retro mini · ready on the world map',2);}});};
  const _zt=zoneTick;zoneTick=function(dt,t){_zt(dt,t);const here=zoneOf(player.x)==='vp'||(typeof LAB!=='undefined'&&LAB.on);if(DEALER.g.visible!==here)DEALER.g.visible=here;};
  [['dealer','Riverside Motors','place',4,()=>[[DEALER.P.showroom.x,DEALER.P.showroom.z]]]].forEach(([id,name,cat,r,pos])=>PCS.push({id,name,zone:'vp',cat,pos,r}));
  Object.assign(PC_HINTS,{dealer:'Riverside Motors · the blue-and-white car yard on Teddington Rd, south of Albany Hwy'});
}

