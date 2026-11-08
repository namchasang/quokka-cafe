  // Paul (Nov 2026): country drives 50% shorter. Past the northern suburbs (z < -250) every distance along the coast is halved:
// the height/land grid and the Blender bake are resampled, roads, towns, dunes and gates move with it. The city keeps its scale.
{const ZK=250,ZF=.5,f=z=>z>-ZK?z:-ZK+(z+ZK)*ZF,fi=z=>z>-ZK?z:-ZK+(z+ZK)/ZF,CE0=ND.CELL,NC0=ND.NW+1,NR0=ND.NR+1,b=atob(ND.b64),NR1=Math.ceil(-f(-ND.NR*CE0)/CE0);
  const row=r=>Math.max(0,Math.min(NR0-1,Math.round(-fi(-r*CE0)/CE0)));let o='';for(let r=0;r<=NR1;r++){const r0=row(r);o+=b.substr(r0*NC0,NC0);}ND.b64=btoa(o);ND.NR=NR1;
  const bk=OWBK.north;if(bk&&bk.w===NC0){const sb=atob(bk.b64),get=i=>{const v=sb.charCodeAt(i>>1);return(i&1)?v&15:v>>4;},n1=NC0*(NR1+1),arr=new Uint8Array(Math.ceil(n1/2));
    for(let r=0;r<=NR1;r++){const r0=Math.min(bk.h-1,row(r));for(let c=0;c<NC0;c++){const i=r*NC0+c,q=get(r0*NC0+c);arr[i>>1]|=(i&1)?q:(q<<4);}}
    let t='';for(let i=0;i<arr.length;i+=4096)t+=String.fromCharCode.apply(null,arr.subarray(i,i+4096));OWBK.north={w:NC0,h:NR1+1,b64:btoa(t)};}
  ND.roads.forEach(r=>r.p.forEach(p=>{p[1]=f(p[1]);}));ND.towns.forEach(t=>{t[2]=f(t[2]);});ND.dunes.forEach(d=>{if(d[1]<-ZK)d[3]*=ZF;d[1]=f(d[1]);});for(const k in ND.gates)ND.gates[k][1]=f(ND.gates[k][1]);ND.ZF={ZK,ZF};}
const NC=ND.NW+1,NRW=ND.NR+1,NN=NC*NRW,CE=ND.CELL,X0=ND.NX0,X1=X0+ND.NW*CE,ZMIN=-ND.NR*CE;
  const HB=new Float32Array(NN),LN=new Uint8Array(NN);{const b=atob(ND.b64);for(let i=0;i<NN;i++){const v=b.charCodeAt(i);LN[i]=v?1:0;HB[i]=v*.025;}}
  const bfs=src=>{const D=new Float32Array(NN).fill(1e9),q=new Int32Array(NN);let t=0;for(let i=0;i<NN;i++)if(src(i)){D[i]=0;q[t++]=i;}
    for(let h=0;h<t;h++){const i=q[h],c=i%NC,r=(i/NC)|0,d=D[i]+1;if(c>0&&D[i-1]>d){D[i-1]=d;q[t++]=i-1;}if(c<NC-1&&D[i+1]>d){D[i+1]=d;q[t++]=i+1;}if(r>0&&D[i-NC]>d){D[i-NC]=d;q[t++]=i-NC;}if(r<NRW-1&&D[i+NC]>d){D[i+NC]=d;q[t++]=i+NC;}}return D;};
  const DLn=bfs(i=>!LN[i]),DWn=bfs(i=>LN[i]===1),SD=new Float32Array(NN);
  for(let i=0;i<NN;i++){if(LN[i])SD[i]=(DLn[i]-.5)*CE;else{SD[i]=-(DWn[i]-.5)*CE;HB[i]=-.8-Math.min(DWn[i]*CE,12)*.12;}}
  const bil=(A,x,z)=>{let i=(x-X0)/CE,r=-z/CE;i=Math.max(0,Math.min(NC-1.001,i));r=Math.max(0,Math.min(NRW-1.001,r));const i0=i|0,r0=r|0,fx=i-i0,fz=r-r0,k=r0*NC+i0;return (A[k]*(1-fx)+A[k+1]*fx)*(1-fz)+(A[k+NC]*(1-fx)+A[k+NC+1]*fx)*fz;};
  const edge=x=>{x=Math.max(0,Math.min(WX-1.001,x));const x0=x|0,f=x-x0;return HG[x0]*(1-f)+HG[x0+1]*f;};
  const nH=(x,z)=>{const h=bil(HB,x,z);if(z>-16){const t=ss(-16,0,z);return h+(edge(x)-h)*t;}return h;};
  const BKN=owBakeDec(OWBK.north);
  // ---- roads: smoothed, the spurs snapped onto the main road ----
  const chaikin=(p,n)=>{for(let k=0;k<n;k++){const q=[p[0]];for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i];q.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}q.push(p[p.length-1]);p=q;}return p;};
  const NR2=ND.roads.map(r=>({n:r.n,main:!!r.main,p:r.p.map(q=>q.slice())}));const MR=NR2[0];MR.p=chaikin(MR.p,3);
  const nearOn=(P,x,z)=>{let b=null,bd=1e9,bs=0,acc=0;for(let i=1;i<P.length;i++){const a=P[i-1],c=P[i],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz)||1;let t=((x-a[0])*dx+(z-a[1])*dz)/(L*L);t=Math.max(0,Math.min(1,t));const px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;b=[px,pz];bs=acc+L*t;}acc+=L;}return{p:b,d:bd,s:bs};};
  NR2.slice(1).forEach(r=>{r.p[0]=nearOn(MR.p,r.p[0][0],r.p[0][1]).p;r.p=chaikin(r.p,2);});
  // the stretch inside today's map joins the city roads (ribbon, lamps, verges, the suburbs keep clear of it)
  let cut=MR.p.findIndex(q=>q[1]<0);if(cut<1)cut=1;
  const cityRoad={n:'Mitchell Fwy',p:MR.p.slice(0,cut+1)};
  NR2.forEach(r=>r.draw=r===MR?MR.p.slice(cut):r.p);
  const BS=40,BUCK={};NR2.forEach(r=>{for(let i=1;i<r.p.length;i++){const a=r.p[i-1],b=r.p[i],k0=Math.floor((Math.min(a[1],b[1])-8)/BS),k1=Math.floor((Math.max(a[1],b[1])+8)/BS);for(let k=k0;k<=k1;k++)(BUCK[k]||(BUCK[k]=[])).push([a,b,r]);}});
  const segNear=(x,z,w)=>{const L=BUCK[Math.floor(z/BS)];if(!L)return null;for(let i=0;i<L.length;i++){const s=L[i];if(segDist(x,z,s[0],s[1])<w)return s[2];}return null;};
  // road distance in km (real road distances from Perth: Lancelin turn-off 124 km, Pinnacles Drive 187 km, Cervantes 196 km)
  const sOf=(x,z)=>nearOn(MR.p,x,z).s;
  const TOWN=ND.towns.map(([n,x,z,k])=>({n,x,z,k,r:k==='city'?40:k==='town'?24:15}));
  const tw=n=>TOWN.find(t=>t.n===n);
  const S_L=sOf(...NR2.find(r=>r.n==='Lancelin Rd').p[0]),S_P=sOf(...NR2.find(r=>r.n==='Pinnacles Dr').p[0]);let S_E=0;for(let i=1;i<MR.p.length;i++)S_E+=Math.hypot(MR.p[i][0]-MR.p[i-1][0],MR.p[i][1]-MR.p[i-1][1]);
  const KM=s=>s<=S_L?s/S_L*124:s<=S_P?124+(s-S_L)/(S_P-S_L)*63:187+(s-S_P)/Math.max(1,S_E-S_P)*2;
  const spurKm=n=>{const r=NR2.find(r=>r.n===n);let L=0;for(let i=1;i<r.p.length;i++)L+=Math.hypot(r.p[i][0]-r.p[i-1][0],r.p[i][1]-r.p[i-1][1]);return {s:sOf(...r.p[0]),km:L*.045};};
  const DEST=[['Joondalup',sOf(tw('Joondalup').x,tw('Joondalup').z),0],['Yanchep',spurKm('Yanchep Beach Rd').s,spurKm('Yanchep Beach Rd').km],['Guilderton',spurKm('Guilderton Rd').s,spurKm('Guilderton Rd').km],
    ['Seabird',spurKm('Seabird Rd').s,spurKm('Seabird Rd').km],['Ledge Point',spurKm('Ledge Point Rd').s,spurKm('Ledge Point Rd').km],['Lancelin',S_L,3],['Pinnacles',S_P,2],['Cervantes',S_E,spurKm('Cervantes Rd').km]].map(([n,s,k])=>({n,s,km:Math.round(KM(s)+k)}));
  // ---- ground classes on the 4-unit grid: 0 sea 1 beach 2 white dunes 3 Pinnacles sand 4 coastal heath 5 banksia scrub 6 paddocks 7 town 8 suburbs ----
  const DUN=ND.dunes,CL=new Uint8Array(NN),SH=new Uint8Array(NN);
  const dunAt=(x,z)=>{for(const d of DUN){const q=Math.hypot((x-d[0])/d[2],(z-d[1])/d[3])+fbm(x/30+d[0],z/30)*.22;if(q<.92)return d[4]===1?2:3;}return 0;};
  const subAt=(x,z)=>z>-430+fbm(x/60,z/60)*70||Math.hypot((x-tw('Joondalup').x)/70,(z-tw('Joondalup').z)/90)<1;
  for(let r=0;r<NRW;r++)for(let c=0;c<NC;c++){const i=r*NC+c,x=X0+c*CE,z=-r*CE;let k=0,base=.6;
    if(LN[i]){const sd=SD[i],du=dunAt(x,z),n=fbm(x/55+3,z/55-7),big=fbm(x/140,z/140);
      if(du)k=du;else if(TOWN.some(t=>Math.hypot(x-t.x,z-t.z)<t.r*(.85+.3*fbm(x/20,z/20))&&t.k!=='city'))k=7;else if(subAt(x,z)&&sd>6)k=8;
      else if(sd<4)k=1;else if(sd<230+big*120)k=n>.1?5:4;else k=n>-.12?5:6;
      base=[.6,.6,.62,.62,.48,.46,.52,.56,.52][k]+big*.08;}
    CL[i]=k;SH[i]=Math.max(0,Math.min(255,base*255));}
  const clsAt=(x,z)=>{const c=Math.round((x-X0)/CE),r=Math.round(-z/CE);if(c<0||r<0||c>=NC||r>=NRW)return 0;return CL[r*NC+c];};
  NORTH={ZF:ND.ZF,X0,X1,ZMIN,CE,NC,NRW,roads:NR2,main:MR,cityRoad,town:TOWN,dest:DEST,dunes:DUN,gates:ND.gates,cls:clsAt,sd:(x,z)=>bil(SD,x,z),KM,sOf,
    H:nH,land:(x,z)=>x>X0+1&&x<X1-1&&z>ZMIN+2&&bil(SD,x,z)>0,
    onRoad:(x,z,w)=>!!segNear(x,z,w),roadAt:(x,z,w)=>segNear(x,z,w),
    data:{CL,SH,SD,BKN,HB}};
}
// minimap that scrolls with Kip once he is north of the city (same scale as the map: 1 px = 4 units)
