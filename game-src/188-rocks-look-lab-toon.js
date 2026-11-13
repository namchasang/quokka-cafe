// ---------- Limestone rocks like the Tree Lab, Rottnest only (Look Lab: ?toon until ROCK3_LIVE is true) ----------
// Paul (Nov 2026): the island's faceted rocks become rounded, weathered limestone: a noisy ball with a wind-cut flat top and a
// ledge, warm bands low down, a pale top, moss on the up-facing parts and a pitted surface, sunk a little into the ground with a
// darker damp ring. Same spot, size and turn as each old rock. Other maps keep theirs.
const ROCK3_LIVE=false;
const ROCK3={on:ROCK3_LIVE||TOON_ON,n:0};
(function(){if(!ROCK3.on)return;
  const rn=(x,y,z,k)=>Math.sin(x*1.7+k)*Math.sin(y*2.3+k*.7)*Math.sin(z*1.9+k*1.3)+.5*Math.sin(x*4.1+z*3.3+k)*Math.sin(y*3.7+k*2.1);
  const C={top:new THREE.Color('#e2d3b0'),mid:new THREE.Color('#c9b088'),band:new THREE.Color('#b5824f'),low:new THREE.Color('#7a6448'),moss:new THREE.Color('#5f7a34')};
  let MAT=null,RING=null;const GEO=[];
  function pit(){const cv=mk(128,128),g=cv.getContext('2d'),r=mulberry32(21);g.fillStyle='#fff';g.fillRect(0,0,128,128);
    for(let i=0;i<500;i++){g.fillStyle=`rgba(90,70,50,${.08+r()*.18})`;g.beginPath();g.arc(r()*128,r()*128,.6+r()*2.2,0,6.28);g.fill();}
    for(let i=0;i<60;i++){g.strokeStyle='rgba(255,250,235,.35)';g.lineWidth=1;g.beginPath();const x=r()*128,y=r()*128;g.moveTo(x,y);g.lineTo(x+(r()-.5)*14,y+(r()-.5)*4);g.stroke();}
    const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);t.encoding=THREE.sRGBEncoding;return t;}
  function geo(i){if(GEO[i])return GEO[i];const g=new THREE.IcosahedronGeometry(1,3),p=g.attributes.position,k=i*1.7+.3;
    for(let n=0;n<p.count;n++){const X=p.getX(n),Y=p.getY(n),Z=p.getZ(n);const f=1+rn(X,Y,Z,k)*.14;let y=Y*f*.62;if(y>.38)y=.38+(y-.38)*.35;p.setXYZ(n,X*f*(1+.15*Math.sin(k)),y,Z*f);}
    g.computeVertexNormals();const col=new Float32Array(p.count*3),N=g.attributes.normal,c=new THREE.Color();
    for(let v=0;v<p.count;v++){const y=p.getY(v)/.62,ny=N.getY(v);c.copy(C.low).lerp(C.mid,Math.min(1,(y+.6)/.8));const band=Math.sin(y*14+k)*.5+.5;if(y<.25)c.lerp(C.band,band*.45);
      if(ny>.55)c.lerp(C.top,(ny-.55)*1.6);if(ny>.7&&rn(p.getX(v)*3,0,p.getZ(v)*3,k)>.25)c.lerp(C.moss,.55);c.convertSRGBToLinear();col[v*3]=c.r;col[v*3+1]=c.g;col[v*3+2]=c.b;}
    g.setAttribute('color',new THREE.BufferAttribute(col,3));return GEO[i]=g;}
  function ringTex(){const cv=mk(64,64),g=cv.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(0,0,0,.6)');gr.addColorStop(.7,'rgba(0,0,0,.3)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(cv);}
  const isRock=o=>{const t=o.geometry&&o.geometry.type;if(t!=='DodecahedronGeometry'&&t!=='IcosahedronGeometry')return false;const p=o.geometry.parameters||{};if((p.detail||0)>0||(p.radius||1)<.25)return false;
    const m=o.material;if(!m||Array.isArray(m)||!m.color)return false;const h={};m.color.getHSL(h);return h.s<.35&&h.l>.35;};// pale, greyish-cream: limestone, not bushes
  function run(){scene.updateMatrixWorld(true);const V=new THREE.Vector3(),hits=[];
    scene.traverse(o=>{if(!o.isMesh||o.__rock3||!isRock(o))return;o.getWorldPosition(V);scene.worldToLocal(V);if(zoneOf(V.x)!=='island')return;hits.push(o);});
    if(!hits.length)return;if(!MAT){MAT=new THREE.MeshLambertMaterial({vertexColors:true,map:pit()});RING=new THREE.MeshBasicMaterial({map:ringTex(),transparent:true,depthWrite:false,opacity:.45,color:'#2a2418'});}
    hits.forEach((o,i)=>{const r=(o.geometry.parameters.radius||1)*1.08;o.__rock3=1;o.geometry=geo(i%8);o.scale.multiplyScalar(r);o.material=MAT;o.rotation.x=0;o.rotation.z=0;o.castShadow=o.receiveShadow=true;o.__pxSkip=1;o.position.y-=r*.12;
      if(o.parent===scene){const s=r*Math.max(o.scale.x/r,1);const ring=new THREE.Mesh(new THREE.PlaneGeometry(s*2.5,s*2.1),RING);ring.rotation.x=-Math.PI/2;ring.rotation.z=o.rotation.y;ring.position.set(o.position.x,.02,o.position.z);ring.__pxSkip=1;scene.add(ring);}ROCK3.n++;});}
  [2500,9000,21000].forEach(t=>setTimeout(()=>{try{run();}catch(e){console.warn('rock3',e);}},t));
})();
// ?fps (Paul, Nov 2026: measure the toon look on his phone): a small readout of frames per second (1 s average and the worst of the last 10 s)
if(/[?&#]fps\b/.test(location.search+location.hash)){const d=document.createElement('div');d.style.cssText='position:fixed;left:6px;bottom:6px;z-index:99999;font:12px monospace;color:#fff;background:rgba(0,0,0,.55);padding:3px 6px;border-radius:6px;pointer-events:none';document.body.appendChild(d);
  let n=0,t0=performance.now();const hist=[];(function f(){n++;const t=performance.now();if(t-t0>=1000){const fps=n*1000/(t-t0);hist.push(fps);if(hist.length>10)hist.shift();d.textContent=`${fps.toFixed(0)} fps · low ${Math.min(...hist).toFixed(0)}`;n=0;t0=t;}requestAnimationFrame(f);})();}
