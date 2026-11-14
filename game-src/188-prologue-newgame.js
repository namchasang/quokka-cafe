// ---------- New game opens with the prologue "Last Summer" (Paul, 15 Nov 2026: "ต่อเข้า new game เลย") ----------
// The island full of people last summer, the storm that night, the empty island the next morning, one year later: Kip comes to
// open the café. It plays on the engines in lib/engines/editor/prologue.html, full screen over the game; when it ends (or the
// player skips it) the game starts as before. Only for a new game; ?noprologue skips it.
(()=>{if(/[?&#]noprologue\b/.test(location.search+location.hash))return;
  const _sg=startGame;
  startGame=function(data){if(data)return _sg.apply(this,arguments);const args=arguments,self=this;let done=false;
    const fr=document.createElement('iframe');fr.src='./lib/engines/editor/prologue.html?ingame=1'+(/th/i.test(navigator.language||'')?'':'&lang=en');fr.title='Prologue';fr.allow='autoplay';
    fr.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:80;background:#0a1020';
    const sk=document.createElement('button');sk.type='button';sk.textContent='Skip ›';sk.style.cssText='position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:81;padding:9px 16px;border-radius:12px;border:2px solid #f5ecd8;background:rgba(20,26,46,.85);color:#f5ecd8;font:700 14px system-ui';
    const finish=()=>{if(done)return;done=true;window.removeEventListener('message',onMsg);fr.style.transition='opacity .7s';fr.style.opacity='0';sk.remove();setTimeout(()=>fr.remove(),800);try{_sg.apply(self,args);}catch(e){console.error('startGame',e);}};
    const onMsg=e=>{if(e.data&&e.data.quokkaPrologue==='done')finish();};window.addEventListener('message',onMsg);sk.onclick=finish;
    document.body.appendChild(fr);/* the prologue has its own skip button; this one only shows if the page did not load */sk.style.display='none';document.body.appendChild(sk);setTimeout(()=>{if(!done)sk.style.display='';},15000);};
})();
