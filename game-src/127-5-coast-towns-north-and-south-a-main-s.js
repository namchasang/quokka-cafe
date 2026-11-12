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
// ---- arterial ends (Paul, Nov 2026: no road stops short): an end near a highway runs on to its centre line; two ends facing each other across it
// make a signalised crossroads, one end a T under a junction box; across the railway two ends join (level crossing); a gap to another arterial
// closes; anything else ends in a turning circle ----
const RIBX=[];ROADS.forEach(r=>RIBX.push({P:r.p,w:4}));if(N)N.roads.forEach(r=>RIBX.push({P:r.p,w:r.main?4.4:3.4}));if(S){if(S.road)RIBX.push({P:S.road,w:4.4});(S.spurs||[]).forEach(p=>RIBX.push({P:p,w:3.4}));}
const footOn=(P,x,z)=>{let b=null,bd=1e9,dir=null;for(let i=1;i<P.length;i++){const a=P[i-1],c=P[i],dx=c[0]-a[0],dz=c[1]-a[1],L=dx*dx+dz*dz;if(!L)continue;let t=((x-a[0])*dx+(z-a[1])*dz)/L;t=Math.max(0,Math.min(1,t));const px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;b=[px,pz];const l=Math.sqrt(L);dir=[dx/l,dz/l];}}return{p:b,d:bd,dir};};
const ribNear=(x,z,lim)=>{if(MP&&fwD(x,z)<8)return null;let best=null;for(const r of RIBX){const f=footOn(r.P,x,z);if(f.p&&f.d<lim&&(!best||f.d<best.d))best=Object.assign(f,{w:r.w});}return best;};
const AJ=[];O.subArtJoins=AJ;const landRun=(a,b)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let t=0;t<=L;t+=.5){const x=a[0]+(b[0]-a[0])*t/(L||1),z=a[1]+(b[1]-a[1])*t/(L||1);if(!landAt(x,z)&&H(x,z)<0)return false;}return true;};
{const ends=[];ART.forEach(a=>{const P=a.P;[[0,1],[P.length-1,P.length-2]].forEach(([i,j])=>{const e=P[i],q=P[j],l=Math.hypot(e[0]-q[0],e[1]-q[1])||1;ends.push({a,first:i===0,e,d:[(e[0]-q[0])/l,(e[1]-q[1])/l]});});});
  const vxOf=p=>{const vi=Math.round((p[0]-GX0)/CX),vj=Math.round((p[1]-GZ0)/CZ);return Math.hypot(p[0]-(GX0+vi*CX),p[1]-(GZ0+vj*CZ))<.6?VX.get(vk(vi,vj)):null;};
  const ext=(E,to)=>{const P=E.a.P,L=Math.hypot(to[0]-E.e[0],to[1]-E.e[1]),n=Math.max(1,Math.ceil(L)),add=[];for(let k=1;k<=n;k++)add.push([E.e[0]+(to[0]-E.e[0])*k/n,E.e[1]+(to[1]-E.e[1])*k/n]);if(E.first)P.unshift(...add.reverse());else P.push(...add);E.done=1;};
  // the ends that will get freeway ramps (same rule as the ramps below)
  const RMP=[];ART.forEach(a=>{[a.P[0],a.P[a.P.length-1]].forEach(p=>{if(!MP||p[1]>0||p[1]<-235||RMP.some(r=>Math.hypot(r[0]-p[0],r[1]-p[1])<20))return;if(fwD(p[0],p[1])>12)return;RMP.push(p);});});
  ends.forEach(E=>{const v=vxOf(E.e);if(v&&v.arms.length>=2){E.done=1;return;}if(RMP.includes(E.e)){E.done=1;E.ramp=1;}});
  // pairs facing each other across a short gap (a railway, a highway, a town edge): join them
  ends.forEach(E=>{if(E.done)return;const F=ends.find(F=>F!==E&&!F.done&&F.a.h===E.a.h&&Math.hypot(F.e[0]-E.e[0],F.e[1]-E.e[1])<16&&(F.e[0]-E.e[0])*E.d[0]+(F.e[1]-E.e[1])*E.d[1]>0&&Math.abs((F.e[0]-E.e[0])*E.d[1]-(F.e[1]-E.e[1])*E.d[0])<.6);if(!F)return;if(MP&&fwD((E.e[0]+F.e[0])/2,(E.e[1]+F.e[1])/2)<8)return;if(nearTown((E.e[0]+F.e[0])/2,(E.e[1]+F.e[1])/2,0))return;if(!landRun(E.e,F.e))return;
    const mid=[(E.e[0]+F.e[0])/2,(E.e[1]+F.e[1])/2],rb=ribNear(mid[0],mid[1],3);ext(E,mid);ext(F,mid);if(rb){AJ.push({x:rb.p[0],z:rb.p[1],four:1,w:rb.w});}else AJ.push({x:mid[0],z:mid[1],join:1});});
  // one end running on to a highway
  ends.forEach(E=>{if(E.done)return;let hit=null;for(let t=.5;t<=9&&!hit;t+=.5){const x=E.e[0]+E.d[0]*t,z=E.e[1]+E.d[1]*t;if(!landAt(x,z)&&rdD(x,z,0)>3)break;const rb=ribNear(x,z,.9);if(rb)hit=rb;}
    if(hit&&landRun(E.e,hit.p)){ext(E,hit.p);AJ.push({x:hit.p[0],z:hit.p[1],w:hit.w,dir:hit.dir,from:E.d});}});
  // what is left ends in a turning circle
  ends.forEach(E=>{if(E.done)return;STREETS.push({P:[E.e.slice()],kind:'abulb'});AJ.push({x:E.e[0],z:E.e[1],bulb:1});});
  // highway crossings: two arterials meeting one point make a signalised crossroads; one makes a T under a junction box
  const T=AJ.filter(j=>j.w&&!j.four);T.forEach(j=>{if(j.used)return;const k=T.find(q=>q!==j&&!q.used&&Math.hypot(q.x-j.x,q.z-j.z)<5);if(k){k.used=j.used=1;AJ.push({x:(j.x+k.x)/2,z:(j.z+k.z)/2,four:1,w:j.w});}});
  // an arterial end on another arterial between grid corners: a junction box
  ART.forEach(a=>{[a.P[0],a.P[a.P.length-1]].forEach(e=>{if(vxOf(e))return;for(const b of ART){if(b===a)continue;const f=footOn(b.P,e[0],e[1]);if(f.p&&f.d<3.3&&Math.hypot(f.p[0]-b.P[0][0],f.p[1]-b.P[0][1])>3&&Math.hypot(f.p[0]-b.P[b.P.length-1][0],f.p[1]-b.P[b.P.length-1][1])>3){AJ.push({x:f.p[0],z:f.p[1],abox:1});STREETS.push({P:[f.p.slice()],kind:'pad'});break;}}});});
  AJ.forEach(j=>{if(j.four){if(SIGS.some(v=>Math.hypot(v.x-j.x,v.z-j.z)<8))return;SIGS.push({x:j.x,z:j.z,arms:[],used:1,rib:1});markRect(j.x,j.z,0,6.4,6.4,2);}
    else if(j.w&&!j.used){STREETS.push({P:[[j.x,j.z]],kind:'tee',w:j.w});markRect(j.x,j.z,0,6.4,6.4,2);}});}
KWST.forEach(a=>{addStreet(a.P,'main');ROUTES.push(a.P);});ART.forEach(a=>{const P=a.P;addStreet(P,'art');ROUTES.push(P);for(let i=3;i<P.length-3;i+=5){const[x,z]=P[i];if(VX.size&&[...[P[0],P[P.length-1]]].some(q=>Math.hypot(q[0]-x,q[1]-z)<5))continue;plant(x,z,(i/5|0)%3===0?3:2,2.6+hs(x,z)*.6);}
  for(let i=2;i<P.length-2;i+=8){const[x,z]=P[i];const dx=a.h?0:1,dz=a.h?1:0;LAMPS.push([x+dx*2.75,z+dz*2.75,a.h?Math.PI:-Math.PI/2]);}});
VX.forEach(v=>{if(v.arms.length<2)return;const four=v.arms.length>=3;if(v.used&&four){SIGS.push(v);}else if(v.arms.length>=3)STREETS.push({P:[[v.x,v.z]],kind:'rab2',v});else STREETS.push({P:[[v.x,v.z]],kind:'pad',v});markRect(v.x,v.z,0,6.4,6.4,2);});

