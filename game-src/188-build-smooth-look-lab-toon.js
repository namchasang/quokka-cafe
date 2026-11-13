// ---------- Smooth buildings on Rottnest like the Tree Lab (Look Lab: ?toon until BSMOOTH_LIVE is true) ----------
// Paul (Nov 2026): no pixel skins (PXK) on Rottnest. Every wall box and roof the pixel kit dressed is repainted smooth, from the
// colour the wall had before the kit: cream render with soft course lines (or timber boards for brown walls), framed windows with
// blue glass and a flower box on the ground floor, a timber door on one long face, a pale cornice; roofs get rows of tiles
// (terracotta orange for red and brown roofs). Same shapes, same places. Other maps keep the pixel kit.
const BSMOOTH_LIVE=false;
const BSMOOTH={on:BSMOOTH_LIVE||TOON_ON,walls:0,roofs:0};
(function(){if(!BSMOOTH.on)return;
  const PU=56;// canvas pixels per unit
  const C=h=>new THREE.Color(h),hx=c=>'#'+c.getHexString();
  const lum=c=>c.r*.3+c.g*.59+c.b*.11;
  const isWood=c=>{const hsl={};c.getHSL(hsl);return hsl.h>.03&&hsl.h<.12&&hsl.s>.25&&hsl.l<.45;};
  const shade=(c,f)=>hx(c.clone().multiplyScalar(f));
  const tex=cv=>{const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;return t;};
  const cache=new Map();
  // one face of a wall: w x h units; door: put a door in the middle of the ground floor
  function facade(col,w,h,door,seed){const key=hx(col)+'|'+w.toFixed(1)+'|'+h.toFixed(1)+'|'+(door?1:0);if(cache.has(key))return cache.get(key);
    const W=Math.max(16,Math.min(1024,Math.round(w*PU))),H=Math.max(16,Math.min(1024,Math.round(h*PU))),cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),k=W/w,kh=H/h;
    let s=(Math.abs(seed|0)%2147483646)+1;const r=()=>(s=(s*16807)%2147483647)/2147483647;
    const wood=isWood(col),base=wood?col:(lum(col)>.55?col:col.clone().lerp(C('#f3e8d0'),.25));
    g.fillStyle=hx(base);g.fillRect(0,0,W,H);
    if(wood){const pw=.2*kh;for(let y=0;y<H;y+=pw){g.fillStyle=shade(base,.92+r()*.14);g.fillRect(0,y,W,pw);g.fillStyle='rgba(50,30,15,.35)';g.fillRect(0,y+pw-1.5,W,1.5);
        for(let q=0;q<W/40;q++){g.fillStyle='rgba(60,35,20,.18)';g.fillRect(r()*W,y+2+r()*(pw-5),12+r()*30,1);}}}
    else{for(let y=0;y<H;y+=.2*kh){g.fillStyle='rgba(150,120,80,.14)';g.fillRect(0,y,W,1);}
      for(let q=0;q<W*H/900;q++){g.fillStyle=`rgba(${r()<.5?'255,250,235':'120,100,70'},${.05+r()*.06})`;g.beginPath();g.arc(r()*W,r()*H,2+r()*6,0,6.283);g.fill();}}
    // weathering: darker at the foot, a soft lit band at the top
    let gr=g.createLinearGradient(0,H,0,H-.5*kh);gr.addColorStop(0,'rgba(70,55,35,.28)');gr.addColorStop(1,'rgba(70,55,35,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
    g.fillStyle='rgba(255,252,240,.55)';g.fillRect(0,0,W,.09*kh);g.fillStyle='rgba(90,70,50,.25)';g.fillRect(0,.09*kh,W,2);
    // windows, one row per storey of about 1.4 units
    const st=Math.max(1,Math.floor(h/1.35)),sh=h/st,nw=Math.max(0,Math.floor((w-.3)/1.25)),frame=wood?'#f2ece0':'#7a5a3c';
    for(let f=0;f<st;f++){const y0=h-(f+1)*sh;// top of this storey in units from the top
      for(let i=0;i<nw;i++){const cx=(i+.5)*w/nw;if(door&&f===0&&Math.abs(cx-w/2)<.75)continue;const ww=.62,wh=Math.min(.78,sh*.55),x=(cx-ww/2)*k,y=(y0+sh*.22)*kh;
        g.fillStyle=frame;g.fillRect(x-.05*k,y-.05*kh,(ww+.1)*k,(wh+.1)*kh);g.fillStyle='#8fc4d6';g.fillRect(x,y,ww*k,wh*kh);
        const gl=g.createLinearGradient(x,y,x+ww*k,y+wh*kh);gl.addColorStop(0,'rgba(255,255,255,.45)');gl.addColorStop(.45,'rgba(255,255,255,.05)');gl.addColorStop(1,'rgba(40,70,90,.25)');g.fillStyle=gl;g.fillRect(x,y,ww*k,wh*kh);
        g.fillStyle=frame;g.fillRect(x+ww*k/2-.025*k,y,.05*k,wh*kh);g.fillRect(x,y+wh*kh*.45,ww*k,.04*kh);
        g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x-.06*k,y+wh*kh+.05*kh,(ww+.12)*k,.05*kh);
        if(f===0){g.fillStyle='#3f7a4a';g.fillRect(x-.06*k,y+wh*kh+.08*kh,(ww+.12)*k,.12*kh);for(let q=0;q<5;q++){g.fillStyle=['#e0434f','#f2c14e','#f6f2ec','#e8789a'][q%4];g.beginPath();g.arc(x+(q+.5)*ww*k/5,y+wh*kh+.07*kh,.05*k,0,6.283);g.fill();}}}}
    if(door&&w>=1.4){const dw=.62,dh=Math.min(1.15,sh*.8),x=(w/2-dw/2)*k,y=(h-dh)*kh;g.fillStyle='#5d3f28';g.fillRect(x-.05*k,y-.05*kh,(dw+.1)*k,(dh+.05)*kh);g.fillStyle='#8a6038';g.fillRect(x,y,dw*k,dh*kh);
      g.fillStyle='rgba(40,25,15,.35)';g.fillRect(x+dw*k*.48,y,.03*k,dh*kh);g.fillStyle='#f2c14e';g.beginPath();g.arc(x+dw*k*.8,y+dh*kh*.55,.035*k,0,6.283);g.fill();}
    const m=new THREE.MeshLambertMaterial({map:tex(cv)});cache.set(key,m);return m;}
  function roofMat(col,u,v){const hsl={};col.getHSL(hsl);const warm=(hsl.h<.11||hsl.h>.95)&&hsl.s>.2;const base=warm?C('#c4643f'):col;const key='roof|'+hx(base)+'|'+u.toFixed(1)+'|'+v.toFixed(1);if(cache.has(key))return cache.get(key);
    const W=Math.max(16,Math.min(1024,Math.round(u*PU*.7))),H=Math.max(16,Math.min(1024,Math.round(v*PU*.7))),cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),row=Math.max(5,H/(v/.22)),tw=row*1.3;
    let s=31;const r=()=>(s=(s*16807)%2147483647)/2147483647;g.fillStyle=hx(base);g.fillRect(0,0,W,H);
    for(let y=0,j=0;y<H;y+=row,j++){for(let x=-(j%2)*tw/2;x<W;x+=tw){g.fillStyle=shade(base,.86+r()*.22);g.fillRect(x+1,y,tw-2,row);const gr=g.createLinearGradient(0,y,0,y+row);gr.addColorStop(0,'rgba(255,240,220,.18)');gr.addColorStop(1,'rgba(40,20,10,.28)');g.fillStyle=gr;g.fillRect(x+1,y,tw-2,row);}
      g.fillStyle='rgba(40,20,10,.35)';g.fillRect(0,y+row-2,W,2);}
    const t=tex(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;const m=new THREE.MeshLambertMaterial({map:t,flatShading:true});cache.set(key,m);return m;}
  const isl=o=>{try{const v=new THREE.Vector3();o.getWorldPosition(v);scene.worldToLocal(v);return zoneOf(v.x)==='island';}catch(e){return false;}};
  function run(){if(!pxbScene.orig)return false;const V=new THREE.Vector3(),Q=new THREE.Quaternion(),S=new THREE.Vector3();scene.updateMatrixWorld(true);let n=0;
    pxbScene.orig.forEach((rec,o)=>{if(o.__bs||!o.isMesh||!o.visible||!o.geometry||o.isInstancedMesh)return;const m0=rec.m;if(!m0||Array.isArray(m0)||!m0.color)return;if(o.material===m0)return;// the kit never touched it
      if(!isl(o))return;const t=o.geometry.type,p=o.geometry.parameters||{};o.matrixWorld.decompose(V,Q,S);const sx=Math.abs(S.x),sy=Math.abs(S.y),sz=Math.abs(S.z);const col=m0.color.clone();
      if(t==='BoxGeometry'){const w=p.width*sx,h=p.height*sy,d=p.depth*sz;
        if(h>=1.3&&Math.max(w,d)>=1.6){const dz=w>=d,seed=Math.round(V.x*7+V.z*13);
          o.material=[facade(col,d,h,!dz,seed+1),facade(col,d,h,false,seed+2),new THREE.MeshLambertMaterial({color:col}),new THREE.MeshLambertMaterial({color:col}),facade(col,w,h,dz,seed+3),facade(col,w,h,false,seed+4)];o.__bs=1;BSMOOTH.walls++;n++;return;}
        if(h<.18&&w>=1.4&&V.y>1.2){o.material=roofMat(col,w,d);o.__bs=1;BSMOOTH.roofs++;n++;return;}return;}
      if((t==='CylinderGeometry'||t==='ConeGeometry')&&V.y>1.4&&(p.radialSegments||8)<=8){const R=(p.radiusTop||p.radius||1)*Math.max(sx,sz),L=(p.height||1)*sy;o.material=roofMat(col,R*3,L+R);o.__bs=1;BSMOOTH.roofs++;n++;}});
    return n;}
  const go=()=>{if(typeof pxbScene==='undefined'||!pxbScene.done||!pxbScene.orig){setTimeout(go,700);return;}try{run();}catch(e){console.error('bsmooth',e);}};
  [3000,9000,22000].forEach(t=>setTimeout(go,t));
  setTimeout(()=>{try{console.log('BSMOOTH walls '+BSMOOTH.walls+' roofs '+BSMOOTH.roofs);}catch(e){}},23000);
})();
