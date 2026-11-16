// Player B probe (returning player): run inside __t.html with tools/qa-player.mjs probe mode:
//   QA_JS="$(cat tools/qa-returning.js)" node tools/qa-player.mjs <outDir> probe
// Loads an advanced save (day 30, coins, Mum & Dad moved in, jetty 3, Perth Pass, boats, a business, staff), then checks
// what a returning player uses: quest list and next steps, unlocks, side quests, daily tasks, branches, boats (moored in
// water, shop reachable), Captain Ned's open-sea quest, 5 new days in a row, and a short walk in every town
// (Rottnest, South Perth, Fremantle, Heirisson, Victoria Park), collecting every error thrown on the way.
new Promise(res=>{const t0=Date.now();
const chk=()=>{if((typeof IBMAP!=='undefined'&&IBMAP.done)||Date.now()-t0>300000)go();else setTimeout(chk,1000);};
const go=()=>{const errs=[],log=[];const E=(k,f)=>{try{return f();}catch(e){errs.push(k+': '+e.message+' @'+String(e.stack||'').split('\n')[1]);return undefined;}};
 window.addEventListener('error',e=>errs.push('window: '+e.message));
 const said=[];const _say=say;say=function(l,cb){(Array.isArray(l)?l:[l]).forEach(x=>said.push(typeof x==='string'?x:(x.who+': '+x.text)));try{return _say(l,cb);}catch(e){said.push('ERR '+e.message);}};
 try{localStorage.clear();}catch(e){}
 E('startGame',()=>startGame(null));
 save=function(){};requestAnimationFrame=()=>0;
 const clr=()=>{dlgQ=[];dlgDone=null;ui.dlg.hidden=true;overlay=null;running=true;transit=false;};
 // ---- advanced save ----
 E('state',()=>{Object.assign(S,{day:30,coins:25000,servedTotal:900,metGus:true,metMei:true,quest:3,jetty:3,staff:3,pass:true,
   wish:Object.assign({},S.wish,{room:true,tickets:true,machine:true}),parentsDay:12,
   qg:Object.assign({},S.qg,{planted:1,sold:1,village:1,hqOpen:1,wishSeen:1,coach_geordie:1}),
   boats:{fishing:1},shells:{a:1,b:1,c:1},lore:{a:1,b:1,c:1}});
   if(typeof syncStaff==='function')syncStaff();if(typeof applyJetty==='function')applyJetty();});
 const bizK=E('biz',()=>{const k=Object.keys(typeof BIZ!=='undefined'?BIZ:{})[0];if(k){S.biz=S.biz||{};S.biz[k]={own:true,lv:1};}return k;});
 // ---- quest list ----
 const quests=E('QUESTS',()=>QUESTS().filter(q=>q.open).map(q=>{const nx=q.steps.find(s=>!s[1]);return q.id+' ['+q.steps.filter(s=>s[1]).length+'/'+q.steps.length+']'+(nx?' next: '+nx[0]:' DONE');}))||[];
 const unl=E('UNLOCKS',()=>UNLOCKS.map(u=>u.id+':'+(u.ok()?'on':'off ('+u.how+')')))||[];
 const side=E('sqQuests',()=>sqQuests().map(q=>q.title+' ['+q.steps.filter(s=>s[1]).length+'/'+q.steps.length+']'))||[];
 const daily=E('daily',()=>{if(typeof newDay==='function'){} checkDaily();return {tasks:S.dtasks,done:S.dtDone};});
 // ---- branches ----
 const branches=E('branches',()=>BRANCHES.map(b=>{const st=brState(b.id);return b.id+' '+b.zone+' own:'+!!st.own+' price:'+(b.price||'?');}));
 E('applyBranches',()=>applyBranches());
 // ---- boats ----
 const boat=E('boat',()=>({home:BOAT.home,homeLandD:+landD(BOAT.home.x,BOAT.home.z).toFixed(2),dock:BOAT.dock,dockBlocked:blocked(BOAT.dock.x,BOAT.dock.z),
   shopAt:BOATS.shopAt,shopBlocked:BOATS.shopAt?blocked(BOATS.shopAt.x,BOATS.shopAt.z):null}));
 E('useBoat',()=>BOATS.use('fishing'));
 const sea=E('opensea',()=>typeof OPENSEA!=='undefined'?{spots:(OPENSEA.spots||[]).length,secret:!!OPENSEA.secret,ned:(S.sq||{}).ned}:null);
 // ---- five days in a row ----
 const days=[];for(let d=0;d<5;d++){clr();const c0=S.coins;E('newDay'+d,()=>newDay());clr();S.wx=0;S.time=430;
   for(let i=0;i<600;i++){clr();E('update day'+d,()=>update(.05));if(errs.length>40)break;}
   days.push({day:S.day,coins:Math.round(S.coins-c0),wx:S.wx,ev:S.ev&&S.ev.id,dtasks:(S.dtasks||[]).join(',')});}
 // ---- walk in every town ----
 const towns=[['island',-118,-27],['sp',150,7],['freo',295,0],['hi',420,0],['vp',525,5]];const walk=[];
 towns.forEach(([n,x,z])=>{clr();E('tp '+n,()=>{player.x=x;player.z=z;if(player.mesh)player.mesh.position.set(x,0,z);});
   const e0=errs.length;for(let i=0;i<300;i++){clr();E('update '+n,()=>update(.05));}
   let tg=[];E('targets '+n,()=>{if(typeof cbdTargets==='function'){const T=[];cbdTargets(T);tg=T.map(t=>t.label).slice(0,12);}});
   walk.push({n,zone:E('zone',()=>zoneOf(player.x)),blocked:E('bl',()=>blocked(x,z)),obj:E('obj',()=>objective()),errors:errs.length-e0,targets:tg});});
 res({secs:(Date.now()-t0)/1000,ib:typeof IBMAP!=='undefined'&&IBMAP.done,bizK,quests,unl,side,daily,branches,boat,sea,days,walk,said:said.slice(-25),errs:[...new Set(errs)].slice(0,40)});};
chk();})
