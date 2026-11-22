// ---------- Café 2 (Look Lab ?cafe2, Paul 22 Nov 2026): one café building, umbrella seat sets, patient customers ----------
// Paul: Kip got stuck on the café deck (fixed for everyone 23 Nov 2026 in blocked()); drop the wooden deck and keep only the
// building; customers sit at seat sets the player buys (yellow or blue canvas umbrella, table, two chairs); upgrading the café
// must not change the building (the five styles already recolour it; levels only add tables now); with enough seats customers
// are more patient. Reading of "enough seats": when a customer sits down and at least one more seat is still free, the café is
// not crowded and they wait 20% longer; under a bought umbrella they wait another 10% (shade). Still to do: the Island Builder
// draws the same café model as the game.
var CAFE2_LIVE=false;
const CAFE2={on:CAFE2_LIVE||/[?&#]cafe2\b/.test(location.search+location.hash),max:6,price:{yellow:150,blue:150},
  col:{yellow:['#f2c230','#fff6dc'],blue:['#2f78c8','#f4f8ff']},slots:[],sets:[],done:false};
if(CAFE2.on){
  const FLOOR_Z=-1.0;/* local z where the roofed floor ends (counter at -2.55, Kip serves at about -1.65) */
  const inFront=(x,z)=>x>DECK.x1&&x<DECK.x2&&z>DECK.z1&&z<DECK.z2&&z>IWz(0,FLOOR_Z);
  const _gy=groundY;groundY=function(x,z){if(CAFE2.done&&inFront(x,z))return .02;return _gy(x,z);};
  function umbrellaTex(c){const k=mk(32,8),x=k.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=i%2?c[1]:c[0];x.fillRect(i*4,0,4,8);}x.fillStyle='rgba(0,0,0,.15)';x.fillRect(0,7,32,1);return k;}
  const MAT={};const mat=(k,c)=>MAT[k]||(MAT[k]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  function makeSet(slot,colour){const g=new THREE.Group(),C=CAFE2.col[colour];const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
    add(new THREE.CylinderGeometry(.55,.55,.07,16),mat('top','#f4efe4'),0,.86,0);add(new THREE.CylinderGeometry(.06,.1,.82,8),mat('leg','#6b6f74'),0,.43,0);
    add(new THREE.CylinderGeometry(.03,.03,2.3,6),mat('pole','#e8e2d6'),0,1.15,0);
    const can=new THREE.Mesh(new THREE.ConeGeometry(1.35,.55,16,1,true),new THREE.MeshLambertMaterial({map:ctex(umbrellaTex(C)),side:THREE.DoubleSide}));can.position.set(0,2.35,0);can.castShadow=true;g.add(can);
    add(new THREE.SphereGeometry(.06,6,6),mat('knob'+colour,C[0]),0,2.66,0);
    [-1,1].forEach(s=>{add(new THREE.BoxGeometry(.46,.06,.46),mat('chair'+colour,C[0]),s*.88,.46,0);add(new THREE.BoxGeometry(.06,.5,.46),mat('chair'+colour,C[0]),s*1.1,.72,0);
      [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]].forEach(([a,b])=>add(new THREE.BoxGeometry(.04,.44,.04),mat('leg','#6b6f74'),s*.88+a,.22,b));});
    g.position.set(slot.x,0,slot.z);scene.add(g);
    const c={x1:slot.x-.55,z1:slot.z-.55,x2:slot.x+.55,z2:slot.z+.55};colliders.push(c);
    const seats=[-1,1].map(s=>{const st={x:slot.x+s*.88,z:slot.z+.07,busy:false,set:colour};SEATS.push(st);return st;});
    return {g,c,seats,colour};}
  /* free ground for a set: on land, no collider, building or other set within reach of its chairs */
  function findSlots(){const cand=[[-3.4,4.7],[3.4,4.7]];
    [[-7.4,-1.4],[7.4,-1.4],[-7.4,1.8],[7.4,1.8],[-7.4,-4.4],[7.4,-4.4],[-10.2,-1.4],[10.2,-1.4],[-10.2,1.8],[10.2,1.8],[-10.2,-4.4],[10.2,-4.4]].forEach(p=>cand.push(p));
    const out=[];for(const [lx,lz] of cand){const p=IW(lx,lz);let ok=true;
      for(let a=0;a<12&&ok;a++){const t=a/12*6.283;for(const r of [0,.6,1.25]){if(blocked(p.x+Math.cos(t)*r,p.z+Math.sin(t)*r)){ok=false;break;}}}
      if(ok&&SEATS.some(s=>Math.hypot(s.x-p.x,s.z-p.z)<1.4))ok=false;if(ok&&out.some(o=>Math.hypot(o.x-p.x,o.z-p.z)<2.9))ok=false;
      if(ok)out.push({x:p.x,z:p.z,lx,lz});if(out.length>=CAFE2.max)break;}return out;}
  function sync(){if(!CAFE2.done)return;let demo=null;try{if(SHOT&&/[?&#]c2demo\b/.test(location.search+location.hash))demo=['yellow','blue','yellow','blue','yellow','blue'];}catch(e){}/* photo mode preview: ?shot=...&cafe2&c2demo */
    const want=(demo||S.c2sets||[]).slice(0,CAFE2.slots.length);
    while(CAFE2.sets.length>want.length){const s=CAFE2.sets.pop();scene.remove(s.g);colliders.splice(colliders.indexOf(s.c),1);s.seats.forEach(q=>{const i=SEATS.indexOf(q);if(i>=0)SEATS.splice(i,1);});}
    want.forEach((c,i)=>{if(!CAFE2.sets[i])CAFE2.sets[i]=makeSet(CAFE2.slots[i],c);});}
  CAFE2.sync=sync;
  /* the café building stays the same at every level: no terrace slab, fence, flower boxes or roof garden from levels */
  const isTable=o=>o.isGroup&&o.children.some(m=>m.geometry&&m.geometry.type==='CylinderGeometry'&&m.geometry.parameters&&Math.abs(m.geometry.parameters.radiusTop-.55)<.01);
  function tidy(){LV_DECOR[3].forEach(o=>{if(!isTable(o))o.visible=false;});LV_DECOR[4].forEach(o=>{if(!isTable(o))o.visible=false;});
    if(CAFE2.deck)CAFE2.deck.forEach(m=>m.visible=false);}
  const _ac=applyCafe;applyCafe=function(){_ac.apply(this,arguments);try{tidy();sync();}catch(e){console.warn('cafe2',e);}};
  /* customers: more patient when the café is not full, and under an umbrella */
  const _sp=spawnCustomer;spawnCustomer=function(){const n=customers.length;_sp.apply(this,arguments);if(customers.length>n){const c=customers[customers.length-1];
    const free=SEATS.filter(s=>!s.busy&&(s.lvl||1)<=cafeLv()).length;let k=1;if(free>=1)k+=.2;if(c.seat&&c.seat.set)k+=.1;c.max=Math.round(c.max*k);c.patience=c.max;c.c2=k;}};
  /* café panel: buy seat sets */
  const _rc=renderCafe;renderCafe=function(){_rc.apply(this,arguments);try{panel();}catch(e){console.warn('cafe2 panel',e);}};
  function panel(){const G=$('#cfStyles');if(!G||!$('#cfMain')||$('#cfMain').hidden)return;let box=$('#cf2Sets');if(!box){box=document.createElement('div');box.id='cf2Sets';G.parentNode.insertBefore(box,G.nextSibling);}
    const have=S.c2sets||[],room=Math.min(CAFE2.max,CAFE2.slots.length||CAFE2.max);box.innerHTML='';
    const h=document.createElement('b');h.textContent='Umbrella seats · '+have.length+'/'+room;h.style.display='block';h.style.margin='10px 0 4px';box.appendChild(h);
    const p=document.createElement('p');p.textContent='A table, two chairs and a canvas umbrella out front. More seats bring more customers, and when the café is not full they wait longer.';p.style.margin='0 0 6px';box.appendChild(p);
    const row=document.createElement('div');row.className='cfGrid';box.appendChild(row);
    ['yellow','blue'].forEach(k=>{const d=document.createElement('div');d.className='cfS';const sw=document.createElement('div');sw.className='cfSw';CAFE2.col[k].forEach(c=>{const i=document.createElement('i');i.style.background=c;sw.appendChild(i);});
      const n=document.createElement('b');n.textContent=(k==='yellow'?'Yellow':'Blue')+' umbrella set';const bt=document.createElement('button');bt.type='button';bt.className='btn';bt.id='cf2-'+k;
      const full=have.length>=room;bt.textContent=full?'No more room':'Buy · '+CAFE2.price[k]+' coins';bt.disabled=full||S.coins<CAFE2.price[k];
      bt.onclick=()=>{if(S.coins<CAFE2.price[k]||(S.c2sets||[]).length>=room)return;S.coins-=CAFE2.price[k];S.c2sets=(S.c2sets||[]).concat(k);save();sync();renderCafe();toast('☂️ New '+k+' umbrella set out front!',2.5);};
      d.append(sw,n,bt);row.appendChild(d);});
    if(have.length){const rm=document.createElement('button');rm.type='button';rm.className='btn ghost';rm.textContent='Swap colour of the last set';rm.style.marginTop='6px';
      rm.onclick=()=>{const a=S.c2sets.slice();a[a.length-1]=a[a.length-1]==='yellow'?'blue':'yellow';S.c2sets=a;const s=CAFE2.sets.pop();if(s){scene.remove(s.g);colliders.splice(colliders.indexOf(s.c),1);s.seats.forEach(q=>{const i=SEATS.indexOf(q);if(i>=0)SEATS.splice(i,1);});}save();sync();renderCafe();};box.appendChild(rm);}}
  /* build once the island and the café platform are in place */
  (function wait(){let ok=false;try{ok=ISL.done&&(!IBMAP.on||IBMAP.done)&&!!S;}catch(e){/* IBMAP is declared in a later part */}if(!ok){setTimeout(wait,500);return;}
    try{const w=DECK.x2-DECK.x1;CAFE2.deck=[];const d=DECK.z2-DECK.z1;scene.traverse(o=>{const q=o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters;if(q&&Math.abs(q.width-w)<.05&&Math.abs(q.depth-d)<.05&&Math.abs(q.height-.16)<.01)CAFE2.deck.push(o);});
      const fz0=-5,fz1=FLOOR_Z,a=IW(0,(fz0+fz1)/2);const fl=box(w,.16,fz1-fz0,deckMat,a.x,.08,a.z,{noCast:true});CAFE2.floor=fl;
      CAFE2.done=true;tidy();CAFE2.slots=findSlots();sync();window.__CAFE2=CAFE2;}catch(e){console.error('cafe2',e);}})();
}
