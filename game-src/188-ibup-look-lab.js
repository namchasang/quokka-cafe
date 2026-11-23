// ---------- Café and jetty upgrades from the Island Builder (Look Lab ?ibup, nightly feature loop 19 Nov 2026) ----------
// Brief quokka-cafe-jetty-upgrade: the café and the jetty keep their OWN upgrade system (café levels in Café HQ, harbour
// upgrades on the jetty board), and the Island Builder is a second way in. With this lab on, the game opens the builder with
// &up=1; in the builder, tapping Kip's café or the jetty (permanent, cannot be moved or removed) shows '⬆ อัปเกรด', which
// saves the island and comes back here with ?resume=<slot>&open=cafe|jetty; this part then opens that panel once the save is
// running. Coins, levels and the models on the island stay the game's own (applyCafe / applyJetty). Off for players:
// IBUP_LIVE=false, ?ibup (or #ibup) turns it on.
var IBUP_LIVE=true;/* live: Paul, 23 Nov 2026 'อัปเกรดร้านและท่าเรือจาก Island Builder เลย' */
const IBUP={on:IBUP_LIVE||/[?&#]ibup\b/.test(location.search+location.hash),open:(location.search.match(/[?&]open=(cafe|jetty)\b/)||[])[1]||''};
if(IBUP.on||IBUP.open){
  // the builder button in the game menu passes &up=1 (the button is made by part 188-rebuild-quests, which runs next; this part must come before it so it reads ?open= before that part clears the address)
  if(IBUP.on)(function patch(){const b=document.getElementById('builderBtn');if(!b){setTimeout(patch,800);return;}
    b.onclick=()=>{try{save();}catch(e){}location.href='./lib/engines/editor/player.html?from=game&slot='+SLOT+'&up=1';};})();
  // back from the builder with a panel to open: wait for the resumed save to be running with no other panel up
  if(IBUP.open){const t0=Date.now();(function go(){let ok=false;try{ok=running&&!overlay&&zoneOf(player.x)==='island'&&(typeof IBMAP==='undefined'||!IBMAP.on||IBMAP.done);}catch(e){}
    if(!ok){if(Date.now()-t0<120000)setTimeout(go,400);return;}
    setTimeout(()=>{try{if(IBUP.open==='cafe')openCafe();else openShop('jetty');IBUP.opened=IBUP.open;}catch(e){IBUP.err=String(e);}},600);})();}
}
