// ---------- Nothing built on the island railway (Look Lab: ?toon) ----------
// Paul (Nov 2026): a green-roofed building stood on the rails by the station. Any building wall that the track runs through, and
// the roof above it, is taken away (Rottnest only; the train, platforms and rails themselves stay).
const RAILCLR={on:/[?&#]toon\b/.test(location.search+location.hash),n:0};
(function(){if(!RAILCLR.on)return;
  function run(){if(typeof WEST==='undefined'||!WEST.rail||WEST.rail.length<2)return;const R=WEST.rail,pts=[];for(let k=1;k<R.length;k++){const a=R[k-1],b=R[k],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/.3));for(let i=0;i<=n;i++)pts.push([a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n]);}
    scene.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(scene.matrixWorld).invert(),B=new THREE.Box3(),hits=[];
    const isTrain=o=>{for(let p=o;p;p=p.parent)if(p===WEST.train||p===WEST.car2)return true;return false;};
    scene.traverse(o=>{if(!o.isMesh||!o.visible||o.isInstancedMesh||!o.geometry||isTrain(o))return;if(o.geometry.type!=='BoxGeometry')return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();B.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
      const h=B.max.y-B.min.y,w=B.max.x-B.min.x,d=B.max.z-B.min.z;if(h<1.1||w<1||d<1||w>14||d>14||B.min.y>.6)return;if(zoneOf((B.min.x+B.max.x)/2)!=='island')return;
      const cx=(B.min.x+B.max.x)/2,cz=(B.min.z+B.max.z)/2;if((Math.hypot(cx-R[0][0],cz-R[0][1])<3.8||Math.hypot(cx-R[R.length-1][0],cz-R[R.length-1][1])<3.8)&&h>=1.3&&w>=2&&d>=2)hits.push(B.clone());// the shed at the end of the line (Paul: it stood on the rails)
      else if(pts.some(p=>p[0]>B.min.x-.6&&p[0]<B.max.x+.6&&p[1]>B.min.z-.6&&p[1]<B.max.z+.6))hits.push(B.clone());});
    if(!hits.length)return;scene.traverse(o=>{if(!o.isMesh||!o.visible||o.isInstancedMesh||!o.geometry||isTrain(o))return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();B.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
      const cx=(B.min.x+B.max.x)/2,cz=(B.min.z+B.max.z)/2;const sx=B.max.x-B.min.x,sz=B.max.z-B.min.z,thin=sx<.25&&sz<.25,wide=Math.max(sx,sz)>1;if(hits.some(H=>{const m=((B.min.y>.8&&wide)||(thin&&B.max.y<=H.max.y+.05))?1.6:.3;return cx>H.min.x-m&&cx<H.max.x+m&&cz>H.min.z-m&&cz<H.max.z+m&&B.min.y>-.05&&B.max.y<H.max.y+2.5;})){o.visible=false;RAILCLR.n++;}/* its verandah and posts go too */});
    colliders.forEach(c=>{if(hits.some(H=>c.x1>H.min.x-.5&&c.x2<H.max.x+.5&&c.z1>H.min.z-.5&&c.z2<H.max.z+.5)){c.x1=c.x2=c.z1=c.z2=-9999;}});}
  [6000,16000].forEach(t=>setTimeout(()=>{try{run();}catch(e){console.warn('railclr',e);}},t));
})();
