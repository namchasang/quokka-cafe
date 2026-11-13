// ---------- Rottnest tidy-up and graphics quality (Paul, 13 Nov 2026) ----------
// 1. Four houses by the railway near The Basin are taken off the map but kept (hidden, colliders off) in ISLAND_STORE for the
//    Island Builder to offer later.
// 2. The flat pictures still standing on Rottnest (flower clumps and other little picture props) are removed; signs, lamp glows,
//    quest sparkles and the pictures on building walls stay. 3D versions come later.
// 3. Graphics: Low / Medium / High (menu button and home settings). Low: 1x screen, no shadows, simpler sea; Medium: lighter
//    screen and shadows; High: as before. Phones start on Medium.
const ISLAND_STORE=[];
(function(){
  const BOXES=[{id:'cottage-red-1',b:[-80.3,-39.7,-76.9,-36.4]},{id:'tower-house',b:[-82.8,-36.8,-79.5,-32.4]},{id:'cottage-red-2',b:[-87.2,-38.9,-83.8,-35.6]},{id:'cottage-green',b:[-85.2,-26.5,-81.8,-23.1]}];
  function store(){const inv=new THREE.Matrix4().copy(scene.matrixWorld).invert(),B=new THREE.Box3();scene.updateMatrixWorld(true);
    BOXES.forEach(bx=>{const [x1,z1,x2,z2]=bx.b,objs=[];scene.children.forEach(o=>{if(o.__stored||o.isLight||(o.name||'').startsWith('sea')||o.__g3)return;try{B.setFromObject(o).applyMatrix4(inv);}catch(e){return;}if(B.isEmpty())return;
        const cx=(B.min.x+B.max.x)/2,cz=(B.min.z+B.max.z)/2,w=B.max.x-B.min.x,d=B.max.z-B.min.z;if(w>6||d>6||B.max.y-B.min.y<.05)return;if(cx>x1-.3&&cx<x2+.3&&cz>z1-.3&&cz<z2+.3){objs.push(o);o.traverse(q=>q.layers.set(31));o.__stored=1;}});
      const cols=[];if(typeof colliders!=='undefined')colliders.forEach(c=>{if(c.x1>=x1-.5&&c.x2<=x2+.5&&c.z1>=z1-.5&&c.z2<=z2+.5){cols.push([c.x1,c.z1,c.x2,c.z2]);c.x1=c.x2=c.z1=c.z2=-9999;}});
      let e=ISLAND_STORE.find(q=>q.id===bx.id);if(!e){e={id:bx.id,box:bx.b,objs:[],cols:[]};ISLAND_STORE.push(e);}e.objs.push(...objs);e.cols.push(...cols);});console.log('TIDY stored '+ISLAND_STORE.map(s=>s.id+':'+s.objs.length).join(' '));}
  function pictures(){const inv=new THREE.Matrix4().copy(scene.matrixWorld).invert(),B=new THREE.Box3();scene.updateMatrixWorld(true);let n=0;
    /* the bike lanes / island road strips (Paul: remove, 3D ones later) */scene.children.forEach(o=>{if(o.__tidy||!(o.userData&&o.userData.lane))return;const p=o.position;if(zoneOf(p.x)!=='island')return;o.__tidy=1;o.layers.set(31);n++;});
    scene.traverse(o=>{if(!o.isMesh||!o.visible||o.__tidy||!o.geometry||o.geometry.type!=='PlaneGeometry'||o.parent!==scene||(o.userData&&o.userData.frames))return;
      const m=o.material,im=m&&m.map&&m.map.image;if(!im||!im.width)return;if(typeof SIGN_TEX!=='undefined'&&SIGN_TEX.has(m.map))return;
      const p=o.geometry.parameters,asp=p.width/p.height;if(asp>1.6||p.width>2.5)return;/* wide boards are signs */if(m.isMeshBasicMaterial&&im.width===64&&im.height===64)return;/* lamp glows */
      B.setFromObject(o).applyMatrix4(inv);if(B.max.y-B.min.y<.15)return;if(zoneOf((B.min.x+B.max.x)/2)!=='island')return;o.__tidy=1;o.layers.set(31);n++;});return n;}
  (function wait(){if(typeof ISL!=='undefined'&&ISL.done&&performance.now()>9000){try{store();}catch(e){console.error('tidy store',e);}
      let k=0;const iv=setInterval(()=>{try{store();}catch(e){}if(k===8&&typeof MEADOW!=='undefined'&&MEADOW.reset)MEADOW.reset();/* replant grass and flowers where the houses and paths were */try{const n=pictures();if(n)console.log('TIDY pictures '+n);}catch(e){}if(++k>20)clearInterval(iv);},3000);return;}setTimeout(wait,800);})();
  // ---- graphics quality ----
  const touch=matchMedia&&matchMedia('(pointer:coarse)').matches;let L='high';try{L=localStorage.getItem('qc-gfx')||(touch?'medium':'high');}catch(e){}
  const GFX=window.GFX={level:L,set(l){this.level=l;try{localStorage.setItem('qc-gfx',l);}catch(e){}apply();label();}};
  function apply(){const l=GFX.level,dpr=window.devicePixelRatio||1;renderer.setPixelRatio(l==='low'?1:l==='medium'?Math.min(dpr,1.25):Math.min(dpr,2));
    try{sun.castShadow=l!=='low';const ms=l==='high'?2048:1024;if(sun.shadow.mapSize.x!==ms){sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}}catch(e){}
    try{if(typeof SEA4!=='undefined')SEA4.q=l==='low'?0:1;}catch(e){}try{resize();}catch(e){}}
  const NAMES={low:'Low',medium:'Medium',high:'High'},NEXT={high:'medium',medium:'low',low:'high'};const btns=[];
  function label(){btns.forEach(b=>{b.textContent='Graphics: '+NAMES[GFX.level];});}
  function mk(after,cls){if(!after)return;const b=document.createElement('button');b.type='button';b.className=cls;b.onclick=e=>{e.stopPropagation();GFX.set(NEXT[GFX.level]);};after.parentNode.insertBefore(b,after.nextSibling);btns.push(b);}
  mk(document.getElementById('unstuckBtn'),'panel hudBtn more');{const hs=document.getElementById('homeSet');if(hs){const c=hs.querySelector('button.btn');const b=document.createElement('button');b.type='button';b.className='btn';b.style.marginTop='10px';b.onclick=()=>GFX.set(NEXT[GFX.level]);if(c&&c.parentNode)c.parentNode.insertBefore(b,c);else hs.appendChild(b);btns.push(b);}}
  label();apply();
})();
