// ---------- The Basin lookout (Look Lab: ?toon until BASIN_LIVE is true) ----------
// Paul (Nov 2026, from his photo): a grey timber boardwalk with post-and-rail sides runs from the path by THE BASIN sign
// to a lookout platform at the top of the dune, then steps down onto the sand of the bay.
const BASIN_LIVE=false;
const BASIN={on:BASIN_LIVE||TOON_ON};
(function(){if(!BASIN.on)return;
  function build(){const S0=IW(19.5,-8.4),B=IW(20,-12.8);let sx=S0.x,sz=S0.z;
    // walk from the sign towards the bay until the sand (landD ~ .5)
    // straight towards The Basin from its sign: start 2.5 inland, end a little onto the sand
    const dx0=B.x-sx,dz0=B.z-sz,l0=Math.hypot(dx0,dz0)||1,dx=dx0/l0,dz=dz0/l0;let t0=3;for(let t=0;t<10;t+=.1)if(landD(sx+dx*t,sz+dz*t)<.25){t0=t;break;}
    sx-=dx*2.5;sz-=dz*2.5;const L=t0+2.5+.7;
    const G=new THREE.Group(),wood=c=>new THREE.MeshLambertMaterial({color:c}),PL=wood('#a59a88'),PD=wood('#8a7f6e'),PO=wood('#7d7466');
    const ang=Math.atan2(dx,dz);G.position.set(sx,0,sz);G.rotation.y=ang;scene.add(G);
    const add=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
    const W=1.2,top=.55,flat=Math.max(1.5,L*.45),plat=1.8;
    // level walk, then a wider lookout platform, then stairs down to the sand
    for(let z=0;z<flat;z+=.22)add(new THREE.BoxGeometry(W,.05,.2),z%(.44)<.2?PL:PD,0,top,z+.1);
    add(new THREE.BoxGeometry(W*2,.06,plat),PL,W*.5,top,flat+plat/2);
    const st=Math.max(4,Math.round((L-flat-plat)/.3)),sd=(L-flat-plat)/st;
    for(let k=0;k<st;k++)add(new THREE.BoxGeometry(W,.06,sd*1.05),k%2?PD:PL,0,top*(1-(k+1)/(st+1)),flat+plat+sd*(k+.5));
    // posts and two rails each side; the lookout gets a rail on its open sides
    const post=(x,z,y0)=>add(new THREE.BoxGeometry(.09,.75,.09),PO,x,y0+.37,z);
    const rail=(x0,z0,y0,x1,z1,y1)=>{const d=Math.hypot(x1-x0,z1-z0,y1-y0);[.42,.72].forEach(h=>{const r=add(new THREE.BoxGeometry(.05,.05,d),PO,(x0+x1)/2,(y0+y1)/2+h,(z0+z1)/2);r.lookAt(new THREE.Vector3(x1,y1+h,z1).applyMatrix4(G.matrixWorld));r.rotation.set(Math.atan2(-(y1-y0),Math.hypot(x1-x0,z1-z0)),Math.atan2(x1-x0,z1-z0),0);});};
    [-W/2,W/2].forEach(x=>{for(let z=0;z<=flat;z+=1.2)post(x,z,top);rail(x,0,top,x,flat,top);});
    post(-W/2,flat+plat,top);post(W*1.5,flat,top);post(W*1.5,flat+plat,top);rail(W*1.5,flat,top,W*1.5,flat+plat,top);rail(W/2,flat+plat,top,W*1.5,flat+plat,top);
    const zEnd=flat+plat+sd*st;[-W/2,W/2].forEach(x=>{post(x,zEnd,0);rail(x,flat+plat,top,x,zEnd,0);});
    // piles under the walk
    for(let z=.6;z<flat+plat;z+=1.2)[-W/2+.1,W/2-.1].forEach(x=>add(new THREE.BoxGeometry(.1,top,.1),PO,x,top/2,z));
    G.traverse(o=>o.__pxSkip=1);BASIN.g=G;BASIN.len=L;}
  const go=()=>{if(typeof ISL==='undefined'||!ISL.done||typeof IW!=='function'){setTimeout(go,500);return;}try{build();}catch(e){console.warn('basin',e);}};setTimeout(go,1500);
})();
