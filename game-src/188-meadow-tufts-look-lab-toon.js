// ---------- Meadow grass like the Tree Lab, Rottnest only (Look Lab: ?toon until MEADOW_LIVE is true) ----------
// Paul (Nov 2026): "why isn't the game as pretty as the tree lab?" One big reason: the lab's lawn is full of long painted grass
// tufts and little flowers (about 0.7 per square unit); the island had only a few. Here every green patch of ground near the
// camera fills with them, in 8-unit chunks that are built as the camera moves and dropped when it is far (one instanced mesh per
// chunk). Never on paths, roads, sand, the bike lane or inside a building's footprint. Other maps are untouched.
const MEADOW_LIVE=false;
const MEADOW={on:MEADOW_LIVE||TOON_ON,chunks:new Map(),n:0};
(function(){if(!MEADOW.on)return;
  const CS=8,RAD=30,DENS=2.2;
  function tuftTex(flowers){const c=mk(64,64),g=c.getContext('2d'),r=mulberry32(flowers?7:3);
    for(let i=0;i<26;i++){const x0=32+(r()-.5)*14,a=-Math.PI/2+(r()-.5)*1.3,l=24+r()*30;g.strokeStyle=['#3f6e34','#558841','#6a9a4a','#85b25a','#9fc56a'][(r()*5)|0];g.lineWidth=2;g.beginPath();g.moveTo(x0,64);
      g.quadraticCurveTo(x0+Math.cos(a)*l*.5,64+Math.sin(a)*l*.5,x0+Math.cos(a)*l,64+Math.sin(a)*l);g.stroke();}
    if(flowers)for(let i=0;i<7;i++){const x=12+r()*40,y=8+r()*26;g.fillStyle=['#ffffff','#f6e27a','#c9a2f0','#f5a3c0','#ffffff'][(r()*5)|0];for(const[dx,dy]of[[0,-2],[2,0],[0,2],[-2,0]]){g.beginPath();g.arc(x+dx,y+dy,2,0,6.28);g.fill();}g.fillStyle='#f0b030';g.fillRect(x-1,y-1,2,2);}
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
  function tuftGeo(){const g=new THREE.BufferGeometry(),P=[],N=[],U=[],I=[];[0,Math.PI/2].forEach((a,k)=>{const cx=Math.cos(a)*.3,cz=Math.sin(a)*.3,b=k*4;
      [[-1,0,0,0],[1,0,1,0],[1,.44,1,1],[-1,.44,0,1]].forEach(([s,y,u,v])=>{P.push(cx*s,y,cz*s);N.push(0,1,.25);U.push(u,v);});I.push(b,b+1,b+2,b,b+2,b+3);});
    g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);g.computeBoundingSphere();return g;}
  let MAT=null,GEO=null,TD=null;
  // the island ground picture (green where grass grows), read once
  function ground(){if(TD)return TD;const W=terrC.width,H=terrC.height;if(W<8)return null;TD={W,H,d:terrC.getContext('2d').getImageData(0,0,W,H).data};return TD;}
  const green=(x,z)=>{/* the 3D ground (Paul, 13 Nov): grass everywhere inland except the salt lakes, paths are gone */if(typeof GROUND3D!=='undefined'&&GROUND3D.on){const t=landD(x,z);if(t<2.4||t===-9)return false;try{if(typeof islOldLake==='function'&&islOldLake(x,z))return false;if(typeof islGroundBlock==='function'&&islGroundBlock(x,z))return false;}catch(e){}return true;}const T=ground();if(!T)return false;const px=Math.floor((x-TB.x1)*TPX),py=Math.floor((z-TB.z1)*TPX);if(px<0||py<0||px>=T.W||py>=T.H)return false;const k=(py*T.W+px)*4;const R=T.d[k],G=T.d[k+1],B=T.d[k+2];return T.d[k+3]>200&&G>R*1.18&&G>B*1.25&&G>70;};
  const inBuilding=(x,z)=>colliders.some(c=>c.x1>-9000&&x>c.x1-.25&&x<c.x2+.25&&z>c.z1-.25&&z<c.z2+.25)||covered(x,z);
  // Paul (Nov 2026): no grass on the café deck, floors, paving or the airstrip. Anything flat that stands on the ground (decks, floors,
  // tables, paving, runway paint) is listed once by its footprint; a tuft never grows inside one.
  let COV=null;const CG=4;
  function covered(x,z){if(!COV){COV=new Map();const B=new THREE.Box3(),add=(b)=>{for(let i=Math.floor(b[0]/CG);i<=Math.floor(b[2]/CG);i++)for(let j=Math.floor(b[1]/CG);j<=Math.floor(b[3]/CG);j++){const k=i+','+j;let L=COV.get(k);if(!L)COV.set(k,L=[]);L.push(b);}};
      scene.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(scene.matrixWorld).invert();
      scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.visible||!o.geometry||o.name==='sea3'||!o.layers.test(camera.layers))return;let off=false;for(let q=o.parent;q;q=q.parent)if(!q.visible||!q.layers.test(camera.layers))off=true;if(off)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();B.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        const sx=B.max.x-B.min.x,sz=B.max.z-B.min.z;if(!isFinite(sx)||sx>25||sz>25||B.max.y<.045||B.min.y>1.2||sx*sz<.3)return;if(zoneOf((B.min.x+B.max.x)/2)!=='island')return;add([B.min.x-.15,B.min.z-.15,B.max.x+.15,B.max.z+.15]);});
      if(typeof WA!=='undefined'&&WA.rw)add([WA.rw.x1-1,WA.rw.z1-1.5,WA.rw.x2+1,WA.rw.z2+1.5]);}
    const L=COV.get(Math.floor(x/CG)+','+Math.floor(z/CG));if(L)for(const b of L)if(x>b[0]&&x<b[2]&&z>b[1]&&z<b[3])return true;return false;}
  const lanes=()=>(typeof BLANES!=='undefined'&&Array.isArray(BLANES))?BLANES.filter(p=>Array.isArray(p)&&p.length>1&&Array.isArray(p[0])):[];
  const onLane=(x,z)=>lanes().some(p=>{for(let i=1;i<p.length;i++)if(segD(x,z,p[i-1][0],p[i-1][1],p[i][0],p[i][1])<1.1)return true;return false;});
  function chunk(ci,cj){if(!MAT){MAT=[tuftTex(false),tuftTex(true)].map(t=>new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color('#0d1a08')}));GEO=tuftGeo();}
    const r=mulberry32((ci*73856093)^(cj*19349663)),pts=[[],[]],n=Math.round(CS*CS*DENS);
    for(let k=0;k<n*2&&pts[0].length+pts[1].length<n;k++){const x=(ci+r())*CS,z=(cj+r())*CS;if(zoneOf(x)!=='island')continue;if(!green(x,z)||inBuilding(x,z))continue;
      if(!(typeof GROUND3D!=='undefined'&&GROUND3D.on)){if(typeof pathD==='function'&&pathD(x,z)<1.0)continue;if(onLane(x,z))continue;}pts[r()<.2?1:0].push([x,z,.55+r()*.6,r()*3.14]);}
    const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),Y=new THREE.Vector3(0,1,0),meshes=[];
    pts.forEach((L,f)=>{if(!L.length)return;const im=new THREE.InstancedMesh(GEO,MAT[f],L.length);L.forEach(([x,z,s,a],i)=>{q.setFromAxisAngle(Y,a);m4.compose(new THREE.Vector3(x,0,z),q,new THREE.Vector3(s,s*(.8+((i*7)%5)*.1),s));im.setMatrixAt(i,m4);});
      im.receiveShadow=true;im.__pxSkip=1;im.__pt=1;scene.add(im);meshes.push(im);MEADOW.n+=L.length;});
    return meshes;}
  let lx=1e9,lz=1e9;
  function tick(){try{if(typeof ISL==='undefined'||!ISL.done)return;const x=camTarget.x,z=camTarget.z;if(zoneOf(x)!=='island'){return;}if(Math.hypot(x-lx,z-lz)<3)return;lx=x;lz=z;
      const i0=Math.floor((x-RAD)/CS),i1=Math.floor((x+RAD)/CS),j0=Math.floor((z-RAD)/CS),j1=Math.floor((z+RAD)/CS);let made=0;
      for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const k=i+','+j;if(MEADOW.chunks.has(k))continue;if(made>=6)continue;MEADOW.chunks.set(k,chunk(i,j));made++;}
      if(made>=6)lx=1e9;// more to build next frame
      MEADOW.chunks.forEach((ms,k)=>{const[i,j]=k.split(',').map(Number),cx=(i+.5)*CS,cz=(j+.5)*CS;if(Math.hypot(cx-x,cz-z)>RAD+CS*2){ms.forEach(m=>{scene.remove(m);m.dispose&&m.dispose();});MEADOW.chunks.delete(k);}});}catch(e){console.warn('meadow',e);MEADOW.on=false;}}
  /* after the island is tidied (houses stored, ground rebuilt) everything is planted again */MEADOW.reset=()=>{COV=null;MEADOW.chunks.forEach(ms=>ms.forEach(m=>{scene.remove(m);m.dispose&&m.dispose();}));MEADOW.chunks.clear();lx=1e9;};
  (function loop(){if(!MEADOW.on)return;tick();requestAnimationFrame(loop);})();
})();
