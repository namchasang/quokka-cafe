// ===== Island Builder (Paul Nov 2026): players build their own Rottnest. Tap "Build" on the island: add trees, flowers, benches,
// cottages, kiosks and shops and working vegetable plots for coins, pick anything on the island to move, turn, resize or remove it,
// paint the ground. Kept on this device, re-built every time the game opens. Kip's café and the story spots stay put in this first version. =====
(()=>{if(typeof mapEditorMake!=='function'||EDIT_ON){console.log('IB skip',typeof mapEditorMake,EDIT_ON);return;}try{
  const tex=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipMapLinearFilter;try{t.encoding=THREE.sRGBEncoding;}catch(e){}return t;};
  const MC={};const mat=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({map:tex(c)}));const flatM={};const fm=c=>flatM[c]||(flatM[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  /* a small building from the pixel kit: walled box with a hipped or gabled roof */
  const house=(w,d,h,o)=>{const g=new THREE.Group();const front=PXK.wall(w,h,Object.assign({door:true,win:Math.max(1,Math.round(w/1.2))},o)),side=PXK.wall(d,h,Object.assign({door:false,win:Math.max(1,Math.round(d/1.4))},o));
    const fM=new THREE.MeshLambertMaterial({map:tex(front)}),sM=new THREE.MeshLambertMaterial({map:tex(side)});const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sM,sM,fm('#8a7a62'),fm('#8a7a62'),fM,fM]);b.position.y=h/2;b.castShadow=b.receiveShadow=true;g.add(b);
    const rc=PXK.roof(Math.max(w,d)+.4,Math.max(w,d)*.6,{base:o.roof||'#b8562e',kind:o.roofKind||'tile',seed:o.seed||1});const r=new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(w,d)/2+.25,o.rh||1,4),new THREE.MeshLambertMaterial({map:tex(rc)}));r.rotation.y=Math.PI/4;r.scale.set(w/Math.max(w,d),1,d/Math.max(w,d));r.position.y=h+(o.rh||1)/2;r.castShadow=true;g.add(r);
    if(o.awn){const a=new THREE.Mesh(new THREE.BoxGeometry(w*.9,.06,.6),fm(o.awn));a.position.set(0,h*.62,d/2+.3);a.rotation.x=.25;a.castShadow=true;g.add(a);}return g;};
  const LIB={
    cottage:{n:'Cottage',tag:'3d',price:300,make:i=>house(2.6,2.2,1.5,{base:['#efe3c4','#e8d0a0','#f2e6c8','#dfe6ea'][i%4],kind:i%2?'stone':'plaster',seed:40+i,roof:['#b8562e','#8a8e94','#6a4a3a'][i%3]}),col:[1.4,1.2]},
    kiosk:{n:'Kiosk',tag:'3d',price:250,make:i=>house(1.8,1.6,1.3,{base:'#f4ead2',kind:'plaster',seed:60+i,roof:'#2f6a74',roofKind:'tin',awn:['#c8344a','#e8b860','#3e7d5c'][i%3],rh:.6}),col:[1,.9]},
    shop:{n:'Shop',tag:'3d',price:500,make:i=>house(3.2,2.4,2.4,{base:['#f2e6c8','#e4d4ac','#efe3c4'][i%3],kind:'stone',seed:80+i,roof:'#8a8e94',roofKind:'slate',awn:['#2f6a74','#c8344a','#e86a1a'][i%3],rh:.7}),col:[1.7,1.3]},
    vegplot:{n:'Vegetable plot',tag:'3d',price:80,make:()=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1,.26,1.1),typeof bedMat!=='undefined'?bedMat:fm('#8a6a48'));b.position.y=.13;b.castShadow=b.receiveShadow=true;g.add(b);return g;},col:[.5,.55]},
    fence:{n:'Fence',tag:'3d',price:10,make:()=>{const g=new THREE.Group();for(const x of[-.6,0,.6]){const p=new THREE.Mesh(new THREE.BoxGeometry(.08,.7,.08),fm('#f2efe6'));p.position.set(x,.35,0);g.add(p);}for(const y of[.3,.55]){const r=new THREE.Mesh(new THREE.BoxGeometry(1.3,.06,.05),fm('#f2efe6'));r.position.y=y;g.add(r);}return g;},col:[.65,.08]},
    picnic:{n:'Picnic table',tag:'3d',price:25,make:()=>{const g=new THREE.Group();const t=new THREE.Mesh(new THREE.BoxGeometry(1.4,.06,.7),fm('#9a6a40'));t.position.y=.62;g.add(t);for(const z of[-.6,.6]){const s=new THREE.Mesh(new THREE.BoxGeometry(1.4,.05,.25),fm('#9a6a40'));s.position.set(0,.36,z);g.add(s);}return g;},col:[.7,.75]}};
  const PRICE={tree:20,gum:35,bush:10,palm:30,flowers:8,bench:15,lamp:20,planter:12,bin:5,car:0,umbrella:15,rock:10};
  const island=(x,z)=>{try{return zoneOf(x)==='island';}catch(e){return false;}};
  /* things that stay put for now: Kip's café, the garden beds, the people and animals */
  let cafeBox=null;const cafeHit=(x,z)=>{if(!cafeBox&&typeof CAFE_PX!=='undefined'&&CAFE_PX&&CAFE_PX.g){cafeBox=new THREE.Box3().setFromObject(CAFE_PX.g);}const v=new THREE.Vector3(x,0,z);scene.localToWorld(v);return cafeBox&&v.x>cafeBox.min.x-.3&&v.x<cafeBox.max.x+.3&&v.z>cafeBox.min.z-.3&&v.z<cafeBox.max.z+.3;};
  const nearPlot=(x,z)=>PLOTS.some(p=>!p.__b&&Math.abs(p.x-x)<.8&&Math.abs(p.z-z)<.8);
  const coins=()=>S.coins||0;
  const plotOf=new Map();
  const ED=mapEditorMake({key:'qc-island-build-v1',dev:false,title:'Island Builder',lib:LIB,only:['tree','gum','bush','palm','flowers','bench','lamp','planter','bin','umbrella','rock','cottage','kiosk','shop','vegplot','fence','picnic'],
    priceOf:k=>LIB[k]&&LIB[k].price!=null?LIB[k].price:(PRICE[k]||10),cost:(e,L)=>e.k==='add'?(L[e.t]&&L[e.t].price!=null?L[e.t].price:PRICE[e.t]||10):e.k==='paint'?2:e.k==='del'?5:0,
    canPay:c=>coins()>=c,pay:c=>{S.coins=coins()-c;try{updateHud();save();}catch(er){}},refund:c=>{S.coins=coins()+c;try{updateHud();save();}catch(er){}},
    poor:c=>'You need '+c+' coins for that.',noPlace:'Build on Rottnest Island, away from the café and the garden beds.',
    canPlace:(x,z)=>island(x,z)&&!cafeHit(x,z)&&!nearPlot(x,z)&&(typeof landAt!=='function'||true),
    canPick:(o)=>{const v=new THREE.Vector3();o.getWorldPosition(v);scene.worldToLocal(v);if(!island(v.x,v.z))return false;if(o.userData.edit)return true;if(typeof CAFE_PX!=='undefined'&&CAFE_PX&&CAFE_PX.g){for(let q=o;q;q=q.parent)if(q===CAFE_PX.g)return false;}if(cafeHit(v.x,v.z)||nearPlot(v.x,v.z))return false;return true;},
    onAdd:(e,o)=>{if(e.t!=='vegplot')return;/* a real garden bed: plant, water and harvest it like the others */const s=new THREE.Mesh(new THREE.PlaneGeometry(.88,.98),soilDry);s.rotation.x=-Math.PI/2;s.position.set(e.x,.265,e.z);s.receiveShadow=true;scene.add(s);
      const sp=spriteMesh([iconCanvas('spark')],.4,.4,{basic:true,shadow:false});sp.visible=false;scene.add(sp);const p={x:e.x,z:e.z,soil:s,spark:sp,__b:1};PLOTS.push(p);if(S&&Array.isArray(S.plots))while(S.plots.length<PLOTS.length)S.plots.push(null);plotOf.set(e.id,p);try{refreshPlots();}catch(er){}},
    onSet:(e,o)=>{const p=plotOf.get(e.ref);if(!p)return;if(e.k==='del'){p.x=p.z=1e5;p.soil.visible=false;return;}p.x=e.x;p.z=e.z;p.soil.position.set(e.x,.265,e.z);},
    onUndo:(e)=>{const p=plotOf.get(e.id);if(p){p.x=p.z=1e5;p.soil.visible=false;}},
    onDone:()=>{btn.textContent='Build';}});
  /* the Build button: shows on the island */
  const btn=document.createElement('button');btn.id='ibBtn';btn.className='btn';btn.type='button';btn.textContent='Build';
  btn.style.cssText='position:fixed;right:max(10px,env(safe-area-inset-right,0px));top:calc(118px + env(safe-area-inset-top,0px));z-index:64;font:700 14px "Pixelify Sans",system-ui;background:#ffd34d;color:#141a2e;border:2px solid #141a2e;border-radius:10px;padding:7px 12px;box-shadow:0 3px 0 #141a2e';
  btn.onclick=()=>{if(ED.P.hidden){ED.open();btn.textContent='Close';ED.hint('You have '+coins()+' coins. Pick something on the island, or Add something new.');}else{ED.close();btn.textContent='Build';}};
  document.body.appendChild(btn);
  setInterval(()=>{let on=false;try{on=typeof player!=='undefined'&&island(player.x,player.z)&&!(typeof overlay!=='undefined'&&overlay)&&!(document.getElementById('owRoot')&&!document.getElementById('owRoot').hidden);}catch(e){}btn.hidden=!on;if(!on&&!ED.P.hidden){ED.close();btn.textContent='Build';}},500);
  window.ISLAND_BUILD=ED;if(/[?&#]ibdbg\b/.test(location.search))window.__IB={get S(){return S;},get player(){return player;},ED};}catch(e){console.error('island builder',e);}})();
