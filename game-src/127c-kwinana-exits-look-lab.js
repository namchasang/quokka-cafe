// ===== Kwinana exits (Look Lab ?ow2, Paul Nov 2026): no street crosses the Kwinana at grade; where one meets it, it splits into two curved slip roads that merge alongside the freeway (left-in, left-out) =====
if(OWR2&&O.KWP&&O.KWP.length>3)try{const KP=O.KWP,CUT=7.6;
  const KB=new Map(),kb=(x,z)=>Math.floor(x/6)*10007+Math.floor(z/6);for(let i=1;i<KP.length;i++){const a=KP[i-1],b=KP[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.5);for(let t=0;t<=n;t++){const p=[a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n,i];const k=kb(p[0],p[1]);(KB.get(k)||KB.set(k,[]).get(k)).push(p);}}
  const kwN=(x,z)=>{let m=1e9,best=null;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const L=KB.get((Math.floor(x/6)+dx)*10007+Math.floor(z/6)+dz);if(L)L.forEach(p=>{const d=Math.hypot(p[0]-x,p[1]-z);if(d<m){m=d;best=p;}});}return best?{d:m,p:best}:{d:1e9};};
  const RMP=[],cutK=new Set(['local','main','art','lane','street']);let nCut=0;
  const out=[];STREETS.forEach(s=>{const P=s.P;if(!P||!P.length)return;
    if(!cutK.has(s.kind)){if(kwN(P[0][0],P[0][1]).d<CUT+4)return;out.push(s);return;}
    if(!P.some(p=>kwN(p[0],p[1]).d<CUT)){out.push(s);return;}
    nCut++;const ri=ROUTES.indexOf(P);if(ri>=0)ROUTES.splice(ri,1);
    const runs=[];let cur=[],cutBefore=false;P.forEach(p=>{if(kwN(p[0],p[1]).d<CUT){if(cur.length){runs.push({P:cur,a:cutBefore,b:true});cur=[];}cutBefore=true;}else{if(!cur.length)cur.cut=cutBefore;cur.push(p);}});if(cur.length)runs.push({P:cur,a:cutBefore,b:false});
    runs.forEach(r=>{if(r.P.length>=2){const ns={P:r.P,kind:s.kind};out.push(ns);ROUTES.push(r.P);}
      // slip roads from each end that the freeway cut (main roads and through streets only, not house lanes)
      if(s.kind==='lane')return;[[r.a,0],[r.b,1]].forEach(([was,e])=>{if(!was)return;const E=e?r.P[r.P.length-1]:r.P[0];const k=kwN(E[0],E[1]);if(k.d>CUT+3)return;
        if(RMP.some(q=>Math.hypot(q[0]-E[0],q[1]-E[1])<6))return;RMP.push(E);const i=Math.max(1,Math.min(KP.length-1,k.p[2])),a=KP[i-1],b=KP[i];let tx=b[0]-a[0],tz=b[1]-a[1];const tl=Math.hypot(tx,tz)||1;tx/=tl;tz/=tl;
        let nx=E[0]-k.p[0],nz=E[1]-k.p[1];const nl=Math.hypot(nx,nz)||1;nx/=nl;nz/=nl;const F=k.p;
        [-1,1].forEach(sg=>{const P0=E,P1=[E[0]-nx*2.2+tx*sg*1.2,E[1]-nz*2.2+tz*sg*1.2],P3=[F[0]+nx*5.0+tx*sg*10,F[1]+nz*5.0+tz*sg*10],P2=[F[0]+nx*5.3+tx*sg*5.5,F[1]+nz*5.3+tz*sg*5.5];
          const R=[];for(let q=0;q<=10;q++){const u=q/10,v=1-u;R.push([v*v*v*P0[0]+3*v*v*u*P1[0]+3*v*u*u*P2[0]+u*u*u*P3[0],v*v*v*P0[1]+3*v*v*u*P1[1]+3*v*u*u*P2[1]+u*u*u*P3[1]]);}
          if(R.every(p=>landAt(p[0],p[1]))){out.push({P:R,kind:'ramp'});markLine(R,1.4,2);drvPaint(R,1.0,1);}});});});});
  STREETS.length=0;out.forEach(s=>STREETS.push(s));
  for(let i=SIGS.length-1;i>=0;i--){const v=SIGS[i];if(kwN(v.x,v.z).d<CUT+2)SIGS.splice(i,1);}
  O.kwExits=RMP;O.kwCut=nCut;console.log('OWLOG kwinana exits',nCut,'streets cut',RMP.length,'exits');}catch(e){console.error('kw exits',e);}
