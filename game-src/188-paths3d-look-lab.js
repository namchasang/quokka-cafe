// ---------- Rottnest paths, bike lanes and rail bed in 3D (Look Lab ?lawn2 until Paul approves) ----------
// Paul (13 Nov 2026): bring back the paths, bike lanes and railway as real 3D, smooth and natural. Same lines as before (the
// island's PATHS, the bike-lane strips and WEST.rail), now built as raised ribbons: crushed-limestone footpaths with soft edges,
// grey asphalt lanes with white edge lines and low kerbs, and a gravel bed under the rails.
const PATHS3D={on:typeof GROUND3D!=='undefined'&&GROUND3D.on&&/[?&#]lawn2\b/.test(location.search+location.hash),n:0};
(function(){if(!PATHS3D.on)return;
  function tex(base,dots,edge){const c=mk(256,64),g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,256,64);const r=mulberry32(91);
    for(let i=0;i<1600;i++){const d=dots[(r()*dots.length)|0];g.fillStyle=d;g.globalAlpha=.25+r()*.5;g.beginPath();g.arc(r()*256,r()*64,.5+r()*1.4,0,6.283);g.fill();}g.globalAlpha=1;
    if(edge){g.fillStyle=edge;g.fillRect(0,3,256,3);g.fillRect(0,58,256,3);}
    const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;t.anisotropy=8;t.encoding=THREE.sRGBEncoding;return t;}
  const T={path:tex('#d9cfb4',['#b9ad90','#efe7d2','#a89c80','#c8bea4'],null),lane:tex('#7c7f82',['#5f6266','#9a9da0','#55585c'],'#f2efe6'),bed:tex('#8e8a82',['#6f6b64','#aaa59c','#5d5a54','#bcb7ad'],null)};
  const M={};for(const k in T)M[k]=new THREE.MeshLambertMaterial({map:T[k],side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  // a smooth ribbon along a polyline: Catmull-Rom through the points, width w, raised h, with sloped side skirts so it reads as 3D
  function ribbon(pts,w,h,mat,skirt){if(pts.length<2)return null;const V=pts.map(p=>new THREE.Vector3(p[0],0,p[1]));const cv=new THREE.CatmullRomCurve3(V,false,'centripetal');const L=cv.getLength(),N=Math.max(2,Math.ceil(L/.35));
    const P=[],U=[],I=[];let acc=0,prev=null;for(let i=0;i<=N;i++){const p=cv.getPointAt(i/N),t=cv.getTangentAt(i/N);if(prev)acc+=p.distanceTo(prev);prev=p;const nx=-t.z,nz=t.x;
      const sk=skirt||w*.18;[[-w/2-sk,-.01,0],[-w/2,h,.08],[w/2,h,.92],[w/2+sk,-.01,1]].forEach(([o,y,v])=>{P.push(p.x+nx*o,y,p.z+nz*o);U.push(acc/2,v);});}
    for(let i=0;i<N;i++)for(let k=0;k<3;k++){const a=i*4+k,b=a+4;I.push(a,b,a+1,a+1,b,b+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.__pxSkip=1;m.__pt=1;m.__islKeep=1;m.name='paths3d';scene.add(m);PATHS3D.n++;return m;}
  function build(){
    // footpaths: the island's own path lines (local coordinates), joined where they meet
    PATHS.forEach(p=>{if(!p.length||zoneOf(p[0][0])!=='island')return;ribbon(p,.95,.025,M.path);});
    // bike lanes: rebuilt along each old strip (kept hidden), a little wider and raised, with an edge line
    scene.children.filter(o=>o.userData&&o.userData.lane&&o.geometry&&o.geometry.type==='PlaneGeometry'&&zoneOf(o.position.x)==='island'&&o.geometry.parameters.width>1).forEach(o=>{
      const L=o.geometry.parameters.width,W=o.geometry.parameters.height,a=o.rotation.z,cx=o.position.x,cz=o.position.z,dx=Math.cos(a)*L/2,dz=-Math.sin(a)*L/2;
      ribbon([[cx-dx,cz-dz],[cx+dx,cz+dz]],Math.max(1,W),.04,M.lane,.12);});
    // rail bed: a low gravel bank under the sleepers
    if(typeof WEST!=='undefined'&&WEST.rail&&WEST.rail.length>1)ribbon(WEST.rail,1.7,.005,M.bed,.35);
    console.log('PATHS3D ribbons '+PATHS3D.n);}
  (function wait(){if(typeof GROUND3D!=='undefined'&&GROUND3D.done&&performance.now()>25000){try{build();}catch(e){console.error('paths3d',e);}try{if(typeof MEADOW!=='undefined'&&MEADOW.reset)MEADOW.reset();}catch(e){}return;}setTimeout(wait,1000);})();
})();
