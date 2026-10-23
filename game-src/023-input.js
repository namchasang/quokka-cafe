// ---------- input ----------
const keys=new Set();
let STUDIO=false;
function studioTip(t){let el=document.getElementById('studioTip');if(!el){el=document.createElement('div');el.id='studioTip';document.body.appendChild(el);}el.textContent=t;el.classList.add('on');clearTimeout(studioTip.h);studioTip.h=setTimeout(()=>el.classList.remove('on'),2600);}
function studioClock(){const h=Math.floor(S.time/60)%24,m=Math.floor(S.time%60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');}
addEventListener('keydown',e=>{if(e.target&&/input|textarea/i.test(e.target.tagName))return;const k=e.key.toLowerCase();
  if(k==='k'&&!e.ctrlKey&&!e.metaKey){STUDIO=!STUDIO;document.body.classList.toggle('studio',STUDIO);studioTip(STUDIO?'Studio mode · 1–4 weather · [ ] time ±30 min · L playlist · K to exit':'Studio mode off');e.stopImmediatePropagation();return;}
  if(!STUDIO)return;
  if(['1','2','3','4'].includes(k)){S.wx=+k-1;studioTip('Weather: '+WEATHERS[S.wx].label);e.stopImmediatePropagation();return;}
  if(k==='l'&&!e.ctrlKey&&!e.metaKey){studioPlaylist();e.stopImmediatePropagation();return;}
  if(k==='['||k===']'){S.time=Math.min(1435,Math.max(300,S.time+(k===']'?30:-30)));studioTip('Time '+studioClock());e.stopImmediatePropagation();return;}
},true);
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();
  if(k==='escape'){if(!overlay&&running&&!dlgOpen()){openPause();return;}closeOverlays();return;}
  if(overlay){if((k==='enter'||k===' ')&&overlay==='day'){sleep();}if(k==='m'&&overlay==='map')hideOverlays();if(k==='j'&&overlay==='quest')hideOverlays();return;}
  if(k===' '||k==='e'||k==='enter'){if(!e.repeat)doAction();return;}
  if(k==='i'){openWish();return;}if(k==='m'){openMap();return;}if(k==='p'){snapPhoto();return;}if(k==='g'){openBag();return;}if(k==='h'){openGuide();return;}if(k==='f'){openFriend();return;}if(k==='c'){openCalendar();return;}if(k==='o'){openAlbum();return;}if((k==='b'||k==='v')){toggleRide();return;}if(k==='j'){openQuest();return;}
  if(k==='-'||k==='_'){zoomBy(1.18);return;}if(k==='='||k==='+'){zoomBy(.85);return;}
  if(k==='q'){rotateCam(-1);return;}if(k==='r'){rotateCam(1);return;}
  keys.add(k);});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
addEventListener('blur',()=>keys.clear());
const ptrs=new Map();let pinch=null;
let joyId=null,joyO={x:0,y:0},joyV={x:0,y:0};
let rotDrag=null;stage.addEventListener('contextmenu',e=>e.preventDefault());
stage.addEventListener('pointerdown',e=>{if(overlay||!running)return;if(e.pointerType==='mouse'&&e.button===2){rotDrag={id:e.pointerId,x:e.clientX,y0:yawT};try{stage.setPointerCapture(e.pointerId);}catch(_){}return;}if(e.button>0)return;if(dlgOpen()){nextLine();return;}
  ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptrs.size>=2){joyEnd({pointerId:joyId});const v=[...ptrs.values()];pinch={d:Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y)||1,z:zm};return;}
  if(e.clientX>innerWidth*.62&&e.pointerType!=='mouse')return;joyId=e.pointerId;joyO={x:e.clientX,y:e.clientY};ui.joy.style.left=e.clientX+'px';ui.joy.style.top=e.clientY+'px';ui.joy.hidden=false;ui.knob.style.transform='';ui.joyHint.hidden=true;try{stage.setPointerCapture(e.pointerId);}catch(_){}});
stage.addEventListener('pointermove',e=>{if(rotDrag&&e.pointerId===rotDrag.id){yawT=rotDrag.y0-(e.clientX-rotDrag.x)*.009*(MIR?-1:1);return;}if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pinch&&ptrs.size>=2){const v=[...ptrs.values()];const d=Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y)||1;zm=clamp(pinch.z*pinch.d/d,.55,1.7);return;}if(e.pointerId!==joyId)return;let dx=e.clientX-joyO.x,dy=e.clientY-joyO.y;const d=Math.hypot(dx,dy),max=46;if(d>max){dx*=max/d;dy*=max/d;}ui.knob.style.transform='translate('+dx+'px,'+dy+'px)';joyV={x:dx/max,y:dy/max};});
function joyEnd(e){if(e.pointerId!==joyId)return;joyId=null;joyV={x:0,y:0};ui.joy.hidden=true;}
const ptrUp=e=>{if(rotDrag&&e.pointerId===rotDrag.id){rotDrag=null;return;}ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;joyEnd(e);};stage.addEventListener('pointerup',ptrUp);stage.addEventListener('pointercancel',ptrUp);
function rotateCam(d){yawT+=(MIR?-d:d)*Math.PI/4;}
function zoomBy(f){zm=clamp(zm*f,.55,1.7);}
stage.addEventListener('wheel',e=>{e.preventDefault();zoomBy(Math.exp(e.deltaY*.0012));},{passive:false});
['zoomOut','zoomIn'].forEach((id,i)=>{const b=$('#'+id);const f=i?.85:1.18;b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();zoomBy(f);});b.addEventListener('click',e=>{if(e.detail===0)zoomBy(f);});});
$('#wxBtn').addEventListener('click',()=>{S.wx=((S.wx||0)+1)%WEATHERS.length;const w=WEATHERS[S.wx];S.temp=w.temp[0]+Math.floor(Math.random()*(w.temp[1]-w.temp[0]+1));toast('Weather: '+w.label);});
['rotL','rotR'].forEach((id,i)=>{const b=$('#'+id);b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();rotateCam(i?1:-1);});b.addEventListener('click',e=>{if(e.detail===0)rotateCam(i?1:-1);});});
ui.act.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();doAction();});
ui.act.addEventListener('click',e=>{if(e.detail===0)doAction();});

