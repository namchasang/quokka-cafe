// ---------- 7. the local centres ----------
const F_ANG=F=>Math.atan2(F.s,F.c);
const signC=new Map();const signUV=(lines,bg,fg,w)=>{const key=lines.join('|')+bg+w;if(signC.has(key))return signC.get(key);const W=w||Math.max(...lines.map(l=>l.length))*5+8,Hh=lines.length*9+3;
  const u=put(cvs(W,Hh,(x)=>{Pt(x,bg,0,0,W,Hh);Pt(x,T2.sh(bg,1.3),0,0,W,1);Pt(x,T2.sh(bg,.6),0,Hh-1,W,1);lines.forEach((l,i)=>txt(x,l,W/2,2+i*9,fg,7));}));signC.set(key,u);return u;};
// a building with a façade on the front (+z), plain walls elsewhere
const bldg=(g,F,lx,lz,w,h,d,front,side,roofU,roofK,rise)=>{box(g,F,lx,-.3,lz,w,h+.3,d,{f:front,b:side,l:side,r:side,t:UV.top});if(roofK==='hip')hip(g,F,lx,h,lz,w+.3,d+.3,rise||.5,roofU);else box(g,F,lx,h,lz,w+.1,.14,d+.1,{t:UV.top,f:UV.cream,b:UV.cream,l:UV.cream,r:UV.cream});};
function centre(C){const c=C.c,v=C.v,sa=C.sa,sb=C.sb,hh=C.h;
  // local quadrant frame: u along arterial A (the one at b = corner), v along arterial B
  const P=(u,w)=>[v.x+sa*u,v.z+sb*w];const thA=Math.atan2(0,-sb),thB=Math.atan2(-sa,0);// facing arterial A / B
  const g=B(...P(m+9,m+6)),k=bake(...P(m+6,m+6));for(let u=m-.5;u<m+18.6;u+=.7)for(let w=m-.5;w<m+12.6;w+=.7){const p=P(u,w);markPt(p[0],p[1],1);}
  const flip=hh>.5;// mirror the arrangement between the two arterials in half the suburbs
  const ua=(u,w)=>flip?[w,u]:[u,w];
  // ground: car park, plaza, school yard, oval
  const gpatch=(u0,w0,u1,w1,uvr,yo)=>{const a=ua(u0,w0),b=ua(u1,w1),p0=P(a[0],a[1]),p1=P(b[0],b[1]);const cx=(p0[0]+p1[0])/2,cz=(p0[1]+p1[1])/2,F=FR(cx,0,cz,0,bake(cx,cz));patch(g,F,-Math.abs(p1[0]-p0[0])/2,-Math.abs(p1[1]-p0[1])/2,Math.abs(p1[0]-p0[0])/2,Math.abs(p1[1]-p0[1])/2,yo||.05,uvr,1,3,3);};
  const at=(u,w,th)=>{const a=ua(u,w);const p=P(a[0],a[1]);return FR(p[0],gy(p[0],p[1]),p[1],th,k);};
  const thU=flip?thB:thA,thW=flip?thA:thB;// facing the 'u' arterial / the 'w' arterial after mirroring
  gpatch(m,m,m+18,m+12,UV.lawn,.03);
  gpatch(m+4,m+3.2,m+14.2,m+6.4,UV.park,.055);// car park behind the shops
  gpatch(m,m,m+3.8,m+3.8,UV.pave,.06);// the plaza on the corner
  // the shops: a strip of 4 with awnings facing arterial A, plus a café/restaurant pad
  const nS=4;for(let i=0;i<nS;i++){const u=m+4.4+i*2.42+1.21,F=at(u,m+1.7,thU),sh=UV.shops[((hh*97)|0+i*5)%UV.shops.length],e=i===2||(i===0&&hh<.3)?UV.eats[((hh*53)|0+i)%UV.eats.length]:sh;
    bldg(g,F,0,0,2.42,1.7,2.3,e.uv,UV.shopSide[i%4],null,'flat');box(g,F,0,1.05,1.32,2.42,.06,.75,{t:UV.awn[AWN.indexOf(e.awn)],f:UV.awn[AWN.indexOf(e.awn)]});
    box(g,F,0,1.7,1.12,2.42,.28,.06,{f:UV.cream,t:UV.cream});}
  {const e=UV.eats[((hh*31)|0)%UV.eats.length],F=at(m+15.9,m+1.8,thU);bldg(g,F,0,0,2.6,1.6,2.6,e.uv,UV.shopSide[1],UV.rf0,'hip',.45);box(g,F,0,1.0,1.42,2.6,.06,.8,{t:UV.awn[AWN.indexOf(e.awn)],f:UV.awn[AWN.indexOf(e.awn)]});C.cafe=F;}
  // the hall on the corner: clock tower or flagpole portico
  {const F=at(m+1.9,m+1.9,thU),hv=((hh*7)|0)%3;bldg(g,F,0,0,3.4,2.0,3.0,UV.hall[hv],UV.hallS[hv],UV.rf0,'hip',.7);C.hall=F;C.hallV=hv;
    if(hh*3%1<.6){box(g,F,0,2.0,-.2,.9,1.3,.9,{f:UV.clock,b:UV.clock,l:UV.clock,r:UV.clock});hip(g,F,0,3.3,-.2,1.1,1.1,.7,UV.rf0);}
    const sg=signUV([C.name.toUpperCase()+' HALL'],'#1d3a6e','#f4f2ec');box(g,F,0,1.62,1.52,2.4,.3,.04,{f:sg});}
  // clinic and school along arterial B; playground; oval with clubrooms
  {const F=at(m+1.7,m+5.6,thW);bldg(g,F,0,0,2.6,1.6,2.4,UV.clinic[hh<.5?0:1],UV.shopSide[2],null,'flat');}
  {const F=at(m+1.9,m+9.8,thW);bldg(g,F,0,0,4,1.6,2.8,UV.school[hh<.5?0:1],UV.schoolS,UV.rf1,'hip',.55);const sg=signUV([C.name.toUpperCase()+' PRIMARY'],'#2f5a46','#f4f2ec');const p=W3(F,0,0,2.2);box(g,FR(p[0],gy(p[0],p[2]),p[2],F_ANG(F),k),0,0,0,2.2,.62,.06,{f:sg,b:UV.green});}
  gpatch(m+4,m+7.4,m+7.4,m+12,UV.yard,.055);gpatch(m+4.3,m+10.3,m+6.8,m+11.8,UV.rubber,.065);
  gpatch(m+8,m+6.8,m+18,m+12.2,UV.oval,.045);
  {const F=at(m+13,m+12.6,thU+Math.PI);bldg(g,F,0,0,3,1.3,1.6,UV.club,UV.shopSide[3],UV.rf1,'hip',.4);}
  // lamps in the car park, trees round the plaza and the oval
  for(let i=0;i<3;i++){const a=ua(m+5+i*4,m+4.8);const p=P(a[0],a[1]);LAMPS.push([p[0],p[1],0]);}
  [[m+.6,m+3.6],[m+3.6,m+.6],[m+8.2,m+6.6],[m+17.6,m+6.6],[m+17.6,m+12],[m+8.2,m+12],[m+3.8,m+12.2]].forEach(([u,w],i)=>{const a=ua(u,w),p=P(a[0],a[1]);plant(p[0],p[1],[13,2,3,1][i%4],i<2?2.4:3.4);});
  C.det={P,ua,at,thU,thW,k};}
function centreDetail(g,C){const{P,ua,at,thU,thW,k}=C.det,hh=C.h,m2=m;
  // flagpole, café tables, playground, goalposts, shade sails, parked cars, bus shelter, bins
  const fp=at(m2+3.4,m2+.8,thU);box(g,fp,0,0,0,.05,2.8,.05,all(UV.white));box(g,fp,.38,2.35,0,.72,.42,.02,{f:UV.flag,b:UV.flag});
  for(let i=0;i<3;i++){const F=at(m2+14.8+i*.75,m2+.45,thU);cyl(g,F,0,0,0,.18,.42,6,UV.white,UV.white);box(g,F,0,.85,0,.04,.5,.04,all(UV.grey));cyl(g,FR(F.x,F.y+1.25,F.z,0,k),0,0,0,.45,.08,8,UV.awn[(i+((hh*9)|0))%8],UV.awn[(i+((hh*9)|0))%8]);}
  for(let r=0;r<2;r++)for(let i=0;i<5;i++){const F=at(m2+4.8+i*2,m2+3.9+r*1.6,thU+(r?Math.PI:0));if(hs(hh*99+i,r)<.45)continue;const ci=((hs(i,r+hh)*8)|0)%8;box(g,F,0,.06,0,.62,.32,1.2,all(UV.carB[ci]));box(g,F,0,.38,-.05,.54,.22,.66,{f:UV.carW,b:UV.carW,l:UV.carW,r:UV.carW,t:UV.carB[ci]});}
  {const F=at(m2+5.5,m2+11,thW);box(g,F,0,0,0,.1,1.0,.1,all(UV.play[0]));box(g,F,1,0,0,.1,1.0,.1,all(UV.play[0]));box(g,F,.5,1.0,0,1.2,.08,.6,all(UV.play[1]));box(g,F,1.25,0,.6,.3,.06,1.2,all(UV.play[2]));
    const sp=UV.sail[((hh*5)|0)%3];const p0=W3(F,-.3,1.6,-.5),p1=W3(F,1.6,1.4,-.4),p2=W3(F,1.4,1.6,1.1),p3=W3(F,-.4,1.3,1.0);g.poly([p0,p3,p2,p1],rq(sp),k);g.poly([p0,p1,p2,p3],rq(sp),k*.8);[[-.3,-.5],[1.6,-.4],[1.4,1.1],[-.4,1.0]].forEach(([a,b])=>box(g,F,a,0,b,.05,1.6,.05,all(UV.grey)));}
  [[m2+8.8],[m2+17.2]].forEach(([u])=>{const F=at(u,m2+9.5,thW);[-.5,-.17,.17,.5].forEach((o,i)=>box(g,F,0,0,o,.05,i===0||i===3?1.1:1.6,.05,all(UV.white)));});
  {const F=at(m2+9,m2+12.5,thU+Math.PI);box(g,F,0,0,0,.08,1.2,.08,all(UV.black));box(g,F,0,1.2,0,1.2,.6,.08,{f:UV.score,b:UV.black});}
  {const F=at(m2+12,m2+.25,thU);box(g,F,0,0,0,1.4,.06,.5,all(UV.grey));box(g,F,0,0,-.22,1.4,.95,.04,all(UV.metal));box(g,F,0,.95,0,1.5,.05,.6,all(UV.tin));}}
function coastCentre(C){const t=C.coast,F=t.F,R=t.R;const k=1;
  const at=(a,b,th)=>{const p=F(a,b);return FR(p[0],gy(p[0],p[1]),p[1],th,bake(p[0],p[1]));};
  const off=t.own?SWD/2+.4:4.6;const facing=(a,b,side)=>C.th(a,b,0,-side);
  for(let i=0;i<4;i++)[-1,1].forEach(side=>{const a=-5+i*2.6,b=side*(off+1.2);const p=F(a,b),q=F(a,b+side*2.4);if(!landAt(p[0],p[1])||!t.mask(p[0],p[1])||!landAt(q[0],q[1])||!t.mask(q[0],q[1])||occ(p[0],p[1])>=2)return;const Fq=at(a,b,facing(a,b,side));const g=B(p[0],p[1]);
    const e=(i+(side>0?1:0))%3===1?UV.eats[((t.h*50)|0+i)%UV.eats.length]:UV.shops[((t.h*70)|0+i*3)%UV.shops.length];bldg(g,Fq,0,0,2.42,1.7,2.3,e.uv,UV.shopSide[i%4],null,'flat');box(g,Fq,0,1.05,1.32,2.42,.06,.75,{t:UV.awn[AWN.indexOf(e.awn)],f:UV.awn[AWN.indexOf(e.awn)]});markRect(p[0],p[1],0,2.4,2.4,2);});
  {const a=6.8,b=-(off+1.9),p=F(a,b);if(landAt(p[0],p[1])&&t.mask(p[0],p[1])&&occ(p[0],p[1])<2){const Fq=at(a,b,facing(a,b,-1));const hv=((t.h*7)|0)%3;bldg(B(p[0],p[1]),Fq,0,0,3.4,2.0,3.0,UV.hall[hv],UV.hallS[hv],UV.rf0,'hip',.7);const sg=signUV([t.name.toUpperCase()+' HALL'],'#1d3a6e','#f4f2ec');box(B(p[0],p[1]),Fq,0,1.62,1.52,2.4,.3,.04,{f:sg});markRect(p[0],p[1],0,3.4,3.4,2);}}}
UV.rf0=roofT('#5a5e66','tile');UV.rf1=roofT('#8a5a46','tile');
CEN.forEach(C=>{try{if(C.coast)coastCentre(C);else centre(C);}catch(e){console.error('owsub centre',e);}});
// parks, delis
PARKS.forEach(p=>{const g=B(p.x,p.z),k=bake(p.x,p.z),F=FR(p.x,gy(p.x,p.z),p.z,p.th,k);
  if(p.kind==='deli'){bldg(g,F,0,0,2.3,1.6,2,UV.deli,UV.shopSide[0],null,'flat');box(g,F,0,1.0,1.2,2.3,.06,.6,{t:UV.awn[0],f:UV.awn[0]});return;}
  if(p.kind==='pocket'){patch(g,FR(p.x,0,p.z,0,k),-p.w/2,-p.d/2,p.w/2,p.d/2,.04,UV.lawn,1.05,2,2);patch(g,FR(p.x,0,p.z,0,k),-1.2,-1,1.2,1,.055,UV.bark,k);p.det=1;chunk(p.x,p.z).det.push({park:p});for(let i=0;i<5;i++){const a=i/5*6.283;plant(p.x+Math.cos(a)*p.w*.36,p.z+Math.sin(a)*p.d*.36,[13,0,1,3,2][i],2.8+hs(i,p.x));}return;}
  if(p.kind==='big'){const F0=FR(p.x,0,p.z,0,k);patch(g,F0,-11,-8,11,8,.04,UV.lawn,1.03,4,3);patch(g,F0,-7,-4.5,7,4.5,.05,UV.oval,1,4,3);patch(g,F0,7.5,-7,10.5,-3,.055,UV.court,k);
    for(let i=0;i<14;i++){const a=i/14*6.283;plant(p.x+Math.cos(a)*9.6,p.z+Math.sin(a)*7,[13,0,1,2,3,4][i%6],3.2+hs(i,p.z)*1.2);}bldg(g,FR(p.x-9,gy(p.x-9,p.z+6),p.z+6,Math.PI,k),0,0,1.6,1.2,1.2,UV.toilet,UV.toilet,UV.rf1,'hip',.35);chunk(p.x,p.z).det.push({park:p});}});
function parkDetail(g,p){const k=bake(p.x,p.z);if(p.kind==='pocket'){const F=FR(p.x,gy(p.x,p.z),p.z,0,k);box(g,F,-.5,0,0,.08,.9,.08,all(UV.play[1]));box(g,F,.5,0,0,.08,.9,.08,all(UV.play[1]));box(g,F,0,.9,0,1.1,.06,.08,all(UV.play[0]));box(g,F,.8,0,.5,.25,.05,.9,all(UV.play[2]));box(g,F,-.9,0,-.6,.9,.22,.3,all(UV.timber));return;}
  [-6.6,6.6].forEach(o=>{const F=FR(p.x+o,gy(p.x+o,p.z),p.z,Math.PI/2,k);[-.5,-.17,.17,.5].forEach((q,i)=>box(g,F,q,0,0,.05,i===0||i===3?1.1:1.6,.05,all(UV.white)));});}

