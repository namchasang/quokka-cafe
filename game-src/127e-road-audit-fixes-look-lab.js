// ===== road audit fixes (Look Lab ?ow2, Paul Nov 2026, from the audit agent's drive-through) =====
// 1. main roads cut by the Mitchell are joined across it on bridges (like the Kwinana); 2. a street end that stops a few units short of another road
// runs on to meet it; a residential street that still ends in nothing gets a small turning circle
if(OWR2)try{const nrm=(dx,dz)=>{const l=Math.hypot(dx,dz)||1;return[dx/l,dz/l];};
  // 1. across the Mitchell
  if(MP&&O.brg){const MB=new Map(),mk=(x,z)=>Math.floor(x/6)*10007+Math.floor(z/6);for(let i=1;i<MP.length;i++){const a=MP[i-1],b=MP[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.5);for(let t=0;t<=n;t++){const p=[a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n];const k=mk(p[0],p[1]);(MB.get(k)||MB.set(k,[]).get(k)).push(p);}}
    const mpD=(x,z)=>{let m=1e9;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const L=MB.get((Math.floor(x/6)+a)*10007+Math.floor(z/6)+b);if(L)L.forEach(p=>{m=Math.min(m,Math.hypot(p[0]-x,p[1]-z));});}return m;};
    const A=STREETS.filter(s=>s.kind==='art'&&s.P.length>2),ends=[];A.forEach(s=>[0,1].forEach(e=>{const P=s.P,p=e?P[P.length-1]:P[0],q=e?P[P.length-3]:P[2];if(mpD(p[0],p[1])<18){const d=nrm(p[0]-q[0],p[1]-q[1]);ends.push({s,e,p,dx:d[0],dz:d[1]});}}));let nJ=0;
    ends.forEach(a=>{if(a.used)return;let best=null;ends.forEach(b=>{if(b===a||b.used||b.s===a.s)return;const vx=b.p[0]-a.p[0],vz=b.p[1]-a.p[1],L=Math.hypot(vx,vz);if(L>40||L<4)return;if((vx*a.dx+vz*a.dz)/L<.9||-(vx*b.dx+vz*b.dz)/L<.9)return;let mid=false;for(let t=.15;t<.85;t+=.05)if(mpD(a.p[0]+vx*t,a.p[1]+vz*t)<4)mid=true;if(mid&&(!best||L<best.L))best={b,L};});
      if(!best)return;const b=best.b;ends.forEach(x=>{if(x.s===a.s||x.s===b.s)x.used=1;});const PA=a.e?a.s.P:a.s.P.slice().reverse(),PB=b.e?b.s.P.slice().reverse():b.s.P,n=Math.ceil(best.L),fill=[];for(let t=1;t<n;t++)fill.push([a.p[0]+(b.p[0]-a.p[0])*t/n,a.p[1]+(b.p[1]-a.p[1])*t/n]);
      const ri=ROUTES.indexOf(b.s.P);if(ri>=0)ROUTES.splice(ri,1);const ra=ROUTES.indexOf(a.s.P);a.s.P=PA.concat(fill,PB);if(ra>=0)ROUTES[ra]=a.s.P;STREETS.splice(STREETS.indexOf(b.s),1);
      let bi=0,bd=1e9;fill.forEach((p,i)=>{const d=mpD(p[0],p[1]);if(d<bd){bd=d;bi=i;}});const c=fill[bi]||a.p,d=nrm(b.p[0]-a.p[0],b.p[1]-a.p[1]);O.brg.push({x:c[0],z:c[1],dx:d[0],dz:d[1]});nJ++;});O.mpJoined=nJ;}
  // 2. stubs and loose ends
  const LK=new Set(['local','main','art','lane','ramp','street']),HW={art:3.25,main:1.5,local:1.25,lane:.5,ramp:.8,street:1.25};const SB=new Map(),sk=(x,z)=>Math.floor(x/4)*100003+Math.floor(z/4);
  const addSeg=(a,b,w,own)=>{const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3));for(let t=0;t<=n;t++){const x=a[0]+(b[0]-a[0])*t/n,z=a[1]+(b[1]-a[1])*t/n,k=sk(x,z);let L=SB.get(k);if(!L)SB.set(k,L=[]);const last=L[L.length-1];if(!last||last[0]!==a||last[1]!==b)L.push([a,b,w,own]);}};
  STREETS.forEach(s=>{if(!LK.has(s.kind)||!s.P||s.P.length<2)return;for(let i=1;i<s.P.length;i++)addSeg(s.P[i-1],s.P[i],HW[s.kind],s);});RIBS.forEach(r=>{if(r.hidden||!r.P2||(r.m&&r.m.visible===false))return;for(let i=1;i<r.P2.length;i++)addSeg(r.P2[i-1],r.P2[i],r.w/2,r);});
  const hitAt=(x,z,own,slack)=>{let best=null;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=SB.get((Math.floor(x/4)+a)*100003+Math.floor(z/4)+b);if(!L)continue;for(const g of L){if(g[3]===own)continue;const d=segDist(x,z,g[0],g[1]);if(d<g[2]+slack&&(!best||d<best.d))best={d,g};}}return best;};
  const nearFwy=(x,z)=>(MP&&fwD(x,z)<9)||(O.KWP&&O.KWP.some(p=>Math.abs(p[0]-x)<9&&Math.abs(p[1]-z)<9&&Math.hypot(p[0]-x,p[1]-z)<9));
  const bulbs=STREETS.filter(s=>s.kind==='bulb'||s.kind==='abulb').map(s=>s.P[0]);let nExt=0,nBulb=0;const add=[];
  STREETS.forEach(s=>{if(!LK.has(s.kind)||!s.P||s.P.length<2||s.kind==='lane')return;[0,1].forEach(e=>{const P=s.P,p=e?P[P.length-1]:P[0],q=e?P[P.length-2]:P[1];if(hitAt(p[0],p[1],s,.5))return;if(bulbs.some(b=>Math.hypot(b[0]-p[0],b[1]-p[1])<1.5))return;
    const d=nrm(p[0]-q[0],p[1]-q[1]);let hit=-1;for(let t=.5;t<=6.5;t+=.5){const x=p[0]+d[0]*t,z=p[1]+d[1]*t;if(!landAt(x,z)&&z>=0&&z<WZ)break;const h=hitAt(x,z,s,0);if(h){hit=t+Math.min(1,h.g[2]*.5);break;}}
    if(hit>0){const ext=[];for(let t=Math.min(1,hit);t<=hit+.01;t+=1)ext.push([p[0]+d[0]*t,p[1]+d[1]*t]);if(ext.length){s.P=e?P.concat(ext):ext.reverse().concat(P);nExt++;}return;}
    if((s.kind==='local'||s.kind==='main')&&landAt(p[0],p[1])&&!nearFwy(p[0],p[1])){add.push({P:[[p[0],p[1]]],kind:'bulb'});nBulb++;}});});
  add.forEach(s=>STREETS.push(s));O.auditFix={extended:nExt,bulbs:nBulb,mpBridges:O.mpJoined||0};console.log('OWLOG audit fixes',JSON.stringify(O.auditFix));}catch(e){console.error('audit fixes',e);}
