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
