// ---------- Kip's garden moves to the open meadow in the middle of the island (Look Lab: ?toon until GARDEN_MEADOW_LIVE) ----------
// Paul (Nov 2026): the vegetable beds go out to the grassland between Rottnest Lighthouse and the road junction to the east,
// so the café surroundings are open. Everything inside the old garden fence (beds, soil, fence, paths, sign, colliders, the
// GARDEN rect and the PLOTS numbers) moves together as one piece; saves keep working (plots are by index).
const GARDEN_MEADOW_LIVE=false;
const GARDEN_MEADOW={on:GARDEN_MEADOW_LIVE||/[?&#]toon\b/.test(location.search+location.hash),to:null};
(function(){if(!GARDEN_MEADOW.on)return;
  const run=()=>{
    const R={x1:GARDEN.x1-1.2,x2:GARDEN.x2+.08,z1:GARDEN.z1-1.2,z2:GARDEN.z2+1.2},cx=(GARDEN.x1+GARDEN.x2)/2,cz=(GARDEN.z1+GARDEN.z2)/2;
    const inR=(x,z)=>x>R.x1&&x<R.x2&&z>R.z1&&z<R.z2;
    // pick the clearest flat spot near the middle of the meadow: between the lighthouse and the junction to its east
    const lh=(typeof COACH!=='undefined'&&COACH.find(c=>c.id==='light'))||{x:-41,z:0};const aim={x:lh.x-12,z:lh.z-6};
    const segD=(x,z,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],L=dx*dx+dz*dz||1;let t=((x-a[0])*dx+(z-a[1])*dz)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);};
    const pathD=(x,z)=>{let d=1e9;for(const P of PATHS){if(!P.length||P[0][0]>=99.5)continue;for(let k=1;k<P.length;k++)d=Math.min(d,segD(x,z,P[k-1],P[k]));}return d;};
    const hw=(GARDEN.x2-GARDEN.x1)/2+1.5,hd=(GARDEN.z2-GARDEN.z1)/2+1.8;
    const clear=(x,z)=>{for(const c of colliders){if(c.x1>1e7)continue;if(c.x2>x-hw&&c.x1<x+hw&&c.z2>z-hd&&c.z1<z+hd)return false;}
      for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const X=x+i*hw,Z=z+j*hd;if(typeof landD==='function'&&landD(X,Z)<3)return false;}
      if(pathD(x,z)<Math.max(hw,hd)+1)return false;
      if(typeof TREE3D!=='undefined')for(const p of TREE3D.pos){if(Math.abs(p[0]-x)<hw+p[2]*.5&&Math.abs(p[1]-z)<hd+p[2]*.5)return false;}
      return true;};
    let best=null,bd=1e9;for(let rr=0;rr<=22;rr+=.75)for(let a=0;a<24;a++){const x=aim.x+Math.cos(a/24*6.2832)*rr,z=aim.z+Math.sin(a/24*6.2832)*rr;if(clear(x,z)){const d=Math.hypot(x-aim.x,z-aim.z);if(d<bd){bd=d;best=[x,z];}}}
    if(!best){console.warn('garden: no clear meadow spot');return;}
    const dx=best[0]-cx,dz=best[1]-cz;GARDEN_MEADOW.to=best;
    // trees and bushes that would stand in the beds are already excluded; plants left inside the old fence go with it
    scene.children.slice().forEach(o=>{if(o===player.mesh||o.isLight||o.isCamera)return;const p=o.position;if(!inR(p.x,p.z))return;
      const b=new THREE.Box3().setFromObject(o);if(!b.isEmpty()&&(b.max.x-b.min.x>R.x2-R.x1+1||b.max.z-b.min.z>R.z2-R.z1+1))return;p.x+=dx;p.z+=dz;});
    colliders.forEach(c=>{if(c.x1>1e7)return;if(inR((c.x1+c.x2)/2,(c.z1+c.z2)/2)){c.x1+=dx;c.x2+=dx;c.z1+=dz;c.z2+=dz;}});
    PLOTS.forEach(p=>{p.x+=dx;p.z+=dz;});
    // action spots that stood inside the old fence (the café plans board and friends) move with their meshes
    ['BOARD','MAILBOX','GSTORE','STAR_SPOT'].forEach(k=>{try{const o=eval(k);if(o&&typeof o.x==='number'&&inR(o.x,o.z)){o.x+=dx;o.z+=dz;}}catch(e){}});
    GARDEN.x1+=dx;GARDEN.x2+=dx;GARDEN.z1+=dz;GARDEN.z2+=dz;
    try{refreshPlots();}catch(e){}
    try{console.log('T3D garden moved to '+best.map(v=>v.toFixed(1))+' by '+dx.toFixed(1)+','+dz.toFixed(1));}catch(e){}
  };
  if(typeof ISL!=='undefined'&&!ISL.done)ISL.late.push(run);else run();
})();
