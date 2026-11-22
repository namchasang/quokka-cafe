// Café deck probe (Paul 22 Nov 2026: Kip gets stuck walking on the café deck). Run inside __t.html:
//   QA_JS="$(cat tools/qa-deck.js)" node tools/qa-player.mjs <outDir> probe
// Scans the deck on a 0.2 grid and lists the points where blocked() is true although no old collider covers them,
// grouped by which rule blocks (old rules, builder map path rule), then walks Kip across the deck in 8 directions.
new Promise(res=>{const t0=Date.now();
const chk=()=>{if((typeof IBMAP!=='undefined'&&IBMAP.done)||Date.now()-t0>300000)go();else setTimeout(chk,1000);};
const go=()=>{try{localStorage.clear();}catch(e){}try{startGame({});}catch(e){}
 setTimeout(()=>{const out={deck:{...DECK},cells:0,blockedCells:0,byCol:0,free:[],bad:[],walks:[]};
  const r=.28;const colAt=(x,z)=>colliders.some(b=>x>b.x1-r&&x<b.x2+r&&z>b.z1-r&&z<b.z2+r);
  for(let x=DECK.x1+.3;x<DECK.x2-.3;x+=.2)for(let z=DECK.z1+.3;z<DECK.z2-.3;z+=.2){out.cells++;if(!blocked(x,z))continue;out.blockedCells++;if(colAt(x,z)){out.byCol++;continue;}
   let m=null;try{const mm=IBMAP.toMap?IBMAP.toMap(x,z):null;m=mm;}catch(e){}out.bad.push([+x.toFixed(1),+z.toFixed(1)]);}
  /* walk test: from the counter front, push Kip each way for 3 s of game time with the real updatePlayer */
  const cx=(DECK.x1+DECK.x2)/2,cz=(DECK.z1+DECK.z2)/2+1;const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
  for(const [dx,dz] of dirs){player.x=cx;player.z=cz;player.bike=false;let moved=0,px=player.x,pz=player.z;const k=[];
   if(dx>0)k.push('d');if(dx<0)k.push('a');if(dz>0)k.push('s');if(dz<0)k.push('w');k.forEach(q=>keys.add(q));
   for(let i=0;i<90;i++){updatePlayer(1/30);moved+=Math.hypot(player.x-px,player.z-pz);px=player.x;pz=player.z;}
   k.forEach(q=>keys.delete(q));out.walks.push({dir:[dx,dz],moved:+moved.toFixed(2),end:[+player.x.toFixed(2),+player.z.toFixed(2)],stuckAt:blocked(player.x,player.z)});}
  out.badSample=out.bad.slice(0,40);out.bad=out.bad.length;res(out);},4000);};chk();})
