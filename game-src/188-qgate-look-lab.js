// ---------- Quest log grows as Kip meets people (Look Lab ?qgate, Paul 19 Nov 2026) ----------
// Paul: "on the first day there is only the main quest; side quests show up only after Kip talks to each NPC".
// The quest log used to open 18 quests on day 1. With this lab on, the main story stays (Bring Mum & Dad, Start here: Café HQ,
// the area story chapters), and every other quest joins the log only once it has started:
//  - side quests (sq_*): once Kip has talked to their giver (the first step is done when he walks up to them)
//  - Nana Wren's shells: once Kip has talked to Nana Wren; stones, postcards: once the first one is found
//  - festivals: on a festival day, or once one is done; the road to Fremantle (from Gus): once the jetty has its first upgrade
//  - Island entrepreneur (Kip's own next goal): from day 2
//  - quests that already had their own unlock rule (stars, rooms, daily tasks, garden, Victoria Park food, Freo day) keep it
// A quest Kip is tracking always stays. Progress is never changed, only what the log shows. Off for players: QGATE_LIVE=false.
var QGATE_LIVE=true;/* live: Paul, 19 Nov 2026 "ขึ้นเกมได้" */
const QGATE={on:QGATE_LIVE||/[?&#]qgate\b/.test(location.search+location.hash)};
if(QGATE.on){
  const MAIN=id=>id==='main'||id==='hq'||/^story_/.test(id);
  const started=q=>q.steps.some(st=>st[1]);
  const RULE={
    shells:q=>(S.quest||0)>=1||started(q),
    festival:q=>(typeof festToday==='function'&&!!festToday())||started(q),
    freo:q=>(S.jetty||0)>=1||started(q),
    biz:q=>(S.day||1)>=2||started(q)};
  const ALWAYS=new Set(['freoday','star','rooms','daily','friends','vpfood','garden']);/* these had their own unlock already */
  const _Q=QUESTS;
  QUESTS=function(){const L=_Q();return L.map(q=>{if(!q.open||MAIN(q.id)||ALWAYS.has(q.id)||S.track===q.id)return q;
    const f=RULE[q.id]||started;return f(q)?q:Object.assign({},q,{open:false});});};
  // a quest that joins the log says so once (kept in the save so it is not repeated)
  setInterval(()=>{try{if(!running||VISIT||!S)return;S.qgSeen=S.qgSeen||{};const vis=QUESTS().filter(q=>q.open);let first=!Object.keys(S.qgSeen).length;
    vis.forEach(q=>{if(S.qgSeen[q.id])return;S.qgSeen[q.id]=1;if(!first&&!MAIN(q.id))toast('📜 New quest: '+q.title.replace(/^[^A-Za-z]+/,''),3.5);});}catch(e){}},2000);
}
