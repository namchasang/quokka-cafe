// ---------- The player's built island rides along in the cloud saves (Look Lab ?ibcloud, nightly feature loop 18 Nov 2026) ----------
// Brief quokka-rottnest-engine-island (phase 2: "Island Codes save on the new island"). The island the player builds in the Island
// Builder lives on this device only (localStorage 'ppl-mapedit-player-rott<ver>'). With this lab on, both cloud saves carry it:
// the Island Code sync (qc_sync, restored with the code + recovery key) and the account cloud save (qc_cloud_save / qc_cloud_load).
// Restoring a save on another phone puts the built island back too. The game save itself (S) does not grow: the island is added
// only to what is sent and taken out again on load. If the Island Code server refuses the bigger save, it retries once without the
// island and stops sending it this session (the game save always goes through). Off by default: ?ibcloud turns it on.
var IBCLOUD_LIVE=false;
const IBCLOUD={on:IBCLOUD_LIVE||/[?&#]ibcloud\b/.test(location.search+location.hash),qcOff:false,sent:0,got:0,MAX:700000};
if(IBCLOUD.on){
  const PRE='ppl-mapedit-player-rott',N=121;
  const ver=()=>(typeof IBMAP_START!=='undefined'&&IBMAP_START.ver)||'';
  /* the same island the game builds from (newest player save whose map version matches the start map) */
  IBCLOUD.pack=()=>{try{const keys=Object.keys(localStorage).filter(k=>k.indexOf(PRE)===0).sort();
    for(let i=keys.length-1;i>=0;i--){const t=localStorage.getItem(keys[i]);if(!t||t.length>IBCLOUD.MAX)continue;const d=JSON.parse(t);
      if(d&&d.h&&d.h.length===N*N&&d.ver===ver())return{v:1,k:keys[i],ver:d.ver,at:Date.now(),t};}}catch(e){}return null;};
  /* takes the island out of a downloaded save and writes it where the Island Builder and the game look for it */
  IBCLOUD.unpack=sv=>{if(!sv||typeof sv!=='object'||!sv.ibdoc)return false;const b=sv.ibdoc;delete sv.ibdoc;
    try{if(!b||typeof b.t!=='string'||b.t.length>IBCLOUD.MAX)return false;const d=JSON.parse(b.t);if(!d||!d.h||d.h.length!==N*N||d.ver!==ver())return false;
      const k=typeof b.k==='string'&&b.k.indexOf(PRE)===0?b.k:PRE+ver();localStorage.setItem(k,b.t);IBCLOUD.got=Date.now();return true;}catch(e){return false;}};
  const withIsland=sv=>{const p=IBCLOUD.pack();if(!p||!sv||typeof sv!=='object')return null;return Object.assign({},sv,{ibdoc:p});};
  /* Island Code */
  if(typeof qcRpc==='function'){const q0=qcRpc;
    qcRpc=async function(fn,args,opt){
      if(fn==='qc_sync'&&args&&!IBCLOUD.qcOff){const s2=withIsland(args.p_save);
        if(s2){try{const j=await q0(fn,Object.assign({},args,{p_save:s2}),opt);IBCLOUD.sent=Date.now();return j;}
          catch(e){if(e&&e.message===QC_BLOCKED)throw e;IBCLOUD.qcOff=true;console.warn('ibcloud: island not accepted by qc_sync, sending the game save only',e&&e.message);}}}
      const j=await q0(fn,args,opt);
      if(fn==='qc_load'&&j&&j.save&&IBCLOUD.unpack(j.save))setTimeout(()=>{try{if(IBMAP.on&&IBMAP.done&&IBMAP.reload)IBMAP.reload();toast('\u{1F3DD} Your built island came back too',3);}catch(e){console.warn('ibcloud reload',e);}},1200);
      return j;};}
  /* account cloud save (the page reloads after a load, and the island is built from the restored save) */
  if(typeof acRpc==='function'){const a0=acRpc;
    acRpc=async function(fn,args){
      if(fn==='qc_cloud_save'&&args){const s2=withIsland(args.p_save);if(s2){try{const j=await a0(fn,Object.assign({},args,{p_save:s2}));if(j&&j.ok){IBCLOUD.sent=Date.now();return j;}}catch(e){console.warn('ibcloud: account save with the island failed, sending the game save only',e&&e.message);}}}
      const j=await a0(fn,args);if(fn==='qc_cloud_load'&&j&&j.save)IBCLOUD.unpack(j.save);return j;};}
}
