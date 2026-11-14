new Promise(res=>{const t0=Date.now();
const chk=()=>{if((typeof IBMAP!=='undefined'&&IBMAP.done)||Date.now()-t0>300000)go();else setTimeout(chk,1000);};
const go=()=>{const out=[];const L=(x,z)=>{try{return +IBMAP.landD(x,z).toFixed(2);}catch(e){return null;}};
 const reach=(x,z)=>{try{if(!blocked(x,z))return 0;for(let r=.5;r<=8;r+=.5)for(let a=0;a<16;a++){const X=x+Math.cos(a/16*6.283)*r,Z=z+Math.sin(a/16*6.283)*r;if(!blocked(X,Z))return r;}return 99;}catch(e){return 'err';}};
 const add=(kind,name,x,z)=>{if(typeof x!=='number'||zoneOf(x)!=='island')return;out.push([kind,name,+x.toFixed(1),+z.toFixed(1),L(x,z),reach(x,z)]);};
 MAP_LABELS.forEach(l=>add('label',l[0],l[1],l[2]));
 PCS.forEach(p=>{let ps=[];try{ps=p.pos?p.pos():[];}catch(e){}const id=p.id||p[0];(ps||[]).forEach((q,i)=>add('postcard',id+(i?'#'+i:''),q[0],q[1]));});
 FISH_SPOTS.forEach(f=>add('fish',f.name,f.x,f.z));
 LOOKOUTS.forEach(l=>{try{const q=l.near();add('lookout',l.name,q[0],q[1]);}catch(e){}});
 SHELLS.forEach((s,i)=>add('shell','glow'+i,s.x,s.z));
 COACH.forEach(c=>add('bus',c.name,c.x,c.z));
 try{[['gus',gus],['wren',wren]].forEach(([n,o])=>add('npc',n,o.x,o.z));}catch(e){}
 res({ibDone:typeof IBMAP!=='undefined'&&IBMAP.done,secs:(Date.now()-t0)/1000,n:out.length,out});};
try{startGame(null);}catch(e){}chk();})
