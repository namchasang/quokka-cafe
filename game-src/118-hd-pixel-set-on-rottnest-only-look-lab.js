// ---------- HD pixel set on Rottnest only (Look Lab ?hd or ?lab, Paul Nov 2026; HDR_LIVE turns it on for everyone) ----------
// From the shared library (part 111b, PPL.hd): Settlement cottages become HD limestone cottages (same size, colours and spot),
// limestone outcrops get a mossy pixel-limestone skin. ?hdtrees also swaps island trees and bushes for the HD 3D trees, only to
// compare: the standing art rule keeps plants as sprites until Paul decides.
const HDR_LIVE=false;const HDR_ON=HDR_LIVE||/[?&#](hd|lab)\b/.test(location.search+location.hash);const HDT_ON=/[?&#]hdtrees\b/.test(location.search+location.hash);
function hdRottBuild(){if(hdRottBuild.done||!window.PPL||!PPL.hd)return;hdRottBuild.done=true;const T0=performance.now();PPL.hdMode({srgb:false,lambert:true});
  const st={cottages:0,rocks:0,trees:0,bushes:0};const skip=o=>o.traverse(x=>{x.__pxSkip=1;});
  const glow=g=>g.traverse(o=>{if(o.isMesh)[].concat(o.material).forEach(m=>{if(m.emissiveMap&&!m.__hdg){m.__hdg=1;m.__dim=.9;PXB_GLOW.push(m);}});});
  const isl=o=>o.position.x<=100;// zoneOf(): x <= 100 is Rottnest
  // 1. cottages: a group with the 3 x 1.9 x 2.4 wall box and the three-sided roof prism
  const cots=[];scene.children.forEach(g=>{if(!g.isGroup||!g.visible||!isl(g))return;let w=null,r=null;g.children.forEach(c=>{const p=c.geometry&&c.geometry.parameters;if(!p)return;
    if(c.geometry.type==='BoxGeometry'&&p.width===3&&p.height===1.9&&p.depth===2.4)w=c;if(c.geometry.type==='CylinderGeometry'&&p.radialSegments===3&&p.radiusTop===1.75)r=c;});if(w&&r)cots.push({g,w,r});});
  cots.forEach(({g,w,r},i)=>{const hx=m=>'#'+m.material.color.getHexString();const h=PPL.hd('hd-cottage',{w:3,d:2.4,h:1.9,c:hx(w),roof:hx(r),seed:13+i,doorAt:.64,lamp:false});
    h.position.copy(g.position);h.rotation.y=g.rotation.y;h.name='hdCottage';scene.add(h);skip(h);glow(h);skip(g);g.visible=false;st.cottages++;});
  // 2. limestone outcrops keep their shapes, get a mossy pixel limestone skin
  if(typeof limeMat!=='undefined'){const RM=new Map([[limeMat,PPL.hdRockMat(12,'#e6dbc2')],[limeDark,PPL.hdRockMat(21,'#c8b898')]]);
    scene.traverse(o=>{if(o.isMesh&&RM.has(o.material)&&isl(o)){o.material=RM.get(o.material);o.__pxSkip=1;st.rocks++;}});}
  // 3. ?hdtrees: HD gum trees and flowering bushes in place of the island's leafy tree and bush sprites (pines stay)
  if(HDT_ON){const tpl=[1,2,3,4].map(s=>{const g=PPL.hd('hd-gum',{seed:s});skip(g);return g;}),btpl=[1,2].map(s=>{const g=PPL.hd('hd-bush',{seed:s+7});skip(g);return g;});
    const put=(src,from,H0)=>{const p=from.geometry.parameters,H=p.height||1;const c=src.clone();c.scale.setScalar(H/H0);c.position.set(from.position.x,0,from.position.z);c.rotation.y=(from.position.x*7.3+from.position.z*3.1)%6.283;scene.add(c);from.visible=false;from.__hdHide=1;return c;};
    trees.forEach((t,i)=>{if(!t.m||!t.m.visible||!isl(t.m)||t.v===treeVariants[3])return;put(tpl[i%4],t.m,8.6);st.trees++;});
    const bm=new Set(bushVariants.map(v=>v.m));scene.children.forEach((o,i)=>{if(o.isMesh&&bm.has(o.material)&&o.visible&&isl(o)){put(btpl[i%2],o,1.25);st.bushes++;}});}
  st.ms=Math.round(performance.now()-T0);hdRottBuild.stats=st;}
// ---------- Account, cloud save, world ranking and the Quokka Shop (moved over from Magpie Madness, Paul Nov 2026) ----------
// Look Lab ?acct or ?lab until ACCT_LIVE is true. Needs supabase/qc_accounts_rank_shop.sql run once and Google sign-in turned on in Supabase.
// Sign-in uses Supabase Auth over plain fetch (no library): Google -> back to the game with tokens in the address hash.
const ACCT_LIVE=false;const ACCT_ON=ACCT_LIVE||/[?&#](acct|lab)\b/.test(location.search+location.hash);
const SHOP_LINKS={supporter:'',island:'',tip:'https://buy.stripe.com/cNi5kDgc44ou9tXbwecwg00'};// Payhip product links go here once the products exist
const PACKS={supporter:{name:'Supporter Pack',price:'A$4.99',coins:20000,items:[['apron','sup'],['hat','captain']],desc:'Gold supporter apron, a captain’s cap, 20,000 coins and a ★ next to your name on the world ranking. Thank you!'},
  island:{name:'Island Style Pack',price:'A$1.99',coins:0,items:[['apron','hibiscus'],['acc','lei']],desc:'A hibiscus apron and a flower lei for Kip.'}};
WARD.apron.sup={name:'Supporter apron',col:'#d4a017',prem:'supporter'};WARD.hat.captain={name:'Captain’s cap',prem:'supporter'};
WARD.apron.hibiscus={name:'Hibiscus apron',col:'#e8457a',prem:'island'};WARD.acc.lei={name:'Flower lei',prem:'island'};
const AUTH={s:null,user:null,me:null};
function premList(){try{return JSON.parse(localStorage.getItem('qc-prem')||'{}')||{};}catch(e){return{};}}
function premHas(k){return !!premList()[k]||!!(AUTH.me&&AUTH.me.owned&&AUTH.me.owned[k]);}
function premGrant(k){const p=premList();p[k]=true;try{localStorage.setItem('qc-prem',JSON.stringify(p));}catch(e){}const P=PACKS[k];if(P&&P.coins&&running&&!VISIT){S.premCoins=S.premCoins||{};if(!S.premCoins[k]){S.premCoins[k]=1;S.coins+=P.coins;toast('★ '+P.name+': +'+P.coins.toLocaleString()+' coins',3);}save();}}
{const _wo=wardOwn;wardOwn=function(slot,id){if(_wo(slot,id))return true;const it=WARD[slot]&&WARD[slot][id];return !!(it&&it.prem&&premHas(it.prem));};}
{const _do=drawOutfit;drawOutfit=function(P,o){_do(P,o);if(!o)return;const S3=c=>{const h=hex(c);return[shade(h,.6),shade(h,.8),h,shade(h,1.15)];};
  if(o.hat==='captain'){P.ell(16,5.2,6.8,3,S3('#f4f4ee'));for(let i=10;i<23;i++)P.set(i,6,hex('#1d3a6e'));P.ell(22.4,7,4.4,1.2,S3('#1d3a6e'));P.set(16,4,hex('#e8a33a'));P.set(17,4,hex('#e8a33a'));}
  if(o.acc==='lei'){const F=['#e8457a','#ffd34d','#ffffff','#9478d4','#ff8a3a'];for(let i=10;i<24;i++){const c=F[(i>>1)%F.length];P.set(i,16+(i%2),hex(c));if(i%3===0)P.set(i,17-(i%2),hex('#3e7d5c'));}}};}
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

if(WORLD.on&&(WORLD3D_LIVE||OW3D_ON)){let OW=null,root=null;
  const close3=()=>{if(OW)OW.close();if(root)root.hidden=true;};
  const ensure=()=>{if(OW)return;const st=document.createElement('style');st.textContent=OW3D_CSS;document.head.appendChild(st);root=document.createElement('div');root.id='owRoot';root.hidden=true;root.innerHTML=OW3D_HTML;document.body.appendChild(root);
    OW=OW3DBuild(root,{look2:OW_LOOK2_LIVE||/[?&#](lab|ow2)\b/.test(location.search+location.hash),enter:(id,side)=>{close3();WORLD.enter(id,side);},back:()=>hideOverlays(),
      carColor:()=>{const c=typeof carSel==='function'&&carSel();return c&&c!=='retro'&&typeof RRR!=='undefined'&&RRR.CARS[c]?RRR.CARS[c].color:null;}});};
  const _h3=hideOverlays;hideOverlays=function(){_h3();close3();};
  window.openWorld=function(from,side){if(transit||VISIT||(overlay&&overlay!=='wm'))return;transit=true;fadeTarget=.95;
    setTimeout(()=>{try{ensure();}catch(e){console.error(e);transit=false;fadeTarget=0;return;}transit=false;fadeTarget=0;overlay='wm';ui.hud.hidden=true;ui.act.hidden=true;root.hidden=false;OW.open(from);},500);};
}
})();
</script>

<script>if('serviceWorker' in navigator)addEventListener('load',()=>{const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{const chk=()=>{if(!document.hidden)r.update().catch(()=>{});};document.addEventListener('visibilitychange',chk);setInterval(chk,600000);}).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||document.getElementById('qcUpd'))return;const b=document.createElement('button');b.id='qcUpd';b.type='button';b.textContent=(document.documentElement.lang==='th'?'มีเวอร์ชันใหม่ · แตะเพื่อโหลด':'New version ready · tap to reload');b.style.cssText='position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:9999;font:600 15px system-ui,sans-serif;background:#ffd34d;color:#141a2e;border:0;border-radius:10px;padding:12px 18px;box-shadow:0 4px 16px rgba(0,0,0,.35)';b.onclick=()=>location.reload();document.body.appendChild(b);});});</script>
