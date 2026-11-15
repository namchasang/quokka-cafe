// ---------- Rebuild quests (Paul, 15 Nov 2026: "ทำเควสสร้างคืน") ----------
// The storm took the island's buildings. Five side quests now come back only when the player builds their building in the
// Island Builder (business cards "สร้างคืน"): build it and its owner returns to the island with the quest; until then, once the
// story reaches that point, the owner writes to Kip asking for help. The quest giver stands at the building the player built.
// A quest already started or finished stays as it is, even if the building is pulled down later.
const REBUILD=[
  {q:'saltjar',k:'saltstore',need:1,day:3,pcs:['sal'],from:'Sal',what:'the Salt Store',text:'Dear Kip, my grandfather’s salt store blew away in the storm. If someone rebuilt it by the lakes, I would come home and open it again. Build a Salt Store in the Island Builder (Business → สร้างคืน). Sal'},
  {q:'joey',k:'qhut',need:3,day:6,pcs:['village'],from:'Poppy',what:'three huts for Quokka Village',text:'Hello Kip! The storm flattened Quokka Village and my little Pebble and I are sleeping under a bush. Three huts among the trees would make it home again. Build them in the Island Builder (Business → สร้างคืน). Poppy'},
  {q:'windsock',k:'airstrip',need:1,day:6,pcs:['jo'],from:'Pilot Jo',what:'Island Airstrip',text:'G’day Kip, Pilot Jo here. No airstrip, no landing. Put the Island Airstrip back on the map in the Island Builder (Business → สร้างคืน) and I’ll fly straight over. Jo'},
  {q:'golfball',k:'golf',need:1,day:6,pcs:['col'],from:'Col the greenkeeper',what:'Island Links Golf',text:'Kip, the clubhouse is gone and the greens are all sand. Build Island Links Golf in the Island Builder (Business → สร้างคืน) and I’ll have the course mowed in a week. Col'},
  {q:'cottagekeys',k:'bickley',need:2,day:9,pcs:['tash'],from:'Tash the cottage keeper',what:'two Bickley Bay cottages',text:'Hi Kip, guests keep asking for Bickley Bay. Two cottages there would get me started again. Build them in the Island Builder (Business → สร้างคืน). Tash'}];
(()=>{const RB={};REBUILD.forEach(r=>RB[r.q]=r);
  const built=r=>{try{return((IBMAP.doc&&IBMAP.doc.biz)||[]).filter(b=>b.t===r.k);}catch(e){return[];}};
  const isReady=r=>built(r).length>=r.need;
  const started=q=>!!(S.sq&&S.sq[q]);
  // a rebuild quest opens only when its building stands (or it was already started)
  const _open=sqOpen;sqOpen=function(q){const r=RB[q.id];if(r&&!started(q.id)&&!isReady(r))return false;return _open(q);};
  // its owner stands in front of the building the player built
  const _pos=sqPos;sqPos=function(st){const id=String(st&&st.at||'').replace('pc:','');for(const r of REBUILD){if(r.pcs.indexOf(id)<0)continue;const L=built(r);if(!L.length)break;const b=L[0],a=b.r||0,g=IBMAP.toGame(b.x+Math.sin(a)*4,b.z+Math.cos(a)*4);return{x:g[0],z:g[1]};}return _pos(st);};
  // a letter from the owner once the story gets there and the building is not there yet
  function letters(){if(typeof S==='undefined'||!S||VISIT||!IBMAP.done)return;S.rbMail=S.rbMail||{};S.mail=S.mail||[];let n=0;
    REBUILD.forEach(r=>{if(S.rbMail[r.q]||started(r.q)||isReady(r)||(S.day||1)<r.day)return;S.rbMail[r.q]=S.day;S.mail.unshift({day:S.day,from:r.from,text:r.text,coins:0,read:false,got:false});n++;});
    if(n){try{save();}catch(e){}try{toast('📬 '+(n>1?n+' letters':'A letter')+' about rebuilding the island. Check the mailbox by the café.',4);}catch(e){}}
    REBUILD.forEach(r=>{const k='rbOk_'+r.q;if(isReady(r)&&!started(r.q)&&!S[k]){S[k]=1;try{toast('🏗️ '+r.from+' is back on the island: new side quest!',4);}catch(e){}}});}
  setInterval(()=>{try{letters();}catch(e){}},5000);
  // the Island Builder from the game menu, in the same tab (one 3D page at a time); its "Back to the game" button reopens this save
  (function btn(){const right=document.querySelector('.right');if(!right){setTimeout(btn,800);return;}const b=document.createElement('button');b.id='builderBtn';b.type='button';b.className='panel hudBtn more';b.textContent='🏗️ Island Builder';
    b.onclick=()=>{try{save();}catch(e){}location.href='./lib/engines/editor/player.html?from=game&slot='+SLOT;};right.appendChild(b);})();
  // back from a builder page (?resume=<slot>): open that save straight away
  (()=>{const m=location.search.match(/[?&]resume=(\d+)/);if(!m)return;try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}const n=+m[1];
    (function go(){let ok=false;try{ok=ISL.done&&(!IBMAP.on||IBMAP.done);}catch(e){}if(!ok){setTimeout(go,300);return;}const d=readSlot(n);SLOT=n;['title','slots'].forEach(k=>{const o=document.getElementById(k+'Ov');if(o)o.hidden=true;});startGame(d||null);})();})();
})();
