// ---------- Boats at anchor in Thomson Bay (Paul, 13 Nov 2026, from the Water Sea Engine lab and his bay photo) ----------
// Motor yachts with pointed hulls, stepped white decks, dark window strips, some with a flybridge and a navy or black band, plus
// tenders and jet skis; they bob on the clear water and cast their shadows on the sand under it. Kept away from the jetty and ferry.
(function(){if(!TOON_ON)return;
  const L=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c).convertSRGBToLinear()});const WH=L('#f7f7f3'),GL=L('#26313d'),TK=L('#c9a77c');
  const hullGeo=(len,w,h)=>{const sh=new THREE.Shape();sh.moveTo(-len/2,-w/2);sh.lineTo(len*.18,-w/2);sh.quadraticCurveTo(len*.46,-w*.42,len/2,0);sh.quadraticCurveTo(len*.46,w*.42,len*.18,w/2);sh.lineTo(-len/2,w/2);sh.lineTo(-len/2,-w/2);
    const g=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:1});g.rotateX(-Math.PI/2);return g;};
  const yacht=(len,band,tiers,fly)=>{const g=new THREE.Group(),w=len*.32,k=len/7.5;const lower=new THREE.Mesh(hullGeo(len,w*.92,.3*k),L(band));lower.position.y=-.16*k;g.add(lower);const upper=new THREE.Mesh(hullGeo(len,w,.36*k),WH);upper.position.y=.13*k;g.add(upper);
    const plat=new THREE.Mesh(new THREE.BoxGeometry(.35*k,.06,w*.9),TK);plat.position.set(-len/2-.15*k,.04,0);g.add(plat);
    let y=.58*k,l=len*.62,x=-len*.08;for(let t=0;t<tiers;t++){const c=new THREE.Mesh(new THREE.BoxGeometry(l,.3*k,w*(.82-t*.1)),WH);c.position.set(x,y,0);g.add(c);const win=new THREE.Mesh(new THREE.BoxGeometry(l*.86,.11*k,w*(.83-t*.1)),GL);win.position.set(x+l*.04,y+.03*k,0);g.add(win);y+=.3*k;l*=.66;x-=len*.04;}
    if(fly){const r=new THREE.Mesh(new THREE.BoxGeometry(l*1.3,.04,w*.7),WH);r.position.set(x,y+.25*k,0);g.add(r);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.25*k,5),WH);p.position.set(x+a*l*.55,y+.12*k,b*w*.3);g.add(p);});}
    g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;};
  const small=(len,col,seat)=>{const g=new THREE.Group();const h=new THREE.Mesh(hullGeo(len,len*.42,.18),L(col));h.position.y=-.06;g.add(h);const s=new THREE.Mesh(new THREE.BoxGeometry(len*.2,.18,len*.25),L(seat));s.position.set(-len*.25,.2,0);g.add(s);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;};
  const depthAt=(x,z)=>{try{const v=landD(x,z);return v===-9?-1:-v;}catch(e){return -1;}};/* landD is distance inland; out at sea it is negative */
  function build(){const B=[];const keep=[[(JETTY.x1+JETTY.x2)/2,5,7],[JETTY.x1,5,7]];if(typeof ferry!=='undefined'&&ferry.position)keep.push([ferry.position.x,ferry.position.z,9]);const rnd=mulberry32(4242);const spots=[];
    for(let t=0;t<900&&spots.length<14;t++){const x=-60+rnd()*110,z=-20+rnd()*60;const d=depthAt(x,z);if(d<12||d>30||d===-9)continue;/* well out from the beach (Paul) */if(keep.some(([a,b,r])=>Math.hypot(x-a,z-b)<r))continue;if(spots.some(s=>Math.hypot(s[0]-x,s[1]-z)<5.2))continue;spots.push([x,z]);}
    spots.forEach(([x,z],i)=>{let g;if(i<9){const len=4.2+rnd()*2.6;g=yacht(len,['#f7f7f3','#1f3e7a','#f7f7f3','#2a2a30','#f7f7f3'][i%5],len>5.8?3:2,rnd()<.6);g.userData.lift=.12;}else if(i<12){g=small(1.3,'#f4f4f0','#2a2a30');g.userData.lift=.03;}else{g=small(.8,'#e8e8e4','#1f2a3a');g.userData.lift=.03;}
      g.position.set(x,-.09,z);g.rotation.y=rnd()*Math.PI*2;g.userData.ph=rnd()*6;g.name='bayBoat';scene.add(g);B.push(g);});
    (function bob(){const t=performance.now()/1000;B.forEach(b=>{b.position.y=-.09+b.userData.lift+Math.sin(t*1.1+b.userData.ph)*.035;b.rotation.z=Math.sin(t*.8+b.userData.ph)*.025;b.rotation.x=Math.sin(t*.7+b.userData.ph*1.3)*.015;});requestAnimationFrame(bob);})();
    window.BAY_BOATS=B;}
  const wait=()=>{if(typeof ISL!=='undefined'&&ISL.done&&typeof Dg!=='undefined'){try{build();}catch(e){console.error('bay boats',e);}return;}setTimeout(wait,500);};wait();
})();
