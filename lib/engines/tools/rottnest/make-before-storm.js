(()=>{const d=__ED.doc,H=__ED.H,log=[];let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647,pick=a=>a[Math.floor(rnd()*a.length)];
const KS=BuildingKit.create({scene:new THREE.Scene(),heightAt:()=>0}),GC={};
const grp=(s,sign)=>{const k=s+'|'+(sign||'');if(GC[k])return GC[k];const G=KS.build({style:s,sign:sign||undefined});G.scale.setScalar(.75);G.updateMatrixWorld(true);return GC[k]=G;};
const placed=H.fps().map(e=>({x:e.x,z:e.z,r:e.r,F:e.F}));
const ok=(s,x,z,r,G)=>{const w=H.why({k:'build',p:s,x,z,r,G});if(w)return false;const F=H.realFoot(G),me={x,z,r,F};return !placed.some(q=>H.obbHit(me,q,.4));};
const add=(s,x,z,r,sign)=>{const G=grp(s,sign);if(!ok(s,x,z,r,G))return false;d.bld.push({s,x:+x.toFixed(2),z:+z.toFixed(2),r:+r.toFixed(3),...(sign?{sign}:{})});placed.push({x,z,r,F:H.realFoot(G)});return true;};
const SHOPS=[['shop','GENERAL STORE'],['kiosk','GELATO'],['shop','BAKERY'],['strip','FISH & CHIPS'],['kiosk','BIKE HIRE'],['mallshop','BOOKS'],['shop','SURF SHOP'],['cafe','SEA BREEZE'],['pub','THE ANCHOR'],['kiosk','ICE CREAM']];
const HOUSES=['islandcottage','islandcottage','cottage','cabin','house','bungalow','units','terrace'];
// along the road: every 3 units, both sides
const P=d.roads[0].pts;let nS=0,nH=0;
for(let k=1;k<P.length;k++){const a=P[k-1],b=P[k],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L,uz=(b[1]-a[1])/L;for(let t=2;t<L;t+=2.5)for(const side of[1,-1])for(const off of[5,7,9]){const x=a[0]+ux*t-uz*side*off,z=a[1]+uz*t+ux*side*off;
  const east=x>15,isShop=east&&rnd()<.6;let s,sign;if(isShop){[s,sign]=SHOPS[nS%SHOPS.length];}else s=pick(HOUSES);const G=grp(s,sign);const sn=H.snapLot(x,z,G,'');if(!sn)continue;if(add(s,sn.x,sn.z,sn.r,sign)){if(isShop)nS++;else nH++;}}}
log.push('road shops '+nS+' houses '+nH);
// holiday houses facing the sea, anywhere on the island
let nB=0;for(let i=0;i<8000&&nB<30;i++){const x=-110+rnd()*220,z=-50+rnd()*100;const q=H.seaFace(x,z);if(q==null)continue;const r=Math.round(q/(Math.PI/2))*Math.PI/2,s=pick(['islandcottage','cabin','house','cottage']);const h=2.5,X=Math.round(x/h)*h,Z=Math.round(z/h)*h;if(add(s,X,Z,r))nB++;}
log.push('beach houses '+nB);
/* inland cottages along the footpaths and in clusters */let nI=0;for(let i=0;i<25000&&nI<60;i++){const x=-110+rnd()*220,z=-50+rnd()*100,h=2.5,X=Math.round(x/h)*h,Z=Math.round(z/h)*h,r=Math.floor(rnd()*4)*Math.PI/2;if(add(pick(HOUSES),X,Z,r))nI++;}log.push('inland '+nI);
// decor
const D=(k,n,near,rad,tries)=>{let c=0;for(let i=0;i<(tries||600)&&c<n;i++){const x=near?near[0]+(rnd()*2-1)*rad:-110+rnd()*220,z=near?near[1]+(rnd()*2-1)*rad:-50+rnd()*100,r=Math.round(rnd()*4)*Math.PI/2;if(!H.why({k:'decor',p:k,x,z,r})){d.props.push({k,x:+x.toFixed(2),z:+z.toFixed(2),r:+r.toFixed(3)});c++;}}return c;};
__ED.rebuild(['bld']);
const j=d.props.find(p=>p.k==='jetty'),J=[j.x-6,j.z];
log.push('decor '+[D('fishstall',2,J,12),D('cafeset',5,[40,-15],25),D('bikerepair',1,[30,-12],20),D('playground',2,null),D('gardenplot',8,null),D('picnic',10,null),D('umbrella',14,null),D('bench',12,null),D('lamp',16,[20,-10],60),D('planter',10,[40,-15],30),D('bikerack',4,[35,-12],25)].join(','));
// trees
let nt=0;for(let i=0;i<3000&&nt<130;i++){const x=-110+rnd()*220,z=-50+rnd()*100;if(!H.why({k:'nature',p:'gum',x,z})&&H.Hg(x,z)>.8){d.trees.push({k:pick(['pine','pine','gum','pepper','palm']),x:+x.toFixed(2),z:+z.toFixed(2)});nt++;}}log.push('trees +'+nt);
// boats and bikes
[['speedboat',j.x+6,j.z+4],['fishingboat',j.x+14,j.z-3.5],['yacht',j.x+20,j.z+5],['kayak',j.x+4,j.z-6]].forEach(([k,x,z])=>{if(!H.why({k:'veh',p:k,x,z}))d.veh.push({k,x,z,r:0,go:false});});
for(let i=0;i<4;i++){const p=P[1+i%(P.length-1)];d.veh.push({k:'bike',x:p[0],z:p[1],r:0,go:true});}
d.name='Rottnest Island (before the storm)';d.life=Object.assign(d.life,{walker:30,jogger:6,cyclist:10,picnic:6,sunbather:10,swimmer:8,boat:5,kayak:4,sitter:8});d.ver=1;d.money=0;
__ED.rebuild();
const F=H.fps();let ov=0;for(let a=0;a<F.length;a++)for(let b=a+1;b<F.length;b++)if(H.obbHit(F[a],F[b],0))ov++;log.push('bld '+d.bld.length+' overlaps '+ov);
window.__OUT=JSON.stringify(d);return JSON.stringify(log);})()
