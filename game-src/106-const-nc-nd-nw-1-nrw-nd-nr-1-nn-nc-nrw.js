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
  NORTH={X0,X1,ZMIN,CE,NC,NRW,roads:NR2,main:MR,cityRoad,town:TOWN,dest:DEST,dunes:DUN,gates:ND.gates,cls:clsAt,sd:(x,z)=>bil(SD,x,z),KM,sOf,
    H:nH,land:(x,z)=>x>X0+1&&x<X1-1&&z>ZMIN+2&&bil(SD,x,z)>0,
    onRoad:(x,z,w)=>!!segNear(x,z,w),roadAt:(x,z,w)=>segNear(x,z,w),
    data:{CL,SH,SD,BKN,HB}};
}
// minimap that scrolls with Kip once he is north of the city (same scale as the map: 1 px = 4 units)
NORTH.miniBase=null;
NORTH.mini=function(ctx,px,pz){const N=NORTH;if(!N.miniBase){const c=document.createElement('canvas'),w=N.NC,h=N.NRW;c.width=w;c.height=h;const x=c.getContext('2d'),id=x.createImageData(w,h);
    const C=[[34,84,110],[214,200,150],[238,236,228],[226,178,96],[112,126,92],[84,108,70],[160,150,92],[170,166,156],[120,150,84]];
    for(let r=0;r<h;r++)for(let i=0;i<w;i++){const k=N.data.CL[r*w+i],o=((h-1-r)*w+i)*4,v=N.data.SD[r*w+i]<0?C[0]:C[k];id.data.set([v[0],v[1],v[2],255],o);}x.putImageData(id,0,0);
    x.strokeStyle='#e8e0c8';x.lineWidth=1;N.roads.forEach(rd=>{x.beginPath();rd.p.forEach((p,i)=>{const X=(p[0]-N.X0)/4,Y=h-1+p[1]/4;i?x.lineTo(X,Y):x.moveTo(X,Y);});x.stroke();});
    N.town.forEach(t=>{x.fillStyle='#ffd34d';x.fillRect((t.x-N.X0)/4-1,h-1+t.z/4-1,3,3);});N.miniBase=c;}
  ctx.fillStyle='#22546e';ctx.fillRect(0,0,150,100);const ox=75-px/4,oy=50-pz/4;ctx.drawImage(mmBase,ox,oy);ctx.drawImage(N.miniBase,ox+N.X0/4,oy-(N.NRW-1)-.5);
  ctx.fillStyle='rgba(20,26,46,.75)';ctx.fillRect(0,88,150,12);ctx.fillStyle='#ffd34d';ctx.font='9px monospace';const km=Math.max(0,Math.round(N.KM(N.sOf(px,pz))));const nx=N.dest.find(d=>d.km>km+1);ctx.fillText(nx?`${km} km · ${nx.n} ${nx.km-km} km`:`${km} km from Perth`,4,97);};
NORTH.place=function(x,z){const N=NORTH;if(z>-2)return null;const sd=N.sd(x,z);if(sd<0)return['Indian Ocean','Turquoise water off the coast'];
  const t=N.town.find(t=>Math.hypot(x-t.x,z-t.z)<t.r+6);if(t)return[t.n,t.n==='Lancelin'?'Fishing town · white dunes to the north':t.n==='Cervantes'?'Crayfish town · the Pinnacles are close':'Coast town · '+Math.round(N.KM(N.sOf(t.x,t.z)))+' km from Perth'];
  const c=N.cls(x,z);if(c===3)return['The Pinnacles','Limestone spires in yellow sand'];if(c===2)return[Math.abs(z-N.gates.lan[1])<260?'Lancelin sand dunes':'White sand dunes','Bright white dunes shaped by the sea wind'];
  const r=N.roadAt(x,z,2.8);if(r){const km=Math.round(N.KM(N.sOf(x,z))),nx=N.dest.find(d=>d.km>km+1);return[r.main?(z>-1500?'Mitchell Fwy · Wanneroo Rd':'Indian Ocean Drive'):r.n,nx?`${km} km from Perth · ${nx.n} ${nx.km-km} km`:'Driving the coast road'];}
  return [['Beach','Indian Ocean'],['Beach','Soft sand and shells'],['White sand dunes',''],['The Pinnacles',''],['Coastal heath','Banksia, grass trees and wildflowers'],['Banksia scrub','Grass trees and banksias'],['Paddocks','Dry grass and old gums'],['Town',''],['Northern suburbs','Lawns, pools and wide streets']][c]||null;};

