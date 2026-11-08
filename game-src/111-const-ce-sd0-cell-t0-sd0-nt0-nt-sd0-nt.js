  const CE=SD0.CELL,T0=SD0.NT0,NT=SD0.NT,NR=SD0.NR,LA=SD0.LA,RR=SD0.R,LC=SD0.LC,SE=LA+RR*Math.PI/2+LC,PX=300,PZ=WZ,T1=T0+NT*CE;
  const NC=NT+1,NRW=NR+1,NN=NC*NRW,HB=new Float32Array(NN),LN=new Uint8Array(NN);{const b=atob(SD0.b64);for(let i=0;i<NN;i++){const v=b.charCodeAt(i);LN[i]=v?1:0;HB[i]=v*.025;}}
  const bfs=src=>{const D=new Float32Array(NN).fill(1e9),q=new Int32Array(NN);let n=0;for(let i=0;i<NN;i++)if(src(i)){D[i]=0;q[n++]=i;}
    for(let h=0;h<n;h++){const i=q[h],c=i%NC,r=(i/NC)|0,d=D[i]+1;if(c>0&&D[i-1]>d){D[i-1]=d;q[n++]=i-1;}if(c<NC-1&&D[i+1]>d){D[i+1]=d;q[n++]=i+1;}if(r>0&&D[i-NC]>d){D[i-NC]=d;q[n++]=i-NC;}if(r<NRW-1&&D[i+NC]>d){D[i+NC]=d;q[n++]=i+NC;}}return D;};
  const DLs=bfs(i=>!LN[i]),DWs=bfs(i=>LN[i]===1),SDs=new Float32Array(NN);
  for(let i=0;i<NN;i++){if(LN[i])SDs[i]=(DLs[i]-.5)*CE;else{SDs[i]=-(DWs[i]-.5)*CE;HB[i]=-.8-Math.min(DWs[i]*CE,12)*.12;}}
  const CX=PX+RR,CZ=PZ+LA;
  const st=(x,z)=>{if(z<CZ)return[z-PZ,x-PX];if(x<CX){const vx=x-CX,vz=z-CZ,r=Math.hypot(vx,vz);const th=Math.max(0,Math.min(Math.PI/2,Math.atan2(vz,-vx)));return[LA+RR*th,RR-r];}return[LA+RR*Math.PI/2+(x-CX),(CZ+RR)-z];};
  const world=(s,t)=>{if(s<=LA)return[PX+t,PZ+s];const a=LA+RR*Math.PI/2;if(s<a){const th=(s-LA)/RR,r=RR-t;return[CX-Math.cos(th)*r,CZ+Math.sin(th)*r];}return[CX+(s-a),CZ+RR-t];};
  const bil=(A,s,t)=>{let i=(t-T0)/CE,r=s/CE;i=Math.max(0,Math.min(NC-1.001,i));r=Math.max(0,Math.min(NRW-1.001,r));const i0=i|0,r0=r|0,fx=i-i0,fz=r-r0,k=r0*NC+i0;return(A[k]*(1-fx)+A[k+1]*fx)*(1-fz)+(A[k+NC]*(1-fx)+A[k+NC+1]*fx)*fz;};
  const edgeH=x=>{x=Math.max(0,Math.min(WX-1.001,x));const x0=x|0,f=x-x0,k=(WZ-1)*WX+x0;return HG[k]*(1-f)+HG[k+1]*f;};
  const inside=(s,t)=>s>=0&&s<=SE&&t>=T0&&t<=T1;
  const sH=(x,z)=>{const[s,t]=st(x,z);if(!inside(s,t))return -3;const h=bil(HB,s,t);if(s<30){const k=ss(0,30,s);return edgeH(x)*(1-k)+h*k;}return h;};
  const SP=[];// spur roads [[x,z],[x,z]]
  SOUTH={SD0,CE,T0,T1,NT,NR,NC,NRW,LA,RR,LC,SE,PX,PZ,CX,CZ,st,world,bil,inside,data:{LN,HB,SDs},spurs:SP,
    H:sH,sd:(x,z)=>{const[s,t]=st(x,z);return inside(s,t)?bil(SDs,s,t):-20;},
    land:(x,z)=>{const[s,t]=st(x,z);return s>-.5&&s<SE-1&&t>T0+1&&t<T1-1&&(s<1?LAND[Math.min(WZ-1,z|0)*WX+Math.max(0,Math.min(WX-1,x|0))]===1:bil(SDs,s,t)>0);},
    onRoad:(x,z,w)=>{const[s,t]=st(x,z);if(s>=-1&&s<=SE&&Math.abs(t)<w)return true;for(const p of SP)if(segDist(x,z,p[0],p[1])<w)return true;return false;},
    km:s=>{const K=SD0.km;let i=1;while(i<K.length-1&&K[i][0]<s)i++;const a=K[i-1],b=K[i],f=Math.max(0,Math.min(1.2,(s-a[0])/((b[0]-a[0])||1)));return Math.round(a[1]+(b[1]-a[1])*f);}};}
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
  const r=N.roadAt(x,z,2.8);if(r){const km=Math.round(N.KM(N.sOf(x,z))),nx=N.dest.find(d=>d.km>km+1);return[r.main?(z>-875?'Mitchell Fwy · Wanneroo Rd':'Indian Ocean Drive'):r.n,nx?`${km} km from Perth · ${nx.n} ${nx.km-km} km`:'Driving the coast road'];}
  return [['Beach','Indian Ocean'],['Beach','Soft sand and shells'],['White sand dunes',''],['The Pinnacles',''],['Coastal heath','Banksia, grass trees and wildflowers'],['Banksia scrub','Grass trees and banksias'],['Paddocks','Dry grass and old gums'],['Town',''],['Northern suburbs','Lawns, pools and wide streets']][c]||null;};

// ---------- roads and the railway ----------
const CBDP=G(115.858,-31.953),FRP=G(115.748,-32.054),KPP=G(115.833,-31.961);
const ROADS=[
 {n:'Stirling Hwy',p:[G(115.752,-32.047),G(115.758,-32.03),G(115.763,-32.005),G(115.77,-31.985),G(115.79,-31.981),G(115.81,-31.979),G(115.822,-31.972),G(115.835,-31.965),G(115.852,-31.955)]},
 {n:'Canning Hwy',p:[G(115.757,-32.04),G(115.775,-32.035),G(115.8,-32.025),G(115.83,-32.01),G(115.85,-31.99),G(115.865,-31.978),G(115.879,-31.966)]},
 {n:'Kwinana Fwy',p:[G(115.852,-31.955),G(115.85,-31.962),G(115.851,-31.968),G(115.855,-31.985),G(115.857,-32.01),G(115.858,-32.07)]},
 {n:'Riverside Dr',p:[G(115.852,-31.958),G(115.865,-31.96),G(115.879,-31.962)]},
 {n:'Great Eastern Hwy',p:[G(115.879,-31.962),G(115.89,-31.957),G(115.915,-31.95),G(115.94,-31.945),G(115.965,-31.942)]},
 {n:'Albany Hwy',p:[G(115.884,-31.966),G(115.896,-31.978),G(115.91,-31.995),G(115.93,-32.02)]},
 {n:'Leach Hwy',p:[G(115.775,-32.035),G(115.8,-32.045),G(115.84,-32.05),G(115.857,-32.05)]}];
if(NORTH)ROADS.push(NORTH.cityRoad);// the coast road's first stretch through the city
const RAIL=[G(115.747,-32.053),G(115.754,-32.036),G(115.758,-31.995),G(115.785,-31.98),G(115.823,-31.948),G(115.861,-31.951),G(115.9,-31.94),G(115.94,-31.937),G(115.967,-31.938)];
const segDist=(px,pz,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],L=dx*dx+dz*dz;let t=L?((px-a[0])*dx+(pz-a[1])*dz)/L:0;t=Math.max(0,Math.min(1,t));return Math.hypot(px-(a[0]+dx*t),pz-(a[1]+dz*t));};
const onRoad=(x,z,w=2.4)=>(z<80&&NORTH&&NORTH.onRoad(x,z,w))||(z>WZ-12&&SOUTH&&SOUTH.onRoad(x,z,w))||ROADS.some(r=>r.p.some((a,i)=>i&&segDist(x,z,r.p[i-1],a)<w));
const deckH=(x,z)=>Math.max(H(x,z),1.4);// bridges carry the road over the water
const groundAt=(x,z)=>onRoad(x,z,2.6)?deckH(x,z):Math.max(H(x,z),-.2);
let BLOCK=null;const canGo=(x,z)=>(landAt(x,z)&&!(BLOCK&&BLOCK[(z|0)*WX+(x|0)]))||onRoad(x,z,2.4);
