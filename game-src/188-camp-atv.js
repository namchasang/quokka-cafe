// ---------- Quad bike at Serpentine Falls camp (Paul, 23 Nov 2026: "ให้ขี่ atv ใน camppark ได้ด้วย") ----------
// A red quad bike parked by Marlo's motorhome. "Ride the quad bike": Kip sits on it and rides twice his walking speed anywhere he can
// walk (wades the creeks, climbs what he can climb); "Park the quad bike" leaves it where he stops. Leaving the camp parks it too.
(()=>{if(typeof CAMPPARK==='undefined'||!CAMPPARK.on)return;
  const Q={g:null,on:false,x:0,z:0,h:0,wheels:[],spin:0};window.__ATV=Q;
  function build(){const g=new THREE.Group(),L=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)}),red=L('#c8342c'),blk=L('#232428'),grey=L('#8a8d92'),seat=L('#2e2f36');
    const add=(geo,m,x,y,z,r)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(r)o.rotation.set(...r);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
    add(new THREE.BoxGeometry(.62,.22,1.25),red,0,.42,0);add(new THREE.BoxGeometry(.7,.12,.42),red,0,.56,.42);add(new THREE.BoxGeometry(.7,.12,.4),red,0,.56,-.46);/* fenders */
    add(new THREE.BoxGeometry(.32,.12,.55),seat,0,.6,-.05);add(new THREE.BoxGeometry(.5,.05,.3),grey,0,.66,-.55);/* seat, rear rack */
    add(new THREE.CylinderGeometry(.03,.03,.34,6),grey,0,.72,.42,[.35,0,0]);add(new THREE.CylinderGeometry(.025,.025,.62,6),blk,0,.88,.48,[0,0,Math.PI/2]);/* steering post, bars */
    add(new THREE.BoxGeometry(.18,.07,.04),L('#fff6c8'),0,.5,.66);/* head light */
    [[-.4,.42],[.4,.42],[-.4,-.42],[.4,-.42]].forEach(([x,z])=>{const w=add(new THREE.CylinderGeometry(.24,.24,.22,14),blk,x,.24,z,[0,0,Math.PI/2]);Q.wheels.push(w);add(new THREE.CylinderGeometry(.1,.1,.23,10),grey,x,.24,z,[0,0,Math.PI/2]);});
    g.traverse(o=>{o.__pxSkip=1;});return g;}
  function place(){const K=TRIPS.srp&&TRIPS.srp.K;if(!K||!CAMPPARK.CK||Q.g)return;Q.g=build();TRIPS.srp.G.add(Q.g);
    const v=K.van||K.arrive;let p=null;for(let r=2.5;r<9&&!p;r+=.5)for(let a=0;a<16;a++){const x=v[0]+Math.cos(a/16*6.283)*r,z=v[1]+Math.sin(a/16*6.283)*r;if(!blocked(x,z)&&!blocked(x+.7,z)&&!blocked(x-.7,z)&&!blocked(x,z+.9)&&!blocked(x,z-.9)){p=[x,z];break;}}
    p=p||v;Q.x=p[0];Q.z=p[1];Q.h=.6;sit();}
  function sit(){Q.g.position.set(Q.x,groundY(Q.x,Q.z),Q.z);Q.g.rotation.y=Q.h;}
  function mount(){Q.on=true;player.x=Q.x;player.z=Q.z;player.carry=null;toast('\u{1F3CD} Quad bike: ride anywhere at camp. Tap Park to get off.',2.6);}
  function park(){Q.on=false;player.bike=false;const p=freeNear(player.x+Math.cos(Q.h)*.9,player.z-Math.sin(Q.h)*.9);player.x=p[0];player.z=p[1];toast('\u{1F3CD} Parked',1.4);}
  /* riding: the normal movement at bike speed; Kip sits on the quad, the quad follows and turns the way it goes */
  const _up=updatePlayer;updatePlayer=function(dt){if(!Q.on)return _up.apply(this,arguments);const px=player.x,pz=player.z;player.bike=true;const r=_up.apply(this,arguments);
    player.mesh.visible=true;player.bikeMesh.visible=false;const dx=player.x-px,dz=player.z-pz,d=Math.hypot(dx,dz);
    if(d>1e-4){const t=Math.atan2(dx,dz);let a=t-Q.h;a=Math.atan2(Math.sin(a),Math.cos(a));Q.h+=a*Math.min(1,dt*8);Q.spin+=d/.24;}
    Q.x=player.x;Q.z=player.z;sit();Q.wheels.forEach(w=>{w.rotation.x=Q.spin;});const gy=groundY(player.x,player.z);player.mesh.position.y=gy+.5;player.blob.visible=false;return r;};
  const _bt=buildTargets;buildTargets=function(){const T=_bt.apply(this,arguments);try{if(zoneOf(player.x)!=='srp'){if(Q.on){Q.on=false;player.bike=false;}return T;}place();if(!Q.g)return T;
      if(Q.on)return[{x:player.x,z:player.z,r:3,label:'Park the quad bike',act:park}];/* while riding, the only thing to do is park */
      T.push({x:Q.x,z:Q.z,r:1.6,label:'Ride the quad bike',act:mount});}catch(e){console.warn('atv',e);}return T;};
  setInterval(()=>{try{if(Q.on&&zoneOf(player.x)!=='srp'){Q.on=false;player.bike=false;player.blob.visible=true;}if(!Q.on&&player.blob&&!player.blob.visible&&zoneOf(player.x)!=='srp')player.blob.visible=true;}catch(e){}},1000);
})();
