// ---------- 3. the plan: arterial grid, suburbs (cells), centres, coast towns ----------
const CX=52,CZ=40,GX0=N?N.X0:0,GZ0=0,m=3.4;
const zLo=N?Math.max(N.ZMIN,-300):0;
const cbd=T.cbd?[T.cbd.x,T.cbd.z]:[154,34],freo=T.freo?[T.freo.x,T.freo.z]:[21,172];
const I0=0,I1=Math.ceil(((N?Math.max(WX,N.X1):WX)-GX0)/CX),J0=Math.floor((zLo-GZ0)/CZ),J1=Math.ceil((WZ-GZ0)/CZ);
const cellOf=(i,j)=>({i,j,x0:GX0+i*CX,z0:GZ0+j*CZ});
const CELLS=new Map(),cid=(i,j)=>i*1000+j;
for(let i=I0;i<I1;i++)for(let j=J0;j<J1;j++){const c=cellOf(i,j);let n=0,t=0;for(let a=4;a<CX-3;a+=4)for(let b=4;b<CZ-3;b+=4){t++;const x=c.x0+a,z=c.z0+b;if(subA(x,z)&&free(x,z,0))n++;}c.cov=n/t;
  if(c.cov<.25)continue;const cx=c.x0+CX/2,cz=c.z0+CZ/2,dC=Math.hypot(cx-cbd[0],cz-cbd[1]),dF=Math.hypot(cx-freo[0],cz-freo[1]);
  c.style=(OWR2&&dF<70)?'grid':(dC<64||dF<36)?'old':'mod';c.north=cz<0;c.h=hs(i*3.3,j*7.1);CELLS.set(cid(i,j),c);}
const isCell=(i,j)=>CELLS.has(cid(i,j));
// arterial edges: sampled every unit; a sample is good on land, clear of other roads/rail/freeway/towns, next to a suburb
const ART=[],VX=new Map(),vk=(i,j)=>i*1000+j;
const artOK=(x,z)=>landAt(x,z)&&rdD(x,z,0)>3.4&&fwD(x,z)>8.2&&(z<-40||z>WZ||rdD(x,z,1)>2.4)&&!nearTown(x,z,2)&&(z>=0||!N||N.sd(x,z)>4)&&(subA(x,z)||subA(x+5,z)||subA(x-5,z)||subA(x,z+5)||subA(x,z-5));
const runs=(pts)=>{const R=[];let cur=null;pts.forEach(p=>{if(artOK(p[0],p[1])){if(!cur){cur=[];R.push(cur);}cur.push(p);}else cur=null;});return R.filter(r=>r.length>=6);};
for(let i=I0;i<=I1;i++)for(let j=J0;j<=J1;j++){
  // horizontal edge (i,j)->(i+1,j) borders cells (i,j-1) and (i,j); vertical edge (i,j)->(i,j+1) borders (i-1,j) and (i,j)
  if(isCell(i,j-1)||isCell(i,j)){const x0=GX0+i*CX,z=GZ0+j*CZ,pts=[];for(let a=0;a<=CX;a++)pts.push([x0+a,z]);runs(pts).forEach(r=>{ART.push({P:r,h:1,i,j});});}
  if(isCell(i-1,j)||isCell(i,j)){const x=GX0+i*CX,z0=GZ0+j*CZ,pts=[];for(let b=0;b<=CZ;b++)pts.push([x,z0+b]);runs(pts).forEach(r=>{ART.push({P:r,h:0,i,j});});}}
// owroads2 (Paul, Nov 2026): road = 4-lane arterial linking the areas; it never stops short. Runs on one grid edge with a short
// gap between them are joined, and an arterial that ends in the open carries on along its grid line to the next road
const ARTL=()=>ART.reduce((t,a)=>t+a.P.length,0);O.artBefore=ARTL();
if(OWR2){const artOK2=(x,z)=>landAt(x,z)&&rdD(x,z,0)>3.4&&fwD(x,z)>8.2&&(z<-40||z>WZ||rdD(x,z,1)>2.4)&&!nearTown(x,z,2)&&(z>=0||!N||N.sd(x,z)>4);
  const byEdge=new Map();ART.forEach(a=>{const k=a.h+'|'+a.i+'|'+a.j;(byEdge.get(k)||byEdge.set(k,[]).get(k)).push(a);});
  byEdge.forEach(L=>{if(L.length<2)return;L.sort((p,q)=>(p.h?p.P[0][0]-q.P[0][0]:p.P[0][1]-q.P[0][1]));for(let i=L.length-1;i>0;i--){const A=L[i-1],B=L[i],a=A.P[A.P.length-1],b=B.P[0],gap=Math.hypot(b[0]-a[0],b[1]-a[1]);let ok=gap<16;for(let t=0;t<=1&&ok;t+=.1){const x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;if(!landAt(x,z)||fwD(x,z)<8.2)ok=false;}
    if(ok){const fill=[];for(let t=1;t<gap;t++)fill.push([a[0]+(b[0]-a[0])*t/gap,a[1]+(b[1]-a[1])*t/gap]);A.P=A.P.concat(fill,B.P);ART.splice(ART.indexOf(B),1);L.splice(i,1);}}});
  const onArt=(x,z,self)=>ART.some(a=>a!==self&&a.P.some(p=>Math.abs(p[0]-x)<1.2&&Math.abs(p[1]-z)<1.2));
  ART.slice().forEach(a=>{[0,1].forEach(e=>{const P=a.P,p=e?P[P.length-1]:P[0],q=e?P[P.length-2]:P[1];if(onArt(p[0],p[1],a))return;const dx=Math.sign(p[0]-q[0]),dz=Math.sign(p[1]-q[1]);const ext=[];let hit=false;
    for(let t=1;t<=CX*1.5;t++){const x=p[0]+dx*t,z=p[1]+dz*t;if(rdD(x,z,0)<3.6||onArt(x,z,a)){hit=true;break;}if(!artOK2(x,z))break;ext.push([x,z]);}
    if(hit&&ext.length)a.P=e?P.concat(ext):ext.reverse().concat(P);});});O.artAfter=ARTL();}
if(OWR2){ART.slice().forEach(a=>{if(!a.P.some(p=>inFreo(p[0],p[1],.5)))return;const R=[];let cur=[];a.P.forEach(p=>{if(inFreo(p[0],p[1],.5)){if(cur.length)R.push(cur);cur=[];}else cur.push(p);});if(cur.length)R.push(cur);ART.splice(ART.indexOf(a),1);R.forEach(P=>{if(P.length>=3)ART.push(Object.assign({},a,{P}));});});}
/* Paul Nov 2026: 4-lane roads running beside the Kwinana are residential streets (2 lanes), not main roads */
const KWST=[];if(OWR2&&O.KWP){const KB=new Map(),kb=(x,z)=>Math.floor(x/6)*10007+Math.floor(z/6);for(let i=1;i<O.KWP.length;i++){const a=O.KWP[i-1],b=O.KWP[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2);for(let t=0;t<=n;t++){const x=a[0]+(b[0]-a[0])*t/n,z=a[1]+(b[1]-a[1])*t/n,k=kb(x,z);(KB.get(k)||KB.set(k,[]).get(k)).push([x,z]);}}
  const kwD=(x,z)=>{let m=1e9;for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){const L=KB.get((Math.floor(x/6)+dx)*10007+Math.floor(z/6)+dz);if(L)L.forEach(p=>{m=Math.min(m,Math.hypot(p[0]-x,p[1]-z));});}return m;};
  ART.slice().forEach(a=>{let n=0;a.P.forEach(p=>{if(kwD(p[0],p[1])<16)n++;});if(n>a.P.length*.4){KWST.push(a);ART.splice(ART.indexOf(a),1);}});O.artToStreet=KWST.length;}
// which arterial arms reach each grid vertex
ART.forEach(a=>{const p0=a.P[0],p1=a.P[a.P.length-1];[[p0,0],[p1,1]].forEach(([p,e])=>{const vi=Math.round((p[0]-GX0)/CX),vj=Math.round((p[1]-GZ0)/CZ);if(Math.hypot(p[0]-(GX0+vi*CX),p[1]-(GZ0+vj*CZ))<.6){const k=vk(vi,vj);let v=VX.get(k);if(!v)VX.set(k,v={i:vi,j:vj,x:GX0+vi*CX,z:GZ0+vj*CZ,arms:[]});v.arms.push([a,e]);}});});
// names: invented from bush and bird words (no real suburb names)
const NA=['Wattle','Quenda','Marri','Bluegum','Jarrah','Heron','Bilby','Numbat','Sandpiper','Boronia','Kurrajong','Paperbark','Honeyeater','Wren','Kestrel','Saltbush','Ironbark','Grevillea','Firetail','Banjine','Zamia','Moonah','Gidgee','Rosella','Plover','Corella','Tuart','Kwongan','Pardalote','Dunnart'];
const NB=['brook','vale','rise','glen','downs','heights','ridge','wood','field','crest','hollow','lea','dale','mead','bank','park'];
const usedN=new Set();const nameOf=(h)=>{for(let t=0;t<40;t++){const a=NA[((h*977+t*7)|0)%NA.length],b=NB[((h*331+t*3)|0)%NB.length];const n=a+(b==='park'||b==='heights'||b==='rise'?' '+b[0].toUpperCase()+b.slice(1):b);if(!usedN.has(n)){usedN.add(n);return n;}}return 'Parkside';};
// local centres: each suburb takes one 4-way (or 3-way) crossroads at its corner with enough room in that quadrant
const CEN=[];
const quadOK=(c,sa,sb,ca,cb)=>{let n=0,t=0;for(let u=m;u<m+18;u+=2)for(let v=m;v<m+12;v+=2){t++;const x=c.x0+ca+sa*u,z=c.z0+cb+sb*v;if(subA(x,z)&&free(x,z,.5)&&landAt(x,z))n++;}return n/t;};
[...CELLS.values()].sort((a,b)=>b.cov-a.cov).forEach(c=>{let best=null;[[0,0],[1,0],[0,1],[1,1]].forEach(([qa,qb])=>{const v=VX.get(vk(c.i+qa,c.j+qb));if(!v||v.used||v.arms.length<3)return;const q=quadOK(c,qa?-1:1,qb?-1:1,qa*CX,qb*CZ);if(q<.8)return;const sc=v.arms.length*10+q;if(!best||sc>best.sc)best={v,qa,qb,sc};});
  if(!best)return;best.v.used=1;const C={c,v:best.v,sa:best.qa?-1:1,sb:best.qb?-1:1,ca:best.qa*CX,cb:best.qb*CZ,h:c.h,name:nameOf(c.h*1000+c.i*31+c.j)};c.cen=C;CEN.push(C);});
// a centre's quadrant (plan coords inside its cell) is kept for it
const inCen=(c,a,b,pad)=>{const C=c.cen;if(!C)return false;const u=(a-C.ca)*C.sa,v=(b-C.cb)*C.sb;return u>m-.5-(pad||0)&&u<m+18.4+(pad||0)&&v>m-.5-(pad||0)&&v<m+12.4+(pad||0);};

// ---------- 4. streets, lots and houses ----------
const STREETS=[];O.subStreets=STREETS;const LOTS=[],PARKS=[],LAMPS=[],SIGS=[],ROUTES=[];
const addStreet=(P,kind)=>{if(P.length<2)return;STREETS.push({P,kind});markLine(P,kind==='art'?4.8:kind==='lane'?.8:1.6,2);};
const DBG={m:0,f:0,o:0,ok:0};O.subDbg=DBG;const lotOK=(x,z,th,fw,dp,mask)=>{const c=Math.cos(th),s=Math.sin(th);for(const[lx,lz]of[[0,0],[-fw/2+.5,-dp/2+.5],[fw/2-.5,-dp/2+.5],[-fw/2+.5,dp/2-1.2],[fw/2-.5,dp/2-1.2],[0,dp/2-1.4]]){const X=x+lx*c+lz*s,Z=z-lx*s+lz*c;if(lx===0&&lz===0?!mask(X,Z):!(landAt(X,Z)&&(Z>=0||!N||N.sd(X,Z)>3.5))){DBG.m++;return false;}if(!free(X,Z,0)){DBG.f++;return false;}if(occ(X,Z)>=2){DBG.o++;return false;}}DBG.ok++;return true;};
// pick a house type for a place
const typeAt=(style,north,h)=>style==='coast'?(h<.5?'shack':h<.82?'cottage':'brick'):style==='old'?(h<.42?'fed':h<.8?'cottage':'brick'):north?(h<.86?'brick':h<.95?'cottage':'fed'):(h<.66?'brick':h<.84?'cottage':'fed');
// a lot whose front edge centre is (fx,fz), front facing direction th (towards the street)
function addLot(fx,fz,th,fw,dp,style,north,mask,o){o=o||{};const c=Math.cos(th),s=Math.sin(th),x=fx-s*dp/2,z=fz-c*dp/2;if(!lotOK(x,z,th,fw,dp,mask))return null;
  const h=hs(x*3.7,z*1.3),type=o.type||typeAt(style,north,h);const L={x,z,th,fw,dp,type,h,style,sk:SK[type][((h*977)|0)%SK[type].length],side:hs(x,z+9)<.5?-1:1,pool:type==='brick'?h*7%1<.3:h*7%1<.12,cl:(h*13)%1<.45,shed:(h*17)%1<.3,tree:(h*23)%1,dry:(h*29)%1<.25};
  LOTS.push(L);markRect(x,z,th,fw-.4,dp-.4,1);return L;}
// a terrace row: n narrow units sharing walls, one roof
function addTerrace(fx,fz,th,n,dp,mask){const fw=n*TW0,c=Math.cos(th),s=Math.sin(th),x=fx-s*dp/2,z=fz-c*dp/2;if(!lotOK(x,z,th,fw,dp,mask))return null;const h=hs(x,z);const L={x,z,th,fw,dp,type:'terr',n,h,style:'old',sk:SK.terr[((h*97)|0)%SK.terr.length]};LOTS.push(L);markRect(x,z,th,fw-.4,dp-.4,1);return L;}
const SWD=2.4,LD=5.0,LF=4.3;
// polyline helpers in a cell's plan coords
const cellP=(c,a,b)=>[c.x0+a,c.z0+b];
function modCell(c){const mask=(x,z)=>subA(x,z),north=c.north;const A=.6+c.h*.7,ph=c.h*6.283,bc=CZ/2;
  const bcol=a=>bc+A*Math.sin(a/CX*6.283*.75+ph);
  // the collector: arterial to arterial, gently curving
  const col=[];for(let a=0;a<=CX;a+=2)col.push(cellP(c,a,bcol(a)));const colOK=col.filter(p=>landAt(p[0],p[1])&&free(p[0],p[1],-1.2)).length>col.length*.5;
  if(colOK){const segs=[];let cur=null;col.forEach(p=>{if(landAt(p[0],p[1])&&free(p[0],p[1],-1.2)){if(!cur)segs.push(cur=[]);cur.push(p);}else cur=null;});segs.forEach(s=>{if(s.length>2){addStreet(s,'local');ROUTES.push(s);}});}
  if(!colOK){DBG.nocol=(DBG.nocol||0)+1;return;}
  // cul-de-sacs both sides, lined with lots, a turning circle at the end; one slot may be a pocket park
  const MLD=4.8,MLF=3.95,park=c.h<.55&&!c.cen?((c.h*10)|0)%6:-1;let slot=0;
  for(let k=0;k<5;k++){const a=m+MLD+SWD/2+k*(2*MLD+SWD)+.2;if(a>CX-m-MLD-SWD/2+.3)break;
    [-1,1].forEach(sd=>{const myslot=slot++;const b0=bcol(a)+sd*SWD/2,bEnd=sd<0?m+1.5:CZ-m-1.5;
      if(myslot===park){const len=(bEnd-b0)*sd;PARKS.push({kind:'pocket',x:c.x0+a,z:c.z0+(b0+bEnd)/2,th:0,w:2*MLD+SWD-.6,d:len,c});markRect(c.x0+a,c.z0+(b0+bEnd)/2,0,2*MLD+SWD,len,1);return;}
      const toArt=OWR2&&ART.some(r=>r.h===1&&Math.abs(r.P[0][1]-(sd<0?c.z0:c.z0+CZ))<.6&&r.P.some(p=>Math.abs(p[0]-(c.x0+a))<.6)),bE2=toArt?(sd<0?2.9:CZ-2.9):bEnd;
      const P=[];DBG.st=(DBG.st||0)+1;for(let b=b0;sd<0?b>=bE2-.01:b<=bE2+.01;b+=sd){const p=cellP(c,a,b);if(!landAt(p[0],p[1])){DBG.sl=(DBG.sl||0)+1;break;}if(!free(p[0],p[1],-1.2)){DBG.sf=(DBG.sf||0)+1;break;}if(inCen(c,a,b,1.4)){DBG.sc=(DBG.sc||0)+1;break;}P.push(p);}if(P.length>4)DBG.sok=(DBG.sok||0)+1;
      const len=(P.length-1);if(len<4.5)return;const pe=P[P.length-1];const joined=toArt&&Math.abs((pe[1]-c.z0)-bE2)<1.1;
      addStreet(P,'local');if(!joined){STREETS.push({P:[pe],kind:'bulb'});markRect(pe[0],pe[1],0,3.2,3.2,2);}
      // lots along both sides (front edge on the verge), facing the stub, and one past the turning circle when there is room
      [-1,1].forEach(sx=>{let e=b0;for(let q=0;q<=MLD+.01;q+=.8){const v=bcol(a+sx*(SWD/2+q))+sd*(SWD/2+.15);e=sd>0?Math.max(e,v):Math.min(e,v);}const t0=(e-b0)*sd;for(let t=t0;t+MLF<=len+.3;t+=MLF){const b=b0+sd*(t+MLF/2);const fx=c.x0+a+sx*SWD/2,fz=c.z0+b;if(inCen(c,a+sx*(SWD/2+MLD/2),b,0))continue;addLot(fx,fz,Math.atan2(-sx,0),MLF,MLD,c.style,north,mask);}});
      });
    // a roundabout where the middle stubs meet the collector
    if(k===1&&c.h>.3){const p=cellP(c,a,bcol(a));if(landAt(p[0],p[1])&&free(p[0],p[1],-1))STREETS.push({P:[p],kind:'rab'});}}
  // a corner deli where the collector meets an arterial
  if(c.h>.62&&!c.cen){const a=m+1.6,b=bcol(a)+2.6;const x=c.x0+a,z=c.z0+b;if(subA(x,z)&&free(x,z,0)&&occ(x,z)<2){PARKS.push({kind:'deli',x,z,th:Math.atan2(-1,0),c});markRect(x,z,0,2.6,2.4,2);}}}
function oldCell(c){const mask=(x,z)=>subA(x,z),north=c.north,bx=CZ/2;
  // the cross street (along a) and streets along b every 12.5, rear lanes between the lots
  const cr=[];for(let a=0;a<=CX;a+=2)cr.push(cellP(c,a,bx));const crSeg=[];let cur=null;cr.forEach(p=>{if(landAt(p[0],p[1])&&free(p[0],p[1],-1.2)&&!inCen(c,p[0]-c.x0,p[1]-c.z0,0)){if(!cur)crSeg.push(cur=[]);cur.push(p);}else cur=null;});crSeg.forEach(s=>{if(s.length>2){addStreet(s,'local');ROUTES.push(s);}});
  const OLD_LD=4.6,OLF=3.6;
  for(let k=0;k<4;k++){const a=m+OLD_LD+SWD/2+k*(2*OLD_LD+SWD+.9);if(a>CX-m-OLD_LD-SWD/2+.2)break;
    // street along b in two halves (either side of the cross street)
    [[m,bx-SWD/2],[bx+SWD/2,CZ-m]].forEach(([b0,b1],half)=>{const P=[];for(let b=half?b0-SWD/2:b0;b<=(half?b1:b1+SWD/2)+.01;b+=1.5)P.push(cellP(c,a,b));const good=P.filter(p=>landAt(p[0],p[1])&&free(p[0],p[1],-1.2)&&!inCen(c,p[0]-c.x0,p[1]-c.z0,0));if(good.length<P.length*.7)return;addStreet(good,'local');
      // lots both sides; near the cross street some become terrace rows
      [-1,1].forEach(sx=>{let b=b0+.2;while(b+OLF<=b1+.01){const fx=c.x0+a+sx*SWD/2,th=Math.atan2(-sx,0);const near=Math.abs(b+OLF-bx)<4||Math.abs(b-bx)<4;
          if(near&&hs(c.x0+a+sx,c.z0+b)<.55&&b+OLF*2<=b1+.01){if(addTerrace(fx,c.z0+b+OLF,th,4,OLD_LD,mask)){b+=OLF*2;continue;}}
          if(inCen(c,a+sx*(SWD/2+OLD_LD/2),b+OLF/2,0)){b+=OLF;continue;}addLot(fx,c.z0+b+OLF/2,th,OLF,OLD_LD,'old',north,mask);b+=OLF;}});});
    // rear lane behind the high-side lots
    const la=a+SWD/2+OLD_LD+.45;if(la<CX-m-1){const P=[];for(let b=m;b<=CZ-m;b+=1.5){if(Math.abs(b-bx)<SWD/2+.2)continue;P.push(cellP(c,la,b));}const good=P.filter(p=>landAt(p[0],p[1])&&free(p[0],p[1],-1.6)&&!inCen(c,p[0]-c.x0,p[1]-c.z0,0));
      let s=[];good.forEach((p,i)=>{if(i&&Math.hypot(p[0]-good[i-1][0],p[1]-good[i-1][1])>1.6){if(s.length>2)addStreet(s,'lane');s=[];}s.push(p);});if(s.length>2)addStreet(s,'lane');}}
  if(c.h>.5){const a=m+OLD_LD+SWD+.2,x=c.x0+a+1.4,z=c.z0+bx+SWD/2+1.4;if(subA(x,z)&&free(x,z,0)&&occ(x,z)<2)PARKS.push({kind:'deli',x,z,th:Math.PI,c});}}
// Fremantle (Paul, Nov 2026): a grid of two-lane streets in blocks, every street runs from road to road
function gridCell(c){const mask=(x,z)=>subA(x,z),north=c.north,GD=4.4,GF=3.8;const NA2=4,NB2=2;
  const ok=(p)=>landAt(p[0],p[1])&&free(p[0],p[1],-1.2)&&!inCen(c,p[0]-c.x0,p[1]-c.z0,0);
  const run=(pts)=>{let cur=[];const out=[];pts.forEach(p=>{if(ok(p))cur.push(p);else{if(cur.length>2)out.push(cur);cur=[];}});if(cur.length>2)out.push(cur);out.forEach(r=>{addStreet(r,'local');ROUTES.push(r);});return out;};
  const As=[],Bs=[];for(let k=1;k<=NA2;k++)As.push(k*CX/(NA2+1));for(let k=1;k<=NB2;k++)Bs.push(k*CZ/(NB2+1));
  As.forEach(a=>{const P=[];for(let b=2.9;b<=CZ-2.9+.01;b+=1)P.push(cellP(c,a,b));run(P);});
  Bs.forEach(b=>{const P=[];for(let a=3.3;a<=CX-3.3+.01;a+=1)P.push(cellP(c,a,b));run(P);});
  // lots along the long streets, facing them
  As.forEach(a=>{[-1,1].forEach(sx=>{for(let b=m+.2;b+GF<=CZ-m;b+=GF){if(Bs.some(B=>Math.abs(b+GF/2-B)<GF/2+SWD/2))continue;addLot(c.x0+a+sx*SWD/2,c.z0+b+GF/2,Math.atan2(-sx,0),GF,GD,'old',north,mask);}});});}
// a park instead of houses in some cells: oval, paths, trees, a playground
function greenCell(c){const x=c.x0+CX/2+(c.h-.5)*6,z=c.z0+CZ/2;if(!subA(x,z)||!free(x,z,2))return modCell(c);PARKS.push({kind:'big',x,z,th:0,c});markRect(x,z,0,22,16,1);modCell(c);}
CELLS.forEach(c=>{if(c.style==='grid')gridCell(c);else if(c.style==='mod'&&!c.cen&&c.h>.86)greenCell(c);else if(c.style==='old')oldCell(c);else modCell(c);});

