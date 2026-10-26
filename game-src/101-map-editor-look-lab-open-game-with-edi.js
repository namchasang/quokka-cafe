// ---------- Map Editor (Look Lab: open the game with ?edit) ----------
// Walk anywhere, tap an object to pick it, then move, turn, resize or delete it; add trees, bushes, palms, flowers,
// benches, lamps, planters and cars from the library; paint the ground with grass, sand, a path, paving or road.
// Edits are kept on this device and re-applied every time the game opens with ?edit; "Copy edits" gives the list
// to paste to Claude, who builds them into the game through the Look Lab.
const EDIT_ON=/[?&#]edit\b/.test(location.search+location.hash);
if(EDIT_ON)(()=>{const KEY='qc-map-edits-v1';let E=[];try{E=JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){E=[];}
  const saveE=()=>{try{localStorage.setItem(KEY,JSON.stringify(E));}catch(e){}renderList();};
  const G=new THREE.Group();scene.add(G);const r2=v=>Math.round(v*10)/10;
  const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const BX=(g,w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m;};
  const CY=(g,a,b,h,c,x,y,z,s)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,s||8),M(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
  const sprite=(v,w,h)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,v.m);if(v.d)m.customDepthMaterial=v.d;m.castShadow=true;BB.push(m);return m;};
  // the library (tag: sprite or 3d)
  const LIB={
    tree:{n:'Tree',tag:'sprite',make:i=>{const v=treeVariants[i%treeVariants.length];return sprite(v,v.w*.8,v.h*.8);},col:.3},
    gum:{n:'Big tree',tag:'sprite',make:i=>{const v=treeVariants[(i+1)%treeVariants.length];return sprite(v,v.w*1.15,v.h*1.15);},col:.35},
    bush:{n:'Bush',tag:'sprite',make:i=>{const v=bushVariants[i%bushVariants.length];return sprite(v,1.6,1);}},
    palm:{n:'Palm',tag:'sprite',make:()=>FDET&&FDET.palm?sprite(FDET.palm,2.2,4.8):sprite(treeVariants[0],2,3),col:.2},
    flowers:{n:'Flowers',tag:'sprite',make:i=>typeof FHOME_PLANTS!=='undefined'&&FHOME_PLANTS.length?sprite(FHOME_PLANTS[i%FHOME_PLANTS.length],.9,.8):sprite(bushVariants[0],.9,.6)},
    bench:{n:'Bench',tag:'3d',make:()=>{const g=new THREE.Group();BX(g,1.2,.07,.38,'#8a5a36',0,.42,0);BX(g,1.2,.32,.06,'#8a5a36',0,.62,-.17);[-.5,.5].forEach(o=>BX(g,.06,.42,.36,'#2a2c30',o,.21,0));return g;},col:[.6,.2]},
    lamp:{n:'Street lamp',tag:'3d',make:()=>{const g=new THREE.Group();CY(g,.05,.07,2.6,'#2e3236',0,1.3,0,6);const b=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),new THREE.MeshBasicMaterial({color:0xfff0c0}));b.position.y=2.65;g.add(b);return g;},col:[.1,.1]},
    planter:{n:'Planter',tag:'3d',make:i=>{const g=new THREE.Group();BX(g,.9,.45,.9,'#b8a888',0,.22,0);if(typeof FHOME_PLANTS!=='undefined'&&FHOME_PLANTS.length){const s=sprite(FHOME_PLANTS[i%FHOME_PLANTS.length],.9,.8);s.position.y=.45;g.add(s);}return g;},col:[.45,.45]},
    bin:{n:'Bin',tag:'3d',make:()=>{const g=new THREE.Group();BX(g,.36,.55,.36,'#2f6a3a',0,.27,0);BX(g,.38,.05,.38,'#e8c430',0,.57,0);return g;},col:[.2,.2]},
    car:{n:'Parked car',tag:'3d',make:i=>{const g=new THREE.Group();const c=['#f6f6f0','#2a2a30','#c8344a','#2f78a8','#9aa0a8','#e8a33a'][i%6];BX(g,1.7,.45,.85,c,0,.42,0);BX(g,.95,.38,.75,'#2a3a58',-.1,.82,0);[[-.55,.42],[.55,.42],[-.55,-.42],[.55,-.42]].forEach(([a,z])=>{const w=CY(g,.17,.17,.12,'#1a1a1a',a,.18,z,10);w.rotation.x=Math.PI/2;});return g;},col:[.85,.45]},
    umbrella:{n:'Café umbrella',tag:'3d',make:()=>{const g=new THREE.Group();CY(g,.03,.03,1.7,'#e8e8e4',0,.85,0,6);const u=new THREE.Mesh(new THREE.ConeGeometry(.8,.3,8),M('#f2f0e8'));u.position.y=1.75;u.castShadow=true;g.add(u);BX(g,.6,.05,.6,'#7a5a3a',0,.7,0);return g;},col:[.3,.3]},
    rock:{n:'Limestone rock',tag:'3d',make:()=>{const g=new THREE.Group();const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.45,0),M('#d8ccb0'));m.scale.set(1.3,.7,1);m.position.y=.2;m.castShadow=m.receiveShadow=true;g.add(m);return g;},col:[.5,.4]}};
  const GROUND={grass:{n:'Grass',t:()=>grassC},sand:{n:'Sand',t:()=>sandC},path:{n:'Path',t:()=>pathC},pave:{n:'Paving',t:()=>paveC},road:{n:'Road',t:()=>typeof asphC!=='undefined'?asphC:stoneC}};
  const GM={};const gmat=k=>GM[k]||(GM[k]=lmat(GROUND[k].t(),[1,1]));
  // objects in the scene: the outermost thing under the scene (or under a big layer group) is "one object"
  const LAYERS=new Set([scene,typeof CDET!=='undefined'&&CDET.g,typeof FDET!=='undefined'&&FDET.g,typeof FDET!=='undefined'&&FDET.city,typeof FDET!=='undefined'&&FDET.freo5].filter(Boolean));
  scene.children.forEach(o=>{if(o.isGroup&&o.children.length>40)LAYERS.add(o);});
  const top=o=>{while(o.parent&&!LAYERS.has(o.parent))o=o.parent;return o;};
  const wpos=o=>{const v=new THREE.Vector3();o.getWorldPosition(v);scene.worldToLocal(v);return v;};
  const keyOf=o=>{const p=wpos(o);let z='?';try{z=zoneOf(p.x);}catch(e){}const t=o.isGroup?'G'+o.children.length:(o.geometry&&o.geometry.type||'M');return z+'|'+t+'|'+r2(p.x)+'|'+r2(p.z);};
  const find=key=>{let hit=null;const[z,t,x,zz]=key.split('|');const X=+x,Z=+zz;LAYERS.forEach(L=>{if(hit)return;L.children.forEach(o=>{if(hit||o===G)return;if(Math.abs(wpos(o).x-X)<.06&&Math.abs(wpos(o).z-Z)<.06&&keyOf(o)===key)hit=o;});});return hit;};
  const colOf=new Map();
  const addCol=(o,s)=>{const c=s.col;if(!c)return;const p=o.position;const w=Array.isArray(c)?c[0]:c,d=Array.isArray(c)?c[1]:c;const ry=o.rotation.y,cs=Math.abs(Math.cos(ry)),sn=Math.abs(Math.sin(ry)),hx=(cs*w+sn*d)*o.scale.x,hz=(sn*w+cs*d)*o.scale.x;const e={x1:p.x-hx,z1:p.z-hz,x2:p.x+hx,z2:p.z+hz};colliders.push(e);colOf.set(o,e);};
  const dropCol=o=>{const e=colOf.get(o);if(e){const i=colliders.indexOf(e);if(i>=0)colliders.splice(i,1);colOf.delete(o);}};
  const objCols=o=>{const p=wpos(o),bx=new THREE.Box3().setFromObject(o);return colliders.filter(c=>{const cx=(c.x1+c.x2)/2,cz=(c.z1+c.z2)/2;return Math.abs(cx-p.x)<Math.max(.6,(bx.max.x-bx.min.x)/2+.2)&&Math.abs(cz-p.z)<Math.max(.6,(bx.max.z-bx.min.z)/2+.2);});};
  // apply one edit
  const added=new Map();let seq=0;
  function apply(e){
    if(e.k==='add'){const s=LIB[e.t];if(!s)return;const o=s.make(e.v||0);o.position.set(e.x,0,e.z);o.rotation.y=e.ry||0;o.scale.setScalar(e.s||1);if(o.isMesh&&o.parent===null&&e.t!=='bench'){}G.add(o);o.userData.edit=e.id;added.set(e.id,o);addCol(o,s);if(LIB[e.t].tag==='sprite'&&typeof trees!=='undefined')trees.push({x:e.x,z:e.z,m:o,v:{m:o.material,f:o.material,d:o.customDepthMaterial},fade:false});return;}
    if(e.k==='paint'){const m=new THREE.Mesh(new THREE.PlaneGeometry(e.w||1,e.d||1),gmat(e.g));m.rotation.x=-Math.PI/2;m.position.set(e.x,.05+((e.id%40)*.0004),e.z);m.receiveShadow=true;m.userData.edit=e.id;G.add(m);added.set(e.id,m);return;}
    const o=e.ref?added.get(e.ref):find(e.key);if(!o)return;
    if(e.k==='del'){o.visible=false;if(e.ref)dropCol(o);else{e.cols=e.cols||objCols(o).map(c=>[c.x1,c.z1,c.x2,c.z2]);e.cols.forEach(cc=>{const i=colliders.findIndex(c=>Math.abs(c.x1-cc[0])<1e-6&&Math.abs(c.z1-cc[1])<1e-6&&Math.abs(c.x2-cc[2])<1e-6);if(i>=0)colliders.splice(i,1);});}return;}
    if(e.k==='set'){if(e.ref){const s=LIB[added.get(e.ref).userData.t||'']||null;}const p=o.parent;const lp=new THREE.Vector3(e.x,0,e.z);if(p&&p!==scene){scene.localToWorld(lp);p.worldToLocal(lp);}o.position.x=lp.x;o.position.z=lp.z;if(e.ry!=null)o.rotation.y=e.ry;if(e.s!=null)o.scale.setScalar(e.s);
      if(e.ref){dropCol(o);const a=E.find(q=>q.id===e.ref);if(a&&LIB[a.t])addCol(o,LIB[a.t]);}}}
  // replay saved edits once the world is built
  E.forEach(apply);seq=E.reduce((m,e)=>Math.max(m,e.id||0),0);
  const push=e=>{e.id=++seq;E.push(e);apply(e);saveE();};
  // ---- UI ----
  const st=document.createElement('style');st.textContent=`#edP{position:fixed;left:max(8px,env(safe-area-inset-left,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:65;width:min(330px,calc(100vw - 16px));max-height:52vh;overflow:auto;background:rgba(20,26,46,.92);border:2px solid #3a4670;border-radius:10px;padding:8px;color:#f5ecd8;font:13px system-ui,sans-serif;display:grid;gap:6px}
#edP b{font-family:"Pixelify Sans",monospace;color:#ffd34d;font-size:15px}#edP .row{display:flex;flex-wrap:wrap;gap:4px}#edP button{font:600 12px system-ui,sans-serif;background:#2a3358;color:#f5ecd8;border:1px solid #4a5690;border-radius:6px;padding:6px 8px}
#edP button[aria-pressed=true]{background:#ffd34d;color:#141a2e;border-color:#ffd34d}#edP small{color:#a9b3cf}#edP .lst{font:11px monospace;color:#a9b3cf;max-height:80px;overflow:auto;white-space:pre}#edHide{position:fixed;right:max(8px,env(safe-area-inset-right,0px));top:calc(120px + env(safe-area-inset-top,0px));z-index:65}`;document.head.appendChild(st);
  const P=document.createElement('div');P.id='edP';P.innerHTML=`<b>Map Editor</b><small id="edHint">Tap an object to pick it, or choose something to add.</small>
<div class="row" id="edMode"><button data-m="pick" aria-pressed="true">Pick</button><button data-m="add">Add</button><button data-m="paint">Paint ground</button></div>
<div class="row" id="edSel" hidden><button id="edMove">Move</button><button id="edRotL">⟲ 45°</button><button id="edRotR">⟳ 45°</button><button id="edBig">Bigger</button><button id="edSmall">Smaller</button><button id="edDel">Delete</button></div>
<div class="row" id="edLib" hidden></div><div class="row" id="edGnd" hidden></div>
<div class="row" id="edBrush" hidden><button data-b="1">Brush 1</button><button data-b="2" aria-pressed="true">Brush 2</button><button data-b="4">Brush 4</button></div>
<div class="row"><button id="edUndo">Undo</button><button id="edCopy">Copy edits</button><button id="edClear">Clear all</button><span id="edN"></span></div><div class="lst" id="edList"></div>`;
  document.body.appendChild(P);const hideB=document.createElement('button');hideB.id='edHide';hideB.className='btn ghost';hideB.type='button';hideB.textContent='Editor';hideB.onclick=()=>{P.hidden=!P.hidden;};document.body.appendChild(hideB);
  const $e=id=>document.getElementById(id);let mode='pick',sel=null,selKey=null,selRef=null,moving=false,libT='tree',gnd='grass',brush=2,libN=0;
  Object.entries(LIB).forEach(([k,s])=>{const b=document.createElement('button');b.type='button';b.textContent=s.n;b.dataset.t=k;b.title=s.tag;b.setAttribute('aria-pressed',k===libT);b.onclick=()=>{libT=k;[...$e('edLib').children].forEach(c=>c.setAttribute('aria-pressed',c.dataset.t===k));hint('Tap the ground to place a '+s.n.toLowerCase()+' ('+s.tag+').');};$e('edLib').appendChild(b);});
  Object.entries(GROUND).forEach(([k,s])=>{const b=document.createElement('button');b.type='button';b.textContent=s.n;b.dataset.g=k;b.setAttribute('aria-pressed',k===gnd);b.onclick=()=>{gnd=k;[...$e('edGnd').children].forEach(c=>c.setAttribute('aria-pressed',c.dataset.g===k));};$e('edGnd').appendChild(b);});
  [...$e('edBrush').children].forEach(b=>b.onclick=()=>{brush=+b.dataset.b;[...$e('edBrush').children].forEach(c=>c.setAttribute('aria-pressed',c===b));});
  const hint=t=>{$e('edHint').textContent=t;};
  const setMode=m=>{mode=m;moving=false;[...$e('edMode').children].forEach(c=>c.setAttribute('aria-pressed',c.dataset.m===m));$e('edLib').hidden=m!=='add';$e('edGnd').hidden=m!=='paint';$e('edBrush').hidden=m!=='paint';if(m!=='pick')select(null);
    hint(m==='pick'?'Tap an object to pick it.':m==='add'?'Choose a thing, then tap the ground to place it.':'Choose a ground, then tap or drag to paint.');};
  [...$e('edMode').children].forEach(b=>b.onclick=()=>setMode(b.dataset.m));
  // selection box
  const selBox=new THREE.Box3Helper(new THREE.Box3(),0xffd34d);selBox.visible=false;scene.add(selBox);
  function select(o){sel=o;selKey=null;selRef=null;$e('edSel').hidden=!o;selBox.visible=!!o;if(!o)return;
    if(o.userData.edit){selRef=o.userData.edit;}else selKey=keyOf(o);const bx=new THREE.Box3().setFromObject(o);selBox.box.copy(bx);if(MIR){const a=bx.min.x,b=bx.max.x;selBox.box.min.x=-b;selBox.box.max.x=-a;}
    hint('Picked: '+(selRef?(LIB[(E.find(q=>q.id===selRef)||{}).t]||{n:'painted ground'}).n:selKey.split('|').slice(0,2).join(' · '))+'. Move, turn, resize or delete it.');}
  const refreshSel=()=>{if(sel)select(sel);};
  const cur=()=>{const p=wpos(sel);return{x:r2(p.x),z:r2(p.z),ry:sel.rotation.y,s:sel.scale.x};};
  const setEdit=ch=>{if(!sel)return;const c=Object.assign(cur(),ch);push(Object.assign({k:'set'},selRef?{ref:selRef}:{key:selKey},c));if(!selRef)selKey=keyOf(sel);refreshSel();};
  $e('edMove').onclick=()=>{moving=true;hint('Tap where it should go.');};
  $e('edRotL').onclick=()=>setEdit({ry:(sel.rotation.y||0)+Math.PI/4});$e('edRotR').onclick=()=>setEdit({ry:(sel.rotation.y||0)-Math.PI/4});
  $e('edBig').onclick=()=>setEdit({s:Math.min(3,r2(sel.scale.x*1.2))});$e('edSmall').onclick=()=>setEdit({s:Math.max(.3,r2(sel.scale.x/1.2))});
  $e('edDel').onclick=()=>{if(!sel)return;push(Object.assign({k:'del'},selRef?{ref:selRef}:{key:selKey}));select(null);hint('Deleted. Undo brings it back after a reload.');};
  $e('edUndo').onclick=()=>{const e=E.pop();if(!e)return;saveE();const o=added.get(e.id);if(o){G.remove(o);dropCol(o);added.delete(e.id);hint('Undone.');}else hint('Undone. Reload the page to see moves and deletes put back.');};
  $e('edClear').onclick=()=>{if($e('edClear').dataset.sure){E=[];saveE();hint('Cleared. Reload to see the map as it was.');delete $e('edClear').dataset.sure;$e('edClear').textContent='Clear all';}else{$e('edClear').dataset.sure=1;$e('edClear').textContent='Tap again to clear';}};
  $e('edCopy').onclick=()=>{const txt='QCMAP1 '+JSON.stringify(E.map(e=>{const c=Object.assign({},e);delete c.cols;return c;}));const done=()=>hint('Copied '+E.length+' edits. Paste them to Claude to put them in the game.');
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>{hint('Copy failed: the list is shown below, select it.');$e('edList').textContent=txt;});else{$e('edList').textContent=txt;}};
  function renderList(){$e('edN').textContent=E.length+' edits';$e('edList').textContent=E.slice(-8).map(e=>e.id+' '+e.k+' '+(e.t||e.g||'')+(e.x!=null?' @'+r2(e.x)+','+r2(e.z):'')+(e.key?' '+e.key.split('|').slice(0,2).join(' '):'')).join('\n');}renderList();
  // ---- taps on the world ----
  const ray=new THREE.Raycaster(),nd=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hitP=new THREE.Vector3();
  const groundAt=(cx,cy)=>{const rc=renderer.domElement.getBoundingClientRect();nd.set((cx-rc.left)/rc.width*2-1,-(cy-rc.top)/rc.height*2+1);ray.setFromCamera(nd,camera);if(!ray.ray.intersectPlane(plane,hitP))return null;const v=hitP.clone();scene.worldToLocal(v);return v;};
  const pickAt=(cx,cy)=>{const rc=renderer.domElement.getBoundingClientRect();nd.set((cx-rc.left)/rc.width*2-1,-(cy-rc.top)/rc.height*2+1);ray.setFromCamera(nd,camera);
    const hits=ray.intersectObjects(scene.children,true).filter(h=>{let o=h.object;if(!o.visible||o===selBox||o.userData.frames)return false;for(let q=o;q;q=q.parent)if(!q.visible)return false;const bx=new THREE.Box3().setFromObject(o),s=bx.getSize(new THREE.Vector3());if(s.x>30||s.z>30)return false;if(s.y<.06&&!top(o).userData.edit)return false;if(o.material&&o.material.transparent&&o.material.opacity<.5)return false;return true;});
    return hits.length?top(hits[0].object):null;};
  let down=null,lastPaint=null;
  const paintAt=p=>{const w=brush,x=Math.floor(p.x/w)*w+w/2,z=Math.floor(p.z/w)*w+w/2,k=x+','+z+','+gnd+','+w;if(lastPaint===k)return;lastPaint=k;push({k:'paint',g:gnd,x,z,w,d:w});};
  renderer.domElement.addEventListener('pointerdown',e=>{if(P.hidden||overlay)return;down={x:e.clientX,y:e.clientY,t:performance.now()};if(mode==='paint'){const p=groundAt(e.clientX,e.clientY);if(p){paintAt(p);e.stopPropagation();e.preventDefault();}}},true);
  renderer.domElement.addEventListener('pointermove',e=>{if(!down||mode!=='paint'||P.hidden)return;const p=groundAt(e.clientX,e.clientY);if(p)paintAt(p);e.stopPropagation();},true);
  window.addEventListener('pointerup',e=>{if(!down||P.hidden)return;const d=down;down=null;lastPaint=null;if(mode==='paint')return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>10||performance.now()-d.t>450)return;if(e.target!==renderer.domElement&&e.target!==stage&&!stage.contains(e.target))return;
    if(mode==='add'){const p=groundAt(e.clientX,e.clientY);if(!p)return;push({k:'add',t:libT,v:libN++,x:r2(p.x),z:r2(p.z),ry:0,s:1});hint('Placed. Tap again to place another.');return;}
    if(moving&&sel){const p=groundAt(e.clientX,e.clientY);if(!p)return;moving=false;setEdit({x:r2(p.x),z:r2(p.z)});return;}
    const o=pickAt(e.clientX,e.clientY);select(o);},true);
  // stop the joystick from walking while painting
  window.EDIT={E,apply,LIB};
})();
