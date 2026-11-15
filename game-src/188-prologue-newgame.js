// ---------- New game opens with the prologue "Last Summer" (Paul, 15 Nov 2026: "ต่อเข้า new game เลย") ----------
// The island full of people last summer, the storm that night, the empty island the next morning, one year later: Kip comes to
// open the café. It plays on the engines in lib/engines/editor/prologue.html. The game page goes there (only one 3D page at a
// time: with the prologue on top of the game an iPhone ran out of memory) and the prologue comes back with ?pnew=<slot>, which
// starts the new game in that slot. Only for a new game; ?noprologue skips it.
(()=>{const q=location.search.match(/[?&]pnew=(\d+)/);
  if(q){/* back from the prologue: start the new game in that slot as soon as the island is ready */try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}
    const slot=+q[1];(function go(){let ok=false;try{ok=ISL.done&&(!IBMAP.on||IBMAP.done);}catch(e){}/* parts load in order: wait for the island */if(ok){try{localStorage.removeItem(slotKey(slot));}catch(e){}SLOT=slot;['title','slots'].forEach(k=>{const o=document.getElementById(k+'Ov');if(o)o.hidden=true;});startGame(null);return;}setTimeout(go,300);})();return;}
  if(/[?&#]noprologue\b/.test(location.search+location.hash))return;
  const _sg=startGame;
  startGame=function(data){if(data)return _sg.apply(this,arguments);
    const v=document.createElement('div');v.style.cssText='position:fixed;inset:0;z-index:80;background:#0a1020;display:grid;place-items:center;color:#f5ecd8;font:700 16px "Pixelify Sans",monospace';v.textContent='Last summer…';document.body.appendChild(v);
    location.href='./lib/engines/editor/prologue.html?ingame=1&slot='+(SLOT||1)+(/th/i.test(navigator.language||'')?'':'&lang=en');};
})();
