// ---------- 5. coast towns (north and south): a main street with shops, a loose grid of shacks, cottages and brick houses ----------
const COAST=[];
if(N)N.town.forEach(t=>{if(t.k==='city')return;const r=N.roads.find(r=>r.p.length&&Math.hypot(r.p[r.p.length-1][0]-t.x,r.p[r.p.length-1][1]-t.z)<40);let dir=[0,-1];if(r){const P=r.p,a=P[Math.max(0,P.length-4)],b=P[P.length-1];const l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;dir=[(b[0]-a[0])/l,(b[1]-a[1])/l];}
  const ux=-dir[1],uz=dir[0];COAST.push({name:t.n,R:t.r*1.25,F:(a,b)=>[t.x+ux*a+dir[0]*b,t.z+uz*a+dir[1]*b],mask:(x,z)=>Math.hypot(x-t.x,z-t.z)<t.r*1.3&&N.sd(x,z)>4.5&&N.land(x,z)&&N.cls(x,z)!==2&&N.cls(x,z)!==3,own:true,h:hs(t.x,t.z)});});
if(S)S.SD0.towns.forEach(w=>{const s0=w[1],R={Mandurah:36,Bunbury:36,Albany:34,Busselton:32,Esperance:32}[w[0]]||22;COAST.push({name:w[0],R,F:(a,b)=>S.world(s0+a,b),mask:(x,z)=>{const q=S.st(x,z);return Math.abs(q[0]-s0)<R+2&&Math.abs(q[1])<R+4&&S.sd(x,z)>4.5&&S.land(x,z)&&!S.spurs.some(p=>segDist(x,z,p[0],p[1])<3);},own:false,h:hs(s0,7)});});
function coastTown(t){const mask=t.mask,R=t.R,F=t.F;const Pf=(a,b)=>F(a,b);
  const th=(a,b,da,db)=>{const p=F(a,b),q=F(a+da*.5,b+db*.5);return Math.atan2(q[0]-p[0],q[1]-p[1]);};
  if(t.own){const P=[];for(let a=-R;a<=R;a+=2)P.push(Pf(a,0));const g=P.filter(p=>landAt(p[0],p[1])&&mask(p[0],p[1]));if(g.length>3){addStreet(g,'main');ROUTES.push(g);}}
  // cross streets every 11 units, lots facing them; houses along the main street away from the centre
  const LF2=4.6,LD2=5.2;
  for(let a=-R+6;a<=R-4;a+=2*LD2+SWD+.6){[-1,1].forEach(side=>{const b0=side*(t.own?SWD/2:3),b1=side*R*.95,P=[];for(let b=b0;Math.abs(b)<=Math.abs(b1);b+=side*1.5)P.push(Pf(a,b));const g=[];for(const p of P){if(landAt(p[0],p[1])&&mask(p[0],p[1])&&occ(p[0],p[1])<2&&free(p[0],p[1],-1.3))g.push(p);else break;}
      if(g.length<4)return;addStreet(g,'local');const len=(g.length-1)*1.5;
      for(let tt=1.2+(t.own?0:2);tt+LF2<=len;tt+=LF2){const b=b0+side*(tt+LF2/2);[-1,1].forEach(sx=>{const fp=Pf(a+sx*SWD/2,b);addLot(fp[0],fp[1],th(a,b,-sx,0),LF2,LD2,'coast',false,mask);});}});}
  // the centre on the main street: a short strip of shops each side, a hall, an oval at the edge
  const C={coast:t,name:t.name,F,th,h:t.h};CEN.push(C);}
COAST.forEach(t=>{try{coastTown(t);}catch(e){console.error('owsub coast',t.name,e);}});

// ---------- 6. building it all ----------
// arterials: ribbons, median trees, lamps, junction pads, signals or roundabouts at the crossroads, a few routes for the traffic
ART.forEach(a=>{const P=a.P;addStreet(P,'art');ROUTES.push(P);for(let i=3;i<P.length-3;i+=5){const[x,z]=P[i];if(VX.size&&[...[P[0],P[P.length-1]]].some(q=>Math.hypot(q[0]-x,q[1]-z)<5))continue;plant(x,z,(i/5|0)%3===0?3:2,2.6+hs(x,z)*.6);}
  for(let i=2;i<P.length-2;i+=8){const[x,z]=P[i];const dx=a.h?0:1,dz=a.h?1:0;LAMPS.push([x+dx*2.75,z+dz*2.75,a.h?Math.PI:-Math.PI/2]);}});
VX.forEach(v=>{if(v.arms.length<2)return;const four=v.arms.length>=3;if(v.used&&four){SIGS.push(v);}else if(v.arms.length>=3)STREETS.push({P:[[v.x,v.z]],kind:'rab2'});else STREETS.push({P:[[v.x,v.z]],kind:'pad'});markRect(v.x,v.z,0,6.4,6.4,2);});

// streets into chunk geometry
STREETS.forEach(s=>{const P=s.P;
  if(s.kind==='bulb'){disc(B(P[0][0],P[0][1]),P[0][0],P[0][1],1.75,.07,UV.asph,12);return;}
  if(s.kind==='rab'){const[x,z]=P[0],g=B(x,z);disc(g,x,z,2.1,.075,UV.asph,14);const F=FR(x,gy(x,z)+.07,z,0,bake(x,z));cyl(g,F,0,0,0,.95,.14,12,UV.kerb,UV.island);plant(x,z,3,2.4);return;}
  if(s.kind==='rab2'){const[x,z]=P[0],g=B(x,z);disc(g,x,z,4,.09,UV.asph,18);const F=FR(x,gy(x,z)+.09,z,0,bake(x,z));cyl(g,F,0,0,0,2,.16,16,UV.kerb,UV.island);plant(x,z,13,4.2);plant(x+.9,z+.6,5,2.8);return;}
  if(s.kind==='pad'){const[x,z]=P[0],g=B(x,z);disc(g,x,z,3.2,.09,UV.asph,14);return;}
  const w=s.kind==='art'?6.5:s.kind==='lane'?.8:s.kind==='main'?3:2.5,uv=s.kind==='art'?UV.art:s.kind==='lane'?UV.lane:s.kind==='ramp'?UV.ramp:UV.street,yo=s.kind==='art'?.075:s.kind==='lane'?.045:.06;
  for(let i=0;i<P.length-1;i+=8){const seg=P.slice(i,Math.min(P.length,i+9));const mid=seg[seg.length>>1];strip(B(mid[0],mid[1]),seg,w,uv,yo,s.kind==='art'?2:s.kind==='lane'?.8:1.25);}
  // street trees on the verges and pads at the junctions
  if(s.kind==='local'||s.kind==='main')for(let i=2;i<P.length-1;i+=3){const a=P[i-1],b=P[i],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;const sd=(i/3|0)%2?1:-1,x=b[0]+dz/l*1.05*sd,z=b[1]-dx/l*1.05*sd;if(hs(x,z)<.55&&occ(x,z)<2)plant(x,z,[2,3,1,11][((hs(z,x)*4)|0)],1.6+hs(x,z)*.9);}
  if(s.kind!=='art'&&s.kind!=='lane'&&P.length>1)[P[0],P[P.length-1]].forEach(p=>disc(B(p[0],p[1]),p[0],p[1],1.35,.065,UV.asph,10));});

// signals at the centre crossroads: a zebra slab, four poles with heads (bulbs are one instanced mesh, phases shared with the traffic)
const BULB=[],SIGO=[];
SIGS.forEach((v,si)=>{const x=v.x,z=v.z,g=B(x,z),y=gy(x,z)+.1,F=FR(x,y,z,0,bake(x,z));patch(g,FR(x,0,z,0,bake(x,z)),-3.25,-3.25,3.25,3.25,.1,UV.cross,1,2,2);
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

