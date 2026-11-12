// ---------- Kip's big garden in the open meadow (Look Lab: ?toon until GARDEN_MEADOW_LIVE is true) ----------
// Paul (Nov 2026): the vegetable garden moves out of the café surroundings to the grassland between Rottnest Lighthouse and
// the road junction to the east (by bus stop 16), and grows to 20 beds. The old fence, paths and beds are rebuilt as a
// 5 x 4 grid with a gate; the tank, sign and the café plans board stand just outside the new fence. Saves keep working:
// plots are by index, the first 6 keep their crops, beds 7-20 start empty.
const GARDEN_MEADOW_LIVE=false;
const GARDEN_MEADOW={on:GARDEN_MEADOW_LIVE||/[?&#]toon\b/.test(location.search+location.hash),to:null,beds:20};
(function(){if(!GARDEN_MEADOW.on)return;
  const COLS=5,ROWS=4,SX=2.1,SZ=2.5,FW=COLS*SX/2+.7,FD=ROWS*SZ/2+.9;
  const run=()=>{
    const R={x1:GARDEN.x1-1.2,x2:GARDEN.x2+.08,z1:GARDEN.z1-1.2,z2:GARDEN.z2+1.2},cx=(GARDEN.x1+GARDEN.x2)/2,cz=(GARDEN.z1+GARDEN.z2)/2;
    const inR=(x,z)=>x>R.x1&&x<R.x2&&z>R.z1&&z<R.z2;
    // the clearest flat spot near the middle of the meadow: between the lighthouse and the junction to its east
    const lh=(typeof COACH!=='undefined'&&COACH.find(c=>c.id==='light'))||{x:-41,z:0};const aim={x:lh.x-14,z:lh.z};
    const segD=(x,z,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],L=dx*dx+dz*dz||1;let t=((x-a[0])*dx+(z-a[1])*dz)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);};
    const pathD=(x,z)=>{let d=1e9;for(const P of PATHS){if(!P.length||P[0][0]>=99.5)continue;for(let k=1;k<P.length;k++)d=Math.min(d,segD(x,z,P[k-1],P[k]));}return d;};
    const hw=FW+1.4,hd=FD+1.6;
    // the island roads and cycle lanes too (Paul: the beds sat on the road)
    const LN=(typeof BLANES!=='undefined'&&Array.isArray(BLANES)?BLANES.filter(p=>Array.isArray(p)&&Array.isArray(p[0])&&Array.isArray(p[1])).map(p=>[p[0],p[1]]):[]).concat(typeof BIKE_LANE!=='undefined'?[BIKE_LANE.map(([a,b])=>{const q=IW(a,b);return[q.x,q.z];})]:[]);
    const roadD=(x,z)=>{let d=1e9;for(const P of LN)for(let k=1;k<P.length;k++)d=Math.min(d,segD(x,z,P[k-1],P[k]));return d;};
    // what may be cleared for the garden: plant sprites (they are swapped for 3D trees later) and their small colliders
    const plantSet=new Set(BB.filter(o=>o.isMesh&&!(o.userData&&o.userData.frames&&o.userData.frames.length>1)&&o.parent===scene&&!(typeof SIGN_TEX!=='undefined'&&o.material&&SIGN_TEX.has(o.material.map))));
    const obst=[];scene.children.forEach(o=>{if(plantSet.has(o)||o===player.mesh||o.isLight)return;if(inR(o.position.x,o.position.z))return;if(Math.abs(o.position.x-aim.x)>60||Math.abs(o.position.z-aim.z)>60)return;
      const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;const sx=b.max.x-b.min.x,sz=b.max.z-b.min.z;if(sx>14||sz>14||b.max.y-b.min.y<.3)return;obst.push(b);});
    const clear=(x,z)=>{for(const c of colliders){if(c.x1>1e7)continue;if(c.x2-c.x1<1.5&&c.z2-c.z1<1.5)continue;if(inR((c.x1+c.x2)/2,(c.z1+c.z2)/2))continue;if(c.x2>x-hw&&c.x1<x+hw&&c.z2>z-hd&&c.z1<z+hd)return false;}
      for(let i=-1;i<=1;i+=.5)for(let j=-1;j<=1;j+=.5){const X=x+i*hw,Z=z+j*hd;if(typeof landD==='function'&&landD(X,Z)<2.5)return false;if(pathD(x+i*(hw-.8),z+j*(hd-.8))<.9)return false;if(roadD(x+i*hw,z+j*hd)<1.8)return false;}
      for(const b of obst)if(b.max.x>x-hw&&b.min.x<x+hw&&b.max.z>z-hd&&b.min.z<z+hd)return false;
      return true;};
    let best=null,bd=1e9;for(let rr=0;rr<=30;rr+=.75)for(let a=0;a<32;a++){const x=aim.x+Math.cos(a/32*6.2832)*rr,z=aim.z+Math.sin(a/32*6.2832)*rr;if(clear(x,z)){const d=Math.hypot(x-aim.x,z-aim.z);if(d<bd){bd=d;best=[x,z];}}}
    if(!best){console.log('T3D garden: no clear meadow spot');return;}
    const tx=best[0],tz=best[1],dx=tx-cx,dz=tz-cz;GARDEN_MEADOW.to=best;
    // plants standing where the beds go are taken out (with their small colliders)
    plantSet.forEach(o=>{if(Math.abs(o.position.x-tx)<hw-.6&&Math.abs(o.position.z-tz)<hd-.6){scene.remove(o);const bi=BB.indexOf(o);if(bi>=0)BB.splice(bi,1);}});
    for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];if(c.x1>1e7)continue;if(c.x2-c.x1<1.5&&c.z2-c.z1<1.5&&Math.abs((c.x1+c.x2)/2-tx)<hw&&Math.abs((c.z1+c.z2)/2-tz)<hd)colliders.splice(i,1);}
    // 1. carry everything from the old garden over, then drop the old fence, paths, beds and soil
    const moved=[];scene.children.slice().forEach(o=>{if(o===player.mesh||o.isLight||o.isCamera)return;const p=o.position;if(!inR(p.x,p.z))return;
      const b=new THREE.Box3().setFromObject(o);if(!b.isEmpty()&&(b.max.x-b.min.x>R.x2-R.x1+1||b.max.z-b.min.z>R.z2-R.z1+1))return;p.x+=dx;p.z+=dz;moved.push(o);});
    for(let i=colliders.length-1;i>=0;i--){const c=colliders[i];if(c.x1>1e7)continue;if(inR((c.x1+c.x2)/2,(c.z1+c.z2)/2))colliders.splice(i,1);}
    const oldSoil=new Set(PLOTS.map(p=>p.soil)),oldSpark=new Set(PLOTS.map(p=>p.spark));
    PLOTS.forEach(p=>{['plant','drop'].forEach(k=>{if(p[k]){scene.remove(p[k]);const bi=BB.indexOf(p[k]);if(bi>=0)BB.splice(bi,1);p[k]=null;}});p.key=undefined;});
    const keep=[];moved.forEach(o=>{const m=o.material,g=o.geometry,gp=g&&g.parameters||{};
      const drop=m===fenceMat||oldSoil.has(o)||oldSpark.has(o)||m===bedMat||(g&&g.type==='PlaneGeometry'&&Math.abs(o.rotation.x+Math.PI/2)<.01&&o.position.y<.1);
      if(drop){scene.remove(o);const bi=BB.indexOf(o);if(bi>=0)BB.splice(bi,1);}else keep.push(o);});
    // 2. things that stay (tank, sign, café plans board) step out to just beyond the new fence, on the same side as before
    const push=(o,ox,oz)=>{if(Math.abs(ox)>FW+.4||Math.abs(oz)>FD+.4)return[ox,oz];return Math.abs(ox)/FW>Math.abs(oz)/FD?[Math.sign(ox||1)*(FW+.9),oz*FD/(FD+1)]:[ox*FW/(FW+1),Math.sign(oz||1)*(FD+.9)];};
    const groups=new Map();keep.forEach(o=>{const k=Math.round((o.position.x-tx)*2)+','+Math.round((o.position.z-tz)*2);const ox=o.position.x-tx,oz=o.position.z-tz;
      // parts of one prop (post + board, tank + lid) share a spot, so they move by the same step
      let key=null;for(const [kk,v] of groups)if(Math.hypot(v.ox-ox,v.oz-oz)<.9){key=kk;break;}if(!key){key=k;groups.set(key,{ox,oz,list:[]});}groups.get(key).list.push(o);});
    // props that land on the gate side are spread out so the gate stays open
    const front=[];groups.forEach(G=>{G.t=push(G.ox,G.oz);if(G.t[1]>FD)front.push(G);});front.sort((a,b)=>a.ox-b.ox);
    const slots=[-FW+1.2,-FW+3,FW-3,FW-1.2,-FW+4.8,FW-4.8];front.forEach((G,i)=>{G.t=[slots[i%slots.length],FD+.9];});
    groups.forEach(G=>{const [nx,nz]=G.t,sx=nx-G.ox,sz=nz-G.oz;G.list.forEach(o=>{o.position.x+=sx;o.position.z+=sz;});G.sx=sx;G.sz=sz;
      const b=new THREE.Box3();G.list.forEach(o=>b.expandByObject(o));if(!b.isEmpty()&&b.max.y>.5)col(b.min.x,b.min.z,b.max.x,b.max.z);});
    ['BOARD','MAILBOX','GSTORE','STAR_SPOT'].forEach(k=>{try{const o=eval(k);if(o&&typeof o.x==='number'&&inR(o.x,o.z)){o.x+=dx;o.z+=dz;let G0=null,gd=1e9;groups.forEach(G=>{const d=Math.hypot(G.ox-(o.x-tx),G.oz-(o.z-tz));if(d<gd){gd=d;G0=G;}});if(G0&&gd<2.5){o.x+=G0.sx;o.z+=G0.sz;}else{const [nx,nz]=push(o.x-tx,o.z-tz);o.x=tx+nx;o.z=tz+nz;}}}catch(e){}});
    // 3. the new garden: sandy ground, 5 x 4 beds, a fence with a gate facing the path side
    {const gm=lmat(pathC,[FW,FD*.8]);gm.polygonOffset=true;gm.polygonOffsetFactor=-2;gm.polygonOffsetUnits=-2;flat(FW*2-.2,FD*2-.2,gm,tx,.05,tz);}
    for(let i=0;i<COLS*ROWS;i++){const c=i%COLS,r=(i/COLS)|0,x=tx+(c-(COLS-1)/2)*SX,z=tz+(r-(ROWS-1)/2)*SZ-.25;let p=PLOTS[i];if(!p){p={};PLOTS.push(p);}p.x=x;p.z=z;
      box(1,.26,1.1,bedMat,x,.13,z);const s=new THREE.Mesh(new THREE.PlaneGeometry(.88,.98),soilDry);s.rotation.x=-Math.PI/2;s.position.set(x,.265,z);s.receiveShadow=true;scene.add(s);p.soil=s;
      p.spark=spriteMesh([iconCanvas('spark')],.4,.4,{basic:true,shadow:false});p.spark.visible=false;scene.add(p.spark);col(x-.5,z-.55,x+.5,z+.55);}
    if(S&&Array.isArray(S.plots))while(S.plots.length<PLOTS.length)S.plots.push(null);
    const x1=tx-FW,x2=tx+FW,z1=tz-FD,z2=tz+FD;// no fence (Paul, Nov 2026)
    flat(1.4,1.2,lmat(pathC,[.7,.6]),tx,.02,z2+.5);
    GARDEN.x1=x1;GARDEN.x2=x2;GARDEN.z1=z1;GARDEN.z2=z2;
    try{refreshPlots();}catch(e){console.warn('garden refresh',e);}
    try{console.log('T3D garden '+PLOTS.length+' beds at '+best.map(v=>v.toFixed(1)));}catch(e){}
  };
  if(typeof ISL!=='undefined'&&!ISL.done)ISL.late.push(run);else run();
  // a save loaded later (title screen -> play) may still have 6 plot slots
  const _sg=typeof startGame==='function'?startGame:null;if(_sg)startGame=function(){const r=_sg.apply(this,arguments);try{if(S&&Array.isArray(S.plots))while(S.plots.length<PLOTS.length)S.plots.push(null);refreshPlots();}catch(e){}return r;};
})();
