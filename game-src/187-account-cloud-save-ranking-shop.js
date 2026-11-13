// ---------- Account, cloud save, world ranking and the Quokka Shop (moved over from Magpie Madness, Paul Nov 2026) ----------
// Look Lab ?acct or ?lab until ACCT_LIVE is true. Needs supabase/qc_accounts_rank_shop.sql run once and Google sign-in turned on in Supabase.
// Sign-in uses Supabase Auth over plain fetch (no library): Google -> back to the game with tokens in the address hash.
const ACCT_LIVE=false;const ACCT_ON=ACCT_LIVE||/[?&#](acct|lab)\b/.test(location.search+location.hash);
const SHOP_LINKS={supporter:'',island:'',tip:'https://buy.stripe.com/cNieVdaRKdZ449D43Mcwg01'};// Payhip product links go here once the products exist
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
