// ---- auth ----
function authLoad(){try{AUTH.s=JSON.parse(localStorage.getItem('qc-auth')||'null');}catch(e){AUTH.s=null;}}
function authKeep(){try{if(AUTH.s)localStorage.setItem('qc-auth',JSON.stringify(AUTH.s));else localStorage.removeItem('qc-auth');}catch(e){}}
authLoad();
(()=>{const h=location.hash||'';if(!/access_token=/.test(h))return;const p=new URLSearchParams(h.slice(1));
  AUTH.s={at:p.get('access_token'),rt:p.get('refresh_token'),exp:Date.now()+(+p.get('expires_in')||3600)*1000};AUTH.fresh=true;authKeep();
  try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}})();
async function authToken(){if(!AUTH.s)return null;if(Date.now()<AUTH.s.exp-60000)return AUTH.s.at;
  try{const r=await fetch(QC_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:QC_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:AUTH.s.rt})});
    const j=await r.json();if(!r.ok||!j.access_token)throw 0;AUTH.s={at:j.access_token,rt:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000};authKeep();return AUTH.s.at;}
  catch(e){if(navigator.onLine!==false){AUTH.s=null;AUTH.user=null;AUTH.me=null;authKeep();}return null;}}
async function acRpc(fn,args){const t=await authToken();const r=await fetch(QC_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:QC_KEY,Authorization:'Bearer '+(t||QC_KEY),'Content-Type':'application/json'},body:JSON.stringify(args||{})});
  const tx=await r.text();let j=null;try{j=tx?JSON.parse(tx):null;}catch(e){}if(!r.ok)throw new Error((j&&(j.message||j.hint))||('Network error '+r.status));return j;}
async function authRefreshMe(){const t=await authToken();if(!t){AUTH.user=null;AUTH.me=null;return null;}
  if(!AUTH.user){try{const r=await fetch(QC_URL+'/auth/v1/user',{headers:{apikey:QC_KEY,Authorization:'Bearer '+t}});if(r.ok)AUTH.user=await r.json();}catch(e){}}
  try{AUTH.me=await acRpc('qc_me');}catch(e){AUTH.me=AUTH.me||null;}
  if(AUTH.me&&AUTH.me.owned)Object.keys(AUTH.me.owned).forEach(k=>{if(AUTH.me.owned[k]&&!premList()[k])premGrant(k);});
  if(AUTH.me&&!AUTH.me.nick&&AUTH.user){const md=AUTH.user.user_metadata||{};const g=(md.full_name||md.name||'').split(' ')[0];if(g)try{const j=await acRpc('qc_set_nick',{p_nick:g});if(j&&j.ok)AUTH.me.nick=j.nick;}catch(e){}}
  return AUTH.me;}
function signIn(){try{save();}catch(e){}location.href=QC_URL+'/auth/v1/authorize?provider=google&redirect_to='+encodeURIComponent(location.origin+location.pathname+location.search);}
function signOut(){AUTH.s=null;AUTH.user=null;AUTH.me=null;authKeep();}
// ---- cloud save: the current slot goes up a minute after the last save, and when the tab is hidden ----
const CLOUD={t:0,last:0,busy:false,err:''};
async function cloudUp(force){if(!AUTH.s||VISIT||LIVE||CLOUD.busy)return;if(!force&&Date.now()-CLOUD.last<60000){clearTimeout(CLOUD.t);CLOUD.t=setTimeout(()=>cloudUp(true),60000);return;}
  const o=readSlot(SLOT);if(!o)return;CLOUD.busy=true;try{const j=await acRpc('qc_cloud_save',{p_slot:SLOT,p_save:o});CLOUD.last=Date.now();CLOUD.err=j&&j.ok?'':'not saved';}catch(e){CLOUD.err=e.message;}finally{CLOUD.busy=false;}}
{const _sv=save;save=function(){_sv();if(AUTH.s){clearTimeout(CLOUD.t);CLOUD.t=setTimeout(()=>cloudUp(false),5000);}};}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&AUTH.s)cloudUp(true);});
// ---- world ranking: sent at the end of each café day ----
async function rankSubmit(){if(!AUTH.s||VISIT||LIVE)return;
  try{await acRpc('qc_rank_submit',{p_island:qcNames().island,p_best_day:Math.round(S.bestDay||0),p_served:S.servedTotal||0,p_days:S.day||0});}catch(e){}}
{const _ed=endDay;endDay=function(){try{S.bestDay=Math.max(S.bestDay||0,S.earned||0);rankSubmit();}catch(e){}return _ed.apply(this,arguments);};}
// ---- Perth Pass gift codes (Magpie Madness buyers) are checked by qc_redeem_code when the normal pass check says no ----
{const _pr=passRedeemServer;passRedeemServer=async function(c){let r=null,err=null;try{r=await _pr(c);}catch(e){err=e;}if(r&&r.ok)return r;
  try{const g=await acRpc('qc_redeem_code',{p_code:c,p_device:passDevice()});if(g&&g.ok&&g.kind==='pass'){premGrant('pass');return{ok:true};}if(g&&g.reason==='limit')return g;}catch(e){}if(r)return r;throw err||new Error('offline');};}
{const _hp=hasPass;hasPass=function(){return _hp()||premHas('pass');};}
// ---- the Account & Shop panel ----
let acTab='acct',rankBy='best_day';
function acEl(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
function acBtn(txt,fn,ghost,id){const b=acEl('button','btn'+(ghost?' ghost':''),txt);b.type='button';if(id)b.id=id;b.onclick=fn;return b;}
function acMsg(t,bad){const m=$('#acMsg');if(m){m.textContent=t||'';m.className='psMsg'+(t?(bad?' bad':' ok'):'');}}
function acBuild(){if($('#acctOv'))return;const ov=acEl('div','overlay');ov.id='acctOv';ov.hidden=true;
  ov.innerHTML='<div class="card panel"><div class="eyebrow">Account &amp; Shop</div><h2 id="acTitle">Your Quokka Café account</h2><div class="qtabs" id="acTabs"></div><div id="acBody"></div><p class="psMsg" id="acMsg"></p><div class="btns"><button class="btn ghost" type="button" id="acClose">Close</button></div></div>';
  $('#passOv').parentNode.appendChild(ov);$('#acClose').onclick=()=>hideOverlays();
  const st=document.createElement('style');st.textContent='#acctOv .card{max-width:520px}#acctOv .acRow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:.5em 0}#acctOv input{font:inherit;padding:.45em .6em;border-radius:6px;border:1px solid #6a5a48;background:#1b1612;color:#f3e9d8;min-width:0;flex:1}#acctOv table{width:100%;border-collapse:collapse;font-size:.92em}#acctOv td,#acctOv th{padding:.32em .4em;text-align:left;border-bottom:1px solid rgba(255,255,255,.1)}#acctOv td.n,#acctOv th.n{text-align:right;font-variant-numeric:tabular-nums}#acctOv tr.me{background:rgba(232,163,58,.18)}#acctOv .acPack{border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:.7em .8em;margin:.6em 0}#acctOv .acPack h3{margin:0 0 .25em}#acctOv .acOwn{color:#9be59b;font-weight:600}#acctOv .psMsg{min-height:1.3em}#acctOv .psMsg.ok{color:#9be59b}#acctOv .psMsg.bad{color:#ff9d8a}';document.head.appendChild(st);}
async function openAcct(tab){if(!running||overlay)return;acBuild();if(tab)acTab=tab;showOverlay('acct');acMsg('');renderAcct();if(AUTH.s){await authRefreshMe();if(overlay==='acct')renderAcct();}}
function renderAcct(){const T=$('#acTabs'),B=$('#acBody');T.innerHTML='';B.innerHTML='';
  [['acct','Account'],['rank','World ranking'],['shop','Shop']].forEach(([k,l])=>{const b=acEl('button','qtab'+(acTab===k?' on':''),l);b.type='button';b.id='act-'+k;b.onclick=()=>{acTab=k;acMsg('');renderAcct();};T.appendChild(b);});
  if(acTab==='acct'){
    if(!AUTH.s){B.appendChild(acEl('p','bgE','Sign in with Google to keep your café safe in the cloud, carry on from any phone or computer, join the world ranking and keep what you buy in the shop.'));
      B.appendChild(acBtn('Sign in with Google',signIn,false,'acSignIn'));B.appendChild(acEl('p','bgE','You leave the game for a moment and come straight back. Your game is saved first.'));return;}
    const u=AUTH.user,me=AUTH.me;B.appendChild(acEl('p','bgE','Signed in'+(u&&u.email?' as '+u.email:'')+'.'));
    const r=acEl('div','acRow');const nk=acEl('input');nk.id='acNick';nk.maxLength=16;nk.placeholder='Name on the ranking';nk.value=(me&&me.nick)||'';r.appendChild(nk);
    r.appendChild(acBtn('Save name',async()=>{try{const j=await acRpc('qc_set_nick',{p_nick:nk.value});if(j&&j.ok){AUTH.me=AUTH.me||{};AUTH.me.nick=j.nick;acMsg('Saved.');}else acMsg('Letters and numbers only, up to 16.',true);}catch(e){acMsg(e.message,true);}},true));B.appendChild(r);
    B.appendChild(acEl('h3','bgH','Cloud saves'));const saves=(me&&me.saves)||[];
    if(!saves.length)B.appendChild(acEl('p','bgE','Nothing in the cloud yet. Your slot uploads by itself a minute after the game saves.'));
    saves.forEach(sv=>{const row=acEl('div','acRow');row.appendChild(acEl('span',null,'Slot '+sv.slot+' · day '+(sv.day||'?')+' · '+agoTxt(sv.saved_at)+(sv.slot===SLOT?' (this slot)':'')));
      const b=acBtn('Load into slot '+SLOT,async()=>{if(b.dataset.sure!=='1'){b.dataset.sure='1';b.textContent='Tap again: replace slot '+SLOT+' with this save';return;}
        try{const j=await acRpc('qc_cloud_load',{p_slot:sv.slot});if(!j||!j.save)throw new Error('Not found');localStorage.setItem(slotKey(SLOT),JSON.stringify(j.save));acMsg('Loaded. Restarting…');setTimeout(()=>location.reload(),700);}catch(e){acMsg(e.message,true);}},true);row.appendChild(b);B.appendChild(row);});
    const r2=acEl('div','acRow');r2.appendChild(acBtn('Upload this slot now',async()=>{acMsg('Uploading…');await cloudUp(true);acMsg(CLOUD.err||'Uploaded.',!!CLOUD.err);await authRefreshMe();renderAcct();},true));
    r2.appendChild(acBtn('Sign out',()=>{signOut();renderAcct();acMsg('Signed out. Your game stays on this device.');},true));B.appendChild(r2);return;}
  if(acTab==='rank'){const R=acEl('div','qtabs');[['best_day','Best day'],['served','Customers served'],['days','Days on the island']].forEach(([k,l])=>{const b=acEl('button','qtab'+(rankBy===k?' on':''),l);b.type='button';b.onclick=()=>{rankBy=k;renderAcct();};R.appendChild(b);});B.appendChild(R);
    const box=acEl('div');box.id='acRank';box.textContent='Loading…';B.appendChild(box);
    acRpc('qc_rank_top',{p_by:rankBy,p_limit:20}).then(rows=>{box.innerHTML='';if(!rows||!rows.length){box.appendChild(acEl('p','bgE','No cafés on the board yet. Sign in and finish a day to be the first.'));return;}
      const t=acEl('table');t.innerHTML='<tr><th>#</th><th>Café owner</th><th>Island</th><th class="n">'+({best_day:'Best day',served:'Served',days:'Days'})[rankBy]+'</th></tr>';
      rows.forEach((x,i)=>{const tr=acEl('tr',x.me?'me':null);[String(i+1),(x.supporter?'★ ':'')+x.nick,x.island||'',(x[rankBy]||0).toLocaleString()+(rankBy==='best_day'?' c':'')].forEach((v,j)=>tr.appendChild(acEl('td',j===3?'n':null,v)));t.appendChild(tr);});box.appendChild(t);
      if(!AUTH.s)box.appendChild(acEl('p','bgE','Sign in on the Account tab to put your café on the board.'));}).catch(()=>{box.textContent='The ranking isn’t reachable right now.';});return;}
  Object.keys(PACKS).forEach(k=>{const P=PACKS[k],own=premHas(k);const d=acEl('div','acPack');d.appendChild(acEl('h3',null,P.name+' · '+P.price));d.appendChild(acEl('p','bgE',P.desc));
    if(own)d.appendChild(acEl('span','acOwn','✓ Yours. Wear it from Bag → Outfit.'));
    else d.appendChild(acBtn('Buy · '+P.price,()=>{const u=SHOP_LINKS[k];if(!u){acMsg('This pack opens in the shop very soon!',true);return;}const w=window.open(u,'_blank');if(w)w.opener=null;}));B.appendChild(d);});
  B.appendChild(acEl('h3','bgH','Have a code?'));const r=acEl('div','acRow');const inp=acEl('input');inp.id='acCode';inp.placeholder='QCS-XXXX-XXXX-XX';inp.maxLength=20;inp.autocomplete='off';r.appendChild(inp);
  r.appendChild(acBtn('Use code',async()=>{acMsg('Checking your code…');try{const j=await acRpc('qc_redeem_code',{p_code:inp.value,p_device:passDevice()});
      if(!j||!j.ok){acMsg(j&&j.reason==='limit'?'This code is already used on 3 devices.':'That code isn’t valid. Check it matches your email.',true);return;}
      if(j.kind==='pass'){premGrant('pass');S.pass=true;try{localStorage.setItem('qc-perth-pass','1');}catch(e){}save();acMsg('Perth Pass unlocked! Fremantle and Victoria Park are open.');return;}
      premGrant(j.item);acMsg('★ '+((PACKS[j.item]||{}).name||'Pack')+' unlocked! Wear it from Bag → Outfit.');renderAcct();}catch(e){acMsg('Can’t reach the shop right now. Check your internet and try again.',true);}}));B.appendChild(r);
  B.appendChild(acEl('h3','bgH','Say thanks'));B.appendChild(acEl('p','bgE','Enjoying the café? A small tip helps Paul keep making Quokka Café and Friends.'));
  B.appendChild(acBtn('♥ Tip the developer',()=>{const w=window.open(SHOP_LINKS.tip,'_blank');if(w)w.opener=null;},true));}
acBuild();// the panel must exist before showOverlay/hideOverlays touch it
if(ACCT_ON){const b=$('#acctBtn');if(b){b.hidden=false;b.onclick=()=>openAcct();}if(AUTH.fresh)setTimeout(()=>{if(running)toast('✓ Signed in. Your café now saves to the cloud.',3.5);authRefreshMe();},4000);else if(AUTH.s)setTimeout(authRefreshMe,6000);}

