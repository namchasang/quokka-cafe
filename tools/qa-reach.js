// Reach probe for a returning player: run inside __t.html with tools/qa-player.mjs probe mode:
//   QA_JS="$(cat tools/qa-reach.js)" node tools/qa-player.mjs <outDir> probe
// Loads an advanced save (everything unlocked), then lists every interaction target the game offers in explore time
// (buildTargets(), read with Kip standing at a grid of points over each town) and checks Kip can walk within the
// target's radius (blocked()). Also rolls 10 days of dig spots and beach bottles (setupDay) and checks them.
new Promise(res=>{const t0=Date.now();
const chk=()=>{if((typeof IBMAP!=='undefined'&&IBMAP.done)||Date.now()-t0>300000)go();else setTimeout(chk,1000);};
const go=()=>{const errs=[];const E=(k,f)=>{try{return f();}catch(e){errs.push(k+': '+e.message);return undefined;}};
 try{localStorage.clear();}catch(e){}
 E('startGame',()=>startGame(null));save=function(){};requestAnimationFrame=()=>0;
 E('state',()=>{Object.assign(S,{day:30,coins:25000,servedTotal:900,metGus:true,metMei:true,quest:3,jetty:3,staff:3,pass:true,time:1000,wx:0,
   wish:Object.assign({},S.wish,{room:true,tickets:true,machine:true}),qg:Object.assign({},S.qg,{planted:1,sold:1,village:1,coach_geordie:1}),boats:{fishing:1}});});
 const reach=(x,z)=>{if(!blocked(x,z))return 0;for(let r=.25;r<=8;r+=.25)for(let a=0;a<24;a++){const X=x+Math.cos(a/24*6.283)*r,Z=z+Math.sin(a/24*6.283)*r;if(!blocked(X,Z))return r;}return 99;};
 const seen={},out=[];
 const towns={island:[-200,-60,80,60],sp:[110,-40,200,50],freo:[260,-40,340,40],hi:[395,-25,450,25],vp:[480,-25,570,25]};
 Object.entries(towns).forEach(([zn,[x1,z1,x2,z2]])=>{for(let x=x1;x<=x2;x+=12)for(let z=z1;z<=z2;z+=12){player.x=x;player.z=z;
   const T=E('targets',()=>buildTargets())||[];T.forEach(t=>{if(typeof t.x!=='number'||typeof t.z!=='number')return;const k=zn+'|'+t.label+'|'+t.x.toFixed(0)+','+t.z.toFixed(0);if(seen[k])return;seen[k]=1;
     const r=E('reach',()=>reach(t.x,t.z));const need=t.r||1.2;out.push({zone:zn,label:String(t.label).slice(0,70),x:+t.x.toFixed(1),z:+t.z.toFixed(1),r:need,reach:r,bad:typeof r==='number'&&r>need});});}});
 const digs=[];for(let d=30;d<40;d++){S.day=d;S.dt=null;E('setupDay',()=>setupDay());const ds=(S.digs||[]).map(q=>reach(q.x,q.z));const b=S.bottle;digs.push({day:d,digs:(S.digs||[]).length,digBad:ds.filter(r=>r>1.2).length,bottle:b?{x:+b.x.toFixed(1),z:+b.z.toFixed(1),land:+landD(b.x,b.z).toFixed(2),reach:reach(b.x,b.z)}:null,dtasks:(S.dtasks||[]).join(',')});}
 res({secs:(Date.now()-t0)/1000,n:out.length,bad:out.filter(o=>o.bad),digs,errs:[...new Set(errs)].slice(0,30),byZone:Object.fromEntries(Object.keys(towns).map(z=>[z,out.filter(o=>o.zone===z).length]))});};
chk();})
