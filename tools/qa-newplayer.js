// Player A probe (new player): run inside __t.html with tools/qa-player.mjs probe mode:
//   QA_JS="$(cat tools/qa-newplayer.js)" node tools/qa-player.mjs <outDir> probe
// Starts a fresh game on the live island, records the opening dialogue, then checks every place the first
// quests send a new player: is it on land, how close can Kip walk (blocked()), and is that within the radius the
// game needs (postcards: p.r, talk spots ~2.4). Also checks Kip's start point, café seats and the quest list.
new Promise(res=>{const t0=Date.now();
const chk=()=>{if((typeof IBMAP!=='undefined'&&IBMAP.done)||Date.now()-t0>300000)go();else setTimeout(chk,1000);};
const go=()=>{const said=[];const _say=say;say=function(l,cb){(Array.isArray(l)?l:[l]).forEach(x=>said.push(typeof x==='string'?x:(x.who+': '+x.text)));try{return _say(l,cb);}catch(e){said.push('ERR '+e.message);}};
 try{localStorage.clear();}catch(e){}
 try{startGame(null);}catch(e){said.push('startGame ERR '+e.message);}
 const L=(x,z)=>{try{return +IBMAP.landD(x,z).toFixed(2);}catch(e){return null;}};
 const reach=(x,z)=>{try{if(!blocked(x,z))return 0;for(let r=.25;r<=8;r+=.25)for(let a=0;a<24;a++){const X=x+Math.cos(a/24*6.283)*r,Z=z+Math.sin(a/24*6.283)*r;if(!blocked(X,Z))return r;}return 99;}catch(e){return 'err';}};
 const out=[];const add=(kind,name,x,z,need)=>{if(typeof x!=='number')return;const r=reach(x,z);out.push({kind,name,x:+x.toFixed(1),z:+z.toFixed(1),land:L(x,z),reach:r,need,bad:typeof r==='number'&&r>need});};
 add('start','Kip start',player.x,player.z,0);
 // story chapters of Rottnest
 try{STORY_DEF().island.chapters.forEach((c,ci)=>chapSteps(c).forEach(st=>{const t=st[1];
   if(typeof t==='string'){const p=PCS.find(q=>q.id===t);if(!p){out.push({kind:'story',name:'ch'+(ci+1)+' '+st[0],missing:t,bad:true});return;}let ps=[];try{ps=p.pos();}catch(e){}
     if(!ps.length){out.push({kind:'story',name:'ch'+(ci+1)+' '+st[0],nopos:t,bad:true});return;}
     let best=null;ps.forEach(q=>{const r=reach(q[0],q[1]);if(best===null||r<best.r)best={q,r};});add('story','ch'+(ci+1)+' '+st[0]+' ['+t+']',best.q[0],best.q[1],p.r);}
   else{try{const a=t.at();add('story','ch'+(ci+1)+' '+st[0],a.x,a.z,2.4);}catch(e){}}}));}catch(e){out.push({err:'story '+e.message});}
 // café seats (customers must sit where Kip can carry food)
 try{(SEATS||[]).forEach((s,i)=>{const x=s.x!=null?s.x:s[0],z=s.z!=null?s.z:s[1];add('seat','seat'+i,x,z,1.2);});}catch(e){}
 // quest givers seen on day 1
 try{[['Gus',gus],['Nana Wren',wren]].forEach(([n,o])=>o&&add('npc',n,o.x,o.z,2.4));}catch(e){}
 // side quests on Rottnest: every step place (sqTick needs Kip within 2.6)
 try{SIDEQ.filter(q=>q.zone==='island').forEach(q=>q.steps.forEach((st,i)=>{const P=sqPos(st);if(!P){out.push({kind:'sideq',name:q.id+'#'+i,nopos:String(st.at),bad:true});return;}add('sideq',q.id+'#'+i+' '+st.l,P.x,P.z,2.6);}));}catch(e){out.push({err:'sideq '+e.message});}
 // every Rottnest postcard (album)
 try{PCS.filter(p=>p.zone==='island').forEach(p=>{let ps=[];try{ps=p.pos();}catch(e){}if(!ps.length)return;let best=null;ps.forEach(q=>{const r=reach(q[0],q[1]);if(best===null||r<best.r)best={q,r};});add('postcard',p.id,best.q[0],best.q[1],p.r);});}catch(e){}
 let quests=[];try{quests=QUESTS().filter(q=>q.open).map(q=>q.id+': '+q.title+' ['+q.steps.filter(s=>s[1]).length+'/'+q.steps.length+']');}catch(e){quests=['ERR '+e.message];}
 res({ibDone:typeof IBMAP!=='undefined'&&IBMAP.done,secs:(Date.now()-t0)/1000,said,quests,track:S.track,coins:S.coins,day:S.day,bad:out.filter(o=>o.bad),out});};
chk();})
