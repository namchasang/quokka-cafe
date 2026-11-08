function openTours(){openTravel('Day tours','Siam Sydney Services · Tudor Lane',TOURS.map(t=>({id:t.id,name:t.name,note:t.note+' · back by evening',fare:t.price,btn:'Book',ride:()=>startTour(t.id)})),'Book a day tour with a local guide. The van leaves from Tudor Lane and brings you back here by evening.');}
let TOUR=null;
function startTour(id){if(transit||VISIT)return;const T=TOURS.find(t=>t.id===id);transit=true;fadeTarget=.95;toast('The tour van leaves Tudor Lane…',2);
  setTimeout(()=>{let ov=document.getElementById('tourOv');if(!ov){ov=document.createElement('div');ov.id='tourOv';ov.innerHTML='<iframe id="tourFr" title="Day tour"></iframe><div id="tourTop"><b id="tourName"></b><span id="tourSub"></span></div><div id="tourSay"></div><div id="tourBtns"><button type="button" class="btn ghost" id="tourNext">Next</button><button type="button" class="btn ghost" id="tourCard">Keep a postcard</button><button type="button" class="btn" id="tourBack">Back to Perth</button></div>';
      const st=document.createElement('style');st.textContent='#tourOv{position:fixed;inset:0;z-index:72;background:#141a2e}#tourFr{position:absolute;inset:0;width:100%;height:100%;border:0}#tourTop{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));left:max(10px,env(safe-area-inset-left,0px));background:rgba(20,26,46,.84);border:2px solid #3a4670;border-radius:8px;padding:8px 12px;color:#f5ecd8;max-width:70vw}#tourTop b{display:block;font-family:"Pixelify Sans",monospace;color:#ffd34d;font-size:18px}#tourTop span{font-size:12px;color:#a9b3cf}#tourBtns .btn{padding:8px 12px;font-size:14px;white-space:nowrap}#tourBtns .btn.ghost{background:rgba(20,26,46,.92);color:#f5ecd8;border-color:#3a4670}#tourSay{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(72px + env(safe-area-inset-bottom,0px));width:min(560px,calc(100vw - 32px));background:rgba(20,26,46,.9);border:2px solid #3a4670;border-radius:8px;padding:10px 14px;color:#f5ecd8;font-size:15px;line-height:1.4}#tourBtns{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));display:flex;gap:6px;flex-wrap:nowrap;justify-content:center;width:calc(100vw - 20px)}';
      document.head.appendChild(st);document.body.appendChild(ov);
      document.getElementById('tourNext').onclick=()=>{if(!TOUR)return;TOUR.i=(TOUR.i+1)%TOUR.T.guide.length;document.getElementById('tourSay').textContent=TOUR.T.guide[TOUR.i];};
      document.getElementById('tourCard').onclick=()=>{if(!TOUR)return;S.tourCards=S.tourCards||{};if(S.tourCards[TOUR.T.id]){toast('You already have this postcard',2);return;}S.tourCards[TOUR.T.id]=S.day||1;save();toast('Postcard kept: '+TOUR.T.name,2.4);};
      document.getElementById('tourBack').onclick=()=>endTour();}
    TOUR={T,i:0};overlay='tour';ui.hud.hidden=true;ui.act.hidden=true;ov.hidden=false;
    document.getElementById('tourName').textContent='Day tour · '+T.name;document.getElementById('tourSub').textContent='Siam Sydney Services · '+T.note;document.getElementById('tourSay').textContent=T.guide[0];
    const fr=document.getElementById('tourFr');const gold=S.time%1440>16*60;fr.srcdoc=TOUR_PAGE.replace("let cur='freo',time='day'","let cur='"+T.id+"',time='"+(gold?'gold':'day')+"'");
    transit=false;fadeTarget=0;S.tours=S.tours||{};S.tours[T.id]=(S.tours[T.id]||0)+1;save();},900);}
function endTour(){if(!TOUR)return;const T=TOUR.T;TOUR=null;transit=true;fadeTarget=.95;
  setTimeout(()=>{const ov=document.getElementById('tourOv');if(ov){ov.hidden=true;document.getElementById('tourFr').srcdoc='';}overlay=null;ui.hud.hidden=false;ui.act.hidden=false;
    S.time+=T.hrs*60;const [x,z]=hqTpSpot(TOUR_DESK.x+.6,TOUR_DESK.z);player.x=x;player.z=z;updateCamera(0,true);fadeTarget=0;transit=false;toast('Back in Tudor Lane after a day at '+T.name,2.6);save();},700);}
{const _h4=hideOverlays;hideOverlays=function(){if(TOUR&&!TOUR.trip){TOUR=null;const ov=document.getElementById('tourOv');if(ov){ov.hidden=true;document.getElementById('tourFr').srcdoc='';}}_h4();};}
{const _tt=cbdTargets;cbdTargets=function(T){_tt(T);let zq;try{zq=zoneOf(player.x);}catch(e){return;}if(zq!=='cbd')return;T.push({x:TOUR_DESK.x+.5,z:TOUR_DESK.z,r:1.2,label:'Siam Sydney Services · day tours',act:()=>openTours()});};}
// ---------- Day trip: The Pinnacles (Look Lab ?trip, Paul Nov 2026, built from Paul's own photos) ----------
// A golden sand plain with about two thousand limestone spires (shapes sculpted in Blender, ambient occlusion baked per vertex),
// the one-way desert loop edged with lines of small stones, the Discovery Centre with its lookout deck, the Desert View walk trail
// through the heath, interpretive boards, emus at dusk, kangaroos in the heath, tourists and cars on the loop, and the tour van.
var TRIP_BUILD=TRIP_BUILD||{};
TRIP_BUILD.pin=function(G,K){
const X1=1000,X2=1120,Z1=-45,Z2=45;
const R=mulberry32(1302),rr=(a,b)=>a+(b-a)*R(),pick=a=>a[(R()*a.length)|0];
const cl=(v,a,b)=>v<a?a:v>b?b:v,ss=t=>{t=cl(t,0,1);return t*t*(3-2*t);};
const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
const put=(geo,mat,x,y,z,o)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(...o.s);}
  m.castShadow=!(o&&o.nc);m.receiveShadow=true;m.__pxSkip=1;((o&&o.to)||G).add(m);return m;};
const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),CY=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||8);
const cvs=(W,H)=>{const c=mk(W,H);return[c,c.getContext('2d')];};
const texM=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({map:ctex(c)},o||{}));
const hx=(h,f)=>{const n=parseInt(h.slice(1),16);return'rgb('+Math.min(255,((n>>16)&255)*f|0)+','+Math.min(255,((n>>8)&255)*f|0)+','+Math.min(255,(n&255)*f|0)+')';};
const ph=(a,b,s)=>{let h=(a*374761393+b*668265263+(s|0)*2246822519)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;};
// value noise that repeats every P cells (for seamless tiles)
const pn=(x,y,s,P,seed)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s),fx=x/s-gx,fy=y/s-gy,w=v=>((v%P)+P)%P,a=ph(w(gx),w(gy),seed),b=ph(w(gx+1),w(gy),seed),c=ph(w(gx),w(gy+1),seed),d=ph(w(gx+1),w(gy+1),seed),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;};
const nz=(x,z,s,seed)=>pn(x,z,s,1e6,seed);
const PIN={G,K,mats:[],npcs:[],roos:[],emus:[],cars:[],read:{},glowM:[],sandM:null};window.__pin=PIN;
// ===== the land: gentle dunes, a low rise for the Discovery Centre, a flat car park =====
const DUNES=[[1078,-17,12,9,3.2],[1050,-31,14,8,2.0],[1099,7,12,10,2.4],[1036,-3,9,8,1.2],[1066,19,12,7,1.4],[1112,-35,10,10,2.8],
  [1007,-19,8,8,3.8],[1111,25,10,9,2.2],[1022,-35,12,8,2.4],[1088,35,14,7,1.6],[1004,6,6,10,1.6],[1060,-42,18,6,2.4],[1118,-6,6,12,2.2]];
const CEN={x1:1006,x2:1018.4,z1:27.6,z2:34.4},DECK={x1:1018.4,x2:1027,z1:25.4,z2:33},CP={x1:1031,x2:1049,z1:30.4,z2:41};
const FLATS=[[1005,1028,25,36.5,1.4,7],[CP.x1,CP.x2,CP.z1,CP.z2,.5,6]];
function rawH(x,z){let h=0;for(const [cx,cz,rx,rz,a] of DUNES){const dx=(x-cx)/rx,dz=(z-cz)/rz,d=dx*dx+dz*dz;if(d<5)h+=a*Math.exp(-d*1.3);}
  h+=.16*Math.sin(x*.21+z*.07)*Math.sin(z*.17-x*.05)+.1*Math.sin(x*.47+z*.31)+.25*(nz(x,z,7,4)-.5);
  for(const [a,b,c,d,fh,bl] of FLATS){const px=Math.max(a-x,0,x-b),pz=Math.max(c-z,0,z-d),t=1-ss(Math.hypot(px,pz)/bl);h=h*(1-t)+fh*t;}
  return h;}
const HG={x0:X1-12,z0:Z1-10,s:.5,nx:0,nz:0,a:null};HG.nx=Math.round((X2-X1+24)/HG.s)+1;HG.nz=Math.round((Z2-Z1+20)/HG.s)+1;HG.a=new Float32Array(HG.nx*HG.nz);
for(let j=0;j<HG.nz;j++)for(let i=0;i<HG.nx;i++)HG.a[j*HG.nx+i]=rawH(HG.x0+i*HG.s,HG.z0+j*HG.s);
function H(x,z){let fx=(x-HG.x0)/HG.s,fz=(z-HG.z0)/HG.s;fx=cl(fx,0,HG.nx-1.001);fz=cl(fz,0,HG.nz-1.001);const i=fx|0,j=fz|0,u=fx-i,v=fz-j,A=HG.a,n=HG.nx,k=j*n+i;
  return(A[k]*(1-u)+A[k+1]*u)*(1-v)+(A[k+n]*(1-u)+A[k+n+1]*u)*v;}
K.h=H;PIN.H=H;
