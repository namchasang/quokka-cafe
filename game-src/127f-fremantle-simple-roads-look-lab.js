// ===== Fremantle roads made simple (Look Lab ?ow2, Paul 14 Nov 2026: "แผนผังถนนตรงช่วง Fremantle ปรับให้ง่ายไม่ซับซ้อน ถนนตรงไหนที่ไม่เชื่อมต่อกับถนนใหญ่ให้ลบทิ้งเลย") =====
// 1. the Fremantle grid keeps every second street (a 12-unit grid instead of 6), and the little lanes and cul-de-sacs round the town go;
// 2. any street in and around Fremantle that does not join a main road (city roads, highway ribbons, arterials, the Kwinana mains), directly
//    or through other streets, is removed, with its traffic route, turning circle and signals. Runs before the street ends/crossings part draws them.
if(OWR2&&O.inFreo)try{const OLD=/[?&#]freoold\b/.test(location.search+location.hash);/* &freoold shows the old layout for comparison */const FRT=TOWNS.find(t=>t.id==='freo');if(FRT){if(OLD){if(/[?&#]owdbg\b/.test(location.search+location.hash))window.__OWF={STREETS,ROUTES,SIGS,FRT,MAIN:[]};}else{
  const AREA=(x,z)=>O.inFreo(x,z,10),PIT=6,LK=new Set(['local','main','lane','street']);
  const segD=(x,z,a,b)=>segDist(x,z,a,b);
  const inArea=s=>s.P&&s.P.length>1&&s.P.filter(p=>AREA(p[0],p[1])).length>=s.P.length*.5;
  const st0=STREETS.length;let nGrid=0,nLane=0,nLoose=0,nMark=0,nSig=0;const gone=new Set();
  // 1. simplify: odd grid lines and lanes go
  STREETS.forEach(s=>{if(!inArea(s))return;
    if(s.freo){const P=s.P,h=Math.abs(P[0][1]-P[P.length-1][1])<.01,v=Math.abs(P[0][0]-P[P.length-1][0])<.01;const k=h?Math.round((P[0][1]-FRT.z)/PIT):v?Math.round((P[0][0]-FRT.x)/PIT):0;if(k%2!==0){gone.add(s);nGrid++;}return;}
    if(s.kind==='lane'){gone.add(s);nLane++;}});
  // 2. keep only streets joined to a main road
  const MAIN=[];RIBS.forEach(r=>{if(r.m&&r.m.visible&&!r.hidden&&r.w>2.5&&r.P2)MAIN.push(r.P2);});ROADS.forEach(r=>{if(r.p)MAIN.push(r.p);});
  STREETS.forEach(s=>{if(s.kind==='art'||(s.kind==='main'&&!s.freo))if(s.P&&s.P.length>1)MAIN.push(s.P);});
  const MB=new Map(),bk=(x,z)=>Math.floor(x/4)*100003+Math.floor(z/4);const addB=(P,tag,map)=>{for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));for(let t=0;t<=n;t++){const k=bk(a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n);let L=map.get(k);if(!L)map.set(k,L=[]);L.push([a,b,tag]);}}};
  MAIN.forEach(P=>addB(P,null,MB));
  const near=(map,x,z,r,fn)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=map.get((Math.floor(x/4)+a)*100003+Math.floor(z/4)+b);if(L)for(const e of L)if(segD(x,z,e[0],e[1])<r&&fn(e[2]))return true;}return false;};
  const C=STREETS.filter(s=>inArea(s)&&LK.has(s.kind)&&!gone.has(s)&&!(s.kind==='main'&&!s.freo));
  const SB=new Map();C.forEach(s=>addB(s.P,s,SB));
  const touches=(s,map,fn,r)=>s.P.some(p=>near(map,p[0],p[1],r,fn));
  const ok=new Set(),q=[];C.forEach(s=>{if(touches(s,MB,()=>true,2.2)){ok.add(s);q.push(s);}});
  while(q.length){const s=q.pop();for(const p of s.P){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=SB.get((Math.floor(p[0]/4)+a)*100003+Math.floor(p[1]/4)+b);if(L)for(const e of L){const t=e[2];if(ok.has(t))continue;if(segD(p[0],p[1],e[0],e[1])<1.6){ok.add(t);q.push(t);}}}}}
  C.forEach(s=>{if(!ok.has(s)){gone.add(s);nLoose++;}});
  // remove them, their routes, and the round/junction markers and signals that only served them
  const keptB=new Map();STREETS.forEach(s=>{if(!gone.has(s)&&s.P&&s.P.length>1)addB(s.P,s,keptB);});MAIN.forEach(P=>addB(P,null,keptB));
  const goneB=new Map();gone.forEach(s=>addB(s.P,s,goneB));
  for(let i=STREETS.length-1;i>=0;i--){const s=STREETS[i];
    if(gone.has(s)){STREETS.splice(i,1);const ri=ROUTES.indexOf(s.P);if(ri>=0)ROUTES.splice(ri,1);continue;}
    if(s.P&&s.P.length===1&&AREA(s.P[0][0],s.P[0][1])){const[x,z]=s.P[0];if(near(goneB,x,z,2.5,()=>true)&&!near(keptB,x,z,1.2,()=>true)){STREETS.splice(i,1);nMark++;}}}
  for(let i=SIGS.length-1;i>=0;i--){const v=SIGS[i];if(!AREA(v.x,v.z))continue;const arms=new Set();for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=keptB.get((Math.floor(v.x/4)+a)*100003+Math.floor(v.z/4)+b);if(L)for(const e of L)if(segD(v.x,v.z,e[0],e[1])<2)arms.add(e[2]||e[0]);}if(arms.size<2){SIGS.splice(i,1);nSig++;}}
  O.freoSimple={before:st0,grid:nGrid,lanes:nLane,loose:nLoose,markers:nMark,signals:nSig,after:STREETS.length};console.log('OWLOG freo simple',JSON.stringify(O.freoSimple));
  if(/[?&#]owdbg\b/.test(location.search+location.hash))window.__OWF={STREETS,ROUTES,SIGS,FRT,MAIN};}}}catch(e){console.error('freo simple',e);}
