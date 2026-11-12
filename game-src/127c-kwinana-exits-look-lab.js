// ===== Kwinana exits (Look Lab ?ow2, Paul Nov 2026): no street crosses the Kwinana at grade; where one meets it, it splits into two curved slip roads that merge alongside the freeway (left-in, left-out) =====
if(OWR2&&O.KWP&&O.KWP.length>3)try{const KP=O.KWP,CUT=7.6;
  const KB=new Map(),kb=(x,z)=>Math.floor(x/6)*10007+Math.floor(z/6);for(let i=1;i<KP.length;i++){const a=KP[i-1],b=KP[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.5);for(let t=0;t<=n;t++){const p=[a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n,i];const k=kb(p[0],p[1]);(KB.get(k)||KB.set(k,[]).get(k)).push(p);}}
  const kwN=(x,z)=>{let m=1e9,best=null;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const L=KB.get((Math.floor(x/6)+dx)*10007+Math.floor(z/6)+dz);if(L)L.forEach(p=>{const d=Math.hypot(p[0]-x,p[1]-z);if(d<m){m=d;best=p;}});}return best?{d:m,p:best}:{d:1e9};};
  const BRG=[];O.brg=BRG;O.brLift=(x,z)=>{let m=0;for(const b of BRG){const ox=x-b.x,oz=z-b.z,s=ox*b.dx+oz*b.dz,d=Math.abs(-ox*b.dz+oz*b.dx);if(d>3.5||Math.abs(s)>21)continue;const k=Math.max(0,Math.min(1,(21-Math.abs(s))/13));m=Math.max(m,2.7*k*k*(3-2*k));}return m;};
  const RMP=[],cutK=new Set(['local','main','art','lane','street']);let nCut=0;
  /* main roads that stop either side of the Kwinana are joined across it (then bridged below) */
  {const A=STREETS.filter(s=>s.kind==='art'&&s.P.length>2),ends=[];A.forEach(s=>[0,1].forEach(e=>{const P=s.P,p=e?P[P.length-1]:P[0],q=e?P[P.length-3]:P[2];const k=kwN(p[0],p[1]);if(k.d<16){let dx=p[0]-q[0],dz=p[1]-q[1];const l=Math.hypot(dx,dz)||1;ends.push({s,e,p,dx:dx/l,dz:dz/l});}}));let nJ=0;
    ends.forEach(a=>{if(a.used)return;let best=null;ends.forEach(b=>{if(b===a||b.used||b.s===a.s)return;const vx=b.p[0]-a.p[0],vz=b.p[1]-a.p[1],L=Math.hypot(vx,vz);if(L>34||L<4)return;const al=(vx*a.dx+vz*a.dz)/L,bl=-(vx*b.dx+vz*b.dz)/L;if(al<.93||bl<.93)return;let mid=false;for(let t=.2;t<.8;t+=.1)if(kwN(a.p[0]+vx*t,a.p[1]+vz*t).d<4)mid=true;if(!mid)return;if(!best||L<best.L)best={b,L};});
      if(!best)return;const b=best.b;ends.forEach(x=>{if(x.s===a.s||x.s===b.s)x.used=1;});const PA=a.e?a.s.P:a.s.P.slice().reverse(),PB=b.e?b.s.P.slice().reverse():b.s.P,n=Math.ceil(best.L),fill=[];for(let t=1;t<n;t++)fill.push([a.p[0]+(b.p[0]-a.p[0])*t/n,a.p[1]+(b.p[1]-a.p[1])*t/n]);
      const ri=ROUTES.indexOf(b.s.P);if(ri>=0)ROUTES.splice(ri,1);const ra=ROUTES.indexOf(a.s.P);a.s.P=PA.concat(fill,PB);if(ra>=0)ROUTES[ra]=a.s.P;STREETS.splice(STREETS.indexOf(b.s),1);nJ++;});/* an end with no partner runs straight on over the freeway to the first road on the far side */
    const hitAt=(x,z,self)=>{for(const t of STREETS){if(t===self||!t.P||t.P.length<2||t.kind==='ramp'||t.kind==='bulb'||t.kind==='abulb')continue;for(let i=1;i<t.P.length;i++)if(segDist(x,z,t.P[i-1],t.P[i])<1.2)return true;}for(const r of RIBS){if(r.hidden||!r.P2)continue;for(let i=1;i<r.P2.length;i++)if(segDist(x,z,r.P2[i-1],r.P2[i])<r.w/2)return true;}return false;};
    ends.forEach(a=>{if(a.used)return;let crossed=false,hit=-1;for(let t=1;t<=44;t+=.5){const x=a.p[0]+a.dx*t,z=a.p[1]+a.dz*t;if(!landAt(x,z)&&z<WZ)break;if(kwN(x,z).d<3)crossed=true;else if(crossed&&kwN(x,z).d>7.5&&hitAt(x,z,a.s)){hit=t;break;}}
      if(hit<0)return;const ext=[];for(let t=1;t<=hit;t+=1)ext.push([a.p[0]+a.dx*t,a.p[1]+a.dz*t]);const ra=ROUTES.indexOf(a.s.P);a.s.P=a.e?a.s.P.concat(ext):ext.reverse().concat(a.s.P);if(ra>=0)ROUTES[ra]=a.s.P;a.used=1;nJ++;});
    O.kwJoined=nJ;O.kwEnds=ends.map(e=>[+e.p[0].toFixed(1),+e.p[1].toFixed(1),+e.dx.toFixed(2),+e.dz.toFixed(2),+kwN(e.p[0],e.p[1]).d.toFixed(1)]);}
  const out=[];STREETS.forEach(s=>{const P=s.P;if(!P||!P.length)return;
    if(!cutK.has(s.kind)){if(kwN(P[0][0],P[0][1]).d<CUT+4)return;out.push(s);return;}
    if(!P.some(p=>kwN(p[0],p[1]).d<CUT)){out.push(s);return;}
    if(s.kind==='art'){/* Paul Nov 2026: a main road goes over the Kwinana on a bridge */let bi=0,bd=1e9;P.forEach((p,i)=>{const d=kwN(p[0],p[1]).d;if(d<bd){bd=d;bi=i;}});const a=P[Math.max(0,bi-2)],b=P[Math.min(P.length-1,bi+2)];let dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;BRG.push({x:P[bi][0],z:P[bi][1],dx:dx/l,dz:dz/l});out.push(s);return;}
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
