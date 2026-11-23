// ---------- Serpentine Falls camp (Look Lab ?camppark, Paul 23 Nov 2026: "เอาขึ้นเกมส์จริงใน map camppark") ----------
// The Stream & Falls Lab placed in the game as its own map (zone srp, x 1730..1850), built 100% by the Stream & Falls Engine
// (part 188-engine-streams.js, gammaOut): the scarp, streams from the ground's heights, cascades over granite into plunge pools,
// jarrah/marri forest, grass trees, ferns and sedges, grass tufts, leaf litter, gravel, pebbles and moss. The engine works in metres;
// the map uses it at 0.55 (trees 7-12 units, the biggest fall about 9 units high) so it sits at the game's scale.
// A small camp clearing by the biggest falls: Kip's tent, a campfire ring and a picnic table. With ?camppark Kip is taken there once the
// game runs; "Drive home" by the camp sign brings him back to the café. Graphics Low builds the lighter version (fewer tufts and stones).
var CAMPPARK_LIVE=false;
const CAMPPARK={on:CAMPPARK_LIVE||/[?&#]camppark\b/.test(location.search+location.hash),S:.55,CX:1790,CZ:0,E:null};
if(CAMPPARK.on&&typeof TRIPS!=='undefined'&&TRIP_ON&&typeof STREAMS_ENGINE!=='undefined')(()=>{
  const k='srp',T=TRIPS[k]={x1:1730,x2:1850,z1:-45,z2:45,tour:null,name:'Serpentine Falls',title:'Serpentine Falls · camp',bg:'#5e7a3a'};
  const G=new THREE.Group();G.name='trip_'+k;G.visible=false;scene.add(G);T.G=G;
  const K={id:k,x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2,walk:()=>false,h:()=>0,arrive:[CAMPPARK.CX,0],van:[CAMPPARK.CX-3,2],targets:null,tick:null,
    zone:{rects:[[T.x1,T.z1,T.x2,T.z2,T.bg]],labels:[[T.title,CAMPPARK.CX,0,1]]}};T.K=K;T.built=false;
  ZONE_DEF[k]={B:{x1:T.x1,x2:T.x2,z1:T.z1,z2:T.z2},title:T.title,eb:'Camping · Darling Scarp',bg:T.bg,rects:K.zone.rects,labels:K.zone.labels};SAFE_SPOTS[k]=[K.arrive];TOWN_NAME[k]=T.title;
  TRIP_BUILD[k]=function(G,K){const S=CAMPPARK.S,CX=CAMPPARK.CX,CZ=CAMPPARK.CZ;
    const lite=typeof GFX!=='undefined'&&GFX&&GFX.level==='low';
    const E=CAMPPARK.E=STREAMS_ENGINE.create({gammaOut:true,lite});E.root.scale.setScalar(S);E.root.position.set(CX,0,CZ);E.root.traverse(o=>{o.__pxSkip=1;});G.add(E.root);G.__pxSkip=1;
    const L=(x,z)=>[(x-CX)/S,(z-CZ)/S],W=(lx,lz)=>[CX+lx*S,CZ+lz*S];
    const TB=new Map();E.trees.forEach(t=>{const kk=Math.floor(t[0]/6)+','+Math.floor(t[2]/6);(TB.get(kk)||TB.set(kk,[]).get(kk)).push(t);});
    const trunk=(lx,lz)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const A=TB.get((Math.floor(lx/6)+a)+','+(Math.floor(lz/6)+b));if(A)for(const t of A)if(Math.hypot(lx-t[0],lz-t[2])<.75)return true;}return false;};
    K.h=(x,z)=>{const [lx,lz]=L(x,z);return S*E.gAt(Math.max(-79,Math.min(79,lx)),Math.max(-79,Math.min(79,lz)));};
    const solid=[];/* camp props, in game coords */
    K.walk=(x,z)=>{const [lx,lz]=L(x,z);if(Math.abs(lx)>77||Math.abs(lz)>77)return false;if(E.inWater(lx,lz))return false;if(E.slopeAt(lx,lz)>1.05)return false;if(trunk(lx,lz))return false;
      for(const r of solid)if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3])return false;return true;};
    /* the camp clearing: flat dry ground 7-16 m from the biggest pool, as close to it as possible */
    const q=E.big||E.plunge[0];let best=null,bs=1e9;
    for(let r=7;r<=18;r+=1)for(let a=0;a<36;a++){const t=a/36*6.283,lx=q.x+Math.cos(t)*r,lz=q.z+Math.sin(t)*r;if(Math.abs(lx)>70||Math.abs(lz)>70)continue;if(E.inWater(lx,lz)||trunk(lx,lz))continue;
      let sl=0;for(const [dx,dz] of [[0,0],[2,0],[-2,0],[0,2],[0,-2],[3,3],[-3,-3]])sl=Math.max(sl,E.slopeAt(lx+dx,lz+dz));if(sl>.35)continue;const sc=sl*20+r;if(sc<bs){bs=sc;best=[lx,lz];}}
    if(!best)best=[q.x+10,q.z+8];
    const [ax,az]=W(best[0],best[1]);K.arrive=[ax,az];K.van=[ax-2.2,az+1.6];
    const camp=new THREE.Group();camp.__pxSkip=1;G.add(camp);const lam=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
    const put=(m,x,z,dy)=>{m.position.set(x,K.h(x,z)+(dy||0),z);m.castShadow=m.receiveShadow=true;camp.add(m);return m;};
    /* tent: a green dome with a door flap */
    {const g=new THREE.Group();const dome=new THREE.Mesh(new THREE.SphereGeometry(1,14,8,0,6.283,0,Math.PI/2),lam('#3f7a5a'));dome.scale.set(1.15,.85,1);g.add(dome);
      const door=new THREE.Mesh(new THREE.CircleGeometry(.42,12,0,Math.PI),lam('#2a4a38'));door.position.set(0,.01,1.0);g.add(door);
      [[-1,0],[1,0]].forEach(([s])=>{const pole=new THREE.Mesh(new THREE.TorusGeometry(1.05,.02,4,16,Math.PI),lam('#d8d0c0'));pole.rotation.y=s*.6;pole.scale.set(1.1,.82,1);g.add(pole);});
      const tx=ax+2.4,tz=az-1.6;g.rotation.y=-.5;put(g,tx,tz,0);solid.push([tx-1.3,tz-1.2,tx+1.3,tz+1.2]);}
    /* campfire: stone ring, crossed logs, a glow */
    {const g=new THREE.Group();for(let i=0;i<9;i++){const a=i/9*6.283;const s=new THREE.Mesh(new THREE.DodecahedronGeometry(.16,0),lam('#8e8a80'));s.position.set(Math.cos(a)*.5,.08,Math.sin(a)*.5);g.add(s);}
      [0,1.2,2.3].forEach(r=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,.7,6),lam('#5a3e26'));l.rotation.set(Math.PI/2-.35,r,0);l.position.y=.14;g.add(l);});
      const fl=new THREE.Mesh(new THREE.ConeGeometry(.2,.55,7),new THREE.MeshBasicMaterial({color:0xffa43a}));fl.position.y=.38;g.add(fl);CAMPPARK.flame=fl;
      const fx=ax-.6,fz=az+2.2;put(g,fx,fz,0);solid.push([fx-.6,fz-.6,fx+.6,fz+.6]);}
    /* picnic table */
    {const g=new THREE.Group(),wd=lam('#8a6440');const top=new THREE.Mesh(new THREE.BoxGeometry(1.6,.08,.7),wd);top.position.y=.72;g.add(top);
      [-1,1].forEach(s=>{const b=new THREE.Mesh(new THREE.BoxGeometry(1.6,.06,.25),wd);b.position.set(0,.42,s*.6);g.add(b);[-.65,.65].forEach(x=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.08,.72,.08),wd);l.position.set(x,.36,s*.2);g.add(l);});});
      const px=ax+2.6,pz=az+2.4;g.rotation.y=.3;put(g,px,pz,0);solid.push([px-.9,pz-.75,px+.9,pz+.75]);}
    /* the camp sign by the track (Drive home is here) */
    {const c=mk(64,24),x=c.getContext('2d');x.fillStyle='#5a3e26';x.fillRect(0,0,64,24);x.fillStyle='#f2e6c8';x.font='bold 9px monospace';x.textAlign='center';x.fillText('SERPENTINE',32,10);x.fillText('FALLS CAMP',32,20);
      const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.4,.55,.06),new THREE.MeshLambertMaterial({map:ctex(c)}));b.position.y=1.1;g.add(b);[-.55,.55].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.08,1.2,.08),lam('#4a3220'));p.position.set(x,.6,0);g.add(p);});
      put(g,K.van[0],K.van[1]-.6,0);}
    K.zone.labels=[[T.title,ax,az-4,1]];SAFE_SPOTS[k]=[K.arrive];
    K.tick=(dt,t)=>{E.update(dt);if(CAMPPARK.flame){const f=1+.18*Math.sin(t*13)+.1*Math.sin(t*7.3);CAMPPARK.flame.scale.set(1,f,1);}};
    K.targets=TT=>{for(let i=TT.length-1;i>=0;i--)if(/^Tour van|^Ask the guide/.test(TT[i].label||''))TT.splice(i,1);/* no tour van here: Kip drove */TT.push({x:K.van[0],z:K.van[1],r:1.6,label:'Drive home · back to the café',act:()=>campHome()});
      const qq=E.big;if(qq){const [px,pz]=W(qq.land?qq.land.x:qq.x,qq.land?qq.land.z:qq.z);TT.push({x:px,z:pz,r:5,label:'Serpentine Falls',act:()=>toast('\u{1F4A6} Serpentine Falls: the water slides down polished granite into the pool.',3)});}};
    window.__CAMPPARK=CAMPPARK;};
  function campHome(){transit=true;fadeTarget=.95;setTimeout(()=>{const sp=freeNear(...SAFE_SPOTS.island[0]);player.x=sp[0];player.z=sp[1];S.time+=30;updateCamera(0,true);fadeTarget=0;transit=false;toast('Home at the café',2);save();},700);}
  CAMPPARK.enter=function(){if(transit||VISIT)return;transit=true;fadeTarget=.95;toast('Driving to Serpentine Falls…',1.8);
    setTimeout(()=>{tripEnsure(k);player.bike=false;player.carry=null;player.lying=false;player.x=K.arrive[0];player.z=K.arrive[1];updateCamera(0,true);hideOverlays();fadeTarget=0;transit=false;S.seenZ=S.seenZ||{};S.seenZ[k]=1;toast('Serpentine Falls · camp',2.6);},800);};
  /* the lab: once a game is running, take Kip to the camp (once per page load) */
  (function go(){try{if(running&&!overlay&&!dlgOpen()&&!transit&&typeof player!=='undefined'&&!CAMPPARK.went&&(typeof IBMAP==='undefined'||!IBMAP.on||IBMAP.done)){CAMPPARK.went=1;CAMPPARK.enter();return;}}catch(e){}setTimeout(go,800);})();
})();
