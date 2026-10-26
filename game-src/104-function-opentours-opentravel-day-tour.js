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
{const _h4=hideOverlays;hideOverlays=function(){if(TOUR){TOUR=null;const ov=document.getElementById('tourOv');if(ov){ov.hidden=true;document.getElementById('tourFr').srcdoc='';}}_h4();};}
{const _tt=cbdTargets;cbdTargets=function(T){_tt(T);let zq;try{zq=zoneOf(player.x);}catch(e){return;}if(zq!=='cbd')return;T.push({x:TOUR_DESK.x+.5,z:TOUR_DESK.z,r:1.2,label:'Siam Sydney Services · day tours',act:()=>openTours()});};}
// ---------- TEX3 on Rottnest: soft shade at the foot of every wall, and painted vehicles ----------
/* ==== PXKIT: pixel-art building parts (3d shapes, pixel skins) · Paul Oct 2026 ====
   One kit for walls, roofs, windows, doors and trims. Every painter draws at PXK.PPM pixels per metre
   (32 = the original sprite pixel size), so a wall 3 m wide is 96 px and matches the people and plants.
   PXK.wall(w,h,{base,kind,win,door,quoins,plinth,cornice,moss,ivy,seed}) -> canvas
   PXK.roof(w,h,{base,kind:'tile'|'slate'|'tin',seed,across}) -> canvas (rows run along x unless across)
   PXK.window(lit) / PXK.door(col) -> small canvases for separate panes
   Colours: give the building's own colour as base; the kit lights the tops and shades the bottoms of every block. */
var PXK=(function(){
const PPM=32;
let S=1;const rnd=()=>(S=(S*16807)%2147483647)/2147483647,seed=s=>{S=(s|0)%2147483646+1;};
const rgb=c=>{if(Array.isArray(c))return c;if(c[0]==='r')return c.match(/\d+/g).slice(0,3).map(Number);const n=parseInt(c.replace('#',''),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const sh=(c,f)=>{const a=rgb(c);return`rgb(${Math.min(255,a[0]*f|0)},${Math.min(255,a[1]*f|0)},${Math.min(255,a[2]*f|0)})`;};
const mix=(a,b,t)=>{a=rgb(a);b=rgb(b);return'#'+[0,1,2].map(i=>Math.round(a[i]+(b[i]-a[i])*t).toString(16).padStart(2,'0')).join('');};
const lum=c=>{const a=rgb(c);return(a[0]*.3+a[1]*.59+a[2]*.11)/255;};
function cv(w,h){const c=document.createElement('canvas');c.width=Math.max(2,w|0);c.height=Math.max(2,h|0);const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x];}
const P=(x,c,X,Y,W=1,H=1)=>{x.fillStyle=c;x.fillRect(X|0,Y|0,W|0,H|0);};
const INK='#2a2230';
/* --- surfaces --- */
function blocks(x,W,H,base,{rowH=7,minW=10,varW=8,mortar=.62,y0=0,h1=H}={}){P(x,sh(base,mortar),0,y0,W,h1-y0);let y=y0,row=0;
  while(y<h1){const bh=Math.min(rowH+(row%2),h1-y);let X=-((row*5)%9);while(X<W){const bw=minW+(rnd()*varW|0),f=.9+rnd()*.15;P(x,sh(base,f),X+1,y+1,bw-1,bh-1);P(x,sh(base,f*1.1),X+1,y+1,bw-1,1);P(x,sh(base,f*.86),X+1,y+bh-1,bw-1,1);
    if(rnd()<.22)P(x,sh(base,f*.8),X+2+(rnd()*(bw-4)|0),y+2+(rnd()*Math.max(1,bh-4)|0));X+=bw;}y+=bh;row++;}}
function plaster(x,W,H,base){P(x,base,0,0,W,H);for(let i=0;i<W*H/9;i++){const f=rnd()<.5?.95:1.04;P(x,sh(base,f),rnd()*W,rnd()*H);}
  for(let i=0;i<W/18;i++){const X=rnd()*W|0,Y=rnd()*H*.8|0;for(let k=0;k<4;k++)P(x,sh(base,.9),X+k,Y+(k>>1));}}
function weatherboard(x,W,H,base){for(let y=0;y<H;y+=5){const f=.94+rnd()*.08;P(x,sh(base,f),0,y,W,5);P(x,sh(base,f*1.12),0,y,W,1);P(x,sh(base,f*.72),0,y+4,W,1);}}
function bricks(x,W,H,base){P(x,sh(base,.6),0,0,W,H);for(let y=0,r=0;y<H;y+=4,r++)for(let X=-(r%2)*4;X<W;X+=8){const f=.86+rnd()*.24;P(x,sh(base,f),X+1,y+1,7,3);P(x,sh(base,f*1.12),X+1,y+1,7,1);}}
function moss(x,W,H,amt=1){for(let i=0;i<W*1.3*amt;i++){const X=rnd()*W|0,Y=H-1-(Math.pow(rnd(),2.2)*H*.26|0);P(x,rnd()<.5?'#5d7a3a':'#7a9a48',X,Y);}}
function ivy(x,X0,W,H){const top=H*(.35+rnd()*.35);for(let i=0;i<W*H*.08;i++){const X=X0+rnd()*W|0,Y=H-(Math.pow(rnd(),.8)*(H-top))|0;const c=['#3f7a34','#5a9a40','#2f6a2e','#78b050'][rnd()*4|0];P(x,c,X,Y,2,2);if(rnd()<.3)P(x,'#9ad060',X,Y);}}
