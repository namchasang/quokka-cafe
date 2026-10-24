// ---------- Look Lab: landscape layers of each real-map area in 3D (open with ?lab) ----------
// Every object in the scene is sorted into a layer (ground, water, paths, buildings, plants, props,
// characters, lights, effects). The lab camera orbits each area; layers switch on and off without
// touching the game for players. Place labels are the real names used on the in-game maps.
const LAB=(()=>{
  const CATS=[['ground','พื้นดิน & หาด','#c9b27a'],['water','น้ำ & ทะเล','#3b8fd6'],['path','ทางเดิน ถนน ท่าเรือ','#9a9ca6'],['build','อาคาร','#d9694f'],['veg','ต้นไม้ & พืช','#4fae55'],['prop','ของตกแต่ง & ป้าย','#e0b03c'],['char','ตัวละคร & สัตว์','#c86bd6'],['light','แสงไฟ','#fff27a'],['fx','เอฟเฟกต์ ละออง แพลงก์ตอน','#7ef0ff']];
  const CI={};CATS.forEach((c,i)=>CI[c[0]]=i);
  const ALWAYS=20,LAYER=i=>i+1;
  const spX=typeof SPX==='number'?SPX:150;
  const ZONES=[
    {id:'island',name:'Rottnest · Thomson Bay',B:TB,ll:[-31.9995,115.5420],labels:()=>MAP_LABELS},
    {id:'sp',name:'South Perth',B:SPB,ll:[-31.9745,115.8530],labels:()=>[['South Perth',150,7.6],['Mends St Jetty',spX-3.2,-6.4],['Swan River',128,-7],['Perth CBD',150,-15.4],['Mill Point Road',141,22.2],['Angelo St',178,9.4],['The Old Mill',106,7.6],['Mill Point',107,-1.6],['Coode St Jetty',186,-1],['Narrows Bridge',108,-11.8],['Mends St',150,10]]},
    {id:'freo',name:'Fremantle',B:FB,ll:[-32.0550,115.7460],labels:()=>[['Victoria Quay',284,-16.6],['B-Shed',285,-10.4],['Maritime Museum',277.5,-12],['Round House',278,-3.4],['Bathers Beach',277.2,9.6],['Esplanade Park',290.5,12.4],['Fishing Boat Harbour',284,18.8],['Cappuccino Strip',304,-3.9],['High St',292,-1],['Kings Square',311,-14.6],['Fremantle Prison',325,4]]},
    {id:'hi',name:'Heirisson Island',B:HIB,ll:[-31.9600,115.8790],labels:()=>ZONE_DEF.hi.labels},
    {id:'vp',name:'Victoria Park',B:VPB,ll:[-31.9760,115.8980],labels:()=>ZONE_DEF.vp.labels},
    {id:'cbd',name:'Perth CBD',B:CBDB,ll:[-31.9560,115.8590],labels:()=>ZONE_DEF.cbd.labels}];
  const st={on:false,zone:0,tx:0,tz:0,dist:60,yaw:0,pitch:.75,auto:false,show:CATS.map(()=>true),tint:false,tags:true,frame:true,bloom:true,tilt:false,fog:false,time:null,seen:new WeakSet(),count:CATS.map(()=>0),scanT:0,saved:null};
  const BBset=new Set(BB);
  const box=new THREE.Box3(),sz=new THREE.Vector3(),col=new THREE.Color(),hsl={},texAvg=new Map(),tv=new THREE.Vector3();
  function avgTex(t){if(!t||!t.image)return null;if(texAvg.has(t))return texAvg.get(t);let c=null;
    try{const cv=document.createElement('canvas');cv.width=cv.height=8;const x=cv.getContext('2d');x.drawImage(t.image,0,0,8,8);const d=x.getImageData(0,0,8,8).data;let r=0,g=0,b=0,n=0;
      for(let i=0;i<d.length;i+=4){if(d[i+3]<80)continue;r+=d[i];g+=d[i+1];b+=d[i+2];n++;}if(n)c=new THREE.Color(r/n/255,g/n/255,b/n/255);}catch(e){}
    texAvg.set(t,c);return c;}
  function classify(o){
    if(o.userData.labHint)return o.userData.labHint;
    if(o.isLight)return(o.isPointLight||o.isSpotLight)?'light':null;
    if(o.isPoints)return 'fx';
    if(!(o.isMesh||o.isLine||o.isSprite))return null;
    if(o===water)return 'water';
    const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m)return 'prop';
    if(m.blending===THREE.AdditiveBlending)return 'light';
    if(m.emissive&&(m.emissive.r+m.emissive.g+m.emissive.b)>1.2)return 'light';
    col.setRGB(1,1,1);if(m.color)col.copy(m.color);const ta=avgTex(m.map);if(ta)col.multiply(ta);col.getHSL(hsl);
    const green=hsl.h>.16&&hsl.h<.45&&hsl.s>.22&&hsl.l>.1&&hsl.l<.8,blue=hsl.h>.5&&hsl.h<.67&&hsl.s>.28,grey=hsl.s<.16,wood=hsl.h>.02&&hsl.h<.12&&hsl.l<.5;
    box.setFromObject(o);if(box.isEmpty())return 'prop';box.getSize(sz);const area=sz.x*sz.z;
    if(BBset.has(o)){if(typeof SIGN_TEX!=='undefined'&&m.map&&SIGN_TEX.has(m.map))return 'prop';return green&&sz.y>1.3?'veg':'char';}
    if(sz.y<.4){if(blue&&area>12)return 'water';if(area>60&&!grey)return 'ground';if(grey||wood)return 'path';return 'ground';}
    if(green)return 'veg';
    if(wood&&sz.y>.8&&Math.max(sz.x,sz.z)<.9)return 'veg';
    if(blue&&sz.y<.8&&area>10)return 'water';
    if(sz.y>1.5&&area>4)return 'build';
    return 'prop';}
  function scan(){scene.updateMatrixWorld();scene.traverse(o=>{if(st.seen.has(o))return;st.seen.add(o);if(o.userData.labTag)return;
    const c=classify(o);if(c==null){o.layers.enable(ALWAYS);return;}const i=CI[c];o.userData.labCat=i;o.layers.enable(LAYER(i));st.count[i]++;});
    renderLayerCounts();}
  function mask(){let m=1<<ALWAYS;st.show.forEach((v,i)=>{if(v)m|=1<<LAYER(i);});return m;}
  // colour each layer flat, to read the composition at a glance
  function setTint(on){st.tint=on;scene.traverse(o=>{const i=o.userData.labCat;if(i==null||!o.isMesh||(BBset.has(o)&&CATS[i][0]==='char'))return;
    if(on){if(!o.userData.labOrig){const m=Array.isArray(o.material)?o.material[0]:o.material;o.userData.labOrig=o.material;
        o.userData.labMat=new THREE.MeshLambertMaterial({color:CATS[i][2],map:m&&m.map||null,transparent:!!(m&&m.transparent),alphaTest:m&&m.alphaTest||0,side:m?m.side:THREE.FrontSide,opacity:m&&m.opacity!=null?m.opacity:1});}
      o.material=o.userData.labMat;}
    else if(o.userData.labOrig){o.material=o.userData.labOrig;}});}
  // zone frame
  let frameLine=null;
  function drawFrame(){if(frameLine){scene.remove(frameLine);frameLine.geometry.dispose();}const B=ZONES[st.zone].B;
    const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(B.x1,.25,B.z1),new THREE.Vector3(B.x2,.25,B.z1),new THREE.Vector3(B.x2,.25,B.z2),new THREE.Vector3(B.x1,.25,B.z2)]);
    frameLine=new THREE.LineLoop(g,new THREE.LineBasicMaterial({color:0xffd34d}));frameLine.userData.labTag=true;frameLine.layers.set(ALWAYS);frameLine.visible=st.frame&&st.on;scene.add(frameLine);}
  // DOM
  const css=document.createElement('style');css.textContent=`
body.lab #app>*:not(#stage),body.lab>*:not(#app):not(#labPanel):not(#labTouch):not(#labTags):not(script):not(style){visibility:hidden!important}
#labTouch{position:fixed;inset:0;z-index:60;touch-action:none;cursor:grab}#labTouch:active{cursor:grabbing}
#labTags{position:fixed;inset:0;z-index:61;pointer-events:none;overflow:hidden}
#labTags span{position:absolute;transform:translate(-50%,-100%);font:700 11px/1.2 system-ui,sans-serif;color:#fff8e6;background:rgba(15,20,38,.78);padding:2px 6px;border-radius:5px;white-space:nowrap;border-bottom:2px solid #ffd34d}
#labPanel{position:fixed;z-index:62;top:max(10px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right));width:300px;max-height:calc(100% - 20px);overflow:auto;background:rgba(15,20,38,.92);color:#f3e7c8;border:1px solid #c9a35a;border-radius:12px;padding:12px;font:13px/1.45 system-ui,"Kanit",sans-serif;display:grid;gap:9px}
#labPanel h4{margin:0;font:800 12px/1 "Pixelify Sans",monospace;letter-spacing:.12em;color:#ffd34d}
#labPanel .hd{display:flex;justify-content:space-between;align-items:center;gap:8px}
#labPanel .row{display:flex;flex-wrap:wrap;gap:5px}
#labPanel button{font:600 12px/1 system-ui,sans-serif;color:#f3e7c8;background:#24304d;border:1px solid #3d4b6e;border-radius:7px;padding:6px 8px;cursor:pointer}
#labPanel button[aria-pressed="true"]{background:#e8b04a;color:#1b1404;border-color:#e8b04a}
#labPanel label{display:flex;align-items:center;gap:7px;cursor:pointer}
#labPanel label i{width:12px;height:12px;border-radius:3px;flex:none}
#labPanel label em{margin-left:auto;font-style:normal;opacity:.6;font-size:11px}
#labPanel input[type=range]{width:100%}
#labPanel a{color:#7ec8ff}
#labPanel .note{opacity:.7;font-size:11.5px}
#labPanel.min>*:not(.hd){display:none}
@media (max-width:640px){#labPanel{top:auto;bottom:max(8px,env(safe-area-inset-bottom));right:8px;left:8px;width:auto;max-height:46%}}`;
  document.head.appendChild(css);
  let panel,touch,tags;const tagEls=[];
  function el(h){const d=document.createElement('div');d.innerHTML=h;return d.firstElementChild;}
  function build(){
    touch=el('<div id="labTouch" hidden></div>');tags=el('<div id="labTags" hidden></div>');
    panel=el(`<div id="labPanel" hidden><div class="hd"><h4>LOOK LAB · ภูมิทัศน์ 3D</h4><div class="row"><button id="labMin" aria-label="ย่อแผง">–</button><button id="labX">ปิด</button></div></div>
      <div><b>พื้นที่</b><div class="row" id="labZones">${ZONES.map((z,i)=>`<button data-z="${i}">${z.name}</button>`).join('')}</div></div>
      <div><b>มุมกล้อง</b><div class="row"><button data-v="game">มุมเกม</button><button data-v="tilt">เฉียง 3D</button><button data-v="top">มุมบน</button><button id="labAuto" aria-pressed="false">หมุนเอง</button></div></div>
      <div><b>ชั้นภูมิทัศน์</b> <span class="note">(จำนวนชิ้นทั้งเกม)</span><div id="labLayers" style="display:grid;gap:4px;margin-top:4px"></div>
        <div class="row" style="margin-top:6px"><button id="labAll">เปิดทุกชั้น</button><button id="labLand">เฉพาะภูมิประเทศ</button><button id="labTint" aria-pressed="false">แยกสีตามชั้น</button></div></div>
      <div><b>ภาพ</b><div class="row"><button id="labTags2" aria-pressed="true">ป้ายสถานที่จริง</button><button id="labFrame" aria-pressed="true">กรอบพื้นที่</button><button id="labBloom" aria-pressed="true">Bloom</button><button id="labTilt" aria-pressed="false">Tilt-shift</button><button id="labFog" aria-pressed="false">หมอก</button></div></div>
      ${typeof CDET!=='undefined'&&CDET.on?'<div><b>งานใหม่ · เมือง Perth CBD</b><div class="row"><button id="labCity" aria-pressed="true">เมืองละเอียด (กดดูก่อน/หลัง)</button></div><div class="note">รถวิ่ง ไฟจราจร เลนจักรยาน รถจอด ป้ายรถเมล์ kiosk กาแฟ ร้านค้า Tudor Lane สวน Kings Park · ลองเลื่อนเวลาเป็นกลางคืน</div></div>':''}
      ${typeof TREES_HD!=='undefined'&&TREES_HD.set?'<div><b>งานใหม่ · ต้นไม้ HD</b><div class="row"><button id="labTrees" aria-pressed="true">ต้นไม้ HD (กดดูก่อน/หลัง)</button></div><div class="note">พิกเซลมากขึ้น 2 เท่า 7 เฉด แสงขอบใบ ช่องฟ้า เปลือกไม้ กิ่งไหวตามลม</div></div>':''}
      <div><b>เวลา</b> <span id="labTimeL"></span><input type="range" id="labTime" min="300" max="1435" step="15"></div>
      <div><b>อากาศ</b><div class="row" id="labWx">${(typeof WEATHERS!=='undefined'?WEATHERS:[]).map((w,i)=>`<button data-w="${i}">${w.label}</button>`).join('')}</div></div>
      <div class="note">ลากเพื่อหมุน · คลิกขวา/Shift หรือสองนิ้ว เพื่อเลื่อน · ล้อเมาส์/บีบ เพื่อซูม</div>
      <div><a id="labOsm" target="_blank" rel="noopener">เทียบกับแผนที่จริง (OpenStreetMap)</a><div class="note">ข้อมูลแผนที่อ้างอิง © OpenStreetMap contributors</div></div></div>`);
    document.body.append(touch,tags,panel);
    const lay=panel.querySelector('#labLayers');
    lay.innerHTML=CATS.map((c,i)=>`<label><input type="checkbox" data-c="${i}" checked><i style="background:${c[2]}"></i>${c[1]}<em id="labN${i}">0</em></label>`).join('');
    lay.addEventListener('change',e=>{const i=+e.target.dataset.c;st.show[i]=e.target.checked;});
    panel.querySelector('#labZones').onclick=e=>{const b=e.target.closest('[data-z]');if(b)goZone(+b.dataset.z,'tilt');};
    panel.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>view(b.dataset.v));
    const tg=(id,k,fn)=>{const b=panel.querySelector(id);b.onclick=()=>{st[k]=!st[k];b.setAttribute('aria-pressed',String(st[k]));fn&&fn(st[k]);};};
    tg('#labAuto','auto');tg('#labTags2','tags');tg('#labFrame','frame',v=>{if(frameLine)frameLine.visible=v;});tg('#labBloom','bloom');tg('#labTilt','tilt');tg('#labFog','fog');
    const tb=panel.querySelector('#labTint');tb.onclick=()=>{setTint(!st.tint);tb.setAttribute('aria-pressed',String(st.tint));};
    panel.querySelector('#labAll').onclick=()=>setShow(()=>true);
    {const tb=panel.querySelector('#labTrees');if(tb)tb.onclick=()=>{const v=!TREES_HD.live;TREES_HD.set(v);tb.setAttribute('aria-pressed',String(v));};}
    {const cb=panel.querySelector('#labCity');if(cb)cb.onclick=()=>{const v=!CDET.g.visible;CDET.show(v);cb.setAttribute('aria-pressed',String(v));};}
    panel.querySelector('#labLand').onclick=()=>setShow(i=>['ground','water','path','veg'].includes(CATS[i][0]));
    panel.querySelector('#labX').onclick=()=>toggle(false);
    panel.querySelector('#labMin').onclick=()=>panel.classList.toggle('min');
    const tr=panel.querySelector('#labTime');tr.oninput=()=>{st.time=+tr.value;S.time=st.time;};
    panel.querySelector('#labWx').onclick=e=>{const b=e.target.closest('[data-w]');if(!b)return;S.wx=+b.dataset.w;syncUi();};
    // camera input
    const P=new Map();let pinch=0;
    touch.addEventListener('contextmenu',e=>e.preventDefault());
    touch.addEventListener('pointerdown',e=>{touch.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY,pan:e.button===2||e.shiftKey});st.auto=false;panel.querySelector('#labAuto').setAttribute('aria-pressed','false');});
    touch.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
      if(P.size>=2){const a=[...P.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch)st.dist=clamp(st.dist*pinch/d,6,260);pinch=d;pan(dx/2,dy/2);return;}
      if(p.pan)pan(dx,dy);else{st.yaw-=dx*.006;st.pitch=clamp(st.pitch+dy*.005,.12,1.55);}});
    const up=e=>{P.delete(e.pointerId);if(P.size<2)pinch=0;};touch.addEventListener('pointerup',up);touch.addEventListener('pointercancel',up);
    touch.addEventListener('wheel',e=>{e.preventDefault();st.dist=clamp(st.dist*Math.exp(e.deltaY*.0012),6,260);},{passive:false});
    addEventListener('keydown',e=>{if(!st.on)return;if(e.key==='Escape'){toggle(false);}e.stopImmediatePropagation();},true);
  }
  function setShow(f){st.show=st.show.map((_,i)=>f(i));panel.querySelectorAll('#labLayers input').forEach((x,i)=>x.checked=st.show[i]);}
  function pan(dx,dy){const k=st.dist*.0016,c=Math.cos(st.yaw),s=Math.sin(st.yaw);st.tx-=(c*dx-s*dy)*k;st.tz-=(-s*dx-c*dy)*k;}
  function renderLayerCounts(){if(!panel)return;st.count.forEach((n,i)=>{const e=panel.querySelector('#labN'+i);if(e)e.textContent=n;});}
  function syncUi(){if(!panel)return;panel.querySelectorAll('#labZones button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===st.zone)));
    panel.querySelectorAll('#labWx button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===(S.wx||0))));
    const tr=panel.querySelector('#labTime');tr.value=S.time;const h=Math.floor(S.time/60),m=S.time%60;panel.querySelector('#labTimeL').textContent=h+':'+String(m).padStart(2,'0');
    const z=ZONES[st.zone];panel.querySelector('#labOsm').href='https://www.openstreetmap.org/#map=16/'+z.ll[0]+'/'+z.ll[1];}
  function view(v){const B=ZONES[st.zone].B,w=B.x2-B.x1,d=B.z2-B.z1;st.tx=(B.x1+B.x2)/2;st.tz=(B.z1+B.z2)/2;
    if(v==='game'){st.tx=clamp(player.x,B.x1,B.x2);st.tz=clamp(player.z,B.z1,B.z2);st.dist=18;st.pitch=.64;st.yaw=0;}
    else if(v==='top'){st.dist=Math.max(w,d*2)*1.05;st.pitch=1.55;st.yaw=0;}
    else{st.dist=Math.max(w,d*2)*.8;st.pitch=.72;st.yaw=-.5;}}
  function goZone(i,v){st.zone=i;view(v||'tilt');drawFrame();buildTags();syncUi();}
  function buildTags(){tags.innerHTML='';tagEls.length=0;let L=[];try{L=ZONES[st.zone].labels()||[];}catch(e){}
    L.forEach(([t,x,z])=>{const s=document.createElement('span');s.textContent=t;tags.appendChild(s);tagEls.push({s,x,z});});}
  function cam(dt){
    if(st.auto)st.yaw+=dt*.15;
    {const want=ZONES[st.zone].id==='island'?-1:1;if(scene.scale.x!==want){scene.scale.x=want;scene.updateMatrixWorld(true);}}
    const mx=scene.scale.x<0?-1:1,c=Math.cos(st.pitch);
    tv.set(st.tx*mx,0,st.tz);
    camera.position.set(tv.x+Math.sin(st.yaw)*c*st.dist,Math.sin(st.pitch)*st.dist,tv.z+Math.cos(st.yaw)*c*st.dist);
    camera.up.set(0,1,0);camera.lookAt(tv);{const n=Math.max(.3,st.dist*.04);if(Math.abs(camera.near-n)>.05){camera.near=n;camera.updateProjectionMatrix();}}
    camera.layers.mask=mask();if(sun.shadow&&sun.shadow.camera)sun.shadow.camera.layers.mask=camera.layers.mask;
    if(!st.fog){scene.fog.near=4000;scene.fog.far=5000;}else{scene.fog.near=st.dist*.8;scene.fog.far=st.dist*2.2;}
    post.uniforms.bloomK.value=st.bloom?.45:0;post.uniforms.blurK.value=st.tilt?1:0;post.uniforms.focus.value=.5;
    if(st.time!=null)S.time=st.time;
    st.scanT-=dt;if(st.scanT<=0){st.scanT=1.5;scan();}
    if(st.tags&&tagEls.length){tags.hidden=false;const r=stage.getBoundingClientRect();
      for(const g of tagEls){tv.set(g.x*mx,1.2,g.z).project(camera);const vis=tv.z<1&&Math.abs(tv.x)<1.05&&Math.abs(tv.y)<1.05;g.s.style.display=vis?'':'none';
        if(vis){g.s.style.left=(r.left+(tv.x+1)/2*r.width)+'px';g.s.style.top=(r.top+(1-tv.y)/2*r.height)+'px';}}}
    else tags.hidden=true;}
  function toggle(on){if(on===st.on)return;if(!panel)build();st.on=on;
    if(on){st.saved={near:camera.near,far:camera.far,fogN:scene.fog.near,fogF:scene.fog.far};camera.far=1200;camera.updateProjectionMatrix();try{engSuspend();}catch(e){}
      scan();document.body.classList.add('lab');panel.hidden=touch.hidden=false;
      const want=((location.search+location.hash).match(/lab=(\w+)/)||[])[1];let z=want?ZONES.findIndex(Z=>Z.id===want):-1;if(z<0)z=ZONES.findIndex(Z=>player.x>=Z.B.x1&&player.x<=Z.B.x2);goZone(z<0?0:z,'tilt');}
    else{document.body.classList.remove('lab');scene.scale.x=MIR?-1:1;scene.updateMatrixWorld(true);panel.hidden=touch.hidden=tags.hidden=true;if(st.tint)setTint(false);
      camera.layers.set(0);if(sun.shadow&&sun.shadow.camera)sun.shadow.camera.layers.set(0);camera.near=st.saved.near;camera.far=st.saved.far;camera.updateProjectionMatrix();
      scene.fog.near=st.saved.fogN;scene.fog.far=st.saved.fogF;if(frameLine)frameLine.visible=false;st.time=null;try{engResume();}catch(e){}resize();updateCamera(0,true);}}
  return {get on(){return st.on;},toggle,cam,classify,start:/[?&#]lab\b/.test(location.search+location.hash)};
})();
{const _uc=updateCamera;updateCamera=function(dt,snap){if(LAB.on){LAB.cam(dt||0);return;}_uc(dt,snap);};}
// city detail: tick the traffic in the city and in the Look Lab, and let Kip buy coffee at the kiosks
{const _zt=zoneTick;zoneTick=function(dt,t){_zt(dt,t);if(CDET.on&&CDET.g){const want=CDET.userShow!==false&&(zoneOf(player.x)==='cbd'||LAB.on);if(CDET.g.visible!==want)CDET.g.visible=want;}if(CDET.on&&zoneOf(player.x)==='cbd')CDET.tick(dt);};
  const _lc=LAB.cam;LAB.cam=function(dt){_lc(dt);if(CDET.on&&CDET.g){CDET.g.visible=CDET.userShow!==false;CDET.tick(dt);}};
  const KC={'Flat white':['A flat white on Hay Street. Perth does coffee properly.','Smooth. I should ask what beans they use for the café.'],'Long black':['A long black by the quay. Strong enough to row back to the island.','Black, hot, and the river right there. Lovely.'],'Iced latte':['An iced latte in the park. Kings Park on a warm day is the best.','Cold coffee, warm gums, good view.']};
  const _ct=cbdTargets;cbdTargets=function(T){_ct(T);if(!CDET.on||zoneOf(player.x)!=='cbd')return;
    CDET.kiosks.forEach(k=>T.push({x:k.x,z:k.z+.95,r:1.2,label:k.name+' · '+k.drink.toLowerCase()+' ('+k.price+' coins)',act:()=>{if(S.coins<k.price){toast('A '+k.drink.toLowerCase()+' is '+k.price+' coins');return;}S.coins-=k.price;eat(12);say(['Kip: '+pick(KC[k.drink])+' (+12 stamina)']);}}));};}
// city detail: join the static pieces into a few meshes per material (far fewer draw calls on phones)
CDET.merge=function(){if(!CDET.on||CDET.merged||!CDET.g)return;CDET.merged=true;const G=CDET.g;scene.updateMatrixWorld(true);
  const skip=new Set();CDET.veh.forEach(v=>v.g.traverse(o=>skip.add(o)));CBD.cut.forEach(e=>e.g.traverse(o=>skip.add(o)));const bb=new Set(BB);
  const inv=new THREE.Matrix4().copy(G.matrixWorld).invert(),mx=new THREE.Matrix4(),wp=new THREE.Vector3(),B=new Map();
  G.traverse(o=>{if(!o.isMesh||skip.has(o)||bb.has(o)||Array.isArray(o.material))return;o.getWorldPosition(wp);
    const cat=LAB.classify?LAB.classify(o):'prop';const k=o.material.uuid+'|'+cat+'|'+Math.floor(wp.x/16)+':'+Math.floor(wp.z/16)+'|'+(o.castShadow?1:0);if(!B.has(k))B.set(k,{cat,mat:o.material,cast:o.castShadow,list:[]});B.get(k).list.push(o);});
  let joined=0;for(const b of B.values()){if(b.list.length<2)continue;let n=0;const parts=b.list.map(o=>{let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(mx.multiplyMatrices(inv,o.matrixWorld));if(!g.attributes.uv)g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2),2));if(!g.attributes.normal)g.computeVertexNormals();n+=g.attributes.position.count;return g;});
    const P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2);let i=0;for(const g of parts){P.set(g.attributes.position.array,i*3);N.set(g.attributes.normal.array,i*3);U.set(g.attributes.uv.array,i*2);i+=g.attributes.position.count;g.dispose();}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('normal',new THREE.BufferAttribute(N,3));geo.setAttribute('uv',new THREE.BufferAttribute(U,2));geo.computeBoundingSphere();
    const m=new THREE.Mesh(geo,b.mat);m.castShadow=b.cast;m.receiveShadow=true;m.userData.labHint=b.cat;G.add(m);b.list.forEach(o=>o.parent.remove(o));joined+=b.list.length;}
  CDET.joined=joined;};
if(CDET.on){CDET.merge();CDET.g.visible=false;}
