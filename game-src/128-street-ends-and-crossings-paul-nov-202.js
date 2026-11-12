// ---- street ends and crossings (Paul, Nov 2026: no notches): a street that meets an arterial gets an asphalt apron across the arterial's verge
// and footpath; a short gap to the road it faces is closed; a street crossing another gets an apron; a true dead end gets a turning circle ----
const APR=[];O.subAprons=APR;
{const SL=STREETS.filter(s=>s.P.length>1&&(s.kind==='local'||s.kind==='main'||s.kind==='lane'||s.kind==='art'));
  const half=s=>s.kind==='art'?3.25:s.kind==='lane'?.4:s.kind==='main'?1.5:1.25,asw=s=>s.kind==='lane'?.8:s.kind==='main'?1.65:1.375;
  const BKS=new Map(),bk2=(x,z)=>Math.floor(x/12)*100003+Math.floor(z/12);SL.forEach(s=>{for(let i=1;i<s.P.length;i++){const a=s.P[i-1],b=s.P[i];for(let x=Math.floor((Math.min(a[0],b[0])-6)/12);x<=Math.floor((Math.max(a[0],b[0])+6)/12);x++)for(let z=Math.floor((Math.min(a[1],b[1])-6)/12);z<=Math.floor((Math.max(a[1],b[1])+6)/12);z++){const k=x*100003+z;let L=BKS.get(k);if(!L)BKS.set(k,L=[]);L.push([a,b,s]);}}});
  const near=(x,z,skip,lim)=>{let best=null;const L=BKS.get(bk2(x,z))||[];for(const g of L){if(g[2]===skip)continue;const a=g[0],b=g[1],dx=b[0]-a[0],dz=b[1]-a[1],LL=dx*dx+dz*dz;let t=LL?((x-a[0])*dx+(z-a[1])*dz)/LL:0;t=Math.max(0,Math.min(1,t));const px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(x-px,z-pz);if(d<lim&&(!best||d<best.d))best={d,p:[px,pz],s:g[2]};}
    const rb=ribNear(x,z,lim);if(rb&&(!best||rb.d<best.d))best={d:rb.d,p:rb.p,rib:rb.w};return best;};
  const bulbs=STREETS.filter(s=>s.kind==='bulb').map(s=>s.P[0]);let nA=0,nX=0,nB=0,nC=0;
  SL.forEach(s=>{if(s.kind==='art')return;[0,1].forEach(end=>{const i=end?s.P.length-1:0,j=end?s.P.length-2:1,e=s.P[i],q=s.P[j];if(bulbs.some(b=>Math.hypot(b[0]-e[0],b[1]-e[1])<.6))return;
    const l=Math.hypot(e[0]-q[0],e[1]-q[1])||1,dx=(e[0]-q[0])/l,dz=(e[1]-q[1])/l;
    // what does this end meet: look along the street and sideways
    let m=near(e[0],e[1],s,6);
    if(!m){for(let t=.5;t<=4.5&&!m;t+=.5){const x=e[0]+dx*t,z=e[1]+dz*t;const k=near(x,z,s,.6);if(k)m=k;}}
    if(m&&m.d>.2&&!landRun(e,m.p))m=null;
    if(!m){if(s.kind!=='lane'){STREETS.push({P:[e.slice()],kind:'bulb'});markRect(e[0],e[1],0,3.2,3.2,2);}else STREETS.push({P:[e.slice()],kind:'xpad',r:.7});nB++;return;}
    const oh=m.rib?m.rib/2:half(m.s);let nx=e[0]-m.p[0],nz=e[1]-m.p[1],nl=Math.hypot(nx,nz);if(nl<.2){nx=-dx;nz=-dz;nl=1;}nx/=nl;nz/=nl;
    // close a gap: run the street on to the other road
    const reach=m.rib?Math.max(.6,oh-.5):m.s.kind==='art'?(OWR2?1.55:3.0):s.kind==='lane'?Math.max(.2,oh-.6):oh+.1;
    if(m.d>reach+.05){const to=[m.p[0]+nx*reach,m.p[1]+nz*reach],L=Math.hypot(to[0]-e[0],to[1]-e[1]),n=Math.max(1,Math.ceil(L)),add=[];for(let k=1;k<=n;k++)add.push([e[0]+(to[0]-e[0])*k/n,e[1]+(to[1]-e[1])*k/n]);if(i===0)s.P.unshift(...add.reverse());else s.P.push(...add);markLine(add,1.6,2);nC++;}
    // the apron over the arterial's verge and footpath (or a small one where a lane meets a street)
    if(m.s&&m.s.kind==='art'){const a0=OWR2?1.45:2.3,a1=Math.max(3.45,Math.min(m.d,4.5)),c=(a0+a1)/2;APR.push([m.p[0]+nx*c,m.p[1]+nz*c,a1-a0,asw(s)+.35,Math.atan2(nx,nz)]);nA++;}
    else if(m.rib){const c=m.rib/4;APR.push([m.p[0]+nx*c,m.p[1]+nz*c,m.rib/2+.1,asw(s)+.6,Math.atan2(nx,nz),1]);nA++;}
    else if(m.s&&(m.s.kind==='local'||m.s.kind==='main')&&(s.kind==='local'||s.kind==='main')){const L=3;STREETS.push({P:[[m.p[0]+nx*L/2,m.p[1]+nz*L/2]],kind:'tj',ang:Math.atan2(nx,nz),w:s.kind==='main'?3:2.5,L});nA++;}// a proper tee (Paul, Nov 2026)
    else if(s.kind==='lane'&&m.s){const a0=Math.max(0,oh-.75),a1=oh+.35,c=(a0+a1)/2;APR.push([m.p[0]+nx*c,m.p[1]+nz*c,a1-a0,1.0,Math.atan2(nx,nz)]);nA++;}});});
  // streets crossing streets (not at their ends): an apron disc over the kerbs
  for(let a=0;a<SL.length;a++){const s=SL[a];if(s.kind==='art')continue;for(let i=1;i<s.P.length;i++){const p=s.P[i-1],r=[s.P[i][0]-p[0],s.P[i][1]-p[1]];const L=BKS.get(bk2(p[0],p[1]))||[];
    for(const g of L){const t2=g[2];if(t2===s||t2.kind==='art'||SL.indexOf(t2)<a)continue;const q=g[0],u=[g[1][0]-q[0],g[1][1]-q[1]],den=r[0]*u[1]-r[1]*u[0];if(Math.abs(den)<1e-6)continue;
      const tt=((q[0]-p[0])*u[1]-(q[1]-p[1])*u[0])/den,uu=((q[0]-p[0])*r[1]-(q[1]-p[1])*r[0])/den;if(tt<0||tt>1||uu<0||uu>1)continue;const x=p[0]+r[0]*tt,z=p[1]+r[1]*tt;
      if(STREETS.some(o=>(o.kind==='xpad'||o.kind==='rab'||o.kind==='xst'||o.kind==='mrab'||o.kind==='fx')&&Math.hypot(o.P[0][0]-x,o.P[0][1]-z)<1.5))continue;
      // Paul (Nov 2026, from his photos): lanes meet at a small roundabout; streets cross at a crossroads with zebras and stop lines
      if(s.freo&&t2.freo&&!(s.kind==='main'||t2.kind==='main')){STREETS.push({P:[[x,z]],kind:'fx',a:Math.atan2(r[0],r[1])});nX++;continue;}/* Fremantle grid: plain crossings, zebras only on the main street */
      if(s.kind==='lane'||t2.kind==='lane')STREETS.push({P:[[x,z]],kind:'mrab',r:Math.max(half(s),half(t2))+.75});
      else STREETS.push({P:[[x,z]],kind:'xst',a1:Math.atan2(r[0],r[1]),a2:Math.atan2(u[0],u[1]),w1:s.kind==='main'?3:2.5,w2:t2.kind==='main'?3:2.5});nX++;}}}
  // streets that cross a highway: a junction box over the crossing
  SL.forEach(s=>{if(s.kind==='art')return;for(let i=1;i<s.P.length;i++){const p=s.P[i-1],r=[s.P[i][0]-p[0],s.P[i][1]-p[1]];for(const R of RIBX){const P=R.P;for(let k=1;k<P.length;k++){const q=P[k-1],u=[P[k][0]-q[0],P[k][1]-q[1]],den=r[0]*u[1]-r[1]*u[0];if(Math.abs(den)<1e-6)continue;
    const tt=((q[0]-p[0])*u[1]-(q[1]-p[1])*u[0])/den,uu=((q[0]-p[0])*r[1]-(q[1]-p[1])*r[0])/den;if(tt<0||tt>1||uu<0||uu>1)continue;const x=p[0]+r[0]*tt,z=p[1]+r[1]*tt;if(MP&&fwD(x,z)<8)continue;
    if(APR.some(a=>a[5]===2&&Math.hypot(a[0]-x,a[1]-z)<3))continue;APR.push([x,z,R.w+.4,half(s)*2+.6,Math.atan2(u[1],-u[0]),2]);nX++;}}}});
  O.subStreetFix={aprons:nA,crossings:nX,bulbs:nB,closed:nC};}
APR.forEach(a=>rbox(a[0],a[1],a[2],a[3],a[4],'asph',.1,!!a[5]));
// streets into chunk geometry
{/* audit (Paul Nov 2026): a junction box must sit square to a road it serves, and nothing round in the water */
const AB=new Map(),abk=(x,z)=>Math.floor(x/4)*100003+Math.floor(z/4);const abAdd=(P)=>{for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3));for(let t=0;t<=n;t++){const k=abk(a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n);let L=AB.get(k);if(!L)AB.set(k,L=[]);L.push([a,b]);}}};
STREETS.forEach(s=>{if(s.P&&s.P.length>1&&s.kind!=='ramp')abAdd(s.P);});RIBS.forEach(r=>{if(!r.hidden&&r.P2&&r.w>2.5)abAdd(r.P2);});
O.boxSquare=(x,z,ang,rad)=>{let seen=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=AB.get((Math.floor(x/4)+a)*100003+Math.floor(z/4)+b);if(!L)continue;for(const[p,q]of L){if(segDist(x,z,p,q)>rad)continue;seen++;let d=((Math.atan2(q[0]-p[0],q[1]-p[1])-ang)*180/Math.PI)%90;d=Math.abs(d<0?d+90:d);if(Math.min(d,90-d)<8)return true;}}return seen===0;};}
STREETS.forEach(s=>{const P=s.P;
  if((s.kind==='bulb'||s.kind==='abulb'||s.kind==='xpad')&&(()=>{const[x,z]=P[0];if(MP&&fwD(x,z)<9)return true;const rb=ribNear(x,z,9);return rb&&rb.d<rb.w/2+2.6;})())return;// nothing round left lying on a highway (Paul, Nov 2026)
  if(OWR2&&(s.kind==='bulb'||s.kind==='abulb'||s.kind==='mrab')&&!landAt(P[0][0],P[0][1]))return;
  if(OWR2&&s.kind==='tj'&&!O.boxSquare(P[0][0],P[0][1],s.ang,1.5))return;if(OWR2&&s.kind==='xst'&&!(O.boxSquare(P[0][0],P[0][1],s.a1,1.5)&&O.boxSquare(P[0][0],P[0][1],s.a2,1.5)))return;
  if(s.kind==='abulb'){rdisc(P[0][0],P[0][1],OWR2?1.45:3.4,.09,20);return;}if(s.kind==='xpad'){rdisc(P[0][0],P[0][1],s.r,.07,12);return;}if(s.kind==='tee'){rbox(P[0][0],P[0][1],6.5,6.5,0,'cross',.12,true);return;}
  if(s.kind==='bulb'){const[x,z]=P[0],g=B(x,z),R0=1.05;disc(g,x,z,R0+.05,.07,UV.asph,24);ring(g,x,z,R0,R0+.1,.16,UV.kerb,24);ring(g,x,z,R0+.1,R0+.45,.11,UV.path,24);RKCIR.push([x,z,R0]);return;}// a cul-de-sac just a little wider than its street (Paul, Nov 2026)// a cul-de-sac: asphalt circle, kerb, footpath
  if(s.kind==='xst'){const[x,z]=P[0];rbox(x,z,s.w2+2,s.w1,s.a1,'xarm',0,false);rbox(x,z,s.w1+2,s.w2,s.a2,'xarm2',0,false);return;}
  if(s.kind==='fx'){const[x,z]=P[0];rbox(x,z,1.45,1.45,s.a,'asph',.1,true);return;}
  if(s.kind==='tj'){const[x,z]=P[0];rbox(x,z,s.L,s.w,s.ang,'tarm',0,false);return;}
  if(s.kind==='mrab'){const[x,z]=P[0],g=B(x,z);disc(g,x,z,s.r,.07,UV.asph,16);const F=FR(x,gy(x,z)+.08,z,0,bake(x,z));cyl(g,F,0,0,0,s.r*.36,.1,12,UV.kerb,UV.island);ring(g,x,z,s.r*.36,s.r*.36+.08,.1,UV.kerb,12);return;}
  if(s.kind==='rab'){const[x,z]=P[0],g=B(x,z);disc(g,x,z,2.1,.075,UV.asph,14);const F=FR(x,gy(x,z)+.07,z,0,bake(x,z));cyl(g,F,0,0,0,.95,.14,12,UV.kerb,UV.island);plant(x,z,3,2.4);return;}
  if(s.kind==='rab2'&&OWR2){const[x,z]=P[0];if(!O.boxSquare(x,z,0,1.5))return;rbox(x,z,3.0,3.0,0,s.v&&s.v.tee?'asph':'cross2',.12,false);return;}// four-lane crossings are signal-style crossroads, not roundabouts (Paul, Nov 2026)
  if(s.kind==='rab2'){const[x,z]=P[0],g=B(x,z);rbox(x,z,6.6,6.6,0,'asph',.1,false);disc(g,x,z,4,.09,UV.asph,18);const F=FR(x,gy(x,z)+.09,z,0,bake(x,z));cyl(g,F,0,0,0,2,.16,16,UV.kerb,UV.island);plant(x,z,13,4.2);plant(x+.9,z+.6,5,2.8);return;}
  if(s.kind==='pad'){const[x,z]=P[0],v=s.v;if(v&&v.arms.length===2&&v.arms[0][0].h===v.arms[1][0].h)return;rbox(x,z,6.6,6.6,0,'asph',.11,false);return;}
  const w=s.kind==='art'?6.5:s.kind==='ramp'?1.6:s.kind==='lane'?.8:s.kind==='main'?3:2.5,uv=s.kind==='art'?UV.art:s.kind==='lane'?UV.lane:s.kind==='ramp'?UV.ramp:UV.street,yo=s.kind==='art'?.08:s.kind==='lane'?.04:.06;
  strip(null,P,w,uv,yo,s.kind==='art'?2:s.kind==='lane'?.8:1.25);/*one strip per street: no notches where chunk slices met*/
  // street trees on the verges and pads at the junctions
  if(s.kind==='local'||s.kind==='main')for(let i=2;i<P.length-1;i+=3){const a=P[i-1],b=P[i],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;const sd=(i/3|0)%2?1:-1,x=b[0]+dz/l*1.05*sd,z=b[1]-dx/l*1.05*sd;if(hs(x,z)<.55&&occ(x,z)<2)plant(x,z,[2,3,1,11][((hs(z,x)*4)|0)],1.6+hs(x,z)*.9);}
  /* the grey end discs are gone (Paul, Nov 2026): tees, crossroads, roundabouts and cul-de-sacs draw their own junctions */});

// signals at the centre crossroads: a zebra slab, four poles with heads (bulbs are one instanced mesh, phases shared with the traffic)
const BULB=[],SIGO=[];
SIGS.forEach((v,si)=>{const x=v.x,z=v.z,g=B(x,z),y=gy(x,z)+.1,F=FR(x,y,z,0,bake(x,z));if(OWR2&&!v.rib){if(O.boxSquare(x,z,0,1.5))rbox(x,z,3.0,3.0,0,v.tee?'asph':'cross2',.12,false);}else rbox(x,z,6.5,6.5,0,'cross',.12,!!v.rib);
  const s={x,z,ang:0,ax:[0,1],heads:[],ph:si*3.7+1.3,g:null,sub:1};SIGO.push(s);
  [[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([sx,sz],k)=>{const px=sx*3.6,pz=sz*3.6;box(g,F,px,0,pz,.12,2.3,.12,all(UV.black));const hy=2.05;box(g,F,px,hy-.42,pz,.28,.8,.22,all(UV.black));
    const axis=k%2;const dirs=axis?[[0,0,1],[0,0,-1]]:[[1,0,0],[-1,0,0]];BULB.push({x:x+px,y:y+hy-.42,z:z+pz,s,axis,face:axis?[0,sz]:[sx,0]});});});
// street lamps along the arterials (poles in the merged mesh, bulbs instanced)
LAMPS.forEach(([x,z,a])=>{if(!landAt(x,z)||occ(x,z)>=2&&rdD(x,z,0)<3)return;const g=B(x,z),F=FR(x,gy(x,z),z,a,bake(x,z));box(g,F,0,0,0,.1,2.6,.1,all(UV.grey));box(g,F,0,2.5,.45,.08,.08,.9,all(UV.grey));});

// lots, houses, gardens
let nH=0;
const HOUSES=[];
LOTS.forEach(L=>{const g=B(L.x,L.z),y=H(L.x,L.z),k=bake(L.x,L.z),F=FR(L.x,0,L.z,L.th,k);const fw=L.fw,dp=L.dp;
  patch(g,F,-fw/2+.05,-dp/2+.05,fw/2-.05,dp/2-.05,.035,L.dry?UV.lawnDry:UV.lawn,k,2,2);
  if(L.type==='terr'){nH+=L.n;const sk=L.sk,tw=TW0,D=HD0*.95,zc=dp/2-1.0-D/2,Fh=FR(L.x,y,L.z,L.th,k);const W=L.n*tw,ly=-.3;
    for(let i=0;i<L.n;i++){const lx=-W/2+tw*(i+.5),sk2=SK.terr[(SK.terr.indexOf(sk)+i*(L.h<.5?0:1))%SK.terr.length];box(g,Fh,lx,ly,zc,tw,HH0+.3,D,{f:sk2.f,b:UV.terrBack,t:UV.top});}
    box(g,Fh,0,ly,zc,W,HH0+.3,D,{l:UV.terrSide,r:UV.terrSide});hip(g,Fh,0,HH0,zc,W+.3,D+.4,.55,sk.rf);
    L.house={F:Fh,W,D,zc,sk};HOUSES.push(L);chunk(L.x,L.z).det.push(L);for(let i=0;i<L.n;i++)patch(g,F,-W/2+tw*(i+.5)-.2,dp/2-1,-W/2+tw*(i+.5)+.2,dp/2-.05,.05,UV.path,k);
    if(L.h<.7)plant(L.x+Math.sin(L.th)*(dp/2-.4),L.z+Math.cos(L.th)*(dp/2-.4),2,2.4);
    if(BLOCK&&L.z>=0&&L.z<WZ)markBlock(L.x,L.z,L.th,W,D,zc);return;}
  nH++;const sk=L.sk,W=Math.min(sk.W,fw-1.25),D=sk.kind==='shack'?2.2:Math.min(HD0,dp-2.2),setb=L.style==='old'?.95:1.15,zc=dp/2-setb-D/2,xc=(sk.kind==='brick'?-L.side*.5:0)*(fw>4?1:.4);
  const Fh=FR(L.x,y,L.z,L.th,k);const st=sk.kind==='cottage'||sk.kind==='shack'?.25:0,ly=-.3;
  box(g,Fh,xc,ly,zc,W,HH0+.3+st,D,{f:sk.f,b:sk.b,l:sk.s,r:sk.s2,t:UV.top});
  if(sk.kind==='shack')gableR(g,Fh,xc,HH0+st,zc,W+.3,D+.35,sk.rise,sk.rf,UV.gable[L.h<.5?0:1]);else hip(g,Fh,xc,HH0+st,zc,W+.44,D+.44,sk.rise,sk.rf);
  // garage (brick), front gable and bay (Federation), driveway, pool
  let gx=xc;
  if(sk.kind==='brick'){gx=xc+L.side*(W/2+.62);box(g,Fh,gx,ly,zc+.15,1.22,1.3+.3,D-.3,{f:sk.gar,l:sk.s,r:sk.s,b:sk.s,t:UV.top});hip(g,Fh,gx,1.3,zc+.15,1.42,D-.1,.35,sk.rf,.95);}
  if(sk.kind==='fed'){const xg=xc-W*.24,gw=Math.min(1.5,W*.46);box(g,Fh,xg,ly,zc+D/2+.12,gw-.1,HH0+.3,.26,{f:sk.s,l:sk.s,r:sk.s,t:UV.top});
    const zf=zc+D/2+.27,tri=[W3(Fh,xg-gw/2,HH0-.02,zf),W3(Fh,xg+gw/2,HH0-.02,zf),W3(Fh,xg,HH0+.78,zf)],ht=UV.halfT;g.poly(tri,[[ht[0],ht[1]],[ht[2],ht[1]],[(ht[0]+ht[2])/2,ht[3]]],k);
    const r=sk.rf,V=(a,b,e)=>W3(Fh,a,b,e);g.poly([V(xg-gw/2-.12,HH0-.06,zf+.1),V(xg-gw/2-.12,HH0-.06,zf-.9),V(xg,HH0+.86,zf-.9),V(xg,HH0+.86,zf+.1)],rq(r),k*.9);g.poly([V(xg+gw/2+.12,HH0-.06,zf-.9),V(xg+gw/2+.12,HH0-.06,zf+.1),V(xg,HH0+.86,zf+.1),V(xg,HH0+.86,zf-.9)],rq(r),k*.95);}
  const dx=sk.kind==='brick'?gx:xc+L.side*(fw/2-.75);if(sk.kind==='brick'||L.h%.1<.06)patch(g,F,dx-.5,zc+D/2-.2,dx+.5,dp/2+1.1,.065,L.style==='old'?UV.paveR:UV.pave,k,1,2);
  else patch(g,F,xc-.22,zc+D/2,xc+.22,dp/2-.05,.05,UV.path,k);
  if(L.pool){const pz=-dp/2+.75,px=-L.side*.6;patch(g,F,px-.85,pz-.55,px+.85,pz+.55,.05,UV.coping,k);patch(g,F,px-.7,pz-.42,px+.7,pz+.42,.058,UV.water,1);}
  L.house={F:Fh,W,D,zc,xc,gx,sk,st};HOUSES.push(L);chunk(L.x,L.z).det.push(L);
  // garden: a tree out the front, one in the back, shrubs by the house
  const P2=(lx,lz)=>W3(F,lx,0,lz);
  if(L.tree<.62){const p=P2(-L.side*(fw/2-.8),dp/2-.6);plant(p[0],p[2],L.style==='coast'?(L.h<.4?5:4):[2,3,1,11,2][((L.tree*50)|0)%5],L.style==='coast'?3.2:2.2+L.tree*1.4);}
  if(L.tree>.35&&!L.pool){const p=P2(L.side*(fw/2-.9),-dp/2+.7);plant(p[0],p[2],[1,2,0,3][((L.h*40)|0)%4],2.6+L.h);}
  for(let i=0;i<2;i++){const p=P2(xc+(i?1:-1)*(W/2-.35),zc+D/2+.35);if(hs(p[0],p[2])<.6)plant(p[0],p[2],[10,8,11][((L.h*9+i)|0)%3],.7+hs(p[2],p[0])*.4);}
  if(BLOCK&&L.z>=0&&L.z<WZ)markBlock(L.x,L.z,L.th,W,D,zc);});
function markBlock(x,z,th,W,D,zc){const c=Math.cos(th),s=Math.sin(th),cx=x+s*zc,cz=z+c*zc,r=Math.hypot(W,D)/2;for(let zz=Math.floor(cz-r);zz<=cz+r;zz++)for(let xx=Math.floor(cx-r);xx<=cx+r;xx++){const dx=xx+.5-cx,dz=zz+.5-cz,lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<W/2&&Math.abs(lz)<D/2&&xx>=0&&zz>=0&&xx<WX&&zz<WZ)BLOCK[zz*WX+xx]=1;}}

// near-only detail of one lot
function lotDetail(g,L){const h=L.house,F=h.F,k=F.k,fw=L.fw,dp=L.dp,sk=h.sk,Fg=FR(L.x,0,L.z,L.th,k);
  const fy=(lx,lz)=>{const p=W3(Fg,lx,0,lz);return gy(p[0],p[2]);};
  const fence=(x0,z0,x1,z1,hh,u)=>{const L2=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(L2/1.4));for(let i=0;i<n;i++){const a=x0+(x1-x0)*i/n,b=z0+(z1-z0)*i/n,a2=x0+(x1-x0)*(i+1)/n,b2=z0+(z1-z0)*(i+1)/n,y=fy((a+a2)/2,(b+b2)/2)-.05;
      const Fx=FR(0,0,0,0,k);const p0=W3(Fg,a,0,b),p1=W3(Fg,a2,0,b2);g.poly([[p0[0],y,p0[2]],[p1[0],y,p1[2]],[p1[0],y+hh,p1[2]],[p0[0],y+hh,p0[2]]],rq(u),k*.92);g.poly([[p1[0],y,p1[2]],[p0[0],y,p0[2]],[p0[0],y+hh,p0[2]],[p1[0],y+hh,p1[2]]],rq(u),k*.8);}};
  if(L.type==='terr'){const W=h.W;for(let i=0;i<=L.n;i++){const lx=-W/2+TW0*i;box(g,h.F,lx,HH0+.25,h.zc-.3,.26,.55,.26,all(UV.chim[0]));}
    for(let i=0;i<L.n;i++){const lx=-W/2+TW0*(i+.5);box(g,h.F,lx-.75,0,h.zc+h.D/2+.62,.05,HH0-.3,.05,all(UV.white));}box(g,h.F,0,HH0-.32,h.zc+h.D/2+.35,W,.04,.7,{t:UV.tin,f:UV.white});
    fence(-fw/2+.3,dp/2-.08,fw/2-.3,dp/2-.08,.32,UV.picket);return;}
  // fences: front (brick wall, picket, limestone or hedge by type), sides and back in sheet panels
  const fu=L.style==='old'?(sk.kind==='fed'?UV.hedge:UV.picket):sk.kind==='brick'?(L.h<.5?UV.bwall:UV.lwall):sk.kind==='shack'?UV.picket:UV.picket;
  const dx=sk.kind==='brick'?h.gx:h.xc+L.side*(fw/2-.75);const gap0=dx-.6,gap1=dx+.6;
  if(!(L.style==='mod'&&L.h<.25)){fence(-fw/2+.08,dp/2-.08,Math.min(gap0,fw/2),dp/2-.08,fu===UV.hedge?.45:.32,fu);if(gap1<fw/2-.1)fence(gap1,dp/2-.08,fw/2-.08,dp/2-.08,fu===UV.hedge?.45:.32,fu);}
  const fs=UV.fenceS[((L.h*31)|0)%4];fence(-fw/2+.05,-dp/2+.05,fw/2-.05,-dp/2+.05,.55,fs);fence(-fw/2+.05,-dp/2+.05,-fw/2+.05,h.zc-.2,.55,fs);fence(fw/2-.05,-dp/2+.05,fw/2-.05,h.zc-.2,.55,fs);
  // letterbox by the driveway
  const lb=W3(Fg,gap0-.25,0,dp/2-.25);box(g,FR(lb[0],gy(lb[0],lb[2]),lb[2],L.th,k),0,0,0,.2,.42,.2,sk.kind==='brick'?all(UV.chim[1]):all(UV.white));
  // per type
  const Fh=h.F,W=h.W,D=h.D,zc=h.zc,xc=h.xc,st=h.st;
  if(sk.kind==='brick'){const pitch=Math.atan2(sk.rise,(D+.44)/2);// solar panels on the front slope, aircon, antenna
    for(let i=0;i<3;i++){const lx=xc-.7+i*.62;const t=.35,lz=zc+(D+.44)/2*(1-t),ly=HH0+sk.rise*t+.03;const p=[W3(Fh,lx-.27,ly,lz+.2),W3(Fh,lx+.27,ly,lz+.2),W3(Fh,lx+.27,ly+.36*Math.sin(pitch)*1.6,lz-.25),W3(Fh,lx-.27,ly+.36*Math.sin(pitch)*1.6,lz-.25)];g.poly(p,rq(UV.solar),k);}
    box(g,Fh,xc-L.side*(W/2+.12),.35,zc-D*.15,.22,.3,.48,{f:UV.ac,b:UV.ac,l:UV.ac,r:UV.ac,t:UV.metal});box(g,Fh,xc+W*.25,HH0+sk.rise*.6,zc-.2,.03,.7,.03,all(UV.grey));box(g,Fh,xc+W*.25,HH0+sk.rise*.6+.55,zc-.2,.5,.03,.03,all(UV.grey));
    box(g,Fh,xc-W*.07,0,zc+D/2+.18,.8,.06,.35,all(UV.coping));}
  else if(sk.kind==='cottage'||sk.kind==='shack'){const vd=sk.kind==='shack'?.7:.75,su=UV.stripes[((L.h*50)|0)%5];// verandah, posts, deck, tank, chimney
    if(sk.kind==='cottage'){const V=(a,b,e)=>W3(Fh,a,b,e),z0=zc+D/2;g.poly([V(xc-W/2-.05,HH0+st-.05,z0),V(xc+W/2+.05,HH0+st-.05,z0),V(xc+W/2+.05,HH0+st-.3,z0+vd*.62),V(xc-W/2-.05,HH0+st-.3,z0+vd*.62)].reverse(),rq(su),k);
      g.poly([V(xc-W/2-.05,HH0+st-.3,z0+vd*.62),V(xc+W/2+.05,HH0+st-.3,z0+vd*.62),V(xc+W/2+.05,HH0+st-.62,z0+vd),V(xc-W/2-.05,HH0+st-.62,z0+vd)].reverse(),rq(su),k*.95);
      box(g,Fh,xc,HH0+st-.5,zc+D/2+.3,.1,.5,.4,all(UV.chim[0]),.0);box(g,Fh,xc+W*.22,HH0+st+sk.rise*.4,zc-D*.18,.26,.8,.26,all(UV.chim[0]));}
    else{box(g,Fh,xc,HH0+st-.25,zc+D/2+vd/2,W+.1,.05,vd,{t:UV.tin,f:UV.white,l:UV.white,r:UV.white});}
    const nP=W>3?4:3;for(let i=0;i<nP;i++){const px=xc-W/2+.08+i*(W-.16)/(nP-1);box(g,Fh,px,0,zc+D/2+vd-.05,.06,HH0+st-.45,.06,all(UV.white));}
    box(g,Fh,xc,st-.02,zc+D/2+vd/2,W,.06,vd,{t:UV.wood,f:UV.timber});
    const tx=(xc+W/2+.4)*(L.h<.5?1:-1),tz=zc-D/2+.4;cyl(g,Fh,tx,0,tz,.3,.78,8,UV.tank[((L.h*30)|0)%3],UV.metal);
    if(sk.kind==='shack'&&L.h<.6){const Fb=Fh;box(g,Fb,xc-L.side*(W/2+.9),.12,zc+.4,.6,.08,1.6,all(UV.grey));box(g,Fb,xc-L.side*(W/2+.9),.2,zc+.4,.55,.22,1.3,{t:UV.white,f:UV.white,l:UV.carB[2],r:UV.carB[2],b:UV.white});}}
  else if(sk.kind==='fed'){// verandah on turned posts, two chimneys, finial
    const xg=xc-W*.24,gw=Math.min(1.5,W*.46),vx0=xg+gw/2+.08,vx1=xc+W/2+.06,vw=vx1-vx0,vc=vx0+vw/2;box(g,Fh,vc,HH0-.28,zc+D/2+.36,vw,.05,.74,{t:UV.tinG,f:UV.green,l:UV.green,r:UV.green});
    [vx0+.06,vx1-.08].forEach(px=>box(g,Fh,px,0,zc+D/2+.7,.07,HH0-.28,.07,all(UV.white)));box(g,Fh,vc,0,zc+D/2+.36,vw,.05,.72,{t:UV.coping,f:UV.coping});
    box(g,Fh,xc+W*.3,HH0+sk.rise*.35,zc-D*.12,.3,.95,.3,all(UV.chim[0]));box(g,Fh,xc-W*.05,HH0+sk.rise*.35,zc-D*.25,.3,.95,.3,all(UV.chim[0]));box(g,Fh,xg,HH0+.78,zc+D/2+.3,.05,.22,.05,all(UV.red));}
  // backyard: clothesline, shed, garden bed, sometimes a trampoline
  const by=-dp/2+.9;if(L.cl&&!L.pool){const cx=L.side*.7,F2=FR(0,0,0,0,k);const p=W3(Fg,cx,0,by);const Fc=FR(p[0],gy(p[0],p[2]),p[2],L.th+.4,k);box(g,Fc,0,0,0,.05,1,.05,all(UV.metal));box(g,Fc,0,.95,0,1.1,.03,.03,all(UV.metal));box(g,Fc,0,.95,0,.03,.03,1.1,all(UV.metal));}
  if(L.shed){const p=W3(Fg,-L.side*(fw/2-.55),0,-dp/2+.45);const Fs=FR(p[0],gy(p[0],p[2]),p[2],L.th,k);box(g,Fs,0,0,0,.8,.75,.6,{f:UV.tin,b:UV.tin,l:UV.tin,r:UV.tin,t:UV.tinG});}
  else if(L.h*41%1<.2){const p=W3(Fg,-L.side*(fw/2-.8),0,-dp/2+.8);const Ft=FR(p[0],gy(p[0],p[2]),p[2],0,k);cyl(g,Ft,0,.3,0,.45,.05,10,UV.black,UV.tramp);}
  if(L.h*53%1<.4)patch(g,Fg,-fw/2+.15,-dp/2+.15,-fw/2+.55,-dp/2+1.6,.06,UV.bed,k);}

